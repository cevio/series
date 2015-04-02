## Cryptography模块 ##

Cryptography模块集成一些常用的加密解密算法，如：base64、md5、sha1等。

## 使用示例 ##

代码示例: 

``` javascript
var Crypt = require('Cryptography');
var testfile = path.resolve(__dirname, 'default.asp');
var v = '';
v = Crypt.md5('evio');				// md5加密
console.log(v, '<br />');
v = Crypt.sha1('evio');				// sha1加密
console.log(v, '<br />');
v = Crypt.crc32(testfile);			// 文件crc32加密
console.log(v, '<br />');
v = Crypt.base64.encode('evio');		// base64字符串加密
console.log(v, '<br />');
v = Crypt.base64.decode('ZXZpbw==');	// base64字符串解密
console.log(v, '<br />');
v = Crypt.base64.enfile(testfile);					// 文件base64加密
console.log(v, '<br />');
v = Crypt.base64.defile(v, testfile + '.txt');		// 文件base64解密
```

##spm support##

    - > Cryptography md5 abc
    - # Result: 900150983cd24fb0d6963f7d28e17f72
    - > Cryptography sha1 abc
    - # Result: a9993e364706816aba3e25717850c26c9cd0d89d
    - > Cryptography base64 encode abc
    - # Result: YWJj