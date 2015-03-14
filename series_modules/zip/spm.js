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
		return { error: 1, message: 'zip uncompress fail. [' + dir + ']. [' + e.message + ']' };
	}
}

exports.files = function(dir){
	var err = { error: 0, message: null };
	var files = findFiles(dir, err);
	if ( err.error === 0 ){
		return { error: 0, files: files, str: 'appzip' };
	}else{
		return err;
	}
};

exports.appzip = function(file, from, mark, i){
	try{
		if ( Number(i) == 0 ){
			Application.Lock();
			Application.Contents.Remove(mark);
			Application.Unlock();
		};
		
		var apps = Application(mark);
		var jszip = zip.jszip;
		var z;
		
		if ( _.isUndefined(apps) || _.isNull(apps) ){
			z = new jszip();
		}else{
			z = new jszip(base64OrBin(apps), { base64: true });
		}
		
		z.file(path.relative(from, file), BinToBuffer(fs.readFile(file, {encoding:'buffer'})));
		var content = base64OrBin(z.generate({compression:'DEFLATE',type:"base64"}));
		Application.Lock();
		Application(mark) = content;
		Application.Unlock();
		
		return { error: 0 };
	}catch(e){
		return { error: 1, message: 'parse file to zip catch error.' };
	}
}

exports.clear = function(mark){
	try{
		Application.Lock();
		Application.Contents.Remove(mark);
		Application.Unlock();
		return { error: 0 };
	}catch(e){
		return { error: 1, message: e.message };
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

function findFiles(dir, err){
	
	var packageFile = path.resolve(dir, 'package.json');
	
	if ( !fs.exist(packageFile) ){
		err.error = 1;
		err.message = 'miss package.json';
		return;
	}
	
	var configs = require(packageFile);
	
	if ( !configs.author ){
		err.error = 1;
		err.message = 'package.json miss author.';
		return;
	}
	
	var readme = configs.readme;
	
	var a = !readme ? false : fs.exist(path.resolve(dir, readme));
	var b = fs.exist(path.resolve(dir, 'README.md'));
	var c = fs.exist(path.resolve(dir, 'readme.md'));
	
	if ( !(a || b || c) ){
		err.error = 1;
		err.message = 'module miss readme.md.';
		return;
	}
	
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

function base64OrBin(obj) {
    var xml = new ActiveXObject('Microsoft.XMLDOM');
    var node = xml.createElement('obj');
    node.dataType = 'bin.base64';
    obj = 'string' == typeof obj ? (node.text = obj, node.nodeTypedValue) : (node.nodeTypedValue = obj, node.text);
    node = xml = null;
    return obj;
}

function BinToBuffer(bin) {
	var buf = [];
	with (new ActiveXObject('Microsoft.XMLDOM').createElement('node')) {
		dataType = 'bin.hex';
		nodeTypedValue = bin;
		var hex = text;
		hex.replace(/../g, function($0) {
			buf.push(parseInt($0, 16));
		});
	};
	return buf;
}