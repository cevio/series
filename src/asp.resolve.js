;(function(path){
	
	this.Resolve = {
		fso: new ActiveXObject("Scripting.FileSystemObject"),
		FolderExist: function(pather){ return this.fso.FolderExists(pather); },
		FileExist: function(pather){ return this.fso.FileExists(pather); },
		
		get: function(dirname, selector){
			selector = selector.replace(/\\/g, '/');
			if ( /^\.\//.test(selector) || /^\.\.\//.test(selector) || /\//.test(selector) ){
				return this.lazy(path.resolve(dirname, selector));
			}else{
				var cwd = Server.MapPath(process.cwd());
				var that = this;
				var findPatherBags = function(dir, sec){
					var isRoot = path.relative(dir, cwd).length === 0,
						realPath = path.resolve(dir, process.bags, sec),
						matcher;

					if ( that.FolderExist(realPath) && !!( matcher = that.match(realPath) ) ){ return matcher; }					
					else if ( isRoot ){ return path.resolve(dirname, sec); }
					else{ return findPatherBags(path.resolve(dir, '..'), sec); };
				};
				return this.lazy(findPatherBags(dirname, selector));
			}
		},
		
		match: function( pather ){
			var packPather = path.resolve(pather, 'package.json');

			if ( this.FileExist(packPather) ){
				try{
					var PackageData = JSON.parse(fs.readFile(packPather));
					if ( PackageData.main && PackageData.main.length > 0 ){ 
						packPather = path.resolve(pather, PackageData.main); 
					}else{ 
						packPather = path.resolve(pather, 'index.js'); 
					};
					if ( this.FileExist(packPather) ) return packPather; 
				}catch(e){}
			}else{
				packPather = path.resolve(pather, 'index.js');
				if ( this.FileExist(packPather) ) return packPather; 
			};
		},
		
		lazy: function(pather){
			if ( !this.FileExist(pather) && this.FolderExist(pather) ){
				pather = path.resolve(pather, 'index.js');
			};
			return pather;
		}
	}
	
}).call(this, path);