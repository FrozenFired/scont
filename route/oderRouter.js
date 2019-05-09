let Index = require('../app/controllers/sfer/oder/index');

let Order = require('../app/controllers/sfer/oder/order');
let Vder = require('../app/controllers/sfer/oder/vder');
let Pay = require('../app/controllers/sfer/oder/pay');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){
	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/oder', MdRole.oderIsLogin, Index.oder);

	// Order         ----------------------------------------------------------------------
	app.get('/odOrders', MdRole.oderIsLogin, Order.ordersFilter, Order.orders)
	app.get('/odOrdersPrint', MdRole.oderIsLogin, Order.ordersFilter, Order.ordersPrint)
	app.get('/odOrderAdd', MdRole.oderIsLogin, MdRole.sfUniLog, Order.orderAdd)
	app.post('/odOrderNew', PostForm, MdRole.sfUniLog, Order.orderNew)
	app.get('/odOrder/:id', MdRole.oderIsLogin, Order.orderFilter, Order.order)
	app.get('/odOrderDel/:id', MdRole.oderIsLogin, Order.orderFilter, Order.orderDel)

	// Pay         ----------------------------------------------------------------------
	app.get('/odPays', MdRole.oderIsLogin, Pay.paysFilter, Pay.pays)
	app.get('/odPaysPrint', MdRole.oderIsLogin, Pay.paysFilter, Pay.paysPrint)
	app.get('/odPay/:id', MdRole.oderIsLogin, Pay.payFilter, Pay.pay)

	// Vder ---------------------------------------------------------------------------------
	app.get('/odVders', MdRole.oderIsLogin, Vder.vdersFilter, Vder.vders)
	app.get('/odVder/:id', MdRole.oderIsLogin, Vder.vderFilter, Vder.vder)
	app.get('/ajaxOdVendor', MdRole.oderIsLogin, Vder.ajaxOdVendor)
};