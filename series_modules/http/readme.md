##http##

原生URL处理HTTP请求的组件。支持事件，基本兼容nodejs原生的HTTP组件。

###installer##

> spm install http

##http support##

``` javascript
var client = require('http');
```

##http.send(options, callback)##

``` javascript
var client = require('http');
var http = new client();
http.send({host:'baidu.com', path:'/a/b',search:'a=1&b=2'}, function(res){
	var chunks = [];
	res.on('data', function(chunk){
		chunks.push(chunk.toString());
	});
	res.on('end', function(){
		console.log(chunks);
	})
})
```

##http.get(options, callback) http.post(options, callback)##

```javascript
var http = require('http');
http.get('http://api.webkits.cn', function(res){
	var chunks = [];
	res.on('data', function(chunk){
		chunks.push(chunk.toString());
	});
	res.on('end', function(){
		console.log(chunks);
	})
})
```

具体可以参考nodejs的http文档