module.exports = {
	source: 'Series.asp',
	dist: 'Series.min.asp',
	compressor: {
		sys:[
			'underscore.js',
			'underscore-contrib.js',
			'asp.setTimeout.js',
			'es6-promise.js',
			'json2.js'
		],
		smo: [
			'asp.date.js',
			'asp.class.js',
			'asp.event.js',
			'asp.process.js',
			'asp.path.js',
			'asp.fso.js',
			'asp.console.js',
			'asp.resolve.js',
			'asp.module.js',
			'asp.require.js'
		],
		head: 'asp.support.js',
		foot: 'asp.end.js'
	},
	open: '<%@LANGUAGE="JAVASCRIPT" CODEPAGE="65001"%><%',
	close: '%>',
	wrap: ';(function(){<#dist#>}).call(Global);',
	workname: 'Series Web Application FrameWork By IIS Node'
};