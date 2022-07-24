import {BaseService} from "../js/base-service";
export class PaymentsService extends BaseService {
  getAllSalesOrder() {
      let options = {
          PropertyList: "Id,DocNumber,ClientName,EmployeeName,SaleClassName,SaleDate,TermsName,deleted",
          // select: "[deleted]=false"
      };
      return this.getList(this.ERPObjects.TSalesOrder, options);
  }

  getAllCustomerPaymentDetails() {
    let options = {
        PropertyList:'PaymentDate,ID,ReferenceNo,PaymentMethodName,AccountName,CompanyName,Amount,Notes,DeptClassName,Balance,Applied,BankAccountName',
        select: "[deleted]=false"
    };
    return this.getList(this.ERPObjects.TCustomerPayment, options);
  }

  getAllCustomerPaymentData1() {
    let options = {
      PropertyList: "ID,AccountName,DeptClassName",
      orderby:'"PaymentID desc"',
      LimitCount:'"1"',
    };
    return this.getList(this.ERPObjects.TCustomerPayment, options);
  }

  getAllSupplierPaymentData1() {
    let options = {
        PropertyList:'ID,AccountName,DeptClassName',
        orderby:'"PaymentID desc"',
        LimitCount:'"1"',
    };
    return this.getList(this.ERPObjects.TSupplierPayment, options);
  }

  getAllCombinePaymentDetails() {
    let options = {
        PropertyList:'PaymentDate,PaymentID,ReceiptNo,ReferenceNo,PaymentMethod,BankAccount,ClientName,PaymentAmount,Notes,Department,OpeningBalance,TYPE,jobname',
        IgnoreDates: true,
        select: "[Deleted]=false"
    };
    return this.getList(this.ERPObjects.TPaymentList, options);
  }

  getAllAccountRunningBalanceDetails() {
    let options = {
        PropertyList:'PaymentDate,PaymentID,ReceiptNo,ReferenceNo,PaymentMethod,BankAccount,ClientName,PaymentAmount,Notes,Department,OpeningBalance,TYPE,jobname',
        IgnoreDates: true,
        select: "[deleted]=false"
    };
    return this.getList(this.ERPObjects.TAccountRunningBalanceReport, options);
  }
  getAllBankAccountDetails() {
    let options = {
        // PropertyList:'PaymentDate,PaymentID,ReceiptNo,ReferenceNo,PaymentMethod,BankAccount,ClientName,PaymentAmount,Notes,Department,OpeningBalance,TYPE,jobname',
        IgnoreDates: true,
        select: "[deleted]=false"
    };
    return this.getList(this.ERPObjects.TBankAccountReport, options);
  }

  getCustomerPaymentByName(customer) {
    let options = {
        ListType: "Detail",
        // PropertyList:'PaymentDate,ID,ReferenceNo,PaymentMethodName,AccountName,CompanyName,Amount,Notes,DeptClassName,Balance',
        select: "[deleted]=false and [CompanyName]='"+customer+"'"
    };
    return this.getList(this.ERPObjects.TCustomerPayment, options);
  }


  getSupplierPaymentByName(customer) {
    let options = {
        ListType: "Detail",
        // PropertyList:'PaymentDate,ID,ReferenceNo,PaymentMethodName,AccountName,CompanyName,Amount,Notes,DeptClassName,Balance',
        select: "[deleted]=false and [CompanyName]='"+customer+"'"
    };
    return this.getList(this.ERPObjects.TSupplierPayment, options);
  }

  getAllSupplierPaymentDetails() {
    let options = {
        PropertyList:'PaymentDate,ID,ReferenceNo,PaymentMethodName,AccountName,CompanyName,Amount,Notes,DeptClassName,Balance,Applied,BankAccountName,ReferenceNo',
        select: "[deleted]=false"
    };
    return this.getList(this.ERPObjects.TSupplierPayment, options);
  }

  getOneCustomerPayment(id){
      return this.getOneById(this.ERPObjects.TCustomerPayment, id);
  }

  getOneSupplierPayment(id){
      return this.getOneById(this.ERPObjects.TSupplierPayment, id);
  }

  getAccountTypes() {
      let options = {
          PropertyList: "ID,AccountName,AccountTypeName,TaxCode,AccountNumber",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TAccount, options);
  }

  getAllAwaitingInvoiceDetails() {
      let options = {
          PropertyList: "ID,EmployeeName,DocNumber,CustPONumber,CustomerName,ForeignExchangeCode,PayMethod,ShipDate,SaleDate,SalesStatus,SalesDescription,DueDate,TotalAmount,TotalAmountInc,TotalPaid,TotalBalance,TotalTax,ReferenceNo,Comments,SaleClassName,TermsName,Comments,IsBackOrder",
          select: "[IsPaid]=false and [deleted]=false"
      };
      return this.getList(this.ERPObjects.TInvoiceEx, options);
  }

  getOverviewAwaitingInvoiceDetails() {
      let options = {
          PropertyList: "ID,DueDate,TotalBalance",
          select: "[IsPaid]=false and [deleted]=false"
      };
      return this.getList(this.ERPObjects.TInvoice, options);
  }

  getOverviewAwaitingSupplierDetails() {
      let options = {
          PropertyList: "ID,DueDate,TotalBalance",
          select: "[IsPaid]=false and [deleted]=false"
      };
      return this.getList(this.ERPObjects.TPurchaseOrder, options);
  }

