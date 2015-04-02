define(['jquery'], function($){
	var proto = {};
	
	proto['-d'] = function(dir){
		var cmdLine = arguments[arguments.length - 1];
			cmdLine = cmdLine.replace('-d', '-f');

		var masker = this.delay();
		var that = this;
		$(masker[2]).html('0%');
		return this.main('js-beautify -files ' + dir).then(function(ret){
			if (ret.error > 0) {
				that.pushError('Only support js/css/html file.');
				return;
			}
			
			var files = ret.files,
				output = ret.output;

			var i = 0;
			
			_.each(files, function(file){
				that.pushSuccess('<pre>  <font color="#bbb">* ' + file + '</font></pre>');
			});
			
			var beautify = function(resolve, reject){
				if ( files[i] ){
					try{
						var line = cmdLine.replace(dir, files[i]) + ' -o ';
							line = line + files[i].replace(dir, dir + '.b');
							
						that.send(line).then(function(data){
							if ( data.error === 0 ){
								masker[2].innerHTML = (((i + 1) / files.length) * 100).toFixed(2) + '%';
								i++;
								beautify(resolve, reject);
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
				beautify(a, b);
			});
		}).then(function(){
			masker[0].stop();
			that.pushSuccess('<font color="#9C3">- % Beautify process done! </font>');
			that.pushSuccess('<font color="#9C3">- % Outputs: ' + dir + '.b </font>');
		});
	}
	
	return proto;
});