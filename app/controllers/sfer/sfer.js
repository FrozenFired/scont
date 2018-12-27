let Index = require('./index');
let Sfer = require('../../models/user/sfer');
let _ = require('underscore');

exports.sferDetail = function(req, res) {
	let id = req.params.id;
	Sfer.findOne({_id: id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "This code is not exist";
			Index.sfOptionWrong(req, res, info);
		} else {
			res.render('./sfer/self/detail', {
				title: '用户列表',
				crSfer : req.session.crSfer,
				object: object
			});
		}
	});
}

exports.checkSferUp = function(req, res, next) {
	let objBody = req.body.object;
	Sfer.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "Your code is deleted";
			Index.sfOptionWrong(req, res, info);
		} else {
			let _object = _.extend(object, objBody);
			req.body.object = _object;
			next();
		}
	});
}
exports.updateSferInfo = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err);
		req.session.crSfer = objSave
		if(objSave.role == 5) {
			req.session.crBner = objSave
		}else if(objSave.role == 10) {
			req.session.crQter = objSave
		} else if(objSave.role == 15) {
			req.session.crCner = objSave
		}
		res.redirect("/sferDetail/"+objSave._id);
	});
}

let bcrypt = require('bcryptjs');
exports.checkSferOrgPw = function(req, res, next) {
	let objBody = req.body.object;
	Sfer.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "Your code is deleted";
			Index.sfOptionWrong(req, res, info);
		} else {
			bcrypt.compare(req.body.orgPw, object.password, function(err, isMatch) {
				if(err) console.log(err);
				if(!isMatch) {
					info = "密码不符，请重新登陆";
					Index.sfOptionWrong(req, res, info);
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
exports.updateSferPw = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err);
		res.redirect("/sferDetail/"+objSave._id);
	});
}








// Ajax
exports.ajaxSfer = function(req, res) {
	let keytpye = req.query.keytype
	let keyword = req.query.keyword.toUpperCase();
	// console.log(keytpye)
	// console.log(keyword)
	Sfer.findOne({[keytpye]: keyword}, function(err, sfer) {
		if(err) console.log(err);
		if(sfer){
			res.json({success: 1, sfer: sfer})
		} else {
			Sfer.find({[keytpye]: new RegExp(keyword + '.*')}, function(err, sfers) {
				if(err) console.log(err);
				if(sfers && sfers.length > 0) {
					res.json({success: 2, sfers: sfers});
				} else {
					res.json({success: 0})
				}
			})
		}
	})
}