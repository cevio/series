exports.test = function(){
	try {
		var useragent = Request.ServerVariables('HTTP_USER_AGENT').Item;
		var UA = require('useragent');
		var ua = UA.analyze(useragent);
		
		var UAs = [];
		UAs.push('<font color="#0F0">UA: ' + ua.ua + '</font>');
		UAs.push('<font color="#0FF">OS: ' + ua.os.full + '</font> <img src="' + img2uri('os/' + ua.os.image) + '" />');
		UAs.push('<font color="#0F0">BROWSER: ' + ua.browser.full + '</font> <img src="' + img2uri('browser/' + ua.browser.image) + '" />');
		return ['list', 'test result', UAs];
	}catch(e){
		return ['error', e.message];
	}
}

function img2uri(img){
	img = path.resolve(__dirname, 'img/16/', img + '.png');
	
	var ext = path.extname(img).substr(1);
	var bin = fs.readFile(img, {encoding: 'buffer'});
	var b64 = base64OrBin(bin);
	var uri = 'data:image/' + ext + ';base64,' + b64;
	
	return uri;
}

function base64OrBin(obj) {
    var xml = new ActiveXObject('Microsoft.XMLDOM');
    var node = xml.createElement('obj');
    node.dataType = 'bin.base64';
    obj = 'string' == typeof obj ? (node.text = obj, node.nodeTypedValue) : (node.nodeTypedValue = obj, node.text);
    node = xml = null;
    return obj;
}