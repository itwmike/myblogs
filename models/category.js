/**
 * Created by itwmike on 2017/5/8.
 */
var mongoose=require("mongoose");//
var category_schema=require("../schemas/category.js");

var category=mongoose.model("category",category_schema);

module.exports=category;

