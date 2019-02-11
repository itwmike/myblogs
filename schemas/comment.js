/**
 * Created by mike on 2017/6/22.
 */

/* 文章评论列表*/

var mongoose=require("mongoose");//


var comment=new mongoose.Schema({
    article_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'article'
    },
    content:{
        type:String,
        default:""
    },
    isDell:{
        type:Boolean,
        default:false,
    },
    createTime:{
        type:Date,
        default:Date.now(),
    },
    ipaddress:{
        type:String,
        default:""
    }
},{
    collection:"comment" //设置集合名称，否则生成的集合名称是复数形式
});

module.exports=comment;