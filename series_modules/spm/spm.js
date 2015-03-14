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
		var content = '';
		_.each(configs.compressor.smo, function(compressor){
			content += '\n\n' + '// Grunt From /src/' + compressor + '\n' + fs.readFile(path.resolve(__dirname, '../../src/' + compressor)) + '\n';
		});
		var dist = UglifyJS(content);
		
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
	return { error: 0, chunks: ['- % delete file [' + pather + '] success!'] };
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
	
	return { error: 0, jspm: jspm, chunks: [add ? '<font color="#069">- % [' + name + '] been add to global package libary.</font>' : '<font color="#069">- % no more [' + name + '] need been add.</font>'] };
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
		return { error: 0, chunks: ['<font color="green">- # input user success!</font>'] };
	}catch(e){
		return { error: 1, message: 'input user info catch error.' };
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
		chunks.push('<pre>  * appid: ' + username + '</pre>');
		chunks.push('<pre>  * appkey: ' + data.data.publickey + '</pre>');
		chunks.push('<pre>  * please use "spm user appid appkey" to set appid and appkey. </pre>');
		return { error: 0, chunks: chunks };
	}else{
		return data;
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
		var chunks = [];
		chunks.push('- # user [' + username + '] has been removed from server.');
		return { error: 0, chunks: chunks };
	}else{
		return data;
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
		chunks.push('<pre>  * User Name: ' + configs.appid + '</pre>');
	}
	
	if ( configs.appkey ){
		chunks.push('<pre>  * Public Key: ' + configs.appkey + '</pre>');
	}
	
	if ( !chunks.length ){
		chunks.push('<font color="red">- # no more user information. please add!</font>');
	}
	
	return { error: 0, chunks: chunks };
}

exports.post = function(mark){
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
}

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