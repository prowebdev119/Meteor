import PayTemplateSuperannuationLineFields from "./PayTemplateSuperannuationLineFields";
export default class PayTemplateSuperannuationLine {
  constructor({type, fields}) {
    this.type = type;

    if(fields instanceof PayTemplateSuperannuationLineFields) {
      this.fields = fields;
    }else {
      this.fields = new PayTemplateSuperannuationLineFields(fields);
    }
    
  }

  /**
   *
   * @param {Array} array
   * @return {PayTemplateSuperannuationLine[]}
   */
  static fromList(array) {
    let myList = [];
    array.forEach((element) => {
      myList.push(new PayTemplateSuperannuationLine(element));
    });

    return myList;
  }

}