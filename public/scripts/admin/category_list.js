/**
 * Created by itwmike on 2017/5/9.
 */

$(function(){

    //删除分类
    $("a[data-id]").click(function(){
        var data_id=$(this).attr("data-id");
        $.getJSON("/admin/category/del/"+data_id,function(res){
            if(res.code==0){
                $("a[data-id="+data_id+"]").parent("tr").remove();
            }else{
                alert(res.msg);
            }
        });
    });

})