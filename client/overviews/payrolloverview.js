import { ContactService } from "../contacts/contact-service";
import { ReactiveVar } from "meteor/reactive-var";
import { CoreService } from "../js/core-service";
import { UtilityService } from "../utility-service";
import { ProductService } from "../product/product-service";
import XLSX from "xlsx";
import { SideBarService } from "../js/sidebar-service";
import "jquery-editable-select";
import draggableCharts from "../js/Charts/draggableCharts";
import resizableCharts from "../js/Charts/resizableCharts";
import Tvs1ChartDashboardPreference from "../js/Api/Model/Tvs1ChartDashboardPreference";
import ChartsApi from "../js/Api/ChartsApi";
import Tvs1chart from "../js/Api/Model/Tvs1Chart";
import ChartsEditor from "../js/Charts/ChartsEditor";
import Tvs1ChartDashboardPreferenceField from "../js/Api/Model/Tvs1ChartDashboardPreferenceField";
import ApiService from "../js/Api/Module/ApiService";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();


Template.payrolloverview.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.datatablerecords1 = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  templateObject.timesheetrecords = new ReactiveVar([]);
  templateObject.jobsrecords = new ReactiveVar([]);
  templateObject.selectedFile = new ReactiveVar();

  templateObject.includeAllProducts = new ReactiveVar();
  templateObject.includeAllProducts.set(true);

  templateObject.useProductCostaspayRate = new ReactiveVar();
  templateObject.useProductCostaspayRate.set(false);
  templateObject.loggeduserdata = new ReactiveVar([]);
  templateObject.clockedOnEmpData = new ReactiveVar([]);
  templateObject.allnoninvproducts = new ReactiveVar([]);

  templateObject.includePayrollClockOnOffOnly = new ReactiveVar();
  templateObject.includePayrollClockOnOffOnly.set(false);

  templateObject.deptrecords = new ReactiveVar();
});

