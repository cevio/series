(function(){
	
	var _ = this._ || _
		,	obj = new ActiveXObject("Scripting.FileSystemObject")
		,	ft = function(pather){ return obj.FileExists(pather); }
		,	cwd = path.server(process.cwd())
		, series_modules = process.bags
		;
		
	this.Resolve = misify;
	this.Resolve.get = misify;
	this.Resolve.dirify = pickMatcher;
	this.Resolve.filify = MatchSelect;
	
	/**
	 * 判断是否已经到根目录
	 */
	function reachRoot(pather){
		return path.relative(pather, cwd).length === 0;
	}
	
	/** 
	 * 对于任意一个文件夹下的查询规则
	 * 优先查询package.json中的main，判断main所在文件是否存在
	 * 其次查询index.js文件是否存在
	 */
	function pickMatcher(dir){
		var packageFile = path.resolve(dir, 'package.json')
			,	indexFile = path.resolve(dir, 'index.js')
			,	resolveFile;
			
		if ( ft(packageFile) ){
			var cofnigs = JSON.parse(fs.readFile(packageFile));
			if ( cofnigs.main ){
				resolveFile = MatchSelect(path.resolve(dir, cofnigs.main));
			}
		}
		
		if ( !resolveFile && ft(indexFile) ){
			resolveFile = indexFile;
		}
		
		return resolveFile;
	}
	
	/**
	 * 判断一个选择器路径是否存在
	 * 优先判断文件是否存在
	 * 其次判断文件+js是否存在
	 * 最后判断文件夹
	 */
	function MatchSelect(file){
		var ext = path.extname(file).toLowerCase();
		if ( ft(file) ){
			return file;
		}
		else{
			if ( ext !== '.js' ){
				var _file = file + '.js';
				if ( ft(_file) ){
					return _file;
				}
			}
			// 如果查询条件是a.js为文件夹，那么直接搜索文件夹。
			return pickMatcher(file);
		}
	}
	
	/**
	 * 查询模块的所在文件
	 * 通过递归查询，逐级往上查找
	 * 区分系统模块和用户模块
	 */
	function searchSysModule(dir, file){
		var _file = path.resolve(dir, series_modules, file);
		var isRoot = reachRoot(dir);
		var getter = MatchSelect(_file);
		if ( getter ){
			return getter;
		}else{
			if ( !isRoot ){
				return searchSysModule(path.resolve(dir, '..'), file);
			}
		}
	}
	
	/**
	 * 模糊查找模块
	 */
	function misify(dir, file){
		if ( /^[\.|\/]/.test(file) ){
			return MatchSelect(path.resolve(dir, file));
		}else{
			var sysModule = searchSysModule(dir, file);
			if ( sysModule ){
				return sysModule;
			}else{
				return MatchSelect(path.resolve(dir, file));
			}
		}
	}
	
}).call(this);