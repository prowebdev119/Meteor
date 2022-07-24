import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "./account-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import {OrganisationService} from '../js/organisation-service';
import {PurchaseBoardService} from '../js/purchase-service';
import '../lib/global/indexdbstorage.js';
import XLSX from 'xlsx';
let utilityService = new UtilityService();
let sideBarService = new SideBarService();
Template.addaccountpop.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.accounttyperecords = new ReactiveVar([]);
    templateObject.taxraterecords = new ReactiveVar([]);

    templateObject.selectedFile = new ReactiveVar();
    templateObject.isBankAccount = new ReactiveVar();
    templateObject.isBankAccount.set(false);
});

Template.addaccountpop.onRendered(function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let accountService = new AccountService();
    let organisationService = new OrganisationService();
    let purchaseService = new PurchaseBoardService();
    const accountTypeList = [];
    const taxCodesList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];
    let currentId = FlowRouter.current().context.hash;

        setTimeout(function () {
          $('.isBankAccount').addClass('isNotBankAccount');
          $('.isCreditAccount').addClass('isNotCreditAccount');

          $('#add-account-title').text('Add New Account');
          $('#edtAccountID').val('');
          $('#sltAccountType').val('');
          $('#sltAccountType').removeAttr('readonly', true);
          $('#sltAccountType').removeAttr('disabled', 'disabled');
          $('#edtAccountName').val('');
          $('#edtAccountName').attr('readonly', false);
          $('#edtAccountNo').val('');
          $('#sltTaxCode').val('NT' || '');
          $('#txaAccountDescription').val('');
          $('#edtBankAccountName').val('');
          $('#edtBSB').val('');
          $('#edtBankAccountNo').val('');
          $('#routingNo').val('');
          $('#edtBankName').val('');
          $('#swiftCode').val('');
          $('.showOnTransactions').prop('checked', false);
          $('.isBankAccount').addClass('isNotBankAccount');
          $('.isCreditAccount').addClass('isNotCreditAccount');
        }, 500);



    $("#edtExpiryDate").datepicker({
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

 var currentLoc = FlowRouter.current().route.path;
    getVS1Data('TAccountType').then(function (dataObject) {
        if (dataObject.length == 0) {
            accountService.getAccountTypeCheck().then(function (data) {
                for (let i = 0; i < data.taccounttype.length; i++) {
                    let accounttyperecordObj = {
                        accounttypename: data.taccounttype[i].AccountTypeName || ' ',
                        description: data.taccounttype[i].OriginalDescription || ' '
                    };
                    if (currentLoc == "/billcard"){
                      if((data.taccounttype[i].AccountTypeName != "AP") && (data.taccounttype[i].AccountTypeName != "AR")&&(data.taccounttype[i].AccountTypeName != "CCARD")&&(data.taccounttype[i].AccountTypeName != "BANK") ){
                        accountTypeList.push(accounttyperecordObj);
                      }
                    }else if (currentLoc == "/journalentrycard"){
                      if((data.taccounttype[i].AccountTypeName != "AP")&&(data.taccounttype[i].AccountTypeName != "AR")){
                        accountTypeList.push(accounttyperecordObj);
                      }
                    }else if(currentLoc == "/chequecard"){
                      if((data.taccountvs1[i].AccountTypeName == "EQUITY")||(data.taccountvs1[i].AccountTypeName == "BANK")||(data.taccountvs1[i].AccountTypeName == "CCARD") ||(data.taccountvs1[i].AccountTypeName == "COGS")
                      ||(data.taccountvs1[i].AccountTypeName == "EXP")||(data.taccountvs1[i].AccountTypeName == "FIXASSET")||(data.taccountvs1[i].AccountTypeName == "INC")||(data.taccountvs1[i].AccountTypeName == "LTLIAB")
                      ||(data.taccountvs1[i].AccountTypeName == "OASSET")||(data.taccountvs1[i].AccountTypeName == "OCASSET")||(data.taccountvs1[i].AccountTypeName == "OCLIAB")||(data.taccountvs1[i].AccountTypeName == "EXEXP")
                      ||(data.taccountvs1[i].AccountTypeName == "EXINC")){
                        accountTypeList.push(accounttyperecordObj);
                      }
                    }else{
                      accountTypeList.push(accounttyperecordObj);
                    }

                }
                templateObject.accounttyperecords.set(accountTypeList);

            });
        } else {
            let data = JSON.parse(dataObject[0].data);
            let useData = data.taccounttype;

            for (let i = 0; i < useData.length; i++) {
                let accounttyperecordObj = {
                    accounttypename: useData[i].AccountTypeName || ' ',
                    description: useData[i].OriginalDescription || ' '
                };
                if (currentLoc == "/billcard"){
                  if((useData[i].AccountTypeName != "AP") && (useData[i].AccountTypeName != "AR")&&(useData[i].AccountTypeName != "CCARD") &&(useData[i].AccountTypeName != "BANK")){
                    accountTypeList.push(accounttyperecordObj);
                  }
                }else if (currentLoc == "/journalentrycard"){
                  if((useData[i].AccountTypeName != "AP")&&(useData[i].AccountTypeName != "AR")){
                    accountTypeList.push(accounttyperecordObj);
                  }
                }else if(currentLoc == "/chequecard"){
                  if((useData[i].AccountTypeName == "EQUITY")||(useData[i].AccountTypeName == "BANK")||(useData[i].AccountTypeName == "CCARD") ||(useData[i].AccountTypeName == "COGS")
                  ||(useData[i].AccountTypeName == "EXP")||(useData[i].AccountTypeName == "FIXASSET")||(useData[i].AccountTypeName == "INC")||(useData[i].AccountTypeName == "LTLIAB")
                  ||(useData[i].AccountTypeName == "OASSET")||(useData[i].AccountTypeName == "OCASSET")||(useData[i].AccountTypeName == "OCLIAB")||(useData[i].AccountTypeName == "EXEXP")
                  ||(useData[i].AccountTypeName == "EXINC")){
                    accountTypeList.push(accounttyperecordObj);
                  }
                }else{
                  accountTypeList.push(accounttyperecordObj);
                }

            }
            templateObject.accounttyperecords.set(accountTypeList);

        }
    }).catch(function (err) {

        accountService.getAccountTypeCheck().then(function (data) {
            for (let i = 0; i < data.taccounttype.length; i++) {
                let accounttyperecordObj = {
                    accounttypename: data.taccounttype[i].AccountTypeName || ' ',
                    description: data.taccounttype[i].OriginalDescription || ' '
                };
                if (currentLoc == "/billcard"){
                  if((data.taccounttype[i].AccountTypeName != "AP") && (data.taccounttype[i].AccountTypeName != "AR")&&(data.taccounttype[i].AccountTypeName != "CCARD")&&(data.taccounttype[i].AccountTypeName != "BANK") ){
                    accountTypeList.push(accounttyperecordObj);
                  }
                }else if (currentLoc == "/journalentrycard"){
                  if((data.taccounttype[i].AccountTypeName != "AP")&&(data.taccounttype[i].AccountTypeName != "AR")){
                    accountTypeList.push(accounttyperecordObj);
                  }
                }else if(currentLoc == "/chequecard"){
                  if((data.taccountvs1[i].AccountTypeName == "EQUITY")||(data.taccountvs1[i].AccountTypeName == "BANK")||(data.taccountvs1[i].AccountTypeName == "CCARD") ||(data.taccountvs1[i].AccountTypeName == "COGS")
                  ||(data.taccountvs1[i].AccountTypeName == "EXP")||(data.taccountvs1[i].AccountTypeName == "FIXASSET")||(data.taccountvs1[i].AccountTypeName == "INC")||(data.taccountvs1[i].AccountTypeName == "LTLIAB")
                  ||(data.taccountvs1[i].AccountTypeName == "OASSET")||(data.taccountvs1[i].AccountTypeName == "OCASSET")||(data.taccountvs1[i].AccountTypeName == "OCLIAB")||(data.taccountvs1[i].AccountTypeName == "EXEXP")
                  ||(data.taccountvs1[i].AccountTypeName == "EXINC")){
                    accountTypeList.push(accounttyperecordObj);
                  }
                }else{
                  accountTypeList.push(accounttyperecordObj);
                }

            }
            templateObject.accounttyperecords.set(accountTypeList);

        });
    });

    templateObject.getAllTaxCodes = function () {
        getVS1Data('TTaxcodeVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                accountService.getTaxCodesVS1().then(function (data) {

                    let records = [];
                    let inventoryData = [];
                    for (let i = 0; i < data.ttaxcodevs1.length; i++) {

                        let taxcoderecordObj = {
                            codename: data.ttaxcodevs1[i].CodeName || ' ',
                            coderate: data.ttaxcodevs1[i].Rate || ' ',
                            description: data.ttaxcodevs1[i].Description || ' '
                        };

                        taxCodesList.push(taxcoderecordObj);

                    }
                    templateObject.taxraterecords.set(taxCodesList);

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.ttaxcodevs1;
                let records = [];
                let inventoryData = [];
                for (let i = 0; i < useData.length; i++) {

                    let taxcoderecordObj = {
                        codename: useData[i].CodeName || ' ',
                        coderate: useData[i].Rate || ' ',
                        description: useData[i].Description || ' '
                    };

                    taxCodesList.push(taxcoderecordObj);

                }
                templateObject.taxraterecords.set(taxCodesList);

            }
        }).catch(function (err) {
            accountService.getTaxCodesVS1().then(function (data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.ttaxcodevs1.length; i++) {

                    let taxcoderecordObj = {
                        codename: data.ttaxcodevs1[i].CodeName || ' ',
                        coderate: data.ttaxcodevs1[i].Rate || ' ',
                        description: data.ttaxcodevs1[i].Description || ' '
                    };

                    taxCodesList.push(taxcoderecordObj);

                }
                templateObject.taxraterecords.set(taxCodesList);

            });
        });

    }

    templateObject.getAllTaxCodes();
    // $('#tblAccountOverview').DataTable();
    function MakeNegative() {
        var TDs = document.getElementsByTagName('td');
        for (var i = 0; i < TDs.length; i++) {
            var temp = TDs[i];
            if (temp.firstChild.nodeValue.indexOf('-' + Currency) === 0) {
                temp.className = "colBalance text-danger";
            }
        }
    }


 $(document).ready(function () {
    setTimeout(function () {
        $('#sltTaxCode').editableSelect();
        $('#sltTaxCode').editableSelect()
        .on('click.editable-select', function (e, li) {
            var $earch = $(this);
            var taxSelected = "sales";
            var offset = $earch.offset();
            var taxRateDataName = e.target.value || '';
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#taxRateListModal').modal('toggle');
            } else {
                if (taxRateDataName.replace(/\s/g, '') != '') {
                    $('.taxcodepopheader').text('Edit Tax Rate');
                    getVS1Data('TTaxcodeVS1').then(function (dataObject) {
                        if (dataObject.length === 0) {
                            purchaseService.getTaxCodesVS1().then(function (data) {
                                let lineItems = [];
                                let lineItemObj = {};
                                for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                                    if ((data.ttaxcodevs1[i].CodeName) === taxRateDataName) {
                                        $('#edtTaxNamePop').attr('readonly', true);
                                        let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                                        var taxRateID = data.ttaxcodevs1[i].Id || '';
                                        var taxRateName = data.ttaxcodevs1[i].CodeName || '';
                                        var taxRateDesc = data.ttaxcodevs1[i].Description || '';
                                        $('#edtTaxID').val(taxRateID);
                                        $('#edtTaxNamePop').val(taxRateName);
                                        $('#edtTaxRatePop').val(taxRate);
                                        $('#edtTaxDescPop').val(taxRateDesc);
                                        setTimeout(function () {
                                            $('#newTaxRateModal').modal('toggle');
                                        }, 100);
                                    }
                                }

                            }).catch(function (err) {
                                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                                $('.fullScreenSpin').css('display', 'none');
                                // Meteor._reload.reload();
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.ttaxcodevs1;
                            let lineItems = [];
                            let lineItemObj = {};
                            $('.taxcodepopheader').text('Edit Tax Rate');
                            for (let i = 0; i < useData.length; i++) {

                                if ((useData[i].CodeName) === taxRateDataName) {
                                    $('#edtTaxNamePop').attr('readonly', true);
                                    let taxRate = (useData[i].Rate * 100).toFixed(2);
                                    var taxRateID = useData[i].Id || '';
                                    var taxRateName = useData[i].CodeName || '';
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
                        purchaseService.getTaxCodesVS1().then(function (data) {
                            let lineItems = [];
                            let lineItemObj = {};
                            for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                                if ((data.ttaxcodevs1[i].CodeName) === taxRateDataName) {
                                    $('#edtTaxNamePop').attr('readonly', true);
                                    let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                                    var taxRateID = data.ttaxcodevs1[i].Id || '';
                                    var taxRateName = data.ttaxcodevs1[i].CodeName || '';
                                    var taxRateDesc = data.ttaxcodevs1[i].Description || '';
                                    $('#edtTaxID').val(taxRateID);
                                    $('#edtTaxNamePop').val(taxRateName);
                                    $('#edtTaxRatePop').val(taxRate);
                                    $('#edtTaxDescPop').val(taxRateDesc);
                                    setTimeout(function () {
                                        $('#newTaxRateModal').modal('toggle');
                                    }, 100);

                                }
                            }

                        }).catch(function (err) {
                            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                            $('.fullScreenSpin').css('display', 'none');
                            // Meteor._reload.reload();
                        });
                    });
                } else {
                    $('#taxRateListModal').modal('toggle');
                }

            }
        });
    }, 1000);
});


});

