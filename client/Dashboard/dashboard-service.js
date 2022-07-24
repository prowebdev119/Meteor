import {BaseService} from '../js/base-service.js';
export class DashBoardService extends BaseService {
    getAwaitingPayment() {
        let options = {
            PropertyList: "ID,TotalAmountInc,TotalBalance,DueDate",
            select: "[IsPaid]=false and [deleted]=false"
            //LimitCount : 5
        }
        return this.getList(this.ERPObjects.TInvoice, options);
    }

    getDraft() {
        let options = {
            PropertyList: "ID,TotalAmountInc,TotalBalance,DueDate",
            select: "[SalesStatus]='Draft' and [deleted]=false"
            //LimitCount : 5
        }
        return this.getList(this.ERPObjects.TInvoice, options);
    }

    getDraftBill(){
      let options = {
          PropertyList: "ID,TotalAmountInc,TotalBalance",
          select: "[OrderStatus]='Draft' and [deleted]=false"
          //LimitCount : 5
      }
      return this.getList(this.ERPObjects.TBill, options);
    }

    getOneInvoice(id) {
        return this.getOneById(this.ERPObjects.TInvoice, id);
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

    getExpenseClaim() {
        return this.GET(this.erpGet.ERPTExpense);
    }
    getAccountWatchlistData() {
        return this.getList(this.ERPObjects.TDashboardAccountSummaryReport);

    }
}
