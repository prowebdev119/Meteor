import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
let _ = require('lodash');
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
let sideBarService = new SideBarService();
Template.invstockonhandanddemand.onCreated(()=>{
const templateObject = Template.instance();
templateObject.records = new ReactiveVar([]);
templateObject.dateAsAt = new ReactiveVar();
templateObject.deptrecords = new ReactiveVar();

templateObject.salesperc = new ReactiveVar();
templateObject.expenseperc = new ReactiveVar();
templateObject.salespercTotal = new ReactiveVar();
templateObject.expensepercTotal = new ReactiveVar();
templateObject.topTenData = new ReactiveVar([]);
});

Template.invstockonhandanddemand.onRendered(()=>{

  const templateObject = Template.instance();

  let topTenData1 = [];
  let topTenSuppData1 = [];
  let topData = this;

  getProductStock(function (data) {

    let currentDate = new Date();
    let currentMonthDate = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    let currentMonthData = [];
    let prevMonthData = [];
    let prevMonth2Data = [];
    let prevMonth3Data = [];
    let prevMonth4Data = [];
    let prevMonth5Data = [];
    let prevMonth6Data = [];
    let prevMonth7Data = [];
    let totalQuotePayment  = 0;
    let totalQuotePayment2  = 0;
    let totalQuotePayment3  = 0;
    let totalQuotePayment4  = 0;
    let totalQuotePayment5  = 0;
    let totalQuotePayment6  = 0;
    let totalQuotePayment7  = 0;
    let totalQuotePayment8  = 0;

    let totalSOPayment  = 0;
    let totalSOPayment2  = 0;
    let totalSOPayment3  = 0;
    let totalSOPayment4  = 0;
    let totalSOPayment5  = 0;
    let totalSOPayment6  = 0;
    let totalSOPayment7  = 0;
    let totalSOPayment8  = 0;

    let totalInvPayment  = 0;
    let totalInvPayment2  = 0;
    let totalInvPayment3  = 0;
    let totalInvPayment4  = 0;
    let totalInvPayment5  = 0;
    let totalInvPayment6  = 0;
    let totalInvPayment7  = 0;
    let totalInvPayment8  = 0;


    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentBeginDate.getMonth() + 1);
    let fromDateDay = currentBeginDate.getDate();
    if((currentBeginDate.getMonth()+1) < 10){
        fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
    }else{
      fromDateMonth = (currentBeginDate.getMonth()+1);
    }

    if(currentBeginDate.getDate() < 10){
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var fromDate = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-01";
    let currentMonth = moment().format("MMMM").substring(0, 3);
    let prevMonth = (moment().subtract(1, 'months')).format("MMMM").substring(0, 3);// Current date (date month and year)
    let prevMonth2 = (moment().subtract(2, 'months')).format("MMMM").substring(0, 3);
    let prevMonth3 = (moment().subtract(3, 'months')).format("MMMM").substring(0, 3);
    let prevMonth4 = (moment().subtract(4, 'months')).format("MMMM").substring(0, 3);
    let prevMonth5 = (moment().subtract(5, 'months')).format("MMMM").substring(0, 3);
    let prevMonth6 = (moment().subtract(6, 'months')).format("MMMM").substring(0, 3);
    let prevMonth7 = (moment().subtract(7, 'months')).format("MMMM").substring(0, 3);
    let prevMonth8 = (moment().subtract(8, 'months')).format("MMMM").substring(0, 3);
    let prevMonth9 = (moment().subtract(6, 'months')).format("MMMM").substring(0, 3);
    let prevMonth10 = (moment().subtract(9, 'months')).format("MMMM").substring(0, 3);
    let prevMonth11 = (moment().subtract(10, 'months')).format("MMMM").substring(0, 3);
    // let prevMonth12 = (moment().subtract(7, 'months')).format("YYYY-MM-DD");
    let prevMonth11Date = (moment().subtract(6, 'months')).format("YYYY-MM-DD");

    getVS1Data('TProductStocknSalePeriodReport').then(function (dataObject) {

      if(dataObject.length == 0){
        vs1chartService.getProductStocknSaleReportData(prevMonth11Date, fromDate).then((data) => {
          addVS1Data('TProductStocknSalePeriodReport',JSON.stringify(data));
          let month_1 = data.tproductstocknsaleperiodreport[0].TypeDesc_1||'';
          let month_2 = data.tproductstocknsaleperiodreport[0].TypeDesc_2||'';
          let month_3 = data.tproductstocknsaleperiodreport[0].TypeDesc_3||'';
          let month_4 = data.tproductstocknsaleperiodreport[0].TypeDesc_4||'';
          let month_5 = data.tproductstocknsaleperiodreport[0].TypeDesc_5||'';
          let month_6 = data.tproductstocknsaleperiodreport[0].TypeDesc_6||'';
          let month_7 = data.tproductstocknsaleperiodreport[0].TypeDesc_7||'';
          let month_8 = data.tproductstocknsaleperiodreport[0].TypeDesc_8||'';
          let month_9 = data.tproductstocknsaleperiodreport[0].TypeDesc_9||'';
          let month_10 = data.tproductstocknsaleperiodreport[0].TypeDesc_10||'';
          let month_11 = data.tproductstocknsaleperiodreport[0].TypeDesc_11||'';
          let month_12 = data.tproductstocknsaleperiodreport[0].TypeDesc_12||'';

          let month_1_onhand = data.tproductstocknsaleperiodreport[0].StockQty_1||0;
          let month_2_onhand = data.tproductstocknsaleperiodreport[0].StockQty_2||0;
          let month_3_onhand = data.tproductstocknsaleperiodreport[0].StockQty_3||0;
          let month_4_onhand = data.tproductstocknsaleperiodreport[0].StockQty_4||0;
          let month_5_onhand = data.tproductstocknsaleperiodreport[0].StockQty_5||0;
          let month_6_onhand = data.tproductstocknsaleperiodreport[0].StockQty_6||0;
          let month_7_onhand = data.tproductstocknsaleperiodreport[0].StockQty_7||0;
          let month_8_onhand = data.tproductstocknsaleperiodreport[0].StockQty_8||0;
          let month_9_onhand = data.tproductstocknsaleperiodreport[0].StockQty_9||0;
          let month_10_onhand = data.tproductstocknsaleperiodreport[0].StockQty_10||0;
          let month_11_onhand = data.tproductstocknsaleperiodreport[0].StockQty_11||0;
          let month_12_onhand = data.tproductstocknsaleperiodreport[0].StockQty_12||0;

          let month_1_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_1||0;
          let month_2_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_2||0;
          let month_3_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_3||0;
          let month_4_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_4||0;
          let month_5_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_5||0;
          let month_6_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_6||0;
          let month_7_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_7||0;
          let month_8_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_8||0;
          let month_9_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_9||0;
          let month_10_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_10||0;
          let month_11_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_11||0;
          let month_12_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_12||0;

           var data = {
                labels: [
                 month_1,
                 month_2,
                 month_3,
                 month_4,
                 month_5,
                 month_6,
                 month_7
               ],
                datasets: [
                  {
                    label: 'In Stock',
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    borderWidth: 2,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                  data:[
                    month_1_onhand,
                    month_2_onhand,
                    month_3_onhand,
                    month_4_onhand,
                    month_5_onhand,
                    month_6_onhand,
                    month_7_onhand
                  ],
                  order: 1
               },
               {
                 label: 'Shipped',
                 data:[
                   month_1_shipped,
                   month_2_shipped,
                   month_3_shipped,
                   month_4_shipped,
                   month_5_shipped,
                   month_6_shipped,
                   month_7_shipped
                  ],
                  type: 'line',
                  order: 2
               }]
             };

             var options = {
              maintainAspectRatio: false,
              responsive: true,
             scales: {
               yAxes: [{
                 stacked: true,
                 gridLines: {
                   display: true,
                   color: "rgba(255,99,132,0.2)"
                 }
               }],
               xAxes: [{
                 gridLines: {
                   display: false
                 }
               }]
             },
             onClick: chartClickEvent
             };

             Chart.Bar('chart', {
             options: options,
             data: data
             });
       });
      }else{
        let data = JSON.parse(dataObject[0].data);

        let useData = data.tproductstocknsaleperiodreport[0];
        let month_1 = useData.TypeDesc_1.replace('-', ' ')||'';
        let month_2 = useData.TypeDesc_2.replace('-', ' ')||'';
        let month_3 = useData.TypeDesc_3.replace('-', ' ')||'';
        let month_4 = useData.TypeDesc_4.replace('-', ' ')||'';
        let month_5 = useData.TypeDesc_5.replace('-', ' ')||'';
        let month_6 = useData.TypeDesc_6.replace('-', ' ')||'';
        let month_7 = useData.TypeDesc_7.replace('-', ' ')||'';
        let month_8 = useData.TypeDesc_8||'';
        let month_9 = useData.TypeDesc_9||'';
        let month_10 = useData.TypeDesc_10||'';
        let month_11 = useData.TypeDesc_11||'';
        let month_12 = useData.TypeDesc_12||'';

        let month_1_onhand = useData.StockQty_1||0;
        let month_2_onhand = useData.StockQty_2||0;
        let month_3_onhand = useData.StockQty_3||0;
        let month_4_onhand = useData.StockQty_4||0;
        let month_5_onhand = useData.StockQty_5||0;
        let month_6_onhand = useData.StockQty_6||0;
        let month_7_onhand = useData.StockQty_7||0;
        let month_8_onhand = useData.StockQty_8||0;
        let month_9_onhand = useData.StockQty_9||0;
        let month_10_onhand = useData.StockQty_10||0;
        let month_11_onhand = useData.StockQty_11||0;
        let month_12_onhand = useData.StockQty_12||0;

        let month_1_shipped = useData.SalesShipQty_1||0;
        let month_2_shipped = useData.SalesShipQty_2||0;
        let month_3_shipped = useData.SalesShipQty_3||0;
        let month_4_shipped = useData.SalesShipQty_4||0;
        let month_5_shipped = useData.SalesShipQty_5||0;
        let month_6_shipped = useData.SalesShipQty_6||0;
        let month_7_shipped = useData.SalesShipQty_7||0;
        let month_8_shipped = useData.SalesShipQty_8||0;
        let month_9_shipped = useData.SalesShipQty_9||0;
        let month_10_shipped = useData.SalesShipQty_10||0;
        let month_11_shipped = useData.SalesShipQty_11||0;
        let month_12_shipped = useData.SalesShipQty_12||0;

         var data = {
              labels: [
               month_1,
               month_2,
               month_3,
               month_4,
               month_5,
               month_6,
               month_7
             ],
              datasets: [
                {
                  label: 'In Stock',
                  backgroundColor: "rgba(255,99,132,0.2)",
                  borderColor: "rgba(255,99,132,1)",
                  borderWidth: 2,
                  hoverBackgroundColor: "rgba(255,99,132,0.4)",
                  hoverBorderColor: "rgba(255,99,132,1)",
                data:[
                  month_1_onhand,
                  month_2_onhand,
                  month_3_onhand,
                  month_4_onhand,
                  month_5_onhand,
                  month_6_onhand,
                  month_7_onhand
                ],
                order: 1
             },
             {
               label: 'Shipped',
               data:[
                 month_1_shipped,
                 month_2_shipped,
                 month_3_shipped,
                 month_4_shipped,
                 month_5_shipped,
                 month_6_shipped,
                 month_7_shipped
                ],
                type: 'line',
                order: 2
             }]
           };

           var options = {
            maintainAspectRatio: false,
            responsive: true,
           scales: {
             yAxes: [{
               stacked: true,
               gridLines: {
                 display: true,
                 color: "rgba(255,99,132,0.2)"
               }
             }],
             xAxes: [{
               gridLines: {
                 display: false
               }
             }]
           },
           onClick: chartClickEvent
           };

           Chart.Bar('chart', {
           options: options,
           data: data
           });
      }
    }).catch(function (err) {

      vs1chartService.getProductStocknSaleReportData(prevMonth11Date, fromDate).then((data) => {
        addVS1Data('TProductStocknSalePeriodReport',JSON.stringify(data));
        let month_1 = data.tproductstocknsaleperiodreport[0].TypeDesc_1||'';
        let month_2 = data.tproductstocknsaleperiodreport[0].TypeDesc_2||'';
        let month_3 = data.tproductstocknsaleperiodreport[0].TypeDesc_3||'';
        let month_4 = data.tproductstocknsaleperiodreport[0].TypeDesc_4||'';
        let month_5 = data.tproductstocknsaleperiodreport[0].TypeDesc_5||'';
        let month_6 = data.tproductstocknsaleperiodreport[0].TypeDesc_6||'';
        let month_7 = data.tproductstocknsaleperiodreport[0].TypeDesc_7||'';
        let month_8 = data.tproductstocknsaleperiodreport[0].TypeDesc_8||'';
        let month_9 = data.tproductstocknsaleperiodreport[0].TypeDesc_9||'';
        let month_10 = data.tproductstocknsaleperiodreport[0].TypeDesc_10||'';
        let month_11 = data.tproductstocknsaleperiodreport[0].TypeDesc_11||'';
        let month_12 = data.tproductstocknsaleperiodreport[0].TypeDesc_12||'';

        let month_1_onhand = data.tproductstocknsaleperiodreport[0].StockQty_1||0;
        let month_2_onhand = data.tproductstocknsaleperiodreport[0].StockQty_2||0;
        let month_3_onhand = data.tproductstocknsaleperiodreport[0].StockQty_3||0;
        let month_4_onhand = data.tproductstocknsaleperiodreport[0].StockQty_4||0;
        let month_5_onhand = data.tproductstocknsaleperiodreport[0].StockQty_5||0;
        let month_6_onhand = data.tproductstocknsaleperiodreport[0].StockQty_6||0;
        let month_7_onhand = data.tproductstocknsaleperiodreport[0].StockQty_7||0;
        let month_8_onhand = data.tproductstocknsaleperiodreport[0].StockQty_8||0;
        let month_9_onhand = data.tproductstocknsaleperiodreport[0].StockQty_9||0;
        let month_10_onhand = data.tproductstocknsaleperiodreport[0].StockQty_10||0;
        let month_11_onhand = data.tproductstocknsaleperiodreport[0].StockQty_11||0;
        let month_12_onhand = data.tproductstocknsaleperiodreport[0].StockQty_12||0;

        let month_1_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_1||0;
        let month_2_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_2||0;
        let month_3_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_3||0;
        let month_4_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_4||0;
        let month_5_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_5||0;
        let month_6_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_6||0;
        let month_7_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_7||0;
        let month_8_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_8||0;
        let month_9_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_9||0;
        let month_10_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_10||0;
        let month_11_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_11||0;
        let month_12_shipped = data.tproductstocknsaleperiodreport[0].SalesShipQty_12||0;

         var data = {
              labels: [
               month_1,
               month_2,
               month_3,
               month_4,
               month_5,
               month_6
             ],
              datasets: [
                {
                  label: 'In Stock',
                  backgroundColor: "rgba(255,99,132,0.2)",
                  borderColor: "rgba(255,99,132,1)",
                  borderWidth: 2,
                  hoverBackgroundColor: "rgba(255,99,132,0.4)",
                  hoverBorderColor: "rgba(255,99,132,1)",
                data:[
                  month_1_onhand,
                  month_2_onhand,
                  month_3_onhand,
                  month_4_onhand,
                  month_5_onhand,
                  month_6_onhand,
                  month_7_onhand
                ],
                order: 1
             },
             {
               label: 'Shipped',
               data:[
                 month_1_shipped,
                 month_2_shipped,
                 month_3_shipped,
                 month_4_shipped,
                 month_5_shipped,
                 month_6_shipped,
                 month_7_shipped
                ],
                type: 'line',
                order: 2
             }]
           };

           var options = {
            maintainAspectRatio: false,
            responsive: true,
           scales: {
             yAxes: [{
               stacked: true,
               gridLines: {
                 display: true,
                 color: "rgba(255,99,132,0.2)"
               }
             }],
             xAxes: [{
               gridLines: {
                 display: false
               }
             }]
           },
           onClick: chartClickEvent
           };

           Chart.Bar('chart', {
           options: options,
           data: data
           });
     });
    });



function chartClickEvent(event, array){
    if(array[0] != undefined){
      // var activePoints = array[0]['_model'].label;
         FlowRouter.go('/productsalesreport');
     }
}



  });

  function getProductStock(callback) {

      return new Promise((res, rej) => {
          // var salesBoardService = new SalesBoardService();

                callback('');



      });

  }

  });


  Template.invstockonhandanddemand.helpers({
    dateAsAt: () =>{
        return Template.instance().dateAsAt.get() || '-';
    },
    topTenData: () => {
          return Template.instance().topTenData.get();
    },
    Currency: () => {
          return Currency;
    },
    companyname: () =>{
        return loggedCompany;
    },
    salesperc: () =>{
        return Template.instance().salesperc.get() || 0;
    },
    expenseperc: () =>{
        return Template.instance().expenseperc.get() || 0;
    },
    salespercTotal: () =>{
        return Template.instance().salespercTotal.get() || 0;
    },
    expensepercTotal: () =>{
        return Template.instance().expensepercTotal.get() || 0;
    }
  });
  Template.registerHelper('equals', function (a, b) {
      return a === b;
  });

  Template.registerHelper('notEquals', function (a, b) {
      return a != b;
  });

  Template.registerHelper('containsequals', function (a, b) {
      return (a.indexOf(b) >= 0 );
  });
