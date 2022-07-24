import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import { SideBarService } from '../../js/sidebar-service';
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
let sideBarService = new SideBarService();
Template.quotedinvoicedamounts.onCreated(() => {
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

Template.quotedinvoicedamounts.onRendered(() => {

    const templateObject = Template.instance();

    let topTenData1 = [];
    let topTenSuppData1 = [];
    let topData = this;

    let checkStatus = localStorage.getItem("quotedinvoicedchart") || true;
    //   if(checkStatus == false || checkStatus == "false") {
    //     $("#quotedinvoicedamount").addClass('hideelement');
    //     $('#hidesales1').text("Show");
    //   } else {
    //     $("#quotedinvoicedamount").removeClass('hideelement');
    //     $('#hidesales1').text("Hide");
    //   }

              // function done(){
              //         var url= myChart.toBase64Image();
              //         document.getElementById("quotedinvoice_url").src=url;
              //         setTimeout(function  (){
              //              $('#quotedinvoicedamounts').hide();
              //         },500)

              //   };

        if (!localStorage.getItem('VS1SalesListReport_dash')) {
        let currentDate = new Date();
        let currentMonthDate = currentDate.getMonth() + 1;
        let currentYear = currentDate.getFullYear();
        var currentDate2 = new Date();
        var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
        var dateFrom = new Date();
        dateFrom.setMonth(dateFrom.getMonth() - 6);
        dateFrom = dateFrom.getFullYear() + '-' + ("0" + (dateFrom.getMonth() + 1)).slice(-2) + '-' + ("0" + (dateFrom.getDate())).slice(-2);
        $("#sales1").attr("href", "/salesreport?dateFrom=" + dateFrom + "&dateTo=" + getLoadDate);
        let currentMonthData = [];
        let prevMonthData = [];
        let prevMonth2Data = [];
        let prevMonth3Data = [];
        let prevMonth4Data = [];
        let prevMonth5Data = [];
        let prevMonth6Data = [];
        let prevMonth7Data = [];
        let totalQuotePayment = 0;
        let totalQuotePayment2 = 0;
        let totalQuotePayment3 = 0;
        let totalQuotePayment4 = 0;
        let totalQuotePayment5 = 0;
        let totalQuotePayment6 = 0;
        let totalQuotePayment7 = 0;
        let totalQuotePayment8 = 0;

        let totalSOPayment = 0;
        let totalSOPayment2 = 0;
        let totalSOPayment3 = 0;
        let totalSOPayment4 = 0;
        let totalSOPayment5 = 0;
        let totalSOPayment6 = 0;
        let totalSOPayment7 = 0;
        let totalSOPayment8 = 0;

        let totalInvPayment = 0;
        let totalInvPayment2 = 0;
        let totalInvPayment3 = 0;
        let totalInvPayment4 = 0;
        let totalInvPayment5 = 0;
        let totalInvPayment6 = 0;
        let totalInvPayment7 = 0;
        let totalInvPayment8 = 0
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
   var toDate = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
   let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");
            getVS1Data('TSalesList').then(function (dataObject) {
            if (dataObject.length == 0) {

               sideBarService.getSalesListData(prevMonth11Date,toDate, false,initialReportLoad,0).then((data) => {

                    let filterData = _.filter(data.tsaleslist, function (data) {
                        return data.CustomerName
                    });

                    let graphData = _.orderBy(filterData, 'SaleDate');
                    let initialData = _.filter(graphData, obj => (obj.SaleDate !== ''));
                    for (let l = 0; l < initialData.length; l++) {

                        let getMonth = new Date(initialData[l].SaleDate).getMonth() + 1;
                        if (initialData[l].Type === "Quote") {
                            if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalQuotePayment += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalQuotePayment2 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalQuotePayment3 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalQuotePayment4 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalQuotePayment5 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalQuotePayment6 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalQuotePayment7 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalQuotePayment8 += initialData[l].TotalAmountinc;

                            }
                        } else if (initialData[l].Type === "Sales Order") {
                            if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalSOPayment += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalSOPayment2 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalSOPayment3 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalSOPayment4 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalSOPayment5 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalSOPayment6 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalSOPayment7 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalSOPayment8 += initialData[l].TotalAmountinc;

                            }
                        } else if (initialData[l].Type === "Invoice") {
                            if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalInvPayment += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalInvPayment2 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalInvPayment3 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalInvPayment4 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalInvPayment5 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalInvPayment6 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalInvPayment7 += initialData[l].TotalAmountinc;

                            } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                                totalInvPayment8 += initialData[l].TotalAmountinc;

                            }
                        }

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

                    var ctx = document.getElementById("quotedinvoicedamounts").getContext("2d");
                    var myChart = new Chart(ctx, {
                        type: 'line',
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
                                    "label": "Quotes",
                                    "fill": true,
                                    "data": [
                                        totalQuotePayment8,
                                        totalQuotePayment7,
                                        totalQuotePayment6,
                                        totalQuotePayment5,
                                        totalQuotePayment4,
                                        totalQuotePayment3,
                                        totalQuotePayment2,
                                        totalQuotePayment
                                    ],
                                    "backgroundColor": "rgba(28,200,138,0.16)",
                                    "borderColor": "#1cc88a"
                                }, {
                                    "label": "Invoices",
                                    "fill": true,
                                    "data": [
                                        totalInvPayment8,
                                        totalInvPayment7,
                                        totalInvPayment6,
                                        totalInvPayment5,
                                        totalInvPayment4,
                                        totalInvPayment3,
                                        totalInvPayment2,
                                        totalInvPayment
                                    ],
                                    "borderColor": "#f6c23e",
                                    "backgroundColor": "rgba(246,194,62,0.17)"
                                }
                            ]
                        },
                        options: {

                            maintainAspectRatio: false,
                            responsive: true,
                            tooltips: {
                                callbacks: {
                                    label: function (tooltipItem, data) {
                                        return utilityService.modifynegativeCurrencyFormat(Math.abs(tooltipItem.yLabel)) || 0.00;

                                    }
                                }
                            },
                        //      bezierCurve : true,
                        // animation: {
                        //     onComplete: done
                        // },
                            "legend": {
                                "display": true,
                                "position": "bottom",
                            },
                            onClick: chartClickEvent,
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
                                            "padding": 20
                                        }
                                    }
                                ]
                            }
                        }
                    });

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tsaleslist;
                let filterData = _.filter(useData, function (data) {
                    return data.CustomerName
                });

                let graphData = _.orderBy(filterData, 'SaleDate');
                let initialData = _.filter(graphData, obj => (obj.SaleDate !== ''));
                for (let l = 0; l < initialData.length; l++) {

                    let getMonth = new Date(initialData[l].SaleDate).getMonth() + 1;
                    let getYear = new Date(initialData[l].SaleDate).getFullYear();
                    if (initialData[l].Type === "Quote") {

                        if ((parseFloat(getMonth) === parseFloat(currentMonthDate)) && (parseFloat(currentYear) === parseFloat(getYear))) {
                            totalQuotePayment += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment2 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment3 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment4 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment5 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment6 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment7 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment8 += initialData[l].TotalAmountinc;

                        }
                    } else if (initialData[l].Type === "Sales Order") {
                        if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment2 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment3 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment4 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment5 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment6 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment7 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment8 += initialData[l].TotalAmountinc;

                        }
                    } else if (initialData[l].Type === "Invoice") {
                        if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment2 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment3 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment4 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment5 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment6 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment7 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment8 += initialData[l].TotalAmountinc;

                        }
                    }

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
                var ctx = document.getElementById("quotedinvoicedamounts").getContext("2d");
                var myChart = new Chart(ctx, {
                    type: 'line',
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
                                "label": "Quotes",
                                "fill": true,
                                "data": [
                                    totalQuotePayment8,
                                    totalQuotePayment7,
                                    totalQuotePayment6,
                                    totalQuotePayment5,
                                    totalQuotePayment4,
                                    totalQuotePayment3,
                                    totalQuotePayment2,
                                    totalQuotePayment
                                ],
                                "backgroundColor": "rgba(28,200,138,0.16)",
                                "borderColor": "#1cc88a"
                            }, {
                                "label": "Invoices",
                                "fill": true,
                                "data": [
                                    totalInvPayment8,
                                    totalInvPayment7,
                                    totalInvPayment6,
                                    totalInvPayment5,
                                    totalInvPayment4,
                                    totalInvPayment3,
                                    totalInvPayment2,
                                    totalInvPayment
                                ],
                                "borderColor": "#f6c23e",
                                "backgroundColor": "rgba(246,194,62,0.17)"
                            }
                        ]
                    },
                    options: {

                        maintainAspectRatio: false,
                        responsive: true,
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    return utilityService.modifynegativeCurrencyFormat(Math.abs(tooltipItem.yLabel)) || 0.00;

                                }
                            }
                        },
                        //  bezierCurve : true,
                        // animation: {
                        //   onComplete: done
                        // },
                        "legend": {
                            "display": true,
                            "position": "bottom",
                        },
                        onClick: chartClickEvent,
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
                                        "padding": 20
                                    }
                                }
                            ]
                        }
                    }
                });

            }
        }).catch(function (err) {
           sideBarService.getSalesListData(prevMonth11Date,toDate, false,initialReportLoad,0).then((data) => {

                let filterData = _.filter(data.tsaleslist, function (data) {
                    return data.CustomerName
                });

                let graphData = _.orderBy(filterData, 'SaleDate');
                let initialData = _.filter(graphData, obj => (obj.SaleDate !== ''));
                for (let l = 0; l < initialData.length; l++) {

                    let getMonth = new Date(initialData[l].SaleDate).getMonth() + 1;
                    if (initialData[l].Type === "Quote") {
                        if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment2 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment3 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment4 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment5 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment6 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment7 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalQuotePayment8 += initialData[l].TotalAmountinc;

                        }
                    } else if (initialData[l].Type === "Sales Order") {
                        if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment2 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment3 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment4 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment5 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment6 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment7 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalSOPayment8 += initialData[l].TotalAmountinc;

                        }
                    } else if (initialData[l].Type === "Invoice") {
                        if (getMonth === currentMonthDate && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 1) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment2 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 2) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment3 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 3) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment4 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 4) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment5 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 5) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment6 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 6) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment7 += initialData[l].TotalAmountinc;

                        } else if (getMonth === (currentMonthDate - 7) && currentYear === new Date(initialData[l].SaleDate).getFullYear()) {
                            totalInvPayment8 += initialData[l].TotalAmountinc;

                        }
                    }

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

                var ctx = document.getElementById("quotedinvoicedamounts").getContext("2d");
                var myChart = new Chart(ctx, {
                    type: 'line',
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
                                "label": "Quotes",
                                "fill": true,
                                "data": [
                                    totalQuotePayment8,
                                    totalQuotePayment7,
                                    totalQuotePayment6,
                                    totalQuotePayment5,
                                    totalQuotePayment4,
                                    totalQuotePayment3,
                                    totalQuotePayment2,
                                    totalQuotePayment
                                ],
                                "backgroundColor": "rgba(28,200,138,0.16)",
                                "borderColor": "#1cc88a"
                            }, {
                                "label": "Invoices",
                                "fill": true,
                                "data": [
                                    totalInvPayment8,
                                    totalInvPayment7,
                                    totalInvPayment6,
                                    totalInvPayment5,
                                    totalInvPayment4,
                                    totalInvPayment3,
                                    totalInvPayment2,
                                    totalInvPayment
                                ],
                                "borderColor": "#f6c23e",
                                "backgroundColor": "rgba(246,194,62,0.17)"
                            }
                        ]
                    },
                    options: {

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
                            "display": true,
                            "position": "bottom",
                        },
                        onClick: chartClickEvent,
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
                                        "padding": 20
                                    }
                                }
                            ]
                        }
                    }
                });

            });
        });
    } else {
        let data = JSON.parse(localStorage.getItem('VS1SalesListReport_dash'));
        var currentDate2 = new Date();
        var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
        var dateFrom = new Date();
        dateFrom.setMonth(dateFrom.getMonth() - 6);
        dateFrom = dateFrom.getFullYear() + '-' + ("0" + (dateFrom.getMonth() + 1)).slice(-2) + '-' + ("0" + (dateFrom.getDate())).slice(-2);
        $("#sales1").attr("href", "/salesreport?dateFrom=" + dateFrom + "&dateTo=" + getLoadDate);
        let monthData1 = data[0].fields.MONTH3.replace("-", " ") || '';
        let monthData2 = data[1].fields.MONTH3.replace("-", " ") || '';
        let monthData3 = data[2].fields.MONTH3.replace("-", " ") || '';
        let monthData4 = data[3].fields.MONTH3.replace("-", " ") || '';
        let monthData5 = data[4].fields.MONTH3.replace("-", " ") || '';
        let monthData6 = data[5].fields.MONTH3.replace("-", " ") || '';
        let monthData7 = data[6].fields.MONTH3.replace("-", " ") || '';

        let totalQuotePayment1 = data[0].fields.quotetotal || 0;
        let totalQuotePayment2 = data[1].fields.quotetotal || 0;
        let totalQuotePayment3 = data[2].fields.quotetotal || 0;
        let totalQuotePayment4 = data[3].fields.quotetotal || 0;
        let totalQuotePayment5 = data[4].fields.quotetotal || 0;
        let totalQuotePayment6 = data[5].fields.quotetotal || 0;
        let totalQuotePayment7 = data[6].fields.quotetotal || 0;

        let totalInvPayment1 = data[0].fields.invoicetotal || 0;
        let totalInvPayment2 = data[1].fields.invoicetotal || 0;
        let totalInvPayment3 = data[2].fields.invoicetotal || 0;
        let totalInvPayment4 = data[3].fields.invoicetotal || 0;
        let totalInvPayment5 = data[4].fields.invoicetotal || 0;
        let totalInvPayment6 = data[5].fields.invoicetotal || 0;
        let totalInvPayment7 = data[6].fields.invoicetotal || 0;

        // for (let l = 0; l < data.length; l++) {
        //
        // }

        var ctx = document.getElementById("quotedinvoicedamounts").getContext("2d");
        var myChart = new Chart(ctx, {
            type: 'line',
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
                        "label": "Quoted Amounts",
                        "fill": true,
                        "data": [
                            totalQuotePayment1,
                            totalQuotePayment2,
                            totalQuotePayment3,
                            totalQuotePayment4,
                            totalQuotePayment5,
                            totalQuotePayment6,
                            totalQuotePayment7
                        ],
                        "backgroundColor": "rgba(28,200,138,0.16)",
                        "borderColor": "#1cc88a"
                    }, {
                        "label": "Invoiced Amounts",
                        "fill": true,
                        "data": [
                            totalInvPayment1,
                            totalInvPayment2,
                            totalInvPayment3,
                            totalInvPayment4,
                            totalInvPayment5,
                            totalInvPayment6,
                            totalInvPayment7
                        ],
                        "borderColor": "#f6c23e",
                        "backgroundColor": "rgba(246,194,62,0.17)"
                    }
                ]
            },
            options: {

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
                //         animation: {
                //             onComplete: done
                //         },
                "legend": {
                    "display": true,
                    "position": "bottom",
                    "reverse": false
                },
                onClick: chartClickEvent,
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
                                "padding": 20
                            }
                        }
                    ]
                }
            }
        });
    }

    function chartClickEvent(event, array) {
        if (array[0] != undefined) {
            var activePoints = item[0]['_model'].label;
            FlowRouter.go('/agedpayables?month=' + activePoints);
        }
    }
});

Template.quotedinvoicedamounts.events({
  'click #hidesales1': function () {
    let check = localStorage.getItem("quotedinvoicedchart") || true;
    if(check == "true" || check == true) {
       $("#hidesales1").text("Show");
    } else {
       $("#hidesales1").text("Hide");
    }
  }

})

Template.quotedinvoicedamounts.helpers({
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
