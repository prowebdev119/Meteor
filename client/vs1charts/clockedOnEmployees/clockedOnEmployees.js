import { ReactiveVar } from "meteor/reactive-var";
import { SideBarService } from "../../js/sidebar-service";
import { UtilityService } from "../../utility-service";

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let _ = require("lodash");

Template.clockedOnEmployees.onCreated(function () {
  let templateObject = Template.instance();
  templateObject.clockedOnEmpData = new ReactiveVar([]);

});

Template.clockedOnEmployees.onRendered(function () {
  const templateObject = Template.instance();

  templateObject.getAllTimeSheetDataClock = function () {
    getVS1Data("TTimeSheet")
      .then(function (dataObject) {
        if (dataObject == 0) {
          sideBarService
            .getAllTimeSheetList()
            .then(function (data) {
              /* Update Clocked On Employees */
              let clockedOnEmpList = []
              let dataListClockedOnEmployeeObj = {};
              for (let t = 0; t < data.ttimesheet.length; t++) {
                if (data.ttimesheet[t].fields.Logs != null) {
                  if (
                    data.ttimesheet[t].fields.InvoiceNotes == "Clocked On" ||
                    data.ttimesheet[t].fields.InvoiceNotes == "paused"
                  ) {
                    dataListClockedOnEmployeeObj = {
                      employeename:
                        data.ttimesheet[t].fields.EmployeeName || "",
                    };
                    clockedOnEmpList.push(dataListClockedOnEmployeeObj);
                  }
                }
              }
              templateObject.clockedOnEmpData.set(clockedOnEmpList);
              // $(".fullScreenSpin").css("display", "none");
            })
            .catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $(".fullScreenSpin").css("display", "none");
              // Meteor._reload.reload();
            });
        } else {
          let clockedOnEmpList = []
          let data = JSON.parse(dataObject[0].data);
          /* Update Clocked On Employees */
          let dataListClockedOnEmployeeObj = {};
          for (let t = 0; t < data.ttimesheet.length; t++) {
            if (data.ttimesheet[t].fields.Logs != null) {
              if ( data.ttimesheet[t].fields.InvoiceNotes == "Clocked On" || data.ttimesheet[t].fields.InvoiceNotes == "paused") {
                dataListClockedOnEmployeeObj = {
                  employeename: data.ttimesheet[t].fields.EmployeeName || "",
                };
                clockedOnEmpList.push(dataListClockedOnEmployeeObj);
              }
            }
          }
          templateObject.clockedOnEmpData.set(clockedOnEmpList);
          // let url = window.location.href;
          // $(".fullScreenSpin").css("display", "none");
        }
      })
      .catch(function (err) {
        sideBarService
          .getAllTimeSheetList()
          .then(function (data) {
            /* Update Clocked On Employees */
            let clockedOnEmpList = []
            let dataListClockedOnEmployeeObj = {};
            for (let t = 0; t < data.ttimesheet.length; t++) {
              if (data.ttimesheet[t].fields.Logs != null) {
                if (
                  data.ttimesheet[t].fields.InvoiceNotes == "Clocked On" ||
                  data.ttimesheet[t].fields.InvoiceNotes == "paused"
                ) {
                  dataListClockedOnEmployeeObj = {
                    employeename: data.ttimesheet[t].fields.EmployeeName || "",
                  };
                  clockedOnEmpList.push(dataListClockedOnEmployeeObj);
                }
              }
            }
            templateObject.clockedOnEmpData.set(clockedOnEmpList);
            // $(".fullScreenSpin").css("display", "none");
          })
          .catch(function (err) {
            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $(".fullScreenSpin").css("display", "none");
            // Meteor._reload.reload();
          });
      });
  };

  templateObject.getAllTimeSheetDataClock();
});


Template.clockedOnEmployees.helpers({
    includePayrollClockOnOffOnly: () => {
      return Template.instance().includePayrollClockOnOffOnly.get();
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
  