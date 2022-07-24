import PayTemplateReiumbursementLineFields from "./PayTemplateReiumbursementLineFields";
export default class PayTemplateReiumbursementLine {
  constructor({type, fields}) {
    this.type = type;

    if(fields instanceof PayTemplateReiumbursementLineFields) {
      this.fields = fields;
    }else {
      this.fields = new PayTemplateReiumbursementLineFields(fields);
    }
    
  }

  /**
   *
   * @param {Array} array
   * @return {PayTemplateReiumbursementLine[]}
   */
  static fromList(array) {
    let myList = [];
    array.forEach((element) => {
      myList.push(new PayTemplateReiumbursementLine(element));
    });

    return myList;
  }

}