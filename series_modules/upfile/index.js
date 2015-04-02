var main = require('./lib');

var filePost = exports = module.exports = function(options){
	var files = new main(options)
		,	result = files.result
		,	pool = files.pool;
		
	var ret = { result: result };
	
	if ( pool.length > 0 ){
		ret.pool = pool;
	}
		
	return ret;
}

exports.fileParse = function(options){
	
	if ( _.isFunction(options) ) options = { callback: options };
	if ( _.isString(options) ) options = { folder: options };	
	if ( _.isNumber(options) ) options = { speed: options };
	
	return function(req, res, next){
		req.files = req.files || {};
		req._files = req._files || {};
		var ret = filePost(options), pather;
		if ( options.folder ){
			_.each(ret.result, function(value, key){
				if ( !_.isArray(value) ) value = [value];
				if ( !req.files[key] || !_.isArray(req.files[key]) ){
					req.files[key] = [];
				}
				_.each(value, function(v){
					if ( v.filename ){
						pather = path.resolve(options.folder, value.filename);
						fs.writeFile(pather, value.binary);
						delete v.binary;
						v.pather = pather;
					}
					req.files[key].push(v);
				});
				if ( req.files[key].length < 2 ) req.files[key] = req.files[key][0];
			});
			if ( ret.pool ){
				var ps = [];
				_.each(ret.pool, function(p){
					if ( p.filename ){
						pather = path.resolve(options.folder, p.filename);
						fs.writeFile(pather, value.binary);
						delete p.binary;
						p.pather = pather;
					}
					req._files.push(v);
				});
			}
		}
		else{
			req.files = ret.result;
			req._files = ret.pool;
		}
		
		next();
	}
}