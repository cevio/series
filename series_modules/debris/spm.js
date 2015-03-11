//debris download http://api.webkits.cn/dist/modules/markdown/2.11.4.zip ../markdown.zip
var spmRunPix = '../../series_spm';
var spmRunner = path.resolve(__dirname, spmRunPix);
var debris = require('debris');

exports.download = function(url, pather){
	try{
		pather = path.resolve(spmRunner, pather);
		var i = debris(url, pather, 1024 * 3);
		return { error: 0, percent: i, chunks: ['- : ' + (i * 100).toFixed(2) + '%'] };
	}catch(e){
		return { error: 1, message: 'debris download catch io error.' };
	}
}