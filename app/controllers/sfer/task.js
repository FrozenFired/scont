let Index = require('./index')
let Task = require('../../models/task/task')
let _ = require('underscore')

let Filter = require('../../middle/filter');

let Conf = require('../../../confile/conf.js')
let moment = require('moment')



exports.tasksFilter = function(req, res, next) {
	let title = 'task List';
	let url = "/taskList";
	
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
	let condStatus = 0;
	[condStatus, slipCond] = Filter.status(req.query.status, condStatus, slipCond);

	// 根据创建更新时间筛选
	let at = Filter.at(req);
	slipCond+=at.slipCond;

	Task.count({
		[keytype]: new RegExp(keyword + '.*'),
		'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
		'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
		'status': condStatus  // 'status': {[symStatus]: condStatus}
	})
	.where('staff').equals(req.session.crSfer._id)
	.exec(function(err, count) {
		if(err) console.log(err);
		Task.find({
			[keytype]: new RegExp(keyword + '.*'),
			'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
			'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
		.where('staff').equals(req.session.crSfer._id)
		.skip(index)
		.limit(entry)
		.populate('staff')
		.sort({"createAt": -1})
		.exec(function(err, objects) {
			if(err) console.log(err);
			if(objects){
				// console.log(objects)
				let list = new Object()
				list.title = title;
				list.url = url;
				list.crSfer = req.session.crSfer;

				list.count = count;
				list.objects = objects;

				list.keytype = req.query.keytype;
				list.keyword = req.query.keyword;

				list.condStatus = condStatus;

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

exports.taskList = function(req, res) {
	res.render('./sfer/task/list', req.body.list)
}


exports.taskListPrint = function(req, res) {
	let objects = req.body.list.objects
	
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
		if(item.code) ws.cell((i+2), 1).string(String(item.code));
		if(item.title) ws.cell((i+2), 2).string(String(item.title));
		if(item.order) ws.cell((i+2), 3).string(String(item.order));
		if(item.description) ws.cell((i+2), 4).string(String(item.description));
		if(item.note) ws.cell((i+2), 5).string(String(item.note));
		if(item.createAt) ws.cell((i+2), 6).string(moment(item.createAt).format('MM/DD/YYYY HH:mm'));
		if(item.finishAt) ws.cell((i+2), 7).string(String(item.finishAt));
	}

	wb.write('Task_'+req.session.crSfer.code+'_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
}










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






exports.addTask = function(req, res) {
	let objBody = req.body.object
	objBody.status = 0
	objBody.updateAt = objBody.createAt = Date.now();
	Task.findOne({code: objBody.code}, function(err, object) {
		if(err) console.log(err);
		if(object) {
			let _object
			_object = _.extend(object, objBody)
			req.body.object = _object
			next()
		} else {
			let _object = new Task(objBody)
			_object.save(function(err, objSave) {
				if(err) console.log(err)
				// res.redirect('/taskDetail/'+objSave._id)
				res.redirect('/taskList')
			})
		}
	})
}





exports.taskFilter = function(req, res, next) {
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

exports.taskUpdate = function(req, res) {
	let objBody = req.body.object

	res.render('./sfer/task/update', {
		title: 'task Update',
		crSfer : req.session.crSfer,
		object: objBody
	})
}




exports.updateTask = function(req, res) {
	let objBody = req.body.object
	// console.log(objBody)
	objBody.updateAt = Date.now();
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
			if(object.status == 1) {
				object.finishAt = moment(Date.now()).format('YYYY/MM/DD HH:mm')
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