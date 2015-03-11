##Ajax##

处理服务端Ajax请求的模块。基本类似于`jQuery.ajax`方法。后端调用方便，功能强大。

> 执行一个异步的HTTP（Ajax）的请求。

##调用方法##

``` javascript
var Ajax = require('ajax');
var ajax = new ajax();
```

##API Document##

``` javascript
$.ajax = ajax.main;
$.getJSON = ajax.getJSON;
```

请参看以上实例，然后阅读 [http://www.css88.com/jqapi-1.9/jQuery.ajax/](http://www.css88.com/jqapi-1.9/jQuery.ajax/) 这里的文档说，基本相同。

## spm support ##

>ajax get url args...

基本命令如上。有这些其他命令

* get
* getJSON
* post
* postJSON
* getScript
* postScript