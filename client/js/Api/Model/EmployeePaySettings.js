import EmployeePaySettingFields from "./EmployeePaySettingFields";

/**
 * @param {EmployeePaySettingFields} fields
 * @type {{type: string, fields: EmployeePaySettingFields}}
 */

export default class EmployeePaySettings {
    constructor(options) {
      this.type = options.type;
      if (options.fields instanceof EmployeePaySettingFields) {
        this.fields = fields;
      } else {
        this.fields = new EmployeePaySettingFields(options.fields);
      }
    }
  
    /**
     *
     * @param {Array} array
     * @return {EmployeePaySettings[]}
     */
    static fromList(array) {
      let myList = [];
      array.forEach((element) => {
        myList.push(new EmployeePaySettings(element));
      });
  
      return myList;
    }
}
