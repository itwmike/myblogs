/**
 * Created by itwmike on 2017/5/9.
 */

$(function(){
    $("#btn-save").click(function(){
        var data=$("form").serialize();
        $.post("/admin/category/subadd",data,function(res){
            if(res.code==0){
                window.history.back();
            }else{
                alert(res.msg);
            }
        },"json");
    })
})