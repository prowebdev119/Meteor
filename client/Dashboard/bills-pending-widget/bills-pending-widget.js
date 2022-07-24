import { ReactiveVar } from 'meteor/reactive-var';
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);
import {DashBoardService} from '../dashboard-service';
Template.billsPendingWidget.onCreated(function () {
    this.sumBillDraft = new ReactiveVar();
    this.totBillDraft = new ReactiveVar();
    this.sumBillPayment = new ReactiveVar();
    this.totBillPayment = new ReactiveVar();
    this.sumBillOverdue = new ReactiveVar();
    this.totBillOverdue = new ReactiveVar();
});

Template.billsPendingWidget.onRendered(()=>{
    const templateObj = Template.instance();
    var dashBoardService = new DashBoardService();
    drawChartBills();
    getOverdueBills();
    getDraftBills();

    function drawChartBills() {

        var arrayOfWeeks = [-14, -7, 0, 7, 14, 21];
        getChartData(arrayOfWeeks).then(chartData =>{
        // Date operations
        var currentDate = moment(); // Current date (date month and year)
        var weekStart = currentDate.clone().startOf('week').add(1, 'days'); // Week Start
        var weekEnd = currentDate.clone().endOf('week').add(1, 'days');
        var getBills = getOverdueBills(weekStart.toDate(), weekEnd.toDate());
            highCharts.chart('bills', {
                chart: {
                    type: 'column',
                    height: 145,
                    width: 460,
                    marginBottom: 25,
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: [
                        'Older',
                        changeWeekDays(-7, weekStart.toDate(), weekEnd.toDate()),
                        'This Week',
                        changeWeekDays(7, weekStart.toDate(), weekEnd.toDate()),
                        changeWeekDays(14, weekStart.toDate(), weekEnd.toDate()),
                        'Future',
                    ],
                    tickLength: 0,
                    crosshair: false,
                    labels: {
                        style: {
                            width: '65px',
                        },
                    }
                },
                yAxis: {
                    min: '',
                    title: {
                        text: ''
                    },
                    labels: {
                        style: {
                            fontSize: '0'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#FFFFFF',
                    useHTML:true,
                    formatter: function () {
                        return '<p style="border-bottom: 1px solid #eeeeee; padding-bottom: 10px;"><b>'+this.x +'</b></p>' +
                            '<p style="word-spacing: 30px;color: #657483;">'+this.series.name+' '+ Currency + parseFloat(chartData[this.point.index].awtpaymentTotal.toFixed(2)).toLocaleString()+'</p>';
                    },
                    positioner: function (width, height, point) {
                        return {
                            x: Math.max(this.chart.plotLeft, point.plotX - (width*1/2)),
                            y: (this.chart.plotTop - 10,  point.plotY - 60 ),
                        }
                    },

               },
                series: [{
                    name: 'Overdue',
                    data: [
                        chartData[0].awtpaymentTotal,
                        chartData[1].awtpaymentTotal,
                        {y:chartData[2].awtpaymentTotal,color:'#89d0f5'},
                        chartData[3].awtpaymentTotal,
                        chartData[4].awtpaymentTotal,
                        chartData[5].awtpaymentTotal
                    ],
                }],
                colors: ['#d6dade','#2cb6df'],
                legend: {
                    itemStyle: {
                        fontWeight: 'bold',
                        fontSize: '0'
                    }
                },
                plotOptions: {
                    candlestick: {
                        lineColor: '#404048'
                    },
                    column: {
                        pointPadding: 0
                    },series: {
                        pointWidth: 65,
                        colorByPoint:true
                    }
                },
            });
            jQuery("#billsPendingWidget").fadeOut("slow");
    });
    }

    function getAwaitingBills(data) {
        var awtbillTotal = 0;

        var sum_count3 = 0;
        for (var event3 in data) {
            var dataCopy3 = data[event3];
            for (var data3 in dataCopy3) {
                var mainData3 = dataCopy3[data3];
                awtbillTotal += mainData3.TotalAmountInc;
                sum_count3++;
            }
        }
        templateObj.sumBillPayment.set(sum_count3);
        templateObj.totBillPayment.set(Currency + '' +(parseFloat(awtbillTotal.toFixed(2))).toLocaleString());
    }

    function getChartData(daysToAdd) {
        return new Promise((res,rej) =>{
            dashBoardService.getAwaitingBills().then((data)=> {
                getAwaitingBills(data);
                data.tbill.sort(function(a,b){
                    return new Date(b.DueDate) - new Date(a.DueDate);
                });
                let mapResult = [];
                for(let i=0; i<daysToAdd.length; i++){
                    var currentDate = moment();// Current date (date month and year)
                    let weekStart = currentDate.clone().startOf('week').add(daysToAdd[i],'day'); // Week Start
                    let weekStartDate = weekStart.toDate();
                    let weekEnd = currentDate.clone().endOf('week').add(daysToAdd[i],'day');
                    let weekEndDate = weekEnd.toDate();

                    let awtpaymentTotal = 0;
                    let sum_count = 0;
                    if(i===0){
                        let lastDateOfPast = currentDate.clone().startOf('week').add(-8,'day').toDate();
                        for(let j=0; j<data.tbill.length; j++){
                            let dateToCompare = new Date(data.tbill[j].DueDate);
                            if(dateToCompare<=lastDateOfPast) {
                                awtpaymentTotal += data.tbill[j].TotalAmountInc;
                                sum_count++;
                            }
                        }
                    } else if(i===5){
                        let startDateOfFuture = currentDate.clone().startOf('week').add(21,'day').toDate();
                        for(let k=0; k<data.tbill.length; k++){
                            let dateToCompare = new Date(data.tbill[k].DueDate);
                            if(dateToCompare>=startDateOfFuture) {
                                awtpaymentTotal += data.tbill[k].TotalAmountInc;
                                sum_count++;
                            }
                        }
                    } else {
                        for (let l=0; l<data.tbill.length; l++) {
                            let dateToCompare = new Date(data.tbill[l].DueDate);
                            if ((dateToCompare >= weekStartDate) && (dateToCompare <= weekEndDate)) {
                                awtpaymentTotal += data.tbill[l].TotalAmountInc;
                                sum_count++;
                            }
                        }
                    }
                    let factor = Math.pow(10, 1);
                    awtpaymentTotal = Math.round(awtpaymentTotal * factor) / factor;

                    //awtpaymentTotal = awtpaymentTotal.toFixed(1);
                    let mapToChart = {awtpaymentTotal,sum_count};
                    mapResult.push(mapToChart);
                }
                res(mapResult);
            });
        })
    }

    function  getOverdueBills() {
        dashBoardService.getOverdueBills().then((data)=>{
            var overduebillTotal = 0;
            var sum_count4 = 0;
            for (var event4 in data) {
                var dataCopy4 = data[event4];
                for (var data4 in dataCopy4) {
                    var mainData4 = dataCopy4[data4];
                    overduebillTotal += mainData4.TotalAmountInc;
                    sum_count4++;
                }
            }

            templateObj.sumBillOverdue.set(sum_count4);
            templateObj.totBillOverdue.set(Currency + '' +(parseFloat(overduebillTotal.toFixed(2))).toLocaleString());
        });
    }

    function getDraftBills() {
        dashBoardService.getDraftBill().then((data)=>{
            var billdraftTotal = 0;
            var sum_count5 = 0;
            for (var event5 in data) {
                var dataCopy5 = data[event5];
                for (var data5 in dataCopy5) {
                    var mainData5 = dataCopy5[data5];
                    billdraftTotal += mainData5.TotalAmountInc;
                    
                    sum_count5++;
                }
            }
            templateObj.sumBillDraft.set(sum_count5);
            templateObj.totBillDraft.set(Currency + '' +(parseFloat((billdraftTotal.toFixed(2))).toLocaleString()));
        });
    }

    function getDate(getDateUnformatted){
        var dateObj = new Date(getDateUnformatted);
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        newdate = year + "-" + month + "-" + day;
        return newdate;
    }


    // Method to return week indications in the chart
    function changeWeekDays(days, startOfWeek, endOfWeek) {
        let months = new Array(12);
        months[0] = "Jan";
        months[1] = "Feb";
        months[2] = "Mar";
        months[3] = "Apr";
        months[4] = "May";
        months[5] = "Jun";
        months[6] = "Jul";
        months[7] = "Aug";
        months[8] = "Sep";
        months[9] = "Oct";
        months[10] = "Nov";
        months[11] = "Dec";
        let weekStartDay = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate()- weekStartDay+ days);
        endOfWeek.setDate(endOfWeek.getDate()- weekStartDay+ days);
        let weekStartMonth = months[startOfWeek.getMonth()],
            weekEndMonth =  months[endOfWeek.getMonth()],
            weekResult = (weekStartMonth === weekEndMonth) ? ((startOfWeek.getDate()+'-'+endOfWeek.getDate())+' '+weekStartMonth) : ((startOfWeek.getDate()+' '+ weekStartMonth +'-'+endOfWeek.getDate())+' '+ weekEndMonth );
        return weekResult;
    }
});

Template.billsPendingWidget.helpers({
    sumBillDraft :  function() {
        return Template.instance().sumBillDraft.get();
    },
    totBillDraft :  function() {
        return Template.instance().totBillDraft.get();
    },
    sumBillPayment :  function() {
        return Template.instance().sumBillPayment.get();
    },
    totBillPayment :  function() {
        return Template.instance().totBillPayment.get();
    },
    sumBillOverdue :  function() {
        return Template.instance().sumBillOverdue.get();
    },
    totBillOverdue :  function() {
        return Template.instance().totBillOverdue.get();
    }
});

// Listen to event to update reactive variable
Template.billsPendingWidget.events({
    //to do
});
