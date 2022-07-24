import { ReactiveVar } from "meteor/reactive-var";
import { CoreService } from "../js/core-service";
import { DashBoardService } from "./dashboard-service";
import { UtilityService } from "../utility-service";
import { VS1ChartService } from "../vs1charts/vs1charts-service";

import "gauge-chart";

let _ = require("lodash");
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
let monthlyprofitlosschart = localStorage.getItem("profitchat") || true;
let profitlosschart = localStorage.getItem("profitloss") || true;
let resalechart = localStorage.getItem("hideresalechat") || true;
let quotedinvoicedchart = localStorage.getItem("quotedinvoicedchart") || true;
let earningschart = localStorage.getItem("earningschat") || true;
let expenseschart = localStorage.getItem("expenseschart") || true;

let Charts = {
  monthlyProfitLoss: false,
  profitLoss: false,
  resale: false,
  quotedInvoiced: false,
  earnings: false,
  expenses: false,
};

Template.dashboard.onCreated(function () {
  this.loggedDb = new ReactiveVar("");
  const templateObject = Template.instance();
  templateObject.includeDashboard = new ReactiveVar();
  templateObject.includeDashboard.set(false);

  templateObject.records = new ReactiveVar([]);
  templateObject.dateAsAt = new ReactiveVar();
  templateObject.deptrecords = new ReactiveVar();
});

Template.dashboard.onRendered(function () {
  let templateObject = Template.instance();
  let isDashboard = Session.get("CloudDashboardModule");
  if (isDashboard) {
    templateObject.includeDashboard.set(true);
  }
});

Template.dashboard.helpers({
  includeDashboard: () => {
    const res = Template.instance().includeDashboard.get();
    return res;
  },
  loggedDb: function () {
    return Template.instance().loggedDb.get();
  },
  loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
  },
});

// Listen to event to update reactive variable
Template.dashboard.events({
  "click .progressbarcheck": function () {
    var valeur = 0;
    $(".loadingbar")
      .css("width", valeur + "%")
      .attr("aria-valuenow", valeur);
    $("input:checked").each(function () {
      if ($(this).attr("value") > valeur) {
        valeur = $(this).attr("value");
      }
    });
    $(".loadingbar")
      .css("width", valeur + "%")
      .attr("aria-valuenow", valeur);
    $(".progressBarInner").text("Invoices " + valeur + "%");
  },
  'click .btnBatchUpdate': function () {
    $('.fullScreenSpin').css('display','inline-block');
      batchUpdateCall();
  },
  // "click #hideearnings": function () {
  //   let check = earningschart;
  //   if (check == "true" || check == true) {
  //     earningschart = false;
  //     $(".monthlyearningsedit").text("Show");
  //   } else {
  //     earningschart = true;
  //     $(".monthlyearningsedit").text("Hide");
  //   }
  // },
  // "click #expenseshide": function () {
  //   let check = expenseschart;
  //   if (check == "true" || check == true) {
  //     expenseschart = false;
  //     $(".expensesedit").text("Show");
  //     // localStorage.setItem("expenseschart",false);
  //   } else {
  //     $(".expensesedit").text("Hide");
  //     expenseschart = true;
  //     // localStorage.setItem("expenseschart",true);
  //   }
  // },
  // "click #profitloss1hide": function () {
  //   let check = profitlosschart;
  //   if (check == "true" || check == true) {
  //     profitlosschart = false;
  //     $(".profitlossedit").text("Show");
  //   } else {
  //     $(".profitlossedit").text("Hide");
  //     profitlosschart = true;
  //   }
  // },
  // "click #profitlosshide": function () {
  //   let check = monthlyprofitlosschart;
  //   if (check == "true" || check == true) {
  //     monthlyprofitlosschart = false;
  //     $(".monthlyprofilelossedit").text("Show");
  //   } else {
  //     $(".monthlyprofilelossedit").text("Hide");
  //     monthlyprofitlosschart = true;
  //   }
  // },

  // "click #resalehide": function () {
  //   let check = resalechart;
  //   if (check == "true" || check == true) {
  //     resalechart = false;
  //     $(".resalecomparisionedit").text("Show");
  //   } else {
  //     $(".resalecomparisionedit").text("Hide");
  //     resalechart = true;
  //   }
  // },

  // "click #hidesales1": function () {
  //   let check = quotedinvoicedchart;
  //   if (check == "true" || check == true) {
  //     quotedinvoicedchart = false;
  //     $(".quotedinvoicededit").text("Show");
  //   } else {
  //     $(".quotedinvoicededit").text("Hide");
  //     quotedinvoicedchart = true;
  //   }
  // },
});
