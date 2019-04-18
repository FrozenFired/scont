let Index = require('./index');
let Sfer = require('../../../models/user/sfer');
let Brand = require('../../../models/scont/brand');
let Bcateg = require('../../../models/scont/bcateg');
let Nation = require('../../../models/scont/nation');

let Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let _ = require('underscore');

let moment = require('moment');

exports.brandsFilter = function(req, res, next) {
	let title = 'brand List';
	let url = "/bnBrands";

	// 分页
	let slipCond = ""; // 分页时用到的其他条件
	let page = 0, entry = 12;
	[entry, page, slipCond] = Filter.slipPage(req, entry, slipCond)
	let index = page * entry;

	// 条件判断   ----------------
	// 查找关键字
	let keytype = "code", keyword = "";
	if(req.query.keyword) req.query.keyword = req.query.keyword.toUpperCase();
	[keytype, keyword, slipCond] = Filter.key(req, keytype, keyword, slipCond);

	// 根据用户筛选
	let condCreater = '5c3ef60de52ed9187adbc322';
	[symCreater, condCreater, slipCond] = Filter.creater(req.query.creater, condCreater, slipCond);
	// 根据状态筛选
	// let condStatus = 0;
	let condStatus = Object.keys(Conf.stsBrand);
	[condStatus, slipCond] = Filter.status(req.query.status, condStatus, slipCond);
	// 根据创建更新时间筛选
	let at = Filter.at(req);
	slipCond+=at.slipCond;

	Brand.count({
		[keytype]: new RegExp(keyword + '.*'),
		'creater': {[symCreater]: condCreater},
		'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
		'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
		'status': condStatus  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);
		Brand.find({
			[keytype]: new RegExp(keyword + '.*'),
			'creater': {[symCreater]: condCreater},
			'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
			'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
		.sort({'status': 1, 'weight': -1, 'updateAt': -1})
		.skip(index).limit(entry)
		.populate('bcateg').populate('nation').populate('creater').populate('updater')
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

				list.condCreater = condCreater;
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
				Index.bnOptionWrong(req, res, info)
			}
		})
	})
}
exports.brands = function(req, res) {
	Sfer.find({role: [5, 10, 20]})
	.sort({'role': 1})
	.exec(function(err, users) {
		if(err) console.log(err);
		let list = req.body.list
		list.users = users;
		res.render('./sfer/bner/brand/list', req.body.list)
	})
}
exports.brandsPrint = function(req, res) {
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
	ws.column(1).setWidth(20);
	ws.column(2).setWidth(15);
	ws.column(3).setWidth(15);
	ws.column(4).setWidth(30);
	ws.column(5).setWidth(5);

	ws.column(6).setWidth(15);
	ws.column(7).setWidth(30);
	ws.column(8).setWidth(15);
	ws.column(9).setWidth(8);
	ws.column(10).setWidth(5);
	ws.column(11).setWidth(15);
	ws.column(12).setWidth(5);
	ws.column(13).setWidth(15);

	ws.column(14).setWidth(10);
	ws.column(15).setWidth(8);
	ws.column(16).setWidth(8);
	ws.column(17).setWidth(8);
	ws.column(18).setWidth(8);
	ws.column(19).setWidth(10);
	ws.column(20).setWidth(15);
	ws.column(21).setWidth(15);
	ws.column(22).setWidth(15);
	ws.column(23).setWidth(15);
	
	// header
	ws.cell(1,1).string('BRAND Code');
	ws.cell(1,2).string('CATEGORY1');
	ws.cell(1,3).string('CATEGORY2');
	ws.cell(1,4).string('DESCRIPTION');
	ws.cell(1,5).string('NATION');

	ws.cell(1,6).string('FIRM');
	ws.cell(1,7).string('WEB');
	ws.cell(1,8).string('WEB NOTE');

	ws.cell(1,9).string('IVA');
	ws.cell(1,10).string('PRICE LISTI');
	ws.cell(1,11).string('PLIST NOTE');
	ws.cell(1,12).string('CATALOG');
	ws.cell(1,13).string('CAT NOTE');

	ws.cell(1,14).string('PRODUCT TIME');

	ws.cell(1,15).string('CAP');
	ws.cell(1,16).string('VIDEO');


	ws.cell(1,17).string('STATUS');
	ws.cell(1,18).string('WEIGHT');

	ws.cell(1,19).string('NUMBER VENDOR');

	ws.cell(1,20).string('creater');
	ws.cell(1,21).string('createAt');
	ws.cell(1,22).string('updater');
	ws.cell(1,23).string('updateAt');

	for(let i=0; i<objects.length; i++){
		let object = objects[i];

		if(object.code) ws.cell((i+2), 1).string(String(object.code));
		if(object.bcateg) {
			let bcateg = object.bcateg;
			if(Conf.bcate[bcateg.bcate]) ws.cell((i+2), 2).string(Conf.bcate[bcateg.bcate]);
			if(bcateg.code) ws.cell((i+2), 3).string(String(bcateg.code));
		}
		ws.cell((i+2), 4).string(String(object.matDesp));
		if(object.nation && object.nation.code) ws.cell((i+2), 5).string(String(object.nation.code));

		if(object.firmName) ws.cell((i+2), 6).string(String(object.firmName));
		if(object.website) ws.cell((i+2), 7).string(String(object.website));
		if(object.webNote) ws.cell((i+2), 8).string(String(object.webNote));

		if(object.iva) ws.cell((i+2), 9).string(object.iva + "%");
		if(object.plist) ws.cell((i+2), 10).string("Y");
		if(object.plNote) ws.cell((i+2), 11).string(String(object.plNote));
		if(object.atlas) ws.cell((i+2), 12).string("Y");
		if(object.atNote) ws.cell((i+2), 13).string(String(object.atNote));

		if(object.pTime) ws.cell((i+2), 14).string(String(object.pTime));

		if(object.cartace) ws.cell((i+2), 15).string(String(object.cartace));
		if(object.video) ws.cell((i+2), 16).string(String(object.video));

		if(object.status) ws.cell((i+2), 17).string(Conf.stsBrand[object.status]);
		if(object.weight) ws.cell((i+2), 18).string(String(object.weight));

		if(object.sconts) ws.cell((i+2), 19).string(String(object.sconts.length));

		if(object.creater) ws.cell((i+2), 20).string(object.creater.code + " (" + object.creater.name + ")" );
		if(object.createAt) ws.cell((i+2), 21).string(moment(object.createAt).format('MM/DD/YYYY'));
		if(object.updater) ws.cell((i+2), 22).string(object.updater.code + " (" + object.updater.name + ")" );
		if(object.updateAt) ws.cell((i+2), 23).string(moment(object.updateAt).format('MM/DD/YYYY'));
	}

	wb.write('Brand_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
}

// header search
exports.headerBrand = function(req, res) {
	let objects = req.body.list.objects
	let keyword = req.body.list.keyword
	if(objects && objects.length > 0) {
		if(objects.length == 1) {
			res.redirect("/bnBrand/"+objects[0]._id)
		} else {
			res.redirect('/bnBrands?keyword='+keyword)
		}
	} else {
		info = "Non Trovato!"
		Index.bnOptionWrong(req, res, info)
	}
}




exports.brandFilter = function(req, res, next){
	let id = req.params.id;
	if(id.length < 23) {
		info = "Option error, Please contact Manager"
		Index.bnOptionWrong(req, res, info)
	} else {
		Brand.findOne({_id: id})
		.populate('bcateg').populate('nation')
		.populate({
			path: 'sconts',
			options: {sort: {'status': 1} },
			populate: {path: 'vendor' } 
		})
		.populate('creater').populate('updater')
		.exec(function(err, object){
			if(err) console.log(err);
			if(object) {
				req.body.object = object;
				next();
			} else {
				info = "This BrandI is deleted, Please reflesh"
				Index.bnOptionWrong(req, res, info)
			}
		})
	}
}

exports.brand = function(req, res){
	let object = req.body.object;
	// For sort
	object.sconts.sort(function (x, y) {
		if(x.status == 2) return -1;
		else if(y.status == 2) return 1;
		else if(x.status < y.status) return -1;
		else return 1;
	})
	res.render('./sfer/bner/brand/detail', {
		title: 'Brand Detail',
		crSfer: req.session.crSfer,
		object: object
	})
}
exports.brandDel = function(req, res){
	let id = req.params.id;
	Brand.findOne({_id: id}, function(err, brand) { if(err) {
		console.log(err);
		info = "bnBrandDel find brand database error, please contact Likelin";
		Index.bnOptionWrong(req, res, info);
	} else if(!brand) {
		info = "This Brand is deleted, Please reflesh"
		Index.bnOptionWrong(req, res, info)
	} else {
		bnCategBrandnum(brand.bcateg, -1)
		bnNationBrandnum(brand.nation, -1)

		Brand.remove({_id: id}, function(err, brander) {
			if(err) {
				info = "bnBrandDel remove brand database error, please contact Likelin";
				Index.bnOptionWrong(req, res, info);
			} else {
				res.redirect('/bnBrands')
			}
		})
	}

	})
}



exports.brandUp = function(req, res){
	let object = req.body.object;
	Nation.find(function(err, nations) {
		if(err) console.log(err);
		res.render('./sfer/bner/brand/update', {
			title: 'Brand Update',
			crSfer: req.session.crSfer,
			object: object,
			nations: nations
		})
	})
}

exports.brandUpd = function(req, res) {
	let objBody = req.body.object

	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	objBody.updater = req.session.crSfer._id;
	objBody.updateAt = Date.now();

	Brand.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(object){
			Brand.find({code: objBody.code})
			.where('_id').ne(objBody._id)
			.exec(function(err, objects) {
				if(err) console.log(err);
				if(objects.length > 0){
					info = "This Brand Code is Exist"
					Index.bnOptionWrong(req, res, info)
				} else {
					let _object = _.extend(object, objBody)
					_object.save(function(err, objSave) {
						if(err) console.log(err);

						// 判断分类中的品牌个数的增减
						let orgBcateg = req.body.orgBcateg
						if(String(objSave.bcateg) != String(orgBcateg)) {
							// 分类中的品牌个数要 +1
							bnCategBrandnum(objSave.bcateg, 1)
							// 分类中的品牌个数要 -1
							bnCategBrandnum(orgBcateg, -1)
						}
						let orgNation = req.body.orgNation
						if(String(objSave.nation) != String(orgNation)) {
							bnNationBrandnum(objSave.nation, 1)
							bnNationBrandnum(orgNation, -1)
						}
						res.redirect('/bnBrand/'+objSave._id)
					})
				}
			})
		} else {
			info = "This Brand is deleted, Please reflesh"
			Index.bnOptionWrong(req, res, info)
		}
	})
}

