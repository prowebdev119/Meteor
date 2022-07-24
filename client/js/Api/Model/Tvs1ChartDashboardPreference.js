import Tvs1ChartDashboardPreferenceField from "./Tvs1ChartDashboardPreferenceField";

/**
 * @param {Tvs1ChartDashboardPreferenceField} fields
 * @type {{type: string, fields: Tvs1ChartDashboardPreferenceField}}
 */
export default class Tvs1ChartDashboardPreference {
  constructor({type, fields}) {
    this.type = type;

    if(fields instanceof Tvs1ChartDashboardPreference) {
      this.fields = fields;
    }else {
      this.fields = new Tvs1ChartDashboardPreferenceField(fields);
    }
   
  }


  /**
   * 
   * @param {Array} array 
   * @return {Tvs1ChartDashboardPreference[]}
   */
  static fromList(array) {
    
    let myList = [];
    array.forEach((element) => {
      myList.push(new Tvs1ChartDashboardPreference(element));
    });

    return myList;
  }
}
