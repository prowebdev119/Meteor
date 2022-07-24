import ApiService from "./Module/ApiService";
import ApiCollection from "./Module/ApiCollection";
import ApiCollectionHelper from "./Module/ApiCollectionHelper";
import ApiEndpoint from "./Module/ApiEndPoint";

/**
 * @param {ApiCollection} collection
 */
export default class AccountOverviewApi {
  constructor() {
    this.name = "dashboard";

    this.collectionNames = {
        vs1charts: "vs1charts",
        TVs1TabGroups: "TVs1TabGroups",
        Tvs1dashboardpreferences: "Tvs1dashboardpreferences"

    };

    this.collection = new ApiCollection([
      new ApiEndpoint({
        name: this.collectionNames.vs1charts,
        url: ApiService.getBaseUrl({ endpoint: "Tvs1charts" }),
        headers: ApiService.getHeaders()
      }),
      new ApiEndpoint({
        name: this.collectionNames.TVs1TabGroups,
        url: ApiService.getBaseUrl({ endpoint: "TVs1TabGroups" }),
        headers: ApiService.getHeaders()
      }),
      new ApiEndpoint({
        name: this.collectionNames.Tvs1dashboardpreferences,
        url: ApiService.getBaseUrl({ endpoint: `Tvs1dashboardpreferences` }),
        headers: ApiService.getHeaders()
      }),
    ]);
  }
}
