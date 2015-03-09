var $ = require('cookie');

module.exports = function(){
	var cookie, httponly = false, exps, options = {};
	
	for ( var i = 0 ; i < arguments.length ; i++ ){
		if ( _.isBoolean(arguments[i]) ){
			httponly = arguments[i];
		}else if ( _.isString(arguments[i]) ){
			cookie = arguments[i];
		}else if ( _.isNumber(arguments[i]) ){
			exps = new Date(new Date().getTime() + arguments[i]);
		}else if ( _.isDate(arguments[i]) ){
			exps = arguments;
		}else if ( _.isObject(arguments[i]) ){
			options = arguments[i];
		}
	}
	
	var settings = options;
	
	if ( httponly )	settings.httponly = httponly;
	if ( exps ) settings.expires = exps;

	return function(req, res, next){
		setCookie(req, res, cookie, settings);
		getCookies(req, res, cookie);
		next();
	}
};


function getCookies(req, res, cookie){
	req.cookies = parseCookie(cookie) || {};
}

function parseCookie(cookie){
	if ( cookie ){
		var _cookie = $.cookie(cookie);
		if ( _cookie ){
			return _.fromQuery(_cookie);
		}else{
			return {};
		}
	}else{
		var ps = {};
		_.each($.cookie(), function(value, key){
			if ( value.indexOf('=') > -1 ){
				ps[key] = _.fromQuery(value);
			}else{
				ps[key] = value;
			};
		});
		return ps;
	};
}

function setCookie(req, res, cookie, settings){
	res.cookie = function(key, value){
		if ( _.isObject(key) ){
			_.each(key, function(b, a){
				res.cookie(a, b);
			})
		}else{
			if ( _.isUndefined(value) || _.isNull(value) ){
				return req.cookies[key];
			}else{
				value = String(value) || value;
				if ( value.length === 0 ){
					delete req.cookies[key];
				}else{
					req.cookies[key] = value;
				}
				
				if ( cookie ){
					$.cookie(cookie, _.toQuery(req.cookies), settings);
				}else{
					$.cookie(key, value, settings);
				}
			}
		}
	}
	
	res.cookie.remove = function(key){
		if ( !req.cookies[key] ) {
				return true;
		}
		
		var _exp = settings.expires;
		settings.expires = -1;
		res.cookie(key, '');
		if ( req.cookies[key] ){
			delete req.cookies[key];
		}
		settings.expires = _exp;
		
		return !req.cookies[key];
	}
	
	res.cookie.destory = function(key){
		$.removeCookie(key, settings);
		if ( req.cookies[key] ){
			delete req.cookies[key];
		}
	}
	
	
}