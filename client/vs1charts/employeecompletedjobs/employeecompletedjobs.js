import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
import {SideBarService} from '../../js/sidebar-service';
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
let sideBarService = new SideBarService();
Template.employeecompletedjobs.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar([]);
    templateObject.dateAsAt = new ReactiveVar();
    templateObject.deptrecords = new ReactiveVar();
    templateObject.timesheetrecords = new ReactiveVar([]);
    templateObject.salesperc = new ReactiveVar();
    templateObject.expenseperc = new ReactiveVar();
    templateObject.salespercTotal = new ReactiveVar();
    templateObject.expensepercTotal = new ReactiveVar();
    templateObject.topTenData = new ReactiveVar([]);
});

Template.employeecompletedjobs.onRendered(() => {

    const templateObject = Template.instance();

    let topTenData1 = [];
    let topTenSuppData1 = [];
    const timeSheetList = [];
    let topData = this;

    templateObject.getAllTimeSheetDataClock = function () {
        getVS1Data('TTimeSheet').then(function (dataObject) {
            if (dataObject == 0) {
                sideBarService.getAllTimeSheetList().then(function (data) {
                    jobsCompleted = {};
                    let itemName = [];
                    let itemBalance = [];

                    max = '',
                    maxi = 0;
                    for (let timesheetInfo of data.ttimesheet) {
                        if(timesheetInfo.fields.InvoiceNotes == "completed") {
                        if (jobsCompleted[timesheetInfo.fields.EmployeeName]) {
                            jobsCompleted[timesheetInfo.fields.EmployeeName]++;
                        } else {
                            jobsCompleted[timesheetInfo.fields.EmployeeName] = 1;
                        }

                        if (maxi < jobsCompleted[timesheetInfo.fields.EmployeeName]) {
                            max = timesheetInfo;
                            maxi = jobsCompleted[timesheetInfo.fields.EmployeeName]
                        }
                    }
                }

                    var sortable = [];
                    for (var vehicle in jobsCompleted) {
                        let dataObj = {
                            name: vehicle,
                            jobscompleted: jobsCompleted[vehicle]
                        }
                        sortable.push(dataObj);
                    }

                    sortable.sort(function (a, b) {
                        return (b.jobscompleted > a.jobscompleted) ? 1 : -1;
                    });

                    for (let j = 0; j < 5; j++) {
                        itemName.push(sortable[j].name);
                        itemBalance.push(sortable[j].jobscompleted);
                    }

                    itemName.reverse();
                    itemBalance.reverse();

                    var ctx = document.getElementById("employeecompletedjobchart").getContext("2d");
                    var myChart = new Chart(ctx, {
                        type: 'horizontalBar',
                        data: {
                            labels: itemName,
                            datasets: [{
                                    label: 'Total #' + this.name,
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
                                }
                            ]
                        },
                        options: {
                            'onClick': function (evt, item) {
                                if (item[0]['_model'].label) {
                                    var activePoints = item[0]['_model'].label;
                                    // FlowRouter.go('/salesreport?contact=' + activePoints);
                                }

                            },
                            maintainAspectRatio: false,
                            responsive: true,
                            tooltips: {
                                callbacks: {
                                    label: function (tooltipItem, data) {
                                        return tooltipItem.xLabel;
                                    }
                                }
                            },
                            "legend": {
                                "display": false
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

                    $('.fullScreenSpin').css('display', 'none');

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                jobsCompleted = {};
                let itemName = [];
                let itemBalance = [];
                max = '',
                maxi = 0;
                for (let timesheetInfo of data.ttimesheet) {
                    if(timesheetInfo.fields.InvoiceNotes == "completed") {
                    if (jobsCompleted[timesheetInfo.fields.EmployeeName]) {
                        jobsCompleted[timesheetInfo.fields.EmployeeName]++;
                    } else {
                        jobsCompleted[timesheetInfo.fields.EmployeeName] = 1;
                    }

                    if (maxi < jobsCompleted[timesheetInfo.fields.EmployeeName]) {
                        max = timesheetInfo;
                        maxi = jobsCompleted[timesheetInfo.fields.EmployeeName]
                    }
                }
            }

                var sortable = [];
                for (var vehicle in jobsCompleted) {
                    let dataObj = {
                        name: vehicle,
                        jobscompleted: jobsCompleted[vehicle]
                    }
                    sortable.push(dataObj);
                }

                sortable.sort(function (a, b) {
                    return (b.jobscompleted > a.jobscompleted) ? 1 : -1;
                });


                for (let j = 0; j < 5; j++) {
                    itemName.push(sortable[j].name);
                    itemBalance.push(sortable[j].jobscompleted);
                }

                 itemName.reverse();
                 itemBalance.reverse();

                var ctx = document.getElementById("employeecompletedjobchart").getContext("2d");
                var myChart = new Chart(ctx, {
                    type: 'horizontalBar',
                    data: {
                        labels: itemName,
                        datasets: [{
                                label: 'Total #' + this.name,
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
                            }
                        ]
                    },
                    options: {
                        'onClick': function (evt, item) {
                            if (item[0]['_model'].label) {
                                var activePoints = item[0]['_model'].label;
                                // FlowRouter.go('/salesreport?contact=' + activePoints);
                            }

                        },
                        maintainAspectRatio: false,
                        responsive: true,
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    return tooltipItem.xLabel;
                                }
                            }
                        },
                        "legend": {
                            "display": false
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

                //let url = window.location.href;
                $('.fullScreenSpin').css('display', 'none');
            }
        }).catch(function (err) {
            sideBarService.getAllTimeSheetList().then(function (data) {
                jobsCompleted = {};
                let itemName = [];
                let itemBalance = [];

                max = '',
                maxi = 0;
                for (let timesheetInfo of data.ttimesheet) {
                    if(timesheetInfo.fields.InvoiceNotes == "completed") {
                    if (jobsCompleted[timesheetInfo.fields.EmployeeName]) {
                        jobsCompleted[timesheetInfo.fields.EmployeeName]++;
                    } else {
                        jobsCompleted[timesheetInfo.fields.EmployeeName] = 1;
                    }

                    if (maxi < jobsCompleted[timesheetInfo.fields.EmployeeName]) {
                        max = timesheetInfo;
                        maxi = jobsCompleted[timesheetInfo.fields.EmployeeName]
                    }
                }
            }

                var sortable = [];
                for (var vehicle in jobsCompleted) {
                    let dataObj = {
                        name: vehicle,
                        jobscompleted: jobsCompleted[vehicle]
                    }
                    sortable.push(dataObj);
                }

                sortable.sort(function (a, b) {
                    return (b.jobscompleted > a.jobscompleted) ? 1 : -1;
                });

                for (let j = 0; j < 5; j++) {
                    itemName.push(sortable[j].name);
                    itemBalance.push(sortable[j].jobscompleted);
                }

                itemName.reverse();
                itemBalance.reverse();

                var ctx = document.getElementById("employeecompletedjobchart").getContext("2d");
                var myChart = new Chart(ctx, {
                    type: 'horizontalBar',
                    data: {
                        labels: itemName,
                        datasets: [{
                                label: 'Total #' + this.name,
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
                            }
                        ]
                    },
                    options: {
                        'onClick': function (evt, item) {
                            if (item[0]['_model'].label) {
                                var activePoints = item[0]['_model'].label;
                                // FlowRouter.go('/salesreport?contact=' + activePoints);
                            }

                        },
                        maintainAspectRatio: false,
                        responsive: true,
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    return tooltipItem.xLabel;
                                }
                            }
                        },
                        "legend": {
                            "display": false
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

                $('.fullScreenSpin').css('display', 'none');

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });

    }

    templateObject.getAllTimeSheetDataClock();

});

Template.employeecompletedjobs.helpers({
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
    },
    timesheetrecords: () => {
        return Template.instance().timesheetrecords.get().sort(function (a, b) {
            if (a.employee == 'NA') {
                return 1;
            } else if (b.employee == 'NA') {
                return -1;
            }
            return (a.employee.toUpperCase() > b.employee.toUpperCase()) ? 1 : -1;
        });
    },
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
