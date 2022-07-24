import {ProductService} from "../product-service";
import {ReactiveVar} from 'meteor/reactive-var';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';
let _ = require('lodash');
import {UtilityService} from "../../utility-service";
import {AccountService} from "../../accounts/account-service";
import {SalesBoardService} from "../../js/sales-service";
import {Purchase} from "../../purchase/purchase-service";
let salesService = new SalesBoardService();
let purchaseService = new Purchase();
let utilityService = new UtilityService();
let taxCodesList = [];
let accountsList = [];
Template.productcard.onCreated(()=>{
    const templateObject = Template.instance();
    //templateObject.record = new ReactiveVar({});
    templateObject.isStatusMode = new ReactiveVar(false);
    templateObject.recentTrasactions = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();
    templateObject.itemUpdated = new ReactiveVar();
    templateObject.successNotificationData = new ReactiveVar({});
    templateObject.isTrackChecked  = new ReactiveVar();
    templateObject.productIdFromUrl  = new ReactiveVar();
    templateObject.isTrackChecked.set(false);
    templateObject.itemUpdated.set(false);
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.uploadedFile = new ReactiveVar();

});

Template.productcard.helpers({
  isStatusMode: () => {
    var template = Template.instance();
      return template.isStatusMode.get();
  },
  recentTrasactions: () => {
    return Template.instance().recentTrasactions.get();
  },
    uploadedFile: () => {
        return Template.instance().uploadedFile.get();
    },
  uploadedFiles: () => {
      return Template.instance().uploadedFiles.get();
  },
  attachmentCount: () => {
      return Template.instance().attachmentCount.get();
  },
  isTrackChecked: () => {
      let templateObj = Template.instance();
      return templateObj.isTrackChecked.get();
  },
  itemUpdated: () => {
      let templateObj = Template.instance();
      return templateObj.itemUpdated.get();
  },
  successNotificationData: () => {
      let templateObj = Template.instance();
      return templateObj.successNotificationData.get();
  }
});
Template.productcard.onRendered(function(){

    const templateObject = Template.instance();
    const recentTransList = [];
    let productId = parseInt(FlowRouter.current().queryParams.id);
    templateObject.productIdFromUrl.set(productId);
    let productService = new ProductService();
    let accountService = new AccountService();
    $('.fullScreenSpin').css('display','inline-block');
    getProductAtttachments = function() {
        productService.getProductAttachmentList(productId).then(function(data){
            let empName = localStorage.getItem('mySession');
            templateObject.attachmentCount.set(data.tattachment.length);
            templateObject.uploadedFiles.set(data.tattachment);
            if(data.tattachment.length){
                for(let i=0; i<data.tattachment.length; i++) {
                        let elementForItem = '<div class="uploaded-element pointer" id="attachment-'+ data.tattachment[i].Id +'"><div class="fileIocns"><i class="fa fa-file"></i></div> <div class="file-name"><span id="attachment-name-'+ data.tattachment[i].Id +'"> ' + data.tattachment[i].AttachmentName + '</span>'
                            + '<span class="uploaded-on">File uploaded by ' + empName + '</span></div><div class="remove-attachment"><i class="fa fa-times" id="remove-attachment-'+ data.tattachment[i].Id +'"></i></div> </div>';

                        if (!$('.uploaded-element').length) {
                            $('#file-display').html(elementForItem);
                        } else {
                            $('#file-display').append(elementForItem);
                        }
                }
            }
        });
    };

    templateObject.getAllProductRecentTransactions = function () {
        productService.getProductRecentTransactions(productId).then(function (data) {

           recentTransList = [];
            for(let i=0; i<data.tproductsalesdetailsreport.length; i++){
              //if(data.tproductsalesdetailsreport[i].ProductID === productId){
                let recentTranObject = {
                   date: moment(data.tproductsalesdetailsreport[i].SaleDate).format('DD MMM YYYY'),
                   type: data.tproductsalesdetailsreport[i].TransactionType,
                   reference: data.tproductsalesdetailsreport[i].TransactionNo,
                   quantity: data.tproductsalesdetailsreport[i].Qty,
                    unitPrice: utilityService.modifynegativeCurrencyFormat(data.tproductsalesdetailsreport[i]['Line Cost (Ex)']),
                    total: utilityService.modifynegativeCurrencyFormat(data.tproductsalesdetailsreport[i]['Total Amount (Ex)'])
                };
                  recentTransList.push(recentTranObject);
              //}
            }

            templateObject.recentTrasactions.set(recentTransList);
            $('.product_recent_trans').css('display','block');
            $('.fullScreenSpin').css('display','none');
        }).catch(function (err) {

            $('.fullScreenSpin').css('display','none');
            //Bert.alert('<strong>' + err + '</strong>!', 'deleting products failed');
        });

    };


    templateObject.getAllRecentTransactions = function () {
        productService.getRecentTransactions().then(function (data) {

            for(let i=0; i<data.tproductsalesdetailsreport.length; i++){
              if(data.tproductsalesdetailsreport[i].ProductID === productId){
                let recentTranObject = {
                   date: moment(data.tproductsalesdetailsreport[i].SaleDate).format('DD MMM YYYY'),
                   type: data.tproductsalesdetailsreport[i].TransactionType,
                   reference: data.tproductsalesdetailsreport[i].TransactionNo,
                   quantity: data.tproductsalesdetailsreport[i].Qty,
                    unitPrice: utilityService.modifynegativeCurrencyFormat(data.tproductsalesdetailsreport[i]['Line Cost (Ex)']),
                    total: utilityService.modifynegativeCurrencyFormat(data.tproductsalesdetailsreport[i]['Total Amount (Ex)'])
                };
                  recentTransList.push(recentTranObject);
              }
            }
            templateObject.recentTrasactions.set(recentTransList);
            $('.product_recent_trans').css('display','block');
            $('.fullScreenSpin').css('display','none');
        });
        // $('.fullScreenSpin').css('display','none');
        setTimeout(function () {
             $('.fullScreenSpin').css('display','none');
        }, 7000);
    };
    // templateObject.getAllRecentTransactions();
    // templateObject.getAllProductRecentTransactions();
    getAllTaxes = function () {
        accountService.getTaxCodesVS1().then(function (data) {
            for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                taxCodesList.push(data.ttaxcodevs1[i].CodeName)
            }
            $(".select-tax-type1").autocomplete({
                source: taxCodesList,
                minLength: 0
            }).focus(function () {
                $(this).autocomplete('search', "")
            });

            $(".select-tax-type2").autocomplete({
                source: taxCodesList,
                minLength: 0
            }).focus(function () {
                $(this).autocomplete('search', "")
            });

        });
    }

    getAllAccounts = function () {
        accountService.getAccountTypes().then(function (data) {
            let temp = [];
            for (let i = 0; i < data.taccount.length; i++) {
                let dataObj = {};
                let label = data.taccount[i].AccountNumber ? data.taccount[i].AccountNumber + " - " + data.taccount[i].AccountName : data.taccount[i].AccountName;
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
    }

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
            select: function (event, ui) {
                //templateObject.$("#UProdPAcc").val(ui.item.value);
                //templateObject.$("#UPTaxPR").val(ui.item.taxCode);
            }
        }).focus(function () {
            $(this).accdropdown('search', "");
        });
        this.$(".select-account1").accdropdown({
            delay: 0,
            source: accountsList,
            minLength: 0,
            select: function (event, ui) {
                templateObject.$("#UProdPAcc").val(ui.item.value);
                templateObject.$("#UPTaxPR").val(ui.item.taxCode);
            }
        }).focus(function () {
            $(this).accdropdown('search', "");
        });

        this.$(".select-account2").accdropdown({
            delay: 0,
            source: accountsList,
            minLength: 0,
            select: function (event, ui) {
                templateObject.$("#UProdSAcc").val(ui.item.value);
                templateObject.$("#UPTaxSR").val(ui.item.taxCode);
            }
        }).focus(function () {
            $(this).accdropdown('search', "");
        });
    };

    $('#productrecentlist tbody ').on('click', 'tr', function (event) {
        let TransactionNo;
        let TransactionType;
        let table = document.getElementById("productrecentlist");
        let rows = table.rows;
        for (let i = 1; i < rows.length; i++) {
            rows[i].onclick = (function() {
                 TransactionNo = (this.cells[2].innerHTML);
                 TransactionType = (this.cells[1].innerHTML);
                if(TransactionType === 'Invoice'){
                    salesService.getOneInvoicedata(TransactionNo).then(function (data) {
                            if (data.fields.SalesStatus == 'Draft' || data.fields.SalesStatus == '') {
                                window.open('/invoicecard?id=' + TransactionNo, '_self');
                            } else if (data.fields.SalesStatus == 'Awaiting Approval') {
                                window.open('/invoicecardawaitingapproval?id=' + TransactionNo, '_self');
                            }else if (data.fields.SalesStatus == 'Paid') {
                                window.open('/invoicepaidcard?id=' + TransactionNo, '_self');
                            } else if (data.fields.SalesStatus == 'Awaiting Payment') {
                                window.open('/invoicecardawaitingpayment?id=' + TransactionNo, '_self');
                            } else {
                                window.open('/invoicecard?id=' + TransactionNo, '_self');
                            }
                    });
                }
                else if(TransactionType === 'Bill'){
                    purchaseService.getOneBillData(TransactionNo).then(function (data) {
                        if (data.fields.SalesStatus == 'Approved' || data.fields.SalesStatus == 'Paid') {
                            window.open('/billview?id=' + TransactionNo, '_self');
                        }
                        else {
                            window.open('/billcard?id=' + TransactionNo, '_self');
                        }
                    });
                }
            });
        }
    });
    $(document).ready(function(){
    //document.getElementById("success_log").style.display = 'none';
    var erpGet = erpDb();
    let templateObjtrack = Template.instance();
    var url = FlowRouter.current().path;
    var getproduct_id = url.split('?id=');
    var product_id = getproduct_id[getproduct_id.length-1];


    var oReq = new XMLHttpRequest();
    oReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPProductCardMain + "&select=[ID]='" + product_id + "'", true);
    oReq.setRequestHeader("database",erpGet.ERPDatabase);
    oReq.setRequestHeader("username",erpGet.ERPUsername);
    oReq.setRequestHeader("password",erpGet.ERPPassword);
    oReq.send();

    oReq.timeout = 30000;
        oReq.onreadystatechange = function () {
            if (oReq.readyState == 4 && oReq.status == 200) {

                var dataListRet = JSON.parse(oReq.responseText)
                for (var event in dataListRet) {
                    var dataCopy = dataListRet[event];
                    for (var data in dataCopy) {
                        var mainData = dataCopy[data];
                        var productCardID = mainData.Id;
                        var uprodid = mainData.Id;
                        var uprodcode = mainData.PRODUCTCODE;
                        var uprodname = mainData.ProductPrintName;
                        var uprodAssAccount = mainData.AssetAccount;
                        //uprodsupp = mainData2.PreferedSupplierName;
                        var uprodpuprice = mainData.BuyQty1Cost;
                        var uprodpacc = mainData.CogsAccount;
                        var uprodptax = mainData.TaxCodePurchase;
                        var uprodpdesc = mainData.PurchaseDescription;
                        var uprodsuprice = mainData.SellQty1Price;
                        var uprodsacc = mainData.IncomeAccount;
                        var uprodstax = mainData.TaxCodeSales;
                        var uprodsdesc = mainData.SalesDescription;
                        let isActive = mainData.Active;

                        let itrackItem = mainData.LockExtraSell;
                        templateObjtrack.isStatusMode.set(isActive);
                        document.getElementById("productcardid").innerHTML = productCardID;

                        document.getElementById("productcardname").innerHTML = mainData.ProductPrintName;
                        if (isActive == true) {
                            document.getElementById("productcardbodyname").innerHTML = mainData.ProductPrintName;
                        } else {
                            document.getElementById("productcardbodyname").innerHTML = mainData.ProductPrintName + "<span class='inactive-title'> INACTIVE </span>";
                        }

                        if(itrackItem ==  true){
                          templateObjtrack.isTrackChecked.set(true);
                          // templateObj.$('input[name="ItrackThisItem"]').prop('checked', true);
                        }else{
                          templateObjtrack.isTrackChecked.set(false);
                          // templateObj.$('input[name="ItrackThisItem"]').prop('checked', false);
                        }

                        document.getElementById("productcardbodycode").innerHTML = mainData.PRODUCTCODE;
                        //document.getElementById("productbarcode").innerHTML = mainData.BARCODE;
                        //document.getElementById("productsupplier").innerHTML = mainData.PreferedSupplierName;

                        document.getElementById("prpunitprice").innerHTML = utilityService.modifynegativeCurrencyFormat(mainData.BuyQty1Cost);
                        document.getElementById("prpaccount").innerHTML = mainData.AssetAccount;
                        document.getElementById("prptax").innerHTML = mainData.TaxCodePurchase;
                        document.getElementById("prpdescription").innerHTML = mainData.PurchaseDescription;

                        document.getElementById("prsunitprice").innerHTML = utilityService.modifynegativeCurrencyFormat(mainData.SellQty1Price);
                        document.getElementById("prsaccount").innerHTML = mainData.IncomeAccount;
                        document.getElementById("prstax").innerHTML = mainData.TaxCodeSales;
                        document.getElementById("prsdescription").innerHTML = mainData.SalesDescription;
                        document.getElementById("productcomment").innerHTML = mainData.ProductComment;

                        $('input[name="UProdID"]').val(uprodid);
                        $('input[name="UProdCode"]').val(uprodcode);
                        $('input[name="UProdName"]').val(uprodname);
                        $('input[name="UinventoryAssetAccount"]').val(uprodAssAccount);
                        //$('select[name="UProdSupp"]').val(uprodsupp);
                        //$('select[name="UProdSupp"] option[value="'+uprodsupp+'"]').prop('selected', true);
                        $('input[name="UProdPUPrice"]').val(uprodpuprice.toFixed(2));
                        $('input[name="UProdPAcc"]').val(uprodpacc);
                        $('input[name="UPTaxPR"]').val(uprodptax);
                        $("#UProdPDesc").val(uprodpdesc);
                        $('input[name="UProdSUPrice"]').val(uprodsuprice.toFixed(2));
                        $('input[name="UProdSAcc"]').val(uprodsacc);
                        $('input[name="UPTaxSR"]').val(uprodstax);
                        $("#UProdSDesc").val(uprodsdesc);
                        $('input[name="notesid"]').val(uprodid);
                        $('.fullScreenSpin').css('display','none');
                    }
                }
            }
        }
$("#productupdate").click(function (e) {

  let itrackThisItem = false;
  if($('input[name="ItrackThisItem"]').is(":checked")){
    itrackThisItem = true;
    }else{
    itrackThisItem = false;
    }

            var objDetails = {
                type: "TProduct",
                fields:
                    {
                        Id: parseFloat($("#UProdID").val()),
                        PRODUCTCODE: $("#UProdCode").val(),
                        /*ProductName:$("#UProdName").val(),*/
                        ProductPrintName: $("#UProdName").val(),
                        PurchaseDescription: $("#UProdPDesc").val(),
                        SalesDescription: $("#UProdSDesc").val(),
                        AssetAccount:($("#UinventoryAssetAccount").val()).includes(" - ") ? ($("#UinventoryAssetAccount").val()).split(' - ')[1] : $("#UinventoryAssetAccount").val(),
                        CogsAccount:($("#UProdPAcc").val()).includes(" - ") ? ($("#UProdPAcc").val()).split(' - ')[1] : $("#UProdPAcc").val(),
                        IncomeAccount:($("#UProdSAcc").val()).includes(" - ") ? ($("#UProdSAcc").val()).split(' - ')[1] : $("#UProdSAcc").val(),
                        //AssetAccount: $("#UProdPAcc").val(),
                        TaxCodePurchase: $("#UPTaxPR").val(),
                        TaxCodeSales: $("#UPTaxSR").val(),
                        BuyQty1: 1,
                        BuyQty1Cost: parseFloat($("#UProdPUPrice").val()),
                        BuyQty2: 1,
                        BuyQty2Cost: parseFloat($("#UProdPUPrice").val()),
                        BuyQty3: 1,
                        BuyQty3Cost: parseFloat($("#UProdPUPrice").val()),
                        SellQty1: 1,
                        SellQty1Price: parseFloat($("#UProdSUPrice").val()),
                        SellQty2: 1,
                        SellQty2Price: parseFloat($("#UProdSUPrice").val()),
                        SellQty3: 1,
                        SellQty3Price: parseFloat($("#UProdSUPrice").val()),
                        LockExtraSell: itrackThisItem

                    }
            };
      var erpGet = erpDb();
      var oPost = new XMLHttpRequest();
      oPost.open("POST",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPCreateProduct, true);
      oPost.setRequestHeader("database",erpGet.ERPDatabase);
      oPost.setRequestHeader("username",erpGet.ERPUsername);
      oPost.setRequestHeader("password",erpGet.ERPPassword);
      oPost.setRequestHeader("Accept", "application/json");
      oPost.setRequestHeader("Accept", "application/html");
      oPost.setRequestHeader("Content-type", "application/json");

var myString = JSON.stringify(objDetails);
//var data = JSON.stringify({"email": "hey@mail.com", "password": "101010"});
oPost.send(myString);

oPost.timeout = 30000;
oPost.onreadystatechange = function() {


    if (oPost.readyState == 4 && oPost.status == 200) {
        templateObject.itemUpdated.set(true); // show successful edit notification
        // success notification body content
        let successNotificationData = {
            'itemCode': $("#UProdCode").val(),
            'itemName': $("#UProdName").val()
        }
        templateObject.successNotificationData.set(successNotificationData);
        // in title
        document.getElementById("productcardname").innerHTML = $("#UProdName").val();
        // after update setting product card value
        if(templateObject.isStatusMode.get() === true){
            document.getElementById("productcardbodyname").innerHTML = $("#UProdName").val();
        }else{
            document.getElementById("productcardbodyname").innerHTML = $("#UProdName").val() + "<span class='inactive-title'> INACTIVE </span>";

        }
        document.getElementById("productcardbodycode").innerHTML = $("#UProdCode").val();
        // product card page details after update
        document.getElementById("prpunitprice").innerHTML = $("#UProdPUPrice").val();
        document.getElementById("prpaccount").innerHTML = $("#UProdPAcc").val();
        document.getElementById("prptax").innerHTML = $("#UPTaxPR").val();
        document.getElementById("prpdescription").innerHTML = $("#UProdPDesc").val();
        document.getElementById("prsunitprice").innerHTML = $("#UProdSUPrice").val();
        document.getElementById("prsaccount").innerHTML = $("#UProdSAcc").val();
        document.getElementById("prstax").innerHTML = $("#UPTaxSR").val();
        document.getElementById("prsdescription").innerHTML = $("#UProdSDesc").val();
        $('.close').click(); // close edit modal
    }else if(oPost.readyState == 500) {
      swal({
    title: 'Oooops...',
    text: oPost.getResponseHeader('errormessage'),
    type: 'error',
    showCancelButton: false,
    confirmButtonText: 'Try Again'
    }).then((result) => {
    if (result.value) {
      Meteor._reload.reload();
    } else if (result.dismiss === 'cancel') {

    }
  });

} else if(oPost.readyState == 4 && oPost.status == 403){



swal({
  title: 'Oooops...',
  text: oPost.getResponseHeader('errormessage'),
  type: 'error',
  showCancelButton: false,
  confirmButtonText: 'Try Again'
  }).then((result) => {
  if (result.value) {
    Meteor._reload.reload();
  } else if (result.dismiss === 'cancel') {

  }
});
}else if(oPost.readyState == 4 && oPost.status == 406){
//oPost.setRequestHeader("Access-Control-Expose-Headers", "Content-Type");

  //oPost.setRequestHeader("Content-Length", "1");
  var ErrorResponse = oPost.getResponseHeader('errormessage');
  var segError = ErrorResponse.split(':');

if((segError[1]) == ' "Unable to lock object'){

  Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>. Please close the product in ERP!', 'danger');
}else{
  swal({
  title: 'Oooops...',
  text: oPost.getResponseHeader('errormessage'),
  type: 'error',
  showCancelButton: false,
  confirmButtonText: 'Try Again'
  }).then((result) => {
  if (result.value) {
    Meteor._reload.reload();
  } else if (result.dismiss === 'cancel') {

  }
});
}

//DangerSound();
}

AddUERP(oPost.responseText);
}

//Bert.alert('<strong>Success:</strong> Product successfully updated!', 'success');
e.preventDefault();
this.submit();
});


  $("#productcommentupd").click(function(e){

  if($("#productcomment").val() === '') {
      Bert.alert('<strong>'+ 'Notes box cannot be empty' +'</strong>!', 'danger');
      e.preventDefault();
      return false ;
  }

  var objDetails = {
  type:"TProduct",
  fields:
  {
  Id:parseFloat($("#notesid").val()),
  ProductComment:$("#productcomment").val(),}
  };


  var erpGet = erpDb();
  var oPost = new XMLHttpRequest();

  oPost.open("POST",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPUpdateProduct, true);
  oPost.setRequestHeader("database",erpGet.ERPDatabase);
  oPost.setRequestHeader("username",erpGet.ERPUsername);
  oPost.setRequestHeader("password",erpGet.ERPPassword);
  oPost.setRequestHeader("Accept", "application/json");
  oPost.setRequestHeader("Accept", "application/html");
  oPost.setRequestHeader("Content-type", "application/json");

var myString = JSON.stringify(objDetails);
//var data = JSON.stringify({"email": "hey@mail.com", "password": "101010"});
oPost.send(myString);

oPost.timeout = 30000;
oPost.onreadystatechange = function() {


if (oPost.readyState == 4 && oPost.status == 200) {

Bert.alert('<strong>SUCCESS:</strong> Product notes successfully updated!', 'success');

} else if(oPost.readyState == 4 && oPost.status == 403){



swal({
  title: 'Oooops...',
  text: oPost.getResponseHeader('errormessage'),
  type: 'error',
  showCancelButton: false,
  confirmButtonText: 'Try Again'
  }).then((result) => {
  if (result.value) {
    Meteor._reload.reload();
  } else if (result.dismiss === 'cancel') {

  }
});
}else if(oPost.readyState == 4 && oPost.status == 406){
//oPost.setRequestHeader("Access-Control-Expose-Headers", "Content-Type");

  //oPost.setRequestHeader("Content-Length", "1");
  var ErrorResponse = oPost.getResponseHeader('errormessage');
  var segError = ErrorResponse.split(':');

if((segError[1]) == ' "Unable to lock object'){

  Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>. Please close the product in ERP!', 'danger');
}else{
  swal({
  title: 'Oooops...',
  text: oPost.getResponseHeader('errormessage'),
  type: 'error',
  showCancelButton: false,
  confirmButtonText: 'Try Again'
  }).then((result) => {
  if (result.value) {
    Meteor._reload.reload();
  } else if (result.dismiss === 'cancel') {

  }
});
}

//DangerSound();
}

AddUERP(oPost.responseText);
}

//Bert.alert('<strong>Success:</strong> Product notes successfully updated!', 'success');
e.preventDefault();
this.submit();

});

  });
});

