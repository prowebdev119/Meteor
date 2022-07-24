import {
    TaxRateService
} from "../settings-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CountryService
} from '../../js/country-service';
import {
    SideBarService
} from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
import { startOfDay } from "@fullcalendar/core";
let sideBarService = new SideBarService();

Template.emailsettings.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.countryData = new ReactiveVar();
    templateObject.originScheduleData = new ReactiveVar([]);
    templateObject.employeescheduledrecord = new ReactiveVar([]);
    templateObject.essentialemployeescheduledrecord = new ReactiveVar([]);
    templateObject.formsData = new ReactiveVar([]);
    templateObject.formsData.set(
        [
            {
                id: 6,
                name: "Aged Payables"
            },
            {
                id: 134,
                name: "Aged Receivables"
            },
            {
                id: 12,
                name: "Bills"
            },
            {
                id: 21,
                name: "Credits"
            },
            {
                id: 225,
                name: "General Ledger"
            },
            {
                id: 18,
                name: "Cheque"
            },
            {
                id: 1,
                name: "Grouped Reports"
            },
            {
                id: 61,
                name: "Customer Payments"
            },
            {
                id: 54,
                name: "Invoices"
            },
            {
                id: 177,
                name: "Print Statements"
            },
            {
                id: 1464,
                name: "Product Sales Report"
            },
            {
                id: 129,
                name: "Profit and Loss"
            },
            {
                id: 69,
                name: "Purchase Orders"
            },
            {
                id: 70,
                name: "Purchase Report"
            },
            {
                id: 1364,
                name: "Purchase Summary Report"
            },
            {
                id: 71,
                name: "Quotes"
            },
            {
                id: 74,
                name: "Refunds"
            },
            {
                id: 77,
                name: "Sakes Orders"
            },
            {
                id: 68,
                name: "Sales Report"
            },
            {
                id: 17544,
                name: "Statements"
            },
            {
                id: 94,
                name: "Supplier Payments"
            },
            {
                id: 278,
                name: "Tax Summary Report"
            },
            {
                id: 140,
                name: "Trial Balance"
            },
        ]
    );
});