Template.addaccountpop.events({
    
    'click .btnSaveAccountPOP': function () {
        var url = FlowRouter.current().path;
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let accountService = new AccountService();
        let organisationService = new OrganisationService();
        let forTransaction = false;
        let accSelected = $('#accSelected').val();
        if ($('#showOnTransactions').is(':checked')) {
            forTransaction = true;
        }
        let accountID = $('#edtAccountID').val();
        var accounttype = $('#sltAccountType').val();
        var accountname = $('#edtAccountName').val();
        var accountno = $('#edtAccountNo').val();
        var taxcode = $('#sltTaxCode').val();
        var accountdesc = $('#txaAccountDescription').val();
        var swiftCode = $('#swiftCode').val();
        var routingNo = $('#routingNo').val();
        // var comments = $('#txaAccountComments').val();
        var bankname = $('#edtBankName').val();
        var bankaccountname = $('#edtBankAccountName').val();
        var bankbsb = $('#edtBSB').val();
        var bankacountno = $('#edtBankAccountNo').val();
        let isBankAccount = templateObject.isBankAccount.get();

        var expirydateTime = new Date($("#edtExpiryDate").datepicker("getDate"));
        let cardnumber = $('#edtCardNumber').val();
        let cardcvc = $('#edtCvc').val();
        let expiryDate = expirydateTime.getFullYear() + "-" + (expirydateTime.getMonth() + 1) + "-" + expirydateTime.getDate();

        let companyID = 1;
        let data = '';

            accountService.getCheckAccountData(accountname).then(function (data) {
                accountID = parseInt(data.taccount[0].Id) || 0;
                data = {
                    type: "TAccount",
                    fields: {
                        ID: accountID,
                        // AccountName: accountname|| '',
                        AccountNumber: accountno || '',
                        // AccountTypeName: accounttype|| '',
                        Active: true,
                        BankAccountName: bankaccountname || '',
                        BankAccountNumber: bankacountno || '',
                        BSB: bankbsb || '',
                        Description: accountdesc || '',
                        TaxCode: taxcode || '',
                        PublishOnVS1: true,
                        Extra: swiftCode,
                        BankNumber: routingNo,
                        IsHeader: forTransaction,
                        CarNumber:cardnumber||'',
                        CVC:cardcvc||'',
                        ExpiryDate:expiryDate||''


                    }
                };

                accountService.saveAccount(data).then(function (data) {
                    if ($('#showOnTransactions').is(':checked')) {
                      var objDetails = {
                        type: "TCompanyInfo",
                        fields: {
                            Id: companyID,
                            AccountNo: bankacountno,
                            BankBranch: swiftCode,
                            BankAccountName: bankaccountname,
                            BankName: bankname,
                            Bsb: bankbsb,
                            SiteCode: routingNo,
                            FileReference: accountname
                        }
                    }
                    organisationService.saveOrganisationSetting(objDetails).then(function (data) {
                           var accNo =  bankacountno || '';
                           var swiftCode1 = swiftCode || '';
                           var bankAccName = bankaccountname || '';
                           var accountName = accountname || '';
                           var bsb = bankbsb || '';
                           var routingNo = routingNo || '';

                           localStorage.setItem('vs1companyBankName', bankname);
                           localStorage.setItem('vs1companyBankAccountName', bankAccName);
                           localStorage.setItem('vs1companyBankAccountNo', accNo);
                           localStorage.setItem('vs1companyBankBSB', bsb);
                           localStorage.setItem('vs1companyBankSwiftCode', swiftCode1);
                           localStorage.setItem('vs1companyBankRoutingNo', routingNo);
                        sideBarService.getAccountListVS1().then(function (dataReload) {
                            addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                                if(url.includes("/productview")) {
                                    if (accSelected == "cogs") {
                                        $('#sltcogsaccount').val(accountname);
                                    } else if (accSelected == "sales") {
                                        $('#sltsalesacount').val(accountname);
                                    } else if (accSelected == "inventory") {
                                        $('#sltinventoryacount').val(accountname);
                                    }
                                     $('#addAccountModal').modal('toggle');
                                     $('.fullScreenSpin').css('display', 'none');
                                    return false;
                                }
                                window.open('/accountsoverview', '_self');
                            }).catch(function (err) {
                              if(url.includes("/productview")) {
                                    if (accSelected == "cogs") {
                                        $('#sltcogsaccount').val(accountname);
                                    } else if (accSelected == "sales") {
                                        $('#sltsalesacount').val(accountname);
                                    } else if (accSelected == "inventory") {
                                        $('#sltinventoryacount').val(accountname);
                                    }
                                     $('#addAccountModal').modal('toggle');
                                     $('.fullScreenSpin').css('display', 'none');
                                    return false;
                                }
                                window.open('/accountsoverview', '_self');
                            });
                        }).catch(function (err) {
                            if(url.includes("/productview")) {
                                    if (accSelected == "cogs") {
                                        $('#sltcogsaccount').val(accountname);
                                    } else if (accSelected == "sales") {
                                        $('#sltsalesacount').val(accountname);
                                    } else if (accSelected == "inventory") {
                                        $('#sltinventoryacount').val(accountname);
                                    }
                                     $('#addAccountModal').modal('toggle');
                                     $('.fullScreenSpin').css('display', 'none');
                                    return false;
                                }
                            window.open('/accountsoverview', '_self');
                        });
                    }).catch(function (err) {
                      sideBarService.getAccountListVS1().then(function (dataReload) {
                          addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                          if(url.includes("/productview")) {
                                    if (accSelected == "cogs") {
                                        $('#sltcogsaccount').val(accountname);
                                    } else if (accSelected == "sales") {
                                        $('#sltsalesacount').val(accountname);
                                    } else if (accSelected == "inventory") {
                                        $('#sltinventoryacount').val(accountname);
                                    }
                                     $('#addAccountModal').modal('toggle');
                                     $('.fullScreenSpin').css('display', 'none');
                                    return false;
                                }
                              window.open('/accountsoverview', '_self');
                          }).catch(function (err) {
                            if(url.includes("/productview")) {
                                    if (accSelected == "cogs") {
                                        $('#sltcogsaccount').val(accountname);
                                    } else if (accSelected == "sales") {
                                        $('#sltsalesacount').val(accountname);
                                    } else if (accSelected == "inventory") {
                                        $('#sltinventoryacount').val(accountname);
                                    }
                                     $('#addAccountModal').modal('toggle');
                                     $('.fullScreenSpin').css('display', 'none');
                                    return false;
                                }
                              window.open('/accountsoverview', '_self');
                          });
                      }).catch(function (err) {
                                if(url.includes("/productview")) {
                                    if (accSelected == "cogs") {
                                        $('#sltcogsaccount').val(accountname);
                                    } else if (accSelected == "sales") {
                                        $('#sltsalesacount').val(accountname);
                                    } else if (accSelected == "inventory") {
                                        $('#sltinventoryacount').val(accountname);
                                    }
                                     $('#addAccountModal').modal('toggle');
                                     $('.fullScreenSpin').css('display', 'none');
                                    return false;
                                }

                          window.open('/accountsoverview', '_self');
                      });
                    });
                    } else {
                        sideBarService.getAccountListVS1().then(function (dataReload) {
                            addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                               if(url.includes("/productview")) {
                                    if (accSelected == "cogs") {
                                        $('#sltcogsaccount').val(accountname);
                                    } else if (accSelected == "sales") {
                                        $('#sltsalesacount').val(accountname);
                                    } else if (accSelected == "inventory") {
                                        $('#sltinventoryacount').val(accountname);
                                    }
                                     $('#addAccountModal').modal('toggle');
                                     $('.fullScreenSpin').css('display', 'none');
                                    return false;
                                }
                                window.open('/accountsoverview', '_self');
                            }).catch(function (err) {
                               if(url.includes("/productview")) {
                                    if (accSelected == "cogs") {
                                        $('#sltcogsaccount').val(accountname);
                                    } else if (accSelected == "sales") {
                                        $('#sltsalesacount').val(accountname);
                                    } else if (accSelected == "inventory") {
                                        $('#sltinventoryacount').val(accountname);
                                    }
                                     $('#addAccountModal').modal('toggle');
                                     $('.fullScreenSpin').css('display', 'none');
                                    return false;
                                }
                                window.open('/accountsoverview', '_self');
                            });
                        }).catch(function (err) {
                           if(url.includes("/productview")) {
                                    if (accSelected == "cogs") {
                                        $('#sltcogsaccount').val(accountname);
                                    } else if (accSelected == "sales") {
                                        $('#sltsalesacount').val(accountname);
                                    } else if (accSelected == "inventory") {
                                        $('#sltinventoryacount').val(accountname);
                                    }
                                     $('#addAccountModal').modal('toggle');
                                     $('.fullScreenSpin').css('display', 'none');
                                    return false;
                                }
                            window.open('/accountsoverview', '_self');
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
                        } else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });

            }).catch(function (err) {
                data = {
                    type: "TAccount",
                    fields: {
                        AccountName: accountname || '',
                        AccountNumber: accountno || '',
                        AccountTypeName: accounttype || '',
                        Active: true,
                        BankAccountName: bankaccountname || '',
                        BankAccountNumber: bankacountno || '',
                        BSB: bankbsb || '',
                        Description: accountdesc || '',
                        TaxCode: taxcode || '',
                        Extra: swiftCode,
                        BankNumber: routingNo,
                        PublishOnVS1: true,
                        IsHeader: forTransaction,
                        CarNumber:cardnumber||'',
                        CVC:cardcvc||'',
                        ExpiryDate:expiryDate||''
                    }
                };

                accountService.saveAccount(data).then(function (objDetailsReturn) {
                    if ($('#showOnTransactions').is(':checked')) {
                        var objDetails = {
                            type: "TCompanyInfo",
                            fields: {
                            Id: companyID,
                            AccountNo: bankacountno,
                            BankBranch: swiftCode,
                            // Firstname: bankaccountname,
                            BankAccountName: bankaccountname,
                            BankName: bankname,
                            Bsb: bankbsb,
                            SiteCode: routingNo,
                            FileReference: accountname
                            }
                        }
                        organisationService.saveOrganisationSetting(objDetails).then(function (data) {
                           var accNo =  bankacountno || '';
                           var swiftCode1 = swiftCode || '';
                           var bankName = bankaccountname || '';
                           var accountName = accountname || '';
                           var bsb = bankbsb || '';
                           var routingNo = routingNo || '';
                           localStorage.setItem('vs1companyBankName', bankname);
                           localStorage.setItem('vs1companyBankAccountName', bankAccName);
                           localStorage.setItem('vs1companyBankAccountNo', accNo);
                           localStorage.setItem('vs1companyBankBSB', bsb);
                           localStorage.setItem('vs1companyBankSwiftCode', swiftCode1);
                           localStorage.setItem('vs1companyBankRoutingNo', routingNo);
                            sideBarService.getAccountListVS1().then(function (dataReload) {
                                addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {

                                }).catch(function (err) {

                                });
                            }).catch(function (err) {

                            });
                        }).catch(function (err) {
                          sideBarService.getAccountListVS1().then(function (dataReload) {
                              addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {

                              }).catch(function (err) {

                              });
                          }).catch(function (err) {

                          });
                        });
                    } else {
                        sideBarService.getAccountListVS1().then(function (dataReload) {
                            addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {

                            }).catch(function (err) {

                            });
                        }).catch(function (err) {

                        });
                    }
                    let accountSaveID = objDetailsReturn.fields.ID;
                    $('.fullScreenSpin').css('display', 'none');
                    if (accountSaveID) {
                        var currentLoc = FlowRouter.current().route.path;
                        if (currentLoc == "/billcard" || currentLoc == "/chequecard" || currentLoc == "/creditcard"|| currentLoc == "/journalentrycard") {
                          var selectLineID = $('#selectLineID').val();
                          if (selectLineID) {
                              let lineProductName = accountname || '';
                              let lineProductDesc = accountdesc || '';

                              let lineUnitPrice = "0.00";
                              let lineTaxRate = taxcode || '';
                              let lineAmount = 0;
                              let subGrandTotal = 0;
                              let taxGrandTotal = 0;
                              let taxGrandTotalPrint = 0;
                              $('#' + selectLineID + " .lineTaxRate").text(0);

                              $('#' + selectLineID + " .lineAccountName").val(lineProductName);
                              $('#' + selectLineID + " .colAccountName").removeClass('boldtablealertsborder');
                              $('#' + selectLineID + " .lineMemo").text(lineProductDesc);
                              $('#' + selectLineID + " .colAmount").val(lineUnitPrice);
                              $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                              //$('#' + selectLineID + " .colAmount").trigger("change");
                              $('#addAccountModal').modal('toggle');

                          }else{
                              $('#edtBankAccountName').val(accountname);
                          }
                          // setTimeout(function () {
                          //     $('.btnRefreshAccount').trigger('click');
                          // }, 500);
                        }else if (currentLoc == "/depositcard") {
                          var selectLineID = $('#selectLineID').val();
                          if (selectLineID) {
                              let lineProductName = accountname || '';
                              let lineProductDesc = accountdesc || '';

                              let lineUnitPrice = "0.00";
                              let lineTaxRate = taxcode || '';
                              let lineAmount = 0;
                              let subGrandTotal = 0;
                              let taxGrandTotal = 0;
                              let taxGrandTotalPrint = 0;
                              $('#' + selectLineID + " .lineTaxRate").text(0);

                              $('#' + selectLineID + " .lineAccountName").val(lineProductName);
                              $('#' + selectLineID + " .colAccountName").removeClass('boldtablealertsborder');
                              // $('#' + selectLineID + " .lineMemo").text(lineProductDesc);
                              $('#' + selectLineID + " .colAmount").val(lineUnitPrice);
                              // $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                              //$('#' + selectLineID + " .colAmount").trigger("change");
                              $('#addAccountModal').modal('toggle');

                          }else{
                              $('#sltAccountName').val(accountname);
                          }
                          // setTimeout(function () {
                          //     $('.btnRefreshAccount').trigger('click');
                          // }, 500);
                        } else {
                          location.reload();
                        }

                        sideBarService.getAccountListVS1().then(function (dataReload) {
                            addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {

                            }).catch(function (err) {

                            });
                        }).catch(function (err) {

                        });
                        $('#addAccountModal').modal('toggle');
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
                        } else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            });



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
        $('#sltTaxCode').val('NT' || '');
        $('#txaAccountDescription').val('');
        $('#edtBankAccountName').val('');
        $('#edtBSB').val('');
        $('#edtBankAccountNo').val('');
        $('#routingNo').val('');
        $('#edtBankName').val('');
        $('#swiftCode').val('');
        $('.showOnTransactions').prop('checked', false);
        $('.isBankAccount').addClass('isNotBankAccount');
        $('.isCreditAccount').addClass('isNotCreditAccount');
    },
    'change #sltAccountType': function (e) {
        let templateObject = Template.instance();
        var accountTypeName = $('#sltAccountType').val();

        if ((accountTypeName === "BANK")) {
             $('.isBankAccount').removeClass('isNotBankAccount');
             $('.isCreditAccount').addClass('isNotCreditAccount');
         }else if ((accountTypeName === "CCARD")) {
             $('.isCreditAccount').removeClass('isNotCreditAccount');
             $('.isBankAccount').addClass('isNotBankAccount');
         } else {
             $('.isBankAccount').addClass('isNotBankAccount');
             $('.isCreditAccount').addClass('isNotCreditAccount');
         }
        // $('.file-name').text(filename);
        // let selectedFile = event.target.files[0];
        // templateObj.selectedFile.set(selectedFile);
        // if($('.file-name').text() != ""){
        //   $(".btnImport").removeAttr("disabled");
        // }else{
        //   $(".btnImport").Attr("disabled");
        // }

    },
    'click .btnDeleteAccount': function () {
        swal({
            title: 'Delete Account',
            text: "Are you sure you want to Delete Account?",
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                $('.fullScreenSpin').css('display', 'inline-block');
                let templateObject = Template.instance();
                let accountService = new AccountService();
                let accountID = $('#edtAccountID').val();

                if (accountID == "") {
                    window.open('/accountsoverview', '_self');
                } else {
                    data = {
                        type: "TAccount",
                        fields: {
                            ID: accountID,
                            Active: false,
                        }
                    };

                    accountService.saveAccount(data).then(function (data) {
                        sideBarService.getAccountListVS1().then(function (dataReload) {
                            addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                                window.open('/accountsoverview', '_self');
                            }).catch(function (err) {
                                window.open('/accountsoverview', '_self');
                            });
                        }).catch(function (err) {
                            window.open('/accountsoverview', '_self');
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
                                Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }

            } else {}
        });
    }
})

Template.addaccountpop.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.accountname == 'NA') {
                return 1;
            } else if (b.accountname == 'NA') {
                return -1;
            }
            return (a.accountname.toUpperCase() > b.accountname.toUpperCase()) ? 1 : -1;
        });
    },
    bsbRegionName: () => {
      let bsbname = "Branch Code";
      if(Session.get('ERPLoggedCountry') == "Australia"){
        bsbname = "BSB";
      }
        return bsbname;
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblAccountOverview'
        });
    },
    accounttyperecords: () => {
        return Template.instance().accounttyperecords.get().sort(function (a, b) {
            if (a.description == 'NA') {
                return 1;
            } else if (b.description == 'NA') {
                return -1;
            }
            return (a.description.toUpperCase() > b.description.toUpperCase()) ? 1 : -1;
        });
    },
    taxraterecords: () => {
        return Template.instance().taxraterecords.get().sort(function (a, b) {
            if (a.description == 'NA') {
                return 1;
            } else if (b.description == 'NA') {
                return -1;
            }
            return (a.description.toUpperCase() > b.description.toUpperCase()) ? 1 : -1;
        });
    },
    isBankAccount: () => {
        return Template.instance().isBankAccount.get()

    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
