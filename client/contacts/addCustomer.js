import { ContactService } from "./contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { UtilityService } from "../utility-service";
import { CountryService } from '../js/country-service';
import { PaymentsService } from '../payments/payments-service';
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import { Random } from 'meteor/random';
import { jsPDF } from 'jspdf';
import 'jQuery.print/jQuery.print.js';
import { autoTable } from 'jspdf-autotable';
import 'jquery-editable-select';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.customerscard.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.countryData = new ReactiveVar();
    templateObject.customerrecords = new ReactiveVar([]);
    templateObject.recentTrasactions = new ReactiveVar([]);
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.datatablerecordsjob = new ReactiveVar([]);
    templateObject.tableheaderrecordsjob = new ReactiveVar([]);


    templateObject.preferedPaymentList = new ReactiveVar();
    templateObject.termsList = new ReactiveVar();
    templateObject.deliveryMethodList = new ReactiveVar();
    templateObject.clienttypeList = new ReactiveVar();
    templateObject.taxCodeList = new ReactiveVar();
    templateObject.taxraterecords = new ReactiveVar([]);
    templateObject.defaultsaletaxcode = new ReactiveVar();

    templateObject.defaultsaleterm = new ReactiveVar();

    templateObject.isJob = new ReactiveVar();
    templateObject.isJob.set(false);

    templateObject.isSameAddress = new ReactiveVar();
    templateObject.isSameAddress.set(false);

    templateObject.isJobSameAddress = new ReactiveVar();
    templateObject.isJobSameAddress.set(false);

    /* Attachments */
    templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();
    templateObject.currentAttachLineID = new ReactiveVar();

    templateObject.uploadedFileJob = new ReactiveVar();
    templateObject.uploadedFilesJob = new ReactiveVar([]);
    templateObject.attachmentCountJob = new ReactiveVar();

    templateObject.uploadedFileJobNoPOP = new ReactiveVar();
    templateObject.uploadedFilesJobNoPOP = new ReactiveVar([]);
    templateObject.attachmentCountJobNoPOP = new ReactiveVar();

    templateObject.currentAttachLineIDJob = new ReactiveVar();
});