Template.emailsettings.onRendered(function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];

    var countryService = new CountryService();
    let countries = [];
    let employeeScheduledRecord = [];
    let essentailEmployeeScheduledRecord = [];

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'currencyLists', function (error, result) {
        if (error) {

        } else {
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
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    $("#date-input,#edtWeeklyStartDate,#dtDueDate,#customdateone,#edtMonthlyStartDate,#edtDailyStartDate,#edtOneTimeOnlyDate").datepicker({
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
    });
    templateObject.assignFrequency = function (frequency) {
        if (frequency == "Weekly") {
            $("#frequencyWeekly").prop('checked', true);
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "block";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        }

        if (frequency == "Daily") {
            $("#frequencyDaily").prop('checked', true);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "block";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        }

        if (frequency == "Monthly") {
            $("#frequencyMonthly").prop('checked', true);
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            document.getElementById("monthlySettings").style.display = "block";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        }

    }

    templateObject.getDayNumber = function (day) {
        day = day.toLowerCase();
        if (day == "") {
            return;
        }

        if (day == "monday") {
            return 1;
        }

        if (day == "tuesday") {
            return 2;
        }

        if (day == "wednesday") {
            return 3;
        }

        if (day == "thursday") {
            return 4;
        }

        if (day == "friday") {
            return 5;
        }

        if (day == "saturday") {
            return 6;
        }

        if (day == "sunday") {
            return 0;
        }

    }

    templateObject.getMonths = function (startDate, endDate) {
        let dateone = "";
        let datetwo = "";
        if (startDate != "") {
            dateone = moment(startDate).format('M');
        }

        if (endDate != "") {
            datetwo = parseInt(moment(endDate).format('M')) + 1;
        }

        if (dateone != "" && datetwo != "") {
            for (let x = dateone; x < datetwo; x++) {
                if (x == 1) {
                    $("#formCheck-january").prop('checked', true);
                }

                if (x == 2) {
                    $("#formCheck-february").prop('checked', true);
                }

                if (x == 3) {
                    $("#formCheck-march").prop('checked', true);
                }

                if (x == 4) {
                    $("#formCheck-april").prop('checked', true);
                }

                if (x == 5) {
                    $("#formCheck-may").prop('checked', true);
                }

                if (x == 6) {
                    $("#formCheck-june").prop('checked', true);
                }

                if (x == 7) {
                    $("#formCheck-july").prop('checked', true);
                }

                if (x == 8) {
                    $("#formCheck-august").prop('checked', true);
                }

                if (x == 9) {
                    $("#formCheck-september").prop('checked', true);
                }

                if (x == 10) {
                    $("#formCheck-october").prop('checked', true);
                }

                if (x == 11) {
                    $("#formCheck-november").prop('checked', true);
                }

                if (x == 12) {
                    $("#formCheck-december").prop('checked', true);
                }
            }
        }

        if (dateone == "") {
            $("#formCheck-january").prop('checked', true);
        }

    }





    templateObject.getDayName = function (day) {
        if (day == 1 || day == 0) {
            $("#formCheck-monday").prop('checked', true);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 2) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', true);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 3) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', true);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 4) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', true);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 5) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', true);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 6) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', true);
            $("#formCheck-sunday").prop('checked', false);
        }

        if (day == 7) {
            $("#formCheck-monday").prop('checked', false);
            $("#formCheck-tuesday").prop('checked', false);
            $("#formCheck-wednesday").prop('checked', false);
            $("#formCheck-thursday").prop('checked', false);
            $("#formCheck-friday").prop('checked', false);
            $("#formCheck-saturday").prop('checked', false);
            $("#formCheck-sunday").prop('checked', true);
        }

    }
    templateObject.assignSettings = function (setting) {
        if (setting == "W") {
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $('#frequencyWeekly').trigger('click');
        }

        if (setting == "D") {
            $("#frequencyDaily").trigger('click');
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
        }

        if (setting == "M") {
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $('#frequencyMonthly').prop('checked', false);
        }

        if (setting == "T") {
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyOnetimeonly").trigger('click');
            $('#frequencyMonthly').prop('checked', false);
        }

    }
    templateObject.getScheduleInfo = function () {
        taxRateService.getScheduleSettings().then(function(data) {
            console.log(data);
            let empData = data.treportschedules;
            templateObject.originScheduleData.set(data.treportschedules);
            var empDataCurr = '';
            $.grep(templateObject.formsData.get(), function (n) {
                let recipients = [];
                let recipientIds = [];
                let formIds = [];
                for (let i = 0; i < empData.length; i++) {
                    if (empData[i].fields.Active) {
                        if ((n.id == '1' && empData[i].fields.BeginFromOption === "S") || (n.id == empData[i].fields.FormID && empData[i].fields.BeginFromOption !== "S")) {
                            if (!recipients.includes(empData[i].fields.EmployeeEmailID)) {
                                recipients.push(empData[i].fields.EmployeeEmailID);
                                recipientIds.push(empData[i].fields.EmployeeId);
                            }
                            if (n.id == '1' && empData[i].fields.BeginFromOption === "S") formIds.push(empData[i].fields.FormID);
                            const startDate = empData[i].fields.StartDate.split(' ')[0];
                            const startTime = empData[i].fields.StartDate.split(' ')[1];

                            //TODO: Getting BasedOnType from localstorage
                            let basedOnTypeData = localStorage.getItem(`BasedOnType_${n.id}_${empData[i].fields.EmployeeId}`);
                            let basedOnType = basedOnTypeData ? JSON.parse(basedOnTypeData).BasedOnType : '';
                            let isInOut = basedOnTypeData ? JSON.parse(basedOnTypeData).ISEmpty : false;
                            if (basedOnType == "P") basedOnType = "On Print";
                            else if (basedOnType == "S") basedOnType = "On Save";
                            else if (basedOnType == "T") basedOnType = "On Transaction Date";
                            else if (basedOnType == "D") basedOnType = "On Due Date";
                            else if (basedOnType == "O") basedOnType = "If Outstanding";
                            else if (basedOnType == "E") basedOnType = "On Event";
                            else basedOnType = '';

                            empDataCurr = {
                                employeeid: recipientIds.join('; ') || '',
                                every: empData[i].fields.Every || '',
                                formID: n.id || '',
                                employeeEmailID: recipients.join('; ') || '',
                                formname: n.name || '',
                                basedOnType: basedOnType,
                                isEmpty: isInOut,
                                frequency: empData[i].fields.Frequency || '',
                                id: empData[i].fields.ID || '',
                                monthDays: empData[i].fields.MonthDays || '',
                                nextDueDate: empData[i].fields.NextDueDate || '',
                                startDate: startDate.split('-')[2] + '/' + startDate.split('-')[1] + '/' + startDate.split('-')[0] || '',
                                startTime: startTime.split(':')[0] + ':' + startTime.split(':')[1] || '',
                                weekDay: empData[i].fields.WeekDay || '',
                                satAction: empData[i].fields.SatAction || '',
                                sunAction: empData[i].fields.SunAction || '',
                                beginFromOption: empData[i].fields.BeginFromOption || '',
                                formIDs: formIds.join('; '),
                            };
                            if (recipients.length === 1 && formIds.length === 1) employeeScheduledRecord.push(empDataCurr);
                            else {
                                employeeScheduledRecord = [...employeeScheduledRecord.filter(schedule => schedule.formID != n.id), empDataCurr];
                            }
                        }
                    }
                }
                empDataCurr = {
                    employeeid: '',
                    employeeEmailID: '',
                    every: '',
                    formID: n.id || '',
                    formname: n.name || '',
                    frequency: '',
                    monthDays: '',
                    nextDueDate: '',
                    startDate: '',
                    startTime: '',
                    weekDay: '',
                    satAction: '',
                    sunAction: '',
                    beginFromOption: '',
                    formIDs: '',
                    basedOnType: '',
                    isEmpty: false
                }

                let found = employeeScheduledRecord.some(checkdata => checkdata.formID == n.id);
                if (!found) {
                    employeeScheduledRecord.push(empDataCurr);
                }
            });

            // Initialize Grouped Reports Modal
            const groupedReportData = employeeScheduledRecord.filter(schedule => schedule.formID == '1');
            if (groupedReportData.length === 1) {
                const formIds = groupedReportData[0].formIDs.split('; ');
                for (let i = 0; i < formIds.length; i++) {
                    $("#groupedReports-" + formIds[i] + ' .star').prop('checked', true);
                }
            }

            $('.fullScreenSpin').css('display', 'none');
            templateObject.employeescheduledrecord.set(employeeScheduledRecord);

            if (templateObject.employeescheduledrecord.get()) {
                setTimeout(function () {
                    $('#tblAutomatedEmails').DataTable({
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "taxratelist_" + moment().format(),
                            orientation: 'portrait',
                            exportOptions: {
                                columns: ':visible'
                            }
                        }, {
                            extend: 'print',
                            download: 'open',
                            className: "btntabletopdf hiddenColumn",
                            text: '',
                            title: 'Tax Rate List',
                            filename: "taxratelist_" + moment().format(),
                            exportOptions: {
                                columns: ':visible'
                            }
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        colReorder: {
                            fixedColumnsRight: 1
                        },
                        lengthMenu: [
                            [50, -1],
                            [50, "All"]
                        ],
                        // bStateSave: true,
                        // rowId: 0,
                        paging: true,
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "asc"]
                        ],
                        action: function () {
                            $('#currencyLists').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.employeescheduledrecord.get();
                        templateObject.employeescheduledrecord.set(draftRecord);
                    }).on('column-reorder', function () {

                    }).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#currencyLists').DataTable().column( 0 ).visible( true );
                    // $('.fullScreenSpin').css('display', 'none');
                }, 500);
                setTimeout(function () {
                    $('#tblEssentialAutomatedEmails').DataTable({
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "taxratelist_" + moment().format(),
                            orientation: 'portrait',
                            exportOptions: {
                                columns: ':visible'
                            }
                        }, {
                            extend: 'print',
                            download: 'open',
                            className: "btntabletopdf hiddenColumn",
                            text: '',
                            title: 'Tax Rate List',
                            filename: "taxratelist_" + moment().format(),
                            exportOptions: {
                                columns: ':visible'
                            }
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        colReorder: {
                            fixedColumnsRight: 1
                        },
                        lengthMenu: [
                            [50, -1],
                            [50, "All"]
                        ],
                        // bStateSave: true,
                        // rowId: 0,
                        paging: false,
                        info: false,
                        responsive: true,
                        searching: false,
                        "order": [
                            [0, "asc"]
                        ],
                        action: function () {
                            $('#tblEssentialAutomatedEmails').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.employeescheduledrecord.get();
                        templateObject.employeescheduledrecord.set(draftRecord);
                    }).on('column-reorder', function () {

                    }).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#currencyLists').DataTable().column( 0 ).visible( true );
                    // $('.fullScreenSpin').css('display', 'none');
                }, 500);
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
                    Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') { }
            });
            $('.fullScreenSpin').css('display', 'none');

        });
    }

    templateObject.getScheduleInfo();

    $('#tblContactlist tbody').on('click', 'td:not(.chkBox)', function () {
        //var tableCustomer = $(this);
        let selectDataID = $('#customerSelectLineID').val() || '';
        let listData = $(this).closest('tr').find('.colEmail').text() || "";
        let customerId = $(this).closest('tr').find('.colID').text();
        $('#customerListModal').modal('toggle');

        $('#' + selectDataID).val(listData);
        $('#' + selectDataID).attr('data-ids', customerId);
        //$('#'+selectLineID+" .lineAccountName").val('');
    });

    templateObject.saveSchedules = async function(settings, isEssential) {
        return new Promise(async (resolve, reject) => {
            const oldSettings = templateObject.originScheduleData.get();
            // Filter old settings according to the types of email setting(Essential one or Automated one)
            if (!isEssential) {
                oldSettings = oldSettings.filter(oldSetting => oldSetting.fields.FormID != 54 && oldSetting.fields.FormID != 177 && oldSetting.fields.FormID != 129);
            }
            console.log(oldSettings);
            try {
                let promise = settings.map(async (setting) => {
                    const formID = $(setting).attr('data-id');
                    const formName = $(setting).find('.sorting_1').text();
                    const frequencyEl = $(setting).find('#edtFrequency');
                    const sendEl = $(setting).find('#edtBasedOn');
                    let recipientIds = $(setting).find('input.edtRecipients').attr('data-ids');
                    let recipients = $(setting).find('input.edtRecipients').val();
                    console.log(recipientIds, recipients);
                    // Check if this setting has got recipients
                    const basedOnTypeText = sendEl.text();
                    let basedOnType = '';
                    let isEmpty = false;
                    if (basedOnTypeText == "On Print") basedOnType = "P";
                    else if (basedOnTypeText == "On Save") basedOnType = "S";
                    else if (basedOnTypeText == "On Transaction Date") basedOnType = "T";
                    else if (basedOnTypeText == "On Due Date") basedOnType = "D";
                    else if (basedOnTypeText == "If Outstanding") basedOnType = "O";
                    else if (basedOnTypeText == "On Event") {
                        basedOnType = "E";
                        const eventRadios = $('#basedOnModal input[type="radio"]:checked').attr('id');
                        console.log(eventRadios);
                        if (eventRadios == "settingsOnLogon") isEmpty = false;
                        else isEmpty = true;
                    }
                    if (!!recipients) {
                        recipientIds = recipientIds.split('; ');
                        recipients = recipients.split('; ');
                        let saveSettingPromises = recipientIds.map(async (recipientId, index) => {
                            const starttime = frequencyEl.attr('data-starttime');
                            const startdate = frequencyEl.attr('data-startdate');
                            const convertedStartDate = startdate ? startdate.split('/')[2] + '-' + startdate.split('/')[1] + '-' + startdate.split('/')[0] : '';
                            const sDate = startdate ? moment( convertedStartDate + ' ' + starttime).format("YYYY-MM-DD HH:mm") : moment().format("YYYY-MM-DD HH:mm");
        
                            const frequencyName = frequencyEl.text();
                            console.log(formID, recipientId);
                            let objDetail = {
                                type: "TReportSchedules",
                                fields: {
                                    Active: true,
                                    BeginFromOption: "",
                                    ContinueIndefinitely: true,
                                    EmployeeId: parseInt(recipientId),
                                    Every: 1,
                                    EndDate: "",
                                    FormID: parseInt(formID),
                                    LastEmaileddate: "",
                                    MonthDays: 0,
                                    StartDate: sDate,
                                    WeekDay: 1,
                                    NextDueDate: '',
                                }
                            };
    
                            if (frequencyName === "Monthly") {
                                const monthDate = frequencyEl.attr('data-monthdate') ? parseInt(frequencyEl.attr('data-monthdate').replace('day', '')) : 0;
                                const ofMonths = frequencyEl.attr('data-ofMonths');
                                // objDetail.fields.ExtraOption = ofMonths;
                                objDetail.fields.MonthDays = monthDate;
                                objDetail.fields.Frequency = "M";
                            } else if (frequencyName === "Weekly") {
                                const selectdays = frequencyEl.attr("data-selectdays");
                                const everyweeks = frequencyEl.attr("data-everyweeks");
                                objDetail.fields.Frequency = "W";
                                objDetail.fields.WeekDay = parseInt(selectdays);
                                if (everyweeks) objDetail.fields.Every = parseInt(everyweeks);
                            } else if (frequencyName === "Daily") {
                                objDetail.fields.Frequency = "D";
                                const dailyradiooption = frequencyEl.attr("data-dailyradiooption");
                                const everydays = frequencyEl.attr("data-everydays");
                                // objDetail.fields.ExtraOption = dailyradiooption;
                                objDetail.fields.SatAction = "P";
                                objDetail.fields.SunAction = "P";
                                objDetail.fields.Every = -1;
                                if (dailyradiooption === 'dailyWeekdays') {
                                    objDetail.fields.SatAction = "D";
                                    objDetail.fields.SunAction = "D";
                                }
                                if (dailyradiooption === 'dailyEvery' && everydays) objDetail.fields.Every = parseInt(everydays);
                            } else if (frequencyName === "One Time Only") {
                                objDetail.fields.EndDate = sDate;
                                objDetail.fields.Frequency = "";
                            } else {
                                objDetail.fields.Active = false;
                            }

                            if (formID == '1') {
                                // if report type is Grouped Reports....
                                const groupedReports = $('#groupedReportsModal .star:checked').map(function() {return $(this)}).get();
                                let formIDs = [];
                                groupedReports.map(async (groupedReport) => {
                                    formIDs.push(parseInt($(groupedReport).closest('tr').attr('id').replace('groupedReports-', '')));
                                    oldSettings = oldSettings.filter(oldSetting => {
                                        return oldSetting.fields.FormID != parseInt($(groupedReport).closest('tr').attr('id').replace('groupedReports-', ''))
                                        || oldSetting.fields.EmployeeId != parseInt(recipientId);
                                    });
                                });
                                console.log(oldSettings);

                                // Add synced cron job here
                                objDetail.fields.FormIDs = formIDs.join(',');
                                objDetail.fields.FormID = 1;
                                objDetail.fields.FormName = formName;
                                objDetail.fields.EmployeeEmail = recipients[index];
                                objDetail.fields.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://localhost:3000';

                                console.log(objDetail.fields);

                                //TODO: Set basedon type here
                                const basedOnTypeText = sendEl.text();
                                let basedOnType = '';
                                let isEmpty = false;
                                if (basedOnTypeText == "On Print") basedOnType = "P";
                                else if (basedOnTypeText == "On Save") basedOnType = "S";
                                else if (basedOnTypeText == "On Transaction Date") basedOnType = "T";
                                else if (basedOnTypeText == "On Due Date") basedOnType = "D";
                                else if (basedOnTypeText == "If Outstanding") basedOnType = "O";
                                else if (basedOnTypeText == "On Event") {
                                    basedOnType = "E";
                                    const eventRadios = $('#basedOnModal input[type="radio"]:checked').attr('id');
                                    console.log(eventRadios);
                                    if (eventRadios == "settingsOnLogon") isEmpty = false;
                                    else isEmpty = true;
                                }
                                localStorage.setItem(`BasedOnType_${objDetail.fields.FormID}_${objDetail.fields.EmployeeId}`, JSON.stringify({
                                    ...objDetail.fields,
                                    BasedOnType: basedOnType,
                                    ISEmpty: isEmpty
                                }));

                                const nextDueDate = await new Promise((resolve, reject) => {
                                    Meteor.call('calculateNextDate', objDetail.fields, (error, result) => {
                                        if (error) return reject(error);
                                        resolve(result);
                                    });
                                });
                                objDetail.fields.NextDueDate = nextDueDate;
                                
                                Meteor.call('addTask', objDetail.fields);
                            } else {
                                const oldSetting = oldSettings.filter((setting) => setting.fields.FormID == parseInt(formID) && setting.fields.EmployeeId == parseInt(recipientId));
                                oldSettings = oldSettings.filter((setting) => setting.fields.FormID != parseInt(formID) || setting.fields.EmployeeId != recipientId);
                                if (oldSetting.length && oldSetting[0].fields.ID) objDetail.fields.ID = oldSetting[0].fields.ID; // Confirm if this setting is inserted or updated
    
                                const nextDueDate = await new Promise((resolve, reject) => {
                                    Meteor.call('calculateNextDate', objDetail.fields, (error, result) => {
                                        if (error) return reject(error);
                                        resolve(result);
                                    });
                                });
                                objDetail.fields.NextDueDate = nextDueDate;
                                
                                try {
                                    // Save email settings
                                    await taxRateService.saveScheduleSettings(objDetail);
                                } catch(e) {
                                    console.log(e);
                                }

                                //TODO: Set basedon type here
                                localStorage.setItem(`BasedOnType_${objDetail.fields.FormID}_${objDetail.fields.EmployeeId}`, JSON.stringify({
                                    ...objDetail.fields,
                                    BasedOnType: basedOnType,
                                    ISEmpty: isEmpty
                                }));
        
                                // Add synced cron job here
                                objDetail.fields.FormName = formName;
                                objDetail.fields.EmployeeEmail = recipients[index];
                                objDetail.fields.HostURL = $(location).attr('protocal') ? $(location).attr('protocal') + "://" + $(location).attr('hostname') : 'http://' + $(location).attr('hostname');
                                Meteor.call('addTask', objDetail.fields);
                            }
                        });
                        await Promise.all(saveSettingPromises);
                    }
                });
                savedSchedules = await Promise.all(promise);
                
                console.log('Unsaved old settings => ', oldSettings);

                let promise1 = oldSettings.map(async setting => {
                    if ((isEssential && (setting.fields.BeginFromOption == "S" || setting.fields.FormID == 54 
                        || setting.fields.FormID == 177 && setting.fields.FormID == 129)) || (!isEssential
                        && setting.fields.BeginFromOption != "S" && setting.fields.FormID != 54
                        && setting.fields.FormID != 177 && setting.fields.FormID != 129)) {
                        // Remove all
                        setting.fields.Active = false;
                        Meteor.call('addTask', setting.fields);
                        const saveResult = await taxRateService.saveScheduleSettings({
                            type: "TReportSchedules",
                            fields: {
                                Active: false,
                                ID: setting.fields.ID
                            }
                        });
                        console.log(saveResult);
                        //TODO: Set basedon type here
                        localStorage.removeItem(`BasedOnType_${setting.fields.FormID}_${setting.fields.EmployeeId}`);
                    }
                });
                await Promise.all(promise1);
                resolve({success: true, message: ''});
            } catch(error) {
                console.log(error);
                if (typeof error !== 'string') error = error.message;
                resolve({success: false, message: 'Something went wrong. Please try again later.'});
            }
        });
    }

    templateObject.saveGroupedReports = async function() {
        try {
            const oldSettings = templateObject.originScheduleData.get();
            // Filter old settings according to the types of email setting(Essential one or Automated one)
            // oldSettings = oldSettings.filter(oldSetting => oldSetting.fields.BeginFromOption === "S");
            const groupedReports = $('#groupedReportsModal .star:checked').map(function() {return $(this)}).get();
            const formID = $('#automated1').attr('data-id');
            const frequencyEl = $('#automated1').find('#edtFrequency');
            const sendEl = $('#automated1').find('#edtBasedOn');
            let recipientIds = $('#automated1').find('input.edtRecipients').attr('data-ids');
            if (!!recipientIds) {
                recipientIds = recipientIds.split('; ');
                let savePromise = recipientIds.map(async (recipientId) => {
                    const starttime = frequencyEl.attr('data-starttime');
                    const startdate = frequencyEl.attr('data-startdate');
                    const convertedStartDate = startdate ? startdate.split('/')[2] + '-' + startdate.split('/')[1] + '-' + startdate.split('/')[0] : '';
                    const sDate = startdate ? moment( convertedStartDate + ' ' + starttime).format("YYYY-MM-DD HH:mm") : moment().format("YYYY-MM-DD HH:mm");
    
                    const frequencyName = frequencyEl.text();
                    let objDetail = {
                        type: "TReportSchedules",
                        fields: {
                            Active: true,
                            BeginFromOption: "",
                            ContinueIndefinitely: true,
                            EmployeeId: parseInt(recipientId),
                            Every: 1,
                            EndDate: "",
                            FormID: parseInt(formID),
                            LastEmaileddate: "",
                            MonthDays: 0,
                            StartDate: sDate,
                            WeekDay: 1,
                            NextDueDate: '',
                        }
                    };
                    console.log("AA", objDetail)
            
                    if (frequencyName === "Monthly") {
                        const monthDate = frequencyEl.attr('data-monthdate') ? parseInt(frequencyEl.attr('data-monthdate').replace('day', '')) : 0;
                        const ofMonths = frequencyEl.attr('data-ofMonths');
                        // objDetail.fields.ExtraOption = ofMonths;
                        objDetail.fields.MonthDays = monthDate;
                        objDetail.fields.Frequency = "M";
                    } else if (frequencyName === "Weekly") {
                        const selectdays = frequencyEl.attr("data-selectdays");
                        const everyweeks = frequencyEl.attr("data-everyweeks");
                        objDetail.fields.Frequency = "W";
                        objDetail.fields.WeekDay = parseInt(selectdays);
                        if (everyweeks) objDetail.fields.Every = parseInt(everyweeks);
                    } else if (frequencyName === "Daily") {
                        objDetail.fields.Frequency = "D";
                        const dailyradiooption = frequencyEl.attr("data-dailyradiooption");
                        const everydays = frequencyEl.attr("data-everydays");
                        // objDetail.fields.ExtraOption = dailyradiooption;
                        objDetail.fields.SatAction = "P";
                        objDetail.fields.SunAction = "P";
                        objDetail.fields.Every = -1;
                        if (dailyradiooption === 'dailyWeekdays') {
                            objDetail.fields.SatAction = "D";
                            objDetail.fields.SunAction = "D";
                        }
                        if (dailyradiooption === 'dailyEvery' && everydays) objDetail.fields.Every = parseInt(everydays);
                    } else if (frequencyName === "One Time Only") {
                        objDetail.fields.EndDate = sDate;
                        objDetail.fields.Frequency = "";
                    } else {
                        objDetail.fields.Active = false;
                    }
                    console.log(objDetail, oldSettings, recipientId)
                    console.log(groupedReports.length);
                    let promises = groupedReports.map(async (groupedReport) => {
                        console.log($(groupedReport).closest('tr').attr('id'));
                        objDetail.fields.FormID = parseInt($(groupedReport).closest('tr').attr('id').replace('groupedReports-', ''));
                        objDetail.fields.ISEmpty = true;
                        console.log(objDetail);
                        console.log(oldSettings);
    
                        const oldSetting = oldSettings.filter((setting) => {
                            console.log(setting, $(groupedReport).closest('tr').attr('id').replace('groupedReports-', ''), recipientId)
                            return setting.fields.FormID == $(groupedReport).closest('tr').attr('id').replace('groupedReports-', '') && setting.fields.EmployeeId == parseInt(recipientId)
                        });
                        console.log('---------------------------------------------------',oldSetting)
                        oldSettings = oldSettings.filter((setting) => {
                            console.log(setting.fields.FormID != $(groupedReport).closest('tr').attr('id').replace('groupedReports-', ''));
                            console.log(setting.fields.EmployeeId != parseInt(recipientId));
                            return setting.fields.FormID != $(groupedReport).closest('tr').attr('id').replace('groupedReports-', '') || setting.fields.EmployeeId != parseInt(recipientId)
                        });
                        console.log($(groupedReport).closest('tr').attr('id').replace('groupedReports-', ''), parseInt(recipientId))
                        if (oldSetting.length && oldSetting[0].fields.ID) objDetail.fields.ID = oldSetting[0].fields.ID; // Confirm if this setting is inserted or updated
                        else delete objDetail.fields.ID;
    
                        // const sendName = sendEl.text();
            
                        //TODO: Add employee email field
                        // objDetail.fields.EmployeeEmail = recipients[i];
            
                        // Get next due date for email scheduling
                        // const nextDueDate = await new Promise((resolve, reject) => {
                        //     Meteor.call('calculateNextDate', objDetail.fields, (error, result) => {
                        //         if (error) return reject(error);
                        //         resolve(result);
                        //     });
                        // });
            
                        // objDetail.fields.NextDueDate = nextDueDate;
                        objDetail.fields.BeginFromOption = "S";
    
                        // Save email settings
                        await taxRateService.saveScheduleSettings(objDetail);
                    });
                    await Promise.all(promises);
                    console.log(oldSettings);
                    let removeSetting = oldSettings.map(async (setting) => {
                        if (setting.fields.BeginFromOption === "S") {
                            await taxRateService.saveScheduleSettings({
                                type: "TReportSchedules",
                                fields: {
                                    Active: false,
                                    ID: setting.fields.ID
                                }
                            })
                        }
                    });
                    await Promise.all(removeSetting);
                });
                await Promise.all(savePromise);
                return {success: true};
            } else {
                return {success: true};
            }
        } catch(e) {
            console.log(e);
            return {success: false, message: 'Something went wrong. Please try again later.'};
        }
    }
});

