// JavaScript Document

var spmRunPix = '../../series_spm';
var spmRunner = path.resolve(__dirname, spmRunPix);
var stream = require('filestream');

exports.download = function(url, pather){
	try{
		pather = path.resolve(spmRunner, pather);
		stream.download(url, pather);
		return { error: 0, chunks: ['<font color="#069">- # download success! ' + pather + '</font>'] };
	}catch(e){
		return { error: 1, message: '- # download fail from ' + url };
	}
}

exports.mime = function(key){
	return { error: 0, chunks: ['- @ ' + stream.get(key)] };
}