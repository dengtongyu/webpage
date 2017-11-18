//加载弹窗组件（不用可去掉）
//var dialog=require('../../res/script/extends/dialog');
var vueResource = require('../../res/script/lib/vue-resource');
Vue.use(vueResource);

var music;//audio

var timer,movable=false,ProgX,curData={},playList=[],curTime=0;
var ps,pcur,ph;
var defaultImg = 'data:image/png;base64,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';


var indexMain=new Vue({
	el:'#index-main',
	data:{
		musicStatus:false,
		musicUrl:'',
		songName:'未知',
		singer:'未知',
		singerImg:defaultImg,
		coverImg:defaultImg,
		lyrics:[],
		loadProg:100,
		playProg:0,
		currentTime:'00:00',
		allTime:'00:00',
		canPlay:false,
		searchContent:'',
		searchResult:[],
		showPop:false
	},
	computed:{
		backgroundImage:function(){
			return 'background-image:url('+(this.coverImg?this.coverImg:this.singerImg)+')';
		}
	},
	filters:{
		htmlEncode:function(str){
			var temp = document.createElement("div"); 
		    temp.innerHTML = str; 
		    var output = temp.innerText || temp.textContent; 
		    temp = null; 
		    return output;
		}
	},
	mounted:function () { 
		music = this.$refs.music;
		ProgX = getElementLeft(this.$refs.playProg);
	},
	methods:{
		//播放按钮
		play:function(){
			if (this.canPlay) {
				if (this.musicStatus) {
					pauseMusic(this);
				}else{
					playMusic(this);
				}
			}
		},
		//下一首
		next:function() {
			if (true) {
				playNext(this);
			}
		},
		//上一首
		prev:function(){
			if (true) {
				playPrev(this);
			}
		},
		//播放进度
		playProgress:function() {
			timer = playTimer(this);
		},
		//点击进度条
		clickPlayProg:function(e){
			//setPlayProg(getMousePos(e).x-ProgX,true);
		},
		//拖动进度条-鼠标按下
		clickDown:function(e){
			movable=true;
			curTime=setPlayProg(getMousePos(e).x-ProgX,this.$refs.progressBarDom);
		},
		//拖动进度条-鼠标移动
		clickMove:function(e){
			if(movable) curTime=setPlayProg(getMousePos(e).x-ProgX,this.$refs.progressBarDom);
		},
		//拖动进度条-鼠标弹起
		clickUp:function(e){
			movable=false;
			music.currentTime=curTime;
		},
		showSeachPop:function(e){
			this.showPop = true;
		},
		searchRequest:function(e){
			//console.log(this.searchContent)
			getSongList(this.searchContent);
		},
		playSong:function(e){
			//console.log(e.target);
			//console.log(e.target.getAttribute('hash'));
			var hash = e.target.getAttribute('hash');
			getPlaySong(hash);
			this.showPop = false;
		},
		closePop:function(e){
			this.showPop = false;
		}
	}
});

//getPlayList();

//播放计时器
function playTimer(vue) {
	return setInterval(function(){
	 	if(vue.musicStatus&&!movable) {
	    	vue.playProg=currentTime()/timeAll()*100
	       	vue.currentTime=conversionTime(currentTime());
	       	vue.allTime=conversionTime(timeAll());
	           //当歌曲播放完毕后
	           //if(music.ended){
	            	//清除定时器，进度条归零，播放下一首
	           	//	clearInterval(timer);
	            //	vue.playProg=0;
	            //	vue.musicStatus=false;
	           //}
	    }
	},1000);
}

//播放
function playMusic(vue) {
	music.play();
	vue.currentTime=conversionTime(currentTime());
	vue.playProgress();
	vue.musicStatus=true;
}

//暂停
function pauseMusic(vue) {
	music.pause();
	clearInterval(timer);
	vue.musicStatus=false;
}

//播放下一首
function playNext(vue) {
	if (curData.p>=playList.length-1) setCurMusic(0,vue);
	else setCurMusic(curData.p+1,vue);
}

//播放上一首
function playPrev(vue) {
	if (curData.p==0) setCurMusic(playList.length-1,vue);
	else setCurMusic(curData.p-1,vue);
}


//设置进度条
function setPlayProg(pos,progressBar) {
	//progressBar = document.querySelector('#progress-bar');
	pos=pos>progressBar.offsetWidth?progressBar.offsetWidth:pos;
	var ratio=pos/progressBar.offsetWidth;
	indexMain.playProg=ratio*100;
	return ratio*timeAll();
}

