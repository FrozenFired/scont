var Sfer = require('../../models/user/sfer');
var bcrypt = require('bcryptjs');


exports.sfer = function(req, res) {
	if(!req.session.crSfer) {
		res.redirect('/sferLogin');
	} else {
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
	var code = req.body.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	var password = req.body.password.replace(/(\s*$)/g, "").replace( /^\s*/, '');
	Sfer.findOne({code: code}, function(err, sfer) {
		if(err) console.log(err);
		if(!sfer){
			info = "用户名不正确，请重新登陆";
			sfWrongpage(req, res, info);
		}
		else{
			bcrypt.compare(password, sfer.password, function(err, isMatch) {
				if(err) console.log(err);
				if(isMatch) {
					var loginTime = Date.now()

					sfer.loginTime = loginTime
					sfer.save(function(err, sfer){
						if(err) console.log(err)
					})
					req.session.crSfer = sfer
					if(sfer.role == 5) {
						req.session.crBner = sfer
					}else if(sfer.role == 10) {
						req.session.crQter = sfer
					} else if(sfer.role == 15) {
						req.session.crCner = sfer
					}
					res.redirect('/')
				}
				else {
					info = "用户名与密码不符，请重新登陆";
					sfWrongpage(req, res, info);
				}
			})
		}
	})
}

exports.sferLogout = function(req, res) {
	if(req.session.crSfer) delete req.session.crSfer;
	if(req.session.crQter) delete req.session.crQter;
	if(req.session.crBner) delete req.session.crBner;
	if(req.session.crCner) delete req.session.crCner;
	
	res.redirect('/');
}



sfWrongpage = function(req, res, info){
	res.render('./sfer/index/optionWrong', {
		title: '操作错误',
		info: info
	});
}

exports.sfOptionWrong = function(req, res, info) {
	res.render('./sfer/index/optionWrong', {
		title: '操作错误',
		crSfer: req.session.crQter,
		info: info
	});
}