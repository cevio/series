var res = module.exports = new Global.watcher();
	
res.buffers = [];
res.handles = [];
res._jsons = {};

res.get = function(key){
	return process.env[key];
}

res.set = function(key, value){
	var that = this;
	if ( !value ){
		_.each(key, function(b, a){
			that.set(a, b);
		});
	}else{
		Response.AddHeader(key, value);
	}
	return this;
};

res.charset = function(charset){
	Response.Charset = charset;
};

res.log = function(){
	res.buffers.push(Array.prototype.slice.call(arguments, 0).join(''));
};

res.json = function(data){
	res._jsons = _.extend(res._jsons, data);
};

res.clear = function(){
	res.buffers = [];
};

res.end = function(callback){
	var str;
	if ( _.isFunction(callback) ){
		callback.call(this, this.buffers);
	}
	else if ( _.isString(callback) ){
		this.log(callback);
	}
	else if ( _.isObject(callback) ){
		this.json(callback);
	}
	else{
		str = this.buffers.join('');
		if ( res.handles.length > 0 ){
			_.each(res.handles, function(fn){
				if ( _.isFunction(fn) ){
					var _str = fn(res.req, res);
					if ( _str ) str = _str;
				}
			});
		}
		if ( !str ){
			str = JSON.stringify(res._jsons);
		}
	};
	str && str.length > 0 && console.log(str);
}