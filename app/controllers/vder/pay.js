let Index = require('./index')
let Order = require('../../models/finance/order')
let Pay = require('../../models/finance/pay')
let _ = require('underscore')

let Filter = require('../../middle/filter');

let Conf = require('../../../confile/conf.js')
let moment = require('moment')


exports.payRoop = function(req, res, next) {
	let crVder = req.session.crVder;

	Pay.find()
	.populate('order')
	.exec(function(err, pays) {
		if(err) console.log(err);
		let len = pays.length;
		for(i=0; i<len; i++){
			pays[i].vder = pays[i].order.vder;
			pays[i].save(function(err, paySave) {
				if(err) console.log(err);
			})
		}
		res.redirect('/')
	})
}


exports.payList = function(req, res, next) {
	let crVder = req.session.crVder;

	Pay.find({vder: crVder._id})
	.exec(function(err, pays) {
		if(err)console.log(err);
		let len = pays.length;
		// console.log(len)
	})
}
