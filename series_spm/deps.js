
var object = fs.readDir(path.resolve(__dirname, '../series_modules'));
var dirs = object.dir;
var jspm = {};

_.each(dirs, function(dir){
	dir = String(dir);
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
		jspm[name] = '/' + jspm[name].replace(/\\/g, '/');
	}
});

module.exports = jspm;