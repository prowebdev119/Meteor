import {ReactiveVar} from 'meteor/reactive-var';
import {TaxRateService} from "../settings-service";
const _ = require('lodash');

let tableData;

let AllAccountRecords = [];
let AssetAccountRecords = [];
let LiabilityAccountRecords = [];
let EquityAccountRecords = [];
let ExpenseAccountRecords = [];
let RevenueAccountRecords = [];
let ArchiveAccountRecords = [];
let addNewAccountsList = [];


import {AccountService} from "../../accounts/account-service";
import {UtilityService} from "../../utility-service";

Template.chartOfAccountSettings.onCreated(() => {
    const templateObject = Template.instance();
    //templateObject.record = new ReactiveVar({});
    templateObject.acctyperecords = new ReactiveVar();
    templateObject.taxraterecords = new ReactiveVar();
    //tempObj.Currencies = new ReactiveVar([]);
    // const templateObject = Template.instance();

    templateObject.selected = new ReactiveVar();
    templateObject.records = new ReactiveVar({});
    templateObject.accountrecord = new ReactiveVar();
    templateObject.receiptTotal = new ReactiveVar();
    templateObject.toBeDeleted = [];
    templateObject.selectedObj = new ReactiveVar([]);
    templateObject.currentTableId = new ReactiveVar();
    templateObject.currentDataTable =  new ReactiveVar({});
    templateObject.newAccountType = new ReactiveVar();


});

Template.chartOfAccountSettings.onRendered(() => {

    const templateObjAccType = Template.instance();
    const templateObjTaxRate = Template.instance();
    let tempInstance = Template.instance();
    const recordsAccType = [];
    const recordsTaxRate = [];
    let accountsList =[];
    let taxCodesList = [];
    let accountTypeService = new TaxRateService();
    let taxRateService = new TaxRateService();
    let accountService = new AccountService();

   /*Start Account Type Drop Down*/
    tempInstance.accountTypeListToAddNew = function () {
        accountService.getAccountTypesToAddNew().then(function (data) {
            let temp = [];
            for (let i = 0; i < data.taccounttype.length; i++) {
                let dataObj = {};
                let label = data.taccounttype[i].OriginalDescription;
                let category = data.taccounttype[i].AccountTypeName;
                dataObj.label = label;
                dataObj.category = category;
                addNewAccountsList.push(dataObj);
                temp.push(dataObj);
            }
            temp = _.orderBy(temp, 'label');
            addNewAccountsList = _.orderBy(temp, 'category');

            setTimeout(function () {
                tempInstance.addAccountDropDown();
            },1000);
        });
    };

    tempInstance.addAccountDropDown = function () {
        $.widget("custom.newaccdropdown", $.ui.autocomplete, {
            _create: function () {
                this._super();
                this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
            },
            _renderMenu: function (ul, items) {
                let that = this,
                    currentCategory = "";
                $.each(items, function (index, item) {
                    let li;
                    if (item.category !== currentCategory) {
                        ul.append("<li class='ui-autocomplete-category'><div class='sub-heading-category'>" + item.category + "</div></li>");
                        currentCategory = item.category;
                    }
                    li = that._renderItemData(ul, item);
                    if (item.category) {
                        li.attr("aria-label", item.category + " : " + item.label);
                    }
                });
            }
        });
        this.$("#account-input").newaccdropdown({
            delay: 0,
            source: addNewAccountsList,
            minLength: 0,
            select: function(event,ui){
                tempInstance.newAccountType.set(ui.item.category);
            }
        }).focus(function () {
            $(this).newaccdropdown('search', "");
        });
        $("#account-input").newaccdropdown( "widget" ).addClass( "select-acc-type" );
    };
    tempInstance.accountTypeListToAddNew();
    /*End Account Type Drop Down*/

    /*Start Tax Drop Down*/
    tempInstance.getAllTaxCodes = function () {
        accountService.getTaxCodes().then(function (data) {
            for (let i = 0; i < data.ttaxcode.length; i++) {
                taxCodesList.push(data.ttaxcode[i].CodeName);
            }
            setTimeout(function(){
                tempInstance.getTaxCodeDropDownForAdd();
            },1000);
            setTimeout(function(){
                tempInstance.getTaxCodeForTaxUpdateModal();
            },1000);
        });
    };
    tempInstance.getTaxCodeDropDownForAdd = function(){
        $(".select-tax-rate").autocomplete({
            source: taxCodesList,
            minLength: 0,
            select: function (event, ui) {
            }
        }).focus(function () {
            $(this).autocomplete('search', "")
        })
    };
    tempInstance.getTaxCodeForTaxUpdateModal = function(){
        $(".select-tax-type-input-list").autocomplete({
            source: taxCodesList,
            minLength: 0,
            select: function (event, ui) {
            }
        }).focus(function () {
            $(this).autocomplete('search', "")
        })
    };

    tempInstance.getAllTaxCodes();
    /*End of Tax Drop Down*/

    let tab = FlowRouter.current().queryParams.tab;
    let filterParam = FlowRouter.current().queryParams;
    if (!$.isEmptyObject(filterParam)) {
        switch (tab) {
            case 'all-accounts':
                $('#SearchTermsText-allaccountlist').val(filterParam.search);
                $('.tableSearchButton-allaccountlist').click();
                break;
            case 'assets-accounts':
                $('#SearchTermsText-accountassetslist').val(filterParam.search);
                $('.tableSearchButton-accountassetslist').click();
                break;
            case 'liabilities-accounts':
                $('#SearchTermsText-accountliabilitylist').val(filterParam.search);
                $('.tableSearchButton-accountliabilitylist').click();
                break;
            case 'equity-accounts':
                $('#SearchTermsText-accountequitylist').val(filterParam.search);
                $('.tableSearchButton-accountequitylist').click();
                break;
            case 'expenses-accounts':
                $('#SearchTermsText-accountexpenselist').val(filterParam.search);
                $('.tableSearchButton-accountexpenselist').click();
                break;
            case 'revenue-accounts':
                $('#SearchTermsText-accountrevenuelist').val(filterParam.search);
                $('.tableSearchButton-accountrevenuelist').click();
                break;
            case 'archive-accounts':
                $('#SearchTermsText-accountarchivelist').val(filterParam.search);
                $('.tableSearchButton-accountarchivelist').click();
                break;
        }

    }

    $("#addNewAccount").modal({
        show: false,
        backdrop: 'static'
    });


    });


