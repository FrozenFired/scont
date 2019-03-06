let Qter = require('../../../models/user/sfer');

exports.qter = function(req, res) {
	res.render('./sfer/qter/index/index', {
		title: 'Quotazione',
		crSfer: req.session.crSfer,
	});
}



qtWrongpage = function(req, res, info){
	res.render('./sfer/qter/index/optionWrong', {
		title: '500-15 Page',
		info: info
	});
}

exports.qtOptionWrong = function(req, res, info) {
	res.render('./sfer/qter/index/optionWrong', {
		title: '500-15 Page',
		crSfer: req.session.crSfer,
		info: info
	});
}