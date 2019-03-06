let Index = require('../app/controllers/sfer/fner/index');
let Fner = require('../app/controllers/sfer/fner/fner');

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


	// Fner -------------------------------------------------------------------------------
	app.get('/fnerInfo', MdRole.fnerIsLogin, Fner.fnerFilter, Fner.fnerInfo);
	app.post('/fnerUpInfo', PostForm, MdRole.fnerIsLogin, MdRole.sfUniLog, 
		MdPicture.addNewPhoto, Fner.fnerUp);
	app.post('/FnerUpPw', PostForm, MdRole.fnerIsLogin, MdRole.sfUniLog, 
		MdBcrypt.rqBcrypt, Fner.fnerUp);

	// Order         ----------------------------------------------------------------------
	app.get('/fnOrderList', MdRole.fnerIsLogin, Order.fnOrdersFilter, Order.fnOrderList)
	app.get('/fnOrderListPrint', MdRole.fnerIsLogin, Order.fnOrdersFilter, Order.fnOrderListPrint)
	app.get('/fnOrderAdd', MdRole.fnerIsLogin, MdRole.sfUniLog, Order.fnOrderAdd)
	app.post('/fnAddOrder', PostForm, MdRole.fnerIsLogin, MdRole.sfUniLog, Order.fnAddOrder)
	app.get('/fnOrderDetail/:id', MdRole.fnerIsLogin, Order.fnOrderFilter, Order.fnOrderDetail)
	app.get('/fnOrderUpMd/:id', MdRole.fnerIsLogin, Order.fnOrderFilter, Order.fnOrderUpMd)
	app.get('/fnOrderUpPrice/:id', MdRole.fnerIsLogin, Order.fnOrderFilter, Order.fnOrderUpPrice)
	app.post('/fnUpdateOrder', PostForm, MdRole.fnerIsLogin, MdRole.sfUniLog, Order.fnUpdateOrder)
	app.get('/fnOrderDel/:id', MdRole.fnerIsLogin, Order.fnOrderFilter, Order.fnOrderDel)

	app.get('/fnOrderStatus', MdRole.fnerIsLogin, Order.fnOrderStatus)

	// Pay         ----------------------------------------------------------------------
	app.get('/fnPayList', MdRole.fnerIsLogin, Pay.fnPaysFilter, Pay.fnPayList)
	app.get('/fnPayListPrint', MdRole.fnerIsLogin, Pay.fnPaysFilter, Pay.fnPayListPrint)
	// app.get('/fnPayAdd', MdRole.fnerIsLogin, MdRole.sfUniLog, Pay.fnPayAdd)
	// app.post('/fnAddPay', PostForm, MdRole.fnerIsLogin, MdRole.sfUniLog, Pay.fnAddPay)
	app.post('/fnUpdatePay', PostForm, MdRole.fnerIsLogin, MdRole.sfUniLog, Pay.fnUpdatePay)
	app.get('/fnPayDetail/:id', MdRole.fnerIsLogin, Pay.fnPayFilter, Pay.fnPayDetail)
	app.get('/fnPayUpdate/:id', MdRole.fnerIsLogin, Pay.fnPayFilter, Pay.fnPayUpdate)
	// app.get('/fnPayDel/:id', MdRole.fnerIsLogin, Pay.fnPayFilter, Pay.fnPayDel)

	app.get('/fnPayStatus', MdRole.fnerIsLogin, Pay.fnPayStatus)

	// Vder ---------------------------------------------------------------------------------
	app.get('/fnVderList', MdRole.fnerIsLogin, Vder.fnVdersFilter, Vder.fnVderList)
	app.get('/fnVderDetail/:id', MdRole.fnerIsLogin, Vder.fnVderFilter, Vder.fnVderDetail)
	app.post('/fnUpVderInfo', MdRole.fnerIsLogin, PostForm, 
		Vder.fnCheckVderUp, Vder.fnUpVderInfo)
	app.get('/ajaxFnVendor', MdRole.fnerIsLogin, Vder.ajaxFnVendor)
};