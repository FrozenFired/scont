let Mger = require('../../models/user/mger');
let bcrypt = require('bcryptjs');


// let Conf = require('../../../confile/conf.js')
exports.mgerCheck = function(req, res, next) {
	if(!req.session.crMger) {
		res.redirect('/mgerLogin');
	} else {
		next();
	}
}
exports.mger = function(req, res) {
	res.render('./mger/index/index', {
		title: 'Manage Home',
		crMger : req.session.crMger,
	});
}





mgWrongpage = function(req, res, info){
	res.render('./mger/index/optionWrong', {
		title: '操作错误',
		crMger: req.session.crMger,
		info: info
	});
}



exports.mgOptionWrong = function(req, res, info) {
	res.render('./mger/index/optionWrong', {
		title: '操作错误',
		crMger: req.session.crMger,
		info: info
	});
}