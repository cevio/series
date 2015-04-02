
// mssql.main module
// -------------------------------

var MsSql = module.exports = new Class();

MsSql
	.property('connection', new ActiveXObject('ADODB.CONNECTION'))
	.property('connectionconfig', {database: 'mssql', serverip: '127.0.0.1', username: '', password: ''});
	
MsSql.property('tryConnect', function(){
	var connectionconfig = this.connectionconfig,
		connection = this.connection,
		sqlArray = [],
		connectStatus = false;
	
	sqlArray.push([
		"Provider=sqloledb",
		"Data Source=" + 		connectionconfig.serverip,
		"Initial Catalog=" + 	connectionconfig.database,
		"User Id=" + 			connectionconfig.username,
		"Password=" + 			connectionconfig.password,
		""
	].join(";"));

	sqlArray.push([
		"Driver={SQL Server}",
		"Server=" + 			connectionconfig.serverip,
		"Database=" + 			connectionconfig.database,
		"Uid=" + 				connectionconfig.username,
		"Pwd=" + 				connectionconfig.password,
		""
	].join(";"));

	for ( var i = 0 ; i < sqlArray.length; i++ ){
		try{
			connection.open(sqlArray[i]);
			connectStatus = true;
			break;
		}catch(e){}
	};
	
	return { status: connectStatus, object: connection, cmd: connectionconfig };
});

MsSql.instance(event).extend(event);

MsSql.define('setup', function( options ){
	return this.property('connectionconfig', _.extend(_.clone(this['private']('connectionconfig')), options));
});

MsSql.define('listen', function(){
	var timer = new Date().getTime();
	var connect = this['private']('tryConnect')();
	var reduceTime = new Date().getTime() - timer;
	if ( connect.status ){ this.emit('connect.success', connect.object, reduceTime); }
	else{ this.emit('connect.error', connect.object, reduceTime, connect.cmd); };
	return this;
});

MsSql.define('destory', function(){
	var connect = this['private']('connection');
	this.emit('connect.destory', connect);
	try{ connect.Close(); }catch(e){}
});