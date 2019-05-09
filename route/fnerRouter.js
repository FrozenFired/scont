let Index = require('../app/controllers/sfer/fner/index');

let Order = require('../app/controllers/sfer/fner/order');
let Pay = require('../app/controllers/sfer/fner/pay');
let Vder = require('../app/controllers/sfer/fner/vder');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){
	// index ---------------Fner 首页 登录页面 登录 登出---------------------------------------
	app.get('/fner', MdRole.fnerIsLogin, Index.fner);

	// Order         ----------------------------------------------------------------------
	app.get('/fnOrders', MdRole.fnerIsLogin, Order.ordersFilter, Order.orders)
	app.get('/fnOrdersPrint', MdRole.fnerIsLogin, Order.ordersFilter, Order.ordersPrint)
	app.get('/fnOrderAdd', MdRole.fnerIsLogin, MdRole.sfUniLog, Order.orderAdd)
	app.post('/fnOrderNew', PostForm, MdRole.fnerIsLogin, MdRole.sfUniLog, Order.orderNew)
	app.get('/fnOrder/:id', MdRole.fnerIsLogin, Order.orderFilter, Order.order)
	app.get('/fnOrderUp/:id', MdRole.fnerIsLogin, Order.orderFilter, Order.orderUp)
	app.get('/fnOrderUpMd/:id', MdRole.fnerIsLogin, Order.orderFilter, Order.orderUpMd)
	app.get('/fnOrderUpPrice/:id', MdRole.fnerIsLogin, Order.orderFilter, Order.orderUpPrice)
	app.post('/fnOrderFixed', PostForm, MdRole.fnerIsLogin, MdRole.sfUniLog, Order.orderFixed)
	app.post('/fnOrderUpd', PostForm, MdRole.fnerIsLogin, MdRole.sfUniLog, Order.orderUpd)
	app.get('/fnOrderDel/:id', MdRole.fnerIsLogin, Order.orderFilter, Order.orderDel)

	app.get('/fnOrderStatus', MdRole.fnerIsLogin, Order.orderStatus)

	// Pay         ----------------------------------------------------------------------
	app.get('/fnPays', MdRole.fnerIsLogin, Pay.paysFilter, Pay.pays)
	app.get('/fnPaysPrint', MdRole.fnerIsLogin, Pay.paysFilter, Pay.paysPrint)
	app.post('/fnPayUpd', PostForm, MdRole.fnerIsLogin, MdRole.sfUniLog, Pay.payUpd)
	app.get('/fnPay/:id', MdRole.fnerIsLogin, Pay.payFilter, Pay.pay)
	app.get('/fnPayUp/:id', MdRole.fnerIsLogin, Pay.payFilter, Pay.payUp)
	// app.get('/fnPayDel/:id', MdRole.fnerIsLogin, Pay.payFilter, Pay.payDel)

	app.get('/fnPayStatus', MdRole.fnerIsLogin, Pay.payStatus)

	// Vder ---------------------------------------------------------------------------------
	app.get('/fnVders', MdRole.fnerIsLogin, Vder.fnVdersFilter, Vder.fnVders)
	app.get('/fnVder/:id', MdRole.fnerIsLogin, Vder.fnVderFilter, Vder.fnVder)
	app.post('/fnUpVderInfo', MdRole.fnerIsLogin, PostForm, 
		Vder.fnCheckVderUp, Vder.fnUpVderInfo)
	app.get('/ajaxFnVendor', MdRole.fnerIsLogin, Vder.ajaxFnVendor)
};