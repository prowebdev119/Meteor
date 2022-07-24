import {TaxRateService} from "../settings/settings-service";
import {CountryService} from "../js/country-service";
import {ReactiveVar} from "meteor/reactive-var";
let settingsService = new TaxRateService();
let countryService = new CountryService();

Template.addCurrencyModel.onCreated(() => {
    let templateObject = Template.instance();
    templateObject.currencyList= new ReactiveVar([]);
    templateObject.countryData = new ReactiveVar();
    templateObject.country = new ReactiveVar();
    templateObject.currencyDesc = new ReactiveVar();
    templateObject.id = new ReactiveVar();
    templateObject.noCountry = new ReactiveVar();
});

Template.addCurrencyModel.onRendered(function () {
    let templateObject = Template.instance();
    let countriesArr = [];
    let currencyData;
    templateObject.getCurrencies = function () {
        settingsService.getCurrencies().then(function (data) {
            currencyData = data.tcurrency;
            templateObject.currencyList.set(currencyData);
        });
    };
    templateObject.getCountries = function () {
        countryService.getCountry().then(function (data) {
            let temp = true;
            let currencyData = templateObject.currencyList.get();
            let countryData = data.tcountries;
            if (currencyData && currencyData.length) {
                countryData.forEach(function (data) {
                    temp = true;
                    currencyData.forEach(function (cdata) {
                        if (cdata.Country === data.Country) {
                            temp = false;
                        }
                    });

                    if (temp) {
                        let showData = data.CountryCode + " " + data.Country;
                        countriesArr.push(showData);
                    }
                    templateObject.countryData.set(countriesArr);
                });
                setTimeout(function () {
                    templateObject.countryCodeDropdown();
                }, 1000);
            }
        });
    };
    templateObject.countryCodeDropdown = function() {
        $(".currency-list-dropdown-list").autocomplete({
            source: countriesArr,
            minLength: 0,
            select: function (event, ui) {
            }
        }).focus(function () {
            $(this).autocomplete('search', "")
        })
    };

    templateObject.clearData = function () {
        let templateObject = Template.instance();
        let fieldsValue = '';
        $('#currency').val(fieldsValue);
        $('#code').val(fieldsValue);
        $('#currSymbol').val(fieldsValue);
        $('#buyRt').val(fieldsValue);
        $('#sellRt').val(fieldsValue);
        $('#currencyDesc').val(fieldsValue);
        templateObject.country.set(fieldsValue);
        templateObject.currencyDesc.set(fieldsValue);
        templateObject.id.set(fieldsValue);
    };
    templateObject.getCurrencies();
    templateObject.getCountries();
});

Template.addCurrencyModel.helpers({
    countryData: () => {
        return Template.instance().countryData.get();
    },
    noCountry: () => {
        return Template.instance().noCountry.get();
    }
});

Template.addCurrencyModel.events({
    'click .currency-list-dropdown-img': function (event) {
        let templateObject = Template.instance();
        templateObject.$(".currency-list-dropdown-list").trigger("focus");
    },
    'blur #TaxDropdown': function (event) {
        let templateObject = Template.instance();
        templateObject.clearData();
        let country = $("#TaxDropdown").val();
        let splitCountry = country.substr(country.indexOf(' ')+1);
        settingsService.checkCurrency(splitCountry).then(function (data) {
            let currency = data.tcurrency[0];
            if(country !== '' || country !== 'undefined') {
                templateObject.noCountry.set(true);
            }
            else {
                templateObject.noCountry.set(false);
            }
            if (!data.tcurrency.length) {
                templateObject.country.set(country);
            }
            else if (data.tcurrency.length && data.tcurrency[0].Active === false) {
                settingsService.checkCurrency(country).then(function (data) {
                    $('#currency').val(currency.Currency);
                    $('#code').val(currency.Code);
                    $('#currSymbol').val(currency.CurrencySymbol);
                    $('#buyRt').val(currency.BuyRate);
                    $('#sellRt').val(currency.SellRate);
                    $('#currencyDesc').val(currency.CurrencyDesc);
                    templateObject.country.set(country);
                    templateObject.currencyDesc.set(currency.CurrencyDesc);
                    templateObject.id.set(currency.Id);
                })
            }
            else {
                templateObject.noCountry.set(false);
                // Bert.alert('<strong>Currency is already in the list</strong>!', 'danger');
                swal('Currency is already in the list!', '', 'error');
            }
        });
    },
    'click #saveCurrency': function (event) {
        let templateObject = Template.instance();
        let country= templateObject.country.get().split(' ')[1];
        let objDetails = {
            type: "TCurrency",
            fields: {
                Active : true,
                BuyRate: parseFloat($("#buyRt").val()),
                Code: $("#code").val(),
                Country: country,
                Currency: $("#currency").val(),
                CurrencyDesc: $("#currencyDesc").val(),
                CurrencySymbol: $("#currSymbol").val(),
                ID: templateObject.id.get(),
                SellRate: parseFloat($("#sellRt").val())
            }
        };
        settingsService.saveCurrency(objDetails).then(function (data){
            // Bert.alert('<strong>'+ 'Currency details successfully saved!'+'</strong>!', 'success');
            swal('Currency details successfully saved!', '', 'success');
            templateObject.clearData();
        }).catch(function (err) {
            swal({ title: 'Oooops...', text: err, type: 'error', showCancelButton: false, confirmButtonText: 'Try Again' }).then((result) => { if (result.value) { Meteor._reload.reload(); } else if (result.dismiss === 'cancel') {}});
        });
    }
});