Template.customerscard.onRendered(function () {

    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let contactService = new ContactService();
    var countryService = new CountryService();
    let paymentService = new PaymentsService();
    const records = [];
    let countries = [];

    let preferedPayments = [];
    let terms = [];
    let deliveryMethods = [];
    let clientType = [];
    let taxCodes = [];

    var splashArrayTaxRateList = new Array();
    const taxCodesList = [];

    let currentId = FlowRouter.current().queryParams;
    let customerID = '';
    let totAmount = 0;
    let totAmountOverDue = 0;

    const dataTableList = [];
    const dataTableListJob = [];
    const tableHeaderList = [];

    const tableHeaderListJob = [];

    let salestaxcode = '';

    setTimeout(function () {
        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'defaulttax', function (error, result) {
            if (error) {
                salestaxcode = loggedTaxCodeSalesInc;
                templateObject.defaultsaletaxcode.set(salestaxcode);
            } else {
                if (result) {
                    salestaxcode = result.customFields[1].taxvalue || loggedTaxCodeSalesInc;
                    templateObject.defaultsaletaxcode.set(salestaxcode);
                }

            }
        });
    }, 500);


    templateObject.getOverviewARData = function (CustomerName) {
        getVS1Data('TARReport').then(function (dataObject) {
            if (dataObject.length == 0) {
                paymentService.getOverviewARDetails().then(function (data) {
                    let itemsAwaitingPaymentcount = [];
                    let itemsOverduePaymentcount = [];
                    let dataListAwaitingCust = {};

                    let customerawaitingpaymentCount = '';
                    for (let i = 0; i < data.tarreport.length; i++) {
                        // dataListAwaitingCust = {
                        // id: data.tinvoice[i].Id || '',
                        // };
                        if ((data.tarreport[i].AmountDue != 0) && (CustomerName.replace(/\s/g, '') == data.tarreport[i].Printname.replace(/\s/g, ''))) {
                            // itemsAwaitingPaymentcount.push(dataListAwaitingCust);
                            totAmount += Number(data.tarreport[i].AmountDue);
                            let date = new Date(data.tarreport[i].DueDate);
                            if (date < new Date()) {
                                // itemsOverduePaymentcount.push(dataListAwaitingCust);
                                totAmountOverDue += Number(data.tarreport[i].AmountDue);
                            }
                        }

                    }

                    $('.custAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(totAmount));
                    $('.custOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(totAmountOverDue));
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tarreport;
                let itemsAwaitingPaymentcount = [];
                let itemsOverduePaymentcount = [];
                let dataListAwaitingCust = {};

                let customerawaitingpaymentCount = '';
                for (let i = 0; i < useData.length; i++) {
                    if ((useData[i].AmountDue != 0) && (CustomerName.replace(/\s/g, '') == useData[i].Printname.replace(/\s/g, ''))) {
                        totAmount += Number(useData[i].AmountDue);
                        let date = new Date(useData[i].DueDate);
                        if (date < new Date()) {
                            totAmountOverDue += Number(useData[i].AmountDue);
                        }
                    }

                }

                $('.custAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(totAmount));
                $('.custOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(totAmountOverDue));

            }
        }).catch(function (err) {
            paymentService.getOverviewARDetails().then(function (data) {
                let itemsAwaitingPaymentcount = [];
                let itemsOverduePaymentcount = [];
                let dataListAwaitingCust = {};

                let customerawaitingpaymentCount = '';
                for (let i = 0; i < data.tarreport.length; i++) {
                    if ((data.tarreport[i].AmountDue != 0) && (CustomerName.replace(/\s/g, '') == data.tarreport[i].Printname.replace(/\s/g, ''))) {
                        // itemsAwaitingPaymentcount.push(dataListAwaitingCust);
                        totAmount += Number(data.tarreport[i].AmountDue);
                        let date = new Date(data.tarreport[i].DueDate);
                        if (date < new Date()) {
                            // itemsOverduePaymentcount.push(dataListAwaitingCust);
                            totAmountOverDue += Number(data.tarreport[i].AmountDue);
                        }
                    }

                }

                $('.custAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(totAmount));
                $('.custOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(totAmountOverDue));
            });
        });


    };
    setTimeout(function () {

        $("#dtAsOf").datepicker({
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
    }, 100);
    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTransactionlist', function (error, result) {
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
        $('td').each(function () {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    templateObject.getAllJobsIds = function () {
        contactService.getJobIds().then(function (data) {
            let latestJobId;
            if (data.tjobvs1.length) {
                latestJobId = data.tjobvs1[data.tjobvs1.length - 1].Id;
            } else {
                latestJobId = 0;
            }
            let newJobId = (latestJobId + 1);
            $('#addNewJobModal #edtJobNumber').val(newJobId);
        }).catch(function (err) {
            $('#addNewJobModal #edtJobNumber').val('1');
        });
    };

    templateObject.getAllProductRecentTransactions = function (customerName) {
        getVS1Data('TTransactionListReport').then(function (dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getTTransactionListReport().then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    let transID = "";
                    addVS1Data('TTransactionListReport', JSON.stringify(data)).then(function (datareturn) {

                    }).catch(function (err) {

                    });
                    for (let i = 0; i < data.ttransactionlistreport.length; i++) {
                        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.ttransactionlistreport[i].DEBITSEX) || 0.00;
                        // let totalTax = utilityService.modifynegativeCurrencyFormat(data.ttransactionlistreport[i].TotalTax) || 0.00;
                        // Currency+''+data.ttransactionlistreport[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttransactionlistreport[i].DEBITSINC) || 0.00;
                        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.ttransactionlistreport[i].CREDITSEX) || 0.00;
                        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.ttransactionlistreport[i].EXDiff) || 0.00;
                        if (data.ttransactionlistreport[i].TYPE == "Bill") {
                            transID = data.ttransactionlistreport[i].PURCHASEORDERID;
                        } else if (data.ttransactionlistreport[i].TYPE == "Credit") {
                            transID = data.ttransactionlistreport[i].PURCHASEORDERID;
                        } else if (data.ttransactionlistreport[i].TYPE == "PO") {
                            transID = data.ttransactionlistreport[i].PURCHASEORDERID;
                        } else if (data.ttransactionlistreport[i].TYPE == "Supplier Payment") {
                            transID = data.ttransactionlistreport[i].PAYMENTID;
                        } else if (data.ttransactionlistreport[i].TYPE == "Cheque") {
                            transID = data.ttransactionlistreport[i].PURCHASEORDERID;
                        } else if (data.ttransactionlistreport[i].TYPE == "Journal Entry") {
                            transID = data.ttransactionlistreport[i].SALEID;
                        } else if (data.ttransactionlistreport[i].TYPE == "Customer Payment") {
                            transID = data.ttransactionlistreport[i].PAYMENTID;
                        } else if (data.ttransactionlistreport[i].TYPE == "Refund") {
                            transID = data.ttransactionlistreport[i].SALEID;
                        } else if (data.ttransactionlistreport[i].TYPE == "Invoice") {
                            transID = data.ttransactionlistreport[i].SALEID;
                        } else if (data.ttransactionlistreport[i].TYPE == "UnInvoiced SO") {
                            transID = data.ttransactionlistreport[i].SALEID;
                        } else if (data.ttransactionlistreport[i].TYPE == "Quote") {
                            transID = data.ttransactionlistreport[i].SALEID;
                        }
                        var dataList = {
                            id: transID || '',
                            transid: data.ttransactionlistreport[i].transID|| '',
                            employee: data.ttransactionlistreport[i].EmployeeName || '',
                            sortdate: data.ttransactionlistreport[i].DATE != '' ? moment(data.ttransactionlistreport[i].DATE).format("YYYY/MM/DD") : data.ttransactionlistreport[i].DATE,
                            saledate: data.ttransactionlistreport[i].DATE != '' ? moment(data.ttransactionlistreport[i].DATE).format("DD/MM/YYYY") : data.ttransactionlistreport[i].DATE,
                            customername: data.ttransactionlistreport[i].CLIENTNAME || '',
                            totalamountex: totalAmountEx || 0.00,
                            // totaltax: totalTax || 0.00,
                            totalamount: totalAmount || 0.00,
                            totalpaid: totalPaid || 0.00,
                            totaloustanding: totalOutstanding || 0.00,
                            type: data.ttransactionlistreport[i].TYPE || '',
                            custfield1: '',
                            custfield2: '',
                            comments: data.ttransactionlistreport[i].Memo || '',
                        };
                        if (data.ttransactionlistreport[i].CLIENTNAME === customerName) {
                            dataTableList.push(dataList);
                        }
                    }


                    templateObject.datatablerecords.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTransactionlist', function (error, result) {
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


                        setTimeout(function () {
                            MakeNegative();
                            $("#dtAsOf").datepicker({
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
                        }, 100);
                    }
                    // $('.custAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(totAmount));
                    // $('.custOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(totAmountOverDue));
                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function () {
                        //$.fn.dataTable.moment('DD/MM/YY');
                        $('#tblTransactionlist').DataTable({
                            // dom: 'lBfrtip',
                            columnDefs: [
                                { type: 'date', targets: 0 }
                            ],
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [
                                {
                                    extend: 'excelHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "Sales Transaction List - " + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Sales Transaction',
                                    filename: "Sales Transaction List - " + moment().format(),
                                    exportOptions: {
                                        columns: ':visible',
                                        stripHtml: false
                                    }
                                }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [[ 0, "desc" ],[ 2, "desc" ]],
                            action: function () {
                                $('#tblTransactionlist').DataTable().ajax.reload();
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
                            let draftRecord = templateObject.datatablerecords.get();
                            templateObject.datatablerecords.set(draftRecord);
                        }).on('column-reorder', function () {

                        });

                        $('.fullScreenSpin').css('display', 'none');
                    }, 0);

                    var columns = $('#tblTransactionlist th');
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
                    $('.tblTransactionlist tbody').on('click', 'tr', function () {
                        var listData = $(this).closest('tr').attr('id');
                        var transactiontype = $(event.target).closest("tr").find(".colType").text();
                        if ((listData) && (transactiontype)) {
                            if (transactiontype === 'Bill') {
                                FlowRouter.go('/billcard?id=' + listData);
                            } else if (transactiontype === 'Credit') {
                                FlowRouter.go('/creditcard?id=' + listData);
                            } else if (transactiontype === 'PO') {
                                FlowRouter.go('/purchaseordercard?id=' + listData);
                            } else if (transactiontype === 'Supplier Payment') {
                                FlowRouter.go('/supplierpaymentcard?id=' + listData);
                            } else if (transactiontype === 'Customer Payment') {
                                FlowRouter.go('/paymentcard?id=' + listData);
                            } else if (transactiontype === 'Cheque') {
                                FlowRouter.go('/chequecard?id=' + listData);
                            } else if (transactiontype === 'Journal Entry') {
                                FlowRouter.go('/journalentrycard?id=' + listData);
                            } else if (transactiontype === 'Refund') {
                                FlowRouter.go('/invoicecard?id=' + listData);
                            } else if (transactiontype === 'Invoice') {
                                FlowRouter.go('/invoicecard?id=' + listData);
                            } else if (transactiontype === 'Sales Order' || transactiontype === 'SO') {
                                FlowRouter.go('/salesordercard?id=' + listData);
                            } else if (transactiontype === 'Quote') {
                                FlowRouter.go('/quotecard?id=' + listData);
                            } else if (transactiontype === 'UnInvoiced SO') {
                                FlowRouter.go('/salesordercard?id=' + listData);
                            }
                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.ttransactionlistreport;

                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < useData.length; i++) {
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(useData[i].DEBITSEX) || 0.00;
                    // let totalTax = utilityService.modifynegativeCurrencyFormat(useData[i].TotalTax) || 0.00;
                    // Currency+''+useData[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(useData[i].DEBITSINC) || 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(useData[i].CREDITSEX) || 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(useData[i].EXDiff) || 0.00;
                    if (useData[i].TYPE == "Bill") {
                        transID = useData[i].PURCHASEORDERID;
                    } else if (useData[i].TYPE == "Credit") {
                        transID = useData[i].PURCHASEORDERID;
                    } else if (useData[i].TYPE == "PO") {
                        transID = useData[i].PURCHASEORDERID;
                    } else if (useData[i].TYPE == "Supplier Payment") {
                        transID = useData[i].PAYMENTID;
                    } else if (useData[i].TYPE == "Cheque") {
                        transID = useData[i].PURCHASEORDERID;
                    } else if (useData[i].TYPE == "Journal Entry") {
                        transID = useData[i].SALEID;
                    } else if (useData[i].TYPE == "Customer Payment") {
                        transID = useData[i].PAYMENTID;
                    } else if (useData[i].TYPE == "Refund") {
                        transID = useData[i].SALEID;
                    } else if (useData[i].TYPE == "Invoice") {
                        transID = useData[i].SALEID;
                    } else if (useData[i].TYPE == "UnInvoiced SO") {
                        transID = useData[i].SALEID;
                    } else if (useData[i].TYPE == "Quote") {
                        transID = useData[i].SALEID;
                    }
                    var dataList = {
                        id: transID || '',
                        transid: useData[i].transID|| '',
                        employee: useData[i].EmployeeName || '',
                        sortdate: useData[i].DATE != '' ? moment(useData[i].DATE).format("YYYY/MM/DD") : useData[i].DATE,
                        saledate: useData[i].DATE != '' ? moment(useData[i].DATE).format("DD/MM/YYYY") : useData[i].DATE,
                        customername: useData[i].CLIENTNAME || '',
                        totalamountex: totalAmountEx || 0.00,
                        // totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        type: useData[i].TYPE || '',
                        custfield1: '',
                        custfield2: '',
                        comments: useData[i].Memo || '',
                    };


                    if (useData[i].CLIENTNAME === customerName) {
                        dataTableList.push(dataList);
                    }
                }


                templateObject.datatablerecords.set(dataTableList);


                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTransactionlist', function (error, result) {
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


                    setTimeout(function () {
                        MakeNegative();
                        $("#dtAsOf").datepicker({
                            showOn: 'button',
                            buttonText: 'Show Date',
                            buttonImageOnly: true,
                            buttonImage: '/img/imgCal2.png',
                            dateFormat: 'dd/mm/yy',
                            showOtherMonths: true,
                            changeMonth: true,
                            changeYear: true,
                            yearRange: "-90:+10",
                        });
                    }, 100);
                }
                // $('.custAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(totAmount));
                // $('.custOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(totAmountOverDue));
                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblTransactionlist').DataTable({
                        // dom: 'lBfrtip',
                        columnDefs: [
                            { type: 'date', targets: 0 }
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Sales Transaction List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Sales Transaction',
                                filename: "Sales Transaction List - " + moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 0, "desc" ],[ 2, "desc" ]],
                        action: function () {
                            $('#tblTransactionlist').DataTable().ajax.reload();
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
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    });

                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblTransactionlist th');
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

                $('.tblTransactionlist tbody').on('click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".colType").text();
                    if ((listData) && (transactiontype)) {
                        if (transactiontype === 'Bill') {
                            FlowRouter.go('/billcard?id=' + listData);
                        } else if (transactiontype === 'Credit') {
                            FlowRouter.go('/creditcard?id=' + listData);
                        } else if (transactiontype === 'PO') {
                            FlowRouter.go('/purchaseordercard?id=' + listData);
                        } else if (transactiontype === 'Supplier Payment') {
                            FlowRouter.go('/supplierpaymentcard?id=' + listData);
                        } else if (transactiontype === 'Customer Payment') {
                            FlowRouter.go('/paymentcard?id=' + listData);
                        } else if (transactiontype === 'Cheque') {
                            FlowRouter.go('/chequecard?id=' + listData);
                        } else if (transactiontype === 'Journal Entry') {
                            FlowRouter.go('/journalentrycard?id=' + listData);
                        } else if (transactiontype === 'Refund') {
                            FlowRouter.go('/invoicecard?id=' + listData);
                        } else if (transactiontype === 'Invoice') {
                            FlowRouter.go('/invoicecard?id=' + listData);
                        } else if (transactiontype === 'Sales Order' || transactiontype === 'SO') {
                            FlowRouter.go('/salesordercard?id=' + listData);
                        } else if (transactiontype === 'Quote') {
                            FlowRouter.go('/quotecard?id=' + listData);
                        } else if (transactiontype === 'UnInvoiced SO') {
                            FlowRouter.go('/salesordercard?id=' + listData);
                        }
                    }
                });
            }
        }).catch(function (err) {
            sideBarService.getTTransactionListReport('').then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                addVS1Data('TTransactionListReport', JSON.stringify(data)).then(function (datareturn) {

                }).catch(function (err) {

                });
                let transID = "";
                for (let i = 0; i < data.ttransactionlistreport.length; i++) {
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.ttransactionlistreport[i].DEBITSEX) || 0.00;
                    // let totalTax = utilityService.modifynegativeCurrencyFormat(data.ttransactionlistreport[i].TotalTax) || 0.00;
                    // Currency+''+data.ttransactionlistreport[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.ttransactionlistreport[i].DEBITSINC) || 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(data.ttransactionlistreport[i].CREDITSEX) || 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.ttransactionlistreport[i].EXDiff) || 0.00;
                    if (data.ttransactionlistreport[i].TYPE == "Bill") {
                        transID = data.ttransactionlistreport[i].PURCHASEORDERID;
                    } else if (data.ttransactionlistreport[i].TYPE == "Credit") {
                        transID = data.ttransactionlistreport[i].PURCHASEORDERID;
                    } else if (data.ttransactionlistreport[i].TYPE == "PO") {
                        transID = data.ttransactionlistreport[i].PURCHASEORDERID;
                    } else if (data.ttransactionlistreport[i].TYPE == "Supplier Payment") {
                        transID = data.ttransactionlistreport[i].PAYMENTID;
                    } else if (data.ttransactionlistreport[i].TYPE == "Cheque") {
                        transID = data.ttransactionlistreport[i].PURCHASEORDERID;
                    } else if (data.ttransactionlistreport[i].TYPE == "Journal Entry") {
                        transID = data.ttransactionlistreport[i].SALEID;
                    } else if (data.ttransactionlistreport[i].TYPE == "Customer Payment") {
                        transID = data.ttransactionlistreport[i].PAYMENTID;
                    } else if (data.ttransactionlistreport[i].TYPE == "Refund") {
                        transID = data.ttransactionlistreport[i].SALEID;
                    } else if (data.ttransactionlistreport[i].TYPE == "Invoice") {
                        transID = data.ttransactionlistreport[i].SALEID;
                    } else if (data.ttransactionlistreport[i].TYPE == "UnInvoiced SO") {
                        transID = data.ttransactionlistreport[i].SALEID;
                    } else if (data.ttransactionlistreport[i].TYPE == "Quote") {
                        transID = data.ttransactionlistreport[i].SALEID;
                    }
                    var dataList = {
                        id: transID || '',
                        transid: data.ttransactionlistreport[i].transID|| '',
                        employee: data.ttransactionlistreport[i].EmployeeName || '',
                        sortdate: data.ttransactionlistreport[i].DATE != '' ? moment(data.ttransactionlistreport[i].DATE).format("YYYY/MM/DD") : data.ttransactionlistreport[i].DATE,
                        saledate: data.ttransactionlistreport[i].DATE != '' ? moment(data.ttransactionlistreport[i].DATE).format("DD/MM/YYYY") : data.ttransactionlistreport[i].DATE,
                        customername: data.ttransactionlistreport[i].CLIENTNAME || '',
                        totalamountex: totalAmountEx || 0.00,
                        // totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        type: data.ttransactionlistreport[i].TYPE || '',
                        custfield1: '',
                        custfield2: '',
                        comments: data.ttransactionlistreport[i].Memo || '',
                    };
                    if (data.ttransactionlistreport[i].CLIENTNAME === customerName) {
                        dataTableList.push(dataList);
                    }
                }


                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTransactionlist', function (error, result) {
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


                    setTimeout(function () {
                        MakeNegative();
                        $("#dtAsOf").datepicker({
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
                    }, 100);
                }
                // $('.custAwaitingAmt').text(utilityService.modifynegativeCurrencyFormat(totAmount));
                // $('.custOverdueAmt').text(utilityService.modifynegativeCurrencyFormat(totAmountOverDue));
                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblTransactionlist').DataTable({
                        // dom: 'lBfrtip',
                        columnDefs: [
                            { type: 'date', targets: 0 }
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Sales Transaction List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Sales Transaction',
                                filename: "Sales Transaction List - " + moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 0, "desc" ],[ 2, "desc" ]],
                        action: function () {
                            $('#tblTransactionlist').DataTable().ajax.reload();
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
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    });

                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblTransactionlist th');
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
                $('.tblTransactionlist tbody').on('click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".colType").text();
                    if ((listData) && (transactiontype)) {
                        if (transactiontype === 'Bill') {
                            FlowRouter.go('/billcard?id=' + listData);
                        } else if (transactiontype === 'Credit') {
                            FlowRouter.go('/creditcard?id=' + listData);
                        } else if (transactiontype === 'PO') {
                            FlowRouter.go('/purchaseordercard?id=' + listData);
                        } else if (transactiontype === 'Supplier Payment') {
                            FlowRouter.go('/supplierpaymentcard?id=' + listData);
                        } else if (transactiontype === 'Customer Payment') {
                            FlowRouter.go('/paymentcard?id=' + listData);
                        } else if (transactiontype === 'Cheque') {
                            FlowRouter.go('/chequecard?id=' + listData);
                        } else if (transactiontype === 'Journal Entry') {
                            FlowRouter.go('/journalentrycard?id=' + listData);
                        } else if (transactiontype === 'Refund') {
                            FlowRouter.go('/invoicecard?id=' + listData);
                        } else if (transactiontype === 'Invoice') {
                            FlowRouter.go('/invoicecard?id=' + listData);
                        } else if (transactiontype === 'Sales Order' || transactiontype === 'SO') {
                            FlowRouter.go('/salesordercard?id=' + listData);
                        } else if (transactiontype === 'Quote') {
                            FlowRouter.go('/quotecard?id=' + listData);
                        } else if (transactiontype === 'UnInvoiced SO') {
                            FlowRouter.go('/salesordercard?id=' + listData);
                        }
                    }
                });

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });


    }
    templateObject.getAllCustomerJobs = function (customerName) {
        getVS1Data('TJobVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                contactService.getAllJobListByCustomer(customerName).then(function (data) {
                    let lineItemsJob = [];
                    let lineItemObjJob = {};
                    for (let i = 0; i < data.tjob.length; i++) {
                        let arBalance = utilityService.modifynegativeCurrencyFormat(data.tjob[i].ARBalance) || 0.00;
                        let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tjob[i].CreditBalance) || 0.00;
                        let balance = utilityService.modifynegativeCurrencyFormat(data.tjob[i].Balance) || 0.00;
                        let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tjob[i].CreditLimit) || 0.00;
                        let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tjob[i].SalesOrderBalance) || 0.00;
                        var dataListJob = {
                            id: data.tjob[i].Id || '',
                            company: data.tjob[i].ClientName || '',
                            contactname: data.tjob[i].ContactName || '',
                            phone: data.tjob[i].Phone || '',
                            arbalance: arBalance || 0.00,
                            creditbalance: creditBalance || 0.00,
                            balance: balance || 0.00,
                            creditlimit: creditLimit || 0.00,
                            salesorderbalance: salesOrderBalance || 0.00,
                            email: data.tjob[i].Email || '',
                            accountno: data.tjob[i].AccountNo || '',
                            clientno: data.tjob[i].ClientNo || '',
                            jobtitle: data.tjob[i].JobTitle || '',
                            notes: data.tjob[i].Notes || '',
                            country: data.tjob[i].Country || LoggedCountry
                        };
                        if (customerName === data.tjob[i].ParentCustomerName) {
                            dataTableListJob.push(dataListJob);
                        }

                    }
                    templateObject.datatablerecordsjob.set(dataTableListJob);


                    if (templateObject.datatablerecordsjob.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblJoblist', function (error, result) {
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


                        setTimeout(function () {
                            MakeNegative();
                            $("#dtAsOf").datepicker({
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
                        }, 100);
                    }

                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function () {
                        //$.fn.dataTable.moment('DD/MM/YY');
                        $('#tblJoblist').DataTable({
                            // dom: 'lBfrtip',
                            columnDefs: [
                                { type: 'date', targets: 0 }
                            ],
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [
                                {
                                    extend: 'excelHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "Job Transaction List - " + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Job Transaction',
                                    filename: "Job Transaction List - " + moment().format(),
                                    exportOptions: {
                                        columns: ':visible',
                                        stripHtml: false
                                    }
                                }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [[0, "asc"]],
                            action: function () {
                                $('#tblJoblist').DataTable().ajax.reload();
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

                        }).on('column-reorder', function () {

                        });

                        $('.fullScreenSpin').css('display', 'none');
                    }, 0);

                    var columns = $('#tblJoblist th');
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
                        tableHeaderListJob.push(datatablerecordObj);
                    });
                    templateObject.tableheaderrecordsjob.set(tableHeaderListJob);
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');
                    $('#tblJoblist tbody').on('click', 'tr', function () {
                        var listData = $(this).closest('tr').attr('id');
                        if (listData) {
                            //window.open('/invoicecard?id=' + listData,'_self');
                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tjobvs1;
                let lineItemsJob = [];
                let lineItemObjJob = {};
                for (let i = 0; i < useData.length; i++) {
                    let arBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.ARBalance) || 0.00;
                    let creditBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.CreditBalance) || 0.00;
                    let balance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.Balance) || 0.00;
                    let creditLimit = utilityService.modifynegativeCurrencyFormat(useData[i].fields.CreditLimit) || 0.00;
                    let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.Balance) || 0.00;
                    var dataListJob = {
                        id: useData[i].fields.ID || '',
                        company: useData[i].fields.ClientName || '',
                        contactname: useData[i].fields.ContactName || '',
                        phone: useData[i].fields.Phone || '',
                        arbalance: arBalance || 0.00,
                        creditbalance: creditBalance || 0.00,
                        balance: balance || 0.00,
                        creditlimit: creditLimit || 0.00,
                        salesorderbalance: salesOrderBalance || 0.00,
                        email: useData[i].fields.Email || '',
                        accountno: useData[i].fields.AccountNo || '',
                        clientno: useData[i].fields.ClientNo || '',
                        jobtitle: useData[i].fields.JobTitle || '',
                        notes: useData[i].fields.Notes || '',
                        country: useData[i].fields.Country || LoggedCountry
                    };
                    if (customerName === useData[i].fields.ParentCustomerName) {
                        dataTableListJob.push(dataListJob);
                    }

                }
                templateObject.datatablerecordsjob.set(dataTableListJob);


                if (templateObject.datatablerecordsjob.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblJoblist', function (error, result) {
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


                    setTimeout(function () {
                        MakeNegative();
                        $("#dtAsOf").datepicker({
                            showOn: 'button',
                            buttonText: 'Show Date',
                            buttonImageOnly: true,
                            dateFormat: 'dd/mm/yy',
                            showOtherMonths: true,
                            selectOtherMonths: true,
                            changeMonth: true,
                            changeYear: true,
                            yearRange: "-90:+10",
                        });
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblJoblist').DataTable({
                        // dom: 'lBfrtip',
                        columnDefs: [
                            { type: 'date', targets: 0 }
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Job Transaction List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Job Transaction',
                                filename: "Job Transaction List - " + moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[0, "asc"]],
                        action: function () {
                            $('#tblJoblist').DataTable().ajax.reload();
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

                    }).on('column-reorder', function () {

                    });

                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblJoblist th');
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
                    tableHeaderListJob.push(datatablerecordObj);
                });
                templateObject.tableheaderrecordsjob.set(tableHeaderListJob);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');
                $('#tblJoblist tbody').on('click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        //window.open('/invoicecard?id=' + listData,'_self');
                    }
                });

            }
        }).catch(function (err) {
            contactService.getAllJobListByCustomer(customerName).then(function (data) {
                let lineItemsJob = [];
                let lineItemObjJob = {};
                for (let i = 0; i < data.tjob.length; i++) {
                    let arBalance = utilityService.modifynegativeCurrencyFormat(data.tjob[i].ARBalance) || 0.00;
                    let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tjob[i].CreditBalance) || 0.00;
                    let balance = utilityService.modifynegativeCurrencyFormat(data.tjob[i].Balance) || 0.00;
                    let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tjob[i].CreditLimit) || 0.00;
                    let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tjob[i].SalesOrderBalance) || 0.00;
                    var dataListJob = {
                        id: data.tjob[i].Id || '',
                        company: data.tjob[i].ClientName || '',
                        contactname: data.tjob[i].ContactName || '',
                        phone: data.tjob[i].Phone || '',
                        arbalance: arBalance || 0.00,
                        creditbalance: creditBalance || 0.00,
                        balance: balance || 0.00,
                        creditlimit: creditLimit || 0.00,
                        salesorderbalance: salesOrderBalance || 0.00,
                        email: data.tjob[i].Email || '',
                        accountno: data.tjob[i].AccountNo || '',
                        clientno: data.tjob[i].ClientNo || '',
                        jobtitle: data.tjob[i].JobTitle || '',
                        notes: data.tjob[i].Notes || '',
                        country: data.tjob[i].Country || LoggedCountry
                    };
                    if (customerName === data.tjob[i].ParentCustomerName) {
                        dataTableListJob.push(dataListJob);
                    }

                }
                templateObject.datatablerecordsjob.set(dataTableListJob);


                if (templateObject.datatablerecordsjob.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblJoblist', function (error, result) {
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


                    setTimeout(function () {
                        MakeNegative();
                        $("#dtAsOf").datepicker({
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
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblJoblist').DataTable({
                        // dom: 'lBfrtip',
                        columnDefs: [
                            { type: 'date', targets: 0 }
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Job Transaction List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Job Transaction',
                                filename: "Job Transaction List - " + moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[0, "asc"]],
                        action: function () {
                            $('#tblJoblist').DataTable().ajax.reload();
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

                    }).on('column-reorder', function () {

                    });

                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblJoblist th');
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
                    tableHeaderListJob.push(datatablerecordObj);
                });
                templateObject.tableheaderrecordsjob.set(tableHeaderListJob);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');
                $('#tblJoblist tbody').on('click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        //window.open('/invoicecard?id=' + listData,'_self');
                    }
                });

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });

    }
    //templateObject.getAllProductRecentTransactions();


    templateObject.getCountryData = function () {
        getVS1Data('TCountries').then(function (dataObject) {
            if (dataObject.length == 0) {
                countryService.getCountry().then((data) => {
                    for (let i = 0; i < data.tcountries.length; i++) {
                        countries.push(data.tcountries[i].Country)
                    }
                    countries = _.sortBy(countries);
                    templateObject.countryData.set(countries);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcountries;
                for (let i = 0; i < useData.length; i++) {
                    countries.push(useData[i].Country)
                }
                countries = _.sortBy(countries);
                templateObject.countryData.set(countries);

            }
        }).catch(function (err) {
            countryService.getCountry().then((data) => {
                for (let i = 0; i < data.tcountries.length; i++) {
                    countries.push(data.tcountries[i].Country)
                }
                countries = _.sortBy(countries);
                templateObject.countryData.set(countries);
            });
        });
    };
    templateObject.getCountryData();


    templateObject.getPreferedPaymentList = function () {
        getVS1Data('TPaymentMethod').then(function (dataObject) {
            if (dataObject.length == 0) {
                contactService.getPaymentMethodDataVS1().then((data) => {
                    for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                        preferedPayments.push(data.tpaymentmethodvs1[i].PaymentMethodName)
                    }
                    preferedPayments = _.sortBy(preferedPayments);

                    templateObject.preferedPaymentList.set(preferedPayments);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tpaymentmethodvs1;
                for (let i = 0; i < useData.length; i++) {
                    preferedPayments.push(useData[i].fields.PaymentMethodName)
                }
                preferedPayments = _.sortBy(preferedPayments);
                templateObject.preferedPaymentList.set(preferedPayments);
            }
        }).catch(function (err) {
            contactService.getPaymentMethodDataVS1().then((data) => {
                for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                    preferedPayments.push(data.tpaymentmethodvs1[i].PaymentMethodName)
                }
                preferedPayments = _.sortBy(preferedPayments);

                templateObject.preferedPaymentList.set(preferedPayments);
            });
        });
    };
    templateObject.getTermsList = function () {
        getVS1Data('TTermsVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                contactService.getTermDataVS1().then((data) => {
                    for (let i = 0; i < data.ttermsvs1.length; i++) {
                        terms.push(data.ttermsvs1[i].TermsName);
                        if(data.ttermsvs1[i].isSalesdefault == true){
                            templateObject.defaultsaleterm.set(data.ttermsvs1[i].TermsName);
                            // $('.termsSelect').val(data.ttermsvs1[i].TermsName);
                        }
                    }
                    terms = _.sortBy(terms);
                    templateObject.termsList.set(terms);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.ttermsvs1;
                for (let i = 0; i < useData.length; i++) {
                    terms.push(useData[i].TermsName);
                    if(useData[i].isSalesdefault == true){
                        templateObject.defaultsaleterm.set(useData[i].TermsName);
                        //$('.termsSelect').val(useData[i].TermsName);
                    }
                }
                terms = _.sortBy(terms);
                templateObject.termsList.set(terms);

            }
        }).catch(function (err) {
            contactService.getTermDataVS1().then((data) => {
                for (let i = 0; i < data.ttermsvs1.length; i++) {
                    terms.push(data.ttermsvs1[i].TermsName);
                    if(data.ttermsvs1[i].isSalesdefault == true){
                        templateObject.defaultsaleterm.set(data.ttermsvs1[i].TermsName);
                    }
                }
                terms = _.sortBy(terms);
                templateObject.termsList.set(terms);
            });
        });
    };

    templateObject.getDeliveryMethodList = function () {
        getVS1Data('TShippingMethod').then(function (dataObject) {
            if (dataObject.length == 0) {
                contactService.getShippingMethodData().then((data) => {
                    for (let i = 0; i < data.tshippingmethod.length; i++) {
                        deliveryMethods.push(data.tshippingmethod[i].ShippingMethod)
                    }
                    deliveryMethods = _.sortBy(deliveryMethods);
                    templateObject.deliveryMethodList.set(deliveryMethods);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tshippingmethod;
                for (let i = 0; i < useData.length; i++) {
                    deliveryMethods.push(useData[i].ShippingMethod)
                }
                deliveryMethods = _.sortBy(deliveryMethods);
                templateObject.deliveryMethodList.set(deliveryMethods);

            }
        }).catch(function (err) {
            contactService.getShippingMethodData().then((data) => {
                for (let i = 0; i < data.tshippingmethod.length; i++) {
                    deliveryMethods.push(data.tshippingmethod[i].ShippingMethod)
                }
                deliveryMethods = _.sortBy(deliveryMethods);
                templateObject.deliveryMethodList.set(deliveryMethods);
            });
        });
    };

    templateObject.getClientTypeData = function () {
        getVS1Data('TClientType').then(function (dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getClientTypeData().then((data) => {
                    for (let i = 0; i < data.tclienttype.length; i++) {
                        clientType.push(data.tclienttype[i].fields.TypeName)
                    }
                    clientType = _.sortBy(clientType);
                    templateObject.clienttypeList.set(clientType);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tclienttype;
                for (let i = 0; i < useData.length; i++) {
                    clientType.push(useData[i].fields.TypeName)
                }
                clientType = _.sortBy(clientType);
                templateObject.clienttypeList.set(clientType);
                //$('.customerTypeSelect option:first').prop('selected', false);
                $(".customerTypeSelect").attr('selectedIndex', 0);

            }
        }).catch(function (err) {
            sideBarService.getClientTypeData().then((data) => {
                for (let i = 0; i < data.tclienttype.length; i++) {
                    clientType.push(data.tclienttype[i].fields.TypeName)
                }
                clientType = _.sortBy(clientType);
                templateObject.clienttypeList.set(clientType);
            });
        });

    };

    templateObject.getTaxCodesList = function () {
      getVS1Data('TTaxcodeVS1').then(function (dataObject) {
          if (dataObject.length == 0) {
              contactService.getTaxCodesVS1().then(function (data) {

                  let records = [];
                  let inventoryData = [];
                  for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                      let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                      var dataList = [
                          data.ttaxcodevs1[i].Id || '',
                          data.ttaxcodevs1[i].CodeName || '',
                          data.ttaxcodevs1[i].Description || '-',
                          taxRate || 0,
                      ];

                      let taxcoderecordObj = {
                          codename: data.ttaxcodevs1[i].CodeName || ' ',
                          coderate: taxRate || ' ',
                      };

                      taxCodesList.push(taxcoderecordObj);

                      splashArrayTaxRateList.push(dataList);
                  }
                  templateObject.taxraterecords.set(taxCodesList);

                  if (splashArrayTaxRateList) {

                      $('#tblTaxRate').DataTable({
                          data: splashArrayTaxRateList,
                          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                          columnDefs: [{
                                  orderable: false,
                                  targets: 0
                              }, {
                                  className: "taxName",
                                  "targets": [1]
                              }, {
                                  className: "taxDesc",
                                  "targets": [2]
                              }, {
                                  className: "taxRate text-right",
                                  "targets": [3]
                              }
                          ],
                          colReorder: true,

                          pageLength: initialDatatableLoad,
                          lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                          info: true,
                          responsive: true,
                          "fnDrawCallback": function (oSettings) {
                              // $('.dataTables_paginate').css('display', 'none');
                          },
                          "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnAddNewTaxRate' data-dismiss='modal' data-toggle='modal' data-target='#newTaxRateModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblTaxRate_filter");
                            $("<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTaxRate_filter");
                          }

                      });
                  }
              })
          } else {
              let data = JSON.parse(dataObject[0].data);
              let useData = data.ttaxcodevs1;
              let records = [];
              let inventoryData = [];
              for (let i = 0; i < useData.length; i++) {
                  let taxRate = (useData[i].Rate * 100).toFixed(2);
                  var dataList = [
                      useData[i].Id || '',
                      useData[i].CodeName || '',
                      useData[i].Description || '-',
                      taxRate || 0,
                  ];

                  let taxcoderecordObj = {
                      codename: useData[i].CodeName || ' ',
                      coderate: taxRate || ' ',
                  };

                  taxCodesList.push(taxcoderecordObj);

                  splashArrayTaxRateList.push(dataList);
              }
              templateObject.taxraterecords.set(taxCodesList);
              if (splashArrayTaxRateList) {

                  $('#tblTaxRate').DataTable({
                      data: splashArrayTaxRateList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                      columnDefs: [{
                              orderable: false,
                              targets: 0
                          }, {
                              className: "taxName",
                              "targets": [1]
                          }, {
                              className: "taxDesc",
                              "targets": [2]
                          }, {
                              className: "taxRate text-right",
                              "targets": [3]
                          }
                      ],
                      colReorder: true,

                      pageLength: initialDatatableLoad,
                      lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                      info: true,
                      responsive: true,
                      "fnDrawCallback": function (oSettings) {
                          // $('.dataTables_paginate').css('display', 'none');
                      },
                      "fnInitComplete": function () {
                        $("<button class='btn btn-primary btnAddNewTaxRate' data-dismiss='modal' data-toggle='modal' data-target='#newTaxRateModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblTaxRate_filter");
                        $("<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTaxRate_filter");
                      }

                  });
              }
          }
      }).catch(function (err) {
          contactService.getTaxCodesVS1().then(function (data) {

              let records = [];
              let inventoryData = [];
              for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                  let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                  var dataList = [
                      data.ttaxcodevs1[i].Id || '',
                      data.ttaxcodevs1[i].CodeName || '',
                      data.ttaxcodevs1[i].Description || '-',
                      taxRate || 0,
                  ];

                  let taxcoderecordObj = {
                      codename: data.ttaxcodevs1[i].CodeName || ' ',
                      coderate: taxRate || ' ',
                  };

                  taxCodesList.push(taxcoderecordObj);

                  splashArrayTaxRateList.push(dataList);
              }
              templateObject.taxraterecords.set(taxCodesList);

              if (splashArrayTaxRateList) {

                  $('#tblTaxRate').DataTable({
                      data: splashArrayTaxRateList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                      columnDefs: [{
                              orderable: false,
                              targets: 0
                          }, {
                              className: "taxName",
                              "targets": [1]
                          }, {
                              className: "taxDesc",
                              "targets": [2]
                          }, {
                              className: "taxRate text-right",
                              "targets": [3]
                          }
                      ],
                      colReorder: true,

                      pageLength: initialDatatableLoad,
                      lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                      info: true,
                      responsive: true,
                      "fnDrawCallback": function (oSettings) {
                          // $('.dataTables_paginate').css('display', 'none');
                      },
                      "fnInitComplete": function () {
                        $("<button class='btn btn-primary btnAddNewTaxRate' data-dismiss='modal' data-toggle='modal' data-target='#newTaxRateModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblTaxRate_filter");
                        $("<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTaxRate_filter");
                      }
                  });

              }
          })
      });
    };

    templateObject.getPreferedPaymentList();
    templateObject.getTermsList();
    templateObject.getDeliveryMethodList();
    templateObject.getTaxCodesList();
    // templateObject.getClientTypeData();


    //$('#sltCustomerType').append('<option value="' + lineItemObj.custometype + '">' + lineItemObj.custometype + '</option>');
    if (currentId.id == "undefined") {
        let lineItemObj = {
            id: '',
            lid: 'Add Customer',
            company: '',
            email: '',
            title: '',
            firstname: '',
            middlename: '',
            lastname: '',
            tfn: '',
            phone: '',
            mobile: '',
            fax: '',
            shippingaddress: '',
            scity: '',
            sstate: '',
            terms: templateObject.defaultsaleterm.get() || '',
            spostalcode: '',
            scountry: LoggedCountry || '',
            billingaddress: '',
            bcity: '',
            bstate: '',
            bpostalcode: '',
            bcountry: LoggedCountry || '',
            custFld1: '',
            custFld2: '',
            discount:0,
            jobbcountry: LoggedCountry || '',
            jobscountry: LoggedCountry || '',
            discount:0
        }
        setTimeout(function () {
          $('#sltPreferedPayment').val(lineItemObj.preferedpayment);
          $('#sltTerms').val(lineItemObj.terms);
          $('#sltCustomerType').val(lineItemObj.custometype);
          $('#sltTaxCode').val(lineItemObj.taxcode);
          $('#sltJobPreferedPayment').val(lineItemObj.jobpreferedpayment);
          $('#sltJobTerms').val(lineItemObj.terms);
          $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
          $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);
            $('.customerTypeSelect').append('<option value="newCust">Add Customer Type</option>');
        },1000)
        templateObject.isSameAddress.set(true);
        templateObject.records.set(lineItemObj);
        setTimeout(function () {
            $('#tblTransactionlist').DataTable();
            if (currentId.transTab == 'active') {
                $('.customerTab').removeClass('active');
                $('.transactionTab').trigger('click');
            }else if (currentId.transTab == 'job') {
                $('.customerTab').removeClass('active');
                $('.jobTab').trigger('click');
            }else{
                $('.customerTab').addClass('active');
                $('.customerTab').trigger('click');
            }
            $('.fullScreenSpin').css('display', 'none');
        }, 500);
        $('.fullScreenSpin').css('display', 'none');
    } else {
        if (!isNaN(currentId.id)) {
            customerID = currentId.id;
            templateObject.getEmployeeData = function () {
                getVS1Data('TCustomerVS1').then(function (dataObject) {
                    if (dataObject.length == 0) {
                        contactService.getOneCustomerDataEx(customerID).then(function (data) {

                            let lineItems = [];

                            let lineItemObj = {
                                id: data.fields.ID || '',
                                lid: 'Edit Customer',
                                isjob: data.fields.IsJob || '',
                                issupplier: data.fields.IsSupplier || false,
                                iscustomer: data.fields.IsCustomer || false,
                                company: data.fields.ClientName || '',
                                email: data.fields.Email || '',
                                title: data.fields.Title || '',
                                firstname: data.fields.FirstName || '',
                                middlename: data.fields.CUSTFLD10 || '',
                                lastname: data.fields.LastName || '',
                                tfn: '' || '',
                                phone: data.fields.Phone || '',
                                mobile: data.fields.Mobile || '',
                                fax: data.fields.Faxnumber || '',
                                skype: data.fields.SkypeName || '',
                                website: data.fields.URL || '',
                                shippingaddress: data.fields.Street || '',
                                scity: data.fields.Street2 || '',
                                sstate: data.fields.State || '',
                                spostalcode: data.fields.Postcode || '',
                                scountry: data.fields.Country || LoggedCountry,
                                billingaddress: data.fields.BillStreet || '',
                                bcity: data.fields.BillStreet2 || '',
                                bstate: data.fields.BillState || '',
                                bpostalcode: data.fields.BillPostcode || '',
                                bcountry: data.fields.Billcountry || '',
                                notes: data.fields.Notes || '',
                                preferedpayment: data.fields.PaymentMethodName || '',
                                terms: data.fields.TermsName || templateObject.defaultsaleterm.get(),
                                deliverymethod: data.fields.ShippingMethodName || '',
                                clienttype: data.fields.ClientTypeName || '',
                                openingbalance: data.fields.RewardPointsOpeningBalance || 0.00,
                                openingbalancedate: data.fields.RewardPointsOpeningDate ? moment(data.fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                                taxcode: data.fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                                custfield1: data.fields.CUSTFLD1 || '',
                                custfield2: data.fields.CUSTFLD2 || '',
                                custfield3: data.fields.CUSTFLD3 || '',
                                custfield4: data.fields.CUSTFLD4 || '',
                                jobcompany: data.fields.ClientName || '',
                                jobCompanyParent: data.fields.ClientName || '',
                                jobemail: data.fields.Email || '',
                                jobtitle: data.fields.Title || '',
                                jobfirstname: data.fields.FirstName || '',
                                jobmiddlename: data.fields.CUSTFLD10 || '',
                                joblastname: data.fields.LastName || '',
                                jobtfn: '' || '',
                                jobphone: data.fields.Phone || '',
                                jobmobile: data.fields.Mobile || '',
                                jobfax: data.fields.Faxnumber || '',
                                jobskype: data.fields.SkypeName || '',
                                jobwebsite: data.fields.CUSTFLD9 || '',
                                jobshippingaddress: data.fields.Street || '',
                                jobscity: data.fields.Street2 || '',
                                jobsstate: data.fields.State || '',
                                jobspostalcode: data.fields.Postcode || '',
                                jobscountry: data.fields.Country || LoggedCountry,
                                jobbillingaddress: data.fields.BillStreet || '',
                                jobbcity: data.fields.BillStreet2 || '',
                                jobbstate: data.fields.BillState || '',
                                jobbpostalcode: data.fields.BillPostcode || '',
                                jobbcountry: data.fields.Billcountry || '',
                                jobnotes: data.fields.Notes || '',
                                jobpreferedpayment: data.fields.PaymentMethodName || '',
                                jobterms: data.fields.TermsName || '',
                                jobdeliverymethod: data.fields.ShippingMethodName || '',
                                jobopeningbalance: data.fields.RewardPointsOpeningBalance || 0.00,
                                jobopeningbalancedate: data.fields.RewardPointsOpeningDate ? moment(data.fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                                jobtaxcode: data.fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                                jobcustFld1: '' || '',
                                jobcustFld2: '' || '',
                                job_Title: '',
                                jobName: '',
                                jobNumber: '',
                                jobRegistration: '',
                                discount:data.fields.Discount || 0,
                                jobclienttype:data.fields.ClientTypeName || ''

                            }

                            if ((data.fields.Street == data.fields.BillStreet) && (data.fields.Street2 == data.fields.BillStreet2)
                                && (data.fields.State == data.fields.BillState) && (data.fields.Postcode == data.fields.Postcode)
                                && (data.fields.Country == data.fields.Billcountry)) {
                                templateObject.isSameAddress.set(true);
                                templateObject.isJobSameAddress.set(true);
                            }
                            //let attachmentData =  contactService.getCustomerAttachmentList(data.fields.ID);
                            templateObject.getOverviewARData(data.fields.ClientName);
                            templateObject.records.set(lineItemObj);

                            /* START attachment */
                            templateObject.attachmentCount.set(0);
                            if (data.fields.Attachments) {
                                if (data.fields.Attachments.length) {
                                    templateObject.attachmentCount.set(data.fields.Attachments.length);
                                    templateObject.uploadedFiles.set(data.fields.Attachments);

                                }
                            }
                            /* END  attachment */

                            templateObject.isJob.set(data.fields.IsJob);
                            templateObject.getAllProductRecentTransactions(data.fields.ClientName);
                            templateObject.getAllCustomerJobs(data.fields.ClientName);
                            //templateObject.uploadedFiles.set(attachmentData);
                            // $('.fullScreenSpin').css('display','none');
                            setTimeout(function () {
                              $('#sltPreferedPayment').val(lineItemObj.preferedpayment);
                              $('#sltTerms').val(lineItemObj.terms);
                              $('#sltCustomerType').val(lineItemObj.custometype);
                              $('#sltTaxCode').val(lineItemObj.taxcode);
                              $('#sltJobPreferedPayment').val(lineItemObj.jobpreferedpayment);
                              $('#sltJobTerms').val(lineItemObj.jobterms);
                              $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
                              $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);


                                var rowCount = $('.results tbody tr').length;
                                $('.counter').text(rowCount + ' items');
                                if (currentId.transTab == 'active') {
                                    $('.customerTab').removeClass('active');
                                    $('.transactionTab').trigger('click');
                                }else if (currentId.transTab == 'job') {
                                    $('.customerTab').removeClass('active');
                                    $('.jobTab').trigger('click');
                                }else{
                                    $('.customerTab').addClass('active');
                                    $('.customerTab').trigger('click');
                                }
                            }, 1000);
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tcustomervs1;

                        var added = false;
                        for (let i = 0; i < useData.length; i++) {
                            if (parseInt(useData[i].fields.ID) === parseInt(customerID)) {
                                let lineItems = [];
                                added = true;
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItemObj = {
                                    id: useData[i].fields.ID || '',
                                    lid: 'Edit Customer',
                                    isjob: useData[i].fields.IsJob || '',
                                    issupplier: useData[i].fields.IsSupplier || false,
                                    iscustomer: useData[i].fields.IsCustomer || false,
                                    company: useData[i].fields.ClientName || '',
                                    email: useData[i].fields.Email || '',
                                    title: useData[i].fields.Title || '',
                                    firstname: useData[i].fields.FirstName || '',
                                    middlename: useData[i].fields.CUSTFLD10 || '',
                                    lastname: useData[i].fields.LastName || '',
                                    tfn: '' || '',
                                    phone: useData[i].fields.Phone || '',
                                    mobile: useData[i].fields.Mobile || '',
                                    fax: useData[i].fields.Faxnumber || '',
                                    custometype: useData[i].fields.ClientTypeName || '',
                                    skype: useData[i].fields.SkypeName || '',
                                    website: useData[i].fields.URL || '',
                                    shippingaddress: useData[i].fields.Street || '',
                                    scity: useData[i].fields.Street2 || '',
                                    sstate: useData[i].fields.State || '',
                                    spostalcode: useData[i].fields.Postcode || '',
                                    scountry: useData[i].fields.Country || LoggedCountry,
                                    billingaddress: useData[i].fields.BillStreet || '',
                                    bcity: useData[i].fields.BillStreet2 || '',
                                    bstate: useData[i].fields.BillState || '',
                                    bpostalcode: useData[i].fields.BillPostcode || '',
                                    bcountry: useData[i].fields.Billcountry || '',
                                    notes: useData[i].fields.Notes || '',
                                    preferedpayment: useData[i].fields.PaymentMethodName || '',
                                    terms: useData[i].fields.TermsName || '',
                                    deliverymethod: useData[i].fields.ShippingMethodName || '',
                                    clienttype: useData[i].fields.ClientTypeName || '',
                                    openingbalance: useData[i].fields.RewardPointsOpeningBalance || 0.00,
                                    openingbalancedate: useData[i].fields.RewardPointsOpeningDate ? moment(useData[i].fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                                    taxcode: useData[i].fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                                    custfield1: useData[i].fields.CUSTFLD1 || '',
                                    custfield2: useData[i].fields.CUSTFLD2 || '',
                                    custfield3: useData[i].fields.CUSTFLD3 || '',
                                    custfield4: useData[i].fields.CUSTFLD4 || '',
                                    jobcompany: useData[i].fields.ClientName || '',
                                    jobCompanyParent: useData[i].fields.ClientName || '',
                                    jobemail: useData[i].fields.Email || '',
                                    jobtitle: useData[i].fields.Title || '',
                                    jobfirstname: useData[i].fields.FirstName || '',
                                    jobmiddlename: useData[i].fields.CUSTFLD10 || '',
                                    joblastname: useData[i].fields.LastName || '',
                                    jobtfn: '' || '',
                                    jobphone: useData[i].fields.Phone || '',
                                    jobmobile: useData[i].fields.Mobile || '',
                                    jobfax: useData[i].fields.Faxnumber || '',
                                    jobskype: useData[i].fields.SkypeName || '',
                                    jobwebsite: useData[i].fields.CUSTFLD9 || '',
                                    jobshippingaddress: useData[i].fields.Street || '',
                                    jobscity: useData[i].fields.Street2 || '',
                                    jobsstate: useData[i].fields.State || '',
                                    jobspostalcode: useData[i].fields.Postcode || '',
                                    jobscountry: useData[i].fields.Country || LoggedCountry,
                                    jobbillingaddress: useData[i].fields.BillStreet || '',
                                    jobbcity: useData[i].fields.BillStreet2 || '',
                                    jobbstate: useData[i].fields.BillState || '',
                                    jobbpostalcode: useData[i].fields.BillPostcode || '',
                                    jobbcountry: useData[i].fields.Billcountry || '',
                                    jobnotes: useData[i].fields.Notes || '',
                                    jobpreferedpayment: useData[i].fields.PaymentMethodName || '',
                                    jobterms: useData[i].fields.TermsName || '',
                                    jobdeliverymethod: useData[i].fields.ShippingMethodName || '',
                                    jobopeningbalance: useData[i].fields.RewardPointsOpeningBalance || 0.00,
                                    jobopeningbalancedate: useData[i].fields.RewardPointsOpeningDate ? moment(useData[i].fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                                    jobtaxcode: useData[i].fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                                    jobcustFld1: '' || '',
                                    jobcustFld2: '' || '',
                                    job_Title: '',
                                    jobName: '',
                                    jobNumber: '',
                                    jobRegistration: '',
                                    discount:useData[i].fields.Discount || 0,
                                    jobclienttype:useData[i].fields.ClientTypeName || ''

                                }

                                if ((useData[i].fields.Street == useData[i].fields.BillStreet) && (useData[i].fields.Street2 == useData[i].fields.BillStreet2)
                                    && (useData[i].fields.State == useData[i].fields.BillState) && (useData[i].fields.Postcode == useData[i].fields.BillPostcode)
                                    && (useData[i].fields.Country == useData[i].fields.Billcountry)) {
                                    templateObject.isSameAddress.set(true);
                                    templateObject.isJobSameAddress.set(true);
                                }
                                setTimeout(function () {
                                    $('#sltPreferedPayment').val(useData[i].fields.PaymentMethodName);
                                    $('#sltTerms').val(lineItemObj.terms);
                                    $('#sltCustomerType').val(lineItemObj.custometype);
                                    $('#sltTaxCode').val(lineItemObj.taxcode);
                                    $('#sltJobPreferedPayment').val(lineItemObj.jobpreferedpayment);
                                    $('#sltJobTerms').val(lineItemObj.jobterms);
                                    $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
                                    $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);
                                    $('.customerTypeSelect').append('<option value="newCust">Add Customer Type</option>');
                                    $('#sltCustomerType').prepend('<option value="' + lineItemObj.custometype + '" selected>' + lineItemObj.custometype + '</option>');
                                    if (currentId.transTab == 'active') {
                                        $('.customerTab').removeClass('active');
                                        $('.transactionTab').trigger('click');
                                    }else if (currentId.transTab == 'job') {
                                        $('.customerTab').removeClass('active');
                                        $('.jobTab').trigger('click');
                                    }else{
                                        $('.customerTab').addClass('active');
                                        $('.customerTab').trigger('click');
                                    }
                                },1000);
                                //let attachmentData =  contactService.getCustomerAttachmentList(useData[i].fields.ID);
                                templateObject.getOverviewARData(useData[i].fields.ClientName);
                                templateObject.records.set(lineItemObj);

                                /* START attachment */
                                templateObject.attachmentCount.set(0);
                                if (useData[i].fields.Attachments) {
                                    if (useData[i].fields.Attachments.length) {
                                        templateObject.attachmentCount.set(useData[i].fields.Attachments.length);
                                        templateObject.uploadedFiles.set(useData[i].fields.Attachments);

                                    }
                                }
                                /* END  attachment */

                                templateObject.isJob.set(useData[i].fields.IsJob);
                                templateObject.getAllProductRecentTransactions(useData[i].fields.ClientName);
                                templateObject.getAllCustomerJobs(useData[i].fields.ClientName);
                                //templateObject.uploadedFiles.set(attachmentData);
                                // $('.fullScreenSpin').css('display','none');
                                setTimeout(function () {
                                    var rowCount = $('.results tbody tr').length;
                                    $('.counter').text(rowCount + ' items');
                                }, 500);
                            }
                        }
                        if (!added) {
                            contactService.getOneCustomerDataEx(customerID).then(function (data) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];

                                let lineItemObj = {
                                    id: data.fields.ID || '',
                                    lid: 'Edit Customer',
                                    isjob: data.fields.IsJob || '',
                                    issupplier: data.fields.IsSupplier || false,
                                    iscustomer: data.fields.IsCustomer || false,
                                    company: data.fields.ClientName || '',
                                    email: data.fields.Email || '',
                                    title: data.fields.Title || '',
                                    firstname: data.fields.FirstName || '',
                                    middlename: data.fields.CUSTFLD10 || '',
                                    lastname: data.fields.LastName || '',
                                    tfn: '' || '',
                                    phone: data.fields.Phone || '',
                                    mobile: data.fields.Mobile || '',
                                    fax: data.fields.Faxnumber || '',
                                    skype: data.fields.SkypeName || '',
                                    website: data.fields.URL || '',
                                    shippingaddress: data.fields.Street || '',
                                    scity: data.fields.Street2 || '',
                                    sstate: data.fields.State || '',
                                    spostalcode: data.fields.Postcode || '',
                                    scountry: data.fields.Country || LoggedCountry,
                                    billingaddress: data.fields.BillStreet || '',
                                    bcity: data.fields.BillStreet2 || '',
                                    bstate: data.fields.BillState || '',
                                    bpostalcode: data.fields.BillPostcode || '',
                                    bcountry: data.fields.Billcountry || '',
                                    notes: data.fields.Notes || '',
                                    preferedpayment: data.fields.PaymentMethodName || '',
                                    terms: data.fields.TermsName || '',
                                    deliverymethod: data.fields.ShippingMethodName || '',
                                    clienttype: data.fields.ClientTypeName || '',
                                    openingbalance: data.fields.RewardPointsOpeningBalance || 0.00,
                                    openingbalancedate: data.fields.RewardPointsOpeningDate ? moment(data.fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                                    taxcode: data.fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                                    custfield1: data.fields.CUSTFLD1 || '',
                                    custfield2: data.fields.CUSTFLD2 || '',
                                    custfield3: data.fields.CUSTFLD3 || '',
                                    custfield4: data.fields.CUSTFLD4 || '',
                                    jobcompany: data.fields.ClientName || '',
                                    jobCompanyParent: data.fields.ClientName || '',
                                    jobemail: data.fields.Email || '',
                                    jobtitle: data.fields.Title || '',
                                    jobfirstname: data.fields.FirstName || '',
                                    jobmiddlename: data.fields.CUSTFLD10 || '',
                                    joblastname: data.fields.LastName || '',
                                    jobtfn: '' || '',
                                    jobphone: data.fields.Phone || '',
                                    jobmobile: data.fields.Mobile || '',
                                    jobfax: data.fields.Faxnumber || '',
                                    jobskype: data.fields.SkypeName || '',
                                    jobwebsite: data.fields.CUSTFLD9 || '',
                                    jobshippingaddress: data.fields.Street || '',
                                    jobscity: data.fields.Street2 || '',
                                    jobsstate: data.fields.State || '',
                                    jobspostalcode: data.fields.Postcode || '',
                                    jobscountry: data.fields.Country || LoggedCountry,
                                    jobbillingaddress: data.fields.BillStreet || '',
                                    jobbcity: data.fields.BillStreet2 || '',
                                    jobbstate: data.fields.BillState || '',
                                    jobbpostalcode: data.fields.BillPostcode || '',
                                    jobbcountry: data.fields.Billcountry || '',
                                    jobnotes: data.fields.Notes || '',
                                    jobpreferedpayment: data.fields.PaymentMethodName || '',
                                    jobterms: data.fields.TermsName || '',
                                    jobdeliverymethod: data.fields.ShippingMethodName || '',
                                    jobopeningbalance: data.fields.RewardPointsOpeningBalance || 0.00,
                                    jobopeningbalancedate: data.fields.RewardPointsOpeningDate ? moment(data.fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                                    jobtaxcode: data.fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                                    jobcustFld1: '' || '',
                                    jobcustFld2: '' || '',
                                    job_Title: '',
                                    jobName: '',
                                    jobNumber: '',
                                    jobRegistration: '',
                                    discount:data.fields.Discount || 0,
                                    jobclienttype:data.fields.ClientTypeName || ''

                                }

                                if ((data.fields.Street == data.fields.BillStreet) && (data.fields.Street2 == data.fields.BillStreet2)
                                    && (data.fields.State == data.fields.BillState) && (data.fields.Postcode == data.fields.Postcode)
                                    && (data.fields.Country == data.fields.Billcountry)) {
                                    templateObject.isSameAddress.set(true);
                                }
                                $('#sltCustomerType').prepend('<option value="' + lineItemObj.custometype + '">' + lineItemObj.custometype + '</option>');
                                $('#sltCustomerType').append(' <option value="newCust"><span class="addType">Add Customer Type</span></option>');
                                //let attachmentData =  contactService.getCustomerAttachmentList(data.fields.ID);
                                templateObject.getOverviewARData(data.fields.ClientName);
                                templateObject.records.set(lineItemObj);

                                /* START attachment */
                                templateObject.attachmentCount.set(0);
                                if (data.fields.Attachments) {
                                    if (data.fields.Attachments.length) {
                                        templateObject.attachmentCount.set(data.fields.Attachments.length);
                                        templateObject.uploadedFiles.set(data.fields.Attachments);

                                    }
                                }
                                /* END  attachment */

                                templateObject.isJob.set(data.fields.IsJob);
                                templateObject.getAllProductRecentTransactions(data.fields.ClientName);
                                templateObject.getAllCustomerJobs(data.fields.ClientName);
                                //templateObject.uploadedFiles.set(attachmentData);
                                // $('.fullScreenSpin').css('display','none');
                                setTimeout(function () {
                                  $('#sltPreferedPayment').val(lineItemObj.preferedpayment);
                                  $('#sltTerms').val(lineItemObj.terms);
                                  $('#sltCustomerType').val(lineItemObj.custometype);
                                  $('#sltTaxCode').val(lineItemObj.taxcode);
                                  $('#sltJobPreferedPayment').val(lineItemObj.jobpreferedpayment);
                                  $('#sltJobTerms').val(lineItemObj.jobterms);
                                  $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
                                  $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);
                                    var rowCount = $('.results tbody tr').length;
                                    $('.counter').text(rowCount + ' items');
                                    if (currentId.transTab == 'active') {
                                        $('.customerTab').removeClass('active');
                                        $('.transactionTab').trigger('click');
                                    }else if (currentId.transTab == 'job') {
                                        $('.customerTab').removeClass('active');
                                        $('.jobTab').trigger('click');
                                    }else{
                                        $('.customerTab').addClass('active');
                                        $('.customerTab').trigger('click');
                                    }
                                }, 1000);
                            });
                        }
                    }
                }).catch(function (err) {
                    contactService.getOneCustomerDataEx(customerID).then(function (data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];

                        let lineItemObj = {
                            id: data.fields.ID || '',
                            lid: 'Edit Customer',
                            isjob: data.fields.IsJob || '',
                            issupplier: data.fields.IsSupplier || false,
                            iscustomer: data.fields.IsCustomer || false,
                            company: data.fields.ClientName || '',
                            email: data.fields.Email || '',
                            title: data.fields.Title || '',
                            firstname: data.fields.FirstName || '',
                            middlename: data.fields.CUSTFLD10 || '',
                            lastname: data.fields.LastName || '',
                            tfn: '' || '',
                            phone: data.fields.Phone || '',
                            mobile: data.fields.Mobile || '',
                            fax: data.fields.Faxnumber || '',
                            skype: data.fields.SkypeName || '',
                            website: data.fields.URL || '',
                            shippingaddress: data.fields.Street || '',
                            scity: data.fields.Street2 || '',
                            sstate: data.fields.State || '',
                            spostalcode: data.fields.Postcode || '',
                            scountry: data.fields.Country || LoggedCountry,
                            billingaddress: data.fields.BillStreet || '',
                            bcity: data.fields.BillStreet2 || '',
                            bstate: data.fields.BillState || '',
                            bpostalcode: data.fields.BillPostcode || '',
                            bcountry: data.fields.Billcountry || '',
                            notes: data.fields.Notes || '',
                            preferedpayment: data.fields.PaymentMethodName || '',
                            terms: data.fields.TermsName || '',
                            deliverymethod: data.fields.ShippingMethodName || '',
                            clienttype: data.fields.ClientTypeName || '',
                            openingbalance: data.fields.RewardPointsOpeningBalance || 0.00,
                            openingbalancedate: data.fields.RewardPointsOpeningDate ? moment(data.fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                            taxcode: data.fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                            custfield1: data.fields.CUSTFLD1 || '',
                            custfield2: data.fields.CUSTFLD2 || '',
                            custfield3: data.fields.CUSTFLD3 || '',
                            custfield4: data.fields.CUSTFLD4 || '',
                            jobcompany: data.fields.ClientName || '',
                            jobCompanyParent: data.fields.ClientName || '',
                            jobemail: data.fields.Email || '',
                            jobtitle: data.fields.Title || '',
                            jobfirstname: data.fields.FirstName || '',
                            jobmiddlename: data.fields.CUSTFLD10 || '',
                            joblastname: data.fields.LastName || '',
                            jobtfn: '' || '',
                            jobphone: data.fields.Phone || '',
                            jobmobile: data.fields.Mobile || '',
                            jobfax: data.fields.Faxnumber || '',
                            jobskype: data.fields.SkypeName || '',
                            jobwebsite: data.fields.CUSTFLD9 || '',
                            jobshippingaddress: data.fields.Street || '',
                            jobscity: data.fields.Street2 || '',
                            jobsstate: data.fields.State || '',
                            jobspostalcode: data.fields.Postcode || '',
                            jobscountry: data.fields.Country || LoggedCountry,
                            jobbillingaddress: data.fields.BillStreet || '',
                            jobbcity: data.fields.BillStreet2 || '',
                            jobbstate: data.fields.BillState || '',
                            jobbpostalcode: data.fields.BillPostcode || '',
                            jobbcountry: data.fields.Billcountry || '',
                            jobnotes: data.fields.Notes || '',
                            jobpreferedpayment: data.fields.PaymentMethodName || '',
                            jobterms: data.fields.TermsName || '',
                            jobdeliverymethod: data.fields.ShippingMethodName || '',
                            jobopeningbalance: data.fields.RewardPointsOpeningBalance || 0.00,
                            jobopeningbalancedate: data.fields.RewardPointsOpeningDate ? moment(data.fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                            jobtaxcode: data.fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                            jobcustFld1: '' || '',
                            jobcustFld2: '' || '',
                            job_Title: '',
                            jobName: '',
                            jobNumber: '',
                            jobRegistration: '',
                            discount:data.fields.Discount || 0,
                            jobclienttype:data.fields.ClientTypeName || ''

                        }

                        if ((data.fields.Street == data.fields.BillStreet) && (data.fields.Street2 == data.fields.BillStreet2)
                            && (data.fields.State == data.fields.BillState) && (data.fields.Postcode == data.fields.Postcode)
                            && (data.fields.Country == data.fields.Billcountry)) {
                            templateObject.isSameAddress.set(true);
                        }
                        //let attachmentData =  contactService.getCustomerAttachmentList(data.fields.ID);
                        templateObject.getOverviewARData(data.fields.ClientName);
                        templateObject.records.set(lineItemObj);

                        /* START attachment */
                        templateObject.attachmentCount.set(0);
                        if (data.fields.Attachments) {
                            if (data.fields.Attachments.length) {
                                templateObject.attachmentCount.set(data.fields.Attachments.length);
                                templateObject.uploadedFiles.set(data.fields.Attachments);

                            }
                        }
                        /* END  attachment */

                        templateObject.isJob.set(data.fields.IsJob);
                        templateObject.getAllProductRecentTransactions(data.fields.ClientName);
                        templateObject.getAllCustomerJobs(data.fields.ClientName);
                        //templateObject.uploadedFiles.set(attachmentData);
                        // $('.fullScreenSpin').css('display','none');
                        setTimeout(function () {
                          $('#sltPreferedPayment').val(lineItemObj.preferedpayment);
                          $('#sltTerms').val(lineItemObj.terms);
                          $('#sltCustomerType').val(lineItemObj.custometype);
                          $('#sltTaxCode').val(lineItemObj.taxcode);
                          $('#sltJobPreferedPayment').val(lineItemObj.jobpreferedpayment);
                          $('#sltJobTerms').val(lineItemObj.jobterms);
                          $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
                          $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);
                            var rowCount = $('.results tbody tr').length;
                            $('.counter').text(rowCount + ' items');
                            if (currentId.transTab == 'active') {
                                $('.customerTab').removeClass('active');
                                $('.transactionTab').trigger('click');
                            }else if (currentId.transTab == 'job') {
                                $('.customerTab').removeClass('active');
                                $('.jobTab').trigger('click');
                            }else{
                                $('.customerTab').addClass('active');
                                $('.customerTab').trigger('click');
                            }
                        }, 1000);
                    });
                });

            }

            templateObject.getEmployeeData();
        } else if((currentId.name)){
          customerID = currentId.name.replace(/%20/g, " ");
          templateObject.getEmployeeData = function () {
              getVS1Data('TCustomerVS1').then(function (dataObject) {
                  if (dataObject.length == 0) {
                    contactService.getOneCustomerDataExByName(customerID).then(function (data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];

                        let lineItemObj = {
                            id: data.tcustomer[0].fields.ID || '',
                            lid: 'Edit Customer',
                            isjob: data.tcustomer[0].fields.IsJob || '',
                            issupplier: data.tcustomer[0].fields.IsSupplier || false,
                            iscustomer: data.tcustomer[0].fields.IsCustomer || false,
                            company: data.tcustomer[0].fields.ClientName || '',
                            email: data.tcustomer[0].fields.Email || '',
                            title: data.tcustomer[0].fields.Title || '',
                            firstname: data.tcustomer[0].fields.FirstName || '',
                            middlename: data.tcustomer[0].fields.CUSTFLD10 || '',
                            lastname: data.tcustomer[0].fields.LastName || '',
                            tfn: '' || '',
                            phone: data.tcustomer[0].fields.Phone || '',
                            mobile: data.tcustomer[0].fields.Mobile || '',
                            fax: data.tcustomer[0].fields.Faxnumber || '',
                            skype: data.tcustomer[0].fields.SkypeName || '',
                            website: data.tcustomer[0].fields.URL || '',
                            shippingaddress: data.tcustomer[0].fields.Street || '',
                            scity: data.tcustomer[0].fields.Street2 || '',
                            sstate: data.tcustomer[0].fields.State || '',
                            spostalcode: data.tcustomer[0].fields.Postcode || '',
                            scountry: data.tcustomer[0].fields.Country || LoggedCountry,
                            billingaddress: data.tcustomer[0].fields.BillStreet || '',
                            bcity: data.tcustomer[0].fields.BillStreet2 || '',
                            bstate: data.tcustomer[0].fields.BillState || '',
                            bpostalcode: data.tcustomer[0].fields.BillPostcode || '',
                            bcountry: data.tcustomer[0].fields.Billcountry || '',
                            notes: data.tcustomer[0].fields.Notes || '',
                            preferedpayment: data.tcustomer[0].fields.PaymentMethodName || '',
                            terms: data.tcustomer[0].fields.TermsName || '',
                            deliverymethod: data.tcustomer[0].fields.ShippingMethodName || '',
                            clienttype: data.tcustomer[0].fields.ClientTypeName || '',
                            openingbalance: data.tcustomer[0].fields.RewardPointsOpeningBalance || 0.00,
                            openingbalancedate: data.tcustomer[0].fields.RewardPointsOpeningDate ? moment(data.tcustomer[0].fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                            taxcode: data.tcustomer[0].fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                            custfield1: data.tcustomer[0].fields.CUSTFLD1 || '',
                            custfield2: data.tcustomer[0].fields.CUSTFLD2 || '',
                            custfield3: data.tcustomer[0].fields.CUSTFLD3 || '',
                            custfield4: data.tcustomer[0].fields.CUSTFLD4 || '',
                            jobcompany: data.tcustomer[0].fields.ClientName || '',
                            jobCompanyParent: data.tcustomer[0].fields.ClientName || '',
                            jobemail: data.tcustomer[0].fields.Email || '',
                            jobtitle: data.tcustomer[0].fields.Title || '',
                            jobfirstname: data.tcustomer[0].fields.FirstName || '',
                            jobmiddlename: data.tcustomer[0].fields.CUSTFLD10 || '',
                            joblastname: data.tcustomer[0].fields.LastName || '',
                            jobtfn: '' || '',
                            jobphone: data.tcustomer[0].fields.Phone || '',
                            jobmobile: data.tcustomer[0].fields.Mobile || '',
                            jobfax: data.tcustomer[0].fields.Faxnumber || '',
                            jobskype: data.tcustomer[0].fields.SkypeName || '',
                            jobwebsite: data.tcustomer[0].fields.CUSTFLD9 || '',
                            jobshippingaddress: data.tcustomer[0].fields.Street || '',
                            jobscity: data.tcustomer[0].fields.Street2 || '',
                            jobsstate: data.tcustomer[0].fields.State || '',
                            jobspostalcode: data.tcustomer[0].fields.Postcode || '',
                            jobscountry: data.tcustomer[0].fields.Country || LoggedCountry,
                            jobbillingaddress: data.tcustomer[0].fields.BillStreet || '',
                            jobbcity: data.tcustomer[0].fields.BillStreet2 || '',
                            jobbstate: data.tcustomer[0].fields.BillState || '',
                            jobbpostalcode: data.tcustomer[0].fields.BillPostcode || '',
                            jobbcountry: data.tcustomer[0].fields.Billcountry || '',
                            jobnotes: data.tcustomer[0].fields.Notes || '',
                            jobpreferedpayment: data.tcustomer[0].fields.PaymentMethodName || '',
                            jobterms: data.tcustomer[0].fields.TermsName || '',
                            jobdeliverymethod: data.tcustomer[0].fields.ShippingMethodName || '',
                            jobopeningbalance: data.tcustomer[0].fields.RewardPointsOpeningBalance || 0.00,
                            jobopeningbalancedate: data.tcustomer[0].fields.RewardPointsOpeningDate ? moment(data.tcustomer[0].fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                            jobtaxcode: data.tcustomer[0].fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                            jobcustFld1: '' || '',
                            jobcustFld2: '' || '',
                            job_Title: '',
                            jobName: '',
                            jobNumber: '',
                            jobRegistration: '',
                            discount:data.tcustomer[0].fields.Discount || 0,
                            jobclienttype:data.tcustomer[0].fields.ClientTypeName || ''

                        }

                        if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2)
                            && (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.Postcode)
                            && (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                            templateObject.isSameAddress.set(true);
                        }
                        $('#sltCustomerType').prepend('<option value="' + lineItemObj.custometype + '">' + lineItemObj.custometype + '</option>');
                        $('#sltCustomerType').append(' <option value="newCust"><span class="addType">Add Customer Type</span></option>');
                        //let attachmentData =  contactService.getCustomerAttachmentList(data.fields.ID);
                        templateObject.getOverviewARData(data.tcustomer[0].fields.ClientName);
                        templateObject.records.set(lineItemObj);

                        /* START attachment */
                        templateObject.attachmentCount.set(0);
                        if (data.fields.Attachments) {
                            if (data.fields.Attachments.length) {
                                templateObject.attachmentCount.set(data.tcustomer[0].fields.Attachments.length);
                                templateObject.uploadedFiles.set(data.tcustomer[0].fields.Attachments);

                            }
                        }
                        /* END  attachment */

                        templateObject.isJob.set(data.tcustomer[0].fields.IsJob);
                        templateObject.getAllProductRecentTransactions(data.tcustomer[0].fields.ClientName);
                        templateObject.getAllCustomerJobs(data.tcustomer[0].fields.ClientName);

                        setTimeout(function () {
                          $('#sltPreferedPayment').val(lineItemObj.preferedpayment);
                          $('#sltTerms').val(lineItemObj.terms);
                          $('#sltCustomerType').val(lineItemObj.custometype);
                          $('#sltTaxCode').val(lineItemObj.taxcode);
                          $('#sltJobPreferedPayment').val(lineItemObj.jobpreferedpayment);
                          $('#sltJobTerms').val(lineItemObj.jobterms);
                          $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
                          $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);
                            var rowCount = $('.results tbody tr').length;
                            $('.counter').text(rowCount + ' items');
                            if (currentId.transTab == 'active') {
                                $('.customerTab').removeClass('active');
                                $('.transactionTab').trigger('click');
                            }else if (currentId.transTab == 'job') {
                                $('.customerTab').removeClass('active');
                                $('.jobTab').trigger('click');
                            }else{
                                $('.customerTab').addClass('active');
                                $('.customerTab').trigger('click');
                            }
                        }, 1000);
                    }).catch(function (err) {
                      $('.fullScreenSpin').css('display', 'none');
                    });
                  } else {
                      let data = JSON.parse(dataObject[0].data);
                      let useData = data.tcustomervs1;

                      var added = false;
                      for (let i = 0; i < useData.length; i++) {
                          if (useData[i].fields.ClientName === customerID) {
                              let lineItems = [];
                              added = true;
                              $('.fullScreenSpin').css('display', 'none');
                              let lineItemObj = {
                                  id: useData[i].fields.ID || '',
                                  lid: 'Edit Customer',
                                  isjob: useData[i].fields.IsJob || '',
                                  issupplier: useData[i].fields.IsSupplier || false,
                                  iscustomer: useData[i].fields.IsCustomer || false,
                                  company: useData[i].fields.ClientName || '',
                                  email: useData[i].fields.Email || '',
                                  title: useData[i].fields.Title || '',
                                  firstname: useData[i].fields.FirstName || '',
                                  middlename: useData[i].fields.CUSTFLD10 || '',
                                  lastname: useData[i].fields.LastName || '',
                                  tfn: '' || '',
                                  phone: useData[i].fields.Phone || '',
                                  mobile: useData[i].fields.Mobile || '',
                                  fax: useData[i].fields.Faxnumber || '',
                                  custometype: useData[i].fields.ClientTypeName || '',
                                  skype: useData[i].fields.SkypeName || '',
                                  website: useData[i].fields.URL || '',
                                  shippingaddress: useData[i].fields.Street || '',
                                  scity: useData[i].fields.Street2 || '',
                                  sstate: useData[i].fields.State || '',
                                  spostalcode: useData[i].fields.Postcode || '',
                                  scountry: useData[i].fields.Country || LoggedCountry,
                                  billingaddress: useData[i].fields.BillStreet || '',
                                  bcity: useData[i].fields.BillStreet2 || '',
                                  bstate: useData[i].fields.BillState || '',
                                  bpostalcode: useData[i].fields.BillPostcode || '',
                                  bcountry: useData[i].fields.Billcountry || '',
                                  notes: useData[i].fields.Notes || '',
                                  preferedpayment: useData[i].fields.PaymentMethodName || '',
                                  terms: useData[i].fields.TermsName || '',
                                  deliverymethod: useData[i].fields.ShippingMethodName || '',
                                  clienttype: useData[i].fields.ClientTypeName || '',
                                  openingbalance: useData[i].fields.RewardPointsOpeningBalance || 0.00,
                                  openingbalancedate: useData[i].fields.RewardPointsOpeningDate ? moment(useData[i].fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                                  taxcode: useData[i].fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                                  custfield1: useData[i].fields.CUSTFLD1 || '',
                                  custfield2: useData[i].fields.CUSTFLD2 || '',
                                  custfield3: useData[i].fields.CUSTFLD3 || '',
                                  custfield4: useData[i].fields.CUSTFLD4 || '',
                                  jobcompany: useData[i].fields.ClientName || '',
                                  jobCompanyParent: useData[i].fields.ClientName || '',
                                  jobemail: useData[i].fields.Email || '',
                                  jobtitle: useData[i].fields.Title || '',
                                  jobfirstname: useData[i].fields.FirstName || '',
                                  jobmiddlename: useData[i].fields.CUSTFLD10 || '',
                                  joblastname: useData[i].fields.LastName || '',
                                  jobtfn: '' || '',
                                  jobphone: useData[i].fields.Phone || '',
                                  jobmobile: useData[i].fields.Mobile || '',
                                  jobfax: useData[i].fields.Faxnumber || '',
                                  jobskype: useData[i].fields.SkypeName || '',
                                  jobwebsite: useData[i].fields.CUSTFLD9 || '',
                                  jobshippingaddress: useData[i].fields.Street || '',
                                  jobscity: useData[i].fields.Street2 || '',
                                  jobsstate: useData[i].fields.State || '',
                                  jobspostalcode: useData[i].fields.Postcode || '',
                                  jobscountry: useData[i].fields.Country || LoggedCountry,
                                  jobbillingaddress: useData[i].fields.BillStreet || '',
                                  jobbcity: useData[i].fields.BillStreet2 || '',
                                  jobbstate: useData[i].fields.BillState || '',
                                  jobbpostalcode: useData[i].fields.BillPostcode || '',
                                  jobbcountry: useData[i].fields.Billcountry || '',
                                  jobnotes: useData[i].fields.Notes || '',
                                  jobpreferedpayment: useData[i].fields.PaymentMethodName || '',
                                  jobterms: useData[i].fields.TermsName || '',
                                  jobdeliverymethod: useData[i].fields.ShippingMethodName || '',
                                  jobopeningbalance: useData[i].fields.RewardPointsOpeningBalance || 0.00,
                                  jobopeningbalancedate: useData[i].fields.RewardPointsOpeningDate ? moment(useData[i].fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                                  jobtaxcode: useData[i].fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                                  jobcustFld1: '' || '',
                                  jobcustFld2: '' || '',
                                  job_Title: '',
                                  jobName: '',
                                  jobNumber: '',
                                  jobRegistration: '',
                                  discount:useData[i].fields.Discount || 0,
                                  jobclienttype:useData[i].fields.ClientTypeName || ''

                              }

                              if ((useData[i].fields.Street == useData[i].fields.BillStreet) && (useData[i].fields.Street2 == useData[i].fields.BillStreet2)
                                  && (useData[i].fields.State == useData[i].fields.BillState) && (useData[i].fields.Postcode == useData[i].fields.BillPostcode)
                                  && (useData[i].fields.Country == useData[i].fields.Billcountry)) {
                                  templateObject.isSameAddress.set(true);
                                  templateObject.isJobSameAddress.set(true);
                              }
                              setTimeout(function () {
                                $('#sltPreferedPayment').val(lineItemObj.preferedpayment);
                                $('#sltTerms').val(lineItemObj.terms);
                                $('#sltCustomerType').val(lineItemObj.custometype);
                                $('#sltTaxCode').val(lineItemObj.taxcode);
                                $('#sltJobPreferedPayment').val(lineItemObj.jobpreferedpayment);
                                $('#sltJobTerms').val(lineItemObj.jobterms);
                                $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
                                $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);
                                  $('.customerTypeSelect').append('<option value="newCust">Add Customer Type</option>');
                                  $('#sltCustomerType').prepend('<option value="' + lineItemObj.custometype + '" selected>' + lineItemObj.custometype + '</option>');
                                  if (currentId.transTab == 'active') {
                                      $('.customerTab').removeClass('active');
                                      $('.transactionTab').trigger('click');
                                  }else if (currentId.transTab == 'job') {
                                      $('.customerTab').removeClass('active');
                                      $('.jobTab').trigger('click');
                                  }else{
                                      $('.customerTab').addClass('active');
                                      $('.customerTab').trigger('click');
                                  }
                              },1000)
                              //let attachmentData =  contactService.getCustomerAttachmentList(useData[i].fields.ID);
                              templateObject.getOverviewARData(useData[i].fields.ClientName);
                              templateObject.records.set(lineItemObj);

                              /* START attachment */
                              templateObject.attachmentCount.set(0);
                              if (useData[i].fields.Attachments) {
                                  if (useData[i].fields.Attachments.length) {
                                      templateObject.attachmentCount.set(useData[i].fields.Attachments.length);
                                      templateObject.uploadedFiles.set(useData[i].fields.Attachments);

                                  }
                              }
                              /* END  attachment */

                              templateObject.isJob.set(useData[i].fields.IsJob);
                              templateObject.getAllProductRecentTransactions(useData[i].fields.ClientName);
                              templateObject.getAllCustomerJobs(useData[i].fields.ClientName);
                              //templateObject.uploadedFiles.set(attachmentData);
                              // $('.fullScreenSpin').css('display','none');
                              setTimeout(function () {
                                  var rowCount = $('.results tbody tr').length;
                                  $('.counter').text(rowCount + ' items');
                              }, 500);
                          }
                      }
                      if (!added) {
                          contactService.getOneCustomerDataExByName(customerID).then(function (data) {
                              $('.fullScreenSpin').css('display', 'none');
                              let lineItems = [];

                              let lineItemObj = {
                                  id: data.tcustomer[0].fields.ID || '',
                                  lid: 'Edit Customer',
                                  isjob: data.tcustomer[0].fields.IsJob || '',
                                  issupplier: data.tcustomer[0].fields.IsSupplier || false,
                                  iscustomer: data.tcustomer[0].fields.IsCustomer || false,
                                  company: data.tcustomer[0].fields.ClientName || '',
                                  email: data.tcustomer[0].fields.Email || '',
                                  title: data.tcustomer[0].fields.Title || '',
                                  firstname: data.tcustomer[0].fields.FirstName || '',
                                  middlename: data.tcustomer[0].fields.CUSTFLD10 || '',
                                  lastname: data.tcustomer[0].fields.LastName || '',
                                  tfn: '' || '',
                                  phone: data.tcustomer[0].fields.Phone || '',
                                  mobile: data.tcustomer[0].fields.Mobile || '',
                                  fax: data.tcustomer[0].fields.Faxnumber || '',
                                  skype: data.tcustomer[0].fields.SkypeName || '',
                                  website: data.tcustomer[0].fields.URL || '',
                                  shippingaddress: data.tcustomer[0].fields.Street || '',
                                  scity: data.tcustomer[0].fields.Street2 || '',
                                  sstate: data.tcustomer[0].fields.State || '',
                                  spostalcode: data.tcustomer[0].fields.Postcode || '',
                                  scountry: data.tcustomer[0].fields.Country || LoggedCountry,
                                  billingaddress: data.tcustomer[0].fields.BillStreet || '',
                                  bcity: data.tcustomer[0].fields.BillStreet2 || '',
                                  bstate: data.tcustomer[0].fields.BillState || '',
                                  bpostalcode: data.tcustomer[0].fields.BillPostcode || '',
                                  bcountry: data.tcustomer[0].fields.Billcountry || '',
                                  notes: data.tcustomer[0].fields.Notes || '',
                                  preferedpayment: data.tcustomer[0].fields.PaymentMethodName || '',
                                  terms: data.tcustomer[0].fields.TermsName || '',
                                  deliverymethod: data.tcustomer[0].fields.ShippingMethodName || '',
                                  clienttype: data.tcustomer[0].fields.ClientTypeName || '',
                                  openingbalance: data.tcustomer[0].fields.RewardPointsOpeningBalance || 0.00,
                                  openingbalancedate: data.tcustomer[0].fields.RewardPointsOpeningDate ? moment(data.tcustomer[0].fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                                  taxcode: data.tcustomer[0].fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                                  custfield1: data.tcustomer[0].fields.CUSTFLD1 || '',
                                  custfield2: data.tcustomer[0].fields.CUSTFLD2 || '',
                                  custfield3: data.tcustomer[0].fields.CUSTFLD3 || '',
                                  custfield4: data.tcustomer[0].fields.CUSTFLD4 || '',
                                  jobcompany: data.tcustomer[0].fields.ClientName || '',
                                  jobCompanyParent: data.tcustomer[0].fields.ClientName || '',
                                  jobemail: data.tcustomer[0].fields.Email || '',
                                  jobtitle: data.tcustomer[0].fields.Title || '',
                                  jobfirstname: data.tcustomer[0].fields.FirstName || '',
                                  jobmiddlename: data.tcustomer[0].fields.CUSTFLD10 || '',
                                  joblastname: data.tcustomer[0].fields.LastName || '',
                                  jobtfn: '' || '',
                                  jobphone: data.tcustomer[0].fields.Phone || '',
                                  jobmobile: data.tcustomer[0].fields.Mobile || '',
                                  jobfax: data.tcustomer[0].fields.Faxnumber || '',
                                  jobskype: data.tcustomer[0].fields.SkypeName || '',
                                  jobwebsite: data.tcustomer[0].fields.CUSTFLD9 || '',
                                  jobshippingaddress: data.tcustomer[0].fields.Street || '',
                                  jobscity: data.tcustomer[0].fields.Street2 || '',
                                  jobsstate: data.tcustomer[0].fields.State || '',
                                  jobspostalcode: data.tcustomer[0].fields.Postcode || '',
                                  jobscountry: data.tcustomer[0].fields.Country || LoggedCountry,
                                  jobbillingaddress: data.tcustomer[0].fields.BillStreet || '',
                                  jobbcity: data.tcustomer[0].fields.BillStreet2 || '',
                                  jobbstate: data.tcustomer[0].fields.BillState || '',
                                  jobbpostalcode: data.tcustomer[0].fields.BillPostcode || '',
                                  jobbcountry: data.tcustomer[0].fields.Billcountry || '',
                                  jobnotes: data.tcustomer[0].fields.Notes || '',
                                  jobpreferedpayment: data.tcustomer[0].fields.PaymentMethodName || '',
                                  jobterms: data.tcustomer[0].fields.TermsName || '',
                                  jobdeliverymethod: data.tcustomer[0].fields.ShippingMethodName || '',
                                  jobopeningbalance: data.tcustomer[0].fields.RewardPointsOpeningBalance || 0.00,
                                  jobopeningbalancedate: data.tcustomer[0].fields.RewardPointsOpeningDate ? moment(data.tcustomer[0].fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                                  jobtaxcode: data.tcustomer[0].fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                                  jobcustFld1: '' || '',
                                  jobcustFld2: '' || '',
                                  job_Title: '',
                                  jobName: '',
                                  jobNumber: '',
                                  jobRegistration: '',
                                  discount:data.tcustomer[0].fields.Discount || 0,
                                  jobclienttype:data.tcustomer[0].fields.ClientTypeName || ''

                              }

                              if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2)
                                  && (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.Postcode)
                                  && (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                                  templateObject.isSameAddress.set(true);
                              }
                              $('#sltCustomerType').prepend('<option value="' + lineItemObj.custometype + '">' + lineItemObj.custometype + '</option>');
                              $('#sltCustomerType').append(' <option value="newCust"><span class="addType">Add Customer Type</span></option>');
                              //let attachmentData =  contactService.getCustomerAttachmentList(data.fields.ID);
                              templateObject.getOverviewARData(data.tcustomer[0].fields.ClientName);
                              templateObject.records.set(lineItemObj);

                              /* START attachment */
                              templateObject.attachmentCount.set(0);
                              if (data.fields.Attachments) {
                                  if (data.fields.Attachments.length) {
                                      templateObject.attachmentCount.set(data.tcustomer[0].fields.Attachments.length);
                                      templateObject.uploadedFiles.set(data.tcustomer[0].fields.Attachments);

                                  }
                              }
                              /* END  attachment */

                              templateObject.isJob.set(data.tcustomer[0].fields.IsJob);
                              templateObject.getAllProductRecentTransactions(data.tcustomer[0].fields.ClientName);
                              templateObject.getAllCustomerJobs(data.tcustomer[0].fields.ClientName);

                              setTimeout(function () {
                                $('#sltPreferedPayment').val(lineItemObj.preferedpayment);
                                $('#sltTerms').val(lineItemObj.terms);
                                $('#sltCustomerType').val(lineItemObj.custometype);
                                $('#sltTaxCode').val(lineItemObj.taxcode);
                                $('#sltJobPreferedPayment').val(lineItemObj.jobpreferedpayment);
                                $('#sltJobTerms').val(lineItemObj.jobterms);
                                $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
                                $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);

                                  var rowCount = $('.results tbody tr').length;
                                  $('.counter').text(rowCount + ' items');
                                  if (currentId.transTab == 'active') {
                                      $('.customerTab').removeClass('active');
                                      $('.transactionTab').trigger('click');
                                  }else if (currentId.transTab == 'job') {
                                      $('.customerTab').removeClass('active');
                                      $('.jobTab').trigger('click');
                                  }else{
                                      $('.customerTab').addClass('active');
                                      $('.customerTab').trigger('click');
                                  }
                              }, 1000);
                          }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'none');
                          });
                      }
                  }
              }).catch(function (err) {
                contactService.getOneCustomerDataExByName(customerID).then(function (data) {
                    $('.fullScreenSpin').css('display', 'none');
                    let lineItems = [];

                    let lineItemObj = {
                        id: data.tcustomer[0].fields.ID || '',
                        lid: 'Edit Customer',
                        isjob: data.tcustomer[0].fields.IsJob || '',
                        issupplier: data.tcustomer[0].fields.IsSupplier || false,
                        iscustomer: data.tcustomer[0].fields.IsCustomer || false,
                        company: data.tcustomer[0].fields.ClientName || '',
                        email: data.tcustomer[0].fields.Email || '',
                        title: data.tcustomer[0].fields.Title || '',
                        firstname: data.tcustomer[0].fields.FirstName || '',
                        middlename: data.tcustomer[0].fields.CUSTFLD10 || '',
                        lastname: data.tcustomer[0].fields.LastName || '',
                        tfn: '' || '',
                        phone: data.tcustomer[0].fields.Phone || '',
                        mobile: data.tcustomer[0].fields.Mobile || '',
                        fax: data.tcustomer[0].fields.Faxnumber || '',
                        skype: data.tcustomer[0].fields.SkypeName || '',
                        website: data.tcustomer[0].fields.URL || '',
                        shippingaddress: data.tcustomer[0].fields.Street || '',
                        scity: data.tcustomer[0].fields.Street2 || '',
                        sstate: data.tcustomer[0].fields.State || '',
                        spostalcode: data.tcustomer[0].fields.Postcode || '',
                        scountry: data.tcustomer[0].fields.Country || LoggedCountry,
                        billingaddress: data.tcustomer[0].fields.BillStreet || '',
                        bcity: data.tcustomer[0].fields.BillStreet2 || '',
                        bstate: data.tcustomer[0].fields.BillState || '',
                        bpostalcode: data.tcustomer[0].fields.BillPostcode || '',
                        bcountry: data.tcustomer[0].fields.Billcountry || '',
                        notes: data.tcustomer[0].fields.Notes || '',
                        preferedpayment: data.tcustomer[0].fields.PaymentMethodName || '',
                        terms: data.tcustomer[0].fields.TermsName || '',
                        deliverymethod: data.tcustomer[0].fields.ShippingMethodName || '',
                        clienttype: data.tcustomer[0].fields.ClientTypeName || '',
                        openingbalance: data.tcustomer[0].fields.RewardPointsOpeningBalance || 0.00,
                        openingbalancedate: data.tcustomer[0].fields.RewardPointsOpeningDate ? moment(data.tcustomer[0].fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                        taxcode: data.tcustomer[0].fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                        custfield1: data.tcustomer[0].fields.CUSTFLD1 || '',
                        custfield2: data.tcustomer[0].fields.CUSTFLD2 || '',
                        custfield3: data.tcustomer[0].fields.CUSTFLD3 || '',
                        custfield4: data.tcustomer[0].fields.CUSTFLD4 || '',
                        jobcompany: data.tcustomer[0].fields.ClientName || '',
                        jobCompanyParent: data.tcustomer[0].fields.ClientName || '',
                        jobemail: data.tcustomer[0].fields.Email || '',
                        jobtitle: data.tcustomer[0].fields.Title || '',
                        jobfirstname: data.tcustomer[0].fields.FirstName || '',
                        jobmiddlename: data.tcustomer[0].fields.CUSTFLD10 || '',
                        joblastname: data.tcustomer[0].fields.LastName || '',
                        jobtfn: '' || '',
                        jobphone: data.tcustomer[0].fields.Phone || '',
                        jobmobile: data.tcustomer[0].fields.Mobile || '',
                        jobfax: data.tcustomer[0].fields.Faxnumber || '',
                        jobskype: data.tcustomer[0].fields.SkypeName || '',
                        jobwebsite: data.tcustomer[0].fields.CUSTFLD9 || '',
                        jobshippingaddress: data.tcustomer[0].fields.Street || '',
                        jobscity: data.tcustomer[0].fields.Street2 || '',
                        jobsstate: data.tcustomer[0].fields.State || '',
                        jobspostalcode: data.tcustomer[0].fields.Postcode || '',
                        jobscountry: data.tcustomer[0].fields.Country || LoggedCountry,
                        jobbillingaddress: data.tcustomer[0].fields.BillStreet || '',
                        jobbcity: data.tcustomer[0].fields.BillStreet2 || '',
                        jobbstate: data.tcustomer[0].fields.BillState || '',
                        jobbpostalcode: data.tcustomer[0].fields.BillPostcode || '',
                        jobbcountry: data.tcustomer[0].fields.Billcountry || '',
                        jobnotes: data.tcustomer[0].fields.Notes || '',
                        jobpreferedpayment: data.tcustomer[0].fields.PaymentMethodName || '',
                        jobterms: data.tcustomer[0].fields.TermsName || '',
                        jobdeliverymethod: data.tcustomer[0].fields.ShippingMethodName || '',
                        jobopeningbalance: data.tcustomer[0].fields.RewardPointsOpeningBalance || 0.00,
                        jobopeningbalancedate: data.tcustomer[0].fields.RewardPointsOpeningDate ? moment(data.tcustomer[0].fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                        jobtaxcode: data.tcustomer[0].fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                        jobcustFld1: '' || '',
                        jobcustFld2: '' || '',
                        job_Title: '',
                        jobName: '',
                        jobNumber: '',
                        jobRegistration: '',
                        discount:data.tcustomer[0].fields.Discount || 0,
                        jobclienttype:data.tcustomer[0].fields.ClientTypeName || ''

                    }

                    if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2)
                        && (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.Postcode)
                        && (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                        templateObject.isSameAddress.set(true);
                    }
                    $('#sltCustomerType').prepend('<option value="' + lineItemObj.custometype + '">' + lineItemObj.custometype + '</option>');
                    $('#sltCustomerType').append(' <option value="newCust"><span class="addType">Add Customer Type</span></option>');
                    //let attachmentData =  contactService.getCustomerAttachmentList(data.fields.ID);
                    templateObject.getOverviewARData(data.tcustomer[0].fields.ClientName);
                    templateObject.records.set(lineItemObj);

                    /* START attachment */
                    templateObject.attachmentCount.set(0);
                    if (data.fields.Attachments) {
                        if (data.fields.Attachments.length) {
                            templateObject.attachmentCount.set(data.tcustomer[0].fields.Attachments.length);
                            templateObject.uploadedFiles.set(data.tcustomer[0].fields.Attachments);

                        }
                    }
                    /* END  attachment */

                    templateObject.isJob.set(data.tcustomer[0].fields.IsJob);
                    templateObject.getAllProductRecentTransactions(data.tcustomer[0].fields.ClientName);
                    templateObject.getAllCustomerJobs(data.tcustomer[0].fields.ClientName);

                    setTimeout(function () {
                      $('#sltPreferedPayment').val(lineItemObj.preferedpayment);
                      $('#sltTerms').val(lineItemObj.terms);
                      $('#sltCustomerType').val(lineItemObj.custometype);
                      $('#sltTaxCode').val(lineItemObj.taxcode);
                      $('#sltJobPreferedPayment').val(lineItemObj.jobpreferedpayment);
                      $('#sltJobTerms').val(lineItemObj.jobterms);
                      $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
                      $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);

                        var rowCount = $('.results tbody tr').length;
                        $('.counter').text(rowCount + ' items');
                        if (currentId.transTab == 'active') {
                            $('.customerTab').removeClass('active');
                            $('.transactionTab').trigger('click');
                        }else if (currentId.transTab == 'job') {
                            $('.customerTab').removeClass('active');
                            $('.jobTab').trigger('click');
                        }else{
                            $('.customerTab').addClass('active');
                            $('.customerTab').trigger('click');
                        }
                    }, 1000);
                }).catch(function (err) {
                  $('.fullScreenSpin').css('display', 'none');
                });
              });

          }

          templateObject.getEmployeeData();
        }else if (!isNaN(currentId.jobid)) {
            customerID = currentId.jobid;
            templateObject.getEmployeeData = function () {
                getVS1Data('TJobVS1').then(function (dataObject) {
                    if (dataObject.length == 0) {
                        contactService.getOneCustomerJobDataEx(customerID).then(function (data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];

                            let lineItemObj = {
                                jobid: data.fields.ID || '',
                                joblid: 'Edit Job',
                                isjob: data.fields.IsJob || '',
                                issupplier: data.fields.IsSupplier || false,
                                iscustomer: data.fields.IsCustomer || false,
                                jobcompany: data.fields.ClientName || '',
                                jobCompanyParent: data.fields.ParentClientName || '',
                                jobemail: data.fields.Email || '',
                                jobtitle: data.fields.Title || '',
                                jobfirstname: data.fields.FirstName || '',
                                jobmiddlename: data.fields.MiddleName || '',
                                joblastname: data.fields.LastName || '',
                                jobtfn: '' || '',
                                jobphone: data.fields.Phone || '',
                                jobmobile: data.fields.Mobile || '',
                                jobfax: data.fields.Faxnumber || '',
                                jobskype: data.fields.SkypeName || '',
                                jobwebsite: data.fields.CUSTFLD9 || '',
                                jobshippingaddress: data.fields.Street || '',
                                jobscity: data.fields.Street2 || '',
                                jobsstate: data.fields.State || '',
                                jobspostalcode: data.fields.Postcode || '',
                                jobscountry: data.fields.Country || LoggedCountry,
                                jobbillingaddress: data.fields.BillStreet || '',
                                jobbcity: data.fields.BillStreet2 || '',
                                jobbstate: data.fields.BillState || '',
                                jobbpostalcode: data.fields.BillPostcode || '',
                                jobbcountry: data.fields.Billcountry || '',
                                jobnotes: data.fields.Notes || '',
                                jobpreferedpayment: data.fields.PaymentMethodName || '',
                                jobterms: data.fields.TermsName || templateObject.defaultsaleterm.get(),
                                jobdeliverymethod: data.fields.ShippingMethodName || '',
                                jobopeningbalance: data.fields.RewardPointsOpeningBalance || 0.00,
                                jobopeningbalancedate: data.fields.RewardPointsOpeningDate ? moment(data.fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                                jobtaxcode: data.fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                                jobcustFld1: '' || '',
                                jobcustFld2: '' || '',
                                job_Title: data.fields.JobTitle || '',
                                jobName: data.fields.JobName || '',
                                jobNumber: data.fields.JobNumber || '',
                                jobRegistration: data.fields.JobRegistration || '',
                                discount:0,
                                jobclienttype:data.fields.ClientTypeName || '',

                            }

                            if ((data.fields.Street == data.fields.BillStreet) && (data.fields.Street2 == data.fields.BillStreet2)
                                && (data.fields.State == data.fields.BillState) && (data.fields.Postcode == data.fields.Postcode)
                                && (data.fields.Country == data.fields.Billcountry)) {
                                templateObject.isJobSameAddress.set(true);
                            }
                            templateObject.records.set(lineItemObj);
                            templateObject.getOverviewARData(data.fields.ClientName);
                            /* START attachment */
                            templateObject.attachmentCountJobNoPOP.set(0);
                            // templateObject.uploadedFilesJobNoPOP.set('');
                            if (data.fields.Attachments) {
                                if (data.fields.Attachments.length) {
                                    templateObject.attachmentCountJobNoPOP.set(data.fields.Attachments.length);
                                    templateObject.uploadedFilesJobNoPOP.set(data.fields.Attachments);

                                }
                            }
                            /* END  attachment */

                            templateObject.isJob.set(data.fields.IsJob);
                            templateObject.getAllProductRecentTransactions(data.fields.ClientName);
                            templateObject.getAllCustomerJobs(data.fields.ClientName);
                            // $('.fullScreenSpin').css('display','none');

                            setTimeout(function () {
                              $('#sltJobPreferedPayment').val(data.fields.PaymentMethodName);
                              $('#sltJobTerms').val(data.fields.TermsName);
                              $('#sltJobCustomerType').val(data.fields.ClientTypeName);
                              $('#sltJobTaxCode').val(data.fields.TaxCodeName);
                            }, 1000);

                            setTimeout(function () {
                                var rowCount = $('.results tbody tr').length;
                                $('.counter').text(rowCount + ' items');
                                if (currentId.transTab == 'active') {
                                    $('.jobTab').removeClass('active');
                                    $('.transactionTab').trigger('click');
                                }else{
                                    $('.jobTab').addClass('active');
                                    $('.jobTab').trigger('click');
                                }

                                $('#sltJobPreferedPayment').val(lineItemObj.jobpreferedpayment);
                                $('#sltJobTerms').val(lineItemObj.jobterms);
                                $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
                                $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);
                            }, 500);
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tjobvs1;
                        var added = false;
                        for (let i = 0; i < useData.length; i++) {
                            if (parseInt(useData[i].fields.ID) === parseInt(customerID)) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                added = true;
                                let lineItemObj = {
                                    jobid: useData[i].fields.Id || '',
                                    joblid: 'Edit Job',
                                    isjob: useData[i].fields.IsJob || '',
                                    jobcompany: useData[i].fields.ClientName || '',
                                    jobCompanyParent: useData[i].fields.ParentClientName || '',
                                    jobemail: useData[i].fields.Email || '',
                                    jobtitle: useData[i].fields.Title || '',
                                    jobfirstname: useData[i].fields.FirstName || '',
                                    jobmiddlename: useData[i].fields.MiddleName || '',
                                    joblastname: useData[i].fields.LastName || '',
                                    jobtfn: '' || '',
                                    jobphone: useData[i].fields.Phone || '',
                                    jobmobile: useData[i].fields.Mobile || '',
                                    jobfax: useData[i].fields.Faxnumber || '',
                                    jobskype: useData[i].fields.SkypeName || '',
                                    jobwebsite: useData[i].fields.CUSTFLD9 || '',
                                    jobshippingaddress: useData[i].fields.Street || '',
                                    jobscity: useData[i].fields.Street2 || '',
                                    jobsstate: useData[i].fields.State || '',
                                    jobspostalcode: useData[i].fields.Postcode || '',
                                    jobscountry: useData[i].fields.Country || LoggedCountry,
                                    jobbillingaddress: useData[i].fields.BillStreet || '',
                                    jobbcity: useData[i].fields.BillStreet2 || '',
                                    jobbstate: useData[i].fields.BillState || '',
                                    jobbpostalcode: useData[i].fields.BillPostcode || '',
                                    jobbcountry: useData[i].fields.Billcountry || '',
                                    jobnotes: useData[i].fields.Notes || '',
                                    jobpreferedpayment: useData[i].fields.PaymentMethodName || '',
                                    jobterms: useData[i].fields.TermsName || templateObject.defaultsaleterm.get(),
                                    jobdeliverymethod: useData[i].fields.ShippingMethodName || '',
                                    jobopeningbalance: useData[i].fields.RewardPointsOpeningBalance || 0.00,
                                    jobopeningbalancedate: useData[i].fields.RewardPointsOpeningDate ? moment(useData[i].fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                                    jobtaxcode: useData[i].fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                                    jobcustFld1: '' || '',
                                    jobcustFld2: '' || '',
                                    job_Title: useData[i].fields.JobTitle || '',
                                    jobName: useData[i].fields.JobName || '',
                                    jobNumber: useData[i].fields.JobNumber || '',
                                    jobRegistration: useData[i].fields.JobRegistration || '',
                                    discount: 0,
                                    jobclienttype:useData[i].fields.ClientTypeName || ''

                                }

                                if ((useData[i].fields.Street == useData[i].fields.BillStreet) && (useData[i].fields.Street2 == useData[i].fields.BillStreet2)
                                    && (useData[i].fields.State == useData[i].fields.BillState) && (useData[i].fields.Postcode == useData[i].fields.Postcode)
                                    && (useData[i].fields.Country == useData[i].fields.Billcountry)) {
                                    templateObject.isJobSameAddress.set(true);
                                }
                                templateObject.records.set(lineItemObj);
                                templateObject.getOverviewARData(useData[i].fields.ClientName);
                                /* START attachment */
                                templateObject.attachmentCountJobNoPOP.set(0);
                                // templateObject.uploadedFilesJobNoPOP.set('');
                                if (useData[i].fields.Attachments) {
                                    if (useData[i].fields.Attachments.length) {
                                        templateObject.attachmentCountJobNoPOP.set(useData[i].fields.Attachments.length);
                                        templateObject.uploadedFilesJobNoPOP.set(useData[i].fields.Attachments);

                                    }
                                }
                                /* END  attachment */

                                templateObject.isJob.set(useData[i].fields.IsJob);
                                templateObject.getAllProductRecentTransactions(useData[i].fields.ClientName);
                                templateObject.getAllCustomerJobs(useData[i].fields.ClientName);

                                setTimeout(function () {
                                  $('#sltJobPreferedPayment').val(useData[i].fields.PaymentMethodName);
                                  $('#sltJobTerms').val(useData[i].fields.TermsName);
                                  $('#sltJobCustomerType').val(useData[i].fields.ClientTypeName);
                                  $('#sltJobTaxCode').val(useData[i].fields.TaxCodeName);
                                }, 1000);
                                // $('.fullScreenSpin').css('display','none');
                                setTimeout(function () {
                                    var rowCount = $('.results tbody tr').length;
                                    $('.counter').text(rowCount + ' items');

                                    if (currentId.transTab == 'active') {
                                        $('.jobTab').removeClass('active');
                                        $('.transactionTab').trigger('click');
                                    }else{
                                        $('.jobTab').addClass('active');
                                        $('.jobTab').trigger('click');
                                    }
                                    $('#sltJobPreferedPayment').val(lineItemObj.jobpreferedpayment);
                                    $('#sltJobTerms').val(lineItemObj.jobterms);
                                    $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
                                    $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);
                                }, 500);
                            }
                        }
                        if (!added) {
                            contactService.getOneCustomerJobDataEx(customerID).then(function (data) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];

                                let lineItemObj = {
                                    jobid: data.fields.ID || '',
                                    joblid: 'Edit Job',
                                    isjob: data.fields.IsJob || '',
                                    issupplier: data.fields.IsSupplier || false,
                                    iscustomer: data.fields.IsCustomer || false,
                                    jobcompany: data.fields.ClientName || '',
                                    jobCompanyParent: data.fields.ParentClientName || '',
                                    jobemail: data.fields.Email || '',
                                    jobtitle: data.fields.Title || '',
                                    jobfirstname: data.fields.FirstName || '',
                                    jobmiddlename: data.fields.MiddleName || '',
                                    joblastname: data.fields.LastName || '',
                                    jobtfn: '' || '',
                                    jobphone: data.fields.Phone || '',
                                    jobmobile: data.fields.Mobile || '',
                                    jobfax: data.fields.Faxnumber || '',
                                    jobskype: data.fields.SkypeName || '',
                                    jobwebsite: data.fields.CUSTFLD9 || '',
                                    jobshippingaddress: data.fields.Street || '',
                                    jobscity: data.fields.Street2 || '',
                                    jobsstate: data.fields.State || '',
                                    jobspostalcode: data.fields.Postcode || '',
                                    jobscountry: data.fields.Country || LoggedCountry,
                                    jobbillingaddress: data.fields.BillStreet || '',
                                    jobbcity: data.fields.BillStreet2 || '',
                                    jobbstate: data.fields.BillState || '',
                                    jobbpostalcode: data.fields.BillPostcode || '',
                                    jobbcountry: data.fields.Billcountry || '',
                                    jobnotes: data.fields.Notes || '',
                                    jobpreferedpayment: data.fields.PaymentMethodName || '',
                                    jobterms: data.fields.TermsName || '',
                                    jobdeliverymethod: data.fields.ShippingMethodName || '',
                                    jobopeningbalance: data.fields.RewardPointsOpeningBalance || 0.00,
                                    jobopeningbalancedate: data.fields.RewardPointsOpeningDate ? moment(data.fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                                    jobtaxcode: data.fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                                    jobcustFld1: '' || '',
                                    jobcustFld2: '' || '',
                                    job_Title: data.fields.JobTitle || '',
                                    jobName: data.fields.JobName || '',
                                    jobNumber: data.fields.JobNumber || '',
                                    jobRegistration: data.fields.JobRegistration || '',
                                    discount: 0,
                                    jobclienttype:data.fields.ClientTypeName || ''

                                }

                                if ((data.fields.Street == data.fields.BillStreet) && (data.fields.Street2 == data.fields.BillStreet2)
                                    && (data.fields.State == data.fields.BillState) && (data.fields.Postcode == data.fields.Postcode)
                                    && (data.fields.Country == data.fields.Billcountry)) {
                                    templateObject.isJobSameAddress.set(true);
                                }
                                templateObject.records.set(lineItemObj);
                                templateObject.getOverviewARData(data.fields.ClientName);
                                /* START attachment */
                                templateObject.attachmentCountJobNoPOP.set(0);
                                // templateObject.uploadedFilesJobNoPOP.set('');
                                if (data.fields.Attachments) {
                                    if (data.fields.Attachments.length) {
                                        templateObject.attachmentCountJobNoPOP.set(data.fields.Attachments.length);
                                        templateObject.uploadedFilesJobNoPOP.set(data.fields.Attachments);

                                    }
                                }
                                /* END  attachment */

                                templateObject.isJob.set(data.fields.IsJob);
                                templateObject.getAllProductRecentTransactions(data.fields.ClientName);
                                templateObject.getAllCustomerJobs(data.fields.ClientName);
                                setTimeout(function () {
                                  $('#sltJobPreferedPayment').val(data.fields.PaymentMethodName);
                                  $('#sltJobTerms').val(data.fields.TermsName);
                                  $('#sltJobCustomerType').val(data.fields.ClientTypeName);
                                  $('#sltJobTaxCode').val(data.fields.TaxCodeName);
                                }, 1000);
                                // $('.fullScreenSpin').css('display','none');
                                setTimeout(function () {
                                    var rowCount = $('.results tbody tr').length;
                                    $('.counter').text(rowCount + ' items');
                                    if (currentId.transTab == 'active') {
                                        $('.jobTab').removeClass('active');
                                        $('.transactionTab').trigger('click');
                                    }else{
                                        $('.jobTab').addClass('active');
                                        $('.jobTab').trigger('click');
                                    }

                                    $('#sltJobPreferedPayment').val(lineItemObj.jobpreferedpayment);
                                    $('#sltJobTerms').val(lineItemObj.jobterms);
                                    $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
                                    $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);
                                }, 500);
                            });
                        }
                    }
                }).catch(function (err) {
                    contactService.getOneCustomerJobDataEx(customerID).then(function (data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];

                        let lineItemObj = {
                            jobid: data.fields.ID || '',
                            joblid: 'Edit Job',
                            isjob: data.fields.IsJob || '',
                            jobcompany: data.fields.ClientName || '',
                            jobCompanyParent: data.fields.ParentClientName || '',
                            jobemail: data.fields.Email || '',
                            jobtitle: data.fields.Title || '',
                            jobfirstname: data.fields.FirstName || '',
                            jobmiddlename: data.fields.MiddleName || '',
                            joblastname: data.fields.LastName || '',
                            jobtfn: '' || '',
                            jobphone: data.fields.Phone || '',
                            jobmobile: data.fields.Mobile || '',
                            jobfax: data.fields.Faxnumber || '',
                            jobskype: data.fields.SkypeName || '',
                            jobwebsite: data.fields.CUSTFLD9 || '',
                            jobshippingaddress: data.fields.Street || '',
                            jobscity: data.fields.Street2 || '',
                            jobsstate: data.fields.State || '',
                            jobspostalcode: data.fields.Postcode || '',
                            jobscountry: data.fields.Country || LoggedCountry,
                            jobbillingaddress: data.fields.BillStreet || '',
                            jobbcity: data.fields.BillStreet2 || '',
                            jobbstate: data.fields.BillState || '',
                            jobbpostalcode: data.fields.BillPostcode || '',
                            jobbcountry: data.fields.Billcountry || '',
                            jobnotes: data.fields.Notes || '',
                            jobpreferedpayment: data.fields.PaymentMethodName || '',
                            jobterms: data.fields.TermsName || '',
                            jobdeliverymethod: data.fields.ShippingMethodName || '',
                            jobopeningbalance: data.fields.RewardPointsOpeningBalance || 0.00,
                            jobopeningbalancedate: data.fields.RewardPointsOpeningDate ? moment(data.fields.RewardPointsOpeningDate).format('DD/MM/YYYY') : "",
                            jobtaxcode: data.fields.TaxCodeName || templateObject.defaultsaletaxcode.get(),
                            jobcustFld1: '' || '',
                            jobcustFld2: '' || '',
                            job_Title: data.fields.JobTitle || '',
                            jobName: data.fields.JobName || '',
                            jobNumber: data.fields.JobNumber || '',
                            jobRegistration: data.fields.JobRegistration || '',
                            discount: 0,
                            jobclienttype:data.fields.ClientTypeName || ''

                        }

                        if ((data.fields.Street == data.fields.BillStreet) && (data.fields.Street2 == data.fields.BillStreet2)
                            && (data.fields.State == data.fields.BillState) && (data.fields.Postcode == data.fields.Postcode)
                            && (data.fields.Country == data.fields.Billcountry)) {
                            templateObject.isJobSameAddress.set(true);
                        }
                        templateObject.records.set(lineItemObj);
                        templateObject.getOverviewARData(data.fields.ClientName);
                        /* START attachment */
                        templateObject.attachmentCountJobNoPOP.set(0);
                        // templateObject.uploadedFilesJobNoPOP.set('');
                        if (data.fields.Attachments) {
                            if (data.fields.Attachments.length) {
                                templateObject.attachmentCountJobNoPOP.set(data.fields.Attachments.length);
                                templateObject.uploadedFilesJobNoPOP.set(data.fields.Attachments);

                            }
                        }
                        /* END  attachment */

                        templateObject.isJob.set(data.fields.IsJob);
                        templateObject.getAllProductRecentTransactions(data.fields.ClientName);
                        templateObject.getAllCustomerJobs(data.fields.ClientName);

                        setTimeout(function () {
                          $('#sltJobPreferedPayment').val(data.fields.PaymentMethodName);
                          $('#sltJobTerms').val(data.fields.TermsName);
                          $('#sltJobCustomerType').val(data.fields.ClientTypeName);
                          $('#sltJobTaxCode').val(data.fields.TaxCodeName);
                        }, 1000);
                        // $('.fullScreenSpin').css('display','none');
                        setTimeout(function () {
                            var rowCount = $('.results tbody tr').length;
                            $('.counter').text(rowCount + ' items');
                            if (currentId.transTab == 'active') {
                                $('.jobTab').removeClass('active');
                                $('.transactionTab').trigger('click');
                            }else{
                                $('.jobTab').addClass('active');
                                $('.jobTab').trigger('click');
                            }
                            $('#sltJobPreferedPayment').val(lineItemObj.jobpreferedpayment);
                            $('#sltJobTerms').val(lineItemObj.jobterms);
                            $('#sltJobCustomerType').val(lineItemObj.jobclienttype);
                            $('#sltJobTaxCode').val(lineItemObj.jobtaxcode);
                        }, 500);
                    });
                });


            }

            templateObject.getEmployeeData();
        } else {

            let lineItemObj = {
                id: '',
                lid: 'Add Customer',
                company: '',
                email: '',
                title: '',
                firstname: '',
                middlename: '',
                lastname: '',
                tfn: '',
                phone: '',
                mobile: '',
                fax: '',
                shippingaddress: '',
                terms:templateObject.defaultsaleterm.get()||'',
                scity: '',
                sstate: '',
                spostalcode: '',
                scountry: LoggedCountry || '',
                billingaddress: '',
                bcity: '',
                bstate: '',
                bpostalcode: '',
                bcountry: LoggedCountry || '',
                custFld1: '',
                custFld2: '',
                jobbcountry: LoggedCountry || '',
                jobscountry: LoggedCountry || '',
                discount:0
            }
            templateObject.isSameAddress.set(true);
            templateObject.records.set(lineItemObj);
            setTimeout(function () {
                $('#tblTransactionlist').DataTable();
                $('.fullScreenSpin').css('display', 'none');
                if (currentId.transTab == 'active') {
                    $('.customerTab').removeClass('active');
                    $('.transactionTab').trigger('click');
                }else{
                    $('.customerTab').addClass('active');
                    $('.customerTab').trigger('click');
                }

            }, 500);

            setTimeout(function () {
                $('.termsSelect').val(templateObject.defaultsaleterm.get()||'');
            }, 2000);
            $('.fullScreenSpin').css('display', 'none');
            // setTimeout(function () {
            //   var rowCount = $('.results tbody tr').length;
            //     $('.counter').text(rowCount + ' items');
            // }, 500);
        }
    }

    templateObject.getCustomersList = function () {
        getVS1Data('TCustomerVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                contactService.getAllCustomerSideDataVS1().then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    for (let i = 0; i < data.tcustomervs1.length; i++) {
                        let classname = '';
                        if (!isNaN(currentId.id)) {
                            if (data.tcustomervs1.Id == parseInt(currentId.id)) {
                                classname = 'currentSelect';
                            }
                        }
                        if (!isNaN(currentId.jobid)) {
                            if (data.tcustomervs1.Id == parseInt(currentId.jobid)) {
                                classname = 'currentSelect';
                            }
                        }
                        var dataList = {
                            id: data.tcustomervs1[i].Id || '',
                            company: data.tcustomervs1[i].ClientName || '',
                            isslectJob: data.tcustomervs1[i].IsJob || false,
                            classname: classname
                        };

                        lineItems.push(dataList);
                    }

                    templateObject.customerrecords.set(lineItems);

                    if (templateObject.customerrecords.get()) {

                        setTimeout(function () {
                            $('.counter').text(lineItems.length + ' items');
                        }, 100);
                    }

                }).catch(function (err) {
                    //Bert.alert('<strong>' + err + '</strong>!', 'danger');

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcustomervs1;
                let lineItems = [];
                let lineItemObj = {};

                for (let i = 0; i < useData.length; i++) {
                    let classname = '';
                    if (!isNaN(currentId.id)) {
                        if (useData[i].fields.ID == parseInt(currentId.id)) {
                            classname = 'currentSelect';
                        }
                    }

                    if (!isNaN(currentId.jobid)) {
                        if (useData[i].fields.ID == parseInt(currentId.jobid)) {
                            classname = 'currentSelect';
                        }
                    }
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        company: useData[i].fields.ClientName || '',
                        isslectJob: useData[i].fields.IsJob || false,
                        classname: classname
                    };

                    lineItems.push(dataList);
                }

                templateObject.customerrecords.set(lineItems);

                if (templateObject.customerrecords.get()) {

                    setTimeout(function () {
                        $('.counter').text(lineItems.length + ' items');
                    }, 100);
                }

            }
        }).catch(function (err) {
            contactService.getAllCustomerSideDataVS1().then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.tcustomervs1.length; i++) {
                    let classname = '';
                    if (!isNaN(currentId.id)) {
                        if (data.tcustomervs1.Id == parseInt(currentId.id)) {
                            classname = 'currentSelect';
                        }
                    }
                    if (!isNaN(currentId.jobid)) {
                        if (data.tcustomervs1.Id == parseInt(currentId.jobid)) {
                            classname = 'currentSelect';
                        }
                    }
                    var dataList = {
                        id: data.tcustomervs1[i].Id || '',
                        company: data.tcustomervs1[i].ClientName || '',
                        isslectJob: data.tcustomervs1[i].IsJob || false,
                        classname: classname
                    };

                    lineItems.push(dataList);
                }

                templateObject.customerrecords.set(lineItems);

                if (templateObject.customerrecords.get()) {

                    setTimeout(function () {
                        $('.counter').text(lineItems.length + ' items');
                    }, 100);
                }

            }).catch(function (err) {
                //Bert.alert('<strong>' + err + '</strong>!', 'danger');

            });
        });

    }
    templateObject.getCustomersList();

    $(document).ready(function () {
        setTimeout(function () {
            $('#sltTerms').editableSelect();
            $('#sltPreferedPayment').editableSelect();
            $('#sltCustomerType').editableSelect();
            $('#sltTaxCode').editableSelect();

            $('#sltJobTerms').editableSelect();
            $('#sltJobPreferedPayment').editableSelect();
            $('#sltJobCustomerType').editableSelect();
            $('#sltJobTaxCode').editableSelect();

            $('#sltTerms').editableSelect()
            .on('click.editable-select', function (e, li) {
                var $earch = $(this);
                var offset = $earch.offset();
                $('#selectLineID').val('sltTerms');
                var termsDataName = e.target.value || '';
                $('#edtTermsID').val('');
                if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                    $('#termsListModal').modal('toggle');
                } else {
                    if (termsDataName.replace(/\s/g, '') != '') {
                        $('#termModalHeader').text('Edit Terms');
                        getVS1Data('TTermsVS1').then(function (dataObject) { //edit to test indexdb
                            if (dataObject.length == 0) {
                                $('.fullScreenSpin').css('display', 'inline-block');
                                sideBarService.getTermsVS1().then(function (data) {
                                    for (let i in data.ttermsvs1) {
                                        if (data.ttermsvs1[i].TermsName === termsDataName) {
                                            $('#edtTermsID').val(data.ttermsvs1[i].Id);
                                            $('#edtDays').val(data.ttermsvs1[i].Days);
                                            $('#edtName').val(data.ttermsvs1[i].TermsName);
                                            $('#edtDesc').val(data.ttermsvs1[i].Description);
                                            if (data.ttermsvs1[i].IsEOM === true) {
                                                $('#isEOM').prop('checked', true);
                                            } else {
                                                $('#isEOM').prop('checked', false);
                                            }
                                            if (data.ttermsvs1[i].IsEOMPlus === true) {
                                                $('#isEOMPlus').prop('checked', true);
                                            } else {
                                                $('#isEOMPlus').prop('checked', false);
                                            }
                                            if (data.ttermsvs1[i].isSalesdefault === true) {
                                                $('#chkCustomerDef').prop('checked', true);
                                            } else {
                                                $('#chkCustomerDef').prop('checked', false);
                                            }
                                            if (data.ttermsvs1[i].isPurchasedefault === true) {
                                                $('#chkSupplierDef').prop('checked', true);
                                            } else {
                                                $('#chkSupplierDef').prop('checked', false);
                                            }
                                        }
                                    }
                                    setTimeout(function () {
                                        $('.fullScreenSpin').css('display', 'none');
                                        $('#newTermsModal').modal('toggle');
                                    }, 200);
                                });
                            } else {
                                let data = JSON.parse(dataObject[0].data);
                                let useData = data.ttermsvs1;
                                for (let i in useData) {
                                    if (useData[i].TermsName === termsDataName) {
                                        $('#edtTermsID').val(useData[i].Id);
                                        $('#edtDays').val(useData[i].Days);
                                        $('#edtName').val(useData[i].TermsName);
                                        $('#edtDesc').val(useData[i].Description);
                                        if (useData[i].IsEOM === true) {
                                            $('#isEOM').prop('checked', true);
                                        } else {
                                            $('#isEOM').prop('checked', false);
                                        }
                                        if (useData[i].IsEOMPlus === true) {
                                            $('#isEOMPlus').prop('checked', true);
                                        } else {
                                            $('#isEOMPlus').prop('checked', false);
                                        }
                                        if (useData[i].isSalesdefault === true) {
                                            $('#chkCustomerDef').prop('checked', true);
                                        } else {
                                            $('#chkCustomerDef').prop('checked', false);
                                        }
                                        if (useData[i].isPurchasedefault === true) {
                                            $('#chkSupplierDef').prop('checked', true);
                                        } else {
                                            $('#chkSupplierDef').prop('checked', false);
                                        }
                                    }
                                }
                                setTimeout(function () {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newTermsModal').modal('toggle');
                                }, 200);
                            }
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getTermsVS1().then(function (data) {
                                for (let i in data.ttermsvs1) {
                                    if (data.ttermsvs1[i].TermsName === termsDataName) {
                                        $('#edtTermsID').val(data.ttermsvs1[i].Id);
                                        $('#edtDays').val(data.ttermsvs1[i].Days);
                                        $('#edtName').val(data.ttermsvs1[i].TermsName);
                                        $('#edtDesc').val(data.ttermsvs1[i].Description);
                                        if (data.ttermsvs1[i].IsEOM === true) {
                                            $('#isEOM').prop('checked', true);
                                        } else {
                                            $('#isEOM').prop('checked', false);
                                        }
                                        if (data.ttermsvs1[i].IsEOMPlus === true) {
                                            $('#isEOMPlus').prop('checked', true);
                                        } else {
                                            $('#isEOMPlus').prop('checked', false);
                                        }
                                        if (data.ttermsvs1[i].isSalesdefault === true) {
                                            $('#chkCustomerDef').prop('checked', true);
                                        } else {
                                            $('#chkCustomerDef').prop('checked', false);
                                        }
                                        if (data.ttermsvs1[i].isPurchasedefault === true) {
                                            $('#chkSupplierDef').prop('checked', true);
                                        } else {
                                            $('#chkSupplierDef').prop('checked', false);
                                        }
                                    }
                                }
                                setTimeout(function () {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newTermsModal').modal('toggle');
                                }, 200);
                            });
                        });
                    } else {
                        $('#termsListModal').modal();
                        setTimeout(function () {
                            $('#termsList_filter .form-control-sm').focus();
                            $('#termsList_filter .form-control-sm').val('');
                            $('#termsList_filter .form-control-sm').trigger("input");
                            var datatable = $('#termsList').DataTable();
                            datatable.draw();
                            $('#termsList_filter .form-control-sm').trigger("input");
                        }, 500);
                    }
                }
            });

            $('#sltJobTerms').editableSelect()
            .on('click.editable-select', function (e, li) {
                var $earch = $(this);
                var offset = $earch.offset();
                var termsDataName = e.target.value || '';
                $('#selectLineID').val('sltJobTerms');
                $('#edtTermsID').val('');
                if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                    $('#termsListModal').modal('toggle');
                } else {
                    if (termsDataName.replace(/\s/g, '') != '') {
                        $('#termModalHeader').text('Edit Terms');
                        getVS1Data('TTermsVS1').then(function (dataObject) { //edit to test indexdb
                            if (dataObject.length == 0) {
                                $('.fullScreenSpin').css('display', 'inline-block');
                                sideBarService.getTermsVS1().then(function (data) {
                                    for (let i in data.ttermsvs1) {
                                        if (data.ttermsvs1[i].TermsName === termsDataName) {
                                            $('#edtTermsID').val(data.ttermsvs1[i].Id);
                                            $('#edtDays').val(data.ttermsvs1[i].Days);
                                            $('#edtName').val(data.ttermsvs1[i].TermsName);
                                            $('#edtDesc').val(data.ttermsvs1[i].Description);
                                            if (data.ttermsvs1[i].IsEOM === true) {
                                                $('#isEOM').prop('checked', true);
                                            } else {
                                                $('#isEOM').prop('checked', false);
                                            }
                                            if (data.ttermsvs1[i].IsEOMPlus === true) {
                                                $('#isEOMPlus').prop('checked', true);
                                            } else {
                                                $('#isEOMPlus').prop('checked', false);
                                            }
                                            if (data.ttermsvs1[i].isSalesdefault === true) {
                                                $('#chkCustomerDef').prop('checked', true);
                                            } else {
                                                $('#chkCustomerDef').prop('checked', false);
                                            }
                                            if (data.ttermsvs1[i].isPurchasedefault === true) {
                                                $('#chkSupplierDef').prop('checked', true);
                                            } else {
                                                $('#chkSupplierDef').prop('checked', false);
                                            }
                                        }
                                    }
                                    setTimeout(function () {
                                        $('.fullScreenSpin').css('display', 'none');
                                        $('#newTermsModal').modal('toggle');
                                    }, 200);
                                });
                            } else {
                                let data = JSON.parse(dataObject[0].data);
                                let useData = data.ttermsvs1;
                                for (let i in useData) {
                                    if (useData[i].TermsName === termsDataName) {
                                        $('#edtTermsID').val(useData[i].Id);
                                        $('#edtDays').val(useData[i].Days);
                                        $('#edtName').val(useData[i].TermsName);
                                        $('#edtDesc').val(useData[i].Description);
                                        if (useData[i].IsEOM === true) {
                                            $('#isEOM').prop('checked', true);
                                        } else {
                                            $('#isEOM').prop('checked', false);
                                        }
                                        if (useData[i].IsEOMPlus === true) {
                                            $('#isEOMPlus').prop('checked', true);
                                        } else {
                                            $('#isEOMPlus').prop('checked', false);
                                        }
                                        if (useData[i].isSalesdefault === true) {
                                            $('#chkCustomerDef').prop('checked', true);
                                        } else {
                                            $('#chkCustomerDef').prop('checked', false);
                                        }
                                        if (useData[i].isPurchasedefault === true) {
                                            $('#chkSupplierDef').prop('checked', true);
                                        } else {
                                            $('#chkSupplierDef').prop('checked', false);
                                        }
                                    }
                                }
                                setTimeout(function () {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newTermsModal').modal('toggle');
                                }, 200);
                            }
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getTermsVS1().then(function (data) {
                                for (let i in data.ttermsvs1) {
                                    if (data.ttermsvs1[i].TermsName === termsDataName) {
                                        $('#edtTermsID').val(data.ttermsvs1[i].Id);
                                        $('#edtDays').val(data.ttermsvs1[i].Days);
                                        $('#edtName').val(data.ttermsvs1[i].TermsName);
                                        $('#edtDesc').val(data.ttermsvs1[i].Description);
                                        if (data.ttermsvs1[i].IsEOM === true) {
                                            $('#isEOM').prop('checked', true);
                                        } else {
                                            $('#isEOM').prop('checked', false);
                                        }
                                        if (data.ttermsvs1[i].IsEOMPlus === true) {
                                            $('#isEOMPlus').prop('checked', true);
                                        } else {
                                            $('#isEOMPlus').prop('checked', false);
                                        }
                                        if (data.ttermsvs1[i].isSalesdefault === true) {
                                            $('#chkCustomerDef').prop('checked', true);
                                        } else {
                                            $('#chkCustomerDef').prop('checked', false);
                                        }
                                        if (data.ttermsvs1[i].isPurchasedefault === true) {
                                            $('#chkSupplierDef').prop('checked', true);
                                        } else {
                                            $('#chkSupplierDef').prop('checked', false);
                                        }
                                    }
                                }
                                setTimeout(function () {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newTermsModal').modal('toggle');
                                }, 200);
                            });
                        });
                    } else {
                        $('#termsListModal').modal();
                        setTimeout(function () {
                            $('#termsList_filter .form-control-sm').focus();
                            $('#termsList_filter .form-control-sm').val('');
                            $('#termsList_filter .form-control-sm').trigger("input");
                            var datatable = $('#termsList').DataTable();
                            datatable.draw();
                            $('#termsList_filter .form-control-sm').trigger("input");
                        }, 500);
                    }
                }
            });

            $('#sltPreferedPayment').editableSelect()
                .on('click.editable-select', function(e, li) {
                    var $earch = $(this);
                    var offset = $earch.offset();
                    var paymentDataName = e.target.value || '';
                    $('#edtPaymentMethodID').val('');
                    $('#selectPaymentMethodLineID').val('sltPreferedPayment');
                    if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                        $('#paymentMethodModal').modal('toggle');
                    } else {
                        if (paymentDataName.replace(/\s/g, '') != '') {
                            $('#paymentMethodHeader').text('Edit Payment Method');

                            getVS1Data('TPaymentMethod').then(function(dataObject) {
                                if (dataObject.length == 0) {
                                    $('.fullScreenSpin').css('display', 'inline-block');
                                    sideBarService.getPaymentMethodDataVS1().then(function(data) {
                                        for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                                            if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                                $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                                $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                                if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                                    $('#isformcreditcard').prop('checked', true);
                                                } else {
                                                    $('#isformcreditcard').prop('checked', false);
                                                }
                                            }
                                        }
                                        setTimeout(function() {
                                            $('.fullScreenSpin').css('display', 'none');
                                            $('#newPaymentMethodModal').modal('toggle');
                                        }, 200);
                                    });
                                } else {
                                    let data = JSON.parse(dataObject[0].data);
                                    let useData = data.tpaymentmethodvs1;

                                    for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                                        if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                            $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                            $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                            if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                                $('#isformcreditcard').prop('checked', true);
                                            } else {
                                                $('#isformcreditcard').prop('checked', false);
                                            }
                                        }
                                    }
                                    setTimeout(function() {
                                        $('.fullScreenSpin').css('display', 'none');
                                        $('#newPaymentMethodModal').modal('toggle');
                                    }, 200);
                                }
                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'inline-block');
                                sideBarService.getPaymentMethodDataVS1().then(function(data) {
                                    for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                                        if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                            $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                            $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                            if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                                $('#isformcreditcard').prop('checked', true);
                                            } else {
                                                $('#isformcreditcard').prop('checked', false);
                                            }
                                        }
                                    }
                                    setTimeout(function() {
                                        $('.fullScreenSpin').css('display', 'none');
                                        $('#newPaymentMethodModal').modal('toggle');
                                    }, 200);
                                });
                            });
                        } else {
                            $('#paymentMethodModal').modal();
                            setTimeout(function() {
                                $('#paymentmethodList_filter .form-control-sm').focus();
                                $('#paymentmethodList_filter .form-control-sm').val('');
                                $('#paymentmethodList_filter .form-control-sm').trigger("input");
                                var datatable = $('#paymentmethodList').DataTable();
                                datatable.draw();
                                $('#paymentmethodList_filter .form-control-sm').trigger("input");
                            }, 500);
                        }
                    }
                });

            $('#sltJobPreferedPayment').editableSelect()
                .on('click.editable-select', function(e, li) {
                    var $earch = $(this);
                    var offset = $earch.offset();
                    var paymentDataName = e.target.value || '';
                    $('#selectPaymentMethodLineID').val('sltJobPreferedPayment');
                    $('#edtPaymentMethodID').val('');
                    if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                        $('#paymentMethodModal').modal('toggle');
                    } else {
                        if (paymentDataName.replace(/\s/g, '') != '') {
                            $('#paymentMethodHeader').text('Edit Payment Method');

                            getVS1Data('TPaymentMethod').then(function(dataObject) {
                                if (dataObject.length == 0) {
                                    $('.fullScreenSpin').css('display', 'inline-block');
                                    sideBarService.getPaymentMethodDataVS1().then(function(data) {
                                        for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                                            if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                                $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                                $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                                if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                                    $('#isformcreditcard').prop('checked', true);
                                                } else {
                                                    $('#isformcreditcard').prop('checked', false);
                                                }
                                            }
                                        }
                                        setTimeout(function() {
                                            $('.fullScreenSpin').css('display', 'none');
                                            $('#newPaymentMethodModal').modal('toggle');
                                        }, 200);
                                    });
                                } else {
                                    let data = JSON.parse(dataObject[0].data);
                                    let useData = data.tpaymentmethodvs1;

                                    for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                                        if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                            $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                            $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                            if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                                $('#isformcreditcard').prop('checked', true);
                                            } else {
                                                $('#isformcreditcard').prop('checked', false);
                                            }
                                        }
                                    }
                                    setTimeout(function() {
                                        $('.fullScreenSpin').css('display', 'none');
                                        $('#newPaymentMethodModal').modal('toggle');
                                    }, 200);
                                }
                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'inline-block');
                                sideBarService.getPaymentMethodDataVS1().then(function(data) {
                                    for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                                        if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                            $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                            $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                            if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                                $('#isformcreditcard').prop('checked', true);
                                            } else {
                                                $('#isformcreditcard').prop('checked', false);
                                            }
                                        }
                                    }
                                    setTimeout(function() {
                                        $('.fullScreenSpin').css('display', 'none');
                                        $('#newPaymentMethodModal').modal('toggle');
                                    }, 200);
                                });
                            });
                        } else {
                            $('#paymentMethodModal').modal();
                            setTimeout(function() {
                                $('#paymentmethodList_filter .form-control-sm').focus();
                                $('#paymentmethodList_filter .form-control-sm').val('');
                                $('#paymentmethodList_filter .form-control-sm').trigger("input");
                                var datatable = $('#paymentmethodList').DataTable();
                                datatable.draw();
                                $('#paymentmethodList_filter .form-control-sm').trigger("input");
                            }, 500);
                        }
                    }
                });

            $('#sltCustomerType').editableSelect()
            .on('click.editable-select', function (e, li) {
                var $earch = $(this);
                var offset = $earch.offset();
                $('#selectLineID').val('sltCustomerType');
                var clientTypeDataName = e.target.value || '';
                $('#edtClientTypeID').val('');
                $('#edtClientTypeName').val('');
                $('#txaDescription').val('');
                $('#add-clienttype-title').text('Add Customer Type');
                if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                    $('#clienttypeListModal').modal('toggle');
                } else {
                    if (clientTypeDataName.replace(/\s/g, '') != '') {
                        $('#add-clienttype-title').text('Edit Customer Type');
                        getVS1Data('TClientType').then(function (dataObject) { //edit to test indexdb
                            if (dataObject.length == 0) {
                                $('.fullScreenSpin').css('display', 'inline-block');
                                contactService.getClientType().then(function (data) {
                                    for (let i in data.tclienttype) {
                                        if (data.tclienttype[i].TypeName === termsDataName) {
                                          $('#edtClientTypeID').val(data.tclienttype[i].Id);
                                          $('#edtClientTypeName').val(data.tclienttype[i].TypeName);
                                          $('#txaDescription').val(data.tclienttype[i].TypeDescription);
                                        }
                                    }
                                    setTimeout(function () {
                                        $('.fullScreenSpin').css('display', 'none');
                                        $('#myModalClientType').modal('toggle');
                                    }, 200);
                                });
                            } else {
                                let data = JSON.parse(dataObject[0].data);
                                let useData = data.tclienttype;
                                for (let i in useData) {
                                    if (useData[i].fields.TypeName === clientTypeDataName) {
                                        $('#edtClientTypeID').val(useData[i].fields.ID);
                                        $('#edtClientTypeName').val(useData[i].fields.TypeName);
                                        $('#txaDescription').val(useData[i].fields.TypeDescription);

                                    }
                                }
                                setTimeout(function () {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#myModalClientType').modal('toggle');
                                }, 200);
                            }
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            contactService.getClientType().then(function (data) {
                                for (let i in data.tclienttype) {
                                    if (data.tclienttype[i].TypeName === termsDataName) {
                                        $('#edtClientTypeID').val(data.tclienttype[i].Id);
                                        $('#edtClientTypeName').val(data.tclienttype[i].TypeName);
                                        $('#txaDescription').val(data.tclienttype[i].TypeDescription);
                                    }
                                }
                                setTimeout(function () {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#myModalClientType').modal('toggle');
                                }, 200);
                            });
                        });
                    } else {
                        $('#clienttypeListModal').modal();
                        setTimeout(function () {
                            $('#termsList_filter .form-control-sm').focus();
                            $('#termsList_filter .form-control-sm').val('');
                            $('#termsList_filter .form-control-sm').trigger("input");
                            var datatable = $('#termsList').DataTable();
                            datatable.draw();
                            $('#termsList_filter .form-control-sm').trigger("input");
                        }, 500);
                    }
                }
            });

            $('#sltJobCustomerType').editableSelect()
            .on('click.editable-select', function (e, li) {
                var $earch = $(this);
                var offset = $earch.offset();
                $('#selectLineID').val('sltJobCustomerType');
                var clientTypeDataName = e.target.value || '';
                $('#edtClientTypeID').val('');
                $('#edtClientTypeName').val('');
                $('#txaDescription').val('');
                $('#add-clienttype-title').text('Add Customer Type');
                if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                    $('#clienttypeListModal').modal('toggle');
                } else {
                    if (clientTypeDataName.replace(/\s/g, '') != '') {
                        $('#add-clienttype-title').text('Edit Customer Type');
                        getVS1Data('TClientType').then(function (dataObject) { //edit to test indexdb
                            if (dataObject.length == 0) {
                                $('.fullScreenSpin').css('display', 'inline-block');
                                contactService.getClientType().then(function (data) {
                                    for (let i in data.tclienttype) {
                                        if (data.tclienttype[i].TypeName === termsDataName) {
                                          $('#edtClientTypeID').val(data.tclienttype[i].Id);
                                          $('#edtClientTypeName').val(data.tclienttype[i].TypeName);
                                          $('#txaDescription').val(data.tclienttype[i].TypeDescription);
                                        }
                                    }
                                    setTimeout(function () {
                                        $('.fullScreenSpin').css('display', 'none');
                                        $('#myModalClientType').modal('toggle');
                                    }, 200);
                                });
                            } else {
                                let data = JSON.parse(dataObject[0].data);
                                let useData = data.tclienttype;
                                for (let i in useData) {
                                    if (useData[i].fields.TypeName === clientTypeDataName) {
                                        $('#edtClientTypeID').val(useData[i].fields.ID);
                                        $('#edtClientTypeName').val(useData[i].fields.TypeName);
                                        $('#txaDescription').val(useData[i].fields.TypeDescription);

                                    }
                                }
                                setTimeout(function () {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#myModalClientType').modal('toggle');
                                }, 200);
                            }
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            contactService.getClientType().then(function (data) {
                                for (let i in data.tclienttype) {
                                    if (data.tclienttype[i].TypeName === termsDataName) {
                                        $('#edtClientTypeID').val(data.tclienttype[i].Id);
                                        $('#edtClientTypeName').val(data.tclienttype[i].TypeName);
                                        $('#txaDescription').val(data.tclienttype[i].TypeDescription);
                                    }
                                }
                                setTimeout(function () {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#myModalClientType').modal('toggle');
                                }, 200);
                            });
                        });
                    } else {
                        $('#clienttypeListModal').modal();
                        setTimeout(function () {
                            $('#termsList_filter .form-control-sm').focus();
                            $('#termsList_filter .form-control-sm').val('');
                            $('#termsList_filter .form-control-sm').trigger("input");
                            var datatable = $('#termsList').DataTable();
                            datatable.draw();
                            $('#termsList_filter .form-control-sm').trigger("input");
                        }, 500);
                    }
                }
            });

            $('#sltTaxCode').editableSelect()
            .on('click.editable-select', function (e, li) {
                var $earch = $(this);
                var offset = $earch.offset();
                $('#selectLineID').val('sltTaxCode');
                var taxRateDataName = e.target.value || '';
                $('#edtTaxID').val('');
                $('.taxcodepopheader').text('New Tax Rate');
                $('#edtTaxID').val('');
                $('#edtTaxNamePop').val('');
                $('#edtTaxRatePop').val('');
                $('#edtTaxDescPop').val('');
                $('#edtTaxNamePop').attr('readonly', false);
                if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                  $('#taxRateListModal').modal('toggle');
                  // var targetID = $(event.target).closest('tr').attr('id');
                  // $('#selectLineID').val(targetID);
                  setTimeout(function() {
                      $('#tblTaxRate_filter .form-control-sm').focus();
                      $('#tblTaxRate_filter .form-control-sm').val('');
                      $('#tblTaxRate_filter .form-control-sm').trigger("input");

                      var datatable = $('#tblTaxRate').DataTable();
                      datatable.draw();
                      $('#tblTaxRate_filter .form-control-sm').trigger("input");

                  }, 500);
                } else {
                    if (taxRateDataName.replace(/\s/g, '') != '') {
                      $('.taxcodepopheader').text('Edit Tax Rate');
                      getVS1Data('TTaxcodeVS1').then(function (dataObject) {
                        if(dataObject.length == 0){
                          sideBarService.getTaxCodesVS1().then(function (data) {
                            let lineItems = [];
                            let lineItemObj = {};
                            for(let i=0; i<data.ttaxcodevs1.length; i++){
                              if ((data.ttaxcodevs1[i].CodeName) === taxRateDataName) {
                                $('#edtTaxNamePop').attr('readonly', true);
                              let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                              var taxRateID = data.ttaxcodevs1[i].Id || '';
                               var taxRateName = data.ttaxcodevs1[i].CodeName ||'';
                               var taxRateDesc = data.ttaxcodevs1[i].Description || '';
                               $('#edtTaxID').val(taxRateID);
                               $('#edtTaxNamePop').val(taxRateName);
                               $('#edtTaxRatePop').val(taxRate);
                               $('#edtTaxDescPop').val(taxRateDesc);
                               setTimeout(function() {
                               $('#newTaxRateModal').modal('toggle');
                               }, 100);
                             }
                            }

                          }).catch(function (err) {
                              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                              $('.fullScreenSpin').css('display','none');
                              // Meteor._reload.reload();
                          });
                        }else{
                          let data = JSON.parse(dataObject[0].data);
                          let useData = data.ttaxcodevs1;
                          let lineItems = [];
                          let lineItemObj = {};
                          $('.taxcodepopheader').text('Edit Tax Rate');
                          for(let i=0; i<useData.length; i++){

                            if ((useData[i].CodeName) === taxRateDataName) {
                              $('#edtTaxNamePop').attr('readonly', true);
                            let taxRate = (useData[i].Rate * 100).toFixed(2);
                            var taxRateID = useData[i].Id || '';
                             var taxRateName = useData[i].CodeName ||'';
                             var taxRateDesc = useData[i].Description || '';
                             $('#edtTaxID').val(taxRateID);
                             $('#edtTaxNamePop').val(taxRateName);
                             $('#edtTaxRatePop').val(taxRate);
                             $('#edtTaxDescPop').val(taxRateDesc);
                             //setTimeout(function() {
                             $('#newTaxRateModal').modal('toggle');
                             //}, 500);
                           }
                          }
                        }
                      }).catch(function (err) {
                        sideBarService.getTaxCodesVS1().then(function (data) {
                          let lineItems = [];
                          let lineItemObj = {};
                          for(let i=0; i<data.ttaxcodevs1.length; i++){
                            if ((data.ttaxcodevs1[i].CodeName) === taxRateDataName) {
                              $('#edtTaxNamePop').attr('readonly', true);
                            let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                            var taxRateID = data.ttaxcodevs1[i].Id || '';
                             var taxRateName = data.ttaxcodevs1[i].CodeName ||'';
                             var taxRateDesc = data.ttaxcodevs1[i].Description || '';
                             $('#edtTaxID').val(taxRateID);
                             $('#edtTaxNamePop').val(taxRateName);
                             $('#edtTaxRatePop').val(taxRate);
                             $('#edtTaxDescPop').val(taxRateDesc);
                             setTimeout(function() {
                             $('#newTaxRateModal').modal('toggle');
                             }, 100);

                           }
                          }

                        }).catch(function (err) {
                            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                            $('.fullScreenSpin').css('display','none');
                            // Meteor._reload.reload();
                        });
                      });
                    } else {
                      $('#taxRateListModal').modal('toggle');
                      // var targetID = $(event.target).closest('tr').attr('id');
                      // $('#selectLineID').val(targetID);
                      setTimeout(function() {
                          $('#tblTaxRate_filter .form-control-sm').focus();
                          $('#tblTaxRate_filter .form-control-sm').val('');
                          $('#tblTaxRate_filter .form-control-sm').trigger("input");

                          var datatable = $('#tblTaxRate').DataTable();
                          datatable.draw();
                          $('#tblTaxRate_filter .form-control-sm').trigger("input");

                      }, 500);
                    }
                }
            });

            $('#sltJobTaxCode').editableSelect()
            .on('click.editable-select', function (e, li) {
                var $earch = $(this);
                var offset = $earch.offset();
                $('#selectLineID').val('sltJobTaxCode');
                var taxRateDataName = e.target.value || '';
                $('#edtTaxID').val('');
                $('.taxcodepopheader').text('New Tax Rate');
                $('#edtTaxID').val('');
                $('#edtTaxNamePop').val('');
                $('#edtTaxRatePop').val('');
                $('#edtTaxDescPop').val('');
                $('#edtTaxNamePop').attr('readonly', false);
                if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                  $('#taxRateListModal').modal('toggle');
                  // var targetID = $(event.target).closest('tr').attr('id');
                  // $('#selectLineID').val(targetID);
                  setTimeout(function() {
                      $('#tblTaxRate_filter .form-control-sm').focus();
                      $('#tblTaxRate_filter .form-control-sm').val('');
                      $('#tblTaxRate_filter .form-control-sm').trigger("input");

                      var datatable = $('#tblTaxRate').DataTable();
                      datatable.draw();
                      $('#tblTaxRate_filter .form-control-sm').trigger("input");

                  }, 500);
                } else {
                    if (taxRateDataName.replace(/\s/g, '') != '') {
                      $('.taxcodepopheader').text('Edit Tax Rate');
                      getVS1Data('TTaxcodeVS1').then(function (dataObject) {
                        if(dataObject.length == 0){
                          sideBarService.getTaxCodesVS1().then(function (data) {
                            let lineItems = [];
                            let lineItemObj = {};
                            for(let i=0; i<data.ttaxcodevs1.length; i++){
                              if ((data.ttaxcodevs1[i].CodeName) === taxRateDataName) {
                                $('#edtTaxNamePop').attr('readonly', true);
                              let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                              var taxRateID = data.ttaxcodevs1[i].Id || '';
                               var taxRateName = data.ttaxcodevs1[i].CodeName ||'';
                               var taxRateDesc = data.ttaxcodevs1[i].Description || '';
                               $('#edtTaxID').val(taxRateID);
                               $('#edtTaxNamePop').val(taxRateName);
                               $('#edtTaxRatePop').val(taxRate);
                               $('#edtTaxDescPop').val(taxRateDesc);
                               setTimeout(function() {
                               $('#newTaxRateModal').modal('toggle');
                               }, 100);
                             }
                            }

                          }).catch(function (err) {
                              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                              $('.fullScreenSpin').css('display','none');
                              // Meteor._reload.reload();
                          });
                        }else{
                          let data = JSON.parse(dataObject[0].data);
                          let useData = data.ttaxcodevs1;
                          let lineItems = [];
                          let lineItemObj = {};
                          $('.taxcodepopheader').text('Edit Tax Rate');
                          for(let i=0; i<useData.length; i++){

                            if ((useData[i].CodeName) === taxRateDataName) {
                              $('#edtTaxNamePop').attr('readonly', true);
                            let taxRate = (useData[i].Rate * 100).toFixed(2);
                            var taxRateID = useData[i].Id || '';
                             var taxRateName = useData[i].CodeName ||'';
                             var taxRateDesc = useData[i].Description || '';
                             $('#edtTaxID').val(taxRateID);
                             $('#edtTaxNamePop').val(taxRateName);
                             $('#edtTaxRatePop').val(taxRate);
                             $('#edtTaxDescPop').val(taxRateDesc);
                             //setTimeout(function() {
                             $('#newTaxRateModal').modal('toggle');
                             //}, 500);
                           }
                          }
                        }
                      }).catch(function (err) {
                        sideBarService.getTaxCodesVS1().then(function (data) {
                          let lineItems = [];
                          let lineItemObj = {};
                          for(let i=0; i<data.ttaxcodevs1.length; i++){
                            if ((data.ttaxcodevs1[i].CodeName) === taxRateDataName) {
                              $('#edtTaxNamePop').attr('readonly', true);
                            let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                            var taxRateID = data.ttaxcodevs1[i].Id || '';
                             var taxRateName = data.ttaxcodevs1[i].CodeName ||'';
                             var taxRateDesc = data.ttaxcodevs1[i].Description || '';
                             $('#edtTaxID').val(taxRateID);
                             $('#edtTaxNamePop').val(taxRateName);
                             $('#edtTaxRatePop').val(taxRate);
                             $('#edtTaxDescPop').val(taxRateDesc);
                             setTimeout(function() {
                             $('#newTaxRateModal').modal('toggle');
                             }, 100);

                           }
                          }

                        }).catch(function (err) {
                            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                            $('.fullScreenSpin').css('display','none');
                            // Meteor._reload.reload();
                        });
                      });
                    } else {
                      $('#taxRateListModal').modal('toggle');
                      // var targetID = $(event.target).closest('tr').attr('id');
                      // $('#selectLineID').val(targetID);
                      setTimeout(function() {
                          $('#tblTaxRate_filter .form-control-sm').focus();
                          $('#tblTaxRate_filter .form-control-sm').val('');
                          $('#tblTaxRate_filter .form-control-sm').trigger("input");

                          var datatable = $('#tblTaxRate').DataTable();
                          datatable.draw();
                          $('#tblTaxRate_filter .form-control-sm').trigger("input");

                      }, 500);
                    }
                }
            });

        }, 1200);
    });

      $(document).on("click", "#termsList tbody tr", function (e) {
        let selectedTermsDropdownID = $('#selectLineID').val() || 'sltTerms';
          $('#'+selectedTermsDropdownID+'').val($(this).find(".colTermName").text());
          $('#termsListModal').modal('toggle');
      });

      $(document).on("click", "#paymentmethodList tbody tr", function(e) {
          let selectedDropdownID = $('#selectPaymentMethodLineID').val() || 'sltPreferedPayment';
         $('#'+selectedDropdownID+'').val($(this).find(".colName").text());
         $('#paymentMethodModal').modal('toggle');
     });

     $(document).on("click", "#clienttypeList tbody tr", function (e) {
       let selectedClientTypeDropdownID = $('#selectLineID').val() || 'sltCustomerType';
         $('#'+selectedClientTypeDropdownID+'').val($(this).find(".colClientTypeName").text());
         $('#clienttypeListModal').modal('toggle');
     });

     $(document).on("click", "#tblTaxRate tbody tr", function (e) {
       let selectedTaxRateDropdownID = $('#selectLineID').val() || 'sltTaxCode';
         $('#'+selectedTaxRateDropdownID+'').val($(this).find(".taxName").text());
         $('#taxRateListModal').modal('toggle');
     });
});


