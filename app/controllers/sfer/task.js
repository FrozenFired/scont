let Index = require('./index')
let Task = require('../../models/task/task')
let _ = require('underscore')

let Conf = require('../../../confile/conf.js')
let moment = require('moment')


exports.taskAdd =function(req, res) {
	Task.find({staff: req.session.crSfer._id})
	.sort({"createAt": -1})
	.limit(1)
	.exec(function(err, objects) {

		let code = getNewTaskCode(objects[0], req.session.crSfer.code)

		res.render('./sfer/task/add', {
			title: 'Add Task',
			crSfer : req.session.crSfer,
			code: code,
			action: "/addTask",
		})
	})
}
getNewTaskCode = function(lastTask, userCode) {
	let today =parseInt(moment(Date.now()).format('YYMMDD')) // 计算今天的日期
	let preTaskDay = 0, dayLen = 0;

	if(lastTask){ // 找出上个任务的日期和序列号
		preTaskDay = parseInt(lastTask.code.slice(0,6))
		dayLen = parseInt(lastTask.code.slice(6,10))
	}
	if(today == preTaskDay) {	// 判断上个任务的日期是否是今天
		dayLen = dayLen+1
	} else {					// 如果不是则从1开始
		dayLen = 1
	}
	for(let len = (dayLen + "").length; len < 4; len = dayLen.length) { // 序列号补0
		dayLen = "0" + dayLen;
	}
	return String(today) + String(dayLen) + '_' + userCode
}






exports.addTaskCheck = function(req, res, next) {
	let objBody = req.body.object
	objBody.status = 1
	Task.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			let _object
			_object = _.extend(object, objBody)
			req.body.object = _object
			next()
		} else {
			let _object = new Task(objBody)
			req.body.object = _object
			next()
		}
	})
}
exports.addTask = function(req, res) {
	let objBody = req.body.object
	objBody.save(function(err, objSave) {
		if(err) console.log(err)
		// res.redirect('/taskDetail/'+objSave._id)
		res.redirect('/taskList')
	})
}





exports.taskListCheck = function(req, res, next) {
	// 分页
	let page = parseInt(req.query.page) || 0
	let count = 20
	let index = page * count

	// 条件判断   ----------------
	// 查找关键字
	let ktype = "code"
	let keyword = "";
	if(req.query.keyword) keyword = req.query.keyword.replace(/(\s*$)/g, "").replace( /^\s*/, '')
	if(req.query.ktype) ktype = req.query.ktype
	// 根据订单状态筛选
	let selStatus = req.query.status;
	let condStatus = "$lte";
	if(!selStatus) {
		selStatus = 0
	} else if(selStatus == 1){
		condStatus = "$gte";
	} else if(selStatus == 2) {
		condStatus = "$ne";
	}
	// console.log(selStatus)
	// console.log(condStatus)
	// 根据开始时间筛选
	let selStart, condStart;
	if(req.query.start && req.query.start.length == 10){
		condStart = "$gt";
		selStart = new Date(req.query.start).setHours(0,0,0,0);
	} else {
		condStart = "$ne";
		selStart = null;
	}
	// 根据结束时间筛选
	let selEnded, condEnded;
	if(req.query.ended && req.query.ended.length == 10){
		condEnded = "$lt";
		selEnded = new Date(req.query.ended).setHours(23,59,59,0)
	} else {
		condEnded = "$ne";
		selEnded = null;
	}
	// console.log(condEnded)
	// console.log(selEnded)
	// Task.find(function(err, tasks) {
	// 	if(err) console.log(err);
	// 	console.log(tasks)
	// })
	Task.count({
		[ktype]: new RegExp(keyword + '.*'),
		'createAt': {[condStart]: selStart, [condEnded]: selEnded},
		'status': {[condStatus]: selStatus}
	})
	.where('staff').equals(req.session.crSfer._id)
	.exec(function(err, amount) {
		if(err) console.log(err);
		Task.find({
			[ktype]: new RegExp(keyword + '.*'),
			'createAt': { [condStart]: selStart, [condEnded]: selEnded },
			'status': {[condStatus]: selStatus}
		})
		.where('staff').equals(req.session.crSfer._id)
		.populate('staff')
		.skip(index)
		.limit(count)
		.sort({"createAt": -1})
		.exec(function(err, objects) {
			if(err) console.log(err);
			let object = new Object()
			object.objects = objects;
			object.selStatus = selStatus;
			object.selStart = selStart;
			object.selEnded = selEnded;
			object.ktype = ktype;
			object.keyword = keyword;

			object.amount = amount;
			object.count = count;
			object.page = page;
			req.body.object = object;
			next();
			
		})
	})
}

