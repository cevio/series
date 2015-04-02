'use strict';

var util = require('./utils.js')
	,	b2s = util.b2s
	,	upload;

var upload = exports = module.exports = function(options){
	this.configs = _.extend(upload.defaults, options || {});
	this.result = {};
	this.pool = [];
	this.handle();
}

upload.defaults = {
	speed: 1024 * 100
}

upload.prototype.handle = function(){
	var bufferArray = this.getBinary()
		,	buf = util.transArrayBuff(bufferArray)
		,	files = []
		,	cache = {}
		,	index = 0;
		//Response.Write(util.b2s(bufferArray).replace(/\r\n/g, '\\r\\n').replace(/\n/g, '\\n'))
		
	var cutline = buf.slice(0, buf.indexOf(13));	// 最后几个为：cutline--\r\n，即最后一个分割符的后面没有\r
	
	function isCutlineStart(buf, j){
		for ( var i = 0 ; i < cutline.length ; i++ ){
			if ( buf[j + i] != cutline[i] ){
				return false;
			}
		}
		return true;
	}
	
	var i = cutline.length;

	while ( i < buf.length ){
		if ( isCutlineStart(buf, i) ) {
			files.push({
				crlf1: cache.crlf1,
				crlf2: cache.crlf2,
				crlf3: cache.crlf3,
				crlf4: i - 6	// 减\r\n
			});
			i += cutline.length;
			index = 0;
		}
		if ( buf[i] == 13 && buf[i + 1] == 10 ) {
			switch (index) {
				case 0:
					cache.crlf1 = i;
					index++;
					break;
				case 1:
					cache.crlf2 = i;
					index++;
					break;
				case 2:
					cache.crlf3 = i;
					index++;
					break;
			}
		}
		i++;
	}

	var obj = new ActiveXObject('Adodb.Stream');
		obj.Type = 1;
		obj.Mode = 3;
		obj.Open();
		obj.Write(bufferArray);
		
	for ( var i = 0 ; i < files.length ; i++ ) {
		obj.Position = files[i].crlf1 + 2;	// \r\n 占两个字节
		var head = obj.Read(files[i].crlf2 - files[i].crlf1);
		head = b2s(head);				// 转成字符串以解析
		
		var NameExec = /name\=\"([^\"]+)\"/.exec(head)
			,	FileNameExec = /filename\=\"([^\"]+)\"/.exec(head)
			,	data
			,	ret = {};

		if ( FileNameExec && FileNameExec[1] ){
			var filename = FileNameExec[1];
			
			obj.Position = files[i].crlf3 + 4;	// \r\n 占两个字节
			data = obj.Read(files[i].crlf4 - files[i].crlf3);
			
			var ext = path.extname(filename);
			ret = {
				filename: filename,
				ext: ext,
				size: files[i].crlf4 - files[i].crlf3,
				binary: data
			}
			
			if ( NameExec && NameExec[1] ){
				if ( !this.result[NameExec[1]] || !_.isArray(this.result[NameExec[1]]) ){
					this.result[NameExec[1]] = [];
				}
				this.result[NameExec[1]].push(ret);
			}else{
				this.pool.push(ret);
			}
		}else{
			obj.Position = files[i].crlf3 + 2;	// 比文件框少一行
			var value = b2s(obj.Read(files[i].crlf4 - files[i].crlf3 + 2))
			if ( NameExec && NameExec[1] ){
				if ( !this.result[NameExec[1]] || !_.isArray(this.result[NameExec[1]]) ){
					this.result[NameExec[1]] = [];
				}
				this.result[NameExec[1]].push(value);
			}else{
				this.pool.push(value);
			}
		}
	}
	
	obj.Close();
	
	var returns = {}
	_.each(this.result, function(value, key){
		if ( value.length < 2 ){
			returns[key] = value[0];
		}else{
			returns[key] = value;
		}
	});
	this.result = returns;
}

upload.prototype.getBinary = function(){
	var totalSize = Request.TotalBytes,
		haveReadSize = 0,
		binaryChunkData,
		speed = this.configs.speed;

	if ( totalSize < speed ){
		speed = totalSize;
	}

	var obj = new ActiveXObject("Adodb.Stream");
		obj.Type = 1;
		obj.Mode = 3;
		obj.Open();

	while ( haveReadSize < totalSize ){
		if (totalSize - haveReadSize < speed){
			speed = totalSize - haveReadSize;
		}
		obj.Write(Request.BinaryRead(speed));
		haveReadSize += speed;
	}
		obj.Position = 0;
		binaryChunkData = obj.Read();
		obj.Close();
		obj = null;

	return binaryChunkData;
}