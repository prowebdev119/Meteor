import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import {OrganisationService} from '../js/organisation-service';
import '../lib/global/indexdbstorage.js';
import XLSX from 'xlsx';
let utilityService = new UtilityService();
let sideBarService = new SideBarService();
Template.accounttypepop.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.accounttyperecords = new ReactiveVar([]);
    templateObject.taxraterecords = new ReactiveVar([]);

    templateObject.selectedFile = new ReactiveVar();
    templateObject.isBankAccount = new ReactiveVar();
    templateObject.isBankAccount.set(false);
});

Template.accounttypepop.onRendered(function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let accountService = new AccountService();
    let organisationService = new OrganisationService();
    const accountTypeList = [];
    const taxCodesList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];
    let currentId = FlowRouter.current().context.hash;

    if ((currentId === "addNewAccount") || (currentId === 'newaccount')) {
        setTimeout(function () {
          $('.isBankAccount').addClass('isNotBankAccount');
          $('.isCreditAccount').addClass('isNotCreditAccount');
            $('#addNewAccount').modal('show');
            //$('#btnAddNewAccounts').click();
        }, 500);

    }

    if (FlowRouter.current().queryParams.success) {
        $('.btnRefresh').addClass('btnRefreshAlert');
    }


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

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblAccountOverview', function (error, result) {
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

    getVS1Data('TAccountType').then(function (dataObject) {
        if (dataObject.length == 0) {
            accountService.getAccountTypeCheck().then(function (data) {
                for (let i = 0; i < data.taccounttype.length; i++) {
                    let accounttyperecordObj = {
                        accounttypename: data.taccounttype[i].AccountTypeName || ' ',
                        description: data.taccounttype[i].OriginalDescription || ' '
                    };
                    accountTypeList.push(accounttyperecordObj);

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
                accountTypeList.push(accounttyperecordObj);

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
                accountTypeList.push(accounttyperecordObj);

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
        TDs = document.getElementsByTagName('td');
        for (var i = 0; i < TDs.length; i++) {
            var temp = TDs[i];
            if (temp.firstChild.nodeValue.indexOf('-' + Currency) == 0) {
                temp.className = "colBalance text-danger";
            }
        }
    };

    if(FlowRouter.current().queryParams.id){
      var currentAccountID = FlowRouter.current().queryParams.id;
      getVS1Data('TAccountVS1').then(function (dataObject) {
          if (dataObject.length == 0) {
            accountService.getOneAccount(parseInt(currentAccountID)).then(function (data) {
              if (accountTypeList) {
                  for (var h = 0; h < accountTypeList.length; h++) {

                      if (data.fields.AccountTypeName === accountTypeList[h].accounttypename) {

                          fullAccountTypeName = accountTypeList[h].description || '';

                      }
                  }

              }

               var accountid = data.fields.ID || '';
               var accounttype = fullAccountTypeName || data.fields.AccountTypeName;
               var accountname = data.fields.AccountName || '';
               var accountno = data.fields.AccountNumber || '';
               var taxcode = data.fields.TaxCode || '';
               var accountdesc = data.fields.Description || '';
               var bankaccountname = data.fields.BankAccountName || '';
               var bankbsb = data.fields.BSB || '';
               var bankacountno = data.fields.BankAccountNumber || '';

               var swiftCode = data.fields.Extra || '';
               var routingNo = data.fields.BankCode || '';

               var showTrans = data.fields.IsHeader || false;
               var cardnumber = data.fields.CarNumber || '';
               var cardcvc = data.fields.CVC || '';
               var cardexpiry = data.fields.ExpiryDate || '';

               if ((accounttype === "BANK")) {
                   $('.isBankAccount').removeClass('isNotBankAccount');
                   $('.isCreditAccount').addClass('isNotCreditAccount');
               }else if ((accounttype === "CCARD")) {
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
              for (let a = 0; a < data.taccountvs1.length; a++) {

                if(parseInt(data.taccountvs1[a].fields.ID) === parseInt(currentAccountID)){
                  added = true;
                  if (accountTypeList) {
                      for (var h = 0; h < accountTypeList.length; h++) {

                          if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {

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

           if ((accounttype === "BANK")) {
               $('.isBankAccount').removeClass('isNotBankAccount');
               $('.isCreditAccount').addClass('isNotCreditAccount');
           }else if ((accounttype === "CCARD")) {
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
                accountService.getOneAccount(parseInt(currentAccountID)).then(function (data) {
                  if (accountTypeList) {
                      for (var h = 0; h < accountTypeList.length; h++) {

                          if (data.fields.AccountTypeName === accountTypeList[h].accounttypename) {

                              fullAccountTypeName = accountTypeList[h].description || '';

                          }
                      }

                  }

                   var accountid = data.fields.ID || '';
                   var accounttype = fullAccountTypeName || data.fields.AccountTypeName;
                   var accountname = data.fields.AccountName || '';
                   var accountno = data.fields.AccountNumber || '';
                   var taxcode = data.fields.TaxCode || '';
                   var accountdesc = data.fields.Description || '';
                   var bankaccountname = data.fields.BankAccountName || '';
                   var bankbsb = data.fields.BSB || '';
                   var bankacountno = data.fields.BankAccountNumber || '';

                   var swiftCode = data.fields.Extra || '';
                   var routingNo = data.fields.BankCode || '';

                   var showTrans = data.fields.IsHeader || false;

                   var cardnumber = data.fields.CarNumber || '';
                  var cardcvc = data.fields.CVC || '';
                  var cardexpiry = data.fields.ExpiryDate || '';

                   if ((accounttype === "BANK")) {
                       $('.isBankAccount').removeClass('isNotBankAccount');
                       $('.isCreditAccount').addClass('isNotCreditAccount');
                   }else if ((accounttype === "CCARD")) {
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
        accountService.getOneAccount(parseInt(currentAccountID)).then(function (data) {
          if (accountTypeList) {
              for (var h = 0; h < accountTypeList.length; h++) {

                  if (data.fields.AccountTypeName === accountTypeList[h].accounttypename) {

                      fullAccountTypeName = accountTypeList[h].description || '';

                  }
              }

          }

           var accountid = data.fields.ID || '';
           var accounttype = fullAccountTypeName || data.fields.AccountTypeName;
           var accountname = data.fields.AccountName || '';
           var accountno = data.fields.AccountNumber || '';
           var taxcode = data.fields.TaxCode || '';
           var accountdesc = data.fields.Description || '';
           var bankaccountname = data.fields.BankAccountName || '';
           var bankbsb = data.fields.BSB || '';
           var bankacountno = data.fields.BankAccountNumber || '';

           var swiftCode = data.fields.Extra || '';
           var routingNo = data.fields.BankCode || '';

           var showTrans = data.fields.IsHeader || false;

           var cardnumber = data.fields.CarNumber || '';
          var cardcvc = data.fields.CVC || '';
          var cardexpiry = data.fields.ExpiryDate || '';

           if ((accounttype === "BANK")) {
               $('.isBankAccount').removeClass('isNotBankAccount');
               $('.isCreditAccount').addClass('isNotCreditAccount');
           }else if ((accounttype === "CCARD")) {
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
    }
    if(FlowRouter.current().queryParams.name){
      var currentAccountID = FlowRouter.current().queryParams.name.replace(/%20/g, " ");;
      getVS1Data('TAccountVS1').then(function (dataObject) {
          if (dataObject.length == 0) {
            accountService.getOneAccountByName(currentAccountID).then(function (data) {
              if (accountTypeList) {
                  for (var h = 0; h < accountTypeList.length; h++) {

                      if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

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

               if ((accounttype === "BANK")) {
                   $('.isBankAccount').removeClass('isNotBankAccount');
                   $('.isCreditAccount').addClass('isNotCreditAccount');
               }else if ((accounttype === "CCARD")) {
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
              for (let a = 0; a < data.taccountvs1.length; a++) {

                if((data.taccountvs1[a].fields.AccountName) === currentAccountID){
                  added = true;
                  if (accountTypeList) {
                      for (var h = 0; h < accountTypeList.length; h++) {

                          if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {

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

           if ((accounttype === "BANK")) {
               $('.isBankAccount').removeClass('isNotBankAccount');
               $('.isCreditAccount').addClass('isNotCreditAccount');
           }else if ((accounttype === "CCARD")) {
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
                accountService.getOneAccountByName(currentAccountID).then(function (data) {
                  if (accountTypeList) {
                      for (var h = 0; h < accountTypeList.length; h++) {

                          if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

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

                   if ((accounttype === "BANK")) {
                       $('.isBankAccount').removeClass('isNotBankAccount');
                       $('.isCreditAccount').addClass('isNotCreditAccount');
                   }else if ((accounttype === "CCARD")) {
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
        accountService.getOneAccountByName(currentAccountID).then(function (data) {
          if (accountTypeList) {
              for (var h = 0; h < accountTypeList.length; h++) {

                  if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

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

           if ((accounttype === "BANK")) {
               $('.isBankAccount').removeClass('isNotBankAccount');
               $('.isCreditAccount').addClass('isNotCreditAccount');
           }else if ((accounttype === "CCARD")) {
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
    }
    templateObject.getAccountLists = function () {
        getVS1Data('TAccountVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                accountService.getAccountListVS1().then(function (data) {
                    //addVS1Data('TAccountVS1', JSON.stringify(data));
                    let lineItems = [];
                    let lineItemObj = {};
                    let fullAccountTypeName = '';
                    let accBalance = '';

                    for (let i = 0; i < data.taccountvs1.length; i++) {

                        if (accountTypeList) {
                            for (var j = 0; j < accountTypeList.length; j++) {

                                if (data.taccountvs1[i].AccountTypeName === accountTypeList[j].accounttypename) {

                                    fullAccountTypeName = accountTypeList[j].description || '';

                                }
                            }

                        }

                        if (!isNaN(data.taccountvs1[i].Balance)) {
                            accBalance = utilityService.modifynegativeCurrencyFormat(data.taccountvs1[i].Balance) || 0.00;
                        } else {
                            accBalance = Currency + "0.00";
                        }
                        var dataList = {
                            id: data.taccountvs1[i].Id || '',
                            accountname: data.taccountvs1[i].AccountName || '',
                            description: data.taccountvs1[i].Description || '',
                            accountnumber: data.taccountvs1[i].AccountNumber || '',
                            accounttypename: fullAccountTypeName || data.taccountvs1[i].AccountTypeName,
                            accounttypeshort: data.taccountvs1[i].AccountTypeName || '',
                            taxcode: data.taccountvs1[i].TaxCode || '',
                            bankaccountname: data.taccountvs1[i].BankAccountName || '',
                            bsb: data.taccountvs1[i].BSB || '',
                            bankaccountnumber: data.taccountvs1[i].BankAccountNumber || '',
                            swiftcode: data.taccountvs1[i].Extra || '',
                            routingNo: data.taccountvs1[i].BankCode || '',
                            apcanumber: data.taccountvs1[i].BankNumber || '',
                            balance: accBalance || 0.00,
                            isheader: data.taccountvs1[i].IsHeader || false,
                            cardnumber: data.taccountvs1[i].CarNumber || '',
                            expirydate: data.taccountvs1[i].ExpiryDate || '',
                            cvc: data.taccountvs1[i].CVC || ''

                        };
                        dataTableList.push(dataList);
                    }
                    templateObject.datatablerecords.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblAccountOverview', function (error, result) {
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
                        // //$.fn.dataTable.moment('DD/MM/YY');
                        $('#tblAccountOverview').DataTable({
                            columnDefs: [
                                // { type: 'currency', targets: 4 }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                    extend: 'csvHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "accountoverview_" + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Accounts Overview',
                                    filename: "Accounts Overview_" + moment().format(),
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'excelHtml5',
                                    title: '',
                                    download: 'open',
                                    className: "btntabletoexcel hiddenColumn",
                                    filename: "accountoverview_" + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                    // ,
                                    // customize: function ( win ) {
                                    //   $(win.document.body).children("h1:first").remove();
                                    // }

                                }
                            ],
                            // bStateSave: true,
                            // rowId: 0,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [[0, "asc"]],
                            // "aaSorting": [[1,'desc']],
                            action: function () {
                                $('#tblAccountOverview').DataTable().ajax.reload();
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
                        // $('.fullScreenSpin').css('display','none');
                    }, 10);

                    var columns = $('#tblAccountOverview th');
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

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.taccountvs1;

                let lineItems = [];
                let lineItemObj = {};
                let fullAccountTypeName = '';
                let accBalance = '';

                for (let i = 0; i < useData.length; i++) {

                    if (accountTypeList) {
                        for (var j = 0; j < accountTypeList.length; j++) {

                            if (useData[i].fields.AccountTypeName === accountTypeList[j].accounttypename) {

                                fullAccountTypeName = accountTypeList[j].description || '';

                            }
                        }

                    }

                    if (!isNaN(useData[i].fields.Balance)) {
                        accBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.Balance) || 0.00;
                    } else {
                        accBalance = Currency + "0.00";
                    }
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        accountname: useData[i].fields.AccountName || '',
                        description: useData[i].fields.Description || '',
                        accountnumber: useData[i].fields.AccountNumber || '',
                        accounttypename: fullAccountTypeName || useData[i].fields.AccountTypeName,
                        accounttypeshort: useData[i].fields.AccountTypeName || '',
                        taxcode: useData[i].fields.TaxCode || '',
                        bankaccountname: useData[i].fields.BankAccountName || '',
                        bsb: useData[i].fields.BSB || '',
                        bankaccountnumber: useData[i].fields.BankAccountNumber || '',
                        swiftcode: useData[i].fields.Extra || '',
                        routingNo: useData[i].BankCode || '',
                        apcanumber: useData[i].fields.BankNumber || '',
                        balance: accBalance || 0.00,
                        isheader: useData[i].fields.IsHeader || false,
                        cardnumber: useData[i].fields.CarNumber || '',
                        expirydate: useData[i].fields.ExpiryDate || '',
                        cvc: useData[i].fields.CVC || ''

                    };
                    dataTableList.push(dataList);
                }
                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblAccountOverview', function (error, result) {
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
                    // //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblAccountOverview').DataTable({
                        columnDefs: [
                            // { type: 'currency', targets: 4 }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "accountoverview_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Accounts Overview',
                                filename: "Accounts Overview_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "accountoverview_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                                // ,
                                // customize: function ( win ) {
                                //   $(win.document.body).children("h1:first").remove();
                                // }

                            }
                        ],
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[0, "asc"]],
                        // "aaSorting": [[1,'desc']],
                        action: function () {
                            $('#tblAccountOverview').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnRefreshAccount' type='button' id='btnRefreshAccount' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblAccountOverview_filter");
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
                    // $('.fullScreenSpin').css('display','none');
                }, 10);

                var columns = $('#tblAccountOverview th');
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
            }
        }).catch(function (err) {

            accountService.getAccountListVS1().then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                let fullAccountTypeName = '';
                let accBalance = '';
                //addVS1Data('TAccountVS1', JSON.stringify(data));
                for (let i = 0; i < data.taccountvs1.length; i++) {

                    if (accountTypeList) {
                        for (var j = 0; j < accountTypeList.length; j++) {

                            if (data.taccountvs1[i].AccountTypeName === accountTypeList[j].accounttypename) {

                                fullAccountTypeName = accountTypeList[j].description || '';

                            }
                        }

                    }

                    if (!isNaN(data.taccountvs1[i].Balance)) {
                        accBalance = utilityService.modifynegativeCurrencyFormat(data.taccountvs1[i].Balance) || 0.00;
                    } else {
                        accBalance = Currency + "0.00";
                    }
                    var dataList = {
                        id: data.taccountvs1[i].Id || '',
                        accountname: data.taccountvs1[i].AccountName || '',
                        description: data.taccountvs1[i].Description || '',
                        accountnumber: data.taccountvs1[i].AccountNumber || '',
                        accounttypename: fullAccountTypeName || data.taccountvs1[i].AccountTypeName,
                        accounttypeshort: data.taccountvs1[i].AccountTypeName || '',
                        taxcode: data.taccountvs1[i].TaxCode || '',
                        bankaccountname: data.taccountvs1[i].BankAccountName || '',
                        bsb: data.taccountvs1[i].BSB || '',
                        bankaccountnumber: data.taccountvs1[i].BankAccountNumber || '',
                        swiftcode: data.taccountvs1[i].Extra || '',
                        routingNo: data.taccountvs1[i].BankCode || '',
                        apcanumber: data.taccountvs1[i].BankNumber || '',
                        balance: accBalance || 0.00,
                        isheader: data.taccountvs1[i].IsHeader || false,
                        cardnumber: data.taccountvs1[i].CarNumber || '',
                        expirydate: data.taccountvs1[i].ExpiryDate || '',
                        cvc: data.taccountvs1[i].CVC || ''

                    };
                    dataTableList.push(dataList);
                }
                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblAccountOverview', function (error, result) {
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
                    // //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblAccountOverview').DataTable({
                        columnDefs: [
                            // { type: 'currency', targets: 4 }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "accountoverview_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Accounts Overview',
                                filename: "Accounts Overview_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "accountoverview_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                                // ,
                                // customize: function ( win ) {
                                //   $(win.document.body).children("h1:first").remove();
                                // }

                            }
                        ],
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[0, "asc"]],
                        // "aaSorting": [[1,'desc']],
                        action: function () {
                            $('#tblAccountOverview').DataTable().ajax.reload();
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
                    // $('.fullScreenSpin').css('display','none');
                }, 10);

                var columns = $('#tblAccountOverview th');
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

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });

    }

    templateObject.getAccountLists();

    $('#tblAccountOverview tbody').on('click', 'tr .colAccountName, tr .colAccountName, tr .colDescription, tr .colAccountNo, tr .colType, tr .colTaxCode, tr .colBankAccountName, tr .colBSB, tr .colBankAccountNo, tr .colExtra, tr .colAPCANumber', function () {
        var listData = $(this).closest('tr').attr('id');
        var tabletaxtcode = $(event.target).closest("tr").find(".colTaxCode").text();
        var accountName = $(event.target).closest("tr").find(".colAccountName").text();
        let columnBalClass = $(event.target).attr('class');
        // let accountService = new AccountService();

        // if(columnBalClass.indexOf("colBalance") != -1){
        //     window.open('/balancetransactionlist?accountName=' + accountName+ '&isTabItem='+false,'_self');
        // }else{

        if (listData) {
            $('#add-account-title').text('Edit Account Details');
            $('#edtAccountName').attr('readonly', true);
            $('#sltAccountType').attr('readonly', true);
            $('#sltAccountType').attr('disabled', 'disabled');
            if (listData !== '') {
                listData = Number(listData);
                //accountService.getOneAccount(listData).then(function (data) {


                var accountid = listData || '';
                var accounttype = $(event.target).closest("tr").find(".colType").attr('accounttype') || '';
                var accountname = $(event.target).closest("tr").find(".colAccountName").text() || '';
                var accountno = $(event.target).closest("tr").find(".colAccountNo").text() || '';
                var taxcode = $(event.target).closest("tr").find(".colTaxCode").text() || '';
                var accountdesc = $(event.target).closest("tr").find(".colDescription").text() || '';
                var bankaccountname = $(event.target).closest("tr").find(".colBankAccountName").text() || '';
                var bankbsb = $(event.target).closest("tr").find(".colBSB").text() || '';
                var bankacountno = $(event.target).closest("tr").find(".colBankAccountNo").text() || '';

                var swiftCode = $(event.target).closest("tr").find(".colExtra").text() || '';
                var routingNo = $(event.target).closest("tr").find(".colAPCANumber").text() || '';

                var showTrans = $(event.target).closest("tr").find(".colAPCANumber").attr('checkheader') || false;

                var cardnumber = $(event.target).closest("tr").find(".colCardNumber").text() || '';
                var cardexpiry = $(event.target).closest("tr").find(".colExpiryDate").text() || '';
                var cardcvc = $(event.target).closest("tr").find(".colCVC").text() || '';

                if ((accounttype === "BANK")) {
                    $('.isBankAccount').removeClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }else if ((accounttype === "CCARD")) {
                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                    $('.isBankAccount').addClass('isNotBankAccount');
                } else {
                    $('.isBankAccount').addClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }

                $('#edtAccountID').val(accountid);
                $('#sltAccountType').val(accounttype);
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
                //});

                $(this).closest('tr').attr('data-target', '#addNewAccount');
                $(this).closest('tr').attr('data-toggle', 'modal');

            }

            // window.open('/invoicecard?id=' + listData,'_self');
        }
        //}
    });

    //Open balance
    $('#tblAccountOverview tbody').on('click', 'tr .colBalance', function () {
        var listData = $(this).closest('tr').attr('id');
        var accountName = $(event.target).closest("tr").find(".colAccountName").text();
        let columnBalClass = $(event.target).attr('class');
        let accountService = new AccountService();
        FlowRouter.go('/balancetransactionlist?accountName=' + accountName + "&isTabItem=" + false);
        //window.open('/balancetransactionlist?accountName=' + accountName+ '&isTabItem='+false,'_self');

    });

    $(document).ready(function() {
        $('#sltAccountType').editableSelect();

        $('#sltAccountType').editableSelect()
            .on('click.editable-select', function(e, li) {
                var $earch = $(this);
                var offset = $earch.offset();
                //var termsDataName = e.target.value || '';
                //$('#edtTermsID').val('');
                if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                    $('#accountTypeModal').modal('toggle');
                } else {
                    $('#accountTypeModal').modal('toggle');
                    // if (termsDataName.replace(/\s/g, '') != '') {
                    //     $('#termModalHeader').text('Edit Terms');
                    //     getVS1Data('TTermsVS1').then(function(dataObject) { //edit to test indexdb
                    //         if (dataObject.length == 0) {
                    //             $('.fullScreenSpin').css('display', 'inline-block');
                    //             sideBarService.getTermsVS1().then(function(data) {
                    //                 for (let i in data.ttermsvs1) {
                    //                     if (data.ttermsvs1[i].TermsName === termsDataName) {
                    //                         $('#edtTermsID').val(data.ttermsvs1[i].Id);
                    //                         $('#edtDays').val(data.ttermsvs1[i].Days);
                    //                         $('#edtName').val(data.ttermsvs1[i].TermsName);
                    //                         $('#edtDesc').val(data.ttermsvs1[i].Description);
                    //                         if (data.ttermsvs1[i].IsEOM === true) {
                    //                             $('#isEOM').prop('checked', true);
                    //                         } else {
                    //                             $('#isEOM').prop('checked', false);
                    //                         }
                    //                         if (data.ttermsvs1[i].IsEOMPlus === true) {
                    //                             $('#isEOMPlus').prop('checked', true);
                    //                         } else {
                    //                             $('#isEOMPlus').prop('checked', false);
                    //                         }
                    //                         if (data.ttermsvs1[i].isSalesdefault === true) {
                    //                             $('#chkCustomerDef').prop('checked', true);
                    //                         } else {
                    //                             $('#chkCustomerDef').prop('checked', false);
                    //                         }
                    //                         if (data.ttermsvs1[i].isPurchasedefault === true) {
                    //                             $('#chkSupplierDef').prop('checked', true);
                    //                         } else {
                    //                             $('#chkSupplierDef').prop('checked', false);
                    //                         }
                    //                     }
                    //                 }
                    //                 setTimeout(function() {
                    //                     $('.fullScreenSpin').css('display', 'none');
                    //                     $('#newTermsModal').modal('toggle');
                    //                 }, 200);
                    //             });
                    //         } else {
                    //             let data = JSON.parse(dataObject[0].data);
                    //             let useData = data.ttermsvs1;
                    //             for (let i in useData) {
                    //                 if (useData[i].TermsName === termsDataName) {
                    //                     $('#edtTermsID').val(useData[i].Id);
                    //                     $('#edtDays').val(useData[i].Days);
                    //                     $('#edtName').val(useData[i].TermsName);
                    //                     $('#edtDesc').val(useData[i].Description);
                    //                     if (useData[i].IsEOM === true) {
                    //                         $('#isEOM').prop('checked', true);
                    //                     } else {
                    //                         $('#isEOM').prop('checked', false);
                    //                     }
                    //                     if (useData[i].IsEOMPlus === true) {
                    //                         $('#isEOMPlus').prop('checked', true);
                    //                     } else {
                    //                         $('#isEOMPlus').prop('checked', false);
                    //                     }
                    //                     if (useData[i].isSalesdefault === true) {
                    //                         $('#chkCustomerDef').prop('checked', true);
                    //                     } else {
                    //                         $('#chkCustomerDef').prop('checked', false);
                    //                     }
                    //                     if (useData[i].isPurchasedefault === true) {
                    //                         $('#chkSupplierDef').prop('checked', true);
                    //                     } else {
                    //                         $('#chkSupplierDef').prop('checked', false);
                    //                     }
                    //                 }
                    //             }
                    //             setTimeout(function() {
                    //                 $('.fullScreenSpin').css('display', 'none');
                    //                 $('#newTermsModal').modal('toggle');
                    //             }, 200);
                    //         }
                    //     }).catch(function(err) {
                    //         $('.fullScreenSpin').css('display', 'inline-block');
                    //         sideBarService.getTermsVS1().then(function(data) {
                    //             for (let i in data.ttermsvs1) {
                    //                 if (data.ttermsvs1[i].TermsName === termsDataName) {
                    //                     $('#edtTermsID').val(data.ttermsvs1[i].Id);
                    //                     $('#edtDays').val(data.ttermsvs1[i].Days);
                    //                     $('#edtName').val(data.ttermsvs1[i].TermsName);
                    //                     $('#edtDesc').val(data.ttermsvs1[i].Description);
                    //                     if (data.ttermsvs1[i].IsEOM === true) {
                    //                         $('#isEOM').prop('checked', true);
                    //                     } else {
                    //                         $('#isEOM').prop('checked', false);
                    //                     }
                    //                     if (data.ttermsvs1[i].IsEOMPlus === true) {
                    //                         $('#isEOMPlus').prop('checked', true);
                    //                     } else {
                    //                         $('#isEOMPlus').prop('checked', false);
                    //                     }
                    //                     if (data.ttermsvs1[i].isSalesdefault === true) {
                    //                         $('#chkCustomerDef').prop('checked', true);
                    //                     } else {
                    //                         $('#chkCustomerDef').prop('checked', false);
                    //                     }
                    //                     if (data.ttermsvs1[i].isPurchasedefault === true) {
                    //                         $('#chkSupplierDef').prop('checked', true);
                    //                     } else {
                    //                         $('#chkSupplierDef').prop('checked', false);
                    //                     }
                    //                 }
                    //             }
                    //             setTimeout(function() {
                    //                 $('.fullScreenSpin').css('display', 'none');
                    //                 $('#newTermsModal').modal('toggle');
                    //             }, 200);
                    //         });
                    //     });
                    // } else {
                    //     $('#termsListModal').modal();
                    //     setTimeout(function() {
                    //         $('#termsList_filter .form-control-sm').focus();
                    //         $('#termsList_filter .form-control-sm').val('');
                    //         $('#termsList_filter .form-control-sm').trigger("input");
                    //         var datatable = $('#termsList').DataTable();
                    //         datatable.draw();
                    //         $('#termsList_filter .form-control-sm').trigger("input");
                    //     }, 500);
                    // }
                }
            });

    });

});

Template.accounttypepop.events({
    'click #btnJournalEntries': function (event) {
        FlowRouter.go('/journalentrylist');
    },

    'click .chkDatatable': function (event) {
        var columns = $('#tblAccountOverview th');
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
                    PrefName: 'tblAccountOverview'
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
        //let datatable =$('#tblAccountOverview').DataTable();
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
                    PrefName: 'tblAccountOverview'
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
                            PrefName: 'tblAccountOverview',
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
                        PrefName: 'tblAccountOverview',
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

        var datable = $('#tblAccountOverview').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function (event) {
        let range = $(event.target).val();
        // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblAccountOverview th');
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
        var columns = $('#tblAccountOverview th');

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
        jQuery('#tblAccountOverview_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .exportbtnExcel': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblAccountOverview_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();

        sideBarService.getAccountListVS1().then(function (data) {
            addVS1Data('TAccountVS1', JSON.stringify(data)).then(function (datareturn) {
                window.open('/accountsoverview', '_self');
            }).catch(function (err) {
                window.open('/accountsoverview', '_self');
            });
        }).catch(function (err) {
            window.open('/accountsoverview', '_self');
        });
    },
    'click .btnBatchUpdate': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        batchUpdateCall('/accountsoverview?success=true');
        //FlowRouter.go('/salesorderslist?success=true');
        sideBarService.getAccountListVS1().then(function (data) {
            addVS1Data('TAccountVS1', JSON.stringify(data)).then(function (datareturn) {
                //location.reload();
            }).catch(function (err) {
                //location.reload();
            });
        }).catch(function (err) {
            //location.reload();
        });
    },
    'click .btnSaveAccount': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let accountService = new AccountService();
        let organisationService = new OrganisationService();
        let forTransaction = false;

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
        if (accountID == "") {
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
                                    window.open('/accountsoverview', '_self');
                            }).catch(function (err) {
                                window.open('/accountsoverview', '_self');
                            });
                        }).catch(function (err) {
                            window.open('/accountsoverview', '_self');
                        });
                    }).catch(function (err) {
                      sideBarService.getAccountListVS1().then(function (dataReload) {
                          addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                              window.open('/accountsoverview', '_self');
                          }).catch(function (err) {
                              window.open('/accountsoverview', '_self');
                          });
                      }).catch(function (err) {
                          window.open('/accountsoverview', '_self');
                      });
                    });
                    } else {
                        sideBarService.getAccountListVS1().then(function (dataReload) {
                            addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                                window.open('/accountsoverview', '_self');
                            }).catch(function (err) {
                                window.open('/accountsoverview', '_self');
                            });
                        }).catch(function (err) {
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
                        Active: true,
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
                                   window.open('/accountsoverview', '_self');
                                }).catch(function (err) {
                                    window.open('/accountsoverview', '_self');
                                });
                            }).catch(function (err) {
                               window.open('/accountsoverview', '_self');
                            });
                        }).catch(function (err) {
                          sideBarService.getAccountListVS1().then(function (dataReload) {
                              addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                                  //window.open('/accountsoverview', '_self');
                              }).catch(function (err) {
                                 window.open('/accountsoverview', '_self');
                              });
                          }).catch(function (err) {
                              window.open('/accountsoverview', '_self');
                          });
                        });
                    } else {
                        sideBarService.getAccountListVS1().then(function (dataReload) {
                            addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                                window.open('/accountsoverview', '_self');
                            }).catch(function (err) {
                                window.open('/accountsoverview', '_self');
                            });
                        }).catch(function (err) {
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
                            Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            });

        } else {
            data = {
                type: "TAccount",
                fields: {
                    ID: accountID,
                    AccountName: accountname || '',
                    AccountNumber: accountno || '',
                    // AccountTypeName: accounttype || '',
                    Active: true,
                    BankAccountName: bankaccountname || '',
                    BankAccountNumber: bankacountno || '',
                    BSB: bankbsb || '',
                    Description: accountdesc || '',
                    TaxCode: taxcode || '',
                    Extra: swiftCode,
                    BankNumber: routingNo,
                    //Level4: bankname,
                    PublishOnVS1: true,
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

                               window.open('/accountsoverview', '_self');
                            }).catch(function (err) {
                                window.open('/accountsoverview', '_self');
                            });
                        }).catch(function (err) {
                            window.open('/accountsoverview', '_self');
                        });
                    }).catch(function (err) {
                      sideBarService.getAccountListVS1().then(function (dataReload) {
                          addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                              window.open('/accountsoverview', '_self');
                          }).catch(function (err) {
                              window.open('/accountsoverview', '_self');
                          });
                      }).catch(function (err) {
                          window.open('/accountsoverview', '_self');
                      });
                    });
                } else {

                    sideBarService.getAccountListVS1().then(function (dataReload) {
                        addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                            window.open('/accountsoverview', '_self');
                        }).catch(function (err) {
                            window.open('/accountsoverview', '_self');
                        });
                    }).catch(function (err) {
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
                        Meteor._reload.reload();
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
    'click .printConfirm': function (event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblAccountOverview_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .templateDownload': function () {
        let utilityService = new UtilityService();
        let rows = [];
        const filename = 'SampleAccounts' + '.csv';
        rows[0] = ['Account Name', 'Description', 'Account No', 'Type', 'Balance', 'Tax Code', 'Bank Acc Name', 'BSB', 'Bank Acc No'];
        rows[1] = ['Test Act', 'Description 1', '12345', 'AP', '0.00', 'NT', '', '', ''];
        rows[2] = ['Test Act 2', 'Description 2', '5678', 'AR', '0.00', 'NT', '', '', ''];
        rows[3] = ['Test Act 3 ', 'Description 3', '6754', 'EQUITY', '0.00', 'NT', '', '', ''];
        rows[4] = ['Test Act 4', 'Description 4', '34567', 'BANK', '0.00', 'NT', '', '', ''];
        rows[5] = ['Test Act 5', 'Description 5', '8954', 'COGS', '0.00', 'NT', '', '', ''];
        rows[6] = ['Test Act 6', 'Description 6', '2346', 'CCARD', '0.00', 'NT', '', '', ''];
        rows[7] = ['Test Act 7', 'Description 7', '985454', 'EXP', '0.00', 'NT', '', '', ''];
        rows[8] = ['Test Act 8', 'Description 8', '34567', 'FIXASSET', '0.00', 'NT', '', '', ''];
        rows[9] = ['Test Act 9', 'Description 9', '9755', 'INC', '0.00', 'NT', '', '', ''];
        rows[10] = ['Test Act 10', 'Description 10', '8765', 'LTLIAB', '0.00', 'NT', '', '', ''];
        rows[11] = ['Test Act 11', 'Description 11', '7658', 'OASSET', '0.00', 'NT', '', '', ''];
        rows[12] = ['Test Act 12', 'Description 12', '6548', 'OCASSET', '0.00', 'NT', '', '', ''];
        rows[13] = ['Test Act 13', 'Description 13', '5678', 'OCLIAB', '0.00', 'NT', '', '', ''];
        rows[14] = ['Test Act 14', 'Description 14', '4761', 'EXEXP', '0.00', 'NT', '', '', ''];
        rows[15] = ['Test Act 15', 'Description 15', '3456', 'EXINC', '0.00', 'NT', '', '', ''];
        utilityService.exportToCsv(rows, filename, 'csv');
    },
    'click .templateDownloadXLSX': function (e) {

        e.preventDefault(); //stop the browser from following
        window.location.href = 'sample_imports/SampleAccounts.xlsx';
    },
    'click .btnUploadFile': function (event) {
        $('#attachment-upload').val('');
        $('.file-name').text('');
        // $(".btnImport").removeAttr("disabled");
        $('#attachment-upload').trigger('click');

    },
    'change #attachment-upload': function (e) {
        let templateObj = Template.instance();
        var filename = $('#attachment-upload')[0].files[0]['name'];
        var fileExtension = filename.split('.').pop().toLowerCase();
        var validExtensions = ["csv", "txt", "xlsx"];
        var validCSVExtensions = ["csv", "txt"];
        var validExcelExtensions = ["xlsx", "xls"];

        if (validExtensions.indexOf(fileExtension) == -1) {
            swal('Invalid Format', 'formats allowed are :' + validExtensions.join(', '), 'error');
            $('.file-name').text('');
            $(".btnImport").Attr("disabled");
        } else if (validCSVExtensions.indexOf(fileExtension) != -1) {

            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];

            templateObj.selectedFile.set(selectedFile);
            if ($('.file-name').text() != "") {
                $(".btnImport").removeAttr("disabled");
            } else {
                $(".btnImport").Attr("disabled");
            }
        } else if (fileExtension == 'xlsx') {
            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            var oFileIn;
            var oFile = selectedFile;
            var sFilename = oFile.name;
            // Create A File Reader HTML5
            var reader = new FileReader();

            // Ready The Event For When A File Gets Selected
            reader.onload = function (e) {
                var data = e.target.result;
                data = new Uint8Array(data);
                var workbook = XLSX.read(data, {
                    type: 'array'
                });

                var result = {};
                workbook.SheetNames.forEach(function (sheetName) {
                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        header: 1
                    });
                    var sCSV = XLSX.utils.make_csv(workbook.Sheets[sheetName]);
                    templateObj.selectedFile.set(sCSV);

                    if (roa.length)
                        result[sheetName] = roa;
                });
                // see the result, caution: it works after reader event is done.

            };
            reader.readAsArrayBuffer(oFile);

            if ($('.file-name').text() != "") {
                $(".btnImport").removeAttr("disabled");
            } else {
                $(".btnImport").Attr("disabled");
            }

        }

    },
    'click .btnImport': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let accountService = new AccountService();
        let objDetails;
        var filename = $('#attachment-upload')[0].files[0]['name'];
        var fileType = filename.split('.').pop().toLowerCase();

        if ((fileType == "csv") || (fileType == "txt") || (fileType == "xlsx")) {
            Papa.parse(templateObject.selectedFile.get(), {
                complete: function (results) {

                    if (results.data.length > 0) {
                        if ((results.data[0][0] == "Account Name") && (results.data[0][1] == "Description")
                             && (results.data[0][2] == "Account No") && (results.data[0][3] == "Type")
                             && (results.data[0][4] == "Balance") && (results.data[0][5] == "Tax Code")
                             && (results.data[0][6] == "Bank Acc Name") && (results.data[0][7] == "BSB") && (results.data[0][8] == "Bank Acc No")) {

                            let dataLength = results.data.length * 500;
                            setTimeout(function () {
                                // $('#importModal').modal('toggle');
                                //Meteor._reload.reload();
                                sideBarService.getAccountListVS1().then(function (dataReload) {
                                    addVS1Data('TAccountVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                                        window.open('/accountsoverview', '_self');
                                    }).catch(function (err) {
                                        window.open('/accountsoverview', '_self');
                                    });
                                }).catch(function (err) {
                                    window.open('/accountsoverview', '_self');
                                });
                            }, parseInt(dataLength));
                            for (let i = 0; i < results.data.length - 1; i++) {
                                objDetails = {
                                    type: "TAccount",
                                    fields: {
                                        Active: true,
                                        AccountName: results.data[i + 1][0],
                                        Description: results.data[i + 1][1],
                                        AccountNumber: results.data[i + 1][2],
                                        AccountTypeName: results.data[i + 1][3],
                                        Balance: Number(results.data[i + 1][4].replace(/[^0-9.-]+/g, "")) || 0,
                                        TaxCode: results.data[i + 1][5],
                                        BankAccountName: results.data[i + 1][6],
                                        BSB: results.data[i + 1][7],
                                        BankAccountNumber: results.data[i + 1][8],
                                        PublishOnVS1: true
                                    }
                                };
                                if (results.data[i + 1][1]) {
                                    if (results.data[i + 1][1] !== "") {

                                        accountService.saveAccount(objDetails).then(function (data) {}).catch(function (err) {
                                            //$('.fullScreenSpin').css('display','none');
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
                                        });

                                    }
                                }
                            }
                        } else {
                            $('.fullScreenSpin').css('display', 'none');
                            swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                        }
                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                        swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                    }
                }
            });
        } else {}

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

Template.accounttypepop.helpers({
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
