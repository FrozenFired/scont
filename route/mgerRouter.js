let Index = require('../app/controllers/mger/index');

let Mger = require('../app/controllers/mger/mger');
let Sfer = require('../app/controllers/mger/sfer');
let Vder = require('../app/controllers/mger/vder');

let Task = require('../app/controllers/mger/task');

let MiddleExcel = require('../app/controllers/mger/multy/aaMiddleExcel')
let MtySfer = require('../app/controllers/mger/multy/sfer');
let MtyNation = require('../app/controllers/mger/multy/nation');
let MtyBcateg = require('../app/controllers/mger/multy/bcateg');
let MtyBrand = require('../app/controllers/mger/multy/brand');
let MtyVendor = require('../app/controllers/mger/multy/vendor');
let MtyScont = require('../app/controllers/mger/multy/scont');
let MtyTask = require('../app/controllers/mger/multy/task');

let MiddleBcrypt = require('../app/middle/middleBcrypt');
let MiddleRole = require('../app/middle/middleRole');
let MiddlePicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();

module.exports = function(app){

	// index ---------------Manager 首页 登录页面 登录 登出--------------------------------
	app.get('/mger', Index.mgerCheck, Index.mger);

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

	// Vder ---------------------------------------------------------------------------------
	app.get('/mgVderList', MiddleRole.mgerIsLogin, Vder.mgVdersFilter, Vder.mgVderList)
	app.get('/mgVderDetail/:id', MiddleRole.mgerIsLogin, Vder.mgVderFilter, Vder.mgVderDetail)
	app.post('/mgUpdateVderInfo', MiddleRole.mgerIsLogin, multipartMiddleware, 
		Vder.mgCheckVderUp, Vder.mgUpdateVderInfo)
	app.post('/mgUpdateVderPw', MiddleRole.mgerIsLogin, multipartMiddleware,
		Vder.mgCheckVderUp, MiddleBcrypt.rqBcrypt, 
		Vder.mgUpdateVderPw)

	// Task ----------------------------------------------------------------------------------
	app.get('/mgTaskList', MiddleRole.mgerIsLogin, Task.mgTasksFilter, Task.mgTaskList)
	app.get('/mgTaskListPrint', MiddleRole.mgerIsLogin, Task.mgTasksFilter, Task.mgTaskListPrint)
	app.get('/mgTaskDetail/:id', MiddleRole.mgerIsLogin, Task.mgTaskFilter, Task.mgTaskDetail)
	app.get('/mgTaskDel/:id', MiddleRole.mgerIsLogin, Task.mgTaskFilter, Task.mgTaskDel)


	// Multy ---------------------------------------------------------------------------------
	app.post('/multySfer', multipartMiddleware, MiddleExcel.loadFile, MtySfer.multySfer)
	app.post('/multyNation', multipartMiddleware, MiddleExcel.loadFile, MtyNation.multyNation)
	app.post('/multyBcateg', multipartMiddleware, MiddleExcel.loadFile, MtyBcateg.multyBcateg)

	app.post('/multyBrand', multipartMiddleware, MiddleExcel.loadFile, MtyBrand.multyBrand)
	app.post('/multyVendor', multipartMiddleware, MiddleExcel.loadFile, MtyVendor.multyVendor)
	app.post('/multyScont', multipartMiddleware, MiddleExcel.loadFile, MtyScont.multyScont)

	
	app.post('/multyTask', multipartMiddleware, MiddleExcel.loadFile, MtyTask.multyTask)

};