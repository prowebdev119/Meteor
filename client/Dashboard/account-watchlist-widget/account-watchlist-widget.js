import { ReactiveVar } from 'meteor/reactive-var';
import { DashBoardService } from '../dashboard-service';
Template.accountWatchlistWidget.onCreated(()=>{
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar([]);

});

Template.accountWatchlistWidget.onRendered(()=>{
    let templateObject = Template.instance();
    let dashboardService= new DashBoardService();
    dashboardService.getAccountWatchlistData().then(function (data) {
        let record=[];
        let groupedRecord=[];
        let allRecords=[]
        for(let i=0;i<data.tdashboardaccountsummaryreport.length;i++){
            let recordObj={};
            recordObj.FinalOrder= data.tdashboardaccountsummaryreport[i].FinalOrder;
            recordObj.dataArr=[
                data.tdashboardaccountsummaryreport[i].Description,
                Currency+''+data.tdashboardaccountsummaryreport[i].Ex.toLocaleString(undefined, {maximumFractionDigits: 2}),
                Currency+''+ data.tdashboardaccountsummaryreport[i].Ex.toLocaleString(undefined, {maximumFractionDigits: 2}),
            ]
            record.push(recordObj);
        }
        record = _.groupBy(record, 'FinalOrder');
        for (let key in record) {
            let obj = [{key: key}, {data: record[key]}];
            allRecords.push(obj);
        }
        for(let i=0;i<allRecords.length;i++){
            let length=allRecords[i][1].data.length;
            let obj=allRecords[i][1].data[length-1].dataArr;
            groupedRecord.push(obj);
        }
        templateObject.records.set(groupedRecord);

    })
});

Template.accountWatchlistWidget.helpers({
    records: () => {
        return Template.instance().records.get();
    },

});

// Listen to event to update reactive variable
Template.accountWatchlistWidget.events({
    //to do
});