Template.chartOfAccountSettings.events({
    'click .accounttype-option': function (event) {
        $(".selected-accounttype").val(event.currentTarget.innerText);

        //getOneAccountTypeByName

    },
    'click .taxrate-option': function (event) {

        $(".selected-accounttaxcode").val(event.currentTarget.innerText);

    },
    'click .account-add-update-save-click': function (event) {
        let tempInstance = Template.instance();
        if (event.target.id !== undefined) {
            let objDetails;
            let accountTypeName = tempInstance.newAccountType.get();
            let accountNo = $('input[name="accountNo"]').val();
            let accountName = $('#accountName').val();
            let accountDesc = $('#accountDesc').val();
            let accountTax = $('#tax-rate-input').val();
            let allowExpenseClaim = null;
            let accountId = parseFloat($('#accountID').val());

            if ($('#chkExpenseClaim').is(':checked')) {
                allowExpenseClaim = true;
            } else {
                allowExpenseClaim = false;
            }

            if (event.target.id === "updateAccount") {
                objDetails = {
                    type: "TAccount",
                    fields:
                        {
                            Id: accountId,
                            Active: true,
                            AllowExpenseClaim: allowExpenseClaim,
                            AccountName: accountName,
                            AccountNumber: accountNo,
                            AccountTypeName: accountTypeName,
                            Description: accountDesc,
                            Level1: accountName,
                            Level2: "",
                            Level3: "",
                            Level4: "",
                            TaxCode: accountTax
                        }
                };
            } else {
                objDetails = {
                    type: "TAccount",
                    fields:
                        {
                            Active: true,
                            AllowExpenseClaim: allowExpenseClaim,
                            AccountName: accountName,
                            AccountNumber: accountNo,
                            AccountTypeName: accountTypeName,
                            Description: accountDesc,
                            TaxCode: accountTax
                        }
                };
            }
            var erpGet = erpDb();
            var oPost = new XMLHttpRequest();

            oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPAccountSend, true);
            oPost.setRequestHeader("database", erpGet.ERPDatabase);
            oPost.setRequestHeader("username", erpGet.ERPUsername);
            oPost.setRequestHeader("password", erpGet.ERPPassword);
            oPost.setRequestHeader("Accept", "application/json");
            oPost.setRequestHeader("Accept", "application/html");
            oPost.setRequestHeader("Content-type", "application/json");

            var myString = JSON.stringify(objDetails);
            oPost.send(myString);
            oPost.timeout = 30000;
            oPost.onreadystatechange = function () {
                if (oPost.readyState == 4 && oPost.status == 200) {
                    var dataReturn = JSON.parse(oPost.responseText);
                    var accountID = dataReturn.fields.ID;
                    if (accountID) {
                        if (event.target.id === "updateAccount") {
                            $('.close-account-modal').click();
                            Bert.alert('<strong>SUCCESS:</strong> ' + accountNo +' : ' + accountName + ' has been updated!', 'success');
                        }else{
                            $('.close-account-modal').click();
                            Bert.alert('<strong>SUCCESS:</strong> ' + accountNo +' : ' + accountName + ' has been added!', 'success');
                        }
                        setTimeout(function () {
                            location.reload();
                        },1000);
                    }
                } else if (oPost.readyState == 4 && oPost.status == 403) {
                    Bert.alert('<strong>' + oPost.getResponseHeader('errormessage') + '!</strong>', 'danger');
                } else if (oPost.readyState == 4 && oPost.status == 406) {
                    var ErrorResponse = oPost.getResponseHeader('errormessage');
                    var segError = ErrorResponse.split(':');
                    if ((segError[1]) == ' "Unable to lock object') {
                        Bert.alert('<strong>' + oPost.getResponseHeader('errormessage') + '</strong>. Please close the Account Information in ERP!', 'danger');
                    } else {
                        Bert.alert('<strong>' + oPost.getResponseHeader('errormessage') + '</strong>!', 'danger');
                    }
                }
            }
            event.preventDefault();
        }
    },
    'click #getPdf': function () {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let tableRecords= templateObject.records.get();
        let tab = FlowRouter.current().queryParams.tab;
        let currentTab=[];
        switch (tab) {
            case 'all-accounts':
                currentTab= tableRecords.allaccountlist;
                break;
            case 'assets-accounts':
                currentTab= tableRecords.accountassetslist;
                break;
            case 'liabilities-accounts':
                currentTab= tableRecords.accountliabilitylist;
                break;
            case 'equity-accounts':
                currentTab= tableRecords.accountequitylist;
                break;
            case 'expenses-accounts':
                currentTab= tableRecords.accountexpenselist;
                break;
            case 'revenue-accounts':
                currentTab= tableRecords.accountrevenuelist;
                break;
            case 'archive-accounts':
                currentTab= tableRecords.accountarchivelist;
                break;
        }
        let records=[];
        for(let i=0;i<currentTab.length;i++){
            let obj=[
                currentTab[i].dataArr[0],
                currentTab[i].dataArr[1],
                currentTab[i].dataArr[2],
                currentTab[i].dataArr[3],
            ]
            records.push(obj);
        }
        let header=[];
        let rows='All Account as at '+moment().format('DD MMMM YYYY');
        $('#chart-accounts-table > thead > tr > th').each(function(){
            var Segs = $(this).text().split('\n');
            Segs=$.trim(Segs[1]);
            header.push(Segs);
        });
        header.pop();
        header=header.slice(1)
        let pageOrientation='portrait-mm-a4';
        let pageTitle=['',loggedCompany,rows,''];
       utilityService.exportToPdfReports(records,'Chart of Accounts',pageTitle,pageOrientation,false,header);
    },

    'click #chart-export': function () {
        let tempInstance = Template.instance();
        let taxRateService = new TaxRateService();
        let utilityService = new UtilityService();
        const filename = 'ChartOfAccounts' + '.csv';
        let rows = [];
        let records = tempInstance.records.get();
        for(let i = 0 ; i < records.allaccountlist.length ; i++){
            rows[0] = ['*Code', '*Name', '*Type', '*Tax Code', 'Description', 'Dashboard', 'Expense Claims', 'Enable Payments', 'Balance'];
            if (records.allaccountlist[i].AllowExpenseClaim === false || records.allaccountlist[i].IsHeader === false) {
                records.allaccountlist[i].AllowExpenseClaim = 'No';
                records.allaccountlist[i].IsHeader = 'No';
                        }
                        else {
                records.allaccountlist[i].AllowExpenseClaim = 'Yes';
                records.allaccountlist[i].IsHeader = 'Yes';
                        }
            rows.push([records.allaccountlist[i].dataArr[0],records.allaccountlist[i].dataArr[1],records.allaccountlist[i].dataArr[2],records.allaccountlist[i].dataArr[3],records.allaccountlist[i].Description,records.allaccountlist[i].IsHeader,records.allaccountlist[i].AllowExpenseClaim,'No','0.00']);
        }
        utilityService.exportToCsv(rows, filename, 'csv');
    },
    'click .chart-accounts-tab-li li': function (event) {
        if (event.originalEvent !== undefined) {
          let  templateObject = Template.instance();
            let recordsCopy  =  templateObject.records.get();

            let tab = FlowRouter.current().queryParams.tab;
            switch (tab) {
                case 'all-accounts':
                    $('#SearchTermsText-allaccountlist').val('');
                    $('.tableSearchButton-allaccountlist').click();
                    break;
                case 'assets-accounts':
                    $('#SearchTermsText-accountassetslist').val('');
                    $('.tableSearchButton-accountassetslist').click();
                    break;
                case 'liabilities-accounts':
                    $('#SearchTermsText-accountliabilitylist').val('');
                    $('.tableSearchButton-accountliabilitylist').click();
                    break;
                case 'equity-accounts':
                    $('#SearchTermsText-accountequitylist').val('');
                    $('.tableSearchButton-accountequitylist').click();
                    break;
                case 'expenses-accounts':
                    $('#SearchTermsText-accountexpenselist').val('');
                    $('.tableSearchButton-accountexpenselist').click();
                    break;
                case 'revenue-accounts':
                    $('#SearchTermsText-accountrevenuelist').val('');
                    $('.tableSearchButton-accountrevenuelist').click();
                    break;
                case 'archive-accounts':
                    $('#SearchTermsText-accountarchivelist').val('');
                    $('.tableSearchButton-accountarchivelist').click();
                    break;
            }

            templateObject.unchecked = function (event) {
                let currentTableId = templateObject.currentTableId.get();
                $("input.head-checkbox").prop('checked', false);
                $('.table-row-checkbox').prop('checked', false);
                templateObject.toBeDeleted = [];
                templateObject.selectedObj.set(templateObject.toBeDeleted);


                if (typeof recordsCopy !== 'undefined') {
                    recordsCopy.forEach((record) => {
                        record.selected = false;
                    });

                    let allRecords  =  templateObject.records.get();
                    allRecords[currentTableId] = recordsCopy;
                    templateObject.records.set(allRecords);
                }

            };

            switch (event.currentTarget.id) {
                case 'all-accounts' :
                    FlowRouter.go('/settings/accounts/all-accounts');
                    templateObject.currentTableId.set('allaccountlist');
                    recordsCopy  = recordsCopy.allaccountlist;
                    break;
                case 'assets-accounts' :
                    FlowRouter.go('/settings/accounts/assets-accounts');
                    templateObject.currentTableId.set('accountassetslist');
                    recordsCopy  = recordsCopy.accountassetslist;
                    templateObject.unchecked(event);
                    break;
                case 'liabilities-accounts' :
                    FlowRouter.go('/settings/accounts/liabilities-accounts');
                    templateObject.currentTableId.set('accountliabilitylist');
                    recordsCopy  = recordsCopy.accountliabilitylist;
                    templateObject.unchecked(event);
                    break;
                case 'equity-accounts' :
                    FlowRouter.go('/settings/accounts/equity-accounts');
                    templateObject.currentTableId.set('accountequitylist');
                    recordsCopy  = recordsCopy.accountequitylist;
                    templateObject.unchecked(event);
                    break;
                case 'expenses-accounts' :
                    FlowRouter.go('/settings/accounts/expenses-accounts');
                    templateObject.currentTableId.set('accountexpenselist');
                    recordsCopy  = recordsCopy.accountexpenselist;
                    templateObject.unchecked(event);
                    break;
                case 'revenue-accounts' :
                    FlowRouter.go('/settings/accounts/revenue-accounts');
                    templateObject.currentTableId.set('accountrevenuelist');
                    recordsCopy  = recordsCopy.accountrevenuelist;
                    templateObject.unchecked(event);
                    break;
                case 'archive-accounts' :
                    FlowRouter.go('/settings/accounts/archive-accounts');
                    templateObject.currentTableId.set('accountarchivelist');
                    recordsCopy  = recordsCopy.accountarchivelist;
                    templateObject.unchecked(event);
                    break;
            }



        }

    },

    'click .checkbox-allaccountlist, click .checkbox-accountassetslist, click .checkbox-accountliabilitylist, click .checkbox-accountequitylist, click .checkbox-accountexpenselist, click .checkbox-accountrevenuelist, click .checkbox-accountarchivelist': function (event) {
        let templateObj = Template.instance();
        let toBeDeleted = templateObj.toBeDeleted;
        let currentTableId = templateObj.currentTableId.get();
        if (!this.id) {
            return false;
        }
        if (!this.selected) {
            let details = {id: this.id};
            toBeDeleted.push(details);
        }
        else {
            let idTobeRemoved = toBeDeleted.map(function(e) { return e.id; }).indexOf(parseInt(this.id));
            toBeDeleted.splice(idTobeRemoved,1);
        }
        let chartRecords = templateObj.records.get();
        let records = chartRecords[currentTableId];
        let index = records.indexOf(this);
        if (index !== -1) {
            this.selected = !this.selected;
            records[index].selected = this.selected;
            chartRecords[currentTableId] = records;
            templateObj.records.set(chartRecords);
        }
        templateObj.selectedObj.set(toBeDeleted);
        Session.set('selectedRecords', templateObj.selectedObj.get().length);

        let flag = true;
        let currentDataTablePage;
        let currentDataTable = templateObj.currentDataTable.get();

        switch (currentTableId) {
            case 'allaccountlist' :
                searchInDatatable = currentDataTable.allAccounts;
                break;
            case 'accountassetslist' :
                searchInDatatable = currentDataTable.accountassetslist;
                break;
            case 'accountliabilitylist' :
                searchInDatatable = currentDataTable.accountliabilitylist;
                break;
            case 'accountequitylist' :
                searchInDatatable = currentDataTable.accountequitylist;
                break;
            case 'accountexpenselist' :
                searchInDatatable = currentDataTable.accountexpenselist;
                break;
            case 'accountrevenuelist' :
                searchInDatatable = currentDataTable.accountrevenuelist;
                break;
            case 'accountarchivelist' :
                searchInDatatable = currentDataTable.accountarchivelist;
                break;
        }

        let allRecords = searchInDatatable.rows({page: 'current'}).data();
        for (let i = 0; i < allRecords.length; i++) {
            let recordId = allRecords[i].DT_RowId;
            recordId = parseInt(recordId.split('caccount-row-')[1]);
            if (!($('#caccount-'+currentTableId+'-'+recordId).prop('checked') === true)) {
                flag = false;
            }
        }
        $('#head-check-' + currentTableId).prop('checked', flag);
    },

    'click #head-check-allaccountlist, click #head-check-accountassetslist, click #head-check-accountliabilitylist, click #head-check-accountequitylist, click #head-check-accountexpenselist, click #head-check-accountrevenuelist, click #head-check-accountarchivelist': function (event) {

        let templateObj = Template.instance();
        let currentTableId = templateObj.currentTableId.get();
        let chartRecords = templateObj.records.get();
        let records = chartRecords[currentTableId];
        templateObj.toBeDeleted = [];
        let allRecordIDs = [];
        let searchInDatatable;
        let currentDataTable = templateObj.currentDataTable.get();

        switch (currentTableId) {
            case 'allaccountlist' :
                searchInDatatable = currentDataTable.allAccounts;
                break;
            case 'accountassetslist' :
                searchInDatatable = currentDataTable.accountassetslist;
                break;
            case 'accountliabilitylist' :
                searchInDatatable = currentDataTable.accountliabilitylist;
                break;
            case 'accountequitylist' :
                searchInDatatable = currentDataTable.accountequitylist;
                break;
            case 'accountexpenselist' :
                searchInDatatable = currentDataTable.accountexpenselist;
                break;
            case 'accountrevenuelist' :
                searchInDatatable = currentDataTable.accountrevenuelist;
                break;
            case 'accountarchivelist' :
                searchInDatatable = currentDataTable.accountarchivelist;
                break;
        }
        // searchInDatatable = $('.table-' + currentTableId).DataTable();
        let allRecords = searchInDatatable.rows({page: 'current'}).data();
        for (let i = 0; i < allRecords.length; i++) {
            let recordId = allRecords[i].DT_RowId;
            recordId = parseInt(recordId.split('caccount-row-')[1]);
            let recordObj = {'id': recordId};
            allRecordIDs.push(recordObj);
        }

        /*To Select all the records in Current page*/
        if (document.getElementById(event.target.id).checked) {
            for (let i = 0; i < allRecordIDs.length; i++) {
                for (let j = 0; j < records.length; j++) {
                    if (records[j].id === allRecordIDs[i].id) {
                        records[j].selected = true;
                        let toBeDeletedObject = {
                            id: records[j].id
                        };
                        templateObj.toBeDeleted.push(toBeDeletedObject);
                        break;
                    }
                }
            }
        }
        else {
            /*To Deselect all the records in Current page*/
            for (let i = 0; i < allRecordIDs.length; i++) {
                for (let j = 0; j < records.length; j++) {
                    if (records[j].id === allRecordIDs[i].id) {
                        records[j].selected = false;
                        break;
                    }
                }
            }
            templateObj.toBeDeleted = [];
        }

        chartRecords[currentTableId] = records;
        templateObj.records.set(chartRecords);
        templateObj.selectedObj.set(templateObj.toBeDeleted);
        Session.set('selectedRecords', templateObj.selectedObj.get().length);

    },

    'click .disable-click-event': function (event) {
        event.stopPropagation();
    },

    'click .current-account-row': function (e) {

        var $cell = $(e.target).closest('td');
        if (($cell.index() != 0)) {
            $('.current-account-row').attr('data-target', '#addNewAccount');
            $('.current-account-row').attr('data-toggle', 'modal');
            $('#add-account-title').text('Edit Account Details');
            $('.account-add-update-save-click').attr('id','updateAccount');
            let accountId = this.id;
            const templateObject3 = Template.instance();
            let accountService = new TaxRateService();
            if (accountId !== '') {
                accountId = Number(accountId);
                templateObject3.getOneAccounts = function () {
                    accountService.getOneAccount(accountId).then(function (data) {

                        let AccountRecord = {
                            AccountName: data.fields.AccountName || ' ',
                            AccountNumber: data.fields.AccountNumber || ' ',
                            Description: data.fields.Description || ' ',
                            AccountTypeName: data.fields.AccountTypeName || ' ',
                            AllowExpenseClaim: data.fields.AllowExpenseClaim,
                            TaxCode: data.fields.TaxCode || ' ',
                        };

                        $('#accountID').val(accountId);
                        $('input[name="accountNo"]').val(AccountRecord.AccountNumber);
                        $('#accountName').val(AccountRecord.AccountName);
                        $('#accountDesc').val(AccountRecord.Description);
                        $('#account-input').val(AccountRecord.AccountTypeName);
                        $('#tax-rate-input').val(AccountRecord.TaxCode);

                        if (AccountRecord.AllowExpenseClaim == true) {
                            $('#chkExpenseClaim').prop('checked', true);
                        } else {
                            $('#chkExpenseClaim').prop('checked', false);
                        }
                    });
                };
                templateObject3.getOneAccounts();
            }

        } else {
            $('.current-account-row').attr('data-target', '');
            $('.current-account-row').attr('data-toggle', '');
        }
    },
    'click .tableSearchButton-allaccountlist, click .tableSearchButton-accountassetslist, click .tableSearchButton-accountliabilitylist, click .tableSearchButton-accountequitylist, click .tableSearchButton-accountexpenselist, click .tableSearchButton-accountrevenuelist, click .tableSearchButton-accountarchivelist ': function (e) {
        let templateObj = Template.instance();
        let currentTableId = templateObj.currentTableId.get();
        let searchData = $('#SearchTermsText-' + currentTableId).val();
        let searchInDatatable;
        let currentDataTable = templateObj.currentDataTable.get();
        switch (currentTableId) {
            case 'allaccountlist' :
                searchInDatatable = currentDataTable.allAccounts;
                break;
            case 'accountassetslist' :
                searchInDatatable = currentDataTable.accountassetslist;
                break;
            case 'accountliabilitylist' :
                searchInDatatable = currentDataTable.accountliabilitylist;
                break;
            case 'accountequitylist' :
                searchInDatatable = currentDataTable.accountequitylist;
                break;
            case 'accountexpenselist' :
                searchInDatatable = currentDataTable.accountexpenselist;
                break;
            case 'accountrevenuelist' :
                searchInDatatable = currentDataTable.accountrevenuelist;
                break;
            case 'accountarchivelist' :
                searchInDatatable = currentDataTable.accountarchivelist;
                break;
        }

        if (typeof searchInDatatable !== 'undefined') {
            searchInDatatable.search(searchData).draw();
        }
    },
    'change .page-record-count': function () {
        templateObject = Template.instance();
        let recordsCopy  =  templateObject.records.get();
        templateObject.unchecked = function (event) {
            let currentTableId = templateObject.currentTableId.get();
            $("input.head-checkbox").prop('checked', false);
            $('.table-row-checkbox').prop('checked', false);
            templateObject.toBeDeleted = [];
            templateObject.selectedObj.set(templateObject.toBeDeleted);
            if (typeof recordsCopy !== 'undefined') {
                recordsCopy.forEach((record) => {
                    record.selected = false;
                });

                let allRecords  =  templateObject.records.get();
                allRecords[currentTableId] = recordsCopy;
                templateObject.records.set(allRecords);
            }
        };

        let tab = FlowRouter.current().queryParams.tab;
        switch (tab) {
            case 'all-accounts':
                recordsCopy  = recordsCopy.allaccountlist;
                templateObject.unchecked(event);
                break;
            case 'assets-accounts':
                recordsCopy  = recordsCopy.accountassetslist;
                templateObject.unchecked(event);
                break;
            case 'liabilities-accounts':
                recordsCopy  = recordsCopy.accountliabilitylist;
                templateObject.unchecked(event);
                break;
            case 'equity-accounts':
                recordsCopy  = recordsCopy.accountequitylist;
                templateObject.unchecked(event);
                break;
            case 'expenses-accounts':
                recordsCopy  = recordsCopy.accountexpenselist;
                templateObject.unchecked(event);
                break;
            case 'revenue-accounts':
                recordsCopy  = recordsCopy.accountrevenuelist;
                templateObject.unchecked(event);
                break;
            case 'archive-accounts':
                recordsCopy  = recordsCopy.accountarchivelist;
                templateObject.unchecked(event);
                break;
        }
    },
    'click .archive-modal-click': function (event) {
        let templateObj = Template.instance();
        let objDetails;
        let accountService = new TaxRateService();
        let selectedRecords = templateObj.selectedObj.get();
        selectedRecords.forEach(function (data, i) {
            objDetails = {
                "type":"TAccount",
                "fields":
                    {
                        "ID":data.id,
                        "Active":true,
                        "Extra":"Archive"
                    }
            };
            accountService.saveAccount(objDetails).then(function (data) {
                if(selectedRecords.length === 0){
                    setTimeout(function () {
                        $('.close').click();
                        $('.modal-backdrop.fade.in').remove();
                        Bert.alert('<strong>SUCCESS: </strong> ' + selectedRecords.length+ ' account has been archived!', 'success');
                        Router.current().render(Template.chartOfAccountSettings);
                    }, 1000)
                }

                if (i === selectedRecords.length - 1) {
                    setTimeout(function () {
                        $('.close').click();
                        $('.modal-backdrop.fade.in').remove();
                        Bert.alert('<strong>SUCCESS: </strong> ' + selectedRecords.length+ ' account has been archived!', 'success');
                        Router.current().render(Template.chartOfAccountSettings);


                    }, 1000)
                }
            }).catch(function (err, code) {
                Bert.alert('<strong>WARNING:</strong> Hey ! ' + err, 'warning');
            });
        })
    },
    'click .delete-account-modal-click': function (event) {
        let templateObj = Template.instance();
        let objDetails;
        let accountService = new TaxRateService();
        let selectedRecords = templateObj.selectedObj.get();
        selectedRecords.forEach(function (data, i) {
            objDetails = {
                "type":"TAccount",
                "fields":
                    {
                        "ID":data.id,
                        "Active":false,
                    }
            };
            accountService.saveAccount(objDetails).then(function (data) {
                if(selectedRecords.length === 0){
                    setTimeout(function () {
                        $('.close').click();
                        $('.modal-backdrop.fade.in').remove();
                        Bert.alert('<strong>SUCCESS : </strong> ' + selectedRecords.length + ' account has been deleted!', 'success');
                        Router.current().render(Template.chartOfAccountSettings);

                    }, 1000)
                }

                if (i === selectedRecords.length - 1) {
                    setTimeout(function () {
                        $('.close').click();
                        $('.modal-backdrop.fade.in').remove();
                        Bert.alert('<strong>SUCCESS : </strong> ' + selectedRecords.length + ' account has been deleted!', 'success');
                        Router.current().render(Template.chartOfAccountSettings);
                    }, 1000)
                }
            }).catch(function (err, code) {
                Bert.alert('<strong>WARNING:</strong> Hey ! ' + err, 'warning');
            });
        })
    },
    'click #restoreAccounts': function (event) {
        let templateObj = Template.instance();
        let objDetails;
        let accountService = new TaxRateService();
        let selectedRecords = templateObj.selectedObj.get();
        selectedRecords.forEach(function (data, i) {
            objDetails = {
                "type":"TAccount",
                "fields":
                    {
                        "ID":data.id,
                        "Extra":""
                    }
            };
            accountService.saveAccount(objDetails).then(function (data) {
                if(selectedRecords.length === 0){
                    setTimeout(function () {
                        Bert.alert('<strong>SUCCESS: </strong>' + selectedRecords.length+ ' account has been restored!', 'success');
                        Router.current().render(Template.chartOfAccountSettings);
                    }, 1000)
                }

                if (i === selectedRecords.length - 1) {
                    setTimeout(function () {
                        Bert.alert('<strong>SUCCESS: </strong>' + selectedRecords.length+ ' account has been restored!', 'success');
                        Router.current().render(Template.chartOfAccountSettings);
                    }, 1000)
                }
            }).catch(function (err, code) {
                Bert.alert('<strong>WARNING:</strong> Hey ! ' + err, 'warning');
            });
        })

    },
    'click .tax-rate-list-dropdown-img': function (event) {
        let templateObject = Template.instance();
        templateObject.$(".select-tax-type-input-list").trigger("focus");
    },
    'click .update-all-tax-rates': function (event) {
        let templateObj = Template.instance();
        let objDetails;
        let accountService = new TaxRateService();
        let taxCode = $('.select-tax-type-input-list').val();
        if(taxCode !== '' || taxRate !== undefined ){
            let selectedRecords = templateObj.selectedObj.get();
            selectedRecords.forEach(function (data, i) {
                objDetails = {
                    "type":"TAccount",
                    "fields":
                        {
                            "ID":data.id,
                            "TaxCode":taxCode,
                        }
                };
                accountService.saveAccount(objDetails).then(function (data) {
                    if(selectedRecords.length === 0){
                        setTimeout(function () {
                            $('.close').click();
                            $('.modal-backdrop.fade.in').remove();
                            Bert.alert('<strong>SUCCESS : </strong> ' + selectedRecords.length + ' account has been updated to use tax rate :'+taxCode, 'success');
                            setTimeout(function () {
                                Meteor._reload.reload();
                            }, 1000)

                        }, 1000)
                    }

                    if (i === selectedRecords.length - 1) {
                        setTimeout(function () {
                            $('.close').click();
                            $('.modal-backdrop.fade.in').remove();
                            Bert.alert('<strong>SUCCESS : </strong> ' + selectedRecords.length + ' account has been updated to use tax rate :'+taxCode, 'success');
                            setTimeout(function () {
                                Meteor._reload.reload();
                            }, 1000)
                        }, 1000)
                    }
                }).catch(function (err, code) {
                    Bert.alert('<strong>WARNING:</strong> Hey ! ' + err, 'warning');
                });
            })
        }

    },
    'click #acc-dropdown-img': function (event) {
        let templateObject = Template.instance();
        templateObject.$("#account-input").trigger("focus");
    },
    'click #tax-dropdown-img': function (event) {
        let templateObject = Template.instance();
        templateObject.$("#tax-rate-input").trigger("focus");
    },
    'click #add-new-account-modal': function (event) {
        $('#add-account-title').text('Add New Account');
        $('.account-add-update-save-click').attr('id', 'addNewAccount');
    },
    'click .close-account-modal': function (event){
        $('#accountID').val('');
        $('input[name="accountNo"]').val('');
        $('#accountName').val('');
        $('#accountDesc').val('');
        $('#account-input').val('');
        $('#tax-rate-input').val('');
        $('#chkExpenseClaim').prop('checked', false);
        $('.account-add-update-save-click').attr('id', '');

    },
    'click #close-draft-aw-notification':function(){
        let tempObj = Template.instance();
        tempObj.$(".notify").hide();
        Session.set('addBankAccount',false);
    }
});

