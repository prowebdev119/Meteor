import {BaseService} from "../js/base-service";
export class STSService extends BaseService {
    saveStrain(data){
        return this.POST(this.ERPObjects.TStSStrain,data);
    }
    
    getStrainListVS1(){
         let options = {
            PropertyList: "CBD_Content,Indica,Sativa,Strainname,Tested,TestedBy,TestedInHouse,THC_Content,ImmatureProductName,VegetativeProductName,FloweringProductName,HarvestProductName",
        };
        return this.getList(this.ERPObjects.TStSStrain, options);
    }
    
    getClientVS1() {
        let options = {
            PropertyList: "ClientName,Email,Abn,Street,Street2,Street3,Suburb,State,Postcode,Country",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TCustomerVS1, options);
    }

     getDepartment() {
        let options = {
            PropertyList: "DeptClassName",
            select: "[Active]=true",
        };
        return this.getList(this.ERPObjects.TDeptClass, options);
    }
    
    getBins() {
      let options = {
              PropertyList: "ID,BinLocation,BinNumber",
              Select: "[Active]=true"
          };
        return this.getList(this.ERPObjects.TProductBin, options);
    }
}
