## MSSQL ##

强大的数据库中间件提供者。系统数据库操作功能提供者。

##MsSql Database Setup##

通过`require`方法来加载模块

```javascript
var mssql = require('mssql');
```

##Connection##

数据库连接对象类

###mssql.connect###

创建一个新的数据库连接对象类，但是此时未连接对象，因为还没有设置连接配置信息和启动连接。

```javascript
var connect = new mssql.connect()
```

###connect.setup(options)##

`options`是数据库配置参数的JSON格式，有一下属性：

* `serverip` 数据库连接的IP地址，你也可以用(local)或者.当本地地址来使用
* `database` 数据库名称
* `username` 连接数据库的用户名
* `password` 连接数据库的密码

然后，你可以通过 `connect.setup()` 方法来设置这些参数

``` javascript
connect.setup({
    serverip: '(local)',
    database: 'Series',
    username: 'SeriesWorker',
    password: 'SeriesPassword'
});
```

###connect.listen()###

此方式用来启动数据库连接和绑定数据库连接事件。

``` javascript
connect.listen();
```

###connect.destory()###

断开销毁数据库连接

``` javascript
connect.destory();
```

##Connect Events Binding##

我们提供数据库连接的事件。成功与否我们都使用事件来判断。

###event: connect.success###

数据库连接成功事件

``` javascript
connect.on('connect.success', function(ev, object, time){
    // 连接成功
    // object: 数据库对象
    // time: 连接数据库花费的时间(ms)
});
```

###event: connect.error###

数据库连接失败事件

``` javascript
connect.on('connect.error', function(ev, object, time, cmd){
    // 连接失败
    // object: 数据库对象
    // time: 连接数据库花费的时间(ms)
    // cmd: 错误的数据库连接字符串
});
```

###event: connect.destory###

数据库对象销毁事件

``` javascript
connect.on('connect.destory', function(ev, object){
    // 连接被销毁后调用
    // object: 数据库实例对象，可以再次被open
});
```

##DBO RecordSet##

数据库操作类，需要传入`connect`连接对象

``` javascript
var dbo = new mssql.dbo(connect);
```

###dbo.insert(table, datas[, callback])###

插入数据。

* `table` 数据库表名
* `datas` 插入的数据，可以是JSON格式数据，也可以是以JSON格式为元素的数组集合
* `callback` 可以省略。如果存在，则是对每项数据插入后进行数据回调处理，返回回调结果。

``` javascript
dbo.insert('user', {
    name: 'series',
    age: 18,
    tel: '18099999999'
}, function(dbo, conn){
    return dbo('id').value;
});
// => 9
```

###dbo.update(table, [factor,] data[, callback])###

更新数据

* `table` 数据库表名
* `factor` 查询条件（不带where），如果没有条件查询，请写入null
* `datas` 更新的数据，是JSON格式数据，不可以是以JSON格式为元素的数组集合
* `callback` 可以省略。如果存在，则是对每项数据插入后进行数据回调处理，返回回调结果。

``` javascript
dbo.update('user', 'age>18 and id>10', {
    name: 'series',
    age: 18,
    tel: '18099999999'
}, function(dbo, conn){
    return dbo('id').value;
});
// => [1,2,3,4]
```

###dbo.remove(table, factor[, callback])###

删除数据

* `table` 数据库表名
* `factor` 查询条件（不带where），如果没有条件查询，请写入null
* `callback` 可以省略。如果存在，则是对每项数据插入后进行数据回调处理，返回回调结果。

``` javascript
dbo.remove('user', 'age>18 and id>10', function(dbo, conn){
    return dbo('id').value;
});
// => [1,2,3,4]
```

###dbo.destory()###

关闭dbo连接对象

``` javascript
dbo.destory();
```

##dbo.transaction()##

创建新的事务处理对象

``` javascript
var trans = dbo.transaction();
```

###[transaction].task(handler, rollback)###

队列排列事务处理对象。每个 task 都是一个 `Promise` 对象。同时每个task任务接受上一个`task`任务`resolve`返回值。`handler`函数参数有`resolve` `reject` `value`

* `handler` 处理函数，执行主要的内部业务逻辑处理的自定义函数。
* `rollback` 事务回滚函数，如果只是处理SQL对象的业务，那么这个函数可以不写，因为系统会自动回滚。这个函数主要是处理一些FSO操作或者别的无法被connect连接对象处理的回滚。

``` javascript
var handle = function(resolve, reject, value){
    var id = dbo.insert('user', {a: 1, b: 2}, function(object){
    	return object('id').value;
    });
    
    // 如果数据库操作没有问题，就生成文件
    fs.writeFile(module.resove('../cache/data.json'), 'id=' + id);
    resolve();
};
var rollback = function(err, value){
	// 输出一个错误提示
	console.log(err.message);
    
    // 然后判断是否已经生成了那个缓存文件，如果已生成，那么就删除它，进行手动回滚。
    var file = module.resove('../cache/data.json');
    if ( fs.exist(file) ){
    	fs.unlink(file);
    }
};

// 开始排列任务队列。任务队列 .task 可以是多个连续链式排列。最终以 .stop 结束队列排列。
trans.task(handle, rollback).stop();
```

###[transaction].stop()###

停止队列排列，等待处理结果。每个事务处理队列都必须以这个方法结束。

``` javascript
trans.task(handle, rollback).stop();
```

##Task Event Binding##

事务处理队列事件绑定。系统会自动判断队列完成后执行是否成功。

###event: task.success###

队列全部完成，并且全部成功。

