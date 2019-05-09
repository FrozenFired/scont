// 更加安全的话可以每次验证都经过数据库, 现在的实际情况不需要
let Index = require('../controllers/aalogin/login')

exports.aderIsLogin = function(req, res, next) {
	let crAder = req.session.crAder
	if(!crAder) {
		info = "需要登录您的 Administrator 账户"
		Index.optionError(req, res, info)
	} else {
		next()
	}
}


exports.mgerIsLogin = function(req, res, next) {
	let crMger = req.session.crMger
	if(!crMger) {
		info = "需要登录您的 Manager 账户"
		Index.optionError(req, res, info)
	} else {
		next()
	}
}

exports.vderIsLogin = function(req, res, next) {
	let crVder = req.session.crVder
	if(!crVder) {
		info = "需要登录您的 Manager 账户"
		Index.optionError(req, res, info)
	} else {
		next()
	}
}


let Sfer = require('../models/user/sfer')

exports.sferIsLogin = function(req, res, next) {
	let crSfer = req.session.crSfer
	if(!crSfer) {
		info = "Need to log in to your employee account";
		Index.optionError(req, res, info)
	} else {
		next()
	}
}

exports.sfUniLog = function(req, res, next){
	let crSfer = req.session.crSfer
	if(crSfer) {
		Sfer.findById(crSfer._id, function(err, sfer){
			if(err) {console.log(err)}

			if(crSfer.loginTime == sfer.loginTime){
				next()
			}else{
				res.redirect('/logout')
			}
		})
	} else {
		res.redirect('/logout')
	}
}



exports.qterIsLogin = function(req, res, next) {
	let crQter = req.session.crQter
	if(!crQter) {
		info = "Need permission from the quotazione department"
		Index.optionError(req, res, info)
	} else {
		next()
	}
}



exports.bnerIsLogin = function(req, res, next) {
	let crBner = req.session.crBner
	if(!crBner) {
		info = "Need permission from the brand department";
		Index.optionError(req, res, info)
	} else {
		next()
	}
}



exports.cnerIsLogin = function(req, res, next) {
	let crCner = req.session.crCner
	if(!crCner) {
		info = "需要登录您的账户"
		Index.optionError(req, res, info)
	} else {
		next()
	}
}

exports.fnerIsLogin = function(req, res, next) {
	let crFner = req.session.crFner
	if(!crFner) {
		info = "Need permission from the Contabilita department";
		Index.optionError(req, res, info)
	} else {
		next()
	}
}

exports.oderIsLogin = function(req, res, next) {
	let crOder = req.session.crOder
	if(!crOder) {
		info = "Need permission from the Order department";
		Index.optionError(req, res, info)
	} else {
		next()
	}
}

exports.lgerIsLogin = function(req, res, next) {
	let crLger = req.session.crLger
	if(!crLger) {
		info = "Need permission from the Contabilita department";
		Index.optionError(req, res, info)
	} else {
		next()
	}
}