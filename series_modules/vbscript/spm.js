var vb = require('vbscript');

function main(method, args){
	try {
		var func = vb[method];
		var value = '';
		
		if ( funcWith0Args.indexOf(method) > -1 ) {
			value = func();
		} else
		if ( funcWith2Args.indexOf(method) > -1 ) {
			value = func(args[0], args[1]);
		}else
		if ( funcWith3Args.indexOf(method) > -1 ) {
			value = func(args[0], args[1], args[2]);
		}else
		if ( funcWith4Args.indexOf(method) > -1 ) {
			value = func(args[0], args[1], args[2], args[3]);
		}else
		if ( funcWith5Args.indexOf(method) > -1 ) {
			value = func(args[0], args[1], args[2], args[3], args[4]);
		}else{
			value = func(args[0]);
		}
		return ['success', value];
	}catch(e){
		return ['error', e.message];
	}
};

var list = [];				// 方法列表
for (var f in vb) {
	list.push(f);
};

_.each(list, function(method){
	exports[method] = function(){
		return main(method, Array.prototype.slice.call(arguments, 0) || []);
	}
});

var funcWith0Args = ['Date','GetLocale'];
var funcWith2Args = ['InStr','InStrB','Left','LeftB','Right','RightB','String','Filter','FormatDateTime','FormatNumber','FormatPercent','Join'];
var funcWith3Args = ['Mid','MidB','DateAdd','DateSerial', ];
var funcWith4Args = ['DatePart'];
var funcWith5Args = ['DateDiff'];