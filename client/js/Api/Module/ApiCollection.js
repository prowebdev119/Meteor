import ApiCollectionHelper from "./ApiCollectionHelper";
import ApiEndPoint from "./ApiEndPoint";

/**
 *
 * @param {ApiEndPoint[]} endpointCollection   List of endpoints
 */
export default class ApiCollection extends ApiCollectionHelper {
  constructor(endpointCollection = []) {
    if (endpointCollection == null) {
      return;
    }
    super(endpointCollection);
    this.collection = endpointCollection;
  }
}
