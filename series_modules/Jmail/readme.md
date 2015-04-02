## Jmail模块 ##

使用Jmail发送邮件，只需要服务器支持免费的Jmail组件。

## 发送邮件 ##

代码示例: 

``` javascript
    var users = 'a@b.com,c@d.com';		// 多个用户用英文逗号分隔
    var title = '欢迎使用Series.JS框架';	// 邮件标题
    var content = '<i>welcome!</i>';		// 邮件内容，可以使用HTML标签
    var result = Jmail.SendMail( users, title, content, option );
    if (result.success) {
        // 发送成功
    }else{
        console.log(result.message);
    }
```

其中option可以是一个JSON数据，也可以是一个保存了JSON数据的配置文件的绝对地址，如果省略该参数则直接使用本模块目录下的option.json文件。

option示例：

``` javascript
    var option = {
	"smtp": "smtp.qq.com",		// 邮箱服务器
	"mail": "user@qq.com",		// 发件箱地址
	"name": "测试用户",		// 发件人姓名
	"user": "user",			// 登录用户名
	"pass": "password"		// 登录密码
    }
```

##spm support##

> jmail send [收件箱] [标题] [内容]