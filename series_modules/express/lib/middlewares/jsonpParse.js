module.exports = function(options){
	if ( _.isUndefined(options) ){ options = {}; };
	if ( _.isString(options) ){ options = { jsonp: options }; };
	if ( _.isFunction(options) ){ options = { jsonpCallback: options }; };

	return function(req, res, next){
		var app = req.app;
		if ( _.isString(options.jsonp) ){ app.set('jsonp callback name', options.jsonp); };
		if ( _.isFunction(options.jsonpCallback) ){ app.set('json replacer JSON replacer', options.jsonpCallback); };
		var jsonpCallback = app.get('json replacer JSON replacer');
		var jsonp = app.get('jsonp callback name');

		if ( _.isString(jsonp) && _.isFunction(jsonpCallback) ){
			jsonp = jsonpCallback(jsonp);
		}
		
		jsonp = req.query[jsonp];
		
		if ( jsonp ){
			res.handles.push(function(req, res){
				res.set('Content-Type', 'application/json; Charset=utf-8');
				return jsonp + '(' + JSON.stringify(res._jsons) + ')';
			});
		};
		next();
	};
};