var module = lunar = require('lunar');

function main(method, args){
	try {
		// 如果参数前面加~，则将参数自动转为公历日期
		for (var i=0; i<args.length; i++) {
			if ( /^~/.test(args[i]) ) {
				var days = args[i].replace('~', '').split('-');
				args[i] = new Date(days[0], days[1], days[2]);
			}
		}
		
		// 如果参数前面加，则将参数自动转为农历日期
		for (var i=0; i<args.length; i++) {
			if ( /^@/.test(args[i]) ) {
				var days = args[i].replace('@', '').split('-');
				args[i] = new Date(days[0], days[1], days[2]);
				args[i] = lunar.solarToLunar(args[i]);
			}
		}
		
		var func = module[method];
		var value = '';
		
		value = func.apply(this, args);
		
		// 如果返回农历对象，则直接format以显示
		if (method === 'solarToLunar') {
			value = lunar.format(value, 'YMD');
		}
		return ['success', value];
	}catch(e){
		return ['error', e.message];
	}
};

var list = [];				// 方法列表
for (var f in module) {
	list.push(f);
};

_.each(list, function(method){
	exports[method] = function(){
		return main(method, Array.prototype.slice.call(arguments, 0) || []);
	}
});