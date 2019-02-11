/**
 * Created by itwmike on 2017/5/11.
 */
var express=require("express");// 引入 express 服务器模块
var multer  = require('multer');
var path=require("path");
var fs=require("fs");

var upload = multer();//{ dest: 'fileroot/' }

var route=express.Router();

route.get("/",function(req,res,next){

    res.render("admin/image");
});
//
route.get("/load",function (req,res,next) {
    res.setHeader('Content-Type', 'application/json');
    res.redirect('/public/scripts/ueditor/imgconfig.json');
});
//
route.post("/load",upload.single('upfile'),function(req,res,next){
    var fix=req.file.originalname.substring(req.file.originalname.lastIndexOf("."));
    var filename= new Date().getTime();
    console.log(filename);
    var filepath=path.join(__dirname,"../../fileroot/",filename+fix);
    console.log(filepath);
    fs.writeFile(filepath,req.file.buffer,function(err){
        var result={
            "state":"SUCCESS",
            "url":"https://www.limitcode.com/fileroot/"+filename+fix,
            "name":req.file.originalname,
            "originalName":req.file.originalname
        };
       res.send(JSON.stringify(result));
    });
});

module.exports=route;