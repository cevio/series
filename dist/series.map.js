(function(){
	// tronjs online http url
	var website = window.location.href.split('/').slice(0, 3).join('/');
	var pathname = window.location.pathname.split('/').slice(0, -1).join('/');
	
	// check ie brower
	function isIE(){
		if(!!window.ActiveXObject || "ActiveXObject" in window){
			return true;
		}else{
			return false;
		}
	};
	
	//check ie version
	function IEVersion()
	{
	  var rv = -1;
	  if (navigator.appName == 'Microsoft Internet Explorer')
	  {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
		  rv = parseFloat( RegExp.$1 );
	  }
	  else if (navigator.appName == 'Netscape')
	  {
		var ua = navigator.userAgent;
		var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
		  rv = parseFloat( RegExp.$1 );
	  }
	  return rv;
	};
	
	// make http modules url
	function resolveJQueryHTTP( file ){
		return website + '/static/ued/jquery/' + file;
	}
	
	function resolvePluginHTTP(file){
		return website + '/static/ued/plugins/' + file;
	}
	
	// make jQuery http url
	function getjQueryResolveURI(){
		if (isIE() && Number(IEVersion()) <= 9) {
			return resolveJQueryHTTP('jquery-1.11.2.min');
		}else{
          	return resolveJQueryHTTP('jquery-2.1.3.min');
		}
	}
	
	// require configs:
	require.config({
		baseUrl: pathname,
		paths: {
			jquery: getjQueryResolveURI(),
			cookie: resolvePluginHTTP('cookie/jquery.cookie'),
			ojs: resolvePluginHTTP('ojs/ojs')
		}
	});
	
}).call(this);