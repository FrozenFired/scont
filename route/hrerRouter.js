let Index = require('../app/controllers/sfer/hrer/index');

let HrCar = require('../app/controllers/sfer/hrer/car');
let HrSfer = require('../app/controllers/sfer/hrer/sfer');
let Absence = require('../app/controllers/sfer/hrer/absence');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/hrer', MdRole.hrerIsLogin, Index.hrer);

	// sfer ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/hrSfers', MdRole.hrerIsLogin, HrSfer.hrSfers);

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
	app.get('/hrAbsenceAll/:staff', MdRole.hrerIsLogin, Absence.hrAbsenceAll)
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