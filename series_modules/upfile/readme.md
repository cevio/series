## Asp Upfile ##

ASP无组件上传模块，目前世界上唯一一个已公布的不依赖于VBScript的，纯粹使用JScript实现的ASP文件上传处理。。

##filePost(options)##

``` javascript
var filePost = require('upfile');
// 运行读取上传内容
var result = filePost().result;
```
`result` 保存着所有上传数据

> `result['name']` 表示表单中name属性为name表单

所以，我们取到表单内容如下(如果我们表单中`a`的类型时`file`，`b`的类型是text)

* result.a === { filename: .., size: ..., ext: ..., binary: ... }
* result.b === ...(这是个文本)

所以文件`a`的二进制是 `result.a.binary`， `b`的值是 `result.b`

如果有多个同名表单，那么以上都是一个数组

```
result.a = [{
	filename: ..,
	ext: ..,
	size: ...,
	binary: ...
}, ...]
```

b也同理。

如果是文件，你可以这样保存：

``` javascript
fs.writeFile(pather, result.a.binary);
```

##upfile中间件##

``` javascript
var filePost = require('upfile');

app.use(filePost.fileParse(options));
```

`options` 参数如下：

* `folder:` 保存到的文件夹路径（绝对地址）
* `speed:` 上传单块大小。（表示上传分块大小）

一旦路由进入这个中间件，那么会在`req`上加入属性files。这个属性就是之前说的`result`。所以就继承了之前说的那些格式。

``` javascript
req.files.a.binary // 表示a的二进制
req.files.b // 表示b的值
```

所以在你们的路由处理中直接可以这样写

``` javascript
fs.writeFile(pather, req.files.a.binary);
```

不过这里值得注意的是 在  `options` 已经设定了 `folder` 属性地址的话，那么这个单个区块的属性将增加一个pather.即：

``` json
{
	filename: ...,
	ext: ...,
	size: ...,
	pather: ...
}
```

而 `binary` 属性将不复存在。 `pather` 为文件保存到的绝对地址。

