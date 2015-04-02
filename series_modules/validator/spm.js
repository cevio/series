var valid = require('validator');

function main(method, args){
	try {
		var func = valid[method];
		var value = '';
		
		value = func.apply(this, args);
		return ['success', value];
	}catch(e){
		return ['error', e.message];
	}
};

var list = [];				// 方法列表
for (var f in valid) {
	list.push(f);
};

_.each(list, function(method){
	exports[method] = function(){
		return main(method, Array.prototype.slice.call(arguments, 0) || []);
	}
});