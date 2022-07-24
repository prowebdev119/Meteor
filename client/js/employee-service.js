import {BaseService} from '../js/base-service.js';
export class EmployeeService extends BaseService {

    saveEmployee(data){
        return this.POST(this.ERPObjects.TEmployee, data);
    }

    getEmpUserDetail(EmployeeId) {
      let options = {
              PropertyList: "PropertyList==ID,EmployeeName,LogonName",
              Select: "[EmployeeId]='"+EmployeeId+"'"
          };
        return this.getList(this.ERPObjects.TUser, options);
    }

    getEmployeeProfileImage(employeeName) {
        let options = {
            ListType:"Detail",
            select: "[EmployeeName]='"+employeeName+"'",
        };
        return this.getList(this.ERPObjects.TemployeePicture, options);
    }

    getAllEmployeeList() {
      let options = {
        
        PropertyList: "ID,EmployeeNo,EmployeeName,FirstName,LastName,Phone,Mobile,Email,Street,Country,DefaultClassName,CustFld1,CustFld2,CustFld3,CustFld4",
        select: "[Active]=true",
      };
      return this.getList(this.ERPObjects.TEmployee, options);
    }
}
