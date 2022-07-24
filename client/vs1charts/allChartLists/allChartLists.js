import { ReactiveVar } from "meteor/reactive-var";
import "gauge-chart";

import DashboardApi from "../../js/Api/DashboardApi";
import Tvs1chart from "../../js/Api/Model/Tvs1Chart";
import resizableCharts from "../../js/Charts/resizableCharts";
import ChartsEditor from "../../js/Charts/ChartsEditor";
import ChartHandler from "../../js/Charts/ChartHandler";
import draggableCharts from "../../js/Charts/draggableCharts";
import Tvs1ChartDashboardPreference from "../../js/Api/Model/Tvs1ChartDashboardPreference";
import Tvs1ChartDashboardPreferenceField from "../../js/Api/Model/Tvs1ChartDashboardPreferenceField";
import ApiService from "../../js/Api/Module/ApiService";
import '../../lib/global/indexdbstorage.js';
let _ = require("lodash");

/**
 * Current User ID
 */
const employeeId = Session.get("mySessionEmployeeLoggedID");
const _chartGroup = "";
const _tabGroup = 0;
const chartsEditor = new ChartsEditor(
  () => {
    $("#resetcharts").removeClass("hideelement").addClass("showelement"); // This will show the reset charts button

    $("#btnDone").addClass("showelement");
    $("#btnDone").removeClass("hideelement");
    $("#btnCancel").addClass("showelement");
    $("#btnCancel").removeClass("hideelement");
    $("#editcharts").addClass("hideelement");
    $("#editcharts").removeClass("showelement");
    $(".btnchartdropdown").addClass("hideelement");
    $(".btnchartdropdown").removeClass("showelement");

    // $("#resalecomparision").removeClass("hideelement");
    // $("#quotedinvoicedamount").removeClass("hideelement");
    // $("#expensechart").removeClass("hideelement");
    // $("#monthlyprofitlossstatus").removeClass("hideelement");
    // $("#resalecomparision").removeClass("hideelement");
    // $("#showearningchat").removeClass("hideelement");

    $(".sortable-chart-widget-js").removeClass("hideelement"); // display every charts
    $(".on-editor-change-mode").removeClass("hideelement");
    $(".on-editor-change-mode").addClass("showelement");
  },
  () => {
    $("#resetcharts").addClass("hideelement").removeClass("showelement"); // this will hide it back
    $("#btnDone").addClass("hideelement");
    $("#btnDone").removeClass("showelement");
    $("#btnCancel").addClass("hideelement");
    $("#btnCancel").removeClass("showelement");
    $("#editcharts").addClass("showelement");
    $("#editcharts").removeClass("hideelement");
    $(".btnchartdropdown").removeClass("hideelement");
    $(".btnchartdropdown").addClass("showelement");

    $(".on-editor-change-mode").removeClass("showelement");
    $(".on-editor-change-mode").addClass("hideelement");
  }
);

/**
 * This function will save the charts on the dashboard
 */
