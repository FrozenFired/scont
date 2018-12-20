let Index = require('./index');
let Mger = require('../../models/user/mger');
let _ = require('underscore');


exports.mgerDetail = function(req, res) {
	let id = req.params.id;
	Mger.findOne({_id: id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "This code is not exist";
			Index.mgOptionWrong(req, res, info);
		} else {
			res.render('./mger/mger/detail', {
				title: '用户列表',
				crMger : req.session.crMger,
				object: object
			});
		}
	});
}

exports.checkMgerUp = function(req, res, next) {
	let objBody = req.body.object;
	Mger.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "Your code is deleted";
			Index.mgOptionWrong(req, res, info);
		} else {
			let _object = _.extend(object, objBody);
			req.body.object = _object;
			next();
		}
	});
}
exports.updateMgerInfo = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err);
		res.redirect("/mgerDetail/"+objSave._id);
	});
}

let bcrypt = require('bcryptjs');
exports.checkMgerOrgPw = function(req, res, next) {
	let objBody = req.body.object;
	Mger.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "Your code is deleted";
			Index.mgOptionWrong(req, res, info);
		} else {
			bcrypt.compare(req.body.orgPw, object.password, function(err, isMatch) {
				if(err) console.log(err);
				if(!isMatch) {
					info = "密码不符，请重新登陆";
					Index.mgOptionWrong(req, res, info);
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
exports.updateMgerPw = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err);
		res.redirect("/mgerDetail/"+objSave._id);
	});
}