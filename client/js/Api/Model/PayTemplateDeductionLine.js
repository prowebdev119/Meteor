import PayTemplateDeductionLineFields from "./PayTemplateDeductionLineFields";
export default class PayTemplateDeductionLine {
  constructor({type, fields}) {
    this.type = type;

    if(fields instanceof PayTemplateDeductionLineFields) {
      this.fields = fields;
    }else {
      this.fields = new PayTemplateDeductionLineFields(fields);
    }
    
  }

  /**
   *
   * @param {Array} array
   * @return {PayTemplateDeductionLine[]}
   */
  static fromList(array) {
    let myList = [];
    array.forEach((element) => {
      myList.push(new PayTemplateDeductionLine(element));
    });

    return myList;
  }

}