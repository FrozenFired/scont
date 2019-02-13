let Vder = require('../../models/scont/vendor');
let bcrypt = require('bcryptjs');


exports.vder = function(req, res) {
	if(!req.session.crVder) {
		res.redirect('/vderLogin');
	} else {
		res.redirect('/orderList');
		// res.render('./vder/index/index', {
		// 	title: 'Manage Home',
		// 	crVder : req.session.crVder,
		// });
	}
}






vdWrongpage = function(req, res, info){
	res.render('./vder/index/optionWrong', {
		title: '操作错误',
		crVder: req.session.crVder,
		info: info
	});
}



exports.vdOptionWrong = function(req, res, info) {
	res.render('./vder/index/optionWrong', {
		title: '操作错误',
		crVder: req.session.crVder,
		info: info
	});
}