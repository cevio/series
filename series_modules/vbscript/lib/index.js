// 该模块必须启用32位支持方可运行

module.exports = new function(){
	var vbs = {}, f = [];
	
	// 定义函数
	vbs.VB_Asc = null;
	f.push('Function VB_Asc(string)');
	f.push('  VB_Asc = Asc(string)');
	f.push('End Function');
	f.push('Set vbs.VB_Asc = GetRef("VB_Asc")');
	
	vbs.VB_AscB = null;
	f.push('Function VB_AscB(string)');
	f.push('  VB_AscB = AscB(string)');
	f.push('End Function');
	f.push('Set vbs.VB_AscB = GetRef("VB_AscB")');
	
	vbs.VB_AscW = null;
	f.push('Function VB_AscW(string)');
	f.push('  VB_AscW = AscW(string)');
	f.push('End Function');
	f.push('Set vbs.VB_AscW = GetRef("VB_AscW")');
	
	vbs.VB_Chr = null;
	f.push('Function VB_Chr(charcode)');
	f.push('  VB_Chr = Chr(charcode)');
	f.push('End Function');
	f.push('Set vbs.VB_Chr = GetRef("VB_Chr")');
	
	vbs.VB_ChrB = null;
	f.push('Function VB_ChrB(charcode)');
	f.push('  VB_ChrB = ChrB(charcode)');
	f.push('End Function');
	f.push('Set vbs.VB_ChrB = GetRef("VB_ChrB")');
	
	vbs.VB_ChrW = null;
	f.push('Function VB_ChrW(charcode)');
	f.push('  VB_ChrW = ChrW(charcode)');
	f.push('End Function');
	f.push('Set vbs.VB_ChrW = GetRef("VB_ChrW")');

	vbs.VB_InStr = null;
	f.push('Function VB_InStr(string1, string2)');
	f.push('  VB_InStr = InStr(string1, string2)');
	f.push('End Function');
	f.push('Set vbs.VB_InStr = GetRef("VB_InStr")');
	
	vbs.VB_InStrB = null;
	f.push('Function VB_InStrB(string1, string2)');
	f.push('  VB_InStrB = InStrB(string1, string2)');
	f.push('End Function');
	f.push('Set vbs.VB_InStrB = GetRef("VB_InStrB")');
	
	vbs.VB_LCase = null;
	f.push('Function VB_LCase(string)');
	f.push('  VB_LCase = LCase(string)');
	f.push('End Function');
	f.push('Set vbs.VB_LCase = GetRef("VB_LCase")');
	
	vbs.VB_UCase = null;
	f.push('Function VB_UCase(string)');
	f.push('  VB_UCase = UCase(string)');
	f.push('End Function');
	f.push('Set vbs.VB_UCase = GetRef("VB_UCase")');
	
	vbs.VB_Left = null;
	f.push('Function VB_Left(string, length)');
	f.push('  VB_Left = Left(string, length)');
	f.push('End Function');
	f.push('Set vbs.VB_Left = GetRef("VB_Left")');
	
	vbs.VB_LeftB = null;
	f.push('Function VB_LeftB(string, length)');
	f.push('  VB_LeftB = LeftB(string, length)');
	f.push('End Function');
	f.push('Set vbs.VB_LeftB = GetRef("VB_LeftB")');
	
	vbs.VB_Mid = null;
	f.push('Function VB_Mid(string, start, length)');
	f.push('  VB_Mid = Mid(string, start, length)');
	f.push('End Function');
	f.push('Set vbs.VB_Mid = GetRef("VB_Mid")');
	
	vbs.VB_MidB = null;
	f.push('Function VB_MidB(string, start, length)');
	f.push('  VB_MidB = MidB(string, start, length)');
	f.push('End Function');
	f.push('Set vbs.VB_MidB = GetRef("VB_MidB")');
	
	vbs.VB_Right = null;
	f.push('Function VB_Right(string, length)');
	f.push('  VB_Right = Right(string, length)');
	f.push('End Function');
	f.push('Set vbs.VB_Right = GetRef("VB_Right")');
	
	vbs.VB_RightB = null;
	f.push('Function VB_RightB(string, length)');
	f.push('  VB_RightB = RightB(string, length)');
	f.push('End Function');
	f.push('Set vbs.VB_RightB = GetRef("VB_RightB")');
	
	vbs.VB_Len = null;
	f.push('Function VB_Len(string)');
	f.push('  VB_Len = Len(string)');
	f.push('End Function');
	f.push('Set vbs.VB_Len = GetRef("VB_Len")');
	
	vbs.VB_LenB = null;
	f.push('Function VB_LenB(string)');
	f.push('  VB_LenB = LenB(string)');
	f.push('End Function');
	f.push('Set vbs.VB_LenB = GetRef("VB_LenB")');
	
	vbs.VB_LTrim = null;
	f.push('Function VB_LTrim(string)');
	f.push('  VB_LTrim = LTrim(string)');
	f.push('End Function');
	f.push('Set vbs.VB_LTrim = GetRef("VB_LTrim")');
	
	vbs.VB_RTrim = null;
	f.push('Function VB_RTrim(string)');
	f.push('  VB_RTrim = RTrim(string)');
	f.push('End Function');
	f.push('Set vbs.VB_RTrim = GetRef("VB_RTrim")');
	
	vbs.VB_Trim = null;
	f.push('Function VB_Trim(string)');
	f.push('  VB_Trim = Trim(string)');
	f.push('End Function');
	f.push('Set vbs.VB_Trim = GetRef("VB_Trim")');
	
	vbs.VB_Space = null;
	f.push('Function VB_Space(number)');
	f.push('  VB_Space = Space(number)');
	f.push('End Function');
	f.push('Set vbs.VB_Space = GetRef("VB_Space")');
	
	vbs.VB_String = null;
	f.push('Function VB_String(number, character)');
	f.push('  VB_String = String(number, character)');
	f.push('End Function');
	f.push('Set vbs.VB_String = GetRef("VB_String")');
	
	vbs.VB_StrReverse = null;
	f.push('Function VB_StrReverse(string1)');
	f.push('  VB_StrReverse = StrReverse(string1)');
	f.push('End Function');
	f.push('Set vbs.VB_StrReverse = GetRef("VB_StrReverse")');

	vbs.VB_Abs = null;
	f.push('Function VB_Abs(number)');
	f.push('  VB_Abs = Abs(number)');
	f.push('End Function');
	f.push('Set vbs.VB_Abs = GetRef("VB_Abs")');
	
	vbs.VB_Atn = null;
	f.push('Function VB_Atn(number)');
	f.push('  VB_Atn = Atn(number)');
	f.push('End Function');
	f.push('Set vbs.VB_Atn = GetRef("VB_Atn")');
	
	vbs.VB_CBool = null;
	f.push('Function VB_CBool(expression)');
	f.push('  VB_CBool = CBool(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_CBool = GetRef("VB_CBool")');
	
	vbs.VB_CByte = null;
	f.push('Function VB_CByte(expression)');
	f.push('  VB_CByte = CByte(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_CByte = GetRef("VB_CByte")');
	
	vbs.VB_CCur = null;
	f.push('Function VB_CCur(expression)');
	f.push('  VB_CCur = CCur(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_CCur = GetRef("VB_CCur")');
	
	vbs.VB_CDate = null;
	f.push('Function VB_CDate(date)');
	f.push('  VB_CDate = CDate(date)');
	f.push('End Function');
	f.push('Set vbs.VB_CDate = GetRef("VB_CDate")');
	
	vbs.VB_CDbl = null;
	f.push('Function VB_CDbl(expression)');
	f.push('  VB_CDbl = CDbl(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_CDbl = GetRef("VB_CDbl")');
	
	vbs.VB_CInt = null;
	f.push('Function VB_CInt(expression)');
	f.push('  VB_CInt = CInt(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_CInt = GetRef("VB_CInt")');
	
	vbs.VB_CLng = null;
	f.push('Function VB_CLng(expression)');
	f.push('  VB_CLng = CLng(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_CLng = GetRef("VB_CLng")');
	
	vbs.VB_Cos = null;
	f.push('Function VB_Cos(number)');
	f.push('  VB_Cos = Cos(number)');
	f.push('End Function');
	f.push('Set vbs.VB_Cos = GetRef("VB_Cos")');
	
	vbs.VB_CSng = null;
	f.push('Function VB_CSng(expression)');
	f.push('  VB_CSng = CSng(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_CSng = GetRef("VB_CSng")');
	
	vbs.VB_CStr = null;
	f.push('Function VB_CStr(expression)');
	f.push('  VB_CStr = CStr(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_CStr = GetRef("VB_CStr")');
	
	vbs.VB_Date = null;
	f.push('Function VB_Date()');
	f.push('  VB_Date = Date()');
	f.push('End Function');
	f.push('Set vbs.VB_Date = GetRef("VB_Date")');
	
	vbs.VB_DateAdd = null;
	f.push('Function VB_DateAdd(interval, number, date)');
	f.push('  VB_DateAdd = DateAdd(interval, number, date)');
	f.push('End Function');
	f.push('Set vbs.VB_DateAdd = GetRef("VB_DateAdd")');
	
	vbs.VB_DateDiff = null;
	f.push('Function VB_DateDiff(interval, date1, date2)');
	f.push('  VB_DateDiff = DateDiff(interval, date1, date2)');
	f.push('End Function');
	f.push('Set vbs.VB_DateDiff = GetRef("VB_DateDiff")');
	
	vbs.VB_DatePart = null;
	f.push('Function VB_DatePart(interval, date)');
	f.push('  VB_DatePart = DatePart(interval, date)');
	f.push('End Function');
	f.push('Set vbs.VB_DatePart = GetRef("VB_DatePart")');
	
	vbs.VB_DateSerial = null;
	f.push('Function VB_DateSerial(year, month, day)');
	f.push('  VB_DateSerial = DateSerial(year, month, day)');
	f.push('End Function');
	f.push('Set vbs.VB_DateSerial = GetRef("VB_DateSerial")');
	
	vbs.VB_DateValue = null;
	f.push('Function VB_DateValue(date)');
	f.push('  VB_DateValue = DateValue(date)');
	f.push('End Function');
	f.push('Set vbs.VB_DateValue = GetRef("VB_DateValue")');
	
	vbs.VB_Day = null;
	f.push('Function VB_Day(date)');
	f.push('  VB_Day = Day(date)');
	f.push('End Function');
	f.push('Set vbs.VB_Day = GetRef("VB_Day")');
	
	vbs.VB_Eval = null;
	f.push('Function VB_Eval(expression)');
	f.push('  VB_Eval = Eval(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_Eval = GetRef("VB_Eval")');
	
	vbs.VB_Exp = null;
	f.push('Function VB_Exp(number)');
	f.push('  VB_Exp = Exp(number)');
	f.push('End Function');
	f.push('Set vbs.VB_Exp = GetRef("VB_Exp")');
	
	vbs.VB_Filter = null;
	f.push('Function VB_Filter(InputStrings, Value)');
	f.push('  VB_Filter = Filter(InputStrings, Value)');
	f.push('End Function');
	f.push('Set vbs.VB_Filter = GetRef("VB_Filter")');
	
	vbs.VB_FormatCurrency = null;
	f.push('Function VB_FormatCurrency(expression)');
	f.push('  VB_FormatCurrency = FormatCurrency(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_FormatCurrency = GetRef("VB_FormatCurrency")');
	
	vbs.VB_FormatDateTime = null;
	f.push('Function VB_FormatDateTime(Date, NamedFormat)');
	f.push('  VB_FormatDateTime = FormatDateTime(Date, NamedFormat)');
	f.push('End Function');
	f.push('Set vbs.VB_FormatDateTime = GetRef("VB_FormatDateTime")');
	
	vbs.VB_FormatNumber = null;
	f.push('Function VB_FormatNumber(expression ,NumDigitsAfterDecimal)');
	f.push('  VB_FormatNumber = FormatNumber(expression ,NumDigitsAfterDecimal)');
	f.push('End Function');
	f.push('Set vbs.VB_FormatNumber = GetRef("VB_FormatNumber")');
	
	vbs.VB_FormatPercent = null;
	f.push('Function VB_FormatPercent(expression, NumDigitsAfterDecimal)');
	f.push('  VB_FormatPercent = FormatPercent(expression, NumDigitsAfterDecimal)');
	f.push('End Function');
	f.push('Set vbs.VB_FormatPercent = GetRef("VB_FormatPercent")');
	
	vbs.VB_GetLocale = null;
	f.push('Function VB_GetLocale()');
	f.push('  VB_GetLocale = GetLocale()');
	f.push('End Function');
	f.push('Set vbs.VB_GetLocale = GetRef("VB_GetLocale")');
	
	vbs.VB_Hex = null;
	f.push('Function VB_Hex(number)');
	f.push('  VB_Hex = Hex(number)');
	f.push('End Function');
	f.push('Set vbs.VB_Hex = GetRef("VB_Hex")');
	
	vbs.VB_Hour = null;
	f.push('Function VB_Hour(time)');
	f.push('  VB_Hour = Hour(time)');
	f.push('End Function');
	f.push('Set vbs.VB_Hour = GetRef("VB_Hour")');
	
	vbs.VB_Int = null;
	f.push('Function VB_Int(number)');
	f.push('  VB_Int = Int(number)');
	f.push('End Function');
	f.push('Set vbs.VB_Int = GetRef("VB_Int")');
	
	vbs.VB_Fix = null;
	f.push('Function VB_Fix(number)');
	f.push('  VB_Fix = Fix(number)');
	f.push('End Function');
	f.push('Set vbs.VB_Fix = GetRef("VB_Fix")');
	
	vbs.VB_IsArray = null;
	f.push('Function VB_IsArray(varname)');
	f.push('  VB_IsArray = IsArray(varname)');
	f.push('End Function');
	f.push('Set vbs.VB_IsArray = GetRef("VB_IsArray")');
	
	vbs.VB_IsDate = null;
	f.push('Function VB_IsDate(expression)');
	f.push('  VB_IsDate = IsDate(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_IsDate = GetRef("VB_IsDate")');
	
	vbs.VB_IsEmpty = null;
	f.push('Function VB_IsEmpty(expression)');
	f.push('  VB_IsEmpty = IsEmpty(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_IsEmpty = GetRef("VB_IsEmpty")');
	
	vbs.VB_IsNull = null;
	f.push('Function VB_IsNull(expression)');
	f.push('  VB_IsNull = IsNull(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_IsNull = GetRef("VB_IsNull")');
	
	vbs.VB_IsNumeric = null;
	f.push('Function VB_IsNumeric(expression)');
	f.push('  VB_IsNumeric = IsNumeric(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_IsNumeric = GetRef("VB_IsNumeric")');
	
	vbs.VB_IsObject = null;
	f.push('Function VB_IsObject(expression)');
	f.push('  VB_IsObject = IsObject(expression)');
	f.push('End Function');
	f.push('Set vbs.VB_IsObject = GetRef("VB_IsObject")');
	
	vbs.VB_Join = null;
	f.push('Function VB_Join(list, delimiter)');
	f.push('  VB_Join = Join(list, delimiter)');
	f.push('End Function');
	f.push('Set vbs.VB_Join = GetRef("VB_Join")');
	
	vbs.VB_LBound = null;
	f.push('Function VB_LBound(arrayname)');
	f.push('  VB_LBound = LBound(arrayname)');
	f.push('End Function');
	f.push('Set vbs.VB_LBound = GetRef("VB_LBound")');
	
	vbs.VB_UBound = null;
	f.push('Function VB_UBound(arrayname)');
	f.push('  VB_UBound = UBound(arrayname)');
	f.push('End Function');
	f.push('Set vbs.VB_UBound = GetRef("VB_UBound")');
	
	vbs.VB_VarType = null;
	f.push('Function VB_VarType(varname)');
	f.push('  VB_VarType = VarType(varname)');
	f.push('End Function');
	f.push('Set vbs.VB_VarType = GetRef("VB_VarType")');
	
	vbs.VB_Weekday = null;
	f.push('Function VB_Weekday(date)');
	f.push('  VB_Weekday = Weekday(date)');
	f.push('End Function');
	f.push('Set vbs.VB_Weekday = GetRef("VB_Weekday")');
	
	vbs.VB_WeekdayName = null;
	f.push('Function VB_WeekdayName(weekday)');
	f.push('  VB_WeekdayName = WeekdayName(weekday)');
	f.push('End Function');
	f.push('Set vbs.VB_WeekdayName = GetRef("VB_WeekdayName")');
	
	vbs.VB_Year = null;
	f.push('Function VB_Year(date)');
	f.push('  VB_Year = Year(date)');
	f.push('End Function');
	f.push('Set vbs.VB_Year = GetRef("VB_Year")');

	/*
		批量生成方法：
		查找：^(.+)(\(.+\))$
		替换：vbs.VB_$1 = null;\r\nf.push\('Function VB_$0'\);\r\nf.push\('  VB_$1 = $0'\);\r\nf.push\('End Function'\);\r\nf.push\('Set vbs.VB_$1 = GetRef\("VB_$1"\)'\);\r\n
	*/
	
	// 执行脚本
	var objScrCtl = new ActiveXObject('MSScriptControl.ScriptControl');
	objScrCtl.Language = 'VBScript';
	objScrCtl.AddObject('vbs',vbs);
	objScrCtl.ExecuteStatement(f.join('\r\n'));

	// 返回对象
	var vb = {};
	for (var v in vbs) {
		vb[v.replace(/^VB_/, '')] = vbs[v];
	}

	return vb;
};