import {BaseService} from '../js/base-service.js';
export class StockAdjust extends BaseService {

    getStockAdjustPendings() {
        return this.GET(this.erpGet.ERPPendingStockTakeListObject);
    }

    getStockAdjustProcessed() {
        return this.GET(this.erpGet.ERPProcessedStockTakeListObject);
    }

    getStockAdjustDeleted() {
        return this.GET(this.erpGet.ERPDeletedStockTakeListObject);

    }

    saveStock(data){


        return this.POST(this.ERPObjects.TStockAdjustEntry, data);
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
            PropertyList: "ClientName,Email",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TSupplier, options);
    }

    getSupplierVS1(){
      let options = {
          PropertyList: "ClientName,Email",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TSupplierVS1, options);
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

    getOneStockAdjustData(id){
        return this.getOneById(this.ERPObjects.TStockAdjustEntry, id);
    }


    getOneBillData(id){
        return this.getOneById(
            this.ERPObjects.TBill, id);
    }
    saveBill(data){
        return this.POST(this.ERPObjects.TBill, data);
    }
    getPOIds(){
        let options = {
            PropertyList: "ID",
        };
        return this.getList(this.ERPObjects.TPurchaseOrderEx, options);
    }

    getEmployees() {
        return this.getList(this.ERPObjects.TEmployee);
    }

    getCompanyInfo(){
        let options = {
            PropertyList: "PoBox,PoBox2,PoBox3,PoCity,PoState,PoPostcode,PoCountry,abn,CompanyNumber,BankName,BankAccountName",
        };
        return this.getList(this.ERPObjects.TCompanyInfo, options);
    }
}
