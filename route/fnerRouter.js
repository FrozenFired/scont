let Payment = require('../app/controllers/sfer/fner/payment');


let MiddleBcrypt = require('../app/middle/middleBcrypt');
let MiddleRole = require('../app/middle/middleRole');
let MiddlePicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();

module.exports = function(app){

	// Payment         ----------------------------------------------------------------------
	app.get('/fnPaymentList', MiddleRole.fnerIsLogin, Payment.fnPaymentsFilter, Payment.fnPaymentList)
	app.get('/fnPaymentListPrint', MiddleRole.fnerIsLogin, Payment.fnPaymentsFilter, Payment.fnPaymentListPrint)
	app.get('/fnPaymentAdd', MiddleRole.fnerIsLogin, MiddleRole.singleSferLogin, Payment.fnPaymentAdd)
	app.post('/fnAddPayment', multipartMiddleware, MiddleRole.singleSferLogin, Payment.fnAddPayment)
	app.post('/fnUpdatePayment', multipartMiddleware, MiddleRole.singleSferLogin, Payment.fnUpdatePayment)
	app.get('/fnPaymentDetail/:id', MiddleRole.fnerIsLogin, Payment.fnPaymentFilter, Payment.fnPaymentDetail)
	app.get('/fnPaymentDel/:id', MiddleRole.fnerIsLogin, Payment.fnPaymentFilter, Payment.fnPaymentDel)

	app.get('/fnPaymentStatus', MiddleRole.fnerIsLogin, Payment.fnPaymentStatus)
};