import {ReactiveVar} from 'meteor/reactive-var';
import {TaxRateService} from "../settings-service";
import {AccountService} from "../../accounts/account-service";
let accountService = new AccountService();
Template.fixedAssetEditAssetType.onCreated(()=>{
    const tempObj = Template.instance();
    tempObj.record = new ReactiveVar({});
    tempObj.successMsg = new ReactiveVar();
    tempObj.showTitle = new ReactiveVar();
});

Template.fixedAssetEditAssetType.onRendered(()=> {

    let settingsService = new TaxRateService();
    const templateObject = Template.instance();
    let currentReceiptId = FlowRouter.current().queryParams.id;
    if(currentReceiptId !== 'new') {
        templateObject.showTitle.set(true);
        currentReceiptId = Number(currentReceiptId);
        settingsService.getAssetType(currentReceiptId).then(function (data) {
            let DepreciationOptionValue;
            let temp = data.fields.DepreciationOption;
            if(temp === 1){
                DepreciationOptionValue = 'No Depreciation';
            }else if(temp === 2){
                DepreciationOptionValue = 'Straight Line Depreciation';
            }else if(temp === 3){
                DepreciationOptionValue = 'Declining Balance';
            }
            let record = {
                ID: data.fields.ID,
                AssetType: data.fields.AssetTypeName,
                AssetCode: data.fields.AssetTypeCode,
                AssetAccount: data.fields.Notes,
                DepreciationMethod: DepreciationOptionValue,
                EffectiveLife: data.fields.Life
               /* AssetCode: data.fields.AssetCode,
                PurchDate: data.fields.PurchDate ? moment(data.fields.PurchDate).format('DD MMM YYYY') : "",
                PurchCost: Currency + '' + data.fields.PurchCost.toLocaleString(undefined, {minimumFractionDigits: 2}) || '-',
                WarrantyExpiresDate: data.fields.WarrantyExpiresDate ? moment(data.fields.WarrantyExpiresDate).format('DD MMM YYYY') : "",
                Serial: data.fields.Serial,
                AssetType: data.fields.AssetType,
                Description: data.fields.Description,
                DepreciationStartDate: data.fields.DepreciationStartDate ? moment(data.fields.DepreciationStartDate).format('DD MMM YYYY') : "",
                ReplacementCost: data.fields.ReplacementCost,
                EstimatedValue: data.fields.EstimatedValue,
                DepreciationOption: data.fields.DepreciationOption,
                BusinessUsePercent: data.fields.BusinessUsePercent,
                Life: data.fields.Life*/
            };
            templateObject.record.set(record);
           jQuery("#fixedAssetEditAssetType").fadeOut("slow");
        });
    }
 /*   else {
        templateObject.AssetAction.set('Add New Asset');
        if(Session.get('createAssetUsingCopy')){
            let assetId = Session.get('assetIdToCopyData');
            generateNewAssetId.then(function(result){
                accountService.getOneAsset(assetId).then(function(data){
                    let DepreciationOptionValue;
                    let temp = data.fields.DepreciationOption;
                    if(temp === 1){
                        DepreciationOptionValue = 'No Depreciation';
                    }else if(temp === 2){
                        DepreciationOptionValue = 'Straight Line Depreciation';
                    }else if(temp === 3){
                        DepreciationOptionValue = 'Declining Balance';
                    }
                    record = {
                        AssetName: data.fields.AssetName || "",
                        AssetCode: generatedAssetId || 0,
                        PurchDate: moment().format('DD MMM YYYY') || "",
                        PurchCost: data.fields.PurchCost || 0,
                        WarrantyExpiresDate: moment(data.fields.WarrantyExpiresDate).format('DD MMM YYYY') || "",
                        Serial: data.fields.Serial || "",
                        AssetType: data.fields.AssetType || "",
                        SupplierName: data.fields.SupplierName || "",
                        Description: data.fields.Description || "",
                        DepreciationStartDate: moment().format('DD MMM YYYY') || "",
                        ReplacementCost: data.fields.ReplacementCost || 0,
                        EstimatedValue: data.fields.EstimatedValue || 0,
                        DepreciationOption: DepreciationOptionValue || 0,
                        BusinessUsePercent: data.fields.BusinessUsePercent || 0,
                        Life: data.fields.Life || 0,
                    };
                    setTimeout(function(){
                        templateObject.record.set(record);
                    },0)
                });
            },function(err){
                swal({ title: 'Oooops...', text: err, type: 'error', showCancelButton: false, confirmButtonText: 'Try Again' }).then((result) => { if (result.value) { Meteor._reload.reload(); } else if (result.dismiss === 'cancel') {}});
            });

        }else {
            record = {
                PurchDate: moment().format('DD MMM YYYY'),
                DepreciationStartDate: moment().format('DD MMM YYYY')
            };
            templateObject.record.set(record);
        }
        templateObject.showHistoryNotes.set(false);
        templateObject.getAllSupplier();
        templateObject.getAllAssetType();
    }*/

});

Template.fixedAssetEditAssetType.helpers({
    record: () => {
        return Template.instance().record.get();
    },
    showTitle: () => {
        return Template.instance().showTitle.get();
    }
});

Template.fixedAssetEditAssetType.events({
    'click #add-asset-type':function(){
        let tempObj = Template.instance();
        let DepreciationOptionValue;
        let temp = tempObj.$("#depreciation-method-input").val();
        if(temp === 'No Depreciation'){
            DepreciationOptionValue = 1;
        }else if(temp === 'Straight Line Depreciation'){
            DepreciationOptionValue = 2;
        }else if(temp === 'Declining Balance'){
            DepreciationOptionValue = 3;
        }
        let objDetails = {
                type: "TFixedAssetType",
            fields: {
                Active: true,
                AssetTypeName: tempObj.$("#sub-asset-type").val(),
                AssetTypeCode: tempObj.$("#asset-type-code").val(),
                Notes: tempObj.$("#asset-account").val(),
                DepreciationOption: DepreciationOptionValue,
                Life: parseFloat(tempObj.$("#effective-life").val())
            }
        };
        let currentReceiptId = FlowRouter.current().queryParams.id;
        if(currentReceiptId !== 'new'){
            objDetails.fields['id'] = currentReceiptId;
        }
        accountService.saveAssetType(objDetails).then(function (data){
            Session.set('success',true);
            Session.set('assetName',tempObj.$("#sub-asset-type").val());
            FlowRouter.go('/settings/fixedAssets/asset-type');

        }).catch(function (err) {
            swal({ title: 'Oooops...', text: err, type: 'error', showCancelButton: false, confirmButtonText: 'Try Again' }).then((result) => { if (result.value) { Meteor._reload.reload(); } else if (result.dismiss === 'cancel') {}});
        });
    },
    'click .assetAccount': function (event) {
        $("#asset-account").val(event.currentTarget.innerText);
    },
    'click .accumulatedDepreciation': function (event) {
        $("#accumulated-depreciation").val(event.currentTarget.innerText);
    },
    'click .depreciationExpense': function (event) {
        $("#depreciation-expense").val(event.currentTarget.innerText);
    },
    'click .bookDepreciation': function (event) {
        $("#depreciation-method-input").val(event.currentTarget.innerText);
    },

});
