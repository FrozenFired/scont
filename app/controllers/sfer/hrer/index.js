exports.hrer = function(req, res) {
	res.render('./sfer/hrer/index/index', {
		title: 'HR',
		crSfer: req.session.crSfer,
	});
}

hrWrongpage = function(req, res, info){
	res.render('./sfer/hrer/index/optionWrong', {
		title: '500-15 Page',
		info: info
	});
}

exports.hrOptionWrong = function(req, res, info) {
	res.render('./sfer/hrer/index/optionWrong', {
		title: '500-15 Page',
		crSfer: req.session.crSfer,
		info: info
	});
}