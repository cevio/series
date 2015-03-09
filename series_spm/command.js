(function(){
	var doing = false;
	var web = 'http://api.webkits.cn';
	var jsonp = 'iisnode';
	
	$('#cmd').on('keyup', function(event){ if ( event.keyCode === 13 && !doing ){ parseCMD(); } });
	$('#cmd').on('blur', function(){ $(this).focus(); }).focus();
	
	function pushError(msg){
		$('.message ul').append('<li class="error"><span>&gt; @ ERROR: </span>' + msg + '</li>');		
	}
	
	function pushLine(msg){
		$('.message ul').append('<li>' + msg + '</li>');		
	}
	
	function parseCMD(){
		var value = $('#cmd').val();
		if (value.length > 0){
			value = value.replace(/\s+/g, ' ').split(' ');
			var spm = value[0];
			var method = value[1];
			var args = value.slice(2) || [];
			
			pushLine('<font color="#FC6">- &gt; ' + value.join(' ') + '</font>');
			
			if ( /spm/i.test(spm) ){
				if ( command[method] ){
					command[method].apply($('.message ul'), args);
				}else{
					sendCMD(value.join(' '));
				}
			}else{
				pushError('no support namespace.');
			}
		}
	}
	
	function post(data, callback){
		doing = true;
		$.post('/spm/cmd', data, function(msg){
			if ( msg.error === 0 ){
				typeof callback == 'function' && callback.call($('.message ul'), msg);
			}else{
				pushError(msg.message);
			}
			$('#cmd').val('');
			doing = false;
		}, 'json');
	}
	
	function sendCMD(value, callback){
		post({ cmd: value }, function(msg){
			console.log(msg)
			if ( msg.chunks && msg.chunks.length > 0 ){
				for ( var i = 0 ; i < msg.chunks.length ; i++ ){
					this.append('<li>' + msg.chunks[i] + '</li>');
				}
			}
			
			typeof callback == 'function' && callback();
		});
	}
	
	function remote(url, data, callback){
		$.ajax({
			url: web + '/spm/' + url,
			dataType: 'jsonp',
			data: data || {},
			jsonp: jsonp,
			success: callback,
			error: function(){
				pushError('remote server callback error.');
			}
		})
	}
	
	function downing(element){
		var roll = function(i){
			if ( i > 5 ){ i = 0 ; };
			var d = '.';
			for ( var j = 0 ; j < i; j++ ){
				d += '.';
			}
			element.timer = $(element).html('<font color="#FC6">- loading ' + d + '</font>');
			element.timer = setTimeout(function(){
				roll(i + 1);
			}, 1000);
		}
		element.stop = function(){
			try{
				clearTimeout(element.timer);
				setTimeout(function(){
					$(element).parent().animate({opacity: 0}, 'slow', function(){
						$(this).remove();
					});
				}, 1000);
			}catch(e){}
		}
		roll(0);
	}
	
	var command = {};
	command.install = function(name){
		pushLine('- <font color="green"># getting package message from ' + web + '/spm/get/' + name + '</font>');
		remote('get/' + name, {}, function(msg){
			if ( msg.error === 0 ){
				var data = msg.data;
				pushLine('<pre>- ' + name + ' package message:</pre>');
				pushLine('<pre>    <font color="#555">* version: ' + data.version + '</font></pre>');
				pushLine('<pre>    <font color="#555">* homepage: ' + data.homepage + '</font></pre>');
				pushLine('<pre>    <font color="#555">* zip: ' + data.zip + '</font></pre>');
				
				if ( data.author ){
					pushLine('<pre>    <font color="#555">* author: ' + data.author.name + '</font></pre>');
					pushLine('<pre>    <font color="#555">* email: ' + data.author.email + '</font></pre>');
					pushLine('<pre>    <font color="#555">* url: ' + data.author.url + '</font></pre>');
				}
				
				pushLine('- <font color="green"># downloading package from ' + data.zip + '</font>');
				var loading = document.createElement('span');
				var li = document.createElement('li');
				$('.message ul').append(li);
				$(li).append(loading);
				downing(loading);
				
				sendCMD('spm download ' + data.zip + ' ' + name, function(){
					loading.stop();
					pushLine('- <font color="#069">@ package module [' + name + '] download complete.</font>');
				});
			}else{
				pushError(msg.message);
			}
		});
	}
	
	command.compress = function(source, target){
		sendCMD('spm compress ' + source + ' ' + target, function(){
			pushLine('- <font color="#069"># compress success!</font>');
		});
	}
	
}).call(this);