  getAllAwaitingPOSupplierDetails() {
      let options = {
          PropertyList: "ID,DocNumber,CustPONumber,ClientName,ForeignExchangeCode,PayMethod,OrderDate,OrderStatus,DueDate,TotalAmountInc,TotalPaid,TotalBalance,ReferenceNo,Comments,SaleClassName,Invoiced",
          select: "[IsPaid]=false and [deleted]=false"
      };
      return this.getList(this.ERPObjects.TPurchaseOrder, options);
  }

  getAllAwaitingSupplierDetails() {
    let options = {
      IgnoreDates:true,
      IncludePOs:true,
      IncludeBills:true,
      Paid:false,
      Unpaid:true
    };
    return this.getList(this.ERPObjects.TbillReport, options);
  }

  // getAllPurchaseOrderListAll() {
  //   let options = {
  //     IgnoreDates:true,
  //     IncludePOs:true,
  //     IncludeBills:true
  //   };
  //   return this.getList(this.ERPObjects.TbillReport, options);
  // }

  getAllAwaitingBillSupplierDetails() {
      let options = {
          PropertyList: "ID,DocNumber,CustPONumber,ClientName,ForeignExchangeCode,PayMethod,OrderDate,OrderStatus,DueDate,TotalAmountInc,TotalPaid,TotalBalance,ReferenceNo,Comments,SaleClassName,Invoiced",
          select: "[IsPaid]=false and [deleted]=false"
      };
      return this.getList(this.ERPObjects.TBill, options);
  }

  getAllAwaitingPODetails(){
      let options = {
          PropertyList: "ID,DocNumber,CustPONumber,ClientName,ForeignExchangeCode,PayMethod,OrderDate,OrderStatus,TotalPaid,TotalBalance",
          select: "[IsPaid]=false and [deleted]=false"
      };
      return this.getList(this.ERPObjects.TPurchaseOrder, options);
  }

  getAllAwaitingBillDetails(){
      let options = {
          PropertyList: "ID,DocNumber,CustPONumber,ClientName,ForeignExchangeCode,PayMethod,OrderDate,OrderStatus,TotalPaid,TotalBalance",
          select: "[IsPaid]=false and [deleted]=false"
      };
      return this.getList(this.ERPObjects.TBill, options);
  }
  getOneInvoiceData(id){
      return this.getOneById(this.ERPObjects.TInvoice, id);
  }

  getOnePOData(id){
      return this.getOneById(this.ERPObjects.TPurchaseOrder, id);
  }

  getOneBillData(id){
      return this.getOneById(this.ERPObjects.TBill, id);
  }

  saveDepositData(data){

      return this.POST(this.ERPObjects.TCustPayments, data);
  }

  deleteDepositData(data){

      return this.POST(this.ERPObjects.TCustPayments, data);
  }

  saveSuppDepositData(data){

      return this.POST(this.ERPObjects.TSuppPayments, data);
  }

  deleteSuppDepositData(data){

      return this.POST(this.ERPObjects.TSuppPayments, data);
  }

  getClient() {
      let options = {
          PropertyList: "ClientName,Email,Abn",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TCustomer, options);
  }

  getClientVS1() {
      let options = {
          PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TCustomerVS1, options);
  }

  getSupplier() {
      let options = {
          PropertyList: "ClientName,Email,Abn",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TSupplier, options);
  }

  getSupplierVS1() {
      let options = {
          PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TSupplierVS1, options);
  }

  getDepartment() {
      let options = {
          PropertyList: "DeptClassName",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TDeptClass, options);
  }

  getPaymentMethod() {
      let options = {
          PropertyList: "PaymentMethodName",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TPaymentMethod, options);
  }

  getPaymentMethodVS1() {
      let options = {
          PropertyList: "PaymentMethodName",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TPaymentMethodVS1, options);
  }

  getAccountName() {
      let options = {
          PropertyList: "AccountName,AccountTypeName",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TAccount, options);
  }

  getAccountNameVS1() {
      let options = {
          PropertyList: "AccountName,AccountTypeName",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TAccountVS1, options);
  }

  getOneSalesOrderPayment(id){
      return this.getOneById(this.ERPObjects.TSalesOrder, id);
  }
  getOneQuotePayment(id){
      return this.getOneById(this.ERPObjects.TQuote, id);
  }
  getOneInvoicePayment(id){
      return this.getOneById(this.ERPObjects.TInvoice, id);
  }

  getCustomerSalesPayment(id){
      return this.getOneById(this.ERPObjects.TSalesList, id);
  }

  getOnePurchaseOrderPayment(id){
      return this.getOneById(this.ERPObjects.TPurchaseOrder, id);
  }

  getOneCreditPayment(id){
      return this.getOneById(this.ERPObjects.TCredit, id);
  }

  getOneBillPayment(id){
      return this.getOneById(this.ERPObjects.TBill, id);
  }

  saveCustomerEmail(data) {
      return this.POST(this.ERPObjects.TCustomer, data);
  }

  saveSupplierEmail(data) {
      return this.POST(this.ERPObjects.TSupplier, data);
  }

  getOverviewAPDetails() {
      let options = {
        IgnoreDates: true,
          // Summary: false,
          // select: "[Pay]=false"
      };
      return this.getList(this.ERPObjects.TAPReport, options);
  }

  getOverviewARDetails() {
      let options = {
          IgnoreDates: true,
          // select: "[Pay]=false"
      };
      return this.getList(this.ERPObjects.TARReport, options);
  }

  getCreditPaymentByName(supplier) {
    let options = {
        ListType: "Detail",
        select: "[deleted]=false and [ClientName]='"+supplier+"'"
    };
    return this.getList(this.ERPObjects.TCredit, options);
  }
  }
