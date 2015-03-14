define(['jquery'], function($){
	var proto = {};
	
	proto.install = function(modal){
		var that = this;
		this.pushSuccess('- <font color="green"># getting package message from ' + this.web + '/spm/get/' + modal + '</font>');
		
		return this.remote('get/' + modal).then(function(msg){
			if ( msg.error === 0 ){
				var data = msg.data
					,	debrisCMD = 'debris download ' + data.zip + ' ../series_modules/' + modal + '.zip';
				that.pushSuccess('<pre>- % ' + modal + ' package message:</pre>');
				that.pushSuccess('<pre>  <font color="#555">* version: ' + data.version + '</font></pre>');
				that.pushSuccess('<pre>  <font color="#555">* homepage: ' + data.homepage + '</font></pre>');
				that.pushSuccess('<pre>  <font color="#555">* zip: ' + data.zip + '</font></pre>');
				
				if ( data.author ){
					that.pushSuccess('<pre>  <font color="#555">* author: ' + data.author.name + '</font></pre>');
					that.pushSuccess('<pre>  <font color="#555">* email: ' + data.author.email + '</font></pre>');
					that.pushSuccess('<pre>  <font color="#555">* url: ' + data.author.url + '</font></pre>');
				}
				
				that.pushSuccess('- <font color="green"># downloading package from ' + data.zip + '</font>');
				
				return that.main(debrisCMD).then(function(){
					return that.main('zip uncompress ../series_modules/' + modal + '.zip ../series_modules/' + modal);
				}).then(function(){
					return that.main('spm unlink ../series_modules/' + modal + '.zip');
				}).then(function(){
					return that.main('spm jspm ../series_modules/' + modal);
				}).then(function(value){
					window.spmDeps = _.extend(window.spmDeps, value.jspm || {});
					return value;
				})['catch'](function(e){ that.pushError(e.message); });
			}else{
				that.pushError(msg.message);
				return Promise.reject(msg);
			}
		})['catch'](function(e){
			that.pushError('- # remote url catch error.');
		});
	}
	
	proto.post = function(modal){
		var pather = '-:../series_modules/' + modal;
		var that = this;
		var masker = null;
		var x = null;
		return this.main('zip get ' + pather).then(function(str){
			masker = that.delay();
			x = str;
			return that.send('spm post ' + str);
		}).then(function(){
			return that.main('zip clear ' + x);
		}).then(function(s){
			if ( s.error == 0 ){
				that.pushSuccess('<font color="#777">- % the used application had been clear up by system.</font>');
				that.pushSuccess('<font color="#069">- # post module process complete.</font>');
			}else{
				that.pushError('- # post module error. [' + e.message + ']');
			}
			masker[0].stop();
		})['catch'](function(e){
			masker[0].stop();
			that.pushError('- # post module error. [' + e.message + ']');
		});
	}
	
	proto.list = function(){
		var masker = this.delay();
		var that = this;
		return this.remote('list').then(function(msg){
			_.each(msg, function(bags, modal){
				that.pushSuccess('<pre style="color:#aaa">- % <font color="#069">[' + modal + ']</font> @v' + bags.version + ' by ' + bags.author + ': ' + bags.description + '</pre>');
			});
			masker[0].stop();
		});
	}
	
	proto.grunt = function(){
		var masker = this.delay(), that = this;
		
		var sys = false, smo = false;
		
		return this.send('spm gruntfiles').then(function(data){
			var msg = data.msg;
			that.pushSuccess('<font color="#069">- @ ' + msg.workname + '</font>');
			that.pushSuccess('<font color="#9c3">- @ Load Support Modules:</font>');
			_.each(msg.compressor.sys, function(file){
				that.pushSuccess('<pre><font color="#aaa">  - % ' + file + '</font></pre>');
			});
			that.pushSuccess('<font color="#9c3">- @ Load Main Modules:</font>');
			_.each(msg.compressor.smo, function(file){
				that.pushSuccess('<pre><font color="#aaa">  - % ' + file + '</font></pre>');
			});
			that.pushSuccess('<font color="#f00">- @ Start to Grunt Files. Please Wait!</font>');
		}).then(function(){
			that.pushSuccess('- % Grunting Support Files...');
			return that.send('spm gruntsys').then(function(msg){
				if ( msg.error === 0 ){
					sys = true;
					that.pushSuccess('<font color="#48CE60">- # Grunt Support Modules done!</font>');
				}else{
					that.pushError(msg.message);
					return Promise.reject();
				}
			});
		}).then(function(){
			that.pushSuccess('- % Grunting Main Files...');
			return that.send('spm gruntsmo').then(function(msg){
				if ( msg.error === 0 ){
					smo = true;
					that.pushSuccess('<font color="#48CE60">- # Grunt Main Modules done!</font>');
				}else{
					that.pushError(msg.message);
					return Promise.reject();
				}
			});
		}).then(function(){
			if ( sys && smo ){
				that.pushSuccess('- $ Start to build wrap js.');
			}else{
				that.pushError('task stop, catch some error!');
				return Promise.reject();
			}
		}).then(function(){
			return that.send('spm wrap').then(function(msg){
				if ( msg.error === 0 ){
					that.pushSuccess('<font color="#48CE60">- # Build wrap js done. Then start to packin files</font>');
				}else{
					that.pushError(msg.message);
					return Promise.reject();
				}
			});
		}).then(function(){
			return that.send('spm packin').then(function(msg){
				if ( msg.error === 0 ){
					that.pushSuccess('<font color="#48CE60">- # Pack all file to one file done.</font>');
					that.pushSuccess('<font color="#069">- # grunt file and zip file success. all task had been done!</font>');
					masker[0].stop();
				}else{
					that.pushError(msg.message);
					return Promise.reject();
				}
			});
		})['catch'](function(msg){
			that.pushError('task stop, catch some error!' + ( msg.message || '' ));
			masker[0].stop();
		});
	}
	
	return proto;
});