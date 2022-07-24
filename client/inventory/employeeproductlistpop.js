import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { DashBoardService } from "../Dashboard/dashboard-service";
import { UtilityService } from "../utility-service";
import {ProductService} from "../product/product-service";
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import { Random } from 'meteor/random';
import { jsPDF } from 'jspdf';
import 'jQuery.print/jQuery.print.js';
import { autoTable } from 'jspdf-autotable';
import 'jquery-editable-select';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.employeeproductlistpop.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.CleintName = new ReactiveVar();
    templateObject.Department = new ReactiveVar();
    templateObject.Date = new ReactiveVar();
    templateObject.DueDate = new ReactiveVar();
    templateObject.InvoiceNo = new ReactiveVar();
    templateObject.RefNo = new ReactiveVar();
    templateObject.Branding = new ReactiveVar();
    templateObject.Currency = new ReactiveVar();
    templateObject.Total = new ReactiveVar();
    templateObject.Subtotal = new ReactiveVar();
    templateObject.TotalTax = new ReactiveVar();
    templateObject.invoicerecord = new ReactiveVar({});
    templateObject.taxrateobj = new ReactiveVar();
    templateObject.Accounts = new ReactiveVar([]);
    templateObject.InvoiceId = new ReactiveVar();
    templateObject.selectedCurrency = new ReactiveVar([]);
    templateObject.inputSelectedCurrency = new ReactiveVar([]);
    templateObject.currencySymbol = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.termrecords = new ReactiveVar();
    templateObject.clientrecords = new ReactiveVar([]);
    templateObject.taxraterecords = new ReactiveVar([]);
    templateObject.record = new ReactiveVar({});
    templateObject.accountID = new ReactiveVar();
    templateObject.stripe_fee_method = new ReactiveVar()
    /* Attachments */
    templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();

    templateObject.address = new ReactiveVar();
    templateObject.abn = new ReactiveVar();
    templateObject.referenceNumber = new ReactiveVar();
    templateObject.statusrecords = new ReactiveVar([]);

    templateObject.includeBOnShippedQty = new ReactiveVar();
    templateObject.includeBOnShippedQty.set(true);
    templateObject.productextrasellrecords = new ReactiveVar([]);

});

