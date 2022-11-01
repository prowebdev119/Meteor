import {ProductService} from "../product/product-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { TaxRateService } from "../settings/settings-service";
import { CoreService } from '../js/core-service';
import {AccountService} from "../accounts/account-service";
import {PurchaseBoardService} from '../js/purchase-service';
import {UtilityService} from "../utility-service";
import 'jquery-editable-select';
import { Random } from 'meteor/random';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let accSelected = "";
let taxSelected = "";
Template.productview.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.taxraterecords = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.recentTrasactions = new ReactiveVar([]);

    templateObject.coggsaccountrecords = new ReactiveVar();
    templateObject.salesaccountrecords = new ReactiveVar();
    templateObject.inventoryaccountrecords = new ReactiveVar();

    templateObject.productqtyrecords = new ReactiveVar();
    templateObject.productExtraSell = new ReactiveVar();
    templateObject.totaldeptquantity = new ReactiveVar();
    templateObject.isTrackChecked = new ReactiveVar();
    templateObject.isTrackChecked.set(false);

    templateObject.isExtraSellChecked = new ReactiveVar();
    templateObject.isExtraSellChecked.set(false);

    templateObject.defaultpurchasetaxcode = new ReactiveVar();
    templateObject.defaultsaletaxcode = new ReactiveVar();

    templateObject.includeInventory = new ReactiveVar();
    templateObject.includeInventory.set(false);
    templateObject.clienttypeList = new ReactiveVar();

});

