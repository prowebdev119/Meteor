import {BaseService} from '../js/base-service.js';
export class SalesBoardService extends BaseService {
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

    getQuoteAcceptedList() {
        let options = {
            PropertyList: "PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,Reference,SalesStatus,ARNotes",
            select: "[deleted]=false and [SalesStatus]='Accepted'"
        };
        return this.getList(this.ERPObjects.TQuoteEx, options);
    }

    getQuoteSentList() {
        let options = {
            PropertyList: "PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,Reference,SalesStatus,ARNotes",
            select: "[deleted]=false and [SalesStatus]='Sent'"
        };
        return this.getList(this.ERPObjects.TQuoteEx, options);
    }

    getQuoteDeclinedList() {
        let options = {
            PropertyList: "PropertyList==ID,GlobalRef,CustomerName,ClientName,ClientPrintName,DocNumber,SaleClassName,EmployeeName,SaleDate,TotalAmountInc,Reference,SalesStatus,ARNotes",
            select: "[deleted]=false and [SalesStatus]='Declined'"
        };
        return this.getList(this.ERPObjects.TQuoteEx, options);
    }

    getQuoteIds() {
        let options = {
            PropertyList: "ID"
        };
        return this.getList(this.erpGet.ERPQuoteCard, options);
    }

    getInvSale() {
        return this.GET(this.erpGet.ERPInvSalesObject);
    }

    getInvSaleCustomer() {
      let options = {
          PropertyList: "PropertyList==ID,TotalAmountInc,printflag,converted,SalesStatus,DueDate,CustomerName,SaleDate,CustPONumber,TotalPaid,TotalBalance,deleted,IsPaid",
          select: "[deleted]=false"
      };
        return this.getList(this.ERPObjects.TInvoiceEx, options);
    }

    getQuoteSale() {
        return this.GET(this.erpGet.ERPQuoteSalesObject);

    }
    getQuoteSaleListData() {
        return this.GET(this.erpGet.ERPQuoteSalesObject);

    }

    getSOSale() {
        return this.GET(this.erpGet.ERPSOSalesObject);

    }

    getSOListDraft() {
        return this.GET(this.erpGet.ERPSOListDraftObject);
    }

    getInvSaleForChart() {
        let options = {
            PropertyList: "ID,TotalAmountInc,printflag,converted,SalesStatus,DueDate,CustomerName,SaleDate,CustPONumber,TotalPaid,TotalBalance",
            select: "[IsPaid]=false and [deleted]=false"
        };
        return this.getList(this.ERPObjects.TInvoice, options);

    }

    getCurrency() {
        let options = {
            PropertyList: "Code,Country,Currency,CurrencySymbol",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TCurrency, options);
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
            PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country,TermsName",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TCustomerVS1, options);
    }

    getSupplier() {
        let options = {
            PropertyList: "ClientName",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TSupplier, options);
    }

    getSupplierVS1(){
      let options = {
          PropertyList: "ClientName",
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

    saveRefundSale(data) {
        return this.POST(this.ERPObjects.TRefundSale, data);
    }

    getRefundSales(id) {
        return this.getOneById(this.ERPObjects.TRefundSale,id);
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

    getTerm() {
        let options = {
            PropertyList: "TermsName,Days,IsEOM,IsEOMPlus",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TTerms, options);
    }

    getTermVS1() {
        let options = {
            PropertyList: "TermsName,",
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

        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,SaleCustField1,SaleCustField2,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments",
        select: "[Deleted]=false",
      };
      return this.getList(this.ERPObjects.TSalesOrder, options);
    }

    getAllSalesOrderListNonBO() {
      let options = {

        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,SaleCustField1,SaleCustField2,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",

      };
      return this.getList(this.ERPObjects.TsalesOrderNonBackOrder, options);
    }

    getAllQuoteList() {
      let options = {

        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,DueDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments",
        select: "[Deleted]=false",
      };
      return this.getList(this.ERPObjects.TQuote, options);
    }
    getAllInvoiceList() {
      let options = {

        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,DueDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,IsBackOrder",
        select: "[Deleted]=false",
      };
      return this.getList(this.ERPObjects.TInvoice, options);
    }

    getAllRefundList() {
      let options = {

        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,DueDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,IsBackOrder",
        select: "[Deleted]=false",
      };
      return this.getList(this.ERPObjects.TRefundSale, options);
    }

    getAllInvoiceListNonBO() {
      let options = {

        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,DueDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",

      };
      return this.getList(this.ERPObjects.TInvoiceNonBackOrder, options);
    }

    getAllBOInvoiceList() {
      let options = {

        FilterString: "SaleType='Invoice'",
        select: "[Deleted]=false",
      };
      return this.getList(this.ERPObjects.BackOrderSalesList, options);
    }

    saveSignature(data) {
        return this.POST(this.ERPObjects.TSaleClientSignature, data);
    }

    saveCustomerEmail(data) {
        return this.POST(this.ERPObjects.TCustomer, data);
    }

    getInvoicePrint() {
      let options = {
          PropertyList: "ID,DocNumber,ClientName,ClientPrintName,SaleClassName,EmployeeName,SaleDate,TotalAmount,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,ShipDate,TermsName,DueDate,BackOrderGlobalRef,SalesStatus",
          select: "[deleted]=false"
      };
      return this.getList(this.ERPObjects.TInvoice, options);
  }

  saveLeadStatus(data){
    return this.POST(this.ERPObjects.TLeadStatusType,data);
  }

  saveShipVia(data){
    return this.POST(this.ERPObjects.TShippingMethod,data);
  }

  getAllLeadStatus() {
    let options = {
      PropertyList: "ID,TypeName",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TLeadStatusType, options);
  }

  getInvSaleByCustomer() {
    let options = {
        PropertyList: "PropertyList==ID,DueDate,CustomerName,SaleDate,TotalPaid,TotalBalance,deleted,IsPaid,TotalAmountInc,EmployeeName",
        select: "[deleted]=false"
    };
      return this.getList(this.ERPObjects.TInvoiceEx, options);
  }

  getPurchaseBySupplier() {
    let options = {
        PropertyList: "PropertyList==ID,DueDate,ClientName,OrderDate,TotalPaid,TotalBalance,deleted,IsPaid,TotalAmountInc",
        select: "[deleted]=false"
    };
      return this.getList(this.ERPObjects.TPurchaseOrderEx, options);
  }

  getCheckPaymentIDByURLID(urlID) {
      let options = {
          ListType: "Detail",
          select: '[InvoiceNo]="'+urlID+'"',
      };
      return this.getList(this.ERPObjects.TCustomerPaymentLine, options);
  }

  getCheckPaymentDetailsByName(customerName) {
      let options = {
          ListType: "Detail",
          select: '[ClientPrintName]="'+customerName+'" and [deleted]=false',
      };
      return this.getList(this.ERPObjects.TCustomerPayment, options);
  }

  getCheckPaymentLineByTransID(transID) {
      let options = {
          ListType: "Detail",
          select: '[TransNo]="'+transID+'"',
      };
      return this.getList(this.ERPObjects.TCustomerPaymentLine, options);
  }

}
