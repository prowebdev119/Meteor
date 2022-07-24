import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
Template.monthlyearnings.onCreated(() => {
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

Template.monthlyearnings.onRendered(() => {

    const templateObject = Template.instance();

    let topTenData1 = [];
    let topTenSuppData1 = [];
    let topData = this;

//     setTimeout(function () {
//    let checkStatus = localStorage.getItem("earningschat") || true;
//       if(checkStatus == false || checkStatus == "false") {
//         $("#showearningchat").addClass('hideelement')
//         $('#hideearnings').text("Show");
//       } else {
//         $("#showearningchat").removeClass('hideelement')
//         $('#hideearnings').text("Hide");
//       }
//   },500);


      // function done(){
      //                 var url= myChart.toBase64Image();
      //                 document.getElementById("monthlyearnings_url").src=url;
      //                 setTimeout(function  (){
      //                      $('#myMonthlyEarningChart').hide();
      //                 },500)
                 
      //           };
    if (!localStorage.getItem('VS1SalesListReport_dash')) {
        getInvSales(function (data) {

            let currentDate = new Date();
            let currentMonthDate = currentDate.getMonth() + 1;
            let currentYear = currentDate.getFullYear();

            var currentDate2 = new Date();
            var dateFrom = new Date();
            var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
            let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + Math.floor(currentDate2.getMonth() + 1) + "-" + currentDate2.getDate();
            dateFrom.setMonth(dateFrom.getMonth() - 6);
            dateFrom = dateFrom.getFullYear() + '-' + ("0" + (dateFrom.getMonth() + 1)).slice(-2) + '-' + ("0" + (dateFrom.getDate())).slice(-2);
            $("#earnings").attr("href", "/agedreceivables?dateFrom=" + dateFrom + "&dateTo=" + getLoadDate);
            let currentMonthData = [];
            let prevMonthData = [];
            let prevMonth2Data = [];
            let prevMonth3Data = [];
            let prevMonth4Data = [];
            let prevMonth5Data = [];
            let prevMonth6Data = [];
            let prevMonth7Data = [];
            let totalPayment = 0;
            let totalPayment2 = 0;
            let totalPayment3 = 0;
            let totalPayment4 = 0;
            let totalPayment5 = 0;
            let totalPayment6 = 0;
            let totalPayment7 = 0;
            let totalPayment8 = 0;

            let totalPaymentSum = 0;
            let totalPayment2Sum = 0;
            let totalPayment3Sum = 0;
            let totalPayment4Sum = 0;
            let totalPayment5Sum = 0;
            let totalPayment6Sum = 0;
            let totalPayment7Sum = 0;
            let totalPayment8Sum = 0;
            var sessionmyEarnings = Session.get('myMonthlyErnings');

            if (sessionmyEarnings) {
                let filterData = _.filter(sessionmyEarnings.tarreport, function (sessionmyEarnings) {
                    return sessionmyEarnings.Name
                });

                let graphData = _.orderBy(filterData, 'DueDate');
                let initialData = _.filter(graphData, obj => (obj.DueDate !== ''));

                for (let l = 0; l < initialData.length; l++) {
                    let getMonth = new Date(initialData[l].DueDate).getMonth() + 1;
                    if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                        totalPayment += initialData[l].OriginalAmount;

                    } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                        totalPayment2 += initialData[l].OriginalAmount;

                    } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                        totalPayment3 += initialData[l].OriginalAmount;

                    } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                        totalPayment4 += initialData[l].OriginalAmount;

                    } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                        totalPayment5 += initialData[l].OriginalAmount;

                    } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                        totalPayment6 += initialData[l].OriginalAmount;

                    } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                        totalPayment7 += initialData[l].OriginalAmount;

                    } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                        totalPayment8 += initialData[l].OriginalAmount;

                    }
                }
            } else {

                setTimeout(function () {
                    let filterData = _.filter(sessionmyEarnings.tarreport, function (sessionmyEarnings) {
                        return sessionmyEarnings.Name
                    });

                    let graphData = _.orderBy(filterData, 'DueDate');
                    let initialData = _.filter(graphData, obj => (obj.DueDate !== ''));

                    for (let l = 0; l < initialData.length; l++) {
                        let getMonth = new Date(initialData[l].DueDate).getMonth() + 1;
                        if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                            totalPayment += initialData[l].OriginalAmount;

                        } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                            totalPayment2 += initialData[l].OriginalAmount;

                        } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                            totalPayment3 += initialData[l].OriginalAmount;

                        } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                            totalPayment4 += initialData[l].OriginalAmount;

                        } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                            totalPayment5 += initialData[l].OriginalAmount;

                        } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                            totalPayment6 += initialData[l].OriginalAmount;

                        } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                            totalPayment7 += initialData[l].OriginalAmount;

                        } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].DueDate).getFullYear()) {
                            totalPayment8 += initialData[l].OriginalAmount;

                        }
                    }
                }, 1000);
            }

            // topData.topTenData.set(data);
            let currentMonth = moment().format("MMMM").substring(0, 3);
            let prevMonth = (moment().subtract(1, 'months')).format("MMMM").substring(0, 3); // Current date (date month and year)
            let prevMonth2 = (moment().subtract(2, 'months')).format("MMMM").substring(0, 3);
            let prevMonth3 = (moment().subtract(3, 'months')).format("MMMM").substring(0, 3);
            let prevMonth4 = (moment().subtract(4, 'months')).format("MMMM").substring(0, 3);
            let prevMonth5 = (moment().subtract(5, 'months')).format("MMMM").substring(0, 3);
            let prevMonth6 = (moment().subtract(6, 'months')).format("MMMM").substring(0, 3);
            let prevMonth7 = (moment().subtract(7, 'months')).format("MMMM").substring(0, 3);

            totalPayment2Sum = totalPayment2 + totalPayment;
            totalPayment3Sum = totalPayment3 + totalPayment2 + totalPayment;
            totalPayment4Sum = totalPayment4 + totalPayment3 + totalPayment2 + totalPayment;
            totalPayment5Sum = totalPayment5 + totalPayment4 + totalPayment3 + totalPayment2 + totalPayment;
            totalPayment6Sum = totalPayment6 + totalPayment5 + totalPayment4 + totalPayment3 + totalPayment2 + totalPayment;
            totalPayment7Sum = totalPayment7 + totalPayment6 + totalPayment5 + totalPayment4 + totalPayment3 + totalPayment2 + totalPayment;
            totalPayment8Sum = totalPayment8 + totalPayment7 + totalPayment6 + totalPayment5 + totalPayment4 + totalPayment3 + totalPayment2 + totalPayment;

            var ctx = document.getElementById("myMonthlyEarningChart").getContext("2d");
            var myChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: [
                        prevMonth7,
                        prevMonth6,
                        prevMonth5,
                        prevMonth4,
                        prevMonth3,
                        prevMonth2,
                        prevMonth,
                        currentMonth
                    ],
                    datasets: [{
                            label: 'Earnings #' + this.name,
                            fill: true,
                            data: [
                                totalPayment,
                                totalPayment2,
                                totalPayment3,
                                totalPayment4,
                                totalPayment5,
                                totalPayment6,
                                totalPayment7,
                                totalPayment8
                            ],

                            backgroundColor: [
                                'rgba(0,163,211,0.41)',
                                'rgba(0,163,211,0.41)',
                                'rgba(0,163,211,0.41)',
                                'rgba(0,163,211,0.41)',
                                'rgba(0,163,211,0.41)',
                                'rgba(0,163,211,0.41)',
                                'rgba(0,163,211,0.41)',
                                'rgba(0,163,211,0.41)'
                            ],
                            borderColor: [
                                'rgba(78,115,223,0)',
                                'rgba(78,115,223,0)',
                                'rgba(78,115,223,0)',
                                'rgba(78,115,223,0)',
                                'rgba(78,115,223,0)',
                                'rgba(78,115,223,0)',
                                'rgba(78,115,223,0)',
                                'rgba(78,115,223,0)'
                            ],
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    'onClick': function (evt, item) {
                        //if(item[0]['_model'].label){
                        //  var activePoints = item[0]['_model'].label;
                        FlowRouter.go('/agedreceivables');
                        //}

                    },
                    maintainAspectRatio: false,
                    responsive: true,
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                return utilityService.modifynegativeCurrencyFormat(Math.abs(tooltipItem.yLabel)) || 0.00;

                            }
                        }
                    },
                    // bezierCurve : true,
                    // animation: {
                    //     onComplete: done
                    // },
                    "legend": {
                        "display": true
                    },
                    "title": {},
                    "scales": {
                        "xAxes": [{
                                "gridLines": {
                                    "color": "rgb(234, 236, 244)",
                                    "zeroLineColor": "rgb(234, 236, 244)",
                                    "drawBorder": false,
                                    "drawTicks": false,
                                    "borderDash": ["2"],
                                    "zeroLineBorderDash": ["2"],
                                    "drawOnChartArea": false
                                },
                                "ticks": {
                                    "fontColor": "#858796",
                                    "beginAtZero": true,
                                    "padding": 20
                                }
                            }
                        ],
                        "yAxes": [{
                                "gridLines": {
                                    "color": "rgb(234, 236, 244)",
                                    "zeroLineColor": "rgb(234, 236, 244)",
                                    "drawBorder": false,
                                    "drawTicks": false,
                                    "borderDash": ["2"],
                                    "zeroLineBorderDash": ["2"]
                                },
                                "ticks": {
                                    "fontColor": "#858796",
                                    "beginAtZero": true,
                                    "padding": 20
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
                let currentDate = new Date();
                let currentMonth = currentDate.getMonth() + 1;
                let currentYear = currentDate.getFullYear();
                let currentMonthData = [];
                let prevMonthData = [];
                let prevMonth2Data = [];
                let prevMonth3Data = [];
                let prevMonth4Data = [];
                let prevMonth5Data = [];
                let prevMonth6Data = [];
                let prevMonth7Data = [];
                let totalPayment = 0;
                let totalPayment2 = 0;
                let totalPayment3 = 0;
                let totalPayment4 = 0;
                let totalPayment5 = 0;
                let totalPayment6 = 0;
                let totalPayment7 = 0;
                let totalPayment8 = 0;
                var sessionmyExpenses = Session.get('myExpenses');
                let filterData = _.filter(sessionmyExpenses.tapreport, function (sessionmyExpenses) {
                    return sessionmyExpenses.Name
                });

                let graphData = _.orderBy(filterData, 'DueDate');
                let initialData = _.filter(graphData, obj => (obj.DueDate !== ''));
                callback(initialData);

            });

        }

    } else {
        let data = JSON.parse(localStorage.getItem('VS1SalesListReport_dash'));
        var currentDate2 = new Date();
        var dateFrom = new Date();
        var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
        let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + Math.floor(currentDate2.getMonth() + 1) + "-" + currentDate2.getDate();
        dateFrom.setMonth(dateFrom.getMonth() - 6);
        dateFrom = dateFrom.getFullYear() + '-' + ("0" + (dateFrom.getMonth() + 1)).slice(-2) + '-' + ("0" + (dateFrom.getDate())).slice(-2);
        $("#earnings").attr("href", "/agedreceivables?dateFrom=" + dateFrom + "&dateTo=" + getLoadDate);
        let monthData1 = data[0].fields.MONTH3.replace("-", " ") || '';
        let monthData2 = data[1].fields.MONTH3.replace("-", " ") || '';
        let monthData3 = data[2].fields.MONTH3.replace("-", " ") || '';
        let monthData4 = data[3].fields.MONTH3.replace("-", " ") || '';
        let monthData5 = data[4].fields.MONTH3.replace("-", " ") || '';
        let monthData6 = data[5].fields.MONTH3.replace("-", " ") || '';
        let monthData7 = data[6].fields.MONTH3.replace("-", " ") || '';

        let month_1_profit = 0;
        let month_2_profit = 0;
        let month_3_profit = 0;
        let month_4_profit = 0;
        let month_5_profit = 0;
        let month_6_profit = 0;
        let month_7_profit = 0;

        let totalInvPayment1 = data[0].fields.invoicetotal || 0;
        let totalInvPayment2 = data[1].fields.invoicetotal || 0;
        let totalInvPayment3 = data[2].fields.invoicetotal || 0;
        let totalInvPayment4 = data[3].fields.invoicetotal || 0;
        let totalInvPayment5 = data[4].fields.invoicetotal || 0;
        let totalInvPayment6 = data[5].fields.invoicetotal || 0;
        let totalInvPayment7 = data[6].fields.invoicetotal || 0;

        var ctx = document.getElementById("myMonthlyEarningChart").getContext("2d");
        var myChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    monthData1,
                    monthData2,
                    monthData3,
                    monthData4,
                    monthData5,
                    monthData6,
                    monthData7
                ],
                datasets: [{
                        label: 'Earnings #' + this.name,
                        fill: true,
                        data: [
                            totalInvPayment1,
                            totalInvPayment2,
                            totalInvPayment3,
                            totalInvPayment4,
                            totalInvPayment5,
                            totalInvPayment6,
                            totalInvPayment7
                        ],

                        backgroundColor: [
                            'rgba(0,163,211,0.41)',
                            'rgba(0,163,211,0.41)',
                            'rgba(0,163,211,0.41)',
                            'rgba(0,163,211,0.41)',
                            'rgba(0,163,211,0.41)',
                            'rgba(0,163,211,0.41)',
                            'rgba(0,163,211,0.41)',
                            'rgba(0,163,211,0.41)'
                        ],
                        borderColor: [
                            'rgba(78,115,223,0)',
                            'rgba(78,115,223,0)',
                            'rgba(78,115,223,0)',
                            'rgba(78,115,223,0)',
                            'rgba(78,115,223,0)',
                            'rgba(78,115,223,0)',
                            'rgba(78,115,223,0)',
                            'rgba(78,115,223,0)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                'onClick': function (evt, item) {
                    //if(item[0]['_model'].label){
                    //  var activePoints = item[0]['_model'].label;
                    FlowRouter.go('/agedreceivables');
                    //}

                },
                maintainAspectRatio: false,
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return utilityService.modifynegativeCurrencyFormat(Math.abs(tooltipItem.yLabel)) || 0.00;

                        }
                    }
                },
                
 // bezierCurve : true,
 //                        animation: {
 //                            onComplete: done
 //                        },
                "legend": {
                    "display": true
                },
                "title": {},
                "scales": {
                    "xAxes": [{
                            "gridLines": {
                                "color": "rgb(234, 236, 244)",
                                "zeroLineColor": "rgb(234, 236, 244)",
                                "drawBorder": false,
                                "drawTicks": false,
                                "borderDash": ["2"],
                                "zeroLineBorderDash": ["2"],
                                "drawOnChartArea": false
                            },
                            "ticks": {
                                "fontColor": "#858796",
                                "beginAtZero": true,
                                "padding": 20
                            }
                        }
                    ],
                    "yAxes": [{
                            "gridLines": {
                                "color": "rgb(234, 236, 244)",
                                "zeroLineColor": "rgb(234, 236, 244)",
                                "drawBorder": false,
                                "drawTicks": false,
                                "borderDash": ["2"],
                                "zeroLineBorderDash": ["2"]
                            },
                            "ticks": {
                                "fontColor": "#858796",
                                "beginAtZero": true,
                                "padding": 20
                            }
                        }
                    ]
                }
            }
        });

    }

});

Template.monthlyearnings.events({
  // 'click #hideearnings': function () {
  //  let check = localStorage.getItem("earningschat") || true;
  //   if(check == "true" || check == true) {
  //      // localStorage.setItem("earningschat",false);
  //      $("#hideearnings").text("Show");
  //   } else if($("#showearningschat").hasClass('hideearningschat')) {
  //      $("#hideearnings").text("Hide");
  //   }
  // }

})

Template.monthlyearnings.helpers({
    dateAsAt: () => {
        return Template.instance().dateAsAt.get() || '-';
    },
    topTenData: () => {
        return Template.instance().topTenData.get();
    },
    Currency: () => {
        return Currency;
    },
    companyname: () => {
        return loggedCompany;
    },
    salesperc: () => {
        return Template.instance().salesperc.get() || 0;
    },
    expenseperc: () => {
        return Template.instance().expenseperc.get() || 0;
    },
    salespercTotal: () => {
        return Template.instance().salespercTotal.get() || 0;
    },
    expensepercTotal: () => {
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
    return (a.indexOf(b) >= 0);
});
