//debris download http://api.webkits.cn/dist/modules/markdown/2.11.4.zip ../markdown.zip
var debris = require('debris');

exports.download = function(url, pather){
	try{
		var i = debris(url, pather, 1024 * 3);
		return { error: 0, percent: i };
	}catch(e){
		return { error: 1, message: 'debris download catch io error.' };
	}
}

exports.size = function(url){
	var size = debris.getRemoteFileSize(url);
	return ['info', 'package size: ' + size + ' bytes.'];
}