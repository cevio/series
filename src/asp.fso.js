// FSO Factory.
;(function(root){
	
	// fso module
	// ---------------------------------
	var object = new ActiveXObject("Scripting.FileSystemObject");
	var _ = root._ || require('underscore');
	
	fs.exist = function( path ){
		return object.FolderExists(path) ? true : (object.FileExists(path) ? true : false);
	};
	
	fs.stats = function( path ){
		var cf;
		if ( object.FileExists(path) ){
			cf = function(){ return object.GetFile(path); };
			cf.isFile = function(){ return true };
			cf.isDirectory = function(){ return false };
		}
		else if ( object.FolderExists(path) ){
			cf = function(){ return object.GetFolder(path); };
			cf.isFile = function(){ return false };
			cf.isDirectory = function(){ return true };
		}
		else{
			cf = function(){ return {}; };
			cf.isFile = function(){ return false };
			cf.isDirectory = function(){ return false };
		}
		
		return cf;
	};
	
	fs.mkdir = function( path ){
		if ( !object.FolderExists(path) ) { 
			object.CreateFolder(path); 
		};
		
		return object.FolderExists(path);
	};
	
	fs.rmdir = function( path ){
		if ( object.FolderExists(path) ) { 
			object.DeleteFolder(path);
		};
		
		return !object.FolderExists(path);
	};
	
	fs.writeFile = function(filename, data, options){
		if ( !options || !_.isJSON(options) ){
			options = {
				encoding: Response.Charset
			};
		};
		if ( !options.encoding ){
			options.encoding = Response.Charset;
		};
		
		try{
			var isStr = _.isString(data);	// 判断传入的是String还是Buffer
			var dType = isStr ? 2 : 1;
			
			var stream = new ActiveXObject('Adodb.Stream');
				stream.Type = dType; 
				stream.Mode = 3; 
				stream.Open();
				if (isStr) {
					stream.Charset = options.encoding;
					stream.WriteText(data);
				}else{
					stream.Write(data);
				}
				if (isStr && options.encoding.toLowerCase() === 'utf-8') {
					// 去除utf-8的BOM
					stream.Position = 0;
					stream.Type = 1;
					stream.Position = 3;
					var bs = stream.Read();  
					stream.Position = 0;  
					stream.Write(bs);  
					stream.SetEOS();
				}
				stream.SaveToFile(filename, 2);
				stream.Close();
		}catch(e){
			throw new Error('Series Fso Error: ' + e.message);
		}
	};
	
	fs.readFile = function(filename, options){
		if ( !options || !_.isJSON(options) ){
			options = {
				encoding: Response.Charset
			};
		};
		if ( !options.encoding ){
			options.encoding = Response.Charset;
		};
		
		try{
			var stream = new ActiveXObject('Adodb.Stream'),
				data;
		
				stream.Type = options.encoding === 'buffer' ? 1 : 2; 
				stream.Mode = 3; 
				stream.Open();
				if (options.encoding === 'buffer') {
					stream.Position = stream.Size;
					stream.LoadFromFile(filename);
					data = stream.Read;
				}else{
					stream.Charset = options.encoding;
					stream.Position = stream.Size;
					stream.LoadFromFile(filename);
					data = stream.ReadText;
				}
				stream.Close();
				
			return data;
		}catch(e){
			throw new Error('Series Fso Error: [' + filename + '] => ' + e.message);
		}
	}
	
	fs.readFileSync = fs.readFile;
	
	fs.appendFile = function(filename, data, options){	
		if ( !options || !_.isJSON(options) ){
			options = {
				encoding: Response.Charset
			};
		};
		if ( !options.encoding ){
			options.encoding = Response.Charset;
		};
		
		try{
			if ( _.isString(data) ) {
				// 将String转为Buffer
				var object = new ActiveXObject('Adodb.Stream');
					object.Type = 2; 
					object.Mode = 3; 
					object.Open();
					object.Charset = options.encoding;
					object.WriteText(data);
					object.Position = 0;
					object.Type = 1;					
					if (options.encoding.toLowerCase() === 'utf-8') {
						object.Position = 3;	// 去除utf-8的BOM  
					}
					data = object.Read();
					object.Close();
			}
			
			var stream = new ActiveXObject('Adodb.Stream');
				stream.Type = 1; 
				stream.Mode = 3; 
				stream.Open();
				stream.LoadFromFile(filename);
				stream.Position = stream.Size;
				stream.Write(data);
				stream.SaveToFile(filename, 2);
				stream.Close();
		}catch(e){
			throw new Error('Series Fso Error: [' + filename + '] => ' + e.message);
		}
	};
	
	fs.appendFileSync = fs.appendFile;
	
	fs.write = function(fd, buffer, offset, length, position){
		try{
			var stream = new ActiveXObject('Adodb.Stream');	
				stream.Type = 1;
				stream.Open();
				stream.Write(buffer);
				stream.Position = 0;
				stream.SaveToFile(fd, 2);
				stream.Close();
		}catch(e){
			throw new Error('Series Fso Error: ' + e.message);
		}
	};
	
	fs.writeSync = fs.write;
	
	fs.read = function(fd, buffer, offset, length, position){
		try{
			var stream = new ActiveXObject('Adodb.Stream'), ret;
				stream.Type = 1;
				stream.Open();
				stream.LoadFromFile(fd);
				ret = stream.Read(-1);
				stream.Close();
			return ret;
		}catch(e){
			throw new Error('Series Fso Error: ' + e.message);
		}
	};
	
	fs.readSync = fs.read;
	
	_.each(['copy', 'move'], function(method){
		var upper = method.charAt(0).toUpperCase() + method.substr(1);
		fs[method] = function(source, target){
			if ( object.FileExists(source) ){
				object[upper + 'File'](source, target);
			}
			else if ( object.FolderExists(source) ){
				object[upper + 'Folder'](source, target);
			}
		}
	});
	
	fs.rename = function(path, name){
		var cf = (fs.stats(path))();
		if ( cf.Name ){
			cf.Name = name;
		};
	};
	
	fs.readDir = function(path, callback){
		var cf = fs.stats(path);
		if ( cf.isDirectory() ){
			cf = cf();
			return {
				dir: _.enumerate(cf.SubFolders, callback),
				file: _.enumerate(cf.Files, callback)
			}
		}
	};
	
	fs.unlink = function(path){
		var cf = fs.stats(path);
		if ( cf.isFile() ){
			cf = null;
			object.DeleteFile(path);
		}
	};
	
}).call(fs, Global);