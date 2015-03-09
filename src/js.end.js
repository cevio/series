if ( !_.trim ){
	_.trim = function(str){
		if ( _.isString(str) ){
			return str.trim();
		}else{
			return str;
		}
	}
}