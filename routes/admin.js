/**
 * Created by itwmike on 2017/5/8.
 */

var express=require("express");// 引入 express 服务器模块
var category_route=require("./admin/category.js");
var article_route=require("./admin/article.js");
var image_route=require("./admin/image.js");
var path=require("path");

var fs=require("fs");

var route=express.Router();

/* 定义服务端统一返回的数据格式对象 */
const responseResult={
    code:0,
    msg:''
}
/* 验证用户是否登录*/
var verifyLogin=function(req,res,next){
    var userinfo=req.session.userinfo;
    if(userinfo==undefined||userinfo.length<=0)
    {
        res.redirect("/admin/login");
        return;
    }
    next();
}
/* 后台首页 */
route.get("/",verifyLogin,function(req,res,next){
   res.render("admin/index");
});
/* 管理员登录页面 */
route.get("/login",function(req,res,next){
   res.render("admin/login");
});
/*提交登录信息*/
route.post("/sublogin",function(req,res,next){
    var uname=req.body.uname;
    var upass=req.body.upass;
    if(uname==null||uname.length==0){
        responseResult.code=1;
        responseResult.msg="用户名不可为空";
        res.send(responseResult);
    }
    if(upass==null||upass.length==0){
        responseResult.code=2;
        responseResult.msg="密码不可为空";
        res.send(responseResult);
    }

    //读取账号配置文件
    var accountStr=fs.readFileSync(path.join(__dirname,"../account.json"),"utf8").trim();

    var accountArr=JSON.parse(accountStr);
    var result=false;
    for(var i=0;i<accountArr.length;i++){
        if(accountArr[i].logName==uname&&accountArr[i].logPass==upass){
            req.session.userinfo={
                "uname":uname
                ,"uid":accountArr[i].logId
                ,"nickName":accountArr[i].nickName
            };
                //"uname="+uname+"||uid="+accountArr[i].logId+"||nickName="+accountArr[i].nickName; //保存用户名
            result=true;
            break;
        }
    }
    if(result){
       responseResult.code=0;
       responseResult.msg="登录成功";
       res.send(responseResult);
    }else{
       responseResult.code=3;
       responseResult.msg="账号或密码错误";
       res.send(responseResult);
    }
});
/*退出登录*/
route.get("/logout",function(req,res,next){
    req.session.userinfo=null;//清空 cookie
    res.redirect("/admin/login");
});

/* 博客分类业务 路由 */
route.use("/category",verifyLogin,category_route);
/* 博客文章业务 路由*/
route.use("/article",verifyLogin,article_route);
/* 文件上传*/
route.use("/image",image_route);
module.exports = route;

