import { ContactService } from "./contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { UtilityService } from "../utility-service";
import { Random } from 'meteor/random';
import { SideBarService } from '../js/sidebar-service';
import {OrganisationService} from '../js/organisation-service';
import '../lib/global/indexdbstorage.js';
import { jsPDF } from 'jspdf';
import 'jQuery.print/jQuery.print.js';
import { autoTable } from 'jspdf-autotable';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();

let statementMailObj = {};
Template.statementlist.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords1 = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.statmentprintrecords = new ReactiveVar([]);
    templateObject.multiplepdfemail = new ReactiveVar([]);
    templateObject.pdfData = new ReactiveVar([]);
    templateObject.accountID = new ReactiveVar();
    templateObject.stripe_fee_method = new ReactiveVar();

});

Template.statementlist.onRendered(function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    // $('.printConfirm').css('display','none');

    let templateObject = Template.instance();
    let contactService = new ContactService();
    let organisationService = new OrganisationService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblCustomerlist', function (error, result) {
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
    });
     var today = moment().format('DD/MM/YYYY');
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
    $("#dtSODate").val(begunDate);
    templateObject.getOrganisationDetails = function () {

        let account_id = Session.get('vs1companyStripeID') || '';
        let stripe_fee = Session.get('vs1companyStripeFeeMethod') || 'apply';
        templateObject.accountID.set(account_id);
        templateObject.stripe_fee_method.set(stripe_fee);
    }

    templateObject.getOrganisationDetails();
    templateObject.getStatePrintData = async function (clientID) {
        //getOneInvoicedata
        let data = await contactService.getCustomerStatementPrintData(clientID);
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#printstatmentdesign').css('display', 'block');
        let lineItems = [];
        let lineItemObj = {};
        let lineItemsTable = [];
        let lineItemTableObj = {};

        if (data.tstatementforcustomer.length) {
            let lineItems = [];
            let balance = data.tstatementforcustomer[0].closingBalance;
            let stripe_id = templateObject.accountID.get();
            let stripe_fee_method = templateObject.stripe_fee_method.get();
            var erpGet = erpDb();
            let company = Session.get('vs1companyName');
            let vs1User = localStorage.getItem('mySession');
            let dept = "Head Office";

            let customerName = data.tstatementforcustomer[0].CustomerName;
            let openingbalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[0].OpeningBalance);
            let closingbalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[0].closingBalance);
            let customerphone = data.tstatementforcustomer[0].Phone || '';
            let customername = data.tstatementforcustomer[0].ClientName || '';
            let billaddress = data.tstatementforcustomer[0].BillStreet || '';
            let billstate = data.tstatementforcustomer[0].BillState || '';
            let billcountry = data.tstatementforcustomer[0].BillCountry || '';
            let statementId = data.tstatementforcustomer[0].TranstypeNo || '';
            let email = data.tstatementforcustomer[0].Email || '';
            let invoiceId = data.tstatementforcustomer[0].SaleID || '';
            let date = moment(data.tstatementforcustomer[0].transdate).format('DD/MM/YYYY') || '';
            let datedue = moment(data.tstatementforcustomer[0].Duedate).format('DD/MM/YYYY') || '';
            // let paidAmt = data.tstatementforcustomer[0].Paidamt || '';
            let paidAmt = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[0].Paidamt).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
            let stringQuery = "?";
            for (let i = 0; i < data.tstatementforcustomer.length; i++) {
                let id = data.tstatementforcustomer[i].SaleID;
                let transdate =  moment(data.tstatementforcustomer[i].transdate).format('DD/MM/YYYY') ? moment(data.tstatementforcustomer[i].transdate).format('DD/MM/YYYY') : "";
                let type = data.tstatementforcustomer[i].Transtype;
                let status = '';
                // let type = data.tstatementforcustomer[i].Transtype;
                let total = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].Amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].Amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                let balance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].Amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });

                lineItemObj = {
                    lineID: id,
                    id: id || '',
                    date: transdate || '',
                    duedate: datedue,
                    type: type || '',
                    total: total || 0,
                    paidamt:paidAmt || 0,
                    totalPaid: totalPaid || 0,

                    balance: balance || 0

                };

                lineItems.push(lineItemObj);
            }

            if (balance > 0) {
                for (let l = 0; l < lineItems.length; l++) {
                    stringQuery = stringQuery + "product" + l + "=" + lineItems[l].type + "&price" + l + "=" + lineItems[l].balance + "&qty" + l + "=" + 1 + "&"; ;
                }
                stringQuery = stringQuery + "tax=0" + "&total=" + closingbalance + "&customer=" + customerName + "&name=" + customerName + "&surname=" + customerName + "&quoteid=" + invoiceId + "&transid=" + stripe_id + "&feemethod=" + stripe_fee_method + "&company=" + company + "&vs1email=" + vs1User + "&customeremail=" + email + "&type=Statement&url=" + window.location.href + "&server=" + erpGet.ERPIPAddress + "&username=" + erpGet.ERPUsername + "&token=" + erpGet.ERPPassword + "&session=" + erpGet.ERPDatabase + "&port=" + erpGet.ERPPort + "&dept=" + dept;
            }

            var currentDate = new Date();
            var begunDate = moment(currentDate).format("DD/MM/YYYY");
            let statmentrecord = {
                id: '',
                printdate: begunDate,
                customername: customerName,
                LineItems: lineItems,
                phone: customerphone,
                customername: customername,
                billaddress: billaddress,
                billstate: billstate,
                billcountry: billcountry,
                email: email,
                openingBalance: openingbalance,
                closingBalance: closingbalance
            };

            templateObject.statmentprintrecords.set(statmentrecord);

            $(".linkText").text('Pay Now');
            $(".linkText").attr("href", stripeGlobalURL + stringQuery);
            var source = document.getElementById('printstatmentdesign');

            let file = "Customer Statement.pdf";
            var opt = {
                margin: 0,
                filename: file,
                image: {
                    type: 'jpeg',
                    quality: 0.98
                },
                html2canvas: {
                    scale: 2
                },
                jsPDF: {
                    unit: 'in',
                    format: 'a4',
                    orientation: 'portrait'
                }
            };
            setTimeout(function () {
                html2pdf().set(opt).from(source).save().then(function (dataObject) {
                    $('.fullScreenSpin').css('display', 'none');
                    $('#printstatmentdesign').css('display', 'none');
                });

            }, 100);

        }

        //});
    };

    templateObject.getStatementPdfData = function (clientID) {
        //getOneInvoicedata
        let objectData = {};
        let objectDataArray = []
        //contactService.getCustomerStatementPrintData(clientID).then(function (data) {

        return new Promise((resolve, reject) => {
            contactService.getCustomerStatementPrintData(clientID).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                let lineItemsTable = [];
                let lineItemTableObj = {};
                let id = 0;
                let object = {};
                let balance = data.tstatementforcustomer[0].closingBalance;
                let stripe_id = templateObject.accountID.get();
                let stripe_fee_method = templateObject.stripe_fee_method.get();
                var erpGet = erpDb();
                let company = Session.get('vs1companyName');
                let vs1User = localStorage.getItem('mySession');
                let dept = "Head Office";
                if (data.tstatementforcustomer.length) {
                    let customerName = data.tstatementforcustomer[0].CustomerName;
                    let openingbalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[0].OpeningBalance);
                    let closingbalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[0].closingBalance);
                    let customerphone = data.tstatementforcustomer[0].Phone || '';
                    let customername = data.tstatementforcustomer[0].ClientName || '';
                    let billaddress = data.tstatementforcustomer[0].BillStreet || '';
                    let billstate = data.tstatementforcustomer[0].BillState || '';
                    let billcountry = data.tstatementforcustomer[0].BillCountry || '';
                    let statementId = data.tstatementforcustomer[0].SaleID || '';
                    let email = data.tstatementforcustomer[0].Email || '';
                    let invoiceId = data.tstatementforcustomer[0].SaleID || '';
                    let date = moment(data.tstatementforcustomer[0].transdate).format('DD/MM/YYYY') || '';
                    let datedue = moment(data.tstatementforcustomer[0].Duedate).format('DD/MM/YYYY') || '';
                    let paidAmt = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[0].Paidamt).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                    });
                    let stringQuery = "?";
                    for (let i = 0; i < data.tstatementforcustomer.length; i++) {
                        id = data.tstatementforcustomer[i].SaleID;
                        let transdate =  moment(data.tstatementforcustomer[i].transdate).format('DD/MM/YYYY') ? moment(data.tstatementforcustomer[i].transdate).format('DD/MM/YYYY') : "";
                        let type = data.tstatementforcustomer[i].Transtype;
                        let status = '';
                        // let type = data.tstatementforcustomer[i].Transtype;
                        let total = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].Amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].Amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let balance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].closingBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });

                        lineItemObj = {
                            lineID: id,
                            id: id || '',
                            date: transdate || '',
                            duedate: datedue,
                            type: type || '',
                            total: total || 0,
                            paidamt: paidAmt || 0,
                            balance: balance || 0

                        };

                        lineItems.push(lineItemObj);
                    }

                    if (balance > 0) {
                        for (let l = 0; l < lineItems.length; l++) {
                            stringQuery = stringQuery + "product" + l + "=" + lineItems[l].type + "&price" + l + "=" + lineItems[l].balance + "&qty" + l + "=" + 1 + "&";
                        }
                        stringQuery = stringQuery + "tax=0" + "&total=" + closingbalance + "&customer=" + customerName + "&name=" + customerName + "&surname=" + customerName + "&quoteid=" + invoiceId + "&transid=" + stripe_id + "&feemethod=" + stripe_fee_method + "&company=" + company + "&vs1email=" + vs1User + "&customeremail=" + email + "&type=Statement&url=" + window.location.href + "&server=" + erpGet.ERPIPAddress + "&username=" + erpGet.ERPUsername + "&token=" + erpGet.ERPPassword + "&session=" + erpGet.ERPDatabase + "&port=" + erpGet.ERPPort + "&dept=" + dept;
                        $(".linkText").attr("href", stripeGlobalURL + stringQuery);
                    }

                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("DD/MM/YYYY");
                    let statmentrecord = {
                        id: statementId,
                        printdate: begunDate,
                        customername: customerName,
                        LineItems: lineItems,
                        phone: customerphone,
                        customername: customername,
                        billaddress: billaddress,
                        billstate: billstate,
                        billcountry: billcountry,
                        email: email,
                        openingBalance: openingbalance,
                        closingBalance: closingbalance
                    };
                    templateObject.statmentprintrecords.set(statmentrecord);
                    if (templateObject.statmentprintrecords.get()) {
                        if (balance > 0) {
                            $('.link').css('display', 'block');
                            $('.linklabel').css('display', 'block');
                        } else {
                            $('.link').css('display', 'none');
                            $('.linklabel').css('display', 'none');
                        }
                        let file = "Invoice-" + invoiceId + ".pdf"
                            let templateObject = Template.instance();
                        let completeTabRecord;

                        setTimeout(function () {
                            var source = document.getElementById('printstatmentdesign');
                            var opt1 = {
                                margin: 0,
                                filename: file,
                                image: {
                                    type: 'jpeg',
                                    quality: 0.98
                                },
                                html2canvas: {
                                    scale: 2
                                },
                                jsPDF: {
                                    unit: 'in',
                                    format: 'a4',
                                    orientation: 'portrait'
                                }
                            };
                            statementMailObj = {
                                Id: statementId,
                                customer_name: customerName,
                                openingBalance: openingbalance,
                                email: email,
                                link: stringQuery
                            };
                            //$('#printstatmentdesign').css('display', 'none');
                            resolve(html2pdf().set(opt1).from(source).toPdf().output('datauristring'))
                        }, 2000);

                    }
                }

            });
        })
    }
    templateObject.getStatements = function () {
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
      var toDate = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
      let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");
      let getURL = location.href;

        if(getURL.indexOf('name') > 0) {
            let convertURL = new URL(location.href);
            let customer = convertURL.searchParams.get("name");
             getVS1Data('TStatementList').then(function (dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllCustomerStatementData(prevMonth11Date,toDate, false).then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    addVS1Data('TStatementList', JSON.stringify(data));
                    for (let i = 0; i < data.tstatementlist.length; i++) {
                        if(data.tstatementlist[i].Customername == customer) {
                        // let arBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].ARBalance)|| 0.00;
                        // let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].CreditBalance) || 0.00;
                        let balance = utilityService.modifynegativeCurrencyFormat(data.tstatementlist[i].amount) || 0.00;
                        // let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].CreditLimit)|| 0.00;
                        // let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].SalesOrderBalance)|| 0.00;
                        var dataList = {
                            id: data.tstatementlist[i].ClientID || '',
                            lineid: Random.id() || '',
                            company: data.tstatementlist[i].Customername || '',
                            contactname: data.tstatementlist[i].Customername || '',
                            phone: '' || '',
                            dateFrom: data.Params.DateFrom,
                            dateTo: data.Params.DateTo.split(' ')[0],
                            //arbalance: arBalance || 0.00,
                            //creditbalance: creditBalance || 0.00,
                            balance: balance || 0.00,
                            //creditlimit: creditLimit || 0.00,
                            //salesorderbalance: salesOrderBalance || 0.00,
                            //email: data.tstatementforcustomer[i].Email || '',
                            //accountno: data.tstatementforcustomer[i].AccountNo || '',
                            jobname: data.tstatementlist[i].Jobname || '',
                            //jobtitle: data.tstatementforcustomer[i].JobTitle || '',
                            notes: ''
                            //country: data.tstatementforcustomer[i].Country || ''
                        };

                        dataTableList.push(dataList);
                    }
                        //}
                    }

                    function MakeNegative() {
                        $('td').each(function () {
                            if ($(this).text().indexOf('-' + Currency) >= 0)
                                $(this).addClass('text-danger')
                        });
                    };
                    templateObject.datatablerecords.set(dataTableList);
                    templateObject.datatablerecords1.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblCustomerlist', function (error, result) {
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

                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function () {
                        $('#tblCustomerlist').DataTable({
                            //   columnDefs: [
                            //     {orderable: false, targets: 0},
                            //     { targets: 0, className: "text-center"}
                            // ],
                            "columnDefs": [{
                                    "orderable": false,
                                    "targets": 0
                                }
                            ],

                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                    extend: 'excelHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "statementlist_" + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Statement List',
                                    filename: "statementlist_" + moment().format(),
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            colReorder: {
                                fixedColumnsLeft: 1
                            },
                            // columnDefs: [
                            //    { orderable: false, targets: 0 }
                            // ],
                            // bStateSave: true,
                            // rowId: 0,
                            pageLength: initialReportDatatableLoad,
                            "bLengthChange": false,
                            lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [
                                [1, "desc"]
                            ],
                            action: function () {
                                $('#tblCustomerlist').DataTable().ajax.reload();
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
                        }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        });

                        // $('#tblCustomerlist').DataTable().column( 0 ).visible( true );
                        $('.fullScreenSpin').css('display', 'none');
                    }, 0);

                    var columns = $('#tblCustomerlist th');
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
                    $('#tblCustomerlist tbody').on('click', 'tr .colCompany, tr .colJob, tr .colPhone, tr .colBalance, tr .colNotes', function () {
                        var listData = $(this).closest('tr').attr('id');
                        if (listData) {
                            FlowRouter.go('/customerscard?id=' + listData);
                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tstatementlist;
                $('.fullScreenSpin').css('display', 'none');
                let lineItems = [];
                let lineItemObj = {};
                if(data.Params.IgnoreDates == true){
                  $('#dateFrom').attr('readonly', true);
                  $('#dateTo').attr('readonly', true);
                }else{

                  $("#dateFrom").val(data.Params.DateFrom !=''? moment(data.Params.DateFrom).format("DD/MM/YYYY"): data.Params.DateFrom);
                  $("#dateTo").val(data.Params.DateTo !=''? moment(data.Params.DateTo).format("DD/MM/YYYY"): data.Params.DateTo);
                }

                for (let i = 0; i < useData.length; i++) {
                    if(useData[i].Customername == customer) {
                    // let arBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].ARBalance)|| 0.00;
                    // let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].CreditBalance) || 0.00;
                    let balance = utilityService.modifynegativeCurrencyFormat(useData[i].amount) || 0.00;
                    // let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].CreditLimit)|| 0.00;
                    // let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].SalesOrderBalance)|| 0.00;
                    var dataList = {
                        id: useData[i].ClientID || '',
                        lineid: Random.id() || '',
                        company: useData[i].Customername || '',
                        contactname: useData[i].Customername || '',
                        phone: '' || '',
                        dateFrom: data.Params.DateFrom,
                        dateTo: data.Params.DateTo.split('')[0],
                        //arbalance: arBalance || 0.00,
                        //creditbalance: creditBalance || 0.00,
                        balance: balance || 0.00,
                        //creditlimit: creditLimit || 0.00,
                        //salesorderbalance: salesOrderBalance || 0.00,
                        //email: data.tstatementforcustomer[i].Email || '',
                        //accountno: data.tstatementforcustomer[i].AccountNo || '',
                        jobname: useData[i].Jobname || '',
                        //jobtitle: data.tstatementforcustomer[i].JobTitle || '',
                        notes: ''
                        //country: data.tstatementforcustomer[i].Country || ''
                    };

                    dataTableList.push(dataList);
                }
                    //}
                }

                function MakeNegative() {
                    $('td').each(function () {
                        if ($(this).text().indexOf('-' + Currency) >= 0)
                            $(this).addClass('text-danger')
                    });
                };

                templateObject.datatablerecords.set(dataTableList);
                templateObject.datatablerecords1.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblCustomerlist', function (error, result) {
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

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    $('#tblCustomerlist').DataTable({
                        //   columnDefs: [
                        //     {orderable: false, targets: 0},
                        //     { targets: 0, className: "text-center"}
                        // ],
                        "columnDefs": [{
                                "orderable": false,
                                "targets": 0
                            }
                        ],

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "statementlist_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Statement List',
                                filename: "statementlist_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        colReorder: {
                            fixedColumnsLeft: 1
                        },
                        // columnDefs: [
                        //    { orderable: false, targets: 0 }
                        // ],
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialReportDatatableLoad,
                        "bLengthChange": false,
                        lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [
                            [1, "desc"]
                        ],
                        action: function () {
                            $('#tblCustomerlist').DataTable().ajax.reload();
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
                    }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#tblCustomerlist').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblCustomerlist th');
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
                $('#tblCustomerlist tbody').on('click', 'tr .colCompany, tr .colJob, tr .colPhone, tr .colBalance, tr .colNotes', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        FlowRouter.go('/customerscard?id=' + listData);
                    }
                });

            }
        }).catch(function (err) {
            sideBarService.getAllCustomerStatementData(prevMonth11Date,toDate, false).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                addVS1Data('TStatementList', JSON.stringify(data));
                for (let i = 0; i < data.tstatementlist.length; i++) {
                    if(data.tstatementlist[i].Customername == customer) {
                    // let arBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].ARBalance)|| 0.00;
                    // let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].CreditBalance) || 0.00;
                    let balance = utilityService.modifynegativeCurrencyFormat(data.tstatementlist[i].amount) || 0.00;
                    // let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].CreditLimit)|| 0.00;
                    // let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].SalesOrderBalance)|| 0.00;
                    var dataList = {
                        id: data.tstatementlist[i].ClientID || '',
                        lineid: Random.id() || '',
                        company: data.tstatementlist[i].Customername || '',
                        contactname: data.tstatementlist[i].Customername || '',
                        phone: '' || '',
                        //arbalance: arBalance || 0.00,
                        //creditbalance: creditBalance || 0.00,
                        balance: balance || 0.00,
                        //creditlimit: creditLimit || 0.00,
                        //salesorderbalance: salesOrderBalance || 0.00,
                        //email: data.tstatementforcustomer[i].Email || '',
                        //accountno: data.tstatementforcustomer[i].AccountNo || '',
                        jobname: data.tstatementlist[i].Jobname || '',
                        //jobtitle: data.tstatementforcustomer[i].JobTitle || '',
                        notes: ''
                        //country: data.tstatementforcustomer[i].Country || ''
                    };

                    dataTableList.push(dataList);
                }
                    //}
                }

                function MakeNegative() {
                    $('td').each(function () {
                        if ($(this).text().indexOf('-' + Currency) >= 0)
                            $(this).addClass('text-danger')
                    });
                };

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblCustomerlist', function (error, result) {
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

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    $('#tblCustomerlist').DataTable({
                        //   columnDefs: [
                        //     {orderable: false, targets: 0},
                        //     { targets: 0, className: "text-center"}
                        // ],
                        "columnDefs": [{
                                "orderable": false,
                                "targets": 0
                            }
                        ],

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "statementlist_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Statement List',
                                filename: "statementlist_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        colReorder: {
                            fixedColumnsLeft: 1
                        },
                        // columnDefs: [
                        //    { orderable: false, targets: 0 }
                        // ],
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialReportDatatableLoad,
                        "bLengthChange": false,
                        lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [
                            [1, "desc"]
                        ],
                        action: function () {
                            $('#tblCustomerlist').DataTable().ajax.reload();
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
                    }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#tblCustomerlist').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblCustomerlist th');
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
                $('#tblCustomerlist tbody').on('click', 'tr .colCompany, tr .colJob, tr .colPhone, tr .colBalance, tr .colNotes', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        FlowRouter.go('/customerscard?id=' + listData);
                    }
                });

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });


        } else {
        getVS1Data('TStatementList').then(function (dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllCustomerStatementData(prevMonth11Date,toDate, false).then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    addVS1Data('TStatementList', JSON.stringify(data));
                    for (let i = 0; i < data.tstatementlist.length; i++) {

                        // let arBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].ARBalance)|| 0.00;
                        // let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].CreditBalance) || 0.00;
                        let balance = utilityService.modifynegativeCurrencyFormat(data.tstatementlist[i].amount) || 0.00;
                        // let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].CreditLimit)|| 0.00;
                        // let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].SalesOrderBalance)|| 0.00;
                        var dataList = {
                            id: data.tstatementlist[i].ClientID || '',
                            lineid: Random.id() || '',
                            company: data.tstatementlist[i].Customername || '',
                            contactname: data.tstatementlist[i].Customername || '',
                            phone: '' || '',
                            dateFrom: data.Params.DateFrom,
                            dateTo: data.Params.DateTo.split(' ')[0],
                            //arbalance: arBalance || 0.00,
                            //creditbalance: creditBalance || 0.00,
                            balance: balance || 0.00,
                            //creditlimit: creditLimit || 0.00,
                            //salesorderbalance: salesOrderBalance || 0.00,
                            //email: data.tstatementforcustomer[i].Email || '',
                            //accountno: data.tstatementforcustomer[i].AccountNo || '',
                            jobname: data.tstatementlist[i].Jobname || '',
                            //jobtitle: data.tstatementforcustomer[i].JobTitle || '',
                            notes: ''
                            //country: data.tstatementforcustomer[i].Country || ''
                        };

                        dataTableList.push(dataList);
                        //}
                    }

                    function MakeNegative() {
                        $('td').each(function () {
                            if ($(this).text().indexOf('-' + Currency) >= 0)
                                $(this).addClass('text-danger')
                        });
                    };
                    templateObject.datatablerecords.set(dataTableList);
                    templateObject.datatablerecords1.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblCustomerlist', function (error, result) {
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

                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function () {
                        $('#tblCustomerlist').DataTable({
                            //   columnDefs: [
                            //     {orderable: false, targets: 0},
                            //     { targets: 0, className: "text-center"}
                            // ],
                            "columnDefs": [{
                                    "orderable": false,
                                    "targets": 0
                                }
                            ],

                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                    extend: 'excelHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "statementlist_" + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Statement List',
                                    filename: "statementlist_" + moment().format(),
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            colReorder: {
                                fixedColumnsLeft: 1
                            },
                            // columnDefs: [
                            //    { orderable: false, targets: 0 }
                            // ],
                            // bStateSave: true,
                            // rowId: 0,
                            pageLength: initialReportDatatableLoad,
                            "bLengthChange": false,
                            lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [
                                [1, "desc"]
                            ],
                            action: function () {
                                $('#tblCustomerlist').DataTable().ajax.reload();
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
                        }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        });

                        // $('#tblCustomerlist').DataTable().column( 0 ).visible( true );
                        $('.fullScreenSpin').css('display', 'none');
                    }, 0);

                    var columns = $('#tblCustomerlist th');
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
                    $('#tblCustomerlist tbody').on('click', 'tr .colCompany, tr .colJob, tr .colPhone, tr .colBalance, tr .colNotes', function () {
                        var listData = $(this).closest('tr').attr('id');
                        if (listData) {
                            FlowRouter.go('/customerscard?id=' + listData);
                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tstatementlist;
                $('.fullScreenSpin').css('display', 'none');
                let lineItems = [];
                let lineItemObj = {};
                if(data.Params.IgnoreDates == true){
                  $('#dateFrom').attr('readonly', true);
                  $('#dateTo').attr('readonly', true);
                }else{

                  $("#dateFrom").val(data.Params.DateFrom !=''? moment(data.Params.DateFrom).format("DD/MM/YYYY"): data.Params.DateFrom);
                  $("#dateTo").val(data.Params.DateTo !=''? moment(data.Params.DateTo).format("DD/MM/YYYY"): data.Params.DateTo);
                }

                for (let i = 0; i < useData.length; i++) {

                    // let arBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].ARBalance)|| 0.00;
                    // let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].CreditBalance) || 0.00;
                    let balance = utilityService.modifynegativeCurrencyFormat(useData[i].amount) || 0.00;
                    // let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].CreditLimit)|| 0.00;
                    // let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].SalesOrderBalance)|| 0.00;
                    var dataList = {
                        id: useData[i].ClientID || '',
                        lineid: Random.id() || '',
                        company: useData[i].Customername || '',
                        contactname: useData[i].Customername || '',
                        phone: '' || '',
                        dateFrom: data.Params.DateFrom,
                        dateTo: data.Params.DateTo.split('')[0],
                        //arbalance: arBalance || 0.00,
                        //creditbalance: creditBalance || 0.00,
                        balance: balance || 0.00,
                        //creditlimit: creditLimit || 0.00,
                        //salesorderbalance: salesOrderBalance || 0.00,
                        //email: data.tstatementforcustomer[i].Email || '',
                        //accountno: data.tstatementforcustomer[i].AccountNo || '',
                        jobname: useData[i].Jobname || '',
                        //jobtitle: data.tstatementforcustomer[i].JobTitle || '',
                        notes: ''
                        //country: data.tstatementforcustomer[i].Country || ''
                    };

                    dataTableList.push(dataList);
                    //}
                }

                function MakeNegative() {
                    $('td').each(function () {
                        if ($(this).text().indexOf('-' + Currency) >= 0)
                            $(this).addClass('text-danger')
                    });
                };

                templateObject.datatablerecords.set(dataTableList);
                templateObject.datatablerecords1.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblCustomerlist', function (error, result) {
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

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    $('#tblCustomerlist').DataTable({
                        //   columnDefs: [
                        //     {orderable: false, targets: 0},
                        //     { targets: 0, className: "text-center"}
                        // ],
                        "columnDefs": [{
                                "orderable": false,
                                "targets": 0
                            }
                        ],

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "statementlist_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Statement List',
                                filename: "statementlist_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        colReorder: {
                            fixedColumnsLeft: 1
                        },
                        // columnDefs: [
                        //    { orderable: false, targets: 0 }
                        // ],
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialReportDatatableLoad,
                        "bLengthChange": false,
                        lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [
                            [1, "desc"]
                        ],
                        action: function () {
                            $('#tblCustomerlist').DataTable().ajax.reload();
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
                    }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#tblCustomerlist').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblCustomerlist th');
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
                $('#tblCustomerlist tbody').on('click', 'tr .colCompany, tr .colJob, tr .colPhone, tr .colBalance, tr .colNotes', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        FlowRouter.go('/customerscard?id=' + listData);
                    }
                });

            }
        }).catch(function (err) {
            sideBarService.getAllCustomerStatementData(prevMonth11Date,toDate, false).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                addVS1Data('TStatementList', JSON.stringify(data));
                for (let i = 0; i < data.tstatementlist.length; i++) {

                    // let arBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].ARBalance)|| 0.00;
                    // let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].CreditBalance) || 0.00;
                    let balance = utilityService.modifynegativeCurrencyFormat(data.tstatementlist[i].amount) || 0.00;
                    // let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].CreditLimit)|| 0.00;
                    // let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].SalesOrderBalance)|| 0.00;
                    var dataList = {
                        id: data.tstatementlist[i].ClientID || '',
                        lineid: Random.id() || '',
                        company: data.tstatementlist[i].Customername || '',
                        contactname: data.tstatementlist[i].Customername || '',
                        phone: '' || '',
                        //arbalance: arBalance || 0.00,
                        //creditbalance: creditBalance || 0.00,
                        balance: balance || 0.00,
                        //creditlimit: creditLimit || 0.00,
                        //salesorderbalance: salesOrderBalance || 0.00,
                        //email: data.tstatementforcustomer[i].Email || '',
                        //accountno: data.tstatementforcustomer[i].AccountNo || '',
                        jobname: data.tstatementlist[i].Jobname || '',
                        //jobtitle: data.tstatementforcustomer[i].JobTitle || '',
                        notes: ''
                        //country: data.tstatementforcustomer[i].Country || ''
                    };

                    dataTableList.push(dataList);
                    //}
                }

                function MakeNegative() {
                    $('td').each(function () {
                        if ($(this).text().indexOf('-' + Currency) >= 0)
                            $(this).addClass('text-danger')
                    });
                };

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblCustomerlist', function (error, result) {
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

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    $('#tblCustomerlist').DataTable({
                        //   columnDefs: [
                        //     {orderable: false, targets: 0},
                        //     { targets: 0, className: "text-center"}
                        // ],
                        "columnDefs": [{
                                "orderable": false,
                                "targets": 0
                            }
                        ],

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "statementlist_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Statement List',
                                filename: "statementlist_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        colReorder: {
                            fixedColumnsLeft: 1
                        },
                        // columnDefs: [
                        //    { orderable: false, targets: 0 }
                        // ],
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialReportDatatableLoad,
                        "bLengthChange": false,
                        lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [
                            [1, "desc"]
                        ],
                        action: function () {
                            $('#tblCustomerlist').DataTable().ajax.reload();
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
                    }).on('column-reorder', function () {}).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#tblCustomerlist').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblCustomerlist th');
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
                $('#tblCustomerlist tbody').on('click', 'tr .colCompany, tr .colJob, tr .colPhone, tr .colBalance, tr .colNotes', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        FlowRouter.go('/customerscard?id=' + listData);
                    }
                });

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });

        }


    }

    templateObject.getStatements();

    $('#tblCustomerlist tbody').on('click', 'tr', function () {
        var listData = $(this).closest('tr').attr('id');
        let columnBalClass = $(event.target).attr('class');

        if (columnBalClass.indexOf("chkBox") != -1) {
            // $('.printConfirm').css('display','inline-block');
        } else {

            if (listData) {
                //FlowRouter.go('/customerscard?id=' + listData);
            }
        }

    });

    //Print PDF
    templateObject.customerToMultiplePdf = async function (listIds) {

        let doc = new jsPDF();
        for (let j = 0; j < listIds.length; j++) {
            await templateObject.getStatePrintData(listIds[j]);
        }
    }

    templateObject.emailMultipleStatementPdf = async function (listIds) {
        let multiPDF = [];
        let doc = new jsPDF();
        for (let j = 0; j < listIds.length; j++) {
            let data = await templateObject.getStatementPdfData(listIds[j]);
            let object = {
                Id: statementMailObj.Id,
                customer_name: statementMailObj.customer_name,
                pdfObj: data,
                openingBalance: statementMailObj.openingBalance,
                email: statementMailObj.email,
                link: statementMailObj.link
            }
            multiPDF.push(object);
        }
        return multiPDF;
    }

    templateObject.base64data = function (file) {
        return new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onerror = reject;
            fr.onload = function () {
                resolve(fr.result);
            }
            fr.readAsDataURL(file);
        })
    };

    templateObject.getAllFilterStatementData = function (fromDate,toDate, ignoreDate) {
      sideBarService.getAllCustomerStatementData(fromDate,toDate, ignoreDate).then(function(data) {

              addVS1Data('TStatementList',JSON.stringify(data)).then(function (datareturn) {
                  window.open('/statementlist?toDate=' + toDate + '&fromDate=' + fromDate + '&ignoredate='+ignoreDate,'_self');
              }).catch(function (err) {
                location.reload();
              });

        }).catch(function (err) {
            templateObject.datatablerecords.set('');
            $('.fullScreenSpin').css('display','none');
        });
    }

    let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
    let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
    let urlParametersIgnoreDate = FlowRouter.current().queryParams.ignoredate;

      if(urlParametersIgnoreDate == true){
        $('#dateFrom').attr('readonly', true);
        $('#dateTo').attr('readonly', true);
      }else{
        if(urlParametersDateFrom){
        $("#dateFrom").val(urlParametersDateFrom !=''? moment(urlParametersDateFrom).format("DD/MM/YYYY"): urlParametersDateFrom);
        $("#dateTo").val(urlParametersDateTo !=''? moment(urlParametersDateTo).format("DD/MM/YYYY"): urlParametersDateTo);
       }
    }

});