Template.chartOfAccountSettings.helpers({

    acctyperecords: () => {
        return Template.instance().acctyperecords.get();
    },
    taxraterecords: () => {
        return Template.instance().taxraterecords.get();
    },
    selectedrecords: () => {
        return Session.get('selectedRecords');
    },

    records: () => {
        return Template.instance().records.get();
    },

    selectedObj: () => {
        return Template.instance().selectedObj.get().length;
    },

    receiptCount: () => {
        return Template.instance().records.get() ? Template.instance().records.get().length : 0;
    },

    accountrecord: () => {
        return Template.instance().accountrecord.get();
    },
    currentId: () => {
        return Template.instance().currentId.get();
    },
    newAccountType: () => {
        return Template.instance().newAccountType.get();
    },
    addSingleBankAccount: () => {
        return Session.get('addSingleBankAccount');
    },
    addMultipleBankAccount: () => {
        return Session.get('addMultipleBankAccount');
    },
    addBankAccount: () => {
        return Session.get('addBankAccount');
    },
    accountName: () => {
        return Session.get('accountName');
    },
    accountCode: () => {
        return Session.get('accountCode');
    }
});


Template.chartOfAccountSettings.onRendered(function () {


    const templateObject = Template.instance();
    // templateObject.AllAccountRecords;


    let accountListService = new TaxRateService();
    let tab = FlowRouter.current().queryParams.tab;
    switch (tab) {
        case 'all-accounts':
            $('.chart-accounts-tab-li a[href="#Accounts"]').trigger('click');
            templateObject.currentTableId.set('allaccountlist');
            break;
        case 'assets-accounts':
            $('.chart-accounts-tab-li a[href="#Assets"]').trigger('click');
            templateObject.currentTableId.set('accountassetslist');
            break;
        case 'liabilities-accounts':
            $('.chart-accounts-tab-li a[href="#Liabilities"]').trigger('click');
            templateObject.currentTableId.set('accountliabilitylist');
            break;
        case 'equity-accounts':
            $('.chart-accounts-tab-li a[href="#Equity"]').trigger('click');
            templateObject.currentTableId.set('accountequitylist');
            break;
        case 'expenses-accounts':
            $('.chart-accounts-tab-li a[href="#Expenses"]').trigger('click');
            templateObject.currentTableId.set('accountexpenselist');
            break;
        case 'revenue-accounts':
            $('.chart-accounts-tab-li a[href="#Revenue"]').trigger('click');
            templateObject.currentTableId.set('accountrevenuelist');
            break;
        case 'archive-accounts':
            $('.chart-accounts-tab-li a[href="#Archive"]').trigger('click');
            templateObject.currentTableId.set('accountarchivelist');
            break;
    }


    templateObject.getAccountLists = function () {
        accountListService.getAccountList().then(function (data) {
            let records = [];

            for (let i = 0, len = data.taccount.length; i < len; i++) {
                let recordObj = {};

                recordObj.id = data.taccount[i].fields.ID;
                recordObj.selected = false;
                recordObj.currentPayment = true;
                recordObj.Description = data.taccount[i].fields.Description;
                recordObj.IsHeader = data.taccount[i].fields.IsHeader;
                recordObj.AllowExpenseClaim = data.taccount[i].fields.AllowExpenseClaim;
                recordObj.dataArr = [
                    data.taccount[i].fields.AccountNumber || '-',
                    data.taccount[i].fields.AccountName || '-',
                    data.taccount[i].fields.AccountTypeName || '-',
                    data.taccount[i].fields.TaxCode || '-',
                    '-' || '-',

                ];
                records.push(recordObj);
            }
            let allRecords = templateObject.records.get();
            allRecords.allaccountlist = records;
            templateObject.records.set(allRecords);
            setTimeout(() => {
                let allAccountListTableData = $('.table-allaccountlist').DataTable({
                    columnDefs: [
                        {orderable: false, targets: 0}
                    ],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    colReorder: {
                        fixedColumnsLeft: 0
                    },
                    bStateSave: true,
                    info: false,
                    action: function () {
                        table.ajax.reload();
                    },
                    "dom": '<"top"i>rt<"bottom"flp><"clear">',
                    "fnDrawCallback": function (oSettings) {
                        if (oSettings._iDisplayLength == -1
                            || 10 > oSettings.fnRecordsDisplay()) {
                            jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_info').hide();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length').hide();
                        } else {
                            jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length>label>select').addClass('page-record-count');
                            jQuery(oSettings.nTableWrapper).find('.dataTables_info').show();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length').show();
                        }
                    },
                }).on('page', function () {

                    let recordsCopy;
                    let recordsData = templateObject.records.get();
                    recordsCopy = recordsData.allaccountlist;
                    recordsCopy.forEach((record) => {
                        record.selected = false;
                    });
                    templateObject.toBeDeleted = [];
                    recordsData.allaccountlist = recordsCopy;
                    templateObject.records.set(recordsData);
                    templateObject.selectedObj.set(templateObject.toBeDeleted);
                    Session.set('selectedRecords', templateObject.selectedObj.get().length);
                    $('#head-check-allaccountlist').prop('checked', false);
                    $('.checkbox-allaccountlist').prop('checked', false);
                });

                let currentDataTable = templateObject.currentDataTable.get();
                currentDataTable.allAccounts = allAccountListTableData;
                templateObject.currentDataTable.set(currentDataTable);
            }, 0);
        })
    };

    templateObject.getAccountAssetsLists = function () {
        accountListService.getAssetAccountList().then(function (data) {
            let records = [];

            for (let i = 0, len = data.taccount.length; i < len; i++) {
                let recordObj = {};

                recordObj.id = data.taccount[i].fields.ID;
                recordObj.selected = false;
                recordObj.currentPayment = true;
                recordObj.dataArr = [
                    data.taccount[i].fields.AccountNumber || '-',
                    data.taccount[i].fields.AccountName || '-',
                    data.taccount[i].fields.AccountTypeName || '-',
                    data.taccount[i].fields.TaxCode || '-',
                    '-' || '-',

                ];
                records.push(recordObj);
            }
            let allRecords = templateObject.records.get();
            allRecords.accountassetslist = records;
            templateObject.records.set(allRecords);
            setTimeout(() => {
                let accountAssetsListTableData = $('.table-accountassetslist').DataTable({
                    sDom: "Rlfrtip",
                    info: false,
                    colReorder: true,
                    colReorder: {
                        fixedColumnsLeft: 0
                    },
                    columnDefs: [
                        {orderable: false, targets: 0}
                    ],
                    "bStateSave": true,
                    "dom": '<"top"i>rt<"bottom"flp><"clear">',
                    "fnDrawCallback": function (oSettings) {
                        if (oSettings._iDisplayLength == -1
                            || 10 > oSettings.fnRecordsDisplay()) {
                            jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_info').hide();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length').hide();
                        } else {
                            jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_info').show();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length>label>select').addClass('page-record-count');
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length').show();
                        }
                    },
                }).on('page', function () {
                    let recordsCopy;
                    let recordsData = templateObject.records.get();
                    recordsCopy = recordsData.accountassetslist;
                    recordsCopy.forEach((record) => {
                        record.selected = false;
                    });
                    templateObject.toBeDeleted = [];
                    recordsData.accountassetslist = recordsCopy;
                    templateObject.records.set(recordsData);
                    templateObject.selectedObj.set(templateObject.toBeDeleted);
                    Session.set('selectedRecords', templateObject.selectedObj.get().length);
                    $('#head-check-accountassetslist').prop('checked', false);
                    $('.checkbox-accountassetslist').prop('checked', false);
                });

                let currentDataTable = templateObject.currentDataTable.get();
                currentDataTable.accountassetslist = accountAssetsListTableData;
                templateObject.currentDataTable.set(currentDataTable);

            }, 0);
        })
    };

    templateObject.getAccountLiabilityLists = function () {
        accountListService.getLiabilityAccountList().then(function (data) {
            let records = [];

            for (let i = 0, len = data.taccount.length; i < len; i++) {
                let recordObj = {};

                recordObj.id = data.taccount[i].fields.ID;
                recordObj.selected = false;
                recordObj.currentPayment = true;
                recordObj.dataArr = [
                    data.taccount[i].fields.AccountNumber || '-',
                    data.taccount[i].fields.AccountName || '-',
                    data.taccount[i].fields.AccountTypeName || '-',
                    data.taccount[i].fields.TaxCode || '-',
                    '-' || '-',

                ];
                records.push(recordObj);
            }
            let allRecords = templateObject.records.get();
            allRecords.accountliabilitylist = records;
            templateObject.records.set(allRecords);
            setTimeout(() => {
                let accountLiabilityListTableData = $('.table-accountliabilitylist').DataTable({
                    sDom: "Rlfrtip",
                    info: false,
                    colReorder: true,
                    colReorder: {
                        fixedColumnsLeft: 0
                    },
                    columnDefs: [
                        {orderable: false, targets: 0}
                    ],
                    "bStateSave": true,
                    "dom": '<"top"i>rt<"bottom"flp><"clear">',
                    "fnDrawCallback": function (oSettings) {
                        if (oSettings._iDisplayLength == -1
                            || 10 > oSettings.fnRecordsDisplay()) {
                            jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_info').hide();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length').hide();
                        } else {
                            jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_info').show();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length>label>select').addClass('page-record-count');
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length').show();
                        }
                    },
                }).on('page', function () {
                    let recordsCopy;
                    let recordsData = templateObject.records.get();
                    recordsCopy = recordsData.accountliabilitylist;
                    recordsCopy.forEach((record) => {
                        record.selected = false;
                    });
                    templateObject.toBeDeleted = [];
                    recordsData.accountliabilitylist = recordsCopy;
                    templateObject.records.set(recordsData);
                    templateObject.selectedObj.set(templateObject.toBeDeleted);
                    Session.set('selectedRecords', templateObject.selectedObj.get().length);
                    $('#head-check-accountliabilitylist').prop('checked', false);
                    $('.checkbox-accountliabilitylist').prop('checked', false);
                });

                let currentDataTable = templateObject.currentDataTable.get();
                currentDataTable.accountliabilitylist = accountLiabilityListTableData;
                templateObject.currentDataTable.set(currentDataTable);
            }, 0);
        })
    };


    templateObject.getAccountEquityLists = function () {
        accountListService.getEquityAccountList().then(function (data) {
            let records = [];

            for (let i = 0, len = data.taccount.length; i < len; i++) {
                let recordObj = {};

                recordObj.id = data.taccount[i].fields.ID;
                recordObj.selected = false;
                recordObj.currentPayment = true;
                recordObj.dataArr = [
                    data.taccount[i].fields.AccountNumber || '-',
                    data.taccount[i].fields.AccountName || '-',
                    data.taccount[i].fields.AccountTypeName || '-',
                    data.taccount[i].fields.TaxCode || '-',
                    '-' || '-',

                ];
                records.push(recordObj);
            }
            let allRecords = templateObject.records.get();
            allRecords.accountequitylist = records;
            templateObject.records.set(allRecords);
            setTimeout(() => {
                let AccountEquityListTableData = $('.table-accountequitylist').DataTable({
                    sDom: "Rlfrtip",
                    info: false,
                    colReorder: true,
                    colReorder: {
                        fixedColumnsLeft: 0
                    },
                    columnDefs: [
                        {orderable: false, targets: 0}
                    ],
                    "bStateSave": true,
                    "dom": '<"top"i>rt<"bottom"flp><"clear">',
                    "fnDrawCallback": function (oSettings) {
                        if (oSettings._iDisplayLength == -1
                            || 10 > oSettings.fnRecordsDisplay()) {
                            jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_info').hide();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length').hide();
                        } else {
                            jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_info').show();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length>label>select').addClass('page-record-count');
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length').show();
                        }
                    },
                }).on('page', function () {
                    let recordsCopy;
                    let recordsData = templateObject.records.get();
                    recordsCopy = recordsData.accountequitylist;
                    recordsCopy.forEach((record) => {
                        record.selected = false;
                    });
                    templateObject.toBeDeleted = [];
                    recordsData.accountequitylist = recordsCopy;
                    templateObject.records.set(recordsData);
                    templateObject.selectedObj.set(templateObject.toBeDeleted);
                    Session.set('selectedRecords', templateObject.selectedObj.get().length);
                    $('#head-check-accountequitylist').prop('checked', false);
                    $('.checkbox-accountequitylist').prop('checked', false);

                });

                let currentDataTable = templateObject.currentDataTable.get();
                currentDataTable.accountequitylist = AccountEquityListTableData;
                templateObject.currentDataTable.set(currentDataTable);

            }, 0);
        });
    };

    templateObject.getAccountExpenseLists = function () {
        accountListService.getExpenseAccountList().then(function (data) {
            let records = [];

            for (let i = 0, len = data.taccount.length; i < len; i++) {
                let recordObj = {};

                recordObj.id = data.taccount[i].fields.ID;
                recordObj.selected = false;
                recordObj.currentPayment = true;
                recordObj.dataArr = [
                    data.taccount[i].fields.AccountNumber || '-',
                    data.taccount[i].fields.AccountName || '-',
                    data.taccount[i].fields.AccountTypeName || '-',
                    data.taccount[i].fields.TaxCode || '-',
                    '-' || '-',

                ];
                records.push(recordObj);
            }
            let allRecords = templateObject.records.get();
            allRecords.accountexpenselist = records;
            templateObject.records.set(allRecords);
            setTimeout(() => {
                let accountExpenseListTableData = $('.table-accountexpenselist').DataTable({
                    sDom: "Rlfrtip",
                    info: false,
                    colReorder: true,
                    colReorder: {
                        fixedColumnsLeft: 0
                    },
                    columnDefs: [
                        {orderable: false, targets: 0}
                    ],
                    "bStateSave": true,
                    "dom": '<"top"i>rt<"bottom"flp><"clear">',
                    "fnDrawCallback": function (oSettings) {
                        if (oSettings._iDisplayLength == -1
                            || 10 > oSettings.fnRecordsDisplay()) {
                            jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_info').hide();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length').hide();
                        } else {
                            jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_info').show();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length>label>select').addClass('page-record-count');
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length').show();
                        }
                    },
                }).on('page', function () {
                    let recordsCopy;
                    let recordsData = templateObject.records.get();
                    recordsCopy = recordsData.accountexpenselist;
                    recordsCopy.forEach((record) => {
                        record.selected = false;
                    });
                    templateObject.toBeDeleted = [];
                    recordsData.accountexpenselist = recordsCopy;
                    templateObject.records.set(recordsData);
                    templateObject.selectedObj.set(templateObject.toBeDeleted);
                    Session.set('selectedRecords', templateObject.selectedObj.get().length);
                    $('#head-check-accountexpenselist').prop('checked', false);
                    $('.checkbox-accountexpenselist').prop('checked', false);

                });


                let currentDataTable = templateObject.currentDataTable.get();
                currentDataTable.accountexpenselist = accountExpenseListTableData;
                templateObject.currentDataTable.set(currentDataTable);

            }, 0);
        });
    };


    templateObject.getAccountRevenueLists = function () {
        accountListService.getRevenueAccountList().then(function (data) {
            let records = [];

            for (let i = 0, len = data.taccount.length; i < len; i++) {
                let recordObj = {};

                recordObj.id = data.taccount[i].fields.ID;
                recordObj.selected = false;
                recordObj.currentPayment = true;
                recordObj.dataArr = [
                    data.taccount[i].fields.AccountNumber || '-',
                    data.taccount[i].fields.AccountName || '-',
                    data.taccount[i].fields.AccountTypeName || '-',
                    data.taccount[i].fields.TaxCode || '-',
                    '-' || '-',

                ];
                records.push(recordObj);
            }
            let allRecords = templateObject.records.get();
            allRecords.accountrevenuelist = records;
            templateObject.records.set(allRecords);
            setTimeout(() => {
                let accountRevenueListTableData = $('.table-accountrevenuelist').DataTable({
                    sDom: "Rlfrtip",
                    info: false,
                    colReorder: true,
                    colReorder: {
                        fixedColumnsLeft: 0
                    },
                    columnDefs: [
                        {orderable: false, targets: 0}
                    ],
                    "bStateSave": true,
                    "dom": '<"top"i>rt<"bottom"flp><"clear">',
                    "fnDrawCallback": function (oSettings) {
                        if (oSettings._iDisplayLength == -1
                            || 10 > oSettings.fnRecordsDisplay()) {
                            jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_info').hide();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length').hide();
                        } else {
                            jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_info').show();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length>label>select').addClass('page-record-count');
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length').show();
                        }
                    },
                }).on('page', function () {
                    let recordsCopy;
                    let recordsData = templateObject.records.get();
                    recordsCopy = recordsData.accountrevenuelist;
                    recordsCopy.forEach((record) => {
                        record.selected = false;
                    });
                    templateObject.toBeDeleted = [];
                    recordsData.accountrevenuelist = recordsCopy;
                    templateObject.records.set(recordsData);
                    templateObject.selectedObj.set(templateObject.toBeDeleted);
                    Session.set('selectedRecords', templateObject.selectedObj.get().length);
                    $('#head-check-accountrevenuelist').prop('checked', false);
                    $('.checkbox-accountrevenuelist').prop('checked', false);
                });

                let currentDataTable = templateObject.currentDataTable.get();
                currentDataTable.accountrevenuelist = accountRevenueListTableData;
                templateObject.currentDataTable.set(currentDataTable);

            }, 0);
        })
    };


    templateObject.getAccountArchiveLists = function () {
        accountListService.getArchiveAccountList().then(function (data) {
            let records = [];

            for (let i = 0, len = data.taccount.length; i < len; i++) {
                let recordObj = {};

                recordObj.id = data.taccount[i].fields.ID;
                recordObj.selected = false;
                recordObj.currentPayment = true;
                recordObj.dataArr = [
                    data.taccount[i].fields.AccountNumber || '-',
                    data.taccount[i].fields.AccountName || '-',
                    data.taccount[i].fields.AccountTypeName || '-',
                    data.taccount[i].fields.TaxCode || '-',
                    '-' || '-',

                ];
                records.push(recordObj);
            }
            let allRecords = templateObject.records.get();
            allRecords.accountarchivelist = records;
            templateObject.records.set(allRecords);
            setTimeout(() => {
                let accountArchiveListTableData = $('.table-accountarchivelist').DataTable({
                    sDom: "Rlfrtip",
                    info: false,
                    colReorder: true,
                    colReorder: {
                        fixedColumnsLeft: 0
                    },
                    columnDefs: [
                        {orderable: false, targets: 0}
                    ],
                    "bStateSave": true,
                    "dom": '<"top"i>rt<"bottom"flp><"clear">',
                    "fnDrawCallback": function (oSettings) {
                        if (oSettings._iDisplayLength == -1
                            || 10 > oSettings.fnRecordsDisplay()) {
                            jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_info').hide();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length').hide();
                        } else {
                            jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_info').show();
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length>label>select').addClass('page-record-count');
                            jQuery(oSettings.nTableWrapper).find('.dataTables_length').show();
                        }
                    },
                }).on('page', function () {
                    let recordsCopy;
                    let recordsData = templateObject.records.get();
                    recordsCopy = recordsData.accountarchivelist;
                    recordsCopy.forEach((record) => {
                        record.selected = false;
                    });
                    templateObject.toBeDeleted = [];
                    recordsData.accountarchivelist = recordsCopy;
                    templateObject.records.set(recordsData);
                    templateObject.selectedObj.set(templateObject.toBeDeleted);
                    Session.set('selectedRecords', templateObject.selectedObj.get().length);
                    $('#head-check-accountarchivelist').prop('checked', false);
                    $('.checkbox-accountarchivelist').prop('checked', false);

                });

                let currentDataTable = templateObject.currentDataTable.get();
                currentDataTable.accountarchivelist = accountArchiveListTableData;
                templateObject.currentDataTable.set(currentDataTable);
            }, 0);
        })
    };

    templateObject.getAccountLists();
    templateObject.getAccountAssetsLists();
    templateObject.getAccountLiabilityLists();
    templateObject.getAccountEquityLists();
    templateObject.getAccountArchiveLists();
    templateObject.getAccountExpenseLists();
    templateObject.getAccountRevenueLists();
});
