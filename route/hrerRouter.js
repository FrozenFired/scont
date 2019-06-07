let Index = require('../app/controllers/sfer/hrer/index');

let Order = require('../app/controllers/sfer/hrer/order');
let Pay = require('../app/controllers/sfer/hrer/pay');

let HrCar = require('../app/controllers/sfer/hrer/car');
let Absence = require('../app/controllers/sfer/hrer/absence');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/hrer', MdRole.hrerIsLogin, Index.hrer);

	// Order         ----------------------------------------------------------------------
	app.get('/hrOrders', MdRole.hrerIsLogin, Order.ordersFilter, Order.orders)
	app.get('/hrOrdersPrint', MdRole.hrerIsLogin, Order.ordersFilter, Order.ordersPrint)
	app.get('/hrOrder/:id', MdRole.hrerIsLogin, Order.orderFilter, Order.order)
	// app.get('/hrOrderUp/:id', MdRole.hrerIsLogin, Order.orderFilter, Order.orderUp)
	// app.post('/hrOrderUpd', PostForm, MdRole.hrerIsLogin, MdRole.sfUniLog, Order.orderUpd)
	// app.post('/hrOrderFixed', PostForm, MdRole.hrerIsLogin, MdRole.sfUniLog, Order.orderFixed)
	// app.get('/hrOrderAdd', MdRole.hrerIsLogin, MdRole.sfUniLog, Order.orderAdd)
	// app.post('/hrOrderNew', PostForm, MdRole.hrerIsLogin, MdRole.sfUniLog, Order.orderNew)
	// app.get('/hrOrderDel/:id', MdRole.hrerIsLogin, Order.orderFilter, Order.orderDel)

	// Pay         ----------------------------------------------------------------------
	app.get('/hrPays', MdRole.hrerIsLogin, Pay.paysFilter, Pay.pays)
	app.get('/hrPay/:id', MdRole.hrerIsLogin, Pay.payFilter, Pay.pay)

	app.get('/hrPayMailed', MdRole.hrerIsLogin, Pay.payMailed)


	// car ------------------------------------------------------------------------------
	app.get('/hrCars', MdRole.hrerIsLogin, HrCar.hrCars)
	app.get('/hrCar/:id', MdRole.hrerIsLogin, HrCar.hrCarFilter, HrCar.hrCar)
	app.get('/hrCarUp/:id', MdRole.hrerIsLogin, HrCar.hrCarFilter, HrCar.hrCarUp)
	app.post('/hrCarUpd', PostForm, MdRole.hrerIsLogin, MdPicture.addNewPhoto, HrCar.hrCarUpd)
	app.get('/hrCarAdd', MdRole.hrerIsLogin, HrCar.hrCarAdd)
	app.post('/hrCarNew', PostForm, MdRole.hrerIsLogin, MdPicture.addNewPhoto, HrCar.hrCarNew)
	app.get('/hrCarDel/:id', MdRole.hrerIsLogin, HrCar.hrCarFilter, HrCar.hrCarDel)

	app.get('/hrCarCnfm', MdRole.hrerIsLogin, HrCar.hrCarCnfm)
	app.get('/hrCarCncel', MdRole.hrerIsLogin, HrCar.hrCarCncel)
	app.get('/hrCarEnd', MdRole.hrerIsLogin, HrCar.hrCarEnd)

	// absence ------------------------------------------------------------------------------
	app.get('/hrAbsences', MdRole.hrerIsLogin, Absence.hrAbsences)
	app.get('/hrAbsencesAjax', MdRole.hrerIsLogin, Absence.hrAbsencesAjax)
	app.get('/hrAbsencesMonth', MdRole.hrerIsLogin, Absence.hrAbsencesMonth)
	app.get('/hrAbsencesMonthAjax', MdRole.hrerIsLogin, Absence.hrAbsencesMonthAjax)

	app.get('/hrAbsenceUp/:id', MdRole.hrerIsLogin, Absence.hrAbsenceUp)
	app.post('/hrAbsenceUpd', PostForm, MdRole.hrerIsLogin, Absence.hrAbsenceUpd)

	app.get('/hrAbsenceConfirm', MdRole.hrerIsLogin, Absence.hrAbsenceConfirm)
	app.get('/hrAbsenceStatus', MdRole.hrerIsLogin, Absence.hrAbsenceStatus)

	app.get('/hrAbsenceDel/:id', MdRole.hrerIsLogin, Absence.absenceDel)
	app.delete('/hrAbsenceDelAjax', MdRole.hrerIsLogin, Absence.absenceDelAjax)
};