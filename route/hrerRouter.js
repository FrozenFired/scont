let Index = require('../app/controllers/sfer/hrer/index');

let Nation = require('../app/controllers/sfer/hrer/nation');
let Bcateg = require('../app/controllers/sfer/hrer/bcateg');

let Brand = require('../app/controllers/sfer/hrer/brand');
let Vendor = require('../app/controllers/sfer/hrer/vendor');
let Scont = require('../app/controllers/sfer/hrer/scont');

let Order = require('../app/controllers/sfer/hrer/order');
let Pay = require('../app/controllers/sfer/hrer/pay');

let HrCar = require('../app/controllers/sfer/hrer/car');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	app.get('/headerHrBrand', MdRole.hrerIsLogin, Brand.brandsFilter, Brand.headerBrand)
	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/hrer', MdRole.hrerIsLogin, Index.hrer);
	
	// Nation ------------------------------------------------------------------------------
	app.get('/hrNations', MdRole.hrerIsLogin, Nation.nationsFilter, Nation.nations)
	app.get('/hrNationsPrint', MdRole.hrerIsLogin, Nation.nationsFilter, Nation.nationsPrint)
	app.get('/hrNation/:id', MdRole.hrerIsLogin, Nation.nation)
	// Bcateg ------------------------------------------------------------------------------
	app.get('/hrBcategs', MdRole.hrerIsLogin, Bcateg.bcategsFilter, Bcateg.bcategs)
	app.get('/hrBcategsPrint', MdRole.hrerIsLogin, Bcateg.bcategsFilter, Bcateg.bcategsPrint)
	app.get('/hrBcateg/:id', MdRole.hrerIsLogin, Bcateg.bcategFilter, Bcateg.bcateg)
	app.get('/hrBcategPrint/:id', MdRole.hrerIsLogin, Bcateg.bcategFilter, Bcateg.bcategPrint)

	// Brand ------------------------------------------------------------------------------
	app.get('/hrBrands', MdRole.hrerIsLogin, Brand.brandsFilter, Brand.brands)
	app.get('/hrBrandsPrint', MdRole.hrerIsLogin, Brand.brandsFilter, Brand.brandsPrint)
	app.get('/hrBrand/:id', MdRole.hrerIsLogin, Brand.brandFilter, Brand.brand)

	app.get('/hrAjaxCodeBrand', MdRole.hrerIsLogin, Brand.ajaxCodeBrand)

	// Vendor ------------------------------------------------------------------------------
	app.get('/hrVendors', MdRole.hrerIsLogin, Vendor.vendorsFilter, Vendor.vendors)
	app.get('/hrVendorsPrint', MdRole.hrerIsLogin, Vendor.vendorsFilter, Vendor.vendorsPrint)
	app.get('/hrVendor/:id', MdRole.hrerIsLogin, Vendor.vendorFilter, Vendor.vendor)

	app.get('/hrAjaxCodeVendor', MdRole.hrerIsLogin, Vendor.ajaxCodeVendor)
	app.get('/ajaxHrVendor', MdRole.hrerIsLogin, Vendor.ajaxVendor) // Order ajax vder

	// Scont ------------------------------------------------------------------------------
	// app.get('/hrScontAdd', MdRole.hrerIsLogin, Scont.scontAdd)
	app.get('/hrSconts', MdRole.hrerIsLogin, Scont.scontsFilter, Scont.sconts)
	app.get('/hrScontsPrint', MdRole.hrerIsLogin, Scont.scontsFilter, Scont.scontsPrint)
	app.get('/hrScont/:id', MdRole.hrerIsLogin, Scont.scontFilter, Scont.scont)
	app.get('/hrScontPdf/:id', MdRole.hrerIsLogin, Scont.scontFilter, Scont.scontPdf)
	// app.post('/hrAddScont', PostForm, MdRole.hrerIsLogin, Scont.addScont)


	// Order         ----------------------------------------------------------------------
	app.get('/hrOrders', MdRole.hrerIsLogin, Order.ordersFilter, Order.orders)
	app.get('/hrOrdersPrint', MdRole.hrerIsLogin, Order.ordersFilter, Order.ordersPrint)
	app.get('/hrOrder/:id', MdRole.hrerIsLogin, Order.orderFilter, Order.order)
	// app.get('/hrOrderUp/:id', MdRole.hrerIsLogin, Order.orderFilter, Order.orderUp)
	// app.post('/hrOrderUpd', PostForm, MdRole.hrerIsLogin, MdRole.sfUniLog, Order.orderUpd)
	// app.post('/hrOrderFixed', PostForm, MdRole.hrerIsLogin, MdRole.sfUniLog, Order.orderFixed)
	// app.get('/hrOrderAdd', MdRole.hrerIsLogin, MdRole.sfUniLog, Order.orderAdd)
	// app.post('/hrOrderNew', PostForm, MdRole.hrerIsLogin, MdRole.sfUniLog, Order.orderNew)
	// app.get('/hrOrderDel/:id', MdRole.hrerIsLogin, Order.orderFilter, Order.orderDel)

	// Pay         ----------------------------------------------------------------------
	app.get('/hrPays', MdRole.hrerIsLogin, Pay.paysFilter, Pay.pays)
	app.get('/hrPay/:id', MdRole.hrerIsLogin, Pay.payFilter, Pay.pay)

	app.get('/hrPayMailed', MdRole.hrerIsLogin, Pay.payMailed)


	// car ------------------------------------------------------------------------------
	app.get('/hrCars', MdRole.hrerIsLogin, HrCar.hrCars)
	app.get('/hrCar/:id', MdRole.hrerIsLogin, HrCar.hrCarFilter, HrCar.hrCar)
	app.get('/hrCarUp/:id', MdRole.hrerIsLogin, HrCar.hrCarFilter, HrCar.hrCarUp)
	app.post('/hrCarUpd', PostForm, MdRole.hrerIsLogin, MdPicture.addNewPhoto, HrCar.hrCarUpd)
	app.get('/hrCarAdd', MdRole.hrerIsLogin, HrCar.hrCarAdd)
	app.post('/hrCarNew', PostForm, MdRole.hrerIsLogin, MdPicture.addNewPhoto, HrCar.hrCarNew)
	app.get('/hrCarDel/:id', MdRole.hrerIsLogin, HrCar.hrCarFilter, HrCar.hrCarDel)

	app.get('/hrCarCnfm', MdRole.hrerIsLogin, HrCar.hrCarCnfm)
	app.get('/hrCarCncel', MdRole.hrerIsLogin, HrCar.hrCarCncel)
	app.get('/hrCarEnd', MdRole.hrerIsLogin, HrCar.hrCarEnd)
};