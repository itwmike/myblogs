/**
 * Created by itwmike on 2017/5/9.
 */
/* 文章结构*/

var mongoose=require("mongoose");//

var article=new mongoose.Schema({
    title:{
        type:String,
        default:""
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
    updateTime:{
        type:Date,
        default:Date.now(),
    },
    _category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category'
    },
    summary:{
        type:String,
        default:""
    },
    supportNum:{
        type:Number,
        default:0
    },
    opposeNum:{
        type:Number,
        default:0
    },
    isPublish:{
        type:Boolean,
        default:false,
    },
    keyWords:{
        type:String,
        default:""
    },
    readQuality:{
        type:Number,
        default:0
    },
    author:{
        type:String,
        default:""
    }

},{
    collection:"article" //设置集合名称，否则生成的集合名称是复数形式
});

module.exports=article;