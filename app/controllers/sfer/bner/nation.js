let Index = require('../index')
let Nation = require('../../../models/scont/nation')
let Brand = require('../../../models/scont/brand')

let Filter = require('../../../middle/filter');

let moment = require('moment')
let _ = require('underscore')

exports.nationsFilter = function(req, res, next) {
	Nation.find()
	.sort({'weight': -1, 'numbrand': -1})
	.exec(function(err, objects){
		if(err) console.log(err);
		if(objects) {
			req.body.objects = objects;
			next();
		} else {
			info = "Can't Find The Nation"
			Index.bnOptionWrong(req, res, info)
		}
	})
}

exports.nations = function(req, res) {
	let objects = req.body.objects;
	res.render('./sfer/bner/nation/list', {
		title: 'Nation List',
		crSfer: req.session.crSfer,
		objects: objects
	})
}
exports.nationsPrint = function(req, res) {
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

	wb.write('Nation_'+req.session.crSfer.code+'_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
}



exports.nation = function(req, res){
	let id = req.params.id
	Nation.findOne({_id: id})
	// .populate({path: 'brands', options: {sort: {'weight': -1} } } )
	.populate('creater')
	.populate('updater')
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			Brand.find({nation: object._id}, function(err, brands) {
				if(err) console.log(err);
				if(object.numbrand != brands.length) {
					object.numbrand = brands.length;
					object.save(function(err, objSave) {
						if(err) console.log(err);
					})
				}
				res.render('./sfer/bner/nation/detail', {
					title: 'Nationory Detail',
					crSfer: req.session.crSfer,
					object: object,
					brands: brands
				})
			})
		} else {
			info = "This NationI is deleted, Please reflesh"
			Index.bnOptionWrong(req, res, info)
		}
	})
}

exports.nationDel = function(req, res) {
	let id = req.query.id
	Nation.findOne({_id: id})
	.exec(function(err, nation){
		if(err) console.log(err);
		if(nation){
			if(nation.numbrand > 0){
				res.json({success: 0, failDel: "Attention! You can't delete this nation"})
			}else{
				Nation.remove({_id: id}, function(err, brander) {
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

exports.nationUp = function(req, res){
	let id = req.params.id
	Nation.findOne({_id: id})
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			res.render('./sfer/bner/nation/update', {
				title: 'Nationory Update',
				crSfer: req.session.crSfer,
				object: object,
			})
		} else {
			info = "This NationI is deleted, Please reflesh"
			Index.bnOptionWrong(req, res, info)
		}
	})
}

exports.nationUpd = function(req, res) {
	let objBody = req.body.object
	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '')
	objBody.updateAt = Date.now();

	Nation.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(object){
			Nation.find({code: objBody.code})
			.where('_id').ne(objBody._id)
			.exec(function(err, objects) {
				if(err) console.log(err);
				if(objects.length > 0){
					info = "This Nation Code is Exist"
					Index.bnOptionWrong(req, res, info)
				} else {
					let _object = _.extend(object, objBody)
					_object.updateUser = req.session.crSfer._id
					_object.save(function(err, object) {
						if(err) console.log(err);
						res.redirect('/bnNations')
					})
				}
			})
		} else {
			info = "This Nation is deleted, Please reflesh"
			Index.bnOptionWrong(req, res, info)
		}
	})
}


exports.nationAdd = function(req, res) {
	res.render('./sfer/bner/nation/add', {
		title: 'NationAdd',
		crSfer: req.session.crSfer,
	})
}


exports.nationNew = function(req, res) {
	let objBody = req.body.object

	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '');
	objBody.updateAt = objBody.createAt = Date.now();
	Nation.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			info = "This Nation Code is Exist"
			Index.bnOptionWrong(req, res, info)
		} else {
			let _object = new Nation(objBody)
			_object.creater = req.session.crSfer._id
			_object.save(function(err, objSave) {
				if(err) console.log(err);
				res.redirect('/bnNation/'+objSave._id)
			})
		}
	})
}
