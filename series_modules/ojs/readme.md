##OJS Layout Module.##

###How to use in express?###

设置模板引擎

``` javascript
app.set('view engine', 'ojs');
```


设置模板路径

``` javascript
app.set('views', '../view/doc/ojs');
```

我们也可以使用中间件来写入过滤模板路径

``` javascript
app.use(express.static(__dirname + '../views/doc/ojs'));
app.use('/doc', express.static(__dirname + './ojs'));
```

请注意中间件的顺序，顺序排列，倒叙决定。具体可以参考：Express Web Application 文档详解。

接下来我们需要设置模板引擎。当今nodejs的模板引擎几乎都可以放到我们的series上运行。因为他们都约定了，在模板引擎对象上必定存在兼容接口，那就是：.__express。这个意思就是对express框架的兼容。所以我们利用这个兼容接口，可以进行模板引擎的设定。

``` javascript
app.set('render engine', require('ojs').__express);
```

但是我们会发现，这样写不够语义化。那么，我们就使用其他的替换书写方式：

``` javascript
app.engine('ojs', require('ojs').__express);
```

如果有需要，我们可以设定自定义的文件模板后缀名：

``` javascript
app.set('render engine ext', 'ojs');
```

What's like?

OJS其实写法类似ejs。所以你也可以参考ejs文档。[https://github.com/tj/ejs](https://github.com/tj/ejs)

###OJS require###

``` javascript
var ojs = require('ojs');
```

###OJS Configs [JSON Object]###

* `open:` ojs 语义化标签开始标签
* `close:` ojs 语义化标签结束标签
* `encoding:` ojs 文件编码
* `cache:` ojs 模板是否缓存


###Setup OJS###

``` javascript
var o = new ojs({
    open: '<%',
    close: '%>',
    encoding: 'utf-8',
    cache: true
});
```

##OJS Method Detail##

###[ojs].getCache(pather)###

获取缓存模板文件，不存在返回 undefined

``` javascript
o.getCache('d:\test\module.ojs');
```

###[ojs].setCache(pather, template)###

设置模板文件缓存

``` javascript
o.setCache('d:\test\module.ojs', '...');
```

###[ojs].clear(pather)###

清楚模板缓存

``` javascript
o.clear('d:\test\module.ojs');
```

###[ojs].compile(str, data, filename)###

编译模板文件内容。str:模板内容文本 data:数据源 filename: 文件路径标识

``` javascript
o.compile('<%=title%>is a good man.', { title: 'evio' }, 'd:\ojs\module.ojs');
```

###[ojs].render(pather, data)###

将pather文件通过数据源data进行compile编译。核心方法。

``` javascript
o.render('d:\ojs\module.ojs', { title: 'evio' });
```

##OJS.__express Module Prototype##

###OJS.__express(pather, options, fn);###

对外接口，之前已经说明，请参考

``` javascript
app.engine('ojs', require('ojs').__express);
```

##OJS.__cache Module Prototype##

###OJS.__cache(pather, options, fn);###

OJS模板预编译缓存。用来叠加HTML代码。

``` javascript
OJS.__cache('d:\demo\code.ojs');// 后端
OJS.__cache('template'); // 前端
```

###OJS Template Maker###

####Output Type For OJS####

OJS模板输出标签有3种：`<%= %>` `<%- %>` `<% %>`

* `=` 输出HTML过滤代码文本
* `-` 输出HTML不过滤代码文本

其他一种，是OJS的代码块
``` javascript
<ul class="nav navbar-nav navbar-right">
<% _.each(navs, function(nav){ var actived = nav[3] && nav[3].toLowerCase() === active.toLowerCase() ? "active" : "";%>
	<%if ( nav[3] ){%>
	<li class="<%=actived%>"><a href="<%-nav[1]%>" <%if ( nav[2] ){%>target="blank"<%};%>><%=nav[3]%></a></li>
	<%};%>
<% }); %>
</ul>
```

##OJS Code Template Native Method##

代码块中支持2中格式的命令：include import

* `include` 引入一个继承于本页数据源的新模板，纯文本格式参数。
* `import` 引入一个继承于本页数据源的新模板，纯变量格式参数。

``` javascript
<% include test2.ojs %>
<% import __filename + files %>
```

##CopyRight OJS##

It base on Github. [http://github.com/cevio/ojs](http://github.com/cevio/ojs)