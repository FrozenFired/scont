let Cner = require('../../../models/user/sfer');

exports.cner = function(req, res) {
	res.render('./sfer/cner/index/index', {
		title: '中国首页',
		crSfer : req.session.crSfer,
	});
}



cnWrongpage = function(req, res, info){
	res.render('./sfer/cner/index/optionWrong', {
		title: '500-15 Page',
		info: info
	});
}

exports.cnOptionWrong = function(req, res, info) {
	res.render('./sfer/cner/index/optionWrong', {
		title: '500-15 Page',
		crSfer: req.session.crSfer,
		info: info
	});
}