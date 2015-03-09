(function(S){
	var _ = this._;
	var middleware = S.middleware = new Class(function(context){ this.context = context ? context : this;});
	
	middleware.property('routes', []);
	middleware.define('use', function(callback){
		this['private']('routes').push(callback);
		return this;
	});
	middleware.define('parse', function(req, res){
		var routes = this['private']('routes');
		var boxs = [], that = this;
		_.each(routes, function(){
			boxs.push(new Promise(function(resolve, reject){
				_.isFunction(routes[i]) && routes[i].call(that.context, req, res, resolve, reject);
			}));
		});
		return boxs;
	});	
}).call(this, series);