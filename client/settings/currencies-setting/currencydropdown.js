import {TaxRateService} from "../settings-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
Template.currencydropdown.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.currencyData = new ReactiveVar();
});

Template.currencydropdown.onRendered(function() {
  let taxRateService = new TaxRateService();
  let templateObject = Template.instance();
  const currencyData = [];
  templateObject.getCurrencies = function(){
    getVS1Data('TCurrency').then(function (dataObject) {
      if(dataObject.length == 0){
        taxRateService.getCurrencies().then(function(data){
          for(let i in data.tcurrency){

            let currencyObj = {
              id: data.tcurrency[i].Id || '',
              currency: data.tcurrency[i].Currency || '',
              currencySellRate: data.tcurrency[i].SellRate || '',
              currencyCode: data.tcurrency[i].Code || '',
            };

            currencyData.push(currencyObj);
            templateObject.currencyData.set(currencyData);

          }
      });
      }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tcurrency;
        for(let i in useData){

          let currencyObj = {
            id: useData[i].Id || '',
            currency: useData[i].Currency || '',
            currencySellRate: useData[i].SellRate || '',
            currencyCode: useData[i].Code || '',
          };

          currencyData.push(currencyObj);
          templateObject.currencyData.set(currencyData);

        }

      }
      }).catch(function (err) {
        taxRateService.getCurrencies().then(function(data){
          for(let i in data.tcurrency){

            let currencyObj = {
              id: data.tcurrency[i].Id || '',
              currency: data.tcurrency[i].Currency || '',
              currencySellRate: data.tcurrency[i].SellRate || '',
              currencyCode: data.tcurrency[i].Code || '',
            };

            currencyData.push(currencyObj);
            templateObject.currencyData.set(currencyData);

          }
      });
      });
      if(FlowRouter.current().queryParams.id){

      }else{
        setTimeout(function() {
              $('#sltCurrency').val(CountryAbbr);
        }, 200);
      }

  }
  templateObject.getCurrencies();
});

Template.currencydropdown.helpers({
currencyData: () => {
    return Template.instance().currencyData.get().sort(function(a, b){
      if (a.currency == 'NA') {
    return 1;
        }
    else if (b.currency == 'NA') {
      return -1;
    }
  return (a.currency.toUpperCase() > b.currency.toUpperCase()) ? 1 : -1;
  });
},
currency: () => {
return CountryAbbr;
},
isCurrencyEnable: () => {
return Session.get('CloudUseForeignLicence');
}
});
