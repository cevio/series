var spmRunpix = '../../series_spm';
var spmRunner = path.resolve(__dirname, spmRunpix);
var web = 'http://api.webkits.cn';

/*
 *	@ url http://...
 *	@ pather ../series_module/folder
 */
exports.downzip = function(url, pather){
	try{
		var filestream = require('filestream');
		pather = path.resolve(spmRunner, pather);
		filestream.download(url, pather + '.zip');
		if ( !fs.exist(pather) ){ fs.mkdir(pather); };
		var zip = require('zip');
		zip.unZip(pather + '.zip', pather);
		fs.unlink(pather + '.zip');
		
		var chunks = ['- % download zip success: ' + pather + '.zip'];
		var files = findDir(pather);
		for ( var i = 0 ; i < files.length ; i++ ){
			chunks.push('<pre>    <font color="#555">- % ' + files[i] + '</font></pre>');
		}
	
		return { error: 0, chunks: chunks };
	}catch(e){
		return { error: 1, message: '- # download zip file from ' + url + ' fail.' };
	}
}

exports.compress = function(pather, target, basename){
	try{
		if ( /^\./.test(pather) || /\//.test(pather) ){
			pather = path.resolve(spmRunner, pather);
		}else{
			pather = require.resolve(pather);
		};
		target = path.resolve(spmRunner, target);
		
		if ( fs.exist(pather) ){
			var compress = require('compressor');
			basename = basename ? basename : path.basename(pather, '.js');
			var content = compress(pather, basename);
			fs.writeFile(target, content);
			return { error: 0, chunks: ['- @ compress file [' + target + '] success.'] };
		}else{
			return { error: 1, message: 'can not find the file which is compressing!'};
		}
	}catch(e){
		return { error: 1, message: 'sorry, compressor catch error!' + e.message};
	}
}

exports.grunt = function(){
	try{
		var which = ['series.js']
			,	pathers = []
			,	distPather;
			
		var UglifyJS = require('UglifyJS');
		
		_.each(which, function(that){
			var thatModule = require('../../src/' + that),
				content = '';
				
			_.each(thatModule.compressor, function(compressor){
				content += '\n\n' + '// Grunt From /src/' + compressor + '\n' + fs.readFile(path.resolve(__dirname, '../../src/' + compressor)) + '\n';
			});
			
			var dist = UglifyJS(content);
			
			var sourcecontent = thatModule.open + '\n' + content + '\n' + thatModule.close;
			var distcontent = thatModule.open + '\n' + dist + '\n' + thatModule.close;
			
			var sourcefile = path.resolve(__dirname, '../../dist/' + thatModule.source);
			var distfile = path.resolve(__dirname, '../../dist/' + thatModule.dist);
			
			fs.writeFile(sourcefile, sourcecontent);
			fs.writeFile(distfile, distcontent);
			
			distPather = distfile;
			pathers.push(distfile);
		});
		
		var chunks = [];
		_.each(pathers, function(pather){
			chunks.push('<pre><font color="#555">  @ ' + pather + '</font></pre>');
		});
		
		chunks.push('<font color="#069">- # grunt [' + distPather + '] success!</font>');
	
		return { error: 0, chunks: chunks };
	}catch(e){
		return { error: 1, message: 'sorry, grunt file catch error![' + e.message + ']'};
	}
}

exports.gruntfiles = function(){
	var configs = require('../../src/series.js');
	return { error: 0, msg: configs };
}

exports.gruntsys = function(){
	try{
		var configs = require('../../src/series.js');
		var UglifyJS = require('UglifyJS');
		var content = [];
		_.each(configs.compressor.sys, function(compressor){
			content.push(UglifyJS('// Grunt From /src/' + compressor + '\n' + fs.readFile(path.resolve(__dirname, '../../src/' + compressor))));
		});
		
		fs.writeFile(path.resolve(__dirname, '../../dist/series.sys.js'), content.join(';'));
		return { error: 0 }
	}catch(e){
		return { error: 1, message: e.message };
	}
}

exports.gruntsmo = function(){
	try{
		var configs = require('../../src/series.js');
		var UglifyJS = require('UglifyJS');
		var content = [];
		_.each(configs.compressor.smo, function(compressor){
			content.push(UglifyJS('// Grunt From /src/' + compressor + '\n' + fs.readFile(path.resolve(__dirname, '../../src/' + compressor))));
		});
		var dist = content.join(';');
		
		fs.writeFile(path.resolve(__dirname, '../../dist/series.smo.js'), dist);
		return { error: 0 }
	}catch(e){
		return { error: 1, message: e.message };
	}
}

