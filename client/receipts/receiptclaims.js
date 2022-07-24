import {
    PaymentsService
} from '../payments/payments-service';
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CoreService
} from '../js/core-service';
import {ContactService} from "../contacts/contact-service";
import {
    AccountService
} from "../accounts/account-service";
import {
    UtilityService
} from "../utility-service";
import {
    SideBarService
} from '../js/sidebar-service';
import {
    OCRService
} from '../js/ocr-service';
import '../lib/global/indexdbstorage.js';
import moment from 'moment';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let accountService = new AccountService();
let ocrService = new OCRService();
let contactService = new ContactService();

Template.receiptsoverview.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.employees = new ReactiveVar([]);
    templateObject.suppliers = new ReactiveVar([]);
    templateObject.chartAccounts = new ReactiveVar([]);
    templateObject.expenseClaimList = new ReactiveVar([]);
    templateObject.editExpenseClaim = new ReactiveVar();
    templateObject.multiReceiptRecords = new ReactiveVar([]);

    templateObject.mergeReceiptRecords = new ReactiveVar([]);
    templateObject.mergeReceiptSelectedIndex = new ReactiveVar(0);
});

Template.receiptsoverview.onRendered(function () {
    let templateObject = Template.instance();

    if (FlowRouter.current().queryParams.success) {
        $('.btnRefresh').addClass('btnSearchAlert');
    }

    sessionCurrency = Session.get('ERPCountryAbbr');
    multipleRecords = [];
    for (i = 0; i < 10; i++) {
        item = {
            date: moment().format("DD/MM/YYYY"),
            amount: 0,
            merchantName: "",
            merchantId: 0,
            accountName: "",
            accountId: 0,
            currency: sessionCurrency,
            description: ""
        }
        multipleRecords.push(item);
    }
    templateObject.multiReceiptRecords.set(multipleRecords);

    setTimeout(() => {
        $('.multipleMerchant').editableSelect();
        $('.multipleAccount').editableSelect();
        $(".dtMultiple").datepicker({
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
    }, 200);

    $('.employees').editableSelect();
    $('.merchants').editableSelect();
    $('.chart-accounts').editableSelect();
    $('.currencies').editableSelect();
    $('.transactionTypes').editableSelect();

    $('.employees').on('click', function(e, li) {
        setEmployeeSelect(e);
    });
    $('.merchants').on('click', function(e, li) {
        templateObject.setSupplierSelect(e);
    });
    $('.currencies').on('click', function(e, li) {
        setCurrencySelect(e);
    });
    $('.chart-accounts').on('click', function(e, li) {
        templateObject.setAccountSelect(e);
    });
    $('.transactionTypes').on('click', function(e, li) {
        setPaymentMethodSelect(e);
    });

    function setEmployeeSelect(e) {
        var $earch = $(e.target);
        var offset = $earch.offset();
        var employeeName = e.target.value || '';

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $earch.attr('data-id', '');
            $('#employeeListModal').modal('toggle');
            setTimeout(function () {
                $('#tblEmployeelist_filter .form-control-sm').focus();
                $('#tblEmployeelist_filter .form-control-sm').val('');
                $('#tblEmployeelist_filter .form-control-sm').trigger("input");
                var datatable = $('#tblEmployeelist').DataTable();
                datatable.draw();
                $('#tblEmployeelist_filter .form-control-sm').trigger("input");
            }, 500);
        } else {
            if (employeeName.replace(/\s/g, '') != '') {    // edit employee
                let editId = $('#viewReceiptModal .employees').attr('data-id');

                getVS1Data('TEmployee').then(function (dataObject) {

                    if (dataObject.length == 0) {
                        sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
                            addVS1Data('TEmployee', JSON.stringify(data));
                            for (let i = 0; i < data.temployee.length; i++) {
                                if (data.temployee[i].fields.ID == editId) {
                                    showEditEmployeeView(data.temployee[i].fields);
                                }
                            }
                        }).catch(function (err) {

                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.temployee;

                        for (let i = 0; i < useData.length; i++) {
                            if (useData[i].fields.ID == editId) {
                                showEditEmployeeView(useData[i].fields);
                            }
                        }
                    }
                }).catch(function (err) {
                    sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function (data) {
                        addVS1Data('TEmployee', JSON.stringify(data));
                        for (let i = 0; i < data.temployee.length; i++) {
                            if (data.temployee[i].fields.ID == editId) {
                                showEditEmployeeView(data.temployee[i].fields);
                            }
                        }
                    }).catch(function (err) {

                    });
                });
            } else {
                $('#employeeListModal').modal('toggle');
            }
        }
    }
    function showEditEmployeeView(data) {
        $('.fullScreenSpin').css('display', 'none');
        $('#add-customer-title').text('Edit Customer');
        let popCustomerID = data.ID || '';
        let popCustomerName = data.EmployeeName || '';
        let popCustomerEmail = data.Email || '';
        let popCustomerTitle = data.Title || '';
        let popCustomerFirstName = data.FirstName || '';
        let popCustomerMiddleName = data.MiddleName || '';
        let popCustomerLastName = data.LastName || '';
        let popCustomerPhone = data.Phone || '';
        let popCustomerMobile = data.Mobile || '';
        let popCustomerFaxnumber = data.Faxnumber || '';
        let popCustomerSkypeName = data.SkypeName || '';
        let popCustomerURL = data.URL || '';
        let popCustomerStreet = data.Street || '';
        let popCustomerStreet2 = data.Street2 || '';
        let popCustomerState = data.State || '';
        let popCustomerPostcode = data.Postcode || '';
        let popCustomerCountry = data.Country || LoggedCountry;
        let popCustomercustfield1 = data.CustFld1 || '';
        let popCustomercustfield2 = data.CustFld2 || '';
        let popCustomercustfield3 = data.CustFld3 || '';
        let popCustomercustfield4 = data.CustFld4 || '';
        let popCustomernotes = data.Notes || '';
        let popCustomerpreferedpayment = data.PaymentMethodName || '';
        let popGender = data.Sex == "F" ? "Female" : data.Sex == "M" ? "Male" : "";

        //$('#edtCustomerCompany').attr('readonly', true);
        $('#edtCustomerCompany').val(popCustomerName);
        $('#edtEmployeePOPID').val(popCustomerID);
        $('#edtEmailAddress').val(popCustomerEmail);
        $('#edtTitle').val(popCustomerTitle);
        $('#edtFirstName').val(popCustomerFirstName);
        $('#edtMiddleName').val(popCustomerMiddleName);
        $('#edtLastName').val(popCustomerLastName);
        $('#edtPhone').val(popCustomerPhone);
        $('#edtMobile').val(popCustomerMobile);
        $('#edtFax').val(popCustomerFaxnumber);
        $('#edtSkype').val(popCustomerSkypeName);
        $('#edtCustomerWebsite').val(popCustomerURL);
        $('#edtAddress').val(popCustomerStreet);
        $('#edtCity').val(popCustomerStreet2);
        $('#edtState').val(popCustomerState);
        $('#edtPostalCode').val(popCustomerPostcode);
        $('#sedtCountry').val(popCustomerCountry);
        $('#txaNotes').val(popCustomernotes);
        $('#sltPreferedPayment').val(popCustomerpreferedpayment);
        $('#edtCustomeField1').val(popCustomercustfield1);
        $('#edtCustomeField2').val(popCustomercustfield2);
        $('#edtCustomeField3').val(popCustomercustfield3);
        $('#edtCustomeField4').val(popCustomercustfield4);
        $('#edtGender').val(popGender);

        setTimeout(function () {
            $('#addEmployeeModal').modal('show');
        }, 200);
    }

    templateObject.setSupplierSelect = function (e) {
        var $earch = $(e.target);
        var offset = $earch.offset();
        $('#edtSupplierPOPID').val('');
        var supplierDataName = e.target.value || '';
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $earch.attr('data-id', '');
            $('#supplierListModal').modal();
            setTimeout(function() {
                $('#tblSupplierlist_filter .form-control-sm').focus();
                $('#tblSupplierlist_filter .form-control-sm').val('');
                $('#tblSupplierlist_filter .form-control-sm').trigger("input");
                var datatable = $('#tblSupplierlist').DataTable();
                datatable.draw();
                $('#tblSupplierlist_filter .form-control-sm').trigger("input");
            }, 500);
        } else {
            if (supplierDataName.replace(/\s/g, '') != '') {
                getVS1Data('TSupplierVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getOneSupplierDataExByName(supplierDataName).then(function(data) {
                            showEditSupplierView(data.tsuppliervs1[0].fields);
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        var added = false;
                        for (let i = 0; i < data.tsuppliervs1.length; i++) {
                            if ((data.tsuppliervs1[i].fields.ClientName) === supplierDataName) {
                                added = true;
                                showEditSupplierView(data.tsuppliervs1[i].fields);
                            }
                        }

                        if (!added) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getOneSupplierDataExByName(supplierDataName).then(function(data) {
                                showEditSupplierView(data.tsuppliervs1[0].fields);
                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                    }
                }).catch(function(err) {
                    sideBarService.getOneSupplierDataExByName(supplierDataName).then(function(data) {
                        showEditSupplierView(data.tsuppliervs1[0].fields);
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });
                });
            } else {
                $('#supplierListModal').modal();
                setTimeout(function() {
                    $('#tblSupplierlist_filter .form-control-sm').focus();
                    $('#tblSupplierlist_filter .form-control-sm').val('');
                    $('#tblSupplierlist_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblSupplierlist').DataTable();
                    datatable.draw();
                    $('#tblSupplierlist_filter .form-control-sm').trigger("input");
                }, 500);
            }
        }
    }
    function showEditSupplierView(data) {
        $('.fullScreenSpin').css('display', 'none');

        $('#add-supplier-title').text('Edit Supplier');
        let popSupplierID = data.ID || '';
        let popSupplierName = data.ClientName || '';
        let popSupplierEmail = data.Email || '';
        let popSupplierTitle = data.Title || '';
        let popSupplierFirstName = data.FirstName || '';
        let popSupplierMiddleName = data.CUSTFLD10 || '';
        let popSupplierLastName = data.LastName || '';
        let popSuppliertfn = '' || '';
        let popSupplierPhone = data.Phone || '';
        let popSupplierMobile = data.Mobile || '';
        let popSupplierFaxnumber = data.Faxnumber || '';
        let popSupplierSkypeName = data.SkypeName || '';
        let popSupplierURL = data.URL || '';
        let popSupplierStreet = data.Street || '';
        let popSupplierStreet2 = data.Street2 || '';
        let popSupplierState = data.State || '';
        let popSupplierPostcode = data.Postcode || '';
        let popSupplierCountry = data.Country || LoggedCountry;
        let popSupplierbillingaddress = data.BillStreet || '';
        let popSupplierbcity = data.BillStreet2 || '';
        let popSupplierbstate = data.BillState || '';
        let popSupplierbpostalcode = data.BillPostcode || '';
        let popSupplierbcountry = data.Billcountry || LoggedCountry;
        let popSuppliercustfield1 = data.CUSTFLD1 || '';
        let popSuppliercustfield2 = data.CUSTFLD2 || '';
        let popSuppliercustfield3 = data.CUSTFLD3 || '';
        let popSuppliercustfield4 = data.CUSTFLD4 || '';
        let popSuppliernotes = data.Notes || '';
        let popSupplierpreferedpayment = data.PaymentMethodName || '';
        let popSupplierterms = data.TermsName || '';
        let popSupplierdeliverymethod = data.ShippingMethodName || '';
        let popSupplieraccountnumber = data.ClientNo || '';
        let popSupplierisContractor = data.Contractor || false;
        let popSupplierissupplier = data.IsSupplier || false;
        let popSupplieriscustomer = data.IsCustomer || false;

        $('#edtSupplierCompany').val(popSupplierName);
        $('#edtSupplierPOPID').val(popSupplierID);
        $('#edtSupplierCompanyEmail').val(popSupplierEmail);
        $('#edtSupplierTitle').val(popSupplierTitle);
        $('#edtSupplierFirstName').val(popSupplierFirstName);
        $('#edtSupplierMiddleName').val(popSupplierMiddleName);
        $('#edtSupplierLastName').val(popSupplierLastName);
        $('#edtSupplierPhone').val(popSupplierPhone);
        $('#edtSupplierMobile').val(popSupplierMobile);
        $('#edtSupplierFax').val(popSupplierFaxnumber);
        $('#edtSupplierSkypeID').val(popSupplierSkypeName);
        $('#edtSupplierWebsite').val(popSupplierURL);
        $('#edtSupplierShippingAddress').val(popSupplierStreet);
        $('#edtSupplierShippingCity').val(popSupplierStreet2);
        $('#edtSupplierShippingState').val(popSupplierState);
        $('#edtSupplierShippingZIP').val(popSupplierPostcode);
        $('#sedtCountry').val(popSupplierCountry);
        $('#txaNotes').val(popSuppliernotes);
        $('#sltPreferedPayment').val(popSupplierpreferedpayment);
        $('#sltTerms').val(popSupplierterms);
        $('#suppAccountNo').val(popSupplieraccountnumber);
        $('#edtCustomeField1').val(popSuppliercustfield1);
        $('#edtCustomeField2').val(popSuppliercustfield2);
        $('#edtCustomeField3').val(popSuppliercustfield3);
        $('#edtCustomeField4').val(popSuppliercustfield4);

        setTimeout(function() {
            $('#addSupplierModal').modal('show');
        }, 200);
    }

    function setCurrencySelect(e) {
        var $earch = $(e.target);
        var offset = $earch.offset();
        var currencyDataName = e.target.value || '';

        $('#edtCurrencyID').val('');
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $earch.attr('data-id', '');
            $('#currencyModal').modal('toggle');
        } else {
            if (currencyDataName.replace(/\s/g, '') != '') {
                $('#add-currency-title').text('Edit Currency');
                $('#sedtCountry').prop('readonly', true);
                getVS1Data('TCurrency').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getCurrencies().then(function(data) {
                            for (let i in data.tcurrency) {
                                if (data.tcurrency[i].Code === currencyDataName) {
                                    showEditCurrencyView(data.tcurrency[i]);
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newCurrencyModal').modal('toggle');
                                $('#sedtCountry').attr('readonly', true);
                            }, 200);
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tcurrency;
                        for (let i = 0; i < data.tcurrency.length; i++) {
                            if (data.tcurrency[i].Code === currencyDataName) {
                                showEditCurrencyView(data.tcurrency[i]);
                            }
                        }
                        setTimeout(function() {
                            $('.fullScreenSpin').css('display', 'none');
                            $('#newCurrencyModal').modal('toggle');
                        }, 200);
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'inline-block');
                    sideBarService.getCurrencies().then(function(data) {
                        for (let i in data.tcurrency) {
                            if (data.tcurrency[i].Code === currencyDataName) {
                                showEditCurrencyView(data.tcurrency[i]);
                            }
                        }
                        setTimeout(function() {
                            $('.fullScreenSpin').css('display', 'none');
                            $('#newCurrencyModal').modal('toggle');
                            $('#sedtCountry').attr('readonly', true);
                        }, 200);
                    });
                });

            } else {
                $('#currencyModal').modal();
                setTimeout(function() {
                    $('#tblCurrencyPopList_filter .form-control-sm').focus();
                    $('#tblCurrencyPopList_filter .form-control-sm').val('');
                    $('#tblCurrencyPopList_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblCurrencyPopList').DataTable();
                    datatable.draw();
                    $('#tblCurrencyPopList_filter .form-control-sm').trigger("input");
                }, 500);
            }
        }
    }
    function showEditCurrencyView(data) {
        $('#edtCurrencyID').val(data.Id);
        setTimeout(function() {
            $('#sedtCountry').val(data.Country);
        }, 200);
        //$('#sedtCountry').val(data.Country);
        // $('#currencyCode').val(currencyDataName);
        $('#currencySymbol').val(data.CurrencySymbol);
        $('#edtCurrencyName').val(data.Currency);
        $('#edtCurrencyDesc').val(data.CurrencyDesc);
        $('#edtBuyRate').val(data.BuyRate);
        $('#edtSellRate').val(data.SellRate);
    }

    templateObject.setAccountSelect = function(e) {
        var $earch = $(e.target);
        var offset = $earch.offset();
        var accountDataName = e.target.value || '';

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $earch.attr('data-id', '');
            $('#accountListModal').modal('toggle');
            setTimeout(function() {
                $('#tblAccount_filter .form-control-sm').focus();
                $('#tblAccount_filter .form-control-sm').val('');
                $('#tblAccount_filter .form-control-sm').trigger("input");

                var datatable = $('#tblAccount').DataTable();
                datatable.draw();
                $('#tblAccount_filter .form-control-sm').trigger("input");

            }, 500);
        } else {
            if (accountDataName.replace(/\s/g, '') != '') {    // edit employee
                getVS1Data('TAccountVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        accountService.getOneAccountByName(accountDataName).then(function(data) {
                            $('#add-account-title').text('Edit Account Details');
                            $('#edtAccountName').attr('readonly', true);
                            $('#sltAccountType').attr('readonly', true);
                            $('#sltAccountType').attr('disabled', 'disabled');

                            showEditAccountView(data.taccountvs1[0]);

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.taccountvs1;
                        var added = false;
                        $('#add-account-title').text('Edit Account Details');
                        $('#edtAccountName').attr('readonly', true);
                        $('#sltAccountType').attr('readonly', true);
                        $('#sltAccountType').attr('disabled', 'disabled');
                        for (let a = 0; a < data.taccountvs1.length; a++) {

                            if ((data.taccountvs1[a].fields.AccountName) === accountDataName) {
                                added = true;

                                showEditAccountView(data.taccountvs1[a]);
                            }
                        }
                        if (!added) {
                            accountService.getOneAccountByName(accountDataName).then(function(data) {
                              $('#add-account-title').text('Edit Account Details');
                              $('#edtAccountName').attr('readonly', true);
                              $('#sltAccountType').attr('readonly', true);
                              $('#sltAccountType').attr('disabled', 'disabled');

                              showEditAccountView(data.taccountvs1[0]);

                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }

                    }
                }).catch(function(err) {
                    accountService.getOneAccountByName(accountDataName).then(function(data) {
                      let lineItems = [];
                      let lineItemObj = {};
                      let fullAccountTypeName = '';
                      let accBalance = '';
                      $('#add-account-title').text('Edit Account Details');
                      $('#edtAccountName').attr('readonly', true);
                      $('#sltAccountType').attr('readonly', true);
                      $('#sltAccountType').attr('disabled', 'disabled');

                      showEditAccountView(data.taccountvs1[0]);

                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });

                });
                $('#addAccountModal').modal('toggle');

            } else {
                $('#accountListModal').modal('toggle');
                var targetID = $(event.target).closest('tr').attr('id');
                $('#selectLineID').val(targetID);
                setTimeout(function() {
                    $('#tblAccount_filter .form-control-sm').focus();
                    $('#tblAccount_filter .form-control-sm').val('');
                    $('#tblAccount_filter .form-control-sm').trigger("input");

                    var datatable = $('#tblInventory').DataTable();
                    datatable.draw();
                    $('#tblAccount_filter .form-control-sm').trigger("input");

                }, 500);
            }
        }
    }
    function showEditAccountView(data) {
        $('.fullScreenSpin').css('display', 'none');
        var accountid = data.fields.ID || '';
        var accounttype = data.fields.AccountTypeName || '';
        var accountname = data.fields.AccountName || '';
        var accountno = data.fields.AccountNumber || '';
        var taxcode = data.fields.TaxCode || '';
        var accountdesc = data.fields.Description || '';
        var bankaccountname = data.fields.BankAccountName || '';
        var bankbsb = data.fields.BSB || '';
        var bankacountno = data.fields.BankAccountNumber || '';

        var swiftCode = data.fields.Extra || '';
        var routingNo = data.BankCode || '';

        var showTrans = data.fields.IsHeader || false;

        var cardnumber = data.fields.CarNumber || '';
        var cardcvc = data.fields.CVC || '';
        var cardexpiry = data.fields.ExpiryDate || '';

        if ((accounttype === "BANK")) {
            $('.isBankAccount').removeClass('isNotBankAccount');
            $('.isCreditAccount').addClass('isNotCreditAccount');
        } else if ((accounttype === "CCARD")) {
            $('.isCreditAccount').removeClass('isNotCreditAccount');
            $('.isBankAccount').addClass('isNotBankAccount');
        } else {
            $('.isBankAccount').addClass('isNotBankAccount');
            $('.isCreditAccount').addClass('isNotCreditAccount');
        }

        $('#edtAccountID').val(accountid);
        $('#sltAccountType').val(accounttype);
        $('#sltAccountType').append('<option value="' + accounttype + '" selected="selected">' + accounttype + '</option>');
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

        if (showTrans == 'true') {
            $('.showOnTransactions').prop('checked', true);
        } else {
            $('.showOnTransactions').prop('checked', false);
        }

        setTimeout(function() {
            $('#addNewAccount').modal('show');
        }, 500);
    }

    function setPaymentMethodSelect(e) {
        var $earch = $(e.target);
        var offset = $earch.offset();

        var paymentDataName = e.target.value || '';
        $('#edtPaymentMethodID').val('');
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $earch.attr('data-id', '');
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
    }

    $("#date-input,#dateTo,#dateFrom,.dtReceiptDate").datepicker({
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

    templateObject.setTimeFilter = function(option) {

        var startDate;
        var endDate = moment().format("DD/MM/YYYY");

        if (option == 'lastMonth') {
            startDate = moment().subtract(1, 'months').format("DD/MM/YYYY");
        } else if (option == 'lastQuarter') {
            startDate = moment().subtract(1, 'quarter').format("DD/MM/YYYY");
        } else if (option == 'last12Months') {
            startDate = moment().subtract(12, 'months').format("DD/MM/YYYY");
        } else if (option == 'ignoreDate') {
            startDate = '';
            endDate = '';
        }
        $('#dateFrom').val(startDate);
        $('#dateTo').val(endDate);

        $('#dateFrom').trigger('change');

    }
    templateObject.setMergeTimeFilter = function(option) {

        var startDate;
        var endDate = moment().format("DD/MM/YYYY");

        if (option == 'lastMonthMerge') {
            startDate = moment().subtract(1, 'months').format("DD/MM/YYYY");
        } else if (option == 'lastQuarterMerge') {
            startDate = moment().subtract(1, 'quarter').format("DD/MM/YYYY");
        } else if (option == 'last12MonthsMerge') {
            startDate = moment().subtract(12, 'months').format("DD/MM/YYYY");
        } else if (option == 'ignoreDateMerge') {
            startDate = '';
            endDate = '';
        }
        $('#dateFromMerge').val(startDate);
        $('#dateToMerge').val(endDate);

        $('#dateFromMerge').trigger('change');

    }

    $.fn.dataTableExt.afnFiltering.push(
        function( settings, data, dataIndex ) {
            if (settings.nTable.id === 'tblReceiptList') {
                var min = $('#dateFrom').val();
                var max = $('#dateTo').val();
                let startDate = moment(min, 'DD/MM/YYYY');
                let endDate = moment(max, 'DD/MM/YYYY');
                var date = moment(data[1], 'DD/MM/YYYY');
                if (
                    ( min === '' && max === '' ) ||
                    ( min === '' && date <= endDate ) ||
                    ( startDate <= date   && max === null ) ||
                    ( startDate <= date   && date <= endDate )
                ) {
                    return true;
                }
                return false;
            } else if (settings.nTable.id === 'tblMerge') {
                var min = $('#dateFromMerge').val();
                var max = $('#dateToMerge').val();
                let startDate = moment(min, 'DD/MM/YYYY');
                let endDate = moment(max, 'DD/MM/YYYY');
                var date = moment(data[1], 'DD/MM/YYYY');

                let merchantFilter = $('#mergeModal .merchants').val();
                let accountFilter = $('#mergeModal .chart-accounts').val();

                if (( min === '' && max === '' ) ||
                    ( min === '' && date <= endDate ) ||
                    ( startDate <= date && max === null ) ||
                    ( startDate <= date && date <= endDate )) {
                    if ((merchantFilter == '' || merchantFilter == data[2]) && (accountFilter == '' || accountFilter == data[4])) {
                        return true;
                    }
                    return false;
                }
                return false;
            } else {
                return true;
            }
        }
    );

    setTimeout(function () {
        //$.fn.dataTable.moment('DD/MM/YY');
        $('#tblSplitExpense').DataTable({
            "columns": [{
                    'data': 'DateTime'
                },
                {
                    'data': 'AccountName'
                },
                {
                    'data': 'AmountInc'
                },
                {
                    'data': null
                },
            ],
            columnDefs: [{
                type: 'date',
                targets: 0,
                width: '140px',
                class: "colReceiptDate",
                render: function(data, type, row, meta) {
                    let index = meta.row + meta.settings._iDisplayStart;
                    let html = '<div class="input-group date" style="cursor: pointer;width: 140px;">' +
                                    '<input type="text" class="form-control dtSplitReceipt" name="dtSplitReceipt" value="' + data + '">' +
                                    '<div class="input-group-addon">' +
                                        '<span class="glyphicon glyphicon-th" style="cursor: pointer;"></span>' +
                                    '</div>' +
                                '</div>';
                    return html;
                }
            }, {
                targets: 1,
                class: "colReceiptAccount",
                render: function(data, type, row, meta) {
                    let index = meta.row + meta.settings._iDisplayStart;
                    let html = '<select type="search" id="splitAccount-' + index + '" class="form-control" style="background-color:rgb(255, 255, 255);cursor: pointer;" ></select>';
                    return html;
                }
            }, {
                targets: 2,
                class: "colReceiptAmount",
                width: '20%',
                render: function(data, type, row, meta) {
                    let index = meta.row + meta.settings._iDisplayStart;
                    return '<input id="splitAmount-' + index + '" class="form-control" style="text-align: right" value="$' + data + '" />';
                }
            }, {
                orderable: false,
                targets: 3,
                class: "colDelete",
                width: '3%',
                render: function(data, type, row, meta) {
                    let index = meta.row + meta.settings._iDisplayStart;
                    return '<span class="table-remove btnRemove"><button id="splitRemove-' + index + '" type="button" class="btn btn-danger btn-rounded btn-sm my-0" autocomplete="off"><i class="fa fa-remove"></i></button></span>';
                }
            }, ],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f>>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "Awaiting Customer Payments List - " + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible:not(.chkBox)',
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
                title: 'Supplier Payment',
                filename: "Awaiting Customer Payments List - " + moment().format(),
                exportOptions: {
                    columns: ':visible:not(.chkBox)',
                    stripHtml: false
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
                fixedColumnsLeft: 0
            },
            pageLength: initialReportDatatableLoad,
            "bLengthChange": false,
            info: true,
            responsive: true,
            autoWidth: false,
            "order": [
                [1, "desc"]
            ],
            action: function () {
                // $('#tblSplitExpense').DataTable().ajax.reload();
            },
            "fnInitComplete": function () {
                $("<button class='btn btn-primary btnRefresh' type='button' id='btnRefreshSplit' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblSplitExpense_filter");
                // $('.myvarFilterFormSplit').appendTo(".colDateFilterSplit");
            }
        }).on('page', function () {
            setTimeout(function () {
                MakeNegative();
            }, 100);
        }).on('column-reorder', function () { }).on('length.dt', function (e, settings, len) {
            setTimeout(function () {
                MakeNegative();
            }, 100);
        });
    }, 0);

    $('.imageParent')
        // tile mouse actions
        .on('mouseover', function () {
            $(this).children('.receiptPhoto').css({
                'transform': 'scale(' + $(this).attr('data-scale') + ')'
            });
        })
        .on('mouseout', function () {
            $(this).children('.receiptPhoto').css({
                'transform': 'scale(1)'
            });
        })
        .on('mousemove', function (e) {
            $(this).children('.receiptPhoto').css({
                'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 + '%'
            });
        })
        // tiles set up
        .each(function () {
            $(this)
                // add a photo container
                .append('<div class="receiptPhoto"></div>')
                // set up a background image for each tile based on data-image attribute
                // .children('.receiptPhoto').css({
                //     'background-image': 'url(' + $(this).attr('data-image') + ')'
                // });
        });
    $('.imageParentMerge')
        // tile mouse actions
        .on('mouseover', function () {
            $(this).children('.receiptPhotoMerge').css({
                'transform': 'scale(' + $(this).attr('data-scale') + ')'
            });
        })
        .on('mouseout', function () {
            $(this).children('.receiptPhotoMerge').css({
                'transform': 'scale(1)'
            });
        })
        .on('mousemove', function (e) {
            $(this).children('.receiptPhotoMerge').css({
                'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 + '%'
            });
        })
        // tiles set up
        .each(function () {
            $(this)
                // add a photo container
                .append('<div class="receiptPhotoMerge"></div>')
                // set up a background image for each tile based on data-image attribute
                // .children('.receiptPhoto').css({
                //     'background-image': 'url(' + $(this).attr('data-image') + ')'
                // });
        });

    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "extract-date-pre": function(date) {
            date = date.split('/');
            return Date.parse(date[1] + '/' + date[0] + '/' + date[2])
        },
        "extract-date-asc": function(a, b) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        },
        "extract-date-desc": function(a, b) {
            return ((a < b) ? 1 : ((a > b) ? -1 : 0));
        }
    });

    templateObject.getSuppliers = function () {
        accountService.getSupplierVS1().then(function (data) {
            let lineItems = [];
            for (let i in data.tsuppliervs1) {
                let lineItem = {
                    supplierid: data.tsuppliervs1[i].Id || ' ',
                    suppliername: data.tsuppliervs1[i].ClientName || ' ',
                };
                lineItems.push(lineItem);
            }
            templateObject.suppliers.set(lineItems);
        }).catch(function (err) {

        });
    };
    templateObject.getSuppliers();

    templateObject.getExpenseClaims = function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        //Load Indexdb data
        getVS1Data('TExpenseClaim').then(function (dataObject) {
            if (dataObject.length == 0) { // check if no idexdb
              accountService.getExpenseClaim().then(function (data) {
                 addVS1Data('TExpenseClaim', JSON.stringify(data));
                  let lineItems = [];
                  console.log('expense', data)
                  data.texpenseclaimex.forEach(expense => {
                      if(Object.prototype.toString.call(expense.fields.Lines) === "[object Array]"){
                          expense.fields.Lines.forEach(claim => {
                              let lineItem = claim.fields;
                              lineItem.DateTime = claim.fields.DateTime != '' ? moment(claim.fields.DateTime).format("DD/MM/YYYY") : '';
                              lineItems.push(lineItem);
                          })
                      }else if(Object.prototype.toString.call(expense.fields.Lines) === "[object Object]"){
                          let lineItem = expense.fields.Lines.fields;
                          lineItem.DateTime = lineItem.DateTime != '' ? moment(lineItem.DateTime).format("DD/MM/YYYY") : '';
                          lineItems.push(lineItem);
                      }
                  });

                  templateObject.expenseClaimList.set(lineItems);

                  setTimeout(function () {
                      //$.fn.dataTable.moment('DD/MM/YY');
                      $('#tblReceiptList').DataTable({
                          columnDefs: [{
                              "orderable": false,
                              "targets": 0
                          }, {
                              type: 'extract-date',
                              targets: 1
                          }],
                          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-12 col-md-6 colDateFilter p-0'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                          buttons: [{
                              extend: 'excelHtml5',
                              text: '',
                              download: 'open',
                              className: "btntabletocsv hiddenColumn",
                              filename: "Awaiting Customer Payments List - " + moment().format(),
                              orientation: 'portrait',
                              exportOptions: {
                                  columns: ':visible:not(.chkBox)',
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
                              title: 'Supplier Payment',
                              filename: "Awaiting Customer Payments List - " + moment().format(),
                              exportOptions: {
                                  columns: ':visible:not(.chkBox)',
                                  stripHtml: false
                              }
                          }],
                          select: true,
                          destroy: true,
                          colReorder: true,
                          colReorder: {
                              fixedColumnsLeft: 0
                          },
                          pageLength: initialReportDatatableLoad,
                          "bLengthChange": false,
                          info: true,
                          responsive: true,
                          "order": [
                              [1, "desc"]
                          ],
                          action: function () {
                              // $('#tblReceiptList').DataTable().ajax.reload();
                          },
                          "fnInitComplete": function () {
                              $("<button class='btn btn-primary btnRefresh' type='button' id='btnRefresh' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblReceiptList_filter");
                              $('.myvarFilterForm').appendTo(".colDateFilter");
                          }
                      }).on('page', function () {
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);

                      }).on('column-reorder', function () { }).on('length.dt', function (e, settings, len) {
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
                      });

                      $('#tblMerge').DataTable({
                        columnDefs: [{
                            orderable: false,
                            targets: 0
                        }, {
                            type: 'extract-date',
                            targets: 1
                        }],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilterMerge'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "Awaiting Customer Payments List - " + moment().format(),
                            orientation: 'portrait',
                            exportOptions: {
                                columns: ':visible:not(.chkBoxMerge)',
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
                            title: 'Supplier Payment',
                            filename: "Awaiting Customer Payments List - " + moment().format(),
                            exportOptions: {
                                columns: ':visible:not(.chkBoxMerge)',
                                stripHtml: false
                            }
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // colReorder: {
                        //     fixedColumnsLeft: 0
                        // },
                        pageLength: initialReportDatatableLoad,
                        "bLengthChange": false,
                        info: true,
                        responsive: true,
                        "order": [
                            [1, "desc"]
                        ],
                        action: function () {
                            $('#tblMerge').DataTable().ajax.reload();
                        },
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnRefresh' type='button' id='btnRefreshMerge' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblMerge_filter");
                            $('.myvarFilterFormMerge').appendTo(".colDateFilterMerge");
                        }
                      }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        // let draftRecord = templateObject.datatablerecords.get();
                        // templateObject.datatablerecords.set(draftRecord);
                      }).on('column-reorder', function () { }).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                      });

                      $('.fullScreenSpin').css('display', 'none');

                      templateObject.setTimeFilter('lastMonth');
                      templateObject.setMergeTimeFilter('lastMonthMerge');
                  }, 0);

                  // $('.dataTables_info').html('Showing 1 to '+ lineItems.length + ' of ' + lineItems.length + ' entries');
              });
            } else { //else load data from indexdb
                let data = JSON.parse(dataObject[0].data);
                let lineItems = [];
                data.texpenseclaimex.forEach(expense => {
                    if(Object.prototype.toString.call(expense.fields.Lines) === "[object Array]"){
                        expense.fields.Lines.forEach(claim => {
                            let lineItem = claim.fields;
                            lineItem.DateTime = claim.fields.DateTime != '' ? moment(claim.fields.DateTime).format("DD/MM/YYYY") : '';
                            lineItems.push(lineItem);
                        })
                    }else if(Object.prototype.toString.call(expense.fields.Lines) === "[object Object]"){
                        let lineItem = expense.fields.Lines.fields;
                        lineItem.DateTime = lineItem.DateTime != '' ? moment(lineItem.DateTime).format("DD/MM/YYYY") : '';
                        lineItems.push(lineItem);
                    }
                });

                templateObject.expenseClaimList.set(lineItems);

                setTimeout(function () {
                    //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblReceiptList').DataTable({
                        columnDefs: [{
                            "orderable": false,
                            "targets": 0
                        }, {
                            type: 'extract-date',
                            targets: 1
                        }],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-12 col-md-6 colDateFilter p-0'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "Awaiting Customer Payments List - " + moment().format(),
                            orientation: 'portrait',
                            exportOptions: {
                                columns: ':visible:not(.chkBox)',
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
                            title: 'Supplier Payment',
                            filename: "Awaiting Customer Payments List - " + moment().format(),
                            exportOptions: {
                                columns: ':visible:not(.chkBox)',
                                stripHtml: false
                            }
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        colReorder: {
                            fixedColumnsLeft: 0
                        },
                        pageLength: initialReportDatatableLoad,
                        "bLengthChange": false,
                        info: true,
                        responsive: true,
                        "order": [
                            [1, "desc"]
                        ],
                        action: function () {
                            // $('#tblReceiptList').DataTable().ajax.reload();
                        },
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnRefresh' type='button' id='btnRefresh' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblReceiptList_filter");
                            $('.myvarFilterForm').appendTo(".colDateFilter");
                        }
                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);

                    }).on('column-reorder', function () { }).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });

                    $('#tblMerge').DataTable({
                        columnDefs: [{
                            orderable: false,
                            targets: 0
                        }, {
                            type: 'extract-date',
                            targets: 1
                        }],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilterMerge'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "Awaiting Customer Payments List - " + moment().format(),
                            orientation: 'portrait',
                            exportOptions: {
                                columns: ':visible:not(.chkBoxMerge)',
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
                            title: 'Supplier Payment',
                            filename: "Awaiting Customer Payments List - " + moment().format(),
                            exportOptions: {
                                columns: ':visible:not(.chkBoxMerge)',
                                stripHtml: false
                            }
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // colReorder: {
                        //     fixedColumnsLeft: 0
                        // },
                        pageLength: initialReportDatatableLoad,
                        "bLengthChange": false,
                        info: true,
                        responsive: true,
                        "order": [
                            [1, "desc"]
                        ],
                        action: function () {
                            $('#tblMerge').DataTable().ajax.reload();
                        },
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnRefresh' type='button' id='btnRefreshMerge' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblMerge_filter");
                            $('.myvarFilterFormMerge').appendTo(".colDateFilterMerge");
                        }
                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        // let draftRecord = templateObject.datatablerecords.get();
                        // templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () { }).on('length.dt', function (e, settings, len) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });


                    $('.fullScreenSpin').css('display', 'none');

                    templateObject.setTimeFilter('lastMonth');
                    templateObject.setMergeTimeFilter('lastMonthMerge');

                }, 0);
              }
        }).catch(function (err) {
          $('.fullScreenSpin').css('display', 'none');
         });

    }

    templateObject.getExpenseClaims();

    templateObject.getOCRResultFromImage = function(imageData, fileName) {
        $('.fullScreenSpin').css('display', 'inline-block');
        ocrService.POST(imageData, fileName).then(function(data) {

            $('.fullScreenSpin').css('display', 'none');
            let from = $('#employeeListModal').attr('data-from');

            paymenttype = data.payment_type;
            transactionTypeName = "Cash";
            if (paymenttype == "master_card") {
                transactionTypeName = "Master Card";
            } else if (paymenttype == "credit_card") {
                transactionTypeName = "Credit Card";
            } else if (paymenttype == "visa") {
                transactionTypeName = "VISA";
            }

            let loggedUserName = Session.get('mySessionEmployee');
            let loggedUserId = Session.get('mySessionEmployeeLoggedID');
            let currency = Session.get('ERPCountryAbbr');

            var parentElement;
            if (from == 'ViewReceipt') {
                parentElement = "#viewReceiptModal";
            } else if (from == 'NavExpense') {
                parentElement = "#nav-expense";
            } else if (from == 'NavTime') {
                parentElement = "#nav-time";
            }

            console.log('vendor', data.vendor);

            if (!data.vendor.name) {
                isExistSupplier = false;
                templateObject.suppliers.get().forEach(supplier => {
                    if (data.vendor.name == supplier.suupliername) {
                        isExistSupplier = true;
                        $(parentElement + ' .merchants').val(data.vendor.name);
                        $(parentElement + ' .merchants').attr('data-id', supplier.supplierid);
                    }
                })

                if (!isExistSupplier) {
                    // create supplier with vendor data
                    objDetails = {
                        type: "TSupplier",
                        fields:
                        {
                            ClientName: data.vendor.name,
                            FirstName: data.vendor.name,
                            LastName: '',
                            Phone: data.vendor.phone_number,
                            Mobile: '',
                            Email: data.vendor.email,
                            SkypeName: '',
                            Street: '',
                            Street2: '',
                            Suburb: '',
                            State: '',
                            PostCode: '',
                            Country: '',

                            BillStreet: '',
                            BillStreet2: '',
                            BillState: '',
                            BillPostCode: '',
                            Billcountry: '',
                            PublishOnVS1: true
                        }
                    };

                    contactService.saveSupplier(objDetails).then(function (supplier) {
                        console.log('supplier save', supplier);
                        //$('.fullScreenSpin').css('display','none');
                        //  Meteor._reload.reload();
                        $(parentElement + ' .merchants').val(data.vendor.name);
                        $(parentElement + ' .merchants').attr('data-id', supplier.fields.ID);

                        var suppliers = templateObject.suppliers.get();
                        suppliers.push({
                            supplierid: supplier.fields.ID,
                            suppliername: data.vendor.name,
                        });
                        templateObject.suppliers.set(suppliers);

                    }).catch(function (err) {
                        //$('.fullScreenSpin').css('display','none');
                        console.log('supplier svae error', err);
                    });
                }
            }

            $(parentElement + ' .employees').attr('data-id', loggedUserId);
            $(parentElement + ' .employees').val(loggedUserName);
            $(parentElement + ' .currencies').val(currency);
            $(parentElement + ' .dtReceiptDate').datepicker('setDate', new Date(data.date));
            $(parentElement + ' .edtTotal').val('$' + data.total);
            $(parentElement + ' .transactionTypes').val(transactionTypeName);

        }).catch(function (err) {
            console.log('ocrresult err', err);
            $('.fullScreenSpin').css('display', 'none');
        });
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

    templateObject.refreshSplitTable = function (rows) {
        $splitDataTable = $('#tblSplitExpense').DataTable();
        $splitDataTable.clear();
        $splitDataTable.rows.add(rows);
        $splitDataTable.columns.adjust().draw();

        $(".dtSplitReceipt").datepicker({
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
        $(".dtSplitReceipt").css('z-index','1600');
        $('.colReceiptAmount').css('vertical-align', 'middle');

        $('select[id^="splitAccount-"]').editableSelect();
        setTimeout(() => {
            for (i = 0; i < rows.length; i++) {
                $('#splitAccount-' + i).attr('data-id', rows[i].AccountId)
                $('#splitAccount-' + i).val(rows[i].AccountName)
            }
        }, 100);
    }
});

Template.receiptsoverview.events({
    'click a#showManuallyCreate, click .btnNewReceipt, click #newReceiptModal #nav-expense-tab': function () {
        $('a.nav-link.active').removeClass('active');
        $('a.nav-link#nav-expense-tab').addClass('active');

        $('#newReceiptModal .tab-pane.show.active').removeClass('show active');
        $('#newReceiptModal .tab-pane#nav-expense').addClass('show active');

        $('#employeeListModal').attr('data-from', 'NavExpense');

        let loggedUserName = Session.get('mySessionEmployee');
        let loggedUserId = Session.get('mySessionEmployeeLoggedID');
        let currency = Session.get('ERPCountryAbbr');
        $('#nav-expense .employees').attr('data-id', loggedUserId);
        $('#nav-expense .employees').val(loggedUserName);
        $('#nav-expense .transactionTypes').attr('data-id', '');
        $('#nav-expense .transactionTypes').val('');
        $('#nav-expense .merchants').attr('data-id', '');
        $('#nav-expense .merchants').val('');
        $('#nav-expense .currencies').attr('data-id', '');
        $('#nav-expense .currencies').val(currency);
        $('#nav-expense .chart-accounts').attr('data-id', '');
        $('#nav-expense .chart-accounts').val('');
        $('#nav-expense .dtReceiptDate').datepicker('setDate', new Date());
        $('#nav-expense .edtTotal').val('');
        $('#nav-expense .swtReiumbursable').attr('checked', false);
        $('#nav-expense #txaDescription').val('');

        $('#nav-expense .receiptPhoto').css('background-image', 'none');
        $('#nav-expense .receiptPhoto').attr('data-name', "");
        $('#nav-expense .img-placeholder').css('opacity', 1);
    },
    'click a#showMultiple, click #newReceiptModal #nav-multiple-tab': function () {
        $('a.nav-link.active').removeClass('active');
        $('a.nav-link#nav-multiple-tab').addClass('active');

        $('#newReceiptModal .tab-pane.show.active').removeClass('show active');
        $('#newReceiptModal .tab-pane#nav-multiple').addClass('show active');

        $('.dtMultiple').val(moment().format('DD/MM/YYYY'));
        $('.multipleAmount').val('$0');
        $('.multipleMerchant').val('');
        $('.multipleMerchant').attr('data-id', 0);
        $('.multipleAccount').val('');
        $('.multipleAccount').attr('data-id', 0);
        $('.multipleDescription').val('');
        $('.multipleAttach').attr('data-image', '');
    },
    'click a#showTime, click #newReceiptModal #nav-time-tab': function () {
        $('a.nav-link.active').removeClass('active');
        $('a.nav-link#nav-time-tab').addClass('active');

        $('#newReceiptModal .tab-pane.show.active').removeClass('show active');
        $('#newReceiptModal .tab-pane#nav-time').addClass('show active');

        $('#employeeListModal').attr('data-from', 'NavTime');

        let loggedUserName = Session.get('mySessionEmployee');
        let loggedUserId = Session.get('mySessionEmployeeLoggedID');
        let currency = Session.get('ERPCountryAbbr');
        $('#nav-time .employees').attr('data-id', loggedUserId);
        $('#nav-time .employees').val(loggedUserName);
        $('#nav-time .transactionTypes').attr('data-id', '');
        $('#nav-time .transactionTypes').val('');
        $('#nav-time .merchants').attr('data-id', '');
        $('#nav-time .merchants').val('');
        $('#nav-time .currencies').attr('data-id', '');
        $('#nav-time .currencies').val(currency);
        $('#nav-time .chart-accounts').attr('data-id', '');
        $('#nav-time .chart-accounts').val('');
        $('#nav-time .dtReceiptDate').datepicker('setDate', new Date());
        $('#nav-time .edtTotal').val('');
        $('#nav-time .swtReiumbursable').attr('checked', false);
        $('#nav-time #txaDescription').val('');

        $('#nav-time .receiptPhoto').css('background-image', "none");
        $('#nav-time .receiptPhoto').attr('data-name', "");
        $('#nav-time .img-placeholder').css('opacity', 1);
    },
    'click #nav-expense .btn-upload': function (event) {
        $('#nav-expense .attachment-upload').trigger('click');
    },
    'click #nav-time .btn-upload': function (event) {
        $('#nav-time .attachment-upload').trigger('click');
    },
    'click #viewReceiptModal .btn-upload': function (event) {
        $('#viewReceiptModal .attachment-upload').trigger('click');
    },

    'change #viewReceiptModal .attachment-upload': function(event) {
        let files = $(event.target)[0].files;
        let imageFile = files[0];
        let template = Template.instance();
        template.base64data(imageFile).then(imageData => {
            $('#viewReceiptModal .receiptPhoto').css('background-image', "url('" + imageData + "')");
            $('#viewReceiptModal .receiptPhoto').attr('data-name', imageFile.name);
            $('#viewReceiptModal .img-placeholder').css('opacity', 0);
            template.getOCRResultFromImage(imageData, imageFile.name);
        })
    },

    'change #nav-expense .attachment-upload': function(event) {
        let files = $(event.target)[0].files;
        let imageFile = files[0];
        console.log('file changed', imageFile);
        let template = Template.instance();
        template.base64data(imageFile).then(imageData => {
            $('#nav-expense .receiptPhoto').css('background-image', "url('" + imageData + "')");
            $('#nav-expense .receiptPhoto').attr('data-name', imageFile.name);
            $('#nav-expense .img-placeholder').css('opacity', 0);
            template.getOCRResultFromImage(imageData, imageFile.name);
        })
    },

    'change #nav-time .attachment-upload': function(event) {
        let files = $(event.target)[0].files;
        let imageFile = files[0];
        console.log('file changed', imageFile);
        let template = Template.instance();
        template.base64data(imageFile).then(imageData => {
            $('#nav-time .receiptPhoto').css('background-image', "url('" + imageData + "')");
            $('#nav-time .receiptPhoto').attr('data-name', imageFile.name);
            $('#nav-time .img-placeholder').css('opacity', 0);
            template.getOCRResultFromImage(imageData, imageFile.name);
        })
    },

    'change #dateFrom, change #dateTo': function (event) {
        var receiptTable = $('#tblReceiptList').DataTable();
        receiptTable.draw();
    },
    'change #dateFromMerge, change #dateToMerge': function (event) {
        var receiptTable = $('#tblMerge').DataTable();
        receiptTable.draw();
    },

    'click #formCheck-All': function (event) {
        if ($(event.target).is(':checked')) {
            $(".chkBox").prop("checked", true);
        } else {
            $(".chkBox").prop("checked", false);
        }
    },
    'click #formCheckMerge-All': function (event) {
        let template = Template.instance();
        if ($(event.target).is(':checked')) {
            $(".chkBoxMerge").prop("checked", true);

            mergeTable = $('#tblMerge').DataTable();
            var lineItems = mergeTable.rows().data();
            template.mergeReceiptRecords.set(lineItems);
        } else {
            $(".chkBoxMerge").prop("checked", false);
            template.mergeReceiptRecords.set([]);
        }
    },
    'click input[id^="formCheckMerge-"]': function (e) {

        let template = Template.instance();
        let itemId = e.target.id.split('-')[1];
        let lineItem = template.expenseClaimList.get().filter(item => item.ID == itemId)[0];

        if ($(e.target).is(':checked')) {
            var mergeReceipts = template.mergeReceiptRecords.get();
            let index = mergeReceipts.findIndex(x => x.ID == itemId);
            if (index === -1) {
                mergeReceipts.push(lineItem);
            }
            template.mergeReceiptRecords.set(mergeReceipts);
        } else {
            var mergeReceipts = template.mergeReceiptRecords.get();
            let index = mergeReceipts.findIndex(x => x.ID == itemId);
            mergeReceipts.splice(index, 1);
            template.mergeReceiptRecords.set(mergeReceipts);
        }
    },

    'click .timeFilter': function (event) {
        let id = event.target.id;
        let template = Template.instance();
        template.setTimeFilter(id);
    },
    'click .timeFilterMerge': function (event) {
        let id = event.target.id;
        let template = Template.instance();
        template.setMergeTimeFilter(id);
    },

    'click #tblReceiptList tbody tr td:not(:first-child)': function (event) {
        let template = Template.instance();
        var selectedId = $(event.target).closest('tr').attr('id');
        let selectedClaim = template.expenseClaimList.get().filter(claim => claim.ID == selectedId)[0];
        template.editExpenseClaim.set(selectedClaim);

        $('#employeeListModal').attr('data-from', 'ViewReceipt');

        $('#viewReceiptModal').modal('toggle');

        $('#viewReceiptModal .employees').val(selectedClaim.EmployeeName);
        $('#viewReceiptModal .employees').attr('data-id', selectedClaim.EmployeeID);
        $('#viewReceiptModal .merchants').val(selectedClaim.SupplierName);
        $('#viewReceiptModal .merchants').attr('data-id', selectedClaim.SupplierID);
        $('#viewReceiptModal .chart-accounts').val(selectedClaim.AccountName);
        $('#viewReceiptModal .chart-accounts').attr('data-id', selectedClaim.AccountId);
        $('#viewReceiptModal .transactionTypes').val(selectedClaim.Paymethod);
        $('#viewReceiptModal .txaDescription').val(selectedClaim.Description);

        if (selectedClaim.Attachments) {
            imageData = selectedClaim.Attachments[0].fields.Description + "," + selectedClaim.Attachments[0].fields.Attachment;
            $('#viewReceiptModal .receiptPhoto').css('background-image', "url('" + imageData + "')");
            $('#viewReceiptModal .receiptPhoto').attr('data-name', selectedClaim.Attachments[0].fields.AttachmentName);
            $('#viewReceiptModal .img-placeholder').css('opacity', 0);
        } else {
            $('#viewReceiptModal .receiptPhoto').css('background-image', "none");
            $('#viewReceiptModal .receiptPhoto').attr('data-name', "");
            $('#viewReceiptModal .img-placeholder').css('opacity', 1);
        }

    },
    'click #tblEmployeelist tbody tr': function (e) {
        let employeeName = $(e.target).closest('tr').find(".colEmployeeName").text() || '';
        let employeeID = $(e.target).closest('tr').find(".colID").text() || '';
        let from = $('#employeeListModal').attr('data-from');

        if (from == 'ViewReceipt') {
            $('#viewReceiptModal .employees').val(employeeName);
            $('#viewReceiptModal .employees').attr('data-id', employeeID);
        } else if (from == 'NavExpense') {
            $('#nav-expense .employees').val(employeeName);
            $('#nav-expense .employees').attr('data-id', employeeID);
        } else if (from == 'NavTime') {
            $('#nav-time .employees').val(employeeName);
            $('#nav-time .employees').attr('data-id', employeeID);
        }
        $('#employeeListModal').modal('toggle');
    },
    'click #tblSupplierlist tbody tr': function (e) {
        let supplierName = $(e.target).closest('tr').find(".colCompany").text() || '';
        let supplierID = $(e.target).closest('tr').find(".colID").text() || '';
        let from = $('#employeeListModal').attr('data-from');

        if (from == 'ViewReceipt') {
            $('#viewReceiptModal .merchants').val(supplierName);
            $('#viewReceiptModal .merchants').attr('data-id', supplierID);
        } else if (from == 'NavExpense') {
            $('#nav-expense .merchants').val(supplierName);
            $('#nav-expense .merchants').attr('data-id', supplierID);
        } else if (from == 'NavTime') {
            $('#nav-time .merchants').val(supplierName);
            $('#nav-time .merchants').attr('data-id', supplierID);
        } else if (from.includes('multipleMerchant-')) {
            $('#' + from).val(supplierName);
            $('#' + from).attr('data-id', supplierID);
        } else if (from == 'MergeModal') {
            $('#mergeModal .merchants').val(supplierName);
            $('#mergeModal .merchants').attr('data-id', supplierID);
            $('#tblMerge').DataTable().draw();
        }
        $('#supplierListModal').modal('toggle');
    },
    'click #tblCurrencyPopList tbody tr': function (e) {
        let currencyName = $(e.target).closest('tr').find(".colCode").text() || '';
        let currencyID = $(e.target).closest('tr').attr('id') || '';
        let from = $('#employeeListModal').attr('data-from');

        if (from == 'ViewReceipt') {
            $('#viewReceiptModal .currencies').val(currencyName);
            $('#viewReceiptModal .currencies').attr('data-id', currencyID);
        } else if (from == 'NavExpense') {
            $('#nav-expense .currencies').val(currencyName);
            $('#nav-expense .currencies').attr('data-id', currencyID);
        } else if (from == 'NavTime') {
            $('#nav-time .currencies').val(currencyName);
            $('#nav-time .currencies').attr('data-id', currencyID);
        }
        $('#currencyModal').modal('toggle');
    },
    'click #tblAccount tbody tr': function (e) {
        let accountName = $(e.target).closest('tr').find(".productName").text() || '';
        let accountID = $(e.target).closest('tr').find(".colAccountID").text() || '';
        let from = $('#employeeListModal').attr('data-from');

        if (from == 'ViewReceipt') {
            $('#viewReceiptModal .chart-accounts').val(accountName);
            $('#viewReceiptModal .chart-accounts').attr('data-id', accountID);
        } else if (from == 'NavExpense') {
            $('#nav-expense .chart-accounts').val(accountName);
            $('#nav-expense .chart-accounts').attr('data-id', accountID);
        } else if (from == 'NavTime') {
            $('#nav-time .chart-accounts').val(accountName);
            $('#nav-time .chart-accounts').attr('data-id', accountID);
        } else if (from.includes('splitAccount-')) {
            $('#' + from).val(accountName);
            $('#' + from).attr('data-id', accountID);

            let index = from.split('-')[1];

            splitDataTable = $('#tblSplitExpense').DataTable();
            rowData = splitDataTable.row(index).data();

            rowData.AccountId = parseInt(accountID);
            rowData.AccountName = accountName;
        } else if (from.includes('multipleAccount-')) {
            $('#' + from).val(accountName);
            $('#' + from).attr('data-id', accountID);
        } else if (from == 'MergeModal') {
            $('#mergeModal .chart-accounts').val(accountName);
            $('#mergeModal .chart-accounts').attr('data-id', accountID);
            $('#tblMerge').DataTable().draw();
        }
        $('#accountListModal').modal('toggle');
    },
    'click #paymentmethodList tbody tr': function (e) {
        let typeName = $(e.target).closest('tr').find(".colName").text() || '';
        let typeID = $(e.target).closest('tr').find("input.chkBox").attr('id') || '';
        let from = $('#employeeListModal').attr('data-from');

        if (from == 'ViewReceipt') {
            $('#viewReceiptModal .transactionTypes').val(typeName);
            $('#viewReceiptModal .transactionTypes').attr('data-id', typeID);
        } else if (from == 'NavExpense') {
            $('#nav-expense .transactionTypes').val(typeName);
            $('#nav-expense .transactionTypes').attr('data-id', typeID);
        } else if (from == 'NavTime') {
            $('#nav-time .transactionTypes').val(typeName);
            $('#nav-time .transactionTypes').attr('data-id', typeID);
        }
        $('#paymentMethodModal').modal('toggle');
    },

    'change .multipleAmount': function(e) {
        var val = e.target.value;
        val = val.replace('$', '');
        e.target.value = '$' + val;
    },
    'change .edtTotal': function(e) {
        var val = e.target.value;
        val = val.replace('$', '');
        e.target.value = '$' + val;
    },
    'change #claimHours': function(e) {
        var val = e.target.value;
        numVal = parseFloat(val) || 0;
        e.target.value = numVal;

        rate = parseFloat($('#claimRate').val().replace('$', '')) || 0;
        $('#nav-time .edtTotal').val('$' + (numVal * rate));
    },
    'change #claimRate': function(e) {
        var val = e.target.value;
        numVal = parseFloat(val.replace('$', '')) || 0;
        e.target.value = '$' + numVal;

        hours = parseFloat($('#claimHours').val()) || 0;
        $('#nav-time .edtTotal').val('$' + (numVal * hours));
    },

    // update receipt record
    'click #viewReceiptModal .btnSave': function (e) {

        imageData = $('#viewReceiptModal .receiptPhoto').css('background-image');
        imageName = $('#viewReceiptModal .receiptPhoto').attr('data-name');

        var attachment;
        if (imageData != 'none') {
            imageData = imageData.split(/"/)[1];
            imageBase64 = imageData.split(',')[1];
            imageDescryption = imageData.split(',')[0];
            attachment = [
                {
                    type: "TAttachment",
                    fields: {
                        Attachment: imageBase64,
                        AttachmentName: imageName,
                        Description: imageDescryption,
                        TableName: "tblexpenseclaimline"
                    }
                }
            ]
        }

        let template = Template.instance();
        let receipt = template.editExpenseClaim.get();

        let employeeId = $('#viewReceiptModal .employees').attr('data-id');
        let employeeName = $('#viewReceiptModal .employees').val()  || ' ';
        let transactionTypeId = $('#viewReceiptModal .transactionTypes').attr('data-id');
        let transactionTypeName = $('#viewReceiptModal .transactionTypes').val() || ' ';
        let supplierId = $('#viewReceiptModal .merchants').attr('data-id');
        let supplierName = $('#viewReceiptModal .merchants').val() || ' ';
        let currencyId = $('#viewReceiptModal .currencies').attr('data-id');
        let currencyName = $('#viewReceiptModal .currencies').val() || ' ';
        let chartAccountId = $('#viewReceiptModal .chart-accounts').attr('data-id');
        let chartAccountName = $('#viewReceiptModal .chart-accounts').val() || ' ';
        let claimDate = $('#viewReceiptModal .dtReceiptDate').val() || ' ';
        let totalAmount = $('#viewReceiptModal .edtTotal').val().replace('$', '');
        let reimbursement = $('#viewReceiptModal .swtReiumbursable').prop('checked');
        let description = $('#viewReceiptModal #txaDescription').val() || 'Receipt Claim';

        let expenseClaimLine = {
            type: "TExpenseClaimLineEx",
            fields: {
                ID: receipt.ID,
                EmployeeID: employeeId ? parseInt(employeeId) : 0,
                EmployeeName: employeeName,
                SupplierID: supplierId ? parseInt(supplierId) : 0,
                SupplierName: supplierName,
                AccountId: chartAccountId ? parseInt(chartAccountId) : 0,
                AccountName: chartAccountName,
                AmountInc: totalAmount ? parseFloat(totalAmount) : 0,
                Reimbursement: reimbursement,
                DateTime: moment(claimDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                Description: description,
                Paymethod: transactionTypeName,
                Attachments: attachment
                // GroupReport: groupReport,
                // TransactionTypeID: transactionTypeId ? parseInt(transactionTypeId) : 0,
                // TransactionTypeName: transactionTypeName,
                // CurrencyID: currencyId ? parseInt(currencyId) : 0,
                // CurrencyName: currencyName,
            }
        };

        let expenseClaim = {
            type: "TExpenseClaimEx",
            fields: {
                ID: receipt.ExpenseClaimID,
                EmployeeID: employeeId ? parseInt(employeeId) : 0,
                EmployeeName: employeeName,
                DateTime: moment(claimDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                Description: description,
                Lines: [expenseClaimLine],
                RequestToEmployeeID: employeeId ? parseInt(employeeId) : 0,
                RequestToEmployeeName: employeeName,
            }
        }

        console.log('ExpenseClaim', expenseClaim)

        $('.fullScreenSpin').css('display', 'inline-block');
        accountService.saveReceipt(expenseClaim).then(function (data) {
            // $('.fullScreenSpin').css('display', 'none');
            // setTimeout(() => {
                window.open('/receiptsoverview?success=true', '_self');
            // }, 200);
        });
    },

    'click #viewReceiptModal .btn-download': function(e) {

        imageData = $('#viewReceiptModal .receiptPhoto').css('background-image');
        imageName = $('#viewReceiptModal .receiptPhoto').attr('data-name');

        if (imageData != 'none') {
            imageData = imageData.split(/"/)[1];

            var a = document.createElement("a"); //Create <a>
            a.href = imageData; //Image Base64 Goes here
            a.download = imageName; //File name Here
            a.click();
        } else {
            swal("There is no attachment to download", '', 'warning');
        }
    },

    'click .btn-detach': function (e) {
        let from = $('#employeeListModal').attr('data-from');
        var parentElement;
        if (from == "ViewReceipt") {
            parentElement = "#viewReceiptModal";
        } else if (from == "NavExpense") {
            parentElement = "#nav-expense";
        } else if (from == "NavTime") {
            parentElement = "#nav-time";
        }

        $(parentElement + ' .receiptPhoto').css('background-image', 'none');
        $(parentElement + ' .receiptPhoto').attr('data-name', '');
        $(parentElement + ' .img-placeholder').css('opacity', 1);
    },

    'click #newReceiptModal .btnSave': function (e) {

        let template = Template.instance();

        if ($('#newReceiptModal .tab-pane#nav-multiple').hasClass('active')) {

            var receipts = [];
            let loggedUserName = Session.get('mySessionEmployee');
            let loggedUserId = Session.get('mySessionEmployeeLoggedID');
            for (i = 0; i < 10; i++) {
                var amount = $('#multipleAmount-' + i).val().replace('$', '');
                numAmount = parseFloat(amount) || 0;
                if (numAmount > 0) {
                    accountName = $('#multipleAccount-' + i).val();
                    accountId = $('#multipleAccount-' + i).attr('data-id');
                    merchantName = $('#multipleMerchant-' + i).val();
                    merchantId = $('#multipleMerchant-' + i).attr('data-id');
                    description = $('#multipleDescription-' + i).val();
                    date = $('#multipleDate-' + i).val();

                    if (!accountName || !merchantName) {
                        swal("Select merchant and account for saving receipt", '', 'warning');
                        return;
                    }

                    let expenseClaimLine = {
                        type: "TExpenseClaimLineEx",
                        fields: {
                            EmployeeID: loggedUserId,
                            EmployeeName: loggedUserName,
                            SupplierID: merchantId ? parseInt(merchantId) : 0,
                            SupplierName: merchantName,
                            AccountId: accountId ? parseInt(accountId) : 0,
                            AccountName: accountName,
                            AmountInc: numAmount,
                            Reimbursement: false,
                            DateTime: moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                            Description: description || "Receipt Claim",
                            Paymethod: ''
                        }
                    };

                    let expenseClaim = {
                        type: "TExpenseClaimEx",
                        fields: {
                            EmployeeID: loggedUserId,
                            EmployeeName: loggedUserName,
                            DateTime: moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                            Description: description || "Receipt Claim",
                            Lines: [expenseClaimLine],
                            RequestToEmployeeID: loggedUserId,
                            RequestToEmployeeName: loggedUserName,
                        }
                    }

                    receipts.push(expenseClaim);
                }
            }

            $('.fullScreenSpin').css('display', 'inline-block');
            for (i = 0; i < receipts.length; i++) {
                accountService.saveReceipt(receipts[i]).then(function (data) {
                    // $('.fullScreenSpin').css('display', 'none');
                    setTimeout(() => {
                        window.open('/receiptsoverview?success=true', '_self');
                    }, 500);
                }).catch ( err => {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }
        } else {
            let from = $('#employeeListModal').attr('data-from');
            let parentElement = from == 'NavExpense' ? '#nav-expense' : '#nav-time'

            imageData = $(parentElement + ' .receiptPhoto').css('background-image');
            imageName = $(parentElement + ' .receiptPhoto').attr('data-name');

            var attachment;
            if (imageData != 'none') {
                imageData = imageData.split(/"/)[1];
                imageBase64 = imageData.split(',')[1];
                imageDescryption = imageData.split(',')[0];
                attachment = [
                    {
                        type: "TAttachment",
                        fields: {
                            Attachment: imageBase64,
                            AttachmentName: imageName,
                            Description: imageDescryption,
                            TableName: "tblexpenseclaimline"
                        }
                    }
                ]
            }

            let employeeId = $(parentElement + ' .employees').attr('data-id');
            let employeeName = $(parentElement + ' .employees').val()  || ' ';
            let transactionTypeId = $(parentElement + ' .transactionTypes').attr('data-id');
            let transactionTypeName = $(parentElement + ' .transactionTypes').val() || ' ';
            let supplierId = $(parentElement + ' .merchants').attr('data-id');
            let supplierName = $(parentElement + ' .merchants').val() || ' ';
            let currencyId = $(parentElement + ' .currencies').attr('data-id');
            let currencyName = $(parentElement + ' .currencies').val() || ' ';
            let chartAccountId = $(parentElement + ' .chart-accounts').attr('data-id');
            let chartAccountName = $(parentElement + ' .chart-accounts').val() || ' ';
            let claimDate = $(parentElement + ' .dtReceiptDate').val() || ' ';
            let reimbursement = $(parentElement + ' .swtReiumbursable').prop('checked');
            let description = $(parentElement + ' #txaDescription').val() || 'Receipt Claim';

            var totalAmount = 0;
            totalAmount = $(parentElement + ' .edtTotal').val().replace('$', '');

            let expenseClaimLine = {
                type: "TExpenseClaimLineEx",
                fields: {
                    EmployeeID: employeeId ? parseInt(employeeId) : 0,
                    EmployeeName: employeeName,
                    SupplierID: supplierId ? parseInt(supplierId) : 0,
                    SupplierName: supplierName,
                    AccountId: chartAccountId ? parseInt(chartAccountId) : 0,
                    AccountName: chartAccountName,
                    AmountInc: totalAmount ? parseFloat(totalAmount) : 0,
                    Reimbursement: reimbursement,
                    DateTime: moment(claimDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                    Description: description,
                    Paymethod: transactionTypeName,
                    Attachments: attachment
                    // GroupReport: groupReport,
                    // TransactionTypeID: transactionTypeId ? parseInt(transactionTypeId) : 0,
                    // TransactionTypeName: transactionTypeName,
                    // CurrencyID: currencyId ? parseInt(currencyId) : 0,
                    // CurrencyName: currencyName,
                }
            };

            let expenseClaim = {
                type: "TExpenseClaimEx",
                fields: {
                    EmployeeID: employeeId ? parseInt(employeeId) : 0,
                    EmployeeName: employeeName,
                    DateTime: moment(claimDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                    Description: description,
                    Lines: [expenseClaimLine],
                    RequestToEmployeeID: employeeId ? parseInt(employeeId) : 0,
                    RequestToEmployeeName: employeeName,
                }
            }

            console.log('ExpenseClaim', expenseClaim)

            $('.fullScreenSpin').css('display', 'inline-block');
            accountService.saveReceipt(expenseClaim).then(function (data) {
                console.log('update receipt result', data);
                // $('.fullScreenSpin').css('display', 'none');
                // setTimeout(() => {
                    window.open('/receiptsoverview?success=true', '_self');
                // }, 200);
            });
        }
    },
    'click #btnShowSplitModal': function(e) {
        let template = Template.instance();
        $('#splitExpenseModal').modal('toggle');
        let receipt = Object.assign({}, template.editExpenseClaim.get());
        console.log('receipt', receipt);
        template.refreshSplitTable([receipt]);
    },
    'click #btnDeleteReceipt': function(e) {
        let template = Template.instance();
        let receipt = template.editExpenseClaim.get();
        swal({
            title: 'Delete Receipt Claim',
            text: 'Are you sure to delete this receipt claim?',
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.value) {

                let employeeId = $('#viewReceiptModal .employees').attr('data-id');
                let employeeName = $('#viewReceiptModal .employees').val()  || ' ';
                let transactionTypeId = $('#viewReceiptModal .transactionTypes').attr('data-id');
                let transactionTypeName = $('#viewReceiptModal .transactionTypes').val() || ' ';
                let supplierId = $('#viewReceiptModal .merchants').attr('data-id');
                let supplierName = $('#viewReceiptModal .merchants').val() || ' ';
                let currencyId = $('#viewReceiptModal .currencies').attr('data-id');
                let currencyName = $('#viewReceiptModal .currencies').val() || ' ';
                let chartAccountId = $('#viewReceiptModal .chart-accounts').attr('data-id');
                let chartAccountName = $('#viewReceiptModal .chart-accounts').val() || ' ';
                let claimDate = $('#viewReceiptModal .dtReceiptDate').val() || ' ';
                let totalAmount = $('#viewReceiptModal .edtTotal').val().replace('$', '');
                let reimbursement = $('#viewReceiptModal .swtReiumbursable').prop('checked');
                let description = $('#viewReceiptModal #txaDescription').val() || 'Receipt Claim';

                let expenseClaimLine = {
                    type: "TExpenseClaimLineEx",
                    fields: {
                        ID: receipt.ID,
                        EmployeeID: employeeId ? parseInt(employeeId) : 0,
                        EmployeeName: employeeName,
                        SupplierID: supplierId ? parseInt(supplierId) : 0,
                        SupplierName: supplierName,
                        AccountId: chartAccountId ? parseInt(chartAccountId) : 0,
                        AccountName: chartAccountName,
                        AmountInc: totalAmount ? parseFloat(totalAmount) : 0,
                        Reimbursement: reimbursement,
                        DateTime: moment(claimDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        Description: description,
                        Paymethod: transactionTypeName,
                        Active: false
                        // GroupReport: groupReport,
                        // TransactionTypeID: transactionTypeId ? parseInt(transactionTypeId) : 0,
                        // TransactionTypeName: transactionTypeName,
                        // CurrencyID: currencyId ? parseInt(currencyId) : 0,
                        // CurrencyName: currencyName,
                    }
                };

                let expenseClaim = {
                    type: "TExpenseClaimEx",
                    fields: {
                        ID: receipt.ExpenseClaimID,
                        EmployeeID: employeeId ? parseInt(employeeId) : 0,
                        EmployeeName: employeeName,
                        DateTime: moment(claimDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        Description: description,
                        Lines: [expenseClaimLine],
                        RequestToEmployeeID: employeeId ? parseInt(employeeId) : 0,
                        RequestToEmployeeName: employeeName,
                        Active: false
                    }
                }

                console.log('ExpenseClaim', expenseClaim)

                $('.fullScreenSpin').css('display', 'inline-block');
                accountService.saveReceipt(expenseClaim).then(function (data) {
                    // $('.fullScreenSpin').css('display', 'none');
                    window.open('/receiptsoverview?success=true', '_self');
                });
            } else if (result.dismiss === 'cancel') {

            }
          });
    },
    'click a#dropdownMenuLink': function (e) {
        let template = Template.instance();
        let receipt = template.editExpenseClaim.get();
        $('#dtSplitStart').datepicker('setDate', receipt.DateTime);
        $('#dtSplitEnd').datepicker('setDate', moment(receipt.DateTime, "DD/MM/YYYY").add(1, 'days').format("DD/MM/YYYY"));
    },
    'click #btnSplitByDays': function (e) {
        let endDate = $('#dtSplitEnd').val();
        let startDate = $('#dtSplitStart').val();

        if (!endDate || !startDate) {
            swal("Select valid date for split", '', 'warning');
            return;
        }

        let diffDays = moment(endDate, "DD/MM/YYYY").diff(moment(startDate, "DD/MM/YYYY"), 'days');
        console.log('diffdays', diffDays);
        if (diffDays < 0) {
            swal("Select end date later than start date", '', 'warning');
            return;
        }

        if (diffDays == 0) {
            diffDays = 1;
        }

        diffDays += 1;

        let template = Template.instance();
        let receipt = template.editExpenseClaim.get();

        var receiptList = [];
        let amount = Math.round(receipt.AmountInc*100 / diffDays)/100;
        for (i = 0; i < diffDays; i++) {
            let lineItem = Object.assign({}, receipt);
            lineItem.DateTime = moment(lineItem.DateTime, "DD/MM/YYYY").add(i, 'days').format("DD/MM/YYYY");

            if (i == diffDays - 1) {
                lineItem.AmountInc = Math.round((receipt.AmountInc - amount * i) * 100)/100;
            } else {
                lineItem.AmountInc = amount;
            }

            receiptList.push(lineItem);
        }

        template.refreshSplitTable(receiptList);
    },

    'click #btnAddSplit': function(e) {
        let template = Template.instance();
        splitDataTable = $('#tblSplitExpense').DataTable();
        var lineItems = splitDataTable.rows().data();

        let lineItem = Object.assign({}, lineItems[lineItems.length - 1]);
        lineItem.AmountInc = 0;
        lineItems.push(lineItem);

        template.refreshSplitTable(lineItems);
    },
    'click #btnSplitEven': function(e) {
        let template = Template.instance();
        let receipt = template.editExpenseClaim.get();

        splitDataTable = $('#tblSplitExpense').DataTable();
        var lineItems = splitDataTable.rows().data();

        let amount = Math.round(receipt.AmountInc*100 / (lineItems.length))/100;

        for (i = 0; i < lineItems.length; i++) {
            if (i == lineItems.length - 1) {
                lineItems[i].AmountInc = Math.round((receipt.AmountInc - amount * i) * 100)/100;
            } else {
                lineItems[i].AmountInc = amount;
            }
        }

        template.refreshSplitTable(lineItems);
    },
    'click #splitExpenseModal .btnSave': function(e) {
        let template = Template.instance();
        let receipt = template.editExpenseClaim.get();
        receipt.Description = receipt.Description ? receipt.Description : "Receipt Claim";

        splitDataTable = $('#tblSplitExpense').DataTable();
        var lineItems = splitDataTable.rows().data();

        var totalAmount = 0;
        for (i = 0; i < lineItems.length; i++) {
            let amount = lineItems[i].AmountInc;
            totalAmount += amount;
        }

        totalAmount = Math.trunc(totalAmount*100)/100;

        if (totalAmount != receipt.AmountInc) {
            swal("Splited amount is not same as original receipt's", '', 'warning');
            return;
        }

        $('.fullScreenSpin').css('display', 'inline-block');
        for (i = 0; i < lineItems.length; i++) {
            let lineItem = lineItems[i];
            lineItem.DateTime = moment(lineItem.DateTime, 'DD/MM/YYYY').format('YYYY-MM-DD');

            if (i > 0) {
                let expenseClaimLine = {
                    type: "TExpenseClaimLineEx",
                    fields: {
                        EmployeeID: lineItem.EmployeeID,
                        EmployeeName: lineItem.EmployeeName,
                        SupplierID: lineItem.SupplierID,
                        SupplierName: lineItem.SupplierName,
                        AccountId: lineItem.AccountId,
                        AccountName: lineItem.AccountName,
                        AmountInc: lineItem.AmountInc,
                        Reimbursement: lineItem.Reimbursement,
                        DateTime: lineItem.DateTime,
                        Description: lineItem.Description ? lineItem.Description : "Receipt Claim",
                        Paymethod: lineItem.Paymethod
                        // GroupReport: groupReport,
                        // TransactionTypeID: transactionTypeId ? parseInt(transactionTypeId) : 0,
                        // TransactionTypeName: transactionTypeName,
                        // CurrencyID: currencyId ? parseInt(currencyId) : 0,
                        // CurrencyName: currencyName,
                    }
                };
                expenseClaim = {
                    type: "TExpenseClaimEx",
                    fields: {
                        EmployeeID: receipt.EmployeeID,
                        EmployeeName: receipt.EmployeeName,
                        DateTime: lineItem.DateTime,
                        Description: receipt.Description,
                        Lines: [expenseClaimLine],
                        RequestToEmployeeID: receipt.EmployeeID,
                        RequestToEmployeeName: receipt.EmployeeName,
                    }
                }
            } else {
                let expenseClaimLine = {
                    type: "TExpenseClaimLineEx",
                    fields: {
                        ID: receipt.ID,
                        EmployeeID: lineItem.EmployeeID,
                        EmployeeName: lineItem.EmployeeName,
                        SupplierID: lineItem.SupplierID,
                        SupplierName: lineItem.SupplierName,
                        AccountId: lineItem.AccountId,
                        AccountName: lineItem.AccountName,
                        AmountInc: lineItem.AmountInc,
                        Reimbursement: lineItem.Reimbursement,
                        DateTime: lineItem.DateTime,
                        Description: lineItem.Description ? lineItem.Description : "Receipt Claim",
                        Paymethod: lineItem.Paymethod,
                        Attachments: lineItem.Attachments
                        // GroupReport: groupReport,
                        // TransactionTypeID: transactionTypeId ? parseInt(transactionTypeId) : 0,
                        // TransactionTypeName: transactionTypeName,
                        // CurrencyID: currencyId ? parseInt(currencyId) : 0,
                        // CurrencyName: currencyName,
                    }
                };
                expenseClaim = {
                    type: "TExpenseClaimEx",
                    fields: {
                        ID: receipt.ExpenseClaimID,
                        DateTime: lineItem.DateTime,
                        Lines: [expenseClaimLine],
                    }
                }
            }

            console.log('splited item', expenseClaim);
            accountService.saveReceipt(expenseClaim).then(function (data) {
                // $('.fullScreenSpin').css('display', 'none');
                setTimeout(() => {
                    window.open('/receiptsoverview?success=true', '_self');
                }, 500);
            }).catch ( err => {
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    },
    'change input[id^="splitAmount-"]': function(e) {
        let index = e.target.id.split('-')[1];
        let newValue = e.target.value.replace('$', '');

        splitDataTable = $('#tblSplitExpense').DataTable();
        rowData = splitDataTable.row(index).data();

        rowData.AmountInc = newValue ? parseFloat(newValue) : 0;
    },
    'click input[id^="splitAccount-"]': function(e) {
        $('#employeeListModal').attr('data-from', e.target.id);
        let template = Template.instance();
        template.setAccountSelect(e);
    },
    'click input[id^="multipleAccount-"]': function(e) {
        $('#employeeListModal').attr('data-from', e.target.id);
        let template = Template.instance();
        template.setAccountSelect(e);
    },
    'click input[id^="multipleMerchant-"]': function(e) {
        $('#employeeListModal').attr('data-from', e.target.id);
        let template = Template.instance();
        template.setSupplierSelect(e);
    },
    'click button[id^="splitRemove-"]': function(e) {
        let index = e.target.id.split('-')[1];
        let template = Template.instance();
        let receipt = template.editExpenseClaim.get();

        splitDataTable = $('#tblSplitExpense').DataTable();
        var lineItems = splitDataTable.rows().data();

        var newLineItems = [];
        for (i = 0; i < lineItems.length; i++) {
            if (i == index) {
                continue;
            }
            newLineItems.push(lineItems[i]);
        }

        let amount = Math.round(receipt.AmountInc*100 / (newLineItems.length))/100;

        for (i = 0; i < newLineItems.length; i++) {
            if (i == newLineItems.length - 1) {
                newLineItems[i].AmountInc = Math.round((receipt.AmountInc - amount * i) * 100)/100;
            } else {
                newLineItems[i].AmountInc = amount;
            }
        }

        template.refreshSplitTable(newLineItems);
    },
    'click #btnDuplicate': function(e) {
        let template = Template.instance();
        let lineItem = Object.assign({}, template.editExpenseClaim.get());
        lineItem.Description = lineItem.Description ? lineItem.Description : "Receipt Claim";
        lineItem.DateTime = moment(lineItem.DateTime, 'DD/MM/YYYY').format('YYYY-MM-DD')

        let expenseClaimLine = {
            type: "TExpenseClaimLineEx",
            fields: {
                EmployeeID: lineItem.EmployeeID,
                EmployeeName: lineItem.EmployeeName,
                SupplierID: lineItem.SupplierID,
                SupplierName: lineItem.SupplierName,
                AccountId: lineItem.AccountId,
                AccountName: lineItem.AccountName,
                AmountInc: lineItem.AmountInc,
                Reimbursement: lineItem.Reimbursement,
                DateTime: lineItem.DateTime,
                Description: lineItem.Description ? lineItem.Description : "Receipt Claim",
                Paymethod: lineItem.Paymethod,
                Attachments: lineItem.Attachments
                // GroupReport: groupReport,
                // TransactionTypeID: transactionTypeId ? parseInt(transactionTypeId) : 0,
                // TransactionTypeName: transactionTypeName,
                // CurrencyID: currencyId ? parseInt(currencyId) : 0,
                // CurrencyName: currencyName,
            }
        };
        expenseClaim = {
            type: "TExpenseClaimEx",
            fields: {
                EmployeeID: lineItem.EmployeeID,
                EmployeeName: lineItem.EmployeeName,
                DateTime: lineItem.DateTime,
                Description: lineItem.Description,
                Lines: [expenseClaimLine],
                RequestToEmployeeID: lineItem.EmployeeID,
                RequestToEmployeeName: lineItem.EmployeeName,
            }
        }

        console.log('duplicate object', expenseClaim);
        $('.fullScreenSpin').css('display', 'inline-block');
        accountService.saveReceipt(expenseClaim).then(function (data) {
            // $('.fullScreenSpin').css('display', 'none');
            // setTimeout(() => {
                window.open('/receiptsoverview?success=true', '_self');
            // }, 200);
        });
    },
    'click .btnRefresh': async function () {
        $('.fullScreenSpin').css('display', 'inline-block');

        await sideBarService.getAllExpenseCliamExDataVS1().then(function (expenseData) {
            addVS1Data('TExpenseClaim', JSON.stringify(expenseData)).then(function (datareturn) {
              //window.open('/receiptsoverview', '_self');
              setTimeout(() => {
                  window.open('/receiptsoverview', '_self');
               }, 800);
            }).catch(function (err) {
              setTimeout(() => {
                  window.open('/receiptsoverview', '_self');
               }, 800);
            });
        }).catch(function (err) {
          setTimeout(() => {
              window.open('/receiptsoverview', '_self');
           }, 800);
        });
    },
    'click #btnShowMergeModal': function(e) {
        $('#mergeModal').modal('toggle');

        $('#employeeListModal').attr('data-from', 'MergeModal');

        $('#formCheckMerge-All').attr('checked', false);
        $('input[id^="formCheckMerge-"').attr('checked', false);
        let template = Template.instance();
        let editingExpense = template.editExpenseClaim.get();
        template.mergeReceiptRecords.set([editingExpense]);
        setTimeout(() => {
            $("#formCheckMerge-" + editingExpense.ID).prop('checked', true);
        }, 100);
    },
    'click #btnMergeDetail': function() {
        let template = Template.instance();
        mergeList = template.mergeReceiptRecords.get();
        if (mergeList.length < 2) {
            swal('Select more than 2 records to merge', '', 'warning');
            return;
        }
        $('#mergeModal').modal('toggle');
        $('#mergeDetailModal').modal('toggle');

        if (mergeList[0].Attachments) {
            let imageData = mergeList[0].Attachments[0].fields.Description + "," + mergeList[0].Attachments[0].fields.Attachment;
            $('#mergeDetailModal .receiptPhotoMerge').css('background-image', "url('" + imageData + "')");
            $('#mergeDetailModal .receiptPhotoMerge').attr('data-name', mergeList[0].Attachments[0].fields.AttachmentName);
            $('#mergeDetailModal .img-placeholder').css('opacity', 0);
        } else {
            $('#mergeDetailModal .receiptPhotoMerge').css('background-image', "none");
            $('#mergeDetailModal .receiptPhotoMerge').attr('data-name', "");
            $('#mergeDetailModal .img-placeholder').css('opacity', 1);
        }

    },
    'change #sltExpenseKeep': function(e) {
        let selected = $(e.target).children("option:selected").val();

        let template = Template.instance();
        template.mergeReceiptSelectedIndex.set(parseInt(selected));
        let selectedExpense = template.mergeReceiptRecords.get()[selected];

        $('#mergedEmployee').val(selectedExpense.EmployeeName);
        $('#mergedMerchant').val(selectedExpense.SupplierName);
        $('#mergedAccount').val(selectedExpense.AccountName);
        $('#mergedDescription').val(selectedExpense.Description);

        if (selectedExpense.Attachments) {
            let imageData = selectedExpense.Attachments[0].fields.Description + "," + selectedExpense.Attachments[0].fields.Attachment;
            $('#mergeDetailModal .receiptPhotoMerge').css('background-image', "url('" + imageData + "')");
            $('#mergeDetailModal .receiptPhotoMerge').attr('data-name', selectedExpense.Attachments[0].fields.AttachmentName);
            $('#mergeDetailModal .img-placeholder').css('opacity', 0);
        } else {
            $('#mergeDetailModal .receiptPhotoMerge').css('background-image', "none");
            $('#mergeDetailModal .receiptPhotoMerge').attr('data-name', "");
            $('#mergeDetailModal .img-placeholder').css('opacity', 1);
        }
    },
    'change #mergedReceipt': function(e) {
        let selected = $(e.target).children("option:selected").val();
        let template = Template.instance();
        let selectedExpense = template.mergeReceiptRecords.get()[parseInt(selected)];

        if (selectedExpense.Attachments) {
            let imageData = selectedExpense.Attachments[0].fields.Description + "," + selectedExpense.Attachments[0].fields.Attachment;
            $('#mergeDetailModal .receiptPhotoMerge').css('background-image', "url('" + imageData + "')");
            $('#mergeDetailModal .receiptPhotoMerge').attr('data-name', selectedExpense.Attachments[0].fields.AttachmentName);
            $('#mergeDetailModal .img-placeholder').css('opacity', 0);
        } else {
            $('#mergeDetailModal .receiptPhotoMerge').css('background-image', "none");
            $('#mergeDetailModal .receiptPhotoMerge').attr('data-name', "");
            $('#mergeDetailModal .img-placeholder').css('opacity', 1);
        }
    },
    'click #mergeDetailModal .btnSave': function(e) {
        let template = Template.instance();
        let receiptRecords = template.mergeReceiptRecords.get();

        console.log('keeping expense', receiptRecords[template.mergeReceiptSelectedIndex.get()]);
        let index = template.mergeReceiptSelectedIndex.get();
        for (i = 0; i < receiptRecords.length; i++) {
            if (i == index) {
                let mergedExpense = Object.assign({}, receiptRecords[index]);

                let selectedReceiptIndex = $('#mergedReceipt').children("option:selected").val();
                mergedExpense.Attachments = receiptRecords[selectedReceiptIndex].Attachments;
        
                let selectedDateTime = $('#mergedDateTime option:selected').text();
                mergedExpense.DateTime = selectedDateTime ? moment(selectedDateTime, 'DD/MM/YYYY').format('YYYY-MM-DD') : ''
        
                let selectedAmount = $('#mergedAmount option:selected').text();
                mergedExpense.AmountInc = parseFloat(selectedAmount.replace('$', '')) || 0;
        
                let selectedPaymethod = $('#mergedTransactionType option:selected').text();
                mergedExpense.Paymethod = selectedPaymethod;
        
                let selectedReiumbursable = $('#swtMergedReiumbursable').prop('checked');
                mergedExpense.Reimbursement = selectedReiumbursable;
        
                console.log('merged expense', mergedExpense)
        
                let expenseClaimLine = {
                    type: "TExpenseClaimLineEx",
                    fields: mergedExpense
                };
                let expenseClaim = {
                    type: "TExpenseClaimEx",
                    fields: {
                        ID: mergedExpense.ExpenseClaimID,
                        EmployeeID: mergedExpense.EmployeeID,
                        EmployeeName: mergedExpense.EmployeeName,
                        DateTime: mergedExpense.DateTime,
                        Description: mergedExpense.Description,
                        Lines: [expenseClaimLine],
                        RequestToEmployeeID: mergedExpense.EmployeeID,
                        RequestToEmployeeName: mergedExpense.EmployeeName,
                    }
                }
        
                $('.fullScreenSpin').css('display', 'inline-block');
                accountService.saveReceipt(expenseClaim).then(function (data) {
                    // $('.fullScreenSpin').css('display', 'none');
                    setTimeout(() => {
                        window.open('/receiptsoverview?success=true', '_self');
                    }, 500);
                });
            } else {
                let receipt = receiptRecords[i];
                let expenseClaimLine = {
                    type: "TExpenseClaimLineEx",
                    fields: {
                        ID: receipt.ID,
                        EmployeeID: receipt.EmployeeID,
                        EmployeeName: receipt.EmployeeName,
                        SupplierID: receipt.SupplierID,
                        SupplierName: receipt.SupplierName,
                        AccountId: receipt.AccountId,
                        AccountName: receipt.AccountName,
                        AmountInc: receipt.AmountInc,
                        Reimbursement: receipt.Reimbursement,
                        DateTime: moment(receipt.DateTime, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        Description: receipt.Description,
                        Paymethod: receipt.Paymethod,
                        Active: false
                        // GroupReport: groupReport,
                        // TransactionTypeID: transactionTypeId ? parseInt(transactionTypeId) : 0,
                        // TransactionTypeName: transactionTypeName,
                        // CurrencyID: currencyId ? parseInt(currencyId) : 0,
                        // CurrencyName: currencyName,
                    }
                };

                let expenseClaim = {
                    type: "TExpenseClaimEx",
                    fields: {
                        ID: receipt.ExpenseClaimID,
                        EmployeeID: receipt.EmployeeID,
                        EmployeeName: receipt.EmployeeName,
                        DateTime: moment(receipt.DateTime, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        Description: receipt.Description,
                        Lines: [expenseClaimLine],
                        RequestToEmployeeID: receipt.EmployeeID,
                        RequestToEmployeeName: receipt.EmployeeName,
                        Active: false
                    }
                }

                $('.fullScreenSpin').css('display', 'inline-block');
                accountService.saveReceipt(expenseClaim).then(function (data) {
                    // $('.fullScreenSpin').css('display', 'none');
                });
            }
        }
    }

});

Template.receiptsoverview.helpers({
    expenseClaimList: () => {
        return Template.instance().expenseClaimList.get();
    },
    editExpenseClaim: () => {
        return Template.instance().editExpenseClaim.get();
    },
    multiReceiptRecords: () => {
        return Template.instance().multiReceiptRecords.get();
    },
    mergeReceiptRecords: () => {
        return Template.instance().mergeReceiptRecords.get();
    },
    mergeReceiptSelectedIndex: () => {
        return Template.instance().mergeReceiptSelectedIndex.get();
    },
    sessionCurrency: () => {
        return Session.get('ERPCountryAbbr');
    }
});
