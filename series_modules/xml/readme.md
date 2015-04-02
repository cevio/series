##require xml module##

``` javascript
var xml = require('xml');
```

当我们获取到模块后，我们加载对应的XML文件或者XML文档。使用`load`方法加载。

``` javascript
var $ = xml(path.resolve(__dirname, '../dist/index.xml'));
```

> $ 符号相当于JQuery中的$符号作用。

我们的选择器跟JQ有所不同。$()操作返回新的$()对象数组。

``` html
a/b/c  先找a 再找b 最后找c
```

你可以使用JQ的一些类似操作

* `.find(selector)` 查找节点
* `.each(callback)` 回调循环节点
* `.map(callback)` 回调循环节点后替换掉原来的节点
* `.toArray()` 将返回节点集合，是一个数组
* `.attr(key, value)` 设置节点属性或者获取节点属性
* `.append(tag, parent)` 在当前节点前插入`tag`节点。如果`parent==true` 返回当前节点集合对象，相反，返回新建节点集合对象。
* `.remove()` 删除当前节点。
* `.html(html)` 设置获取获取节点中的cdata字段内容。
* `.text(text)` 设置或者获取节点中的文本内容
* `.comment(text)` 插入注释节点内容
* `.empty()` 清空节点下的所有子节点。
* `.childrens()` 返回当前节点下的所有子节点集合对象。
* `.eq(i)` 返回当前集合中第`i`个索引的集合对象。
* `.get(i)` 返回当前集合中第`i`个索引的节点对象
* `.first()` 返回当前集合中第一个索引的集合对象
* `.last()` 返回当前集合中最后一个索引的集合对象
* `.prev()` 返回当前集合中所有节点的上一级节点的集合对象
* `.next()` 返回当前集合中所有节点的下一级节点的结合对象
* `.type()` 返回当前集合中第一个节点的节点类型
* `.name()` 返回当前集合中第一个节点的节点名称
* `.value()` 返回当前集合中第一个节点的`value`属性的值
* `.parent()` 返回当前集合中所有节点的父级节点的对象集合
* `.save(pather)` 将这个XML文档保存到pather路径文件上
* `.xml()` 返回整个文档的XML代码

这些操作如果能熟练运用，基本已经够用。