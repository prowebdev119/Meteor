import {BaseService} from "../js/base-service";
export class ShippingService extends BaseService {
  getAllInvoice() {
      let options = {
          PropertyList: "Id,ClientName,EmployeeName,SaleClassName,SaleDate",
          // select: "[deleted]=false"
      };
      return this.getList(this.ERPObjects.TInvoiceBackOrder, options);
  }

  }
