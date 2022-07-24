import Tvs1CardPreferenceFields from "./Tvs1CardPreferenceFields";
export default class Tvs1CardPreference {
  constructor({type, fields}) {
    this.type = type;

    if(fields instanceof Tvs1CardPreferenceFields) {
      this.fields = fields;
    }else {
      this.fields = new Tvs1CardPreferenceFields(fields);
    }
    
  }

  /**
   *
   * @param {Array} array
   * @return {Tvs1CardPreference[]}
   */
  static fromList(array) {
    let myList = [];
    array.forEach((element) => {
      myList.push(new Tvs1CardPreference(element));
    });

    return myList;
  }

}