async function saveCharts() {
  /**
   * Lets load all API colections
   */
  const dashboardApis = new DashboardApi(); // Load all dashboard APIS
  ChartHandler.buildPositions();

  const charts = $(".chart-visibility");
  // console.log(charts);
  /**
   * @property {Tvs1ChartDashboardPreference[]}
   */
  let chartList = [];

  // now we have to make the post request to save the data in database
  const apiEndpoint = dashboardApis.collection.findByName(
    dashboardApis.collectionNames.Tvs1dashboardpreferences
  );

  Array.prototype.forEach.call(charts, (chart) => {
    //console.log(chart);
    chartList.push(
      new Tvs1ChartDashboardPreference({
        type: "Tvs1dashboardpreferences",
        fields: new Tvs1ChartDashboardPreferenceField({
          Active: $(chart).find(".on-editor-change-mode").attr("is-hidden") == true ||
            $(chart).find(".on-editor-change-mode").attr("is-hidden") == "true"
            ? false
            : true,
          ChartID: $(chart).attr("chart-id"),
          ID: $(chart).attr("pref-id"),
          EmployeeID: employeeId,
          Chartname: $(chart).attr("chart-name"),
          Position: parseInt($(chart).attr("position")),
          ChartGroup: $(chart).attr("chart-group"),
          TabGroup: _tabGroup,
          ChartWidth: ChartHandler.calculateWidth(chart),
          ChartHeight: ChartHandler.calculateHeight(chart),
        }),
      })
    );
  });

  for (const _chart of chartList) {
    // chartList.forEach(async (chart) => {
    //console.log("Saving chart");
    const ApiResponse = await apiEndpoint.fetch(null, {
      method: "POST",
      headers: ApiService.getPostHeaders(),
      body: JSON.stringify(_chart),
    });

    if (ApiResponse.ok == true) {
      const jsonResponse = await ApiResponse.json();
      // console.log(
      //   "Chart: " +
      //     _chart.ChartName +
      //     " will be hidden ? " +
      //     !_chart.fields.Active
      // );
    }
    //});
  }
}

