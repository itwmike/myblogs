/**
 * Created by itwmike on 2017/5/8.
 */
var express=require("express");// 引入 express 服务器模块
var async=require("async");//引入 async 模块

var article_model=require("../../models/article.js");
var category_model=require("../../models/category.js");
var comment_model=require("../../models/comment.js");

var route=express.Router();

/* 定义分页数据对象*/
var pageData={
    pageIndex:1,
    pageSize:20,
    total:0,
    pageCount:function(){
        return  Math.ceil (this.total/this.pageSize);
    },
    data:[],
};


/* 博客文章列表页面 */
route.get("/list",function(req,res,next){
    pageData.pageIndex=req.query.p || 1;
    async.parallel([
        function(callback){
            //获取文章总数量
            article_model.countDocuments({isDell:false},function(err,count){
                callback(null,count);
            });
        },
        function(callback){
            //使用 populate 进行表关联
            var query=article_model.find({isDell:false}).populate('_category',{name:1})
                .skip((pageData.pageIndex-1)*pageData.pageSize)
                .limit(pageData.pageSize);
            query.exec(function(err,docs){
                callback(null,docs);
            });
        }],function(err, results){
        pageData.total=results[0];
        pageData.data=results[1];
        res.render("admin/article/list",pageData);
    });

});
/*  添加博客文章页面*/
route.get("/add/:id?",function(req,res,next){
    var id=req.params.id;
    var model=new article_model();
    model.createTime=Date.now();
    var data={
        articleModel:model,
        categoryList:null,
    };
    //加载分类
    category_model.find({isDell:false},function(err,docs){
        data.categoryList=docs;
        if(id){
            article_model.findById(id,function(err,ent){
                if(err){ return; }
                data.articleModel=ent;
                res.render("admin/article/add",data);
            });
        }else{
            res.render("admin/article/add",data);
        }
    });
});
/*删除文章*/
route.get("/del/:id",function(req,res,next){
    article_model.updateOne({_id:req.params.id},{isDell:true},function(err){
        if(err){
            res.send({code:1,msg:"删除失败："+err});
        }else{
            res.send({code:0,msg:"删除成功"});
        }
    });
});
/*添加或修改文章*/
route.post("/subadd",function(req,res,next){
    var title=req.body.title;
    var categoryId=req.body.categoryId;
    var content=req.body.content;
    var summary=req.body.summary;
    var id=req.body._id;
    var createTime= req.body.createTime;
    var isPublish=req.body.isPublish;
    var keyWords=req.body.keyWords;

    if(title==undefined|| title.length<=0){
        res.send({code:1,msg:'请填写文章标题'});
        return;
    }
    if(categoryId==undefined|| parseInt(categoryId)<=0  ){
        res.send({code:1,msg:'请选择一个文章分类'});
        return;
    }
    if(content==undefined||content.length<=0){
        res.send({code:2,msg:'请填写文章内容'});
        return;
    }
    var data={
        title:title,
        _category:categoryId,
        updateTime:Date.now(),
        content:content,
        summary:summary,
        createTime:createTime,
        isPublish:isPublish,
        keyWords:keyWords
    };
    article_model.findById(id,function (err,doc) {
        if(doc){
            if(!doc.author){
                data.author=req.session.userinfo.nickName;
            }
            article_model.updateOne({ _id:id },data, function (err,raw) {
                if(err){
                    res.send({code:2,msg:'保存失败'+err});
                }else{
                    res.send({code:0,msg:'保存成功'});
                }
            });
        }else{
            data.author=req.session.userinfo.nickName;
            article_model.create(data,function(err,ent){
                if(err){
                    res.send({code:2,msg:'保存失败'+err});
                }else{
                    res.send({code:0,msg:'保存成功'});
                }
            });
        }
    });
});
/*文章评论列表*/
route.get("/commentList",function (req,res,next) {
    pageData.pageIndex=req.query.p || 1;
    var article_id=req.query.id;

    async.parallel([
        function(callback){
            //获取评论总数量
            comment_model.countDocuments({isDell:false,article_id:article_id},function(err,count){
                callback(null,count);
            });
        },
        function(callback){
            var query=comment_model.find({isDell:false,article_id:article_id})
                .skip((pageData.pageIndex-1)*pageData.pageSize)
                .limit(pageData.pageSize);
            query.exec(function(err,docs){
                callback(null,docs);
            });
        }],
        function (err,results) {
            pageData.total=results[0];
            pageData.data=results[1];
            pageData.articleId=article_id;
            res.render("admin/article/commentList",pageData);
    })
});

module.exports=route;
