module.exports = function(){
	var argvs = arguments;
	return function(req, res, next){
		var views = res.app.get('views');
		for ( var i = 0 ; i < argvs.length ; i++ ){
			var pather = argvs[i];
			if ( !/^\w:\\/.test(pather) ){ pather = path.server(pather); };
			if ( fs.exist(pather) ){ views = argvs[i]; };
		}
		res.app.set('views', views);
		next();
	}
}