/**
 * Created by mike on 2017/6/22.
 */
var mongoose=require("mongoose");//
var comment_schema=require("../schemas/comment.js");

var comment=mongoose.model("comment",comment_schema);

module.exports=comment;