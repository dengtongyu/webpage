/**
 * 
 * @authors Tony.Deng (dengtongyu123@163.com)
 * @date    2017-05-06 21:15:04
 * @version $Id$
 */

var resultTpl = require('../../script/tmodjs/toyotacamry/result');

var _resultData = {};
var _conclusionArray = [
	['是商场上的进取者，是时尚界的弄潮儿，你永远先人一步走在前列，你是先锋行者',
	'是智慧又炫酷的互联网精英，更是勇于创新的革新者。你，就是独具慧眼新一代'],
	['受不了将就，忍不了低规格，追求品质是你与生俱来的基因，你就是天生贵族',
	'境界高、品味高、品质要求更要高，没错，你就是众人追捧的社会精英'],
	['脸上一直挂着阳光，脚下一直奔波在路上。你知道，生命的美好不存在于想象，而在追逐的远方，你是阳光型动派',
	'热爱旅游，钟情运动，你昂扬的姿态是人群中最独特的存在。你好啊！行走的正能量']
];
var _titleArray = [['https://t1.picb.cc/uploads/2017/11/15/NusC8.png','https://t1.picb.cc/uploads/2017/11/16/NWauy.png'],['https://t1.picb.cc/uploads/2017/11/15/Nu90w.png','https://t1.picb.cc/uploads/2017/11/15/NuzNg.png'],['https://t1.picb.cc/uploads/2017/11/15/NuTHW.png','https://t1.picb.cc/uploads/2017/11/15/NuDsX.png']];
var _typeArray = ['hev','xle','xse'];
var _index = 0;
var _type = 0;


$('.item').click(function(){
     //console.log(this);
     $(this).siblings().removeClass('cur');
     $(this).addClass('cur'); 
     _index = $(this).index();
});

$('#btn').click(function(){
	_type = Math.floor(Math.random()*2);
	_resultData.picType = _typeArray[_index];
	_resultData.title = _titleArray[_index][_type];
	_resultData.conclusion = _conclusionArray[_index][_type];
	var resultHtml = $(resultTpl(_resultData));
	resultHtml.css({
		opacity:0,
		marginLeft:'100%'
	});
	$('#content-box').html(resultHtml);
	resultHtml.animate({
		opacity:1,
		marginLeft:0
	},500,function(){
		resultHtml.removeAttr('style');
	});
});
