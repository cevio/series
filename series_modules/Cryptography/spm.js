var Crypt = require('Cryptography');

function main(method, args){
	try {
		var func = Crypt[method];
		var value = '';
		
		if ( method === 'base64' ) {
			func = func[args[0]];
			value = func(args[1]);
		}else{
			value = func(args[0]);
		}
		return ['success', value];
	}catch(e){
		return ['error', e.message];
	}
};

var list = [];				// 方法列表
for (var f in Crypt) {
	list.push(f);
};

_.each(list, function(method){
	exports[method] = function(){
		return main(method, Array.prototype.slice.call(arguments, 0) || []);
	}
});