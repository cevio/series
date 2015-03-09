// JavaScript Document

/*
 * use example:
 * ---------------------------------------------------------------------------
 
		var compressor = require('compressor');
		var content = compressor.compress(require.resolve('zxp'), 'zxp');
		fs.writeFile(path.resolve(path.dirname(require.resolve('zxp')), './dist/zxp.js'), content);
		res.log('compress success!');	
	
 * by evio 2015/3/6
 */

var proto = module.exports = function(pather, name){
	return proto.handle(pather, name);
}

proto.handle = function(pather, name){
	var main = [], list = {};
	if ( !name ) name = path.basename(pather).split('.')[0];
	proto.dependencies(pather, main, list);
	return proto.grunt(pather, main, name);
}

proto.dependencies = function(pather, main, list){
	if ( !list[pather] ){
		list[pather] = true;
		
		var content = fs.readFileSync(pather)
			,	folder = path.dirname(pather)
			,	deps = parseDependencies(content);
		
		if ( path.extname(pather).toLowerCase() === '.json' ){
			content = 'module.exports=' + content;
		}
	
		content = deps.content;
		deps = deps.deps;
		
		var ret = { 
			content: content, 
			deps: deps, 
			id: pather, 
			resolve: {} 
		};
		
		_.each(deps, function( dep ){
			var realPather = Global.Resolve.get(folder, dep);
			ret.resolve[dep] = realPather;
			proto.dependencies(realPather, main, list);
		});
		
		main.push(ret);
	}
}

proto.grunt = function(pather, main, name){
	var indexs = {}, ret = {}, chunked = {};
	
	_.each(main, function(detail, i){
		if ( !indexs[detail.id] ) indexs[detail.id] = i + 1; 
	});
		
	_.each(main, function(detail, i){ 
		if ( _.isUndefined(chunked[detail.id]) ){
			var fn = 'function(_dereq_, module, exports){\n' + detail.content + '\n}'
				, deps = {}
				, resolves = detail.resolve;
			
			_.each(detail.deps, function(dep){
				deps[dep] = indexs[resolves[dep]];
			});
			
			ret[i + 1] = [fn, deps];
			chunked[detail.id] = true;
		}
	});
	
	return proto.ready(pather, ret, indexs, name);
}

proto.ready = function(pather, ret, indexs, name){
	var text = [], s = indexs[pather], code = '';
	
	_.each(ret, function(value, key){
		text.push(key + ':[' + value[0] + ',' + JSON.stringify(value[1]) + ']');
	});
//console.log(fs.readFile(require.resolve('./wrap.js')), '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')	
	if ( s > 0 ){
		code = fs.readFile(require.resolve('./wrap.js'))
			.replace('<?{$ID$}?>', s)
			.replace('<?{$IDE$}?>', s)
			.replace('<?{$WINAME$}?>', name)
			.replace('<?{$JSONCODE$}?>', '{' + text.join(',') + '}');
	}

	return code;
}

function parseDependencies(s) {
  if(s.indexOf('require') == -1) {
    return {content: s, deps: []}
  }
  var index = 0, peek, length = s.length, isReg = 1, modName = 0, parentheseState = 0, parentheseStack = [], res = []
  while(index < length) {
    readch()
    if(isBlank()) {
    }
    else if(isQuote()) {
      dealQuote()
      isReg = 1
    }
    else if(peek == '/') {
      readch()
      if(peek == '/') {
        index = s.indexOf('\n', index)
        if(index == -1) {
          index = s.length
        }
      }
      else if(peek == '*') {
        index = s.indexOf('*/', index)
        if(index == -1) {
          index = length
        }
        else {
          index += 2
        }
      }
      else if(isReg) {
        dealReg()
        isReg = 0
      }
      else {
        index--
        isReg = 1
      }
    }
    else if(isWord()) {
      dealWord()
    }
    else if(isNumber()) {
      dealNumber()
    }
    else if(peek == '(') {
      parentheseStack.push(parentheseState)
      isReg = 1
    }
    else if(peek == ')') {
      isReg = parentheseStack.pop()
    }
    else {
      isReg = peek != ']'
      modName = 0
    }
  }
  return {content: s, deps: res}
  function readch() {
    peek = s.charAt(index++)
  }
  function isBlank() {
    return /\s/.test(peek)
  }
  function isQuote() {
    return peek == '"' || peek == "'"
  }
  function dealQuote() {
    var start = index
    var c = peek
    var end = s.indexOf(c, start)
    if(end == -1) {
      index = length
    }
    else if(s.charAt(end - 1) != '\\') {
      index = end + 1
    }
    else {
      while(index < length) {
        readch()
        if(peek == '\\') {
          index++
        }
        else if(peek == c) {
          break
        }
      }
    }
    if(modName) {
      res.push(s.slice(start, index - 1))
      modName = 0
    }
  }
  function dealReg() {
    index--
    while(index < length) {
      readch()
      if(peek == '\\') {
        index++
      }
      else if(peek == '/') {
        break
      }
      else if(peek == '[') {
        while(index < length) {
          readch()
          if(peek == '\\') {
            index++
          }
          else if(peek == ']') {
            break
          }
        }
      }
    }
  }
  function isWord() {
    return /[a-z_$]/i.test(peek)
  }
  function dealWord() {
    var s2 = s.slice(index - 1);
		var s3 = s.slice(0, index - 1);
    var r = /^[\w$]+/.exec(s2)[0]
    parentheseState = {
      'if': 1,
      'for': 1,
      'while': 1,
      'with': 1
    }[r]
    isReg = {
      'break': 1,
      'case': 1,
      'continue': 1,
      'debugger': 1,
      'delete': 1,
      'do': 1,
      'else': 1,
      'false': 1,
      'if': 1,
      'in': 1,
      'instanceof': 1,
      'return': 1,
      'typeof': 1,
      'void': 1
    }[r]
    modName = /^require\s*\(\s*(['"]).+?\1\s*\)/.test(s2)
    if(modName) {
      r = /^require\s*\(\s*['"]/.exec(s2)[0]
      index += r.length - 2;
			//_dereq_
			//require
			
			s2 = s2.replace(/^require/, '_dereq_'); // add by evio
			s = s3 + s2;// add by evio
			
    }
    else {
      index += /^[\w$]+(?:\s*\.\s*[\w$]+)*/.exec(s2)[0].length - 1
    }
		
  }
  function isNumber() {
    return /\d/.test(peek)
      || peek == '.' && /\d/.test(s.charAt(index))
  }
  function dealNumber() {
    var s2 = s.slice(index - 1)
    var r
    if(peek == '.') {
      r = /^\.\d+(?:E[+-]?\d*)?\s*/i.exec(s2)[0]
    }
    else if(/^0x[\da-f]*/i.test(s2)) {
      r = /^0x[\da-f]*\s*/i.exec(s2)[0]
    }
    else {
      r = /^\d+\.?\d*(?:E[+-]?\d*)?\s*/i.exec(s2)[0]
    }
    index += r.length - 1
    isReg = 0
  }
}