exports.wrap = function(){
	try{
		var configs = require('../../src/series.js');
		var UglifyJS = require('UglifyJS');

		var head = UglifyJS( fs.readFile(path.resolve(__dirname, '../../src/' + configs.compressor.head)) );
		var foot = UglifyJS( fs.readFile(path.resolve(__dirname, '../../src/' + configs.compressor.foot)) );
		
		fs.writeFile(path.resolve(__dirname, '../../dist/series.head.js'), head);
		fs.writeFile(path.resolve(__dirname, '../../dist/series.foot.js'), foot);
		
		return { error: 0 }
	}catch(e){
		return { error: 1, message: e.message };
	}
}

exports.packin = function(){
	try{
		var configs = require('../../src/series.js');
		var sys = fs.readFile(path.resolve(__dirname, '../../dist/series.sys.js'));
		var smo = fs.readFile(path.resolve(__dirname, '../../dist/series.smo.js'));
		var head = fs.readFile(path.resolve(__dirname, '../../dist/series.head.js'));
		var foot = fs.readFile(path.resolve(__dirname, '../../dist/series.foot.js'));
		var wrap = configs.wrap;
		var html = configs.open + ([head, wrap.replace('<#dist#>', [sys, smo].join(';')), foot].join(';')) + configs.close;
		var distfile = path.resolve(__dirname, '../../dist/' + configs.dist);
		fs.writeFile(distfile, html);
		return { error: 0 };
	}catch(e){ return { error: 1, message: e.message }; }
}

exports.unlink = function(pather){
	pather = path.resolve(spmRunner, pather);
	fs.unlink(pather);
	return ['success', 'delete file ' + pather + ' success!'];
}

exports.jspm = function(dir){
	var jspm = {}, add = false;
	dir = path.resolve(spmRunner, dir);
	var name = path.basename(dir);
	var packageFile = path.resolve(dir, 'package.json');

	if ( fs.exist(packageFile) ){
		var configs = require(packageFile);
		if ( configs['jspm'] ){
			var _jspmFile = path.resolve(dir, configs['jspm']);
			if ( fs.exist(_jspmFile) ){
				jspm[name] = path.relative(path.server('/'), _jspmFile);
			}
		}else{
			var __jspmFile = path.resolve(dir, 'jspm.js');
			if ( fs.exist(__jspmFile) ){
				jspm[name] = path.relative(path.server('/'), __jspmFile);
			}
		}
	}else{
		var jspmFile = path.resolve(dir, 'jspm.js');
		if ( fs.exist(jspmFile) ){
			jspm[name] = path.relative(path.server('/'), jspmFile);
		}
	}
	
	if ( jspm[name] ){
		add = true;
		jspm[name] = '/' + jspm[name].replace(/\\/g, '/');
	}
	
	return { jspm: jspm, info: add ? '[' + name + '] been add to global package libary.' : 'no more [' + name + '] need been add.' };
}

function getGloablConfigs(){
	var configFile = path.resolve(__dirname, '../../dist/config.json');
	var configs = {};
	if ( fs.exist(configFile) ){
		configs = require(configFile);
	}
	return { config: configs, file: configFile };
}

exports.user = function(name, publickey){
	try{
		var distMain = getGloablConfigs();
		var configFile = distMain.file;
		var configs = distMain.config;

		configs.appid = name;
		configs.appkey = publickey;
		fs.writeFile(configFile, JSON.stringify(configs));
		return ['success', 'create user success!'];
	}catch(e){
		return ['error', 'input user info catch error from remote server.']
	}
}

exports.adduser = function(username){
	var Ajax = require('ajax');
	var ajax = new Ajax();
	var distMain = getGloablConfigs();
	var configFile = distMain.file;
	var configs = distMain.config;
	var data = ajax.getJSON(web + '/oauth/adduser', {
		username: username,
		appid: configs.appid,
		appkey: configs.appkey
	});
	
	if ( data.error === 0 ){
		var chunks = [];
		chunks.push('appid: ' + username);
		chunks.push('appkey: ' + data.data.publickey);
		chunks.push('please use "spm user appid appkey" to set appid and appkey.');
		return ['list', 'Add user to remote server success', chunks];
	}else{
		return ['error', data.message];
	}
}

