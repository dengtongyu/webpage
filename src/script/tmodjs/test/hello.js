/*TMODJS:{"version":3,"md5":"82a0633ce39bc9927db661a771415017"}*/
template('test/hello',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,name=$data.name,$out='';$out+='<h1>hello,';
$out+=$escape(name);
$out+='</h1> <p>哈哈哈哈!</p>';
return new String($out);
});