let Index = require('../app/controllers/vder/index');

let Vder = require('../app/controllers/vder/vder');
let Order = require('../app/controllers/vder/order');
let Pay = require('../app/controllers/vder/pay');
let Brand = require('../app/controllers/vder/brand');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Vder 首页 登录页面 登录 登出---------------------------------------
	app.get('/vder', Index.vder);
	// app.get('/headerBrand', MdRole.vderIsLogin, Brand.brandsFilter, Brand.headerBrand)

	// Vder -------------------------------------------------------------------------------
	app.get('/vderDetail/:id', MdRole.vderIsLogin, Vder.vderDetail);
	app.post('/updateVderInfo', PostForm, MdRole.vderIsLogin,
		Vder.checkVderUp, Vder.updateVderInfo);
	app.post('/updateVderPw', PostForm, MdRole.vderIsLogin,
		Vder.checkVderOrgPw, MdBcrypt.rqBcrypt, 
		Vder.updateVderPw);

	// order ------------------------------------------------------------------------------
	app.get('/orderList', MdRole.vderIsLogin, Order.ordersFilter, Order.orderList)
	app.get('/orderListPrint', MdRole.vderIsLogin, Order.ordersFilter, Order.orderListPrint)
	app.get('/orderDetail/:id', MdRole.vderIsLogin, Order.orderFilter, Order.orderDetail)
	app.post('/updateOrder', PostForm, MdRole.vderIsLogin, Order.updateOrder)
	app.get('/vdOrderStatus', PostForm, MdRole.vderIsLogin, Order.vdOrderStatus)

	// Pay         ----------------------------------------------------------------------
	// app.get('/payRoop', Pay.payRoop)
	app.get('/payList', MdRole.vderIsLogin, Pay.paysFilter, Pay.payList)
	// app.get('/payDetail/:id', MdRole.vderIsLogin, Pay.payFilter, Pay.payDetail)

	// brand ---------------------------------------
	app.get('/vdBrandList', MdRole.vderIsLogin, Brand.vdBrandList)
};