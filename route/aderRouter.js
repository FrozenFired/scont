let Index = require('../app/controllers/ader/index')

let Ader = require('../app/controllers/ader/ader')
let Mger = require('../app/controllers/ader/mger')

let MiddleBcrypt = require('../app/middle/middleBcrypt')
let MiddleRole = require('../app/middle/middleRole')

let multipart = require('connect-multiparty')
let multipartMiddleware = multipart();

module.exports = function(app){

	// index ---------------Manager 首页 登录页面 登录 登出--------------------------------
	app.get('/ader', Index.ader)
	app.get('/aderLogin', Index.aderLogin)
	app.post('/loginAder', Index.loginAder)
	app.get('/aderLogout', Index.aderLogout)

	// Administrator ------------------------------------------------------------------------
	// 添加删除(后期要关闭)
	app.get('/aderAdd', Ader.aderAdd)
	app.post('/addAder', multipartMiddleware, MiddleBcrypt.rqBcrypt, Ader.addAder)
	app.delete('/aderDel', Ader.aderDel)
	// 查看
	app.get('/aderList', MiddleRole.aderIsLogin, Ader.aderList)
	app.get('/aderDetail/:id', MiddleRole.aderIsLogin, Ader.aderDetail)

	// Manager  ------------------------------------------------------------------------
	app.get('/adMgerAdd', MiddleRole.aderIsLogin, Mger.adMgerAdd)

	app.post('/adAddMger', MiddleRole.aderIsLogin, multipartMiddleware,
		MiddleBcrypt.rqBcrypt, Mger.adExistMgerN,
		Mger.adAddMger)

	app.get('/adMgerList', MiddleRole.aderIsLogin, Mger.adMgerList)
	app.get('/adMgerDetail/:id', MiddleRole.aderIsLogin, Mger.adExistMgerY, Mger.adMgerDetail)
	app.post('/adUpdateMgerInfo',
		MiddleRole.aderIsLogin, multipartMiddleware, Mger.adCheckMgerUp, 
		Mger.adUpdateMgerInfo)
	app.post('/adUpdateMgerPw', MiddleRole.aderIsLogin, multipartMiddleware,
		Mger.adCheckMgerUp, MiddleBcrypt.rqBcrypt, 
		Mger.adUpdateMgerPw)
	app.delete('/adMgerDel', MiddleRole.aderIsLogin, Mger.adMgerDel)
}