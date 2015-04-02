define(['jquery'], function($){
	var proto = {};
	
	proto.install = function(modal){
		return spm.remote('get/' + modal)
		.then(function(msg){
			if ( msg.error === 0 ){
				var info = [];
				var data = msg.data;
				info.push('<strong>version:</strong> ' + data.version);
				info.push('<strong>homepage:</strong> ' + data.homepage);
				info.push('<strong>package:</strong> ' + data.zip);
				
				if ( data.author ){
					if ( _.isObject(data.author) ){
						if ( data.author.name ) info.push('<strong>author:</strong> ' + data.author.name);
						if ( data.author.email ) info.push('<strong>email:</strong> ' + data.author.email);
						if ( data.author.url ) info.push('<strong>url:</strong> ' + data.author.url);
					}else if ( _.isString(data.author) ){
						info.push('<strong>author:</strong> ' + data.author);
					}
				}
				
				spm.put('list', 'get information for [' + modal + '] module success, below is info list', info);
				return Promise.resolve({ modal: modal, zip: data.zip });
			}else{
				return Promise.reject(msg);
			}
		})
		.then(function(msg){
			var debrisCMD = 'debris download ' + msg.zip + ' -:../series_modules/' + msg.modal + '.zip';
			return spm.compiler(debrisCMD).then(function(){
				spm.put('info', 'use debris download package zip done.');
				return Promise.resolve(msg.modal);
			});
		})
		.then(function(modal){
			var unCompressCMD = 'zip uncompress -:../series_modules/' + modal + '.zip -:../series_modules/' + modal;
			return spm.compiler(unCompressCMD).then(function(msg){
				spm.put('info', 'use zip to uncompress package done.');
				return Promise.resolve(modal);
			});
		})
		.then(function(modal){
			var unLinkCMD = 'spm unlink -:../series_modules/' + modal + '.zip';
			return spm.compiler(unLinkCMD).then(function(){
				spm.put('info', 'use spm unlink to remove package source done.');
				return Promise.resolve(modal);
			});
		})
		.then(function(modal){
			var jspmCMD = 'spm jspm -:../series_modules/' + modal;
			return spm.compiler(jspmCMD).then(function(value){
				window.spmDeps = _.extend(window.spmDeps, value.jspm || {});
				spm.put('info', value.info);
				return Promise.resolve(modal);
			});
		})
		.then(function(modal){
			spm.put('success', 'install ' + modal + ' success, enjoy yourself!');
		});
	}
	
	// 直接提交模块的zip文件
	proto.postzip = function(modal){
		var masker = this.delay();
		$(masker[2]).html('0%');		
		
		var pather = '../../series_modules/' + modal + '.zip';
		var that = this;
		
		return this.send('spm postzip ' + modal + ' "' + pather + '"').then(function(info){		
			var i = 0;
			
			var postBlock = function(resolve, reject){
				if ( i < info.times ){
					try{
						that.send('spm postblock ' + modal + ' ' + i).then(function(data){
							if ( data.error === 0 ){
								masker[2].innerHTML = (((i + 1) / info.times) * 100).toFixed(2) + '%';
								i++;
								postBlock(resolve, reject);
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
				postBlock(a, b);
			});
		}).then(function(){
			masker[0].stop();
			return that.send('spm postclear ' + modal);
		})['catch'](function(e){
			masker[0].stop();
			that.pushError('- # post module error. [' + e.message + ']');
		});
	}
	
	proto.post = function(modal){
		var pather = '-:../series_modules/' + modal;
		var that = this;
		var masker = null;
		var x = null;	// 保存获取到的mark
		return this.main('zip get "' + pather + '" ' + modal).then(function(mark){
			masker = that.delay();
			x = mark;
			return that.send('spm post ' + modal);
		}).then(function(info){
			var i = 0;
			
			var postBlock = function(resolve, reject){
				if ( i < info.times ){
					try{
						that.send('spm postblock ' + modal + ' ' + i).then(function(data){
							if ( data.error === 0 ){
								masker[2].innerHTML = (((i + 1) / info.times) * 100).toFixed(2) + '%';
								i++;
								postBlock(resolve, reject);
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
				postBlock(a, b);
			});
		}).then(function(){
			return that.main('zip clear ' + x);
		}).then(function(s){
			if ( s.error == 0 ){
				that.pushSuccess('<font color="#777">- % the used application had been clean up by system.</font>');
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
		return spm.send('spm gruntfiles')
		.then(function(data){
			var msg = data.msg;
			/* 显示库名 */
			spm.ui.warning(msg.workname);
			
			// 系统文件
			var syses = [], smoes = [];
			_.each(msg.compressor.sys, function(file){ syses.push(file); });
			_.each(msg.compressor.smo, function(file){ smoes.push(file); });
			
			spm.ui.list('Support Modules', syses);
			spm.ui.list('Main Modules', smoes);
		})
		.then(function(){
			spm.ui.info('start compare support modules.')
			return spm.send('spm gruntsys');
		})
		.then(function(msg){
			if ( msg.error === 0 ){
				spm.ui.success('compare supports done');
				return Promise.resolve();
			}else{
				return Promise.reject(msg);
			}
		})
		.then(function(){
			spm.ui.info('start compare main modules.')
			return spm.send('spm gruntsmo');
		})
		.then(function(msg){
			if ( msg.error === 0 ){
				spm.ui.success('compare main done');
				return Promise.resolve();
			}else{
				return Promise.reject(msg);
			}
		})
		.then(function(){
			spm.ui.info('start wrap modules.');
			return spm.send('spm wrap');
		})
		.then(function(){
			spm.ui.info('start pack in modules.');
			return spm.send('spm packin')
		})
		.then(function(){
			spm.ui.success('grunt file and zip file success. all task had been done!');
		});
	}
	
	return proto;
});