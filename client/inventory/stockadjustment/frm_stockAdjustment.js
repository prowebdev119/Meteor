import { StockTransferService } from "../stockadjust-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import { UtilityService } from "../../utility-service";
import { ProductService } from "../../product/product-service";
import '../../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import {AccountService} from "../../accounts/account-service";
import { Random } from 'meteor/random';
import { jsPDF } from 'jspdf';
import 'jQuery.print/jQuery.print.js';
import { autoTable } from 'jspdf-autotable';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.stockadjustmentcard.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.deptrecords = new ReactiveVar();
    templateObject.accountnamerecords = new ReactiveVar();
    templateObject.record = new ReactiveVar({});
    /* Attachments */
    templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();
    templateObject.record = new ReactiveVar({});

    templateObject.productquantityrecord = new ReactiveVar([]);

    setTimeout(function () {

        var x = window.matchMedia("(max-width: 1024px)")

        function mediaQuery(x) {
            if (x.matches) {

                $("#colToAccount").removeClass("col-2");
                $("#colToAccount").addClass("col-4");
                $("#colDepartment").removeClass("col-2");
                $("#colDepartment").addClass("col-4");
                $("#colDate").removeClass("col-2");
                $("#colDate").addClass("col-4");
            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 10);

    setTimeout(function () {

        var x = window.matchMedia("(max-width: 420px)")

        function mediaQuery(x) {
            if (x.matches) {

                $("#colToAccount").removeClass("col-2");
                $("#colToAccount").addClass("col-12");
                $("#colToAccount").addClass("marginright16");
                $("#colDepartment").removeClass("col-2");
                $("#colDepartment").addClass("col-12");
                $("#colDepartment").addClass("marginright16");
                $("#colDate").removeClass("col-2");
                $("#colDate").addClass("col-12");
                $("#colDate").addClass("marginright16");
            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 10);

});
Template.stockadjustmentcard.onRendered(() => {
    let imageData = (localStorage.getItem("Image"));
    if (imageData) {
        $('.uploadedImage').attr('src', imageData);
    };
    const templateObject = Template.instance();
    const records = [];
    let stockTransferService = new StockTransferService();

    const deptrecords = [];
    const accountnamerecords = [];
    //dd M yy
    $("#date-input,#dtCreationDate,#dtDueDate").datepicker({
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

    $('.fullScreenSpin').css('display', 'inline-block');

    templateObject.getDepartments = function () {
        getVS1Data('TDeptClass').then(function (dataObject) {
            if (dataObject.length == 0) {
                stockTransferService.getDepartment().then(function (data) {
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
            stockTransferService.getDepartment().then(function (data) {
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

    templateObject.getAccountNames = function () {
        getVS1Data('TAccountVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                stockTransferService.getAccountNameVS1().then(function (data) {
                    for (let i in data.taccountvs1) {

                        let accountnamerecordObj = {
                            accountname: data.taccountvs1[i].AccountName || ' '
                        };
                        // $('#edtBankAccountName').editableSelect('add',data.taccount[i].AccountName);
                        accountnamerecords.push(accountnamerecordObj);
                        templateObject.accountnamerecords.set(accountnamerecords);

                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.taccountvs1;
                for (let i in useData) {

                    let accountnamerecordObj = {
                        accountname: useData[i].fields.AccountName || ' '
                    };
                    // $('#edtBankAccountName').editableSelect('add',data.taccount[i].AccountName);
                    accountnamerecords.push(accountnamerecordObj);
                    templateObject.accountnamerecords.set(accountnamerecords);

                }

            }
        }).catch(function (err) {
            stockTransferService.getAccountNameVS1().then(function (data) {
                for (let i in data.taccountvs1) {

                    let accountnamerecordObj = {
                        accountname: data.taccountvs1[i].AccountName || ' '
                    };
                    // $('#edtBankAccountName').editableSelect('add',data.taccount[i].AccountName);
                    accountnamerecords.push(accountnamerecordObj);
                    templateObject.accountnamerecords.set(accountnamerecords);

                }
            });
        });

    }

    templateObject.getDepartments();
    templateObject.getAccountNames();
    stockTransferService.getProductClassQuantitys().then(function (dataProductQty) {
        templateObject.productquantityrecord.set(dataProductQty);
    });

    templateObject.getProductQty = function (id, productname, departmentData) {
        let totalAvailQty = 0;
        let totalInStockQty = 0;
        let deptName = departmentData;
        let dataValue = templateObject.productquantityrecord.get();
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

            $('#' + id + " .lineInStockQty").text(totalInStockQty);
            // $('#'+id+" .lineDescription").text(lineProductDesc);
            $('#' + id + " .lineFinalQty").val(totalInStockQty);
            $('#' + id + " .lineAdjustQty").val(0);
            $('.stock_print #' + id + " .lineInStockQtyPrint").text(totalInStockQty);
            $('.stock_print #' + id + " .lineFinalQtyPrint").text(totalInStockQty);
            $('.stock_print #' + id + " .lineAdjustQtyPrint").text(0);

        } else {
            stockTransferService.getProductClassQuantitys().then(function (data) {
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

                $('#' + id + " .lineInStockQty").text(totalInStockQty);
                // $('#'+id+" .lineDescription").text(lineProductDesc);
                $('#' + id + " .lineFinalQty").val(totalInStockQty);
                $('#' + id + " .lineAdjustQty").val(0);
                $('.stock_print #' + id + " .lineInStockQtyPrint").text(totalInStockQty);
                $('.stock_print #' + id + " .lineFinalQtyPrint").text(totalInStockQty);
                $('.stock_print #' + id + " .lineAdjustQtyPrint").text(0);

            });
        }

    };

    var url = FlowRouter.current().path;
    var getso_id = url.split('?id=');
    var currentStockAdjust = getso_id[getso_id.length - 1];
    if (getso_id[1]) {
        currentStockAdjust = parseInt(currentStockAdjust);
        templateObject.getStockAdjustData = function () {
            //getOneQuotedata

            getVS1Data('TStockAdjustEntry').then(function (dataObject) {
                let productcost = 0;
                if (dataObject.length == 0) {
                    stockTransferService.getOneStockAdjustData(currentStockAdjust).then(function (data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];
                        let lineItemObj = {};
                        let lineItemsTable = [];
                        let lineItemTableObj = {};
                        if(data.fields.Lines != null){
                        if (data.fields.Lines.length) {
                            for (let i = 0; i < data.fields.Lines.length; i++) {
                                productcost = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].Amount).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                lineItemObj = {
                                    lineID: Random.id(),
                                    id: data.fields.Lines[i].fields.ID || '',
                                    productname: data.fields.Lines[i].fields.ProductName || '',
                                    productid: data.fields.Lines[i].fields.ProductID || '',
                                    productcost: productcost,
                                    productbarcode: data.fields.Lines[i].fields.PartBarcode || '',
                                    description: data.fields.Lines[i].fields.Description || '',
                                    department: data.fields.Lines[i].fields.DeptName || defaultDept,
                                    qtyinstock: data.fields.Lines[i].fields.InStockQty || 0,
                                    finalqty: data.fields.Lines[i].fields.FinalUOMQty || 0,
                                    adjustqty: data.fields.Lines[i].fields.AdjustQty || 0

                                };

                                lineItems.push(lineItemObj);
                            }
                        }
                        }

                        let record = {
                            id: data.fields.ID,
                            lid: 'Edit Stock Adjustment' + ' ' + data.fields.ID,
                            LineItems: lineItems,
                            accountname: data.fields.AccountName,
                            department: data.fields.Lines[0].fields.DeptName || defaultDept,
                            notes: data.fields.Notes,
                            balancedate: data.fields.AdjustmentDate ? moment(data.fields.AdjustmentDate).format('DD/MM/YYYY') : ""
                        };

                        let getDepartmentVal = data.fields.Lines[0].fields.DeptName || defaultDept;

                        setTimeout(function () {
                            // $('#sltDepartment').val(getDepartmentVal);
                            $('#sltAccountName').val(data.fields.AccountName);
                        }, 200);

                        if (data.fields.IsProcessed == true) {
                            $('.colProcessed').css('display', 'block');
                            $("#form :input").prop("disabled", true);
                            $(".btnDeleteStock").prop("disabled", false);
                            $(".btnDeleteStockAdjust").prop("disabled", false);
                            $(".printConfirm").prop("disabled", false);
                            $(".btnBack").prop("disabled", false);
                            $(".btnDeleteProduct").prop("disabled", false);
                        }

                        templateObject.record.set(record);

                        if (templateObject.record.get()) {

                            // $('#tblStockAdjustmentLine').colResizable({
                            //   liveDrag:true});
                            //$('#tblStockAdjustmentLine').removeClass('JColResizer');

                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblStockAdjustmentLine', function (error, result) {
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
                        setTimeout(function () {
                            $(".btnRemove").prop("disabled", true);
                        }, 1000);
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
                        // Meteor._reload.reload();
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tstockadjustentry;
                    var added = false;
                    for (let d = 0; d < useData.length; d++) {
                        if (parseInt(useData[d].fields.ID) === currentStockAdjust) {
                            added = true;
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let lineItemObj = {};
                            let lineItemsTable = [];
                            let lineItemTableObj = {};

                            if (useData[d].fields.Lines.length) {
                                for (let i = 0; i < useData[d].fields.Lines.length; i++) {
                                    productcost = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.Cost).toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    lineItemObj = {
                                        lineID: Random.id(),
                                        id: useData[d].fields.Lines[i].fields.ID || '',
                                        productname: useData[d].fields.Lines[i].fields.ProductName || '',
                                        productid: useData[d].fields.Lines[i].fields.ProductID || '',
                                        productcost: productcost,
                                        productbarcode: useData[d].fields.Lines[i].fields.PartBarcode || '',
                                        description: useData[d].fields.Lines[i].fields.Description || '',
                                        department: useData[d].fields.Lines[0].fields.DeptName || defaultDept,
                                        qtyinstock: useData[d].fields.Lines[i].fields.InStockQty || 0,
                                        finalqty: useData[d].fields.Lines[i].fields.FinalUOMQty || 0,
                                        adjustqty: useData[d].fields.Lines[i].fields.AdjustQty || 0

                                    };

                                    lineItems.push(lineItemObj);
                                }
                            } else {
                                lineItemObj = {
                                    lineID: Random.id(),
                                    id: useData[d].fields.Lines.fields.ID || '',
                                    productname: useData[d].fields.Lines.fields.ProductName || '',
                                    productid: useData[d].fields.Lines.fields.ProductID || '',
                                    productcost: useData[d].fields.Lines.fields.Cost || 0,
                                    productbarcode: useData[d].fields.Lines.fields.PartBarcode || '',
                                    description: useData[d].fields.Lines.fields.Description || '',
                                    department: useData[d].fields.Lines.fields.DeptName || defaultDept,
                                    qtyinstock: useData[d].fields.Lines.fields.InStockQty || 0,
                                    finalqty: useData[d].fields.Lines.fields.FinalUOMQty || 0,
                                    adjustqty: useData[d].fields.Lines.fields.AdjustQty || 0

                                };

                                lineItems.push(lineItemObj);
                            }

                            let record = {
                                id: useData[d].fields.ID,
                                lid: 'Edit Stock Adjustment' + ' ' + useData[d].fields.ID,
                                LineItems: lineItems,
                                accountname: useData[d].fields.AccountName,
                                department: useData[d].fields.Lines[0].fields.DeptName || defaultDept,
                                notes: useData[d].fields.Notes,
                                balancedate: useData[d].fields.AdjustmentDate ? moment(useData[d].fields.AdjustmentDate).format('DD/MM/YYYY') : ""
                            };

                            let getDepartmentVal = useData[d].fields.Lines[0].fields.DeptName || defaultDept;

                            setTimeout(function () {
                                // $('#sltDepartment').val(getDepartmentVal);
                                $('#sltAccountName').val(useData[d].fields.AccountName);
                            }, 200);

                            //
                            // $("#form :input").prop("disabled", true);
                            // $(".btnDeleteStock").prop("disabled", false);
                            // $(".btnDeleteStockAdjust").prop("disabled", false);
                            // $(".printConfirm").prop("disabled", false);
                            // $(".btnBack").prop("disabled", false);

                            if (useData[d].fields.IsProcessed == true) {
                                $('.colProcessed').css('display', 'block');
                                $("#form :input").prop("disabled", true);
                                $(".btnDeleteStock").prop("disabled", false);
                                $(".btnDeleteStockAdjust").prop("disabled", false);
                                $(".printConfirm").prop("disabled", false);
                                $(".btnBack").prop("disabled", false);
                                $(".btnDeleteProduct").prop("disabled", false);
                            }

                            templateObject.record.set(record);
                            $(".btnDeleteLine").prop("disabled", false);
                            $(".btnDeleteProduct").prop("disabled", false);
                            $(".close").prop("disabled", false);
                            if (templateObject.record.get()) {
                                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblStockAdjustmentLine', function (error, result) {
                                    if (error) {}
                                    else {
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
                            setTimeout(function () {
                                $(".btnRemove").prop("disabled", true);
                            }, 1000);

                        }

                    }
                    if (!added) {}
                    //here
                }
            }).catch(function (err) {

                stockTransferService.getOneStockAdjustData(currentStockAdjust).then(function (data) {
                    $('.fullScreenSpin').css('display', 'none');
                    let lineItems = [];
                    let lineItemObj = {};
                    let lineItemsTable = [];
                    let lineItemTableObj = {};
                    if(data.fields.Lines != null){
                    if (data.fields.Lines.length) {
                        for (let i = 0; i < data.fields.Lines.length; i++) {
                            productcost = utilityService.modifynegativeCurrencyFormat(data.tstatementforcustomer[i].Amount).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            lineItemObj = {
                                lineID: Random.id(),
                                id: data.fields.Lines[i].fields.ID || '',
                                productname: data.fields.Lines[i].fields.ProductName || '',
                                productid: data.fields.Lines[i].fields.ProductID || '',
                                productcost: productcost,
                                productbarcode: data.fields.Lines[i].fields.PartBarcode || '',
                                description: data.fields.Lines[i].fields.Description || '',
                                department: data.fields.Lines[i].fields.DeptName || defaultDept,
                                qtyinstock: data.fields.Lines[i].fields.InStockQty || 0,
                                finalqty: data.fields.Lines[i].fields.FinalUOMQty || 0,
                                adjustqty: data.fields.Lines[i].fields.AdjustQty || 0

                            };

                            lineItems.push(lineItemObj);
                        }
                    }
                  }
                    let record = {
                        id: data.fields.ID,
                        lid: 'Edit Stock Adjustment' + ' ' + data.fields.ID,
                        LineItems: lineItems,
                        accountname: data.fields.AccountName,
                        department: data.fields.Lines[0].fields.DeptName || defaultDept,
                        notes: data.fields.Notes,
                        balancedate: data.fields.AdjustmentDate ? moment(data.fields.AdjustmentDate).format('DD/MM/YYYY') : ""
                    };

                    let getDepartmentVal = data.fields.Lines[0].fields.DeptName || defaultDept;

                    setTimeout(function () {
                        // $('#sltDepartment').val(getDepartmentVal);
                        $('#sltAccountName').val(data.fields.AccountName);
                    }, 200);

                    if (data.fields.IsProcessed == true) {
                        $('.colProcessed').css('display', 'block');
                        $("#form :input").prop("disabled", true);
                        $(".btnDeleteStock").prop("disabled", false);
                        $(".btnDeleteStockAdjust").prop("disabled", false);
                        $(".printConfirm").prop("disabled", false);
                        $(".btnBack").prop("disabled", false);
                        $(".btnDeleteProduct").prop("disabled", false);
                    }

                    templateObject.record.set(record);

                    if (templateObject.record.get()) {

                        // $('#tblStockAdjustmentLine').colResizable({
                        //   liveDrag:true});
                        //$('#tblStockAdjustmentLine').removeClass('JColResizer');


                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblStockAdjustmentLine', function (error, result) {
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
                    // Meteor._reload.reload();
                });
            });

        };

        templateObject.getStockAdjustData();
    } else {
        $('.fullScreenSpin').css('display', 'none');
        $('.colProcessed').css('display', 'none');
        $('#edtCustomerEmail').val(localStorage.getItem('mySession'));
        let lineItems = [];
        let lineItemsTable = [];
        let lineItemObj = {};
        let productcost = utilityService.modifynegativeCurrencyFormat(0).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
        lineItemObj = {
            lineID: Random.id(),
            productname: '',
            productbarcode: '',
            productcost:productcost,
            description: '',
            department: defaultDept || '',
            qtyinstock: 0,
            finalqty: 0,
            adjustqty: 0
        };

        var dataListTable = [
            ' ' || '',
            ' ' || '',
            ' ' || '',
            0 || 0,
            0 || 0,
            0 || 0,
            '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
        ];
        lineItemsTable.push(dataListTable);
        lineItems.push(lineItemObj);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        let record = {
            id: '',
            lid: 'New Stock Adjustment',
            accountname: 'Stock Adjustment',
            department: defaultDept,
            balancedate: begunDate,
            LineItems: lineItems,
            notes: ''
        };

        setTimeout(function () {
            // $('#sltDepartment').val(defaultDept);
            $('#sltAccountName').val('Stock Adjustment');
        }, 200);

        // $('#edtCustomerName').val('');

        templateObject.record.set(record);
        if (templateObject.record.get()) {
            // $('#tblStockAdjustmentLine').colResizable({liveDrag:true});
            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblStockAdjustmentLine', function (error, result) {
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

    if (FlowRouter.current().queryParams.id) {
    } else {
        setTimeout(function() {
            $('#tblStockAdjustmentLine .lineProductName').trigger("click");
        }, 200);
    }

    /* On clik Inventory Line */
    $(document).on("click", "#tblInventory tbody tr", function (e) {
        let selectLineID = $('#selectLineID').val();

        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblStockAdjustmentLine tbody tr");
        //var data = table.row( this ).data();
        if (selectLineID) {
            // $(event.target).closest('tr').attr('id');
            let lineProductID = table.closest('tr').attr('id');
            let lineProductName = table.find(".productName").text();
            let lineProductDesc = table.find(".productDesc").text();
            let lineUnitPrice = table.find(".salePrice").text();
            let lineTaxRate = table.find(".taxrate").text();
            let lineProdCost = table.find(".costPrice").text();
            let lineBarcode = table.find(".colBarcode").text();
            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;

            $('.stock_print #' + selectLineID + " .lineProductNamePrint").text(lineProductName);
            $('#' + selectLineID + " .lineProductName").val(lineProductName);
            $('#' + selectLineID + " .lineProductName").attr('productid', lineProductID);
            $('#' + selectLineID + " .lineProductName").attr('productcost', lineProdCost);
            $('#' + selectLineID + " .lineDescription").text(lineProductDesc);
            $('#' + selectLineID + " .lineProductBarCode").text(lineBarcode);
            let lineDepartmentVal = $('#' + selectLineID + " .lineDepartment").val() || defaultDept;
            // $('#'+selectLineID+" .lineQty").text(1);
            // $('#'+selectLineID+" .lineUnitPrice").text(lineUnitPrice);
            // $('#'+selectLineID+" .lineTaxCode").text(lineTaxRate);
            templateObject.getProductQty(selectLineID, lineProductName, lineDepartmentVal);

            $('#productListModal').modal('toggle');

        }
    });

    exportSalesToPdf = function () {
        let margins = {
            top: 0,
            bottom: 0,
            left: 0,
            width: 100
        };
        let id = $('.printID').attr("id");
        var source = document.getElementById('html-2-pdfwrapper');
        let file = "Stock Adjustment.pdf";
        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            file = 'Stock Adjustment-' + id + '.pdf';
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
        html2pdf().set(opt).from(source).save().then(function (dataObject) {
            $('.fullScreenSpin').css('display', 'none');
            $('#html-2-pdfwrapper').css('display', 'none');
        });

    };

    let table;
    $(document).ready(function () {
        $('#tblEmployeelist tbody').on('click', 'tr', function (event) {
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

        $("#edtCustomerEmail").on('dblclick', function (e) {
            $('#employeeList').modal('show');
        });
        $('#sltAccountName').editableSelect();
        $('#addRow').on('click', function () {
            var rowData = $('#tblStockAdjustmentLine tbody>tr:last').clone(true);
            var rowData1 = $('.stock_print tbody>tr:last').clone(true);
            let tokenid = Random.id();
            $(".lineProductName", rowData).val("");
            $(".lineProductBarCode", rowData).text("");
            $(".lineDescription", rowData).text("");
            $(".lineInStockQty", rowData).text("");
            $(".lineFinalQty", rowData).val("");
            $(".lineAdjustQty", rowData).val("");
            // $(".lineAmt", rowData).text("");
            rowData.attr('id', tokenid);
            $("#tblStockAdjustmentLine tbody").append(rowData);

            //Print table
            $(".lineProductNamePrint", rowData1).text("");
            $(".lineProductBarCodePrint", rowData1).text("");
            $(".lineDescriptionPrint", rowData1).text("");
            $(".lineInStockQtyPrint", rowData1).text("");
            $(".lineFinalQtyPrint", rowData1).text("");
            $(".lineAdjustQtyPrint", rowData1).text("");
            // $(".lineAmt", rowData).text("");
            rowData1.attr('id', tokenid);
            $(".stock_print tbody").append(rowData1);

            setTimeout(function () {
                $('#' + tokenid + " .lineProductName").trigger('click');
            }, 200);
        });

        $('#scanNewRowMobile').on('click', function () {
            var rowData = $('#tblStockAdjustmentLine tbody>tr:last').clone(true);
            var rowData1 = $('.stock_print tbody>tr:last').clone(true);
            let tokenid = Random.id();
            $(".lineProductName", rowData).val("");
            $(".lineProductBarCode", rowData).text("");
            $(".lineDescription", rowData).text("");
            $(".lineInStockQty", rowData).text("");
            $(".lineFinalQty", rowData).val("");
            $(".lineAdjustQty", rowData).val("");
            // $(".lineAmt", rowData).text("");
            rowData.attr('id', tokenid);
            $("#tblStockAdjustmentLine tbody").append(rowData);

            //Print table
            $(".lineProductNamePrint", rowData1).text("");
            $(".lineProductBarCodePrint", rowData1).text("");
            $(".lineDescriptionPrint", rowData1).text("");
            $(".lineInStockQtyPrint", rowData1).text("");
            $(".lineFinalQtyPrint", rowData1).text("");
            $(".lineAdjustQtyPrint", rowData1).text("");
            // $(".lineAmt", rowData).text("");
            rowData1.attr('id', tokenid);
            $(".stock_print tbody").append(rowData1);

            // setTimeout(function () {
            //     $('#' + tokenid + " .lineProductName").trigger('click');
            // }, 200);
        });


    });

    $(document).on("click", "#departmentList tbody tr", function (e) {
        // let templateObject = Template.instance();
        // let $tblrows = $("#tblStockAdjustmentLine tbody tr");
        let departmentData = $(this).find(".colDeptName").text() || '';
        let selectLineID = $('#selectLineID').val();
        if (selectLineID) {
            $('#' + selectLineID + " .lineDepartment").val(departmentData);

            let productname = $('#' + selectLineID + " .lineProductName").val() || '';
            templateObject.getProductQty(selectLineID, productname, departmentData);
        }
        $('#departmentModal').modal('toggle');

    });

    $('#sltAccountName').editableSelect().on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        let accountService = new AccountService();
        const accountTypeList = [];
        var accountDataName = e.target.value || '';

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $('#selectLineID').val('');
            $('#accountListModal').modal();
            setTimeout(function () {
                $('#tblAccount_filter .form-control-sm').focus();
                $('#tblAccount_filter .form-control-sm').val('');
                $('#tblAccount_filter .form-control-sm').trigger("input");
                var datatable = $('#tblAccountlist').DataTable();
                datatable.draw();
                $('#tblAccountlist_filter .form-control-sm').trigger("input");
            }, 500);
        } else {
            if (accountDataName.replace(/\s/g, '') != '') {
                getVS1Data('TAccountVS1').then(function (dataObject) {
                    if (dataObject.length == 0) {
                        accountService.getOneAccountByName(accountDataName).then(function (data) {
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

                            setTimeout(function () {
                                $('#addNewAccount').modal('show');
                            }, 500);

                        }).catch(function (err) {
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

                                setTimeout(function () {
                                    $('#addNewAccount').modal('show');
                                }, 500);

                            }
                        }
                        if (!added) {
                            accountService.getOneAccountByName(accountDataName).then(function (data) {
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

                                setTimeout(function () {
                                    $('#addNewAccount').modal('show');
                                }, 500);

                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }

                    }
                }).catch(function (err) {
                    accountService.getOneAccountByName(accountDataName).then(function (data) {
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

                        setTimeout(function () {
                            $('#addNewAccount').modal('show');
                        }, 500);

                    }).catch(function (err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });

                });
                $('#addAccountModal').modal('toggle');
            } else {
                $('#selectLineID').val('');
                $('#accountListModal').modal();
                setTimeout(function () {
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

    $(document).on("click", "#tblAccount tbody tr", function (e) {
        //$(".colProductName").removeClass('boldtablealertsborder');
        let selectLineID = $('#selectLineID').val();
        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblStockAdjustmentLine tbody tr");

        let accountname = table.find(".productName").text();
        $('#accountListModal').modal('toggle');
        $('#sltAccountName').val(accountname);
        if ($tblrows.find(".lineProductName").val() == '') {
            //$tblrows.find(".colProductName").addClass('boldtablealertsborder');
        }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
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
        $('#scanBarcode').modal('toggle');
        if (barcodeScanner != '') {

            // setTimeout(function() {
            //     $('#tblSearchOverview_filter .form-control-sm').val(barcodeScanner);
            // }, 200);
            // templateObject.getAllGlobalSearch(barcodeScanner);
        }
    }

});
Template.stockadjustmentcard.helpers({
    record: () => {
        return Template.instance().record.get();
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
    accountnamerecords: () => {
        return Template.instance().accountnamerecords.get().sort(function (a, b) {
            if (a.accountname == 'NA') {
                return 1;
            } else if (b.accountname == 'NA') {
                return -1;
            }
            return (a.accountname.toUpperCase() > b.accountname.toUpperCase()) ? 1 : -1;
        });
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'stockadjustmentcard'
        });
    },
    salesCloudGridPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblStockAdjustmentLine'
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
    productcost: () => {
        return Session.get('CloudProductCost');
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
    isMobileDevices: () => {
        var isMobile = false; //initiate as false
        // device detection
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
             || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }

        return isMobile;
    }
});

Template.stockadjustmentcard.events({
    'click .lineDepartment, keydown .lineDepartment': function (event) {
        var $earch = $(event.currentTarget);
        var offset = $earch.offset();
        let customername = $('#sltAccountName').val();
        if (customername === '') {
            swal('Account has not been selected!', '', 'warning');
            event.preventDefault();
        } else {
            var departmentDataName = $(event.target).val() || '';
            if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
                $('#departmentModal').modal('toggle');
                var targetID = $(event.target).closest('tr').attr('id');
                $('#selectLineID').val(targetID);
                setTimeout(function () {
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

                    getVS1Data('TDeptClass').then(function (dataObject) {
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getDepartment().then(function (data) {
                                for (let i = 0; i < data.tdeptclass.length; i++) {
                                    if (data.tdeptclass[i].DeptClassName === departmentDataName) {
                                        $('#edtDepartmentID').val(data.tdeptclass[i].Id);
                                        $('#edtNewDeptName').val(data.tdeptclass[i].DeptClassName);
                                        $('#edtSiteCode').val(data.tdeptclass[i].SiteCode);
                                        $('#edtDeptDesc').val(data.tdeptclass[i].Description);
                                    }
                                }
                                setTimeout(function () {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newDepartmentModal').modal('toggle');
                                }, 200);
                            }).catch(function (err) {
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
                            setTimeout(function () {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newDepartmentModal').modal('toggle');
                            }, 200);
                        }
                    }).catch(function (err) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getDepartment().then(function (data) {
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                if (data.tdeptclass[i].DeptClassName === departmentDataName) {
                                    $('#edtDepartmentID').val(data.tdeptclass[i].Id);
                                    $('#edtNewDeptName').val(data.tdeptclass[i].DeptClassName);
                                    $('#edtSiteCode').val(data.tdeptclass[i].SiteCode);
                                    $('#edtDeptDesc').val(data.tdeptclass[i].Description);
                                }
                            }
                            setTimeout(function () {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newDepartmentModal').modal('toggle');
                            }, 200);
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    });
                } else {
                    $('#departmentModal').modal('toggle');
                    var targetID = $(event.target).closest('tr').attr('id');
                    $('#selectLineID').val(targetID);
                    setTimeout(function () {
                        $('#departmentList_filter .form-control-sm').focus();
                        $('#departmentList_filter .form-control-sm').val('');
                        $('#departmentList_filter .form-control-sm').trigger("input");

                        var datatable = $('#departmentList').DataTable();
                        datatable.draw();
                        $('#departmentList_filter .form-control-sm').trigger("input");

                    }, 500);
                }

            }
        }
    },
    'change #sltDepartment': function (event) {
        let templateObject = Template.instance();
        let totalAvailQty = 0;
        let totalInStockQty = 0;
        let deptName = $('#sltDepartment').val();
        //let dataValue = templateObject.productquantityrecord.get();
        let $tblrows = $("#tblStockAdjustmentLine tbody tr");
        $tblrows.each(function (index) {
            var $tblrow = $(this);
            let productname = $tblrow.find(".colProductName").text() || '';
            let selectLineID = $tblrow.closest('tr').attr('id');
            templateObject.getProductQty(selectLineID, productname);

        });
    },
    'change .lineProductCost': function (event) {
        let inputProductCost = 0;
        if (!isNaN($(event.target).val())) {
            inputProductCost = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputProductCost));
        } else {
            inputProductCost = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputProductCost));

        }
    },
    'blur .lineQty': function (event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        let $tblrows = $("#tblStockAdjustmentLine tbody tr");
        //if(selectLineID){
        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;

        $tblrows.each(function (index) {
            var $tblrow = $(this);
            var qty = $tblrow.find(".lineQty").text() || 0;
            var price = $tblrow.find(".lineUnitPrice").text() || 0;
            var taxcode = $tblrow.find(".lineTaxRate").text() || 0;

            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate;
                    }
                }
            }

            var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
            var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
            if (!isNaN(subTotal)) {
                $tblrow.find('.lineAmt').text(Currency + '' + subTotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    }));
                subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                document.getElementById("subtotal_total").innerHTML = Currency + '' + subGrandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
            }

            if (!isNaN(taxTotal)) {
                taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                document.getElementById("subtotal_tax").innerHTML = Currency + '' + taxGrandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
            }

            if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                document.getElementById("grandTotal").innerHTML = Currency + '' + GrandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                document.getElementById("balanceDue").innerHTML = Currency + '' + GrandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                document.getElementById("totalBalanceDue").innerHTML = Currency + '' + GrandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });

            }
        });
        //}
    },
    'blur .lineUnitPrice': function (event) {

        let utilityService = new UtilityService();
        if (!isNaN($('.lineUnitPrice').text())) {
            let inputUnitPrice = parseFloat($(event.target).text());
            $(event.target).text(Currency + '' + inputUnitPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                }));
        } else {
            let inputUnitPrice = Number($(event.target).text().replace(/[^0-9.-]+/g, ""));
            //parseFloat(parseFloat($.trim($(event.target).text().substring(Currency.length).replace(",", ""))) || 0);
            $(event.target).text(Currency + '' + inputUnitPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                }));
            //$('.lineUnitPrice').text();

        }
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        // let utilityService = new UtilityService();
        let $tblrows = $("#tblStockAdjustmentLine tbody tr");
        //if(selectLineID){
        let lineAmount = 0;
        let subGrandTotal = 0;
        let taxGrandTotal = 0;

        $tblrows.each(function (index) {
            var $tblrow = $(this);
            var qty = $tblrow.find(".lineQty").text() || 0;
            var price = $tblrow.find(".lineUnitPrice").text() || 0;
            var taxcode = $tblrow.find(".lineTaxRate").text() || 0;

            var taxrateamount = 0;
            if (taxcodeList) {
                for (var i = 0; i < taxcodeList.length; i++) {
                    if (taxcodeList[i].codename == taxcode) {
                        taxrateamount = taxcodeList[i].coderate;
                    }
                }
            }

            var subTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) || 0;
            var taxTotal = parseFloat(qty, 10) * Number(price.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
            if (!isNaN(subTotal)) {
                $tblrow.find('.lineAmt').text(Currency + '' + subTotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    }));
                subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                document.getElementById("subtotal_total").innerHTML = Currency + '' + subGrandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
            }

            if (!isNaN(taxTotal)) {
                taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                document.getElementById("subtotal_tax").innerHTML = Currency + '' + taxGrandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
            }

            if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                document.getElementById("grandTotal").innerHTML = Currency + '' + GrandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                document.getElementById("balanceDue").innerHTML = Currency + '' + GrandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                document.getElementById("totalBalanceDue").innerHTML = Currency + '' + GrandTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });

            }
        });
    },
    'click #btnCustomFileds': function (event) {
        var x = document.getElementById("divCustomFields");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    },
    'click .lineProductName, keydown .lineProductName': function (event) {
        var $earch = $(event.currentTarget);
        var offset = $earch.offset();

        const templateObject = Template.instance();
        $("#selectProductID").val('');
        var productDataName = $(event.target).val() || '';
        if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
            $('#productListModal').modal('toggle');
            var targetID = $(event.target).closest('tr').attr('id');
            $('#selectLineID').val(targetID);
            setTimeout(function () {
                $('#tblInventory_filter .form-control-sm').focus();
                $('#tblInventory_filter .form-control-sm').val('');
                $('#tblInventory_filter .form-control-sm').trigger("input");

                var datatable = $('#tblInventory').DataTable();
                datatable.draw();
                $('#tblInventory_filter .form-control-sm').trigger("input");

            }, 500);
        } else {
            // var productDataID = $(event.target).attr('prodid').replace(/\s/g, '') || '';
            if (productDataName.replace(/\s/g, '') != '') {
                //FlowRouter.go('/productview?prodname=' + $(event.target).text());
                let lineExtaSellItems = [];
                let lineExtaSellObj = {};
                $('.fullScreenSpin').css('display', 'inline-block');
                getVS1Data('TProductVS1').then(function (dataObject) {
                    if (dataObject.length == 0) {
                        sideBarService.getOneProductdatavs1byname(productDataName).then(function (data) {
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

                            setTimeout(function () {
                                $('#newProductModal').modal('show');
                            }, 500);
                        }).catch(function (err) {

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

                                setTimeout(function () {
                                    $('#newProductModal').modal('show');
                                }, 500);
                            }
                        }
                        if (!added) {
                            sideBarService.getOneProductdatavs1byname(productDataName).then(function (data) {
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

                                setTimeout(function () {
                                    $('#newProductModal').modal('show');
                                }, 500);
                            }).catch(function (err) {

                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                    }
                }).catch(function (err) {

                    sideBarService.getOneProductdatavs1byname(productDataName).then(function (data) {
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

                        setTimeout(function () {
                            $('#newProductModal').modal('show');
                        }, 500);
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

                }, 1000);
                //}


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
                //templateObject.getProductData();
            } else {
                $('#productListModal').modal('toggle');
                var targetID = $(event.target).closest('tr').attr('id');
                $('#selectLineID').val(targetID);
                setTimeout(function () {
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
    'click #productListModal #refreshpagelist': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        localStorage.setItem('VS1SalesProductList', '');
        let templateObject = Template.instance();
        Meteor._reload.reload();
        templateObject.getAllProducts();

    },
    'click .lineTaxRate': function (event) {
        $('#tblStockAdjustmentLine tbody tr .lineTaxRate').attr("data-toggle", "modal");
        $('#tblStockAdjustmentLine tbody tr .lineTaxRate').attr("data-target", "#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectLineID').val(targetID);
    },
    'click .lineTaxCode': function (event) {
        $('#tblStockAdjustmentLine tbody tr .lineTaxCode').attr("data-toggle", "modal");
        $('#tblStockAdjustmentLine tbody tr .lineTaxCode').attr("data-target", "#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectLineID').val(targetID);
    },
    'click .printConfirm': function (event) {
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#sltAccountName').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val());
        $('#printcomment').html($('#txaNotes').val().replace(/[\r\n]/g, "<br />"));
        exportSalesToPdf();
    },
    'keydown .lineQty, keydown .lineUnitPrice': function (event) {
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
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {}
        else {
            event.preventDefault();
        }
    },
    'click .btnRemove': function (event) {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();

        var clicktimes = 0;
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);

        times++;

        if (times == 1) {
            $('#deleteLineModal').modal('toggle');
        } else {
            if ($('#tblStockAdjustmentLine tbody>tr').length > 1) {
                this.click;
                $(event.target).closest('tr').remove();
                event.preventDefault();
                let $tblrows = $("#tblStockAdjustmentLine tbody tr");
                //if(selectLineID){
                let lineAmount = 0;
                let subGrandTotal = 0;
                let taxGrandTotal = 0;

                return false;

            } else {
                $('#deleteLineModal').modal('toggle');
            }
        }
    },
    'click .btnDeleteStock': function (event) {
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
                type: "TStockadjustentry",
                fields: {
                    ID: currentInvoice,
                    Deleted: true
                }
            };

            stockTransferService.saveStockAdjustment(objDetails).then(function (objDetails) {
                FlowRouter.go('/stockadjustmentoverview?success=true');
                $('.modal-backdrop').css('display', 'none');
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
            FlowRouter.go('/stockadjustmentoverview?success=true');
            $('.modal-backdrop').css('display', 'none');
        }
        $('#deleteLineModal').modal('toggle');
    },
    'click .btnDeleteStockAdjust': function (event) {
        let templateObject = Template.instance();
        let stockTransferService = new StockTransferService();
        swal({
            title: 'Delete Stock Adjustment',
            text: "Are you sure you want to Delete Stock Adjustment?",
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
                        type: "TStockadjustentry",
                        fields: {
                            ID: currentInvoice,
                            Deleted: true
                        }
                    };

                    stockTransferService.saveStockAdjustment(objDetails).then(function (objDetails) {
                        FlowRouter.go('/stockadjustmentoverview?success=true');
                        $('.modal-backdrop').css('display', 'none');

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
                    FlowRouter.go('/stockadjustmentoverview?success=true');
                    $('.modal-backdrop').css('display', 'none');
                }
                //$('#deleteLineModal').modal('toggle');
            } else {}
        });

    },
    'click .btnDeleteLine': function (event) {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let selectLineID = $('#selectDeleteLineID').val();
        if ($('#tblStockAdjustmentLine tbody>tr').length > 1) {
            this.click;

            $('#' + selectLineID).closest('tr').remove();
            //event.preventDefault();
            let $tblrows = $("#tblStockAdjustmentLine tbody tr");
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
            $('#' + selectLineID + " .lineFinalQty").val('');
            $('#' + selectLineID + " .lineAdjustQty").val('');
            $('#' + selectLineID + " .lineCostPrice").text('');
            $('#' + selectLineID + " .lineSalesLinesCustField1").text('');
            $('#' + selectLineID + " .lineTaxRate").text('');
            $('#' + selectLineID + " .lineTaxCode").text('');
            $('#' + selectLineID + " .lineAmt").text('');

            //event.preventDefault();

        }

        $('#deleteLineModal').modal('toggle');
    },
    'click .btnSaveSettings': function (event) {
        $('#myModal4').modal('toggle');
    },
    'click .btnProcess': function (event) {
        //let testDate = $("#dtSODate").datepicker({dateFormat: 'dd-mm-yy' });
        $('#html-2-pdfwrapper').css('display', 'block');
        let templateObject = Template.instance();
        let accountname = $('#sltAccountName');
        // let department = $('#sltDepartment').val();
        let stockTransferService = new StockTransferService();
        if (accountname.val() === '') {
            swal('Account has not been selected!', '', 'warning');
            e.preventDefault();
        } else {
            //$('.loginSpinner').css('display','inline-block');
            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = new Array();
            let lineItemsForm = [];
            let lineItemObjForm = {};
            $('#tblStockAdjustmentLine > tbody > tr').each(function () {
                var lineID = this.id;
                let tdproduct = $('#' + lineID + " .lineProductName").val();
                let tdproductID = $('#' + lineID + " .lineProductName").attr('productid');
                let tdproductCost = $('#' + lineID + " .lineProductName").attr('productcost');
                let tdbarcode = $('#' + lineID + " .lineProductBarCode").html();
                let tddescription = $('#' + lineID + " .lineDescription").html();
                let tdinstockqty = $('#' + lineID + " .lineInStockQty").text();
                let tdfinalqty = $('#' + lineID + " .lineFinalQty").val();
                let tdadjustqty = $('#' + lineID + " .lineAdjustQty").val();
                let tdDepartment = $('#' + lineID + " .lineDepartment").val();

                if (tdproduct != "") {

                    lineItemObjForm = {
                        type: "TSAELinesFlat",
                        fields: {
                            ProductName: tdproduct || '',
                            //AccountName: accountname.val() || '',
                            //ProductID: tdproductID || '',
                            Cost: parseFloat(tdproductCost.replace(/[^0-9.-]+/g, "")) || 0,
                            AdjustQty: parseFloat(tdadjustqty) || 0,
                            AdjustUOMQty: parseFloat(tdadjustqty) || 0,
                            Qty: parseFloat(tdadjustqty) || 0,
                            UOMQty: parseFloat(tdadjustqty) || 0,
                            FinalQty: parseFloat(tdfinalqty) || 0,
                            FinalUOMQty: parseFloat(tdfinalqty) || 0,
                            InStockUOMQty: parseFloat(tdinstockqty) || 0,
                            DeptName: tdDepartment || defaultDept,
                            ProductPrintName: tdproduct || '',
                            PartBarcode: tdbarcode || '',
                            Description: tddescription || ''

                        }
                    };

                    //lineItemsForm.push(lineItemObjForm);
                    splashLineArray.push(lineItemObjForm);
                }
            });

            let selectAccount = $('#sltAccountName').val();

            let notes = $('#txaNotes').val();
            var creationdateTime = new Date($("#dtCreationDate").datepicker("getDate"));
            let creationDate = creationdateTime.getFullYear() + "-" + (creationdateTime.getMonth() + 1) + "-" + creationdateTime.getDate();

            var url = FlowRouter.current().path;
            var getso_id = url.split('?id=');
            var currentStock = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var objDetails = '';

            if (getso_id[1]) {
                currentStock = parseInt(currentStock);
                objDetails = {
                    type: "TStockadjustentry",
                    fields: {
                        ID: currentStock,
                        AccountName: selectAccount,
                        AdjustmentDate: creationDate,
                        AdjustmentOnInStock: true,
                        AdjustType: "Gen",
                        Approved: false,
                        CreationDate: creationDate,
                        Deleted: false,
                        Employee: Session.get('mySessionEmployee'),
                        EnforceUOM: false,
                        //ISEmpty:false,
                        //IsStockTake:false,
                        Lines: splashLineArray,
                        DoProcessonSave: true,
                        Notes: notes

                    }
                };
            } else {
                objDetails = {
                    type: "TStockadjustentry",
                    fields: {
                        AccountName: selectAccount,
                        AdjustmentDate: creationDate,
                        AdjustmentOnInStock: true,
                        AdjustType: "Gen",
                        Approved: false,
                        CreationDate: creationDate,
                        Deleted: false,
                        Employee: Session.get('mySessionEmployee'),
                        EnforceUOM: false,
                        //ISEmpty:false,
                        //IsStockTake:false,
                        Lines: splashLineArray,
                        DoProcessonSave: true,
                        Notes: notes
                    }
                };
            }

            stockTransferService.saveStockAdjustment(objDetails).then(function (objDetails) {
                // FlowRouter.go('/stockadjustmentoverview?success=true');
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
                        '                                            <p style="font-size: 18px; margin: 34px 0px;">Please find the Stock Adjustment attached to this email.</p>' +
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

                    if (($('.chkEmailCopy').is(':checked'))) {
                        $('#html-2-pdfwrapper').css('display', 'none');
                        Meteor.call('sendEmail', {
                            from: "" + mailFromName + " <" + mailFrom + ">",
                            to: checkEmailData,
                            subject: mailSubject,
                            text: '',
                            html: htmlmailBody,
                            attachments: attachment
                        }, function (error, result) {
                            if (error && error.error === "error") {
                                FlowRouter.go('/stockadjustmentoverview?success=true');

                            } else {
                                swal({
                                    title: 'SUCCESS',
                                    text: "Email Sent To Employee: " + checkEmailData + " ",
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'OK'
                                }).then((result) => {
                                    if (result.value) {
                                        FlowRouter.go('/stockadjustmentoverview?success=true');
                                    } else if (result.dismiss === 'cancel') {}
                                });

                                $('.fullScreenSpin').css('display', 'none');
                            }
                        });

                    } else {
                        FlowRouter.go('/stockadjustmentoverview?success=true');
                    };

                }
                addAttachment();
                $('.modal-backdrop').css('display', 'none');

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
                //$('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display', 'none');
            });
        }

    },
    'click .btnHold': function (event) {
        $('#html-2-pdfwrapper').css('display', 'block');
        let templateObject = Template.instance();
        let accountname = $('#sltAccountName');
        // let department = $('#sltDepartment').val();
        let stockTransferService = new StockTransferService();
        if (accountname.val() === '') {
            swal('Account has not been selected!', '', 'warning');
            e.preventDefault();
        } else {
            //$('.loginSpinner').css('display','inline-block');
            $('.fullScreenSpin').css('display', 'inline-block');
            var splashLineArray = new Array();
            let lineItemsForm = [];
            let lineItemObjForm = {};

            $('#tblStockAdjustmentLine > tbody > tr').each(function () {
                var lineID = this.id;
                let tdproduct = $('#' + lineID + " .lineProductName").val();
                let tdproductID = $('#' + lineID + " .lineProductName").attr('productid');
                let tdproductCost = $('#' + lineID + " .lineProductName").attr('productcost');
                let tdbarcode = $('#' + lineID + " .lineProductBarCode").html();
                let tddescription = $('#' + lineID + " .lineDescription").html() || '';
                let tdinstockqty = $('#' + lineID + " .lineInStockQty").text();
                let tdfinalqty = $('#' + lineID + " .lineFinalQty").val();
                let tdadjustqty = $('#' + lineID + " .lineAdjustQty").val();
                let tdDepartment = $('#' + lineID + " .lineDepartment").val();
                if (tdproduct != "") {

                    lineItemObjForm = {
                        type: "TSAELinesFlat",
                        fields: {
                            ProductName: tdproduct || '',
                            //AccountName: accountname.val() || '',
                            //ProductID: tdproductID || '',
                            Cost: parseFloat(tdproductCost.replace(/[^0-9.-]+/g, "")) || 0,
                            AdjustQty: parseFloat(tdadjustqty) || 0,
                            AdjustUOMQty: parseFloat(tdadjustqty) || 0,
                            Qty: parseFloat(tdadjustqty) || 0,
                            UOMQty: parseFloat(tdadjustqty) || 0,
                            FinalQty: parseFloat(tdfinalqty) || 0,
                            FinalUOMQty: parseFloat(tdfinalqty) || 0,
                            InStockUOMQty: parseFloat(tdinstockqty) || 0,
                            DeptName: tdDepartment || defaultDept,
                            ProductPrintName: tdproduct || '',
                            PartBarcode: tdbarcode || '',
                            Description: tddescription || ''

                        }
                    };

                    //lineItemsForm.push(lineItemObjForm);
                    splashLineArray.push(lineItemObjForm);
                }
            });

            let selectAccount = $('#sltAccountName').val();

            let notes = $('#txaNotes').val();
            var creationdateTime = new Date($("#dtCreationDate").datepicker("getDate"));
            let creationDate = creationdateTime.getFullYear() + "-" + (creationdateTime.getMonth() + 1) + "-" + creationdateTime.getDate();
            var url = FlowRouter.current().path;
            var getso_id = url.split('?id=');
            var currentStock = getso_id[getso_id.length - 1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var objDetails = '';
            if (getso_id[1]) {
                currentStock = parseInt(currentStock);
                objDetails = {
                    type: "TStockadjustentry",
                    fields: {
                        ID: currentStock,
                        AccountName: selectAccount,
                        AdjustmentDate: creationDate,
                        AdjustmentOnInStock: true,
                        AdjustType: "Gen",
                        Approved: false,
                        CreationDate: creationDate,
                        Deleted: false,
                        Employee: Session.get('mySessionEmployee'),
                        EnforceUOM: false,
                        //ISEmpty:false,
                        //IsStockTake:false,
                        Lines: splashLineArray,
                        DoProcessonSave: false,
                        Notes: notes

                    }
                };
            } else {
                objDetails = {
                    type: "TStockadjustentry",
                    fields: {
                        AccountName: selectAccount,
                        AdjustmentDate: creationDate,
                        AdjustmentOnInStock: true,
                        AdjustType: "Gen",
                        Approved: false,
                        CreationDate: creationDate,
                        Deleted: false,
                        Employee: Session.get('mySessionEmployee'),
                        EnforceUOM: false,
                        //ISEmpty:false,
                        //IsStockTake:false,
                        Lines: splashLineArray,
                        DoProcessonSave: false,
                        Notes: notes
                    }
                };
            }

            stockTransferService.saveStockAdjustment(objDetails).then(function (objDetails) {
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
                        '                                            <p style="font-size: 18px; margin: 34px 0px;">Please find the Stock Adjustment attached to this email.</p>' +
                        '                                            <p style="font-size: 18px; margin-bottom: 8px;">Thank you</p>' +
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

                    if (($('.chkEmailCopy').is(':checked'))) {
                        $('#html-2-pdfwrapper').css('display', 'none');
                        Meteor.call('sendEmail', {
                            from: "" + mailFromName + " <" + mailFrom + ">",
                            to: checkEmailData,
                            subject: mailSubject,
                            text: '',
                            html: htmlmailBody,
                            attachments: attachment
                        }, function (error, result) {
                            if (error && error.error === "error") {
                                FlowRouter.go('/stockadjustmentoverview?success=true');

                            } else {
                                swal({
                                    title: 'SUCCESS',
                                    text: "Email Sent To Employee: " + checkEmailData + " ",
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'OK'
                                }).then((result) => {
                                    if (result.value) {
                                        FlowRouter.go('/stockadjustmentoverview?success=true');
                                    } else if (result.dismiss === 'cancel') {}
                                });

                                $('.fullScreenSpin').css('display', 'none');
                            }
                        });

                    } else {
                        FlowRouter.go('/stockadjustmentoverview?success=true');
                    };

                }
                addAttachment();
                $('.modal-backdrop').css('display', 'none');

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
                //$('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display', 'none');
            });
        }

    },
    'click .chkProductName': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colProductName').css('display', 'table-cell');
            $('.colProductName').css('padding', '.75rem');
            $('.colProductName').css('vertical-align', 'top');

        } else {
            $('.colProductName').css('display', 'none');
        }
    },
    'click .chkDescription': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colDescription').css('display', 'table-cell');
            $('.colDescription').css('padding', '.75rem');
            $('.colDescription').css('vertical-align', 'top');
        } else {
            $('.colDescription').css('display', 'none');
        }
    },
    'click .chkProductBarCode': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colProductBarCode').css('display', 'table-cell');
            $('.colProductBarCode').css('padding', '.75rem');
            $('.colProductBarCode').css('vertical-align', 'top');
        } else {
            $('.colProductBarCode').css('display', 'none');
        }
    },
    'click .chkProductCost': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colProductCost').css('display', 'table-cell');
            $('.colProductCost').css('padding', '.75rem');
            $('.colProductCost').css('vertical-align', 'top');
        } else {
            $('.colProductCost').css('display', 'none');
        }
    },
    'click .chkInStockQty': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colInStockQty').css('display', 'table-cell');
            $('.colInStockQty').css('padding', '.75rem');
            $('.colInStockQty').css('vertical-align', 'top');
        } else {
            $('.colInStockQty').css('display', 'none');
        }
    },

    'click .chkFinalQty': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colFinalQty').css('display', 'table-cell');
            $('.colFinalQty').css('padding', '.75rem');
            $('.colFinalQty').css('vertical-align', 'top');
        } else {
            $('.colFinalQty').css('display', 'none');
        }
    },
    'click .chkAdjustQty': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colAdjustQty').css('display', 'table-cell');
            $('.colAdjustQty').css('padding', '.75rem');
            $('.colAdjustQty').css('vertical-align', 'top');
        } else {
            $('.colAdjustQty').css('display', 'none');
        }
    },
    'click .chkQty': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colQty').css('display', 'table-cell');
            $('.colQty').css('padding', '.75rem');
            $('.colQty').css('vertical-align', 'top');
        } else {
            $('.colQty').css('display', 'none');
        }
    },
    'click .chkUnitPrice': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colUnitPrice').css('display', 'table-cell');
            $('.colUnitPrice').css('padding', '.75rem');
            $('.colUnitPrice').css('vertical-align', 'top');
        } else {
            $('.colUnitPrice').css('display', 'none');
        }
    },
    'click .chkCostPrice': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colCostPrice').css('display', 'table-cell');
            $('.colCostPrice').css('padding', '.75rem');
            $('.colCostPrice').css('vertical-align', 'top');
        } else {
            $('.colCostPrice').css('display', 'none');
        }
    },
    'click .chkSalesLinesCustField1': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colSalesLinesCustField1').css('display', 'table-cell');
            $('.colSalesLinesCustField1').css('padding', '.75rem');
            $('.colSalesLinesCustField1').css('vertical-align', 'top');
            $('.colSalesLinesCustField1').css('width', '80px');
        } else {
            $('.colSalesLinesCustField1').css('display', 'none');
        }
    },
    'click .chkTaxRate': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colTaxRate').css('display', 'table-cell');
            $('.colTaxRate').css('padding', '.75rem');
            $('.colTaxRate').css('vertical-align', 'top');
        } else {
            $('.colTaxRate').css('display', 'none');
        }
    },
    'click .chkAmount': function (event) {
        if ($(event.target).is(':checked')) {
            $('.colAmount').css('display', 'table-cell');
            $('.colAmount').css('padding', '.75rem');
            $('.colAmount').css('vertical-align', 'top');
        } else {
            $('.colAmount').css('display', 'none');
        }
    },
    'change .rngRangeProductName': function (event) {

        let range = $(event.target).val();
        $(".spWidthProductName").html(range + '%');
        $('.colProductName').css('width', range + '%');

    },
    'change .rngRangeDescription': function (event) {

        let range = $(event.target).val();
        $(".spWidthDescription").html(range + '%');
        $('.colDescription').css('width', range + '%');

    },
    'change .rngRangeQty': function (event) {

        let range = $(event.target).val();
        $(".spWidthQty").html(range + '%');
        $('.colQty').css('width', range + '%');

    },
    'change .rngRangeUnitPrice': function (event) {

        let range = $(event.target).val();
        $(".spWidthUnitPrice").html(range + '%');
        $('.colUnitPrice').css('width', range + '%');

    },
    'change .rngRangeTaxRate': function (event) {

        let range = $(event.target).val();
        $(".spWidthTaxRate").html(range + '%');
        $('.colTaxRate').css('width', range + '%');

    },
    'change .rngRangeAmount': function (event) {

        let range = $(event.target).val();
        $(".spWidthAmount").html(range + '%');
        $('.colAmount').css('width', range + '%');

    },
    'change .rngRangeCostPrice': function (event) {

        let range = $(event.target).val();
        $(".spWidthCostPrice").html(range + '%');
        $('.colCostPrice').css('width', range + '%');

    },
    'change .rngRangeSalesLinesCustField1': function (event) {

        let range = $(event.target).val();
        $(".spWidthSalesLinesCustField1").html(range + '%');
        $('.colSalesLinesCustField1').css('width', range + '%');

    },
    'blur .divcolumn': function (event) {
        let columData = $(event.target).html();
        let columHeaderUpdate = $(event.target).attr("valueupdate");
        $("" + columHeaderUpdate + "").html(columData);

    },
    'click .btnSaveGridSettings': function (event) {
        let lineItems = [];
        //let lineItemObj = {};
        $('.columnSettings').each(function (index) {
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
            // var price = $tblrow.find(".lineUnitPrice").text()||0;
            // var taxcode = $tblrow.find(".lineTaxRate").text()||0;

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
                    PrefName: 'tblStockAdjustmentLine'
                });
                if (checkPrefDetails) {
                    CloudPreference.update({
                        _id: checkPrefDetails._id
                    }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'salesform',
                            PrefName: 'tblStockAdjustmentLine',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                            //window.open('/stockadjustmentoverview','_self');
                        } else {
                            $('#myModal2').modal('toggle');
                            //window.open('/stockadjustmentoverview','_self');

                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'tblStockAdjustmentLine',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function (err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                            //window.open('/stockadjustmentoverview','_self');
                        } else {
                            $('#myModal2').modal('toggle');
                            //window.open('/stockadjustmentoverview','_self');

                        }
                    });

                }
            }
        }

    },
    'click .btnResetGridSettings': function (event) {
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
                    PrefName: 'tblStockAdjustmentLine'
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
                    PrefName: 'stockadjustmentcard'
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
    'click .new_attachment_btn': function (event) {
        $('#attachment-upload').trigger('click');

    },
    'change #attachment-upload': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .img_new_attachment_btn': function (event) {
        $('#img-attachment-upload').trigger('click');

    },
    'change #img-attachment-upload': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#img-attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .remove-attachment': function (event, ui) {
        let tempObj = Template.instance();
        let attachmentID = parseInt(event.target.id.split('remove-attachment-')[1]);
        if (tempObj.$("#confirm-action-" + attachmentID).length) {
            tempObj.$("#confirm-action-" + attachmentID).remove();
        } else {
            let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID + '"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-' + attachmentID + '">'
                 + 'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-name-' + attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltip").show();

    },
    'click .file-name': function (event) {
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
    'click .confirm-delete-attachment': function (event, ui) {
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
    'click #btn_Attachment': function () {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFiles.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedFileArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click .btnBack': function (event) {
        event.preventDefault();
        history.back(1);
    },
    'keyup .lineAdjustQty': function (event) {
        //if (event.which >= 48 && event.which <= 57) {
        let tempObj = Template.instance();
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        let finalTotal = "";
        let inStockQty = $('#' + targetID + " .lineInStockQty").text() || 0;
        let finalQty = $('#' + targetID + " .lineFinalQty").val() || 0;
        let adjustQty = $('#' + targetID + " .lineAdjustQty").val() || 0;
        finalTotal = parseFloat(inStockQty) + parseFloat(adjustQty);
        $('#' + targetID + " .lineFinalQty").val(finalTotal);
        $('.stock_print #' + targetID + " .lineAdjustQtyPrint").text($('#' + targetID + " .lineAdjustQtyPrint").val());
        $('.stock_print #' + targetID + " .lineFinalQtyPrint").text(finalTotal);
        //}
    },
    'keyup .lineFinalQty': function (event) {
        //if (event.which >= 48 && event.which <= 57) {
        let tempObj = Template.instance();
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        let adjustTotal = "";
        let inStockQty = $('#' + targetID + " .lineInStockQty").text() || 0;
        let finalQty = $('#' + targetID + " .lineFinalQty").val() || 0;
        let adjustQty = $('#' + targetID + " .lineAdjustQty").val() || 0;
        adjustTotal = parseFloat(finalQty) - parseFloat(inStockQty);
        $('#' + targetID + " .lineAdjustQty").val(adjustTotal);
        $('.stock_print #' + targetID + " .lineAdjustQtyPrint").text(adjustTotal);
        $('.stock_print #' + targetID + " .lineFinalQtyPrint").text($('#' + targetID + " .lineFinalQty").val());
        //}
    },
    'keydown .lineFinalQty, keydown .lineAdjustQty': function (event) {
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
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189) {}
        else {
            event.preventDefault();
        }
    },
    'click .chkEmailCopy': function (event) {
        if ($(event.target).is(':checked')) {
            $('#employeeList').modal('show');
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

Template.registerHelper('equals', function (a, b) {
    return a === b;
});
