import {
    SalesBoardService
} from './sales-service';
import {
    PurchaseBoardService
} from './purchase-service';
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CoreService
} from '../js/core-service';
import {
    DashBoardService
} from "../Dashboard/dashboard-service";
import {
    UtilityService
} from "../utility-service";
import {
    ProductService
} from "../product/product-service";
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import {
    Random
} from 'meteor/random';
import {
    jsPDF
} from 'jspdf';
import 'jQuery.print/jQuery.print.js';
import {
    autoTable
} from 'jspdf-autotable';
import {
    SideBarService
} from '../js/sidebar-service';

import 'jquery-editable-select';
let utilityService = new UtilityService();
let sideBarService = new SideBarService();
var times = 0;
let purchaseDefaultTerms = "";
Template.purchaseordercard.onCreated(() => {

    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.CleintName = new ReactiveVar();
    templateObject.Department = new ReactiveVar();
    templateObject.Date = new ReactiveVar();
    templateObject.DueDate = new ReactiveVar();
    templateObject.PurchaseOrderNo = new ReactiveVar();
    templateObject.RefNo = new ReactiveVar();
    templateObject.Branding = new ReactiveVar();
    templateObject.Currency = new ReactiveVar();
    templateObject.Total = new ReactiveVar();
    templateObject.Subtotal = new ReactiveVar();
    templateObject.TotalTax = new ReactiveVar();
    templateObject.purchaseorderrecord = new ReactiveVar({});
    templateObject.taxrateobj = new ReactiveVar();
    templateObject.Accounts = new ReactiveVar([]);
    templateObject.PurchaseOrderId = new ReactiveVar();
    templateObject.selectedCurrency = new ReactiveVar([]);
    templateObject.inputSelectedCurrency = new ReactiveVar([]);
    templateObject.currencySymbol = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.viarecords = new ReactiveVar();
    templateObject.termrecords = new ReactiveVar();
    templateObject.clientrecords = new ReactiveVar([]);
    templateObject.taxraterecords = new ReactiveVar([]);
    templateObject.datatablerecords = new ReactiveVar([]);

    templateObject.selectedsupplierpayrecords = new ReactiveVar([]);

    templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();

    templateObject.address = new ReactiveVar();
    templateObject.abn = new ReactiveVar();
    templateObject.referenceNumber = new ReactiveVar();

    templateObject.statusrecords = new ReactiveVar([]);

    templateObject.includeBOnShippedQty = new ReactiveVar();
    templateObject.includeBOnShippedQty.set(true);
});
Template.purchaseordercard.onRendered(() => {
    $(window).on('load', function () {
        var win = $(this); //this = window
        if (win.width() <= 1024 && win.width() >= 450) {
            $("#colBalanceDue").addClass("order-12");
        }

        if (win.width() <= 926) {
            $("#totalSection").addClass("offset-md-6");
        }

    });
    let imageData = (localStorage.getItem("Image"));
    if (imageData) {
        $('.uploadedImage').attr('src', imageData);
    };
    const templateObject = Template.instance();
    const records = [];
    let purchaseService = new PurchaseBoardService();
    let clientsService = new PurchaseBoardService();
    let productsService = new PurchaseBoardService();
    const clientList = [];
    const productsList = [];
    const accountsList = [];
    const deptrecords = [];
    const viarecords = [];
    const termrecords = [];
    const statusList = [];
    const dataTableList = [];

    let isBOnShippedQty = Session.get('CloudPurchaseQtyOnly');
    if (isBOnShippedQty) {
        templateObject.includeBOnShippedQty.set(false);
    }

    $("#date-input,#dtSODate,#dtDueDate").datepicker({
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


  //   jQuery(document).ready(function($) {

  //       if (window.history && window.history.pushState) {

  //   window.history.pushState('forward', null, FlowRouter.current().path);

  //   $(window).on('popstate', function() {
  //     swal({
  //              title: 'Save Or Cancel To Continue',
  //             text: "Do you want to Save or Cancel this transaction?",
  //             type: 'question',
  //             showCancelButton: true,
  //             confirmButtonText: 'Save'
  //         }).then((result) => {
  //             if (result.value) {
  //                 $(".btnSave").trigger("click");
  //             } else if (result.dismiss === 'cancel') {
  //                 let lastPageVisitUrl = window.location.pathname;
  //                 if (FlowRouter.current().oldRoute) {
  //                     lastPageVisitUrl = FlowRouter.current().oldRoute.path;
  //                 } else {
  //                     lastPageVisitUrl = window.location.pathname;
  //                 }
  //                //FlowRouter.go(lastPageVisitUrl);
  //                 window.open(lastPageVisitUrl, '_self');
  //             } else {}
  //         });
  //   });

  // }
  //   });

    $(document).ready(function() {
        $('#formCheck-one').click(function() {
            if ($(event.target).is(':checked')) {
                $('.checkbox1div').css('display', 'block');
            } else {
                $('.checkbox1div').css('display', 'none');
            }
        });
        $('#formCheck-two').click(function() {
            if ($(event.target).is(':checked')) {
                $('.checkbox2div').css('display', 'block');
            } else {
                $('.checkbox2div').css('display', 'none');
            }
        });

        $('.customField1Text').blur(function() {
            var inputValue1 = $('.customField1Text').text();
            $('.lblCustomField1').text(inputValue1);
        });

        $('.customField2Text').blur(function() {
            var inputValue2 = $('.customField2Text').text();
            $('.lblCustomField2').text(inputValue2);
        });


    });


    $('.fullScreenSpin').css('display', 'inline-block');
    templateObject.getAllClients = function() {
        getVS1Data('TSupplierVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                clientsService.getSupplierVS1().then(function(data) {
                    for (let i in data.tsuppliervs1) {

                        let supplierrecordObj = {
                            supplierid: data.tsuppliervs1[i].Id || ' ',
                            suppliername: data.tsuppliervs1[i].ClientName || ' ',
                            supplieremail: data.tsuppliervs1[i].Email || ' ',
                            street: data.tsuppliervs1[i].Street || ' ',
                            street2: data.tsuppliervs1[i].Street2 || ' ',
                            street3: data.tsuppliervs1[i].Street3 || ' ',
                            suburb: data.tsuppliervs1[i].Suburb || ' ',
                            statecode: data.tsuppliervs1[i].State + ' ' + data.tsuppliervs1[i].Postcode || ' ',
                            country: data.tsuppliervs1[i].Country || ' ',
                            termsName: data.tsuppliervs1[i].TermsName || ''
                        };
                        clientList.push(supplierrecordObj);

                    }
                    templateObject.clientrecords.set(clientList.sort(function(a, b) {
                        if (a.suppliername == 'NA') {
                            return 1;
                        } else if (b.suppliername == 'NA') {
                            return -1;
                        }
                        return (a.suppliername.toUpperCase() > b.suppliername.toUpperCase()) ? 1 : -1;
                    }));

                    for (var i = 0; i < clientList.length; i++) {
                        //$('#edtSupplierName').editableSelect('add', clientList[i].suppliername);
                    }
                    if (FlowRouter.current().queryParams.id) {

                    } else {
                        setTimeout(function() {
                            $('#edtSupplierName').trigger("click");
                        }, 200);
                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tsuppliervs1;
                for (let i in useData) {

                    let supplierrecordObj = {
                        supplierid: useData[i].fields.ID || ' ',
                        suppliername: useData[i].fields.ClientName || ' ',
                        supplieremail: useData[i].fields.Email || ' ',
                        street: useData[i].fields.Street || ' ',
                        street2: useData[i].fields.Street2 || ' ',
                        street3: useData[i].fields.Street3 || ' ',
                        suburb: useData[i].fields.Suburb || ' ',
                        statecode: useData[i].fields.State + ' ' + useData[i].fields.Postcode || ' ',
                        country: useData[i].fields.Country || ' ',
                        termsName: useData[i].fields.TermsName || ''
                    };
                    clientList.push(supplierrecordObj);

                }
                templateObject.clientrecords.set(clientList.sort(function(a, b) {
                    if (a.suppliername == 'NA') {
                        return 1;
                    } else if (b.suppliername == 'NA') {
                        return -1;
                    }
                    return (a.suppliername.toUpperCase() > b.suppliername.toUpperCase()) ? 1 : -1;
                }));

                for (var i = 0; i < clientList.length; i++) {
                    //$('#edtSupplierName').editableSelect('add', clientList[i].suppliername);
                }
                if (FlowRouter.current().queryParams.id) {

                } else {
                    setTimeout(function() {
                        $('#edtSupplierName').trigger("click");
                    }, 100);
                }

            }
        }).catch(function(err) {
            clientsService.getSupplierVS1().then(function(data) {
                for (let i in data.tsuppliervs1) {

                    let supplierrecordObj = {
                        supplierid: data.tsuppliervs1[i].Id || ' ',
                        suppliername: data.tsuppliervs1[i].ClientName || ' ',
                        supplieremail: data.tsuppliervs1[i].Email || ' ',
                        street: data.tsuppliervs1[i].Street || ' ',
                        street2: data.tsuppliervs1[i].Street2 || ' ',
                        street3: data.tsuppliervs1[i].Street3 || ' ',
                        suburb: data.tsuppliervs1[i].Suburb || ' ',
                        statecode: data.tsuppliervs1[i].State + ' ' + data.tsuppliervs1[i].Postcode || ' ',
                        country: data.tsuppliervs1[i].Country || ' ',
                        termsName: data.tsuppliervs1[i].TermsName || ''
                    };
                    clientList.push(supplierrecordObj);

                }
                templateObject.clientrecords.set(clientList.sort(function(a, b) {
                    if (a.suppliername == 'NA') {
                        return 1;
                    } else if (b.suppliername == 'NA') {
                        return -1;
                    }
                    return (a.suppliername.toUpperCase() > b.suppliername.toUpperCase()) ? 1 : -1;
                }));

                for (var i = 0; i < clientList.length; i++) {
                    //$('#edtSupplierName').editableSelect('add', clientList[i].suppliername);
                }
                if (FlowRouter.current().queryParams.id) {

                } else {
                    setTimeout(function() {
                        $('#edtSupplierName').trigger("click");
                    }, 200);
                }

            });
        });

    };

    templateObject.getAllLeadStatuss = function() {
        getVS1Data('TLeadStatusType').then(function(dataObject) {
            if (dataObject.length == 0) {
                clientsService.getAllLeadStatus().then(function(data) {
                    for (let i in data.tleadstatustype) {
                        let leadrecordObj = {
                            orderstatus: data.tleadstatustype[i].TypeName || ' '

                        };

                        statusList.push(leadrecordObj);
                    }
                    templateObject.statusrecords.set(statusList);


                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tleadstatustype;
                for (let i in useData) {
                    let leadrecordObj = {
                        orderstatus: useData[i].TypeName || ' '

                    };

                    statusList.push(leadrecordObj);
                }
                templateObject.statusrecords.set(statusList);

            }
            setTimeout(function() {
                $('#sltStatus').append('<option value="newstatus">New Lead Status</option>');
            }, 1500)
        }).catch(function(err) {
            clientsService.getAllLeadStatus().then(function(data) {
                for (let i in data.tleadstatustype) {
                    let leadrecordObj = {
                        orderstatus: data.tleadstatustype[i].TypeName || ' '

                    };

                    statusList.push(leadrecordObj);
                }
                templateObject.statusrecords.set(statusList);


            });
        });

    };

        templateObject.getAllSelectPaymentData = function () {
          let supplierName = $('#edtSupplierName').val() || '';
          purchaseService.getCheckPaymentDetailsByName(supplierName).then(function (data) {
              let lineItems = [];
              let lineItemObj = {};
              for(let i=0; i<data.tsupplierpayment.length; i++){
                  let amount = utilityService.modifynegativeCurrencyFormat(data.tsupplierpayment[i].fields.Amount)|| 0.00;
                  let applied = utilityService.modifynegativeCurrencyFormat(data.tsupplierpayment[i].fields.Applied) || 0.00;
                  // Currency+''+data.tsupplierpayment[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                  let balance = utilityService.modifynegativeCurrencyFormat(data.tsupplierpayment[i].fields.Balance)|| 0.00;
                  let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tsupplierpayment[i].fields.TotalPaid)|| 0.00;
                  let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tsupplierpayment[i].fields.TotalBalance)|| 0.00;
                  var dataList = {
                      id: data.tsupplierpayment[i].fields.ID || '',
                      sortdate: data.tsupplierpayment[i].fields.PaymentDate !=''? moment(data.tsupplierpayment[i].fields.PaymentDate).format("YYYY/MM/DD"): data.tsupplierpayment[i].fields.PaymentDate,
                      paymentdate: data.tsupplierpayment[i].fields.PaymentDate !=''? moment(data.tsupplierpayment[i].fields.PaymentDate).format("DD/MM/YYYY"): data.tsupplierpayment[i].fields.PaymentDate,
                      customername: data.tsupplierpayment[i].fields.CompanyName || '',
                      paymentamount: amount || 0.00,
                      applied: applied || 0.00,
                      balance: balance || 0.00,
                      lines: data.tsupplierpayment[i].fields.Lines,
                      bankaccount: data.tsupplierpayment[i].fields.AccountName || '',
                      department: data.tsupplierpayment[i].fields.DeptClassName || '',
                      refno: data.tsupplierpayment[i].fields.ReferenceNo || '',
                      paymentmethod: data.tsupplierpayment[i].fields.PaymentMethodName || '',
                      notes: data.tsupplierpayment[i].fields.Notes || ''
                  };
                //if (data.tsupplierpayment[i].fields.Lines != null) {
                // if(data.tsupplierpayment[i].fields.Lines.length) {
                  dataTableList.push(dataList);
                 //}
               //}
              }
              templateObject.selectedsupplierpayrecords.set(dataTableList);
          }).catch(function (err) {

          });

    }


    templateObject.getAllClients();
    templateObject.getAllLeadStatuss();
    var url = FlowRouter.current().path;
    if (url.indexOf('?id=') > 0) {
        var getso_id = url.split('?id=');
        var currentPurchaseOrder = getso_id[getso_id.length - 1];
        if (getso_id[1]) {
            currentPurchaseOrder = parseInt(currentPurchaseOrder);
            $('.printID').attr("id", currentPurchaseOrder);
            templateObject.getPurchaseOrderData = function() {
                getVS1Data('TPurchaseOrderEx').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        purchaseService.getOnePurchaseOrderdataEx(currentPurchaseOrder).then(function(data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let lineItemObj = {};
                            let lineItemsTable = [];
                            let lineItemTableObj = {};
                            let exchangeCode = data.fields.ForeignExchangeCode;
                            let currencySymbol = Currency;
                            let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmount) || 0;
                            let totalInc = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc);
                            let subTotal = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmount);
                            let totalTax = utilityService.modifynegativeCurrencyFormat(data.fields.TotalTax);
                            let totalBalance = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance);
                            let totalPaidAmount = utilityService.modifynegativeCurrencyFormat(data.fields.TotalPaid);
                          if(data.fields.Lines != null){
                            if (data.fields.Lines.length) {
                                for (let i = 0; i < data.fields.Lines.length; i++) {
                                    let AmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount);
                                    let currencyAmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount);
                                    let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                                    let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                    lineItemObj = {
                                        lineID: Random.id(),
                                        id: data.fields.Lines[i].fields.ID || '',
                                        item: data.fields.Lines[i].fields.ProductName || '',
                                        description: data.fields.Lines[i].fields.ProductDescription || '',
                                        quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                        qtyordered: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                        qtyshipped: data.fields.Lines[i].fields.UOMQtyShipped || 0,
                                        qtybo: data.fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                        unitPrice: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        unitPriceInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCostInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        TotalAmt: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        TotalAmtInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmountInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        lineCost: currencySymbol + '' + data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        }) || 0,
                                        taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                        taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                        //TotalAmt: AmountGbp || 0,
                                        customerJob: data.fields.Lines[i].fields.CustomerJob || '',
                                        curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                        TaxTotal: TaxTotalGbp || 0,
                                        TaxRate: TaxRateGbp || 0,

                                    };

                                    lineItemsTable.push(dataListTable);
                                    lineItems.push(lineItemObj);
                                }
                            } else {
                                let AmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.TotalLineAmountInc);
                                let currencyAmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.TotalLineAmount);
                                let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                                let TaxRateGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxRate);
                                lineItemObj = {
                                    lineID: Random.id(),
                                    id: data.fields.Lines.fields.ID || '',
                                    description: data.fields.Lines.fields.ProductDescription || '',
                                    quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                                    unitPrice: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                    unitPriceInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCostInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                    TotalAmt: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                    TotalAmtInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmountInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                    lineCost: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost) || 0,
                                    taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                    taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                    //TotalAmt: AmountGbp || 0,
                                    customerJob: data.fields.Lines[i].fields.CustomerJob || '',
                                    curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                    TaxTotal: TaxTotalGbp || 0,
                                    TaxRate: TaxRateGbp || 0
                                };
                                lineItems.push(lineItemObj);
                            }
                          }

                          let lidData = 'Edit Purchase Order' + ' ' + data.fields.ID||'';
                          if(data.fields.IsBackOrder){
                             lidData = 'Edit Purchase Order' + ' (BO) ' + data.fields.ID||'';
                          }

                          let isPartialPaid = false;
                          if(data.fields.TotalPaid > 0){
                              isPartialPaid = true;
                          }

                            let purchaseorderrecord = {
                                id: data.fields.ID,
                                lid: lidData,
                                sosupplier: data.fields.SupplierName,
                                purchaseOrderto: data.fields.OrderTo,
                                shipto: data.fields.ShipTo,
                                shipping: data.fields.Shipping,
                                docnumber: data.fields.DocNumber,
                                custPONumber: data.fields.CustPONumber,
                                saledate: data.fields.OrderDate ? moment(data.fields.OrderDate).format('DD/MM/YYYY') : "",
                                duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                                employeename: data.fields.EmployeeName,
                                status: data.fields.OrderStatus,
                                invoicenumber: data.fields.SupplierInvoiceNumber,
                                comments: data.fields.Comments,
                                pickmemo: data.fields.SalesComments,
                                ponumber: data.fields.CustPONumber,
                                via: data.fields.Shipping,
                                connote: data.fields.ConNote,
                                reference: data.fields.SaleLineRef,
                                currency: data.fields.ForeignExchangeCode,
                                branding: data.fields.MedType,
                                invoiceToDesc: data.fields.OrderTo,
                                shipToDesc: data.fields.ShipTo,
                                termsName: data.fields.TermsName,
                                Total: totalInc,
                                LineItems: lineItems,
                                TotalTax: totalTax,
                                SubTotal: subTotal,
                                balanceDue: totalBalance || 0,
                                saleCustField1: data.fields.SaleLineRef,
                                saleCustField2: data.fields.SalesComments,
                                totalPaid: totalPaidAmount,
                                ispaid: data.fields.IsPaid,
                                isPartialPaid: isPartialPaid,
                                department: data.fields.Lines[0].fields.LineClassName || defaultDept
                            };

                            let getDepartmentVal = data.fields.Lines[0].fields.LineClassName || defaultDept;

                            $('#edtSupplierName').val(data.fields.SupplierName);
                            templateObject.CleintName.set(data.fields.SupplierName);
                            $('#sltCurrency').val(data.fields.ForeignExchangeCode);
                            $('#sltTerms').val(data.fields.TermsName);
                            $('#sltDept').val(getDepartmentVal);
                            $('#sltStatus').val(data.fields.OrderStatus);
                            $('#shipvia').val(data.fields.Shipping);

                            templateObject.attachmentCount.set(0);
                            if (data.fields.Attachments) {
                                if (data.fields.Attachments.length) {
                                    templateObject.attachmentCount.set(data.fields.Attachments.length);
                                    templateObject.uploadedFiles.set(data.fields.Attachments);
                                }
                            }

                            setTimeout(function() {
                                if (clientList) {
                                    for (var i = 0; i < clientList.length; i++) {
                                        if (clientList[i].suppliername == data.fields.SupplierName) {
                                            $('#edtSupplierEmail').val(clientList[i].supplieremail);
                                            $('#edtSupplierEmail').attr('supplierid', clientList[i].supplierid);
                                        }
                                    }
                                }


                                        if (data.fields.IsPaid === true) {
                                            $('#edtSupplierName').attr('readonly', true);
                                            $('#btnViewPayment').removeAttr('disabled', 'disabled');
                                            $('#addRow').attr('disabled', 'disabled');
                                            $('#edtSupplierName').css('background-color', '#eaecf4');
                                            $('.btnSave').attr('disabled', 'disabled');
                                            $('#btnBack').removeAttr('disabled', 'disabled');
                                            $('.printConfirm').removeAttr('disabled', 'disabled');
                                            $('.tblPurchaseOrderLine tbody tr').each(function () {
                                                var $tblrow = $(this);
                                                $tblrow.find("td").attr('contenteditable', false);
                                                //$tblrow.find("td").removeClass("lineProductName");
                                                $tblrow.find("td").removeClass("lineTaxAmount");
                                                $tblrow.find("td").removeClass("lineTaxCode");

                                                $tblrow.find("td").attr('readonly', true);
                                                $tblrow.find("td").attr('disabled', 'disabled');
                                                $tblrow.find("td").css('background-color', '#eaecf4');
                                                $tblrow.find("td .table-remove").removeClass("btnRemove");
                                            });
                                        }
                            }, 100);



                            templateObject.purchaseorderrecord.set(purchaseorderrecord);
                            templateObject.selectedCurrency.set(purchaseorderrecord.currency);
                            templateObject.inputSelectedCurrency.set(purchaseorderrecord.currency);
                            if (templateObject.purchaseorderrecord.get()) {
                                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPurchaseOrderLine', function(error, result) {
                                    if (error) {

                                    } else {
                                        if (result) {
                                            for (let i = 0; i < result.customFields.length; i++) {
                                                let customcolumn = result.customFields;
                                                let columData = customcolumn[i].label;
                                                let columHeaderUpdate = customcolumn[i].thclass;
                                                let hiddenColumn = customcolumn[i].hidden;
                                                let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                                let columnWidth = customcolumn[i].width;
                                                $("" + columHeaderUpdate + "").html(columData);
                                                if (columnWidth != 0) {
                                                    $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                                }

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
                            }
                        }).catch(function(err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                                else if (result.dismiss === 'cancel') {

                                }
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);

                        let useData = data.tpurchaseorderex;
                        var added = false;
                        for (let d = 0; d < useData.length; d++) {
                            if (parseInt(useData[d].fields.ID) === currentPurchaseOrder) {
                                added = true;
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                let lineItemObj = {};
                                let lineItemsTable = [];
                                let lineItemTableObj = {};
                                let exchangeCode = useData[d].fields.ForeignExchangeCode;
                                let currencySymbol = Currency;
                                let total = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalAmount) || 0;
                                let totalInc = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalAmountInc);
                                let subTotal = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalAmount);
                                let totalTax = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalTax);
                                let totalBalance = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance);
                                let totalPaidAmount = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalPaid);
                                if (useData[d].fields.Lines.length) {
                                    for (let i = 0; i < useData[d].fields.Lines.length; i++) {
                                        let AmountGbp = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.TotalLineAmount);
                                        let currencyAmountGbp = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.TotalLineAmount);
                                        let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.LineTaxTotal);
                                        let TaxRateGbp = (useData[d].fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                        lineItemObj = {
                                            lineID: Random.id(),
                                            id: useData[d].fields.Lines[i].fields.ID || '',
                                            item: useData[d].fields.Lines[i].fields.ProductName || '',
                                            description: useData[d].fields.Lines[i].fields.ProductDescription || '',
                                            quantity: useData[d].fields.Lines[i].fields.UOMOrderQty || 0,
                                            qtyordered: useData[d].fields.Lines[i].fields.UOMOrderQty || 0,
                                            qtyshipped: useData[d].fields.Lines[i].fields.UOMQtyShipped || 0,
                                            qtybo: useData[d].fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                            unitPrice: utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.LineCost).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                            unitPriceInc: utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.LineCostInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                            TotalAmt: utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.TotalLineAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                            TotalAmtInc: utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.TotalLineAmountInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,

                                            lineCost: currencySymbol + '' + useData[d].fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                                minimumFractionDigits: 2
                                            }) || 0,
                                            taxRate: (useData[d].fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                            taxCode: useData[d].fields.Lines[i].fields.LineTaxCode || '',
                                            //TotalAmt: AmountGbp || 0,
                                            customerJob: useData[d].fields.Lines[i].fields.CustomerJob || '',
                                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                            TaxTotal: TaxTotalGbp || 0,
                                            TaxRate: TaxRateGbp || 0,

                                        };

                                        lineItemsTable.push(dataListTable);
                                        lineItems.push(lineItemObj);
                                    }
                                } else {
                                    let AmountGbp = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines.fields.TotalLineAmountInc);
                                    let currencyAmountGbp = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines.fields.TotalLineAmount);
                                    let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines.fields.LineTaxTotal);
                                    let TaxRateGbp = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines.fields.LineTaxRate);
                                    lineItemObj = {
                                        lineID: Random.id(),
                                        id: useData[d].fields.Lines.fields.ID || '',
                                        description: useData[d].fields.Lines.fields.ProductDescription || '',
                                        quantity: useData[d].fields.Lines.fields.UOMOrderQty || 0,
                                        unitPrice: utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.LineCost).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        unitPriceInc: utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.LineCostInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        TotalAmt: utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.TotalLineAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        TotalAmtInc: utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.TotalLineAmountInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        lineCost: utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.LineCost) || 0,
                                        taxRate: (useData[d].fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                        taxCode: useData[d].fields.Lines[i].fields.LineTaxCode || '',
                                        //TotalAmt: AmountGbp || 0,
                                        customerJob: useData[d].fields.Lines[i].fields.CustomerJob || '',
                                        curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                        TaxTotal: TaxTotalGbp || 0,
                                        TaxRate: TaxRateGbp || 0
                                    };
                                    lineItems.push(lineItemObj);
                                }

                                let lidData = 'Edit Purchase Order' + ' ' + useData[d].fields.ID||'';
                                if(useData[d].fields.IsBackOrder){
                                   lidData = 'Edit Purchase Order' + ' (BO) ' + useData[d].fields.ID||'';
                                }

                                let isPartialPaid = false;
                                if(useData[d].fields.TotalPaid > 0){
                                    isPartialPaid = true;
                                }

                                let purchaseorderrecord = {
                                    id: useData[d].fields.ID,
                                    lid: lidData,
                                    sosupplier: useData[d].fields.SupplierName,
                                    purchaseOrderto: useData[d].fields.OrderTo,
                                    shipto: useData[d].fields.ShipTo,
                                    shipping: useData[d].fields.Shipping,
                                    docnumber: useData[d].fields.DocNumber,
                                    custPONumber: useData[d].fields.CustPONumber,
                                    saledate: useData[d].fields.OrderDate ? moment(useData[d].fields.OrderDate).format('DD/MM/YYYY') : "",
                                    duedate: useData[d].fields.DueDate ? moment(useData[d].fields.DueDate).format('DD/MM/YYYY') : "",
                                    employeename: useData[d].fields.EmployeeName,
                                    status: useData[d].fields.OrderStatus,
                                    invoicenumber: useData[d].fields.SupplierInvoiceNumber,
                                    comments: useData[d].fields.Comments,
                                    pickmemo: useData[d].fields.SalesComments,
                                    ponumber: useData[d].fields.CustPONumber,
                                    via: useData[d].fields.Shipping,
                                    connote: useData[d].fields.ConNote,
                                    reference: useData[d].fields.SaleLineRef,
                                    currency: useData[d].fields.ForeignExchangeCode,
                                    branding: useData[d].fields.MedType,
                                    invoiceToDesc: useData[d].fields.OrderTo,
                                    shipToDesc: useData[d].fields.ShipTo,
                                    termsName: useData[d].fields.TermsName,
                                    Total: totalInc,
                                    LineItems: lineItems,
                                    TotalTax: totalTax,
                                    SubTotal: subTotal,
                                    balanceDue: totalBalance || 0,
                                    saleCustField1: useData[d].fields.SaleLineRef,
                                    saleCustField2: useData[d].fields.SalesComments,
                                    totalPaid: totalPaidAmount,
                                    ispaid: useData[d].fields.IsPaid,
                                    isPartialPaid: isPartialPaid,
                                    department: useData[d].fields.Lines[0].fields.LineClassName || defaultDept
                                };

                                let getDepartmentVal = useData[d].fields.Lines[0].fields.LineClassName || defaultDept;

                                $('#edtSupplierName').val(useData[d].fields.SupplierName);
                                templateObject.CleintName.set(useData[d].fields.SupplierName);
                                $('#sltCurrency').val(useData[d].fields.ForeignExchangeCode);
                                $('#sltTerms').val(useData[d].fields.TermsName);
                                $('#sltDept').val(getDepartmentVal);
                                $('#sltStatus').val(useData[d].fields.OrderStatus);
                                $('#shipvia').val(useData[d].fields.Shipping);

                                templateObject.attachmentCount.set(0);
                                if (useData[d].fields.Attachments) {
                                    if (useData[d].fields.Attachments.length) {
                                        templateObject.attachmentCount.set(useData[d].fields.Attachments.length);
                                        templateObject.uploadedFiles.set(useData[d].fields.Attachments);
                                    }
                                }

                                setTimeout(function() {
                                    if (clientList) {
                                        for (var i = 0; i < clientList.length; i++) {
                                            if (clientList[i].suppliername == useData[d].fields.SupplierName) {
                                                $('#edtSupplierEmail').val(clientList[i].supplieremail);
                                                $('#edtSupplierEmail').attr('supplierid', clientList[i].supplierid);
                                            }
                                        }
                                    }

                                     if (useData[d].fields.IsPaid === true) {
                                            $('#edtSupplierName').attr('readonly', true);
                                            $('#btnViewPayment').removeAttr('disabled', 'disabled');
                                            $('#addRow').attr('disabled', 'disabled');
                                            $('#edtSupplierName').css('background-color', '#eaecf4');
                                            $('.btnSave').attr('disabled', 'disabled');
                                            $('#btnBack').removeAttr('disabled', 'disabled');
                                            $('.printConfirm').removeAttr('disabled', 'disabled');
                                            $('.tblPurchaseOrderLine tbody tr').each(function () {
                                                var $tblrow = $(this);
                                                $tblrow.find("td").attr('contenteditable', false);
                                                //$tblrow.find("td").removeClass("lineProductName");
                                                $tblrow.find("td").removeClass("lineTaxAmount");
                                                $tblrow.find("td").removeClass("lineTaxCode");

                                                $tblrow.find("td").attr('readonly', true);
                                                $tblrow.find("td").attr('disabled', 'disabled');
                                                $tblrow.find("td").css('background-color', '#eaecf4');
                                                $tblrow.find("td .table-remove").removeClass("btnRemove");
                                            });
                                        }
                                }, 100);



                                templateObject.purchaseorderrecord.set(purchaseorderrecord);
                                templateObject.selectedCurrency.set(purchaseorderrecord.currency);
                                templateObject.inputSelectedCurrency.set(purchaseorderrecord.currency);
                                if (templateObject.purchaseorderrecord.get()) {
                                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPurchaseOrderLine', function(error, result) {
                                        if (error) {

                                        } else {
                                            if (result) {
                                                for (let i = 0; i < result.customFields.length; i++) {
                                                    let customcolumn = result.customFields;
                                                    let columData = customcolumn[i].label;
                                                    let columHeaderUpdate = customcolumn[i].thclass;
                                                    let hiddenColumn = customcolumn[i].hidden;
                                                    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                                    let columnWidth = customcolumn[i].width;

                                                    $("" + columHeaderUpdate + "").html(columData);
                                                    if (columnWidth != 0) {
                                                        $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                                    }

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
                                }
                            }
                        }
                        if (!added) {
                            purchaseService.getOnePurchaseOrderdataEx(currentPurchaseOrder).then(function(data) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                let lineItemObj = {};
                                let lineItemsTable = [];
                                let lineItemTableObj = {};
                                let exchangeCode = data.fields.ForeignExchangeCode;
                                let currencySymbol = Currency;
                                let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmount) || 0;
                                let totalInc = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc);
                                let subTotal = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmount);
                                let totalTax = utilityService.modifynegativeCurrencyFormat(data.fields.TotalTax);
                                let totalBalance = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance);
                                let totalPaidAmount = utilityService.modifynegativeCurrencyFormat(data.fields.TotalPaid);
                              if(data.fields.Lines != null){
                                if (data.fields.Lines.length) {
                                    for (let i = 0; i < data.fields.Lines.length; i++) {
                                        let AmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount);
                                        let currencyAmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount);
                                        let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                                        let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                        lineItemObj = {
                                            lineID: Random.id(),
                                            id: data.fields.Lines[i].fields.ID || '',
                                            item: data.fields.Lines[i].fields.ProductName || '',
                                            description: data.fields.Lines[i].fields.ProductDescription || '',
                                            quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                            qtyordered: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                            qtyshipped: data.fields.Lines[i].fields.UOMQtyShipped || 0,
                                            qtybo: data.fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                            unitPrice: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                            unitPriceInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCostInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                            TotalAmt: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                            TotalAmtInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmountInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                            lineCost: currencySymbol + '' + data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                                minimumFractionDigits: 2
                                            }) || 0,
                                            taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                            taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                            //TotalAmt: AmountGbp || 0,
                                            customerJob: data.fields.Lines[i].fields.CustomerJob || '',
                                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                            TaxTotal: TaxTotalGbp || 0,
                                            TaxRate: TaxRateGbp || 0,

                                        };

                                        lineItemsTable.push(dataListTable);
                                        lineItems.push(lineItemObj);
                                    }
                                } else {
                                    let AmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.TotalLineAmountInc);
                                    let currencyAmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.TotalLineAmount);
                                    let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                                    let TaxRateGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxRate);
                                    lineItemObj = {
                                        lineID: Random.id(),
                                        id: data.fields.Lines.fields.ID || '',
                                        description: data.fields.Lines.fields.ProductDescription || '',
                                        quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                                        unitPrice: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        unitPriceInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCostInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        TotalAmt: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        TotalAmtInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmountInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                        lineCost: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost) || 0,
                                        taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                        taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                        //TotalAmt: AmountGbp || 0,
                                        customerJob: data.fields.Lines[i].fields.CustomerJob || '',
                                        curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                        TaxTotal: TaxTotalGbp || 0,
                                        TaxRate: TaxRateGbp || 0
                                    };
                                    lineItems.push(lineItemObj);
                                }
                              }

                              let lidData = 'Edit Purchase Order' + ' ' + data.fields.ID||'';
                              if(data.fields.IsBackOrder){
                                 lidData = 'Edit Purchase Order' + ' (BO) ' + data.fields.ID||'';
                              }

                              let isPartialPaid = false;
                              if(data.fields.TotalPaid > 0){
                                  isPartialPaid = true;
                              }

                                let purchaseorderrecord = {
                                    id: data.fields.ID,
                                    lid: lidData,
                                    sosupplier: data.fields.SupplierName,
                                    purchaseOrderto: data.fields.OrderTo,
                                    shipto: data.fields.ShipTo,
                                    shipping: data.fields.Shipping,
                                    docnumber: data.fields.DocNumber,
                                    custPONumber: data.fields.CustPONumber,
                                    saledate: data.fields.OrderDate ? moment(data.fields.OrderDate).format('DD/MM/YYYY') : "",
                                    duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                                    employeename: data.fields.EmployeeName,
                                    status: data.fields.OrderStatus,
                                    invoicenumber: data.fields.SupplierInvoiceNumber,
                                    comments: data.fields.Comments,
                                    pickmemo: data.fields.SalesComments,
                                    ponumber: data.fields.CustPONumber,
                                    via: data.fields.Shipping,
                                    connote: data.fields.ConNote,
                                    reference: data.fields.SaleLineRef,
                                    currency: data.fields.ForeignExchangeCode,
                                    branding: data.fields.MedType,
                                    invoiceToDesc: data.fields.OrderTo,
                                    shipToDesc: data.fields.ShipTo,
                                    termsName: data.fields.TermsName,
                                    Total: totalInc,
                                    LineItems: lineItems,
                                    TotalTax: totalTax,
                                    SubTotal: subTotal,
                                    balanceDue: totalBalance || 0,
                                    saleCustField1: data.fields.SaleLineRef,
                                    saleCustField2: data.fields.SalesComments,
                                    totalPaid: totalPaidAmount,
                                    ispaid: data.fields.IsPaid,
                                    isPartialPaid: isPartialPaid,
                                    department: data.fields.Lines[0].fields.LineClassName || defaultDept
                                };

                                let getDepartmentVal = data.fields.Lines[0].fields.LineClassName || defaultDept;

                                $('#edtSupplierName').val(data.fields.SupplierName);
                                templateObject.CleintName.set(data.fields.SupplierName);
                                $('#sltCurrency').val(data.fields.ForeignExchangeCode);
                                $('#sltTerms').val(data.fields.TermsName);
                                $('#sltDept').val(getDepartmentVal);
                                $('#sltStatus').val(data.fields.OrderStatus);
                                $('#shipvia').val(data.fields.Shipping);

                                templateObject.attachmentCount.set(0);
                                if (data.fields.Attachments) {
                                    if (data.fields.Attachments.length) {
                                        templateObject.attachmentCount.set(data.fields.Attachments.length);
                                        templateObject.uploadedFiles.set(data.fields.Attachments);
                                    }
                                }

                                setTimeout(function() {
                                    if (clientList) {
                                        for (var i = 0; i < clientList.length; i++) {
                                            if (clientList[i].suppliername == data.fields.SupplierName) {
                                                $('#edtSupplierEmail').val(clientList[i].supplieremail);
                                                $('#edtSupplierEmail').attr('supplierid', clientList[i].supplierid);
                                            }
                                        }
                                    }
                                }, 100);



                                templateObject.purchaseorderrecord.set(purchaseorderrecord);
                                templateObject.selectedCurrency.set(purchaseorderrecord.currency);
                                templateObject.inputSelectedCurrency.set(purchaseorderrecord.currency);
                                if (templateObject.purchaseorderrecord.get()) {


                                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPurchaseOrderLine', function(error, result) {
                                        if (error) {

                                        } else {
                                            if (result) {
                                                for (let i = 0; i < result.customFields.length; i++) {
                                                    let customcolumn = result.customFields;
                                                    let columData = customcolumn[i].label;
                                                    let columHeaderUpdate = customcolumn[i].thclass;
                                                    let hiddenColumn = customcolumn[i].hidden;
                                                    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                                    let columnWidth = customcolumn[i].width;

                                                    $("" + columHeaderUpdate + "").html(columData);
                                                    if (columnWidth != 0) {
                                                        $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                                    }

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
                                }
                            }).catch(function(err) {
                                swal({
                                    title: 'Oooops...',
                                    text: err,
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                                    else if (result.dismiss === 'cancel') {

                                    }
                                });
                                $('.fullScreenSpin').css('display', 'none');

                            });
                        }

                    }
                }).catch(function(err) {
                    purchaseService.getOnePurchaseOrderdataEx(currentPurchaseOrder).then(function(data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];
                        let lineItemObj = {};
                        let lineItemsTable = [];
                        let lineItemTableObj = {};
                        let exchangeCode = data.fields.ForeignExchangeCode;
                        let currencySymbol = Currency;
                        let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmount) || 0;
                        let totalInc = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc);
                        let subTotal = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmount);
                        let totalTax = utilityService.modifynegativeCurrencyFormat(data.fields.TotalTax);
                        let totalBalance = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance);
                        let totalPaidAmount = utilityService.modifynegativeCurrencyFormat(data.fields.TotalPaid);
                        if(data.fields.Lines != null){
                        if (data.fields.Lines.length) {
                            for (let i = 0; i < data.fields.Lines.length; i++) {
                                let AmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount);
                                let currencyAmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount);
                                let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                                let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                                lineItemObj = {
                                    lineID: Random.id(),
                                    id: data.fields.Lines[i].fields.ID || '',
                                    item: data.fields.Lines[i].fields.ProductName || '',
                                    description: data.fields.Lines[i].fields.ProductDescription || '',
                                    quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                    qtyordered: data.fields.Lines[i].fields.UOMOrderQty || 0,
                                    qtyshipped: data.fields.Lines[i].fields.UOMQtyShipped || 0,
                                    qtybo: data.fields.Lines[i].fields.UOMQtyBackOrder || 0,
                                    unitPrice: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                    unitPriceInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCostInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                    TotalAmt: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                    TotalAmtInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmountInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                    lineCost: currencySymbol + '' + data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    }) || 0,
                                    taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                    taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                    //TotalAmt: AmountGbp || 0,
                                    customerJob: data.fields.Lines[i].fields.CustomerJob || '',
                                    curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                    TaxTotal: TaxTotalGbp || 0,
                                    TaxRate: TaxRateGbp || 0,

                                };

                                lineItemsTable.push(dataListTable);
                                lineItems.push(lineItemObj);
                            }
                        } else {
                            let AmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.TotalLineAmountInc);
                            let currencyAmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.TotalLineAmount);
                            let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                            let TaxRateGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxRate);
                            lineItemObj = {
                                lineID: Random.id(),
                                id: data.fields.Lines.fields.ID || '',
                                description: data.fields.Lines.fields.ProductDescription || '',
                                quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                                unitPrice: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                unitPriceInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCostInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                TotalAmt: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                TotalAmtInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmountInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                                lineCost: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost) || 0,
                                taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                                taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                                //TotalAmt: AmountGbp || 0,
                                customerJob: data.fields.Lines[i].fields.CustomerJob || '',
                                curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                                TaxTotal: TaxTotalGbp || 0,
                                TaxRate: TaxRateGbp || 0
                            };
                            lineItems.push(lineItemObj);
                        }
                        }

                        let lidData = 'Edit Purchase Order' + ' ' + data.fields.ID||'';
                        if(data.fields.IsBackOrder){
                           lidData = 'Edit Purchase Order' + ' (BO) ' + data.fields.ID||'';
                        }

                        let isPartialPaid = false;
                        if(data.fields.TotalPaid > 0){
                            isPartialPaid = true;
                        }

                        let purchaseorderrecord = {
                            id: data.fields.ID,
                            lid: lidData,
                            sosupplier: data.fields.SupplierName,
                            purchaseOrderto: data.fields.OrderTo,
                            shipto: data.fields.ShipTo,
                            shipping: data.fields.Shipping,
                            docnumber: data.fields.DocNumber,
                            custPONumber: data.fields.CustPONumber,
                            saledate: data.fields.OrderDate ? moment(data.fields.OrderDate).format('DD/MM/YYYY') : "",
                            duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                            employeename: data.fields.EmployeeName,
                            status: data.fields.OrderStatus,
                            invoicenumber: data.fields.SupplierInvoiceNumber,
                            comments: data.fields.Comments,
                            pickmemo: data.fields.SalesComments,
                            ponumber: data.fields.CustPONumber,
                            via: data.fields.Shipping,
                            connote: data.fields.ConNote,
                            reference: data.fields.SaleLineRef,
                            currency: data.fields.ForeignExchangeCode,
                            branding: data.fields.MedType,
                            invoiceToDesc: data.fields.OrderTo,
                            shipToDesc: data.fields.ShipTo,
                            termsName: data.fields.TermsName,
                            Total: totalInc,
                            LineItems: lineItems,
                            TotalTax: totalTax,
                            SubTotal: subTotal,
                            balanceDue: totalBalance || 0,
                            saleCustField1: data.fields.SaleLineRef,
                            saleCustField2: data.fields.SalesComments,
                            totalPaid: totalPaidAmount,
                            ispaid: data.fields.IsPaid,
                            isPartialPaid: isPartialPaid,
                            department: data.fields.Lines[0].fields.LineClassName || defaultDept
                        };

                        let getDepartmentVal = data.fields.Lines[0].fields.LineClassName || defaultDept;

                        $('#edtSupplierName').val(data.fields.SupplierName);
                        templateObject.CleintName.set(data.fields.SupplierName);
                        $('#sltCurrency').val(data.fields.ForeignExchangeCode);
                        $('#sltTerms').val(data.fields.TermsName);
                        $('#sltDept').val(getDepartmentVal);
                        $('#sltStatus').val(data.fields.OrderStatus);
                        $('#shipvia').val(data.fields.Shipping);

                        templateObject.attachmentCount.set(0);
                        if (data.fields.Attachments) {
                            if (data.fields.Attachments.length) {
                                templateObject.attachmentCount.set(data.fields.Attachments.length);
                                templateObject.uploadedFiles.set(data.fields.Attachments);
                            }
                        }

                        setTimeout(function() {
                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].suppliername == data.fields.SupplierName) {
                                        $('#edtSupplierEmail').val(clientList[i].supplieremail);
                                        $('#edtSupplierEmail').attr('supplierid', clientList[i].supplierid);
                                    }
                                }
                            }

                            if (data.fields.IsPaid === true) {
                                            $('#edtSupplierName').attr('readonly', true);
                                            $('#btnViewPayment').removeAttr('disabled', 'disabled');
                                            $('#addRow').attr('disabled', 'disabled');
                                            $('#edtSupplierName').css('background-color', '#eaecf4');
                                            $('.btnSave').attr('disabled', 'disabled');
                                            $('#btnBack').removeAttr('disabled', 'disabled');
                                            $('.printConfirm').removeAttr('disabled', 'disabled');
                                            $('.tblPurchaseOrderLine tbody tr').each(function () {
                                                var $tblrow = $(this);
                                                $tblrow.find("td").attr('contenteditable', false);
                                                //$tblrow.find("td").removeClass("lineProductName");
                                                $tblrow.find("td").removeClass("lineTaxAmount");
                                                $tblrow.find("td").removeClass("lineTaxCode");

                                                $tblrow.find("td").attr('readonly', true);
                                                $tblrow.find("td").attr('disabled', 'disabled');
                                                $tblrow.find("td").css('background-color', '#eaecf4');
                                                $tblrow.find("td .table-remove").removeClass("btnRemove");
                                            });
                                        }
                        }, 100);



                        templateObject.purchaseorderrecord.set(purchaseorderrecord);
                        templateObject.selectedCurrency.set(purchaseorderrecord.currency);
                        templateObject.inputSelectedCurrency.set(purchaseorderrecord.currency);
                        if (templateObject.purchaseorderrecord.get()) {


                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPurchaseOrderLine', function(error, result) {
                                if (error) {

                                } else {
                                    if (result) {
                                        for (let i = 0; i < result.customFields.length; i++) {
                                            let customcolumn = result.customFields;
                                            let columData = customcolumn[i].label;
                                            let columHeaderUpdate = customcolumn[i].thclass;
                                            let hiddenColumn = customcolumn[i].hidden;
                                            let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                            let columnWidth = customcolumn[i].width;

                                            $("" + columHeaderUpdate + "").html(columData);
                                            if (columnWidth != 0) {
                                                $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                            }

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
                        }
                    }).catch(function(err) {
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                            else if (result.dismiss === 'cancel') {

                            }
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    });
                });

            };

            templateObject.getPurchaseOrderData();
        }

    } else if (url.indexOf('?copypoid=') > 0) {
        var getso_id = url.split('?copypoid=');
        var currentPurchaseOrder = getso_id[getso_id.length - 1];
        if (getso_id[1]) {
            currentPurchaseOrder = parseInt(currentPurchaseOrder);
            $('.printID').attr("id", currentPurchaseOrder);
            purchaseService.getOnePurchaseOrderdataEx(currentPurchaseOrder).then(function(data) {
                $('.fullScreenSpin').css('display', 'none');
                let lineItems = [];
                let lineItemObj = {};
                let lineItemsTable = [];
                let lineItemTableObj = {};
                let exchangeCode = data.fields.ForeignExchangeCode;
                let currencySymbol = Currency;
                let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmount) || 0;
                let totalInc = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc);
                let subTotal = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmount);
                let totalTax = utilityService.modifynegativeCurrencyFormat(data.fields.TotalTax);
                let totalBalance = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance);
                let totalPaidAmount = utilityService.modifynegativeCurrencyFormat(data.fields.TotalPaid);
                if(data.fields.Lines != null){
                if (data.fields.Lines.length) {
                    for (let i = 0; i < data.fields.Lines.length; i++) {
                        let AmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount);
                        let currencyAmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount);
                        let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineTaxTotal);
                        let TaxRateGbp = (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2);
                        lineItemObj = {
                            lineID: Random.id(),
                            id: data.fields.Lines[i].fields.ID || '',
                            item: data.fields.Lines[i].fields.ProductName || '',
                            description: data.fields.Lines[i].fields.ProductDescription || '',
                            quantity: data.fields.Lines[i].fields.UOMOrderQty || 0,
                            qtyordered: data.fields.Lines[i].fields.UOMOrderQty || 0,
                            qtyshipped: data.fields.Lines[i].fields.UOMQtyShipped || 0,
                            qtybo: data.fields.Lines[i].fields.UOMQtyBackOrder || 0,
                            unitPrice: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                            unitPriceInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCostInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                            TotalAmt: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                            TotalAmtInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmountInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                            lineCost: currencySymbol + '' + data.fields.Lines[i].fields.LineCost.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            }) || 0,
                            taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                            taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                            //TotalAmt: AmountGbp || 0,
                            customerJob: data.fields.Lines[i].fields.CustomerJob || '',
                            curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                            TaxTotal: TaxTotalGbp || 0,
                            TaxRate: TaxRateGbp || 0,

                        };

                        lineItemsTable.push(dataListTable);
                        lineItems.push(lineItemObj);
                    }
                } else {
                    let AmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.TotalLineAmountInc);
                    let currencyAmountGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.TotalLineAmount);
                    let TaxTotalGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxTotal);
                    let TaxRateGbp = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.LineTaxRate);
                    lineItemObj = {
                        lineID: Random.id(),
                        id: data.fields.Lines.fields.ID || '',
                        description: data.fields.Lines.fields.ProductDescription || '',
                        quantity: data.fields.Lines.fields.UOMOrderQty || 0,
                        unitPrice: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                        unitPriceInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCostInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                        TotalAmt: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmount).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                        TotalAmtInc: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.TotalLineAmountInc).toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0,
                        lineCost: utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.LineCost) || 0,
                        taxRate: (data.fields.Lines[i].fields.LineTaxRate * 100).toFixed(2) || 0,
                        taxCode: data.fields.Lines[i].fields.LineTaxCode || '',
                        //TotalAmt: AmountGbp || 0,
                        customerJob: data.fields.Lines[i].fields.CustomerJob || '',
                        curTotalAmt: currencyAmountGbp || currencySymbol + '0',
                        TaxTotal: TaxTotalGbp || 0,
                        TaxRate: TaxRateGbp || 0
                    };
                    lineItems.push(lineItemObj);
                }
              }
                let purchaseorderrecord = {
                    id: data.fields.ID,
                    lid: 'New Purchase Order',
                    sosupplier: data.fields.SupplierName,
                    purchaseOrderto: data.fields.OrderTo,
                    shipto: data.fields.ShipTo,
                    shipping: data.fields.Shipping,
                    docnumber: data.fields.DocNumber,
                    custPONumber: data.fields.CustPONumber,
                    saledate: data.fields.OrderDate ? moment(data.fields.OrderDate).format('DD/MM/YYYY') : "",
                    duedate: data.fields.DueDate ? moment(data.fields.DueDate).format('DD/MM/YYYY') : "",
                    employeename: data.fields.EmployeeName,
                    status: data.fields.OrderStatus,
                    invoicenumber: data.fields.SupplierInvoiceNumber,
                    comments: data.fields.Comments,
                    pickmemo: data.fields.SalesComments,
                    ponumber: data.fields.CustPONumber,
                    via: data.fields.Shipping,
                    connote: data.fields.ConNote,
                    reference: data.fields.SaleLineRef,
                    currency: data.fields.ForeignExchangeCode,
                    branding: data.fields.MedType,
                    invoiceToDesc: data.fields.OrderTo,
                    shipToDesc: data.fields.ShipTo,
                    termsName: data.fields.TermsName,
                    Total: totalInc,
                    LineItems: lineItems,
                    TotalTax: totalTax,
                    SubTotal: subTotal,
                    balanceDue: totalBalance || 0,
                    saleCustField1: data.fields.SaleLineRef,
                    saleCustField2: data.fields.SalesComments,
                    totalPaid: totalPaidAmount,
                    ispaid: data.fields.IsPaid,
                    isPartialPaid: isPartialPaid,
                    department: data.fields.Lines[0].fields.LineClassName || defaultDept
                };

                let getDepartmentVal = data.fields.Lines[0].fields.LineClassName || defaultDept;

                $('#edtSupplierName').val(data.fields.SupplierName);
                templateObject.CleintName.set(data.fields.SupplierName);
                $('#sltCurrency').val(data.fields.ForeignExchangeCode);
                $('#sltTerms').val(data.fields.TermsName);
                $('#sltDept').val(getDepartmentVal);
                $('#sltStatus').val(data.fields.OrderStatus);
                $('#shipvia').val(data.fields.Shipping);

                templateObject.attachmentCount.set(0);
                if (data.fields.Attachments) {
                    if (data.fields.Attachments.length) {
                        templateObject.attachmentCount.set(data.fields.Attachments.length);
                        templateObject.uploadedFiles.set(data.fields.Attachments);
                    }
                }

                setTimeout(function() {
                    if (clientList) {
                        for (var i = 0; i < clientList.length; i++) {
                            if (clientList[i].suppliername == data.fields.SupplierName) {
                                $('#edtSupplierEmail').val(clientList[i].supplieremail);
                                $('#edtSupplierEmail').attr('supplierid', clientList[i].supplierid);
                            }
                        }
                    }
                }, 100);

                templateObject.purchaseorderrecord.set(purchaseorderrecord);
                templateObject.selectedCurrency.set(purchaseorderrecord.currency);
                templateObject.inputSelectedCurrency.set(purchaseorderrecord.currency);
                if (templateObject.purchaseorderrecord.get()) {



                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPurchaseOrderLine', function(error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass;
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                    let columnWidth = customcolumn[i].width;


                                    $("" + columHeaderUpdate + "").html(columData);
                                    if (columnWidth != 0) {
                                        $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                    }

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
                }
            }).catch(function(err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                    else if (result.dismiss === 'cancel') {

                    }
                });
                $('.fullScreenSpin').css('display', 'none');

            });
        }
    } else {
        $('.fullScreenSpin').css('display', 'none');

        let lineItems = [];
        let lineItemsTable = [];
        let lineItemObj = {};
        lineItemObj = {
            lineID: Random.id(),
            item: '',
            description: '',
            quantity: '',
            qtyordered: '',
            qtyshipped: '',
            qtybo: '',
            unitPrice: 0,
            unitPriceInc:0,
            TotalAmt: 0,
            TotalAmtInc: 0,
            taxRate: 0,
            taxCode: '',
            curTotalAmt: 0,
            TaxTotal: 0,
            TaxRate: 0,

        };

        var dataListTable = [
            ' ' || '',
            ' ' || '',
            0 || 0,
            0.00 || 0.00,
            ' ' || '',
            0.00 || 0.00,
            '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
        ];
        lineItemsTable.push(dataListTable);
        lineItems.push(lineItemObj);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        let purchaseorderrecord = {
            id: '',
            lid: 'New Purchase Order',
            sosupplier: '',
            purchaseOrderto: '',
            shipto: '',
            shipping: '',
            docnumber: '',
            custPONumber: '',
            saledate: begunDate,
            duedate: '',
            employeename: '',
            status: '',
            invoicenumber: '',
            category: '',
            comments: '',
            pickmemo: '',
            ponumber: '',
            via: '',
            connote: '',
            reference: '',
            currency: '',
            branding: '',
            invoiceToDesc: '',
            shipToDesc: '',
            termsName: '',
            Total: Currency + '' + 0.00,
            LineItems: lineItems,
            TotalTax: Currency + '' + 0.00,
            SubTotal: Currency + '' + 0.00,
            balanceDue: Currency + '' + 0.00,
            saleCustField1: '',
            saleCustField2: '',
            totalPaid: Currency + '' + 0.00,
            ispaid: false,
            isPartialPaid: false

        };

        $('#edtSupplierName').val('');
        setTimeout(function() {
            $('#sltDept').val(defaultDept);
        }, 200);

        templateObject.purchaseorderrecord.set(purchaseorderrecord);
        if (templateObject.purchaseorderrecord.get()) {
            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPurchaseOrderLine', function(error, result) {
                if (error) {} else {
                    if (result) {
                        for (let i = 0; i < result.customFields.length; i++) {
                            let customcolumn = result.customFields;
                            let columData = customcolumn[i].label;
                            let columHeaderUpdate = customcolumn[i].thclass;
                            let hiddenColumn = customcolumn[i].hidden;
                            let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                            let columnWidth = customcolumn[i].width;
                            $("" + columHeaderUpdate + "").html(columData);
                            if (columnWidth != 0) {
                                $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                            }
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
        }
    }


    templateObject.getShpVias = function() {
        getVS1Data('TShippingMethod').then(function(dataObject) {
            if (dataObject.length == 0) {
                purchaseService.getShpVia().then(function(data) {
                    for (let i in data.tshippingmethod) {

                        let viarecordObj = {
                            shippingmethod: data.tshippingmethod[i].ShippingMethod || ' ',
                        };

                        viarecords.push(viarecordObj);
                        templateObject.viarecords.set(viarecords);

                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tshippingmethod;
                for (let i in useData) {

                    let viarecordObj = {
                        shippingmethod: useData[i].ShippingMethod || ' ',
                    };

                    viarecords.push(viarecordObj);
                    templateObject.viarecords.set(viarecords);

                }

            }
        }).catch(function(err) {
            purchaseService.getShpVia().then(function(data) {
                for (let i in data.tshippingmethod) {

                    let viarecordObj = {
                        shippingmethod: data.tshippingmethod[i].ShippingMethod || ' ',
                    };

                    viarecords.push(viarecordObj);
                    templateObject.viarecords.set(viarecords);

                }
            });
        });


    }

    templateObject.getDepartments = function() {
        getVS1Data('TDeptClass').then(function(dataObject) {
            if (dataObject.length == 0) {
                purchaseService.getDepartment().then(function(data) {
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
        }).catch(function(err) {
            purchaseService.getDepartment().then(function(data) {
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

    templateObject.getTerms = function() {
        getVS1Data('TTermsVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                purchaseService.getTermVS1().then(function(data) {
                    for (let i in data.ttermsvs1) {

                        let termrecordObj = {
                            termsname: data.ttermsvs1[i].TermsName || ' ',
                        };

                        if(data.ttermsvs1[i].isPurchasedefault == true){
                        purchaseDefaultTerms = data.ttermsvs1[i].TermsName || ' ';
                    }

                        termrecords.push(termrecordObj);
                        templateObject.termrecords.set(termrecords);

                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.ttermsvs1;
                for (let i in useData) {

                    let termrecordObj = {
                        termsname: useData[i].TermsName || ' ',
                    };

                     if(useData[i].isPurchasedefault == true){
                        purchaseDefaultTerms = useData[i].TermsName || ' ';
                    }

                    termrecords.push(termrecordObj);
                    templateObject.termrecords.set(termrecords);

                }

            }
        }).catch(function(err) {
            purchaseService.getTermVS1().then(function(data) {
                for (let i in data.ttermsvs1) {

                    let termrecordObj = {
                        termsname: data.ttermsvs1[i].TermsName || ' ',
                    };

                    if(data.ttermsvs1[i].isPurchasedefault == true){
                        purchaseDefaultTerms = data.ttermsvs1[i].TermsName || ' ';
                    }

                    termrecords.push(termrecordObj);
                    templateObject.termrecords.set(termrecords);

                }
            });
        });


    }
    templateObject.getShpVias();
    templateObject.getTerms();
    templateObject.getDepartments();


    let table;
    $(document).ready(function() {
        $('#edtSupplierName').editableSelect();
        $('#sltCurrency').editableSelect();
        $('#sltTerms').editableSelect();
        $('#sltDept').editableSelect();
        $('#sltStatus').editableSelect();
        $('#shipvia').editableSelect();

        $('#addRow').on('click', function() {
            var rowData = $('#tblPurchaseOrderLine tbody>tr:last').clone(true);
            let tokenid = Random.id();
            $(".lineProductName", rowData).val("");
            $(".lineProductDesc", rowData).text("");
            $(".lineQty", rowData).val("");
            $(".lineUnitPrice", rowData).val("");
            $(".lineTaxRate", rowData).text("");
            $(".lineTaxCode", rowData).val("");
            $(".lineAmt", rowData).text("");
            rowData.attr('id', tokenid);
            $("#tblPurchaseOrderLine tbody").append(rowData);

            if ($('#printID').attr('id') != "") {
                var rowData1 = $('.purchase_print tbody>tr:last').clone(true);
                $("#lineProductName", rowData1).text("");
                $("#lineProductDesc", rowData1).text("");
                $("#lineQty", rowData1).text("");
                $("#lineOrdered", rowData1).text("");
                $("#lineUnitPrice", rowData1).text("");

                $("#lineTaxAmount", rowData1).text("");
                $("#lineAmt", rowData1).text("");
                rowData1.attr('id', tokenid);
                $(".purchase_print tbody").append(rowData1);
            }

            setTimeout(function() {
                $('#' + tokenid + " .lineProductName").trigger('click');
            }, 200);

        });



    });

    $('#shipvia').editableSelect()
        .on('click.editable-select', function(e, li) {
            var $earch = $(this);
            var offset = $earch.offset();
            var shipvianame = e.target.value || '';
            $('#edtShipViaID').val('');
            $('#newShipViaMethodName').text('Add Ship Via');
            $('#edtShipVia').attr('readonly', false);
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#shipViaModal').modal('toggle');
                setTimeout(function() {
                    $('#tblShipViaPopList_filter .form-control-sm').focus();
                    $('#tblShipViaPopList_filter .form-control-sm').val('');
                    $('#tblShipViaPopList_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblShipViaPopList').DataTable();
                    datatable.draw();
                    $('#tblShipViaPopList_filter .form-control-sm').trigger("input");
                }, 500);
            } else {
                if (shipvianame.replace(/\s/g, '') != '') {
                    $('#newShipViaMethodName').text('Edit Ship Via');
                    setTimeout(function() {
                        // $('#edtShipVia').attr('readonly', true);
                    }, 100);

                    getVS1Data('TShippingMethod').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getShippingMethodData().then(function(data) {
                                for (let i = 0; i < data.tshippingmethod.length; i++) {
                                    if (data.tshippingmethod[i].ShippingMethod === shipvianame) {
                                        $('#edtShipViaID').val(data.tshippingmethod[i].Id);
                                        $('#edtShipVia').val(data.tshippingmethod[i].ShippingMethod);
                                    }
                                }
                                setTimeout(function() {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newShipViaModal').modal('toggle');
                                }, 200);
                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tshippingmethod;
                            for (let i = 0; i < data.tshippingmethod.length; i++) {
                                if (useData[i].ShippingMethod === shipvianame) {
                                    $('#edtShipViaID').val(useData[i].Id);
                                    $('#edtShipVia').val(useData[i].ShippingMethod);
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newShipViaModal').modal('toggle');
                            }, 200);
                        }
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getShippingMethodData().then(function(data) {
                            for (let i = 0; i < data.tshippingmethod.length; i++) {
                                if (data.tshippingmethod[i].ShippingMethod === shipvianame) {
                                    $('#edtShipViaID').val(data.tshippingmethod[i].Id);
                                    $('#edtShipVia').val(data.tshippingmethod[i].ShippingMethod);
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#edtShipVia').attr('readonly', false);
                                $('#newShipViaModal').modal('toggle');
                            }, 200);
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    });
                } else {
                    $('#shipViaModal').modal();
                    setTimeout(function() {
                        $('#tblShipViaPopList_filter .form-control-sm').focus();
                        $('#tblShipViaPopList_filter .form-control-sm').val('');
                        $('#tblShipViaPopList_filter .form-control-sm').trigger("input");
                        var datatable = $('#tblShipViaPopList').DataTable();
                        datatable.draw();
                        $('#tblShipViaPopList_filter .form-control-sm').trigger("input");
                    }, 500);
                }
            }
        });

        $(document).on("click", "#tblShipViaPopList tbody tr", function(e) {
            $('#shipvia').val($(this).find(".colShipName ").text());
            $('#shipViaModal').modal('toggle');

            $('#tblShipViaPopList_filter .form-control-sm').val('');
            setTimeout(function () {
                $('.btnRefreshVia').trigger('click');
                $('.fullScreenSpin').css('display', 'none');
            }, 1000);
        });

        $(document).on("click", "#tblCurrencyPopList tbody tr", function(e) {
            $('#sltCurrency').val($(this).find(".colCode").text());
            $('#currencyModal').modal('toggle');

            $('#tblCurrencyPopList_filter .form-control-sm').val('');
            setTimeout(function () {
                $('.btnRefreshCurrency').trigger('click');
                $('.fullScreenSpin').css('display', 'none');
            }, 1000);
        });

    $(document).on("click", "#departmentList tbody tr", function(e) {
        $('#sltDept').val($(this).find(".colDeptName").text());
        $('#departmentModal').modal('toggle');
    });

    $(document).on("click", "#termsList tbody tr", function(e) {
        $('#sltTerms').val($(this).find(".colTermName").text());
        $('#termsListModal').modal('toggle');
    });

    $(document).on("click", "#tblStatusPopList tbody tr", function(e) {
        $('#sltStatus').val($(this).find(".colStatusName").text());
        $('#statusPopModal').modal('toggle');

        $('#tblStatusPopList_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshStatus').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblInventory tbody tr", function(e) {
      $(".colProductName").removeClass('boldtablealertsborder');
        let selectLineID = $('#selectLineID').val();
        let taxcodeList = templateObject.taxraterecords.get();
        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblPurchaseOrderLine tbody tr");
        var $printrows = $(".purchase_print tbody tr");
        if (selectLineID) {
            let lineProductName = table.find(".productName").text();
            let lineProductDesc = table.find(".productDesc").text();
            let lineUnitPrice = table.find(".costPrice").text();
            let lineTaxRate = table.find(".taxrate").text();
            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotalPrint = 0;
            let taxGrandTotal = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == lineTaxRate) {
                        $('#' + selectLineID + " .lineTaxRate").text(taxcodeList[i].coderate);
                    }
                }
            }
            $('#' + selectLineID + " .lineProductName").val(lineProductName);
            $('#' + selectLineID + " .lineProductDesc").text(lineProductDesc);
            $('#' + selectLineID + " .lineOrdered").val(1);
            $('#' + selectLineID + " .lineQty").val(1);
            $('#' + selectLineID + " .lineUnitPrice").val(lineUnitPrice);
            $('#' + selectLineID + " .lineTaxCode").val(lineTaxRate);

            if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                $('#' + selectLineID + " #lineProductName").text(lineProductName);
                $('#' + selectLineID + " #lineProductDesc").text(lineProductDesc);
                $('#' + selectLineID + " #lineOrdered").text(1);
                $('#' + selectLineID + " #lineQty").text(1);
                $('#' + selectLineID + " #lineUnitPrice").text(lineUnitPrice);
            }


            if (lineTaxRate == "NT") {
                lineTaxRate = "E";
                $('#' + selectLineID + " .lineTaxCode").val(lineTaxRate);
                if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                    $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                }

            } else {
                $('#' + selectLineID + " .lineTaxCode").val(lineTaxRate);
                if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                    $('#' + selectLineID + " #lineTaxCode").text(lineTaxRate);
                }
            }


            lineAmount = 1 * Number(lineUnitPrice.replace(/[^0-9.-]+/g, "")) || 0;
            $('#' + selectLineID + " .lineAmt").text(utilityService.modifynegativeCurrencyFormat(lineAmount));
            if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                $('#' + selectLineID + " #lineAmt").text(utilityService.modifynegativeCurrencyFormat(lineAmount));
            }

            $('#productListModal').modal('toggle');
            $tblrows.each(function(index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".lineQty").val() || 0;
                var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
                var taxcode = $tblrow.find(".lineTaxCode").val() || 0;

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxcode) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }


                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                let lineTotalAmount = subTotal + taxTotal;
                $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));

                let unitPriceIncCalc = Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount)||0;
                let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, ""))||0;
                let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc||0;
                $tblrow.find('.colUnitPriceExChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
                $tblrow.find('.colUnitPriceIncChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal));

                if (!isNaN(subTotal)) {
                    $tblrow.find('.colAmountEx').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                    $tblrow.find('.colAmountInc').text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                    document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
                }

                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                }
            });

            if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                $printrows.each(function(index) {
                    var $printrows = $(this);
                    var qty = $printrows.find("#lineQty").text() || 0;
                    var price = $printrows.find("#lineUnitPrice").text() || 0;
                    var taxrateamount = 0;
                    var taxRate = $printrows.find("#lineTaxCode").text();
                    if (taxcodeList) {
                        for (var i = 0; i < taxcodeList.length; i++) {
                            if (taxcodeList[i].codename == taxRate) {
                                taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                            }
                        }
                    }

                    var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                    $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))
                    if (!isNaN(subTotal)) {
                        $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                        document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                    }

                    if (!isNaN(taxTotal)) {
                        taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                    }
                    if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                        let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                        document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                        //document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);


                    }
                });
                $("#print_subtotal_tax").text($("#subtotal_tax").text());
            }
        }
    });


    $(document).on("click", "#tblTaxRate tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val();
        let taxcodeList = templateObject.taxraterecords.get();
        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblPurchaseOrderLine tbody tr");
        if (selectLineID) {
            let lineTaxCode = table.find(".taxName").text();
            let lineTaxRate = table.find(".taxRate").text();
            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;
            let taxGrandTotalPrint = 0;

            $('#' + selectLineID + " .lineTaxRate").text(lineTaxRate || 0);
            $('#' + selectLineID + " .lineTaxCode").val(lineTaxCode);

            let $printrows = $(".purchase_print tbody tr");
            if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                $('#' + selectLineID + " #lineAmount").text($('#' + selectLineID + " .colAmount").val());
                $('#' + selectLineID + " #lineTaxCode").text(lineTaxCode);
            }


            $('#taxRateListModal').modal('toggle');
            $tblrows.each(function(index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".lineQty").val() || 0;
                var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
                var taxcode = $tblrow.find(".lineTaxCode").val() || '';

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxcode) {

                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;

                        }
                    }
                }
                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                if ((taxrateamount == '') || (taxrateamount == ' ')) {
                    var taxTotal = 0;
                } else {
                    var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                }
                let lineTotalAmount = subTotal + taxTotal;
                $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));

                let unitPriceIncCalc = Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount)||0;
                let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, ""))||0;
                let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc||0;
                $tblrow.find('.colUnitPriceExChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
                $tblrow.find('.colUnitPriceIncChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal));

                if (!isNaN(subTotal)) {
                  $tblrow.find('.colAmountEx').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                  $tblrow.find('.colAmountInc').text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                    document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
                }

                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                }
            });

            if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                $printrows.each(function(index) {
                    var $printrows = $(this);
                    var qty = $printrows.find("#lineQty").text() || 0;
                    var price = $printrows.find("#lineUnitPrice").text() || 0;
                    var taxrateamount = 0;
                    var taxRate = $printrows.find("#lineTaxCode").text();
                    if (taxcodeList) {
                        for (var i = 0; i < taxcodeList.length; i++) {
                            if (taxcodeList[i].codename == taxRate) {
                                taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                            }
                        }
                    }

                    var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                    $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))
                    if (!isNaN(subTotal)) {
                        $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                        document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                    }

                    if (!isNaN(taxTotal)) {
                        taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                    }
                    if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                        let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                        document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                        //document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    }
                });
                $("#print_subtotal_tax").text($("#subtotal_tax").text());
            }
        }
    });


    $(document).on("click", "#tblCustomerlist tbody tr", function(e) {
        let selectLineID = $('#customerSelectLineID').val();
        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblPurchaseOrderLine tbody tr");
        if (selectLineID) {
            let companyName = table.find(".colCompany").text();
            let jobName = table.find(".colCompany").text();
            if (jobName.replace(/\s/g, '') != '') {
                $('#' + selectLineID + " .lineCustomerJob").val(jobName || '');
            } else {
                $('#' + selectLineID + " .lineCustomerJob").val(companyName || '');
            }
            $('#customerListModal').modal('toggle');

        }
    });

    $('#sltTerms').editableSelect()
        .on('click.editable-select', function(e, li) {
            var $earch = $(this);
            var offset = $earch.offset();
            var termsDataName = e.target.value || '';
            $('#edtTermsID').val('');
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#termsListModal').modal('toggle');
            } else {
                if (termsDataName.replace(/\s/g, '') != '') {
                    $('#termModalHeader').text('Edit Terms');
                    getVS1Data('TTermsVS1').then(function(dataObject) { //edit to test indexdb
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getTermsVS1().then(function(data) {
                                for (let i in data.ttermsvs1) {
                                    if (data.ttermsvs1[i].TermsName === termsDataName) {
                                        $('#edtTermsID').val(data.ttermsvs1[i].Id);
                                        $('#edtDays').val(data.ttermsvs1[i].Days);
                                        $('#edtName').val(data.ttermsvs1[i].TermsName);
                                        $('#edtDesc').val(data.ttermsvs1[i].Description);
                                        if (data.ttermsvs1[i].IsEOM === true) {
                                            $('#isEOM').prop('checked', true);
                                        } else {
                                            $('#isEOM').prop('checked', false);
                                        }
                                        if (data.ttermsvs1[i].IsEOMPlus === true) {
                                            $('#isEOMPlus').prop('checked', true);
                                        } else {
                                            $('#isEOMPlus').prop('checked', false);
                                        }
                                        if (data.ttermsvs1[i].isSalesdefault === true) {
                                            $('#chkCustomerDef').prop('checked', true);
                                        } else {
                                            $('#chkCustomerDef').prop('checked', false);
                                        }
                                        if (data.ttermsvs1[i].isPurchasedefault === true) {
                                            $('#chkSupplierDef').prop('checked', true);
                                        } else {
                                            $('#chkSupplierDef').prop('checked', false);
                                        }
                                    }
                                }
                                setTimeout(function() {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newTermsModal').modal('toggle');
                                }, 200);
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.ttermsvs1;
                            for (let i in useData) {
                                if (useData[i].TermsName === termsDataName) {
                                    $('#edtTermsID').val(useData[i].Id);
                                    $('#edtDays').val(useData[i].Days);
                                    $('#edtName').val(useData[i].TermsName);
                                    $('#edtDesc').val(useData[i].Description);
                                    if (useData[i].IsEOM === true) {
                                        $('#isEOM').prop('checked', true);
                                    } else {
                                        $('#isEOM').prop('checked', false);
                                    }
                                    if (useData[i].IsEOMPlus === true) {
                                        $('#isEOMPlus').prop('checked', true);
                                    } else {
                                        $('#isEOMPlus').prop('checked', false);
                                    }
                                    if (useData[i].isSalesdefault === true) {
                                        $('#chkCustomerDef').prop('checked', true);
                                    } else {
                                        $('#chkCustomerDef').prop('checked', false);
                                    }
                                    if (useData[i].isPurchasedefault === true) {
                                        $('#chkSupplierDef').prop('checked', true);
                                    } else {
                                        $('#chkSupplierDef').prop('checked', false);
                                    }
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newTermsModal').modal('toggle');
                            }, 200);
                        }
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getTermsVS1().then(function(data) {
                            for (let i in data.ttermsvs1) {
                                if (data.ttermsvs1[i].TermsName === termsDataName) {
                                    $('#edtTermsID').val(data.ttermsvs1[i].Id);
                                    $('#edtDays').val(data.ttermsvs1[i].Days);
                                    $('#edtName').val(data.ttermsvs1[i].TermsName);
                                    $('#edtDesc').val(data.ttermsvs1[i].Description);
                                    if (data.ttermsvs1[i].IsEOM === true) {
                                        $('#isEOM').prop('checked', true);
                                    } else {
                                        $('#isEOM').prop('checked', false);
                                    }
                                    if (data.ttermsvs1[i].IsEOMPlus === true) {
                                        $('#isEOMPlus').prop('checked', true);
                                    } else {
                                        $('#isEOMPlus').prop('checked', false);
                                    }
                                    if (data.ttermsvs1[i].isSalesdefault === true) {
                                        $('#chkCustomerDef').prop('checked', true);
                                    } else {
                                        $('#chkCustomerDef').prop('checked', false);
                                    }
                                    if (data.ttermsvs1[i].isPurchasedefault === true) {
                                        $('#chkSupplierDef').prop('checked', true);
                                    } else {
                                        $('#chkSupplierDef').prop('checked', false);
                                    }
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newTermsModal').modal('toggle');
                            }, 200);
                        });
                    });
                } else {
                    $('#termsListModal').modal();
                    setTimeout(function() {
                        $('#termsList_filter .form-control-sm').focus();
                        $('#termsList_filter .form-control-sm').val('');
                        $('#termsList_filter .form-control-sm').trigger("input");
                        var datatable = $('#termsList').DataTable();
                        datatable.draw();
                        $('#termsList_filter .form-control-sm').trigger("input");
                    }, 500);
                }
            }
        });

    $('#sltDept').editableSelect()
        .on('click.editable-select', function(e, li) {
            var $earch = $(this);
            var offset = $earch.offset();
            var deptDataName = e.target.value || '';
            $('#edtDepartmentID').val('');
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#departmentModal').modal('toggle');
            } else {
                if (deptDataName.replace(/\s/g, '') != '') {
                    $('#newDeptHeader').text('Edit Department');

                    getVS1Data('TDeptClass').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getDepartment().then(function(data) {
                                for (let i = 0; i < data.tdeptclass.length; i++) {
                                    if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                        $('#edtDepartmentID').val(data.tdeptclass[i].Id);
                                        $('#edtNewDeptName').val(data.tdeptclass[i].DeptClassName);
                                        $('#edtSiteCode').val(data.tdeptclass[i].SiteCode);
                                        $('#edtDeptDesc').val(data.tdeptclass[i].Description);
                                    }
                                }
                                setTimeout(function() {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newDepartmentModal').modal('toggle');
                                }, 200);
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tdeptclass;
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                    $('#edtDepartmentID').val(data.tdeptclass[i].Id);
                                    $('#edtNewDeptName').val(data.tdeptclass[i].DeptClassName);
                                    $('#edtSiteCode').val(data.tdeptclass[i].SiteCode);
                                    $('#edtDeptDesc').val(data.tdeptclass[i].Description);
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newDepartmentModal').modal('toggle');
                            }, 200);
                        }
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getDepartment().then(function(data) {
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                    $('#edtDepartmentID').val(data.tdeptclass[i].Id);
                                    $('#edtNewDeptName').val(data.tdeptclass[i].DeptClassName);
                                    $('#edtSiteCode').val(data.tdeptclass[i].SiteCode);
                                    $('#edtDeptDesc').val(data.tdeptclass[i].Description);
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newDepartmentModal').modal('toggle');
                            }, 200);
                        });
                    });
                } else {
                    $('#departmentModal').modal();
                    setTimeout(function() {
                        $('#departmentList_filter .form-control-sm').focus();
                        $('#departmentList_filter .form-control-sm').val('');
                        $('#departmentList_filter .form-control-sm').trigger("input");
                        var datatable = $('#departmentList').DataTable();
                        datatable.draw();
                        $('#departmentList_filter .form-control-sm').trigger("input");
                    }, 500);
                }
            }
        });

    $('#sltStatus').editableSelect()
        .on('click.editable-select', function(e, li) {
                    var $earch = $(this);
                    var offset = $earch.offset();
                    $('#statusId').val('');
                    var statusDataName = e.target.value || '';
                    if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                        $('#statusPopModal').modal('toggle');
                    } else {
                        if (statusDataName.replace(/\s/g, '') != '') {
                            $('#newStatusHeader').text('Edit Status');
                            $('#newStatus').val(statusDataName);

                            getVS1Data('TLeadStatusType').then(function(dataObject) {
                                if (dataObject.length == 0) {
                                    $('.fullScreenSpin').css('display', 'inline-block');
                                    sideBarService.getAllLeadStatus().then(function(data) {
                                        for (let i in data.tleadstatustype) {
                                            if (data.tleadstatustype[i].TypeName === statusDataName) {
                                                $('#statusId').val(data.tleadstatustype[i].Id);
                                            }
                                        }
                                        setTimeout(function() {
                                            $('.fullScreenSpin').css('display', 'none');
                                            $('#newStatusPopModal').modal('toggle');
                                        }, 200);
                                    });
                                } else {
                                    let data = JSON.parse(dataObject[0].data);
                                    let useData = data.tleadstatustype;
                                    for (let i in useData) {
                                        if (useData[i].TypeName === statusDataName) {
                                            $('#statusId').val(useData[i].Id);

                                        }
                                    }
                                    setTimeout(function() {
                                        $('.fullScreenSpin').css('display', 'none');
                                        $('#newStatusPopModal').modal('toggle');
                                    }, 200);
                                }
                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'inline-block');
                                sideBarService.getAllLeadStatus().then(function(data) {
                                    for (let i in data.tleadstatustype) {
                                        if (data.tleadstatustype[i].TypeName === statusDataName) {
                                            $('#statusId').val(data.tleadstatustype[i].Id);
                                        }
                                    }
                                    setTimeout(function() {
                                        $('.fullScreenSpin').css('display', 'none');
                                        $('#newStatusPopModal').modal('toggle');
                                    }, 200);
                                });
                            });
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newStatusPopModal').modal('toggle');
                            }, 200);

                        } else {
                            $('#statusPopModal').modal();
                            setTimeout(function() {
                                $('#tblStatusPopList_filter .form-control-sm').focus();
                                $('#tblStatusPopList_filter .form-control-sm').val('');
                                $('#tblStatusPopList_filter .form-control-sm').trigger("input");
                                var datatable = $('#tblStatusPopList').DataTable();

                                datatable.draw();
                                $('#tblStatusPopList_filter .form-control-sm').trigger("input");

                            }, 500);
                        }
                    }
                });

    $('#edtSupplierName').editableSelect().on('click.editable-select', function(e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        $('#edtSupplierPOPID').val('');
        var supplierDataName = e.target.value || '';
        var supplierDataID = $('#edtSupplierName').attr('suppid').replace(/\s/g, '') || '';
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
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
                //FlowRouter.go('/supplierscard?name=' + e.target.value);
                getVS1Data('TSupplierVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getOneSupplierDataExByName(supplierDataName).then(function(data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];

                            $('#add-supplier-title').text('Edit Supplier');
                            let popSupplierID = data.tsupplier[0].fields.ID || '';
                            let popSupplierName = data.tsupplier[0].fields.ClientName || '';
                            let popSupplierEmail = data.tsupplier[0].fields.Email || '';
                            let popSupplierTitle = data.tsupplier[0].fields.Title || '';
                            let popSupplierFirstName = data.tsupplier[0].fields.FirstName || '';
                            let popSupplierMiddleName = data.tsupplier[0].fields.CUSTFLD10 || '';
                            let popSupplierLastName = data.tsupplier[0].fields.LastName || '';
                            let popSuppliertfn = '' || '';
                            let popSupplierPhone = data.tsupplier[0].fields.Phone || '';
                            let popSupplierMobile = data.tsupplier[0].fields.Mobile || '';
                            let popSupplierFaxnumber = data.tsupplier[0].fields.Faxnumber || '';
                            let popSupplierSkypeName = data.tsupplier[0].fields.SkypeName || '';
                            let popSupplierURL = data.tsupplier[0].fields.URL || '';
                            let popSupplierStreet = data.tsupplier[0].fields.Street || '';
                            let popSupplierStreet2 = data.tsupplier[0].fields.Street2 || '';
                            let popSupplierState = data.tsupplier[0].fields.State || '';
                            let popSupplierPostcode = data.tsupplier[0].fields.Postcode || '';
                            let popSupplierCountry = data.tsupplier[0].fields.Country || LoggedCountry;
                            let popSupplierbillingaddress = data.tsupplier[0].fields.BillStreet || '';
                            let popSupplierbcity = data.tsupplier[0].fields.BillStreet2 || '';
                            let popSupplierbstate = data.tsupplier[0].fields.BillState || '';
                            let popSupplierbpostalcode = data.tsupplier[0].fields.BillPostcode || '';
                            let popSupplierbcountry = data.tsupplier[0].fields.Billcountry || LoggedCountry;
                            let popSuppliercustfield1 = data.tsupplier[0].fields.CUSTFLD1 || '';
                            let popSuppliercustfield2 = data.tsupplier[0].fields.CUSTFLD2 || '';
                            let popSuppliercustfield3 = data.tsupplier[0].fields.CUSTFLD3 || '';
                            let popSuppliercustfield4 = data.tsupplier[0].fields.CUSTFLD4 || '';
                            let popSuppliernotes = data.tsupplier[0].fields.Notes || '';
                            let popSupplierpreferedpayment = data.tsupplier[0].fields.PaymentMethodName || '';
                            let popSupplierterms = data.tsupplier[0].fields.TermsName || '';
                            let popSupplierdeliverymethod = data.tsupplier[0].fields.ShippingMethodName || '';
                            let popSupplieraccountnumber = data.tsupplier[0].fields.ClientNo || '';
                            let popSupplierisContractor = data.tsupplier[0].fields.Contractor || false;
                            let popSupplierissupplier = data.tsupplier[0].fields.IsSupplier || false;
                            let popSupplieriscustomer = data.tsupplier[0].fields.IsCustomer || false;

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

                            if ((data.tsupplier[0].fields.Street == data.tsupplier[0].fields.BillStreet) && (data.tsupplier[0].fields.Street2 == data.tsupplier[0].fields.BillStreet2) &&
                                (data.tsupplier[0].fields.State == data.tsupplier[0].fields.BillState) && (data.tsupplier[0].fields.Postcode == data.tsupplier[0].fields.Postcode) &&
                                (data.tsupplier[0].fields.Country == data.tsupplier[0].fields.Billcountry)) {
                                //templateObject.isSameAddress.set(true);
                                $('#chkSameAsShipping').attr("checked", "checked");
                            }
                            if (data.tsupplier[0].fields.Contractor == true) {
                                // $('#isformcontractor')
                                $('#isformcontractor').attr("checked", "checked");
                            } else {
                                $('#isformcontractor').removeAttr("checked");
                            }

                            setTimeout(function() {
                                $('#addSupplierModal').modal('show');
                            }, 200);



                        }).catch(function(err) {

                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tsuppliervs1;
                        var added = false;
                        for (let i = 0; i < data.tsuppliervs1.length; i++) {
                            if ((data.tsuppliervs1[i].fields.ClientName) === supplierDataName) {
                                added = true;
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                $('#add-supplier-title').text('Edit Supplier');
                                let popSupplierID = data.tsuppliervs1[i].fields.ID || '';
                                let popSupplierName = data.tsuppliervs1[i].fields.ClientName || '';
                                let popSupplierEmail = data.tsuppliervs1[i].fields.Email || '';
                                let popSupplierTitle = data.tsuppliervs1[i].fields.Title || '';
                                let popSupplierFirstName = data.tsuppliervs1[i].fields.FirstName || '';
                                let popSupplierMiddleName = data.tsuppliervs1[i].fields.CUSTFLD10 || '';
                                let popSupplierLastName = data.tsuppliervs1[i].fields.LastName || '';
                                let popSuppliertfn = '' || '';
                                let popSupplierPhone = data.tsuppliervs1[i].fields.Phone || '';
                                let popSupplierMobile = data.tsuppliervs1[i].fields.Mobile || '';
                                let popSupplierFaxnumber = data.tsuppliervs1[i].fields.Faxnumber || '';
                                let popSupplierSkypeName = data.tsuppliervs1[i].fields.SkypeName || '';
                                let popSupplierURL = data.tsuppliervs1[i].fields.URL || '';
                                let popSupplierStreet = data.tsuppliervs1[i].fields.Street || '';
                                let popSupplierStreet2 = data.tsuppliervs1[i].fields.Street2 || '';
                                let popSupplierState = data.tsuppliervs1[i].fields.State || '';
                                let popSupplierPostcode = data.tsuppliervs1[i].fields.Postcode || '';
                                let popSupplierCountry = data.tsuppliervs1[i].fields.Country || LoggedCountry;
                                let popSupplierbillingaddress = data.tsuppliervs1[i].fields.BillStreet || '';
                                let popSupplierbcity = data.tsuppliervs1[i].fields.BillStreet2 || '';
                                let popSupplierbstate = data.tsuppliervs1[i].fields.BillState || '';
                                let popSupplierbpostalcode = data.tsuppliervs1[i].fields.BillPostcode || '';
                                let popSupplierbcountry = data.tsuppliervs1[i].fields.Billcountry || LoggedCountry;
                                let popSuppliercustfield1 = data.tsuppliervs1[i].fields.CUSTFLD1 || '';
                                let popSuppliercustfield2 = data.tsuppliervs1[i].fields.CUSTFLD2 || '';
                                let popSuppliercustfield3 = data.tsuppliervs1[i].fields.CUSTFLD3 || '';
                                let popSuppliercustfield4 = data.tsuppliervs1[i].fields.CUSTFLD4 || '';
                                let popSuppliernotes = data.tsuppliervs1[i].fields.Notes || '';
                                let popSupplierpreferedpayment = data.tsuppliervs1[i].fields.PaymentMethodName || '';
                                let popSupplierterms = data.tsuppliervs1[i].fields.TermsName || '';
                                let popSupplierdeliverymethod = data.tsuppliervs1[i].fields.ShippingMethodName || '';
                                let popSupplieraccountnumber = data.tsuppliervs1[i].fields.ClientNo || '';
                                let popSupplierisContractor = data.tsuppliervs1[i].fields.Contractor || false;
                                let popSupplierissupplier = data.tsuppliervs1[i].fields.IsSupplier || false;
                                let popSupplieriscustomer = data.tsuppliervs1[i].fields.IsCustomer || false;

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

                                if ((data.tsuppliervs1[i].fields.Street == data.tsuppliervs1[i].fields.BillStreet) && (data.tsuppliervs1[i].fields.Street2 == data.tsuppliervs1[i].fields.BillStreet2) &&
                                    (data.tsuppliervs1[i].fields.State == data.tsuppliervs1[i].fields.BillState) && (data.tsuppliervs1[i].fields.Postcode == data.tsuppliervs1[i].fields.Postcode) &&
                                    (data.tsuppliervs1[i].fields.Country == data.tsuppliervs1[i].fields.Billcountry)) {
                                    //templateObject.isSameAddress.set(true);
                                    $('#chkSameAsShipping').attr("checked", "checked");
                                }
                                if (data.tsuppliervs1[i].fields.Contractor == true) {
                                    // $('#isformcontractor')
                                    $('#isformcontractor').attr("checked", "checked");
                                } else {
                                    $('#isformcontractor').removeAttr("checked");
                                }

                                setTimeout(function() {
                                    $('#addSupplierModal').modal('show');
                                }, 200);
                            }
                        }

                        if (!added) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getOneSupplierDataExByName(supplierDataName).then(function(data) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];

                                $('#add-supplier-title').text('Edit Supplier');
                                let popSupplierID = data.tsupplier[0].fields.ID || '';
                                let popSupplierName = data.tsupplier[0].fields.ClientName || '';
                                let popSupplierEmail = data.tsupplier[0].fields.Email || '';
                                let popSupplierTitle = data.tsupplier[0].fields.Title || '';
                                let popSupplierFirstName = data.tsupplier[0].fields.FirstName || '';
                                let popSupplierMiddleName = data.tsupplier[0].fields.CUSTFLD10 || '';
                                let popSupplierLastName = data.tsupplier[0].fields.LastName || '';
                                let popSuppliertfn = '' || '';
                                let popSupplierPhone = data.tsupplier[0].fields.Phone || '';
                                let popSupplierMobile = data.tsupplier[0].fields.Mobile || '';
                                let popSupplierFaxnumber = data.tsupplier[0].fields.Faxnumber || '';
                                let popSupplierSkypeName = data.tsupplier[0].fields.SkypeName || '';
                                let popSupplierURL = data.tsupplier[0].fields.URL || '';
                                let popSupplierStreet = data.tsupplier[0].fields.Street || '';
                                let popSupplierStreet2 = data.tsupplier[0].fields.Street2 || '';
                                let popSupplierState = data.tsupplier[0].fields.State || '';
                                let popSupplierPostcode = data.tsupplier[0].fields.Postcode || '';
                                let popSupplierCountry = data.tsupplier[0].fields.Country || LoggedCountry;
                                let popSupplierbillingaddress = data.tsupplier[0].fields.BillStreet || '';
                                let popSupplierbcity = data.tsupplier[0].fields.BillStreet2 || '';
                                let popSupplierbstate = data.tsupplier[0].fields.BillState || '';
                                let popSupplierbpostalcode = data.tsupplier[0].fields.BillPostcode || '';
                                let popSupplierbcountry = data.tsupplier[0].fields.Billcountry || LoggedCountry;
                                let popSuppliercustfield1 = data.tsupplier[0].fields.CUSTFLD1 || '';
                                let popSuppliercustfield2 = data.tsupplier[0].fields.CUSTFLD2 || '';
                                let popSuppliercustfield3 = data.tsupplier[0].fields.CUSTFLD3 || '';
                                let popSuppliercustfield4 = data.tsupplier[0].fields.CUSTFLD4 || '';
                                let popSuppliernotes = data.tsupplier[0].fields.Notes || '';
                                let popSupplierpreferedpayment = data.tsupplier[0].fields.PaymentMethodName || '';
                                let popSupplierterms = data.tsupplier[0].fields.TermsName || '';
                                let popSupplierdeliverymethod = data.tsupplier[0].fields.ShippingMethodName || '';
                                let popSupplieraccountnumber = data.tsupplier[0].fields.ClientNo || '';
                                let popSupplierisContractor = data.tsupplier[0].fields.Contractor || false;
                                let popSupplierissupplier = data.tsupplier[0].fields.IsSupplier || false;
                                let popSupplieriscustomer = data.tsupplier[0].fields.IsCustomer || false;

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

                                if ((data.tsupplier[0].fields.Street == data.tsupplier[0].fields.BillStreet) && (data.tsupplier[0].fields.Street2 == data.tsupplier[0].fields.BillStreet2) &&
                                    (data.tsupplier[0].fields.State == data.tsupplier[0].fields.BillState) && (data.tsupplier[0].fields.Postcode == data.tsupplier[0].fields.Postcode) &&
                                    (data.tsupplier[0].fields.Country == data.tsupplier[0].fields.Billcountry)) {
                                    //templateObject.isSameAddress.set(true);
                                    $('#chkSameAsShipping').attr("checked", "checked");
                                }
                                if (data.tsupplier[0].fields.Contractor == true) {
                                    // $('#isformcontractor')
                                    $('#isformcontractor').attr("checked", "checked");
                                } else {
                                    $('#isformcontractor').removeAttr("checked");
                                }

                                setTimeout(function() {
                                    $('#addSupplierModal').modal('show');
                                }, 200);
                            }).catch(function(err) {

                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                    }
                }).catch(function(err) {

                    sideBarService.getOneSupplierDataExByName(supplierDataName).then(function(data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];

                        $('#add-supplier-title').text('Edit Supplier');
                        let popSupplierID = data.tsupplier[0].fields.ID || '';
                        let popSupplierName = data.tsupplier[0].fields.ClientName || '';
                        let popSupplierEmail = data.tsupplier[0].fields.Email || '';
                        let popSupplierTitle = data.tsupplier[0].fields.Title || '';
                        let popSupplierFirstName = data.tsupplier[0].fields.FirstName || '';
                        let popSupplierMiddleName = data.tsupplier[0].fields.CUSTFLD10 || '';
                        let popSupplierLastName = data.tsupplier[0].fields.LastName || '';
                        let popSuppliertfn = '' || '';
                        let popSupplierPhone = data.tsupplier[0].fields.Phone || '';
                        let popSupplierMobile = data.tsupplier[0].fields.Mobile || '';
                        let popSupplierFaxnumber = data.tsupplier[0].fields.Faxnumber || '';
                        let popSupplierSkypeName = data.tsupplier[0].fields.SkypeName || '';
                        let popSupplierURL = data.tsupplier[0].fields.URL || '';
                        let popSupplierStreet = data.tsupplier[0].fields.Street || '';
                        let popSupplierStreet2 = data.tsupplier[0].fields.Street2 || '';
                        let popSupplierState = data.tsupplier[0].fields.State || '';
                        let popSupplierPostcode = data.tsupplier[0].fields.Postcode || '';
                        let popSupplierCountry = data.tsupplier[0].fields.Country || LoggedCountry;
                        let popSupplierbillingaddress = data.tsupplier[0].fields.BillStreet || '';
                        let popSupplierbcity = data.tsupplier[0].fields.BillStreet2 || '';
                        let popSupplierbstate = data.tsupplier[0].fields.BillState || '';
                        let popSupplierbpostalcode = data.tsupplier[0].fields.BillPostcode || '';
                        let popSupplierbcountry = data.tsupplier[0].fields.Billcountry || LoggedCountry;
                        let popSuppliercustfield1 = data.tsupplier[0].fields.CUSTFLD1 || '';
                        let popSuppliercustfield2 = data.tsupplier[0].fields.CUSTFLD2 || '';
                        let popSuppliercustfield3 = data.tsupplier[0].fields.CUSTFLD3 || '';
                        let popSuppliercustfield4 = data.tsupplier[0].fields.CUSTFLD4 || '';
                        let popSuppliernotes = data.tsupplier[0].fields.Notes || '';
                        let popSupplierpreferedpayment = data.tsupplier[0].fields.PaymentMethodName || '';
                        let popSupplierterms = data.tsupplier[0].fields.TermsName || '';
                        let popSupplierdeliverymethod = data.tsupplier[0].fields.ShippingMethodName || '';
                        let popSupplieraccountnumber = data.tsupplier[0].fields.ClientNo || '';
                        let popSupplierisContractor = data.tsupplier[0].fields.Contractor || false;
                        let popSupplierissupplier = data.tsupplier[0].fields.IsSupplier || false;
                        let popSupplieriscustomer = data.tsupplier[0].fields.IsCustomer || false;

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

                        if ((data.tsupplier[0].fields.Street == data.tsupplier[0].fields.BillStreet) && (data.tsupplier[0].fields.Street2 == data.tsupplier[0].fields.BillStreet2) &&
                            (data.tsupplier[0].fields.State == data.tsupplier[0].fields.BillState) && (data.tsupplier[0].fields.Postcode == data.tsupplier[0].fields.Postcode) &&
                            (data.tsupplier[0].fields.Country == data.tsupplier[0].fields.Billcountry)) {
                            //templateObject.isSameAddress.set(true);
                            $('#chkSameAsShipping').attr("checked", "checked");
                        }
                        if (data.tsupplier[0].fields.Contractor == true) {
                            // $('#isformcontractor')
                            $('#isformcontractor').attr("checked", "checked");
                        } else {
                            $('#isformcontractor').removeAttr("checked");
                        }

                        setTimeout(function() {
                            $('#addSupplierModal').modal('show');
                        }, 200);


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


    });

    $(document).on("click", "#tblSupplierlist tbody tr", function(e) {
        let selectLineID = $('#supplierSelectLineID').val();
        var table = $(this);
        let utilityService = new UtilityService();
        let taxcodeList = templateObject.taxraterecords.get();
        let $tblrows = $("#tblPurchaseOrderLine tbody tr");
        var tableSupplier = $(this);
        $('#edtSupplierName').val(tableSupplier.find(".colCompany").text());
        $('#edtSupplierName').attr("suppid", tableSupplier.find(".colID").text());


        $('#edtSupplierEmail').val(tableSupplier.find(".colEmail").text());
        $('#edtSupplierEmail').attr('customerid', tableSupplier.find(".colID").text());
        $('#edtSupplierName').attr('suppid', tableSupplier.find(".colID").text());

        let postalAddress = tableSupplier.find(".colCompany").text() + '\n' + tableSupplier.find(".colStreetAddress").text() + '\n' + tableSupplier.find(".colCity").text() + ' ' + tableSupplier.find(".colState").text() + ' ' + tableSupplier.find(".colZipCode").text() + '\n' + tableSupplier.find(".colCountry").text();
        $('#txabillingAddress').val(postalAddress);
        $('#pdfSupplierAddress').html(postalAddress);
        $('.pdfSupplierAddress').text(postalAddress);
        $('#txaShipingInfo').val(postalAddress);
        $('#sltTerms').val(tableSupplier.find(".colSupplierTermName").text() || purchaseDefaultTerms);
        $('#supplierListModal').modal('toggle');

        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let taxGrandTotalPrint = 0;

        $tblrows.each(function(index) {
            var $tblrow = $(this);
            var qty = $tblrow.find(".lineQty").val() || 0;
            var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
            var taxcode = $tblrow.find(".lineTaxCode").val() || '';
            if($tblrow.find(".lineAccountName").val() == ''){
              $tblrow.find(".colAccountName").addClass('boldtablealertsborder');
            }
            if($tblrow.find(".lineProductName").val() == ''){
              $tblrow.find(".colProductName").addClass('boldtablealertsborder');
            }
            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {

                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;

                    }
                }
            }
            var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
            if ((taxrateamount == '') || (taxrateamount == ' ')) {
                var taxTotal = 0;
            } else {
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
            }
            let lineTotalAmount = subTotal + taxTotal;
            $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));

            let unitPriceIncCalc = Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount)||0;
            let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, ""))||0;
            let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc||0;
            $tblrow.find('.colUnitPriceExChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
            $tblrow.find('.colUnitPriceIncChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal));

            if (!isNaN(subTotal)) {
              $tblrow.find('.colAmountEx').text(utilityService.modifynegativeCurrencyFormat(subTotal));
              $tblrow.find('.colAmountInc').text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
                subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
            }

            if (!isNaN(taxTotal)) {
                taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
            }

            if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

            }
        });

        $('#tblSupplierlist_filter .form-control-sm').val('');
        setTimeout(function() {
            $('.btnRefreshSupplier').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    exportSalesToPdf = function() {
        let id = $('.printID').attr("id");

        var source = document.getElementById('html-2-pdfwrapper');
        let file = "Purchase Order.pdf";
        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            file = 'Purchase Order-' + id + '.pdf';
        }
        var opt = {
            margin: 0,
            filename: file,
            image: {
                type: 'jpeg',
                quality: 0.98
            },
            html2canvas: {
                scale: 2
            },
            jsPDF: {
                unit: 'in',
                format: 'a4',
                orientation: 'portrait'
            }
        };

        html2pdf().set(opt).from(source).save().then(function(dataObject) {
            $('#html-2-pdfwrapper').css('display', 'none');
            $('.fullScreenSpin').css('display', 'none');
        });

    };

    setTimeout(function() {

        var x = window.matchMedia("(max-width: 1024px)")

        function mediaQuery(x) {
            if (x.matches) {

                $("#colInvnoReference").removeClass("col-auto");
                $("#colInvnoReference").addClass("col-4");

                $("#colTermsVia").removeClass("col-auto");
                $("#colTermsVia").addClass("col-4");

                $("#colStatusDepartment").removeClass("col-auto");
                $("#colStatusDepartment").addClass("col-4");

                $("#colBillingAddress").removeClass("col-auto");
                $("#colBillingAddress").addClass("col-6");

                $("#colOrderDue").removeClass("col-auto");
                $("#colOrderDue").addClass("col-6");

                $("#fieldwidth").removeClass("billaddressfield");
                $("#fieldwidth").addClass("billaddressfield2");

            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 10);

    setTimeout(function() {

        var x = window.matchMedia("(max-width: 420px)")

        function mediaQuery(x) {
            if (x.matches) {

                $("#colInvnoReference").removeClass("col-auto");
                $("#colInvnoReference").addClass("col-12");

                $("#colTermsVia").removeClass("col-auto");
                $("#colTermsVia").addClass("col-12");

                $("#colStatusDepartment").removeClass("col-auto");
                $("#colStatusDepartment").addClass("col-12");

                $("#colBillingAddress").removeClass("col-auto");
                $("#colBillingAddress").addClass("col-12");

                $("#colOrderDue").removeClass("col-auto");
                $("#colOrderDue").addClass("col-12");

                $("#colSupplierName").removeClass("col-auto");
                $("#colSupplierName").addClass("col-12");

                $("#colSupplierEmail").removeClass("col-auto");
                $("#colSupplierEmail").addClass("col-12");

                $("#fieldwidth").removeClass("billaddressfield");
                $("#fieldwidth").addClass("billaddressfield2");

            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 10);

});
Template.purchaseordercard.onRendered(function() {
    let tempObj = Template.instance();
    let utilityService = new UtilityService();
    let productService = new ProductService();
    let purchaseService = new PurchaseBoardService();
    let tableProductList;
    var splashArrayProductList = new Array();
    var splashArrayTaxRateList = new Array();
    const taxCodesList = [];
    tempObj.getAllProducts = function() {
        getVS1Data('TProductVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                productService.getNewProductListVS1().then(function(data) {

                    let records = [];
                    let inventoryData = [];
                    for (let i = 0; i < data.tproductvs1.length; i++) {
                        var dataList = [
                            data.tproductvs1[i].ProductName || '-',
                            data.tproductvs1[i].SalesDescription || '',
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].BuyQty1Cost * 100) / 100),
                            utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].SellQty1Price * 100) / 100),
                            data.tproductvs1[i].TotalQtyInStock,
                            data.tproductvs1[i].TaxCodePurchase || ''
                        ];

                        splashArrayProductList.push(dataList);
                    }
                    localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

                    if (splashArrayProductList) {

                        $('#tblInventory').dataTable({
                            data: splashArrayProductList,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            paging: true,
                            "aaSorting": [],
                            "orderMulti": true,
                            columnDefs: [{
                                    className: "productName",
                                    "targets": [0]
                                },
                                {
                                    className: "productDesc",
                                    "targets": [1]
                                },
                                {
                                    className: "costPrice text-right",
                                    "targets": [2]
                                },
                                {
                                    className: "salePrice text-right",
                                    "targets": [3]
                                },
                                {
                                    className: "prdqty text-right",
                                    "targets": [4]
                                },
                                {
                                    className: "taxrate",
                                    "targets": [5]
                                }
                            ],
                            colReorder: true,
                            bStateSave: true,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [
                                [initialDatatableLoad, -1],
                                [initialDatatableLoad, "All"]
                            ],
                            info: true,
                            responsive: true,
                            "fnInitComplete": function() {
                                $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblInventory_filter");
                                $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventory_filter");
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
                for (let i = 0; i < useData.length; i++) {
                    var dataList = [
                        useData[i].fields.ProductName || '-',
                        useData[i].fields.SalesDescription || '',
                        utilityService.modifynegativeCurrencyFormat(Math.floor(useData[i].fields.BuyQty1Cost * 100) / 100),
                        utilityService.modifynegativeCurrencyFormat(Math.floor(useData[i].fields.SellQty1Price * 100) / 100),
                        useData[i].fields.TotalQtyInStock,
                        useData[i].fields.TaxCodePurchase || ''
                    ];

                    splashArrayProductList.push(dataList);
                }
                localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

                if (splashArrayProductList) {

                    $('#tblInventory').dataTable({
                        data: splashArrayProductList,

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [

                            {
                                className: "productName",
                                "targets": [0]
                            },
                            {
                                className: "productDesc",
                                "targets": [1]
                            },
                            {
                                className: "costPrice text-right",
                                "targets": [2]
                            },
                            {
                                className: "salePrice text-right",
                                "targets": [3]
                            },
                            {
                                className: "prdqty text-right",
                                "targets": [4]
                            },
                            {
                                className: "taxrate",
                                "targets": [5]
                            }
                        ],
                        colReorder: true,

                        bStateSave: true,

                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "fnInitComplete": function() {
                            $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblInventory_filter");
                            $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventory_filter");
                        }

                    });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');

                }
            }
        }).catch(function(err) {
            productService.getNewProductListVS1().then(function(data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.tproductvs1.length; i++) {
                    var dataList = [


                        data.tproductvs1[i].ProductName || '-',
                        data.tproductvs1[i].SalesDescription || '',
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].BuyQty1Cost * 100) / 100),
                        utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproductvs1[i].SellQty1Price * 100) / 100),
                        data.tproductvs1[i].TotalQtyInStock,
                        data.tproductvs1[i].TaxCodePurchase || ''
                    ];

                    splashArrayProductList.push(dataList);
                }
                localStorage.setItem('VS1SalesProductList', JSON.stringify(splashArrayProductList));

                if (splashArrayProductList) {

                    $('#tblInventory').dataTable({
                        data: splashArrayProductList,

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [

                            {
                                className: "productName",
                                "targets": [0]
                            },
                            {
                                className: "productDesc",
                                "targets": [1]
                            },
                            {
                                className: "costPrice text-right",
                                "targets": [2]
                            },
                            {
                                className: "salePrice text-right",
                                "targets": [3]
                            },
                            {
                                className: "prdqty text-right",
                                "targets": [4]
                            },
                            {
                                className: "taxrate",
                                "targets": [5]
                            }
                        ],
                        colReorder: true,



                        bStateSave: true,


                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "fnInitComplete": function() {
                            $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#newProductModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblInventory_filter");
                            $("<button class='btn btn-primary btnRefreshProduct' type='button' id='btnRefreshProduct' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblInventory_filter");
                        }

                    });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');






                }
            })
        });
    };

    //tempObj.getAllProducts();



    tempObj.getAllTaxCodes = function() {
        getVS1Data('TTaxcodeVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                purchaseService.getTaxCodesVS1().then(function(data) {

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
                    tempObj.taxraterecords.set(taxCodesList);


                    if (splashArrayTaxRateList) {

                        $('#tblTaxRate').DataTable({
                            data: splashArrayTaxRateList,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            paging: true,
                            "aaSorting": [],
                            "orderMulti": true,
                            columnDefs: [{
                                    orderable: false,
                                    targets: 0
                                },
                                {
                                    className: "taxName",
                                    "targets": [1]
                                },
                                {
                                    className: "taxDesc",
                                    "targets": [2]
                                },
                                {
                                    className: "taxRate text-right",
                                    "targets": [3]
                                }
                            ],
                            colReorder: true,



                            bStateSave: true,


                            pageLength: initialDatatableLoad,
                            lengthMenu: [
                                [initialDatatableLoad, -1],
                                [initialDatatableLoad, "All"]
                            ],
                            info: true,
                            responsive: true,
                            "fnInitComplete": function() {
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
                tempObj.taxraterecords.set(taxCodesList);


                if (splashArrayTaxRateList) {

                    $('#tblTaxRate').DataTable({
                        data: splashArrayTaxRateList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [{
                                orderable: false,
                                targets: 0
                            },
                            {
                                className: "taxName",
                                "targets": [1]
                            },
                            {
                                className: "taxDesc",
                                "targets": [2]
                            },
                            {
                                className: "taxRate text-right",
                                "targets": [3]
                            }
                        ],
                        colReorder: true,



                        bStateSave: true,


                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "fnInitComplete": function() {
                          $("<button class='btn btn-primary btnAddNewTaxRate' data-dismiss='modal' data-toggle='modal' data-target='#newTaxRateModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblTaxRate_filter");
                          $("<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTaxRate_filter");
                        }

                    });






                }

            }
        }).catch(function(err) {
            purchaseService.getTaxCodesVS1().then(function(data) {

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
                tempObj.taxraterecords.set(taxCodesList);


                if (splashArrayTaxRateList) {

                    $('#tblTaxRate').DataTable({
                        data: splashArrayTaxRateList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [{
                                orderable: false,
                                targets: 0
                            },
                            {
                                className: "taxName",
                                "targets": [1]
                            },
                            {
                                className: "taxDesc",
                                "targets": [2]
                            },
                            {
                                className: "taxRate text-right",
                                "targets": [3]
                            }
                        ],
                        colReorder: true,



                        bStateSave: true,


                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "fnInitComplete": function() {
                          $("<button class='btn btn-primary btnAddNewTaxRate' data-dismiss='modal' data-toggle='modal' data-target='#newTaxRateModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblTaxRate_filter");
                          $("<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblTaxRate_filter");
                        }

                    });






                }
            })
        });

    };
    tempObj.getAllTaxCodes();

});
Template.purchaseordercard.helpers({
    purchaseorderrecord: () => {
        return Template.instance().purchaseorderrecord.get();
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b) {
            if (a.department == 'NA') {
                return 1;
            } else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    viarecords: () => {
        return Template.instance().viarecords.get().sort(function(a, b) {
            if (a.shippingmethod == 'NA') {
                return 1;
            } else if (b.shippingmethod == 'NA') {
                return -1;
            }
            return (a.shippingmethod.toUpperCase() > b.shippingmethod.toUpperCase()) ? 1 : -1;
        });
    },
    termrecords: () => {
        return Template.instance().termrecords.get().sort(function(a, b) {
            if (a.termsname == 'NA') {
                return 1;
            } else if (b.termsname == 'NA') {
                return -1;
            }
            return (a.termsname.toUpperCase() > b.termsname.toUpperCase()) ? 1 : -1;
        });
    },
    purchaseCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'purchaseordercard'
        });
    },
    purchaseCloudGridPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblPurchaseOrderLine'
        });
    },
    uploadedFiles: () => {
        return Template.instance().uploadedFiles.get();
    },
    attachmentCount: () => {
        return Template.instance().attachmentCount.get();
    },
    uploadedFile: () => {
        return Template.instance().uploadedFile.get();
    },
    statusrecords: () => {
        return Template.instance().statusrecords.get().sort(function(a, b) {
            if (a.orderstatus == 'NA') {
                return 1;
            } else if (b.orderstatus == 'NA') {
                return -1;
            }
            return (a.orderstatus.toUpperCase() > b.orderstatus.toUpperCase()) ? 1 : -1;
        });
    },
    includeBOnShippedQty: () => {
        return Template.instance().includeBOnShippedQty.get();
    },
    companyaddress1: () => {
        return Session.get('vs1companyaddress1');
    },
    companyaddress2: () => {
        return Session.get('vs1companyaddress2');
    },
     city: () => {
        return Session.get('vs1companyCity');
    },
    state: () => {
        return Session.get('companyState');
    },
     poBox: () => {
        return Session.get('vs1companyPOBox');
    },
    companyphone: () => {
        return Session.get('vs1companyPhone');
    },
    companyabn: () => { //Update Company ABN
            let countryABNValue = "ABN: " + Session.get('vs1companyABN');
            if (LoggedCountry == "South Africa") {
                countryABNValue = "Vat No: " + Session.get('vs1companyABN');;
            }

            return countryABNValue;
        },
        companyReg: () => { //Add Company Reg
            let countryRegValue = '';
            if (LoggedCountry == "South Africa") {
                countryRegValue = "Reg No: " + Session.get('vs1companyReg');
            }

            return countryRegValue;
    },
    organizationname: () => {
        return Session.get('vs1companyName');
    },
    organizationurl: () => {
        return Session.get('vs1companyURL');
    },
    isMobileDevices: () => {
        var isMobile = false;

        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }

        return isMobile;
    },
    isCurrencyEnable: () => {
        return Session.get('CloudUseForeignLicence');
    }
});

