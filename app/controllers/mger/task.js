let Index = require('./index')

let Task = require('../../models/task/task')
let Filter = require('../../middle/filter');

let Conf = require('../../../confile/conf.js')
let moment = require('moment')

exports.mgTasksFilter = function(req, res, next) {
	let title = 'task List';
	let url = "/mgTaskList";
	
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
	.exec(function(err, count) {
		if(err) console.log(err);
		Task.find({
			[keytype]: new RegExp(keyword + '.*'),
			'createAt': {[at.symCrtStart]: at.condCrtStart, [at.symCrtEnded]: at.condCrtEnded},
			'updateAt': {[at.symUpdStart]: at.condUpdStart, [at.symUpdEnded]: at.condUpdEnded},
			'status': condStatus  // 'status': {[symStatus]: condStatus}
		})
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
				list.crMger = req.session.crMger;

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
				Index.mgOptionWrong(req, res, info)
			}
		})
	})
}

exports.mgTaskList = function(req, res) {
	res.render('./mger/task/list', req.body.list)
}
exports.mgTaskListPrint = function(req, res) {
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
		if(item.code) ws.cell((i+2), 1).string(item.code);
		if(item.title) ws.cell((i+2), 2).string(item.title);
		if(item.order) ws.cell((i+2), 3).string(item.order);
		if(item.description) ws.cell((i+2), 4).string(item.description);
		if(item.note) ws.cell((i+2), 5).string(item.note);
		if(item.createAt) ws.cell((i+2), 6).string(moment(item.createAt).format('MM/DD/YYYY HH:mm'));
		if(item.finishAt) ws.cell((i+2), 7).string(item.finishAt);
	}

	wb.write(req.session.crMger.code+'_work'+ new Date() + '.xlsx', res);
}




exports.mgTaskFilter = function(req, res, next) {
	let id = req.params.id
	Task.findOne({_id: id})
	.populate('staff')
	.exec(function(err, object) {
		if(err) console.log(err);
		if(!object) {
			info = "此任务已经被删除"
			Index.mgOptionWrong(req, res, info)
		} else {
			req.body.object = object
			next()
		}
	})
}
exports.mgTaskDetail = function(req, res) {
	let objBody = req.body.object

	res.render('./mger/task/detail', {
		title: 'task Infomation',
		crMger : req.session.crMger,
		object: objBody
	})
}

exports.mgTaskDel = function(req, res) {
	let objBody = req.body.object;
	Task.remove({_id: objBody._id}, function(err, taskRm) {
		if(err) console.log(err);
		res.redirect('/mgTaskList')
	})
}