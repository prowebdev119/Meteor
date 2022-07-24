import {BaseService} from '../../js/base-service.js';

export class ReportsSalesServices extends BaseService {
   getAgedReceivableDetailsData() {
        let options = {
            Summary: false
        };
        return this.getList(this.ERPObjects.ARList, options);
   }
    getOneInvoicedata(id) {
        return this.getOneById(this.ERPObjects.TInvoiceEx, id);
    }

    getInvoiceDataId() {
        let options = {
         ListType :"Detail"
        };
        return this.getList(this.ERPObjects.TInvoice, options)
    }

   getInvoiceData() {
       let options = {
           PropertyList:'ID,CustPONumber,CustomerName,CreationDate,DueDate,TotalAmountInc,TotalPaid,AmountDue,SalesStatus,ForeignExchangeCode,ARNotes',
       };
       return this.getList(this.ERPObjects.TInvoice, options)
   }
   getCustomerPaymentDetails(){
       let options = {
           PropertyList:'PaymentDate,ID,ReferenceNo,PaymentMethodName,AccountName,CompanyName,Amount,Notes,DeptClassName,Balance',
       };
       return this.getList(this.ERPObjects.TCustomerPayment, options)
   }
    getAgedReceivableData() {
        let options = {
            Summary: false,
        };
        return this.getList(this.ERPObjects.ARList, options);
    }
    saveAgedReceivableData(data){
        return this.POST(this.ERPObjects.ARList, data);
    }
    getExpenseByContactData() {
        let options = {
            PropertyList:'PaymentDate,ID,ReferenceNo,PaymentMethodName,AccountName,CompanyName,Amount,Notes,DeptClassName,Balance',
        };
        return this.getList(this.ERPObjects.TSupplierPayment, options);
    }

    getAllSalesOrderList() {
      let options = {
        // ListType: "Detail"
        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax",
        select: "[Deleted]=false",
      };
      return this.getList(this.ERPObjects.TSalesOrder, options);
    }

    getAllProductSalesDetails(dateFrom, dateTo, ignoreDate) {
      let options = '';
      if(ignoreDate == true){
        options = {
           IgnoreDates:true
       };
     }else{
       options = {
          IgnoreDates:false,
          DateFrom:'"'+dateFrom+'"',
          DateTo:'"'+dateTo+'"'
      };
     }
      return this.getList(this.ERPObjects.TProductSalesDetailsReport, options);
    }
}
