let Mger = require('../../models/user/mger');
let bcrypt = require('bcryptjs');


exports.mgerCheck = function(req, res, next) {
	if(!req.session.crMger) {
		res.redirect('/mgerLogin');
	} else {
		next();
	}
}
exports.mger = function(req, res) {
	res.render('./mger/index/index', {
		title: 'Manage Home',
		crMger : req.session.crMger,
	});
}





exports.mgerLogin = function(req, res) {
	res.render('./mger/index/login', {
		title: 'Manager Signin',
		action: "/loginMger",
		code: "code",
		password: "password"
	});
}




exports.loginMger = function(req, res) {
	let code = req.body.code.replace(/(\s*$)/g, "").replace( /^\s*/, '');
	let password = req.body.password.replace(/(\s*$)/g, "").replace( /^\s*/, '');
	Mger.findOne({code: code}, function(err, object) {
		if(err) console.log(err);
		if(!object){
			info = "用户名不正确，请重新登陆";
			mgWrongpage(req, res, info);
		}
		else{
			bcrypt.compare(password, object.password, function(err, isMatch) {
				if(err) console.log(err);
				if(isMatch) {
					req.session.crMger = object;
					res.redirect('/mger');
				}
				else {
					info = "用户名与密码不符，请重新登陆";
					mgWrongpage(req, res, info);
				}
			})
		}
	})
}




exports.mgerLogout = function(req, res) {
	delete req.session.crMger;
	res.redirect('/mger');
}




mgWrongpage = function(req, res, info){
	res.render('./mger/index/optionWrong', {
		title: '操作错误',
		crMger: req.session.crMger,
		info: info
	});
}



exports.mgOptionWrong = function(req, res, info) {
	res.render('./mger/index/optionWrong', {
		title: '操作错误',
		crMger: req.session.crMger,
		info: info
	});
}