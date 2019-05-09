exports.lger = function(req, res) {
	res.render('./sfer/lger/index/index', {
		title: 'Logistic',
		crSfer: req.session.crSfer,
	});
}



lgWrongpage = function(req, res, info){
	res.render('./sfer/lger/index/optionWrong', {
		title: '500-15 Page',
		info: info
	});
}

exports.lgOptionWrong = function(req, res, info) {
	res.render('./sfer/lger/index/optionWrong', {
		title: '500-15 Page',
		crSfer: req.session.crSfer,
		info: info
	});
}