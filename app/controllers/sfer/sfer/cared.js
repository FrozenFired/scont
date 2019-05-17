let Index = require('./index')
let Cared = require('../../../models/task/cared')
let _ = require('underscore')

exports.sfCareds = function(req, res) {
	Cared.find()
	.populate('car', 'code nome')
	.populate('apler', 'code')
	.populate('cfmer', 'code')
	.populate('ender', 'code')
	.exec(function(err, objects) {
		if(err) console.log(err);
		// console.log(objects)
		res.render('./sfer/sfer/cared/list', {
			title: 'Careds',
			crSfer: req.session.crSfer,
			objects: objects
		})
	})
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