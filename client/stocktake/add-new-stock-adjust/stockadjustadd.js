import {SalesBoardService} from '../../js/sales-service';
import {StockAdjust} from "../stockadjust-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';
import '../../lib/global/erp-objects';
import {UtilityService} from "../../utility-service";
const _ = require('lodash');
let salesService = new SalesBoardService();

Template.stockscan.onCreated(()=> {
//array.sort(SortByName);
    const templateObject = Template.instance();
    //templateObject.record = new ReactiveVar({});
    templateObject.AccountName = new ReactiveVar();
    templateObject.EmployeeName = new ReactiveVar();
    templateObject.Department = new ReactiveVar();
    templateObject.Date = new ReactiveVar();
    templateObject.StocAdjustNo = new ReactiveVar();
    templateObject.StocAdjustNo.set('');
    templateObject.stockAdjustrecord = new ReactiveVar({});

    templateObject.records = new ReactiveVar();
    templateObject.deptrecords = new ReactiveVar();
    templateObject.Accounts = new ReactiveVar([]);
    templateObject.defaultDepartment = new ReactiveVar([]);
    templateObject.currentRowID = new ReactiveVar();
    //templateObject.recordForPreview = new ReactiveVar({});
    templateObject.address = new ReactiveVar();
    templateObject.abn = new ReactiveVar();
    templateObject.referenceNumber = new ReactiveVar();
    templateObject.viewProdImage = new ReactiveVar();
    templateObject.recordLineForPreview = new ReactiveVar({});
});

Template.stockscan.onRendered(()=>{
const templateObject = Template.instance();
    let stockAdjustService = new StockAdjust();
    const records =[];
const deptrecords = [];
let salesService = new SalesBoardService();
let clientsService = new SalesBoardService();
let productsService = new SalesBoardService();
let accountService = new SalesBoardService();
const clientList = [];
const productsList = [];
let accountsList = [];
let productList = [];
const taxCodesList = [];
const employeeList = [];
let produomArray = [];
let uomList = "";
let departmentList = [];
let DataList=[];
let currentStockAdjustId = '';

function getUrlParam(name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return (results && results[1]) || undefined;
}
var id = getUrlParam('id');
if (id > "") {
  currentStockAdjustId = id;

    // do something with the id
} else {
  currentStockAdjustId = 'newstockadjust';
    // there is no id value
}

stockAdjustService.getCompanyInfo().then(function(data){
   let address = data.tcompanyinfo[0].PoBox3+''+data.tcompanyinfo[0].PoBox+' '+data.tcompanyinfo[0].PoCity+' '+data.tcompanyinfo[0].PoCountry+' '+data.tcompanyinfo[0].PoState+' '+data.tcompanyinfo[0].PoPostcode;
    templateObject.address.set(address);
    templateObject.abn.set(data.tcompanyinfo[0].abn);
});

//currentStockAdjustId = 'newstockadjust';
if(currentStockAdjustId !== 'newstockadjust') {
  Session.set('updateStock', true);
    templateObject.getStockAdjusts = function () {
      accountService.getOneStockAdjust(parseInt(currentStockAdjustId)).then(function (data) {
        let lineItems = [];
        let lineItemObj = {};
        let processed = data.fields.Processed;
        if(processed){
          $("#stockadjustcreate :input").attr("disabled", true);
          $("#stockadjustcreate :button").attr("disabled", true);
          //$("#stockadjustcreate :button").attr("disabled", true);

          //$("#new_create_btn :a").attr("disabled", true);
          document.getElementById("processed").innerHTML = "Processed";
          //Session.set('proccesedStock', true);
        }else{

        }

        if (data.fields.Lines) {
        if (data.fields.Lines.length) {
            for (let i = 0; i < data.fields.Lines.length; i++) {

                lineItemObj = {
                    id: data.fields.Lines[i].fields.ID || '',
                    item: data.fields.Lines[i].fields.ProductName || '',
                    productID: data.fields.Lines[i].fields.ProductID || '',
                    description: data.fields.Lines[i].fields.Description || '',
                    department: data.fields.Lines[i].fields.DeptName || '',
                    uom: data.fields.Lines[i].fields.UnitOfMeasure || '',
                    instock: data.fields.Lines[i].fields.InStockUOMQty || 0,
                    available: data.fields.Lines[i].fields.AvailableUOMQty || 0,
                    final: data.fields.Lines[i].fields.FinalUOMQty || 0,
                    adjust: data.fields.Lines[i].fields.AdjustQty || 0,
                };

                let tempLineID = data.fields.Lines[i].fields.ID;
                lineItems.push(lineItemObj);

            }

        } else {
            //let AmountGbp = data.fields.Lines.fields.AmountInc.toFixed(2);
            lineItemObj = {
                id: data.fields.Lines.fields.ID || '',
                item: data.fields.Lines.fields.ProductName || '',
                productID: data.fields.Lines.fields.ProductID || '',
                description: data.fields.Lines.fields.Description || '',
                department: data.fields.Lines.fields.DeptName || '',
                uom: data.fields.Lines.fields.UnitOfMeasure || '',
                instock: data.fields.Lines.fields.InStockUOMQty || 0,
                available: data.fields.Lines.fields.AvailableUOMQty || 0,
                final: data.fields.Lines.fields.FinalUOMQty || 0,
                adjust: data.fields.Lines.fields.AdjustQty || 0

            };
            lineItems.push(lineItemObj);
        }
      }else{
        lineItemObj = {
            //id: data.fields.Lines.fields.ID || '',
            item: '',
            productID:'',
            id:'',
            description: '',
            department: '',
            uom: '',
            instock: '',
            available: '',
            final: '',
            adjust: ''

        };
        lineItems.push(lineItemObj);
      }
        let stockAdjustrecord = {
            id:data.fields.ID,
            stockadjustStatus: 'Stock Take: '+ data.fields.ID,
            createhead: 'Update',
            stockadjustId:data.fields.Id || '',
            EmployeeName: data.fields.Employee || localStorage.getItem('mySession'),
            AccountName: data.fields.AccountName ||'',
            AdjustmentDate: data.fields.AdjustmentDate ? moment(data.fields.AdjustmentDate).format('DD MMM YYYY') : "",
            Notes:data.fields.Notes || '',
            //Total: '0.00',
            LineItems: lineItems
        };

        templateObject.stockAdjustrecord.set(stockAdjustrecord);
        });
    }
templateObject.getStockAdjusts();
}else{
  Session.set('updateStock', false);
  var today = moment().format('DD MMM YYYY');
  let stockAdjustrecord = {
      id:'',
      stockadjustStatus: 'New Stock Take',
      stockadjustId: '',
      createhead: 'Create',
      EmployeeName: localStorage.getItem('mySession'),
      AccountName:'',
      AdjustmentDate:today ||'',
      Notes:'',
    //DateTime: data.fields.DateTime ? moment(data.fields.DateTime).format('DD MMM YYYY') : "",
      //Total: '0.00',
      LineItems: [{
          item: '',
          productID:'',
          id:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''

      }]
  };
  templateObject.stockAdjustrecord.set(stockAdjustrecord);
  setTimeout(function(){
      templateObject.getUOMDropDown();
  },0);

  setTimeout(function(){
      templateObject.getDeptDropDown();
  },0);
}

templateObject.getAllEmployees = function () {
    stockAdjustService.getEmployees().then(function (data) {
        for (let i = 0; i < data.temployee.length; i++) {
            let employeeName = (data.temployee[i].KeyValue.replace(/","/g, " "));
            employeeName = employeeName.replace(/"/g, "");
            employeeList.push(employeeName);
        }
    });
};

templateObject.getEmployeeDropDown = function () {
    $(".select-employee").autocomplete({
        source: employeeList,
        minLength: 0,
        select: function (event) {
        },
    }).focus(function () {
        $(this).autocomplete('search', "")
    });
};

templateObject.getAllAccountTypes = function () {
    accountService.getAccountTypes().then(function (data) {
        let temp = [];
        for (let i = 0; i < data.taccount.length; i++) {
            let dataObj = {};
            let label = data.taccount[i].AccountName;
            let category = data.taccount[i].AccountTypeName;
            let taxCode = data.taccount[i].TaxCode;
            let accountNumber = data.taccount[i].AccountNumber ? data.taccount[i].AccountNumber : "";
            dataObj.label = label;
            dataObj.category = category;
            dataObj.taxCode = taxCode;
            dataObj.accountNumber = accountNumber;
            accountsList.push(dataObj);
            temp.push(dataObj);
        }
        temp = _.orderBy(temp, 'label');
        accountsList = _.orderBy(temp, 'category');

        setTimeout(function () {
            templateObject.getAccountDropDown();
        },1000);
    });
};
templateObject.accountTypeListToAddNew = function () {
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
            templateObject.addAccountDropDown();
        },1000);
    });
};

