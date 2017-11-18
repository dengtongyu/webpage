
//加载弹窗组件（不用可去掉）
//var dialog = require('../../script/extends/phone/dialog');

	var socket = io.connect('http://node.dengtongyu.com/chat');
	//var socket = io.connect('http://localhost:8080/chat');
	var msgBox = $('#msg-content');
	var onlineUsersDom = $('#online-users');
	var onlineUsers = 0;
	var user = (new Date()).getTime();
	var userImageId = Math.floor(Math.random()*851 + 1);
	var sendData = {}; 
	$('#send-btn').click(function(){
	    if($('#msg-val').val()=='') return false;
	    sendData.msg = $('#msg-val').val();
	    sendData.user = user;
	    sendData.imageId = userImageId;
	    socket.emit('client_chat_message', sendData);
	    $('#msg-val').val('');
	});

	//console.log(socket);

	socket.on('broadcast_chat_message', function(data){
		//console.log('接收到服务器消息');
		//console.log(msgBox.find('.weui-cell').length);
		if(msgBox.find('.weui-cell').length > 18) {
			msgBox.find('.weui-cell').eq(0).remove();
		}
		if(data.user == user) {
			msgBox.append(setSelfMsg(data.msg,data.imageId));
		}else{
	    	msgBox.append(setOthersMsg(data.msg,data.imageId));
		}
		msgBox.scrollTop(msgBox[0].scrollHeight);
	});

	msgBox.append(setOthersMsg('欢迎来到老司机开车聊天室！系好安全带，准备开车！','0'));

	function getImageLink(imageId) {
		if(imageId) {
			return '/res/images/userimage/' + imageId + '.png';
		}
	}

	function setOthersMsg(msg,imgId) {
		return '<div class="weui-cell"><div class="weui-cell__hd head-img hl"><img src="'+getImageLink(imgId)+'"></div><div class="weui-cell__hd bubble others">'+msg+'</div></div>';
	}
	function setSelfMsg(msg,imgId) {
		return '<div class="weui-cell"><div class="weui-cell__bd"></div><div class="weui-cell__ft bubble self">'+msg+'</div><div class="weui-cell__ft head-img hr"><img src="'+getImageLink(imgId)+'"></div></div>';
	}

	function getOnlineUsers() {
		setTimeout(function(){
			socket.emit('client_get_online_users', {});
			//getOnlineUsers();
		},1000);
	}

	getOnlineUsers();

	socket.on('broadcast_online_users', function(data){
		setOnlineUsers(data);
	});

	socket.on('online_users_change', function(data){
		setOnlineUsers(data);
	});

	function setOnlineUsers(data) {
		if(onlineUsers != data.onlineUsers) {
			onlineUsers = data.onlineUsers;
			onlineUsersDom.html(onlineUsers);
		}
	}