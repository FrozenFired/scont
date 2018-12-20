// let Conf = require('../../confile/conf')
let AdIndex = require('../controllers/ader/index')
exports.aderIsLogin = function(req, res, next) {
	let crAder = req.session.crAder
	if(!crAder) {
		info = "需要登录您的 Administrator 账户"
		return AdIndex.adOptionWrong(req, res, info)
	}
	next()
}


let MgIndex = require('../controllers/mger/index')
exports.mgerIsLogin = function(req, res, next) {
	let crMger = req.session.crMger
	if(!crMger) {
		info = "需要登录您的 Manager 账户"
		return MgIndex.mgOptionWrong(req, res, info)
	}
	next()
}



let Sfer = require('../models/user/sfer')

let sfIndex = require('../controllers/sfer/index')
exports.sferIsLogin = function(req, res, next) {
	let crSfer = req.session.crSfer
	if(!crSfer) {
		info = "Need to log in to your employee account";
		return sfIndex.sfOptionWrong(req, res, info)
	}
	next()
}

exports.singleSferLogin = function(req, res, next){
	var crSfer = req.session.crSfer
	Sfer.findById(crSfer._id, function(err, sfer){
		if(err) {console.log(err)}

		if(crSfer.loginTime == sfer.loginTime){
			next()
		}else{
			res.redirect('/sferLogout')
		}
	})
}


exports.sfitIsLogin = function(req, res, next) {
	let crQter = req.session.crQter
	let crBner = req.session.crBner
	if(!crQter && !crBner) {
		info = "Need permission staff from Italy"
		return sfIndex.sfOptionWrong(req, res, info)
	}
	next()
}


exports.qterIsLogin = function(req, res, next) {
	let crQter = req.session.crQter
	if(!crQter) {
		info = "Need permission from the quotazione department"
		return sfIndex.sfOptionWrong(req, res, info)
	}
	next()
}



exports.bnerIsLogin = function(req, res, next) {
	let crBner = req.session.crBner
	if(!crBner) {
		info = "Need permission from the brand department";
		return sfIndex.sfOptionWrong(req, res, info)
	}
	next()
}



exports.cnerIsLogin = function(req, res, next) {
	let crCner = req.session.crCner
	if(!crCner) {
		info = "需要登录您的账户"
		return sfIndex.sfOptionWrong(req, res, info)
	}
	next()
}