let Index = require('./index')
let Sfer = require('../../../models/user/sfer')

let _ = require('underscore')

exports.hrSfers = function(req, res) {
	Sfer.find({'role': {'$in': [1, 2, 3, 4, 5, 6, 10, 11]}})
	.sort({'role': 1, 'part': -1, 'code': 1})
	.exec(function(err, objects) {
		if(err) console.log(err);
		res.render('./sfer/hrer/sfer/list', {
			title: '用户列表',
			crSfer: req.session.crSfer,
			objects: objects
		})
	})
}