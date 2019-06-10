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


exports.oderIsLogin = function(req, res, next) {
	let crSfer = req.session.crSfer
	if(crSfer && crSfer.role == 1) {
		next();
	} else {
		info = "Need permission from the Order department";
		Index.optionError(req, res, info)
	}
}

exports.fnerIsLogin = function(req, res, next) {
	let crSfer = req.session.crSfer
	if(crSfer && crSfer.role == 2) {
		next();
	} else {
		info = "Need permission from the Contabilita department";
		Index.optionError(req, res, info)
	}
}

exports.lgerIsLogin = function(req, res, next) {
	let crSfer = req.session.crSfer
	if(crSfer && crSfer.role == 3) {
		next()
	} else {
		info = "Need permission from the Logistica department";
		Index.optionError(req, res, info)
	}
}

exports.rperIsLogin = function(req, res, next) {
	let crSfer = req.session.crSfer
	if(crSfer && crSfer.role == 4) {
		next()
	} else {
		info = "Need permission from the Reception department";
		Index.optionError(req, res, info)
	}
}

exports.bnerIsLogin = function(req, res, next) {
	let crSfer = req.session.crSfer
	if(crSfer && crSfer.role == 5) {
		next();
	} else {
		info = "Need permission from the brand department";
		Index.optionError(req, res, info)
	}
}

exports.hrerIsLogin = function(req, res, next) {
	let crSfer = req.session.crSfer
	if(crSfer && crSfer.role == 6) {
		next()
	} else {
		info = "Need permission from the HR department";
		Index.optionError(req, res, info)
	}
}

exports.qterIsLogin = function(req, res, next) {
	let crSfer = req.session.crSfer
	if(crSfer && crSfer.role == 10) {
		next();
	} else {
		info = "Need permission from the quotazione department"
		Index.optionError(req, res, info)
	}
}

exports.mkerIsLogin = function(req, res, next) {
	let crSfer = req.session.crSfer
	if(crSfer && crSfer.role == 11) {
		next();
	} else {
		info = "Need permission from the Market department"
		Index.optionError(req, res, info)
	}
}


exports.cnerIsLogin = function(req, res, next) {
	let crSfer = req.session.crSfer
	if(crSfer && crSfer.role == 15) {
		next();
	} else {
		info = "需要登录您的账户"
		Index.optionError(req, res, info)
	}
}