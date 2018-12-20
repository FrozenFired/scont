let Index = require('./index')

let Task = require('../../models/task/task')

let moment = require('moment')

exports.mgTaskListCheck = function(req, res, next) {

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
	// 根据订单状态筛选   为了在前端显示所选则的状态 selStatus要在后面做一下转换
	let selStatus = req.query.status;
	let condStatus = "$lte";
	if(!selStatus) {
		selStatus = 1
	} else if(selStatus == 2){
		condStatus = "$gte";
	} else if(selStatus == 3) {
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

	Task.count({
		[ktype]: new RegExp(keyword + '.*'),
		'createAt': {[condStart]: selStart, [condEnded]: selEnded},
		'status': {[condStatus]: selStatus}
	})
	.exec(function(err, amount) {
		if(err) console.log(err);
		Task.find({
			[ktype]: new RegExp(keyword + '.*'),
			'createAt': { [condStart]: selStart, [condEnded]: selEnded },
			'status': {[condStatus]: selStatus}
		})
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

exports.mgTaskList = function(req, res) {
	let object = req.body.object
	let slipCond = "&ktype="+object.ktype;
		slipCond += "&keyword="+object.keyword;
		slipCond += "&start="+moment(object.selStart).format('MM/DD/YYYY');
		slipCond += "&ended="+moment(object.selEnded).format('MM/DD/YYYY');
		slipCond += "&status="+object.selStatus;
	res.render('./mger/task/list', {
		title: '任务列表',
		crMger : req.session.crMger,
		objects: object.objects,
		amount: object.amount,

		selStatus: object.selStatus,
		selStart: object.selStart,
		selEnded: object.selEnded,
		ktype: object.ktype,
		keyword: object.keyword,

		currentPage: (object.page + 1),
		totalPage: Math.ceil(object.amount / object.count),
		slipUrl: '/mgTaskList?',
		slipCond: slipCond,

		filterAction: '/mgTaskList',
		printAction: '/mgTaskListPrint'
	})
}
exports.mgTaskListPrint = function(req, res) {
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

	wb.write(req.session.crMger.code+'_work'+ new Date() + '.xlsx', res);
}




exports.mgTaskDetailCheck = function(req, res, next) {
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