exports.brandDelAjax = function(req, res) {
	let id = req.query.id
	Brand.findOne({_id: id})
	.exec(function(err, brand){
		if(err) console.log(err);
		if(brand){
			if(brand.sconts && brand.sconts.length > 0){
				res.json({success: 0, failDel: "Attention! You can't delete this brand"})
			}else{

				// 分类中的品牌个数要 -1
				bnCategBrandnum(brand.bcateg, -1)
				bnNationBrandnum(brand.nation, -1)

				Brand.remove({_id: id}, function(err, brander) {
					if(err) {
						res.json({success: 0, failDel: "删除失败,原因不明,联系管理员"})
					} else {
						res.json({success: 1})
					}
				})
			}
		} else {
			res.json({success: 0, failDel: "已被删除，按F5刷新页面查看"})
		}
	})
}










// 分类中的品牌个数变化
bnCategBrandnum = function(bcategId, vary) {
	Bcateg.findOne({_id: bcategId}, function(err, bcateg) {
		if(err) console.log(err);
		if(bcateg) {
			bcateg.numbrand += parseInt(vary);
			bcateg.save(function(err, bcategSave) {
				if(err) console.log(err);
			})
		}
	})
}

// nation中的品牌个数变化
bnNationBrandnum = function(nationId, vary) {
	Nation.findOne({_id: nationId}, function(err, nation) {
		if(err) console.log(err);
		if(nation) {
			nation.numbrand += parseInt(vary);
			nation.save(function(err, nationSave) {
				if(err) console.log(err);
			})
		}
	})
}


