/**
 * Created by itwmike on 2017/5/9.
 */
var mongoose=require("mongoose");//
var article_schema=require("../schemas/article.js");

var article=mongoose.model("article",article_schema);

module.exports=article;