Template.employeeproductlistpop.onRendered(function () {
    let tempObj = Template.instance();
    let utilityService = new UtilityService();
    let productService = new ProductService();
    let tableProductList;
    var splashArrayProductList = new Array();
    var splashArrayTaxRateList = new Array();
    const taxCodesList = [];
    const lineExtaSellItems = [];
    var currentLoc = FlowRouter.current().route.path;
    tempObj.getAllProducts = function () {
        getVS1Data('TProductWeb').then(function (dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getProductServiceListVS1(initialBaseDataLoad,0).then(function (data) {
                    addVS1Data('TProductWeb',JSON.stringify(data));
                    let records = [];
                    let inventoryData = [];
                    for (let i = 0; i < data.tproductvs1.length; i++) {

                      if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
                          for (let e = 0; e < data.tproductvs1[i].fields.ExtraSellPrice.length; e++) {
                              let lineExtaSellObj = {
                                  clienttype: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                                  productname: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ProductName || data.tproductvs1[i].fields.ProductName,
                                  price: utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.ExtraSellPrice[e].fields.Price1) || 0,
                                  qtypercent: data.tproductvs1[i].fields.QtyPercent1 ||0,

                              };
                              lineExtaSellItems.push(lineExtaSellObj);

                          }
                      }
                        var dataList = [
                             '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tproductvs1[i].fields.ID+'"></label></div>',
                            data.tproductvs1[i].fields.ProductName || '-',
                            data.tproductvs1[i].fields.SalesDescription || '',
                            data.tproductvs1[i].fields.BARCODE || '',
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                            data.tproductvs1[i].fields.TotalQtyInStock,
                            data.tproductvs1[i].fields.TaxCodeSales || '',
                            data.tproductvs1[i].fields.ID || '',
                            JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,

                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1PriceInc * 100) / 100)
                        ];


                        splashArrayProductList.push(dataList);

                    }
                    //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

                    if (splashArrayProductList) {

                      $('#tblInventoryService').dataTable({
                          data: splashArrayProductList,

                          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                          columnDefs: [
                              {
                                  className: "chkBox pointer",
                                  "orderable": false,
                                  "targets": [0]

                              },
                              {
                                  className: "productName",
                                  "targets": [1]
                              }, {
                                  className: "productDesc",
                                  "targets": [2]
                              }, {
                                  className: "colBarcode",
                                  "targets": [3]
                              }, {
                                  className: "costPrice text-right",
                                  "targets": [4]
                              }, {
                                  className: "salePrice text-right",
                                  "targets": [5]
                              }, {
                                  className: "prdqty text-right",
                                  "targets": [6]
                              }, {
                                  className: "taxrate",
                                  "targets": [7]
                              }, {
                                  className: "colProuctPOPID hiddenColumn",
                                  "targets": [8]
                              }, {
                                  className: "colExtraSellPrice hiddenColumn",
                                  "targets": [9]
                              }, {
                                  className: "salePriceInc hiddenColumn",
                                  "targets": [10]
                              }
                          ],
                          select: true,
                          destroy: true,
                          colReorder: true,
                          pageLength: initialDatatableLoad,
                          lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                          info: true,
                          responsive: true,
                          "order": [[ 1, "asc" ]],
                          "fnDrawCallback": function (oSettings) {
                              $('.paginate_button.page-item').removeClass('disabled');
                              $('#tblInventoryService_ellipsis').addClass('disabled');

                              if (oSettings._iDisplayLength == -1) {
                                  if (oSettings.fnRecordsDisplay() > 150) {

                                  }
                              } else {

                              }
                              if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                                  $('.paginate_button.page-item.next').addClass('disabled');
                              }

                              $('.paginate_button.next:not(.disabled)', this.api().table().container())
                                  .on('click', function () {
                                      $('.fullScreenSpin').css('display', 'inline-block');
                                      let dataLenght = oSettings._iDisplayLength;
                                      let customerSearch = $('#tblInventoryService_filter input').val();

                                      sideBarService.getProductServiceListVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                        for(let i=0; i<dataObjectnew.tproductvs1.length; i++){

                                           var dataListDupp = [
                                             '<div class="custom-control custom-checkbox chkBox pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tproductvs1[i].fields.ID+'"></label></div>',
                                             data.tproductvs1[i].fields.ProductName || '-',
                                             data.tproductvs1[i].fields.SalesDescription || '',
                                             utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                                             utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                                             data.tproductvs1[i].fields.TotalQtyInStock,
                                             data.tproductvs1[i].fields.TaxCodeSales || '',
                                             data.tproductvs1[i].fields.ID || '',
                                             JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,
                                             data.tproductvs1[i].fields.BARCODE || ''
                                         ];
                                         splashArrayProductList.push(dataListDupp);

                                        }

                                                  let uniqueChars = [...new Set(splashArrayProductList)];
                                                  var datatable = $('#tblInventoryService').DataTable();
                                                  datatable.clear();
                                                  datatable.rows.add(uniqueChars);
                                                  datatable.draw(false);
                                                  setTimeout(function () {
                                                    $("#tblInventoryService").dataTable().fnPageChange('last');
                                                  }, 400);

                                                  $('.fullScreenSpin').css('display', 'none');


                                      }).catch(function (err) {
                                          $('.fullScreenSpin').css('display', 'none');
                                      });

                                  });
                          },
                          "fnInitComplete": function () {
                              $("<a class='btn btn-primary scanProdServiceBarcodePOP' href='' id='scanProdServiceBarcodePOP' role='button' style='margin-left: 8px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>").insertAfter("#tblInventoryService_filter");
                              $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblInventoryService_filter");
                              $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventoryService_filter");
                          }


                      }).on('length.dt', function (e, settings, len) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        let dataLenght = settings._iDisplayLength;
                        // splashArrayProductList = [];
                        if (dataLenght == -1) {
                          $('.fullScreenSpin').css('display', 'none');
                        }else{
                          if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                              $('.fullScreenSpin').css('display', 'none');
                          } else {

                              $('.fullScreenSpin').css('display', 'none');
                          }

                        }

                      });

                        $('div.dataTables_filter input').addClass('form-control form-control-sm');

                    }
                })
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tproductvs1;
                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.tproductvs1.length; i++) {

                  if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
                      for (let e = 0; e < data.tproductvs1[i].fields.ExtraSellPrice.length; e++) {
                          let lineExtaSellObj = {
                              clienttype: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                              productname: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ProductName || data.tproductvs1[i].fields.ProductName,
                              price: utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.ExtraSellPrice[e].fields.Price1) || 0,
                              qtypercent: data.tproductvs1[i].fields.QtyPercent1 ||0,

                          };
                          lineExtaSellItems.push(lineExtaSellObj);

                      }
                  }
                    var dataList = [
                        '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tproductvs1[i].fields.ID+'"></label></div>',
                        data.tproductvs1[i].fields.ProductName || '-',
                        data.tproductvs1[i].fields.SalesDescription || '',
                        data.tproductvs1[i].fields.BARCODE || '',
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                        data.tproductvs1[i].fields.TotalQtyInStock,
                        data.tproductvs1[i].fields.TaxCodeSales || '',
                        data.tproductvs1[i].fields.ID || '',
                        JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,

                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1PriceInc * 100) / 100)
                    ];


                    // splashArrayProductList.push(dataList);

                      splashArrayProductList.push(dataList);

                }

                tempObj.productextrasellrecords.set(lineExtaSellItems);
                //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));
                if (splashArrayProductList) {

                    $('#tblInventoryService').dataTable({
                        data: splashArrayProductList,

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                        columnDefs: [
                            {
                                className: "chkBox pointer",
                                "orderable": false,
                                "targets": [0]

                            },
                            {
                                className: "productName",
                                "targets": [1]
                            }, {
                                className: "productDesc",
                                "targets": [2]
                            }, {
                                className: "colBarcode",
                                "targets": [3]
                            }, {
                                className: "costPrice text-right",
                                "targets": [4]
                            }, {
                                className: "salePrice text-right",
                                "targets": [5]
                            }, {
                                className: "prdqty text-right",
                                "targets": [6]
                            }, {
                                className: "taxrate",
                                "targets": [7]
                            }, {
                                className: "colProuctPOPID hiddenColumn",
                                "targets": [8]
                            }, {
                                className: "colExtraSellPrice hiddenColumn",
                                "targets": [9]
                            }, {
                                className: "salePriceInc hiddenColumn",
                                "targets": [10]
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 1, "asc" ]],
                        "fnDrawCallback": function (oSettings) {
                            $('.paginate_button.page-item').removeClass('disabled');
                            $('#tblInventoryService_ellipsis').addClass('disabled');
                            if (oSettings._iDisplayLength == -1) {
                                if (oSettings.fnRecordsDisplay() > 150) {

                                }
                            } else {

                            }
                            if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                                $('.paginate_button.page-item.next').addClass('disabled');
                            }

                            $('.paginate_button.next:not(.disabled)', this.api().table().container())
                                .on('click', function () {

                                    $('.fullScreenSpin').css('display', 'inline-block');
                                    let dataLenght = oSettings._iDisplayLength;
                                    let customerSearch = $('#tblInventoryService_filter input').val();

                                    sideBarService.getProductServiceListVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
                                      for(let i=0; i<dataObjectnew.tproductvs1.length; i++){

                                         var dataListDupp = [
                                          '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+dataObjectnew.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+dataObjectnew.tproductvs1[i].fields.ID+'"></label></div>',
                                           dataObjectnew.tproductvs1[i].fields.ProductName || '-',
                                           dataObjectnew.tproductvs1[i].fields.SalesDescription || '',
                                           dataObjectnew.tproductvs1[i].fields.BARCODE || '',
                                           utilityService.modifynegativeCurrencyFormat(Math.floor(dataObjectnew.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                                           utilityService.modifynegativeCurrencyFormat(Math.floor(dataObjectnew.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                                           dataObjectnew.tproductvs1[i].fields.TotalQtyInStock,
                                           dataObjectnew.tproductvs1[i].fields.TaxCodeSales || '',
                                           dataObjectnew.tproductvs1[i].fields.ID || '',
                                           JSON.stringify(dataObjectnew.tproductvs1[i].fields.ExtraSellPrice)||null,

                                           utilityService.modifynegativeCurrencyFormat(Math.floor(dataObjectnew.tproductvs1[i].fields.SellQty1PriceInc * 100) / 100)
                                       ];
                                       splashArrayProductList.push(dataListDupp);

                                      }
                                                let uniqueChars = [...new Set(splashArrayProductList)];
                                                var datatable = $('#tblInventoryService').DataTable();
                                                datatable.clear();
                                                datatable.rows.add(uniqueChars);
                                                datatable.draw(false);
                                                setTimeout(function () {
                                                  $("#tblInventoryService").dataTable().fnPageChange('last');
                                                }, 400);

                                                $('.fullScreenSpin').css('display', 'none');


                                    }).catch(function (err) {
                                        $('.fullScreenSpin').css('display', 'none');
                                    });

                                });
                            // setTimeout(function () {
                            //     MakeNegative();
                            // }, 100);
                        },
                        "fnInitComplete": function () {
                            $("<a class='btn btn-primary scanProdServiceBarcodePOP' href='' id='scanProdServiceBarcodePOP' role='button' style='margin-left: 8px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>").insertAfter("#tblInventoryService_filter");
                            $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblInventoryService_filter");
                            $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventoryService_filter");
                        }


                    }).on('length.dt', function (e, settings, len) {
                      $('.fullScreenSpin').css('display', 'inline-block');
                      let dataLenght = settings._iDisplayLength;
                      // splashArrayProductList = [];
                      if (dataLenght == -1) {
                        $('.fullScreenSpin').css('display', 'none');
                      }else{
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {

                            $('.fullScreenSpin').css('display', 'none');
                        }

                      }

                    });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');
                }
            }
        }).catch(function (err) {
            sideBarService.getProductServiceListVS1(initialBaseDataLoad,0).then(function (data) {
                addVS1Data('TProductWeb',JSON.stringify(data));
                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.tproductvs1.length; i++) {

                  if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
                      for (let e = 0; e < data.tproductvs1[i].fields.ExtraSellPrice.length; e++) {
                          let lineExtaSellObj = {
                              clienttype: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                              productname: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ProductName || data.tproductvs1[i].fields.ProductName,
                              price: utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.ExtraSellPrice[e].fields.Price1) || 0,
                              qtypercent: data.tproductvs1[i].fields.QtyPercent1 ||0,

                          };
                          lineExtaSellItems.push(lineExtaSellObj);

                      }
                  }
                    var dataList = [
                        '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tproductvs1[i].fields.ID+'"></label></div>',
                        data.tproductvs1[i].fields.ProductName || '-',
                        data.tproductvs1[i].fields.SalesDescription || '',
                        data.tproductvs1[i].fields.BARCODE || '',
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                        data.tproductvs1[i].fields.TotalQtyInStock,
                        data.tproductvs1[i].fields.TaxCodeSales || '',
                        data.tproductvs1[i].fields.ID || '',
                        JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,

                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1PriceInc * 100) / 100)
                    ];



                      splashArrayProductList.push(dataList);

                }
                //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

                if (splashArrayProductList) {

                  $('#tblInventoryService').dataTable({
                      data: splashArrayProductList,

                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                      columnDefs: [
                          {
                              className: "chkBox pointer",
                              "orderable": false,
                              "targets": [0]

                          },
                          {
                              className: "productName",
                              "targets": [1]
                          }, {
                              className: "productDesc",
                              "targets": [2]
                          }, {
                              className: "colBarcode",
                              "targets": [3]
                          }, {
                              className: "costPrice text-right",
                              "targets": [4]
                          }, {
                              className: "salePrice text-right",
                              "targets": [5]
                          }, {
                              className: "prdqty text-right",
                              "targets": [6]
                          }, {
                              className: "taxrate",
                              "targets": [7]
                          }, {
                              className: "colProuctPOPID hiddenColumn",
                              "targets": [8]
                          }, {
                              className: "colExtraSellPrice hiddenColumn",
                              "targets": [9]
                          }, {
                              className: "salePriceInc hiddenColumn",
                              "targets": [10]
                          }
                      ],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      pageLength: initialDatatableLoad,
                      lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                      info: true,
                      responsive: true,
                      "order": [[ 1, "asc" ]],
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblInventoryService_ellipsis').addClass('disabled');
                          if (oSettings._iDisplayLength == -1) {
                              if (oSettings.fnRecordsDisplay() > 150) {

                              }
                          } else {

                          }
                          if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }

                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                              .on('click', function () {

                                  $('.fullScreenSpin').css('display', 'inline-block');
                                  let dataLenght = oSettings._iDisplayLength;
                                  let customerSearch = $('#tblInventoryService_filter input').val();

                                  sideBarService.getProductServiceListVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                    for(let i=0; i<dataObjectnew.tproductvs1.length; i++){

                                      var dataListDupp = [
                                       '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+dataObjectnew.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+dataObjectnew.tproductvs1[i].fields.ID+'"></label></div>',
                                        dataObjectnew.tproductvs1[i].fields.ProductName || '-',
                                        dataObjectnew.tproductvs1[i].fields.SalesDescription || '',
                                        dataObjectnew.tproductvs1[i].fields.BARCODE || '',
                                        utilityService.modifynegativeCurrencyFormat(Math.floor(dataObjectnew.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                                        utilityService.modifynegativeCurrencyFormat(Math.floor(dataObjectnew.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                                        dataObjectnew.tproductvs1[i].fields.TotalQtyInStock,
                                        dataObjectnew.tproductvs1[i].fields.TaxCodeSales || '',
                                        dataObjectnew.tproductvs1[i].fields.ID || '',
                                        JSON.stringify(dataObjectnew.tproductvs1[i].fields.ExtraSellPrice)||null,

                                        utilityService.modifynegativeCurrencyFormat(Math.floor(dataObjectnew.tproductvs1[i].fields.SellQty1PriceInc * 100) / 100)
                                    ];
                                     splashArrayProductList.push(dataListDupp);

                                    }

                                              let uniqueChars = [...new Set(splashArrayProductList)];
                                              var datatable = $('#tblInventoryService').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblInventoryService").dataTable().fnPageChange('last');
                                              }, 400);

                                              $('.fullScreenSpin').css('display', 'none');


                                  }).catch(function (err) {
                                      $('.fullScreenSpin').css('display', 'none');
                                  });

                              });
                          // setTimeout(function () {
                          //     MakeNegative();
                          // }, 100);
                      },
                      "fnInitComplete": function () {
                          $("<a class='btn btn-primary scanProdServiceBarcodePOP' href='' id='scanProdServiceBarcodePOP' role='button' style='margin-left: 8px; height:32px;padding: 4px 10px;'><i class='fas fa-camera'></i></a>").insertAfter("#tblInventoryService_filter");
                          $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblInventoryService_filter");
                          $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventoryService_filter");
                      }


                  }).on('length.dt', function (e, settings, len) {
                    $('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    // splashArrayProductList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');
                    }else{
                      if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                          $('.fullScreenSpin').css('display', 'none');
                      } else {

                          $('.fullScreenSpin').css('display', 'none');
                      }

                    }

                  });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');

                }
            })
        });

    };

    tempObj.getAllProducts();

    function onScanSuccessProdModal(decodedText, decodedResult) {
        var barcodeScannerProdModal = decodedText.toUpperCase();
        $('#scanBarcodeModalProduct').modal('toggle');
        if (barcodeScannerProdModal != '') {
            setTimeout(function() {
              $('#tblInventoryService .form-control-sm').val(barcodeScannerProdModal);
              $('#tblInventoryService .form-control-sm').trigger("input");
            }, 200);


        }
    }


    var html5QrcodeScannerProdModal = new Html5QrcodeScanner(
        "qr-reader-productmodal", {
            fps: 10,
            qrbox: 250,
            rememberLastUsedCamera: true
        });
    html5QrcodeScannerProdModal.render(onScanSuccessProdModal);

});

