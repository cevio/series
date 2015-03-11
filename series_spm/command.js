(function (mod) {
	// commonjs support
	if ( 
		typeof exports == "object" && 
		typeof module == "object"
	){ 
		module.exports = mod(true); 
	}
	
	// amd support
	else if (
		typeof define == "function" && 
		define.amd
	){ 
		return define(['jquery'], mod); 
	}
	
	// brower support
	else { 
		window.command = mod(); 
	}
})(function( jQuery ){
	
	if ( !window.$ ){
		window.$ = jQuery;
	}
	
	var web = 'http://api.webkits.cn';
	var jsonp = 'iisnode';
	var slice = Array.prototype.slice;
	
	function init(){
		$('#cmd').on('keyup', function(event){ if ( event.keyCode === 13 ){ init.main($('#cmd').val()); } });
		$('#cmd').on('blur', function(){ $(this).focus(); }).focus();
	}
	
	init.remote = function(url, data){
		return new Promise(function(resolve, reject){
			$.ajax({
				url: web + '/spm/' + url,
				dataType: 'jsonp',
				data: data || {},
				jsonp: jsonp,
				timeout: 3 * 60 * 1000,
				success: function(msg){
					resolve(msg);
				},
				error: function(xhr, status){
					try{
						xhr.abort();
					}catch(e){}
					reject(status);
				}
			})
		});
	}
	
	init.require = function(deps){
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
	
	init.post = function(data){
		return new Promise(function(resolve, reject){
			$.ajax({
				url: '/spm/cmd',
				data: data,
				type: 'post',
				dataType: 'json',
				timeout: 3 * 60 * 1000,
				success: function(msg){
					if ( msg.error === 0 ){ resolve(msg); }
					else{ reject(msg); }
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){
					try{ XMLHttpRequest.abort(); }catch(e){}
					reject({ message: 'request catch error: ' + textStatus });
				}
			});
		})
	}
	
	init.delay = function(element){
		var loading, percent, li;
		
		if ( !element ){
			loading = document.createElement('span');
			percent = document.createElement('span');
			li = document.createElement('li');
			$('.message ul').append(li);
			$(li).append(loading);
			$(li).append(percent);
		}else{
			element = $(element);
			var spans = element.find('span');
			loading = spans.get(0);
			percent = spans.get(1);
			li = element.get(0);
		}
		
		var roll = function(i){
			if ( i > 5 ){ i = 0 ; };
			var d = '.';
			for ( var j = 0 ; j < i; j++ ){
				d += '.';
			}
			li.timer = $(loading).html('<font color="#FC6">- $ loading ' + d + '</font>');
			li.timer = setTimeout(function(){
				roll(i + 1);
			}, 1000);
		}
		
		li.stop = function(){
			try{
				clearTimeout(li.timer);
				setTimeout(function(){
					$(li).animate({opacity: 0}, 'slow', function(){
						$(this).remove();
					});
				}, 0);
			}catch(e){}
		}
		
		roll(0);
		
		return [li, loading, percent];
	}
	
	init.send = function(cmd, element){
		return init.post({ cmd: cmd }).then(function(msg){
			if ( msg.chunks && msg.chunks.length > 0 ){
				for ( var i = 0 ; i < msg.chunks.length ; i++ ){
					pushLine(msg.chunks[i]);
				}
				scrolltop();
			}
			return msg;
		})['catch'](function(msg){
			pushError(msg.message);
			return msg;
		});
	}
	
	init.resize = scrolltop;
	init.pushError = pushError;
	init.pushSuccess = pushLine;
	init.web = web;
	init.jsonp = jsonp;
	
	init.main = function(value){ 
		if ( value.length > 0 ){
			value = value.replace(/\s+/g, ' ').split(' ');
			
			var spm = value[0]
				,	method = value[1]
				,	args = [];
				
			if ( value.length > 2 ) args = value.slice(2) || [];
			
			pushLine('<font color="#FC6">- &gt; ' + value.join(' ') + '</font>');
			$('#cmd').val('');
			
			return new Promise(function(resolve, reject){
				if ( window.spmDeps[spm] ){
					init.require(window.spmDeps[spm]).then(function(modal){
						if ( modal[method] ){
							modal[method].apply(init, args).then(resolve)['catch'](reject);
						}else{
							init.send(value.join(' ')).then(resolve)['catch'](reject);
						}
					})['catch'](function(e){
						pushError('cmd ui [' + spm + '] required, but it missed.');
					});
				}else{
					init.send(value.join(' ')).then(resolve)['catch'](reject);
				}
			});
		}else{
			return Promise.reject({ error: 1, message: 'no command required.' });
		}
	}
	
	function pushError(msg){ $('.message ul').append('<li class="error"><span>&gt; @ ERROR: </span>' + msg + '</li>'); }
	function pushLine(msg){ $('.message ul').append('<li>' + msg + '</li>'); }
	function scrolltop(){ $('body').scrollTop($('body').outerHeight()); }
	
	
	return init;
});