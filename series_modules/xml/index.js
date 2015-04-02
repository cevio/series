// JavaScript Document

var xml = require('./lib');

var proto = module.exports = function( str ){
	var obj = new ActiveXObject('Microsoft.XMLDOM');
	if ( str ){
		try{
			obj.async = false;
			if ( /^\w\:\\/.test(str) ){ obj.load(str); }
			else{ obj.loadXML(str); }
			return xml(obj);
		}catch(e){
			throw new Error('load XML fail.');
		}
	}else{
		throw new Error('load XML fail.');
	}
}