let Index = require('./index')
let Vder = require('../../models/scont/vendor')
let _ = require('underscore')
MiddlePicture = require('../../middle/middlePicture')
Conf = require('../../../confile/conf')
let Filter = require('../../middle/filter');



exports.mgVdersFilter = function(req, res, next) {
	let title = 'mgVendor List';
	let url = "/mgVderList";
	// 分页
	let slipCond = ""; // 分页时用到的其他条件

	let page = 0, entry = 10;
	[entry, page, slipCond] = Filter.slipPage(req, entry, slipCond)
	let index = page * entry;

	// 条件判断   ----------------
	// 查找关键字
	let keytype = "code", keyword = "";
	if(req.query.keyword) {
		req.query.keyword = req.query.keyword.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	}
	[keytype, keyword, slipCond] = Filter.key(req, keytype, keyword, slipCond)
	// 根据状态筛选
	// let condStatus = Object.keys(Conf.stsTask);
	let condStatus = 1;
	[condStatus, slipCond] = Filter.status(req.query.status, condStatus, slipCond);

	// 根据角色筛选
	let condRole = req.query.role || 0;
	symRole = "$eq";
	if(condRole == -1) symRole = "$ne";
	slipCond += "&role="+condRole;

	// 根据创建更新时间筛选
	let at = Filter.at(req);
	slipCond+=at.slipCond;

	Vder.count({
		[keytype]: new RegExp(keyword + '.*'),
		'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
		'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
		'role': {[symRole]: condRole},
		'status': condStatus,  // 'status': {[symStatus]: condStatus}
	})
	.exec(function(err, count) {
		if(err) console.log(err);
		Vder.find({
			[keytype]: new RegExp(keyword + '.*'),
			'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
			'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
			'role': {[symRole]: condRole},
			'status': condStatus,  // 'status': {[symStatus]: condStatus}
		})
		.sort({'role': -1, 'status': -1, 'updateAt': -1})
		.skip(index).limit(entry)
		.exec(function(err, objects) {
			if(err) console.log(err);
			if(objects){
				// console.log(objects)
				// for(let i=0;i<objects.length; i++){
				// 	console.log(objects[i].role)
				// }
				let list = new Object()
				list.title = title;
				list.url = url;
				list.crMger = req.session.crMger;

				list.count = count;
				list.objects = objects;

				list.keytype = req.query.keytype;
				list.keyword = req.query.keyword;

				list.condStatus = condStatus;
				list.condRole = condRole;

				list.condCrtStart = req.query.crtStart;
				list.condCrtEnded = req.query.crtEnded;
				list.condUpdStart = req.query.updStart;
				list.condUpdEnded = req.query.updEnded;

				list.currentPage = (page + 1);
				list.entry = entry;
				list.totalPage = Math.ceil(count / entry);

				list.slipCond = slipCond;

				req.body.list = list;
				next();
			} else {
				info = "Option error, Please Contact Manger"
				Index.mgOptionWrong(req, res, info)
			}
		})
	})
}
exports.mgVderList = function(req, res) {
	res.render('./mger/vder/list', req.body.list)
}







exports.mgVderFilter = function(req, res, next) {
	let id = req.params.id;
	Vder.findOne({_id: id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此帐号已经被删除";
			Index.mgOptionWrong(req, res, info);
		}
		else {
			req.body.object = object;
			next();
		}
	})
}
exports.mgVderDetail = function(req, res) {
	let object = req.body.object
	res.render('./mger/vder/detail', {
		title: 'vendor Info',
		crMger : req.session.crMger,
		object: object
	})
}


exports.mgCheckVderUp = function(req, res, next) {
	let objBody = req.body.object
	Vder.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "This vder is deleted"
			Index.mgOptionWrong(req, res, info)
		} else {
			let _object = _.extend(object, objBody)
			_object.loginTime = Date.now(); // 控制已经登录的用户
			req.body.object = _object
			next()
		}
	})
}
exports.mgUpdateVderPw = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err)
		res.redirect("/mgVderDetail/"+objSave._id)
	})
}

exports.mgUpdateVderInfo = function(req, res) {
	let objBody = req.body.object;
	Vder.find({code: objBody.code})
	.where('_id').ne(objBody._id)
	.exec(function(err, objects) {
		if(err) console.log(err);
		if(objects.length > 0) {
			info = "此名字已经存在，请重新取名字";
			Index.mgOptionWrong(req, res, info)
		} else {
			objBody.save(function(err, objSave) {
				if(err) console.log(err)
				res.redirect("/mgVderDetail/"+objSave._id)
			})
		}
	})
	
}