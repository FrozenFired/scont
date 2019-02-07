let Sfer = require('../../models/user/sfer');
let bcrypt = require('bcryptjs');


exports.sfer = function(req, res) {
	// 判断是否登录
	if(!req.session.crSfer) {
		res.redirect('/sferLogin');
	} else {
		// 判断登录角色
		if(req.session.crSfer.role == 1 && req.session.crOder) {
			// 财务部
			res.render('./sfer/oder/index/index', {
				title: 'Contabilita',
				crOder : req.session.crOder,
			});
		}
		else if(req.session.crSfer.role == 2 && req.session.crFner) {
			// 财务部
			res.render('./sfer/fner/index/index', {
				title: 'Contabilita',
				crFner : req.session.crFner,
			});
		} else {
			// 品牌报价部
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
	}
}


exports.option = function(req, res) {
	res.render('./sfer/index/option', {
		title: 'option',
		crSfer : req.session.crSfer,
	});
}




exports.sferLogin = function(req, res) {
	res.render('./sfer/index/login', {
		title: 'Sfer Signin',
		action: "/loginSfer",
		code: "code",
		password: "password"
	});
}




exports.loginSfer = function(req, res) {
	let code = req.body.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	let password = String(req.body.password).replace(/(\s*$)/g, "").replace( /^\s*/, '');
	if(password.length == 0) {
		password = " ";
	}
	Sfer.findOne({code: code}, function(err, sfer) {
		if(err) console.log(err);
		if(!sfer) {
			sfer = new Object();
			sfer.password = "\n";
		}
		bcrypt.compare(password, sfer.password, function(err, isMatch) {
			if(err) console.log(err);
			if(isMatch) {
				let loginTime = Date.now()

				sfer.loginTime = loginTime
				sfer.save(function(err, sfer){
					if(err) console.log(err)
				})
				if(sfer.role == 20) {
					delete req.session.crSfer;
					info = "您已经离职, You are leaving our company, sorry";
					sfWrongpage(req, res, info);
				} else {
					req.session.crSfer = sfer
					if(sfer.role == 1) {
						req.session.crOder = sfer
					}else if(sfer.role == 2) {
						req.session.crFner = sfer
					}else if(sfer.role == 5) {
						req.session.crBner = sfer
					}else if(sfer.role == 10) {
						req.session.crQter = sfer
					} else if(sfer.role == 15) {
						req.session.crCner = sfer
					}
					res.redirect('/')
				}
			}
			else {
				info = "用户名与密码不符，请重新登陆";
				sfWrongpage(req, res, info);
			}
		})
	})
}

exports.sferLogout = function(req, res) {
	if(req.session.crSfer) delete req.session.crSfer;
	if(req.session.crOder) delete req.session.crOder;
	if(req.session.crFner) delete req.session.crFner;
	if(req.session.crBner) delete req.session.crBner;
	if(req.session.crQter) delete req.session.crQter;
	if(req.session.crCner) delete req.session.crCner;
	
	res.redirect('/');
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