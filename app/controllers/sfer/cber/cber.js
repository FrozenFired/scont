let Index = require('./index')
let ObjDB = require('../../../models/user/sfer')
let _ = require('underscore')


exports.cberFilter = function(req, res, next) {
	let crSfer = req.session.crSfer;
	let id = crSfer._id;
	ObjDB.findOne({_id: id})
	.exec(function(err, object) {
		if(err) { console.log(err); console.log(cberFilter); }
		if(!object) {
			info = "此帐号已经被删除";
			Index.cbOptionWrong(req, res, info);
		} else {
			req.body.object = object;
			next();
		}
	})
}
exports.cberInfo = function(req, res) {
	let object = req.body.object;
	let objBody = new Object();
	objBody.crSfer = req.session.crSfer;
	objBody.object = object;
	objBody.thisAct = "/cberInfo";
	objBody.title = "个人信息";
	res.render('./sfer/cber/self/detail', objBody)
}




exports.cberUp = function(req, res) {
	let obj = req.body.object
	if(obj._id != req.session.crSfer._id) {
		info = "您无权修改别人密码";
		Index.cbOptionWrong(req, res, info);
	} else {
		ObjDB.findOne({_id: obj._id}, function(err, object) {
			if(err) { console.log(err); console.log("cberUp"); }
			if(!object) {
				info = "此用户已经被删除";
				Index.cbOptionWrong(req, res, info);
			} else {
				if(obj.password || obj.password == "") {
					prCberPwd(req, res, obj, object, req.body.orgPw);
				} else {
					saveCber(req, res, obj, object);
				}
			}
		})
	}
}
let bcrypt = require('bcryptjs');
let prCberPwd = function(req, res, obj, object, orgPw) {
	orgPw = orgPw.replace(/(\s*$)/g, "").replace( /^\s*/, '');
	bcrypt.compare(orgPw, object.password, function(err, isMatch) {
		if(err) console.log(err);
		if(!isMatch) {
			info = "原密码错误，请重新操作";
			Index.cbOptionWrong(req, res, info);
		}
		else {
			saveCber(req, res, obj, object);
		}
	});
}
let saveCber = function(req, res, obj, object) {
	let _object = _.extend(object, obj)
	_object.save(function(err, objSave) {
		if(err) {
			info = "更新公司用户时数据库保存数据时出现错误, 请联系管理员"
			Index.cbOptionWrong(req, res, info);
		} else {
			res.redirect("/cberInfo")
		}
	})
}
