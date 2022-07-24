import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CoreService
} from '../js/core-service';
import {
    EmployeeProfileService
} from "../js/profile-service";
import {
    StockTransferService
} from "../inventory/stockadjust-service";
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
    ProductService
} from "../product/product-service";
import {
    PurchaseBoardService
} from '../js/purchase-service';
import '../lib/global/indexdbstorage.js';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';
import {
    Random
} from 'meteor/random';
import 'jquery-editable-select';
const _ = require('lodash');
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.stocktransfercard.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.includeInvoiceAttachment = new ReactiveVar();
    templateObject.includeInvoiceAttachment.set(false);
    templateObject.includeDocketAttachment = new ReactiveVar();
    templateObject.includeDocketAttachment.set(false);

    templateObject.includeIsPrintInvoice = new ReactiveVar();
    templateObject.includeIsPrintInvoice.set(false);
    templateObject.includeIsPrintDocket = new ReactiveVar();
    templateObject.includeIsPrintDocket.set(false);
    templateObject.includeBothPrint = new ReactiveVar();
    templateObject.hasPrintPrint = new ReactiveVar();
    templateObject.record = new ReactiveVar({});
    templateObject.stocktransferrecord = new ReactiveVar({});
    templateObject.shipviarecords = new ReactiveVar();

    templateObject.productquantityrecord = new ReactiveVar([]);
    templateObject.availserialrecord = new ReactiveVar([]);

    templateObject.availableserialnumberlist = new ReactiveVar([]);
    templateObject.availableserialnumberqty = new ReactiveVar();

    templateObject.isProccessed = new ReactiveVar();
    templateObject.isProccessed.set(false);
});