Template.purchaseordercard.events({
    // 'click #sltTerms': function(event) {
    //     $('#termsListModal').modal('toggle');
    // },
    'click #sltCurrency': function(event) {
        $('#currencyModal').modal('toggle');
    },
    // 'click #sltDept': function(event) {
    //     $('#departmentModal').modal('toggle');
    // },
    // 'click #sltStatus': function(event) {
    //     $('#statusPopModal').modal('toggle');
    // },
    'click #edtSupplierName': function(event) {
        $('#edtSupplierName').select();
        $('#edtSupplierName').editableSelect();
    },
    'change #sltStatus': function() {
        let status = $('#sltStatus').find(":selected").val();
        if (status == "newstatus") {
            $('#statusModal').modal();
        }
    },
    'blur .lineProductDesc': function(event) {
        var targetID = $(event.target).closest('tr').attr('id');
        $('#' + targetID + " #lineProductDesc").text($('#' + targetID + " .lineProductDesc").text());
    },
    'blur .lineQty': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        let $tblrows = $("#tblPurchaseOrderLine tbody tr");
        let $printrows = $(".purchase_print tbody tr");
        let isBOnShippedQty = templateObject.includeBOnShippedQty.get();
        var targetID = $(event.target).closest('tr').attr('id');
        if (isBOnShippedQty == true) {
            let qtyOrdered = $('#' + targetID + " .lineOrdered").val();
            let qtyBO = $('#' + targetID + " .lineBo").val();
            let qtyShipped = $('#' + targetID + " .lineQty").val();
            let boValue = '';

            if ((qtyOrdered == '') || (isNaN(qtyOrdered))) {
                qtyOrdered = 0;
            }
            if (parseInt(qtyOrdered) < parseInt(qtyShipped)) {
                $('#' + targetID + " .lineQty").val(qtyOrdered);
                $('#' + targetID + " .lineBo").val(0);
            } else if (parseInt(qtyShipped) <= parseInt(qtyOrdered)) {
                boValue = parseInt(qtyOrdered) - parseInt(qtyShipped);
                $('#' + targetID + " .lineBo").text(boValue);
            }
        }

        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            $('#' + targetID + " #lineQty").text($('#' + targetID + " .lineQty").val());
        }

        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let taxGrandTotalPrint = 0;

        $tblrows.each(function(index) {
            var $tblrow = $(this);
            var qty = $tblrow.find(".lineQty").val() || 0;
            var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
            var taxcode = $tblrow.find(".lineTaxCode").val() || 0;

            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                    }
                }
            }


            var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
            var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
            let lineTotalAmount = subTotal + taxTotal;
            $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));

            let unitPriceIncCalc = Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount)||0;
            let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, ""))||0;
            let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc||0;
            $tblrow.find('.colUnitPriceExChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
            $tblrow.find('.colUnitPriceIncChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal));

            if (!isNaN(subTotal)) {
              $tblrow.find('.colAmountEx').text(utilityService.modifynegativeCurrencyFormat(subTotal));
              $tblrow.find('.colAmountInc').text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
                subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
            }

            if (!isNaN(taxTotal)) {
                taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
            }

            if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

            }
        });

        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            $printrows.each(function(index) {
                var $printrows = $(this);
                var qty = $printrows.find("#lineQty").text() || 0;
                var price = $printrows.find("#lineUnitPrice").text() || 0;
                var taxrateamount = 0;
                var taxRate = $printrows.find("#lineTaxCode").text();
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxRate) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }

                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))
                if (!isNaN(subTotal)) {
                    $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                }
                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                    //document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);


                }
            });
        }

    },
    'change .colUnitPriceExChange': function(event) {

        let utilityService = new UtilityService();
        if (!isNaN($(event.target).val())) {
            let inputUnitPrice = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;

            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));


        }
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();

        let $tblrows = $("#tblPurchaseOrderLine tbody tr");
        let $printrows = $(".purchase_print tbody tr");
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID

        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let taxGrandTotalPrint = 0;

        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            $('#' + targetID + " #lineUnitPrice").text($('#' + targetID + " .colUnitPriceExChange").val());
        }

        $tblrows.each(function(index) {
            var $tblrow = $(this);
            var qty = $tblrow.find(".lineQty").val() || 0;
            var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
            var taxcode = $tblrow.find(".lineTaxCode").val() || 0;

            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                    }
                }
            }


            var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
            var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
            let lineTotalAmount = subTotal + taxTotal;
            $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));

            let unitPriceIncCalc = Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount)||0;
            let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, ""))||0;
            let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc||0;
            $tblrow.find('.colUnitPriceExChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
            $tblrow.find('.colUnitPriceIncChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal));

            if (!isNaN(subTotal)) {
              $tblrow.find('.colAmountEx').text(utilityService.modifynegativeCurrencyFormat(subTotal));
              $tblrow.find('.colAmountInc').text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
                subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
            }

            if (!isNaN(taxTotal)) {
                taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
            }

            if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

            }
        });

        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            $printrows.each(function(index) {
                var $printrows = $(this);
                var qty = $printrows.find("#lineQty").text() || 0;
                var price = $printrows.find("#lineUnitPrice").text() || "0";
                var taxrateamount = 0;
                var taxRate = $printrows.find("#lineTaxCode").text();
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxRate) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }

                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))
                if (!isNaN(subTotal)) {
                    $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                }
                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                    //document.getElementById("totalTax").innerHTML = $('#subtotal_tax').text();
                    //document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    //document.getElementById("totalBalanceDuePrint").innerHTML = $('#totalBalanceDue').text();

                }
            });
        }
    },
    'change .colUnitPriceIncChange': function(event) {

        let utilityService = new UtilityService();
        if (!isNaN($(event.target).val())) {
            let inputUnitPrice = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;

            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));


        }
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();

        let $tblrows = $("#tblPurchaseOrderLine tbody tr");
        let $printrows = $(".purchase_print tbody tr");
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID

        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;
        let taxGrandTotalPrint = 0;

        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            $('#' + targetID + " #lineUnitPrice").text($('#' + targetID + " .colUnitPriceExChange").val());
        }

        $tblrows.each(function(index) {
            var $tblrow = $(this);
            var qty = $tblrow.find(".lineQty").val() || 0;
            var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
            var taxcode = $tblrow.find(".lineTaxCode").val() || 0;

            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate.replace('%', "");
                    }
                }
            }


            let taxRateAmountCalc = (parseFloat(taxrateamount) + 100)/100;

            var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) / (taxRateAmountCalc) || 0;
            var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) - parseFloat(subTotal) ||0;

            var subTotalExQty = (parseFloat(price.replace(/[^0-9.-]+/g, "")) / (taxRateAmountCalc)) || 0;
            var taxTotalExQty = parseFloat(price.replace(/[^0-9.-]+/g, "")) - parseFloat(subTotalExQty) ||0;

            let lineTotalAmount = subTotal + taxTotal;
            $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));

            let lineUnitPriceIncVal = Number(price.replace(/[^0-9.-]+/g, ""))||0;
            let lineUnitPriceExVal = lineUnitPriceIncVal - taxTotalExQty||0;
            $tblrow.find('.colUnitPriceExChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
            $tblrow.find('.colUnitPriceIncChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal));

            if (!isNaN(subTotal)) {
              $tblrow.find('.colAmountEx').text(utilityService.modifynegativeCurrencyFormat(subTotal));
              $tblrow.find('.colAmountInc').text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
                subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
            }

            if (!isNaN(taxTotal)) {
                taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
            }

            if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

            }
        });

        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            $printrows.each(function(index) {
                var $printrows = $(this);
                var qty = $printrows.find("#lineQty").text() || 0;
                var price = $printrows.find("#lineUnitPrice").text() || "0";
                var taxrateamount = 0;
                var taxRate = $printrows.find("#lineTaxCode").text();
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxRate) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }

                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))
                if (!isNaN(subTotal)) {
                    $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                }
                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                    //document.getElementById("totalTax").innerHTML = $('#subtotal_tax').text();
                    //document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    //document.getElementById("totalBalanceDuePrint").innerHTML = $('#totalBalanceDue').text();

                }
            });
        }
    },
    'click .th.colAmountEx': function(event) {
        $('.colAmountEx').addClass('hiddenColumn');
        $('.colAmountEx').removeClass('showColumn');

        $('.colAmountInc').addClass('showColumn');
        $('.colAmountInc').removeClass('hiddenColumn');
    },
    'click .th.colAmountInc': function(event) {
        $('.colAmountInc').addClass('hiddenColumn');
        $('.colAmountInc').removeClass('showColumn');

        $('.colAmountEx').addClass('showColumn');
        $('.colAmountEx').removeClass('hiddenColumn');
    },
    'click .th.colUnitPriceEx': function(event) {
        $('.colUnitPriceEx').addClass('hiddenColumn');
        $('.colUnitPriceEx').removeClass('showColumn');

        $('.colUnitPriceInc').addClass('showColumn');
        $('.colUnitPriceInc').removeClass('hiddenColumn');
    },
    'click .th.colUnitPriceInc': function(event) {
        $('.colUnitPriceInc').addClass('hiddenColumn');
        $('.colUnitPriceInc').removeClass('showColumn');

        $('.colUnitPriceEx').addClass('showColumn');
        $('.colUnitPriceEx').removeClass('hiddenColumn');
    },
    'click #btnCustomFileds': function(event) {
        var x = document.getElementById("divCustomFields");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    },
    'click .lineProductName, keydown .lineProductName': function(event) {
      var $earch = $(event.currentTarget);
      var offset = $earch.offset();
        let suppliername = $('#edtSupplierName').val();
        $("#selectProductID").val('');
        if (suppliername === '') {
            swal('Supplier has not been selected!', '', 'warning');
            event.preventDefault();
        } else {
            var productDataName = $(event.target).val() || '';
            if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
              $('#productListModal').modal('toggle');
              var targetID = $(event.target).closest('tr').attr('id');
              $('#selectLineID').val(targetID);
              setTimeout(function() {
                  $('#tblInventory_filter .form-control-sm').focus();
                  $('#tblInventory_filter .form-control-sm').val('');
                  $('#tblInventory_filter .form-control-sm').trigger("input");

                  var datatable = $('#tblInventory').DataTable();
                  datatable.draw();
                  $('#tblInventory_filter .form-control-sm').trigger("input");

              }, 500);
         } else {
            if (productDataName.replace(/\s/g, '') != '') {
                //FlowRouter.go('/productview?prodname=' + $(event.target).text());
                let lineExtaSellItems = [];
                let lineExtaSellObj = {};
                $('.fullScreenSpin').css('display', 'inline-block');
                  getVS1Data('TProductVS1').then(function (dataObject) {
                    if(dataObject.length == 0){
                      sideBarService.getOneProductdatavs1byname(productDataName).then(function (data) {
                          $('.fullScreenSpin').css('display','none');
                          let lineItems = [];
                          let lineItemObj = {};
                          let currencySymbol = Currency;
                          let totalquantity = 0;
                          let productname = data.tproduct[0].fields.ProductName||'';
                          let  productcode = data.tproduct[0].fields.PRODUCTCODE||'';
                          let  productprintName = data.tproduct[0].fields.ProductPrintName||'';
                          let  assetaccount = data.tproduct[0].fields.AssetAccount||'';
                          let  buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost)||0;
                          let  cogsaccount= data.tproduct[0].fields.CogsAccount||'';
                          let  taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase||'';
                          let  purchasedescription = data.tproduct[0].fields.PurchaseDescription||'';
                          let  sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price)||0;
                          let  incomeaccount = data.tproduct[0].fields.IncomeAccount||'';
                          let  taxcodesales = data.tproduct[0].fields.TaxCodeSales||'';
                          let  salesdescription = data.tproduct[0].fields.SalesDescription||'';
                          let  active = data.tproduct[0].fields.Active;
                          let  lockextrasell = data.tproduct[0].fields.LockExtraSell||'';
                          let  customfield1 = data.tproduct[0].fields.CUSTFLD1||'';
                          let  customfield2 = data.tproduct[0].fields.CUSTFLD2||'';
                          let  barcode=data.tproduct[0].fields.BARCODE||'';
                          $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                          $('#add-product-title').text('Edit Product');
                          $('#edtproductname').val(productname);
                          $('#edtsellqty1price').val(sellqty1price);
                          $('#txasalesdescription').val(salesdescription);
                          $('#sltsalesacount').val(incomeaccount);
                          $('#slttaxcodesales').val(taxcodesales);
                          $('#edtbarcode').val(barcode);
                          $('#txapurchasedescription').val(purchasedescription);
                          $('#sltcogsaccount').val(cogsaccount);
                          $('#slttaxcodepurchase').val(taxcodepurchase);
                          $('#edtbuyqty1cost').val(buyqty1cost);

                          setTimeout(function() {
                            $('#newProductModal').modal('show');
                          }, 500);
                      }).catch(function (err) {

                          $('.fullScreenSpin').css('display','none');
                      });
                    }else{
                      let data = JSON.parse(dataObject[0].data);
                      let useData = data.tproductvs1;
                      var added=false;

                      for(let i=0; i<data.tproductvs1.length; i++){
                        if(data.tproductvs1[i].fields.ProductName === productDataName){
                          added = true;
                          $('.fullScreenSpin').css('display','none');
                          let lineItems = [];
                          let lineItemObj = {};
                          let currencySymbol = Currency;
                          let totalquantity = 0;

                          let productname = data.tproductvs1[i].fields.ProductName||'';
                          let  productcode = data.tproductvs1[i].fields.PRODUCTCODE||'';
                          let  productprintName = data.tproductvs1[i].fields.ProductPrintName||'';
                          let  assetaccount = data.tproductvs1[i].fields.AssetAccount||'';
                          let  buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.BuyQty1Cost)||0;
                          let  cogsaccount= data.tproductvs1[i].fields.CogsAccount||'';
                          let  taxcodepurchase = data.tproductvs1[i].fields.TaxCodePurchase||'';
                          let  purchasedescription = data.tproductvs1[i].fields.PurchaseDescription||'';
                          let  sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.SellQty1Price)||0;
                          let  incomeaccount = data.tproductvs1[i].fields.IncomeAccount||'';
                          let  taxcodesales = data.tproductvs1[i].fields.TaxCodeSales||'';
                          let  salesdescription = data.tproductvs1[i].fields.SalesDescription||'';
                          let  active = data.tproductvs1[i].fields.Active;
                          let  lockextrasell = data.tproductvs1[i].fields.LockExtraSell||'';
                          let  customfield1 = data.tproductvs1[i].fields.CUSTFLD1||'';
                          let  customfield2 = data.tproductvs1[i].fields.CUSTFLD2||'';
                          let  barcode=data.tproductvs1[i].fields.BARCODE||'';
                          $("#selectProductID").val(data.tproductvs1[i].fields.ID).trigger("change");
                          $('#add-product-title').text('Edit Product');
                          $('#edtproductname').val(productname);
                          $('#edtsellqty1price').val(sellqty1price);
                          $('#txasalesdescription').val(salesdescription);
                          $('#sltsalesacount').val(incomeaccount);
                          $('#slttaxcodesales').val(taxcodesales);
                          $('#edtbarcode').val(barcode);
                          $('#txapurchasedescription').val(purchasedescription);
                          $('#sltcogsaccount').val(cogsaccount);
                          $('#slttaxcodepurchase').val(taxcodepurchase);
                          $('#edtbuyqty1cost').val(buyqty1cost);

                          setTimeout(function() {
                              $('#newProductModal').modal('show');
                          }, 500);
                        }
                      }
                      if(!added) {
                        sideBarService.getOneProductdatavs1byname(productDataName).then(function (data) {
                            $('.fullScreenSpin').css('display','none');
                            let lineItems = [];
                            let lineItemObj = {};
                            let currencySymbol = Currency;
                            let totalquantity = 0;
                            let productname = data.tproduct[0].fields.ProductName||'';
                            let  productcode = data.tproduct[0].fields.PRODUCTCODE||'';
                            let  productprintName = data.tproduct[0].fields.ProductPrintName||'';
                            let  assetaccount = data.tproduct[0].fields.AssetAccount||'';
                            let  buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost)||0;
                            let  cogsaccount= data.tproduct[0].fields.CogsAccount||'';
                            let  taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase||'';
                            let  purchasedescription = data.tproduct[0].fields.PurchaseDescription||'';
                            let  sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price)||0;
                            let  incomeaccount = data.tproduct[0].fields.IncomeAccount||'';
                            let  taxcodesales = data.tproduct[0].fields.TaxCodeSales||'';
                            let  salesdescription = data.tproduct[0].fields.SalesDescription||'';
                            let  active = data.tproduct[0].fields.Active;
                            let  lockextrasell = data.tproduct[0].fields.LockExtraSell||'';
                            let  customfield1 = data.tproduct[0].fields.CUSTFLD1||'';
                            let  customfield2 = data.tproduct[0].fields.CUSTFLD2||'';
                            let  barcode=data.tproduct[0].fields.BARCODE||'';
                            $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                            $('#add-product-title').text('Edit Product');
                            $('#edtproductname').val(productname);
                            $('#edtsellqty1price').val(sellqty1price);
                            $('#txasalesdescription').val(salesdescription);
                            $('#sltsalesacount').val(incomeaccount);
                            $('#slttaxcodesales').val(taxcodesales);
                            $('#edtbarcode').val(barcode);
                            $('#txapurchasedescription').val(purchasedescription);
                            $('#sltcogsaccount').val(cogsaccount);
                            $('#slttaxcodepurchase').val(taxcodepurchase);
                            $('#edtbuyqty1cost').val(buyqty1cost);

                            setTimeout(function() {
                              $('#newProductModal').modal('show');
                            }, 500);
                        }).catch(function (err) {

                            $('.fullScreenSpin').css('display','none');
                        });
                      }
                    }
                  }).catch(function (err) {

                    sideBarService.getOneProductdatavs1byname(productDataName).then(function (data) {
                        $('.fullScreenSpin').css('display','none');
                        let lineItems = [];
                        let lineItemObj = {};
                        let currencySymbol = Currency;
                        let totalquantity = 0;
                        let productname = data.tproduct[0].fields.ProductName||'';
                        let  productcode = data.tproduct[0].fields.PRODUCTCODE||'';
                        let  productprintName = data.tproduct[0].fields.ProductPrintName||'';
                        let  assetaccount = data.tproduct[0].fields.AssetAccount||'';
                        let  buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost)||0;
                        let  cogsaccount= data.tproduct[0].fields.CogsAccount||'';
                        let  taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase||'';
                        let  purchasedescription = data.tproduct[0].fields.PurchaseDescription||'';
                        let  sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price)||0;
                        let  incomeaccount = data.tproduct[0].fields.IncomeAccount||'';
                        let  taxcodesales = data.tproduct[0].fields.TaxCodeSales||'';
                        let  salesdescription = data.tproduct[0].fields.SalesDescription||'';
                        let  active = data.tproduct[0].fields.Active;
                        let  lockextrasell = data.tproduct[0].fields.LockExtraSell||'';
                        let  customfield1 = data.tproduct[0].fields.CUSTFLD1||'';
                        let  customfield2 = data.tproduct[0].fields.CUSTFLD2||'';
                        let  barcode=data.tproduct[0].fields.BARCODE||'';
                        $("#selectProductID").val(data.tproduct[0].fields.ID).trigger("change");
                        $('#add-product-title').text('Edit Product');
                        $('#edtproductname').val(productname);
                        $('#edtsellqty1price').val(sellqty1price);
                        $('#txasalesdescription').val(salesdescription);
                        $('#sltsalesacount').val(incomeaccount);
                        $('#slttaxcodesales').val(taxcodesales);
                        $('#edtbarcode').val(barcode);
                        $('#txapurchasedescription').val(purchasedescription);
                        $('#sltcogsaccount').val(cogsaccount);
                        $('#slttaxcodepurchase').val(taxcodepurchase);
                        $('#edtbuyqty1cost').val(buyqty1cost);

                        setTimeout(function() {
                          $('#newProductModal').modal('show');
                        }, 500);
                    }).catch(function (err) {

                        $('.fullScreenSpin').css('display','none');
                    });

                  });
            } else {
                $('#productListModal').modal('toggle');
                var targetID = $(event.target).closest('tr').attr('id');
                $('#selectLineID').val(targetID);
                setTimeout(function() {
                    $('#tblInventory_filter .form-control-sm').focus();
                    $('#tblInventory_filter .form-control-sm').val('');
                    $('#tblInventory_filter .form-control-sm').trigger("input");

                    var datatable = $('#tblInventory').DataTable();
                    datatable.draw();
                    $('#tblInventory_filter .form-control-sm').trigger("input");

                }, 500);
            }
          }
        }
    },
    'click #productListModal #refreshpagelist': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        localStorage.setItem('VS1SalesProductList', '');
        let templateObject = Template.instance();
        Meteor._reload.reload();
        templateObject.getAllProducts();

    },
    'click .lineTaxRate': function(event) {
        $('#tblPurchaseOrderLine tbody tr .lineTaxRate').attr("data-toggle", "modal");
        $('#tblPurchaseOrderLine tbody tr .lineTaxRate').attr("data-target", "#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectLineID').val(targetID);
    },
    'click .lineTaxCode, keydown .lineTaxCode': function(event) {
       var $earch = $(event.currentTarget);
       var offset = $earch.offset();
       $('#edtTaxID').val('');
       $('.taxcodepopheader').text('New Tax Rate');
       $('#edtTaxID').val('');
       $('#edtTaxNamePop').val('');
       $('#edtTaxRatePop').val('');
       $('#edtTaxDescPop').val('');
       $('#edtTaxNamePop').attr('readonly', false);
       let purchaseService = new PurchaseBoardService();
       var taxRateDataName = $(event.target).val() || '';
       if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
           $('#taxRateListModal').modal('toggle');
           var targetID = $(event.target).closest('tr').attr('id');
           $('#selectLineID').val(targetID);
           setTimeout(function() {
               $('#tblTaxRate_filter .form-control-sm').focus();
               $('#tblTaxRate_filter .form-control-sm').val('');
               $('#tblTaxRate_filter .form-control-sm').trigger("input");

               var datatable = $('#tblTaxRate').DataTable();
               datatable.draw();
               $('#tblTaxRate_filter .form-control-sm').trigger("input");

           }, 500);
       } else {
           if (taxRateDataName.replace(/\s/g, '') != '') {

               getVS1Data('TTaxcodeVS1').then(function (dataObject) {
                 if(dataObject.length == 0){
                   purchaseService.getTaxCodesVS1().then(function (data) {
                     let lineItems = [];
                     let lineItemObj = {};
                     for(let i=0; i<data.ttaxcodevs1.length; i++){
                       if ((data.ttaxcodevs1[i].CodeName) === taxRateDataName) {
                         $('#edtTaxNamePop').attr('readonly', true);
                       let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                       var taxRateID = data.ttaxcodevs1[i].Id || '';
                        var taxRateName = data.ttaxcodevs1[i].CodeName ||'';
                        var taxRateDesc = data.ttaxcodevs1[i].Description || '';
                        $('#edtTaxID').val(taxRateID);
                        $('#edtTaxNamePop').val(taxRateName);
                        $('#edtTaxRatePop').val(taxRate);
                        $('#edtTaxDescPop').val(taxRateDesc);
                        setTimeout(function() {
                        $('#newTaxRateModal').modal('toggle');
                        }, 100);
                      }
                     }

                   }).catch(function (err) {
                       // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                       $('.fullScreenSpin').css('display','none');
                       // Meteor._reload.reload();
                   });
                 }else{
                   let data = JSON.parse(dataObject[0].data);
                   let useData = data.ttaxcodevs1;
                   let lineItems = [];
                   let lineItemObj = {};
                   $('.taxcodepopheader').text('Edit Tax Rate');
                   for(let i=0; i<useData.length; i++){

                     if ((useData[i].CodeName) === taxRateDataName) {
                       $('#edtTaxNamePop').attr('readonly', true);
                     let taxRate = (useData[i].Rate * 100).toFixed(2);
                     var taxRateID = useData[i].Id || '';
                      var taxRateName = useData[i].CodeName ||'';
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
                   for(let i=0; i<data.ttaxcodevs1.length; i++){
                     if ((data.ttaxcodevs1[i].CodeName) === taxRateDataName) {
                       $('#edtTaxNamePop').attr('readonly', true);
                     let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                     var taxRateID = data.ttaxcodevs1[i].Id || '';
                      var taxRateName = data.ttaxcodevs1[i].CodeName ||'';
                      var taxRateDesc = data.ttaxcodevs1[i].Description || '';
                      $('#edtTaxID').val(taxRateID);
                      $('#edtTaxNamePop').val(taxRateName);
                      $('#edtTaxRatePop').val(taxRate);
                      $('#edtTaxDescPop').val(taxRateDesc);
                      setTimeout(function() {
                      $('#newTaxRateModal').modal('toggle');
                      }, 100);

                    }
                   }

                 }).catch(function (err) {
                     // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                     $('.fullScreenSpin').css('display','none');
                     // Meteor._reload.reload();
                 });
               });

           } else {
               $('#taxRateListModal').modal('toggle');
               var targetID = $(event.target).closest('tr').attr('id');
               $('#selectLineID').val(targetID);
               setTimeout(function() {
                   $('#tblTaxRate_filter .form-control-sm').focus();
                   $('#tblTaxRate_filter .form-control-sm').val('');
                   $('#tblTaxRate_filter .form-control-sm').trigger("input");

                   var datatable = $('#tblTaxRate').DataTable();
                   datatable.draw();
                   $('#tblTaxRate_filter .form-control-sm').trigger("input");

               }, 500);
           }

       }

    },
    'click .lineCustomerJob, keydown .lineCustomerJob': function(event) {
        var $earch = $(event.currentTarget);
        var offset = $earch.offset();
        var targetID = $(event.target).closest('tr').attr('id');
        $('#customerSelectLineID').val(targetID);
          $('#edtCustomerPOPID').val('');
          $('#add-customer-title').text('Add New Customer');
        var customerDataName = $(event.target).val() || '';
        if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
            $('#customerListModal').modal('toggle');
            var targetID = $(event.target).closest('tr').attr('id');
            $('#customerSelectLineID').val(targetID);
            setTimeout(function() {
                $('#tblCustomerlist_filter .form-control-sm').focus();
                $('#tblCustomerlist_filter .form-control-sm').val('');
                $('#tblCustomerlist_filter .form-control-sm').trigger("input");

                var datatable = $('#tblCustomerlist').DataTable();
                datatable.draw();
                $('#tblCustomerlist_filter .form-control-sm').trigger("input");

            }, 500);
        } else {
            if (customerDataName.replace(/\s/g, '') != '') {

              $('#edtCustomerPOPID').val('');
              getVS1Data('TCustomerVS1').then(function (dataObject) {
                  if (dataObject.length == 0) {
                      $('.fullScreenSpin').css('display', 'inline-block');
                      sideBarService.getOneCustomerDataExByName(customerDataName).then(function (data) {
                          $('.fullScreenSpin').css('display', 'none');
                          let lineItems = [];
                          $('#add-customer-title').text('Edit Customer');
                          let popCustomerID = data.tcustomer[0].fields.ID || '';
                          let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                          let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                          let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                          let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                          let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                          let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                          let popCustomertfn = '' || '';
                          let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                          let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                          let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                          let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                          let popCustomerURL = data.tcustomer[0].fields.URL || '';
                          let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                          let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                          let popCustomerState = data.tcustomer[0].fields.State || '';
                          let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                          let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                          let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                          let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                          let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                          let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                          let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                          let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                          let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                          let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                          let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                          let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                          let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                          let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                          let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                          let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                          let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                          let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                          let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                          let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                          let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                          let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                          //$('#edtCustomerCompany').attr('readonly', true);
                          $('#edtCustomerCompany').val(popCustomerName);
                          $('#edtCustomerPOPID').val(popCustomerID);
                          $('#edtCustomerPOPEmail').val(popCustomerEmail);
                          $('#edtTitle').val(popCustomerTitle);
                          $('#edtFirstName').val(popCustomerFirstName);
                          $('#edtMiddleName').val(popCustomerMiddleName);
                          $('#edtLastName').val(popCustomerLastName);
                          $('#edtCustomerPhone').val(popCustomerPhone);
                          $('#edtCustomerMobile').val(popCustomerMobile);
                          $('#edtCustomerFax').val(popCustomerFaxnumber);
                          $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                          $('#edtCustomerWebsite').val(popCustomerURL);
                          $('#edtCustomerShippingAddress').val(popCustomerStreet);
                          $('#edtCustomerShippingCity').val(popCustomerStreet2);
                          $('#edtCustomerShippingState').val(popCustomerState);
                          $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                          $('#sedtCountry').val(popCustomerCountry);
                          $('#txaNotes').val(popCustomernotes);
                          $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                          $('#sltTermsPOP').val(popCustomerterms);
                          $('#sltCustomerType').val(popCustomerType);
                          $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                          $('#edtCustomeField1').val(popCustomercustfield1);
                          $('#edtCustomeField2').val(popCustomercustfield2);
                          $('#edtCustomeField3').val(popCustomercustfield3);
                          $('#edtCustomeField4').val(popCustomercustfield4);

                          $('#sltTaxCode').val(popCustomerTaxCode);

                          if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                              (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                              (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                              $('#chkSameAsShipping2').attr("checked", "checked");
                          }

                          if (data.tcustomer[0].fields.IsSupplier == true) {
                              // $('#isformcontractor')
                              $('#chkSameAsSupplier').attr("checked", "checked");
                          } else {
                              $('#chkSameAsSupplier').removeAttr("checked");
                          }

                          setTimeout(function () {
                              $('#addCustomerModal').modal('show');
                          }, 200);
                      }).catch(function (err) {
                          $('.fullScreenSpin').css('display', 'none');
                      });
                  } else {
                      let data = JSON.parse(dataObject[0].data);
                      let useData = data.tcustomervs1;

                      var added = false;
                      for (let i = 0; i < data.tcustomervs1.length; i++) {
                          if (data.tcustomervs1[i].fields.ClientName === customerDataName) {
                              let lineItems = [];
                              added = true;
                              $('.fullScreenSpin').css('display', 'none');
                              $('#add-customer-title').text('Edit Customer');
                              let popCustomerID = data.tcustomervs1[i].fields.ID || '';
                              let popCustomerName = data.tcustomervs1[i].fields.ClientName || '';
                              let popCustomerEmail = data.tcustomervs1[i].fields.Email || '';
                              let popCustomerTitle = data.tcustomervs1[i].fields.Title || '';
                              let popCustomerFirstName = data.tcustomervs1[i].fields.FirstName || '';
                              let popCustomerMiddleName = data.tcustomervs1[i].fields.CUSTFLD10 || '';
                              let popCustomerLastName = data.tcustomervs1[i].fields.LastName || '';
                              let popCustomertfn = '' || '';
                              let popCustomerPhone = data.tcustomervs1[i].fields.Phone || '';
                              let popCustomerMobile = data.tcustomervs1[i].fields.Mobile || '';
                              let popCustomerFaxnumber = data.tcustomervs1[i].fields.Faxnumber || '';
                              let popCustomerSkypeName = data.tcustomervs1[i].fields.SkypeName || '';
                              let popCustomerURL = data.tcustomervs1[i].fields.URL || '';
                              let popCustomerStreet = data.tcustomervs1[i].fields.Street || '';
                              let popCustomerStreet2 = data.tcustomervs1[i].fields.Street2 || '';
                              let popCustomerState = data.tcustomervs1[i].fields.State || '';
                              let popCustomerPostcode = data.tcustomervs1[i].fields.Postcode || '';
                              let popCustomerCountry = data.tcustomervs1[i].fields.Country || LoggedCountry;
                              let popCustomerbillingaddress = data.tcustomervs1[i].fields.BillStreet || '';
                              let popCustomerbcity = data.tcustomervs1[i].fields.BillStreet2 || '';
                              let popCustomerbstate = data.tcustomervs1[i].fields.BillState || '';
                              let popCustomerbpostalcode = data.tcustomervs1[i].fields.BillPostcode || '';
                              let popCustomerbcountry = data.tcustomervs1[i].fields.Billcountry || LoggedCountry;
                              let popCustomercustfield1 = data.tcustomervs1[i].fields.CUSTFLD1 || '';
                              let popCustomercustfield2 = data.tcustomervs1[i].fields.CUSTFLD2 || '';
                              let popCustomercustfield3 = data.tcustomervs1[i].fields.CUSTFLD3 || '';
                              let popCustomercustfield4 = data.tcustomervs1[i].fields.CUSTFLD4 || '';
                              let popCustomernotes = data.tcustomervs1[i].fields.Notes || '';
                              let popCustomerpreferedpayment = data.tcustomervs1[i].fields.PaymentMethodName || '';
                              let popCustomerterms = data.tcustomervs1[i].fields.TermsName || '';
                              let popCustomerdeliverymethod = data.tcustomervs1[i].fields.ShippingMethodName || '';
                              let popCustomeraccountnumber = data.tcustomervs1[i].fields.ClientNo || '';
                              let popCustomerisContractor = data.tcustomervs1[i].fields.Contractor || false;
                              let popCustomerissupplier = data.tcustomervs1[i].fields.IsSupplier || false;
                              let popCustomeriscustomer = data.tcustomervs1[i].fields.IsCustomer || false;
                              let popCustomerTaxCode = data.tcustomervs1[i].fields.TaxCodeName || '';
                              let popCustomerDiscount = data.tcustomervs1[i].fields.Discount || 0;
                              let popCustomerType = data.tcustomervs1[i].fields.ClientTypeName || '';
                              //$('#edtCustomerCompany').attr('readonly', true);
                              $('#edtCustomerCompany').val(popCustomerName);
                              $('#edtCustomerPOPID').val(popCustomerID);
                              $('#edtCustomerPOPEmail').val(popCustomerEmail);
                              $('#edtTitle').val(popCustomerTitle);
                              $('#edtFirstName').val(popCustomerFirstName);
                              $('#edtMiddleName').val(popCustomerMiddleName);
                              $('#edtLastName').val(popCustomerLastName);
                              $('#edtCustomerPhone').val(popCustomerPhone);
                              $('#edtCustomerMobile').val(popCustomerMobile);
                              $('#edtCustomerFax').val(popCustomerFaxnumber);
                              $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                              $('#edtCustomerWebsite').val(popCustomerURL);
                              $('#edtCustomerShippingAddress').val(popCustomerStreet);
                              $('#edtCustomerShippingCity').val(popCustomerStreet2);
                              $('#edtCustomerShippingState').val(popCustomerState);
                              $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                              $('#sedtCountry').val(popCustomerCountry);
                              $('#txaNotes').val(popCustomernotes);
                              $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                              $('#sltTermsPOP').val(popCustomerterms);
                              $('#sltCustomerType').val(popCustomerType);
                              $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                              $('#edtCustomeField1').val(popCustomercustfield1);
                              $('#edtCustomeField2').val(popCustomercustfield2);
                              $('#edtCustomeField3').val(popCustomercustfield3);
                              $('#edtCustomeField4').val(popCustomercustfield4);

                              $('#sltTaxCode').val(popCustomerTaxCode);

                              if ((data.tcustomervs1[i].fields.Street == data.tcustomervs1[i].fields.BillStreet) && (data.tcustomervs1[i].fields.Street2 == data.tcustomervs1[i].fields.BillStreet2) &&
                                  (data.tcustomervs1[i].fields.State == data.tcustomervs1[i].fields.BillState) && (data.tcustomervs1[i].fields.Postcode == data.tcustomervs1[i].fields.BillPostcode) &&
                                  (data.tcustomervs1[i].fields.Country == data.tcustomervs1[i].fields.Billcountry)) {
                                  $('#chkSameAsShipping2').attr("checked", "checked");
                              }

                              if (data.tcustomervs1[i].fields.IsSupplier == true) {
                                  // $('#isformcontractor')
                                  $('#chkSameAsSupplier').attr("checked", "checked");
                              } else {
                                  $('#chkSameAsSupplier').removeAttr("checked");
                              }

                              setTimeout(function () {
                                  $('#addCustomerModal').modal('show');
                              }, 200);

                          }
                      }
                      if (!added) {
                          $('.fullScreenSpin').css('display', 'inline-block');
                          sideBarService.getOneCustomerDataExByName(customerDataName).then(function (data) {
                              $('.fullScreenSpin').css('display', 'none');
                              let lineItems = [];
                              $('#add-customer-title').text('Edit Customer');
                              let popCustomerID = data.tcustomer[0].fields.ID || '';
                              let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                              let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                              let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                              let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                              let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                              let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                              let popCustomertfn = '' || '';
                              let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                              let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                              let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                              let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                              let popCustomerURL = data.tcustomer[0].fields.URL || '';
                              let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                              let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                              let popCustomerState = data.tcustomer[0].fields.State || '';
                              let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                              let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                              let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                              let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                              let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                              let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                              let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                              let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                              let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                              let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                              let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                              let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                              let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                              let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                              let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                              let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                              let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                              let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                              let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                              let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                              let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                              let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                              //$('#edtCustomerCompany').attr('readonly', true);
                              $('#edtCustomerCompany').val(popCustomerName);
                              $('#edtCustomerPOPID').val(popCustomerID);
                              $('#edtCustomerPOPEmail').val(popCustomerEmail);
                              $('#edtTitle').val(popCustomerTitle);
                              $('#edtFirstName').val(popCustomerFirstName);
                              $('#edtMiddleName').val(popCustomerMiddleName);
                              $('#edtLastName').val(popCustomerLastName);
                              $('#edtCustomerPhone').val(popCustomerPhone);
                              $('#edtCustomerMobile').val(popCustomerMobile);
                              $('#edtCustomerFax').val(popCustomerFaxnumber);
                              $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                              $('#edtCustomerWebsite').val(popCustomerURL);
                              $('#edtCustomerShippingAddress').val(popCustomerStreet);
                              $('#edtCustomerShippingCity').val(popCustomerStreet2);
                              $('#edtCustomerShippingState').val(popCustomerState);
                              $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                              $('#sedtCountry').val(popCustomerCountry);
                              $('#txaNotes').val(popCustomernotes);
                              $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                              $('#sltTermsPOP').val(popCustomerterms);
                              $('#sltCustomerType').val(popCustomerType);
                              $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                              $('#edtCustomeField1').val(popCustomercustfield1);
                              $('#edtCustomeField2').val(popCustomercustfield2);
                              $('#edtCustomeField3').val(popCustomercustfield3);
                              $('#edtCustomeField4').val(popCustomercustfield4);

                              $('#sltTaxCode').val(popCustomerTaxCode);

                              if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                                  (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                                  (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                                  $('#chkSameAsShipping2').attr("checked", "checked");
                              }

                              if (data.tcustomer[0].fields.IsSupplier == true) {
                                  // $('#isformcontractor')
                                  $('#chkSameAsSupplier').attr("checked", "checked");
                              } else {
                                  $('#chkSameAsSupplier').removeAttr("checked");
                              }

                              setTimeout(function () {
                                  $('#addCustomerModal').modal('show');
                              }, 200);
                          }).catch(function (err) {
                              $('.fullScreenSpin').css('display', 'none');
                          });
                      }
                  }
              }).catch(function (err) {
                  sideBarService.getOneCustomerDataExByName(customerDataName).then(function (data) {
                      $('.fullScreenSpin').css('display', 'none');
                      let lineItems = [];
                      $('#add-customer-title').text('Edit Customer');
                      let popCustomerID = data.tcustomer[0].fields.ID || '';
                      let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                      let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                      let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                      let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                      let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                      let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                      let popCustomertfn = '' || '';
                      let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                      let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                      let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                      let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                      let popCustomerURL = data.tcustomer[0].fields.URL || '';
                      let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                      let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                      let popCustomerState = data.tcustomer[0].fields.State || '';
                      let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                      let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                      let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                      let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                      let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                      let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                      let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                      let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                      let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                      let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                      let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                      let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                      let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                      let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                      let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                      let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                      let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                      let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                      let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                      let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                      let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                      let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                      //$('#edtCustomerCompany').attr('readonly', true);
                      $('#edtCustomerCompany').val(popCustomerName);
                      $('#edtCustomerPOPID').val(popCustomerID);
                      $('#edtCustomerPOPEmail').val(popCustomerEmail);
                      $('#edtTitle').val(popCustomerTitle);
                      $('#edtFirstName').val(popCustomerFirstName);
                      $('#edtMiddleName').val(popCustomerMiddleName);
                      $('#edtLastName').val(popCustomerLastName);
                      $('#edtCustomerPhone').val(popCustomerPhone);
                      $('#edtCustomerMobile').val(popCustomerMobile);
                      $('#edtCustomerFax').val(popCustomerFaxnumber);
                      $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                      $('#edtCustomerWebsite').val(popCustomerURL);
                      $('#edtCustomerShippingAddress').val(popCustomerStreet);
                      $('#edtCustomerShippingCity').val(popCustomerStreet2);
                      $('#edtCustomerShippingState').val(popCustomerState);
                      $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                      $('#sedtCountry').val(popCustomerCountry);
                      $('#txaNotes').val(popCustomernotes);
                      $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                      $('#sltTermsPOP').val(popCustomerterms);
                      $('#sltCustomerType').val(popCustomerType);
                      $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                      $('#edtCustomeField1').val(popCustomercustfield1);
                      $('#edtCustomeField2').val(popCustomercustfield2);
                      $('#edtCustomeField3').val(popCustomercustfield3);
                      $('#edtCustomeField4').val(popCustomercustfield4);

                      $('#sltTaxCode').val(popCustomerTaxCode);

                      if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                          (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                          (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                          $('#chkSameAsShipping2').attr("checked", "checked");
                      }

                      if (data.tcustomer[0].fields.IsSupplier == true) {
                          // $('#isformcontractor')
                          $('#chkSameAsSupplier').attr("checked", "checked");
                      } else {
                          $('#chkSameAsSupplier').removeAttr("checked");
                      }

                      setTimeout(function () {
                          $('#addCustomerModal').modal('show');
                      }, 200);
                  }).catch(function (err) {
                      $('.fullScreenSpin').css('display', 'none');
                  });
              });

            } else {
                $('#customerListModal').modal('toggle');
                var targetID = $(event.target).closest('tr').attr('id');
                $('#customerSelectLineID').val(targetID);
                setTimeout(function() {
                    $('#tblCustomerlist_filtertblCustomerlist_filter .form-control-sm').focus();
                    $('#tblCustomerlist_filter .form-control-sm').val('');
                    $('#tblCustomerlist_filter .form-control-sm').trigger("input");

                    var datatable = $('#tblTaxRate').DataTable();
                    datatable.draw();
                    $('#tblCustomerlist_filter .form-control-sm').trigger("input");

                }, 500);
            }

        }
    },
    'click .printConfirm': function(event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtSupplierName').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
        $('#printcomment').html($('#txaComment').val().replace(/[\r\n]/g, "<br />"));
        var ponumber = $('#ponumber').val() || '.';
        $('.po').text(ponumber);
        exportSalesToPdf();

    },
    'keydown .lineQty, keydown .lineUnitPrice,keydown .lineOrdered': function(event) {
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
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {} else {
            event.preventDefault();
        }
    },
    'click .btnRemove': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();

        var clicktimes = 0;
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectDeleteLineID').val(targetID);

        times++;

        if (times == 1) {
            $('#deleteLineModal').modal('toggle');
        } else {
            if ($('#tblPurchaseOrderLine tbody>tr').length > 1) {
                this.click;
                $(event.target).closest('tr').remove();
                $('.purchase_print #' + targetID).remove();
                event.preventDefault();
                let $tblrows = $("#tblPurchaseOrderLine tbody tr");
                let $printrows = $(".purchase_print tbody tr");
                let lineAmount = 0;
                let subGrandTotal = 0;
                let taxGrandTotal = 0;
                let taxGrandTotalPrint = 0;

                $tblrows.each(function(index) {
                    var $tblrow = $(this);
                    var qty = $tblrow.find(".lineQty").val() || 0;
                    var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
                    var taxcode = $tblrow.find(".lineTaxCode").val() || 0;

                    var taxrateamount = 0;
                    if (taxcodeList) {
                        for (var i = 0; i < taxcodeList.length; i++) {
                            if (taxcodeList[i].codename == taxcode) {
                                taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                            }
                        }
                    }


                    var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                    let lineTotalAmount = subTotal + taxTotal;
                    $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));

                    let unitPriceIncCalc = Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount)||0;
                    let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, ""))||0;
                    let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc||0;
                    $tblrow.find('.colUnitPriceExChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
                    $tblrow.find('.colUnitPriceIncChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal));

                    if (!isNaN(subTotal)) {
                      $tblrow.find('.colAmountEx').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                      $tblrow.find('.colAmountInc').text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
                        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                        document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
                    }

                    if (!isNaN(taxTotal)) {
                        taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                        document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
                    }

                    if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                        let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                        document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                        document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                        document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                    }
                });

                if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                    $printrows.each(function(index) {
                        var $printrows = $(this);
                        var qty = $printrows.find("#lineQty").text() || 0;
                        var price = $printrows.find("#lineUnitPrice").text() || "0";
                        var taxrateamount = 0;
                        var taxRate = $printrows.find("#lineTaxCode").text();
                        if (taxcodeList) {
                            for (var i = 0; i < taxcodeList.length; i++) {
                                if (taxcodeList[i].codename == taxRate) {
                                    taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                                }
                            }
                        }

                        var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                        var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                        $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))
                        if (!isNaN(subTotal)) {
                            $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                            subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                            document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                        }

                        if (!isNaN(taxTotal)) {
                            taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                        }
                        if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                            let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                            document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                            //document.getElementById("totalTax").innerHTML = $('#subtotal_tax').text();
                            //document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                            //document.getElementById("totalBalanceDuePrint").innerHTML = $('#totalBalanceDue').text();

                        }
                    });
                }
                return false;

            } else {
                $('#deleteLineModal').modal('toggle');
            }
        }
    },
    'click .btnDeletePO': function(event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let purchaseService = new PurchaseBoardService();
        var url = FlowRouter.current().path;
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length - 1];
        var objDetails = '';
        if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            var objDetails = {
                type: "TPurchaseOrderEx",
                fields: {
                    ID: currentInvoice,
                    Deleted: true,
                    Lines: null
                }
            };

            purchaseService.savePurchaseOrderEx(objDetails).then(function(objDetails) {
                FlowRouter.go('/purchaseorderlist?success=true');
            }).catch(function(err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                    else if (result.dismiss === 'cancel') {

                    }
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            FlowRouter.go('/purchaseorderlist?success=true');
        }
        $('#deleteLineModal').modal('toggle');
    },
    'click .btnDeleteLine': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        let selectLineID = $('#selectDeleteLineID').val();
        if ($('#tblPurchaseOrderLine tbody>tr').length > 1) {
            this.click;

            $('#' + selectLineID).closest('tr').remove();

            let $tblrows = $("#tblPurchaseOrderLine tbody tr");
            let $printrows = $(".purchase_print tbody tr");
            $(".purchase_print #" + selectLineID).remove();

            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;
            let taxGrandTotalPrint = 0;

            $tblrows.each(function(index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".lineQty").val() || 0;
                var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
                var taxcode = $tblrow.find(".lineTaxCode").val() || 0;

                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxcode) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }


                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                let lineTotalAmount = subTotal + taxTotal;
                $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));

                let unitPriceIncCalc = Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount)||0;
                let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, ""))||0;
                let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc||0;
                $tblrow.find('.colUnitPriceExChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
                $tblrow.find('.colUnitPriceIncChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal));

                if (!isNaN(subTotal)) {
                  $tblrow.find('.colAmountEx').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                  $tblrow.find('.colAmountInc').text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                    document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
                }

                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                }
            });

            if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                $printrows.each(function(index) {
                    var $printrows = $(this);
                    var qty = $printrows.find("#lineQty").text() || 0;
                    var price = $printrows.find("#lineUnitPrice").text() || "0";
                    var taxrateamount = 0;
                    var taxRate = $printrows.find("#lineTaxCode").text();
                    if (taxcodeList) {
                        for (var i = 0; i < taxcodeList.length; i++) {
                            if (taxcodeList[i].codename == taxRate) {
                                taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                            }
                        }
                    }

                    var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                    $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))
                    if (!isNaN(subTotal)) {
                        $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                        document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                    }

                    if (!isNaN(taxTotal)) {
                        taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                    }
                    if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                        let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                        document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                        //document.getElementById("totalTax").innerHTML = $('#subtotal_tax').text();
                        //document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                        //document.getElementById("totalBalanceDuePrint").innerHTML = $('#totalBalanceDue').text();

                    }
                });


            } else {
                this.click;

                $('#' + selectLineID + " .lineProductName").val('');
                $('#' + selectLineID + " .lineProductDesc").text('');
                $('#' + selectLineID + " .lineOrdered").val('');
                $('#' + selectLineID + " .lineQty").val('');
                $('#' + selectLineID + " .lineBo").val('');
                $('#' + selectLineID + " .lineUnitPrice").val('');
                // $('#' + selectLineID + " .lineCostPrice").val('');
                $('#' + selectLineID + " .lineSalesLinesCustField1").text('');
                $('#' + selectLineID + " .lineTaxRate").text('');
                $('#' + selectLineID + " .lineTaxCode").val('');
                $('#' + selectLineID + " .lineAmt").text('');

                document.getElementById("subtotal_tax").innerHTML = Currency + '0.00';
                document.getElementById("subtotal_total").innerHTML = Currency + '0.00';
                document.getElementById("grandTotal").innerHTML = Currency + '0.00';
                document.getElementById("balanceDue").innerHTML = Currency + '0.00';
                document.getElementById("totalBalanceDue").innerHTML = Currency + '0.00';



            }

            $('#deleteLineModal').modal('toggle');
        } else {
            this.click;
            $('#' + selectLineID + " .lineProductName").val('');
            $('#' + selectLineID + " .lineProductDesc").text('');
            $('#' + selectLineID + " .lineOrdered").val('');
            $('#' + selectLineID + " .lineQty").val('');

            $('#' + selectLineID + " .lineUnitPrice").val('');
            $('#' + selectLineID + " .lineCustomerJob").val('');
            // $('#' + selectLineID + " .lineSalesLinesCustField1").text('');
            $('#' + selectLineID + " .lineTaxRate").text('');
            $('#' + selectLineID + " .lineTaxCode").val('');
            $('#' + selectLineID + " .lineAmt").text('');
            $('#' + selectLineID + " .lineTaxAmount").text('');


            document.getElementById("subtotal_tax").innerHTML = Currency + '0.00';
            document.getElementById("subtotal_total").innerHTML = Currency + '0.00';
            document.getElementById("grandTotal").innerHTML = Currency + '0.00';
            document.getElementById("balanceDue").innerHTML = Currency + '0.00';
            document.getElementById("totalBalanceDue").innerHTML = Currency + '0.00';
        }
        $('#deleteLineModal').modal('toggle');
    },
    'click .btnSaveSettings': function(event) {

        $('#myModal4').modal('toggle');
    },
    'click .btnSave': function(event) {
        let templateObject = Template.instance();
        let suppliername = $('#edtSupplierName');
        let purchaseService = new PurchaseBoardService();
        let termname = $('#sltTerms').val() || '';
        if (termname === '') {
            swal('Terms has not been selected!', '', 'warning');
            event.preventDefault();
            return false;
        }

        if (suppliername.val() === '') {
            swal('Supplier has not been selected!', '', 'warning');
            e.preventDefault();
        } else {

            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = new Array();
            let lineItemsForm = [];
            let lineItemObjForm = {};
            let checkBackOrder = templateObject.includeBOnShippedQty.get();
            $('#tblPurchaseOrderLine > tbody > tr').each(function() {
                var lineID = this.id;
                let tdproduct = $('#' + lineID + " .lineProductName").val();
                let tddescription = $('#' + lineID + " .lineProductDesc").text();
                let tdQty = $('#' + lineID + " .lineQty").val();
                let tdOrderd = $('#' + lineID + " .lineOrdered").val();

                let tdunitprice = $('#' + lineID + " .colUnitPriceExChange").val();
                let tdCustomerJob = $('#' + lineID + " .lineCustomerJob").val();
                let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                let tdtaxCode = $('#' + lineID + " .lineTaxCode").val();
                let tdlineamt = $('#' + lineID + " .lineAmt").text();

                if (tdproduct != "") {
                    if ($('input[name="chkCreatePOCredit"]').is(":checked")) {
                        lineItemObjForm = {
                            type: "TPurchaseOrderLine",
                            fields: {
                                ProductName: tdproduct || '',
                                ProductDescription: tddescription || '',
                                UOMQtySold: parseFloat(tdQty) || 0,
                                UOMQtyShipped: parseFloat(tdQty) || 0,
                                LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                CustomerJob: tdCustomerJob || '',
                                LineTaxCode: tdtaxCode || '',
                                LineClassName: $('#sltDept').val() || defaultDept
                            }
                        };
                    } else {
                        if (checkBackOrder == true) {
                            lineItemObjForm = {
                                type: "TPurchaseOrderLine",
                                fields: {
                                    ProductName: tdproduct || '',
                                    ProductDescription: tddescription || '',
                                    UOMQtySold: parseFloat(tdOrderd) || 0,
                                    UOMQtyShipped: parseFloat(tdQty) || 0,
                                    LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                    CustomerJob: tdCustomerJob || '',
                                    LineTaxCode: tdtaxCode || '',
                                    LineClassName: $('#sltDept').val() || defaultDept
                                }
                            };
                        } else {
                            lineItemObjForm = {
                                type: "TPurchaseOrderLine",
                                fields: {
                                    ProductName: tdproduct || '',
                                    ProductDescription: tddescription || '',
                                    UOMQtySold: parseFloat(tdQty) || 0,
                                    UOMQtyShipped: parseFloat(tdQty) || 0,
                                    LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                    CustomerJob: tdCustomerJob || '',
                                    LineTaxCode: tdtaxCode || '',
                                    LineClassName: $('#sltDept').val() || defaultDept
                                }
                            };

                        }

                    }
                    lineItemsForm.push(lineItemObjForm);
                    splashLineArray.push(lineItemObjForm);
                }
            });
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

            let supplier = $('#edtSupplierName').val();
            let supplierEmail = $('#edtSupplierEmail').val();
            let billingAddress = $('#txabillingAddress').val();

            var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
            var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

            let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
            let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

            let poNumber = $('#ponumber').val();
            let reference = $('#edtRef').val();

            let departement = $('#shipvia').val();
            let shippingAddress = $('#txaShipingInfo').val();
            let comments = $('#txaComment').val();
            let pickingInfrmation = $('#txapickmemo').val();

            let saleCustField1 = $('#edtSaleCustField1').val();
            let saleCustField2 = $('#edtSaleCustField2').val();
            let orderStatus = $('#edtStatus').val();

            var url = FlowRouter.current().path;
            var getso_id = url.split('?id=');
            var currentPurchaseOrder = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var currencyCode = $("#sltCurrency").val() || CountryAbbr;
            var objDetails = '';
            if (getso_id[1]) {
                currentPurchaseOrder = parseInt(currentPurchaseOrder);
                if ($('input[name="chkCreatePOCredit"]').is(":checked")) {
                    objDetails = {
                        type: "TPurchaseOrderEx",
                        fields: {

                            SupplierName: supplier,
                            ForeignExchangeCode: currencyCode,
                            SupplierInvoiceNumber: poNumber || ' ',
                            Lines: splashLineArray,
                            OrderTo: billingAddress,
                            OrderDate: saleDate,

                            SupplierInvoiceDate: saleDate,

                            SaleLineRef: reference,
                            TermsName: termname,
                            Shipping: departement,
                            ShipTo: shippingAddress,
                            Comments: comments,
                            SalesComments: pickingInfrmation,
                            Attachments: uploadedItems,
                            OrderStatus: $('#sltStatus').val()
                        }
                    };
                } else {
                    objDetails = {
                        type: "TPurchaseOrderEx",
                        fields: {
                            ID: currentPurchaseOrder,
                            SupplierName: supplier,
                            ForeignExchangeCode: currencyCode,
                            SupplierInvoiceNumber: poNumber || ' ',
                            Lines: splashLineArray,
                            OrderTo: billingAddress,
                            OrderDate: saleDate,

                            SupplierInvoiceDate: saleDate,

                            SaleLineRef: reference,
                            TermsName: termname,
                            Shipping: departement,
                            ShipTo: shippingAddress,
                            Comments: comments,
                            SalesComments: pickingInfrmation,
                            Attachments: uploadedItems,
                            OrderStatus: $('#sltStatus').val()
                        }
                    };
                }
            } else {
                objDetails = {
                    type: "TPurchaseOrderEx",
                    fields: {
                        SupplierName: supplier,
                        ForeignExchangeCode: currencyCode,
                        SupplierInvoiceNumber: poNumber || ' ',
                        Lines: splashLineArray,
                        OrderTo: billingAddress,
                        OrderDate: saleDate,

                        SupplierInvoiceDate: saleDate,

                        SaleLineRef: reference,
                        TermsName: termname,
                        Shipping: departement,
                        ShipTo: shippingAddress,
                        Comments: comments,


                        SalesComments: pickingInfrmation,
                        Attachments: uploadedItems,
                        OrderStatus: $('#sltStatus').val()
                    }
                };
            }

            purchaseService.savePurchaseOrderEx(objDetails).then(function(objDetails) {
                var supplierID = $('#edtSupplierEmail').attr('supplierid');

                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtSupplierEmail').val());
                $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
                var ponumber = $('#ponumber').val() || '.';
                $('.po').text(ponumber);
                async function addAttachment() {
                    let attachment = [];
                    let templateObject = Template.instance();

                    let invoiceId = objDetails.fields.ID;
                    let encodedPdf = await generatePdfForMail(invoiceId);
                    let pdfObject = "";
                    var reader = new FileReader();
                    reader.readAsDataURL(encodedPdf);
                    reader.onloadend = function() {
                        var base64data = reader.result;
                        base64data = base64data.split(',')[1];

                        pdfObject = {
                            filename: 'Purchase Order ' + invoiceId + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);

                        let erpInvoiceId = objDetails.fields.ID;

                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                        let customerEmailName = $('#edtSupplierName').val();
                        let checkEmailData = $('#edtSupplierEmail').val();

                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Purchase Order ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
                            "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
                            "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

                        var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
                            '    <tr>' +
                            '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
                            '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td style="padding: 40px 30px 40px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
                            '                        Hello there <span>' + customerEmailName + '</span>,' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        The amount outstanding of <span>' + amountDueEmail + '</span> is due on <span>' + emailDueDate + '</span>' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
                            '                        Kind regards,' +
                            '                        <br>' +
                            '                        ' + mailFromName + '' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
                            '                        If you have any question, please do not hesitate to contact us.' +
                            '                    </td>' +
                            '                    <td align="right">' +
                            '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '</table>';

                        if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    FlowRouter.go('/purchaseorderlist?success=true');

                                } else {

                                }
                            });

                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    FlowRouter.go('/purchaseorderlist?success=true');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            FlowRouter.go('/purchaseorderlist?success=true');
                                        } else if (result.dismiss === 'cancel') {

                                        }
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailCopy').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    FlowRouter.go('/purchaseorderlist?success=true');

                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            FlowRouter.go('/purchaseorderlist?success=true');
                                        } else if (result.dismiss === 'cancel') {

                                        }
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    FlowRouter.go('/purchaseorderlist?success=true');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To User: " + mailFrom + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            FlowRouter.go('/purchaseorderlist?success=true');
                                        } else if (result.dismiss === 'cancel') {

                                        }
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                            FlowRouter.go('/purchaseorderlist?success=true');
                        };
                    };
                }
                addAttachment();

                function generatePdfForMail(invoiceId) {
                    return new Promise((resolve, reject) => {
                        let templateObject = Template.instance();

                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        doc.setFontSize(18);
                        var source = document.getElementById('html-2-pdfwrapper');
                        doc.addHTML(source, function() {

                            resolve(doc.output('blob'));

                        });
                    });
                }


                if (supplierID !== " ") {
                    let supplierEmailData = {
                        type: "TSupplier",
                        fields: {
                            ID: supplierID,
                            Email: supplierEmail
                        }
                    }



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
                            PrefName: 'purchaseordercard'
                        });
                        if (checkPrefDetails) {
                            CloudPreference.update({
                                _id: checkPrefDetails._id
                            }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'purchaseform',
                                    PrefName: 'purchaseordercard',
                                    published: true,
                                    customFields: [{
                                        index: '1',
                                        label: getcustomField1,
                                        hidden: getchkcustomField1
                                    }, {
                                        index: '2',
                                        label: getcustomField2,
                                        hidden: getchkcustomField2
                                    }],
                                    updatedAt: new Date()
                                }
                            }, function(err, idTag) {
                                if (err) {

                                } else {


                                }
                            });
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'purchaseform',
                                PrefName: 'purchaseordercard',
                                published: true,
                                customFields: [{
                                    index: '1',
                                    label: getcustomField1,
                                    hidden: getchkcustomField1
                                }, {
                                    index: '2',
                                    label: getcustomField2,
                                    hidden: getchkcustomField2
                                }],
                                createdAt: new Date()
                            }, function(err, idTag) {
                                if (err) {

                                } else {


                                }
                            });
                        }
                    }
                } else {

                }

            }).catch(function(err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                    else if (result.dismiss === 'cancel') {

                    }
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }

    },
    'click .chkProductName': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colProductName').css('display', 'table-cell');
            $('.colProductName').css('padding', '.75rem');
            $('.colProductName').css('vertical-align', 'top');
        } else {
            $('.colProductName').css('display', 'none');
        }
    },
    'click .chkDescription': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colDescription').css('display', 'table-cell');
            $('.colDescription').css('padding', '.75rem');
            $('.colDescription').css('vertical-align', 'top');
        } else {
            $('.colDescription').css('display', 'none');
        }
    },
    'click .chkQty': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colQty').css('display', 'table-cell');
            $('.colQty').css('padding', '.75rem');
            $('.colQty').css('vertical-align', 'top');
        } else {
            $('.colQty').css('display', 'none');
        }
    },
    'click .chkUnitPrice': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colUnitPrice').css('display', 'table-cell');
            $('.colUnitPrice').css('padding', '.75rem');
            $('.colUnitPrice').css('vertical-align', 'top');
        } else {
            $('.colUnitPrice').css('display', 'none');
        }
    },
    'click .chkCostPrice': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colCostPrice').css('display', 'table-cell');
            $('.colCostPrice').css('padding', '.75rem');
            $('.colCostPrice').css('vertical-align', 'top');
        } else {
            $('.colCostPrice').css('display', 'none');
        }
    },
    'click .chkSalesLinesCustField1': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colSalesLinesCustField1').css('display', 'table-cell');
            $('.colSalesLinesCustField1').css('padding', '.75rem');
            $('.colSalesLinesCustField1').css('vertical-align', 'top');
        } else {
            $('.colSalesLinesCustField1').css('display', 'none');
        }
    },
    'click .chkTaxRate': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colTaxRate').css('display', 'table-cell');
            $('.colTaxRate').css('padding', '.75rem');
            $('.colTaxRate').css('vertical-align', 'top');
        } else {
            $('.colTaxRate').css('display', 'none');
        }
    },
    'click .chkAmount': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colAmount').css('display', 'table-cell');
            $('.colAmount').css('padding', '.75rem');
            $('.colAmount').css('vertical-align', 'top');
        } else {
            $('.colAmount').css('display', 'none');
        }
    },
    'click .chkCustomerJob': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colCustomerJob').css('display', 'table-cell');
            $('.colCustomerJob').css('padding', '.75rem');
            $('.colCustomerJob').css('vertical-align', 'top');
        } else {
            $('.colCustomerJob').css('display', 'none');
        }
    },
    'change .rngRangeProductName': function(event) {

        let range = $(event.target).val();
        $(".spWidthProductName").html(range + '%');
        $('.colProductName').css('width', range + '%');

    },
    'change .rngRangeDescription': function(event) {

        let range = $(event.target).val();
        $(".spWidthDescription").html(range + '%');
        $('.colDescription').css('width', range + '%');

    },
    'change .rngRangeQty': function(event) {

        let range = $(event.target).val();
        $(".spWidthQty").html(range + '%');
        $('.colQty').css('width', range + '%');

    },
    'change .rngRangeUnitPrice': function(event) {

        let range = $(event.target).val();
        $(".spWidthUnitPrice").html(range + '%');
        $('.colUnitPrice').css('width', range + '%');

    },
    'change .rngRangeTaxRate': function(event) {

        let range = $(event.target).val();
        $(".spWidthTaxRate").html(range + '%');
        $('.colTaxRate').css('width', range + '%');

    },
    'change .rngRangeAmount': function(event) {

        let range = $(event.target).val();
        $(".spWidthAmount").html(range + '%');
        $('.colAmount').css('width', range + '%');

    },
    'change .rngRangeCostPrice': function(event) {

        let range = $(event.target).val();
        $(".spWidthCostPrice").html(range + '%');
        $('.colCostPrice').css('width', range + '%');

    },
    'change .rngRangeSalesLinesCustField1': function(event) {

        let range = $(event.target).val();
        $(".spWidthSalesLinesCustField1").html(range + '%');
        $('.colSalesLinesCustField1').css('width', range + '%');

    },
    'change .rngRangeCustomerJob': function(event) {

        let range = $(event.target).val();
        $(".spWidthCustomerJob").html(range + '%');
        $('.colCustomerJob').css('width', range + '%');

    },
    'blur .divcolumn': function(event) {
        let columData = $(event.target).html();
        let columHeaderUpdate = $(event.target).attr("valueupdate");
        $("" + columHeaderUpdate + "").html(columData);

    },
    'click .btnSaveGridSettings': function(event) {
        let lineItems = [];

        $('.columnSettings').each(function(index) {
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
                    PrefName: 'tblPurchaseOrderLine'
                });
                if (checkPrefDetails) {
                    CloudPreference.update({
                        _id: checkPrefDetails._id
                    }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'purchaseform',
                            PrefName: 'tblPurchaseOrderLine',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function(err, idTag) {
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
                        PrefGroup: 'purchaseform',
                        PrefName: 'tblPurchaseOrderLine',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function(err, idTag) {
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
    },
    'click .btnResetGridSettings': function(event) {
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
                    PrefName: 'tblPurchaseOrderLine'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .btnResetSettings': function(event) {
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
                    PrefName: 'purchaseordercard'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .new_attachment_btn': function(event) {
        $('#attachment-upload').trigger('click');

    },
    'change #attachment-upload': function(e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .img_new_attachment_btn': function(event) {
        $('#img-attachment-upload').trigger('click');

    },
    'change #img-attachment-upload': function(e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#img-attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .remove-attachment': function(event, ui) {
        let tempObj = Template.instance();
        let attachmentID = parseInt(event.target.id.split('remove-attachment-')[1]);
        if (tempObj.$("#confirm-action-" + attachmentID).length) {
            tempObj.$("#confirm-action-" + attachmentID).remove();
        } else {
            let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID + '"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-' + attachmentID + '">' +
                'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-name-' + attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltip").show();

    },
    'click .file-name': function(event) {
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-name-')[1]);
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFiles.get();
        $('#myModalAttachment').modal('hide');
        let previewFile = {};
        let input = uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:' + input + ';base64,' + uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type = uploadedFiles[attachmentID].fields.Description;
        if (type === 'application/pdf') {
            previewFile.class = 'pdf-class';
        } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            previewFile.class = 'docx-class';
        } else if (type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        } else if (type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            previewFile.class = 'ppt-class';
        } else if (type === 'application/vnd.oasis.opendocument.formula' || type === 'text/csv' || type === 'text/plain' || type === 'text/rtf') {
            previewFile.class = 'txt-class';
        } else if (type === 'application/zip' || type === 'application/rar' || type === 'application/x-zip-compressed' || type === 'application/x-zip,application/x-7z-compressed') {
            previewFile.class = 'zip-class';
        } else {
            previewFile.class = 'default-class';
        }

        if (type.split('/')[0] === 'image') {
            previewFile.image = true
        } else {
            previewFile.image = false
        }
        templateObj.uploadedFile.set(previewFile);

        $('#files_view').modal('show');

        return;
    },
    'click .confirm-delete-attachment': function(event, ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltip").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachment-')[1]);
        let uploadedArray = tempObj.uploadedFiles.get();
        let attachmentCount = tempObj.attachmentCount.get();
        $('#attachment-upload').val('');
        uploadedArray.splice(attachmentID, 1);
        tempObj.uploadedFiles.set(uploadedArray);
        attachmentCount--;
        if (attachmentCount === 0) {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-display').html(elementToAdd);
        }
        tempObj.attachmentCount.set(attachmentCount);
        if (uploadedArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click .save-to-library': function(event, ui) {
      $('.confirm-delete-attachment').trigger('click');
    },
    'click #btn_Attachment': function() {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFiles.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedFileArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click #btnPayment_note': function() {

        let templateObject = Template.instance();
        let suppliername = $('#edtSupplierName');
        let purchaseService = new PurchaseBoardService();
        let termname = $('#sltTerms').val() || '';
        if (termname === '') {
            swal('Terms has not been selected!', '', 'warning');
            event.preventDefault();
            return false;
        }

        if (suppliername.val() === '') {
            swal('Supplier has not been selected!', '', 'warning');
            e.preventDefault();
        } else {

            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = new Array();
            let lineItemsForm = [];
            let lineItemObjForm = {};
            let checkBackOrder = templateObject.includeBOnShippedQty.get();
            $('#tblPurchaseOrderLine > tbody > tr').each(function() {
                var lineID = this.id;
                let tdproduct = $('#' + lineID + " .lineProductName").val();
                let tddescription = $('#' + lineID + " .lineProductDesc").text();
                let tdQty = $('#' + lineID + " .lineQty").val();
                let tdOrderd = $('#' + lineID + " .lineOrdered").val();

                let tdunitprice = $('#' + lineID + " .colUnitPriceExChange").val();
                let tdCustomerJob = $('#' + lineID + " .lineCustomerJob").val();
                let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                let tdtaxCode = $('#' + lineID + " .lineTaxCode").val();
                let tdlineamt = $('#' + lineID + " .lineAmt").text();

                if (tdproduct != "") {
                    if (checkBackOrder == true) {
                        lineItemObjForm = {
                            type: "TPurchaseOrderLine",
                            fields: {
                                ProductName: tdproduct || '',
                                ProductDescription: tddescription || '',
                                UOMQtySold: parseFloat(tdOrderd) || 0,
                                UOMQtyShipped: parseFloat(tdQty) || 0,
                                LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                CustomerJob: tdCustomerJob || '',
                                LineTaxCode: tdtaxCode || '',
                                LineClassName: $('#sltDept').val() || defaultDept
                            }
                        };
                    } else {
                        lineItemObjForm = {
                            type: "TPurchaseOrderLine",
                            fields: {
                                ProductName: tdproduct || '',
                                ProductDescription: tddescription || '',
                                UOMQtySold: parseFloat(tdQty) || 0,

                                LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                CustomerJob: tdCustomerJob || '',
                                LineTaxCode: tdtaxCode || '',
                                LineClassName: $('#sltDept').val() || defaultDept
                            }
                        };

                    }
                    lineItemsForm.push(lineItemObjForm);
                    splashLineArray.push(lineItemObjForm);
                }
            });
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

            let supplier = $('#edtSupplierName').val();
            let supplierEmail = $('#edtSupplierEmail').val();
            let billingAddress = $('#txabillingAddress').val();


            var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
            var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

            let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
            let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

            let poNumber = $('#ponumber').val();
            let reference = $('#edtRef').val();

            let departement = $('#shipvia').val();
            let shippingAddress = $('#txaShipingInfo').val();
            let comments = $('#txaComment').val();
            let pickingInfrmation = $('#txapickmemo').val();

            let saleCustField1 = $('#edtSaleCustField1').val();
            let saleCustField2 = $('#edtSaleCustField2').val();
            var url = FlowRouter.current().path;
            var getso_id = url.split('?id=');
            var currentPurchaseOrder = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var currencyCode = $("#sltCurrency").val() || CountryAbbr;
            var objDetails = '';
            if (getso_id[1]) {
                currentPurchaseOrder = parseInt(currentPurchaseOrder);
                objDetails = {
                    type: "TPurchaseOrderEx",
                    fields: {
                        ID: currentPurchaseOrder,
                        SupplierName: supplier,
                        ForeignExchangeCode: currencyCode,
                        SupplierInvoiceNumber: poNumber || ' ',
                        Lines: splashLineArray,
                        OrderTo: billingAddress,
                        OrderDate: saleDate,

                        SupplierInvoiceDate: saleDate,

                        SaleLineRef: reference,
                        TermsName: termname,
                        Shipping: departement,
                        ShipTo: shippingAddress,
                        Comments: comments,


                        SalesComments: pickingInfrmation,
                        Attachments: uploadedItems,
                        OrderStatus: $('#sltStatus').val()
                    }
                };
            } else {
                objDetails = {
                    type: "TPurchaseOrderEx",
                    fields: {
                        SupplierName: supplier,
                        ForeignExchangeCode: currencyCode,
                        SupplierInvoiceNumber: poNumber || ' ',
                        Lines: splashLineArray,
                        OrderTo: billingAddress,
                        OrderDate: saleDate,

                        SupplierInvoiceDate: saleDate,

                        SaleLineRef: reference,
                        TermsName: termname,
                        Shipping: departement,
                        ShipTo: shippingAddress,
                        Comments: comments,
                        SalesComments: pickingInfrmation,
                        Attachments: uploadedItems,
                        OrderStatus: $('#sltStatus').val()
                    }
                };
            }
            purchaseService.savePurchaseOrderEx(objDetails).then(function(objDetails) {
                var supplierID = $('#edtSupplierEmail').attr('supplierid');
                if (supplierID !== " ") {
                    let supplierEmailData = {
                        type: "TSupplier",
                        fields: {
                            ID: supplierID,
                            Email: supplierEmail
                        }
                    }

                };
                let linesave = objDetails.fields.ID;

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
                            PrefName: 'purchaseordercard'
                        });
                        if (checkPrefDetails) {
                            CloudPreference.update({
                                _id: checkPrefDetails._id
                            }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'purchaseform',
                                    PrefName: 'purchaseordercard',
                                    published: true,
                                    customFields: [{
                                        index: '1',
                                        label: getcustomField1,
                                        hidden: getchkcustomField1
                                    }, {
                                        index: '2',
                                        label: getcustomField2,
                                        hidden: getchkcustomField2
                                    }],
                                    updatedAt: new Date()
                                }
                            }, function(err, idTag) {
                                if (err) {
                                    window.open('/paymentcard?soid=' + linesave, '_self');
                                } else {
                                    window.open('/paymentcard?soid=' + linesave, '_self');

                                }
                            });
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'purchaseform',
                                PrefName: 'purchaseordercard',
                                published: true,
                                customFields: [{
                                    index: '1',
                                    label: getcustomField1,
                                    hidden: getchkcustomField1
                                }, {
                                    index: '2',
                                    label: getcustomField2,
                                    hidden: getchkcustomField2
                                }],
                                createdAt: new Date()
                            }, function(err, idTag) {
                                if (err) {
                                    window.open('/paymentcard?soid=' + linesave, '_self');
                                } else {
                                    window.open('/paymentcard?soid=' + linesave, '_self');

                                }
                            });
                        }
                    }
                }

            }).catch(function(err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                    else if (result.dismiss === 'cancel') {

                    }
                });

                $('.fullScreenSpin').css('display', 'none');
            });
        }

    },
    'click .btnBack': function(event) {
        event.preventDefault();
        history.back(1);


    },
    'click #btnCopyToInvoice': function() {


        $('.fullScreenSpin').css('display', 'inline-block');
        var url = FlowRouter.current().path;
        if ((url.indexOf('?id=') > 0) || (url.indexOf('?copyquid=') > 0)) {
            let templateObject = Template.instance();
            let suppliername = $('#edtSupplierName');
            let purchaseService = new PurchaseBoardService();
            let termname = $('#sltTerms').val() || '';
            if (termname === '') {
                swal('Terms has not been selected!', '', 'warning');
                event.preventDefault();
                return false;
            }

            if (suppliername.val() === '') {
                swal('Supplier has not been selected!', '', 'warning');
                e.preventDefault();
            } else {

                $('.fullScreenSpin').css('display', 'inline-block');
                var splashLineArray = new Array();
                let lineItemsForm = [];
                let lineItemObjForm = {};
                let checkBackOrder = templateObject.includeBOnShippedQty.get();
                $('#tblPurchaseOrderLine > tbody > tr').each(function() {
                    var lineID = this.id;
                    let tdproduct = $('#' + lineID + " .lineProductName").val();
                    let tddescription = $('#' + lineID + " .lineProductDesc").text();
                    let tdQty = $('#' + lineID + " .lineQty").val();
                    let tdOrderd = $('#' + lineID + " .lineOrdered").val();

                    let tdunitprice = $('#' + lineID + " .colUnitPriceExChange").val();
                    let tdCustomerJob = $('#' + lineID + " .lineCustomerJob").val();
                    let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                    let tdtaxCode = $('#' + lineID + " .lineTaxCode").val();
                    let tdlineamt = $('#' + lineID + " .lineAmt").text();

                    if (tdproduct != "") {
                        if (checkBackOrder == true) {
                            lineItemObjForm = {
                                type: "TPurchaseOrderLine",
                                fields: {
                                    ProductName: tdproduct || '',
                                    ProductDescription: tddescription || '',
                                    UOMQtySold: parseFloat(tdOrderd) || 0,
                                    UOMQtyShipped: parseFloat(tdQty) || 0,
                                    LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                    CustomerJob: tdCustomerJob || '',
                                    LineTaxCode: tdtaxCode || '',
                                    LineClassName: $('#sltDept').val() || defaultDept
                                }
                            };
                        } else {
                            lineItemObjForm = {
                                type: "TPurchaseOrderLine",
                                fields: {
                                    ProductName: tdproduct || '',
                                    ProductDescription: tddescription || '',
                                    UOMQtySold: parseFloat(tdQty) || 0,

                                    LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                    CustomerJob: tdCustomerJob || '',
                                    LineTaxCode: tdtaxCode || '',
                                    LineClassName: $('#sltDept').val() || defaultDept
                                }
                            };

                        }
                        lineItemsForm.push(lineItemObjForm);
                        splashLineArray.push(lineItemObjForm);
                    }
                });
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

                let supplier = $('#edtSupplierName').val();
                let supplierEmail = $('#edtSupplierEmail').val();
                let billingAddress = $('#txabillingAddress').val();



                var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
                var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

                let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
                let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

                let poNumber = $('#ponumber').val();
                let reference = $('#edtRef').val();

                let departement = $('#shipvia').val();
                let shippingAddress = $('#txaShipingInfo').val();
                let comments = $('#txaComment').val();
                let pickingInfrmation = $('#txapickmemo').val();

                let saleCustField1 = $('#edtSaleCustField1').val();
                let saleCustField2 = $('#edtSaleCustField2').val();
                var url = FlowRouter.current().path;
                var getso_id = url.split('?id=');
                var currentPurchaseOrder = getso_id[getso_id.length - 1];
                let uploadedItems = templateObject.uploadedFiles.get();
                var currencyCode = $("#sltCurrency").val() || CountryAbbr;
                var objDetails = '';
                if (getso_id[1]) {
                    currentPurchaseOrder = parseInt(currentPurchaseOrder);
                    objDetails = {
                        type: "TPurchaseOrderEx",
                        fields: {
                            ID: currentPurchaseOrder,
                            SupplierName: supplier,
                            ForeignExchangeCode: currencyCode,
                            SupplierInvoiceNumber: poNumber || ' ',
                            Lines: splashLineArray,
                            OrderTo: billingAddress,
                            OrderDate: saleDate,

                            SupplierInvoiceDate: saleDate,

                            SaleLineRef: reference,
                            TermsName: termname,
                            Shipping: departement,
                            ShipTo: shippingAddress,
                            Comments: comments,


                            SalesComments: pickingInfrmation,
                            Attachments: uploadedItems,
                            OrderStatus: $('#sltStatus').val()
                        }
                    };
                } else {
                    objDetails = {
                        type: "TPurchaseOrderEx",
                        fields: {
                            SupplierName: supplier,
                            ForeignExchangeCode: currencyCode,
                            SupplierInvoiceNumber: poNumber || ' ',
                            Lines: splashLineArray,
                            OrderTo: billingAddress,
                            OrderDate: saleDate,

                            SupplierInvoiceDate: saleDate,

                            SaleLineRef: reference,
                            TermsName: termname,
                            Shipping: departement,
                            ShipTo: shippingAddress,
                            Comments: comments,
                            SalesComments: pickingInfrmation,
                            Attachments: uploadedItems,
                            OrderStatus: $('#sltStatus').val()
                        }
                    };
                }
                purchaseService.savePurchaseOrderEx(objDetails).then(function(objDetails) {
                    var supplierID = $('#edtSupplierEmail').attr('supplierid');
                    if (supplierID !== " ") {
                        let supplierEmailData = {
                            type: "TSupplier",
                            fields: {
                                ID: supplierID,
                                Email: supplierEmail
                            }
                        }



                    };
                    let linesave = objDetails.fields.ID;

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
                                PrefName: 'purchaseordercard'
                            });
                            if (checkPrefDetails) {
                                CloudPreference.update({
                                    _id: checkPrefDetails._id
                                }, {
                                    $set: {
                                        username: clientUsername,
                                        useremail: clientEmail,
                                        PrefGroup: 'purchaseform',
                                        PrefName: 'purchaseordercard',
                                        published: true,
                                        customFields: [{
                                            index: '1',
                                            label: getcustomField1,
                                            hidden: getchkcustomField1
                                        }, {
                                            index: '2',
                                            label: getcustomField2,
                                            hidden: getchkcustomField2
                                        }],
                                        updatedAt: new Date()
                                    }
                                }, function(err, idTag) {
                                    if (err) {
                                        window.open('/invoicecard?copysoid=' + linesave, '_self');
                                    } else {
                                        window.open('/invoicecard?copysoid=' + linesave, '_self');

                                    }
                                });
                            } else {
                                CloudPreference.insert({
                                    userid: clientID,
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'purchaseform',
                                    PrefName: 'purchaseordercard',
                                    published: true,
                                    customFields: [{
                                        index: '1',
                                        label: getcustomField1,
                                        hidden: getchkcustomField1
                                    }, {
                                        index: '2',
                                        label: getcustomField2,
                                        hidden: getchkcustomField2
                                    }],
                                    createdAt: new Date()
                                }, function(err, idTag) {
                                    if (err) {
                                        window.open('/invoicecard?copysoid=' + linesave, '_self');
                                    } else {
                                        window.open('/invoicecard?copysoid=' + linesave, '_self');

                                    }
                                });
                            }
                        }
                    }

                }).catch(function(err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                        else if (result.dismiss === 'cancel') {

                        }
                    });

                    $('.fullScreenSpin').css('display', 'none');
                });
            }
        } else {
            FlowRouter.go('/invoicecard');
        }
    },
    'click #btnCopyPO': function() {


        $('.fullScreenSpin').css('display', 'inline-block');
        var url = FlowRouter.current().path;

        let templateObject = Template.instance();
        let suppliername = $('#edtSupplierName');
        let purchaseService = new PurchaseBoardService();
        let termname = $('#sltTerms').val() || '';
        if (termname === '') {
            swal('Terms has not been selected!', '', 'warning');
            event.preventDefault();
            return false;
        }
        if (suppliername.val() === '') {
            swal('Supplier has not been selected!', '', 'warning');
            e.preventDefault();
        } else {

            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = new Array();
            let lineItemsForm = [];
            let lineItemObjForm = {};
            let checkBackOrder = templateObject.includeBOnShippedQty.get();
            $('#tblPurchaseOrderLine > tbody > tr').each(function() {
                var lineID = this.id;
                let tdproduct = $('#' + lineID + " .lineProductName").val();
                let tddescription = $('#' + lineID + " .lineProductDesc").text();
                let tdQty = $('#' + lineID + " .lineQty").val();
                let tdOrderd = $('#' + lineID + " .lineOrdered").val();

                let tdunitprice = $('#' + lineID + " .colUnitPriceExChange").val();
                let tdCustomerJob = $('#' + lineID + " .lineCustomerJob").val();
                let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                let tdtaxCode = $('#' + lineID + " .lineTaxCode").val();
                let tdlineamt = $('#' + lineID + " .lineAmt").text();

                if (tdproduct != "") {
                    if ($('input[name="chkCreatePOCredit"]').is(":checked")) {
                        lineItemObjForm = {
                            type: "TPurchaseOrderLine",
                            fields: {
                                ProductName: tdproduct || '',
                                ProductDescription: tddescription || '',
                                UOMQtySold: parseFloat(tdQty) || 0,
                                UOMQtyShipped: parseFloat(tdQty) || 0,
                                LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                CustomerJob: tdCustomerJob || '',
                                LineTaxCode: tdtaxCode || '',
                                LineClassName: $('#sltDept').val() || defaultDept
                            }
                        };
                    } else {
                        if (checkBackOrder == true) {
                            lineItemObjForm = {
                                type: "TPurchaseOrderLine",
                                fields: {
                                    ProductName: tdproduct || '',
                                    ProductDescription: tddescription || '',
                                    UOMQtySold: parseFloat(tdOrderd) || 0,
                                    UOMQtyShipped: parseFloat(tdQty) || 0,
                                    LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                    CustomerJob: tdCustomerJob || '',
                                    LineTaxCode: tdtaxCode || '',
                                    LineClassName: $('#sltDept').val() || defaultDept
                                }
                            };
                        } else {
                            lineItemObjForm = {
                                type: "TPurchaseOrderLine",
                                fields: {
                                    ProductName: tdproduct || '',
                                    ProductDescription: tddescription || '',
                                    UOMQtySold: parseFloat(tdQty) || 0,
                                    UOMQtyShipped: parseFloat(tdQty) || 0,
                                    LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                    CustomerJob: tdCustomerJob || '',
                                    LineTaxCode: tdtaxCode || '',
                                    LineClassName: $('#sltDept').val() || defaultDept
                                }
                            };

                        }

                    }
                    lineItemsForm.push(lineItemObjForm);
                    splashLineArray.push(lineItemObjForm);
                }
            });
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

            let supplier = $('#edtSupplierName').val();
            let supplierEmail = $('#edtSupplierEmail').val();
            let billingAddress = $('#txabillingAddress').val();

            var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
            var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

            let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
            let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

            let poNumber = $('#ponumber').val();
            let reference = $('#edtRef').val();

            let departement = $('#shipvia').val();
            let shippingAddress = $('#txaShipingInfo').val();
            let comments = $('#txaComment').val();
            let pickingInfrmation = $('#txapickmemo').val();

            let saleCustField1 = $('#edtSaleCustField1').val();
            let saleCustField2 = $('#edtSaleCustField2').val();
            let orderStatus = $('#edtStatus').val();

            var url = FlowRouter.current().path;
            var getso_id = url.split('?id=');
            var currentPurchaseOrder = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var currencyCode = $("#sltCurrency").val() || CountryAbbr;
            var objDetails = '';
            if (getso_id[1]) {
                currentPurchaseOrder = parseInt(currentPurchaseOrder);
                if ($('input[name="chkCreatePOCredit"]').is(":checked")) {
                    objDetails = {
                        type: "TPurchaseOrderEx",
                        fields: {

                            SupplierName: supplier,
                            ForeignExchangeCode: currencyCode,
                            SupplierInvoiceNumber: poNumber || ' ',
                            Lines: splashLineArray,
                            OrderTo: billingAddress,
                            OrderDate: saleDate,

                            SupplierInvoiceDate: saleDate,

                            SaleLineRef: reference,
                            TermsName: termname,
                            Shipping: departement,
                            ShipTo: shippingAddress,
                            Comments: comments,
                            SalesComments: pickingInfrmation,
                            Attachments: uploadedItems,
                            OrderStatus: $('#sltStatus').val()
                        }
                    };
                } else {
                    objDetails = {
                        type: "TPurchaseOrderEx",
                        fields: {

                            SupplierName: supplier,
                            ForeignExchangeCode: currencyCode,
                            SupplierInvoiceNumber: poNumber || ' ',
                            Lines: splashLineArray,
                            OrderTo: billingAddress,
                            OrderDate: saleDate,

                            SupplierInvoiceDate: saleDate,

                            SaleLineRef: reference,
                            TermsName: termname,
                            Shipping: departement,
                            ShipTo: shippingAddress,
                            Comments: comments,
                            SalesComments: pickingInfrmation,
                            Attachments: uploadedItems,
                            OrderStatus: $('#sltStatus').val()
                        }
                    };
                }
            } else {
                objDetails = {
                    type: "TPurchaseOrderEx",
                    fields: {
                        SupplierName: supplier,
                        ForeignExchangeCode: currencyCode,
                        SupplierInvoiceNumber: poNumber || ' ',
                        Lines: splashLineArray,
                        OrderTo: billingAddress,
                        OrderDate: saleDate,

                        SupplierInvoiceDate: saleDate,

                        SaleLineRef: reference,
                        TermsName: termname,
                        Shipping: departement,
                        ShipTo: shippingAddress,
                        Comments: comments,


                        SalesComments: pickingInfrmation,
                        Attachments: uploadedItems,
                        OrderStatus: $('#sltStatus').val()
                    }
                };
            }
            purchaseService.savePurchaseOrderEx(objDetails).then(function(objDetails) {
                var supplierID = $('#edtSupplierEmail').attr('supplierid');
                if (supplierID !== " ") {
                    let supplierEmailData = {
                        type: "TSupplier",
                        fields: {
                            ID: supplierID,
                            Email: supplierEmail
                        }
                    }
                };
                let linesave = objDetails.fields.ID;

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
                            PrefName: 'purchaseordercard'
                        });
                        if (checkPrefDetails) {
                            CloudPreference.update({
                                _id: checkPrefDetails._id
                            }, {
                                $set: {
                                    username: clientUsername,
                                    useremail: clientEmail,
                                    PrefGroup: 'purchaseform',
                                    PrefName: 'purchaseordercard',
                                    published: true,
                                    customFields: [{
                                        index: '1',
                                        label: getcustomField1,
                                        hidden: getchkcustomField1
                                    }, {
                                        index: '2',
                                        label: getcustomField2,
                                        hidden: getchkcustomField2
                                    }],
                                    updatedAt: new Date()
                                }
                            }, function(err, idTag) {
                                if (err) {
                                    window.open('/purchaseordercard?copypoid=' + linesave, '_self');
                                } else {
                                    window.open('/purchaseordercard?copypoid=' + linesave, '_self');

                                }
                            });
                        } else {
                            CloudPreference.insert({
                                userid: clientID,
                                username: clientUsername,
                                useremail: clientEmail,
                                PrefGroup: 'purchaseform',
                                PrefName: 'purchaseordercard',
                                published: true,
                                customFields: [{
                                    index: '1',
                                    label: getcustomField1,
                                    hidden: getchkcustomField1
                                }, {
                                    index: '2',
                                    label: getcustomField2,
                                    hidden: getchkcustomField2
                                }],
                                createdAt: new Date()
                            }, function(err, idTag) {
                                if (err) {
                                    window.open('/purchaseordercard?copypoid=' + linesave, '_self');
                                } else {
                                    window.open('/purchaseordercard?copypoid=' + linesave, '_self');

                                }
                            });
                        }
                    }
                } else {
                    window.open('/purchaseordercard?copypoid=' + linesave, '_self');
                }

            }).catch(function(err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                    else if (result.dismiss === 'cancel') {

                    }
                });

                $('.fullScreenSpin').css('display', 'none');
            });
        }



    },
    'click .chkCreatePOCredit': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        let $tblrows = $("#tblPurchaseOrderLine tbody tr");
        let isBOnShippedQty = templateObject.includeBOnShippedQty.get();



        if ($(event.target).is(':checked')) {

            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;

            $tblrows.each(function(index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".lineQty").val() || 0;
                var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
                var taxcode = $tblrow.find(".lineTaxCode").val() || 0;
                if (qty > 0) {
                    qty = "-" + qty;
                    $tblrow.find(".lineQty").val(qty);
                }
                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxcode) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }


                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                let lineTotalAmount = subTotal + taxTotal;
                $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));

                let unitPriceIncCalc = Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount)||0;
                let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, ""))||0;
                let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc||0;
                $tblrow.find('.colUnitPriceExChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
                $tblrow.find('.colUnitPriceIncChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal));

                if (!isNaN(subTotal)) {
                  $tblrow.find('.colAmountEx').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                  $tblrow.find('.colAmountInc').text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                    document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
                }

                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                }
            });
        } else {
            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;

            $tblrows.each(function(index) {
                var $tblrow = $(this);
                var qty = $tblrow.find(".lineQty").val() || 0;
                var price = $tblrow.find(".colUnitPriceExChange").val() || 0;
                var taxcode = $tblrow.find(".lineTaxCode").val() || 0;
                if (qty > 0) {
                    qty = qty;
                    $tblrow.find(".lineQty").val(qty);
                } else {
                    qty = Math.abs(qty);
                    $tblrow.find(".lineQty").val(qty);
                }
                var taxrateamount = 0;
                if (taxcodeList) {
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if (taxcodeList[i].codename == taxcode) {
                            taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                        }
                    }
                }


                var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
                var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                let lineTotalAmount = subTotal + taxTotal;
                $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));

                let unitPriceIncCalc = Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount)||0;
                let lineUnitPriceExVal = Number(price.replace(/[^0-9.-]+/g, ""))||0;
                let lineUnitPriceIncVal = lineUnitPriceExVal + unitPriceIncCalc||0;
                $tblrow.find('.colUnitPriceExChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceExVal));
                $tblrow.find('.colUnitPriceIncChange').val(utilityService.modifynegativeCurrencyFormat(lineUnitPriceIncVal));

                if (!isNaN(subTotal)) {
                  $tblrow.find('.colAmountEx').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                  $tblrow.find('.colAmountInc').text(utilityService.modifynegativeCurrencyFormat(lineTotalAmount));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                    document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
                }

                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                    document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                }
            });
        }
    },
    'click #btnPayment': function() {
        let tpobtnpayment = Template.instance();
        let purchaseService = new PurchaseBoardService();
        $('.fullScreenSpin').css('display', 'inline-block');
        let termname = $('#sltTerms').val() || '';
        if (termname === '') {
            swal('Terms has not been selected!', '', 'warning');
            event.preventDefault();
            return false;
        }
        if ($('#edtSupplierName').val() === '') {
            swal('Supplier has not been selected!', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
        };
        var currenturl = window.location.href;
        var getcurrent_id = currenturl.split('?id=');


        if (getcurrent_id[1]) {
            var currentId = getcurrent_id[getcurrent_id.length - 1];
        } else {
            var currentId = "0";
        }
        purchaseService.getCheckCreditData($('#edtSupplierName').val()).then(function(data) {
            if (data.tcredit.length > 0) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Do you want to Apply Credit?',
                    text: '',
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                }).then((result) => {
                    if (result.value) {



                        $('.fullScreenSpin').css('display', 'inline-block');
                        var splashLineArray = new Array();
                        let lineItemsForm = [];
                        let lineItemObjForm = {};
                        let checkBackOrder = tpobtnpayment.includeBOnShippedQty.get();
                        $('#tblPurchaseOrderLine > tbody > tr').each(function() {
                            var lineID = this.id;
                            let tdproduct = $('#' + lineID + " .lineProductName").val();
                            let tddescription = $('#' + lineID + " .lineProductDesc").text();
                            let tdQty = $('#' + lineID + " .lineQty").val();
                            let tdOrderd = $('#' + lineID + " .lineOrdered").val();

                            let tdunitprice = $('#' + lineID + " .colUnitPriceExChange").val();
                            let tdCustomerJob = $('#' + lineID + " .lineCustomerJob").val();
                            let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                            let tdtaxCode = $('#' + lineID + " .lineTaxCode").val();
                            let tdlineamt = $('#' + lineID + " .lineAmt").text();

                            if (tdproduct != "") {
                                if ($('input[name="chkCreatePOCredit"]').is(":checked")) {
                                    lineItemObjForm = {
                                        type: "TPurchaseOrderLine",
                                        fields: {
                                            ProductName: tdproduct || '',
                                            ProductDescription: tddescription || '',
                                            UOMQtySold: parseFloat(tdQty) || 0,
                                            UOMQtyShipped: parseFloat(tdQty) || 0,
                                            LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                            CustomerJob: tdCustomerJob || '',
                                            LineTaxCode: tdtaxCode || '',
                                            LineClassName: $('#sltDept').val() || defaultDept
                                        }
                                    };
                                } else {
                                    if (checkBackOrder == true) {
                                        lineItemObjForm = {
                                            type: "TPurchaseOrderLine",
                                            fields: {
                                                ProductName: tdproduct || '',
                                                ProductDescription: tddescription || '',
                                                UOMQtySold: parseFloat(tdOrderd) || 0,
                                                UOMQtyShipped: parseFloat(tdQty) || 0,
                                                LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                                CustomerJob: tdCustomerJob || '',
                                                LineTaxCode: tdtaxCode || '',
                                                LineClassName: $('#sltDept').val() || defaultDept
                                            }
                                        };
                                    } else {
                                        lineItemObjForm = {
                                            type: "TPurchaseOrderLine",
                                            fields: {
                                                ProductName: tdproduct || '',
                                                ProductDescription: tddescription || '',
                                                UOMQtySold: parseFloat(tdQty) || 0,
                                                UOMQtyShipped: parseFloat(tdQty) || 0,
                                                LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                                CustomerJob: tdCustomerJob || '',
                                                LineTaxCode: tdtaxCode || '',
                                                LineClassName: $('#sltDept').val() || defaultDept
                                            }
                                        };

                                    }

                                }
                                lineItemsForm.push(lineItemObjForm);
                                splashLineArray.push(lineItemObjForm);
                            }
                        });
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

                        let supplier = $('#edtSupplierName').val();
                        let supplierEmail = $('#edtSupplierEmail').val();
                        let billingAddress = $('#txabillingAddress').val();

                        var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
                        var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

                        let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
                        let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

                        let poNumber = $('#ponumber').val();
                        let reference = $('#edtRef').val();

                        let departement = $('#shipvia').val();
                        let shippingAddress = $('#txaShipingInfo').val();
                        let comments = $('#txaComment').val();
                        let pickingInfrmation = $('#txapickmemo').val();

                        let saleCustField1 = $('#edtSaleCustField1').val();
                        let saleCustField2 = $('#edtSaleCustField2').val();

                        let orderStatus = $('#edtStatus').val();

                        var url = FlowRouter.current().path;
                        var getso_id = url.split('?id=');
                        var currentPurchaseOrder = getso_id[getso_id.length - 1];
                        let uploadedItems = tpobtnpayment.uploadedFiles.get();
                        var currencyCode = $("#sltCurrency").val() || CountryAbbr;
                        var objDetails = '';
                        if (getso_id[1]) {
                            currentPurchaseOrder = parseInt(currentPurchaseOrder);
                            if ($('input[name="chkCreatePOCredit"]').is(":checked")) {
                                objDetails = {
                                    type: "TPurchaseOrderEx",
                                    fields: {

                                        SupplierName: supplier,
                                        ForeignExchangeCode: currencyCode,
                                        SupplierInvoiceNumber: poNumber || ' ',
                                        Lines: splashLineArray,
                                        OrderTo: billingAddress,
                                        OrderDate: saleDate,

                                        SupplierInvoiceDate: saleDate,

                                        SaleLineRef: reference,
                                        TermsName: termname,
                                        Shipping: departement,
                                        ShipTo: shippingAddress,
                                        Comments: comments,
                                        SalesComments: pickingInfrmation,
                                        Attachments: uploadedItems,
                                        OrderStatus: $('#sltStatus').val()
                                    }
                                };
                            } else {
                                objDetails = {
                                    type: "TPurchaseOrderEx",
                                    fields: {
                                        ID: currentPurchaseOrder,
                                        SupplierName: supplier,
                                        ForeignExchangeCode: currencyCode,
                                        SupplierInvoiceNumber: poNumber || ' ',
                                        Lines: splashLineArray,
                                        OrderTo: billingAddress,
                                        OrderDate: saleDate,

                                        SupplierInvoiceDate: saleDate,

                                        SaleLineRef: reference,
                                        TermsName: termname,
                                        Shipping: departement,
                                        ShipTo: shippingAddress,
                                        Comments: comments,
                                        SalesComments: pickingInfrmation,
                                        Attachments: uploadedItems,
                                        OrderStatus: $('#sltStatus').val()
                                    }
                                };
                            }
                        } else {
                            objDetails = {
                                type: "TPurchaseOrderEx",
                                fields: {
                                    SupplierName: supplier,
                                    ForeignExchangeCode: currencyCode,
                                    SupplierInvoiceNumber: poNumber || ' ',
                                    Lines: splashLineArray,
                                    OrderTo: billingAddress,
                                    OrderDate: saleDate,

                                    SupplierInvoiceDate: saleDate,

                                    SaleLineRef: reference,
                                    TermsName: termname,
                                    Shipping: departement,
                                    ShipTo: shippingAddress,
                                    Comments: comments,


                                    SalesComments: pickingInfrmation,
                                    Attachments: uploadedItems,
                                    OrderStatus: $('#sltStatus').val()
                                }
                            };
                        }

                        purchaseService.savePurchaseOrderEx(objDetails).then(function(objDetails) {
                            var supplierID = $('#edtSupplierEmail').attr('supplierid');
                            if (supplierID !== " ") {
                                let supplierEmailData = {
                                    type: "TSupplier",
                                    fields: {
                                        ID: supplierID,
                                        Email: supplierEmail
                                    }
                                }



                            };
                            let linesave = objDetails.fields.ID;
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
                                        PrefName: 'purchaseordercard'
                                    });
                                    if (checkPrefDetails) {
                                        CloudPreference.update({
                                            _id: checkPrefDetails._id
                                        }, {
                                            $set: {
                                                username: clientUsername,
                                                useremail: clientEmail,
                                                PrefGroup: 'purchaseform',
                                                PrefName: 'purchaseordercard',
                                                published: true,
                                                customFields: [{
                                                    index: '1',
                                                    label: getcustomField1,
                                                    hidden: getchkcustomField1
                                                }, {
                                                    index: '2',
                                                    label: getcustomField2,
                                                    hidden: getchkcustomField2
                                                }],
                                                updatedAt: new Date()
                                            }
                                        }, function(err, idTag) {
                                            if (err) {
                                                window.open('/supplierpaymentcard?suppcreditname=' + supplier + '&pocreditid=' + linesave, '_self');
                                            } else {
                                                window.open('/supplierpaymentcard?suppcreditname=' + supplier + '&pocreditid=' + linesave, '_self');

                                            }
                                        });
                                    } else {
                                        CloudPreference.insert({
                                            userid: clientID,
                                            username: clientUsername,
                                            useremail: clientEmail,
                                            PrefGroup: 'purchaseform',
                                            PrefName: 'purchaseordercard',
                                            published: true,
                                            customFields: [{
                                                index: '1',
                                                label: getcustomField1,
                                                hidden: getchkcustomField1
                                            }, {
                                                index: '2',
                                                label: getcustomField2,
                                                hidden: getchkcustomField2
                                            }],
                                            createdAt: new Date()
                                        }, function(err, idTag) {
                                            if (err) {
                                                window.open('/supplierpaymentcard?suppcreditname=' + supplier + '&pocreditid=' + linesave, '_self');
                                            } else {
                                                window.open('/supplierpaymentcard?suppcreditname=' + supplier + '&pocreditid=' + linesave, '_self');

                                            }
                                        });
                                    }
                                }
                            } else {
                                window.open('/supplierpaymentcard?suppcreditname=' + supplier + '&pocreditid=' + linesave, '_self');
                            }


                        }).catch(function(err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                                else if (result.dismiss === 'cancel') {

                                }
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else if (result.dismiss === 'cancel') {
                        if (getcurrent_id[1]) {
                            window.open('/supplierpaymentcard?poid=' + currentId, '_self');
                        } else {

                            let suppliername = $('#edtSupplierName');
                            let purchaseService = new PurchaseBoardService();
                            let termname = $('#sltTerms').val() || '';
                            if (termname === '') {
                                swal('Terms has not been selected!', '', 'warning');
                                event.preventDefault();
                                return false;
                            }

                            if (suppliername.val() === '') {
                                swal('Supplier has not been selected!', '', 'warning');
                                e.preventDefault();
                            } else {

                                $('.fullScreenSpin').css('display', 'inline-block');
                                var splashLineArray = new Array();
                                let lineItemsForm = [];
                                let lineItemObjForm = {};
                                let checkBackOrder = tpobtnpayment.includeBOnShippedQty.get();
                                $('#tblPurchaseOrderLine > tbody > tr').each(function() {
                                    var lineID = this.id;
                                    let tdproduct = $('#' + lineID + " .lineProductName").val();
                                    let tddescription = $('#' + lineID + " .lineProductDesc").text();
                                    let tdQty = $('#' + lineID + " .lineQty").val();
                                    let tdOrderd = $('#' + lineID + " .lineOrdered").val();

                                    let tdunitprice = $('#' + lineID + " .colUnitPriceExChange").val();
                                    let tdCustomerJob = $('#' + lineID + " .lineCustomerJob").val();
                                    let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                                    let tdtaxCode = $('#' + lineID + " .lineTaxCode").val();
                                    let tdlineamt = $('#' + lineID + " .lineAmt").text();

                                    if (tdproduct != "") {
                                        if ($('input[name="chkCreatePOCredit"]').is(":checked")) {
                                            lineItemObjForm = {
                                                type: "TPurchaseOrderLine",
                                                fields: {
                                                    ProductName: tdproduct || '',
                                                    ProductDescription: tddescription || '',
                                                    UOMQtySold: parseFloat(tdQty) || 0,
                                                    UOMQtyShipped: parseFloat(tdQty) || 0,
                                                    LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                                    CustomerJob: tdCustomerJob || '',
                                                    LineTaxCode: tdtaxCode || '',
                                                    LineClassName: $('#sltDept').val() || defaultDept
                                                }
                                            };
                                        } else {
                                            if (checkBackOrder == true) {
                                                lineItemObjForm = {
                                                    type: "TPurchaseOrderLine",
                                                    fields: {
                                                        ProductName: tdproduct || '',
                                                        ProductDescription: tddescription || '',
                                                        UOMQtySold: parseFloat(tdOrderd) || 0,
                                                        UOMQtyShipped: parseFloat(tdQty) || 0,
                                                        LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                                        CustomerJob: tdCustomerJob || '',
                                                        LineTaxCode: tdtaxCode || '',
                                                        LineClassName: $('#sltDept').val() || defaultDept
                                                    }
                                                };
                                            } else {
                                                lineItemObjForm = {
                                                    type: "TPurchaseOrderLine",
                                                    fields: {
                                                        ProductName: tdproduct || '',
                                                        ProductDescription: tddescription || '',
                                                        UOMQtySold: parseFloat(tdQty) || 0,
                                                        UOMQtyShipped: parseFloat(tdQty) || 0,
                                                        LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                                        CustomerJob: tdCustomerJob || '',
                                                        LineTaxCode: tdtaxCode || '',
                                                        LineClassName: $('#sltDept').val() || defaultDept
                                                    }
                                                };

                                            }

                                        }
                                        lineItemsForm.push(lineItemObjForm);
                                        splashLineArray.push(lineItemObjForm);
                                    }
                                });
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

                                let supplier = $('#edtSupplierName').val();
                                let supplierEmail = $('#edtSupplierEmail').val();
                                let billingAddress = $('#txabillingAddress').val();

                                var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
                                var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

                                let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
                                let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

                                let poNumber = $('#ponumber').val();
                                let reference = $('#edtRef').val();

                                let departement = $('#shipvia').val();
                                let shippingAddress = $('#txaShipingInfo').val();
                                let comments = $('#txaComment').val();
                                let pickingInfrmation = $('#txapickmemo').val();

                                let saleCustField1 = $('#edtSaleCustField1').val();
                                let saleCustField2 = $('#edtSaleCustField2').val();

                                let orderStatus = $('#edtStatus').val();

                                var url = FlowRouter.current().path;
                                var getso_id = url.split('?id=');
                                var currentPurchaseOrder = getso_id[getso_id.length - 1];
                                let uploadedItems = tpobtnpayment.uploadedFiles.get();
                                var currencyCode = $("#sltCurrency").val() || CountryAbbr;
                                var objDetails = '';
                                if (getso_id[1]) {
                                    currentPurchaseOrder = parseInt(currentPurchaseOrder);
                                    if ($('input[name="chkCreatePOCredit"]').is(":checked")) {
                                        objDetails = {
                                            type: "TPurchaseOrderEx",
                                            fields: {

                                                SupplierName: supplier,
                                                ForeignExchangeCode: currencyCode,
                                                SupplierInvoiceNumber: poNumber || ' ',
                                                Lines: splashLineArray,
                                                OrderTo: billingAddress,
                                                OrderDate: saleDate,

                                                SupplierInvoiceDate: saleDate,

                                                SaleLineRef: reference,
                                                TermsName: termname,
                                                Shipping: departement,
                                                ShipTo: shippingAddress,
                                                Comments: comments,
                                                SalesComments: pickingInfrmation,
                                                Attachments: uploadedItems,
                                                OrderStatus: $('#sltStatus').val()
                                            }
                                        };
                                    } else {
                                        objDetails = {
                                            type: "TPurchaseOrderEx",
                                            fields: {
                                                ID: currentPurchaseOrder,
                                                SupplierName: supplier,
                                                ForeignExchangeCode: currencyCode,
                                                SupplierInvoiceNumber: poNumber || ' ',
                                                Lines: splashLineArray,
                                                OrderTo: billingAddress,
                                                OrderDate: saleDate,

                                                SupplierInvoiceDate: saleDate,

                                                SaleLineRef: reference,
                                                TermsName: termname,
                                                Shipping: departement,
                                                ShipTo: shippingAddress,
                                                Comments: comments,
                                                SalesComments: pickingInfrmation,
                                                Attachments: uploadedItems,
                                                OrderStatus: $('#sltStatus').val()
                                            }
                                        };
                                    }
                                } else {
                                    objDetails = {
                                        type: "TPurchaseOrderEx",
                                        fields: {
                                            SupplierName: supplier,
                                            ForeignExchangeCode: currencyCode,
                                            SupplierInvoiceNumber: poNumber || ' ',
                                            Lines: splashLineArray,
                                            OrderTo: billingAddress,
                                            OrderDate: saleDate,

                                            SupplierInvoiceDate: saleDate,

                                            SaleLineRef: reference,
                                            TermsName: termname,
                                            Shipping: departement,
                                            ShipTo: shippingAddress,
                                            Comments: comments,


                                            SalesComments: pickingInfrmation,
                                            Attachments: uploadedItems,
                                            OrderStatus: $('#sltStatus').val()
                                        }
                                    };
                                }

                                purchaseService.savePurchaseOrderEx(objDetails).then(function(objDetails) {
                                    var supplierID = $('#edtSupplierEmail').attr('supplierid');
                                    if (supplierID !== " ") {
                                        let supplierEmailData = {
                                            type: "TSupplier",
                                            fields: {
                                                ID: supplierID,
                                                Email: supplierEmail
                                            }
                                        }



                                    };
                                    let linesave = objDetails.fields.ID;
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
                                                PrefName: 'purchaseordercard'
                                            });
                                            if (checkPrefDetails) {
                                                CloudPreference.update({
                                                    _id: checkPrefDetails._id
                                                }, {
                                                    $set: {
                                                        username: clientUsername,
                                                        useremail: clientEmail,
                                                        PrefGroup: 'purchaseform',
                                                        PrefName: 'purchaseordercard',
                                                        published: true,
                                                        customFields: [{
                                                            index: '1',
                                                            label: getcustomField1,
                                                            hidden: getchkcustomField1
                                                        }, {
                                                            index: '2',
                                                            label: getcustomField2,
                                                            hidden: getchkcustomField2
                                                        }],
                                                        updatedAt: new Date()
                                                    }
                                                }, function(err, idTag) {
                                                    if (err) {
                                                        window.open('/supplierpaymentcard?poid=' + linesave, '_self');
                                                    } else {
                                                        window.open('/supplierpaymentcard?poid=' + linesave, '_self');

                                                    }
                                                });
                                            } else {
                                                CloudPreference.insert({
                                                    userid: clientID,
                                                    username: clientUsername,
                                                    useremail: clientEmail,
                                                    PrefGroup: 'purchaseform',
                                                    PrefName: 'purchaseordercard',
                                                    published: true,
                                                    customFields: [{
                                                        index: '1',
                                                        label: getcustomField1,
                                                        hidden: getchkcustomField1
                                                    }, {
                                                        index: '2',
                                                        label: getcustomField2,
                                                        hidden: getchkcustomField2
                                                    }],
                                                    createdAt: new Date()
                                                }, function(err, idTag) {
                                                    if (err) {
                                                        window.open('/supplierpaymentcard?poid=' + linesave, '_self');
                                                    } else {
                                                        window.open('/supplierpaymentcard?poid=' + linesave, '_self');

                                                    }
                                                });
                                            }
                                        }
                                    } else {
                                        window.open('/supplierpaymentcard?poid=' + linesave, '_self');
                                    }

                                }).catch(function(err) {
                                    swal({
                                        title: 'Oooops...',
                                        text: err,
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                                        else if (result.dismiss === 'cancel') {

                                        }
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }


                        }
                    }
                });
            } else {
                $('.fullScreenSpin').css('display', 'none');
                if (getcurrent_id[1]) {
                    window.open('/supplierpaymentcard?poid=' + currentId, '_self');
                } else {

                    let suppliername = $('#edtSupplierName');
                    let purchaseService = new PurchaseBoardService();
                    let termname = $('#sltTerms').val() || '';
                    if (termname === '') {
                        swal('Terms has not been selected!', '', 'warning');
                        event.preventDefault();
                        return false;
                    }

                    if (suppliername.val() === '') {
                        swal('Supplier has not been selected!', '', 'warning');
                        e.preventDefault();
                    } else {

                        $('.fullScreenSpin').css('display', 'inline-block');
                        var splashLineArray = new Array();
                        let lineItemsForm = [];
                        let lineItemObjForm = {};
                        let checkBackOrder = tpobtnpayment.includeBOnShippedQty.get();
                        $('#tblPurchaseOrderLine > tbody > tr').each(function() {
                            var lineID = this.id;
                            let tdproduct = $('#' + lineID + " .lineProductName").val();
                            let tddescription = $('#' + lineID + " .lineProductDesc").text();
                            let tdQty = $('#' + lineID + " .lineQty").val();
                            let tdOrderd = $('#' + lineID + " .lineOrdered").val();

                            let tdunitprice = $('#' + lineID + " .colUnitPriceExChange").val();
                            let tdCustomerJob = $('#' + lineID + " .lineCustomerJob").val();
                            let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                            let tdtaxCode = $('#' + lineID + " .lineTaxCode").val();
                            let tdlineamt = $('#' + lineID + " .lineAmt").text();

                            if (tdproduct != "") {
                                if ($('input[name="chkCreatePOCredit"]').is(":checked")) {
                                    lineItemObjForm = {
                                        type: "TPurchaseOrderLine",
                                        fields: {
                                            ProductName: tdproduct || '',
                                            ProductDescription: tddescription || '',
                                            UOMQtySold: parseFloat(tdQty) || 0,
                                            UOMQtyShipped: parseFloat(tdQty) || 0,
                                            LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                            CustomerJob: tdCustomerJob || '',
                                            LineTaxCode: tdtaxCode || '',
                                            LineClassName: $('#sltDept').val() || defaultDept
                                        }
                                    };
                                } else {
                                    if (checkBackOrder == true) {
                                        lineItemObjForm = {
                                            type: "TPurchaseOrderLine",
                                            fields: {
                                                ProductName: tdproduct || '',
                                                ProductDescription: tddescription || '',
                                                UOMQtySold: parseFloat(tdOrderd) || 0,
                                                UOMQtyShipped: parseFloat(tdQty) || 0,
                                                LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                                CustomerJob: tdCustomerJob || '',
                                                LineTaxCode: tdtaxCode || '',
                                                LineClassName: $('#sltDept').val() || defaultDept
                                            }
                                        };
                                    } else {
                                        lineItemObjForm = {
                                            type: "TPurchaseOrderLine",
                                            fields: {
                                                ProductName: tdproduct || '',
                                                ProductDescription: tddescription || '',
                                                UOMQtySold: parseFloat(tdQty) || 0,
                                                UOMQtyShipped: parseFloat(tdQty) || 0,
                                                LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                                CustomerJob: tdCustomerJob || '',
                                                LineTaxCode: tdtaxCode || '',
                                                LineClassName: $('#sltDept').val() || defaultDept
                                            }
                                        };

                                    }

                                }
                                lineItemsForm.push(lineItemObjForm);
                                splashLineArray.push(lineItemObjForm);
                            }
                        });
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

                        let supplier = $('#edtSupplierName').val();
                        let supplierEmail = $('#edtSupplierEmail').val();
                        let billingAddress = $('#txabillingAddress').val();

                        var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
                        var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

                        let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
                        let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

                        let poNumber = $('#ponumber').val();
                        let reference = $('#edtRef').val();

                        let departement = $('#shipvia').val();
                        let shippingAddress = $('#txaShipingInfo').val();
                        let comments = $('#txaComment').val();
                        let pickingInfrmation = $('#txapickmemo').val();

                        let saleCustField1 = $('#edtSaleCustField1').val();
                        let saleCustField2 = $('#edtSaleCustField2').val();

                        let orderStatus = $('#edtStatus').val();

                        var url = FlowRouter.current().path;
                        var getso_id = url.split('?id=');
                        var currentPurchaseOrder = getso_id[getso_id.length - 1];
                        let uploadedItems = tpobtnpayment.uploadedFiles.get();
                        var currencyCode = $("#sltCurrency").val() || CountryAbbr;
                        var objDetails = '';
                        if (getso_id[1]) {
                            currentPurchaseOrder = parseInt(currentPurchaseOrder);
                            if ($('input[name="chkCreatePOCredit"]').is(":checked")) {
                                objDetails = {
                                    type: "TPurchaseOrderEx",
                                    fields: {

                                        SupplierName: supplier,
                                        ForeignExchangeCode: currencyCode,
                                        SupplierInvoiceNumber: poNumber || ' ',
                                        Lines: splashLineArray,
                                        OrderTo: billingAddress,
                                        OrderDate: saleDate,

                                        SupplierInvoiceDate: saleDate,

                                        SaleLineRef: reference,
                                        TermsName: termname,
                                        Shipping: departement,
                                        ShipTo: shippingAddress,
                                        Comments: comments,
                                        SalesComments: pickingInfrmation,
                                        Attachments: uploadedItems,
                                        OrderStatus: $('#sltStatus').val()
                                    }
                                };
                            } else {
                                objDetails = {
                                    type: "TPurchaseOrderEx",
                                    fields: {
                                        ID: currentPurchaseOrder,
                                        SupplierName: supplier,
                                        ForeignExchangeCode: currencyCode,
                                        SupplierInvoiceNumber: poNumber || ' ',
                                        Lines: splashLineArray,
                                        OrderTo: billingAddress,
                                        OrderDate: saleDate,

                                        SupplierInvoiceDate: saleDate,

                                        SaleLineRef: reference,
                                        TermsName: termname,
                                        Shipping: departement,
                                        ShipTo: shippingAddress,
                                        Comments: comments,
                                        SalesComments: pickingInfrmation,
                                        Attachments: uploadedItems,
                                        OrderStatus: $('#sltStatus').val()
                                    }
                                };
                            }
                        } else {
                            objDetails = {
                                type: "TPurchaseOrderEx",
                                fields: {
                                    SupplierName: supplier,
                                    ForeignExchangeCode: currencyCode,
                                    SupplierInvoiceNumber: poNumber || ' ',
                                    Lines: splashLineArray,
                                    OrderTo: billingAddress,
                                    OrderDate: saleDate,

                                    SupplierInvoiceDate: saleDate,

                                    SaleLineRef: reference,
                                    TermsName: termname,
                                    Shipping: departement,
                                    ShipTo: shippingAddress,
                                    Comments: comments,


                                    SalesComments: pickingInfrmation,
                                    Attachments: uploadedItems,
                                    OrderStatus: $('#sltStatus').val()
                                }
                            };
                        }

                        purchaseService.savePurchaseOrderEx(objDetails).then(function(objDetails) {
                            var supplierID = $('#edtSupplierEmail').attr('supplierid');
                            if (supplierID !== " ") {
                                let supplierEmailData = {
                                    type: "TSupplier",
                                    fields: {
                                        ID: supplierID,
                                        Email: supplierEmail
                                    }
                                }



                            };
                            let linesave = objDetails.fields.ID;
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
                                        PrefName: 'purchaseordercard'
                                    });
                                    if (checkPrefDetails) {
                                        CloudPreference.update({
                                            _id: checkPrefDetails._id
                                        }, {
                                            $set: {
                                                username: clientUsername,
                                                useremail: clientEmail,
                                                PrefGroup: 'purchaseform',
                                                PrefName: 'purchaseordercard',
                                                published: true,
                                                customFields: [{
                                                    index: '1',
                                                    label: getcustomField1,
                                                    hidden: getchkcustomField1
                                                }, {
                                                    index: '2',
                                                    label: getcustomField2,
                                                    hidden: getchkcustomField2
                                                }],
                                                updatedAt: new Date()
                                            }
                                        }, function(err, idTag) {
                                            if (err) {
                                                window.open('/supplierpaymentcard?poid=' + linesave, '_self');
                                            } else {
                                                window.open('/supplierpaymentcard?poid=' + linesave, '_self');

                                            }
                                        });
                                    } else {
                                        CloudPreference.insert({
                                            userid: clientID,
                                            username: clientUsername,
                                            useremail: clientEmail,
                                            PrefGroup: 'purchaseform',
                                            PrefName: 'purchaseordercard',
                                            published: true,
                                            customFields: [{
                                                index: '1',
                                                label: getcustomField1,
                                                hidden: getchkcustomField1
                                            }, {
                                                index: '2',
                                                label: getcustomField2,
                                                hidden: getchkcustomField2
                                            }],
                                            createdAt: new Date()
                                        }, function(err, idTag) {
                                            if (err) {
                                                window.open('/supplierpaymentcard?poid=' + linesave, '_self');
                                            } else {
                                                window.open('/supplierpaymentcard?poid=' + linesave, '_self');

                                            }
                                        });
                                    }
                                }
                            } else {
                                window.open('/supplierpaymentcard?poid=' + linesave, '_self');
                            }

                        }).catch(function(err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                                else if (result.dismiss === 'cancel') {

                                }
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }


                }
            }
        }).catch(function(err) {
            $('.fullScreenSpin').css('display', 'none');
            if (getcurrent_id[1]) {
                window.open('/supplierpaymentcard?poid=' + currentId, '_self');
            } else {

                let suppliername = $('#edtSupplierName');
                let purchaseService = new PurchaseBoardService();
                let termname = $('#sltTerms').val() || '';
                if (termname === '') {
                    swal('Terms has not been selected!', '', 'warning');
                    event.preventDefault();
                    return false;
                }

                if (suppliername.val() === '') {
                    swal('Supplier has not been selected!', '', 'warning');
                    e.preventDefault();
                } else {

                    $('.fullScreenSpin').css('display', 'inline-block');
                    var splashLineArray = new Array();
                    let lineItemsForm = [];
                    let lineItemObjForm = {};
                    let checkBackOrder = tpobtnpayment.includeBOnShippedQty.get();
                    $('#tblPurchaseOrderLine > tbody > tr').each(function() {
                        var lineID = this.id;
                        let tdproduct = $('#' + lineID + " .lineProductName").val();
                        let tddescription = $('#' + lineID + " .lineProductDesc").text();
                        let tdQty = $('#' + lineID + " .lineQty").val();
                        let tdOrderd = $('#' + lineID + " .lineOrdered").val();

                        let tdunitprice = $('#' + lineID + " .colUnitPriceExChange").val();
                        let tdCustomerJob = $('#' + lineID + " .lineCustomerJob").val();
                        let tdtaxrate = $('#' + lineID + " .lineTaxRate").text();
                        let tdtaxCode = $('#' + lineID + " .lineTaxCode").val();
                        let tdlineamt = $('#' + lineID + " .lineAmt").text();

                        if (tdproduct != "") {
                            if ($('input[name="chkCreatePOCredit"]').is(":checked")) {
                                lineItemObjForm = {
                                    type: "TPurchaseOrderLine",
                                    fields: {
                                        ProductName: tdproduct || '',
                                        ProductDescription: tddescription || '',
                                        UOMQtySold: parseFloat(tdQty) || 0,
                                        UOMQtyShipped: parseFloat(tdQty) || 0,
                                        LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                        CustomerJob: tdCustomerJob || '',
                                        LineTaxCode: tdtaxCode || '',
                                        LineClassName: $('#sltDept').val() || defaultDept
                                    }
                                };
                            } else {
                                if (checkBackOrder == true) {
                                    lineItemObjForm = {
                                        type: "TPurchaseOrderLine",
                                        fields: {
                                            ProductName: tdproduct || '',
                                            ProductDescription: tddescription || '',
                                            UOMQtySold: parseFloat(tdOrderd) || 0,
                                            UOMQtyShipped: parseFloat(tdQty) || 0,
                                            LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                            CustomerJob: tdCustomerJob || '',
                                            LineTaxCode: tdtaxCode || '',
                                            LineClassName: $('#sltDept').val() || defaultDept
                                        }
                                    };
                                } else {
                                    lineItemObjForm = {
                                        type: "TPurchaseOrderLine",
                                        fields: {
                                            ProductName: tdproduct || '',
                                            ProductDescription: tddescription || '',
                                            UOMQtySold: parseFloat(tdQty) || 0,
                                            UOMQtyShipped: parseFloat(tdQty) || 0,
                                            LineCost: Number(tdunitprice.replace(/[^0-9.-]+/g, "")) || 0,
                                            CustomerJob: tdCustomerJob || '',
                                            LineTaxCode: tdtaxCode || '',
                                            LineClassName: $('#sltDept').val() || defaultDept
                                        }
                                    };

                                }

                            }
                            lineItemsForm.push(lineItemObjForm);
                            splashLineArray.push(lineItemObjForm);
                        }
                    });
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

                    let supplier = $('#edtSupplierName').val();
                    let supplierEmail = $('#edtSupplierEmail').val();
                    let billingAddress = $('#txabillingAddress').val();

                    var saledateTime = new Date($("#dtSODate").datepicker("getDate"));
                    var duedateTime = new Date($("#dtDueDate").datepicker("getDate"));

                    let saleDate = saledateTime.getFullYear() + "-" + (saledateTime.getMonth() + 1) + "-" + saledateTime.getDate();
                    let dueDate = duedateTime.getFullYear() + "-" + (duedateTime.getMonth() + 1) + "-" + duedateTime.getDate();

                    let poNumber = $('#ponumber').val();
                    let reference = $('#edtRef').val();

                    let departement = $('#shipvia').val();
                    let shippingAddress = $('#txaShipingInfo').val();
                    let comments = $('#txaComment').val();
                    let pickingInfrmation = $('#txapickmemo').val();

                    let saleCustField1 = $('#edtSaleCustField1').val();
                    let saleCustField2 = $('#edtSaleCustField2').val();

                    let orderStatus = $('#edtStatus').val();

                    var url = FlowRouter.current().path;
                    var getso_id = url.split('?id=');
                    var currentPurchaseOrder = getso_id[getso_id.length - 1];
                    let uploadedItems = tpobtnpayment.uploadedFiles.get();
                    var currencyCode = $("#sltCurrency").val() || CountryAbbr;
                    var objDetails = '';
                    if (getso_id[1]) {
                        currentPurchaseOrder = parseInt(currentPurchaseOrder);
                        if ($('input[name="chkCreatePOCredit"]').is(":checked")) {
                            objDetails = {
                                type: "TPurchaseOrderEx",
                                fields: {

                                    SupplierName: supplier,
                                    ForeignExchangeCode: currencyCode,
                                    SupplierInvoiceNumber: poNumber || ' ',
                                    Lines: splashLineArray,
                                    OrderTo: billingAddress,
                                    OrderDate: saleDate,

                                    SupplierInvoiceDate: saleDate,

                                    SaleLineRef: reference,
                                    TermsName: termname,
                                    Shipping: departement,
                                    ShipTo: shippingAddress,
                                    Comments: comments,
                                    SalesComments: pickingInfrmation,
                                    Attachments: uploadedItems,
                                    OrderStatus: $('#sltStatus').val()
                                }
                            };
                        } else {
                            objDetails = {
                                type: "TPurchaseOrderEx",
                                fields: {
                                    ID: currentPurchaseOrder,
                                    SupplierName: supplier,
                                    ForeignExchangeCode: currencyCode,
                                    SupplierInvoiceNumber: poNumber || ' ',
                                    Lines: splashLineArray,
                                    OrderTo: billingAddress,
                                    OrderDate: saleDate,

                                    SupplierInvoiceDate: saleDate,

                                    SaleLineRef: reference,
                                    TermsName: termname,
                                    Shipping: departement,
                                    ShipTo: shippingAddress,
                                    Comments: comments,
                                    SalesComments: pickingInfrmation,
                                    Attachments: uploadedItems,
                                    OrderStatus: $('#sltStatus').val()
                                }
                            };
                        }
                    } else {
                        objDetails = {
                            type: "TPurchaseOrderEx",
                            fields: {
                                SupplierName: supplier,
                                ForeignExchangeCode: currencyCode,
                                SupplierInvoiceNumber: poNumber || ' ',
                                Lines: splashLineArray,
                                OrderTo: billingAddress,
                                OrderDate: saleDate,

                                SupplierInvoiceDate: saleDate,

                                SaleLineRef: reference,
                                TermsName: termname,
                                Shipping: departement,
                                ShipTo: shippingAddress,
                                Comments: comments,


                                SalesComments: pickingInfrmation,
                                Attachments: uploadedItems,
                                OrderStatus: $('#sltStatus').val()
                            }
                        };
                    }

                    purchaseService.savePurchaseOrderEx(objDetails).then(function(objDetails) {
                        var supplierID = $('#edtSupplierEmail').attr('supplierid');
                        if (supplierID !== " ") {
                            let supplierEmailData = {
                                type: "TSupplier",
                                fields: {
                                    ID: supplierID,
                                    Email: supplierEmail
                                }
                            }



                        };
                        let linesave = objDetails.fields.ID;
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
                                    PrefName: 'purchaseordercard'
                                });
                                if (checkPrefDetails) {
                                    CloudPreference.update({
                                        _id: checkPrefDetails._id
                                    }, {
                                        $set: {
                                            username: clientUsername,
                                            useremail: clientEmail,
                                            PrefGroup: 'purchaseform',
                                            PrefName: 'purchaseordercard',
                                            published: true,
                                            customFields: [{
                                                index: '1',
                                                label: getcustomField1,
                                                hidden: getchkcustomField1
                                            }, {
                                                index: '2',
                                                label: getcustomField2,
                                                hidden: getchkcustomField2
                                            }],
                                            updatedAt: new Date()
                                        }
                                    }, function(err, idTag) {
                                        if (err) {
                                            window.open('/supplierpaymentcard?poid=' + linesave, '_self');
                                        } else {
                                            window.open('/supplierpaymentcard?poid=' + linesave, '_self');

                                        }
                                    });
                                } else {
                                    CloudPreference.insert({
                                        userid: clientID,
                                        username: clientUsername,
                                        useremail: clientEmail,
                                        PrefGroup: 'purchaseform',
                                        PrefName: 'purchaseordercard',
                                        published: true,
                                        customFields: [{
                                            index: '1',
                                            label: getcustomField1,
                                            hidden: getchkcustomField1
                                        }, {
                                            index: '2',
                                            label: getcustomField2,
                                            hidden: getchkcustomField2
                                        }],
                                        createdAt: new Date()
                                    }, function(err, idTag) {
                                        if (err) {
                                            window.open('/supplierpaymentcard?poid=' + linesave, '_self');
                                        } else {
                                            window.open('/supplierpaymentcard?poid=' + linesave, '_self');

                                        }
                                    });
                                }
                            }
                        } else {
                            window.open('/supplierpaymentcard?poid=' + linesave, '_self');
                        }

                    }).catch(function(err) {
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {

                            } else if (result.dismiss === 'cancel') {

                            }
                        });

                        $('.fullScreenSpin').css('display', 'none');
                    });
                }


            }
        });

    },
    'click #btnViewPayment': async function() {
        let templateObject = Template.instance();
        let purchaseService = new PurchaseBoardService();
          $('.fullScreenSpin').css('display', 'inline-block');
        let paymentID = "";
        var url = FlowRouter.current().path;
        var getso_id = url.split('?id=');
        var currentBill = getso_id[getso_id.length - 1];
        let paymentData = await purchaseService.getCheckPaymentLineByTransID(currentBill) || '';

        if(paymentData){
          for(let x = 0; x < paymentData.tsupplierpaymentline.length; x++) {
            if (paymentData.tsupplierpaymentline.length > 1) {
                paymentID = paymentData.tsupplierpaymentline[x].fields.Payment_ID;
                window.open('/supplierpaymentcard?id=' + paymentID, '_self');
            } else {
                paymentID = paymentData.tsupplierpaymentline[0].fields.Payment_ID;
                window.open('/supplierpaymentcard?id=' + paymentID, '_self');
           }
          }

        }else{
        $('.fullScreenSpin').css('display', 'none');
        }

    },
    'click .btnTransactionPaid': async function () {
      let templateObject = Template.instance();
      let purchaseService = new PurchaseBoardService();
      $('.fullScreenSpin').css('display', 'inline-block');
      let  selectedSupplierPaymentID = [];
      let paymentID = "";
      var url = FlowRouter.current().path;
      var getso_id = url.split('?id=');
      var currentBill = getso_id[getso_id.length - 1];
      let suppliername = $('#edtSupplierName').val() || '';
      let paymentData = await purchaseService.getCheckPaymentLineByTransID(currentBill) || '';
      if(paymentData){
      for(let x = 0; x < paymentData.tsupplierpaymentline.length; x++) {
              if (paymentData.tsupplierpaymentline.length > 1) {
                      paymentID = paymentData.tsupplierpaymentline[x].fields.Payment_ID;
                      selectedSupplierPaymentID.push(paymentID);
              } else {
                      paymentID = paymentData.tsupplierpaymentline[0].fields.Payment_ID;
                      window.open('/supplierpaymentcard?id=' + paymentID, '_self');
              }
      }

      setTimeout(function () {
        let selectPayID = selectedSupplierPaymentID;
        window.open('/supplierpayment?payment=' + selectPayID +'&name=' + suppliername, '_self');
      }, 500);
    }else{
      $('.fullScreenSpin').css('display', 'none');
    }
    },
    'click .chkEmailCopy': function(event) {
        $('#edtSupplierEmail').val($('#edtSupplierEmail').val().replace(/\s/g, ''));
        if ($(event.target).is(':checked')) {
            let checkEmailData = $('#edtSupplierEmail').val();
            if (checkEmailData.replace(/\s/g, '') === '') {
                swal('Supplier Email cannot be blank!', '', 'warning');
                event.preventDefault();
            } else {

                function isEmailValid(mailTo) {
                    return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(mailTo);
                };
                if (!isEmailValid(checkEmailData)) {
                    swal('The email field must be a valid email address !', '', 'warning');

                    event.preventDefault();
                    return false;
                } else {


                }
            }
        } else {

        }
    }

});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
