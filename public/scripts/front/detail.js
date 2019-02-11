/**
 * Created by mike on 2017/6/2.
 */


$(function () {
    var shareContent={
        url: window.location.href,
        title: document.title,
        content: document.getElementById("description").content
    };
    $(".share_icon_xl").on("click", function() {
        $(this).socialShare("sinaWeibo",shareContent);
    })
    $(".share_icon_wx").on("click", function() {
        $(this).socialShare("weixinShare",shareContent);
    })
    $(".share_icon_qq").on("click", function() {
        $(this).socialShare("qZone",shareContent);
    })
    $(".advise-txt-support").one("click",function () {
        $.getJSON("/addSupport/"+$("#txt_id").val()+"?t="+Math.random(),function (res) {
            if(res.code==0){
                var num=parseInt($(".advise-num-support").html())+1 ;
                $(".advise-num-support").html(num);
            }else{
                alert(res.msg);
            }
        });
    });
    $(".advise-txt-oppose").one("click",function () {
        $.getJSON("/addOppose/"+$("#txt_id").val()+"?t="+Math.random(),function (res) {
            if(res.code==0){
                var num=parseInt($(".advise-num-oppose").html())+1 ;
                $(".advise-num-oppose").html(num);
            }else{
                alert(res.msg);
            }
        });
    });
    $("#btn_addComment").click(function () {
        var content=$(".txt-content").val().trim();
        if(!content){
            alert("请输入评论内容。");return;
        }
        if(content.length>500){
            alert("评论内容不能超过500字。");return;
        }
        $.post("/addComment/"+$("#txt_id").val(),{content:content},function (res) {
            if(res.code==0){
                window.location.reload();
            }
            else{
                alert(res.msg);
            }

        },"json");
    });
    SyntaxHighlighter.all();
})
$(function() {
    function autocenter() {
        var bodyW = parseInt(document.documentElement.clientWidth);
        var bodyH = parseInt(document.documentElement.clientHeight);
        var elW = $("#weixin").width();
        var elH = $("#weixin").height();
        console.log((bodyW - elW) / 2);
        $("#weixin").css("left", (bodyW - elW) / 2);
        $("#weixin").css("top", (bodyH - elH) / 2);
    }
    window.onresize = function() {
        autocenter();
    };
});
