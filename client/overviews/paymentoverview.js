import {
    PaymentsService
} from '../payments/payments-service';
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CoreService
} from '../js/core-service';
import {
    EmployeeProfileService
} from "../js/profile-service";
import {
    AccountService
} from "../accounts/account-service";
import {
    UtilityService
} from "../utility-service";
import {
    SideBarService
} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();


Template.paymentoverview.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.awaitingcustpaymentCount = new ReactiveVar();
    templateObject.awaitingsupppaymentCount = new ReactiveVar();

    templateObject.overduecustpaymentCount = new ReactiveVar();
    templateObject.overduesupppaymentCount = new ReactiveVar();


    setTimeout(function() {

        var x = window.matchMedia("(max-width: 1024px)")

        function mediaQuery(x) {
            if (x.matches) {

                $("#colAwaitingPayment").removeClass("col");
                $("#colAwaitingPayment").addClass("col-12");
                $("#colAwaitingPaymentNum").removeClass("col");
                $("#colAwaitingPaymentNum").addClass("col-10");
                $("#colAwaitingPaymentIcon").removeClass("col-auto");
                $("#colAwaitingPaymentIcon").addClass("col-2");

                $("#colOverdue").removeClass("col");
                $("#colOverdue").addClass("col-12");
                $("#colOverdueNum").removeClass("col");
                $("#colOverdueNum").addClass("col-10");
                $("#colOverdueIcon").removeClass("col-auto");
                $("#colOverdueIcon").addClass("col-2");

                $("#colAwaitingPaymentSupp").removeClass("col");
                $("#colAwaitingPaymentSupp").addClass("col-12");
                $("#colAwaitingPaymentSuppNum").removeClass("col");
                $("#colAwaitingPaymentSuppNum").addClass("col-10");
                $("#colAwaitingPaymentSuppIcon").removeClass("col-auto");
                $("#colAwaitingPaymentSuppIcon").addClass("col-2");

                $("#colOverdueSupp").removeClass("col");
                $("#colOverdueSupp").addClass("col-12");
                $("#colOverdueSuppNum").removeClass("col");
                $("#colOverdueSuppNum").addClass("col-10");
                $("#colOverdueSuppIcon").removeClass("col-auto");
                $("#colOverdueSuppIcon").addClass("col-2");

            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 10);

    setTimeout(function() {

        var x = window.matchMedia("(max-width: 420px)")

        function mediaQuery(x) {
            if (x.matches) {

                $("#paymentCard1").removeClass("col-auto");
                $("#paymentCard2").removeClass("col-auto");
                $("#paymentCard3").removeClass("col-auto");
                $("#paymentCard4").removeClass("col-auto");
                $("#paymentCard1").addClass("col-12");
                $("#paymentCard2").addClass("col-12");
                $("#paymentCard3").addClass("col-12");
                $("#paymentCard4").addClass("col-12");
            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 10);

});

Template.paymentoverview.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let paymentService = new PaymentsService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];
    if (FlowRouter.current().queryParams.success) {
        $('.btnRefresh').addClass('btnRefreshAlertOverview');
    }

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


    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth2 = currentBeginDate.getMonth();
    let fromDateDay2 = currentBeginDate.getDate();
    if ((currentBeginDate.getMonth() + 1) < 10) {
        fromDateMonth2 = "0" + (currentBeginDate.getMonth() + 1);
    } else {
        fromDateMonth2 = (currentBeginDate.getMonth() + 1);
    }

    if (currentBeginDate.getDate() < 10) {
        fromDateDay2 = "0" + currentBeginDate.getDate();
    }
    var toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth2) + "-" + (fromDateDay2);
    let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");

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

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentOverview', function(error, result) {
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
                    // let columnindex = customcolumn[i].index + 1;
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
        $('td.colStatus').each(function() {
            if ($(this).text() == "Deleted") $(this).addClass('text-deleted');
            if ($(this).text() == "Reconciled") $(this).addClass('text-reconciled');
            if ($(this).text() == "Paid") $(this).addClass('text-fullyPaid');
            if ($(this).text() == "Partial Paid") $(this).addClass('text-partialPaid');
        });
    };
    if ((!localStorage.getItem('VS1OutstandingInvoiceAmt_dash')) && (!localStorage.getItem('VS1OutstandingInvoiceQty_dash'))) {
        getVS1Data('TSalesList').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getSalesListData(prevMonth11Date, toDate, false, initialReportLoad, 0).then(function(data) {
                    let itemsAwaitingPaymentcount = [];
                    let itemsOverduePaymentcount = [];
                    let dataListAwaitingCust = {};
                    let totAmount = 0;
                    let totAmountOverDue = 0;
                    let customerawaitingpaymentCount = '';
                    for (let i = 0; i < data.tsaleslist.length; i++) {
                        if (data.tsaleslist[i].Type == "Invoice") {
                            dataListAwaitingCust = {
                                id: data.tsaleslist[i].SaleId || '',
                            };
                            if (data.tsaleslist[i].Balance != 0) {
                                itemsAwaitingPaymentcount.push(dataListAwaitingCust);
                                totAmount += Number(data.tsaleslist[i].Balance);
                                let date = new Date(data.tsaleslist[i].dueDate);
                                if (date < new Date()) {
                                    itemsOverduePaymentcount.push(dataListAwaitingCust);
                                    totAmountOverDue += Number(data.tsaleslist[i].Balance);
                                }
                            }
                        }
                    }
                    $('#custAwaiting').text(itemsAwaitingPaymentcount.length);
                    $('#custOverdue').text(itemsOverduePaymentcount.length);
                    $('.custAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(totAmount));
                    $('.custOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(totAmountOverDue));
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tsaleslist;
                let itemsAwaitingPaymentcount = [];
                let itemsOverduePaymentcount = [];
                let dataListAwaitingCust = {};
                let totAmount = 0;
                let totAmountOverDue = 0;
                let customerawaitingpaymentCount = '';
                for (let i = 0; i < data.tsaleslist.length; i++) {
                    if (data.tsaleslist[i].Type == "Invoice") {
                        dataListAwaitingCust = {
                            id: data.tsaleslist[i].SaleId || '',
                        };
                        if (data.tsaleslist[i].Balance != 0) {
                            itemsAwaitingPaymentcount.push(dataListAwaitingCust);

                            totAmount += Number(data.tsaleslist[i].Balance);
                            let date = new Date(data.tsaleslist[i].dueDate);
                            if (date < new Date()) {
                                itemsOverduePaymentcount.push(dataListAwaitingCust);
                                totAmountOverDue += Number(data.tsaleslist[i].Balance);

                            }
                        }
                    }
                }
                $('#custAwaiting').text(itemsAwaitingPaymentcount.length);
                $('#custOverdue').text(itemsOverduePaymentcount.length);
                $('.custAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(totAmount));
                $('.custOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(totAmountOverDue));
            }
        }).catch(function(err) {
            sideBarService.getSalesListData(prevMonth11Date, toDate, false, initialReportLoad, 0).then(function(data) {
                let itemsAwaitingPaymentcount = [];
                let itemsOverduePaymentcount = [];
                let dataListAwaitingCust = {};
                let totAmount = 0;
                let totAmountOverDue = 0;
                let customerawaitingpaymentCount = '';
                for (let i = 0; i < data.tsaleslist.length; i++) {
                    if (data.tsaleslist[i].Type == "Invoice") {
                        dataListAwaitingCust = {
                            id: data.tsaleslist[i].SaleId || '',
                        };
                        if (data.tsaleslist[i].Balance != 0) {
                            itemsAwaitingPaymentcount.push(dataListAwaitingCust);
                            totAmount += Number(data.tsaleslist[i].Balance);
                            let date = new Date(data.tsaleslist[i].dueDate);
                            if (date < new Date()) {
                                itemsOverduePaymentcount.push(dataListAwaitingCust);
                                totAmountOverDue += Number(data.tsaleslist[i].Balance);
                            }
                        }
                    }
                }
                $('#custAwaiting').text(itemsAwaitingPaymentcount.length);
                $('#custOverdue').text(itemsOverduePaymentcount.length);
                $('.custAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(totAmount));
                $('.custOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(totAmountOverDue));
            });
        });
    } else {
        let itemsOverduePaymentcount = localStorage.getItem('VS1OverDueInvoiceQty_dash') || 0;
        let totAmountOverDue = localStorage.getItem('VS1OverDueInvoiceAmt_dash') || 0;

        let itemsAwaitingPaymentcount = localStorage.getItem('VS1OutstandingInvoiceQty_dash') || 0;
        let totAmount = localStorage.getItem('VS1OutstandingInvoiceAmt_dash') || 0;


        $('#custAwaiting').text(itemsAwaitingPaymentcount);
        $('#custOverdue').text(itemsOverduePaymentcount);
        $('.custAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(totAmount));
        $('.custOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(totAmountOverDue));

    }

    if ((!localStorage.getItem('VS1OverDuePayablesAmt_dash')) && (!localStorage.getItem('VS1OverDuePayablesQty_dash'))) {
        getVS1Data('TAPReport').then(function(dataObject) {
            if (dataObject.length == 0) {
                paymentService.getOverviewAPDetails().then(function(data) {
                    let itemsSuppAwaitingPaymentcount = [];
                    let itemsSuppOverduePaymentcount = [];
                    let dataListAwaitingSupp = {};
                    let customerawaitingpaymentCount = '';
                    let supptotAmount = 0;
                    let supptotAmountOverDue = 0;
                    for (let i = 0; i < data.tapreport.length; i++) {
                        dataListAwaitingSupp = {
                            id: data.tapreport[i].ClientID || '',
                        };
                        if (data.tapreport[i].AmountDue != 0) {
                            // supptotAmount = data.tpurchaseorder[i].TotalBalance + data.tpurchaseorder[i].TotalBalance;
                            supptotAmount += Number(data.tapreport[i].AmountDue);
                            itemsSuppAwaitingPaymentcount.push(dataListAwaitingSupp);
                            let date = new Date(data.tapreport[i].DueDate);
                            if (date < new Date()) {
                                supptotAmountOverDue += Number(data.tapreport[i].AmountDue);
                                itemsSuppOverduePaymentcount.push(dataListAwaitingSupp);
                            }
                        }

                    }
                    $('#suppAwaiting').text(itemsSuppAwaitingPaymentcount.length);
                    $('#suppOverdue').text(itemsSuppOverduePaymentcount.length);

                    $('.suppAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmount));
                    $('.suppOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmountOverDue));
                    // templateObject.awaitingpaymentCount.set(itemsAwaitingPaymentcount.length);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tapreport;
                let itemsSuppAwaitingPaymentcount = [];
                let itemsSuppOverduePaymentcount = [];
                let dataListAwaitingSupp = {};
                let customerawaitingpaymentCount = '';
                let supptotAmount = 0;
                let supptotAmountOverDue = 0;
                for (let i = 0; i < useData.length; i++) {
                    dataListAwaitingSupp = {
                        id: useData[i].ClientID || '',
                    };
                    if (useData[i].AmountDue != 0) {
                        // supptotAmount = data.tpurchaseorder[i].TotalBalance + data.tpurchaseorder[i].TotalBalance;
                        supptotAmount += Number(useData[i].AmountDue);
                        itemsSuppAwaitingPaymentcount.push(dataListAwaitingSupp);
                        let date = new Date(useData[i].DueDate);
                        if (date < new Date()) {
                            supptotAmountOverDue += Number(useData[i].AmountDue);
                            itemsSuppOverduePaymentcount.push(dataListAwaitingSupp);
                        }
                    }

                }
                $('#suppAwaiting').text(itemsSuppAwaitingPaymentcount.length);
                $('#suppOverdue').text(itemsSuppOverduePaymentcount.length);

                $('.suppAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmount));
                $('.suppOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmountOverDue));
            }
        }).catch(function(err) {
            paymentService.getOverviewAPDetails().then(function(data) {
                let itemsSuppAwaitingPaymentcount = [];
                let itemsSuppOverduePaymentcount = [];
                let dataListAwaitingSupp = {};
                let customerawaitingpaymentCount = '';
                let supptotAmount = 0;
                let supptotAmountOverDue = 0;
                for (let i = 0; i < data.tapreport.length; i++) {
                    dataListAwaitingSupp = {
                        id: data.tapreport[i].ClientID || '',
                    };
                    if (data.tapreport[i].AmountDue != 0) {
                        // supptotAmount = data.tpurchaseorder[i].TotalBalance + data.tpurchaseorder[i].TotalBalance;
                        supptotAmount += Number(data.tapreport[i].AmountDue);
                        itemsSuppAwaitingPaymentcount.push(dataListAwaitingSupp);
                        let date = new Date(data.tapreport[i].DueDate);
                        if (date < new Date()) {
                            supptotAmountOverDue += Number(data.tapreport[i].AmountDue);
                            itemsSuppOverduePaymentcount.push(dataListAwaitingSupp);
                        }
                    }

                }
                $('#suppAwaiting').text(itemsSuppAwaitingPaymentcount.length);
                $('#suppOverdue').text(itemsSuppOverduePaymentcount.length);

                $('.suppAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmount));
                $('.suppOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmountOverDue));
                // templateObject.awaitingpaymentCount.set(itemsAwaitingPaymentcount.length);
            });
        });

    } else {

        let itemsSuppOverduePaymentcount = localStorage.getItem('VS1OverDuePayablesQty_dash') || 0;
        let supptotAmountOverDue = localStorage.getItem('VS1OverDuePayablesAmt_dash') || 0;

        let itemsSuppAwaitingPaymentcount = localStorage.getItem('VS1OutstandingPayablesQty_dash') || 0;
        let supptotAmount = localStorage.getItem('VS1OutstandingPayablesAmt_dash') || 0;

        $('#suppAwaiting').text(itemsSuppAwaitingPaymentcount);
        $('#suppOverdue').text(itemsSuppOverduePaymentcount);

        $('.suppAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmount));
        $('.suppOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(supptotAmountOverDue));

    }


    templateObject.resetData = function(dataVal) {
        window.open('/paymentoverview?page=last', '_self');
    }

    // $('#tblPaymentOverview').DataTable();
    templateObject.getAllPaymentsData = function() {
        var currentBeginDate = new Date();
        var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if ((currentBeginDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
        } else {
            fromDateMonth = (currentBeginDate.getMonth() + 1);
        }

        if (currentBeginDate.getDate() < 10) {
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        var toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");

        getVS1Data('TPaymentList').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getTPaymentList(prevMonth11Date, toDate, false, initialReportLoad, 0).then(function(data) {
                    let lineItems = [];
                    let lineItemObj = {};

                    addVS1Data('TPaymentList', JSON.stringify(data));
                    if (data.Params.IgnoreDates == true) {
                        FlowRouter.go('/paymentoverview?ignoredate=true');
                        $('#dateFrom').attr('readonly', true);
                        $('#dateTo').attr('readonly', true);
                    } else {

                        $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
                        $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
                    }
                    for (let i = 0; i < data.tpaymentlist.length; i++) {
                        let amount = utilityService.modifynegativeCurrencyFormat(data.tpaymentlist[i].PaymentAmount) || 0.00;
                        let openningBalance = utilityService.modifynegativeCurrencyFormat(data.tpaymentlist[i].OpeningBalance) || 0.00;
                        let bankAccount = data.tpaymentlist[i].BankAccount;
                        if (bankAccount == "Accounts Receivable") {
                            bankAccount = "A/R";
                        } else if (bankAccount == "Accounts Payables") {
                            bankAccount = "A/P";
                        }
                        let paystatus = '';
                        if (data.tpaymentlist[i].Deleted == true) {
                            paystatus = "Deleted";
                        } else if (data.tpaymentlist[i].ClientName == '') {
                            paystatus = "Deleted";
                        } else if (data.tpaymentlist[i].PaymentAmount == 0) {
                            paystatus = "Deleted";
                        };
                        var dataList = {
                            id: data.tpaymentlist[i].PaymentID || '',
                            sortdate: data.tpaymentlist[i].PaymentDate != '' ? moment(data.tpaymentlist[i].PaymentDate).format("YYYY/MM/DD") : data.tpaymentlist[i].PaymentDate,
                            paymentdate: data.tpaymentlist[i].PaymentDate != '' ? moment(data.tpaymentlist[i].PaymentDate).format("DD/MM/YYYY") : data.tpaymentlist[i].PaymentDate,
                            customername: data.tpaymentlist[i].ClientName || '',
                            paymentamount: amount || 0.00,
                            openingbalance: openningBalance || 0.00,
                            // balance: balance || 0.00,
                            bankaccount: bankAccount || '',
                            department: data.tpaymentlist[i].Department || '',
                            refno: data.tpaymentlist[i].ReferenceNo || '',
                            receiptno: data.tpaymentlist[i].ReceiptNo || '',
                            jobname: data.tpaymentlist[i].jobname || '',
                            paymentmethod: data.tpaymentlist[i].PaymentMethod || '',
                            type: data.tpaymentlist[i].TYPE || '',
                            paystatus: paystatus || "",
                            notes: data.tpaymentlist[i].Notes || ''
                        };
                        if (data.tpaymentlist[i].Deleted == false) {
                            dataTableList.push(dataList);
                        }

                    }


                    //awaitingpaymentCount
                    templateObject.datatablerecords.set(dataTableList);
                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentOverview', function(error, result) {
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


                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                    }

                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function() {
                        $('#tblPaymentOverview').DataTable({
                            "columnDefs": [{
                                "targets": 0,
                                "type": "date"
                            }],
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Payment List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible',
                                    format: {
                                        body: function(data, row, column) {
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
                                title: 'Payment Overview',
                                filename: "Payment List - " + moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            pageLength: initialReportDatatableLoad,
                            "bLengthChange": false,
                            searching: true,
                            lengthMenu: [
                                [initialReportDatatableLoad, -1],
                                [initialReportDatatableLoad, "All"]
                            ],
                            info: true,
                            responsive: true,
                            "order": [
                                [0, "desc"],
                                [2, "desc"]
                            ],
                            // "aaSorting": [[1,'desc']],
                            action: function() {
                                $('#tblPaymentOverview').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function(oSettings) {
                                let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;
                                //if(checkurlIgnoreDate == 'true'){

                                //}else{
                                $('.paginate_button.page-item').removeClass('disabled');
                                $('#tblPurchaseOverview_ellipsis').addClass('disabled');

                                if (oSettings._iDisplayLength == -1) {
                                    if (oSettings.fnRecordsDisplay() > 150) {
                                        $('.paginate_button.page-item.previous').addClass('disabled');
                                        $('.paginate_button.page-item.next').addClass('disabled');
                                    }
                                } else {}
                                if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                                    $('.paginate_button.page-item.next').addClass('disabled');
                                }
                                $('.paginate_button.next:not(.disabled)', this.api().table().container())
                                    .on('click', function() {
                                        $('.fullScreenSpin').css('display', 'inline-block');
                                        let dataLenght = oSettings._iDisplayLength;

                                        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                                        var dateTo = new Date($("#dateTo").datepicker("getDate"));

                                        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                                        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                                        if (checkurlIgnoreDate == 'true') {
                                            sideBarService.getTPaymentList(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                                getVS1Data('TPaymentList').then(function(dataObjectold) {
                                                    if (dataObjectold.length == 0) {} else {
                                                        let dataOld = JSON.parse(dataObjectold[0].data);
                                                        var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                                                        let objCombineData = {
                                                            Params: dataOld.Params,
                                                            tpaymentlist: thirdaryData
                                                        }

                                                        addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                            templateObject.resetData(objCombineData);
                                                            $('.fullScreenSpin').css('display', 'none');
                                                        }).catch(function(err) {
                                                            $('.fullScreenSpin').css('display', 'none');
                                                        });

                                                    }
                                                }).catch(function(err) {});

                                            }).catch(function(err) {
                                                $('.fullScreenSpin').css('display', 'none');
                                            });
                                        } else {
                                            sideBarService.getTPaymentList(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                                getVS1Data('TPaymentList').then(function(dataObjectold) {
                                                    if (dataObjectold.length == 0) {} else {
                                                        let dataOld = JSON.parse(dataObjectold[0].data);
                                                        var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                                                        let objCombineData = {
                                                            Params: dataOld.Params,
                                                            tpaymentlist: thirdaryData
                                                        }

                                                        addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                            templateObject.resetData(objCombineData);
                                                            $('.fullScreenSpin').css('display', 'none');
                                                        }).catch(function(err) {
                                                            $('.fullScreenSpin').css('display', 'none');
                                                        });

                                                    }
                                                }).catch(function(err) {});

                                            }).catch(function(err) {
                                                $('.fullScreenSpin').css('display', 'none');
                                            });

                                        }

                                    });

                                //}
                                setTimeout(function() {
                                    MakeNegative();
                                }, 100);
                            },
                            "fnInitComplete": function() {
                                let urlParametersPage = FlowRouter.current().queryParams.page;
                                if (urlParametersPage || FlowRouter.current().queryParams.ignoredate) {
                                    this.fnPageChange('last');
                                }
                                $("<button class='btn btn-primary btnRefreshPaymentOverview' type='button' id='btnRefreshPaymentOverview' style='padding: 4px 10px; font-size: 16px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblPaymentOverview_filter");

                                $('.myvarFilterForm').appendTo(".colDateFilter");
                            },
                            "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                                let countTableData = data.Params.Count || 0; //get count from API data

                                return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                            }

                        }).on('page', function() {
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.datatablerecords.get();
                            templateObject.datatablerecords.set(draftRecord);

                        }).on('column-reorder', function() {

                        });
                        $('.fullScreenSpin').css('display', 'none');

                    }, 0);

                    var columns = $('#tblPaymentOverview th');
                    let sTible = "";
                    let sWidth = "";
                    let sIndex = "";
                    let sVisible = "";
                    let columVisible = false;
                    let sClass = "";
                    $.each(columns, function(i, v) {
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
                    $('#tblPaymentOverview tbody').on('click', 'tr', function() {
                        var listData = $(this).closest('tr').attr('id');
                        var transactiontype = $(event.target).closest("tr").find(".colType").text();
                        var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
                        if ((listData) && (transactiontype)) {
                            if (checkDeleted == "Deleted") {
                                swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
                            } else {
                                if (transactiontype === 'Customer Payment') {
                                    FlowRouter.go('/paymentcard?id=' + listData);
                                } else if (transactiontype === 'Supplier Payment') {
                                    FlowRouter.go('/supplierpaymentcard?id=' + listData);
                                } else {
                                    FlowRouter.go('/paymentcard?id=' + listData);
                                }
                            }
                        }
                    });

                }).catch(function(err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                console.log(data);
                let useData = data.tpaymentlist;
                if (data.Params.IgnoreDates == true) {
                    FlowRouter.go('/paymentoverview?ignoredate=true');
                    $('#dateFrom').attr('readonly', true);
                    $('#dateTo').attr('readonly', true);
                } else {

                    $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
                    $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
                }
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < useData.length; i++) {
                    let amount = utilityService.modifynegativeCurrencyFormat(useData[i].PaymentAmount) || 0.00;
                    let openningBalance = utilityService.modifynegativeCurrencyFormat(useData[i].OpeningBalance) || 0.00;
                    let bankAccount = useData[i].BankAccount;
                    if (bankAccount == "Accounts Receivable") {
                        bankAccount = "A/R";
                    } else if (bankAccount == "Accounts Payables") {
                        bankAccount = "A/P";
                    }
                    let paystatus = '';
                    if (useData[i].Deleted == true) {
                        paystatus = "Deleted";
                    } else if (useData[i].ClientName == '') {
                        paystatus = "Deleted";
                    } else if (useData[i].PaymentAmount == 0) {
                        paystatus = "Deleted";
                    };
                    var dataList = {
                        id: useData[i].PaymentID || '',
                        sortdate: useData[i].PaymentDate != '' ? moment(useData[i].PaymentDate).format("YYYY/MM/DD") : useData[i].PaymentDate,
                        paymentdate: useData[i].PaymentDate != '' ? moment(useData[i].PaymentDate).format("DD/MM/YYYY") : useData[i].PaymentDate,
                        customername: useData[i].ClientName || '',
                        paymentamount: amount || 0.00,
                        openingbalance: openningBalance || 0.00,
                        // balance: balance || 0.00,
                        bankaccount: bankAccount || '',
                        department: useData[i].Department || '',
                        refno: useData[i].ReferenceNo || '',
                        receiptno: useData[i].ReceiptNo || '',
                        jobname: useData[i].jobname || '',
                        paymentmethod: useData[i].PaymentMethod || '',
                        type: useData[i].TYPE || '',
                        paystatus: paystatus || "",
                        notes: useData[i].Notes || ''
                    };
                    //if(useData[i].Deleted == false){
                    dataTableList.push(dataList);
                    //}

                }


                //awaitingpaymentCount
                templateObject.datatablerecords.set(dataTableList);
                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentOverview', function(error, result) {
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


                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function() {
                    $('#tblPaymentOverview').DataTable({
                        "columnDefs": [{
                            "targets": 0,
                            "type": "date"
                        }],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "Payment List - " + moment().format(),
                            orientation: 'portrait',
                            exportOptions: {
                                columns: ':visible',
                                format: {
                                    body: function(data, row, column) {
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
                            title: 'Payment Overview',
                            filename: "Payment List - " + moment().format(),
                            exportOptions: {
                                columns: ':visible',
                                stripHtml: false
                            }
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialReportDatatableLoad,
                        "bLengthChange": false,
                        searching: true,
                        lengthMenu: [
                            [initialReportDatatableLoad, -1],
                            [initialReportDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "desc"],
                            [2, "desc"]
                        ],
                        // "aaSorting": [[1,'desc']],
                        action: function() {
                            $('#tblPaymentOverview').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function(oSettings) {
                            let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;
                            //if(checkurlIgnoreDate == 'true'){

                            //}else{
                            $('.paginate_button.page-item').removeClass('disabled');
                            $('#tblPurchaseOverview_ellipsis').addClass('disabled');

                            if (oSettings._iDisplayLength == -1) {
                                if (oSettings.fnRecordsDisplay() > 150) {
                                    $('.paginate_button.page-item.previous').addClass('disabled');
                                    $('.paginate_button.page-item.next').addClass('disabled');
                                }
                            } else {}
                            if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                                $('.paginate_button.page-item.next').addClass('disabled');
                            }
                            $('.paginate_button.next:not(.disabled)', this.api().table().container())
                                .on('click', function() {
                                    $('.fullScreenSpin').css('display', 'inline-block');
                                    let dataLenght = oSettings._iDisplayLength;

                                    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                                    var dateTo = new Date($("#dateTo").datepicker("getDate"));

                                    let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                                    let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                                    if (checkurlIgnoreDate == 'true') {
                                        sideBarService.getTPaymentList(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                            getVS1Data('TPaymentList').then(function(dataObjectold) {
                                                if (dataObjectold.length == 0) {} else {
                                                    let dataOld = JSON.parse(dataObjectold[0].data);
                                                    var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                                                    let objCombineData = {
                                                        Params: dataOld.Params,
                                                        tpaymentlist: thirdaryData
                                                    }

                                                    addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                        templateObject.resetData(objCombineData);
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    }).catch(function(err) {
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    });

                                                }
                                            }).catch(function(err) {});

                                        }).catch(function(err) {
                                            $('.fullScreenSpin').css('display', 'none');
                                        });
                                    } else {
                                        sideBarService.getTPaymentList(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                            getVS1Data('TPaymentList').then(function(dataObjectold) {
                                                if (dataObjectold.length == 0) {} else {
                                                    let dataOld = JSON.parse(dataObjectold[0].data);
                                                    var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                                                    let objCombineData = {
                                                        Params: dataOld.Params,
                                                        tpaymentlist: thirdaryData
                                                    }

                                                    addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                        templateObject.resetData(objCombineData);
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    }).catch(function(err) {
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    });

                                                }
                                            }).catch(function(err) {});

                                        }).catch(function(err) {
                                            $('.fullScreenSpin').css('display', 'none');
                                        });

                                    }

                                });

                            //}
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function() {
                            let urlParametersPage = FlowRouter.current().queryParams.page;
                            if (urlParametersPage || FlowRouter.current().queryParams.ignoredate) {
                                this.fnPageChange('last');
                            }
                            $("<button class='btn btn-primary btnRefreshPaymentOverview' type='button' id='btnRefreshPaymentOverview' style='padding: 4px 10px; font-size: 16px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblPaymentOverview_filter");

                            $('.myvarFilterForm').appendTo(".colDateFilter");
                        },
                        "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                            let countTableData = data.Params.Count || 0; //get count from API data

                            return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                        }

                    }).on('page', function() {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);

                    }).on('column-reorder', function() {

                    });
                    $('.fullScreenSpin').css('display', 'none');

                }, 0);

                var columns = $('#tblPaymentOverview th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
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
                $('#tblPaymentOverview tbody').on('click', 'tr', function() {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".colType").text();
                    var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
                    if ((listData) && (transactiontype)) {
                        if (checkDeleted == "Deleted") {
                            swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
                        } else {
                            if (transactiontype === 'Customer Payment') {
                                FlowRouter.go('/paymentcard?id=' + listData);
                            } else if (transactiontype === 'Supplier Payment') {
                                FlowRouter.go('/supplierpaymentcard?id=' + listData);
                            } else {
                                FlowRouter.go('/paymentcard?id=' + listData);
                            }
                        }
                    }
                });
            }
        }).catch(function(err) {
            sideBarService.getTPaymentList(prevMonth11Date, toDate, false, initialReportLoad, 0).then(function(data) {
                let lineItems = [];
                let lineItemObj = {};

                addVS1Data('TPaymentList', JSON.stringify(data));
                if (data.Params.IgnoreDates == true) {
                    FlowRouter.go('/paymentoverview?ignoredate=true');
                    $('#dateFrom').attr('readonly', true);
                    $('#dateTo').attr('readonly', true);
                } else {

                    $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
                    $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
                }
                for (let i = 0; i < data.tpaymentlist.length; i++) {
                    let amount = utilityService.modifynegativeCurrencyFormat(data.tpaymentlist[i].PaymentAmount) || 0.00;
                    let openningBalance = utilityService.modifynegativeCurrencyFormat(data.tpaymentlist[i].OpeningBalance) || 0.00;
                    let bankAccount = data.tpaymentlist[i].BankAccount;
                    if (bankAccount == "Accounts Receivable") {
                        bankAccount = "A/R";
                    } else if (bankAccount == "Accounts Payables") {
                        bankAccount = "A/P";
                    }
                    let paystatus = '';
                    if (data.tpaymentlist[i].Deleted == true) {
                        paystatus = "Deleted";
                    } else if (data.tpaymentlist[i].ClientName == '') {
                        paystatus = "Deleted";
                    } else if (data.tpaymentlist[i].PaymentAmount == 0) {
                        paystatus = "Deleted";
                    };
                    // Currency+''+data.tpaymentlist[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    // let balance = utilityService.modifynegativeCurrencyFormat(data.tpaymentlist[i].Balance)|| 0.00;
                    // let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tpaymentlist[i].TotalPaid)|| 0.00;
                    // let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tpaymentlist[i].TotalBalance)|| 0.00;
                    var dataList = {
                        id: data.tpaymentlist[i].PaymentID || '',
                        sortdate: data.tpaymentlist[i].PaymentDate != '' ? moment(data.tpaymentlist[i].PaymentDate).format("YYYY/MM/DD") : data.tpaymentlist[i].PaymentDate,
                        paymentdate: data.tpaymentlist[i].PaymentDate != '' ? moment(data.tpaymentlist[i].PaymentDate).format("DD/MM/YYYY") : data.tpaymentlist[i].PaymentDate,
                        customername: data.tpaymentlist[i].ClientName || '',
                        paymentamount: amount || 0.00,
                        openingbalance: openningBalance || 0.00,
                        // balance: balance || 0.00,
                        bankaccount: bankAccount || '',
                        department: data.tpaymentlist[i].Department || '',
                        refno: data.tpaymentlist[i].ReferenceNo || '',
                        receiptno: data.tpaymentlist[i].ReceiptNo || '',
                        jobname: data.tpaymentlist[i].jobname || '',
                        paymentmethod: data.tpaymentlist[i].PaymentMethod || '',
                        type: data.tpaymentlist[i].TYPE || '',
                        paystatus: paystatus || "",
                        notes: data.tpaymentlist[i].Notes || ''
                    };
                    if (data.tpaymentlist[i].Deleted == false) {
                        dataTableList.push(dataList);
                    }

                }


                //awaitingpaymentCount
                templateObject.datatablerecords.set(dataTableList);
                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentOverview', function(error, result) {
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


                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function() {
                    $('#tblPaymentOverview').DataTable({
                        "columnDefs": [{
                            "targets": 0,
                            "type": "date"
                        }],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "Payment List - " + moment().format(),
                            orientation: 'portrait',
                            exportOptions: {
                                columns: ':visible',
                                format: {
                                    body: function(data, row, column) {
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
                            title: 'Payment Overview',
                            filename: "Payment List - " + moment().format(),
                            exportOptions: {
                                columns: ':visible',
                                stripHtml: false
                            }
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialReportDatatableLoad,
                        "bLengthChange": false,
                        searching: true,
                        lengthMenu: [
                            [initialReportDatatableLoad, -1],
                            [initialReportDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "desc"],
                            [2, "desc"]
                        ],
                        // "aaSorting": [[1,'desc']],
                        action: function() {
                            $('#tblPaymentOverview').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function(oSettings) {
                            let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;
                            //if(checkurlIgnoreDate == 'true'){

                            //}else{
                            $('.paginate_button.page-item').removeClass('disabled');
                            $('#tblPurchaseOverview_ellipsis').addClass('disabled');

                            if (oSettings._iDisplayLength == -1) {
                                if (oSettings.fnRecordsDisplay() > 150) {
                                    $('.paginate_button.page-item.previous').addClass('disabled');
                                    $('.paginate_button.page-item.next').addClass('disabled');
                                }
                            } else {}
                            if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                                $('.paginate_button.page-item.next').addClass('disabled');
                            }
                            $('.paginate_button.next:not(.disabled)', this.api().table().container())
                                .on('click', function() {
                                    $('.fullScreenSpin').css('display', 'inline-block');
                                    let dataLenght = oSettings._iDisplayLength;

                                    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                                    var dateTo = new Date($("#dateTo").datepicker("getDate"));

                                    let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                                    let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                                    if (checkurlIgnoreDate == 'true') {
                                        sideBarService.getTPaymentList(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                            getVS1Data('TPaymentList').then(function(dataObjectold) {
                                                if (dataObjectold.length == 0) {} else {
                                                    let dataOld = JSON.parse(dataObjectold[0].data);
                                                    var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                                                    let objCombineData = {
                                                        Params: dataOld.Params,
                                                        tpaymentlist: thirdaryData
                                                    }

                                                    addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                        templateObject.resetData(objCombineData);
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    }).catch(function(err) {
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    });

                                                }
                                            }).catch(function(err) {});

                                        }).catch(function(err) {
                                            $('.fullScreenSpin').css('display', 'none');
                                        });
                                    } else {
                                        sideBarService.getTPaymentList(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                            getVS1Data('TPaymentList').then(function(dataObjectold) {
                                                if (dataObjectold.length == 0) {} else {
                                                    let dataOld = JSON.parse(dataObjectold[0].data);
                                                    var thirdaryData = $.merge($.merge([], dataObjectnew.tpaymentlist), dataOld.tpaymentlist);
                                                    let objCombineData = {
                                                        Params: dataOld.Params,
                                                        tpaymentlist: thirdaryData
                                                    }

                                                    addVS1Data('TPaymentList', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                        templateObject.resetData(objCombineData);
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    }).catch(function(err) {
                                                        $('.fullScreenSpin').css('display', 'none');
                                                    });

                                                }
                                            }).catch(function(err) {});

                                        }).catch(function(err) {
                                            $('.fullScreenSpin').css('display', 'none');
                                        });

                                    }

                                });

                            //}
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function() {
                            let urlParametersPage = FlowRouter.current().queryParams.page;
                            if (urlParametersPage || FlowRouter.current().queryParams.ignoredate) {
                                this.fnPageChange('last');
                            }
                            $("<button class='btn btn-primary btnRefreshPaymentOverview' type='button' id='btnRefreshPaymentOverview' style='padding: 4px 10px; font-size: 16px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblPaymentOverview_filter");

                            $('.myvarFilterForm').appendTo(".colDateFilter");
                        },
                        "fnInfoCallback": function(oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                            let countTableData = data.Params.Count || 0; //get count from API data

                            return 'Showing ' + iStart + " to " + iEnd + " of " + countTableData;
                        }

                    }).on('page', function() {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);

                    }).on('column-reorder', function() {

                    });
                    $('.fullScreenSpin').css('display', 'none');

                }, 0);

                var columns = $('#tblPaymentOverview th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
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
                $('#tblPaymentOverview tbody').on('click', 'tr', function() {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".colType").text();
                    var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
                    if ((listData) && (transactiontype)) {
                        if (checkDeleted == "Deleted") {
                            swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
                        } else {
                            if (transactiontype === 'Customer Payment') {
                                FlowRouter.go('/paymentcard?id=' + listData);
                            } else if (transactiontype === 'Supplier Payment') {
                                FlowRouter.go('/supplierpaymentcard?id=' + listData);
                            } else {
                                FlowRouter.go('/paymentcard?id=' + listData);
                            }
                        }
                    }
                });

            }).catch(function(err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });

    }

    templateObject.getAllPaymentsData();


    setTimeout(function() {

        var x = window.matchMedia("(max-width: 1024px)")

        function mediaQuery(x) {
            if (x.matches) {
                $("#paymentCard1").removeClass("col-auto");
                $("#paymentCard2").removeClass("col-auto");
                $("#paymentCard3").removeClass("col-auto");
                $("#paymentCard4").removeClass("col-auto");
                $("#paymentCard1").addClass("col-6");
                $("#paymentCard2").addClass("col-6");
                $("#paymentCard3").addClass("col-6");
                $("#paymentCard4").addClass("col-6");

            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 500);

    templateObject.getAllFilterPaymentsData = function(fromDate, toDate, ignoreDate) {
        sideBarService.getTPaymentList(fromDate, toDate, ignoreDate, initialReportLoad, 0).then(function(data) {
            addVS1Data('TPaymentList', JSON.stringify(data)).then(function(datareturn) {
                window.open('/paymentoverview?toDate=' + toDate + '&fromDate=' + fromDate + '&ignoredate=' + ignoreDate, '_self');
            }).catch(function(err) {
                location.reload();
            });
        }).catch(function(err) {
            $('.fullScreenSpin').css('display', 'none');
            // Meteor._reload.reload();
        });
    }

    let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
    let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
    let urlParametersIgnoreDate = FlowRouter.current().queryParams.ignoredate;
    if (urlParametersDateFrom) {
        if (urlParametersIgnoreDate == true) {
            $('#dateFrom').attr('readonly', true);
            $('#dateTo').attr('readonly', true);
        } else {

            $("#dateFrom").val(urlParametersDateFrom != '' ? moment(urlParametersDateFrom).format("DD/MM/YYYY") : urlParametersDateFrom);
            $("#dateTo").val(urlParametersDateTo != '' ? moment(urlParametersDateTo).format("DD/MM/YYYY") : urlParametersDateTo);
        }
    }
});

Template.paymentoverview.events({
    'click #newSalesOrder': function(event) {
        FlowRouter.go('/salesordercard');
    },
    'click .feeOnTopInput': function(event) {
        if ($(event.target).is(':checked')) {
            $('.feeInPriceInput').attr('checked', false);
        }
    },
    'click .feeInPriceInput': function(event) {
        if ($(event.target).is(':checked')) {
            $('.feeOnTopInput').attr('checked', false);
        }
    },
    'click .btnCustomerlist': function(event) {
        FlowRouter.go('/customerpayment');
    },
    'click #newInvoice': function(event) {
        FlowRouter.go('/invoicecard');
    },
    'click .btnSupplierPaymentList': function(event) {
        FlowRouter.go('/supplierpayment');
    },
    'click #newQuote': function(event) {
        FlowRouter.go('/quotecard');
    },
    'click .QuoteList': function(event) {
        FlowRouter.go('/quoteslist');
    },
    'click .btnPaymentSettings': function(event) {
        $('.modal-backdrop').css('display', 'none');
        FlowRouter.go('/paymentmethodSettings');
    },
    'click .btnTaxRateSettings': function(event) {
        $('.modal-backdrop').css('display', 'none');
        FlowRouter.go('/taxratesettings');
    },
    'click .btnTermsSettings': function(event) {
        $('.modal-backdrop').css('display', 'none');
        FlowRouter.go('/termsettings');
    },
    'click .btnCurrencySettings': function(event) {
        $('.modal-backdrop').css('display', 'none');
        FlowRouter.go('/currenciesSettings');
    },

    'click .customerAwaitingPayment': function(event) {
        $('.modal-backdrop').css('display', 'none');
        FlowRouter.go('/customerawaitingpayments');
    },
    'click .customerOverdue, click .custOverdueAmt': function(event) {
        $('.modal-backdrop').css('display', 'none');
        FlowRouter.go('/customerawaitingpayments?overdue=true');
    },
    'click .supplierAwaitingPayment': function(event) {
        $('.modal-backdrop').css('display', 'none');
        FlowRouter.go('/supplierawaitingpurchaseorder');
    },
    'click .supplierOverdue': function(event) {
        $('.modal-backdrop').css('display', 'none');
        FlowRouter.go('/supplierawaitingpurchaseorder?overdue=true');
    },

    'click .chkDatatable': function(event) {
        var columns = $('#tblPaymentOverview th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function(i, v) {
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
    'click .resetTable': function(event) {
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
                    PrefName: 'tblPaymentOverview'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable': function(event) {
        let lineItems = [];
        //let datatable =$('#tblPaymentOverview').DataTable();
        $('.columnSettings').each(function(index) {
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
        //datatable.state.save();

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
                    PrefName: 'tblPaymentOverview'
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
                            PrefName: 'tblPaymentOverview',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function(err, idTag) {
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
                        PrefName: 'tblPaymentOverview',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');

                        }
                    });

                }
            }
        }

        //Meteor._reload.reload();
    },
    'blur .divcolumn': function(event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

        var datable = $('#tblPaymentOverview').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function(event) {
        let range = $(event.target).val();
        // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblPaymentOverview th');
        $.each(datable, function(i, v) {

            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettings': function(event) {
        let templateObject = Template.instance();
        var columns = $('#tblPaymentOverview th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i, v) {
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
    'click #exportbtn': function() {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblPaymentOverview_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();

        sideBarService.getAllInvoiceList(initialDataLoad, 0).then(function (data) {
            addVS1Data('TInvoiceEx', JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function (err) {

        });

        sideBarService.getTCustomerPaymentList(initialDataLoad,0).then(function(data) {
            addVS1Data('TCustomerPayment',JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function(err) {

        });

        sideBarService.getTSupplierPaymentList(initialDataLoad, 0).then(function(data) {
            addVS1Data('TSupplierPayment', JSON.stringify(data)).then(function(datareturn) {}).catch(function(err) {

            });
        }).catch(function(err) {

        });

        sideBarService.getAllBillExList(initialDataLoad,0).then(function(dataBill) {
            addVS1Data('TBillEx',JSON.stringify(dataBill)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function(err) {

        });

        sideBarService.getAllPurchaseOrderList(initialDataLoad, 0).then(function (data) {
            addVS1Data("TPurchaseOrderEx", JSON.stringify(data)).then(function (datareturn) {

              }).catch(function (err) {

              });
          }).catch(function (err) {

          });

        var currentBeginDate = new Date();
        var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if ((currentBeginDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
        } else {
            fromDateMonth = (currentBeginDate.getMonth() + 1);
        }

        if (currentBeginDate.getDate() < 10) {
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        var toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");

        sideBarService.getAllBillListData(prevMonth11Date,toDate, false,initialReportLoad,0).then(function(dataBill) {
            addVS1Data('TBillList',JSON.stringify(dataBill)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function(err) {

        });

        sideBarService.getAllTInvoiceListData(prevMonth11Date,toDate, false,initialReportLoad,0).then(function (dataInvoice) {
            addVS1Data('TInvoiceList', JSON.stringify(dataInvoice)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function (err) {

        });

        sideBarService.getAllTPurchaseOrderListData(prevMonth11Date,toDate,false,initialReportLoad,0).then(function (dataPO) {
            addVS1Data("TPurchaseOrderList", JSON.stringify(dataPO)).then(function (datareturn) {

              }).catch(function (err) {

              });
          }).catch(function (err) {

          });

          sideBarService.getAllAwaitingSupplierPayment(prevMonth11Date,toDate, false,initialReportLoad,0).then(function (data) {
              addVS1Data('TAwaitingSupplierPayment', JSON.stringify(data)).then(function (datareturn) {

              }).catch(function (err) {

              });
          }).catch(function (err) {

          });
          sideBarService.getAllOverDueAwaitingSupplierPayment(toDate,initialReportLoad,0).then(function (dataOverDue) {
              addVS1Data('TOverdueAwaitingSupplierPayment', JSON.stringify(dataOverDue)).then(function (datareturn) {

              }).catch(function (err) {

              });
          }).catch(function (err) {

          });

        sideBarService.getTPaymentList(prevMonth11Date, toDate, false, initialReportLoad, 0).then(function(dataPaymentList) {
            addVS1Data('TPaymentList', JSON.stringify(dataPaymentList)).then(function(datareturn) {
                sideBarService.getAllTSupplierPaymentListData(prevMonth11Date, toDate, false, initialReportLoad, 0).then(function(dataSuppPay) {
                    addVS1Data('TSupplierPaymentList', JSON.stringify(dataSuppPay)).then(function(datareturn) {
                        sideBarService.getAllTCustomerPaymentListData(prevMonth11Date, toDate, false, initialReportLoad, 0).then(function(dataCustPay) {
                            addVS1Data('TCustomerPaymentList', JSON.stringify(dataCustPay)).then(function(datareturn) {
                              setTimeout(function () {
                                window.open('/paymentoverview', '_self');
                              }, 2000);
                            }).catch(function(err) {
                              setTimeout(function () {
                                window.open('/paymentoverview', '_self');
                              }, 2000);
                            });
                        }).catch(function(err) {
                          setTimeout(function () {
                            window.open('/paymentoverview', '_self');
                          }, 2000);
                        });
                    }).catch(function(err) {
                        sideBarService.getAllTCustomerPaymentListData(prevMonth11Date, toDate, false, initialReportLoad, 0).then(function(dataCustPay) {
                            addVS1Data('TCustomerPaymentList', JSON.stringify(dataCustPay)).then(function(datareturn) {
                              setTimeout(function () {
                                window.open('/paymentoverview', '_self');
                              }, 2000);
                            }).catch(function(err) {
                              setTimeout(function () {
                                window.open('/paymentoverview', '_self');
                              }, 2000);
                            });
                        }).catch(function(err) {
                          setTimeout(function () {
                            window.open('/paymentoverview', '_self');
                          }, 2000);
                        });
                    });
                }).catch(function(err) {
                  setTimeout(function () {
                    window.open('/paymentoverview', '_self');
                  }, 2000);
                });
            }).catch(function(err) {
              setTimeout(function () {
                window.open('/paymentoverview', '_self');
              }, 2000);
            });
        }).catch(function(err) {
          setTimeout(function () {
            window.open('/paymentoverview', '_self');
          }, 2000);

        });

    },
    'click .btnAll': function(event) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', true);
        $('#dateTo').attr('readonly', true);
        templateObject.getAllFilterPaymentsData('', '', true);
    },
    'change #dateTo': function() {
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
            templateObject.getAllFilterPaymentsData(formatDateFrom, formatDateTo, false);
        }

    },
    'change #dateFrom': function() {
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
            templateObject.getAllFilterPaymentsData(formatDateFrom, formatDateTo, false);
        }

    },
    'click #today': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentBeginDate = new Date();
        var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if ((currentBeginDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
        } else {
            fromDateMonth = (currentBeginDate.getMonth() + 1);
        }

        if (currentBeginDate.getDate() < 10) {
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        var toDateERPFrom = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        var toDateERPTo = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);

        var toDateDisplayFrom = (fromDateDay) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();
        var toDateDisplayTo = (fromDateDay) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();

        $("#dateFrom").val(toDateDisplayFrom);
        $("#dateTo").val(toDateDisplayTo);
        templateObject.getAllFilterPaymentsData(toDateERPFrom, toDateERPTo, false);
    },
    'click #lastweek': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentBeginDate = new Date();
        var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if ((currentBeginDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
        } else {
            fromDateMonth = (currentBeginDate.getMonth() + 1);
        }

        if (currentBeginDate.getDate() < 10) {
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        var toDateERPFrom = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay - 7);
        var toDateERPTo = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);

        var toDateDisplayFrom = (fromDateDay - 7) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();
        var toDateDisplayTo = (fromDateDay) + "/" + (fromDateMonth) + "/" + currentBeginDate.getFullYear();

        $("#dateFrom").val(toDateDisplayFrom);
        $("#dateTo").val(toDateDisplayTo);
        templateObject.getAllFilterPaymentsData(toDateERPFrom, toDateERPTo, false);
    },
    'click #lastMonth': function() {
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
            return formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
        };

        var formatDateERP = function(date) {
            return date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
        };


        var fromDate = formatDate(prevMonthFirstDate);
        var toDate = formatDate(prevMonthLastDate);

        $("#dateFrom").val(fromDate);
        $("#dateTo").val(toDate);

        var getLoadDate = formatDateERP(prevMonthLastDate);
        let getDateFrom = formatDateERP(prevMonthFirstDate);
        templateObject.getAllFilterPaymentsData(getDateFrom, getLoadDate, false);
    },
    'click #lastQuarter': function() {
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
        templateObject.getAllFilterPaymentsData(getDateFrom, getLoadDate, false);
    },
    'click #last12Months': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
        let fromDateDay = currentDate.getDate();
        if ((currentDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentDate.getMonth() + 1);
        }
        if (currentDate.getDate() < 10) {
            fromDateDay = "0" + currentDate.getDate();
        }

        var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() - 1);
        $("#dateFrom").val(fromDate);
        $("#dateTo").val(begunDate);

        var currentDate2 = new Date();
        if ((currentDate2.getMonth() + 1) < 10) {
            fromDateMonth2 = "0" + Math.floor(currentDate2.getMonth() + 1);
        }
        if (currentDate2.getDate() < 10) {
            fromDateDay2 = "0" + currentDate2.getDate();
        }
        var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
        let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + fromDateMonth2 + "-" + currentDate2.getDate();
        templateObject.getAllFilterPaymentsData(getDateFrom, getLoadDate, false);

    },
    'click #ignoreDate': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', true);
        $('#dateTo').attr('readonly', true);
        templateObject.getAllFilterPaymentsData('', '', true);
    },
    'click .printConfirm': function(event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblPaymentOverview_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .openaccountpayable': function() {
        FlowRouter.go('/supplierawaitingpurchaseorder');
    },
    'click .openaccountreceivable': function() {
        FlowRouter.go('/customerawaitingpayments');
    },
    'click .btnPrinStatment': function() {
        FlowRouter.go('/statementlist');
    }




});
Template.paymentoverview.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.sortdate == 'NA') {
                return 1;
            } else if (b.sortdate == 'NA') {
                return -1;
            }
            return (a.sortdate.toUpperCase() > b.sortdate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblPaymentOverview'
        });
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
