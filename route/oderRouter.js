let Index = require('../app/controllers/sfer/oder/index');

let Order = require('../app/controllers/sfer/oder/order');
let Ord = require('../app/controllers/sfer/oder/ord');
let Vder = require('../app/controllers/sfer/oder/vder');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){
	// index ---------------Sfer 首页 登录页面 登录 登出-------------------------------
	app.get('/oder', MdRole.oderIsLogin, Index.oder);

	// Order ----------------------------------------------------------------------
	app.get('/odOrders', MdRole.oderIsLogin, Order.ordersFilter, Order.orders)
	app.get('/odOrdersPrint', MdRole.oderIsLogin, Order.ordersFilter, Order.ordersPrint)
	app.get('/odOrderAdd', MdRole.oderIsLogin, MdRole.sfUniLog, Order.orderAdd)
	app.post('/odOrderNew', PostForm, MdRole.oderIsLogin, MdRole.sfUniLog, Order.odOrderNew)
	app.get('/odOrder/:id', MdRole.oderIsLogin, Order.orderFilter, Order.order)
	app.get('/odOrderUp/:id', MdRole.oderIsLogin, Order.orderFilter, Order.orderUp)
	app.get('/odOrderUpMd/:id', MdRole.oderIsLogin, Order.orderFilter, Order.orderUpMd)
	app.get('/odOrderUpPrice/:id', MdRole.oderIsLogin, Order.orderFilter, Order.orderUpPrice)
	app.post('/odOrderFixed', PostForm, MdRole.oderIsLogin, MdRole.sfUniLog, Order.orderFixed)
	app.post('/odOrderUpd', PostForm, MdRole.oderIsLogin, MdRole.sfUniLog, Order.orderUpd)
	app.get('/odOrderDel/:id', MdRole.oderIsLogin, Order.orderFilter, Order.orderDel)

	app.get('/odOrderStatus', MdRole.oderIsLogin, Order.orderStatus)


	// Ord ----------------------------------------------------------------------
	app.get('/odOrds', MdRole.oderIsLogin, Ord.ordsFilter, Ord.ords)
	app.get('/odOrdsPrint', MdRole.oderIsLogin, Ord.ordsFilter, Ord.ordsPrint)
	app.get('/odOrdAdd', MdRole.oderIsLogin, MdRole.sfUniLog, Ord.ordAdd)
	app.post('/odOrdNew', PostForm, MdRole.oderIsLogin, MdRole.sfUniLog, Ord.odOrdNew)
	app.get('/odOrd/:id', MdRole.oderIsLogin, Ord.ordFilter, Ord.ord)
	app.get('/odOrdUp/:id', MdRole.oderIsLogin, Ord.ordFilter, Ord.ordUp)
	app.get('/odOrdUpPrice/:id', MdRole.oderIsLogin, Ord.ordFilter, Ord.ordUpPrice)
	app.post('/odOrdUpd', PostForm, MdRole.oderIsLogin, MdRole.sfUniLog, Ord.ordUpd)
	app.get('/odOrdDel/:id', MdRole.oderIsLogin, Ord.ordFilter, Ord.ordDel)

	app.get('/odOrdStatus', MdRole.oderIsLogin, Ord.ordStatus)

	// Vder ---------------------------------------------------------------------------------
	app.get('/odVders', MdRole.oderIsLogin, Vder.odVdersFilter, Vder.odVders)
	app.get('/odVder/:id', MdRole.oderIsLogin, Vder.odVderFilter, Vder.odVder)
	app.post('/odUpVderInfo', MdRole.oderIsLogin, PostForm, 
		Vder.odCheckVderUp, Vder.odUpVderInfo)
	app.get('/ajaxOdVendor', MdRole.oderIsLogin, Vder.ajaxOdVendor)
};