import {BaseService} from "../js/base-service";

export class InvoiceService extends BaseService {
    getInvoices(){
        return this.getList(this.ERPObjects.TInvoiceEx);
    }

    saveInvoice(data){
        return this.POST(this.ERPObjects.TInvoiceEx, data);
    }
    getPurchaseOrder() {
        let options = {
            PropertyList: "ID,DocNumber,ClientName,ClientPrintName,SaleClassName,EmployeeName,SaleDate,TotalAmount,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,ShipDate,TermsName,DueDate,BackOrderGlobalRef,SalesStatus",
            select: "[deleted]=false"
        };
        return this.getList(this.ERPObjects.TInvoice, options);
    }
    getPOIds(){
        let options = {
            PropertyList: "ID",
        };
        return this.getList(this.ERPObjects.TInvoiceEx, options);
    }
    getAccountDATA(){
        return this.getList(this.ERPObjects.TAccount);
    }
    getOneInvoiceData(id){
        return this.getOneById(this.ERPObjects.TInvoice, id);
    }
    getOneInvoiceDataFromEx(id){
        return this.getOneById(this.ERPObjects.TInvoiceEx, id);
    }
    savePaidStatusData(data){

        return this.POST(this.ERPObjects.TInvoice, data);
    }
    saveDepositData(data){

        return this.POST(this.ERPObjects.TCustomerPayment, data);
    }
    getCompanyInfo(){
        let options = {
            PropertyList: "PoBox,PoBox2,PoBox3,PoCity,PoState,PoPostcode,PoCountry,abn,CompanyNumber,BankName,BankAccountName",
        };
        return this.getList(this.ERPObjects.TCompanyInfo, options);
    }
}
