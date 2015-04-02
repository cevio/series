'use strict';
function base64OrBin(obj) {
	var xml = new ActiveXObject('Microsoft.XMLDOM');
	var node = xml.createElement('obj');
	node.dataType = 'bin.base64';
	obj = 'string' == typeof obj ? (node.text = obj, node.nodeTypedValue) : (node.nodeTypedValue = obj, node.text);
	node = xml = null;
	return obj;
}	

exports.base64OrBin = base64OrBin;

exports.s2b = function(str){
	var object = new ActiveXObject("Adodb.Stream"),
		value;
		
		object.Type = 2;
		object.Mode = 3;
		object.Open();
		object.WriteText(str);
		object.Position = 0;
		object.Type = 1;
		value = object.Read();
		object.Close();
		object = null;
		
	return value;
}

exports.transArrayBuff = function(bufferArray){
	var buf = [];
	with (new ActiveXObject('MSXML2.DOMDocument').createElement('node')) {
		dataType = 'bin.hex';
		nodeTypedValue = bufferArray;
		var hex = text;
		hex.replace(/../g, function($0) {
			buf.push(parseInt($0, 16));
		});
	};
	return buf;
}

exports.b2s = function(bin){
	var stream = new ActiveXObject('Adodb.Stream');
	stream.Type = 1;
	stream.Mode = 3;
	stream.Open();
	stream.Write(bin);
	stream.Position = 0;
	stream.Type = 2;
	stream.Charset = 'utf-8';
	var retstr = stream.ReadText();
	stream.Close();
		
	return retstr;
}