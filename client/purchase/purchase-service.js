import {BaseService} from '../js/base-service.js';
export class Purchase extends BaseService {
    getAwaitingPayment() {
        return this.GET(this.erpGet.ERPAwaitingPaymentInv);
    }

    getAwaitingBills() {
        return this.GET(this.erpGet.ERPAwaitingPaymentBill);
    }

    getOverduePayments() {
        return this.GET(this.erpGet.ERPOverDuePaymentInv);

    }
    getOverdueBills() {
        return this.GET(this.erpGet.ERPOverDuePaymentBill);

    }

    getCurrency(){
        let options = {
            PropertyList: "Code,Country,Currency,CurrencySymbol",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TCurrency, options);
    }
    getSupplier(){
        let options = {
            PropertyList: "ClientName,Email,Street,Street2,Street3,Suburb,State,Postcode,Country",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TSupplier, options);
    }

    getProducts(){
        let options = {
          PropertyList: "ProductName,SalesDescription,SellQty1Price,TaxCodeSales",
          select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TProduct, options);
    }

    getTaxCodes(){
        let options = {
            PropertyList: "CodeName,Rate",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TTaxCode, options);
    }

    getTaxCodesVS1(){
        let options = {
            PropertyList: "CodeName,Rate",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TTaxcodeVS1, options);
    }
    getAccountTypes() {
        let options = {
            PropertyList: "ID,AccountName,AccountTypeName,TaxCode,AccountNumber,Description",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TAccount, options);
    }

    getOnePurchaseOrderData(id){
        return this.getOneById(this.ERPObjects.TPurchaseOrderEx, id);
    }
    savePO(data){
        return this.POST(this.ERPObjects.TPurchaseOrderEx, data);
    }

    getOneBillData(id){
        return this.getOneById(
            this.ERPObjects.TBillEx, id);
    }
    saveBill(data){
        return this.POST(this.ERPObjects.TBillEx, data);
    }
    getPOIds(){
        let options = {
            PropertyList: "ID",
        };
        return this.getList(this.ERPObjects.TPurchaseOrderEx, options);
    }
    getBillIds(){
        let options = {
            PropertyList: "ID",
        };
        return this.getList(this.ERPObjects.TBillEx, options);
    }
    savePaymentData(data){
        return this.POST(this.ERPObjects.TSupplierPayment, data);
    }
    saveBankAccont(data){
        return this.POST(this.ERPObjects.TAccount, data);
    }

    getTermData() {
        let options = {
            PropertyList: "ID,TermsName,",
        };
        return this.getList(this.ERPObjects.TTerms, options);
    }

    getTermDataVS1() {
        let options = {
            PropertyList: "ID,TermsName,",
        };
        return this.getList(this.ERPObjects.TTermsVS1, options);
    }
}
