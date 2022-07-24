import {BaseService} from '../js/base-service.js';
export class PurchaseBoardService extends BaseService {
    getQuoteList() {
        let options = {
            PropertyList: "PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,Reference,SalesStatus,ARNotes",
            select: "[deleted]=false and [SalesStatus]='Draft'"
        };
        return this.getList(this.ERPObjects.TQuoteEx, options);
    }

    getQuoteInvoiceList() {
        let options = {
            PropertyList: "PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,Reference,SalesStatus,ARNotes",
            select: "[deleted]=false and [SalesStatus]='Invoiced'"
        };
        return this.getList(this.ERPObjects.TQuoteEx, options);
    }


    getInvSale() {
        return this.GET(this.erpGet.ERPInvSalesObject);
    }



    getClient() {
        let options = {
            PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country",
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
            PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TSupplier, options);
    }

    getSupplierVS1(){
      let options = {
          PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country,TermsName",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TSupplierVS1, options);
    }


    getProducts() {
        let options = {
            PropertyList: "ProductName,SalesDescription,SellQty1Price,TaxCodeSales",
            select: "[Active]=true",

        };
        return this.getList(this.ERPObjects.TProduct, options);
    }

    getAccountTypes() {
        let options = {
            PropertyList: "ID,AccountName,AccountTypeName,TaxCode,AccountNumber,Description",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TAccount, options);
    }

    getAccountTypesPrice() {
        let options = {
            PropertyList: "ID,LineCost",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TBillLines, options);
    }

    getTaxCodes() {
        let options = {
            PropertyList: "CodeName,Rate,Description",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TTaxCode, options);
    }

    getTaxCodesVS1() {
        let options = {
            PropertyList: "CodeName,Rate,Description",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TTaxcodeVS1, options);
    }


    saveSalesQuote(data) {
        return this.POST(this.ERPObjects.TQuoteEx, data);
    }

    getId() {
        let url = window.location.href;
        let getquote_id = url.split('?id=');
        let quote_id = getquote_id[getquote_id.length - 1];
        return quote_id;
    }

    getOneInvoicedataEx(id) {

        return this.getOneById(this.ERPObjects.TInvoiceEx, id);
    }

    getOneInvoicedata(id) {

        return this.getOneById(this.ERPObjects.TInvoiceEx, id);
    }

    getOneInvoicePaymentdata(id) {

        return this.getOneById(this.ERPObjects.TInvoiceEx, id);
    }

    getOneQuotedataEx(id) {

        return this.getOneById(this.ERPObjects.TQuoteEx, id);
    }

    getOneQuotedata(id) {

        return this.getOneById(this.ERPObjects.TQuoteEx, id);
    }

    saveQuoteEx(data) {
        return this.POST(this.ERPObjects.TQuoteEx, data);
    }

    saveQuote(data) {
        return this.POST(this.ERPObjects.TQuote, data);
    }


    saveInvoiceEx(data) {
        return this.POST(this.ERPObjects.TInvoiceEx, data);
    }


    getOneBilldata(id) {

        return this.getOneById(this.ERPObjects.TBillEx, id);
    }

    getDepartment() {
        let options = {
            PropertyList: "DeptClassName",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TDeptClass, options);
    }

    getAreaCode() {
        let options = {
            PropertyList: "Areacode",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TAreaCode, options);
    }

    getShpVia() {
        let options = {
            PropertyList: "ShippingMethod",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TShippingMethod, options);
    }



    getTerm() {
        let options = {
            PropertyList: "TermsName",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TTerms, options);
    }

    getTermVS1() {
        let options = {
            PropertyList: "TermsName",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TTermsVS1, options);
    }

    getBillIDs() {
        let options = {
            PropertyList: "ID",
        };
        return this.getList(this.ERPObjects.TBillEx, options);
    }

    getOnePOData(id) {
        return this.getOneById(this.ERPObjects.TPurchaseOrder, id);
    }

    getOnePurchaseOrderdataEx(id) {
        return this.getOneById(this.ERPObjects.TPurchaseOrderEx, id);
    }

    getOneBilldataEx(id) {
        return this.getOneById(this.ERPObjects.TBillEx, id);
    }

    getOneCreditData(id) {
        return this.getOneById(this.ERPObjects.TCredit, id);
    }

    getItemTypes() {
        let options = {
            PropertyList: "ID,ProductName,PurchaseDescription,BuyQty1Cost,TaxCodePurchase,ProductPrintName,ProductCode,SalesDescription,UOMSales",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TProduct, options);
    }

    getSalesOrderList() {
        let options = {
            PropertyList: "PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,SalesStatus",
            select: "[deleted]=false and [SalesStatus]='Draft'"
        };
        return this.getList(this.ERPObjects.TSalesOrderEx, options);
    }

    getSalesOrderInvoiceList() {
        let options = {
            PropertyList: "PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,SalesStatus",
            select: "[deleted]=false and [SalesStatus]='Invoiced'"
        };
        return this.getList(this.ERPObjects.TSalesOrderEx, options);
    }

    getSalesOrderAcceptedList() {
        let options = {
            PropertyList: "PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,SalesStatus",
            select: "[deleted]=false and [SalesStatus]='Accepted'"
        };
        return this.getList(this.ERPObjects.TSalesOrderEx, options);
    }

    getSalesOrderSentList() {
        let options = {
            PropertyList: "PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,SalesStatus",
            select: "[deleted]=false and [SalesStatus]='Sent'"
        };
        return this.getList(this.ERPObjects.TSalesOrderEx, options);
    }

    getSalesOrderDeclinedList() {
        let options = {
            PropertyList: "PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,CustPONumber,SalesStatus",
            select: "[deleted]=false and [SalesStatus]='Declined'"
        };
        return this.getList(this.ERPObjects.TSalesOrderEx, options);
    }

    getSalesOrderIds() {
        let options = {
            PropertyList: "ID"
        };
        return this.getList(this.erpGet.ERPSalesOrderCard, options);
    }

    getQuoteSale() {
        return this.GET(this.erpGet.ERPSalesOrderSalesObject);

    }


    saveSalesSalesOrder(data) {
        return this.POST(this.ERPObjects.TSalesOrderEx, data);
    }


    getOneSalesOrderdataEx(id) {

        return this.getOneById(this.ERPObjects.TSalesOrderEx, id);
    }

    getOneSalesOrderdata(id) {

        return this.getOneById(this.ERPObjects.TSalesOrder, id);
    }

    saveSalesOrderEx(data) {
        return this.POST(this.ERPObjects.TSalesOrderEx, data);
    }

    saveSalesOrder(data) {
        return this.POST(this.ERPObjects.TSalesOrder, data);
    }

    getBillData() {
        let options = {
            PropertyList: "ClientName,ContactName,ID,DocNumber,TotalAmount,TotalTax,TotalAmountInc,OrderDate,DueDate,Comments,SupplierInvoiceNumber,GlobalRef,ETADate,Invoiced,Deleted,SalesComments,Approved,TotalBalance",
            select: "[deleted]=false and [IsBill]=true",
        };
        return this.getList(this.ERPObjects.TBill, options);
    }

    getUOMByProds() {
        let options = {
            PropertyList: "ID,ProductName,UOMName",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TUnitOfMeasure, options);
    }

    getProductClassQuantitys() {
        let options = {
            PropertyList: "ID,AvailableQty,InStockQty,ProductName,DepartmentName",
            /*select: "[ProductName]='"+productname+"'and[DepartmentName]='"+deptName+"'",*/
        };
        return this.getList(this.ERPObjects.TProductClassQuantity, options);
    }

    getProductDataByBarcodes(barcode) {
        let options = {
            PropertyList: "ID,BarCode,Productname",
            select: "[BarCode]='"+barcode+"'and [Active]=true",
            /*[Active]=true and= select: "[ProductName]='"+productname+"'and[DepartmentName]='"+deptName+"'",*/
        };
        return this.getList(this.ERPObjects.TProductBarcode, options);
    }

    getProductDataByNames(prodName) {
        let options = {
            PropertyList: "ID,ProductName,PurchaseDescription,BuyQty1Cost,TaxCodePurchase,ProductPrintName,ProductCode,SalesDescription,UOMSales",
            select: "[ProductName]='"+prodName+"'and [Active]=true",
            /*select: "[ProductName]='"+productname+"'and[DepartmentName]='"+deptName+"'",*/
        };
        return this.getList(this.ERPObjects.TProduct, options);
    }

    getOneStockAdjust(id) {

        return this.getOneById(this.ERPObjects.TStockAdjustEntry, id);
    }

    getProdImgByProds(prodName) {
        let options = {
            PropertyList: "ID,ProductName,MIMEEncodedPicture,PicType,ProductName,ImageName",
            select: "[ProductName]='"+prodName+"'and[IsDefault]=true",
        };
        return this.getList(this.ERPObjects.TProductPicture, options);
    }

    validateProdSerialNumbers(scannedCode) {

        return this.getList("ValidateSN?SerialNumber='"+scannedCode+"'");
    }

    getProductDataByIds(prodID) {
        let options = {
            PropertyList: "ID,ProductName,PurchaseDescription,BuyQty1Cost,TaxCodePurchase,ProductPrintName,ProductCode,SalesDescription,UOMSales",
            select: "[ID]='"+prodID+"'and [Active]=true",
            /*select: "[ProductName]='"+productname+"'and[DepartmentName]='"+deptName+"'",*/
        };
        return this.getList(this.ERPObjects.TProduct, options);
    }
    getTCustomerPaymentData(customerName) {
        let options = {
            ListType: "Detail",
            select: "[CompanyName]='"+customerName+"'",
        };
        return this.getList(this.ERPObjects.TCustomerPayment, options);
    }

    getAllSalesOrderdata() {
      let options = {
        ListType: "Detail"

      };
      return this.getList(this.ERPObjects.TSalesOrder, options);
    }

    getAllSalesOrderList() {
      let options = {

        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,SaleCustField1,SaleCustField2",
        select: "[Deleted]=false",
      };
      return this.getList(this.ERPObjects.TSalesOrder, options);
    }

    getAllQuoteList() {
      let options = {

        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName",
        select: "[Deleted]=false",
      };
      return this.getList(this.ERPObjects.TQuote, options);
    }
    getAllInvoiceList() {
      let options = {

        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName",
        select: "[Deleted]=false",
      };
      return this.getList(this.ERPObjects.TInvoice, options);
    }

    getAllPurchaseOrderList() {
      let options = {

        PropertyList: "ID,EmployeeName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,IsBackOrder",
        select: "[Deleted]=false",
      };
      return this.getList(this.ERPObjects.TPurchaseOrder, options);
    }

    getAllPurchaseOrderListNonBo() {
      let options = {

        PropertyList: "ID,EmployeeName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",

      };
      return this.getList(this.ERPObjects.TpurchaseOrderNonBackOrder, options);
    }

    getAllPurchaseOrderListAll() {
      let options = {
        IgnoreDates:true,
        IncludePOs:true,
        IncludeBills:true
      };
      return this.getList(this.ERPObjects.TbillReport, options);
    }

    getAllPurchaseOrderListBO() {
      let options = {

        PropertyList: "ID,EmployeeName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",

      };
      return this.getList(this.ERPObjects.TpurchaseOrderBackOrder, options);
    }

    getAllBillList() {
      let options = {

        PropertyList: "ID,EmployeeName,AccountName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments",
        select: "[Deleted]=false and [Cancelled]=false",
      };
      return this.getList(this.ERPObjects.TBill, options);
    }

    getAllCreditList() {
      let options = {
        PropertyList: "ID,EmployeeName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,AccountName",
        select: "[Deleted]=false",
      };
      return this.getList(this.ERPObjects.TCredit, options);
    }


    saveSignature(data) {
        return this.POST(this.ERPObjects.TSaleClientSignature, data);
    }

    saveCustomerEmail(data) {
        return this.POST(this.ERPObjects.TCustomer, data);
    }

    saveSupplierEmail(data) {
        return this.POST(this.ERPObjects.TSupplier, data);
    }

    savePurchaseOrderEx(data) {
        return this.POST(this.ERPObjects.TPurchaseOrderEx, data);
    }

    saveBillEx(data) {
        return this.POST(this.ERPObjects.TBillEx, data);
    }

    saveJournalEnrtry(data) {
        return this.POST(this.ERPObjects.TJournalEntry, data);
    }

    saveBankDeposit(data) {
        return this.POST(this.ERPObjects.TVS1BankDeposit, data);
    }

    saveCredit(data) {
        return this.POST(this.ERPObjects.TCredit, data);
    }

    getAllLeadStatus() {
      let options = {
        PropertyList: "ID,TypeName",
        select: "[Active]=true",
      };
      return this.getList(this.ERPObjects.TLeadStatusType, options);
    }

    getOneBillData(id){
        return this.getOneById(
            this.ERPObjects.TBillEx, id);
    }

    getOneJournalEnrtyData(id){
        return this.getOneById(
            this.ERPObjects.TJournalEntry, id);
    }
    getOneDepositEnrtyData(id){
        return this.getOneById(
            this.ERPObjects.TVS1BankDeposit, id);
    }

    getJournalIds(){
    let options = {
        PropertyList: "ID",
    };
    return this.getList(this.ERPObjects.TJournalEntry, options);
  }

  getDepositEntryIds(){
  let options = {
      PropertyList: "ID",
  };
  return this.getList(this.ERPObjects.TVS1BankDeposit, options);
}

  getAllChequeList() {
    let options = {

      PropertyList: "ID,EmployeeName,GLAccountName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,SupplierInvoiceNumber",
      select: "[Deleted]=false and [Cancelled]=false",
    };
    return this.getList(this.ERPObjects.TCheque, options);
  }

  getAllChequeList1() {
    let options = {
      PropertyList: "ID,GLAccountName",
      orderby:'"PurchaseOrderID desc"',
      LimitCount:'"1"',
    };
    return this.getList(this.ERPObjects.TCheque, options);
  }

  getAllStockTransferEntry1() {
    let options = {
      PropertyList: "ID,TransferFromClassName",
    };
    return this.getList(this.ERPObjects.TStockTransferEntry, options);
  }

  getAllReconcilationList() {
    let options = {

      PropertyList: "ID,ReconciliationDate,EmployeeName,AccountName,StatementNo,DeptName,OpenBalance,CloseBalance,EmployeeName,Finished,Notes",
      select: "[Deleted]=false",
    };
    return this.getList(this.ERPObjects.TReconciliation, options);
  }

  getOneChequeData(id){
      return this.getOneById(
          this.ERPObjects.TCheque, id);
  }

  getOneChequeDataEx(id){
      return this.getOneById(
          this.ERPObjects.TChequeEx, id);
  }

  saveChequeEx(data) {
      return this.POST(this.ERPObjects.TChequeEx, data);
  }

  saveCheque(data) {
      return this.POST(this.ERPObjects.TCheque, data);
  }

  getCheckCreditData(supplierName) {
      let options = {
          select: "[SupplierName]='"+supplierName+"'",
      };
      return this.getList(this.ERPObjects.TCredit, options);
  }

  getCheckPaymentDetailsByName(supplierName) {
      let options = {
          ListType: "Detail",
          select: '[ClientPrintName]="'+supplierName+'" and [deleted]=false',
      };
      return this.getList(this.ERPObjects.TSupplierPayment, options);
  }

  getCheckPaymentLineByTransID(transID) {
      let options = {
          ListType: "Detail",
          select: '[TransNo]="'+transID+'"',
      };
      return this.getList(this.ERPObjects.TSupplierPaymentLine, options);
  }

}
