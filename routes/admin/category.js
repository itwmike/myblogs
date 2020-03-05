/**
 * Created by itwmike on 2017/5/8.
 */
var express=require("express");// 引入 express 服务器模块
var category_model=require("../../models/category.js");

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

/* 博客分类列表页面 */
route.get("/list",function(req,res,next){
    pageData.pageIndex=req.query.p || 1;
    category_model.countDocuments(function(err,count){
        if(err){  return; }
        pageData.total=count;
        var query=category_model.find({isDell:false})
            .skip((pageData.pageIndex-1)*pageData.pageSize)
            .limit(pageData.pageSize);
        query.exec(function(err,docs){
            pageData.data=docs;
            res.render("admin/category/list",pageData);
        });
    })
});
/*  添加博客分类页面*/
route.get("/add/:id?",function(req,res,next){
    var id=req.params.id;
    var model=new category_model();
    if(id){
        category_model.findById(id,function(err,ent){
            if(err){
                res.render("admin/category/add",{ categoryModel:model});
            }else{
                res.render("admin/category/add",{ categoryModel:ent});
            }
        });
    }else{
        res.render("admin/category/add",{ categoryModel:model});
    }
});
/*删除分类*/
route.get("/del/:id",function(req,res,next){
    category_model.deleteOne({_id:req.params.id},function(err){
        if(err){
            res.send({code:1,msg:"删除失败："+err});
        }else{
            res.send({code:0,msg:"删除成功"});
        }
    });
});
/*添加或修改分类*/
route.post("/subadd",function(req,res,next){
    var name=req.body.name;
    var id=req.body._id;
    if(name==undefined|| name.length<=0){
        res.send({code:1,msg:'请填写分类名称'});
        return;
    }
    var ent=new category_model();
    ent.name=name;
    ent._id=id;
    var model=category_model.findById(ent._id,function (err,doc) {
        if(doc){
            category_model.updateOne({ _id:id },ent, function (err,raw) {
                if(err){
                    res.send({code:2,msg:'保存失败'+err});
                }else{
                    res.send({code:0,msg:'保存成功'});
                }
            });
        }else{
            ent.save(function(err){
                if(err){
                    res.send({code:2,msg:'保存失败'+err});
                }else{
                    res.send({code:0,msg:'保存成功'});
                }
            });
        }
    });
});
module.exports=route;
