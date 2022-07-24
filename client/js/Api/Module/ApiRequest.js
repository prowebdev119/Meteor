import ApiService from "./ApiService";


export default class ApiRequest {
    constructor() {
        console.log('ApiRequest module loaded');
    }

    static async getDashboardCharts() {
        const url = ApiService.getBaseUrl() + "Tvs1charts";
        await ApiService.fetch(url, {
            headers: ApiService.getHeaders(),
            method: "GET"
        }, (response) => {
            console.log(response);
        });

        console.log(url);


    }

    static async getDashboardTabGroups() {
        const url = ApiService.getBaseUrl() + "TVs1TabGroups";
        
        console.log(url);


    }
    static async getDashboardPreferences() {
        const url = ApiService.getBaseUrl() + "Tvs1dashboardpreferences";
        console.log(url);


    }
}