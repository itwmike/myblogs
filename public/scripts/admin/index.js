
$(function () {

    $(".sidebar .sidebar_menu li").click(function () {
        var title = $(this).text().trim();
        $(".main-content .main-content-title").html("");
        $(".main-content .main-content-title").append("<i class=\"fa fa-home p_r_10\"></i>首页<i class='fa fa-angle-right p_r_10 p_l_10'></i>").append(title);
        $(this).addClass("focus").siblings().removeClass("focus");
        var url = $(this).attr("link");
        $(".main-content .main-content-body").load(url, function () {
        });
    });

})