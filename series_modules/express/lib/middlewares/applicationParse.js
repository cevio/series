module.exports = function(){
	return function(req, res, next){
		parseApplication(req, res);
		req.applications = getApplications();
		next();
	}
}

function getApplications(){
	var contents = new Object();
	_.enumerate(Application.Contents, function(key){
		contents[key] = Application(key);
	});
	return contents;
}

function parseApplication(req, res){
	res.application = function(key, value){
		if ( _.isObject(key) ){
			_.each(key, function(b, a){
				res.application(a, b);
			});
		}else{
			if ( !value ){
				return Application(key);
			}else{
				Application(key) = value;
				req.applications = getApplications();
			}
		}
	}
	
	res.application.lock = function(time){ // s
		Application.Lock();
	}
	
	res.application.unlock = function(){
		Application.Unlock();
	}
	
	res.application.remove = function(key){
		try{
			Application.Contents.Remove(key);
			req.applications = getApplications();
		}catch(e){}
	}
	
	res.application.destory = function(){
		Application.Contents.RemoveAll();
		req.applications = getApplications();
	}
	
	res.application.count = function(){
		return Application.Contents.Count;
	}
}