import {
    BaseService
} from '../js/base-service.js';

export class TaxRateService extends BaseService {
    getTaxRate() {
        return this.GET(this.erpGet.ERPTaxCode);
    }

    getOneTaxRate(id) {
        return this.getOneById(this.ERPObjects.ERPTaxCode, id);
    }

    getAccountType() {
        return this.GET(this.erpGet.ERPTAccountType);
    }

    getAccountList() {
        return this.GET(this.erpGet.ERPAccountList);
    }

    getScheduleSettings() {
        let options = {
                ListType: "Detail",
    //        PropertyList:"BeginFromOption,ContinueIndefinitely,EmployeeId,Employeename,EndDate,Every,FormID,Frequency,GlobalRef,HolidayAction,ID,ISEmpty,KeyStringFieldName,KeyValue,LastEmaileddate,MonthDays,MsTimeStamp,MsUpdateSiteCode",

            };
            return this.getList(this.ERPObjects.TReportSchedules,options);
        }
      saveScheduleSettings(data) {
      //     let options = {
      //             ListType: "Detail",
      // //        PropertyList:"BeginFromOption,ContinueIndefinitely,EmployeeId,Employeename,EndDate,Every,FormID,Frequency,GlobalRef,HolidayAction,ID,ISEmpty,KeyStringFieldName,KeyValue,LastEmaileddate,MonthDays,MsTimeStamp,MsUpdateSiteCode",
      //
      //         };
              return this.POST(this.ERPObjects.TReportSchedules,data);
          }
    getAssetTypes() {
        let options = {
            PropertyList: "AssetTypeName, AssetTypeCode, Notes",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TFixedAssetType, options);
    }

    getAccountOptions() {
        let options = {
            PropertyList: "AccountNumber, AccountName, AccountTypeName",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TAccount, options);
    }

    getAssetType(id) {
        return this.getOneById(this.ERPObjects.TFixedAssetType, id);
    }

    // getCurrencies() {
    //     let options = {
    //         PropertyList: "Code, CurrencyDesc, Currency, BuyRate, SellRate,Active, CurrencySymbol,ID,Country",
    //         select: "[Active]=true",
    //     };
    //     return this.getList(this.ERPObjects.TCurrency, options);
    // }

    getOneAccount(id) {
        return this.getOneById(this.ERPObjects.ERPAccount, id);
    }

    getAccountTypeDropDown() {
        let options = {
            PropertyList: "Description, AccountTypeName",
        };
        return this.getList(this.ERPObjects.ERPAccountType, options);
    }

    getTaxRateDropDown() {
        let options = {
            PropertyList: "CodeName",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TTaxCode, options);
    }

    saveTaxRate(data) {
        return this.POST(this.ERPObjects.TTaxCode, data);
    }

    checkTaxRateByName(codeName) {
        let options = {
            select: "[CodeName]='" + codeName + "'"
        };
        return this.getList(this.ERPObjects.TTaxCode, options);
    }

    checkTermByName(termName) {
        let options = {
            select: "[TermsName]='" + termName + "'"
        };
        return this.getList(this.ERPObjects.TTerms, options);
    }

    checkAllowanceByName(earningName) {
        let options = {
            ListType: "Detail",
            select: "[Description]='" + earningName + "'"
        };
        return this.getList(this.ERPObjects.TAllowance, options);
    }

    checkCalenderName(calendarname)
    {
        let options = {
            select: "[PayrollCalendarName]='" + calendarname + "'"
        };
        return this.getList(this.ERPObjects.TPayrollCalendars, options);
    }

    checkSuperannuationName(Superannuation)
    {
        let options = {
            select: "[Superfund]='" + Superannuation + "'"
        };
        return this.getList(this.ERPObjects.TSuperannuation, options);
    }

    checkfundTypeByName(description)
    {
        let options = {
            select: "[description]='" + description + "'"
        };
        return this.getList(this.ERPObjects.TSuperType, options);
    }