Template.stocktransfercard.onRendered(function() {
    var erpGet = erpDb();
    var url = window.location.href;
    var getsale_id = url.split('?id=');
    var salesID = FlowRouter.current().queryParams.id;
    let clientsService = new PurchaseBoardService();
    let stockTransferService = new StockTransferService();
    $('.fullScreenSpin').css('display', 'inline-block');
    const templateObject = Template.instance();
    let printDeliveryDocket = Session.get('CloudPrintDeliveryDocket');
    let printInvoice = Session.get('CloudPrintInvoice');
    const records = [];
    const viarecords = [];

    $("#date-input,#dtShipDate,#dtDueDate").datepicker({
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
    });

    setTimeout(function() {
        $('.fullScreenSpin').css('display', 'none');
    }, 3000);

    templateObject.getAllStocktransfer = function() {
        clientsService.getAllStockTransferEntry1().then(function(data) {
            let newTransferID = 1;
            let newDepartmentData = '';
            if (data.tstocktransferentry) {
                if (data.tstocktransferentry.length > 0) {
                    lastTransfer = data.tstocktransferentry[data.tstocktransferentry.length - 1]
                    newTransferID = parseInt(lastTransfer.Id) + 1;
                    newDepartmentData = lastTransfer.TransferFromClassName || '';
                } else {
                    newTransferID = 1;
                    newDepartmentData = '';
                }
            } else {
                newTransferID = 1;
                newDepartmentData = '';
            }
            $('#txtTransfer').val(newTransferID);
            if(newDepartmentData != ''){
            setTimeout(function() {
                $('#sltDepartment').val(newDepartmentData);
                setTimeout(function() {
                    getVS1Data('TDeptClass').then(function(dataObject) {
                        if (dataObject.length == 0) {

                            sideBarService.getDepartment().then(function(data) {
                                for (let i = 0; i < data.tdeptclass.length; i++) {
                                    if (data.tdeptclass[i].DeptClassName === newDepartmentData) {
                                        $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                    }
                                }

                            }).catch(function(err) {

                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tdeptclass;
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                if (data.tdeptclass[i].DeptClassName === newDepartmentData) {
                                    //$('#' +randomID+' .colDepartment').attr('linedeptid',data.tdeptclass[i].Id);
                                    $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                }
                            }

                        }
                    }).catch(function(err) {

                        sideBarService.getDepartment().then(function(data) {
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                if (data.tdeptclass[i].DeptClassName === newDepartmentData) {
                                    $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                }
                            }

                        }).catch(function(err) {

                        });
                    });
                }, 400);
            }, 200);

           }

            $('.shippingHeader').html('New Stock Transfer #' + newTransferID + '<a role="button" data-toggle="modal" href="#helpViewModal"  style="font-size: 20px; margin-left: 16px;">Help <i class="fa fa-question-circle-o" style="font-size: 20px; margin-left: 8px;"></i></a> ');

        });
    }

    templateObject.getAllAvailableSerialNumber = function() {
        stockTransferService.getSerialNumberList().then(function(dataSerialNumber) {
            templateObject.availserialrecord.set(dataSerialNumber);
        });
    }
    if (Session.get('CloudShowSerial')) {
        templateObject.getAllAvailableSerialNumber();
    }
    stockTransferService.getProductClassQuantitys().then(function(dataProductQty) {
        templateObject.productquantityrecord.set(dataProductQty);
    });
    templateObject.getProductQty = function(id, productname) {
        let totalAvailQty = 0;
        let totalInStockQty = 0;
        let deptName = $('#sltDepartment').val() || defaultDept;
        let dataValue = templateObject.productquantityrecord.get();
        let serialList = [];
        var splashLineArrayserialList = new Array();
        // templateObject.availableserialnumberlist.set([]);
        $('table tr').css('background', 'transparent');
        $('#serailscanlist').find('tbody').remove();
        $('input[name="salesLineRow"]').val(id);
        if (dataValue.tproductclassquantity) {
            for (let i = 0; i < dataValue.tproductclassquantity.length; i++) {
                let dataObj = {};

                let prodQtyName = dataValue.tproductclassquantity[i].ProductName;
                let deptQtyName = dataValue.tproductclassquantity[i].DepartmentName;
                if (productname == prodQtyName && deptQtyName == deptName) {
                    //if(productname == prodQtyName){
                    let availQty = dataValue.tproductclassquantity[i].AvailableQty;
                    let inStockQty = dataValue.tproductclassquantity[i].InStockQty;

                    totalAvailQty += parseFloat(availQty);
                    totalInStockQty += parseFloat(inStockQty);
                }
            }

            $('#' + id + " .colOrdered").val(totalAvailQty);

            //Serial Number functionality
            $('#' + id).css('background', 'rgba(0,163,211,0.1)');

            var $tblrow = $("#tblStocktransfer tbody tr");
            var prodPQALine = "";
            var dataListRet = "";

            var productName = $('#' + id + " .lineProductName").val() || '';
            prodPQALine = $('#' + id + " .lineID").text();
            $('input[name="prodID"]').val($('#' + id + " .ProductID").text());
            $('input[name="orderQty"]').val($('#' + id + " .colOrdered").val());
            var segsSerial = prodPQALine.split(',');
            let productID = $('#' + id + " .ProductID").text() || '';
            let countSerialBarcode = 0;
            if(segsSerial){
            for (let s = 0; s < segsSerial.length; s++) {
               countSerialBarcode++;
               let scannedCode = "PSN-" + productID + "-" + segsSerial[s];
               let htmlAppend = '<tr class="dnd-moved"><td class="form_id">' + countSerialBarcode + '</td><td>' + '' +
                   '</td><td>' + '</td>' +
                   '<td>' + '<input type="text" style="text-align: left !important;" name="serialNoBOM" id="serialNoBOM" class="highlightInput " value="' + scannedCode + '" readonly>' + '</td><td class="hiddenColumn"><input type="text" style="text-align: left !important;" name="serialNo" id="serialNo" class="highlightInput " value="' + segsSerial[s] + '" readonly></td><td style="width: 1%;"><span class=" removesecondtablebutton"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 "><i class="fa fa-remove"></i></button></span></td>' +
                   '</tr>';
               if (segsSerial[s] != '') {
                   $("#serailscanlist").append(htmlAppend);
               }

           };
         }


            // $('input[name="deptID"]').val($tblrow.find(".linedeptid").text());
            let countSerial = 0;
            setTimeout(function() {
                let dataAvailableValue = templateObject.availserialrecord.get();
                if (dataAvailableValue) {
                    serialList = [];
                    for (let s = 0; s < dataAvailableValue.tserialnumberlistcurrentreport.length; s++) {

                        if (dataAvailableValue.tserialnumberlistcurrentreport[s].SerialNumber.replace(/\s/g, '') != '') {
                            if ((productName == dataAvailableValue.tserialnumberlistcurrentreport[s].ProductName) &&
                                (deptName == dataAvailableValue.tserialnumberlistcurrentreport[s].DepartmentName) &&
                                (dataAvailableValue.tserialnumberlistcurrentreport[s].AllocType == "In-Stock")) {
                                let addshowclass = "";
                                countSerial++;
                                if (countSerial > 4) {
                                    addshowclass = "hiddenColumn";
                                }
                                templateObject.availableserialnumberqty.set(countSerial);
                                let serialFormat = dataAvailableValue.tserialnumberlistcurrentreport[s].BOMSerialNumber.toLowerCase();
                                let dataObject = {
                                    rowid: countSerial,
                                    partid: dataAvailableValue.tserialnumberlistcurrentreport[s].PartsID || ' ',
                                    serialnumber: dataAvailableValue.tserialnumberlistcurrentreport[s].SerialNumber || ' ',
                                    domserialnumber: dataAvailableValue.tserialnumberlistcurrentreport[s].BOMSerialNumber || ' ',
                                    domserialnumberFormat: serialFormat.replace(/\s/g, '') || '',
                                    checkclass: addshowclass
                                };
                                serialList.push(dataObject);
                            }

                        }
                    }
                    templateObject.availableserialnumberlist.set(serialList);
                } else {
                    templateObject.availableserialnumberlist.set([]);
                }
            }, 400);
            setTimeout(function() {
                $("#allocBarcode").focus();

            }, 200);


        } else {
            stockTransferService.getProductClassQuantitysByDept(productname, deptName).then(function(data) {
                for (let i = 0; i < data.tproductclassquantity.length; i++) {
                    let dataObj = {};

                    let prodQtyName = data.tproductclassquantity[i].ProductName;
                    let deptQtyName = data.tproductclassquantity[i].DepartmentName;
                    if (productname == prodQtyName && deptQtyName == deptName) {
                        //if(productname == prodQtyName){
                        let availQty = data.tproductclassquantity[i].AvailableQty;
                        let inStockQty = data.tproductclassquantity[i].InStockQty;

                        totalAvailQty += parseFloat(availQty);
                        totalInStockQty += parseFloat(inStockQty);
                    }
                }

                $('#' + id + " .colOrdered").val(totalAvailQty);

                //Serial Number functionality
                $('#' + id).css('background', 'rgba(0,163,211,0.1)');
                var $tblrow = $("#tblStocktransfer tbody tr");
                var prodPQALine = "";
                var dataListRet = "";

                var productName = $('#' + id + " .lineProductName").val() || '';
                let productID = $('#' + id + " .ProductID").text() || '';
                prodPQALine = $('#' + id + " .lineID").text();
                $('input[name="prodID"]').val($('#' + id + " .ProductID").text());
                $('input[name="orderQty"]').val($('#' + id + " .colOrdered").val());
                // $('input[name="deptID"]').val($tblrow.find(".linedeptid").text());
                var segsSerial = prodPQALine.split(',');
                let countSerialBarcode = 0;
                if(segsSerial){
                for (let s = 0; s < segsSerial.length; s++) {
                   countSerialBarcode++;
                   let scannedCode = "PSN-" + productID + "-" + segsSerial[s];
                   let htmlAppend = '<tr class="dnd-moved"><td class="form_id">' + countSerialBarcode + '</td><td>' + '' +
                       '</td><td>' + '</td>' +
                       '<td>' + '<input type="text" style="text-align: left !important;" name="serialNoBOM" id="serialNoBOM" class="highlightInput " value="' + scannedCode + '" readonly>' + '</td><td class="hiddenColumn"><input type="text" style="text-align: left !important;" name="serialNo" id="serialNo" class="highlightInput " value="' + segsSerial[s] + '" readonly></td><td style="width: 1%;"><span class=" removesecondtablebutton"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 "><i class="fa fa-remove"></i></button></span></td>' +
                       '</tr>';
                   if (segsSerial[s] != '') {
                       $("#serailscanlist").append(htmlAppend);
                   }

               };
             }

                let countSerial = 0;
                setTimeout(function() {
                    let dataAvailableValue = templateObject.availserialrecord.get();
                    if (dataAvailableValue) {
                        serialList = [];
                        for (let s = 0; s < dataAvailableValue.tserialnumberlistcurrentreport.length; s++) {

                            if (dataAvailableValue.tserialnumberlistcurrentreport[s].SerialNumber.replace(/\s/g, '') != '') {
                                if ((productName == dataAvailableValue.tserialnumberlistcurrentreport[s].ProductName) &&
                                    (deptName == dataAvailableValue.tserialnumberlistcurrentreport[s].DepartmentName) &&
                                    (dataAvailableValue.tserialnumberlistcurrentreport[s].AllocType == "In-Stock")) {
                                    let addshowclass = "";
                                    countSerial++;
                                    if (countSerial > 4) {
                                        addshowclass = "hiddenColumn";
                                    }
                                    templateObject.availableserialnumberqty.set(countSerial);
                                    let serialFormat = dataAvailableValue.tserialnumberlistcurrentreport[s].BOMSerialNumber.toLowerCase();
                                    let dataObject = {
                                        rowid: countSerial,
                                        partid: dataAvailableValue.tserialnumberlistcurrentreport[s].PartsID || ' ',
                                        serialnumber: dataAvailableValue.tserialnumberlistcurrentreport[s].SerialNumber || ' ',
                                        domserialnumber: dataAvailableValue.tserialnumberlistcurrentreport[s].BOMSerialNumber || ' ',
                                        domserialnumberFormat: serialFormat.replace(/\s/g, '') || '',
                                        checkclass: addshowclass
                                    };
                                    serialList.push(dataObject);
                                }

                            }
                        }
                        templateObject.availableserialnumberlist.set(serialList);
                    } else {
                        templateObject.availableserialnumberlist.set([]);
                    }
                }, 400);

                setTimeout(function() {
                    $("#allocBarcode").focus();
                }, 200);

            });
        }


    };

    var url = FlowRouter.current().path;
    if (url.indexOf('?id=') > 0) {
        var getso_id = url.split('?id=');
        var currentStockTransfer = getso_id[getso_id.length - 1];
        if (getso_id[1]) {
            currentStockTransfer = parseInt(currentStockTransfer);

            templateObject.getStockTransferData = function() {
                //getOneQuotedata

                getVS1Data('TStockTransferEntry').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        stockTransferService.getOneStockTransferData(currentStockTransfer).then(function(data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let lineItemObj = {};
                            let lineItemsTable = [];
                            let lineItemTableObj = {};
                            let initialTransferData = 0;
                          if(data.fields.Lines != null){
                            if (data.fields.Lines.length) {
                                for (let i = 0; i < data.fields.Lines.length; i++) {
                                  if(data.fields.Lines[i].fields.TransferSerialnos){

                                  }else{
                                    initialTransferData = data.fields.Lines[i].fields.TransferQty || 0;
                                  }

                                    lineItemObj = {
                                        lineID: Random.id(),
                                        id: data.fields.Lines[i].fields.ID || '',
                                        pqa: data.fields.Lines[i].fields.TransferSerialnos || '',
                                        serialnumber: data.fields.Lines[i].fields.TransferSerialnos || '',
                                        productname: data.fields.Lines[i].fields.ProductName || '',
                                        item: data.fields.Lines[i].fields.ProductName || '',
                                        productid: data.fields.Lines[i].fields.ProductID || '',
                                        productbarcode: data.fields.Lines[i].fields.PartBarcode || '',
                                        description: data.fields.Lines[i].fields.ProductDesc || '',
                                        department: data.fields.Lines[0].fields.ClassNameTo || defaultDept,
                                        qtyordered: data.fields.Lines[i].fields.AvailableQty || 0,
                                        qtyshipped: data.fields.Lines[i].fields.TransferQty || 0,
                                        initaltransfer: initialTransferData || 0,
                                        qtybo: data.fields.Lines[i].fields.BOQty || 0

                                    };

                                    lineItems.push(lineItemObj);
                                }
                            }
                          }
                            let record = {
                                id: data.fields.ID,
                                lid: 'Edit Stock Transfer' + ' ' + data.fields.ID,
                                LineItems: lineItems,
                                accountname: data.fields.AccountName,
                                department: data.fields.TransferFromClassName || defaultDept,
                                notes: data.fields.Notes,
                                descriptions: data.fields.Description,
                                transdate: data.fields.DateTransferred ? moment(data.fields.DateTransferred).format('DD/MM/YYYY') : ""
                            };

                            let getDepartmentVal = data.fields.Lines[0].fields.TransferFromClassName || defaultDept;

                            setTimeout(function() {
                                $('#sltDepartment').val(record.department);
                                $('#edtCustomerName').val(data.fields.Lines[0].fields.CustomerName);
                                $('#sltBankAccountName').val(data.fields.AccountName);
                                $('#shipvia').val(data.fields.Shipping);
                                // $('#tblStocktransfer .lineOrdered').trigger("click");
                                $('#tblStocktransfer tr:first-child .lineOrdered').trigger("click");
                                setTimeout(function() {
                                    getVS1Data('TDeptClass').then(function(dataObject) {
                                        if (dataObject.length == 0) {

                                            sideBarService.getDepartment().then(function(data) {
                                                for (let i = 0; i < data.tdeptclass.length; i++) {
                                                    if (data.tdeptclass[i].DeptClassName === record.department) {
                                                        $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                                    }
                                                }

                                            }).catch(function(err) {

                                            });
                                        } else {
                                            let data = JSON.parse(dataObject[0].data);
                                            let useData = data.tdeptclass;
                                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                                if (data.tdeptclass[i].DeptClassName === record.department) {
                                                    //$('#' +randomID+' .colDepartment').attr('linedeptid',data.tdeptclass[i].Id);
                                                    $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                                }
                                            }

                                        }
                                    }).catch(function(err) {

                                        sideBarService.getDepartment().then(function(data) {
                                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                                if (data.tdeptclass[i].DeptClassName === record.department) {
                                                    $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                                }
                                            }

                                        }).catch(function(err) {

                                        });
                                    });
                                }, 400);
                            }, 200);

                            if (data.fields.Processed == true) {
                                templateObject.isProccessed.set(true);
                                $('.colProcessed').css('display', 'block');
                                $("#form :input").prop("disabled", true);
                                $(".btnDeleteStock").prop("disabled", false);
                                $(".btnDeleteStockTransfer").prop("disabled", false);
                                $(".printConfirm").prop("disabled", false);
                                $(".btnBack").prop("disabled", false);
                                $(".btnDeleteProduct").prop("disabled", false);
                            }

                            templateObject.stocktransferrecord.set(record);

                            if (templateObject.stocktransferrecord.get()) {


                                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblStocktransfer', function(error, result) {
                                    if (error) {

                                        //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
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

                                                    //$("."+columnClass+"").css('display','none');
                                                    $("." + columnClass + "").addClass('hiddenColumn');
                                                    $("." + columnClass + "").removeClass('showColumn');
                                                } else if (hiddenColumn == false) {
                                                    $("." + columnClass + "").removeClass('hiddenColumn');
                                                    $("." + columnClass + "").addClass('showColumn');
                                                    //$("."+columnClass+"").css('display','table-cell');
                                                    //$("."+columnClass+"").css('padding','.75rem');
                                                    //$("."+columnClass+"").css('vertical-align','top');
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
                                if (result.value) {
                                    Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                            $('.fullScreenSpin').css('display', 'none');
                            // Meteor._reload.reload();
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tstocktransferentry;
                        var added = false;
                        for (let d = 0; d < useData.length; d++) {
                            if (parseInt(useData[d].fields.ID) === currentStockTransfer) {
                                added = true;
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                let lineItemObj = {};
                                let lineItemsTable = [];
                                let lineItemTableObj = {};
                                let initialTransferData = 0;
                                if (useData[d].fields.Lines.length) {
                                    for (let i = 0; i < useData[d].fields.Lines.length; i++) {
                                      if(useData[d].fields.Lines[i].fields.TransferSerialnos){

                                      }else{
                                        initialTransferData = useData[d].fields.Lines[i].fields.TransferQty || 0;
                                      }

                                        lineItemObj = {
                                            lineID: Random.id(),
                                            id: useData[d].fields.Lines[i].fields.ID || '',
                                            pqa: useData[d].fields.Lines[i].fields.TransferSerialnos || '',
                                            serialnumber: useData[d].fields.Lines[i].fields.TransferSerialnos || '',
                                            productname: useData[d].fields.Lines[i].fields.ProductName || '',
                                            item: useData[d].fields.Lines[i].fields.ProductName || '',
                                            productid: useData[d].fields.Lines[i].fields.ProductID || '',
                                            productbarcode: useData[d].fields.Lines[i].fields.PartBarcode || '',
                                            description: useData[d].fields.Lines[i].fields.ProductDesc || '',
                                            department: useData[d].fields.Lines[0].fields.ClassNameTo || defaultDept,
                                            qtyordered: useData[d].fields.Lines[i].fields.AvailableQty || 0,
                                            qtyshipped: useData[d].fields.Lines[i].fields.TransferQty || 0,
                                            initaltransfer: initialTransferData || 0,
                                            qtybo: useData[d].fields.Lines[i].fields.BOQty || 0

                                        };

                                        lineItems.push(lineItemObj);
                                    }
                                } else {
                                  if(useData[d].fields.Lines.fields.TransferSerialnos){

                                  }else{
                                    initialTransferData = useData[d].fields.Lines.fields.TransferQty || 0;
                                  }

                                    lineItemObj = {
                                        lineID: Random.id(),
                                        id: useData[d].fields.Lines.fields.ID || '',
                                        pqa: useData[d].fields.Lines.fields.TransferSerialnos || '',
                                        serialnumber: useData[d].fields.Lines.fields.TransferSerialnos || '',
                                        productname: useData[d].fields.Lines.fields.ProductName || '',
                                        item: useData[d].fields.Lines.fields.ProductName || '',
                                        productid: useData[d].fields.Lines.fields.ProductID || '',
                                        productbarcode: useData[d].fields.Lines.fields.PartBarcode || '',
                                        description: useData[d].fields.Lines.fields.ProductDesc || '',
                                        department: useData[d].fields.Lines.fields.ClassNameTo || defaultDept,
                                        qtyordered: useData[d].fields.Lines.fields.AvailableQty || 0,
                                        qtyshipped: useData[d].fields.Lines.fields.TransferQty || 0,
                                        initaltransfer: initialTransferData || 0,
                                        qtybo: useData[d].fields.Lines.fields.BOQty || 0

                                    };
                                    lineItems.push(lineItemObj);
                                }

                                let record = {
                                    id: useData[d].fields.ID,
                                    lid: 'Edit Stock Transfer' + ' ' + useData[d].fields.ID,
                                    LineItems: lineItems,
                                    accountname: useData[d].fields.AccountName,
                                    department: useData[d].fields.TransferFromClassName || defaultDept,
                                    notes: useData[d].fields.Notes,
                                    descriptions: useData[d].fields.Description,
                                    transdate: useData[d].fields.DateTransferred ? moment(useData[d].fields.DateTransferred).format('DD/MM/YYYY') : ""
                                };

                                let getDepartmentVal = useData[d].fields.Lines[0].fields.TransferFromClassName || defaultDept;
                                $('.shippingHeader').html('Edit Stock Transfer #' + useData[d].fields.ID + ' <a role="button" data-toggle="modal" href="#helpViewModal"  style="font-size: 20px;"> Help<i class="fa fa-question-circle-o" style="font-size: 20px; margin-left: 5px;"></i></a> ');
                                setTimeout(function() {
                                    $('#sltDepartment').val(record.department);
                                    $('#edtCustomerName').val(useData[d].fields.Lines[0].fields.CustomerName);
                                    $('#sltBankAccountName').val(useData[d].fields.AccountName);
                                    $('#shipvia').val(useData[d].fields.Shipping);
                                    // $('#tblStocktransfer .lineOrdered').trigger("click");
                                    $('#tblStocktransfer tr:first-child .lineOrdered').trigger("click");

                                    setTimeout(function() {
                                        getVS1Data('TDeptClass').then(function(dataObject) {
                                            if (dataObject.length == 0) {

                                                sideBarService.getDepartment().then(function(data) {
                                                    for (let i = 0; i < data.tdeptclass.length; i++) {
                                                        if (data.tdeptclass[i].DeptClassName === record.department) {
                                                            $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                                        }
                                                    }

                                                }).catch(function(err) {

                                                });
                                            } else {
                                                let data = JSON.parse(dataObject[0].data);
                                                let useData = data.tdeptclass;
                                                for (let i = 0; i < data.tdeptclass.length; i++) {
                                                    if (data.tdeptclass[i].DeptClassName === record.department) {
                                                        //$('#' +randomID+' .colDepartment').attr('linedeptid',data.tdeptclass[i].Id);
                                                        $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                                    }
                                                }

                                            }
                                        }).catch(function(err) {

                                            sideBarService.getDepartment().then(function(data) {
                                                for (let i = 0; i < data.tdeptclass.length; i++) {
                                                    if (data.tdeptclass[i].DeptClassName === record.department) {
                                                        $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                                    }
                                                }

                                            }).catch(function(err) {

                                            });
                                        });
                                    }, 400);

                                }, 200);



                                //
                                // $("#form :input").prop("disabled", true);
                                // $(".btnDeleteStock").prop("disabled", false);
                                // $(".btnDeleteStockAdjust").prop("disabled", false);
                                // $(".printConfirm").prop("disabled", false);
                                // $(".btnBack").prop("disabled", false);

                                if (useData[d].fields.Processed == true) {
                                    templateObject.isProccessed.set(true);
                                    $('.colProcessed').css('display', 'block');
                                    $("#form :input").prop("disabled", true);
                                    $(".btnDeleteStock").prop("disabled", false);
                                    $(".btnDeleteStockTransfer").prop("disabled", false);
                                    $(".printConfirm").prop("disabled", false);
                                    $(".btnBack").prop("disabled", false);
                                    $(".btnDeleteProduct").prop("disabled", false);
                                }

                                templateObject.stocktransferrecord.set(record);
                                $(".btnDeleteLine").prop("disabled", false);
                                $(".btnDeleteProduct").prop("disabled", false);
                                $(".close").prop("disabled", false);
                                if (templateObject.stocktransferrecord.get()) {
                                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblStocktransfer', function(error, result) {
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

                                                        //$("."+columnClass+"").css('display','none');
                                                        $("." + columnClass + "").addClass('hiddenColumn');
                                                        $("." + columnClass + "").removeClass('showColumn');
                                                    } else if (hiddenColumn == false) {
                                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                                        $("." + columnClass + "").addClass('showColumn');
                                                        //$("."+columnClass+"").css('display','table-cell');
                                                        //$("."+columnClass+"").css('padding','.75rem');
                                                        //$("."+columnClass+"").css('vertical-align','top');
                                                    }

                                                }
                                            }

                                        }
                                    });
                                }
                                setTimeout(function() {
                                    $(".btnRemove").prop("disabled", true);
                                }, 1000);

                            }

                        }
                        if (!added) {
                            stockTransferService.getOneStockTransferData(currentStockTransfer).then(function(data) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                let lineItemObj = {};
                                let lineItemsTable = [];
                                let lineItemTableObj = {};
                                let initialTransferData = 0;
                              if(data.fields.Lines != null){
                                if (data.fields.Lines.length) {
                                    for (let i = 0; i < data.fields.Lines.length; i++) {
                                      if(data.fields.Lines[i].fields.TransferSerialnos){

                                      }else{
                                        initialTransferData = data.fields.Lines[i].fields.TransferQty || 0;
                                      }
                                        lineItemObj = {
                                            lineID: Random.id(),
                                            id: data.fields.Lines[i].fields.ID || '',
                                            pqa: data.fields.Lines[i].fields.TransferSerialnos || '',
                                            serialnumber: data.fields.Lines[i].fields.TransferSerialnos || '',
                                            productname: data.fields.Lines[i].fields.ProductName || '',
                                            item: data.fields.Lines[i].fields.ProductName || '',
                                            productid: data.fields.Lines[i].fields.ProductID || '',
                                            productbarcode: data.fields.Lines[i].fields.PartBarcode || '',
                                            description: data.fields.Lines[i].fields.ProductDesc || '',
                                            department: data.fields.Lines[0].fields.ClassNameTo || defaultDept,
                                            qtyordered: data.fields.Lines[i].fields.AvailableQty || 0,
                                            qtyshipped: data.fields.Lines[i].fields.TransferQty || 0,
                                            initaltransfer: initialTransferData || 0,
                                            qtybo: data.fields.Lines[i].fields.BOQty || 0

                                        };

                                        lineItems.push(lineItemObj);
                                    }
                                }
                              }
                                let record = {
                                    id: data.fields.ID,
                                    lid: 'Edit Stock Transfer' + ' ' + data.fields.ID,
                                    LineItems: lineItems,
                                    accountname: data.fields.AccountName,
                                    department: data.fields.TransferFromClassName || defaultDept,
                                    notes: data.fields.Notes,
                                    descriptions: data.fields.Description,
                                    transdate: data.fields.DateTransferred ? moment(data.fields.DateTransferred).format('DD/MM/YYYY') : ""
                                };

                                let getDepartmentVal = data.fields.Lines[0].fields.TransferFromClassName || defaultDept;

                                setTimeout(function() {
                                    $('#sltDepartment').val(record.department);
                                    $('#edtCustomerName').val(data.fields.Lines[0].fields.CustomerName);
                                    $('#sltBankAccountName').val(data.fields.AccountName);
                                    $('#shipvia').val(data.fields.Shipping);
                                    // $('#tblStocktransfer .lineOrdered').trigger("click");
                                    $('#tblStocktransfer tr:first-child .lineOrdered').trigger("click");

                                    setTimeout(function() {
                                        getVS1Data('TDeptClass').then(function(dataObject) {
                                            if (dataObject.length == 0) {

                                                sideBarService.getDepartment().then(function(data) {
                                                    for (let i = 0; i < data.tdeptclass.length; i++) {
                                                        if (data.tdeptclass[i].DeptClassName === record.department) {
                                                            $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                                        }
                                                    }

                                                }).catch(function(err) {

                                                });
                                            } else {
                                                let data = JSON.parse(dataObject[0].data);
                                                let useData = data.tdeptclass;
                                                for (let i = 0; i < data.tdeptclass.length; i++) {
                                                    if (data.tdeptclass[i].DeptClassName === record.department) {
                                                        //$('#' +randomID+' .colDepartment').attr('linedeptid',data.tdeptclass[i].Id);
                                                        $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                                    }
                                                }

                                            }
                                        }).catch(function(err) {

                                            sideBarService.getDepartment().then(function(data) {
                                                for (let i = 0; i < data.tdeptclass.length; i++) {
                                                    if (data.tdeptclass[i].DeptClassName === record.department) {
                                                        $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                                    }
                                                }

                                            }).catch(function(err) {

                                            });
                                        });
                                    }, 400);

                                }, 200);

                                if (data.fields.Processed == true) {
                                    templateObject.isProccessed.set(true);
                                    $('.colProcessed').css('display', 'block');
                                    $("#form :input").prop("disabled", true);
                                    $(".btnDeleteStock").prop("disabled", false);
                                    $(".btnDeleteStockTransfer").prop("disabled", false);
                                    $(".printConfirm").prop("disabled", false);
                                    $(".btnBack").prop("disabled", false);
                                    $(".btnDeleteProduct").prop("disabled", false);
                                }

                                templateObject.stocktransferrecord.set(record);

                                if (templateObject.stocktransferrecord.get()) {


                                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblStocktransfer', function(error, result) {
                                        if (error) {

                                            //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
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

                                                        //$("."+columnClass+"").css('display','none');
                                                        $("." + columnClass + "").addClass('hiddenColumn');
                                                        $("." + columnClass + "").removeClass('showColumn');
                                                    } else if (hiddenColumn == false) {
                                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                                        $("." + columnClass + "").addClass('showColumn');
                                                        //$("."+columnClass+"").css('display','table-cell');
                                                        //$("."+columnClass+"").css('padding','.75rem');
                                                        //$("."+columnClass+"").css('vertical-align','top');
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
                                    if (result.value) {
                                        Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {}
                                });
                                $('.fullScreenSpin').css('display', 'none');
                                // Meteor._reload.reload();
                            });
                        }
                        //here
                    }
                }).catch(function(err) {

                    stockTransferService.getOneStockTransferData(currentStockTransfer).then(function(data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];
                        let lineItemObj = {};
                        let lineItemsTable = [];
                        let lineItemTableObj = {};
                        let initialTransferData = 0;
                      if(data.fields.Lines != null){
                        if (data.fields.Lines.length) {
                            for (let i = 0; i < data.fields.Lines.length; i++) {
                              if(data.fields.Lines[i].fields.TransferSerialnos){

                              }else{
                                initialTransferData = data.fields.Lines[i].fields.TransferQty || 0;
                              }

                                lineItemObj = {
                                    lineID: Random.id(),
                                    id: data.fields.Lines[i].fields.ID || '',
                                    pqa: data.fields.Lines[i].fields.TransferSerialnos || '',
                                    serialnumber: data.fields.Lines[i].fields.TransferSerialnos || '',
                                    productname: data.fields.Lines[i].fields.ProductName || '',
                                    item: data.fields.Lines[i].fields.ProductName || '',
                                    productid: data.fields.Lines[i].fields.ProductID || '',
                                    productbarcode: data.fields.Lines[i].fields.PartBarcode || '',
                                    description: data.fields.Lines[i].fields.ProductDesc || '',
                                    department: data.fields.Lines[0].fields.ClassNameTo || defaultDept,
                                    qtyordered: data.fields.Lines[i].fields.AvailableQty || 0,
                                    qtyshipped: data.fields.Lines[i].fields.TransferQty || 0,
                                    initaltransfer: initialTransferData || 0,
                                    qtybo: data.fields.Lines[i].fields.BOQty || 0

                                };

                                lineItems.push(lineItemObj);
                            }
                        }
                      }
                        let record = {
                            id: data.fields.ID,
                            lid: 'Edit Stock Transfer' + ' ' + data.fields.ID,
                            LineItems: lineItems,
                            accountname: data.fields.AccountName,
                            department: data.fields.TransferFromClassName || defaultDept,
                            notes: data.fields.Notes,
                            descriptions: data.fields.Description,
                            transdate: data.fields.DateTransferred ? moment(data.fields.DateTransferred).format('DD/MM/YYYY') : ""
                        };

                        let getDepartmentVal = data.fields.Lines[0].fields.TransferFromClassName || defaultDept;

                        setTimeout(function() {
                            $('#sltDepartment').val(record.department);
                            $('#edtCustomerName').val(data.fields.Lines[0].fields.CustomerName);
                            $('#sltBankAccountName').val(data.fields.AccountName);
                            $('#shipvia').val(data.fields.Shipping);

                            setTimeout(function() {
                                getVS1Data('TDeptClass').then(function(dataObject) {
                                    if (dataObject.length == 0) {

                                        sideBarService.getDepartment().then(function(data) {
                                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                                if (data.tdeptclass[i].DeptClassName === record.department) {
                                                    $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                                }
                                            }

                                        }).catch(function(err) {

                                        });
                                    } else {
                                        let data = JSON.parse(dataObject[0].data);
                                        let useData = data.tdeptclass;
                                        for (let i = 0; i < data.tdeptclass.length; i++) {
                                            if (data.tdeptclass[i].DeptClassName === record.department) {
                                                //$('#' +randomID+' .colDepartment').attr('linedeptid',data.tdeptclass[i].Id);
                                                $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                            }
                                        }

                                    }
                                }).catch(function(err) {

                                    sideBarService.getDepartment().then(function(data) {
                                        for (let i = 0; i < data.tdeptclass.length; i++) {
                                            if (data.tdeptclass[i].DeptClassName === record.department) {
                                                $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                            }
                                        }

                                    }).catch(function(err) {

                                    });
                                });
                            }, 400);

                        }, 200);

                        if (data.fields.Processed == true) {
                            templateObject.isProccessed.set(true);
                            $('.colProcessed').css('display', 'block');
                            $("#form :input").prop("disabled", true);
                            $(".btnDeleteStock").prop("disabled", false);
                            $(".btnDeleteStockTransfer").prop("disabled", false);
                            $(".printConfirm").prop("disabled", false);
                            $(".btnBack").prop("disabled", false);
                            $(".btnDeleteProduct").prop("disabled", false);
                        }

                        templateObject.stocktransferrecord.set(record);

                        if (templateObject.stocktransferrecord.get()) {


                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblStocktransfer', function(error, result) {
                                if (error) {

                                    //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
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

                                                //$("."+columnClass+"").css('display','none');
                                                $("." + columnClass + "").addClass('hiddenColumn');
                                                $("." + columnClass + "").removeClass('showColumn');
                                            } else if (hiddenColumn == false) {
                                                $("." + columnClass + "").removeClass('hiddenColumn');
                                                $("." + columnClass + "").addClass('showColumn');
                                                //$("."+columnClass+"").css('display','table-cell');
                                                //$("."+columnClass+"").css('padding','.75rem');
                                                //$("."+columnClass+"").css('vertical-align','top');
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
                            if (result.value) {
                                Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        $('.fullScreenSpin').css('display', 'none');
                        // Meteor._reload.reload();
                    });
                });

            };

            templateObject.getStockTransferData();
            $('.fullScreenSpin').css('display', 'none');
        }
        setTimeout(function() {
            $('#edtCustomerEmail').val(localStorage.getItem('mySession'));
        }, 200);
    } else {
        $('.fullScreenSpin').css('display', 'none');

        templateObject.getAllStocktransfer();
        let lineItems = [];
        let lineItemsTable = [];
        let lineItemObj = {};
        let randomID = Random.id();
        //for (let i = 0; i < 2; i++) {
        lineItemObj = {
            lineID: randomID,
            item: '',
            accountname: '',
            accountno: '',
            memo: '',
            department: defaultDept,
            creditex: '',
            debitex: '',
            taxCode: ''
        };
        lineItems.push(lineItemObj);
        //}
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        let record = {
            id: '',
            lid: 'New Stock Transfer',
            accountname: '',
            memo: '',
            department: defaultDept,
            entryno: '',
            transdate: begunDate,
            LineItems: lineItems,
            isReconciled: false

        };
        setTimeout(function() {
            $('#sltDepartment').val(defaultDept);
            $('#sltBankAccountName').val('Stock Adjustment');
            $('#edtCustomerEmail').val(localStorage.getItem('mySession'));
            setTimeout(function() {
                getVS1Data('TDeptClass').then(function(dataObject) {
                    if (dataObject.length == 0) {

                        sideBarService.getDepartment().then(function(data) {
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                if (data.tdeptclass[i].DeptClassName === defaultDept) {
                                    $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                                }
                            }

                        }).catch(function(err) {

                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tdeptclass;
                        for (let i = 0; i < data.tdeptclass.length; i++) {
                            if (data.tdeptclass[i].DeptClassName === defaultDept) {
                                //$('#' +randomID+' .colDepartment').attr('linedeptid',data.tdeptclass[i].Id);
                                $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                            }
                        }

                    }
                }).catch(function(err) {

                    sideBarService.getDepartment().then(function(data) {
                        for (let i = 0; i < data.tdeptclass.length; i++) {
                            if (data.tdeptclass[i].DeptClassName === defaultDept) {
                                $('input[name="deptID"]').val(data.tdeptclass[i].Id);
                            }
                        }

                    }).catch(function(err) {

                    });
                });
            }, 400);
        }, 200);
        templateObject.stocktransferrecord.set(record);

    }

    if (FlowRouter.current().queryParams.id) {

        // setTimeout(function() {
        //     $('#tblStocktransfer tr:first-child .lineOrdered').trigger("click");
        // }, 400);
    } else {
        setTimeout(function() {
            $('#tblStocktransfer .lineProductName').trigger("click");
        }, 200);
    }

    templateObject.getShpVias = function() {
        getVS1Data('TShippingMethod').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getShippingMethodData().then(function(data) {
                    addVS1Data('TShippingMethod', JSON.stringify(data));
                    for (let i in data.tshippingmethod) {

                        let viarecordObj = {
                            shippingmethod: data.tshippingmethod[i].ShippingMethod || ' ',
                        };

                        viarecords.push(viarecordObj);
                        templateObject.shipviarecords.set(viarecords);

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

                    templateObject.shipviarecords.set(viarecords);

                }

            }
        }).catch(function(err) {

            sideBarService.getShippingMethodData().then(function(data) {
                addVS1Data('TShippingMethod', JSON.stringify(data));

                for (let i in data.tshippingmethod) {

                    let viarecordObj = {
                        shippingmethod: data.tshippingmethod[i].ShippingMethod || ' ',
                    };

                    viarecords.push(viarecordObj);
                    templateObject.shipviarecords.set(viarecords);

                }
            });
        });

    }
    templateObject.getShpVias();

    StockTransferRow();
    $("#btnsaveallocline").click(function() {
        $('#tblStocktransfer tr:eq(' + rowIndex + ')').find("[id=pqa]").text("");
        var splashLineArrayAlloc = new Array();
        let lineItemObjFormAlloc = {};

        $('#serailscanlist > tbody > tr').each(function() {
            var $tblrowAlloc = $(this);
            let tdSerialNumber = $tblrowAlloc.find("#serialNo").val() || 0;

            splashLineArrayAlloc.push(tdSerialNumber);
        });

        var departmentID = $('input[name="deptID"]').val() || 0;
        var pqaID = $('input[name="pqaID"]').val();
        var AllocLineObjDetails = splashLineArrayAlloc.join(',');
        // {
        //     type: "TPQA",
        //     fields: {
        //         DepartmentID: parseInt(departmentID),
        //         PQABatch: null,
        //         PQABins: null,
        //         ID: parseInt(pqaID),
        //         PQASN: splashLineArrayAlloc
        //     }
        // };
        var rowIndex = $('input[name="salesLineRow"]').val();
        let initialTransfer = $('#' + rowIndex + " #InitTransfer").text()||0;
        var qtyShipped = $('#serailscanlist tbody tr').length;
        // if(initialTransfer != 0){
        //   qtyShipped = qtyShipped + parseInt(initialTransfer);
        // }

        var qtyOrder = parseInt($('#' + rowIndex + " #Ordered").val());
        // parseInt($('#tblStocktransfer tr:eq(' + rowIndex + ')').find("[id=Ordered]").val());
        var qtyBackOrder = qtyOrder - qtyShipped;

        $('#' + rowIndex + " #pqa").text(AllocLineObjDetails);
        $('#' + rowIndex + " #lineID").text(AllocLineObjDetails);
        // $('#' + rowIndex + " #UOMQtyShipped").val(qtyShipped);
        $('#' + rowIndex + " #UOMQtyBackOrder").text(qtyBackOrder);
    });

    exportSalesToPdf = function() {
        let margins = {
            top: 0,
            bottom: 0,
            left: 0,
            width: 100
        };
        let id = $('.printID').attr("id");
        var source = document.getElementById('html-2-pdfwrapper');
        let file = "Stock Transer.pdf";
        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            file = 'Stock Transfer-' + id + '.pdf';
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
            $('.fullScreenSpin').css('display', 'none');
            $('#html-2-pdfwrapper').css('display', 'none');
        });

    };
    $(document).ready(function() {
        $('#sltDepartment').editableSelect();
        $('#edtCustomerName').editableSelect();
        $('#sltBankAccountName').editableSelect();
        $('#edtCustomerEmail').editableSelect();
        $('#shipvia').editableSelect();

        $('#tblEmployeelist tbody').on('click', 'tr', function(event) {
            $('#edtCustomerEmail').val($(event.target).closest("tr").find('.colEmail').text());
            $('#employeeList').modal('hide');
            $('#edtCustomerEmail').val($('#edtCustomerEmail').val().replace(/\s/g, ''));
            if ($('.chkEmailCopy').is(':checked')) {
                let checkEmailData = $('#edtCustomerEmail').val();
                if (checkEmailData.replace(/\s/g, '') === '') {
                    $('.chkEmailCopy').prop('checked', false);
                    swal('Employee Email cannot be blank!', '', 'warning');
                    event.preventDefault();
                } else {

                    function isEmailValid(mailTo) {
                        return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(mailTo);
                    };
                    if (!isEmailValid(checkEmailData)) {
                        $('.chkEmailCopy').prop('checked', false);
                        swal('The email field must be a valid email address !', '', 'warning');

                        event.preventDefault();
                        return false;
                    } else {}
                }
            } else {}
        })

        $("#edtCustomerEmail").on('dblclick', function(e) {
            $('#employeeList').modal('show');
        });
        $('#addRow').on('click', function() {
            var rowData = $('#tblStocktransfer tbody>tr:last').clone(true);
            var rowData1 = $('.stock_print tbody>tr:last').clone(true);
            let tokenid = Random.id();
            $(".lineProductName", rowData).val("");
            // $(".lineProductBarCode", rowData).text("");
            $(".lineDescription", rowData).text("");
            $(".lineOrdered", rowData).val("");
            $(".ID", rowData).text("");
            $(".pqa", rowData).text("");
            $(".lineID", rowData).text("");
            $(".lineProductBarCode", rowData).text("");
            $(".UOMQtyShipped", rowData).val("");
            $(".UOMQtyBackOrder", rowData).text("");
            $(".ProductID", rowData).text("");
            rowData.attr('id', tokenid);
            $("#tblStocktransfer tbody").append(rowData);

            $(".lineProductNamePrint", rowData1).text("");
            $(".lineProductBarCodePrint", rowData1).text("");
            $(".lineDescriptionPrint", rowData1).text("");
            $(".lineTransferPrint", rowData1).text("");
            $(".lineAvailablePrint", rowData1).text("");
            $(".lineAdjustQtyPrint", rowData1).text("");
            // $(".lineAmt", rowData).text("");
            rowData1.attr('id', tokenid);
            $(".stock_print tbody").append(rowData1);
            $('#' + tokenid).css('background', 'transparent');


            setTimeout(function() {
                $('#' + tokenid + " .lineProductName").trigger('click');
            }, 200);
        });
        $('#scanNewRowMobile').on('click', function() {
            var rowData = $('#tblStocktransfer tbody>tr:last').clone(true);
            var rowData1 = $('.stock_print tbody>tr:last').clone(true);
            let tokenid = Random.id();
            $(".lineProductName", rowData).val("");
            // $(".lineProductBarCode", rowData).text("");
            $(".lineDescription", rowData).text("");
            $(".lineOrdered", rowData).val("");
            $(".ID", rowData).text("");
            $(".pqa", rowData).text("");
            $(".lineID", rowData).text("");
            $(".lineProductBarCode", rowData).text("");
            $(".UOMQtyShipped", rowData).val("");
            $(".UOMQtyBackOrder", rowData).text("");
            $(".ProductID", rowData).text("");
            rowData.attr('id', tokenid);
            $("#tblStocktransfer tbody").append(rowData);

            $(".lineProductNamePrint", rowData1).text("");
            $(".lineProductBarCodePrint", rowData1).text("");
            $(".lineDescriptionPrint", rowData1).text("");
            $(".lineTransferPrint", rowData1).text("");
            $(".lineAvailablePrint", rowData1).text("");
            $(".lineAdjustQtyPrint", rowData1).text("");
            // $(".lineAmt", rowData).text("");
            rowData1.attr('id', tokenid);
            $(".stock_print tbody").append(rowData1);
            $('#' + tokenid).css('background', 'transparent');


            // setTimeout(function() {
            //     $('#' + tokenid + " .lineProductName").trigger('click');
            // }, 200);
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

    $('#sltDepartment').editableSelect()
        .on('click.editable-select', function(e, li) {
            var $earch = $(this);
            var offset = $earch.offset();
            var deptDataName = e.target.value || '';
            $('#edtDepartmentID').val('');
            $('#selectLineID').val('');
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
                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
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
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
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

    $(document).on("click", "#tblShipViaPopList tbody tr", function(e) {
        $('#shipvia').val($(this).find(".colShipName ").text());
        $('#shipViaModal').modal('toggle');

        $('#tblShipViaPopList_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshVia').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#departmentList tbody tr", function(e) {
        let $tblrows = $("#tblStocktransfer tbody tr");
        let selectLineID = $('#selectLineID').val();
        let departmentData = $(this).find(".colDeptName").text() || '';
        let departmentDataID = $(this).attr("id") || '';
        if (selectLineID != '') {
            $('#' + selectLineID + " .lineDepartment").val(departmentData);
            $('#' + selectLineID + " .linedeptid").text(departmentDataID);
        } else {
            $('#sltDepartment').val(departmentData);

            $tblrows.each(function(index) {
                var $tblrow = $(this);
                let productname = $tblrow.find(".lineProductName").val() || '';
                let selectLineIDRow = $tblrow.closest('tr').attr('id');
                templateObject.getProductQty(selectLineIDRow, productname);
                $('input[name="deptID"]').val(departmentDataID);

            });
        }
        $('#departmentModal').modal('toggle');

    });
    $(document).on("click", ".chkEmailCopy", function(e) {
        if ($(event.target).is(':checked')) {
            $('#employeeList').modal('show');
        }
    });

    $(document).on("blur", ".lineUOMQtyShipped", function(event) {
        var targetID = $(event.target).closest('tr').attr('id');
        $('#' + targetID + " .lineAdjustQtyPrint").text($('#' + targetID + " .lineUOMQtyShipped").val());
    });

    $('#edtCustomerName').editableSelect()
        .on('click.editable-select', function(e, li) {
            var $earch = $(this);
            var offset = $earch.offset();
            $('#edtCustomerPOPID').val('');
            var customerDataName = e.target.value || '';
            // var customerDataID = $('#edtCustomerName').attr('custid').replace(/\s/g, '') || '';
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#customerListModal').modal();
                setTimeout(function() {
                    $('#tblCustomerlist_filter .form-control-sm').focus();
                    $('#tblCustomerlist_filter .form-control-sm').val('');
                    $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblCustomerlist').DataTable();
                    //datatable.clear();
                    //datatable.rows.add(splashArrayCustomerList);
                    datatable.draw();
                    $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                    //$('#tblCustomerlist').dataTable().fnFilter(' ').draw(false);
                }, 500);
            } else {
                if (customerDataName.replace(/\s/g, '') != '') {
                    //FlowRouter.go('/customerscard?name=' + e.target.value);
                    $('#edtCustomerPOPID').val('');
                    getVS1Data('TCustomerVS1').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getOneCustomerDataExByName(customerDataName).then(function(data) {
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

                                setTimeout(function() {
                                    $('#addCustomerModal').modal('show');
                                }, 200);
                            }).catch(function(err) {
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

                                    setTimeout(function() {
                                        $('#addCustomerModal').modal('show');
                                    }, 200);

                                }
                            }
                            if (!added) {
                                $('.fullScreenSpin').css('display', 'inline-block');
                                sideBarService.getOneCustomerDataExByName(customerDataName).then(function(data) {
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

                                    setTimeout(function() {
                                        $('#addCustomerModal').modal('show');
                                    }, 200);
                                }).catch(function(err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }
                        }
                    }).catch(function(err) {
                        sideBarService.getOneCustomerDataExByName(customerDataName).then(function(data) {
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

                            setTimeout(function() {
                                $('#addCustomerModal').modal('show');
                            }, 200);
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    });
                } else {
                    $('#customerListModal').modal();
                    setTimeout(function() {
                        $('#tblCustomerlist_filter .form-control-sm').focus();
                        $('#tblCustomerlist_filter .form-control-sm').val('');
                        $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                        var datatable = $('#tblCustomerlist').DataTable();
                        //datatable.clear();
                        //datatable.rows.add(splashArrayCustomerList);
                        datatable.draw();
                        $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                        //$('#tblCustomerlist').dataTable().fnFilter(' ').draw(false);
                    }, 500);
                }
            }


        });

    /* On click Customer List */


    $('#sltBankAccountName').editableSelect().on('click.editable-select', function(e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value || '';

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $('#selectLineID').val('');
            $('#accountListModal').modal();
            setTimeout(function() {
                $('#tblAccount_filter .form-control-sm').focus();
                $('#tblAccount_filter .form-control-sm').val('');
                $('#tblAccount_filter .form-control-sm').trigger("input");
                var datatable = $('#tblAccountlist').DataTable();
                datatable.draw();
                $('#tblAccountlist_filter .form-control-sm').trigger("input");
            }, 500);
        } else {
            if (accountDataName.replace(/\s/g, '') != '') {
                getVS1Data('TAccountVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        accountService.getOneAccountByName(accountDataName).then(function(data) {
                            let lineItems = [];
                            let lineItemObj = {};
                            let fullAccountTypeName = '';
                            let accBalance = '';
                            $('#add-account-title').text('Edit Account Details');
                            $('#edtAccountName').attr('readonly', true);
                            $('#sltAccountType').attr('readonly', true);
                            $('#sltAccountType').attr('disabled', 'disabled');
                            if (accountTypeList) {
                                for (var h = 0; h < accountTypeList.length; h++) {

                                    if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                        fullAccountTypeName = accountTypeList[h].description || '';

                                    }
                                }

                            }

                            var accountid = data.taccountvs1[0].fields.ID || '';
                            var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                            var accountname = data.taccountvs1[0].fields.AccountName || '';
                            var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                            var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                            var accountdesc = data.taccountvs1[0].fields.Description || '';
                            var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                            var bankbsb = data.taccountvs1[0].fields.BSB || '';
                            var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                            var swiftCode = data.taccountvs1[0].fields.Extra || '';
                            var routingNo = data.taccountvs1[0].fields.BankCode || '';

                            var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                            var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                            var cardcvc = data.taccountvs1[0].fields.CVC || '';
                            var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

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

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.taccountvs1;
                        var added = false;
                        let lineItems = [];
                        let lineItemObj = {};
                        let fullAccountTypeName = '';
                        let accBalance = '';
                        $('#add-account-title').text('Edit Account Details');
                        $('#edtAccountName').attr('readonly', true);
                        $('#sltAccountType').attr('readonly', true);
                        $('#sltAccountType').attr('disabled', 'disabled');
                        for (let a = 0; a < data.taccountvs1.length; a++) {

                            if ((data.taccountvs1[a].fields.AccountName) === accountDataName) {
                                added = true;
                                if (accountTypeList) {
                                    for (var h = 0; h < accountTypeList.length; h++) {

                                        if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                            fullAccountTypeName = accountTypeList[h].description || '';

                                        }
                                    }

                                }



                                var accountid = data.taccountvs1[a].fields.ID || '';
                                var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                                var accountname = data.taccountvs1[a].fields.AccountName || '';
                                var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                                var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                                var accountdesc = data.taccountvs1[a].fields.Description || '';
                                var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                                var bankbsb = data.taccountvs1[a].fields.BSB || '';
                                var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';

                                var swiftCode = data.taccountvs1[a].fields.Extra || '';
                                var routingNo = data.taccountvs1[a].BankCode || '';

                                var showTrans = data.taccountvs1[a].fields.IsHeader || false;

                                var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                                var cardcvc = data.taccountvs1[a].fields.CVC || '';
                                var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';

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
                        }
                        if (!added) {
                            accountService.getOneAccountByName(accountDataName).then(function(data) {
                                let lineItems = [];
                                let lineItemObj = {};
                                let fullAccountTypeName = '';
                                let accBalance = '';
                                $('#add-account-title').text('Edit Account Details');
                                $('#edtAccountName').attr('readonly', true);
                                $('#sltAccountType').attr('readonly', true);
                                $('#sltAccountType').attr('disabled', 'disabled');
                                if (accountTypeList) {
                                    for (var h = 0; h < accountTypeList.length; h++) {

                                        if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                            fullAccountTypeName = accountTypeList[h].description || '';

                                        }
                                    }

                                }

                                var accountid = data.taccountvs1[0].fields.ID || '';
                                var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                                var accountname = data.taccountvs1[0].fields.AccountName || '';
                                var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                                var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                                var accountdesc = data.taccountvs1[0].fields.Description || '';
                                var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                                var bankbsb = data.taccountvs1[0].fields.BSB || '';
                                var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                                var swiftCode = data.taccountvs1[0].fields.Extra || '';
                                var routingNo = data.taccountvs1[0].fields.BankCode || '';

                                var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                                var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                                var cardcvc = data.taccountvs1[0].fields.CVC || '';
                                var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

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
                        if (accountTypeList) {
                            for (var h = 0; h < accountTypeList.length; h++) {

                                if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                    fullAccountTypeName = accountTypeList[h].description || '';

                                }
                            }

                        }

                        var accountid = data.taccountvs1[0].fields.ID || '';
                        var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                        var accountname = data.taccountvs1[0].fields.AccountName || '';
                        var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                        var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                        var accountdesc = data.taccountvs1[0].fields.Description || '';
                        var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                        var bankbsb = data.taccountvs1[0].fields.BSB || '';
                        var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                        var swiftCode = data.taccountvs1[0].fields.Extra || '';
                        var routingNo = data.taccountvs1[0].fields.BankCode || '';

                        var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                        var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                        var cardcvc = data.taccountvs1[0].fields.CVC || '';
                        var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

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

                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });

                });
                $('#addAccountModal').modal('toggle');
            } else {
                $('#selectLineID').val('');
                $('#accountListModal').modal();
                setTimeout(function() {
                    $('#tblAccount_filter .form-control-sm').focus();
                    $('#tblAccount_filter .form-control-sm').val('');
                    $('#tblAccount_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblSupplierlist').DataTable();
                    datatable.draw();
                    $('#tblAccount_filter .form-control-sm').trigger("input");
                }, 500);
            }
        }


    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        var table = $(this);

        let accountname = table.find(".productName").text();
        $('#accountListModal').modal('toggle');
        $('#sltBankAccountName').val(accountname);

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function() {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    /* On clik Inventory Line */
    $(document).on("click", "#tblInventory tbody tr", function(e) {
        $(".colProductName").removeClass('boldtablealertsborder');
        let selectLineID = $('#selectLineID').val();
        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblStocktransfer tbody tr");
        let transferDepartment = $('#sltDepartment').val() || defaultDept;

        if (selectLineID) {
            let lineProductName = table.find(".productName").text();
            let lineProductDesc = table.find(".productDesc").text();
            let lineUnitPrice = table.find(".salePrice").text();
            let lineExtraSellPrice = JSON.parse(table.find(".colExtraSellPrice").text()) || null;
            let lineAvailQty = table.find(".prdqty").text() || 0;
            let lineBarcode = table.find(".colBarcode").text();
            let lineProductID = table.find(".colProuctPOPID").text();

            $('#' + selectLineID + " .lineProductName").val(lineProductName);
            // $('#' + selectLineID + " .lineProductName").attr("prodid", table.find(".colProuctPOPID").text());
            $('#' + selectLineID + " .colDescription").text(lineProductDesc);
            $('#' + selectLineID + " .lineProductBarCode").text(lineBarcode);
            $('#' + selectLineID + " .colOrdered").val(lineAvailQty);
            $('#' + selectLineID + " .lineUOMQtyShipped").val(0);
            $('#' + selectLineID + " .ProductID").text(lineProductID);
            if (lineProductName != '') {
                templateObject.getProductQty(selectLineID, lineProductName);
            }

            $('.stock_print #' + selectLineID + " .lineProductNamePrint").text(lineProductName);
            $('#' + selectLineID + " .lineDescriptionPrint").text(lineProductDesc);
            $('#' + selectLineID + " .lineProductBarCodePrint ").text(lineBarcode);
            $('#' + selectLineID + " .lineTransferPrint").text(transferDepartment);
            $('#' + selectLineID + " .lineAvailablePrint").text(lineAvailQty);
            $('#' + selectLineID + " .lineAdjustQtyPrint").text(0);
            let lineDepartmentVal = $('#' + selectLineID + " .lineDepartment").val() || defaultDept;
            $('#productListModal').modal('toggle');


        }

        $('#tblInventory_filter .form-control-sm').val('');
        setTimeout(function() {
            //$('#tblCustomerlist_filter .form-control-sm').focus();
            $('.btnRefreshProduct').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    var isMobile = false;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    }
    if (isMobile != true) {
        setTimeout(function() {
            document.getElementById("scanBarcodeModalHidden").style.display = "none";
            document.getElementById("scanResult").style.display = "block";
            document.getElementById("mobileScanResult").style.display = "none";
        }, 500);
    }
    if (isMobile == true) {
      setTimeout(function() {
        document.getElementById("scanResult").style.display = "none";
        document.getElementById("mobileScanResult").style.display = "block";
      }, 500);

    }
    setTimeout(function() {
        var html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader", {
                fps: 10,
                qrbox: 250,
                rememberLastUsedCamera: true
            });
        html5QrcodeScanner.render(onScanSuccess);
    }, 500);

    function onScanSuccess(decodedText, decodedResult) {
        var barcodeScanner = decodedText.toUpperCase();
        $('#scanBarcodeModal').modal('toggle');
        if (barcodeScanner != '') {

            // setTimeout(function() {
            //     $('#tblSearchOverview_filter .form-control-sm').val(barcodeScanner);
            // }, 200);
            // templateObject.getAllGlobalSearch(barcodeScanner);
        }
    };


    function onScanSuccessStockTransfer(decodedText, decodedResult) {
        var barcodeScannerStockTransfer = decodedText.toUpperCase();
        $('#scanBarcodeModalStockTransfer').modal('toggle');
        if (barcodeScannerStockTransfer != '') {
            setTimeout(function() {
                $('#allocBarcode').val(barcodeScannerStockTransfer);
                $('#allocBarcode').trigger("input");
            }, 200);


        }
    }


    var html5QrcodeScannerStockTransfer = new Html5QrcodeScanner(
        "qr-reader-stocktransfer", {
            fps: 10,
            qrbox: 250,
            rememberLastUsedCamera: true
        });
    html5QrcodeScannerStockTransfer.render(onScanSuccessStockTransfer);
});

Template.stocktransfercard.events({

    'click .lineProductName, keydown .lineProductName': function(event) {
        var $earch = $(event.currentTarget);
        var offset = $earch.offset();

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
                //FlowRouter.go('/productview?prodname=' +  $(event.target).text());
                let lineExtaSellItems = [];
                let lineExtaSellObj = {};
                $('.fullScreenSpin').css('display', 'inline-block');
                getVS1Data('TProductVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let lineItemObj = {};
                            let currencySymbol = Currency;
                            let totalquantity = 0;
                            let productname = data.tproduct[0].fields.ProductName || '';
                            let productcode = data.tproduct[0].fields.PRODUCTCODE || '';
                            let productprintName = data.tproduct[0].fields.ProductPrintName || '';
                            let assetaccount = data.tproduct[0].fields.AssetAccount || '';
                            let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                            let cogsaccount = data.tproduct[0].fields.CogsAccount || '';
                            let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || '';
                            let purchasedescription = data.tproduct[0].fields.PurchaseDescription || '';
                            let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                            let incomeaccount = data.tproduct[0].fields.IncomeAccount || '';
                            let taxcodesales = data.tproduct[0].fields.TaxCodeSales || '';
                            let salesdescription = data.tproduct[0].fields.SalesDescription || '';
                            let active = data.tproduct[0].fields.Active;
                            let lockextrasell = data.tproduct[0].fields.LockExtraSell || '';
                            let customfield1 = data.tproduct[0].fields.CUSTFLD1 || '';
                            let customfield2 = data.tproduct[0].fields.CUSTFLD2 || '';
                            let barcode = data.tproduct[0].fields.BARCODE || '';
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
                        }).catch(function(err) {

                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tproductvs1;
                        var added = false;

                        for (let i = 0; i < data.tproductvs1.length; i++) {
                            if (data.tproductvs1[i].fields.ProductName === productDataName) {
                                added = true;
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                let lineItemObj = {};
                                let currencySymbol = Currency;
                                let totalquantity = 0;

                                let productname = data.tproductvs1[i].fields.ProductName || '';
                                let productcode = data.tproductvs1[i].fields.PRODUCTCODE || '';
                                let productprintName = data.tproductvs1[i].fields.ProductPrintName || '';
                                let assetaccount = data.tproductvs1[i].fields.AssetAccount || '';
                                let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.BuyQty1Cost) || 0;
                                let cogsaccount = data.tproductvs1[i].fields.CogsAccount || '';
                                let taxcodepurchase = data.tproductvs1[i].fields.TaxCodePurchase || '';
                                let purchasedescription = data.tproductvs1[i].fields.PurchaseDescription || '';
                                let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproductvs1[i].fields.SellQty1Price) || 0;
                                let incomeaccount = data.tproductvs1[i].fields.IncomeAccount || '';
                                let taxcodesales = data.tproductvs1[i].fields.TaxCodeSales || '';
                                let salesdescription = data.tproductvs1[i].fields.SalesDescription || '';
                                let active = data.tproductvs1[i].fields.Active;
                                let lockextrasell = data.tproductvs1[i].fields.LockExtraSell || '';
                                let customfield1 = data.tproductvs1[i].fields.CUSTFLD1 || '';
                                let customfield2 = data.tproductvs1[i].fields.CUSTFLD2 || '';
                                let barcode = data.tproductvs1[i].fields.BARCODE || '';
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
                        if (!added) {
                            sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                let lineItemObj = {};
                                let currencySymbol = Currency;
                                let totalquantity = 0;
                                let productname = data.tproduct[0].fields.ProductName || '';
                                let productcode = data.tproduct[0].fields.PRODUCTCODE || '';
                                let productprintName = data.tproduct[0].fields.ProductPrintName || '';
                                let assetaccount = data.tproduct[0].fields.AssetAccount || '';
                                let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                                let cogsaccount = data.tproduct[0].fields.CogsAccount || '';
                                let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || '';
                                let purchasedescription = data.tproduct[0].fields.PurchaseDescription || '';
                                let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                                let incomeaccount = data.tproduct[0].fields.IncomeAccount || '';
                                let taxcodesales = data.tproduct[0].fields.TaxCodeSales || '';
                                let salesdescription = data.tproduct[0].fields.SalesDescription || '';
                                let active = data.tproduct[0].fields.Active;
                                let lockextrasell = data.tproduct[0].fields.LockExtraSell || '';
                                let customfield1 = data.tproduct[0].fields.CUSTFLD1 || '';
                                let customfield2 = data.tproduct[0].fields.CUSTFLD2 || '';
                                let barcode = data.tproduct[0].fields.BARCODE || '';
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
                            }).catch(function(err) {

                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                    }
                }).catch(function(err) {

                    sideBarService.getOneProductdatavs1byname(productDataName).then(function(data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];
                        let lineItemObj = {};
                        let currencySymbol = Currency;
                        let totalquantity = 0;
                        let productname = data.tproduct[0].fields.ProductName || '';
                        let productcode = data.tproduct[0].fields.PRODUCTCODE || '';
                        let productprintName = data.tproduct[0].fields.ProductPrintName || '';
                        let assetaccount = data.tproduct[0].fields.AssetAccount || '';
                        let buyqty1cost = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.BuyQty1Cost) || 0;
                        let cogsaccount = data.tproduct[0].fields.CogsAccount || '';
                        let taxcodepurchase = data.tproduct[0].fields.TaxCodePurchase || '';
                        let purchasedescription = data.tproduct[0].fields.PurchaseDescription || '';
                        let sellqty1price = utilityService.modifynegativeCurrencyFormat(data.tproduct[0].fields.SellQty1Price) || 0;
                        let incomeaccount = data.tproduct[0].fields.IncomeAccount || '';
                        let taxcodesales = data.tproduct[0].fields.TaxCodeSales || '';
                        let salesdescription = data.tproduct[0].fields.SalesDescription || '';
                        let active = data.tproduct[0].fields.Active;
                        let lockextrasell = data.tproduct[0].fields.LockExtraSell || '';
                        let customfield1 = data.tproduct[0].fields.CUSTFLD1 || '';
                        let customfield2 = data.tproduct[0].fields.CUSTFLD2 || '';
                        let barcode = data.tproduct[0].fields.BARCODE || '';
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
                    }).catch(function(err) {

                        $('.fullScreenSpin').css('display', 'none');
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

    },
    'click .lineProductBarCode, click .lineDescription, click .lineOrdered': function(event) {
        let templateObject = Template.instance();


            var $tblrow = $("#tblStocktransfer tbody tr");
            var targetID = $(event.target).closest('tr').attr('id');
            var prodPQALine = "";
            var dataListRet = "";

            var productName = $('#' + targetID + " .lineProductName").val() || '';
            var productID = $('#' + targetID + " .ProductID").text() || '';
            prodPQALine = $('#' + targetID + " .lineID").text();
            /*
          if (FlowRouter.current().queryParams.id) {
            $('input[name="prodID"]').val($('#' + targetID + " .ProductID").text());
            $('input[name="orderQty"]').val($('#' + targetID + " .colOrdered").val());
            let countSerial = 0;
            //$('table tr').css('background','#ffffff');
            $('table tr').css('background', 'transparent');
            $('#serailscanlist').find('tbody').remove();
            
            $('input[name="salesLineRow"]').val(targetID);
            prodPQALine = $('#' + targetID + " .lineID").text();
            var segsSerial = prodPQALine.split(',');
            $('#' + targetID).css('background', 'rgba(0,163,211,0.1)');
            for (let s = 0; s < segsSerial.length; s++) {
                countSerial++;
                let scannedCode = "PSN-" + productID + "-" + segsSerial[s];
                let htmlAppend = '<tr class="dnd-moved"><td class="form_id">' + countSerial + '</td><td>' + '' +
                    '</td><td>' + '</td>' +
                    '<td>' + '<input type="text" style="text-align: left !important;" name="serialNoBOM" id="serialNoBOM" class="highlightInput " value="' + scannedCode + '" readonly>' + '</td><td class="hiddenColumn"><input type="text" style="text-align: left !important;" name="serialNo" id="serialNo" class="highlightInput " value="' + segsSerial[s] + '" readonly></td><td style="width: 1%;"><span class=" removesecondtablebutton"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 "><i class="fa fa-remove"></i></button></span></td>' +
                    '</tr>';
                if (segsSerial[s] != '') {
                    //$("#serailscanlist").append(htmlAppend);
                }

            }

            //templateObject.getProductQty(targetID, productName);

        }
        */
        if (productName != '') {
            templateObject.getProductQty(targetID, productName);
        }
    },
    'click .lineDepartment, keydown .lineDepartment': function(event) {
        var $earch = $(event.currentTarget);
        var offset = $earch.offset();
        var departmentDataName = $(event.target).val() || '';
        if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
            $('#departmentModal').modal('toggle');
            var targetID = $(event.target).closest('tr').attr('id');
            $('#selectLineID').val(targetID);
            setTimeout(function() {
                $('#departmentList_filter .form-control-sm').focus();
                $('#departmentList_filter .form-control-sm').val('');
                $('#departmentList_filter .form-control-sm').trigger("input");

                var datatable = $('#departmentList').DataTable();
                datatable.draw();
                $('#departmentList_filter .form-control-sm').trigger("input");

            }, 500);
        } else {
            if (departmentDataName.replace(/\s/g, '') != '') {
                let lineExtaSellItems = [];
                let lineExtaSellObj = {};
                $('.fullScreenSpin').css('display', 'inline-block');
                $('#newDeptHeader').text('Edit Department');

                getVS1Data('TDeptClass').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getDepartment().then(function(data) {
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                if (data.tdeptclass[i].DeptClassName === departmentDataName) {
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
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
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
                            if (data.tdeptclass[i].DeptClassName === departmentDataName) {
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
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });
                });
            } else {
                $('#departmentModal').modal('toggle');
                var targetID = $(event.target).closest('tr').attr('id');
                $('#selectLineID').val(targetID);
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

    },
    'click #includeInvoiceAttachment': function(e) {
        let templateObject = Template.instance();
        if ($('#includeInvoiceAttachment').prop('checked')) {
            templateObject.includeInvoiceAttachment.set(true);
            $(".btnprintDockets").attr("data-toggle", "modal");
            $(".btnprintDockets").attr("data-target", "#print-dockets");
            $(".btnprintDockets").attr("data-dismiss", "modal");
        } else {
            templateObject.includeInvoiceAttachment.set(false);
            let isInvoice = templateObject.includeInvoiceAttachment.get();
            let isShippingDocket = templateObject.includeDocketAttachment.get();
            if (!(isInvoice) && !(isShippingDocket)) {
                $(".btnprintDockets").removeAttr("data-toggle");
                $(".btnprintDockets").removeAttr("data-target");
                $(".btnprintDockets").removeAttr("data-dismiss");
            }
        }
    },
    'click #includeDocketAttachment': function(e) {
        let templateObject = Template.instance();

        if ($('#includeDocketAttachment').prop('checked')) {
            templateObject.includeDocketAttachment.set(true);
            $(".btnprintDockets").attr("data-toggle", "modal");
            $(".btnprintDockets").attr("data-target", "#print-dockets");
            $(".btnprintDockets").attr("data-dismiss", "modal");
        } else {
            templateObject.includeDocketAttachment.set(false);
            let isInvoice = templateObject.includeInvoiceAttachment.get();
            let isShippingDocket = templateObject.includeDocketAttachment.get();
            if (!(isInvoice) && !(isShippingDocket)) {
                $(".btnprintDockets").removeAttr("data-toggle");
                $(".btnprintDockets").removeAttr("data-target");
                $(".btnprintDockets").removeAttr("data-dismiss");
            }

        }
    },
    'click .btnprintDockets': function(e) {

        let invoiceID = parseInt($("#SalesId").val());
        let templateObject = Template.instance();
        let isInvoice = templateObject.includeInvoiceAttachment.get();
        let isShippingDocket = templateObject.includeDocketAttachment.get();

        if (invoiceID) {
            if ((isInvoice) && (isShippingDocket)) {
                let templateObject = Template.instance();
                let printType = "InvoiceANDDeliveryDocket";
                templateObject.SendShippingDetails(printType);

            }
            if ((isInvoice) && !(isShippingDocket)) {
                let templateObject = Template.instance();
                let printType = "InvoiceOnly";
                templateObject.SendShippingDetails(printType);
            }
            if ((isShippingDocket) && !(isInvoice)) {
                let templateObject = Template.instance();
                let printType = "DeliveryDocketsOnly";
                templateObject.SendShippingDetails(printType);
            }
        }

    },
    'click .btnprintInvoice': function(e) {
        let templateObject = Template.instance();
        let printType = "InvoiceOnly";
        templateObject.SendShippingDetails(printType);
    },
    'click .btnprintDelDocket': function(e) {
        let templateObject = Template.instance();
        let printType = "DeliveryDocketsOnly";
        templateObject.SendShippingDetails(printType);
    },
    'click #printDockets': function(e) {
        const templateObject = Template.instance();
    },
    'click .viewMoreSerialNo': function(e) {
        $('#tblAvailableSerialNo .hiddenColumn').addClass('showHiddenColumn');
        $('#tblAvailableSerialNo .hiddenColumn').removeClass('hiddenColumn');
        $('.viewMoreSerialNo').css('display', 'none');
        $('.viewLessSerialNo').css('display', 'inline-block');
    },
    'click .viewLessSerialNo': function(e) {
        $('#tblAvailableSerialNo .showHiddenColumn').addClass('hiddenColumn');
        $('#tblAvailableSerialNo .showHiddenColumn').removeClass('showHiddenColumn');
        $('.viewMoreSerialNo').css('display', 'inline-block');
        $('.viewLessSerialNo').css('display', 'none');
    },
    'click .btnBack': function(event) {
        event.preventDefault();
        history.back(1);
    },
    'click .printConfirm': function(event) {
      $('.fullScreenSpin').css('display', 'inline-block');
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#sltDepartment').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val());
        $('#printcomment').html($('#txtNotes').val().replace(/[\r\n]/g, "<br />"));
        let isReadyToSave  = false;
        $('#tblStocktransfer > tbody > tr').each(function() {
            var lineID = this.id;
            let tdproduct = $('#' + lineID + " .lineProductName").val();
            let tdproductID = $('#' + lineID + " .lineProductName").attr('productid');
            let tdproductCost = $('#' + lineID + " .lineProductName").attr('productcost');
            let tdbarcode = $('#' + lineID + " .lineProductBarCode").html();
            let tddescription = $('#' + lineID + " .lineDescription").html() || '';
            let tdserialNumber = $('#' + lineID + " .pqa").text() || '';
            var segsSerialLenght = tdserialNumber.split(',');
            let tdDepartment = $('#' + lineID + " .lineDepartment").val();

            let tdavailqty = $('#' + lineID + " .lineOrdere").val();
            let tdtransferqty = $('#' + lineID + " .lineUOMQtyShipped").val();
            if (tdproduct != "") {
              if(segsSerialLenght.length == tdtransferqty){

                isReadyToSave = true;
              }else{
                isReadyToSave = false;
                Bert.alert('<strong>WARNING:</strong> Your serial number scanned quantity does not match your transfer quantity. Please scan in the correct quantity.', 'now-danger');
                DangerSound();
                $('.fullScreenSpin').css('display', 'none');
                event.preventDefault();
                return false;
              }
            }
        });
        if(isReadyToSave){
        exportSalesToPdf();
      }else{
        $('#html-2-pdfwrapper').css('display', 'none');
        $('.fullScreenSpin').css('display', 'none');
      }
    },
    'click .btnProcess': function(event) {
         if ($('.chkEmailCopy').is(':checked')) {
        $('#html-2-pdfwrapper').css('display', 'block');
        }
        let templateObject = Template.instance();
        //let customername = $('#edtCustomerName').val() || '';
        // let shippingaddress = $('#txaShipingInfo').val() || '';
        let transferFrom = $('#sltDepartment').val() || '';
        let shipVia = $('#shipvia').val() || '';
        let conNote = $('#shipcomments').val() || '';
        let toAccount = $('#sltBankAccountName').val() || '';
        let stockTransferService = new StockTransferService();
        //$('.loginSpinner').css('display','inline-block');
        $('.fullScreenSpin').css('display', 'inline-block');
        var splashLineArray = new Array();
        let lineItemsForm = [];
        let lineItemObjForm = {};
        let isReadyToSave  = false;
        $('#tblStocktransfer > tbody > tr').each(function() {
            var lineID = this.id;
            let tdproduct = $('#' + lineID + " .lineProductName").val();
            let tdproductID = $('#' + lineID + " .lineProductName").attr('productid');
            let tdproductCost = $('#' + lineID + " .lineProductName").attr('productcost');
            let tdbarcode = $('#' + lineID + " .lineProductBarCode").html();
            let tddescription = $('#' + lineID + " .lineDescription").html() || '';
            let tdserialNumber = $('#' + lineID + " .pqa").text() || '';
            var segsSerialLenght = tdserialNumber.split(',');
            // let tdfinalqty = $('#' + lineID + " .lineFinalQty").val();
            // let tdadjustqty = $('#' + lineID + " .lineAdjustQty").val();
            let tdDepartment = $('#' + lineID + " .lineDepartment").val();

            let tdavailqty = $('#' + lineID + " .lineOrdere").val();
            let tdtransferqty = $('#' + lineID + " .lineUOMQtyShipped").val();
            if (tdproduct != "") {
              if(segsSerialLenght.length == tdtransferqty){
                //if (tdserialNumber != '') {
                    lineItemObjForm = {
                        type: "TSTELinesFlat",
                        fields: {
                            ProductName: tdproduct || '',
                            AccountName: 'Inventory Asset',
                            TransferQty: parseFloat(tdtransferqty) || 0,
                            ClassNameTo: tdDepartment || defaultDept,
                            TransferSerialnos: tdserialNumber || '',
                            PartBarcode: tdbarcode || '',
                        }
                    };
                //}
                // else {
                //     lineItemObjForm = {
                //         type: "TSTELinesFlat",
                //         fields: {
                //             ProductName: tdproduct || '',
                //             AccountName: 'Inventory Asset',
                //             TransferQty: parseFloat(tdtransferqty) || 0,
                //             ClassNameTo: tdDepartment || defaultDept,
                //             PartBarcode: tdbarcode || '',
                //         }
                //     };
                // }


                //lineItemsForm.push(lineItemObjForm);
                splashLineArray.push(lineItemObjForm);
                isReadyToSave = true;
              }else{
                isReadyToSave = false;
                Bert.alert('<strong>WARNING:</strong> Your serial number scanned quantity does not match your transfer quantity. Please scan in the correct quantity.', 'now-danger');
                DangerSound();
                $('.fullScreenSpin').css('display', 'none');
                event.preventDefault();
                return false;
              }
            }
        });

        let selectAccount = $('#sltAccountName').val();

        let notes = $('#shipcomments').val() || '';
        let reason = $('#txtNotes').val() || '';
        var creationdateTime = new Date($("#dtShipDate").datepicker("getDate"));
        let creationDate = creationdateTime.getFullYear() + "-" + (creationdateTime.getMonth() + 1) + "-" + creationdateTime.getDate();
        var url = FlowRouter.current().path;
        var getso_id = url.split('?id=');
        var currentStock = getso_id[getso_id.length - 1];
        // let uploadedItems = templateObject.uploadedFiles.get();
        var objDetails = '';
        if (getso_id[1]) {
            currentStock = parseInt(currentStock);
            objDetails = {
                type: "TStockTransferEntry",
                fields: {
                    ID: currentStock,
                    AccountName: selectAccount,
                    TransferFromClassName: transferFrom,
                    DateTransferred: creationDate,
                    DoProcessonSave: true,
                    Transfertype: "Gen",
                    EnforceUOM: false,
                    Lines: splashLineArray,
                    EmployeeName: Session.get('mySessionEmployee'),
                    Shipping: shipVia,
                    Notes: notes,
                    Description: reason

                }
            };
        } else {
            objDetails = {
                type: "TStockTransferEntry",
                fields: {
                    AccountName: selectAccount,
                    TransferFromClassName: transferFrom,
                    DateTransferred: creationDate,
                    DoProcessonSave: true,
                    Transfertype: "Gen",
                    EnforceUOM: false,
                    Lines: splashLineArray,
                    EmployeeName: Session.get('mySessionEmployee'),
                    Shipping: shipVia,
                    Notes: notes,
                    Description: reason
                }
            };
        }
        if(isReadyToSave){
        stockTransferService.saveStockTransfer(objDetails).then(function(objDetails) {
            function generatePdfForMail(invoiceId) {
                let file = "Invoice-" + invoiceId + ".pdf"
                return new Promise((resolve, reject) => {
                    let templateObject = Template.instance();
                    let completeTabRecord;
                    let doc = new jsPDF('p', 'pt', 'a4');
                    var source = document.getElementById('html-2-pdfwrapper');
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
                    }
                    resolve(html2pdf().set(opt).from(source).toPdf().output('datauristring'));

                });
            }

            async function addAttachment() {
                let attachment = [];
                let templateObject = Template.instance();

                let invoiceId = objDetails.fields.ID;
                let encodedPdf = await generatePdfForMail(invoiceId);
                // var base64data = reader.result;
                let base64data = encodedPdf.split(',')[1];
                pdfObject = {
                    filename: 'Stock Adjustment-' + invoiceId + '.pdf',
                    content: base64data,
                    encoding: 'base64'
                };
                attachment.push(pdfObject);
                let erpInvoiceId = objDetails.fields.ID;

                let mailFromName = Session.get('vs1companyName');
                let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                //let customerEmailName = $('#edtCustomerName').val();
                let checkEmailData = $('#edtCustomerEmail').val();
                // let grandtotal = $('#grandTotal').html();
                // let amountDueEmail = $('#totalBalanceDue').html();
                // let emailDueDate = $("#dtDueDate").val();
                // let customerBillingAddress = $('#txabillingAddress').val();
                // let customerTerms = $('#sltTerms').val();

                // let customerSubtotal = $('#subtotal_total').html();
                // let customerTax = $('#subtotal_tax').html();
                // let customerNett = $('#subtotal_nett').html();
                // let customerTotal = $('#grandTotal').html();
                let mailSubject = 'Stock Adjustment ' + erpInvoiceId + ' from ' + mailFromName;
                let mailBody = "Hi " + ",\n\n Here's Stock Adjustment " + erpInvoiceId + " from  " + mailFromName;

                var htmlmailBody = '    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate;mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">' +
                    '        <tr>' +
                    '            <td class="container" style="display: block; margin: 0 auto !important; max-width: 650px; padding: 10px; width: 650px;">' +
                    '                <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 650px; padding: 10px;">' +
                    '                    <table class="main">' +
                    '                        <tr>' +
                    '                            <td class="wrapper">' +
                    '                                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">' +
                    '                                    <tr>' +
                    '                                        <td class="content-block" style="text-align: center; letter-spacing: 2px;">' +
                    '                                            <span class="doc-details" style="color: #999999; font-size: 12px; text-align: center; margin: 0 auto; text-transform: uppercase;">Stock Adjustment No. ' + erpInvoiceId + ' Details</span>' +
                    '                                        </td>' +
                    '                                    </tr>' +
                    '                                    <tr style="height: 16px;"></tr>' +
                    '                                    <tr>' +
                    '                                        <td>' +
                    '                                            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;" />' +
                    '                                        </td>' +
                    '                                    </tr>' +
                    '                                    <tr style="height: 48px;"></tr>' +
                    '                                    <tr>' +
                    '                                        <td class="content-block" style="padding: 16px 32px;">' +
                    '                                            <p style="font-size: 18px;">Hi </p>' +
                    '                                            <p style="font-size: 18px; margin: 34px 0px;">Please find the Stock Transfer attached to this email.</p>' +
                    '                                            <p style="font-size: 18px; margin-bottom: 8px;">Thanks you</p>' +
                    '                                            <p style="font-size: 18px;">' + mailFromName + '</p>' +
                    '                                    <tr>' +
                    '                                        <td class="content-block" style="padding: 16px 32px;">' +
                    '                                            <p style="font-size: 15px; color: #666666;">If you receive an email that seems fraudulent, please check with the business owner before paying.</p>' +
                    '                                        </td>' +
                    '                                    </tr>' +
                    '                                    <tr>' +
                    '                                        <td>' +
                    '                                            <table border="0" cellpadding="0" cellspacing="0" style="box-sizing: border-box; width: 100%;">' +
                    '                                                <tbody>' +
                    '                                                    <tr>' +
                    '                                                        <td align="center">' +
                    '                                                            <table border="0" cellpadding="0" cellspacing="0" style="width: auto;">' +
                    '                                                                <tbody>' +
                    '                                                                    <tr>' +
                    '                                                                        <td> <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%; width: 20%; margin: 0; padding: 12px 25px; display: inline-block;" /> </td>' +
                    '                                                                    </tr>' +
                    '                                                                </tbody>' +
                    '                                                            </table>' +
                    '                                                        </td>' +
                    '                                                    </tr>' +
                    '                                                </tbody>' +
                    '                                            </table>' +
                    '                                        </td>' +
                    '                                    </tr>' +
                    '                                </table>' +
                    '                            </td>' +
                    '                        </tr>' +
                    '                    </table>' +
                    '                    <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">' +
                    '                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">' +
                    '                            <tr>' +
                    '                                <td class="content-block" style="color: #999999; font-size: 12px; text-align: center;">' +
                    '                                    <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Company Inc, 3 Abbey Road, San Francisco CA 90210</span>' +
                    '                                    <br>' +
                    '                                    <a href="#" style="color: #999999; font-size: 12px; text-align: center;">Privacy</a>' +
                    '                                    <a href="#" style="color: #999999; font-size: 12px; text-align: center;">Security</a>' +
                    '                                    <a href="#" style="color: #999999; font-size: 12px; text-align: center;">Terms of Service</a>' +
                    '                                </td>' +
                    '                            </tr>' +
                    '                        </table>' +
                    '                    </div>' +
                    '                </div>' +
                    '            </td>' +
                    '        </tr>' +
                    '    </table>';

                if ($('.chkEmailCopy').is(':checked')) {

                    $('#html-2-pdfwrapper').css('display', 'none');
                    Meteor.call('sendEmail', {
                        from: "" + mailFromName + " <" + mailFrom + ">",
                        to: checkEmailData,
                        subject: mailSubject,
                        text: '',
                        html: htmlmailBody,
                        attachments: attachment
                    }, function(error, result) {
                        if (error && error.error === "error") {
                            FlowRouter.go('/stocktransferlist?success=true');

                        } else {
                            swal({
                                title: 'SUCCESS',
                                text: "Email Sent To Employee: " + checkEmailData + " ",
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    FlowRouter.go('/stocktransferlist?success=true');
                                } else if (result.dismiss === 'cancel') {}
                            });

                            $('.fullScreenSpin').css('display', 'none');
                        }
                    });

                } else {
                    FlowRouter.go('/stocktransferlist?success=true');
                };

            }
            addAttachment();

            $('.modal-backdrop').css('display', 'none');

        }).catch(function(err) {
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
            //$('.loginSpinner').css('display','none');
            $('.fullScreenSpin').css('display', 'none');
        });
      }else{
        $('.fullScreenSpin').css('display', 'none');
      }


    },
    'click .btnHold': function(event) {
      if ($('.chkEmailCopy').is(':checked')) {
      $('#html-2-pdfwrapper').css('display', 'block');
      }
      let templateObject = Template.instance();
      //let customername = $('#edtCustomerName').val() || '';
      //let shippingaddress = $('#txaShipingInfo').val() || '';
      let transferFrom = $('#sltDepartment').val() || '';
      let shipVia = $('#shipvia').val() || '';
      let conNote = $('#shipcomments').val() || '';
      let toAccount = $('#sltBankAccountName').val() || '';
      // let department = $('#sltDepartment').val();
      let stockTransferService = new StockTransferService();
      //$('.loginSpinner').css('display','inline-block');
      $('.fullScreenSpin').css('display', 'inline-block');
      var splashLineArray = new Array();
      let lineItemsForm = [];
      let lineItemObjForm = {};
      let isReadyToSave  = false;
      $('#tblStocktransfer > tbody > tr').each(function() {
          var lineID = this.id;
          let tdproduct = $('#' + lineID + " .lineProductName").val();
          let tdproductID = $('#' + lineID + " .lineProductName").attr('productid');
          let tdproductCost = $('#' + lineID + " .lineProductName").attr('productcost');
          let tdbarcode = $('#' + lineID + " .lineProductBarCode").html();
          let tddescription = $('#' + lineID + " .lineDescription").html() || '';
          let tdserialNumber = $('#' + lineID + " .pqa").text();
          var segsSerialLenght = tdserialNumber.split(',');
          // let tdfinalqty = $('#' + lineID + " .lineFinalQty").val();
          // let tdadjustqty = $('#' + lineID + " .lineAdjustQty").val();
          let tdDepartment = $('#' + lineID + " .lineDepartment").val();

          let tdavailqty = $('#' + lineID + " .lineOrdere").val();
          let tdtransferqty = $('#' + lineID + " .lineUOMQtyShipped").val() || 0;
          let tdInitialTransfer = $('#' + lineID + " .InitTransfer").text()||0;
          if(segsSerialLenght.length == tdtransferqty){
          if (tdproduct != "") {
              //if (tdserialNumber != '') {
                  lineItemObjForm = {
                      type: "TSTELinesFlat",
                      fields: {
                          ProductName: tdproduct || '',
                          AccountName: 'Inventory Asset',
                          TransferQty: parseFloat(tdtransferqty) || 0,
                          ClassNameTo: tdDepartment || defaultDept,
                          TransferSerialnos: tdserialNumber || '',
                          PartBarcode: tdbarcode || '',
                      }
                  };
              //}
              // else {
              //     lineItemObjForm = {
              //         type: "TSTELinesFlat",
              //         fields: {
              //             ProductName: tdproduct || '',
              //             AccountName: 'Inventory Asset',
              //             TransferQty: parseFloat(tdtransferqty) || 0,
              //             ClassNameTo: tdDepartment || defaultDept,
              //             PartBarcode: tdbarcode || '',
              //         }
              //     };
              // }

              //lineItemsForm.push(lineItemObjForm);
              splashLineArray.push(lineItemObjForm);
              isReadyToSave = true;
          }
          }else{
            isReadyToSave = false;
            Bert.alert('<strong>WARNING:</strong> Your serial number scanned quantity does not match your transfer quantity. Please scan in the correct quantity.', 'now-danger');
            DangerSound();
            $('.fullScreenSpin').css('display', 'none');
            event.preventDefault();
            return false;
          }
      });

      let selectAccount = $('#sltAccountName').val();

      let notes = $('#shipcomments').val();
      let reason = $('#txtNotes').val() || '';
      var creationdateTime = new Date($("#dtShipDate").datepicker("getDate"));
      let creationDate = creationdateTime.getFullYear() + "-" + (creationdateTime.getMonth() + 1) + "-" + creationdateTime.getDate();
      var url = FlowRouter.current().path;
      var getso_id = url.split('?id=');
      var currentStock = getso_id[getso_id.length - 1];
      // let uploadedItems = templateObject.uploadedFiles.get();
      var objDetails = '';
      if (getso_id[1]) {
          currentStock = parseInt(currentStock);
          objDetails = {
              type: "TStockTransferEntry",
              fields: {
                  ID: currentStock,
                  AccountName: selectAccount,
                  DateTransferred: creationDate,
                  // AdjustmentOnInStock: true,
                  // AdjustType: "Gen",
                  // Approved: false,
                  CreationDate: creationDate,
                  //Deleted: false,
                  EmployeeName: Session.get('mySessionEmployee'),
                  EnforceUOM: false,
                  //ISEmpty:false,
                  //IsStockTake:false,
                  Lines: splashLineArray,
                  DoProcessonSave: false,
                  Notes: notes,
                  Description: reason,
                  // SalesRef: conNote,
                  TransferFromClassName: transferFrom,
                  Transfertype: "Gen",
                  Shipping: shipVia

              }
          };
      } else {
          objDetails = {
              type: "TStockTransferEntry",
              fields: {
                  AccountName: selectAccount,
                  DateTransferred: creationDate,
                  // AdjustmentOnInStock: true,
                  // AdjustType: "Gen",
                  // Approved: false,
                  CreationDate: creationDate,
                  //Deleted: false,
                  EmployeeName: Session.get('mySessionEmployee'),
                  EnforceUOM: false,
                  //ISEmpty:false,
                  //IsStockTake:false,
                  Lines: splashLineArray,
                  DoProcessonSave: false,
                  Notes: notes,
                  Description: reason,
                  // SalesRef: conNote,
                  TransferFromClassName: transferFrom,
                  Transfertype: "Gen",
                  Shipping: shipVia
              }
          };
      }
      if(isReadyToSave){
      stockTransferService.saveStockTransfer(objDetails).then(function(objDetails) {
          function generatePdfForMail(invoiceId) {
              let file = "Invoice-" + invoiceId + ".pdf"
              return new Promise((resolve, reject) => {
                  let templateObject = Template.instance();
                  let completeTabRecord;
                  let doc = new jsPDF('p', 'pt', 'a4');
                  var source = document.getElementById('html-2-pdfwrapper');
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
                  }
                  resolve(html2pdf().set(opt).from(source).toPdf().output('datauristring'));

              });
          }

          async function addAttachment() {
              let attachment = [];
              let templateObject = Template.instance();

              let invoiceId = objDetails.fields.ID;
              let encodedPdf = await generatePdfForMail(invoiceId);
              // var base64data = reader.result;
              let base64data = encodedPdf.split(',')[1];
              pdfObject = {
                  filename: 'Stock Adjustment-' + invoiceId + '.pdf',
                  content: base64data,
                  encoding: 'base64'
              };
              attachment.push(pdfObject);
              let erpInvoiceId = objDetails.fields.ID;

              let mailFromName = Session.get('vs1companyName');
              let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
              //let customerEmailName = $('#edtCustomerName').val();
              let checkEmailData = $('#edtCustomerEmail').val();
              // let grandtotal = $('#grandTotal').html();
              // let amountDueEmail = $('#totalBalanceDue').html();
              // let emailDueDate = $("#dtDueDate").val();
              // let customerBillingAddress = $('#txabillingAddress').val();
              // let customerTerms = $('#sltTerms').val();

              // let customerSubtotal = $('#subtotal_total').html();
              // let customerTax = $('#subtotal_tax').html();
              // let customerNett = $('#subtotal_nett').html();
              // let customerTotal = $('#grandTotal').html();
              let mailSubject = 'Stock Adjustment ' + erpInvoiceId + ' from ' + mailFromName;
              let mailBody = "Hi " + ",\n\n Here's Stock Adjustment " + erpInvoiceId + " from  " + mailFromName;

              var htmlmailBody = '    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate;mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">' +
                  '        <tr>' +
                  '            <td class="container" style="display: block; margin: 0 auto !important; max-width: 650px; padding: 10px; width: 650px;">' +
                  '                <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 650px; padding: 10px;">' +
                  '                    <table class="main">' +
                  '                        <tr>' +
                  '                            <td class="wrapper">' +
                  '                                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">' +
                  '                                    <tr>' +
                  '                                        <td class="content-block" style="text-align: center; letter-spacing: 2px;">' +
                  '                                            <span class="doc-details" style="color: #999999; font-size: 12px; text-align: center; margin: 0 auto; text-transform: uppercase;">Stock Adjustment No. ' + erpInvoiceId + ' Details</span>' +
                  '                                        </td>' +
                  '                                    </tr>' +
                  '                                    <tr style="height: 16px;"></tr>' +
                  '                                    <tr>' +
                  '                                        <td>' +
                  '                                            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;" />' +
                  '                                        </td>' +
                  '                                    </tr>' +
                  '                                    <tr style="height: 48px;"></tr>' +
                  '                                    <tr>' +
                  '                                        <td class="content-block" style="padding: 16px 32px;">' +
                  '                                            <p style="font-size: 18px;">Hi </p>' +
                  '                                            <p style="font-size: 18px; margin: 34px 0px;">Please find the Stock Transfer attached to this email.</p>' +
                  '                                            <p style="font-size: 18px; margin-bottom: 8px;">Thanks you</p>' +
                  '                                            <p style="font-size: 18px;">' + mailFromName + '</p>' +
                  '                                    <tr>' +
                  '                                        <td class="content-block" style="padding: 16px 32px;">' +
                  '                                            <p style="font-size: 15px; color: #666666;">If you receive an email that seems fraudulent, please check with the business owner before paying.</p>' +
                  '                                        </td>' +
                  '                                    </tr>' +
                  '                                    <tr>' +
                  '                                        <td>' +
                  '                                            <table border="0" cellpadding="0" cellspacing="0" style="box-sizing: border-box; width: 100%;">' +
                  '                                                <tbody>' +
                  '                                                    <tr>' +
                  '                                                        <td align="center">' +
                  '                                                            <table border="0" cellpadding="0" cellspacing="0" style="width: auto;">' +
                  '                                                                <tbody>' +
                  '                                                                    <tr>' +
                  '                                                                        <td> <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%; width: 20%; margin: 0; padding: 12px 25px; display: inline-block;" /> </td>' +
                  '                                                                    </tr>' +
                  '                                                                </tbody>' +
                  '                                                            </table>' +
                  '                                                        </td>' +
                  '                                                    </tr>' +
                  '                                                </tbody>' +
                  '                                            </table>' +
                  '                                        </td>' +
                  '                                    </tr>' +
                  '                                </table>' +
                  '                            </td>' +
                  '                        </tr>' +
                  '                    </table>' +
                  '                    <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">' +
                  '                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">' +
                  '                            <tr>' +
                  '                                <td class="content-block" style="color: #999999; font-size: 12px; text-align: center;">' +
                  '                                    <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Company Inc, 3 Abbey Road, San Francisco CA 90210</span>' +
                  '                                    <br>' +
                  '                                    <a href="#" style="color: #999999; font-size: 12px; text-align: center;">Privacy</a>' +
                  '                                    <a href="#" style="color: #999999; font-size: 12px; text-align: center;">Security</a>' +
                  '                                    <a href="#" style="color: #999999; font-size: 12px; text-align: center;">Terms of Service</a>' +
                  '                                </td>' +
                  '                            </tr>' +
                  '                        </table>' +
                  '                    </div>' +
                  '                </div>' +
                  '            </td>' +
                  '        </tr>' +
                  '    </table>';


              if ($('.chkEmailCopy').is(':checked')) {

                  $('#html-2-pdfwrapper').css('display', 'none');
                  Meteor.call('sendEmail', {
                      from: "" + mailFromName + " <" + mailFrom + ">",
                      to: checkEmailData,
                      subject: mailSubject,
                      text: '',
                      html: htmlmailBody,
                      attachments: attachment
                  }, function(error, result) {
                      if (error && error.error === "error") {
                          FlowRouter.go('/stocktransferlist?success=true');

                      } else {
                          swal({
                              title: 'SUCCESS',
                              text: "Email Sent To Employee: " + checkEmailData + " ",
                              type: 'success',
                              showCancelButton: false,
                              confirmButtonText: 'OK'
                          }).then((result) => {
                              if (result.value) {
                                  FlowRouter.go('/stocktransferlist?success=true');
                              } else if (result.dismiss === 'cancel') {}
                          });

                          $('.fullScreenSpin').css('display', 'none');
                      }
                  });

              } else {
                  FlowRouter.go('/stocktransferlist?success=true');
              };

          }
          addAttachment();
          $('.modal-backdrop').css('display', 'none');

      }).catch(function(err) {
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
          //$('.loginSpinner').css('display','none');
          $('.fullScreenSpin').css('display', 'none');
      });
    }else{
      $('.fullScreenSpin').css('display', 'none');
    }

    },
    'click .btnSave': function(event) {
        if ($('.chkEmailCopy').is(':checked')) {
        $('#html-2-pdfwrapper').css('display', 'block');
        }
        let templateObject = Template.instance();
        //let customername = $('#edtCustomerName').val() || '';
        //let shippingaddress = $('#txaShipingInfo').val() || '';
        let transferFrom = $('#sltDepartment').val() || '';
        let shipVia = $('#shipvia').val() || '';
        let conNote = $('#shipcomments').val() || '';
        let toAccount = $('#sltBankAccountName').val() || '';
        // let department = $('#sltDepartment').val();
        let stockTransferService = new StockTransferService();
        //$('.loginSpinner').css('display','inline-block');
        $('.fullScreenSpin').css('display', 'inline-block');
        var splashLineArray = new Array();
        let lineItemsForm = [];
        let lineItemObjForm = {};
        let isReadyToSave  = false;
        $('#tblStocktransfer > tbody > tr').each(function() {
            var lineID = this.id;
            let tdproduct = $('#' + lineID + " .lineProductName").val();
            let tdproductID = $('#' + lineID + " .lineProductName").attr('productid');
            let tdproductCost = $('#' + lineID + " .lineProductName").attr('productcost');
            let tdbarcode = $('#' + lineID + " .lineProductBarCode").html();
            let tddescription = $('#' + lineID + " .lineDescription").html() || '';
            let tdserialNumber = $('#' + lineID + " .pqa").text();
            var segsSerialLenght = tdserialNumber.split(',');
            // let tdfinalqty = $('#' + lineID + " .lineFinalQty").val();
            // let tdadjustqty = $('#' + lineID + " .lineAdjustQty").val();
            let tdDepartment = $('#' + lineID + " .lineDepartment").val();

            let tdavailqty = $('#' + lineID + " .lineOrdere").val();
            let tdtransferqty = $('#' + lineID + " .lineUOMQtyShipped").val() || 0;
            let tdInitialTransfer = $('#' + lineID + " .InitTransfer").text()||0;
            if(segsSerialLenght.length == tdtransferqty){
            if (tdproduct != "") {
                //if (tdserialNumber != '') {
                    lineItemObjForm = {
                        type: "TSTELinesFlat",
                        fields: {
                            ProductName: tdproduct || '',
                            AccountName: 'Inventory Asset',
                            TransferQty: parseFloat(tdtransferqty) || 0,
                            ClassNameTo: tdDepartment || defaultDept,
                            TransferSerialnos: tdserialNumber || '',
                            PartBarcode: tdbarcode || '',
                        }
                    };
                //}
                // else {
                //     lineItemObjForm = {
                //         type: "TSTELinesFlat",
                //         fields: {
                //             ProductName: tdproduct || '',
                //             AccountName: 'Inventory Asset',
                //             TransferQty: parseFloat(tdtransferqty) || 0,
                //             ClassNameTo: tdDepartment || defaultDept,
                //             PartBarcode: tdbarcode || '',
                //         }
                //     };
                // }

                //lineItemsForm.push(lineItemObjForm);
                splashLineArray.push(lineItemObjForm);
                isReadyToSave = true;
            }
            }else{
              isReadyToSave = false;
              Bert.alert('<strong>WARNING:</strong> Your serial number scanned quantity does not match your transfer quantity. Please scan in the correct quantity.', 'now-danger');
              DangerSound();
              $('.fullScreenSpin').css('display', 'none');
              event.preventDefault();
              return false;
            }
        });

        let selectAccount = $('#sltAccountName').val();

        let notes = $('#shipcomments').val();
        let reason = $('#txtNotes').val() || '';
        var creationdateTime = new Date($("#dtShipDate").datepicker("getDate"));
        let creationDate = creationdateTime.getFullYear() + "-" + (creationdateTime.getMonth() + 1) + "-" + creationdateTime.getDate();
        var url = FlowRouter.current().path;
        var getso_id = url.split('?id=');
        var currentStock = getso_id[getso_id.length - 1];
        // let uploadedItems = templateObject.uploadedFiles.get();
        var objDetails = '';
        if (getso_id[1]) {
            currentStock = parseInt(currentStock);
            objDetails = {
                type: "TStockTransferEntry",
                fields: {
                    ID: currentStock,
                    AccountName: selectAccount,
                    DateTransferred: creationDate,
                    // AdjustmentOnInStock: true,
                    // AdjustType: "Gen",
                    // Approved: false,
                    CreationDate: creationDate,
                    //Deleted: false,
                    EmployeeName: Session.get('mySessionEmployee'),
                    EnforceUOM: false,
                    //ISEmpty:false,
                    //IsStockTake:false,
                    Lines: splashLineArray,
                    DoProcessonSave: false,
                    Notes: notes,
                    Description: reason,
                    // SalesRef: conNote,
                    TransferFromClassName: transferFrom,
                    Transfertype: "Gen",
                    Shipping: shipVia

                }
            };
        } else {
            objDetails = {
                type: "TStockTransferEntry",
                fields: {
                    AccountName: selectAccount,
                    DateTransferred: creationDate,
                    // AdjustmentOnInStock: true,
                    // AdjustType: "Gen",
                    // Approved: false,
                    CreationDate: creationDate,
                    //Deleted: false,
                    EmployeeName: Session.get('mySessionEmployee'),
                    EnforceUOM: false,
                    //ISEmpty:false,
                    //IsStockTake:false,
                    Lines: splashLineArray,
                    DoProcessonSave: false,
                    Notes: notes,
                    Description: reason,
                    // SalesRef: conNote,
                    TransferFromClassName: transferFrom,
                    Transfertype: "Gen",
                    Shipping: shipVia
                }
            };
        }
        if(isReadyToSave){
        stockTransferService.saveStockTransfer(objDetails).then(function(objDetails) {
            function generatePdfForMail(invoiceId) {
                let file = "Invoice-" + invoiceId + ".pdf"
                return new Promise((resolve, reject) => {
                    let templateObject = Template.instance();
                    let completeTabRecord;
                    let doc = new jsPDF('p', 'pt', 'a4');
                    var source = document.getElementById('html-2-pdfwrapper');
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
                    }
                    resolve(html2pdf().set(opt).from(source).toPdf().output('datauristring'));

                });
            }

            async function addAttachment() {
                let attachment = [];
                let templateObject = Template.instance();

                let invoiceId = objDetails.fields.ID;
                let encodedPdf = await generatePdfForMail(invoiceId);
                // var base64data = reader.result;
                let base64data = encodedPdf.split(',')[1];
                pdfObject = {
                    filename: 'Stock Adjustment-' + invoiceId + '.pdf',
                    content: base64data,
                    encoding: 'base64'
                };
                attachment.push(pdfObject);
                let erpInvoiceId = objDetails.fields.ID;

                let mailFromName = Session.get('vs1companyName');
                let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                //let customerEmailName = $('#edtCustomerName').val();
                let checkEmailData = $('#edtCustomerEmail').val();
                // let grandtotal = $('#grandTotal').html();
                // let amountDueEmail = $('#totalBalanceDue').html();
                // let emailDueDate = $("#dtDueDate").val();
                // let customerBillingAddress = $('#txabillingAddress').val();
                // let customerTerms = $('#sltTerms').val();

                // let customerSubtotal = $('#subtotal_total').html();
                // let customerTax = $('#subtotal_tax').html();
                // let customerNett = $('#subtotal_nett').html();
                // let customerTotal = $('#grandTotal').html();
                let mailSubject = 'Stock Adjustment ' + erpInvoiceId + ' from ' + mailFromName;
                let mailBody = "Hi " + ",\n\n Here's Stock Adjustment " + erpInvoiceId + " from  " + mailFromName;

                var htmlmailBody = '    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate;mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">' +
                    '        <tr>' +
                    '            <td class="container" style="display: block; margin: 0 auto !important; max-width: 650px; padding: 10px; width: 650px;">' +
                    '                <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 650px; padding: 10px;">' +
                    '                    <table class="main">' +
                    '                        <tr>' +
                    '                            <td class="wrapper">' +
                    '                                <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">' +
                    '                                    <tr>' +
                    '                                        <td class="content-block" style="text-align: center; letter-spacing: 2px;">' +
                    '                                            <span class="doc-details" style="color: #999999; font-size: 12px; text-align: center; margin: 0 auto; text-transform: uppercase;">Stock Adjustment No. ' + erpInvoiceId + ' Details</span>' +
                    '                                        </td>' +
                    '                                    </tr>' +
                    '                                    <tr style="height: 16px;"></tr>' +
                    '                                    <tr>' +
                    '                                        <td>' +
                    '                                            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;" />' +
                    '                                        </td>' +
                    '                                    </tr>' +
                    '                                    <tr style="height: 48px;"></tr>' +
                    '                                    <tr>' +
                    '                                        <td class="content-block" style="padding: 16px 32px;">' +
                    '                                            <p style="font-size: 18px;">Hi </p>' +
                    '                                            <p style="font-size: 18px; margin: 34px 0px;">Please find the Stock Transfer attached to this email.</p>' +
                    '                                            <p style="font-size: 18px; margin-bottom: 8px;">Thanks you</p>' +
                    '                                            <p style="font-size: 18px;">' + mailFromName + '</p>' +
                    '                                    <tr>' +
                    '                                        <td class="content-block" style="padding: 16px 32px;">' +
                    '                                            <p style="font-size: 15px; color: #666666;">If you receive an email that seems fraudulent, please check with the business owner before paying.</p>' +
                    '                                        </td>' +
                    '                                    </tr>' +
                    '                                    <tr>' +
                    '                                        <td>' +
                    '                                            <table border="0" cellpadding="0" cellspacing="0" style="box-sizing: border-box; width: 100%;">' +
                    '                                                <tbody>' +
                    '                                                    <tr>' +
                    '                                                        <td align="center">' +
                    '                                                            <table border="0" cellpadding="0" cellspacing="0" style="width: auto;">' +
                    '                                                                <tbody>' +
                    '                                                                    <tr>' +
                    '                                                                        <td> <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%; width: 20%; margin: 0; padding: 12px 25px; display: inline-block;" /> </td>' +
                    '                                                                    </tr>' +
                    '                                                                </tbody>' +
                    '                                                            </table>' +
                    '                                                        </td>' +
                    '                                                    </tr>' +
                    '                                                </tbody>' +
                    '                                            </table>' +
                    '                                        </td>' +
                    '                                    </tr>' +
                    '                                </table>' +
                    '                            </td>' +
                    '                        </tr>' +
                    '                    </table>' +
                    '                    <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">' +
                    '                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">' +
                    '                            <tr>' +
                    '                                <td class="content-block" style="color: #999999; font-size: 12px; text-align: center;">' +
                    '                                    <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Company Inc, 3 Abbey Road, San Francisco CA 90210</span>' +
                    '                                    <br>' +
                    '                                    <a href="#" style="color: #999999; font-size: 12px; text-align: center;">Privacy</a>' +
                    '                                    <a href="#" style="color: #999999; font-size: 12px; text-align: center;">Security</a>' +
                    '                                    <a href="#" style="color: #999999; font-size: 12px; text-align: center;">Terms of Service</a>' +
                    '                                </td>' +
                    '                            </tr>' +
                    '                        </table>' +
                    '                    </div>' +
                    '                </div>' +
                    '            </td>' +
                    '        </tr>' +
                    '    </table>';


                if ($('.chkEmailCopy').is(':checked')) {

                    $('#html-2-pdfwrapper').css('display', 'none');
                    Meteor.call('sendEmail', {
                        from: "" + mailFromName + " <" + mailFrom + ">",
                        to: checkEmailData,
                        subject: mailSubject,
                        text: '',
                        html: htmlmailBody,
                        attachments: attachment
                    }, function(error, result) {
                        if (error && error.error === "error") {
                            FlowRouter.go('/stocktransferlist?success=true');

                        } else {
                            swal({
                                title: 'SUCCESS',
                                text: "Email Sent To Employee: " + checkEmailData + " ",
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    FlowRouter.go('/stocktransferlist?success=true');
                                } else if (result.dismiss === 'cancel') {}
                            });

                            $('.fullScreenSpin').css('display', 'none');
                        }
                    });

                } else {
                    FlowRouter.go('/stocktransferlist?success=true');
                };

            }
            addAttachment();
            $('.modal-backdrop').css('display', 'none');

        }).catch(function(err) {
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
            //$('.loginSpinner').css('display','none');
            $('.fullScreenSpin').css('display', 'none');
        });
      }else{
        $('.fullScreenSpin').css('display', 'none');
      }

    },
    'click .btnDeleteStock': function(event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let stockTransferService = new StockTransferService();
        var url = FlowRouter.current().path;
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length - 1];
        var objDetails = '';
        if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            var objDetails = {
                type: "TStockTransferEntry",
                fields: {
                    ID: currentInvoice,
                    Deleted: true
                }
            };

            stockTransferService.saveStockTransfer(objDetails).then(function(objDetails) {
                FlowRouter.go('/stocktransferlist?success=true');
                $('.modal-backdrop').css('display', 'none');
            }).catch(function(err) {
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
            FlowRouter.go('/stocktransferlist?success=true');
            $('.modal-backdrop').css('display', 'none');
        }
        $('#deleteLineModal').modal('toggle');
    },
    'click .btnDeleteStockTransfer': function(event) {
        let templateObject = Template.instance();
        let stockTransferService = new StockTransferService();
        swal({
            title: 'Delete Stock Transfer',
            text: "Are you sure you want to Delete Stock Transfer?",
            type: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                $('.fullScreenSpin').css('display', 'inline-block');
                var url = FlowRouter.current().path;
                var getso_id = url.split('?id=');
                var currentInvoice = getso_id[getso_id.length - 1];
                var objDetails = '';
                if (getso_id[1]) {
                    currentInvoice = parseInt(currentInvoice);
                    var objDetails = {
                        type: "TStockTransferEntry",
                        fields: {
                            ID: currentInvoice,
                            Deleted: true
                        }
                    };

                    stockTransferService.saveStockTransfer(objDetails).then(function(objDetails) {
                        FlowRouter.go('/stocktransferlist?success=true');
                        $('.modal-backdrop').css('display', 'none');

                    }).catch(function(err) {
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
                    FlowRouter.go('/stocktransferlist?success=true');
                    $('.modal-backdrop').css('display', 'none');
                }
                //$('#deleteLineModal').modal('toggle');
            } else {}
        });

    },
    'click .btnDeleteLine': function(event) {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let selectLineID = $('#selectDeleteLineID').val();
        if ($('#tblStocktransfer tbody>tr').length > 1) {
            this.click;

            $('#' + selectLineID).closest('tr').remove();
            //event.preventDefault();
            let $tblrows = $("#tblStocktransfer tbody tr");
            //if(selectLineID){
            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;
            //return false;

        } else {
            this.click;
            // $(event.target).closest('tr').remove();
            $('#' + selectLineID + " .lineProductName").val('');
            $('#' + selectLineID + " .lineDescription").text('');
            $('#' + selectLineID + " .lineProductBarCode").text('');
            $('#' + selectLineID + " .lineInStockQty").text('');
            $('#' + selectLineID + " .lineDepartment").val('');
            $('#' + selectLineID + " .ID").text('');
            $('#' + selectLineID + " .pqa").text('');
            $('#' + selectLineID + " .lineID").text('');
            $('#' + selectLineID + " .lineProductBarCode").text('');
            $('#' + selectLineID + " .UOMQtyBackOrder").text('');
            $('#' + selectLineID + " .ProductID").text('');
            $('#' + selectLineID + " .lineOrdered").val('');
            $('#' + selectLineID + " .lineUOMQtyShipped").val('');

            //event.preventDefault();

        }

        $('#deleteLineModal').modal('toggle');
    },
    'click .removebutton': function(event) {
        let templateObject = Template.instance();
        var clicktimes = 0;
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectDeleteLineID').val(targetID);

        times++;
        if (times == 1) {
            $('#deleteLineModal').modal('toggle');
        } else {
            if ($('#tblStocktransfer tbody>tr').length > 1) {
                this.click;
                $(event.target).closest('tr').remove();
                event.preventDefault();
                return false;

            } else {
                $('#deleteLineModal').modal('toggle');
            }

        }
    },
    'click #tdBarcodeScannerMobile': function(event) {
        setTimeout(function() {
            document.getElementById("scanBarcodeModalInput").focus();
        }, 500);
    },
    'click #scanNewRowMobile': function(event) {
        setTimeout(function() {
            document.getElementById("scanBarcodeModalInput").focus();
        }, 500);
    }
});

Template.stocktransfercard.helpers({
    isPrintInvoice: () => {
        return Template.instance().includeIsPrintInvoice.get();
    },
    isPrintDeliveryDocket: () => {
        return Template.instance().includeIsPrintDocket.get();
    },
    includeBothPrint: () => {
        return Template.instance().includeBothPrint.get();
    },
    hasPrintPrint: () => {
        return Template.instance().hasPrintPrint.get();
    },
    stocktransferrecord: () => {
        return Template.instance().stocktransferrecord.get();
    },
    shipviarecords: () => {
        return Template.instance().shipviarecords.get().sort(function(a, b) {
            if (a.shippingmethod == 'NA') {
                return 1;
            } else if (b.shippingmethod == 'NA') {
                return -1;
            }
            return (a.shippingmethod.toUpperCase() > b.shippingmethod.toUpperCase()) ? 1 : -1;
        });
    },
    availableserialnumberlist: () => {
        return Template.instance().availableserialnumberlist.get();
    },
    showSerial: () => {
        return Session.get('CloudShowSerial') || false;
    },
    availableserialnumberqty: () => {
        let availaLegnt = false;
        if (parseInt(Template.instance().availableserialnumberqty.get()) > 5) {
            availaLegnt = true;
        }
        return availaLegnt;
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
    companyabn: () => {
        return Session.get('vs1companyABN');
    },
    organizationname: () => {
        return Session.get('vs1companyName');
    },
    organizationurl: () => {
        return Session.get('vs1companyURL');
    },
});
