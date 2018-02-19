/**
 * 
 * @authors Tony.Deng (dengtongyu123@163.com)
 * @date    2017-05-17 15:35:29
 * @version $Id$
 */

const gulp = require('gulp');
const webpack = require('gulp-webpack');
const stylus = require('gulp-stylus');
const swig = require('gulp-swig');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const tmodjs = require('gulp-tmod');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const proxyMiddleware = require('http-proxy-middleware');
const lodash = require('lodash');
const path = require('path');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

let swigOpts = {
    defaults: {
        varControls: ['{[', ']}'],
        cache: false
    }
};

function onErrorHandler(err) {
	notify.onError({
		title: "Webpage",
        subtitle: err.plugin + " error!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
	})(err);
	this.emit('end');
}

//代理配置
let proxy = proxyMiddleware(
    ['/node_modules','/res/images/userimage'],
    {
        //target:'http://172.26.68.35:8085'//
        target: 'http://node.dengtongyu.com'
        //target:'http://47.94.23.46:80'
    }
);
let proxy2 = proxyMiddleware(
    ['/data/getPictureList'],
    {
        target: 'http://localhost:8080'
    }
);

function pathType(filePath) {
	let type = path.parse(filePath).ext;
	if(type == '.styl') {
		return 0;
	}else if(type == '.htm') {
		return 1;
	}else if(type == '.html') {
		return 2;
	}else if(type == '.js') {
		if(filePath.match(/build/ig)) {
			return 4;
		}else {
			return 3;
		}
	}else if(type == '.tmod') {
		return 5;
	}

}

module.exports =  function (pathConfig,config) {

	let swigData = require('./' + config.base + '/pages/' + pathConfig.currPath + '/data.json');
	swigData.now = function () {
	    return new Date().getTime()
	};
    swigOpts.defaults.locals = swigData;

    let webPackConfig = require('./webpack.config.js')(pathConfig.currPath);

    function watcherListFun(watchList) {
    	for (var i = 0; i < watchList.length; i++) {
    		gulp.watch(watchList[i].watchPath,watchList[i].taskName).on('change', function (event) {
    			let fileType = pathType(event.path);
		        pathConfig[watchList[fileType].taskPath] = path.relative(__dirname,event.path);
		        //added为新增,deleted为删除，changed为改变
		        //变化类型 和 变化的文件的路径
		        console.log(event.type + ' : ' + pathConfig[watchList[fileType].taskPath]);
		    });
    	}
	}

	//server任务
	gulp.task('server', function () {
	    browserSync({
	        host: 'localhost',
	        open: 'external',
	        startPath: '/pages/' + pathConfig.currPath,
	        browser: 'google chrome',
	        ghostMode: false, // 每个页面的镜像独立，不相互影响
	        server: {
	            baseDir: 'build',
	            middleware: [proxy,proxy2]
	        }
	    });

	    let watchList = [
	    	{
	    		watchPath:pathConfig.styleBuildPath,
	    		taskName:['stylus_build'],
	    		taskPath:'styleChangePath'
	    	},
	    	{
	    		watchPath:pathConfig.htmlBuildPath,
	    		taskName:['swig_build'],
	    		taskPath:'swigChangePath'
	    	},
	    	{
	    		watchPath:pathConfig.htmlminBuildPath,
	    		taskName:['htmlmin_build'],
	    		taskPath:'htmlminChangePath'
	    	},
	    	{
	    		watchPath:pathConfig.scriptBuildPath,
	    		taskName:['webpack_build'],
	    		taskPath:'scriptChangePath'
	    	},
	    	{
	    		watchPath:pathConfig.uglifyBuildPath,
	    		taskName:['uglify_build'],
	    		taskPath:'uglifyChangePath'
	    	},
	    	{
	    		watchPath:pathConfig.tmodBuildPath,
	    		taskName:['tmod_build'],
	    		taskPath:'tmodChangePath'
	    	}
	    ]

	    watcherListFun(watchList);
    });

	//stylus任务
	gulp.task('stylus_build', function () {
	    return gulp.src(pathConfig.styleBuildPath, config)
			.pipe(plumber({errorHandler: onErrorHandler}))
	        .pipe(stylus({
		    	compress: true
		    }))
			.pipe(gulp.dest(config.build))
	        .on("end", reload);
	});

	//swig任务
	gulp.task('swig_build', function () {
		return gulp.src(pathConfig.htmlBuildPath, config)
			.pipe(plumber({errorHandler: onErrorHandler}))
	        .pipe(swig(swigOpts))
	        .pipe(gulp.dest(config.build))
	        .on("end", reload);
	});

	//htmlmin任务
	gulp.task('htmlmin_build', function () {
		return gulp.src(pathConfig.htmlminBuildPath, config)
			.pipe(plumber({errorHandler: onErrorHandler}))
	        .pipe(htmlmin({collapseWhitespace: true}))
			.pipe(gulp.dest(config.build))
	        .on("end", reload);
	});

	//webpack任务
	gulp.task('webpack_build', function () {
		return gulp.src(pathConfig.scriptBuildPath)
			.pipe(plumber({errorHandler: onErrorHandler}))
	        .pipe(webpack( webPackConfig ))
  			.pipe(gulp.dest(pathConfig.webpackOutPath))
	        .on("end", reload);
	});

	//uglify任务
	gulp.task('uglify_build', function () {
		return gulp.src(pathConfig.uglifyBuildPath, {base: config.build})
			.pipe(plumber({errorHandler: onErrorHandler}))
	        .pipe(uglify())
	        .pipe(gulp.dest(config.build))
	        .on("end", reload);
	});

	//tmod任务
	gulp.task('tmod_build', function () {
		console.log(pathConfig.tmodBuildPath);
		return gulp.src(pathConfig.tmodBuildPath)
			.pipe(plumber({errorHandler: onErrorHandler}))
	        .pipe(tmodjs({
				templateBase: pathConfig.tmodBasePath,
				output: pathConfig.tmodOutPath,
				combo: false,
				type: 'cmd'
			}))	
	        .on("end", reload);
	});
}