import {BaseService} from '../js/base-service.js';
export class EmployeeProfileService extends BaseService {
    getEmployeeProfile() {
        return this.GET(this.erpGet.ERPEmpProfileSetting);
    }
    getEmployeeID(employeeName) {
      let options = {
          PropertyList:"ID,EmployeeName",
          select: "[EmployeeName]='"+employeeName+"'",
      };
      return this.getList(this.ERPObjects.TEmployee, options);
      
    }
    getEmployeeProfileImage(employeeName) {
        let options = {
            ListType:"Detail",
            select: "[EmployeeName]='"+employeeName+"'and[Active]=true",
        };
        return this.getList(this.ERPObjects.TemployeePicture, options);
    }

  

}
