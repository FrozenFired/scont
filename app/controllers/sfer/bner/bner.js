let Index = require('./index')
let ObjDB = require('../../../models/user/sfer')
let _ = require('underscore')


exports.bnerFilter = function(req, res, next) {
	let crSfer = req.session.crSfer;
	let id = crSfer._id;
	ObjDB.findOne({_id: id})
	.exec(function(err, object) {
		if(err) { console.log(err); console.log(bnerFilter); }
		if(!object) {
			info = "此帐号已经被删除";
			Index.bnOptionWrong(req, res, info);
		} else {
			req.body.object = object;
			next();
		}
	})
}
exports.bnerInfo = function(req, res) {
	let object = req.body.object;
	let objBody = new Object();
	objBody.crSfer = req.session.crSfer;
	objBody.object = object;
	objBody.thisAct = "/bnerInfo";
	objBody.title = "个人信息";
	res.render('./sfer/bner/self/detail', objBody)
}




exports.bnerUp = function(req, res) {
	let obj = req.body.object
	if(obj._id != req.session.crSfer._id) {
		info = "您无权修改别人密码";
		Index.bnOptionWrong(req, res, info);
	} else {
		ObjDB.findOne({_id: obj._id}, function(err, object) {
			if(err) { console.log(err); console.log("bnerUp"); }
			if(!object) {
				info = "此用户已经被删除";
				Index.bnOptionWrong(req, res, info);
			} else {
				if(obj.password || obj.password == "") {
					prBnerPwd(req, res, obj, object, req.body.orgPw);
				} else {
					saveBner(req, res, obj, object);
				}
			}
		})
	}
}
let bcrypt = require('bcryptjs');
let prBnerPwd = function(req, res, obj, object, orgPw) {
	orgPw = orgPw.replace(/(\s*$)/g, "").replace( /^\s*/, '');
	bcrypt.compare(orgPw, object.password, function(err, isMatch) {
		if(err) console.log(err);
		if(!isMatch) {
			info = "原密码错误，请重新操作";
			Index.bnOptionWrong(req, res, info);
		}
		else {
			saveBner(req, res, obj, object);
		}
	});
}
let saveBner = function(req, res, obj, object) {
	let _object = _.extend(object, obj)
	_object.save(function(err, objSave) {
		if(err) console.log("更新公司用户时数据库保存数据时出现错误, 请联系管理员");
		res.redirect("/bnerInfo");
	})
}


// Ajax
exports.bnAjaxSfer = function(req, res) {
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