exports.rmuser = function(username){
	var Ajax = require('ajax');
	var ajax = new Ajax();
	var distMain = getGloablConfigs();
	var configFile = distMain.file;
	var configs = distMain.config;
	var data = ajax.getJSON(web + '/oauth/rmuser', {
		username: username,
		appid: configs.appid,
		appkey: configs.appkey
	});
	
	if ( data.error === 0 ){
		return ['success', 'user [' + username + '] has been removed from remote server.']
	}else{
		return ['error', data.message];
	}
}

exports.status = function(){
	var configFile = path.resolve(__dirname, '../../dist/config.json');
	var configs = {};
	if ( fs.exist(configFile) ){
		configs = require(configFile);
	}
	var chunks = [];
	
	if ( configs.appid ){
		chunks.push('User Name: ' + configs.appid);
	}
	
	if ( configs.appkey ){
		chunks.push('Public Key: ' + configs.appkey);
	}
	
	if ( !chunks.length ){
		return ['error', 'no more user information. please add!'];
	}else{
		return ['list', 'Local SPM Rights', chunks];
	}
	
}

var BlockSize = 100 * 1024;					// 分块传输大小

// 分块传输文件，暂时未全部修复完毕
exports.postzip = function(modal, zipfile){
	try {
		// 读一读配置文件
		var configs = readConfigs();
				
		if ( !configs.appid || !configs.appkey ){
			return { error: 1, message: 'no rights to post module.' };
		}
		
		var mark = modal + configs.appid + '_zip_file';	// Application标记
		
		zipfile = path.resolve(__dirname, zipfile);
		if (!fs.exist(zipfile)) {
			return { error: 1, message: 'zip file not exist.' };
		}
		
		var obj = new ActiveXObject('Adodb.Stream');
			
			obj.Type = 1;
			obj.Mode = 3;
			obj.Open();
			obj.LoadFromFile(zipfile);
			
		// 把config.json和readme.md给弄进去
		var modulePath = path.resolve(__dirname, '../../series_modules/' + modal);
		if (!fs.exist(modulePath + '/package.json')) {
			return { error: 1, message: 'no package file for this module.' };
		}
		
		var moduleConfig = fs.readFile(modulePath + '/package.json', {encoding: 'buffer'});
		var zipSize = obj.Size;
		obj.Position = obj.Size;
		obj.Write(moduleConfig);
		var configSize = obj.Size - zipSize;
		
		var config = require(modulePath + '/package.json');
		var readme = config.readme || 'readme.md';
		if (!fs.exist(modulePath + '/' + readme)) {
			return { error: 1, message: 'no readme file for this module.' };
		}
		
		var moduleReadme = fs.readFile(modulePath + '/' + readme, {encoding: 'buffer'});
		obj.Position = obj.Size;
		obj.Write(moduleReadme);
		var readmeSize = obj.Size - zipSize - configSize;
		
		// 将文件内容写入Application
		Application.Lock();
		Application.Contents.Remove(mark);
		Application(mark) = obj;
		Application.Unlock();					// 貌似要全部读完再解除锁定?
		
		// 告诉服务器老子要传几次数据
		var total = obj.Size;
		var block = BlockSize;					
		var times = Math.ceil(total / block);
		
		var http = new ActiveXObject('Microsoft.XMLHTTP');
		var msg;
		var url = web + '/post/module?appid=' + configs.appid + '&appkey=' + configs.appkey;	// 先不传数据
			url = url + '&status=begin&modal=' + modal + '&times=' + times;
			url = url + '&config=' + configSize + '&readme=' + readmeSize;
	
		http.open('GET', url, false);
		http.onreadystatechange = function() {
			if (http.readyState === 4) {
				if (http.status === 200){
					msg = JSON.parse(BinaryToString(http.responseBody, 'utf-8'));
				}else{
					msg = { error: http.status, message: 'post module catch status [' + http.status + '] error.' };
				}
			}
		};
		http.send();
		
		// 告诉浏览器老子要传几次数据
		if ( msg.error === 0 ){
			return { error: 0, chunks: ['<font color="green">- # post module ready, you need post ' + times + ' times.</font>'], times: times }
		}else{
			return { error: 1, message: msg.message || 'can not find the error.' };
		}
	}catch(e){
		return { error: 1, message: 'post module catch error.' + e.message };
	}
}

