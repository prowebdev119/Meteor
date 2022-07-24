import Tvs1ChartField from "./Tvs1ChartField";

/**
 * @type {type: string, fields: Tvs1ChartField} options
 * @param {String} options.type
 * @param {Tvs1ChartField} options.fields
 */
export default class Tvs1chart {
  constructor(options) {
    this.type = options.type;
    if (options.fields instanceof Tvs1ChartField) {
      this.fields = fields;
    } else {
      this.fields = new Tvs1ChartField(options.fields);
    }
  }

  /**
   *
   * @param {Array} array
   * @return {Tvs1chart[]}
   */
  static fromList(array) {
    let myList = [];
    array.forEach((element) => {
      myList.push(new Tvs1chart(element));
    });

    return myList;
  }
}
