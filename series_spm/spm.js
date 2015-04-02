/**
 * depencies
 */
require(['jquery'], function($){
	
	var slice = Array.prototype.slice
		,	web = 'http://api.webkits.cn'
		,	jsonp = 'iisnode'
		,	posting = false
		,	order = 0
		,	ul
		, argvs = []
		,	promiser = Promise.resolve();
		
	var spm = function(){
		ul = $('#console');
		spm.init();
	}
	
	spm.ui = function(html){
		var li = document.createElement('li');
		ul.append(li);
		li.innerHTML = html;
		spm.scrolltop();
		return li;
	}
	
	spm.ui.command = function(val){
		var li = spm.ui('<span class="dot">$</span><span class="dot key">COMMAND</span><span>' + val + '</span>');
		$(li).addClass('cmd');
		return li;
	}
	
	spm.ui.success = function(val){
		var li = spm.ui('<span class="dot">#</span><span class="dot key">SUCCESS</span><span>' + val + '</span>');
		$(li).addClass('success');
		return li;
	}
	
	spm.ui.warning = function(val){
		var li = spm.ui('<span class="dot">!</span><span class="dot key">WARNING</span><span>' + val + '</span>');
		$(li).addClass('warning');
		return li;
	}
	
	spm.ui.error = function(val){
		var li = spm.ui('<span class="dot">@</span><span class="dot key">FAILURE</span><span>' + val + '</span>');
		$(li).addClass('error');
		return li;
	}
	
	spm.ui.info = function(val){
		var li = spm.ui('<span class="dot">%</span><span>' + val + '</span>');
		$(li).addClass('info');
		return li;
	}
	
	spm.ui.log = function(val){
		var li = spm.ui('<span class="dot">%</span><span>' + val + '</span>');
		$(li).addClass('log');
		return li;
	}
	
	spm.ui.normal = function(val){
		var li = spm.ui('<span class="dot">%</span><span>' + val + '</span>');
		return li;
	}
	
	spm.ui.debug = function(val){
		var li = spm.ui('<span class="dot">&gt;</span><span class="dot key">DEBUGER</span><pre>' + val + '</pre><div class="clear"></div>');
		return li;
	}
	
	spm.ui.list = function(title, arrays){
		var h = [];
		for ( var i = 0 ; i < arrays.length ; i++ ){
			h.push('<li><span class="dot">-</span><span>' + arrays[i] + '</span></li>');
		}
		var li = spm.ui('<div class="title"><span class="dot">+</span><span>' + title + ':</span></div><ul>' + h.join('') + '</ul>');
		$(li).addClass('list');
		return li;
	}
	
	spm.ui.percent = function(){
		var li = spm.ui.info('<div class="process"><div class="bar"></div></div><div class="number"></div>');
		var numbers = $(li).find('.number');
		var bar = $(li).find('.bar');
		$(li).addClass('percent');
		
		li.set = function(number){
			if ( !number ) number = 0;
			var p = '0%';
			if ( number > 0 ){
				p = (number * 100).toFixed(2) + '%';
			}
			numbers.html(p);
			bar.css('width', p);
		}
		
		li.stop = function(){
			setTimeout(function(){
				$(li).animate({opacity: 0}, 'slow', function(){
					$(this).remove();
				});
			}, 1000);
		}
		
		li.set();
		
		return li;
	}
	
	spm.put = function(){
		var method = slice.call(arguments, 0, 1)
			,	args = slice.call(arguments, 1) || [];
			
		return spm.ui[method].apply(spm.ui, args);
	}
	
	spm.formatCommandToArray = function(str){
		var args = str.match( /"((\\")|[^"])+"|\s([^"\s]+)(?=\s)|^[^"]+?(?=\s)|\s[^"]+?$/g );
		
		for ( var i = 0; i < args.length ; i++ ) {
			args[i] = args[i].replace(/(^\s|^\"|\"$)/g, '');
			args[i] = args[i].replace(/\\"/g, '"');
		}
		
		args.value = str;
		
		return args;
	}
	
	spm.scrolltop = function(){
		$('body').scrollTop($('body').outerHeight());
	}
	
	spm.clear = function(){
		ul.empty();
	}
	
	spm.local = function(data){
		return new Promise(function(resolve, reject){
			$.ajax({
				url: '/spm/cmd',
				data: data,
				type: 'post',
				dataType: 'json',
				timeout: 3 * 60 * 1000,
				success: function(msg){ resolve(msg); },
				error: function(XMLHttpRequest, textStatus, errorThrown){
					try{ XMLHttpRequest.abort(); }catch(e){};
					spm.put('error', 'Local request catch error: cased by ' + textStatus);
					reject();
				}
			});
		})
	}
	
	spm.send = function(cd){
		return spm.local({cmd: cd}).then(function(value){
			if ( _.isArray(value) ) spm.put.apply(spm, value);
			return Promise.resolve(value);
		})['catch'](function(e){
			if ( e && e.message ){
				spm.ui.error(e.message);
			}
			return Promise.reject(e);
		});
	}
	
	spm.remote = function(url, data){
		return new Promise(function(resolve, reject){
			$.ajax({
				url: web + '/spm/' + url,
				dataType: 'jsonp',
				data: data || {},
				jsonp: jsonp,
				timeout: 3 * 60 * 1000,
				success: function(msg){ resolve(msg); },
				error: function(xhr, status){
					try{ xhr.abort(); }catch(e){};
					spm.put('error', 'Remote request catch error: cased by ' + status);
					reject();
				}
			})
		});
	}
	
	spm.require = function(deps){
		if ( !_.isArray(deps) ){
			deps = [deps];
		}
		
		return new Promise(function(resolve){
			require(deps, function(){
				var args = slice.call(arguments, 0);
				if ( args.length == 0 ){
					args = null;
				}else if ( args.length === 1 ){
					args = args[0];
				}
				resolve(args);
			});
		});
	}
	
	spm.compiler = function(val){
		val = val || $('#cmd').val();
		spm.put('command', val);
		spm.store(val);
		$('#cmd').val('');
		
		var mats = spm.formatCommandToArray(val) 	// 格式化命令
			,	_spm = mats[0]												// 模块名
			,	_method = mats[1]											// 方法
			,	_args = [];														// 参数
		
		// 获取参数内容		
		if ( mats.length > 2 ) _args = mats.slice(2) || [];
		
		// 判断是否需要require模块的jspm文件
		if ( window.spmDeps[_spm] ){
			// require it.
			return spm.require(window.spmDeps[_spm]).then(function(modal){
				if ( modal[_method] ){ 
					return modal[_method].apply(modal, _args); 
				}
				else{ 
					return spm.send(mats.value); 
				};
			});
		}else{
			// send command.
			return spm.send(mats.value);
		}
	}
	
	spm.store = function(val){
		var i = argvs.indexOf(val);
		if ( i > -1 ){
			argvs.splice(i, 1);
		};
		argvs.push(val);
		order = argvs.length - 1;
	}
	
	spm.keyup = function(code){
		switch (code){
			case 13:
				spm.compiler()['catch'](function(e){
					if ( e && e.message ) e = e.message;
					spm.ui.error(e);
				});
				break;
			case 38:
				loopCMD(true);
				break;
			case 40:
				loopCMD(false);
				break;
		}
	}
	
	spm.debug = function(){
		var bugs = spm.local({ cmd: 'debug run' }).then(function(msg){
			if ( msg.length > 0 ){
				for ( var i = 0 ; i < msg.length ; i++ ){
					spm.put.apply(spm, ['debug', msg[i]]);
				}
			}
		});
		spm.next(bugs);
	}
	
	spm.next = function(cb){
		console.log(cb)
		promiser = promiser.then(function(val){
			if ( cb.then ){ return cb; }
			else{
				return cb(val);
			}
		});
	}
	
	spm.init = function(){
		$('#cmd').on('keyup', function(event){ spm.keyup(event.keyCode); });
		$('#cmd').on('blur', function(){ $(this).focus(); }).focus();
		$(window).focus(function(){ $('#cmd').focus(); spm.debug(); });	
	}

	window.spm = spm; $(spm);
	
	function loopCMD(up){
		if ( up ){ order--; }
		else{ order++; }
		
		if ( order < 0 ){
			order = argvs.length - 1;
		}
		else if ( order >= argvs.length ){
			order = 0;
		}
		
		if ( argvs[order] ){
			$('#cmd').val(argvs[order]);
		}
	}
});