Template.payrolloverview.onRendered(function () {
  $(".fullScreenSpin").css("display", "inline-block");
  let templateObject = Template.instance();
  let contactService = new ContactService();
  let productService = new ProductService();
  const customerList = [];
  let salesOrderTable;
  var splashArray = new Array();
  const dataTableList = [];
  const timeSheetList = [];
  const tableHeaderList = [];
  const loggedUserList = [];
  const clockedOnEmpList = [];
  const jobsList = [];
  let clockEntry = [];

  $(".formClassDate").datepicker({
    showOn: "button",
    buttonText: "Show Date",
    buttonImageOnly: true,
    buttonImage: "/img/imgCal2.png",
    dateFormat: "dd/mm/yy",
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
    onChangeMonthYear: function(year, month, inst){
    // Set date to picker
    $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
    // Hide (close) the picker
    $(this).datepicker('hide');
    // Change ttrigger the on change function
    $(this).trigger('change');
   }
  });

  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  $(".formClassDate").val(begunDate);
  $("#employee_name").val(Session.get("mySessionEmployee"));
  if (FlowRouter.current().queryParams.success) {
    $(".btnRefresh").addClass("btnRefreshAlert");
  }

  let currentId = FlowRouter.current().context.hash;

  if (currentId === "clockOnOff") {
    setTimeout(function () {
      $("#btnClockOnOff").trigger("click");
    }, 500);
  }

  let launchClockOnOff = Session.get("CloudTimesheetLaunch") || false;
  let canClockOnClockOff = Session.get("CloudClockOnOff") || false;
  let timesheetStartStop = Session.get("CloudTimesheetStartStop") || false;
  let showTimesheet = Session.get("CloudShowTimesheet") || false;

  let isTimesheetEntry = Session.get("CloudTimesheetEntry");
  let isShowTimesheet = Session.get("CloudShowTimesheet");
  let isTimesheetCreate = Session.get("CloudCreateTimesheet");
  let isEditTimesheetHours = Session.get("CloudEditTimesheetHours");
  let isClockOnOff = Session.get("CloudClockOnOff");

  if (
    !isTimesheetEntry &&
    !isShowTimesheet &&
    !isTimesheetCreate &&
    !isEditTimesheetHours &&
    isClockOnOff
  ) {
    templateObject.includePayrollClockOnOffOnly.set(true);
    // $("#settingsModal").modal({"backdrop": "static"});
  }

  if (launchClockOnOff == true && canClockOnClockOff == true) {
    setTimeout(function () {
      $("#btnClockOnOff").trigger("click");
    }, 500);
  }

  /*Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPayHistorylist', function (error, result) {
        if (error) {}
        else {
            if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;
                    // let columnindex = customcolumn[i].index + 1;
                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });*/

  templateObject.endTimePopUp = function () {
    swal({
      title: "Please Note!",
      text: "By mannualy populating the Timesheet End Time, this will Clock you off when saving, Do you want to continue?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {
      } else {
        $("#endTime").val("");
        $("#txtBookedHoursSpent").val("00:00");
      }
    });
  };

  templateObject.checkAccessSaveRedirect = function () {
    let showTimesheetForm = Session.get("CloudShowTimesheet") || true;
    if (showTimesheetForm == true) {
      window.open("/timesheet", "_self");
    } else {
      window.open("/payrolloverview", "_self");
    }
  };

  templateObject.diff_hours = function (dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(diff);
  };

  templateObject.dateFormat = function (date) {
    var dateParts = date.split("/");
    var dateObject =
      dateParts[2] +
      "/" +
      ("0" + (dateParts[1] - 1)).toString().slice(-2) +
      "/" +
      dateParts[0];
    return dateObject;
  };

  templateObject.timeToDecimal = function (time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10);
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  };

  templateObject.timeFormat = function (hours) {
    var decimalTime = parseFloat(hours).toFixed(2);
    decimalTime = decimalTime * 60 * 60;
    var hours = Math.floor(decimalTime / (60 * 60));
    decimalTime = decimalTime - hours * 60 * 60;
    var minutes = Math.abs(decimalTime / 60);
    decimalTime = decimalTime - minutes * 60;
    hours = ("0" + hours).slice(-2);
    minutes = ("0" + Math.round(minutes)).slice(-2);
    let time = hours + ":" + minutes;
    return time;
  };

  templateObject.getLoggedUserData = function () {
    let dataListloggedUser = {};
    //let vs1EmployeeImage = Session.get('vs1EmployeeImages');
    let timesheetEmployeeData = templateObject.timesheetrecords.get();
    let encoded = "";
    for (let i = 0; i < timesheetEmployeeData.length; i++) {
      if (
        timesheetEmployeeData[i].isPaused == "Clocked On" ||
        timesheetEmployeeData[i].isPaused == "paused"
      ) {
        let employeeUser = timesheetEmployeeData[i].employee;
        dataListloggedUser = {
          //id: data.tappuser[i].EmployeeID || '',
          employeename: employeeUser || "- -",
          //ladtloging: data.tappuser[i].LastTime|| '',
          // employeepicture: encoded|| ''
        };
        loggedUserList.push(dataListloggedUser);
      }
    }
    templateObject.loggeduserdata.set(loggedUserList);
  };
  // setTimeout(function(){
  // templateObject.getLoggedUserData();
  // },1000);

  templateObject.resetData = function (dataVal) {
    window.open("/payrolloverview?page=last", "_self");
  };

  function MakeNegative() {
    $("td").each(function () {
      if (
        $(this)
          .text()
          .indexOf("-" + Currency) >= 0
      )
        $(this).addClass("text-danger");
    });
  }

  templateObject.getPayHistory = function () {
    getVS1Data("TPayHistory")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          sideBarService
            .getAllPayHistoryDataVS1(initialBaseDataLoad, 0)
            .then(function (data) {
              addVS1Data("TPayHistory", JSON.stringify(data));
              let lineItems = [];
              let lineItemObj = {};
              for (let i = 0; i < data.tpayhistory.length; i++) {
                let earning =
                  utilityService.modifynegativeCurrencyFormat(
                    data.tpayhistory[i].fields.Wages
                  ) || 0.0;
                let tax =
                  utilityService.modifynegativeCurrencyFormat(
                    data.tpayhistory[i].fields.Tax
                  ) || 0.0;
                let supernuation =
                  utilityService.modifynegativeCurrencyFormat(
                    data.tpayhistory[i].fields.Superannuation
                  ) || 0.0;
                let gross =
                  utilityService.modifynegativeCurrencyFormat(
                    data.tpayhistory[i].fields.Gross
                  ) || 0.0;
                let netpay =
                  utilityService.modifynegativeCurrencyFormat(
                    data.tpayhistory[i].fields.Net
                  ) || 0.0;
                let commission =
                  utilityService.modifynegativeCurrencyFormat(
                    data.tpayhistory[i].fields.Commission
                  ) || 0.0;
                let allowance =
                  utilityService.modifynegativeCurrencyFormat(
                    data.tpayhistory[i].fields.Allowances
                  ) || 0.0;
                let deduction =
                  utilityService.modifynegativeCurrencyFormat(
                    data.tpayhistory[i].fields.Deductions
                  ) || 0.0;
                var dataList = {
                  id: data.tpayhistory[i].fields.Employeeid || "",
                  employeename: data.tpayhistory[i].fields.Empname || "",
                  calendar: data.tpayhistory[i].fields.Payperiod || "",
                  earning: earning || "0.00",
                  tax: tax || "0.00",
                  super: supernuation || "0.00",
                  commission: commission || "0.00",
                  allowance: allowance || "0.00",
                  deduction: deduction || "0.00",
                  gross: gross || "0.00",
                  netpay: netpay || "0.00",
                  paydate:
                    data.tpayhistory[i].fields.DatePaid != ""
                      ? moment(data.tpayhistory[i].fields.DatePaid).format(
                          "DD/MM/YYYY"
                        )
                      : data.tpayhistory[i].fields.DatePaid,
                  paid: data.tpayhistory[i].fields.Paid || "",
                  notes: data.tpayhistory[i].fields.Paynotes || "",
                  payid: data.tpayhistory[i].fields.PayID || "",
                };

                dataTableList.push(dataList);
              }

              templateObject.datatablerecords.set(dataTableList);

              if (templateObject.datatablerecords.get()) {
                Meteor.call(
                  "readPrefMethod",
                  Session.get("mycloudLogonID"),
                  "tblPayHistorylist",
                  function (error, result) {
                    if (error) {
                    } else {
                      if (result) {
                        for (let i = 0; i < result.customFields.length; i++) {
                          let customcolumn = result.customFields;
                          let columData = customcolumn[i].label;
                          let columHeaderUpdate = customcolumn[
                            i
                          ].thclass.replace(/ /g, ".");
                          let hiddenColumn = customcolumn[i].hidden;
                          let columnClass = columHeaderUpdate.split(".")[1];
                          let columnWidth = customcolumn[i].width;
                          let columnindex = customcolumn[i].index + 1;

                          if (hiddenColumn == true) {
                            $("." + columnClass + "").addClass("hiddenColumn");
                            $("." + columnClass + "").removeClass("showColumn");
                          } else if (hiddenColumn == false) {
                            $("." + columnClass + "").removeClass(
                              "hiddenColumn"
                            );
                            $("." + columnClass + "").addClass("showColumn");
                          }
                        }
                      }
                    }
                  }
                );
              }

              setTimeout(function () {
                $("#tblPayHistorylist")
                  .DataTable({
                    columnDefs: [
                      {
                        orderable: false,
                        targets: [10],
                      },
                    ],
                    sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [
                      {
                        extend: "csvHtml5",
                        text: "",
                        download: "open",
                        className: "btntabletocsv hiddenColumn",
                        filename: "Pay History - " + moment().format(),
                        orientation: "portrait",
                        exportOptions: {
                          columns: ":visible",
                        },
                      },
                      {
                        extend: "print",
                        download: "open",
                        className: "btntabletopdf hiddenColumn",
                        text: "",
                        title: "Pay History",
                        filename: "Pay History - " + moment().format(),
                        exportOptions: {
                          columns: ":visible",
                          stripHtml: false,
                        },
                      },
                      {
                        extend: "excelHtml5",
                        title: "",
                        download: "open",
                        className: "btntabletoexcel hiddenColumn",
                        filename: "Pay History - " + moment().format(),
                        orientation: "portrait",
                        exportOptions: {
                          columns: ":visible",
                        },
                      },
                    ],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    // bStateSave: true,
                    // rowId: 0,
                    pageLength: initialDatatableLoad,
                    lengthMenu: [
                      [initialDatatableLoad, -1],
                      [initialDatatableLoad, "All"],
                    ],
                    info: true,
                    responsive: true,
                    order: [[1, "asc"]],
                    action: function () {
                      $("#tblPayHistorylist").DataTable().ajax.reload();
                    },
                    fnDrawCallback: function (oSettings) {
                      $(
                        "#tblPayHistorylist_paginate .paginate_button.page-item"
                      ).removeClass("disabled");
                      $("#tblPayHistorylist_ellipsis").addClass("disabled");

                      if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {
                          $(
                            "#tblPayHistorylist_paginate .paginate_button.page-item.previous"
                          ).addClass("disabled");
                          $(
                            "#tblPayHistorylist_paginate .paginate_button.page-item.next"
                          ).addClass("disabled");
                        }
                      } else {
                      }
                      if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $(
                          "#tblPayHistorylist_paginate .paginate_button.page-item.next"
                        ).addClass("disabled");
                      }
                      $(
                        ".paginate_button.next:not(.disabled)",
                        this.api().table().container()
                      ).on("click", function () {
                        $(".fullScreenSpin").css("display", "inline-block");
                        let dataLenght = oSettings._iDisplayLength;

                        sideBarService
                          .getAllPayHistoryDataVS1(
                            initialDatatableLoad,
                            oSettings.fnRecordsDisplay()
                          )
                          .then(function (dataObjectnew) {
                            getVS1Data("TPayHistory")
                              .then(function (dataObjectold) {
                                if (dataObjectold.length == 0) {
                                } else {
                                  let dataOld = JSON.parse(
                                    dataObjectold[0].data
                                  );

                                  var thirdaryData = $.merge(
                                    $.merge([], dataObjectnew.tpayhistory),
                                    dataOld.tpayhistory
                                  );
                                  let objCombineData = {
                                    tpayhistory: thirdaryData,
                                  };

                                  addVS1Data(
                                    "TPayHistory",
                                    JSON.stringify(objCombineData)
                                  )
                                    .then(function (datareturn) {
                                      templateObject.resetData(objCombineData);
                                      $(".fullScreenSpin").css(
                                        "display",
                                        "none"
                                      );
                                    })
                                    .catch(function (err) {
                                      $(".fullScreenSpin").css(
                                        "display",
                                        "none"
                                      );
                                    });
                                }
                              })
                              .catch(function (err) {});
                          })
                          .catch(function (err) {
                            $(".fullScreenSpin").css("display", "none");
                          });
                      });
                      setTimeout(function () {
                        MakeNegative();
                      }, 100);
                    },
                    fnInitComplete: function () {
                      let urlParametersPage =
                        FlowRouter.current().queryParams.page;
                      if (urlParametersPage) {
                        this.fnPageChange("last");
                      }
                      $(
                        "<button class='btn btn-primary btnRefreshPayRunList' type='button' id='btnRefreshPayRunList' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                      ).insertAfter("#tblPayHistorylist_filter");
                    },
                  })
                  .on("page", function () {
                    let draftRecord = templateObject.datatablerecords.get();
                    templateObject.datatablerecords.set(draftRecord);
                  })
                  .on("column-reorder", function () {});

                // $('#tblPayHistorylist').DataTable().column( 0 ).visible( true );
                //$('.fullScreenSpin').css('display', 'none');
              }, 0);

              var columns = $("#tblPayHistorylist th");
              let sTible = "";
              let sWidth = "";
              let sIndex = "";
              let sVisible = "";
              let columVisible = false;
              let sClass = "";
              $.each(columns, function (i, v) {
                if (v.hidden == false) {
                  columVisible = true;
                }
                if (v.className.includes("hiddenColumn")) {
                  columVisible = false;
                }
                sWidth = v.style.width.replace("px", "");
                let datatablerecordObj = {
                  sTitle: v.innerText || "",
                  sWidth: sWidth || "",
                  sIndex: v.cellIndex || "",
                  sVisible: columVisible || false,
                  sClass: v.className || "",
                };
                tableHeaderList.push(datatablerecordObj);
              });
              templateObject.tableheaderrecords.set(tableHeaderList);
              $("div.dataTables_filter input").addClass(
                "form-control form-control-sm"
              );
              $("#tblPayHistorylist tbody").on("click", "tr", function () {
                var listData = $(this).closest("tr").attr("id");
                if (listData) {
                  FlowRouter.go("/employeescard?id=" + listData);
                }
              });
            })
            .catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              //$('.fullScreenSpin').css('display', 'none');
              // Meteor._reload.reload();
            });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tpayhistory;

          let lineItems = [];
          let lineItemObj = {};
          for (let i = 0; i < data.tpayhistory.length; i++) {
            let earning =
              utilityService.modifynegativeCurrencyFormat(
                data.tpayhistory[i].fields.Wages
              ) || 0.0;
            let tax =
              utilityService.modifynegativeCurrencyFormat(
                data.tpayhistory[i].fields.Tax
              ) || 0.0;
            let supernuation =
              utilityService.modifynegativeCurrencyFormat(
                data.tpayhistory[i].fields.Superannuation
              ) || 0.0;
            let gross =
              utilityService.modifynegativeCurrencyFormat(
                data.tpayhistory[i].fields.Gross
              ) || 0.0;
            let netpay =
              utilityService.modifynegativeCurrencyFormat(
                data.tpayhistory[i].fields.Net
              ) || 0.0;
            let commission =
              utilityService.modifynegativeCurrencyFormat(
                data.tpayhistory[i].fields.Commission
              ) || 0.0;
            let allowance =
              utilityService.modifynegativeCurrencyFormat(
                data.tpayhistory[i].fields.Allowances
              ) || 0.0;
            let deduction =
              utilityService.modifynegativeCurrencyFormat(
                data.tpayhistory[i].fields.Deductions
              ) || 0.0;
            var dataList = {
              id: data.tpayhistory[i].fields.Employeeid || "",
              employeename: data.tpayhistory[i].fields.Empname || "",
              calendar: data.tpayhistory[i].fields.Payperiod || "",
              earning: earning || "0.00",
              tax: tax || "0.00",
              super: supernuation || "0.00",
              commission: commission || "0.00",
              allowance: allowance || "0.00",
              deduction: deduction || "0.00",
              gross: gross || "0.00",
              netpay: netpay || "0.00",
              paydate:
                data.tpayhistory[i].fields.DatePaid != ""
                  ? moment(data.tpayhistory[i].fields.DatePaid).format(
                      "DD/MM/YYYY"
                    )
                  : data.tpayhistory[i].fields.DatePaid,
              paid: data.tpayhistory[i].fields.Paid || "",
              notes: data.tpayhistory[i].fields.Paynotes || "",
              payid: data.tpayhistory[i].fields.PayID || "",
            };

            dataTableList.push(dataList);
          }

          templateObject.datatablerecords.set(dataTableList);

          if (templateObject.datatablerecords.get()) {
            Meteor.call(
              "readPrefMethod",
              Session.get("mycloudLogonID"),
              "tblPayHistorylist",
              function (error, result) {
                if (error) {
                } else {
                  if (result) {
                    for (let i = 0; i < result.customFields.length; i++) {
                      let customcolumn = result.customFields;
                      let columData = customcolumn[i].label;
                      let columHeaderUpdate = customcolumn[i].thclass.replace(
                        / /g,
                        "."
                      );
                      let hiddenColumn = customcolumn[i].hidden;
                      let columnClass = columHeaderUpdate.split(".")[1];
                      let columnWidth = customcolumn[i].width;
                      let columnindex = customcolumn[i].index + 1;

                      if (hiddenColumn == true) {
                        $("." + columnClass + "").addClass("hiddenColumn");
                        $("." + columnClass + "").removeClass("showColumn");
                      } else if (hiddenColumn == false) {
                        $("." + columnClass + "").removeClass("hiddenColumn");
                        $("." + columnClass + "").addClass("showColumn");
                      }
                    }
                  }
                }
              }
            );
          }

          setTimeout(function () {
            $("#tblPayHistorylist")
              .DataTable({
                columnDefs: [
                  {
                    orderable: false,
                    targets: [10],
                  },
                ],
                sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [
                  {
                    extend: "csvHtml5",
                    text: "",
                    download: "open",
                    className: "btntabletocsv hiddenColumn",
                    filename: "Pay History - " + moment().format(),
                    orientation: "portrait",
                    exportOptions: {
                      columns: ":visible",
                    },
                  },
                  {
                    extend: "print",
                    download: "open",
                    className: "btntabletopdf hiddenColumn",
                    text: "",
                    title: "Pay History",
                    filename: "Pay History - " + moment().format(),
                    exportOptions: {
                      columns: ":visible",
                      stripHtml: false,
                    },
                  },
                  {
                    extend: "excelHtml5",
                    title: "",
                    download: "open",
                    className: "btntabletoexcel hiddenColumn",
                    filename: "Pay History - " + moment().format(),
                    orientation: "portrait",
                    exportOptions: {
                      columns: ":visible",
                    },
                  },
                ],
                select: true,
                destroy: true,
                colReorder: true,
                paging: true,
                info: true,
                searching: true,
                responsive: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                  [initialDatatableLoad, -1],
                  [initialDatatableLoad, "All"],
                ],
                order: [[1, "asc"]],
                action: function () {
                  $("#tblPayHistorylist").DataTable().ajax.reload();
                },
                fnDrawCallback: function (oSettings) {
                  $(
                    "#tblPayHistorylist_paginate .paginate_button.page-item"
                  ).removeClass("disabled");
                  $("#tblPayHistorylist_ellipsis").addClass("disabled");

                  if (oSettings._iDisplayLength == -1) {
                    if (oSettings.fnRecordsDisplay() > 150) {
                      $(
                        "#tblPayHistorylist_paginate .paginate_button.page-item.previous"
                      ).addClass("disabled");
                      $(
                        "#tblPayHistorylist_paginate .paginate_button.page-item.next"
                      ).addClass("disabled");
                    }
                  } else {
                  }

                  if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                    $("#tblPayHistorylist_paginate .page-item.next").addClass(
                      "disabled"
                    );
                  }
                  $(
                    ".paginate_button.next:not(.disabled)",
                    this.api().table().container()
                  ).on("click", function () {
                    $(".fullScreenSpin").css("display", "inline-block");
                    let dataLenght = oSettings._iDisplayLength;

                    sideBarService
                      .getAllPayHistoryDataVS1(
                        initialDatatableLoad,
                        oSettings.fnRecordsDisplay()
                      )
                      .then(function (dataObjectnew) {
                        getVS1Data("TPayHistory")
                          .then(function (dataObjectold) {
                            if (dataObjectold.length == 0) {
                            } else {
                              let dataOld = JSON.parse(dataObjectold[0].data);

                              var thirdaryData = $.merge(
                                $.merge([], dataObjectnew.tpayhistory),
                                dataOld.tpayhistory
                              );
                              let objCombineData = {
                                tpayhistory: thirdaryData,
                              };

                              addVS1Data(
                                "TPayHistory",
                                JSON.stringify(objCombineData)
                              )
                                .then(function (datareturn) {
                                  templateObject.resetData(objCombineData);
                                  $(".fullScreenSpin").css("display", "none");
                                })
                                .catch(function (err) {
                                  $(".fullScreenSpin").css("display", "none");
                                });
                            }
                          })
                          .catch(function (err) {});
                      })
                      .catch(function (err) {
                        $(".fullScreenSpin").css("display", "none");
                      });
                  });
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                },
                fnInitComplete: function () {
                  let urlParametersPage = FlowRouter.current().queryParams.page;
                  if (urlParametersPage) {
                    this.fnPageChange("last");
                  }
                  $(
                    "<button class='btn btn-primary btnRefreshPayRunList' type='button' id='btnRefreshPayRunList' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                  ).insertAfter("#tblPayHistorylist_filter");
                },
              })
              .on("page", function () {
                let draftRecord = templateObject.datatablerecords.get();
                templateObject.datatablerecords.set(draftRecord);
              })
              .on("column-reorder", function () {});

            // $('#tblPayHistorylist').DataTable().column( 0 ).visible( true );
            //$('.fullScreenSpin').css('display', 'none');
          }, 0);

          var columns = $("#tblPayHistorylist th");
          let sTible = "";
          let sWidth = "";
          let sIndex = "";
          let sVisible = "";
          let columVisible = false;
          let sClass = "";
          $.each(columns, function (i, v) {
            if (v.hidden == false) {
              columVisible = true;
            }
            if (v.className.includes("hiddenColumn")) {
              columVisible = false;
            }
            sWidth = v.style.width.replace("px", "");
            let datatablerecordObj = {
              sTitle: v.innerText || "",
              sWidth: sWidth || "",
              sIndex: v.cellIndex || "",
              sVisible: columVisible || false,
              sClass: v.className || "",
            };
            tableHeaderList.push(datatablerecordObj);
          });
          templateObject.tableheaderrecords.set(tableHeaderList);
          $("div.dataTables_filter input").addClass(
            "form-control form-control-sm"
          );
          $("#tblPayHistorylist tbody").on("click", "tr", function () {
            var listData = $(this).closest("tr").attr("id");
            if (listData) {
              FlowRouter.go("/employeescard?id=" + listData);
            }
          });
        }
      })
      .catch(function (err) {
        sideBarService
          .getAllPayHistoryDataVS1(initialBaseDataLoad, 0)
          .then(function (data) {
            addVS1Data("TPayHistory", JSON.stringify(data));
            let lineItems = [];
            let lineItemObj = {};
            for (let i = 0; i < data.tpayhistory.length; i++) {
              let earning =
                utilityService.modifynegativeCurrencyFormat(
                  data.tpayhistory[i].fields.Wages
                ) || 0.0;
              let tax =
                utilityService.modifynegativeCurrencyFormat(
                  data.tpayhistory[i].fields.Tax
                ) || 0.0;
              let supernuation =
                utilityService.modifynegativeCurrencyFormat(
                  data.tpayhistory[i].fields.Superannuation
                ) || 0.0;
              let gross =
                utilityService.modifynegativeCurrencyFormat(
                  data.tpayhistory[i].fields.Gross
                ) || 0.0;
              let netpay =
                utilityService.modifynegativeCurrencyFormat(
                  data.tpayhistory[i].fields.Net
                ) || 0.0;
              let commission =
                utilityService.modifynegativeCurrencyFormat(
                  data.tpayhistory[i].fields.Commission
                ) || 0.0;
              let allowance =
                utilityService.modifynegativeCurrencyFormat(
                  data.tpayhistory[i].fields.Allowances
                ) || 0.0;
              let deduction =
                utilityService.modifynegativeCurrencyFormat(
                  data.tpayhistory[i].fields.Deductions
                ) || 0.0;
              var dataList = {
                id: data.tpayhistory[i].fields.Employeeid || "",
                employeename: data.tpayhistory[i].fields.Empname || "",
                calendar: data.tpayhistory[i].fields.Payperiod || "",
                earning: earning || "0.00",
                tax: tax || "0.00",
                super: supernuation || "0.00",
                commission: commission || "0.00",
                allowance: allowance || "0.00",
                deduction: deduction || "0.00",
                gross: gross || "0.00",
                netpay: netpay || "0.00",
                paydate:
                  data.tpayhistory[i].fields.DatePaid != ""
                    ? moment(data.tpayhistory[i].fields.DatePaid).format(
                        "DD/MM/YYYY"
                      )
                    : data.tpayhistory[i].fields.DatePaid,
                paid: data.tpayhistory[i].fields.Paid || "",
                notes: data.tpayhistory[i].fields.Paynotes || "",
                payid: data.tpayhistory[i].fields.PayID || "",
              };

              dataTableList.push(dataList);
            }

            templateObject.datatablerecords.set(dataTableList);
            if (templateObject.datatablerecords.get()) {
              Meteor.call(
                "readPrefMethod",
                Session.get("mycloudLogonID"),
                "tblPayHistorylist",
                function (error, result) {
                  if (error) {
                  } else {
                    if (result) {
                      for (let i = 0; i < result.customFields.length; i++) {
                        let customcolumn = result.customFields;
                        let columData = customcolumn[i].label;
                        let columHeaderUpdate = customcolumn[i].thclass.replace(
                          / /g,
                          "."
                        );
                        let hiddenColumn = customcolumn[i].hidden;
                        let columnClass = columHeaderUpdate.split(".")[1];
                        let columnWidth = customcolumn[i].width;
                        let columnindex = customcolumn[i].index + 1;

                        if (hiddenColumn == true) {
                          $("." + columnClass + "").addClass("hiddenColumn");
                          $("." + columnClass + "").removeClass("showColumn");
                        } else if (hiddenColumn == false) {
                          $("." + columnClass + "").removeClass("hiddenColumn");
                          $("." + columnClass + "").addClass("showColumn");
                        }
                      }
                    }
                  }
                }
              );
            }

            setTimeout(function () {
              $("#tblPayHistorylist")
                .DataTable({
                  columnDefs: [
                    {
                      orderable: false,
                      targets: [10],
                    },
                  ],
                  sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                    {
                      extend: "csvHtml5",
                      text: "",
                      download: "open",
                      className: "btntabletocsv hiddenColumn",
                      filename: "Pay History - " + moment().format(),
                      orientation: "portrait",
                      exportOptions: {
                        columns: ":visible",
                      },
                    },
                    {
                      extend: "print",
                      download: "open",
                      className: "btntabletopdf hiddenColumn",
                      text: "",
                      title: "Pay History",
                      filename: "Pay History - " + moment().format(),
                      exportOptions: {
                        columns: ":visible",
                        stripHtml: false,
                      },
                    },
                    {
                      extend: "excelHtml5",
                      title: "",
                      download: "open",
                      className: "btntabletoexcel hiddenColumn",
                      filename: "Pay History - " + moment().format(),
                      orientation: "portrait",
                      exportOptions: {
                        columns: ":visible",
                      },
                    },
                  ],
                  select: true,
                  destroy: true,
                  colReorder: true,
                  // bStateSave: true,
                  // rowId: 0,
                  pageLength: initialDatatableLoad,
                  lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"],
                  ],
                  info: true,
                  responsive: true,
                  order: [[1, "asc"]],
                  action: function () {
                    $("#tblPayHistorylist").DataTable().ajax.reload();
                  },
                  fnDrawCallback: function (oSettings) {
                    $(
                      "#tblPayHistorylist_paginate .paginate_button.page-item"
                    ).removeClass("disabled");
                    $("#tblPayHistorylist_ellipsis").addClass("disabled");

                    if (oSettings._iDisplayLength == -1) {
                      if (oSettings.fnRecordsDisplay() > 150) {
                        $(
                          "#tblPayHistorylist_paginate .paginate_button.page-item.previous"
                        ).addClass("disabled");
                        $(
                          "#tblPayHistorylist_paginate .paginate_button.page-item.next"
                        ).addClass("disabled");
                      }
                    } else {
                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                      $(".paginate_button.page-item.next").addClass("disabled");
                    }
                    $(
                      ".paginate_button.next:not(.disabled)",
                      this.api().table().container()
                    ).on("click", function () {
                      $(".fullScreenSpin").css("display", "inline-block");
                      let dataLenght = oSettings._iDisplayLength;

                      sideBarService
                        .getAllPayHistoryDataVS1(
                          initialDatatableLoad,
                          oSettings.fnRecordsDisplay()
                        )
                        .then(function (dataObjectnew) {
                          getVS1Data("TPayHistory")
                            .then(function (dataObjectold) {
                              if (dataObjectold.length == 0) {
                              } else {
                                let dataOld = JSON.parse(dataObjectold[0].data);

                                var thirdaryData = $.merge(
                                  $.merge([], dataObjectnew.tpayhistory),
                                  dataOld.tpayhistory
                                );
                                let objCombineData = {
                                  tpayhistory: thirdaryData,
                                };

                                addVS1Data(
                                  "TPayHistory",
                                  JSON.stringify(objCombineData)
                                )
                                  .then(function (datareturn) {
                                    templateObject.resetData(objCombineData);
                                    $(".fullScreenSpin").css("display", "none");
                                  })
                                  .catch(function (err) {
                                    $(".fullScreenSpin").css("display", "none");
                                  });
                              }
                            })
                            .catch(function (err) {});
                        })
                        .catch(function (err) {
                          $(".fullScreenSpin").css("display", "none");
                        });
                    });
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                  },
                  fnInitComplete: function () {
                    let urlParametersPage =
                      FlowRouter.current().queryParams.page;
                    if (urlParametersPage) {
                      this.fnPageChange("last");
                    }
                    $(
                      "<button class='btn btn-primary btnRefreshPayRunList' type='button' id='btnRefreshPayRunList' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                    ).insertAfter("#tblPayHistorylist_filter");
                  },
                })
                .on("page", function () {
                  let draftRecord = templateObject.datatablerecords.get();
                  templateObject.datatablerecords.set(draftRecord);
                })
                .on("column-reorder", function () {});

              // $('#tblPayHistorylist').DataTable().column( 0 ).visible( true );
              //$('.fullScreenSpin').css('display', 'none');
            }, 0);

            var columns = $("#tblPayHistorylist th");
            let sTible = "";
            let sWidth = "";
            let sIndex = "";
            let sVisible = "";
            let columVisible = false;
            let sClass = "";
            $.each(columns, function (i, v) {
              if (v.hidden == false) {
                columVisible = true;
              }
              if (v.className.includes("hiddenColumn")) {
                columVisible = false;
              }
              sWidth = v.style.width.replace("px", "");
              let datatablerecordObj = {
                sTitle: v.innerText || "",
                sWidth: sWidth || "",
                sIndex: v.cellIndex || "",
                sVisible: columVisible || false,
                sClass: v.className || "",
              };
              tableHeaderList.push(datatablerecordObj);
            });
            templateObject.tableheaderrecords.set(tableHeaderList);
            $("div.dataTables_filter input").addClass(
              "form-control form-control-sm"
            );
            $("#tblPayHistorylist tbody").on("click", "tr", function () {
              var listData = $(this).closest("tr").attr("id");
              if (listData) {
                FlowRouter.go("/employeescard?id=" + listData);
              }
            });
          })
          .catch(function (err) {
            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
            //$('.fullScreenSpin').css('display', 'none');
            // Meteor._reload.reload();
          });
      });
  };

  templateObject.getPayHistory();

  templateObject.getEmployees = function () {
    getVS1Data("TEmployee")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          sideBarService
            .getAllEmployees(initialBaseDataLoad, 0)
            .then(function (data) {
              addVS1Data("TEmployee", JSON.stringify(data));
              let lineItems = [];
              let lineItemObj = {};
              for (let i = 0; i < data.temployee.length; i++) {
                var dataList = {
                  id: data.temployee[i].fields.ID || "",
                  employeeno: data.temployee[i].fields.EmployeeNo || "",
                  employeename: data.temployee[i].fields.EmployeeName || "",
                  firstname: data.temployee[i].fields.FirstName || "",
                  lastname: data.temployee[i].fields.LastName || "",
                  phone: data.temployee[i].fields.Phone || "",
                  mobile: data.temployee[i].fields.Mobile || "",
                  email: data.temployee[i].fields.Email || "",
                  address: data.temployee[i].fields.Street || "",
                  country: data.temployee[i].fields.Country || "",
                  department: data.temployee[i].fields.DefaultClassName || "",
                  custFld1: data.temployee[i].fields.CustFld1 || "",
                  custFld2: data.temployee[i].fields.CustFld2 || "",
                  custFld3: data.temployee[i].fields.CustFld3 || "",
                  custFld4: data.temployee[i].fields.CustFld4 || "",
                };

                if (
                  data.temployee[i].fields.EmployeeName.replace(/\s/g, "") != ""
                ) {
                  if (
                    Session.get("mySessionEmployee") ==
                    data.temployee[i].fields.EmployeeName
                  ) {
                    if (data.temployee[i].fields.CustFld8 == "false") {
                      templateObject.includeAllProducts.set(false);
                    }
                  }
                }
                //}
              }
            })
            .catch(function (err) {});
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.temployee;

          let lineItems = [];
          let lineItemObj = {};
          for (let i = 0; i < useData.length; i++) {
            var dataList = {
              id: useData[i].fields.ID || "",
              employeeno: useData[i].fields.EmployeeNo || "",
              employeename: useData[i].fields.EmployeeName || "",
              firstname: useData[i].fields.FirstName || "",
              lastname: useData[i].fields.LastName || "",
              phone: useData[i].fields.Phone || "",
              mobile: useData[i].fields.Mobile || "",
              email: useData[i].fields.Email || "",
              address: useData[i].fields.Street || "",
              country: useData[i].fields.Country || "",
              department: useData[i].fields.DefaultClassName || "",
              custFld1: useData[i].fields.CustFld1 || "",
              custFld2: useData[i].fields.CustFld2 || "",
              custFld3: useData[i].fields.CustFld3 || "",
              custFld4: useData[i].fields.CustFld4 || "",
            };

            if (useData[i].fields.EmployeeName.replace(/\s/g, "") != "") {
              if (
                Session.get("mySessionEmployee") ==
                useData[i].fields.EmployeeName
              ) {
                if (useData[i].fields.CustFld8 == "false") {
                  templateObject.includeAllProducts.set(false);
                }
              }
            }
            //}
          }
        }
      })
      .catch(function (err) {
        sideBarService
          .getAllEmployees(initialBaseDataLoad, 0)
          .then(function (data) {
            addVS1Data("TEmployee", JSON.stringify(data));
            let lineItems = [];
            let lineItemObj = {};
            for (let i = 0; i < data.temployee.length; i++) {
              var dataList = {
                id: data.temployee[i].fields.ID || "",
                employeeno: data.temployee[i].fields.EmployeeNo || "",
                employeename: data.temployee[i].fields.EmployeeName || "",
                firstname: data.temployee[i].fields.FirstName || "",
                lastname: data.temployee[i].fields.LastName || "",
                phone: data.temployee[i].fields.Phone || "",
                mobile: data.temployee[i].fields.Mobile || "",
                email: data.temployee[i].fields.Email || "",
                address: data.temployee[i].fields.Street || "",
                country: data.temployee[i].fields.Country || "",
                department: data.temployee[i].fields.DefaultClassName || "",
                custFld1: data.temployee[i].fields.CustFld1 || "",
                custFld2: data.temployee[i].fields.CustFld2 || "",
                custFld3: data.temployee[i].fields.CustFld3 || "",
                custFld4: data.temployee[i].fields.CustFld4 || "",
              };

              if (
                data.temployee[i].fields.EmployeeName.replace(/\s/g, "") != ""
              ) {
                if (
                  Session.get("mySessionEmployee") ==
                  data.temployee[i].fields.EmployeeName
                ) {
                  if (data.temployee[i].fields.CustFld8 == "false") {
                    templateObject.includeAllProducts.set(false);
                  }
                }
              }
              //}
            }
          })
          .catch(function (err) {});
      });
  };

  templateObject.getEmployees();
  //templateObject.getEmployeeClockOnClockOff();

  templateObject.getJobs = function () {
    getVS1Data("TJobVS1")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          contactService
            .getAllJobsNameData()
            .then(function (data) {
              let lineItems = [];
              let lineItemObj = {};

              for (let i = 0; i < data.tjobvs1.length; i++) {
                var dataListJobs = {
                  id: data.tjobvs1[i].Id || "",
                  jobname: data.tjobvs1[i].ClientName || "",
                  // employeename:data.tjobvs1[i].EmployeeName || '',
                };

                if (data.tjobvs1[i].ClientName.replace(/\s/g, "") != "") {
                  $("#sltJob").editableSelect(
                    "add",
                    data.tjobvs1[i].ClientName
                  );
                  jobsList.push(dataListJobs);
                }
                //}
              }

              templateObject.jobsrecords.set(jobsList);
            })
            .catch(function (err) {
              // $('.fullScreenSpin').css('display', 'none');
            });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tjobvs1;
          for (let i = 0; i < useData.length; i++) {
            var dataListJobs = {
              id: useData[i].fields.ID || "",
              jobname: useData[i].fields.ClientName || "",
              // employeename:data.tjobvs1[i].EmployeeName || '',
            };

            if (useData[i].fields.ClientName.replace(/\s/g, "") != "") {
              $("#sltJob").editableSelect("add", useData[i].fields.ClientName);
              jobsList.push(dataListJobs);
            }
            //}
          }
          templateObject.jobsrecords.set(jobsList);
        }
      })
      .catch(function (err) {
        contactService
          .getAllJobsNameData()
          .then(function (data) {
            let lineItems = [];
            let lineItemObj = {};

            for (let i = 0; i < data.tjobvs1.length; i++) {
              var dataListJobs = {
                id: data.tjobvs1[i].Id || "",
                jobname: data.tjobvs1[i].ClientName || "",
                // employeename:data.tjobvs1[i].EmployeeName || '',
              };

              if (data.tjobvs1[i].ClientName.replace(/\s/g, "") != "") {
                $("#sltJobOne").editableSelect(
                  "add",
                  data.tjobvs1[i].ClientName
                );
                jobsList.push(dataListJobs);
              }
              //}
            }

            templateObject.jobsrecords.set(jobsList);
          })
          .catch(function (err) {
            // $('.fullScreenSpin').css('display', 'none');
          });
      });
  };
  // templateObject.getJobs();

  templateObject.getAllProductData = function () {
    productList = [];
    templateObject.datatablerecords1.set([]);
    var splashArrayProductServiceList = new Array();
    //  $('#product-list').editableSelect('clear');
    getVS1Data("TProductWeb")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          sideBarService
            .getProductServiceListVS1(initialBaseDataLoad, 0)
            .then(function (data) {
              addVS1Data("TProductWeb", JSON.stringify(data));
              var dataList = {};
              for (let i = 0; i < data.tproductvs1.length; i++) {
                dataList = {
                  id: data.tproductvs1[i].fields.ID || "",
                  productname: data.tproductvs1[i].fields.ProductName || "",
                  productcost: data.tproductvs1[i].fields.BuyQty1Cost || "",
                };

                var prodservicedataList = [
                  '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-' +
                    data.tproductvs1[i].fields.ID +
                    '"><label class="custom-control-label chkBox pointer" for="formCheck-' +
                    data.tproductvs1[i].fields.ID +
                    '"></label></div>',
                  data.tproductvs1[i].fields.ProductName || "-",
                  data.tproductvs1[i].fields.SalesDescription || "",
                  data.tproductvs1[i].fields.BARCODE || "",
                  utilityService.modifynegativeCurrencyFormat(
                    Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) /
                      100
                  ),
                  utilityService.modifynegativeCurrencyFormat(
                    Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) /
                      100
                  ),
                  data.tproductvs1[i].fields.TotalQtyInStock,
                  data.tproductvs1[i].fields.TaxCodeSales || "",
                  data.tproductvs1[i].fields.ID || "",
                  JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice) ||
                    null,

                  utilityService.modifynegativeCurrencyFormat(
                    Math.floor(
                      data.tproductvs1[i].fields.SellQty1PriceInc * 100
                    ) / 100
                  ),
                ];

                splashArrayProductServiceList.push(prodservicedataList);

                //if (data.tproductvs1[i].ProductType != 'INV') {
                // $('#product-list').editableSelect('add', data.tproductvs1[i].ProductName);
                // $('#product-list').editableSelect('add', function(){
                //   $(this).text(data.tproductvs1[i].ProductName);
                //   $(this).attr('id', data.tproductvs1[i].SellQty1Price);
                // });
                productList.push(dataList);
                //  }
              }

              if (splashArrayProductServiceList) {
                templateObject.allnoninvproducts.set(
                  splashArrayProductServiceList
                );
                $("#tblInventoryPayrollService")
                  .dataTable({
                    data: splashArrayProductServiceList,

                    sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                    columnDefs: [
                      {
                        className: "chkBox pointer hiddenColumn",
                        orderable: false,
                        targets: [0],
                      },
                      {
                        className: "productName",
                        targets: [1],
                      },
                      {
                        className: "productDesc",
                        targets: [2],
                      },
                      {
                        className: "colBarcode",
                        targets: [3],
                      },
                      {
                        className: "costPrice text-right",
                        targets: [4],
                      },
                      {
                        className: "salePrice text-right",
                        targets: [5],
                      },
                      {
                        className: "prdqty text-right",
                        targets: [6],
                      },
                      {
                        className: "taxrate",
                        targets: [7],
                      },
                      {
                        className: "colProuctPOPID hiddenColumn",
                        targets: [8],
                      },
                      {
                        className: "colExtraSellPrice hiddenColumn",
                        targets: [9],
                      },
                      {
                        className: "salePriceInc hiddenColumn",
                        targets: [10],
                      },
                    ],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    pageLength: initialDatatableLoad,
                    lengthMenu: [
                      [initialDatatableLoad, -1],
                      [initialDatatableLoad, "All"],
                    ],
                    info: true,
                    responsive: true,
                    order: [[1, "asc"]],
                    fnDrawCallback: function (oSettings) {
                      $(
                        "#tblInventoryPayrollService_paginate .paginate_button.page-item"
                      ).removeClass("disabled");
                      $("#tblInventoryPayrollService_ellipsis").addClass(
                        "disabled"
                      );

                      if (oSettings._iDisplayLength == -1) {
                        if (oSettings.fnRecordsDisplay() > 150) {
                        }
                      } else {
                      }
                      if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                        $(
                          "#tblInventoryPayrollService_paginat .paginate_button.page-item.next"
                        ).addClass("disabled");
                      }

                      $(
                        ".paginate_button.next:not(.disabled)",
                        this.api().table().container()
                      ).on("click", function () {
                        $(".fullScreenSpin").css("display", "inline-block");
                        let dataLenght = oSettings._iDisplayLength;
                        let customerSearch = $(
                          "#tblInventoryPayrollService_filter input"
                        ).val();

                        sideBarService
                          .getProductServiceListVS1(
                            initialDatatableLoad,
                            oSettings.fnRecordsDisplay()
                          )
                          .then(function (dataObjectnew) {
                            for (
                              let i = 0;
                              i < dataObjectnew.tproductvs1.length;
                              i++
                            ) {
                              var dataListDupp = [
                                '<div class="custom-control custom-checkbox chkBox pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-' +
                                  data.tproductvs1[i].fields.ID +
                                  '"><label class="custom-control-label chkBox pointer" for="formCheck-' +
                                  data.tproductvs1[i].fields.ID +
                                  '"></label></div>',
                                data.tproductvs1[i].fields.ProductName || "-",
                                data.tproductvs1[i].fields.SalesDescription ||
                                  "",
                                data.tproductvs1[i].fields.BARCODE || "",
                                utilityService.modifynegativeCurrencyFormat(
                                  Math.floor(
                                    data.tproductvs1[i].fields.BuyQty1Cost * 100
                                  ) / 100
                                ),
                                utilityService.modifynegativeCurrencyFormat(
                                  Math.floor(
                                    data.tproductvs1[i].fields.SellQty1Price *
                                      100
                                  ) / 100
                                ),
                                data.tproductvs1[i].fields.TotalQtyInStock,
                                data.tproductvs1[i].fields.TaxCodeSales || "",
                                data.tproductvs1[i].fields.ID || "",
                                JSON.stringify(
                                  data.tproductvs1[i].fields.ExtraSellPrice
                                ) || null,
                                utilityService.modifynegativeCurrencyFormat(
                                  Math.floor(
                                    data.tproductvs1[i].fields
                                      .SellQty1PriceInc * 100
                                  ) / 100
                                ),
                              ];
                              splashArrayProductServiceList.push(dataListDupp);
                            }

                            let uniqueChars = [
                              ...new Set(splashArrayProductServiceList),
                            ];
                            var datatable = $(
                              "#tblInventoryPayrollService"
                            ).DataTable();
                            datatable.clear();
                            datatable.rows.add(uniqueChars);
                            datatable.draw(false);
                            setTimeout(function () {
                              $("#tblInventoryPayrollService")
                                .dataTable()
                                .fnPageChange("last");
                            }, 400);

                            $(".fullScreenSpin").css("display", "none");
                          })
                          .catch(function (err) {
                            $(".fullScreenSpin").css("display", "none");
                          });
                      });
                    },
                    fnInitComplete: function () {
                      $(
                        "<a class='btn btn-primary scanProdServiceBarcodePOP' href='' id='scanProdServiceBarcodePOP' role='button' style='margin-left: 8px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>"
                      ).insertAfter("#tblInventoryPayrollService_filter");
                      $(
                        "<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>"
                      ).insertAfter("#tblInventoryPayrollService_filter");
                      $(
                        "<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                      ).insertAfter("#tblInventoryPayrollService_filter");
                    },
                  })
                  .on("length.dt", function (e, settings, len) {
                    $(".fullScreenSpin").css("display", "inline-block");
                    let dataLenght = settings._iDisplayLength;
                    // splashArrayProductList = [];
                    if (dataLenght == -1) {
                      $(".fullScreenSpin").css("display", "none");
                    } else {
                      if (
                        settings.fnRecordsDisplay() >= settings._iDisplayLength
                      ) {
                        $(".fullScreenSpin").css("display", "none");
                      } else {
                        $(".fullScreenSpin").css("display", "none");
                      }
                    }
                  });

                $("div.dataTables_filter input").addClass(
                  "form-control form-control-sm"
                );
              }

              templateObject.datatablerecords1.set(productList);
            });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.tproductvs1;
          var dataList = {};
          for (let i = 0; i < useData.length; i++) {
            dataList = {
              id: useData[i].fields.ID || "",
              productname: useData[i].fields.ProductName || "",
              productcost: useData[i].fields.BuyQty1Cost || "",
            };

            var prodservicedataList = [
              '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-' +
                data.tproductvs1[i].fields.ID +
                '"><label class="custom-control-label chkBox pointer" for="formCheck-' +
                data.tproductvs1[i].fields.ID +
                '"></label></div>',
              data.tproductvs1[i].fields.ProductName || "-",
              data.tproductvs1[i].fields.SalesDescription || "",
              data.tproductvs1[i].fields.BARCODE || "",
              utilityService.modifynegativeCurrencyFormat(
                Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100
              ),
              utilityService.modifynegativeCurrencyFormat(
                Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100
              ),
              data.tproductvs1[i].fields.TotalQtyInStock,
              data.tproductvs1[i].fields.TaxCodeSales || "",
              data.tproductvs1[i].fields.ID || "",
              JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice) || null,

              utilityService.modifynegativeCurrencyFormat(
                Math.floor(data.tproductvs1[i].fields.SellQty1PriceInc * 100) /
                  100
              ),
            ];

            splashArrayProductServiceList.push(prodservicedataList);
            // $('#product-list').editableSelect('add', useData[i].fields.ProductName);
            // $('#product-list').editableSelect('add', function(){
            //   $(this).val(useData[i].fields.ID);
            //   $(this).text(useData[i].fields.ProductName);
            //   $(this).attr('id', useData[i].fields.SellQty1Price);
            // });
            //if (useData[i].fields.ProductType != 'INV') {
            productList.push(dataList);
            //}
          }
          if (splashArrayProductServiceList) {
            templateObject.allnoninvproducts.set(splashArrayProductServiceList);
            $("#tblInventoryPayrollService")
              .dataTable({
                data: splashArrayProductServiceList,

                sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                columnDefs: [
                  {
                    className: "chkBox pointer hiddenColumn",
                    orderable: false,
                    targets: [0],
                  },
                  {
                    className: "productName",
                    targets: [1],
                  },
                  {
                    className: "productDesc",
                    targets: [2],
                  },
                  {
                    className: "colBarcode",
                    targets: [3],
                  },
                  {
                    className: "costPrice text-right",
                    targets: [4],
                  },
                  {
                    className: "salePrice text-right",
                    targets: [5],
                  },
                  {
                    className: "prdqty text-right",
                    targets: [6],
                  },
                  {
                    className: "taxrate",
                    targets: [7],
                  },
                  {
                    className: "colProuctPOPID hiddenColumn",
                    targets: [8],
                  },
                  {
                    className: "colExtraSellPrice hiddenColumn",
                    targets: [9],
                  },
                  {
                    className: "salePriceInc hiddenColumn",
                    targets: [10],
                  },
                ],
                select: true,
                destroy: true,
                colReorder: true,
                pageLength: initialDatatableLoad,
                lengthMenu: [
                  [initialDatatableLoad, -1],
                  [initialDatatableLoad, "All"],
                ],
                info: true,
                responsive: true,
                order: [[1, "asc"]],
                fnDrawCallback: function (oSettings) {
                  $(
                    "#tblInventoryPayrollService_paginat .paginate_button.page-item"
                  ).removeClass("disabled");
                  $("#tblInventoryPayrollService_ellipsis").addClass(
                    "disabled"
                  );

                  if (oSettings._iDisplayLength == -1) {
                    if (oSettings.fnRecordsDisplay() > 150) {
                    }
                  } else {
                  }
                  if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                    $(
                      "#tblInventoryPayrollService_paginat .paginate_button.page-item.next"
                    ).addClass("disabled");
                  }

                  $(
                    ".paginate_button.next:not(.disabled)",
                    this.api().table().container()
                  ).on("click", function () {
                    $(".fullScreenSpin").css("display", "inline-block");
                    let dataLenght = oSettings._iDisplayLength;
                    let customerSearch = $(
                      "#tblInventoryPayrollService_filter input"
                    ).val();

                    sideBarService
                      .getProductServiceListVS1(
                        initialDatatableLoad,
                        oSettings.fnRecordsDisplay()
                      )
                      .then(function (dataObjectnew) {
                        for (
                          let i = 0;
                          i < dataObjectnew.tproductvs1.length;
                          i++
                        ) {
                          var dataListDupp = [
                            '<div class="custom-control custom-checkbox chkBox pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-' +
                              data.tproductvs1[i].fields.ID +
                              '"><label class="custom-control-label chkBox pointer" for="formCheck-' +
                              data.tproductvs1[i].fields.ID +
                              '"></label></div>',
                            data.tproductvs1[i].fields.ProductName || "-",
                            data.tproductvs1[i].fields.SalesDescription || "",
                            data.tproductvs1[i].fields.BARCODE || "",
                            utilityService.modifynegativeCurrencyFormat(
                              Math.floor(
                                data.tproductvs1[i].fields.BuyQty1Cost * 100
                              ) / 100
                            ),
                            utilityService.modifynegativeCurrencyFormat(
                              Math.floor(
                                data.tproductvs1[i].fields.SellQty1Price * 100
                              ) / 100
                            ),
                            data.tproductvs1[i].fields.TotalQtyInStock,
                            data.tproductvs1[i].fields.TaxCodeSales || "",
                            data.tproductvs1[i].fields.ID || "",
                            JSON.stringify(
                              data.tproductvs1[i].fields.ExtraSellPrice
                            ) || null,
                            utilityService.modifynegativeCurrencyFormat(
                              Math.floor(
                                data.tproductvs1[i].fields.SellQty1PriceInc *
                                  100
                              ) / 100
                            ),
                          ];
                          splashArrayProductServiceList.push(dataListDupp);
                        }

                        let uniqueChars = [
                          ...new Set(splashArrayProductServiceList),
                        ];
                        var datatable = $(
                          "#tblInventoryPayrollService"
                        ).DataTable();
                        datatable.clear();
                        datatable.rows.add(uniqueChars);
                        datatable.draw(false);
                        setTimeout(function () {
                          $("#tblInventoryPayrollService")
                            .dataTable()
                            .fnPageChange("last");
                        }, 400);

                        $(".fullScreenSpin").css("display", "none");
                      })
                      .catch(function (err) {
                        $(".fullScreenSpin").css("display", "none");
                      });
                  });
                },
                fnInitComplete: function () {
                  $(
                    "<a class='btn btn-primary scanProdServiceBarcodePOP' href='' id='scanProdServiceBarcodePOP' role='button' style='margin-left: 8px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>"
                  ).insertAfter("#tblInventoryPayrollService_filter");
                  $(
                    "<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>"
                  ).insertAfter("#tblInventoryPayrollService_filter");
                  $(
                    "<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                  ).insertAfter("#tblInventoryPayrollService_filter");
                },
              })
              .on("length.dt", function (e, settings, len) {
                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                // splashArrayProductList = [];
                if (dataLenght == -1) {
                  $(".fullScreenSpin").css("display", "none");
                } else {
                  if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                    $(".fullScreenSpin").css("display", "none");
                  } else {
                    $(".fullScreenSpin").css("display", "none");
                  }
                }
              });

            $("div.dataTables_filter input").addClass(
              "form-control form-control-sm"
            );
          }
          templateObject.datatablerecords1.set(productList);
        }
      })
      .catch(function (err) {
        sideBarService
          .getProductServiceListVS1(initialBaseDataLoad, 0)
          .then(function (data) {
            addVS1Data("TProductWeb", JSON.stringify(data));
            var dataList = {};
            for (let i = 0; i < data.tproductvs1.length; i++) {
              dataList = {
                id: data.tproductvs1[i].fields.ID || "",
                productname: data.tproductvs1[i].fields.ProductName || "",
                productcost: data.tproductvs1[i].fields.BuyQty1Cost || "",
              };

              var prodservicedataList = [
                '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-' +
                  data.tproductvs1[i].fields.ID +
                  '"><label class="custom-control-label chkBox pointer" for="formCheck-' +
                  data.tproductvs1[i].fields.ID +
                  '"></label></div>',
                data.tproductvs1[i].fields.ProductName || "-",
                data.tproductvs1[i].fields.SalesDescription || "",
                data.tproductvs1[i].fields.BARCODE || "",
                utilityService.modifynegativeCurrencyFormat(
                  Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100
                ),
                utilityService.modifynegativeCurrencyFormat(
                  Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) /
                    100
                ),
                data.tproductvs1[i].fields.TotalQtyInStock,
                data.tproductvs1[i].fields.TaxCodeSales || "",
                data.tproductvs1[i].fields.ID || "",
                JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice) ||
                  null,

                utilityService.modifynegativeCurrencyFormat(
                  Math.floor(
                    data.tproductvs1[i].fields.SellQty1PriceInc * 100
                  ) / 100
                ),
              ];

              splashArrayProductServiceList.push(prodservicedataList);

              //if (data.tproductvs1[i].ProductType != 'INV') {
              // $('#product-list').editableSelect('add', data.tproductvs1[i].ProductName);
              // $('#product-list').editableSelect('add', function(){
              //   $(this).text(data.tproductvs1[i].ProductName);
              //   $(this).attr('id', data.tproductvs1[i].SellQty1Price);
              // });
              productList.push(dataList);
              //  }
            }

            if (splashArrayProductServiceList) {
              templateObject.allnoninvproducts.set(
                splashArrayProductServiceList
              );
              $("#tblInventoryPayrollService")
                .dataTable({
                  data: splashArrayProductServiceList,

                  sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                  columnDefs: [
                    {
                      className: "chkBox pointer hiddenColumn",
                      orderable: false,
                      targets: [0],
                    },
                    {
                      className: "productName",
                      targets: [1],
                    },
                    {
                      className: "productDesc",
                      targets: [2],
                    },
                    {
                      className: "colBarcode",
                      targets: [3],
                    },
                    {
                      className: "costPrice text-right",
                      targets: [4],
                    },
                    {
                      className: "salePrice text-right",
                      targets: [5],
                    },
                    {
                      className: "prdqty text-right",
                      targets: [6],
                    },
                    {
                      className: "taxrate",
                      targets: [7],
                    },
                    {
                      className: "colProuctPOPID hiddenColumn",
                      targets: [8],
                    },
                    {
                      className: "colExtraSellPrice hiddenColumn",
                      targets: [9],
                    },
                    {
                      className: "salePriceInc hiddenColumn",
                      targets: [10],
                    },
                  ],
                  select: true,
                  destroy: true,
                  colReorder: true,
                  pageLength: initialDatatableLoad,
                  lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"],
                  ],
                  info: true,
                  responsive: true,
                  order: [[1, "asc"]],
                  fnDrawCallback: function (oSettings) {
                    $(
                      "#tblInventoryPayrollService_paginat .paginate_button.page-item"
                    ).removeClass("disabled");
                    $("#tblInventoryPayrollService_ellipsis").addClass(
                      "disabled"
                    );

                    if (oSettings._iDisplayLength == -1) {
                      if (oSettings.fnRecordsDisplay() > 150) {
                      }
                    } else {
                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                      $(
                        "#tblInventoryPayrollService_paginat .paginate_button.page-item.next"
                      ).addClass("disabled");
                    }

                    $(
                      ".paginate_button.next:not(.disabled)",
                      this.api().table().container()
                    ).on("click", function () {
                      $(".fullScreenSpin").css("display", "inline-block");
                      let dataLenght = oSettings._iDisplayLength;
                      let customerSearch = $(
                        "#tblInventoryPayrollService_filter input"
                      ).val();

                      sideBarService
                        .getProductServiceListVS1(
                          initialDatatableLoad,
                          oSettings.fnRecordsDisplay()
                        )
                        .then(function (dataObjectnew) {
                          for (
                            let i = 0;
                            i < dataObjectnew.tproductvs1.length;
                            i++
                          ) {
                            var dataListDupp = [
                              '<div class="custom-control custom-checkbox chkBox pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-' +
                                data.tproductvs1[i].fields.ID +
                                '"><label class="custom-control-label chkBox pointer" for="formCheck-' +
                                data.tproductvs1[i].fields.ID +
                                '"></label></div>',
                              data.tproductvs1[i].fields.ProductName || "-",
                              data.tproductvs1[i].fields.SalesDescription || "",
                              data.tproductvs1[i].fields.BARCODE || "",
                              utilityService.modifynegativeCurrencyFormat(
                                Math.floor(
                                  data.tproductvs1[i].fields.BuyQty1Cost * 100
                                ) / 100
                              ),
                              utilityService.modifynegativeCurrencyFormat(
                                Math.floor(
                                  data.tproductvs1[i].fields.SellQty1Price * 100
                                ) / 100
                              ),
                              data.tproductvs1[i].fields.TotalQtyInStock,
                              data.tproductvs1[i].fields.TaxCodeSales || "",
                              data.tproductvs1[i].fields.ID || "",
                              JSON.stringify(
                                data.tproductvs1[i].fields.ExtraSellPrice
                              ) || null,
                              utilityService.modifynegativeCurrencyFormat(
                                Math.floor(
                                  data.tproductvs1[i].fields.SellQty1PriceInc *
                                    100
                                ) / 100
                              ),
                            ];
                            splashArrayProductServiceList.push(dataListDupp);
                          }

                          let uniqueChars = [
                            ...new Set(splashArrayProductServiceList),
                          ];
                          var datatable = $(
                            "#tblInventoryPayrollService"
                          ).DataTable();
                          datatable.clear();
                          datatable.rows.add(uniqueChars);
                          datatable.draw(false);
                          setTimeout(function () {
                            $("#tblInventoryPayrollService")
                              .dataTable()
                              .fnPageChange("last");
                          }, 400);

                          $(".fullScreenSpin").css("display", "none");
                        })
                        .catch(function (err) {
                          $(".fullScreenSpin").css("display", "none");
                        });
                    });
                  },
                  fnInitComplete: function () {
                    $(
                      "<a class='btn btn-primary scanProdServiceBarcodePOP' href='' id='scanProdServiceBarcodePOP' role='button' style='margin-left: 8px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>"
                    ).insertAfter("#tblInventoryPayrollService_filter");
                    $(
                      "<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>"
                    ).insertAfter("#tblInventoryPayrollService_filter");
                    $(
                      "<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                    ).insertAfter("#tblInventoryPayrollService_filter");
                  },
                })
                .on("length.dt", function (e, settings, len) {
                  $(".fullScreenSpin").css("display", "inline-block");
                  let dataLenght = settings._iDisplayLength;
                  // splashArrayProductList = [];
                  if (dataLenght == -1) {
                    $(".fullScreenSpin").css("display", "none");
                  } else {
                    if (
                      settings.fnRecordsDisplay() >= settings._iDisplayLength
                    ) {
                      $(".fullScreenSpin").css("display", "none");
                    } else {
                      $(".fullScreenSpin").css("display", "none");
                    }
                  }
                });

              $("div.dataTables_filter input").addClass(
                "form-control form-control-sm"
              );
            }

            templateObject.datatablerecords1.set(productList);
          });
      });
  };

  templateObject.getAllSelectedProducts = function (employeeID) {
    let productlist = [];
    templateObject.datatablerecords1.set([]);
    var splashArrayProductServiceList = new Array();
    var splashArrayProductServiceListGet = [];
    //$('#product-list').editableSelect('clear');
    sideBarService
      .getSelectedProducts(employeeID)
      .then(function (data) {
        var dataList = {};

        let getallinvproducts = templateObject.allnoninvproducts.get();

        if (data.trepservices.length > 0) {
          for (let i = 0; i < data.trepservices.length; i++) {
            dataList = {
              id: data.trepservices[i].Id || "",
              productname: data.trepservices[i].ServiceDesc || "",
              productcost: data.trepservices[i].Rate || 0.0,
            };
            let checkServiceArray =
              getallinvproducts.filter(function (prodData) {
                if (prodData[1] === data.trepservices[i].ServiceDesc) {
                  var prodservicedataList = [
                    prodData[0],
                    prodData[1] || "-",
                    prodData[2] || "",
                    prodData[3] || "",
                    prodData[4],
                    prodData[5],
                    prodData[6],
                    prodData[7] || "",
                    prodData[8] || "",
                    prodData[9] || null,
                    prodData[10],
                  ];
                  splashArrayProductServiceListGet.push(prodservicedataList);
                  //splashArrayProductServiceListGet.push(prodservicedataList);
                  return prodservicedataList || "";
                }
              }) || "";

            productlist.push(dataList);
          }

          if (splashArrayProductServiceListGet) {
            let uniqueChars = [...new Set(splashArrayProductServiceListGet)];
            var datatable = $("#tblInventoryPayrollService").DataTable();
            datatable.clear();
            datatable.rows.add(uniqueChars);
            datatable.draw(false);
          }

          templateObject.datatablerecords1.set(productlist);
        } else {
          templateObject.getAllProductData();
        }
      })
      .catch(function (err) {
        templateObject.getAllProductData();
      });
  };

  setTimeout(function () {
    templateObject.getAllProductData();
  }, 500);

  $("#scanBarcode").click(function () {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
    } else {
      Bert.alert(
        "<strong>Please Note:</strong> This function is only available on mobile devices!",
        "now-dangerorange"
      );
    }
  });

  $("#tblPayHistorylist tbody").on("click", "tr", function () {
    var listData = $(this).closest("tr").attr("id");
    if (listData) {
      FlowRouter.go("/employeescard?id=" + listData);
    }
  });

  document
    .querySelector("#barcodeScanInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        $("#btnDesktopSearch").trigger("click");
      }
    });

  $(document).ready(function () {
    $("#sltJob").editableSelect();
    $("#product-list").editableSelect();
  });

  $("#product-list")
    .editableSelect()
    .on("click.editable-select", function (e, li) {
      var $earch = $(this);
      var offset = $earch.offset();
      var productDataName = e.target.value || "";
      //var productDataID = el.context.value || '';
      // if(el){
      //   var productCostData = el.context.id || 0;
      //   $('#edtProductCost').val(productCostData);
      // }
      if (event.pageX > offset.left + $earch.width() - 10) {
        // X button 16px wide?
        $("#productListModal").modal("toggle");
        setTimeout(function () {
          $("#tblInventoryPayrollService_filter .form-control-sm").focus();
          $("#tblInventoryPayrollService_filter .form-control-sm").val("");
          $("#tblInventoryPayrollService_filter .form-control-sm").trigger(
            "input"
          );

          var datatable = $("#tblInventoryPayrollService").DataTable();
          datatable.draw();
          $("#tblInventoryPayrollService_filter .form-control-sm").trigger(
            "input"
          );
        }, 500);
      } else {
        // var productDataID = $(event.target).attr('prodid').replace(/\s/g, '') || '';
        if (productDataName.replace(/\s/g, "") != "") {
          //FlowRouter.go('/productview?prodname=' + $(event.target).text());
          let lineExtaSellItems = [];
          let lineExtaSellObj = {};
          $(".fullScreenSpin").css("display", "inline-block");
          getVS1Data("TProductWeb")
            .then(function (dataObject) {
              if (dataObject.length == 0) {
                sideBarService
                  .getOneProductdatavs1byname(productDataName)
                  .then(function (data) {
                    $(".fullScreenSpin").css("display", "none");
                    let lineItems = [];
                    let lineItemObj = {};
                    let currencySymbol = Currency;
                    let totalquantity = 0;
                    let productname = data.tproduct[0].fields.ProductName || "";
                    let productcode = data.tproduct[0].fields.PRODUCTCODE || "";
                    let productprintName =
                      data.tproduct[0].fields.ProductPrintName || "";
                    let assetaccount =
                      data.tproduct[0].fields.AssetAccount || "";
                    let buyqty1cost =
                      utilityService.modifynegativeCurrencyFormat(
                        data.tproduct[0].fields.BuyQty1Cost
                      ) || 0;
                    let cogsaccount = data.tproduct[0].fields.CogsAccount || "";
                    let taxcodepurchase =
                      data.tproduct[0].fields.TaxCodePurchase || "";
                    let purchasedescription =
                      data.tproduct[0].fields.PurchaseDescription || "";
                    let sellqty1price =
                      utilityService.modifynegativeCurrencyFormat(
                        data.tproduct[0].fields.SellQty1Price
                      ) || 0;
                    let incomeaccount =
                      data.tproduct[0].fields.IncomeAccount || "";
                    let taxcodesales =
                      data.tproduct[0].fields.TaxCodeSales || "";
                    let salesdescription =
                      data.tproduct[0].fields.SalesDescription || "";
                    let active = data.tproduct[0].fields.Active;
                    let lockextrasell =
                      data.tproduct[0].fields.LockExtraSell || "";
                    let customfield1 = data.tproduct[0].fields.CUSTFLD1 || "";
                    let customfield2 = data.tproduct[0].fields.CUSTFLD2 || "";
                    let barcode = data.tproduct[0].fields.BARCODE || "";
                    $("#selectProductID")
                      .val(data.tproduct[0].fields.ID)
                      .trigger("change");
                    $("#add-product-title").text("Edit Product");
                    $("#edtproductname").val(productname);
                    $("#edtsellqty1price").val(sellqty1price);
                    $("#txasalesdescription").val(salesdescription);
                    $("#sltsalesacount").val(incomeaccount);
                    $("#slttaxcodesales").val(taxcodesales);
                    $("#edtbarcode").val(barcode);
                    $("#txapurchasedescription").val(purchasedescription);
                    $("#sltcogsaccount").val(cogsaccount);
                    $("#slttaxcodepurchase").val(taxcodepurchase);
                    $("#edtbuyqty1cost").val(buyqty1cost);

                    setTimeout(function () {
                      $("#newProductModal").modal("show");
                    }, 500);
                  })
                  .catch(function (err) {
                    $(".fullScreenSpin").css("display", "none");
                  });
              } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tproductvs1;
                var added = false;

                for (let i = 0; i < data.tproductvs1.length; i++) {
                  if (
                    data.tproductvs1[i].fields.ProductName === productDataName
                  ) {
                    added = true;
                    $(".fullScreenSpin").css("display", "none");
                    let lineItems = [];
                    let lineItemObj = {};
                    let currencySymbol = Currency;
                    let totalquantity = 0;

                    let productname =
                      data.tproductvs1[i].fields.ProductName || "";
                    let productcode =
                      data.tproductvs1[i].fields.PRODUCTCODE || "";
                    let productprintName =
                      data.tproductvs1[i].fields.ProductPrintName || "";
                    let assetaccount =
                      data.tproductvs1[i].fields.AssetAccount || "";
                    let buyqty1cost =
                      utilityService.modifynegativeCurrencyFormat(
                        data.tproductvs1[i].fields.BuyQty1Cost
                      ) || 0;
                    let cogsaccount =
                      data.tproductvs1[i].fields.CogsAccount || "";
                    let taxcodepurchase =
                      data.tproductvs1[i].fields.TaxCodePurchase || "";
                    let purchasedescription =
                      data.tproductvs1[i].fields.PurchaseDescription || "";
                    let sellqty1price =
                      utilityService.modifynegativeCurrencyFormat(
                        data.tproductvs1[i].fields.SellQty1Price
                      ) || 0;
                    let incomeaccount =
                      data.tproductvs1[i].fields.IncomeAccount || "";
                    let taxcodesales =
                      data.tproductvs1[i].fields.TaxCodeSales || "";
                    let salesdescription =
                      data.tproductvs1[i].fields.SalesDescription || "";
                    let active = data.tproductvs1[i].fields.Active;
                    let lockextrasell =
                      data.tproductvs1[i].fields.LockExtraSell || "";
                    let customfield1 =
                      data.tproductvs1[i].fields.CUSTFLD1 || "";
                    let customfield2 =
                      data.tproductvs1[i].fields.CUSTFLD2 || "";
                    let barcode = data.tproductvs1[i].fields.BARCODE || "";
                    $("#selectProductID")
                      .val(data.tproductvs1[i].fields.ID)
                      .trigger("change");
                    $("#add-product-title").text("Edit Product");
                    $("#edtproductname").val(productname);
                    $("#edtsellqty1price").val(sellqty1price);
                    $("#txasalesdescription").val(salesdescription);
                    $("#sltsalesacount").val(incomeaccount);
                    $("#slttaxcodesales").val(taxcodesales);
                    $("#edtbarcode").val(barcode);
                    $("#txapurchasedescription").val(purchasedescription);
                    $("#sltcogsaccount").val(cogsaccount);
                    $("#slttaxcodepurchase").val(taxcodepurchase);
                    $("#edtbuyqty1cost").val(buyqty1cost);

                    setTimeout(function () {
                      $("#newProductModal").modal("show");
                    }, 500);
                  }
                }
                if (!added) {
                  sideBarService
                    .getOneProductdatavs1byname(productDataName)
                    .then(function (data) {
                      $(".fullScreenSpin").css("display", "none");
                      let lineItems = [];
                      let lineItemObj = {};
                      let currencySymbol = Currency;
                      let totalquantity = 0;
                      let productname =
                        data.tproduct[0].fields.ProductName || "";
                      let productcode =
                        data.tproduct[0].fields.PRODUCTCODE || "";
                      let productprintName =
                        data.tproduct[0].fields.ProductPrintName || "";
                      let assetaccount =
                        data.tproduct[0].fields.AssetAccount || "";
                      let buyqty1cost =
                        utilityService.modifynegativeCurrencyFormat(
                          data.tproduct[0].fields.BuyQty1Cost
                        ) || 0;
                      let cogsaccount =
                        data.tproduct[0].fields.CogsAccount || "";
                      let taxcodepurchase =
                        data.tproduct[0].fields.TaxCodePurchase || "";
                      let purchasedescription =
                        data.tproduct[0].fields.PurchaseDescription || "";
                      let sellqty1price =
                        utilityService.modifynegativeCurrencyFormat(
                          data.tproduct[0].fields.SellQty1Price
                        ) || 0;
                      let incomeaccount =
                        data.tproduct[0].fields.IncomeAccount || "";
                      let taxcodesales =
                        data.tproduct[0].fields.TaxCodeSales || "";
                      let salesdescription =
                        data.tproduct[0].fields.SalesDescription || "";
                      let active = data.tproduct[0].fields.Active;
                      let lockextrasell =
                        data.tproduct[0].fields.LockExtraSell || "";
                      let customfield1 = data.tproduct[0].fields.CUSTFLD1 || "";
                      let customfield2 = data.tproduct[0].fields.CUSTFLD2 || "";
                      let barcode = data.tproduct[0].fields.BARCODE || "";
                      $("#selectProductID")
                        .val(data.tproduct[0].fields.ID)
                        .trigger("change");
                      $("#add-product-title").text("Edit Product");
                      $("#edtproductname").val(productname);
                      $("#edtsellqty1price").val(sellqty1price);
                      $("#txasalesdescription").val(salesdescription);
                      $("#sltsalesacount").val(incomeaccount);
                      $("#slttaxcodesales").val(taxcodesales);
                      $("#edtbarcode").val(barcode);
                      $("#txapurchasedescription").val(purchasedescription);
                      $("#sltcogsaccount").val(cogsaccount);
                      $("#slttaxcodepurchase").val(taxcodepurchase);
                      $("#edtbuyqty1cost").val(buyqty1cost);

                      setTimeout(function () {
                        $("#newProductModal").modal("show");
                      }, 500);
                    })
                    .catch(function (err) {
                      $(".fullScreenSpin").css("display", "none");
                    });
                }
              }
            })
            .catch(function (err) {
              sideBarService
                .getOneProductdatavs1byname(productDataName)
                .then(function (data) {
                  $(".fullScreenSpin").css("display", "none");
                  let lineItems = [];
                  let lineItemObj = {};
                  let currencySymbol = Currency;
                  let totalquantity = 0;
                  let productname = data.tproduct[0].fields.ProductName || "";
                  let productcode = data.tproduct[0].fields.PRODUCTCODE || "";
                  let productprintName =
                    data.tproduct[0].fields.ProductPrintName || "";
                  let assetaccount = data.tproduct[0].fields.AssetAccount || "";
                  let buyqty1cost =
                    utilityService.modifynegativeCurrencyFormat(
                      data.tproduct[0].fields.BuyQty1Cost
                    ) || 0;
                  let cogsaccount = data.tproduct[0].fields.CogsAccount || "";
                  let taxcodepurchase =
                    data.tproduct[0].fields.TaxCodePurchase || "";
                  let purchasedescription =
                    data.tproduct[0].fields.PurchaseDescription || "";
                  let sellqty1price =
                    utilityService.modifynegativeCurrencyFormat(
                      data.tproduct[0].fields.SellQty1Price
                    ) || 0;
                  let incomeaccount =
                    data.tproduct[0].fields.IncomeAccount || "";
                  let taxcodesales = data.tproduct[0].fields.TaxCodeSales || "";
                  let salesdescription =
                    data.tproduct[0].fields.SalesDescription || "";
                  let active = data.tproduct[0].fields.Active;
                  let lockextrasell =
                    data.tproduct[0].fields.LockExtraSell || "";
                  let customfield1 = data.tproduct[0].fields.CUSTFLD1 || "";
                  let customfield2 = data.tproduct[0].fields.CUSTFLD2 || "";
                  let barcode = data.tproduct[0].fields.BARCODE || "";
                  $("#selectProductID")
                    .val(data.tproduct[0].fields.ID)
                    .trigger("change");
                  $("#add-product-title").text("Edit Product");
                  $("#edtproductname").val(productname);
                  $("#edtsellqty1price").val(sellqty1price);
                  $("#txasalesdescription").val(salesdescription);
                  $("#sltsalesacount").val(incomeaccount);
                  $("#slttaxcodesales").val(taxcodesales);
                  $("#edtbarcode").val(barcode);
                  $("#txapurchasedescription").val(purchasedescription);
                  $("#sltcogsaccount").val(cogsaccount);
                  $("#slttaxcodepurchase").val(taxcodepurchase);
                  $("#edtbuyqty1cost").val(buyqty1cost);

                  setTimeout(function () {
                    $("#newProductModal").modal("show");
                  }, 500);
                })
                .catch(function (err) {
                  $(".fullScreenSpin").css("display", "none");
                });
            });

          setTimeout(function () {
            var begin_day_value = $("#event_begin_day").attr("value");
            $("#dtDateTo")
              .datepicker({
                showOn: "button",
                buttonText: "Show Date",
                buttonImageOnly: true,
                buttonImage: "/img/imgCal2.png",
                constrainInput: false,
                dateFormat: "d/mm/yy",
                showOtherMonths: true,
                selectOtherMonths: true,
                changeMonth: true,
                changeYear: true,
                yearRange: "-90:+10",
              })
              .keyup(function (e) {
                if (e.keyCode == 8 || e.keyCode == 46) {
                  $("#dtDateTo,#dtDateFrom").val("");
                }
              });

            $("#dtDateFrom")
              .datepicker({
                showOn: "button",
                buttonText: "Show Date",
                altField: "#dtDateFrom",
                buttonImageOnly: true,
                buttonImage: "/img/imgCal2.png",
                constrainInput: false,
                dateFormat: "d/mm/yy",
                showOtherMonths: true,
                selectOtherMonths: true,
                changeMonth: true,
                changeYear: true,
                yearRange: "-90:+10",
              })
              .keyup(function (e) {
                if (e.keyCode == 8 || e.keyCode == 46) {
                  $("#dtDateTo,#dtDateFrom").val("");
                }
              });

            $(".ui-datepicker .ui-state-hihglight").removeClass(
              "ui-state-highlight"
            );
          }, 1000);
          //}

          templateObject.getProductClassQtyData = function () {
            productService
              .getOneProductClassQtyData(currentProductID)
              .then(function (data) {
                $(".fullScreenSpin").css("display", "none");
                let qtylineItems = [];
                let qtylineItemObj = {};
                let currencySymbol = Currency;
                let totaldeptquantity = 0;

                for (let j in data.tproductclassquantity) {
                  qtylineItemObj = {
                    department:
                      data.tproductclassquantity[j].DepartmentName || "",
                    quantity: data.tproductclassquantity[j].InStockQty || 0,
                  };
                  totaldeptquantity += data.tproductclassquantity[j].InStockQty;
                  qtylineItems.push(qtylineItemObj);
                }
                // $('#edttotalqtyinstock').val(totaldeptquantity);
                //templateObject.productqtyrecords.set(qtylineItems);
                //templateObject.totaldeptquantity.set(totaldeptquantity);
              })
              .catch(function (err) {
                $(".fullScreenSpin").css("display", "none");
              });
          };

          //templateObject.getProductClassQtyData();
          //templateObject.getProductData();
        } else {
          $("#productListModal").modal("toggle");

          setTimeout(function () {
            $("#tblInventoryPayrollService_filter .form-control-sm").focus();
            $("#tblInventoryPayrollService_filter .form-control-sm").val("");
            $("#tblInventoryPayrollService_filter .form-control-sm").trigger(
              "input"
            );

            var datatable = $("#tblInventoryPayrollService").DataTable();
            datatable.draw();
            $("#tblInventoryPayrollService_filter .form-control-sm").trigger(
              "input"
            );
          }, 500);
        }
      }
    });

  $("#sltJob")
    .editableSelect()
    .on("click.editable-select", function (e, li) {
      var $earch = $(this);
      var offset = $earch.offset();
      $("#edtCustomerPOPID").val("");
      //$('#edtCustomerCompany').attr('readonly', false);
      var customerDataName = e.target.value || "";
      if (e.pageX > offset.left + $earch.width() - 8) {
        // X button 16px wide?
        $("#customerListModal").modal();
        setTimeout(function () {
          $("#tblCustomerlist_filter .form-control-sm").focus();
          $("#tblCustomerlist_filter .form-control-sm").val("");
          $("#tblCustomerlist_filter .form-control-sm").trigger("input");
          var datatable = $("#tblCustomerlist").DataTable();
          //datatable.clear();
          //datatable.rows.add(splashArrayCustomerList);
          datatable.draw();
          $("#tblCustomerlist_filter .form-control-sm").trigger("input");
          //$('#tblCustomerlist').dataTable().fnFilter(' ').draw(false);
        }, 500);
      } else {
        if (customerDataName.replace(/\s/g, "") != "") {
          //FlowRouter.go('/customerscard?name=' + e.target.value);
          $("#edtCustomerPOPID").val("");
          getVS1Data("TCustomerVS1")
            .then(function (dataObject) {
              if (dataObject.length == 0) {
                $(".fullScreenSpin").css("display", "inline-block");
                sideBarService
                  .getOneCustomerDataExByName(customerDataName)
                  .then(function (data) {
                    $(".fullScreenSpin").css("display", "none");
                    let lineItems = [];
                    $("#add-customer-title").text("Edit Customer");
                    let popCustomerID = data.tcustomer[0].fields.ID || "";
                    let popCustomerName =
                      data.tcustomer[0].fields.ClientName || "";
                    let popCustomerEmail = data.tcustomer[0].fields.Email || "";
                    let popCustomerTitle = data.tcustomer[0].fields.Title || "";
                    let popCustomerFirstName =
                      data.tcustomer[0].fields.FirstName || "";
                    let popCustomerMiddleName =
                      data.tcustomer[0].fields.CUSTFLD10 || "";
                    let popCustomerLastName =
                      data.tcustomer[0].fields.LastName || "";
                    let popCustomertfn = "" || "";
                    let popCustomerPhone = data.tcustomer[0].fields.Phone || "";
                    let popCustomerMobile =
                      data.tcustomer[0].fields.Mobile || "";
                    let popCustomerFaxnumber =
                      data.tcustomer[0].fields.Faxnumber || "";
                    let popCustomerSkypeName =
                      data.tcustomer[0].fields.SkypeName || "";
                    let popCustomerURL = data.tcustomer[0].fields.URL || "";
                    let popCustomerStreet =
                      data.tcustomer[0].fields.Street || "";
                    let popCustomerStreet2 =
                      data.tcustomer[0].fields.Street2 || "";
                    let popCustomerState = data.tcustomer[0].fields.State || "";
                    let popCustomerPostcode =
                      data.tcustomer[0].fields.Postcode || "";
                    let popCustomerCountry =
                      data.tcustomer[0].fields.Country || LoggedCountry;
                    let popCustomerbillingaddress =
                      data.tcustomer[0].fields.BillStreet || "";
                    let popCustomerbcity =
                      data.tcustomer[0].fields.BillStreet2 || "";
                    let popCustomerbstate =
                      data.tcustomer[0].fields.BillState || "";
                    let popCustomerbpostalcode =
                      data.tcustomer[0].fields.BillPostcode || "";
                    let popCustomerbcountry =
                      data.tcustomer[0].fields.Billcountry || LoggedCountry;
                    let popCustomercustfield1 =
                      data.tcustomer[0].fields.CUSTFLD1 || "";
                    let popCustomercustfield2 =
                      data.tcustomer[0].fields.CUSTFLD2 || "";
                    let popCustomercustfield3 =
                      data.tcustomer[0].fields.CUSTFLD3 || "";
                    let popCustomercustfield4 =
                      data.tcustomer[0].fields.CUSTFLD4 || "";
                    let popCustomernotes = data.tcustomer[0].fields.Notes || "";
                    let popCustomerpreferedpayment =
                      data.tcustomer[0].fields.PaymentMethodName || "";
                    let popCustomerterms =
                      data.tcustomer[0].fields.TermsName || "";
                    let popCustomerdeliverymethod =
                      data.tcustomer[0].fields.ShippingMethodName || "";
                    let popCustomeraccountnumber =
                      data.tcustomer[0].fields.ClientNo || "";
                    let popCustomerisContractor =
                      data.tcustomer[0].fields.Contractor || false;
                    let popCustomerissupplier =
                      data.tcustomer[0].fields.IsSupplier || false;
                    let popCustomeriscustomer =
                      data.tcustomer[0].fields.IsCustomer || false;
                    let popCustomerTaxCode =
                      data.tcustomer[0].fields.TaxCodeName || "";
                    let popCustomerDiscount =
                      data.tcustomer[0].fields.Discount || 0;
                    let popCustomerType =
                      data.tcustomer[0].fields.ClientTypeName || "";
                    //$('#edtCustomerCompany').attr('readonly', true);
                    $("#edtCustomerCompany").val(popCustomerName);
                    $("#edtCustomerPOPID").val(popCustomerID);
                    $("#edtCustomerPOPEmail").val(popCustomerEmail);
                    $("#edtTitle").val(popCustomerTitle);
                    $("#edtFirstName").val(popCustomerFirstName);
                    $("#edtMiddleName").val(popCustomerMiddleName);
                    $("#edtLastName").val(popCustomerLastName);
                    $("#edtCustomerPhone").val(popCustomerPhone);
                    $("#edtCustomerMobile").val(popCustomerMobile);
                    $("#edtCustomerFax").val(popCustomerFaxnumber);
                    $("#edtCustomerSkypeID").val(popCustomerSkypeName);
                    $("#edtCustomerWebsite").val(popCustomerURL);
                    $("#edtCustomerShippingAddress").val(popCustomerStreet);
                    $("#edtCustomerShippingCity").val(popCustomerStreet2);
                    $("#edtCustomerShippingState").val(popCustomerState);
                    $("#edtCustomerShippingZIP").val(popCustomerPostcode);
                    $("#sedtCountry").val(popCustomerCountry);
                    $("#txaNotes").val(popCustomernotes);
                    $("#sltPreferedPayment").val(popCustomerpreferedpayment);
                    $("#sltTermsPOP").val(popCustomerterms);
                    $("#sltCustomerType").val(popCustomerType);
                    $("#edtCustomerCardDiscount").val(popCustomerDiscount);
                    $("#edtCustomeField1").val(popCustomercustfield1);
                    $("#edtCustomeField2").val(popCustomercustfield2);
                    $("#edtCustomeField3").val(popCustomercustfield3);
                    $("#edtCustomeField4").val(popCustomercustfield4);

                    $("#sltTaxCode").val(popCustomerTaxCode);

                    if (
                      data.tcustomer[0].fields.Street ==
                        data.tcustomer[0].fields.BillStreet &&
                      data.tcustomer[0].fields.Street2 ==
                        data.tcustomer[0].fields.BillStreet2 &&
                      data.tcustomer[0].fields.State ==
                        data.tcustomer[0].fields.BillState &&
                      data.tcustomer[0].fields.Postcode ==
                        data.tcustomer[0].fields.BillPostcode &&
                      data.tcustomer[0].fields.Country ==
                        data.tcustomer[0].fields.Billcountry
                    ) {
                      $("#chkSameAsShipping2").attr("checked", "checked");
                    }

                    if (data.tcustomer[0].fields.IsSupplier == true) {
                      // $('#isformcontractor')
                      $("#chkSameAsSupplier").attr("checked", "checked");
                    } else {
                      $("#chkSameAsSupplier").removeAttr("checked");
                    }

                    setTimeout(function () {
                      $("#addCustomerModal").modal("show");
                    }, 200);
                  })
                  .catch(function (err) {
                    $(".fullScreenSpin").css("display", "none");
                  });
              } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcustomervs1;

                var added = false;
                for (let i = 0; i < data.tcustomervs1.length; i++) {
                  if (
                    data.tcustomervs1[i].fields.ClientName === customerDataName
                  ) {
                    let lineItems = [];
                    added = true;
                    $(".fullScreenSpin").css("display", "none");
                    $("#add-customer-title").text("Edit Customer");
                    let popCustomerID = data.tcustomervs1[i].fields.ID || "";
                    let popCustomerName =
                      data.tcustomervs1[i].fields.ClientName || "";
                    let popCustomerEmail =
                      data.tcustomervs1[i].fields.Email || "";
                    let popCustomerTitle =
                      data.tcustomervs1[i].fields.Title || "";
                    let popCustomerFirstName =
                      data.tcustomervs1[i].fields.FirstName || "";
                    let popCustomerMiddleName =
                      data.tcustomervs1[i].fields.CUSTFLD10 || "";
                    let popCustomerLastName =
                      data.tcustomervs1[i].fields.LastName || "";
                    let popCustomertfn = "" || "";
                    let popCustomerPhone =
                      data.tcustomervs1[i].fields.Phone || "";
                    let popCustomerMobile =
                      data.tcustomervs1[i].fields.Mobile || "";
                    let popCustomerFaxnumber =
                      data.tcustomervs1[i].fields.Faxnumber || "";
                    let popCustomerSkypeName =
                      data.tcustomervs1[i].fields.SkypeName || "";
                    let popCustomerURL = data.tcustomervs1[i].fields.URL || "";
                    let popCustomerStreet =
                      data.tcustomervs1[i].fields.Street || "";
                    let popCustomerStreet2 =
                      data.tcustomervs1[i].fields.Street2 || "";
                    let popCustomerState =
                      data.tcustomervs1[i].fields.State || "";
                    let popCustomerPostcode =
                      data.tcustomervs1[i].fields.Postcode || "";
                    let popCustomerCountry =
                      data.tcustomervs1[i].fields.Country || LoggedCountry;
                    let popCustomerbillingaddress =
                      data.tcustomervs1[i].fields.BillStreet || "";
                    let popCustomerbcity =
                      data.tcustomervs1[i].fields.BillStreet2 || "";
                    let popCustomerbstate =
                      data.tcustomervs1[i].fields.BillState || "";
                    let popCustomerbpostalcode =
                      data.tcustomervs1[i].fields.BillPostcode || "";
                    let popCustomerbcountry =
                      data.tcustomervs1[i].fields.Billcountry || LoggedCountry;
                    let popCustomercustfield1 =
                      data.tcustomervs1[i].fields.CUSTFLD1 || "";
                    let popCustomercustfield2 =
                      data.tcustomervs1[i].fields.CUSTFLD2 || "";
                    let popCustomercustfield3 =
                      data.tcustomervs1[i].fields.CUSTFLD3 || "";
                    let popCustomercustfield4 =
                      data.tcustomervs1[i].fields.CUSTFLD4 || "";
                    let popCustomernotes =
                      data.tcustomervs1[i].fields.Notes || "";
                    let popCustomerpreferedpayment =
                      data.tcustomervs1[i].fields.PaymentMethodName || "";
                    let popCustomerterms =
                      data.tcustomervs1[i].fields.TermsName || "";
                    let popCustomerdeliverymethod =
                      data.tcustomervs1[i].fields.ShippingMethodName || "";
                    let popCustomeraccountnumber =
                      data.tcustomervs1[i].fields.ClientNo || "";
                    let popCustomerisContractor =
                      data.tcustomervs1[i].fields.Contractor || false;
                    let popCustomerissupplier =
                      data.tcustomervs1[i].fields.IsSupplier || false;
                    let popCustomeriscustomer =
                      data.tcustomervs1[i].fields.IsCustomer || false;
                    let popCustomerTaxCode =
                      data.tcustomervs1[i].fields.TaxCodeName || "";
                    let popCustomerDiscount =
                      data.tcustomervs1[i].fields.Discount || 0;
                    let popCustomerType =
                      data.tcustomervs1[i].fields.ClientTypeName || "";
                    //$('#edtCustomerCompany').attr('readonly', true);
                    $("#edtCustomerCompany").val(popCustomerName);
                    $("#edtCustomerPOPID").val(popCustomerID);
                    $("#edtCustomerPOPEmail").val(popCustomerEmail);
                    $("#edtTitle").val(popCustomerTitle);
                    $("#edtFirstName").val(popCustomerFirstName);
                    $("#edtMiddleName").val(popCustomerMiddleName);
                    $("#edtLastName").val(popCustomerLastName);
                    $("#edtCustomerPhone").val(popCustomerPhone);
                    $("#edtCustomerMobile").val(popCustomerMobile);
                    $("#edtCustomerFax").val(popCustomerFaxnumber);
                    $("#edtCustomerSkypeID").val(popCustomerSkypeName);
                    $("#edtCustomerWebsite").val(popCustomerURL);
                    $("#edtCustomerShippingAddress").val(popCustomerStreet);
                    $("#edtCustomerShippingCity").val(popCustomerStreet2);
                    $("#edtCustomerShippingState").val(popCustomerState);
                    $("#edtCustomerShippingZIP").val(popCustomerPostcode);
                    $("#sedtCountry").val(popCustomerCountry);
                    $("#txaNotes").val(popCustomernotes);
                    $("#sltPreferedPayment").val(popCustomerpreferedpayment);
                    $("#sltTermsPOP").val(popCustomerterms);
                    $("#sltCustomerType").val(popCustomerType);
                    $("#edtCustomerCardDiscount").val(popCustomerDiscount);
                    $("#edtCustomeField1").val(popCustomercustfield1);
                    $("#edtCustomeField2").val(popCustomercustfield2);
                    $("#edtCustomeField3").val(popCustomercustfield3);
                    $("#edtCustomeField4").val(popCustomercustfield4);

                    $("#sltTaxCode").val(popCustomerTaxCode);

                    if (
                      data.tcustomervs1[i].fields.Street ==
                        data.tcustomervs1[i].fields.BillStreet &&
                      data.tcustomervs1[i].fields.Street2 ==
                        data.tcustomervs1[i].fields.BillStreet2 &&
                      data.tcustomervs1[i].fields.State ==
                        data.tcustomervs1[i].fields.BillState &&
                      data.tcustomervs1[i].fields.Postcode ==
                        data.tcustomervs1[i].fields.BillPostcode &&
                      data.tcustomervs1[i].fields.Country ==
                        data.tcustomervs1[i].fields.Billcountry
                    ) {
                      $("#chkSameAsShipping2").attr("checked", "checked");
                    }

                    if (data.tcustomervs1[i].fields.IsSupplier == true) {
                      // $('#isformcontractor')
                      $("#chkSameAsSupplier").attr("checked", "checked");
                    } else {
                      $("#chkSameAsSupplier").removeAttr("checked");
                    }

                    setTimeout(function () {
                      $("#addCustomerModal").modal("show");
                    }, 200);
                  }
                }
                if (!added) {
                  $(".fullScreenSpin").css("display", "inline-block");
                  sideBarService
                    .getOneCustomerDataExByName(customerDataName)
                    .then(function (data) {
                      $(".fullScreenSpin").css("display", "none");
                      let lineItems = [];
                      $("#add-customer-title").text("Edit Customer");
                      let popCustomerID = data.tcustomer[0].fields.ID || "";
                      let popCustomerName =
                        data.tcustomer[0].fields.ClientName || "";
                      let popCustomerEmail =
                        data.tcustomer[0].fields.Email || "";
                      let popCustomerTitle =
                        data.tcustomer[0].fields.Title || "";
                      let popCustomerFirstName =
                        data.tcustomer[0].fields.FirstName || "";
                      let popCustomerMiddleName =
                        data.tcustomer[0].fields.CUSTFLD10 || "";
                      let popCustomerLastName =
                        data.tcustomer[0].fields.LastName || "";
                      let popCustomertfn = "" || "";
                      let popCustomerPhone =
                        data.tcustomer[0].fields.Phone || "";
                      let popCustomerMobile =
                        data.tcustomer[0].fields.Mobile || "";
                      let popCustomerFaxnumber =
                        data.tcustomer[0].fields.Faxnumber || "";
                      let popCustomerSkypeName =
                        data.tcustomer[0].fields.SkypeName || "";
                      let popCustomerURL = data.tcustomer[0].fields.URL || "";
                      let popCustomerStreet =
                        data.tcustomer[0].fields.Street || "";
                      let popCustomerStreet2 =
                        data.tcustomer[0].fields.Street2 || "";
                      let popCustomerState =
                        data.tcustomer[0].fields.State || "";
                      let popCustomerPostcode =
                        data.tcustomer[0].fields.Postcode || "";
                      let popCustomerCountry =
                        data.tcustomer[0].fields.Country || LoggedCountry;
                      let popCustomerbillingaddress =
                        data.tcustomer[0].fields.BillStreet || "";
                      let popCustomerbcity =
                        data.tcustomer[0].fields.BillStreet2 || "";
                      let popCustomerbstate =
                        data.tcustomer[0].fields.BillState || "";
                      let popCustomerbpostalcode =
                        data.tcustomer[0].fields.BillPostcode || "";
                      let popCustomerbcountry =
                        data.tcustomer[0].fields.Billcountry || LoggedCountry;
                      let popCustomercustfield1 =
                        data.tcustomer[0].fields.CUSTFLD1 || "";
                      let popCustomercustfield2 =
                        data.tcustomer[0].fields.CUSTFLD2 || "";
                      let popCustomercustfield3 =
                        data.tcustomer[0].fields.CUSTFLD3 || "";
                      let popCustomercustfield4 =
                        data.tcustomer[0].fields.CUSTFLD4 || "";
                      let popCustomernotes =
                        data.tcustomer[0].fields.Notes || "";
                      let popCustomerpreferedpayment =
                        data.tcustomer[0].fields.PaymentMethodName || "";
                      let popCustomerterms =
                        data.tcustomer[0].fields.TermsName || "";
                      let popCustomerdeliverymethod =
                        data.tcustomer[0].fields.ShippingMethodName || "";
                      let popCustomeraccountnumber =
                        data.tcustomer[0].fields.ClientNo || "";
                      let popCustomerisContractor =
                        data.tcustomer[0].fields.Contractor || false;
                      let popCustomerissupplier =
                        data.tcustomer[0].fields.IsSupplier || false;
                      let popCustomeriscustomer =
                        data.tcustomer[0].fields.IsCustomer || false;
                      let popCustomerTaxCode =
                        data.tcustomer[0].fields.TaxCodeName || "";
                      let popCustomerDiscount =
                        data.tcustomer[0].fields.Discount || 0;
                      let popCustomerType =
                        data.tcustomer[0].fields.ClientTypeName || "";
                      //$('#edtCustomerCompany').attr('readonly', true);
                      $("#edtCustomerCompany").val(popCustomerName);
                      $("#edtCustomerPOPID").val(popCustomerID);
                      $("#edtCustomerPOPEmail").val(popCustomerEmail);
                      $("#edtTitle").val(popCustomerTitle);
                      $("#edtFirstName").val(popCustomerFirstName);
                      $("#edtMiddleName").val(popCustomerMiddleName);
                      $("#edtLastName").val(popCustomerLastName);
                      $("#edtCustomerPhone").val(popCustomerPhone);
                      $("#edtCustomerMobile").val(popCustomerMobile);
                      $("#edtCustomerFax").val(popCustomerFaxnumber);
                      $("#edtCustomerSkypeID").val(popCustomerSkypeName);
                      $("#edtCustomerWebsite").val(popCustomerURL);
                      $("#edtCustomerShippingAddress").val(popCustomerStreet);
                      $("#edtCustomerShippingCity").val(popCustomerStreet2);
                      $("#edtCustomerShippingState").val(popCustomerState);
                      $("#edtCustomerShippingZIP").val(popCustomerPostcode);
                      $("#sedtCountry").val(popCustomerCountry);
                      $("#txaNotes").val(popCustomernotes);
                      $("#sltPreferedPayment").val(popCustomerpreferedpayment);
                      $("#sltTermsPOP").val(popCustomerterms);
                      $("#sltCustomerType").val(popCustomerType);
                      $("#edtCustomerCardDiscount").val(popCustomerDiscount);
                      $("#edtCustomeField1").val(popCustomercustfield1);
                      $("#edtCustomeField2").val(popCustomercustfield2);
                      $("#edtCustomeField3").val(popCustomercustfield3);
                      $("#edtCustomeField4").val(popCustomercustfield4);

                      $("#sltTaxCode").val(popCustomerTaxCode);

                      if (
                        data.tcustomer[0].fields.Street ==
                          data.tcustomer[0].fields.BillStreet &&
                        data.tcustomer[0].fields.Street2 ==
                          data.tcustomer[0].fields.BillStreet2 &&
                        data.tcustomer[0].fields.State ==
                          data.tcustomer[0].fields.BillState &&
                        data.tcustomer[0].fields.Postcode ==
                          data.tcustomer[0].fields.BillPostcode &&
                        data.tcustomer[0].fields.Country ==
                          data.tcustomer[0].fields.Billcountry
                      ) {
                        $("#chkSameAsShipping2").attr("checked", "checked");
                      }

                      if (data.tcustomer[0].fields.IsSupplier == true) {
                        // $('#isformcontractor')
                        $("#chkSameAsSupplier").attr("checked", "checked");
                      } else {
                        $("#chkSameAsSupplier").removeAttr("checked");
                      }

                      setTimeout(function () {
                        $("#addCustomerModal").modal("show");
                      }, 200);
                    })
                    .catch(function (err) {
                      $(".fullScreenSpin").css("display", "none");
                    });
                }
              }
            })
            .catch(function (err) {
              sideBarService
                .getOneCustomerDataExByName(customerDataName)
                .then(function (data) {
                  $(".fullScreenSpin").css("display", "none");
                  let lineItems = [];
                  $("#add-customer-title").text("Edit Customer");
                  let popCustomerID = data.tcustomer[0].fields.ID || "";
                  let popCustomerName =
                    data.tcustomer[0].fields.ClientName || "";
                  let popCustomerEmail = data.tcustomer[0].fields.Email || "";
                  let popCustomerTitle = data.tcustomer[0].fields.Title || "";
                  let popCustomerFirstName =
                    data.tcustomer[0].fields.FirstName || "";
                  let popCustomerMiddleName =
                    data.tcustomer[0].fields.CUSTFLD10 || "";
                  let popCustomerLastName =
                    data.tcustomer[0].fields.LastName || "";
                  let popCustomertfn = "" || "";
                  let popCustomerPhone = data.tcustomer[0].fields.Phone || "";
                  let popCustomerMobile = data.tcustomer[0].fields.Mobile || "";
                  let popCustomerFaxnumber =
                    data.tcustomer[0].fields.Faxnumber || "";
                  let popCustomerSkypeName =
                    data.tcustomer[0].fields.SkypeName || "";
                  let popCustomerURL = data.tcustomer[0].fields.URL || "";
                  let popCustomerStreet = data.tcustomer[0].fields.Street || "";
                  let popCustomerStreet2 =
                    data.tcustomer[0].fields.Street2 || "";
                  let popCustomerState = data.tcustomer[0].fields.State || "";
                  let popCustomerPostcode =
                    data.tcustomer[0].fields.Postcode || "";
                  let popCustomerCountry =
                    data.tcustomer[0].fields.Country || LoggedCountry;
                  let popCustomerbillingaddress =
                    data.tcustomer[0].fields.BillStreet || "";
                  let popCustomerbcity =
                    data.tcustomer[0].fields.BillStreet2 || "";
                  let popCustomerbstate =
                    data.tcustomer[0].fields.BillState || "";
                  let popCustomerbpostalcode =
                    data.tcustomer[0].fields.BillPostcode || "";
                  let popCustomerbcountry =
                    data.tcustomer[0].fields.Billcountry || LoggedCountry;
                  let popCustomercustfield1 =
                    data.tcustomer[0].fields.CUSTFLD1 || "";
                  let popCustomercustfield2 =
                    data.tcustomer[0].fields.CUSTFLD2 || "";
                  let popCustomercustfield3 =
                    data.tcustomer[0].fields.CUSTFLD3 || "";
                  let popCustomercustfield4 =
                    data.tcustomer[0].fields.CUSTFLD4 || "";
                  let popCustomernotes = data.tcustomer[0].fields.Notes || "";
                  let popCustomerpreferedpayment =
                    data.tcustomer[0].fields.PaymentMethodName || "";
                  let popCustomerterms =
                    data.tcustomer[0].fields.TermsName || "";
                  let popCustomerdeliverymethod =
                    data.tcustomer[0].fields.ShippingMethodName || "";
                  let popCustomeraccountnumber =
                    data.tcustomer[0].fields.ClientNo || "";
                  let popCustomerisContractor =
                    data.tcustomer[0].fields.Contractor || false;
                  let popCustomerissupplier =
                    data.tcustomer[0].fields.IsSupplier || false;
                  let popCustomeriscustomer =
                    data.tcustomer[0].fields.IsCustomer || false;
                  let popCustomerTaxCode =
                    data.tcustomer[0].fields.TaxCodeName || "";
                  let popCustomerDiscount =
                    data.tcustomer[0].fields.Discount || 0;
                  let popCustomerType =
                    data.tcustomer[0].fields.ClientTypeName || "";
                  //$('#edtCustomerCompany').attr('readonly', true);
                  $("#edtCustomerCompany").val(popCustomerName);
                  $("#edtCustomerPOPID").val(popCustomerID);
                  $("#edtCustomerPOPEmail").val(popCustomerEmail);
                  $("#edtTitle").val(popCustomerTitle);
                  $("#edtFirstName").val(popCustomerFirstName);
                  $("#edtMiddleName").val(popCustomerMiddleName);
                  $("#edtLastName").val(popCustomerLastName);
                  $("#edtCustomerPhone").val(popCustomerPhone);
                  $("#edtCustomerMobile").val(popCustomerMobile);
                  $("#edtCustomerFax").val(popCustomerFaxnumber);
                  $("#edtCustomerSkypeID").val(popCustomerSkypeName);
                  $("#edtCustomerWebsite").val(popCustomerURL);
                  $("#edtCustomerShippingAddress").val(popCustomerStreet);
                  $("#edtCustomerShippingCity").val(popCustomerStreet2);
                  $("#edtCustomerShippingState").val(popCustomerState);
                  $("#edtCustomerShippingZIP").val(popCustomerPostcode);
                  $("#sedtCountry").val(popCustomerCountry);
                  $("#txaNotes").val(popCustomernotes);
                  $("#sltPreferedPayment").val(popCustomerpreferedpayment);
                  $("#sltTermsPOP").val(popCustomerterms);
                  $("#sltCustomerType").val(popCustomerType);
                  $("#edtCustomerCardDiscount").val(popCustomerDiscount);
                  $("#edtCustomeField1").val(popCustomercustfield1);
                  $("#edtCustomeField2").val(popCustomercustfield2);
                  $("#edtCustomeField3").val(popCustomercustfield3);
                  $("#edtCustomeField4").val(popCustomercustfield4);

                  $("#sltTaxCode").val(popCustomerTaxCode);

                  if (
                    data.tcustomer[0].fields.Street ==
                      data.tcustomer[0].fields.BillStreet &&
                    data.tcustomer[0].fields.Street2 ==
                      data.tcustomer[0].fields.BillStreet2 &&
                    data.tcustomer[0].fields.State ==
                      data.tcustomer[0].fields.BillState &&
                    data.tcustomer[0].fields.Postcode ==
                      data.tcustomer[0].fields.BillPostcode &&
                    data.tcustomer[0].fields.Country ==
                      data.tcustomer[0].fields.Billcountry
                  ) {
                    $("#chkSameAsShipping2").attr("checked", "checked");
                  }

                  if (data.tcustomer[0].fields.IsSupplier == true) {
                    // $('#isformcontractor')
                    $("#chkSameAsSupplier").attr("checked", "checked");
                  } else {
                    $("#chkSameAsSupplier").removeAttr("checked");
                  }

                  setTimeout(function () {
                    $("#addCustomerModal").modal("show");
                  }, 200);
                })
                .catch(function (err) {
                  $(".fullScreenSpin").css("display", "none");
                });
            });
        } else {
          $("#customerListModal").modal();
          setTimeout(function () {
            $("#tblCustomerlist_filter .form-control-sm").focus();
            $("#tblCustomerlist_filter .form-control-sm").val("");
            $("#tblCustomerlist_filter .form-control-sm").trigger("input");
            var datatable = $("#tblCustomerlist").DataTable();
            //datatable.clear();
            //datatable.rows.add(splashArrayCustomerList);
            datatable.draw();
            $("#tblCustomerlist_filter .form-control-sm").trigger("input");
            //$('#tblCustomerlist').dataTable().fnFilter(' ').draw(false);
          }, 500);
        }
      }
    });

  /* On click Customer List */
  $(document).on("click", "#tblCustomerlist tbody tr", function (e) {
    var tableCustomer = $(this);
    $("#sltJob").val(tableCustomer.find(".colCompany").text());
    $("#customerListModal").modal("toggle");
    $("#tblCustomerlist_filter .form-control-sm").val("");
    setTimeout(function () {
      $(".btnRefreshCustomer").trigger("click");
      $(".fullScreenSpin").css("display", "none");
    }, 1000);
  });

  /* On clik Inventory Line */
  $(document).on("click", "#tblInventoryPayrollService tbody tr", function (e) {
    var tableProductService = $(this);

    let lineProductName = tableProductService.find(".productName").text() || "";
    let lineProductDesc = tableProductService.find(".productDesc").text() || "";
    let lineProdCost = tableProductService.find(".costPrice").text() || 0;
    $("#product-list").val(lineProductName);
    $("#edtProductCost").val(lineProdCost);
    $("#productListModal").modal("toggle");
    $("#tblInventoryPayrollService_filter .form-control-sm").val("");

    setTimeout(function () {
      //$('#tblCustomerlist_filter .form-control-sm').focus();
      $(".btnRefreshProduct").trigger("click");
      $(".fullScreenSpin").css("display", "none");
    }, 1000);
  });

  var isMobile = false;
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      navigator.userAgent
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      navigator.userAgent.substr(0, 4)
    )
  ) {
    isMobile = true;
  }
  if (isMobile == true) {
    setTimeout(function () {
      document.getElementById("scanBarcode").style.display = "none";
      document.getElementById("mobileBarcodeScanClockOff").style.display =
        "block";
    }, 500);
  }

  function onScanSuccessClockOff(decodedText, decodedResult) {
    var barcodeScannerClockOff = decodedText.toUpperCase() || "";
    $("#scanBarcodeModalClockOff").modal("toggle");
    if (barcodeScannerClockOff != "") {
      setTimeout(function () {
        $("#barcodeScanInput").val(barcodeScannerClockOff);
        $("#barcodeScanInput").trigger("input");
      }, 200);
    }
  }

  var html5QrcodeScannerClockOff = new Html5QrcodeScanner(
    "qr-reader-ClockOff",
    {
      fps: 10,
      qrbox: 250,
      rememberLastUsedCamera: true,
    }
  );
  html5QrcodeScannerClockOff.render(onScanSuccessClockOff);
});

