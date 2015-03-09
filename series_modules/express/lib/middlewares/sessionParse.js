module.exports = function(){
	return function(req, res, next){
		parseSession(req, res);
		req.sessions = getSessions();
		next();
	}
}

function getSessions(){
	var contents = new Object();
	_.enumerate(Session.Contents, function(key){
		contents[key] = Session(key);
	});
	return contents;
}

function parseSession(req, res){
	res.session = function(key, value){
		if ( _.isObject(key) ){
			_.each(key, function(b, a){
				res.session(a, b);
			});
		}else{
			if ( !value ){
				return Session(key);
			}else{
				Session(key) = value;
				req.sessions = getSessions();
			}
		}
	}
	
	res.session.timeout = function(time){ // s
		Session.Timeout = time || 20;
	}
	
	res.session.end = function(){
		Session.Abandon();
	}
	
	res.session.remove = function(key){
		try{
			Session.Contents.Remove(key);
			req.sessions = getSessions();
		}catch(e){}
	}
	
	res.session.destory = function(){
		Session.Contents.RemoveAll();
		req.sessions = getSessions();
	}
	
	res.session.count = function(){
		return Session.Contents.Count;
	}
}