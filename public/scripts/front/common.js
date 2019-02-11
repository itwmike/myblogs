/*
首页公用的脚本
*/
$(function () {

    var bloggerLen=$(".blogger-carousel-box > div").length;
    var currentBlogger=0;
    var bloggerInterval=null;

    $(".play-mask").click(function () {
        $(".qr-mask").show();
    });
    $(".qr-mask").mouseleave(function () {
       $(".qr-mask").hide();
    });
    $(".qr-mask .qr-tab a").click(function () {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        $(".qr-mask .qr-img img").siblings().removeClass("active");
        $(".qr-mask .qr-img img").eq($(this).index()).addClass("active");
    });
    $(".blogger-carousel-box").on("mouseover",function () {
        clearInterval(bloggerInterval);
    }).on("mouseleave",function () {
        bloggerInterval=setInterval(bloggerLunbo,5000);
    });
    function bloggerLunbo() {
        currentBlogger++;
        if(currentBlogger>=bloggerLen)currentBlogger=0;
        var bloggerBoxW=$(".blogger-carousel-box:first").width()/10;
        $(".blogger-carousel-box").css({
            left:-(bloggerBoxW*currentBlogger)
        });
    }
    bloggerInterval=setInterval(bloggerLunbo,5000);
})
