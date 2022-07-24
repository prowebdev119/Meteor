import {BaseService} from "../../js/base-service";

export class PurchaseService extends BaseService {
    getAgedPayableReport() {
        let options = {
            propertyList: "ExpenseClaimID"
        };
        return this.getList(this.ERPObjects.TExpenseClaimReport);
    }
    getPayableData() {
        let options = {
            Summary: false
        };
        return this.getList(this.ERPObjects.APList, options);
    }
    getAgedPayableDetailsData() {
        let options = {
            PropertyList: "InvoiceDate,DueDate,InvoiceNumber",
            Summary: false
        };
        return this.getList(this.ERPObjects.APList, options);
    }
    getAgedPayableSummaryData() {
        let options = {
            Summary: true
        };
        return this.getList(this.ERPObjects.APList, options);
    }
    getSupplierInvoiceReportData(){
        let options = {
            ListType:"Detail"
        };
        return this.getList(this.ERPObjects.TSupplierPayment,options);
    }

    saveSupplierInvoiceData(data){
        return this.POST(this.ERPObjects.TSupplierPayment, data);
    }

    getPuchaseOrderData()
    {
        return this.getList(this.ERPObjects.TPurchaseOrder);
        //return this.getList(this.ERPObjects.TPurchaseOrder);
    }

    getBillOrderData()
    {
        return this.getList(this.ERPObjects.TBill);
    }
    savePayable(data){
        return this.POST(this.ERPObjects.APList, data);
    }
    saveExpense(data){
        return this.POST(this.ERPObjects.TExpenseClaim, data);
    }
    getOnepayableData(id) {
        return this.getOneById(this.ERPObjects.APList, id);
    }
    getBillableExpenseData(){
        return this.getList(this.ERPObjects.TBillReport);
    }
    getIncomeInvoiceData()
    {
        let options = {
            PropertyList: "ID"
        };
        return this.getList(this.ERPObjects.TInvoiceEx,options);
    }
}