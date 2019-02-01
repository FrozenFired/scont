let Index = require('../app/controllers/vder/index');

let Vder = require('../app/controllers/vder/vder');
let Payment = require('../app/controllers/vder/payment');
let Brand = require('../app/controllers/vder/brand');

let MiddleBcrypt = require('../app/middle/middleBcrypt');
let MiddleRole = require('../app/middle/middleRole');

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();

module.exports = function(app){

	// index ---------------Vder 首页 登录页面 登录 登出---------------------------------------
	app.get('/vder', Index.vder);
	app.get('/vderLogin', Index.vderLogin);
	app.post('/loginVder', Index.loginVder);
	app.get('/vderLogout', Index.vderLogout);

	// app.get('/headerBrand', MiddleRole.vderIsLogin, Brand.brandsFilter, Brand.headerBrand)

	// Vder -------------------------------------------------------------------------------
	app.get('/vderDetail/:id', MiddleRole.vderIsLogin, Vder.vderDetail);
	app.post('/updateVderInfo', multipartMiddleware, MiddleRole.vderIsLogin,
		Vder.checkVderUp, Vder.updateVderInfo);
	app.post('/updateVderPw', multipartMiddleware, MiddleRole.vderIsLogin,
		Vder.checkVderOrgPw, MiddleBcrypt.rqBcrypt, 
		Vder.updateVderPw);

	app.get('/ajaxVder', MiddleRole.sfitIsLogin, Vder.ajaxVder)

	// payment ------------------------------------------------------------------------------
	app.get('/paymentList', MiddleRole.vderIsLogin, Payment.paymentsFilter, Payment.paymentList)
	app.get('/paymentListPrint', MiddleRole.vderIsLogin, Payment.paymentsFilter, Payment.paymentListPrint)
	app.get('/paymentDetail/:id', MiddleRole.vderIsLogin, Payment.paymentFilter, Payment.paymentDetail)
	app.post('/updatePayment', multipartMiddleware, MiddleRole.vderIsLogin, Payment.updatePayment)

	// brand ---------------------------------------
	app.get('/vdBrandList', MiddleRole.vderIsLogin, Brand.vdBrandList)
};