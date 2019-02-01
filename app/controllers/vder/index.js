let Vder = require('../../models/scont/vendor');
let bcrypt = require('bcryptjs');


exports.vder = function(req, res) {
	if(!req.session.crVder) {
		res.redirect('/vderLogin');
	} else {
		res.redirect('/paymentList');
		// res.render('./vder/index/index', {
		// 	title: 'Manage Home',
		// 	crVder : req.session.crVder,
		// });
	}
}





exports.vderLogin = function(req, res) {
	delete req.session.crVder;
	res.render('./vder/index/login', {
		title: 'Supplier Signin',
		action: "/loginVder",
		code: "code",
		password: "password"
	});
}




exports.loginVder = function(req, res) {
	let code = req.body.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	let password = req.body.password.replace(/(\s*$)/g, "").replace( /^\s*/, '');
	Vder.findOne({code: code})
	.where({'role': 0})
	.exec(function(err, object) {
		if(err) console.log(err);
		// console.log(object)
		if(!object){
			info = "用户名不正确，请重新登陆";
			vdWrongpage(req, res, info);
		}
		else{
			bcrypt.compare(password, object.password, function(err, isMatch) {
				if(err) console.log(err);
				if(isMatch) {
					req.session.crVder = object;
					res.redirect('/vder');
				}
				else {
					info = "用户名与密码不符，请重新登陆";
					vdWrongpage(req, res, info);
				}
			})
		}
	})
}




exports.vderLogout = function(req, res) {
	delete req.session.crVder;
	res.redirect('/vder');
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