// 每次传10KB，直到传完为止，post与postzip通用
exports.postblock = function(modal, i){
	try {
		// 读一读配置文件
		var configs = readConfigs();
				
		if ( !configs.appid || !configs.appkey ){
			return { error: 1, message: 'no rights to post module.' };
		}
		
		var mark = modal + configs.appid;	// Application标记	
		
		// 翻今晚的牌子啦
		var block = BlockSize;					
		
		var pos = i * block;
		var obj = Application(mark + '_zip_file');
			obj.Position = pos;		
		var num = pos + block < obj.size ? block : obj.size - pos ;	// 该次读取的内容大小
		var bin = obj.Read(num);
		
		// 好啦，把这块内容妥妥地发送给服务器吧	
		var http = new ActiveXObject('Microsoft.XMLHTTP');
		var size = num;		// 发送的数据大小就是这次读取的数据大小啦
		var msg;
		var url = web + '/post/module?appid=' + configs.appid + '&appkey=' + configs.appkey;	// 先不传数据
			url = url + '&status=sends&modal=' + modal + '&times=' + i;

		http.open('POST', url, false);
		http.setRequestHeader('Content-Type', 'multipart/form-data');
		http.setRequestHeader('Content-Length', size);
		http.setRequestHeader('Cache-Control', 'no-cache, must-revalidate');
		http.onreadystatechange = function() {
			if (http.readyState === 4) {
				if (http.status === 200){
					msg = JSON.parse(BinaryToString(http.responseBody, 'utf-8'));
				}else{
					msg = { error: http.status, message: 'post module catch status [' + http.status + '] error.' };
				}
			}
		};
		http.send(bin);
	
		if ( msg.error === 0 ){
			//return { error: 0, chunks: ['<font color="green">- # send data success: block ' + i +'.</font>'] };
			return { error: 0 };
		}else{
			return { error: 1, message: msg.message || 'can not find the error.' };
		}
	}catch(e){
		return { error: 1, message: msg.message || 'send data error: block ' + i };
	}
}

// 传输结束的时候，清理缓存，针对于postzip
exports.postclear = function(modal){
	try {
		// 读一读配置文件
		var configs = readConfigs();
				
		if ( !configs.appid || !configs.appkey ){
			return { error: 1, message: 'no rights to post module.' };
		}
		
		var mark = modal + configs.appid + '_zip_file';	// Application标记

		Application.Lock();
		Application.Contents.Remove(modal);
		Application.Unlock();
		
		return { error: 0, chunks: ['<font color="green">- # post module success, everything is done.</font>'] }
	}catch(e){
		return { error: 1, message: 'clear cache catch error.' + e.message };
	}
}

// 重写post方法，改为分块上传
exports.post = function(modal){
	try {
		// 读一读配置文件
		var configs = readConfigs();
				
		if ( !configs.appid || !configs.appkey ){
			return { error: 1, message: 'no rights to post module.' };
		}
		
		var mark = modal + configs.appid;	// Application标记	
		
		// 把config.json和readme.md给弄进去
		var modulePath = path.resolve(__dirname, '../../series_modules/' + modal);
		if (!fs.exist(modulePath + '/package.json')) {
			return { error: 1, message: 'no package file for this module.' };
		}
		
		var moduleConfig = fs.readFile(modulePath + '/package.json', {encoding: 'buffer'});
		var obj = Application(mark + '_zip_file');
		var zipSize = obj.Size;
		obj.Position = obj.Size;
		obj.Write(moduleConfig);
		var configSize = obj.Size - zipSize;
		
		var config = require(modulePath + '/package.json');
		var readme = config.readme || 'readme.md';
		if (!fs.exist(modulePath + '/' + readme)) {
			return { error: 1, message: 'no readme file for this module.' };
		}
		
		var moduleReadme = fs.readFile(modulePath + '/' + readme, {encoding: 'buffer'});
		obj.Position = obj.Size;
		obj.Write(moduleReadme);
		var readmeSize = obj.Size - zipSize - configSize;
		
		// 告诉服务器老子要传几次数据
		var total = obj.Size;
		var block = 100 * 1024;					// 分块大小为100KB
		var times = Math.ceil(total / block);

		var http = new ActiveXObject('Microsoft.XMLHTTP');
		var msg;
		var url = web + '/post/module?appid=' + configs.appid + '&appkey=' + configs.appkey;
			url = url + '&status=begin&modal=' + modal + '&times=' + times;
			url = url + '&config=' + configSize + '&readme=' + readmeSize;
	
		http.open('GET', url, false);
		http.onreadystatechange = function() {
			if (http.readyState === 4) {
				if (http.status === 200){
					msg = JSON.parse(BinaryToString(http.responseBody, 'utf-8'));
				}else{
					msg = { error: http.status, message: 'post module catch status [' + http.status + '] error.' };
				}
			}
		};
		http.send();
		
		// 告诉浏览器老子要传几次数据
		if ( msg.error === 0 ){
			return { error: 0, chunks: ['<font color="green">- # post module ready, you need post ' + times + ' times.</font>'], times: times }
		}else{
			return { error: 1, message: msg.message || 'can not find the error.' };
		}
	}catch(e){
		return { error: 1, message: 'post module catch error.' + e.message };
	}
}

