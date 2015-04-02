// JavaScript Document
var Ajax = require('ajax');
var ajax = new Ajax();
var slice = Array.prototype.slice;

function main(method, argvs, callback){
	try{
		if ( argvs.length === 0 ){
			return ['error', 'arguments needed.'];
		}else{
			var url = argvs[0];
			var arg = [], z = {};
			
			if ( argvs.length > 1 ){
				arg = slice.call(argvs, 1);
			}
			
			_.each(arg, function(_arg){
				var _arg_ = _arg.split(':');
				z[_arg_[0]] = _arg_[1];
			});
			
			var html = ajax[method].call(ajax, url, z);
			
			if ( _.isFunction(callback) ){
				html = callback(html);
			}
			
			return ['success', html];
		}
	}catch(e){
		return ['error', 'ajax ' + method + ' catch error.' + e.message];
	}
}

var list = {
	get: { parse: html_escape },
	getJSON: { parse: function(code){ return '<pre>' + html_escape(JSON.format(code)) + '</pre>'; } },
	post: { parse: html_escape },
	postJSON: { parse: function(code){ return '<pre>' + html_escape(JSON.format(code)) + '</pre>'; } },
	getScript: { parse: function(code){ return '<pre>' + html_escape(JSON.format(code)) + '</pre>'; } },
	postScript: { parse: function(code){ return '<pre>' + html_escape(JSON.format(code)) + '</pre>'; } }
};

_.each(list, function(value, method){
	exports[method] = function(){
		return main(method, slice.call(arguments, 0) || [], value.parse);
	}
});

function html_escape(code){
	return String(code)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/'/g, '&#39;')
				.replace(/"/g, '&quot;');
};