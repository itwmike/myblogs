/**
 * Created by itwmike on 2017/5/8.
 */

var express=require("express");// 引入 express 服务器模块
var path=require("path");
var async=require("async");//引入 async 模块

var article_model=require("../models/article.js");
var category_model=require("../models/category.js");
var comment_model=require("../models/comment.js");

var route=express.Router();

/* 定义分页数据对象*/
var pageData={
    pageIndex:1,
    pageSize:10,
    total:0,
    pageCount:function(){
        return  Math.ceil (this.total/this.pageSize);
    },
    categoryList:null,
    articleList:null
};

/*首页*/
route.get("/",function(req,res,next){
    //首页应该加载推荐的文章，此处没做推荐处理，见谅！
    pageData.pageIndex=req.query.p || 1;
    async.parallel([
        function(callback){
            //加载博客分类
            category_model.find({isDell:false},function(err,docs){
                callback(null,docs);
            })
        },
        function(callback){
            article_model.find({isDell:false,isPublish:true}).sort({createTime:-1}).skip((pageData.pageIndex-1)*pageData.pageSize)
                .limit(pageData.pageSize).exec(function(err,docs){
                callback(null,docs);
            });
        },function(callback){
            //获取文章总数量
            article_model.countDocuments({isDell:false,isPublish:true},function(err,count){
                callback(null,count);
            });
        }],function(err, results){
            pageData.categoryList=results[0];
            pageData.articleList=results[1];
            pageData.total=results[2];

            res.render("index",pageData);
        }
    );
});
/* 详细信息*/
route.get(/^\/detail\/([a-zA-Z0-9]{10,})(\.html)?/,function(req,res,next){
    var article_id=req.params[0];
    var pageData={
        categoryList:null,
        article:null,
        commentList:null,
    };
    async.parallel([
        function(callback){
            //加载博客分类
            category_model.find({isDell:false},function(err,docs){
                callback(null,docs);
            })
        },function (callback) {
            article_model.findById(article_id).populate("_category",{name:1}).exec(function(err,doc){
                doc.readQuality+=1;
                article_model.updateOne({ _id:article_id },{'$inc':{'readQuality':1} },function (err,raw) {

                });
                callback(null,doc);
            });
        },function (callback) {
            comment_model.find({isDell:false,article_id:article_id}).exec(function (err,docs) {
                callback(null,docs);
            });

        }],function (err,results) {
        pageData.categoryList=results[0];
        pageData.article=results[1];
        pageData.commentList=results[2];
        res.render("detail",pageData);
    });

});
/*分类下的文章列表*/
route.get("/list/:id",function(req,res,next){
    var cid=req.params.id;//获取分类编号
    //首页应该加载推荐的文章，此处没做推荐处理，见谅！
    var pageData={
        categoryList:null,
        articleList:null,
    };
    //加载博客分类
    category_model.find({isDell:false},function(err,docs){
        pageData.categoryList=docs;
        article_model.find({isDell:false,isPublish:true,_category:cid}).sort({createTime:-1}).exec(function(err,docs){
            pageData.articleList=docs;
            res.render("list",pageData);
        });
    });
});
//下载android app
route.get("/down/android",function(req,res,next) {
    res.download(path.join(__dirname,"../public/app/com.limitcode.webapp.apk"),"com.limitcode.webapp.apk" );
});
//添加支持人数
route.get("/addSupport/:id",function (req,res,next) {
    var id=req.params.id;//获取文章编号
    if(!id){
        res.json({"code":1,"msg":"请求参数不正确。"});
    }
    article_model.findById(id,function (err,doc) {
        if(err||doc==null){
            res.json({"code":2,"msg":"文章不存在。"});
        }else{
            article_model.updateOne({ _id:id },{supportNum:doc.supportNum+1}, function (err,raw){
                res.json({"code":0,"msg":"操作成功。"});
            });
        }
    });


});
//添加踩 人数
route.get("/addOppose/:id",function (req,res,next) {
    var id=req.params.id;//获取文章编号
    if(!id){
        res.json({"code":1,"msg":"请求参数不正确。"});
    }
    article_model.findById(id,function (err,doc) {
        if(err ||doc==null){
            res.json({"code":2,"msg":"文章不存在。"});
        }else{
            article_model.updateOne({ _id:id },{opposeNum:doc.opposeNum+1}, function (err,raw){
                res.json({"code":0,"msg":"操作成功。"});
            });
        }
    });
});
//添加评论
route.post("/addComment/:id",function (req,res,next) {
    var id=req.params.id;//获取文章编号
    if(!id){
        res.json({"code":1,"msg":"请求参数不正确。"});
    }
    var ent=new comment_model();
    ent.article_id=id;
    ent.content=req.body.content;
    ent.ipaddress=req.ip.replace(/::ffff:/, '');

    comment_model.create(ent,function (err,doc) {
        if(err){
            res.json({"code":2,"msg":'保存失败'+err});
        }else{
            res.json({"code":0,"msg":'保存成功'});
        }
    });

});
// 博主团队
route.get("/team",function(req,res,next){
  res.render("team");
});
module.exports = route;
