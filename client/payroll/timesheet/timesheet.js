import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {UtilityService} from "../../utility-service";
import {ContactService} from "../../contacts/contact-service";
import { ProductService } from "../../product/product-service";
import { SideBarService } from '../../js/sidebar-service';
import 'jquery-editable-select';
let utilityService = new UtilityService();
let sideBarService = new SideBarService();
Template.timesheet.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords1 = new ReactiveVar([]);
    templateObject.productsdatatablerecords = new ReactiveVar([]);
    templateObject.employeerecords = new ReactiveVar([]);
    templateObject.jobsrecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.selectedTimesheet = new ReactiveVar([]);
    templateObject.timesheetrecords = new ReactiveVar([]);
    templateObject.selectedTimesheetID = new ReactiveVar();
    templateObject.selectedFile = new ReactiveVar();

    templateObject.includeAllProducts = new ReactiveVar();
    templateObject.includeAllProducts.set(true);

    templateObject.useProductCostaspayRate = new ReactiveVar();
    templateObject.useProductCostaspayRate.set(false);

    templateObject.allnoninvproducts = new ReactiveVar([]);

});

Template.timesheet.onRendered(function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let contactService = new ContactService();
    let productService = new ProductService();
    const employeeList = [];
    const jobsList = [];
    const timesheetList = [];
    const timeSheetList = [];
    const dataTableList = [];
    const tableHeaderList = [];

    var splashArrayTimeSheetList = new Array();

    let seeOwnTimesheets = Session.get('CloudTimesheetSeeOwnTimesheets') || false;
    let launchClockOnOff = Session.get('CloudTimesheetLaunch') || false;
    let canClockOnClockOff = Session.get('CloudClockOnOff') || false;
    let createTimesheet = Session.get('CloudCreateTimesheet') || false;
    let timesheetStartStop = Session.get('CloudTimesheetStartStop') || false;
    let showTimesheetEntry = Session.get('CloudTimesheetEntry') || false;
    let showTimesheet = Session.get('CloudShowTimesheet') || false;
    if (launchClockOnOff == true && canClockOnClockOff == true) {
        setTimeout(function () {
            $("#btnClockOnOff").trigger("click");
        }, 500);
    }

    if (createTimesheet == false) {
        setTimeout(function () {
            $(".btnSaveTimeSheetForm").prop("disabled", true);
        }, 500);
    }
    //var today = moment().format('DD/MM/YYYY');
    // var currentDate = new Date();
    // var begunDate = moment(currentDate).format("DD/MM/YYYY");
    // let fromDateMonth = (currentDate.getMonth() + 1);
    // let fromDateDay = currentDate.getDate();
    // if ((currentDate.getMonth()+1) < 10) {
    //     fromDateMonth = "0" + (currentDate.getMonth()+1);
    // }
    //
    // if (currentDate.getDate() < 10) {
    //     fromDateDay = "0" + currentDate.getDate();
    // }
    // var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();


    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentBeginDate.getMonth() + 1);
    let fromDateDay = currentBeginDate.getDate();
    if((currentBeginDate.getMonth()+1) < 10){
        fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
    }else{
      fromDateMonth = (currentBeginDate.getMonth()+1);
    }

    if(currentBeginDate.getDate() < 10){
        fromDateDay = "0" + currentBeginDate.getDate();
    }

    var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();

    let prevMonthToDate = (moment().subtract(reportsloadMonths, 'months')).format("DD/MM/YYYY");

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTimeSheet', function (error, result) {
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

                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });

    function MakeNegative() {
        $('td').each(function () {
            if ($(this).text().indexOf('-' + Currency) >= 0)
                $(this).addClass('text-danger')
        });
    };
    // templateObject.dateAsAt.set(begunDate);

    $("#date-input,#dateTo,#dtSODate,#dateFrom").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        dateFormat: 'dd/mm/yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
    });

    $("#employee_name").val(Session.get('mySessionEmployee'));

    $("#dateFrom").val(prevMonthToDate);
    $("#dateTo").val(begunDate);
    $("#dtSODate").val(begunDate);

    templateObject.diff_hours = function (dt2, dt1) {
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);
        return Math.abs(diff);
    }

    templateObject.dateFormat = function (date) {
        var dateParts = date.split("/");
        var dateObject = dateParts[2] + '/' + ('0' + (dateParts[1] - 1)).toString().slice(-2) + '/' + dateParts[0];
        return dateObject;
    }

    templateObject.endTimePopUp = function () {
        swal({
            title: 'Please Note!',
            text: 'By mannualy populating the Timesheet End Time, this will Clock you off when saving, Do you want to continue?',
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {}
            else {
                $("#endTime").val("");
                $("#txtBookedHoursSpent").val("00:00");
            }

        });
    }

    templateObject.timeToDecimal = function (time) {
        var hoursMinutes = time.split(/[.:]/);
        var hours = parseInt(hoursMinutes[0], 10);
        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return hours + minutes / 60;
    }

   templateObject.timeFormat = function (hours) {
        var decimalTime = parseFloat(hours).toFixed(2);
        decimalTime = decimalTime * 60 * 60;
        var hours = Math.floor((decimalTime / (60 * 60)));
        decimalTime = decimalTime - (hours * 60 * 60);
        var minutes = Math.abs(decimalTime / 60);
        decimalTime = decimalTime - (minutes * 60);
        hours = ("0" + hours).slice(-2);
        minutes = ("0" + Math.round(minutes)).slice(-2);
        let time = hours + ":" + minutes;
        return time;
    }

    function checkStockColor() {
        $('td.colStatus').each(function() {
            if ($(this).text() == "Processed") {
                $(this).addClass('isProcessedColumn');
            } else if ($(this).text() == "Unprocessed") {
                $(this).addClass('isUnprocessedColumn');
            }

        });
    };

    templateObject.getAllTimeSheetData = function (fromDate,toDate, ignoreDate) {
      $('.fullScreenSpin').css('display', 'inline-block');
      if(ignoreDate == true){
        $('#dateFrom').attr('readonly', true);
        $('#dateTo').attr('readonly', true);
      }else{

        $("#dateFrom").val(fromDate !=''? moment(fromDate).format("DD/MM/YYYY"): fromDate);
        $("#dateTo").val(toDate !=''? moment(toDate).format("DD/MM/YYYY"): toDate);
      }

        getVS1Data('TTimeSheet').then(function (dataObject) {
            if (dataObject == 0) {
              sideBarService.getAllTimeSheetList().then(function (data) {
                  addVS1Data('TTimeSheet', JSON.stringify(data));
                  $('.fullScreenSpin').css('display', 'none');
                  let lineItems = [];
                  let lineItemObj = {};

                  let sumTotalCharge = 0;
                  let sumSumHour = 0;
                  let sumSumHourlyRate = 0;
                  for (let t = 0; t < data.ttimesheet.length; t++) {
                      let hourlyRate = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.HourlyRate) || Currency+0.00;
                      let labourCost = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.LabourCost) || Currency+0.00;
                      let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.Total) || Currency+0.00;
                      let totalAdjusted = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalAdjusted) || Currency+0.00;
                      let totalAmountInc = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalInc) || Currency+0.00;
                      sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                      sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                      sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                      let hoursFormatted = templateObject.timeFormat(data.ttimesheet[t].fields.Hours) || '';
                      let lineEmpID = '';
                      if((data.ttimesheet[t].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[t].fields.EndTime.replace(/\s/g, '') == '')){
                        hourlyRate = Currency+0.00;
                      }
                      if((data.ttimesheet[t].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[t].fields.EndTime.replace(/\s/g, '') == '')){
                        hoursFormatted = '00:00';
                      }

                      if (data.ttimesheet[t].fields.Logs) {
                          if (Array.isArray(data.ttimesheet[t].fields.Logs)) {
                              // It is array
                              lineEmpID = data.ttimesheet[t].fields.Logs[0].fields.EmployeeID || '';
                          } else {
                              lineEmpID = data.ttimesheet[t].fields.Logs.fields.EmployeeID || '';
                          }
                      }
                      var dataList = {
                          id: data.ttimesheet[t].fields.ID || '',
                          employee: data.ttimesheet[t].fields.EmployeeName || '',
                          employeeID: lineEmpID || '',
                          hourlyrate: hourlyRate,
                          hourlyrateval: data.ttimesheet[t].fields.HourlyRate || '',
                          hours: data.ttimesheet[t].fields.Hours || '',
                          hourFormat: hoursFormatted,
                          job: data.ttimesheet[t].fields.Job || '',
                          product: data.ttimesheet[t].fields.ServiceName || '',
                          labourcost: labourCost,
                          overheadrate: data.ttimesheet[t].fields.OverheadRate || '',
                          sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                          timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                          // suppliername: data.ttimesheet[t].SupplierName || '',
                          timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                          totalamountex: totalAmount || Currency+0.00,
                          totaladjusted: totalAdjusted || Currency+0.00,
                          totalamountinc: totalAmountInc || Currency+0.00,
                          overtime: 0,
                          double: 0,
                          status: data.ttimesheet[t].fields.Status || 'Unprocessed',
                          additional: Currency + '0.00',
                          paychecktips: Currency + '0.00',
                          cashtips: Currency + '0.00',
                          startTime: data.ttimesheet[t].fields.StartTime || '',
                          endTime: data.ttimesheet[t].fields.EndTime || '',
                          // totaloustanding: totalOutstanding || 0.00,
                          // orderstatus: data.ttimesheet[t].OrderStatus || '',
                          // custfield1: '' || '',
                          // custfield2: '' || '',
                          // invoicenotes: data.ttimesheet[t].InvoiceNotes || '',
                          notes: data.ttimesheet[t].fields.Notes || '',
                          finished: 'Not Processed',
                          color: '#f6c23e'
                      };
                      dataTableList.push(dataList);

                      let sortdate = data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate;
                      let timesheetdate = data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate;
                      let checkStatus = data.ttimesheet[t].fields.Status || 'Unprocessed';

                      var dataListTimeSheet = [
                          '<div class="custom-control custom-checkbox pointer"><input class="custom-control-input chkBox notevent pointer" type="checkbox" id="f-'+data.ttimesheet[t].fields.ID+'" name="'+data.ttimesheet[t].fields.ID+'"> <label class="custom-control-label" for="f-'+data.ttimesheet[t].fields.ID+'"></label></div>' || '',
                          data.ttimesheet[t].fields.ID || '',
                          data.ttimesheet[t].fields.EmployeeName || '',
                          '<span style="display:none;">'+sortdate+'</span> '+timesheetdate || '',
                          data.ttimesheet[t].fields.Job || '',
                          data.ttimesheet[t].fields.ServiceName || '',
                          '<input class="colRegHours highlightInput" type="number" value="'+data.ttimesheet[t].fields.Hours+'"><span class="colRegHours" style="display: none;">'+data.ttimesheet[t].fields.Hours+'</span>' || '',
                          '<input class="colRegHoursOne highlightInput" type="text" value="'+hoursFormatted+'" autocomplete="off">' || '',
                          '<input class="colOvertime highlightInput" type="number" value="0"><span class="colOvertime" style="display: none;">0</span>' || '',
                          '<input class="colDouble highlightInput" type="number" value="0"><span class="colDouble" style="display: none;">0</span>' || '',
                          '<input class="colAdditional highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colAdditional" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                          '<input class="colPaycheckTips highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colPaycheckTips" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                          data.ttimesheet[t].fields.Notes || '',
                          checkStatus || '',
                          '',
                          data.ttimesheet[t].fields.HourlyRate || '',
                          '<a href="/timesheettimelog?id='+data.ttimesheet[t].fields.ID+'" class="btn btn-sm btn-success btnTimesheetListOne" style="width: 36px;" id="" autocomplete="off"><i class="far fa-clock"></i></a>' || ''
                      ];

                      let dtTimeSheet = new Date(data.ttimesheet[t].fields.TimeSheetDate.split(' ')[0]);
                      if(ignoreDate == true){
                        sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                        sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                        sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                        splashArrayTimeSheetList.push(dataListTimeSheet);
                      }else{
                        if((dtTimeSheet >= new Date(fromDate)) && (dtTimeSheet <= new Date(toDate))){
                          sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                          sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                          sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                          splashArrayTimeSheetList.push(dataListTimeSheet);
                        }
                      }

                  }
                  $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
                  $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate.toFixed(2)));
                  $('.lblSumHour').text(sumSumHour.toFixed(2));
                  templateObject.datatablerecords.set(dataTableList);
                  templateObject.datatablerecords1.set(dataTableList);

                  if (templateObject.datatablerecords.get()) {

                      Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTimeSheet', function (error, result) {
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
                                      let columnindex = customcolumn[i].index + 1;

                                      if (hiddenColumn == true) {

                                          $("." + columnClass + "").addClass('hiddenColumn');
                                          $("." + columnClass + "").removeClass('showColumn');
                                      } else if (hiddenColumn == false) {
                                          $("." + columnClass + "").removeClass('hiddenColumn');
                                          $("." + columnClass + "").addClass('showColumn');
                                      }

                                  }
                              }

                          }
                      });

                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
                  }

                  setTimeout(function () {
                      $('#tblTimeSheet').DataTable({
                        data: splashArrayTimeSheetList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                          columnDefs: [{
                                  className: "colFlag",
                                  "orderable": false,
                                  "targets": [0]
                              }, {
                                  className: "colID",
                                  contenteditable:"false",
                                  "targets": [1]
                              }, {
                                  className: "colName",
                                  contenteditable:"false",
                                  "targets": [2]
                              }, {
                                  className: "colDate",
                                  contenteditable:"false",
                                  "targets": [3]
                              }, {
                                  className: "colJob",
                                  contenteditable:"false",
                                  "targets": [4]
                              }, {
                                  className: "colProduct",
                                  "targets": [5]
                              }, {
                                  className: "hiddenColumn text-right",
                                  "targets": [6]
                              }, {
                                  className: "text-right",
                                  "targets": [7]
                              }, {
                                  className: " text-right",
                                  "targets": [8]
                              }, {
                                  className: " text-right",
                                  "targets": [9]
                              }, {
                                  className: " text-right",
                                  "targets": [10]
                              }, {
                                  className: " text-right",
                                  "targets": [11]
                              }, {
                                  className: "colNotes",
                                  "targets": [12]
                              }, {
                                  className: "colStatus",
                                  "targets": [13]
                              }, {
                                  className: "hiddenColumn colInvoiced",
                                  "targets": [14]
                              }, {
                                  className: "hiddenColumn hourlyrate",
                                  "targets": [15]
                              }, {
                                  className: "viewTimeLog",
                                  "targets": [16]
                              }, {
                                  targets: 'sorting_disabled',
                                  orderable: false
                              }
                          ],
                          select: true,
                          destroy: true,
                          colReorder: {
                              fixedColumnsRight: 1,
                              fixedColumnsLeft: 1
                          },
                          buttons: [{
                                  extend: 'excelHtml5',
                                  text: '',
                                  download: 'open',
                                  className: "btntabletocsv hiddenColumn",
                                  filename: "Timesheet List - " + moment().format(),
                                  orientation: 'portrait',
                                  exportOptions: {
                                      columns: "thead tr th:not(.noExport)",
                                      // columns: [':visible :not(:last-child)'],
                                      format: {
                                          body: function (data, row, column) {
                                              if (data.includes("</span>")) {
                                                  var res = data.split("</span>");
                                                  data = res[1];
                                              }
                                              return column === 1 ? data.replace(/<.*?>/ig, "") : data;
                                          }
                                      }
                                  }
                              }, {
                                  extend: 'print',
                                  download: 'open',
                                  className: "btntabletopdf hiddenColumn",
                                  text: '',
                                  title: 'Time Sheet',
                                  filename: "Timesheet List - " + moment().format(),
                                  exportOptions: {
                                      columns: "thead tr th:not(.noExport)",
                                      stripHtml: false
                                  }
                              }
                          ],
                          // paging: false,
                          pageLength: initialReportDatatableLoad,
                          "bLengthChange": false,
                          lengthMenu: [
                              [initialReportDatatableLoad, -1],
                              [initialReportDatatableLoad, "All"]
                          ],
                          info: true,
                          responsive: true,
                          "order": [[1, "desc"]],
                          action: function () {
                              $('#tblTimeSheet').DataTable().ajax.reload();
                          },
                          "fnDrawCallback": function (oSettings) {
                              setTimeout(function () {
                                  checkStockColor();
                                  MakeNegative();
                              }, 100);
                          },
                          "fnInitComplete": function () {
                              let urlParametersPage = FlowRouter.current().queryParams.page;
                              if (urlParametersPage) {
                                  this.fnPageChange('last');
                              }
                              $("<button class='btn btn-primary btnRefreshTimeSheet' type='button' id='btnRefreshTimeSheet' style='padding: 4px 10px; font-size: 16px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTimeSheet_filter");

                              $('.myvarFilterForm').appendTo(".colDateFilter");

                          }

                      }).on('page', function () {
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
                          let draftRecord = templateObject.datatablerecords.get();
                          templateObject.datatablerecords.set(draftRecord);
                      }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
                      });
                      $('.fullScreenSpin').css('display', 'none');
                  }, 0);

                  var columns = $('#tblTimeSheet th');
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
                      if ((v.className.includes("hiddenColumn"))) {
                          columVisible = false;
                      }
                      sWidth = v.style.width.replace('px', "");
                      if(v.className.includes("colRegHoursOne") == false) {
                      let datatablerecordObj = {
                          sTitle: v.innerText || '',
                          sWidth: sWidth || '',
                          sIndex: v.cellIndex || '',
                          sVisible: columVisible || false,
                          sClass: v.className || ''
                      };
                      tableHeaderList.push(datatablerecordObj);
                  }
                  });
                  templateObject.tableheaderrecords.set(tableHeaderList);
                  $('div.dataTables_filter input').addClass('form-control');
                  $('#tblTimeSheet tbody').on('click', 'tr .btnEditTimeSheet', function () {
                      var listData = $(this).closest('tr').find(".colID").text()||0;
                      if (listData) {
                          var employeeName = $(event.target).closest("tr").find(".colName").text() || '';
                          var jobName = $(event.target).closest("tr").find(".colJob").text() || '';
                          var productName = $(event.target).closest("tr").find(".colProduct").text() || '';
                          var regHour = $(event.target).closest("tr").find(".colRegHours").val() || 0;
                          var techNotes = $(event.target).closest("tr").find(".colNotes").text() || '';
                          $('#edtTimesheetID').val(listData);
                          $('#add-timesheet-title').text('Edit TimeSheet');
                          $('.sltEmployee').val(employeeName);
                          $('.sltJob').val(jobName);
                          $('#product-list').val(productName);
                          $('.lineEditHour').val(regHour);
                          $('.lineEditTechNotes').val(techNotes);
                          // window.open('/billcard?id=' + listData,'_self');
                      }
                  });

              }).catch(function (err) {
                  // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                  $('.fullScreenSpin').css('display', 'none');
                  // Meteor._reload.reload();
              });

            } else {
                $('.fullScreenSpin').css('display', 'none');
                let data = JSON.parse(dataObject[0].data);
                let lineItems = [];
                let lineItemObj = {};
                let sumTotalCharge = 0;
                let sumSumHour = 0;
                let sumSumHourlyRate = 0;
                for (let t = 0; t < data.ttimesheet.length; t++) {

                    if (seeOwnTimesheets == false) {
                        let hourlyRate = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.HourlyRate) || Currency+0.00;
                        let labourCost = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.LabourCost) || Currency+0.00;
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.Total) || Currency+0.00;
                        let totalAdjusted = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalAdjusted) || Currency+0.00;
                        let totalAmountInc = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalInc) || Currency+0.00;

                        let hoursFormatted = templateObject.timeFormat(data.ttimesheet[t].fields.Hours) || '';
                        if((data.ttimesheet[t].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[t].fields.EndTime.replace(/\s/g, '') == '')){
                          hourlyRate = Currency+0.00;
                        }
                        if((data.ttimesheet[t].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[t].fields.EndTime.replace(/\s/g, '') == '')){
                          hoursFormatted = '00:00';
                        }
                        let lineEmpID = '';
                        if (data.ttimesheet[t].fields.Logs) {
                            if (Array.isArray(data.ttimesheet[t].fields.Logs)) {
                                // It is array
                                lineEmpID = data.ttimesheet[t].fields.Logs[0].fields.EmployeeID || '';
                            } else {
                                lineEmpID = data.ttimesheet[t].fields.Logs.fields.EmployeeID || '';
                            }
                        }
                        var dataList = {
                            id: data.ttimesheet[t].fields.ID || '',
                            employee: data.ttimesheet[t].fields.EmployeeName || '',
                            employeeID: lineEmpID || '',
                            hourlyrate: hourlyRate,
                            hourlyrateval: data.ttimesheet[t].fields.HourlyRate || '',
                            hours: data.ttimesheet[t].fields.Hours || '',
                            hourFormat: hoursFormatted,
                            job: data.ttimesheet[t].fields.Job || '',
                            product: data.ttimesheet[t].fields.ServiceName || '',
                            labourcost: labourCost,
                            overheadrate: data.ttimesheet[t].fields.OverheadRate || '',
                            sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                            timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                            // suppliername: data.ttimesheet[t].SupplierName || '',
                            timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                            totalamountex: totalAmount || Currency+0.00,
                            totaladjusted: totalAdjusted || Currency+0.00,
                            totalamountinc: totalAmountInc || Currency+0.00,
                            status: data.ttimesheet[t].fields.Status || 'Unprocessed',
                            overtime: 0,
                            double: 0,
                            additional: Currency + '0.00',
                            paychecktips: Currency + '0.00',
                            cashtips: Currency + '0.00',
                            startTime: data.ttimesheet[t].fields.StartTime || '',
                            endTime: data.ttimesheet[t].fields.EndTime || '',
                            // totaloustanding: totalOutstanding || 0.00,
                            // orderstatus: data.ttimesheet[t].OrderStatus || '',
                            // custfield1: '' || '',
                            // custfield2: '' || '',
                            // invoicenotes: data.ttimesheet[t].InvoiceNotes || '',
                            notes: data.ttimesheet[t].fields.Notes || '',
                            finished: 'Not Processed',
                            color: '#f6c23e'
                        };
                        dataTableList.push(dataList);

                        let sortdate = data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate;
                        let timesheetdate = data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate;
                        let checkStatus = data.ttimesheet[t].fields.Status || 'Unprocessed';

                        var dataListTimeSheet = [
                            '<div class="custom-control custom-checkbox pointer"><input class="custom-control-input chkBox notevent pointer" type="checkbox" id="f-'+data.ttimesheet[t].fields.ID+'" name="'+data.ttimesheet[t].fields.ID+'"> <label class="custom-control-label" for="f-'+data.ttimesheet[t].fields.ID+'"></label></div>' || '',
                            data.ttimesheet[t].fields.ID || '',
                            data.ttimesheet[t].fields.EmployeeName || '',
                            '<span style="display:none;">'+sortdate+'</span> '+timesheetdate || '',
                            data.ttimesheet[t].fields.Job || '',
                            data.ttimesheet[t].fields.ServiceName || '',
                            '<input class="colRegHours highlightInput" type="number" value="'+data.ttimesheet[t].fields.Hours+'"><span class="colRegHours" style="display: none;">'+data.ttimesheet[t].fields.Hours+'</span>' || '',
                            '<input class="colRegHoursOne highlightInput" type="text" value="'+hoursFormatted+'" autocomplete="off">' || '',
                            '<input class="colOvertime highlightInput" type="number" value="0"><span class="colOvertime" style="display: none;">0</span>' || '',
                            '<input class="colDouble highlightInput" type="number" value="0"><span class="colDouble" style="display: none;">0</span>' || '',
                            '<input class="colAdditional highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colAdditional" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                            '<input class="colPaycheckTips highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colPaycheckTips" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                            data.ttimesheet[t].fields.Notes || '',
                            checkStatus || '',
                            '',
                            data.ttimesheet[t].fields.HourlyRate || '',
                            '<a href="/timesheettimelog?id='+data.ttimesheet[t].fields.ID+'" class="btn btn-sm btn-success btnTimesheetListOne" style="width: 36px;" id="" autocomplete="off"><i class="far fa-clock"></i></a>' || ''
                        ];


                        let dtTimeSheet = new Date(data.ttimesheet[t].fields.TimeSheetDate.split(' ')[0]);

                        if(ignoreDate == true){
                          sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                          sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                          sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                          splashArrayTimeSheetList.push(dataListTimeSheet);
                        }else{
                          if((dtTimeSheet >= new Date(fromDate)) && (dtTimeSheet <= new Date(toDate))){
                            sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                            sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                            sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                            splashArrayTimeSheetList.push(dataListTimeSheet);
                          }
                        }


                    } else {
                        if (data.ttimesheet[t].fields.EmployeeName == Session.get('mySessionEmployee')) {
                            let hourlyRate = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.HourlyRate) || Currency+0.00;
                            let labourCost = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.LabourCost) || Currency+0.00;
                            let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.Total) || Currency+0.00;
                            let totalAdjusted = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalAdjusted) || Currency+0.00;
                            let totalAmountInc = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalInc) || Currency+0.00;
                            // sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                            // sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                            // sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                            let hoursFormatted = templateObject.timeFormat(data.ttimesheet[t].fields.Hours) || '';
                            let lineEmpID = '';
                            if (data.ttimesheet[t].fields.Logs) {
                                if (Array.isArray(data.ttimesheet[t].fields.Logs)) {
                                    // It is array
                                    lineEmpID = data.ttimesheet[t].fields.Logs[0].fields.EmployeeID || '';
                                } else {
                                    lineEmpID = data.ttimesheet[t].fields.Logs.fields.EmployeeID || '';
                                }
                            }

                            var dataList = {
                                id: data.ttimesheet[t].fields.ID || '',
                                employee: data.ttimesheet[t].fields.EmployeeName || '',
                                employeeID: lineEmpID || '',
                                hourlyrate: hourlyRate,
                                hourlyrateval: data.ttimesheet[t].fields.HourlyRate || '',
                                hours: data.ttimesheet[t].fields.Hours || '',
                                hourFormat: hoursFormatted,
                                job: data.ttimesheet[t].fields.Job || '',
                                product: data.ttimesheet[t].fields.ServiceName || '',
                                labourcost: labourCost,
                                overheadrate: data.ttimesheet[t].fields.OverheadRate || '',
                                sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                                timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                                // suppliername: data.ttimesheet[t].SupplierName || '',
                                timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                                totalamountex: totalAmount || Currency+0.00,
                                totaladjusted: totalAdjusted || Currency+0.00,
                                totalamountinc: totalAmountInc || Currency+0.00,
                                status: data.ttimesheet[t].fields.Status || 'Unprocessed',
                                overtime: 0,
                                double: 0,
                                additional: Currency + '0.00',
                                paychecktips: Currency + '0.00',
                                cashtips: Currency + '0.00',
                                // totaloustanding: totalOutstanding || 0.00,
                                // orderstatus: data.ttimesheet[t].OrderStatus || '',
                                // custfield1: '' || '',
                                // custfield2: '' || '',
                                // invoicenotes: data.ttimesheet[t].InvoiceNotes || '',
                                notes: data.ttimesheet[t].fields.Notes || '',
                                finished: 'Not Processed',
                                color: '#f6c23e'
                            };
                            dataTableList.push(dataList);

                            let sortdate = data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate;
                            let timesheetdate = data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate;
                            let checkStatus = data.ttimesheet[t].fields.Status || 'Unprocessed';

                            var dataListTimeSheet = [
                                '<div class="custom-control custom-checkbox pointer"><input class="custom-control-input chkBox notevent pointer" type="checkbox" id="f-'+data.ttimesheet[t].fields.ID+'" name="'+data.ttimesheet[t].fields.ID+'"> <label class="custom-control-label" for="f-'+data.ttimesheet[t].fields.ID+'"></label></div>' || '',
                                data.ttimesheet[t].fields.ID || '',
                                data.ttimesheet[t].fields.EmployeeName || '',
                                '<span style="display:none;">'+sortdate+'</span> '+timesheetdate || '',
                                data.ttimesheet[t].fields.Job || '',
                                data.ttimesheet[t].fields.ServiceName || '',
                                '<input class="colRegHours highlightInput" type="number" value="'+data.ttimesheet[t].fields.Hours+'"><span class="colRegHours" style="display: none;">'+data.ttimesheet[t].fields.Hours+'</span>' || '',
                                '<input class="colRegHoursOne highlightInput" type="text" value="'+hoursFormatted+'" autocomplete="off">' || '',
                                '<input class="colOvertime highlightInput" type="number" value="0"><span class="colOvertime" style="display: none;">0</span>' || '',
                                '<input class="colDouble highlightInput" type="number" value="0"><span class="colDouble" style="display: none;">0</span>' || '',
                                '<input class="colAdditional highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colAdditional" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                                '<input class="colPaycheckTips highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colPaycheckTips" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                                data.ttimesheet[t].fields.Notes || '',
                                checkStatus || '',
                                '',
                                data.ttimesheet[t].fields.HourlyRate || '',
                                '<a href="/timesheettimelog?id='+data.ttimesheet[t].fields.ID+'" class="btn btn-sm btn-success btnTimesheetListOne" style="width: 36px;" id="" autocomplete="off"><i class="far fa-clock"></i></a>' || ''
                            ];

                            let dtTimeSheet = new Date(data.ttimesheet[t].fields.TimeSheetDate.split(' ')[0]);
                            if(ignoreDate == true){
                              sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                              sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                              sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                              splashArrayTimeSheetList.push(dataListTimeSheet);
                            }else{
                              if((dtTimeSheet >= new Date(fromDate)) && (dtTimeSheet <= new Date(toDate))){
                                sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                                sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                                sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                                splashArrayTimeSheetList.push(dataListTimeSheet);
                              }
                            }

                        }

                    }

                }
                $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
                $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate.toFixed(2)));
                $('.lblSumHour').text(sumSumHour.toFixed(2));
                templateObject.datatablerecords.set(dataTableList);
                templateObject.datatablerecords1.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTimeSheet', function (error, result) {
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
                                    let columnindex = customcolumn[i].index + 1;

                                    if (hiddenColumn == true) {

                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                    } else if (hiddenColumn == false) {
                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                        $("." + columnClass + "").addClass('showColumn');
                                    }

                                }
                            }

                        }
                    });

                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                setTimeout(function () {
                    $('#tblTimeSheet').DataTable({
                      data: splashArrayTimeSheetList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        columnDefs: [{
                                className: "colFlag",
                                "orderable": false,
                                "targets": [0]
                            }, {
                                className: "colID",
                                contenteditable:"false",
                                "targets": [1]
                            }, {
                                className: "colName",
                                contenteditable:"false",
                                "targets": [2]
                            }, {
                                className: "colDate",
                                contenteditable:"false",
                                "targets": [3]
                            }, {
                                className: "colJob",
                                contenteditable:"false",
                                "targets": [4]
                            }, {
                                className: "colProduct",
                                "targets": [5]
                            }, {
                                className: "hiddenColumn text-right",
                                "targets": [6]
                            }, {
                                className: "text-right",
                                "targets": [7]
                            }, {
                                className: " text-right",
                                "targets": [8]
                            }, {
                                className: " text-right",
                                "targets": [9]
                            }, {
                                className: " text-right",
                                "targets": [10]
                            }, {
                                className: " text-right",
                                "targets": [11]
                            }, {
                                className: "colNotes",
                                "targets": [12]
                            }, {
                                className: "colStatus",
                                "targets": [13]
                            }, {
                                className: "hiddenColumn colInvoiced",
                                "targets": [14]
                            }, {
                                className: "hiddenColumn hourlyrate",
                                "targets": [15]
                            }, {
                                className: "viewTimeLog",
                                "targets": [16]
                            }, {
                                targets: 'sorting_disabled',
                                orderable: false
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: {
                            fixedColumnsRight: 1,
                            fixedColumnsLeft: 1
                        },
                        buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Timesheet List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: "thead tr th:not(.noExport)",
                                    // columns: [':visible :not(:last-child)'],
                                    format: {
                                        body: function (data, row, column) {
                                            if (data.includes("</span>")) {
                                                var res = data.split("</span>");
                                                data = res[1];
                                            }
                                            return column === 1 ? data.replace(/<.*?>/ig, "") : data;
                                        }
                                    }
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Time Sheet',
                                filename: "Timesheet List - " + moment().format(),
                                exportOptions: {
                                    columns: "thead tr th:not(.noExport)",
                                    stripHtml: false
                                }
                            }
                        ],
                        // paging: false,
                        pageLength: initialReportDatatableLoad,
                        "bLengthChange": false,
                        lengthMenu: [
                            [initialReportDatatableLoad, -1],
                            [initialReportDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "order": [[1, "desc"]],
                        action: function () {
                            $('#tblTimeSheet').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                checkStockColor();
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                            let urlParametersPage = FlowRouter.current().queryParams.page;
                            if (urlParametersPage) {
                                this.fnPageChange('last');
                            }
                            $("<button class='btn btn-primary btnRefreshTimeSheet' type='button' id='btnRefreshTimeSheet' style='padding: 4px 10px; font-size: 16px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTimeSheet_filter");

                            $('.myvarFilterForm').appendTo(".colDateFilter");

                        }

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);


                var columns = $('#tblTimeSheet th');
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
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");
                    if(v.className.includes("colRegHoursOne") == false) {
                        let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || '',
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderList.push(datatablerecordObj);

                    }

                });
                templateObject.tableheaderrecords.set(tableHeaderList);
                $('div.dataTables_filter input').addClass('form-control');
                $('#tblTimeSheet tbody').on('click', 'tr .btnEditTimeSheet', function () {
                    var listData = $(this).closest('tr').find(".colID").text()||0;
                    if (listData) {
                        var employeeName = $(event.target).closest("tr").find(".colName").text() || '';
                        var jobName = $(event.target).closest("tr").find(".colJob").text() || '';
                        var productName = $(event.target).closest("tr").find(".colProduct").text() || '';
                        var regHour = $(event.target).closest("tr").find(".colRegHours").val() || 0;
                        var techNotes = $(event.target).closest("tr").find(".colNotes").text() || '';
                        $('#edtTimesheetID').val(listData);
                        $('#add-timesheet-title').text('Edit TimeSheet');
                        $('.sltEmployee').val(employeeName);
                        $('.sltJob').val(jobName);
                        $('#product-list').val(productName);
                        $('.lineEditHour').val(regHour);
                        $('.lineEditTechNotes').val(techNotes);
                        // window.open('/billcard?id=' + listData,'_self');
                    }
                });
            }

        }).catch(function (err) {
          sideBarService.getAllTimeSheetList().then(function (data) {
              addVS1Data('TTimeSheet', JSON.stringify(data));
              $('.fullScreenSpin').css('display', 'none');
              let lineItems = [];
              let lineItemObj = {};

              let sumTotalCharge = 0;
              let sumSumHour = 0;
              let sumSumHourlyRate = 0;
              for (let t = 0; t < data.ttimesheet.length; t++) {
                  let hourlyRate = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.HourlyRate) || Currency+0.00;
                  let labourCost = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.LabourCost) || Currency+0.00;
                  let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.Total) || Currency+0.00;
                  let totalAdjusted = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalAdjusted) || Currency+0.00;
                  let totalAmountInc = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalInc) || Currency+0.00;
                  sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                  sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                  sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                  let hoursFormatted = templateObject.timeFormat(data.ttimesheet[t].fields.Hours) || '';
                  let lineEmpID = '';
                  if((data.ttimesheet[t].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[t].fields.EndTime.replace(/\s/g, '') == '')){
                    hourlyRate = Currency+0.00;
                  }
                  if((data.ttimesheet[t].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[t].fields.EndTime.replace(/\s/g, '') == '')){
                    hoursFormatted = '00:00';
                  }

                  if (data.ttimesheet[t].fields.Logs) {
                      if (Array.isArray(data.ttimesheet[t].fields.Logs)) {
                          // It is array
                          lineEmpID = data.ttimesheet[t].fields.Logs[0].fields.EmployeeID || '';
                      } else {
                          lineEmpID = data.ttimesheet[t].fields.Logs.fields.EmployeeID || '';
                      }
                  }
                  var dataList = {
                      id: data.ttimesheet[t].fields.ID || '',
                      employee: data.ttimesheet[t].fields.EmployeeName || '',
                      employeeID: lineEmpID || '',
                      hourlyrate: hourlyRate,
                      hourlyrateval: data.ttimesheet[t].fields.HourlyRate || '',
                      hours: data.ttimesheet[t].fields.Hours || '',
                      hourFormat: hoursFormatted,
                      job: data.ttimesheet[t].fields.Job || '',
                      product: data.ttimesheet[t].fields.ServiceName || '',
                      labourcost: labourCost,
                      overheadrate: data.ttimesheet[t].fields.OverheadRate || '',
                      sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                      timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                      // suppliername: data.ttimesheet[t].SupplierName || '',
                      timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                      totalamountex: totalAmount || Currency+0.00,
                      totaladjusted: totalAdjusted || Currency+0.00,
                      totalamountinc: totalAmountInc || Currency+0.00,
                      overtime: 0,
                      double: 0,
                      status: data.ttimesheet[t].fields.Status || 'Unprocessed',
                      additional: Currency + '0.00',
                      paychecktips: Currency + '0.00',
                      cashtips: Currency + '0.00',
                      startTime: data.ttimesheet[t].fields.StartTime || '',
                      endTime: data.ttimesheet[t].fields.EndTime || '',
                      // totaloustanding: totalOutstanding || 0.00,
                      // orderstatus: data.ttimesheet[t].OrderStatus || '',
                      // custfield1: '' || '',
                      // custfield2: '' || '',
                      // invoicenotes: data.ttimesheet[t].InvoiceNotes || '',
                      notes: data.ttimesheet[t].fields.Notes || '',
                      finished: 'Not Processed',
                      color: '#f6c23e'
                  };
                  dataTableList.push(dataList);

                  let sortdate = data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate;
                  let timesheetdate = data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate;
                  let checkStatus = data.ttimesheet[t].fields.Status || 'Unprocessed';

                  var dataListTimeSheet = [
                      '<div class="custom-control custom-checkbox pointer"><input class="custom-control-input chkBox notevent pointer" type="checkbox" id="f-'+data.ttimesheet[t].fields.ID+'" name="'+data.ttimesheet[t].fields.ID+'"> <label class="custom-control-label" for="f-'+data.ttimesheet[t].fields.ID+'"></label></div>' || '',
                      data.ttimesheet[t].fields.ID || '',
                      data.ttimesheet[t].fields.EmployeeName || '',
                      '<span style="display:none;">'+sortdate+'</span> '+timesheetdate || '',
                      data.ttimesheet[t].fields.Job || '',
                      data.ttimesheet[t].fields.ServiceName || '',
                      '<input class="colRegHours highlightInput" type="number" value="'+data.ttimesheet[t].fields.Hours+'"><span class="colRegHours" style="display: none;">'+data.ttimesheet[t].fields.Hours+'</span>' || '',
                      '<input class="colRegHoursOne highlightInput" type="text" value="'+hoursFormatted+'" autocomplete="off">' || '',
                      '<input class="colOvertime highlightInput" type="number" value="0"><span class="colOvertime" style="display: none;">0</span>' || '',
                      '<input class="colDouble highlightInput" type="number" value="0"><span class="colDouble" style="display: none;">0</span>' || '',
                      '<input class="colAdditional highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colAdditional" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                      '<input class="colPaycheckTips highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colPaycheckTips" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                      data.ttimesheet[t].fields.Notes || '',
                      checkStatus || '',
                      '',
                      data.ttimesheet[t].fields.HourlyRate || '',
                      '<a href="/timesheettimelog?id='+data.ttimesheet[t].fields.ID+'" class="btn btn-sm btn-success btnTimesheetListOne" style="width: 36px;" id="" autocomplete="off"><i class="far fa-clock"></i></a>' || ''
                  ];

                  let dtTimeSheet = new Date(data.ttimesheet[t].fields.TimeSheetDate.split(' ')[0]);
                  if(ignoreDate == true){
                    sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                    sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                    sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                    splashArrayTimeSheetList.push(dataListTimeSheet);
                  }else{
                    if((dtTimeSheet >= new Date(fromDate)) && (dtTimeSheet <= new Date(toDate))){
                      sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                      sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                      sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                      splashArrayTimeSheetList.push(dataListTimeSheet);
                    }
                  }

              }
              $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
              $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate.toFixed(2)));
              $('.lblSumHour').text(sumSumHour.toFixed(2));
              templateObject.datatablerecords.set(dataTableList);
              templateObject.datatablerecords1.set(dataTableList);

              if (templateObject.datatablerecords.get()) {

                  Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTimeSheet', function (error, result) {
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
                                  let columnindex = customcolumn[i].index + 1;

                                  if (hiddenColumn == true) {

                                      $("." + columnClass + "").addClass('hiddenColumn');
                                      $("." + columnClass + "").removeClass('showColumn');
                                  } else if (hiddenColumn == false) {
                                      $("." + columnClass + "").removeClass('hiddenColumn');
                                      $("." + columnClass + "").addClass('showColumn');
                                  }

                              }
                          }

                      }
                  });

                  setTimeout(function () {
                      MakeNegative();
                  }, 100);
              }

              setTimeout(function () {
                  $('#tblTimeSheet').DataTable({
                    data: splashArrayTimeSheetList,
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [{
                              className: "colFlag",
                              "orderable": false,
                              "targets": [0]
                          }, {
                              className: "colID",
                              contenteditable:"false",
                              "targets": [1]
                          }, {
                              className: "colName",
                              contenteditable:"false",
                              "targets": [2]
                          }, {
                              className: "colDate",
                              contenteditable:"false",
                              "targets": [3]
                          }, {
                              className: "colJob",
                              contenteditable:"false",
                              "targets": [4]
                          }, {
                              className: "colProduct",
                              "targets": [5]
                          }, {
                              className: "hiddenColumn text-right",
                              "targets": [6]
                          }, {
                              className: "text-right",
                              "targets": [7]
                          }, {
                              className: " text-right",
                              "targets": [8]
                          }, {
                              className: " text-right",
                              "targets": [9]
                          }, {
                              className: " text-right",
                              "targets": [10]
                          }, {
                              className: " text-right",
                              "targets": [11]
                          }, {
                              className: "colNotes",
                              "targets": [12]
                          }, {
                              className: "colStatus",
                              "targets": [13]
                          }, {
                              className: "hiddenColumn colInvoiced",
                              "targets": [14]
                          }, {
                              className: "hiddenColumn hourlyrate",
                              "targets": [15]
                          }, {
                              className: "viewTimeLog",
                              "targets": [16]
                          }, {
                              targets: 'sorting_disabled',
                              orderable: false
                          }
                      ],
                      select: true,
                      destroy: true,
                      colReorder: {
                          fixedColumnsRight: 1,
                          fixedColumnsLeft: 1
                      },
                      buttons: [{
                              extend: 'excelHtml5',
                              text: '',
                              download: 'open',
                              className: "btntabletocsv hiddenColumn",
                              filename: "Timesheet List - " + moment().format(),
                              orientation: 'portrait',
                              exportOptions: {
                                  columns: "thead tr th:not(.noExport)",
                                  // columns: [':visible :not(:last-child)'],
                                  format: {
                                      body: function (data, row, column) {
                                          if (data.includes("</span>")) {
                                              var res = data.split("</span>");
                                              data = res[1];
                                          }
                                          return column === 1 ? data.replace(/<.*?>/ig, "") : data;
                                      }
                                  }
                              }
                          }, {
                              extend: 'print',
                              download: 'open',
                              className: "btntabletopdf hiddenColumn",
                              text: '',
                              title: 'Time Sheet',
                              filename: "Timesheet List - " + moment().format(),
                              exportOptions: {
                                  columns: "thead tr th:not(.noExport)",
                                  stripHtml: false
                              }
                          }
                      ],
                      // paging: false,
                      pageLength: initialReportDatatableLoad,
                      "bLengthChange": false,
                      lengthMenu: [
                          [initialReportDatatableLoad, -1],
                          [initialReportDatatableLoad, "All"]
                      ],
                      info: true,
                      responsive: true,
                      "order": [[1, "desc"]],
                      action: function () {
                          $('#tblTimeSheet').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          setTimeout(function () {
                              checkStockColor();
                              MakeNegative();
                          }, 100);
                      },
                      "fnInitComplete": function () {
                          let urlParametersPage = FlowRouter.current().queryParams.page;
                          if (urlParametersPage) {
                              this.fnPageChange('last');
                          }
                          $("<button class='btn btn-primary btnRefreshTimeSheet' type='button' id='btnRefreshTimeSheet' style='padding: 4px 10px; font-size: 16px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTimeSheet_filter");

                          $('.myvarFilterForm').appendTo(".colDateFilter");

                      }

                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
                      let draftRecord = templateObject.datatablerecords.get();
                      templateObject.datatablerecords.set(draftRecord);
                  }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
                  });
                  $('.fullScreenSpin').css('display', 'none');
              }, 0);

              var columns = $('#tblTimeSheet th');
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
                  if ((v.className.includes("hiddenColumn"))) {
                      columVisible = false;
                  }
                  sWidth = v.style.width.replace('px', "");
                  if(v.className.includes("colRegHoursOne") == false) {
                  let datatablerecordObj = {
                      sTitle: v.innerText || '',
                      sWidth: sWidth || '',
                      sIndex: v.cellIndex || '',
                      sVisible: columVisible || false,
                      sClass: v.className || ''
                  };
                  tableHeaderList.push(datatablerecordObj);
              }
              });
              templateObject.tableheaderrecords.set(tableHeaderList);
              $('div.dataTables_filter input').addClass('form-control');
              $('#tblTimeSheet tbody').on('click', 'tr .btnEditTimeSheet', function () {
                  var listData = $(this).closest('tr').find(".colID").text()||0;
                  if (listData) {
                      var employeeName = $(event.target).closest("tr").find(".colName").text() || '';
                      var jobName = $(event.target).closest("tr").find(".colJob").text() || '';
                      var productName = $(event.target).closest("tr").find(".colProduct").text() || '';
                      var regHour = $(event.target).closest("tr").find(".colRegHours").val() || 0;
                      var techNotes = $(event.target).closest("tr").find(".colNotes").text() || '';
                      $('#edtTimesheetID').val(listData);
                      $('#add-timesheet-title').text('Edit TimeSheet');
                      $('.sltEmployee').val(employeeName);
                      $('.sltJob').val(jobName);
                      $('#product-list').val(productName);
                      $('.lineEditHour').val(regHour);
                      $('.lineEditTechNotes').val(techNotes);
                      // window.open('/billcard?id=' + listData,'_self');
                  }
              });

          }).catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $('.fullScreenSpin').css('display', 'none');
              // Meteor._reload.reload();
          });
        });
    }

    var toDate = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
    let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");

    templateObject.getAllTimeSheetData(prevMonth11Date,toDate, false);

    templateObject.getAllTimeSheetDataClock = function () {
        getVS1Data('TTimeSheet').then(function (dataObject) {
            if (dataObject == 0) {
                sideBarService.getAllTimeSheetList().then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    let sumTotalCharge = 0;
                    let sumSumHour = 0;
                    let sumSumHourlyRate = 0;
                    for (let t = 0; t < data.ttimesheet.length; t++) {
                        if (data.ttimesheet[t].fields.Logs != null) {
                            let hourlyRate = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.HourlyRate) || Currency+0.00;
                            let labourCost = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.LabourCost) || Currency+0.00;
                            let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.Total) || Currency+0.00;
                            let totalAdjusted = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalAdjusted) || Currency+0.00;
                            let totalAmountInc = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalInc) || Currency+0.00;
                            sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                            sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                            sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                            let hoursFormatted = templateObject.timeFormat(data.ttimesheet[t].fields.Hours) || '';
                            if((data.ttimesheet[t].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[t].fields.EndTime.replace(/\s/g, '') == '')){
                              hourlyRate = Currency+0.00;
                            }
                            if((data.ttimesheet[t].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[t].fields.EndTime.replace(/\s/g, '') == '')){
                              hoursFormatted = '00:00';
                            }
                            var dataList = {
                                id: data.ttimesheet[t].fields.ID || '',
                                employee: data.ttimesheet[t].fields.EmployeeName || '',
                                hourlyrate: hourlyRate,
                                hours: data.ttimesheet[t].fields.Hours || '',
                                hourFormat: hoursFormatted,
                                job: data.ttimesheet[t].fields.Job || '',
                                labourcost: labourCost,
                                overheadrate: data.ttimesheet[t].fields.OverheadRate || '',
                                sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                                timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                                product: data.ttimesheet[t].fields.ServiceName || '',
                                timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                                timelog: data.ttimesheet[t].fields.Logs || '',
                                isPaused: data.ttimesheet[t].fields.InvoiceNotes || '',
                                totalamountex: totalAmount || Currency+0.00,
                                totaladjusted: totalAdjusted || Currency+0.00,
                                totalamountinc: totalAmountInc || Currency+0.00,
                                overtime: 0,
                                double: 0,
                                status: data.ttimesheet[t].fields.Status || 'Unprocessed',
                                additional: Currency + '0.00',
                                paychecktips: Currency + '0.00',
                                cashtips: Currency + '0.00',
                                startTime: data.ttimesheet[t].fields.StartTime || '',
                                endTime: data.ttimesheet[t].fields.EndTime || '',
                                notes: data.ttimesheet[t].fields.Notes || '',
                                finished: 'Not Processed',
                                color: '#f6c23e'
                            };
                            timeSheetList.push(dataList);
                        }

                    }

                    if (clockList.length > 0) {
                        if (clockList[clockList.length - 1].isPaused == "completed") {
                            $('#employeeStatusField').removeClass('statusClockedOn');
                            $('#employeeStatusField').removeClass('statusOnHold');
                            $('#employeeStatusField').addClass('statusClockedOff').text('Clocked Off');
                        } else if (clockList[clockList.length - 1].isPaused == "paused") {
                            $('#employeeStatusField').removeClass('statusClockedOn');
                            $('#employeeStatusField').removeClass('statusClockedOff');
                            $('#employeeStatusField').addClass('statusOnHold').text('On Hold');
                        } else if (clockList[clockList.length - 1].isPaused == "Clocked On" || clockList[clockList.length - 1].isPaused == "") {
                            $('#employeeStatusField').removeClass('statusOnHold');
                            $('#employeeStatusField').removeClass('statusClockedOff');
                            $('#employeeStatusField').addClass('statusClockedOn').text('Clocked On');
                        }

                    } else {
                        $('#employeeStatusField').removeClass('statusClockedOn');
                        $('#employeeStatusField').removeClass('statusOnHold');
                        $('#employeeStatusField').addClass('statusClockedOn').text('Clocked Off');

                    }

                    $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
                    $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate));
                    $('.lblSumHour').text(sumSumHour.toFixed(2));
                    templateObject.timesheetrecords.set(timeSheetList);
                    let url = window.location.href;
                    if (url.indexOf('?id') > 1) {
                        url1 = new URL(window.location.href);
                        let timesheetID = url1.searchParams.get("id");
                        let clockList = templateObject.timesheetrecords.get();
                        var clockList = clockList.filter(timesheetInfo => {
                            return timesheetInfo.id == timesheetID
                        });

                        if (clockList.length > 0) {
                            $('#sltJobOne').val("");
                            $('#product-listone').val("");
                            $('#edtProductCost').val("");
                            $('#updateID').val("");
                            $('#startTime').val("");
                            $('#endTime').val("");
                            $('#txtBookedHoursSpent').val("");
                            $('#startTime').prop('disabled', false);
                            $('#endTime').prop('disabled', false);
                            $('#btnClockOn').prop('disabled', false);
                            $('#btnHoldOne').prop('disabled', false);
                            $('#btnClockOff').prop('disabled', false);
                            $('.processTimesheet').prop('disabled', false);

                            if (clockList[clockList.length - 1].isPaused == "paused") {
                                $('.btnHoldOne').prop('disabled', true);
                            } else {
                                $('.btnHoldOne').prop('disabled', false);
                            }

                            if (clockList[clockList.length - 1].isPaused == "paused") {
                                $(".paused").show();
                                $("#btnHoldOne").prop("disabled", true);
                                $("#btnHoldOne").addClass("mt-32");
                            } else {
                                $(".paused").hide();
                                $("#btnHoldOne").prop("disabled", false);
                                $("#btnHoldOne").removeClass("mt-32");
                            }

                            if (clockList[clockList.length - 1].status == "Processed") {
                                $('.processTimesheet').prop('disabled', true);
                            }

                            if (Array.isArray(clockList[clockList.length - 1].timelog) && clockList[clockList.length - 1].isPaused != "completed") {
                                let startTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime || '';
                                let date = clockList[clockList.length - 1].timesheetdate;
                                if (startTime != "") {
                                    $('#startTime').val(startTime.split(' ')[1]);
                                    $('#dtSODate').val(date);
                                    $('#txtBookedHoursSpent').val(clockList[clockList.length - 1].hours);
                                    $('#txtBookedHoursSpent1').val(clockList[clockList.length - 1].hours);
                                    $('#updateID').val(clockList[clockList.length - 1].id);
                                    $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                                    $('#sltJobOne').val(clockList[clockList.length - 1].job);
                                    $('#product-listone').val(clockList[clockList.length - 1].product);
                                    $('#edtProductCost').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                    $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                    $('#startTime').prop('disabled', true);
                                    if (clockList[clockList.length - 1].isPaused == "completed") {
                                        $('#endTime').val(endTime);
                                        $('#endTime').prop('disabled', true);
                                        $('#btnClockOn').prop('disabled', true);
                                        $('#btnHoldOne').prop('disabled', true);
                                        $('#btnClockOff').prop('disabled', true);
                                    }
                                }
                            } else if (clockList[clockList.length - 1].isPaused != "completed") {
                                if (clockList[clockList.length - 1].timelog.fields.EndDatetime == "") {
                                    let startTime = clockList[clockList.length - 1].timelog.fields.StartDatetime.split(' ')[1];
                                    let date = clockList[clockList.length - 1].timesheetdate;
                                    if (startTime != "") {
                                        $('#startTime').val(startTime);
                                        $('#dtSODate').val(date);
                                        $('#txtBookedHoursSpent').val(clockList[clockList.length - 1].hours);
                                        $('#txtBookedHoursSpent1').val(clockList[clockList.length - 1].hours);
                                        $('#updateID').val(clockList[clockList.length - 1].id);
                                        $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                                        $('#sltJobOne').val(clockList[clockList.length - 1].job);
                                        $('#product-listone').val(clockList[clockList.length - 1].product);
                                        $('#edtProductCost').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                        $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                        $('#startTime').prop('disabled', true);
                                        if (clockList[clockList.length - 1].isPaused == "completed") {
                                            $('#endTime').val(endTime);
                                            $('#endTime').prop('disabled', true);
                                            $('#btnClockOn').prop('disabled', true);
                                            $('#btnHoldOne').prop('disabled', true);
                                            $('#btnClockOff').prop('disabled', true);
                                        }
                                    }
                                }
                            }

                        }
                        $('#settingsModal').modal('show');

                    }
                    $('.fullScreenSpin').css('display', 'none');

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let lineItems = [];
                let lineItemObj = {};
                let sumTotalCharge = 0;
                let sumSumHour = 0;
                let sumSumHourlyRate = 0;
                for (let t = 0; t < data.ttimesheet.length; t++) {
                    if (data.ttimesheet[t].fields.Logs != null) {
                        let hourlyRate = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.HourlyRate) || Currency+0.00;
                        let labourCost = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.LabourCost) || Currency+0.00;
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.Total) || Currency+0.00;
                        let totalAdjusted = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalAdjusted) || Currency+0.00;
                        let totalAmountInc = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[t].fields.TotalInc) || Currency+0.00;
                        sumTotalCharge = sumTotalCharge + data.ttimesheet[t].fields.Total;
                        sumSumHour = sumSumHour + data.ttimesheet[t].fields.Hours;
                        sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[t].fields.LabourCost;
                        let hoursFormatted = templateObject.timeFormat(data.ttimesheet[t].fields.Hours) || '';
                        if((data.ttimesheet[t].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[t].fields.EndTime.replace(/\s/g, '') == '')){
                          hourlyRate = Currency+0.00;
                        }
                        if((data.ttimesheet[t].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[t].fields.EndTime.replace(/\s/g, '') == '')){
                          hoursFormatted = '00:00';
                        }
                        var dataList = {
                            id: data.ttimesheet[t].fields.ID || '',
                            employee: data.ttimesheet[t].fields.EmployeeName || '',
                            hourlyrate: hourlyRate,
                            hours: data.ttimesheet[t].fields.Hours || '',
                            hourFormat: hoursFormatted,
                            job: data.ttimesheet[t].fields.Job || '',
                            labourcost: labourCost,
                            overheadrate: data.ttimesheet[t].fields.OverheadRate || '',
                            sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                            timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                            product: data.ttimesheet[t].fields.ServiceName || '',
                            timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                            timelog: data.ttimesheet[t].fields.Logs || '',
                            isPaused: data.ttimesheet[t].fields.InvoiceNotes || '',
                            status: data.ttimesheet[t].fields.Status || '',
                            totalamountex: totalAmount || Currency+0.00,
                            totaladjusted: totalAdjusted || Currency+0.00,
                            totalamountinc: totalAmountInc || Currency+0.00,
                            overtime: 0,
                            double: 0,
                            status: data.ttimesheet[t].fields.Status || 'Unprocessed',
                            additional: Currency + '0.00',
                            paychecktips: Currency + '0.00',
                            cashtips: Currency + '0.00',
                            startTime: data.ttimesheet[t].fields.StartTime || '',
                            endTime: data.ttimesheet[t].fields.EndTime || '',
                            notes: data.ttimesheet[t].fields.Notes || '',
                            finished: 'Not Processed',
                            color: '#f6c23e'
                        };
                        timeSheetList.push(dataList);
                    }

                }
                clockList = timeSheetList.filter(clkList => {
                    return clkList.employee == Session.get('mySessionEmployee');
                });
                if (clockList.length > 0) {
                    if (clockList[clockList.length - 1].isPaused == "completed") {
                        $('#employeeStatusField').removeClass('statusClockedOn');
                        $('#employeeStatusField').removeClass('statusOnHold');
                        $('#employeeStatusField').addClass('statusClockedOff').text('Clocked Off');
                    } else if (clockList[clockList.length - 1].isPaused == "paused") {
                        $('#employeeStatusField').removeClass('statusClockedOn');
                        $('#employeeStatusField').removeClass('statusClockedOff');
                        $('#employeeStatusField').addClass('statusOnHold').text('On Hold');
                    } else if (clockList[clockList.length - 1].isPaused == "Clocked On" || clockList[clockList.length - 1].isPaused == "") {
                        $('#employeeStatusField').removeClass('statusOnHold');
                        $('#employeeStatusField').removeClass('statusClockedOff');
                        $('#employeeStatusField').addClass('statusClockedOn').text('Clocked On');
                    }

                } else {
                    $('#employeeStatusField').removeClass('statusClockedOn');
                    $('#employeeStatusField').removeClass('statusClockedOff');
                    $('#employeeStatusField').addClass('statusClockedOn').text('Clocked Off');

                }

                $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
                $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate));
                $('.lblSumHour').text(sumSumHour.toFixed(2));
                templateObject.timesheetrecords.set(timeSheetList);
                let url = window.location.href;
                if (url.indexOf('?id') > 1) {
                    url1 = new URL(window.location.href);
                    let timesheetID = url1.searchParams.get("id");
                    let clockList = templateObject.timesheetrecords.get();
                    var clockList = clockList.filter(timesheetInfo => {
                        return timesheetInfo.id == timesheetID
                    });

                    if (clockList.length > 0) {
                        $('#sltJobOne').val("");
                        $('#product-listone').val("");
                        $('#edtProductCost').val(0);
                        $('#updateID').val("");
                        $('#startTime').val("");
                        $('#endTime').val("");
                        $('#txtBookedHoursSpent').val("");
                        $('#startTime').prop('disabled', false);
                        $('#endTime').prop('disabled', false);
                        $('#btnClockOn').prop('disabled', false);
                        $('#btnHoldOne').prop('disabled', false);
                        $('#btnClockOff').prop('disabled', false);
                        $('.processTimesheet').prop('disabled', false);

                        if (clockList[clockList.length - 1].isPaused == "paused") {
                            $('.btnHoldOne').prop('disabled', true);
                        } else {
                            $('.btnHoldOne').prop('disabled', false);
                        }

                        if (clockList[clockList.length - 1].isPaused == "paused") {
                            $(".paused").show();
                            $("#btnHoldOne").prop("disabled", true);
                            $("#btnHoldOne").addClass("mt-32");
                        } else {
                            $(".paused").hide();
                            $("#btnHoldOne").prop("disabled", false);
                            $("#btnHoldOne").removeClass("mt-32");
                        }

                        if (clockList[clockList.length - 1].status == "Processed") {
                            $('.processTimesheet').prop('disabled', true);
                        }

                        if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                            let startTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime || '';
                            let endTime = clockList[clockList.length - 1].timelog[0].fields.EndDatetime || '';
                            let date = clockList[clockList.length - 1].timesheetdate;

                            if (startTime != "") {
                                $('#startTime').val(startTime.split(' ')[1]);
                                $('#dtSODate').val(date);
                                $('#txtBookedHoursSpent').val(templateObject.timeFormat(clockList[clockList.length - 1].hours));
                                $('#txtBookedHoursSpent1').val(clockList[clockList.length - 1].hours);
                                $('#updateID').val(clockList[clockList.length - 1].id);
                                $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                                $('#sltJobOne').val(clockList[clockList.length - 1].job);
                                $('#product-listone').val(clockList[clockList.length - 1].product);
                                $('#edtProductCost').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                $('#startTime').prop('disabled', true);
                                if (clockList[clockList.length - 1].isPaused == "completed") {
                                    $('#endTime').val(endTime.split(' ')[1]);
                                    $('#endTime').prop('disabled', true);
                                    $('#btnClockOn').prop('disabled', true);
                                    $('#btnHoldOne').prop('disabled', true);
                                    $('#btnClockOff').prop('disabled', true);
                                }
                            }
                        } else {
                            let startTime = clockList[clockList.length - 1].timelog.fields.StartDatetime.split(' ')[1];
                            let endTime = clockList[clockList.length - 1].timelog.fields.EndDatetime.split(' ')[1] || '';
                            let date = clockList[clockList.length - 1].timesheetdate;
                            if (startTime != "") {
                                $('#startTime').val(startTime);
                                $('#dtSODate').val(date);
                                $('#txtBookedHoursSpent').val(templateObject.timeFormat(clockList[clockList.length - 1].hours));
                                $('#txtBookedHoursSpent1').val(clockList[clockList.length - 1].hours);
                                $('#updateID').val(clockList[clockList.length - 1].id);
                                $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                                $('#sltJobOne').val(clockList[clockList.length - 1].job);
                                $('#product-listone').val(clockList[clockList.length - 1].product);
                                $('#edtProductCost').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                $('#startTime').prop('disabled', true);
                                if (clockList[clockList.length - 1].isPaused == "completed") {
                                    $('#endTime').val(endTime);
                                    $('#endTime').prop('disabled', true);
                                    $('#btnClockOn').prop('disabled', true);
                                    $('#btnHoldOne').prop('disabled', true);
                                    $('#btnClockOff').prop('disabled', true);
                                }
                            }
                        }

                    }
                    $('#settingsModal').modal('show');

                }
                $('.fullScreenSpin').css('display', 'none');
            }
        }).catch(function (err) {

        });
    }

    templateObject.getAllTimeSheetDataClock();

    templateObject.getEmployees = function () {

        getVS1Data('TEmployee').then(function (dataObject) {

            if (dataObject.length == 0) {
                sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
                    addVS1Data('TEmployee', JSON.stringify(data));
                    let lineItems = [];
                    let lineItemObj = {};
                    for (let i = 0; i < data.temployee.length; i++) {
                        var dataList = {
                            id: data.temployee[i].fields.ID || '',
                            employeeno: data.temployee[i].fields.EmployeeNo || '',
                            employeename: data.temployee[i].fields.EmployeeName || '',
                            firstname: data.temployee[i].fields.FirstName || '',
                            lastname: data.temployee[i].fields.LastName || '',
                            phone: data.temployee[i].fields.Phone || '',
                            mobile: data.temployee[i].fields.Mobile || '',
                            email: data.temployee[i].fields.Email || '',
                            address: data.temployee[i].fields.Street || '',
                            country: data.temployee[i].fields.Country || '',
                            department: data.temployee[i].fields.DefaultClassName || '',
                            custFld1: data.temployee[i].fields.CustFld1 || '',
                            custFld2: data.temployee[i].fields.CustFld2 || '',
                            custFld3: data.temployee[i].fields.CustFld3 || '',
                            custFld4: data.temployee[i].fields.CustFld4 || '',
                            custFld7: data.temployee[i].fields.CustFld7 || '',
                            custFld8: data.temployee[i].fields.CustFld8 || ''
                        };

                        if (data.temployee[i].fields.EmployeeName.replace(/\s/g, '') != '') {
                            employeeList.push(dataList);
                            if (Session.get('mySessionEmployee') == data.temployee[i].fields.EmployeeName) {
                                if (data.temployee[i].fields.CustFld8 == "false") {
                                    templateObject.includeAllProducts.set(false);
                                }
                            }
                        }
                        //}
                    }
                    templateObject.employeerecords.set(employeeList);
                    $('.fullScreenSpin').css('display', 'none');
                }).catch(function (err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.temployee;

                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < useData.length; i++) {
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        employeeno: useData[i].fields.EmployeeNo || '',
                        employeename: useData[i].fields.EmployeeName || '',
                        firstname: useData[i].fields.FirstName || '',
                        lastname: useData[i].fields.LastName || '',
                        phone: useData[i].fields.Phone || '',
                        mobile: useData[i].fields.Mobile || '',
                        email: useData[i].fields.Email || '',
                        address: useData[i].fields.Street || '',
                        country: useData[i].fields.Country || '',
                        department: useData[i].fields.DefaultClassName || '',
                        custFld1: useData[i].fields.CustFld1 || '',
                        custFld2: useData[i].fields.CustFld2 || '',
                        custFld3: useData[i].fields.CustFld3 || '',
                        custFld4: useData[i].fields.CustFld4 || '',
                        custFld7: useData[i].fields.CustFld7 || '',
                        custFld8: useData[i].fields.CustFld8 || ''
                    };

                    if (useData[i].fields.EmployeeName.replace(/\s/g, '') != '') {
                        employeeList.push(dataList);
                        if (Session.get('mySessionEmployee') == useData[i].fields.EmployeeName) {
                            if (useData[i].fields.CustFld8 == "false") {
                                templateObject.includeAllProducts.set(false);
                            }
                        }
                    }
                    //}
                }
                templateObject.employeerecords.set(employeeList);
                $('.fullScreenSpin').css('display', 'none');
            }
        }).catch(function (err) {
            sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
                addVS1Data('TEmployee', JSON.stringify(data));
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.temployee.length; i++) {
                    var dataList = {
                        id: data.temployee[i].fields.ID || '',
                        employeeno: data.temployee[i].fields.EmployeeNo || '',
                        employeename: data.temployee[i].fields.EmployeeName || '',
                        firstname: data.temployee[i].fields.FirstName || '',
                        lastname: data.temployee[i].fields.LastName || '',
                        phone: data.temployee[i].fields.Phone || '',
                        mobile: data.temployee[i].fields.Mobile || '',
                        email: data.temployee[i].fields.Email || '',
                        address: data.temployee[i].fields.Street || '',
                        country: data.temployee[i].fields.Country || '',
                        department: data.temployee[i].fields.DefaultClassName || '',
                        custFld1: data.temployee[i].fields.CustFld1 || '',
                        custFld2: data.temployee[i].fields.CustFld2 || '',
                        custFld3: data.temployee[i].fields.CustFld3 || '',
                        custFld4: data.temployee[i].fields.CustFld4 || '',
                        custFld7: data.temployee[i].fields.CustFld7 || '',
                        custFld8: data.temployee[i].fields.CustFld8 || ''
                    };

                    if (data.temployee[i].fields.EmployeeName.replace(/\s/g, '') != '') {
                        employeeList.push(dataList);
                        if (Session.get('mySessionEmployee') == data.temployee[i].fields.EmployeeName) {
                            if (data.temployee[i].fields.CustFld8 == "false") {
                                templateObject.includeAllProducts.set(false);
                            }
                        }
                    }
                    //}
                }
                templateObject.employeerecords.set(employeeList);
                $('.fullScreenSpin').css('display', 'none');

            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        });

    }

    templateObject.getEmployees();
    templateObject.getJobs = function () {
        getVS1Data('TJobVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                contactService.getAllJobsNameData().then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};

                    for (let i = 0; i < data.tjobvs1.length; i++) {
                        var dataListJobs = {
                            id: data.tjobvs1[i].Id || '',
                            jobname: data.tjobvs1[i].ClientName || '',
                            // employeename:data.tjobvs1[i].EmployeeName || '',

                        };

                        if (data.tjobvs1[i].ClientName.replace(/\s/g, '') != '') {
                          //$('#sltJobOne').editableSelect('add', data.tjobvs1[i].ClientName);
                            jobsList.push(dataListJobs);
                        }
                        //}
                    }

                    templateObject.jobsrecords.set(jobsList);

                }).catch(function (err) {
                    // $('.fullScreenSpin').css('display', 'none');
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tjobvs1;
                for (let i = 0; i < useData.length; i++) {
                    var dataListJobs = {
                        id: useData[i].fields.ID || '',
                        jobname: useData[i].fields.ClientName || '',
                        // employeename:data.tjobvs1[i].EmployeeName || '',

                    };

                    if (useData[i].fields.ClientName.replace(/\s/g, '') != '') {
                      //$('#sltJobOne').editableSelect('add', useData[i].fields.ClientName);
                        jobsList.push(dataListJobs);
                    }
                    //}
                }
                templateObject.jobsrecords.set(jobsList);
            }
        }).catch(function (err) {
          contactService.getAllJobsNameData().then(function (data) {
              let lineItems = [];
              let lineItemObj = {};

              for (let i = 0; i < data.tjobvs1.length; i++) {
                  var dataListJobs = {
                      id: data.tjobvs1[i].Id || '',
                      jobname: data.tjobvs1[i].ClientName || '',
                      // employeename:data.tjobvs1[i].EmployeeName || '',

                  };

                  if (data.tjobvs1[i].ClientName.replace(/\s/g, '') != '') {
                    //$('#sltJobOne').editableSelect('add', data.tjobvs1[i].ClientName);
                      jobsList.push(dataListJobs);
                  }
                  //}
              }

              templateObject.jobsrecords.set(jobsList);

          }).catch(function (err) {
              // $('.fullScreenSpin').css('display', 'none');
          });
        });

    }

    templateObject.getJobs();

    templateObject.getAllProductData = function () {
        productList = [];
        templateObject.productsdatatablerecords.set([]);
        var splashArrayProductServiceList = new Array();
        //$('#product-listone').editableSelect('clear');
        getVS1Data('TProductWeb').then(function (dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getProductServiceListVS1(initialBaseDataLoad,0).then(function (data) {
                    addVS1Data('TProductWeb',JSON.stringify(data));
                    var dataList = {};
                    for (let i = 0; i < data.tproductvs1.length; i++) {
                        dataList = {
                            id: data.tproductvs1[i].fields.ID || '',
                            productname: data.tproductvs1[i].fields.ProductName || '',
                            productcost: data.tproductvs1[i].fields.BuyQty1Cost || ''
                        }

                        var prodservicedataList = [
                             '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;margin-right: -6px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tproductvs1[i].fields.ID+'"></label></div>',
                            data.tproductvs1[i].fields.ProductName || '-',
                            data.tproductvs1[i].fields.SalesDescription || '',
                            data.tproductvs1[i].fields.BARCODE || '',
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                            data.tproductvs1[i].fields.TotalQtyInStock,
                            data.tproductvs1[i].fields.TaxCodeSales || '',
                            data.tproductvs1[i].fields.ID || '',
                            JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,

                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1PriceInc * 100) / 100)
                        ];

                        splashArrayProductServiceList.push(prodservicedataList);


                            productList.push(dataList);
                      //  }

                    }

                    if (splashArrayProductServiceList) {
                      templateObject.allnoninvproducts.set(splashArrayProductServiceList);
                      $('#tblInventoryPayrollService').dataTable({
                          data: splashArrayProductServiceList,

                          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                          columnDefs: [
                              {
                                  className: "chkBox pointer hiddenColumn",
                                  "orderable": false,
                                  "targets": [0]

                              },
                              {
                                  className: "productName",
                                  "targets": [1]
                              }, {
                                  className: "productDesc",
                                  "targets": [2]
                              }, {
                                  className: "colBarcode",
                                  "targets": [3]
                              }, {
                                  className: "costPrice text-right",
                                  "targets": [4]
                              }, {
                                  className: "salePrice text-right",
                                  "targets": [5]
                              }, {
                                  className: "prdqty text-right",
                                  "targets": [6]
                              }, {
                                  className: "taxrate",
                                  "targets": [7]
                              }, {
                                  className: "colProuctPOPID hiddenColumn",
                                  "targets": [8]
                              }, {
                                  className: "colExtraSellPrice hiddenColumn",
                                  "targets": [9]
                              }, {
                                  className: "salePriceInc hiddenColumn",
                                  "targets": [10]
                              }
                          ],
                          select: true,
                          destroy: true,
                          colReorder: true,
                          pageLength: initialDatatableLoad,
                          lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                          info: true,
                          responsive: true,
                          "order": [[ 1, "asc" ]],
                          "fnDrawCallback": function (oSettings) {
                              $('.paginate_button.page-item').removeClass('disabled');
                              $('#tblInventoryPayrollService_ellipsis').addClass('disabled');

                              if (oSettings._iDisplayLength == -1) {
                                  if (oSettings.fnRecordsDisplay() > 150) {

                                  }
                              } else {

                              }
                              if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                                  $('.paginate_button.page-item.next').addClass('disabled');
                              }

                              $('.paginate_button.next:not(.disabled)', this.api().table().container())
                                  .on('click', function () {
                                      $('.fullScreenSpin').css('display', 'inline-block');
                                      let dataLenght = oSettings._iDisplayLength;
                                      let customerSearch = $('#tblInventoryPayrollService_filter input').val();

                                      sideBarService.getProductServiceListVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                        for(let i=0; i<dataObjectnew.tproductvs1.length; i++){

                                           var dataListDupp = [
                                             '<div class="custom-control custom-checkbox chkBox pointer" style="width:15px;margin-right: -6px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tproductvs1[i].fields.ID+'"></label></div>',
                                             data.tproductvs1[i].fields.ProductName || '-',
                                             data.tproductvs1[i].fields.SalesDescription || '',
                                             utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                                             utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                                             data.tproductvs1[i].fields.TotalQtyInStock,
                                             data.tproductvs1[i].fields.TaxCodeSales || '',
                                             data.tproductvs1[i].fields.ID || '',
                                             JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,
                                             data.tproductvs1[i].fields.BARCODE || ''
                                         ];
                                         splashArrayProductServiceList.push(dataListDupp);

                                        }

                                                  let uniqueChars = [...new Set(splashArrayProductServiceList)];
                                                  var datatable = $('#tblInventoryPayrollService').DataTable();
                                                  datatable.clear();
                                                  datatable.rows.add(uniqueChars);
                                                  datatable.draw(false);
                                                  setTimeout(function () {
                                                    $("#tblInventoryPayrollService").dataTable().fnPageChange('last');
                                                  }, 400);

                                                  $('.fullScreenSpin').css('display', 'none');


                                      }).catch(function (err) {
                                          $('.fullScreenSpin').css('display', 'none');
                                      });

                                  });
                          },
                          "fnInitComplete": function () {
                              $("<a class='btn btn-primary scanProdServiceBarcodePOP' href='' id='scanProdServiceBarcodePOP' role='button' style='margin-left: 8px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>").insertAfter("#tblInventoryPayrollService_filter");
                              $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblInventoryPayrollService_filter");
                              $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventoryPayrollService_filter");
                          }


                      }).on('length.dt', function (e, settings, len) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        let dataLenght = settings._iDisplayLength;
                        // splashArrayProductList = [];
                        if (dataLenght == -1) {
                          $('.fullScreenSpin').css('display', 'none');
                        }else{
                          if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                              $('.fullScreenSpin').css('display', 'none');
                          } else {

                              $('.fullScreenSpin').css('display', 'none');
                          }

                        }

                      });

                        $('div.dataTables_filter input').addClass('form-control form-control-sm');

                    }

                    templateObject.productsdatatablerecords.set(productList);

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tproductvs1;
                var dataList = {};
                for (let i = 0; i < useData.length; i++) {
                    dataList = {
                        id: useData[i].fields.ID || '',
                        productname: useData[i].fields.ProductName || '',
                        productcost: useData[i].fields.BuyQty1Cost || ''
                    };

                    var prodservicedataList = [
                         '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;margin-right: -6px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tproductvs1[i].fields.ID+'"></label></div>',
                        data.tproductvs1[i].fields.ProductName || '-',
                        data.tproductvs1[i].fields.SalesDescription || '',
                        data.tproductvs1[i].fields.BARCODE || '',
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                        data.tproductvs1[i].fields.TotalQtyInStock,
                        data.tproductvs1[i].fields.TaxCodeSales || '',
                        data.tproductvs1[i].fields.ID || '',
                        JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,

                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1PriceInc * 100) / 100)
                    ];

                    splashArrayProductServiceList.push(prodservicedataList);

                    //if (useData[i].fields.ProductType != 'INV') {
                        productList.push(dataList);
                    //}
                }

                if (splashArrayProductServiceList) {
                  templateObject.allnoninvproducts.set(splashArrayProductServiceList);
                  $('#tblInventoryPayrollService').dataTable({
                      data: splashArrayProductServiceList,

                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                      columnDefs: [
                          {
                              className: "chkBox pointer hiddenColumn",
                              "orderable": false,
                              "targets": [0]

                          },
                          {
                              className: "productName",
                              "targets": [1]
                          }, {
                              className: "productDesc",
                              "targets": [2]
                          }, {
                              className: "colBarcode",
                              "targets": [3]
                          }, {
                              className: "costPrice text-right",
                              "targets": [4]
                          }, {
                              className: "salePrice text-right",
                              "targets": [5]
                          }, {
                              className: "prdqty text-right",
                              "targets": [6]
                          }, {
                              className: "taxrate",
                              "targets": [7]
                          }, {
                              className: "colProuctPOPID hiddenColumn",
                              "targets": [8]
                          }, {
                              className: "colExtraSellPrice hiddenColumn",
                              "targets": [9]
                          }, {
                              className: "salePriceInc hiddenColumn",
                              "targets": [10]
                          }
                      ],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      pageLength: initialDatatableLoad,
                      lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                      info: true,
                      responsive: true,
                      "order": [[ 1, "asc" ]],
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblInventoryPayrollService_ellipsis').addClass('disabled');

                          if (oSettings._iDisplayLength == -1) {
                              if (oSettings.fnRecordsDisplay() > 150) {

                              }
                          } else {

                          }
                          if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }

                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                              .on('click', function () {
                                  $('.fullScreenSpin').css('display', 'inline-block');
                                  let dataLenght = oSettings._iDisplayLength;
                                  let customerSearch = $('#tblInventoryPayrollService_filter input').val();

                                  sideBarService.getProductServiceListVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                    for(let i=0; i<dataObjectnew.tproductvs1.length; i++){

                                       var dataListDupp = [
                                         '<div class="custom-control custom-checkbox chkBox pointer" style="width:15px;margin-right: -6px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tproductvs1[i].fields.ID+'"></label></div>',
                                         data.tproductvs1[i].fields.ProductName || '-',
                                         data.tproductvs1[i].fields.SalesDescription || '',
                                         utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                                         utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                                         data.tproductvs1[i].fields.TotalQtyInStock,
                                         data.tproductvs1[i].fields.TaxCodeSales || '',
                                         data.tproductvs1[i].fields.ID || '',
                                         JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,
                                         data.tproductvs1[i].fields.BARCODE || ''
                                     ];
                                     splashArrayProductServiceList.push(dataListDupp);

                                    }

                                              let uniqueChars = [...new Set(splashArrayProductServiceList)];
                                              var datatable = $('#tblInventoryPayrollService').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblInventoryPayrollService").dataTable().fnPageChange('last');
                                              }, 400);

                                              $('.fullScreenSpin').css('display', 'none');


                                  }).catch(function (err) {
                                      $('.fullScreenSpin').css('display', 'none');
                                  });

                              });
                      },
                      "fnInitComplete": function () {
                          $("<a class='btn btn-primary scanProdServiceBarcodePOP' href='' id='scanProdServiceBarcodePOP' role='button' style='margin-left: 8px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>").insertAfter("#tblInventoryPayrollService_filter");
                          $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblInventoryPayrollService_filter");
                          $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventoryPayrollService_filter");
                      }


                  }).on('length.dt', function (e, settings, len) {
                    $('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    // splashArrayProductList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');
                    }else{
                      if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                          $('.fullScreenSpin').css('display', 'none');
                      } else {

                          $('.fullScreenSpin').css('display', 'none');
                      }

                    }

                  });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');

                }
                templateObject.productsdatatablerecords.set(productList);

            }
        }).catch(function (err) {
          sideBarService.getProductServiceListVS1(initialBaseDataLoad,0).then(function (data) {
              addVS1Data('TProductWeb',JSON.stringify(data));
              var dataList = {};
              for (let i = 0; i < data.tproductvs1.length; i++) {
                  dataList = {
                      id: data.tproductvs1[i].fields.ID || '',
                      productname: data.tproductvs1[i].fields.ProductName || '',
                      productcost: data.tproductvs1[i].fields.BuyQty1Cost || ''
                  }

                  var prodservicedataList = [
                       '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;margin-right: -6px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tproductvs1[i].fields.ID+'"></label></div>',
                      data.tproductvs1[i].fields.ProductName || '-',
                      data.tproductvs1[i].fields.SalesDescription || '',
                      data.tproductvs1[i].fields.BARCODE || '',
                      utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                      utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                      data.tproductvs1[i].fields.TotalQtyInStock,
                      data.tproductvs1[i].fields.TaxCodeSales || '',
                      data.tproductvs1[i].fields.ID || '',
                      JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,

                      utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1PriceInc * 100) / 100)
                  ];

                  splashArrayProductServiceList.push(prodservicedataList);


                      productList.push(dataList);
                //  }

              }

              if (splashArrayProductServiceList) {
                templateObject.allnoninvproducts.set(splashArrayProductServiceList);
                $('#tblInventoryPayrollService').dataTable({
                    data: splashArrayProductServiceList,

                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                    columnDefs: [
                        {
                            className: "chkBox pointer hiddenColumn",
                            "orderable": false,
                            "targets": [0]

                        },
                        {
                            className: "productName",
                            "targets": [1]
                        }, {
                            className: "productDesc",
                            "targets": [2]
                        }, {
                            className: "colBarcode",
                            "targets": [3]
                        }, {
                            className: "costPrice text-right",
                            "targets": [4]
                        }, {
                            className: "salePrice text-right",
                            "targets": [5]
                        }, {
                            className: "prdqty text-right",
                            "targets": [6]
                        }, {
                            className: "taxrate",
                            "targets": [7]
                        }, {
                            className: "colProuctPOPID hiddenColumn",
                            "targets": [8]
                        }, {
                            className: "colExtraSellPrice hiddenColumn",
                            "targets": [9]
                        }, {
                            className: "salePriceInc hiddenColumn",
                            "targets": [10]
                        }
                    ],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    pageLength: initialDatatableLoad,
                    lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                    info: true,
                    responsive: true,
                    "order": [[ 1, "asc" ]],
                    "fnDrawCallback": function (oSettings) {
                        $('.paginate_button.page-item').removeClass('disabled');
                        $('#tblInventoryPayrollService_ellipsis').addClass('disabled');

                        if (oSettings._iDisplayLength == -1) {
                            if (oSettings.fnRecordsDisplay() > 150) {

                            }
                        } else {

                        }
                        if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                            $('.paginate_button.page-item.next').addClass('disabled');
                        }

                        $('.paginate_button.next:not(.disabled)', this.api().table().container())
                            .on('click', function () {
                                $('.fullScreenSpin').css('display', 'inline-block');
                                let dataLenght = oSettings._iDisplayLength;
                                let customerSearch = $('#tblInventoryPayrollService_filter input').val();

                                sideBarService.getProductServiceListVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                  for(let i=0; i<dataObjectnew.tproductvs1.length; i++){

                                     var dataListDupp = [
                                       '<div class="custom-control custom-checkbox chkBox pointer" style="width:15px;margin-right: -6px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tproductvs1[i].fields.ID+'"></label></div>',
                                       data.tproductvs1[i].fields.ProductName || '-',
                                       data.tproductvs1[i].fields.SalesDescription || '',
                                       utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                                       utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                                       data.tproductvs1[i].fields.TotalQtyInStock,
                                       data.tproductvs1[i].fields.TaxCodeSales || '',
                                       data.tproductvs1[i].fields.ID || '',
                                       JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,
                                       data.tproductvs1[i].fields.BARCODE || ''
                                   ];
                                   splashArrayProductServiceList.push(dataListDupp);

                                  }

                                            let uniqueChars = [...new Set(splashArrayProductServiceList)];
                                            var datatable = $('#tblInventoryPayrollService').DataTable();
                                            datatable.clear();
                                            datatable.rows.add(uniqueChars);
                                            datatable.draw(false);
                                            setTimeout(function () {
                                              $("#tblInventoryPayrollService").dataTable().fnPageChange('last');
                                            }, 400);

                                            $('.fullScreenSpin').css('display', 'none');


                                }).catch(function (err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });

                            });
                    },
                    "fnInitComplete": function () {
                        $("<a class='btn btn-primary scanProdServiceBarcodePOP' href='' id='scanProdServiceBarcodePOP' role='button' style='margin-left: 8px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>").insertAfter("#tblInventoryPayrollService_filter");
                        $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblInventoryPayrollService_filter");
                        $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventoryPayrollService_filter");
                    }


                }).on('length.dt', function (e, settings, len) {
                  $('.fullScreenSpin').css('display', 'inline-block');
                  let dataLenght = settings._iDisplayLength;
                  // splashArrayProductList = [];
                  if (dataLenght == -1) {
                    $('.fullScreenSpin').css('display', 'none');
                  }else{
                    if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                        $('.fullScreenSpin').css('display', 'none');
                    } else {

                        $('.fullScreenSpin').css('display', 'none');
                    }

                  }

                });

                  $('div.dataTables_filter input').addClass('form-control form-control-sm');

              }

              templateObject.productsdatatablerecords.set(productList);

          });
        });

    }

    templateObject.getAllSelectedProducts = function (employeeID) {
        let productlist = [];
        templateObject.productsdatatablerecords.set([]);
        var splashArrayProductServiceList = new Array();
        var splashArrayProductServiceListGet = [];
        //$('#product-listone').editableSelect('clear');
        sideBarService.getSelectedProducts(employeeID).then(function (data) {
            var dataList = {};
            let getallinvproducts = templateObject.allnoninvproducts.get();
            if (data.trepservices.length > 0) {
                for (let i = 0; i < data.trepservices.length; i++) {
                    dataList = {
                        id: data.trepservices[i].Id || '',
                        productname: data.trepservices[i].ServiceDesc || '',
                        productcost: data.trepservices[i].Rate || Currency+0.00

                    };
                    // $('#product-listone').editableSelect('add', function(){
                    //   $(this).text(data.trepservices[i].ServiceDesc);
                    //   $(this).attr('id', data.trepservices[i].Rate);
                    // });

                    let checkServiceArray = getallinvproducts.filter(function(prodData){
                      if(prodData[1] === data.trepservices[i].ServiceDesc){
                      var prodservicedataList = [
                          prodData[0],
                          prodData[1] || '-',
                          prodData[2] || '',
                          prodData[3] || '',
                          prodData[4],
                          prodData[5],
                          prodData[6],
                          prodData[7] || '',
                          prodData[8] || '',
                          prodData[9]||null,
                          prodData[10]
                      ];
                        splashArrayProductServiceListGet.push(prodservicedataList);
                      //splashArrayProductServiceListGet.push(prodservicedataList);
                      return prodservicedataList||'';
                    };
                    })||'';

                    productlist.push(dataList);

                }
                if (splashArrayProductServiceListGet) {
                    let uniqueChars = [...new Set(splashArrayProductServiceListGet)];
                    var datatable = $('#tblInventoryPayrollService').DataTable();
                    datatable.clear();
                    datatable.rows.add(uniqueChars);
                    datatable.draw(false);

                }
                templateObject.productsdatatablerecords.set(productlist);
            } else {
                templateObject.getAllProductData();
            }

        }).catch(function (err) {
            templateObject.getAllProductData();
        });
    }

    setTimeout(function () {
        templateObject.getAllProductData();
    }, 500);

    $(document).ready(function () {
      $('#sltJobOne').editableSelect();
      $('#product-listone').editableSelect();
        //$('#tblTimeSheet tbody').on('click', 'tr td:not(:first-child)', function (event) {
        $('#tblTimeSheet tbody').on('click', 'tr .colName, tr .colDate, tr .colJob, tr .colProduct, tr .colRegHours, tr .colNotes, tr .colStatus', async function () {
            event.preventDefault();
            // templateObject.getAllProductData();
            if (canClockOnClockOff == true) {
              //$('.fullScreenSpin').css('display', 'inline-block');
                var curretDate = moment().format('DD/MM/YYYY');
                let productCheck = templateObject.productsdatatablerecords.get();
                productCheck = productCheck.filter(pdctList => {
                    return pdctList.productname == $(event.target).closest("tr").find('.colProduct').text();
                });
                if (productCheck.length > 0) {
                    $('#product-listone').val($(event.target).closest("tr").find('.colProduct').text());
                } else {
                    $('#product-listone').val($(event.target).closest("tr").find('.colProduct').text());
                }

                $('#txtBookedHoursSpent').val("")
                $('#txtBookedHoursSpent1').val("");
                $('#employee_name').val($(event.target).closest("tr").find('.colName').text());
                $('#sltJobOne').val($(event.target).closest("tr").find('.colJob').text());

                $('#product-listone').val($(event.target).closest("tr").find('.colProduct').text());
                $('#edtProductCost').val($(event.target).closest("tr").find('.hourlyrate').text() || 0);

                let prodLineData = $(event.target).closest("tr").find('.colProduct').text() || '';
                let prodLineCost = $(event.target).closest("tr").find('.colProduct').text() || '';
                // $('#product-listone').append('<option value="' + prodLineData + '" selected="selected" id="' +prodLineData +'">' + prodLineData + '</option>');

                $('#txtNotesOne').val($(event.target).closest("tr").find('.colNotes').text());
                $('#updateID').val($(event.target).closest("tr").find('.colID').text());
                $('#timesheetID').text($(event.target).closest("tr").find('.colID').text());
                $('#txtBookedHoursSpent').val($(event.target).closest("tr").find('.colRegHoursOne').val())
                $('#txtBookedHoursSpent1').val($(event.target).closest("tr").find('.colRegHours ').text());
                $('#endTime').val(""); ;
                $('#startTime').prop('disabled', false);
                $('#endTime').prop('disabled', false);
                $('#btnClockOn').prop('disabled', false);
                $('#btnHoldOne').prop('disabled', false);
                $('#btnClockOff').prop('disabled', false);
                $('.processTimesheet').prop('disabled', false);
                $('#txtBookedHoursSpent').prop('disabled', false);
                $('#startTime').val("");
                $('#dtSODate').val("");
                $('#txtNotesOne').val("");
                $('#hourly_rate').val("");
                let clockList = templateObject.timesheetrecords.get();
                clockList = clockList.filter(clkList => {
                    return clkList.employee == $('#employee_name').val() && clkList.id == $('#updateID').val();
                });
                if (clockList.length > 0) {
                    if (clockList[clockList.length - 1].isPaused == "paused") {
                        $('.btnHoldOne').prop('disabled', true);
                    } else {
                        $('.btnHoldOne').prop('disabled', false);
                    }

                    if (clockList[clockList.length - 1].isPaused == "paused") {
                        $(".paused").show();
                        $("#btnHoldOne").prop("disabled", true);
                        $("#btnHoldOne").addClass("mt-32");
                    } else {
                        $(".paused").hide();
                        $("#btnHoldOne").prop("disabled", false);
                        $("#btnHoldOne").removeClass("mt-32");
                    }

                    if (clockList[clockList.length - 1].status == "Processed") {
                        $('.processTimesheet').prop('disabled', true);
                    }

                    if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                        let startTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime.split(' ')[1] || '';
                        let endTime = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.EndDatetime.split(' ')[1] || '';
                        let date = clockList[clockList.length - 1].timesheetdate;
                        if (startTime != "") {
                            $('#startTime').val(startTime);
                            $('#dtSODate').val(date);
                            $('#updateID').val(clockList[clockList.length - 1].id);
                            $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                            $('#sltJobOne').val(clockList[clockList.length - 1].job);
                            //$('#product-listone').val(clockList[clockList.length - 1].product);
                            $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                            $('#edtProductCost').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                            $('#startTime').prop('disabled', true);
                            if (clockList[clockList.length - 1].isPaused == "completed") {
                                $('#endTime').val(endTime);
                                $('#endTime').prop('disabled', true);
                                $('#btnClockOn').prop('disabled', true);
                                $('#btnHoldOne').prop('disabled', true);
                                $('#btnClockOff').prop('disabled', true);
                                $('#txtBookedHoursSpent').prop('disabled', true);
                            }
                        }

                    } else {
                        let startTime = clockList[clockList.length - 1].timelog.fields.StartDatetime.split(' ')[1] || '';
                        let endTime = clockList[clockList.length - 1].timelog.fields.EndDatetime.split(' ')[1] || '';
                        let date = clockList[clockList.length - 1].timesheetdate;
                        $('#startTime').val(startTime);
                        $('#dtSODate').val(date);
                        $('#updateID').val(clockList[clockList.length - 1].id);
                        $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                        $('#sltJobOne').val(clockList[clockList.length - 1].job);
                        //$('#product-listone').val(clockList[clockList.length - 1].product);
                        $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                        $('#edtProductCost').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                        $('#startTime').prop('disabled', true);
                        if (clockList[clockList.length - 1].isPaused == "completed") {
                            $('#endTime').val(startTime);
                            $('#endTime').prop('disabled', true);
                            $('#btnClockOn').prop('disabled', true);
                            $('#btnHoldOne').prop('disabled', true);
                            $('#btnClockOff').prop('disabled', true);
                            $('#txtBookedHoursSpent').prop('disabled', true);
                        }
                    }
                } else {
                    $(".paused").hide();
                    $("#btnHoldOne").prop("disabled", false);
                }
                $('#settingsModal').modal('show');
                let getEmpIDFromLine = $(event.target).closest("tr").find('.colName ').text() || '';
                if(getEmpIDFromLine != ''){
                  let checkEmpTimeSettings = await contactService.getCheckTimeEmployeeSettingByName(getEmpIDFromLine) || '';
                  if(checkEmpTimeSettings != ''){
                    if(checkEmpTimeSettings.temployee[0].CustFld8 == 'false'){
                      templateObject.getAllSelectedProducts(checkEmpTimeSettings.temployee[0].Id);
                    }else{
                      templateObject.getAllProductData();
                    }
                    setTimeout(function () {
                        $('#product-listone').val(clockList[clockList.length - 1].product);
                        //$('.fullScreenSpin').css('display', 'none');
                    }, 500);
                    //$('.fullScreenSpin').css('display', 'none');
                    //$('#settingsModal').modal('show');
                  }else{
                    setTimeout(function () {
                        $('#product-listone').val(clockList[clockList.length - 1].product);
                        //$('.fullScreenSpin').css('display', 'none');
                    }, 500);
                    //$('.fullScreenSpin').css('display', 'none');
                    //$('#settingsModal').modal('show');
                  }
                }else{
                  setTimeout(function () {
                      $('#product-listone').val(clockList[clockList.length - 1].product);
                      //$('.fullScreenSpin').css('display', 'none');
                  }, 500);
                  //$('.fullScreenSpin').css('display', 'none');

                }

            }
        });

                });

                $('#product-listone').editableSelect()
                .on('click.editable-select', function(e, li) {
                        var $earch = $(this);
                        var offset = $earch.offset();
                        var productDataName =  e.target.value || '';
                        //var productDataID = el.context.value || '';
                        // if(el){
                        //   var productCostData = el.context.id || 0;
                        //   $('#edtProductCost').val(productCostData);
                        // }
                        if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
                            $('#productListModal').modal('toggle');
                            setTimeout(function () {
                                $('#tblInventoryPayrollService_filter .form-control-sm').focus();
                                $('#tblInventoryPayrollService_filter .form-control-sm').val('');
                                $('#tblInventoryPayrollService_filter .form-control-sm').trigger("input");

                                var datatable = $('#tblInventoryPayrollService').DataTable();
                                datatable.draw();
                                $('#tblInventoryPayrollService_filter .form-control-sm').trigger("input");

                            }, 500);
                        } else {
                            // var productDataID = $(event.target).attr('prodid').replace(/\s/g, '') || '';
                            if (productDataName.replace(/\s/g, '') != '') {
                                //FlowRouter.go('/productview?prodname=' + $(event.target).text());
                                let lineExtaSellItems = [];
                                let lineExtaSellObj = {};
                                $('.fullScreenSpin').css('display', 'inline-block');
                                getVS1Data('TProductWeb').then(function (dataObject) {
                                    if (dataObject.length == 0) {
                                        sideBarService.getOneProductdatavs1byname(productDataName).then(function (data) {
                                            $('.fullScreenSpin').css('display', 'none');
                                            let lineItems = [];
                                            let lineItemObj = {};
                                            let currencySymbol = Currency;
                                            let totalquantity = 0;
                                            let productname = data.tproduct[0].fields.ProductName || '';
                                            let productcode = data.tproduct[0].fields.PRODUCTCODE || '';
                                            let productprintName = data.tproduct[0].fields.ProductPrintName || '';
                                            let assetaccount = data.tproduct[0].fields.AssetAccount || '';
                                            let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                                            let cogsaccount = data.tproduct[0].fields.CogsAccount || '';
                                            let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || '';
                                            let purchasedescription = data.tproduct[0].fields.PurchaseDescription || '';
                                            let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                                            let incomeaccount = data.tproduct[0].fields.IncomeAccount || '';
                                            let taxcodesales = data.tproduct[0].fields.TaxCodeSales || '';
                                            let salesdescription = data.tproduct[0].fields.SalesDescription || '';
                                            let active = data.tproduct[0].fields.Active;
                                            let lockextrasell = data.tproduct[0].fields.LockExtraSell || '';
                                            let customfield1 = data.tproduct[0].fields.CUSTFLD1 || '';
                                            let customfield2 = data.tproduct[0].fields.CUSTFLD2 || '';
                                            let barcode = data.tproduct[0].fields.BARCODE || '';
                                            $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                                            $('#add-product-title').text('Edit Product');
                                            $('#edtproductname').val(productname);
                                            $('#edtsellqty1price').val(sellqty1price);
                                            $('#txasalesdescription').val(salesdescription);
                                            $('#sltsalesacount').val(incomeaccount);
                                            $('#slttaxcodesales').val(taxcodesales);
                                            $('#edtbarcode').val(barcode);
                                            $('#txapurchasedescription').val(purchasedescription);
                                            $('#sltcogsaccount').val(cogsaccount);
                                            $('#slttaxcodepurchase').val(taxcodepurchase);
                                            $('#edtbuyqty1cost').val(buyqty1cost);

                                            setTimeout(function () {
                                                $('#newProductModal').modal('show');
                                            }, 500);
                                        }).catch(function (err) {

                                            $('.fullScreenSpin').css('display', 'none');
                                        });
                                    } else {
                                        let data = JSON.parse(dataObject[0].data);
                                        let useData = data.tproductvs1;
                                        var added = false;

                                        for (let i = 0; i < data.tproductvs1.length; i++) {
                                            if (data.tproductvs1[i].fields.ProductName === productDataName) {
                                                added = true;
                                                $('.fullScreenSpin').css('display', 'none');
                                                let lineItems = [];
                                                let lineItemObj = {};
                                                let currencySymbol = Currency;
                                                let totalquantity = 0;

                                                let productname = data.tproductvs1[i].fields.ProductName || '';
                                                let productcode = data.tproductvs1[i].fields.PRODUCTCODE || '';
                                                let productprintName = data.tproductvs1[i].fields.ProductPrintName || '';
                                                let assetaccount = data.tproductvs1[i].fields.AssetAccount || '';
                                                let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.BuyQty1Cost) || 0;
                                                let cogsaccount = data.tproductvs1[i].fields.CogsAccount || '';
                                                let taxcodepurchase = data.tproductvs1[i].fields.TaxCodePurchase || '';
                                                let purchasedescription = data.tproductvs1[i].fields.PurchaseDescription || '';
                                                let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.SellQty1Price) || 0;
                                                let incomeaccount = data.tproductvs1[i].fields.IncomeAccount || '';
                                                let taxcodesales = data.tproductvs1[i].fields.TaxCodeSales || '';
                                                let salesdescription = data.tproductvs1[i].fields.SalesDescription || '';
                                                let active = data.tproductvs1[i].fields.Active;
                                                let lockextrasell = data.tproductvs1[i].fields.LockExtraSell || '';
                                                let customfield1 = data.tproductvs1[i].fields.CUSTFLD1 || '';
                                                let customfield2 = data.tproductvs1[i].fields.CUSTFLD2 || '';
                                                let barcode = data.tproductvs1[i].fields.BARCODE || '';
                                                $("#selectProductID").val(data.tproductvs1[i].fields.ID).trigger("change");
                                                $('#add-product-title').text('Edit Product');
                                                $('#edtproductname').val(productname);
                                                $('#edtsellqty1price').val(sellqty1price);
                                                $('#txasalesdescription').val(salesdescription);
                                                $('#sltsalesacount').val(incomeaccount);
                                                $('#slttaxcodesales').val(taxcodesales);
                                                $('#edtbarcode').val(barcode);
                                                $('#txapurchasedescription').val(purchasedescription);
                                                $('#sltcogsaccount').val(cogsaccount);
                                                $('#slttaxcodepurchase').val(taxcodepurchase);
                                                $('#edtbuyqty1cost').val(buyqty1cost);

                                                setTimeout(function () {
                                                    $('#newProductModal').modal('show');
                                                }, 500);
                                            }
                                        }
                                        if (!added) {
                                            sideBarService.getOneProductdatavs1byname(productDataName).then(function (data) {
                                                $('.fullScreenSpin').css('display', 'none');
                                                let lineItems = [];
                                                let lineItemObj = {};
                                                let currencySymbol = Currency;
                                                let totalquantity = 0;
                                                let productname = data.tproduct[0].fields.ProductName || '';
                                                let productcode = data.tproduct[0].fields.PRODUCTCODE || '';
                                                let productprintName = data.tproduct[0].fields.ProductPrintName || '';
                                                let assetaccount = data.tproduct[0].fields.AssetAccount || '';
                                                let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                                                let cogsaccount = data.tproduct[0].fields.CogsAccount || '';
                                                let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || '';
                                                let purchasedescription = data.tproduct[0].fields.PurchaseDescription || '';
                                                let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                                                let incomeaccount = data.tproduct[0].fields.IncomeAccount || '';
                                                let taxcodesales = data.tproduct[0].fields.TaxCodeSales || '';
                                                let salesdescription = data.tproduct[0].fields.SalesDescription || '';
                                                let active = data.tproduct[0].fields.Active;
                                                let lockextrasell = data.tproduct[0].fields.LockExtraSell || '';
                                                let customfield1 = data.tproduct[0].fields.CUSTFLD1 || '';
                                                let customfield2 = data.tproduct[0].fields.CUSTFLD2 || '';
                                                let barcode = data.tproduct[0].fields.BARCODE || '';
                                                $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                                                $('#add-product-title').text('Edit Product');
                                                $('#edtproductname').val(productname);
                                                $('#edtsellqty1price').val(sellqty1price);
                                                $('#txasalesdescription').val(salesdescription);
                                                $('#sltsalesacount').val(incomeaccount);
                                                $('#slttaxcodesales').val(taxcodesales);
                                                $('#edtbarcode').val(barcode);
                                                $('#txapurchasedescription').val(purchasedescription);
                                                $('#sltcogsaccount').val(cogsaccount);
                                                $('#slttaxcodepurchase').val(taxcodepurchase);
                                                $('#edtbuyqty1cost').val(buyqty1cost);

                                                setTimeout(function () {
                                                    $('#newProductModal').modal('show');
                                                }, 500);
                                            }).catch(function (err) {

                                                $('.fullScreenSpin').css('display', 'none');
                                            });
                                        }
                                    }
                                }).catch(function (err) {

                                    sideBarService.getOneProductdatavs1byname(productDataName).then(function (data) {
                                        $('.fullScreenSpin').css('display', 'none');
                                        let lineItems = [];
                                        let lineItemObj = {};
                                        let currencySymbol = Currency;
                                        let totalquantity = 0;
                                        let productname = data.tproduct[0].fields.ProductName || '';
                                        let productcode = data.tproduct[0].fields.PRODUCTCODE || '';
                                        let productprintName = data.tproduct[0].fields.ProductPrintName || '';
                                        let assetaccount = data.tproduct[0].fields.AssetAccount || '';
                                        let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                                        let cogsaccount = data.tproduct[0].fields.CogsAccount || '';
                                        let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || '';
                                        let purchasedescription = data.tproduct[0].fields.PurchaseDescription || '';
                                        let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                                        let incomeaccount = data.tproduct[0].fields.IncomeAccount || '';
                                        let taxcodesales = data.tproduct[0].fields.TaxCodeSales || '';
                                        let salesdescription = data.tproduct[0].fields.SalesDescription || '';
                                        let active = data.tproduct[0].fields.Active;
                                        let lockextrasell = data.tproduct[0].fields.LockExtraSell || '';
                                        let customfield1 = data.tproduct[0].fields.CUSTFLD1 || '';
                                        let customfield2 = data.tproduct[0].fields.CUSTFLD2 || '';
                                        let barcode = data.tproduct[0].fields.BARCODE || '';
                                        $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                                        $('#add-product-title').text('Edit Product');
                                        $('#edtproductname').val(productname);
                                        $('#edtsellqty1price').val(sellqty1price);
                                        $('#txasalesdescription').val(salesdescription);
                                        $('#sltsalesacount').val(incomeaccount);
                                        $('#slttaxcodesales').val(taxcodesales);
                                        $('#edtbarcode').val(barcode);
                                        $('#txapurchasedescription').val(purchasedescription);
                                        $('#sltcogsaccount').val(cogsaccount);
                                        $('#slttaxcodepurchase').val(taxcodepurchase);
                                        $('#edtbuyqty1cost').val(buyqty1cost);

                                        setTimeout(function () {
                                            $('#newProductModal').modal('show');
                                        }, 500);
                                    }).catch(function (err) {

                                        $('.fullScreenSpin').css('display', 'none');
                                    });

                                });

                                setTimeout(function () {
                                    var begin_day_value = $('#event_begin_day').attr('value');
                                    $("#dtDateTo").datepicker({
                                        showOn: 'button',
                                        buttonText: 'Show Date',
                                        buttonImageOnly: true,
                                        buttonImage: '/img/imgCal2.png',
                                        constrainInput: false,
                                        dateFormat: 'd/mm/yy',
                                        showOtherMonths: true,
                                        selectOtherMonths: true,
                                        changeMonth: true,
                                        changeYear: true,
                                        yearRange: "-90:+10",
                                    }).keyup(function (e) {
                                        if (e.keyCode == 8 || e.keyCode == 46) {
                                            $("#dtDateTo,#dtDateFrom").val('');
                                        }
                                    });

                                    $("#dtDateFrom").datepicker({
                                        showOn: 'button',
                                        buttonText: 'Show Date',
                                        altField: "#dtDateFrom",
                                        buttonImageOnly: true,
                                        buttonImage: '/img/imgCal2.png',
                                        constrainInput: false,
                                        dateFormat: 'd/mm/yy',
                                        showOtherMonths: true,
                                        selectOtherMonths: true,
                                        changeMonth: true,
                                        changeYear: true,
                                        yearRange: "-90:+10",
                                    }).keyup(function (e) {
                                        if (e.keyCode == 8 || e.keyCode == 46) {
                                            $("#dtDateTo,#dtDateFrom").val('');
                                        }
                                    });

                                    $(".ui-datepicker .ui-state-hihglight").removeClass("ui-state-highlight");

                                }, 1000);
                                //}


                                templateObject.getProductClassQtyData = function () {
                                    productService.getOneProductClassQtyData(currentProductID).then(function (data) {
                                        $('.fullScreenSpin').css('display', 'none');
                                        let qtylineItems = [];
                                        let qtylineItemObj = {};
                                        let currencySymbol = Currency;
                                        let totaldeptquantity = 0;

                                        for (let j in data.tproductclassquantity) {
                                            qtylineItemObj = {
                                                department: data.tproductclassquantity[j].DepartmentName || '',
                                                quantity: data.tproductclassquantity[j].InStockQty || 0,
                                            }
                                            totaldeptquantity += data.tproductclassquantity[j].InStockQty;
                                            qtylineItems.push(qtylineItemObj);
                                        }
                                        // $('#edttotalqtyinstock').val(totaldeptquantity);
                                        templateObject.productqtyrecords.set(qtylineItems);
                                        templateObject.totaldeptquantity.set(totaldeptquantity);

                                    }).catch(function (err) {

                                        $('.fullScreenSpin').css('display', 'none');
                                    });

                                }

                                //templateObject.getProductClassQtyData();
                                //templateObject.getProductData();
                            } else {
                                $('#productListModal').modal('toggle');

                                setTimeout(function () {
                                    $('#tblInventoryPayrollService_filter .form-control-sm').focus();
                                    $('#tblInventoryPayrollService_filter .form-control-sm').val('');
                                    $('#tblInventoryPayrollService_filter .form-control-sm').trigger("input");

                                    var datatable = $('#tblInventoryPayrollService').DataTable();
                                    datatable.draw();
                                    $('#tblInventoryPayrollService_filter .form-control-sm').trigger("input");

                                }, 500);
                            }

                        }
                });

      $('#sltJobOne').editableSelect()
      .on('click.editable-select', function (e, li) {
          var $earch = $(this);
          var offset = $earch.offset();
          $('#edtCustomerPOPID').val('');
          //$('#edtCustomerCompany').attr('readonly', false);
          var customerDataName = e.target.value || '';
          if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
              $('#customerListModal').modal();
              setTimeout(function () {
                  $('#tblCustomerlist_filter .form-control-sm').focus();
                  $('#tblCustomerlist_filter .form-control-sm').val('');
                  $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                  var datatable = $('#tblCustomerlist').DataTable();
                  //datatable.clear();
                  //datatable.rows.add(splashArrayCustomerList);
                  datatable.draw();
                  $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                  //$('#tblCustomerlist').dataTable().fnFilter(' ').draw(false);
              }, 500);
          } else {
              if (customerDataName.replace(/\s/g, '') != '') {
                  //FlowRouter.go('/customerscard?name=' + e.target.value);
                  $('#edtCustomerPOPID').val('');
                  getVS1Data('TCustomerVS1').then(function (dataObject) {
                      if (dataObject.length == 0) {
                          $('.fullScreenSpin').css('display', 'inline-block');
                          sideBarService.getOneCustomerDataExByName(customerDataName).then(function (data) {
                              $('.fullScreenSpin').css('display', 'none');
                              let lineItems = [];
                              $('#add-customer-title').text('Edit Customer');
                              let popCustomerID = data.tcustomer[0].fields.ID || '';
                              let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                              let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                              let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                              let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                              let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                              let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                              let popCustomertfn = '' || '';
                              let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                              let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                              let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                              let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                              let popCustomerURL = data.tcustomer[0].fields.URL || '';
                              let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                              let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                              let popCustomerState = data.tcustomer[0].fields.State || '';
                              let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                              let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                              let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                              let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                              let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                              let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                              let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                              let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                              let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                              let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                              let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                              let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                              let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                              let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                              let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                              let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                              let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                              let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                              let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                              let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                              let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                              let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                              //$('#edtCustomerCompany').attr('readonly', true);
                              $('#edtCustomerCompany').val(popCustomerName);
                              $('#edtCustomerPOPID').val(popCustomerID);
                              $('#edtCustomerPOPEmail').val(popCustomerEmail);
                              $('#edtTitle').val(popCustomerTitle);
                              $('#edtFirstName').val(popCustomerFirstName);
                              $('#edtMiddleName').val(popCustomerMiddleName);
                              $('#edtLastName').val(popCustomerLastName);
                              $('#edtCustomerPhone').val(popCustomerPhone);
                              $('#edtCustomerMobile').val(popCustomerMobile);
                              $('#edtCustomerFax').val(popCustomerFaxnumber);
                              $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                              $('#edtCustomerWebsite').val(popCustomerURL);
                              $('#edtCustomerShippingAddress').val(popCustomerStreet);
                              $('#edtCustomerShippingCity').val(popCustomerStreet2);
                              $('#edtCustomerShippingState').val(popCustomerState);
                              $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                              $('#sedtCountry').val(popCustomerCountry);
                              $('#txaNotes').val(popCustomernotes);
                              $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                              $('#sltTermsPOP').val(popCustomerterms);
                              $('#sltCustomerType').val(popCustomerType);
                              $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                              $('#edtCustomeField1').val(popCustomercustfield1);
                              $('#edtCustomeField2').val(popCustomercustfield2);
                              $('#edtCustomeField3').val(popCustomercustfield3);
                              $('#edtCustomeField4').val(popCustomercustfield4);

                              $('#sltTaxCode').val(popCustomerTaxCode);

                              if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                                  (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                                  (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                                  $('#chkSameAsShipping2').attr("checked", "checked");
                              }

                              if (data.tcustomer[0].fields.IsSupplier == true) {
                                  // $('#isformcontractor')
                                  $('#chkSameAsSupplier').attr("checked", "checked");
                              } else {
                                  $('#chkSameAsSupplier').removeAttr("checked");
                              }

                              setTimeout(function () {
                                  $('#addCustomerModal').modal('show');
                              }, 200);
                          }).catch(function (err) {
                              $('.fullScreenSpin').css('display', 'none');
                          });
                      } else {
                          let data = JSON.parse(dataObject[0].data);
                          let useData = data.tcustomervs1;

                          var added = false;
                          for (let i = 0; i < data.tcustomervs1.length; i++) {
                              if (data.tcustomervs1[i].fields.ClientName === customerDataName) {
                                  let lineItems = [];
                                  added = true;
                                  $('.fullScreenSpin').css('display', 'none');
                                  $('#add-customer-title').text('Edit Customer');
                                  let popCustomerID = data.tcustomervs1[i].fields.ID || '';
                                  let popCustomerName = data.tcustomervs1[i].fields.ClientName || '';
                                  let popCustomerEmail = data.tcustomervs1[i].fields.Email || '';
                                  let popCustomerTitle = data.tcustomervs1[i].fields.Title || '';
                                  let popCustomerFirstName = data.tcustomervs1[i].fields.FirstName || '';
                                  let popCustomerMiddleName = data.tcustomervs1[i].fields.CUSTFLD10 || '';
                                  let popCustomerLastName = data.tcustomervs1[i].fields.LastName || '';
                                  let popCustomertfn = '' || '';
                                  let popCustomerPhone = data.tcustomervs1[i].fields.Phone || '';
                                  let popCustomerMobile = data.tcustomervs1[i].fields.Mobile || '';
                                  let popCustomerFaxnumber = data.tcustomervs1[i].fields.Faxnumber || '';
                                  let popCustomerSkypeName = data.tcustomervs1[i].fields.SkypeName || '';
                                  let popCustomerURL = data.tcustomervs1[i].fields.URL || '';
                                  let popCustomerStreet = data.tcustomervs1[i].fields.Street || '';
                                  let popCustomerStreet2 = data.tcustomervs1[i].fields.Street2 || '';
                                  let popCustomerState = data.tcustomervs1[i].fields.State || '';
                                  let popCustomerPostcode = data.tcustomervs1[i].fields.Postcode || '';
                                  let popCustomerCountry = data.tcustomervs1[i].fields.Country || LoggedCountry;
                                  let popCustomerbillingaddress = data.tcustomervs1[i].fields.BillStreet || '';
                                  let popCustomerbcity = data.tcustomervs1[i].fields.BillStreet2 || '';
                                  let popCustomerbstate = data.tcustomervs1[i].fields.BillState || '';
                                  let popCustomerbpostalcode = data.tcustomervs1[i].fields.BillPostcode || '';
                                  let popCustomerbcountry = data.tcustomervs1[i].fields.Billcountry || LoggedCountry;
                                  let popCustomercustfield1 = data.tcustomervs1[i].fields.CUSTFLD1 || '';
                                  let popCustomercustfield2 = data.tcustomervs1[i].fields.CUSTFLD2 || '';
                                  let popCustomercustfield3 = data.tcustomervs1[i].fields.CUSTFLD3 || '';
                                  let popCustomercustfield4 = data.tcustomervs1[i].fields.CUSTFLD4 || '';
                                  let popCustomernotes = data.tcustomervs1[i].fields.Notes || '';
                                  let popCustomerpreferedpayment = data.tcustomervs1[i].fields.PaymentMethodName || '';
                                  let popCustomerterms = data.tcustomervs1[i].fields.TermsName || '';
                                  let popCustomerdeliverymethod = data.tcustomervs1[i].fields.ShippingMethodName || '';
                                  let popCustomeraccountnumber = data.tcustomervs1[i].fields.ClientNo || '';
                                  let popCustomerisContractor = data.tcustomervs1[i].fields.Contractor || false;
                                  let popCustomerissupplier = data.tcustomervs1[i].fields.IsSupplier || false;
                                  let popCustomeriscustomer = data.tcustomervs1[i].fields.IsCustomer || false;
                                  let popCustomerTaxCode = data.tcustomervs1[i].fields.TaxCodeName || '';
                                  let popCustomerDiscount = data.tcustomervs1[i].fields.Discount || 0;
                                  let popCustomerType = data.tcustomervs1[i].fields.ClientTypeName || '';
                                  //$('#edtCustomerCompany').attr('readonly', true);
                                  $('#edtCustomerCompany').val(popCustomerName);
                                  $('#edtCustomerPOPID').val(popCustomerID);
                                  $('#edtCustomerPOPEmail').val(popCustomerEmail);
                                  $('#edtTitle').val(popCustomerTitle);
                                  $('#edtFirstName').val(popCustomerFirstName);
                                  $('#edtMiddleName').val(popCustomerMiddleName);
                                  $('#edtLastName').val(popCustomerLastName);
                                  $('#edtCustomerPhone').val(popCustomerPhone);
                                  $('#edtCustomerMobile').val(popCustomerMobile);
                                  $('#edtCustomerFax').val(popCustomerFaxnumber);
                                  $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                                  $('#edtCustomerWebsite').val(popCustomerURL);
                                  $('#edtCustomerShippingAddress').val(popCustomerStreet);
                                  $('#edtCustomerShippingCity').val(popCustomerStreet2);
                                  $('#edtCustomerShippingState').val(popCustomerState);
                                  $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                                  $('#sedtCountry').val(popCustomerCountry);
                                  $('#txaNotes').val(popCustomernotes);
                                  $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                                  $('#sltTermsPOP').val(popCustomerterms);
                                  $('#sltCustomerType').val(popCustomerType);
                                  $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                                  $('#edtCustomeField1').val(popCustomercustfield1);
                                  $('#edtCustomeField2').val(popCustomercustfield2);
                                  $('#edtCustomeField3').val(popCustomercustfield3);
                                  $('#edtCustomeField4').val(popCustomercustfield4);

                                  $('#sltTaxCode').val(popCustomerTaxCode);

                                  if ((data.tcustomervs1[i].fields.Street == data.tcustomervs1[i].fields.BillStreet) && (data.tcustomervs1[i].fields.Street2 == data.tcustomervs1[i].fields.BillStreet2) &&
                                      (data.tcustomervs1[i].fields.State == data.tcustomervs1[i].fields.BillState) && (data.tcustomervs1[i].fields.Postcode == data.tcustomervs1[i].fields.BillPostcode) &&
                                      (data.tcustomervs1[i].fields.Country == data.tcustomervs1[i].fields.Billcountry)) {
                                      $('#chkSameAsShipping2').attr("checked", "checked");
                                  }

                                  if (data.tcustomervs1[i].fields.IsSupplier == true) {
                                      // $('#isformcontractor')
                                      $('#chkSameAsSupplier').attr("checked", "checked");
                                  } else {
                                      $('#chkSameAsSupplier').removeAttr("checked");
                                  }

                                  setTimeout(function () {
                                      $('#addCustomerModal').modal('show');
                                  }, 200);

                              }
                          }
                          if (!added) {
                              $('.fullScreenSpin').css('display', 'inline-block');
                              sideBarService.getOneCustomerDataExByName(customerDataName).then(function (data) {
                                  $('.fullScreenSpin').css('display', 'none');
                                  let lineItems = [];
                                  $('#add-customer-title').text('Edit Customer');
                                  let popCustomerID = data.tcustomer[0].fields.ID || '';
                                  let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                                  let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                                  let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                                  let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                                  let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                                  let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                                  let popCustomertfn = '' || '';
                                  let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                                  let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                                  let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                                  let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                                  let popCustomerURL = data.tcustomer[0].fields.URL || '';
                                  let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                                  let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                                  let popCustomerState = data.tcustomer[0].fields.State || '';
                                  let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                                  let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                                  let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                                  let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                                  let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                                  let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                                  let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                                  let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                                  let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                                  let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                                  let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                                  let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                                  let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                                  let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                                  let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                                  let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                                  let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                                  let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                                  let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                                  let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                                  let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                                  let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                                  //$('#edtCustomerCompany').attr('readonly', true);
                                  $('#edtCustomerCompany').val(popCustomerName);
                                  $('#edtCustomerPOPID').val(popCustomerID);
                                  $('#edtCustomerPOPEmail').val(popCustomerEmail);
                                  $('#edtTitle').val(popCustomerTitle);
                                  $('#edtFirstName').val(popCustomerFirstName);
                                  $('#edtMiddleName').val(popCustomerMiddleName);
                                  $('#edtLastName').val(popCustomerLastName);
                                  $('#edtCustomerPhone').val(popCustomerPhone);
                                  $('#edtCustomerMobile').val(popCustomerMobile);
                                  $('#edtCustomerFax').val(popCustomerFaxnumber);
                                  $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                                  $('#edtCustomerWebsite').val(popCustomerURL);
                                  $('#edtCustomerShippingAddress').val(popCustomerStreet);
                                  $('#edtCustomerShippingCity').val(popCustomerStreet2);
                                  $('#edtCustomerShippingState').val(popCustomerState);
                                  $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                                  $('#sedtCountry').val(popCustomerCountry);
                                  $('#txaNotes').val(popCustomernotes);
                                  $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                                  $('#sltTermsPOP').val(popCustomerterms);
                                  $('#sltCustomerType').val(popCustomerType);
                                  $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                                  $('#edtCustomeField1').val(popCustomercustfield1);
                                  $('#edtCustomeField2').val(popCustomercustfield2);
                                  $('#edtCustomeField3').val(popCustomercustfield3);
                                  $('#edtCustomeField4').val(popCustomercustfield4);

                                  $('#sltTaxCode').val(popCustomerTaxCode);

                                  if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                                      (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                                      (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                                      $('#chkSameAsShipping2').attr("checked", "checked");
                                  }

                                  if (data.tcustomer[0].fields.IsSupplier == true) {
                                      // $('#isformcontractor')
                                      $('#chkSameAsSupplier').attr("checked", "checked");
                                  } else {
                                      $('#chkSameAsSupplier').removeAttr("checked");
                                  }

                                  setTimeout(function () {
                                      $('#addCustomerModal').modal('show');
                                  }, 200);
                              }).catch(function (err) {
                                  $('.fullScreenSpin').css('display', 'none');
                              });
                          }
                      }
                  }).catch(function (err) {
                      sideBarService.getOneCustomerDataExByName(customerDataName).then(function (data) {
                          $('.fullScreenSpin').css('display', 'none');
                          let lineItems = [];
                          $('#add-customer-title').text('Edit Customer');
                          let popCustomerID = data.tcustomer[0].fields.ID || '';
                          let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                          let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                          let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                          let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                          let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                          let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                          let popCustomertfn = '' || '';
                          let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                          let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                          let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                          let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                          let popCustomerURL = data.tcustomer[0].fields.URL || '';
                          let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                          let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                          let popCustomerState = data.tcustomer[0].fields.State || '';
                          let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                          let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                          let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                          let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                          let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                          let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                          let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                          let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                          let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                          let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                          let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                          let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                          let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                          let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                          let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                          let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                          let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                          let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                          let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                          let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                          let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                          let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                          //$('#edtCustomerCompany').attr('readonly', true);
                          $('#edtCustomerCompany').val(popCustomerName);
                          $('#edtCustomerPOPID').val(popCustomerID);
                          $('#edtCustomerPOPEmail').val(popCustomerEmail);
                          $('#edtTitle').val(popCustomerTitle);
                          $('#edtFirstName').val(popCustomerFirstName);
                          $('#edtMiddleName').val(popCustomerMiddleName);
                          $('#edtLastName').val(popCustomerLastName);
                          $('#edtCustomerPhone').val(popCustomerPhone);
                          $('#edtCustomerMobile').val(popCustomerMobile);
                          $('#edtCustomerFax').val(popCustomerFaxnumber);
                          $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                          $('#edtCustomerWebsite').val(popCustomerURL);
                          $('#edtCustomerShippingAddress').val(popCustomerStreet);
                          $('#edtCustomerShippingCity').val(popCustomerStreet2);
                          $('#edtCustomerShippingState').val(popCustomerState);
                          $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                          $('#sedtCountry').val(popCustomerCountry);
                          $('#txaNotes').val(popCustomernotes);
                          $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                          $('#sltTermsPOP').val(popCustomerterms);
                          $('#sltCustomerType').val(popCustomerType);
                          $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                          $('#edtCustomeField1').val(popCustomercustfield1);
                          $('#edtCustomeField2').val(popCustomercustfield2);
                          $('#edtCustomeField3').val(popCustomercustfield3);
                          $('#edtCustomeField4').val(popCustomercustfield4);

                          $('#sltTaxCode').val(popCustomerTaxCode);

                          if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                              (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                              (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                              $('#chkSameAsShipping2').attr("checked", "checked");
                          }

                          if (data.tcustomer[0].fields.IsSupplier == true) {
                              // $('#isformcontractor')
                              $('#chkSameAsSupplier').attr("checked", "checked");
                          } else {
                              $('#chkSameAsSupplier').removeAttr("checked");
                          }

                          setTimeout(function () {
                              $('#addCustomerModal').modal('show');
                          }, 200);
                      }).catch(function (err) {
                          $('.fullScreenSpin').css('display', 'none');
                      });
                  });
              } else {
                  $('#customerListModal').modal();
                  setTimeout(function () {
                      $('#tblCustomerlist_filter .form-control-sm').focus();
                      $('#tblCustomerlist_filter .form-control-sm').val('');
                      $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                      var datatable = $('#tblCustomerlist').DataTable();
                      //datatable.clear();
                      //datatable.rows.add(splashArrayCustomerList);
                      datatable.draw();
                      $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                      //$('#tblCustomerlist').dataTable().fnFilter(' ').draw(false);
                  }, 500);
              }
          }

      });

      /* On click Customer List */
      $(document).on("click", "#tblCustomerlist tbody tr", function (e) {

          var tableCustomer = $(this);
          $('#sltJobOne').val(tableCustomer.find(".colCompany").text());
          $('#customerListModal').modal('toggle');
          $('#tblCustomerlist_filter .form-control-sm').val('');
          setTimeout(function () {
              $('.btnRefreshCustomer').trigger('click');
              $('.fullScreenSpin').css('display', 'none');
          }, 1000);
      });

      /* On clik Inventory Line */
      $(document).on("click", "#tblInventoryPayrollService tbody tr", function (e) {
          var tableProductService = $(this);

          let lineProductName = tableProductService.find(".productName").text()||'';
          let lineProductDesc = tableProductService.find(".productDesc").text()||'';
          let lineProdCost = tableProductService.find(".costPrice").text()||0;
          $('#product-listone').val(lineProductName);
          $('#edtProductCost').val(lineProdCost);
          $('#productListModal').modal('toggle');
          $('#tblInventoryPayrollService_filter .form-control-sm').val('');

          setTimeout(function () {
              //$('#tblCustomerlist_filter .form-control-sm').focus();
              $('.btnRefreshProduct').trigger('click');
              $('.fullScreenSpin').css('display', 'none');
          }, 1000);
      });


      $("#scanBarcode").click(function () {
          if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {}
          else {
              Bert.alert('<strong>Please Note:</strong> This function is only available on mobile devices!', 'now-dangerorange');
          }
      });

        function initDataTableCtrl(container) {
            $('select', container).select2();
        }

          document.querySelector('#barcodeScanInput').addEventListener('keypress', function (e) {
              if (e.key === 'Enter') {
                  $("#btnDesktopSearch").trigger("click");
              }
          });

          var isMobile = false;
          if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
              /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
              isMobile = true;
          }
          if (isMobile == true) {
            setTimeout(function() {
              document.getElementById("scanBarcode").style.display = "none";
              document.getElementById("mobileBarcodeScanClockOff").style.display = "block";
            }, 500);

          }

          function onScanSuccessClockOff(decodedText, decodedResult) {
              var barcodeScannerClockOff = decodedText.toUpperCase() || '';
              $('#scanBarcodeModalClockOff').modal('toggle');
              if (barcodeScannerClockOff != '') {
                  setTimeout(function() {
                      $('#barcodeScanInput').val(barcodeScannerClockOff);
                      $('#barcodeScanInput').trigger("input");
                  }, 200);


              }
          }


          var html5QrcodeScannerClockOff = new Html5QrcodeScanner(
              "qr-reader-ClockOff", {
                  fps: 10,
                  qrbox: 250,
                  rememberLastUsedCamera: true
              });
          html5QrcodeScannerClockOff.render(onScanSuccessClockOff);


          templateObject.getAllFilterTimeSheetData = function (fromDate,toDate, ignoreDate) {
            if(ignoreDate == true){
              $('#dateFrom').attr('readonly', true);
              $('#dateTo').attr('readonly', true);
            }else{
              $("#dateFrom").val(fromDate !=''? moment(fromDate).format("DD/MM/YYYY"): fromDate);
              $("#dateTo").val(toDate !=''? moment(toDate).format("DD/MM/YYYY"): toDate);
            }

            var splashArrayTimeSheetListNew = new Array();
            getVS1Data('TTimeSheet').then(function (dataObject) {
              if (dataObject == 0) {
                sideBarService.getAllTimeSheetList().then(function (data) {
                    addVS1Data('TTimeSheet', JSON.stringify(data));
                    $('.fullScreenSpin').css('display', 'none');
                    let lineItems = [];
                    let lineItemObj = {};

                    let sumTotalCharge = 0;
                    let sumSumHour = 0;
                    let sumSumHourlyRate = 0;
                    for (let w = 0; w < data.ttimesheet.length; w++) {
                        let hourlyRate = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.HourlyRate) || Currency+0.00;
                        let labourCost = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.LabourCost) || Currency+0.00;
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.Total) || Currency+0.00;
                        let totalAdjusted = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.TotalAdjusted) || Currency+0.00;
                        let totalAmountInc = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.TotalInc) || Currency+0.00;
                        sumTotalCharge = sumTotalCharge + data.ttimesheet[w].fields.Total;
                        sumSumHour = sumSumHour + data.ttimesheet[w].fields.Hours;
                        sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[w].fields.LabourCost;
                        let hoursFormatted = templateObject.timeFormat(data.ttimesheet[w].fields.Hours) || '';
                        let lineEmpID = '';
                        if((data.ttimesheet[w].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[w].fields.EndTime.replace(/\s/g, '') == '')){
                          hourlyRate = Currency+0.00;
                        }
                        if((data.ttimesheet[w].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[w].fields.EndTime.replace(/\s/g, '') == '')){
                          hoursFormatted = '00:00';
                        }

                        if (data.ttimesheet[w].fields.Logs) {
                            if (Array.isArray(data.ttimesheet[w].fields.Logs)) {
                                // It is array
                                lineEmpID = data.ttimesheet[w].fields.Logs[0].fields.EmployeeID || '';
                            } else {
                                lineEmpID = data.ttimesheet[w].fields.Logs.fields.EmployeeID || '';
                            }
                        }
                        var dataList = {
                            id: data.ttimesheet[w].fields.ID || '',
                            employee: data.ttimesheet[w].fields.EmployeeName || '',
                            employeeID: lineEmpID || '',
                            hourlyrate: hourlyRate,
                            hourlyrateval: data.ttimesheet[w].fields.HourlyRate || '',
                            hours: data.ttimesheet[w].fields.Hours || '',
                            hourFormat: hoursFormatted,
                            job: data.ttimesheet[w].fields.Job || '',
                            product: data.ttimesheet[w].fields.ServiceName || '',
                            labourcost: labourCost,
                            overheadrate: data.ttimesheet[w].fields.OverheadRate || '',
                            sortdate: data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[w].fields.TimeSheetDate,
                            timesheetdate: data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[w].fields.TimeSheetDate,
                            // suppliername: data.ttimesheet[w].SupplierName || '',
                            timesheetdate1: data.ttimesheet[w].fields.TimeSheetDate || '',
                            totalamountex: totalAmount || Currency+0.00,
                            totaladjusted: totalAdjusted || Currency+0.00,
                            totalamountinc: totalAmountInc || Currency+0.00,
                            overtime: 0,
                            double: 0,
                            status: data.ttimesheet[w].fields.Status || 'Unprocessed',
                            additional: Currency + '0.00',
                            paychecktips: Currency + '0.00',
                            cashtips: Currency + '0.00',
                            startTime: data.ttimesheet[w].fields.StartTime || '',
                            endTime: data.ttimesheet[w].fields.EndTime || '',
                            // totaloustanding: totalOutstanding || 0.00,
                            // orderstatus: data.ttimesheet[w].OrderStatus || '',
                            // custfield1: '' || '',
                            // custfield2: '' || '',
                            // invoicenotes: data.ttimesheet[w].InvoiceNotes || '',
                            notes: data.ttimesheet[w].fields.Notes || '',
                            finished: 'Not Processed',
                            color: '#f6c23e'
                        };
                        dataTableList.push(dataList);

                        let sortdate = data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[w].fields.TimeSheetDate;
                        let timesheetdate = data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[w].fields.TimeSheetDate;
                        let checkStatus = data.ttimesheet[w].fields.Status || 'Unprocessed';

                        var dataListTimeSheet = [
                            '<div class="custom-control custom-checkbox pointer"><input class="custom-control-input chkBox notevent pointer" type="checkbox" id="f-'+data.ttimesheet[w].fields.ID+'" name="'+data.ttimesheet[w].fields.ID+'"> <label class="custom-control-label" for="f-'+data.ttimesheet[w].fields.ID+'"></label></div>' || '',
                            data.ttimesheet[w].fields.ID || '',
                            data.ttimesheet[w].fields.EmployeeName || '',
                            '<span style="display:none;">'+sortdate+'</span> '+timesheetdate || '',
                            data.ttimesheet[w].fields.Job || '',
                            data.ttimesheet[w].fields.ServiceName || '',
                            '<input class="colRegHours highlightInput" type="number" value="'+data.ttimesheet[w].fields.Hours+'"><span class="colRegHours" style="display: none;">'+data.ttimesheet[w].fields.Hours+'</span>' || '',
                            '<input class="colRegHoursOne highlightInput" type="text" value="'+hoursFormatted+'" autocomplete="off">' || '',
                            '<input class="colOvertime highlightInput" type="number" value="0"><span class="colOvertime" style="display: none;">0</span>' || '',
                            '<input class="colDouble highlightInput" type="number" value="0"><span class="colDouble" style="display: none;">0</span>' || '',
                            '<input class="colAdditional highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colAdditional" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                            '<input class="colPaycheckTips highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colPaycheckTips" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                            data.ttimesheet[w].fields.Notes || '',
                            checkStatus || '',
                            '',
                            data.ttimesheet[w].fields.HourlyRate || '',
                            '<a href="/timesheettimelog?id='+data.ttimesheet[w].fields.ID+'" class="btn btn-sm btn-success btnTimesheetListOne" style="width: 36px;" id="" autocomplete="off"><i class="far fa-clock"></i></a>' || ''
                        ];

                        let dtTimeSheet = new Date(data.ttimesheet[w].fields.TimeSheetDate.split(' ')[0]);


                        if(ignoreDate == true){
                          sumTotalCharge = sumTotalCharge + data.ttimesheet[w].fields.Total;
                          sumSumHour = sumSumHour + data.ttimesheet[w].fields.Hours;
                          sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[w].fields.LabourCost;
                          splashArrayTimeSheetListNew.push(dataListTimeSheet);
                        }else{
                          if((dtTimeSheet >= new Date(fromDate)) && (dtTimeSheet <= new Date(toDate))){
                            sumTotalCharge = sumTotalCharge + data.ttimesheet[w].fields.Total;
                            sumSumHour = sumSumHour + data.ttimesheet[w].fields.Hours;
                            sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[w].fields.LabourCost;
                            splashArrayTimeSheetListNew.push(dataListTimeSheet);
                          }
                        }

                    }
                    $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
                    $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate.toFixed(2)));
                    $('.lblSumHour').text(sumSumHour.toFixed(2));
                    templateObject.datatablerecords.set(dataTableList);
                    templateObject.datatablerecords1.set(dataTableList);
                    if(splashArrayTimeSheetListNew){
                    let uniqueChars = [...new Set(splashArrayTimeSheetListNew)];
                    var datatable = $('#tblTimeSheet').DataTable();
                    datatable.clear();
                    datatable.rows.add(uniqueChars);
                    datatable.draw(false);
                   }

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });

              } else {
                  $('.fullScreenSpin').css('display', 'none');
                  let data = JSON.parse(dataObject[0].data);
                  let lineItems = [];
                  let lineItemObj = {};
                  let sumTotalCharge = 0;
                  let sumSumHour = 0;
                  let sumSumHourlyRate = 0;
                  for (let w = 0; w < data.ttimesheet.length; w++) {

                      if (seeOwnTimesheets == false) {
                          let hourlyRate = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.HourlyRate) || Currency+0.00;
                          let labourCost = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.LabourCost) || Currency+0.00;
                          let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.Total) || Currency+0.00;
                          let totalAdjusted = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.TotalAdjusted) || Currency+0.00;
                          let totalAmountInc = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.TotalInc) || Currency+0.00;

                          let hoursFormatted = templateObject.timeFormat(data.ttimesheet[w].fields.Hours) || '';
                          if((data.ttimesheet[w].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[w].fields.EndTime.replace(/\s/g, '') == '')){
                            hourlyRate = Currency+0.00;
                          }
                          if((data.ttimesheet[w].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[w].fields.EndTime.replace(/\s/g, '') == '')){
                            hoursFormatted = '00:00';
                          }
                          let lineEmpID = '';
                          if (data.ttimesheet[w].fields.Logs) {
                              if (Array.isArray(data.ttimesheet[w].fields.Logs)) {
                                  // It is array
                                  lineEmpID = data.ttimesheet[w].fields.Logs[0].fields.EmployeeID || '';
                              } else {
                                  lineEmpID = data.ttimesheet[w].fields.Logs.fields.EmployeeID || '';
                              }
                          }
                          var dataList = {
                              id: data.ttimesheet[w].fields.ID || '',
                              employee: data.ttimesheet[w].fields.EmployeeName || '',
                              employeeID: lineEmpID || '',
                              hourlyrate: hourlyRate,
                              hourlyrateval: data.ttimesheet[w].fields.HourlyRate || '',
                              hours: data.ttimesheet[w].fields.Hours || '',
                              hourFormat: hoursFormatted,
                              job: data.ttimesheet[w].fields.Job || '',
                              product: data.ttimesheet[w].fields.ServiceName || '',
                              labourcost: labourCost,
                              overheadrate: data.ttimesheet[w].fields.OverheadRate || '',
                              sortdate: data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[w].fields.TimeSheetDate,
                              timesheetdate: data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[w].fields.TimeSheetDate,
                              // suppliername: data.ttimesheet[w].SupplierName || '',
                              timesheetdate1: data.ttimesheet[w].fields.TimeSheetDate || '',
                              totalamountex: totalAmount || Currency+0.00,
                              totaladjusted: totalAdjusted || Currency+0.00,
                              totalamountinc: totalAmountInc || Currency+0.00,
                              status: data.ttimesheet[w].fields.Status || 'Unprocessed',
                              overtime: 0,
                              double: 0,
                              additional: Currency + '0.00',
                              paychecktips: Currency + '0.00',
                              cashtips: Currency + '0.00',
                              startTime: data.ttimesheet[w].fields.StartTime || '',
                              endTime: data.ttimesheet[w].fields.EndTime || '',
                              // totaloustanding: totalOutstanding || 0.00,
                              // orderstatus: data.ttimesheet[w].OrderStatus || '',
                              // custfield1: '' || '',
                              // custfield2: '' || '',
                              // invoicenotes: data.ttimesheet[w].InvoiceNotes || '',
                              notes: data.ttimesheet[w].fields.Notes || '',
                              finished: 'Not Processed',
                              color: '#f6c23e'
                          };
                          dataTableList.push(dataList);

                          let sortdate = data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[w].fields.TimeSheetDate;
                          let timesheetdate = data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[w].fields.TimeSheetDate;
                          let checkStatus = data.ttimesheet[w].fields.Status || 'Unprocessed';

                          var dataListTimeSheet = [
                              '<div class="custom-control custom-checkbox pointer"><input class="custom-control-input chkBox notevent pointer" type="checkbox" id="f-'+data.ttimesheet[w].fields.ID+'" name="'+data.ttimesheet[w].fields.ID+'"> <label class="custom-control-label" for="f-'+data.ttimesheet[w].fields.ID+'"></label></div>' || '',
                              data.ttimesheet[w].fields.ID || '',
                              data.ttimesheet[w].fields.EmployeeName || '',
                              '<span style="display:none;">'+sortdate+'</span> '+timesheetdate || '',
                              data.ttimesheet[w].fields.Job || '',
                              data.ttimesheet[w].fields.ServiceName || '',
                              '<input class="colRegHours highlightInput" type="number" value="'+data.ttimesheet[w].fields.Hours+'"><span class="colRegHours" style="display: none;">'+data.ttimesheet[w].fields.Hours+'</span>' || '',
                              '<input class="colRegHoursOne highlightInput" type="text" value="'+hoursFormatted+'" autocomplete="off">' || '',
                              '<input class="colOvertime highlightInput" type="number" value="0"><span class="colOvertime" style="display: none;">0</span>' || '',
                              '<input class="colDouble highlightInput" type="number" value="0"><span class="colDouble" style="display: none;">0</span>' || '',
                              '<input class="colAdditional highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colAdditional" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                              '<input class="colPaycheckTips highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colPaycheckTips" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                              data.ttimesheet[w].fields.Notes || '',
                              checkStatus || '',
                              '',
                              data.ttimesheet[w].fields.HourlyRate || '',
                              '<a href="/timesheettimelog?id='+data.ttimesheet[w].fields.ID+'" class="btn btn-sm btn-success btnTimesheetListOne" style="width: 36px;" id="" autocomplete="off"><i class="far fa-clock"></i></a>' || ''
                          ];

                          let dtTimeSheet = new Date(data.ttimesheet[w].fields.TimeSheetDate.split(' ')[0]);

                          if(ignoreDate == true){
                            sumTotalCharge = sumTotalCharge + data.ttimesheet[w].fields.Total;
                            sumSumHour = sumSumHour + data.ttimesheet[w].fields.Hours;
                            sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[w].fields.LabourCost;
                            splashArrayTimeSheetListNew.push(dataListTimeSheet);
                          }else{
                            if((dtTimeSheet >= new Date(fromDate)) && (dtTimeSheet <= new Date(toDate))){
                              sumTotalCharge = sumTotalCharge + data.ttimesheet[w].fields.Total;
                              sumSumHour = sumSumHour + data.ttimesheet[w].fields.Hours;
                              sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[w].fields.LabourCost;
                              splashArrayTimeSheetListNew.push(dataListTimeSheet);

                            }
                          }


                      } else {
                          if (data.ttimesheet[w].fields.EmployeeName == Session.get('mySessionEmployee')) {
                              let hourlyRate = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.HourlyRate) || Currency+0.00;
                              let labourCost = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.LabourCost) || Currency+0.00;
                              let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.Total) || Currency+0.00;
                              let totalAdjusted = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.TotalAdjusted) || Currency+0.00;
                              let totalAmountInc = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.TotalInc) || Currency+0.00;
                              // sumTotalCharge = sumTotalCharge + data.ttimesheet[w].fields.Total;
                              // sumSumHour = sumSumHour + data.ttimesheet[w].fields.Hours;
                              // sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[w].fields.LabourCost;
                              let hoursFormatted = templateObject.timeFormat(data.ttimesheet[w].fields.Hours) || '';
                              let lineEmpID = '';
                              if (data.ttimesheet[w].fields.Logs) {
                                  if (Array.isArray(data.ttimesheet[w].fields.Logs)) {
                                      // It is array
                                      lineEmpID = data.ttimesheet[w].fields.Logs[0].fields.EmployeeID || '';
                                  } else {
                                      lineEmpID = data.ttimesheet[w].fields.Logs.fields.EmployeeID || '';
                                  }
                              }

                              var dataList = {
                                  id: data.ttimesheet[w].fields.ID || '',
                                  employee: data.ttimesheet[w].fields.EmployeeName || '',
                                  employeeID: lineEmpID || '',
                                  hourlyrate: hourlyRate,
                                  hourlyrateval: data.ttimesheet[w].fields.HourlyRate || '',
                                  hours: data.ttimesheet[w].fields.Hours || '',
                                  hourFormat: hoursFormatted,
                                  job: data.ttimesheet[w].fields.Job || '',
                                  product: data.ttimesheet[w].fields.ServiceName || '',
                                  labourcost: labourCost,
                                  overheadrate: data.ttimesheet[w].fields.OverheadRate || '',
                                  sortdate: data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[w].fields.TimeSheetDate,
                                  timesheetdate: data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[w].fields.TimeSheetDate,
                                  // suppliername: data.ttimesheet[w].SupplierName || '',
                                  timesheetdate1: data.ttimesheet[w].fields.TimeSheetDate || '',
                                  totalamountex: totalAmount || Currency+0.00,
                                  totaladjusted: totalAdjusted || Currency+0.00,
                                  totalamountinc: totalAmountInc || Currency+0.00,
                                  status: data.ttimesheet[w].fields.Status || 'Unprocessed',
                                  overtime: 0,
                                  double: 0,
                                  additional: Currency + '0.00',
                                  paychecktips: Currency + '0.00',
                                  cashtips: Currency + '0.00',
                                  // totaloustanding: totalOutstanding || 0.00,
                                  // orderstatus: data.ttimesheet[w].OrderStatus || '',
                                  // custfield1: '' || '',
                                  // custfield2: '' || '',
                                  // invoicenotes: data.ttimesheet[w].InvoiceNotes || '',
                                  notes: data.ttimesheet[w].fields.Notes || '',
                                  finished: 'Not Processed',
                                  color: '#f6c23e'
                              };
                              dataTableList.push(dataList);

                              let sortdate = data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[w].fields.TimeSheetDate;
                              let timesheetdate = data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[w].fields.TimeSheetDate;
                              let checkStatus = data.ttimesheet[w].fields.Status || 'Unprocessed';

                              var dataListTimeSheet = [
                                  '<div class="custom-control custom-checkbox pointer"><input class="custom-control-input chkBox notevent pointer" type="checkbox" id="f-'+data.ttimesheet[w].fields.ID+'" name="'+data.ttimesheet[w].fields.ID+'"> <label class="custom-control-label" for="f-'+data.ttimesheet[w].fields.ID+'"></label></div>' || '',
                                  data.ttimesheet[w].fields.ID || '',
                                  data.ttimesheet[w].fields.EmployeeName || '',
                                  '<span style="display:none;">'+sortdate+'</span> '+timesheetdate || '',
                                  data.ttimesheet[w].fields.Job || '',
                                  data.ttimesheet[w].fields.ServiceName || '',
                                  '<input class="colRegHours highlightInput" type="number" value="'+data.ttimesheet[w].fields.Hours+'"><span class="colRegHours" style="display: none;">'+data.ttimesheet[w].fields.Hours+'</span>' || '',
                                  '<input class="colRegHoursOne highlightInput" type="text" value="'+hoursFormatted+'" autocomplete="off">' || '',
                                  '<input class="colOvertime highlightInput" type="number" value="0"><span class="colOvertime" style="display: none;">0</span>' || '',
                                  '<input class="colDouble highlightInput" type="number" value="0"><span class="colDouble" style="display: none;">0</span>' || '',
                                  '<input class="colAdditional highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colAdditional" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                                  '<input class="colPaycheckTips highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colPaycheckTips" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                                  data.ttimesheet[w].fields.Notes || '',
                                  checkStatus || '',
                                  '',
                                  data.ttimesheet[w].fields.HourlyRate || '',
                                  '<a href="/timesheettimelog?id='+data.ttimesheet[w].fields.ID+'" class="btn btn-sm btn-success btnTimesheetListOne" style="width: 36px;" id="" autocomplete="off"><i class="far fa-clock"></i></a>' || ''
                              ];

                              let dtTimeSheet = new Date(data.ttimesheet[w].fields.TimeSheetDate.split(' ')[0]);
                              if(ignoreDate == true){
                                sumTotalCharge = sumTotalCharge + data.ttimesheet[w].fields.Total;
                                sumSumHour = sumSumHour + data.ttimesheet[w].fields.Hours;
                                sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[w].fields.LabourCost;
                                splashArrayTimeSheetListNew.push(dataListTimeSheet);
                              }else{
                                if((dtTimeSheet >= new Date(fromDate)) && (dtTimeSheet <= new Date(toDate))){
                                  sumTotalCharge = sumTotalCharge + data.ttimesheet[w].fields.Total;
                                  sumSumHour = sumSumHour + data.ttimesheet[w].fields.Hours;
                                  sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[w].fields.LabourCost;
                                  splashArrayTimeSheetListNew.push(dataListTimeSheet);
                                }
                              }

                          }

                      }

                  }

                  $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
                  $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate.toFixed(2)));
                  $('.lblSumHour').text(sumSumHour.toFixed(2));
                  templateObject.datatablerecords.set(dataTableList);
                  templateObject.datatablerecords1.set(dataTableList);
                  if(splashArrayTimeSheetListNew){
                  let uniqueChars = [...new Set(splashArrayTimeSheetListNew)];
                  var datatable = $('#tblTimeSheet').DataTable();
                  datatable.clear();
                  datatable.rows.add(uniqueChars);
                  datatable.draw(false);
                }
              }

          }).catch(function (err) {

            sideBarService.getAllTimeSheetList().then(function (data) {
                addVS1Data('TTimeSheet', JSON.stringify(data));
                $('.fullScreenSpin').css('display', 'none');
                let lineItems = [];
                let lineItemObj = {};

                let sumTotalCharge = 0;
                let sumSumHour = 0;
                let sumSumHourlyRate = 0;
                for (let w = 0; w < data.ttimesheet.length; w++) {
                    let hourlyRate = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.HourlyRate) || Currency+0.00;
                    let labourCost = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.LabourCost) || Currency+0.00;
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.Total) || Currency+0.00;
                    let totalAdjusted = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.TotalAdjusted) || Currency+0.00;
                    let totalAmountInc = utilityService.modifynegativeCurrencyFormat(data.ttimesheet[w].fields.TotalInc) || Currency+0.00;
                    sumTotalCharge = sumTotalCharge + data.ttimesheet[w].fields.Total;
                    sumSumHour = sumSumHour + data.ttimesheet[w].fields.Hours;
                    sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[w].fields.LabourCost;
                    let hoursFormatted = templateObject.timeFormat(data.ttimesheet[w].fields.Hours) || '';
                    let lineEmpID = '';
                    if((data.ttimesheet[w].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[w].fields.EndTime.replace(/\s/g, '') == '')){
                      hourlyRate = Currency+0.00;
                    }
                    if((data.ttimesheet[w].fields.StartTime.replace(/\s/g, '') == '') || (data.ttimesheet[w].fields.EndTime.replace(/\s/g, '') == '')){
                      hoursFormatted = '00:00';
                    }

                    if (data.ttimesheet[w].fields.Logs) {
                        if (Array.isArray(data.ttimesheet[w].fields.Logs)) {
                            // It is array
                            lineEmpID = data.ttimesheet[w].fields.Logs[0].fields.EmployeeID || '';
                        } else {
                            lineEmpID = data.ttimesheet[w].fields.Logs.fields.EmployeeID || '';
                        }
                    }
                    var dataList = {
                        id: data.ttimesheet[w].fields.ID || '',
                        employee: data.ttimesheet[w].fields.EmployeeName || '',
                        employeeID: lineEmpID || '',
                        hourlyrate: hourlyRate,
                        hourlyrateval: data.ttimesheet[w].fields.HourlyRate || '',
                        hours: data.ttimesheet[w].fields.Hours || '',
                        hourFormat: hoursFormatted,
                        job: data.ttimesheet[w].fields.Job || '',
                        product: data.ttimesheet[w].fields.ServiceName || '',
                        labourcost: labourCost,
                        overheadrate: data.ttimesheet[w].fields.OverheadRate || '',
                        sortdate: data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[w].fields.TimeSheetDate,
                        timesheetdate: data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[w].fields.TimeSheetDate,
                        // suppliername: data.ttimesheet[w].SupplierName || '',
                        timesheetdate1: data.ttimesheet[w].fields.TimeSheetDate || '',
                        totalamountex: totalAmount || Currency+0.00,
                        totaladjusted: totalAdjusted || Currency+0.00,
                        totalamountinc: totalAmountInc || Currency+0.00,
                        overtime: 0,
                        double: 0,
                        status: data.ttimesheet[w].fields.Status || 'Unprocessed',
                        additional: Currency + '0.00',
                        paychecktips: Currency + '0.00',
                        cashtips: Currency + '0.00',
                        startTime: data.ttimesheet[w].fields.StartTime || '',
                        endTime: data.ttimesheet[w].fields.EndTime || '',
                        // totaloustanding: totalOutstanding || 0.00,
                        // orderstatus: data.ttimesheet[w].OrderStatus || '',
                        // custfield1: '' || '',
                        // custfield2: '' || '',
                        // invoicenotes: data.ttimesheet[w].InvoiceNotes || '',
                        notes: data.ttimesheet[w].fields.Notes || '',
                        finished: 'Not Processed',
                        color: '#f6c23e'
                    };
                    dataTableList.push(dataList);

                    let sortdate = data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[w].fields.TimeSheetDate;
                    let timesheetdate = data.ttimesheet[w].fields.TimeSheetDate != '' ? moment(data.ttimesheet[w].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[w].fields.TimeSheetDate;
                    let checkStatus = data.ttimesheet[w].fields.Status || 'Unprocessed';

                    var dataListTimeSheet = [
                        '<div class="custom-control custom-checkbox pointer"><input class="custom-control-input chkBox notevent pointer" type="checkbox" id="f-'+data.ttimesheet[w].fields.ID+'" name="'+data.ttimesheet[w].fields.ID+'"> <label class="custom-control-label" for="f-'+data.ttimesheet[w].fields.ID+'"></label></div>' || '',
                        data.ttimesheet[w].fields.ID || '',
                        data.ttimesheet[w].fields.EmployeeName || '',
                        '<span style="display:none;">'+sortdate+'</span> '+timesheetdate || '',
                        data.ttimesheet[w].fields.Job || '',
                        data.ttimesheet[w].fields.ServiceName || '',
                        '<input class="colRegHours highlightInput" type="number" value="'+data.ttimesheet[w].fields.Hours+'"><span class="colRegHours" style="display: none;">'+data.ttimesheet[w].fields.Hours+'</span>' || '',
                        '<input class="colRegHoursOne highlightInput" type="text" value="'+hoursFormatted+'" autocomplete="off">' || '',
                        '<input class="colOvertime highlightInput" type="number" value="0"><span class="colOvertime" style="display: none;">0</span>' || '',
                        '<input class="colDouble highlightInput" type="number" value="0"><span class="colDouble" style="display: none;">0</span>' || '',
                        '<input class="colAdditional highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colAdditional" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                        '<input class="colPaycheckTips highlightInput cashamount" type="text" value="'+Currency + '0.00'+'"><span class="colPaycheckTips" style="display: none;">'+Currency + '0.00'+'</span>' || '',
                        data.ttimesheet[w].fields.Notes || '',
                        checkStatus || '',
                        '',
                        data.ttimesheet[w].fields.HourlyRate || '',
                        '<a href="/timesheettimelog?id='+data.ttimesheet[w].fields.ID+'" class="btn btn-sm btn-success btnTimesheetListOne" style="width: 36px;" id="" autocomplete="off"><i class="far fa-clock"></i></a>' || ''
                    ];

                    let dtTimeSheet = new Date(data.ttimesheet[w].fields.TimeSheetDate.split(' ')[0]);
                    if(ignoreDate == true){
                      sumTotalCharge = sumTotalCharge + data.ttimesheet[w].fields.Total;
                      sumSumHour = sumSumHour + data.ttimesheet[w].fields.Hours;
                      sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[w].fields.LabourCost;
                      splashArrayTimeSheetListNew.push(dataListTimeSheet);
                    }else{
                      if((dtTimeSheet >= new Date(fromDate)) && (dtTimeSheet <= new Date(toDate))){
                        sumTotalCharge = sumTotalCharge + data.ttimesheet[w].fields.Total;
                        sumSumHour = sumSumHour + data.ttimesheet[w].fields.Hours;
                        sumSumHourlyRate = sumSumHourlyRate + data.ttimesheet[w].fields.LabourCost;
                        splashArrayTimeSheetListNew.push(dataListTimeSheet);
                      }
                    }

                }
                $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
                $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate.toFixed(2)));
                $('.lblSumHour').text(sumSumHour.toFixed(2));
                templateObject.datatablerecords.set(dataTableList);
                templateObject.datatablerecords1.set(dataTableList);
                if(splashArrayTimeSheetListNew){
                let uniqueChars = [...new Set(splashArrayTimeSheetListNew)];
                var datatable = $('#tblTimeSheet').DataTable();
                datatable.clear();
                datatable.rows.add(uniqueChars);
                datatable.draw(false);
              }

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
          });
          }

            });

            Template.timesheet.events({
                'click .isPaused': function (event) {
                    const templateObject = Template.instance();
                    let timesheetID = $("#updateID").val() || '';

                    let clockList = templateObject.timesheetrecords.get();
                    clockList = clockList.filter(clkList => {
                        return clkList.id == timesheetID;
                    });
                    if (clockList.length > 0) {
                        let checkPause = clockList[0].isPaused;
                        if ($('#btnHoldOne').prop('disabled') && checkPause == "paused") {
                            swal({
                                title: 'Continue Timesheet',
                                text: 'This Timesheet is currently "On Hold" do you want to "Continue" it',
                                type: 'question',
                                showCancelButton: true,
                                confirmButtonText: 'Yes'
                            }).then((result) => {
                                if (result.value) {
                                    $("#btnClockOn").trigger("click");
                                }

                            });

                        } else if ($('#btnHoldOne').prop('disabled') && checkPause == "completed") {
                            swal({
                                title: 'New Timesheet',
                                text: 'This Timesheet has been completed, do you want to "Clock On" to start a new Timesheet?',
                                type: 'question',
                                showCancelButton: true,
                                confirmButtonText: 'Yes'
                            }).then((result) => {
                                if (result.value) {
                                    $('#btnClockOn').prop('disabled', false);
                                    $('#startTime').prop('disabled', false);
                                    $('#endTime').prop('disabled', false);
                                    var currentDate = new Date();
                                    var begunDate = moment(currentDate).format("DD/MM/YYYY");
                                    let fromDateMonth = currentDate.getMonth();
                                    let fromDateDay = currentDate.getDate();
                                    if ((currentDate.getMonth()+1) < 10) {
                                        fromDateMonth = "0" + (currentDate.getMonth()+1);
                                    }

                                    if (currentDate.getDate() < 10) {
                                        fromDateDay = "0" + currentDate.getDate();
                                    }
                                    var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();

                                    $('#dtSODate').val(fromDate);
                                    $('#txtBookedHoursSpent').val("");
                                    $('#txtBookedHoursSpent1').val("");
                                    $('#updateID').val("");
                                    $('#startTime').val("");
                                    $('#endTime').val("");
                                    $("#btnClockOn").trigger("click");
                                }

                            });

                        }
                    }

                },
                'click isDisabled': function (event) {
                    if (Session.get('CloudAppointmentStartStopAccessLevel') == true) {
                        swal({
                            title: 'Oooops',
                            text: 'You dont have access to put Clock On / Off "On Hold"',
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'OK'
                        }).then((results) => {
                            if (results.value) {}
                            else if (results.dismiss === 'cancel') {}
                        });
                    }
                },
                'change #startTime': function () {
                  const templateObject = Template.instance();

                  var date1Time = new Date($("#dtSODate").datepicker("getDate"));

                  let date1 = date1Time.getFullYear() + "/" + (date1Time.getMonth() + 1) + "/" + date1Time.getDate();

                  var endtime24Hours =  getHour24($("#endTime").val()) ||'';
                  var starttime24Hours =  getHour24($("#startTime").val())||'';

                  var endTime = new Date(date1 + ' ' + endtime24Hours);
                  var startTime = new Date(date1 + ' ' + starttime24Hours);

                  if (endTime > startTime) {
                      let hours = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
                      document.getElementById('txtBookedHoursSpent').value = templateObject.timeFormat(hours);
                  } else {
                    document.getElementById('txtBookedHoursSpent').value = '00:00';
                  }
                },
                'change #endTime': function () {
                  const templateObject = Template.instance();

                  var date1Time = new Date($("#dtSODate").datepicker("getDate"));

                  let date1 = date1Time.getFullYear() + "/" + (date1Time.getMonth() + 1) + "/" + date1Time.getDate();

                  var endtime24Hours =  getHour24($("#endTime").val()) ||'';
                  var starttime24Hours =  getHour24($("#startTime").val())||'';

                  var endTime = new Date(date1 + ' ' + endtime24Hours);
                  var startTime = new Date(date1 + ' ' + starttime24Hours);

                  if (endTime > startTime) {
                      let hours = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
                      document.getElementById('txtBookedHoursSpent').value = templateObject.timeFormat(hours);
                  } else {
                    document.getElementById('txtBookedHoursSpent').value = '00:00';
                  }
                },
                'blur #endTime': function () {
                    const templateObject = Template.instance();
                    if ($("#endTime").val() != "") {
                        setTimeout(function () {
                            templateObject.endTimePopUp();
                        }, 10);
                    }
                },
                'click .clockOff': function (event) {
                    const templateObject = Template.instance();
                    let timesheetID = $("#updateID").val() || '';

                    let clockList = templateObject.timesheetrecords.get();
                    clockList = clockList.filter(clkList => {
                        return clkList.id == timesheetID;
                    });
                    if (clockList.length > 0) {
                        let checkPause = clockList[0].isPaused;
                        if ($('#btnHoldOne').prop('disabled') && checkPause == "completed") {
                            swal({
                                title: 'New Timesheet',
                                text: 'This Timesheet has been completed, do you want to "Clock On" to start a new Timesheet?',
                                type: 'question',
                                showCancelButton: true,
                                confirmButtonText: 'Yes'
                            }).then((result) => {
                                if (result.value) {
                                    $('#btnClockOn').prop('disabled', false);
                                    $('#startTime').prop('disabled', false);
                                    $('#endTime').prop('disabled', false);
                                    var currentDate = new Date();
                                    var begunDate = moment(currentDate).format("DD/MM/YYYY");
                                    let fromDateMonth = currentDate.getMonth();
                                    let fromDateDay = currentDate.getDate();
                                    if ((currentDate.getMonth()+1) < 10) {
                                        fromDateMonth = "0" + (currentDate.getMonth()+1);
                                    }

                                    if (currentDate.getDate() < 10) {
                                        fromDateDay = "0" + currentDate.getDate();
                                    }
                                    var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();

                                    $('#dtSODate').val(fromDate);
                                    $('#txtBookedHoursSpent').val("");
                                    $('#txtBookedHoursSpent1').val("");
                                    $('#updateID').val("");
                                    $('#startTime').val("");
                                    $('#endTime').val("");
                                    $("#btnClockOn").trigger("click");
                                }

                            });

                        }
                    }

                },
                'click .clockOn': function (event) {
                    if ($('#btnClockOn').prop('disabled')) {
                        swal({
                            title: 'New Timesheet',
                            text: 'This Timesheet has been completed, do you want to "Clock On" to start a new Timesheet?',
                            type: 'question',
                            showCancelButton: true,
                            confirmButtonText: 'Yes'
                        }).then((result) => {
                            if (result.value) {
                                $('#btnClockOn').prop('disabled', false);
                                $('#startTime').prop('disabled', false);
                                $('#endTime').prop('disabled', false);
                                var currentDate = new Date();
                                var begunDate = moment(currentDate).format("DD/MM/YYYY");
                                let fromDateMonth = currentDate.getMonth();
                                let fromDateDay = currentDate.getDate();
                                if ((currentDate.getMonth()+1) < 10) {
                                    fromDateMonth = "0" + (currentDate.getMonth()+1);
                                }

                                if (currentDate.getDate() < 10) {
                                    fromDateDay = "0" + currentDate.getDate();
                                }
                                var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();

                                $('#dtSODate').val(fromDate);
                                $('#updateID').val("");
                                $('#startTime').val("");
                                $('#endTime').val("");
                                $('#txtBookedHoursSpent').val("");
                                $('#txtBookedHoursSpent1').val("");
                                $("#btnClockOn").trigger("click");
                            }

                        });

                    }
                },
                'click .btnDesktopSearch': function (e) {
                    const templateObject = Template.instance();
                    let contactService = new ContactService();
                    let barcodeData = $('#barcodeScanInput').val();
                    let empNo = barcodeData.replace(/^\D+/g, '');
                    $('.fullScreenSpin').css('display', 'inline-block');
                    if (barcodeData === '') {
                        swal('Please enter the employee number', '', 'warning');
                        $('.fullScreenSpin').css('display', 'none');
                        e.preventDefault();
                        return false;
                    } else {

                        contactService.getOneEmployeeDataEx(empNo).then(function (data) {
                            $('.fullScreenSpin').css('display', 'none');
                            if (Object.keys(data).length > 0) {
                                $('#employee_name').val(data.fields.EmployeeName || '');
                                $('#barcodeScanInput').val("");
                                $('#sltJobOne').val("");
                                $('#product-listone').val("");
                                $('#edtProductCost').val(0);
                                $('#updateID').val("");
                                $('#startTime').val("");
                                $('#endTime').val("");
                                $('#txtBookedHoursSpent').val("");
                                $('#txtBookedHoursSpent1').val("");
                                $('#startTime').prop('disabled', false);
                                $('#endTime').prop('disabled', false);
                                $('#btnClockOn').prop('disabled', false);
                                $('#btnHoldOne').prop('disabled', false);
                                $('#btnClockOff').prop('disabled', false);
                                $('.processTimesheet').prop('disabled', false);
                                $('#txtBookedHoursSpent').prop('disabled', false);
                                var curretDate = moment().format('DD/MM/YYYY');
                                let clockList = templateObject.timesheetrecords.get();
                                clockList = clockList.filter(clkList => {
                                    return clkList.employee == $('#employee_name').val();
                                });
                                if (clockList.length > 0) {

                                    if (clockList[clockList.length - 1].isPaused == "paused") {
                                        $('.btnHoldOne').prop('disabled', true);
                                    } else {
                                        $('.btnHoldOne').prop('disabled', false);
                                    }

                                    if (clockList[clockList.length - 1].isPaused == "paused") {
                                        $(".paused").show();
                                        $("#btnHoldOne").prop("disabled", true);
                                        $("#btnHoldOne").addClass("mt-32");
                                    } else {
                                        $(".paused").hide();
                                        $("#btnHoldOne").prop("disabled", false);
                                        $("#btnHoldOne").removeClass("mt-32");
                                    }

                                    if (Array.isArray(clockList[clockList.length - 1].timelog) && clockList[clockList.length - 1].isPaused != "completed") {
                                        let startTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime || '';
                                        let date = clockList[clockList.length - 1].timesheetdate;
                                        if (startTime != "") {
                                            $('#startTime').val(clockList[clockList.length - 1].startTime.split(' ')[1] || startTime.split(' ')[1]);
                                            $('#dtSODate').val(date);
                                            $('#txtBookedHoursSpent').val(clockList[clockList.length - 1].hourFormat);
                                            $('#txtBookedHoursSpent1').val(clockList[clockList.length - 1].hours);
                                            $('#updateID').val(clockList[clockList.length - 1].id);
                                            $('#timesheetID').text(clockList[clockList.length - 1].id);
                                            $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                                            $('#sltJobOne').val(clockList[clockList.length - 1].job);
                                            $('#product-listone').val(clockList[clockList.length - 1].product);
                                            $('#edtProductCost').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                            setTimeout(function () {
                                                $('#product-listone').val(clockList[clockList.length - 1].product);
                                            }, 2000)
                                            $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                            $('#startTime').prop('disabled', true);
                                            if (clockList[clockList.length - 1].isPaused == "completed") {
                                                $('#endTime').val(clockList[clockList.length - 1].endTime.split(' ')[1] || endTime);
                                                $('#endTime').prop('disabled', true);
                                                $('#btnClockOn').prop('disabled', true);
                                                $('#btnHoldOne').prop('disabled', true);
                                                $('#btnClockOff').prop('disabled', true);
                                                $('#txtBookedHoursSpent').prop('disabled', true);
                                            }
                                        }
                                    } else if (clockList[clockList.length - 1].isPaused != "completed") {
                                        if (clockList[clockList.length - 1].timelog.fields.EndDatetime == "") {
                                            let startTime = clockList[clockList.length - 1].timelog.fields.StartDatetime.split(' ')[1];
                                            let date = clockList[clockList.length - 1].timesheetdate;
                                            if (startTime != "") {
                                                $('#startTime').val(clockList[clockList.length - 1].startTime.split(' ')[1] || startTime);
                                                $('#dtSODate').val(date);
                                                $('#txtBookedHoursSpent').val(clockList[clockList.length - 1].hourFormat);
                                                $('#txtBookedHoursSpent1').val(clockList[clockList.length - 1].hours);
                                                $('#updateID').val(clockList[clockList.length - 1].id);
                                                $('#timesheetID').text(clockList[clockList.length - 1].id);
                                                $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                                                $('#sltJobOne').val(clockList[clockList.length - 1].job);
                                                $('#product-listone').val(clockList[clockList.length - 1].product);
                                                $('#edtProductCost').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                                setTimeout(function () {
                                                    $('#product-listone').val(clockList[clockList.length - 1].product);
                                                }, 2000)
                                                $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                                $('#startTime').prop('disabled', true);
                                                if (clockList[clockList.length - 1].isPaused == "completed") {
                                                    $('#endTime').val(clockList[clockList.length - 1].endTime.split(' ')[1] || endTime);
                                                    $('#endTime').prop('disabled', true);
                                                    $('#btnClockOn').prop('disabled', true);
                                                    $('#btnHoldOne').prop('disabled', true);
                                                    $('#btnClockOff').prop('disabled', true);
                                                    $('#txtBookedHoursSpent').prop('disabled', true);
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    $(".paused").hide();
                                    $("#btnHoldOne").prop("disabled", false);
                                }
                                if (data.fields.CustFld8 == "false") {
                                    templateObject.getAllSelectedProducts(data.fields.ID);
                                } else {
                                    templateObject.getAllProductData();
                                }

                            } else {
                                swal('Employee Not Found', '', 'warning');
                            }

                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Oooops...',
                                text: "Employee Not Found",
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    // Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                        });

                    }
                },
                'click .chkDatatable': function (event) {
                    var columns = $('#tblTimeSheet th');
                    let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

                    $.each(columns, function (i, v) {
                        let className = v.classList;
                        let replaceClass = className[1];

                        if (v.innerText == columnDataValue) {
                            if ($(event.target).is(':checked')) {
                                $("." + replaceClass + "").css('display', 'table-cell');
                                $("." + replaceClass + "").css('padding', '.75rem');
                                $("." + replaceClass + "").css('vertical-align', 'top');
                            } else {
                                $("." + replaceClass + "").css('display', 'none');
                            }
                        }
                    });
                },
                'click .resetTable': function (event) {
                    var getcurrentCloudDetails = CloudUser.findOne({
                        _id: Session.get('mycloudLogonID'),
                        clouddatabaseID: Session.get('mycloudLogonDBID')
                    });
                    if (getcurrentCloudDetails) {
                        if (getcurrentCloudDetails._id.length > 0) {
                            var clientID = getcurrentCloudDetails._id;
                            var clientUsername = getcurrentCloudDetails.cloudUsername;
                            var clientEmail = getcurrentCloudDetails.cloudEmail;
                            var checkPrefDetails = CloudPreference.findOne({
                                userid: clientID,
                                PrefName: 'tblTimeSheet'
                            });
                            if (checkPrefDetails) {
                                CloudPreference.remove({
                                    _id: checkPrefDetails._id
                                }, function (err, idTag) {
                                    if (err) {}
                                    else {
                                        Meteor._reload.reload();
                                    }
                                });

                            }
                        }
                    }
                },
                'click .saveTable': function (event) {
                    let lineItems = [];
                    //let datatable =$('#tblTimeSheet').DataTable();
                    $('.columnSettings').each(function (index) {
                        var $tblrow = $(this);
                        var colTitle = $tblrow.find(".divcolumn").text() || '';
                        var colWidth = $tblrow.find(".custom-range").val() || 0;
                        var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
                        var colHidden = false;
                        if ($tblrow.find(".custom-control-input").is(':checked')) {
                            colHidden = false;
                        } else {
                            colHidden = true;
                        }
                        let lineItemObj = {
                            index: index,
                            label: colTitle,
                            hidden: colHidden,
                            width: colWidth,
                            thclass: colthClass
                        }

                        lineItems.push(lineItemObj);
                    });
                    var getcurrentCloudDetails = CloudUser.findOne({
                        _id: Session.get('mycloudLogonID'),
                        clouddatabaseID: Session.get('mycloudLogonDBID')
                    });
                    if (getcurrentCloudDetails) {
                        if (getcurrentCloudDetails._id.length > 0) {
                            var clientID = getcurrentCloudDetails._id;
                            var clientUsername = getcurrentCloudDetails.cloudUsername;
                            var clientEmail = getcurrentCloudDetails.cloudEmail;
                            var checkPrefDetails = CloudPreference.findOne({
                                userid: clientID,
                                PrefName: 'tblTimeSheet'
                            });
                            if (checkPrefDetails) {
                                CloudPreference.update({
                                    _id: checkPrefDetails._id
                                }, {
                                    $set: {
                                        userid: clientID,
                                        username: clientUsername,
                                        useremail: clientEmail,
                                        PrefGroup: 'salesform',
                                        PrefName: 'tblTimeSheet',
                                        published: true,
                                        customFields: lineItems,
                                        updatedAt: new Date()
                                    }
                                }, function (err, idTag) {
                                    if (err) {
                                        $('#myModal2').modal('toggle');
                                    } else {
                                        $('#myModal2').modal('toggle');
                                    }
                                });

                            } else {
                                CloudPreference.insert({
                                    userid: clientID,
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'salesform',
                                    PrefName: 'tblTimeSheet',
                                    published: true,
                                    customFields: lineItems,
                                    createdAt: new Date()
                                }, function (err, idTag) {
                                    if (err) {
                                        $('#myModal2').modal('toggle');
                                    } else {
                                        $('#myModal2').modal('toggle');

                                    }
                                });

                            }
                        }
                    }
                    $('#myModal2').modal('toggle');
                    //Meteor._reload.reload();
                },
                'blur .divcolumn': function (event) {
                    let columData = $(event.target).text();

                    let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

                    var datable = $('#tblTimeSheet').DataTable();
                    var title = datable.column(columnDatanIndex).header();
                    $(title).html(columData);

                },
                'change .rngRange': function (event) {
                    let range = $(event.target).val();
                    // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

                    // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
                    let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
                    var datable = $('#tblTimeSheet th');
                    $.each(datable, function (i, v) {

                        if (v.innerText == columnDataValue) {
                            let className = v.className;
                            let replaceClass = className.replace(/ /g, ".");
                            $("." + replaceClass + "").css('width', range + 'px');

                        }
                    });

                },
                'click #check-all': function (event) {
                    if ($(event.target).is(':checked')) {
                        $(".chkBox").prop("checked", true);
                    } else {
                        $(".chkBox").prop("checked", false);
                    }
                },
                'click .chkBox': function () {
                    var listData = $(this).closest('tr').find(".colID").text()||0;
                    const templateObject = Template.instance();
                    const selectedTimesheetList = [];
                    const selectedTimesheetCheck = [];
                    let ids = [];
                    let JsonIn = {};
                    let JsonIn1 = {};
                    let myStringJSON = '';
                    $('.chkBox:checkbox:checked').each(function () {
                        var chkIdLine = $(this).closest('tr').find(".colID").text()||0;
                        let obj = {
                            AppointID: parseInt(chkIdLine)
                        }

                        selectedTimesheetList.push(obj);

                        templateObject.selectedTimesheetID.set(chkIdLine);
                        // selectedAppointmentCheck.push(JsonIn1);
                        // }
                    });
                    templateObject.selectedTimesheet.set(selectedTimesheetList);
                },
                'click .btnOpenSettings': function (event) {
                    let templateObject = Template.instance();
                    var columns = $('#tblTimeSheet th');

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
                        if ((v.className.includes("hiddenColumn"))) {
                            columVisible = false;
                        }
                        sWidth = v.style.width.replace('px', "");

                        let datatablerecordObj = {
                            sTitle: v.innerText || '',
                            sWidth: sWidth || '',
                            sIndex: v.cellIndex || '',
                            sVisible: columVisible || false,
                            sClass: v.className || ''
                        };
                        tableHeaderList.push(datatablerecordObj);
                    });
                    templateObject.tableheaderrecords.set(tableHeaderList);
                },
                // 'click .exportbtn': function () {
                //     $('.fullScreenSpin').css('display', 'inline-block');
                //     jQuery('#tblTimeSheet_wrapper .dt-buttons .btntabletocsv').click();
                //     $('.fullScreenSpin').css('display', 'none');
                // },
                // 'click .exportbtnExcel': function () {
                //     $('.fullScreenSpin').css('display', 'inline-block');
                //     jQuery('#tblTimeSheet_wrapper .dt-buttons .btntabletoexcel').click();
                //     $('.fullScreenSpin').css('display', 'none');
                // },
                'click .btnRefreshOne': function () {
                    $('.fullScreenSpin').css('display', 'inline-block');
                    sideBarService.getAllTimeSheetList().then(function (data) {
                        addVS1Data('TTimeSheet', JSON.stringify(data));
                        setTimeout(function () {
                            window.open('/timesheet', '_self');
                        }, 500);
                    }).catch(function (err) {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                // Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                    });
                },
                'click #btnClockOnOff': async function (event) {
                    const templateObject = Template.instance();
                    let checkIncludeAllProducts = templateObject.includeAllProducts.get();
                    $("#employee_name").val(Session.get('mySessionEmployee'));
                    let getEmployeeID = Session.get('mySessionEmployeeLoggedID') || '';
                    $('#sltJobOne').val("");
                    $('#product-listone').val("");
                    $('#edtProductCost').val(0);
                    $('#updateID').val("");
                    $('#startTime').val("");
                    $('#endTime').val("");
                    $('#txtBookedHoursSpent').val("");
                    $('#txtBookedHoursSpent1').val("");
                    $('#startTime').prop('disabled', false);
                    $('#endTime').prop('disabled', false);
                    $('#btnClockOn').prop('disabled', false);
                    $('#btnHoldOne').prop('disabled', false);
                    $('#btnClockOff').prop('disabled', false);
                    $('.processTimesheet').prop('disabled', false);
                    $('#txtBookedHoursSpent').prop('disabled', false);
                    var curretDate = moment().format('DD/MM/YYYY');
                    if (checkIncludeAllProducts == true) {
                        templateObject.getAllProductData();
                    } else {
                        if (getEmployeeID != '') {
                            templateObject.getAllSelectedProducts(getEmployeeID);
                        } else {
                            templateObject.getAllProductData();
                        }

                    }

                    let clockList = templateObject.timesheetrecords.get();
                    clockList = clockList.filter(clkList => {
                        return clkList.employee == $('#employee_name').val();
                    });

                    if (clockList.length > 0) {

                        if (clockList[clockList.length - 1].isPaused == "paused") {
                            $('.btnHoldOne').prop('disabled', true);
                        } else {
                            $('.btnHoldOne').prop('disabled', false);
                        }

                        if (clockList[clockList.length - 1].isPaused == "paused") {
                            $(".paused").show();
                            $("#btnHoldOne").prop("disabled", true);
                            $("#btnHoldOne").addClass("mt-32");
                        } else {
                            $(".paused").hide();
                            $("#btnHoldOne").prop("disabled", false);
                            $("#btnHoldOne").removeClass("mt-32");
                        }

                        if (Array.isArray(clockList[clockList.length - 1].timelog) && clockList[clockList.length - 1].isPaused != "completed") {
                            let startTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime || '';
                            let date = clockList[clockList.length - 1].timesheetdate;
                            if (startTime != "") {
                                $('#startTime').val(clockList[clockList.length - 1].startTime.split(' ')[1] || startTime.split(' ')[1]);
                                $('#dtSODate').val(date);
                                $('#txtBookedHoursSpent').val(clockList[clockList.length - 1].hourFormat);
                                $('#txtBookedHoursSpent1').val(clockList[clockList.length - 1].hours);
                                $('#updateID').val(clockList[clockList.length - 1].id);
                                $('#timesheetID').text(clockList[clockList.length - 1].id);
                                $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                                $('#sltJobOne').val(clockList[clockList.length - 1].job);
                                $('#product-listone').val(clockList[clockList.length - 1].product);
                                $('#edtProductCost').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                setTimeout(function () {
                                    $('#product-listone').val(clockList[clockList.length - 1].product);
                                }, 1000);
                                $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                $('#startTime').prop('disabled', true);
                                if (clockList[clockList.length - 1].isPaused == "completed") {
                                    $('#endTime').val(clockList[clockList.length - 1].endTime.split(' ')[1] || endTime);
                                    $('#endTime').prop('disabled', true);
                                    $('#btnClockOn').prop('disabled', true);
                                    $('#btnHoldOne').prop('disabled', true);
                                    $('#btnClockOff').prop('disabled', true);
                                    $('#txtBookedHoursSpent').prop('disabled', true);
                                }
                            }
                        } else if (clockList[clockList.length - 1].isPaused != "completed") {
                            if (clockList[clockList.length - 1].timelog.fields.EndDatetime == "") {
                                let startTime = clockList[clockList.length - 1].timelog.fields.StartDatetime.split(' ')[1];
                                let date = clockList[clockList.length - 1].timesheetdate;
                                if (startTime != "") {
                                    $('#startTime').val(clockList[clockList.length - 1].startTime.split(' ')[1] || startTime);
                                    $('#dtSODate').val(date);
                                    $('#txtBookedHoursSpent').val(clockList[clockList.length - 1].hourFormat);
                                    $('#txtBookedHoursSpent1').val(clockList[clockList.length - 1].hours);
                                    $('#updateID').val(clockList[clockList.length - 1].id);
                                    $('#timesheetID').text(clockList[clockList.length - 1].id);
                                    $('#txtNotesOne').val(clockList[clockList.length - 1].notes);
                                    $('#sltJobOne').val(clockList[clockList.length - 1].job);
                                    $('#product-listone').val(clockList[clockList.length - 1].product);
                                    $('#edtProductCost').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                    setTimeout(function () {
                                        $('#product-listone').val(clockList[clockList.length - 1].product);
                                    }, 1000);
                                    $('#hourly_rate').val(clockList[clockList.length - 1].hourlyrate.replace(/[^0-9.-]+/g, ""));
                                    $('#startTime').prop('disabled', true);
                                    if (clockList[clockList.length - 1].isPaused == "completed") {
                                        $('#endTime').val(clockList[clockList.length - 1].endTime.split(' ')[1] || endTime);
                                        $('#endTime').prop('disabled', true);
                                        $('#btnClockOn').prop('disabled', true);
                                        $('#btnHoldOne').prop('disabled', true);
                                        $('#btnClockOff').prop('disabled', true);
                                        $('#txtBookedHoursSpent').prop('disabled', true);
                                    }
                                }
                            }
                        }
                    } else {
                        $(".paused").hide();
                        $("#btnHoldOne").prop("disabled", false);
                    }
                    $('#settingsModal').modal('show');
                },
                'click #btnClockOn': function () {
                    const templateObject = Template.instance();
                    let clockList = templateObject.timesheetrecords.get();
                    var product = $('#product-listone').val() || '';
                    clockList = clockList.filter(clkList => {
                        return clkList.employee == $('#employee_name').val() && clkList.id == $('#updateID').val();
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
                            latestTimeLogId = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.ID || "";
                            checkStartTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime || "";
                            checkEndTime = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.EndDatetime || "";
                        } else {
                            checkStatus = clockList[clockList.length - 1].isPaused || "";
                            latestTimeLogId = clockList[clockList.length - 1].timelog.fields.ID || "";
                            checkStartTime = clockList[clockList.length - 1].timelog.fields.StartDatetime || "";
                            checkEndTime = clockList[clockList.length - 1].timelog.fields.EndDatetime || "";
                        }
                    }
                    // if (checkStatus == "paused") {
                    //     return false;
                    // }
                    if (checkStatus == "completed") {
                        $("#updateID").val("");
                        $("#startTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
                        let startDate = initialDate.getFullYear() + "-" + ("0" + (initialDate.getMonth() + 1)).slice(-2) + "-" + ("0" + (initialDate.getDate())).slice(-2);
                        let endDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
                        var endTime = new Date(endDate + ' ' + document.getElementById("endTime").value);
                        var startTime = new Date(startDate + ' ' + document.getElementById("startTime").value);
                        if (endTime > startTime) {
                            let hours = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
                            document.getElementById('txtBookedHoursSpent').value = templateObject.timeFormat(hours);

                        } else if (document.getElementById("endTime").value == "") {
                            endTime = "";
                        }
                        $("#btnSaveTimeSheetOne").trigger("click");
                    } else {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        if (checkStartTime != "" && checkEndTime == "" && $('#btnHoldOne').prop('disabled') == true) {
                            let startDate = initialDate.getFullYear() + "-" + ("0" + (initialDate.getMonth() + 1)).slice(-2) + "-" + ("0" + (initialDate.getDate())).slice(-2);
                            let endDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
                            let endTime = $('#endTime').val() || ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
                            let startTime = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
                            toUpdate = {
                                type: "TTimeLog",
                                fields: {
                                    ID: latestTimeLogId,
                                    EndDatetime: endDate + ' ' + endTime
                                }
                            }

                            newEntry = {
                                type: "TTimeLog",
                                fields: {
                                    TimeSheetID: updateID,
                                    StartDatetime: endDate + ' ' + startTime,
                                    Product: product,
                                    Description: "Job Continued"
                                }
                            }

                            let updateTimeSheet = {
                                type: "TTimeSheet",
                                fields: {
                                    ID: updateID,
                                    InvoiceNotes: "Clocked On"
                                }
                            }

                            contactService.saveTimeSheetLog(newEntry).then(function (savedData) {
                                contactService.saveTimeSheetLog(toUpdate).then(function (savedData1) {
                                    contactService.saveClockTimeSheet(updateTimeSheet).then(function (savedTimesheetData) {
                                        sideBarService.getAllTimeSheetList().then(function (data) {
                                            addVS1Data('TTimeSheet', JSON.stringify(data));
                                            setTimeout(function () {
                                                window.open('/timesheet', '_self');
                                            }, 500);
                                        })
                                    }).catch(function (err) {
                                        swal({
                                            title: 'Oooops...',
                                            text: err,
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {
                                                // Meteor._reload.reload();
                                            } else if (result.dismiss === 'cancel') {}
                                        });
                                        $('.fullScreenSpin').css('display', 'none');
                                    }).catch(function (err) {});
                                    // contactService.saveClockonClockOff(toUpdate).then(function (data) {

                                    // })
                                }).catch(function (err) {
                                    swal({
                                        title: 'Oooops...',
                                        text: err,
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {
                                            // Meteor._reload.reload();
                                        } else if (result.dismiss === 'cancel') {}
                                    });
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }).catch(function (err) {
                                swal({
                                    title: 'Oooops...',
                                    text: err,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {
                                        // Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {}
                                });
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        } else if (clockList.length < 1) {
                            $("#startTime").val(moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm'));
                            $("#btnSaveTimeSheetOne").trigger("click");
                        } else {
                            $('.fullScreenSpin').css('display', 'none');
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
                'click #btnClockOff': function () {
                    let templateObject = Template.instance();
                    let clockList = templateObject.timesheetrecords.get();
                    let clockListStandBy = templateObject.timesheetrecords.get();
                    let index = clockList.map(function (e) {
                        return e.id;
                    }).indexOf(parseInt($("#updateID").val()));
                    clockList = clockList.filter(clkList => {
                        return clkList.employee == $('#employee_name').val() && clkList.id == $('#updateID').val();
                    });
                    let contactService = new ContactService();
                    let updateID = $("#updateID").val() || "";
                    let startTime = $("#startTime").val() || "";
                    let checkStatus = "";
                    let checkStartTime = "";
                    let checkEndTime = "";
                    let latestTimeLogId = "";
                    var product = $('#product-listone').val() || '';
                    let toUpdate = {};
                    let date = new Date();
                    let initialDate = new Date($("#dtSODate").datepicker("getDate"));
                    // new Date(moment($("#dtSODate").datepicker("getDate")).format("YYYY-MM-DD"));
                    if (clockList.length > 0) {
                      let getstartDatedata = clockList[clockList.length - 1].startTime.split(' ')[0] ||'';
                      let dateInnitialDate = new Date(getstartDatedata);
                      initialDate = new Date(getstartDatedata)||initialDate;
                        if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                            checkStatus = clockList[clockList.length - 1].isPaused || "";
                            latestTimeLogId = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.ID || "";
                            checkStartTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime || "";
                            checkEndTime = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.EndDatetime || "";
                        } else {
                            checkStatus = clockList[clockList.length - 1].isPaused || "";
                            latestTimeLogId = clockList[clockList.length - 1].timelog.fields.ID || "";
                            checkStartTime = clockList[clockList.length - 1].timelog.fields.StartDatetime || "";
                            checkEndTime = clockList[clockList.length - 1].timelog.fields.EndDatetime || "";
                        }
                    }
                    if (startTime == "") {
                        swal({
                            title: 'Oooops...',
                            text: "Please Clock In before you can Clock Off",
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                // Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    } else if (checkStatus == "paused") {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'End Timesheet',
                            text: 'This Timesheet is Currently "On Hold", Do you want to "Clock Off"? ',
                            type: 'question',
                            showCancelButton: true,
                            denyButtonText: 'Continue',
                            confirmButtonText: 'Yes'
                        }).then((result) => {
                            if (result.value) {
                                $('.fullScreenSpin').css('display', 'inline-block');
                                document.getElementById("endTime").value = moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm');
                                let startDate = initialDate.getFullYear() + "-" + ("0" + (initialDate.getMonth() + 1)).slice(-2) + "-" + ("0" + (initialDate.getDate())).slice(-2);
                                let endDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);

                                let startTime = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
                                let endTime = $('endTime').val();
                                toUpdate = {
                                    type: "TTimeLog",
                                    fields: {
                                        ID: latestTimeLogId,
                                        EndDatetime: endDate + ' ' + endTime
                                    }
                                }

                                let newEntry = {
                                    type: "TTimeLog",
                                    fields: {
                                        TimeSheetID: updateID,
                                        StartDatetime: endDate + ' ' + startTime,
                                        Product: product,
                                        Description: "Job Continued"
                                    }
                                }

                                let updateTimeSheet = {
                                    type: "TTimeSheet",
                                    fields: {
                                        ID: updateID,
                                        InvoiceNotes: "Clocked On"
                                    }
                                }

                                contactService.saveTimeSheetLog(newEntry).then(function (savedData) {
                                    contactService.saveTimeSheetLog(toUpdate).then(function (savedData1) {
                                        contactService.saveClockTimeSheet(updateTimeSheet).then(function (savedTimesheetData) {
                                            clockListStandBy[index].isPaused = "";
                                            templateObject.timesheetrecords.set(clockListStandBy);
                                            $('.paused').hide();
                                            $("#btnHoldOne").removeClass("mt-32");
                                            //document.getElementById("endTime").value = moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm');
                                            var endTime = new Date(endDate + ' ' + document.getElementById("endTime").value);
                                            var startTime = new Date(startDate + ' ' + document.getElementById("startTime").value);
                                            if (endTime > startTime) {
                                                let hours = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
                                                document.getElementById('txtBookedHoursSpent').value = templateObject.timeFormat(hours);
                                                $("#btnSaveTimeSheetOne").trigger("click");
                                            } else {
                                                swal({
                                                    title: 'Oooops...',
                                                    text: "Start Time can't be greater than End Time",
                                                    type: 'error',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Ok'
                                                })
                                            }
                                        }).catch(function (err) {
                                            swal({
                                                title: 'Oooops...',
                                                text: err,
                                                type: 'error',
                                                showCancelButton: false,
                                                confirmButtonText: 'Try Again'
                                            }).then((result) => {
                                                if (result.value) {
                                                    // Meteor._reload.reload();
                                                } else if (result.dismiss === 'cancel') {}
                                            });
                                            $('.fullScreenSpin').css('display', 'none');
                                        }).catch(function (err) {});
                                        // contactService.saveClockonClockOff(toUpdate).then(function (data) {

                                        // })
                                    }).catch(function (err) {
                                        swal({
                                            title: 'Oooops...',
                                            text: err,
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {
                                                // Meteor._reload.reload();
                                            } else if (result.dismiss === 'cancel') {}
                                        });
                                        $('.fullScreenSpin').css('display', 'none');
                                    });
                                }).catch(function (err) {
                                    swal({
                                        title: 'Oooops...',
                                        text: err,
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {
                                            // Meteor._reload.reload();
                                        } else if (result.dismiss === 'cancel') {}
                                    });
                                    $('.fullScreenSpin').css('display', 'none');
                                });

                                //$("#btnClockOn").trigger("click");
                            }

                        });
                    } else {
                        swal({
                            title: 'End Timesheet',
                            text: "Are you sure you want to Clock Off",
                            type: 'question',
                            showCancelButton: true,
                            confirmButtonText: 'Yes'
                        }).then((result) => {
                            if (result.value) {
                                document.getElementById("endTime").value = moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm');
                                let startDate = initialDate.getFullYear() + "-" + ("0" + (initialDate.getMonth() + 1)).slice(-2) + "-" + ("0" + (initialDate.getDate())).slice(-2);
                                let endDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);

                                let startDateFormat = initialDate.getFullYear() + "/" + ("0" + (initialDate.getMonth() + 1)).slice(-2) + "/" + ("0" + (initialDate.getDate())).slice(-2);
                                let endDateFormat = date.getFullYear() + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + (date.getDate())).slice(-2);

                                var startTime = new Date(startDateFormat + ' ' + document.getElementById("startTime").value);
                                var endTime = new Date(endDateFormat + ' ' + document.getElementById("endTime").value);

                                if (endTime > startTime) {
                                    let hours = parseFloat(templateObject.diff_hours(endTime, startTime)).toFixed(2);
                                    document.getElementById('txtBookedHoursSpent').value = templateObject.timeFormat(hours);
                                    $("#btnSaveTimeSheetOne").trigger("click");
                                } else {
                                    swal({
                                        title: 'Oooops...',
                                        text: "Start Time can't be greater than End Time",
                                        type: 'error',
                                        showCancelButton: true,
                                        confirmButtonText: 'Ok'
                                    })
                                }
                            }

                        });

                    }
                },
                'click #btnHoldOne': function (event) {
                    $('#frmOnHoldModal').modal('show');
                },
                'click .btnSaveTimeSheetForm': function () {
                    $('.fullScreenSpin').css('display', 'inline-block');
                    let templateObject = Template.instance();
                    let contactService = new ContactService();
                    let timesheetID = $('#edtTimesheetID').val();
                    var employeeName = $('#sltEmployee').val();
                    var jobName = $('#sltJob').val();
                    // var edthourlyRate = $('.lineEditHourlyRate').val() || 0;
                    var edthour = $('.lineEditHour').val() || 0;
                    var techNotes = $('.lineEditTechNotes').val() || '';
                    var product = $('#product-list').children("option:selected").text() || '';
                    // var taxcode = $('#sltTaxCode').val();
                    // var accountdesc = $('#txaAccountDescription').val();
                    // var bankaccountname = $('#edtBankAccountName').val();
                    // var bankbsb = $('#edtBSB').val();
                    // var bankacountno = $('#edtBankAccountNo').val();
                    // let isBankAccount = templateObject.isBankAccount.get();
                    let data = '';
                    if (timesheetID == "") {
                        data = {
                            type: "TTimeSheetEntry",
                            fields: {
                                // "EntryDate":"2020-10-12 12:39:14",
                                TimeSheet: [{
                                        type: "TTimeSheet",
                                        fields: {
                                            EmployeeName: employeeName || '',
                                            // HourlyRate:50,
                                            ServiceName: product,
                                            Allowedit: true,
                                            // ChargeRate: 100,
                                            Hours: parseInt(edthour) || 0,
                                            // OverheadRate: 90,
                                            Job: jobName || '',
                                            // ServiceName: "Test"|| '',
                                            TimeSheetClassName: "Default" || '',
                                            Notes: techNotes || ''
                                            // EntryDate: accountdesc|| ''
                                        }
                                    }
                                ],
                                "TypeName": "Payroll",
                                "WhoEntered": Session.get('mySessionEmployee') || ""
                            }
                        };

                        contactService.saveTimeSheet(data).then(function (data) {
                            sideBarService.getAllTimeSheetList().then(function (data) {
                                addVS1Data('TTimeSheet', JSON.stringify(data));
                                setTimeout(function () {
                                    window.open('/timesheet', '_self');
                                }, 500);
                            });
                        }).catch(function (err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    // Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    } else {
                        data = {
                            type: "TTimeSheet",
                            //fields:{
                            // "EntryDate":"2020-10-12 12:39:14",
                            // TimeSheet:[{
                            // type: "TTimeSheet",
                            fields: {
                                ID: timesheetID,
                                EmployeeName: employeeName || '',
                                // HourlyRate:50,
                                ServiceName: product,
                                Allowedit: true,
                                // ChargeRate: 100,
                                Hours: parseInt(edthour) || 0,
                                // OverheadRate: 90,
                                Job: jobName || '',
                                // ServiceName: "Test"|| '',
                                TimeSheetClassName: "Default" || '',
                                Notes: techNotes || ''
                                // EntryDate: accountdesc|| ''
                            }
                            //  }],
                            // "TypeName":"Payroll",
                            // "WhoEntered":Session.get('mySessionEmployee')||""
                            //}
                        };

                        contactService.saveTimeSheetUpdate(data).then(function (data) {
                            window.open('/timesheet', '_self');
                        }).catch(function (err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    // Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    }

                },
                'click #btnSaveTimeSheetOne': async function () {
                    $('.fullScreenSpin').css('display', 'inline-block');
                    let templateObject = Template.instance();
                    let checkStatus = "";
                    let checkStartTime = "";
                    let checkEndTime = "";
                    let TimeSheetHours = 0;
                    let updateID = $("#updateID").val() || "";
                    let contactService = new ContactService();

                    /* Filter to check Date Set */

                    var currentBeginDate = new Date();
                    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
                    let fromDateMonth = (currentBeginDate.getMonth() + 1);
                    let fromDateDay = currentBeginDate.getDate();
                    if((currentBeginDate.getMonth()+1) < 10){
                        fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
                    }else{
                      fromDateMonth = (currentBeginDate.getMonth()+1);
                    }

                    if(currentBeginDate.getDate() < 10){
                        fromDateDay = "0" + currentBeginDate.getDate();
                    }

                    var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();

                    let prevMonthToDate = (moment().subtract(reportsloadMonths, 'months')).format("DD/MM/YYYY");



                    var toDate = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
                    let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");


                    /* Filter to check Date Set */

                    let clockList = templateObject.timesheetrecords.get();

                let getEmpIDFromLine = $('.employee_name').val() || '';
                if(getEmpIDFromLine != ''){
                  let checkEmpTimeSettings = await contactService.getCheckTimeEmployeeSettingByName(getEmpIDFromLine) || '';
                  if(checkEmpTimeSettings != ''){
                    if(checkEmpTimeSettings.temployee[0].CustFld8 == 'false'){
                      var productcost = parseFloat($('#edtProductCost').val()) || 0;
                    }else{
                      var productcost = 0;
                    }

                  }
              } else {
                var productcost = 0;
              }
                    clockList = clockList.filter(clkList => {
                        return clkList.employee == $('#employee_name').val() && clkList.id == $('#updateID').val();
                    });

                    if (clockList.length > 0) {
                        if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                            checkStatus = clockList[clockList.length - 1].isPaused || "";
                            TimeSheetHours: clockList[clockList.length - 1].hours || "";
                            latestTimeLogId = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.ID || "";
                            checkStartTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime || "";
                            checkEndTime = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.EndDatetime || "";
                        } else {
                            checkStatus = clockList[clockList.length - 1].isPaused || "";
                            TimeSheetHours: clockList[clockList.length - 1].hours || "";
                            latestTimeLogId = clockList[clockList.length - 1].timelog.fields.ID || "";
                            checkStartTime = clockList[clockList.length - 1].timelog.fields.StartDatetime || "";
                            checkEndTime = clockList[clockList.length - 1].timelog.fields.EndDatetime || "";
                        }
                    }

                    var employeeName = $('.employee_name').val();
                    var startdateGet = new Date($("#dtSODate").datepicker("getDate"));
                    var endDateGet = new Date();
                    let date = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + startdateGet.getDate()).slice(-2);
                    let endDate = endDateGet.getFullYear() + "-" + ("0" + (endDateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + endDateGet.getDate()).slice(-2);
                    var startTime = $('#startTime').val() || '';
                    var endTime = $('#endTime').val() || '';
                    var edthour = $('#txtBookedHoursSpent').val() || '00:01';
                    let hours = templateObject.timeToDecimal(edthour);
                    var techNotes = $('#txtNotesOne').val() || '';
                    var product = $('#product-listone').val() || '';
                    var productcost = parseFloat($('#edtProductCost').val()) || 0;
                    var jobName = $('#sltJobOne').val() || '';
                    let isPaused = checkStatus;
                    let toUpdate = {};
                    let obj = {};
                    let data = '';

                    if (startTime != "") {
                        startTime = date + ' ' + startTime;
                    }

                    if (endTime != "") {
                        endTime = endDate + ' ' + endTime;
                    }

                    if (hours != 0) {
                        edthour = hours + parseFloat($('#txtBookedHoursSpent1').val());
                    }

                    if (hours != 0) {
                        obj = {
                            type: "TTimeLog",
                            fields: {
                                TimeSheetID: updateID,
                                EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                                StartDatetime: checkStartTime,
                                EndDatetime: endTime,
                                Product: product,
                                Description: 'Timesheet Completed',
                                EnteredBy: Session.get('mySessionEmployeeLoggedID')
                            }
                        };
                        isPaused = "completed";
                    }

                    // if (checkStartTime == "" && endTime != "") {
                    //     $('.fullScreenSpin').css('display', 'none');
                    //     swal({
                    //         title: 'Oooops...',
                    //         text: "You can't clock off, because you haven't clocked in",
                    //         type: 'warning',
                    //         showCancelButton: false,
                    //         confirmButtonText: 'Try Again'
                    //     }).then((result) => {
                    //         if (result.value) {
                    //             // Meteor._reload.reload();
                    //         } else if (result.dismiss === 'cancel') {}
                    //     });
                    //     return false;
                    // }

                    if (checkStartTime == "" && startTime == "") {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oooops...',
                            text: "You can't save this entry with no start time",
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                // Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        return false;
                    }

                    if (updateID != "") {
                        result = clockList.filter(Timesheet => {
                            return Timesheet.id == updateID
                        });

                        if (result.length > 0) {
                            if (result[0].timelog == null) {
                                obj = {
                                    type: "TTimeLog",
                                    fields: {
                                        TimeSheetID: updateID,
                                        EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                                        StartDatetime: startTime,
                                        EndDatetime: endTime,
                                        Product: product,
                                        Description: 'Timesheet Started',
                                        EnteredBy: Session.get('mySessionEmployeeLoggedID')
                                    }
                                };
                            } else if ($('#startTime').val() != "" && $('#endTime').val() != "" && checkStatus != "completed") {
                                let startTime1 = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + (startdateGet.getDate())).slice(-2) + ' ' + ("0" + startdateGet.getHours()).slice(-2) + ":" + ("0" + startdateGet.getMinutes()).slice(-2);
                                obj = {
                                    type: "TTimeLog",
                                    fields: {
                                        TimeSheetID: updateID,
                                        EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                                        StartDatetime: checkStartTime,
                                        EndDatetime: endTime,
                                        Product: product,
                                        Description: 'Timesheet Completed',
                                        EnteredBy: Session.get('mySessionEmployeeLoggedID')
                                    }
                                };
                                isPaused = "completed";
                            } else if (checkEndTime != "") {
                                aEndDate = moment().format("YYYY-MM-DD") + ' ' + endTime;
                            }
                        } else {
                            obj = {
                                type: "TTimeLog",
                                fields: {
                                    TimeSheetID: updateID,
                                    EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                                    StartDatetime: startTime,
                                    EndDatetime: endTime,
                                    Product: product,
                                    Description: 'Timesheet Started',
                                    EnteredBy: Session.get('mySessionEmployeeLoggedID')
                                }
                            };
                        }
                    }
                    if (updateID == "") {
                        if ($('#startTime').val() != "" && $('#endTime').val() != "") {
                            obj = {
                                type: "TTimeLog",
                                fields: {
                                    EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                                    StartDatetime: startTime,
                                    EndDatetime: endTime,
                                    Product: product,
                                    Description: 'Timesheet Started & Completed',
                                    EnteredBy: Session.get('mySessionEmployeeLoggedID')
                                }
                            };
                            isPaused = "completed";
                        } else if ($('#startTime').val() != "" && $('#endTime').val() == "") {
                            obj = {
                                type: "TTimeLog",
                                fields: {
                                    EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                                    StartDatetime: startTime,
                                    EndDatetime: endTime,
                                    Product: product,
                                    Description: 'Timesheet Started',
                                    EnteredBy: Session.get('mySessionEmployeeLoggedID')
                                }
                            };
                            isPaused = "";
                        }

                        data = {
                            type: "TTimeSheetEntry",
                            fields: {
                                // "EntryDate":"2020-10-12 12:39:14",
                                TimeSheet: [{
                                        type: "TTimeSheet",
                                        fields: {
                                            EmployeeName: employeeName || '',
                                            ServiceName: product || '',
                                            HourlyRate: productcost || 0,
                                            LabourCost: 1,
                                            Allowedit: true,
                                            Logs: obj,
                                            TimeSheetDate: date,
                                            StartTime: startTime,
                                            EndTime: endTime,
                                            Hours: hours || 0.016666666666666666,
                                            // OverheadRate: 90,
                                            Job: jobName || '',
                                            // ServiceName: "Test"|| '',
                                            TimeSheetClassName: "Default" || '',
                                            Notes: techNotes || '',
                                            InvoiceNotes: "Clocked On" || ""
                                            // EntryDate: accountdesc|| ''
                                        }
                                    }
                                ],
                                "TypeName": "Payroll",
                                "WhoEntered": Session.get('mySessionEmployee') || ""
                            }
                        };
                        contactService.saveTimeSheet(data).then(function (dataReturnRes) {
                            sideBarService.getAllTimeSheetList().then(function (data) {
                                addVS1Data('TTimeSheet', JSON.stringify(data));
                                Bert.alert($('#employee_name').val() + ' you are now Clocked On', 'now-success');
                                $('#employeeStatusField').removeClass('statusOnHold');
                                $('#employeeStatusField').removeClass('statusClockedOff');
                                $('#employeeStatusField').addClass('statusClockedOn').text('Clocked On');
                                $('#startTime').prop('disabled', true);
                                templateObject.datatablerecords.set([]);
                                templateObject.datatablerecords1.set([]);

                                //Newly added

                                //templateObject.getAllTimeSheetData();
                                templateObject.getAllTimeSheetDataClock();

                                if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {
                                  templateObject.getAllFilterTimeSheetData('','', true);
                                } else {
                                  templateObject.getAllFilterTimeSheetData(prevMonth11Date,toDate, false);
                                }
                                $('#settingsModal').modal('hide');
                                // setTimeout(function(){
                                // let getTimesheetRecords = templateObject.timesheetrecords.get();
                                //  let getLatestTimesheet = getTimesheetRecords.filter(clkList => {
                                //     return clkList.employee == employeeName;
                                // });
                                //  $('#updateID').val(getLatestTimesheet[getLatestTimesheet.length - 1].id || '');
                                $('.fullScreenSpin').css('display', 'none');
                            // },1500);

                            })
                        }).catch(function (err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    // Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    } else {
                        data = {
                            type: "TTimeSheet",
                            fields: {
                                ID: updateID,
                                EmployeeName: employeeName || '',
                                ServiceName: product || '',
                                HourlyRate: productcost || 0,
                                LabourCost: 1,
                                Allowedit: true,
                                Hours: hours || 0.016666666666666666,
                                TimeSheetDate: date,
                                StartTime: startTime,
                                EndTime: endTime,
                                // OverheadRate: 90,
                                Job: jobName || '',
                                // ServiceName: "Test"|| '',
                                TimeSheetClassName: "Default" || '',
                                Notes: techNotes || '',
                                InvoiceNotes: isPaused
                                // EntryDate: accountdesc|| ''
                            }

                        };
                        contactService.saveClockTimeSheet(data).then(function (data) {
                            if (Object.keys(obj).length > 0) {
                                if (obj.fields.Description == "Timesheet Completed") {
                                    let endTime1 = endTime;
                                    if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                                        toUpdateID = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.ID;
                                    } else {
                                        toUpdateID = clockList[clockList.length - 1].timelog.fields.ID;
                                    }

                                    if (toUpdateID != "") {
                                        updateData = {
                                            type: "TTimeLog",
                                            fields: {
                                                ID: toUpdateID,
                                                EndDatetime: endTime1,
                                            }
                                        }
                                    }
                                    contactService.saveTimeSheetLog(obj).then(function (data) {
                                        contactService.saveTimeSheetLog(updateData).then(function (data) {
                                            sideBarService.getAllTimeSheetList().then(function (data) {
                                                addVS1Data('TTimeSheet', JSON.stringify(data));
                                                setTimeout(function () {
                                                    window.open('/timesheet', '_self');
                                                }, 500);
                                            })
                                        }).catch(function (err) {})
                                    }).catch(function (err) {})
                                } else if (obj.fields.Description == "Timesheet Started") {
                                    contactService.saveTimeSheetLog(obj).then(function (data) {
                                        sideBarService.getAllTimeSheetList().then(function (data) {
                                            addVS1Data('TTimeSheet', JSON.stringify(data));
                                            setTimeout(function () {
                                                window.open('/timesheet', '_self');
                                            }, 500);
                                        })
                                    }).catch(function (err) {})
                                }
                            } else {
                                sideBarService.getAllTimeSheetList().then(function (data) {
                                    addVS1Data('TTimeSheet', JSON.stringify(data));
                                    setTimeout(function () {
                                        window.open('/timesheet', '_self');
                                    }, 500);
                                })
                            }

                        }).catch(function (err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    // Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }

                },
                'click #processTimesheet': function () {
                    $('.fullScreenSpin').css('display', 'inline-block');
                    const templateObject = Template.instance();
                    let selectClient = templateObject.selectedTimesheet.get();
                    let contactService = new ContactService();
                    if (selectClient.length === 0) {
                        swal('Please select Timesheet to Process', '', 'info');
                        $('.fullScreenSpin').css('display', 'none');
                    } else {
                        for (let x = 0; x < selectClient.length; x++) {

                            let data = {
                                type: "TTimeSheet",
                                fields: {
                                    ID: selectClient[x].AppointID,
                                    Status: "Processed"
                                }

                            };
                            contactService.saveClockTimeSheet(data).then(function (data) {
                                if ((x + 1) == selectClient.length) {
                                    sideBarService.getAllTimeSheetList().then(function (data) {
                                        addVS1Data('TTimeSheet', JSON.stringify(data));
                                        setTimeout(function () {
                                            window.open('/timesheet', '_self');
                                        }, 200);
                                    })
                                }
                            }).catch(function (err) {
                                swal({
                                    title: 'Oooops...',
                                    text: err,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {
                                        // Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {}
                                });
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }

                        $('.fullScreenSpin').css('display', 'none');
                    }
                },
                'click .btnInvoice': function () {
                  swal('Coming Soon', '', 'info');
                },

                'click .processTimesheet': function () {
                    $('.fullScreenSpin').css('display', 'inline-block');
                    let templateObject = Template.instance();
                    let checkStatus = "";
                    let checkStartTime = "";
                    let checkEndTime = "";
                    let TimeSheetHours = 0;
                    let updateID = $("#updateID").val() || "";
                    let contactService = new ContactService();
                    var startTime = $('#startTime').val() || '';
                    var endTime = $('#endTime').val() || '';
                    if (startTime == "" || endTime == "") {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oooops...',
                            text: "Please enter Start and End Time to process this TimeSheet",
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                // Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        return false;
                    }

                    let clockList = templateObject.timesheetrecords.get();
                    clockList = clockList.filter(clkList => {
                        return clkList.employee == $('#employee_name').val() && clkList.id == $('#updateID').val();
                    });

                    if (clockList.length > 0) {
                        if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                            checkStatus = clockList[clockList.length - 1].isPaused || "";
                            TimeSheetHours: clockList[clockList.length - 1].hours || "";
                            latestTimeLogId = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.ID || "";
                            checkStartTime = clockList[clockList.length - 1].timelog[0].fields.StartDatetime || "";
                            checkEndTime = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.EndDatetime || "";
                        } else {
                            checkStatus = clockList[clockList.length - 1].isPaused || "";
                            TimeSheetHours: clockList[clockList.length - 1].hours || "";
                            latestTimeLogId = clockList[clockList.length - 1].timelog.fields.ID || "";
                            checkStartTime = clockList[clockList.length - 1].timelog.fields.StartDatetime || "";
                            checkEndTime = clockList[clockList.length - 1].timelog.fields.EndDatetime || "";
                        }
                    }

                    var employeeName = $('.employee_name').val();
                    var startdateGet = new Date($("#dtSODate").datepicker("getDate"));
                    let date = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + startdateGet.getDate()).slice(-2);
                    var edthour = $('#txtBookedHoursSpent').val() || 0.01;
                    let hours = templateObject.timeToDecimal(edthour);
                    var techNotes = $('#txtNotesOne').val() || '';
                    var product = $('#product-listone').val() || '';
                    var jobName = $('#sltJobOne').val() || '';
                    var status = "Processed"
                    let isPaused = checkStatus;
                    let toUpdate = {};
                    let obj = {};
                    let data = '';
                    if (startTime != "") {
                        startTime = date + ' ' + startTime;
                    }

                    if (endTime != "") {
                        endTime = date + ' ' + endTime;
                    }

                    if ($('#txtBookedHoursSpent1').val() != 0.01) {
                        edthour = parseFloat(edthour) + parseFloat($('#txtBookedHoursSpent1').val());
                    }

                    if (checkStartTime == "" && startTime == "") {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oooops...',
                            text: "You can't save this entry with no start time",
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                // Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        return false;
                    }

                    if (updateID != "") {
                        result = clockList.filter(Timesheet => {
                            return Timesheet.id == updateID
                        });

                        if (result.length > 0) {
                            if (result[0].timelog == null) {
                                obj = {
                                    type: "TTimeLog",
                                    fields: {
                                        TimeSheetID: updateID,
                                        EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                                        StartDatetime: startTime,
                                        EndDatetime: endTime,
                                        Product: product,
                                        Description: 'Timesheet Processed',
                                        EnteredBy: Session.get('mySessionEmployeeLoggedID')
                                    }
                                };
                                isPaused = "completed";
                            } else if ($('#startTime').val() != "" && $('#endTime').val() != "" && checkStatus != "completed") {
                                let startTime1 = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + (startdateGet.getDate())).slice(-2) + ' ' + ("0" + startdateGet.getHours()).slice(-2) + ":" + ("0" + startdateGet.getMinutes()).slice(-2);
                                obj = {
                                    type: "TTimeLog",
                                    fields: {
                                        TimeSheetID: updateID,
                                        EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                                        StartDatetime: checkStartTime,
                                        EndDatetime: endTime,
                                        Product: product,
                                        Description: 'Timesheet Processed',
                                        EnteredBy: Session.get('mySessionEmployeeLoggedID')
                                    }
                                };
                                isPaused = "completed";
                            } else if (checkEndTime != "") {
                                aEndDate = moment().format("YYYY-MM-DD") + ' ' + endTime;
                            }
                        } else {
                            obj = {
                                type: "TTimeLog",
                                fields: {
                                    TimeSheetID: updateID,
                                    EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                                    StartDatetime: startTime,
                                    EndDatetime: endTime,
                                    Product: product,
                                    Description: 'Timesheet Processed',
                                    EnteredBy: Session.get('mySessionEmployeeLoggedID')
                                }
                            };
                            isPaused = "completed";
                        }
                    }
                    if (updateID == "") {
                        if ($('#tActualStartTime').val() != "") {
                            obj = {
                                type: "TTimeLog",
                                fields: {
                                    EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                                    StartDatetime: startTime,
                                    EndDatetime: endTime,
                                    Product: product,
                                    Description: 'Timesheet Processed',
                                    EnteredBy: Session.get('mySessionEmployeeLoggedID')
                                }
                            };
                            isPaused = "completed";
                        } else if ($('#tActualStartTime').val() != "" && $('#tActualEndTime').val() != "") {
                            obj = {
                                type: "TTimeLog",
                                fields: {
                                    EmployeeID: Session.get('mySessionEmployeeLoggedID'),
                                    StartDatetime: startTime,
                                    EndDatetime: endTime,
                                    Product: product,
                                    Description: 'Timesheet Processed',
                                    EnteredBy: Session.get('mySessionEmployeeLoggedID')
                                }
                            };

                            isPaused = "completed";
                        }
                        data = {
                            type: "TTimeSheetEntry",
                            fields: {
                                // "EntryDate":"2020-10-12 12:39:14",
                                TimeSheet: [{
                                        type: "TTimeSheet",
                                        fields: {
                                            EmployeeName: employeeName || '',
                                            ServiceName: product || '',
                                            LabourCost: 1,
                                            Allowedit: true,
                                            Logs: obj,
                                            Hours: hours || 0.01,
                                            Status: status,
                                            // OverheadRate: 90,
                                            Job: jobName || '',
                                            // ServiceName: "Test"|| '',
                                            TimeSheetClassName: "Default" || '',
                                            Notes: techNotes || '',
                                            Status: status,
                                            InvoiceNotes: "completed"
                                            // EntryDate: accountdesc|| ''
                                        }
                                    }
                                ],
                                "TypeName": "Payroll",
                                "WhoEntered": Session.get('mySessionEmployee') || ""
                            }
                        };
                        contactService.saveTimeSheet(data).then(function (data) {
                            sideBarService.getAllTimeSheetList().then(function (data) {
                                addVS1Data('TTimeSheet', JSON.stringify(data));
                                setTimeout(function () {
                                    window.open('/timesheet', '_self');
                                }, 500);
                            })
                        }).catch(function (err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    // Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    } else {
                        data = {
                            type: "TTimeSheet",
                            fields: {
                                ID: updateID,
                                EmployeeName: employeeName || '',
                                ServiceName: product || '',
                                LabourCost: 1,
                                Allowedit: true,
                                Hours: hours || 0.01,
                                Status: status,
                                // OverheadRate: 90,
                                Job: jobName || '',
                                // ServiceName: "Test"|| '',
                                TimeSheetClassName: "Default" || '',
                                Notes: techNotes || '',
                                InvoiceNotes: "completed"
                                // EntryDate: accountdesc|| ''
                            }

                        };

                        contactService.saveClockTimeSheet(data).then(function (data) {
                            if (Object.keys(obj).length > 0) {
                                if (obj.fields.Description == "Timesheet Processed") {
                                    let endTime1 = endTime;
                                    if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                                        toUpdateID = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.ID;
                                    } else {
                                        toUpdateID = clockList[clockList.length - 1].timelog.fields.ID;
                                    }

                                    if (toUpdateID != "") {
                                        updateData = {
                                            type: "TTimeLog",
                                            fields: {
                                                ID: toUpdateID,
                                                EndDatetime: endTime1,
                                            }
                                        }
                                    }
                                    contactService.saveTimeSheetLog(obj).then(function (data) {
                                        contactService.saveTimeSheetLog(updateData).then(function (data) {
                                            sideBarService.getAllTimeSheetList().then(function (data) {
                                                addVS1Data('TTimeSheet', JSON.stringify(data));
                                                setTimeout(function () {
                                                    window.open('/timesheet', '_self');
                                                }, 500);
                                            })
                                        }).catch(function (err) {})
                                    }).catch(function (err) {})
                                } else if (obj.fields.Description == "Timesheet Processed") {
                                    contactService.saveTimeSheetLog(obj).then(function (data) {
                                        sideBarService.getAllTimeSheetList().then(function (data) {
                                            addVS1Data('TTimeSheet', JSON.stringify(data));
                                            setTimeout(function () {
                                                window.open('/timesheet', '_self');
                                            }, 500);
                                        })
                                    }).catch(function (err) {})
                                }
                            } else {
                                sideBarService.getAllTimeSheetList().then(function (data) {
                                    addVS1Data('TTimeSheet', JSON.stringify(data));
                                    setTimeout(function () {
                                        window.open('/timesheet', '_self');
                                    }, 500);
                                })
                            }

                        }).catch(function (err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    // Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }

                },
                'click .btnAddNewAccounts': function () {

                    $('#add-account-title').text('Add New Account');
                    $('#edtAccountID').val('');
                    $('#sltAccountType').val('');
                    $('#sltAccountType').removeAttr('readonly', true);
                    $('#sltAccountType').removeAttr('disabled', 'disabled');
                    $('#edtAccountName').val('');
                    $('#edtAccountName').attr('readonly', false);
                    $('#edtAccountNo').val('');
                    $('#sltTaxCode').val(loggedTaxCodePurchaseInc || '');
                    $('#txaAccountDescription').val('');
                    $('#edtBankAccountName').val('');
                    $('#edtBSB').val('');
                    $('#edtBankAccountNo').val('');
                },
                'click .printConfirm': function (event) {
                    $('.fullScreenSpin').css('display', 'inline-block');
                    jQuery('#tblTimeSheet_wrapper .dt-buttons .btntabletopdf').click();
                    $('.fullScreenSpin').css('display', 'none');
                },
                'click #btnHoldOne': function (event) {
                    $('#frmOnHoldModal').modal('show');
                },
                'click .btnTimesheetListOne': function (event) {
                    $('.modal-backdrop').css('display', 'none');
                    let id = $('#updateID').val();
                    if (id) {
                        FlowRouter.go('/timesheettimelog?id=' + id);
                    } else {
                        FlowRouter.go('/timesheettimelog');
                    }
                },
                'click #btnHold': function (event) {
                    $('#frmOnHoldModal').modal('show');
                },
                'click .btnPauseJobOne': function (event) {

                    $('.fullScreenSpin').css('display', 'inline-block');
                    templateObject = Template.instance();
                    let contactService = new ContactService();
                    let checkStatus = "";
                    let checkStartTime = "";
                    let checkEndTime = "";
                    let updateID = $("#updateID").val() || "";
                    let notes = $("#txtpause-notes").val() || "";
                    let latestTimeLogId = '';
                    var product = $('#product-listone').val() || '';
                    let type = "Break";
                    if ($('#break').is(":checked")) {
                        type = $('#break').val();
                    } else if ($('#lunch').is(":checked")) {
                        type = $('#lunch').val();
                    } else if ($('#purchase').is(":checked")) {
                        type = $('#purchase').val();
                    } else {
                        swal({
                            title: 'Please Select Option',
                            text: 'Please select Break, Lunch or Purchase Option',
                            type: 'info',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((results) => {
                            if (results.value) {}
                            else if (results.dismiss === 'cancel') {}
                        });
                        $('.fullScreenSpin').css('display', 'none');
                        return false;
                    }

                    if (updateID == "") {
                        swal({
                            title: 'Oooops...',
                            text: 'Please save this entry before Pausing it',
                            type: 'info',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((results) => {
                            if (results.value) {}
                            else if (results.dismiss === 'cancel') {}
                        });
                        $('.fullScreenSpin').css('display', 'none');
                        return false;
                    }

                    let clockList = templateObject.timesheetrecords.get();
                    clockList = clockList.filter(clkList => {
                        return clkList.employee == $('#employee_name').val() && clkList.id == $('#updateID').val();
                    });
                    if (clockList.length > 0) {
                        if (Array.isArray(clockList[clockList.length - 1].timelog)) {
                            checkStatus = clockList[clockList.length - 1].isPaused || "";
                            latestTimeLogId = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.ID || "";
                            checkStartTime = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.StartDatetime || "";
                            checkEndTime = clockList[clockList.length - 1].timelog[clockList[clockList.length - 1].timelog.length - 1].fields.EndDatetime || "";
                        } else {
                            checkStatus = clockList[clockList.length - 1].isPaused || "";
                            latestTimeLogId = clockList[clockList.length - 1].timelog.fields.ID || "";
                            checkStartTime = clockList[clockList.length - 1].timelog.fields.StartDatetime || "";
                            checkEndTime = clockList[clockList.length - 1].timelog.fields.EndDatetime || "";
                        }
                    }

                    var employeeName = $('.employee_name').val();
                    var startdateGet = new Date();
                    let date = startdateGet.getFullYear() + "-" + ("0" + (startdateGet.getMonth() + 1)).slice(-2) + "-" + ("0" + startdateGet.getDate()).slice(-2);
                    var startTime = ("0" + startdateGet.getHours()).slice(-2) + ':' + ("0" + startdateGet.getMinutes()).slice(-2);
                    var endTime = ("0" + startdateGet.getHours()).slice(-2) + ':' + ("0" + startdateGet.getMinutes()).slice(-2);
                    let toUpdate = {};
                    let data = '';
                    if (startTime != "") {
                        startTime = date + ' ' + startTime;
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
                            EndDatetime: date + ' ' + endTime
                        }
                    }

                    data = {
                        type: "TTimeLog",
                        fields: {
                            TimeSheetID: updateID,
                            Description: type + ": " + notes || '',
                            EmployeeName: employeeName,
                            StartDatetime: startTime,
                            Product: product
                        }
                    }

                    contactService.saveTimeSheetLog(data).then(function (savedData) {
                        let updateTimeSheet = {
                            type: "TTimeSheet",
                            fields: {
                                ID: updateID,
                                InvoiceNotes: "paused",
                                EmployeeName: employeeName,
                            }
                        }
                        contactService.saveClockTimeSheet(updateTimeSheet).then(function (savedTimesheetData) {

                            contactService.saveTimeSheetLog(toUpdate).then(function (data) {
                                sideBarService.getAllTimeSheetList().then(function (data) {
                                    addVS1Data('TTimeSheet', JSON.stringify(data));
                                    setTimeout(function () {
                                        window.open('/timesheet', '_self');
                                    }, 500);
                                })
                            }).catch(function (err) {
                                swal({
                                    title: 'Oooops...',
                                    text: err,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {
                                        // Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {}
                                });
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }).catch(function (err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    // Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });

                        // contactService.saveClockonClockOff(toUpdate).then(function (data) {
                        //     FlowRouter.go('/employeetimeclock');
                        // })
                    }).catch(function (err) {
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                // Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    });

                },
                'change #lunch': function (event) {
                    $('#break').prop('checked', false);
                    $('#purchase').prop('checked', false);
                },
                'change #break': function (event) {
                    $('#lunch').prop('checked', false);
                    $('#purchase').prop('checked', false);
                },
                'change #purchase': function (event) {
                    $('#break').prop('checked', false);
                    $('#lunch').prop('checked', false);
                },
                'click .btnDeleteTimeSheetOne': function () {
                    // $('.fullScreenSpin').css('display', 'inline-block');
                    let templateObject = Template.instance();
                    let contactService = new ContactService();

                    swal({
                        title: 'Delete TimeSheet',
                        text: "Are you sure you want to Delete this TimeSheet?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes'
                    }).then((result) => {
                        if (result.value) {
                          $('.fullScreenSpin').css('display', 'inline-block');
                          let timesheetID = $('#updateID').val();
                          if (timesheetID == "") {
                              $('.fullScreenSpin').css('display', 'none');
                          } else {
                              data = {
                                  type: "TTimeSheet",
                                  fields: {
                                      ID: timesheetID,
                                      Active: false,
                                  }
                              };

                              contactService.saveTimeSheetUpdate(data).then(function (data) {
                                  sideBarService.getAllTimeSheetList().then(function (data) {
                                      addVS1Data('TTimeSheet', JSON.stringify(data));
                                      setTimeout(function () {
                                          window.open('/timesheet', '_self');
                                      }, 500);
                                  })
                              }).catch(function (err) {
                                  swal({
                                      title: 'Oooops...',
                                      text: err,
                                      type: 'error',
                                      showCancelButton: false,
                                      confirmButtonText: 'Try Again'
                                  }).then((result) => {
                                      if (result.value) {
                                          //Meteor._reload.reload();
                                      } else if (result.dismiss === 'cancel') {}
                                  });
                                  $('.fullScreenSpin').css('display', 'none');
                              });
                          }

                        } else {
                          $('.fullScreenSpin').css('display', 'none');
                        }
                    });


                },
                'blur .cashamount': function (event) {
                    let inputUnitPrice = parseFloat($(event.target).val()) || 0;
                    let utilityService = new UtilityService();
                    if (!isNaN($(event.target).val())) {
                        $(event.target).val(Currency + '' + inputUnitPrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }));
                    } else {
                        let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, ""));
                        //parseFloat(parseFloat($.trim($(event.target).text().substring(Currency.length).replace(",", ""))) || 0);
                        $(event.target).val(Currency + '' + inputUnitPrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0);
                        //$('.lineUnitPrice').text();

                    }
                },
                'blur .colRate, keyup .colRate, change .colRate': function (event) {
                    let templateObject = Template.instance();
                    let inputUnitPrice = parseFloat($(event.target).val()) || 0;
                    let utilityService = new UtilityService();
                    let totalvalue = 0;
                    let totalGrossPay = 0;
                    let totalRegular = 0;
                    let totalOvertime = 0;
                    let totalDouble = 0;
                    $(event.target).closest("tr").find("span.colRateSpan").text($(event.target).val());
                    // .closest('span').find('.colRateSpan').html($(event.target).val());
                    $('.colRate').each(function () {
                        var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
                        totalvalue = totalvalue + chkbidwithLine;
                    });

                    $('.tblTimeSheet tbody tr').each(function () {
                        var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
                        var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
                        var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
                        var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
                        // var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

                        totalRegular = (rateValue * regHourValue) || 0;
                        totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
                        totalDouble = ((rateValue * 2) * doubleeValue) || 0;
                        totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
                        $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
                    });
                    $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

                },
                'keyup .colRegHoursOne': function (event) {
                    let templateObject = Template.instance();
                    let contactService = new ContactService();
                    let id = $(event.target).closest("tr").find(".colID").text()||0;
                    let edthour = $(event.target).val() || '00:00';
                    let hours = templateObject.timeToDecimal(edthour);
                    data = {
                        type: "TTimeSheet",
                        fields: {
                            ID: id,
                            Hours: hours || 0.01
                        }

                    };

                    contactService.saveTimeSheetUpdate(data).then(function (data) {
                        sideBarService.getAllTimeSheetList().then(function (data) {
                            addVS1Data('TTimeSheet', JSON.stringify(data));
                        })
                    }).catch(function (err) {});
                },
                'blur .colRegHours, keyup .colRegHours, change .colRegHours': function (event) {
                    let templateObject = Template.instance();
                    let inputUnitPrice = parseInt($(event.target).val()) || 0;
                    let utilityService = new UtilityService();
                    let totalvalue = 0;

                    $('.colRegHours').each(function () {
                        var chkbidwithLine = Number($(this).val()) || 0;
                        totalvalue = totalvalue + chkbidwithLine;
                    });

                    $('.tblTimeSheet tbody tr').each(function () {
                        var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
                        var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
                        var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
                        var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
                        //var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

                        totalRegular = (rateValue * regHourValue) || 0;
                        totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
                        totalDouble = ((rateValue * 2) * doubleeValue) || 0;
                        totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
                        $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
                    });
                    $('.lblSumHour').text(totalvalue || 0);

                },
                'blur .colOvertime, keyup .colOvertime, change .colOvertime': function (event) {
                    let templateObject = Template.instance();
                    let inputUnitPrice = parseInt($(event.target).val()) || 0;
                    let utilityService = new UtilityService();
                    let totalvalue = 0;

                    $('.colOvertime').each(function () {
                        var chkbidwithLine = Number($(this).val()) || 0;
                        totalvalue = totalvalue + chkbidwithLine;
                    });

                    $('.tblTimeSheet tbody tr').each(function () {
                        var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
                        var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
                        var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
                        var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
                        //var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

                        totalRegular = (rateValue * regHourValue) || 0;
                        totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
                        totalDouble = ((rateValue * 2) * doubleeValue) || 0;
                        totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
                        $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
                    });
                    $('.lblSumOvertime').text(totalvalue || 0);

                },
                'blur .colDouble, keyup .colDouble, change .colDouble': function (event) {
                    let templateObject = Template.instance();
                    let inputUnitPrice = parseInt($(event.target).val()) || 0;
                    let utilityService = new UtilityService();
                    let totalvalue = 0;

                    $('.colDouble').each(function () {
                        var chkbidwithLine = Number($(this).val()) || 0;
                        totalvalue = totalvalue + chkbidwithLine;
                    });

                    $('.tblTimeSheet tbody tr').each(function () {
                        var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
                        var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
                        var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
                        var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
                        //var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

                        totalRegular = (rateValue * regHourValue) || 0;
                        totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
                        totalDouble = ((rateValue * 2) * doubleeValue) || 0;
                        totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
                        $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
                    });
                    $('.lblSumDouble').text(totalvalue || 0);

                },
                'blur .colAdditional, keyup .colAdditional, change .colAdditional': function (event) {
                    let templateObject = Template.instance();
                    let inputUnitPrice = parseFloat($(event.target).val()) || 0;
                    let utilityService = new UtilityService();
                    let totalvalue = 0;

                    $('.colAdditional').each(function () {
                        var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
                        totalvalue = totalvalue + chkbidwithLine;
                    });

                    $('.tblTimeSheet tbody tr').each(function () {
                        var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
                        var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
                        var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
                        var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
                        //var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

                        totalRegular = (rateValue * regHourValue) || 0;
                        totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
                        totalDouble = ((rateValue * 2) * doubleeValue) || 0;
                        totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
                        $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
                    });
                    $('.lblSumAdditions').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

                },
                'blur .colPaycheckTips, keyup .colPaycheckTips, change .colPaycheckTips': function (event) {
                    let templateObject = Template.instance();
                    let inputUnitPrice = parseFloat($(event.target).val()) || 0;
                    let utilityService = new UtilityService();
                    let totalvalue = 0;

                    $('.colPaycheckTips').each(function () {
                        var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
                        totalvalue = totalvalue + chkbidwithLine;
                    });

                    $('.tblTimeSheet tbody tr').each(function () {
                        var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
                        var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
                        var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
                        var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
                        //var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

                        totalRegular = (rateValue * regHourValue) || 0;
                        totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
                        totalDouble = ((rateValue * 2) * doubleeValue) || 0;
                        totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
                        $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
                    });
                    $('.lblSumPaytips').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

                },
                'blur .colCashTips, keyup .colCashTips, change .colCashTips': function (event) {
                    let templateObject = Template.instance();
                    let inputUnitPrice = parseFloat($(event.target).val()) || 0;
                    let utilityService = new UtilityService();
                    let totalvalue = 0;

                    $('.colCashTips').each(function () {
                        var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
                        totalvalue = totalvalue + chkbidwithLine;
                    });

                    $('.tblTimeSheet tbody tr').each(function () {
                        var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
                        var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
                        var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
                        var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
                        //var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

                        totalRegular = (rateValue * regHourValue) || 0;
                        totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
                        totalDouble = ((rateValue * 2) * doubleeValue) || 0;
                        totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
                        $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
                    });
                    $('.lblSumCashtips').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

                },
                'blur .colGrossPay, keyup .colGrossPay, change .colGrossPay': function (event) {
                    let templateObject = Template.instance();
                    let inputUnitPrice = parseFloat($(event.target).val()) || 0;
                    let utilityService = new UtilityService();
                    let totalvalue = 0;

                    $('.colGrossPay').each(function () {
                        var chkbidwithLine = Number($(this).val().replace(/[^0-9.-]+/g, "")) || 0;
                        totalvalue = totalvalue + chkbidwithLine;
                    });

                    $('.tblTimeSheet tbody tr').each(function () {
                        var rateValue = Number($(this).find(".colRate").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var regHourValue = Number($(this).find(".colRegHours").val()) || 0;
                        var overtimeValue = Number($(this).find(".olOvertime").val()) || 0;
                        var doubleeValue = Number($(this).find(".colDouble").val()) || 0;
                        var additionalValue = Number($(this).find(".colAdditional").val().replace(/[^0-9.-]+/g, "")) || 0;
                        var paytipsValue = Number($(this).find(".colPaycheckTips").val().replace(/[^0-9.-]+/g, "")) || 0;
                        //var cashtipsValue = Number($(this).find(".colCashTips").val().replace(/[^0-9.-]+/g,""))||0;

                        totalRegular = (rateValue * regHourValue) || 0;
                        totalOvertime = ((rateValue * 1.5) * overtimeValue) || 0;
                        totalDouble = ((rateValue * 2) * doubleeValue) || 0;
                        totalGrossPay = (totalRegular + totalRegular + totalDouble + additionalValue + paytipsValue) || 0;
                        $(this).find(".colGrossPay").val(utilityService.modifynegativeCurrencyFormat(totalGrossPay) || 0);
                    });
                    $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(totalvalue) || 0);

                },
                'keydown .cashamount': function (event) {
                    if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
                        // Allow: Ctrl+A, Command+A
                        (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
                        // Allow: home, end, left, right, down, up
                        (event.keyCode >= 35 && event.keyCode <= 40)) {
                        // let it happen, don't do anything
                        return;
                    }

                    if (event.shiftKey == true) {
                        event.preventDefault();
                    }

                    if ((event.keyCode >= 48 && event.keyCode <= 57) ||
                        (event.keyCode >= 96 && event.keyCode <= 105) ||
                        event.keyCode == 8 || event.keyCode == 9 ||
                        event.keyCode == 37 || event.keyCode == 39 ||
                        event.keyCode == 46 || event.keyCode == 190) {}
                    else {
                        event.preventDefault();
                    }
                },
                // 'click .btnEditTimeSheet': function (event) {
                //     var targetID = $(event.target).closest('tr').attr('id'); // table row ID
                //     $('#edtTimesheetID').val(targetID);
                // }
                // ,
                'click #btnNewTimeSheet': function (event) {
                    $('#edtTimesheetID').val('');
                    $('#add-timesheet-title').text('New Timesheet');
                    $('.sltEmployee').val('');
                    $('.sltJob').val('');
                    $('.lineEditHourlyRate').val('');
                    $('.lineEditHour').val('');
                    $('.lineEditTechNotes').val('');
                },
                'change #dateTo': function () {
                    let templateObject = Template.instance();
                    $('.fullScreenSpin').css('display', 'inline-block');
                    $('#dateFrom').attr('readonly', false);
                    $('#dateTo').attr('readonly', false);
                    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                    var dateTo = new Date($("#dateTo").datepicker("getDate"));

                    let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                    let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

                    //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
                    var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
                    //templateObject.dateAsAt.set(formatDate);
                    if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {

                    } else {
                      templateObject.getAllFilterTimeSheetData(formatDateFrom,formatDateTo, false);
                    }

                },
                'change #dateFrom': function () {
                    let templateObject = Template.instance();
                    $('.fullScreenSpin').css('display', 'inline-block');
                    $('#dateFrom').attr('readonly', false);
                    $('#dateTo').attr('readonly', false);
                    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                    var dateTo = new Date($("#dateTo").datepicker("getDate"));

                    let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                    let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

                    //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
                    var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
                    //templateObject.dateAsAt.set(formatDate);
                    if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {

                    } else {
                        templateObject.getAllFilterTimeSheetData(formatDateFrom,formatDateTo, false);
                    }

                },
                'click #today': function () {
                    let templateObject = Template.instance();
                    $('.fullScreenSpin').css('display', 'inline-block');
                    $('#dateFrom').attr('readonly', false);
                    $('#dateTo').attr('readonly', false);
                    var currentBeginDate = new Date();
                    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
                    let fromDateMonth = (currentBeginDate.getMonth() + 1);
                    let fromDateDay = currentBeginDate.getDate();
                    if((currentBeginDate.getMonth()+1) < 10){
                        fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
                    }else{
                      fromDateMonth = (currentBeginDate.getMonth()+1);
                    }

                    if(currentBeginDate.getDate() < 10){
                        fromDateDay = "0" + currentBeginDate.getDate();
                    }
                    var toDateERPFrom = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
                    var toDateERPTo = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);

                    var toDateDisplayFrom = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
                    var toDateDisplayTo = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();

                    $("#dateFrom").val(toDateDisplayFrom);
                    $("#dateTo").val(toDateDisplayTo);
                    templateObject.getAllFilterTimeSheetData(toDateERPFrom,toDateERPTo, false);
                },
                'click #lastweek': function () {
                    let templateObject = Template.instance();
                    $('.fullScreenSpin').css('display', 'inline-block');
                    $('#dateFrom').attr('readonly', false);
                    $('#dateTo').attr('readonly', false);
                    var currentBeginDate = new Date();
                    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
                    let fromDateMonth = (currentBeginDate.getMonth() + 1);
                    let fromDateDay = currentBeginDate.getDate();
                    if((currentBeginDate.getMonth()+1) < 10){
                        fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
                    }else{
                      fromDateMonth = (currentBeginDate.getMonth()+1);
                    }

                    if(currentBeginDate.getDate() < 10){
                        fromDateDay = "0" + currentBeginDate.getDate();
                    }
                    var toDateERPFrom = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay - 7);
                    var toDateERPTo = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);

                    var toDateDisplayFrom = (fromDateDay -7)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
                    var toDateDisplayTo = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();

                    $("#dateFrom").val(toDateDisplayFrom);
                    $("#dateTo").val(toDateDisplayTo);
                    templateObject.getAllFilterTimeSheetData(toDateERPFrom,toDateERPTo, false);
                },
                'click #lastMonth': function () {
                    let templateObject = Template.instance();
                    $('.fullScreenSpin').css('display', 'inline-block');
                    $('#dateFrom').attr('readonly', false);
                    $('#dateTo').attr('readonly', false);
                    var currentDate = new Date();

                    var prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
                    var prevMonthFirstDate = new Date(currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1), (currentDate.getMonth() - 1 + 12) % 12, 1);

                    var formatDateComponent = function(dateComponent) {
                      return (dateComponent < 10 ? '0' : '') + dateComponent;
                    };

                    var formatDate = function(date) {
                      return  formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
                    };

                    var formatDateERP = function(date) {
                      return  date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
                    };


                    var fromDate = formatDate(prevMonthFirstDate);
                    var toDate = formatDate(prevMonthLastDate);

                    $("#dateFrom").val(fromDate);
                    $("#dateTo").val(toDate);

                    var getLoadDate = formatDateERP(prevMonthLastDate);
                    let getDateFrom = formatDateERP(prevMonthFirstDate);
                    templateObject.getAllFilterTimeSheetData(getDateFrom,getLoadDate, false);
                },
                'click #lastQuarter': function () {
                    let templateObject = Template.instance();
                    $('.fullScreenSpin').css('display', 'inline-block');
                    $('#dateFrom').attr('readonly', false);
                    $('#dateTo').attr('readonly', false);
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("DD/MM/YYYY");

                    var begunDate = moment(currentDate).format("DD/MM/YYYY");
                    function getQuarter(d) {
                        d = d || new Date();
                        var m = Math.floor(d.getMonth() / 3) + 2;
                        return m > 4 ? m - 4 : m;
                    }

                    var quarterAdjustment = (moment().month() % 3) + 1;
                    var lastQuarterEndDate = moment().subtract({
                        months: quarterAdjustment
                    }).endOf('month');
                    var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({
                        months: 2
                    }).startOf('month');

                    var lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
                    var lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");


                    $("#dateFrom").val(lastQuarterStartDateFormat);
                    $("#dateTo").val(lastQuarterEndDateFormat);

                    let fromDateMonth = getQuarter(currentDate);
                    var quarterMonth = getQuarter(currentDate);
                    let fromDateDay = currentDate.getDate();

                    var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
                    let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
                    templateObject.getAllFilterTimeSheetData(getDateFrom,getLoadDate, false);
                },
                'click #last12Months': function () {
                    let templateObject = Template.instance();
                    $('.fullScreenSpin').css('display', 'inline-block');
                    $('#dateFrom').attr('readonly', false);
                    $('#dateTo').attr('readonly', false);
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("DD/MM/YYYY");

                    let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
                    let fromDateDay = currentDate.getDate();
                    if ((currentDate.getMonth()+1) < 10) {
                        fromDateMonth = "0" + (currentDate.getMonth()+1);
                    }
                    if (currentDate.getDate() < 10) {
                        fromDateDay = "0" + currentDate.getDate();
                    }

                    var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() - 1);
                    $("#dateFrom").val(fromDate);
                    $("#dateTo").val(begunDate);

                    var currentDate2 = new Date();
                    if ((currentDate2.getMonth()+1) < 10) {
                        fromDateMonth2 = "0" + Math.floor(currentDate2.getMonth() + 1);
                    }
                    if (currentDate2.getDate() < 10) {
                        fromDateDay2 = "0" + currentDate2.getDate();
                    }
                    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
                    let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + fromDateMonth2 + "-" + currentDate2.getDate();
                    templateObject.getAllFilterTimeSheetData(getDateFrom,getLoadDate, false);

                },
                'click #ignoreDate': function () {
                    let templateObject = Template.instance();
                    $('.fullScreenSpin').css('display', 'inline-block');
                    $('#dateFrom').attr('readonly', true);
                    $('#dateTo').attr('readonly', true);
                    templateObject.getAllFilterTimeSheetData('', '', true);
                },
                'keyup #tblTimeSheet_filter input': function (event) {
                      // if($(event.target).val() != ''){
                      //   $(".btnRefreshTimeSheet").addClass('btnSearchAlert');
                      // }else{
                      //   $(".btnRefreshTimeSheet").removeClass('btnSearchAlert');
                      // }
                      // if (event.keyCode == 13) {
                      //    $(".btnRefreshTimeSheet").trigger("click");
                      // }
                    },
                    'click .btnRefreshTimeSheet':function(event){
                    $(".btnRefreshOne").trigger("click");
                }
            });

            Template.timesheet.helpers({
                jobsrecords: () => {
                    return Template.instance().jobsrecords.get().sort(function (a, b) {
                        if (a.jobname == 'NA') {
                            return 1;
                        } else if (b.jobname == 'NA') {
                            return -1;
                        }
                        return (a.jobname.toUpperCase() > b.jobname.toUpperCase()) ? 1 : -1;
                    });
                },
                edithours: () => {
                    return Session.get('CloudEditTimesheetHours') || false;
                },
                clockOnOff: () => {
                    return Session.get('CloudClockOnOff') || false;
                },
                launchClockOnOff: () => {
                    return Session.get('launchClockOnOff') || false;
                },
                seeOwnTimesheets: () => {
                    return Session.get('seeOwnTimesheets') || false;
                },
                timesheetStartStop: () => {
                    return Session.get('timesheetStartStop') || false;
                },
                showTimesheetEntries: () => {
                    return Session.get('CloudTimesheetEntry') || false;
                },
                showTimesheet: () => {
                    return Session.get('CloudShowTimesheet') || false;
                },
                employeerecords: () => {
                    return Template.instance().employeerecords.get().sort(function (a, b) {
                        if (a.employeename == 'NA') {
                            return 1;
                        } else if (b.employeename == 'NA') {
                            return -1;
                        }
                        return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
                    });
                },
                datatablerecords: () => {
                    return Template.instance().datatablerecords.get().sort(function (a, b) {
                        if (a.sortdate == 'NA') {
                            return 1;
                        } else if (b.sortdate == 'NA') {
                            return -1;
                        }
                        return (a.sortdate.toUpperCase() > b.sortdate.toUpperCase()) ? 1 : -1;
                    });
                },
                productsdatatablerecords: () => {
                    return Template.instance().productsdatatablerecords.get().sort(function (a, b) {
                        if (a.productname == 'NA') {
                            return 1;
                        } else if (b.productname == 'NA') {
                            return -1;
                        }
                        return (a.productname.toUpperCase() > b.productname.toUpperCase()) ? 1 : -1;
                    });
                },
                tableheaderrecords: () => {
                    return Template.instance().tableheaderrecords.get();
                },
                loggedCompany: () => {
                    return localStorage.getItem('mySession') || '';
                },
                loggedInEmployee: () => {
                    return Session.get('mySessionEmployee') || '';
                }

            });
