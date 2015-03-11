var debris = module.exports = function(url, pather, speed){
	var wholeSize = debris.getRemoteFileSize(url);
	var softSize = debris.getFileSize(pather);
	if ( wholeSize > softSize ){
		return debris.handle(url, pather, speed, softSize, wholeSize);
	}else{
		return 1;
	}
}

debris.getRemoteFileSize = function(url){
	var http = new ActiveXObject('Microsoft.XMLHTTP');
	http.open('HEAD', url, false);
	http.send();
	var size = Number(http.getResponseHeader('Content-Length'));
	return size;
}

debris.getFileSize = function(pather){
	if ( fs.exist(pather) ){
		var file = fs.stats(pather);
		var info = file();
		return info.size;
	}else{
		return 0;
	}
}

debris.handle = function(url, pather, speed, start, size){

	if ( start + speed > size ){
		speed = size - start;
	}

	var bytes = start + '-' + ( start + speed - 1 );
	var http = new ActiveXObject('Microsoft.XMLHTTP');

	http.open('GET', url, false);
	http.setRequestHeader('Range', 'bytes=' + bytes);
	http.setRequestHeader('Content-Type', 'application/octet-stream');
	http.send();
	
	var stream = new ActiveXObject('Adodb.Stream');
	stream.Type = 1;
	stream.Mode = 3;
	stream.Open();

	if ( fs.exist(pather) ){
		stream.LoadFromFile(pather);
	}

	stream.Position = start;
	stream.Write(http.responseBody);
	stream.SaveToFile(pather, 2);
	stream.Close();
	stream = null;
	
	return (start + speed) / size;
}