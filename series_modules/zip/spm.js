var spmRunPix = '../../series_spm';
var spmRunner = path.resolve(__dirname, spmRunPix);
var zip = require('zip');

exports.compress = function(dir, pather){
	try{
		dir = path.resolve(spmRunner, dir);
		pather = path.resolve(spmRunner, pather);
		zip.zip(dir, pather);
		return { error: 0, chunks: ['<font color="#069">- # zip compress success! ' + pather + '</font>'] };
	}catch(e){
		return { error: 1, message: 'zip compress fail from ' + dir };
	}
}

exports.uncompress = function(pather, dir){
	try{
		dir = path.resolve(spmRunner, dir);
		pather = path.resolve(spmRunner, pather);
		zip.unZip(pather, dir);
		var files = findDir(dir);
		var chunks = ['- @ zip uncompress from ' + pather + ' to ' + dir]
		_.each(files, function(file){
			chunks.push('<pre>  <font color="#555">- % ' + file + '</font></pre>');
		});
		chunks.push('<font color="#069">- # zip uncompress success!</font>');
		return { error: 0, chunks: chunks };
	}catch(e){
		return { error: 1, message: 'zip compress fail from ' + dir };
	}
}

function findDir(dir){
	var files = [];
	var obj = fs.readDir(dir);
	_.each(obj.file, function(file){
		files.push(String(file));
	});
	_.each(obj.dir, function(folder){
		folder = String(folder);
		files = files.concat(findDir(folder));
	});
	return files;
}