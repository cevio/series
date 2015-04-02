
// dbo.StoredProcedures module
// -----------------------------------
var query = require('./query.js');
var StoredProcedures = module.exports = new Class(function(command, connect){
	this.property('connect', connect);
	this.property('command', command);
	this['private']('cmd').ActiveConnection = connect;
	this['private']('cmd').CommandType = StoredProcedures.CommandType.STOREDPROC;
	this['private']('cmd').Prepared = true;
});

StoredProcedures.property('cmd', new ActiveXObject("Adodb.Command"));
StoredProcedures.property('params', {});
StoredProcedures.property('dbo', null);
StoredProcedures.property('geted', false);

StoredProcedures.define('addParm', function( name, value, direction ){
	var 
		params = this['private']('params'),
		cmd = this['private']('cmd');
		
	params[name] = cmd.CreateParameter(name);
	params[name].Value = value || null;
	params[name].Direction = direction || 1;
	
	return this;
});

StoredProcedures.define('addInput', function( name, value, t, size ){
	this['private']('params')[name] = this['private']('cmd').CreateParameter(name, t, StoredProcedures.ParameterDirection.INPUT, size, value);
	return this;
});

StoredProcedures.define('addInputInt', function( name, value ){
	return this.addInput(name, value, StoredProcedures.DataType.DBTYPE_I4, 4);
});

StoredProcedures.define('addInputBigInt', function( name, value ){
	return this.addInput(name, value, StoredProcedures.DataType.DBTYPE_I8, 8);
});

StoredProcedures.define('addInputVarchar', function( name, value, size ){
	return this.addInput(name, value, StoredProcedures.DataType.VARCHAR, size || 50);
});

StoredProcedures.define('addOutput', function( name, t, size ){
	this['private']('params')[name] = this['private']('cmd').CreateParameter(name, t, StoredProcedures.ParameterDirection.OUTPUT, size);
	return this;
});

StoredProcedures.define('addOutputInt', function( name ){
	return this.addOutput(name, StoredProcedures.DataType.DBTYPE_I4, 4);
});

StoredProcedures.define('addOutputBigInt', function( name ){
	return this.addOutput(name, StoredProcedures.DataType.DBTYPE_I8, 8);
});

StoredProcedures.define('addOutputVarchar', function( name, size ){
	return this.addOutput(name, StoredProcedures.DataType.VARCHAR, size || 50);
});

StoredProcedures.define('addReturn', function( name, t, size ){
	this['private']('params')[name] = this['private']('cmd').CreateParameter(name, t, StoredProcedures.ParameterDirection.RETURNVALUE, size);
	return this;
});

StoredProcedures.define('create', function(){
	var 
		cmd = this['private']('cmd'),
		params = this['private']('params');
	
	cmd.CommandText = this['private']('command');
	
	for( var i in params ){
		if( !params.hasOwnProperty(i) ) continue;
		cmd.Parameters.Append( params[i] );
	}
	
	this.property('dbo', cmd.execute());
	
	return new query(this);
});

StoredProcedures.define('destory', function(){
	this.provate('dbo').Close();
});

StoredProcedures.define('get', function(name){
	var 
		geted = this['private']('geted'),
		params = this['private']('params'),
		cmd = this['private']('cmd');
		
	if ( !geted ){
		for ( var i in params ){
			if( !params.hasOwnProperty(i) ) continue;
			if( params[i].Direction > 1 ){
				params[i].value = cmd(i).value;
			}
		}
		this.property('geted', true);
	};
	
	if( !params.hasOwnProperty(name) ) return null;
	return params[name];
});

// 静态数据配置
StoredProcedures.ParameterDirection = { INPUT:1,INPUTOUTPUT:3,OUTPUT:2,RETURNVALUE:4 };
StoredProcedures.DataType = {
	ARRAY:0x2000,DBTYPE_I8:20,DBTYPE_BYTES:128,DBTYPE_BOOL:11,DBTYPE_BSTR:8,DBTYPE_HCHAPTER:136,DBTYPE_STR:129,DBTYPE_CY:6,DBTYPE_DATE:7,DBTYPE_DBDATE:133,
	DBTYPE_DBTIME:134,DBTYPE_DBTIMESTAMP:135,DBTYPE_DECIMAL:14,DBTYPE_R8:5,DBTYPE_EMPTY:0,DBTYPE_ERROR:10,DBTYPE_FILETIME:64,DBTYPE_GUID:72,DBTYPE_IDISPATCH:9,
	DBTYPE_I4:3,DBTYPE_IUNKNOWN:13,LONGVARBINARY:205,LONGVARCHAR:201,LONGVARWCHAR:203,DBTYPE_NUMERIC:131,DBTYPE_PROP_VARIANT:138,DBTYPE_R4:4,DBTYPE_I2:2,DBTYPE_I1:16,
	DBTYPE_UI8:21,DBTYPE_UI4:19,DBTYPE_UI2:18,DBTYPE_UI1:17,DBTYPE_UDT:132,VARBINARY:204,VARCHAR:200,DBTYPE_VARIANT:12,VARNUMERIC:139,VARWCHAR:202,DBTYPE_WSTR:130
};
StoredProcedures.CommandType = {
	UNSPECIFIED:-1,TEXT:1,TABLE:2,STOREDPROC:4,UNKNOWN:8,FILE:256,TABLEDIRECT:512
};

/*
 * 调用方法实例：
var c = new MsSql.StoredProcedures('P_viewPage', connect);
var z = c
		.addInputVarchar('@TableName', 'evio')
		.addInputVarchar('@FieldList', '*')
		.addInputVarchar('@PrimaryKey', 'id')
		.addInputVarchar('@Where', 'id>10')
		.addInputVarchar('@Order', 'id asc')
		.addInputInt('@SortType', 1)
		.addInputInt('@RecorderCount', 0)
		.addInputInt('@PageSize', 10)
		.addInputInt('@PageIndex', 2)
		.addOutputInt('@TotalCount')
		.addOutputInt('@TotalPageCount')
		.create();
		
z.toJSON();
z.each(callback);
z.toArray();
z.exec(callback)
		
console.log(c.get('@TotalCount'))
console.json(z);
*/