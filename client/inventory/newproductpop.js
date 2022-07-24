import {ProductService} from "../product/product-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import 'jquery-editable-select';
import { Random } from 'meteor/random';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();

Template.newproductpop.onCreated(()=>{
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
    templateObject.isTrackChecked  = new ReactiveVar();
    templateObject.isTrackChecked.set(false);

    templateObject.isExtraSellChecked  = new ReactiveVar();
    templateObject.isExtraSellChecked.set(false);

    templateObject.defaultpurchasetaxcode = new ReactiveVar();
    templateObject.defaultsaletaxcode = new ReactiveVar();

    templateObject.includeInventory = new ReactiveVar();
    templateObject.includeInventory.set(false);
    templateObject.clienttypeList = new ReactiveVar();

});


Template.newproductpop.onRendered(function() {
    let templateObject = Template.instance();
    let productService = new ProductService();
    const records =[];
    const taxCodesList =[];
    const deptrecords = [];

    const coggsaccountrecords = [];
    const salesaccountrecords = [];
    const inventoryaccountrecords = [];
    let clientType = [];


    templateObject.getAccountNames = function(){
      getVS1Data('TAccountVS1').then(function (dataObject) {
        if(dataObject.length == 0){
          productService.getAccountName().then(function(data){

              let productData = templateObject.records.get();
              for(let i in data.taccount){

                  let accountnamerecordObj = {
                      accountname: data.taccount[i].AccountName || ' '
                  };
                  if((data.taccount[i].AccountTypeName == "COGS")){
                      coggsaccountrecords.push(accountnamerecordObj);
                      templateObject.coggsaccountrecords.set(coggsaccountrecords);
                  }


                  if((data.taccount[i].AccountTypeName == "INC")){
                      salesaccountrecords.push(accountnamerecordObj);
                      templateObject.salesaccountrecords.set(salesaccountrecords);
                  }

                  if((data.taccount[i].AccountTypeName == "OCASSET")){
                      inventoryaccountrecords.push(accountnamerecordObj);
                      templateObject.inventoryaccountrecords.set(inventoryaccountrecords);
                  }


              }



          });
        }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.taccountvs1;
        let productData = templateObject.records.get();
        for(let i in useData){

            let accountnamerecordObj = {
                accountname: useData[i].fields.AccountName || ' '
            };
            if((useData[i].fields.AccountTypeName == "COGS")){
                coggsaccountrecords.push(accountnamerecordObj);
                templateObject.coggsaccountrecords.set(coggsaccountrecords);
            }


            if((useData[i].fields.AccountTypeName == "INC")){
                salesaccountrecords.push(accountnamerecordObj);
                templateObject.salesaccountrecords.set(salesaccountrecords);
            }

            if((useData[i].fields.AccountTypeName == "OCASSET")){
                inventoryaccountrecords.push(accountnamerecordObj);
                templateObject.inventoryaccountrecords.set(inventoryaccountrecords);
            }


        }

        }
      }).catch(function (err) {
        productService.getAccountName().then(function(data){

            let productData = templateObject.records.get();
            for(let i in data.taccount){

                let accountnamerecordObj = {
                    accountname: data.taccount[i].AccountName || ' '
                };
                if((data.taccount[i].AccountTypeName == "COGS")){
                    coggsaccountrecords.push(accountnamerecordObj);
                    templateObject.coggsaccountrecords.set(coggsaccountrecords);
                }


                if((data.taccount[i].AccountTypeName == "INC")){
                    salesaccountrecords.push(accountnamerecordObj);
                    templateObject.salesaccountrecords.set(salesaccountrecords);
                }

                if((data.taccount[i].AccountTypeName == "OCASSET")){
                    inventoryaccountrecords.push(accountnamerecordObj);
                    templateObject.inventoryaccountrecords.set(inventoryaccountrecords);
                }


            }



        });
      });


    }

    templateObject.getAllTaxCodes = function () {
      getVS1Data('TTaxcodeVS1').then(function (dataObject) {
        if(dataObject.length == 0){
          productService.getTaxCodesVS1().then(function (data) {

              for(let i=0; i<data.ttaxcodevs1.length; i++){

                  let taxcoderecordObj = {
                      codename: data.ttaxcodevs1[i].CodeName || ' ',
                      coderate: data.ttaxcodevs1[i].Rate || ' ',
                  };

                  taxCodesList.push(taxcoderecordObj);

              }
              templateObject.taxraterecords.set(taxCodesList);

          })
        }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.ttaxcodevs1;
        for(let i=0; i<useData.length; i++){

            let taxcoderecordObj = {
                codename: useData[i].CodeName || ' ',
                coderate: useData[i].Rate || ' ',
            };

            taxCodesList.push(taxcoderecordObj);

        }
        templateObject.taxraterecords.set(taxCodesList);

        }
        }).catch(function (err) {
          productService.getTaxCodesVS1().then(function (data) {

              for(let i=0; i<data.ttaxcodevs1.length; i++){

                  let taxcoderecordObj = {
                      codename: data.ttaxcodevs1[i].CodeName || ' ',
                      coderate: data.ttaxcodevs1[i].Rate || ' ',
                  };

                  taxCodesList.push(taxcoderecordObj);

              }
              templateObject.taxraterecords.set(taxCodesList);

          })
        });


    };

    templateObject.getDepartments = function(){
      getVS1Data('TDeptClass').then(function (dataObject) {
        if(dataObject.length == 0){
          productService.getDepartment().then(function(data){
              for(let i in data.tdeptclass){

                  let deptrecordObj = {
                      department: data.tdeptclass[i].DeptClassName || ' ',
                  };

                  deptrecords.push(deptrecordObj);
                  templateObject.deptrecords.set(deptrecords);

              }
          });
        }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tdeptclass;
        for(let i in useData){

            let deptrecordObj = {
                department: useData[i].DeptClassName || ' ',
            };

            deptrecords.push(deptrecordObj);
            templateObject.deptrecords.set(deptrecords);

        }

        }
        }).catch(function (err) {
          productService.getDepartment().then(function(data){
              for(let i in data.tdeptclass){

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
    if(isInventory){
        templateObject.includeInventory.set(true);
    }

    var getprod_id = $('#selectProductID').val();
    // var currentProductID = getprod_id[getprod_id.length-1];
    let lineExtaSellItems = [];
    let lineExtaSellObj = {};
    if(getprod_id != ''){
        currentProductID = parseInt(getprod_id);

        templateObject.getProductData = function () {

          getVS1Data('TProductVS1').then(function (dataObject) {
            if(dataObject.length == 0){
              productService.getOneProductdatavs1(currentProductID).then(function (data) {
                  let lineItems = [];
                  let lineItemObj = {};
                  let currencySymbol = Currency;
                  let totalquantity = 0;

                  let productrecord = {
                      id : data.fields.ID,
                      productname : data.fields.ProductName,
                      lib: data.fields.ProductName,
                      productcode : data.fields.PRODUCTCODE,
                      productprintName : data.fields.ProductPrintName,
                      assetaccount : data.fields.AssetAccount,
                      buyqty1cost : utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1Cost),
                      cogsaccount: data.fields.CogsAccount,
                      taxcodepurchase : data.fields.TaxCodePurchase,
                      purchasedescription : data.fields.PurchaseDescription,
                      sellqty1price : utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1Price),
                      incomeaccount : data.fields.IncomeAccount,
                      taxcodesales : data.fields.TaxCodeSales,
                      salesdescription : data.fields.SalesDescription,
                      active : data.fields.Active,
                      lockextrasell : data.fields.LockExtraSell,
                      customfield1 : data.fields.CUSTFLD1,
                      customfield2 : data.fields.CUSTFLD2,
                      //totalqtyinstock : totalquantity,
                      barcode:data.fields.BARCODE,
                      // data.fields.TotalQtyInStock,
                      totalqtyonorder : data.fields.TotalQtyOnOrder,
                      //productclass :lineItems
                  };

                  if(data.fields.ExtraSellPrice == null){
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
                  }else{
                    templateObject.isExtraSellChecked.set(true);
                    for(let e=0; e<data.fields.ExtraSellPrice.length; e++){
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
                  if(itrackItem ==  true){
                      templateObject.isTrackChecked.set(true);
                  }else{
                      templateObject.isTrackChecked.set(false);
                  }
                  if(data.fields.ProductType=="INV"){
                    templateObject.isTrackChecked.set(true);
                  }else{
                    templateObject.isTrackChecked.set(false);
                  }
                  $('#sltsalesacount').val(data.fields.IncomeAccount);
                  $('#sltcogsaccount').val(data.fields.CogsAccount);

                  templateObject.records.set(productrecord);
              }).catch(function (err) {


              });
            }else{
              let data = JSON.parse(dataObject[0].data);
              let useData = data.tproductvs1;

              var added=false;

              for(let i=0; i<useData.length; i++){
                if(parseInt(useData[i].fields.ID) === currentProductID){
                  added = true;

                  let lineItems = [];
                  let lineItemObj = {};
                  let currencySymbol = Currency;
                  let totalquantity = 0;

                  let productrecord = {
                      id : useData[i].fields.ID,
                      productname : useData[i].fields.ProductName,
                      lib: useData[i].fields.ProductName,
                      productcode : useData[i].fields.PRODUCTCODE,
                      productprintName : useData[i].fields.ProductPrintName,
                      assetaccount : useData[i].fields.AssetAccount,
                      buyqty1cost : utilityService.modifynegativeCurrencyFormat(useData[i].fields.BuyQty1Cost),
                      cogsaccount: useData[i].fields.CogsAccount,
                      taxcodepurchase : useData[i].fields.TaxCodePurchase,
                      purchasedescription : useData[i].fields.PurchaseDescription,
                      sellqty1price : utilityService.modifynegativeCurrencyFormat(useData[i].fields.SellQty1Price),
                      incomeaccount : useData[i].fields.IncomeAccount,
                      taxcodesales : useData[i].fields.TaxCodeSales,
                      salesdescription : useData[i].fields.SalesDescription,
                      active : useData[i].fields.Active,
                      lockextrasell : useData[i].fields.LockExtraSell,
                      customfield1 : useData[i].fields.CUSTFLD1,
                      customfield2 : useData[i].fields.CUSTFLD2,
                      //totalqtyinstock : totalquantity,
                      barcode:useData[i].fields.BARCODE,
                      // useData[i].fields.TotalQtyInStock,
                      totalqtyonorder : useData[i].fields.TotalQtyOnOrder,
                      //productclass :lineItems
                  };
                  if(useData[i].fields.ExtraSellPrice == null){
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
                  }else{
                    templateObject.isExtraSellChecked.set(true);
                    for(let e=0; e<useData[i].fields.ExtraSellPrice.length; e++){
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
                  if(itrackItem ==  true){
                      templateObject.isTrackChecked.set(true);
                  }else{
                      templateObject.isTrackChecked.set(false);
                  }

                  if(useData[i].fields.ProductType=="INV"){
                    templateObject.isTrackChecked.set(true);
                  }else{
                    templateObject.isTrackChecked.set(false);
                  }
                  $('#sltsalesacount').val(useData[i].fields.IncomeAccount);
                  $('#sltcogsaccount').val(useData[i].fields.CogsAccount);

                  templateObject.records.set(productrecord);
                }
              }
              if(!added) {
                productService.getOneProductdatavs1(currentProductID).then(function (data) {

                    let lineItems = [];
                    let lineItemObj = {};
                    let currencySymbol = Currency;
                    let totalquantity = 0;

                    let productrecord = {
                        id : data.fields.ID,
                        productname : data.fields.ProductName,
                        lib: data.fields.ProductName,
                        productcode : data.fields.PRODUCTCODE,
                        productprintName : data.fields.ProductPrintName,
                        assetaccount : data.fields.AssetAccount,
                        buyqty1cost : utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1Cost),
                        cogsaccount: data.fields.CogsAccount,
                        taxcodepurchase : data.fields.TaxCodePurchase,
                        purchasedescription : data.fields.PurchaseDescription,
                        sellqty1price : utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1Price),
                        incomeaccount : data.fields.IncomeAccount,
                        taxcodesales : data.fields.TaxCodeSales,
                        salesdescription : data.fields.SalesDescription,
                        active : data.fields.Active,
                        lockextrasell : data.fields.LockExtraSell,
                        customfield1 : data.fields.CUSTFLD1,
                        customfield2 : data.fields.CUSTFLD2,
                        //totalqtyinstock : totalquantity,
                        barcode:data.fields.BARCODE,
                        // data.fields.TotalQtyInStock,
                        totalqtyonorder : data.fields.TotalQtyOnOrder,
                        //productclass :lineItems
                    };

                    if(data.fields.ExtraSellPrice == null){
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
                    }else{
                      templateObject.isExtraSellChecked.set(true);
                      for(let e=0; e<data.fields.ExtraSellPrice.length; e++){
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
                    if(itrackItem ==  true){
                        templateObject.isTrackChecked.set(true);
                    }else{
                        templateObject.isTrackChecked.set(false);
                    }
                    if(data.fields.ProductType=="INV"){
                      templateObject.isTrackChecked.set(true);
                    }else{
                      templateObject.isTrackChecked.set(false);
                    }
                    $('#sltsalesacount').val(data.fields.IncomeAccount);
                    $('#sltcogsaccount').val(data.fields.CogsAccount);

                    templateObject.records.set(productrecord);
                }).catch(function (err) {


                });
              }
            }
          }).catch(function (err) {
            productService.getOneProductdatavs1(currentProductID).then(function (data) {

                let lineItems = [];
                let lineItemObj = {};
                let currencySymbol = Currency;
                let totalquantity = 0;

                let productrecord = {
                    id : data.fields.ID,
                    productname : data.fields.ProductName,
                    lib: data.fields.ProductName,
                    productcode : data.fields.PRODUCTCODE,
                    productprintName : data.fields.ProductPrintName,
                    assetaccount : data.fields.AssetAccount,
                    buyqty1cost : utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1Cost),
                    cogsaccount: data.fields.CogsAccount,
                    taxcodepurchase : data.fields.TaxCodePurchase,
                    purchasedescription : data.fields.PurchaseDescription,
                    sellqty1price : utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1Price),
                    incomeaccount : data.fields.IncomeAccount,
                    taxcodesales : data.fields.TaxCodeSales,
                    salesdescription : data.fields.SalesDescription,
                    active : data.fields.Active,
                    lockextrasell : data.fields.LockExtraSell,
                    customfield1 : data.fields.CUSTFLD1,
                    customfield2 : data.fields.CUSTFLD2,
                    //totalqtyinstock : totalquantity,
                    barcode:data.fields.BARCODE,
                    // data.fields.TotalQtyInStock,
                    totalqtyonorder : data.fields.TotalQtyOnOrder,
                    //productclass :lineItems
                };

                if(data.fields.ExtraSellPrice == null){
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
                }else{
                  templateObject.isExtraSellChecked.set(true);
                  for(let e=0; e<data.fields.ExtraSellPrice.length; e++){
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
                if(itrackItem ==  true){
                    templateObject.isTrackChecked.set(true);
                }else{
                    templateObject.isTrackChecked.set(false);
                }
                if(data.fields.ProductType=="INV"){
                  templateObject.isTrackChecked.set(true);
                }else{
                  templateObject.isTrackChecked.set(false);
                }
                $('#sltsalesacount').val(data.fields.IncomeAccount);
                $('#sltcogsaccount').val(data.fields.CogsAccount);

                templateObject.records.set(productrecord);
            }).catch(function (err) {


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
            }).keyup(function(e) {
                if(e.keyCode == 8 || e.keyCode == 46) {
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
            }).keyup(function(e) {
                if(e.keyCode == 8 || e.keyCode == 46) {
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

                let qtylineItems = [];
                let qtylineItemObj = {};
                let currencySymbol = Currency;
                let totaldeptquantity = 0;

                for(let j in data.tproductclassquantity){
                    qtylineItemObj = {
                        department:data.tproductclassquantity[j].DepartmentName || '',
                        quantity:data.tproductclassquantity[j].InStockQty || 0,
                    }
                    totaldeptquantity += data.tproductclassquantity[j].InStockQty;
                    qtylineItems.push(qtylineItemObj);
                }
                // $('#edttotalqtyinstock').val(totaldeptquantity);
                templateObject.productqtyrecords.set(qtylineItems);
                templateObject.totaldeptquantity.set(totaldeptquantity);

            }).catch(function (err) {


            });

        }


        templateObject.getProductClassQtyData();
        templateObject.getProductData();

        templateObject.getAllProductRecentTransactions = function () {
            productService.getProductRecentTransactionsAll(currentProductID).then(function (data) {
                recentTransList = [];
                for(let i=0; i<data.t_vs1_report_productmovement.length; i++){
                    let recentTranObject = {
                        date: data.t_vs1_report_productmovement[i].TransactionDate !=''? moment(data.t_vs1_report_productmovement[i].TransactionDate).format("DD/MM/YYYY"): data.t_vs1_report_productmovement[i].TransactionDate,
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
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 1, "asc" ]] ,
                        action: function () {
                            $('#productrecentlist').DataTable().ajax.reload();
                        },

                    }).on('page', function () {

                    }).on('column-reorder', function () {

                    });
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');


                }, 0);

                $('#productrecentlist tbody').on( 'click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".transactiontype").text();

                    if((listData) && (transactiontype)){
                        if(transactiontype === 'Quote' ){
                            window.open('/quotecard?id=' + listData,'_self');
                        }else if(transactiontype === 'Sales Order'){
                            window.open('/salesordercard?id=' + listData,'_self');
                        }else if(transactiontype === 'Invoice'){
                            window.open('/invoicecard?id=' + listData,'_self');
                        }else if(transactiontype === 'Purchase Order'){
                            window.open('/purchaseordercard?id=' + listData,'_self');
                        }else if(transactiontype === 'Bill'){
                            //window.open('/billcard?id=' + listData,'_self');
                        }else if(transactiontype === 'Credit'){
                            //window.open('/creditcard?id=' + listData,'_self');
                        }

                    }
                });

                $('.product_recent_trans').css('display','block');

            }).catch(function (err) {


                $('.product_recent_trans').css('display','block');

                //Bert.alert('<strong>' + err + '</strong>!', 'deleting products failed');
            });

        };

    }else{
        let purchasetaxcode = '';
        let salestaxcode = '';
        let productrecord  = '';

         productrecord = {
            id : '',
            productname : '',
            lib: '',
            productcode : '',
            productprintName : '',
            assetaccount : 'Inventory Asset',
            buyqty1cost : 0,
            cogsaccount: 'Cost of Goods Sold',
            taxcodepurchase : '',
            purchasedescription : '',
            sellqty1price : 0,
            incomeaccount : 'Sales',
            taxcodesales : '',
            salesdescription : '',
            active : '',
            lockextrasell : '',
            customfield1 : '',
            customfield2 : '',
            //totalqtyinstock : totalquantity,
            barcode:'',
            // data.fields.TotalQtyInStock,
            totalqtyonorder : 0
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
        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'defaulttax', function(error, result){
            if(error){
                purchasetaxcode = loggedTaxCodePurchaseInc;
                salestaxcode = loggedTaxCodeSalesInc;
                productrecord = {
                    id :'',
                    productname : '',
                    lib: "New Product",
                    productcode : '',
                    productprintName : '',
                    assetaccount :"Inventory Asset"||'',
                    buyqty1cost : 0,
                    cogsaccount: "Cost of Goods Sold"||'',
                    taxcodepurchase : purchasetaxcode||'',
                    purchasedescription : '',
                    sellqty1price : 0,
                    incomeaccount : "Sales"||'',
                    taxcodesales : salestaxcode||'',
                    salesdescription : '',
                    active : '',
                    lockextrasell : '',
                    barcode:'',
                    totalqtyonorder : 0,

                };

                templateObject.records.set(productrecord);
            }else{
                if(result){
                    purchasetaxcode = result.customFields[0].taxvalue || loggedTaxCodePurchaseInc;
                    salestaxcode = result.customFields[1].taxvalue || loggedTaxCodeSalesInc;
                    productrecord = {
                        id :'',
                        productname : '',
                        lib: "New Product",
                        productcode : '',
                        productprintName : '',
                        assetaccount :"Inventory Asset"||'',
                        buyqty1cost : 0,
                        cogsaccount: "Cost of Goods Sold"||'',
                        taxcodepurchase : purchasetaxcode||'',
                        purchasedescription : '',
                        sellqty1price : 0,
                        incomeaccount : "Sales"||'',
                        taxcodesales : salestaxcode||'',
                        salesdescription : '',
                        active : '',
                        lockextrasell : '',
                        barcode:'',
                        totalqtyonorder : 0,

                    };

                    templateObject.records.set(productrecord);
                }

            }
        });
        //}, 500);




        setTimeout(function () {
            $('.recenttrasaction').css('display','none');
        }, 500);

    }

});

Template.newproductpop.helpers({
    productrecord : () => {
        return Template.instance().records.get();
    },
    taxraterecords :() => {
        return Template.instance().taxraterecords.get();
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
    recentTrasactions: () => {
        return Template.instance().recentTrasactions.get();
    },
    coggsaccountrecords: () => {
        return Template.instance().coggsaccountrecords.get().sort(function(a, b){
            if (a.accountname == 'NA') {
                return 1;
            }
            else if (b.accountname == 'NA') {
                return -1;
            }
            return (a.accountname.toUpperCase() > b.accountname.toUpperCase()) ? 1 : -1;
        });
    },
    salesaccountrecords: () => {
        return Template.instance().salesaccountrecords.get().sort(function(a, b){
            if (a.accountname == 'NA') {
                return 1;
            }
            else if (b.accountname == 'NA') {
                return -1;
            }
            return (a.accountname.toUpperCase() > b.accountname.toUpperCase()) ? 1 : -1;
        });
    },
    inventoryaccountrecords: () => {
        return Template.instance().inventoryaccountrecords.get()
            .sort(function(a, b){
            if (a.accountname == 'NA') {
                return 1;
            }
            else if (b.accountname == 'NA') {
                return -1;
            }
            return (a.accountname.toUpperCase() > b.accountname.toUpperCase()) ? 1 : -1;
        });
    },
    productqtyrecords: () => {
        return Template.instance().productqtyrecords.get().sort(function(a, b){
            if (a.department == 'NA') {
                return 1;
            }
            else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    productExtraSell: () => {
        return Template.instance().productExtraSell.get().sort(function(a, b){
            if (a.clienttype == 'NA') {
                return 1;
            }
            else if (b.clienttype == 'NA') {
                return -1;
            }
            return (a.clienttype.toUpperCase() > b.clienttype.toUpperCase()) ? 1 : -1;
        });
    },
    totaldeptquantity: () => {
        return Template.instance().totaldeptquantity.get();
    },
    productsCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'productview'});
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
            }
            else if (b == 'NA') {
                return -1;
            }
            return (a.toUpperCase() > b.toUpperCase()) ? 1 : -1;
        });
    }


});

Template.newproductpop.events({
    'click #sltsalesacount': function(event){
        // $('#edtassetaccount').select();
        // $('#edtassetaccount').editableSelect();
    },
    'change #selectProductID':function(event){
      const templateObject = Template.instance();
      let productService = new ProductService();
        var productDataID = $(event.target).val() || '';
        if(productDataID.replace(/\s/g, '') != '') {
          let lineExtaSellItems = [];
          let lineExtaSellObj = {};

              let currentProductID = parseInt(productDataID);

              templateObject.getProductData = function () {

                getVS1Data('TProductVS1').then(function (dataObject) {
                  if(dataObject.length == 0){
                    productService.getOneProductdatavs1(currentProductID).then(function (data) {

                        let lineItems = [];
                        let lineItemObj = {};
                        let currencySymbol = Currency;
                        let totalquantity = 0;

                        let productrecord = {
                            id : data.fields.ID,
                            productname : data.fields.ProductName,
                            lib: data.fields.ProductName,
                            productcode : data.fields.PRODUCTCODE,
                            productprintName : data.fields.ProductPrintName,
                            assetaccount : data.fields.AssetAccount,
                            buyqty1cost : utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1Cost),
                            cogsaccount: data.fields.CogsAccount,
                            taxcodepurchase : data.fields.TaxCodePurchase,
                            purchasedescription : data.fields.PurchaseDescription,
                            sellqty1price : utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1Price),
                            incomeaccount : data.fields.IncomeAccount,
                            taxcodesales : data.fields.TaxCodeSales,
                            salesdescription : data.fields.SalesDescription,
                            active : data.fields.Active,
                            lockextrasell : data.fields.LockExtraSell,
                            customfield1 : data.fields.CUSTFLD1,
                            customfield2 : data.fields.CUSTFLD2,
                            //totalqtyinstock : totalquantity,
                            barcode:data.fields.BARCODE,
                            // data.fields.TotalQtyInStock,
                            totalqtyonorder : data.fields.TotalQtyOnOrder,
                            //productclass :lineItems
                        };

                        if(data.fields.ExtraSellPrice == null){
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
                        }else{
                          templateObject.isExtraSellChecked.set(true);
                          for(let e=0; e<data.fields.ExtraSellPrice.length; e++){
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
                        if(itrackItem ==  true){
                            templateObject.isTrackChecked.set(true);
                        }else{
                            templateObject.isTrackChecked.set(false);
                        }
                        if(data.fields.ProductType=="INV"){
                          templateObject.isTrackChecked.set(true);
                        }else{
                          templateObject.isTrackChecked.set(false);
                        }
                        $('#sltsalesacount').val(data.fields.IncomeAccount);
                        $('#sltcogsaccount').val(data.fields.CogsAccount);

                        templateObject.records.set(productrecord);
                    }).catch(function (err) {


                    });
                  }else{
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tproductvs1;

                    var added=false;

                    for(let i=0; i<useData.length; i++){
                      if(parseInt(useData[i].fields.ID) === currentProductID){
                        added = true;

                        let lineItems = [];
                        let lineItemObj = {};
                        let currencySymbol = Currency;
                        let totalquantity = 0;

                        let productrecord = {
                            id : useData[i].fields.ID,
                            productname : useData[i].fields.ProductName,
                            lib: useData[i].fields.ProductName,
                            productcode : useData[i].fields.PRODUCTCODE,
                            productprintName : useData[i].fields.ProductPrintName,
                            assetaccount : useData[i].fields.AssetAccount,
                            buyqty1cost : utilityService.modifynegativeCurrencyFormat(useData[i].fields.BuyQty1Cost),
                            cogsaccount: useData[i].fields.CogsAccount,
                            taxcodepurchase : useData[i].fields.TaxCodePurchase,
                            purchasedescription : useData[i].fields.PurchaseDescription,
                            sellqty1price : utilityService.modifynegativeCurrencyFormat(useData[i].fields.SellQty1Price),
                            incomeaccount : useData[i].fields.IncomeAccount,
                            taxcodesales : useData[i].fields.TaxCodeSales,
                            salesdescription : useData[i].fields.SalesDescription,
                            active : useData[i].fields.Active,
                            lockextrasell : useData[i].fields.LockExtraSell,
                            customfield1 : useData[i].fields.CUSTFLD1,
                            customfield2 : useData[i].fields.CUSTFLD2,
                            //totalqtyinstock : totalquantity,
                            barcode:useData[i].fields.BARCODE,
                            // useData[i].fields.TotalQtyInStock,
                            totalqtyonorder : useData[i].fields.TotalQtyOnOrder,
                            //productclass :lineItems
                        };
                        if(useData[i].fields.ExtraSellPrice == null){
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
                        }else{
                          templateObject.isExtraSellChecked.set(true);
                          for(let e=0; e<useData[i].fields.ExtraSellPrice.length; e++){
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
                        if(itrackItem ==  true){
                            templateObject.isTrackChecked.set(true);
                        }else{
                            templateObject.isTrackChecked.set(false);
                        }

                        if(useData[i].fields.ProductType=="INV"){
                          templateObject.isTrackChecked.set(true);
                        }else{
                          templateObject.isTrackChecked.set(false);
                        }
                        $('#sltsalesacount').val(useData[i].fields.IncomeAccount);
                        $('#sltcogsaccount').val(useData[i].fields.CogsAccount);

                        templateObject.records.set(productrecord);
                      }
                    }
                    if(!added) {
                      productService.getOneProductdatavs1(currentProductID).then(function (data) {

                          let lineItems = [];
                          let lineItemObj = {};
                          let currencySymbol = Currency;
                          let totalquantity = 0;

                          let productrecord = {
                              id : data.fields.ID,
                              productname : data.fields.ProductName,
                              lib: data.fields.ProductName,
                              productcode : data.fields.PRODUCTCODE,
                              productprintName : data.fields.ProductPrintName,
                              assetaccount : data.fields.AssetAccount,
                              buyqty1cost : utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1Cost),
                              cogsaccount: data.fields.CogsAccount,
                              taxcodepurchase : data.fields.TaxCodePurchase,
                              purchasedescription : data.fields.PurchaseDescription,
                              sellqty1price : utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1Price),
                              incomeaccount : data.fields.IncomeAccount,
                              taxcodesales : data.fields.TaxCodeSales,
                              salesdescription : data.fields.SalesDescription,
                              active : data.fields.Active,
                              lockextrasell : data.fields.LockExtraSell,
                              customfield1 : data.fields.CUSTFLD1,
                              customfield2 : data.fields.CUSTFLD2,
                              //totalqtyinstock : totalquantity,
                              barcode:data.fields.BARCODE,
                              // data.fields.TotalQtyInStock,
                              totalqtyonorder : data.fields.TotalQtyOnOrder,
                              //productclass :lineItems
                          };

                          if(data.fields.ExtraSellPrice == null){
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
                          }else{
                            templateObject.isExtraSellChecked.set(true);
                            for(let e=0; e<data.fields.ExtraSellPrice.length; e++){
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
                          if(itrackItem ==  true){
                              templateObject.isTrackChecked.set(true);
                          }else{
                              templateObject.isTrackChecked.set(false);
                          }
                          if(data.fields.ProductType=="INV"){
                            templateObject.isTrackChecked.set(true);
                          }else{
                            templateObject.isTrackChecked.set(false);
                          }
                          $('#sltsalesacount').val(data.fields.IncomeAccount);
                          $('#sltcogsaccount').val(data.fields.CogsAccount);

                          templateObject.records.set(productrecord);
                      }).catch(function (err) {


                      });
                    }
                  }
                }).catch(function (err) {
                  productService.getOneProductdatavs1(currentProductID).then(function (data) {

                      let lineItems = [];
                      let lineItemObj = {};
                      let currencySymbol = Currency;
                      let totalquantity = 0;

                      let productrecord = {
                          id : data.fields.ID,
                          productname : data.fields.ProductName,
                          lib: data.fields.ProductName,
                          productcode : data.fields.PRODUCTCODE,
                          productprintName : data.fields.ProductPrintName,
                          assetaccount : data.fields.AssetAccount,
                          buyqty1cost : utilityService.modifynegativeCurrencyFormat(data.fields.BuyQty1Cost),
                          cogsaccount: data.fields.CogsAccount,
                          taxcodepurchase : data.fields.TaxCodePurchase,
                          purchasedescription : data.fields.PurchaseDescription,
                          sellqty1price : utilityService.modifynegativeCurrencyFormat(data.fields.SellQty1Price),
                          incomeaccount : data.fields.IncomeAccount,
                          taxcodesales : data.fields.TaxCodeSales,
                          salesdescription : data.fields.SalesDescription,
                          active : data.fields.Active,
                          lockextrasell : data.fields.LockExtraSell,
                          customfield1 : data.fields.CUSTFLD1,
                          customfield2 : data.fields.CUSTFLD2,
                          //totalqtyinstock : totalquantity,
                          barcode:data.fields.BARCODE,
                          // data.fields.TotalQtyInStock,
                          totalqtyonorder : data.fields.TotalQtyOnOrder,
                          //productclass :lineItems
                      };

                      if(data.fields.ExtraSellPrice == null){
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
                      }else{
                        templateObject.isExtraSellChecked.set(true);
                        for(let e=0; e<data.fields.ExtraSellPrice.length; e++){
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
                      if(itrackItem ==  true){
                          templateObject.isTrackChecked.set(true);
                      }else{
                          templateObject.isTrackChecked.set(false);
                      }
                      if(data.fields.ProductType=="INV"){
                        templateObject.isTrackChecked.set(true);
                      }else{
                        templateObject.isTrackChecked.set(false);
                      }
                      $('#sltsalesacount').val(data.fields.IncomeAccount);
                      $('#sltcogsaccount').val(data.fields.CogsAccount);

                      templateObject.records.set(productrecord);
                  }).catch(function (err) {


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
                  }).keyup(function(e) {
                      if(e.keyCode == 8 || e.keyCode == 46) {
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
                  }).keyup(function(e) {
                      if(e.keyCode == 8 || e.keyCode == 46) {
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

                      let qtylineItems = [];
                      let qtylineItemObj = {};
                      let currencySymbol = Currency;
                      let totaldeptquantity = 0;

                      for(let j in data.tproductclassquantity){
                          qtylineItemObj = {
                              department:data.tproductclassquantity[j].DepartmentName || '',
                              quantity:data.tproductclassquantity[j].InStockQty || 0,
                          }
                          totaldeptquantity += data.tproductclassquantity[j].InStockQty;
                          qtylineItems.push(qtylineItemObj);
                      }
                      // $('#edttotalqtyinstock').val(totaldeptquantity);
                      templateObject.productqtyrecords.set(qtylineItems);
                      templateObject.totaldeptquantity.set(totaldeptquantity);

                  }).catch(function (err) {


                  });

              }


              templateObject.getProductClassQtyData();
              templateObject.getProductData();

              templateObject.getAllProductRecentTransactions = function () {
                  productService.getProductRecentTransactionsAll(currentProductID).then(function (data) {
                      recentTransList = [];
                      for(let i=0; i<data.t_vs1_report_productmovement.length; i++){
                          let recentTranObject = {
                              date: data.t_vs1_report_productmovement[i].TransactionDate !=''? moment(data.t_vs1_report_productmovement[i].TransactionDate).format("DD/MM/YYYY"): data.t_vs1_report_productmovement[i].TransactionDate,
                              type: data.t_vs1_report_productmovement[i].TranstypeDesc,
                              transactionno: data.t_vs1_report_productmovement[i].TransactionNo,
                              reference: data.t_vs1_report_productmovement[i].TransactionNo,
                              quantity: data.t_vs1_report_productmovement[i].Qty,
                              unitPrice: utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].Price),
                              total: utilityService.modifynegativeCurrencyFormat(data.t_vs1_report_productmovement[i].TotalPrice)
                          };
                          recentTransList.push(recentTranObject);
                      }


                  }).catch(function (err) {


                      $('.product_recent_trans').css('display','block');

                      //Bert.alert('<strong>' + err + '</strong>!', 'deleting products failed');
                  });

              };


        }
    },
    'click .inventorynottracking': function(event){
        swal('Please enable this feature in Access Setting!', '', 'info');
    },
    'click .inventorytrackingTest': function(event){
        if($(event.target).is(':checked')){
            swal('Info', 'If Inventory tracking is turned on it cannot be disabled in the future.', 'info');
        }
    },
    'click #loadrecenttransaction': function(event){
        $('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        templateObject.getAllProductRecentTransactions();
    },
    'click #btnSaveProdPOP': async function () {
        let productService = new ProductService();
        let productCode = $("#edtproductcode").val();
        let productName = $("#edtproductname").val();
        var objDetails = '';
        let lineExtaSellItems = [];
        let lineExtaSellObj = {};
        $('.fullScreenSpin').css('display','inline-block');

        let itrackThisItem = false;
        if($('input[name="chkTrack"]').is(":checked")){
            itrackThisItem = true;
        }else{
            itrackThisItem = false;
        }

        if(productName == ''){
            swal('Please provide product Name !', '', 'warning');

            e.preventDefault();
            return false;
        }

        let  TaxCodePurchase = $("#slttaxcodepurchase").val();
        let  TaxCodeSales    = $("#slttaxcodesales").val();
        if(TaxCodePurchase == '' || TaxCodeSales == '' ){
            swal('Please fill Tax rate !', '', 'warning');

            e.preventDefault();
            return false;
        }

        let getchkcustomField1 = true;
        let getchkcustomField2 =  true;
        let getcustomField1 = $('.customField1Text').html();
        let getcustomField2 = $('.customField2Text').html();
        if($('#formCheck-one').is(':checked')){
            getchkcustomField1 = false;
        }
        if($('#formCheck-two').is(':checked')){
            getchkcustomField2 = false;
        }

        let customField1 = $("#txtCustomField1").val();
        let customField2 = $("#txtCustomField2").val();

        var getprod_id = $('#selectProductID').val();
        var currentID = getprod_id;

        if($('#chkSellPrice').is(':checked')){
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

        if(getprod_id != ''){
            if((itrackThisItem == true) && ($("#sltinventoryacount").val() != '')){
                objDetails = {
                    type:"TProductVS1",
                    fields:
                    {
                        ID:currentID,
                        Active:true,
                        ProductType:"INV",
                        PRODUCTCODE:productCode,
                        CUSTFLD1:customField1,
                        CUSTFLD2:customField2,
                        ProductPrintName:productName,
                        ProductName:productName,
                        PurchaseDescription:$("#txapurchasedescription").val(),
                        SalesDescription:$("#txasalesdescription").val(),
                        AssetAccount:$("#sltinventoryacount").val(),
                        CogsAccount:$("#sltcogsaccount").val(),
                        IncomeAccount:$("#sltsalesacount").val(),
                        BuyQty1Cost:parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0,
                        SellQty1Price:parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g,"")) || 0,
                        TaxCodePurchase:$("#slttaxcodepurchase").val(),
                        TaxCodeSales:$("#slttaxcodesales").val(),
                        UOMPurchases:defaultUOM,
                        UOMSales:defaultUOM,
                        Barcode:$("#edtbarcode").val(),
                        LockExtraSell: itrackThisItem,
                        ExtraSellPrice:lineExtaSellItems||null,
                        PublishOnVS1:true
                    }
                };

            }else{
                objDetails = {
                    type:"TProductVS1",
                    fields:
                    {
                        ID:currentID,
                        Active:true,
                        ProductType:"NONINV",
                        PRODUCTCODE:productCode,
                        CUSTFLD1:customField1,
                        CUSTFLD2:customField2,
                        ProductPrintName:productName,
                        ProductName:productName,
                        PurchaseDescription:$("#txapurchasedescription").val(),
                        SalesDescription:$("#txasalesdescription").val(),
                        CogsAccount:$("#sltcogsaccount").val(),
                        IncomeAccount:$("#sltsalesacount").val(),
                        BuyQty1Cost:parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0,
                        SellQty1Price:parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g,"")) || 0,
                        TaxCodePurchase:$("#slttaxcodepurchase").val(),
                        TaxCodeSales:$("#slttaxcodesales").val(),
                        UOMPurchases:defaultUOM,
                        UOMSales:defaultUOM,
                        Barcode:$("#edtbarcode").val(),
                        LockExtraSell: itrackThisItem,
                        ExtraSellPrice:lineExtaSellItems||null,
                        PublishOnVS1:true
                    }
                };
            }

            productService.saveProductVS1(objDetails).then(function (objDetails) {
              let linesave = objDetails.fields.ID;
              if(itrackThisItem == false){
                let objServiceDetails = {
                    type:"TServices",
                    fields:
                    {
                        ProductId:parseInt(linesave),
                        ServiceDesc:productName,
                        StandardRate:parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0,
                    }
                };
                productService.saveProductService(objServiceDetails).then(function (objServiceDetails) { });
              };

              sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                  addVS1Data('TProductVS1', JSON.stringify(dataReload)).then(function (datareturn) {}).catch(function (err) {});
              }).catch(function (err) {

              });
              var productSaveID = objDetails.fields.ID;

              var currentLoc = FlowRouter.current().route.path;

              if (currentLoc == "/invoicecard" || currentLoc == "/quotecard" || currentLoc == "/salesordercard"|| currentLoc == "/refundcard") {
                  var selectLineID = $('#selectLineID').val();

                  if (selectLineID) {
                      var lineProductName = productName;
                      var lineProductDesc = $("#txasalesdescription").val();
                      var lineUnitPrice = parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0;
                      // var $tblrows = $("#tblInvoiceLine tbody tr");
                      var lineTaxCode = 0;
                      var lineAmount = 0;
                      var lineTaxAmount = 0;
                      var subGrandTotal = 0;
                      var taxGrandTotal = 0;
                      var taxGrandTotalPrint = 0;
                      var lineTaxRate = $("#slttaxcodesales").val() || "";
                      var taxRate = "";

                      let lineExtraSellPrice = lineExtaSellItems || null;
                      let getCustomerClientTypeName = $('#edtCustomerUseType').val() || 'Default';
                      let getCustomerDiscount = parseFloat($('#edtCustomerUseDiscount').val()) || 0;
                      let getCustomerProductDiscount = 0;
                      let discountAmount = getCustomerDiscount;
                      if (lineExtraSellPrice != null) {
                          for (let e = 0; e < lineExtraSellPrice.length; e++) {
                              if (lineExtraSellPrice[e].fields.ClientTypeName === getCustomerClientTypeName) {
                                  getCustomerProductDiscount = parseFloat(lineExtraSellPrice[e].fields.QtyPercent1) || 0;
                                  if (getCustomerProductDiscount > getCustomerDiscount) {
                                      discountAmount = getCustomerProductDiscount;
                                  }
                              }

                          }
                      } else {
                          discountAmount = getCustomerDiscount;
                      }

                      $('#' + selectLineID + " .lineDiscount").text(discountAmount);

                      $('#' + selectLineID + " .lineTaxCode").text($("#slttaxcodesales").val());
                      $('#' + selectLineID + " .lineProductName").val(lineProductName);
                      $('#' + selectLineID + " .colProductName").removeClass('boldtablealertsborder');
                      $('#' + selectLineID + " .lineProductName").attr("prodid", productSaveID);
                      $('#' + selectLineID + " .lineProductDesc").text(lineProductDesc);
                      $('#' + selectLineID + " .lineOrdered").val(1);
                      $('#' + selectLineID + " .lineQty").val(1);
                      $('#' + selectLineID + " .lineUnitPrice").val(lineUnitPrice);



                      if (lineTaxRate == "NT") {
                          lineTaxRate = "E";
                          $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                          if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                              $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                          }
                      } else {
                          $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                          if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                              $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                          }
                      }

                      $('#' + selectLineID + " .colUnitPrice").trigger("change");
                      $('#newProductModal').modal('toggle');
                      $('.fullScreenSpin').css('display','none');
                  }
              }else if (currentLoc == "/purchaseordercard") {
                  var selectLineID = $('#selectLineID').val();

                  if (selectLineID) {
                      var lineProductName = productName;
                      var lineProductDesc = $("#txasalesdescription").val();
                      var lineUnitPrice = parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0;
                      // var $tblrows = $("#tblInvoiceLine tbody tr");
                      var lineTaxCode = 0;
                      var lineAmount = 0;
                      var lineTaxAmount = 0;
                      var subGrandTotal = 0;
                      var taxGrandTotal = 0;
                      var taxGrandTotalPrint = 0;
                      var lineTaxRate = $("#slttaxcodepurchase").val() || "";
                      var taxRate = "";
                      let lineExtraSellPrice = lineExtaSellItems || null;
                      let getCustomerClientTypeName = $('#edtCustomerUseType').val() || 'Default';
                      let getCustomerDiscount = parseFloat($('#edtCustomerUseDiscount').val()) || 0;
                      let getCustomerProductDiscount = 0;
                      let discountAmount = getCustomerDiscount;
                      if (lineExtraSellPrice != null) {
                          for (let e = 0; e < lineExtraSellPrice.length; e++) {
                              if (lineExtraSellPrice[e].fields.ClientTypeName === getCustomerClientTypeName) {
                                  getCustomerProductDiscount = parseFloat(lineExtraSellPrice[e].fields.QtyPercent1) || 0;
                                  if (getCustomerProductDiscount > getCustomerDiscount) {
                                      discountAmount = getCustomerProductDiscount;
                                  }
                              }

                          }
                      } else {
                          discountAmount = getCustomerDiscount;
                      }

                      $('#' + selectLineID + " .lineTaxCode").text($("#slttaxcodepurchase").val());
                      $('#' + selectLineID + " .lineProductName").val(lineProductName);
                      $('#' + selectLineID + " .colProductName").removeClass('boldtablealertsborder');
                      // $('#' + selectLineID + " .lineProductName").attr("prodid", productSaveID);
                      $('#' + selectLineID + " .lineProductDesc").text(lineProductDesc);
                      $('#' + selectLineID + " .lineOrdered").val(1);
                      $('#' + selectLineID + " .lineQty").val(1);
                      $('#' + selectLineID + " .lineUnitPrice").val(lineUnitPrice);


                      if (lineTaxRate == "NT") {
                          lineTaxRate = "E";
                          $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                          if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                              $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                          }
                      } else {
                          $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                          if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                              $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                          }
                      }
                      $('#' + selectLineID + " .colUnitPrice").trigger("change");
                      $('#newProductModal').modal('toggle');
                      $('.fullScreenSpin').css('display','none');
                  }
              } else {
                  sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                      addVS1Data('TProductVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                          //location.reload();
                          $('#product-list').val(productName);
                          $('#newProductModal').modal('toggle');
                          $('.fullScreenSpin').css('display','none');
                      }).catch(function (err) {
                        $('#product-list').val(productName);
                          $('#newProductModal').modal('toggle');
                          $('.fullScreenSpin').css('display','none');
                      });
                  }).catch(function (err) {
                     $('#product-list').val(productName);
                      $('#newProductModal').modal('toggle');
                      $('.fullScreenSpin').css('display','none');
                  });
              }

              sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                  addVS1Data('TProductVS1', JSON.stringify(dataReload)).then(function (datareturn) {}).catch(function (err) {});
              }).catch(function (err) {

              });
            }).catch(function (err) {
              $('#newProductModal').modal('toggle');
              $('.fullScreenSpin').css('display','none');
                //$('.loginSpinner').css('display','none');

            });
        }else{
            productService.getCheckProductData(productName).then(function (data) {
                if(data.tproduct[0].Id != ''){
                    let productID = data.tproduct[0].Id;
                    currentID = parseInt(productID);
                    if((itrackThisItem == true) && ($("#sltinventoryacount").val() != '')){
                        objDetails = {
                            type:"TProductVS1",
                            fields:
                            {
                                ID:currentID,
                                Active:true,
                                ProductType:"INV",
                                PRODUCTCODE:productCode,
                                CUSTFLD1:customField1,
                                CUSTFLD2:customField2,
                                ProductPrintName:productName,
                                ProductName:productName,
                                PurchaseDescription:$("#txapurchasedescription").val(),
                                SalesDescription:$("#txasalesdescription").val(),
                                AssetAccount:$("#sltinventoryacount").val(),
                                CogsAccount:$("#sltcogsaccount").val(),
                                IncomeAccount:$("#sltsalesacount").val(),
                                BuyQty1Cost:parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0,
                                SellQty1Price:parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g,"")) || 0,
                                TaxCodePurchase:$("#slttaxcodepurchase").val(),
                                TaxCodeSales:$("#slttaxcodesales").val(),
                                UOMPurchases:defaultUOM,
                                UOMSales:defaultUOM,
                                Barcode:$("#edtbarcode").val(),
                                LockExtraSell: itrackThisItem,
                                ExtraSellPrice:lineExtaSellItems||null,
                                PublishOnVS1:true
                            }
                        };

                    }else{
                        objDetails = {
                            type:"TProductVS1",
                            fields:
                            {
                                ID:currentID,
                                Active:true,
                                ProductType:"NONINV",
                                PRODUCTCODE:productCode,
                                CUSTFLD1:customField1,
                                CUSTFLD2:customField2,
                                ProductPrintName:productName,
                                ProductName:productName,
                                PurchaseDescription:$("#txapurchasedescription").val(),
                                SalesDescription:$("#txasalesdescription").val(),
                                CogsAccount:$("#sltcogsaccount").val(),
                                IncomeAccount:$("#sltsalesacount").val(),
                                BuyQty1Cost:parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0,
                                SellQty1Price:parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g,"")) || 0,
                                TaxCodePurchase:$("#slttaxcodepurchase").val(),
                                TaxCodeSales:$("#slttaxcodesales").val(),
                                UOMPurchases:defaultUOM,
                                UOMSales:defaultUOM,
                                Barcode:$("#edtbarcode").val(),
                                LockExtraSell: itrackThisItem,
                                ExtraSellPrice:lineExtaSellItems||null,
                                PublishOnVS1:true
                            }
                        };
                    }

                    productService.saveProductVS1(objDetails).then(function (objDetails) {
                      var productSaveID = objDetails.fields.ID;
                      let linesave = objDetails.fields.ID;
                      if(itrackThisItem == false){
                        let objServiceDetails = {
                            type:"TServices",
                            fields:
                            {
                                ProductId:parseInt(linesave),
                                ServiceDesc:productName,
                                StandardRate:parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0,
                            }
                        };
                        productService.saveProductService(objServiceDetails).then(function (objServiceDetails) { });
                      };
                      var currentLoc = FlowRouter.current().route.path;

                      if (currentLoc == "/invoicecard" || currentLoc == "/quotecard" || currentLoc == "/salesordercard"|| currentLoc == "/refundcard") {
                          var selectLineID = $('#selectLineID').val();

                          if (selectLineID) {
                              var lineProductName = productName;
                              var lineProductDesc = $("#txasalesdescription").val();
                              var lineUnitPrice = parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0;
                              // var $tblrows = $("#tblInvoiceLine tbody tr");
                              var lineTaxCode = 0;
                              var lineAmount = 0;
                              var lineTaxAmount = 0;
                              var subGrandTotal = 0;
                              var taxGrandTotal = 0;
                              var taxGrandTotalPrint = 0;
                              var lineTaxRate = $("#slttaxcodesales").val() || "";
                              var taxRate = "";
                              $('#' + selectLineID + " .lineTaxCode").text($("#slttaxcodesales").val());
                              $('#' + selectLineID + " .lineProductName").val(lineProductName);
                              $('#' + selectLineID + " .colProductName").removeClass('boldtablealertsborder');
                              $('#' + selectLineID + " .lineProductName").attr("prodid", productSaveID);
                              $('#' + selectLineID + " .lineProductDesc").text(lineProductDesc);
                              $('#' + selectLineID + " .lineOrdered").val(1);
                              $('#' + selectLineID + " .lineQty").val(1);
                              $('#' + selectLineID + " .lineUnitPrice").val(lineUnitPrice);



                              if (lineTaxRate == "NT") {
                                  lineTaxRate = "E";
                                  $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                                  if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                                      $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                                  }
                              } else {
                                  $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                                  if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                                      $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                                  }
                              }

                              $('#' + selectLineID + " .colUnitPrice").trigger("change");
                              $('#newProductModal').modal('toggle');
                              $('.fullScreenSpin').css('display','none');
                          }
                      }else if (currentLoc == "/purchaseordercard") {
                          var selectLineID = $('#selectLineID').val();

                          if (selectLineID) {
                              var lineProductName = productName;
                              var lineProductDesc = $("#txasalesdescription").val();
                              var lineUnitPrice = parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0;
                              // var $tblrows = $("#tblInvoiceLine tbody tr");
                              var lineTaxCode = 0;
                              var lineAmount = 0;
                              var lineTaxAmount = 0;
                              var subGrandTotal = 0;
                              var taxGrandTotal = 0;
                              var taxGrandTotalPrint = 0;
                              var lineTaxRate = $("#slttaxcodepurchase").val() || "";
                              var taxRate = "";
                              $('#' + selectLineID + " .lineTaxCode").text($("#slttaxcodepurchase").val());
                              $('#' + selectLineID + " .lineProductName").val(lineProductName);
                              $('#' + selectLineID + " .colProductName").removeClass('boldtablealertsborder');
                              // $('#' + selectLineID + " .lineProductName").attr("prodid", productSaveID);
                              $('#' + selectLineID + " .lineProductDesc").text(lineProductDesc);
                              $('#' + selectLineID + " .lineOrdered").val(1);
                              $('#' + selectLineID + " .lineQty").val(1);
                              $('#' + selectLineID + " .lineUnitPrice").val(lineUnitPrice);


                              if (lineTaxRate == "NT") {
                                  lineTaxRate = "E";
                                  $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                                  if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                                      $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                                  }
                              } else {
                                  $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                                  if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                                      $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                                  }
                              }
                              $('#' + selectLineID + " .colUnitPrice").trigger("change");
                              $('#newProductModal').modal('toggle');
                              $('.fullScreenSpin').css('display','none');
                          }
                      } else {
                          sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                              addVS1Data('TProductVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                                  $('#product-list').val(productName);
                          $('#newProductModal').modal('toggle');
                              }).catch(function (err) {
                                  $('#product-list').val(productName);
                          $('#newProductModal').modal('toggle');
                              });
                          }).catch(function (err) {
                              $('#product-list').val(productName);
                          $('#newProductModal').modal('toggle');
                          });
                      }

                      sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                          addVS1Data('TProductVS1', JSON.stringify(dataReload)).then(function (datareturn) {}).catch(function (err) {});
                      }).catch(function (err) {});
                    }).catch(function (err) {
                      $('#newProductModal').modal('toggle');
                      $('.fullScreenSpin').css('display','none');
                        //$('.loginSpinner').css('display','none');

                    });
                }else{
                    if((itrackThisItem == true) && ($("#sltinventoryacount").val() != '')){
                        objDetails = {
                            type:"TProductVS1",
                            fields:
                            {
                                Active:true,
                                ProductType:"INV",
                                PRODUCTCODE:productCode,
                                CUSTFLD1:customField1,
                                CUSTFLD2:customField2,
                                ProductPrintName:productName,
                                ProductName:productName,
                                PurchaseDescription:$("#txapurchasedescription").val(),
                                SalesDescription:$("#txasalesdescription").val(),
                                AssetAccount:$("#sltinventoryacount").val(),
                                CogsAccount:$("#sltcogsaccount").val(),
                                IncomeAccount:$("#sltsalesacount").val(),
                                BuyQty1:parseFloat($("#edttotalqtyinstock1").val()) || 1 ,
                                BuyQty1Cost:parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0,
                                SellQty1:parseFloat($("#edttotalqtyinstock1").val()) || 1 ,
                                SellQty1Price:parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g,"")) || 0,
                                TaxCodePurchase:$("#slttaxcodepurchase").val(),
                                TaxCodeSales:$("#slttaxcodesales").val(),
                                UOMPurchases:defaultUOM,
                                UOMSales:defaultUOM,
                                Barcode:$("#edtbarcode").val(),
                                LockExtraSell: itrackThisItem,
                                ExtraSellPrice:lineExtaSellItems||null,
                                PublishOnVS1:true
                            }
                        };
                    }else{
                        objDetails = {
                            type:"TProductVS1",
                            fields:
                            {
                                Active:true,
                                ProductType:"NONINV",
                                PRODUCTCODE:productCode,
                                CUSTFLD1:customField1,
                                CUSTFLD2:customField2,
                                ProductPrintName:productName,
                                ProductName:productName,
                                PurchaseDescription:$("#txapurchasedescription").val(),
                                SalesDescription:$("#txasalesdescription").val(),
                                // AssetAccount:$("#sltinventoryacount").val(),
                                CogsAccount:$("#sltcogsaccount").val(),
                                IncomeAccount:$("#sltsalesacount").val(),
                                BuyQty1:parseFloat($("#edttotalqtyinstock1").val()) || 1 ,
                                BuyQty1Cost:parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0,
                                SellQty1:parseFloat($("#edttotalqtyinstock1").val()) || 1 ,
                                SellQty1Price:parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g,"")) || 0,
                                TaxCodePurchase:$("#slttaxcodepurchase").val(),
                                TaxCodeSales:$("#slttaxcodesales").val(),
                                UOMPurchases:defaultUOM,
                                UOMSales:defaultUOM,
                                Barcode:$("#edtbarcode").val(),
                                LockExtraSell: itrackThisItem,
                                ExtraSellPrice:lineExtaSellItems||null,
                                PublishOnVS1:true
                            }
                        };
                    }
                    productService.saveProductVS1(objDetails).then(function (objDetails) {
                      var productSaveID = objDetails.fields.ID;
                      let linesave = objDetails.fields.ID;
                      if(itrackThisItem == false){
                        let objServiceDetails = {
                            type:"TServices",
                            fields:
                            {
                                ProductId:parseInt(linesave),
                                ServiceDesc:productName,
                                StandardRate:parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0,
                            }
                        };
                        productService.saveProductService(objServiceDetails).then(function (objServiceDetails) { });
                      };
                      var currentLoc = FlowRouter.current().route.path;

                      if (currentLoc == "/invoicecard" || currentLoc == "/quotecard" || currentLoc == "/salesordercard"|| currentLoc == "/refundcard") {
                          var selectLineID = $('#selectLineID').val();

                          if (selectLineID) {
                              var lineProductName = productName;
                              var lineProductDesc = $("#txasalesdescription").val();
                              var lineUnitPrice = parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0;
                              // var $tblrows = $("#tblInvoiceLine tbody tr");
                              var lineTaxCode = 0;
                              var lineAmount = 0;
                              var lineTaxAmount = 0;
                              var subGrandTotal = 0;
                              var taxGrandTotal = 0;
                              var taxGrandTotalPrint = 0;
                              var lineTaxRate = $("#slttaxcodesales").val() || "";
                              var taxRate = "";
                              $('#' + selectLineID + " .lineTaxCode").text($("#slttaxcodesales").val());
                              $('#' + selectLineID + " .lineProductName").val(lineProductName);
                              $('#' + selectLineID + " .colProductName").removeClass('boldtablealertsborder');
                              $('#' + selectLineID + " .lineProductName").attr("prodid", productSaveID);
                              $('#' + selectLineID + " .lineProductDesc").text(lineProductDesc);
                              $('#' + selectLineID + " .lineOrdered").val(1);
                              $('#' + selectLineID + " .lineQty").val(1);
                              $('#' + selectLineID + " .lineUnitPrice").val(lineUnitPrice);



                              if (lineTaxRate == "NT") {
                                  lineTaxRate = "E";
                                  $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                                  if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                                      $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                                  }
                              } else {
                                  $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                                  if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                                      $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                                  }
                              }

                              $('#' + selectLineID + " .colUnitPrice").trigger("change");
                              $('#newProductModal').modal('toggle');
                              $('.fullScreenSpin').css('display','none');
                          }
                      }else if (currentLoc == "/purchaseordercard") {
                          var selectLineID = $('#selectLineID').val();

                          if (selectLineID) {
                              var lineProductName = productName;
                              var lineProductDesc = $("#txasalesdescription").val();
                              var lineUnitPrice = parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0;
                              // var $tblrows = $("#tblInvoiceLine tbody tr");
                              var lineTaxCode = 0;
                              var lineAmount = 0;
                              var lineTaxAmount = 0;
                              var subGrandTotal = 0;
                              var taxGrandTotal = 0;
                              var taxGrandTotalPrint = 0;
                              var lineTaxRate = $("#slttaxcodepurchase").val() || "";
                              var taxRate = "";
                              $('#' + selectLineID + " .lineTaxCode").text($("#slttaxcodepurchase").val());
                              $('#' + selectLineID + " .lineProductName").val(lineProductName);
                              $('#' + selectLineID + " .colProductName").removeClass('boldtablealertsborder');
                              // $('#' + selectLineID + " .lineProductName").attr("prodid", productSaveID);
                              $('#' + selectLineID + " .lineProductDesc").text(lineProductDesc);
                              $('#' + selectLineID + " .lineOrdered").val(1);
                              $('#' + selectLineID + " .lineQty").val(1);
                              $('#' + selectLineID + " .lineUnitPrice").val(lineUnitPrice);


                              if (lineTaxRate == "NT") {
                                  lineTaxRate = "E";
                                  $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                                  if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                                      $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                                  }
                              } else {
                                  $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                                  if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                                      $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                                  }
                              }
                              $('#' + selectLineID + " .colUnitPrice").trigger("change");
                              $('#newProductModal').modal('toggle');
                              $('.fullScreenSpin').css('display','none');
                          }
                      } else {
                          sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                              addVS1Data('TProductVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                                  $('#product-list').val(productName);
                          $('#newProductModal').modal('toggle');
                              }).catch(function (err) {
                                  $('#product-list').val(productName);
                          $('#newProductModal').modal('toggle');
                              });
                          }).catch(function (err) {
                              $('#product-list').val(productName);
                          $('#newProductModal').modal('toggle');
                          });
                      }

                      sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                          addVS1Data('TProductVS1', JSON.stringify(dataReload)).then(function (datareturn) {}).catch(function (err) {});
                      }).catch(function (err) {});
                    }).catch(function (err) {
                      $('#newProductModal').modal('toggle');
                      $('.fullScreenSpin').css('display','none');
                        //$('.loginSpinner').css('display','none');

                    });
                }

            }).catch(function (err) {
                if((itrackThisItem == true) && ($("#sltinventoryacount").val() != '')){
                    objDetails = {
                        type:"TProductVS1",
                        fields:
                        {
                            Active:true,
                            ProductType:"INV",
                            PRODUCTCODE:productCode,
                            CUSTFLD1:customField1,
                            CUSTFLD2:customField2,
                            ProductPrintName:productName,
                            ProductName:productName,
                            PurchaseDescription:$("#txapurchasedescription").val(),
                            SalesDescription:$("#txasalesdescription").val(),
                            AssetAccount:$("#sltinventoryacount").val(),
                            CogsAccount:$("#sltcogsaccount").val(),
                            IncomeAccount:$("#sltsalesacount").val(),
                            BuyQty1:parseFloat($("#edttotalqtyinstock1").val()) || 1 ,
                            BuyQty1Cost:parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0,
                            SellQty1:parseFloat($("#edttotalqtyinstock1").val()) || 1 ,
                            SellQty1Price:parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g,"")) || 0,
                            TaxCodePurchase:$("#slttaxcodepurchase").val(),
                            TaxCodeSales:$("#slttaxcodesales").val(),
                            UOMPurchases:defaultUOM,
                            UOMSales:defaultUOM,
                            Barcode:$("#edtbarcode").val(),
                            LockExtraSell: itrackThisItem,
                            ExtraSellPrice:lineExtaSellItems||null,
                            PublishOnVS1:true
                        }
                    };
                }else{
                    objDetails = {
                        type:"TProductVS1",
                        fields:
                        {
                            Active:true,
                            ProductType:"NONINV",
                            PRODUCTCODE:productCode,
                            CUSTFLD1:customField1,
                            CUSTFLD2:customField2,
                            ProductPrintName:productName,
                            ProductName:productName,
                            PurchaseDescription:$("#txapurchasedescription").val(),
                            SalesDescription:$("#txasalesdescription").val(),
                            // AssetAccount:$("#sltinventoryacount").val(),
                            CogsAccount:$("#sltcogsaccount").val(),
                            IncomeAccount:$("#sltsalesacount").val(),
                            BuyQty1:parseFloat($("#edttotalqtyinstock1").val()) || 1 ,
                            BuyQty1Cost:parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0,
                            SellQty1:parseFloat($("#edttotalqtyinstock1").val()) || 1 ,
                            SellQty1Price:parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g,"")) || 0,
                            TaxCodePurchase:$("#slttaxcodepurchase").val(),
                            TaxCodeSales:$("#slttaxcodesales").val(),
                            UOMPurchases:defaultUOM,
                            UOMSales:defaultUOM,
                            Barcode:$("#edtbarcode").val(),
                            LockExtraSell: itrackThisItem,
                            ExtraSellPrice:lineExtaSellItems||null,
                            PublishOnVS1:true
                        }
                    };
                }

                productService.saveProductVS1(objDetails).then(function (objDetails) {
                  var productSaveID = objDetails.fields.ID;
                  let linesave = objDetails.fields.ID;
                  if(itrackThisItem == false){
                    let objServiceDetails = {
                        type:"TServices",
                        fields:
                        {
                            ProductId:parseInt(linesave),
                            ServiceDesc:productName,
                            StandardRate:parseFloat($("#edtbuyqty1cost").val().replace(/[^0-9.-]+/g,"")) || 0,
                        }
                    };
                    productService.saveProductService(objServiceDetails).then(function (objServiceDetails) { });
                  };
                  var currentLoc = FlowRouter.current().route.path;

                  if (currentLoc == "/invoicecard" || currentLoc == "/quotecard" || currentLoc == "/salesordercard"|| currentLoc == "/refundcard") {
                      var selectLineID = $('#selectLineID').val();

                      if (selectLineID) {
                          var lineProductName = productName;
                          var lineProductDesc = $("#txasalesdescription").val();
                          var lineUnitPrice = parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0;
                          // var $tblrows = $("#tblInvoiceLine tbody tr");
                          var lineTaxCode = 0;
                          var lineAmount = 0;
                          var lineTaxAmount = 0;
                          var subGrandTotal = 0;
                          var taxGrandTotal = 0;
                          var taxGrandTotalPrint = 0;
                          var lineTaxRate = $("#slttaxcodesales").val() || "";
                          var taxRate = "";
                          $('#' + selectLineID + " .lineTaxCode").text($("#slttaxcodesales").val());
                          $('#' + selectLineID + " .lineProductName").val(lineProductName);
                          $('#' + selectLineID + " .colProductName").removeClass('boldtablealertsborder');
                          $('#' + selectLineID + " .lineProductName").attr("prodid", productSaveID);
                          $('#' + selectLineID + " .lineProductDesc").text(lineProductDesc);
                          $('#' + selectLineID + " .lineOrdered").val(1);
                          $('#' + selectLineID + " .lineQty").val(1);
                          $('#' + selectLineID + " .lineUnitPrice").val(lineUnitPrice);



                          if (lineTaxRate == "NT") {
                              lineTaxRate = "E";
                              $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                              if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                                  $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                              }
                          } else {
                              $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                              if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                                  $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                              }
                          }

                          $('#' + selectLineID + " .colUnitPrice").trigger("change");
                          $('#newProductModal').modal('toggle');
                          $('.fullScreenSpin').css('display','none');
                      }
                  }else if (currentLoc == "/purchaseordercard") {
                      var selectLineID = $('#selectLineID').val();

                      if (selectLineID) {
                          var lineProductName = productName;
                          var lineProductDesc = $("#txasalesdescription").val();
                          var lineUnitPrice = parseFloat($("#edtsellqty1price").val().replace(/[^0-9.-]+/g, "")) || 0;
                          // var $tblrows = $("#tblInvoiceLine tbody tr");
                          var lineTaxCode = 0;
                          var lineAmount = 0;
                          var lineTaxAmount = 0;
                          var subGrandTotal = 0;
                          var taxGrandTotal = 0;
                          var taxGrandTotalPrint = 0;
                          var lineTaxRate = $("#slttaxcodepurchase").val() || "";
                          var taxRate = "";
                          $('#' + selectLineID + " .lineTaxCode").text($("#slttaxcodepurchase").val());
                          $('#' + selectLineID + " .lineProductName").val(lineProductName);
                          $('#' + selectLineID + " .colProductName").removeClass('boldtablealertsborder');
                          // $('#' + selectLineID + " .lineProductName").attr("prodid", productSaveID);
                          $('#' + selectLineID + " .lineProductDesc").text(lineProductDesc);
                          $('#' + selectLineID + " .lineOrdered").val(1);
                          $('#' + selectLineID + " .lineQty").val(1);
                          $('#' + selectLineID + " .lineUnitPrice").val(lineUnitPrice);


                          if (lineTaxRate == "NT") {
                              lineTaxRate = "E";
                              $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                              if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                                  $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                              }
                          } else {
                              $('#' + selectLineID + " .lineTaxCode").text(lineTaxRate);

                              if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                                  $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                              }
                          }
                          $('#' + selectLineID + " .colUnitPrice").trigger("change");
                          $('#newProductModal').modal('toggle');
                          $('.fullScreenSpin').css('display','none');
                      }
                  } else {
                      sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                          addVS1Data('TProductVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                          $('#product-list').val(productName);
                          $('#newProductModal').modal('toggle');
                           $('.fullScreenSpin').css('display','none');
                          }).catch(function (err) {
                              $('#product-list').val(productName);
                          $('#newProductModal').modal('toggle');
                           $('.fullScreenSpin').css('display','none');
                          });
                      }).catch(function (err) {
                          $('#product-list').val(productName);
                          $('#newProductModal').modal('toggle');
                           $('.fullScreenSpin').css('display','none');
                      });
                  }

                  sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                      addVS1Data('TProductVS1', JSON.stringify(dataReload)).then(function (datareturn) {}).catch(function (err) {});
                  }).catch(function (err) {});
                }).catch(function (err) {
                  $('#newProductModal').modal('toggle');
                  $('.fullScreenSpin').css('display','none');
                    //$('.loginSpinner').css('display','none');

                });
            });



        }


    },
    'click .btnBack':function(event){
        event.preventDefault();
        history.back(1);
    },
    'click #chkTrack': function (event) {
        const templateObject = Template.instance();
        let cloudPackage = localStorage.getItem('vs1cloudlicenselevel');
        if(cloudPackage == "Simple Start"){
            $('#upgradeModal').modal('toggle');
            templateObject.isTrackChecked.set(false);
            event.preventDefault();
            return false;
        }else{
            let checkTracked = templateObject.isTrackChecked.get();
            if(checkTracked == true){
                swal('You cannot turn off tracking.', '', 'info');
                event.preventDefault();
                return false;
            }else{
                if($(event.target).is(':checked')){

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
      if($(event.target).is(':checked')){
        $('.trackCustomerTypeDisc').css('display','flex');
      }else{
        $('.trackCustomerTypeDisc').css('display','none');
      }
    },
    'click #formCheck-one': function (event) {
        if($(event.target).is(':checked')){
            $('.checkbox1div').css('display','block');
        }else{
            $('.checkbox1div').css('display','none');
        }
    },
    'click #formCheck-two': function (event) {
        if($(event.target).is(':checked')){
            $('.checkbox2div').css('display','block');
        }else{
            $('.checkbox2div').css('display','none');
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
    'click .btnSaveSettings': function(event){
        $('#myModal2').modal('toggle');
    },
    'click .btnResetSettings': function(event){
        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'productview'});
                if (checkPrefDetails) {
                    CloudPreference.remove({_id:checkPrefDetails._id}, function(err, idTag) {
                        if (err) {

                        }else{
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'keydown #edtbuyqty1cost, keydown #edtsellqty1price, keydown #edttotalqtyinstock, keydown .edtPriceEx, keydown .edtDiscount': function(event){
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

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190) {
        } else {
            event.preventDefault();
        }
    },
    'blur #edtbuyqty1cost':function () {

        let utilityService = new UtilityService();
        let costPrice= $('#edtbuyqty1cost').val();
        if (!isNaN(costPrice)){
            $('#edtbuyqty1cost').val(utilityService.modifynegativeCurrencyFormat(costPrice));
        }else{
            costPrice = Number($(event.target).val().replace(/[^0-9.-]+/g,""));
            $('#edtbuyqty1cost').val(utilityService.modifynegativeCurrencyFormat(costPrice));
        }

    },
    'blur #edtsellqty1price':function () {

        let utilityService = new UtilityService();
        let sellPrice= $('#edtsellqty1price').val();
        if (!isNaN(sellPrice)){
            $('#edtsellqty1price').val(utilityService.modifynegativeCurrencyFormat(sellPrice));
        }else{
            sellPrice = Number($(event.target).val().replace(/[^0-9.-]+/g,""));
            $('#edtsellqty1price').val(utilityService.modifynegativeCurrencyFormat(sellPrice));
        }

    },
    'click .btnDeleteInv': function(event){
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
                $('.fullScreenSpin').css('display','inline-block');

                var getprod_id = $('#selectProductID').val();
                var currentProduct = getprod_id;
                var objDetails = '';
                if(getprod_id != ''){
                    currentProduct = parseInt(currentProduct);
                    var objDetails = {
                        type: "TProduct",
                        fields: {
                            ID: currentProduct,
                            Active: "True",
                            PublishOnVS1:false
                        }
                    };

                    productService.saveProduct(objDetails).then(function (objDetails) {
                        location.reload();
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
                            } else if (result.dismiss === 'cancel') {

                            }
                        });

                    });
                }else{
                    location.reload();
                }

            } else if (result.dismiss === 'cancel') {
                window.open('/inventorylist', "_self");
            } else {

            }
        });


    },
    'click .btnUpgradeToEssentials':function(event){
        window.open('/companyappsettings','_self');
    },
    'click .addClientType': function (event) {
            $('#myModalClientType').modal();
    },
    'click .addRowLine': function () {

      var itemDataClone = $('.itemExtraSellRow:first');
      var itemDataCloneLast = $('.itemExtraSellRow:last');
      let tokenid = Random.id();
      var itemClineID = itemDataClone.clone().prop('id', tokenid );
      itemClineID.find('input[type="text"]').val('');
      itemClineID.find('select[name^="sltCustomerType"]').val('');
      itemClineID.insertAfter(".itemExtraSellRow:last");
      // $('.itemExtraSellRow:first').clone().insertAfter(".itemExtraSellRow:last");
    },
    'click .btnRemove': function (event) {
      let templateObject = Template.instance();
      var targetID = $(event.target).closest('.itemExtraSellRow').attr('id');
      if ($('.itemExtraSellRow').length > 1) {
        $("#"+targetID).remove();
      }

    },
    'blur .edtDiscount':function (event) {
        let utilityService = new UtilityService();
        let templateObject = Template.instance();
        var targetID = $(event.target).closest('.itemExtraSellRow').attr('id');
        let itemSellPrice = parseFloat($('#edtsellqty1price').val().replace(/[^0-9.-]+/g, "")) || 0;
        let discountPrice= parseFloat($(event.target).val()) || 0;
        let getDiscountPrice = (itemSellPrice - ( itemSellPrice * discountPrice / 100 ));
        $("#"+targetID+ ' .edtPriceEx').val(utilityService.modifynegativeCurrencyFormat(getDiscountPrice)||0);

    },
    'blur .edtPriceEx':function (event) {
        let utilityService = new UtilityService();
        if (!isNaN($(event.target).val())) {
            let inputUnitPrice = parseFloat($(event.target).val()) ||0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, ""))||0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        }
        let templateObject = Template.instance();
        var targetID = $(event.target).closest('.itemExtraSellRow').attr('id');
        let itemSellPrice = parseFloat($('#edtsellqty1price').val().replace(/[^0-9.-]+/g, "")) || 0;
        let discountPrice= parseFloat($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
        let getDiscountRate = 100 - (discountPrice * 100 / itemSellPrice);
        $("#"+targetID+ ' .edtDiscount').val(getDiscountRate||0);

    }

});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});
