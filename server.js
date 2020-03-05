/**
 * Created by itwmike on 2017/5/8.
 */
/* web 服务启动入口*/
var http = require('http');
var https = require('https');
var express=require("express");// 引入 express 服务器模块
var bodyParser = require("body-parser");//引入 body 解析模块用于处理 form 数据
var cookieSession = require("cookie-session");// 引入cookie-session 处理中间件
var ejs = require("ejs");//引入 ejs 模板引擎 模块
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var compression=require("compression");

var admin_route = require("./routes/admin.js");//后端路由
var front_route = require("./routes/front.js");//前端路由
var api_route=require("./routes/api.js");

var privateKey  = fs.readFileSync(path.join( __dirname,'./config/214109597780064.key'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname,'./config/214109597780064.pem'), 'utf8');
var credentials = {key: privateKey, cert: certificate};

var app = new express();
var port = process.env.PORT || 8080;
var node_env=process.env.NODE_ENV;

app.engine("html", ejs.__express);//定义 模板引擎使用 html后缀文件作为视图
app.set("views","./views");//配置 html 视图文件的存放位置
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
if (node_env === "production") {
    app.set("cache view",true);
}
app.use(compression());

app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));
app.use(bodyParser.json({limit: '10mb'}));
app.use(cookieSession({name:"cookie", keys: ['userinfo']}));

if (node_env === "production") {
    app.use(function requireHTTPS(req, res, next) {
     if (!req.secure) {
       return res.redirect(301,'https://' + req.headers.host + req.url);
     }
      next();
    });
}

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use("/public", express.static(__dirname + "/public"));
app.use("/fileroot", express.static(__dirname + "/fileroot"));
app.use("/.well-known", express.static(__dirname + "/.well-known"));
app.use("/root.txt", express.static(__dirname + "/root.txt"));

app.use("/admin", admin_route);
app.use("/api",api_route);
app.use("/", front_route);

mongoose.connect('mongodb://127.0.0.1/MyBlogs',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, '数据库连接失败'));
db.once('open', function() {
  console.log("数据库已连接");
});

console.log("开始启动服务");

var server = http.createServer(app);
console.log(port);
server.listen(port);
if (node_env === "production") {
    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443);
}
process.on('uncaughtException', function (err) {

});
console.log("服务已启动");
