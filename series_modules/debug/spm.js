var debug = require('debug');
exports.run = function(){
	var runners = debug.log();
	if ( runners.length > 0 ){
		debug.clear();
		return runners;
	}else{
		return [];
	}
}