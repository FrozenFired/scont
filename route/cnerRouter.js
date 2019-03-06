let Index = require('../app/controllers/sfer/cner/index');

let Cner = require('../app/controllers/sfer/cner/cner');

let Nation = require('../app/controllers/sfer/cner/nation');
let Bcateg = require('../app/controllers/sfer/cner/bcateg');

let Brand = require('../app/controllers/sfer/cner/brand');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Cner 首页 登录页面 登录 登出---------------------------------------
	app.get('/cner', MdRole.cnerIsLogin, Index.cner);


	// Cner -------------------------------------------------------------------------------
	app.get('/cnerInfo', MdRole.cnerIsLogin, Cner.cnerFilter, Cner.cnerInfo);
	app.post('/cnerUpInfo', PostForm, MdRole.cnerIsLogin, MdRole.sfUniLog, 
		MdPicture.addNewPhoto, Cner.cnerUp);
	app.post('/cnerUpPw', PostForm, MdRole.cnerIsLogin, MdRole.sfUniLog, 
		MdBcrypt.rqBcrypt, Cner.cnerUp);

	// Nation ------------------------------------------------------------------------------
	app.get('/cnNations', MdRole.cnerIsLogin, Nation.cnNationsFilter, Nation.cnNations)
	app.get('/cnNationsPrint', MdRole.cnerIsLogin, Nation.cnNationsFilter, Nation.cnNationsPrint)
	app.get('/cnNation/:id', MdRole.cnerIsLogin, Nation.cnNation)
	// Bcateg ------------------------------------------------------------------------------
	app.get('/cnBcategs', MdRole.cnerIsLogin, Bcateg.cnBcategsFilter, Bcateg.cnBcategs)
	app.get('/cnBcategsPrint', MdRole.cnerIsLogin, Bcateg.cnBcategsFilter, Bcateg.cnBcategsPrint)
	app.get('/cnBcateg/:id', MdRole.cnerIsLogin, Bcateg.cnBcategFilter, Bcateg.cnBcateg)
	app.get('/cnBcategPrint/:id', MdRole.cnerIsLogin, Bcateg.cnBcategFilter, Bcateg.cnBcategPrint)

	// Brand ------------------------------------------------------------------------------
	app.get('/cnBrands', MdRole.cnerIsLogin, Brand.cnBrandsFilter, Brand.cnBrands)
	app.get('/cnBrandsPrint', MdRole.cnerIsLogin, Brand.cnBrandsFilter, Brand.cnBrandsPrint)
	app.get('/cnBrand/:id', MdRole.cnerIsLogin, Brand.cnBrandFilter, Brand.cnBrand)

	app.get('/headercnBrand', MdRole.cnerIsLogin, Brand.cnBrandsFilter, Brand.headercnBrand)
};