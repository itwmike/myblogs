/**
 * Created by itwmike on 2017/5/22.
 */
var express=require("express");// 引入 express 服务器模块
var article_model=require("../models/article.js");
var category_model=require("../models/category.js");

var route=express.Router();

/* 定义服务端统一返回的数据格式对象 */
const responseResult={
    "code":0,
    "msg":"",
    "data":[]
}

//获取文章分类
route.get("/getcategory",function(req,res,next){
    //加载分类
    category_model.find({isDell:false},function(err,docs){
        responseResult.code=0;
        responseResult.data=docs;
        res.jsonp(responseResult);
    });
});
//获取文章
route.get("/getArticleList",function(req,res,next){
    var p=req.query.p||1;
    var  c=req.query.c || undefined;

    //首页应该加载推荐的文章，此处没做推荐处理，见谅！
    var pageData={
        pageIndex:1,
        pageSize:10000,
        total:0,
        data:null,
        pageCount:function(){
            return Math.ceil(this.total/this.pageSize);
        }
    };
    pageData.pageIndex=p;//_category:c
    var where={isDell:false,isPublish:true};
    if(c){
        where._category=c;
    }
    article_model.count(where,function(err,count){
        pageData.total=count;
        article_model.find(where).sort({_id:-1}).skip( (pageData.pageIndex-1)*pageData.pageSize)
            .limit(pageData.pageSize).exec(function(err,docs){
            pageData.data=docs;
            if(c){
                category_model.findById(c,function (err,doc) {
                    pageData.category=doc;
                    res.jsonp(pageData);
                });
            }else{
                res.jsonp(pageData);
            }

        });
    });
});
//获取文章
route.get("/getArticle",function(req,res,next){
    var id=req.query.id;
    article_model.findById(id).populate('_category',{name:1}).exec(function(err,doc){
        responseResult.code=0;
        responseResult.data=doc;
        res.jsonp(responseResult);
    });
});
module.exports=route;
