/**
 * Created by itwmike on 2017/5/8.
 */
/* 博客分类*/

var mongoose=require("mongoose");//

var category=new mongoose.Schema({
    name:{
        type:String,
        default:"",
    },
    isDell:{
        type:Boolean,
        default:false,
    },
    createTime:{
            type:Date,
            default:Date.now(),

    },
},{
    collection:"category" //设置集合名称，否则生成的集合名称是复数形式
});

module.exports=category;
