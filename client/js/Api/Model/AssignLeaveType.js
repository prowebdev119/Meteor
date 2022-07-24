import AssignLeaveTypeFields from "./AssignLeaveTypeFields";
export default class AssignLeaveType {
  constructor({type, fields}) {
    this.type = type;

    if(fields instanceof AssignLeaveTypeFields) {
      this.fields = fields;
    }else {
      this.fields = new AssignLeaveTypeFields(fields);
    }
    
  }

  /**
   *
   * @param {Array} array
   * @return {AssignLeaveType[]}
   */
  static fromList(array) {
    let myList = [];
    array.forEach((element) => {
      myList.push(new AssignLeaveType(element));
    });

    return myList;
  }

}