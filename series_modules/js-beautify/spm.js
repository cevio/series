var shorts = {
	// Beautifier
	'-s': 'indent_size',
	'-c': 'indent_char',
	'-l': 'indent_level',
	'-t': 'indent_with_tabs',
	'-p': 'preserve_newlines',
	'-m': 'max_preserve_newlines',
	'-P': 'space_in_paren',
	'-E': 'space_in_empty_paren',
	'-j': 'jslint_happy',
	'-a': 'space_after_anon_function',
	'-b': 'brace_style',
	'-B': 'break_chained_methods',
	'-k': 'keep_array_indentation',
	'-x': 'unescape_strings',
	'-w': 'wrap_line_length',
	'-X': 'e4x',
	'-n': 'end_with_newline',
	'-C': 'comma_first',
	// CSS-only
	'-L': 'selector_separator_newline',
	'-N': 'newline_between_rules',
	// HTML-only
	'-A': 'wrap_attributes',
	'-i': 'wrap_attributes_indent_size',
	'-W': 'max_char', // obsolete since 1.3.5
	'-U': 'unformatted',
	'-I': 'indent_inner_html',
	'-S': 'indent_scripts'
};

var options = {
    'indent_size': 4,
    'indent_char': ' ',
    'indent_level': 0,
    'indent_with_tabs': false,
    'preserve_newlines': true,
    'max_preserve_newlines': 10,
    'jslint_happy': false,
    'space_after_anon_function': false,
    'brace_style': 'collapse',
    'keep_array_indentation': false,
    'keep_function_indentation': false,
    'space_before_conditional': true,
    'break_chained_methods': false,
    'eval_code': false,
    'unescape_strings': false,
    'wrap_line_length': 0
};

/*
	input: 输入的字符串内容
	type: [js, html, css]
	option: 配置文件
	output: 输出路径，可选
*/
var format = function(input, type, option, output){
	try {
		var beautify = require('js-beautify'),
			value;
		
		if ( type === 'css' ) {
			value = beautify.css(input, option);
		}else if ( type === 'html' ) {
			value = beautify.html(input, option);
		}else{
			value = beautify.js(input, option);
		}
		
		if ( output ) {
			fs.writeFile(output, value);
		}
		
		// 将html的<>转义显示到spm上
		if ( type === 'html' ) {
			value = value.replace(/</g, '&lt;').replace(/g/, '&gt;');
		}
				
		return { error: 0, chunks: ['<font color="#0F0">- # Result: </font>', '<font color="#080"><pre>' + value + '</pre></font>'] };
	}catch(e){
		return { error: 1, message: ' error: ' + e.message };
	}
}

/*
	入口处理函数
	method: 方法名称
	args:参数列表
*/
var main = function(method, args){
	var type = 'js',
		input = '',
		output = false;	
	
	var option = options;
	
	for (var i=1; i<args.length; i++) {
		if (/^-[a-zA-Z]$/.test(args[i])) {
			switch (args[i]) {
				case '-r':
					// 替换原文件
					if ( method === '-f' ) {
						output = args[0];
					}
					break;
				case '-o':
					// 输出新文件
					if ( args[i+1] ) {
						output = args[i+1];
						i++;
					}
					break;
				default:
					// 配置参数
					if ( shorts[args[i]] && args[i+1] ) {
						option[shorts[args[i]]] = args[i+1];
						i++;
					}
			}
		}
		
		if (/\.json$/.test(args[i])) {
			option = require(args[i]);
		}
	}
	
	switch (method) {
		case '-files':
			input = path.resolve(__dirname, args[0]);
			
			// 遍历所有文件，然后按照-f的方式操作，这个模式下，统一输出到指定目录
			var findFiles = function(dir){
				var files = [];
				var obj = fs.readDir(dir);
				_.each(obj.file, function(file){
					files.push(String(file));
				});
				_.each(obj.dir, function(folder){
					folder = String(folder);
					files = files.concat(findFiles(folder));
				});
				return files;
			}
			
			var files = findFiles(input);
			if ( files.length > 0 ){
				return { error: 0, files: files };
			}else{
				return { error: 1, message: 'There is no file to beautify.' };
			}

			break;
		case '-f':
			var file = path.resolve(__dirname, args[0]);
			var ext = path.extname(file).toLowerCase();
			
			if (ext == '.htm' || ext == '.html') {
				type = 'html';
			}else if (ext == '.css') {
				type = 'css';
			}else{
				type = 'js';
			}
			
			input = fs.readFile(file);
			
			break;
		case 'js':
			type = 'js';
			input = args[0];
			break;
		case 'css':
			type = 'css';
			input = args[0];
			break;
		case 'html':
			type = 'html';
			input = args[0];
			break;
	}
	
	return format(input, type, option, output);
}

