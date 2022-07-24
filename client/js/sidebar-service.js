import {BaseService} from '../js/base-service.js';
import {HTTP} from 'meteor/http';
export class SideBarService extends BaseService {
  getNewProductListVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
         ListType: "Detail",
         select: "[Active]=true"
        };
    }else{
      options = {
         orderby:'"PARTSID desc"',
         ListType: "Detail",
         select: "[Active]=true",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TProductVS1, options);
  }

  // getAllCurrencies()
  // {
  //   return this.getList('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/aud.json');

  // }

  getAllFundType() {
    let options = {

    };
    return this.getList(this.ERPObjects.TSuperType, options);

  }
  getRateTypes() {
    let options = {
        PropertyList: "ID,Description",
        select: "[Active]=true"
    };
    return this.getList(this.ERPObjects.TRateTypes, options);
}
  getPayrollinformation(limitcount, limitfrom)
  {

    let options = '';
    if(limitcount == 'All'){
       options = {
         ListType: "Detail",

        };
    }else{
      options = {

         ListType: "Detail",

     };
    }
    return this.getList(this.ERPObjects.TPayrollOrganization, options);

  }

  getOrdinarytimeEarning(limitcount, limitfrom)
  {
    let options = '';
    if(limitcount == 'All'){
       options = {
         ListType: "Detail",
         select:'[OrdinaryTimeEarningsActive]=true'

        };
    }else{
      options = {

         ListType: "Detail",
         select:'[OrdinaryTimeEarningsActive]=true'

     };
    }
    return this.getList(this.ERPObjects.TOrdinaryTimeEarnings, options);

  }

  getAllCurrencies()
  {
       HTTP.call( 'GET', 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/aud.json', { "options": "" }, function( error, response ) {

          return response;

       });



  }


  getExemptReportableTermnination(limitcount,limitfrom)
  {
      let options = '';
      if(limitcount == 'All'){
        options = {

          ListType: "Detail",
          select: "[EmployeeTerminationPaymentsActive]=true"
          };
      }else{
        options = {

          ListType: "Detail",
          select: "[EmployeeTerminationPaymentsActive]=true",
          LimitCount:'"'+limitcount+'"',
          LimitFrom:'"'+limitfrom+'"'
      };
      }
      return this.getList(this.ERPObjects.TTerminationSimple, options);
  }

  getExemptReportableOvertime(limitcount,limitfrom)
  {
    let options = '';
    if(limitcount == 'All'){
       options = {

         ListType: "Detail",
         select: "[OverTimeEarningsActive]=true"
        };
    }else{
      options = {

         ListType: "Detail",
         select: "[OverTimeEarningsActive]=true",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TOverTimeEarnings, options);
  }
  getExemptReportableLumpSumE(limitcount, limitfrom)
  {
    let options = '';
    if(limitcount == 'All'){
       options = {

         ListType: "Detail",
         select: "[LumpSumEActive]=true"
        };
    }else{
      options = {

         ListType: "Detail",
         select: "[LumpSumEActive]=true",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TLumpSumE, options);

  }

  getsuperannuationBonusesCommissions(limitcount, limitfrom)
  {
    let options = '';
    if(limitcount == 'All'){
       options = {

         ListType: "Detail",
         select: "[EarningBonusesCommisionsActive]=true"
        };
    }else{
      options = {

         ListType: "Detail",
         select: "[EarningBonusesCommisionsActive]=true",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TEarningsBonusesCommissions, options);

  }

  getLumpSumW(limitcount, limitfrom)
  {
    let options = '';
    if(limitcount == 'All'){
       options = {

         ListType: "Detail",
         select: "[LumpSumWActive]=true"
        };
    }else{
      options = {

         ListType: "Detail",
         select: "[LumpSumWActive]=true",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TLumpSumW, options);

  }

  getDirectorFee(limitcount,limitfrom)
  {

    let options = '';
    if(limitcount == 'All'){
       options = {

         ListType: "Detail",
         select: "[DirectorsFeesActive]=true"
        };
    }else{
      options = {

         ListType: "Detail",
         select: "[DirectorsFeesActive]=true",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TDirectorsFees, options);

  }
  getProductServiceListVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
         orderby:'"PARTSID desc"',
         ListType: "Detail",
         select: "[Active]=true and [ProductType]!='INV'"
        };
    }else{
      options = {
         orderby:'"PARTSID desc"',
         ListType: "Detail",
         select: "[Active]=true and [ProductType]!='INV'",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TProductVS1, options);
  }

  getHolidayData(limitcount, limitfrom)
  {
    let options = '';
    if(limitcount == 'All'){
       options = {

         ListType: "Detail",
         select: "[PayrollHolidaysActive]=true"
        };
    }else{
      options = {

         ListType: "Detail",
         select: "[PayrollHolidaysActive]=true",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TPayrollHolidays, options);
  }


  getAllCustomFields() {
       let options = {
           ListType: "Detail",
       };
    return this.getList(this.ERPObjects.TCustomFieldList, options);
  }


  getProductServiceListVS1ByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ProductName] f7like "'+dataSearchName+'" OR [BARCODE] f7like "'+dataSearchName+'" and [ProductType]!="INV"'
       };
    return this.getList(this.ERPObjects.TProductVS1, options);
  }

  getSelectedProducts(employeeID) {
       let options = {
           PropertyList: "ID,EmployeeName,PayRate,Rate, ServiceDesc",
           select: '[Active]=true and [EmployeeID]='+employeeID+''
       };
    return this.getList(this.ERPObjects.TRepServices, options);
  }

  getNewProductListVS1ByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ProductName] f7like "'+dataSearchName+'" OR [BARCODE] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TProductVS1, options);
  }


  getNewInvoiceByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TInvoiceEx, options);
  }

  getNewCalenderByNameOrPayPeriod(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[PayrollCalendarName] f7like "'+dataSearchName+'" OR [PayrollCalendarPayPeriod] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TPayrollCalendars, options);
  }

  getNewHolidayByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[PayrollHolidaysName] f7like "'+dataSearchName+'"'
       };
     return this.getList(this.ERPObjects.TPayrollHolidays, options);
  }

  getPaidLeaveByName(dataSearchName)
  {
    let options = '';
     options = {
     ListType: "Detail",
     select: '[LeavePaidName] f7like "'+dataSearchName+'"'
     };
     return this.getList(this.ERPObjects.TPaidLeave, options);

  }

  getEarningByName(dataSearchName)
  {
    let options = '';
     options = {
     ListType: "Detail",
     select: '[OrdinaryTimeEarningsName] f7like "'+dataSearchName+'"'
     };
     return this.getList(this.ERPObjects.TOrdinaryTimeEarnings, options);
  }

  getSuperannuationByName(dataSearchName) {
    let options = '';
    options = {
     ListType: "Detail",
     select: '[Superfund] f7like "'+dataSearchName+'"'
    };
    return this.getList(this.ERPObjects.TSuperannuation, options);

  }

  getAllowanceByName(dataSearchName) {
    let options = '';
    options = {
     ListType: "Detail",
     select: '[Description] f7like "'+dataSearchName+'" OR [DisplayIn] f7like "'+dataSearchName+'"'
    };
    return this.getList(this.ERPObjects.TAllowance, options);
  }

  getDeductionByName(dataSearchName) {

    let options = '';
     options = {
      ListType: "Detail",
      select: '[Description] f7like "'+dataSearchName+'" OR [Displayin] f7like "'+dataSearchName+'"'
     };
    return this.getList(this.ERPObjects.TDeduction, options);

  }

  getReimbursementByName(dataSearchName) {

    let options = '';
    options = {
     ListType: "Detail",
     select: '[ReimbursementName] f7like "'+dataSearchName+'"'
    };
    return this.getList(this.ERPObjects.TReimbursement, options);

  }
  getNewInvoiceBoByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.BackOrderSalesList, options);
  }



  getNewQuoteByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TQuoteEx, options);
  }


   getNewSalesOrderByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TSalesOrderEx, options);
  }

   getNewPoByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'" AND [Deleted]=false'
       };
    return this.getList(this.ERPObjects.TPurchaseOrderEx, options);
  }


   getNewBillByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[SupplierName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'" AND [Deleted]=false'
       };
    return this.getList(this.ERPObjects.TBillEx, options);
  }

   getNewCreditByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[SupplierName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'" AND [Deleted]=false'
       };
    return this.getList(this.ERPObjects.TCredit, options);
  }

  getNewCustomerPaymentByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[CompanyName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'" AND [Deleted]=false'
       };
    return this.getList(this.ERPObjects.TCustomerPayment, options);
  }


  getNewSupplierPaymentByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[CompanyName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'" AND [Deleted]=false'
       };
    return this.getList(this.ERPObjects.TSupplierPayment, options);
  }

  getNewCustomerByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[Companyname] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }

  getNewEmployeeByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[EmployeeName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TEmployee, options);
  }

  getLeadByName(dataSearchName) {

    let options = '';
    options = {
     ListType: "Detail",
     select: '[EnteredByEmployee] f7like "'+dataSearchName+'"'
    };
    return this.getList(this.ERPObjects.TLeads, options);
  }


   getNewSupplierByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TSupplierVS1, options);
  }

  getAllJobssDataVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
        ListType: "Detail",
        select: '[Active]=true'
       };
    }else{
      options = {
       orderby:'"ClientID desc"',
       ListType: "Detail",
       select: '[Active]=true',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
      };
    }
      return this.getList(this.ERPObjects.TJobVS1, options);
  }

  getAllExpenseCliamExDataVS1() {
    return this.GET(this.erpGet.ERPTExpenseEx);
  }

  getTPaymentList(dateFrom, dateTo, ignoreDate, limitcount, limitfrom){
    let options = '';
    if(ignoreDate == true){
       options = {
          IgnoreDates:true,
          select: '[Deleted]=false',
          OrderBy:"PaymentDate desc",
          LimitCount:'"'+limitcount+'"',
          LimitFrom:'"'+limitfrom+'"'
        };
    }else{
      options = {
         orderby:'"PaymentID desc"',
         ListType: "Detail",
         IgnoreDates: false,
         OrderBy:"PaymentDate desc",
         DateFrom:'"'+dateFrom+'"',
         DateTo:'"'+dateTo+'"',
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TPaymentList, options);
  }

  getTCustomerPaymentList(limitcount, limitfrom){
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"PaymentID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TCustomerPayment, options);
  }

  getAllTCustomerPaymentListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
  let options = '';

  if(ignoreDate == true){
    options = {
      IgnoreDates:true,
      OrderBy:"PaymentDate desc",
      LimitCount:'"'+limitcount+'"',
      LimitFrom:'"'+limitfrom+'"'
       };
     }else{
       options = {
         IgnoreDates:false,
         OrderBy:"PaymentDate desc",
         DateFrom:'"'+dateFrom+'"',
         DateTo:'"'+dateTo+'"',
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TCustomerPaymentList, options);
    }

    getAllTCustomerPaymentListDataByPaymentID(customername) {
    let options = '';

      options = {
        IgnoreDates:true,
        OrderBy:"PaymentDate desc",
        Search:'CompanyName = "'+customername+'"'
         };

        return this.getList(this.ERPObjects.TCustomerPaymentList, options);
    }

  getTSupplierPaymentList(limitcount, limitfrom){
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"PaymentID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TSupplierPayment, options);
  }

  getAllTSupplierPaymentListDataByPaymentID(suppliername) {
  let options = '';

    options = {
      IgnoreDates:true,
      OrderBy:"PaymentDate desc",
      Search:'CompanyName = "'+suppliername+'"'
       };

      return this.getList(this.ERPObjects.TSupplierPaymentList, options);
  }

  getAllTSupplierPaymentListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
  let options = '';

  if(ignoreDate == true){
    options = {
      IgnoreDates:true,
      OrderBy:"PaymentDate desc",
      LimitCount:'"'+limitcount+'"',
      LimitFrom:'"'+limitfrom+'"'
      };
     }else{
       options = {
         IgnoreDates:false,
         OrderBy:"PaymentDate desc",
         DateFrom:'"'+dateFrom+'"',
         DateTo:'"'+dateTo+'"',
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TSupplierPaymentList, options);
    }

  getAllCustomersDataVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
        ListType: "Detail",
        select: '[Active]=true'
       };
    }else{
      options = {
       orderby:'"ClientID desc"',
       ListType: "Detail",
       select: '[Active]=true',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
      };
    }
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }
  getAllCustomersDataVS1ByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }

  checkAllowanceByName(earningName) {
    let options = {
       ListType: "Detail",
        select: "[Description]='" + earningName + "'"
    };
    return this.getList(this.ERPObjects.TAllowance, options);
  }

  getAllContactCombineVS1ByName(dataSearchName) {
    let options = '';
       options = {
        //ListType: "Detail",
        select: '[name] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TERPCombinedContactsVS1, options);
  }

  getAllContactOverviewVS1ByName(dataSearchName) {
    let options = '';
       options = {
        //ListType: "Detail",
        select: '[name] = "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TERPCombinedContactsVS1, options);
  }


  getAllEmployeesDataVS1ByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[EmployeeName] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TEmployee, options);
  }

  getAllAccountDataVS1ByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[AccountName] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TAccountVS1, options);
  }

  getAllSuppliersDataVS1ByName(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        select: '[ClientName] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TSupplierVS1, options);
  }


