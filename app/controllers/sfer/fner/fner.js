let Index = require('./index')
let ObjDB = require('../../../models/user/sfer')
let _ = require('underscore')


exports.fnerFilter = function(req, res, next) {
	let crFner = req.session.crFner;
	let id = crFner._id;
	ObjDB.findOne({_id: id})
	.exec(function(err, object) {
		if(err) { console.log(err); console.log(fnerFilter); }
		if(!object) {
			info = "此帐号已经被删除";
			Index.fnOptionWrong(req, res, info);
		} else {
			req.body.object = object;
			next();
		}
	})
}
exports.fnerInfo = function(req, res) {
	let object = req.body.object;
	let objBody = new Object();
	objBody.crFner = req.session.crFner;
	objBody.object = object;
	objBody.thisAct = "/fnerInfo";
	objBody.title = "个人信息";
	res.render('./sfer/fner/self/detail', objBody)
}




exports.fnerUp = function(req, res) {
	let obj = req.body.object
	if(obj._id != req.session.crFner._id) {
		info = "您无权修改别人密码";
		Index.fnOptionWrong(req, res, info);
	} else {
		ObjDB.findOne({_id: obj._id}, function(err, object) {
			if(err) { console.log(err); console.log("fnerUp"); }
			if(!object) {
				info = "此用户已经被删除";
				Index.fnOptionWrong(req, res, info);
			} else {
				if(obj.password || obj.password == "") {
					prFnerPwd(req, res, obj, object, req.body.orgPw);
				} else {
					saveFner(req, res, obj, object);
				}
			}
		})
	}
}
let bcrypt = require('bcryptjs');
let prFnerPwd = function(req, res, obj, object, orgPw) {
	orgPw = orgPw.replace(/(\s*$)/g, "").replace( /^\s*/, '');
	bcrypt.compare(orgPw, object.password, function(err, isMatch) {
		if(err) console.log(err);
		if(!isMatch) {
			info = "原密码错误，请重新操作";
			Index.fnOptionWrong(req, res, info);
		}
		else {
			saveFner(req, res, obj, object);
		}
	});
}
let saveFner = function(req, res, obj, object) {
	let _object = _.extend(object, obj)
	_object.save(function(err, objSave) {
		if(err) {
			info = "更新公司用户时数据库保存数据时出现错误, 请联系管理员"
			Index.fnOptionWrong(req, res, info);
		} else {
			res.redirect("/fnerInfo")
		}
	})
}
