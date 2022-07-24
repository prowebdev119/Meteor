import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {UtilityService} from "../../utility-service";
import {ContactService} from "../../contacts/contact-service";
import { SideBarService } from '../../js/sidebar-service';
let utilityService = new UtilityService();
let sideBarService = new SideBarService();
Template.timesheettimelog.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords1 = new ReactiveVar([]);
    templateObject.employeerecords = new ReactiveVar([]);
    templateObject.jobsrecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.selectedTimesheet = new ReactiveVar([]);
    templateObject.selectedTimesheetID = new ReactiveVar();
    templateObject.selectedFile = new ReactiveVar();
});

Template.timesheettimelog.onRendered(function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let contactService = new ContactService();

    const employeeList = [];
    const jobsList = [];
    const timesheetList = [];
    const dataTableList = [];
    const tableHeaderList = [];

    var today = moment().format('DD/MM/YYYY');
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if ((currentDate.getMonth() + 1) < 10) {
        fromDateMonth = "0" + (currentDate.getMonth() + 1);
    }

    if (currentDate.getDate() < 10) {
        fromDateDay = "0" + currentDate.getDate();
    }
    var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();

    templateObject.diff_hours1 = function (dt2, dt1) {
        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        let hours = Math.floor(diff / 3600) % 24;
        let min = Math.floor(diff / 60) % 60;
        let time = hours + "h:" + ("0" + min).slice(-2) + "m"
            // if (hours < 1 && min < 1) {
            //     time = 0;
            // }
            return time;
    }

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

    $("#date-input,#dateTo,#dateFrom").datepicker({
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
        onChangeMonthYear: function(year, month, inst){
        // Set date to picker
        $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
        // Hide (close) the picker
        $(this).datepicker('hide');
        // Change ttrigger the on change function
        $(this).trigger('change');
       }
    });

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);
    templateObject.getAllTimeSheetData = function () {
        getVS1Data('TTimeSheet').then(function (dataObject) {
            if (dataObject == 0) {
                contactService.getAllTimeSheetList().then(function (data) {

                    $('.fullScreenSpin').css('display', 'none');
                    let url = location.href;
                    let lineItems = [];
                    let lineItemObj = {};

                    let sumTotalCharge = 0;
                    let sumSumHour = 0;
                    let sumSumHourlyRate = 0;
                    if (url.indexOf('?id') > 0) {
                        url = new URL(url);
                        let Id = parseInt(url.searchParams.get("id"));
                        let startTime = "";
                        let endTime = "";
                        let Hours = 0;
                        for (let t = 0; t < data.ttimesheet.length; t++) {
                            if (data.ttimesheet[t].fields.ID == Id) {
                                if (data.ttimesheet[t].fields.Logs != null) {
                                    if (Array.isArray(data.ttimesheet[t].fields.Logs)) {

                                        for (let l = 0; l < data.ttimesheet[t].fields.Logs.length; l++) {

                                            if (data.ttimesheet[t].fields.Logs[l].fields.StartDatetime != "") {
                                                startTime = moment(data.ttimesheet[t].fields.Logs[l].fields.StartDatetime).format('h:mm a');
                                            } else {
                                                startTime = '';
                                            }

                                            if (data.ttimesheet[t].fields.Logs[l].fields.EndDatetime != "") {
                                                endTime = moment(data.ttimesheet[t].fields.Logs[l].fields.EndDatetime).format('h:mm a');
                                            } else {
                                                endTime = '';
                                            }

                                            if (data.ttimesheet[t].fields.Logs[l].fields.StartDatetime != "" && data.ttimesheet[t].fields.Logs[l].fields.EndDatetime != "") {
                                                let dt1 = new Date(data.ttimesheet[t].fields.Logs[l].fields.StartDatetime);
                                                let dt2 = new Date(data.ttimesheet[t].fields.Logs[l].fields.EndDatetime);
                                                Hours = templateObject.diff_hours1(dt2, dt1);
                                            } else {
                                                Hours = "0h:0m";
                                            }

                                            var dataList = {
                                                id: data.ttimesheet[t].fields.ID || '',
                                                sortid: data.ttimesheet[t].fields.Logs[l].fields.ID || '',
                                                employee: data.ttimesheet[t].fields.EmployeeName || '',
                                                hours: Hours,
                                                job: data.ttimesheet[t].fields.Job || '',
                                                startTime: startTime,
                                                endTime: endTime,
                                                product: data.ttimesheet[t].fields.Logs[l].fields.Product || data.ttimesheet[t].fields.ServiceName || '',
                                                sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                                                timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                                                timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                                                notes: data.ttimesheet[t].fields.Logs[l].fields.Description || '',
                                            };
                                            dataTableList.push(dataList);
                                        }
                                    } else {
                                        if (data.ttimesheet[t].fields.Logs.fields.StartDatetime != "") {
                                            startTime = moment(data.ttimesheet[t].fields.Logs.fields.StartDatetime).format('h:mm a');
                                        } else {
                                            startTime = '';
                                        }

                                        if (data.ttimesheet[t].fields.Logs.fields.EndDatetime != "") {
                                            endTime = moment(data.ttimesheet[t].fields.Logs.fields.EndDatetime).format('h:mm a');
                                        } else {
                                            endTime = '';
                                        }

                                        if (data.ttimesheet[t].fields.Logs.fields.StartDatetime != "" && data.ttimesheet[t].fields.Logs.fields.EndDatetime != "") {
                                            let dt1 = new Date(data.ttimesheet[t].fields.Logs.fields.StartDatetime);
                                            let dt2 = new Date(data.ttimesheet[t].fields.Logs.fields.EndDatetime);
                                            Hours = templateObject.diff_hours1(dt2, dt1);
                                        } else {
                                           Hours = "0h:0m";
                                        }

                                        var dataList = {
                                            id: data.ttimesheet[t].fields.ID || '',
                                            sortid: data.ttimesheet[t].fields.Logs.fields.ID || '',
                                            employee: data.ttimesheet[t].fields.EmployeeName || '',
                                            hours: Hours,
                                            job: data.ttimesheet[t].fields.Job || '',
                                            product: data.ttimesheet[t].fields.Logs.fields.Product || data.ttimesheet[t].fields.ServiceName || '',
                                            startTime: startTime,
                                            endTime: endTime,
                                            sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                                            timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                                            timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                                            notes: data.ttimesheet[t].fields.Logs.fields.Description || '',
                                        };
                                        dataTableList.push(dataList);

                                    }
                                }

                            }
                        }

                    } else {
                        for (let t = 0; t < data.ttimesheet.length; t++) {
                            if (data.ttimesheet[t].fields.Logs != null) {
                                if (Array.isArray(data.ttimesheet[t].fields.Logs)) {
                                    for (let l = 0; l < data.ttimesheet[t].fields.Logs.length; l++) {

                                        if (data.ttimesheet[t].fields.Logs[l].fields.StartDatetime != "") {
                                            startTime = moment(data.ttimesheet[t].fields.Logs[l].fields.StartDatetime).format('h:mm a');
                                        } else {
                                            startTime = '';
                                        }

                                        if (data.ttimesheet[t].fields.Logs[l].fields.EndDatetime != "") {
                                            endTime = moment(data.ttimesheet[t].fields.Logs[l].fields.EndDatetime).format('h:mm a');
                                        } else {
                                            endTime = '';
                                        }

                                        if (data.ttimesheet[t].fields.Logs[l].fields.StartDatetime != "" && data.ttimesheet[t].fields.Logs[l].fields.EndDatetime != "") {
                                            let dt1 = new Date(data.ttimesheet[t].fields.Logs[l].fields.StartDatetime);
                                            let dt2 = new Date(data.ttimesheet[t].fields.Logs[l].fields.EndDatetime);
                                            Hours = templateObject.diff_hours1(dt2, dt1);
                                        } else {
                                            Hours = 0;
                                        }

                                        var dataList = {
                                            id: data.ttimesheet[t].fields.ID || '',
                                            sortid: data.ttimesheet[t].fields.Logs[l].fields.ID || '',
                                            employee: data.ttimesheet[t].fields.EmployeeName || '',
                                            hours: Hours,
                                            job: data.ttimesheet[t].fields.Job || '',
                                            startTime: startTime,
                                            endTime: endTime,
                                            product: data.ttimesheet[t].fields.Logs[l].fields.Product || data.ttimesheet[t].fields.ServiceName || '',
                                            sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                                            timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                                            timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                                            notes: data.ttimesheet[t].fields.Logs[l].fields.Description || '',
                                        };
                                        dataTableList.push(dataList);
                                    }

                                } else {
                                    if (data.ttimesheet[t].fields.Logs.fields.StartDatetime != "") {
                                        startTime = moment(data.ttimesheet[t].fields.Logs.fields.StartDatetime).format('h:mm a');
                                    } else {
                                        startTime = '';
                                    }

                                    if (data.ttimesheet[t].fields.Logs.fields.EndDatetime != "") {
                                        endTime = moment(data.ttimesheet[t].fields.Logs.fields.EndDatetime).format('h:mm a');
                                    } else {
                                        endTime = '';
                                    }

                                    if (data.ttimesheet[t].fields.Logs.fields.StartDatetime != "" && data.ttimesheet[t].fields.Logs.fields.EndDatetime != "") {
                                        let dt1 = new Date(data.ttimesheet[t].fields.Logs.fields.StartDatetime);
                                        let dt2 = new Date(data.ttimesheet[t].fields.Logs.fields.EndDatetime);
                                        Hours = templateObject.diff_hours1(dt2, dt1);
                                    } else {
                                        Hours = 0;
                                    }

                                    var dataList = {
                                        id: data.ttimesheet[t].fields.ID || '',
                                        sortid: data.ttimesheet[t].fields.Logs.fields.ID || '',
                                        employee: data.ttimesheet[t].fields.EmployeeName || '',
                                        hours: Hours,
                                        job: data.ttimesheet[t].fields.Job || '',
                                        startTime: startTime,
                                        endTime: endTime,
                                        product: data.ttimesheet[t].fields.Logs.fields.Product || data.ttimesheet[t].fields.ServiceName || '',
                                        sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                                        timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                                        timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                                        notes: data.ttimesheet[t].fields.Logs.fields.Description || '',
                                    };
                                    dataTableList.push(dataList);

                                }
                            }

                        }

                    }
                    $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
                    $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate));
                    $('.lblSumHour').text(sumSumHour);
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
                        $('.fullScreenSpin').css('display', 'none');
                        // //$.fn.dataTable.moment('DD/MM/YY');
                        $('#tblTimeSheet').DataTable({
                            columnDefs: [
                                // {type: 'date', targets: 0},
                                {
                                    "orderable": false,
                                    "targets": -1
                                }, {
                                    targets: 'sorting_disabled',
                                    orderable: false
                                }
                            ],
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                    extend: 'excelHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "timesheetist_" + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: [':visible :not(:last-child)'],
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Time Sheet',
                                    filename: "timesheetist_" + moment().format(),
                                    exportOptions: {
                                        columns: [':visible :not(:last-child)'],
                                    }
                                }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: {
                                fixedColumnsRight: 1,
                                fixedColumnsLeft: 1
                            },
                            // colReorder: true,
                            // bStateSave: true,
                            // rowId: 0,
                            paging: false,
                            // "scrollY": "500px",
                            "scrollCollapse": true,
                            info: true,
                            responsive: true,
                            "order": [[0, "desc"]],
                            action: function () {
                                $('#tblTimeSheet').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                setTimeout(function () {
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
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');
                    $('#tblTimeSheet tbody').on('click', 'tr .btnEditTimeSheet', function () {
                        var listData = $(this).closest('tr').attr('id');
                        if (listData) {
                            var employeeName = $(event.target).closest("tr").find(".colName").attr('empname') || '';
                            var jobName = $(event.target).closest("tr").find(".colJob").text() || '';
                            var hourlyRate = $(event.target).closest("tr").find(".colRate").val().replace(/[^0-9.-]+/g, "") || 0;
                            var regHour = $(event.target).closest("tr").find(".colRegHours").val() || 0;
                            var techNotes = $(event.target).closest("tr").find(".colNotes").text() || '';

                            $('#edtTimesheetID').val(listData);
                            $('#add-timesheet-title').text('Edit TimeSheet');
                            $('.sltEmployee').val(employeeName);
                            $('.sltJob').val(jobName);
                            $('.lineEditHourlyRate').val(hourlyRate);
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
                let url = location.href;
                let lineItems = [];
                let lineItemObj = {};
                let data = JSON.parse(dataObject[0].data);
                let sumTotalCharge = 0;
                let sumSumHour = 0;
                let sumSumHourlyRate = 0;
                if (url.indexOf('?id') > 0) {
                    url = new URL(url);
                    let Id = parseInt(url.searchParams.get("id"));
                    let startTime = "";
                    let endTime = "";
                    let Hours = 0;
                    for (let t = 0; t < data.ttimesheet.length; t++) {
                        if (data.ttimesheet[t].fields.ID == Id) {
                            if (data.ttimesheet[t].fields.Logs != null) {
                                if (Array.isArray(data.ttimesheet[t].fields.Logs)) {

                                    for (let l = 0; l < data.ttimesheet[t].fields.Logs.length; l++) {

                                        if (data.ttimesheet[t].fields.Logs[l].fields.StartDatetime != "") {
                                            startTime = moment(data.ttimesheet[t].fields.Logs[l].fields.StartDatetime).format('h:mm a');
                                        } else {
                                            startTime = '';
                                        }

                                        if (data.ttimesheet[t].fields.Logs[l].fields.EndDatetime != "") {
                                            endTime = moment(data.ttimesheet[t].fields.Logs[l].fields.EndDatetime).format('h:mm a');
                                        } else {
                                            endTime = '';
                                        }

                                        if (data.ttimesheet[t].fields.Logs[l].fields.StartDatetime != "" && data.ttimesheet[t].fields.Logs[l].fields.EndDatetime != "") {
                                            let dt1 = new Date(data.ttimesheet[t].fields.Logs[l].fields.StartDatetime);
                                            let dt2 = new Date(data.ttimesheet[t].fields.Logs[l].fields.EndDatetime);
                                            Hours = templateObject.diff_hours1(dt2, dt1);
                                        } else {
                                           Hours = "0h:0m";
                                        }

                                        var dataList = {
                                            id: data.ttimesheet[t].fields.ID || '',
                                            sortid: data.ttimesheet[t].fields.Logs[l].fields.ID || '',
                                            employee: data.ttimesheet[t].fields.EmployeeName || '',
                                            hours: Hours,
                                            job: data.ttimesheet[t].fields.Job || '',
                                            startTime: startTime,
                                            endTime: endTime,
                                            product: data.ttimesheet[t].fields.Logs[l].fields.Product,
                                            sortdate: data.ttimesheet[t].fields.Logs[l].fields.MsTimeStamp != '' ? moment(data.ttimesheet[t].fields.Logs[l].fields.MsTimeStamp).format("YYYY/MM/DD") : data.ttimesheet[t].fields.Logs[l].fields.MsTimeStamp,
                                            timesheetdate: data.ttimesheet[t].fields.Logs[l].fields.MsTimeStamp != '' ? moment(data.ttimesheet[t].fields.Logs[l].fields.MsTimeStamp).format("DD/MM/YYYY") : data.ttimesheet[t].fields.Logs[l].fields.MsTimeStamp,
                                            timesheetdate1: data.ttimesheet[t].fields.Logs[l].fields.MsTimeStamp || '',
                                            notes: data.ttimesheet[t].fields.Logs[l].fields.Description || '',
                                        };
                                        dataTableList.push(dataList);
                                    }
                                } else {
                                    if (data.ttimesheet[t].fields.Logs.fields.StartDatetime != "") {
                                        startTime = moment(data.ttimesheet[t].fields.Logs.fields.StartDatetime).format('h:mm a');
                                    } else {
                                        startTime = '';
                                    }

                                    if (data.ttimesheet[t].fields.Logs.fields.EndDatetime != "") {
                                        endTime = moment(data.ttimesheet[t].fields.Logs.fields.EndDatetime).format('h:mm a');
                                    } else {
                                        endTime = '';
                                    }

                                    if (data.ttimesheet[t].fields.Logs.fields.StartDatetime != "" && data.ttimesheet[t].fields.Logs.fields.EndDatetime != "") {
                                        let dt1 = new Date(data.ttimesheet[t].fields.Logs.fields.StartDatetime);
                                        let dt2 = new Date(data.ttimesheet[t].fields.Logs.fields.EndDatetime);
                                        Hours = templateObject.diff_hours1(dt2, dt1);
                                    } else {
                                        Hours = "0h:0m";
                                    }

                                    var dataList = {
                                        id: data.ttimesheet[t].fields.ID || '',
                                        sortid: data.ttimesheet[t].fields.Logs.fields.ID || '',
                                        employee: data.ttimesheet[t].fields.EmployeeName || '',
                                        hours: Hours,
                                        job: data.ttimesheet[t].fields.Job || '',
                                        startTime: startTime,
                                        endTime: endTime,
                                        product: data.ttimesheet[t].fields.Logs.fields.Product,
                                        sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                                        timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                                        timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                                        notes: data.ttimesheet[t].fields.Logs.fields.Description || '',
                                    };
                                    dataTableList.push(dataList);

                                }
                            }

                        }
                    }
                } else {
                    for (let t = 0; t < data.ttimesheet.length; t++) {
                        if (data.ttimesheet[t].fields.Logs != null) {
                            if (Array.isArray(data.ttimesheet[t].fields.Logs)) {
                                for (let l = 0; l < data.ttimesheet[t].fields.Logs.length; l++) {

                                    if (data.ttimesheet[t].fields.Logs[l].fields.StartDatetime != "") {
                                        startTime = moment(data.ttimesheet[t].fields.Logs[l].fields.StartDatetime).format('h:mm a');
                                    } else {
                                        startTime = '';
                                    }

                                    if (data.ttimesheet[t].fields.Logs[l].fields.EndDatetime != "") {
                                        endTime = moment(data.ttimesheet[t].fields.Logs[l].fields.EndDatetime).format('h:mm a');
                                    } else {
                                        endTime = '';
                                    }

                                    if (data.ttimesheet[t].fields.Logs[l].fields.StartDatetime != "" && data.ttimesheet[t].fields.Logs[l].fields.EndDatetime != "") {
                                        let dt1 = new Date(data.ttimesheet[t].fields.Logs[l].fields.StartDatetime);
                                        let dt2 = new Date(data.ttimesheet[t].fields.Logs[l].fields.EndDatetime);
                                        Hours = templateObject.diff_hours1(dt2, dt1);
                                    } else {
                                        Hours = "0h:0m";
                                    }

                                    var dataList = {
                                        id: data.ttimesheet[t].fields.ID || '',
                                        sortid: data.ttimesheet[t].fields.Logs[l].fields.ID || '',
                                        employee: data.ttimesheet[t].fields.EmployeeName || '',
                                        hours: Hours,
                                        job: data.ttimesheet[t].fields.Job || '',
                                        startTime: startTime,
                                        endTime: endTime,
                                        product: data.ttimesheet[t].fields.Logs[l].fields.Product || data.ttimesheet[t].fields.ServiceName || '',
                                        sortdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("YYYY/MM/DD") : data.ttimesheet[t].fields.TimeSheetDate,
                                        timesheetdate: data.ttimesheet[t].fields.TimeSheetDate != '' ? moment(data.ttimesheet[t].fields.TimeSheetDate).format("DD/MM/YYYY") : data.ttimesheet[t].fields.TimeSheetDate,
                                        timesheetdate1: data.ttimesheet[t].fields.TimeSheetDate || '',
                                        notes: data.ttimesheet[t].fields.Logs[l].fields.Description || '',
                                    };
                                    dataTableList.push(dataList);
                                }

                            } else {
                                if (data.ttimesheet[t].fields.Logs.fields.StartDatetime != "") {
                                    startTime = moment(data.ttimesheet[t].fields.Logs.fields.StartDatetime).format('h:mm a');
                                } else {
                                    startTime = '';
                                }

                                if (data.ttimesheet[t].fields.Logs.fields.EndDatetime != "") {
                                    endTime = moment(data.ttimesheet[t].fields.Logs.fields.EndDatetime).format('h:mm a');
                                } else {
                                    endTime = '';
                                }

                                if (data.ttimesheet[t].fields.Logs.fields.StartDatetime != "" && data.ttimesheet[t].fields.Logs.fields.EndDatetime != "") {
                                    let dt1 = new Date(data.ttimesheet[t].fields.Logs.fields.StartDatetime);
                                    let dt2 = new Date(data.ttimesheet[t].fields.Logs.fields.EndDatetime);
                                    Hours = templateObject.diff_hours1(dt2, dt1);
                                } else {
                                    Hours = 0;
                                }

                                var dataList = {
                                    id: data.ttimesheet[t].fields.ID || '',
                                    sortid: data.ttimesheet[t].fields.Logs.fields.ID || '',
                                    employee: data.ttimesheet[t].fields.EmployeeName || '',
                                    hours: Hours,
                                    job: data.ttimesheet[t].fields.Job || '',
                                    startTime: startTime,
                                    endTime: endTime,
                                    product: data.ttimesheet[t].fields.Logs.fields.Product || data.ttimesheet[t].fields.ServiceName || '',
                                    sortdate: data.ttimesheet[t].fields.Log.fields.MsTimeStamp != '' ? moment(data.ttimesheet[t].fields.Log.fields.MsTimeStamp).format("YYYY/MM/DD") : data.ttimesheet[t].fields.Log.fields.MsTimeStamp,
                                    timesheetdate: data.ttimesheet[t].fields.Log.fields.MsTimeStamp!= '' ? moment(data.ttimesheet[t].fields.Log.fields.MsTimeStamp).format("DD/MM/YYYY") : data.ttimesheet[t].fields.Log.fields.MsTimeStamp,
                                    timesheetdate1: data.ttimesheet[t].fields.Log.fields.MsTimeStamp || '',
                                    notes: data.ttimesheet[t].fields.Logs.fields.Description || '',
                                };
                                dataTableList.push(dataList);

                            }
                        }

                    }

                }
                $('.lblSumTotalCharge').text(utilityService.modifynegativeCurrencyFormat(sumTotalCharge));
                $('.lblSumHourlyRate').text(utilityService.modifynegativeCurrencyFormat(sumSumHourlyRate));
                $('.lblSumHour').text(sumSumHour);
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
                    $('.fullScreenSpin').css('display', 'none');
                    // //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblTimeSheet').DataTable({
                        columnDefs: [
                            // {type: 'date', targets: 0},
                            {
                                "orderable": false,
                                "targets": -1
                            }, {
                                targets: 'sorting_disabled',
                                orderable: false
                            }
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "timesheetist_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: [':visible :not(:last-child)'],
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Time Sheet',
                                filename: "timesheetist_" + moment().format(),
                                exportOptions: {
                                    columns: [':visible :not(:last-child)'],
                                }
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: {
                            fixedColumnsRight: 1,
                            fixedColumnsLeft: 1
                        },
                        // colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        paging: false,
                        // "scrollY": "500px",
                        "scrollCollapse": true,
                        info: true,
                        responsive: true,
                        "order": [[0, "desc"]],
                        action: function () {
                            $('#tblTimeSheet').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
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
                $('div.dataTables_filter input').addClass('form-control form-control-sm');
                $('#tblTimeSheet tbody').on('click', 'tr .btnEditTimeSheet', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        var employeeName = $(event.target).closest("tr").find(".colName").attr('empname') || '';
                        var jobName = $(event.target).closest("tr").find(".colJob").text() || '';
                        var hourlyRate = $(event.target).closest("tr").find(".colRate").val().replace(/[^0-9.-]+/g, "") || 0;
                        var regHour = $(event.target).closest("tr").find(".colRegHours").val() || 0;
                        var techNotes = $(event.target).closest("tr").find(".colNotes").text() || '';

                        $('#edtTimesheetID').val(listData);
                        $('#add-timesheet-title').text('Edit TimeSheet');
                        $('.sltEmployee').val(employeeName);
                        $('.sltJob').val(jobName);
                        $('.lineEditHourlyRate').val(hourlyRate);
                        $('.lineEditHour').val(regHour);
                        $('.lineEditTechNotes').val(techNotes);
                        // window.open('/billcard?id=' + listData,'_self');
                    }
                });

            }
        })

    }
    templateObject.getAllTimeSheetData();

    templateObject.getEmployees = function () {
    contactService.getAllEmployeesData().then(function (data) {
        let lineItems = [];
        let lineItemObj = {};
        $('.fullScreenSpin').css('display', 'none');
        for (let i = 0; i < data.temployee.length; i++) {
            var dataList = {
                id: data.temployee[i].Id || '',
                employeeno: data.temployee[i].EmployeeNo || '',
                employeename: data.temployee[i].EmployeeName || '',
                firstname: data.temployee[i].FirstName || '',
                lastname: data.temployee[i].LastName || '',
                phone: data.temployee[i].Phone || '',
                mobile: data.temployee[i].Mobile || '',
                email: data.temployee[i].Email || '',
                address: data.temployee[i].Street || '',
                country: data.temployee[i].Country || '',
                department: data.temployee[i].DefaultClassName || '',
                custFld1: data.temployee[i].CustFld1 || '',
                custFld2: data.temployee[i].CustFld2 || '',
                custFld3: data.temployee[i].CustFld3 || '',
                custFld4: data.temployee[i].CustFld4 || ''
            };

            if (data.temployee[i].EmployeeName.replace(/\s/g, '') != '') {
                employeeList.push(dataList);
            }
            //}
        }

        templateObject.employeerecords.set(employeeList);

    }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
    });
}

   // templateObject.getEmployees();

    templateObject.getJobs = function () {
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
                jobsList.push(dataListJobs);
            }
            //}
        }

        templateObject.jobsrecords.set(jobsList);

    }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
    });
}

   // templateObject.getJobs();

    $(document).ready(function () {

        $("#btnRefreshTimeLog").click(function(){
              $('.fullScreenSpin').css('display', 'inline-block');
                    sideBarService.getAllTimeSheetList().then(function (data) {
                        addVS1Data('TTimeSheet', JSON.stringify(data));
                        setTimeout(function () {
                            window.open('/timesheettimelog', '_self');
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

        });

         $(".exportbtn").click(function(){
            $('.fullScreenSpin').css('display', 'inline-block');
            jQuery('#tblTimeSheet_wrapper .dt-buttons .btntabletocsv').click();
            $('.fullScreenSpin').css('display', 'none');
        })


          $(".printConfirm").click(function(){
            $('.fullScreenSpin').css('display', 'inline-block');
             jQuery('#tblTimeSheet_wrapper .dt-buttons .btntabletopdf').click();
            $('.fullScreenSpin').css('display', 'none');
        })


        $('#tblTimeSheet tbody').on('click', 'tr td:not(:first-child)', function () {
            var id = $(this).closest('tr').attr('id');
            window.open('timesheet?id=' + id, '_self');
        });

        $("#btnNewTimeSheetOne").on("click", function () {
            FlowRouter.go('/timesheet');
        });

        var table = $('#example').DataTable({
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            drawCallback: function (settings) {
                var api = this.api();
                // Initialize custom control
                initDataTableCtrl(api.table().container());
            },
            responsive: {
                details: {
                    renderer: function (api, rowIdx, columns) {
                        var $row_details = $.fn.DataTable.Responsive.defaults.details.renderer(api, rowIdx, columns);

                        // Initialize custom control
                        initDataTableCtrl($row_details);

                        return $row_details;
                    }
                }
            },
            columnDefs: [{
                    targets: [1, 2, 3, 4, 5],
                    render: function (data, type, row, meta) {
                        if (type === 'display') {
                            var api = new $.fn.dataTable.Api(meta.settings);

                            var $el = $('input, select, textarea', api.cell({
                                        row: meta.row,
                                        column: meta.col
                                    }).node());

                            var $html = $(data).wrap('<div/>').parent();

                            if ($el.prop('tagName') === 'INPUT') {
                                $('input', $html).attr('value', $el.val());
                                if ($el.prop('checked')) {
                                    $('input', $html).attr('checked', 'checked');
                                }
                            } else if ($el.prop('tagName') === 'TEXTAREA') {
                                $('textarea', $html).html($el.val());

                            } else if ($el.prop('tagName') === 'SELECT') {
                                $('option:selected', $html).removeAttr('selected');
                                $('option', $html).filter(function () {
                                    return ($(this).attr('value') === $el.val());
                                }).attr('selected', 'selected');
                            }

                            data = $html.html();
                        }

                        return data;
                    }
                }
            ]
        });

        // Update original input/select on change in child row
        $('#example tbody').on('keyup change', '.child input, .child select, .child textarea', function (e) {
            var $el = $(this);
            var rowIdx = $el.closest('ul').data('dtr-index');
            var colIdx = $el.closest('li').data('dtr-index');
            var cell = table.cell({
                row: rowIdx,
                column: colIdx
            }).node();

            // NOTE: trigger('change') is needed to make custom controls (such as Select2)
            // aware of the value change
            $('input, select, textarea', cell).val($el.val()).trigger('change');

            if ($el.is(':checked')) {
                $('input', cell).prop('checked', true);
            }
        });
    });

    //
    // Initializes jQuery Raty control
    //
    function initDataTableCtrl(container) {
    $('select', container).select2();
}
    });

    Template.timesheet.events({
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
        // 'click #check-all': function (event) {
        //     if ($(event.target).is(':checked')) {
        //         $(".chkBox").prop("checked", true);
        //     } else {
        //         $(".chkBox").prop("checked", false);
        //     }
        // },
        // 'click .chkBox': function () {
        //     var listData = $(this).closest('tr').attr('id');
        //     const templateObject = Template.instance();
        //     const selectedTimesheetList = [];
        //     const selectedTimesheetCheck = [];
        //     let ids = [];
        //     let JsonIn = {};
        //     let JsonIn1 = {};
        //     let myStringJSON = '';
        //     $('.chkBox:checkbox:checked').each(function () {
        //         var chkIdLine = $(this).closest('tr').attr('id');
        //         let obj = {
        //             AppointID: parseInt(chkIdLine)
        //         }

        //         selectedTimesheetList.push(obj);

        //         templateObject.selectedTimesheetID.set(chkIdLine);
        //         // selectedAppointmentCheck.push(JsonIn1);
        //         // }
        //     });
        //     JsonIn = {
        //         Params: {
        //             AppointIDs: selectedTimesheetList
        //         }
        //     };
        //     templateObject.selectedTimesheet.set(JsonIn);
        // },
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
        'click .exportbtn': function () {
            $('.fullScreenSpin').css('display', 'inline-block');
            jQuery('#tblTimeSheet_wrapper .dt-buttons .btntabletocsv').click();
            $('.fullScreenSpin').css('display', 'none');
        },
        'click .exportbtnExcel': function () {
            $('.fullScreenSpin').css('display', 'inline-block');
            jQuery('#tblTimeSheet_wrapper .dt-buttons .btntabletoexcel').click();
            $('.fullScreenSpin').css('display', 'none');
        },
        'click .btnSaveTimeSheet': function () {
            $('.fullScreenSpin').css('display', 'inline-block');
            let templateObject = Template.instance();
            let contactService = new ContactService();
            let timesheetID = $('#edtTimesheetID').val();
            var employeeName = $('#sltEmployee').val();
            var jobName = $('#sltJob').val();
            var edthourlyRate = $('.lineEditHourlyRate').val() || 0;
            var edthour = $('.lineEditHour').val() || 0;
            var techNotes = $('.lineEditTechNotes').val() || '';
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
                                    LabourCost: parseFloat(edthourlyRate) || 0,
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
                        LabourCost: parseFloat(edthourlyRate) || 0,
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
        'change #dateTo': function () {
            let templateObject = Template.instance();
            $('.fullScreenSpin').css('display', 'inline-block');
            let timesheetData = templateObject.datatablerecords1.get();
            let timesheetList = [];
            //templateObject.datatablerecords.set('');
            let startDate = new Date($("#dateFrom").datepicker("getDate"));
            let endDate = new Date($("#dateTo").datepicker("getDate"));
            for (let x = 0; x < timesheetData.length; x++) {
                let date = new Date(timesheetData[x].timesheetdate1);
                if (date >= startDate && date <= endDate) {
                    timesheetList.push(timesheetData[x]);
                }
            }
            templateObject.datatablerecords.set(timesheetList);
            $('.fullScreenSpin').css('display', 'none');

        },
        'change #dateFrom': function () {
            let templateObject = Template.instance();
            $('.fullScreenSpin').css('display', 'inline-block');
            let timesheetData = templateObject.datatablerecords1.get();
            let timesheetList = [];
            //templateObject.datatablerecords.set('');
            let startDate = new Date($("#dateFrom").datepicker("getDate"));
            let endDate = new Date($("#dateTo").datepicker("getDate"));
            for (let x = 0; x < timesheetData.length; x++) {
                let date = new Date(timesheetData[x].timesheetdate1);
                if (date >= startDate && date <= endDate) {
                    timesheetList.push(timesheetData[x]);
                }
            }
            templateObject.datatablerecords.set(timesheetList);
            $('.fullScreenSpin').css('display', 'none');

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
        'click .btnDeleteTimeSheet': function () {
            $('.fullScreenSpin').css('display', 'inline-block');
            let templateObject = Template.instance();
            let contactService = new ContactService();
            let timesheetID = $('#edtTimesheetID').val();

            if (timesheetID == "") {
                window.open('/timesheet', '_self');
            } else {
                data = {
                    type: "TTimeSheet",
                    fields: {
                        ID: timesheetID,
                        Active: false,
                    }
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
                            Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            }

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
        }
    });

    Template.timesheettimelog.helpers({
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
                if (a.timesheetdate == 'NA') {
                    return 1;
                } else if (b.timesheetdate == 'NA') {
                    return -1;
                }
                return (a.timesheetdate.toUpperCase() > b.timesheetdate.toUpperCase()) ? 1 : -1;
            });
        },
        tableheaderrecords: () => {
            return Template.instance().tableheaderrecords.get();
        },
        loggedCompany: () => {
            return localStorage.getItem('mySession') || '';
        }
    });
