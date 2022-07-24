import { BaseService } from "../js/base-service.js";

export class ReportService extends BaseService {
  getBalanceSheetReport(dateAsOf) {
    let options = {
      //select: "[Active]=true",
      //ListType:"Detail",
      DateTo: '"' + dateAsOf + '"',
    };
    return this.getList(this.ERPObjects.BalanceSheetReport, options);
  }

  getProfitLossReport() {
    let options = {
      select: "[Active]=true",
      ListType: "Detail",
      //DateTo:dateAsOf
    };
    return this.getList(this.ERPObjects.ProfitLossReport, options);
  }
  getBalanceSheet() {
    let options = {
      select: "[Active]=true",
      ListType: "Detail",
    };
    return this.getList(this.ERPObjects.BalanceSheetReport, options);
  }

  /*
   * get the contacts
   * */

  getContacts() {
    let options = {
      PropertyList:
        "ID,ClientID,ClientName,Company,CurrencySymbol,ContactAddress,ContactEmail,Active",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TContact, options);
  }
  getBalanceSheetData() {
    return this.getList(this.ERPObjects.BalanceSheetReport);
  }

  getBalanceSheetRedirectData() {
    let options = {
      ReportType: "Detail",
      IgnoreSummarised: true,
    };
    // return this.getList(this.ERPObjects.TAccount,options);
    return this.getList(this.ERPObjects.TAccountRunningBalanceReport, options);
  }

  getBalanceSheetRedirectRangeData(datefrom, dateto) {
    let options = {
      ReportType: "Detail",
      IgnoreSummarised: true,
      IgnoreDates: false,
      DateTo: '"' + dateto + '"',
      DateFrom: '"' + datefrom + '"',
    };
    // return this.getList(this.ERPObjects.TAccount,options);
    return this.getList(this.ERPObjects.TAccountRunningBalanceReport, options);
  }

  getBalanceSheetRedirectClientData(accountName) {
    let options = {
      ReportType: "Detail",
      IgnoreSummarised: true,
      IgnoreDates: true,
      Search:'AccountName = "'+accountName+'"'
    };
    // return this.getList(this.ERPObjects.TAccount,options);
    return this.getList(this.ERPObjects.TAccountRunningBalanceReport, options);
  }

  getGSTReconciliationData(dateFrom, dateTo) {
    let options = {
      ReportType: "Detail",
      DateTo: '"' + moment(dateTo).format("YYYY-MM-DD") + '"',
      DateFrom: '"' + moment(dateFrom).format("YYYY-MM-DD") + '"',
    };
    return this.getList(this.ERPObjects.TTaxSummaryReport, options);
  }
  getOneIncomeTransactionData(id) {
    return this.getOneById(this.ERPObjects.TCustomerPayment, id);
  }

  getOneExpenseTransactionData(id) {
    return this.getOneById(this.ERPObjects.TSupplierPayment, id);
  }

  ProfitLossData() {
    return this.getOneById(this.ERPObjects.ProfitLossReport);
  }

  getAccountSummaryRedirectData() {
    let options = {
      ListType: "Detail",
    };
    return this.getList(this.ERPObjects.TAccount, options);
  }

