let Oder = require('../../../models/user/sfer');

exports.oder = function(req, res) {
	res.render('./sfer/oder/index/index', {
		title: 'Order Partment',
		crSfer: req.session.crSfer,
	});
}



odWrongpage = function(req, res, info){
	res.render('./sfer/oder/index/optionWrong', {
		title: '500-15 Page',
		info: info
	});
}

exports.odOptionWrong = function(req, res, info) {
	res.render('./sfer/oder/index/optionWrong', {
		title: '500-15 Page',
		crSfer: req.session.crSfer,
		info: info
	});
}