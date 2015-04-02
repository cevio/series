
var debug = module.exports = function(){
	var args = Array.prototype.slice.call(arguments, 0);
	var s = Session(debug.SessionID) || [];
	s = s.concat(args);
	Session(debug.SessionID) = s;
}

debug.SessionID = 'IISNodeDebugs';

debug.clear = function(){
	Session.Contents.Remove(debug.SessionID);
}

debug.log = function(){
	var args = null;
	
	try{
		args = Session(debug.SessionID);

		if ( !args ){
			return [];
		}
		
		var rets = [];
		
		_.each(args, function(arg){
			rets.push(debug.format(arg));
		});
		
		return rets;
		
	}catch(e){
		return [];
	}
}

debug.format = function(logs){
	if ( _.isString(logs) || _.isBoolean(logs) || _.isNumber(logs) ){ logs = logs; }
	else if ( _.isDate(logs) ){ logs = new Date(logs).format('yyyy/MM/dd hh:mm:ss'); }
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
	
	return logs;
}