``` javascript
trans.on('task.success', function(ev, value){
    // value 为队列最终传递的值
    console.log('All Done: ' + value);
})
```

###event: task.error###

队列全部完成，并且其中有错误。

``` javascript
trans.on('task.error', function(ev, value){
    // value 为队列最终传递的值
    console.log('Catch Error: ' + value);
})
```

##dbo.query(sql, type)##

传入一个SQL语句后返回查询对象。设置打开类型为type

``` javascript
var query = dbo.query('Select * From user Where age>18', 3);
```

###[query].each(callback)###

循环每个查询对象，callback 是循环的回调函数，具有 dbo 和 i. 如果callback有返回值，将返回返回值集合数组。

``` javascript
query.each(function(dbo, i){
    return dbo('id').value;
});
// => [1,2,3,4]
```

###[query].toJSON()###

将查询结果以JSON格式组成的数组返回。

``` javascript
query.toJSON();
// => [{a: 1, b: 2}, {a:3, b: 4}, {a: 5, b: 6},...]
```

###[query].toArray()###

将查询结果以二维数组的形式返回。

``` javascript
query.toArray();
// => [[1, 2], [3, 4], [5, 6], ...]
```

###[query].exec(callback)###

处理查询过程的数据。如果查询数据个数大于1，那么执行each方法返回数据，否则，执行单个数据处理。

``` javascript
query.exec(function(dbo, i){
    return dbo('id').value;
});
// => 1 或者 [1,2,3,4]
```

##StoredProcedures Module##

``` javascript
new mssql.StoredProcedures(command, connect)
```

存储过程模块，设置执行存储过程。我们可以通过以下方式获取存储过程操作类。具体参考 [文档](http://www.w3school.com.cn/ado/met_comm_createparameter.asp)

``` javascript
var sp = new mssql.StoredProcedures('iPage', connect);
// command: 存储过程名
// connect: 数据库连接对象
```

###[StoredProcedures].addParm(name[, value[, direction]])###

设置任意类型的存储过程参数

* `name` 参数名
* `value` 值。不存在即为 null
* `direction` 默认值为1，一般不做设置。

``` javascript
sp.addParm('pagesize', 10);
```

###[StoredProcedures].addInput(name, value, t, size)###

设置输入参数

* `name` 可选。Parameter 对象的名称。
* `value` 值。不存在即为 null
* `t` 可选。DataTypeEnum 常量之一，指定 Parameter 对象的数据类型。默认是 adEmpty。如果你选择可变长度的数据类型，则需要规定 Size 参数或 Size 属性。如果规定 adDecimal 或者 adNumeric 数据类型，则必须设置 Parameter 对象的NumericScale 和 Precision 属性。
* `size` 可选。规定可变数据类型的长度，假如此类类型被声明于 Type 参数中。默认是 0。


以下方法介绍我将省略这些参数的说明。

###[StoredProcedures].addInputInt(name, value)###
整形输入。

###[StoredProcedures].addInputBigInt(name, value)###
长整形输入。范围比整形更大。

###[StoredProcedures].addInputVarchar(name, value, size)###
字符输入

###[StoredProcedures].addOutput(name, t, size)###

设置输出参数

* `name` 可选。Parameter 对象的名称。
* `t` 可选。DataTypeEnum 常量之一，指定 Parameter 对象的数据类型。默认是 adEmpty。如果你选择可变长度的数据类型，则需要规定 Size 参数或 Size 属性。如果规定 adDecimal 或者 adNumeric 数据类型，则必须设置 Parameter 对象的NumericScale 和 Precision 属性。
* `size` 可选。规定可变数据类型的长度，假如此类类型被声明于 Type 参数中。默认是 0。


以下方法介绍我将省略这些参数的说明。

###[StoredProcedures].addOutputInt(name, value)###
整形输出。

###[StoredProcedures].addOutputBigInt(name, value)###
长整形输出。范围比整形更大。

###[StoredProcedures].addOutputVarchar(name, value, size)###
字符输入

###[StoredProcedures].addReturn(name, t, size)###

设置返回参数

* `name` 可选。Parameter 对象的名称。
* `t` 可选。DataTypeEnum 常量之一，指定 Parameter 对象的数据类型。默认是 adEmpty。如果你选择可变长度的数据类型，则需要规定 Size 参数或 Size 属性。如果规定 adDecimal 或者 adNumeric 数据类型，则必须设置 Parameter 对象的NumericScale 和 Precision 属性。
* `size` 可选。规定可变数据类型的长度，假如此类类型被声明于 Type 参数中。默认是 0。


###[StoredProcedures].create()###

立刻查询数据，返回DBO对象集合。返回的对象具有dbo.query对象的所有方法

``` javascript
sp.addInputInt('@a', 1);
sp.addOutputInt('@b', 1);
var query = sp.create();
query.toJSON();
```

###[StoredProcedures].destory()###

销毁查询对象。

``` javascript
sp.destory();
```

###[StoredProcedures].get()###

取存储过程中定义的return 参数返回的数据。

``` javascript
sp.get('@c');
```

##mssql中间件介绍##

中间件将对req和res进行方法和内容的绑定。

``` javascript
var mssql = require('mssql');

app.use(mssql(options))
```

`options`是数据库连接数据的JSON格式数据

当你使用了中间件，那么在res中就存在

``` javascript
res.connect.carray(function(object, dbo, spc){
	// this 数据库连接对象类
	// object 数据库连接对象
	// dbo dbo操作对象
	// spc 存储过程操作对象
})
```

所以在你的路由GET方法中就可以用以上的方法输入，不用考虑数据库最终是否要关闭的情况。