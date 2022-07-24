import {ReactiveVar} from "meteor/reactive-var";
import {TaxRateService} from "../../settings-service";
import {UtilityService} from "../../../utility-service";

Template.importChartAccount.onCreated(() => {
    let templateObject = Template.instance();
    templateObject.steps = new ReactiveVar();
    templateObject.steps.set(true);
});

Template.importChartAccount.onRendered(()=>{
    GSTNonGSTData =function (type) {
        let taxRateService = new TaxRateService();
        let utilityService = new UtilityService();
        const filename = 'ChartOfAccounts'+'.csv';
        let rows =[] , tempArray = {gst : [] , nonGst : []} ;

        let isGST = type && type != '' && type == 'GST' ? true : false ;
        taxRateService.getChartOfAccounts().then(function (data) {

            rows[0]= ['*Code', '*Name','*Type','*Tax Code', 'Description', 'Dashboard', 'Expense Claims', 'Enable Payments', 'Balance'];


            data.taccount.forEach(function (e, i) {

                if(data.taccount[i].fields.AllowExpenseClaim === false || data.taccount[i].fields.IsHeader === false){
                    data.taccount[i].fields.AllowExpenseClaim = 'No';
                    data.taccount[i].fields.IsHeader = 'No';
                }
                else {
                    data.taccount[i].fields.AllowExpenseClaim = 'Yes';
                    data.taccount[i].fields.IsHeader = 'Yes';
                }
                var temp= data.taccount[i] ;

                if(isGST && temp && temp.fields && temp.fields.TaxCode && temp.fields.TaxCode.toLowerCase() == type.toLowerCase() ){
                        tempArray.gst.push([data.taccount[i].fields.AccountNumber,data.taccount[i].fields.AccountName, data.taccount[i].fields.AccountTypeName, data.taccount[i].fields.TaxCode, data.taccount[i].fields.Description, data.taccount[i].fields.IsHeader, data.taccount[i].fields.AllowExpenseClaim, 'No', '0.00']);

                    }else{
                    if(temp && temp.fields && temp.fields.TaxCode && temp.fields.TaxCode.toLowerCase() == 'gst'){

                    }else{
                        tempArray.nonGst.push([data.taccount[i].fields.AccountNumber,data.taccount[i].fields.AccountName, data.taccount[i].fields.AccountTypeName, data.taccount[i].fields.TaxCode, data.taccount[i].fields.Description, data.taccount[i].fields.IsHeader, data.taccount[i].fields.AllowExpenseClaim, 'No', '0.00']);

                    }

                    }

            });
            let finalArray = [] ;
            if(isGST){
                finalArray = [...rows, ...tempArray.gst];
            }else {
                finalArray = [...rows, ...tempArray.nonGst];
            }
            utilityService.exportToCsv(finalArray, filename, 'csv');
        });
    }
});
Template.importChartAccount.events({
    'click #bankLink': function () {
        let templateObject = Template.instance();
        templateObject.steps.set(false);
    },
    'click #myob, click #trueERP': function () {
        let templateObject = Template.instance();
        templateObject.steps.set(true);
    },
    'click #export-csv-GST': function () {
        GSTNonGSTData('GST');
    },
    'click #export-csv-Non-GST': function () {
        GSTNonGSTData();
    }
});
Template.importChartAccount.helpers({
    steps: () => {
        return Template.instance().steps.get();
    }
});