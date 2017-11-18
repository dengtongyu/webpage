

//加载弹窗组件（不用可去掉）
//var dialog = require('../../script/extends/phone/dialog');

//var template = require('../../script/lib/template.min.js');

var startNumber = 0;

getList(startNumber);

function getList(start) {
	$.ajax({
		url:'/data/getPictureList',
		type:'GET',
		dataType:'json',
		data:{
			start:start,
			number:12
		},
		cache:false,
		success:function(json){
			if(json.result) {
				if(json.data.length >= 12) {
					var data = fixDataArray(json.data);
					$('#main').append(template('list-tpl',{data:data}));
				}else if(json.data.length < 12 && json.data.length > 0){
					var data = fixDataArray(json.data);
					$('#main').append(template('list-tpl',{data:data}));

					$('#more-btn').html('已经没有数据了！');
					$('#more-btn').off('tap');
				}else if(json.data.length == 0) {
					$('#more-btn').html('已经没有数据了！');
					$('#more-btn').off('tap');
				}
			}
		}
	});
}


function fixDataArray(data) {
	var allArr = [];
	var litArr = [];
	for (var i = 0; i < data.length; i++) {
		litArr.push(data[i]);
		if(((i+1)!=0 && (i+1)%3==0) || i==data.length-1) {
			//console.log(litArr);
			allArr.push(litArr);
			litArr = [];
		}
	}
	return allArr;
}

$('#more-btn').on('tap',function(){
	startNumber = startNumber+12;
	getList(startNumber);
});

// $('#more-btn').tap(function(){
// 	startNumber = startNumber+12;
// 	getList(startNumber);
// });

$('#main').delegate('img','tap',function(evt){

	var _this = $(this);

	var imgUrl = _this.attr('org')?_this.attr('org'):_this.attr('src');
	$('#pop-mark').show();
	$('.content-box').css({'overflow-y':'hidden'});
	var tpl = template('pop-tpl',{imgUrl:imgUrl});
	$('body').append(tpl);

	var imgPop = $('.img-main');
	
	loadImage(imgUrl,function(){
		var imgHeight = imgPop.find('img').height();
		
		//console.log(imgHeight)
		//console.log(document.body.offsetHeight)
		if(imgHeight > document.body.offsetHeight){
			imgPop.css({display:'block'});
		}else{
			imgPop.css({display:'flex'});
		}
	})
});

$('body').delegate('.img-pop','tap',function(evt){
	//console.log($(this).find('img').height());
	$('#pop-mark').hide();
	$('.content-box').css({'overflow-y':'auto'});
	$(this).remove();
});

function loadImage(url, callback) {
	var img = new Image(); //创建一个Image对象，实现图片的预下载
	img.src = url;
 
	if(img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
		callback.call(img);
   		return; // 直接返回，不用再处理onload事件
	}
 	img.onload = function () { //图片下载完毕时异步调用callback函数。
    	callback.call(img);//将回调函数的this替换为Image对象
  	};
};