let Index = require('../app/controllers/sfer/mker/index');

let MdBcrypt = require('../app/middle/middleBcrypt');
let MdRole = require('../app/middle/middleRole');
let MdPicture = require('../app/middle/middlePicture');

let multipart = require('connect-multiparty');
let PostForm = multipart();

module.exports = function(app){

	// index ---------------Sfer 首页 登录页面 登录 登出---------------------------------------
	app.get('/mker', MdRole.mkerIsLogin, Index.mker);
};