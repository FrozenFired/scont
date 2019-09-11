let Index = require('../app/controllers/sfer/cber/index');

let Cber = require('../app/controllers/sfer/cber/cber');

let Nation = require('../app/controllers/sfer/cber/nation');
let Bcateg = require('../app/controllers/sfer/cber/bcateg');

let Brand = require('../app/controllers/sfer/cber/brand');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Cber 首页 登录页面 登录 登出---------------------------------------
	app.get('/cber', MdRole.cberIsLogin, Index.cber);


	// Cber -------------------------------------------------------------------------------
	app.get('/cberInfo', MdRole.cberIsLogin, Cber.cberFilter, Cber.cberInfo);
	app.post('/cberUpInfo', PostForm, MdRole.cberIsLogin, MdRole.sfUniLog, 
		MdPicture.addNewPhoto, Cber.cberUp);
	app.post('/cberUpPw', PostForm, MdRole.cberIsLogin, MdRole.sfUniLog, 
		MdBcrypt.rqBcrypt, Cber.cberUp);

	// Nation ------------------------------------------------------------------------------
	app.get('/cbNations', MdRole.cberIsLogin, Nation.cbNationsFilter, Nation.cbNations)
	app.get('/cbNationsPrint', MdRole.cberIsLogin, Nation.cbNationsFilter, Nation.cbNationsPrint)
	app.get('/cbNation/:id', MdRole.cberIsLogin, Nation.cbNation)
	// Bcateg ------------------------------------------------------------------------------
	app.get('/cbBcategs', MdRole.cberIsLogin, Bcateg.cbBcategsFilter, Bcateg.cbBcategs)
	app.get('/cbBcategsPrint', MdRole.cberIsLogin, Bcateg.cbBcategsFilter, Bcateg.cbBcategsPrint)
	app.get('/cbBcateg/:id', MdRole.cberIsLogin, Bcateg.cbBcategFilter, Bcateg.cbBcateg)
	app.get('/cbBcategPrint/:id', MdRole.cberIsLogin, Bcateg.cbBcategFilter, Bcateg.cbBcategPrint)

	// Brand ------------------------------------------------------------------------------
	app.get('/cbBrands', MdRole.cberIsLogin, Brand.cbBrandsFilter, Brand.cbBrands)
	app.get('/cbBrandsPrint', MdRole.cberIsLogin, Brand.cbBrandsFilter, Brand.cbBrandsPrint)
	app.get('/cbBrand/:id', MdRole.cberIsLogin, Brand.cbBrandFilter, Brand.cbBrand)

	app.get('/headercbBrand', MdRole.cberIsLogin, Brand.cbBrandsFilter, Brand.headercbBrand)
};