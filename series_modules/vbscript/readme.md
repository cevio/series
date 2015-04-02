## VBScript模块 ##

虽然我们的框架是完全基于Jscript脚本实现的，但是为了满足更多用户的使用习惯，我们提供了vbscript模块。该模块提供了常用的vbscript函数。

## 使用示例 ##
使用vbscript中的Asc(string)函数返回与字符串的第一个字母对应的 ANSI 字符代码。

代码示例: 

``` javascript
    var vb = require('vbscript');
    var number;
    	number = vb.Asc('A');			// 返回65
    	number = vb.Asc('a');			// 返回97
    	number = vb.Asc('Apple');		// 返回65
```



## VBScript参考 ##

[点击查看更多vbscript函数说明](http://www.w3school.com.cn/vbscript/vbscript_ref_functions.asp)


注意：

因为JScript与VBScript的类型不尽相同，所以并非该页面所列出的全部方法都完全兼容。

##spm support##

> vbscript [方法名] [参数1] [参数2]...


``` html
vbscript Asc X
```

注意：

[方法名]区分大小写；参数个数必须与该方法实际包含的参数个数相同。