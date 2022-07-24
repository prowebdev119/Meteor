var IPAddress = localStorage.getItem('EIPAddress');
var UserName =localStorage.getItem('EUserName');
var Password = localStorage.getItem('EPassword')||'';

var Database = localStorage.getItem('EDatabase');
var Port = localStorage.getItem('EPort');
var d = new Date();
var month = d.getMonth()+1;
var day = d.getDate();

var output = d.getFullYear() + '-' +
    ((''+month).length<2 ? '0' : '') + month + '-' +
    ((''+day).length<2 ? '0' : '') + day;
erpDb = function () {
var erpConnection = {
    logMsg: "",
    ERPIPAddress: IPAddress,
    ERPUsername: UserName,
    ERPPassword: Password,
    ERPDatabase: Database,
    ERPPort: Port,
    ERPUseSSL: true,
    ERPApi: "erpapi",
    ERPSystemObject: "TERPSysInfo",
    //ERPLoginObject: "TUser?PropertyList==ID,LogonName,EmployeeName,PasswordHash",
    ERPCustomerListObject: "TCustomer?PropertyList==ID,GlobalRef,ClientName,FirstName,LastName,Phone,StreetAddress,Suburb,Mobile,Email,Active,ARBalance",
    ERPProductListObject: "TProduct?PropertyList==ID,GlobalRef,ProductPrintName,ProductName,SalesDescription,Barcode,BuyQty1CostInc,SellQty1Price,SellQty1PriceInc,TotalStockQty,ProductGroup1,ProductGroup2,ProductGroup3,SellQTY1",
    ERPProspectListObject: "TProspect?PropertyList==ID,GlobalRef,ClientName,Active,RepName,Email,Mobile,Phone,FirstName,LastName",
    ERPInvoiceListObject: "TInvoiceEx?PropertyList==ID,GlobalRef,CustomerName,DocNumber,ForeignExchangeCode,SaleDate,CustPONumber,PayMethod,DueDate,SalesStatus,TotalPaid,TotalBalance,SaleCustField3,IsPaid,PrintFlag&select=[deleted]=false",
    ERPQuoteListObject: "TQuoteEx?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,Reference,ARNotes,SalesStatus&select=[deleted]=false",
    ERPSalesOrderListObject: "TSalesOrder?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,SalesStatus&select=[deleted]=false",
    ERPSalesOrderExListObject: "TSalesOrderEx?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,ARNotes,ReferenceNo,CustPONumber,SalesStatus&select=[deleted]=false",
    ERPPurchaseOrderListObject: "TPurchaseOrder?PropertyList==ID,SupplierName,DocNumber,OrderDate,OrderStatus,TotalAmountInc,TotalPaid,CustPONumber,ETADate,TermsName,Comments,TotalAmount,Deleted,EmployeeName,SupplierInvoiceNumber,ShipToCustomer,IsPaid&select=[deleted]=false",

    ERPToDoObject: "TToDo?PropertyList==Id,GlobalRef,CreatedDate,CreateedByEmployeeName,Description,ToDoByDate,ToDoType,Result,EmployeeName,EmployeeID&select=[EmployeeName]=" + "'" + Session.get('mySessionEmployee') + "'",
    ERPEmployeeObject: "TEmployee?PropertyList==ID,GlobalRef,EmployeeName,FirstName,LastName&select=[Active]=true",
    ERPStockTakeListObject: "TStockAdjustEntry?PropertyList==ID,GlobalRef,CreationDate,Processed,Notes,Employee,AccountName,AdjustmentDate,Deleted,IsStockTake",
    ERPCreateCustomer: "TCustomer",
    ERPCreateSupplier: "TSupplier",
    ERPCreateEmployee: "TEmployee",
    ERPCustomerCard: "TCustomer?PropertyList==ID,GlobalRef,ClientName,PrintName,FirstName,LastName,Phone,Mobile,Email,ClientTypeName,SourceName,SkypeName,DefaultContactMethod,Street,Street2,Suburb,State,Postcode,Country,ShipToAddress,Abn,ForeignExchangeCode,BankAccountName,BankAccountNo,BankCode,Active",
    ERPSupplierCard: "TSupplier?PropertyList==ID,GlobalRef,ClientName,Email,Suburb,FirstName,LastName,Phone,ForeignExchangeCode,Abn,BankAccountName,BankAccountNo,BankCode,Active",
    ERPUpdateProduct: "TProduct",
    ERPCreateProduct: "TProduct",
    ERPProductCard: "TProduct?PropertyList==ID,ProductName,SalesDescription,SellQty1Price,TotalStockQty",
    ERPProductPictureListObject: "TProductPicture?PropertyList==ID,GlobalRef,MIMEEncodedPicture,IsDefault,PicType,ProductName",
    ERPCurrency: "TCurrency?PropertyList==ID,Active,GlobalRef,KeyValue,CurrencySymbol&select=[Active]=true",
    //ERPQuoteCard: "TQuote?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,InvoiceToDesc,ShipToDesc,SaleClassName,EmployeeName,CustPONumber,SaleDate,SalesStatus,SalesCategory,TotalAmountInc,TotalTax,TotalAmount,PickMemo,Comments,Reference,Shipping,ConNote",
    ERPQuoteCard: "TQuote",
    //ERPInvoiceCard: "TInvoice?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,InvoiceToDesc,ShipToDesc,SaleClassName,EmployeeName,CustPONumber,SaleDate,SalesStatus,SalesCategory,TotalAmountInc,TotalTax,TotalAmount,PickMemo,Comments,Reference,Shipping,ConNote",
    ERPInvoiceCard: "TInvoice",
    //ERPSalesOrderCard: "TSalesOrder?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,InvoiceToDesc,ShipToDesc,SaleClassName,EmployeeName,CustPONumber,SaleDate,SalesStatus,SalesCategory,TotalAmountInc,TotalTax,TotalAmount,PickMemo,Comments,Reference,Shipping,ConNote",
    ERPSalesOrderCard: "TSalesOrder",
    ERPSalesOrderCardEx: "TSalesOrderEx",
    ERPBillCard: "TBill",
    ERPSalesOrderCard: "TSalesOrder",
    ERPPurchaseOrderSend: "TPurchaseOrder",
    ERPFittingCard: "TFunc_Manufacture",
    ERPPrintShippingCard: "TFunc_Print",
    ERPProcSummary: "TProcSummary",
    ERPPurchaseOrderCard: "TPurchaseOrder?PropertyList==ID,SupplierName,DocNumber,OrderDate,OrderStatus,TotalAmountInc,TotalPaid,CustPONumber,TermsName,Comments,SalesComments,ConNote,TotalAmount,Deleted,EmployeeName,ShipTo,OrderTo,Shipping,TotalTax",
    ERPPOCard: "TPurchaseOrder",
    ERPCustomerForCard: "TCustomer?PropertyList==ID,GlobalRef,ClientName,PrintName,ClientTypeName,ClientDetails,ClientAddress,StreetAddressWithName,ShipToAddress,Active",
    ERPSupplierForCard: "TSupplier?PropertyList==ID,GlobalRef,ClientName,Email,Suburb,Active,ShipToAddress",
    ERPDepartmentList: "TDeptClass?PropertyList==ID,GlobalRef,KeyValue,DeptClassName&select=[Active]=true",
    ERPShippingMethodList: "TShippingMethod?PropertyList==ID,GlobalRef,KeyValue,ShippingMethod",
    ERPLeadStatusTypeList: "TLeadStatusType?PropertyList==ID,TypeName&select=[Active]=true",
    ERPDeptClassList: "TDeptClass?PropertyList==ID,DeptClassName",
    ERPSalesCategoryList: "TSalesCategory?PropertyList==ID,TypeName&select=[Active]=true",
    ERPShipMethodList: "TShippingMethod?PropertyList==ID,ShippingMethod&select=[Active]=true",
    ERPBillList: "TBill?PropertyList==ID,GlobalRef,KeyValue,DocNumber,SupplierInvoiceNumber,SupplierName,OrderDate,DueDate,TotalPaid,IsCredit,ISPoCredit,TotalBalance,TotalAmountInc,OrderStatus&select=[deleted]=false and [IsBill]=true",
    ERPSupplierListObject: "TSupplier?PropertyList==ID,GlobalRef,ClientName,Email,Suburb,APBalance,Active",
    ERPEmployeeListObject: "TEmployee?PropertyList==ID,GlobalRef,EmployeeName,FirstName,LastName,Email,Active&select=[Active]=true",
    ERPTaxCodeListObject: "TTaxCode?PropertyList==ID,GlobalRef,CodeName&select=[Active]=true",
    ERPRefundList: "TRefundSale?PropertyList==ID,GlobalRef,ClientPrintName,ClientName,RefundStatus,CreationDate,DueDate,TotalPaid,TotalBalance,ChequeNumber",
    ERPCreditList: "TCredit?PropertyList==ID,GlobalRef,ClientName,ClientPrintName,CleanOrderDate,DueDate,OrderDate,TotalPaid,TotalBalance,OrderStatus,SupplierInvoiceNumber",
    ERPCustomerCardInvoiceListObject: "TInvoice?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,DueDate,SalesStatus,TotalPaid,TotalBalance,IsPaid",
    ERPEmployeeCard: "TEmployee",
    ERPCustomerEdit: "TCustomer",
    ERPSupplierEdit: "TSupplier",
    ERPSupplierCardBillList: "TBill?PropertyList==ID,GlobalRef,KeyValue,DocNumber,SupplierInvoiceNumber,SupplierName,OrderDate,DueDate,TotalPaid,TotalBalance,OrderStatus,TotalAmountInc,IsPaid&Select=[IsBill]=true",
    ERPSupplierPurchaseOrderList: "TPurchaseOrder?PropertyList==ID,SupplierName,DocNumber,OrderDate,OrderStatus,DueDate,TotalAmountInc,TotalPaid,CustPONumber,TermsName,Comments,SalesComments,ConNote,TotalAmount,Deleted,EmployeeName,ShipTo,OrderTo,Shipping,TotalTax,IsPaid,TotalBalance",
    ERPProductCardMain: "TProduct?PropertyList==ID,Active,ProductName,ProductPrintName,ProductName,BARCODE,BuyQty1Cost,BuyQty1CostInc,AssetAccount,TaxCodePurchase,PRODUCTCODE,PurchaseDescription,IncomeAccount,TaxCodeSales,SalesDescription,SellQty1Price,SellQty1PriceInc,TotalStockQty,ProductComment,PreferedSupplierName,CogsAccount,LockExtraSell",
    ERPSOListSentObject: "TSalesOrder?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,SalesStatus&select=[SalesStatus]='Sent' and [deleted]=false",
    ERPSOListDecObject: "TSalesOrder?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,SalesStatus&select=[deleted]=false and [SalesStatus]='Declined'",
    ERPSOListAccpObject: "TSalesOrder?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,SalesStatus&select=[deleted]=false and [SalesStatus]='Accepted'",
    ERPSOListConvObject: "TSalesOrder?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,SalesStatus&select=[converted]=true",
    ERPSOListDraftObject: "TSalesOrder?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,SalesStatus&select=[SalesStatus]='Draft' and [deleted]=false",
    ERPQuoteListSentObject: "TQuote?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,Reference,SalesStatus&select=[SalesStatus]='Sent' and [deleted]=false",
    ERPQuoteListDecObject: "TQuote?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,Reference,SalesStatus&select=[SalesStatus]='Declined'",
    ERPQuoteListAccpObject: "TQuote?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,Reference,SalesStatus&select=[deleted]=false and [SalesStatus]='Accepted'",
    ERPQuoteListConvObject: "TQuote?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,Reference,SalesStatus&select=[converted]=true",
    ERPQuoteListDraftObject: "TQuoteEx?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,Reference,SalesStatus&select=[SalesStatus]='Draft' and [deleted]=false&LimitCount='5'&LimitFrom='5'",
    ERPPaymentDetails : "TPaySplit?PropertyList==ID,EmployeeName,BankCode,Branch,AccountName,Bsb,AccountNo,Amount,Split,SplitType",
    ERPEmployeeEdit: "TEmployee",
    ERPInvListNotAppObject: 'TInvoiceEx?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,DueDate,SalesStatus,TotalPaid,SaleCustField3,TotalBalance,PrintFlag&select=[SalesStatus]="Awaiting Approval" and [deleted]=false',
    ERPInvListDraftObject:"TInvoiceEx?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,DueDate,SalesStatus,TotalPaid,SaleCustField3,TotalBalance,PrintFlag&select=[deleted]=false and [SalesStatus]='Draft'",
    ERPInvListNotPaidObject: 'TInvoiceEx?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,DueDate,SalesStatus,TotalPaid,SaleCustField3,TotalBalance,PrintFlag,PayMethod&select=[SalesStatus]="Approved" and [IsPaid]=false and [deleted]=false',
    ERPAwaitingPaymentInv: "TInvoice?PropertyList==ID,TotalAmountInc,TotalBalance,DueDate&select=[IsPaid]=false and [deleted]=false",
    ERPOverDuePaymentInv: "TInvoice?PropertyList==ID,TotalAmountInc,TotalBalance&select=[IsPaid]=false and [deleted]=false and [DueDate] < '"+output+"'",
    ERPAwaitingPaymentBill: "TBill?PropertyList==ID,TotalAmountInc,TotalBalance,DueDate&select=[IsPaid]=false and [deleted]=false and [IsBill]=true",
    ERPOverDuePaymentBill: "TBill?PropertyList==ID,TotalAmountInc,TotalBalance&select=[IsPaid]=false and [deleted]=false and [IsBill]=true and [DueDate] < '"+output+"'",
    ERPInvListRepeatingObject: "TInvoiceEx?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,DueDate,SalesStatus,TotalPaid,SaleCustField3,TotalBalance&select=[IsPaid]=true",
    ERPInvListPaidObject: "TInvoiceEx?PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,DueDate,SalesStatus,TotalPaid,Attachments, TotalBalance,IsPaid,InvoiceToDesc,ShipToDesc,SaleClassName,InvoiceStreet1,InvoiceStreet2,InvoiceStreet3,InvoiceState,InvoiceCountry,SaleCustField3,InvoicePostcode,Lines&select=[IsPaid]=true",
    ERPPONotApprovedListObject: "TPurchaseOrder?PropertyList==ID,SupplierName,DocNumber,OrderDate,OrderStatus,TotalAmountInc,TotalPaid,CustPONumber,ETADate,TermsName,Comments,TotalAmount,Deleted,EmployeeName,ShipToCustomer&select=[Approved]=false and [deleted]=false and [OrderStatus]='Awaiting Approval'",
    ERPPOApprovedListObject: "TPurchaseOrder?PropertyList==ID,SupplierName,DocNumber,OrderDate,OrderStatus,TotalAmountInc,TotalPaid,CustPONumber,ETADate,TermsName,Comments,TotalAmount,Deleted,EmployeeName,ShipToCustomer&select=[Approved]=true and [deleted]=false and [OrderStatus]='Approved'",
    ERPDraftPOList: "TPurchaseOrder?PropertyList==ID,SupplierName,DocNumber,OrderDate,SupplierInvoiceNumber,OrderStatus,TotalAmountInc,TotalPaid,CustPONumber,ETADate,TermsName,Comments,TotalAmount,Deleted,EmployeeName,ShipToCustomer&select=[OrderStatus]='Draft' and [deleted]=false",
    ERPBilledPOList: "TPurchaseOrder?PropertyList==ID,SupplierName,DocNumber,OrderDate,SupplierInvoiceNumber,OrderStatus,TotalAmountInc,TotalPaid,CustPONumber,ETADate,TermsName,Comments,TotalAmount,Deleted,EmployeeName,ShipToCustomer&select=[OrderStatus]='Billed' and [deleted]=false",
    ERPPaymentDetailsEmployeeEdit : "TPaySplit",
    ERPNotAprovedBillList: "TBill?PropertyList==ID,GlobalRef,KeyValue,DocNumber,SupplierInvoiceNumber,SupplierName,OrderDate,DueDate,TotalPaid,TotalBalance,OrderStatus,TotalAmountInc,IsCredit,ISPoCredit,IsPaid&select=[Approved]=false and [deleted]=false and [IsBill]=true and [OrderStatus]='Awaiting Approval'",
    ERPNotPaidBillList: "TBill?PropertyList==ID,GlobalRef,KeyValue,DocNumber,SupplierInvoiceNumber,SupplierName,OrderDate,DueDate,TotalPaid,IsCredit,ISPoCredit,TotalBalance,OrderStatus,TotalAmountInc,IsPaid&select=[IsPaid]=false and [deleted]=false and [IsBill]=true and [OrderStatus]='Approved'" ,
    ERPPaidBillList: "TBill?PropertyList==ID,GlobalRef,KeyValue,DocNumber,SupplierInvoiceNumber,SupplierName,OrderDate,DueDate,TotalPaid,TotalBalance,OrderStatus,IsCredit,ISPoCredit,TotalAmountInc,IsPaid&select=[deleted]=false and [IsBill]=true and [OrderStatus]='Paid'",
    ERPDraftBillList: "TBill?PropertyList==ID,GlobalRef,KeyValue,DocNumber,SupplierInvoiceNumber,SupplierName,OrderDate,DueDate,TotalPaid,TotalBalance,OrderStatus,IsCredit,ISPoCredit,TotalAmountInc,IsPaid&select=[OrderStatus]='Draft' and [deleted]=false and [IsBill]=true",
    ERPAccountCard: "TAccount?PropertyList==ID,AccountName,AccountTypeName,TaxCode,Description&select=[Active]=true",
    ERPProductDropDown: "TProduct?PropertyList==ID,ProductName,SalesDescription,SellQty1Price,BARCODE&select=[Active]=true",
    ERPProductBarcode: "TProductBarcode?PropertyList==ID,ProductName,BARCODE",
    ERPUOMList: "TUnitOfMeasure?PropertyList==ID,BaseUnitName,UOMName&select=[Active]=true",
    ERPProductClassList: "TProductClass?PropertyList==ID,AvailableQuantity,DeptName,OnOrderQuantity",
    ERPStockAdjustEntryCard:"TStockAdjustEntry",
    ERPBankCode: "TBankCode?PropertyList==ID,BankCode,BankName",
    ERPAccountType: "TAccount?PropertyList==ID,AccountName,AccountNumber",
    ERPProductClassQuantityList: "TProductClassQuantity?PropertyList==ID,AvailableQty,InStockQty",
    ERPStockAdjustCardObject: "TStockAdjustEntry?PropertyList==ID,GlobalRef,CreationDate,Processed,Notes,Employee,AccountName,AdjustmentDate,Deleted,IsStockTake",
    ERPDeliveryList: "BackOrderSalesList?PropertyList==SaleID,DocNumber,CustomerPrintName,SaleDate,ProductPrintName,SaleTerms,SaleType",
    ERPSaleType: "TAPIFunction",
    ERPProductIsBatchBinOrSN: "TProduct?PropertyList==ID,Batch,MultipleBins,SNTracking",
    ERPSalesPQA: "TPQA",
    ERPExportCustomer: "TCustomer?ListType=Detail",
    ERPSupplierCardExport: "TSupplier?PropertyList==ID,GlobalRef,ClientName,Email,FirstName,LastName,Phone,Mobile,Street,Street2,Suburb,State,Postcode,Country,ForeignExchangeCode,Abn,BankAccountName,BankAccountNo,BankCode,Active",
    ERPEmployeeCardExport: "TEmployee?PropertyList==ID,GlobalRef,EmployeeName,Email,FirstName,LastName,Phone,Mobile,FaxNumber,SkypeName,Street,Street2,Street3,Suburb,State,Postcode,Country,Active",
    ERPARList: "ARList?Summary=true",
    ERPARInfo: "ARList?Summary=false",
    ERPAPList: "APList?Summary=false",
    ERPAPInfo: "APList?Summary=false",
    ERPSOSalesObject: "TSalesOrder?PropertyList==ID,TotalAmountInc,printflag,deleted,converted,IsPaid,SalesStatus&select=[deleted]=false",
    ERPQuoteSalesObject: "TQuoteEx?PropertyList==ID,TotalAmountInc,printflag,deleted,converted,IsPaid,SalesStatus",
    ERPBillPUObject: "TBill?PropertyList==ID,TotalAmountInc,deleted,DueDate,IsPaid,Approved,OrderStatus&Select=[IsBill]=true",
    ERPPOPUObject: "TPurchaseOrder?PropertyList==ID,TotalAmountInc,deleted,Approved,OrderStatus,IsPaid&select=[deleted]=false",
    // ERPInvSalesObject: "TInvoiceEx?PropertyList==ID,TotalAmountInc,printflag,converted,SalesStatus,DueDate,CustomerName,SaleDate,CustPONumber,TotalPaid,TotalBalance,deleted,IsPaid&select=[deleted]=false",
    ERPInvSalesObject: "TInvoiceEx?PropertyList==ID,TotalAmountInc,printflag,converted,SalesStatus,DueDate,CustomerName,SaleDate,CustPONumber,TotalPaid,TotalBalance,deleted,IsPaid&select=[deleted]=false",
    ERPCustListCnt: "TCustomer?PropertyList==ID",
    ERPSuppListCnt: "TSupplier?PropertyList==ID",
    ERPEmpListCnt: "TEmployee?PropertyList==ID",
    ERPInvSalesOweObj: "TInvoice?PropertyList==ID,TotalAmountInc,CustomerName,DueDate&select=[IsPaid]=false and [deleted]=false & LimitCount='5'",
    ERPShipMethodObj : "TShippingMethod?PropertyList==ID,ShippingMethod&select=[Active]=true",
    ERPTExpense: "TExpenseClaim?select=[Active]=true&ListType=Detail",
    ERPTExpenseEx: "TExpenseClaimEx?select=[Active]=true&ListType=Detail",
    ERPEmpProfileSetting: "TEmployee?PropertyList==ID,GlobalRef,Country,EmployeeName,Email,FirstName,LastName,Notes,Position,Mobile,Active&select=[EmployeeName]=" + "'" + Session.get('mySessionEmployee') + "'",
    ERPEmpID: "TEmployee?PropertyList==ID,EmployeeName&select=[EmployeeName]=" + "'" + Session.get('mySessionEmployee') + "'",
    ERPEmpFormAccessDetail: "TEmployeeFormAccessDetail?ListType=Detail&Select=[TabGroup]=26 and [EmployeeId]=" + "'" + Session.get('mySessionEmployeeLoggedID') + "'",
    getEmpFormAccessDetail: "TEmployeeFormAccessDetail",
    ERPEmpProfilePicture: "TEmployeeAttachment?PropertyList==ID,Attachment,AttachmentName,EmployeeName &select=[EmployeeName]=" + "'" + Session.get('mySessionEmployee') + "'",
    ERPOrganisationSetting: "TCompanyInfo?PropertyList==ID,GlobalRef,CompanyName,TradingName,CompanyCategory,CompanyNumber,SiteCode,Firstname,LastName,PoBox,PoBox2,PoBox3,PoCity,PoState,PoPostcode,PoCountry,Contact,Address,Address2,Address3,City,State,Postcode,Country,PhoneNumber,Email,Url,MobileNumber,FaxNumber,DvaABN,,ContactEmail,ContactName,abn,Apcano,Bsb,AccountNo,BankBranch,BankCode,Bsb,FileReference,TrackEmails",
    ERPCompanyInfo: "TCompanyInfo",
    ERPTaxCodeData: "TTaxCode",
    ERPCountries: "TCountries?PropertyList==ID,GlobalRef,Country,CountryCode,Active&select[Active]=true",
    ERPTAccountType: "TAccountType?PropertyList==ID,Description,OriginalDescription,AccountTypeName,Active&select[Active]=true",
    ERPAccountSend: "TAccount",
    ERPProfitAndLossReport: "ProfitAndLossReport?select=[Active]=true&ListType=Detail",
    ERPTaxCode: "TTaxCode?select=[Active]=true&ListType=Detail",
    ERPAccountList: "TAccount?select=[Active]=true &ListType=Detail",
    /*Remove +and [Extra]='' +*/
    ERPExpenseAccountList: "TAccount?select=[Active]=true and [AccountTypeName]='EXP'&ListType=Detail",
    ERPRevenueAccountList: "TAccount?select=[Active]=true and [AccountTypeName]='INC'&ListType=Detail",
    ERPEquityAccountList: "TAccount?select=[Active]=true and [AccountTypeName]='EQUITY'&ListType=Detail",
    ERPAssetAccountList: "TAccount?select=[Active]=true and [AccountTypeName]='FIXASSET'&ListType=Detail",
    ERPLiabilityAccountList: "TAccount?select=[Active]=true and [AccountTypeName]='OCLIAB'&ListType=Detail",
    /*Remove +and [Extra]='' +*/
    ERPArchiveAccountList: "TAccount?select=[Active]=true and [Extra]='Archive'&ListType=Detail",
    ERPDeptClass: "TDeptClass",
    ERPPendingStockTakeListObject: "TStockAdjustEntry?PropertyList==ID,GlobalRef,CreationDate,Processed,Notes,Employee,AccountName,AdjustmentDate,Deleted,TotalCostEx,IsStockTake&select=[Approved]=false and [deleted]=false and [Processed]=false",
    ERPProcessedStockTakeListObject: "TStockAdjustEntry?PropertyList==ID,GlobalRef,CreationDate,Processed,Notes,Employee,AccountName,AdjustmentDate,Deleted,TotalCostEx,IsStockTake&select=[deleted]=false and [Processed]=true",
    ERPApprovedStockTakeListObject: "TStockAdjustEntry?PropertyList==ID,GlobalRef,CreationDate,Processed,Notes,Employee,AccountName,AdjustmentDate,Deleted,TotalCostEx,IsStockTake&select=[deleted]=flase and [Approved]=true",
    ERPDeletedStockTakeListObject: "TStockAdjustEntry?PropertyList==ID,GlobalRef,CreationDate,Processed,Notes,Employee,AccountName,AdjustmentDate,Deleted,TotalCostEx,IsStockTake&select=[deleted]=true",
    ERPSalesOrderSalesObject: "TSalesOrder?PropertyList==ID,TotalAmountInc,printflag,deleted,converted,IsPaid,SalesStatus",
    //ERPProfitAndLossReport: "ProfitAndLossReport?select=[Active]=true&ListType=Detail",
}
/*
if (erpConnection.ERPIPAddress == '') {
    LastError = '<img src="icons/icons_40x33/error_red_40x33_a.png"> <strong>ERROR:</strong> TrueERP Server IP Address not specified. Please go to <a href="/register">Setup Connection</a> to rectify this.';
    document.getElementById("error_log").innerHTML = LastError;
    document.getElementById("error_log").style.display = 'block';

}
else if (erpConnection.ERPUsername == '') {
    LastError = '<img src="icons/icons_40x33/error_red_40x33_a.png"> <strong>ERROR:</strong> TrueERP Web API username not specified. Please go to <a href="/register">Setup Connection</a> to rectify this.';
    document.getElementById("error_log").innerHTML = LastError;
    document.getElementById("error_log").style.display = 'block';

}
else if (erpConnection.ERPPassword == '') {
    LastError = '<img src="icons/icons_40x33/error_red_40x33_a.png"> <strong>ERROR:</strong> TrueERP Web API password not specified. Please go to <a href="/register">Setup Connection</a> to rectify this.';
    document.getElementById("error_log").innerHTML = LastError;
    document.getElementById("error_log").style.display = 'block';

}
else if (erpConnection.ERPDatabase == '') {
    LastError = '<img src="icons/icons_40x33/error_red_40x33_a.png"> <strong>ERROR:</strong> TrueERP database name not specified. Please go to <a href="/register">Setup Connection</a> to rectify this.';
    document.getElementById("error_log").innerHTML = LastError;
    document.getElementById("error_log").style.display = 'block';

}
else if (erpConnection.ERPPort == '') {
    LastError = '<img src="icons/icons_40x33/error_red_40x33_a.png"> <strong>ERROR:</strong> TrueERP server port not specified. Please go to <a href="/register">Setup Connection</a> to rectify this.';
    document.getElementById("error_log").innerHTML = LastError;
    document.getElementById("error_log").style.display = 'block';

}

var req = new XMLHttpRequest();
req.open('GET', URLRequest + erpConnection.ERPIPAddress + ':' + erpConnection.ERPPort + '/' + erpConnection.ERPApi + '/' + erpConnection.ERPSystemObject, false);
req.setRequestHeader("database",erpConnection.ERPDatabase);
req.setRequestHeader("username",erpConnection.ERPUsername);
req.setRequestHeader("password",erpConnection.ERPPassword);
req.send(null);
var headers = req.getAllResponseHeaders().toLowerCase();
*/

//document.getElementById("error_log").innerHTML = headers;
//document.getElementById("error_log").style.display = 'block';

return erpConnection;
}


/*var erpDb = {
  logMsg: "",
  ERPAPIServer: "HTTP://192.168.88.235:88/erpapi/",
  ERPIPAddress: "192.168.88.235",
  ERPUsername: "WebUser",
  ERPPassword: "webuser",
  ERPDatabase: "sample_company",
  ERPPort: "88",
  ERPUseSSL: false,
  ERPApi: "erpapi",
  ERPCustomerObject: "TCustomer?PropertyList==ID,GlobalRef,ClientName,FirstName,LastName,Phone,Mobile,Email,Active"
}

*/
