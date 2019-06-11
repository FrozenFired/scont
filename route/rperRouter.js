let Index = require('../app/controllers/sfer/rper/index');

let RpCar = require('../app/controllers/sfer/rper/car');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/rper', MdRole.rperIsLogin, Index.rper);

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