templateObject.addAccountDropDown = function () {
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
    this.$("#add-account-input").newaccdropdown({
        delay: 0,
        source: addNewAccountsList,
        minLength: 0,
        select: function(event,ui){
         templateObject.newAccountType.set(ui.item.category);
        }
    }).focus(function () {
        $(this).newaccdropdown('search', "");
    });
    $("#add-account-input").newaccdropdown( "widget" ).addClass( "select-acc-type" );
};

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

        }
    }).focus(function () {
        $(this).accdropdown('search', "");
    });
};

templateObject.getAllProductTypes = function () {
    accountService.getItemTypes().then(function (data) {
        for (let i = 0; i < data.tproduct.length; i++) {
            let dataObj = {};
            let label = data.tproduct[i].ProductName;
            let description = data.tproduct[i].SalesDescription;
            let productID = data.tproduct[i].Id;
            let prodName = data.tproduct[i].ProductName;
            let cboUOM = data.tproduct[i].UOMSales;

            dataObj.label = label;
            dataObj.productID = productID;
            dataObj.description = description;
            dataObj.prodName = prodName;
            dataObj.cboUOM = cboUOM;
            productList.push(dataObj);
        }
        templateObject.getProductDropDown();
    });
};


templateObject.getProductDropDown = function () {
    $.widget("custom.accdropdown", $.ui.autocomplete, {
        _create: function () {
            this._super();
            this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
        },
        _renderMenu: function (ul, items) {
            let that = this,
                currentCategory = "";
            /*ul.append("<li class='add_new_popup newItem' data-toggle='modal' data-target='#newProduct'>" + "+ New Item" + "</li>");*/
            $.each(items, function (index, item) {
                let li;

                li = that._renderItemData(ul, item);
                if (item.category) {
                    li.attr("aria-label", item.category);
                }
            });
        }
    });
    this.$(".select-product").accdropdown({
        delay: 0,
        source: function (request, response) {
            var top_suggestions = $.map(productList, function (json) {
                if (json.label.toUpperCase().indexOf(request.term.toUpperCase()) === 0) {
                    return json;
                }
            });
            var final_results = _.uniq(top_suggestions, "label");
            response(top_suggestions.sort(function (a, b) {
                if (a.label == 'NA') {
                    return 1;
                }
                else if (b.label == 'NA') {
                    return -1;
                }
                return (a.label.toUpperCase() > b.label.toUpperCase()) ? 1 : -1;
            }));
        },
        minLength: 0,
        select: function (event, ui) {
            let id = this.id.split('product-input-')[1];
            if(ui.item === undefined){
                $(".item-dropdown").css("display","none");
                templateObject.currentRowID.set(id);
            }
            else {

              $("#productdesc-" + id).html(ui.item.description);
                $("#productID-" + id).html(ui.item.productID);
                $("#uom-input-" + id).html(ui.item.cboUOM);
                $("#department-input-" + id).html(defaultDept);

                templateObject.getProductQty(id,ui.item.prodName,defaultDept);
                templateObject.PopulateUOMComboForProduct(ui.item.prodName, ui.item.cboUOM);
                templateObject.getAllDeptTypes();


            }
        }
    }).focus(function () {
        $(this).accdropdown('search', "");
        $(this).attr('autocomplete', 'nope');
    });
    $(".select-product").accdropdown( "widget" ).addClass( "item-dropdown" );
};

templateObject.getProductQty = function (id, productname, deptName) {
  let totalAvailQty = 0;
  let totalInStockQty = 0;
    accountService.getProductClassQuantitys().then(function (data) {
        for (let i = 0; i < data.tproductclassquantity.length; i++) {
            let dataObj = {};

            let prodQtyName = data.tproductclassquantity[i].ProductName;
            let deptQtyName = data.tproductclassquantity[i].DepartmentName;
            if(productname == prodQtyName && deptQtyName == deptName){
              let availQty = data.tproductclassquantity[i].AvailableQty;
              let inStockQty = data.tproductclassquantity[i].InStockQty;

              totalAvailQty += parseFloat(availQty);
              totalInStockQty += parseFloat(inStockQty);
            }
        }

        $("#instock-" + id).html(totalInStockQty);
        $("#available-" + id).html(totalAvailQty);
        $("#finalQty-" + id).html(totalInStockQty);
        $("#adjust-" + id).html(1).trigger("blur");

    });

};