    checkReimbursementByName(reimbursementName) {
        let options = {
            select: "[ReimbursementName]='" + reimbursementName + "'"
        };
        return this.getList(this.ERPObjects.TReimbursement, options);


    }

    checktpayorgainzation(orgainzation)
    {
        let options = {
            select: "[PayrollBankAccount]='" + orgainzation + "'"
        };
        return this.getList(this.ERPObjects.TPayrollOrganization, options);
    }

    savePayOrganization(data)
    {
        return this.POST(this.ERPObjects.TPayrollOrganization, data);

    }

    checkPaidLeaveByName(leavename) {
        let options = {
            select: "[LeavePaidName]='" + leavename + "'"
        };
        return this.getList(this.ERPObjects.TPaidLeave, options);


    }
    checkunPaidLeaveByName(leavename) {
        let options = {
            select: "[LeaveUnPaidName]='" + leavename + "'"
        };
        return this.getList(this.ERPObjects.TUnpaidLeave, options);
    }

    checkRateTypeByName(description)
    {
        let options = {
        select: "[Description]='" + description + "'"
       };
       return this.getList(this.ERPObjects.TPayRateType, options);

    }


    checkordinaryEarningByName(earningName) {
        let options = {
            select: "[OrdinaryTimeEarningsName]='" + earningName + "'"
        };
        return this.getList(this.ERPObjects.TOrdinaryTimeEarnings, options);


    }


    checkDeductionByName(deductionName) {
        let options = {
            select: "[Description]='" + deductionName + "'"
        };
        return this.getList(this.ERPObjects.TDeduction, options);
    }

    getOneAccountTypeByName(AccountTypeName) {
        let options = {
            PropertyList: "Description, AccountTypeName",
        };
        return this.getList(this.ERPObjects.ERPAccountType, options);
    }

    getExpenseAccountList() {
        return this.GET(this.erpGet.ERPExpenseAccountList);
    }

    getRevenueAccountList() {
        return this.GET(this.erpGet.ERPRevenueAccountList);
    }

    getEquityAccountList() {
        return this.GET(this.erpGet.ERPEquityAccountList);
    }

    getAssetAccountList() {
        return this.GET(this.erpGet.ERPAssetAccountList);
    }

    getLiabilityAccountList() {
        return this.GET(this.erpGet.ERPLiabilityAccountList);
    }
    getArchiveAccountList() {
        return this.GET(this.erpGet.ERPArchiveAccountList);
    }
    getChartOfAccounts() {
        let options = {
            select: "[Active]=true",
            ListType: "Detail"
        };
        return this.getList(this.ERPObjects.TAccount, options);
    }
    saveAccount(data) {
        return this.POST(this.ERPObjects.TAccount, data);
    }
    saveClientTypeData(data) {
        return this.POST(this.ERPObjects.TClientType, data);
    }

    saveAccount(data) {
        return this.POST(this.ERPObjects.TAccount, data);
    }

    saveDepartment(data) {
        return this.POST(this.ERPObjects.TDeptClass, data);
    }

    saveRateType(data){
        return this.POST(this.ERPObjects.TPayRateType, data);
    }

    savePaidLeave(data){

        return this.POST(this.ERPObjects.TPaidLeave, data);
    }

    saveUnPaidLeave(data){

        return this.POST(this.ERPObjects.TUnpaidLeave, data);
    }

    saveSuperType(data)
    {
        return this.POST(this.ERPObjects.TSuperType, data);

    }

    checkDepartmentByName(deptName) {
        let options = {
            select: "[DeptClassName]='" + deptName + "'"
        };
        return this.getList(this.ERPObjects.TDeptClass, options);
    }
    checkCurrency(Country) {
        let options = {
            PropertyList: "Code,CurrencyDesc,Currency,BuyRate,SellRate,Active,CurrencySymbol,ID",
            select: "[Country]=" + Country
        };
        return this.getList(this.ERPObjects.TCurrency, options);
    }
    saveCurrency(data) {
        return this.POST(this.ERPObjects.TCurrency, data);
    }


