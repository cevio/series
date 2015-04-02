// JavaScript Document

exports.each = function(dbo, callback, context){
	dbo.MoveFirst();
	while ( !dbo.Eof ){
		if ( _.isFunction(callback) ){
			callback.call(context || dbo, dbo);
		}
		dbo.MoveNext();
	}
}