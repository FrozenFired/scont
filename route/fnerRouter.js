let Order = require('../app/controllers/sfer/fner/order');
let Pay = require('../app/controllers/sfer/fner/pay');
let Vder = require('../app/controllers/sfer/fner/vder');


let MiddleBcrypt = require('../app/middle/middleBcrypt');
let MiddleRole = require('../app/middle/middleRole');
let MiddlePicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();

module.exports = function(app){

	// Order         ----------------------------------------------------------------------
	app.get('/fnOrderList', MiddleRole.fnerIsLogin, Order.fnOrdersFilter, Order.fnOrderList)
	app.get('/fnOrderListPrint', MiddleRole.fnerIsLogin, Order.fnOrdersFilter, Order.fnOrderListPrint)
	app.get('/fnOrderAdd', MiddleRole.fnerIsLogin, MiddleRole.singleSferLogin, Order.fnOrderAdd)
	app.post('/fnAddOrder', multipartMiddleware, MiddleRole.fnerIsLogin, MiddleRole.singleSferLogin, Order.fnAddOrder)
	app.get('/fnOrderDetail/:id', MiddleRole.fnerIsLogin, Order.fnOrderFilter, Order.fnOrderDetail)
	app.get('/fnOrderUpMd/:id', MiddleRole.fnerIsLogin, Order.fnOrderFilter, Order.fnOrderUpMd)
	app.get('/fnOrderUpPrice/:id', MiddleRole.fnerIsLogin, Order.fnOrderFilter, Order.fnOrderUpPrice)
	app.post('/fnUpdateOrder', multipartMiddleware, MiddleRole.fnerIsLogin, MiddleRole.singleSferLogin, Order.fnUpdateOrder)
	app.get('/fnOrderDel/:id', MiddleRole.fnerIsLogin, Order.fnOrderFilter, Order.fnOrderDel)

	app.get('/fnOrderStatus', MiddleRole.fnerIsLogin, Order.fnOrderStatus)

	// Pay         ----------------------------------------------------------------------
	app.get('/fnPayList', MiddleRole.fnerIsLogin, Pay.fnPaysFilter, Pay.fnPayList)
	app.get('/fnPayListPrint', MiddleRole.fnerIsLogin, Pay.fnPaysFilter, Pay.fnPayListPrint)
	// app.get('/fnPayAdd', MiddleRole.fnerIsLogin, MiddleRole.singleSferLogin, Pay.fnPayAdd)
	// app.post('/fnAddPay', multipartMiddleware, MiddleRole.fnerIsLogin, MiddleRole.singleSferLogin, Pay.fnAddPay)
	app.post('/fnUpdatePay', multipartMiddleware, MiddleRole.fnerIsLogin, MiddleRole.singleSferLogin, Pay.fnUpdatePay)
	app.get('/fnPayDetail/:id', MiddleRole.fnerIsLogin, Pay.fnPayFilter, Pay.fnPayDetail)
	app.get('/fnPayUpdate/:id', MiddleRole.fnerIsLogin, Pay.fnPayFilter, Pay.fnPayUpdate)
	// app.get('/fnPayDel/:id', MiddleRole.fnerIsLogin, Pay.fnPayFilter, Pay.fnPayDel)

	app.get('/fnPayStatus', MiddleRole.fnerIsLogin, Pay.fnPayStatus)

	// Vder ---------------------------------------------------------------------------------
	app.get('/fnVderList', MiddleRole.fnerIsLogin, Vder.fnVdersFilter, Vder.fnVderList)
	app.get('/fnVderDetail/:id', MiddleRole.fnerIsLogin, Vder.fnVderFilter, Vder.fnVderDetail)
	app.post('/fnUpVderInfo', MiddleRole.fnerIsLogin, multipartMiddleware, 
		Vder.fnCheckVderUp, Vder.fnUpVderInfo)
	app.get('/ajaxFnVendor', MiddleRole.fnerIsLogin, Vder.ajaxFnVendor)
};