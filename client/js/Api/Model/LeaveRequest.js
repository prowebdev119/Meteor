import LeaveRequestFields from "./LeaveRequestFields";
export default class LeaveRequest {
  constructor({type, fields}) {
    this.type = type;

    if(fields instanceof LeaveRequestFields) {
      this.fields = fields;
    }else {
      this.fields = new LeaveRequestFields(fields);
    }
    
  }

  /**
   *
   * @param {Array} array
   * @return {LeaveRequest[]}
   */
  static fromList(array) {
    let myList = [];
    array.forEach((element) => {
      myList.push(new LeaveRequest(element));
    });

    return myList;
  }

}