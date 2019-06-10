exports.mker = function(req, res) {
	res.render('./sfer/mker/index/index', {
		title: 'Market',
		crSfer: req.session.crSfer,
	});
}


mkWrongpage = function(req, res, info){
	res.render('./sfer/mker/index/optionWrong', {
		title: '500-15 Page',
		info: info
	});
}

exports.mkOptionWrong = function(req, res, info) {
	res.render('./sfer/mker/index/optionWrong', {
		title: '500-15 Page',
		crSfer: req.session.crSfer,
		info: info
	});
}