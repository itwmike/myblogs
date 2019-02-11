/**
 * Created by itwmike on 2017/5/9.
 */
$(function(){
    var um = UE.getEditor('content',{
        initialFrameWidth:'100%',
        initialFrameHeight:450
    });
    $('#createTime').datetimepicker({
        "language":"zh-CN",
        "format": 'yyyy-mm-dd hh:ii',
        "todayBtn":  1,
        "autoclose": 1,
        "todayHighlight": 1,
        "startView": 2,
        "minView": 0,
        "forceParse": 1
    });
    $("#btn-save").click(function(){
        var data=$("form").serialize();
        $.post("/admin/article/subadd",data,function(res){
            if(res.code==0){
                window.history.back();
            }else{
                alert(res.msg);
            }
        },"json");
    })
})