Template.employeeproductlistpop.events({
  'keyup #tblInventoryService_filter input': function (event) {
    if (event.keyCode == 13) {
       $(".btnRefreshProduct").trigger("click");
    }
  },
  'click .btnRefreshProduct':function(event){
    let templateObject = Template.instance();
    let utilityService = new UtilityService();
  let productService = new ProductService();
  var currentLoc = FlowRouter.current().route.path;
  //let salesService = new SalesBoardService();
  let tableProductList;
  var splashArrayProductList = new Array();
  var splashArrayTaxRateList = new Array();
  const taxCodesList = [];
  const lineExtaSellItems = [];
    $('.fullScreenSpin').css('display', 'inline-block');
    let dataSearchName = $('#tblInventoryService_filter input').val();
    if(dataSearchName.replace(/\s/g, '') != ''){
    sideBarService.getProductServiceListVS1ByName(dataSearchName).then(function (data) {
        let records = [];

        let inventoryData = [];
        if(data.tproductvs1.length > 0){
        for (let i = 0; i < data.tproductvs1.length; i++) {
            var dataList = [
                '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tproductvs1[i].fields.ID+'"></label></div>',
                data.tproductvs1[i].fields.ProductName || '-',
                data.tproductvs1[i].fields.SalesDescription || '',
                data.tproductvs1[i].fields.BARCODE || '',
                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                data.tproductvs1[i].fields.TotalQtyInStock,
                data.tproductvs1[i].fields.TaxCodeSales || '',
                data.tproductvs1[i].fields.ID || '',
                JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,

                utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1PriceInc * 100) / 100)
            ];

            if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
                for (let e = 0; e < data.tproductvs1[i].fields.ExtraSellPrice.length; e++) {
                    let lineExtaSellObj = {
                        clienttype: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                        productname: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ProductName || data.tproductvs1[i].fields.ProductName,
                        price: utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.ExtraSellPrice[e].fields.Price1) || 0
                    };
                    lineExtaSellItems.push(lineExtaSellObj);

                }
            }

              splashArrayProductList.push(dataList);

        }
        //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));
        $('.fullScreenSpin').css('display', 'none');
        if (splashArrayProductList) {
          var datatable = $('#tblInventoryService').DataTable();
          datatable.clear();
          datatable.rows.add(splashArrayProductList);
          datatable.draw(false);

        }
        }else{
          $('.fullScreenSpin').css('display', 'none');
          $('#productListModal').modal('toggle');
          swal({
          title: 'Question',
          text: "Product does not exist, would you like to create it?",
          type: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
          }).then((result) => {
          if (result.value) {
            $('#newProductModal').modal('toggle');
            $('#edtproductname').val(dataSearchName);
          } else if (result.dismiss === 'cancel') {
            $('#productListModal').modal('toggle');
          }
          });
        }
    }).catch(function (err) {
      $('.fullScreenSpin').css('display', 'none');
    });
  }else{
    sideBarService.getProductServiceListVS1(initialBaseDataLoad,0).then(function (data) {
          let records = [];
          let inventoryData = [];
          for (let i = 0; i < data.tproductvs1.length; i++) {
              var dataList = [
                  '<div class="custom-control custom-checkbox chkBox chkBoxService pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.tproductvs1[i].fields.ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tproductvs1[i].fields.ID+'"></label></div>',
                  data.tproductvs1[i].fields.ProductName || '-',
                  data.tproductvs1[i].fields.SalesDescription || '',
                  data.tproductvs1[i].fields.BARCODE || '',
                  utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.BuyQty1Cost * 100) / 100),
                  utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1Price * 100) / 100),
                  data.tproductvs1[i].fields.TotalQtyInStock,
                  data.tproductvs1[i].fields.TaxCodeSales || '',
                  data.tproductvs1[i].fields.ID || '',
                  JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null,

                  utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].fields.SellQty1PriceInc * 100) / 100)
              ];

              if (data.tproductvs1[i].fields.ExtraSellPrice != null) {
                  for (let e = 0; e < data.tproductvs1[i].fields.ExtraSellPrice.length; e++) {
                      let lineExtaSellObj = {
                          clienttype: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ClientTypeName || '',
                          productname: data.tproductvs1[i].fields.ExtraSellPrice[e].fields.ProductName || data.tproductvs1[i].fields.ProductName,
                          price: utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.ExtraSellPrice[e].fields.Price1) || 0
                      };
                      lineExtaSellItems.push(lineExtaSellObj);

                  }
              }

                splashArrayProductList.push(dataList);

          }
          //localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));
          $('.fullScreenSpin').css('display', 'none');
          if (splashArrayProductList) {
            var datatable = $('#tblInventoryService').DataTable();
            datatable.clear();
            datatable.rows.add(splashArrayProductList);
            datatable.draw(false);


          }
      }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
      });
  }
  },
  'click #productListModal #refreshpagelist': function () {
      $('.fullScreenSpin').css('display', 'inline-block');
      localStorage.setItem('VS1SalesProductList', '');
      let templateObject = Template.instance();
      Meteor._reload.reload();
      templateObject.getAllProducts();

  },
  'click .scanProdBarcodePOP': function(event) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('#scanBarcodeModalProduct').modal('toggle');
      } else {
          Bert.alert('<strong>Please Note:</strong> This function is only available on mobile devices!', 'now-dangerorange');
      }
  },
  'click .btnCloseProdModal': function(event) {
      $('#scanBarcodeModalProduct').modal('toggle');
  }
});
