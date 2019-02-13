let Index = require('../index')
let Vder = require('../../../models/scont/vendor')
let _ = require('underscore')
Conf = require('../../../../confile/conf')
let Filter = require('../../../middle/filter');



exports.odVdersFilter = function(req, res, next) {
	let title = 'odVendor List';
	let url = "/odVderList";
	// 分页
	let slipCond = ""; // 分页时用到的其他条件

	let page = 0, entry = 10;
	[entry, page, slipCond] = Filter.slipPage(req, entry, slipCond)
	let index = page * entry;

	// 条件判断   ----------------
	// 查找关键字
	let keytype = "code", keyword = "";
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
				list.crOder = req.session.crOder;

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
				Index.sfOptionWrong(req, res, info)
			}
		})
	})
}
exports.odVderList = function(req, res) {
	res.render('./sfer/oder/vder/list', req.body.list)
}







exports.odVderFilter = function(req, res, next) {
	let id = req.params.id;
	Vder.findOne({_id: id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此帐号已经被删除";
			Index.sfOptionWrong(req, res, info);
		}
		else {
			req.body.object = object;
			next();
		}
	})
}
exports.odVderDetail = function(req, res) {
	let object = req.body.object
	res.render('./sfer/oder/vder/detail', {
		title: 'vendor Info',
		crOder : req.session.crOder,
		object: object
	})
}


exports.odCheckVderUp = function(req, res, next) {
	let objBody = req.body.object
	objBody.taxFree = parseFloat(objBody.taxFree);
	if(isNaN(objBody.taxFree)) {
		info = "Tax Free amount must a number"
		Index.sfOptionWrong(req, res, info)
	} else {
		Vder.findOne({_id: objBody._id}, function(err, object) {
			if(err) console.log(err);
			if(!object) {
				info = "This vder is deleted"
				Index.sfOptionWrong(req, res, info)
			} else {
				let _object = _.extend(object, objBody)
				_object.loginTime = Date.now(); // 控制已经登录的用户
				req.body.object = _object
				next()
			}
		})
	}
}


exports.odUpVderInfo = function(req, res) {
	let objBody = req.body.object;
	objBody.save(function(err, objSave) {
		if(err) console.log(err)
		res.redirect("/odVderDetail/"+objSave._id)
	})
}




// Ajax
exports.ajaxOdVendor = function(req, res) {
	let keytpye = req.query.keytype
	let keyword = req.query.keyword.toUpperCase();
	// console.log(keytpye)
	// console.log(keyword)
	Vder.findOne({[keytpye]: keyword}, function(err, object) {
		if(err) console.log(err);
		if(object){
			res.json({success: 1, object: object})
		} else {
			Vder.find({[keytpye]: new RegExp(keyword + '.*')}, function(err, objects) {
				if(err) console.log(err);
				if(objects && objects.length > 0) {
					res.json({success: 2, objects: objects});
				} else {
					res.json({success: 0})
				}
			})
		}
	})
}