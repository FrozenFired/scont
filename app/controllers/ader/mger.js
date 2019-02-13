let Index = require('./index')
let Mger = require('../../models/user/mger')
let _ = require('underscore')


exports.adMgerAdd =function(req, res) {
	res.render('./ader/mger/add', {
		title: 'Add Manager',
		crAder : req.session.crAder,
		action: "/adAddMger",
	})
}


exports.adExistMgerN = function(req, res, next) {
	let objBody = req.body.object;
	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Mger.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			info = "此帐号已经被注册，请重新注册";
			Index.adOptionWrong(req, res, info);
		}
		else {
			req.body.object = objBody;
			next();
		}
	})
}
exports.adAddMger = function(req, res) {
	let objBody = req.body.object
	
	let _object = new Mger(objBody)
	_object.save(function(err, objSave){
		if(err) console.log(err);
		res.redirect('/adMgerList')
	})
		
}

exports.adMgerList = function(req, res) {
	Mger.find(function(err, objects) {
		if(err) console.log(err)
		res.render('./ader/mger/list', {
			title: '用户列表',
			crAder : req.session.crAder,
			objects: objects
		})
	})
}


exports.adExistMgerY = function(req, res, next) {
	let id = req.params.id;
	Mger.findOne({_id: id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此帐号已经被删除";
			Index.adOptionWrong(req, res, info);
		}
		else {
			req.body.object = object;
			next();
		}
	})
}
exports.adMgerDetail = function(req, res) {
	let object = req.body.object
	res.render('./ader/mger/detail', {
		title: 'Manager Infomation',
		crAder : req.session.crAder,
		object: object
	})
}


exports.adCheckMgerUp = function(req, res, next) {
	let objBody = req.body.object
	Mger.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "This mger is deleted"
			Index.adOptionWrong(req, res, info)
		} else {
			let _object = _.extend(object, objBody)
			req.body.object = _object
			next()
		}
	})
}
exports.adUpdateMgerInfo = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err)
		res.redirect("/adMgerDetail/"+objSave._id)
	})
}

exports.adUpdateMgerPw = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err)
		res.redirect("/adMgerDetail/"+objSave._id)
	})
}

exports.adMgerDel = function(req, res) {
	let id = req.query.id;
	Mger.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(!object){
			res.json({success: 0, failDel: "已被删除，按F5刷新页面查看"});
		} else {
			Mger.remove({_id: id}, function(err, objDel) {
				if(err) console.log(err);
				res.json({success: 1});
			})
		}
	})
}