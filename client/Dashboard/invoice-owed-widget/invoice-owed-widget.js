import { ReactiveVar } from 'meteor/reactive-var';
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);
import {DashBoardService} from '../dashboard-service';
Template.invoiceOwedWidget.onCreated(()=>{
    const templateObj = Template.instance();
    templateObj.sumDraft = new ReactiveVar();
    templateObj.totDraft = new ReactiveVar();
    templateObj.sumAwtPayment = new ReactiveVar();
    templateObj.totAwtPayment = new ReactiveVar();
    templateObj.sumOverdue = new ReactiveVar();
    templateObj.totOverdue = new ReactiveVar();
});

Template.invoiceOwedWidget.onRendered(()=>{
    const templateObject = Template.instance();
    var dashBoardService = new DashBoardService();
    drawChartInvoice();
    getOverduePayments();
    getDrafts();

    function drawChartInvoice() {
        var arrayOfWeeks = [-14,-7,0,7,14,21];
        getChartData(arrayOfWeeks).then(dataObj =>{
        // Date operations
        var currentDate = moment(); // Current date (date month and year)
        var weekStart = currentDate.clone().startOf('week').add(1, 'days'); // Week Start
        var weekEnd = currentDate.clone().endOf('week').add(1, 'days');
        var arrayOfWeeks = [-7,-7,0,7,14,14];
        highCharts.chart('invoice', {
            chart: {
                height: 145,
                width: 460,
                type: 'column',
                // marginBottom: 25,
                marginBottom: 60,
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
                           '<p style="word-spacing: 30px;color: #657483;">'+this.series.name+' '+ Currency + parseFloat(this.y.toFixed(2)).toLocaleString()+'</p>';

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
                       dataObj[0].awtpaymentTotal,
                       dataObj[1].awtpaymentTotal,
                      {y:dataObj[2].awtpaymentTotal,color:'#89d0f5'},
                       dataObj[3].awtpaymentTotal,
                       dataObj[4].awtpaymentTotal,
                       dataObj[5].awtpaymentTotal],
            }],
            colors: ['#d6dade'],
            legend: {
                itemStyle: {
                    fontWeight: 'bold',
                    fontSize: '0'
                }
            },
            plotOptions: {
                candlestick: {
                    lineColor: '#404048'
                },column: {
                    pointPadding: 0
                },series: {
                    pointWidth: 65
                },
            },
        });

        jQuery("#invoiceOwedWidget").fadeOut("slow");

        });



    }

    function getAwaitingPayments (data) {
        data.tinvoice.sort(function(a,b){
            return new Date(b.DueDate) - new Date(a.DueDate);
        });

        var awtpaymentTotal = 0;
        var sum_count = 0;
        for (var event1 in data) {
            var dataCopy1 = data[event1];
            for (var data1 in dataCopy1) {
                var mainData1 = dataCopy1[data1];
                awtpaymentTotal += mainData1.TotalAmountInc;
                sum_count++;
            }
        }
        templateObject.sumAwtPayment.set(sum_count);
        templateObject.totAwtPayment.set(Currency + '' +(parseFloat((awtpaymentTotal.toFixed(2))).toLocaleString()));
    }

    function getOverduePayments() {
        dashBoardService.getOverduePayments().then((data)=>{
            var overdueTotal = 0;
            var sum_count2 = 0;
            for (var event2 in data) {
                var dataCopy2 = data[event2];
                for (var data2 in dataCopy2) {
                    var mainData2 = dataCopy2[data2];
                    overdueTotal += mainData2.TotalAmountInc;
                    sum_count2++;
                }
            }
            templateObject.sumOverdue.set(sum_count2);
            templateObject.totOverdue.set(Currency + '' +(parseFloat((overdueTotal.toFixed(2))).toLocaleString()));
        });
    }

    function getDrafts() {
        dashBoardService.getDraft().then((data)=>{
            var draftTotal = 0;
            var sum_count3 = 0;
            for (var event3 in data) {
                var dataCopy3 = data[event3];
                for (var data3 in dataCopy3) {
                    var mainData3 = dataCopy3[data3];
                    draftTotal += mainData3.TotalAmountInc;
                    
                    sum_count3++;
                }
            }
            templateObject.sumDraft.set(sum_count3);
            templateObject.totDraft.set(Currency + '' +(parseFloat((draftTotal.toFixed(2))).toLocaleString()));
        });
    }


    // Method to return week indications in the chart
    function changeWeekDays(days, startOfWeek, endOfWeek) {
        let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        let weekStartDay = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate()-weekStartDay+ days);
        endOfWeek.setDate(endOfWeek.getDate()-weekStartDay+ days);
        let weekStartMonth = months[startOfWeek.getMonth()],
            weekEndMonth =  months[endOfWeek.getMonth()];
        let weekResult = (weekStartMonth === weekEndMonth) ? ((startOfWeek.getDate()+'-'+endOfWeek.getDate())+' '+weekStartMonth) : ((startOfWeek.getDate()+' '+weekStartMonth+'-'+endOfWeek.getDate())+' '+weekEndMonth);
        return weekResult;
    }

    function getChartData(daysToAdd) {
       return new Promise((res,rej) =>{
           dashBoardService.getAwaitingPayment().then((data)=> {
               getAwaitingPayments(data);
               data.tinvoice.sort(function(a,b){
                   return new Date(b.DueDate) - new Date(a.DueDate);
               });
               var dataObj = [];
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
                       for(let j=0; j<data.tinvoice.length; j++){
                           let dateToCompare = new Date(data.tinvoice[j].DueDate);
                           if(dateToCompare<=lastDateOfPast) {
                               awtpaymentTotal += data.tinvoice[j].TotalAmountInc;
                               sum_count++;
                           }
                       }
                   } else if(i===5){
                        let startDateOfFuture = currentDate.clone().startOf('week').add(21,'day').toDate();
                        for(let k=0; k<data.tinvoice.length; k++){
                           let dateToCompare = new Date(data.tinvoice[k].DueDate);
                           if(dateToCompare>=startDateOfFuture) {
                               awtpaymentTotal += data.tinvoice[k].TotalAmountInc;
                               sum_count++;
                           }
                        }
                   } else {
                       for (let l=0; l<data.tinvoice.length; l++) {
                           let dateToCompare = new Date(data.tinvoice[l].DueDate);
                           if ((dateToCompare >= weekStartDate) && (dateToCompare <= weekEndDate)) {
                               awtpaymentTotal += data.tinvoice[l].TotalAmountInc;
                               sum_count++;
                           }
                       }
                   }
                   let factor = Math.pow(10, 1);
                   awtpaymentTotal = Math.round(awtpaymentTotal * factor) / factor;
                   let mapToDataObj = {awtpaymentTotal,sum_count};
                   dataObj.push(mapToDataObj);
               }
               res(dataObj);
           });
       })
    }


});

Template.invoiceOwedWidget.helpers({
    sumDraft : () => {
        return Template.instance().sumDraft.get();
    },
    totDraft: ()=> {
        return Template.instance().totDraft.get();
    },
    sumAwtPayment : () => {
        return Template.instance().sumAwtPayment.get();
    },
    totAwtPayment: ()=> {
        return Template.instance().totAwtPayment.get();
    },
    sumOverdue :  function() {
        return Template.instance().sumOverdue.get();
    },
    totOverdue :  function() {
        return Template.instance().totOverdue.get();
    }
});

// Listen to event to update reactive variable
Template.invoiceOwedWidget.events({
    //to do
});
