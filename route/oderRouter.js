let Payment = require('../app/controllers/sfer/oder/payment');


let MiddleBcrypt = require('../app/middle/middleBcrypt');
let MiddleRole = require('../app/middle/middleRole');
let MiddlePicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();

module.exports = function(app){

	// Payment         ----------------------------------------------------------------------
	app.get('/odPaymentList', MiddleRole.oderIsLogin, Payment.odPaymentsFilter, Payment.odPaymentList)
	app.get('/odPaymentListPrint', MiddleRole.oderIsLogin, Payment.odPaymentsFilter, Payment.odPaymentListPrint)
	app.get('/odPaymentAdd', MiddleRole.oderIsLogin, MiddleRole.singleSferLogin, Payment.odPaymentAdd)
	app.post('/odAddPayment', multipartMiddleware, MiddleRole.singleSferLogin, Payment.odAddPayment)
	app.post('/odUpdatePayment', multipartMiddleware, MiddleRole.singleSferLogin, Payment.odUpdatePayment)
	app.get('/odPaymentDetail/:id', MiddleRole.oderIsLogin, Payment.odPaymentFilter, Payment.odPaymentDetail)
	app.get('/odPaymentDel/:id', MiddleRole.oderIsLogin, Payment.odPaymentFilter, Payment.odPaymentDel)

	app.get('/odPaymentStatus', MiddleRole.oderIsLogin, Payment.odPaymentStatus)
};