/*exports.post = function(mark){
	try{
		var configFile = path.resolve(__dirname, '../../dist/config.json');
		var configs = {};
		if ( fs.exist(configFile) ){
			configs = require(configFile);
		}
		
		if ( !configs.appid || !configs.appkey ){
			return { error: 1, message: 'unknow rights to accoss.' };
		}

		var binary = Application(mark);
		var http = new ActiveXObject("Microsoft.XMLHTTP");
		var size = getBinarySize(binary);
		var msg;
		var url = web + '/post/module?appid=' + configs.appid + '&appkey=' + configs.appkey;
		if ( size === 0 ){
			return { error: 1, message: 'package can not be empty.' };
		}
		http.open('POST', url, false);
		http.setRequestHeader("Content-Type", 'multipart/form-data');
		http.setRequestHeader("Content-Length", size);
		http.setRequestHeader("Cache-Control", "no-cache, must-revalidate");
		http.onreadystatechange = function() {
			if (http.readyState === 4) {
				if (http.status === 200){
					msg = JSON.parse(BinaryToString(http.responseBody, 'utf-8'));
				}else{
					msg = { error: http.status, message: 'post module catch status [' + http.status + '] error.' };
				}
			}
		};
		http.send(binary);
		
		if ( msg.error === 0 ){
			return { error: 0, chunks: ['<font color="green">- # post module done, then start to clear application.</font>'] }
		}else{
			return { error: 1, message: msg.message || 'can not find the error.' };
		}

	}catch(e){
		return { error: 1, message: 'post module catch error.' + e.message };
	}
}*/

function ZIP(folder, err){
	var d = path.resolve(folder, 'package.json');
	if ( !fs.exist(d) ){
		err.message = 'the module miss package.json';
		return;
	}
	
	var configs = require(d);
	var readme = configs.readme;
	
	if ( !readme || !fs.exist(path.resolve(folder, readme)) ){
		err.message = 'the module miss readme.md';
		return;
	}
	
	if ( !configs.author ){
		err.message = 'the module miss author';
		return;
	}
	
	// 遍历文件夹
	var files = [], folders = [];
	var findFiles = function(fldr){
		var schems = fs.readDir(fldr);
		var fls = schems.file;
		var fds = schems.dir;
		
		if ( fls.length === 0 ) {
			folders.push(fldr);
		}else{
			_.each(fls, function(fl){
				files.push(String(fl));
			});
		}
		
		_.each(fds, function(fd){
			findFiles(String(fd));
		});
	}
	
	findFiles(folder);
	
	var jszip = require('zip').jszip;
	// 将空文件夹压入zip
	var zip = new jszip(), relative;
	_.each(folders, function(fd){
		relative = path.relative(folder, fd);
		zip.folder(relative);
	});
	
	// 将文件内容压入zip
	_.each(files, function(fl){
		relative = path.relative(folder, fl);
		zip.file(relative, BinToBuffer(fs.readFile(fl, {encoding:'buffer'})));
	});
	
	// 保存zip文件
	var content = zip.generate({type:"base64"});
	return base64OrBin(content);
}

function BinaryToString(text, charset){
	var obj = new ActiveXObject("Adodb.Stream"), 
		ret;
		obj.Type = 1;
		obj.Mode = 3;
		obj.Open;
		obj.Write(text);
		obj.Position = 0;
		obj.Type = 2;
		obj.Charset = charset;
		ret = obj.ReadText;
		obj.Close;

	return ret;
}

function getBinarySize(binary){
	var obj = new ActiveXObject("Adodb.Stream")
		,	size = 0;
		
		obj.Type = 1;
		obj.Mode = 3;
		obj.Open;
		obj.Write(binary);
		size = obj.Size;
		obj.Close;

	return size;
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

// 读一读配置文件
function readConfigs(){
	var configFile = path.resolve(__dirname, '../../dist/config.json');
	var configs = {};
	if ( fs.exist(configFile) ){
		configs = require(configFile);
	}
	
	return configs;
}
