/**
 * Created by mike on 2017/7/6.
 */

var gulp=require("gulp");
var plugins = require('gulp-load-plugins')();

gulp.task("default",function () {
    plugins.livereload.listen();
    gulp.watch("public/css/front/*.less",["cssMin"]);
    gulp.watch(["public/scripts/front/*[^(min)].js","public/scripts/admin/*[^(min)].js"],["jsMin"]);
    gulp.watch("views/**/*.html",function (event) {
        plugins.livereload.changed(event.path);
    });
});

/* 编译 、压缩 css */
gulp.task("cssMin",function () {
    gulp.src("public/css/front/*.less")
        .pipe(plugins.less())
        .pipe(gulp.dest("public/css/front/"))
        .pipe(plugins.minifyCss())
        .pipe(plugins.rename({
            extname: ".min.css"
        }))
        .pipe(gulp.dest("public/css/front/"))
        .pipe(plugins.livereload());
});

/* 压缩 js */
gulp.task("jsMin",function () {
    //压缩js文件
    gulp.src("public/scripts/admin/!(*.min).js")
        .pipe(plugins.uglify())
        .pipe(plugins.rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest("public/scripts/admin/"))
        .pipe(plugins.livereload());

    gulp.src("public/scripts/front/!(*.min).js")
        .pipe(plugins.uglify())
        .pipe(plugins.rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest("public/scripts/front/"))
        .pipe(plugins.livereload());
});

