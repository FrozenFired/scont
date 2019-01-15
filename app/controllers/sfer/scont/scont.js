let Index = require('../index')
let SctRelate = require('./sctRelate')

let Scont = require('../../../models/scont/scont')
let Brand = require('../../../models/scont/brand')
let Vendor = require('../../../models/scont/vendor')

let Bcateg = require('../../../models/scont/bcateg')
let Nation = require('../../../models/scont/nation')

let Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let _ = require('underscore')

let moment = require('moment');


exports.scontsFilter = function(req, res, next) {
	let title = 'scont List';
	let url = "/scontList";

	// 分页
	let slipCond = ""; // 分页时用到的其他条件

	let page = 0, entry = 10;
	[entry, page, slipCond] = Filter.slipPage(req, entry, slipCond)
	let index = page * entry;

	// 条件判断   ----------------
	// 查找关键字
	let keytype = "scont", keyword = "";
	[keytype, keyword, slipCond] = Filter.key(req, keytype, keyword, slipCond)

	// 根据状态筛选
	let condStatus = Object.keys(Conf.stsScont);
	// let condStatus = 0;
	[condStatus, slipCond] = Filter.status(req.query.status, condStatus, slipCond);

	// 根据创建更新时间筛选
	let at = Filter.at(req);
	slipCond+=at.slipCond;

	Scont.count({
		[keytype]: new RegExp(keyword + '.*'),
		'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
		'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
		'status': condStatus  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);
		Scont.find({
			[keytype]: new RegExp(keyword + '.*'),
			'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
			'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
		.skip(index)
		.limit(entry)
		.populate({path: 'brand', populate: {path: 'bcateg nation'} } )
		.populate('vendor')
		.populate('creater').populate('updater')
		.sort({'status': 1, 'updateAt': -1})
		.exec(function(err, objects){
			if(err) console.log(err);
			if(objects){
				let list = new Object()
				list.title = title;
				list.url = url;
				list.crSfer = req.session.crSfer;

				list.count = count;
				list.objects = objects;

				list.keytype = req.query.keytype;
				list.keyword = req.query.keyword;

				list.condStatus = condStatus;

				list.condCrtStart = req.query.crtStart;
				list.condCrtEnded = req.query.crtEnded;
				list.condUpdStart = req.query.updStart;
				list.condUpdEnded = req.query.updEnded;

				list.currentPage = (page + 1);
				list.entry = entry;
				list.totalPage = Math.ceil(count / entry);

				list.slipCond = slipCond;

				req.body.list = list;
				next();
			} else {
				info = "Option error, Please Contact Manger"
				Index.sfOptionWrong(req, res, info)
			}
		})
	})
}
exports.scontList = function(req, res) {
	res.render('./sfer/scont/scont/list', req.body.list)
}

exports.scontListPrint = function(req, res) {
	let objects = req.body.list.objects
	let xl = require('excel4node');
	let wb = new xl.Workbook({
		defaultFont: {
			size: 12,
			color: '333333'
		},
		dateFormat: 'yyyy-mm-dd hh:mm:ss'
	});
	
	let ws = wb.addWorksheet('Sheet 1');
	ws.column(1).setWidth(10);
	ws.column(2).setWidth(20);
	ws.column(3).setWidth(15);
	ws.column(4).setWidth(15);
	ws.column(5).setWidth(30);
	ws.column(6).setWidth(5);
	ws.column(7).setWidth(15);
	ws.column(8).setWidth(20);
	ws.column(9).setWidth(20);
	ws.column(10).setWidth(20);
	ws.column(11).setWidth(20);
	ws.column(12).setWidth(8);
	ws.column(13).setWidth(5);
	ws.column(14).setWidth(5);
	ws.column(15).setWidth(8);
	ws.column(16).setWidth(8);
	ws.column(17).setWidth(8);
	ws.column(17).setWidth(8);
	ws.column(19).setWidth(10);
	ws.column(20).setWidth(10);
	ws.column(21).setWidth(20);
	ws.column(22).setWidth(20);
	ws.column(23).setWidth(8);
	ws.column(24).setWidth(8);
	ws.column(25).setWidth(10);
	
	// header
	ws.cell(1,1).string('UpdateAt');		// S

	ws.cell(1,2).string('BRAND');			// B
	ws.cell(1,3).string('CATEGORY1');
	ws.cell(1,4).string('CATEGORY2');
	ws.cell(1,5).string('DESCRIPTION');
	ws.cell(1,6).string('NATION');

	ws.cell(1,7).string('TYPE');			// V
	ws.cell(1,8).string('VENDOR');
	ws.cell(1,9).string('REFERENTE');
	ws.cell(1,10).string('TEL');
	ws.cell(1,11).string('EMAIL');

	ws.cell(1,12).string('IVA');			// B
	ws.cell(1,13).string('LISTI');
	ws.cell(1,14).string('CATALOG');

	ws.cell(1,15).string('SCONTO');			// S

	ws.cell(1,16).string('AC/SA');			// V

	ws.cell(1,17).string('生产时间');			// B
	ws.cell(1,18).string('FREIGHT');		// V

	ws.cell(1,19).string('createAt');		// S
	ws.cell(1,20).string('RIF');

	ws.cell(1,21).string('WEB');			// B
	ws.cell(1,22).string('WEB NOTE');
	ws.cell(1,23).string('CAP');
	ws.cell(1,24).string('VIDEO');
	ws.cell(1,25).string('BRAND CREATE');

	for(let i=0; i<objects.length; i++){
		let object = objects[i];

		if(object.updateAt) ws.cell((i+2), 1).string(moment(object.updateAt).format('MM/DD/YYYY'));
		if(object.scont) ws.cell((i+2), 15).string(object.scont+ " %");
		if(object.createAt) ws.cell((i+2), 19).string(moment(object.createAt).format('MM/DD/YYYY'));
		if(object.updater) ws.cell((i+2), 20).string(String(object.updater.code));
		if(object.brand) {
			let brand = object.brand;
			if(brand.code) ws.cell((i+2), 2).string(String(brand.code));
			if(brand.bcateg) {
				let bcateg = brand.bcateg;
				if(Conf.bcate[bcateg.bcate]) ws.cell((i+2), 3).string(Conf.bcate[bcateg.bcate]);
				if(bcateg.code) ws.cell((i+2), 4).string(String(bcateg.code));
			}
			ws.cell((i+2), 5).string(String(brand.matDesp));
			if(brand.nation && brand.nation.code) ws.cell((i+2), 6).string(String(brand.nation.code));

			if(brand.iva) ws.cell((i+2), 12).string(brand.iva + "%");
			if(brand.plist) ws.cell((i+2), 13).string("Y");
			if(brand.atlas) ws.cell((i+2), 14).string("Y");

			if(brand.pTime) ws.cell((i+2), 17).string(String(brand.pTime));

			if(brand.website) ws.cell((i+2), 21).string(String(brand.website));
			if(brand.webNote) ws.cell((i+2), 22).string(String(brand.webNote));
			if(brand.cartace) ws.cell((i+2), 23).string(String(brand.cartace));
			if(brand.video) ws.cell((i+2), 24).string(String(brand.video));
			if(brand.createAt) ws.cell((i+2), 25).string(moment(brand.createAt).format('MM/DD/YYYY'));
		}
		if(object.vendor) {
			let vendor = object.vendor;
			if(Conf.vtype[vendor.vtype]) ws.cell((i+2), 7).string(Conf.vtype[vendor.vtype]);
			if(vendor.code) ws.cell((i+2), 8).string(String(vendor.code));
			if(vendor.contacts && vendor.contacts.length > 0) {
				contact = vendor.contacts[0];
				ws.cell((i+2), 9).string(String(contact.contacter));
				ws.cell((i+2), 10).string(String(contact.tel));
				ws.cell((i+2), 11).string(String(contact.email));
			}

			ws.cell((i+2), 16).string(vendor.ac+"/"+vendor.sa);

			if(vendor.freight) ws.cell((i+2), 18).string(String(vendor.freight));
		}
	}

	wb.write('Scont_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
}


exports.scontAdd = function(req, res) {
	Nation.find(function(err, nations) {
		if(err) console.log(err);
		res.render('./sfer/scont/scont/add', {
			title: 'ScontAdd',
			crSfer: req.session.crSfer,
			nations: nations,
		})
	})
}


exports.addScont = function(req, res) {
	createBrand(req, res);
}
createBrand = function(req, res) {
	// console.log(req.body.object.brand.length)
	if(req.body.object && req.body.object.brand){
		if(req.body.object.brand.length > 15) {
			// console.log('brand已经存在')
			createVendor(req, res)
		} else {
			// console.log('brand不存在')
			let brandBody = req.body.brand
			brandBody.code = brandBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
			brandBody.createAt = brandBody.updateAt = Date.now();
			// console.log(brandBody.bcateg)
			if(brandBody.nation.length < 15 || brandBody.bcateg.length < 15){
				info = "Your brand nation or category is not complete, Please Reopration";
				Index.sfOptionWrong(req, res, info);
			} else {
				Brand.findOne({code: brandBody.code}, function(err, brand) {
					if(err) console.log(err);
					if(brand) {
						info = "This brand code is existed";
						Index.sfOptionWrong(req, res, info);
					} else {
						// createAt 和 updateAt 取默认值
						let _brand = new Brand(brandBody)

						_brand.save(function(err, brandSave){
							if(err) console.log(err);
							req.body.object.brand = brandSave._id
							createVendor(req, res)
						})
					}
				})
			}
		}
	} else {
		info = "Option is error, Please contact manager";
		Index.sfOptionWrong(req, res, info);
	}
}
createVendor = function(req, res) {
	if(req.body.object && req.body.object.vendor){
		if(req.body.object.vendor.length > 15) {
			createScont(req, res)
		} else {
			let vendorBody = req.body.vendor
			vendorBody.code = vendorBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
			vendorBody.createAt = vendorBody.updateAt = Date.now();
			Vendor.findOne({code: vendorBody.code}, function(err, vendor) {
				if(err) console.log(err);
				if(vendor) {
					info = "This vendor code is existed";
					Index.sfOptionWrong(req, res, info);
				} else {
					// createAt 和 updateAt 取默认值
					let _vendor = new Vendor(vendorBody)
					_vendor.save(function(err, vendorSave){
						if(err) console.log(err);
						req.body.object.vendor = vendorSave._id
						createScont(req, res)
					})
				}
			})
		}
	} else {
		info = "Option is error, Please contact manager";
		Index.sfOptionWrong(req, res, info);
	}
}
createScont = function(req, res) {
	let objBody = req.body.object

	objBody.updateAt = objBody.createAt = Date.now();

	if(objBody.brand.length < 10 || objBody.vendor.length < 10) {
		info = "brand or vendor is not complete, Please Reopration";
		Index.sfOptionWrong(req, res, info);
	} else {
		Scont.find()
		.where('brand').equals(String(objBody.brand))
		.where('vendor').equals(String(objBody.vendor))
		.exec(function(err, sconts) {
			if(err) console.log(err);
			if(sconts.length > 0) {
				info = "This Brand Is Already Include This Vendor"
				Index.sfOptionWrong(req, res, info)
			} else {
				objBody.status = 0
				let log = new Object();
				log.scont = objBody.scont;
				log.note = objBody.note;
				log.editer = objBody.creater;
				let _object = new Scont(objBody)
				_object.logs.push(log)
				_object.save(function(err, objSave) {
					if(err) console.log(err);
					SctRelate.scontRelBrand('Brand', objSave.brand, objSave._id, 1)
					SctRelate.scontRelVendor('Vendor', objSave.vendor, objSave._id, 1)

					res.redirect('/scontDetail/' + objSave._id)
				})
			}
		})
	}
}






exports.scontFilter = function(req, res, next){
	let id = req.params.id
	Scont.findOne({_id: id})
	.populate({path: 'brand', populate: {path: 'bcateg nation'} } )
	.populate('vendor')
	.populate('creater')
	.populate('updater')
	.populate('logs.editer')
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			req.body.object = object;
			next();
		} else {
			info = "This ScontI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}
exports.scontDetail = function(req, res){
	// scontSingleFilter
	let object = req.body.object
	res.render('./sfer/scont/scont/detail', {
		title: 'Scontory Detail',
		crSfer: req.session.crSfer,
		object: object,
	})
}


exports.scontUpdate = function(req, res){
	// scontSingleFilter
	let object = req.body.object;
	let updater = new Object();
	if(object.updater && object.updater._id) {
		updater = object.updater;
	}
	res.render('./sfer/scont/scont/update', {
		title: 'Scontory Update',
		crSfer: req.session.crSfer,
		object: object,
		updater: updater
	})
}

exports.updateScont = function(req, res) {
	let objBody = req.body.object
	objBody.updateAt = Date.now();
	
	Scont.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(object){
			let log = new Object();
			log.scont = objBody.scont;
			log.note = objBody.note;
			log.editer = objBody.updater;

			let _object = _.extend(object, objBody)
			_object.logs.push(log)
			
			_object.save(function(err, object) {
				if(err) console.log(err);
				res.redirect('/scontList')
			})
		} else {
			info = "This Scont is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.scontDel = function(req, res) {
	let id = req.query.id
	Scont.findOne({_id: id})
	.exec(function(err, object){
		if(err) console.log(err);
		if(object){
			let brandId = object.brand
			let vendorId = object.vendor
			Scont.remove({_id: id}, function(err, objRm) {
				if(err) {
					res.json({success: 0, failDel: "删除失败,原因不明,联系管理员"})
				} else {
					SctRelate.scontRelBrand('Brand', brandId, id, -1)
					SctRelate.scontRelVendor('Vendor', vendorId, id, -1)
					res.json({success: 1})
				}
			})
		} else {
			res.json({success: 0, failDel: "已被删除，按F5刷新页面查看"})
		}
	})
}



exports.ajaxScontSts = function(req, res) {
	let id = req.query.id
	let newStatus = req.query.newStatus
	Scont.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(object){
			object.status = parseInt(newStatus)

			object.save(function(err,objSave) {
				if(err) console.log(err);
				res.json({success: 1, info: "标记已经完成"});
			})
		} else {
			res.json({success: 0, info: "已被删除，按F5刷新页面查看"})
		}
	})
}






// res.render('./sfer/scont/scont/detail', {
// 	title: 'Scontory Detail',
// 	crSfer: req.session.crSfer,
// 	object: object,
// })


let rtPath = require('path').join(__dirname, "../../../../");

exports.scontPdf = function(req, res) {
	let object = req.body.object;
	let brand = object.brand;
	let vendor = object.vendor;
	// let pug = require('pug');
	if(brand && vendor) {
		let hc = require('pug').renderFile(rtPath + 'views/zzPdf/scont/detail.pug', {
			publicPath: "file://"+rtPath + 'public',
			moment : require('moment'),
			crSfer: req.session.crSfer,
			title: 'scont Pdf',

			object: object,
			brand: brand,
			vendor: vendor
		});
		res.pdfFromHTML({
			filename: brand.code + '_' + vendor.code + '.pdf',
			htmlContent: hc
		});
	} else {
		info = "Option is wrong, please contact manager. error: in scont pdf not have brand or vendor";
		Index.sfOptionWrong(req, res, info)
	}
}