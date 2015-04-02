##url##

原生URL对象转换组件。

###installer##

> spm install url

##url support##

``` javascript
var url = require('url');
```

**编译URL**

``` javascript
url.parse(url);
```

**组装URL**

```javascript
var a = {"protocol":"http:","slashes":true,"auth":null,"host":"api.webkits.cn","port":null,"hostname":"api.webkits.cn","hash":null,"search":"?x=1","query":{"x":"1"},"pathname":"/a","path":"/a?x=1","href":"http:://api.webkits.cn/a?x=1"};
url.format(a);
```

其他功能，可以自行查看nodejs官方文档