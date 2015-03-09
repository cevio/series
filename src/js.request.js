;(function(s){
	var request = s.request = function(){
		this._init();
	};
	
	request.prototype.query = {};
	request.prototype._query = function(locations){
		var req = (locations || window.location.href).split('?');
		if ( req.length === 2 ){ 
			var str = req[1];
			if ( /^\&/.test(str) ){
				str = str.replace(/^\&/, '');
			}
			req = _.fromQuery(str); 
		}
		else{ req = {}; };
		this.query = req;
	};
	
	request.prototype.redirect = function(url){
		window.location.href = url;
	};
	
	request.prototype._cookies = function(cookie){
		if ( cookie ){
			this.cookies = _.fromQuery($.cookie(cookie))
		}else{
			_.each($.cookie(), function(value, key){
				if ( value.indexOf('&') > -1 ){
					req.cookies[key] = _.fromQuery(value);
				}else{
					req.cookies[key] = value;
				};
			});
		};
		next();
	};

	request.prototype._init = function(){
		this.hash 		= window.location.hash + '';
		this.host 		= window.location.host + '';
		this.url 		= window.location.href + '';
		this.port 		= window.location.port + '';
		this.protocol 	= window.location.protocol + '';
		this.path 		= window.location.pathname + '';
		this._query();
	};
	
}).call(this, series);