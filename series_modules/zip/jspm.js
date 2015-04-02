define(['jquery'], function($){
	var proto = {};
	
	proto.get = function(dir, modal, keys){
		var masker = this.delay();
		var that = this;
		var mark;	// 内存标识，重要!!!
		$(masker[2]).html('0%');
		return this.main('zip files "' + dir + '" ' + modal).then(function(msg){
			var files = msg.files;
			
			if ( files.length === 0 ){
				that.pushError('no file to compress.');
				masker[0].stop();
				return;
			}

			var i = 0;
			mark = msg.mark;
			
//			_.each(files, function(file){
//				that.pushSuccess('<pre>  <font color="#aaa">* ' + file + '</font></pre>');
//			});
			
			var postZip = function(resolve, reject){
				if ( files[i] ){
					try{
						proto.process.call(that, files[i], dir, mark, i).then(function(data){
							if ( data.error === 0 ){
								masker[2].innerHTML = (((i + 1) / files.length) * 100).toFixed(2) + '%';
								i++;
								postZip(resolve, reject);
							}else{
								reject(data);
							}
						})['catch'](reject);
					}catch(e){
						reject(e);
					}
				}else{
					resolve();
				}
			}

			return new Promise(function(a, b){
				postZip(a, b);
			});
		}).then(function(){
			return that.send('zip create ' + mark);
		}).then(function(){
			masker[0].stop();
			that.pushSuccess('<font color="#9C3">- % zip compress process done! </font>');
			return mark;
		});
	}
	
	proto.process = function(file, dir, str, i){
		var d = [file, dir, str, i];
		return this.send('zip appzip ' + d.join(' '));
	}
	
	return proto;
});