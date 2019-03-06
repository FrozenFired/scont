let Fner = require('../../../models/user/sfer');

exports.fner = function(req, res) {
	res.render('./sfer/fner/index/index', {
		title: '中国首页',
		crFner : req.session.crFner,
	});
}



fnWrongpage = function(req, res, info){
	res.render('./sfer/fner/index/optionWrong', {
		title: '500-15 Page',
		info: info
	});
}

exports.fnOptionWrong = function(req, res, info) {
	res.render('./sfer/fner/index/optionWrong', {
		title: '500-15 Page',
		crFner: req.session.crQter,
		info: info
	});
}