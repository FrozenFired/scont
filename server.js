let InitConf = require('./confile/initConf');

let express = require('express');

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
app.locals.ServerAddress = InitConf.serverUrl;// 

mongoose.Promise = global.Promise;
mongoose.connect(InitConf.dbUrl);

app.set('views', './views')
app.set('view engine', 'pug')

let serveStatic = require('serve-static')

let path = require('path');
app.use(serveStatic(path.join(__dirname, "./public")));

app.use(bodyParser.urlencoded( { extended: true } ) );
app.use(bodyParser.json())

app.use(cookieParser())	
app.use(session({
	secret: InitConf.dbName,
	resave: false,
	saveUninitialized: true,
	store: new mongoStore({
		url: InitConf.dbUrl,
		collection: 'sessions'
	})
}))

app.use(require('express-pdf'))

require('./route/aderRouter')(app)
require('./route/mgerRouter')(app)
require('./route/sferRouter')(app)
// require('./route/oderRouter')(app)
// require('./route/fnerRouter')(app)
// require('./route/vderRouter')(app)

app.use(function(req, res, next) {
	res.render("404")
})


server.listen(InitConf.port, function(){
	console.log('Server start on port : ' + InitConf.serverUrl)
});