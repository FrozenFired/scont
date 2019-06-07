let Index = require('./index')
let Absence = require('../../../models/task/absence')
let _ = require('underscore')

let Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let moment = require('moment')


exports.sfAbsences = function(req, res) {
	res.render('./sfer/sfer/absence/list', {
		title: 'Absences',
		crSfer: req.session.crSfer,
	})
}
exports.sfAbsencesAjax = function(req, res) {
	let crSfer = req.session.crSfer;

	// 根据创建时间筛选
	let begin = parseInt(req.query.begin);
	condCreatS = begin;
	condCreatF = begin + 9*60*60*1000;

	let symRole = 'apler'; let condRole = crSfer._id;
	if(crSfer.part == 1) {
		symRole = 'role';
		condRole = crSfer.role
	}

	Absence.find({
		[symRole]: condRole,
		$or:[
			{'sAt': {"$gte": condCreatS, "$lt": condCreatF}},
			{'peAt': {"$gt": condCreatS, "$lte": condCreatF}},
			{'sAt': {"$lte": condCreatS}, 'peAt': {"$gte": condCreatF}}, 
		]
	})
	.populate('apler', 'code')
	.populate('manage', 'code')
	.populate('hr', 'code')
	.sort({'ctAt': -1})
	.exec(function(err, objects) { if(err) {
		res.json({success: 0, info: "Sf查找订单时, 订单数据库错误, 请联系管理员"})
	} else {
		res.json({success: 1, objects: objects, keyword: req.query.keyword})
	} })
}

exports.sfAbsencesMonth = function(req, res) {
	let months = new Array();

	let now = new Date();
	let tMonth = now.getMonth();
	let tyear = now.getFullYear();
	let tFirst = new Date(tyear, tMonth, 1);
	let timestamps = tFirst.setHours(8, 0, 0, 0);
	tFirst.setMonth(tFirst.getMonth() + 1);
	tFirst.setDate(tFirst.getDate() - 1)
	let timestampf = tFirst.setHours(17, 0, 0, 0);

	let month = new Object();
	month.key = String(tyear).slice(2,4)+'年'+(tMonth+1)+'月';
	month.vals = timestamps
	month.valf = timestampf

	months.push(month)
	for(let i=1; i< 12; i++) {
		tMonth = tMonth-1;
		if(tMonth < 0) {
			tyear = tyear -1;
			tMonth = 11;
		}
		tFirst = new Date(tyear, tMonth, 1);
		timestamps = tFirst.setHours(8, 0, 0, 0);
		tFirst.setMonth(tFirst.getMonth() + 1);
		tFirst.setDate(tFirst.getDate() - 1)
		timestampf = tFirst.setHours(17, 0, 0, 0);
		months[i] = new Object();
		months[i].key = String(tyear).slice(2,4)+'年'+(tMonth+1)+'月';
		months[i].vals = timestamps
		months[i].valf = timestampf
	}

	res.render('./sfer/sfer/absence/listMoth', {
		title: 'Absences',
		crSfer: req.session.crSfer,
		months: months
	})
}
exports.sfAbsencesMonthAjax = function(req, res) {
	let crSfer = req.session.crSfer;
	// 根据创建时间筛选
	let begin = parseInt(req.query.begin);
	let ended = parseInt(req.query.ended);
	condCreatS = begin;
	condCreatF = ended;

	let symRole = 'apler'; let condRole = crSfer._id;
	if(crSfer.part == 1) {
		symRole = 'role';
		condRole = crSfer.role
	}
	
	Absence.find({
		[symRole]: condRole,
		$or:[
			{'sAt': {"$gte": condCreatS, "$lt": condCreatF}},
			{'peAt': {"$gt": condCreatS, "$lte": condCreatF}},
		]
	})
	.populate('apler', 'code')
	.populate('manage', 'code')
	.populate('hr', 'code')
	.sort({'ctAt': -1})
	.exec(function(err, objects) { if(err) {
		res.json({success: 0, info: "Sf查找订单时, 订单数据库错误, 请联系管理员"})
	} else {
		res.json({success: 1, objects: objects, keyword: req.query.keyword})
	} })
}

// 进入审核页面
exports.sfAbsenceConfirm = function(req, res) {
	let crSfer = req.session.crSfer;
	if(crSfer.part == 1) {
		Absence.find({'role': crSfer.role, status: 1})
		.populate('apler code')
		.exec(function(err, objects) {
			if(err) {
				console.log(err);
				info = "sfAbsenceConfirm Error, Please Contact Li Kelin, hahaha";
				Index.sfOptionWrong(req, res, info);
			} else {
				res.render('./sfer/sfer/absence/absenceConfirm', {
					title: 'Absences Confirm',
					crSfer: crSfer,
					objects: objects
				})
			}
		})
	} else {
		info = "哈哈， 你还不是主管，You Can't operate this function";
		Index.sfOptionWrong(req, res, info);
	}
}







exports.absenceAdd =function(req, res) {
	res.render('./sfer/sfer/absence/add', {
		title: 'Add Absence',
		crSfer : req.session.crSfer,
		action: "/sfAbsenceNew",
	})
}


exports.absenceNew = function(req, res) {
	let crSfer = req.session.crSfer;
	let sTime = req.body.sTime
	let peTime = req.body.peTime
	let objBody = req.body.object

	objBody.apler = crSfer._id;
	objBody.sAt = new Date(sfTimeFormat(sTime));
	objBody.peAt = new Date(sfTimeFormat(peTime));
	objBody.status = 1

	let role = crSfer.role;
	if(crSfer.role == 5) {
		role = 10;
	} else if(crSfer.role == 4) {
		role = 6;
	}
	objBody.role = role;

	let _object = new Absence(objBody)
	_object.save(function(err, objSave) {
		if(err) console.log(err)
		res.redirect('/')
	})
}

sfTimeFormat = function(time) {
	let date = time[0];
	let Y = date.split('/')[2];
	let M = date.split('/')[0];
	let D = date.split('/')[1];
	let h = time[1]
	let m = time[2]
	let s = '00'
	let tm = Y+'-'+M+'-'+D+' '+h+':'+m+':'+s;
	return tm
}





exports.absenceDel = function(req, res) {
	let id = req.params.id
	Absence.findOne({_id: id})
	.exec(function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此信息已经被删除"
			Index.sfOptionWrong(req, res, info)
		} else {
			Absence.remove({_id: object._id}, function(err, absenceRm) {
				if(err) console.log(err);
				res.redirect('/sfAbsences')
			})
		}
	})
}
exports.absenceDelAjax = function(req, res) {
	let id = req.query.id
	Absence.findOne({_id: id})
	.exec(function(err, absence){
		if(err) console.log(err);
		if(absence){
			Absence.remove({_id: id}, function(err, brander) {
				if(err) {
					res.json({success: 0, failDel: "删除失败,原因不明,联系管理员"})
				} else {
					res.json({success: 1})
				}
			})
		} else {
			res.json({success: 0, failDel: "已被删除，按F5刷新页面查看"})
		}
	})
}







exports.absenceStatus = function(req, res) {
	let crSfer = req.session.crSfer;
	let id = req.query.id
	let newStatus = req.query.newStatus
	Absence.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(object){
			object.status = parseInt(newStatus)
			if(object.status == 2) {
				object.manage = crSfer._id;
			} else if(object.status == 3) {
				object.hr = crSfer._id;
			}
			object.save(function(err,objSave) {
				if(err) console.log(err);
				res.json({success: 1, info: "已经更改"});
			})
		} else {
			res.json({success: 0, info: "已被删除，按F5刷新页面查看"})
		}
	})
}