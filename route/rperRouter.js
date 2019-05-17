let Index = require('../app/controllers/sfer/rper/index');

let Nation = require('../app/controllers/sfer/rper/nation');
let Bcateg = require('../app/controllers/sfer/rper/bcateg');

let Brand = require('../app/controllers/sfer/rper/brand');
let Vendor = require('../app/controllers/sfer/rper/vendor');
let Scont = require('../app/controllers/sfer/rper/scont');

let Order = require('../app/controllers/sfer/rper/order');
let Pay = require('../app/controllers/sfer/rper/pay');

let RpCar = require('../app/controllers/sfer/rper/car');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	app.get('/headerRpBrand', MdRole.rperIsLogin, Brand.brandsFilter, Brand.headerBrand)
	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/rper', MdRole.rperIsLogin, Index.rper);
	
	// Nation ------------------------------------------------------------------------------
	app.get('/rpNations', MdRole.rperIsLogin, Nation.nationsFilter, Nation.nations)
	app.get('/rpNationsPrint', MdRole.rperIsLogin, Nation.nationsFilter, Nation.nationsPrint)
	app.get('/rpNation/:id', MdRole.rperIsLogin, Nation.nation)
	// Bcateg ------------------------------------------------------------------------------
	app.get('/rpBcategs', MdRole.rperIsLogin, Bcateg.bcategsFilter, Bcateg.bcategs)
	app.get('/rpBcategsPrint', MdRole.rperIsLogin, Bcateg.bcategsFilter, Bcateg.bcategsPrint)
	app.get('/rpBcateg/:id', MdRole.rperIsLogin, Bcateg.bcategFilter, Bcateg.bcateg)
	app.get('/rpBcategPrint/:id', MdRole.rperIsLogin, Bcateg.bcategFilter, Bcateg.bcategPrint)

	// Brand ------------------------------------------------------------------------------
	app.get('/rpBrands', MdRole.rperIsLogin, Brand.brandsFilter, Brand.brands)
	app.get('/rpBrandsPrint', MdRole.rperIsLogin, Brand.brandsFilter, Brand.brandsPrint)
	app.get('/rpBrand/:id', MdRole.rperIsLogin, Brand.brandFilter, Brand.brand)

	app.get('/rpAjaxCodeBrand', MdRole.rperIsLogin, Brand.ajaxCodeBrand)

	// Vendor ------------------------------------------------------------------------------
	app.get('/rpVendors', MdRole.rperIsLogin, Vendor.vendorsFilter, Vendor.vendors)
	app.get('/rpVendorsPrint', MdRole.rperIsLogin, Vendor.vendorsFilter, Vendor.vendorsPrint)
	app.get('/rpVendor/:id', MdRole.rperIsLogin, Vendor.vendorFilter, Vendor.vendor)

	app.get('/rpAjaxCodeVendor', MdRole.rperIsLogin, Vendor.ajaxCodeVendor)
	app.get('/ajaxRpVendor', MdRole.rperIsLogin, Vendor.ajaxVendor) // Order ajax vder

	// Scont ------------------------------------------------------------------------------
	// app.get('/rpScontAdd', MdRole.rperIsLogin, Scont.scontAdd)
	app.get('/rpSconts', MdRole.rperIsLogin, Scont.scontsFilter, Scont.sconts)
	app.get('/rpScontsPrint', MdRole.rperIsLogin, Scont.scontsFilter, Scont.scontsPrint)
	app.get('/rpScont/:id', MdRole.rperIsLogin, Scont.scontFilter, Scont.scont)
	app.get('/rpScontPdf/:id', MdRole.rperIsLogin, Scont.scontFilter, Scont.scontPdf)
	// app.post('/rpAddScont', PostForm, MdRole.rperIsLogin, Scont.addScont)


	// Order         ----------------------------------------------------------------------
	app.get('/rpOrders', MdRole.rperIsLogin, Order.ordersFilter, Order.orders)
	app.get('/rpOrdersPrint', MdRole.rperIsLogin, Order.ordersFilter, Order.ordersPrint)
	app.get('/rpOrder/:id', MdRole.rperIsLogin, Order.orderFilter, Order.order)
	// app.get('/rpOrderUp/:id', MdRole.rperIsLogin, Order.orderFilter, Order.orderUp)
	// app.post('/rpOrderUpd', PostForm, MdRole.rperIsLogin, MdRole.sfUniLog, Order.orderUpd)
	// app.post('/rpOrderFixed', PostForm, MdRole.rperIsLogin, MdRole.sfUniLog, Order.orderFixed)
	// app.get('/rpOrderAdd', MdRole.rperIsLogin, MdRole.sfUniLog, Order.orderAdd)
	// app.post('/rpOrderNew', PostForm, MdRole.rperIsLogin, MdRole.sfUniLog, Order.orderNew)
	// app.get('/rpOrderDel/:id', MdRole.rperIsLogin, Order.orderFilter, Order.orderDel)

	// Pay         ----------------------------------------------------------------------
	app.get('/rpPays', MdRole.rperIsLogin, Pay.paysFilter, Pay.pays)
	app.get('/rpPay/:id', MdRole.rperIsLogin, Pay.payFilter, Pay.pay)

	app.get('/rpPayMailed', MdRole.rperIsLogin, Pay.payMailed)


	// car ------------------------------------------------------------------------------
	app.get('/rpCars', MdRole.rperIsLogin, RpCar.rpCars)
	app.get('/rpCar/:id', MdRole.rperIsLogin, RpCar.rpCarFilter, RpCar.rpCar)
	app.get('/rpCarUp/:id', MdRole.rperIsLogin, RpCar.rpCarFilter, RpCar.rpCarUp)
	app.post('/rpCarUpd', PostForm, MdRole.rperIsLogin, MdPicture.addNewPhoto, RpCar.rpCarUpd)
	app.get('/rpCarAdd', MdRole.rperIsLogin, RpCar.rpCarAdd)
	app.post('/rpCarNew', PostForm, MdRole.rperIsLogin, MdPicture.addNewPhoto, RpCar.rpCarNew)
	app.get('/rpCarDel/:id', MdRole.rperIsLogin, RpCar.rpCarFilter, RpCar.rpCarDel)

	app.get('/rpCarCnfm', MdRole.rperIsLogin, RpCar.rpCarCnfm)
	app.get('/rpCarEnd', MdRole.rperIsLogin, RpCar.rpCarEnd)
};