//设置播放曲目
function setCurMusic(p,vue) {
	curData.p=p;
	curData.msg=playList[p];
	music.src=curData.msg.url;
	vue.musicUrl=music.src;
	vue.songName=curData.msg.name;
	vue.singer=curData.msg.singer;
	vue.singerImg=curData.msg.photo;
	vue.coverImg=curData.msg.cover;
	vue.lyrics=curData.msg.lyrics;
	canPlayMeta(music,function(){
		playMusic(vue);
	});
	playMusic(vue);
	canPlayEnded(music,function(){
		playNext(vue);
	});
	var lyricsScroll = vue.$refs.lyricsScroll;
	music.ontimeupdate = function(e) {
	    //遍历所有歌词，看哪句歌词的时间与当然时间吻合
	    var indexArr = [];
	    for (var i = 0; i < curData.msg.lyrics.length; i++) {
	        /*是否匹配当前播放的时间*/
	        if (this.currentTime  > curData.msg.lyrics[i][0]) {
	        	indexArr.push(i);
	        };
	    };

	    if(indexArr.length > 0) {
	    	var index = indexArr[indexArr.length - 1];
	    	var moveIndex = (index-2>0)?index-2:0;
	    	
	        ps = lyricsScroll.querySelectorAll('p');
	        pcur = ps[index];
	        ph = pcur.clientHeight;
	        for (var j = 0; j < ps.length; j++) {
	        	ps[j].removeAttribute('class');
	        };
	        pcur.className = 'cur';
	        
	        lyricsScroll.style.transform = 'translateY('+(-moveIndex*ph)+'px)';
	    }

	};
}

//将剩余秒数转化为标准格式
function conversionTime(time){
    var surplusMinite,
        surplusSecond,
        cTime;
    //将剩余秒数转化为分钟
    surplusMinite = Math.floor((time / 60) % 60);
    //将剩余秒数转化为秒钟
    surplusSecond = Math.floor(time % 60);
    if(surplusMinite < 10){
        surplusMinite = '0' + surplusMinite;
    }
    if(surplusSecond < 10){
        surplusSecond = '0' + surplusSecond;
    }
    cTime = surplusMinite + ':' + surplusSecond;
    return cTime;
}

//获取歌曲总时间
function timeAll(){
    if(music.currentTime != 0){
        return music.duration;
    }else{
        return 0;
    }
}

//获取歌曲当前播放时间
function currentTime(){
    return music.currentTime;
}

//获取节点偏移量
function getElementLeft(element) { 
	var actualLeft = element.offsetLeft; 
	var current = element.offsetParent; 

	while (current!==null) { 
		actualLeft += current.offsetLeft; 
		current = current.offsetParent; 
	} 
	return actualLeft; 
}

//获取鼠标位置
function getMousePos(event) {
    var e = event.targetTouches[0];
    var x = e.pageX;
    var y = e.pageY;
    
    return { 'x': x, 'y': y };
}

//媒体文件元数据加载完成
function loadedMetaData(audio,cb) {
	audio.onloadedmetadata=function(data){
		if (cb) cb(data);
	}
}


//媒体文件可以播放
function canPlayMeta(audio,cb) {
	audio.oncanplay=function(data){
		indexMain.canPlay=true;
		if (cb) cb(data);
	}
}

//媒体文件播放结束
function canPlayEnded(audio,cb) {
	audio.onended=function(data){
		clearInterval(timer);
		indexMain.musicStatus=false;
		indexMain.playProg=0;
		if (cb) cb(data);
	}
}

//getPlaySong('4AD039C240CB1C9B9A922FB886A37188');

function getSongList(keyword) {
	var url = 'http://songsearch.kugou.com/song_search_v2?keyword='+keyword+'&page=1&pagesize=30&userid=-1&clientver=&platform=WebFilter&tag=em&filter=2&iscorrection=1&privilege_filter=0&_='+Date.now();
	Vue.http.jsonp(url, {
		params:{
	    }
	}).then(function(json){
		var result = json.json();
		//console.log(result);
		if (result) {
			if(result.status == 1 && result.data.lists.length > 0) {
				indexMain.searchResult = result.data.lists;
			}
			
	    }else{
	    	
	    }
	}, function(){
	});
}

function getPlaySong(hash) {
	Vue.http.get('/data/songMsg?hash='+hash, {
		params:{
	    }
	}).then(function(json){
		var json = json.json();

		if (json) {
			if(json.result) {
				var songMsg = {
					url:json.data.play_url,
					name:json.data.song_name,
					singer:json.data.author_name,
					photo:json.data.img,
					cover:json.data.img,
					lyrics:parseLyric(json.data.lyrics)
				}
				playList.push(songMsg);
				setCurMusic(playList.length-1,indexMain);
			}
			
	    }else{
	    	//dialog.showMsg(lotData.desc);
	    }
	}, function(){
		//contentBox.loading=false;
		//dialog.showMsg('你的网络好像不给力，请重试！');
	});
}

function parseLyric(text) {
    //将文本分隔成一行一行，存入数组
    var lines = text.split('\n'),
        //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
        pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
        //保存最终结果的数组
        result = [];
    //去掉不含时间的行
    while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
    };
    //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function(v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) {
        //提取出时间[xx:xx.xx]
        var time = v.match(pattern),
            //提取歌词
            value = v.replace(pattern, '');
        //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
        time.forEach(function(v1, i1, a1) {
            //去掉时间里的中括号得到xx:xx.xx
            var t = v1.slice(1, -1).split(':');
            //将结果压入最终数组
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
        });
    });
    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function(a, b) {
        return a[0] - b[0];
    });
    return result;
}