let Index = require('../app/controllers/sfer/index');

let Sfer = require('../app/controllers/sfer/sfer');
let Task = require('../app/controllers/sfer/task');

let Nation = require('../app/controllers/sfer/scont/nation');
let Bcateg = require('../app/controllers/sfer/scont/bcateg');

let Brand = require('../app/controllers/sfer/scont/brand');
let Vendor = require('../app/controllers/sfer/scont/vendor');
let Scont = require('../app/controllers/sfer/scont/scont');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/sfer', Index.sfer);

	app.get('/option', MdRole.bnerIsLogin, Index.option);
	app.get('/headerBrand', MdRole.bnerIsLogin, Brand.brandsFilter, Brand.headerBrand)

	// Sfer -------------------------------------------------------------------------------
	app.get('/sferDetail/:id', MdRole.bnerIsLogin, MdRole.sfUniLog, Sfer.sferDetail);
	app.post('/updateSferInfo', PostForm, MdRole.bnerIsLogin,
		MdPicture.addNewPhoto, Sfer.checkSferUp, 
		Sfer.updateSferInfo);
	app.post('/updateSferPw', PostForm, MdRole.bnerIsLogin,
		Sfer.checkSferOrgPw, MdBcrypt.rqBcrypt, 
		Sfer.updateSferPw);

	app.get('/ajaxSfer', MdRole.bnerIsLogin, Sfer.ajaxSfer)

	// task ------------------------------------------------------------------------------
	app.get('/taskAdd', MdRole.bnerIsLogin, MdRole.sfUniLog, Task.taskAdd)
	app.post('/addTask', PostForm, MdRole.bnerIsLogin, Task.addTask)
	app.get('/taskList', MdRole.bnerIsLogin, Task.tasksFilter, Task.taskList)
	app.get('/taskListPrint', MdRole.bnerIsLogin, Task.tasksFilter, Task.taskListPrint)
	app.get('/taskDetail/:id', MdRole.bnerIsLogin, Task.taskFilter, Task.taskDetail)
	app.get('/taskUpdate/:id', MdRole.bnerIsLogin, Task.taskFilter, Task.taskUpdate)
	app.post('/updateTask', PostForm, MdRole.bnerIsLogin, Task.updateTask)
	app.get('/taskDel/:id', MdRole.bnerIsLogin, Task.taskFilter, Task.taskDel)
	app.get('/taskStatus', MdRole.bnerIsLogin, Task.taskStatus)

	// Nation ------------------------------------------------------------------------------
	app.get('/nationList', MdRole.bnerIsLogin, Nation.nationsFilter, Nation.nationList)
	app.get('/nationListPrint', MdRole.bnerIsLogin, Nation.nationsFilter, Nation.nationListPrint)
	app.get('/nationDetail/:id', MdRole.bnerIsLogin, Nation.nationDetail)
	app.get('/nationAdd', MdRole.bnerIsLogin, Nation.nationAdd)
	app.post('/addNation', PostForm, MdRole.bnerIsLogin, Nation.addNation)
	app.get('/nationUpdate/:id', MdRole.bnerIsLogin, Nation.nationUpdate)
	app.post('/updateNation', PostForm, MdRole.bnerIsLogin, Nation.updateNation)
	app.delete('/nationDel', MdRole.bnerIsLogin, Nation.nationDel)
	// Bcateg ------------------------------------------------------------------------------
	app.get('/bcategList', MdRole.bnerIsLogin, Bcateg.bcategsFilter, Bcateg.bcategList)
	app.get('/bcategListPrint', MdRole.bnerIsLogin, Bcateg.bcategsFilter, Bcateg.bcategListPrint)
	app.get('/bcategAdd', MdRole.bnerIsLogin, Bcateg.bcategAdd)
	app.post('/addBcateg', PostForm, MdRole.bnerIsLogin, Bcateg.addBcateg)
	app.get('/bcategDetail/:id', MdRole.bnerIsLogin, Bcateg.bcategFilter, Bcateg.bcategDetail)
	app.get('/bcategPrint/:id', MdRole.bnerIsLogin, Bcateg.bcategFilter, Bcateg.bcategPrint)
	app.get('/bcategUpdate/:id', MdRole.bnerIsLogin, Bcateg.bcategFilter, Bcateg.bcategUpdate)
	app.post('/updateBcateg', PostForm, MdRole.bnerIsLogin, Bcateg.updateBcateg)
	app.delete('/bcategDel', MdRole.bnerIsLogin, Bcateg.bcategDel)

	// app.get('/ajaxBcateg', MdRole.bnerIsLogin, Bcateg.ajaxBcateg)
	app.get('/ajaxBcateg', Bcateg.ajaxBcateg)

	// Brand ------------------------------------------------------------------------------
	app.get('/brandAdd', MdRole.bnerIsLogin, Brand.brandAdd)
	app.get('/brandList', MdRole.bnerIsLogin, Brand.brandsFilter, Brand.brandList)
	app.get('/brandListPrint', MdRole.bnerIsLogin, Brand.brandsFilter, Brand.brandListPrint)
	app.get('/brandDetail/:id', MdRole.bnerIsLogin, Brand.brandFilter, Brand.brandDetail)
	app.get('/brandUpdate/:id', MdRole.bnerIsLogin, Brand.brandFilter, Brand.brandUpdate)
	app.post('/addBrand', PostForm, MdRole.bnerIsLogin, Brand.addBrand)
	app.post('/updateBrand', PostForm, MdRole.bnerIsLogin, Brand.updateBrand)
	app.delete('/brandDel', MdRole.bnerIsLogin, Brand.brandDel)

	app.get('/ajaxCodeBrand', MdRole.bnerIsLogin, Brand.ajaxCodeBrand)
	app.get('/ajaxBrandSts', MdRole.bnerIsLogin, Brand.ajaxBrandSts)

	// Vendor ------------------------------------------------------------------------------
	app.get('/vendorAdd', MdRole.bnerIsLogin, Vendor.vendorAdd)
	app.get('/vendorList', MdRole.bnerIsLogin, Vendor.vendorsFilter, Vendor.vendorList)
	app.get('/vendorListPrint', MdRole.bnerIsLogin, Vendor.vendorsFilter, Vendor.vendorListPrint)
	app.get('/vendorDetail/:id', MdRole.bnerIsLogin, Vendor.vendorFilter, Vendor.vendorDetail)
	app.get('/vendorUpdate/:id', MdRole.bnerIsLogin, Vendor.vendorFilter, Vendor.vendorUpdate)
	app.post('/addVendor', PostForm, MdRole.bnerIsLogin, Vendor.addVendor)
	app.post('/updateVendor', PostForm, MdRole.bnerIsLogin, Vendor.updateVendor)
	app.delete('/vendorDel', MdRole.bnerIsLogin, Vendor.vendorDel)

	app.get('/ajaxCodeVendor', MdRole.bnerIsLogin, Vendor.ajaxCodeVendor)
	app.get('/ajaxVendorSts', MdRole.bnerIsLogin, Vendor.ajaxVendorSts)

	// Scont ------------------------------------------------------------------------------
	app.get('/scontAdd', MdRole.bnerIsLogin, Scont.scontAdd)
	app.get('/scontList', MdRole.bnerIsLogin, Scont.scontsFilter, Scont.scontList)
	app.get('/scontListPrint', MdRole.bnerIsLogin, Scont.scontsFilter, Scont.scontListPrint)
	app.get('/scontDetail/:id', MdRole.bnerIsLogin, Scont.scontFilter, Scont.scontDetail)
	app.get('/scontPdf/:id', MdRole.bnerIsLogin, Scont.scontFilter, Scont.scontPdf)
	app.get('/scontUpdate/:id', MdRole.bnerIsLogin, Scont.scontFilter, Scont.scontUpdate)
	app.post('/addScont', PostForm, MdRole.bnerIsLogin, Scont.addScont)
	app.post('/updateScont', PostForm, MdRole.bnerIsLogin, Scont.updateScont)
	app.delete('/scontDel', MdRole.bnerIsLogin, Scont.scontDel)

	app.get('/ajaxScontSts', MdRole.bnerIsLogin, Scont.ajaxScontSts)
	// Scont
	// scont
};