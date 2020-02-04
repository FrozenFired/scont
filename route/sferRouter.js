let Index = require('../app/controllers/sfer/sfer/index');

let Sfer = require('../app/controllers/sfer/sfer/sfer');

let Nation = require('../app/controllers/sfer/sfer/nation');
let Bcateg = require('../app/controllers/sfer/sfer/bcateg');
let Brand = require('../app/controllers/sfer/sfer/brand');
let Vendor = require('../app/controllers/sfer/sfer/vendor');
let Scont = require('../app/controllers/sfer/sfer/scont');

let Ord = require('../app/controllers/sfer/sfer/ord');

let Order = require('../app/controllers/sfer/sfer/order');
let Pay = require('../app/controllers/sfer/sfer/pay');

let Task = require('../app/controllers/sfer/sfer/task');
let Car = require('../app/controllers/sfer/sfer/car');
let Cared = require('../app/controllers/sfer/sfer/cared');
let Absence = require('../app/controllers/sfer/sfer/absence');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------

	app.get('/headerBrand', MdRole.sferIsLogin, Brand.brandsFilter, Brand.headerBrand)

	// Sfer -------------------------------------------------------------------------------
	app.get('/sferInfo', MdRole.sferIsLogin, Sfer.sferFilter, Sfer.sferInfo);
	app.post('/sferUpInfo', PostForm, MdRole.sferIsLogin, MdRole.sfUniLog, 
		MdPicture.addNewPhoto, Sfer.sferUp);
	app.post('/sferUpPw', PostForm, MdRole.sferIsLogin, MdRole.sfUniLog, 
		MdBcrypt.rqBcrypt, Sfer.sferUp);

	// Nation ------------------------------------------------------------------------------
	app.get('/sfNations', MdRole.sferIsLogin, Nation.nationsFilter, Nation.nations)
	app.get('/sfNationsPrint', MdRole.sferIsLogin, Nation.nationsFilter, Nation.nationsPrint)
	app.get('/sfNation/:id', MdRole.sferIsLogin, Nation.nation)
	// Bcateg ------------------------------------------------------------------------------
	app.get('/sfBcategs', MdRole.sferIsLogin, Bcateg.bcategsFilter, Bcateg.bcategs)
	app.get('/sfBcategsPrint', MdRole.sferIsLogin, Bcateg.bcategsFilter, Bcateg.bcategsPrint)
	app.get('/sfBcateg/:id', MdRole.sferIsLogin, Bcateg.bcategFilter, Bcateg.bcateg)
	app.get('/sfBcategPrint/:id', MdRole.sferIsLogin, Bcateg.bcategFilter, Bcateg.bcategPrint)

	// Brand ------------------------------------------------------------------------------
	app.get('/sfBrands', MdRole.sferIsLogin, Brand.brandsFilter, Brand.brands)
	app.get('/sfBrandsPrint', MdRole.sferIsLogin, Brand.brandsFilter, Brand.brandsPrint)
	app.get('/sfBrand/:id', MdRole.sferIsLogin, Brand.brandFilter, Brand.brand)

	app.get('/sfAjaxCodeBrand', MdRole.sferIsLogin, Brand.ajaxCodeBrand)

	// Vendor ------------------------------------------------------------------------------
	app.get('/sfVendors', MdRole.sferIsLogin, Vendor.vendorsFilter, Vendor.vendors)
	app.get('/sfVendorsPrint', MdRole.sferIsLogin, Vendor.vendorsFilter, Vendor.vendorsPrint)
	app.get('/sfVendor/:id', MdRole.sferIsLogin, Vendor.vendorFilter, Vendor.vendor)

	app.get('/sfAjaxCodeVendor', MdRole.sferIsLogin, Vendor.ajaxCodeVendor)
	app.get('/ajaxSfVendor', MdRole.sferIsLogin, Vendor.ajaxVendor) // Order ajax vder

	// Scont ------------------------------------------------------------------------------
	app.get('/sfScontAdd', MdRole.sferIsLogin, Scont.scontAdd)
	app.get('/sfSconts', MdRole.sferIsLogin, Scont.scontsFilter, Scont.sconts)
	app.get('/sfScontsPrint', MdRole.sferIsLogin, Scont.scontsFilter, Scont.scontsPrint)
	app.get('/sfScont/:id', MdRole.sferIsLogin, Scont.scontFilter, Scont.scont)
	app.get('/sfScontPdf/:id', MdRole.sferIsLogin, Scont.scontFilter, Scont.scontPdf)
	app.post('/sfAddScont', PostForm, MdRole.sferIsLogin, Scont.addScont)

	app.get('/sfAjaxScontSts', MdRole.sferIsLogin, Scont.ajaxScontSts)

	// Ord         ----------------------------------------------------------------------
	app.get('/sfOrds', MdRole.sferIsLogin, Ord.ordsFilter, Ord.ords)
	app.get('/sfOrd/:id', MdRole.sferIsLogin, Ord.ordFilter, Ord.ord)
	app.get('/sfOrdUp/:id', MdRole.sferIsLogin, Ord.ordFilter, Ord.ordUp)
	app.post('/sfOrdUpd', PostForm, MdRole.sferIsLogin, MdRole.sfUniLog, Ord.ordUpd)
	app.get('/sfOrdAdd', MdRole.sferIsLogin, MdRole.sfUniLog, Ord.ordAdd)
	app.post('/sfOrdNew', PostForm, MdRole.sferIsLogin, MdRole.sfUniLog, Ord.sfOrdNew)
	app.get('/sfOrdDel/:id', MdRole.sferIsLogin, Ord.ordFilter, Ord.ordDel)

	// Order         ----------------------------------------------------------------------
	app.get('/sfOrders', MdRole.sferIsLogin, Order.ordersFilter, Order.orders)
	app.get('/sfOrdersPrint', MdRole.sferIsLogin, Order.ordersFilter, Order.ordersPrint)
	app.get('/sfOrder/:id', MdRole.sferIsLogin, Order.orderFilter, Order.order)
	app.get('/sfOrderUp/:id', MdRole.sferIsLogin, Order.orderFilter, Order.orderUp)
	app.post('/sfOrderUpd', PostForm, MdRole.sferIsLogin, MdRole.sfUniLog, Order.orderUpd)
	app.post('/sfOrderFixed', PostForm, MdRole.sferIsLogin, MdRole.sfUniLog, Order.orderFixed)
	app.get('/sfOrderAdd', MdRole.sferIsLogin, MdRole.sfUniLog, Order.orderAdd)
	app.post('/sfOrderNew', PostForm, MdRole.sferIsLogin, MdRole.sfUniLog, Order.sfOrderNew)
	app.get('/sfOrderDel/:id', MdRole.sferIsLogin, Order.orderFilter, Order.orderDel)

	// Pay         ----------------------------------------------------------------------
	app.get('/sfPays', MdRole.sferIsLogin, Pay.paysFilter, Pay.pays)
	app.get('/sfPay/:id', MdRole.sferIsLogin, Pay.payFilter, Pay.pay)

	app.get('/sfPayMailed', MdRole.sferIsLogin, Pay.payMailed)



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
	// app.get('/sfCared/:id', MdRole.sferIsLogin, Cared.sfCaredFilter, Cared.sfCared)
	app.get('/sfCaredDel/:id', MdRole.rperIsLogin, Cared.sfCaredFilter, Cared.sfCaredDel)

	// absence ------------------------------------------------------------------------------
	app.get('/sfAbsences', MdRole.sferIsLogin, Absence.sfAbsences)
	app.get('/sfAbsencesAjax', MdRole.sferIsLogin, Absence.sfAbsencesAjax)
	app.get('/sfAbsencesMonth', MdRole.sferIsLogin, Absence.sfAbsencesMonth)
	app.get('/sfAbsencesMonthAjax', MdRole.sferIsLogin, Absence.sfAbsencesMonthAjax)


	app.get('/sfAbsenceAdd', MdRole.sferIsLogin, MdRole.sfUniLog, Absence.absenceAdd)
	app.post('/sfAbsenceNew', PostForm, MdRole.sferIsLogin, Absence.absenceNew)

	app.get('/sfAbsenceConfirm', MdRole.sferIsLogin, Absence.sfAbsenceConfirm) // page
	app.get('/sfAbsenceStatus', MdRole.sferIsLogin, Absence.absenceStatus)

	app.get('/sfAbsenceDel/:id', MdRole.sferIsLogin, Absence.absenceDel)
	app.delete('/sfAbsenceDelAjax', MdRole.sferIsLogin, Absence.absenceDelAjax)

};