Template.customerscard.events({
    'click .tblJoblist tbody tr': function (event) {
        var listData = $(event.target).closest('tr').attr('id');
        if (listData) {
            window.open('/customerscard?jobid=' + listData, '_self');
        }
    },
    'click .openBalance': function (event) {
        let customerName = $('#edtCustomerCompany').val() || $('#edtJobCustomerCompany').val() || '';
        if(customerName != "") {
            if(customerName.indexOf('^') > 0) {
              customerName = customerName.split('^')[0]
            }
            window.open('/agedreceivables?contact='+customerName, '_self');
        } else {
            window.open('/agedreceivables','_self');
        }
    },
    'click #customerShipping-1': function (event) {
        if ($(event.target).is(':checked')) {
            $('.customerShipping-2').css('display', 'none');

        } else {
            $('.customerShipping-2').css('display', 'block');
        }
    },
    'click .btnBack': function (event) {
        // event.preventDefault();
        history.back(1);
      //  FlowRouter.go('/customerlist');
    },
    'click .btnSaveDept': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let contactService = new ContactService();

        //let headerDept = $('#sltDepartment').val();
        let custType = $('#edtClientTypeName').val();
        let typeDesc = $('#txaDescription').val() || '';
        if (custType === '') {
            swal('Client Type name cannot be blank!', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
        } else {
            let objDetails = {
                type: "TClientType",
                fields: {
                    TypeName: custType,
                    TypeDescription: typeDesc,
                }
            }
            contactService.saveClientTypeData(objDetails).then(function (objDetails) {
                sideBarService.getClientTypeData().then(function(dataReload) {
                    addVS1Data('TClientType', JSON.stringify(dataReload)).then(function (datareturn) {
                        Meteor._reload.reload();
                    }).catch(function (err) {
                        Meteor._reload.reload();
                    });
                }).catch(function (err) {
                    Meteor._reload.reload();
                });
                // Meteor._reload.reload();
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
                    } else if (result.dismiss === 'cancel') {

                    }
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }




        // if(deptID == ""){

        //     taxRateService.checkDepartmentByName(deptName).then(function (data) {
        //         deptID = data.tdeptclass[0].Id;
        //         objDetails = {
        //             type: "TDeptClass",
        //             fields: {
        //                 ID: deptID||0,
        //                 Active: true,
        //                 //DeptClassGroup: headerDept,
        //                 //DeptClassName: deptName,
        //                 Description: deptDesc,
        //                 SiteCode: siteCode,
        //                 StSClass: objStSDetails
        //             }
        //         };

        //         taxRateService.saveDepartment(objDetails).then(function (objDetails) {
        //             Meteor._reload.reload();
        //         }).catch(function (err) {
        //             swal({
        //                 title: 'Oooops...',
        //                 text: err,
        //                 type: 'error',
        //                 showCancelButton: false,
        //                 confirmButtonText: 'Try Again'
        //             }).then((result) => {
        //                 if (result.value) {
        //                     // Meteor._reload.reload();
        //                 } else if (result.dismiss === 'cancel') {

        //                 }
        //             });
        //             $('.fullScreenSpin').css('display','none');
        //         });

        //     }).catch(function (err) {
        //         objDetails = {
        //             type: "TDeptClass",
        //             fields: {
        //                 Active: true,
        //                 DeptClassName: deptName,
        //                 Description: deptDesc,
        //                 SiteCode: siteCode,
        //                 StSClass: objStSDetails
        //             }
        //         };

        //         taxRateService.saveDepartment(objDetails).then(function (objDetails) {
        //             Meteor._reload.reload();
        //         }).catch(function (err) {
        //             swal({
        //                 title: 'Oooops...',
        //                 text: err,
        //                 type: 'error',
        //                 showCancelButton: false,
        //                 confirmButtonText: 'Try Again'
        //             }).then((result) => {
        //                 if (result.value) {
        //                     // Meteor._reload.reload();
        //                 } else if (result.dismiss === 'cancel') {

        //                 }
        //             });
        //             $('.fullScreenSpin').css('display','none');
        //         });
        //     });

        // }else{
        //     objDetails = {
        //         type: "TDeptClass",
        //         fields: {
        //             ID: deptID,
        //             Active: true,
        //             //  DeptClassGroup: headerDept,
        //             DeptClassName: deptName,
        //             Description: deptDesc,
        //             SiteCode: siteCode,
        //             StSClass: objStSDetails
        //         }
        //     };

        //     taxRateService.saveDepartment(objDetails).then(function (objDetails) {
        //         Meteor._reload.reload();
        //     }).catch(function (err) {
        //         swal({
        //             title: 'Oooops...',
        //             text: err,
        //             type: 'error',
        //             showCancelButton: false,
        //             confirmButtonText: 'Try Again'
        //         }).then((result) => {
        //             if (result.value) {
        //                 // Meteor._reload.reload();
        //             } else if (result.dismiss === 'cancel') {

        //             }
        //         });
        //         $('.fullScreenSpin').css('display','none');
        //     });
        // }




    },
    'click #chkSameAsShipping': function (event) {
        /*if($(event.target).is(':checked')){
      let streetAddress = $('#edtCustomerShippingAddress').val();
      let city = $('#edtCustomerShippingCity').val();
      let state =  $('#edtCustomerShippingState').val();
      let zipcode =  $('#edtCustomerShippingZIP').val();
      let country =  $('#sedtCountry').val();

       $('#edtCustomerBillingAddress').val(streetAddress);
       $('#edtCustomerBillingCity').val(city);
       $('#edtCustomerBillingState').val(state);
       $('#edtCustomerBillingZIP').val(zipcode);
       $('#bedtCountry').val(country);
    }else{
      $('#edtCustomerBillingAddress').val('');
      $('#edtCustomerBillingCity').val('');
      $('#edtCustomerBillingState').val('');
      $('#edtCustomerBillingZIP').val('');
      $('#bedtCountry').val('');
    }
    */
    },
    'click .btnSave': async function (event) {
        let templateObject = Template.instance();
        let contactService = new ContactService();
        $('.fullScreenSpin').css('display', 'inline-block');

        let company = $('#edtCustomerCompany').val();
        let email = $('#edtCustomerEmail').val();
        let title = $('#edtTitle').val();
        let firstname = $('#edtFirstName').val();
        let middlename = $('#edtMiddleName').val();
        let lastname = $('#edtLastName').val();
        // let suffix = $('#edtSuffix').val();
        let phone = $('#edtCustomerPhone').val();
        let mobile = $('#edtCustomerMobile').val();
        let fax = $('#edtCustomerFax').val();
        let accountno = $('#edtClientNo').val();
        let skype = $('#edtCustomerSkypeID').val();
        let website = $('#edtCustomerWebsite').val();



        let streetAddress = $('#edtCustomerShippingAddress').val();
        let city = $('#edtCustomerShippingCity').val();
        let state = $('#edtCustomerShippingState').val();
        let postalcode = $('#edtCustomerShippingZIP').val();
        let country = $('#sedtCountry').val();
        let bstreetAddress = '';
        let bcity = '';
        let bstate = '';
        let bzipcode = '';
        let bcountry = '';
        let isSupplier = false;
        if ($('#chkSameAsSupplier').is(':checked')) {
            isSupplier = true;
        }else{
            isSupplier = false;
        }
        if ($('#chkSameAsShipping2').is(':checked')) {
            bstreetAddress = streetAddress;
            bcity = city;
            bstate = state;
            bzipcode = postalcode;
            bcountry = country;
        } else {
            bstreetAddress = $('#edtCustomerBillingAddress').val();
            bcity = $('#edtCustomerBillingCity').val();
            bstate = $('#edtCustomerBillingState').val();
            bzipcode = $('#edtCustomerBillingZIP').val();
            bcountry = $('#bedtCountry').val();
        }

        let permanentDiscount = $('#edtCustomerCardDiscount').val()||0;

        let sltPaymentMethodName = $('#sltPreferedPayment').val();
        let sltTermsName = $('#sltTerms').val();
        let sltShippingMethodName = '';
        let rewardPointsOpeningBalance = $('#custOpeningBalance').val();
        // let sltRewardPointsOpeningDate =  $('#dtAsOf').val();

        var sltRewardPointsOpeningDate = new Date($("#dtAsOf").datepicker("getDate"));

        let openingDate = sltRewardPointsOpeningDate.getFullYear() + "-" + (sltRewardPointsOpeningDate.getMonth() + 1) + "-" + sltRewardPointsOpeningDate.getDate();

        let sltTaxCodeName = "";

        let isChecked = $(".chkTaxExempt").is(":checked");
        if (isChecked) {
            sltTaxCodeName = "NT";
        } else {
            sltTaxCodeName = $('#sltTaxCode').val();
        }


        let notes = $('#txaNotes').val();
        let custField1 = $('#edtCustomeField1').val();
        let custField2 = $('#edtCustomeField2').val();
        let custField3 = $('#edtCustomeField3').val();
        let custField4 = $('#edtCustomeField4').val();
        let customerType = $('#sltCustomerType').val()||'';
        let uploadedItems = templateObject.uploadedFiles.get();

        var url = FlowRouter.current().path;
        var getemp_id = url.split('?id=');
        var currentEmployee = getemp_id[getemp_id.length - 1];
        var objDetails = '';
        if (getemp_id[1]) {
            currentEmployee = parseInt(currentEmployee);
            objDetails = {
                type: "TCustomerEx",
                fields: {
                    ID: currentEmployee,
                    Title: title,
                    ClientName: company,
                    FirstName: firstname,
                    // MiddleName:middlename,
                    CUSTFLD10: middlename,
                    LastName: lastname,
                    PublishOnVS1: true,
                    Email: email,
                    Phone: phone,
                    Mobile: mobile,
                    SkypeName: skype,
                    Faxnumber: fax,
                    // Sex: gender,
                    ClientTypeName: customerType,
                    // Position: position,
                    Street: streetAddress,
                    Street2: city,
                    Suburb: city,
                    State: state,
                    PostCode: postalcode,
                    Country: country,

                    BillStreet: bstreetAddress,
                    BillStreet2: bcity,
                    BillState: bstate,
                    BillPostCode: bzipcode,
                    Billcountry: bcountry,
                    IsSupplier:isSupplier,
                    Notes: notes,
                    // CustFld1: custfield1,
                    // CustFld2: custfield2,
                    URL: website,
                    PaymentMethodName: sltPaymentMethodName,
                    TermsName: sltTermsName,
                    ShippingMethodName: sltShippingMethodName,
                    // RewardPointsOpeningBalance:parseInt(rewardPointsOpeningBalance),
                    // RewardPointsOpeningDate:openingDate,
                    TaxCodeName: sltTaxCodeName,
                    Attachments: uploadedItems,
                    CUSTFLD1: custField1,
                    CUSTFLD2: custField2,
                    CUSTFLD3: custField3,
                    CUSTFLD4: custField4,
                    Discount:parseFloat(permanentDiscount)||0
                }
            };

        } else {
            let custdupID = 0;
            let checkCustData = await contactService.getCheckCustomersData(company)||'';
            if(checkCustData != ''){
            if (checkCustData.tcustomer.length) {
                custdupID = checkCustData.tcustomer[0].Id;
                objDetails = {
                    type: "TCustomerEx",
                    fields: {
                        ID: custdupID || 0,
                        Title: title,
                        ClientName: company,
                        FirstName: firstname,
                        CUSTFLD10: middlename,
                        LastName: lastname,
                        PublishOnVS1: true,
                        Email: email,
                        Phone: phone,
                        Mobile: mobile,
                        SkypeName: skype,
                        Faxnumber: fax,
                        ClientTypeName: customerType,
                        Street: streetAddress,
                        Street2: city,
                        Suburb: city,
                        State: state,
                        PostCode: postalcode,
                        Country: country,
                        BillStreet: bstreetAddress,
                        BillStreet2: bcity,
                        BillState: bstate,
                        BillPostCode: bzipcode,
                        Billcountry: bcountry,
                        IsSupplier:isSupplier,
                        Notes: notes,
                        URL: website,
                        PaymentMethodName: sltPaymentMethodName,
                        TermsName: sltTermsName,
                        ShippingMethodName: sltShippingMethodName,
                        TaxCodeName: sltTaxCodeName,
                        Attachments: uploadedItems,
                        CUSTFLD1: custField1,
                        CUSTFLD2: custField2,
                        CUSTFLD3: custField3,
                        CUSTFLD4: custField4,
                        Discount:parseFloat(permanentDiscount)||0
                    }
                };
            } else {
                objDetails = {
                    type: "TCustomerEx",
                    fields: {
                        Title: title,
                        ClientName: company,
                        FirstName: firstname,
                        CUSTFLD10: middlename,
                        LastName: lastname,
                        PublishOnVS1: true,
                        Email: email,
                        Phone: phone,
                        Mobile: mobile,
                        SkypeName: skype,
                        Faxnumber: fax,
                        ClientTypeName: customerType,
                        Street: streetAddress,
                        Street2: city,
                        Suburb: city,
                        State: state,
                        PostCode: postalcode,
                        Country: country,
                        BillStreet: bstreetAddress,
                        BillStreet2: bcity,
                        BillState: bstate,
                        BillPostCode: bzipcode,
                        Billcountry: bcountry,
                        IsSupplier:isSupplier,
                        Notes: notes,
                        URL: website,
                        PaymentMethodName: sltPaymentMethodName,
                        TermsName: sltTermsName,
                        ShippingMethodName: sltShippingMethodName,
                        TaxCodeName: sltTaxCodeName,
                        Attachments: uploadedItems,
                        CUSTFLD1: custField1,
                        CUSTFLD2: custField2,
                        CUSTFLD3: custField3,
                        CUSTFLD4: custField4,
                        Discount:parseFloat(permanentDiscount)||0
                    }
                };
            };
          }else{
            objDetails = {
                type: "TCustomerEx",
                fields: {
                    Title: title,
                    ClientName: company,
                    FirstName: firstname,
                    CUSTFLD10: middlename,
                    LastName: lastname,
                    PublishOnVS1: true,
                    Email: email,
                    Phone: phone,
                    Mobile: mobile,
                    SkypeName: skype,
                    Faxnumber: fax,
                    ClientTypeName: customerType,
                    Street: streetAddress,
                    Street2: city,
                    Suburb: city,
                    State: state,
                    PostCode: postalcode,
                    Country: country,
                    BillStreet: bstreetAddress,
                    BillStreet2: bcity,
                    BillState: bstate,
                    BillPostCode: bzipcode,
                    Billcountry: bcountry,
                    IsSupplier:isSupplier,
                    Notes: notes,
                    URL: website,
                    PaymentMethodName: sltPaymentMethodName,
                    TermsName: sltTermsName,
                    ShippingMethodName: sltShippingMethodName,
                    TaxCodeName: sltTaxCodeName,
                    Attachments: uploadedItems,
                    CUSTFLD1: custField1,
                    CUSTFLD2: custField2,
                    CUSTFLD3: custField3,
                    CUSTFLD4: custField4,
                    Discount:parseFloat(permanentDiscount)||0
                }
            };
          }


        }

        contactService.saveCustomerEx(objDetails).then(function (objDetails) {
            let customerSaveID = objDetails.fields.ID;
            if (customerSaveID) {
                sideBarService.getAllCustomersDataVS1(initialBaseDataLoad,0).then(function (dataReload) {
                    addVS1Data('TCustomerVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                        window.open('/customerlist', '_self');
                    }).catch(function (err) {
                        window.open('/customerlist', '_self');
                    });
                }).catch(function (err) {
                    window.open('/customerlist', '_self');
                });

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
                } else if (result.dismiss === 'cancel') {

                }
            });
            $('.fullScreenSpin').css('display', 'none');
        });

    },
    'click .btnSaveJob': function (event) {
        let templateObject = Template.instance();
        let contactService = new ContactService();
        $('.fullScreenSpin').css('display', 'inline-block');

        let companyJob = $('#edtJobCustomerCompany').val();
        let companyParent = $('#edtParentJobCustomerCompany').val();

        let addressValid = false;
        let emailJob = $('#edtJobCustomerEmail').val();
        let titleJob = $('#edtJobTitle').val();
        let firstnameJob = $('#edtJobFirstName').val();
        let middlenameJob = $('#edtJobMiddleName').val();
        let lastnameJob = $('#edtJobLastName').val();
        // let suffixJob = $('#edtSuffix').val();
        let phoneJob = $('#edtJobCustomerPhone').val();
        let mobileJob = $('#edtJobCustomerMobile').val();
        let faxJob = $('#edtJobCustomerFax').val();
        // let accountnoJob = $('#edtClientNo').val();
        let skypeJob = $('#edtJobCustomerSkypeID').val();
        let websiteJob = $('#edtJobCustomerWebsite').val();

        let jobTitle = $('#edtJob_Title').val();
        let jobName = $('#edtJobName').val();
        let jobNumber = $('#edtJobNumber').val();
        let jobReg = $('#edtJobReg').val();



        let bstreetAddressJob = '';
        let bcityJob = '';
        let bstateJob = '';
        let bzipcodeJob = '';
        let bcountryJob = '';

        let streetAddressJob = '';
        let cityJob = '';
        let stateJob = '';
        let postalcodeJob = '';
        let countryJob = '';

        if ($('#chkJobSameAsShipping2').is(':checked')) {


            streetAddressJob = $('.tab-Job4 #edtJobCustomerShippingAddress').val();
            cityJob = $('.tab-Job4 #edtJobCustomerShippingCity').val();
            stateJob = $('.tab-Job4 #edtJobCustomerShippingState').val();
            postalcodeJob = $('.tab-Job4 #edtJobCustomerShippingZIP').val();
            countryJob = $('.tab-Job4 #sedtJobCountry').val();

            bstreetAddressJob = streetAddressJob;
            bcityJob = cityJob;
            bstateJob = stateJob;
            bzipcodeJob = postalcodeJob;
            bcountryJob = countryJob;
            addressValid = true;
        } else if ($('#chkJobSameAsShipping2NoPOP').is(':checked')) {
            streetAddressJob = $('#edtJobCustomerShippingAddress').val();
            cityJob = $('#edtJobCustomerShippingCity').val();
            stateJob = $('#edtJobCustomerShippingState').val();
            postalcodeJob = $('#edtJobCustomerShippingZIP').val();
            countryJob = $('#sedtJobCountry').val();

            bstreetAddressJob = streetAddressJob;
            bcityJob = cityJob;
            bstateJob = stateJob;
            bzipcodeJob = postalcodeJob;
            bcountryJob = countryJob;
        } else {
            bstreetAddressJob = $('#edtCustomerBillingAddress').val();
            bcityJob = $('#edtJobCustomerBillingCity').val();
            bstateJob = $('#edtJobCustomerBillingState').val();
            bzipcodeJob = $('#edtJobCustomerBillingZIP').val();
            bcountryJob = $('#sJobedtCountry').val();
        }



        let sltPaymentMethodNameJob = $('#sltJobPreferedPayment').val() || 'Cash';
        let sltTermsNameJob = $('#sltJobTerms').val();
        let sltShippingMethodNameJob = '';//$('#sltJobDeliveryMethod').val();
        let rewardPointsOpeningBalanceJob = $('#custJobOpeningBalance').val();

        var sltRewardPointsOpeningDateJob = new Date($("#dtJobAsOf").datepicker("getDate"));

        let openingDateJob = sltRewardPointsOpeningDateJob.getFullYear() + "-" + (sltRewardPointsOpeningDateJob.getMonth() + 1) + "-" + sltRewardPointsOpeningDateJob.getDate();

        // let sltTaxCodeNameJob =  $('#sltJobTaxCode').val();
        let uploadedItemsJob = templateObject.uploadedFilesJob.get();
        let uploadedItemsJobNoPOP = templateObject.uploadedFilesJobNoPOP.get();


        let sltTaxCodeNameJob = "";

        let isChecked = $(".chkJobTaxExempt").is(":checked");
        if (isChecked) {
            sltTaxCodeNameJob = "NT";
        } else {
            sltTaxCodeNameJob = $('#sltJobTaxCode').val();
        }


        let notesJob = $('#txaJobNotes').val();
        let customerTypeJob = $('#sltJobCustomerType').val();
        var objDetails = '';
        var url = FlowRouter.current().path;
        var getemp_id = url.split('?jobid=');
        var currentEmployeeJob = getemp_id[getemp_id.length - 1];
        var objDetails = '';
        if (getemp_id[1]) {

            objDetails = {
                type: "TJobEx",
                fields: {
                    ID: currentEmployeeJob,
                    Title: $('.jobTabEdit #edtJobTitle').val() || '',
                    //clientName:companyJob,
                    ParentClientName: $('.jobTabEdit #edtParentJobCustomerCompany').val() || '',
                    ParentCustomerName: $('.jobTabEdit #edtParentJobCustomerCompany').val() || '',
                    FirstName: $('.jobTabEdit #edtJobFirstName').val() || '',
                    MiddleName: $('.jobTabEdit #edtJobMiddleName').val() || '',
                    LastName: $('.jobTabEdit #edtJobLastName').val() || '',
                    Email: $('.jobTabEdit #edtJobCustomerEmail').val() || '',
                    Phone: $('.jobTabEdit #edtJobCustomerPhone').val() || '',
                    Mobile: $('.jobTabEdit #edtJobCustomerMobile').val() || '',
                    SkypeName: $('.jobTabEdit #edtJobCustomerSkypeID').val() || '',
                    Street: streetAddressJob,
                    Street2: cityJob,
                    State: stateJob,
                    PostCode: postalcodeJob,
                    Country: $('.tab-Job4 #sedtJobCountry').val(),
                    BillStreet: bstreetAddressJob,
                    BillStreet2: bcityJob,
                    BillState: bstateJob,
                    BillPostCode: bzipcodeJob,
                    Billcountry: bcountryJob,
                    Notes: $('.tab-Job5 #txaJobNotes').val(),
                    CUSTFLD9: $('.jobTabEdit #edtJobCustomerWebsite').val() || '',
                    PaymentMethodName: sltPaymentMethodNameJob,
                    TermsName: sltTermsNameJob,
                    ClientTypeName: customerTypeJob,
                    ShippingMethodName: sltShippingMethodNameJob,
                    // RewardPointsOpeningBalance:parseInt(rewardPointsOpeningBalanceJob),
                    // RewardPointsOpeningDate:openingDateJob,
                    TaxCodeName: sltTaxCodeNameJob,
                    // JobName:$('.jobTabEdit #edtJobName').val() || '',
                    Faxnumber: $('.jobTabEdit #edtJobCustomerFax').val() || '',
                    JobNumber: parseInt($('.jobTabEdit #edtJobNumber').val()) || 0,
                    // JobRegistration:$('.jobTabEdit #edtJobReg').val() || '',
                    // JobTitle:$('.jobTabEdit #edtJob_Title').val() || '',
                    Attachments: uploadedItemsJobNoPOP

                }
            };
        } else {
            objDetails = {
                type: "TJobEx",
                fields: {
                    Title: titleJob,
                    //clientName:companyJob,
                    ParentClientName: companyParent,
                    ParentCustomerName: companyParent,
                    FirstName: firstnameJob,
                    MiddleName: middlenameJob,
                    LastName: lastnameJob,
                    Email: emailJob,
                    Phone: phoneJob,
                    Mobile: mobileJob,
                    SkypeName: skypeJob,
                    Street: streetAddressJob,
                    Street2: cityJob,
                    State: stateJob,
                    PostCode: postalcodeJob,
                    Country: countryJob,
                    BillStreet: bstreetAddressJob,
                    BillStreet2: bcityJob,
                    BillState: bstateJob,
                    BillPostCode: bzipcodeJob,
                    Billcountry: bcountryJob,
                    Notes: notesJob,
                    CUSTFLD9: websiteJob,
                    PaymentMethodName: sltPaymentMethodNameJob,
                    TermsName: sltTermsNameJob,
                    ClientTypeName: customerTypeJob,
                    ShippingMethodName: sltShippingMethodNameJob,
                    // RewardPointsOpeningBalance:parseInt(rewardPointsOpeningBalanceJob),
                    // RewardPointsOpeningDate:openingDateJob,
                    TaxCodeName: sltTaxCodeNameJob,
                    Faxnumber: faxJob,
                    JobName: jobName,
                    JobNumber: parseFloat(jobNumber) || 0,
                    // JobRegistration:jobReg,
                    // JobTitle:jobTitle,
                    Attachments: uploadedItemsJob

                }
            };
        }

        contactService.saveJobEx(objDetails).then(function (objDetails) {
          $('.modal-backdrop').css('display','none');
            sideBarService.getAllJobssDataVS1(initialBaseDataLoad,0).then(function (dataReload) {
                addVS1Data('TJobVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                    FlowRouter.go('/joblist?success=true');
                }).catch(function (err) {
                    FlowRouter.go('/joblist?success=true');
                });
            }).catch(function (err) {
                FlowRouter.go('/joblist?success=true');
            });

            sideBarService.getAllCustomersDataVS1(initialBaseDataLoad,0).then(function (dataReload) {
                addVS1Data('TCustomerVS1', JSON.stringify(dataReload)).then(function (datareturn) {

                }).catch(function (err) {

                });
            }).catch(function (err) {

            });
            // let customerSaveID = FlowRouter.current().queryParams;
            //   if(!isNaN(customerSaveID.id)){
            //         window.open('/customerscard?id=' + customerSaveID,'_self');
            //    }else if(!isNaN(customerSaveID.jobid)){
            //      window.open('/customerscard?jobid=' + customerSaveID,'_self');
            //    }else{
            //
            //    }
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
                } else if (result.dismiss === 'cancel') {

                }
            });
            $('.fullScreenSpin').css('display', 'none');
        });

    },
    'keyup .search': function (event) {
        var searchTerm = $(".search").val();
        var listItem = $('.results tbody').children('tr');
        var searchSplit = searchTerm.replace(/ /g, "'):containsi('");

        $.extend($.expr[':'], {
            'containsi': function (elem, i, match, array) {
                return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
            }
        });

        $(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function (e) {
            $(this).attr('visible', 'false');
        });

        $(".results tbody tr:containsi('" + searchSplit + "')").each(function (e) {
            $(this).attr('visible', 'true');
        });

        var jobCount = $('.results tbody tr[visible="true"]').length;
        $('.counter').text(jobCount + ' items');

        if (jobCount == '0') { $('.no-result').show(); }
        else {
            $('.no-result').hide();
        }
        if (searchTerm === "") {
            $(".results tbody tr").each(function (e) {
                $(this).attr('visible', 'true');
                $('.no-result').hide();
            });

            //setTimeout(function () {
            var rowCount = $('.results tbody tr').length;
            $('.counter').text(rowCount + ' items');
            //}, 500);
        }

    },
    'click .tblCustomerSideList tbody tr': function (event) {

        var custLineID = $(event.target).attr('id');
        var custLineClass = $(event.target).attr('class');

        if (custLineID) {
            if (custLineClass == 'true') {
                window.open('/customerscard?jobid=' + custLineID, '_self');
            } else {
                window.open('/customerscard?id=' + custLineID, '_self');
            }

        }
    },
    'click .chkDatatable': function (event) {
        var columns = $('#tblTransactionlist th');
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
        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblTransactionlist' });
                if (checkPrefDetails) {
                    CloudPreference.remove({ _id: checkPrefDetails._id }, function (err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable': function (event) {
        let lineItems = [];
        //let datatable =$('#tblTransactionlist').DataTable();
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
        //datatable.state.save();

        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblTransactionlist' });
                if (checkPrefDetails) {
                    CloudPreference.update({ _id: checkPrefDetails._id }, {
                        $set: {
                            userid: clientID, username: clientUsername, useremail: clientEmail,
                            PrefGroup: 'salesform', PrefName: 'tblTransactionlist', published: true,
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
                        userid: clientID, username: clientUsername, useremail: clientEmail,
                        PrefGroup: 'salesform', PrefName: 'tblTransactionlist', published: true,
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

        var datable = $('#tblTransactionlist').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function (event) {
        let range = $(event.target).val();
        // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblTransactionlist th');
        $.each(datable, function (i, v) {
            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettingsCustomer': function (event) {
        let templateObject = Template.instance();
        var columns = $('#tblTransactionlist th');

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
    'click #exportbtn': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblTransactionlist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .printConfirm': function (event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblTransactionlist_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click #exportbtnJob': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblJoblist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .printConfirmJob': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblJoblist_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .btnRefresh': function () {
        Meteor._reload.reload();
    },
    'click .btnRefreshTransaction': function () {
        let currentId = FlowRouter.current().queryParams;
        $('.fullScreenSpin').css('display', 'inline-block');
        sideBarService.getTTransactionListReport().then(function (data) {
            addVS1Data('TTransactionListReport', JSON.stringify(data)).then(function (datareturn) {
                if (!isNaN(currentId.jobid)) {
                    window.open('/customerscard?jobid=' + currentId.jobid +'&transTab=active', '_self');
                }

                if (!isNaN(currentId.id)) {
                    window.open('/customerscard?id=' + currentId.id +'&transTab=active', '_self');
                }

            }).catch(function (err) {
                if (!isNaN(currentId.jobid)) {
                    window.open('/customerscard?jobid=' + currentId.jobid +'&transTab=active', '_self');
                }

                if (!isNaN(currentId.id)) {
                    window.open('/customerscard?id=' + currentId.id +'&transTab=active', '_self');
                }
            });
        }).catch(function (err) {
            if (!isNaN(currentId.jobid)) {
                window.open('/customerscard?jobid=' + currentId.jobid +'&transTab=active', '_self');
            }

            if (!isNaN(currentId.id)) {
                window.open('/customerscard?id=' + currentId.id +'&transTab=active', '_self');
            }
        });
    },
    'click .btnRefreshJobDetails': function () {
        let currentId = FlowRouter.current().queryParams;
        $('.fullScreenSpin').css('display', 'inline-block');
        sideBarService.getAllJobssDataVS1(initialBaseDataLoad,0).then(function (data) {
            addVS1Data('TJobVS1', JSON.stringify(data)).then(function (datareturn) {
                if (!isNaN(currentId.jobid)) {
                    window.open('/customerscard?jobid=' + currentId.jobid +'&transTab=job', '_self');
                }

                if (!isNaN(currentId.id)) {
                    window.open('/customerscard?id=' + currentId.id +'&transTab=job', '_self');
                }

            }).catch(function (err) {
                if (!isNaN(currentId.jobid)) {
                    window.open('/customerscard?jobid=' + currentId.jobid +'&transTab=job', '_self');
                }

                if (!isNaN(currentId.id)) {
                    window.open('/customerscard?id=' + currentId.id +'&transTab=job', '_self');
                }
            });
        }).catch(function (err) {
            if (!isNaN(currentId.jobid)) {
                window.open('/customerscard?jobid=' + currentId.jobid +'&transTab=job', '_self');
            }

            if (!isNaN(currentId.id)) {
                window.open('/customerscard?id=' + currentId.id +'&transTab=job', '_self');
            }
        });
    },
    'click #formCheck-2': function () {
        if ($(event.target).is(':checked')) {
            $('#autoUpdate').css('display', 'none');
        } else {
            $('#autoUpdate').css('display', 'block');
        }
    },

    'click #formCheckJob-2': function () {
        if ($(event.target).is(':checked')) {
            $('#autoUpdateJob').css('display', 'none');
        } else {
            $('#autoUpdateJob').css('display', 'block');
        }
    },

    'click #activeChk': function () {
        if ($(event.target).is(':checked')) {
            $('#customerInfo').css('color', '#00A3D3');
        } else {
            $('#customerInfo').css('color', '#b7b9cc !important');
        }
    },

    'click #btnNewProject': function (event) {
        var x2 = document.getElementById("newProject");
        if (x2.style.display === "none") {
            x2.style.display = "block";
        } else {
            x2.style.display = "none";
        }
    },
    'keydown #custOpeningBalance, keydown #edtJobNumber, keydown #edtCustomerCardDiscount': function (event) {
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
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189) {
        } else {
            event.preventDefault();
        }
    },
    'click .new_attachment_btn': function (event) {
        $('#attachment-upload').trigger('click');

    },
    'click #formCheck-one': function (event) {
        if ($(event.target).is(':checked')) {
            $('.checkbox1div').css('display', 'block');

        } else {
            $('.checkbox1div').css('display', 'none');
        }
    },
    'click #formCheck-two': function (event) {
        if ($(event.target).is(':checked')) {
            $('.checkbox2div').css('display', 'block');

        } else {
            $('.checkbox2div').css('display', 'none');
        }
    },
    'click #formCheck-three': function (event) {
        if ($(event.target).is(':checked')) {
            $('.checkbox3div').css('display', 'block');

        } else {
            $('.checkbox3div').css('display', 'none');
        }
    },
    'click #formCheck-four': function (event) {
        if ($(event.target).is(':checked')) {
            $('.checkbox4div').css('display', 'block');

        } else {
            $('.checkbox4div').css('display', 'none');
        }
    },
    'blur .customField1Text': function (event) {
        var inputValue1 = $('.customField1Text').text();
        $('.lblCustomField1').text(inputValue1);
    },
    'blur .customField2Text': function (event) {
        var inputValue2 = $('.customField2Text').text();
        $('.lblCustomField2').text(inputValue2);
    },
    'blur .customField3Text': function (event) {
        var inputValue3 = $('.customField3Text').text();
        $('.lblCustomField3').text(inputValue3);
    },
    'blur .customField4Text': function (event) {
        var inputValue4 = $('.customField4Text').text();
        $('.lblCustomField4').text(inputValue4);
    },
    'click .btnSaveSettings': function (event) {
        let templateObject = Template.instance();
        $('.lblCustomField1').html('');
        $('.lblCustomField2').html('');
        $('.lblCustomField3').html('');
        $('.lblCustomField4').html('');
        let getchkcustomField1 = true;
        let getchkcustomField2 = true;
        let getchkcustomField3 = true;
        let getchkcustomField4 = true;
        let getcustomField1 = $('.customField1Text').html();
        let getcustomField2 = $('.customField2Text').html();
        let getcustomField3 = $('.customField3Text').html();
        let getcustomField4 = $('.customField4Text').html();
        if ($('#formCheck-one').is(':checked')) {
            getchkcustomField1 = false;
        }
        if ($('#formCheck-two').is(':checked')) {
            getchkcustomField2 = false;
        }
        if ($('#formCheck-three').is(':checked')) {
            getchkcustomField3 = false;
        }
        if ($('#formCheck-four').is(':checked')) {
            getchkcustomField4 = false;
        }

        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'customerscard' });
                if (checkPrefDetails) {
                    CloudPreference.update({ _id: checkPrefDetails._id }, {
                        $set: {
                            username: clientUsername, useremail: clientEmail,
                            PrefGroup: 'contactform', PrefName: 'customerscard', published: true,
                            customFields: [{
                                index: '1',
                                label: getcustomField1,
                                hidden: getchkcustomField1
                            }, {
                                index: '2',
                                label: getcustomField2,
                                hidden: getchkcustomField2
                            }, {
                                index: '3',
                                label: getcustomField3,
                                hidden: getchkcustomField3
                            }, {
                                index: '4',
                                label: getcustomField4,
                                hidden: getchkcustomField4
                            }
                                          ],
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
                        if (err) {
                            $('#customfieldModal').modal('toggle');
                        } else {
                            $('#customfieldModal').modal('toggle');
                            $('.btnSave').trigger('click');
                        }
                    });
                } else {
                    CloudPreference.insert({
                        userid: clientID, username: clientUsername, useremail: clientEmail,
                        PrefGroup: 'contactform', PrefName: 'customerscard', published: true,
                        customFields: [{
                            index: '1',
                            label: getcustomField1,
                            hidden: getchkcustomField1
                        }, {
                            index: '2',
                            label: getcustomField2,
                            hidden: getchkcustomField2
                        }, {
                            index: '3',
                            label: getcustomField3,
                            hidden: getchkcustomField3
                        }, {
                            index: '4',
                            label: getcustomField4,
                            hidden: getchkcustomField4
                        }
                                      ],
                        createdAt: new Date()
                    }, function (err, idTag) {
                        if (err) {
                            $('#customfieldModal').modal('toggle');
                        } else {
                            $('#customfieldModal').modal('toggle');
                            $('.btnSave').trigger('click');

                        }
                    });
                }
            }
        }

    },
    'click .btnResetSettings': function (event) {
        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'customerscard' });

                if (checkPrefDetails) {
                    CloudPreference.remove({ _id: checkPrefDetails._id }, function (err, idTag) {
                        if (err) {

                        } else {
                            let customerSaveID = FlowRouter.current().queryParams;
                            if (!isNaN(customerSaveID.id)) {
                                window.open('/customerscard?id=' + customerSaveID, '_self');
                            } else if (!isNaN(customerSaveID.jobid)) {
                                window.open('/customerscard?jobid=' + customerSaveID, '_self');
                            } else {
                                window.open('/customerscard', '_self');
                            }
                            //Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .new_attachment_btn': function (event) {
        $('#attachment-upload').trigger('click');

    },
    'change #attachment-upload': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUploadTabs(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .img_new_attachment_btn': function (event) {
        $('#img-attachment-upload').trigger('click');

    },
    'change #img-attachment-upload': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#img-attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .remove-attachment': function (event, ui) {
        let tempObj = Template.instance();
        let attachmentID = parseInt(event.target.id.split('remove-attachment-')[1]);
        if (tempObj.$("#confirm-action-" + attachmentID).length) {
            tempObj.$("#confirm-action-" + attachmentID).remove();
        } else {
            let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID + '"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-' + attachmentID + '">'
            + 'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-name-' + attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltip").show();

    },
    'click .file-name': function (event) {
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-name-')[1]);
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFiles.get();

        $('#myModalAttachment').modal('hide');
        let previewFile = {};
        let input = uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:' + input + ';base64,' + uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type = uploadedFiles[attachmentID].fields.Description;
        if (type === 'application/pdf') {
            previewFile.class = 'pdf-class';
        } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            previewFile.class = 'docx-class';
        }
        else if (type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        }
        else if (type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            previewFile.class = 'ppt-class';
        }
        else if (type === 'application/vnd.oasis.opendocument.formula' || type === 'text/csv' || type === 'text/plain' || type === 'text/rtf') {
            previewFile.class = 'txt-class';
        }
        else if (type === 'application/zip' || type === 'application/rar' || type === 'application/x-zip-compressed' || type === 'application/x-zip,application/x-7z-compressed') {
            previewFile.class = 'zip-class';
        }
        else {
            previewFile.class = 'default-class';
        }

        if (type.split('/')[0] === 'image') {
            previewFile.image = true
        } else {
            previewFile.image = false
        }
        templateObj.uploadedFile.set(previewFile);

        $('#files_view').modal('show');

        return;
    },
    'click .confirm-delete-attachment': function (event, ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltip").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachment-')[1]);
        let uploadedArray = tempObj.uploadedFiles.get();
        let attachmentCount = tempObj.attachmentCount.get();
        $('#attachment-upload').val('');
        uploadedArray.splice(attachmentID, 1);
        tempObj.uploadedFiles.set(uploadedArray);
        attachmentCount--;
        if (attachmentCount === 0) {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-display').html(elementToAdd);
        }
        tempObj.attachmentCount.set(attachmentCount);
        if (uploadedArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentTabs(uploadedArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click .attachmentTab': function () {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFiles.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentTabs(uploadedFileArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click .new_attachment_btnJobPOP': function (event) {
        $('#attachment-uploadJobPOP').trigger('click');

    },
    'change #attachment-uploadJobPOP': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFilesJob.get();


        let myFiles = $('#attachment-uploadJobPOP')[0].files;

        let uploadData = utilityService.attachmentUploadJob(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);

        templateObj.uploadedFilesJob.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCountJob.set(uploadData.totalAttachments);
    },
    'click .remove-attachmentJobPOP': function (event, ui) {
        let tempObj = Template.instance();
        let attachmentID = parseInt(event.target.id.split('remove-attachmentJobPOP-')[1]);
        if (tempObj.$("#confirm-actionJobPOP-" + attachmentID).length) {
            tempObj.$("#confirm-actionJobPOP-" + attachmentID).remove();
        } else {
            let actionElement = '<div class="confirm-actionJobPOP" id="confirm-actionJobPOP-' + attachmentID + '"><a class="confirm-delete-attachmentJobPOP btn btn-default" id="delete-attachmentJobPOP-' + attachmentID + '">'
            + 'Delete</a><button class="save-to-libraryJobPOP btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-nameJobPOP-' + attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltipJobPOP").show();

    },
    'click .file-nameJobPOP': function (event) {
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-nameJobPOP-')[1]);
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFilesJob.get();

        $('#myModalAttachmentJobPOP').modal('hide');
        let previewFile = {};
        let input = uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:' + input + ';base64,' + uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type = uploadedFiles[attachmentID].fields.Description;
        if (type === 'application/pdf') {
            previewFile.class = 'pdf-class';
        } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            previewFile.class = 'docx-class';
        }
        else if (type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        }
        else if (type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            previewFile.class = 'ppt-class';
        }
        else if (type === 'application/vnd.oasis.opendocument.formula' || type === 'text/csv' || type === 'text/plain' || type === 'text/rtf') {
            previewFile.class = 'txt-class';
        }
        else if (type === 'application/zip' || type === 'application/rar' || type === 'application/x-zip-compressed' || type === 'application/x-zip,application/x-7z-compressed') {
            previewFile.class = 'zip-class';
        }
        else {
            previewFile.class = 'default-class';
        }

        if (type.split('/')[0] === 'image') {
            previewFile.image = true
        } else {
            previewFile.image = false
        }
        templateObj.uploadedFileJob.set(previewFile);

        $('#files_viewJobPOP').modal('show');

        return;
    },
    'click .confirm-delete-attachmentJobPOP': function (event, ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltipJobPOP").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachmentJobPOP-')[1]);
        let uploadedArray = tempObj.uploadedFilesJob.get();
        let attachmentCount = tempObj.attachmentCountJob.get();
        $('#attachment-uploadJobPOP').val('');
        uploadedArray.splice(attachmentID, 1);
        tempObj.uploadedFilesJob.set(uploadedArray);
        attachmentCount--;
        if (attachmentCount === 0) {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-displayJobPOP').html(elementToAdd);
        }
        tempObj.attachmentCountJob.set(attachmentCount);
        if (uploadedArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentJob(uploadedArray);
        } else {
            $(".attchment-tooltipJobPOP").show();
        }
    },
    'click .attachmentTabJobPOP': function () {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFilesJob.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentJob(uploadedFileArray);
        } else {
            $(".attchment-tooltipJobPOP").show();
        }
    },
    'click .new_attachment_btnJobNoPOP': function (event) {
        $('#attachment-uploadJobNoPOP').trigger('click');

    },
    'change #attachment-uploadJobNoPOP': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArrayJob = templateObj.uploadedFilesJobNoPOP.get();


        let myFiles = $('#attachment-uploadJobNoPOP')[0].files;

        let uploadData = utilityService.attachmentUploadJobNoPOP(uploadedFilesArrayJob, myFiles, saveToTAttachment, lineIDForAttachment);


        templateObj.uploadedFilesJobNoPOP.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCountJobNoPOP.set(uploadData.totalAttachments);
    },
    'click .remove-attachmentJobNoPOP': function (event, ui) {
        let tempObj = Template.instance();
        let attachmentID = parseInt(event.target.id.split('remove-attachmentJobNoPOP-')[1]);
        if (tempObj.$("#confirm-actionJobNoPOP-" + attachmentID).length) {
            tempObj.$("#confirm-actionJobNoPOP-" + attachmentID).remove();
        } else {
            let actionElement = '<div class="confirm-actionJobNoPOP" id="confirm-actionJobNoPOP-' + attachmentID + '"><a class="confirm-delete-attachmentJobNoPOP btn btn-default" id="delete-attachmentJobNoPOP-' + attachmentID + '">'
            + 'Delete</a><button class="save-to-libraryJobNoPOP btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-nameJobNoPOP-' + attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltipJobNoPOP").show();

    },
    'click .file-nameJobNoPOP': function (event) {
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-nameJobNoPOP-')[1]);
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFilesJobNoPOP.get();

        //$('#myModalAttachmentJobNoPOP').modal('hide');
        let previewFile = {};
        let input = uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:' + input + ';base64,' + uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type = uploadedFiles[attachmentID].fields.Description;
        if (type === 'application/pdf') {
            previewFile.class = 'pdf-class';
        } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            previewFile.class = 'docx-class';
        }
        else if (type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        }
        else if (type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            previewFile.class = 'ppt-class';
        }
        else if (type === 'application/vnd.oasis.opendocument.formula' || type === 'text/csv' || type === 'text/plain' || type === 'text/rtf') {
            previewFile.class = 'txt-class';
        }
        else if (type === 'application/zip' || type === 'application/rar' || type === 'application/x-zip-compressed' || type === 'application/x-zip,application/x-7z-compressed') {
            previewFile.class = 'zip-class';
        }
        else {
            previewFile.class = 'default-class';
        }

        if (type.split('/')[0] === 'image') {
            previewFile.image = true
        } else {
            previewFile.image = false
        }
        templateObj.uploadedFileJobNoPOP.set(previewFile);

        $('#files_viewJobNoPOP').modal('show');

        return;
    },
    'click .confirm-delete-attachmentJobNoPOP': function (event, ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltipJobNoPOP").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachmentJobNoPOP-')[1]);
        let uploadedArray = tempObj.uploadedFilesJobNoPOP.get();
        let attachmentCount = tempObj.attachmentCountJobNoPOP.get();
        $('#attachment-uploadJobNoPOP').val('');
        uploadedArray.splice(attachmentID, 1);
        tempObj.uploadedFilesJobNoPOP.set(uploadedArray);
        attachmentCount--;
        if (attachmentCount === 0) {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-displayJobNoPOP').html(elementToAdd);
        }
        tempObj.attachmentCountJobNoPOP.set(attachmentCount);
        if (uploadedArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentJobNoPOP(uploadedArray);
        } else {
            $(".attchment-tooltipJobNoPOP").show();
        }
    },
    'click .attachmentTabJobNoPOP': function () {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFilesJobNoPOP.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentJobNoPOP(uploadedFileArray);
        } else {
            $(".attchment-tooltipJobNoPOP").show();
        }
    },
    'change .customerTypeSelect': function (event) {
        var custName = $('.customerTypeSelect').children("option:selected").val();
        if (custName == "newCust") {
            $('#myModalClientType').modal();
            $(this).prop("selected", false);
        }
    },
    'click #btnNewJob': function (event) {
        let templateObject = Template.instance();
        templateObject.getAllJobsIds();
    },
    'click .btnNewCustomer': function (event) {
        window.open('/customerscard', '_self');
    },
    'click .btnView': function (e) {
        var btnView = document.getElementById("btnView");
        var btnHide = document.getElementById("btnHide");

        var displayList = document.getElementById("displayList");
        var displayInfo = document.getElementById("displayInfo");
        if (displayList.style.display === "none") {
            displayList.style.display = "flex";
            $("#displayInfo").removeClass("col-12");
            $("#displayInfo").addClass("col-9");
            btnView.style.display = "none";
            btnHide.style.display = "flex";
        } else {
            displayList.style.display = "none";
            $("#displayInfo").removeClass("col-9");
            $("#displayInfo").addClass("col-12");
            btnView.style.display = "flex";
            btnHide.style.display = "none";
        }
    },
    'click .btnDeleteCustomer': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');

        let templateObject = Template.instance();
        let contactService2 = new ContactService();

        let currentId = FlowRouter.current().queryParams;
        var objDetails = '';

        if (!isNaN(currentId.id)) {
            currentCustomer = parseInt(currentId.id);
            objDetails = {
                type: "TCustomerEx",
                fields: {
                    ID: currentCustomer,
                    Active: false
                }
            };

            contactService2.saveCustomerEx(objDetails).then(function (objDetails) {
                FlowRouter.go('/customerlist?success=true');
            }).catch(function (err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                    } else if (result.dismiss === 'cancel') {

                    }
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            FlowRouter.go('/customerlist?success=true');
        }
        $('#deleteCustomerModal').modal('toggle');
    }
});

Template.customerscard.helpers({
    record: () => {
        return Template.instance().records.get();
    },
    countryList: () => {
        return Template.instance().countryData.get();
    },
    customerrecords: () => {
        return Template.instance().customerrecords.get().sort(function (a, b) {
            if (a.company == 'NA') {
                return 1;
            }
            else if (b.company == 'NA') {
                return -1;
            }
            return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
        });
    },
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.saledate == 'NA') {
                return 1;
            }
            else if (b.saledate == 'NA') {
                return -1;
            }
            return (a.saledate.toUpperCase() > b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    datatablerecordsjob: () => {
        return Template.instance().datatablerecordsjob.get().sort(function (a, b) {
            if (a.company == 'NA') {
                return 1;
            }
            else if (b.company == 'NA') {
                return -1;
            }
            return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    tableheaderrecordsjob: () => {
        return Template.instance().tableheaderrecordsjob.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: Session.get('mycloudLogonID'), PrefName: 'tblSalesOverview' });
    },
    currentdate: () => {
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        return begunDate;
    },
    isJob: () => {
        return Template.instance().isJob.get();
    },
    preferedPaymentList: () => {
        return Template.instance().preferedPaymentList.get();
    },
    termsList: () => {
        return Template.instance().termsList.get();
    },
    deliveryMethodList: () => {
        return Template.instance().deliveryMethodList.get();
    },
    clienttypeList: () => {
        return Template.instance().clienttypeList.get().sort(function (a, b) {
            if (a == 'NA') {
                return 1;
            }
            else if (b == 'NA') {
                return -1;
            }
            return (a.toUpperCase() > b.toUpperCase()) ? 1 : -1;
        });
    },
    taxCodeList: () => {
        return Template.instance().taxCodeList.get();
    },
    uploadedFiles: () => {
        return Template.instance().uploadedFiles.get();
    },
    attachmentCount: () => {
        return Template.instance().attachmentCount.get();
    },
    uploadedFile: () => {
        return Template.instance().uploadedFile.get();
    },
    uploadedFilesJob: () => {
        return Template.instance().uploadedFilesJob.get();
    },
    attachmentCountJob: () => {
        return Template.instance().attachmentCountJob.get();
    },
    uploadedFileJob: () => {
        return Template.instance().uploadedFileJob.get();
    },
    uploadedFilesJobNoPOP: () => {
        return Template.instance().uploadedFilesJobNoPOP.get();
    },
    attachmentCountJobNoPOP: () => {
        return Template.instance().attachmentCountJobNoPOP.get();
    },
    uploadedFileJobNoPOP: () => {
        return Template.instance().uploadedFileJobNoPOP.get();
    },
    currentAttachLineID: () => {
        return Template.instance().currentAttachLineID.get();
    },
    contactCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: Session.get('mycloudLogonID'), PrefName: 'customerscard' });
    },
    isSameAddress: () => {
        return Template.instance().isSameAddress.get();
    },
    isJobSameAddress: () => {
        return Template.instance().isJobSameAddress.get();
    },
    isMobileDevices: () => {
        var isMobile = false; //initiate as false
        // device detection
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }

        return isMobile;
    }
});
