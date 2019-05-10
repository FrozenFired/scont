exports.index = function(req, res) {
	// 判断是否登录
	let crVder = req.session.crVder;
	let crMger = req.session.crMger;
	let crSfer = req.session.crSfer;
	if(req.session.crVder) {
		res.redirect('/vder');
	}
	else if(crSfer && crSfer.role == 15) {
		res.redirect('/cner');
	}
	else if(crSfer && crSfer.role == 10) {
		res.redirect('/qter');
	}
	else if(crSfer && crSfer.role == 5) {
		res.redirect('/bner');
	}
	else if(crSfer && crSfer.role == 1) {
		res.redirect('/oder');
	}
	else if(crSfer && crSfer.role == 2) {
		res.redirect('/fner');
	}
	else if(crSfer && crSfer.role == 3) {
		res.redirect('/lger');
	}
	else if(req.session.crMger) {
		res.redirect('/mger');
	}
	else {
		res.redirect('/login');
	}
}



exports.login = function(req, res) {
	res.render('./aaViews/index/login', {
		title: 'Signin',
		action: "/loginUser",
		code: "code",
		password: "password"
	});
}



let Vder = require('../../models/scont/vendor');

let Sfer = require('../../models/user/sfer');
let Mger = require('../../models/user/mger');
let bcrypt = require('bcryptjs');
exports.loginUser = function(req, res) {
	let code = req.body.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	let password = String(req.body.password).replace(/(\s*$)/g, "").replace( /^\s*/, '');
	if(password.length == 0) password = " ";

	loginVder(req, res, code, password);
}
loginVder = function(req, res, code, password) {
	Vder.findOne({code: code})
	.where({'role': 0})			// 只有注册过的供应商可以登录-(条件限制)
	.exec(function(err, vder) {
		if(err) console.log(err);
		if(!vder){
			loginSfer(req, res, code, password);
		}
		else{
			bcrypt.compare(password, vder.password, function(err, isMatch) {
				if(err) console.log(err);
				if(isMatch) {
					req.session.crVder = vder;
					res.redirect('/vder');
				}
				else {
					loginSfer(req, res, code, password);
				}
			})
		}
	})
}
loginSfer = function(req, res, code, password) {
	Sfer.findOne({code: code}, function(err, sfer) {
		if(err) console.log(err);
		if(!sfer) {
			loginMger(req, res, code, password);
		} else {
			bcrypt.compare(password, sfer.password, function(err, isMatch) {
				if(err) console.log(err);
				if(isMatch) {
					let loginTime = Date.now()

					sfer.loginTime = loginTime
					sfer.save(function(err, sfer){
						if(err) console.log(err)
					})
					req.session.crSfer = sfer
					if(sfer.role == 20) {
						delete req.session.crSfer;
						loginMger(req, res, code, password);
					} else if(sfer.role == 15) {
						res.redirect('/cner');
					} else if(sfer.role == 10) {
						res.redirect('/qter');
					} else if(sfer.role == 5) {
						res.redirect('/bner');
					} else if(sfer.role == 3) {
						res.redirect('/lger');
					} else if(sfer.role == 2) {
						res.redirect('/fner');
					} else if(sfer.role == 1) {
						res.redirect('/oder');
					} else {
						res.redirect('/');
					}
				}
				else {
					loginMger(req, res, code, password);
				}
			})
		}
	})
}
loginMger = function(req, res, code, password) {
	Mger.findOne({code: code}, function(err, mger) {
		if(err) console.log(err);
		if(!mger){
			info = "用户名不正确，请重新登陆";
			wrongPage(req, res, info);
		}
		else{
			bcrypt.compare(password, mger.password, function(err, isMatch) {
				if(err) console.log(err);
				if(isMatch) {
					req.session.crMger = mger;
					res.redirect('/mger');
				}
				else {
					info = "用户名与密码不符，请重新登陆";
					wrongPage(req, res, info);
				}
			})
		}
	})
}

exports.logout = function(req, res) {
	// Sfer
	if(req.session.crSfer) delete req.session.crSfer;

	if(req.session.crLger) delete req.session.crLger;
	if(req.session.crOder) delete req.session.crOder;
	if(req.session.crFner) delete req.session.crFner;
	if(req.session.crBner) delete req.session.crBner;
	if(req.session.crQter) delete req.session.crQter;
	if(req.session.crCner) delete req.session.crCner;

	// vder
	if(req.session.crVder) delete req.session.crVder;
	// Mger
	if(req.session.crMger) delete req.session.crMger;
	// Ader
	if(req.session.crAder) delete req.session.crAder;

	res.redirect('/');
}



wrongPage = function(req, res, info){
	res.render('./aaViews/index/optionError', {
		title: '500-15 Page',
		info: info
	});
}
exports.optionError = function(req, res, info) {
	res.render('./aaViews/index/optionError', {
		title: '500-15 Page',
		crCner: req.session.crQter,
		info: info
	});
}