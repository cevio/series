(function(S){
	var _ = this._,
		require = this.require,
		History = this.History;

	var Layout = S.Layout = function(pather, title){
		this.pather = pather;
		this.title = title;
		this.app = S.express();
		this.setup();
	};
	
	Layout.prototype.setup = function(){
		var req = new S.request(),
			res = new S.response();
			
		req._query(this.pather);
		var hashs = this.pather.split('#');
		req.hash = hashs.length > 1 ? hashs[1] : '';
		req.host = window.location.host + '';
		req.url = S.path.resolve(S.process.cwd(), this.pather).replace(/\\/g, '/');
		req.port = window.location.port + '';
		req.protocol = window.location.protocol + '';
		req.path = req.url;
		
		this.req = req;
		this.res = res;
	};
	
	Layout.prototype.getHTML = function(selector){
		var that = this;
		return new Promise(function(resolve, reject){
			S.ajax({
				url: selector,
				dataType: 'html',
				success: function(html){ resolve(html); },
				error: function(e){ reject(e); }
			});
		});
	};
	
	Layout.prototype.render = function(selector, dataSorce, options){
		var app = S.express();
		var ext = app.get('render engine ext');
		var that = this, html, data;
		var element = document.getElementById(app.get('replace elemnt'));

		if ( !options ){ options = {}; };
		
		this.getHTML(S.path.resolve(S.path.dirname(app.path), selector) + '.' + ext)
			.then(function(h){
				html = h;
				return that.getScriptor(S.path.resolve(S.path.dirname(app.path), dataSorce));
			})
			.then(function(d){
				data = d;
				element.innerHTML = html;
				element.style.display = 'none';
			})
			.then(function(){	
				return new Promise(function(resolve, reject){
					if ( data.worksion === 'Series.Class' ){ 
						new data(element, that.req, that.res, resolve, reject); 
					}
					else if ( _.isFunction(data) ){ 
						data.call(element, that.req, that.res, resolve, reject);
					};
				});
			})
			.then(function(locals){
				var 
					pather = app.get('replace elemnt'),
					callback = function(err, shtml){ 
						element.innerHTML = shtml;
					};
				
				var localsData = _.extend(locals, app.locals);
				options.locals = localsData;
				var cache = options.cache || app.get('view cache');
				var engine = app.get('render engine');

				engine.call(engine, pather, options, callback);
			})
			.then(function(){
				var animates = app.get('in animate');
				if ( animates ){
					return new Promise(function(resolve, reject){
						animates.call(element, resolve, reject);
					});
				}else{
					element.style.display = 'block';
				}
			})
			.then(function(){
				_.isFunction(element.onload) && element.onload.call(element);
			});
	};
	
	Layout.prototype.getScriptor = function(selector){
		var that = this;
		return new Promise(function(resolve, reject){ require([selector], function(source){ resolve(source);}); });
	};
	
	Layout.prototype.listen = function(){
		if ( this.app.enabled('use history') ){
			History.pushState({path: this.req.path}, this.title, this.pather);
		};
		
	};

}).call(this, series);