## Asp Zip ##

无需开启特殊权限，可以直接运行于普通虚拟主机上的ASP ZIP压缩解压程序。基于jszip库实现，直接在服务端创建或者解包zip文件。

## zip(folder, file) ##

将文件夹压缩成zip文件。
folder：待压缩文件夹的完整路径；
file：压缩后的zip文件的完整路径。

``` javascript
    var folder = path.resolve(__dirname, 'testzip');
    var file = path.resolve(__dirname, '/result.zip');
    var zip = require('zip');
    zip.zip(folder, file);
```

## unZip(file, folder) ##

解压zip文件到文件夹。
file：待解压的zip文件的完整路径；
folder：目标文件夹的完整路径。

``` javascript
    var file = path.resolve(__dirname, '/result.zip');
    var folder = path.resolve(__dirname, 'unzip');
    var zip = require('zip');
    zip.unZip(file, folder);
```

## 参考 ##

我们也可以直接使用jszip对象，利用jszip提供的API进行一些操作。

``` javascript
    var jszip = require('zip').jszip;
```

查看更多关于jszip的内容  [http://stuk.github.io/jszip/](http://stuk.github.io/jszip)

##spm support##

> zip compress dir file

将dir文件夹ZIP压缩到file文件

``` html
zip compress ../src ../src.zip
```

> zip uncompress file dir

将file文件ZIP解压到dir文件夹

``` html
zip uncompress ../src.zip ../src
```