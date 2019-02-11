/**
 * Created by mike on 2017/8/22.
 */
var path=require("path");
var Service = require('node-windows').Service;
var svc = new Service({
    name:'MyBlogs',//服务名称
    description: '暗夜余晖的个人博客网站',//服务的描述
    script: path.join(__dirname,'server.js'),//网站的启动脚本
    dependencies:"MongoDB",//添加服务依赖
});
svc.on('install',function(){
    svc.start();
});
svc.install();