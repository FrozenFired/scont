let Index = require('./index')
let Ader = require('../../models/user/ader')
let _ = require('underscore')


exports.aderAdd =function(req, res) {
	res.render('./ader/ader/add', {
		title: 'Add Adminnistrator',
		crAder : req.session.crAder,
		action: "/addAder",
	})
}

exports.addAder = function(req, res) {
	let objBody = req.body.object
	objBody.code = objBody.code.replace(/(\s*$)/g, "").replace( /^\s*/, '')
	Ader.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			info = "此帐号已经被注册，请重新注册"
			Index.adOptionWrong(req, res, info)
		}
		else {
			let _object = new Ader(objBody)
			_object.save(function(err, objSave){
				if(err) console.log(err);
				res.redirect('/aderList')
			})
		}
	})
}

exports.aderList = function(req, res) {
	Ader.find(function(err, objects) {
		if(err) console.log(err)
		res.render('./ader/ader/list', {
			title: '用户列表',
			crAder : req.session.crAder,
			objects: objects
		})
	})
}

exports.aderDetail = function(req, res) {
	let id = req.params.id
	Ader.findOne({_id: id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "This code is not exist";
			Index.adOptionWrong(req, res, info)
		} else {
			res.render('./ader/ader/detail', {
				title: '用户列表',
				crAder : req.session.crAder,
				object: object
			})
		}
	})
}

exports.aderDel = function(req, res) {
	let id = req.query.id
	Ader.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(object){
			Ader.remove({_id: id}, function(err, objRm) {
				if(err) console.log(err) 
				res.json({success: 1})
			})
		} else {
			res.json({success: 0, failDel: "已被删除，按F5刷新页面查看"})
		}
	})
}