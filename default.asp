<!--#include file="dist/Series.min.asp" -->
<%
	// 设置环境
	process.env.SERIES_ENV = "production"; //development production
	
	// 全局错误对象事件
	process.on('error', function(ev, error){
		console.log('<br />', 'Process Error: ', error.message, '<br />');
	});
	
	// 全局require失效处理提示
	process.on('loadModule:unexist', function(ev, filename){
		console.log('<br />', '\nProcess Catch Require Resolve Pather Error: ' + filename + '\n', '<br />');
	});
	
	// 启动服务
	process.createServer("app.js");
%>