exports.taskList = function(req, res) {
	let object = req.body.object
	let slipCond = "&ktype="+object.ktype;
		slipCond += "&keyword="+object.keyword;
		slipCond += "&start="+moment(object.selStart).format('MM/DD/YYYY');
		slipCond += "&ended="+moment(object.selEnded).format('MM/DD/YYYY');
		slipCond += "&status="+object.selStatus;
	res.render('./sfer/task/list', {
		title: '任务列表',
		crSfer : req.session.crSfer,
		objects: object.objects,
		amount: object.amount,

		selStatus: object.selStatus,
		selStart: object.selStart,
		selEnded: object.selEnded,
		ktype: object.ktype,
		keyword: object.keyword,

		currentPage: (object.page + 1),
		totalPage: Math.ceil(object.amount / object.count),
		slipUrl: '/taskList?',
		slipCond: slipCond,

		filterAction: '/taskList',
		printAction: '/taskListPrint'
	})
}
exports.taskListPrint = function(req, res) {
	let objects = req.body.object.objects
	
	let xl = require('excel4node');
	let wb = new xl.Workbook({
		defaultFont: {
			size: 12,
			color: '333333'
		},
		dateFormat: 'yyyy-mm-dd hh:mm:ss'
	});
	
	let ws = wb.addWorksheet('Sheet 1');
	ws.column(1).setWidth(20);
	ws.column(2).setWidth(20);
	ws.column(3).setWidth(20);
	ws.column(4).setWidth(50);
	ws.column(5).setWidth(40);
	ws.column(6).setWidth(20);
	ws.column(7).setWidth(20);
	
	// header
	ws.cell(1,1).string('Code');
	ws.cell(1,2).string('Title');
	ws.cell(1,3).string('Serial');
	ws.cell(1,4).string('Description');
	ws.cell(1,5).string('Note');
	ws.cell(1,6).string('CreateAt');
	ws.cell(1,7).string('FinishAt');

	for(let i=0; i<objects.length; i++){
		let item = objects[i];
		if(item.code) ws.cell((i+2), 1).string(item.code);
		if(item.title) ws.cell((i+2), 2).string(item.title);
		if(item.order) ws.cell((i+2), 3).string(item.order);
		if(item.description) ws.cell((i+2), 4).string(item.description);
		if(item.note) ws.cell((i+2), 5).string(item.note);
		if(item.createAt) ws.cell((i+2), 6).string(moment(item.createAt).format('MM/DD/YYYY HH:mm'));
		if(item.finishAt) ws.cell((i+2), 7).string(item.finishAt);
	}

	wb.write(req.session.crSfer.code+'_work'+ new Date() + '.xlsx', res);
}




exports.taskDetailCheck = function(req, res, next) {
	let id = req.params.id
	Task.findOne({_id: id})
	.populate('staff')
	.exec(function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此任务已经被删除"
			Index.sfOptionWrong(req, res, info)
		} else {
			if(object.staff._id != req.session.crSfer._id) {
				info = "您无权查看别人的信息"
				Index.sfOptionWrong(req, res, info)
			} else {
				req.body.object = object
				next()
			}
		}
	})
}
exports.taskDetail = function(req, res) {
	let objBody = req.body.object

	res.render('./sfer/task/detail', {
		title: 'task Infomation',
		crSfer : req.session.crSfer,
		object: objBody
	})
}





exports.updateTask = function(req, res) {
	let objBody = req.body.object
	Task.findOne({_id: objBody._id}, function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此任务已经被删除"
			Index.sfOptionWrong(req, res, info)
		} else {
			let _object = _.extend(object, objBody);
			_object.save(function(err, objSave) {
				if(err) console.log(err);
				res.redirect('/taskList');
			});	
		}
	})
}







exports.taskDelCheck = function(req, res, next) {
	let id = req.params.id
	Task.findOne({_id: id}, function(err, task){
		if(err) console.log(err);
		if(task){
			req.body.object = task
			next()
		} else {
			info = "此任务已经被删除"
			Index.sfOptionWrong(req, res, info)
		}
	})
}
exports.taskDel = function(req, res) {
	let objBody = req.body.object;
	Task.remove({_id: objBody._id}, function(err, taskRm) {
		if(err) console.log(err);
		res.redirect('/taskList')
	})
}





exports.taskStatus = function(req, res) {
	let id = req.query.id
	let newStatus = req.query.newStatus
	Task.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(object){
			object.status = parseInt(newStatus)
			if(object.status == 2) {
				object.finishAt = moment(Date.now()).format('MM/DD/YYYY HH:mm')
			} else {
				object.finishAt = ""
			}
			object.save(function(err,objSave) {
				if(err) console.log(err);
				res.json({success: 1, info: "已经更改"});
			})
		} else {
			res.json({success: 0, info: "已被删除，按F5刷新页面查看"})
		}
	})
}