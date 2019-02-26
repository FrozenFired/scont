// let Index = require('../app/controllers/sfer/cner/index');

// let Cner = require('../app/controllers/sfer/cner/cner');
// let Task = require('../app/controllers/sfer/cner/task');

// let Nation = require('../app/controllers/sfer/cner/scont/nation');
// let Bcateg = require('../app/controllers/sfer/cner/scont/bcateg');

// let Brand = require('../app/controllers/sfer/cner/scont/brand');
// // let Vendor = require('../app/controllers/sfer/cner/scont/vendor');
// // let Scont = require('../app/controllers/sfer/cner/scont/scont');

// let MiddleBcrypt = require('../app/middle/middleBcrypt');
// let MiddleRole = require('../app/middle/middleRole');
// let MiddlePicture = require('../app/middle/middlePicture');

// let multipart = require('connect-multiparty');
// let multipartMiddleware = multipart();

// module.exports = function(app){

// 	// index ---------------Cner 首页 登录页面 登录 登出---------------------------------------
// 	app.get('/cner', Index.cner);

// 	app.get('/option', MiddleRole.cnerIsLogin, Index.option);
// 	app.get('/headerBrand', MiddleRole.cnerIsLogin, Brand.brandsFilter, Brand.headerBrand)

// 	// Cner -------------------------------------------------------------------------------
// 	app.get('/cnerDetail/:id', MiddleRole.cnerIsLogin, MiddleRole.singleCnerLogin, Cner.cnerDetail);
// 	app.post('/updateCnerInfo', multipartMiddleware, MiddleRole.cnerIsLogin,
// 		MiddlePicture.addNewPhoto, Cner.checkCnerUp, 
// 		Cner.updateCnerInfo);
// 	app.post('/updateCnerPw', multipartMiddleware, MiddleRole.cnerIsLogin,
// 		Cner.checkCnerOrgPw, MiddleBcrypt.rqBcrypt, 
// 		Cner.updateCnerPw);

// 	app.get('/ajaxCner', MiddleRole.cnerIsLogin, Cner.ajaxCner)

// 	// task ------------------------------------------------------------------------------
// 	app.get('/taskAdd', MiddleRole.cnerIsLogin, MiddleRole.singleCnerLogin, Task.taskAdd)
// 	app.post('/addTask', multipartMiddleware, MiddleRole.cnerIsLogin, Task.addTask)
// 	app.get('/taskList', MiddleRole.cnerIsLogin, Task.tasksFilter, Task.taskList)
// 	app.get('/taskListPrint', MiddleRole.cnerIsLogin, Task.tasksFilter, Task.taskListPrint)
// 	app.get('/taskDetail/:id', MiddleRole.cnerIsLogin, Task.taskFilter, Task.taskDetail)
// 	app.get('/taskUpdate/:id', MiddleRole.cnerIsLogin, Task.taskFilter, Task.taskUpdate)
// 	app.post('/updateTask', multipartMiddleware, MiddleRole.cnerIsLogin, Task.updateTask)
// 	app.get('/taskDel/:id', MiddleRole.cnerIsLogin, Task.taskFilter, Task.taskDel)
// 	app.get('/taskStatus', MiddleRole.cnerIsLogin, Task.taskStatus)

// 	// Nation ------------------------------------------------------------------------------
// 	app.get('/nationList', MiddleRole.cnerIsLogin, Nation.nationsFilter, Nation.nationList)
// 	app.get('/nationListPrint', MiddleRole.cnerIsLogin, Nation.nationsFilter, Nation.nationListPrint)
// 	app.get('/nationDetail/:id', MiddleRole.cnerIsLogin, Nation.nationDetail)
// 	app.get('/nationAdd', MiddleRole.bnerIsLogin, Nation.nationAdd)
// 	app.post('/addNation', multipartMiddleware, MiddleRole.bnerIsLogin, Nation.addNation)
// 	app.get('/nationUpdate/:id', MiddleRole.bnerIsLogin, Nation.nationUpdate)
// 	app.post('/updateNation', multipartMiddleware, MiddleRole.bnerIsLogin, Nation.updateNation)
// 	app.delete('/nationDel', MiddleRole.bnerIsLogin, Nation.nationDel)
// 	// Bcateg ------------------------------------------------------------------------------
// 	app.get('/bcategList', MiddleRole.cnerIsLogin, Bcateg.bcategsFilter, Bcateg.bcategList)
// 	app.get('/bcategListPrint', MiddleRole.cnerIsLogin, Bcateg.bcategsFilter, Bcateg.bcategListPrint)
// 	app.get('/bcategAdd', MiddleRole.bnerIsLogin, Bcateg.bcategAdd)
// 	app.post('/addBcateg', multipartMiddleware, MiddleRole.bnerIsLogin, Bcateg.addBcateg)
// 	app.get('/bcategDetail/:id', MiddleRole.cnerIsLogin, Bcateg.bcategFilter, Bcateg.bcategDetail)
// 	app.get('/bcategPrint/:id', MiddleRole.cnerIsLogin, Bcateg.bcategFilter, Bcateg.bcategPrint)
// 	app.get('/bcategUpdate/:id', MiddleRole.bnerIsLogin, Bcateg.bcategFilter, Bcateg.bcategUpdate)
// 	app.post('/updateBcateg', multipartMiddleware, MiddleRole.bnerIsLogin, Bcateg.updateBcateg)
// 	app.delete('/bcategDel', MiddleRole.bnerIsLogin, Bcateg.bcategDel)

