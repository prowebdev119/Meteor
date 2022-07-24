import {BaseService} from '../js/base-service.js';
export class CountryService extends BaseService {
    getCountry() {
        return this.GET(this.erpGet.ERPCountries);
    }

}
