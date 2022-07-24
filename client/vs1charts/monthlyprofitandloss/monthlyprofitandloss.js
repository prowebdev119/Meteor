import { VS1ChartService } from "../vs1charts-service";
import "jQuery.print/jQuery.print.js";
import { UtilityService } from "../../utility-service";
import { ReactiveVar } from "meteor/reactive-var";
import { CoreService } from "../../js/core-service";
let _ = require("lodash");
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();

Template.monthlyprofitandloss.onCreated(() => {
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

Template.monthlyprofitandloss.onRendered(() => {
  const templateObject = Template.instance();

  // $(`#monthylprofiteandlosscol`).removeClass("showelement");
  // $(`#monthylprofiteandlosscol`).addClass("hideelement");

  // // This will handle the display
  // const widgetKey = "tvs1charts__monthyl_profit_and_loss";
  // const displayed = localStorage.getItem(widgetKey) || true; // by default it will show this chart
  // if (displayed == true || displayed == "true") {
  //   console.log(displayed);
  //   console.log(`showing widget ${widgetKey}`);

  //   $(`.${widgetKey}`).parent().addClass("showelement");
  //   $(`.${widgetKey}`).parent().removeClass("hideelement");
  // } else {
  //   console.log(`hidding widget ${widgetKey}`);
  //   $(`.${widgetKey}`).parent().removeClass("showelement");
  //   $(`.${widgetKey}`).parent().addClass("hideelement");
  // }

  let topTenData1 = [];
  let topTenSuppData1 = [];
  let topData = this;

  function chartClickEvent(event, array) {
    if (array[0] != undefined) {
      var activePoints = array[0]["_model"].label;
      FlowRouter.go("/profitlossreport?month=" + activePoints);
    }
  }

  // setTimeout(function () {
  //   let checkStatus = false;
  //   if (checkStatus == false || checkStatus == "false") {
  //     $("#monthlyprofitlossstatus").addClass("hideelement");
  //     $("#profitlosshide").text("Show");
  //   } else {
  //     $("#monthlyprofitlossstatus").removeClass("hideelement");
  //     $("#monthlyprofitlossstatus").addClass("showelement");
  //     $("#profitlosshide").text("Hide");
  //   }
  // }, 500);

  if (!localStorage.getItem("VS1PNLPeriodReport_dash")) {
    getInvSales(function (data) {
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
      let totalInvPayment8 = 0;

      var currentBeginDate = new Date();
      var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
      let fromDateMonth = currentBeginDate.getMonth() + 1;
      let fromDateDay = currentBeginDate.getDate();
      if (currentBeginDate.getMonth() + 1 < 10) {
        fromDateMonth = "0" + currentBeginDate.getMonth();
      }

      if (currentBeginDate.getDate() < 10) {
        fromDateDay = "0" + currentBeginDate.getDate();
      }

      var currentDate2 = new Date();
      var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
      var dateFrom = new Date();
      let lastMonthEndDate = new Date(
        currentDate2.getFullYear(),
        currentDate2.getMonth(),
        0
      );
      let currentMonthEndDate = new Date(
        currentDate2.getFullYear(),
        currentDate2.getMonth() + 1,
        0
      );
      let currentMonthStartDate =
        currentDate2.getFullYear() +
        "-" +
        ("0" + (currentDate2.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + 1).slice(-2);
      let lastMonthStartDate =
        lastMonthEndDate.getFullYear() +
        "-" +
        ("0" + (lastMonthEndDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + 1).slice(-2);
      currentMonthEndDate =
        currentMonthEndDate.getFullYear() +
        "-" +
        ("0" + (currentMonthEndDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + currentMonthEndDate.getDate()).slice(-2);
      lastMonthEndDate =
        lastMonthEndDate.getFullYear() +
        "-" +
        ("0" + (lastMonthEndDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + lastMonthEndDate.getDate()).slice(-2);
      dateFrom.setMonth(dateFrom.getMonth() - 6);
      dateFrom =
        dateFrom.getFullYear() +
        "-" +
        ("0" + (dateFrom.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + dateFrom.getDate()).slice(-2);
      $("#profitloss").attr(
        "href",
        "/profitlossreport?dateFrom=" + dateFrom + "&dateTo=" + getLoadDate
      );
      $("#lastmonth").attr(
        "href",
        "/profitlossreport?dateFrom=" +
          lastMonthStartDate +
          "&dateTo=" +
          lastMonthEndDate
      );
      $("#currentmonth").attr(
        "href",
        "/profitlossreport?dateFrom=" +
          currentMonthStartDate +
          "&dateTo=" +
          currentMonthEndDate
      );
      let prevMonth = moment()
        .subtract(1, "months")
        .format("MMMM")
        .substring(0, 3); // Current date (date month and year)
      let prevMonth2 = moment()
        .subtract(2, "months")
        .format("MMMM")
        .substring(0, 3);
      let prevMonth3 = moment()
        .subtract(3, "months")
        .format("MMMM")
        .substring(0, 3);
      let prevMonth4 = moment()
        .subtract(4, "months")
        .format("MMMM")
        .substring(0, 3);
      let prevMonth5 = moment()
        .subtract(5, "months")
        .format("MMMM")
        .substring(0, 3);
      let prevMonth6 = moment()
        .subtract(6, "months")
        .format("MMMM")
        .substring(0, 3);
      let prevMonth7 = moment().subtract(7, "months").format("YYYY-MM-DD");
      let prevMonth7Date = moment().subtract(7, "months").format("YYYY-MM-DD");

      vs1chartService
        .getProfitLossPeriodReportData(prevMonth7, getLoadDate)
        .then((data) => {
          let month_1 =
            data.tprofitandlossperiodreport[0].DateDesc_1 || prevMonth7Date;
          let month_2 =
            data.tprofitandlossperiodreport[0].DateDesc_2 || prevMonth6;
          let month_3 =
            data.tprofitandlossperiodreport[0].DateDesc_3 || prevMonth5;
          let month_4 =
            data.tprofitandlossperiodreport[0].DateDesc_4 || prevMonth4;
          let month_5 =
            data.tprofitandlossperiodreport[0].DateDesc_5 || prevMonth3;
          let month_6 =
            data.tprofitandlossperiodreport[0].DateDesc_6 || prevMonth2;
          let month_7 =
            data.tprofitandlossperiodreport[0].DateDesc_7 || prevMonth;
          let month_8 =
            data.tprofitandlossperiodreport[0].DateDesc_8 || currentMonth;

          let month_1_diff = 0;
          let month_2_diff = 0;
          let month_3_diff = 0;
          let month_4_diff = 0;
          let month_5_diff = 0;
          let month_6_diff = 0;
          let month_7_diff = 0;
          let month_8_diff = 0;

          let month_1_profit = 0;
          let month_2_profit = 0;
          let month_3_profit = 0;
          let month_4_profit = 0;
          let month_5_profit = 0;
          let month_6_profit = 0;
          let month_7_profit = 0;
          let month_8_profit = 0;

          let month_1_loss = 0;
          let month_2_loss = 0;
          let month_3_loss = 0;
          let month_4_loss = 0;
          let month_5_loss = 0;
          let month_6_loss = 0;
          let month_7_loss = 0;
          let month_8_loss = 0;

          let month_1_loss_exp = 0;
          let month_2_loss_exp = 0;
          let month_3_loss_exp = 0;
          let month_4_loss_exp = 0;
          let month_5_loss_exp = 0;
          let month_6_loss_exp = 0;
          let month_7_loss_exp = 0;
          let month_8_loss_exp = 0;

          let total_month_1_loss = 0;
          let total_month_2_loss = 0;
          let total_month_3_loss = 0;
          let total_month_4_loss = 0;
          let total_month_5_loss = 0;
          let total_month_6_loss = 0;
          let total_month_7_loss = 0;
          let total_month_8_loss = 0;

          for (let l = 0; l < data.tprofitandlossperiodreport.length; l++) {
            if (
              data.tprofitandlossperiodreport[l].AccountTypeDesc.replace(
                /\s/g,
                ""
              ) == "TotalExpenses"
            ) {
              month_1_loss_exp =
                data.tprofitandlossperiodreport[l].Amount_1 || 0;
              month_2_loss_exp =
                data.tprofitandlossperiodreport[l].Amount_2 || 0;
              month_3_loss_exp =
                data.tprofitandlossperiodreport[l].Amount_3 || 0;
              month_4_loss_exp =
                data.tprofitandlossperiodreport[l].Amount_4 || 0;
              month_5_loss_exp =
                data.tprofitandlossperiodreport[l].Amount_5 || 0;
              month_6_loss_exp =
                data.tprofitandlossperiodreport[l].Amount_6 || 0;
              month_7_loss_exp =
                data.tprofitandlossperiodreport[l].Amount_7 || 0;
              month_8_loss_exp =
                data.tprofitandlossperiodreport[l].Amount_8 || 0;
            }

            if (
              data.tprofitandlossperiodreport[l].AccountTypeDesc.replace(
                /\s/g,
                ""
              ) == "TotalCOGS"
            ) {
              month_1_loss = data.tprofitandlossperiodreport[l].Amount_1 || 0;
              month_2_loss = data.tprofitandlossperiodreport[l].Amount_2 || 0;
              month_3_loss = data.tprofitandlossperiodreport[l].Amount_3 || 0;
              month_4_loss = data.tprofitandlossperiodreport[l].Amount_4 || 0;
              month_5_loss = data.tprofitandlossperiodreport[l].Amount_5 || 0;
              month_6_loss = data.tprofitandlossperiodreport[l].Amount_6 || 0;
              month_7_loss = data.tprofitandlossperiodreport[l].Amount_7 || 0;
              month_8_loss = data.tprofitandlossperiodreport[l].Amount_8 || 0;
            }

            if (
              data.tprofitandlossperiodreport[l].AccountTypeDesc.replace(
                /\s/g,
                ""
              ) == "TotalIncome"
            ) {
              month_1_profit = data.tprofitandlossperiodreport[l].Amount_1 || 0;
              month_2_profit = data.tprofitandlossperiodreport[l].Amount_2 || 0;
              month_3_profit = data.tprofitandlossperiodreport[l].Amount_3 || 0;
              month_4_profit = data.tprofitandlossperiodreport[l].Amount_4 || 0;
              month_5_profit = data.tprofitandlossperiodreport[l].Amount_5 || 0;
              month_6_profit = data.tprofitandlossperiodreport[l].Amount_6 || 0;
              month_7_profit = data.tprofitandlossperiodreport[l].Amount_7 || 0;
              month_8_profit = data.tprofitandlossperiodreport[l].Amount_8 || 0;
            }
          }

          total_month_1_loss = Number(month_1_loss) + Number(month_1_loss_exp);
          total_month_2_loss = Number(month_2_loss) + Number(month_2_loss_exp);
          total_month_3_loss = Number(month_3_loss) + Number(month_3_loss_exp);
          total_month_4_loss = Number(month_4_loss) + Number(month_4_loss_exp);
          total_month_5_loss = Number(month_5_loss) + Number(month_5_loss_exp);
          total_month_6_loss = Number(month_6_loss) + Number(month_6_loss_exp);
          total_month_7_loss = Number(month_7_loss) + Number(month_7_loss_exp);
          total_month_8_loss = Number(month_8_loss) + Number(month_8_loss_exp);

          month_1_diff = Number(month_1_profit) + Number(total_month_1_loss);
          month_2_diff = Number(month_2_profit) + Number(total_month_2_loss);
          month_3_diff = Number(month_3_profit) + Number(total_month_3_loss);
          month_4_diff = Number(month_4_profit) + Number(total_month_4_loss);
          month_5_diff = Number(month_5_profit) + Number(total_month_5_loss);
          month_6_diff = Number(month_6_profit) + Number(total_month_6_loss);
          month_7_diff = Number(month_7_profit) + Number(total_month_7_loss);
          month_8_diff = Number(month_8_profit) + Number(total_month_8_loss);
          // function done(){
          //       var url= myChart.toBase64Image();
          //       document.getElementById("url").src=url;
          //       setTimeout(function  (){
          //            $('#monthlyprofitandlosschart').hide();
          //       },500)

          // };
          var ctx = document
            .getElementById("monthlyprofitandlosschart")
            .getContext("2d");
          var myChart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: [
                month_1,
                month_2,
                month_3,
                month_4,
                month_5,
                month_6,
                month_7,
                month_8,
              ],
              datasets: [
                {
                  label: "Sales",
                  backgroundColor: "#00a3d3",
                  borderColor: "rgba(78,115,223,0)",
                  data: [
                    month_1_profit,
                    month_2_profit,
                    month_3_profit,
                    month_4_profit,
                    month_5_profit,
                    month_6_profit,
                    month_7_profit,
                    month_8_profit,
                  ],
                },
                {
                  label: "Expenses",
                  backgroundColor: "#ef1616",
                  data: [
                    total_month_1_loss,
                    total_month_2_loss,
                    total_month_3_loss,
                    total_month_4_loss,
                    total_month_5_loss,
                    total_month_6_loss,
                    total_month_7_loss,
                    total_month_8_loss,
                  ],
                },
                {
                  label: "Net Income",
                  backgroundColor: "#33c942",
                  data: [
                    month_1_diff,
                    month_2_diff,
                    month_3_diff,
                    month_4_diff,
                    month_5_diff,
                    month_6_diff,
                    month_7_diff,
                    month_8_diff,
                  ],
                },
              ],
            },
            options: {
              maintainAspectRatio: false,
              responsive: true,
              tooltips: {
                callbacks: {
                  label: function (tooltipItem, data) {
                    return (
                      utilityService.modifynegativeCurrencyFormat(
                        Math.abs(tooltipItem.yLabel)
                      ) || 0.0
                    );
                  },
                },
              },
              //      bezierCurve : true,
              //     animation: {
              //     onComplete: done
              // },
              legend: {
                display: true,
                position: "right",
                reverse: false,
              },
              onClick: chartClickEvent,
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
    });

    function getInvSales(callback) {
      return new Promise((res, rej) => {
        // var salesBoardService = new SalesBoardService();

        callback("");
      });
    }
  } else {
    let data = JSON.parse(localStorage.getItem("VS1PNLPeriodReport_dash"));
    var currentDate2 = new Date();
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    var dateFrom = new Date();
    lastMonthEndDate = new Date(
      currentDate2.getFullYear(),
      currentDate2.getMonth(),
      0
    );
    let currentMonthEndDate = new Date(
      currentDate2.getFullYear(),
      currentDate2.getMonth() + 1,
      0
    );
    let currentMonthStartDate =
      currentDate2.getFullYear() +
      "-" +
      ("0" + (currentDate2.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + 1).slice(-2);
    let lastMonthStartDate =
      lastMonthEndDate.getFullYear() +
      "-" +
      ("0" + (lastMonthEndDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + 1).slice(-2);
    currentMonthEndDate =
      currentMonthEndDate.getFullYear() +
      "-" +
      ("0" + (currentMonthEndDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + currentMonthEndDate.getDate()).slice(-2);
    lastMonthEndDate =
      lastMonthEndDate.getFullYear() +
      "-" +
      ("0" + (lastMonthEndDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + lastMonthEndDate.getDate()).slice(-2);
    dateFrom.setMonth(dateFrom.getMonth() - 6);
    dateFrom =
      dateFrom.getFullYear() +
      "-" +
      ("0" + (dateFrom.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + dateFrom.getDate()).slice(-2);
    $("#profitloss").attr(
      "href",
      "/profitlossreport?dateFrom=" + dateFrom + "&dateTo=" + getLoadDate
    );
    $("#lastmonth").attr(
      "href",
      "/profitlossreport?dateFrom=" +
        lastMonthStartDate +
        "&dateTo=" +
        lastMonthEndDate
    );
    $("#currentmonth").attr(
      "href",
      "/profitlossreport?dateFrom=" +
        currentMonthStartDate +
        "&dateTo=" +
        currentMonthEndDate
    );
    let month_1 = data[0].fields.DateDesc_1 || "";
    let month_2 = data[0].fields.DateDesc_2 || "";
    let month_3 = data[0].fields.DateDesc_3 || "";
    let month_4 = data[0].fields.DateDesc_4 || "";
    let month_5 = data[0].fields.DateDesc_5 || "";
    let month_6 = data[0].fields.DateDesc_6 || "";
    let month_7 = data[0].fields.DateDesc_7 || "";
    // let month_8 = data.fields[0].DateDesc_8||currentMonth;

    let month_1_diff = 0;
    let month_2_diff = 0;
    let month_3_diff = 0;
    let month_4_diff = 0;
    let month_5_diff = 0;
    let month_6_diff = 0;
    let month_7_diff = 0;
    let month_8_diff = 0;

    let month_1_profit = 0;
    let month_2_profit = 0;
    let month_3_profit = 0;
    let month_4_profit = 0;
    let month_5_profit = 0;
    let month_6_profit = 0;
    let month_7_profit = 0;
    let month_8_profit = 0;

    let month_1_loss = 0;
    let month_2_loss = 0;
    let month_3_loss = 0;
    let month_4_loss = 0;
    let month_5_loss = 0;
    let month_6_loss = 0;
    let month_7_loss = 0;
    let month_8_loss = 0;

    let month_1_loss_exp = 0;
    let month_2_loss_exp = 0;
    let month_3_loss_exp = 0;
    let month_4_loss_exp = 0;
    let month_5_loss_exp = 0;
    let month_6_loss_exp = 0;
    let month_7_loss_exp = 0;
    let month_8_loss_exp = 0;

    let total_month_1_loss = 0;
    let total_month_2_loss = 0;
    let total_month_3_loss = 0;
    let total_month_4_loss = 0;
    let total_month_5_loss = 0;
    let total_month_6_loss = 0;
    let total_month_7_loss = 0;
    let total_month_8_loss = 0;

    let total_month_1_net = 0;
    let total_month_2_net = 0;
    let total_month_3_net = 0;
    let total_month_4_net = 0;
    let total_month_5_net = 0;
    let total_month_6_net = 0;
    let total_month_7_net = 0;

    for (let l = 0; l < data.length; l++) {
      if (
        data[l].fields.AccountTypeDesc.replace(/\s/g, "") == "TotalExpenses"
      ) {
        month_1_loss_exp = data[l].fields.Amount_1 || 0;
        month_2_loss_exp = data[l].fields.Amount_2 || 0;
        month_3_loss_exp = data[l].fields.Amount_3 || 0;
        month_4_loss_exp = data[l].fields.Amount_4 || 0;
        month_5_loss_exp = data[l].fields.Amount_5 || 0;
        month_6_loss_exp = data[l].fields.Amount_6 || 0;
        month_7_loss_exp = data[l].fields.Amount_7 || 0;
        // month_8_loss_exp = data[l].Amount_8 ||0;
      }

      if (data[l].fields.AccountTypeDesc.replace(/\s/g, "") == "TotalCOGS") {
        month_1_loss = data[l].fields.Amount_1 || 0;
        month_2_loss = data[l].fields.Amount_2 || 0;
        month_3_loss = data[l].fields.Amount_3 || 0;
        month_4_loss = data[l].fields.Amount_4 || 0;
        month_5_loss = data[l].fields.Amount_5 || 0;
        month_6_loss = data[l].fields.Amount_6 || 0;
        month_7_loss = data[l].fields.Amount_7 || 0;
        //month_8_loss = data[l].Amount_8 || 0;
      }

      if (data[l].fields.AccountTypeDesc.replace(/\s/g, "") == "TotalIncome") {
        month_1_profit = data[l].fields.Amount_1 || 0;
        month_2_profit = data[l].fields.Amount_2 || 0;
        month_3_profit = data[l].fields.Amount_3 || 0;
        month_4_profit = data[l].fields.Amount_4 || 0;
        month_5_profit = data[l].fields.Amount_5 || 0;
        month_6_profit = data[l].fields.Amount_6 || 0;
        month_7_profit = data[l].fields.Amount_7 || 0;
        //month_8_profit = data[l].Amount_8 || 0;
      }

      if (data[l].fields.AccountTypeDesc.replace(/\s/g, "") == "NetIncome") {
        total_month_1_net = data[l].fields.Amount_1 || 0;
        total_month_2_net = data[l].fields.Amount_2 || 0;
        total_month_3_net = data[l].fields.Amount_3 || 0;
        total_month_4_net = data[l].fields.Amount_4 || 0;
        total_month_5_net = data[l].fields.Amount_5 || 0;
        total_month_6_net = data[l].fields.Amount_6 || 0;
        total_month_7_net = data[l].fields.Amount_7 || 0;
      }
    }

    total_month_1_loss = Number(month_1_loss) + Number(month_1_loss_exp);
    total_month_2_loss = Number(month_2_loss) + Number(month_2_loss_exp);
    total_month_3_loss = Number(month_3_loss) + Number(month_3_loss_exp);
    total_month_4_loss = Number(month_4_loss) + Number(month_4_loss_exp);
    total_month_5_loss = Number(month_5_loss) + Number(month_5_loss_exp);
    total_month_6_loss = Number(month_6_loss) + Number(month_6_loss_exp);
    total_month_7_loss = Number(month_7_loss) + Number(month_7_loss_exp);
    //total_month_8_loss = (Number(month_8_loss) + Number(month_8_loss_exp));

    //month_8_diff = (Number(month_8_profit) + Number(total_month_8_loss));
    //         function done(){
    //   var url= myChart.toBase64Image();
    //   document.getElementById("url").src=url;
    //   setTimeout(function  (){
    //        $('#monthlyprofitandlosschart').hide();
    //   },500)

    // };
    var ctx = document
      .getElementById("monthlyprofitandlosschart")
      .getContext("2d");
    var myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          month_1,
          month_2,
          month_3,
          month_4,
          month_5,
          month_6,
          month_7,
          //month_8
        ],
        datasets: [
          {
            label: "Sales",
            backgroundColor: "#00a3d3",
            borderColor: "rgba(78,115,223,0)",
            data: [
              month_1_profit,
              month_2_profit,
              month_3_profit,
              month_4_profit,
              month_5_profit,
              month_6_profit,
              month_7_profit,
              //month_8_profit
            ],
          },
          {
            label: "Expenses",
            backgroundColor: "#ef1616",
            data: [
              total_month_1_loss,
              total_month_2_loss,
              total_month_3_loss,
              total_month_4_loss,
              total_month_5_loss,
              total_month_6_loss,
              total_month_7_loss,
              //total_month_8_loss
            ],
          },
          {
            label: "Net Income",
            backgroundColor: "#33c942",
            data: [
              total_month_1_net,
              total_month_2_net,
              total_month_3_net,
              total_month_4_net,
              total_month_5_net,
              total_month_6_net,
              total_month_7_net,
              //month_8_diff
            ],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return (
                utilityService.modifynegativeCurrencyFormat(
                  Math.abs(tooltipItem.yLabel)
                ) || 0.0
              );
            },
          },
        },
        // bezierCurve : true,
        // animation: {
        // onComplete: done
        // },
        legend: {
          display: true,
          position: "right",
          reverse: false,
        },
        onClick: chartClickEvent,
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
  }

  templateObject.reAttachChart = function () {
    if (!localStorage.getItem("VS1PNLPeriodReport_dash")) {
      getInvSales(function (data) {
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
        let totalInvPayment8 = 0;

        var currentBeginDate = new Date();
        var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = currentBeginDate.getMonth() + 1;
        let fromDateDay = currentBeginDate.getDate();
        if (currentBeginDate.getMonth() + 1 < 10) {
          fromDateMonth = "0" + currentBeginDate.getMonth();
        }

        if (currentBeginDate.getDate() < 10) {
          fromDateDay = "0" + currentBeginDate.getDate();
        }

        var currentDate2 = new Date();
        var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
        var dateFrom = new Date();
        let lastMonthEndDate = new Date(
          currentDate2.getFullYear(),
          currentDate2.getMonth(),
          0
        );
        let currentMonthEndDate = new Date(
          currentDate2.getFullYear(),
          currentDate2.getMonth() + 1,
          0
        );
        let currentMonthStartDate =
          currentDate2.getFullYear() +
          "-" +
          ("0" + (currentDate2.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + 1).slice(-2);
        let lastMonthStartDate =
          lastMonthEndDate.getFullYear() +
          "-" +
          ("0" + (lastMonthEndDate.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + 1).slice(-2);
        currentMonthEndDate =
          currentMonthEndDate.getFullYear() +
          "-" +
          ("0" + (currentMonthEndDate.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + currentMonthEndDate.getDate()).slice(-2);
        lastMonthEndDate =
          lastMonthEndDate.getFullYear() +
          "-" +
          ("0" + (lastMonthEndDate.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + lastMonthEndDate.getDate()).slice(-2);
        dateFrom.setMonth(dateFrom.getMonth() - 6);
        dateFrom =
          dateFrom.getFullYear() +
          "-" +
          ("0" + (dateFrom.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + dateFrom.getDate()).slice(-2);
        $("#profitloss").attr(
          "href",
          "/profitlossreport?dateFrom=" + dateFrom + "&dateTo=" + getLoadDate
        );
        $("#lastmonth").attr(
          "href",
          "/profitlossreport?dateFrom=" +
            lastMonthStartDate +
            "&dateTo=" +
            lastMonthEndDate
        );
        $("#currentmonth").attr(
          "href",
          "/profitlossreport?dateFrom=" +
            currentMonthStartDate +
            "&dateTo=" +
            currentMonthEndDate
        );
        let prevMonth = moment()
          .subtract(1, "months")
          .format("MMMM")
          .substring(0, 3); // Current date (date month and year)
        let prevMonth2 = moment()
          .subtract(2, "months")
          .format("MMMM")
          .substring(0, 3);
        let prevMonth3 = moment()
          .subtract(3, "months")
          .format("MMMM")
          .substring(0, 3);
        let prevMonth4 = moment()
          .subtract(4, "months")
          .format("MMMM")
          .substring(0, 3);
        let prevMonth5 = moment()
          .subtract(5, "months")
          .format("MMMM")
          .substring(0, 3);
        let prevMonth6 = moment()
          .subtract(6, "months")
          .format("MMMM")
          .substring(0, 3);
        let prevMonth7 = moment().subtract(7, "months").format("YYYY-MM-DD");
        let prevMonth7Date = moment()
          .subtract(7, "months")
          .format("YYYY-MM-DD");

        vs1chartService
          .getProfitLossPeriodReportData(prevMonth7, getLoadDate)
          .then((data) => {
            let month_1 =
              data.tprofitandlossperiodreport[0].DateDesc_1 || prevMonth7Date;
            let month_2 =
              data.tprofitandlossperiodreport[0].DateDesc_2 || prevMonth6;
            let month_3 =
              data.tprofitandlossperiodreport[0].DateDesc_3 || prevMonth5;
            let month_4 =
              data.tprofitandlossperiodreport[0].DateDesc_4 || prevMonth4;
            let month_5 =
              data.tprofitandlossperiodreport[0].DateDesc_5 || prevMonth3;
            let month_6 =
              data.tprofitandlossperiodreport[0].DateDesc_6 || prevMonth2;
            let month_7 =
              data.tprofitandlossperiodreport[0].DateDesc_7 || prevMonth;
            let month_8 =
              data.tprofitandlossperiodreport[0].DateDesc_8 || currentMonth;

            let month_1_diff = 0;
            let month_2_diff = 0;
            let month_3_diff = 0;
            let month_4_diff = 0;
            let month_5_diff = 0;
            let month_6_diff = 0;
            let month_7_diff = 0;
            let month_8_diff = 0;

            let month_1_profit = 0;
            let month_2_profit = 0;
            let month_3_profit = 0;
            let month_4_profit = 0;
            let month_5_profit = 0;
            let month_6_profit = 0;
            let month_7_profit = 0;
            let month_8_profit = 0;

            let month_1_loss = 0;
            let month_2_loss = 0;
            let month_3_loss = 0;
            let month_4_loss = 0;
            let month_5_loss = 0;
            let month_6_loss = 0;
            let month_7_loss = 0;
            let month_8_loss = 0;

            let month_1_loss_exp = 0;
            let month_2_loss_exp = 0;
            let month_3_loss_exp = 0;
            let month_4_loss_exp = 0;
            let month_5_loss_exp = 0;
            let month_6_loss_exp = 0;
            let month_7_loss_exp = 0;
            let month_8_loss_exp = 0;

            let total_month_1_loss = 0;
            let total_month_2_loss = 0;
            let total_month_3_loss = 0;
            let total_month_4_loss = 0;
            let total_month_5_loss = 0;
            let total_month_6_loss = 0;
            let total_month_7_loss = 0;
            let total_month_8_loss = 0;

            for (let l = 0; l < data.tprofitandlossperiodreport.length; l++) {
              if (
                data.tprofitandlossperiodreport[l].AccountTypeDesc.replace(
                  /\s/g,
                  ""
                ) == "TotalExpenses"
              ) {
                month_1_loss_exp =
                  data.tprofitandlossperiodreport[l].Amount_1 || 0;
                month_2_loss_exp =
                  data.tprofitandlossperiodreport[l].Amount_2 || 0;
                month_3_loss_exp =
                  data.tprofitandlossperiodreport[l].Amount_3 || 0;
                month_4_loss_exp =
                  data.tprofitandlossperiodreport[l].Amount_4 || 0;
                month_5_loss_exp =
                  data.tprofitandlossperiodreport[l].Amount_5 || 0;
                month_6_loss_exp =
                  data.tprofitandlossperiodreport[l].Amount_6 || 0;
                month_7_loss_exp =
                  data.tprofitandlossperiodreport[l].Amount_7 || 0;
                month_8_loss_exp =
                  data.tprofitandlossperiodreport[l].Amount_8 || 0;
              }

              if (
                data.tprofitandlossperiodreport[l].AccountTypeDesc.replace(
                  /\s/g,
                  ""
                ) == "TotalCOGS"
              ) {
                month_1_loss = data.tprofitandlossperiodreport[l].Amount_1 || 0;
                month_2_loss = data.tprofitandlossperiodreport[l].Amount_2 || 0;
                month_3_loss = data.tprofitandlossperiodreport[l].Amount_3 || 0;
                month_4_loss = data.tprofitandlossperiodreport[l].Amount_4 || 0;
                month_5_loss = data.tprofitandlossperiodreport[l].Amount_5 || 0;
                month_6_loss = data.tprofitandlossperiodreport[l].Amount_6 || 0;
                month_7_loss = data.tprofitandlossperiodreport[l].Amount_7 || 0;
                month_8_loss = data.tprofitandlossperiodreport[l].Amount_8 || 0;
              }

              if (
                data.tprofitandlossperiodreport[l].AccountTypeDesc.replace(
                  /\s/g,
                  ""
                ) == "TotalIncome"
              ) {
                month_1_profit =
                  data.tprofitandlossperiodreport[l].Amount_1 || 0;
                month_2_profit =
                  data.tprofitandlossperiodreport[l].Amount_2 || 0;
                month_3_profit =
                  data.tprofitandlossperiodreport[l].Amount_3 || 0;
                month_4_profit =
                  data.tprofitandlossperiodreport[l].Amount_4 || 0;
                month_5_profit =
                  data.tprofitandlossperiodreport[l].Amount_5 || 0;
                month_6_profit =
                  data.tprofitandlossperiodreport[l].Amount_6 || 0;
                month_7_profit =
                  data.tprofitandlossperiodreport[l].Amount_7 || 0;
                month_8_profit =
                  data.tprofitandlossperiodreport[l].Amount_8 || 0;
              }
            }

            total_month_1_loss =
              Number(month_1_loss) + Number(month_1_loss_exp);
            total_month_2_loss =
              Number(month_2_loss) + Number(month_2_loss_exp);
            total_month_3_loss =
              Number(month_3_loss) + Number(month_3_loss_exp);
            total_month_4_loss =
              Number(month_4_loss) + Number(month_4_loss_exp);
            total_month_5_loss =
              Number(month_5_loss) + Number(month_5_loss_exp);
            total_month_6_loss =
              Number(month_6_loss) + Number(month_6_loss_exp);
            total_month_7_loss =
              Number(month_7_loss) + Number(month_7_loss_exp);
            total_month_8_loss =
              Number(month_8_loss) + Number(month_8_loss_exp);

            month_1_diff = Number(month_1_profit) + Number(total_month_1_loss);
            month_2_diff = Number(month_2_profit) + Number(total_month_2_loss);
            month_3_diff = Number(month_3_profit) + Number(total_month_3_loss);
            month_4_diff = Number(month_4_profit) + Number(total_month_4_loss);
            month_5_diff = Number(month_5_profit) + Number(total_month_5_loss);
            month_6_diff = Number(month_6_profit) + Number(total_month_6_loss);
            month_7_diff = Number(month_7_profit) + Number(total_month_7_loss);
            month_8_diff = Number(month_8_profit) + Number(total_month_8_loss);

            var ctx = document
              .getElementById("monthlyprofitandlosschart")
              .getContext("2d");
            var myChart = new Chart(ctx, {
              type: "bar",
              data: {
                labels: [
                  month_1,
                  month_2,
                  month_3,
                  month_4,
                  month_5,
                  month_6,
                  month_7,
                  month_8,
                ],
                datasets: [
                  {
                    label: "Sales",
                    backgroundColor: "#00a3d3",
                    borderColor: "rgba(78,115,223,0)",
                    data: [
                      month_1_profit,
                      month_2_profit,
                      month_3_profit,
                      month_4_profit,
                      month_5_profit,
                      month_6_profit,
                      month_7_profit,
                      month_8_profit,
                    ],
                  },
                  {
                    label: "Expenses",
                    backgroundColor: "#ef1616",
                    data: [
                      total_month_1_loss,
                      total_month_2_loss,
                      total_month_3_loss,
                      total_month_4_loss,
                      total_month_5_loss,
                      total_month_6_loss,
                      total_month_7_loss,
                      total_month_8_loss,
                    ],
                  },
                  {
                    label: "Net Income",
                    backgroundColor: "#33c942",
                    data: [
                      month_1_diff,
                      month_2_diff,
                      month_3_diff,
                      month_4_diff,
                      month_5_diff,
                      month_6_diff,
                      month_7_diff,
                      month_8_diff,
                    ],
                  },
                ],
              },
              options: {
                maintainAspectRatio: false,
                responsive: true,
                tooltips: {
                  callbacks: {
                    label: function (tooltipItem, data) {
                      return (
                        utilityService.modifynegativeCurrencyFormat(
                          Math.abs(tooltipItem.yLabel)
                        ) || 0.0
                      );
                    },
                  },
                },
                legend: {
                  display: true,
                  position: "right",
                  reverse: false,
                },
                onClick: chartClickEvent,
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
      });

      function getInvSales(callback) {
        return new Promise((res, rej) => {
          // var salesBoardService = new SalesBoardService();

          callback("");
        });
      }
    } else {
      let data = JSON.parse(localStorage.getItem("VS1PNLPeriodReport_dash"));
      var currentDate2 = new Date();
      var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
      var dateFrom = new Date();
      lastMonthEndDate = new Date(
        currentDate2.getFullYear(),
        currentDate2.getMonth(),
        0
      );
      let currentMonthEndDate = new Date(
        currentDate2.getFullYear(),
        currentDate2.getMonth() + 1,
        0
      );
      let currentMonthStartDate =
        currentDate2.getFullYear() +
        "-" +
        ("0" + (currentDate2.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + 1).slice(-2);
      let lastMonthStartDate =
        lastMonthEndDate.getFullYear() +
        "-" +
        ("0" + (lastMonthEndDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + 1).slice(-2);
      currentMonthEndDate =
        currentMonthEndDate.getFullYear() +
        "-" +
        ("0" + (currentMonthEndDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + currentMonthEndDate.getDate()).slice(-2);
      lastMonthEndDate =
        lastMonthEndDate.getFullYear() +
        "-" +
        ("0" + (lastMonthEndDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + lastMonthEndDate.getDate()).slice(-2);
      dateFrom.setMonth(dateFrom.getMonth() - 6);
      dateFrom =
        dateFrom.getFullYear() +
        "-" +
        ("0" + (dateFrom.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + dateFrom.getDate()).slice(-2);
      $("#profitloss").attr(
        "href",
        "/profitlossreport?dateFrom=" + dateFrom + "&dateTo=" + getLoadDate
      );
      $("#lastmonth").attr(
        "href",
        "/profitlossreport?dateFrom=" +
          lastMonthStartDate +
          "&dateTo=" +
          lastMonthEndDate
      );
      $("#currentmonth").attr(
        "href",
        "/profitlossreport?dateFrom=" +
          currentMonthStartDate +
          "&dateTo=" +
          currentMonthEndDate
      );
      let month_1 = data[0].fields.DateDesc_1 || "";
      let month_2 = data[0].fields.DateDesc_2 || "";
      let month_3 = data[0].fields.DateDesc_3 || "";
      let month_4 = data[0].fields.DateDesc_4 || "";
      let month_5 = data[0].fields.DateDesc_5 || "";
      let month_6 = data[0].fields.DateDesc_6 || "";
      let month_7 = data[0].fields.DateDesc_7 || "";
      // let month_8 = data.fields[0].DateDesc_8||currentMonth;

      let month_1_diff = 0;
      let month_2_diff = 0;
      let month_3_diff = 0;
      let month_4_diff = 0;
      let month_5_diff = 0;
      let month_6_diff = 0;
      let month_7_diff = 0;
      let month_8_diff = 0;

      let month_1_profit = 0;
      let month_2_profit = 0;
      let month_3_profit = 0;
      let month_4_profit = 0;
      let month_5_profit = 0;
      let month_6_profit = 0;
      let month_7_profit = 0;
      let month_8_profit = 0;

      let month_1_loss = 0;
      let month_2_loss = 0;
      let month_3_loss = 0;
      let month_4_loss = 0;
      let month_5_loss = 0;
      let month_6_loss = 0;
      let month_7_loss = 0;
      let month_8_loss = 0;

      let month_1_loss_exp = 0;
      let month_2_loss_exp = 0;
      let month_3_loss_exp = 0;
      let month_4_loss_exp = 0;
      let month_5_loss_exp = 0;
      let month_6_loss_exp = 0;
      let month_7_loss_exp = 0;
      let month_8_loss_exp = 0;

      let total_month_1_loss = 0;
      let total_month_2_loss = 0;
      let total_month_3_loss = 0;
      let total_month_4_loss = 0;
      let total_month_5_loss = 0;
      let total_month_6_loss = 0;
      let total_month_7_loss = 0;
      let total_month_8_loss = 0;

      let total_month_1_net = 0;
      let total_month_2_net = 0;
      let total_month_3_net = 0;
      let total_month_4_net = 0;
      let total_month_5_net = 0;
      let total_month_6_net = 0;
      let total_month_7_net = 0;

      for (let l = 0; l < data.length; l++) {
        if (
          data[l].fields.AccountTypeDesc.replace(/\s/g, "") == "TotalExpenses"
        ) {
          month_1_loss_exp = data[l].fields.Amount_1 || 0;
          month_2_loss_exp = data[l].fields.Amount_2 || 0;
          month_3_loss_exp = data[l].fields.Amount_3 || 0;
          month_4_loss_exp = data[l].fields.Amount_4 || 0;
          month_5_loss_exp = data[l].fields.Amount_5 || 0;
          month_6_loss_exp = data[l].fields.Amount_6 || 0;
          month_7_loss_exp = data[l].fields.Amount_7 || 0;
          // month_8_loss_exp = data[l].Amount_8 ||0;
        }

        if (data[l].fields.AccountTypeDesc.replace(/\s/g, "") == "TotalCOGS") {
          month_1_loss = data[l].fields.Amount_1 || 0;
          month_2_loss = data[l].fields.Amount_2 || 0;
          month_3_loss = data[l].fields.Amount_3 || 0;
          month_4_loss = data[l].fields.Amount_4 || 0;
          month_5_loss = data[l].fields.Amount_5 || 0;
          month_6_loss = data[l].fields.Amount_6 || 0;
          month_7_loss = data[l].fields.Amount_7 || 0;
          //month_8_loss = data[l].Amount_8 || 0;
        }

        if (
          data[l].fields.AccountTypeDesc.replace(/\s/g, "") == "TotalIncome"
        ) {
          month_1_profit = data[l].fields.Amount_1 || 0;
          month_2_profit = data[l].fields.Amount_2 || 0;
          month_3_profit = data[l].fields.Amount_3 || 0;
          month_4_profit = data[l].fields.Amount_4 || 0;
          month_5_profit = data[l].fields.Amount_5 || 0;
          month_6_profit = data[l].fields.Amount_6 || 0;
          month_7_profit = data[l].fields.Amount_7 || 0;
          //month_8_profit = data[l].Amount_8 || 0;
        }

        if (data[l].fields.AccountTypeDesc.replace(/\s/g, "") == "NetIncome") {
          total_month_1_net = data[l].fields.Amount_1 || 0;
          total_month_2_net = data[l].fields.Amount_2 || 0;
          total_month_3_net = data[l].fields.Amount_3 || 0;
          total_month_4_net = data[l].fields.Amount_4 || 0;
          total_month_5_net = data[l].fields.Amount_5 || 0;
          total_month_6_net = data[l].fields.Amount_6 || 0;
          total_month_7_net = data[l].fields.Amount_7 || 0;
        }
      }

      total_month_1_loss = Number(month_1_loss) + Number(month_1_loss_exp);
      total_month_2_loss = Number(month_2_loss) + Number(month_2_loss_exp);
      total_month_3_loss = Number(month_3_loss) + Number(month_3_loss_exp);
      total_month_4_loss = Number(month_4_loss) + Number(month_4_loss_exp);
      total_month_5_loss = Number(month_5_loss) + Number(month_5_loss_exp);
      total_month_6_loss = Number(month_6_loss) + Number(month_6_loss_exp);
      total_month_7_loss = Number(month_7_loss) + Number(month_7_loss_exp);
      //total_month_8_loss = (Number(month_8_loss) + Number(month_8_loss_exp));

      //month_8_diff = (Number(month_8_profit) + Number(total_month_8_loss));

      var ctx = document
        .getElementById("monthlyprofitandlosschart")
        .getContext("2d");
      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            month_1,
            month_2,
            month_3,
            month_4,
            month_5,
            month_6,
            month_7,
            //month_8
          ],
          datasets: [
            {
              label: "Sales",
              backgroundColor: "#00a3d3",
              borderColor: "rgba(78,115,223,0)",
              data: [
                month_1_profit,
                month_2_profit,
                month_3_profit,
                month_4_profit,
                month_5_profit,
                month_6_profit,
                month_7_profit,
                //month_8_profit
              ],
            },
            {
              label: "Expenses",
              backgroundColor: "#ef1616",
              data: [
                total_month_1_loss,
                total_month_2_loss,
                total_month_3_loss,
                total_month_4_loss,
                total_month_5_loss,
                total_month_6_loss,
                total_month_7_loss,
                //total_month_8_loss
              ],
            },
            {
              label: "Net Income",
              backgroundColor: "#33c942",
              data: [
                total_month_1_net,
                total_month_2_net,
                total_month_3_net,
                total_month_4_net,
                total_month_5_net,
                total_month_6_net,
                total_month_7_net,
                //month_8_diff
              ],
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                return (
                  utilityService.modifynegativeCurrencyFormat(
                    Math.abs(tooltipItem.yLabel)
                  ) || 0.0
                );
              },
            },
          },
          legend: {
            display: true,
            position: "right",
            reverse: false,
          },
          onClick: chartClickEvent,
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
    }
  };
});

Template.monthlyprofitandloss.events({
  // 'click #profitlosshide': function () {
  //     let check = localStorage.getItem("profitchat") || true;
  //     if (check == "true" || check == true) {
  //         $("#profitlosshide").text("Show");
  //     } else {
  //         $("#profitlosshide").text("Hide");
  //     }
  // },
});

Template.monthlyprofitandloss.helpers({
  dateAsAt: () => {
    return Template.instance().dateAsAt.get() || "-";
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
});
Template.registerHelper("equals", function (a, b) {
  return a === b;
});

Template.registerHelper("notEquals", function (a, b) {
  return a != b;
});

Template.registerHelper("containsequals", function (a, b) {
  return a.indexOf(b) >= 0;
});