Template.payrolloverview.events({
  "click .isPaused": function (event) {
    const templateObject = Template.instance();
    let timesheetID = $("#updateID").val() || "";

    let clockList = templateObject.timesheetrecords.get();
    clockList = clockList.filter((clkList) => {
      return clkList.id == timesheetID;
    });
    if (clockList.length > 0) {
      let checkPause = clockList[0].isPaused;
      if ($("#btnHold").prop("disabled") && checkPause == "paused") {
        swal({
          title: "Continue Timesheet",
          text: 'This Timesheet is currently "On Hold" do you want to "Continue" it',
          type: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
        }).then((result) => {
          if (result.value) {
            $("#btnClockOn").trigger("click");
          }
        });
      } else if ($("#btnHold").prop("disabled") && checkPause == "completed") {
        swal({
          title: "New Timesheet",
          text: 'This Timesheet has been completed, do you want to "Clock On" to start a new Timesheet?',
          type: "question",
          showCancelButton: true,
          confirmButtonText: "Yes",
        }).then((result) => {
          if (result.value) {
            $("#btnClockOn").prop("disabled", false);
            $("#startTime").prop("disabled", false);
            $("#endTime").prop("disabled", false);
            var currentDate = new Date();
            var begunDate = moment(currentDate).format("DD/MM/YYYY");
            let fromDateMonth = currentDate.getMonth();
            let fromDateDay = currentDate.getDate();
            if (currentDate.getMonth() + 1 < 10) {
              fromDateMonth = "0" + (currentDate.getMonth() + 1);
            }

            if (currentDate.getDate() < 10) {
              fromDateDay = "0" + currentDate.getDate();
            }
            var fromDate =
              fromDateDay +
              "/" +
              fromDateMonth +
              "/" +
              currentDate.getFullYear();

            $("#dtSODate").val(fromDate);
            $("#txtBookedHoursSpent").val("");
            $("#updateID").val("");
            $("#startTime").val("");
            $("#endTime").val("");
            $("#btnClockOn").trigger("click");
          }
        });
      }
    }
  },
  "change #startTime": function () {
    const templateObject = Template.instance();

    var date1Time = new Date($("#dtSODate").datepicker("getDate"));

    let date1 =
      date1Time.getFullYear() +
      "/" +
      (date1Time.getMonth() + 1) +
      "/" +
      date1Time.getDate();

    var endtime24Hours = getHour24($("#endTime").val()) || "";
    var starttime24Hours = getHour24($("#startTime").val()) || "";

    var endTime = new Date(date1 + " " + endtime24Hours);
    var startTime = new Date(date1 + " " + starttime24Hours);

    if (endTime > startTime) {
      let hours = parseFloat(
        templateObject.diff_hours(endTime, startTime)
      ).toFixed(2);
      document.getElementById("txtBookedHoursSpent").value =
        templateObject.timeFormat(hours);
    } else {
      document.getElementById("txtBookedHoursSpent").value = "00:00";
    }
  },
  "change #endTime": function () {
    const templateObject = Template.instance();

    var date1Time = new Date($("#dtSODate").datepicker("getDate"));

    let date1 =
      date1Time.getFullYear() +
      "/" +
      (date1Time.getMonth() + 1) +
      "/" +
      date1Time.getDate();

    var endtime24Hours = getHour24($("#endTime").val()) || "";
    var starttime24Hours = getHour24($("#startTime").val()) || "";

    var endTime = new Date(date1 + " " + endtime24Hours);
    var startTime = new Date(date1 + " " + starttime24Hours);

    if (endTime > startTime) {
      let hours = parseFloat(
        templateObject.diff_hours(endTime, startTime)
      ).toFixed(2);
      document.getElementById("txtBookedHoursSpent").value =
        templateObject.timeFormat(hours);
    } else {
      document.getElementById("txtBookedHoursSpent").value = "00:00";
    }
  },
  "blur #endTime": function () {
    const templateObject = Template.instance();
    if ($("#endTime").val() != "") {
      setTimeout(function () {
        templateObject.endTimePopUp();
      }, 10);
    }
  },
  "click .clockOn": function (event) {
    if ($("#btnClockOn").prop("disabled")) {
      swal({
        title: "New Timesheet",
        text: 'This Timesheet has been completed, do you want to "Clock On" to start a new Timesheet?',
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.value) {
          $("#btnClockOn").prop("disabled", false);
          $("#startTime").prop("disabled", false);
          $("#endTime").prop("disabled", false);
          var currentDate = new Date();
          var begunDate = moment(currentDate).format("DD/MM/YYYY");
          let fromDateMonth = currentDate.getMonth();
          let fromDateDay = currentDate.getDate();
          if (currentDate.getMonth() + 1 < 10) {
            fromDateMonth = "0" + (currentDate.getMonth() + 1);
          }

          if (currentDate.getDate() < 10) {
            fromDateDay = "0" + currentDate.getDate();
          }
          var fromDate =
            fromDateDay + "/" + fromDateMonth + "/" + currentDate.getFullYear();

          $("#dtSODate").val(fromDate);
          $("#updateID").val("");
          $("#startTime").val("");
          $("#endTime").val("");
          $("#txtBookedHoursSpent").val("");
          $("#txtBookedHoursSpent1").val("");
          $("#btnClockOn").trigger("click");
        }
      });
    }
  },
  "click #btnNewEmployee": function (event) {
    FlowRouter.go("/employeescard");
  },
  "click #btnTimesheet": function (event) {
    FlowRouter.go("/timesheet");
  },
  "click #btnClockOnOff": function (event) {
    const templateObject = Template.instance();
    let checkIncludeAllProducts = templateObject.includeAllProducts.get();
    $("#employee_name").val(Session.get("mySessionEmployee"));
    $("#sltJob").val("");
    $("#product-list").val("");
    $("#edtProductCost").val(0);
    $("#updateID").val("");
    $("#startTime").val("");
    $("#endTime").val("");
    $("#txtBookedHoursSpent").val("");
    $("#startTime").prop("disabled", false);
    $("#endTime").prop("disabled", false);
    $("#btnClockOn").prop("disabled", false);
    $("#btnHold").prop("disabled", false);
    $("#btnClockOff").prop("disabled", false);
    var curretDate = moment().format("DD/MM/YYYY");
    let getEmployeeID = Session.get("mySessionEmployeeLoggedID") || "";
    setTimeout(function () {
      $("#dtSODate").val(curretDate);
    }, 100);
    if (checkIncludeAllProducts == true) {
      templateObject.getAllProductData();
    } else {
      if (getEmployeeID != "") {
        templateObject.getAllSelectedProducts(getEmployeeID);
      } else {
        templateObject.getAllProductData();
      }
    }
    let clockList = templateObject.timesheetrecords.get();
    clockList = clockList.filter((clkList) => {
      return clkList.employee == $("#employee_name").val();
    });

    if (clockList.length > 0) {
      if (clockList[clockList.length - 1].isPaused == "paused") {
        $(".btnHold").prop("disabled", true);
      } else {
        $(".btnHold").prop("disabled", false);
      }

      if (clockList[clockList.length - 1].isPaused == "paused") {
        $(".paused").show();
        $("#btnHold").prop("disabled", true);
        $("#btnHold").addClass("mt-32");
      } else {
        $(".paused").hide();
        $("#btnHold").prop("disabled", false);
        $("#btnHold").removeClass("mt-32");
      }

      if (
        Array.isArray(clockList[clockList.length - 1].timelog) &&
        clockList[clockList.length - 1].isPaused != "completed"
      ) {
        let startTime =
          clockList[clockList.length - 1].timelog[0].fields.StartDatetime || "";
        let date = clockList[clockList.length - 1].timesheetdate;

        if (startTime != "") {
          $("#startTime").val(startTime.split(" ")[1]);
          $("#dtSODate").val(date);
          $("#txtBookedHoursSpent").val(
            clockList[clockList.length - 1].hourFormat
          );
          $("#txtBookedHoursSpent1").val(clockList[clockList.length - 1].hours);
          $("#updateID").val(clockList[clockList.length - 1].id);
          $("#timesheetID").text(clockList[clockList.length - 1].id);
          $("#txtNotes").val(clockList[clockList.length - 1].notes);
          $("#sltJob").val(clockList[clockList.length - 1].job);
          $("#product-list").val(clockList[clockList.length - 1].product);
          $("#edtProductCost").val(
            clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, "")
          );
          //$('#product-list').prepend('<option>' + clockList[clockList.length - 1].product + '</option>');
          //$("#product-list")[0].options[0].selected = true;
          $("#hourly_rate").val(
            clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, "")
          );
          $("#startTime").prop("disabled", true);
          if (clockList[clockList.length - 1].isPaused == "completed") {
            $("#endTime").val(endTime);
            $("#endTime").prop("disabled", true);
            $("#btnClockOn").prop("disabled", true);
            $("#btnHold").prop("disabled", true);
            $("#btnClockOff").prop("disabled", true);
          }
        }
      } else if (clockList[clockList.length - 1].isPaused != "completed") {
        if (clockList[clockList.length - 1].timelog.fields.EndDatetime == "") {
          let startTime =
            clockList[clockList.length - 1].timelog.fields.StartDatetime.split(
              " "
            )[1];
          let date = clockList[clockList.length - 1].timesheetdate;
          if (startTime != "") {
            $("#startTime").val(startTime);
            $("#dtSODate").val(date);
            $("#txtBookedHoursSpent").val(
              clockList[clockList.length - 1].hourFormat
            );
            $("#txtBookedHoursSpent1").val(
              clockList[clockList.length - 1].hours
            );
            $("#updateID").val(clockList[clockList.length - 1].id);
            $("#timesheetID").text(clockList[clockList.length - 1].id);
            $("#txtNotes").val(clockList[clockList.length - 1].notes);
            $("#sltJob").val(clockList[clockList.length - 1].job);
            $("#product-list").val(clockList[clockList.length - 1].product);
            $("#edtProductCost").val(
              clockList[clockList.length - 1].hourlyrate.replace(
                /[^0-9.-]+/g,
                ""
              )
            );
            //$('#product-list').prepend('<option>' + clockList[clockList.length - 1].product + '</option>');
            //$("#product-list")[0].options[0].selected = true;
            $("#hourly_rate").val(
              clockList[clockList.length - 1].hourlyrate.replace(
                /[^0-9.-]+/g,
                ""
              )
            );
            $("#startTime").prop("disabled", true);
            if (clockList[clockList.length - 1].isPaused == "completed") {
              $("#endTime").val(endTime);
              $("#endTime").prop("disabled", true);
              $("#btnClockOn").prop("disabled", true);
              $("#btnHold").prop("disabled", true);
              $("#btnClockOff").prop("disabled", true);
            }
          }
        }
      }
    } else {
      $(".paused").hide();
      $("#btnHold").prop("disabled", false);
    }
    $("#settingsModal").modal("show");
  },
  "click #btnClockOn": function () {
    const templateObject = Template.instance();

    let clockList = templateObject.timesheetrecords.get();
    var product = $("#product-list").val() || "";
    clockList = clockList.filter((clkList) => {
      return (
        clkList.employee == $("#employee_name").val() &&
        clkList.id == $("#updateID").val()
      );
    });
    let contactService = new ContactService();
    let updateID = $("#updateID").val() || "";
    let checkStatus = "";
    let checkStartTime = "";
    let checkEndTime = "";
    let latestTimeLogId = "";
    let toUpdate = {};
    let newEntry = {};
    let date = new Date();
    let initialDate = new Date($("#dtSODate").datepicker("getDate"));
    //new Date(moment($('dtSODate').val()).format("YYYY-MM-DD"));
    if (clockList.length > 0) {
      if (Array.isArray(clockList[clockList.length - 1].timelog)) {
        checkStatus = clockList[clockList.length - 1].isPaused || "";
        latestTimeLogId =
          clockList[clockList.length - 1].timelog[
            clockList[clockList.length - 1].timelog.length - 1
          ].fields.ID || "";
        checkStartTime =
          clockList[clockList.length - 1].timelog[0].fields.StartDatetime || "";
        checkEndTime =
          clockList[clockList.length - 1].timelog[
            clockList[clockList.length - 1].timelog.length - 1
          ].fields.EndDatetime || "";
      } else {
        checkStatus = clockList[clockList.length - 1].isPaused || "";
        latestTimeLogId =
          clockList[clockList.length - 1].timelog.fields.ID || "";
        checkStartTime =
          clockList[clockList.length - 1].timelog.fields.StartDatetime || "";
        checkEndTime =
          clockList[clockList.length - 1].timelog.fields.EndDatetime || "";
      }
    }
    // if (checkStatus == "paused") {
    //     return false;
    // }
    if (checkStatus == "completed") {
      $("#updateID").val("");
      $("#startTime").val(
        moment().startOf("hour").format("HH") +
          ":" +
          moment().startOf("minute").format("mm")
      );
      let startDate =
        initialDate.getFullYear() +
        "-" +
        ("0" + (initialDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + initialDate.getDate()).slice(-2);
      let endDate =
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2);
      var endTime = new Date(
        endDate + " " + document.getElementById("endTime").value
      );
      var startTime = new Date(
        startDate + " " + document.getElementById("startTime").value
      );
      if (endTime > startTime) {
        let hours = parseFloat(
          templateObject.diff_hours(endTime, startTime)
        ).toFixed(2);
        document.getElementById("txtBookedHoursSpent").value =
          templateObject.timeFormat(hours);
      } else if (document.getElementById("endTime").value == "") {
        endTime = "";
      }
      $("#btnSaveTimeSheet").trigger("click");
    } else {
      $(".fullScreenSpin").css("display", "inline-block");
      if (
        checkStartTime != "" &&
        checkEndTime == "" &&
        $("#btnHold").prop("disabled") == true
      ) {
        let startDate =
          initialDate.getFullYear() +
          "-" +
          ("0" + (initialDate.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + initialDate.getDate()).slice(-2);
        let endDate =
          date.getFullYear() +
          "-" +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + date.getDate()).slice(-2);
        let endTime =
          $("#endTime").val() ||
          ("0" + date.getHours()).slice(-2) +
            ":" +
            ("0" + date.getMinutes()).slice(-2);
        let startTime =
          ("0" + date.getHours()).slice(-2) +
          ":" +
          ("0" + date.getMinutes()).slice(-2);
        toUpdate = {
          type: "TTimeLog",
          fields: {
            ID: latestTimeLogId,
            EndDatetime: endDate + " " + endTime,
          },
        };

        newEntry = {
          type: "TTimeLog",
          fields: {
            TimeSheetID: updateID,
            StartDatetime: endDate + " " + startTime,
            Product: product,
            Description: "Job Continued",
          },
        };

        let updateTimeSheet = {
          type: "TTimeSheet",
          fields: {
            ID: updateID,
            InvoiceNotes: "Clocked On",
          },
        };

        contactService
          .saveTimeSheetLog(newEntry)
          .then(function (savedData) {
            contactService
              .saveTimeSheetLog(toUpdate)
              .then(function (savedData1) {
                contactService
                  .saveClockTimeSheet(updateTimeSheet)
                  .then(function (savedTimesheetData) {
                    sideBarService.getAllTimeSheetList().then(function (data) {
                      addVS1Data("TTimeSheet", JSON.stringify(data));
                      setTimeout(function () {
                        templateObject.checkAccessSaveRedirect();
                      }, 500);
                    });
                  })
                  .catch(function (err) {
                    swal({
                      title: "Oooops...",
                      text: err,
                      type: "error",
                      showCancelButton: false,
                      confirmButtonText: "Try Again",
                    }).then((result) => {
                      if (result.value) {
                        // Meteor._reload.reload();
                      } else if (result.dismiss === "cancel") {
                      }
                    });
                    $(".fullScreenSpin").css("display", "none");
                  })
                  .catch(function (err) {});
                // contactService.saveClockonClockOff(toUpdate).then(function (data) {

                // })
              })
              .catch(function (err) {
                swal({
                  title: "Oooops...",
                  text: err,
                  type: "error",
                  showCancelButton: false,
                  confirmButtonText: "Try Again",
                }).then((result) => {
                  if (result.value) {
                    // Meteor._reload.reload();
                  } else if (result.dismiss === "cancel") {
                  }
                });
                $(".fullScreenSpin").css("display", "none");
              });
          })
          .catch(function (err) {
            swal({
              title: "Oooops...",
              text: err,
              type: "error",
              showCancelButton: false,
              confirmButtonText: "Try Again",
            }).then((result) => {
              if (result.value) {
                // Meteor._reload.reload();
              } else if (result.dismiss === "cancel") {
              }
            });
            $(".fullScreenSpin").css("display", "none");
          });
      } else if (clockList.length < 1) {
        $("#startTime").val(
          moment().startOf("hour").format("HH") +
            ":" +
            moment().startOf("minute").format("mm")
        );
        $("#btnSaveTimeSheet").trigger("click");
      } else {
        $(".fullScreenSpin").css("display", "none");
        return false;
        // $("#startTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
        // let date1 = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
        // var endTime = new Date(date1 + ' ' + document.getElementById("endTime").value);
        // var startTime = new Date(date1 + ' ' + document.getElementById("startTime").value);
        // if (endTime > startTime) {
        //     document.getElementById('txtBookedHoursSpent').value = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
        // } else if (document.getElementById("endTime").value == "") {
        //     endTime = "";
        // }
        // $("#btnSaveTimeSheetOne").trigger("click");
      }
    }
  },
  "click #btnClockOff": function () {
    let templateObject = Template.instance();
    let clockList = templateObject.timesheetrecords.get();
    let clockListStandBy = templateObject.timesheetrecords.get();
    let index = clockList
      .map(function (e) {
        return e.id;
      })
      .indexOf(parseInt($("#updateID").val()));
    clockList = clockList.filter((clkList) => {
      return (
        clkList.employee == $("#employee_name").val() &&
        clkList.id == $("#updateID").val()
      );
    });
    let contactService = new ContactService();
    let updateID = $("#updateID").val() || "";
    let startTime = $("#startTime").val() || "";
    let checkStatus = "";
    let checkStartTime = "";
    let checkEndTime = "";
    let latestTimeLogId = "";
    var product = $("#product-list").val() || "";
    let toUpdate = {};
    let date = new Date();
    let initialDate = new Date($("#dtSODate").datepicker("getDate"));

    //new Date(moment($("#dtSODate").datepicker("getDate")).format("YYYY-MM-DD"));
    if (clockList.length > 0) {
      let getstartDatedata =
        clockList[clockList.length - 1].startTime.split(" ")[0] || "";
      let dateInnitialDate = new Date(getstartDatedata);
      initialDate = new Date(getstartDatedata) || initialDate;

      if (Array.isArray(clockList[clockList.length - 1].timelog)) {
        checkStatus = clockList[clockList.length - 1].isPaused || "";
        latestTimeLogId =
          clockList[clockList.length - 1].timelog[
            clockList[clockList.length - 1].timelog.length - 1
          ].fields.ID || "";
        checkStartTime =
          clockList[clockList.length - 1].timelog[0].fields.StartDatetime || "";
        checkEndTime =
          clockList[clockList.length - 1].timelog[
            clockList[clockList.length - 1].timelog.length - 1
          ].fields.EndDatetime || "";
      } else {
        checkStatus = clockList[clockList.length - 1].isPaused || "";
        latestTimeLogId =
          clockList[clockList.length - 1].timelog.fields.ID || "";
        checkStartTime =
          clockList[clockList.length - 1].timelog.fields.StartDatetime || "";
        checkEndTime =
          clockList[clockList.length - 1].timelog.fields.EndDatetime || "";
      }
    }
    if (startTime == "") {
      swal({
        title: "Oooops...",
        text: "Please Clock In before you can Clock Off",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Try Again",
      }).then((result) => {
        if (result.value) {
          // Meteor._reload.reload();
        } else if (result.dismiss === "cancel") {
        }
      });
      $(".fullScreenSpin").css("display", "none");
    } else if (checkStatus == "paused") {
      $(".fullScreenSpin").css("display", "none");
      swal({
        title: "End Timesheet",
        text: 'This Timesheet is Currently "On Hold", Do you want to "Clock Off"? ',
        type: "question",
        showCancelButton: true,
        denyButtonText: "Continue",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.value) {
          $(".fullScreenSpin").css("display", "inline-block");
          document.getElementById("endTime").value =
            moment().startOf("hour").format("HH") +
            ":" +
            moment().startOf("minute").format("mm");
          let startDate =
            initialDate.getFullYear() +
            "-" +
            ("0" + (initialDate.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + initialDate.getDate()).slice(-2);
          let endDate =
            date.getFullYear() +
            "-" +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + date.getDate()).slice(-2);

          let startTime =
            ("0" + date.getHours()).slice(-2) +
            ":" +
            ("0" + date.getMinutes()).slice(-2);
          let endTime = $("endTime").val();
          toUpdate = {
            type: "TTimeLog",
            fields: {
              ID: latestTimeLogId,
              EndDatetime: endDate + " " + endTime,
            },
          };

          let newEntry = {
            type: "TTimeLog",
            fields: {
              TimeSheetID: updateID,
              StartDatetime: endDate + " " + startTime,
              Product: product,
              Description: "Job Continued",
            },
          };

          let updateTimeSheet = {
            type: "TTimeSheet",
            fields: {
              ID: updateID,
              InvoiceNotes: "Clocked On",
            },
          };

          contactService
            .saveTimeSheetLog(newEntry)
            .then(function (savedData) {
              contactService
                .saveTimeSheetLog(toUpdate)
                .then(function (savedData1) {
                  contactService
                    .saveClockTimeSheet(updateTimeSheet)
                    .then(function (savedTimesheetData) {
                      clockListStandBy[index].isPaused = "";
                      templateObject.timesheetrecords.set(clockListStandBy);
                      $(".paused").hide();
                      $("#btnHold").removeClass("mt-32");
                      //document.getElementById("endTime").value = moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm');
                      var endTime = new Date(
                        endDate + " " + document.getElementById("endTime").value
                      );
                      var startTime = new Date(
                        startDate +
                          " " +
                          document.getElementById("startTime").value
                      );
                      if (endTime > startTime) {
                        let hours = parseFloat(
                          templateObject.diff_hours(endTime, startTime)
                        ).toFixed(2);
                        document.getElementById("txtBookedHoursSpent").value =
                          templateObject.timeFormat(hours);
                        $("#btnSaveTimeSheet").trigger("click");
                      } else {
                        swal({
                          title: "Oooops...",
                          text: "Start Time can't be greater than End Time",
                          type: "error",
                          showCancelButton: true,
                          confirmButtonText: "Ok",
                        });
                        $(".fullScreenSpin").css("display", "none");
                      }
                    })
                    .catch(function (err) {
                      swal({
                        title: "Oooops...",
                        text: err,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonText: "Try Again",
                      }).then((result) => {
                        if (result.value) {
                          // Meteor._reload.reload();
                        } else if (result.dismiss === "cancel") {
                        }
                      });
                      $(".fullScreenSpin").css("display", "none");
                    })
                    .catch(function (err) {});
                  // contactService.saveClockonClockOff(toUpdate).then(function (data) {

                  // })
                })
                .catch(function (err) {
                  swal({
                    title: "Oooops...",
                    text: err,
                    type: "error",
                    showCancelButton: false,
                    confirmButtonText: "Try Again",
                  }).then((result) => {
                    if (result.value) {
                      // Meteor._reload.reload();
                    } else if (result.dismiss === "cancel") {
                    }
                  });
                  $(".fullScreenSpin").css("display", "none");
                });
            })
            .catch(function (err) {
              swal({
                title: "Oooops...",
                text: err,
                type: "error",
                showCancelButton: false,
                confirmButtonText: "Try Again",
              }).then((result) => {
                if (result.value) {
                  // Meteor._reload.reload();
                } else if (result.dismiss === "cancel") {
                }
              });
              $(".fullScreenSpin").css("display", "none");
            });

          //$("#btnClockOn").trigger("click");
        }
      });
    } else {
      swal({
        title: "End Timesheet",
        text: "Are you sure you want to Clock Off",
        type: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.value) {
          document.getElementById("endTime").value =
            moment().startOf("hour").format("HH") +
            ":" +
            moment().startOf("minute").format("mm");
          let startDate =
            initialDate.getFullYear() +
            "-" +
            ("0" + (initialDate.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + initialDate.getDate()).slice(-2);
          let endDate =
            date.getFullYear() +
            "-" +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + date.getDate()).slice(-2);

          var startTime = new Date(
            startDate + " " + document.getElementById("startTime").value
          );
          var endTime = new Date(
            endDate + " " + document.getElementById("endTime").value
          );
          if (endTime > startTime) {
            let hours = parseFloat(
              templateObject.diff_hours(endTime, startTime)
            ).toFixed(2);
            document.getElementById("txtBookedHoursSpent").value =
              templateObject.timeFormat(hours);
            $("#btnSaveTimeSheet").trigger("click");
          } else {
            swal({
              title: "Oooops...",
              text: "Start Time can't be greater than End Time",
              type: "error",
              showCancelButton: true,
              confirmButtonText: "Ok",
            });
            $(".fullScreenSpin").css("display", "none");
          }
        }
      });
    }
  },
  "click #btnHold": function (event) {
    $("#frmOnHoldModal").modal("show");
  },
  "click .btnSaveTimeSheet": async function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let showTimesheetStatus = Session.get("CloudShowTimesheet") || true;
    let checkStatus = "";
    let checkStartTime = "";
    let checkEndTime = "";
    let TimeSheetHours = 0;
    let updateID = $("#updateID").val() || "";
    let contactService = new ContactService();

    let clockList = templateObject.timesheetrecords.get();

    let getEmpIDFromLine = $(".employee_name").val() || "";
    if (getEmpIDFromLine != "") {
      let checkEmpTimeSettings =
        (await contactService.getCheckTimeEmployeeSettingByName(
          getEmpIDFromLine
        )) || "";
      if (checkEmpTimeSettings != "") {
        if (checkEmpTimeSettings.temployee[0].CustFld8 == "false") {
          var productcost = parseFloat($("#edtProductCost").val()) || 0;
        } else {
          var productcost = 0;
        }
      }
    } else {
      var productcost = 0;
    }
    clockList = clockList.filter((clkList) => {
      return (
        clkList.employee == $("#employee_name").val() &&
        clkList.id == $("#updateID").val()
      );
    });
    if (clockList.length > 0) {
      if (Array.isArray(clockList[clockList.length - 1].timelog)) {
        checkStatus = clockList[clockList.length - 1].isPaused || "";
        TimeSheetHours: clockList[clockList.length - 1].hours || "";
        latestTimeLogId =
          clockList[clockList.length - 1].timelog[
            clockList[clockList.length - 1].timelog.length - 1
          ].fields.ID || "";
        checkStartTime =
          clockList[clockList.length - 1].timelog[0].fields.StartDatetime || "";
        checkEndTime =
          clockList[clockList.length - 1].timelog[
            clockList[clockList.length - 1].timelog.length - 1
          ].fields.EndDatetime || "";
      } else {
        checkStatus = clockList[clockList.length - 1].isPaused || "";
        TimeSheetHours: clockList[clockList.length - 1].hours || "";
        latestTimeLogId =
          clockList[clockList.length - 1].timelog.fields.ID || "";
        checkStartTime =
          clockList[clockList.length - 1].timelog.fields.StartDatetime || "";
        checkEndTime =
          clockList[clockList.length - 1].timelog.fields.EndDatetime || "";
      }
    }

    var employeeName = $(".employee_name").val();
    var startdateGet = new Date($("#dtSODate").datepicker("getDate"));
    var endDateGet = new Date();
    let date =
      startdateGet.getFullYear() +
      "-" +
      ("0" + (startdateGet.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + startdateGet.getDate()).slice(-2);
    let endDate =
      endDateGet.getFullYear() +
      "-" +
      ("0" + (endDateGet.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + endDateGet.getDate()).slice(-2);
    var startTime = $("#startTime").val() || "";
    var endTime = $("#endTime").val() || "";
    var edthour = $("#txtBookedHoursSpent").val() || "00:01";
    let hours = templateObject.timeToDecimal(edthour);
    var techNotes = $("#txtNotes").val() || "";
    var product = $("#product-list").val() || "";
    var jobName = $("#sltJob").val() || "";
    let isPaused = checkStatus;
    let toUpdate = {};
    let obj = {};
    let data = "";
    if (startTime != "") {
      startTime = date + " " + startTime;
    }

    if (endTime != "") {
      endTime = endDate + " " + endTime;
    }

    if (hours != 0) {
      edthour = hours + parseFloat($("#txtBookedHoursSpent1").val());
    }

    if (hours != 0) {
      obj = {
        type: "TTimeLog",
        fields: {
          TimeSheetID: updateID,
          EmployeeID: Session.get("mySessionEmployeeLoggedID"),
          StartDatetime: checkStartTime,
          EndDatetime: endTime,
          Product: product,
          Description: "Timesheet Completed",
          EnteredBy: Session.get("mySessionEmployeeLoggedID"),
        },
      };
      isPaused = "completed";
    }

    if (checkStartTime == "" && endTime != "") {
      $(".fullScreenSpin").css("display", "none");
      swal({
        title: "Oooops...",
        text: "You can't clock off, because you haven't clocked in",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Try Again",
      }).then((result) => {
        if (result.value) {
          // Meteor._reload.reload();
        } else if (result.dismiss === "cancel") {
        }
      });
      return false;
    }

    if (checkStartTime == "" && startTime == "") {
      $(".fullScreenSpin").css("display", "none");
      swal({
        title: "Oooops...",
        text: "You can't save this entry with no start time",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Try Again",
      }).then((result) => {
        if (result.value) {
          // Meteor._reload.reload();
        } else if (result.dismiss === "cancel") {
        }
      });
      return false;
    }

    if (updateID != "") {
      result = clockList.filter((Timesheet) => {
        return Timesheet.id == updateID;
      });

      if (result.length > 0) {
        if (result[0].timelog == null) {
          obj = {
            type: "TTimeLog",
            fields: {
              TimeSheetID: updateID,
              EmployeeID: Session.get("mySessionEmployeeLoggedID"),
              StartDatetime: startTime,
              EndDatetime: endTime,
              Product: product,
              Description: "Timesheet Started",
              EnteredBy: Session.get("mySessionEmployeeLoggedID"),
            },
          };
        } else if (
          $("#startTime").val() != "" &&
          $("#endTime").val() != "" &&
          checkStatus != "completed"
        ) {
          let startTime1 =
            startdateGet.getFullYear() +
            "-" +
            ("0" + (startdateGet.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + startdateGet.getDate()).slice(-2) +
            " " +
            ("0" + startdateGet.getHours()).slice(-2) +
            ":" +
            ("0" + startdateGet.getMinutes()).slice(-2);
          obj = {
            type: "TTimeLog",
            fields: {
              TimeSheetID: updateID,
              EmployeeID: Session.get("mySessionEmployeeLoggedID"),
              StartDatetime: checkStartTime,
              EndDatetime: endTime,
              Product: product,
              Description: "Timesheet Completed",
              EnteredBy: Session.get("mySessionEmployeeLoggedID"),
            },
          };
          isPaused = "completed";
        } else if (checkEndTime != "") {
          aEndDate = moment().format("YYYY-MM-DD") + " " + endTime;
        }
      } else {
        obj = {
          type: "TTimeLog",
          fields: {
            TimeSheetID: updateID,
            EmployeeID: Session.get("mySessionEmployeeLoggedID"),
            StartDatetime: startTime,
            EndDatetime: endTime,
            Product: product,
            Description: "Timesheet Started",
            EnteredBy: Session.get("mySessionEmployeeLoggedID"),
          },
        };
      }
    }
    if (updateID == "") {
      if ($("#startTime").val() != "" && $("#endTime").val() != "") {
        obj = {
          type: "TTimeLog",
          fields: {
            EmployeeID: Session.get("mySessionEmployeeLoggedID"),
            StartDatetime: startTime,
            EndDatetime: endTime,
            Product: product,
            Description: "Timesheet Started & Completed",
            EnteredBy: Session.get("mySessionEmployeeLoggedID"),
          },
        };
        isPaused = "completed";
      } else if ($("#startTime").val() != "" && $("#endTime").val() == "") {
        obj = {
          type: "TTimeLog",
          fields: {
            EmployeeID: Session.get("mySessionEmployeeLoggedID"),
            StartDatetime: startTime,
            EndDatetime: endTime,
            Product: product,
            Description: "Timesheet Started",
            EnteredBy: Session.get("mySessionEmployeeLoggedID"),
          },
        };
        isPaused = "";
      }

      data = {
        type: "TTimeSheetEntry",
        fields: {
          // "EntryDate":"2020-10-12 12:39:14",
          TimeSheet: [
            {
              type: "TTimeSheet",
              fields: {
                EmployeeName: employeeName || "",
                ServiceName: product || "",
                HourlyRate: productcost || 0,
                LabourCost: 1,
                Allowedit: true,
                Logs: obj,
                TimeSheetDate: date,
                StartTime: startTime,
                EndTime: endTime,
                Hours: hours || 0.016666666666666666,
                // OverheadRate: 90,
                Job: jobName || "",
                // ServiceName: "Test"|| '',
                TimeSheetClassName: "Default" || "",
                Notes: techNotes || "",
                InvoiceNotes: "Clocked On",
                // EntryDate: accountdesc|| ''
              },
            },
          ],
          TypeName: "Payroll",
          WhoEntered: Session.get("mySessionEmployee") || "",
        },
      };
      contactService
        .saveTimeSheet(data)
        .then(function (dataReturnRes) {
          $("#updateID").val(dataReturnRes.fields.ID);
          sideBarService.getAllTimeSheetList().then(function (data) {
            Bert.alert(
              $("#employee_name").val() + " you are now Clocked On",
              "now-success"
            );
            addVS1Data("TTimeSheet", JSON.stringify(data));
            $("#employeeStatusField").removeClass("statusOnHold");
            $("#employeeStatusField").removeClass("statusClockedOff");
            $("#employeeStatusField")
              .addClass("statusClockedOn")
              .text("Clocked On");
            Bert.alert(
              $("#employee_name").val() + " you are now Clocked On",
              "now-success"
            );
            $("#startTime").prop("disabled", true);
            templateObject.timesheetrecords.set([]);
            templateObject.getAllTimeSheetDataClock();
            $("#settingsModal").modal("hide");
            // setTimeout(function(){
            //    let getTimesheetRecords = templateObject.timesheetrecords.get();
            //     let getLatestTimesheet = getTimesheetRecords.filter(clkList => {
            //        return clkList.employee == employeeName;
            //    });
            //     $('#updateID').val(getLatestTimesheet[getLatestTimesheet.length - 1].id || '');
            $(".fullScreenSpin").css("display", "none");
            // },1500);
          });
        })
        .catch(function (err) {
          swal({
            title: "Oooops...",
            text: err,
            type: "error",
            showCancelButton: false,
            confirmButtonText: "Try Again",
          }).then((result) => {
            if (result.value) {
              // Meteor._reload.reload();
            } else if (result.dismiss === "cancel") {
            }
          });
          $(".fullScreenSpin").css("display", "none");
        });
    } else {
      data = {
        type: "TTimeSheet",
        fields: {
          ID: updateID,
          EmployeeName: employeeName || "",
          ServiceName: product || "",
          HourlyRate: productcost || 0,
          LabourCost: 1,
          Allowedit: true,
          Hours: hours || 0.016666666666666666,
          TimeSheetDate: date,
          StartTime: startTime,
          EndTime: endTime,
          // OverheadRate: 90,
          Job: jobName || "",
          // ServiceName: "Test"|| '',
          TimeSheetClassName: "Default" || "",
          Notes: techNotes || "",
          InvoiceNotes: isPaused,
          // EntryDate: accountdesc|| ''
        },
      };

      contactService
        .saveClockTimeSheet(data)
        .then(function (data) {
          if (Object.keys(obj).length > 0) {
            if (obj.fields.Description == "Timesheet Completed") {
              let endTime1 = endTime;
              if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                toUpdateID =
                  clockList[clockList.length - 1].timelog[
                    clockList[clockList.length - 1].timelog.length - 1
                  ].fields.ID;
              } else {
                toUpdateID = clockList[clockList.length - 1].timelog.fields.ID;
              }

              if (toUpdateID != "") {
                updateData = {
                  type: "TTimeLog",
                  fields: {
                    ID: toUpdateID,
                    EndDatetime: endTime1,
                  },
                };
              }
              contactService
                .saveTimeSheetLog(obj)
                .then(function (data) {
                  contactService
                    .saveTimeSheetLog(updateData)
                    .then(function (data) {
                      sideBarService
                        .getAllTimeSheetList()
                        .then(function (data) {
                          addVS1Data("TTimeSheet", JSON.stringify(data));
                          if (showTimesheetStatus == true) {
                            setTimeout(function () {
                              templateObject.checkAccessSaveRedirect();
                            }, 500);
                          } else {
                            setTimeout(function () {
                              window.open("/dashboard", "_self");
                            }, 500);
                          }
                        });
                    })
                    .catch(function (err) {});
                })
                .catch(function (err) {});
            } else if (obj.fields.Description == "Timesheet Started") {
              contactService
                .saveTimeSheetLog(obj)
                .then(function (data) {
                  sideBarService.getAllTimeSheetList().then(function (data) {
                    addVS1Data("TTimeSheet", JSON.stringify(data));
                    setTimeout(function () {
                      if (showTimesheetStatus == true) {
                        setTimeout(function () {
                          templateObject.checkAccessSaveRedirect();
                        }, 500);
                      } else {
                        setTimeout(function () {
                          window.open("/dashboard", "_self");
                        }, 500);
                      }
                    }, 500);
                  });
                })
                .catch(function (err) {});
            }
          } else {
            sideBarService.getAllTimeSheetList().then(function (data) {
              addVS1Data("TTimeSheet", JSON.stringify(data));
              if (showTimesheetStatus == true) {
                setTimeout(function () {
                  templateObject.checkAccessSaveRedirect();
                }, 500);
              } else {
                setTimeout(function () {
                  window.open("/dashboard", "_self");
                }, 500);
              }
            });
          }
        })
        .catch(function (err) {
          swal({
            title: "Oooops...",
            text: err,
            type: "error",
            showCancelButton: false,
            confirmButtonText: "Try Again",
          }).then((result) => {
            if (result.value) {
              // Meteor._reload.reload();
            } else if (result.dismiss === "cancel") {
            }
          });
          $(".fullScreenSpin").css("display", "none");
        });
    }
  },
  "click .processTimesheet": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let checkStatus = "";
    let checkStartTime = "";
    let checkEndTime = "";
    let TimeSheetHours = 0;
    let updateID = $("#updateID").val() || "";
    let contactService = new ContactService();
    var startTime = $("#startTime").val() || "";
    var endTime = $("#endTime").val() || "";
    var product = $("#product-list").val() || "";
    if (startTime == "" || endTime == "") {
      $(".fullScreenSpin").css("display", "none");
      swal({
        title: "Oooops...",
        text: "Please enter Start and End Time to process this TimeSheet",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Try Again",
      }).then((result) => {
        if (result.value) {
          // Meteor._reload.reload();
        } else if (result.dismiss === "cancel") {
        }
      });
      return false;
    }

    let clockList = templateObject.timesheetrecords.get();
    clockList = clockList.filter((clkList) => {
      return (
        clkList.employee == $("#employee_name").val() &&
        clkList.id == $("#updateID").val()
      );
    });

    if (clockList.length > 0) {
      if (Array.isArray(clockList[clockList.length - 1].timelog)) {
        checkStatus = clockList[clockList.length - 1].isPaused || "";
        TimeSheetHours: clockList[clockList.length - 1].hours || "";
        latestTimeLogId =
          clockList[clockList.length - 1].timelog[
            clockList[clockList.length - 1].timelog.length - 1
          ].fields.ID || "";
        checkStartTime =
          clockList[clockList.length - 1].timelog[0].fields.StartDatetime || "";
        checkEndTime =
          clockList[clockList.length - 1].timelog[
            clockList[clockList.length - 1].timelog.length - 1
          ].fields.EndDatetime || "";
      } else {
        checkStatus = clockList[clockList.length - 1].isPaused || "";
        TimeSheetHours: clockList[clockList.length - 1].hours || "";
        latestTimeLogId =
          clockList[clockList.length - 1].timelog.fields.ID || "";
        checkStartTime =
          clockList[clockList.length - 1].timelog.fields.StartDatetime || "";
        checkEndTime =
          clockList[clockList.length - 1].timelog.fields.EndDatetime || "";
      }
    }

    var employeeName = $(".employee_name").val();
    var startdateGet = new Date($("#dtSODate").datepicker("getDate"));
    let date =
      startdateGet.getFullYear() +
      "-" +
      ("0" + (startdateGet.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + startdateGet.getDate()).slice(-2);
    var edthour = $("#txtBookedHoursSpent").val() || 0.01;
    let hours = templateObject.timeToDecimal(edthour);
    var techNotes = $("#txtNotes").val() || "";
    var product = $("#product-list").val() || "";
    var jobName = $("#sltJob").val() || "";
    var status = "Processed";
    let isPaused = checkStatus;
    let toUpdate = {};
    let obj = {};
    let data = "";
    if (startTime != "") {
      startTime = date + " " + startTime;
    }

    if (endTime != "") {
      endTime = date + " " + endTime;
    }

    if (checkStartTime == "" && startTime == "") {
      $(".fullScreenSpin").css("display", "none");
      swal({
        title: "Oooops...",
        text: "You can't save this entry with no start time",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Try Again",
      }).then((result) => {
        if (result.value) {
          // Meteor._reload.reload();
        } else if (result.dismiss === "cancel") {
        }
      });
      return false;
    }

    if (updateID != "") {
      result = clockList.filter((Timesheet) => {
        return Timesheet.id == updateID;
      });

      if (result.length > 0) {
        if (result[0].timelog == null) {
          obj = {
            type: "TTimeLog",
            fields: {
              TimeSheetID: updateID,
              EmployeeID: Session.get("mySessionEmployeeLoggedID"),
              StartDatetime: startTime,
              EndDatetime: endTime,
              Product: product,
              Description: "Timesheet Processed",
              EnteredBy: Session.get("mySessionEmployeeLoggedID"),
            },
          };
          isPaused = "completed";
        } else if (
          $("#startTime").val() != "" &&
          $("#endTime").val() != "" &&
          checkStatus != "completed"
        ) {
          let startTime1 =
            startdateGet.getFullYear() +
            "-" +
            ("0" + (startdateGet.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + startdateGet.getDate()).slice(-2) +
            " " +
            ("0" + startdateGet.getHours()).slice(-2) +
            ":" +
            ("0" + startdateGet.getMinutes()).slice(-2);
          obj = {
            type: "TTimeLog",
            fields: {
              TimeSheetID: updateID,
              EmployeeID: Session.get("mySessionEmployeeLoggedID"),
              StartDatetime: checkStartTime,
              EndDatetime: endTime,
              Product: product,
              Description: "Timesheet Processed",
              EnteredBy: Session.get("mySessionEmployeeLoggedID"),
            },
          };
          isPaused = "completed";
        } else if (checkEndTime != "") {
          aEndDate = moment().format("YYYY-MM-DD") + " " + endTime;
        }
      } else {
        obj = {
          type: "TTimeLog",
          fields: {
            TimeSheetID: updateID,
            EmployeeID: Session.get("mySessionEmployeeLoggedID"),
            StartDatetime: startTime,
            EndDatetime: endTime,
            Product: product,
            Description: "Timesheet Processed",
            EnteredBy: Session.get("mySessionEmployeeLoggedID"),
          },
        };
        isPaused = "completed";
      }
    }
    if (updateID == "") {
      if ($("#tActualStartTime").val() != "") {
        obj = {
          type: "TTimeLog",
          fields: {
            EmployeeID: Session.get("mySessionEmployeeLoggedID"),
            StartDatetime: startTime,
            EndDatetime: endTime,
            Product: product,
            Description: "Timesheet Processed",
            EnteredBy: Session.get("mySessionEmployeeLoggedID"),
          },
        };
        isPaused = "completed";
      } else if (
        $("#tActualStartTime").val() != "" &&
        $("#tActualEndTime").val() != ""
      ) {
        obj = {
          type: "TTimeLog",
          fields: {
            EmployeeID: Session.get("mySessionEmployeeLoggedID"),
            StartDatetime: startTime,
            EndDatetime: endTime,
            Product: product,
            Description: "Timesheet Processed",
            EnteredBy: Session.get("mySessionEmployeeLoggedID"),
          },
        };

        isPaused = "completed";
      }
      data = {
        type: "TTimeSheetEntry",
        fields: {
          // "EntryDate":"2020-10-12 12:39:14",
          TimeSheet: [
            {
              type: "TTimeSheet",
              fields: {
                EmployeeName: employeeName || "",
                ServiceName: product || "",
                LabourCost: 1,
                Allowedit: true,
                Logs: obj,
                Hours: hours || 0.01,
                Status: status,
                // OverheadRate: 90,
                Job: jobName || "",
                // ServiceName: "Test"|| '',
                TimeSheetClassName: "Default" || "",
                Notes: techNotes || "",
                Status: status,
                InvoiceNotes: "completed",
                // EntryDate: accountdesc|| ''
              },
            },
          ],
          TypeName: "Payroll",
          WhoEntered: Session.get("mySessionEmployee") || "",
        },
      };
      contactService
        .saveTimeSheet(data)
        .then(function (data) {
          sideBarService.getAllTimeSheetList().then(function (data) {
            addVS1Data("TTimeSheet", JSON.stringify(data));
            if (showTimesheetStatus == true) {
              setTimeout(function () {
                templateObject.checkAccessSaveRedirect();
              }, 500);
            } else {
              setTimeout(function () {
                window.open("/dashboard", "_self");
              }, 500);
            }
          });
        })
        .catch(function (err) {
          swal({
            title: "Oooops...",
            text: err,
            type: "error",
            showCancelButton: false,
            confirmButtonText: "Try Again",
          }).then((result) => {
            if (result.value) {
              // Meteor._reload.reload();
            } else if (result.dismiss === "cancel") {
            }
          });
          $(".fullScreenSpin").css("display", "none");
        });
    } else {
      data = {
        type: "TTimeSheet",
        fields: {
          ID: updateID,
          EmployeeName: employeeName || "",
          ServiceName: product || "",
          LabourCost: 1,
          Allowedit: true,
          Hours: hours || 0.01,
          Status: status,
          // OverheadRate: 90,
          Job: jobName || "",
          // ServiceName: "Test"|| '',
          TimeSheetClassName: "Default" || "",
          Notes: techNotes || "",
          InvoiceNotes: "completed",
          // EntryDate: accountdesc|| ''
        },
      };

      contactService
        .saveClockTimeSheet(data)
        .then(function (data) {
          if (Object.keys(obj).length > 0) {
            if (obj.fields.Description == "Timesheet Processed") {
              let endTime1 = endTime;
              if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                toUpdateID =
                  clockList[clockList.length - 1].timelog[
                    clockList[clockList.length - 1].timelog.length - 1
                  ].fields.ID;
              } else {
                toUpdateID = clockList[clockList.length - 1].timelog.fields.ID;
              }

              if (toUpdateID != "") {
                updateData = {
                  type: "TTimeLog",
                  fields: {
                    ID: toUpdateID,
                    EndDatetime: endTime1,
                  },
                };
              }
              contactService
                .saveTimeSheetLog(obj)
                .then(function (data) {
                  contactService
                    .saveTimeSheetLog(updateData)
                    .then(function (data) {
                      sideBarService
                        .getAllTimeSheetList()
                        .then(function (data) {
                          addVS1Data("TTimeSheet", JSON.stringify(data));
                          if (showTimesheetStatus == true) {
                            setTimeout(function () {
                              templateObject.checkAccessSaveRedirect();
                            }, 500);
                          } else {
                            setTimeout(function () {
                              window.open("/dashboard", "_self");
                            }, 500);
                          }
                        });
                    })
                    .catch(function (err) {});
                })
                .catch(function (err) {});
            } else if (obj.fields.Description == "Timesheet Processed") {
              contactService
                .saveTimeSheetLog(obj)
                .then(function (data) {
                  sideBarService.getAllTimeSheetList().then(function (data) {
                    addVS1Data("TTimeSheet", JSON.stringify(data));
                    if (showTimesheetStatus == true) {
                      setTimeout(function () {
                        templateObject.checkAccessSaveRedirect();
                      }, 500);
                    } else {
                      setTimeout(function () {
                        window.open("/dashboard", "_self");
                      }, 500);
                    }
                  });
                })
                .catch(function (err) {});
            }
          } else {
            sideBarService.getAllTimeSheetList().then(function (data) {
              addVS1Data("TTimeSheet", JSON.stringify(data));
              if (showTimesheetStatus == true) {
                setTimeout(function () {
                  templateObject.checkAccessSaveRedirect();
                }, 500);
              } else {
                setTimeout(function () {
                  window.open("/dashboard", "_self");
                }, 500);
              }
            });
          }
        })
        .catch(function (err) {
          swal({
            title: "Oooops...",
            text: err,
            type: "error",
            showCancelButton: false,
            confirmButtonText: "Try Again",
          }).then((result) => {
            if (result.value) {
              // Meteor._reload.reload();
            } else if (result.dismiss === "cancel") {
            }
          });
          $(".fullScreenSpin").css("display", "none");
        });
    }
  },

  "click #btnPayRun": function (event) {
    $(".modal-backdrop").css("display", "none");
    FlowRouter.go("/payrun");
  },

  "click #btnSingleTouchPayroll": function (event) {
    $(".modal-backdrop").css("display", "none");
    FlowRouter.go("/singletouch");
  },

  "click .btnTimesheetList": function (event) {
    $(".modal-backdrop").css("display", "none");
    let id = $("#updateID").val();
    if (id) {
      FlowRouter.go("/timesheettimelog?id=" + id);
    } else {
      FlowRouter.go("/timesheettimelog");
    }
  },
  "click .btnAddVS1User": function (event) {
    swal({
      title: "Is this an existing Employee?",
      text: "",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) {
        swal("Please select the employee from the list below.", "", "info");
        $("#employeeListModal").modal("toggle");
        // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      } else if (result.dismiss === "cancel") {
        FlowRouter.go("/employeescard?addvs1user=true");
      }
    });
  },
  "click .btnDesktopSearch": function (e) {
    const templateObject = Template.instance();
    let contactService = new ContactService();
    let barcodeData = $("#barcodeScanInput").val();
    let empNo = barcodeData.replace(/^\D+/g, "");
    $(".fullScreenSpin").css("display", "inline-block");
    if (barcodeData === "") {
      swal("Please enter the employee number", "", "warning");
      $(".fullScreenSpin").css("display", "none");
      e.preventDefault();
      return false;
    } else {
      contactService
        .getOneEmployeeDataEx(empNo)
        .then(function (data) {
          $(".fullScreenSpin").css("display", "none");
          if (Object.keys(data).length > 0) {
            $("#employee_name").val(data.fields.EmployeeName || "");
            $("#barcodeScanInput").val("");
            $("#sltJob").val("");
            $("#product-list").val("");
            $("#edtProductCost").val(0);
            $("#updateID").val("");
            $("#startTime").val("");
            $("#endTime").val("");
            $("#txtBookedHoursSpent").val("");
            $("#startTime").prop("disabled", false);
            $("#endTime").prop("disabled", false);
            $("#btnClockOn").prop("disabled", false);
            $("#btnHold").prop("disabled", false);
            $("#btnClockOff").prop("disabled", false);
            var curretDate = moment().format("DD/MM/YYYY");
            setTimeout(function () {
              $("#dtSODate").val(curretDate);
            }, 100);
            if (data.fields.CustFld8 == "false") {
              templateObject.getAllSelectedProducts(data.fields.ID);
            } else {
              templateObject.getAllProductData();
            }

            let clockList = templateObject.timesheetrecords.get();
            clockList = clockList.filter((clkList) => {
              return clkList.employee == $("#employee_name").val();
            });

            if (clockList.length > 0) {
              if (clockList[clockList.length - 1].isPaused == "paused") {
                $(".btnHold").prop("disabled", true);
              } else {
                $(".btnHold").prop("disabled", false);
              }

              if (clockList[clockList.length - 1].isPaused == "paused") {
                $(".paused").show();
                $("#btnHold").prop("disabled", true);
                $("#btnHold").addClass("mt-32");
              } else {
                $(".paused").hide();
                $("#btnHold").prop("disabled", false);
                $("#btnHold").removeClass("mt-32");
              }

              if (
                Array.isArray(clockList[clockList.length - 1].timelog) &&
                clockList[clockList.length - 1].isPaused != "completed"
              ) {
                let startTime =
                  clockList[clockList.length - 1].timelog[0].fields
                    .StartDatetime || "";
                let date = clockList[clockList.length - 1].timesheetdate;
                if (startTime != "") {
                  $("#startTime").val(startTime.split(" ")[1]);
                  $("#dtSODate").val(date);
                  $("#txtBookedHoursSpent").val(
                    clockList[clockList.length - 1].hourFormat
                  );
                  $("#txtBookedHoursSpent1").val(
                    clockList[clockList.length - 1].hours
                  );
                  $("#updateID").val(clockList[clockList.length - 1].id);
                  $("#timesheetID").text(clockList[clockList.length - 1].id);
                  $("#txtNotes").val(clockList[clockList.length - 1].notes);
                  $("#sltJob").val(clockList[clockList.length - 1].job);
                  $("#product-list").val(
                    clockList[clockList.length - 1].product
                  );
                  $("#edtProductCost").val(
                    clockList[clockList.length - 1].hourlyrate.replace(
                      /[^0-9.-]+/g,
                      ""
                    )
                  );
                  //$('#product-list').prepend('<option>' + clockList[clockList.length - 1].product + '</option>');
                  //$("#product-list")[0].options[0].selected = true;
                  $("#hourly_rate").val(
                    clockList[clockList.length - 1].hourlyrate.replace(
                      /[^0-9.-]+/g,
                      ""
                    )
                  );
                  $("#startTime").prop("disabled", true);
                  if (clockList[clockList.length - 1].isPaused == "completed") {
                    $("#endTime").val(endTime);
                    $("#endTime").prop("disabled", true);
                    $("#btnClockOn").prop("disabled", true);
                    $("#btnHold").prop("disabled", true);
                    $("#btnClockOff").prop("disabled", true);
                  }
                }
              } else if (
                clockList[clockList.length - 1].isPaused != "completed"
              ) {
                if (
                  clockList[clockList.length - 1].timelog.fields.EndDatetime ==
                  ""
                ) {
                  let startTime =
                    clockList[
                      clockList.length - 1
                    ].timelog.fields.StartDatetime.split(" ")[1];
                  let date = clockList[clockList.length - 1].timesheetdate;
                  if (startTime != "") {
                    $("#startTime").val(startTime);
                    $("#dtSODate").val(date);
                    $("#txtBookedHoursSpent").val(
                      clockList[clockList.length - 1].hourFormat
                    );
                    $("#txtBookedHoursSpent1").val(
                      clockList[clockList.length - 1].hours
                    );
                    $("#updateID").val(clockList[clockList.length - 1].id);
                    $("#timesheetID").text(clockList[clockList.length - 1].id);
                    $("#txtNotes").val(clockList[clockList.length - 1].notes);
                    $("#sltJob").val(clockList[clockList.length - 1].job);
                    $("#product-list").val(
                      clockList[clockList.length - 1].product
                    );
                    $("#edtProductCost").val(
                      clockList[clockList.length - 1].hourlyrate.replace(
                        /[^0-9.-]+/g,
                        ""
                      )
                    );
                    //$('#product-list').prepend('<option>' + clockList[clockList.length - 1].product + '</option>');
                    //$("#product-list")[0].options[0].selected = true;
                    $("#hourly_rate").val(
                      clockList[clockList.length - 1].hourlyrate.replace(
                        /[^0-9.-]+/g,
                        ""
                      )
                    );
                    $("#startTime").prop("disabled", true);
                    if (
                      clockList[clockList.length - 1].isPaused == "completed"
                    ) {
                      $("#endTime").val(endTime);
                      $("#endTime").prop("disabled", true);
                      $("#btnClockOn").prop("disabled", true);
                      $("#btnHold").prop("disabled", true);
                      $("#btnClockOff").prop("disabled", true);
                    }
                  }
                }
              }
            } else {
              $(".paused").hide();
              $("#btnHold").prop("disabled", false);
            }
          } else {
            swal("Employee Not Found", "", "warning");
          }
        })
        .catch(function (err) {
          swal({
            title: "Oooops...",
            text: "Employee Not Found",
            type: "error",
            showCancelButton: false,
            confirmButtonText: "Try Again",
          }).then((result) => {
            if (result.value) {
              // Meteor._reload.reload();
            } else if (result.dismiss === "cancel") {
            }
          });
          $(".fullScreenSpin").css("display", "none");
        });
    }
  },
  "click .chkDatatable": function (event) {
    var columns = $("#tblPayHistorylist th");
    let columnDataValue = $(event.target)
      .closest("div")
      .find(".divcolumn")
      .text();

    $.each(columns, function (i, v) {
      let className = v.classList;
      let replaceClass = className[1];

      if (v.innerText == columnDataValue) {
        if ($(event.target).is(":checked")) {
          $("." + replaceClass + "").css("display", "table-cell");
          $("." + replaceClass + "").css("padding", ".75rem");
          $("." + replaceClass + "").css("vertical-align", "top");
        } else {
          $("." + replaceClass + "").css("display", "none");
        }
      }
    });
  },
  "click .resetTable": function (event) {
    var getcurrentCloudDetails = CloudUser.findOne({
      _id: Session.get("mycloudLogonID"),
      clouddatabaseID: Session.get("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: "tblPayHistorylist",
        });
        if (checkPrefDetails) {
          CloudPreference.remove(
            {
              _id: checkPrefDetails._id,
            },
            function (err, idTag) {
              if (err) {
              } else {
                Meteor._reload.reload();
              }
            }
          );
        }
      }
    }
  },
  "click .saveTable": function (event) {
    let lineItems = [];
    $("#myModal2").modal("toggle");
  },
  "blur .divcolumn": function (event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target)
      .closest("div.columnSettings")
      .attr("id");
    var datable = $("#tblPayHistorylist").DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  "change .rngRange": function (event) {
    let range = $(event.target).val();
    $(event.target)
      .closest("div.divColWidth")
      .find(".spWidth")
      .html(range + "px");

    let columData = $(event.target)
      .closest("div.divColWidth")
      .find(".spWidth")
      .attr("value");
    let columnDataValue = $(event.target)
      .closest("div")
      .prev()
      .find(".divcolumn")
      .text();
    var datable = $("#tblPayHistorylist th");
    $.each(datable, function (i, v) {
      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css("width", range + "px");
      }
    });
  },
  "click .btnOpenSettings": function (event) {
    let templateObject = Template.instance();
    var columns = $("#tblPayHistorylist th");

    const tableHeaderList = [];
    let sTible = "";
    let sWidth = "";
    let sIndex = "";
    let sVisible = "";
    let columVisible = false;
    let sClass = "";
    $.each(columns, function (i, v) {
      if (v.hidden == false) {
        columVisible = true;
      }
      if (v.className.includes("hiddenColumn")) {
        columVisible = false;
      }
      sWidth = v.style.width.replace("px", "");
      let datatablerecordObj = {
        sTitle: v.innerText || "",
        sWidth: sWidth || "",
        sIndex: v.cellIndex || "",
        sVisible: columVisible || false,
        sClass: v.className || "",
      };
      tableHeaderList.push(datatablerecordObj);
    });
    templateObject.tableheaderrecords.set(tableHeaderList);
  },
  "click #btnHold": function (event) {
    $("#frmOnHoldModal").modal("show");
  },
  "click .btnPauseJob": function (event) {
    templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    let contactService = new ContactService();
    let checkStatus = "";
    let checkStartTime = "";
    let checkEndTime = "";
    let updateID = $("#updateID").val() || "";
    let notes = $("#txtpause-notes").val() || "";
    let latestTimeLogId = "";
    let type = "Break";
    if ($("#break").is(":checked")) {
      type = $("#break").val();
    } else if ($("#lunch").is(":checked")) {
      type = $("#lunch").val();
    } else if ($("#purchase").is(":checked")) {
      type = $("#purchase").val();
    } else {
      swal({
        title: "Please Select Option",
        text: "Please select Break, Lunch or Purchase Option",
        type: "info",
        showCancelButton: false,
        confirmButtonText: "Try Again",
      }).then((results) => {
        if (results.value) {
        } else if (results.dismiss === "cancel") {
        }
      });
      $(".fullScreenSpin").css("display", "none");
      return false;
    }

    if (updateID == "") {
      swal({
        title: "Oooops...",
        text: "Please save this entry before Pausing it",
        type: "info",
        showCancelButton: false,
        confirmButtonText: "Try Again",
      }).then((results) => {
        if (results.value) {
        } else if (results.dismiss === "cancel") {
        }
      });
      $(".fullScreenSpin").css("display", "none");
      return false;
    }

    let clockList = templateObject.timesheetrecords.get();
    clockList = clockList.filter((clkList) => {
      return (
        clkList.employee == $("#employee_name").val() &&
        clkList.id == $("#updateID").val()
      );
    });
    if (clockList.length > 0) {
      if (Array.isArray(clockList[clockList.length - 1].timelog)) {
        checkStatus = clockList[clockList.length - 1].isPaused || "";
        latestTimeLogId =
          clockList[clockList.length - 1].timelog[
            clockList[clockList.length - 1].timelog.length - 1
          ].fields.ID || "";
        checkStartTime =
          clockList[clockList.length - 1].timelog[
            clockList[clockList.length - 1].timelog.length - 1
          ].fields.StartDatetime || "";
        checkEndTime =
          clockList[clockList.length - 1].timelog[
            clockList[clockList.length - 1].timelog.length - 1
          ].fields.EndDatetime || "";
      } else {
        checkStatus = clockList[clockList.length - 1].isPaused || "";
        latestTimeLogId =
          clockList[clockList.length - 1].timelog.fields.ID || "";
        checkStartTime =
          clockList[clockList.length - 1].timelog.fields.StartDatetime || "";
        checkEndTime =
          clockList[clockList.length - 1].timelog.fields.EndDatetime || "";
      }
    }

    var employeeName = $(".employee_name").val();
    var startdateGet = new Date();
    let date =
      startdateGet.getFullYear() +
      "-" +
      ("0" + (startdateGet.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + startdateGet.getDate()).slice(-2);
    var startTime =
      ("0" + startdateGet.getHours()).slice(-2) +
      ":" +
      ("0" + startdateGet.getMinutes()).slice(-2);
    var endTime =
      ("0" + startdateGet.getHours()).slice(-2) +
      ":" +
      ("0" + startdateGet.getMinutes()).slice(-2);
    let toUpdate = {};
    let data = "";
    if (startTime != "") {
      startTime = date + " " + startTime;
    }

    // if (checkStatus == "paused") {
    //     swal({
    //         title: 'Oooops...',
    //         text: 'You cant Pause entry that has been completed',
    //         type: 'info',
    //         showCancelButton: false,
    //         confirmButtonText: 'Try Again'
    //     }).then((results) => {
    //         if (results.value) {}
    //         else if (results.dismiss === 'cancel') {}
    //     });
    //     $('.fullScreenSpin').css('display', 'none');
    //     return false;
    // }

    toUpdate = {
      type: "TTimeLog",
      fields: {
        ID: latestTimeLogId,
        EndDatetime: date + " " + endTime,
      },
    };

    data = {
      type: "TTimeLog",
      fields: {
        TimeSheetID: updateID,
        Description: type + ": " + notes || "",
        EmployeeName: employeeName,
        StartDatetime: startTime,
      },
    };

    contactService
      .saveTimeSheetLog(data)
      .then(function (savedData) {
        let updateTimeSheet = {
          type: "TTimeSheet",
          fields: {
            ID: updateID,
            InvoiceNotes: "paused",
            EmployeeName: employeeName,
          },
        };
        contactService
          .saveClockTimeSheet(updateTimeSheet)
          .then(function (savedTimesheetData) {
            contactService
              .saveTimeSheetLog(toUpdate)
              .then(function (data) {
                sideBarService.getAllTimeSheetList().then(function (data) {
                  addVS1Data("TTimeSheet", JSON.stringify(data));
                  setTimeout(function () {
                    templateObject.checkAccessSaveRedirect();
                  }, 500);
                });
              })
              .catch(function (err) {
                swal({
                  title: "Oooops...",
                  text: err,
                  type: "error",
                  showCancelButton: false,
                  confirmButtonText: "Try Again",
                }).then((result) => {
                  if (result.value) {
                    // Meteor._reload.reload();
                  } else if (result.dismiss === "cancel") {
                  }
                });
                $(".fullScreenSpin").css("display", "none");
              });
          })
          .catch(function (err) {
            swal({
              title: "Oooops...",
              text: err,
              type: "error",
              showCancelButton: false,
              confirmButtonText: "Try Again",
            }).then((result) => {
              if (result.value) {
                // Meteor._reload.reload();
              } else if (result.dismiss === "cancel") {
              }
            });
            $(".fullScreenSpin").css("display", "none");
          });

        // contactService.saveClockonClockOff(toUpdate).then(function (data) {
        //     FlowRouter.go('/employeetimeclock');
        // })
      })
      .catch(function (err) {
        swal({
          title: "Oooops...",
          text: err,
          type: "error",
          showCancelButton: false,
          confirmButtonText: "Try Again",
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === "cancel") {
          }
        });
        $(".fullScreenSpin").css("display", "none");
      });
  },
  "change #lunch": function (event) {
    $("#break").prop("checked", false);
    $("#purchase").prop("checked", false);
  },
  "change #break": function (event) {
    $("#lunch").prop("checked", false);
    $("#purchase").prop("checked", false);
  },
  "change #purchase": function (event) {
    $("#break").prop("checked", false);
    $("#lunch").prop("checked", false);
  },
  "click .btnDeleteTimeSheet": function () {
    let templateObject = Template.instance();
    let contactService = new ContactService();

    swal({
      title: "Delete TimeSheet",
      text: "Are you sure you want to Delete this TimeSheet?",
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {
        $(".fullScreenSpin").css("display", "inline-block");
        let timesheetID = $("#updateID").val();
        if (timesheetID == "") {
          //window.open('/timesheet', '_self');
          $(".fullScreenSpin").css("display", "none");
        } else {
          data = {
            type: "TTimeSheet",
            fields: {
              ID: timesheetID,
              Active: false,
            },
          };

          contactService
            .saveTimeSheetUpdate(data)
            .then(function (data) {
              sideBarService.getAllTimeSheetList().then(function (data) {
                addVS1Data("TTimeSheet", JSON.stringify(data));
                setTimeout(function () {
                  templateObject.checkAccessSaveRedirect();
                }, 500);
              });
            })
            .catch(function (err) {
              swal({
                title: "Oooops...",
                text: err,
                type: "error",
                showCancelButton: false,
                confirmButtonText: "Try Again",
              }).then((result) => {
                if (result.value) {
                  //Meteor._reload.reload();
                } else if (result.dismiss === "cancel") {
                }
              });
              $(".fullScreenSpin").css("display", "none");
            });
        }
      } else {
        $(".fullScreenSpin").css("display", "none");
      }
    });
  },
  "click .exportbtn": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblPayHistorylist_wrapper .dt-buttons .btntabletocsv").click();
    $(".fullScreenSpin").css("display", "none");
  },
  "click .exportbtnExcel": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblPayHistorylist_wrapper .dt-buttons .btntabletoexcel").click();
    $(".fullScreenSpin").css("display", "none");
  },
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    sideBarService
      .getAllAppointmentPredList()
      .then(function (data) {
        addVS1Data("TAppointmentPreferences", JSON.stringify(data))
          .then(function (datareturn) {})
          .catch(function (err) {});
      })
      .catch(function (err) {});
    sideBarService
      .getAllPayHistoryDataVS1(initialBaseDataLoad, 0)
      .then(function (data) {
        addVS1Data("TPayHistory", JSON.stringify(data))
          .then(function (datareturn) {
            //window.open('/payrolloverview', '_self');
          })
          .catch(function (err) {
            //window.open('/payrolloverview', '_self');
          });
      })
      .catch(function (err) {
        //window.open('/payrolloverview', '_self');
      });

    sideBarService
      .getAllEmployees(initialBaseDataLoad, 0)
      .then(function (data) {
        addVS1Data("TEmployee", JSON.stringify(data))
          .then(function (datareturn) {})
          .catch(function (err) {});
      })
      .catch(function (err) {
        //window.open('/payrolloverview', '_self');
      });

    sideBarService
      .getAllTimeSheetList()
      .then(function (data) {
        addVS1Data("TTimeSheet", JSON.stringify(data));
        setTimeout(function () {
          window.open("/payrolloverview", "_self");
        }, 500);
      })
      .catch(function (err) {
        $(".fullScreenSpin").css("display", "none");
        swal({
          title: "Oooops...",
          text: err,
          type: "error",
          showCancelButton: false,
          confirmButtonText: "Try Again",
        }).then((result) => {
          if (result.value) {
            // Meteor._reload.reload();
          } else if (result.dismiss === "cancel") {
          }
        });
      });
  },
  "click .printConfirm": function (event) {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblPayHistorylist_wrapper .dt-buttons .btntabletopdf").click();
    $(".fullScreenSpin").css("display", "none");
  },
  "click .templateDownload": function () {
    let utilityService = new UtilityService();
    let rows = [];
    const filename = "SampleEmployee" + ".csv";
    rows[0] = [
      "First Name",
      "Last Name",
      "Phone",
      "Mobile",
      "Email",
      "Skype",
      "Street",
      "City/Suburb",
      "State",
      "Post Code",
      "Country",
      "Gender",
    ];
    rows[1] = [
      "John",
      "Smith",
      "9995551213",
      "9995551213",
      "johnsmith@email.com",
      "johnsmith",
      "123 Main Street",
      "Brooklyn",
      "New York",
      "1234",
      "United States",
      "M",
    ];
    rows[1] = [
      "Jane",
      "Smith",
      "9995551213",
      "9995551213",
      "janesmith@email.com",
      "janesmith",
      "123 Main Street",
      "Brooklyn",
      "New York",
      "1234",
      "United States",
      "F",
    ];
    utilityService.exportToCsv(rows, filename, "csv");
  },
  "click .templateDownloadXLSX": function (e) {
    e.preventDefault(); //stop the browser from following
    window.location.href = "sample_imports/SampleEmployee.xlsx";
  },
  "click .btnUploadFile": function (event) {
    $("#attachment-upload").val("");
    $(".file-name").text("");
    //$(".btnImport").removeAttr("disabled");
    $("#attachment-upload").trigger("click");
  },
  "change #attachment-upload": function (e) {
    let templateObj = Template.instance();
    var filename = $("#attachment-upload")[0].files[0]["name"];
    var fileExtension = filename.split(".").pop().toLowerCase();
    var validExtensions = ["csv", "txt", "xlsx"];
    var validCSVExtensions = ["csv", "txt"];
    var validExcelExtensions = ["xlsx", "xls"];

    if (validExtensions.indexOf(fileExtension) == -1) {
      swal(
        "Invalid Format",
        "formats allowed are :" + validExtensions.join(", "),
        "error"
      );
      $(".file-name").text("");
      $(".btnImport").Attr("disabled");
    } else if (validCSVExtensions.indexOf(fileExtension) != -1) {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      templateObj.selectedFile.set(selectedFile);
      if ($(".file-name").text() != "") {
        $(".btnImport").removeAttr("disabled");
      } else {
        $(".btnImport").Attr("disabled");
      }
    } else if (fileExtension == "xlsx") {
      $(".file-name").text(filename);
      let selectedFile = event.target.files[0];
      var oFileIn;
      var oFile = selectedFile;
      var sFilename = oFile.name;
      // Create A File Reader HTML5
      var reader = new FileReader();

      // Ready The Event For When A File Gets Selected
      reader.onload = function (e) {
        var data = e.target.result;
        data = new Uint8Array(data);
        var workbook = XLSX.read(data, {
          type: "array",
        });

        var result = {};
        workbook.SheetNames.forEach(function (sheetName) {
          var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
          });
          var sCSV = XLSX.utils.make_csv(workbook.Sheets[sheetName]);
          templateObj.selectedFile.set(sCSV);

          if (roa.length) result[sheetName] = roa;
        });
        // see the result, caution: it works after reader event is done.
      };
      reader.readAsArrayBuffer(oFile);

      if ($(".file-name").text() != "") {
        $(".btnImport").removeAttr("disabled");
      } else {
        $(".btnImport").Attr("disabled");
      }
    }
  },
  "click .btnImport": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    let contactService = new ContactService();
    let objDetails;
    var saledateTime = new Date();
    //let empStartDate = new Date().format("YYYY-MM-DD");
    var empStartDate = moment(saledateTime).format("YYYY-MM-DD");
    Papa.parse(templateObject.selectedFile.get(), {
      complete: function (results) {
        if (results.data.length > 0) {
          if (
            results.data[0][0] == "First Name" &&
            results.data[0][1] == "Last Name" &&
            results.data[0][2] == "Phone" &&
            results.data[0][3] == "Mobile" &&
            results.data[0][4] == "Email" &&
            results.data[0][5] == "Skype" &&
            results.data[0][6] == "Street" &&
            (results.data[0][7] == "Street2" ||
              results.data[0][7] == "City/Suburb") &&
            results.data[0][8] == "State" &&
            results.data[0][9] == "Post Code" &&
            results.data[0][10] == "Country" &&
            results.data[0][11] == "Gender"
          ) {
            let dataLength = results.data.length * 500;
            setTimeout(function () {
              // $('#importModal').modal('toggle');
              //Meteor._reload.reload();
              window.open("/employeelist?success=true", "_self");
            }, parseInt(dataLength));

            for (let i = 0; i < results.data.length - 1; i++) {
              objDetails = {
                type: "TEmployee",
                fields: {
                  FirstName: results.data[i + 1][0],
                  LastName: results.data[i + 1][1],
                  Phone: results.data[i + 1][2],
                  Mobile: results.data[i + 1][3],
                  DateStarted: empStartDate,
                  DOB: empStartDate,
                  Sex: results.data[i + 1][11] || "F",
                  Email: results.data[i + 1][4],
                  SkypeName: results.data[i + 1][5],
                  Street: results.data[i + 1][6],
                  Street2: results.data[i + 1][7],
                  Suburb: results.data[i + 1][7],
                  State: results.data[i + 1][8],
                  PostCode: results.data[i + 1][9],
                  Country: results.data[i + 1][10],

                  // BillStreet: results.data[i+1][6],
                  // BillStreet2: results.data[i+1][7],
                  // BillState: results.data[i+1][8],
                  // BillPostCode:results.data[i+1][9],
                  // Billcountry:results.data[i+1][10]
                },
              };
              if (results.data[i + 1][1]) {
                if (results.data[i + 1][1] !== "") {
                  contactService
                    .saveEmployee(objDetails)
                    .then(function (data) {
                      ///$('.fullScreenSpin').css('display','none');
                      //Meteor._reload.reload();
                    })
                    .catch(function (err) {
                      //$('.fullScreenSpin').css('display','none');
                      swal({
                        title: "Oooops...",
                        text: err,
                        type: "error",
                        showCancelButton: false,
                        confirmButtonText: "Try Again",
                      }).then((result) => {
                        if (result.value) {
                          Meteor._reload.reload();
                        } else if (result.dismiss === "cancel") {
                        }
                      });
                    });
                }
              }
            }
          } else {
            $(".fullScreenSpin").css("display", "none");
            swal(
              "Invalid Data Mapping fields ",
              "Please check that you are importing the correct file with the correct column headers.",
              "error"
            );
          }
        } else {
          $(".fullScreenSpin").css("display", "none");
          swal(
            "Invalid Data Mapping fields ",
            "Please check that you are importing the correct file with the correct column headers.",
            "error"
          );
        }
      },
    });
  },
  "mouseover .card-header": (e) => {
    $(e.currentTarget).parent(".card").addClass("hovered");
  },
  "mouseleave .card-header": (e) => {
    $(e.currentTarget).parent(".card").removeClass("hovered");
  },
});

