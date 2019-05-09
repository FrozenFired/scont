let Index = require('../app/controllers/sfer/lger/index');

let Nation = require('../app/controllers/sfer/lger/nation');
let Bcateg = require('../app/controllers/sfer/lger/bcateg');

let Brand = require('../app/controllers/sfer/lger/brand');
let Vendor = require('../app/controllers/sfer/lger/vendor');
let Scont = require('../app/controllers/sfer/lger/scont');

let Order = require('../app/controllers/sfer/lger/order');
let Pay = require('../app/controllers/sfer/lger/pay');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	app.get('/headerLgBrand', MdRole.lgerIsLogin, Brand.brandsFilter, Brand.headerBrand)
	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/lger', MdRole.lgerIsLogin, Index.lger);
	
	// Nation ------------------------------------------------------------------------------
	app.get('/lgNations', MdRole.lgerIsLogin, Nation.nationsFilter, Nation.nations)
	app.get('/lgNationsPrint', MdRole.lgerIsLogin, Nation.nationsFilter, Nation.nationsPrint)
	app.get('/lgNation/:id', MdRole.lgerIsLogin, Nation.nation)
	// Bcateg ------------------------------------------------------------------------------
	app.get('/lgBcategs', MdRole.lgerIsLogin, Bcateg.bcategsFilter, Bcateg.bcategs)
	app.get('/lgBcategsPrint', MdRole.lgerIsLogin, Bcateg.bcategsFilter, Bcateg.bcategsPrint)
	app.get('/lgBcateg/:id', MdRole.lgerIsLogin, Bcateg.bcategFilter, Bcateg.bcateg)
	app.get('/lgBcategPrint/:id', MdRole.lgerIsLogin, Bcateg.bcategFilter, Bcateg.bcategPrint)

	// Brand ------------------------------------------------------------------------------
	app.get('/lgBrands', MdRole.lgerIsLogin, Brand.brandsFilter, Brand.brands)
	app.get('/lgBrandsPrint', MdRole.lgerIsLogin, Brand.brandsFilter, Brand.brandsPrint)
	app.get('/lgBrand/:id', MdRole.lgerIsLogin, Brand.brandFilter, Brand.brand)

	app.get('/lgAjaxCodeBrand', MdRole.lgerIsLogin, Brand.ajaxCodeBrand)

	// Vendor ------------------------------------------------------------------------------
	app.get('/lgVendors', MdRole.lgerIsLogin, Vendor.vendorsFilter, Vendor.vendors)
	app.get('/lgVendorsPrint', MdRole.lgerIsLogin, Vendor.vendorsFilter, Vendor.vendorsPrint)
	app.get('/lgVendor/:id', MdRole.lgerIsLogin, Vendor.vendorFilter, Vendor.vendor)

	app.get('/lgAjaxCodeVendor', MdRole.lgerIsLogin, Vendor.ajaxCodeVendor)
	app.get('/ajaxLgVendor', MdRole.lgerIsLogin, Vendor.ajaxVendor) // Order ajax vder

	// Scont ------------------------------------------------------------------------------
	// app.get('/lgScontAdd', MdRole.lgerIsLogin, Scont.scontAdd)
	app.get('/lgSconts', MdRole.lgerIsLogin, Scont.scontsFilter, Scont.sconts)
	app.get('/lgScontsPrint', MdRole.lgerIsLogin, Scont.scontsFilter, Scont.scontsPrint)
	app.get('/lgScont/:id', MdRole.lgerIsLogin, Scont.scontFilter, Scont.scont)
	app.get('/lgScontPdf/:id', MdRole.lgerIsLogin, Scont.scontFilter, Scont.scontPdf)
	// app.post('/lgAddScont', PostForm, MdRole.lgerIsLogin, Scont.addScont)


	// Order         ----------------------------------------------------------------------
	app.get('/lgOrders', MdRole.lgerIsLogin, Order.ordersFilter, Order.orders)
	app.get('/lgOrdersPrint', MdRole.lgerIsLogin, Order.ordersFilter, Order.ordersPrint)
	app.get('/lgOrder/:id', MdRole.lgerIsLogin, Order.orderFilter, Order.order)
	// app.get('/lgOrderUp/:id', MdRole.lgerIsLogin, Order.orderFilter, Order.orderUp)
	// app.post('/lgOrderUpd', PostForm, MdRole.lgerIsLogin, MdRole.sfUniLog, Order.orderUpd)
	// app.post('/lgOrderFixed', PostForm, MdRole.lgerIsLogin, MdRole.sfUniLog, Order.orderFixed)
	// app.get('/lgOrderAdd', MdRole.lgerIsLogin, MdRole.sfUniLog, Order.orderAdd)
	// app.post('/lgOrderNew', PostForm, MdRole.lgerIsLogin, MdRole.sfUniLog, Order.orderNew)
	// app.get('/lgOrderDel/:id', MdRole.lgerIsLogin, Order.orderFilter, Order.orderDel)

	// Pay         ----------------------------------------------------------------------
	app.get('/lgPays', MdRole.lgerIsLogin, Pay.paysFilter, Pay.pays)
	app.get('/lgPay/:id', MdRole.lgerIsLogin, Pay.payFilter, Pay.pay)

	app.get('/lgPayMailed', MdRole.lgerIsLogin, Pay.payMailed)
};