import {BaseService} from "../../js/base-service";

export class AccountingService extends BaseService {
    getDetailAccountTransactions() {
        let options = {
            PropertyList: "ClientID,TransactionDate,CustomerName,InvoiceNumber,TransType,Status,TotalAmount",
        };
        return this.getList(this.ERPObjects.TRepObjStatementList, options);
    }
    getSaleGroup(id) {
        return this.getOneById(this.ERPObjects.SaleGroup, id);
    }
    getTrialBalanceData(date) {
        let options = {
            select:"[Active]=true&&DateFrom="+date,
            ListType:"Detail",
        };
        return this.getList(this.ERPObjects.TTrialBalanceReport, options);
    }

    getGeneralLedgerData(){

        return this.getList(this.ERPObjects.TGeneralLedgerReport);
    }
    getGeneralLedgerDataById(id){
        return this.getOneById(this.ERPObjects.TGeneralLedgerReport, id);
    }
}
