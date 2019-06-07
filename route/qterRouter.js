let Index = require('../app/controllers/sfer/qter/index');

let Order = require('../app/controllers/sfer/qter/order');
let Pay = require('../app/controllers/sfer/qter/pay');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/qter', MdRole.qterIsLogin, Index.qter);

	// Order         ----------------------------------------------------------------------
	app.get('/qtOrders', MdRole.qterIsLogin, Order.ordersFilter, Order.orders)
	app.get('/qtOrdersPrint', MdRole.qterIsLogin, Order.ordersFilter, Order.ordersPrint)
	app.get('/qtOrder/:id', MdRole.qterIsLogin, Order.orderFilter, Order.order)
	app.get('/qtOrderUp/:id', MdRole.qterIsLogin, Order.orderFilter, Order.orderUp)
	app.post('/qtOrderUpd', PostForm, MdRole.qterIsLogin, MdRole.sfUniLog, Order.orderUpd)
	app.post('/qtOrderFixed', PostForm, MdRole.qterIsLogin, MdRole.sfUniLog, Order.orderFixed)
	app.get('/qtOrderAdd', MdRole.qterIsLogin, MdRole.sfUniLog, Order.orderAdd)
	app.post('/qtOrderNew', PostForm, MdRole.qterIsLogin, MdRole.sfUniLog, Order.orderNew)
	app.get('/qtOrderDel/:id', MdRole.qterIsLogin, Order.orderFilter, Order.orderDel)

	// Pay         ----------------------------------------------------------------------
	app.get('/qtPays', MdRole.qterIsLogin, Pay.paysFilter, Pay.pays)
	app.get('/qtPay/:id', MdRole.qterIsLogin, Pay.payFilter, Pay.pay)

	app.get('/qtPayMailed', MdRole.qterIsLogin, Pay.payMailed)
};