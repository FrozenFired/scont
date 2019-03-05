let Index = require('../index')
let Nation = require('../../../models/scont/nation')
let Brand = require('../../../models/scont/brand')

let Filter = require('../../../middle/filter');

let moment = require('moment')
let _ = require('underscore')

exports.cnNationsFilter = function(req, res, next) {
	Nation.find()
	.sort({'weight': -1, 'numbrand': -1})
	.exec(function(err, objects){
		if(err) console.log(err);
		if(objects) {
			req.body.objects = objects;
			next();
		} else {
			info = "Can't Find The Nation"
			Index.cnOptionWrong(req, res, info)
		}
	})
}

exports.cnNations = function(req, res) {
	let objects = req.body.objects;
	res.render('./sfer/cner/nation/list', {
		title: 'Nation List',
		crCner: req.session.crCner,
		objects: objects
	})
}
exports.cnNationsPrint = function(req, res) {
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
	ws.column(1).setWidth(8);
	ws.column(2).setWidth(20);
	ws.column(3).setWidth(20);
	ws.column(4).setWidth(20);
	ws.column(5).setWidth(15);
	ws.column(6).setWidth(10);
	
	// header
	ws.cell(1,1).string('Code');
	ws.cell(1,2).string('Name');
	ws.cell(1,3).string('English');
	ws.cell(1,4).string('中文名');
	ws.cell(1,5).string('TEL');
	ws.cell(1,6).string('Brand Number');

	for(let i=0; i<objects.length; i++){
		let item = objects[i];
		if(item.code) ws.cell((i+2), 1).string(String(item.code));
		if(item.name) ws.cell((i+2), 2).string(String(item.name));
		if(item.nameEN) ws.cell((i+2), 3).string(String(item.nameEN));
		if(item.nameCN) ws.cell((i+2), 4).string(String(item.nameCN));
		if(item.tel) ws.cell((i+2), 5).string(String(item.tel));
		if(item.numbrand) ws.cell((i+2), 6).string(String(item.numbrand));
	}

	wb.write('Nation_'+req.session.crCner.code+'_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
}


exports.nationAdd = function(req, res) {
	res.render('./sfer/cner/nation/add', {
		title: 'NationAdd',
		crCner: req.session.crCner,
	})
}





exports.cnNation = function(req, res){
	let id = req.params.id
	Nation.findOne({_id: id})
	// .populate({path: 'brands', options: {sort: {'weight': -1} } } )
	.populate('creater')
	.populate('updater')
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			Brand.find({nation: object._id})
			.populate('bcateg')
			.exec(function(err, brands) {
				if(err) console.log(err);
				if(object.numbrand != brands.length) {
					object.numbrand = brands.length;
					object.save(function(err, objSave) {
						if(err) console.log(err);
					})
				}
				res.render('./sfer/cner/nation/detail', {
					title: 'Nationory Detail',
					crCner: req.session.crCner,
					object: object,
					brands: brands
				})
			})
		} else {
			info = "This NationI is deleted, Please reflesh"
			Index.cnOptionWrong(req, res, info)
		}
	})
}