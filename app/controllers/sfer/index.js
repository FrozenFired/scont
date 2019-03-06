let Sfer = require('../../models/user/sfer');
let bcrypt = require('bcryptjs');


exports.sfer = function(req, res) {
	// 判断是否登录
	// console.log(req.session.crSfer)
	if(req.session.crSfer) {
		if(req.session.crSfer.role == 1 && req.session.crOder) {		// 订单部
			res.render('./sfer/oder/index/index', {
				title: 'Contabilita',
				crOder : req.session.crOder,
			});
		}
		else if(req.session.crSfer.role == 2 && req.session.crFner) {	// 财务部
			res.redirect('/fner')
		}
		else if(req.session.crSfer.role == 10 && req.session.crQter) {	// 财务部
			res.redirect('/qter')
		}
		else if(req.session.crSfer.role == 15 && req.session.crCner) {	// 财务部
			res.redirect('/cner')
		}
		else {														// 品牌报价部
			if(req.session.crSfer.home) {
				let url = req.session.crSfer.home.replace(/(\s*$)/g, "").replace( /^\s*/, '')
				res.redirect('/'+url)
			} else {
				res.render('./sfer/index/index', {
					title: 'Staff',
					crSfer : req.session.crSfer,
				});
			}
		}
	} else {
		res.redirect('/login');
	}
}


exports.option = function(req, res) {
	res.render('./sfer/index/option', {
		title: 'option',
		crSfer : req.session.crSfer,
	});
}




sfWrongpage = function(req, res, info){
	res.render('./sfer/index/optionWrong', {
		title: '500-15 Page',
		info: info
	});
}

exports.sfOptionWrong = function(req, res, info) {
	res.render('./sfer/index/optionWrong', {
		title: '500-15 Page',
		crSfer: req.session.crQter,
		info: info
	});
}