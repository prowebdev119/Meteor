import {BaseService} from "../js/base-service";
export class StockTransferService extends BaseService {
  getAllStockAdjustEntry() {
      let options = {
          PropertyList: "Id,AccountName,CreationDate,Notes,Employee,AdjustmentDate,Deleted,Description,Processed,IsStockTake,Approved,TotalCostEx",
          select: "[Deleted]=false"
      };
      return this.getList(this.ERPObjects.TStockAdjustEntry, options);
  }

  getDepartment() {
      let options = {
          PropertyList: "DeptClassName",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TDeptClass, options);
  }

  getAccountName() {
      let options = {
          PropertyList: "AccountName",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TAccount, options);
  }

  getAccountNameVS1() {
      let options = {
          PropertyList: "AccountName",
          select: "[Active]=true"
      };
      return this.getList(this.ERPObjects.TAccountVS1, options);
  }

  saveStockAdjustment(data){
        return this.POST(this.ERPObjects.TStockAdjustEntry, data);
  }

  saveStockTransfer(data){
        return this.POST(this.ERPObjects.TStockTransferEntry, data);
  }

  saveShippingDocket(data){
        return this.POST(this.ERPObjects.TInvoice, data);
  }

  getOneStockTransferData(id){
        return this.getOneById(this.ERPObjects.TStockTransferEntry, id);
  }

  getOneStockAdjustData(id){
        return this.getOneById(this.ERPObjects.TStockAdjustEntry, id);
  }

  getCompanyInfo(){
        let options = {
            PropertyList: "PoBox,PoBox2,PoBox3,PoCity,PoState,PoPostcode,PoCountry,abn,CompanyNumber,BankName,BankAccountName",
        };
        return this.getList(this.ERPObjects.TCompanyInfo, options);
  }


  getProductClassQuantitys() {
      let options = {
          PropertyList: "ID,AvailableQty,InStockQty,ProductName,DepartmentName",
          /*select: "[ProductName]='"+productname+"'and[DepartmentName]='"+deptName+"'",*/
      };
      return this.getList(this.ERPObjects.TProductClassQuantity, options);
  }

  getProductClassQuantitysByDept(productname, deptName) {
      let options = {
          PropertyList: "ID,AvailableQty,InStockQty,ProductName,DepartmentName",
          select: "[ProductName]='"+productname+"' and [DepartmentName]='"+deptName+"'"
      };
      return this.getList(this.ERPObjects.TProductClassQuantity, options);
  }

  getSerialNumberList() {
      let options = {
          AllocType: "In-Stock"
      };
      return this.getList(this.ERPObjects.TSerialNumberListCurrentReport, options);
  }

  }