templateObject.loadProductImage = function (productName) {

  accountService.getProdImgByProds(productName).then(function (data) {
    if(data.tproductpicture.length === 0){
      Bert.alert('<strong>WARNING:</strong> This Product does not have Pictures in ERP "'+productName+'"', 'warning');
    }
    for (let i = 0; i < data.tproductpicture.length; i++) {
      let previewImage = {};
      let input =  data.tproductpicture[i].PicType;

      let prodAttachment = data.tproductpicture[i].MIMEEncodedPicture;
      previewImage.link = 'data:'+input+';base64,'+prodAttachment;
      previewImage.name = data.tproductpicture[i].ImageName;

      templateObject.viewProdImage.set(previewImage);
        $('#myPrevImgModal').modal('show');

    }

});
};

templateObject.PopulateUOMComboForProduct = function (productName, unit) {
    accountService.getUOMByProds().then(function (data) {
        for (let i = 0; i < data.tunitofmeasure.length; i++) {
            let dataObj = {};

            let prodName = data.tunitofmeasure[i].ProductName;

           if((productName == prodName)){
             let cboUOM = data.tunitofmeasure[i].UOMName;
             produomArray.push(cboUOM);
           }
           if(prodName == ""){
             let cboUOM = data.tunitofmeasure[i].UOMName;
             produomArray.push(cboUOM);

           }
        }
         uomList = [...new Set(produomArray)];
        templateObject.getUOMDropDown();
    });

};

templateObject.getUOMDropDown = function () {
    $.widget("custom.uomdropdown", $.ui.autocomplete, {
        _create: function () {
            this._super();
            this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
        },
        _renderMenu: function (ul, items) {
            let that = this,
                currentCategory = "";

            $.each(items, function (index, item) {
                let li;

                li = that._renderItemData(ul, item);
                if (item.category) {
                    li.attr("aria-label", item.category);
                }
            });
        }
    });
    this.$(".select-uom").uomdropdown({
        delay: 0,
        source: uomList,
        minLength: 0,
        select: function (event, ui) {
            let id = this.id.split('uom-input-')[1];
            if(ui.item === undefined){
                $(".uom-dropdown").css("display","none");
                templateObject.currentRowID.set(id);
            }
            else {

            }
        }
    }).focus(function () {
        $(this).uomdropdown('search', "");
        $(this).attr('autocomplete', 'nope');
    });
    $(".select-uom").accdropdown( "widget" ).addClass( "item-dropdown" );
};

//Load department
templateObject.getAllDeptTypes = function () {
  departmentList = [];
    accountService.getDepartment().then(function (data) {
        for (let i = 0; i < data.tdeptclass.length; i++) {
            let dataObj = {};

            let deptName = data.tdeptclass[i].DeptClassName;
            departmentList.push(deptName);

        }
        templateObject.getDeptDropDown();
    });

};

templateObject.getDeptDropDown = function () {
    $.widget("custom.deptdropdown", $.ui.autocomplete, {
        _create: function () {
            this._super();
            this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
        },
        _renderMenu: function (ul, items) {
            let that = this,
                currentCategory = "";

            $.each(items, function (index, item) {
                let li;

                li = that._renderItemData(ul, item);
                if (item.category) {
                    li.attr("aria-label", item.category);
                }
            });
        }
    });
    this.$(".select-department").deptdropdown({
        delay: 0,
        source: departmentList,
        minLength: 0,
        select: function (event, ui) {
            let id = this.id.split('department-input-')[1];
            if(ui.item === undefined){
                $(".department-dropdown").css("display","none");
                templateObject.currentRowID.set(id);
            }
            else {
              let deptName = ui.item.value;
              let productName = $("#product-input-" + id).html();
              templateObject.getProductQty(id,productName,deptName);


            }
        }
    }).focus(function () {
        $(this).deptdropdown('search', "");
        $(this).attr('autocomplete', 'nope');
    });
    $(".select-department").accdropdown( "widget" ).addClass( "item-dropdown" );
};


getProductByBarcode = function (barcode) {
  let scannedCode =  barcode;
  if(scannedCode != ''){
    var segs = scannedCode.split('-');

    if(segs.length >= 3){
      if(segs[0] == Barcode_Prefix_PQASN){
        accountService.validateProdSerialNumbers(scannedCode).then(function (data) {

          var valListRet = JSON.stringify(data);
          let valueObj = JSON.parse(valListRet);
          let returnedResult = valueObj.ValidateSN.Result;

          if(returnedResult == false){
             scannedSerial = "";
            Bert.alert('<strong>WARNING:</strong> '+valueObj.ValidateSN.Message+' or product is not on this order!', 'now-danger');

          }else{
            var scannedSerial = segs[1];
                if(scannedSerial != ""){
                  accountService.getProductDataByIds(scannedSerial).then(function (prodData) {
                      for (let i = 0; i < prodData.tproduct.length; i++) {
                        let productNameget = prodData.tproduct[i].ProductName;
                        let uomNameget = prodData.tproduct[i].UOMSales;
                        let newRecord = templateObject.stockAdjustrecord.get();
                    newRecord.LineItems.push({
                    item: prodData.tproduct[i].ProductName,
                    productID:prodData.tproduct[i].Id,
                    description: prodData.tproduct[i].SalesDescription,
                    department: defaultDept,
                    uom: prodData.tproduct[i].UOMSales,
                    instock: '',
                    available: '',
                    final: '',
                    adjust: ''
                    });
                    templateObject.stockAdjustrecord.set(newRecord);

                    let id = newRecord.LineItems.length -1;
                    if(id === undefined){
                        templateObject.currentRowID.set(id);
                    }
                    else {
                      templateObject.getProductQty(id,productNameget,defaultDept);
                    }

                      }
                    });
                }

          }
          });

      }else if(segs[0] == Barcode_Prefix_PQABATCH){

      }
    }else{
      accountService.getProductDataByBarcodes(barcode).then(function (data) {

            if(data.tproductbarcode.length === 0){
              Bert.alert('<strong>WARNING:</strong> Product Not Found for this Barcode "'+barcode+'"', 'now-dangerorange');
            }
          for (let i = 0; i < data.tproductbarcode.length; i++) {
              let dataObj = {};
              let prodName = data.tproductbarcode[i].Productname;
              if(prodName != ""){
                accountService.getProductDataByNames(prodName).then(function (prodData) {
                    for (let i = 0; i < prodData.tproduct.length; i++) {
                      let productNameget = prodData.tproduct[i].ProductName;
                      let uomNameget = prodData.tproduct[i].UOMSales;
                      let newRecord = templateObject.stockAdjustrecord.get();
                  newRecord.LineItems.push({
                  item: prodData.tproduct[i].ProductName,
                  productID:prodData.tproduct[i].Id,
                  description: prodData.tproduct[i].SalesDescription,
                  department: defaultDept,
                  uom: prodData.tproduct[i].UOMSales,
                  instock: '',
                  available: '',
                  final: '',
                  adjust: ''
                  });
                  templateObject.stockAdjustrecord.set(newRecord);

                  let id = newRecord.LineItems.length -1;
                  if(id === undefined){
                      templateObject.currentRowID.set(id);
                  }
                  else {
                    templateObject.getProductQty(id,productNameget,defaultDept);
                  }
                  /*
                  setTimeout(function () {
                       templateObject.getProductDropDown();
                   }, 2000);
                   */
                  /*
                  templateObject.getAllDeptTypes();

                   templateObject.PopulateUOMComboForProduct(productNameget, uomNameget);
                   setTimeout(function(){
                         templateObject.getUOMDropDown();
                     },0);
                     */
                    }
                  });
              }


          }

      });
    }


  }else{

  }

$('input[name="prodBarcode"]').val('');
};

