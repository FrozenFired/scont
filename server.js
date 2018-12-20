var InitSet = require('./confile/initSet');

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var mongoStore = require('connect-mongo')(session);

var app = express();
var server = require('http').createServer(app);

// 前端读取配置数据
app.locals.moment = require('moment');// 时间格式化
app.locals.Conf = require('./confile/conf');// 
app.locals.ServerAddress = require('./confile/initSet').server;// 

mongoose.Promise = global.Promise;
var dbUrl = 'mongodb://localhost/' + InitSet.dbUrl;
mongoose.connect(dbUrl);

app.set('views', './views')
app.set('view engine', 'pug')

var serveStatic = require('serve-static')
app.use(serveStatic(path.join(__dirname, "public")))

app.use(bodyParser.urlencoded( { extended: true } ) )
app.use(bodyParser.json())

app.use(cookieParser())	
app.use(session({
	secret: InitSet.dbUrl,
	resave: false,
	saveUninitialized: true,
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}))

app.use(require('express-pdf'))

require('./route/aderRouter')(app)
require('./route/mgerRouter')(app)
require('./route/sferRouter')(app)

app.use(function(req, res, next) {
	res.render("404")
})

server.listen(InitSet.port, function(){
	console.log('Server start on port : ' + InitSet.server)
});