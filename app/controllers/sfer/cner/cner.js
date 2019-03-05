let Index = require('./index')
let ObjDB = require('../../../models/user/sfer')
let _ = require('underscore')


exports.cnerFilter = function(req, res, next) {
	let crCner = req.session.crCner;
	let id = crCner._id;
	ObjDB.findOne({_id: id})
	.exec(function(err, object) {
		if(err) { console.log(err); console.log(cnerFilter); }
		if(!object) {
			info = "此帐号已经被删除";
			Index.cnOptionWrong(req, res, info);
		} else {
			req.body.object = object;
			next();
		}
	})
}
exports.cnerInfo = function(req, res) {
	let object = req.body.object;
	let objBody = new Object();
	objBody.crCner = req.session.crCner;
	objBody.object = object;
	objBody.thisAct = "/cnerInfo";
	objBody.title = "个人信息";
	res.render('./sfer/cner/self/detail', objBody)
}




exports.cnerUp = function(req, res) {
	let obj = req.body.object
	if(obj._id != req.session.crCner._id) {
		info = "您无权修改别人密码";
		Index.cnOptionWrong(req, res, info);
	} else {
		ObjDB.findOne({_id: obj._id}, function(err, object) {
			if(err) { console.log(err); console.log("cnerUp"); }
			if(!object) {
				info = "此用户已经被删除";
				Index.cnOptionWrong(req, res, info);
			} else {
				if(obj.password || obj.password == "") {
					prCnerPwd(req, res, obj, object, req.body.orgPw);
				} else {
					saveCner(req, res, obj, object);
				}
			}
		})
	}
}
let bcrypt = require('bcryptjs');
let prCnerPwd = function(req, res, obj, object, orgPw) {
	orgPw = orgPw.replace(/(\s*$)/g, "").replace( /^\s*/, '');
	bcrypt.compare(orgPw, object.password, function(err, isMatch) {
		if(err) console.log(err);
		if(!isMatch) {
			info = "原密码错误，请重新操作";
			Index.cnOptionWrong(req, res, info);
		}
		else {
			saveCner(req, res, obj, object);
		}
	});
}
let saveCner = function(req, res, obj, object) {
	let _object = _.extend(object, obj)
	_object.save(function(err, objSave) {
		if(err) {
			info = "更新公司用户时数据库保存数据时出现错误, 请联系管理员"
			Index.cnOptionWrong(req, res, info);
		} else {
			res.redirect("/cnerInfo")
		}
	})
}
