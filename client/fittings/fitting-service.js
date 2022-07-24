import {BaseService} from "../js/base-service";
export class FittingService extends BaseService {
  getAllSalesOrder() {
      let options = {
          PropertyList: "Id,DocNumber,ClientName,EmployeeName,SaleClassName,SaleDate,TermsName,deleted",
          // select: "[deleted]=false"
      };
      return this.getList(this.ERPObjects.TSalesOrder, options);
  }

  }
