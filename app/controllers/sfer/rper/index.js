exports.rper = function(req, res) {
	res.render('./sfer/rper/index/index', {
		title: 'Reception',
		crSfer: req.session.crSfer,
	});
}



rpWrongpage = function(req, res, info){
	res.render('./sfer/rper/index/optionWrong', {
		title: '500-15 Page',
		info: info
	});
}

exports.rpOptionWrong = function(req, res, info) {
	res.render('./sfer/rper/index/optionWrong', {
		title: '500-15 Page',
		crSfer: req.session.crSfer,
		info: info
	});
}