// JavaScript Document
var stream = require('filestream');

exports.download = function(url, pather){
	try{
		stream.download(url, pather);
		return ['success', 'download success! ' + pather];
	}catch(e){
		return ['error', 'download fail from ' + url];
	}
}

exports.mime = function(key){
	return ['success', stream.get(key)];
}