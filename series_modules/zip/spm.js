var zip = require('zip');

exports.compress = function(dir, pather){
	try{
		zip.zip(dir, pather);
		return { error: 0, chunks: ['<font color="#069">- # zip compress success! ' + pather + '</font>'] };
	}catch(e){
		return { error: 1, message: 'zip compress fail from ' + dir };
	}
}

exports.uncompress = function(pather, dir){
	try{
		zip.unZip(pather, dir);
		var files = findDir(dir);
		var chunks = [];
		_.each(files, function(file){
			chunks.push(file);
		});
		return ['list', 'file list', chunks];
	}catch(e){
		return ['error', 'zip uncompress fail. [' + dir + ']. [' + e.message + ']'];
	}
}

exports.files = function(dir, modal){
	var debug = require('debug');
	var err = { error: 0, message: null };
	var user = require(path.resolve(__dirname, '../../dist/config.json'));
	var mark;

	if (user && user.appid) {
		mark = modal + user.appid;
	} else {
		err.error = 1;
		err.message = 'To post a module, you must have a user appid!';
		return err;
	}
	
	var files = findFiles(dir, err);
	
	if ( err.error === 0 ){
		return { error: 0, files: files, mark: mark };
	}else{
		return err;
	}
};

// 依次压缩文件到Application
exports.appzip = function(file, from, mark, i){
	try{
		var jszip = zip.jszip;
		var z = new jszip();
		var obj1, obj2;
		
		// 判断是不是还是处
		if ( Number(i) == 0 ){
			// 第一次做，总是那么的麻烦
			obj1 = new ActiveXObject('Adodb.Stream');
			obj1.Type = 1;
			obj1.Mode = 3;
			obj1.Open();
			
			obj2 = new ActiveXObject('Adodb.Stream');
			obj2.Type = 1;
			obj2.Mode = 3;
			obj2.Open();
			
			Application.Lock();
			Application(mark + '_zip_file') = obj1;
			Application(mark + '_zip_central') = obj2;
			Application(mark + '_zip_localDirLength') = 0;
			Application(mark + '_zip_centralDirLength') = 0;
			Application(mark + '_zip_zipDataLenght') = 0;
			Application.Unlock();
		} else {
			// 有经验之后，事情就简单多了
			obj1 = Application(mark + '_zip_file');
			obj2 = Application(mark + '_zip_central');
		};
		
		var localDirLength = Application(mark + '_zip_localDirLength');
		var centralDirLength = Application(mark + '_zip_centralDirLength');
		var	zipDataLenght = Application(mark + '_zip_zipDataLenght');
		
		z.file(path.relative(from, file), BinToBuffer(fs.readFile(file, {encoding:'buffer'})));
		var result = z.compressfile(localDirLength);	// 根据已有文件大小计算偏移量
		
		localDirLength += result.localDirLength;
		centralDirLength += result.centralDirLength;
		zipDataLenght += result.zipDataLenght;
		
		var binf = base64OrBin(result.dataf);
		obj1.Position = obj1.Size;
		obj1.Write(binf);
		
		var binc = base64OrBin(result.datac);
		obj2.Position = obj2.Size;
		obj2.Write(binc);
		
		// 爽完了，把东西存起来下次接着用
		Application.Lock();
		Application(mark + '_zip_file') = obj1;
		Application(mark + '_zip_central') = obj2;
		Application(mark + '_zip_localDirLength') = localDirLength;
		Application(mark + '_zip_centralDirLength') = centralDirLength;
		Application(mark + '_zip_zipDataLenght') = zipDataLenght;
		Application.Unlock();
		
		return { error: 0 };
	}catch(e){
		return { error: 1, message: 'parse file to zip catch error.' + e.message };
	}
}

// 生成完整的zip文件内容
exports.create = function(mark){
	try{
		// 把读到的所有内容打包成zip文件
		var localDirLength = Application(mark + '_zip_localDirLength');
		var centralDirLength = Application(mark + '_zip_centralDirLength');
		var	zipDataLenght = Application(mark + '_zip_zipDataLenght');

		var obj1 = Application(mark + '_zip_file');
		var obj2 = Application(mark + '_zip_central');
			
				
		var jszip = zip.jszip;
		var z = new jszip();
		var binary = base64OrBin(z.generatepack(localDirLength, centralDirLength, zipDataLenght));
		
		obj2.Position = 0;
		obj1.Position = obj1.Size;
		obj1.Write(obj2.Read);
		obj1.Position = obj1.Size;
		obj1.Write(binary);			
		
		// 把对象保存到内容中以便上传，貌似此处是可以省略的
		Application(mark + '_zip_file') = obj1;

		return { error: 0 };
	}catch(e){
		return { error: 1, message: e.message };
	}
}

exports.clear = function(mark){
	try{
		Application.Lock();
		Application.Contents.Remove(mark + '_zip_file');
		Application.Contents.Remove(mark + '_zip_central');
		Application.Contents.Remove(mark + '_zip_localDirLength');
		Application.Contents.Remove(mark + '_zip_centralDirLength');
		Application.Contents.Remove(mark + '_zip_zipDataLenght');
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