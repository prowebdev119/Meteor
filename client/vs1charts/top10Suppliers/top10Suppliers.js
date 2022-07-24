import { VS1ChartService } from "../vs1charts-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import { ReactiveVar } from "meteor/reactive-var";
import { SalesBoardService } from "../../js/sales-service";
import { CoreService } from "../../js/core-service";

let _ = require("lodash");
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();

Template.top10Suppliers.onCreated(function () {
  const templateObject = Template.instance();

  templateObject.topTenData = new ReactiveVar([]);
});

Template.top10Suppliers.onRendered(() => {
  const templateObject = Template.instance();


  getSupplierPurchases(function (data) {
    topTenSuppData1 = _.take(data, 10);
    let totalBalance = 0;
    let itemName = [];
    let itemBalance = [];
    topTenSuppData1.map(function (item) {
      item.totalbalance = +parseFloat(item.totalbalance).toFixed(2);
      if (item.totalbalance > 0) {
        itemName.push(item.name);
        itemBalance.push(item.totalbalance);
      }
    });
    let otherData = _.difference(data, topTenSuppData1, _.isEqual);

    let totalPayment = 0;
    let overDuePayment = 0;

    // topData.topTenData.set(data);

    // templateObject.topTenData.set(topTenSuppData1);
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "horizontalBar",
      data: {
        labels: itemName,
        datasets: [
          {
            label: "Earnings",
            data: itemBalance,
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
            FlowRouter.go("/purchasesreport?contact=" + activePoints);
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
  function getSupplierPurchases(callback) {
    return new Promise((res, rej) => {
      var salesBoardService = new SalesBoardService();
      getVS1Data("TPurchaseOrderEx")
        .then(function (dataObject) {
          if (dataObject.length == 0) {
            salesBoardService.getPurchaseBySupplier().then((data) => {
              // templateObject.getAllData(data);
              let filterData = _.filter(data.tpurchaseorderex, function (data) {
                return !data.deleted;
              });
              let filterDueDateData = _.filter(filterData, function (data) {
                return data.ClientName;
              });

              let groupData = _.omit(
                _.groupBy(filterDueDateData, "ClientName"),
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
            let useData = data.tpurchaseorderex;
            let arrayDataUse = [];
            //arrayDataUse.push(useData[i].fields);
            for (let i = 0; i < useData.length; i++) {
              arrayDataUse.push(useData[i].fields);
            }
            let filterData = _.filter(arrayDataUse, function (data) {
              return !data.Deleted;
            });
            let filterDueDateData = _.filter(filterData, function (data) {
              return data.ClientName;
            });

            let groupData = _.omit(_.groupBy(filterDueDateData, "ClientName"), [
              "",
            ]);
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
          salesBoardService.getPurchaseBySupplier().then((data) => {
            // templateObject.getAllData(data);
            let filterData = _.filter(data.tpurchaseorderex, function (data) {
              return !data.deleted;
            });
            let filterDueDateData = _.filter(filterData, function (data) {
              return data.ClientName;
            });

            let groupData = _.omit(_.groupBy(filterDueDateData, "ClientName"), [
              "",
            ]);
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

Template.top10Suppliers.events({});

Template.top10Suppliers.helpers({});
