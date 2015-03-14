;(function(path){
	
	this.Resolve = {
		fso: new ActiveXObject("Scripting.FileSystemObject"),
		FolderExist: function(pather){ return this.fso.FolderExists(pather); },
		FileExist: function(pather){ return this.fso.FileExists(pather); },
		
		get: function(dirname, selector){
			selector = selector.replace(/\\/g, '/');
			if ( /^\.\//.test(selector) || /^\.\.\//.test(selector) || /\//.test(selector) ){
				var a = path.resolve(dirname, selector);
				var b = this.ext(a);
				if ( a != b ){
					return b;
				}else{
					return this.lazy(a);
				}
			}else{
				var cwd = Server.MapPath(process.cwd());
				var that = this;
				var findPatherBags = function(dir, sec){
					var isRoot = path.relative(dir, cwd).length === 0,
						realPath = path.resolve(dir, process.bags, sec),
						pather = path.resolve(dir, sec),
						_pather = that.ext(pather),
						matcher;

					if ( that.FolderExist(realPath) && !!( matcher = that.match(realPath) ) ){ return matcher; }
					else if ( pather != _pather ){ return _pather; }	
					else if ( isRoot ){ return that.ext(path.resolve(dirname, sec)); }
					else{ return findPatherBags(path.resolve(dir, '..'), sec); };
				};
				return this.lazy(findPatherBags(dirname, selector));
			}
		},
		
		match: function( pather ){
			var packPather = path.resolve(pather, 'package.json');

			if ( this.FileExist(packPather) ){
					var PackageData = JSON.parse(fs.readFile(packPather));
					if ( PackageData.main && PackageData.main.length > 0 ){ 
						packPather = path.resolve(pather, PackageData.main); 
					}else{ 
						packPather = path.resolve(pather, 'index.js'); 
					};
					
					var _pp = packPather;
					if (  !/\.js$/i.test(packPather) ){
						_pp = _pp + '.js';
					}
					
					if ( this.FileExist(packPather) ) { 
						return packPather; 
					}
					else if ( this.FileExist(_pp) ){
						return _pp;
					}
					else if ( this.FolderExist(packPather) ){
						var zindex = path.resolve(packPather, 'index.js');
						if ( this.FileExist(zindex) ){
							return zindex;
						}
					}
			}else{
				packPather = path.resolve(pather, 'index.js');
				if ( this.FileExist(packPather) ) return packPather; 
			};
		},
		
		lazy: function(pather){
			if ( !this.FileExist(pather) && this.FolderExist(pather) ){
				var matches = this.match(pather);
				if ( matches ){
					return matches;
				}
			};
			return pather;
		},
		
		ext: function(pather){
			if ( this.FileExist(pather) ){
				return pather;
			}
			
			if ( !/\.js$/i.test(pather) ){
				var pathers = pather + '.js';
				if ( this.FileExist(pathers) ){
					return pathers;
				}
			}
			
			return pather;
		}
	}
	
}).call(this, path);