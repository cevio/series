(function(S){
	/*
	 * make wraper
	 */
	var _ = this._, 
		Layer = S.Layer,
		middleware = S.middleware,
		stack = [],
		routes = {},
		Route = {},
		methods = {};
	
	S.Route = Route;
	S.RouteMethods = methods;
		
	_.each(S.methods, function(method){
		methods[method] = function(){
			var router = {},
				app = S.express(),
				pather = arguments[0],
				callback = arguments[arguments.length - 1],
				midware = _.flatten(Array.prototype.slice.call(arguments, 1, -1)),
				ware = new middleware(app),
				layer = new Layer(pather, { 
					sensitive: app.get('sensitive'), 
					strict: app.get('strict'), 
					end: true 
				}, callback);
			
			if ( !_.isArray(routes[method]) ){
				routes[method] = [];
			};
			
			_.each(midware, function(fn){ ware.use(fn); });
			
			router.path = pather;
			router.method = method;
			router.middleware = ware;
			router.layer = layer;
			router.keys = layer.keys;
			router.callback = layer.handle;
			router.regexp = layer.regexp;
			
			routes[method].push(router);
		}
	});
	
	Route.find = function(pather, method){
		if ( S.methods.indexOf(method) > -1 ){
			var routers = routes[method],
				_router = null, params = {};
	
			for ( var i = 0 ; i < routers.length ; i++ ){
				var router = routers[i];
				if ( router.layer.match(pather) ){
					_router = router;
					break;
				};
			}
			
			if ( !_.isNull(_router) ){
				return { status: 200, route: _router, params: _router.layer.params };
			}else{
				return { status: 404 };
			}
		}else{
			throw new Error('express router error: HTTP METHOD[' + method + '] IS UNKNOW');
		}
	}
	
	Route.use = function(pather, callback){
		if ( _.isFunction(pather) ){
			callback = pather;
			pather = '/';
		};
		
		if ( _.isString(pather) ){
			pather = S.path.resolve(S.process.cwd(), pather.replace(/\/$/, '') + '/:route*').replace(/\\/g, '/');
		};
		
		callback.name = 'ProcessMiddleWare';
		
		var app = S.express();
		var layer = new Layer(pather, { 
			sensitive: app.get('sensitive'), 
			strict: app.get('strict'), 
			end: false 
		}, callback);
		
		stack.push(layer);
	}
	
	Route.listen = function(pather, req, res){
		var stacks = stack, status = false, boxs = [], app = S.express();
	
		for ( var i = 0 ; i < stacks.length ; i++ ){
			var layer = stacks[i];
			boxs.push(new Promise(function(resolve, reject){
				if ( layer.match(pather) ){
					req.params = layer.params;
					if ( _.isFunction(layer.handle) ){
						try{
							layer.handle.call(app, req, res, resolve, reject);
						}catch(e){
							reject(e);
						};
					}else{
						resolve();
					}
				}else{
					resolve();
				};
			}));
		};
		
		return boxs;
	}

}).call(this, series);