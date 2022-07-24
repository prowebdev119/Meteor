import {BaseService} from '../js/base-service.js';

export class RateTypeService extends BaseService {

    getRateTypes() {
        let options = {
            PropertyList: "ID,Description",
            select: "[Active]=true"
        };
        return this.getList(this.ERPObjects.TRateTypes, options);
    }


    saveRateType(data){
        return this.POST(this.ERPObjects.TRateTypes, data);
    }
   

    saveNewRateType(data) {
        return this.POST(this.ERPObjects.TRateTypes,data);
    }
   

    getRateTypeCheck() {
      let options = {
          PropertyList:'Description',
        
      };
      return this.getList(this.ERPObjects.TRateTypes,options);
    }

    getOneRateType(id){
     return this.getOneById(this.ERPObjects.TRateTypes, id);
   }

   getOneRateTypeByName(dataSearchName){
     let options = {
       ListType:"Detail",
       select: '[Description]="'+dataSearchName+'"'
     };
     return this.getList(this.ERPObjects.TRateTypes, options);
  }

  getOneFundTypeByName(dataSearchName){
    let options = {
      ListType:"Detail",
      select: '[Description]="'+dataSearchName+'"'
    };
    return this.getList(this.ERPObjects.TSuperType, options);
 }

}
