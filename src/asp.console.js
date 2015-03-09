(function(){
	
	var _ = this._;
	
	_.isJSON = function(value){
		try{
			for ( var i in value ){
				return true;
			}
		}catch(e){
			return false;
		}
	};
	
	var status = {},
		statusArray = [
			'100 Continue',
			'101 Switching Protocols',
			'200 OK',
			'201 Created',
			'202 Accepted',
			'203 Non-Authoritative Information',
			'204 No Content',
			'205 Reset Content',
			'206 Partial Content',
			'300 Multiple Choices',
			'301 Moved Permanently',
			'302 Found',
			'303 See Other',
			'304 Not Modified',
			'305 Use Proxy',
			'307 Temporary Redirect',
			'400 Bad Request',
			'401 Unauthorized',
			'403 Forbidden',
			'404 Not Found',
			'405 Method Not Allowed',
			'406 Not Acceptable',
			'407 Proxy',
			'408 Request Timeout',
			'409 Conflict',
			'410 Gone',
			'411 Length Require',
			'412 Precondition Failed',
			'413 Request Entity Too Large',
			'414 Request URI Too Long',
			'416 Requested Range Not Satisfiable',
			'500 Internal Server Error',
			'501 Not Implemented',
			'502 Bad Gateway',
			'503 Service Unavailable',
			'504 Gateway Timeout',
			'505 HTTP Version Not Supported'
		];
		
	_.each(statusArray, function(code){
		var codes = code.split(' ');
		if ( !isNaN(codes[0]) ){
			status[codes[0]] = code;
		};
	});
	
	this.watcher = new Class();
	
	this.watcher.define('log', function(){
		Response.Write(Array.prototype.slice.call(arguments, 0).join(''));
	});
	
	this.watcher.define('json', function(){
		arguments.length > 0 && this.log(JSON.stringify(arguments[0]));
	});
	
	this.watcher.define('format', function(){
		arguments.length > 0 && this.log(JSON.format(arguments[0]));
	});
	
	this.watcher.define('debug', function( logs ){
		if ( process.env.SERIES_ENV === 'development' ){
			if ( _.isString(logs) || _.isBoolean(logs) || _.isNumber(logs) ){ logs = logs; }
			else if ( _.isDate(logs) ){ logs = new Date(logs).format('yyyy年MM月dd日 hh:mm:ss'); }
			else if ( _.isFunction(logs) ) { logs = logs.toString(); }
			else if ( typeof logs === 'object' ) {
				try{
					if ( logs instanceof RegExp ){
						logs = '[RegExp: ' + String(logs) + ']';
					}else if ( new Enumerator(logs).atEnd ){
						logs = JSON.format(_.enumerate(logs), true);
					}else{
						if ( _.isJSON(logs) ){ logs = JSON.format(logs, true); }
						else{ try{ logs = valueOf(logs) ? valueOf(logs) : typeof(logs); }catch(ex){ logs = typeof(logs); } }
					}
				}catch(e){
					if ( _.isJSON(logs) ){ logs = JSON.format(logs, true); }
					else{ try{ logs = valueOf(logs) ? valueOf(logs) : typeof(logs); }catch(ex){ logs = typeof(logs); } }
				}
			}
			else { try{ logs = String(logs); }catch(e){ logs = typeof(logs); } };
			
			var 
				now = new Date().format('yyyy年MM月dd日 hh:mm:ss'),
				content = '[' + now + ']:\r\n' + logs + '\r\n\r\n',
				file = Server.MapPath(path.normalize('/debug.log')),
				object = new ActiveXObject("Scripting.FileSystemObject"),
				fw = object.OpenTextFile(file, 8, true);
				
			fw.WriteLine(content);		
			fw.Close();
		}
	});
	
	this.watcher.define('redirect', function(code, url){
		if ( !isNaN(code) && status[code] ){
			this.writeStatus(code);
			Response.AddHeader("Location", url);
			Response.End();
		}else{
			Response.Redirect(code);
		};
	});
	
	this.watcher.define('writeStatus', function(code){
		if ( status[code] ){
			Response.Status = status[code];
		};
		return this;
	});
	
	this.watcher.define('end', function(code){
		this.log.apply(this, arguments);
		Response.End();
		return this;
	});
	
	console = new this.watcher();
	
}).call(this);