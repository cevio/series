var jszip = require('jszip');

exports.zip = ZIP;
exports.unZip = UNZIP;
exports.jszip = jszip;

function ZIP(folder, file){
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
	fs.writeFile(file, base64OrBin(content));
}

function UNZIP(file, folder){
	var data = base64OrBin(fs.readFile(file, {encoding:'buffer'}));
	var zip = new jszip();
	zip.load(data, {base64: true});
	var fds = zip.folder(/.+/);
	var fls = zip.file(/.+/);
	
	// 创建文件夹
	fs.mkdir(folder);	// 解包根目录
	_.each(fds, function(fd){
		fs.mkdir(path.resolve(folder, fd.name));
	});
	
	// 读取并创建文件
	_.each(fls, function(fl){
		var content = zip.file(fl.name).asBase64();
			content = base64OrBin(content);
		fs.writeFile(path.resolve(folder, fl.name), content);	
	});
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