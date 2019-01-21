let Index = require('../app/controllers/sfer/index');

let Sfer = require('../app/controllers/sfer/sfer');
let Task = require('../app/controllers/sfer/task');

let Nation = require('../app/controllers/sfer/scont/nation');
let Bcateg = require('../app/controllers/sfer/scont/bcateg');

let Brand = require('../app/controllers/sfer/scont/brand');
let Vendor = require('../app/controllers/sfer/scont/vendor');
let Scont = require('../app/controllers/sfer/scont/scont');

let MiddleBcrypt = require('../app/middle/middleBcrypt');
let MiddleRole = require('../app/middle/middleRole');
let MiddlePicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();

module.exports = function(app){

	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/', Index.sfer);
	app.get('/sferLogin', Index.sferLogin);
	app.post('/loginSfer', Index.loginSfer);
	app.get('/sferLogout', Index.sferLogout);

	app.get('/option', MiddleRole.sferIsLogin, Index.option);
	app.get('/headerBrand', MiddleRole.sferIsLogin, Brand.brandsFilter, Brand.headerBrand)

	// Sfer -------------------------------------------------------------------------------
	app.get('/sferDetail/:id', MiddleRole.sferIsLogin, MiddleRole.singleSferLogin, Sfer.sferDetail);
	app.post('/updateSferInfo', multipartMiddleware, MiddleRole.sferIsLogin,
		MiddlePicture.addNewPhoto, Sfer.checkSferUp, 
		Sfer.updateSferInfo);
	app.post('/updateSferPw', multipartMiddleware, MiddleRole.sferIsLogin,
		Sfer.checkSferOrgPw, MiddleBcrypt.rqBcrypt, 
		Sfer.updateSferPw);

	app.get('/ajaxSfer', MiddleRole.sfitIsLogin, Sfer.ajaxSfer)

	// task ------------------------------------------------------------------------------
	app.get('/taskAdd', MiddleRole.sferIsLogin, MiddleRole.singleSferLogin, Task.taskAdd)
	app.post('/addTask', multipartMiddleware, MiddleRole.sferIsLogin, Task.addTask)
	app.get('/taskList', MiddleRole.sferIsLogin, Task.tasksFilter, Task.taskList)
	app.get('/taskListPrint', MiddleRole.sferIsLogin, Task.tasksFilter, Task.taskListPrint)
	app.get('/taskDetail/:id', MiddleRole.sferIsLogin, Task.taskFilter, Task.taskDetail)
	app.get('/taskUpdate/:id', MiddleRole.sferIsLogin, Task.taskFilter, Task.taskUpdate)
	app.post('/updateTask', multipartMiddleware, MiddleRole.sferIsLogin, Task.updateTask)
	app.get('/taskDel/:id', MiddleRole.sferIsLogin, Task.taskFilter, Task.taskDel)
	app.get('/taskStatus', MiddleRole.sferIsLogin, Task.taskStatus)

	// Nation ------------------------------------------------------------------------------
	app.get('/nationList', MiddleRole.sferIsLogin, Nation.nationsFilter, Nation.nationList)
	app.get('/nationListPrint', MiddleRole.sferIsLogin, Nation.nationsFilter, Nation.nationListPrint)
	app.get('/nationDetail/:id', MiddleRole.sferIsLogin, Nation.nationDetail)
	app.get('/nationAdd', MiddleRole.bnerIsLogin, Nation.nationAdd)
	app.post('/addNation', multipartMiddleware, MiddleRole.bnerIsLogin, Nation.addNation)
	app.get('/nationUpdate/:id', MiddleRole.bnerIsLogin, Nation.nationUpdate)
	app.post('/updateNation', multipartMiddleware, MiddleRole.bnerIsLogin, Nation.updateNation)
	app.delete('/nationDel', MiddleRole.bnerIsLogin, Nation.nationDel)
	// Bcateg ------------------------------------------------------------------------------
	app.get('/bcategList', MiddleRole.sferIsLogin, Bcateg.bcategsFilter, Bcateg.bcategList)
	app.get('/bcategListPrint', MiddleRole.sferIsLogin, Bcateg.bcategsFilter, Bcateg.bcategListPrint)
	app.get('/bcategDetail/:id', MiddleRole.sferIsLogin, Bcateg.bcategDetail)
	app.get('/bcategAdd', MiddleRole.bnerIsLogin, Bcateg.bcategAdd)
	app.post('/addBcateg', multipartMiddleware, MiddleRole.bnerIsLogin, Bcateg.addBcateg)
	app.get('/bcategUpdate/:id', MiddleRole.bnerIsLogin, Bcateg.bcategUpdate)
	app.post('/updateBcateg', multipartMiddleware, MiddleRole.bnerIsLogin, Bcateg.updateBcateg)
	app.delete('/bcategDel', MiddleRole.bnerIsLogin, Bcateg.bcategDel)

	app.get('/ajaxBcateg', MiddleRole.sfitIsLogin, Bcateg.ajaxBcateg)

	// Brand ------------------------------------------------------------------------------
	app.get('/brandAdd', MiddleRole.bnerIsLogin, Brand.brandAdd)
	app.get('/brandList', MiddleRole.sferIsLogin, Brand.brandsFilter, Brand.brandList)
	app.get('/brandListPrint', MiddleRole.sfitIsLogin, Brand.brandsFilter, Brand.brandListPrint)
	app.get('/brandDetail/:id', MiddleRole.sferIsLogin, Brand.brandFilter, Brand.brandDetail)
	app.get('/brandUpdate/:id', MiddleRole.bnerIsLogin, Brand.brandFilter, Brand.brandUpdate)
	app.post('/addBrand', multipartMiddleware, MiddleRole.bnerIsLogin, Brand.addBrand)
	app.post('/updateBrand', multipartMiddleware, MiddleRole.bnerIsLogin, Brand.updateBrand)
	app.delete('/brandDel', MiddleRole.bnerIsLogin, Brand.brandDel)

	app.get('/ajaxCodeBrand', MiddleRole.sfitIsLogin, Brand.ajaxCodeBrand)
	app.get('/ajaxBrandSts', MiddleRole.bnerIsLogin, Brand.ajaxBrandSts)

	// Vendor ------------------------------------------------------------------------------
	app.get('/vendorAdd', MiddleRole.bnerIsLogin, Vendor.vendorAdd)
	app.get('/vendorList', MiddleRole.sfitIsLogin, Vendor.vendorsFilter, Vendor.vendorList)
	app.get('/vendorListPrint', MiddleRole.sfitIsLogin, Vendor.vendorsFilter, Vendor.vendorListPrint)
	app.get('/vendorDetail/:id', MiddleRole.sfitIsLogin, Vendor.vendorFilter, Vendor.vendorDetail)
	app.get('/vendorUpdate/:id', MiddleRole.bnerIsLogin, Vendor.vendorFilter, Vendor.vendorUpdate)
	app.post('/addVendor', multipartMiddleware, MiddleRole.bnerIsLogin, Vendor.addVendor)
	app.post('/updateVendor', multipartMiddleware, MiddleRole.bnerIsLogin, Vendor.updateVendor)
	app.delete('/vendorDel', MiddleRole.bnerIsLogin, Vendor.vendorDel)

	app.get('/ajaxCodeVendor', MiddleRole.sfitIsLogin, Vendor.ajaxCodeVendor)
	app.get('/ajaxVendorSts', MiddleRole.bnerIsLogin, Vendor.ajaxVendorSts)

	// Scont ------------------------------------------------------------------------------
	app.get('/scontAdd', MiddleRole.sfitIsLogin, Scont.scontAdd)
	app.get('/scontList', MiddleRole.sfitIsLogin, Scont.scontsFilter, Scont.scontList)
	app.get('/scontListPrint', MiddleRole.sfitIsLogin, Scont.scontsFilter, Scont.scontListPrint)
	app.get('/scontDetail/:id', MiddleRole.sfitIsLogin, Scont.scontFilter, Scont.scontDetail)
	app.get('/scontPdf/:id', MiddleRole.sfitIsLogin, Scont.scontFilter, Scont.scontPdf)
	app.get('/scontUpdate/:id', MiddleRole.bnerIsLogin, Scont.scontFilter, Scont.scontUpdate)
	app.post('/addScont', multipartMiddleware, MiddleRole.sfitIsLogin, Scont.addScont)
	app.post('/updateScont', multipartMiddleware, MiddleRole.bnerIsLogin, Scont.updateScont)
	app.delete('/scontDel', MiddleRole.bnerIsLogin, Scont.scontDel)

	app.get('/ajaxScontSts', MiddleRole.bnerIsLogin, Scont.ajaxScontSts)
	// Scont
	// scont
};