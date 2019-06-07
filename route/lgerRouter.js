let Index = require('../app/controllers/sfer/lger/index');

let Order = require('../app/controllers/sfer/lger/order');
let Pay = require('../app/controllers/sfer/lger/pay');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/lger', MdRole.lgerIsLogin, Index.lger);
	app.get('/lgprint', MdRole.lgerIsLogin, Index.lgprint);

	// Order         ----------------------------------------------------------------------
	app.get('/lgOrders', MdRole.lgerIsLogin, Order.ordersFilter, Order.orders)
	app.get('/lgOrdersPrint', MdRole.lgerIsLogin, Order.ordersFilter, Order.ordersPrint)
	app.get('/lgOrder/:id', MdRole.lgerIsLogin, Order.orderFilter, Order.order)
	// app.get('/lgOrderUp/:id', MdRole.lgerIsLogin, Order.orderFilter, Order.orderUp)
	// app.post('/lgOrderUpd', PostForm, MdRole.lgerIsLogin, MdRole.sfUniLog, Order.orderUpd)
	// app.post('/lgOrderFixed', PostForm, MdRole.lgerIsLogin, MdRole.sfUniLog, Order.orderFixed)
	// app.get('/lgOrderAdd', MdRole.lgerIsLogin, MdRole.sfUniLog, Order.orderAdd)
	// app.post('/lgOrderNew', PostForm, MdRole.lgerIsLogin, MdRole.sfUniLog, Order.orderNew)
	// app.get('/lgOrderDel/:id', MdRole.lgerIsLogin, Order.orderFilter, Order.orderDel)

	// Pay         ----------------------------------------------------------------------
	app.get('/lgPays', MdRole.lgerIsLogin, Pay.paysFilter, Pay.pays)
	app.get('/lgPay/:id', MdRole.lgerIsLogin, Pay.payFilter, Pay.pay)

	app.get('/lgPayMailed', MdRole.lgerIsLogin, Pay.payMailed)
};