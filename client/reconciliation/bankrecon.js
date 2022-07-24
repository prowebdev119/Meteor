import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { ReconService } from "./recon-service";
import { UtilityService } from "../utility-service";
import '../lib/global/erp-objects';
import XLSX from 'xlsx';
import 'jquery-editable-select';
import { AccountService } from "../accounts/account-service";
let utilityService = new UtilityService();

Template.bankrecon.onCreated(function() {
    const templateObject = Template.instance();
    // Template object for the Accounts array
    templateObject.accountnamerecords = new ReactiveVar();
    // Template objects for Deposit and Withdrawal
    templateObject.reconVS1dep = new ReactiveVar([]);
    templateObject.reconVS1with = new ReactiveVar([]);
    templateObject.selectedTransdep = new ReactiveVar([]);
    templateObject.selectedTranswith = new ReactiveVar([]);
});

Template.bankrecon.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');

    $('#tblVS1Dep tbody').on('click', 'tr .depositClick', function () {

        let paymentType = $(this).closest('tr').find(".colPaymentType").text();
        let selectDepositID = $(this).closest('tr').find(".colDepositID").text();

        if (paymentType == "Customer Payment") {
            if (selectDepositID) {
                FlowRouter.go('/paymentcard?id=' + selectDepositID);
            }
        }
        if (paymentType == "Cheque Deposit" || paymentType == "Cheque") {
            if (selectDepositID) {
                FlowRouter.go('/chequecard?id=' + selectDepositID);
            }
        }
        if (paymentType == "Deposit Entry") {
            if (selectDepositID) {
                FlowRouter.go('/depositcard?id=' + selectDepositID);
            }
        }
        if (paymentType == "Journal Entry") {
            if (selectDepositID) {
                FlowRouter.go('/journalentrycard?id=' + selectDepositID);
            }
        }
    });
    $('#tblVS1With tbody').on('click', 'tr .withClick', function () {

        let paymentType = $(this).closest('tr').find(".colPaymentType").text();
        let selectWithdrawalID = $(this).closest('tr').find(".colWithdrawlID").text();

        if (paymentType == "Supplier Payment") {
            if (selectWithdrawalID) {
                FlowRouter.go('/supplierpaymentcard?id=' + selectWithdrawalID);
            }
        }
        if (paymentType == "Cheque") {
            if (selectWithdrawalID) {
                FlowRouter.go('/chequecard?id=' + selectWithdrawalID);
            }
        }
        if (paymentType == "Journal Entry") {
            if (selectWithdrawalID) {
                FlowRouter.go('/journalentrycard?id=' + selectWithdrawalID);
            }
        }
        if (paymentType == "Split Deposit") {
            if (selectWithdrawalID) {
                FlowRouter.go('/depositcard?id=' + selectWithdrawalID);
            }
        }
    });

    let templateObject = Template.instance();
    let recService = new ReconService();
    var url = FlowRouter.current().path;
    let accountnamerecords = [];
    templateObject.getAccountNames = function() {
        recService.getAccountNameVS1().then(function(data) {
            if (data.taccountvs1.length > 0) {
                for (let i = 0; i < data.taccountvs1.length; i++) {
                    let accountnamerecordObj = {
                        accountid: data.taccountvs1[i].Id || ' ',
                        accountname: data.taccountvs1[i].AccountName || ' '
                    };
                    if ((data.taccountvs1[i].AccountTypeName == 'BANK') || (data.taccountvs1[i].AccountTypeName == 'CCARD')) {
                        accountnamerecords.push(accountnamerecordObj);
                        templateObject.accountnamerecords.set(accountnamerecords);
                    }
                }
            }
            // Session - set account dropdown BEGIN
            setTimeout(function() {
                let bankaccountid = Session.get('bankaccountid') || '';
                let bankaccountname = Session.get('bankaccountname') || '';
                let statementDate = localStorage.getItem('statementdate')|| '';

                if(statementDate != ''){
                    $('.statementDate').val(statementDate);
                }
                if (bankaccountid != '') {
                    $('#bankAccountID').val(bankaccountid);
                    $('#bankAccountName').val(bankaccountname);
                    var statementDateData = new Date($(".statementDate").datepicker("getDate"));
                    let statementDate = statementDateData.getFullYear() + "-" + (statementDateData.getMonth() + 1) + "-" + statementDateData.getDate();

                    templateObject.getReconcileDeposit(bankaccountid, statementDate, false);
                    templateObject.getReconcileWithdrawal(bankaccountid, statementDate, false);
                    //let bankName = $("#bankAccountName option[value='" + bankaccountid + "']").text();
                    let bankName = $("#bankAccountName").val();
                    templateObject.getOpenBalance(bankaccountname);
                }else{
                  $('.fullScreenSpin').css('display', 'none');
                }
            }, 10);

            // Session - set account dropdown END
            // $('.fullScreenSpin').css('display', 'none');
        }).catch(function(err) {
            $('.fullScreenSpin').css('display', 'none');
        });
    };

    // API to pull Accounts END

    // BEGIN DATE CODE
    $("#dtSODate1,#dtSODate2").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        onstrainInput: false,
        dateFormat: 'dd/mm/yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
    }).on("change", function() {
        $('.statementDate').val($(this).val());
    });
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    $('.formClassDate').val(begunDate);
    // END DATE CODE

    // API to pull Deposits BEGIN
    templateObject.getReconcileDeposit = function(accountTypeId, statementDate, ignoreDate) {
        let recondep = [];
        $('.fullScreenSpin').css('display', 'inline-block');
        recService.getToBeReconciledDeposit(accountTypeId, statementDate, ignoreDate).then(function(data) {
            if (data.ttobereconcileddeposit.length > 0) {
                // for (let r = 0; r < data.ttobereconcileddeposit; r++ ) {
                  for (let r in data.ttobereconcileddeposit) {
                    let depositamount = utilityService.modifynegativeCurrencyFormat(data.ttobereconcileddeposit[r].Amount) || 0.00;
                    let reconciledepositObj = {
                        sortdate: data.ttobereconcileddeposit[r].DepositDate != '' ? moment(data.ttobereconcileddeposit[r].DepositDate).format("YYYY-MM-DD") : data.ttobereconcileddeposit[r].DepositDate,
                        recondepdate: data.ttobereconcileddeposit[r].DepositDate != '' ? moment(data.ttobereconcileddeposit[r].DepositDate).format("DD/MM/YYYY") : data.ttobereconcileddeposit[r].DepositDate,
                        recondepname: data.ttobereconcileddeposit[r].CompanyName || ' ',
                        recondeppaymenttype: data.ttobereconcileddeposit[r].Notes || ' ',
                        recondepamount: depositamount || 0.00,
                        recondepid: data.ttobereconcileddeposit[r].DepositID || ' ',
                        recondepref: data.ttobereconcileddeposit[r].ReferenceNo || ' ',
                        seqdepnum: data.ttobereconcileddeposit[r].Seqno || 0,
                        recondeppaymentid: data.ttobereconcileddeposit[r].PaymentID || 0,
                        depositLineID: data.ttobereconcileddeposit[r].DepositLineID || 0,
                    };
                    if (data.ttobereconcileddeposit[r].Seqno != 0) {
                        recondep.push(reconciledepositObj);
                    }
                }
                var thirdaryData = $.merge($.merge([], templateObject.reconVS1dep.get()), recondep);
                templateObject.reconVS1dep.set(thirdaryData);
                if (templateObject.reconVS1dep.get()) {
                  setTimeout(function() {
                    $('#tblVS1Dep').DataTable({
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: false,
                        "scrollY": "400px",
                        "scrollCollapse": true,
                        "columnDefs": [{
                            "orderable": false,
                            "targets": 0
                        }],
                        // colReorder: true,
                        colReorder: {
                            fixedColumnsLeft: 1
                        },
                        select: true,
                        destroy: true,
                        // colReorder: true,
                        pageLength: 10,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "order": [
                            [1, "desc"]
                        ],
                        action: function() {
                            $('#tblVS1Dep').DataTable().ajax.reload();
                        }
                    });
                      $('.fullScreenSpin').css('display', 'none');
                  }, 0);
                }
            } else {
                setTimeout(function() {
                  $('#tblVS1Dep').DataTable({
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      paging: false,
                      "scrollY": "400px",
                      "scrollCollapse": true,
                      "columnDefs": [{
                          "orderable": false,
                          "targets": 0
                      }],
                      // colReorder: true,
                      colReorder: {
                          fixedColumnsLeft: 1
                      },
                      select: true,
                      destroy: true,
                      // colReorder: true,
                      pageLength: 10,
                      lengthMenu: [
                          [initialDatatableLoad, -1],
                          [initialDatatableLoad, "All"]
                      ],
                      info: true,
                      responsive: true,
                      "order": [
                          [1, "desc"]
                      ],
                      action: function() {
                          $('#tblVS1Dep').DataTable().ajax.reload();
                      }
                  });
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);
            }
            $('.fullScreenSpin').css('display', 'none');
        }).catch(function(err) {
            $('.fullScreenSpin').css('display', 'none');
        });
    };
    // API to pull Deposits END

    // API to pull Withdrawals BEGIN
    templateObject.getReconcileWithdrawal = function(accountTypeId, statementDate, ignoreDate) {
        let reconwith = [];
        $('.fullScreenSpin').css('display', 'inline-block');
        recService.getToBeReconciledWithdrawal(accountTypeId, statementDate, ignoreDate).then(function(data) {
            if (data.ttobereconciledwithdrawal.length > 0) {
                for (let j in data.ttobereconciledwithdrawal) {
                    let withdrawalamount = utilityService.modifynegativeCurrencyFormat(data.ttobereconciledwithdrawal[j].Amount) || 0.00;
                    let reconcilewithdrawalObj = {
                        sortdate: data.ttobereconciledwithdrawal[j].DepositDate != '' ? moment(data.ttobereconciledwithdrawal[j].DepositDate).format("YYYY-MM-DD") : data.ttobereconciledwithdrawal[i].DepositDate,
                        reconwithdate: data.ttobereconciledwithdrawal[j].DepositDate != '' ? moment(data.ttobereconciledwithdrawal[j].DepositDate).format("DD/MM/YYYY") : data.ttobereconciledwithdrawal[j].DepositDate,
                        reconwithname: data.ttobereconciledwithdrawal[j].CompanyName || ' ',
                        reconwithpaymenttype: data.ttobereconciledwithdrawal[j].Notes || ' ',
                        reconwithamount: withdrawalamount || 0.00,
                        reconwithid: data.ttobereconciledwithdrawal[j].DepositID || ' ',
                        reconwithref: data.ttobereconciledwithdrawal[j].ReferenceNo || ' ',
                        seqwithnum: data.ttobereconciledwithdrawal[j].Seqno || 0,
                        reconwithpaymentid: data.ttobereconciledwithdrawal[j].DepositID || 0,
                        depositLineID: data.ttobereconciledwithdrawal[j].DepositLineID || 0,
                    };
                    if (data.ttobereconciledwithdrawal[j].Seqno != 0) {
                        reconwith.push(reconcilewithdrawalObj);
                        // templateObject.reconVS1with.set(reconwith);
                    }
                }

                var thirdaryData = $.merge($.merge([], templateObject.reconVS1with.get()), reconwith);
                templateObject.reconVS1with.set(thirdaryData);

                if (templateObject.reconVS1with.get()) {
                    setTimeout(function() {
                      $('#tblVS1With').DataTable({
                          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                          paging: false,
                          "scrollY": "400px",
                          "scrollCollapse": true,
                          "columnDefs": [{
                              "orderable": false,
                              "targets": 0
                          }],
                          // colReorder: true,
                          colReorder: {
                              fixedColumnsLeft: 1
                          },
                          select: true,
                          destroy: true,
                          // colReorder: true,
                          pageLength: 10,
                          lengthMenu: [
                              [initialDatatableLoad, -1],
                              [initialDatatableLoad, "All"]
                          ],
                          info: true,
                          responsive: true,
                          "order": [
                              [1, "desc"]
                          ],
                          action: function() {
                              $('#tblVS1With').DataTable().ajax.reload();
                          }
                      });
                        $('.fullScreenSpin').css('display', 'none');
                    }, 0);
                }
            } else {
                setTimeout(function() {
                  $('#tblVS1With').DataTable({
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      paging: false,
                      "scrollY": "400px",
                      "scrollCollapse": true,
                      "columnDefs": [{
                          "orderable": false,
                          "targets": 0
                      }],
                      // colReorder: true,
                      colReorder: {
                          fixedColumnsLeft: 1
                      },
                      select: true,
                      destroy: true,
                      // colReorder: true,
                      pageLength: 10,
                      lengthMenu: [
                          [initialDatatableLoad, -1],
                          [initialDatatableLoad, "All"]
                      ],
                      info: true,
                      responsive: true,
                      "order": [
                          [1, "desc"]
                      ],
                      action: function() {
                          $('#tblVS1With').DataTable().ajax.reload();
                      }
                  });
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);
            }
            $('.fullScreenSpin').css('display', 'none');
        }).catch(function(err) {
            $('.fullScreenSpin').css('display', 'none');
        });
    };
    // API to pull Withdrawals END

    // API to pull Opening Balance BEGIN
    templateObject.getOpenBalance = function(bankAccount) {
        recService.getReconciliationBalance(bankAccount).then(function(data) {
            var counter = 0;
            var openBal = 0;
            let dataArray = [];
            if (data.treconciliation.length) {
                for (let k in data.treconciliation) {
                    //if(data.treconciliation[k].CloseBalance > 0){
                    if (data.treconciliation[k].AccountName == bankAccount) {
                        // counter++;
                        let objData = {
                            Id: data.treconciliation[k].Id,
                            AccountName: data.treconciliation[k].AccountName,
                            CloseBalance: data.treconciliation[k].CloseBalance||0,
                            OpenBalance: data.treconciliation[k].OpenBalance||0,
                            OnHold: data.treconciliation[k].OnHold
                        };

                        dataArray.push(objData);
                        if (FlowRouter.current().queryParams.id) {} else {
                            if (data.treconciliation[k].OnHold == true) {
                                Session.setPersistent('bankaccountid', data.treconciliation[k].AccountID);
                                Session.setPersistent('bankaccountname', data.treconciliation[k].AccountName);
                                window.open('/bankrecon?id=' + data.treconciliation[k].Id, '_self');
                            }
                        }
                        // openBal = data.treconciliation[data.treconciliation.length - 1].CloseBalance;

                    }
                    //}
                }
                if (dataArray.length == 0) {
                    openBal = 0;
                } else {
                    for (let j in dataArray) {

                      if(dataArray[dataArray.length - 1].OnHold == true){
                        openBal = dataArray[dataArray.length - 1].OpenBalance;
                      }else{
                        openBal = dataArray[dataArray.length - 1].CloseBalance;
                      }

                    }
                }
                $('.openingbalance').val(utilityService.modifynegativeCurrencyFormat(openBal) || 0);
                $('.vs1cloudBalance').text(utilityService.modifynegativeCurrencyFormat(openBal) || 0);
            } else {
                $('.openingbalance').val(Currency + '0');
                $('.vs1cloudBalance').text(Currency + '0');

            }
            // $('#openingbalance2').val(utilityService.modifynegativeCurrencyFormat(openBal));
        }).catch(function(err) {
            $('.openingbalance').val(Currency + '0');
            $('.fullScreenSpin').css('display', 'none');
        });
    };

    templateObject.getVS1CloudBalance = function() {
        recService.getReconciliation().then(function(data) {
            var vs1openBal = 0;
            let latestReconId;
            var getrecon_id = url.split('?id=');
            var currentRecon = getrecon_id[getrecon_id.length - 1];
            if (data.treconciliation.length) {
                let lastElement = data.treconciliation[data.treconciliation.length - 1];
                latestReconId = (lastElement.Id);

                if (latestReconId == parseInt(currentRecon)) {
                    $('.btnDeleteRecon').prop("disabled", false);
                } else {
                    $('.btnDeleteRecon').prop("disabled", true);
                }


                for (let k in data.treconciliation) {
                    if (data.treconciliation[k].CloseBalance > 0) {
                        vs1openBal = data.treconciliation[data.treconciliation.length - 1].CloseBalance;
                    }
                }
                //$('.vs1cloudBalance').text(utilityService.modifynegativeCurrencyFormat(vs1openBal) || 0);
            } else {
                //$('.vs1cloudBalance').text(Currency + '0');
            }
            // $('#openingbalance2').val(utilityService.modifynegativeCurrencyFormat(openBal));
        });
    };
    // API to pull Opening Balance END

    if (url.indexOf('?id=') > 0) {
        var getrecon_id = url.split('?id=');
        var currentRecon = getrecon_id[getrecon_id.length - 1];
        let selectedTransAmountdep = 0;
        let selectedTransAmountwidth = 0;
        templateObject.getVS1CloudBalance();
        if (getrecon_id[1]) {
            currentRecon = parseInt(currentRecon);
            getVS1Data('TReconciliation').then(function(dataObject) {
                if (dataObject.length == 0) {
                    recService.getOneReconData(currentRecon).then(function(data) {
                        let recondep = [];
                        let reconwith = [];
                        let openingBalance = data.fields.OpenBalance || 0;
                        let endingBalance = data.fields.CloseBalance || 0;
                        let statementNo = data.fields.StatementNo || '';
                        let bankAccount = data.fields.AccountName || '';
                        let bankAccountID = data.fields.AccountID || '';
                        let statementDate = data.fields.ReconciliationDate ? moment(data.fields.ReconciliationDate).format('DD/MM/YYYY') : "";
                        let endingBalanceCalc = data.fields.CloseBalance || 0;
                        let clearedBalance = data.fields.CloseBalance || 0;
                        // let depositAmount = data.fields.CloseBalance || 0;
                        // let withdrawalAmount = data.fields.CloseBalance || 0;
                        //$('.btnDeleteRecon').css('display','block');
                        $('.openingbalance').val(utilityService.modifynegativeCurrencyFormat(openingBalance) || 0);
                        $('.vs1cloudBalance').text(utilityService.modifynegativeCurrencyFormat(openingBalance) || 0);
                        $('.endingbalance').val(utilityService.modifynegativeCurrencyFormat(endingBalance) || 0);
                        $('.statementno').val(statementNo);
                        $('.statementDate').val(statementDate);
                        //$('#bankAccountName').append('<option value="' + bankAccount + '" selected="selected">' + bankAccount + '</option>');
                        $('#bankAccountName').val(bankAccount);
                        $('#bankAccountID').val(bankAccountID);
                        $('.endingBalanceCalc').text(utilityService.modifynegativeCurrencyFormat(endingBalanceCalc) || 0);
                        $('.clearedBalance').text(utilityService.modifynegativeCurrencyFormat(clearedBalance) || 0);
                        $('.differenceCalc').text(Currency + "0.00" || 0);
                        // $('.depositAmount').val(utilityService.modifynegativeCurrencyFormat(depositAmount) || 0);
                        // $('.withdrawalAmount').val(utilityService.modifynegativeCurrencyFormat(withdrawalAmount) || 0);
                        if (data.fields.OnHold == false) {
                            $('#bankAccountName').attr('disabled', 'disabled');
                            $('#bankAccountName').attr('readonly', true);
                            $('.openingbalance').attr('readonly', true);
                            $('.endingbalance').attr('readonly', true);
                            $('.statementno').attr('readonly', true);
                            $('.statementDate').attr('disabled', 'disabled');
                            $('.statementDate').attr('readonly', true);
                            $('.statementDate').css('pointer-events', 'none');
                            $('#hideSelectionToggle').attr('disabled', 'disabled');
                            $('#hideSelectionToggle').attr('readonly', true);

                        } else {
                            $('.reconbtn').prop("disabled", false);
                            $('.btnHold').prop("disabled", false);
                        }
                        if (data.fields.DepositLines != null) {
                            if (data.fields.DepositLines.length > 0) {

                                for (let i in data.fields.DepositLines) {
                                    let depositamount = utilityService.modifynegativeCurrencyFormat(data.fields.DepositLines[i].fields.Amount) || 0.00;
                                    let reconepID = data.fields.DepositLines[i].fields.ID;
                                    if (data.fields.DepositLines[i].fields.Notes == 'Customer Payment') {
                                        reconepID = data.fields.DepositLines[i].fields.PaymentID;
                                    }
                                    let reconciledepositObj = {
                                        sortdate: data.fields.DepositLines[i].fields.DepositDate != '' ? moment(data.fields.DepositLines[i].fields.DepositDate).format("YYYY-MM-DD") : data.fields.DepositLines[i].fields.DepositDate,
                                        recondepdate: data.fields.DepositLines[i].fields.DepositDate != '' ? moment(data.fields.DepositLines[i].fields.DepositDate).format("DD/MM/YYYY") : data.fields.DepositLines[i].fields.DepositDate,
                                        recondepname: data.fields.DepositLines[i].fields.Payee || ' ',
                                        recondeppaymenttype: data.fields.DepositLines[i].fields.Notes || ' ',
                                        recondepamount: depositamount || 0.00,
                                        recondepid: reconepID || ' ',
                                        recondepref: data.fields.DepositLines[i].fields.Reference || ' ',
                                        seqdepnum: data.fields.DepositLines[i].fields.Recno || 0,
                                        recondeppaymentid: data.fields.DepositLines[i].fields.PaymentID || 0,
                                        depositLineID: data.fields.DepositLines[i].fields.DepositLineID || 0,
                                    };
                                    selectedTransAmountdep = selectedTransAmountdep + parseFloat(data.fields.DepositLines[i].fields.Amount);
                                    //if(data.ttobereconcileddeposit[i].Seqno != 0){
                                    recondep.push(reconciledepositObj);
                                    templateObject.reconVS1dep.set(recondep);
                                    //}
                                }

                                $('.depositAmount').text(utilityService.modifynegativeCurrencyFormat(selectedTransAmountdep) || Currency + "0.00");
                                if (templateObject.reconVS1dep.get()) {
                                  if (data.fields.OnHold == false) {
                                    setTimeout(function() {
                                        $('#tblVS1Dep').DataTable({
                                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                            buttons: [{
                                                extend: 'excelHtml5',
                                                text: '',
                                                download: 'open',
                                                className: "btntabletocsv hiddenColumn",
                                                filename: "chequelist_" + moment().format(),
                                                orientation: 'portrait',
                                                exportOptions: {
                                                    columns: ':visible'
                                                }
                                            }, {
                                                extend: 'print',
                                                download: 'open',
                                                className: "btntabletopdf hiddenColumn",
                                                text: '',
                                                title: 'Cheque',
                                                filename: "chequelist_" + moment().format(),
                                                exportOptions: {
                                                    columns: ':visible'
                                                }
                                            }],
                                            paging: false,
                                            "scrollY": "400px",
                                            "scrollCollapse": true,
                                            "columnDefs": [{
                                                "orderable": false,
                                                "targets": 0
                                            }],
                                            // colReorder: true,
                                            colReorder: {
                                                fixedColumnsLeft: 1
                                            },
                                            select: true,
                                            destroy: true,
                                            // colReorder: true,
                                            pageLength: 10,
                                            lengthMenu: [
                                                [initialDatatableLoad, -1],
                                                [initialDatatableLoad, "All"]
                                            ],
                                            info: true,
                                            responsive: true,
                                            "order": [
                                                [1, "desc"]
                                            ],
                                            action: function() {
                                                $('#tblVS1Dep').DataTable().ajax.reload();
                                            }
                                        });

                                    }, 0);

                                  }
                                }
                                if (data.fields.OnHold == false) {
                                    setTimeout(function() {
                                        $('.tblVS1Dep tr').each(function() {
                                            var $tblrow = $(this);
                                            $tblrow.find("th input").attr('readonly', true);
                                            $tblrow.find("th input").attr('disabled', 'disabled');
                                            $tblrow.find("th").css('background-color', '#eaecf4');

                                            $tblrow.find("td input").attr('readonly', true);
                                            $tblrow.find("td input").attr('disabled', 'disabled');
                                            $tblrow.find("td").css('background-color', '#eaecf4');
                                            $tblrow.find("td .table-remove").removeClass("btnRemove");
                                            $tblrow.find("td .reconchkboxdep").prop( "checked", true );
                                        }, 100);
                                    });
                                } else {
                                    setTimeout(function() {
                                        $(".reconchkboxdep").trigger("click");
                                    }, 100);
                                }
                            } else {
                                setTimeout(function() {
                                    $('#tblVS1Dep').DataTable({
                                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                        buttons: [{
                                            extend: 'excelHtml5',
                                            text: '',
                                            download: 'open',
                                            className: "btntabletocsv hiddenColumn",
                                            filename: "chequelist_" + moment().format(),
                                            orientation: 'portrait',
                                            exportOptions: {
                                                columns: ':visible'
                                            }
                                        }, {
                                            extend: 'print',
                                            download: 'open',
                                            className: "btntabletopdf hiddenColumn",
                                            text: '',
                                            title: 'Cheque',
                                            filename: "chequelist_" + moment().format(),
                                            exportOptions: {
                                                columns: ':visible'
                                            }
                                        }],
                                        paging: false,
                                        "scrollY": "400px",
                                        "scrollCollapse": true,
                                        "columnDefs": [{
                                            "orderable": false,
                                            "targets": 0
                                        }],
                                        // colReorder: true,
                                        colReorder: {
                                            fixedColumnsLeft: 1
                                        },
                                        select: true,
                                        destroy: true,
                                        // colReorder: true,
                                        pageLength: "All",
                                        lengthMenu: [
                                            [initialDatatableLoad, -1],
                                            [initialDatatableLoad, "All"]
                                        ],
                                        info: true,
                                        responsive: true,
                                        "order": [
                                            [1, "desc"]
                                        ],
                                        action: function() {
                                            $('#tblVS1Dep').DataTable().ajax.reload();
                                        }
                                    });

                                }, 0);
                            }
                        }
                        if (data.fields.WithdrawalLines != null) {
                            if (data.fields.WithdrawalLines.length > 0) {
                                for (let j in data.fields.WithdrawalLines) {
                                    let withdrawalamount = utilityService.modifynegativeCurrencyFormat(data.fields.WithdrawalLines[j].fields.Amount) || 0.00;
                                    let reconepWidID = data.fields.WithdrawalLines[j].fields.ID;
                                    if (data.fields.WithdrawalLines[j].fields.Notes == 'Customer Payment') {
                                        reconepWidID = data.fields.WithdrawalLines[j].fields.PaymentID;
                                    }
                                    let reconcilewithdrawalObj = {
                                        sortdate: data.fields.WithdrawalLines[j].fields.DepositDate != '' ? moment(data.fields.WithdrawalLines[j].fields.DepositDate).format("YYYY-MM-DD") : data.fields.WithdrawalLines[j].fields.DepositDate,
                                        reconwithdate: data.fields.WithdrawalLines[j].fields.DepositDate != '' ? moment(data.fields.WithdrawalLines[j].fields.DepositDate).format("DD/MM/YYYY") : data.fields.WithdrawalLines[j].fields.DepositDate,
                                        reconwithname: data.fields.WithdrawalLines[j].fields.ClientName || ' ',
                                        reconwithpaymenttype: data.fields.WithdrawalLines[j].fields.Notes || ' ',
                                        reconwithamount: withdrawalamount || 0.00,
                                        reconwithid: reconepWidID || ' ',
                                        reconwithref: data.fields.WithdrawalLines[j].fields.Reference || ' ',
                                        seqwithnum: data.fields.WithdrawalLines[j].fields.Recno || 0,
                                        reconwithpaymentid: data.fields.WithdrawalLines[j].fields.PaymentID || 0,
                                        depositLineID: data.fields.WithdrawalLines[j].fields.DepositLineID || 0,
                                    };

                                    reconwith.push(reconcilewithdrawalObj);
                                    templateObject.reconVS1with.set(reconwith);
                                    selectedTransAmountwidth = selectedTransAmountwidth + parseFloat(data.fields.WithdrawalLines[j].fields.Amount);

                                }

                                $('.withdrawalAmount').text(utilityService.modifynegativeCurrencyFormat(selectedTransAmountwidth) || Currency + "0.00");
                                if (templateObject.reconVS1with.get()) {
                                  if (data.fields.OnHold == false) {
                                    setTimeout(function() {
                                        $('#tblVS1With').DataTable({
                                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                            buttons: [{
                                                extend: 'excelHtml5',
                                                text: '',
                                                download: 'open',
                                                className: "btntabletocsv hiddenColumn",
                                                filename: "chequelist_" + moment().format(),
                                                orientation: 'portrait',
                                                exportOptions: {
                                                    columns: ':visible'
                                                }
                                            }, {
                                                extend: 'print',
                                                download: 'open',
                                                className: "btntabletopdf hiddenColumn",
                                                text: '',
                                                title: 'Cheque',
                                                filename: "chequelist_" + moment().format(),
                                                exportOptions: {
                                                    columns: ':visible'
                                                }
                                            }],
                                            paging: false,
                                            "scrollY": "400px",
                                            "scrollCollapse": true,
                                            select: true,
                                            "columnDefs": [{
                                                "orderable": false,
                                                "targets": 0
                                            }],
                                            // colReorder: true,
                                            colReorder: {
                                                fixedColumnsLeft: 1
                                            },
                                            destroy: true,
                                            pageLength: 10,
                                            lengthMenu: [
                                                [initialDatatableLoad, -1],
                                                [initialDatatableLoad, "All"]
                                            ],
                                            info: true,
                                            responsive: true,
                                            "order": [
                                                [1, "desc"]
                                            ],
                                            action: function() {
                                                $('#tblVS1With').DataTable().ajax.reload();
                                            }
                                        });

                                    }, 0);
                                  }
                                }
                                if (data.fields.OnHold == false) {
                                    setTimeout(function() {
                                        $('.tblVS1With tr').each(function() {
                                            var $tblrow = $(this);
                                            $tblrow.find("th input").attr('readonly', true);
                                            $tblrow.find("th input").attr('disabled', 'disabled');
                                            $tblrow.find("th").css('background-color', '#eaecf4');

                                            $tblrow.find("td input").attr('readonly', true);
                                            $tblrow.find("td input").attr('disabled', 'disabled');
                                            $tblrow.find("td").css('background-color', '#eaecf4');
                                            $tblrow.find("td .table-remove").removeClass("btnRemove");
                                            $tblrow.find("td .reconchkboxwith").prop( "checked", true );
                                        }, 100);
                                    });
                                } else {
                                    setTimeout(function() {
                                        $(".reconchkboxwith").trigger("click");
                                    }, 100);
                                }
                            } else {
                                setTimeout(function() {
                                    $('#tblVS1With').DataTable({
                                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                        buttons: [{
                                            extend: 'excelHtml5',
                                            text: '',
                                            download: 'open',
                                            className: "btntabletocsv hiddenColumn",
                                            filename: "chequelist_" + moment().format(),
                                            orientation: 'portrait',
                                            exportOptions: {
                                                columns: ':visible'
                                            }
                                        }, {
                                            extend: 'print',
                                            download: 'open',
                                            className: "btntabletopdf hiddenColumn",
                                            text: '',
                                            title: 'Cheque',
                                            filename: "chequelist_" + moment().format(),
                                            exportOptions: {
                                                columns: ':visible'
                                            }
                                        }],
                                        paging: false,
                                        "scrollY": "400px",
                                        "scrollCollapse": true,
                                        select: true,
                                        "columnDefs": [{
                                            "orderable": false,
                                            "targets": 0
                                        }],
                                        // colReorder: true,
                                        colReorder: {
                                            fixedColumnsLeft: 1
                                        },
                                        destroy: true,
                                        pageLength: 10,
                                        lengthMenu: [
                                            [initialDatatableLoad, -1],
                                            [initialDatatableLoad, "All"]
                                        ],
                                        info: true,
                                        responsive: true,
                                        "order": [
                                            [1, "desc"]
                                        ],
                                        action: function() {
                                            $('#tblVS1With').DataTable().ajax.reload();
                                        }
                                    });
                                    $('.fullScreenSpin').css('display', 'none');
                                }, 0);
                            }
                        }
                        //$('#hideSelectionToggle').css('pointer-events', 'none');


                        if (data.fields.OnHold == true) {
                          Session.setPersistent('bankaccountid', data.fields.AccountID);
                          Session.setPersistent('bankaccountname', data.fields.AccountName);
                          templateObject.getAccountNames();
                        }
                        $('.fullScreenSpin').css('display', 'none');
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.treconciliation;
                    var added = false;
                    for (let d = 0; d < useData.length; d++) {
                        if (parseInt(useData[d].fields.ID) == currentRecon) {
                            added = true;
                            $('.fullScreenSpin').css('display', 'none');
                            let recondep = [];
                            let reconwith = [];
                            let openingBalance = useData[d].fields.OpenBalance || 0;
                            let endingBalance = useData[d].fields.CloseBalance || 0;
                            let statementNo = useData[d].fields.StatementNo || '';
                            let bankAccount = useData[d].fields.AccountName || '';
                            let bankAccountID = useData[d].fields.AccountID || '';
                            let statementDate = useData[d].fields.ReconciliationDate ? moment(useData[d].fields.ReconciliationDate).format('DD/MM/YYYY') : "";
                            let endingBalanceCalc = useData[d].fields.CloseBalance || 0;
                            let clearedBalance = useData[d].fields.CloseBalance || 0;
                            // let depositAmount = useData[d].fields.CloseBalance || 0;
                            // let withdrawalAmount = useData[d].fields.CloseBalance || 0;
                            //$('.btnDeleteRecon').css('display','block');
                            $('.openingbalance').val(utilityService.modifynegativeCurrencyFormat(openingBalance) || 0);
                            $('.vs1cloudBalance').text(utilityService.modifynegativeCurrencyFormat(openingBalance) || 0);
                            $('.endingbalance').val(utilityService.modifynegativeCurrencyFormat(endingBalance) || 0);
                            $('.statementno').val(statementNo);
                            $('.statementDate').val(statementDate);
                            //$('#bankAccountName').append('<option value="' + bankAccount + '" selected="selected">' + bankAccount + '</option>');
                            $('#bankAccountName').val(bankAccount);
                            $('#bankAccountID').val(bankAccountID);
                            $('.endingBalanceCalc').text(utilityService.modifynegativeCurrencyFormat(endingBalanceCalc) || 0);
                            $('.clearedBalance').text(utilityService.modifynegativeCurrencyFormat(clearedBalance) || 0);
                            $('.differenceCalc').text(Currency + "0.00" || 0);
                            // $('.depositAmount').val(utilityService.modifynegativeCurrencyFormat(depositAmount) || 0);
                            // $('.withdrawalAmount').val(utilityService.modifynegativeCurrencyFormat(withdrawalAmount) || 0);
                            if (useData[d].fields.OnHold == false) {
                                $('#bankAccountName').attr('disabled', 'disabled');
                                $('#bankAccountName').attr('readonly', true);
                                $('.openingbalance').attr('readonly', true);
                                $('.endingbalance').attr('readonly', true);
                                $('.statementno').attr('readonly', true);
                                $('.statementDate').attr('disabled', 'disabled');
                                $('.statementDate').attr('readonly', true);
                                $('.statementDate').css('pointer-events', 'none');
                                $('#hideSelectionToggle').attr('disabled', 'disabled');
                                $('#hideSelectionToggle').attr('readonly', true);

                            } else {
                                $('.reconbtn').prop("disabled", false);
                                $('.btnHold').prop("disabled", false);
                            }
                            if (useData[d].fields.DepositLines != null) {
                                if (useData[d].fields.DepositLines.length > 0) {

                                    for (let i in useData[d].fields.DepositLines) {
                                        if (useData[d].fields.DepositLines.hasOwnProperty(i)) {
                                            let depositamount = utilityService.modifynegativeCurrencyFormat(useData[d].fields.DepositLines[i].fields.Amount) || 0.00;
                                            let reconepID = useData[d].fields.DepositLines[i].fields.ID;
                                            if (useData[d].fields.DepositLines[i].fields.Notes == 'Customer Payment') {
                                                reconepID = useData[d].fields.DepositLines[i].fields.PaymentID;
                                            }
                                            let reconciledepositObj = {
                                                sortdate: useData[d].fields.DepositLines[i].fields.DepositDate != '' ? moment(useData[d].fields.DepositLines[i].fields.DepositDate).format("YYYY-MM-DD") : useData[d].fields.DepositLines[i].fields.DepositDate,
                                                recondepdate: useData[d].fields.DepositLines[i].fields.DepositDate != '' ? moment(useData[d].fields.DepositLines[i].fields.DepositDate).format("DD/MM/YYYY") : useData[d].fields.DepositLines[i].fields.DepositDate,
                                                recondepname: useData[d].fields.DepositLines[i].fields.Payee || ' ',
                                                recondeppaymenttype: useData[d].fields.DepositLines[i].fields.Notes || ' ',
                                                recondepamount: depositamount || 0.00,
                                                recondepid: reconepID || ' ',
                                                recondepref: useData[d].fields.DepositLines[i].fields.Reference || ' ',
                                                seqdepnum: useData[d].fields.DepositLines[i].fields.Recno || 0,
                                                recondeppaymentid: useData[d].fields.DepositLines[i].fields.PaymentID || 0,
                                                depositLineID: useData[d].fields.DepositLines[i].fields.DepositLineID || 0,
                                            };
                                            selectedTransAmountdep = selectedTransAmountdep + parseFloat(useData[d].fields.DepositLines[i].fields.Amount);
                                            //if(useData[d].ttobereconcileddeposit[i].Seqno != 0){
                                            recondep.push(reconciledepositObj);
                                            templateObject.reconVS1dep.set(recondep);
                                        //}
                                        }
                                    }

                                    $('.depositAmount').text(utilityService.modifynegativeCurrencyFormat(selectedTransAmountdep) || Currency + "0.00");
                                    if (templateObject.reconVS1dep.get()) {
                                      if (useData[d].fields.OnHold == false) {
                                        setTimeout(function() {
                                            $('#tblVS1Dep').DataTable({
                                                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                                buttons: [{
                                                    extend: 'excelHtml5',
                                                    text: '',
                                                    download: 'open',
                                                    className: "btntabletocsv hiddenColumn",
                                                    filename: "chequelist_" + moment().format(),
                                                    orientation: 'portrait',
                                                    exportOptions: {
                                                        columns: ':visible'
                                                    }
                                                }, {
                                                    extend: 'print',
                                                    download: 'open',
                                                    className: "btntabletopdf hiddenColumn",
                                                    text: '',
                                                    title: 'Cheque',
                                                    filename: "chequelist_" + moment().format(),
                                                    exportOptions: {
                                                        columns: ':visible'
                                                    }
                                                }],
                                                paging: false,
                                                "scrollY": "400px",
                                                "scrollCollapse": true,
                                                "columnDefs": [{
                                                    "orderable": false,
                                                    "targets": 0
                                                }],
                                                // colReorder: true,
                                                colReorder: {
                                                    fixedColumnsLeft: 1
                                                },
                                                select: true,
                                                destroy: true,
                                                pageLength: 10,
                                                lengthMenu: [
                                                    [initialDatatableLoad, -1],
                                                    [initialDatatableLoad, "All"]
                                                ],
                                                info: true,
                                                responsive: true,
                                                "order": [
                                                    [1, "desc"]
                                                ],
                                                action: function() {
                                                    $('#tblVS1Dep').DataTable().ajax.reload();
                                                }
                                            });

                                        }, 0);
                                      }
                                    }

                                    if (useData[d].fields.OnHold == false) {
                                        setTimeout(function() {
                                            $('.tblVS1Dep tr').each(function() {
                                                var $tblrow = $(this);
                                                $tblrow.find("th input").attr('readonly', true);
                                                $tblrow.find("th input").attr('disabled', 'disabled');
                                                $tblrow.find("th").css('background-color', '#eaecf4');

                                                $tblrow.find("td input").attr('readonly', true);
                                                $tblrow.find("td input").attr('disabled', 'disabled');
                                                $tblrow.find("td").css('background-color', '#eaecf4');
                                                $tblrow.find("td .table-remove").removeClass("btnRemove");
                                                $tblrow.find("td .reconchkboxdep").prop( "checked", true );
                                                // $(".reconchkboxdep").trigger("click");
                                            }, 100);
                                        });
                                    } else {
                                        setTimeout(function() {
                                            $(".reconchkboxdep").trigger("click");
                                        }, 100);
                                    }
                                } else {
                                    setTimeout(function() {
                                        $('#tblVS1Dep').DataTable({
                                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                            buttons: [{
                                                extend: 'excelHtml5',
                                                text: '',
                                                download: 'open',
                                                className: "btntabletocsv hiddenColumn",
                                                filename: "chequelist_" + moment().format(),
                                                orientation: 'portrait',
                                                exportOptions: {
                                                    columns: ':visible'
                                                }
                                            }, {
                                                extend: 'print',
                                                download: 'open',
                                                className: "btntabletopdf hiddenColumn",
                                                text: '',
                                                title: 'Cheque',
                                                filename: "chequelist_" + moment().format(),
                                                exportOptions: {
                                                    columns: ':visible'
                                                }
                                            }],
                                            paging: false,
                                            "scrollY": "400px",
                                            "scrollCollapse": true,
                                            "columnDefs": [{
                                                "orderable": false,
                                                "targets": 0
                                            }],
                                            // colReorder: true,
                                            colReorder: {
                                                fixedColumnsLeft: 1
                                            },
                                            select: true,
                                            destroy: true,
                                            pageLength: "All",
                                            lengthMenu: [
                                                [initialDatatableLoad, -1],
                                                [initialDatatableLoad, "All"]
                                            ],
                                            info: true,
                                            responsive: true,
                                            "order": [
                                                [1, "desc"]
                                            ],
                                            action: function() {
                                                $('#tblVS1Dep').DataTable().ajax.reload();
                                            }
                                        });

                                    }, 0);
                                }
                            }
                            if (useData[d].fields.WithdrawalLines != null) {
                                if (useData[d].fields.WithdrawalLines.length > 0) {
                                    for (let j in useData[d].fields.WithdrawalLines) {
                                        if (useData[d].fields.WithdrawalLines.hasOwnProperty(j)) {
                                            let withdrawalamount = utilityService.modifynegativeCurrencyFormat(useData[d].fields.WithdrawalLines[j].fields.Amount) || 0.00;
                                            let reconepWidID = useData[d].fields.WithdrawalLines[j].fields.ID;
                                            if (useData[d].fields.WithdrawalLines[j].fields.Notes == 'Customer Payment') {
                                                reconepWidID = useData[d].fields.WithdrawalLines[j].fields.PaymentID;
                                            }
                                            let reconcilewithdrawalObj = {
                                                sortdate: useData[d].fields.WithdrawalLines[j].fields.DepositDate != '' ? moment(useData[d].fields.WithdrawalLines[j].fields.DepositDate).format("YYYY-MM-DD") : useData[d].fields.WithdrawalLines[j].fields.DepositDate,
                                                reconwithdate: useData[d].fields.WithdrawalLines[j].fields.DepositDate != '' ? moment(useData[d].fields.WithdrawalLines[j].fields.DepositDate).format("DD/MM/YYYY") : useData[d].fields.WithdrawalLines[j].fields.DepositDate,
                                                reconwithname: useData[d].fields.WithdrawalLines[j].fields.ClientName || ' ',
                                                reconwithpaymenttype: useData[d].fields.WithdrawalLines[j].fields.Notes || ' ',
                                                reconwithamount: withdrawalamount || 0.00,
                                                reconwithid: reconepWidID || ' ',
                                                reconwithref: useData[d].fields.WithdrawalLines[j].fields.Reference || ' ',
                                                seqwithnum: useData[d].fields.WithdrawalLines[j].fields.Recno || 0,
                                                reconwithpaymentid: useData[d].fields.WithdrawalLines[j].fields.PaymentID || 0,
                                                depositLineID: useData[d].fields.WithdrawalLines[j].fields.DepositLineID || 0,
                                            };

                                            reconwith.push(reconcilewithdrawalObj);
                                            templateObject.reconVS1with.set(reconwith);
                                            selectedTransAmountwidth = selectedTransAmountwidth + parseFloat(useData[d].fields.WithdrawalLines[j].fields.Amount);
                                        }

                                    }

                                    $('.withdrawalAmount').text(utilityService.modifynegativeCurrencyFormat(selectedTransAmountwidth) || Currency + "0.00");
                                    if (templateObject.reconVS1with.get()) {
                                      if (useData[d].fields.OnHold == false) {
                                        setTimeout(function() {
                                            $('#tblVS1With').DataTable({
                                                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                                buttons: [{
                                                    extend: 'excelHtml5',
                                                    text: '',
                                                    download: 'open',
                                                    className: "btntabletocsv hiddenColumn",
                                                    filename: "chequelist_" + moment().format(),
                                                    orientation: 'portrait',
                                                    exportOptions: {
                                                        columns: ':visible'
                                                    }
                                                }, {
                                                    extend: 'print',
                                                    download: 'open',
                                                    className: "btntabletopdf hiddenColumn",
                                                    text: '',
                                                    title: 'Cheque',
                                                    filename: "chequelist_" + moment().format(),
                                                    exportOptions: {
                                                        columns: ':visible'
                                                    }
                                                }],
                                                paging: false,
                                                "scrollY": "400px",
                                                "scrollCollapse": true,
                                                select: true,
                                                "columnDefs": [{
                                                    "orderable": false,
                                                    "targets": 0
                                                }],
                                                // colReorder: true,
                                                colReorder: {
                                                    fixedColumnsLeft: 1
                                                },
                                                destroy: true,
                                                pageLength: 10,
                                                lengthMenu: [
                                                    [initialDatatableLoad, -1],
                                                    [initialDatatableLoad, "All"]
                                                ],
                                                info: true,
                                                responsive: true,
                                                "order": [
                                                    [1, "desc"]
                                                ],
                                                action: function() {
                                                    $('#tblVS1With').DataTable().ajax.reload();
                                                }
                                            });

                                        }, 0);
                                      }else{

                                      }
                                    }

                                    if (useData[d].fields.OnHold == false) {
                                        setTimeout(function() {
                                            $('.tblVS1With tr').each(function() {
                                                var $tblrow = $(this);
                                                $tblrow.find("th input").attr('readonly', true);
                                                $tblrow.find("th input").attr('disabled', 'disabled');
                                                $tblrow.find("th").css('background-color', '#eaecf4');

                                                $tblrow.find("td input").attr('readonly', true);
                                                $tblrow.find("td input").attr('disabled', 'disabled');
                                                $tblrow.find("td").css('background-color', '#eaecf4');
                                                $tblrow.find("td .table-remove").removeClass("btnRemove");
                                                $tblrow.find("td .reconchkboxwith").prop( "checked", true );
                                            }, 100);
                                        });
                                    } else {
                                        setTimeout(function() {
                                            $(".reconchkboxwith").trigger("click");
                                        }, 100);
                                    }
                                } else {
                                    setTimeout(function() {
                                        $('#tblVS1With').DataTable({
                                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                            buttons: [{
                                                extend: 'excelHtml5',
                                                text: '',
                                                download: 'open',
                                                className: "btntabletocsv hiddenColumn",
                                                filename: "chequelist_" + moment().format(),
                                                orientation: 'portrait',
                                                exportOptions: {
                                                    columns: ':visible'
                                                }
                                            }, {
                                                extend: 'print',
                                                download: 'open',
                                                className: "btntabletopdf hiddenColumn",
                                                text: '',
                                                title: 'Cheque',
                                                filename: "chequelist_" + moment().format(),
                                                exportOptions: {
                                                    columns: ':visible'
                                                }
                                            }],
                                            paging: false,
                                            "scrollY": "400px",
                                            "scrollCollapse": true,
                                            select: true,
                                            "columnDefs": [{
                                                "orderable": false,
                                                "targets": 0
                                            }],
                                            // colReorder: true,
                                            colReorder: {
                                                fixedColumnsLeft: 1
                                            },
                                            destroy: true,
                                            pageLength: 10,
                                            lengthMenu: [
                                                [initialDatatableLoad, -1],
                                                [initialDatatableLoad, "All"]
                                            ],
                                            info: true,
                                            responsive: true,
                                            "order": [
                                                [1, "desc"]
                                            ],
                                            action: function() {
                                                $('#tblVS1With').DataTable().ajax.reload();
                                            }
                                        });
                                        $('.fullScreenSpin').css('display', 'none');
                                    }, 0);
                                }

                            }

                            if (useData[d].fields.OnHold == true) {
                              Session.setPersistent('bankaccountid', useData[d].fields.AccountID);
                              Session.setPersistent('bankaccountname', useData[d].fields.AccountName);
                              templateObject.getAccountNames();
                            }
                        }
                    }

                    if (!added) {
                        recService.getOneReconData(currentRecon).then(function(data) {
                            let recondep = [];
                            let reconwith = [];
                            let openingBalance = data.fields.OpenBalance || 0;
                            let endingBalance = data.fields.CloseBalance || 0;
                            let statementNo = data.fields.StatementNo || '';
                            let bankAccount = data.fields.AccountName || '';
                            let bankAccountID = data.fields.AccountID || '';
                            let statementDate = data.fields.ReconciliationDate ? moment(data.fields.ReconciliationDate).format('DD/MM/YYYY') : "";
                            let endingBalanceCalc = data.fields.CloseBalance || 0;
                            let clearedBalance = data.fields.CloseBalance || 0;
                            // let depositAmount = data.fields.CloseBalance || 0;
                            // let withdrawalAmount = data.fields.CloseBalance || 0;
                            //$('.btnDeleteRecon').css('display','block');
                            $('.openingbalance').val(utilityService.modifynegativeCurrencyFormat(openingBalance) || 0);
                            $('.vs1cloudBalance').text(utilityService.modifynegativeCurrencyFormat(openingBalance) || 0);
                            $('.endingbalance').val(utilityService.modifynegativeCurrencyFormat(endingBalance) || 0);
                            $('.statementno').val(statementNo);
                            $('.statementDate').val(statementDate);
                            //$('#bankAccountName').append('<option value="' + bankAccount + '" selected="selected">' + bankAccount + '</option>');
                            $('#bankAccountName').val(bankAccount);
                            $('#bankAccountID').val(bankAccountID);
                            $('.endingBalanceCalc').text(utilityService.modifynegativeCurrencyFormat(endingBalanceCalc) || 0);
                            $('.clearedBalance').text(utilityService.modifynegativeCurrencyFormat(clearedBalance) || 0);
                            $('.differenceCalc').text(Currency + "0.00" || 0);
                            // $('.depositAmount').val(utilityService.modifynegativeCurrencyFormat(depositAmount) || 0);
                            // $('.withdrawalAmount').val(utilityService.modifynegativeCurrencyFormat(withdrawalAmount) || 0);
                            if (data.fields.OnHold == false) {
                                $('#bankAccountName').attr('disabled', 'disabled');
                                $('#bankAccountName').attr('readonly', true);
                                $('.openingbalance').attr('readonly', true);
                                $('.endingbalance').attr('readonly', true);
                                $('.statementno').attr('readonly', true);
                                $('.statementDate').attr('disabled', 'disabled');
                                $('.statementDate').attr('readonly', true);
                                $('.statementDate').css('pointer-events', 'none');
                                $('#hideSelectionToggle').attr('disabled', 'disabled');
                                $('#hideSelectionToggle').attr('readonly', true);

                            } else {
                                $('.reconbtn').prop("disabled", false);
                                $('.btnHold').prop("disabled", false);
                            }
                            if (data.fields.DepositLines != null) {
                                if (data.fields.DepositLines.length > 0) {

                                    for (let i in data.fields.DepositLines) {
                                        if (data.fields.DepositLines.hasOwnProperty(i)) {
                                            let depositamount = utilityService.modifynegativeCurrencyFormat(data.fields.DepositLines[i].fields.Amount) || 0.00;
                                            let reconepID = data.fields.DepositLines[i].fields.ID;
                                            if (data.fields.DepositLines[i].fields.Notes == 'Customer Payment') {
                                                reconepID = data.fields.DepositLines[i].fields.PaymentID;
                                            }
                                            let reconciledepositObj = {
                                                sortdate: data.fields.DepositLines[i].fields.DepositDate != '' ? moment(data.fields.DepositLines[i].fields.DepositDate).format("YYYY-MM-DD") : data.fields.DepositLines[i].fields.DepositDate,
                                                recondepdate: data.fields.DepositLines[i].fields.DepositDate != '' ? moment(data.fields.DepositLines[i].fields.DepositDate).format("DD/MM/YYYY") : data.fields.DepositLines[i].fields.DepositDate,
                                                recondepname: data.fields.DepositLines[i].fields.Payee || ' ',
                                                recondeppaymenttype: data.fields.DepositLines[i].fields.Notes || ' ',
                                                recondepamount: depositamount || 0.00,
                                                recondepid: reconepID || ' ',
                                                recondepref: data.fields.DepositLines[i].fields.Reference || ' ',
                                                seqdepnum: data.fields.DepositLines[i].fields.Recno || 0,
                                                recondeppaymentid: data.fields.DepositLines[i].fields.PaymentID || 0,
                                                depositLineID: data.fields.DepositLines[i].fields.DepositLineID || 0,
                                            };
                                            selectedTransAmountdep = selectedTransAmountdep + parseFloat(data.fields.DepositLines[i].fields.Amount);
                                            //if(data.ttobereconcileddeposit[i].Seqno != 0){
                                            recondep.push(reconciledepositObj);
                                            templateObject.reconVS1dep.set(recondep);
                                            //}
                                        }
                                    }

                                    $('.depositAmount').text(utilityService.modifynegativeCurrencyFormat(selectedTransAmountdep) || Currency + "0.00");
                                    if (templateObject.reconVS1dep.get()) {
                                      if (data.fields.OnHold == false) {
                                        setTimeout(function() {
                                            $('#tblVS1Dep').DataTable({
                                                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                                buttons: [{
                                                    extend: 'excelHtml5',
                                                    text: '',
                                                    download: 'open',
                                                    className: "btntabletocsv hiddenColumn",
                                                    filename: "chequelist_" + moment().format(),
                                                    orientation: 'portrait',
                                                    exportOptions: {
                                                        columns: ':visible'
                                                    }
                                                }, {
                                                    extend: 'print',
                                                    download: 'open',
                                                    className: "btntabletopdf hiddenColumn",
                                                    text: '',
                                                    title: 'Cheque',
                                                    filename: "chequelist_" + moment().format(),
                                                    exportOptions: {
                                                        columns: ':visible'
                                                    }
                                                }],
                                                paging: false,
                                                "scrollY": "400px",
                                                "scrollCollapse": true,
                                                "columnDefs": [{
                                                    "orderable": false,
                                                    "targets": 0
                                                }],
                                                // colReorder: true,
                                                colReorder: {
                                                    fixedColumnsLeft: 1
                                                },
                                                select: true,
                                                destroy: true,
                                                pageLength: 10,
                                                lengthMenu: [
                                                    [initialDatatableLoad, -1],
                                                    [initialDatatableLoad, "All"]
                                                ],
                                                info: true,
                                                responsive: true,
                                                "order": [
                                                    [1, "desc"]
                                                ],
                                                action: function() {
                                                    $('#tblVS1Dep').DataTable().ajax.reload();
                                                }
                                            });

                                        }, 0);
                                      }
                                    }
                                    if (data.fields.OnHold == false) {
                                        setTimeout(function() {
                                            $('.tblVS1Dep tr').each(function() {
                                                var $tblrow = $(this);
                                                $tblrow.find("th input").attr('readonly', true);
                                                $tblrow.find("th input").attr('disabled', 'disabled');
                                                $tblrow.find("th").css('background-color', '#eaecf4');

                                                $tblrow.find("td input").attr('readonly', true);
                                                $tblrow.find("td input").attr('disabled', 'disabled');
                                                $tblrow.find("td").css('background-color', '#eaecf4');
                                                $tblrow.find("td .table-remove").removeClass("btnRemove");
                                                $tblrow.find("td .reconchkboxdep").prop( "checked", true );
                                            }, 100);
                                        });
                                    } else {
                                        setTimeout(function() {
                                            $(".reconchkboxdep").trigger("click");
                                        }, 100);
                                    }
                                } else {
                                    setTimeout(function() {
                                        $('#tblVS1Dep').DataTable({
                                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                            buttons: [{
                                                extend: 'excelHtml5',
                                                text: '',
                                                download: 'open',
                                                className: "btntabletocsv hiddenColumn",
                                                filename: "chequelist_" + moment().format(),
                                                orientation: 'portrait',
                                                exportOptions: {
                                                    columns: ':visible'
                                                }
                                            }, {
                                                extend: 'print',
                                                download: 'open',
                                                className: "btntabletopdf hiddenColumn",
                                                text: '',
                                                title: 'Cheque',
                                                filename: "chequelist_" + moment().format(),
                                                exportOptions: {
                                                    columns: ':visible'
                                                }
                                            }],
                                            paging: false,
                                            "scrollY": "400px",
                                            "scrollCollapse": true,
                                            "columnDefs": [{
                                                "orderable": false,
                                                "targets": 0
                                            }],
                                            // colReorder: true,
                                            colReorder: {
                                                fixedColumnsLeft: 1
                                            },
                                            select: true,
                                            destroy: true,
                                            pageLength: "All",
                                            lengthMenu: [
                                                [initialDatatableLoad, -1],
                                                [initialDatatableLoad, "All"]
                                            ],
                                            info: true,
                                            responsive: true,
                                            "order": [
                                                [1, "desc"]
                                            ],
                                            action: function() {
                                                $('#tblVS1Dep').DataTable().ajax.reload();
                                            }
                                        });

                                    }, 0);
                                }
                            }
                            if (data.fields.WithdrawalLines != null) {
                                if (data.fields.WithdrawalLines.length > 0) {
                                    for (let j in data.fields.WithdrawalLines) {
                                        if (data.fields.WithdrawalLines.hasOwnProperty(j)) {
                                            let withdrawalamount = utilityService.modifynegativeCurrencyFormat(data.fields.WithdrawalLines[j].fields.Amount) || 0.00;
                                            let reconepWidID = data.fields.WithdrawalLines[j].fields.ID;
                                            if (data.fields.WithdrawalLines[j].fields.Notes == 'Customer Payment') {
                                                reconepWidID = data.fields.WithdrawalLines[j].fields.PaymentID;
                                            }
                                            let reconcilewithdrawalObj = {
                                                sortdate: data.fields.WithdrawalLines[j].fields.DepositDate != '' ? moment(data.fields.WithdrawalLines[j].fields.DepositDate).format("YYYY-MM-DD") : data.fields.WithdrawalLines[j].fields.DepositDate,
                                                reconwithdate: data.fields.WithdrawalLines[j].fields.DepositDate != '' ? moment(data.fields.WithdrawalLines[j].fields.DepositDate).format("DD/MM/YYYY") : data.fields.WithdrawalLines[j].fields.DepositDate,
                                                reconwithname: data.fields.WithdrawalLines[j].fields.ClientName || ' ',
                                                reconwithpaymenttype: data.fields.WithdrawalLines[j].fields.Notes || ' ',
                                                reconwithamount: withdrawalamount || 0.00,
                                                reconwithid: reconepWidID || ' ',
                                                reconwithref: data.fields.WithdrawalLines[j].fields.Reference || ' ',
                                                seqwithnum: data.fields.WithdrawalLines[j].fields.Recno || 0,
                                                reconwithpaymentid: data.fields.WithdrawalLines[j].fields.PaymentID || 0,
                                                depositLineID: data.fields.WithdrawalLines[j].fields.DepositLineID || 0,
                                            };

                                            reconwith.push(reconcilewithdrawalObj);
                                            templateObject.reconVS1with.set(reconwith);
                                            selectedTransAmountwidth = selectedTransAmountwidth + parseFloat(data.fields.WithdrawalLines[j].fields.Amount);
                                        }

                                    }

                                    $('.withdrawalAmount').text(utilityService.modifynegativeCurrencyFormat(selectedTransAmountwidth) || Currency + "0.00");
                                    if (templateObject.reconVS1with.get()) {
                                      if (data.fields.OnHold == false) {
                                        setTimeout(function() {
                                            $('#tblVS1With').DataTable({
                                                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                                buttons: [{
                                                    extend: 'excelHtml5',
                                                    text: '',
                                                    download: 'open',
                                                    className: "btntabletocsv hiddenColumn",
                                                    filename: "chequelist_" + moment().format(),
                                                    orientation: 'portrait',
                                                    exportOptions: {
                                                        columns: ':visible'
                                                    }
                                                }, {
                                                    extend: 'print',
                                                    download: 'open',
                                                    className: "btntabletopdf hiddenColumn",
                                                    text: '',
                                                    title: 'Cheque',
                                                    filename: "chequelist_" + moment().format(),
                                                    exportOptions: {
                                                        columns: ':visible'
                                                    }
                                                }],
                                                paging: false,
                                                "scrollY": "400px",
                                                "scrollCollapse": true,
                                                select: true,
                                                "columnDefs": [{
                                                    "orderable": false,
                                                    "targets": 0
                                                }],
                                                // colReorder: true,
                                                colReorder: {
                                                    fixedColumnsLeft: 1
                                                },
                                                destroy: true,
                                                pageLength: 10,
                                                lengthMenu: [
                                                    [initialDatatableLoad, -1],
                                                    [initialDatatableLoad, "All"]
                                                ],
                                                info: true,
                                                responsive: true,
                                                "order": [
                                                    [1, "desc"]
                                                ],
                                                action: function() {
                                                    $('#tblVS1With').DataTable().ajax.reload();
                                                }
                                            });

                                        }, 0);
                                      }
                                    }
                                    if (data.fields.OnHold == false) {
                                        setTimeout(function() {
                                            $('.tblVS1With tr').each(function() {
                                                var $tblrow = $(this);
                                                $tblrow.find("th input").attr('readonly', true);
                                                $tblrow.find("th input").attr('disabled', 'disabled');
                                                $tblrow.find("th").css('background-color', '#eaecf4');

                                                $tblrow.find("td input").attr('readonly', true);
                                                $tblrow.find("td input").attr('disabled', 'disabled');
                                                $tblrow.find("td").css('background-color', '#eaecf4');
                                                $tblrow.find("td .table-remove").removeClass("btnRemove");
                                                $tblrow.find("td .reconchkboxwith").prop( "checked", true );
                                            }, 100);
                                        });
                                    } else {
                                        setTimeout(function() {
                                            $(".reconchkboxwith").trigger("click");
                                        }, 100);
                                    }
                                } else {
                                    setTimeout(function() {
                                        $('#tblVS1With').DataTable({
                                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                            buttons: [{
                                                extend: 'excelHtml5',
                                                text: '',
                                                download: 'open',
                                                className: "btntabletocsv hiddenColumn",
                                                filename: "chequelist_" + moment().format(),
                                                orientation: 'portrait',
                                                exportOptions: {
                                                    columns: ':visible'
                                                }
                                            }, {
                                                extend: 'print',
                                                download: 'open',
                                                className: "btntabletopdf hiddenColumn",
                                                text: '',
                                                title: 'Cheque',
                                                filename: "chequelist_" + moment().format(),
                                                exportOptions: {
                                                    columns: ':visible'
                                                }
                                            }],
                                            paging: false,
                                            "scrollY": "400px",
                                            "scrollCollapse": true,
                                            select: true,
                                            "columnDefs": [{
                                                "orderable": false,
                                                "targets": 0
                                            }],
                                            // colReorder: true,
                                            colReorder: {
                                                fixedColumnsLeft: 1
                                            },
                                            destroy: true,
                                            pageLength: 10,
                                            lengthMenu: [
                                                [initialDatatableLoad, -1],
                                                [initialDatatableLoad, "All"]
                                            ],
                                            info: true,
                                            responsive: true,
                                            "order": [
                                                [1, "desc"]
                                            ],
                                            action: function() {
                                                $('#tblVS1With').DataTable().ajax.reload();
                                            }
                                        });
                                        $('.fullScreenSpin').css('display', 'none');
                                    }, 0);
                                }
                            }
                            //$('#hideSelectionToggle').css('pointer-events', 'none');


                            if (data.fields.OnHold == true) {
                              Session.setPersistent('bankaccountid', data.fields.AccountID);
                              Session.setPersistent('bankaccountname', data.fields.AccountName);
                              templateObject.getAccountNames();
                            }
                            $('.fullScreenSpin').css('display', 'none');
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }
                }

            }).catch(function(err) {
                recService.getOneReconData(currentRecon).then(function(data) {
                    let recondep = [];
                    let reconwith = [];
                    let openingBalance = data.fields.OpenBalance || 0;
                    let endingBalance = data.fields.CloseBalance || 0;
                    let statementNo = data.fields.StatementNo || '';
                    let bankAccount = data.fields.AccountName || '';
                    let bankAccountID = data.fields.AccountID || '';
                    let statementDate = data.fields.ReconciliationDate ? moment(data.fields.ReconciliationDate).format('DD/MM/YYYY') : "";
                    let endingBalanceCalc = data.fields.CloseBalance || 0;
                    let clearedBalance = data.fields.CloseBalance || 0;
                    // let depositAmount = data.fields.CloseBalance || 0;
                    // let withdrawalAmount = data.fields.CloseBalance || 0;
                    //$('.btnDeleteRecon').css('display','block');
                    $('.openingbalance').val(utilityService.modifynegativeCurrencyFormat(openingBalance) || 0);
                    $('.vs1cloudBalance').text(utilityService.modifynegativeCurrencyFormat(openingBalance) || 0);
                    $('.endingbalance').val(utilityService.modifynegativeCurrencyFormat(endingBalance) || 0);
                    $('.statementno').val(statementNo);
                    $('.statementDate').val(statementDate);
                    //$('#bankAccountName').append('<option value="' + bankAccount + '" selected="selected">' + bankAccount + '</option>');
                    $('#bankAccountName').val(bankAccount);
                    $('#bankAccountID').val(bankAccountID);
                    $('.endingBalanceCalc').text(utilityService.modifynegativeCurrencyFormat(endingBalanceCalc) || 0);
                    $('.clearedBalance').text(utilityService.modifynegativeCurrencyFormat(clearedBalance) || 0);
                    $('.differenceCalc').text(Currency + "0.00" || 0);
                    // $('.depositAmount').val(utilityService.modifynegativeCurrencyFormat(depositAmount) || 0);
                    // $('.withdrawalAmount').val(utilityService.modifynegativeCurrencyFormat(withdrawalAmount) || 0);
                    if (data.fields.OnHold == false) {
                        $('#bankAccountName').attr('disabled', 'disabled');
                        $('#bankAccountName').attr('readonly', true);
                        $('.openingbalance').attr('readonly', true);
                        $('.endingbalance').attr('readonly', true);
                        $('.statementno').attr('readonly', true);
                        $('.statementDate').attr('disabled', 'disabled');
                        $('.statementDate').attr('readonly', true);
                        $('.statementDate').css('pointer-events', 'none');
                        $('#hideSelectionToggle').attr('disabled', 'disabled');
                        $('#hideSelectionToggle').attr('readonly', true);

                    } else {
                        $('.reconbtn').prop("disabled", false);
                        $('.btnHold').prop("disabled", false);
                    }
                    if (data.fields.DepositLines != null) {
                        if (data.fields.DepositLines.length > 0) {

                            for (let i in data.fields.DepositLines) {
                                if (data.fields.DepositLines.hasOwnProperty(i)) {
                                    let depositamount = utilityService.modifynegativeCurrencyFormat(data.fields.DepositLines[i].fields.Amount) || 0.00;
                                    let reconepID = data.fields.DepositLines[i].fields.ID;
                                    if (data.fields.DepositLines[i].fields.Notes == 'Customer Payment') {
                                        reconepID = data.fields.DepositLines[i].fields.PaymentID;
                                    }
                                    let reconciledepositObj = {
                                        recondepdate: data.fields.DepositLines[i].fields.DepositDate != '' ? moment(data.fields.DepositLines[i].fields.DepositDate).format("DD/MM/YYYY") : data.fields.DepositLines[i].fields.DepositDate,
                                        recondepname: data.fields.DepositLines[i].fields.Payee || ' ',
                                        recondeppaymenttype: data.fields.DepositLines[i].fields.Notes || ' ',
                                        recondepamount: depositamount || 0.00,
                                        recondepid: reconepID || ' ',
                                        recondepref: data.fields.DepositLines[i].fields.Reference || ' ',
                                        seqdepnum: data.fields.DepositLines[i].fields.Recno || 0,
                                        recondeppaymentid: data.fields.DepositLines[i].fields.PaymentID || 0,
                                        depositLineID: data.fields.DepositLines[i].fields.DepositLineID || 0,
                                    };
                                    selectedTransAmountdep = selectedTransAmountdep + parseFloat(data.fields.DepositLines[i].fields.Amount);
                                    //if(data.ttobereconcileddeposit[i].Seqno != 0){
                                    recondep.push(reconciledepositObj);
                                    templateObject.reconVS1dep.set(recondep);
                                    //}
                                }
                            }

                            $('.depositAmount').text(utilityService.modifynegativeCurrencyFormat(selectedTransAmountdep) || Currency + "0.00");
                            if (templateObject.reconVS1dep.get()) {
                              if (data.fields.OnHold == false) {
                                setTimeout(function() {
                                    $('#tblVS1Dep').DataTable({
                                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                        buttons: [{
                                            extend: 'excelHtml5',
                                            text: '',
                                            download: 'open',
                                            className: "btntabletocsv hiddenColumn",
                                            filename: "chequelist_" + moment().format(),
                                            orientation: 'portrait',
                                            exportOptions: {
                                                columns: ':visible'
                                            }
                                        }, {
                                            extend: 'print',
                                            download: 'open',
                                            className: "btntabletopdf hiddenColumn",
                                            text: '',
                                            title: 'Cheque',
                                            filename: "chequelist_" + moment().format(),
                                            exportOptions: {
                                                columns: ':visible'
                                            }
                                        }],
                                        paging: false,
                                        "scrollY": "400px",
                                        "scrollCollapse": true,
                                        "columnDefs": [{
                                            "orderable": false,
                                            "targets": 0
                                        }],
                                        // colReorder: true,
                                        colReorder: {
                                            fixedColumnsLeft: 1
                                        },
                                        select: true,
                                        destroy: true,
                                        pageLength: 10,
                                        lengthMenu: [
                                            [initialDatatableLoad, -1],
                                            [initialDatatableLoad, "All"]
                                        ],
                                        info: true,
                                        responsive: true,
                                        "order": [
                                            [1, "desc"]
                                        ],
                                        action: function() {
                                            $('#tblVS1Dep').DataTable().ajax.reload();
                                        }
                                    });

                                }, 0);
                              }
                            }
                            if (data.fields.OnHold == false) {
                                setTimeout(function() {
                                    $('.tblVS1Dep tr').each(function() {
                                        var $tblrow = $(this);
                                        $tblrow.find("th input").attr('readonly', true);
                                        $tblrow.find("th input").attr('disabled', 'disabled');
                                        $tblrow.find("th").css('background-color', '#eaecf4');

                                        $tblrow.find("td input").attr('readonly', true);
                                        $tblrow.find("td input").attr('disabled', 'disabled');
                                        $tblrow.find("td").css('background-color', '#eaecf4');
                                        $tblrow.find("td .table-remove").removeClass("btnRemove");
                                        $tblrow.find("td .reconchkboxdep").prop( "checked", true );
                                    }, 100);
                                });
                            } else {
                                setTimeout(function() {
                                    $(".reconchkboxdep").trigger("click");
                                }, 100);
                            }
                        } else {
                            setTimeout(function() {
                                $('#tblVS1Dep').DataTable({
                                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                    buttons: [{
                                        extend: 'excelHtml5',
                                        text: '',
                                        download: 'open',
                                        className: "btntabletocsv hiddenColumn",
                                        filename: "chequelist_" + moment().format(),
                                        orientation: 'portrait',
                                        exportOptions: {
                                            columns: ':visible'
                                        }
                                    }, {
                                        extend: 'print',
                                        download: 'open',
                                        className: "btntabletopdf hiddenColumn",
                                        text: '',
                                        title: 'Cheque',
                                        filename: "chequelist_" + moment().format(),
                                        exportOptions: {
                                            columns: ':visible'
                                        }
                                    }],
                                    paging: false,
                                    "scrollY": "400px",
                                    "scrollCollapse": true,
                                    "columnDefs": [{
                                        "orderable": false,
                                        "targets": 0
                                    }],
                                    // colReorder: true,
                                    colReorder: {
                                        fixedColumnsLeft: 1
                                    },
                                    select: true,
                                    destroy: true,
                                    pageLength: "All",
                                    lengthMenu: [
                                        [initialDatatableLoad, -1],
                                        [initialDatatableLoad, "All"]
                                    ],
                                    info: true,
                                    responsive: true,
                                    "order": [
                                        [1, "desc"]
                                    ],
                                    action: function() {
                                        $('#tblVS1Dep').DataTable().ajax.reload();
                                    }
                                });

                            }, 0);
                        }
                    }
                    if (data.fields.WithdrawalLines != null) {
                        if (data.fields.WithdrawalLines.length > 0) {
                            for (let j in data.fields.WithdrawalLines) {
                                if (data.fields.WithdrawalLines.hasOwnProperty(j)) {
                                    let withdrawalamount = utilityService.modifynegativeCurrencyFormat(data.fields.WithdrawalLines[j].fields.Amount) || 0.00;
                                    let reconepWidID = data.fields.WithdrawalLines[j].fields.ID;
                                    if (data.fields.WithdrawalLines[j].fields.Notes == 'Customer Payment') {
                                        reconepWidID = data.fields.WithdrawalLines[j].fields.PaymentID;
                                    }
                                    let reconcilewithdrawalObj = {
                                        sortdate: data.fields.WithdrawalLines[j].fields.DepositDate != '' ? moment(data.fields.WithdrawalLines[j].fields.DepositDate).format("YYYY-MM-DD") : data.fields.WithdrawalLines[j].fields.DepositDate,
                                        reconwithdate: data.fields.WithdrawalLines[j].fields.DepositDate != '' ? moment(data.fields.WithdrawalLines[j].fields.DepositDate).format("DD/MM/YYYY") : data.fields.WithdrawalLines[j].fields.DepositDate,
                                        reconwithname: data.fields.WithdrawalLines[j].fields.ClientName || ' ',
                                        reconwithpaymenttype: data.fields.WithdrawalLines[j].fields.Notes || ' ',
                                        reconwithamount: withdrawalamount || 0.00,
                                        reconwithid: reconepWidID || ' ',
                                        reconwithref: data.fields.WithdrawalLines[j].fields.Reference || ' ',
                                        seqwithnum: data.fields.WithdrawalLines[j].fields.Recno || 0,
                                        reconwithpaymentid: data.fields.WithdrawalLines[j].fields.PaymentID || 0,
                                        depositLineID: data.fields.WithdrawalLines[j].fields.DepositLineID || 0,
                                    };

                                    reconwith.push(reconcilewithdrawalObj);
                                    templateObject.reconVS1with.set(reconwith);
                                    selectedTransAmountwidth = selectedTransAmountwidth + parseFloat(data.fields.WithdrawalLines[j].fields.Amount);
                                }
                            }

                            $('.withdrawalAmount').text(utilityService.modifynegativeCurrencyFormat(selectedTransAmountwidth) || Currency + "0.00");
                            if (templateObject.reconVS1with.get()) {
                              if (data.fields.OnHold == false) {
                                setTimeout(function() {
                                    $('#tblVS1With').DataTable({
                                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                        buttons: [{
                                            extend: 'excelHtml5',
                                            text: '',
                                            download: 'open',
                                            className: "btntabletocsv hiddenColumn",
                                            filename: "chequelist_" + moment().format(),
                                            orientation: 'portrait',
                                            exportOptions: {
                                                columns: ':visible'
                                            }
                                        }, {
                                            extend: 'print',
                                            download: 'open',
                                            className: "btntabletopdf hiddenColumn",
                                            text: '',
                                            title: 'Cheque',
                                            filename: "chequelist_" + moment().format(),
                                            exportOptions: {
                                                columns: ':visible'
                                            }
                                        }],
                                        paging: false,
                                        "scrollY": "400px",
                                        "scrollCollapse": true,
                                        select: true,
                                        "columnDefs": [{
                                            "orderable": false,
                                            "targets": 0
                                        }],
                                        // colReorder: true,
                                        colReorder: {
                                            fixedColumnsLeft: 1
                                        },
                                        destroy: true,
                                        pageLength: 10,
                                        lengthMenu: [
                                            [initialDatatableLoad, -1],
                                            [initialDatatableLoad, "All"]
                                        ],
                                        info: true,
                                        responsive: true,
                                        "order": [
                                            [1, "desc"]
                                        ],
                                        action: function() {
                                            $('#tblVS1With').DataTable().ajax.reload();
                                        }
                                    });

                                }, 0);
                              }
                            }
                            if (data.fields.OnHold == false) {
                                setTimeout(function() {
                                    $('.tblVS1With tr').each(function() {
                                        var $tblrow = $(this);
                                        $tblrow.find("th input").attr('readonly', true);
                                        $tblrow.find("th input").attr('disabled', 'disabled');
                                        $tblrow.find("th").css('background-color', '#eaecf4');

                                        $tblrow.find("td input").attr('readonly', true);
                                        $tblrow.find("td input").attr('disabled', 'disabled');
                                        $tblrow.find("td").css('background-color', '#eaecf4');
                                        $tblrow.find("td .table-remove").removeClass("btnRemove");
                                        $tblrow.find("td .reconchkboxwith").prop( "checked", true );
                                    }, 100);
                                });
                            } else {
                                setTimeout(function() {
                                    $(".reconchkboxwith").trigger("click");
                                }, 100);
                            }
                        } else {
                            setTimeout(function() {
                                $('#tblVS1With').DataTable({
                                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                                    buttons: [{
                                        extend: 'excelHtml5',
                                        text: '',
                                        download: 'open',
                                        className: "btntabletocsv hiddenColumn",
                                        filename: "chequelist_" + moment().format(),
                                        orientation: 'portrait',
                                        exportOptions: {
                                            columns: ':visible'
                                        }
                                    }, {
                                        extend: 'print',
                                        download: 'open',
                                        className: "btntabletopdf hiddenColumn",
                                        text: '',
                                        title: 'Cheque',
                                        filename: "chequelist_" + moment().format(),
                                        exportOptions: {
                                            columns: ':visible'
                                        }
                                    }],
                                    paging: false,
                                    "scrollY": "400px",
                                    "scrollCollapse": true,
                                    select: true,
                                    "columnDefs": [{
                                        "orderable": false,
                                        "targets": 0
                                    }],
                                    // colReorder: true,
                                    colReorder: {
                                        fixedColumnsLeft: 1
                                    },
                                    destroy: true,
                                    pageLength: 10,
                                    lengthMenu: [
                                        [initialDatatableLoad, -1],
                                        [initialDatatableLoad, "All"]
                                    ],
                                    info: true,
                                    responsive: true,
                                    "order": [
                                        [1, "desc"]
                                    ],
                                    action: function() {
                                        $('#tblVS1With').DataTable().ajax.reload();
                                    }
                                });
                                $('.fullScreenSpin').css('display', 'none');
                            }, 0);
                        }
                    }
                    //$('#hideSelectionToggle').css('pointer-events', 'none');


                    if (data.fields.OnHold == true) {
                      Session.setPersistent('bankaccountid', data.fields.AccountID);
                      Session.setPersistent('bankaccountname', data.fields.AccountName);
                      templateObject.getAccountNames();
                    }
                    $('.fullScreenSpin').css('display', 'none');
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            });

        }

    } else {
        templateObject.getAccountNames();
        //templateObject.getOpenBalance();
    }
    $("input[data-type='currency']").on({
        keyup: function() {
            formatCurrency($(this));
        },
        blur: function() {
            formatCurrency($(this), "blur");
        },
        change: function() {
            formatCurrency($(this));
        }
    });

    function formatNumber(n) {
        // format number 1000000 to 1,234,567
        return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    function formatCurrency(input, blur) {
        // appends $ to value, validates decimal side
        // and puts cursor back in right position.

        // get input value
        var input_val = input.val();

        // don't validate empty input
        if (input_val == "") {
            return;
        }

        // original length
        var original_len = input_val.length;

        // initial caret position
        var caret_pos = input.prop("selectionStart");

        // check for decimal
        if (input_val.indexOf(".") >= 0) {

            // get position of first decimal
            // this prevents multiple decimals from
            // being entered
            var decimal_pos = input_val.indexOf(".");

            // split number by decimal point
            var left_side = input_val.substring(0, decimal_pos);
            var right_side = input_val.substring(decimal_pos);

            // add commas to left side of number
            left_side = formatNumber(left_side);

            // validate right side
            right_side = formatNumber(right_side);

            // On blur make sure 2 numbers after decimal
            if (blur == "blur") {
                right_side += "00";
            }

            // Limit decimal to only 2 digits
            right_side = right_side.substring(0, 2);

            // join number by .
            input_val = Currency + left_side + "." + right_side;


        } else {
            if (input_val.indexOf("-") >= 0) {

            }
            // no decimal entered
            // add commas to number
            // remove all non-digits
            input_val = formatNumber(input_val);
            input_val = Currency + input_val;

            // final formatting
            if (blur == "blur") {
                input_val += ".00";
            }
        }

        // send updated string to input
        input.val(input_val);
        $('.endingbalance').val(input_val);
        // put caret back in the right position
        var updated_len = input_val.length;
        caret_pos = updated_len - original_len + caret_pos;
        input[0].setSelectionRange(caret_pos, caret_pos);
    }

    $(document).ready(function() {
        $('#bankAccountName').editableSelect();
    });

    $('#bankAccountName').editableSelect().on('click.editable-select', function (e, li) {
        var $each = $(this);
        var offset = $each.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value ||'';

        if (e.pageX > offset.left + $each.width() - 8) { // X button 16px wide?
            $('#selectLineID').val('');
            $('#accountListModal').modal();
            setTimeout(function () {
                $('#tblAccount_filter .form-control-sm').focus();
                $('#tblAccount_filter .form-control-sm').val('');
                $('#tblAccount_filter .form-control-sm').trigger("input");
                var datatable = $('#tblAccountlist').DataTable();
                datatable.draw();
                $('#tblAccountlist_filter .form-control-sm').trigger("input");
            }, 500);
        }else{
            if(accountDataName.replace(/\s/g, '') != ''){
                getVS1Data('TAccountVS1').then(function (dataObject) {
                    if (dataObject.length == 0) {
                        accountService.getOneAccountByName(accountDataName).then(function (data) {
                        let lineItems = [];
                        let lineItemObj = {};
                        let fullAccountTypeName = '';
                        let accBalance = '';
                        $('#add-account-title').text('Edit Account Details');
                        $('#edtAccountName').attr('readonly', true);
                        $('#sltAccountType').attr('readonly', true);
                        $('#sltAccountType').attr('disabled', 'disabled');
                        if (accountTypeList) {
                        for (var h = 0; h < accountTypeList.length; h++) {
                           if (data.taccountvs1[0].fields.AccountTypeName == accountTypeList[h].accounttypename) {
                               fullAccountTypeName = accountTypeList[h].description || '';
                           }
                        }
                        }
                        var accountid = data.taccountvs1[0].fields.ID || '';
                        var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                        var accountname = data.taccountvs1[0].fields.AccountName || '';
                        var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                        var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                        var accountdesc = data.taccountvs1[0].fields.Description || '';
                        var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                        var bankbsb = data.taccountvs1[0].fields.BSB || '';
                        var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                        var swiftCode = data.taccountvs1[0].fields.Extra || '';
                        var routingNo = data.taccountvs1[0].fields.BankCode || '';

                        var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                        var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                        var cardcvc = data.taccountvs1[0].fields.CVC || '';
                        var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                        if ((accounttype == "BANK")) {
                        $('.isBankAccount').removeClass('isNotBankAccount');
                        $('.isCreditAccount').addClass('isNotCreditAccount');
                        }else if ((accounttype == "CCARD")) {
                        $('.isCreditAccount').removeClass('isNotCreditAccount');
                        $('.isBankAccount').addClass('isNotBankAccount');
                        } else {
                        $('.isBankAccount').addClass('isNotBankAccount');
                        $('.isCreditAccount').addClass('isNotCreditAccount');
                        }

                        $('#edtAccountID').val(accountid);
                        $('#sltAccountType').val(accounttype);
                        $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                        $('#edtAccountName').val(accountname);
                        $('#edtAccountNo').val(accountno);
                        $('#sltTaxCode').val(taxcode);
                        $('#txaAccountDescription').val(accountdesc);
                        $('#edtBankAccountName').val(bankaccountname);
                        $('#edtBSB').val(bankbsb);
                        $('#edtBankAccountNo').val(bankacountno);
                        $('#swiftCode').val(swiftCode);
                        $('#routingNo').val(routingNo);
                        $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                        $('#edtCardNumber').val(cardnumber);
                        $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                        $('#edtCvc').val(cardcvc);

                        if(showTrans == 'true'){
                        $('.showOnTransactions').prop('checked', true);
                        }else{
                        $('.showOnTransactions').prop('checked', false);
                        }

                        setTimeout(function () {
                        $('#addNewAccount').modal('show');
                        }, 500);

                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display','none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.taccountvs1;
                        var added=false;
                        let lineItems = [];
                        let lineItemObj = {};
                        let fullAccountTypeName = '';
                        let accBalance = '';
                        $('#add-account-title').text('Edit Account Details');
                        $('#edtAccountName').attr('readonly', true);
                        $('#sltAccountType').attr('readonly', true);
                        $('#sltAccountType').attr('disabled', 'disabled');
                        for (let a in data.taccountvs1.length) {
                        //for (let a = 0; a < data.taccountvs1.length; a++) {
                            if((data.taccountvs1[a].fields.AccountName) == accountDataName){
                                added = true;
                                if (accountTypeList) {
                                for (var h = 0; h < accountTypeList.length; h++) {
                                    if (data.taccountvs1[a].fields.AccountTypeName == accountTypeList[h].accounttypename) {
                                        fullAccountTypeName = accountTypeList[h].description || '';
                                    }
                                }
                            }
                            var accountid = data.taccountvs1[a].fields.ID || '';
                            var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                            var accountname = data.taccountvs1[a].fields.AccountName || '';
                            var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                            var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                            var accountdesc = data.taccountvs1[a].fields.Description || '';
                            var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                            var bankbsb = data.taccountvs1[a].fields.BSB || '';
                            var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';

                            var swiftCode = data.taccountvs1[a].fields.Extra || '';
                            var routingNo = data.taccountvs1[a].BankCode || '';

                            var showTrans = data.taccountvs1[a].fields.IsHeader || false;

                            var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                            var cardcvc = data.taccountvs1[a].fields.CVC || '';
                            var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';

                            if ((accounttype == "BANK")) {
                                $('.isBankAccount').removeClass('isNotBankAccount');
                                $('.isCreditAccount').addClass('isNotCreditAccount');
                            }else if ((accounttype == "CCARD")) {
                                $('.isCreditAccount').removeClass('isNotCreditAccount');
                                $('.isBankAccount').addClass('isNotBankAccount');
                            } else {
                                $('.isBankAccount').addClass('isNotBankAccount');
                                $('.isCreditAccount').addClass('isNotCreditAccount');
                            }

                            $('#edtAccountID').val(accountid);
                            $('#sltAccountType').val(accounttype);
                            $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                            $('#edtAccountName').val(accountname);
                            $('#edtAccountNo').val(accountno);
                            $('#sltTaxCode').val(taxcode);
                            $('#txaAccountDescription').val(accountdesc);
                            $('#edtBankAccountName').val(bankaccountname);
                            $('#edtBSB').val(bankbsb);
                            $('#edtBankAccountNo').val(bankacountno);
                            $('#swiftCode').val(swiftCode);
                            $('#routingNo').val(routingNo);
                            $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                            $('#edtCardNumber').val(cardnumber);
                            $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                            $('#edtCvc').val(cardcvc);

                            if(showTrans == 'true'){
                                $('.showOnTransactions').prop('checked', true);
                            }else{
                              $('.showOnTransactions').prop('checked', false);
                            }

                            setTimeout(function () {
                                $('#addNewAccount').modal('show');
                            }, 500);

                        }
                    }
                    if(!added) {
                        accountService.getOneAccountByName(accountDataName).then(function (data) {
                            let lineItems = [];
                            let lineItemObj = {};
                            let fullAccountTypeName = '';
                            let accBalance = '';
                            $('#add-account-title').text('Edit Account Details');
                            $('#edtAccountName').attr('readonly', true);
                            $('#sltAccountType').attr('readonly', true);
                            $('#sltAccountType').attr('disabled', 'disabled');
                            if (accountTypeList) {
                               for (var h = 0; h < accountTypeList.length; h++) {
                                   if (data.taccountvs1[0].fields.AccountTypeName == accountTypeList[h].accounttypename) {
                                       fullAccountTypeName = accountTypeList[h].description || '';
                                   }
                               }
                            }
                            var accountid = data.taccountvs1[0].fields.ID || '';
                            var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                            var accountname = data.taccountvs1[0].fields.AccountName || '';
                            var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                            var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                            var accountdesc = data.taccountvs1[0].fields.Description || '';
                            var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                            var bankbsb = data.taccountvs1[0].fields.BSB || '';
                            var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                            var swiftCode = data.taccountvs1[0].fields.Extra || '';
                            var routingNo = data.taccountvs1[0].fields.BankCode || '';

                            var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                            var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                            var cardcvc = data.taccountvs1[0].fields.CVC || '';
                            var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                            if ((accounttype == "BANK")) {
                                $('.isBankAccount').removeClass('isNotBankAccount');
                                $('.isCreditAccount').addClass('isNotCreditAccount');
                            } else if ((accounttype == "CCARD")) {
                                $('.isCreditAccount').removeClass('isNotCreditAccount');
                                $('.isBankAccount').addClass('isNotBankAccount');
                            } else {
                                $('.isBankAccount').addClass('isNotBankAccount');
                                $('.isCreditAccount').addClass('isNotCreditAccount');
                            }

                            $('#edtAccountID').val(accountid);
                            $('#sltAccountType').val(accounttype);
                            $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                            $('#edtAccountName').val(accountname);
                            $('#edtAccountNo').val(accountno);
                            $('#sltTaxCode').val(taxcode);
                            $('#txaAccountDescription').val(accountdesc);
                            $('#edtBankAccountName').val(bankaccountname);
                            $('#edtBSB').val(bankbsb);
                            $('#edtBankAccountNo').val(bankacountno);
                            $('#swiftCode').val(swiftCode);
                            $('#routingNo').val(routingNo);
                            $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                            $('#edtCardNumber').val(cardnumber);
                            $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                            $('#edtCvc').val(cardcvc);

                            if(showTrans == 'true'){
                                $('.showOnTransactions').prop('checked', true);
                            }else{
                              $('.showOnTransactions').prop('checked', false);
                            }

                            setTimeout(function () {
                                $('#addNewAccount').modal('show');
                            }, 500);

                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display','none');
                        });
                    }

                }
                }).catch(function (err) {
                    accountService.getOneAccountByName(accountDataName).then(function (data) {
                        let lineItems = [];
                        let lineItemObj = {};
                        let fullAccountTypeName = '';
                        let accBalance = '';
                        $('#add-account-title').text('Edit Account Details');
                        $('#edtAccountName').attr('readonly', true);
                        $('#sltAccountType').attr('readonly', true);
                        $('#sltAccountType').attr('disabled', 'disabled');
                        if (accountTypeList) {
                           for (var h = 0; h < accountTypeList.length; h++) {
                               if (data.taccountvs1[0].fields.AccountTypeName == accountTypeList[h].accounttypename) {
                                   fullAccountTypeName = accountTypeList[h].description || '';
                               }
                           }
                        }
                        var accountid = data.taccountvs1[0].fields.ID || '';
                        var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                        var accountname = data.taccountvs1[0].fields.AccountName || '';
                        var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                        var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                        var accountdesc = data.taccountvs1[0].fields.Description || '';
                        var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                        var bankbsb = data.taccountvs1[0].fields.BSB || '';
                        var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                        var swiftCode = data.taccountvs1[0].fields.Extra || '';
                        var routingNo = data.taccountvs1[0].fields.BankCode || '';

                        var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                        var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                        var cardcvc = data.taccountvs1[0].fields.CVC || '';
                        var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                        if ((accounttype == "BANK")) {
                            $('.isBankAccount').removeClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        }else if ((accounttype == "CCARD")) {
                            $('.isCreditAccount').removeClass('isNotCreditAccount');
                            $('.isBankAccount').addClass('isNotBankAccount');
                        } else {
                            $('.isBankAccount').addClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        }

                        $('#edtAccountID').val(accountid);
                        $('#sltAccountType').val(accounttype);
                        $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                        $('#edtAccountName').val(accountname);
                        $('#edtAccountNo').val(accountno);
                        $('#sltTaxCode').val(taxcode);
                        $('#txaAccountDescription').val(accountdesc);
                        $('#edtBankAccountName').val(bankaccountname);
                        $('#edtBSB').val(bankbsb);
                        $('#edtBankAccountNo').val(bankacountno);
                        $('#swiftCode').val(swiftCode);
                        $('#routingNo').val(routingNo);
                        $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                        $('#edtCardNumber').val(cardnumber);
                        $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                        $('#edtCvc').val(cardcvc);

                        if(showTrans == 'true'){
                            $('.showOnTransactions').prop('checked', true);
                        }else{
                          $('.showOnTransactions').prop('checked', false);
                        }

                        setTimeout(function () {
                            $('#addNewAccount').modal('show');
                        }, 500);

                    }).catch(function (err) {
                        $('.fullScreenSpin').css('display','none');
                    });

                });
                $('#addAccountModal').modal('toggle');
            } else {
                $('#selectLineID').val('');
                $('#accountListModal').modal();
                setTimeout(function () {
                    $('#tblAccount_filter .form-control-sm').focus();
                    $('#tblAccount_filter .form-control-sm').val('');
                    $('#tblAccount_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblSupplierlist').DataTable();
                    datatable.draw();
                    $('#tblAccount_filter .form-control-sm').trigger("input");
                }, 500);
            }
        }

    });

    $(document).on("click", ".bankrecon #tblAccount tbody tr", function(e) {
        $(".colAccountName").removeClass('boldtablealertsborder');
        var table = $(this);

        let accountname = table.find(".productName").text();
        var accountTypeId = table.find(".colAccountID").text();
        $('#accountListModal').modal('toggle');
        $('#bankAccountName').val(accountname);
        $('#bankAccountID').val(accountTypeId);

        templateObject.reconVS1dep.set(null);
        templateObject.reconVS1with.set(null);

        // Sessions - setting the accountTypeID BEGIN

        // Sessions - setting the accountTypeID END
        var statementDateData = new Date($(".statementDate").datepicker("getDate"));

        let statementDate = statementDateData.getFullYear() + "-" + (statementDateData.getMonth() + 1) + "-" + statementDateData.getDate();

        if (accountTypeId != "") {
            Session.setPersistent('bankaccountid', accountTypeId);
            Session.setPersistent('bankaccountname', accountname);
            templateObject.getReconcileDeposit(accountTypeId, statementDate, false);
            templateObject.getReconcileWithdrawal(accountTypeId, statementDate, false);
            setTimeout(function() {
              window.open('/bankrecon', '_self');
            }, 1000);
        } else {

        }
        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });
});

Template.bankrecon.events({
    'change #bankAccountNameOLD': function(e) {
        let templateObject = Template.instance();
        templateObject.reconVS1dep.set(null);
        templateObject.reconVS1with.set(null);

        // Sessions - setting the accountTypeID BEGIN
        var accountTypeId = $('#bankAccountName').val();
        // Sessions - setting the accountTypeID END
        var statementDateData = new Date($(".statementDate").datepicker("getDate"));

        let statementDate = statementDateData.getFullYear() + "-" + (statementDateData.getMonth() + 1) + "-" + statementDateData.getDate();

        if (accountTypeId != "") {
            Session.setPersistent('bankaccountid', accountTypeId);
            templateObject.getReconcileDeposit(accountTypeId, statementDate, false);
            templateObject.getReconcileWithdrawal(accountTypeId, statementDate, false);
            setTimeout(function() {
                window.open('/bankrecon', '_self');
            }, 1000);
        } else {}
        e.preventDefault();
    },
    'change .statementDate': function () {
        let templateObject = Template.instance();
        // $('.fullScreenSpin').css('display', 'inline-block');
        var accountTypeId = $('#bankAccountID').val();
        var accountTypename = $('#bankAccountName').val();
        var statementDateData = new Date($(".statementDate").datepicker("getDate"));
        let statementDate = statementDateData.getFullYear() + "-" + (statementDateData.getMonth() + 1) + "-" + statementDateData.getDate();
        if ($(".statementDate").val() != "") {
            localStorage.setItem('statementdate', $(".statementDate").val());

            if (accountTypeId != "") {
                Session.setPersistent('bankaccountid', accountTypeId);
                Session.setPersistent('bankaccountname', accountTypename);
                templateObject.getReconcileDeposit(accountTypeId, statementDate, false);
                templateObject.getReconcileWithdrawal(accountTypeId, statementDate, false);
                setTimeout(function() {
                    window.open('/bankrecon', '_self');
                }, 1000);
            }
        }
    },
    'change .reconchkboxdep': function(e) {

        //$(".endingbalance").val('');
        //        var deptable = $('#tblVS1Dep').DataTable();
        //        var rows_selected = deptable.column(0).checkboxes.selected();
        var chkbiddep = event.target.id;
        var checkboxID = chkbiddep.split("_").pop();
        var selectedTransAmountdep = 0;
        const templateObject = Template.instance();
        const selectedTransdep = [];
        const selectedtransactionsdep = [];

        $('.reconchkboxdep:checkbox:checked').each(function() {
            var chkbiddepLine = $(this).attr('id');
            var checkboxIDdepLine = chkbiddepLine.split("_").pop();
            var depositLineIDDep = $(this).closest('tr').attr('depositLineID');
            let transactionObj = {
                reconid: checkboxIDdepLine,
                recondate: $('#vs1recondate_' + checkboxIDdepLine).attr('recondate'),
                reconname: $('#vs1reconname_' + checkboxIDdepLine).text(),
                recondesc: $('#vs1recondesc_' + checkboxIDdepLine).text(),
                reconamount: $('#vs1reconamount_' + checkboxIDdepLine).text(),
                reconref: $('#vs1reconref_' + checkboxIDdepLine).text(),
                reconpayid: $('#vs1reconpayid_' + checkboxIDdepLine).text(),
                depositLineID: depositLineIDDep || 0
            };
            var reconamounttrimdep = ($('#vs1reconamount_' + checkboxIDdepLine).text()).replace(/[^0-9.-]+/g, "")||0;
            //(($('#vs1reconamount_' + checkboxIDdepLine).text()).substring(1)).replace(',', '');
            selectedTransAmountdep = selectedTransAmountdep + parseFloat(reconamounttrimdep);
            selectedtransactionsdep.push(transactionObj);
        });
        templateObject.selectedTransdep.set(selectedtransactionsdep);
        setTimeout(function() {
            $("#divtblSelectedDeposits").height(300);
            $('.btnHold').prop("disabled", false);
        }, 0);
        $('.depositAmount').text(utilityService.modifynegativeCurrencyFormat(selectedTransAmountdep) || Currency + "0.00");

        // var totaldepamount = (($('.depositAmount').html()).substring(1)).replace(',','');
        // var totalwithamount = (($('.withdrawalAmount').html()).substring(1)).replace(',','');
        // var openbalamount = (($('#openingbalance').val()).substring(1)).replace(',','');
        var totaldepamount = Number($('.depositAmount').html().replace(/[^0-9.-]+/g, ""));
        var totalwithamount = Number($('.withdrawalAmount').html().replace(/[^0-9.-]+/g, ""));
        var openbalamount = Number($('#openingbalance').val().replace(/[^0-9.-]+/g, ""));
        var clearedBal = parseFloat(openbalamount) + parseFloat(totaldepamount) - parseFloat(totalwithamount);
        $('.clearedBalance').text(utilityService.modifynegativeCurrencyFormat(clearedBal) || Currency + "0.00");
    },
    'change .reconchkboxwith': function(e) {
        //$(".endingbalance").val('');
        var chkbidwith = event.target.id;
        var checkboxID = chkbidwith.split("_").pop();
        var selectedTransAmountwidth = 0;
        const templateObject = Template.instance();
        const selectedTranswith = [];
        const selectedtransactionswith = [];

        $('.reconchkboxwith:checkbox:checked').each(function() {
            var chkbidwithLine = $(this).attr('id');
            var checkboxIDwithLine = chkbidwithLine.split("_").pop();
            let depositLineIDWith = $(this).closest('tr').attr('depositLineID');
            let transactionObj = {
                reconid: checkboxIDwithLine,
                recondate: $('#vs1recondatewith_' + checkboxIDwithLine).attr('recondate'),
                reconname: $('#vs1reconnamewith_' + checkboxIDwithLine).text(),
                recondesc: $('#vs1recondescwith_' + checkboxIDwithLine).text(),
                reconamount: $('#vs1reconamountwith_' + checkboxIDwithLine).text(),
                reconref: $('#vs1reconrefwith_' + checkboxIDwithLine).text(),
                reconpayid: $('#vs1reconpayidwith_' + checkboxIDwithLine).text(),
                depositLineID: depositLineIDWith || 0
            };
            var reconamounttrim = ($('#vs1reconamountwith_' + checkboxIDwithLine).text()).replace(/[^0-9.-]+/g, "")||0;
            //(($('#vs1reconamountwith_' + checkboxIDwithLine).text()).substring(1)).replace(',', '');
            selectedTransAmountwidth = selectedTransAmountwidth + parseFloat(reconamounttrim);
            selectedtransactionswith.push(transactionObj);
        });
        templateObject.selectedTranswith.set(selectedtransactionswith);
        setTimeout(function() {
            $("#divtblSelectedWithdrawals").height(300);
            $('.btnHold').prop("disabled", false);
        }, 0);
        $('.withdrawalAmount').text(utilityService.modifynegativeCurrencyFormat(selectedTransAmountwidth) || Currency + "0.00");
        // var totaldepamount = (($('.depositAmount').html()).substring(1)).replace(',','');
        // var totalwithamount = (($('.withdrawalAmount').html()).substring(1)).replace(',','');
        // var openbalamount = (($('#openingbalance').val()).substring(1)).replace(',','');
        var totaldepamount = Number($('.depositAmount').html().replace(/[^0-9.-]+/g, ""));
        var totalwithamount = Number($('.withdrawalAmount').html().replace(/[^0-9.-]+/g, ""));
        var openbalamount = Number($('#openingbalance').val().replace(/[^0-9.-]+/g, ""));
        var clearedBal = parseFloat(openbalamount) + parseFloat(totaldepamount) - parseFloat(totalwithamount);
        $('.clearedBalance').text(utilityService.modifynegativeCurrencyFormat(clearedBal) || Currency + "0.00");
    },
    'change #checkallrecondep': function(e) {
        if ($(event.target).is(':checked')) {
            $(".reconchkboxdep").prop("checked", true);
            var selectedTransAmountdep = 0;
            const templateObject = Template.instance();
            const selectedTransdep = [];
            const selectedtransactionsdep = [];

            $('.reconchkboxdep:checkbox:checked').each(function() {
                var chkbiddepLine = $(this).attr('id');
                var checkboxIDdepLine = chkbiddepLine.split("_").pop();
                let depositLineIDDepAll = $(this).closest('tr').attr('depositLineID');
                let transactionObj = {
                    reconid: checkboxIDdepLine,
                    recondate: $('#vs1recondate_' + checkboxIDdepLine).attr('recondate'),
                    reconname: $('#vs1reconname_' + checkboxIDdepLine).text(),
                    recondesc: $('#vs1recondesc_' + checkboxIDdepLine).text(),
                    reconamount: $('#vs1reconamount_' + checkboxIDdepLine).text(),
                    reconref: $('#vs1reconref_' + checkboxIDdepLine).text(),
                    reconpayid: $('#vs1reconpayid_' + checkboxIDdepLine).text(),
                    depositLineID: depositLineIDDepAll || 0
                };
                var reconamounttrimdep = ($('#vs1reconamount_' + checkboxIDdepLine).text()).replace(/[^0-9.-]+/g, "")||0;
                //(($('#vs1reconamount_' + checkboxIDdepLine).text()).substring(1)).replace(',', '');
                selectedTransAmountdep = selectedTransAmountdep + parseFloat(reconamounttrimdep);
                selectedtransactionsdep.push(transactionObj);
            });
            templateObject.selectedTransdep.set(selectedtransactionsdep);

            setTimeout(function() {
                $("#divtblSelectedDeposits").height(300);
            }, 0);

            $('.depositAmount').text(utilityService.modifynegativeCurrencyFormat(selectedTransAmountdep) || Currency + "0.00");
            // var totaldepamount = (($('.depositAmount').html()).substring(1)).replace(',','');
            // var totalwithamount = (($('.withdrawalAmount').html()).substring(1)).replace(',','');
            // var openbalamount = (($('#openingbalance').val()).substring(1)).replace(',','');
            var totaldepamount = Number($('.depositAmount').html().replace(/[^0-9.-]+/g, ""));
            var totalwithamount = Number($('.withdrawalAmount').html().replace(/[^0-9.-]+/g, ""));
            var openbalamount = Number($('#openingbalance').val().replace(/[^0-9.-]+/g, ""));
            var clearedBal = parseFloat(openbalamount) + parseFloat(totaldepamount) - parseFloat(totalwithamount);
            $('.clearedBalance').text(utilityService.modifynegativeCurrencyFormat(clearedBal) || Currency + "0.00");
            $('.btnHold').prop("disabled", false);
        } else {
            $(".reconchkboxdep").prop("checked", false);
            var selectedTransAmountdep = 0;
            const templateObject = Template.instance();
            const selectedTransdep = [];
            const selectedtransactionsdep = [];

            $('.reconchkboxdep:checkbox:checked').each(function() {
                var chkbiddepLine = $(this).attr('id');
                var checkboxIDdepLine = chkbiddepLine.split("_").pop();
                let depositLineIDDepAll = $(this).closest('tr').attr('depositLineID');
                let transactionObj = {
                    reconid: checkboxIDdepLine,
                    recondate: $('#vs1recondate_' + checkboxIDdepLine).attr('recondate'),
                    reconname: $('#vs1reconname_' + checkboxIDdepLine).text(),
                    recondesc: $('#vs1recondesc_' + checkboxIDdepLine).text(),
                    reconamount: $('#vs1reconamount_' + checkboxIDdepLine).text(),
                    reconref: $('#vs1reconref_' + checkboxIDdepLine).text(),
                    reconpayid: $('#vs1reconpayid_' + checkboxIDdepLine).text(),
                    depositLineID: depositLineIDDepAll || 0
                };
                var reconamounttrimdep = ($('#vs1reconamount_' + checkboxIDdepLine).text()).replace(/[^0-9.-]+/g, "")||0;
                //(($('#vs1reconamount_' + checkboxIDdepLine).text()).substring(1)).replace(',', '');//
                selectedTransAmountdep = selectedTransAmountdep + parseFloat(reconamounttrimdep);
                selectedtransactionsdep.push(transactionObj);
            });
            templateObject.selectedTransdep.set(selectedtransactionsdep);

            setTimeout(function() {
                $("#divtblSelectedDeposits").height(120);
            }, 0);

            $('.depositAmount').text(utilityService.modifynegativeCurrencyFormat(selectedTransAmountdep) || Currency + "0.00");
            // var totaldepamount = (($('.depositAmount').html()).substring(1)).replace(',','');
            // var totalwithamount = (($('.withdrawalAmount').html()).substring(1)).replace(',','');
            // var openbalamount = (($('#openingbalance').val()).substring(1)).replace(',','');
            var totaldepamount = Number($('.depositAmount').html().replace(/[^0-9.-]+/g, ""));
            var totalwithamount = Number($('.withdrawalAmount').html().replace(/[^0-9.-]+/g, ""));
            var openbalamount = Number($('#openingbalance').val().replace(/[^0-9.-]+/g, ""));
            var clearedBal = parseFloat(openbalamount) + parseFloat(totaldepamount) - parseFloat(totalwithamount);
            $('.clearedBalance').text(utilityService.modifynegativeCurrencyFormat(clearedBal) || Currency + "0.00");
        }
    },
    'change #checkallreconwith': function(e) {
        if ($(event.target).is(':checked')) {
            $(".reconchkboxwith").prop("checked", true);
            var selectedTransAmountwidth = 0;
            const templateObject = Template.instance();
            const selectedTranswith = [];
            const selectedtransactionswith = [];

            $('.reconchkboxwith:checkbox:checked').each(function() {
                var chkbidwithLine = $(this).attr('id');
                var checkboxIDwithLine = chkbidwithLine.split("_").pop();
                let depositLineIDAll = $(this).closest('tr').attr('depositLineID');
                let transactionObj = {
                    reconid: checkboxIDwithLine,
                    recondate: $('#vs1recondatewith_' + checkboxIDwithLine).attr('recondate'),
                    reconname: $('#vs1reconnamewith_' + checkboxIDwithLine).text(),
                    recondesc: $('#vs1recondescwith_' + checkboxIDwithLine).text(),
                    reconamount: $('#vs1reconamountwith_' + checkboxIDwithLine).text(),
                    reconref: $('#vs1reconrefwith_' + checkboxIDwithLine).text(),
                    reconpayid: $('#vs1reconpayidwith_' + checkboxIDwithLine).text(),
                    depositLineID: depositLineIDAll || 0
                };
                var reconamounttrim = ($('#vs1reconamountwith_' + checkboxIDwithLine).text()).replace(/[^0-9.-]+/g, "")||0;
                //(($('#vs1reconamountwith_' + checkboxIDwithLine).text()).substring(1)).replace(',', '');
                selectedTransAmountwidth = selectedTransAmountwidth + parseFloat(reconamounttrim);
                selectedtransactionswith.push(transactionObj);


            });
            templateObject.selectedTranswith.set(selectedtransactionswith);

            setTimeout(function() {
                $("#divtblSelectedWithdrawals").height(300);
            }, 0);

            //$("#tblSelectedWithdrawals").height(300);

            $('.withdrawalAmount').text(utilityService.modifynegativeCurrencyFormat(selectedTransAmountwidth) || Currency + "0.00");
            // var totaldepamount = (($('.depositAmount').html()).substring(1)).replace(',','');
            // var totalwithamount = (($('.withdrawalAmount').html()).substring(1)).replace(',','');
            // var openbalamount = (($('#openingbalance').val()).substring(1)).replace(',','');
            var totaldepamount = Number($('.depositAmount').html().replace(/[^0-9.-]+/g, ""));
            var totalwithamount = Number($('.withdrawalAmount').html().replace(/[^0-9.-]+/g, ""));
            var openbalamount = Number($('#openingbalance').val().replace(/[^0-9.-]+/g, ""));
            var clearedBal = parseFloat(openbalamount) + parseFloat(totaldepamount) - parseFloat(totalwithamount);
            $('.clearedBalance').text(utilityService.modifynegativeCurrencyFormat(clearedBal) || Currency + "0.00");
            $('.btnHold').prop("disabled", false);
        } else {
            $(".reconchkboxwith").prop("checked", false);
            var selectedTransAmountwidth = 0;
            const templateObject = Template.instance();
            const selectedTranswith = [];
            const selectedtransactionswith = [];

            $('.reconchkboxwith:checkbox:checked').each(function() {
                var chkbidwithLine = $(this).attr('id');
                var checkboxIDwithLine = chkbidwithLine.split("_").pop();
                let depositLineIDwith = $(this).closest('tr').attr('depositLineID');
                let transactionObj = {
                    reconid: checkboxIDwithLine,
                    recondate: $('#vs1recondatewith_' + checkboxIDwithLine).attr('recondate'),
                    reconname: $('#vs1reconnamewith_' + checkboxIDwithLine).text(),
                    recondesc: $('#vs1recondescwith_' + checkboxIDwithLine).text(),
                    reconamount: $('#vs1reconamountwith_' + checkboxIDwithLine).text(),
                    reconref: $('#vs1reconrefwith_' + checkboxIDwithLine).text(),
                    reconpayid: $('#vs1reconpayidwith_' + checkboxIDwithLine).text(),
                    depositLineID: depositLineIDwith || 0
                };
                var reconamounttrim = ($('#vs1reconamountwith_' + checkboxIDwithLine).text()).replace(/[^0-9.-]+/g, "")||0;
                //(($('#vs1reconamountwith_' + checkboxIDwithLine).text()).substring(1)).replace(',', '');
                selectedTransAmountwidth = selectedTransAmountwidth + parseFloat(reconamounttrim);
                selectedtransactionswith.push(transactionObj);
            });
            templateObject.selectedTranswith.set(selectedtransactionswith);

            setTimeout(function() {
                $("#divtblSelectedWithdrawals").height(120);
            }, 0);

            $('.withdrawalAmount').text(utilityService.modifynegativeCurrencyFormat(selectedTransAmountwidth) || Currency + "0.00");
            // var totaldepamount = (($('.depositAmount').html()).substring(1)).replace(',','');
            // var totalwithamount = (($('.withdrawalAmount').html()).substring(1)).replace(',','');
            // var openbalamount = (($('#openingbalance').val()).substring(1)).replace(',','');
            var totaldepamount = Number($('.depositAmount').html().replace(/[^0-9.-]+/g, ""));
            var totalwithamount = Number($('.withdrawalAmount').html().replace(/[^0-9.-]+/g, ""));
            var openbalamount = Number($('#openingbalance').val().replace(/[^0-9.-]+/g, ""));
            var clearedBal = parseFloat(openbalamount) + parseFloat(totaldepamount) - parseFloat(totalwithamount);
            $('.clearedBalance').text(utilityService.modifynegativeCurrencyFormat(clearedBal) || Currency + "0.00");
        }
    },
    'blur .endingbalance': function(e) {
        let dataValue = Number(event.target.value.replace(/[^0-9.-]+/g, ""));

        if (!isNaN(dataValue)) {
            $('.endingbalance').val(utilityService.modifynegativeCurrencyFormat(dataValue));
        } else {
            let inputDebitEx = Number(dataValue.replace(/[^0-9.-]+/g, ""));

            $('.endingbalance').val(utilityService.modifynegativeCurrencyFormat(inputDebitEx) || 0);
        }
    },
    'keyup .endingbalance, change .endingbalance': function(e) {

        var displayEndBal2 = event.target.value.replace(/[^0-9.-]+/g, "") || 0;
        $('.endingbalance2').val(event.target.value || 0);

        $('.endingBalanceCalc').text(utilityService.modifynegativeCurrencyFormat(displayEndBal2) || Currency + "0.00");

        // Calc Difference
        var clearedBalCalc2 = $('.clearedBalance').html().replace(/[^0-9.-]+/g, "") || 0;
        var differenceAmount = parseFloat(clearedBalCalc2) - parseFloat(displayEndBal2);
        $('.differenceCalc').text(utilityService.modifynegativeCurrencyFormat(Math.abs(differenceAmount)) || Currency + "0.00");
    },
    // 'blur .statementDate, keyup .statementDate, change .statementDate': function(e) {
    //     var statementDate = event.target.value.replace(/[^0-9.-]+/g, "") || 0;
    //     $('.statementDate').val(event.target.value || 0);
    // },
    'click .reconbtn': function(e) {
        $('.fullScreenSpin').css('display', 'inline-block');

        let recService = new ReconService();

        let lineItemsDep = [];
        let lineItemsDepObj = {};
        $('#tblSelectedDeposits > tbody > tr').each(function() {
            var depID = this.id;
            if (depID) {
                let depositLineID = $(this).attr('depositLineID') || 0;
                let depclientname = $("#" + depID + "_name").text() || '';
                let depdepositdate = $("#" + depID + "_date").text() || '';
                let depnotes = $("#" + depID + "_desc").text() || '';
                let depamount = $("#" + depID + "_amount").text() || 0;
                let depref = $("#" + depID + "_ref").text() || '';
                let deppaymentid = $("#" + depID + "_payid").text() || '';
                let depaccountname = $('#bankAccountName').val() || '';
                if ($("#" + depID + "_desc").text() == "Customer Payment") {
                    deppaymentid = depID;
                }

                if(FlowRouter.current().queryParams.id){

                }else{
                  if ($("#" + depID + "_desc").text() == "Cheque Deposit") {
                      deppaymentid = depID;
                  }

                  if ($("#" + depID + "_desc").text() == "Cheque") {
                      deppaymentid = depID;
                  }
                }

                // else if($("#"+depID+"_desc").text() == "Journal Entry"){
                //   deppaymentid = depID;
                // }

                let splitDepdepositdate = depdepositdate.split("/");
                let depositYear = splitDepdepositdate[2];
                let depositMonth = splitDepdepositdate[1];
                let depositDay = splitDepdepositdate[0];

                let formateDepDate = depositYear + "-" + depositMonth + "-" + depositDay;

                lineItemsDepObj = {
                    type: "TReconciliationDepositLines",
                    fields: {
                        AccountName: depaccountname || '',
                        Amount: Number(depamount.replace(/[^0-9.-]+/g, "")) || 0,
                        BankStatementLineID: 0, //Hardcoded for now
                        ClientName: depclientname || '',
                        DepositDate: formateDepDate + " 00:00:00" || '',
                        Deposited: true,
                        DepositLineID: parseInt(depositLineID) || 0,
                        Notes: depnotes || '',
                        Payee: depclientname || '',
                        PaymentID: parseInt(deppaymentid) || 0,
                        Reconciled: true,
                        Reference: depref || ''
                    }
                };

                lineItemsDep.push(lineItemsDepObj);
            }
        });

        let lineItemsWith = [];
        let lineItemsWithObj = {};
        $('#tblSelectedWithdrawals > tbody > tr').each(function() {
            var withID = this.id;
            if (withID) {
                let depositLineIDWith = $(this).attr('depositLineID') || 0;
                let withclientname = $("#" + withID + "_name").text() || '';
                let withdepositdate = $("#" + withID + "_date").text() || '';
                let withnotes = $("#" + withID + "_desc").text() || '';
                let withamount = $("#" + withID + "_amount").text() || 0;
                let withref = $("#" + withID + "_ref").text() || '';
                let withpaymentid = $("#" + withID + "_payid").text() || '';
                let withaccountname = $('#bankAccountName').val() || '';

                let splitwithdepositdate = withdepositdate.split("/");
                let withYear = splitwithdepositdate[2];
                let withMonth = splitwithdepositdate[1];
                let withDay = splitwithdepositdate[0];

                let formatWithDate = withYear + "-" + withMonth + "-" + withDay;

                lineItemsWithObj = {
                    type: "TReconciliationWithdrawalLines",
                    fields: {
                        AccountName: withaccountname || '',
                        Amount: Number(withamount.replace(/[^0-9.-]+/g, "")) || 0,
                        BankStatementLineID: 0, //Hardcoded for now
                        ClientName: withclientname || '',
                        DepositDate: formatWithDate + " 00:00:00" || '',
                        Deposited: true,
                        DepositLineID: parseInt(depositLineIDWith) || 0,
                        Notes: withnotes || '',
                        Payee: withclientname || '',
                        PaymentID: parseInt(withpaymentid) || 0,
                        Reconciled: true,
                        Reference: withref || ''
                    }
                };
                lineItemsWith.push(lineItemsWithObj);
            }
        });

        // Pulling initial variables BEGIN
        var accountname = $('#bankAccountName').val()||'';
        var deptname = "Default"; //Set to Default as it isn't used for recons
        var employeename = Session.get('mySessionEmployee');
        var deleted = false;
        var finished = true;
        var notes = $('#statementno').val(); //pending addition of notes field
        var onhold = false;
        var openbalance = $('.openingbalance').val().replace(/[^0-9.-]+/g, "") || 0;
        var statementno = $('#statementno').val();
        var recondateTime = new Date($("#dtSODate2").datepicker("getDate"));
        let recondate = recondateTime.getFullYear() + "-" + (recondateTime.getMonth() + 1) + "-" + recondateTime.getDate();
        let closebalance = $('.endingBalanceCalc').html().replace(/[^0-9.-]+/g, "") || 0;
        // Pulling initial variables END
        let objDetails = '';
        if (FlowRouter.current().queryParams.id) {
            objDetails = {
                type: "TReconciliation",
                fields: {
                    ID: parseInt(FlowRouter.current().queryParams.id) || 0,
                    AccountName: accountname || '',
                    CloseBalance: parseFloat(closebalance) || 0,
                    Deleted: deleted,
                    DepositLines: lineItemsDep || '',
                    DeptName: deptname || '',
                    EmployeeName: employeename || '',
                    Finished: true,
                    Notes: notes || '',
                    OnHold: false,
                    OpenBalance: parseFloat(openbalance) || 0,
                    ReconciliationDate: moment(recondate).format('YYYY-MM-DD'),
                    StatementNo: statementno || '0',
                    WithdrawalLines: lineItemsWith || ''

                }
            };

        } else {
            objDetails = {
                type: "TReconciliation",
                fields: {
                    AccountName: accountname || '',
                    CloseBalance: parseFloat(closebalance) || 0,
                    Deleted: deleted,
                    DepositLines: lineItemsDep || '',
                    DeptName: deptname || '',
                    EmployeeName: employeename || '',
                    Finished: true,
                    Notes: notes || '',
                    OnHold: false,
                    OpenBalance: parseFloat(openbalance) || 0,
                    ReconciliationDate: moment(recondate).format('YYYY-MM-DD'),
                    StatementNo: statementno || '0',
                    WithdrawalLines: lineItemsWith || ''

                }
            };
        }
        recService.saveReconciliation(objDetails).then(function(data) {
            FlowRouter.go('/reconciliationlist?success=true');
        }).catch(function(err) {
            swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {} else if (result.dismiss == 'cancel') {}
            });
            $('.fullScreenSpin').css('display', 'none');
        });
    },
    'click .btnHold': function(e) {
        $('.fullScreenSpin').css('display', 'inline-block');

        let recService = new ReconService();

        let lineItemsDep = [];
        let lineItemsDepObj = {};
        $('#tblSelectedDeposits > tbody > tr').each(function() {
            var depID = this.id;
            if (depID) {
                let depositLineID = $(this).attr('depositLineID') || 0;
                let depclientname = $("#" + depID + "_name").text() || '';
                let depdepositdate = $("#" + depID + "_date").text() || '';
                let depnotes = $("#" + depID + "_desc").text() || '';
                let depamount = $("#" + depID + "_amount").text() || 0;
                let depref = $("#" + depID + "_ref").text() || '';
                let deppaymentid = $("#" + depID + "_payid").text() || '';
                let depaccountname = $('#bankAccountName').val() || '';
                if ($("#" + depID + "_desc").text() == "Customer Payment") {
                    deppaymentid = depID;
                }

                if(FlowRouter.current().queryParams.id){

                }else{
                  if ($("#" + depID + "_desc").text() == "Cheque Deposit") {
                      deppaymentid = depID;
                  }

                  if ($("#" + depID + "_desc").text() == "Cheque") {
                      deppaymentid = depID;
                  }
                }
                // else if($("#"+depID+"_desc").text() == "Journal Entry"){
                //   deppaymentid = depID;
                // }

                let splitDepdepositdate = depdepositdate.split("/");
                let depositYear = splitDepdepositdate[2];
                let depositMonth = splitDepdepositdate[1];
                let depositDay = splitDepdepositdate[0];

                let formateDepDate = depositYear + "-" + depositMonth + "-" + depositDay;

                lineItemsDepObj = {
                    type: "TReconciliationDepositLines",
                    fields: {
                        AccountName: depaccountname || '',
                        Amount: Number(depamount.replace(/[^0-9.-]+/g, "")) || 0,
                        BankStatementLineID: 0, //Hardcoded for now
                        ClientName: depclientname || '',
                        DepositDate: formateDepDate + " 00:00:00" || '',
                        Deposited: true,
                        DepositLineID: parseInt(depositLineID) || 0,
                        Notes: depnotes || '',
                        Payee: depclientname || '',
                        PaymentID: parseInt(deppaymentid) || 0,
                        Reconciled: true,
                        Reference: depref || ''
                    }
                };

                lineItemsDep.push(lineItemsDepObj);
            }
        });

        let lineItemsWith = [];
        let lineItemsWithObj = {};
        $('#tblSelectedWithdrawals > tbody > tr').each(function() {
            var withID = this.id;
            if (withID) {
                let depositLineIDWith = $(this).attr('depositLineID') || 0;
                let withclientname = $("#" + withID + "_name").text() || '';
                let withdepositdate = $("#" + withID + "_date").text() || '';
                let withnotes = $("#" + withID + "_desc").text() || '';
                let withamount = $("#" + withID + "_amount").text() || 0;
                let withref = $("#" + withID + "_ref").text() || '';
                let withpaymentid = $("#" + withID + "_payid").text() || '';
                let withaccountname = $('#bankAccountName').val() || '';

                let splitwithdepositdate = withdepositdate.split("/");
                let withYear = splitwithdepositdate[2];
                let withMonth = splitwithdepositdate[1];
                let withDay = splitwithdepositdate[0];

                let formatWithDate = withYear + "-" + withMonth + "-" + withDay;

                lineItemsWithObj = {
                    type: "TReconciliationWithdrawalLines",
                    fields: {
                        AccountName: withaccountname || '',
                        Amount: Number(withamount.replace(/[^0-9.-]+/g, "")) || 0,
                        BankStatementLineID: 0, //Hardcoded for now
                        ClientName: withclientname || '',
                        DepositDate: formatWithDate + " 00:00:00" || '',
                        Deposited: true,
                        DepositLineID: parseInt(depositLineIDWith) || 0,
                        Notes: withnotes || '',
                        Payee: withclientname || '',
                        PaymentID: parseInt(withpaymentid) || 0,
                        Reconciled: true,
                        Reference: withref || ''
                    }
                };
                lineItemsWith.push(lineItemsWithObj);
            }
        });

        // Pulling initial variables BEGIN
        var accountname = $('#bankAccountName').val()||'';
        var deptname = "Default"; //Set to Default as it isn't used for recons
        var employeename = Session.get('mySessionEmployee');
        var deleted = false;
        var finished = true;
        var notes = $('#statementno').val(); //pending addition of notes field
        var onhold = false;
        var openbalance = $('.openingbalance').val().replace(/[^0-9.-]+/g, "") || 0;
        var statementno = $('#statementno').val();
        var recondateTime = new Date($("#dtSODate2").datepicker("getDate"));
        let recondate = recondateTime.getFullYear() + "-" + (recondateTime.getMonth() + 1) + "-" + recondateTime.getDate();
        let closebalance = $('.endingBalanceCalc').html().replace(/[^0-9.-]+/g, "") || 0;
        // Pulling initial variables END

        let objDetails = '';
        if (FlowRouter.current().queryParams.id) {
            objDetails = {
                type: "TReconciliation",
                fields: {
                    ID: parseInt(FlowRouter.current().queryParams.id) || 0,
                    AccountName: accountname || '',
                    CloseBalance: parseFloat(closebalance) || 0,
                    Deleted: deleted,
                    DepositLines: lineItemsDep || '',
                    DeptName: deptname || '',
                    EmployeeName: employeename || '',
                    Finished: false,
                    Notes: notes || '',
                    OnHold: true,
                    OpenBalance: parseFloat(openbalance) || 0,
                    ReconciliationDate: moment(recondate).format('YYYY-MM-DD'),
                    StatementNo: statementno || '0',
                    WithdrawalLines: lineItemsWith || ''

                }
            };

        } else {
            objDetails = {
                type: "TReconciliation",
                fields: {
                    AccountName: accountname || '',
                    CloseBalance: parseFloat(closebalance) || 0,
                    Deleted: deleted,
                    DepositLines: lineItemsDep || '',
                    DeptName: deptname || '',
                    EmployeeName: employeename || '',
                    Finished: false,
                    Notes: notes || '',
                    OnHold: true,
                    OpenBalance: parseFloat(openbalance) || 0,
                    ReconciliationDate: moment(recondate).format('YYYY-MM-DD'),
                    StatementNo: statementno || '0',
                    WithdrawalLines: lineItemsWith || ''

                }
            };
        }


        recService.saveReconciliation(objDetails).then(function(data) {
            FlowRouter.go('/reconciliationlist?success=true');
        }).catch(function(err) {
            swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {} else if (result.dismiss == 'cancel') {}
            });
            $('.fullScreenSpin').css('display', 'none');
        });
    },
    'click .btnDeleteRecon span': function(e) {
        if ($(".btnDeleteRecon").is(":disabled")) {
            swal({
                title: 'Cannot delete this reconciliation. Please delete the most recent reconciliations first.',
                text: "This will enable the deletion of this Reconciliation",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then((result) => {
                //if (result.value) {
                FlowRouter.go('/reconciliationlist?success=true');
                //}

            });
            // swal('Delete all Reconciliations for this account, dated after this.', 'This will enable the deletion of this Reconciliation', 'warning');
            // return false;
        }

    },
    'click .btnDeleteRecon': function(e) {
        let recService = new ReconService();
        swal({
            title: 'Delete Bank Reconciliation',
            text: "Are you sure you want to Delete Bank Reconciliation?",
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                $('.fullScreenSpin').css('display', 'inline-block');
                var url = FlowRouter.current().path;
                var getrecon_id = url.split('?id=');
                var currentRecon = getrecon_id[getrecon_id.length - 1];
                if (getrecon_id[1]) {
                    currentRecon = parseInt(currentRecon);
                    var objDetails = {
                        type: "TReconciliation",
                        fields: {
                            ID: currentRecon,
                            Deleted: true
                        }
                    };

                    recService.saveReconciliation(objDetails).then(function(objDetails) {
                        FlowRouter.go('/reconciliationlist?success=true');
                    }).catch(function(err) {
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {

                            } else if (result.dismiss == 'cancel') {

                            }
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    });
                } else {
                    FlowRouter.go('/reconciliationlist?success=true');
                }
            } else {

            }
        });

    },
    'change .endingbalance': function(e) {
        var difference = $('.differenceCalc').html().replace(/[^0-9.-]+/g, "") || 0;
        var endingbal = $('.endingBalanceCalc').html().replace(/[^0-9.-]+/g, "") || 0;
        var clearedbal = $('.clearedBalance').html().replace(/[^0-9.-]+/g, "") || 0;
        var zero = 0.00;

        var rowCountDep = $('#tblSelectedDeposits tbody tr').length;
        var rowCountWith = $('#tblSelectedWithdrawals tbody tr').length; // a response of 2 = 1 element in table

        if (difference == zero && endingbal == clearedbal) {
            if (rowCountDep >= 1 || rowCountWith >= 1) {
                if ($('#statementno').val().replace(/\s/g, '') != '') {
                    $('.reconbtn').prop("disabled", false);
                    $('.btnHold').prop("disabled", false);
                } else {
                    $('.reconbtn').prop("disabled", true);
                    $('.btnHold').prop("disabled", true);
                    swal('A Statement Number is required in order to reconcile!', '', 'warning');
                }
            } else {
                $('.reconbtn').prop("disabled", true);
                $('.btnHold').prop("disabled", true);
                swal('The Cleared Balance must match the Ending Balance you entered!', '', 'warning');
            }
        } else {
            $('.reconbtn').prop("disabled", true);
            $('.btnHold').prop("disabled", true);
            if (rowCountDep >= 1 || rowCountWith >= 1) {
                if ($('#statementno').val().replace(/\s/g, '') != '') {
                    $('.reconbtn').prop("disabled", true); //enables button
                    $('.btnHold').prop("disabled", false);

                } else {
                    $('.reconbtn').prop("disabled", true);
                    $('.btnHold').prop("disabled", true);
                    //swal('A Statement Number is required in order to reconcile!', '', 'warning');
                }
            }
            //swal('The Cleared Balance must match the Ending Balance you entered!', '', 'warning');
        }

    },
    'change .statementno': function(e) {
        var difference = $('.differenceCalc').html().replace(/[^0-9.-]+/g, "") || 0;
        var endingbal = $('.endingBalanceCalc').html().replace(/[^0-9.-]+/g, "") || 0;
        var clearedbal = $('.clearedBalance').html().replace(/[^0-9.-]+/g, "") || 0;
        var zero = 0.00;

        var rowCountDep = $('#tblSelectedDeposits tbody tr').length;
        var rowCountWith = $('#tblSelectedWithdrawals tbody tr').length; // a response of 2 = 1 element in table

        if (difference == zero && endingbal == clearedbal) {
            if (rowCountDep >= 1 || rowCountWith >= 1) {
                if ($('#statementno').val().replace(/\s/g, '') != '') {
                    $('.reconbtn').prop("disabled", false); //enables button
                    $('.btnHold').prop("disabled", false);

                } else {
                    $('.reconbtn').prop("disabled", true);
                    $('.btnHold').prop("disabled", true);
                    swal('A Statement Number is required in order to reconcile!', '', 'warning');
                }
            } else {
                $('.reconbtn').prop("disabled", true);
                $('.btnHold').prop("disabled", true);
                //swal('The Cleared Balance must match the Ending Balance you entered!', '', 'warning');
            }
        } else {
            $('.reconbtn').prop("disabled", true);
            $('.btnHold').prop("disabled", true);
            if (rowCountDep >= 1 || rowCountWith >= 1) {
                if ($('#statementno').val().replace(/\s/g, '') != '') {
                    $('.reconbtn').prop("disabled", true); //enables button
                    $('.btnHold').prop("disabled", false);

                } else {
                    $('.reconbtn').prop("disabled", true);
                    $('.btnHold').prop("disabled", true);
                    swal('A Statement Number is required in order to reconcile!', '', 'warning');
                }
            }
        }

    },
    'blur .statementno, keypress .statementno, keyup .statementno': function(event) {
        $('.statementno').val(event.target.value);
    },
    'keydown .endingbalance, keydown .lineUnitPrice, keydown .lineAmount': function(event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) != -1 ||
            // Allow: Ctrl+A, Command+A
            (event.keyCode == 65 && (event.ctrlKey == true || event.metaKey == true)) ||
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
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {} else {
            event.preventDefault();
        }
    },
    'click .btnBack': function(event) {
        event.preventDefault();
        history.back(1);
    },
    'click .reconbtn span': function(e) {
        var rowCountDep = $('#tblSelectedDeposits tr').length;
        var rowCountWith = $('#tblSelectedWithdrawals tr').length; // a response of 2 = 1 element in table

        var endingbal = $('.endingbalance').val();

        if ($("#reconbtn").is(":disabled")) {
            if (rowCountDep <= 1 && rowCountWith <= 1) {
                swal("No transactions flagged to be reconciled.", "", "warning");
            } else {
                if (endingbal == '') {
                    swal("No Ending Balance Entered.", "", "warning");
                }
            }
        } else {}
    },
    'click .btnHold span': function(e) {
        var rowCountDep = $('#tblSelectedDeposits tr').length;
        var rowCountWith = $('#tblSelectedWithdrawals tr').length; // a response of 2 = 1 element in table

        var endingbal = $('.endingbalance').val();

        if ($("#btnHold").is(":disabled")) {
            if (rowCountDep <= 1 && rowCountWith <= 1) {
                swal("No transactions flagged to be reconciled.", "", "warning");
            } else {
                if (endingbal == '') {
                    //swal("No Ending Balance Entered.","","warning");
                }
            }
        } else {}
    },
    'keyup #myInputSearchDep, change #myInputSearchDep, search #myInputSearchDep': function(event) {
        $('.tblVS1Dep tbody tr').show();
        let searchItem = $(event.target).val();
        if (searchItem != '') {
            var value = searchItem.toLowerCase();
            $('.tblVS1Dep tbody tr').each(function() {
                var found = 'false';
                $(this).each(function() {
                    if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                        found = 'true';
                    }

                    if ($(this).text().replace(/[^0-9.-]+/g, "").indexOf(value.toLowerCase()) >= 0) {
                        found = 'true';
                    }


                });
                if (found == 'true') {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else {
            $('.tblVS1Dep tbody tr').show();
            $('.tblVS1Dep tbody tr').each(function() {
                var found = 'false';
                $(this).each(function() {
                    found = 'true';
                });
                if (found == 'true') {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    },
    'keyup #myInputSearchWith, change #myInputSearchWith, search #myInputSearchWith': function(event) {
        $('.tblVS1With tbody tr').show();
        let searchItem = $(event.target).val();
        if (searchItem != '') {
            var value = searchItem.toLowerCase();
            $('.tblVS1With tbody tr').each(function() {
                var found = 'false';
                $(this).each(function() {
                    if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                        found = 'true';
                    }

                    if ($(this).text().replace(/[^0-9.-]+/g, "").indexOf(value.toLowerCase()) >= 0) {
                        found = 'true';
                    }


                });
                if (found == 'true') {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else {
            $('.tblVS1With tbody tr').show();
            $('.tblVS1With tbody tr').each(function() {
                var found = 'false';
                $(this).each(function() {
                    found = 'true';
                });
                if (found == 'true') {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    }
});

Template.bankrecon.helpers({
    accountnamerecords: () => {
        return Template.instance().accountnamerecords.get().sort(function(a, b) {
            if (a.accountname == 'NA') {
                return 1;
            } else if (b.accountname == 'NA') {
                return -1;
            }
            return (a.accountname.toUpperCase() > b.accountname.toUpperCase()) ? 1 : -1;
        });
    },
    reconVS1dep: () => {
        return Template.instance().reconVS1dep.get();
    },
    reconVS1with: () => {
        return Template.instance().reconVS1with.get()
    },
    selectedTransdep: () => {
        return Template.instance().selectedTransdep.get()
    },
    selectedTranswith: () => {
        return Template.instance().selectedTranswith.get()
    }
});
