/*
	<param name="users">收件箱地址，多个地址使用","隔开</param>
	<param name="title">邮件主题</param>
	<param name="content">邮件内容</param>
	<param name="option">配置参数/文件</param>
*/
exports.SendMail = function( users, title, content, option ){
	try {
		if ( !option ) {
			option = require('../option.json');
		}else{
			if( _.isString(option) ) {
				option = require(option);
			}
		}
		
		var jmail = new ActiveXObject('JMail.Message');
		jmail.silent = false;							// 屏蔽例外错误
		jmail.logging = false; 							// 启用邮件日志
		jmail.Charset = 'utf-8';						// 邮件的文字编码
		jmail.ISOEncodeHeaders = false;					// 信头编码iso-8859-1字符集，防止邮件标题乱码
		jmail.ContentType = 'text/html';				// 邮件的格式为HTML格式
		var user = users.split(',');					// 处理多个收件人
		for (var i=0; i<user.length; i++) {
			jmail.AddRecipient(user[i]);				// 邮件收件人的地址
		}
		jmail.From = option.mail;						// 发件人的E-MAIL地址
		jmail.FromName = option.name;					// 发件人姓名
		jmail.MailServerUserName = option.user;			// 登录邮件服务器所需的用户名
		jmail.MailServerPassword = option.pass;			// 登录邮件服务器所需的密码
		jmail.Subject = title;							// 邮件的标题 
		jmail.Body = content;							// 邮件的内容
		jmail.Priority = 3;								// 邮件的紧急程序，1 为最快，5 为最慢， 3 为默认值
		jmail.Send(option.smtp);						// 执行邮件发送（通过邮件服务器地址）
		jmail.Close();									// 关闭对象
		
		return {success: true, message: '成功发送'};
	}catch(e){
		return {success: false, message: e.message};
	}
}