getCustomersDataByName(dataSearchName) {
    var options = '';
    options = {
      PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country,TermsName,FirstName,LastName,TaxCodeName,ClientTypeName,Discount",
      select: '[ClientName] = "' + dataSearchName + '"'
    };
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }

  getClientVS1() {
      let options = {
          PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country,TermsName,FirstName,LastName,TaxCodeName,ClientTypeName,Discount",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TCustomerVS1, options);
  }

  getAllSuppliersDataVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
        ListType: "Detail",
        select: '[Active]=true'
       };
    }else{
      options = {
       orderby:'"ClientID desc"',
       ListType: "Detail",
       select: '[Active]=true',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
      };
    }
    return this.getList(this.ERPObjects.TSupplierVS1, options);
  }
getAccountListVS1() {
    let options = '';
    //if(limitcount == 'All'){
       options = {
        ListType: "Detail",
        select: '[Active]=true'
       };
    // }else{
    //   options = {
    //    orderby:'"AccountID desc"',
    //    ListType: "Detail",
    //    select: '[Active]=true',
    //    LimitCount:'"'+limitcount+'"',
    //    LimitFrom:'"'+limitfrom+'"'
    //   };
    // }
    return this.getList(this.ERPObjects.TAccountVS1, options);
  }

getRateListVS1() {

  let options = '';

       options = {
        ListType: "Detail",

       };


    return this.getList(this.ERPObjects.TPayRateType, options);
  }

  getSupgetReimbursementerannuation()
  {
    let options = '';
     options = {
     ListType: "Detail",

    };
     return this.getList(this.ERPObjects.Treimbursement, options);

  }

  getRateTypeByName(description) {{

    let options = '';

    options = {
      select: "[Description]='"+description+"'",

    };

    return this.getList(this.ERPObjects.TPayRateType, options);


  }}

getAllContactCombineVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
      options = {
        //IgnoreDates:true,
        select: "[Active]=true",
      };
    }else{
      options = {
         // orderby:'"ClientID desc"',
         // ListType: "Detail",
         select: "[Active]=true",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TERPCombinedContactsVS1, options);
  }


  getClientVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
         PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country,TermsName",
         select: "[Active]=true"
       };
    }else{
      options = {
       orderby:'"ClientID desc"',
       PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country,TermsName",
       select: "[Active]=true",
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
      };
    }
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }
  getAllEmployees(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
        ListType: "Detail",
        select: '[Active]=true'
       };
    }else{
      options = {
       orderby:'"ClientID desc"',
       ListType: "Detail",
       select: '[Active]=true',
       //LimitCount:'"'+limitcount+'"',
       //LimitFrom:'"'+limitfrom+'"'
      };
    }
    return this.getList(this.ERPObjects.TEmployee, options);
  }

  getAllLeads(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
        ListType: "Detail",
       };
    }else{
      options = {
          ListType: "Detail",
      };
    }
    return this.getList(this.ERPObjects.TLeads, options);
  }

  getCheckLeadData(limitcount, limitfrom) {

    let options = '';
    if(limitcount == 'All'){
       options = {
            ListType: "Detail",
            select: '[Active]=true'
       };
    }else{
       options = {
            ListType: "Detail",
            select: '[Active]=true',
      };
    }
    return this.getList(this.ERPObjects.TLeads, options);
  }


  getAllEmployeesDataVS1(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
        ListType: "Detail",
        select: '[Active]=true'
       };
    }else{
      options = {
       orderby:'"ClientID desc"',
       ListType: "Detail",
       select: '[Active]=true',
       //LimitCount:'"'+limitcount+'"',
       //LimitFrom:'"'+limitfrom+'"'
      };
    }
    return this.getList(this.ERPObjects.TEmployee, options);
  }

  getAllInvoiceListNonBO(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
        OrderBy:"SaleID desc",
        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",

      };
    }else{
       options = {
        OrderBy:"SaleID desc",
        PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
      };
    }

    return this.getList(this.ERPObjects.TInvoiceNonBackOrder, options);
  }

  getAllSalesOrderList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          OrderBy:"SaleID desc",
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         OrderBy:"SaleID desc",
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TSalesOrderEx, options);
  }

  getAllTSalesOrderListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
  let options = '';

  if(ignoreDate == true){
    options = {
      IgnoreDates:true,
      OrderBy:"SaleID desc",
      LimitCount:'"'+limitcount+'"',
      LimitFrom:'"'+limitfrom+'"'
      };
     }else{
       options = {
         OrderBy:"SaleID desc",
         IgnoreDates:false,
         DateFrom:'"'+dateFrom+'"',
         DateTo:'"'+dateTo+'"',
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TSalesOrderList, options);
    }

    getAllTSalesOrderListFilterData(filterData, dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
    let options = '';

    if(filterData == 'true'){
      options = {
        IgnoreDates:true,
        OrderBy:"SaleID desc",
        Search:'Converted = '+true+'',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
        };
      }else{
        options = {
          IgnoreDates:true,
          OrderBy:"SaleID desc",
          Search:'Converted != true',
          LimitCount:'"'+limitcount+'"',
          LimitFrom:'"'+limitfrom+'"'
          };
      }
        return this.getList(this.ERPObjects.TSalesOrderList, options);
    }

  getAllPurchaseOrderList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"PurchaseOrderID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TPurchaseOrderEx, options);
  }

  getAllTPurchaseOrderListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
  let options = '';

  if(ignoreDate == true){
    options = {
      IgnoreDates:true,
      OrderBy:"PurchaseOrderID desc",
      IncludeBO:false,
      IncludeShipped:true,
      IncludeLines:false,
      LimitCount:'"'+limitcount+'"',
      LimitFrom:'"'+limitfrom+'"'
      };
     }else{
       options = {
         OrderBy:"PurchaseOrderID desc",
         IgnoreDates:false,
         IncludeBO:false,
         IncludeShipped:true,
         IncludeLines:false,
         DateFrom:'"'+dateFrom+'"',
         DateTo:'"'+dateTo+'"',
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TPurchaseOrderList, options);
    }

  getAllChequeList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
        orderby:'"PurchaseOrderID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }

    return this.getList(this.ERPObjects.TChequeEx, options);
  }

  getAllChequeListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
    let options = '';

    if(ignoreDate == true){
      options = {
        IgnoreDates:true,
        OrderBy:"PurchaseOrderID desc",
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
   }else{
     options = {
       IgnoreDates:false,
       OrderBy:"PurchaseOrderID desc",
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
   };
  }
    return this.getList(this.ERPObjects.TChequeList, options);
  }

  getAllPurchaseOrderListAll(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
    let options = '';

    if(ignoreDate == true){
      options = {
        IgnoreDates:true,
        IncludePOs:true,
        IncludeBills:true,
        OrderBy:"PurchaseOrderID desc",
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
   }else{
     options = {
       IgnoreDates:false,
       IncludePOs:true,
       IncludeBills:true,
       OrderBy:"PurchaseOrderID desc",
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
   };
  }
    return this.getList(this.ERPObjects.TbillReport, options);
  }

  getAllAwaitingSupplierPayment(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
    let options = '';
    if(ignoreDate == true){
      options = {
        IgnoreDates:true,
        IncludePOs:true,
        IncludeBills:true,
        Paid:false,
        Unpaid:true,
        OrderBy:"PurchaseOrderID desc",
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
   }else{
     options = {
       IgnoreDates:false,
       IncludePOs:true,
       IncludeBills:true,
       Paid:false,
       Unpaid:true,
       OrderBy:"PurchaseOrderID desc",
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
   };
  }
    return this.getList(this.ERPObjects.TbillReport, options);
  }

  getAllAwaitingSupplierPaymentBySupplierName(supplierName) {
    let options = '';
      options = {
        IgnoreDates:true,
        IncludePOs:true,
        IncludeBills:true,
        Paid:false,
        Unpaid:true,
        OrderBy:"PurchaseOrderID desc",
         Search:'PrintName = "'+supplierName+'"'
     };
    return this.getList(this.ERPObjects.TbillReport, options);
  }

 getAllAwaitingCustomerPaymentByCustomerName(customerName) {
    let options = '';
      options = {
        IgnoreDates:true,
        IncludeIsInvoice:true,
        IncludeIsQuote:false,
        IncludeIsRefund:false,
        IncludeISSalesOrder:false,
        Paid:false,
        Unpaid:true,
        OrderBy:"SaleID desc",
        Search:'CustomerName = "'+customerName+'"'
     };
    return this.getList(this.ERPObjects.TSalesList, options);
  }
  getAllOverDueAwaitingSupplierPayment(currentDate, limitcount, limitfrom) {
    let options = '';
    if(currentDate == "PO"){
      options = {
        IgnoreDates:true,
        IncludePOs:true,
        IncludeBills:false,
        IncludeCredits:false,
        Paid:false,
        Unpaid:true,
        OrderBy:"PurchaseOrderID desc",
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
   }else if(currentDate == "Bill"){
       options = {
         IgnoreDates:true,
         IncludePOs:false,
         IncludeBills:true,
         IncludeCredits:false,
         Paid:false,
         Unpaid:true,
         OrderBy:"PurchaseOrderID desc",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
      };
     }else{
      options = {
        IgnoreDates:true,
        IncludePOs:true,
        IncludeBills:true,
        Paid:false,
        Unpaid:true,
        OrderBy:"PurchaseOrderID desc",
        Search:'DueDate < "'+currentDate+'"',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
   }
    return this.getList(this.ERPObjects.TbillReport, options);
  }

  getAllAwaitingCustomerPayment(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
    let options = '';
    if(ignoreDate == true){
      options = {
        IgnoreDates:true,
        IncludeIsInvoice:true,
        IncludeIsQuote:false,
        IncludeIsRefund:true,
        IncludeISSalesOrder:false,
        Paid:false,
        Unpaid:true,
        OrderBy:"SaleID desc",
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
   }else{
     options = {
       IgnoreDates:false,
       IncludeIsInvoice:true,
       IncludeIsQuote:false,
       IncludeIsRefund:true,
       IncludeISSalesOrder:false,
       Paid:false,
       Unpaid:true,
       OrderBy:"SaleID desc",
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
   };
  }
    return this.getList(this.ERPObjects.TSalesList, options);
  }

  getAllOverDueAwaitingCustomerPayment(currentDate, limitcount, limitfrom) {
    let options = '';
    //if(ignoreDate == true){
      options = {
        IgnoreDates:true,
        IncludeIsCashSale:false,
        IncludeIsCustomerReturn:false,
        IncludeIsInvoice:true,
        IncludeIslayby:false,
        IncludeIsLaybyPayment:false,
        IncludeIsPOS:false,
        IncludeIsQuote:false,
        IncludeIsRefund:false,
        IncludeISSalesOrder:false,
        IncludeIsVoucher:false,
        Paid:false,
        Unpaid:true,
        OrderBy:"SaleID desc",
        Search:'dueDate < "'+currentDate+'"',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
   //}
    return this.getList(this.ERPObjects.TSalesList, options);
  }

  getAllBillExList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false and [Cancelled]=false'
        };
    }else{
      options = {
         orderby:'"PurchaseOrderID desc"',
         ListType: "Detail",
         select: "[Deleted]=false and [Cancelled]=false",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }

    return this.getList(this.ERPObjects.TBillEx, options);
  }

  getAllBillListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
  let options = '';

  if(ignoreDate == true){
    options = {
      IgnoreDates:true,
      IsBill: true,
      OrderBy:"PurchaseOrderID desc",
      Search:"IsBill = true",
      LimitCount:'"'+limitcount+'"',
      LimitFrom:'"'+limitfrom+'"'
      };
     }else{
       options = {
         oOrderBy:"PurchaseOrderID desc",
         IsBill: true,
         Search:"IsBill = true",
         IgnoreDates:false,
         DateFrom:'"'+dateFrom+'"',
         DateTo:'"'+dateTo+'"',
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TBillList, options);
    }

  getAllQuoteList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          OrderBy:"SaleID desc",
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         OrderBy:"SaleID desc",
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TQuoteEx, options);
  }

  getAllTQuoteListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
  let options = '';

  if(ignoreDate == true){
    options = {
      IgnoreDates:true,
      OrderBy:"SaleID desc",
      LimitCount:'"'+limitcount+'"',
      LimitFrom:'"'+limitfrom+'"'
      };
     }else{
       options = {
         OrderBy:"SaleID desc",
         IgnoreDates:false,
         DateFrom:'"'+dateFrom+'"',
         DateTo:'"'+dateTo+'"',
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TQuoteList, options);
    }

    getAllTQuoteListFilterData(filterData, dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
    let options = '';

    if(filterData == 'true'){
      options = {
        IgnoreDates:true,
        OrderBy:"SaleID desc",
        Search:'Converted = '+true+'',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
        };
      }else{
        options = {
          IgnoreDates:true,
          OrderBy:"SaleID desc",
          Search:'Converted != true',
          LimitCount:'"'+limitcount+'"',
          LimitFrom:'"'+limitfrom+'"'
          };
      }
      //  }else{
      //    options = {
      //      OrderBy:"SaleID desc",
      //      IgnoreDates:false,
      //      Search:'Converted = '+filterData+'',
      //      DateFrom:'"'+dateFrom+'"',
      //      DateTo:'"'+dateTo+'"',
      //      LimitCount:'"'+limitcount+'"',
      //      LimitFrom:'"'+limitfrom+'"'
      //  };
      // }
        return this.getList(this.ERPObjects.TQuoteList, options);
    }


  getAllCreditList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"PurchaseOrderID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TCredit, options);
  }

  getTCreditListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {

    let options = '';
    if(ignoreDate == true){
      options = {
         OrderBy:"PurchaseOrderID desc",
         IgnoreDates:true,
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
   }else{
     options = {
        OrderBy:"PurchaseOrderID desc",
        IgnoreDates:false,
        DateFrom:'"'+dateFrom+'"',
        DateTo:'"'+dateTo+'"',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
    };
   }

  return this.getList(this.ERPObjects.TCreditList, options);
  }

  getTAppointmentListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {

    let options = '';
    if(ignoreDate == true){
      options = {
         OrderBy:"CreationDate desc",
         IgnoreDates:true,
         IsDetailReport:false,
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
   }else{
     options = {
        OrderBy:"CreationDate desc",
        IgnoreDates:false,
        IsDetailReport:false,
        DateFrom:'"'+dateFrom+'"',
        DateTo:'"'+dateTo+'"',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
    };
   }

  return this.getList(this.ERPObjects.TAppointmentList, options);
  }

  getTJournalEntryListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {

    let options = '';
    if(ignoreDate == true){
      options = {
         OrderBy:"TransactionDate desc",
         IgnoreDates:true,
         IsDetailReport:true,
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
   }else{
     options = {
        OrderBy:"TransactionDate desc",
        IgnoreDates:false,
        DateFrom:'"'+dateFrom+'"',
        DateTo:'"'+dateTo+'"',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
    };
   }

  return this.getList(this.ERPObjects.TJournalEntryList, options);
  }

  getSalesListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {

    let options = '';
    if(ignoreDate == true){
      options = {
         OrderBy:"SaleID desc",
         IgnoreDates:true,
         IncludeIsInvoice:true,
         IncludeIsQuote:true,
         IncludeIsRefund:true,
         IncludeISSalesOrder:true,
         IsDetailReport:false,
         Paid:true,
         Unpaid:true,
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
   }else{
     options = {
        OrderBy:"SaleID desc",
        IgnoreDates:false,
        DateFrom:'"'+dateFrom+'"',
        DateTo:'"'+dateTo+'"',
        IsDetailReport:false,
        IncludeIsInvoice:true,
        IncludeIsQuote:true,
        IncludeIsRefund:true,
        IncludeISSalesOrder:true,
        Paid:true,
        Unpaid:true,
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
    };
   }

  return this.getList(this.ERPObjects.TSalesList, options);
  }

  getAllJournalEnrtryLinesList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
     options = {
      ListType: "Detail",
      select: "[Deleted]=false",
    };
    }else{
      options = {
         orderby:'"GJID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TJournalEntry, options);
  }

  getAllStockAdjustEntry(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"StockAdjustEntryID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TStockAdjustEntry, options);
  }

  getAllStockTransferEntry(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"TransferEntryID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TStockTransferEntry, options);
  }

  getAllInvoiceList(limitcount, limitfrom) {
    let options = '';
 if(limitcount == 'All'){
    options = {
       OrderBy:"SaleID desc",
       ListType: "Detail",
       select: '[Deleted]=false'
     };
 }else{
   options = {
      OrderBy:"SaleID desc",
      ListType: "Detail",
      select: "[Deleted]=false",
      LimitCount:'"'+limitcount+'"',
     LimitFrom:'"'+limitfrom+'"'
  };
 }
    return this.getList(this.ERPObjects.TInvoiceEx, options);
  }

  getAllTInvoiceListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
  let options = '';

  if(ignoreDate == true){
    options = {
      IgnoreDates:true,
      OrderBy:"SaleID desc",
      IncludeBo:false,
      IncludeShipped:true,
      IncludeLines:false,
      LimitCount:'"'+limitcount+'"',
      LimitFrom:'"'+limitfrom+'"'
      };
     }else{
       options = {
         OrderBy:"SaleID desc",
         IgnoreDates:false,
         IncludeBo:false,
         IncludeShipped:true,
         IncludeLines:false,
         DateFrom:'"'+dateFrom+'"',
         DateTo:'"'+dateTo+'"',
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
      return this.getList(this.ERPObjects.TInvoiceList, options);
    }
  // Rasheed Speed Here
  getNewProductListVS1Update(msTimeStamp) {
    let options = {
        ListType: "Detail",
        select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
      };
    return this.getList(this.ERPObjects.TProductVS1, options);
  }



  getTARReport(dateFrom, dateTo, ignoreDate){
    let options = '';
    if(ignoreDate == true){
      options = {
        IgnoreDates: true,
        select: "[deleted]=false"
     };
    }else{
     options = {
       IgnoreDates: false,
       select: "[deleted]=false",
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+initialReportLoad+'"'
    };
    }
      return this.getList(this.ERPObjects.TARReport, options);
  }

  getTAPReport(dateFrom, dateTo, ignoreDate){
    let options = '';
    if(ignoreDate == true){
      options = {
        IgnoreDates: true,
        select: "[deleted]=false"
     };
    }else{
     options = {
       IgnoreDates: false,
       select: "[deleted]=false",
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+initialReportLoad+'"'
    };
    }
      return this.getList(this.ERPObjects.TAPReport, options);
  }

 getTAPReportByName(contactName){
    let options = '';
      options = {
        IgnoreDates: true,
        Search:'Name = "'+contactName+'"'
     };

      return this.getList(this.ERPObjects.TAPReport, options);
  }
  getTTransactionListReport(msTimeStamp){
    let options = '';
    if(msTimeStamp){
      options = {
         IgnoreDates: true,
         Listtype: 1,
         FilterIndex: 2,
         LimitCount:'"'+initialReportLoad+'"'
       };
    }else{
      options = {
         IgnoreDates: true,
         Listtype: 1,
         FilterIndex: 2,
         LimitCount:'"'+initialReportLoad+'"'
     };
    }
      return this.getList(this.ERPObjects.TTransactionListReport, options);
  }

  getAllAppointmentList(limitcount, limitfrom){
    let options = '';
    let checkOwnAppointment = Session.get('CloudAppointmentSeeOwnAppointmentsOnly');
    let selectedEmployeeName = Session.get('mySessionEmployee');

    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Active]=true'
        };
    }else{
      options = {
        orderby:'"AppointID desc"',
        ListType: "Detail",
        select: '[Active]=true',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }

      return this.getList(this.ERPObjects.TAppointment, options);
  }

  getAllAppointmentPredList(data){
      let options = {
          PropertyList: "ID,EmployeeID,ShowApptDurationin,ShowSaturdayinApptCalendar,ShowSundayinApptCalendar,ApptStartTime,ApptEndtime,DefaultApptDuration,DefaultServiceProductID,DefaultServiceProduct"
       }
      return this.getList(this.ERPObjects.TAppointmentPreferences, options);
  }



  getAllCustomersDataVS1Update(msTimeStamp) {
    let options = {
      ListType: "Detail",
      select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
    };
    return this.getList(this.ERPObjects.TCustomerVS1, options);
  }


  getAllSuppliersDataVS1Update(msTimeStamp) {
    let options = {
      ListType: "Detail",
      select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
    };
    return this.getList(this.ERPObjects.TSupplierVS1, options);
  }



  getAccountListVS1Update(msTimeStamp) {
    let options = {
        ListType: "Detail",
        select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
      };
    return this.getList(this.ERPObjects.TAccountVS1, options);
  }

  getTaxRateVS1() {
    let options = {
      PropertyList: "ID,CodeName,Description,LocationCategoryDesc,Rate,RegionName,Active",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TTaxcodeVS1, options);
  }

  getTaxRateVS1ByName(dataSearchName) {
    let options = '';
       options = {
        PropertyList: "ID,CodeName,Description,LocationCategoryDesc,Rate,RegionName,Active",
        select: '[CodeName] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TTaxcodeVS1, options);
  }

  getShippingMethodByName(dataSearchName) {
    let options = '';
       options = {
        PropertyList: "ID,ShippingMethod",
        select: '[ShippingMethod] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TShippingMethod, options);
  }

  getDepartment() {
    let options = {
      PropertyList: "ID,GlobalRef,KeyValue,DeptClassGroup,DeptClassName,Description,SiteCode,Active",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TDeptClass, options);
  }

  getTermsVS1() {
    let options = {
      PropertyList: "ID,Days,IsEOM,IsEOMPlus,TermsName,Description,IsDays,Active,isPurchasedefault,isSalesdefault",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TTermsVS1, options);
  }

  getAllowance(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Active]=true'
        };
    }else{
      options = {
        ListType: "Detail",
        select: '[Active]=true',

     };
    };
    return this.getList(this.ERPObjects.TAllowance, options);
  }


  getReimbursement(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: "[ReimbursementActive]=true"

        };
    }else{
      options = {
        ListType: "Detail",
        select: "[ReimbursementActive]=true"
     };
    };
    return this.getList(this.ERPObjects.TReimbursement, options);
  }

  getordinaryEarningByName(limitcount, limitfrom){
    let options = '';
    if(limitcount == 'All'){
       options = {
            ListType: "Detail",
        };
    }else{
       options = {
                ListType: "Detail",
       };
    };
    return this.getList(this.ERPObjects.TOrdinaryTimeEarnings, options);
  }


  getDeduction(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Active]=true'
        };
    }else{
      options = {
        ListType: "Detail",
        select: '[Active]=true',
        // LimitCount:'"'+limitcount+'"',
        // LimitFrom:'"'+limitfrom+'"'
     };
    };
    return this.getList(this.ERPObjects.TDeduction, options);
  }

  getAllEmployeePaySettings(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail"
          //select: '[Active]=true'
        };
    }else{
      options = {
        ListType: "Detail",
        //select: '[Active]=true',
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    };
    return this.getList(this.ERPObjects.TEmployeepaysettings, options);
  }

  getAllLeadStatus() {
    let options = {
      PropertyList: "ID,TypeName",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TLeadStatusType, options);
  }

  getShippingMethodData() {
    let options = {
      PropertyList: "ID,ShippingMethod",
      select: "[Active]=true"
    };
    return this.getList(this.ERPObjects.TShippingMethod, options);
  }

  getCurrencies() {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd+'/'+mm+'/'+ yyyy;
    let msTimeStamp = yyyy+'-'+mm+'-'+dd+' 00:00:00';
    let options = {
      PropertyList: "ID, Code, CurrencyDesc, Currency, BuyRate, SellRate,Active, CurrencySymbol,Country,RateLastModified",
      select: "[Active]=true AND [MsTimeStamp]>'"+msTimeStamp+"'",
      ListType: "Detail"
    };
    return this.getList(this.ERPObjects.TCurrency, options);
  }

  getAccountTypesToAddNew() {
    let options = {
      PropertyList: "AccountTypeName,Description,OriginalDescription",
    };
    return this.getList(this.ERPObjects.TAccountType, options);
  }



  getAllEmployeesUpdate(msTimeStamp) {
    let options = {
        ListType: "Detail",
        select: '[Active]=true and [MsTimeStamp]>"'+msTimeStamp+'"'
    };
    return this.getList(this.ERPObjects.TEmployee, options);
  }



  getAccountTypes() {
    let options = {
      PropertyList: "ID,AccountName,AccountTypeName,TaxCode,AccountNumber,Description",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TAccount, options);
  }




  getAllJournalEnrtryLinesListUpdate() {
    let options = {
      ListType: "Detail",
      select: "[Deleted]=false",
    };
    return this.getList(this.ERPObjects.TJournalEntry, options);
  }

  getAllTVS1BankDepositData(limitcount, limitfrom) {
    let options = '';
  if(limitcount == 'All'){
     options = {
        ListType: "Detail",
        select: '[Deleted]=false'
      };
  }else{
    options = {
       orderby:'"DepositID desc"',
       ListType: "Detail",
       select: "[Deleted]=false",
       // LimitCount:'"'+initialReportLoad+'"'
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
   };
  }
    return this.getList(this.ERPObjects.TVS1BankDeposit, options);
  }

  getAllTBankDepositListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
    let options = '';
    if(ignoreDate == true){
      options = {
        IgnoreDates: true,
        select: "[deleted]=false",
        OrderBy:"DepositDate desc",
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }else{
     options = {
       //IgnoreDates: true,
       OrderBy:"DepositDate desc",
       select: "[deleted]=false",
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
    };
    }
    return this.getList(this.ERPObjects.TBankDepositList, options);
  }

  getAllBankAccountDetails(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
    let options = '';
    if(ignoreDate == true){
      options = {
        IgnoreDates: true,
        select: "[deleted]=false",
        OrderBy:"Date desc",
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }else{
     options = {
       IgnoreDates: false,
       select: "[deleted]=false",
       OrderBy:"Date desc",
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
    };
    }
    return this.getList(this.ERPObjects.TBankAccountReport, options);
  }



  getAllInvoiceListUpdate(msTimeStamp) {
    let options = {
      OrderBy:"SaleID desc",
      ListType: "Detail",
      select: '[Deleted]=false and [MsTimeStamp]>"'+msTimeStamp+'"',
      //LimitCount:'"50"'
    };
    return this.getList(this.ERPObjects.TInvoiceEx, options);
  }

  getAllBOInvoiceList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
     options = {
      FilterString: "SaleType='Invoice'",
      select: "[Deleted]=false",
    };
  }else{
    options = {
     OrderBy:"SaleID desc",
     FilterString: "SaleType='Invoice'",
     select: "[Deleted]=false",
     LimitCount:'"'+limitcount+'"',
     LimitFrom:'"'+limitfrom+'"'
   };
  }
    return this.getList(this.ERPObjects.BackOrderSalesList, options);
  }

  // getAllBackOrderInvoiceList(limitcount, limitfrom) {
  //   let options = '';
  //   if(limitcount == 'All'){
  //    options = {
  //      OrderBy:"SaleID desc",
  //      PropertyList: "Id,ClientName,EmployeeName,SaleClassName,SaleDate",
  //   };
  // }else{
  //   options = {
  //     OrderBy:"SaleID desc",
  //     PropertyList: "Id,ClientName,EmployeeName,SaleClassName,SaleDate",
  //    //  select: "[Deleted]=false",
  //    // //  LimitCount:'"'+limitcount+'"',
  //    // // LimitFrom:'"'+limitfrom+'"'
  //  };
  // }
  //   return this.getList(this.ERPObjects.TInvoiceBackOrder, options);
  // }

  getAllBackOrderInvoiceList(limitcount, limitfrom) {
    let options = '';
     if(limitcount == 'All'){
        options = {
           OrderBy:"SaleID desc",
           ListType: "Detail",
           // select: '[Deleted]=false'
         };
     }else{
       options = {
          OrderBy:"SaleID desc",
          ListType: "Detail",
          // select: '[Deleted]=false',
          LimitCount:'"'+limitcount+'"',
          LimitFrom:'"'+limitfrom+'"'
      };
     }
    return this.getList(this.ERPObjects.TInvoiceBackOrder, options);
}