Template.allChartLists.onRendered(function () {
  const templateObject = Template.instance();

  _tabGroup = $("#connectedSortable").data("tabgroup");
  _chartGroup = $("#connectedSortable").data("chartgroup");

  templateObject.hideChartElements = () => {
    // on edit mode false
    // $(".on-editor-change-mode").removeClass("showelement");
    // $(".on-editor-change-mode").addClass("hideelement");

    var dimmedElements = document.getElementsByClassName("dimmedChart");
    while (dimmedElements.length > 0) {
      dimmedElements[0].classList.remove("dimmedChart");
    }
  };

  templateObject.showChartElements = function () {
    // on edit mode true

    // $(".on-editor-change-mode").addClass("showelement");
    // $(".on-editor-change-mode").removeClass("hideelement");

    $(".card").addClass("dimmedChart");
    $(".py-2").removeClass("dimmedChart");
  };
  templateObject.checkChartToDisplay = async () => {
    let defaultChartList = [];
    let chartList = [];

    const dashboardApis = new DashboardApi(); // Load all dashboard APIS 

    let displayedCharts = 0;    
    chartList = await ChartHandler.getTvs1charts()
    if( chartList.length == 0 ){
      // Fetching data from API
      const allChartsEndpoint = dashboardApis.collection.findByName(
        dashboardApis.collectionNames.vs1charts
      );
      allChartsEndpoint.url.searchParams.append("ListType", "'Detail'");
      const allChartResponse = await allChartsEndpoint.fetch();

      if (allChartResponse.ok == true) {
        const allChartsJsonResponse = await allChartResponse.json();
        //console.log(allChartsJsonResponse);
        chartList = Tvs1chart.fromList(allChartsJsonResponse.tvs1charts);
      }
    }

    if( chartList.length > 0 ){
      // console.log(allChartResponse);
      // console.log('chartlist', chartList);
      // the goal here is to get the right names so it can be used for preferences
      chartList.forEach((chart) => {
        //chart.fields.active = false; // Will set evething to false
        chart.fields._chartSlug =
          chart.fields.ChartGroup.toLowerCase() +
          "__" +
          chart.fields.ChartName.toLowerCase().split(" ").join("_");

        $(`[key='${chart.fields._chartSlug}']`).addClass("chart-visibility");
        $(`[key='${chart.fields._chartSlug}']`).attr(
          "chart-id",
          chart.fields.ID
        );

        if (chart.fields.ChartGroup == _chartGroup) {
          // Default charts
          defaultChartList.push(chart.fields._chartSlug);

          $(`[key='${chart.fields._chartSlug}'] .on-editor-change-mode`).text(
            "Hide"
          );
          $(`[key='${chart.fields._chartSlug}'] .on-editor-change-mode`).attr(
            "is-hidden",
            "false"
          );
          $(`[key='${chart.fields._chartSlug}']`).removeClass("hideelement");
          if( chart.fields._chartSlug == 'accounts__profit_and_loss' ){
            $(`[key='dashboard__profit_and_loss']`).removeClass("hideelement");
          }
          if( chart.fields._chartSlug == 'sales__sales_overview'){
            $(`[key='contacts__top_10_customers']`).removeClass("hideelement");
            $(`[key='dashboard__employee_sales_comparison']`).removeClass("hideelement");
          }
          if( chart.fields._chartSlug == 'inventory__stock_on_hand_and_demand'){
            $(`[key='contacts__top_10_supplies']`).removeClass("hideelement");
          }
        } else {
          $(`[key='${chart.fields._chartSlug}'] .on-editor-change-mode`).text(
            "Show"
          );
          $(`[key='${chart.fields._chartSlug}'] .on-editor-change-mode`).attr(
            "is-hidden",
            "true"
          );
        }

        // $(`[key='${chart.fields._chartSlug}']`).attr(
        //   "pref-id",
        //   chart.fields.ID
        // );
        $(`[key='${chart.fields._chartSlug}']`).attr(
          "chart-slug",
          chart.fields._chartSlug
        );

        $(`[key='${chart.fields._chartSlug}']`).attr(
          "chart-group",
          chart.fields.ChartGroup
        );

        $(`[key='${chart.fields._chartSlug}']`).attr(
          "chart-name",
          chart.fields.ChartName
        );
        $(`[key='${chart.fields._chartSlug}']`).attr(
          "chart-active",
          chart.fields.Active
        );
        $(`[key='${chart.fields._chartSlug}']`).attr(
          "chart-user-pref-is-hidden",
          !chart.fields.Active
        );
      });
    }

    // Now get user preferences
    let tvs1ChartDashboardPreference = await ChartHandler.getLocalChartPreferences( _tabGroup );
    // console.log('tvs1ChartDashboardPreference', tvs1ChartDashboardPreference)
    
    if (tvs1ChartDashboardPreference.length > 0) {
      // if charts to be displayed are specified
      tvs1ChartDashboardPreference.forEach((tvs1chart, index) => {
        // setTimeout(() => {
        // this is good to see how the charts are apearing or not
        //if (tvs1chart.fields.ChartGroup == "Dashboard") {
        const itemName =
          tvs1chart.fields.ChartGroup.toLowerCase() +
          "__" +
          tvs1chart.fields.Chartname.toLowerCase().split(" ").join("_"); // this is the new item name

        //localStorage.setItem(itemName, tvs1chart);
        //console.log(itemName + " " + tvs1chart.fields.Active);

        //if (itemList.includes(itemName) == true) {
        // If the item name exist
        if( tvs1chart.fields.ChartWidth ){
          $(`[key='${itemName}'] .ui-resizable`).parents('.sortable-chart-widget-js').css(
            "width",
            tvs1chart.fields.ChartWidth + '%'
          );
        }

        $(`[key='${itemName}'] .ui-resizable`).parents(".sortable-chart-widget-js").removeClass("col-md-8 col-md-6 col-md-4");
        $(`[key='${itemName}'] .ui-resizable`).parents(".sortable-chart-widget-js").addClass("resizeAfterChart");

        // This the default size if ever it zero
        // if ($(`[key='${itemName}'] .ui-resizable`).width() < 150) {
        //   $(`[key='${itemName}'] .ui-resizable`).css("width", "500px");
        // }

        // This is the ChartHeight saved in the preferences
        if( tvs1chart.fields.ChartHeight ){
          $(`[key='${itemName}'] .ui-resizable`).css(
            "height",
            tvs1chart.fields.ChartHeight + 'vh'
          );
        }

        // This the default size if ever it zero
        // if ($(`[key='${itemName}'] .ui-resizable`).height() < 150) {
        //   $(`[key='${itemName}'] .ui-resizable`).css("height", "350px");
          
        //   const height = $(`[key='${itemName}'] .card-body`).height();
        //   console.log(height);
        //   $(`[key='${itemName}'] canvas`).attr("height", height);
        //   $(`[key='${itemName}'] canvas`).css("height", `${height}px`);
        // }

        $(`[key='${itemName}']`).attr("pref-id", tvs1chart.fields.ID);
        $(`[key='${itemName}']`).attr("position", tvs1chart.fields.Position);
        $(`[key='${itemName}']`).attr("chart-id", tvs1chart.fields.ChartID);
        $(`[key='${itemName}']`).attr(
          "chart-group",
          tvs1chart.fields.chartGroup
        );
        $(`[key='${itemName}']`).addClass("chart-visibility");
        //$(`[key='${itemName}']`).attr('chart-id', tvs1chart.fields.Id);
        $(`[key='${itemName}'] .on-editor-change-mode`).attr(
          "chart-slug",
          itemName
        );

        if (tvs1chart.fields.Active == true) {
          $(`[key='${itemName}'] .on-editor-change-mode`).text("Hide");
          $(`[key='${itemName}'] .on-editor-change-mode`).attr(
            "is-hidden",
            "false"
          );

          $(`[key='${itemName}']`).removeClass("hideelement");
          //$(`[key='${itemName}']`).attr("is-hidden", false);
        } else {
          $(`[key='${itemName}']`).addClass("hideelement");
          $(`[key='${itemName}'] .on-editor-change-mode`).text("Show");
          // $(`[key='${itemName}']`).attr("is-hidden", true);
          $(`[key='${itemName}'] .on-editor-change-mode`).attr(
            "is-hidden",
            "true"
          );
        }
        //}
        //}
        // }, index * 100);
      });
      // Handle sorting
      let $chartWrappper = $(".connectedChartSortable");
      $chartWrappper
        .find(".sortable-chart-widget-js")
        .sort(function (a, b) {
          return +a.getAttribute("position") - +b.getAttribute("position");
        })
        .appendTo($chartWrappper);

      displayedCharts = document.querySelectorAll(
        ".chart-visibility:not(.hideelement)"
      );
      // console.log("itemlist", defaultChartList);
      if (displayedCharts.length == 0) {
        // this will show all by default
        //console.log("No charts are being displayed, so show everything");
        // defaultChartList.forEach((item) => {
        //   $(`[key='${item}'] .on-editor-change-mode`).text("Hide");
        //   $(`[key='${item}'] .on-editor-change-mode`).attr("is-hidden", false);
        //   $(`[key='${item}'] .on-editor-change-mode`).attr("chart-slug", item);
        //   $(`[key='${item}']`).removeClass("hideelement");
        //   $(`[key='${item}']`).addClass("chart-visibility");
        // });

        // show only the first one
        let item = defaultChartList.length ? defaultChartList[0] : "";
        if (item) {
          $(`[key='${item}'] .on-editor-change-mode`).text("Hide");
          $(`[key='${item}'] .on-editor-change-mode`).attr("is-hidden", false);
          $(`[key='${item}'] .on-editor-change-mode`).attr("chart-slug", item);
          $(`[key='${item}']`).removeClass("hideelement");
          $(`[key='${item}']`).addClass("chart-visibility");
          ChartHandler.buildPositions();
        }
      }
    } else {
      // This made to fix the charts display if char
      //$(".sortable-chart-widget-js").removeClass('col-md-6');
      //$(".sortable-chart-widget-js ").css('width', "50%");
      // $('.expense-widget').css('width', "50%");
      // $(".sortable-chart-widget-js canvas").css("height", "320px"); // default height
    }
    // $('[key=purchases__expenses_breakdown]').css('width', "50%");
    // $('#expensebreakdownchart').css('height', '320px');
    // $('#expensebreakdownchart').attr('height', "320");

    // let sortableWidgets = $('.sortable-chart-widget-js');
    // // and now we need to sort
    // var sort_by_position = function (a, b) {
    //   // console.log(a.getAttribute('position'));
    //   // console.log(b.getAttribute('position'));
    //   if(parseInt(a.getAttribute('position'))
    //   .localeCompare(parseInt(b.getAttribute('position'))) == parseInt(a.getAttribute('position'))) {
    //     return a.innerHtml;
    //   }else {
    //     return b.innerHtml;
    //   }

    // };
    // sortableWidgets.sort(sort_by_position);
    // for (var i = 0; i < sortableWidgets.length; i++) {
    //   sortableWidgets[i].parentNode.appendChild(sortableWidgets[i]);
    // }

    /// after everything will add the nessecary css to let the chart adjust in the
    $(".chart-area").addClass("responsive-chart");
  };
  templateObject.deactivateDraggable = () => {
    draggableCharts.disable();
    resizableCharts.disable(); // this will disable charts resiable features
  };
  templateObject.activateDraggable = () => {
    draggableCharts.enable();
    resizableCharts.enable(); // this will enable charts resiable features
  };
  templateObject.checkChartToDisplay(); // we run this so we load the correct charts to diplay
  templateObject.activateDraggable(); // this will enable charts resiable features
});