  getProfitandLoss(dateFrom, dateTo, ignoreDate) {
    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
      };
    } else {
      options = {
        IgnoreDates: false,
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }
    return this.getList(this.ERPObjects.ProfitLossReport, options);
  }

  getProfitandLossCompare(dateFrom, dateTo, ignoreDate, periodType) {
    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
        PeriodType: '"' + periodType + '"',
      };
    } else {
      options = {
        IgnoreDates: false,
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
        PeriodType: '"' + periodType + '"',
      };
    }

    return this.getList(
      this.ERPObjects.TProfitAndLossPeriodCompareReport,
      options
    );
  }

  getDepartment() {
    let options = {
      PropertyList: "DeptClassName",
      select: "[Active]=true",
    };
    return this.getList(this.ERPObjects.TDeptClass, options);
  }

  getAgedPayableDetailsData(dateFrom, dateTo, ignoreDate) {
    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
      };
    } else {
      options = {
        IgnoreDates: false,
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }
    return this.getList(this.ERPObjects.TAPReport, options);
  }

  getAgedPayableDetailsSummaryData(dateFrom, dateTo, ignoreDate) {
    // let options = {
    //     IgnoreDates:ignoreDate,
    //     ReportType: 'Summary',
    //     DateFrom: '"'+dateFrom+'"',
    //     DateTo: '"'+dateTo+'"'
    // };

    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
        ReportType: "Summary",
      };
    } else {
      options = {
        IgnoreDates: false,
        ReportType: "Summary",
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }
    return this.getList(this.ERPObjects.TAPReport, options);
  }

  getAgedReceivableDetailsData(dateFrom, dateTo, ignoreDate, contactName) {
    let options = "";
    if(contactName != ''){
      options = {
        IgnoreDates: true,
        Search:'Name = "'+contactName+'"'
      };
    }else{
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true
      };
    } else {
      options = {
        IgnoreDates: false,
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }
  }
    return this.getList(this.ERPObjects.TARReport, options);
  }

  getAgedReceivableDetailsSummaryData(dateFrom, dateTo, ignoreDate) {
    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
        ReportType: "Summary",
      };
    } else {
      options = {
        IgnoreDates: false,
        ReportType: "Summary",
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }
    return this.getList(this.ERPObjects.TARReport, options);
  }

  getGeneralLedgerDetailsData(dateFrom, dateTo, ignoreDate) {
    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
      };
    } else {
      options = {
        IgnoreDates: false,
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }
    return this.getList(this.ERPObjects.TGeneralLedgerReport, options);
  }

  getTrialBalanceDetailsData(dateFrom, dateTo, ignoreDate) {
    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
      };
    } else {
      options = {
        IgnoreDates: false,
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }
    return this.getList(this.ERPObjects.TTrialBalanceReport, options);
  }

  getPurchasesDetailsData(dateFrom, dateTo, ignoreDate) {
    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
        IncludePOs: true,
      };
    } else {
      options = {
        IgnoreDates: false,
        IncludePOs: true,
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }

    return this.getList(this.ERPObjects.TbillReport, options);
  }

  getPurchaseSummaryDetailsData(dateFrom, dateTo, ignoreDate) {
    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
        IncludePOs: true,
        ReportType: "Summary",
      };
    } else {
      options = {
        IgnoreDates: false,
        IncludePOs: true,
        ReportType: "Summary",
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }

    return this.getList(this.ERPObjects.TbillReport, options);
  }

  getSalesDetailsData(dateFrom, dateTo, ignoreDate) {
    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
      };
    } else {
      options = {
        IgnoreDates: false,
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }

    return this.getList(this.ERPObjects.TSalesList, options);
  }

  getSalesDetailsSummaryData(dateFrom, dateTo, ignoreDate) {
    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
        ListType: "Summary",
      };
    } else {
      options = {
        IgnoreDates: false,
        ListType: "Summary",
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }

    return this.getList(this.ERPObjects.TSalesList, options);
  }

  getProductSalesDetailsData(dateFrom, dateTo, ignoreDate) {
    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
      };
    } else {
      options = {
        IgnoreDates: false,
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }

    return this.getList(this.ERPObjects.TProductSalesDetailsReport, options);
  }

  getTaxSummaryData(dateFrom, dateTo, ignoreDate) {
    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
        ReportType: "Summary",
      };
    } else {
      options = {
        IgnoreDates: false,
        ReportType: "Summary",
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }
    return this.getList(this.ERPObjects.TTaxSummaryReport, options);
  }

  getAllProductSalesDetails(dateFrom, dateTo, ignoreDate) {
    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
      };
    } else {
      options = {
        IgnoreDates: false,
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }
    return this.getList(this.ERPObjects.TProductSalesDetailsReport, options);
  }

  getContractorPaymentSummaryData(dateFrom, dateTo, ignoreDate) {
    let options = "";
    if (ignoreDate == true) {
      options = {
        IgnoreDates: true,
      };
    } else {
      options = {
        IgnoreDates: false,
        DateFrom: '"' + dateFrom + '"',
        DateTo: '"' + dateTo + '"',
      };
    }

    return this.getList(this.ERPObjects.TContractorPaymentSummary, options);
  }
}