getAllTSalesBackOrderReportData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
  let options = '';

  if(ignoreDate == true){
    options = {
      IgnoreDates:true,
      OrderBy:"SaleID desc",
      IncludeBo:true,
      IncludeShipped:false,
      IncludeLines:true,
      LimitCount:'"'+limitcount+'"',
      LimitFrom:'"'+limitfrom+'"'
   };
 }else{
   options = {
     OrderBy:"SaleID desc",
     IgnoreDates:false,
     IncludeBo:true,
     IncludeShipped:false,
     IncludeLines:true,
     DateFrom:'"'+dateFrom+'"',
     DateTo:'"'+dateTo+'"',
     LimitCount:'"'+limitcount+'"',
     LimitFrom:'"'+limitfrom+'"'
 };
}
  return this.getList(this.ERPObjects.TInvoiceList, options);
}

  getAllPurchaseOrderListNonBo() {
    let options = {

      PropertyList: "ID,EmployeeName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",
    };
    return this.getList(this.ERPObjects.TpurchaseOrderNonBackOrder, options);
  }



  getAllPurchaseOrderListBO(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
     options = {
      PropertyList: "ID,EmployeeName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",
      select: '[Deleted]=false'
    };
    }else{
      options = {
        orderby:'"PurchaseOrderID desc"',
       PropertyList: "ID,EmployeeName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",
       select: '[Deleted]=false',
       LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TpurchaseOrderBackOrder, options);
  }

  getAllTPurchasesBackOrderReportData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
    let options = '';

    if(ignoreDate == true){
      options = {
        IgnoreDates:true,
        OrderBy:"PurchaseOrderID desc",
        IncludeBo:true,
        IncludeShipped:false,
        IncludeLines:true,
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
   }else{
     options = {
       OrderBy:"PurchaseOrderID desc",
       IgnoreDates:false,
       IncludeBo:true,
       IncludeShipped:false,
       IncludeLines:true,
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
   };
  }
    return this.getList(this.ERPObjects.TPurchaseOrderList, options);
  }

  getAllReconcilationList(limitcount, limitfrom) {
    let options = '';
    if(limitcount == 'All'){
       options = {
          ListType: "Detail",
          select: '[Deleted]=false'
        };
    }else{
      options = {
         orderby:'"ReconciliationID desc"',
         ListType: "Detail",
         select: "[Deleted]=false",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
     };
    }
    return this.getList(this.ERPObjects.TReconciliation, options);
  }

  getAllTReconcilationListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
    let options = '';

    if(ignoreDate == true){
      options = {
        IgnoreDates:true,
        OrderBy:"ReconciliationID desc",
        LimitCount:'"'+limitcount+'"',
        LimitFrom:'"'+limitfrom+'"'
     };
   }else{
     options = {
       IgnoreDates:false,
       OrderBy:"ReconciliationID desc",
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
   };
  }
    return this.getList(this.ERPObjects.TReconciliationList, options);
  }



  getProductStocknSaleReportData(dateFrom, dateTo) {
   let options = {
      IgnoreDates:false,
      DateFrom: '"'+dateFrom+'"',
      DateTo: '"'+dateTo+'"',
      LimitCount:'"'+initialReportLoad+'"'
  };

  return this.getList(this.ERPObjects.TProductStocknSalePeriodReport, options);
  }

  getCurrentLoggedUser() {
      let options = {
          PropertyList: "ID,DatabaseName,UserName,MultiLogon,EmployeeID,FirstName,LastName,LastTime",

      };
      return this.getList(this.ERPObjects.TAppUser, options);
  }

  getAllBillList() {
    let options = {
      PropertyList: "ID,EmployeeName,AccountName,SaleClassName,OrderDate,SupplierName,TotalAmount,OrderStatus,ShipDate,SalesDescription,CustPONumber,TermsName,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments",
      select: "[Deleted]=false and [Cancelled]=false",
    };
    return this.getList(this.ERPObjects.TBill, options);
  }

  getAllSalesOrderListNonBO() {
    let options = {

      PropertyList: "ID,EmployeeName,SaleClassName,SaleDate,CustomerName,TotalAmount,SalesStatus,ShipDate,SalesDescription,CustPONumber,TermsName,SaleCustField1,SaleCustField2,TotalTax,TotalAmountInc,TotalPaid,TotalBalance,Comments,Deleted",

    };
    return this.getList(this.ERPObjects.TsalesOrderNonBackOrder, options);
  }

  getCountry() {
      return this.GET(this.erpGet.ERPCountries);
  }

  getPaymentMethodDataVS1() {
      let options = {
          ListType: "Detail",
      };
      return this.getList(this.ERPObjects.TPaymentMethodVS1, options);
  }

  getPaymentMethodVS1() {
      let options = {
          PropertyList: "ID,IsCreditCard,PaymentMethodName,Active",
          select: "[Active]=true",
      };
      return this.getList(this.ERPObjects.TPaymentMethodVS1, options);
  }

  getPaymentMethodVS1ByName(dataSearchName) {
    let options = '';
       options = {
        PropertyList: "ID,IsCreditCard,PaymentMethodName,Active",
        select: '[PaymentMethodName] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TPaymentMethodVS1, options);
  }

  getClientTypeDataByName(dataSearchName) {
    let options = '';
       options = {
        PropertyList: "ID,TypeDescription,TypeName,Active",
        select: '[TypeName] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TClientType, options);
  }

  getClientTypeData() {
      let options = {
          ListType: "Detail",
      };
      return this.getList(this.ERPObjects.TClientType, options);
  }

  getAllCustomerStatementData(dateFrom, dateTo, ignoreDate) {
    let options = '';
    if(ignoreDate == true){
      options = {
        IgnoreDates: true
     };
    }else{
     options = {
       IgnoreDates: false,
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+initialReportLoad+'"'
    };
    }
    return this.getList(this.ERPObjects.TStatementList, options);
    //return this.getList(this.ERPObjects.TStatementList);
  }

  getGlobalSettings(){
        let options = {
           PropertyList: "PrefName,Fieldvalue",
           select: '[PrefName]="DefaultServiceProduct" or [PrefName]="DefaultServiceProductID" or [PrefName]="DefaultApptDuration" or [PrefName]="ApptStartTime" or [PrefName]="ApptEndtime" or [PrefName]="ShowSaturdayinApptCalendar" or [PrefName]="ShowSundayinApptCalendar" or [PrefName]="ShowApptDurationin" or [PrefName]="RoundApptDurationTo" or [PrefName]="MinimumChargeAppointmentTime"'
        }
       return this.getList(this.ERPObjects.TERPPreference,options);
   }


   getGlobalSettingsExtra(){
        let options = {
           PropertyList: "ID,Prefname,fieldValue",
        }
    return this.getList(this.ERPObjects.TERPPreferenceExtra,options);
   }

   getGlobalSearchReport(searchName, limitcount, limitfrom){
       let options = {
         SearchName: "'"+searchName+"'",
         QuerySearchMode: "'smSearchEngineLike'",
         LimitCount:'"'+limitcount+'"',
         LimitFrom:'"'+limitfrom+'"'
       };
       return this.getList(this.ERPObjects.TGlobalSearchReport, options);
   }

   getOneSupplierDataExByName(dataSearchName) {
     let options = '';
        options = {
         ListType: "Detail",
         select: '[ClientName]="'+dataSearchName+'"'
        };
     return this.getList(this.ERPObjects.TSupplier, options);
   }

   getOneCustomerDataExByName(dataSearchName) {
     let options = '';
        options = {
         ListType: "Detail",
         select: '[ClientName]="'+dataSearchName+'"'
        };
     return this.getList(this.ERPObjects.TCustomer, options);
   }

   getOneProductdatavs1byname(dataSearchName) {
     let options = '';
        options = {
         ListType: "Detail",
         select: '[ProductName]="'+dataSearchName+'"'
        };
     return this.getList(this.ERPObjects.TProduct, options);
   }

   getAllTimeSheetList(){
    let options = {
           ListType: "Detail",
           select: "[Active]=true",
           //LimitCount:'"'+initialDataLoad+'"',
     }
        return this.getList(this.ERPObjects.TTimeSheet, options);
    }


    getNewChequeByNameOrID(dataSearchName) {
    let options = '';
       options = {
        ListType: "Detail",
        //select: '[ID] f7like "'+dataSearchName+'"'
        select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'" OR [GLAccountName] f7like "'+dataSearchName+'" OR [SupplierInvoiceNumber] f7like "'+dataSearchName+'"'
       };
    return this.getList(this.ERPObjects.TChequeEx, options);
  }

  getAllRefundList(limitcount, limitfrom) {
    let options = '';
 if(limitcount == 'All'){
    options = {
       OrderBy:"SaleID desc",
       ListType: "Detail",
       select: '[Deleted]=false'
     };
 }else{
   options = {
      OrderBy:"SaleID desc",
      ListType: "Detail",
      select: "[Deleted]=false",
      LimitCount:'"'+limitcount+'"',
     LimitFrom:'"'+limitfrom+'"'
  };
 }
  return this.getList(this.ERPObjects.TRefundSale, options);
}

getAllTRefundSaleListData(dateFrom, dateTo, ignoreDate, limitcount, limitfrom) {
let options = '';

if(ignoreDate == true){
  options = {
    IgnoreDates:true,
    OrderBy:"SaleID desc",
    LimitCount:'"'+limitcount+'"',
    LimitFrom:'"'+limitfrom+'"'
    };
   }else{
     options = {
       OrderBy:"SaleID desc",
       IgnoreDates:false,
       DateFrom:'"'+dateFrom+'"',
       DateTo:'"'+dateTo+'"',
       LimitCount:'"'+limitcount+'"',
       LimitFrom:'"'+limitfrom+'"'
   };
  }
    return this.getList(this.ERPObjects.TRefundSaleList, options);
  }

getNewRefundByNameOrID(dataSearchName) {
  let options = '';
     options = {
      ListType: "Detail",
      select: '[ClientName] f7like "'+dataSearchName+'" OR [ID] f7like "'+dataSearchName+'"'
      //select: '[ClientName] f7like "'+dataSearchName+'"'
     };
  return this.getList(this.ERPObjects.TRefundSale, options);
}

getCloudTERPForm() {
    let options = {
        PropertyList: "Description,TabGroupName,SkinsGroup",
        select: "[TabGroup]=26 and [AccessLevels]=true"
    };
    return this.getList(this.ERPObjects.TERPForm, options);
}

getEmpFormAccessDetail() {
    let options = {
        ListType: "Detail",
        select: "[TabGroup]=26 and [EmployeeId]='"+Session.get('mySessionEmployeeLoggedID')+"'",
    };
    return this.getList(this.ERPObjects.TEmployeeFormAccessDetail, options);
}

getAllPayRunDataVS1(limitcount, limitfrom) {
  let options = '';
  if(limitcount == 'All'){
     options = {
      ListType: "Detail"
     };
  }else{
    options = {
     // orderby:'"ClientID desc"',
     ListType: "Detail",
     LimitCount:'"'+limitcount+'"',
     LimitFrom:'"'+limitfrom+'"'
    };
  }
    return this.getList(this.ERPObjects.TPayRun, options);
}

getAllPayHistoryDataVS1(limitcount, limitfrom) {
  let options = '';
  if(limitcount == 'All'){
     options = {
      ListType: "Detail"
     };
  }else{
    options = {
     // orderby:'"ClientID desc"',
     ListType: "Detail",
     LimitCount:'"'+limitcount+'"',
     LimitFrom:'"'+limitfrom+'"'
    };
  }
    return this.getList(this.ERPObjects.TPayHistory, options);
}

getCalender(limitcount, limitfrom) {
  let options = '';
  if(limitcount == 'All'){
     options = {
      ListType: "Detail",
      select: "[PayrollCalendarActive]=true"

     };
  }else{
    options = {
     // orderby:'"ClientID desc"',
     ListType: "Detail",
     LimitCount:'"'+limitcount+'"',
     LimitFrom:'"'+limitfrom+'"',
     select: "[PayrollCalendarActive]=true"
    };
  }
    return this.getList(this.ERPObjects.TPayrollCalendars, options);
}

getSuperannuation(limitcount, limitfrom) {
  let options = '';
  if(limitcount == 'All'){
    options = {
      ListType: "Detail",
      select: "[Allclasses]=false"
     };
  }
  else{
    options = {
      ListType: "Detail",
      select: "[Allclasses]=false"
     };
  }

   return this.getList(this.ERPObjects.TSuperannuation, options);
}


getSuperType()
{

  let options = '';

   options = {
      ListType: "Detail",
      // select: '[Active]=true'
  };

  return this.getList(this.ERPObjects.TSuperType, options);

}

getOneFundTypeByName(dataSearchName){
  let options = {
    ListType:"Detail",
    select: '[Description]="'+dataSearchName+'"'
  };
  return this.getList(this.ERPObjects.TSuperType, options);
}

getPaidLeave(limitcount, limitfrom) {
  let options = '';
  if(limitcount == 'All'){
     options = {
      ListType: "Detail",
      select: '[LeavePaidActive]=true'
     };
  }else{
    options = {
     // orderby:'"ClientID desc"',
       ListType: "Detail",
       select: '[LeavePaidActive]=true'

    };
  }
     return this.getList(this.ERPObjects.TPaidLeave, options);
 }

 getUnPaidLeave(limitcount, limitfrom) {

  let options = '';
  if(limitcount == 'All'){
     options = {
      ListType: "Detail",
      select: '[LeaveUnpaidActive]=true'
     };
  }else{
    options = {
     // orderby:'"ClientID desc"',
       ListType: "Detail",
       select: '[LeaveUnpaidActive]=true'

    };
  }
  return this.getList(this.ERPObjects.TUnpaidLeave, options);

}

getTvs1dashboardpreferences() {
 let options = '';
   options = {
    ListType: "Detail",
    select: "[EmployeeID]='"+Session.get('mySessionEmployeeLoggedID')+"'",
   };
   return this.getList(this.ERPObjects.Tvs1dashboardpreferences, options);
}

getTvs1charts() {
 let options = '';
   options = {
    ListType: "Detail"
   };
   return this.getList(this.ERPObjects.Tvs1charts, options);
}


}
