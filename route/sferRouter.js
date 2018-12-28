var Index = require('../app/controllers/sfer/index');

var Sfer = require('../app/controllers/sfer/sfer');
var Task = require('../app/controllers/sfer/task');

var Nation = require('../app/controllers/sfer/scont/nation');
var Bcateg = require('../app/controllers/sfer/scont/bcateg');

var Brand = require('../app/controllers/sfer/scont/brand');
var Vendor = require('../app/controllers/sfer/scont/vendor');
var Scont = require('../app/controllers/sfer/scont/scont');

var MiddleBcrypt = require('../app/middle/middleBcrypt');
var MiddleRole = require('../app/middle/middleRole');
var MiddlePicture = require('../app/middle/middlePicture');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function(app){

	// index ---------------Sfer 首页 登录页面 登录 登出--------------------------------
	app.get('/', Index.sfer);
	app.get('/sferLogin', Index.sferLogin);
	app.post('/loginSfer', Index.loginSfer);
	app.get('/sferLogout', Index.sferLogout);

	// Sfer ------------------------------------------------------------------------
	app.get('/sferDetail/:id', MiddleRole.sferIsLogin, MiddleRole.singleSferLogin, Sfer.sferDetail);
	app.post('/updateSferInfo', MiddleRole.sferIsLogin, MiddleRole.singleSferLogin,
		multipartMiddleware, MiddlePicture.addNewPhoto, Sfer.checkSferUp, 
		Sfer.updateSferInfo);
	app.post('/updateSferPw', MiddleRole.sferIsLogin, MiddleRole.singleSferLogin,
		multipartMiddleware, Sfer.checkSferOrgPw, MiddleBcrypt.rqBcrypt, 
		Sfer.updateSferPw);

	app.get('/ajaxSfer', MiddleRole.sfitIsLogin, Sfer.ajaxSfer)

	// task         ----------------------------------------------------------------------
	app.get('/taskAdd', MiddleRole.sferIsLogin, MiddleRole.singleSferLogin, Task.taskAdd)

	app.post('/addTask', MiddleRole.sferIsLogin, MiddleRole.singleSferLogin, multipartMiddleware,
		Task.addTaskCheck, Task.addTask)
	app.get('/taskList', MiddleRole.sferIsLogin, Task.taskListCheck, Task.taskList)
	app.get('/taskDetail/:id', MiddleRole.sferIsLogin, Task.taskDetailCheck, Task.taskDetail)
	app.post('/updateTask', MiddleRole.sferIsLogin, MiddleRole.singleSferLogin, Task.updateTask)
	app.get('/taskDel/:id', MiddleRole.sferIsLogin, Task.taskDelCheck, Task.taskDel)
	app.get('/taskListPrint', MiddleRole.sferIsLogin, Task.taskListCheck, Task.taskListPrint)
	app.get('/taskStatus', MiddleRole.sferIsLogin, Task.taskStatus)

	// Nation
	app.get('/nationList', MiddleRole.sferIsLogin, Nation.nationList)
	app.get('/nationDetail/:id', MiddleRole.sferIsLogin, Nation.nationDetail)
	app.get('/nationAdd', MiddleRole.bnerIsLogin, Nation.nationAdd)
	app.post('/addNation', multipartMiddleware, MiddleRole.bnerIsLogin, Nation.addNation)
	app.get('/nationUpdate/:id', MiddleRole.bnerIsLogin, Nation.nationUpdate)
	app.post('/updateNation', multipartMiddleware, MiddleRole.bnerIsLogin, Nation.updateNation)
	app.delete('/nationDel', MiddleRole.bnerIsLogin, Nation.nationDel)
	// Bcateg
	app.get('/bcategList', MiddleRole.sferIsLogin, Bcateg.bcategList)
	app.get('/bcategDetail/:id', MiddleRole.sferIsLogin, Bcateg.bcategDetail)
	app.get('/bcategAdd', MiddleRole.bnerIsLogin, Bcateg.bcategAdd)
	app.post('/addBcateg', multipartMiddleware, MiddleRole.bnerIsLogin, Bcateg.addBcateg)
	app.get('/bcategUpdate/:id', MiddleRole.bnerIsLogin, Bcateg.bcategUpdate)
	app.post('/updateBcateg', multipartMiddleware, MiddleRole.bnerIsLogin, Bcateg.updateBcateg)
	app.delete('/bcategDel', MiddleRole.bnerIsLogin, Bcateg.bcategDel)

	app.get('/ajaxBcateg', MiddleRole.sfitIsLogin, Bcateg.ajaxBcateg)

	// Brand
	app.get('/brandList', MiddleRole.sferIsLogin, Brand.brandListFilter, Brand.brandList)
	app.get('/brandDetail/:id', MiddleRole.sferIsLogin, Brand.brandDetail)
	app.get('/brandAdd', MiddleRole.sfitIsLogin, Brand.brandAdd)
	app.post('/addBrand', multipartMiddleware, MiddleRole.sfitIsLogin, Brand.addBrand)
	app.get('/brandUpdate/:id', MiddleRole.bnerIsLogin, Brand.brandUpdate)
	app.post('/updateBrand', multipartMiddleware, MiddleRole.bnerIsLogin, Brand.updateBrand)
	app.delete('/brandDel', MiddleRole.bnerIsLogin, Brand.brandDel)

	app.get('/ajaxCodeBrand', MiddleRole.sfitIsLogin, Brand.ajaxCodeBrand)
	app.get('/ajaxBrandSts', MiddleRole.bnerIsLogin, Brand.ajaxBrandSts)

	// Vendor
	app.get('/vendorList', MiddleRole.sfitIsLogin, Vendor.vendorListFilter, Vendor.vendorList)
	app.get('/vendorDetail/:id', MiddleRole.sfitIsLogin, Vendor.vendorDetail)
	app.get('/vendorAdd', MiddleRole.sfitIsLogin, Vendor.vendorAdd)
	app.post('/addVendor', multipartMiddleware, MiddleRole.sfitIsLogin, Vendor.addVendor)
	app.get('/vendorUpdate/:id', MiddleRole.bnerIsLogin, Vendor.vendorUpdate)
	app.post('/updateVendor', multipartMiddleware, MiddleRole.bnerIsLogin, Vendor.updateVendor)
	app.delete('/vendorDel', MiddleRole.bnerIsLogin, Vendor.vendorDel)

	app.get('/ajaxCodeVendor', MiddleRole.sfitIsLogin, Vendor.ajaxCodeVendor)
	app.get('/ajaxVendorSts', MiddleRole.bnerIsLogin, Vendor.ajaxVendorSts)

	// Scont
	app.get('/scontList', MiddleRole.sfitIsLogin, Scont.scontListFilter, Scont.scontList)
	app.get('/scontDetail/:id', MiddleRole.sfitIsLogin, Scont.scontDetail)
	app.get('/scontAdd', MiddleRole.sfitIsLogin, Scont.scontAdd)
	app.post('/addScont', multipartMiddleware, MiddleRole.sfitIsLogin, Scont.addScont)
	app.get('/scontUpdate/:id', MiddleRole.bnerIsLogin, Scont.scontUpdate)
	app.post('/updateScont', multipartMiddleware, MiddleRole.bnerIsLogin, Scont.updateScont)
	app.delete('/scontDel', MiddleRole.bnerIsLogin, Scont.scontDel)

	app.get('/ajaxScontSts', MiddleRole.bnerIsLogin, Scont.ajaxScontSts)
	// Scont
	// scont
};