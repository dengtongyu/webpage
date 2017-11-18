/**
 * 
 * @authors Tony.Deng (dengtongyu123@163.com)
 * @date    2017-05-17 15:09:29
 * @version $Id$
 */

const gulp = require('gulp');
const gutil = require("gulp-util");
const runSequence = require('run-sequence');
const copy = require('gulp-contrib-copy');


//webPackConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");

//初始化变量
let config = {
    base: 'src',
    build: 'build'
};

let pathConfig = {

}

//提示
let LOG = {
    DEFAULT: '',
    ERROR: 'red',
    GOOD: 'green',
    WARN: 'yellow',
    FUN: 'pink',
    EM: 'cyan',
    TIPS: 'gray'
};
let colorLog = function (text, color) {
    let colors = {
        red: 31,
        green: 32,
        yellow: 33,
        blue: 34,
        pink: 35,
        cyan: 36,
        gray: 90
    };
    return console.log('\033[' + (colors[color] || '00') + 'm' + text + '\033[0m');
};

let userInput = 1; //输入值

gulp.task('server', function() {


});

gulp.task('build', function (cb) {
	
});

//复制模板
gulp.task('copy-pc', function () {
    return gulp.src(config.base + '/template/tpl-pc/**/*.*')
        .pipe(copy())
        .pipe(gulp.dest(config.base + '/pages/' + pathName));
});
gulp.task('copy-phone', function () {
    return gulp.src(config.base + '/template/tpl-phone/**/*.*')
        .pipe(copy())
        .pipe(gulp.dest(config.base + '/pages/' + pathName));
});

function setPath(pathName) {

	pathConfig.currPath = pathName;

	//stylus build目录
	pathConfig.styleBuildPath = config.base + '/pages/' + pathName + '/**/*.styl';

	//swig build目录
	pathConfig.htmlBuildPath = config.base + '/pages/' + pathName + '/**/*.htm';

	//htmlmin build目录
	pathConfig.htmlminBuildPath = config.build + '/pages/' + pathName + '/**/*.html';

	//wabpck build 目录
	pathConfig.scriptBuildPath = config.base + '/pages/' + pathName + '/**/*.js';
	pathConfig.webpackOutPath = config.build + '/pages/' + pathName;

	//uglify build目录
    pathConfig.uglifyBuildPath = config.build + '/pages/' + pathName + '/**/*.js';
    
    //tmod build目录
    pathConfig.tmodBuildPath = config.base + '/pages/' + pathName + '/**/*.tmod';
    pathConfig.tmodBasePath =config.base + '/pages/';
    pathConfig.tmodOutPath = config.base + '/script/tmodjs/';

	require('./task')(pathConfig,config);
}

//随机路径名
function randomActName() {
    let d = new Date();
    let m = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1).toString();
    let dd =  d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    let str = d.getFullYear() + m + dd + String.fromCharCode(Math.floor(Math.random() * 26) + "a".charCodeAt(0)) + Math.floor(Math.random() * 10);
    d = m = null;
    return str;
}

//选择模板
function selectTpl() {
    colorLog('请选择需要创建的模板：', LOG.EM);
    colorLog('1. tpl-pc\n2. tpl-phone', LOG.TIPS);
    gets(function (choose) {
        let input = choose.replace(/[\n\r]+/ig, '');
        if (input == 1) {
            runSequence('copy-pc', function () {
                setPath(pathName);
                runSequence('dev');
            });
        } else if (input == 2) {
            runSequence('copy-phone', function () {
                setPath(pathName);
                runSequence('dev');         
            });
        } else {
            colorLog('没有该选项，请重新运行！', LOG.ERROR);
        }
    });
}

//输入流
function gets(cb) {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', function (chunk) {
        process.stdin.pause();
        cb(chunk);
        //process.stdin.end();
    });
}

gulp.task('default', function () {
	colorLog('请选择执行的任务：', LOG.EM);
    colorLog('1. random create\n2. name create\n3. dev\n4. pack', LOG.TIPS);
    gets(function (text) {
    	userInput = text.replace(/[\n\r]+/ig, '');
        if (userInput == 1) {
            pathName = randomActName();
            selectTpl();
        } else if (userInput == 2) {
            colorLog('请输入需要创建的路径名：', LOG.EM);
            gets(function (name) {
                pathName = name.replace(/[\n\r]+/ig, '');
                selectTpl();
                //setPath(pathName);
                //runSequence('dev');
            });
        } else if (userInput == 3) {
            colorLog('请输入页面路径名：', LOG.EM);
            gets(function (name) {
                pathName = name.replace(/[\n\r]+/ig, '');
                setPath(pathName);
                runSequence('dev');
            });
        } else if (userInput == 4) {
            colorLog('请输入构建路径名：', LOG.EM);
            gets(function (name) {
                pathName = name.replace(/[\n\r]+/ig, '');
                setPath(pathName);
                runSequence('build');
            });
        } else {
            colorLog('没有该选项，请重新运行！', LOG.ERROR);
        }
	});
});

gulp.task('build', function (callback) {
	runSequence('stylus_build','swig_build','htmlmin_build','tmod_build','webpack_build','uglify_build');
});

gulp.task('dev', function (callback) {
	runSequence('stylus_build','swig_build','htmlmin_build','tmod_build','webpack_build','server');
});
