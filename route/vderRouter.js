let Index = require('../app/controllers/vder/index');

let Vder = require('../app/controllers/vder/vder');
let Order = require('../app/controllers/vder/order');
let Brand = require('../app/controllers/vder/brand');

let MiddleBcrypt = require('../app/middle/middleBcrypt');
let MiddleRole = require('../app/middle/middleRole');

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();

module.exports = function(app){

	// index ---------------Vder 首页 登录页面 登录 登出---------------------------------------
	app.get('/vder', Index.vder);
	// app.get('/headerBrand', MiddleRole.vderIsLogin, Brand.brandsFilter, Brand.headerBrand)

	// Vder -------------------------------------------------------------------------------
	app.get('/vderDetail/:id', MiddleRole.vderIsLogin, Vder.vderDetail);
	app.post('/updateVderInfo', multipartMiddleware, MiddleRole.vderIsLogin,
		Vder.checkVderUp, Vder.updateVderInfo);
	app.post('/updateVderPw', multipartMiddleware, MiddleRole.vderIsLogin,
		Vder.checkVderOrgPw, MiddleBcrypt.rqBcrypt, 
		Vder.updateVderPw);

	app.get('/ajaxVder', MiddleRole.sfitIsLogin, Vder.ajaxVder)

	// order ------------------------------------------------------------------------------
	app.get('/orderList', MiddleRole.vderIsLogin, Order.ordersFilter, Order.orderList)
	app.get('/orderListPrint', MiddleRole.vderIsLogin, Order.ordersFilter, Order.orderListPrint)
	app.get('/orderDetail/:id', MiddleRole.vderIsLogin, Order.orderFilter, Order.orderDetail)
	app.post('/updateOrder', multipartMiddleware, MiddleRole.vderIsLogin, Order.updateOrder)
	app.get('/vdOrderStatus', multipartMiddleware, MiddleRole.vderIsLogin, Order.vdOrderStatus)

	// brand ---------------------------------------
	app.get('/vdBrandList', MiddleRole.vderIsLogin, Brand.vdBrandList)
};