templateObject.getAllEmployees();

setTimeout(function () {
    templateObject.getEmployeeDropDown();
}, 0);

templateObject.getAllAccountTypes();
templateObject.getAllProductTypes();
setTimeout(function () {
    templateObject.getProductDropDown();
}, 2000);
/*
setTimeout(function(){
    templateObject.getUOMDropDown();
},0);

setTimeout(function(){
    templateObject.getDeptDropDown();
},0);
*/

//templateObject.stockAdjustrecord.set(stockAdjustrecord);
//templateObject.defaultDepartment.set(defaultDept);


});
Template.stockscan.helpers({
    stockAdjustrecord : () => {
       return Template.instance().stockAdjustrecord.get();
    },
    previewImage: () => {
        return Template.instance().viewProdImage.get();
    },
    records: () => {
        return Template.instance().records.get();
    },
    defaultDepartment: () => {
        return Template.instance().defaultDepartment.get();

    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b){
          if (a.department == 'NA') {
        return 1;
            }
        else if (b.department == 'NA') {
          return -1;
        }
      return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
      });
    },
    accounts: () => {
      return Template.instance().Accounts.get();
    },
    loggedCurrency: () => {
      return CountryAbbr;
    },
    currentRowID: () => {
        return Template.instance().currentRowID.get();
    },
    companyname: () =>{
        return loggedCompany;
    },
    recordLineForPreview : () => {
        return Template.instance().recordLineForPreview.get();
    },
    address : () => {
        return Template.instance().address.get();
    },
    referenceNumber : () => {
        return Template.instance().referenceNumber.get();
    },
    abn : () => {
        return Template.instance().abn.get();
    },
    isShowSaveNotification: () => {
        return Session.get('isShowSaveNotification');
    },
    stockupdate: () => {
        return Session.get('updateStock');
    }
});

