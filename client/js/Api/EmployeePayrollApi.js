import ApiService from "./Module/ApiService";
import ApiCollection from "./Module/ApiCollection";
import ApiCollectionHelper from "./Module/ApiCollectionHelper";
import ApiEndpoint from "./Module/ApiEndPoint";

/**
 * @param {ApiCollection} collection
 */
export default class EmployeePayrollApi {
  constructor() {
    this.name = "employeePayroll";

    this.collectionNames = {
        TEmployeepaysettings: "TEmployeepaysettings"
    };

    this.collection = new ApiCollection([
        new ApiEndpoint({
            name: this.collectionNames.TEmployeepaysettings,
            url: ApiService.getBaseUrl({ endpoint: "TEmployeepaysettings" }),
            headers: ApiService.getHeaders()
        })
    ]);
  }
}