var list = ['-f', '-files', 'js', 'css', 'html'];				// 方法列表
_.each(list, function(method){
	exports[method] = function(){
		if (!arguments.length) {
			return { error: 1, message: '参数不足!' };
		}
		
		try {
			return main(method, Array.prototype.slice.call(arguments, 0) || []);
		}catch(e){
			return { error: 1, message: e.message };
		}
	}
});

exports.help = function(){
	var h = [];
	
	h.push('Demo:');
	h.push('js-beautify -f foo.js -r');
	h.push('js-beautify -f foo.css -o foo.format.css');
	h.push('js-beautify -f foo.html config.json');
	h.push('js-beautify -d foo config.json');
	h.push('js-beautify js "if (\'this_is\'==/an_example/){of_beautifer();}else{var a=b?(c%d):e[f];}"');
	
	h.push('CLI Options:');
	h.push('  -f, --file       Input file(s)');
	h.push('  -d, --folder     Input folder');
	h.push('  -r, --replace    Write output in-place, replacing input');
	h.push('  -o, --outfile    Write output to file');
	h.push('  --config         Path to config file');
	h.push('  --type           [js|css|html] ["js"]');
	
	h.push('JS Beautifier Options:');
	h.push('  -s, --indent-size                 Indentation size [4]');
	h.push('  -c, --indent-char                 Indentation character [" "]');
	h.push('  -l, --indent-level                Initial indentation level [0]');
	h.push('  -t, --indent-with-tabs            Indent with tabs, overrides -s and -c');
	h.push('  -p, --preserve-newlines           Preserve line-breaks (--no-preserve-newlines disables)');
	h.push('  -m, --max-preserve-newlines       Number of line-breaks to be preserved in one chunk [10]');
	h.push('  -P, --space-in-paren              Add padding spaces within paren, ie. f( a, b )');
	h.push('  -j, --jslint-happy                Enable jslint-stricter mode');
	h.push('  -a, --space-after-anon-function   Add a space before an anonymous function\'s parens, ie. function ()');
	h.push('  -b, --brace-style                 [collapse|expand|end-expand|none] ["collapse"]');
	h.push('  -B, --break-chained-methods       Break chained method calls across subsequent lines');
	h.push('  -k, --keep-array-indentation      Preserve array indentation');
	h.push('  -x, --unescape-strings            Decode printable characters encoded in xNN notation');
	h.push('  -w, --wrap-line-length            Wrap lines at next opportunity after N characters [0]');
	h.push('  -X, --e4x                         Pass E4X xml literals through untouched');
	h.push('  -n, --end-with-newline            End output with newline');
	h.push('  -C, --comma-first                 Put commas at the beginning of new line instead of end');

	h.push('CSS Beautifier Options:');
	h.push('  -s, --indent-size                  Indentation size [4]');
	h.push('  -c, --indent-char                  Indentation character [" "]');
	h.push('  -L, --selector-separator-newline   Add a newline between multiple selectors');
	h.push('  -N, --newline-between-rules        Add a newline between CSS rules');

	h.push('HTML Beautifier Options:');
	h.push('  -I, --indent-inner-html            Indent <head> and <body> sections. Default is false.');
	h.push('  -s, --indent-size                  Indentation size [4]');
	h.push('  -c, --indent-char                  Indentation character [" "]');
	h.push('  -b, --brace-style                  [collapse|expand|end-expand|none] ["collapse"]');
	h.push('  -S, --indent-scripts               [keep|separate|normal] ["normal"]');
	h.push('  -w, --wrap-line-length             Maximum characters per line (0 disables) [250]');
	h.push('  -A, --wrap-attributes              Wrap attributes to new lines [auto|force] ["auto"]');
	h.push('  -i, --wrap-attributes-indent-size  Indent wrapped attributes to after N characters [indent-size]');
	h.push('  -p, --preserve-newlines            Preserve existing line-breaks (--no-preserve-newlines disables)');
	h.push('  -m, --max-preserve-newlines        Maximum number of line-breaks to be preserved in one chunk [10]');
	h.push('  -U, --unformatted                  List of tags (defaults to inline) that should not be reformatted');
	h.push('  -n, --end-with-newline             End output with newline');
	
	for (var i=0; i<h.length; i++) {
		h[i] = h[i].replace(/\s/g, '&nbsp;')
		h[i] = '<font color="#F4D">- > {0}</font>'.replace('{0}', h[i]);
	}
	
	return { error: 0, chunks: h };
}
