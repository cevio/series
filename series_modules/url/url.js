
// url module
// ---------------------------

var url = new Class();

url.property('resolve', function(data){
	if ( data.length === 0 ){
		return;
	}
	else if ( data.length === 1 ){
		return data[0];
	}
	else{
		return data;
	}
});

url.define('get', function( key ){
	return this['private']('resolve')(_.enumerate(Request.QueryString(key)));
});

url.define('form', function( key ){
	return this['private']('resolve')(_.enumerate(Request.Form(key)));
});

url.define('getAll', function(){
	var querys = {}, that = this;
	_.each(_.enumerate(Request.QueryString), function( key ){
		querys[key] = that.get(key);
	});
	return querys;
});

url.define('formAll', function(){
	var querys = {}, that = this;
	_.each(_.enumerate(Request.Form), function( key ){
		querys[key] = that.form(key);
	});
	return querys;
});

url.define('host', process.env.HTTP_HOST);
url.define('agent', process.env.HTTP_USER_AGENT);

var ref = String(Request.ServerVariables("HTTP_REFERER"));
if ( ref && ref.length > 0 && ref != 'undefined' ){}else{ ref = false;};
url.define('referer', ref);

module.exports = url;