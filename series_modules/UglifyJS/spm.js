// JavaScript Document

var UglifyJS = require('UglifyJS');

exports.parse = function(pather){
	try{
		var content = UglifyJS(fs.readFile(pather));
		return ['success', html_escape(JSON.format(content))];
	}catch(e){
		return ['error', e.message];
	}
}

exports.compress = function(from, to){
	var parser = exports.parse(from);
	if ( parser.error === 0 ){
		fs.writeFile(to, parser.code);
		return ['success', 'UglifyJS compress done!'];
	}else{
		return ['error', parser.message];
	}
}

function html_escape(code){
	return String(code)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/'/g, '&#39;')
				.replace(/"/g, '&quot;');
};