Template.allChartLists.events({
  "click .on-editor-change-mode": (e) => {
    // this will toggle the visibility of the widget
    if ($(e.currentTarget).attr("is-hidden") == "true") {
      // console.log('was true');
      // $(e.currentTarget).parent(".chart-visibility").attr("is-hidden", 'false');
      // $(e.currentTarget).parent(".chart-visibility").addClass('hideelement');
      $(e.currentTarget).attr("is-hidden", "false");

      $(e.currentTarget).text("Hide");
    } else {
      // console.log('was false');
      // $(e.currentTarget).parent(".chart-visibility").attr("is-hidden", 'true');
      // $(e.currentTarget).parent(".chart-visibility").removeClass('hideelement');
      $(e.currentTarget).attr("is-hidden", "true");
      $(e.currentTarget).text("Show");
    }
    // const templateObject = Template.instance();
  },
  "mouseover .card-header": (e) => {
    $(e.currentTarget).parent(".card").addClass("hovered");
  },
  "mouseleave .card-header": (e) => {
    $(e.currentTarget).parent(".card").removeClass("hovered");
  },
  "click .btnBatchUpdate": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    batchUpdateCall();
  },
  "click .editchartsbtn": () => {
    $(".editcharts").trigger("click");
    chartsEditor.enable();

    const templateObject = Template.instance();
    templateObject.showChartElements();
  },

  "click #resetcharts": () => {
    chartsEditor.disable();
    const templateObject = Template.instance();

    $("#btnDone").addClass("hideelement");
    $("#btnDone").removeClass("showelement");
    $("#btnCancel").addClass("hideelement");
    $("#btnCancel").removeClass("showelement");
    $("#editcharts").addClass("showelement");
    $("#editcharts").removeClass("hideelement");
    $(".btnchartdropdown").removeClass("hideelement");
    $(".btnchartdropdown").addClass("showelement");

    // set everything to true
    localStorage.setItem("profitchat", true);
    localStorage.setItem("profitloss", true);
    localStorage.setItem("resaleschat", true);
    localStorage.setItem("quotedinvoicedchart", true);
    localStorage.setItem("earningschat", true);
    localStorage.setItem("expenseschart", true);

    templateObject.hideChartElements();
    templateObject.checkChartToDisplay();
    // templateObject.deactivateDraggable();
  },
  "click #btnCancel": async () => {
    $(".fullScreenSpin").css("display", "block");
    chartsEditor.disable();
    const templateObject = Template.instance();
    await templateObject.hideChartElements();
    await templateObject.checkChartToDisplay();
    $(".fullScreenSpin").css("display", "none");
    //templateObject.deactivateDraggable();
  },

  "click #btnDone": async () => {
    const templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "block");
    await saveCharts();
    await chartsEditor.disable();
    await templateObject.hideChartElements();
      // Save Into local indexDB
    await ChartHandler.saveChartsInLocalDB();
    await templateObject.checkChartToDisplay();
    $(".fullScreenSpin").css("display", "none");
  },
});
