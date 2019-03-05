let Order = require('../app/controllers/sfer/oder/order');
let Vder = require('../app/controllers/sfer/oder/vder');
let Pay = require('../app/controllers/sfer/oder/pay');

let MiddleBcrypt = require('../app/middle/middleBcrypt');
let MiddleRole = require('../app/middle/middleRole');
let MiddlePicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();

module.exports = function(app){

	// Order         ----------------------------------------------------------------------
	app.get('/odOrderList', MiddleRole.oderIsLogin, Order.odOrdersFilter, Order.odOrderList)
	app.get('/odOrderListPrint', MiddleRole.oderIsLogin, Order.odOrdersFilter, Order.odOrderListPrint)
	app.get('/odOrderAdd', MiddleRole.oderIsLogin, MiddleRole.sfUniLog, Order.odOrderAdd)
	app.post('/odAddOrder', multipartMiddleware, MiddleRole.sfUniLog, Order.odAddOrder)
	app.post('/odUpOrder', multipartMiddleware, MiddleRole.sfUniLog, Order.odUpOrder)
	app.get('/odOrderDetail/:id', MiddleRole.oderIsLogin, Order.odOrderFilter, Order.odOrderDetail)
	app.get('/odOrderDel/:id', MiddleRole.oderIsLogin, Order.odOrderFilter, Order.odOrderDel)
	// app.get('/odOrderUpPrice/:id', MiddleRole.oderIsLogin, Order.odOrderFilter, Order.odOrderUpPrice)
	// app.get('/odOrderUpMd/:id', MiddleRole.oderIsLogin, Order.odOrderFilter, Order.odOrderUpMd)
	// app.post('/odUpOrder', multipartMiddleware, MiddleRole.oderIsLogin, MiddleRole.sfUniLog, Order.odUpOrder)
	// app.get('/odOrderStatus', MiddleRole.oderIsLogin, Order.odOrderStatus)

	// Pay         ----------------------------------------------------------------------
	app.get('/odPayList', MiddleRole.oderIsLogin, Pay.odPaysFilter, Pay.odPayList)
	app.get('/odPayListPrint', MiddleRole.oderIsLogin, Pay.odPaysFilter, Pay.odPayListPrint)
	// app.get('/odPayAdd', MiddleRole.oderIsLogin, MiddleRole.sfUniLog, Pay.odPayAdd)
	// app.post('/odAddPay', multipartMiddleware, MiddleRole.oderIsLogin, MiddleRole.sfUniLog, Pay.odAddPay)
	app.post('/odUpdatePay', multipartMiddleware, MiddleRole.oderIsLogin, MiddleRole.sfUniLog, Pay.odUpdatePay)
	app.get('/odPayDetail/:id', MiddleRole.oderIsLogin, Pay.odPayFilter, Pay.odPayDetail)
	app.get('/odPayUpdate/:id', MiddleRole.oderIsLogin, Pay.odPayFilter, Pay.odPayUpdate)
	// app.get('/odPayDel/:id', MiddleRole.oderIsLogin, Pay.odPayFilter, Pay.odPayDel)

	app.get('/odPayStatus', MiddleRole.oderIsLogin, Pay.odPayStatus)

	// Vder ---------------------------------------------------------------------------------
	app.get('/odVderList', MiddleRole.oderIsLogin, Vder.odVdersFilter, Vder.odVderList)
	app.get('/odVderDetail/:id', MiddleRole.oderIsLogin, Vder.odVderFilter, Vder.odVderDetail)
	app.post('/odUpVderInfo', MiddleRole.oderIsLogin, multipartMiddleware, 
		Vder.odCheckVderUp, Vder.odUpVderInfo)
	app.get('/ajaxOdVendor', MiddleRole.oderIsLogin, Vder.ajaxOdVendor)
};