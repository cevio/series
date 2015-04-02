// JavaScript Document
var css = require('sqwish');
exports.minify = function(from){
	var value = css.minify(fs.readFile(from), true);
	return ['success', value];
}

exports.save = function(from, to){
	var value = css.minify(fs.readFile(from), true);
	fs.writeFile(to, value);
	return ['success', 'compress css save file to ' + to];
}