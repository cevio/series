// JavaScript Document
var url = require('url');
var map = {};
var remote = module.exports = function(pather, content){
	
	if ( map[pather] ){
		return map[pather];
	}
	
	var methods = ['exports', 'require', 'module', '__filename', '__dirname'];
	var wrapper = ['return function (' + methods.join(',') + '){', content, '};'].join("\n");
	
	var bag = (new Function(wrapper))();
	var series = new service(pather);
	var exports = series.exports = {};
	var _require = series.require.bind(series);
	var dirname = pather.replace(/#.+/, '').replace(/\?.+/, '').split('/').slice(-1).join('/');
	_require.resolve = series.resolve.bind(series);
	
	bag(exports, _require, series, pather, dirname);
	map[pather] = series.exports;
	
	return map[pather];
}

var service = function(urlname){
	this.filename = urlname;
	this.exports = null;
}

service.prototype.resolve = function(pather){
	return url.resolve(this.filename, pather);
}

service.prototype.require = function(pather){
	var urlpather = this.resolve(pather);
	if ( map[urlpather] ){
		return map[urlpather];
	}
	var http = require(__dirname);
	var content = http.get(urlpather);
	return remote(urlpather, content);
}