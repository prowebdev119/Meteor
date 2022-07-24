
erpReqStatus = function () {
var erpGet = erpDb();
var oStatusReq = new XMLHttpRequest();
oStatusReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPLeadStatusTypeList, true);
oStatusReq.setRequestHeader("database",erpGet.ERPDatabase);
oStatusReq.setRequestHeader("username",erpGet.ERPUsername);
oStatusReq.setRequestHeader("password",erpGet.ERPPassword);
oStatusReq.send();
oStatusReq.timeout = 30000;

return oStatusReq;
};

erpReqDept = function () {
var erpGet = erpDb();
var oDeptReq = new XMLHttpRequest();
oDeptReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPDeptClassList, true);
oDeptReq.setRequestHeader("database",erpGet.ERPDatabase);
oDeptReq.setRequestHeader("username",erpGet.ERPUsername);
oDeptReq.setRequestHeader("password",erpGet.ERPPassword);
oDeptReq.send();
oDeptReq.timeout = 30000;

return oDeptReq;
};

erpReqCategroy = function () {
var erpGet = erpDb();
var oCatReq = new XMLHttpRequest();
oCatReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPSalesCategoryList, true);
oCatReq.setRequestHeader("database",erpGet.ERPDatabase);
oCatReq.setRequestHeader("username",erpGet.ERPUsername);
oCatReq.setRequestHeader("password",erpGet.ERPPassword);
oCatReq.send();
oCatReq.timeout = 30000;

return oCatReq;
};

erpReqVia = function () {
var erpGet = erpDb();
var oViaReq = new XMLHttpRequest();
oViaReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPShipMethodList, true);
oViaReq.setRequestHeader("database",erpGet.ERPDatabase);
oViaReq.setRequestHeader("username",erpGet.ERPUsername);
oViaReq.setRequestHeader("password",erpGet.ERPPassword);
oViaReq.send();
oViaReq.timeout = 30000;

return oViaReq;
}

erpReqCustomer = function () {
var erpGet = erpDb();
var oCustReq = new XMLHttpRequest();
oCustReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPCustomerForCard, true);
oCustReq.setRequestHeader("database",erpGet.ERPDatabase);
oCustReq.setRequestHeader("username",erpGet.ERPUsername);
oCustReq.setRequestHeader("password",erpGet.ERPPassword);
oCustReq.send();
oCustReq.timeout = 30000;

return oCustReq;
}

erpReqProd = function () {
var erpGet = erpDb();
var oProdReq = new XMLHttpRequest();
oProdReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPProductDropDown, true);
oProdReq.setRequestHeader("database",erpGet.ERPDatabase);
oProdReq.setRequestHeader("username",erpGet.ERPUsername);
oProdReq.setRequestHeader("password",erpGet.ERPPassword);
oProdReq.send();
oProdReq.timeout = 30000;
return oProdReq;
}

erpReqTaxCode = function () {
var erpGet = erpDb();
var oTaxCodeReq = new XMLHttpRequest();
oTaxCodeReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPTaxCodeListObject, true);
oTaxCodeReq.setRequestHeader("database",erpGet.ERPDatabase);
oTaxCodeReq.setRequestHeader("username",erpGet.ERPUsername);
oTaxCodeReq.setRequestHeader("password",erpGet.ERPPassword);
oTaxCodeReq.send();
oTaxCodeReq.timeout = 30000;
return oTaxCodeReq;
}

erpReqSupplier = function () {
var erpGet = erpDb();
var oSuppReq = new XMLHttpRequest();
oSuppReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPSupplierForCard, true);
oSuppReq.setRequestHeader("database",erpGet.ERPDatabase);
oSuppReq.setRequestHeader("username",erpGet.ERPUsername);
oSuppReq.setRequestHeader("password",erpGet.ERPPassword);
oSuppReq.send();
oSuppReq.timeout = 30000;

return oSuppReq;
}

erpReqAccount = function () {
var erpGet = erpDb();
var oAccountReq = new XMLHttpRequest();
oAccountReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPAccountCard, true);
oAccountReq.setRequestHeader("database",erpGet.ERPDatabase);
oAccountReq.setRequestHeader("username",erpGet.ERPUsername);
oAccountReq.setRequestHeader("password",erpGet.ERPPassword);
oAccountReq.send();
oAccountReq.timeout = 30000;

return oAccountReq;
}

erpReqEmp = function () {
var erpGet = erpDb();
var oEmpReq = new XMLHttpRequest();
oEmpReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPEmployeeObject, true);
oEmpReq.setRequestHeader("database",erpGet.ERPDatabase);
oEmpReq.setRequestHeader("username",erpGet.ERPUsername);
oEmpReq.setRequestHeader("password",erpGet.ERPPassword);
oEmpReq.send();
oEmpReq.timeout = 30000;

return oEmpReq;
}

erpReqUOM = function () {
var erpGet = erpDb();
var oUOMReq = new XMLHttpRequest();
oUOMReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPUOMList, true);
oUOMReq.setRequestHeader("database",erpGet.ERPDatabase);
oUOMReq.setRequestHeader("username",erpGet.ERPUsername);
oUOMReq.setRequestHeader("password",erpGet.ERPPassword);
oUOMReq.send();
oUOMReq.timeout = 30000;

return oUOMReq;
}

erpReqShipVia = function () {
var erpGet = erpDb();
var oShipViaReq = new XMLHttpRequest();
oShipViaReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPShipMethodObj, true);
oShipViaReq.setRequestHeader("database",erpGet.ERPDatabase);
oShipViaReq.setRequestHeader("username",erpGet.ERPUsername);
oShipViaReq.setRequestHeader("password",erpGet.ERPPassword);
oShipViaReq.send();
oShipViaReq.timeout = 30000;

return oShipViaReq;
}
