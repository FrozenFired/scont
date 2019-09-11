let Cber = require('../../../models/user/sfer');

exports.cber = function(req, res) {
	res.render('./sfer/cber/index/index', {
		title: '中国首页',
		crSfer : req.session.crSfer,
	});
}



cbWrongpage = function(req, res, info){
	res.render('./sfer/cber/index/optionWrong', {
		title: '500-15 Page',
		info: info
	});
}

exports.cbOptionWrong = function(req, res, info) {
	res.render('./sfer/cber/index/optionWrong', {
		title: '500-15 Page',
		crSfer: req.session.crSfer,
		info: info
	});
}