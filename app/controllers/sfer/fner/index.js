let Fner = require('../../../models/user/sfer');

exports.fner = function(req, res) {
	res.render('./sfer/fner/index/index', {
		title: 'Contabilita',
		crSfer : req.session.crSfer,
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
		crSfer: req.session.crSfer,
		info: info
	});
}