Template.statementlist.events({
    'click #btnNewCustomer': function (event) {
        FlowRouter.go('/customerscard');
    },
    'click .chkDatatable': function (event) {
        var columns = $('#tblCustomerlist th');
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
                    PrefName: 'tblCustomerlist'
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
                    PrefName: 'tblCustomerlist'
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
                            PrefName: 'tblCustomerlist',
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
                        PrefName: 'tblCustomerlist',
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
    },
    'blur .divcolumn': function (event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#tblCustomerlist').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function (event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblCustomerlist th');
        $.each(datable, function (i, v) {
            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettings': function (event) {
        let templateObject = Template.instance();
        var columns = $('#tblCustomerlist th');

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
        jQuery('#tblCustomerlist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .btnRefresh': function () {
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
      var toDate = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
      let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");
        $('.fullScreenSpin').css('display', 'inline-block');
        sideBarService.getAllCustomerStatementData(prevMonth11Date,toDate, false).then(function (data) {
            addVS1Data('TStatementList', JSON.stringify(data)).then(function (datareturn) {
                window.open('/statementlist', '_self');
            }).catch(function (err) {
                window.open('/statementlist', '_self');
            });
        }).catch(function (err) {
            window.open('/statementlist', '_self');
        });
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
          templateObject.getAllFilterStatementData(formatDateFrom,formatDateTo, false);
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
            templateObject.getAllFilterStatementData(formatDateFrom,formatDateTo, false);
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
        templateObject.getAllFilterStatementData(toDateERPFrom,toDateERPTo, false);
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
        templateObject.getAllFilterStatementData(toDateERPFrom,toDateERPTo, false);
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
        templateObject.getAllFilterStatementData(getDateFrom,getLoadDate, false);
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
        templateObject.getAllFilterStatementData(getDateFrom,getLoadDate, false);
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
        templateObject.getAllFilterStatementData(getDateFrom,getLoadDate, false);

    },
    'click #ignoreDate': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', true);
        $('#dateTo').attr('readonly', true);
        templateObject.getAllFilterStatementData('', '', true);
    },
    'click .chkBoxAll': function () {
        if ($(event.target).is(':checked')) {
            $(".chkBox").prop("checked", true);
        } else {
            $(".chkBox").prop("checked", false);
        }
    },
    'click #emailbtn': async function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#printstatmentdesign').css('display', 'block');
        let templateObject = Template.instance();
        let listIds = [];
        $('.chkBox').each(function () {
            if ($(this).is(':checked')) {
                var targetID = $(this).closest('tr').attr('id');
                listIds.push(targetID);
            } else {}
        });

        if (listIds != '') {
            data = await templateObject.emailMultipleStatementPdf(listIds);
            customerData = templateObject.statmentprintrecords.get();
            async function addAttachment() {
                let attachment = [];
                let pdfObject = "";
                let count = 0;
                let email = [];
                for (let x = 0; x < data.length; x++) {

                    if (data[x].pdfObj != undefined || data[x].pdfObj != null) {
                        let base64data = data[x].pdfObj;
                        // setTimeout(function() {
                        base64data = base64data.split(',')[1];
                        pdfObject = {
                            filename: 'statement-' + data[x].Id + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);
                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('EUserName');
                        let customerEmailName = data[x].customer_name;
                        // let mailCC = templateObject.mailCopyToUsr.get();
                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Statement ' + data[x].Id + ' from ' + mailFromName + ' for ' + customerEmailName;
                        // emailTo = emails[count].toString();
                        attachmentIndex = attachment[count];
                        count++;
                        var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
                            '    <tr>' +
                            '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
                            '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td style="padding: 40px 30px 40px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
                            '                        Hi <span>' + customerEmailName + '</span>.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Please find attached Statement <span>' + data[x].Id + '</span>' +
                            '                    </td>' +
                            '                </tr>' +
                            '                 <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Simply click on <a style="border: none; color: white; padding: 6px 12px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #5cb85c; border-color: #4cae4c; border-radius: 10px;" href="'+stripeGlobalURL+''+ data[x].link + '">Make Payment</a> to pay now.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                     <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Thank you again for business' +
                            '                    </td>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
                            '                        Kind regards,' +
                            '                        <br>' +
                            '                        ' + mailFromName + '' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
                            '                        If you have any question, please do not hesitate to contact us.' +
                            '                    </td>' +
                            '                    <td align="right">' +
                            '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '</table>';

                        if (data[x].email != "") {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: data[x].email,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachmentIndex
                            }, function (error, result) {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#printstatmentdesign').css('display', 'none');
                                if (error && error.error === "error") {
                                    // window.open('/statementlist', '_self');
                                } else {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#printstatmentdesign').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To User " + data[x].email,
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            // window.open('/statementlist', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                }
                            });
                        } else {
                            $('.fullScreenSpin').css('display', 'none');
                            $('#printstatmentdesign').css('display', 'none');
                            swal({
                                title: 'WARNING',
                                text: "Customer Does Not Have a Email Address, Please Add One for This Customer ",
                                type: 'warning',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    // window.open('/statementlist', '_self');
                                } else if (result.dismiss === 'cancel') {}
                            });

                        }

                        // },0);
                    }
                }
            }
            await addAttachment();
        } else {
            $('.fullScreenSpin').css('display', 'none');
        }
    },
    'click .printConfirm ': async function (event) {
        $('.fullScreenSpin').css('display', 'block');
        let templateObject = Template.instance();

        let listIds = [];

        $('.chkBox').each(function () {
            if ($(this).is(':checked')) {
                var targetID = $(this).closest('tr').attr('id');
                listIds.push(targetID);
            } else {}
        });

        if (listIds != '') {
            await templateObject.customerToMultiplePdf(listIds);

        } else {
            $('.fullScreenSpin').css('display', 'none');
            $('#printLineModal').modal('toggle');
        }

        // for (let i = 0; i < selectedData.length; i++) {
        //     let ids = [
        //         selectedData[i].id,
        //     ]
        //     listIds.push(ids);
        // }

    }
});

Template.statementlist.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.company == 'NA') {
                return 1;
            } else if (b.company == 'NA') {
                return -1;
            }
            return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblCustomerlist'
        });
    },
    statmentprintrecords: () => {
        return Template.instance().statmentprintrecords.get();
    },
    statmentemailrecords: () => {
        return Template.instance().statmentemailrecords.get();
    },
    companyname: () => {
        return loggedCompany;
    },
    companyaddress1: () => {
        return Session.get('vs1companyaddress1');
    },
    companyaddress2: () => {
        return Session.get('vs1companyaddress2');
    },
    companyphone: () => {
        return Session.get('vs1companyPhone');
    },
    companyabn: () => {
        return Session.get('vs1companyABN');
    },
    organizationname: () => {
        return Session.get('vs1companyName');
    },
    organizationurl: () => {
        return Session.get('vs1companyURL');
    },

});
