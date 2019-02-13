let Login = require('../app/controllers/aalogin/login');

let MiddleBcrypt = require('../app/middle/middleBcrypt');
let MiddleRole = require('../app/middle/middleRole');

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();

module.exports = function(app){

	// index ---------------Vder 首页 登录页面 登录 登出---------------------------------------
	app.get('/', Login.index);
	app.get('/login', Login.login);
	app.post('/loginUser', Login.loginUser);
	app.get('/logout', Login.logout);

};