// 	app.get('/ajaxBcateg', MiddleRole.cnerIsLogin, Bcateg.ajaxBcateg)

// 	// Brand ------------------------------------------------------------------------------
// 	app.get('/brandAdd', MiddleRole.bnerIsLogin, Brand.brandAdd)
// 	app.get('/brandList', MiddleRole.cnerIsLogin, Brand.brandsFilter, Brand.brandList)
// 	app.get('/brandListPrint', MiddleRole.cnerIsLogin, Brand.brandsFilter, Brand.brandListPrint)
// 	app.get('/brandDetail/:id', MiddleRole.cnerIsLogin, Brand.brandFilter, Brand.brandDetail)
// 	app.get('/brandUpdate/:id', MiddleRole.bnerIsLogin, Brand.brandFilter, Brand.brandUpdate)
// 	app.post('/addBrand', multipartMiddleware, MiddleRole.bnerIsLogin, Brand.addBrand)
// 	app.post('/updateBrand', multipartMiddleware, MiddleRole.bnerIsLogin, Brand.updateBrand)
// 	app.delete('/brandDel', MiddleRole.bnerIsLogin, Brand.brandDel)

// 	app.get('/ajaxCodeBrand', MiddleRole.cnerIsLogin, Brand.ajaxCodeBrand)
// 	app.get('/ajaxBrandSts', MiddleRole.bnerIsLogin, Brand.ajaxBrandSts)

// 	// // Vendor ------------------------------------------------------------------------------
// 	// app.get('/vendorAdd', MiddleRole.bnerIsLogin, Vendor.vendorAdd)
// 	// app.get('/vendorList', MiddleRole.cnerIsLogin, Vendor.vendorsFilter, Vendor.vendorList)
// 	// app.get('/vendorListPrint', MiddleRole.cnerIsLogin, Vendor.vendorsFilter, Vendor.vendorListPrint)
// 	// app.get('/vendorDetail/:id', MiddleRole.cnerIsLogin, Vendor.vendorFilter, Vendor.vendorDetail)
// 	// app.get('/vendorUpdate/:id', MiddleRole.bnerIsLogin, Vendor.vendorFilter, Vendor.vendorUpdate)
// 	// app.post('/addVendor', multipartMiddleware, MiddleRole.bnerIsLogin, Vendor.addVendor)
// 	// app.post('/updateVendor', multipartMiddleware, MiddleRole.bnerIsLogin, Vendor.updateVendor)
// 	// app.delete('/vendorDel', MiddleRole.bnerIsLogin, Vendor.vendorDel)

// 	// app.get('/ajaxCodeVendor', MiddleRole.cnerIsLogin, Vendor.ajaxCodeVendor)
// 	// app.get('/ajaxVendorSts', MiddleRole.bnerIsLogin, Vendor.ajaxVendorSts)

// 	// // Scont ------------------------------------------------------------------------------
// 	// app.get('/scontAdd', MiddleRole.cnerIsLogin, Scont.scontAdd)
// 	// app.get('/scontList', MiddleRole.cnerIsLogin, Scont.scontsFilter, Scont.scontList)
// 	// app.get('/scontListPrint', MiddleRole.cnerIsLogin, Scont.scontsFilter, Scont.scontListPrint)
// 	// app.get('/scontDetail/:id', MiddleRole.cnerIsLogin, Scont.scontFilter, Scont.scontDetail)
// 	// app.get('/scontPdf/:id', MiddleRole.cnerIsLogin, Scont.scontFilter, Scont.scontPdf)
// 	// app.get('/scontUpdate/:id', MiddleRole.bnerIsLogin, Scont.scontFilter, Scont.scontUpdate)
// 	// app.post('/addScont', multipartMiddleware, MiddleRole.cnerIsLogin, Scont.addScont)
// 	// app.post('/updateScont', multipartMiddleware, MiddleRole.bnerIsLogin, Scont.updateScont)
// 	// app.delete('/scontDel', MiddleRole.bnerIsLogin, Scont.scontDel)

// 	// app.get('/ajaxScontSts', MiddleRole.bnerIsLogin, Scont.ajaxScontSts)
// 	// // Scont
// 	// // scont
// };