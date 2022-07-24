import {BaseService} from "../js/base-service";
export class EmployeePayrollService extends BaseService {
  
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
  
  saveTEmployeepaysettings(data) {
    return this.POST(this.ERPObjects.TEmployeepaysettings, data);
  }
  
  getAllTLeaveTypes(limitcount, limitfrom) {
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
    return this.getList(this.ERPObjects.TLeavetypes, options);
  }

  getAllTBankAccounts(limitcount, limitfrom) {
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
    return this.getList(this.ERPObjects.TBankAccounts, options);
  }
  saveTBankAccounts(data) {
    return this.POST(this.ERPObjects.TBankAccounts, data);
  }

  saveTLeavRequest( data ){
    return this.POST(this.ERPObjects.TLeavRequest, data);
  }

}