import {ReactiveVar} from 'meteor/reactive-var';
import {TaxRateService} from "../settings-service";
import 'colresizable/colResizable-1.6.min';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';
let _ = require('lodash');
Template.fixedAssetsSettings.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.fixedAssetsList = new ReactiveVar([]);
    templateObject.fixedAssetsLength = new ReactiveVar();
    templateObject.successMsg = new ReactiveVar();
    templateObject.assetTypeName = new ReactiveVar();
    templateObject.loaderOnAccount = new ReactiveVar();
    templateObject.defaultData = new ReactiveVar();
});

Template.fixedAssetsSettings.onRendered(function () {
    let settingsService = new TaxRateService();
    const templateObject = Template.instance();
    let accountsList = [];
    let tab = FlowRouter.current().queryParams.tab;
    $('html').click(function () {
        $('.Fixed-notify').hide();
    })
    switch(tab){
        case 'asset-type':
            $('.nav-tabs a[href="#assetType"]').tab('show');
            break;
        case 'accounts':
            $('.nav-tabs a[href="#accounts"]').tab('show');
            break;
        case 'tax-reporting':
            $('.nav-tabs a[href="#taxReporting"]').tab('show');
            break;
        case 'pools':
            $('.nav-tabs a[href="#pools"]').tab('show');
            break;
    }

    addColResizable = function (id) {

        if(id === 'assetTypes') {
            $('#poolsTable').colResizable({disable : true});
        }else{
            $('#assetTypes').colResizable({disable: true});
        }

        setTimeout(function(){
            $('#'+id).colResizable({
                fixed: false,
                liveDrag: true,
                draggingClass: "dragging",
                resizeMode: 'overflow',
                onDrag: function (data) {
                    if(id === 'assetTypes'){
                        if ($("#"+id).width() > 938) {
                            $("#assetType #tableTopDiv").css("overflow", "auto");
                        } else {
                            $("#assetType #tableTopDiv").css("overflow", "hidden");
                        }
                    }else{
                        if ($("#"+id).width() > 938) {
                            $("#pools #tableTopDiv").css("overflow", "auto");
                        } else {
                            $("#pools #tableTopDiv").css("overflow", "hidden");
                        }
                    }

                }
            });
        }, 1000);
    };

    getDataTableData = function (id) {
        $('#'+id).DataTable({
            sDom: "Rlfrtip",
            paging: false,
            info: false
        });
        setTimeout(function() {
            addColResizable(id);
        },100);
    };

    templateObject.getAssetTypes = function () {
        settingsService.getAssetTypes().then(function (data) {
            jQuery("#fixedAssetsSettings").fadeOut("slow");
            let fixedAssetsData = data.tfixedassettype;
            templateObject.fixedAssetsList.set(fixedAssetsData);
            if(fixedAssetsData && fixedAssetsData.length > 0) {
                let successMsg = Session.get('success');
                let assetTypeName = Session.get('assetName');
                templateObject.fixedAssetsLength.set(fixedAssetsData.length);
            }
            setTimeout(() => {
                getDataTableData('assetTypes');
            }, 0);
        })
    };

    /*templateObject.getPools = function () {
        settingsService.getAssetTypes().then(function (data) {
            let fixedAssetsData = data.tfixedassets;
            templateObject.fixedAssetsList.set(fixedAssetsData);
            templateObject.fixedAssetsLength.set(fixedAssetsData.length);
            setTimeout(() => {
                getDataTableData('poolsTable');
            }, 0);
        })
    };*/

    templateObject.getAssetTypes();
  /*  templateObject.getPools();*/
    templateObject.getAllAccountTypes = function () {
        settingsService.getAccountOptions().then(function (data) {
            let temp = [];
            for (let i = 0; i < data.taccount.length; i++) {
                let dataObj = {};
                let label = data.taccount[i].AccountNumber ? data.taccount[i].AccountNumber + " - " + data.taccount[i].AccountName : data.taccount[i].AccountName;
                let setLabel = data.taccount[0].AccountNumber ? data.taccount[0].AccountNumber + " - " + data.taccount[0].AccountName : data.taccount[0].AccountName;
                templateObject.defaultData.set(setLabel);
                let category = data.taccount[i].AccountTypeName;
                let taxCode = data.taccount[i].TaxCode;
                dataObj.label = label;
                dataObj.category = category;
                dataObj.taxCode = taxCode;
                accountsList.push(dataObj);
                temp.push(dataObj);
            }
            temp = _.orderBy(temp, 'label');
            accountsList = _.orderBy(temp, 'category');

            setTimeout(function () {
                templateObject.getAccountDropDown();
            }, 1000);
        });
    };
    templateObject.getAllAccountTypes();

    templateObject.getAccountDropDown = function () {
        $.widget("custom.accdropdown", $.ui.autocomplete, {
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
        this.$(".select-account").accdropdown({
            delay: 0,
            source: accountsList,
            minLength: 0,
        }).focus(function () {
            $(this).accdropdown('search', "");
        });
    };
});

Template.fixedAssetsSettings.helpers({

    fixedAssetsList: () => {
        return Template.instance().fixedAssetsList.get();
    },
    fixedAssetsLength: () => {
        return Template.instance().fixedAssetsLength.get();
    },
    successMsg: () => {
        return Session.get('success');
    },
    assetTypeName: () => {
        return Session.get('assetName');
    },
    loaderOnAccount: () => {
        return Template.instance().loaderOnAccount.get();
    },
    defaultData:  () => {
        return Template.instance().defaultData.get();
    }
});

Template.fixedAssetsSettings.events({

    'click #close_help': function (event) {
        document.getElementById('help_open').style.display = 'none';
        document.getElementById('open_help').style.display = 'inline-block';

    },

    'click #open_help': function (event) {
        document.getElementById('help_open').style.display = 'block';
        document.getElementById('open_help').style.display = 'none';
    },

    'click ul.nav-tabs li a': function (event) {
        let templateObject = Template.instance();
        switch (event.currentTarget.hash) {
            case '#assetType' :
                templateObject.loaderOnAccount.set(false);
                FlowRouter.go('/settings/fixedAssets/asset-type');
                addColResizable('assetTypes');
                break;
            case '#accounts' :
                templateObject.loaderOnAccount.set(true);
                FlowRouter.go('/settings/fixedAssets/accounts');
                break;
            case '#taxReporting' :
                FlowRouter.go('/settings/fixedAssets/tax-reporting');
                break;
            case '#pools' :
                FlowRouter.go('/settings/fixedAssets/pools');
                addColResizable('poolsTable');
                break;
        }
        if(templateObject.loaderOnAccount.get() === true){
            setTimeout(function() { $("#fixedAssetsSettings").fadeOut() }, 1000);
        }
        setTimeout(function() {
            templateObject.loaderOnAccount.set(false);
        }, 1500);
    },

    'click .account-cancel-btn':function () {
        $('.nav-tabs a[href="#assetType"]').tab('show');
    },
    'click .account-img': function (event) {
        let templateObject = Template.instance();
        templateObject.$("#account-input-" + event.currentTarget.id.split('acc-dropdown-img-')[1]).trigger("focus");
    },
});
