
// query module
// -------------------------------
var query = module.exports = new Class(function(context, sql, type){
	var 
		dbo = context['private']('dbo'),
		connect = context['private']('connect');
	
	this.property('context', context);
	this.property('dbo', dbo);
	this.property('connect', connect);
	
	_.isString(sql) && dbo.Open(sql, connect, 1, type ? type : 1);
});

query.define('each', function(callback){
	var 
		that = this,
		dbo = this['private']('dbo'),
		i = 0,
		values = [];
		
	dbo.MoveFirst();
	while ( !dbo.Eof )
	{
		if ( _.isFunction(callback) ){
			var value = callback.call(that, dbo, i);
			if ( !_.isUndefined(value) ){
				values.push(value);
			}
		};
		i++;
		dbo.MoveNext();
	};
	
	return values;
});

query.define('toJSON', function(){
	return this.each(function(object, i){
		var json = {};
		for ( var i = 0; i < object.fields.count ; i++ ) {
			json[object.fields(i).name] = object.fields(i).value;
		}
		return json;
	});
});

query.define('toArray', function(){
	try{ 
		var 
			dbo = this['private']('dbo'),
			tempArr = dbo.GetRows().toArray(); 
			
		return getRows(tempArr, dbo.Fields.Count);
	}catch(e){
		if ( process.env.SERIES_ENV === 'development' ){
			throw new Error('Series plugin module [mssql.query] Error: ' + e.message);
		};
		return [];
	}
});

query.define('exec', function(callback){
	var dbo = this['private']('dbo');
	if ( dbo.RecordCount > 1 ){
		return this.each(callback);
	}else{
		if ( _.isFunction(callback) ){
			var value = callback.call(this, dbo, 0);
			if ( !_.isUndefined(value) ){
				return value;
			}
		};
	}
});

function getRows( arr, fieldslen ){
	var len = arr.length / fieldslen, data=[], sp; 

	for( var i = 0; i < len ; i++ ) { 
		data[i] = new Array(); 
		sp = i * fieldslen; 
		for( var j = 0 ; j < fieldslen ; j++ ) { data[i][j] = arr[sp + j] ; } 
	}

	return data; 
}