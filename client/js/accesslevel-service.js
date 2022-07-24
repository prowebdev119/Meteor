import {BaseService} from '../js/base-service.js';
export class AccessLevelService extends BaseService {
    getMobileTERPForm() {
        let options = {
            ListType: "Detail",
            select: "[TabGroup]=26 and [AccessLevels]=true"
        };
        return this.getList(this.ERPObjects.TERPForm, options);
    }

    getEmployees() {
      let options = {
              PropertyList: "PropertyList==ID,EmployeeName",
              Select: "[Active]=true"
          };
        return this.getList(this.ERPObjects.TEmployee, options);
    }

    getEmployeesUsers() {
      let options = {
              PropertyList: "PropertyList==ID,EmployeeId,EmployeeName",

          };
        return this.getList(this.ERPObjects.TUser, options);
    }

    getEmpFormAccess(EmployeeId) {
        let options = {
            PropertyList: "PropertyList==Id,FormId,AccessLevelName,AccessLevel",
            select: "[EmployeeId]='"+EmployeeId+"'",
        };
        return this.getList(this.ERPObjects.TEmployeeFormAccess, options);
    }

    getEmpFormAccessDetail(EmployeeId) {
        let options = {
            ListType: "Detail",
            select: "[TabGroup]=26 and [EmployeeId]='"+EmployeeId+"'",
        };
        return this.getList(this.ERPObjects.TEmployeeFormAccessDetail, options);
    }

    saveEmpAccess(data){
        return this.POST(this.ERPObjects.TEmployeeFormAccess, data);
    }

    saveEmpUserAccess(data){
        return this.POST('VS1_Cloud_Task/Method?Name="VS1EmployeeAccess"', data);
    }

    getCloudTERPForm() {
        let options = {
            PropertyList: "Description,TabGroupName,SkinsGroup",
            select: "[TabGroup]=26 and [AccessLevels]=true"
        };
        return this.getList(this.ERPObjects.TERPForm, options);
    }

    getCheckBOInvoiceList() {
      let options = {
        select: "[Deleted]=false",
      };
      return this.getList(this.ERPObjects.BackOrderSalesList, options);
    }

    getCheckBOPOList() {
      let options = {
        select: "[Deleted]=false",
      };
      return this.getList(this.ERPObjects.TpurchaseOrderBackOrder, options);
    }
}
