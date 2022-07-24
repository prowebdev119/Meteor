import { VS1ChartService } from "../vs1charts-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import { ReactiveVar } from "meteor/reactive-var";
import { SalesBoardService } from "../../js/sales-service";
import { CoreService } from "../../js/core-service";

let _ = require("lodash");
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();

import Customer from "./Customer";

Template.top10Customers.onCreated(function () {
  const templateObject = Template.instance();

  templateObject.topTenData = new ReactiveVar([]);
});

Template.top10Customers.onRendered(function () {
  const templateObject = Template.instance();
  let topTenData1 = [];
  let topData = this;

  getInvSales(function (data) {
    let customerList = [];
    topTenData1 = _.take(data, 10);
    let totalBalance = 0;
    let itemName = [];
    let itemBalance = [];

    topTenData1.map(function (item) {
      item.totalbalance = +parseFloat(item.totalbalance).toFixed(2);
      if (item.totalbalance > 0) {
        //itemName.push(item.name);
        //itemBalance.push(item.totalbalance);
        customerList.push(
          new Customer({
            name: item.name,
            totalbalance: item.totalbalance,
          })
        );
      }
      // itemName.push(item.name);
      // itemBalance.push(item.totalbalance);
    });

    let otherData = _.difference(data, topTenData1, _.isEqual);

    let totalPayment = 0;
    let overDuePayment = 0;

    topData.topTenData.set(data);

    //console.log(topTenData1);

    templateObject.topTenData.set(topTenData1);

    // Chart.js
    var ctx = document.getElementById("top10customers").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "horizontalBar",
      data: {
        labels: customerList.map((customer) => customer.name),
        datasets: [
          {
            label: "Amount #" + this.name,
            data: customerList.map((customer) => customer.totalbalance),

            backgroundColor: [
              "#f6c23e",
              "#f6c23e",
              "#f6c23e",
              "#f6c23e",
              "#f6c23e",
              "#f6c23e",
            ],
            borderColor: [
              "rgba(78,115,223,0)",
              "rgba(78,115,223,0)",
              "rgba(78,115,223,0)",
              "rgba(78,115,223,0)",
              "rgba(78,115,223,0)",
              "rgba(78,115,223,0)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        onClick: function (evt, item) {
          if (item[0]["_model"].label) {
            var activePoints = item[0]["_model"].label;
            FlowRouter.go("/salesreport?contact=" + activePoints);
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return (
                utilityService.modifynegativeCurrencyFormat(
                  tooltipItem.xLabel
                ) || 0.0
              );
              // Currency + Number(tooltipItem.xLabel).toFixed(2).replace(/./g, function(c, i, a) {
              //     return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
              // });
            },
          },
        },
        legend: {
          display: false,
        },
        title: {},
        scales: {
          xAxes: [
            {
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                drawTicks: false,
                borderDash: ["2"],
                zeroLineBorderDash: ["2"],
                drawOnChartArea: false,
              },
              ticks: {
                fontColor: "#858796",
                beginAtZero: true,
                padding: 20,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                color: "rgb(234, 236, 244)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                drawTicks: false,
                borderDash: ["2"],
                zeroLineBorderDash: ["2"],
              },
              ticks: {
                fontColor: "#858796",
                beginAtZero: true,
                padding: 20,
              },
            },
          ],
        },
      },
    });
  });

  function getInvSales(callback) {
    return new Promise((res, rej) => {
      var salesBoardService = new SalesBoardService();

      getVS1Data("TInvoiceEx")
        .then(function (dataObject) {
          //console.log(dataObject);
          if (dataObject.length == 0) {
            salesBoardService.getInvSaleByCustomer().then((data) => {
              // templateObject.getAllData(data);

              // This will return not deleted data only
              let filterData = _.filter(data.tinvoiceex, function (data) {
                return !data.deleted;
              });
              // console.log(filterData);
              // This will filter and return cutomer name
              let filterDueDateData = _.filter(filterData, function (data) {
                return data.CustomerName;
              });
              //  console.log(filterDueDateData);

              let groupData = _.omit(
                _.groupBy(filterDueDateData, "CustomerName"),
                [""]
              );
              let totalAmountCalculation = _.map(
                groupData,
                function (value, key) {
                  let totalPayment = 0;
                  let overDuePayment = 0;
                  for (let i = 0; i < value.length; i++) {
                    totalPayment += value[i].TotalAmountInc;
                  }
                  let userObject = {};
                  userObject.name = key;
                  userObject.totalbalance = totalPayment;
                  return userObject;
                }
              );

              let sortedArray = [];
              sortedArray = totalAmountCalculation.sort(function (a, b) {
                return b.totalbalance - a.totalbalance;
              });
              if (callback) {
                callback(sortedArray);
              }
            });
          } else {
            let data = JSON.parse(dataObject[0].data);
            let useData = data.tinvoiceex;
            let invoiceItemObj = {};
            let invoiceItems = [];
            for (let j in useData) {
              invoiceItemObj = {
                deleted: useData[j].fields.Deleted || false,
                CustomerName: useData[j].fields.CustomerName || "",
                TotalAmountInc: useData[j].fields.TotalAmountInc || 0,
              };
              // totaldeptquantity += data.tproductvs1class[j].InStockQty;
              invoiceItems.push(invoiceItemObj);
            }
            let filterData = _.filter(invoiceItems, function (data) {
              return !data.deleted;
            });
            let filterDueDateData = _.filter(filterData, function (data) {
              return data.CustomerName;
            });

            let groupData = _.omit(
              _.groupBy(filterDueDateData, "CustomerName"),
              [""]
            );
            let totalAmountCalculation = _.map(
              groupData,
              function (value, key) {
                let totalPayment = 0;
                let overDuePayment = 0;
                for (let i = 0; i < value.length; i++) {
                  totalPayment += value[i].TotalAmountInc;
                }
                let userObject = {};
                userObject.name = key;
                userObject.totalbalance = totalPayment;
                return userObject;
              }
            );

            let sortedArray = [];
            sortedArray = totalAmountCalculation.sort(function (a, b) {
              return b.totalbalance - a.totalbalance;
            });
            if (callback) {
              callback(sortedArray);
            }
          }
        })
        .catch(function (err) {
          salesBoardService.getInvSaleByCustomer().then((data) => {
            // templateObject.getAllData(data);
            let filterData = _.filter(data.tinvoiceex, function (data) {
              return !data.deleted;
            });
            let filterDueDateData = _.filter(filterData, function (data) {
              return data.CustomerName;
            });

            let groupData = _.omit(
              _.groupBy(filterDueDateData, "CustomerName"),
              [""]
            );
            let totalAmountCalculation = _.map(
              groupData,
              function (value, key) {
                let totalPayment = 0;
                let overDuePayment = 0;
                for (let i = 0; i < value.length; i++) {
                  totalPayment += value[i].TotalAmountInc;
                }
                let userObject = {};
                userObject.name = key;
                userObject.totalbalance = totalPayment;
                return userObject;
              }
            );

            let sortedArray = [];
            sortedArray = totalAmountCalculation.sort(function (a, b) {
              return b.totalbalance - a.totalbalance;
            });
            if (callback) {
              callback(sortedArray);
            }
          });
        });
    });
  }
});

Template.top10Customers.events({});

Template.top10Customers.helpers({
  topTenData: () => {
    return Template.instance().topTenData.get();
  },
});