Template.payrolloverview.helpers({
  jobsrecords: () => {
    return Template.instance()
      .jobsrecords.get()
      .sort(function (a, b) {
        if (a.jobname == "NA") {
          return 1;
        } else if (b.jobname == "NA") {
          return -1;
        }
        return a.jobname.toUpperCase() > b.jobname.toUpperCase() ? 1 : -1;
      });
  },
  includePayrollClockOnOffOnly: () => {
    return Template.instance().includePayrollClockOnOffOnly.get();
  },
  datatablerecords: () => {
    return Template.instance()
      .datatablerecords.get()
      .sort(function (a, b) {
        if (a.employeename == "NA") {
          return 1;
        } else if (b.employeename == "NA") {
          return -1;
        }
        return a.employeename.toUpperCase() > b.employeename.toUpperCase()
          ? 1
          : -1;
      });
  },
  loggeduserdata: () => {
    return Template.instance()
      .loggeduserdata.get()
      .sort(function (a, b) {
        if (a.employeename == "NA") {
          return 1;
        } else if (b.employeename == "NA") {
          return -1;
        }
        return a.employeename.toUpperCase() > b.employeename.toUpperCase()
          ? 1
          : -1;
      });
  },
  clockedOnEmpData: () => {
    return Template.instance()
      .clockedOnEmpData.get()
      .sort(function (a, b) {
        if (a.employeename == "NA") {
          return 1;
        } else if (b.employeename == "NA") {
          return -1;
        }
        return a.employeename.toUpperCase() > b.employeename.toUpperCase()
          ? 1
          : -1;
      });
  },
  datatablerecords1: () => {
    return Template.instance()
      .datatablerecords1.get()
      .sort(function (a, b) {
        if (a.productname == "NA") {
          return 1;
        } else if (b.productname == "NA") {
          return -1;
        }
        return a.productname.toUpperCase() > b.productname.toUpperCase()
          ? 1
          : -1;
      });
  },
  edithours: () => {
    return Session.get("CloudEditTimesheetHours") || false;
  },
  clockOnOff: () => {
    return Session.get("CloudClockOnOff") || false;
  },
  launchClockOnOff: () => {
    return Session.get("launchClockOnOff") || false;
  },
  timesheetStartStop: () => {
    return Session.get("timesheetStartStop ") || false;
  },
  showTimesheet: () => {
    return Session.get("CloudShowTimesheet") || false;
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: Session.get("mycloudLogonID"),
      PrefName: "tblPayHistorylist",
    });
  },
  loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
  },
});
