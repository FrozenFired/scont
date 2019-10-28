let Index = require('./index')
let Order = require('../../../models/finance/order')
let Vder = require('../../../models/scont/vendor')
let Fattura = require('../../../models/finance/fattura')
let _ = require('underscore')

let Filter = require('../../../middle/filter');

let Conf = require('../../../../confile/conf.js')
let moment = require('moment')

exports.fnFatturas = function(req, res, next) {
	Fattura.find()
	.sort({'ctAt': -1})
	.exec(function(err, objects) {
		if(err) {
			console.log(err);
			info = "fnFatturas, Fattura.find, Error!"
			Index.fnOptionWrong(req, res, info)
		} else {
			res.render('./sfer/fner/fattura/list', {
				title: 'Fattura List',
				crSfer : req.session.crSfer,
				objects : objects
			})
		}
	})
}

exports.fnFattura = function(req, res, next) {
	let id = req.params.id;
	let crSfer = req.session.crSfer;
	Fattura.findOne({_id: id})
	.exec(function(err, object) {
		if(err) console.log(err);
		res.render('./sfer/fner/fattura/detail', {
			title: 'Fattura Detail',
			crSfer : req.session.crSfer,
			object : object
		})
	})
}

exports.fnFatturaAdd = function(req, res, next) {
	Fattura.findOne()
	.sort({'ctAt': -1})
	.exec(function(err, object) {
		if(err) console.log(err);
		// console.log(object)
		let code = 1; year = 19;
		if(object) {
			code = object.code+1;
			year = object.year;
		}
		res.render('./sfer/fner/fattura/add', {
			title: 'New Fattura',
			crSfer : req.session.crSfer,
			code : code,
			year : year,
		})
	})
}

exports.fnFatturaNew = function(req, res, next) {
	let crSfer = req.session.crSfer;
	let obj = req.body.obj;
	let goods = req.body.goods;
	if(goods instanceof Array && goods.length>0) {
		obj.goods = new Array();
		for(let i=0; i<goods.length; i++) {
			let pd = goods[i];
			if(!pd.code) pd.code="goods Code";
			if(!pd.hs) pd.hs="goods Code";

			if(!isNaN(parseInt(pd.quot))) {
				pd.quot=parseInt(pd.quot);
			} else {
				pd.quot = 0;
			}
			if(!isNaN(parseFloat(pd.price))) {
				pd.price=parseFloat(pd.price);
			} else {
				pd.price = 0;
			}
			if(!isNaN(parseFloat(pd.tot))) {
				pd.tot=parseFloat(pd.tot);
			} else {
				pd.tot = 0;
			}

			if(!pd.brand) pd.brand="Brand";
			if(!pd.order) pd.order="Order";
			if(!pd.Brand) pd.Brand=null;
			if(!pd.Order) pd.Order=null;
			if(!pd.desp) pd.desp="Description";

			obj.goods.push(pd);
		}
		if(obj.ctAuto) {
			obj.ctAuto = new Date(obj.ctAuto).setHours(23,59,59,1);
		} else {
			obj.ctAuto = Date.now();
		}
		Fattura.findOne({'code': obj.code, 'year': obj.year})
		.exec(function(err, object) {
			if(err) {
				console.log(err);
				info = "fnFatturaNew, Fattura.findOne, Error!"
				Index.fnOptionWrong(req, res, info)
			} else if(object) {
				info = "已经存在此发票号"
				Index.fnOptionWrong(req, res, info)
			} else {
				let _obj = new Fattura(obj)
				_obj.save(function(err, objSv) {
					if(err) console.log(err);

					res.redirect('/fnFattura/'+objSv._id)
				})
				// res.redirect('/fnFatturaAdd')
			}
		})
	} else {
		info = 'Please input "Goods"';
		Index.fnOptionWrong(req, res, info);
	}
}