let Index = require('./index')
let Sfer = require('../../models/user/sfer')
let _ = require('underscore')
MiddlePicture = require('../../middle/middlePicture')
Conf = require('../../../confile/conf')


exports.mgSferAdd =function(req, res) {
	res.render('./mger/sfer/add', {
		title: 'Add Sfer',
		crMger : req.session.crMger,
		action: "/mgAddSfer",
	})
}


exports.mgExistSferN = function(req, res, next) {
	let objBody = req.body.object;
	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

	Sfer.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			info = "此帐号已经被注册，请重新注册";
			Index.mgOptionWrong(req, res, info);
		}
		else {
			req.body.object = objBody;
			next();
		}
	})
}
exports.mgAddSfer = function(req, res) {
	let objBody = req.body.object
	
	let _object = new Sfer(objBody)
	_object.save(function(err, objSave){
		if(err) console.log(err);
		res.redirect('/mgSferList')
	})
		
}

exports.mgSferList = function(req, res) {
	Sfer.find()
	.sort({'role': 1, 'part': -1, 'code': 1})
	.exec(function(err, objects) {
		if(err) console.log(err)
		res.render('./mger/sfer/list', {
			title: '用户列表',
			crMger : req.session.crMger,
			objects: objects
		})
	})
}

let moment = require('moment');
exports.userExcel = function(req, res) {
	Sfer.find()
	.sort({'role': 1, 'part': -1, 'code': 1})
	.exec(function(err, objects) {
		if(err) console.log(err)
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
		ws.column(3).setWidth(15);
		ws.column(4).setWidth(15);
		ws.column(5).setWidth(30);
		ws.column(6).setWidth(20);
		ws.column(7).setWidth(20);

		
		// header
		ws.cell(1,1).string('Code');
		ws.cell(1,2).string('name');
		ws.cell(1,3).string('Partment');
		ws.cell(1,4).string('Role');
		ws.cell(1,5).string('Tel');
		ws.cell(1,6).string('Create At');
		ws.cell(1,7).string('Last Login');

		for(let i=0; i<objects.length; i++){
			let object = objects[i];

			if(object.code) ws.cell((i+2), 1).string(String(object.code));
			if(object.name) ws.cell((i+2), 2).string(String(object.name));
			if(object.role) ws.cell((i+2), 3).string(String(Conf.sfRole[object.role]));
			if(object.part) ws.cell((i+2), 4).string(String(Conf.sfPart[object.part]));
			if(object.telephone) ws.cell((i+2), 5).string(String(object.telephone));

			if(object.createAt) ws.cell((i+2), 6).string(moment(object.createAt).format('MM/DD/YYYY'));
			if(object.loginTime) ws.cell((i+2), 7).string(moment(object.loginTime).format('MM/DD/YYYY'));
		}

		wb.write('Users_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
	})
}
let Order = require('../../models/finance/order')
exports.logisticOrder = function(req, res) {
	Order.find()
	.populate('vder')
	.sort({'createAt': -1})
	.exec(function(err, objects) {
		if(err) console.log(err)
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
		ws.column(3).setWidth(15);
		ws.column(4).setWidth(15);
		ws.column(5).setWidth(30);
		ws.column(6).setWidth(20);
		ws.column(7).setWidth(20);

		
		// header
		ws.cell(1,1).string('Code');
		ws.cell(1,2).string('brand');
		ws.cell(1,3).string('supplier');
		ws.cell(1,4).string('P.I.');
		ws.cell(1,5).string('status');
		ws.cell(1,6).string('Volume');
		ws.cell(1,7).string('gross weight');
		ws.cell(1,8).string('net weight');
		ws.cell(1,9).string('Package Number');

		for(let i=0; i<objects.length; i++){
			let object = objects[i];

			if(object.order) ws.cell((i+2), 1).string(String(object.order));
			if(object.brand) ws.cell((i+2), 2).string(String(object.brand));
			if(object.vder && object.vder.code) ws.cell((i+2), 3).string(String(object.vder.code));
			if(object.pi) ws.cell((i+2), 4).string(String(object.pi));
			if(object.stsOrderLg) ws.cell((i+2), 5).string(String(Conf.stsOrderLg[object.stsOrderLg]));
			if(object.volumeLg) ws.cell((i+2), 6).string(String(object.volumeLg));
			if(object.gwlg) ws.cell((i+2), 7).string(String(object.gwlg));
			if(object.nwlg) ws.cell((i+2), 8).string(String(object.nwlg));
			if(object.packlg) ws.cell((i+2), 9).string(String(object.packlg));
		}

		wb.write('LogisticOrder_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
	})
}

exports.mgExistSferY = function(req, res, next) {
	let id = req.params.id;
	Sfer.findOne({_id: id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此帐号已经被删除";
			Index.mgOptionWrong(req, res, info);
		}
		else {
			req.body.object = object;
			next();
		}
	})
}
exports.mgSferDetail = function(req, res) {
	let object = req.body.object
	res.render('./mger/sfer/detail', {
		title: 'Sfer Infomation',
		crMger : req.session.crMger,
		object: object
	})
}


exports.mgCheckSferUp = function(req, res, next) {
	let objBody = req.body.object
	Sfer.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "This sfer is deleted"
			Index.mgOptionWrong(req, res, info)
		} else {
			let _object = _.extend(object, objBody)
			_object.loginTime = Date.now(); // 控制已经登录的用户
			req.body.object = _object
			next()
		}
	})
}
exports.mgUpdateSferInfo = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err)
		res.redirect("/mgSferDetail/"+objSave._id)
	})
}

exports.mgUpdateSferPw = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err)
		res.redirect("/mgSferDetail/"+objSave._id)
	})
}

exports.mgSferDel = function(req, res) {
	let id = req.query.id;
	Sfer.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(!object){
			res.json({success: 0, failDel: "已被删除，按F5刷新页面查看"});
		} else {
			if(object.photo) MiddlePicture.deleteOldPhoto(object.photo, Conf.photoPath.sferAvatar)
			Sfer.remove({_id: id}, function(err, objDel) {
				if(err) console.log(err);
				res.json({success: 1});
			})
		}
	})
}