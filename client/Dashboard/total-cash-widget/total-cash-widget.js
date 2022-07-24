import { ReactiveVar } from 'meteor/reactive-var';
const highCharts = require('highcharts');
require('highcharts/modules/exporting')(highCharts);
require('highcharts/highcharts-more')(highCharts);
import {DashBoardService} from '../dashboard-service';
Template.totalCashWidget.onCreated(()=>{

});

Template.totalCashWidget.onRendered(()=>{
    drawChartCash();
    function drawChartCash() {
        highCharts.chart('cash', {
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: [
                    'November',
                    'December',
                    'January',
                    'February',
                    'March',
                    'April',
                ],
                crosshair: false
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
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td>' +
                '<td>Difference</td><td>{point.y:.1f}  - {point.y:.1f} </td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            series: [{
                name: 'In',
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0]

            }, {
                name: 'Out',
                data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5]

            }],
            colors: ['#89d0f5', '#d6dade'],
            legend: {
                itemStyle: {
                    fontWeight: 'bold',
                    fontSize: '0'
                }
            },
            plotOptions: {
                candlestick: {
                    lineColor: '#404048'
                }
            },
        });
    }
});

Template.totalCashWidget.helpers({

});

// Listen to event to update reactive variable
Template.totalCashWidget.events({
    //to do
});