Template.stockscan.onRendered(function(){
    let accountService = new SalesBoardService();
    let templateObject = Template.instance();
  //  let latestPOId= templateObject.latestPOId.get();
    let notificationMessagerAfterSave;

  $(document).ready(function(){
  $("#date-input,#listdatepickerdue,#listdatepickerstart").datepicker({
      showOn: 'button',
      buttonText: 'Show Date',
      buttonImageOnly: true,
      buttonImage: '/img/dropdown_icon.png',
      dateFormat: 'dd M yy',
      showOtherMonths: true,
      selectOtherMonths: true,
      changeMonth: true,
      changeYear: true,
      yearRange: "-90:+10",
  });
var today = moment().format('DD MMM YYYY');
$('input[name="listdatepickerstart"]').val(today);
      //$('#inv-date-prev').text(today);
});



$(".add-stock-diff-status").click(function(e) {
    var selected = $('#STAccountName');
    var selectedEmp = $('#STEmployeeName');
    let stockDate = $('input[name="listdatepickerstart"]').val();

    if (selected.val() === ''){
        Bert.alert('<strong>WARNING:</strong> Account has not been selected!', 'warning');
        e.preventDefault();
        return false;
    }else if(selectedEmp.val() === '') {
      Bert.alert('<strong>WARNING:</strong> Employee has not been selected!', 'warning');
      e.preventDefault();
      return false;
    }else if(stockDate === '') {
        Bert.alert('<strong>WARNING:</strong> Please fill Date!', 'warning');
        e.preventDefault();
        return false;
    }else{
      var accountName = ($("#STAccountName").val());

      var empName = ($("#STEmployeeName").val());
        var tableLine = $('#component_tb tbody tr').map(function (idxRow, ele) {
        var itemValProd = $(this).closest("tr") .find(".select-product").html();

    if(itemValProd.replace(/\s/g, '') != ""){
    var typeName = 'TSAELinesFlat';
    var retVal = {PartBarcode: ""};
    var Line = '';
    var $td = $(ele).find('td').map(function (idxCell, ele) {
        var input = $(ele).find('div');

        if (input.length >= 1) {

            var attr = $('#component_tb thead tr th').eq(idxCell).text();
            if (attr == 'Item'){
              attr = "ProductName";
                var itemVal = input.text();
                var Segs = itemVal.split('\n');
                Segs=$.trim(Segs[1]);
                retVal[attr] = Segs;
            }else if(attr == 'ItemID'){
              attr = "ProductID";
              retVal[attr] = input.text();
            }else if(attr == 'LineID'){
              var lineIDVal = input.text();
              if(lineIDVal.replace(/\s/g, '') != ""){
                attr = "ID";
                retVal[attr] = input.text();
              }

            }
            else if(attr == 'Description'){
              attr = "Description";
              retVal[attr] = input.text();
            }
            else if(attr == 'Department'){
              attr = "DeptName";
              var itemVal = input.text();
              var Segs = itemVal.split('\n');
              Segs=$.trim(Segs[1]);
              retVal[attr] = Segs;

            }else if(attr == 'UOM'){
              attr = "UnitOfMeasure";
              var itemVal = input.text();
              var Segs = itemVal.split('\n');
              Segs=$.trim(Segs[1]);
              retVal[attr] = Segs;
            }else if(attr == 'Adjust'){
              attr = "AdjustQty";
              attr2 = "AdjustUOMQty";
              attr3 = "Qty";
              attr4 = "UOMQty";
              var adjustedQty = input.html();

              if((adjustedQty == null) || (adjustedQty == "")){
                retVal[attr] = 0;
                retVal[attr2] = 0;
                retVal[attr3] = 0;
                retVal[attr4] = 0;
              }else{
                retVal[attr] = parseFloat(adjustedQty);
                retVal[attr2] = parseFloat(adjustedQty);
                retVal[attr3] = parseFloat(adjustedQty);
                retVal[attr4] = parseFloat(adjustedQty);
              }
            }else if(attr == 'Available'){
              attr = "AvailableUOMQty";
              var availableUOMQty = input.html();
              retVal[attr] = parseFloat(availableUOMQty);
            }else if(attr == 'Final'){
              attr = "FinalUOMQty";
              var finalUOMQty = input.html();
              retVal[attr] = parseFloat(finalUOMQty);
            }else if(attr == 'In-Stock'){
              attr = "InStockUOMQty";
              var instockUOMQty = input.html();
              retVal[attr] = parseFloat(instockUOMQty);
            }
            else{
              attr = "AccountName";
              retVal[attr] = accountName;
            }


            Line = {type: typeName,
                        fields:retVal };

        } else {
            var attr = $('#component_tb thead tr th').eq(idxCell).text();
               }

    });

    }
    return Line;
}).get();


let stockDate_format = moment(stockDate).format();
        let stockStatus;
        if(e.target.id === "createStockAdjust"){
            stockStatus = true;
        }else if(e.target.id === "createHoldStockAdjust" ){
            stockStatus = false;
        }
        let adjustID = $("#StockAdjustId").val();
        var objDetails = '';
        //Id:$("#StockAdjustId").val(),
        if(adjustID != ""){
         objDetails = {
            type: "TStockAdjustEntry",
            fields:
                {
                  AccountName:accountName,
                  Id:adjustID,
                  //AdjustmentDate: stockDate_format,
                  //CreationDate:stockDate_format,
                  AdjustmentOnInStock:true,
                  AdjustType:"Gen",
                  Approved:false,
                  Deleted:false,
                  Employee:empName,
                  EnforceUOM:false,
                  ISEmpty:false,
                  IsStockTake:false,
                  Lines:tableLine,
                  Notes:$('textarea[name="allnotes"]').val(),
                  Processed:stockStatus
                }
        };

      }else{
        objDetails = {
           type: "TStockAdjustEntry",
           fields:
               {
                 AccountName:accountName,
                 //AdjustmentDate: stockDate_format,
                 //CreationDate:stockDate_format,
                 AdjustmentOnInStock:true,
                 AdjustType:"Gen",
                 Approved:false,
                 Deleted:false,
                 Employee:empName,
                 EnforceUOM:false,
                 ISEmpty:false,
                 IsStockTake:false,
                 Lines:tableLine,
                 Notes:$('textarea[name="allnotes"]').val(),
                 Processed:stockStatus
               }
       };
      }
        var erpGet = erpDb();
var oPost = new XMLHttpRequest();

let erpObjects = ERPObjects();
oPost.open("POST",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpObjects.TStockAdjustEntry, true);
oPost.setRequestHeader("database",erpGet.ERPDatabase);
oPost.setRequestHeader("username",erpGet.ERPUsername);
oPost.setRequestHeader("password",erpGet.ERPPassword);
oPost.setRequestHeader("Accept", "application/json");
oPost.setRequestHeader("Accept", "application/html");
oPost.setRequestHeader("Content-type", "application/json");

var myString = JSON.stringify(objDetails);

oPost.send(myString);


oPost.timeout = 30000;

oPost.onreadystatechange = function() {

if (oPost.readyState == 4 && oPost.status == 200) {

FlowRouter.go('/stockadjlist');
/*
    let dataReturn = JSON.parse(oPost.responseText);
    let stockadjustId = dataReturn.fields.ID;
    if (e.target.id === "createStockAdjust") {
        notificationMessagerAfterSave = "Stock Adjust Saved - "+stockadjustId+ "Proccesed";
        Session.set('recordSavedID',stockadjustId);
        Session.set('isShowSaveNotification', notificationMessagerAfterSave);

    }else if (e.target.id === "createHoldStockAdjust") {
      notificationMessagerAfterSave = "Stock Adjust Saved - "+stockadjustId+ "Hold";
        Session.set('recordSavedID',stockadjustId);
        Session.set('isShowSaveNotification', notificationMessagerAfterSave);
        FlowRouter.go('/stockadjlist');
        //Session.set('showApproveNotificationOnNewInvoice', true);
    }
    */

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
templateObject.attachmentCount.set(0);
}else if(oPost.readyState == 4 && oPost.status == 406){
  var ErrorResponse = oPost.getResponseHeader('errormessage');
  var segError = ErrorResponse.split(':');
if((segError[1]) == ' "Unable to lock object'){
  Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>. Please close the stock adjust in ERP!', 'danger');
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
}

}
this.submit();
}
});

$("#btnScanPSN").click(function(e) {
  var scannedCode =  $('input[name="prodBarcode"]').val().toUpperCase();

   //let tempObjNew = Template.instance();
  getProductByBarcode(scannedCode);

  });

});

Template.stockscan.events({
    'click #btn_preview':function() {
        let templateObject = Template.instance();
            let lineItemCount = templateObject.$('.product-name').length;

            let previewRecord = {};
            let items = [];
            for (let i=0; i<lineItemCount; i++){

                let lineObj = {
                    item: $('#product-input-'+i).text(),
                    //productID: tempObj.$('#productID-'+i).text(),
                    description: templateObject.$('#productdesc-'+i).text(),
                    department: templateObject.$('#department-input-'+i).text(),
                    uom: templateObject.$('#uom-input-'+i).text(),
                    instock: templateObject.$('#instock-'+i).text(),
                    available: templateObject.$('#available-'+i).text(),
                    final: templateObject.$('#finalQty-'+i).text(),
                    adjust: templateObject.$('#adjust-'+i).text()
                    //curTotalAmt: tempObj.$('#displayTotalAmt-'+i).text()
                };
                items.push(lineObj);
            }
            previewRecord.LineItems = items;
            previewRecord.id = templateObject.$('#StockAdjustId').val();
            previewRecord.AccountName = templateObject.$('#STAccountName').val();
            previewRecord.AdjustmentDate = templateObject.$('#listdatepickerstart').val();
            templateObject.recordLineForPreview.set(previewRecord);

    },
    'keydown .unitPrice':function(event){
      if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
                // Allow: Ctrl+A, Command+A
               (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
                // Allow: home, end, left, right, down, up
               (event.keyCode >= 35 && event.keyCode <= 40)) {
                    // let it happen, don't do anything
                    return;
           }

          if (event.shiftKey == true) {
              event.preventDefault();
          }

          if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {

          } else {
              event.preventDefault();
          }

          if($(this).val().indexOf('.') !== -1 && event.keyCode == 190)
              event.preventDefault();
    },
    'click a.removebutton':function(event){
      if($('#component_tb tbody>tr').length > 1){
      let templateObject = Template.instance();
      let lineToBeRemoved = event.currentTarget.id.split('removebutton-')[1];
      let newRecord = templateObject.stockAdjustrecord.get();
      if((newRecord.LineItems.length > 1)) {
          $('#pq_entry_'+lineToBeRemoved).remove();
          templateObject.stockAdjustrecord.set(newRecord);
      }else {

      }
  }
    },

    'click .new_create_lines':function(){
        $(".attchment-tooltip").hide();
    },

    'click .active_page_content':function(){
        $(".attchment-tooltip").hide();
    },
    'click #close-quote-notification':function(){
        let tempObj = Template.instance();
        tempObj.$(".notify").hide();
        Session.set('markedAsInvoiceMsg',false);
        Session.set('validateInvoiceNo',false);
    },
    'click .department-option':function(event){
      $(".select-department").val(event.currentTarget.innerText);
    },
    'click .select-department':function(event){
      //let id = event.currentTarget.id.split('department-input-')[1];
      //let productName = $("#instock-" + id).html(totalInStockQty);
      let templateObject = Template.instance();
      templateObject.getAllDeptTypes();
      //$(".select-department").val(event.currentTarget.innerText);
    },
    'click .select-uom':function(event){
        let id = event.currentTarget.id.split('uom-input-')[1];
        let productNameget = $("#product-input-" + id).text();
        let uomNameget = $("#uom-input-" + id).text();
        let templateObject = Template.instance();
        templateObject.PopulateUOMComboForProduct(productNameget, uomNameget);

    },
    'click .department-img': function (event) {
          //this.empty();
        let templateObject = Template.instance();
          //templateObject.getDepartments();
    },
    'click #new_create_btn':function(event){

        let templateObject = Template.instance();
        let newRecord = templateObject.stockAdjustrecord.get();
        newRecord.LineItems.push({
        item: '',
        productID:'',
        description: '',
        department: '',
        uom: '',
        instock: '',
        available: '',
        final: '',
        adjust: ''
        });
        templateObject.stockAdjustrecord.set(newRecord);

        setTimeout(function () {
            templateObject.getProductDropDown();
        }, 2000);
        /*

        setTimeout(function(){
            templateObject.getUOMDropDown();
        },0);

        setTimeout(function(){
            templateObject.getDeptDropDown();
        },0);
        */
    },
    'blur .adjust':function(event){
        let tempObj = Template.instance();
        let id = event.currentTarget.id.split('adjust-')[1];
        let finalTotal = "";
        let inStockQty = $("#instock-" + id).html();
        let finalQty = $("#finalQty-" + id).html();
        let adjustQty = tempObj.$("#" + event.currentTarget.id).html();
        finalTotal = parseFloat(adjustQty) + parseFloat(finalQty);
        $("#finalQty-" + id).html(finalTotal);
        let newRecord = tempObj.stockAdjustrecord.get();
        tempObj.stockAdjustrecord.set(newRecord);
    },
    'click #new_5Line_btn':function(event){
        let templateObject = Template.instance();
        let newRecord = templateObject.stockAdjustrecord.get();
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        templateObject.stockAdjustrecord.set(newRecord);
        templateObject.$('span.remove-line-item').removeAttr('data-toggle data-target');
        setTimeout(function () {
            templateObject.getProductDropDown();
        }, 2000);

        /*
        setTimeout(function(){
            templateObject.getUOMDropDown();
        },0);

        setTimeout(function(){
            templateObject.getDeptDropDown();
        },0);
        */

    },
    'click #new_10Line_btn':function(event){
        let templateObject = Template.instance();
        let newRecord = templateObject.stockAdjustrecord.get();
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        templateObject.stockAdjustrecord.set(newRecord);
        templateObject.$('span.remove-line-item').removeAttr('data-toggle data-target');
        setTimeout(function () {
            templateObject.getProductDropDown();
        }, 2000);
/*
        setTimeout(function(){
            templateObject.getUOMDropDown();
        },0);

        setTimeout(function(){
            templateObject.getDeptDropDown();
        },0);
        */

    },
    'click #new_20Line_btn':function(event){
        let templateObject = Template.instance();
        let newRecord = templateObject.stockAdjustrecord.get();
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        newRecord.LineItems.push({
          item: '',
          productID:'',
          description: '',
          department: '',
          uom: '',
          instock: '',
          available: '',
          final: '',
          adjust: ''
        });
        templateObject.stockAdjustrecord.set(newRecord);
        templateObject.$('span.remove-line-item').removeAttr('data-toggle data-target');
        setTimeout(function () {
            templateObject.getProductDropDown();
        }, 2000);

/*
        setTimeout(function(){
            templateObject.getUOMDropDown();
        },0);

        setTimeout(function(){
            templateObject.getDeptDropDown();
        },0);
        */
    },
    'click #listdatepickerstart':function() {
      $('input[name="listdatepickerstart"]').select();
    },
    'click #listdatepickerdue':function(){
      $('input[name="listdatepickerdue"]').select();
    },
    'blur #listdatepickerdue': function () {
        let tempObj = Template.instance();
        let isReceiptDateValid = moment(tempObj.$('#listdatepickerdue').val()).isValid();
        if (!isReceiptDateValid) {
            tempObj.$('#listdatepickerdue').val(moment().format('DD MMM YYYY'));
        } else {
            if (!moment(tempObj.$('#listdatepickerdue').val()).date() || !moment(tempObj.$('#listdatepickerdue').val()).month() || moment(tempObj.$('#listdatepickerdue').val()).year() < 1000 || moment(tempObj.$('#listdatepickerdue').val()).year() > 9999) {
                tempObj.$('#listdatepickerdue').val(moment().format('DD MMM YYYY'));
            } else {
                tempObj.$('#listdatepickerdue').val(moment(tempObj.$('#listdatepickerdue').val()).format('D MMM YYYY'));
            }
        }
    },
    'blur #listdatepickerstart': function () {
        let tempObj = Template.instance();
        let isReceiptDateValid = moment(tempObj.$('#listdatepickerstart').val()).isValid();
        if (!isReceiptDateValid) {
            tempObj.$('#listdatepickerstart').val(moment().format('DD MMM YYYY'));
        } else {
            if (!moment(tempObj.$('#listdatepickerstart').val()).date() || !moment(tempObj.$('#listdatepickerstart').val()).month() || moment(tempObj.$('#listdatepickerstart').val()).year() < 1000 || moment(tempObj.$('#listdatepickerstart').val()).year() > 9999) {
                tempObj.$('#listdatepickerstart').val(moment().format('DD MMM YYYY'));
            } else {
                tempObj.$('#listdatepickerstart').val(moment(tempObj.$('#listdatepickerstart').val()).format('D MMM YYYY'));
            }
        }
    },
    'click .add-new-note':function(){
        let temoObj = Template.instance();
        temoObj.$('#AddNote').hide();
    },
    'click #modal_body_mobile':function(){
        $('#modal_body_mobile_view').show();
        $('#modal_body_desktop_view').hide();
        $('.previewInvoiceMobile').addClass('active');
        $('.previewInvoiceDesktop').removeClass('active');
    },
    'click #modal_body_desktop':function(){
        $('#modal_body_mobile_view').hide();
        $('#modal_body_desktop_view').show();
        $('.previewInvoiceMobile').removeClass('active');
        $('.previewInvoiceDesktop').addClass('active');
    },
    'click .productaddbtn_save ':function(e) {
        let clickedButtonId = e.target.id;
        let tempObj = Template.instance();
        let id= tempObj.currentRowID.get();
        let DataList=[];
        let productCode = $("#NProdCode").val();
        if (productCode == '') {
            Bert.alert('<strong>Please provide item code !</strong>', 'danger');
            e.preventDefault();
            return false;
        }
        let productName = $("#NProdName").val();
        if (productName == '') {
            Bert.alert('<strong>Please provide product Name !</strong>', 'danger');
            e.preventDefault();
            return false;
        }
        let itemTaxRate= tempObj.newItemTaxRate.get();
        let TaxCodePurchase = $("#NPTaxPR").val();
        let TaxCodeSales = $("#NPTaxSR").val();
        if (TaxCodePurchase == '' || TaxCodeSales == '') {
            Bert.alert('<strong>Please fill Tax rate !</strong>', 'danger');
            e.preventDefault();
            return false;
        }
        let AssetAccount =$("#NProdPAcc").val();
        let IncomeAccount =$("#NProdSAcc").val();

        if(AssetAccount.includes(" - ")){
            AssetAccount=AssetAccount.split(" - ");
            AssetAccount=AssetAccount[1];
        }
        else if(AssetAccount.includes("- ")){
            AssetAccount=AssetAccount.split("- ");
            AssetAccount=AssetAccount[1];
        }
        if(IncomeAccount.includes(" - ")){
            IncomeAccount=IncomeAccount.split(" - ");
            IncomeAccount=IncomeAccount[1];
        }
        else if(IncomeAccount.includes("- ")){
            IncomeAccount=IncomeAccount.split("- ");
            IncomeAccount=IncomeAccount[1];
        }

      let itrackThisItem = false;
      if($('input[name="ItrackThisItem"]').is(":checked")){
        itrackThisItem = true;
        }else{
        itrackThisItem = false;
       }

        var objDetails = {
            type: "TProduct",
            fields: {
                Active: true,
                ProductType: "INV",
                ProductName: productCode,
                ProductPrintName: productName,
                PurchaseDescription: $("#NProdPDesc").val(),
                SalesDescription: $("#NProdSDesc").val(),
                AssetAccount: AssetAccount,
                CogsAccount: "Cost of Goods Sold",
                //PreferedSupplierName:$("#NProdSupp").val(),
                IncomeAccount:IncomeAccount,
                BuyQty1: 1,
                BuyQty1CostInc: parseFloat($("#NProdPUPrice").val()),
                BuyQty2: 1,
                BuyQty2CostInc: parseFloat($("#NProdPUPrice").val()),
                BuyQty3: 1,
                BuyQty3CostInc: parseFloat($("#NProdPUPrice").val()),
                SellQty1: 1,
                SellQty1PriceInc: parseFloat($("#NProdSUPrice").val()),
                SellQty2: 1,
                SellQty2PriceInc: parseFloat($("#NProdSUPrice").val()),
                SellQty3: 1,
                SellQty3PriceInc: parseFloat($("#NProdSUPrice").val()),
                TaxCodePurchase: TaxCodePurchase,
                TaxCodeSales: TaxCodeSales,
                UOMPurchases: "Units",
                UOMSales: "Units",
                Barcode:"",
                LockExtraSell: itrackThisItem
            }
        };
        var erpGet = erpDb();
        var oPost = new XMLHttpRequest();

        oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPCreateProduct, true);
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
                let unitPrice =parseFloat($("#NProdPUPrice").val())|| 0;
                let Amount = 1 * (unitPrice);
                let $tblrows = $("#component_tbUpdate tbody tr");
                let taxRateData = tempObj.taxrateobj.get();
                let currencySymbol = tempObj.currencySymbol.get();
                $("#TaxRate-" + id).val(itemTaxRate);
                $("#product-input-" + id).html(productCode+'-'+productName);
                $("#tax-rate-input-" + id).html(TaxCodePurchase);
                $("#productdesc-" + id).html($("#NProdPDesc").val());
                $("#UnitPrice-" + id).html(unitPrice.toFixed(2));
                $("#Ordered-" + id).html(1);
                $("#TotalAmt-" + id).html(Amount.toFixed(2));
                $("#displayTotalAmt-" + id).html(currencySymbol + Amount.toFixed(2));
                let newRecord = tempObj.stockAdjustrecord.get();
                newRecord.LineItems[id] = {
                    item: productCode+'-'+productName,
                    description: $("#NProdPDesc").val(),
                    quantity: '1.00',
                    unitPrice: unitPrice.toFixed(2),
                    taxRate: TaxCodePurchase,
                    curTotalAmt: Amount.toFixed(2)
                };
                if (tempObj.$("#myTaxDropdown").html() == "No Tax") {
                    $('#taxRateHeader').css('background', '#ccc');
                    $("#tax-rate-input-" + id).attr('readonly', true);
                    $("#tax-rate-input-" + id).prop('disabled', true);
                    $('.taxcodetotal').hide();
                    $tblrows.each(function (index) {
                        var $tblrow = $(this);
                        //$tblrow.find('.qty').on('change', function () {

                        var qty = $tblrow.find(".qty").html();

                        var taxrate = $tblrow.find(".taxrate").val();

                        var price = $tblrow.find(".unitPrice").html();
                        var subTotal = parseInt(qty, 10) * parseFloat(price);
                        var taxTotal = 0;
                        if (!isNaN(subTotal)) {

                            $tblrow.find('.subtot').val(subTotal.toFixed(2));
                            $tblrow.find('.displaySubtot').html(currencySymbol + subTotal.toFixed(2));
                            var SubGrandTotal = 0;
                            $(".subtot").each(function () {
                                var stval = parseFloat($(this).val());
                                SubGrandTotal += isNaN(stval) ? 0 : stval;
                            });
                            //taxtot
                            newRecord.SubTotal = currencySymbol + '' + SubGrandTotal.toFixed(2);
                            tempObj.stockAdjustrecord.set(newRecord);

                        }

                        if (!isNaN(taxTotal)) {

                            $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                            var GrandTaxTotal = 0;
                            $(".taxtot").each(function () {
                                var stval = parseFloat($(this).val());
                                GrandTaxTotal += isNaN(stval) ? 0 : stval;

                            });
                            //taxtot
                            newRecord.TotalTax = currencySymbol + '' + GrandTaxTotal.toFixed(2);
                            tempObj.stockAdjustrecord.set(newRecord);

                            //document.getElementById("subtotal_total2").innerHTML = Currency+''+SubGrandTotal.toFixed(2);

                        }

                        if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                            let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                            newRecord.Total = currencySymbol + '' + GrandTotal.toFixed(2);
                            tempObj.stockAdjustrecord.set(newRecord);
                        }


                    });
                } else {
                    $('#taxRateHeader').css('background', '');
                    $("#tax-rate-input-" + id).attr('readonly', false);
                    $("#tax-rate-input-" + id).prop('disabled', false);
                    $('.taxcodetotal').show();
                    $tblrows.each(function (index) {

                        var $tblrow = $(this);
                        //$tblrow.find('.qty').on('change', function () {

                        var qty = $tblrow.find(".qty").html();

                        var taxrate = $tblrow.find(".taxrate").val();

                        var price = $tblrow.find(".unitPrice").html();
                        var subTotal = parseInt(qty, 10) * parseFloat(price);
                        var taxTotal = parseInt(qty, 10) * parseFloat(price) * parseFloat(taxrate);
                        if (!isNaN(subTotal)) {

                            $tblrow.find('.subtot').val(subTotal.toFixed(2));
                            $tblrow.find('.displaySubtot').html(currencySymbol + subTotal.toFixed(2));
                            var SubGrandTotal = 0;
                            $(".subtot").each(function () {
                                var stval = parseFloat($(this).val());
                                SubGrandTotal += isNaN(stval) ? 0 : stval;

                            });
                            //taxtot

                            newRecord.SubTotal = currencySymbol + '' + SubGrandTotal.toFixed(2);
                            tempObj.stockAdjustrecord.set(newRecord);


                        }

                        if (!isNaN(taxTotal)) {
                            $tblrow.find('.taxtot').val(taxTotal.toFixed(2));
                            var GrandTaxTotal = 0;
                            $(".taxtot").each(function () {
                                var stval = parseFloat($(this).val());
                                GrandTaxTotal += isNaN(stval) ? 0 : stval;

                            });
                            //taxtot
                            newRecord.TotalTax = currencySymbol + '' + GrandTaxTotal.toFixed(2);
                            tempObj.stockAdjustrecord.set(newRecord);
                            //document.getElementById("subtotal_total2").innerHTML = Currency+''+SubGrandTotal.toFixed(2);

                        }

                        if (!isNaN(GrandTaxTotal) && (!isNaN(SubGrandTotal))) {
                            let GrandTotal = (parseFloat(GrandTaxTotal)) + (parseFloat(SubGrandTotal));
                            newRecord.Total = currencySymbol + '' + GrandTotal.toFixed(2);
                            tempObj.stockAdjustrecord.set(newRecord);
                        }


                    });
                }
                let flag = 0;
                let indexValue;
                let taxCode = tempObj.taxCode.get();
                if (taxCode.length == 0) {
                    let obj = {
                        id: id,
                        tax: TaxCodePurchase
                    };
                    DataList.push(obj);
                    tempObj.taxCode.set(DataList);
                }
                else {
                    for (let i = 0; i < taxCode.length; i++) {
                        if (taxCode[i].id == id) {
                            flag = true;
                            indexValue = i;
                        }
                    }
                    if (flag == true) {
                        taxCode[indexValue].tax = TaxCodePurchase;
                        tempObj.taxCode.set(taxCode);
                    }
                    else {
                        let obj = {
                            id: id,
                            tax: TaxCodePurchase
                        };
                        DataList.push(obj);
                        tempObj.taxCode.set(DataList);
                    }
                }
                if (clickedButtonId === "saveAndNew") {
                    document.getElementById("productadd").reset();
                    $('input[name="purchaseThisItem"]').prop('checked', true);
                    $('input[name="SellThisItem"]').prop('checked', true);
                } else {
                    document.getElementById("productadd").reset();
                    $('.close').click();
                }

            } else if (oPost.readyState == 4 && oPost.status == 403) {
                Bert.alert('<strong>' + oPost.getResponseHeader('errormessage') + '!</strong>', 'danger');

            } else if (oPost.status == 500) {
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
    'click .account-img': function (event) {
        let templateObject = Template.instance();
        templateObject.$("#STAccountName").trigger("focus");
    },
    'click .employee-img': function (event) {
        let templateObject = Template.instance();
        templateObject.$("#STEmployeeName").trigger("focus");
    },
    'click .hide-add-account': function () {
        $('.hide-add-new-account').css("display", "none");
    },
    'blur .for-preview':function () {
      /*
        let tempObj = Template.instance();
        setTimeout(function(){
            let lineItemCount = tempObj.$('.product-name').length;
            let previewRecord = {};
            let items = [];
            for (let i=0; i<lineItemCount; i++){
                let lineObj = {
                    item: tempObj.$('#product-input-'+i).text(),
                    productID: tempObj.$('#productID-'+i).text(),
                    description: tempObj.$('#productdesc-'+i).text(),
                    department: tempObj.$('#department-'+i).text(),
                    uom: tempObj.$('#uom-'+i).text(),
                    instock: tempObj.$('#instock-'+i).text(),
                    available: tempObj.$('#available-'+i).text(),
                    final: tempObj.$('#finalQty-'+i).text(),
                    adjust: tempObj.$('#adjust-'+i).text()
                    //curTotalAmt: tempObj.$('#displayTotalAmt-'+i).text()
                };
                items.push(lineObj);
            }
            previewRecord.LineItems = items;
            //previewRecord.SubTotal = tempObj.$('#subtotal_total').text();
            //previewRecord.TotalTax = tempObj.$('#subtotal_total3').text();
            //previewRecord.Total = tempObj.$('#subtotal_total2').text();
            tempObj.recordForPreview.set(previewRecord);
        },0);
        */
    },
    'click #close-save-notification': function () {
        let tempObj = Template.instance();
        tempObj.$(".notify").hide();
        Session.set('isShowSaveNotification', false);
    },
    'keyup #prodBarcode':function (e) {

      if (e.keyCode == 13) {
        var scannedCode =  $('input[name="prodBarcode"]').val().toUpperCase();
        getProductByBarcode(scannedCode);
      }

    },
    'click .viewProdImage':function(event){
        let id = event.currentTarget.id.split('product-image-')[1];
        let productName = $("#product-input-" + id).text();

        //let uomNameget = $("#uom-input-" + id).text();
        let templateObject = Template.instance();
        if(productName.replace(/\s/g, '') != ""){
          templateObject.loadProductImage(productName);
        }

    }
});
