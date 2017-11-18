/*TMODJS:{"version":2,"md5":"42c38c47514173e8894d3110bc76222a"}*/
define(function(require){return require('../template')('test-pc/hello', function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,name=$data.name,$out='';$out+='<h1>hello,';
$out+=$escape(name);
$out+='</h1> <p>哈哈哈哈</p>';
return new String($out);
});});