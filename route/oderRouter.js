let Order = require('../app/controllers/sfer/oder/order');


let MiddleBcrypt = require('../app/middle/middleBcrypt');
let MiddleRole = require('../app/middle/middleRole');
let MiddlePicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();

module.exports = function(app){

	// Order         ----------------------------------------------------------------------
	app.get('/odOrderList', MiddleRole.oderIsLogin, Order.odOrdersFilter, Order.odOrderList)
	app.get('/odOrderListPrint', MiddleRole.oderIsLogin, Order.odOrdersFilter, Order.odOrderListPrint)
	app.get('/odOrderAdd', MiddleRole.oderIsLogin, MiddleRole.singleSferLogin, Order.odOrderAdd)
	app.post('/odAddOrder', multipartMiddleware, MiddleRole.singleSferLogin, Order.odAddOrder)
	app.post('/odUpdateOrder', multipartMiddleware, MiddleRole.singleSferLogin, Order.odUpdateOrder)
	app.get('/odOrderDetail/:id', MiddleRole.oderIsLogin, Order.odOrderFilter, Order.odOrderDetail)
	app.get('/odOrderDel/:id', MiddleRole.oderIsLogin, Order.odOrderFilter, Order.odOrderDel)

	app.get('/odOrderStatus', MiddleRole.oderIsLogin, Order.odOrderStatus)
};