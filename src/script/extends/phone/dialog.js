/*
	本弹窗组件用于手机移动端页面，不依赖jQuery或者zepto，不兼容低版本IE浏览器。

	用法：
	引入js模块
	var dialog=require('./lightDialog');

	引入样式
	（因为样式采用rem单位，所以建议引入样式前声明$norm值，不声明则默认值为750）
	例如：
	$norm=640;
	@import './common/dialog-pop.styl';

	调用
	dialog.showMsgBoth('呵呵哈哈哈',function(){
		dialog.showMsg('我点了确定按钮');
		return false;						//可以通过 return false 阻断弹窗关闭
	},function(){
		dialog.showMsgRightTop('我点了取消按钮',function(){
			console.log('关闭')
		});
	},null,'关闭');

 */

var dialogPop=require('./dialog_pop');

var config={
	yesShow:true,			//是否显示确定按钮
	noShow:false,			//是否显示取消按钮
	closeBtnShow:false,		//是否显示右上角关闭按钮
}

var bodyDom=document.querySelector('body'),
	tempDom,popObj={};
	//visible='display:block;visibility:hidden';

//合并对象
function extend(des,src){
    for(var key in src){
           des[key]=src[key]
    }
    return des;
}

//创建dom
function strDom(html) {
	tempDom = document.createElement('div');
	tempDom.innerHTML = html//.replace(/\s+|\n/g,' ').replace(/>\s</g,'><');
	return tempDom.childNodes;
};

//过滤字符DOM
function filterNode(nodeList) {
	var newNodeList=[];
	for (var i = 0; i < nodeList.length; i++) {
		/*if (nodeList[i].nodeName!='#text'&&nodeList[i].nodeValue!=' ') {
			newNodeList.push(nodeList[i]);
		}*/
		newNodeList.push(nodeList[i]);
	}
	return newNodeList;
}

//插入节点
function insertHtml(nodeList,parentNode) {
	for (var i = 0; i < nodeList.length; i++) {
		parentNode.appendChild(nodeList[i]);
	}
}


//计算居中
function popDomCenter(node,key) {
	//node.setAttribute('style',visible);
	var className=node.getAttribute('class')+' animated bounceIn';
	node.setAttribute('class',className);
	node.setAttribute('style','margin-top:-'+(node.offsetHeight/2)+'px;margin-left:-'+(node.offsetWidth/2)+'px');
	className=null;
}

//选中弹窗
function selectPopDom(nodeList,key) {
	for (var i = 0; i < nodeList.length; i++) {
		if (nodeList[i].id==key) {
			return nodeList[i]
		}else {
			return null;
		}
	}
}

//确定按钮
function bindYesButton(node,cb) {
	node.querySelector('.dialog-yes').onclick=function(){
		if (typeof cb==='function') cb(this)===false||closePop(this);
		else closePop(this);
	}
}


//取消按钮
function bindNoButton(node,cb) {
	node.querySelector('.dialog-no').onclick=function(){
		if (typeof cb==='function') cb(this)===false||closePop(this);
		else closePop(this);
	}
}

//关闭按钮
function bindCloseButton(node,cb) {
	node.querySelector('.dialog-close').onclick=function(){
		closePop(this);
		if (typeof cb==='function') cb(this);
	}
}

//关闭弹窗
function closePop(btn) {
	var popId=btn.getAttribute('sub');
    if(popId){
		for (var i = 0; i < popObj[popId].length; i++) {
			bodyDom.removeChild(popObj[popId][i]);
		}
    	delete popObj[popId];
    }
    popId=null;
}

//创建弹窗
function baseMsgPop(obj) {
	obj.popId=new Date().getTime();
	var configTemp=JSON.parse(JSON.stringify(config));
	obj=extend(configTemp,obj);

	var nodeList=filterNode(strDom(dialogPop(obj)));
	popObj[obj.popId]=nodeList;
	insertHtml(nodeList,bodyDom);
	var popDom=selectPopDom(popObj[obj.popId],obj.popId);
	if (obj.text) {
		insertHtml(filterNode(strDom(obj.text)),popDom.querySelector('#dialog-content'));
	}
	popDomCenter(popDom,obj.popId);

	if (obj.yesShow) {
		bindYesButton(popDom,obj.yesFun);
	};

	if (obj.noShow) {
		bindNoButton(popDom,obj.noFun);
	};

	if (obj.closeBtnShow) {
		bindCloseButton(popDom,obj.closeFun);
	};
	configTemp=popDom=nodeList=null;
}

//普通弹窗，只有一个确定按钮
function showMsg(text,cb,showMark) {
	baseMsgPop({
		text:text,									//提示文案
		yesFun:cb, 									//确定按钮的回调函数
		showMark:showMark 							//是否显示遮罩
	});
}

//交互弹窗，确定和取消按钮
function showMsgBoth(text,yesFun,noFun,yesBtnText,noBtnText,showMark) {
	baseMsgPop({
		text:text,									//提示文案
		noShow:true,								//显示取消按钮
		yesFun:yesFun,								//确定按钮的回调函数
		noFun:noFun,								//取消按钮的回调函数
		yesBtnText:yesBtnText,						//确定按钮的文案
		noBtnText:noBtnText, 						//取消按钮的文案
		showMark:showMark 							//是否显示遮罩
	});
}

//关闭弹窗，只有右上角的关闭按钮
function showMsgRightTop(text,closeFun,showMark) {
	baseMsgPop({
		text:text,									//提示文案
		yesShow:false,								//不显示确定按钮
		closeBtnShow:true,							//显示右上角关闭按钮
		closeFun:closeFun, 							//关闭按钮的回调函数
		showMark:showMark 							//是否显示遮罩
	});
}

exports.baseMsgPop=baseMsgPop						//基础创建弹窗方法
exports.showMsg=showMsg;							//普通弹窗，只有一个确定按钮
exports.showMsgBoth=showMsgBoth;					//交互弹窗，确定和取消按钮
exports.showMsgRightTop=showMsgRightTop;			//关闭弹窗，只有右上角的关闭按钮
