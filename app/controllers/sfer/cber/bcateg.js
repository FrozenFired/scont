let Index = require('./index')
let Bcateg = require('../../../models/scont/bcateg')
let Brand = require('../../../models/scont/brand')

let moment = require('moment')
let Conf = require('../../../../confile/conf.js')
let _ = require('underscore')

exports.cbBcategsFilter = function(req, res, next) {
	Bcateg.find()
	.sort({"bcate": 1, "weight": -1, "numbrand": -1})
	.exec(function(err, objects){
		if(err) console.log(err);
		if(objects) {
			req.body.objects = objects;
			next();
		} else {
			info = "Can not Find Category"
			Index.cbOptionWrong(req, res, info)
		}
	})
}
exports.cbBcategs = function(req, res) {
	let objects = req.body.objects;
	res.render('./sfer/cber/bcateg/list', {
		title: 'Bcateg List',
		crSfer: req.session.crSfer,
		objects: objects
	})
}
exports.cbBcategsPrint = function(req, res) {
	let objects = req.body.objects;
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
	ws.column(2).setWidth(20);
	ws.column(3).setWidth(20);
	ws.column(4).setWidth(20);
	ws.column(5).setWidth(15);

	// header
	ws.cell(1,1).string('Category1');
	ws.cell(1,2).string('Category2');
	ws.cell(1,3).string('English');
	ws.cell(1,4).string('中文名');
	ws.cell(1,5).string('Brand Number');

	for(let i=0; i<objects.length; i++){
		let item = objects[i];
		if(item.bcate || item.bcate==0) ws.cell((i+2), 1).string(Conf.bcate[item.bcate]);
		if(item.code) ws.cell((i+2), 2).string(String(item.code));
		if(item.nameEN) ws.cell((i+2), 3).string(String(item.nameEN));
		if(item.nameCN) ws.cell((i+2), 4).string(String(item.nameCN));
		if(item.numbrand) ws.cell((i+2), 5).string(String(item.numbrand));
	}

	wb.write('CategoryList_'+req.session.crSfer.code+'_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
}




exports.cbBcategFilter = function(req, res, next) {
	let id = req.params.id
	Bcateg.findOne({_id: id})
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			req.body.object = object;
			next();
		} else {
			info = "This BcategI is deleted, Please reflesh"
			Index.cbOptionWrong(req, res, info)
		}
	})
}


exports.cbBcateg = function(req, res){
	let object = req.body.object;
	Brand.find({bcateg: object._id})
	.populate('nation')
	.exec(function(err, brands) {
		if(err) console.log(err);
		if(object.numbrand != brands.length) {
			object.numbrand = brands.length;
			object.save(function(err, objSave) {
				if(err) console.log(err);
			})
		}
		res.render('./sfer/cber/bcateg/detail', {
			title: 'Bcategory Detail',
			crSfer: req.session.crSfer,
			object: object,
			brands: brands
		})
	})
}

exports.cbBcategPrint = function(req, res) {
	let object = req.body.object;
	Brand.find({bcateg: object._id})
	.populate('nation')
	.exec(function(err, brands) {
		if(err) console.log(err);
		if(object.numbrand != brands.length) {
			object.numbrand = brands.length;
			object.save(function(err, objSave) {
				if(err) console.log(err);
			})
		}
		cbBcategPrintFunc(req, res, object, brands);
	})
}
cbBcategPrintFunc = function(req, res, object, brands) {
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
	ws.column(2).setWidth(10);
	ws.column(3).setWidth(25);
	ws.column(4).setWidth(15);
	ws.column(5).setWidth(10);

	// header
	ws.cell(3,1).string('品牌');
	ws.cell(3,2).string('国家');
	ws.cell(3,3).string('材料描述');
	ws.cell(3,4).string('状态');
	ws.cell(3,5).string('供应商');

	for(let i=0; i<brands.length; i++){
		let item = brands[i];
		if(item.code) ws.cell((i+4), 1).string(String(item.code));
		if(item.nation && item.nation.code) ws.cell((i+4), 2).string(item.nation.code);
		if(item.matDesp) ws.cell((i+4), 3).string(String(item.matDesp));
		if(item.status || item.status==0) ws.cell((i+4), 4).string(String(Conf.stsBrand[item.status]));
		if(item.sconts) ws.cell((i+4), 5).string(String(item.sconts.length));
	}

	wb.write('Category_'+req.session.crSfer.code+'_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
}