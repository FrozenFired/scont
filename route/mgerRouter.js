let Index = require('../app/controllers/mger/index');

let Mger = require('../app/controllers/mger/mger');
let Sfer = require('../app/controllers/mger/sfer');

let Task = require('../app/controllers/mger/task');

let MiddleExcel = require('../app/controllers/mger/multy/aaMiddleExcel')
let MtySfer = require('../app/controllers/mger/multy/sfer');
let MtyNation = require('../app/controllers/mger/multy/nation');
let MtyBcateg = require('../app/controllers/mger/multy/bcateg');

let MiddleBcrypt = require('../app/middle/middleBcrypt');
let MiddleRole = require('../app/middle/middleRole');
let MiddlePicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();

module.exports = function(app){

	// index ---------------Manager 首页 登录页面 登录 登出--------------------------------
	app.get('/mger', Index.mgerCheck, Index.mger);
	app.get('/mgerLogin', Index.mgerLogin);
	app.post('/loginMger', Index.loginMger);
	app.get('/mgerLogout', Index.mgerLogout);

	// Manager ------------------------------------------------------------------------
	app.get('/mgerDetail/:id', MiddleRole.mgerIsLogin, Mger.mgerDetail);
	app.post('/updateMgerInfo',
		MiddleRole.mgerIsLogin, multipartMiddleware, Mger.checkMgerUp, 
		Mger.updateMgerInfo);
	app.post('/updateMgerPw', MiddleRole.mgerIsLogin, multipartMiddleware,
		Mger.checkMgerOrgPw, MiddleBcrypt.rqBcrypt, 
		Mger.updateMgerPw);


	// Sfer ---------------------------------------------------------------------------------
	app.get('/mgSferAdd', MiddleRole.mgerIsLogin, Sfer.mgSferAdd)

	app.post('/mgAddSfer', MiddleRole.mgerIsLogin, multipartMiddleware,
		MiddleBcrypt.rqBcrypt, MiddlePicture.addNewPhoto, Sfer.mgExistSferN,
		Sfer.mgAddSfer)

	app.get('/mgSferList', MiddleRole.mgerIsLogin, Sfer.mgSferList)
	app.get('/mgSferDetail/:id', MiddleRole.mgerIsLogin, Sfer.mgExistSferY, Sfer.mgSferDetail)
	app.post('/mgUpdateSferInfo',
		MiddleRole.mgerIsLogin, multipartMiddleware, MiddlePicture.addNewPhoto, Sfer.mgCheckSferUp, 
		Sfer.mgUpdateSferInfo)
	app.post('/mgUpdateSferPw', MiddleRole.mgerIsLogin, multipartMiddleware,
		Sfer.mgCheckSferUp, MiddleBcrypt.rqBcrypt, 
		Sfer.mgUpdateSferPw)
	app.delete('/mgSferDel', MiddleRole.mgerIsLogin, Sfer.mgSferDel)

	// Task         ----------------------------------------------------------------------
	app.get('/mgTaskList', MiddleRole.mgerIsLogin, Task.mgTaskListCheck, Task.mgTaskList)
	app.get('/mgTaskDetail/:id', MiddleRole.mgerIsLogin, Task.mgTaskDetailCheck, Task.mgTaskDetail)

	app.get('/mgTaskListPrint', MiddleRole.mgerIsLogin, Task.mgTaskListCheck, Task.mgTaskListPrint)



	// Multy ---------------------------------------------------------------------------------
	app.post('/multySfer', multipartMiddleware, MiddleExcel.loadFile, MtySfer.multySfer)
	app.post('/multyNation', multipartMiddleware, MiddleExcel.loadFile, MtyNation.multyNation)
	app.post('/multyBcateg', multipartMiddleware, MiddleExcel.loadFile, MtyBcateg.multyBcateg)

};