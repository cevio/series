!(function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        var f;
        "undefined" != typeof window ? f = window: "undefined" != typeof global ? f = global: "undefined" != typeof self && (f = self),
        f['upfile'] = e()
    }
})(function() {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    throw new Error("Cannot find module '" + o + "'")
                }
                var f = n[o] = {
                    exports: {}
                };
                t[o][0].call(f.exports,
                function(e) {
                    var n = t[o][1][e];
                    return s(n ? n: e)
                },
                f, f.exports, e, t, n, r)
            }
            return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    })(
		{1:[function(_dereq_, module, exports){
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
},{}],2:[function(_dereq_, module, exports){
'use strict';

var util = _dereq_('./utils.js')
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
},{"./utils.js":1}],3:[function(_dereq_, module, exports){
var main = _dereq_('./lib');

var filePost = exports = module.exports = function(options){
	var files = new main(options)
		,	result = files.result
		,	pool = files.pool;
		
	var ret = { result: result };
	
	if ( pool.length > 0 ){
		ret.pool = pool;
	}
		
	return ret;
}

exports.fileParse = function(options){
	
	if ( _.isFunction(options) ) options = { callback: options };
	if ( _.isString(options) ) options = { folder: options };	
	if ( _.isNumber(options) ) options = { speed: options };
	
	return function(req, res, next){
		req.files = req.files || {};
		req._files = req._files || {};
		var ret = filePost(options), pather;
		if ( options.folder ){
			_.each(ret.result, function(value, key){
				if ( !_.isArray(value) ) value = [value];
				if ( !req.files[key] || !_.isArray(req.files[key]) ){
					req.files[key] = [];
				}
				_.each(value, function(v){
					if ( v.filename ){
						pather = path.resolve(options.folder, value.filename);
						fs.writeFile(pather, value.binary);
						delete v.binary;
						v.pather = pather;
					}
					req.files[key].push(v);
				});
				if ( req.files[key].length < 2 ) req.files[key] = req.files[key][0];
			});
			if ( ret.pool ){
				var ps = [];
				_.each(ret.pool, function(p){
					if ( p.filename ){
						pather = path.resolve(options.folder, p.filename);
						fs.writeFile(pather, value.binary);
						delete p.binary;
						p.pather = pather;
					}
					req._files.push(v);
				});
			}
		}
		else{
			req.files = ret.result;
			req._files = ret.pool;
		}
		
		next();
	}
}
},{"./lib":2}]}
		,{},[3])(3)
});