exports.brandAdd = function(req, res) {
	Nation.find()
	.sort({"numbrand": -1})
	.exec(function(err, nations) {
		if(err) console.log(err);
		res.render('./sfer/bner/brand/add', {
			title: 'BrandAdd',
			crSfer: req.session.crSfer,
			nations: nations
		})
	})
}


exports.brandNew = function(req, res) {
	let objBody = req.body.object

	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	
	// objBody.status = 0;
	objBody.updater = objBody.creater = req.session.crSfer._id;
	objBody.updateAt = objBody.createAt = Date.now();

	Brand.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			info = "This Brand Code is Exist"
			Index.bnOptionWrong(req, res, info)
		} else {
			let _object = new Brand(objBody)
			_object.save(function(err, objSave) {
				if(err) console.log(err);

				// 分类中的品牌个数要 +1
				bnCategBrandnum(objSave.bcateg, 1)
				bnNationBrandnum(objSave.nation, 1)

				res.redirect('/bnBrand/'+objSave._id)
			})
		}
	})
}



// Ajax
exports.ajaxCodeBrand = function(req, res) {
	let keytpye = req.query.keytype
	let keyword = req.query.keyword.toUpperCase();
	// console.log(keytpye)
	// console.log(keyword)
	Brand.findOne({[keytpye]: keyword}, function(err, brand) {
		if(err) console.log(err);
		if(brand){
			res.json({success: 1, brand: brand})
		} else {
			Brand.find({[keytpye]: new RegExp(keyword + '.*')}, function(err, brands) {
				if(err) console.log(err);
				if(brands && brands.length > 0) {
					res.json({success: 2, brands: brands});
				} else {
					res.json({success: 0})
				}
			})
		}
	})
}





exports.ajaxBrandSts = function(req, res) {
	let id = req.query.id
	let newStatus = req.query.newStatus
	Brand.findOne({_id: id}, function(err, object){
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