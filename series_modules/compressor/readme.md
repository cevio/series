##compress##

将大型模块开发时候的依赖模块透过入口模块打包成一个文件模块，减少FSO操作，提高读取效率。

``` javascript
var compress = require('compressor');
var content = compress(require.resolve('zxp'), 'zxp');
fs.writeFile(path.resolve(path.dirname(require.resolve('zxp')), './dist/zxp.js'), content);
res.log('compress success!');	
```