Template.productcard.events({
  'click #btn_Attachment':function(){
      let tempObj = Template.instance();
      $("#new-attachment2-tooltip").show();
        getProductAtttachments();
  },
  'click':function(event){
       if(event.target.id !== 'btn_Attachment'){
           $("#new-attachment2-tooltip").hide();
       }
  },
  'click .active_page_content':function(){
      $("#new-attachment2-tooltip").hide();
  },
    'click .productStatusUpdate': function () {
        let clickedElementId = $('.productStatusUpdate').attr('id');
        let templateObject = Template.instance();
        let productIdFromUrl = templateObject.productIdFromUrl.get();
        let productStatus;
        if (clickedElementId === 'productInActiveUpdate') {
            productStatus = false;
        } else {
            productStatus = true;
        }

        var objDetails = {
            type: "TProduct",
            fields:
                {
                    Id: productIdFromUrl,
                    Active: productStatus
                }
        };

        var erpGet = erpDb();
        var oPost = new XMLHttpRequest();
        oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPUpdateProduct, true);
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
                let dataReturn = JSON.parse(oPost.responseText);
                let productID = dataReturn.fields.ID;
                if (productID) {
                    templateObject.itemUpdated.set(true); // show successful status update notification
                    // success notification body content
                    let successNotificationData = {
                        'itemCode': $("#UProdCode").val(),
                        'itemName': $("#UProdName").val()
                    }

                    if (clickedElementId === 'productInActiveUpdate') {
                        templateObject.isStatusMode.set(false);
                        document.getElementById("productcardbodyname").innerHTML = $("#productcardname").text() + "<span class='inactive-title'> INACTIVE </span>";
                    }else{
                        templateObject.isStatusMode.set(true);
                        document.getElementById("productcardbodyname").innerHTML = $("#productcardname").text();
                    }

                    templateObject.successNotificationData.set(successNotificationData);
                }
            } else if (oPost.readyState == 4 && oPost.status == 403) {
                Bert.alert('<strong>' + oPost.getResponseHeader('errormessage') + '!</strong>', 'danger');
            } else if (oPost.readyState == 4 && oPost.status == 406) {
                var ErrorResponse = oPost.getResponseHeader('errormessage');
                var segError = ErrorResponse.split(':');
                if ((segError[1]) == ' "Unable to lock object') {
                    Bert.alert('<strong>' + oPost.getResponseHeader('errormessage') + '</strong>. Please close the product in ERP!', 'danger');
                } else {
                    swal({
  title: 'Oooops...',
  text: oPost.getResponseHeader('errormessage'),
  type: 'error',
  showCancelButton: false,
  confirmButtonText: 'Try Again'
  }).then((result) => {
  if (result.value) {
    Meteor._reload.reload();
  } else if (result.dismiss === 'cancel') {

  }
});
                }
            }
        }
    },
    'click .deleteProduct': function () {
        let templateObject = Template.instance();
        let productIdFromUrl = templateObject.productIdFromUrl.get();
        var objDetails = {
            type: "TProduct",
            fields:
                {
                    Id: productIdFromUrl,
                    Active: false
                }
        };
        var erpGet = erpDb();
        var oPost = new XMLHttpRequest();

        oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPUpdateProduct, true);
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
                let dataReturn = JSON.parse(oPost.responseText);
                let productID = dataReturn.fields.ID;
                if (productID) {
                    window.open('/productexpresslist', '_self');
                }
            } else if (oPost.readyState == 4 && oPost.status == 403) {
                Bert.alert('<strong>' + oPost.getResponseHeader('errormessage') + '!</strong>', 'danger');
            } else if (oPost.readyState == 4 && oPost.status == 406) {
                var ErrorResponse = oPost.getResponseHeader('errormessage');
                var segError = ErrorResponse.split(':');
                if ((segError[1]) == ' "Unable to lock object') {
                    Bert.alert('<strong>' + oPost.getResponseHeader('errormessage') + '</strong>. Please close the product in ERP!', 'danger');
                } else {
                    swal({
                      title: 'Oooops...',
                      text: oPost.getResponseHeader('errormessage'),
                      type: 'error',
                      showCancelButton: false,
                      confirmButtonText: 'Try Again'
                      }).then((result) => {
                      if (result.value) {
                        Meteor._reload.reload();
                      } else if (result.dismiss === 'cancel') {

                      }
                    });
                }
            }
        }
    },
  'click #productcommentupd':function(){
    $('#search_box').hide();
  },
  'click .new_attachment_btn':function(event){
      $('#attachment-upload').trigger('click');
  },
  'change #attachment-upload': function (e) {
      let utilityService = new UtilityService();
      let productService = new ProductService();
      let templateObj = Template.instance();
      let empName = localStorage.getItem('mySession');
      let saveToTAttachment = true;
      let lineIDForAttachment = false;
      let productId = parseInt(FlowRouter.current().queryParams.id);
      let attachmentCount = templateObj.attachmentCount.get();
      let uploadedFilesArray = [];
      let myFiles = $('#attachment-upload')[0].files;
      let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
      let objDetails = uploadData.uploadedFilesArray;
      setTimeout(function(){
          let uploadedFiles = templateObj.uploadedFiles.get();
          for(let i=0; i<objDetails.length; i++){
              objDetails[i].fields.TableId = productId;
              objDetails[i].fields.TableName = "tblParts";
              productService.saveAttachment(objDetails).then(function(data){
                  if(data){
                      let elementForItem = '<div class="uploaded-element pointer" id="attachment-'+ data.fields.ID +'"><div class=" fileIocns"><i class="fa fa-file"></i></div> <div class="file-name"><span id="attachment-name-'+ data.fields.ID +'"> '+ objDetails[i].fields.AttachmentName + '</span>'
                          +'<span class="uploaded-on">File uploaded now by ' + empName + ' </span></div><div class="remove-attachment"><i class="fa fa-times" id="remove-attachment-'+ data.fields.ID +'"></i></div> </div>';

                      if(!$('.uploaded-element').length){
                          $('#file-display').html(elementForItem);
                      } else {
                          $('#file-display').append(elementForItem);
                      }
                      attachmentCount++;
                      templateObj.attachmentCount.set(attachmentCount);
                      uploadedFiles.push({Id:data.fields.ID,AttachmentName:objDetails[i].fields.AttachmentName,Attachment:objDetails[i].fields.Attachment,Description:objDetails[i].fields.Description});
                      templateObj.uploadedFiles.set(uploadedFiles);
                  }
              });
          }
          templateObj.$('#new-attachment2-tooltip').show();
      },500);
  },
    'click .file-name': function(event){
        let attachmentID = event.currentTarget.firstChild.id.split('attachment-name-')[1];
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFiles.get();
        let previewFile = {};
        uploadedFiles.forEach(function(value,index) {
            if(value.Id === parseInt(attachmentID)) {
                previewFile.link = 'data:'+value.Description+';base64,'+value.Attachment;
                previewFile.name = value.AttachmentName;
               // previewFile.class = 'pdf'
                if(value.Description ==='application/pdf'){
                    previewFile.class = 'pdf-class';
                }else if(value.Description == 'application/msword' || value.Description ==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
                    previewFile.class = 'docx-class';
                }
                else if(value.Description == 'application/vnd.ms-excel' || value.Description ==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    previewFile.class = 'excel-class';
                }
                else if(value.Description == 'application/vnd.ms-powerpoint' || value.Description ==='application/vnd.openxmlformats-officedocument.presentationml.presentation'){
                    previewFile.class = 'ppt-class';
                }
                else if(value.Description == 'application/vnd.oasis.opendocument.formula' || value.Description ==='text/csv' || value.Description ==='text/plain' || value.Description ==='text/rtf'){
                    previewFile.class = 'txt-class';
                }
                else if(value.Description == 'application/zip' || value.Description ==='application/rar' || value.Description ==='application/x-zip-compressed' || value.Description ==='application/x-zip,application/x-7z-compressed'){
                    previewFile.class = 'zip-class';
                }
                else {
                    previewFile.class = 'default-class';
                }
                let type = value.Description;
                if(type.split('/')[0]==='image'){
                    previewFile.image = true
                }else {
                    previewFile.image = false
                }
                templateObj.uploadedFile.set(previewFile);
                $('#files_view').modal('show');
                return;
            }
        });
    },
  'click .uploaded-element': function (event) {
        let templateObj = Template.instance();
      if (templateObj.$('input[name="ItrackThisItem"]').is(":checked")) {
            templateObj.isTrackChecked.set(true);
            templateObj.$('input[name="purchaseThisItem"]').prop('checked', true);
            templateObj.$('input[name="SellThisItem"]').prop('checked', true);
            $('.purchaseAcconutContent').show();
            $('.saleAccountContent').show();
            $('#trackItemContent').show();
        } else {
            $('#trackItemContent').hide();
            templateObj.isTrackChecked.set(false);
        }
  },
    'click input[name="ItrackThisItem"]': function (event, template) {
        let templateObj = Template.instance();
        if (template.$('input[name="ItrackThisItem"]').is(":checked")) {
            templateObj.isTrackChecked.set(true);
            templateObj.$('input[name="purchaseThisItem"]').prop('checked', true);
            templateObj.$('input[name="SellThisItem"]').prop('checked', true);
            $('.purchaseAcconutContent').show();
            $('.saleAccountContent').show();
            $('#trackItemContent').show();
        } else {
            $('#trackItemContent').hide();
            templateObj.isTrackChecked.set(false);
        }
    },
  'click input[name="purchaseThisItem"]': function (event, template) {
       let templateObj = Template.instance();
       let isTrackChecked = templateObj.isTrackChecked.get();
       if (isTrackChecked) {
           event.preventDefault();
           return false;
       } else {
           if (template.$('input[name="purchaseThisItem"]').is(":checked")) {
               $('.purchaseAcconutContent').show();
           } else {
               $('.purchaseAcconutContent').hide();
           }
       }
  },
  'click input[name="SellThisItem"]': function (event, template) {
      let templateObj = Template.instance();
      let isTrackChecked = templateObj.isTrackChecked.get();
      if (isTrackChecked) {
          event.preventDefault();
          return false;
      } else {
          if (template.$('input[name="SellThisItem"]').is(":checked")) {
              $('.saleAccountContent').show();
          } else {
              $('.saleAccountContent').hide();
          }
      }
  },
  'click #asset-type-dropdown-img-0': function (event) {
     let templateObject = Template.instance();
     templateObject.$("#UinventoryAssetAccount").trigger("focus");
  },
  'click #asset-type-dropdown-img-1': function (event) {
     let templateObject = Template.instance();
     templateObject.$("#UProdPAcc").trigger("focus");
  },
  'click #asset-type-dropdown-img-2': function (event) {
     let templateObject = Template.instance();
     templateObject.$("#UProdSAcc").trigger("focus");
  },
  'click #tax-type-dropdown-img1': function (event) {
    let templateObject = Template.instance();
    templateObject.$(".select-tax-type1").trigger("focus");
  },
  'click #tax-type-dropdown-img2': function (event) {
     let templateObject = Template.instance();
     templateObject.$(".select-tax-type2").trigger("focus");
  },
    'click #close-notification': function (event) {
        let templateObject = Template.instance();
        templateObject.$("#receipt-saved-message").hide();
        templateObject.itemUpdated.set(false);

    },
    'click .remove-attachment': function (event,ui) {
        let tempObj = Template.instance();
        let attachmentID = event.target.id.split('remove-attachment-')[1];
          let uploadedArray = tempObj.uploadedFiles.get();
        if(tempObj.$("#confirm-action-"+attachmentID).length){
            tempObj.$("#confirm-action-"+attachmentID).remove();
        }else{
            let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID +'"><button class="confirm-delete-attachment btn btn-default" id="delete-attachment-'+ attachmentID +'">'
                + 'Delete</button><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-'+attachmentID).append(actionElement);
        }


    },
    'click .confirm-delete-attachment': function (event,ui) {
        let tempObj = Template.instance();
        tempObj.$(".attchment-tooltip").show();
        let productService = new ProductService();
        let attachmentID = parseInt(event.target.id.split('delete-attachment-')[1]);
        let productId = parseInt(FlowRouter.current().queryParams.id);
        let attachmentCount = tempObj.attachmentCount.get();
        let  uploadedArray = tempObj.uploadedFiles.get();
        let attachmentObject = {
            type: "TAttachment",
            fields:
                {
                    Active: false,
                    Description: "",
                    ID: attachmentID,
                    TableId: productId,
                    TableName: "tblParts"
                }
        };
        productService.saveAttachment(attachmentObject).then(function (data) {
            tempObj.$("#attachment-" + attachmentID).remove();
             uploadedArray.forEach(function(value,index){
                if(value.Id === attachmentID){
                    uploadedArray.splice(index,1);
                }
             });
            tempObj.uploadedFiles.set(uploadedArray);
            attachmentCount --;
            if(attachmentCount === 0) {
                let elementToAdd = '<div class="file-display_img"><div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload your files to store them alongside all of your financial documents </div> <p style="color: #ababab;">Added files will only be visible to users with accessto your company</p></div></div>';
                $('#file-display').html(elementToAdd);
            }
            tempObj.attachmentCount.set(attachmentCount);
        });
    },
    'click .attchment-tooltip':function(event,ui){
        let tempObj = Template.instance();
        tempObj.$(".attchment-tooltip").show();
    },
    'click #btn_edit_item': async function(event,ui){
        if(!taxCodesList.length){
            await getAllTaxes();
        }
        if(!accountsList.length){
            await getAllAccounts();
        }

    },
    'click #loadrecenttransaction': function(event){
       $('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
         // templateObject.getAllRecentTransactions();
         // templateObject.recentTrasactions.set('');
         templateObject.getAllProductRecentTransactions();
    }
});