    getDepartment() {
        let options = {
            PropertyList: "ID,GlobalRef,KeyValue,DeptClassGroup,DeptClassName,Description,SiteCode,Active",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TDeptClass, options);
    }

    getClientType() {
        let options = {
            PropertyList: "ID,TypeDescription,TypeName,Active",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TClientType, options);
    }

    getOneDepartment(id) {
        return this.getOneById(this.ERPObjects.TDeptClass, id);
    }

    getCurrencies() {
        let options = {
            PropertyList: "ID, Code, CurrencyDesc, Currency, BuyRate, SellRate,Active, CurrencySymbol,Country,RateLastModified",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TCurrency, options);
    }

    getCurrenciesVS1() {
        let options = {
            PropertyList: "ID, Code, CurrencyDesc, Currency, BuyRate, SellRate,Active, CurrencySymbol,Country,RateLastModified",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TCurrencyVS1, options);
    }

    getOneCurrency(id) {
        return this.getOneById(this.ERPObjects.TCurrency, id);
    }

    getOneCurrencyByCountry(country) {
        let options = {
            PropertyList: "ID, Code, CurrencyDesc, Currency, BuyRate, SellRate,Active, CurrencySymbol,Country,RateLastModified",
            // select: "[Country]='"+country+"'",
        };
        return this.getList(this.ERPObjects.TCurrency, options);
    }

    getPaymentMethod() {
        let options = {
            PropertyList: "ID,IsCreditCard,PaymentMethodName,Active",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TPaymentMethod, options);
    }

    getPaymentMethodVS1() {
        let options = {
            PropertyList: "ID,IsCreditCard,PaymentMethodName,Active",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TPaymentMethodVS1, options);
    }

    getOnePaymentMethod(id) {
        return this.getOneById(this.ERPObjects.TPaymentMethod, id);
    }

    savePaymentMethod(data) {
        return this.POST(this.ERPObjects.TPaymentMethod, data);
    }

    getTerms() {
        let options = {
            PropertyList: "ID,Days,IsEOM,IsEOMPlus,TermsName,Description,IsDays,Active",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TTerms, options);
    }
    getTermsVS1() {
        let options = {
            PropertyList: "ID,Days,IsEOM,IsEOMPlus,TermsName,Description,IsDays,Active,isPurchasedefault,isSalesdefault",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TTermsVS1, options);
    }

    getTaxRateVS1() {
        let options = {
            PropertyList: "ID,CodeName,Description,LocationCategoryDesc,Rate,RegionName,Active",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TTaxcodeVS1, options);
    }

    getOneTerms(id) {
        return this.getOneById(this.ERPObjects.TTerms, id);
    }

    saveTerms(data) {
        return this.POST(this.ERPObjects.TTerms, data);
    }

    saveAllowance(data) {
        return this.POST(this.ERPObjects.TAllowance, data);
    }

    saveCalender(data) {
        return this.POST(this.ERPObjects.TPayrollCalendars, data);
    }
    saveSuperannuation(data) {
        return this.POST(this.ERPObjects.TSuperannuation, data);
    }

    saveReimbursement(data)
    {
        return this.POST(this.ERPObjects.TReimbursement, data);
    }

    saveordinaryEarningByName(data)
    {
        return this.POST(this.ERPObjects.TOrdinaryTimeEarnings, data);
    }