Template.productview.onRendered(function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let productService = new ProductService();
    let purchaseService = new PurchaseBoardService();
    let taxRateService = new TaxRateService();
    const records = [];
    const taxCodesList = [];
    const deptrecords = [];

    const coggsaccountrecords = [];
    const salesaccountrecords = [];
    const inventoryaccountrecords = [];
    var splashArrayProductList = new Array();
    var splashArrayTaxRateList = new Array();
    var splashArrayAccountList = new Array();
    let clientType = [];

    templateObject.getAllLastInvDatas = function () {
        productService.getAllProductList1().then(function (data) {
            let salestaxcode = '';
            let purchasetaxcode = '';

            if (data.tproduct.length > 0) {
                let lastProduct = data.tproduct[data.tproduct.length - 1]
                    salestaxcode = lastProduct.TaxCodeSales;
                purchasetaxcode = lastProduct.TaxCodePurchase;
                setTimeout(function () {
                    $('#slttaxcodesales').val(salestaxcode);
                    $('#slttaxcodepurchase').val(purchasetaxcode);
                }, 500);
            }

        }).catch(function (err) {});
    }

    templateObject.getAccountsByCategory = function (accountType) {
        getVS1Data('TAccountVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAccountListVS1().then(function (data) {
                    let records = [];
                    let inventoryData = [];
                    addVS1Data('TAccountVS1', JSON.stringify(data));
                    for (let i = 0; i < data.taccountvs1.length; i++) {
                        if (!isNaN(data.taccountvs1[i].fields.Balance)) {
                            accBalance = utilityService.modifynegativeCurrencyFormat(data.taccountvs1[i].fields.Balance) || 0.00;
                        } else {
                            accBalance = Currency + "0.00";
                        }
                        var dataList = [
                            data.taccountvs1[i].fields.AccountName || '-',
                            data.taccountvs1[i].fields.Description || '',
                            data.taccountvs1[i].fields.AccountNumber || '',
                            data.taccountvs1[i].fields.AccountTypeName || '',
                            accBalance,
                            data.taccountvs1[i].fields.TaxCode || ''
                        ];

                        if (useData[i].fields.AccountTypeName == accountType) {
                            splashArrayAccountList.push(dataList);
                        }
                    }
                    //localStorage.setItem('VS1PurchaseAccountList', JSON.stringify(splashArrayAccountList));

                    if (splashArrayAccountList) {

                        if (splashArrayAccountList) {
                            var datatable = $('#tblAccount').DataTable();
                            datatable.clear();
                            datatable.rows.add(splashArrayAccountList);
                            datatable.draw(false);
                            $('#accountListModal').modal('toggle');
                        }

                    }
                });
            } else {
                splashArrayAccountList = [];
                let data = JSON.parse(dataObject[0].data);
                let useData = data.taccountvs1;
                let records = [];
                let inventoryData = [];
                for (let i = 0; i < useData.length; i++) {
                    if (!isNaN(useData[i].fields.Balance)) {
                        accBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.Balance) || 0.00;
                    } else {
                        accBalance = Currency + "0.00";
                    }
                    var dataList = [
                        useData[i].fields.AccountName || '-',
                        useData[i].fields.Description || '',
                        useData[i].fields.AccountNumber || '',
                        useData[i].fields.AccountTypeName || '',
                        accBalance,
                        useData[i].fields.TaxCode || ''
                    ];

                    if (useData[i].fields.AccountTypeName == accountType) {
                        splashArrayAccountList.push(dataList);
                    }

                }
                //localStorage.setItem('VS1PurchaseAccountList', JSON.stringify(splashArrayAccountList));
                if (splashArrayAccountList) {
                    var datatable = $('#tblAccount').DataTable();
                    datatable.clear();
                    datatable.rows.add(splashArrayAccountList);
                    datatable.draw(false);
                    $('#accountListModal').modal('toggle');
                }
            }
        }).catch(function (err) {
            sideBarService.getAccountListVS1().then(function (data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.taccountvs1.length; i++) {
                    if (!isNaN(data.taccountvs1[i].fields.Balance)) {
                        accBalance = utilityService.modifynegativeCurrencyFormat(data.taccountvs1[i].fields.Balance) || 0.00;
                    } else {
                        accBalance = Currency + "0.00";
                    }
                    var dataList = [
                        data.taccountvs1[i].fields.AccountName || '-',
                        data.taccountvs1[i].fields.Description || '',
                        data.taccountvs1[i].fields.AccountNumber || '',
                        data.taccountvs1[i].fields.AccountTypeName || '',
                        accBalance,
                        data.taccountvs1[i].fields.TaxCode || ''
                    ];
                    if (useData[i].fields.AccountTypeName == accountType) {
                        splashArrayAccountList.push(dataList);
                    }
                }
                //localStorage.setItem('VS1PurchaseAccountList', JSON.stringify(splashArrayAccountList));

                if (splashArrayAccountList) {
                    if (splashArrayAccountList) {
                        var datatable = $('#tblAccount').DataTable();
                        datatable.clear();
                        datatable.rows.add(splashArrayAccountList);
                        datatable.draw(false);
                        $('#accountListModal').modal('toggle');
                    }

                }
            });
        });
    };
    // tempObj.getAllAccountss();

    $(document).ready(function () {
        setTimeout(function () {
            $('#slttaxcodepurchase').editableSelect();
            $('#slttaxcodesales').editableSelect();
            $('#sltcogsaccount').editableSelect();
            $('#sltsalesacount').editableSelect();
            $('#sltinventoryacount').editableSelect();
            $('#sltCustomerType').editableSelect();

            $('#sltCustomerType').editableSelect()
            .on('click.editable-select', function (e, li) {
                var $earch = $(this);
                var offset = $earch.offset();
                var custTypeDataName = e.target.value || '';
                if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                    $('#customerTypeListModal').modal('toggle');
                } else {
                    if (custTypeDataName.replace(/\s/g, '') != '') {
                        $('#add-clienttype-title').text('Edit Customer Type');
                        getVS1Data('TClientType').then(function (dataObject) {
                            if (dataObject.length == 0) {
                                taxRateService.getClientType().then(function (data) {
                                    let lineItems = [];
                                    let lineItemObj = {};
                                    for (let i = 0; i < data.tclienttype.length; i++) {
                                        if ((data.tclienttype[i].TypeName) === custTypeDataName) {
                                            $('#edtClientTypeName').attr('readonly', true);
                                            let typeName = data.tclienttype[i].TypeName;
                                            var clientTypeID = data.tclienttype[i].ID || '';
                                            var taxRateName = data.tclienttype[i].CodeName || '';
                                            var clientTypeDesc = data.tclienttype[i].TypeDescription || '';
                                            $('#edtClientTypeID').val(clientTypeID);
                                            $('#edtClientTypeName').val(typeName);
                                            $('#txaDescription').val(clientTypeDesc);
                                            $('#typeID').val(clientTypeID);
                                            setTimeout(function () {
                                                $('#myModalClientType').modal('toggle');
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
                                let useData = data.tclienttype;
                                let lineItems = [];
                                let lineItemObj = {};
                                $('#add-clienttype-title').text('Edit Customer Type');
                                for (let i = 0; i < useData.length; i++) {
                                    if ((useData[i].fields.TypeName) === custTypeDataName) {
                                        $('#edtClientTypeName').attr('readonly', true);
                                        let typeName = useData[i].fields.TypeName;
                                        var clientTypeID = useData[i].fields.ID || '';
                                        var taxRateName = useData[i].fields.CodeName || '';
                                        var clientTypeDesc = useData[i].fields.TypeDescription || '';
                                        $('#edtClientTypeID').val(clientTypeID);
                                        $('#edtClientTypeName').val(typeName);
                                        $('#txaDescription').val(clientTypeDesc);
                                        $('#typeID').val(clientTypeID);
                                        //setTimeout(function() {
                                        $('#myModalClientType').modal('toggle');
                                        //}, 500);
                                    }
                                }
                            }
                        }).catch(function (err) {
                            purchaseService.getTaxCodesVS1().then(function (data) {
                                let lineItems = [];
                                let lineItemObj = {};
                                for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                                    if ((data.ttaxcodevs1[i].TypeName) === custTypeDataName) {
                                       let typeName = data.tclienttype[i].TypeName;
                                            var clientTypeID = data.tclienttype[i].ID || '';
                                            var taxRateName = data.tclienttype[i].CodeName || '';
                                            var clientTypeDesc = data.tclienttype[i].TypeDescription || '';
                                            $('#edtClientTypeID').val(clientTypeID);
                                            $('#edtClientTypeName').val(typeName);
                                            $('#txaDescription').val(clientTypeDesc);
                                            $('#typeID').val(clientTypeID);
                                            setTimeout(function () {
                                                $('#myModalClientType').modal('toggle');
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
                        $('#customerTypeListModal').modal('toggle');
                    }

                }
            });

            $('#slttaxcodepurchase').editableSelect()
            .on('click.editable-select', function (e, li) {
                var $earch = $(this);
                taxSelected = "purchase";
                $("#taxSelected").val(taxSelected);
                var offset = $earch.offset();
                var taxRateDataName = e.target.value || '';
                var taxCodePurchaseDataName = e.target.value || '';
                if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                    $('#taxRateListModal').modal('toggle');
                } else {
                    if (taxRateDataName.replace(/\s/g, '') != '') {
                        $('.taxcodepopheader').text('Edit Tax Rate');
                        getVS1Data('TTaxcodeVS1').then(function (dataObject) {
                            if (dataObject.length == 0) {
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

            $('#sltinventoryacount').editableSelect()
            .on('click.editable-select', function (e, li) {
                accSelected = "inventory";
                $('#accSelected').val(accSelected);
                var $earch = $(this);
                var offset = $earch.offset();
                var cogsAccountDataName = e.target.value || '';
                var accountType = "OCASSET";
                if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                    templateObject.getAccountsByCategory(accountType);

                } else {
                    if (cogsAccountDataName.replace(/\s/g, '') != '') {
                        $('#add-account-title').text('Edit Account Details');
                        getVS1Data('TAccountVS1').then(function (dataObject) {
                            if (dataObject.length == 0) {
                                productService.getAccountName().then(function (data) {
                                    let lineItems = [];
                                    let lineItemObj = {};
                                    for (let i = 0; i < data.taccountvs1.length; i++) {
                                        if ((data.ttaxcodevs1[i].AccountName) === cogsAccountDataName) {
                                            $('#edtAccountName').attr('readonly', true);
                                            let taxCode = data.taccountvs1[i].TaxCode;
                                            var accountID = data.taccountvs1[i].ID || '';
                                            var acountName = data.taccountvs1[i].AccountName || '';
                                            var accountNo = data.taccountvs1[i].AccountNumber || '';
                                            var accountType = data.taccountvs1[i].AccountTypeName || '';
                                            var accountDesc = data.taccountvs1[i].Description || '';
                                            $('#edtAccountID').val(accountID);
                                            $('#sltAccountType').val(accountType);
                                            $('#edtAccountName').val(acountName);
                                            $('#edtAccountNo').val(accountNo);
                                            $('#sltTaxCode').val(taxCode);
                                            $('#txaAccountDescription').val(accountDesc);
                                            setTimeout(function () {
                                                $('#addAccountModal').modal('toggle');
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
                                let useData = data.taccountvs1;
                                let lineItems = [];
                                let lineItemObj = {};
                                for (let i = 0; i < useData.length; i++) {
                                    if ((useData[i].fields.AccountName) === cogsAccountDataName) {
                                        $('#edtAccountName').attr('readonly', true);
                                        let taxCode = useData[i].fields.TaxCode;
                                        var accountID = useData[i].fields.ID || '';
                                        var acountName = useData[i].fields.AccountName || '';
                                        var accountNo = useData[i].fields.AccountNumber || '';
                                        var accountType = useData[i].fields.AccountTypeName || '';
                                        var accountDesc = useData[i].fields.Description || '';
                                        $('#edtAccountID').val(accountID);
                                        $('#sltAccountType').val(accountType);
                                        $('#edtAccountName').val(acountName);
                                        $('#edtAccountNo').val(accountNo);
                                        $('#sltTaxCode').val(taxCode);
                                        $('#txaAccountDescription').val(accountDesc);
                                        $('#addAccountModal').modal('toggle');
                                        //}, 500);
                                    }
                                }
                            }
                        }).catch(function (err) {
                            productService.getAccountName().then(function (data) {
                                let lineItems = [];
                                let lineItemObj = {};
                                for (let i = 0; i < data.taccountvs1.length; i++) {
                                    if ((data.ttaxcodevs1[i].CodeName) === taxRateDataName) {
                                        $('#edtTaxNamePop').attr('readonly', true);
                                        let taxCode = data.taccountvs1[i].TaxCode;
                                        var accountID = data.taccountvs1[i].ID || '';
                                        var acountName = data.taccountvs1[i].AccountName || '';
                                        var accountNo = data.taccountvs1[i].AccountNumber || '';
                                        var accountType = data.taccountvs1[i].AccountTypeName || '';
                                        var accountDesc = data.taccountvs1[i].Description || '';
                                        $('#edtAccountID').val(accountID);
                                        $('#sltAccountType').val(accountType);
                                        $('#edtAccountName').val(acountName);
                                        $('#edtAccountNo').val(accountNo);
                                        $('#sltTaxCode').val(taxCode);
                                        $('#txaAccountDescription').val(accountDesc);
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
                        templateObject.getAccountsByCategory(accountType);
                    }

                }
            });

            $('#sltcogsaccount').editableSelect()
            .on('click.editable-select', function (e, li) {
                accSelected = "cogs";
                $('#accSelected').val(accSelected);
                var $earch = $(this);
                var offset = $earch.offset();
                var cogsAccountDataName = e.target.value || '';
                var accountType = "COGS";
                if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                    templateObject.getAccountsByCategory(accountType);

                } else {
                    if (cogsAccountDataName.replace(/\s/g, '') != '') {
                        $('#add-account-title').text('Edit Account Details');
                        getVS1Data('TAccountVS1').then(function (dataObject) {
                            if (dataObject.length == 0) {
                                productService.getAccountName().then(function (data) {
                                    let lineItems = [];
                                    let lineItemObj = {};
                                    for (let i = 0; i < data.taccountvs1.length; i++) {
                                        if ((data.taccountvs1[i].AccountName) === cogsAccountDataName) {
                                            $('#edtAccountName').attr('readonly', true);
                                            let taxCode = data.taccountvs1[i].TaxCode;
                                            var accountID = data.taccountvs1[i].ID || '';
                                            var acountName = data.taccountvs1[i].AccountName || '';
                                            var accountNo = data.taccountvs1[i].AccountNumber || '';
                                            var accountType = data.taccountvs1[i].AccountTypeName || '';
                                            var accountDesc = data.taccountvs1[i].Description || '';
                                            $('#edtAccountID').val(accountID);
                                            $('#sltAccountType').val(accountType);
                                            $('#edtAccountName').val(acountName);
                                            $('#edtAccountNo').val(accountNo);
                                            $('#sltTaxCode').val(taxCode);
                                            $('#txaAccountDescription').val(accountDesc);
                                            setTimeout(function () {
                                                $('#addAccountModal').modal('toggle');
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
                                let useData = data.taccountvs1;
                                let lineItems = [];
                                let lineItemObj = {};
                                $('#add-account-title').text('Edit Account Details');
                                for (let i = 0; i < useData.length; i++) {
                                    if ((useData[i].fields.AccountName) === cogsAccountDataName) {
                                        $('#edtAccountName').attr('readonly', true);
                                        let taxCode = useData[i].fields.TaxCode;
                                        var accountID = useData[i].fields.ID || '';
                                        var acountName = useData[i].fields.AccountName || '';
                                        var accountNo = useData[i].fields.AccountNumber || '';
                                        var accountType = useData[i].fields.AccountTypeName || '';
                                        var accountDesc = useData[i].fields.Description || '';
                                        $('#edtAccountID').val(accountID);
                                        $('#sltAccountType').val(accountType);
                                        $('#edtAccountName').val(acountName);
                                        $('#edtAccountNo').val(accountNo);
                                        $('#sltTaxCode').val(taxCode);
                                        $('#txaAccountDescription').val(accountDesc);
                                        $('#addAccountModal').modal('toggle');
                                        //}, 500);
                                    }
                                }
                            }
                        }).catch(function (err) {
                            productService.getAccountName().then(function (data) {
                                let lineItems = [];
                                let lineItemObj = {};
                                for (let i = 0; i < data.taccountvs1.length; i++) {
                                    if ((data.taccountvs1[i].CodeName) === taxRateDataName) {
                                        $('#edtAccountName').attr('readonly', true);
                                        let taxCode = data.taccountvs1[i].TaxCode;
                                        var accountID = data.taccountvs1[i].ID || '';
                                        var acountName = data.taccountvs1[i].AccountName || '';
                                        var accountNo = data.taccountvs1[i].AccountNumber || '';
                                        var accountType = data.taccountvs1[i].AccountTypeName || '';
                                        var accountDesc = data.taccountvs1[i].Description || '';
                                        $('#edtAccountID').val(accountID);
                                        $('#sltAccountType').val(accountType);
                                        $('#edtAccountName').val(acountName);
                                        $('#edtAccountNo').val(accountNo);
                                        $('#sltTaxCode').val(taxCode);
                                        $('#txaAccountDescription').val(accountDesc);
                                        setTimeout(function () {
                                            $('#addAccountModal').modal('toggle');
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
                        templateObject.getAccountsByCategory(accountType);
                    }

                }
            });

            $('#sltsalesacount').editableSelect()
            .on('click.editable-select', function (e, li) {
                accSelected = "sales";
                $('#accSelected').val(accSelected);
                var $earch = $(this);
                var offset = $earch.offset();
                var salesAccountDataName = e.target.value || '';
                var accountType = "INC";
                if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                    templateObject.getAccountsByCategory(accountType);

                } else {
                    if (salesAccountDataName.replace(/\s/g, '') != '') {
                        if (salesAccountDataName.replace(/\s/g, '') != '') {
                            $('#add-account-title').text('Edit Account Details');
                            getVS1Data('TAccountVS1').then(function (dataObject) {
                                if (dataObject.length == 0) {
                                    productService.getAccountName().then(function (data) {
                                        let lineItems = [];
                                        let lineItemObj = {};
                                        for (let i = 0; i < data.taccountvs1.length; i++) {
                                            if ((data.taccountvs1[i].AccountName) === salesAccountDataName) {
                                                $('#edtAccountName').attr('readonly', true);
                                                let taxCode = data.taccountvs1[i].TaxCode;
                                                var accountID = data.taccountvs1[i].ID || '';
                                                var acountName = data.taccountvs1[i].AccountName || '';
                                                var accountNo = data.taccountvs1[i].AccountNumber || '';
                                                var accountType = data.taccountvs1[i].AccountTypeName || '';
                                                var accountDesc = data.taccountvs1[i].Description || '';
                                                $('#edtAccountID').val(accountID);
                                                $('#sltAccountType').val(accountType);
                                                $('#edtAccountName').val(acountName);
                                                $('#edtAccountNo').val(accountNo);
                                                $('#sltTaxCode').val(taxCode);
                                                $('#txaAccountDescription').val(accountDesc);
                                                setTimeout(function () {
                                                    $('#addAccountModal').modal('toggle');
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
                                    let useData = data.taccountvs1;
                                    let lineItems = [];
                                    let lineItemObj = {};
                                   $('#add-account-title').text('Edit Account Details');;
                                    for (let i = 0; i < useData.length; i++) {
                                        if ((useData[i].fields.AccountName) === salesAccountDataName) {
                                            $('#edtAccountName').attr('readonly', true);
                                            let taxCode = useData[i].fields.TaxCode;
                                            var accountID = useData[i].fields.ID || '';
                                            var acountName = useData[i].fields.AccountName || '';
                                            var accountNo = useData[i].fields.AccountNumber || '';
                                            var accountType = useData[i].fields.AccountTypeName || '';
                                            var accountDesc = useData[i].fields.Description || '';
                                            $('#edtAccountID').val(accountID);
                                            $('#sltAccountType').val(accountType);
                                            $('#edtAccountName').val(acountName);
                                            $('#edtAccountNo').val(accountNo);
                                            $('#sltTaxCode').val(taxCode);
                                            $('#txaAccountDescription').val(accountDesc);
                                            $('#addAccountModal').modal('toggle');
                                            //}, 500);
                                        }
                                    }
                                }
                            }).catch(function (err) {
                                productService.getAccountName().then(function (data) {
                                    let lineItems = [];
                                    let lineItemObj = {};
                                    for (let i = 0; i < data.taccountvs1.length; i++) {
                                        if ((data.taccountvs1[i].AccountName) === salesAccountDataName) {
                                            $('#add-account-title').text('Edit Account Details');
                                            let taxCode = data.taccountvs1[i].TaxCode;
                                            var accountID = data.taccountvs1[i].ID || '';
                                            var acountName = data.taccountvs1[i].AccountName || '';
                                            var accountNo = data.taccountvs1[i].AccountNumber || '';
                                            var accountType = data.taccountvs1[i].AccountTypeName || '';
                                            var accountDesc = data.taccountvs1[i].Description || '';
                                            $('#edtAccountID').val(accountID);
                                            $('#sltAccountType').val(accountType);
                                            $('#edtAccountName').val(acountName);
                                            $('#edtAccountNo').val(accountNo);
                                            $('#sltTaxCode').val(taxCode);
                                            $('#txaAccountDescription').val(accountDesc);
                                            setTimeout(function () {
                                                $('#addAccountModal').modal('toggle');
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
                            templateObject.getAccountsByCategory(accountType);
                        }
                    } else {
                        templateObject.getAccountsByCategory(accountType);
                    }

                }
            });

            $('#slttaxcodesales').editableSelect()
            .on('click.editable-select', function (e, li) {
                var $earch = $(this);
                taxSelected = "sales";
                $("#taxSelected").val(taxSelected);
                var offset = $earch.offset();
                var taxRateDataName = e.target.value || '';
                var taxCodePurchaseDataName = e.target.value || '';
                if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                    $('#taxRateListModal').modal('toggle');
                } else {
                    if (taxRateDataName.replace(/\s/g, '') != '') {
                        $('.taxcodepopheader').text('Edit Tax Rate');
                        getVS1Data('TTaxcodeVS1').then(function (dataObject) {
                            if (dataObject.length == 0) {
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

        //On Click Account List
    $(document).on("click", "#tblTaxRate tbody tr", function (e) {
        var table = $(this);
        let lineTaxCode = table.find(".taxName").text();
         if (taxSelected == "sales") {
                $('#slttaxcodesales').val(lineTaxCode);

                let utilityService = new UtilityService();
                let taxcodeList = templateObject.taxraterecords.get();
                var taxRate = lineTaxCode;
                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxRate) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }

                let sellPrice = $('#edtsellqty1price').val() || 0;
                let sellPriceInc = 0;

                if (!isNaN(sellPrice)) {
                    $('#edtsellqty1price').val(utilityService.modifynegativeCurrencyFormat(sellPrice));
                } else {
                    sellPrice = parseFloat(sellPrice.replace(/[^0-9.-]+/g, ""));
                    $('#edtsellqty1price').val(utilityService.modifynegativeCurrencyFormat(sellPrice));
                }

                var taxTotal = parseFloat(sellPrice) * parseFloat(taxrateamount);
                sellPriceInc = parseFloat(sellPrice) + taxTotal;
                if (!isNaN(sellPriceInc)) {
                    $('#edtsellqty1priceInc').val(utilityService.modifynegativeCurrencyFormat(sellPriceInc));
                }

                $('.itemExtraSellRow').each(function () {
                    var lineID = this.id;
                    let tdclientType = $('#' + lineID + " .customerTypeSelect").val();
                    if (tdclientType == "Default") {
                        $('#' + lineID + " .edtDiscount").val(0);
                        $('#' + lineID + " .edtPriceEx").val(utilityService.modifynegativeCurrencyFormat(sellPrice));
                    }

                });

            } else if (taxSelected == "purchase") {
                $('#slttaxcodepurchase').val(lineTaxCode);
                let utilityService = new UtilityService();
                let costPrice = $('#edtbuyqty1cost').val() || 0;
                let taxcodeList = templateObject.taxraterecords.get();
                var taxRate = lineTaxCode;
                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxRate) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }

                let costPriceInc = 0;

                if (!isNaN(costPrice)) {
                    $('#edtbuyqty1cost').val(utilityService.modifynegativeCurrencyFormat(costPrice));
                } else {
                    costPrice = parseFloat($('#edtbuyqty1cost').val().replace(/[^0-9.-]+/g, "")) || 0;
                    $('#edtbuyqty1cost').val(utilityService.modifynegativeCurrencyFormat(costPrice));
                }
                var taxTotal = parseFloat(costPrice) * parseFloat(taxrateamount);
                costPriceInc = parseFloat(costPrice) + taxTotal;
                if (!isNaN(costPriceInc)) {
                    $('#edtbuyqty1costInc').val(utilityService.modifynegativeCurrencyFormat(costPriceInc));
                }

            }
        $('#taxRateListModal').modal('toggle');
    });

        $(document).on("click", "#tblAccount tbody tr", function (e) {
            var table = $(this);
            let accountsName = table.find(".productName").text();
            if (accSelected == "cogs") {
                $('#sltcogsaccount').val(accountsName);
            } else if (accSelected == "sales") {
                $('#sltsalesacount').val(accountsName);
            } else if (accSelected == "inventory") {
                $('#sltinventoryacount').val(accountsName);
            }
            $('#accountListModal').modal('toggle');
        });

    });



    //On Click Client Type List
    $(document).on("click", "#clienttypeList tbody tr", function (e) {
        var table = $(this);
        let custTypeName = table.find(".colClientTypeName").text();
        $('#sltCustomerType').val(custTypeName);
        $('#customerTypeListModal').modal('toggle');
    });

    templateObject.getAccountNames = function () {
        getVS1Data('TAccountVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                productService.getAccountName().then(function (data) {

                    let productData = templateObject.records.get();
                    for (let i in data.taccount) {

                        let accountnamerecordObj = {
                            accountname: data.taccount[i].AccountName || ' '
                        };
                        if ((data.taccount[i].AccountTypeName == "COGS")) {
                            coggsaccountrecords.push(accountnamerecordObj);
                            templateObject.coggsaccountrecords.set(coggsaccountrecords);
                        }

                        if ((data.taccount[i].AccountTypeName == "INC")) {
                            salesaccountrecords.push(accountnamerecordObj);
                            templateObject.salesaccountrecords.set(salesaccountrecords);
                        }

                        if ((data.taccount[i].AccountTypeName == "OCASSET")) {
                            inventoryaccountrecords.push(accountnamerecordObj);
                            templateObject.inventoryaccountrecords.set(inventoryaccountrecords);
                        }

                    }

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.taccountvs1;
                let productData = templateObject.records.get();
                for (let i in useData) {

                    let accountnamerecordObj = {
                        accountname: useData[i].fields.AccountName || ' '
                    };
                    if ((useData[i].fields.AccountTypeName == "COGS")) {
                        coggsaccountrecords.push(accountnamerecordObj);
                        templateObject.coggsaccountrecords.set(coggsaccountrecords);
                    }

                    if ((useData[i].fields.AccountTypeName == "INC")) {
                        salesaccountrecords.push(accountnamerecordObj);
                        templateObject.salesaccountrecords.set(salesaccountrecords);
                    }
                    if ((useData[i].fields.AccountTypeName == "OCASSET")) {
                        inventoryaccountrecords.push(accountnamerecordObj);
                        templateObject.inventoryaccountrecords.set(inventoryaccountrecords);
                    }

                }

            }
        }).catch(function (err) {
            productService.getAccountName().then(function (data) {

                let productData = templateObject.records.get();
                for (let i in data.taccount) {

                    let accountnamerecordObj = {
                        accountname: data.taccount[i].AccountName || ' '
                    };
                    if ((data.taccount[i].AccountTypeName == "COGS")) {
                        coggsaccountrecords.push(accountnamerecordObj);
                        templateObject.coggsaccountrecords.set(coggsaccountrecords);
                    }

                    if ((data.taccount[i].AccountTypeName == "INC")) {
                        salesaccountrecords.push(accountnamerecordObj);
                        templateObject.salesaccountrecords.set(salesaccountrecords);
                    }

                    if ((data.taccount[i].AccountTypeName == "OCASSET")) {
                        inventoryaccountrecords.push(accountnamerecordObj);
                        templateObject.inventoryaccountrecords.set(inventoryaccountrecords);
                    }

                }

            });
        });

    }

    templateObject.getAllTaxCodes = function () {
        getVS1Data('TTaxcodeVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                productService.getTaxCodesVS1().then(function (data) {

                    for (let i = 0; i < data.ttaxcodevs1.length; i++) {

                        let taxcoderecordObj = {
                            codename: data.ttaxcodevs1[i].CodeName || ' ',
                            coderate: data.ttaxcodevs1[i].Rate || 0,
                        };

                        taxCodesList.push(taxcoderecordObj);

                    }
                    templateObject.taxraterecords.set(taxCodesList);

                })
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.ttaxcodevs1;
                for (let i = 0; i < useData.length; i++) {

                    let taxcoderecordObj = {
                        codename: useData[i].CodeName || ' ',
                        coderate: useData[i].Rate || 0,
                    };

                    taxCodesList.push(taxcoderecordObj);

                }
                templateObject.taxraterecords.set(taxCodesList);

            }
        }).catch(function (err) {
            productService.getTaxCodesVS1().then(function (data) {

                for (let i = 0; i < data.ttaxcodevs1.length; i++) {

                    let taxcoderecordObj = {
                        codename: data.ttaxcodevs1[i].CodeName || ' ',
                        coderate: data.ttaxcodevs1[i].Rate || 0,
                    };

                    taxCodesList.push(taxcoderecordObj);

                }
                templateObject.taxraterecords.set(taxCodesList);

            })
        });

    };

    templateObject.getAllTaxCodes = function () {
        getVS1Data('TTaxcodeVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                productService.getTaxCodesVS1().then(function (data) {

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
                            lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
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
                        lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
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
            productService.getTaxCodesVS1().then(function (data) {

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
                        lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
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

    templateObject.getDepartments = function () {
        getVS1Data('TDeptClass').then(function (dataObject) {
            if (dataObject.length == 0) {
                productService.getDepartment().then(function (data) {
                    for (let i in data.tdeptclass) {

                        let deptrecordObj = {
                            department: data.tdeptclass[i].DeptClassName || ' ',
                        };

                        deptrecords.push(deptrecordObj);
                        templateObject.deptrecords.set(deptrecords);

                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tdeptclass;
                for (let i in useData) {

                    let deptrecordObj = {
                        department: useData[i].DeptClassName || ' ',
                    };

                    deptrecords.push(deptrecordObj);
                    templateObject.deptrecords.set(deptrecords);

                }

            }
        }).catch(function (err) {
            productService.getDepartment().then(function (data) {
                for (let i in data.tdeptclass) {

                    let deptrecordObj = {
                        department: data.tdeptclass[i].DeptClassName || ' ',
                    };

                    deptrecords.push(deptrecordObj);
                    templateObject.deptrecords.set(deptrecords);

                }
            });
        });

    }

    templateObject.getClientTypeData = function () {
        getVS1Data('TClientType').then(function (dataObject) {
            if (dataObject.length == 0) {
                productService.getClientTypeData().then((data) => {

                    for (let i = 0; i < data.tclienttype.length; i++) {
                        clientType.push(data.tclienttype[i].fields.TypeName);
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
            productService.getClientTypeData().then((data) => {

                for (let i = 0; i < data.tclienttype.length; i++) {

                    clientType.push(data.tclienttype[i].fields.TypeName)
                }
                clientType = _.sortBy(clientType);
                templateObject.clienttypeList.set(clientType);
            });
        });

    };

    setTimeout(function () {
        templateObject.getAccountNames();
        templateObject.getAllTaxCodes();
        templateObject.getDepartments();
        templateObject.getClientTypeData();
    }, 500);

    let isInventory = Session.get('CloudInventoryModule');
    if (isInventory) {
        templateObject.includeInventory.set(true);
    }

    var url = FlowRouter.current().path;
    var getprod_id = url.split('?id=');
    var getprod_name = url.split('?prodname=');
    var currentProductID = FlowRouter.current().queryParams.id;
    var currentProductName = FlowRouter.current().queryParams.prodname;
    let lineExtaSellItems = [];
    let lineExtaSellObj = {};
    if (FlowRouter.current().queryParams.id) {

        currentProductID = parseInt(currentProductID);

        templateObject.getProductData = function () {

            getVS1Data('TProductVS1').then(function (dataObject) {
                if (dataObject.length == 0) {
                    productService.getOneProductdatavs1(currentProductID).then(function (data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];
                        let lineItemObj = {};
                        let currencySymbol = Currency;
                        let totalquantity = 0;
                        let productrecord = {
                            id: data.fields.ID,
                            productname: data.fields.ProductName,
                            lib: data.fields.ProductName,
                            productcode: data.fields.PRODUCTCODE,
                            productprintName: data.fields.ProductPrintName,
                            assetaccount: data.fields.AssetAccount,
                            buyqty1cost: utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1Cost),
                            buyqty1costinc: utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1CostInc),
                            cogsaccount: data.fields.CogsAccount,
                            taxcodepurchase: data.fields.TaxCodePurchase,
                            purchasedescription: data.fields.PurchaseDescription,
                            sellqty1price: utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1Price),
                            sellqty1priceinc: utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1PriceInc),
                            incomeaccount: data.fields.IncomeAccount,
                            taxcodesales: data.fields.TaxCodeSales,
                            salesdescription: data.fields.SalesDescription,
                            active: data.fields.Active,
                            lockextrasell: data.fields.LockExtraSell,
                            customfield1: data.fields.CUSTFLD1,
                            customfield2: data.fields.CUSTFLD2,
                            //totalqtyinstock : totalquantity,
                            barcode: data.fields.BARCODE,
                            // data.fields.TotalQtyInStock,
                            totalqtyonorder: data.fields.TotalQtyOnOrder,
                            //productclass :lineItems
                        };

                        setTimeout(function () {
                            $("#sltsalesacount").val(data.fields.IncomeAccount);
                            $("#sltcogsaccount").val(data.fields.CogsAccount);
                            $("#sltinventoryacount").val(data.fields.AssetAccount);
                            $("#slttaxcodesales").val(data.fields.TaxCodeSales);
                            $("#slttaxcodepurchase").val(data.fields.TaxCodePurchase);
                        }, 1000);

                        if (data.fields.ExtraSellPrice == null) {
                            lineExtaSellObj = {
                                lineID: Random.id(),
                                clienttype: '',
                                discount: '',
                                datefrom: '',
                                dateto: '',
                                price: 0
                            };
                            lineExtaSellItems.push(lineExtaSellObj);
                            templateObject.productExtraSell.set(lineExtaSellItems);
                        } else {
                            templateObject.isExtraSellChecked.set(true);
                            for (let e = 0; e < data.fields.ExtraSellPrice.length; e++) {
                                lineExtaSellObj = {
                                    lineID: Random.id(),
                                    clienttype: data.fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                                    discount: data.fields.ExtraSellPrice[e].fields.QtyPercent1 || 0,
                                    datefrom: data.fields.ExtraSellPrice[e].fields.DateFrom || '',
                                    dateto: data.fields.ExtraSellPrice[e].fields.DateTo || '',
                                    price: utilityService.modifynegativeCurrencyFormat(data.fields.ExtraSellPrice[e].fields.Price1) || 0
                                };
                                lineExtaSellItems.push(lineExtaSellObj);

                            }
                            templateObject.productExtraSell.set(lineExtaSellItems);
                        }

                        let itrackItem = data.fields.LockExtraSell;
                        if (itrackItem == true) {
                            templateObject.isTrackChecked.set(true);
                        } else {
                            templateObject.isTrackChecked.set(false);
                        }
                        if (data.fields.ProductType == "INV") {
                            templateObject.isTrackChecked.set(true);
                        } else {
                            templateObject.isTrackChecked.set(false);
                        }
                        $('#sltsalesacount').val(data.fields.IncomeAccount);
                        $('#sltcogsaccount').val(data.fields.CogsAccount);

                        templateObject.records.set(productrecord);
                    }).catch(function (err) {

                        $('.fullScreenSpin').css('display', 'none');
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tproductvs1;

                    var added = false;

                    for (let i = 0; i < useData.length; i++) {
                        if (parseInt(useData[i].fields.ID) === currentProductID) {

                            added = true;
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let lineItemObj = {};
                            let currencySymbol = Currency;
                            let totalquantity = 0;

                            let productrecord = {
                                id: useData[i].fields.ID,
                                productname: useData[i].fields.ProductName,
                                lib: useData[i].fields.ProductName,
                                productcode: useData[i].fields.PRODUCTCODE,
                                productprintName: useData[i].fields.ProductPrintName,
                                assetaccount: useData[i].fields.AssetAccount,
                                buyqty1cost: utilityService.modifynegativeCurrencyFormat(useData[i].fields.BuyQty1Cost),
                                buyqty1costinc: utilityService.modifynegativeCurrencyFormat(useData[i].fields.BuyQty1CostInc),
                                cogsaccount: useData[i].fields.CogsAccount,
                                taxcodepurchase: useData[i].fields.TaxCodePurchase,
                                purchasedescription: useData[i].fields.PurchaseDescription,
                                sellqty1price: utilityService.modifynegativeCurrencyFormat(useData[i].fields.SellQty1Price),
                                sellqty1priceinc: utilityService.modifynegativeCurrencyFormat(useData[i].fields.SellQty1PriceInc),
                                incomeaccount: useData[i].fields.IncomeAccount,
                                taxcodesales: useData[i].fields.TaxCodeSales,
                                salesdescription: useData[i].fields.SalesDescription,
                                active: useData[i].fields.Active,
                                lockextrasell: useData[i].fields.LockExtraSell,
                                customfield1: useData[i].fields.CUSTFLD1,
                                customfield2: useData[i].fields.CUSTFLD2,
                                //totalqtyinstock : totalquantity,
                                barcode: useData[i].fields.BARCODE,
                                // useData[i].fields.TotalQtyInStock,
                                totalqtyonorder: useData[i].fields.TotalQtyOnOrder,
                                //productclass :lineItems
                            };

                            setTimeout(function () {
                                $("#sltsalesacount").val(useData[i].fields.IncomeAccount);
                                $("#sltcogsaccount").val(useData[i].fields.CogsAccount);
                                $("#sltinventoryacount").val(useData[i].fields.AssetAccount);
                                $("#slttaxcodesales").val(useData[i].fields.TaxCodeSales);
                                $("#slttaxcodepurchase").val(useData[i].fields.TaxCodePurchase);
                                if(useData[i].fields.CUSTFLD14 == 'true'){
                                  $('.lblPriceEx').addClass('hiddenColumn');
                                  $('.lblPriceEx').removeClass('showColumn');

                                  $('.lblPriceInc').addClass('showColumn');
                                  $('.lblPriceInc').removeClass('hiddenColumn');

                                  $('#edtsellqty1priceInc').removeClass('hiddenColumn');
                                  $('#edtsellqty1priceInc').addClass('showColumn');

                                  $('#edtsellqty1price').addClass('hiddenColumn');
                                  $('#edtsellqty1price').removeClass('showColumn');
                                  $('.lblPriceCheckStatus').val('true');
                                }else if(useData[i].fields.CUSTFLD14 == 'false'){
                                  $('.lblPriceInc').addClass('hiddenColumn');
                                  $('.lblPriceInc').removeClass('showColumn');

                                  $('.lblPriceEx').addClass('showColumn');
                                  $('.lblPriceEx').removeClass('hiddenColumn');

                                  $('#edtsellqty1priceInc').addClass('hiddenColumn');
                                  $('#edtsellqty1priceInc').removeClass('showColumn');

                                  $('#edtsellqty1price').removeClass('hiddenColumn');
                                  $('#edtsellqty1price').addClass('showColumn');
                                  $('.lblPriceCheckStatus').val('false');
                                }
                                if(useData[i].fields.CUSTFLD15 == 'true'){
                                  $('.lblCostEx').addClass('hiddenColumn');
                                  $('.lblCostEx').removeClass('showColumn');

                                  $('.lblCostInc').addClass('showColumn');
                                  $('.lblCostInc').removeClass('hiddenColumn');

                                  $('#edtbuyqty1costInc').removeClass('hiddenColumn');
                                  $('#edtbuyqty1costInc').addClass('showColumn');

                                  $('#edtbuyqty1cost').addClass('hiddenColumn');
                                  $('#edtbuyqty1cost').removeClass('showColumn');

                                  $('.lblCostCheckStatus').val('true');
                                }else if(useData[i].fields.CUSTFLD15 == 'false'){
                                  $('.lblCostInc').addClass('hiddenColumn');
                                  $('.lblCostInc').removeClass('showColumn');

                                  $('.lblCostEx').addClass('showColumn');
                                  $('.lblCostEx').removeClass('hiddenColumn');

                                  $('#edtbuyqty1costInc').addClass('hiddenColumn');
                                  $('#edtbuyqty1costInc').removeClass('showColumn');

                                  $('#edtbuyqty1cost').removeClass('hiddenColumn');
                                  $('#edtbuyqty1cost').addClass('showColumn');
                                  $('.lblCostCheckStatus').val('false');
                                }
                            }, 1000);
                            if (useData[i].fields.ExtraSellPrice == null) {
                                lineExtaSellObj = {
                                    lineID: Random.id(),
                                    clienttype: '',
                                    discount: '',
                                    datefrom: '',
                                    dateto: '',
                                    price: 0
                                };
                                lineExtaSellItems.push(lineExtaSellObj);
                                templateObject.productExtraSell.set(lineExtaSellItems);
                            } else {
                                templateObject.isExtraSellChecked.set(true);
                                for (let e = 0; e < useData[i].fields.ExtraSellPrice.length; e++) {
                                    lineExtaSellObj = {
                                        lineID: Random.id(),
                                        clienttype: useData[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                                        discount: useData[i].fields.ExtraSellPrice[e].fields.QtyPercent1 || 0,
                                        datefrom: useData[i].fields.ExtraSellPrice[e].fields.DateFrom || '',
                                        dateto: useData[i].fields.ExtraSellPrice[e].fields.DateTo || '',
                                        price: utilityService.modifynegativeCurrencyFormat(useData[i].fields.ExtraSellPrice[e].fields.Price1) || 0
                                    };
                                    lineExtaSellItems.push(lineExtaSellObj);

                                }
                                templateObject.productExtraSell.set(lineExtaSellItems);
                            }
                            let itrackItem = useData[i].fields.LockExtraSell;
                            if (itrackItem == true) {
                                templateObject.isTrackChecked.set(true);
                            } else {
                                templateObject.isTrackChecked.set(false);
                            }

                            if (useData[i].fields.ProductType == "INV") {
                                templateObject.isTrackChecked.set(true);
                            } else {
                                templateObject.isTrackChecked.set(false);
                            }
                            $('#sltsalesacount').val(useData[i].fields.IncomeAccount);
                            $('#sltcogsaccount').val(useData[i].fields.CogsAccount);

                            templateObject.records.set(productrecord);
                        }
                    }
                    if (!added) {
                        productService.getOneProductdatavs1(currentProductID).then(function (data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let lineItemObj = {};
                            let currencySymbol = Currency;
                            let totalquantity = 0;

                            let productrecord = {
                                id: data.fields.ID,
                                productname: data.fields.ProductName,
                                lib: data.fields.ProductName,
                                productcode: data.fields.PRODUCTCODE,
                                productprintName: data.fields.ProductPrintName,
                                assetaccount: data.fields.AssetAccount,
                                buyqty1cost: utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1Cost),
                                buyqty1costinc: utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1CostInc),
                                cogsaccount: data.fields.CogsAccount,
                                taxcodepurchase: data.fields.TaxCodePurchase,
                                purchasedescription: data.fields.PurchaseDescription,
                                sellqty1price: utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1Price),
                                sellqty1priceinc: utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1PriceInc),
                                incomeaccount: data.fields.IncomeAccount,
                                taxcodesales: data.fields.TaxCodeSales,
                                salesdescription: data.fields.SalesDescription,
                                active: data.fields.Active,
                                lockextrasell: data.fields.LockExtraSell,
                                customfield1: data.fields.CUSTFLD1,
                                customfield2: data.fields.CUSTFLD2,
                                //totalqtyinstock : totalquantity,
                                barcode: data.fields.BARCODE,
                                // data.fields.TotalQtyInStock,
                                totalqtyonorder: data.fields.TotalQtyOnOrder,
                                //productclass :lineItems
                            };

                            if (data.fields.ExtraSellPrice == null) {
                                lineExtaSellObj = {
                                    lineID: Random.id(),
                                    clienttype: '',
                                    discount: '',
                                    datefrom: '',
                                    dateto: '',
                                    price: 0
                                };
                                lineExtaSellItems.push(lineExtaSellObj);
                                templateObject.productExtraSell.set(lineExtaSellItems);
                            } else {
                                templateObject.isExtraSellChecked.set(true);
                                for (let e = 0; e < data.fields.ExtraSellPrice.length; e++) {
                                    lineExtaSellObj = {
                                        lineID: Random.id(),
                                        clienttype: data.fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                                        discount: data.fields.ExtraSellPrice[e].fields.QtyPercent1 || 0,
                                        datefrom: data.fields.ExtraSellPrice[e].fields.DateFrom || '',
                                        dateto: data.fields.ExtraSellPrice[e].fields.DateTo || '',
                                        price: utilityService.modifynegativeCurrencyFormat(data.fields.ExtraSellPrice[e].fields.Price1) || 0
                                    };
                                    lineExtaSellItems.push(lineExtaSellObj);

                                }
                                templateObject.productExtraSell.set(lineExtaSellItems);
                            }
                            let itrackItem = data.fields.LockExtraSell;
                            if (itrackItem == true) {
                                templateObject.isTrackChecked.set(true);
                            } else {
                                templateObject.isTrackChecked.set(false);
                            }
                            if (data.fields.ProductType == "INV") {
                                templateObject.isTrackChecked.set(true);
                            } else {
                                templateObject.isTrackChecked.set(false);
                            }
                            $('#sltsalesacount').val(data.fields.IncomeAccount);
                            $('#sltcogsaccount').val(data.fields.CogsAccount);

                            templateObject.records.set(productrecord);
                        }).catch(function (err) {

                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }
                }
            }).catch(function (err) {
                productService.getOneProductdatavs1(currentProductID).then(function (data) {
                    $('.fullScreenSpin').css('display', 'none');
                    let lineItems = [];
                    let lineItemObj = {};
                    let currencySymbol = Currency;
                    let totalquantity = 0;

                    let productrecord = {
                        id: data.fields.ID,
                        productname: data.fields.ProductName,
                        lib: data.fields.ProductName,
                        productcode: data.fields.PRODUCTCODE,
                        productprintName: data.fields.ProductPrintName,
                        assetaccount: data.fields.AssetAccount,
                        buyqty1cost: utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1Cost),
                        buyqty1costinc: utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1CostInc),
                        cogsaccount: data.fields.CogsAccount,
                        taxcodepurchase: data.fields.TaxCodePurchase,
                        purchasedescription: data.fields.PurchaseDescription,
                        sellqty1price: utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1Price),
                        sellqty1priceinc: utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1PriceInc),
                        incomeaccount: data.fields.IncomeAccount,
                        taxcodesales: data.fields.TaxCodeSales,
                        salesdescription: data.fields.SalesDescription,
                        active: data.fields.Active,
                        lockextrasell: data.fields.LockExtraSell,
                        customfield1: data.fields.CUSTFLD1,
                        customfield2: data.fields.CUSTFLD2,
                        //totalqtyinstock : totalquantity,
                        barcode: data.fields.BARCODE,
                        // data.fields.TotalQtyInStock,
                        totalqtyonorder: data.fields.TotalQtyOnOrder,
                        //productclass :lineItems
                    };

                    setTimeout(function () {
                        $("#sltsalesacount").val(data.fields.IncomeAccount);
                        $("#sltcogsaccount").val(data.fields.CogsAccount);
                        $("#sltinventoryacount").val(data.fields.AssetAccount);
                        $("#slttaxcodesales").val(data.fields.TaxCodeSales);
                        $("#slttaxcodepurchase").val(data.fields.TaxCodePurchase);
                    }, 1000);

                    if (data.fields.ExtraSellPrice == null) {
                        lineExtaSellObj = {
                            lineID: Random.id(),
                            clienttype: '',
                            discount: '',
                            datefrom: '',
                            dateto: '',
                            price: 0
                        };
                        lineExtaSellItems.push(lineExtaSellObj);
                        templateObject.productExtraSell.set(lineExtaSellItems);
                    } else {
                        templateObject.isExtraSellChecked.set(true);
                        for (let e = 0; e < data.fields.ExtraSellPrice.length; e++) {
                            lineExtaSellObj = {
                                lineID: Random.id(),
                                clienttype: data.fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                                discount: data.fields.ExtraSellPrice[e].fields.QtyPercent1 || 0,
                                datefrom: data.fields.ExtraSellPrice[e].fields.DateFrom || '',
                                dateto: data.fields.ExtraSellPrice[e].fields.DateTo || '',
                                price: utilityService.modifynegativeCurrencyFormat(data.fields.ExtraSellPrice[e].fields.Price1) || 0
                            };
                            lineExtaSellItems.push(lineExtaSellObj);

                        }
                        templateObject.productExtraSell.set(lineExtaSellItems);
                    }

                    let itrackItem = data.fields.LockExtraSell;
                    if (itrackItem == true) {
                        templateObject.isTrackChecked.set(true);
                    } else {
                        templateObject.isTrackChecked.set(false);
                    }
                    if (data.fields.ProductType == "INV") {
                        templateObject.isTrackChecked.set(true);
                    } else {
                        templateObject.isTrackChecked.set(false);
                    }
                    $('#sltsalesacount').val(data.fields.IncomeAccount);
                    $('#sltcogsaccount').val(data.fields.CogsAccount);

                    templateObject.records.set(productrecord);
                }).catch(function (err) {

                    $('.fullScreenSpin').css('display', 'none');
                });
            });

            setTimeout(function () {
                var begin_day_value = $('#event_begin_day').attr('value');
                $("#dtDateTo").datepicker({
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
                }).keyup(function (e) {
                    if (e.keyCode == 8 || e.keyCode == 46) {
                        $("#dtDateTo,#dtDateFrom").val('');
                    }
                });

                $("#dtDateFrom").datepicker({
                    showOn: 'button',
                    buttonText: 'Show Date',
                    altField: "#dtDateFrom",
                    buttonImageOnly: true,
                    buttonImage: '/img/imgCal2.png',
                    constrainInput: false,
                    dateFormat: 'd/mm/yy',
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    changeMonth: true,
                    changeYear: true,
                    yearRange: "-90:+10",
                }).keyup(function (e) {
                    if (e.keyCode == 8 || e.keyCode == 46) {
                        $("#dtDateTo,#dtDateFrom").val('');
                    }
                });

                $(".ui-datepicker .ui-state-hihglight").removeClass("ui-state-highlight");
                // var usedNames = {};
                // $("select[name='sltCustomerType'] > option").each(function () {
                //     if(usedNames[this.text]) {
                //         $(this).remove();
                //     } else {
                //         usedNames[this.text] = this.value;
                //     }
                // });

                // $('#sltCustomerType').append(' <option value="newCust"><span class="addType">+ Client Type</span></option>');
            }, 1000);
        }

        templateObject.getProductClassQtyData = function () {
            productService.getOneProductClassQtyData(currentProductID).then(function (data) {
                $('.fullScreenSpin').css('display', 'none');
                let qtylineItems = [];
                let qtylineItemObj = {};
                let currencySymbol = Currency;
                let totaldeptquantity = 0;

                for (let j in data.tproductclassquantity) {
                    qtylineItemObj = {
                        department: data.tproductclassquantity[j].DepartmentName || '',
                        quantity: data.tproductclassquantity[j].InStockQty || 0,
                    }
                    totaldeptquantity += data.tproductclassquantity[j].InStockQty;
                    qtylineItems.push(qtylineItemObj);
                }
                // $('#edttotalqtyinstock').val(totaldeptquantity);
                templateObject.productqtyrecords.set(qtylineItems);
                templateObject.totaldeptquantity.set(totaldeptquantity);

            }).catch(function (err) {

                $('.fullScreenSpin').css('display', 'none');
            });

        }

        templateObject.getProductClassQtyData();
        templateObject.getProductData();

        templateObject.getAllProductRecentTransactions = function () {


            productService.getProductRecentTransactionsAll(currentProductID).then(function (data) {
                recentTransList = [];
                for (let i = 0; i < data.t_vs1_report_productmovement.length; i++) {
                    let recentTranObject = {
                        date: data.t_vs1_report_productmovement[i].TransactionDate != '' ? moment(data.t_vs1_report_productmovement[i].TransactionDate).format("DD/MM/YYYY") : data.t_vs1_report_productmovement[i].TransactionDate,
                        type: data.t_vs1_report_productmovement[i].TranstypeDesc,
                        transactionno: data.t_vs1_report_productmovement[i].TransactionNo,
                        reference: data.t_vs1_report_productmovement[i].TransactionNo,
                        quantity: data.t_vs1_report_productmovement[i].Qty,
                        unitPrice: utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].Price),
                        total: utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].TotalPrice)
                    };
                    recentTransList.push(recentTranObject);
                }

                templateObject.recentTrasactions.set(recentTransList);
                setTimeout(function () {
                    $('#productrecentlist').DataTable({
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
                        info: true,
                        responsive: true,
                        "order": [[1, "asc"]],
                        action: function () {
                            $('#productrecentlist').DataTable().ajax.reload();
                        },

                    }).on('page', function () {}).on('column-reorder', function () {});
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');
                    $('.fullScreenSpin').css('display', 'none');

                }, 0);

                $('#productrecentlist tbody').on('click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".transactiontype").text();

                    if ((listData) && (transactiontype)) {
                        if (transactiontype === 'Quote') {
                            window.open('/quotecard?id=' + listData, '_self');
                        } else if (transactiontype === 'Sales Order') {
                            window.open('/salesordercard?id=' + listData, '_self');
                        } else if (transactiontype === 'Invoice') {
                            window.open('/invoicecard?id=' + listData, '_self');
                        } else if (transactiontype === 'Purchase Order') {
                            window.open('/purchaseordercard?id=' + listData, '_self');
                        } else if (transactiontype === 'Bill') {
                            //window.open('/billcard?id=' + listData,'_self');
                        } else if (transactiontype === 'Credit') {
                            //window.open('/creditcard?id=' + listData,'_self');
                        }

                    }
                });

                $('.product_recent_trans').css('display', 'block');
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(".product_recent_trans").offset().top
                  }, 2000);
                $('.fullScreenSpin').css('display', 'none');
            }).catch(function (err) {

                $('.fullScreenSpin').css('display', 'none');
                $('.product_recent_trans').css('display', 'block');
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(".product_recent_trans").offset().top
                  }, 2000);

                //Bert.alert('<strong>' + err + '</strong>!', 'deleting products failed');
            });

        };

    } else if (FlowRouter.current().queryParams.prodname) {

        currentProductName = currentProductName.replace(/%20/g, " ");
        templateObject.getProductData = function () {

            getVS1Data('TProductVS1').then(function (dataObject) {
                if (dataObject.length == 0) {
                    productService.getOneProductdatavs1byname(currentProductName).then(function (data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];
                        let lineItemObj = {};
                        let currencySymbol = Currency;
                        let totalquantity = 0;
                        currentProductID = data.tproduct[0].fields.ID;
                        templateObject.getProductClassQtyData();
                        let productrecord = {
                            id: data.tproduct[0].fields.ID,
                            productname: data.tproduct[0].fields.ProductName,
                            lib: data.tproduct[0].fields.ProductName,
                            productcode: data.tproduct[0].fields.PRODUCTCODE,
                            productprintName: data.tproduct[0].fields.ProductPrintName,
                            assetaccount: data.tproduct[0].fields.AssetAccount,
                            buyqty1cost: utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost),
                            buyqty1costinc: utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1CostInc),
                            cogsaccount: data.tproduct[0].fields.CogsAccount,
                            taxcodepurchase: data.tproduct[0].fields.TaxCodePurchase,
                            purchasedescription: data.tproduct[0].fields.PurchaseDescription,
                            sellqty1price: utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price),
                            sellqty1priceinc: utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1PriceInc),
                            incomeaccount: data.tproduct[0].fields.IncomeAccount,
                            taxcodesales: data.tproduct[0].fields.TaxCodeSales,
                            salesdescription: data.tproduct[0].fields.SalesDescription,
                            active: data.tproduct[0].fields.Active,
                            lockextrasell: data.tproduct[0].fields.LockExtraSell,
                            customfield1: data.tproduct[0].fields.CUSTFLD1,
                            customfield2: data.tproduct[0].fields.CUSTFLD2,
                            //totalqtyinstock : totalquantity,
                            barcode: data.tproduct[0].fields.BARCODE,
                            // data.fields.TotalQtyInStock,
                            totalqtyonorder: data.tproduct[0].fields.TotalQtyOnOrder,
                            //productclass :lineItems
                        };

                        if (data.tproduct[0].fields.ExtraSellPrice == null) {
                            lineExtaSellObj = {
                                lineID: Random.id(),
                                clienttype: '',
                                discount: '',
                                datefrom: '',
                                dateto: '',
                                price: 0
                            };
                            lineExtaSellItems.push(lineExtaSellObj);
                            templateObject.productExtraSell.set(lineExtaSellItems);
                        } else {
                            templateObject.isExtraSellChecked.set(true);
                            for (let e = 0; e < data.tproduct[0].fields.ExtraSellPrice.length; e++) {
                                lineExtaSellObj = {
                                    lineID: Random.id(),
                                    clienttype: data.tproduct[0].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                                    discount: data.tproduct[0].fields.ExtraSellPrice[e].fields.QtyPercent1 || 0,
                                    datefrom: data.tproduct[0].fields.ExtraSellPrice[e].fields.DateFrom || '',
                                    dateto: data.tproduct[0].fields.ExtraSellPrice[e].fields.DateTo || '',
                                    price: utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.ExtraSellPrice[e].fields.Price1) || 0
                                };
                                lineExtaSellItems.push(lineExtaSellObj);

                            }
                            templateObject.productExtraSell.set(lineExtaSellItems);
                        }
                        let itrackItem = data.tproduct[0].fields.LockExtraSell;
                        if (itrackItem == true) {
                            templateObject.isTrackChecked.set(true);
                        } else {
                            templateObject.isTrackChecked.set(false);
                        }
                        if (data.tproduct[0].fields.ProductType == "INV") {
                            templateObject.isTrackChecked.set(true);
                        } else {
                            templateObject.isTrackChecked.set(false);
                        }
                        $('#sltsalesacount').val(data.tproduct[0].fields.IncomeAccount);
                        $('#sltcogsaccount').val(data.tproduct[0].fields.CogsAccount);

                        templateObject.records.set(productrecord);
                    }).catch(function (err) {

                        $('.fullScreenSpin').css('display', 'none');
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tproductvs1;
                    var added = false;

                    for (let i = 0; i < useData.length; i++) {
                        if (useData[i].fields.ProductName === currentProductName) {
                            added = true;
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let lineItemObj = {};
                            let currencySymbol = Currency;
                            let totalquantity = 0;
                            currentProductID = useData[i].fields.ID;
                            templateObject.getProductClassQtyData();
                            let productrecord = {
                                id: useData[i].fields.ID,
                                productname: useData[i].fields.ProductName,
                                lib: useData[i].fields.ProductName,
                                productcode: useData[i].fields.PRODUCTCODE,
                                productprintName: useData[i].fields.ProductPrintName,
                                assetaccount: useData[i].fields.AssetAccount,
                                buyqty1cost: utilityService.modifynegativeCurrencyFormat(useData[i].fields.BuyQty1Cost),
                                buyqty1costinc: utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1CostInc),
                                cogsaccount: useData[i].fields.CogsAccount,
                                taxcodepurchase: useData[i].fields.TaxCodePurchase,
                                purchasedescription: useData[i].fields.PurchaseDescription,
                                sellqty1price: utilityService.modifynegativeCurrencyFormat(useData[i].fields.SellQty1Price),
                                sellqty1priceinc: utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1PriceInc),
                                incomeaccount: useData[i].fields.IncomeAccount,
                                taxcodesales: useData[i].fields.TaxCodeSales,
                                salesdescription: useData[i].fields.SalesDescription,
                                active: useData[i].fields.Active,
                                lockextrasell: useData[i].fields.LockExtraSell,
                                customfield1: useData[i].fields.CUSTFLD1,
                                customfield2: useData[i].fields.CUSTFLD2,
                                //totalqtyinstock : totalquantity,
                                barcode: useData[i].fields.BARCODE,
                                // useData[i].fields.TotalQtyInStock,
                                totalqtyonorder: useData[i].fields.TotalQtyOnOrder,
                                //productclass :lineItems
                            };
                            if (useData[i].fields.ExtraSellPrice == null) {
                                lineExtaSellObj = {
                                    lineID: Random.id(),
                                    clienttype: '',
                                    discount: '',
                                    datefrom: '',
                                    dateto: '',
                                    price: 0
                                };
                                lineExtaSellItems.push(lineExtaSellObj);
                                templateObject.productExtraSell.set(lineExtaSellItems);
                            } else {
                                templateObject.isExtraSellChecked.set(true);
                                for (let e = 0; e < useData[i].fields.ExtraSellPrice.length; e++) {
                                    lineExtaSellObj = {
                                        lineID: Random.id(),
                                        clienttype: useData[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                                        discount: useData[i].fields.ExtraSellPrice[e].fields.QtyPercent1 || 0,
                                        datefrom: useData[i].fields.ExtraSellPrice[e].fields.DateFrom || '',
                                        dateto: useData[i].fields.ExtraSellPrice[e].fields.DateTo || '',
                                        price: utilityService.modifynegativeCurrencyFormat(useData[i].fields.ExtraSellPrice[e].fields.Price1) || 0
                                    };
                                    lineExtaSellItems.push(lineExtaSellObj);

                                }
                                templateObject.productExtraSell.set(lineExtaSellItems);
                            }
                            let itrackItem = useData[i].fields.LockExtraSell;
                            if (itrackItem == true) {
                                templateObject.isTrackChecked.set(true);
                            } else {
                                templateObject.isTrackChecked.set(false);
                            }

                            if (useData[i].fields.ProductType == "INV") {
                                templateObject.isTrackChecked.set(true);
                            } else {
                                templateObject.isTrackChecked.set(false);
                            }
                            $('#sltsalesacount').val(useData[i].fields.IncomeAccount);
                            $('#sltcogsaccount').val(useData[i].fields.CogsAccount);

                            templateObject.records.set(productrecord);
                        }
                    }
                    if (!added) {
                        productService.getOneProductdatavs1byname(currentProductName).then(function (data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let lineItemObj = {};
                            let currencySymbol = Currency;
                            let totalquantity = 0;
                            currentProductID = data.tproduct[0].fields.ID;
                            templateObject.getProductClassQtyData();
                            let productrecord = {
                                id: data.tproduct[0].fields.ID,
                                productname: data.tproduct[0].fields.ProductName,
                                lib: data.tproduct[0].fields.ProductName,
                                productcode: data.tproduct[0].fields.PRODUCTCODE,
                                productprintName: data.tproduct[0].fields.ProductPrintName,
                                assetaccount: data.tproduct[0].fields.AssetAccount,
                                buyqty1cost: utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost),
                                buyqty1costinc: utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1CostInc),
                                cogsaccount: data.tproduct[0].fields.CogsAccount,
                                taxcodepurchase: data.tproduct[0].fields.TaxCodePurchase,
                                purchasedescription: data.tproduct[0].fields.PurchaseDescription,
                                sellqty1price: utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price),
                                sellqty1priceinc: utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1PriceInc),
                                incomeaccount: data.tproduct[0].fields.IncomeAccount,
                                taxcodesales: data.tproduct[0].fields.TaxCodeSales,
                                salesdescription: data.tproduct[0].fields.SalesDescription,
                                active: data.tproduct[0].fields.Active,
                                lockextrasell: data.tproduct[0].fields.LockExtraSell,
                                customfield1: data.tproduct[0].fields.CUSTFLD1,
                                customfield2: data.tproduct[0].fields.CUSTFLD2,
                                //totalqtyinstock : totalquantity,
                                barcode: data.tproduct[0].fields.BARCODE,
                                // data.fields.TotalQtyInStock,
                                totalqtyonorder: data.tproduct[0].fields.TotalQtyOnOrder,
                                //productclass :lineItems
                            };

                            if (data.tproduct[0].fields.ExtraSellPrice == null) {
                                lineExtaSellObj = {
                                    lineID: Random.id(),
                                    clienttype: '',
                                    discount: '',
                                    datefrom: '',
                                    dateto: '',
                                    price: 0
                                };
                                lineExtaSellItems.push(lineExtaSellObj);
                                templateObject.productExtraSell.set(lineExtaSellItems);
                            } else {
                                templateObject.isExtraSellChecked.set(true);
                                for (let e = 0; e < data.tproduct[0].fields.ExtraSellPrice.length; e++) {
                                    lineExtaSellObj = {
                                        lineID: Random.id(),
                                        clienttype: data.tproduct[0].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                                        discount: data.tproduct[0].fields.ExtraSellPrice[e].fields.QtyPercent1 || 0,
                                        datefrom: data.tproduct[0].fields.ExtraSellPrice[e].fields.DateFrom || '',
                                        dateto: data.tproduct[0].fields.ExtraSellPrice[e].fields.DateTo || '',
                                        price: utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.ExtraSellPrice[e].fields.Price1) || 0
                                    };
                                    lineExtaSellItems.push(lineExtaSellObj);

                                }
                                templateObject.productExtraSell.set(lineExtaSellItems);
                            }
                            let itrackItem = data.tproduct[0].fields.LockExtraSell;
                            if (itrackItem == true) {
                                templateObject.isTrackChecked.set(true);
                            } else {
                                templateObject.isTrackChecked.set(false);
                            }
                            if (data.tproduct[0].fields.ProductType == "INV") {
                                templateObject.isTrackChecked.set(true);
                            } else {
                                templateObject.isTrackChecked.set(false);
                            }
                            $('#sltsalesacount').val(data.tproduct[0].fields.IncomeAccount);
                            $('#sltcogsaccount').val(data.tproduct[0].fields.CogsAccount);

                            templateObject.records.set(productrecord);
                        }).catch(function (err) {

                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }
                }
                //templateObject.getProductClassQtyData();
            }).catch(function (err) {
                productService.getOneProductdatavs1byname(currentProductName).then(function (data) {
                    $('.fullScreenSpin').css('display', 'none');
                    let lineItems = [];
                    let lineItemObj = {};
                    let currencySymbol = Currency;
                    let totalquantity = 0;
                    currentProductID = data.tproduct[0].fields.ID;
                    templateObject.getProductClassQtyData();
                    let productrecord = {
                        id: data.tproduct[0].fields.ID,
                        productname: data.tproduct[0].fields.ProductName,
                        lib: data.tproduct[0].fields.ProductName,
                        productcode: data.tproduct[0].fields.PRODUCTCODE,
                        productprintName: data.tproduct[0].fields.ProductPrintName,
                        assetaccount: data.tproduct[0].fields.AssetAccount,
                        buyqty1cost: utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost),
                        buyqty1costinc: utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1CostInc),
                        cogsaccount: data.tproduct[0].fields.CogsAccount,
                        taxcodepurchase: data.tproduct[0].fields.TaxCodePurchase,
                        purchasedescription: data.tproduct[0].fields.PurchaseDescription,
                        sellqty1price: utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price),
                        sellqty1priceinc: utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1PriceInc),
                        incomeaccount: data.tproduct[0].fields.IncomeAccount,
                        taxcodesales: data.tproduct[0].fields.TaxCodeSales,
                        salesdescription: data.tproduct[0].fields.SalesDescription,
                        active: data.tproduct[0].fields.Active,
                        lockextrasell: data.tproduct[0].fields.LockExtraSell,
                        customfield1: data.tproduct[0].fields.CUSTFLD1,
                        customfield2: data.tproduct[0].fields.CUSTFLD2,
                        //totalqtyinstock : totalquantity,
                        barcode: data.tproduct[0].fields.BARCODE,
                        // data.fields.TotalQtyInStock,
                        totalqtyonorder: data.tproduct[0].fields.TotalQtyOnOrder,
                        //productclass :lineItems
                    };

                    if (data.tproduct[0].fields.ExtraSellPrice == null) {
                        lineExtaSellObj = {
                            lineID: Random.id(),
                            clienttype: '',
                            discount: '',
                            datefrom: '',
                            dateto: '',
                            price: 0
                        };
                        lineExtaSellItems.push(lineExtaSellObj);
                        templateObject.productExtraSell.set(lineExtaSellItems);
                    } else {
                        templateObject.isExtraSellChecked.set(true);
                        for (let e = 0; e < data.tproduct[0].fields.ExtraSellPrice.length; e++) {
                            lineExtaSellObj = {
                                lineID: Random.id(),
                                clienttype: data.tproduct[0].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                                discount: data.tproduct[0].fields.ExtraSellPrice[e].fields.QtyPercent1 || 0,
                                datefrom: data.tproduct[0].fields.ExtraSellPrice[e].fields.DateFrom || '',
                                dateto: data.tproduct[0].fields.ExtraSellPrice[e].fields.DateTo || '',
                                price: utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.ExtraSellPrice[e].fields.Price1) || 0
                            };
                            lineExtaSellItems.push(lineExtaSellObj);

                        }
                        templateObject.productExtraSell.set(lineExtaSellItems);
                    }
                    let itrackItem = data.tproduct[0].fields.LockExtraSell;
                    if (itrackItem == true) {
                        templateObject.isTrackChecked.set(true);
                    } else {
                        templateObject.isTrackChecked.set(false);
                    }
                    if (data.tproduct[0].fields.ProductType == "INV") {
                        templateObject.isTrackChecked.set(true);
                    } else {
                        templateObject.isTrackChecked.set(false);
                    }
                    $('#sltsalesacount').val(data.tproduct[0].fields.IncomeAccount);
                    $('#sltcogsaccount').val(data.tproduct[0].fields.CogsAccount);

                    templateObject.records.set(productrecord);
                }).catch(function (err) {

                    $('.fullScreenSpin').css('display', 'none');
                });
            });

            setTimeout(function () {
                var begin_day_value = $('#event_begin_day').attr('value');
                $("#dtDateTo").datepicker({
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
                }).keyup(function (e) {
                    if (e.keyCode == 8 || e.keyCode == 46) {
                        $("#dtDateTo,#dtDateFrom").val('');
                    }
                });

                $("#dtDateFrom").datepicker({
                    showOn: 'button',
                    buttonText: 'Show Date',
                    altField: "#dtDateFrom",
                    buttonImageOnly: true,
                    buttonImage: '/img/imgCal2.png',
                    constrainInput: false,
                    dateFormat: 'd/mm/yy',
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    changeMonth: true,
                    changeYear: true,
                    yearRange: "-90:+10",
                }).keyup(function (e) {
                    if (e.keyCode == 8 || e.keyCode == 46) {
                        $("#dtDateTo,#dtDateFrom").val('');
                    }
                });

                $(".ui-datepicker .ui-state-hihglight").removeClass("ui-state-highlight");
                // var usedNames = {};
                // $("select[name='sltCustomerType'] > option").each(function () {
                //     if(usedNames[this.text]) {
                //         $(this).remove();
                //     } else {
                //         usedNames[this.text] = this.value;
                //     }
                // });

                // $('#sltCustomerType').append(' <option value="newCust"><span class="addType">+ Client Type</span></option>');
            }, 1000);
        }

        templateObject.getProductClassQtyData = function () {
            productService.getOneProductClassQtyData(currentProductID).then(function (data) {
                $('.fullScreenSpin').css('display', 'none');
                let qtylineItems = [];
                let qtylineItemObj = {};
                let currencySymbol = Currency;
                let totaldeptquantity = 0;

                for (let j in data.tproductclassquantity) {
                    qtylineItemObj = {
                        department: data.tproductclassquantity[j].DepartmentName || '',
                        quantity: data.tproductclassquantity[j].InStockQty || 0,
                    }
                    totaldeptquantity += data.tproductclassquantity[j].InStockQty;
                    qtylineItems.push(qtylineItemObj);
                }
                // $('#edttotalqtyinstock').val(totaldeptquantity);
                templateObject.productqtyrecords.set(qtylineItems);
                templateObject.totaldeptquantity.set(totaldeptquantity);

            }).catch(function (err) {

                $('.fullScreenSpin').css('display', 'none');
            });

        }

        //templateObject.getProductClassQtyData();
        templateObject.getProductData();

        templateObject.getAllProductRecentTransactions = function () {
            productService.getProductRecentTransactionsAll(currentProductID).then(function (data) {
                recentTransList = [];
                for (let i = 0; i < data.t_vs1_report_productmovement.length; i++) {
                    let recentTranObject = {
                        date: data.t_vs1_report_productmovement[i].TransactionDate != '' ? moment(data.t_vs1_report_productmovement[i].TransactionDate).format("DD/MM/YYYY") : data.t_vs1_report_productmovement[i].TransactionDate,
                        type: data.t_vs1_report_productmovement[i].TranstypeDesc,
                        transactionno: data.t_vs1_report_productmovement[i].TransactionNo,
                        reference: data.t_vs1_report_productmovement[i].TransactionNo,
                        quantity: data.t_vs1_report_productmovement[i].Qty,
                        unitPrice: utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].Price),
                        total: utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].TotalPrice)
                    };
                    recentTransList.push(recentTranObject);
                }

                templateObject.recentTrasactions.set(recentTransList);
                setTimeout(function () {
                    $('#productrecentlist').DataTable({
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [[initialDatatableLoad, -1], [initialDatatableLoad, "All"]],
                        info: true,
                        responsive: true,
                        "order": [[1, "asc"]],
                        action: function () {
                            $('#productrecentlist').DataTable().ajax.reload();
                        },

                    }).on('page', function () {}).on('column-reorder', function () {});
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');
                    $('.fullScreenSpin').css('display', 'none');

                }, 0);

                $('#productrecentlist tbody').on('click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".transactiontype").text();

                    if ((listData) && (transactiontype)) {
                        if (transactiontype === 'Quote') {
                            window.open('/quotecard?id=' + listData, '_self');
                        } else if (transactiontype === 'Sales Order') {
                            window.open('/salesordercard?id=' + listData, '_self');
                        } else if (transactiontype === 'Invoice') {
                            window.open('/invoicecard?id=' + listData, '_self');
                        } else if (transactiontype === 'Purchase Order') {
                            window.open('/purchaseordercard?id=' + listData, '_self');
                        } else if (transactiontype === 'Bill') {
                            //window.open('/billcard?id=' + listData,'_self');
                        } else if (transactiontype === 'Credit') {
                            //window.open('/creditcard?id=' + listData,'_self');
                        }

                    }
                });

                $('.product_recent_trans').css('display', 'block');
                $('.fullScreenSpin').css('display', 'none');
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(".product_recent_trans").offset().top
                  }, 2000);
            }).catch(function (err) {

                $('.fullScreenSpin').css('display', 'none');
                $('.product_recent_trans').css('display', 'block');
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(".product_recent_trans").offset().top
                  }, 2000);

                //Bert.alert('<strong>' + err + '</strong>!', 'deleting products failed');
            });

        };

    } else {
        let purchasetaxcode = '';
        let salestaxcode = '';
        let productrecord = '';
        setTimeout(function () {
            $("#sltsalesacount").val("Sales");
            $("#sltcogsaccount").val("Cost of Goods Sold");
            $("#sltinventoryacount").val("Inventory Asset");
            $("#sltCustomerType").val("Default");
        }, 1000);
        productrecord = {
            id: '',
            productname: '',
            lib: '',
            productcode: '',
            productprintName: '',
            assetaccount: 'Inventory Asset',
            buyqty1cost: 0,
            buyqty1costinc: 0,
            cogsaccount: 'Cost of Goods Sold',
            taxcodepurchase: '',
            purchasedescription: '',
            sellqty1price: 0,
            sellqty1priceinc: 0,
            incomeaccount: 'Sales',
            taxcodesales: '',
            salesdescription: '',
            active: '',
            lockextrasell: '',
            customfield1: '',
            customfield2: '',
            //totalqtyinstock : totalquantity,
            barcode: '',
            // data.fields.TotalQtyInStock,
            totalqtyonorder: 0
            //productclass :lineItems
        };

        templateObject.records.set(productrecord);
        lineExtaSellObj = {
            lineID: Random.id(),
            clienttype: 'Default',
            discount: '',
            datefrom: '',
            dateto: '',
            price: 0
        };
        lineExtaSellItems.push(lineExtaSellObj);
        templateObject.productExtraSell.set(lineExtaSellItems);
        //setTimeout(function () {
        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'defaulttax', function (error, result) {
            if (error) {
                purchasetaxcode = loggedTaxCodePurchaseInc;
                salestaxcode = loggedTaxCodeSalesInc;
                productrecord = {
                    id: '',
                    productname: '',
                    lib: "New Product",
                    productcode: '',
                    productprintName: '',
                    assetaccount: "Inventory Asset" || '',
                    buyqty1cost: 0,
                    buyqty1costinc: 0,
                    cogsaccount: "Cost of Goods Sold" || '',
                    taxcodepurchase: purchasetaxcode || '',
                    purchasedescription: '',
                    sellqty1price: 0,
                    sellqty1priceinc: 0,
                    incomeaccount: "Sales" || '',
                    taxcodesales: salestaxcode || '',
                    salesdescription: '',
                    active: '',
                    lockextrasell: '',
                    barcode: '',
                    totalqtyonorder: 0,

                };

                templateObject.records.set(productrecord);
            } else {
                if (result) {
                    purchasetaxcode = result.customFields[0].taxvalue || loggedTaxCodePurchaseInc;
                    salestaxcode = result.customFields[1].taxvalue || loggedTaxCodeSalesInc;
                    productrecord = {
                        id: '',
                        productname: '',
                        lib: "New Product",
                        productcode: '',
                        productprintName: '',
                        assetaccount: "Inventory Asset" || '',
                        buyqty1cost: 0,
                        buyqty1costinc: 0,
                        cogsaccount: "Cost of Goods Sold" || '',
                        taxcodepurchase: purchasetaxcode || '',
                        purchasedescription: '',
                        sellqty1price: 0,
                        sellqty1priceinc: 0,
                        incomeaccount: "Sales" || '',
                        taxcodesales: salestaxcode || '',
                        salesdescription: '',
                        active: '',
                        lockextrasell: '',
                        barcode: '',
                        totalqtyonorder: 0,

                    };

                    templateObject.records.set(productrecord);
                }

            }
        });
        //}, 500);


        $('.fullScreenSpin').css('display', 'none');
        templateObject.getAllLastInvDatas();
        setTimeout(function () {
            $('.recenttrasaction').css('display', 'none');
        }, 500);

    }


    if (FlowRouter.current().queryParams.instock) {
        templateObject.getAllProductRecentTransactions();
    }

});

Template.productview.helpers({
    productrecord: () => {
        return Template.instance().records.get();
    },
    taxraterecords: () => {
        return Template.instance().taxraterecords.get();
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function (a, b) {
            if (a.department == 'NA') {
                return 1;
            } else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    recentTrasactions: () => {
        return Template.instance().recentTrasactions.get();
    },
    coggsaccountrecords: () => {
        return Template.instance().coggsaccountrecords.get().sort(function (a, b) {
            if (a.accountname == 'NA') {
                return 1;
            } else if (b.accountname == 'NA') {
                return -1;
            }
            return (a.accountname.toUpperCase() > b.accountname.toUpperCase()) ? 1 : -1;
        });
    },
    salesaccountrecords: () => {
        return Template.instance().salesaccountrecords.get().sort(function (a, b) {
            if (a.accountname == 'NA') {
                return 1;
            } else if (b.accountname == 'NA') {
                return -1;
            }
            return (a.accountname.toUpperCase() > b.accountname.toUpperCase()) ? 1 : -1;
        });
    },
    inventoryaccountrecords: () => {
        return Template.instance().inventoryaccountrecords.get()
        .sort(function (a, b) {
            if (a.accountname == 'NA') {
                return 1;
            } else if (b.accountname == 'NA') {
                return -1;
            }
            return (a.accountname.toUpperCase() > b.accountname.toUpperCase()) ? 1 : -1;
        });
    },
    productqtyrecords: () => {
        return Template.instance().productqtyrecords.get().sort(function (a, b) {
            if (a.department == 'NA') {
                return 1;
            } else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    productExtraSell: () => {
        return Template.instance().productExtraSell.get().sort(function (a, b) {
            if (a.clienttype == 'NA') {
                return 1;
            } else if (b.clienttype == 'NA') {
                return -1;
            }
            return (a.clienttype.toUpperCase() > b.clienttype.toUpperCase()) ? 1 : -1;
        });
    },
    totaldeptquantity: () => {
        return Template.instance().totaldeptquantity.get();
    },
    productsCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'productview'
        });
    },
    isTrackChecked: () => {
        let templateObj = Template.instance();
        return templateObj.isTrackChecked.get();
    },
    isExtraSellChecked: () => {
        let templateObj = Template.instance();
        return templateObj.isExtraSellChecked.get();
    },
    includeInventory: () => {
        return Template.instance().includeInventory.get();
    },
    clienttypeList: () => {
        return Template.instance().clienttypeList.get().sort(function (a, b) {
            if (a == 'NA') {
                return 1;
            } else if (b == 'NA') {
                return -1;
            }
            return (a.toUpperCase() > b.toUpperCase()) ? 1 : -1;
        });
    }

});

Template.productview.events({
    'click .trackProdQty': function (event) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      templateObject.getAllProductRecentTransactions();
    },
    'click .lblPriceEx': function (event) {
        $('.lblPriceEx').addClass('hiddenColumn');
        $('.lblPriceEx').removeClass('showColumn');

        $('.lblPriceInc').addClass('showColumn');
        $('.lblPriceInc').removeClass('hiddenColumn');

        $('#edtsellqty1priceInc').removeClass('hiddenColumn');
        $('#edtsellqty1priceInc').addClass('showColumn');

        $('#edtsellqty1price').addClass('hiddenColumn');
        $('#edtsellqty1price').removeClass('showColumn');
        $('.lblPriceCheckStatus').val('true');
    },
    'click .lblPriceInc': function (event) {
        $('.lblPriceInc').addClass('hiddenColumn');
        $('.lblPriceInc').removeClass('showColumn');

        $('.lblPriceEx').addClass('showColumn');
        $('.lblPriceEx').removeClass('hiddenColumn');

        $('#edtsellqty1priceInc').addClass('hiddenColumn');
        $('#edtsellqty1priceInc').removeClass('showColumn');

        $('#edtsellqty1price').removeClass('hiddenColumn');
        $('#edtsellqty1price').addClass('showColumn');
        $('.lblPriceCheckStatus').val('false');
    },
    'click .lblCostEx': function (event) {
        $('.lblCostEx').addClass('hiddenColumn');
        $('.lblCostEx').removeClass('showColumn');

        $('.lblCostInc').addClass('showColumn');
        $('.lblCostInc').removeClass('hiddenColumn');

        $('#edtbuyqty1costInc').removeClass('hiddenColumn');
        $('#edtbuyqty1costInc').addClass('showColumn');

        $('#edtbuyqty1cost').addClass('hiddenColumn');
        $('#edtbuyqty1cost').removeClass('showColumn');

        $('.lblCostCheckStatus').val('true');
    },
    'click .lblCostInc': function (event) {
        $('.lblCostInc').addClass('hiddenColumn');
        $('.lblCostInc').removeClass('showColumn');

        $('.lblCostEx').addClass('showColumn');
        $('.lblCostEx').removeClass('hiddenColumn');

        $('#edtbuyqty1costInc').addClass('hiddenColumn');
        $('#edtbuyqty1costInc').removeClass('showColumn');

        $('#edtbuyqty1cost').removeClass('hiddenColumn');
        $('#edtbuyqty1cost').addClass('showColumn');
        $('.lblCostCheckStatus').val('false');
    },
    'click #sltsalesacount': function (event) {
        // $('#edtassetaccount').select();
        // $('#edtassetaccount').editableSelect();
    },
    'click .inventorynottracking': function (event) {
        swal('Please enable this feature in Access Setting!', '', 'info');
    },
    'click .inventorytrackingTest': function (event) {
        if ($(event.target).is(':checked')) {
            swal('Info', 'If Inventory tracking is turned on it cannot be disabled in the future.', 'info');
        }
    },
    'click #loadrecenttransaction': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        templateObject.getAllProductRecentTransactions();

    },
    'click #btnSave': async function () {
        let productService = new ProductService();
        let productCode = $("#edtproductcode").val();
        let productName = $("#edtproductname").val();
        var objDetails = '';
        let lineExtaSellItems = [];
        let lineExtaSellObj = {};

        let lastPriceSetting = $('.lblPriceCheckStatus').val() || 'true';
        let lastCostSetting = $('.lblCostCheckStatus').val() || 'true';


        $('.fullScreenSpin').css('display', 'inline-block');

        let itrackThisItem = false;
        if ($('input[name="chkTrack"]').is(":checked")) {
            itrackThisItem = true;
        } else {
            itrackThisItem = false;
        }

        if (productName == '') {
            swal('Please provide product Name !', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
            return false;
        }

        let TaxCodePurchase = $("#slttaxcodepurchase").val();
        let TaxCodeSales = $("#slttaxcodesales").val();
        if (TaxCodePurchase == '' || TaxCodeSales == '') {
            swal('Please fill Tax rate !', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
            return false;
        }

        let getchkcustomField1 = true;
        let getchkcustomField2 = true;
        let getcustomField1 = $('.customField1Text').html();
        let getcustomField2 = $('.customField2Text').html();
        if ($('#formCheck-one').is(':checked')) {
            getchkcustomField1 = false;
        }
        if ($('#formCheck-two').is(':checked')) {
            getchkcustomField2 = false;
        }

        let customField1 = $("#txtCustomField1").val();
        let customField2 = $("#txtCustomField2").val();

        var url = FlowRouter.current().path;
        var getso_id = url.split('?id=');
        var currentID = FlowRouter.current().queryParams.id || 0;

        if ($('#chkSellPrice').is(':checked')) {
            $('.itemExtraSellRow').each(function () {
                var lineID = this.id;
                let tdclientType = $('#' + lineID + " .customerTypeSelect").val();
                let tdDiscount = $('#' + lineID + " .edtDiscount").val();

                lineExtaSellObj = {
                    type: "TProductExtraSellPrice",
                    fields: {
                        AllClients: false,
                        ClientTypeName: tdclientType || '',
                        QtyPercent1: parseFloat(tdDiscount) || 0,
                        ProductName: productName || ''
                    }
                }

                lineExtaSellItems.push(lineExtaSellObj);

            });
        }

        if (getso_id[1]) {
            if ((itrackThisItem == true) && ($("#sltinventoryacount").val() != '')) {
                objDetails = {
                    type: "TProductVS1",
                    fields: {
                        ID: parseInt(currentID),
                        Active: true,
                        ProductType: "INV",
                        PRODUCTCODE: productCode,
                        CUSTFLD1: customField1,
                        CUSTFLD2: customField2,
                        CUSTFLD14: lastPriceSetting,
                        CUSTFLD15: lastCostSetting,
                        ProductPrintName: productName,
                        ProductName: productName,
                        PurchaseDescription: $("#txapurchasedescription").val(),
                        SalesDescription: $("#txasalesdescription").val(),
                        AssetAccount: $("#sltinventoryacount").val(),
                        CogsAccount: $("#sltcogsaccount").val(),
                        IncomeAccount: $("#sltsalesacount").val(),
                        BuyQty1Cost: parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g, "")) || 0,
                        SellQty1Price: parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0,
                        TaxCodePurchase: $("#slttaxcodepurchase").val(),
                        TaxCodeSales: $("#slttaxcodesales").val(),
                        UOMPurchases: defaultUOM,
                        UOMSales: defaultUOM,
                        Barcode: $("#edtbarcode").val(),
                        LockExtraSell: itrackThisItem,
                        ExtraSellPrice: lineExtaSellItems || null,
                        PublishOnVS1: true
                    }
                };

            } else {
                objDetails = {
                    type: "TProductVS1",
                    fields: {
                        ID: parseInt(currentID),
                        Active: true,
                        ProductType: "NONINV",
                        PRODUCTCODE: productCode,
                        CUSTFLD1: customField1,
                        CUSTFLD2: customField2,
                        CUSTFLD14: lastPriceSetting,
                        CUSTFLD15: lastCostSetting,
                        ProductPrintName: productName,
                        ProductName: productName,
                        PurchaseDescription: $("#txapurchasedescription").val(),
                        SalesDescription: $("#txasalesdescription").val(),
                        CogsAccount: $("#sltcogsaccount").val(),
                        IncomeAccount: $("#sltsalesacount").val(),
                        BuyQty1Cost: parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g, "")) || 0,
                        SellQty1Price: parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0,
                        TaxCodePurchase: $("#slttaxcodepurchase").val(),
                        TaxCodeSales: $("#slttaxcodesales").val(),
                        UOMPurchases: defaultUOM,
                        UOMSales: defaultUOM,
                        Barcode: $("#edtbarcode").val(),
                        LockExtraSell: itrackThisItem,
                        ExtraSellPrice: lineExtaSellItems || null,
                        PublishOnVS1: true
                    }
                };
            }

            productService.saveProductVS1(objDetails).then(function (objDetails) {
                if (itrackThisItem == false) {
                    let objServiceDetails = {
                        type: "TServices",
                        fields: {
                            ProductId: parseInt(currentID),
                            ServiceDesc: productName,
                            StandardRate: parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g, "")) || 0,
                        }
                    };
                    productService.saveProductService(objServiceDetails).then(function (objServiceDetails) {});
                };

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
                            PrefName: 'productview'
                        });
                        if (checkPrefDetails) {
                            CloudPreference.update({
                                _id: checkPrefDetails._id
                            }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'inventoryform',
                                    PrefName: 'productview',
                                    published: true,
                                    customFields: [{
                                            index: '1',
                                            label: getcustomField1,
                                            hidden: getchkcustomField1
                                        }, {
                                            index: '2',
                                            label: getcustomField2,
                                            hidden: getchkcustomField2
                                        }
                                    ],
                                    updatedAt: new Date()
                                }
                            }, function (err, idTag) {});
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'inventoryform',
                                PrefName: 'productview',
                                published: true,
                                customFields: [{
                                        index: '1',
                                        label: getcustomField1,
                                        hidden: getchkcustomField1
                                    }, {
                                        index: '2',
                                        label: getcustomField2,
                                        hidden: getchkcustomField2
                                    }
                                ],
                                createdAt: new Date()
                            }, function (err, idTag) {
                                if (err) {
                                    FlowRouter.go('/inventorylist?success=true');
                                } else {
                                    FlowRouter.go('/inventorylist?success=true');

                                }
                            });
                        }
                    }
                } else {
                    //FlowRouter.go('/inventorylist?success=true');
                }
                sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                    addVS1Data('TProductVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                        FlowRouter.go('/inventorylist?success=true');
                    }).catch(function (err) {
                        FlowRouter.go('/inventorylist?success=true');
                    });
                }).catch(function (err) {
                    FlowRouter.go('/inventorylist?success=true');
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
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                //$('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {

            productService.getCheckProductData(productName).then(function (data) {
                if (data.tproduct[0].Id != '') {
                    let productID = data.tproduct[0].Id;
                    currentID = parseInt(productID);
                    if ((itrackThisItem == true) && ($("#sltinventoryacount").val() != '')) {
                        objDetails = {
                            type: "TProductVS1",
                            fields: {
                                ID: currentID,
                                Active: true,
                                ProductType: "INV",
                                PRODUCTCODE: productCode,
                                CUSTFLD1: customField1,
                                CUSTFLD2: customField2,
                                CUSTFLD14: lastPriceSetting,
                                CUSTFLD15: lastCostSetting,
                                ProductPrintName: productName,
                                ProductName: productName,
                                PurchaseDescription: $("#txapurchasedescription").val(),
                                SalesDescription: $("#txasalesdescription").val(),
                                AssetAccount: $("#sltinventoryacount").val(),
                                CogsAccount: $("#sltcogsaccount").val(),
                                IncomeAccount: $("#sltsalesacount").val(),
                                BuyQty1Cost: parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g, "")) || 0,
                                SellQty1Price: parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0,
                                TaxCodePurchase: $("#slttaxcodepurchase").val(),
                                TaxCodeSales: $("#slttaxcodesales").val(),
                                UOMPurchases: defaultUOM,
                                UOMSales: defaultUOM,
                                Barcode: $("#edtbarcode").val(),
                                LockExtraSell: itrackThisItem,
                                ExtraSellPrice: lineExtaSellItems || null,
                                PublishOnVS1: true
                            }
                        };

                    } else {
                        objDetails = {
                            type: "TProductVS1",
                            fields: {
                                ID: currentID,
                                Active: true,
                                ProductType: "NONINV",
                                PRODUCTCODE: productCode,
                                CUSTFLD1: customField1,
                                CUSTFLD2: customField2,
                                CUSTFLD14: lastPriceSetting,
                                CUSTFLD15: lastCostSetting,
                                ProductPrintName: productName,
                                ProductName: productName,
                                PurchaseDescription: $("#txapurchasedescription").val(),
                                SalesDescription: $("#txasalesdescription").val(),
                                CogsAccount: $("#sltcogsaccount").val(),
                                IncomeAccount: $("#sltsalesacount").val(),
                                BuyQty1Cost: parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g, "")) || 0,
                                SellQty1Price: parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0,
                                TaxCodePurchase: $("#slttaxcodepurchase").val(),
                                TaxCodeSales: $("#slttaxcodesales").val(),
                                UOMPurchases: defaultUOM,
                                UOMSales: defaultUOM,
                                Barcode: $("#edtbarcode").val(),
                                LockExtraSell: itrackThisItem,
                                ExtraSellPrice: lineExtaSellItems || null,
                                PublishOnVS1: true
                            }
                        };
                    }

                    productService.saveProductVS1(objDetails).then(function (objDetails) {
                        let linesave = objDetails.fields.ID;
                        if (itrackThisItem == false) {
                            let objServiceDetails = {
                                type: "TServices",
                                fields: {
                                    ProductId: parseInt(linesave),
                                    ServiceDesc: productName,
                                    StandardRate: parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g, "")) || 0,
                                }
                            };
                            productService.saveProductService(objServiceDetails).then(function (objServiceDetails) {});
                        };

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
                                    PrefName: 'productview'
                                });
                                if (checkPrefDetails) {
                                    CloudPreference.update({
                                        _id: checkPrefDetails._id
                                    }, {
                                        $set: {
                                            username: clientUsername,
                                            useremail: clientEmail,
                                            PrefGroup: 'inventoryform',
                                            PrefName: 'productview',
                                            published: true,
                                            customFields: [{
                                                    index: '1',
                                                    label: getcustomField1,
                                                    hidden: getchkcustomField1
                                                }, {
                                                    index: '2',
                                                    label: getcustomField2,
                                                    hidden: getchkcustomField2
                                                }
                                            ],
                                            updatedAt: new Date()
                                        }
                                    }, function (err, idTag) {});
                                } else {
                                    CloudPreference.insert({
                                        userid: clientID,
                                        username: clientUsername,
                                        useremail: clientEmail,
                                        PrefGroup: 'inventoryform',
                                        PrefName: 'productview',
                                        published: true,
                                        customFields: [{
                                                index: '1',
                                                label: getcustomField1,
                                                hidden: getchkcustomField1
                                            }, {
                                                index: '2',
                                                label: getcustomField2,
                                                hidden: getchkcustomField2
                                            }
                                        ],
                                        createdAt: new Date()
                                    }, function (err, idTag) {});
                                }
                            }
                        } else {
                            //  FlowRouter.go('/inventorylist?success=true');
                        }
                        sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                            addVS1Data('TProductVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                                FlowRouter.go('/inventorylist?success=true');
                            }).catch(function (err) {
                                FlowRouter.go('/inventorylist?success=true');
                            });
                        }).catch(function (err) {
                            FlowRouter.go('/inventorylist?success=true');
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
                                // Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        //$('.loginSpinner').css('display','none');
                        $('.fullScreenSpin').css('display', 'none');
                    });
                } else {
                    if ((itrackThisItem == true) && ($("#sltinventoryacount").val() != '')) {
                        objDetails = {
                            type: "TProductVS1",
                            fields: {
                                Active: true,
                                ProductType: "INV",
                                PRODUCTCODE: productCode,
                                CUSTFLD1: customField1,
                                CUSTFLD2: customField2,
                                CUSTFLD14: lastPriceSetting,
                                CUSTFLD15: lastCostSetting,
                                ProductPrintName: productName,
                                ProductName: productName,
                                PurchaseDescription: $("#txapurchasedescription").val(),
                                SalesDescription: $("#txasalesdescription").val(),
                                AssetAccount: $("#sltinventoryacount").val(),
                                CogsAccount: $("#sltcogsaccount").val(),
                                IncomeAccount: $("#sltsalesacount").val(),
                                BuyQty1: parseFloat($("#edttotalqtyinstock1").val()) || 1,
                                BuyQty1Cost: parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g, "")) || 0,
                                SellQty1: parseFloat($("#edttotalqtyinstock1").val()) || 1,
                                SellQty1Price: parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0,
                                TaxCodePurchase: $("#slttaxcodepurchase").val(),
                                TaxCodeSales: $("#slttaxcodesales").val(),
                                UOMPurchases: defaultUOM,
                                UOMSales: defaultUOM,
                                Barcode: $("#edtbarcode").val(),
                                LockExtraSell: itrackThisItem,
                                ExtraSellPrice: lineExtaSellItems || null,
                                PublishOnVS1: true
                            }
                        };
                    } else {
                        objDetails = {
                            type: "TProductVS1",
                            fields: {
                                Active: true,
                                ProductType: "NONINV",
                                PRODUCTCODE: productCode,
                                CUSTFLD1: customField1,
                                CUSTFLD2: customField2,
                                CUSTFLD14: lastPriceSetting,
                                CUSTFLD15: lastCostSetting,
                                ProductPrintName: productName,
                                ProductName: productName,
                                PurchaseDescription: $("#txapurchasedescription").val(),
                                SalesDescription: $("#txasalesdescription").val(),
                                // AssetAccount:$("#sltinventoryacount").val(),
                                CogsAccount: $("#sltcogsaccount").val(),
                                IncomeAccount: $("#sltsalesacount").val(),
                                BuyQty1: parseFloat($("#edttotalqtyinstock1").val()) || 1,
                                BuyQty1Cost: parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g, "")) || 0,
                                SellQty1: parseFloat($("#edttotalqtyinstock1").val()) || 1,
                                SellQty1Price: parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0,
                                TaxCodePurchase: $("#slttaxcodepurchase").val(),
                                TaxCodeSales: $("#slttaxcodesales").val(),
                                UOMPurchases: defaultUOM,
                                UOMSales: defaultUOM,
                                Barcode: $("#edtbarcode").val(),
                                LockExtraSell: itrackThisItem,
                                ExtraSellPrice: lineExtaSellItems || null,
                                PublishOnVS1: true
                            }
                        };
                    }
                    productService.saveProductVS1(objDetails).then(function (objDetails) {
                        let linesave = objDetails.fields.ID;
                        if (itrackThisItem == false) {
                            let objServiceDetails = {
                                type: "TServices",
                                fields: {
                                    ProductId: parseInt(linesave),
                                    ServiceDesc: productName,
                                    StandardRate: parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g, "")) || 0,
                                }
                            };
                            productService.saveProductService(objServiceDetails).then(function (objServiceDetails) {});
                        };
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
                                    PrefName: 'productview'
                                });
                                if (checkPrefDetails) {
                                    CloudPreference.update({
                                        _id: checkPrefDetails._id
                                    }, {
                                        $set: {
                                            username: clientUsername,
                                            useremail: clientEmail,
                                            PrefGroup: 'inventoryform',
                                            PrefName: 'productview',
                                            published: true,
                                            customFields: [{
                                                    index: '1',
                                                    label: getcustomField1,
                                                    hidden: getchkcustomField1
                                                }, {
                                                    index: '2',
                                                    label: getcustomField2,
                                                    hidden: getchkcustomField2
                                                }
                                            ],
                                            updatedAt: new Date()
                                        }
                                    }, function (err, idTag) {});
                                } else {
                                    CloudPreference.insert({
                                        userid: clientID,
                                        username: clientUsername,
                                        useremail: clientEmail,
                                        PrefGroup: 'inventoryform',
                                        PrefName: 'productview',
                                        published: true,
                                        customFields: [{
                                                index: '1',
                                                label: getcustomField1,
                                                hidden: getchkcustomField1
                                            }, {
                                                index: '2',
                                                label: getcustomField2,
                                                hidden: getchkcustomField2
                                            }
                                        ],
                                        createdAt: new Date()
                                    }, function (err, idTag) {});
                                }
                            }
                        } else {
                            //FlowRouter.go('/inventorylist?success=true');
                        }
                        sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                            addVS1Data('TProductVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                                FlowRouter.go('/inventorylist?success=true');
                            }).catch(function (err) {
                                FlowRouter.go('/inventorylist?success=true');
                            });
                        }).catch(function (err) {
                            FlowRouter.go('/inventorylist?success=true');
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
                                //Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        //$('.loginSpinner').css('display','none');
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }

            }).catch(function (err) {
                if ((itrackThisItem == true) && ($("#sltinventoryacount").val() != '')) {
                    objDetails = {
                        type: "TProductVS1",
                        fields: {
                            Active: true,
                            ProductType: "INV",
                            PRODUCTCODE: productCode,
                            CUSTFLD1: customField1,
                            CUSTFLD2: customField2,
                            CUSTFLD14: lastPriceSetting,
                            CUSTFLD15: lastCostSetting,
                            ProductPrintName: productName,
                            ProductName: productName,
                            PurchaseDescription: $("#txapurchasedescription").val(),
                            SalesDescription: $("#txasalesdescription").val(),
                            AssetAccount: $("#sltinventoryacount").val(),
                            CogsAccount: $("#sltcogsaccount").val(),
                            IncomeAccount: $("#sltsalesacount").val(),
                            BuyQty1: parseFloat($("#edttotalqtyinstock1").val()) || 1,
                            BuyQty1Cost: parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g, "")) || 0,
                            SellQty1: parseFloat($("#edttotalqtyinstock1").val()) || 1,
                            SellQty1Price: parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0,
                            TaxCodePurchase: $("#slttaxcodepurchase").val(),
                            TaxCodeSales: $("#slttaxcodesales").val(),
                            UOMPurchases: defaultUOM,
                            UOMSales: defaultUOM,
                            Barcode: $("#edtbarcode").val(),
                            LockExtraSell: itrackThisItem,
                            ExtraSellPrice: lineExtaSellItems || null,
                            PublishOnVS1: true
                        }
                    };
                } else {
                    objDetails = {
                        type: "TProductVS1",
                        fields: {
                            Active: true,
                            ProductType: "NONINV",
                            PRODUCTCODE: productCode,
                            CUSTFLD1: customField1,
                            CUSTFLD2: customField2,
                            CUSTFLD14: lastPriceSetting,
                            CUSTFLD15: lastCostSetting,
                            ProductPrintName: productName,
                            ProductName: productName,
                            PurchaseDescription: $("#txapurchasedescription").val(),
                            SalesDescription: $("#txasalesdescription").val(),
                            // AssetAccount:$("#sltinventoryacount").val(),
                            CogsAccount: $("#sltcogsaccount").val(),
                            IncomeAccount: $("#sltsalesacount").val(),
                            BuyQty1: parseFloat($("#edttotalqtyinstock1").val()) || 1,
                            BuyQty1Cost: parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g, "")) || 0,
                            SellQty1: parseFloat($("#edttotalqtyinstock1").val()) || 1,
                            SellQty1Price: parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0,
                            TaxCodePurchase: $("#slttaxcodepurchase").val(),
                            TaxCodeSales: $("#slttaxcodesales").val(),
                            UOMPurchases: defaultUOM,
                            UOMSales: defaultUOM,
                            Barcode: $("#edtbarcode").val(),
                            LockExtraSell: itrackThisItem,
                            ExtraSellPrice: lineExtaSellItems || null,
                            PublishOnVS1: true
                        }
                    };
                }

                productService.saveProductVS1(objDetails).then(function (objDetails) {
                    let linesave = objDetails.fields.ID;
                    if (itrackThisItem == false) {
                        let objServiceDetails = {
                            type: "TServices",
                            fields: {
                                ProductId: parseInt(linesave),
                                ServiceDesc: productName,
                                StandardRate: parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g, "")) || 0,
                            }
                        };
                        productService.saveProductService(objServiceDetails).then(function (objServiceDetails) {});
                    };
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
                                PrefName: 'productview'
                            });
                            if (checkPrefDetails) {
                                CloudPreference.update({
                                    _id: checkPrefDetails._id
                                }, {
                                    $set: {
                                        username: clientUsername,
                                        useremail: clientEmail,
                                        PrefGroup: 'inventoryform',
                                        PrefName: 'productview',
                                        published: true,
                                        customFields: [{
                                                index: '1',
                                                label: getcustomField1,
                                                hidden: getchkcustomField1
                                            }, {
                                                index: '2',
                                                label: getcustomField2,
                                                hidden: getchkcustomField2
                                            }
                                        ],
                                        updatedAt: new Date()
                                    }
                                }, function (err, idTag) {});
                            } else {
                                CloudPreference.insert({
                                    userid: clientID,
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'inventoryform',
                                    PrefName: 'productview',
                                    published: true,
                                    customFields: [{
                                            index: '1',
                                            label: getcustomField1,
                                            hidden: getchkcustomField1
                                        }, {
                                            index: '2',
                                            label: getcustomField2,
                                            hidden: getchkcustomField2
                                        }
                                    ],
                                    createdAt: new Date()
                                }, function (err, idTag) {});
                            }
                        }
                    } else {
                        //FlowRouter.go('/inventorylist?success=true');
                    }
                    sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                        addVS1Data('TProductVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                            FlowRouter.go('/inventorylist?success=true');
                        }).catch(function (err) {
                            FlowRouter.go('/inventorylist?success=true');
                        });
                    }).catch(function (err) {
                        FlowRouter.go('/inventorylist?success=true');
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
                            //Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {}
                    });
                    //$('.loginSpinner').css('display','none');
                    $('.fullScreenSpin').css('display', 'none');
                });
            });

        }

    },
    'click .btnBack': function (event) {
        event.preventDefault();
        history.back(1);
    },
    'click #chkTrack': function (event) {
        const templateObject = Template.instance();
        let cloudPackage = localStorage.getItem('vs1cloudlicenselevel');
        if (cloudPackage == "Simple Start") {
            $('#upgradeModal').modal('toggle');
            templateObject.isTrackChecked.set(false);
            event.preventDefault();
            return false;
        } else {
            let checkTracked = templateObject.isTrackChecked.get();
            if (checkTracked == true) {
                swal('You cannot turn off tracking.', '', 'info');
                event.preventDefault();
                return false;
            } else {
                if ($(event.target).is(':checked')) {

                    swal({
                        title: 'PLEASE NOTE',
                        text: "If Inventory tracking is turned on it cannot be disabled in the future.",
                        type: 'info',
                        showCancelButton: true,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.value) {
                            templateObject.isTrackChecked.set(true);
                        } else if (result.dismiss === 'cancel') {
                            $("#chkTrack").prop("checked", false);
                            templateObject.isTrackChecked.set(false);
                        }
                    });
                    // swal('PLEASE NOTE', 'If Inventory Tracking is turned on, it cannot be turned off for this product in the future.', 'info');
                }
            }

        }
        //

        // if($(event.target).is(':checked')){
        //   templateObject.isTrackChecked.set(true);
        //   $('.trackItem').css('display','block');
        //   $('.trackItemvisible').css('visibility','visible');
        //
        //   // swal('PLEASE NOTE', 'If Inventory Tracking is turned on it cannot be turned off for this product in the future.', 'info');
        // }else{
        //   templateObject.isTrackChecked.set(false);
        //   $('.trackItem').css('display','none');
        //   $('.trackItemvisible').css('visibility','hidden');
        // }
    },
    'click #chkSellPrice': function (event) {
        if ($(event.target).is(':checked')) {
            $('.trackCustomerTypeDisc').css('display', 'flex');
        } else {
            $('.trackCustomerTypeDisc').css('display', 'none');
        }
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
    'blur .customField1Text': function (event) {
        var inputValue1 = $('.customField1Text').text();
        $('.lblCustomField1').text(inputValue1);
    },
    'blur .customField2Text': function (event) {
        var inputValue2 = $('.customField2Text').text();
        $('.lblCustomField2').text(inputValue2);
    },
    'click .btnSaveSettings': function (event) {
        $('#myModal2').modal('toggle');
    },
    'click .btnResetSettings': function (event) {
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
                    PrefName: 'productview'
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
    'keydown #edtbuyqty1cost, keydown #edtsellqty1price, keydown #edttotalqtyinstock, keydown #edtsellqty1priceInc, keydown #edtbuyqty1costInc, keydown .edtPriceEx, keydown .edtDiscount, keydown .edtDiscountModal': function (event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            (event.keyCode >= 35 && event.keyCode <= 40)) {
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
    },
    'blur #edtbuyqty1cost': function () {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let costPrice = $('#edtbuyqty1cost').val() || 0;
        let taxcodeList = templateObject.taxraterecords.get();
        var taxRate = $('#slttaxcodepurchase').val();

        var taxrateamount = 0;
        if (taxcodeList) {
            for (var i = 0; i < taxcodeList.length; i++) {
                if (taxcodeList[i].codename == taxRate) {
                    taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100||0;
                }
            }
        }

        let costPriceInc = 0;

        if (!isNaN(costPrice)) {
            $('#edtbuyqty1cost').val(utilityService.modifynegativeCurrencyFormat(costPrice));
        } else {
            costPrice = parseFloat($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
            $('#edtbuyqty1cost').val(utilityService.modifynegativeCurrencyFormat(costPrice));
        }

        var taxTotal = parseFloat(costPrice.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
        costPriceInc = parseFloat(costPrice.replace(/[^0-9.-]+/g, "")) + taxTotal||0;
        $('#edtbuyqty1costInc').val(utilityService.modifynegativeCurrencyFormat(costPriceInc));

    },
    'blur #edtbuyqty1costInc': function () {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let costPriceInc = $('#edtbuyqty1costInc').val() || 0;
        let taxcodeList = templateObject.taxraterecords.get();
        var taxRate = $('#slttaxcodepurchase').val();

        var taxrateamount = 0;
        if (taxcodeList) {
            for (var i = 0; i < taxcodeList.length; i++) {
                if (taxcodeList[i].codename == taxRate) {
                    taxrateamount = taxcodeList[i].coderate * 100||0;
                }
            }
        }

        let costPrice = 0;

        if (!isNaN(costPriceInc)) {
            $('#edtbuyqty1costInc').val(utilityService.modifynegativeCurrencyFormat(costPriceInc));
        } else {
            costPriceInc = parseFloat($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
            $('#edtbuyqty1costInc').val(utilityService.modifynegativeCurrencyFormat(costPriceInc));
        }

        let taxRateAmountCalc = (parseFloat(taxrateamount) + 100) / 100;
        costPrice = (parseFloat(costPriceInc) / (taxRateAmountCalc)) || 0;
        let costPriceTotal = costPriceInc - costPrice|| 0;
        $('#edtbuyqty1cost').val(utilityService.modifynegativeCurrencyFormat(costPriceTotal));

    },
    'change #slttaxcodepurchase': function () {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let costPrice = $('#edtbuyqty1cost').val() || 0;
        let taxcodeList = templateObject.taxraterecords.get();
        var taxRate = $(event.target).val();
        var taxrateamount = 0;
        if (taxcodeList) {
            for (var i = 0; i < taxcodeList.length; i++) {
                if (taxcodeList[i].codename == taxRate) {
                    taxrateamount = taxcodeList[i].coderate || 0;
                }
            }
        }

        let costPriceInc = 0;

        if (!isNaN(costPrice)) {
            $('#edtbuyqty1cost').val(utilityService.modifynegativeCurrencyFormat(costPrice));
        } else {
            costPrice = parseFloat($('#edtbuyqty1cost').val().replace(/[^0-9.-]+/g, "")) || 0;
            $('#edtbuyqty1cost').val(utilityService.modifynegativeCurrencyFormat(costPrice));
        }
        var taxTotal = parseFloat(costPrice) * parseFloat(taxrateamount)||0;
        costPriceInc = parseFloat(costPrice) + taxTotal||0;
        if (!isNaN(costPriceInc)) {
            $('#edtbuyqty1costInc').val(utilityService.modifynegativeCurrencyFormat(costPriceInc));
        }

    },
    'blur #edtsellqty1price': function () {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let taxcodeList = templateObject.taxraterecords.get();
        var taxRate = $('#slttaxcodesales').val();
        var taxrateamount = 0;
        if (taxcodeList) {
            for (var i = 0; i < taxcodeList.length; i++) {
                if (taxcodeList[i].codename == taxRate) {
                    taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100||0;
                }
            }
        }

        let sellPrice = $('#edtsellqty1price').val() || 0;
        let sellPriceInc = 0;

        if (!isNaN(sellPrice)) {
            $('#edtsellqty1price').val(utilityService.modifynegativeCurrencyFormat(sellPrice));
        } else {
            sellPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, ""))||0;
            $('#edtsellqty1price').val(utilityService.modifynegativeCurrencyFormat(sellPrice));
        }

        var taxTotal = Number(sellPrice) * parseFloat(taxrateamount)||0;
        sellPriceInc = Number(sellPrice) + taxTotal||0;
        $('#edtsellqty1priceInc').val(utilityService.modifynegativeCurrencyFormat(sellPriceInc));

        $('.itemExtraSellRow').each(function () {
            var lineID = this.id;
            let tdclientType = $('#' + lineID + " .customerTypeSelect").val();
            //let tdDiscount = $('#' + lineID + " .edtDiscount").val();
            if (tdclientType == "Default") {
                $('#' + lineID + " .edtDiscount").val(0);
                $('#' + lineID + " .edtPriceEx").val(utilityService.modifynegativeCurrencyFormat(sellPrice));
            }

        });

    },
    'blur #edtsellqty1priceInc': function () {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let taxcodeList = templateObject.taxraterecords.get();
        var taxRate = $('#slttaxcodesales').val();
        var taxrateamount = 0;
        if (taxcodeList) {
            for (var i = 0; i < taxcodeList.length; i++) {
                if (taxcodeList[i].codename == taxRate) {
                    taxrateamount = taxcodeList[i].coderate * 100 || 0;
                }
            }
        }

        let sellPriceInc = $('#edtsellqty1priceInc').val() || 0;
        let sellPrice = 0;

        if (!isNaN(sellPriceInc)) {
            $('#edtsellqty1priceInc').val(utilityService.modifynegativeCurrencyFormat(sellPriceInc));
        } else {
            sellPriceInc = Number($(event.target).val().replace(/[^0-9.-]+/g, ""))||0;
            $('#edtsellqty1priceInc').val(utilityService.modifynegativeCurrencyFormat(sellPriceInc));
        }

        let taxRateAmountCalc = (parseFloat(taxrateamount) + 100) / 100||0;
        sellPrice = (parseFloat(sellPriceInc) / (taxRateAmountCalc)) || 0;
        let sellPriceTotal = sellPriceInc - sellPrice|| 0;
        $('#edtsellqty1price').val(utilityService.modifynegativeCurrencyFormat(sellPriceTotal));

        $('.itemExtraSellRow').each(function () {
            var lineID = this.id;
            let tdclientType = $('#' + lineID + " .customerTypeSelect").val();
            //let tdDiscount = $('#' + lineID + " .edtDiscount").val();
            if (tdclientType == "Default") {
                $('#' + lineID + " .edtDiscount").val(0);
                $('#' + lineID + " .edtPriceEx").val(utilityService.modifynegativeCurrencyFormat(sellPrice));
            }

        });

    },
    'change #slttaxcodesales': function () {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let taxcodeList = templateObject.taxraterecords.get();
        var taxRate = $(event.target).val();
        var taxrateamount = 0;
        if (taxcodeList) {
            for (var i = 0; i < taxcodeList.length; i++) {
                if (taxcodeList[i].codename == taxRate) {
                    taxrateamount = taxcodeList[i].coderate || 0;
                }
            }
        }

        let sellPrice = $('#edtsellqty1price').val() || 0;
        let sellPriceInc = 0;

        if (!isNaN(sellPrice)) {
            $('#edtsellqty1price').val(utilityService.modifynegativeCurrencyFormat(sellPrice));
        } else {
            sellPrice = parseFloat(sellPrice.replace(/[^0-9.-]+/g, ""))||0;
            $('#edtsellqty1price').val(utilityService.modifynegativeCurrencyFormat(sellPrice));
        }

        var taxTotal = parseFloat(sellPrice) * parseFloat(taxrateamount)||0;
        sellPriceInc = parseFloat(sellPrice) + taxTotal||0;
        if (!isNaN(sellPriceInc)) {
            $('#edtsellqty1priceInc').val(utilityService.modifynegativeCurrencyFormat(sellPriceInc));
        }

        $('.itemExtraSellRow').each(function () {
            var lineID = this.id;
            let tdclientType = $('#' + lineID + " .customerTypeSelect").val();
            //let tdDiscount = $('#' + lineID + " .edtDiscount").val();
            if (tdclientType == "Default") {
                $('#' + lineID + " .edtDiscount").val(0);
                $('#' + lineID + " .edtPriceEx").val(utilityService.modifynegativeCurrencyFormat(sellPrice));
            }

        });

    },
    'click .btnDeleteInv': function (event) {
        let templateObject = Template.instance();
        let productService = new ProductService();
        swal({
            title: 'Delete Product',
            text: "Do you want to delete this Product?",
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                $('.fullScreenSpin').css('display', 'inline-block');
                var url = FlowRouter.current().path;
                var getso_id = url.split('?id=');
                var currentProduct = FlowRouter.current().queryParams.id || '';
                var objDetails = '';
                if (getso_id[1]) {
                    currentProduct = parseInt(currentProduct);
                    var objDetails = {
                        type: "TProduct",
                        fields: {
                            ID: currentProduct,
                            Active: "True",
                            PublishOnVS1: false
                        }
                    };

                    productService.saveProduct(objDetails).then(function (objDetails) {
                        FlowRouter.go('/inventorylist?success=true');
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
                } else {
                    FlowRouter.go('/inventorylist?success=true');
                }

            } else if (result.dismiss === 'cancel') {
                window.open('/inventorylist', "_self");
            } else {}
        });

    },
    'click .btnUpgradeToEssentials': function (event) {
        window.open('/companyappsettings', '_self');
    },
    'click .addClientType': function (event) {
        $('#myModalClientType').modal();
    },
    'click .btnSaveDept': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let contactService = new ProductService();

        //let headerDept = $('#sltDepartment').val();
        let custType = $('#edtDeptName').val();
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
                sideBarService.getClientTypeData().then(function (dataReload) {
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
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }

    },
    'click .addRowLine': function () {

        var itemDataClone = $('.itemExtraSellRow:first');
        var itemDataCloneLast = $('.itemExtraSellRow:last');
        let tokenid = Random.id();
        var itemClineID = itemDataClone.clone().prop('id', tokenid);
        itemClineID.find('input[type="text"]').val('');
        itemClineID.find('select[name^="sltCustomerType"]').val('');
        itemClineID.insertAfter(".itemExtraSellRow:last");
        // $('.itemExtraSellRow:first').clone().insertAfter(".itemExtraSellRow:last");
    },
    'click .btnRemove': function (event) {
        let templateObject = Template.instance();
        var targetID = $(event.target).closest('.itemExtraSellRow').attr('id');
        if ($('.itemExtraSellRow').length > 1) {
            $("#" + targetID).remove();
        }

    },
    'blur .edtDiscount': function (event) {
        let utilityService = new UtilityService();
        let templateObject = Template.instance();
        var targetID = $(event.target).closest('.itemExtraSellRow').attr('id');
        let itemSellPrice = parseFloat($('#edtsellqty1price').val().replace(/[^0-9.-]+/g, "")) || 0;
        let discountPrice = parseFloat($(event.target).val()) || 0;
        $(event.target).val(discountPrice);
        let getDiscountPrice = (itemSellPrice - (itemSellPrice * discountPrice / 100));
        $("#" + targetID + ' .edtPriceEx').val(utilityService.modifynegativeCurrencyFormat(getDiscountPrice) || 0);

    },
    'blur .edtDiscountModal': function (event) {
        let utilityService = new UtilityService();
        let templateObject = Template.instance();
        //var targetID = $(event.target).closest('.itemExtraSellRow').attr('id');
        let itemSellPrice = parseFloat($('#edtsellqty1price').val().replace(/[^0-9.-]+/g, "")) || 0;
        let discountPrice = parseFloat($(event.target).val()) || 0;
        $(event.target).val(discountPrice);
        let getDiscountPrice = (itemSellPrice - (itemSellPrice * discountPrice / 100));
        $('.edtPriceExModal').val(utilityService.modifynegativeCurrencyFormat(getDiscountPrice) || 0);

    },
    'blur .edtPriceEx': function (event) {
        let utilityService = new UtilityService();
        if (!isNaN($(event.target).val())) {
            let inputUnitPrice = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        }
        let templateObject = Template.instance();
        var targetID = $(event.target).closest('.itemExtraSellRow').attr('id');
        let itemSellPrice = parseFloat($('#edtsellqty1price').val().replace(/[^0-9.-]+/g, "")) || 0;
        let discountPrice = parseFloat($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
        let getDiscountRate = 100 - (discountPrice * 100 / itemSellPrice);
        $("#" + targetID + ' .edtDiscount').val(getDiscountRate || 0);

    },


});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});
