let Ader = require('../../models/user/ader')
let bcrypt = require('bcryptjs')

exports.ader = function(req, res, next) {
	if(!req.session.crAder) {
		res.redirect('/aderLogin')
	} else {
		res.render('./ader/index/index', {
			title: 'Adminnistrator Home',
			crAder : req.session.crAder,
		})
	}
}



exports.aderLogin = function(req, res) {
	res.render('./ader/index/login', {
		title: 'Admin Login',
		action: "/loginAder",
		code: "code",
		password: "password"
	})
}




exports.loginAder = function(req, res) {
	let code = req.body.code.replace(/(\s*$)/g, "").replace( /^\s*/, '')
	let password = req.body.password.replace(/(\s*$)/g, "").replace( /^\s*/, '')
	Ader.findOne({code: code}, function(err, object) {
		if(err) console.log(err);
		if(!object){
			info = "Adminnistrator Code 不正确，请重新登陆"
			adWrongpage(req, res, info)
		}
		else{
			bcrypt.compare(password, object.password, function(err, isMatch) {
				if(err) console.log(err)
				if(isMatch) {
					req.session.crAder = object
					res.redirect('/ader')
				}
				else {
					info = "用户名与密码不符，请重新登陆"
					adWrongpage(req, res, info)
				}
			})
		}
	})
}




exports.aderLogout = function(req, res) {
	// let id = req.session.crAder._id
	delete req.session.crAder
	res.redirect('/ader')
}




adWrongpage = function(req, res, info){
	res.render('./ader/index/optionWrong', {
		title: '操作错误',
		crAder: req.session.crAder,
		info: info
	})
}



exports.adOptionWrong = function(req, res, info) {
	res.render('./ader/index/optionWrong', {
		title: '操作错误',
		crAder: req.session.crAder,
		info: info
	})
}