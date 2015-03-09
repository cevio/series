;(function(S){
	var _ = this._,
		response = S.response = _.noop,
		app = S.express(),
		History = this.History;
		
	response.prototype.redirect = function(url){
		var href = url;
		var sp = href.split('/');
		title = document.title || '';
		
		if ( /^http|https/i.test(href) ){
			var _href = S.path.resolve(that.path, '/' + href.split('/').slice(3).join('/')).replace(/\\/g, '/');	
			if ( sp.slice(0, 3).join('/').toLowerCase() === app.getLocationDomain().toLowerCase() ){ app.createWindow(_href, title); };
		}else{
			app.createWindow(href, title);
		}
	}
	
}).call(this, series);