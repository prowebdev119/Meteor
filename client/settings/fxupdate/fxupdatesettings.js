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
let sideBarService = new SideBarService();
Template.fixUpdates.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.countryData = new ReactiveVar();
    templateObject.employeescheduledrecord = new ReactiveVar([]);
    templateObject.essentialemployeescheduledrecord = new ReactiveVar([]);
});

Template.fixUpdates.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];

    var countryService = new CountryService();
    let countries = [];
    let employeeScheduledRecord = [];
    let essentailEmployeeScheduledRecord = [];
    let formsData = [{
            "id": "71",
            "name": "Quotes"
        },
        {
            "id": "77",
            "name": "Sakes Orders"
        },
        {
            "id": "54",
            "name": "Invoices"
        },
        {
            "id": "74",
            "name": "Refunds"
        },
        {
            "id": "69",
            "name": "Purchase Orders"
        },
        {
            "id": "12",
            "name": "Bills"
        },
        {
            "id": "21",
            "name": "Credits"
        },
        {
            "id": "139",
            "name": "Balance Sheets"
        },
        {
            "id": "225",
            "name": "General Ledger"
        },
        {
            "id": "129",
            "name": "Profit and Loss"
        },
        {
            "id": "278",
            "name": "Tax Summary Report"
        },
        {
            "id": "140",
            "name": "Trial Balance"
        },
        {
            "id": "6",
            "name": "Aged Payables"
        },
        {
            "id": "134",
            "name": "Aged Receivables"
        },
        {
            "id": "177",
            "name": "Print Statements"
        },
        {
            "id": "69",
            "name": "Purchase Report"
        },
        {
            "id": "1364",
            "name": "Purchase Summary Report"
        },
        {
            "id": "1464",
            "name": "Product Sales Report"
        },
        {
            "id": "68",
            "name": "Sales Report"
        },
        {
            "id": "61",
            "name": "Customer Payments"
        },
        {
            "id": "94",
            "name": "Supplier Payments"
        },
        {
            "id": "17544",
            "name": "Statements"
        },
        {
            "id": "18",
            "name": "Cheque"
        }
    ];



    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'currencyLists', function(error, result) {
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
        $('td').each(function() {
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

    templateObject.assignFrequency = function(frequency) {
        if (frequency == "Weekly") {
            $("#frequencyWeekly").prop('checked', true);
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $("#frequencyOnevent").prop('checked', false);
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
            $("#frequencyOnevent").prop('checked', false);
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
            $("#frequencyOnevent").prop('checked', false);
            document.getElementById("monthlySettings").style.display = "block";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        }

    }

    templateObject.getDayNumber = function(day) {
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
            return 7;
        }

    }

    templateObject.getMonths = function(startDate, endDate) {
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

    templateObject.getDayName = function(day) {
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
    templateObject.assignSettings = function(setting) {
        if (setting == "W") {
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $("#frequencyOnevent").prop('checked', false);
            $('#frequencyWeekly').trigger('click');
        }

        if (setting == "D") {
            $("#frequencyDaily").prop('checked', true);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyMonthly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $("#frequencyOnevent").prop('checked', false);
        }

        if (setting == "M") {
            $("#frequencyMonthly").prop('checked', true);
            $("#frequencyDaily").prop('checked', false);
            $("#frequencyWeekly").prop('checked', false);
            $("#frequencyOnetimeonly").prop('checked', false);
            $("#frequencyOnevent").prop('checked', false);
            $('#frequencyMonthly').trigger('click');
        }

    }
    templateObject.getScheduleInfo = function() {
        taxRateService.getScheduleSettings().then(function(data) {
            let empData = data.treportschedules;
            var employeeID = Session.get('mySessionEmployeeLoggedID');
            var empDataCurr = '';
            let frequencyFormat = "";
            $.grep(formsData, function(n) {
                for (let i = 0; i < empData.length; i++) {
                    if (n.id == empData[i].fields.FormID) {
                        if (empData[i].fields.Frequency == "D") {
                            frequencyFormat = "Daily";
                        }

                        if (empData[i].fields.Frequency == "W") {
                            frequencyFormat = "Weekly";
                        }

                        if (empData[i].fields.Frequency == "M") {
                            frequencyFormat = "Monthly";
                        }

                        empDataCurr = {
                            fromdate: empData[i].fields.BeginFromOption || '',
                            employeeid: empData[i].fields.EmployeeId || '',
                            endDate: empData[i].fields.EndDate.split(' ')[0] || '' || '',
                            every: empData[i].fields.Every || '',
                            formID: empData[i].fields.FormID || '',
                            formname: n.name || '',
                            frequency: frequencyFormat || '',
                            id: empData[i].fields.ID || '',
                            monthDays: empData[i].fields.MonthDays || '',
                            nextDueDate: empData[i].fields.NextDueDate || '',
                            satAction: empData[i].fields.SatAction || '',
                            startDate: empData[i].fields.StartDate.split(' ')[0] || '',
                            startTime: empData[i].fields.StartDate.split(' ')[1] || '',
                            sunAction: empData[i].fields.SunAction || '',
                            weekDay: empData[i].fields.WeekDay || '',
                        };

                        if (employeeID == empData[i].fields.EmployeeId) {
                            employeeScheduledRecord.push(empDataCurr);
                        }
                    }
                }
                empDataCurr = {
                    fromdate: '',
                    employeeid: '',
                    endDate: '',
                    every: '',
                    formID: n.id || '',
                    formname: n.name || '',
                    frequency: '',
                    id: '',
                    monthDays: '',
                    nextDueDate: '',
                    satAction: '',
                    startDate: '',
                    startTime: '',
                    sunAction: '',
                    weekDay: '',
                }

                let found = employeeScheduledRecord.some(checkdata => checkdata.formID == n.id);
                if (!found) {
                    employeeScheduledRecord.push(empDataCurr);
                }

            });


            $('.fullScreenSpin').css('display', 'none');
            templateObject.employeescheduledrecord.set(employeeScheduledRecord);

            if (templateObject.employeescheduledrecord.get()) {
                setTimeout(function() {
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
                        action: function() {
                            $('#currencyLists').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function(oSettings) {
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                        },

                    }).on('page', function() {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.employeescheduledrecord.get();
                        templateObject.employeescheduledrecord.set(draftRecord);
                    }).on('column-reorder', function() {

                    }).on('length.dt', function(e, settings, len) {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#currencyLists').DataTable().column( 0 ).visible( true );
                    // $('.fullScreenSpin').css('display', 'none');
                }, 500);
                setTimeout(function() {
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
                        action: function() {
                            $('#tblEssentialAutomatedEmails').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function(oSettings) {
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                        },

                    }).on('page', function() {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.employeescheduledrecord.get();
                        templateObject.employeescheduledrecord.set(draftRecord);
                    }).on('column-reorder', function() {

                    }).on('length.dt', function(e, settings, len) {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#currencyLists').DataTable().column( 0 ).visible( true );
                    // $('.fullScreenSpin').css('display', 'none');
                }, 500);
            }
        }).catch(function(err) {
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

    templateObject.getScheduleInfo();

    $('#tblContactlist tbody').on( 'click', 'td:not(.chkBox)', function () {
        //var tableCustomer = $(this);
        let selectDataID = $('#customerSelectLineID').val()||'';
        var listData = $(this).closest('tr').find('.colEmail').text()||"";
        $('#customerListModal').modal('toggle');

        $('#'+selectDataID).val(listData);
        //$('#'+selectLineID+" .lineAccountName").val('');
    });
});

Template.fixUpdates.events({
  'click .btnSelectContact': async function (event) {
      let templateObject = Template.instance();
      let selectDataID = $('#customerSelectLineID').val()||'';


      var tblContactService = $(".tblContactlist").dataTable();

      let datacontactList = [];
      $(".chkServiceCard:checked", tblContactService.fnGetNodes()).each(function() {
        let contactEmail = $(this).closest('tr').find('.colEmail').text()||'';
        if (contactEmail.replace(/\s/g, '') != '') {
          datacontactList.push(contactEmail);
        }
     });
     $('#'+selectDataID).val(datacontactList.join("; "));
    $('#customerListModal').modal('toggle');
  },
    'click #swtAllCustomers': function() {
        // if ($('.contactlistcol').is(':visible') || $('#swtAllCustomers').is(':checked')) {
        //     $('.contactlistcol').css('display', 'none');
        //     $('.contactcheckboxcol').css('margin-bottom', '16px');
        // } else if ($('.contactlistcol').is(':hidden') )  {
        //     $('.contactlistcol').css('display', 'block');
        //     $('.contactcheckboxcol').css('margin-bottom', '0px');
        // } else {}
    },
    'click #swtAllEmployees': function() {
        // if ($('.contactlistcol').is(':visible') || $('#swtAllEmployees').is(':checked')) {
        //     $('.contactlistcol').css('display', 'none');
        //     $('.contactcheckboxcol').css('margin-bottom', '16px');
        // } else if ($('.contactlistcol').is(':hidden'))  {
        //     $('.contactlistcol').css('display', 'block');
        //     $('.contactcheckboxcol').css('margin-bottom', '0px');
        // } else {}
    },
    'click #swtAllSuppliers': function() {
        // if ($('.contactlistcol').is(':visible') || $('#swtAllSuppliers').is(':checked')) {
        //     $('.contactlistcol').css('display', 'none');
        //     $('.contactcheckboxcol').css('margin-bottom', '16px');
        // } else if ($('.contactlistcol').is(':hidden'))  {
        //     $('.contactlistcol').css('display', 'block');
        //     $('.contactcheckboxcol').css('margin-bottom', '0px');
        // } else {}
    },
    'click .btnSaveFrequency': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let taxRateService = new TaxRateService();
        let templateObject = Template.instance();
        let startTime = "";
        let startDate = "";
        let date = "";
        let frequency = ""
        let every = 0;
        let monthDays = 0;
        let weekDay = 0;
        let id = $('#frequencyid').val() || '';
        let employeeID = Session.get('mySessionEmployeeLoggedID');
        let formId = parseInt($("#formid").val());

        var startdateTimeMonthly = new Date($("#edtMonthlyStartDate").datepicker("getDate"));
        var startdateTimeWeekly = new Date($("#edtWeeklyStartDate").datepicker("getDate"));
        var startdateTimeDaily = new Date($("#edtDailyStartDate").datepicker("getDate"));
        var startdateTimeOneTime = new Date($("#edtOneTimeOnlyDate").datepicker("getDate"));

        if ($('#frequencyMonthly').is(":checked")) {
            startTime = $('#edtMonthlyStartTime').val();
            startDate = startdateTimeMonthly.getFullYear() + "-" + (startdateTimeMonthly.getMonth() + 1) + "-" + startdateTimeMonthly.getDate()||'';
            every = $('#sltDayOccurence').val();
            frequency = "M";
            monthDays = $('#sltDayOfWeek').val();
            date = startDate + ' ' + startTime;
        }


        if ($('#frequencyWeekly').is(":checked")) {
            startTime = $('#edtWeeklyStartTime').val();
            startDate = startdateTimeWeekly.getFullYear() + "-" + (startdateTimeWeekly.getMonth() + 1) + "-" + startdateTimeWeekly.getDate()||'';
            every = $('#weeklyEveryXWeeks').val();
            frequency = "W";
            date = startDate + ' ' + startTime;

            var checkboxes = document.querySelectorAll('.chkBoxDays');
            checkboxes.forEach((item) => {
                if (item.checked) {
                    weekDay = templateObject.getDayNumber(item.value);
                }
            });
        }

        if ($('#frequencyDaily').is(":checked")) {
            startTime = $('#edtDailyStartTime').val();
            startDate = startdateTimeDaily.getFullYear() + "-" + (startdateTimeDaily.getMonth() + 1) + "-" + startdateTimeDaily.getDate()||'';
            every = $('#dailyEveryXDays').val()||1;
            frequency = "D";
            date = startDate + ' ' + startTime;
        }

        if ($('#frequencyOnetimeonly').is(":checked")) {
            startTime = $('#edtOneTimeOnlyTime').val();
            startDate = startdateTimeOneTime.getFullYear() + "-" + (startdateTimeOneTime.getMonth() + 1) + "-" + startdateTimeOneTime.getDate()||'';
            every = 1;
            frequency = "D";
            date = startDate + ' ' + startTime;
        }

        if (id == "") {
            objDetails = {
                type: "TReportSchedules",
                fields: {
                    EmployeeId: employeeID,
                    StartDate: date,
                    Every: parseInt(every)||0,
                    Frequency: frequency,
                    FormID: formId,
                    MonthDays: monthDays,
                    //NextDueDate: "2022-02-15 00:00:00",
                    // SatAction: "D",
                    //StartDate: date,
                    // SunAction: "A",
                    WeekDay: weekDay,
                }
            };
        } else {
            objDetails = {
                type: "TReportSchedules",
                fields: {
                    ID: parseInt(id)||0,
                    EmployeeId: employeeID,
                    StartDate: date,
                    Every:  parseInt(every)||0,
                    Frequency: frequency,
                    FormID: formId,
                    MonthDays: monthDays,
                    //NextDueDate: "2022-02-15 00:00:00",
                    // SatAction: "D",
                    //StartDate: date,
                    // SunAction: "A",
                    WeekDay: weekDay,
                }
            };

        }


        taxRateService.saveScheduleSettings(objDetails).then(function(data) {
            Meteor._reload.reload();
        }).catch(function(err) {
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
    },
    'click .chkBoxDays': function(event) {
        var checkboxes = document.querySelectorAll('.chkBoxDays');
        checkboxes.forEach((item) => {
            if (item !== event.target) {
                item.checked = false
            }
        });
    },
    'click #edtFrequency': function(event) {
        let templateObject = Template.instance();
        let scheduleData = templateObject.employeescheduledrecord.get();
        let formId = $(event.target).closest("tr").attr("id");


        $("#formid").val(formId);
        var result = scheduleData.filter(data => {
            return data.formID == formId
        });
        if (result.length > 0) {
          let startDateVal = result[0].startDate != '' ? moment(result[0].startDate).format("DD/MM/YYYY") : result[0].startDate;
            templateObject.assignFrequency(result[0].frequency);
            templateObject.getMonths(result[0].startDate, result[0].endDate);
            $('#frequencyid').val(result[0].id);
            if (result[0].frequency == "Monthly") {
                $('#sltDayOccurence').val(result[0].every);
                $('#sltDayOfWeek').val(result[0].monthDays);
                $('#edtMonthlyStartTime').val(result[0].startTime);
                $('#edtMonthlyStartDate').val(startDateVal);
                $('#edtFrequency').text("Monthly");
            }

            if (result[0].frequency == "Weekly") {
                setTimeout(function() {
                    $('#weeklyEveryXWeeks').val(result[0].every);
                    $('#edtWeeklyStartTime').val(result[0].startTime);
                    $('#edtWeeklyStartDate').val(startDateVal);
                    templateObject.getDayName(result[0].weekDay);
                    $('#edtFrequency').text("Weekly");
                }, 500);
            }

            if (result[0].frequency == "Daily") {
                setTimeout(function() {
                    $('#dailyEveryXDays').val(result[0].every);
                    $('#edtDailyStartTime').val(result[0].startTime);
                    $('#edtDailyStartDate').val(startDateVal);
                    $('#edtFrequency').text("Daily");
                }, 500);
            }
        }

        $("#frequencyModal").modal('toggle');
    },
    'click #blncSheets #edtFrequency': function() {
        $("#frequencyModal").modal('toggle');

    },
    'click .edtRecipients': function() {
      let recipientsID = event.target.id||'';
      $('#customerSelectLineID').val(recipientsID);
      $("#customerListModal").modal('toggle');

    },
    'click #groupedReports': function() {
        $("#groupedReportsModal").modal('toggle');

    },
    'click input[name="frequencyRadio"]': function() {
        if (event.target.id == "frequencyMonthly") {
            document.getElementById("monthlySettings").style.display = "block";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
            document.getElementById("onEventSettings").style.display = "none";
        } else if (event.target.id == "frequencyWeekly") {
            document.getElementById("weeklySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
            document.getElementById("onEventSettings").style.display = "none";
        } else if (event.target.id == "frequencyDaily") {
            document.getElementById("dailySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
            document.getElementById("onEventSettings").style.display = "none";
        } else if (event.target.id == "frequencyOnetimeonly") {
            document.getElementById("oneTimeOnlySettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("onEventSettings").style.display = "none";
        } else if (event.target.id == "frequencyOnevent") {
            document.getElementById("onEventSettings").style.display = "block";
            document.getElementById("monthlySettings").style.display = "none";
            document.getElementById("weeklySettings").style.display = "none";
            document.getElementById("dailySettings").style.display = "none";
            document.getElementById("oneTimeOnlySettings").style.display = "none";
        } else {
            $("#frequencyModal").modal('toggle');
        }
    },
    'click input[name="settingsMonthlyRadio"]': function() {
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
    'click input[name="dailyRadio"]': function() {
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
    // 'click .btnSaveFrequency': function() {
    //     let radioFrequency = $('input[type=radio][name=frequencyRadio]:checked').attr('id');
    //
    //     if (radioFrequency == "frequencyMonthly") {
    //         setTimeout(function() {
    //             $('#edtFrequency').html("Monthly");
    //             $("#frequencyModal").modal('toggle');
    //         }, 100);
    //     } else if (radioFrequency == "frequencyWeekly") {
    //         setTimeout(function() {
    //             $('#edtFrequency').html("Weekly");
    //             $("#frequencyModal").modal('toggle');
    //         }, 100);
    //     } else if (radioFrequency == "frequencyDaily") {
    //         setTimeout(function() {
    //             $('#edtFrequency').html("Daily");
    //             $("#frequencyModal").modal('toggle');
    //         }, 100);
    //     } else if (radioFrequency == "frequencyOnetimeonly") {
    //         setTimeout(function() {
    //             $('#edtFrequency').html("One Time Only");
    //             $("#frequencyModal").modal('toggle');
    //         }, 100);
    //     } else if (radioFrequency == "frequencyOnevent") {
    //         setTimeout(function() {
    //             $('#edtFrequency').html("On Event");
    //             $("#frequencyModal").modal('toggle');
    //         }, 100);
    //     } else {
    //         $("#frequencyModal").modal('toggle');
    //     }
    // },
    'click #edtBasedOn': function() {
        $("#basedOnModal").modal('toggle');
    },
    'click input[name="basedOnRadio"]': function() {
        if (event.target.id == "basedOnPrint") {
            $('#edtBasedOnDate').attr('disabled', true);
        } else if (event.target.id == "basedOnSave") {
            $('#edtBasedOnDate').attr('disabled', true);
        } else if (event.target.id == "basedOnTransactionDate") {
            $('#edtBasedOnDate').attr('disabled', true);
        } else if (event.target.id == "basedOnDueDate") {
            $('#edtBasedOnDate').attr('disabled', true);
        } else if (event.target.id == "basedOnDate") {
            $('#edtBasedOnDate').attr('disabled', false);
        } else if (event.target.id == "basedOnOutstanding") {
            $('#edtBasedOnDate').attr('disabled', true);
        } else {
            $("#basedOnModal").modal('toggle');
        }
    },
    'click .btnSaveBasedOn': function() {
        let radioFrequency = $('input[type=radio][name=basedOnRadio]:checked').attr('id');

        if (radioFrequency == "basedOnPrint") {
            setTimeout(function() {
                $('#edtBasedOn').html("On Print");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "basedOnSave") {
            setTimeout(function() {
                $('#edtBasedOn').html("On Save");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "basedOnTransactionDate") {
            setTimeout(function() {
                $('#edtBasedOn').html("On Transaction Date");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "basedOnDueDate") {
            setTimeout(function() {
                $('#edtBasedOn').html("On Due Date");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "basedOnDate") {
            setTimeout(function() {
                $('#edtBasedOn').html("On Date");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else if (radioFrequency == "basedOnOutstanding") {
            setTimeout(function() {
                $('#edtBasedOn').html("If Outstanding");
                $("#basedOnModal").modal('toggle');
            }, 100);
        } else {
            $("#basedOnModal").modal('toggle');
        }
    },
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        location.reload(true);
    }
});

Template.fixUpdates.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
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
});
