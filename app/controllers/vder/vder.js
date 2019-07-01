let Index = require('./index');
let Vder = require('../../models/scont/vendor');
let _ = require('underscore');

exports.vderDetail = function(req, res) {
	let id = req.params.id;
	Vder.findOne({_id: id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "This code is not exist";
			Index.vdOptionWrong(req, res, info);
		} else {
			res.render('./vder/self/detail', {
				title: '用户列表',
				crVder : req.session.crVder,
				object: object
			});
		}
	});
}

exports.checkVderUp = function(req, res, next) {
	let objBody = req.body.object;
	Vder.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "Your code is deleted";
			Index.vdOptionWrong(req, res, info);
		} else {
			let _object = _.extend(object, objBody);
			req.body.object = _object;
			next();
		}
	});
}
exports.updateVderInfo = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err);
		req.session.crVder = objSave
		res.redirect("/vderDetail/"+objSave._id);
	});
}

let bcrypt = require('bcryptjs');
exports.checkVderOrgPw = function(req, res, next) {
	let objBody = req.body.object;
	Vder.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "Your code is deleted";
			Index.vdOptionWrong(req, res, info);
		} else {
			bcrypt.compare(req.body.orgPw, object.password, function(err, isMatch) {
				if(err) console.log(err);
				if(!isMatch) {
					info = "密码不符，请重新登陆";
					Index.vdOptionWrong(req, res, info);
				}
				else {
					let _object = _.extend(object, objBody);
					req.body.object = _object;
					next();
				}
			});
		}
	});
}
exports.updateVderPw = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err);
		res.redirect("/vderDetail/"+objSave._id);
	});
}