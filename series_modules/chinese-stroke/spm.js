exports.get = function(input){
	try{
		var stroke = require('chinese-stroke');
		var value = stroke.get(input);
		return ['success', value];
	}catch(e){
		return ['error', e.message];
	}
}