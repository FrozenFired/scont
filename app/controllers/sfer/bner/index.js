let Bner = require('../../../models/user/sfer');

exports.bner = function(req, res) {
	res.render('./sfer/bner/index/index', {
		title: 'Quotazione',
		crSfer: req.session.crSfer,
	});
}



bnWrongpage = function(req, res, info){
	res.render('./sfer/bner/index/optionWrong', {
		title: '500-15 Page',
		info: info
	});
}

exports.bnOptionWrong = function(req, res, info) {
	res.render('./sfer/bner/index/optionWrong', {
		title: '500-15 Page',
		crSfer: req.session.crSfer,
		info: info
	});
}