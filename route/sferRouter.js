let Index = require('../app/controllers/sfer/sfer/index');

let Sfer = require('../app/controllers/sfer/sfer/sfer');

let Task = require('../app/controllers/sfer/sfer/task');
let Car = require('../app/controllers/sfer/sfer/car');
let Cared = require('../app/controllers/sfer/sfer/cared');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------

	// Sfer -------------------------------------------------------------------------------
	app.get('/sferInfo', MdRole.sferIsLogin, Sfer.sferFilter, Sfer.sferInfo);
	app.post('/sferUpInfo', PostForm, MdRole.sferIsLogin, MdRole.sfUniLog, 
		MdPicture.addNewPhoto, Sfer.sferUp);
	app.post('/sferUpPw', PostForm, MdRole.sferIsLogin, MdRole.sfUniLog, 
		MdBcrypt.rqBcrypt, Sfer.sferUp);

	// task ------------------------------------------------------------------------------
	app.get('/sfTasks', MdRole.sferIsLogin, Task.tasksFilter, Task.tasks)
	app.get('/sfTasksPrint', MdRole.sferIsLogin, Task.tasksFilter, Task.tasksPrint)
	app.get('/sfTask/:id', MdRole.sferIsLogin, Task.taskFilter, Task.task)
	app.get('/sfTaskUp/:id', MdRole.sferIsLogin, Task.taskFilter, Task.taskUp)
	app.post('/sfTaskUpd', PostForm, MdRole.sferIsLogin, Task.taskUpd)
	app.get('/sfTaskAdd', MdRole.sferIsLogin, MdRole.sfUniLog, Task.taskAdd)
	app.post('/sfTaskNew', PostForm, MdRole.sferIsLogin, Task.taskNew)
	app.get('/sfTaskDel/:id', MdRole.sferIsLogin, Task.taskFilter, Task.taskDel)
	app.get('/sfTaskStatus', MdRole.sferIsLogin, Task.taskStatus)

	// car ------------------------------------------------------------------------------
	app.get('/sfCars', MdRole.sferIsLogin, Car.sfCars)

	app.get('/sfCarAppl', MdRole.sferIsLogin, Car.sfCarAppl)

	// cared ------------------------------------------------------------------------------
	app.get('/sfCareds', MdRole.sferIsLogin, Cared.sfCareds)
	app.get('/sfCaredsAjax', MdRole.sferIsLogin, Cared.sfCaredsAjax)
	app.get('/sfCaredsMonth', MdRole.sferIsLogin, Cared.sfCaredsMonth)
	app.get('/sfCaredsMonthAjax', MdRole.sferIsLogin, Cared.sfCaredsMonthAjax)

	app.get('/sfCared/:id', MdRole.sferIsLogin, Cared.sfCaredFilter, Cared.sfCared)
	app.get('/sfCaredDel/:id', MdRole.sferIsLogin, Cared.sfCaredFilter, Cared.sfCaredDel)
};