import {BaseService} from '../../js/base-service.js';

export class PayrollService extends BaseService {
    getTaxRate() {
        return this.GET(this.erpGet.ERPTaxCode);
    }

    getAccountType() {
        return this.GET(this.erpGet.ERPTAccountType);
    }

    getAccountList() {
        return this.GET(this.erpGet.ERPAccountList);
    }


    getAccountOptions() {
        let options = {
            PropertyList: "AccountNumber, AccountName, AccountTypeName",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TAccount, options);
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

    saveTaxRate(data){
         return this.POST(this.ERPObjects.TTaxCode, data);
    }

    checkTaxRateByName(codeName){
         let options = {
             select: "[CodeName]='"+codeName+"'"
         };
         return this.getList(this.ERPObjects.TTaxCode, options);
    }

     checkTermByName(termName){
         let options = {
             select: "[TermsName]='"+termName+"'"
         };
         return this.getList(this.ERPObjects.TTerms, options);
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
    getChartOfAccounts(){
        let options = {
            select: "[Active]=true",
            ListType:"Detail"
        };
        return this.getList(this.ERPObjects.TAccount, options);
    }

    getEmployees() {
      let options = {
              PropertyList: "PropertyList==ID,EmployeeName",
              Select: "[Active]=true"
          };
        return this.getList(this.ERPObjects.TEmployee, options);
    }

}
