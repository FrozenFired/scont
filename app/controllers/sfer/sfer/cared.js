let Index = require('./index')
let Cared = require('../../../models/task/cared')
let _ = require('underscore')

exports.sfCareds = function(req, res) {
	res.render('./sfer/sfer/cared/list', {
		title: 'Careds',
		crSfer: req.session.crSfer,
	})
}
exports.sfCaredsAjax = function(req, res) {
	let crSfer = req.session.crSfer;

	// 根据创建时间筛选
	let begin = parseInt(req.query.begin);
	symCreatS = "$gte"; condCreatS = begin;
	symCreatF = "$lt"; condCreatF = begin + 24*60*60*1000;

	Cared.find({
		'ctAt': {[symCreatS]: condCreatS, [symCreatF]: condCreatF},
	})
	.populate('car', 'code nome')
	.populate('apler', 'code')
	.populate('cfmer', 'code')
	.populate('ender', 'code')
	.sort({'ctAt': -1})
	.exec(function(err, objects) { if(err) {
		res.json({success: 0, info: "Sf查找订单时, 订单数据库错误, 请联系管理员"})
	} else {
		res.json({success: 1, objects: objects, keyword: req.query.keyword})
	} })
}

exports.sfCaredsMonth = function(req, res) {
	let months = new Array();

	let now = new Date();
	let tMonth = now.getMonth();
	let tyear = now.getFullYear();
	let tFirst = new Date(tyear, tMonth, 1);
	let timestamps = tFirst.setHours(0, 0, 0, 0);
	let timestampf = now.setHours(23, 59, 59, 999);

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
		timestamps = tFirst.setHours(0, 0, 0, 0);
		tFirst.setMonth(tFirst.getMonth() + 1);
		tFirst.setDate(tFirst.getDate() - 1)
		timestampf = tFirst.setHours(23, 59, 59, 999);
		months[i] = new Object();
		months[i].key = String(tyear).slice(2,4)+'年'+(tMonth+1)+'月';
		months[i].vals = timestamps
		months[i].valf = timestampf
	}

	res.render('./sfer/sfer/cared/listMoth', {
		title: 'Careds',
		crSfer: req.session.crSfer,
		months: months
	})
}
exports.sfCaredsMonthAjax = function(req, res) {
	let crSfer = req.session.crSfer;

	// 根据创建时间筛选
	let begin = parseInt(req.query.begin);
	let ended = parseInt(req.query.ended);
	symCreatS = "$gte"; condCreatS = begin;
	symCreatF = "$lt"; condCreatF = ended;

	Cared.find({
		'ctAt': {[symCreatS]: condCreatS, [symCreatF]: condCreatF},
	})
	.populate('car', 'code nome')
	.populate('apler', 'code')
	.populate('cfmer', 'code')
	.populate('ender', 'code')
	.sort({'ctAt': -1})
	.exec(function(err, objects) { if(err) {
		res.json({success: 0, info: "Sf查找订单时, 订单数据库错误, 请联系管理员"})
	} else {
		res.json({success: 1, objects: objects, keyword: req.query.keyword})
	} })
}





exports.sfCaredFilter = function(req, res, next) {
	let id = req.params.id;
	Cared.findOne({_id: id})
	.populate('apler', 'code')
	.exec(function(err, object){
		if(err) console.log(err);
		if(object) {
			req.body.object = object;
			next();
		} else {
			info = "This Cared is deleted, Please reflesh"
			Index.sfOptionWrong(req, res, info)
		}
	})
}

exports.sfCared = function(req, res) {
	let object = req.body.object;
	res.render('./sfer/sfer/cared/detail', {
		title: 'Cared Info',
		crSfer: req.session.crSfer,
		object: object
	})
}

exports.sfCaredDel = function(req, res) {
	let object = req.body.object;
	Cared.remove({_id: object._id}, function(err, objDel) {
		if(err) console.log(err);
		res.redirect('/sfCareds')
	})
}