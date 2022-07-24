import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
Template.resalescomparision.onCreated(()=>{
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

Template.resalescomparision.onRendered(()=>{

  const templateObject = Template.instance();

  let topTenData1 = [];
  let topTenSuppData1 = [];
  let topData = this;

   let checkStatus = localStorage.getItem("resaleschat") || true;

      if(checkStatus == false || checkStatus == "false") {
        $("#resalecomparision").addClass('hideelement');
        $('#resalehide').text("Show");
      } else {
        $("#resalecomparision").removeClass('hideelement');
        $('#resalehide').text("Hide");
      }

      // function done(){
      //                 var url= myChart.toBase64Image();
      //                 document.getElementById("comparison_url").src=url;
      //                 setTimeout(function  (){
      //                      $('#myChartCustomer').hide();
      //                 },500)
                 
      //           };

if (!localStorage.getItem('VS1SalesEmpReport_dash')) {
  getInvSales(function (data) {

      topTenData1 = _.take(data, 5);
      let totalBalance = 0;
      let itemName = [];
      let itemBalance = [];
      topTenData1.map(function (item) {
          item.totalbalance = +parseFloat(item.totalbalance).toFixed(2);
          if(item.totalbalance >0){
          itemName.push(item.name);
          itemBalance.push(item.totalbalance);
          }
          // itemName.push(item.name);
          // itemBalance.push(item.totalbalance);
      });
      let otherData = _.difference(data, topTenData1, _.isEqual);

      let totalPayment  = 0;
      let overDuePayment = 0;

      // topData.topTenData.set(data);

      templateObject.topTenData.set(topTenData1);
      var ctx = document.getElementById("myChartCustomer").getContext("2d");
      var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
        labels: itemName,
        datasets: [{
        label: 'Amount #'+ this.name,
        data: itemBalance,

        backgroundColor: [
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e',
        '#f6c23e'
        ],
        borderColor: [
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)',
        'rgba(78,115,223,0)'
        ],
        borderWidth: 1
        }]
        },
        options: {
          'onClick' : function (evt, item) {
            if(item[0]['_model'].label){
              var activePoints = item[0]['_model'].label;
              FlowRouter.go('/salesreport?contact=' + activePoints);
            }

          },
          maintainAspectRatio: false,
          responsive: true,
        tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                return utilityService.modifynegativeCurrencyFormat(tooltipItem.xLabel)|| 0.00;
                // Currency + Number(tooltipItem.xLabel).toFixed(2).replace(/./g, function(c, i, a) {
                //     return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
                // });
            }
        }
    },
     // bezierCurve : true,
     //                    animation: {
     //                        onComplete: done
     //                    },
        "legend":{
        "display":false
        },
        "title":{},
        "scales":{
        "xAxes":[
        {"gridLines":{
        "color":"rgb(234, 236, 244)",
        "zeroLineColor":"rgb(234, 236, 244)",
        "drawBorder":false,
        "drawTicks":false,
        "borderDash":["2"],
        "zeroLineBorderDash":["2"],
        "drawOnChartArea":false},
        "ticks":{
        "fontColor":"#858796",
        "beginAtZero":true,
        "padding":20}}],
        "yAxes":[{
        "gridLines":{"color":"rgb(234, 236, 244)",
        "zeroLineColor":"rgb(234, 236, 244)",
        "drawBorder":false,
        "drawTicks":false,
        "borderDash":["2"],
        "zeroLineBorderDash":["2"]},
        "ticks":{
        "fontColor":"#858796",
        "beginAtZero":true,
        "padding":20
        }
        }
        ]
        }
        }
        });
  });

  function getInvSales(callback) {

      return new Promise((res, rej) => {
          // var salesBoardService = new SalesBoardService();
          vs1chartService.getInvSaleByEmployee().then((data) => {
              // templateObject.getAllData(data);
              let filterData =  _.filter(data.tinvoiceex, function (data) {
                  return (!data.deleted)
              });
              let filterDueDateData = _.filter(filterData, function (data) {
                  return data.EmployeeName
              });

              let groupData = _.omit(_.groupBy(filterDueDateData, 'EmployeeName'), ['']);
              let totalAmountCalculation = _.map(groupData, function (value, key) {
                  let totalPayment  = 0;
                  let overDuePayment = 0;
                  for(let i=0; i<value.length;i++) {
                          totalPayment += value[i].TotalAmountInc;
                  }
                  let userObject = {};
                  userObject.name = key;
                  userObject.totalbalance =  totalPayment;
                  return userObject;

              });

              let sortedArray = [];
              sortedArray = totalAmountCalculation.sort(function (a, b) {
                  return b.totalbalance - a.totalbalance;
              });
              if (callback) {
                  callback(sortedArray);
              }


          });

      });

  }

}else{
  let data = JSON.parse(localStorage.getItem('VS1SalesEmpReport_dash'));

  topTenData1 = _.take(data, 5);
  let totalBalance = 0;
  let itemName = [];
  let itemBalance = [];
  topTenData1.map(function (item) {
      item.fields.Totalsales = +parseFloat(item.fields.Totalsales).toFixed(2);
      if(item.fields.Totalsales >0){
      itemName.push(item.fields.employeename);
      itemBalance.push(item.fields.Totalsales);
      }
      // itemName.push(item.name);
      // itemBalance.push(item.totalbalance);
  });
  let otherData = _.difference(data, topTenData1, _.isEqual);

  let totalPayment  = 0;
  let overDuePayment = 0;

  // topData.topTenData.set(data);

  templateObject.topTenData.set(topTenData1);
  var ctx = document.getElementById("myChartCustomer").getContext("2d");
  var myChart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
    labels: itemName,
    datasets: [{
    label: 'Amount #'+ this.name,
    data: itemBalance,

    backgroundColor: [
    '#f6c23e',
    '#f6c23e',
    '#f6c23e',
    '#f6c23e',
    '#f6c23e',
    '#f6c23e'
    ],
    borderColor: [
    'rgba(78,115,223,0)',
    'rgba(78,115,223,0)',
    'rgba(78,115,223,0)',
    'rgba(78,115,223,0)',
    'rgba(78,115,223,0)',
    'rgba(78,115,223,0)'
    ],
    borderWidth: 1
    }]
    },
    options: {
      'onClick' : function (evt, item) {
        if(item[0]['_model'].label){
          var activePoints = item[0]['_model'].label;
          FlowRouter.go('/salesreport?contact=' + activePoints);
        }

      },
      maintainAspectRatio: false,
      responsive: true,
    tooltips: {
    callbacks: {
        label: function(tooltipItem, data) {
            return utilityService.modifynegativeCurrencyFormat(tooltipItem.xLabel)|| 0.00;
        }
    }
},
 // bezierCurve : true,
 //                        animation: {
 //                            onComplete: done
 //                        },
    "legend":{
    "display":false
    },
    "title":{},
    "scales":{
    "xAxes":[
    {"gridLines":{
    "color":"rgb(234, 236, 244)",
    "zeroLineColor":"rgb(234, 236, 244)",
    "drawBorder":false,
    "drawTicks":false,
    "borderDash":["2"],
    "zeroLineBorderDash":["2"],
    "drawOnChartArea":false},
    "ticks":{
    "fontColor":"#858796",
    "beginAtZero":true,
    "padding":20}}],
    "yAxes":[{
    "gridLines":{"color":"rgb(234, 236, 244)",
    "zeroLineColor":"rgb(234, 236, 244)",
    "drawBorder":false,
    "drawTicks":false,
    "borderDash":["2"],
    "zeroLineBorderDash":["2"]},
    "ticks":{
    "fontColor":"#858796",
    "beginAtZero":true,
    "padding":20
    }
    }
    ]
    }
    }
    });
}

  });
  
  Template.resalescomparision.events({
  // 'click #resalehide': function () {
  //  let check = localStorage.getItem("hideresalechat") || true;
  //   if(check == "true" || check == true) {
  //      // localStorage.setItem("resaleschat",false);
  //     $("#resalehide").text("Show");
  //   } else {
  //      $("#resalehide").text("Hide");
  //      // localStorage.setItem("resaleschat",true);
  //   }
  // }

})

  Template.resalescomparision.helpers({
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