    saveHoliday(data){
        return this.POST(this.ERPObjects.TPayrollHolidays, data);
    }
    saveExemptReportableOvertime(data)
    {
        return this.POST(this.ERPObjects.TOverTimeEarnings, data);
    }
    saveSuperannuationBonusesCommissions(data)
    {
        return this.POST(this.ERPObjects.TEarningsBonusesCommissions, data);
    }
    saveExemptReportableLumpSumE(data)
    {
        return this.POST(this.ERPObjects.TLumpSumE, data);
    }
    saveExemptReportableTermnination(data)
    {
        return this.POST(this.ERPObjects.TTerminationSimple, data);
    }
    saveDirectorFee(data)
    {
        return this.POST(this.ERPObjects.TDirectorsFees, data);
    }
    saveLumpSumW(data)
    {
        return this.POST(this.ERPObjects.TLumpSumW, data);
    }
    saveDeduction(data) {
        return this.POST(this.ERPObjects.TDeduction, data);
    }


    checkordinaryEarningByName(earningname)
    {
        let options = {
            select: "[PayItemsEarningsOrdinaryTimeEarningsName]='" + earningname + "'"
        };
        return this.getList(this.ERPObjects.TOrdinaryTimeEarnings, options);
    }

    checkExemptReportableOvertime(earningname)
    {
        let options = {
            select: "[OverTimeEarningsName]='" + earningname + "'"
        };
        return this.getList(this.ERPObjects.TOverTimeEarnings, options);
    }
    checkSuperannuationBonusesCommissions(earningname)
    {
        let options = {
            select: "[EarningBonusesCommisionsName]='" + earningname + "'"
        };
        return this.getList(this.ERPObjects.TEarningsBonusesCommissions , options);
    }
    checkExemptReportableLumpSumE(earningname)
    {
        let options = {
            select: "[LumpSumEName]='" + earningname + "'"
        };
        return this.getList(this.ERPObjects.TLumpSumE, options);
    }
    checkExemptReportableTermnination(earningname)
    {
        let options = {
            select: "[EmployeeTerminationPaymentsName]='" + earningname + "'"
        };
        return this.getList(this.ERPObjects.TTerminationSimple, options);
    }
    checkDirectorFee(earningname)
    {
        let options = {
            select: "[DirectorsFeesName]='" + earningname + "'"
        };
        return this.getList(this.ERPObjects.TDirectorsFees, options);
    }

    checkHolidaybyName(holidayname)
    {

        let options = {
            select: "[PayrollHolidaysName]='" + holidayname + "'",
            ListType: "Detail"
        };
        return this.getList(this.ERPObjects.TPayrollHolidays, options);
    }
    checkLumpSumW(earningname)
    {
        let options = {
            select: "[LumpSumWName]='" + earningname + "'"
        };
        return this.getList(this.ERPObjects.TLumpSumW, options);
    }

    checkPaymentMethodByName(paymentName) {
        let options = {
            select: "[PaymentMethodName]='" + paymentName + "'"
        };
        return this.getList(this.ERPObjects.TPaymentMethod, options);
    }

    getEmployees() {
        let options = {
            PropertyList: "PropertyList==ID,EmployeeName",
            Select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TEmployee, options);
    }

    getBins() {
        let options = {
            PropertyList: "ID,BinLocation,BinNumber",
            Select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TProductBin, options);
    }

    saveRoom(data) {
        return this.POST(this.ERPObjects.TProductBin, data);
    }

    pullBackupData(data) {
        return this.POSTJsonIn('VS1_Cloud_Task/Method?Name="VS1_BackupList"', data);
    }

    saveBackupData(data) {
        return this.POSTJsonIn('VS1_Cloud_Task/Method?Name="VS1_DatabaseBackup"', data);
    }

    restoreBackupData(data) {
        return this.POSTJsonIn('VS1_Cloud_Task/Method?Name="VS1_DatabaseRestore"', data);
    }

    getAllBackUpList() {
        let options = {
            // PropertyList: "PropertyList==ID,EmployeeName",
            // Select: "[Active]=true"
        };
        return this.getList('VS1_Cloud_Task/Method?Name="VS1_BackupList"');
    }

    getUserDetails() {
        let options = {
            ListType: "Detail",
            select: "[Active]=true",
        };
            return this.getList(this.ERPObjects.TEmployee,options);
        }

}
