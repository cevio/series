var jszip = require('jszip');

exports.zip = ZIP;
exports.unZip = UNZIP;
exports.jszip = jszip;


function ZIP(folder, file){
	var zip = new jszip()
		,	content = findParse(folder, zip, folder);
	
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

function findParse(folder, zip, base){
	var schems = fs.readDir(folder);
	var files = schems.file;
	var dirs = schems.dir;
	var _base = path.relative(base, folder) || '';
	
	_.each(files, function(file){
		var _file = path.basename(file);
		var b64 = base64OrBin(fs.readFile(file, {encoding:'buffer'}));
		var pather = _file; 
		zip.file(pather, b64, {base64: true});
	});
	
	_.each(dirs, function(dir){
		dir = String(dir);
		findParse(dir, zip.folder(path.basename(dir)), base);
	});
}

function base64OrBin(obj) {
    var xml = new ActiveXObject('Microsoft.XMLDOM');
    var node = xml.createElement("obj");
    node.dataType = "bin.base64";
    obj = 'string' == typeof obj ? (node.text = obj, node.nodeTypedValue) : (node.nodeTypedValue = obj, node.text);
    node = xml = null;
    return obj;
}