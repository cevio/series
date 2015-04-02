// JavaScript Document
var word = require('pinyin');

exports.pinyin = function(w){
	return { error: 0, chunks: ['- % Return: ' + word.pinyin(w)] };
}
exports.PINYIN = function(w){
	return { error: 0, chunks: ['- % Return: ' + word.PINYIN(w)] };
}
exports.Pinyin = function(w){
	return { error: 0, chunks: ['- % Return: ' + word.Pinyin(w)] };
}