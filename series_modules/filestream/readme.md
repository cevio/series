##fileStream##

对文件进行二进制处理，或者发送文件，或者下载文件。对文件类型进行统一管理。

``` javascript
var file = require('filestream');
```

##file.textStream##

文本类型的集合

``` javascript
console.json(file.textStream)
```

> ['text/xml', 'text/html', 'text/css', 'application/x-javascript']

##file.set(key, value)##

设置类型，增加或者修改。

##file.get(key)##

获取类型，带`.`号。

``` javascript
file.get('.zip')'
```

##file.save()##

新增或者修改后保存文件到本地

##file.send(pather)##

将`pather`文件内容以二进制形式输出到浏览器，供用户下载。

``` javascript
file.send(require.resolve('./dist/index.zip'));
```

##file.download(url, pather)##

将远程文件`url`下载到本地服务器地址`pather`

``` javascript
file.download('http://api.webkits.cn/coms.zip', require.resolve('../dist/news.zip'));
```