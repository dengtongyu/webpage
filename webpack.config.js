/**
 * 
 * @authors Tony.Deng (dengtongyu123@163.com)
 * @date    2017-05-17 15:20:47
 * @version $Id$
 */

const webpack = require('webpack');

module.exports = function(pathName) {

	let path = pathName?pathName:'test';

	let exportObj = { 

		//入口文件
		entry: "./src/pages/"+path+"/index.js",
		output: {
			path: __dirname + "/build/pages/"+path,//打包后的文件存放的地方
	    	filename: "index.js"//打包后输出文件的文件名
	  	}
  	}

  	return exportObj;
}
