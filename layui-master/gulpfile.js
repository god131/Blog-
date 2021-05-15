
/**
 layui Build
*/

var pkg = require('./package.json');
var inds = pkg.independents;

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var header = require('gulp-header');
var del = require('del');
var gulpif = require('gulp-if');
var minimist = require('minimist');
var zip = require('gulp-zip');

//获取参数
var argv = require('minimist')(process.argv.slice(2), {
  default: {
    ver: 'all' 
  }
})

//注释
,note = [
  '/** <%= pkg.realname %> v<%= pkg.version %> | Released under the <%= pkg.license %> license */\n <%= js %>'
  ,{pkg: pkg, js: ';'}
]

//模块
,mods = 'lay,laytpl,laypage,laydate,jquery,layer,util,element,upload,dropdown,slider,colorpicker,form,tree,transfer,table,carousel,rate,flow,layedit,code'

//发行版本目录
,releaseDir = './release/zip/layui-v' + pkg.version
,release = releaseDir + '/layui'

//目标木
,destDir = function(ver){
  return ver ? release : function(){
    return argv.rc ? 'rc' : 'dist'
  }();
}

//任务
,task = {
  //聚合 JS 文件
  alljs: function(ver){
    var src = [
      './src/**/{layui,layui.all,'+ mods +'}.js'
    ]
    ,dir = destDir(ver);
    
    return gulp.src(src).pipe(uglify())
      .pipe(concat('layui.js', {newLine: ''}))
      .pipe(header.apply(null, note))
    .pipe(gulp.dest('./'+ dir));
  }
  
  //压缩 css 文件
  ,mincss: function(ver){
    var src = [
      './src/css/**/*.css'
      ,'!./src/css/**/font.css'
    ]
    ,dir = destDir(ver)
    ,noteNew = JSON.parse(JSON.stringify(note));
    
    noteNew[1].js = '';
    
    return gulp.src(src).pipe(minify({
      compatibility: 'ie7'
    })) //.pipe(header.apply(null, noteNew))
    .pipe(gulp.dest('./'+ dir +'/css'));
  }
  
  //复制iconfont文件
  ,font: function(ver){
    var dir = destDir(ver);
    
    return gulp.src('./src/font/*')
    .pipe(rename({}))
    .pipe(gulp.dest('./'+ dir +'/font'));
  }
  
  //复制组件可能所需的非css和js资源
  ,mv: function(ver){
    var src = ['./src/**/*.{png,jpg,gif,html,mp3,json}']
    ,dir = destDir(ver);
    
    gulp.src(src).pipe(rename({}))
    .pipe(gulp.dest('./'+ dir));
  }
  
  //复制发行的引导文件
  ,release: function(){
    gulp.src('./release/doc/**/*')
      .pipe(replace('http://local.res.layui.com/layui/dist/', 'layui/'))
    .pipe(gulp.dest(releaseDir));
  }
};

//清理
gulp.task('clear', function(cb) {
  return del(['./'+ (argv.rc ? 'rc' : 'dist') +'/*'], cb);
});
gulp.task('clearRelease', function(cb) {
  return del([releaseDir], cb);
});

gulp.task('alljs', task.alljs);
gulp.task('mincss', task.mincss);
gulp.task('font', task.font);
gulp.task('mv', task.mv);
gulp.task('release', task.release);

//完整任务 gulp
gulp.task('default', ['clear'], function(){ //rc 版：gulp --rc
  for(var key in task){
    task[key]();
  }
});

//发行版 gulp rls
gulp.task('rls', ['clearRelease'], function(){ // gulp rls
  for(var key in task){
    task[key]('release');
  }
});

//打包 layer 独立版
gulp.task('layer', function(){
  var dir = './release/layer';
  
  gulp.src('./src/css/modules/layer/default/*')
  .pipe(gulp.dest(dir + '/src/theme/default'));

  return gulp.src('./src/modules/layer.js')
  .pipe(gulp.dest(dir + '/src'));
});


//打包 layDate 独立版
gulp.task('laydate', function(){
  //发行目录
  var dir = './release/laydate'
  
  //注释
  ,notes = [
    '/** \n @Name：<%= title %> \n @License: <%= license %> \n */ \n\n'
    ,{title: 'layDate 日期与时间组件', license: 'MIT'}
  ];
  
  //合并所依赖的 css 文件
  gulp.src('./src/css/modules/laydate/default/{font,laydate}.css')
    .pipe(concat('laydate.css', {newLine: '\n\n'}))
  .pipe(gulp.dest(dir + '/src/theme/default'));
  
  //合并所依赖的 js 文件
  return gulp.src(['./src/modules/{lay,laydate}.js'])
    .pipe(concat('laydate.js', {newLine: ''}))
    .pipe(header.apply(null, notes))
  .pipe(gulp.dest(dir + '/src'));
});










