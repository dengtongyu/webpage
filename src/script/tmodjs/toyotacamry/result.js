/*TMODJS:{"version":6,"md5":"aeea77e5d0c9b342c59243600f9ed4a8"}*/
define(function(require){return require('../template')('toyotacamry/result', function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,picType=$data.picType,title=$data.title,conclusion=$data.conclusion,$out='';$out+='<div class="result-box ';
$out+=$escape(picType);
$out+='"> <div class="result-main"> <h1><img src="';
$out+=$escape(title);
$out+='"></h1> <p>测试结果：';
$out+=$escape(conclusion);
$out+='</p> </div> </div>';
return new String($out);
});});