// JavaScript Document

var UglifyJS = require('UglifyJS');

exports.parse = function(pather){
	try{
		var content = UglifyJS(fs.readFile(pather));
		return { error: 0, chunks: ['<div class="margin-left: 15px;">' + html_escape(JSON.format(content)) + '</div>'], code: content };
	}catch(e){
		return { error: 1, message: e.message };
	}
}

exports.compress = function(from, to){
	var parser = exports.parse(from);
	if ( parser.error === 0 ){
		fs.writeFile(to, parser.code);
		return { error: 0, chunks: ['<font color="green">- # UglifyJS compress done!</font>'] };
	}else{
		return parser;
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