import {BaseService} from "../js/base-service";
export class ReconService extends BaseService {

    getAccountNameVS1() {
        let options = {
            PropertyList: "Id,AccountName,AccountTypeName",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TAccountVS1, options);
    }

    getToBeReconciledDeposit(accountid,dateTo, ignoreDate) {
        let options = '';
        if (ignoreDate === true) {
            options = {
                IgnoreDates:true,
                AccountId: accountid,
            };
        } else {
            options = {
                IgnoreDates: false,
                AccountId: accountid,
                // DateFrom:'"'+dateFrom+'"',
                DateTo:'"'+dateTo+'"'
            };
        }

        return this.getList(this.ERPObjects.TToBeReconciledDeposit, options);
    }

    getToBeReconciledWithdrawal(accountid, dateTo, ignoreDate) {
        // let options = {
        //     AccountId: accountid
        // };
        let options = '';
        if (ignoreDate === true) {
            options = {
                IgnoreDates:true,
                AccountId: accountid,
            };
        }else{
            options = {
                IgnoreDates: false,
                AccountId: accountid,
                // DateFrom:'"'+dateFrom+'"',
                DateTo:'"'+dateTo+'"'
            };
        }
        return this.getList(this.ERPObjects.TToBeReconciledWithDrawal, options);
    }

    getReconciliation(){
        let options = {
            PropertyList: "AccountName,Deleted,DeptName,EmployeeName,Finished,GlobalRef,ID,ISEmpty,KeyValue,Notes,OnHold,OpenBalance,ReconciliationDate,StatementNo,CloseBalance",
            select: "[Deleted]=false"
        };
        return this.getList(this.ERPObjects.TReconciliation, options);
    }

    getReconciliationBalance(bankAccount){
        let options = {
            PropertyList: "AccountName,Deleted,CloseBalance,OpenBalance,OnHold,AccountID",
            select: "[Deleted]=false"
        };
        return this.getList(this.ERPObjects.TReconciliation, options);
    }

    saveReconciliation(data){
        return this.POST(this.ERPObjects.TReconciliation,data);
    }

    getOneReconData(id) {

        return this.getOneById(this.ERPObjects.TReconciliation, id);
    }

}