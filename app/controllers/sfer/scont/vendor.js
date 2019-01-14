let Index = require('../index')
let Vendor = require('../../../models/scont/vendor')

var Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let _ = require('underscore')

let moment = require('moment');

exports.vendorsFilter = function(req, res, next) {
	let title = 'vendor List';
	let url = "/vendorList";

	// 分页
	let slipCond = ""; // 分页时用到的其他条件

	let page = 0, entry = 10;
	[entry, page, slipCond] = Filter.slipPage(req, entry, slipCond)
	let index = page * entry;

	// 条件判断   ----------------
	// 查找关键字
	let keytype = "code", keyword = "";
	[keytype, keyword, slipCond] = Filter.key(req, keytype, keyword, slipCond)
	// 根据状态筛选
	let condStatus = Object.keys(Conf.stsVendor);
	// let condStatus = 0;
	[condStatus, slipCond] = Filter.status(req.query.status, condStatus, slipCond);
	// 根据创建更新时间筛选
	let at = Filter.at(req);
	slipCond+=at.slipCond;

	Vendor.count({
		[keytype]: new RegExp(keyword + '.*'),
		'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
		'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
		'status': condStatus  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);
		Vendor.find({
			[keytype]: new RegExp(keyword + '.*'),
			'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
			'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
		.skip(index)
		.limit(entry)
		.populate('creater')
		.populate('updater')
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
exports.vendorList = function(req, res) {
	res.render('./sfer/scont/vendor/list', req.body.list)
}
exports.vendorListPrint = function(req, res) {
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
	ws.column(5).setWidth(10);

	ws.column(6).setWidth(20);
	ws.column(7).setWidth(20);
	ws.column(8).setWidth(30);
	ws.column(9).setWidth(20);
	ws.column(10).setWidth(10);
	ws.column(11).setWidth(5);
	ws.column(12).setWidth(5);

	ws.column(13).setWidth(20);
	ws.column(14).setWidth(10);
	ws.column(15).setWidth(20);
	ws.column(16).setWidth(10);
	
	// header
	ws.cell(1,1).string('Vendor Code');
	ws.cell(1,2).string('Type');

	ws.cell(1,3).string('ac/sa');
	ws.cell(1,4).string('acsaNote');
	ws.cell(1,5).string('freight');

	ws.cell(1,6).string('contacter');
	ws.cell(1,7).string('telephone');
	ws.cell(1,8).string('email');

	ws.cell(1,9).string('note');
	ws.cell(1,10).string('STATUS');
	ws.cell(1,11).string('WEIGHT');
	ws.cell(1,12).string('NUMBER Brand');

	ws.cell(1,13).string('creater');
	ws.cell(1,14).string('createAt');
	ws.cell(1,15).string('updater');
	ws.cell(1,16).string('updateAt');

	for(let i=0; i<objects.length; i++){
		let object = objects[i];

		if(object.code) ws.cell((i+2), 1).string(String(object.code));
		if(Conf.vtype[object.vtype]) ws.cell((i+2), 2).string(Conf.vtype[object.vtype]);
		if(object.ac && object.sa) ws.cell((i+2), 3).string(object.ac+"/"+object.sa);
		if(object.acsaNote) ws.cell((i+2), 4).string(String(object.acsaNote));
		if(object.freight) ws.cell((i+2), 5).string(String(object.freight));
		if(object.contacts && object.contacts.length > 0) {
			contact = object.contacts[0];
			ws.cell((i+2), 6).string(String(contact.contacter));
			ws.cell((i+2), 7).string(String(contact.tel));
			ws.cell((i+2), 8).string(String(contact.email));
		}

		if(object.note) ws.cell((i+2), 9).string(String(object.note));


		if(object.status) ws.cell((i+2), 10).string(Conf.stsBrand[object.status]);
		if(object.weight) ws.cell((i+2), 11).string(String(object.weight));

		if(object.sconts) ws.cell((i+2), 12).string(String(object.sconts.length));

		if(object.creater) ws.cell((i+2), 13).string(object.creater.code + " (" + object.creater.name + ")" );
		if(object.createAt) ws.cell((i+2), 14).string(moment(object.createAt).format('MM/DD/YYYY'));
		if(object.updater) ws.cell((i+2), 15).string(object.updater.code + " (" + object.updater.name + ")" );
		if(object.updateAt) ws.cell((i+2), 16).string(moment(object.updateAt).format('MM/DD/YYYY'));
	}

	wb.write('Vendor_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
}

exports.vendorAdd = function(req, res) {
	res.render('./sfer/scont/vendor/add', {
		title: 'Vendor Add',
		crSfer: req.session.crSfer,
	})
}


exports.addVendor = function(req, res) {
	let objBody = req.body.object

	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	// objBody.status = 0;
	objBody.updater = objBody.creater = req.session.crSfer._id;
	objBody.updateAt = objBody.createAt = Date.now();

	Vendor.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			info = "This Vendor Code is Exist"
			Index.sfOptionWrong(req, res, info)
		} else {
			let _object = new Vendor(objBody)
			_object.save(function(err, objSave) {
				if(err) console.log(err);
				res.redirect('/vendorList')
			})
		}
	})
}


exports.vendorFilter = function(req, res, next){
	let id = req.params.id
	Vendor.findOne({_id: id})
	// .populate({path: 'brands', options: {sort: {'weight': -1} } } )
	.populate({
		path: 'sconts',
		options: {sort: {'status': 1} }, 
		populate: {path: 'brand', populate: {path: 'bcateg'} } 
	})
	.populate('creater')
	.populate('updater')
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			req.body.object = object;
			next();
		} else {
			info = "This VendorI is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.vendorDetail = function(req, res){
	let object = req.body.object;
	object.sconts.sort(function (x, y) {
		if(x.status == 2) return -1;
		else if(y.status == 2) return 1;
		else if(x.status < y.status) return -1;
		else return 1;
	})
	res.render('./sfer/scont/vendor/detail', {
		title: 'Vendorory Detail',
		crSfer: req.session.crSfer,
		object: object,
	})
}

exports.vendorUpdate = function(req, res){
	let object = req.body.object;
	res.render('./sfer/scont/vendor/update', {
		title: 'Vendorory Update',
		crSfer: req.session.crSfer,
		object: object,
	})
}

exports.updateVendor = function(req, res) {
	let objBody = req.body.object
	
	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	objBody.updater = req.session.crSfer._id;
	objBody.updateAt = Date.now();

	Vendor.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(object){
			Vendor.find({code: objBody.code})
			.where('_id').ne(objBody._id)
			.exec(function(err, objects) {
				if(err) console.log(err);
				if(objects.length > 0){
					info = "This Vendor Code is Exist"
					Index.sfOptionWrong(req, res, info)
				} else {
					let _object = _.extend(object, objBody)
					_object.save(function(err, object) {
						if(err) console.log(err);
						res.redirect('/vendorList')
					})
				}
			})
		} else {
			info = "This Vendor is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.vendorDel = function(req, res) {
	let id = req.query.id
	Vendor.findOne({_id: id})
	.exec(function(err, vendor){
		if(err) console.log(err);
		if(vendor){
			if(vendor.sconts.length > 0){
				res.json({success: 0, failDel: "Attention! You can't delete this vendor"})
			}else{
				Vendor.remove({_id: id}, function(err, brander) {
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




// Ajax
exports.ajaxCodeVendor = function(req, res) {
	let keytpye = req.query.keytype
	let keyword = req.query.keyword.toUpperCase();
	// console.log(keytpye)
	// console.log(keyword)
	Vendor.findOne({[keytpye]: keyword}, function(err, vendor) {
		if(err) console.log(err);
		if(vendor){
			res.json({success: 1, vendor: vendor})
		} else {
			Vendor.find({[keytpye]: new RegExp(keyword + '.*')}, function(err, vendors) {
				if(err) console.log(err);
				if(vendors && vendors.length > 0) {
					res.json({success: 2, vendors: vendors});
				} else {
					res.json({success: 0})
				}
			})
		}
	})
}


exports.ajaxVendorSts = function(req, res) {
	let id = req.query.id
	let newStatus = req.query.newStatus
	Vendor.findOne({_id: id}, function(err, object){
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