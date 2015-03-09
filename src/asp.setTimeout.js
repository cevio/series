if ( typeof setTimeout === 'undefined' ){
	var setTimeout = function(cb){
		if ( typeof cb === 'function' ){
			return cb();
		}else{
			return eval(cb);
		}
	}
	this.setTimeout = setTimeout;
};