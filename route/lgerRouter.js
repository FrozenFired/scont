let Index = require('../app/controllers/sfer/lger/index');

let Order = require('../app/controllers/sfer/lger/order');

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
	app.get('/orderNull', MdRole.lgerIsLogin, Order.orderNull)
	app.get('/lgOrders', MdRole.lgerIsLogin, Order.lgOrdersFilter, Order.lgOrders)
	app.get('/lgOrder/:id', MdRole.lgerIsLogin, Order.lgOrderFilter, Order.lgOrder)

	app.get('/lgOrderStslg', MdRole.lgerIsLogin, Order.lgOrderStslg)

	app.get('/lgOrdersPrint', MdRole.lgerIsLogin, Order.lgOrdersFilter, Order.lgOrdersPrint)
};