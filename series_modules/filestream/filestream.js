
var 
	contentTypes = require('./content-types.json'),
	unknowType = 'application/octet-stream';
	
exports.textStream = ['text/xml', 'text/html', 'text/css', 'application/x-javascript'];
	
exports.set = function(key, value){
	contentTypes[key] = value;
};

exports.get = function(key){
	return contentTypes[key];
};

exports.save = function(){
	fs.writeFile(module.resolve('./content-types.json'), JSON.stringify(contentTypes));
};

exports.send = function(pather){
	var ext = path.extname(pather).toLowerCase();
	var filename = pather.split('\\').slice(-1)[0];
	var contenttype = unknowType;
	if ( contentTypes[ext] ){
		contenttype = contentTypes[ext];
	};
	
	if ( this.textStream.indexOf(contenttype) > -1 ){
		Response.ContentType = contenttype;
		Response.Write(fs.readFile(pather));
	}else{
		var Ado = new ActiveXObject('Adodb.Stream'), i = 0, r = 1024;
			Ado.Mode = 3;
			Ado.Type = 1;
			Ado.Open();
			Ado.LoadFromFile(pather);
	
		Response.AddHeader("Content-Disposition", "attachment; filename=" + filename);
		Response.AddHeader("Content-Length", Ado.Size);
		Response.ContentType = contenttype;
		
		while( i < Ado.Size ){
			Response.BinaryWrite(Ado.Read(r));
			Response.Flush();
			i = i + r;
		};
		
		Ado.Close();
	}
};

exports.download = function(url, pather){
	var Ajax = require('ajax'),
		ajax = new Ajax();
		
	var data = ajax.getBinary(url);
	fs.writeFile(pather, data);
};