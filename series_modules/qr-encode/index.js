module.exports = function(text, opts){
	// 返回结果
	var QR = require('./lib/qr-encode.js');
	var dataURI = QR(utf16to8(text), opts);
	var dataIMG = parseURI(dataURI);
		dataIMG.bin = base64OrBin(dataIMG.base);
	
	return { dataURI: dataURI, dataIMG: dataIMG };
}

// 将字符串转为utf-8，以支持中文
function utf16to8(str) {  
	var out, i, len, c;  
	out = "";  
	len = str.length;  
	for(i = 0; i < len; i++) {  
	c = str.charCodeAt(i);  
	if ((c >= 0x0001) && (c <= 0x007F)) {  
		out += str.charAt(i);  
	} else if (c > 0x07FF) {  
		out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));  
		out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));  
		out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));  
	} else {  
		out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));  
		out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));  
	}  
	}  
	return out;  
}

// 将base64对象转为结果
function base64OrBin(obj) {
	var xml = new ActiveXObject('Microsoft.XMLDOM');
	var node = xml.createElement('obj');
	node.dataType = 'bin.base64';
	obj = 'string' == typeof obj ? (node.text = obj, node.nodeTypedValue) : (node.nodeTypedValue = obj, node.text);
	node = xml = null;
	return obj;
}

// 解析dataURI，返回格式为后缀名加base64数据
function parseURI(uri) {
	try {
		var parts = uri.split(';');
		var ext = parts[0].replace('data:image/', '');
		var base = parts[1].replace('base64,', '');
		
		return {ext: ext, base: base};
	}catch(e){
		return {ext: 'gif'};
	}
}