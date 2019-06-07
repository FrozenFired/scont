let Index = require('../app/controllers/sfer/rper/index');

let Order = require('../app/controllers/sfer/rper/order');
let Pay = require('../app/controllers/sfer/rper/pay');

let RpCar = require('../app/controllers/sfer/rper/car');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/rper', MdRole.rperIsLogin, Index.rper);

	// Order         ----------------------------------------------------------------------
	app.get('/rpOrders', MdRole.rperIsLogin, Order.ordersFilter, Order.orders)
	app.get('/rpOrdersPrint', MdRole.rperIsLogin, Order.ordersFilter, Order.ordersPrint)
	app.get('/rpOrder/:id', MdRole.rperIsLogin, Order.orderFilter, Order.order)
	// app.get('/rpOrderUp/:id', MdRole.rperIsLogin, Order.orderFilter, Order.orderUp)
	// app.post('/rpOrderUpd', PostForm, MdRole.rperIsLogin, MdRole.sfUniLog, Order.orderUpd)
	// app.post('/rpOrderFixed', PostForm, MdRole.rperIsLogin, MdRole.sfUniLog, Order.orderFixed)
	// app.get('/rpOrderAdd', MdRole.rperIsLogin, MdRole.sfUniLog, Order.orderAdd)
	// app.post('/rpOrderNew', PostForm, MdRole.rperIsLogin, MdRole.sfUniLog, Order.orderNew)
	// app.get('/rpOrderDel/:id', MdRole.rperIsLogin, Order.orderFilter, Order.orderDel)

	// Pay         ----------------------------------------------------------------------
	app.get('/rpPays', MdRole.rperIsLogin, Pay.paysFilter, Pay.pays)
	app.get('/rpPay/:id', MdRole.rperIsLogin, Pay.payFilter, Pay.pay)

	app.get('/rpPayMailed', MdRole.rperIsLogin, Pay.payMailed)


	// car ------------------------------------------------------------------------------
	app.get('/rpCars', MdRole.rperIsLogin, RpCar.rpCars)
	app.get('/rpCar/:id', MdRole.rperIsLogin, RpCar.rpCarFilter, RpCar.rpCar)
	app.get('/rpCarUp/:id', MdRole.rperIsLogin, RpCar.rpCarFilter, RpCar.rpCarUp)
	app.post('/rpCarUpd', PostForm, MdRole.rperIsLogin, MdPicture.addNewPhoto, RpCar.rpCarUpd)
	app.get('/rpCarAdd', MdRole.rperIsLogin, RpCar.rpCarAdd)
	app.post('/rpCarNew', PostForm, MdRole.rperIsLogin, MdPicture.addNewPhoto, RpCar.rpCarNew)
	app.get('/rpCarDel/:id', MdRole.rperIsLogin, RpCar.rpCarFilter, RpCar.rpCarDel)

	app.get('/rpCarCnfm', MdRole.rperIsLogin, RpCar.rpCarCnfm)
	app.get('/rpCarCncel', MdRole.rperIsLogin, RpCar.rpCarCncel)
	app.get('/rpCarEnd', MdRole.rperIsLogin, RpCar.rpCarEnd)
};