;(function(S){
	var _ = this._, 
		methods = S.methods, 
		History = this.History, 
		Layout = S.Layout,
		Route = S.Route,
		State = History.getState(),
		app = {};
	
	var debug = {
		dev: S.process.env.SERIES_ENV === 'development'
	};
	
	var _req_ = new S.request();
	
	app.install = false;
	app.installURI = null;
	app.location = _.clone(window.location);
	app.path = S.process.cwd();
	
	/**  
	 * @description 事件绑定，兼容各浏览器  
	 * @param target 事件触发对象   
	 * @param type   事件  
	 * @param func   事件处理函数  
	 */  
	function addEvents(target, type, func) {  
		if (target.addEventListener){    //非ie 和ie9  
			target.addEventListener(type, func, false);  
		}else if (target.attachEvent){   //ie6到ie8  
			target.attachEvent("on" + type, func);  
		}else{ target["on" + type] = func;}   //ie5  
	};
	
	var getLocationDomain = app.getLocationDomain = function(){
		if ( window.location.origin ){
			return window.location.origin;
		}else{
			var local = window.location;
			return local.protocol + '//' + local.hostname;
		}
	}
	
	var Entrust = function(parentNode, eventType, callback){
		addEvents(parentNode, eventType, function(ev){
			var e = ev || window.event;  
			var Target = e.srcElement || e.target;
			
			if ( Target.tagName.toLowerCase() === 'a' ){
				_.isFunction(callback) && callback.call(Target, e);
			};
		});
	}
	
	var appSettings = {
		"replace elemnt": 'wrap',
		"in animate": null,
		"env": S.process.env.SERIES_ENV,
		"use history": true,
		"case sensitive routing": false,
		"strict routing": false,
		"view cache": debug.dev ? false : true,
		"view engine": "ojs",
		"views": '/views',
		"render engine": null,
		"render engine ext": 'ojs'
	};
	
	app.locals = function(key, value){
		var that = this;
		if ( !value ){
			_.each(key, function(b, a){
				that.locals[a] = b;
			});
		}else{
			that.locals[key] = value;
		}
	};
	
	app.set = function(name, value){
		appSettings[name] = value;
		return this;
	};
	
	app.get = function(){
		if ( arguments.length === 1 ){
			return appSettings[arguments[0]];
		}else{
			S.RouteMethods.get.apply(S.RouteMethods, arguments);
		}
	};
	
	app.version = '1.0.155';
	app.enable = function(name){ return this.set(name, true); };
	app.disable = function(name){ return this.set(name, false); };
	app.enabled = function(name){ return !!this.get(name); };
	app.disabled = function(name){ return !this.get(name); };
	
	app.engine = function(ext, callback){
		this.set('render engine', callback);
		this.set('render engine ext', ext);
	};
	
	app.use = function(){
		Route.use.apply(Route, arguments);
		return this;
	};
	
	app.listenState = function(){
		var that = this;
		History.Adapter.bind(window, 'statechange', function(){
			var State = History.getState();
			if ( State && State.url ){
				var href = State.url;
				var sp = href.split('/');

				if ( /^http|https/i.test(href) ){
					if (sp.slice(0, 3).join('/').toLowerCase() === getLocationDomain().toLowerCase() ){
						that.createUIView(S.path.resolve(that.path, '/' + href.split('/').slice(3).join('/')).replace(/\\/g, '/'));
					}else{
						window.location.href = href;
					}
				}else{
					that.createUIView(S.path.resolve(that.path, href));
				}
			}
		});
	};
	
	app.createWindow = function(href, title){
		if ( this.enabled('use history') ){
			History.pushState({url: href, title: title}, title, href);
		}else{
			this.createUIView(href);
		}
	};
	
	app.resolveWindow = function(href, title, callback){
		var sp = href.split('/');
		title = document.title || '';
		
		if ( /^http|https/i.test(href) ){
			var _href = S.path.resolve(this.path, '/' + href.split('/').slice(3).join('/')).replace(/\\/g, '/');	
			if ( sp.slice(0, 3).join('/').toLowerCase() === this.getLocationDomain().toLowerCase() ){ this.createWindow(_href, title); };
		}else{
			this.createWindow(href, title);
		}
	}
	
	app.resolveAchors = function(){
		var that = this;
		addEvents(document.getElementById(this.get('replace elemnt')), 'click', function(ev){
			var e = ev || window.event;  
			var Target = e.srcElement || e.target;

			if ( Target.tagName.toLowerCase() === 'a' ){
				var href = Target.href;
				var sp = href.split('/');
				title = document.title || '';
				
				if ( /^http|https/i.test(href) ){
					var _href = S.path.resolve(that.path, '/' + href.split('/').slice(3).join('/')).replace(/\\/g, '/');
						
					if (sp.slice(0, 3).join('/').toLowerCase() === getLocationDomain().toLowerCase() ){
						if ( e && e.preventDefault ){
							e.preventDefault();
							that.createWindow(_href, title);
						}else{
							window.event.returnValue = false;
							that.createWindow(_href, title);
							return false;
						};
					}
				}else{
					if ( e && e.preventDefault ){
						e.preventDefault();
						that.createWindow(href, title);
					}else{
						window.event.returnValue = false;
						that.createWindow(href, title);
						return false;
					}
				}
			};
		});
	};
	
	app.createUIView = function(href, title){
		var layout = new Layout(href, title);
		var req = layout.req;
		var res = layout.res;
		var that = this;
		Promise.all(Route.listen(href, req, res)).then(function(){
			var uri = Route.find(href, 'get');
			if ( uri.status === 200 ){
				req.params = uri.params;
				Promise.all(uri.route.middleware.parse(req, res)).then(function(){

					app.location = req;
					app.path = req.path;
					
					_.isFunction && uri.route.layer.handle.call(layout, req, res, layout);
				})['catch'](function(e){
					throw new Error('Series Web Application Error On Express.CreateUIView: ' + e.message);
				});
			}else{
				window.location.href = href;
			}
		})['catch'](function(e){
			throw new Error('Series Web Application Error On Express.CreateUIView: ' + e.message);
		});
	};
	
	app.listen = function(){
		if ( !this.get('render engine') ){
			throw new Error('express error: need template engine.');
		}else{
			if ( this.enabled('use history') ){ this.listenState(); };
			this.resolveAchors();
			if ( this.installURI ){ this.createWindow(this.installURI, document.title); }
		}
	};
	
	
	S.express = function(href){
		if (!app.install && href) app.installURI = S.path.resolve(app.path, href).replace(/\\/g, '/');
		if (_req_.query['_suid'] && !app.install){
			var querys = _req_.hash.replace(/^\#/, '').split('?'),
			uri = querys[0] + '';
			querys = querys.length > 1 ? querys[1] : null;
			app.installURI = S.path.resolve(app.path, uri).replace(/\\/g, '/');
			app.installURI += querys ? '?' + querys + '&_in=ready' : '?_in=ready';
			app.install = true;
		};
		return app; 
	};

	
}).call(this, series);