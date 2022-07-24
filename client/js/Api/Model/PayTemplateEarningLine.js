import PayTemplateEarningLineFields from "./PayTemplateEarningLineFields";
export default class PayTemplateEarningLine {
  constructor({type, fields}) {
    this.type = type;

    if(fields instanceof PayTemplateEarningLineFields) {
      this.fields = fields;
    }else {
      this.fields = new PayTemplateEarningLineFields(fields);
    }
    
  }

  /**
   *
   * @param {Array} array
   * @return {PayTemplateEarningLine[]}
   */
  static fromList(array) {
    let myList = [];
    array.forEach((element) => {
      myList.push(new PayTemplateEarningLine(element));
    });

    return myList;
  }

}