Template.emailsettings.events({
    'click .btnSelectContact': async function (event) {
        let selectDataID = $('#customerSelectLineID').val() || '';
        var tblContactService = $(".tblContactlist").dataTable();

        let datacontactList = [];
        let datacontractIDList = [];
        $(".chkServiceCard:checked", tblContactService.fnGetNodes()).each(function () {
            let contactEmail = $(this).closest('tr').find('.colEmail').text() || '';
            let contactID = $(this).closest('tr').find('.colID').text() || '';
            if (contactEmail.replace(/\s/g, '') != '') {
                datacontactList.push(contactEmail);
            }
            datacontractIDList.push(contactID);
        });
        $('#' + selectDataID).val(datacontactList.join("; "));
        $('#' + selectDataID).attr('data-ids', datacontractIDList.join("; "));
        $('#customerListModal').modal('toggle');
    },
    'click #swtAllCustomers': function () {
        const recipientList = $('#tblContactlist tbody tr');
        for (let i = 0; i < recipientList.length; i++) {
            if ($(recipientList[i]).find('td.colType').text().includes('Customer'))
                $(recipientList[i]).find('.chkServiceCard').prop('checked', event.target.checked);
        }
    },
    'click #swtAllEmployees': function () {
        const recipientList = $('#tblContactlist tbody tr');
        for (let i = 0; i < recipientList.length; i++) {
            if ($(recipientList[i]).find('td.colType').text().includes('Employee'))
                $(recipientList[i]).find('.chkServiceCard').prop('checked', event.target.checked);
        }
    },
    'click #swtAllSuppliers': function () {
        const recipientList = $('#tblContactlist tbody tr');
        for (let i = 0; i < recipientList.length; i++) {
            if ($(recipientList[i]).find('td.colType').text().includes('Supplier'))
                $(recipientList[i]).find('.chkServiceCard').prop('checked', event.target.checked);
        }
    },
    'click .btnSaveFrequency': function () {
        // let taxRateService = new TaxRateService();
        let templateObject = Template.instance();
        // let startTime = "";
        // let startDate = "";
        // let date = "";
        // let frequency = ""
        // let every = 0;
        // let monthDays = 0;
        // let weekDay = 0;
        // let id = $('#frequencyid').val() || '';
        // let employeeID = Session.get('mySessionEmployeeLoggedID');
        let formId = parseInt($("#formid").val());
        let radioFrequency = $('input[type=radio][name=frequencyRadio]:checked').attr('id');
        
        if (radioFrequency == "frequencyMonthly") {
            const monthDate = $("#sltDay").val().replace('day', '');
            const ofMonths = '';
            let isFirst = true;
            $(".ofMonthList input[type=checkbox]:checked").each(function() {
                ofMonths += isFirst ? $(this).val() : ',' + $(this).val();
                isFirst = false;
            });
            console.log(ofMonths);
            const startTime = $('#edtMonthlyStartTime').val();
            const startDate = $('#edtMonthlyStartDate').val();

            setTimeout(function () {
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').text("Monthly");
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-monthDate', monthDate);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-ofMonths', ofMonths);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startTime', startTime);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startDate', startDate);
                $("#frequencyModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "frequencyWeekly") {
            const everyWeeks = $("#weeklyEveryXWeeks").val();
            const selectDays = $(".selectDays input[type=checkbox]:checked").val();
            console.log(selectDays);
            selectDays = templateObject.getDayNumber(selectDays);
            const startTime = $('#edtWeeklyStartTime').val();
            const startDate = $('#edtWeeklyStartDate').val();
            setTimeout(function () {
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-selectDays', selectDays);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-everyWeeks', everyWeeks);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startTime', startTime);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startDate', startDate);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').text("Weekly");
                $("#frequencyModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "frequencyDaily") {
            const dailyRadioOption = $('#dailySettings input[type=radio]:checked').attr('id');
            const everyDays = $("#dailyEveryXDays").val();
            const startTime = $('#edtDailyStartTime').val();
            const startDate = $('#edtDailyStartDate').val();
            setTimeout(function () {
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').text("Daily");
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-dailyRadioOption', dailyRadioOption);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-everydays', everyDays);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startTime', startTime);
                $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startDate', startDate);
                $("#frequencyModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "frequencyOnetimeonly") {
            const startTime = $('#edtOneTimeOnlyTime').val();
            const startDate = $('#edtOneTimeOnlyDate').val();
            if (startDate && startTime) {
                $('#edtOneTimeOnlyTimeError').css('display', 'none');
                $('#edtOneTimeOnlyDateError').css('display', 'none');
                setTimeout(function () {
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').text("One Time Only");
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startTime', startTime);
                    $('.dnd-moved[data-id="' + formId + '"] #edtFrequency').attr('data-startDate', startDate);
                    $("#frequencyModal").modal('toggle');
                }, 100);
            } else {
                $('#edtOneTimeOnlyTimeError').css('display', 'block');
                $('#edtOneTimeOnlyDateError').css('display', 'block');
            }
        } else {
            $("#frequencyModal").modal('toggle');
        }
    },
    'click .dnd-moved': (e) => {
        localStorage.setItem('transactiontype', e.currentTarget.getAttribute('id'));
    },
    'click #emailsetting-essential': async function () {
        const templateObject = Template.instance();
        const essentialSettings = $('#tblEssentialAutomatedEmails tbody tr').map(function() {return $(this)}).get();
        $('.fullScreenSpin').css('display', 'inline-block');

        console.log(essentialSettings);

        const saveResult = await templateObject.saveSchedules(essentialSettings, true);
        const saveGroupResult = await templateObject.saveGroupedReports();

        console.log(saveResult);
        console.log(saveGroupResult);

        if (saveResult.success && saveGroupResult.success)
            swal({
                title: 'Success',
                text: "Automated Email Settings (Essentials) were scheduled successfully",
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then(() => {
                window.open('/emailsettings','_self');
            });
        else 
            swal({
                title: 'Oooops...',
                text: 'Something went wrong! Please try again later.',
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then(() => {
                window.open('/emailsettings','_self');
            });
        $('.fullScreenSpin').css('display', 'none');
    },
    'click #emailsetting-normal': async function() {
        const templateObject = Template.instance();
        const normalSettings = $('#tblAutomatedEmails tbody tr').map(function() {return $(this)}).get();
        $('.fullScreenSpin').css('display', 'inline-block');

        console.log(normalSettings);

        const saveResult = await templateObject.saveSchedules(normalSettings, false);

        console.log(saveResult);

        if (saveResult.success) {
            swal({
                title: 'Success',
                text: 'Normal Email Settings were scheduled successfully',
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then(() => {
                window.open('/emailsettings','_self');
            });
        } else {
            swal({
                title: 'Oooops...',
                text: 'Something went wrong! Please try again later.',
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then(() => {
                window.open('/emailsettings','_self');
            });
        }

        $('.fullScreenSpin').css('display', 'none');
    },
    'click .chkBoxDays': function (event) {
        var checkboxes = document.querySelectorAll('.chkBoxDays');
        checkboxes.forEach((item) => {
            if (item !== event.target) {
                item.checked = false
            }
        });
    },
    'click #edtFrequency': function (event) {
        let templateObject = Template.instance();
        let scheduleData = templateObject.employeescheduledrecord.get();
        let formId = $(event.target).closest("tr").attr("data-id");


        $("#formid").val(formId);
        // Initialize all options
        const $radioFrequencyType = $('input[name="frequencyRadio"]');
        $radioFrequencyType.filter('[id=frequencyMonthly]').trigger('click');
        $('.ofMonthList input[type="checkbox"]').prop('checked', false);
        $('#sltDay').val('day1');
        $('#edtMonthlyStartTime').val('');
        $('#edtMonthlyStartDate').val('');
        $('.chkBoxDays').prop('checked', false);
        $('#formCheck-monday').prop('checked', true);
        $('#weeklyEveryXWeeks').val('');
        $('#dailyEveryDay').prop('checked', true);
        $('#dailyEveryXDays').val('');
        $('#settingsOnLogon').prop('checked', true);

        $('.colSettings').css('display', 'none'); // Hide all left-settings part

        const frequencyType = $(event.target).html();
        console.log(frequencyType);
        const startDate = $(event.target).attr('data-startdate') ? $(event.target).attr('data-startdate') : '';
        const startTime = $(event.target).attr('data-starttime') ? $(event.target).attr('data-starttime') : '';
        if (frequencyType === 'Monthly') {
            $radioFrequencyType.filter('[id=frequencyMonthly]').trigger('click');
            const monthDay = $(event.target).attr('data-monthdate') ? 'day' + $(event.target).attr('data-monthdate') : 'day1';
            // const months = $(event.target).attr('data-ofmonths') ? $(event.target).attr('data-ofmonths').split(',') : [];
            $('#sltDay').val(monthDay);
            // const monthCheckboxes = $('.ofMonthList input[type="checkbox"]');
            // for(let i = 0; i < monthCheckboxes.length; i++) {
            //     if (months.includes($(monthCheckboxes[i]).attr('value'))) $(monthCheckboxes[i]).prop('checked', true);
            //     else $(monthCheckboxes[i]).prop('checked', false);
            // };
            $('#edtMonthlyStartDate').val(startDate);
            $('#edtMonthlyStartTime').val(startTime);
            $('#monthlySettings').css('display', 'block');
        } else if (frequencyType === 'Weekly') {
            $radioFrequencyType.filter('[id=frequencyWeekly]').trigger('click');
            let selectedDay = $(event.target).attr('data-selectdays');
            if (selectedDay == 0) selectedDay = 'sunday';
            else if (selectedDay == 1) selectedDay = 'monday';
            else if (selectedDay == 2) selectedDay = 'tuesday';
            else if (selectedDay == 3) selectedDay = 'wednesday';
            else if (selectedDay == 4) selectedDay = 'thursday';
            else if (selectedDay == 5) selectedDay = 'friday';
            else if (selectedDay == 6) selectedDay = 'saturday';
            const everyWeeks = $(event.target).attr('data-everyweeks') ? $(event.target).attr('data-everyweeks') : '1';
            const weekdayCheckboxes = $('.chkBoxDays');
            for (let i =0; i < weekdayCheckboxes.length; i++) {
                if (selectedDay === $(weekdayCheckboxes[i]).val()) $(weekdayCheckboxes[i]).prop('checked', true);
                else $(weekdayCheckboxes[i]).prop('checked', false);
            }
            $('#weeklyEveryXWeeks').val(everyWeeks);
            $('#edtWeeklyStartDate').val(startDate);
            $('#edtWeeklyStartTime').val(startTime);
            $('#weeklySettings').css('display', 'block');
        } else if (frequencyType === 'Daily') {
            $radioFrequencyType.filter('[id=frequencyDaily]').trigger('click');
            const everyDays = $(event.target).attr('data-everydays') ? $(event.target).attr('data-everydays') : '';
            const satAction = $(event.target).attr('data-sataction') ? $(event.target).attr('data-sataction') : '';
            const sunAction = $(event.target).attr('data-sunaction') ? $(event.target).attr('data-sunaction') : '';
            if (everyDays === '-1' && satAction === 'P' && sunAction === 'P') {
                $('#dailyEveryDay').trigger('click');
            } else if (everyDays === '-1' && satAction === 'D' && sunAction === 'D') {
                $('#dailyWeekdays').trigger('click');
            } else if (everyDays !== '-1') {
                $('#dailyEvery').trigger('click');
                $('#dailyEveryXDays').val(everyDays);
                $('#dailyEveryXDays').prop('disabled', false);
            }
            $('#edtDailyStartDate').val(startDate);
            $('#edtDailyStartTime').val(startTime);
            $('#dailySettings').css('display', 'block');
        } else if (frequencyType === 'One Time Only') {
            $('#edtOneTimeOnlyDate').val(startDate);
            $('#edtOneTimeOnlyTime').val(startTime);
            $radioFrequencyType.filter('[id=frequencyOnetimeonly]').trigger('click');
            $('#oneTimeOnlySettings').css('display', 'block');
        } else {
            $('#monthlySettings').css('display', 'block');
        }

        $("#frequencyModal").modal('toggle');
    },
    'click #blncSheets #edtFrequency': function () {
        $("#frequencyModal").modal('toggle');

    },
    'click .edtRecipients': function () {
        let recipientsID = event.target.id || '';
        $('#customerSelectLineID').val(recipientsID);
        const recipients = event.target.value ? event.target.value.split('; ') : [];
        console.log(recipients);
        $('.chkServiceCard').prop('checked', false);
        $('#swtAllCustomers').prop('checked', false);
        $('#swtAllEmployees').prop('checked', false);
        $('#swtAllSuppliers').prop('checked', false);
        const recipientList = $('#tblContactlist tbody tr');
        for (let i = 0; i < recipientList.length; i++) {
            const recEmail = $(recipientList[i]).find('td.colEmail').text();
            const recType = $(recipientList[i]).find('td.colType').text();
            if (recipients.includes(recEmail) && recType !== 'Job') $(recipientList[i]).find('.chkServiceCard').prop('checked', true);
        }
        $("#customerListModal").modal('toggle');
    },
    'click #groupedReports': function () {
        let formIds = $(event.target).attr('data-ids') || '';
        formIds = formIds ? formIds.split('; ') : [];
        if (formIds.length > 0) {
            for (let i = 0; i < formIds.length; i++) {
                $("#groupedReports-" + formIds[i] + ' input.star').prop('checked', true);
            }
        }
        $("#groupedReportsModal").modal('toggle');
    },
    'click input[name="frequencyRadio"]': function () {
        if (event.target.id == "frequencyMonthly") {
            document.getElementById("monthlySettings").style.display = "block";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        } else if (event.target.id == "frequencyWeekly") {
            document.getElementById("weeklySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        } else if (event.target.id == "frequencyDaily") {
            document.getElementById("dailySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        } else if (event.target.id == "frequencyOnetimeonly") {
            document.getElementById("oneTimeOnlySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
        }else {
            $("#frequencyModal").modal('toggle');
        }
    },
    'click input[name="settingsMonthlyRadio"]': function () {
        if (event.target.id == "settingsMonthlyEvery") {
            $('.settingsMonthlyEveryOccurence').attr('disabled', false);
            $('.settingsMonthlyDayOfWeek').attr('disabled', false);
            $('.settingsMonthlySpecDay').attr('disabled', true);
        } else if (event.target.id == "settingsMonthlyDay") {
            $('.settingsMonthlySpecDay').attr('disabled', false);
            $('.settingsMonthlyEveryOccurence').attr('disabled', true);
            $('.settingsMonthlyDayOfWeek').attr('disabled', true);
        } else {
            $("#frequencyModal").modal('toggle');
        }
    },
    'click input[name="dailyRadio"]': function () {
        if (event.target.id == "dailyEveryDay") {
            $('.dailyEveryXDays').attr('disabled', true);
        } else if (event.target.id == "dailyWeekdays") {
            $('.dailyEveryXDays').attr('disabled', true);
        } else if (event.target.id == "dailyEvery") {
            $('.dailyEveryXDays').attr('disabled', false);
        } else {
            $("#frequencyModal").modal('toggle');
        }
    },
    'click #edtBasedOn': function (event) {
        localStorage.setItem('selected_editBasedOn_id', $(event.target).closest('tr').attr('data-id'));
        const basedOnType = $(event.target).text();
        $('#edtBasedOnDate').val('');
        $('#basedOnPrint').prop('checked', true);
        $('#onEventSettings').css('display', 'none');
        console.log(basedOnType);
        if (basedOnType === "On Time") {
            const dateTime = $(event.target).attr('data-time');
            $('#edtBasedOnDate').val(dateTime);
            $('#basedOnDate').trigger('click');
            $('#basedOnDate').prop('checked', true);
        } else if (basedOnType === "If Outstanding") $('#basedOnOutstanding').prop('checked', true);
        else if (basedOnType === "On Due Date") $('#basedOnDueDate').prop('checked', true);
        else if (basedOnType === "On Transaction Date") $('#basedOnTransactionDate').prop('checked', true);
        else if (basedOnType === "On Save") $('#basedOnSave').prop('checked', true);
        else if (basedOnType === "On Print") $('#basedOnPrint').prop('checked', true);
        else if (basedOnType === "On Event") {
            $('#onEventSettings').css('display', 'block');
            $('#basedOnEvent').prop('checked', true);
            const isInOut = $(event.target).attr('data-inout');
            if (isInOut == "true") $('#settingsOnLogout').prop('checked', true);
        }
        $("#basedOnModal").modal('toggle');
    },
    'click input[name="basedOnRadio"]': function () {
        if (event.target.id == "basedOnPrint") {
            $('#onEventSettings').css('display', 'none');
        } else if (event.target.id == "basedOnSave") {
            // $('#edtBasedOnDate').attr('disabled', true);
            // $('#edtBasedOnDate').attr('required', false);
            $('#onEventSettings').css('display', 'none');
        } else if (event.target.id == "basedOnTransactionDate") {
            $('#onEventSettings').css('display', 'none');
        } else if (event.target.id == "basedOnDueDate") {
            $('#onEventSettings').css('display', 'none');
        } else if (event.target.id == "basedOnDate") {
            $('#onEventSettings').css('display', 'none');
        } else if (event.target.id == "basedOnOutstanding") {
            $('#onEventSettings').css('display', 'none');
        } else if (event.target.id == "basedOnEvent") {
            $('#onEventSettings').css('display', 'block');
        } else {
            $("#basedOnModal").modal('toggle');
        }
    },
    'click .btnSaveBasedOn': function () {
        event.preventDefault();
        let radioBasedOn = $('input[type=radio][name=basedOnRadio]:checked').attr('id');
        const selectedBasedOnId = localStorage.getItem('selected_editBasedOn_id');

        if (radioBasedOn == "basedOnPrint") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Print");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioBasedOn == "basedOnSave") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Save");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioBasedOn == "basedOnTransactionDate") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Transaction Date");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioBasedOn == "basedOnDueDate") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Due Date");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioBasedOn == "basedOnDate") {
            const dateValue = $('#edtBasedOnDate').val();
            if (dateValue) {
                $('#edtBasedOnDateRequiredText').css('display', 'none');
                setTimeout(function () {
                    $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Time");
                    $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').attr("data-time", dateValue);
                    $("#basedOnModal").modal('toggle');
                }, 100);
            } else {
                $('#edtBasedOnDateRequiredText').css('display', 'block');
            }
        } else if (radioBasedOn == "basedOnOutstanding") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("If Outstanding");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioBasedOn == "basedOnEvent") {
            setTimeout(function () {
                $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').html("On Event");
                const logInOrOut = $('#onEventSettings input[type=radio]:checked').attr('id');
                if (logInOrOut == 'settingsOnLogon') {
                    $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').attr('data-inout', 'in');
                } else {
                    $('.dnd-moved[data-id="' + selectedBasedOnId + '"] #edtBasedOn').attr('data-inout', 'out');
                }
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else {
            $("#basedOnModal").modal('toggle');
        }

        localStorage.setItem('emailsetting-send', radioBasedOn);
    },
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        location.reload(true);
    }
});

Template.emailsettings.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.code == 'NA') {
                return 1;
            } else if (b.code == 'NA') {
                return -1;
            }
            return (a.code.toUpperCase() > b.code.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    employeescheduledrecord: () => {
        return Template.instance().employeescheduledrecord.get();
    },
    reportTypeData: () => {
        return Template.instance().formsData.get();
    },
    checkIfEssentials: (typeId) => {
        return typeId == 1 || typeId == 54 || typeId == 129 || typeId == 177;
    },
    checkIfNotEssentials: (typeId) => {
        return typeId !== 1 && typeId !== 54 && typeId !== 129 && typeId !== 177;
    }
});
