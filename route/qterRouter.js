let Index = require('../app/controllers/sfer/qter/index');

let Sfer = require('../app/controllers/sfer/qter/qter');

let Task = require('../app/controllers/sfer/qter/task');

let Nation = require('../app/controllers/sfer/qter/nation');
let Bcateg = require('../app/controllers/sfer/qter/bcateg');

let Brand = require('../app/controllers/sfer/qter/brand');
let Vendor = require('../app/controllers/sfer/qter/vendor');
let Scont = require('../app/controllers/sfer/qter/scont');

let Order = require('../app/controllers/sfer/qter/order');
let Pay = require('../app/controllers/sfer/qter/pay');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	app.get('/headerQtBrand', MdRole.qterIsLogin, Brand.brandsFilter, Brand.headerBrand)
	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/qter', MdRole.qterIsLogin, Index.qter);


	// Sfer -------------------------------------------------------------------------------
	app.get('/qterInfo', MdRole.qterIsLogin, Sfer.qterFilter, Sfer.qterInfo);
	app.post('/qterUpInfo', PostForm, MdRole.qterIsLogin, MdRole.sfUniLog, 
		MdPicture.addNewPhoto, Sfer.qterUp);
	app.post('/qterUpPw', PostForm, MdRole.qterIsLogin, MdRole.sfUniLog, 
		MdBcrypt.rqBcrypt, Sfer.qterUp);

	// task ------------------------------------------------------------------------------
	app.get('/qtTasks', MdRole.qterIsLogin, Task.tasksFilter, Task.tasks)
	app.get('/qtTasksPrint', MdRole.qterIsLogin, Task.tasksFilter, Task.tasksPrint)
	app.get('/qtTask/:id', MdRole.qterIsLogin, Task.taskFilter, Task.task)
	app.get('/qtTaskUp/:id', MdRole.qterIsLogin, Task.taskFilter, Task.taskUp)
	app.post('/qtTaskUpd', PostForm, MdRole.qterIsLogin, Task.taskUpd)
	app.get('/qtTaskAdd', MdRole.qterIsLogin, MdRole.sfUniLog, Task.taskAdd)
	app.post('/qtTaskNew', PostForm, MdRole.qterIsLogin, Task.qtTaskNew)
	app.get('/qtTaskDel/:id', MdRole.qterIsLogin, Task.taskFilter, Task.taskDel)
	app.get('/qtTaskStatus', MdRole.qterIsLogin, Task.taskStatus)

	// Nation ------------------------------------------------------------------------------
	app.get('/qtNations', MdRole.qterIsLogin, Nation.nationsFilter, Nation.nations)
	app.get('/qtNationsPrint', MdRole.qterIsLogin, Nation.nationsFilter, Nation.nationsPrint)
	app.get('/qtNation/:id', MdRole.qterIsLogin, Nation.nation)
	// Bcateg ------------------------------------------------------------------------------
	app.get('/qtBcategs', MdRole.qterIsLogin, Bcateg.bcategsFilter, Bcateg.bcategs)
	app.get('/qtBcategsPrint', MdRole.qterIsLogin, Bcateg.bcategsFilter, Bcateg.bcategsPrint)
	app.get('/qtBcateg/:id', MdRole.qterIsLogin, Bcateg.bcategFilter, Bcateg.bcateg)
	app.get('/qtBcategPrint/:id', MdRole.qterIsLogin, Bcateg.bcategFilter, Bcateg.bcategPrint)

	// Brand ------------------------------------------------------------------------------
	app.get('/qtBrands', MdRole.qterIsLogin, Brand.brandsFilter, Brand.brands)
	app.get('/qtBrandsPrint', MdRole.qterIsLogin, Brand.brandsFilter, Brand.brandsPrint)
	app.get('/qtBrand/:id', MdRole.qterIsLogin, Brand.brandFilter, Brand.brand)

	app.get('/qtAjaxCodeBrand', MdRole.qterIsLogin, Brand.ajaxCodeBrand)

	// Vendor ------------------------------------------------------------------------------
	app.get('/qtVendors', MdRole.qterIsLogin, Vendor.vendorsFilter, Vendor.vendors)
	app.get('/qtVendorsPrint', MdRole.qterIsLogin, Vendor.vendorsFilter, Vendor.vendorsPrint)
	app.get('/qtVendor/:id', MdRole.qterIsLogin, Vendor.vendorFilter, Vendor.vendor)

	app.get('/qtAjaxCodeVendor', MdRole.qterIsLogin, Vendor.ajaxCodeVendor)
	app.get('/ajaxQtVendor', MdRole.qterIsLogin, Vendor.ajaxVendor) // Order ajax vder

	// Scont ------------------------------------------------------------------------------
	app.get('/qtScontAdd', MdRole.qterIsLogin, Scont.scontAdd)
	app.get('/qtSconts', MdRole.qterIsLogin, Scont.scontsFilter, Scont.sconts)
	app.get('/qtScontsPrint', MdRole.qterIsLogin, Scont.scontsFilter, Scont.scontsPrint)
	app.get('/qtScont/:id', MdRole.qterIsLogin, Scont.scontFilter, Scont.scont)
	app.get('/qtScontPdf/:id', MdRole.qterIsLogin, Scont.scontFilter, Scont.scontPdf)
	app.post('/qtAddScont', PostForm, MdRole.qterIsLogin, Scont.addScont)

	app.get('/qtAjaxScontSts', MdRole.qterIsLogin, Scont.ajaxScontSts)



	// Order         ----------------------------------------------------------------------
	app.get('/qtOrders', MdRole.qterIsLogin, Order.ordersFilter, Order.orders)
	app.get('/qtOrdersPrint', MdRole.qterIsLogin, Order.ordersFilter, Order.ordersPrint)
	app.get('/qtOrder/:id', MdRole.qterIsLogin, Order.orderFilter, Order.order)
	app.get('/qtOrderUp/:id', MdRole.qterIsLogin, Order.orderFilter, Order.orderUp)
	app.post('/qtOrderUpd', PostForm, MdRole.qterIsLogin, MdRole.sfUniLog, Order.orderUpd)
	app.post('/qtOrderFixed', PostForm, MdRole.qterIsLogin, MdRole.sfUniLog, Order.orderFixed)
	app.get('/qtOrderAdd', MdRole.qterIsLogin, MdRole.sfUniLog, Order.orderAdd)
	app.post('/qtOrderNew', PostForm, MdRole.qterIsLogin, MdRole.sfUniLog, Order.orderNew)
	app.get('/qtOrderDel/:id', MdRole.qterIsLogin, Order.orderFilter, Order.orderDel)

	// Pay         ----------------------------------------------------------------------
	app.get('/qtPays', MdRole.qterIsLogin, Pay.paysFilter, Pay.pays)
	app.get('/qtPay/:id', MdRole.qterIsLogin, Pay.payFilter, Pay.pay)

	app.get('/qtPayMailed', MdRole.qterIsLogin, Pay.payMailed)
};