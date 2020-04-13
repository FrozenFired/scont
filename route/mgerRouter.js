let Index = require('../app/controllers/mger/index');

let Mger = require('../app/controllers/mger/mger');
let Sfer = require('../app/controllers/mger/sfer');
let Vder = require('../app/controllers/mger/vder');

let Task = require('../app/controllers/mger/task');

let MdExcel = require('../app/controllers/mger/multy/aaMiddleExcel')
let MtySfer = require('../app/controllers/mger/multy/sfer');
let MtyNation = require('../app/controllers/mger/multy/nation');
let MtyBcateg = require('../app/controllers/mger/multy/bcateg');
let MtyBrand = require('../app/controllers/mger/multy/brand');
let MtyVendor = require('../app/controllers/mger/multy/vendor');
let MtyScont = require('../app/controllers/mger/multy/scont');
let MtyTask = require('../app/controllers/mger/multy/task');
let MtyScontUp = require('../app/controllers/mger/multy/scontUp');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Manager 首页 登录页面 登录 登出--------------------------------
	app.get('/mger', Index.mgerCheck, Index.mger);

	// Manager ------------------------------------------------------------------------
	app.get('/mgerDetail/:id', MdRole.mgerIsLogin, Mger.mgerDetail);
	app.post('/updateMgerInfo',
		MdRole.mgerIsLogin, PostForm, Mger.checkMgerUp, 
		Mger.updateMgerInfo);
	app.post('/updateMgerPw', MdRole.mgerIsLogin, PostForm,
		Mger.checkMgerOrgPw, MdBcrypt.rqBcrypt, 
		Mger.updateMgerPw);


	// Sfer ---------------------------------------------------------------------------------
	app.get('/logisticOrder', MdRole.mgerIsLogin, Sfer.logisticOrder)
	app.get('/mgerOrder', MdRole.mgerIsLogin, Sfer.mgerOrder)
	app.get('/mgSferAdd', MdRole.mgerIsLogin, Sfer.mgSferAdd)

	app.post('/mgAddSfer', MdRole.mgerIsLogin, PostForm,
		MdBcrypt.rqBcrypt, MdPicture.addNewPhoto, Sfer.mgExistSferN,
		Sfer.mgAddSfer)

	app.get('/mgSferList', MdRole.mgerIsLogin, Sfer.mgSferList)
	app.get('/userExcel', MdRole.mgerIsLogin, Sfer.userExcel)
	app.get('/mgSferDetail/:id', MdRole.mgerIsLogin, Sfer.mgExistSferY, Sfer.mgSferDetail)
	app.post('/mgUpdateSferInfo',
		MdRole.mgerIsLogin, PostForm, MdPicture.addNewPhoto, Sfer.mgCheckSferUp, 
		Sfer.mgUpdateSferInfo)
	app.post('/mgUpdateSferPw', MdRole.mgerIsLogin, PostForm,
		Sfer.mgCheckSferUp, MdBcrypt.rqBcrypt, 
		Sfer.mgUpdateSferPw)
	app.delete('/mgSferDel', MdRole.mgerIsLogin, Sfer.mgSferDel)

	// Vder ---------------------------------------------------------------------------------
	app.get('/mgVderList', MdRole.mgerIsLogin, Vder.mgVdersFilter, Vder.mgVderList)
	app.get('/mgVderDetail/:id', MdRole.mgerIsLogin, Vder.mgVderFilter, Vder.mgVderDetail)
	app.post('/mgUpdateVderInfo', MdRole.mgerIsLogin, PostForm, 
		Vder.mgCheckVderUp, Vder.mgUpdateVderInfo)
	app.post('/mgUpdateVderPw', MdRole.mgerIsLogin, PostForm,
		Vder.mgCheckVderUp, MdBcrypt.rqBcrypt, 
		Vder.mgUpdateVderPw)

	// Task ----------------------------------------------------------------------------------
	app.get('/mgTaskList', MdRole.mgerIsLogin, Task.mgTasksFilter, Task.mgTaskList)
	app.get('/mgTaskListPrint', MdRole.mgerIsLogin, Task.mgTasksFilter, Task.mgTaskListPrint)
	app.get('/mgTaskDetail/:id', MdRole.mgerIsLogin, Task.mgTaskFilter, Task.mgTaskDetail)
	app.get('/mgTaskDel/:id', MdRole.mgerIsLogin, Task.mgTaskFilter, Task.mgTaskDel)


	// Multy ---------------------------------------------------------------------------------
	app.post('/multySfer', PostForm, MdExcel.loadFile, MtySfer.multySfer)
	app.post('/multyNation', PostForm, MdExcel.loadFile, MtyNation.multyNation)
	app.post('/multyBcateg', PostForm, MdExcel.loadFile, MtyBcateg.multyBcateg)

	app.post('/multyBrand', PostForm, MdExcel.loadFile, MtyBrand.multyBrand)
	app.post('/multyVendor', PostForm, MdExcel.loadFile, MtyVendor.multyVendor)
	app.post('/multyScont', PostForm, MdExcel.loadFile, MtyScont.multyScont)
	
	app.post('/multyTask', PostForm, MdExcel.loadFile, MtyTask.multyTask)

	app.get('/mgScontUp', MdRole.mgerIsLogin, MtyScontUp.mgScontUp)

};