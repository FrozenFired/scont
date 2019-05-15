let Sfer = require('../../../models/user/sfer');

exports.bner = function(req, res) {
	res.render('./sfer/bner/index/index', {
		title: 'Brand',
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


exports.bnAjaxSfer = function(req, res) {
	let keytype = req.query.keytype;
	let keyword = req.query.keyword.toUpperCase();
	Sfer.findOne({[keytype]: keyword},{code:1, _id:1})
	.exec(function(err, sfer) {
		if(err) console.log(err);
		if(sfer) {
			res.json({success: 1, sfer: sfer})
		} else {
			Sfer.find({[keytype]: new RegExp(keyword + '.*')},{code:1, _id:1})
			.exec(function(err, sfers) {
				if(err) console.log(err);
				if(sfers && sfers.length > 0) {
					res.json({success: 2, sfers: sfers})
				} else {
					res.json({success: 0})
				}
			})
		}
	})
}