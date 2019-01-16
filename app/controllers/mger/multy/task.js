let rtPath = require('path').join(__dirname, "../../../../");
let Sfer = require("../../../models/user/sfer");
let Task = require("../../../models/task/task");
let Conf = require('../../../../confile/conf.js')

let _ = require('underscore')

exports.multyTask = function(req, res) {
	let filePath = req.body.filePath;
	let excel = require('node-xlsx').parse(filePath)[0];
	let arrs = excel.data;
	let sCode = String(arrs[0][0]).replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Sfer.findOne({code: sCode}, function(err, sferObj) {
		if(err) console.log(err);
		if(sferObj) {
			saveTasks(1, arrs.length, arrs, sferObj._id)
			res.redirect('/mger');
		} else {
			info = "excel表格第一行第一列应该写入编辑人的code";
			Index.mgOptionWrong(req, res, info);
		}
	})
}
saveTasks = function(i, n, arrs, sferId){
	if(i >= n) return;
	let arr = arrs[i];
	if(arr[0] && (arr[1] == 0 || arr[1])) {
		arr[0] = arr[0].replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		arr[1] = String(arr[1]).replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

		let task = new Object();
		task.code = arr[0]
		task.title = arr[1]
		task.order = arr[2]
		task.description = arr[3]
		task.note = arr[4]

		let cts = arr[5].split(' ');
		let cTimes = String(cts[0]).split('/')
		let createAt = cTimes[2]+'-'+cTimes[0]+'-'+cTimes[1] + " " + cts[1]+":00"
		// new Date("2018-12-15 15:19:00")
		task.updateAt = task.createAt = (new Date(createAt)).getTime()
		// console.log(task.createAt)
		if(arr[6]) {
			task.finishAt = arr[6]
			task.status = 1;
		} else {
			task.status = 0;
		}
		task.staff = sferId;
		// console.log(task)
		Task.findOne({code: task.code}, function(err, taskObj) {
			if(err) console.log(err);
			if(taskObj) {
				console.log(task.code + " is already existed");
				saveTasks(i+1, n, arrs, sferId)
			} else {
				let _task = new Task(task)
				_task.save(function(err, taskObj) {
					if(err) console.log(err);
					saveTasks(i+1, n, arrs, sferId)
				})
			}
		})
	} else {
		console.log("In " + (i+1) + "th row The code or Title is not complete");
		saveTasks(i+1, n, arrs, sferId)
	}
}