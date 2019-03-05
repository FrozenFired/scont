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

	app.get('/option', MdRole.sfitIsLogin, Index.option);
	app.get('/headerBrand', MdRole.sfitIsLogin, Brand.brandsFilter, Brand.headerBrand)

	// Sfer -------------------------------------------------------------------------------
	app.get('/sferDetail/:id', MdRole.sfitIsLogin, MdRole.sfUniLog, Sfer.sferDetail);
	app.post('/updateSferInfo', PostForm, MdRole.sfitIsLogin,
		MdPicture.addNewPhoto, Sfer.checkSferUp, 
		Sfer.updateSferInfo);
	app.post('/updateSferPw', PostForm, MdRole.sfitIsLogin,
		Sfer.checkSferOrgPw, MdBcrypt.rqBcrypt, 
		Sfer.updateSferPw);

	app.get('/ajaxSfer', MdRole.sfitIsLogin, Sfer.ajaxSfer)

	// task ------------------------------------------------------------------------------
	app.get('/taskAdd', MdRole.sfitIsLogin, MdRole.sfUniLog, Task.taskAdd)
	app.post('/addTask', PostForm, MdRole.sfitIsLogin, Task.addTask)
	app.get('/taskList', MdRole.sfitIsLogin, Task.tasksFilter, Task.taskList)
	app.get('/taskListPrint', MdRole.sfitIsLogin, Task.tasksFilter, Task.taskListPrint)
	app.get('/taskDetail/:id', MdRole.sfitIsLogin, Task.taskFilter, Task.taskDetail)
	app.get('/taskUpdate/:id', MdRole.sfitIsLogin, Task.taskFilter, Task.taskUpdate)
	app.post('/updateTask', PostForm, MdRole.sfitIsLogin, Task.updateTask)
	app.get('/taskDel/:id', MdRole.sfitIsLogin, Task.taskFilter, Task.taskDel)
	app.get('/taskStatus', MdRole.sfitIsLogin, Task.taskStatus)

	// Nation ------------------------------------------------------------------------------
	app.get('/nationList', MdRole.sfitIsLogin, Nation.nationsFilter, Nation.nationList)
	app.get('/nationListPrint', MdRole.sfitIsLogin, Nation.nationsFilter, Nation.nationListPrint)
	app.get('/nationDetail/:id', MdRole.sfitIsLogin, Nation.nationDetail)
	app.get('/nationAdd', MdRole.bnerIsLogin, Nation.nationAdd)
	app.post('/addNation', PostForm, MdRole.bnerIsLogin, Nation.addNation)
	app.get('/nationUpdate/:id', MdRole.bnerIsLogin, Nation.nationUpdate)
	app.post('/updateNation', PostForm, MdRole.bnerIsLogin, Nation.updateNation)
	app.delete('/nationDel', MdRole.bnerIsLogin, Nation.nationDel)
	// Bcateg ------------------------------------------------------------------------------
	app.get('/bcategList', MdRole.sfitIsLogin, Bcateg.bcategsFilter, Bcateg.bcategList)
	app.get('/bcategListPrint', MdRole.sfitIsLogin, Bcateg.bcategsFilter, Bcateg.bcategListPrint)
	app.get('/bcategAdd', MdRole.bnerIsLogin, Bcateg.bcategAdd)
	app.post('/addBcateg', PostForm, MdRole.bnerIsLogin, Bcateg.addBcateg)
	app.get('/bcategDetail/:id', MdRole.sfitIsLogin, Bcateg.bcategFilter, Bcateg.bcategDetail)
	app.get('/bcategPrint/:id', MdRole.sfitIsLogin, Bcateg.bcategFilter, Bcateg.bcategPrint)
	app.get('/bcategUpdate/:id', MdRole.bnerIsLogin, Bcateg.bcategFilter, Bcateg.bcategUpdate)
	app.post('/updateBcateg', PostForm, MdRole.bnerIsLogin, Bcateg.updateBcateg)
	app.delete('/bcategDel', MdRole.bnerIsLogin, Bcateg.bcategDel)

	app.get('/ajaxBcateg', MdRole.sfitIsLogin, Bcateg.ajaxBcateg)

	// Brand ------------------------------------------------------------------------------
	app.get('/brandAdd', MdRole.bnerIsLogin, Brand.brandAdd)
	app.get('/brandList', MdRole.sfitIsLogin, Brand.brandsFilter, Brand.brandList)
	app.get('/brandListPrint', MdRole.sfitIsLogin, Brand.brandsFilter, Brand.brandListPrint)
	app.get('/brandDetail/:id', MdRole.sfitIsLogin, Brand.brandFilter, Brand.brandDetail)
	app.get('/brandUpdate/:id', MdRole.bnerIsLogin, Brand.brandFilter, Brand.brandUpdate)
	app.post('/addBrand', PostForm, MdRole.bnerIsLogin, Brand.addBrand)
	app.post('/updateBrand', PostForm, MdRole.bnerIsLogin, Brand.updateBrand)
	app.delete('/brandDel', MdRole.bnerIsLogin, Brand.brandDel)

	app.get('/ajaxCodeBrand', MdRole.sfitIsLogin, Brand.ajaxCodeBrand)
	app.get('/ajaxBrandSts', MdRole.bnerIsLogin, Brand.ajaxBrandSts)

	// Vendor ------------------------------------------------------------------------------
	app.get('/vendorAdd', MdRole.bnerIsLogin, Vendor.vendorAdd)
	app.get('/vendorList', MdRole.sfitIsLogin, Vendor.vendorsFilter, Vendor.vendorList)
	app.get('/vendorListPrint', MdRole.sfitIsLogin, Vendor.vendorsFilter, Vendor.vendorListPrint)
	app.get('/vendorDetail/:id', MdRole.sfitIsLogin, Vendor.vendorFilter, Vendor.vendorDetail)
	app.get('/vendorUpdate/:id', MdRole.bnerIsLogin, Vendor.vendorFilter, Vendor.vendorUpdate)
	app.post('/addVendor', PostForm, MdRole.bnerIsLogin, Vendor.addVendor)
	app.post('/updateVendor', PostForm, MdRole.bnerIsLogin, Vendor.updateVendor)
	app.delete('/vendorDel', MdRole.bnerIsLogin, Vendor.vendorDel)

	app.get('/ajaxCodeVendor', MdRole.sfitIsLogin, Vendor.ajaxCodeVendor)
	app.get('/ajaxVendorSts', MdRole.bnerIsLogin, Vendor.ajaxVendorSts)

	// Scont ------------------------------------------------------------------------------
	app.get('/scontAdd', MdRole.sfitIsLogin, Scont.scontAdd)
	app.get('/scontList', MdRole.sfitIsLogin, Scont.scontsFilter, Scont.scontList)
	app.get('/scontListPrint', MdRole.sfitIsLogin, Scont.scontsFilter, Scont.scontListPrint)
	app.get('/scontDetail/:id', MdRole.sfitIsLogin, Scont.scontFilter, Scont.scontDetail)
	app.get('/scontPdf/:id', MdRole.sfitIsLogin, Scont.scontFilter, Scont.scontPdf)
	app.get('/scontUpdate/:id', MdRole.bnerIsLogin, Scont.scontFilter, Scont.scontUpdate)
	app.post('/addScont', PostForm, MdRole.sfitIsLogin, Scont.addScont)
	app.post('/updateScont', PostForm, MdRole.bnerIsLogin, Scont.updateScont)
	app.delete('/scontDel', MdRole.bnerIsLogin, Scont.scontDel)

	app.get('/ajaxScontSts', MdRole.bnerIsLogin, Scont.ajaxScontSts)
	// Scont
	// scont
};