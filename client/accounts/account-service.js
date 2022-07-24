import {BaseService} from '../js/base-service.js';

export class AccountService extends BaseService {
    getExpenseClaim() {
        return this.GET(this.erpGet.ERPTExpenseEx);
    }

    getFixedAssets(type) {
        let options = {
            // select: type ? "[Active]=true and [Status]="+type : "[Active]=true" ,
            select: "'"+type+"'"  ? "[Active]=true and [Status]='"+type+"'" : "[Active]=true" ,
            ListType:"Detail"
        };
        return this.getList(this.ERPObjects.TFixedAssets, options);
    }

    getOneAsset(id){
        return this.getOneById(this.ERPObjects.TFixedAssets, id);
    }

    getOneExpenseClaim(id){
        return this.getOneById(this.ERPObjects.TExpenseClaimEx, id);
    }

    getAccountTypes() {
        let options = {
            PropertyList: "ID,AccountName,AccountTypeName,TaxCode,AccountNumber",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TAccount, options);
    }

    getEmployees() {
      let options = {
          PropertyList: "ID,EmployeeName,KeyValue",
          select: "[Active]=true"
      };
        return this.getList(this.ERPObjects.TEmployee,options);
    }

    getTaxCodes(){
        let options = {
            PropertyList: "CodeName,Rate,Description",
            // select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TTaxCode, options);
    }

    getTaxCodesVS1(){
        let options = {
            PropertyList: "CodeName,Rate,Description",
            // select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TTaxcodeVS1, options);
    }

    getAssetType(){
        let options = {
            PropertyList: "AssetTypeName",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TFixedAssetType, options);
    }
    getSupplier(){
        let options = {
            PropertyList: "ClientName",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TSupplier, options);
    }

    getSupplierVS1(){
        let options = {
            PropertyList: "ClientName",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TSupplierVS1, options);
    }
    saveAsset(data){
        return this.POST(this.ERPObjects.TFixedAssets, data);
    }
    saveAccount(data){
        return this.POST(this.ERPObjects.TAccount, data);
    }
    saveAssetType(data){
        return this.POST(this.ERPObjects.TFixedAssetType, data);
    }
    saveReceipt(data){
        return this.POST(this.ERPObjects.TExpenseClaimEx, data);
    }
    saveLineAttachment(data){
        return this.POST(this.ERPObjects.TAttachment,data);
    }
    getLineAttachmentList(lineID){
        let options = {
            PropertyList: "Attachment,AttachmentName,Description,TableId,TableName",
            select: "[TableName]='tblexpenseclaimlineex' and [TableID]="+lineID
        };
        return this.getList(this.ERPObjects.TAttachment, options);
    }
    getAssetIds(){
        let options = {
            PropertyList: "ID",
        };
        return this.getList(this.ERPObjects.TFixedAssets, options);
    }
    getCustomers() {
        let options = {
            PropertyList: "Id,ClientName,KeyValue,Email,BankAccountBSB,BankAccountNo",
        };
        return this.getList(this.ERPObjects.TCustomer, options);
    }
    getTOneCustomerData(customerName) {
        let options = {
            ListType: "Detail",
            select: "[ClientName]='"+customerName+"'",
        };
        return this.getList(this.ERPObjects.TCustomer, options);
    }
    getAccountTypesToAddNew() {
        let options = {
            PropertyList: "AccountTypeName,Description,OriginalDescription",
        };
        return this.getList(this.ERPObjects.TAccountType, options);
    }
    saveNewAccount(data) {
        return this.POST(this.ERPObjects.TAccount,data);
    }
    getBankCodes() {
        let options = {
            PropertyList:'BankName,BankCode',
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TBankCode, options);
    }
    saveCustomerData(data) {
        return this.POST(this.ERPObjects.TCustomer,data);
    }

    getAccountList() {
      let options = {
          PropertyList:'AccountName,Description,AccountNumber,AccountTypeName,TaxCode,BankAccountName,BSB,BankAccountNumber,Extra,APCANumber,Balance',
          select: "[Active]=true",
      };
      return this.getList(this.ERPObjects.TAccount,options);
    }

    getAccountListVS1() {
      let options = {
          PropertyList:'AccountName,Description,AccountNumber,AccountTypeName,TaxCode,BankAccountName,BSB,BankAccountNumber,Extra,APCANumber,Balance,BankNumber,IsHeader',
          select: "[Active]=true",
      };
      return this.getList(this.ERPObjects.TAccountVS1,options);
    }

    getAccountTypeCheck() {
      let options = {
          PropertyList:'AccountTypeName,Description,OriginalDescription',
          // select: "[Active]=true",
      };
      return this.getList(this.ERPObjects.TAccountType,options);
    }

    getOneAccount(id){
     return this.getOneById(this.ERPObjects.ERPAccount, id);
   }
   getOneAccountByName(dataSearchName){
     let options = {
       ListType:"Detail",
       select: '[AccountName]="'+dataSearchName+'"'
     };
     return this.getList(this.ERPObjects.TAccountVS1, options);
  }

   getAllJournalEnrtryLinesList() {
     let options = {
       PropertyList: "GJID,MsTimeStamp,AccountName,DeptName,DebitAmount,DebitAmountInc,CreditAmount,CreditAmountInc,TaxAmount,AccountID,Approved,EmployeeName,AccountNumber,Memo",
       select: "[Deleted]=false",
     };
     return this.getList(this.ERPObjects.TJournalEntryLines, options);
   }

   getCheckAccountData(accountName) {
       let options = {
           select: "[AccountName]='"+accountName+"'",
       };
       return this.getList(this.ERPObjects.TAccount, options);
   }

   getAccountName() {
       let options = {
           PropertyList: "AccountName",
           select: "[Active]=true and [AccountTypeName]='BANK'"
       };
       return this.getList(this.ERPObjects.TAccount, options);
   }

}
