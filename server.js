let express = require('express');
let app = express();
let serverHttp = require('http').createServer(app);

let fs = require('fs');
let privkey = fs.readFileSync('./https/private.pem', 'utf8');
let certfig = fs.readFileSync('./https/file.crt', 'utf8');
let credent = {key: privkey, cert: certfig};
let serverHttps = require('https').createServer(credent, app);

// 加载本系统的配置项
let InitConf = require('./confile/initConf');

let mongoose = require('mongoose');
// 要是用 Node.js 自带的 Promise 替换 mongoose 中的 Promise，否则有时候会报警告
mongoose.Promise = global.Promise;
// 需要链接的数据库地址
// mongoose.connect(InitConf.dbUrl,  {useNewUrlParser: true, useCreateIndex: true});
// useCreateIndex: true		// mongoose > 5.2.10
// useNewUrlParser: true		// mongodb > 3.1.0
mongoose.connect(InitConf.dbUrl);

let session = require('express-session');
let mongoStore = require('connect-mongo')(session);
app.use(session({
	secret: InitConf.dbName,
	resave: false,
	saveUninitialized: true,
	store: new mongoStore({
		url: InitConf.dbUrl,
		collection: 'sessions'
	})
}));

let cookieParser = require('cookie-parser');
app.use(cookieParser());

// If extended is false, you can not post "nested object"
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( { extended: true } ) );
app.use(bodyParser.json());

// 设置系统html编辑模板
app.set('views', './views');
app.set('view engine', 'pug');
// 设置系统的静态资源
let path = require('path');
let serveStatic = require('serve-static');
app.use(serveStatic(path.join(__dirname, "./public")));
// 前端读取配置数据
app.locals.moment = require('moment');// 时间格式化
app.locals.Conf = require('./confile/conf');// 
app.locals.Svaddr = InitConf.httpUrl;// 
app.locals.cdn = InitConf.cdn;// 

// 网页生成pdf用的
app.use(require('express-pdf'));

// 前端代码压缩
app.use(require('compression')());

// 调用路由
// require('./route/aderRouter')(app);
require('./route/aaRouter')(app);
require('./route/mgerRouter')(app);
// require('./route/sferRouter')(app);
require('./route/oderRouter')(app);
require('./route/fnerRouter')(app);
require('./route/qterRouter')(app);
require('./route/bnerRouter')(app);

require('./route/cnerRouter')(app);

require('./route/vderRouter')(app);
// 如果没有路由，则跳转到404页面
app.use(function(req, res, next) {
	res.render("404")
});

// 服务器监听
serverHttp.listen(InitConf.portHttp, function(){
	console.log('Server start on port : ' + InitConf.httpUrl);
});
serverHttps.listen(InitConf.portHttps, function(){
	console.log('Server start on port : ' + InitConf.httpsUrl);
});