var module = yaml = require('js-yaml');

function main(method, args){
	try {
		// 处理文件读取
		if ( args[0] === '-f' ) {
			args[1] = path.extname(args[1]) == '.yml' ? args[1] : args[1] + '.yml';
			args[1] = path.resolve(__dirname, args[1]);
			args[1] = fs.readFile(args[1]);
			
			args = Array.prototype.slice.call(args, 1) || [];
		}
		
		var func = module[method];
		var value = '';
		
		value = func.apply(this, args);
		
		if ( _.isObject(value) ) {
			value = JSON.format(value);
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