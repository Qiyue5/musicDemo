// gulp.src() 读文件
// gulp.dest() 写文件
// gulp.task() 任务
// gulp.watch() 监听

var gulp = require("gulp")
var imagemin = require("gulp-imagemin")
var newer = require("gulp-newer")
var htmlclean = require("gulp-htmlclean")
var uglify = require("gulp-uglify")
var stripDebug = require("gulp-strip-debug")
var concat = require("gulp-concat")
var less = require("gulp-less")
var postcss = require("gulp-postcss") 
var autoprefixer = require("autoprefixer")
var cssnano = require("cssnano")
var connect = require("gulp-connect")

var devMode = process.env.NODE_ENV == "development"
console.log(devMode);

var folder = {
  src : "./src/",  //开发目录文件夹
  dist : "./dist/"  //压缩打包后的目录文件夹
}

gulp.task("html", function() {
  var page = gulp.src(folder.src + "html/*")
                 .pipe(connect.reload())
  if(!devMode){
    page.pipe(htmlclean())
  }
    page.pipe(gulp.dest(folder.dist + "html"))
}) 

gulp.task("images", function() {
  gulp.src(folder.src + "images/*")
      .pipe(newer(folder.dist + "images"))
      .pipe(imagemin())
      .pipe(gulp.dest(folder.dist + "images"))
})

gulp.task("js", function() {
  var page = gulp.src(folder.src + "js/*")
                 .pipe(connect.reload())
  if(!devMode){
    page.pipe(stripDebug())
        .pipe(uglify())
  }
    page.pipe(gulp.dest(folder.dist + "js"))
})

gulp.task("css", function() {
  var options = [autoprefixer(), cssnano()]
  var page = gulp.src(folder.src + "css/*")
                 .pipe(connect.reload())
                 .pipe(less())
      if(!devMode){
        page.pipe(postcss(options))
      }
      page.pipe(gulp.dest(folder.dist + "css"))
})

gulp.task("watch", function() {
  gulp.watch(folder.src + "html/*", gulp.parallel("html"))
  gulp.watch(folder.src + "css/*", gulp.parallel("css"))
  gulp.watch(folder.src + "js/*", gulp.parallel("js"))
  gulp.watch(folder.src + "images/*", gulp.parallel("images"))
})

gulp.task("server", function() {
  connect.server({
    port: "8090",
    livereload: true
  })
})


gulp.task("default", gulp.parallel("html", "images", "js", "css", "watch", "server"))