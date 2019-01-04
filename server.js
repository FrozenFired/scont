let InitSet = require('./confile/initSet');
let serverUrl;
if(InitSet.port == 80) {
	serverUrl = "http://"+InitSet.ip;
} else {
	serverUrl = "http://"+InitSet.ip+":" + InitSet.port;
}

let express = require('express');
let path = require('path');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');

let mongoStore = require('connect-mongo')(session);

let app = express();
let server = require('http').createServer(app);

// 前端读取配置数据
app.locals.moment = require('moment');// 时间格式化
app.locals.Conf = require('./confile/conf');// 
app.locals.ServerAddress = serverUrl;// 

mongoose.Promise = global.Promise;
let dbUrl = 'mongodb://localhost/' + InitSet.dbName;
mongoose.connect(dbUrl);

app.set('views', './views')
app.set('view engine', 'pug')

let serveStatic = require('serve-static')
app.use(serveStatic(path.join(__dirname, "public")))

app.use(bodyParser.urlencoded( { extended: true } ) )
app.use(bodyParser.json())

app.use(cookieParser())	
app.use(session({
	secret: InitSet.dbName,
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
	console.log('Server start on port : ' + serverUrl)
});