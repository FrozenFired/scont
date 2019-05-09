sfWrongpage = function(req, res, info){
	res.render('./sfer/sfer/index/optionWrong', {
		title: '500-15 Page',
		info: info
	});
}

exports.sfOptionWrong = function(req, res, info) {
	res.render('./sfer/sfer/index/optionWrong', {
		title: '500-15 Page',
		crSfer: req.session.crSfer,
		info: info
	});
}