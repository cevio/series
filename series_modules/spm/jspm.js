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
	
	return proto;
});