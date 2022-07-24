import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import { Random } from 'meteor/random';
import '../lib/global/indexdbstorage.js';
import {ProductService} from "../product/product-service";
import {SalesBoardService} from "../js/sales-service";
import {jsPDF} from "jspdf";
import {ReconService} from "./recon-service";

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let reconService = new ReconService();

let selectLineID = null;
let DepositID = null;
let PaymentID = null;
let DateIn = null;
let DepOrWith = null;
let Who = null;
let BankAccountName = null;
let BankAccountID = null;

Template.recontransactiondetail.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.baselinedata = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.clientrecords = new ReactiveVar();
    templateObject.taxraterecords = new ReactiveVar([]);
});

Template.recontransactiondetail.onRendered(function() {

    const templateObject = Template.instance();
    let productService = new ProductService();

    const taxCodesList = [];
    const splashArrayTaxRateList = [];
    let clientList = [];

    DepositID = (Session.get("reconDepositID") !== undefined && parseInt(Session.get("reconDepositID")) > 0)?Session.get("reconDepositID"):null;
    PaymentID = (Session.get("reconPaymentID") !== undefined && parseInt(Session.get("reconPaymentID")) > 0)?Session.get("reconPaymentID"):null;
    BankAccountName = (Session.get("bankaccountname") !== undefined && Session.get("bankaccountname") !== '')?Session.get("bankaccountname"):null;
    BankAccountID = (Session.get("bankaccountid") !== undefined && parseInt(Session.get("bankaccountid")) > 0)?Session.get("bankaccountid"):null;
    Who = (Session.get("reconWho") !== undefined && Session.get("reconWho") !== '')?Session.get("reconWho"):null;
    let what = (Session.get("reconWhat") !== undefined && Session.get("reconWhat") !== '')?Session.get("reconWhat"):null;
    let why = (Session.get("reconWhy") !== undefined && Session.get("reconWhy") !== '')?Session.get("reconWhy"):null;
    let taxRate = (Session.get("reconTaxRate") !== undefined && Session.get("reconTaxRate") !== '')?Session.get("reconTaxRate"):null;
    let amount = (Session.get("reconAmount") !== undefined && Session.get("reconAmount") !== '')?Session.get("reconAmount"):0;
    DateIn = (Session.get("reconDateIn") !== undefined && Session.get("reconDateIn") !== '')?Session.get("reconDateIn"):'';
    DepOrWith = (Session.get("reconSOR") !== undefined && Session.get("reconSOR") !== '')?Session.get("reconSOR"):null;

    // let DepositID = (FlowRouter.current().queryParams.ID !== undefined && parseInt(FlowRouter.current().queryParams.ID) > 0)?FlowRouter.current().queryParams.ID:null;
    // let who = (FlowRouter.current().queryParams.who !== undefined && FlowRouter.current().queryParams.who !== '')?FlowRouter.current().queryParams.who:null;
    // let what = (FlowRouter.current().queryParams.what !== undefined && FlowRouter.current().queryParams.what !== '')?FlowRouter.current().queryParams.what:null;
    // let why = (FlowRouter.current().queryParams.why !== undefined && FlowRouter.current().queryParams.why !== '')?FlowRouter.current().queryParams.why:null;
    // let taxRate = (FlowRouter.current().queryParams.taxRate !== undefined && FlowRouter.current().queryParams.taxRate !== '')?FlowRouter.current().queryParams.taxRate:null;
    // let amount = (FlowRouter.current().queryParams.amount !== undefined && FlowRouter.current().queryParams.amount !== '')?FlowRouter.current().queryParams.amount:0;
    // let dateIn = (FlowRouter.current().queryParams.dateIn !== undefined && FlowRouter.current().queryParams.dateIn !== '')?FlowRouter.current().queryParams.dateIn:'';

    function setFirstlineByParam () {
        if (DepositID !== null) {
            let clientDetail = templateObject.clientrecords.get().filter(customer => {
                return customer.customername === what;
            });
            clientDetail = clientDetail[0];
            // let clientDetail = (what !== null && templateObject.clientrecords.get().hasOwnProperty(what))?templateObject.clientrecords.get()[what]:null;
            let discountAmount = (clientDetail !== null)? amount*clientDetail.discount/100: 0;
            // let taxCodeDetail = (taxRate !== null && templateObject.taxraterecords.get().hasOwnProperty(taxRate))?templateObject.taxraterecords.get()[taxRate]:null;
            let taxCodeDetail = templateObject.taxraterecords.get().filter(taxcode => {
                return taxcode.codename === taxRate;
            });
            taxCodeDetail = taxCodeDetail[0];
            let taxAmount = (taxCodeDetail !== null)?amount*taxCodeDetail.coderate/100:0;
            selectLineID = Random.id();
            let basedataObj = {
                lineID: selectLineID,
                product: '',
                description: (why !== null)? why:'',
                quantity: 1,
                unitPrice: utilityService.modifynegativeCurrencyFormat(amount),
                unitPriceInc: utilityService.modifynegativeCurrencyFormat(amount + taxAmount),
                subtotal: utilityService.modifynegativeCurrencyFormat(amount),
                account: (clientDetail !== null)? clientDetail.customername:'',
                discountPercent: utilityService.modifynegativeCurrencyFormat(discountAmount),
                taxrate: (taxCodeDetail !== null)? taxCodeDetail.codename:'',
                taxAmount: utilityService.modifynegativeCurrencyFormat(taxAmount),
                amount: amount,
                totalAmount: utilityService.modifynegativeCurrencyFormat(amount - discountAmount),
                totalAmountInc: utilityService.modifynegativeCurrencyFormat(amount - discountAmount + taxAmount)
            };

            let basedataArr = [];
            basedataArr.push(basedataObj);
            let thirdaryData = $.merge($.merge([], templateObject.baselinedata.get()), basedataArr);
            templateObject.baselinedata.set(thirdaryData);
            $('#FromWho').val(Who);
            let dateIn_val = (DateIn !=='')? moment(DateIn).format("DD/MM/YYYY"): DateIn;
            $('#DateIn').val(dateIn_val);
            $('#TotalAmount').val(amount);
            setTimeout(function () {
                setCalculated();
                $('#' + selectLineID + " .btnRemove").hide();
            }, 500);
        }
    }

    templateObject.getAllClients = function () {
        getVS1Data('TCustomerVS1').then(function (dataObject) {
            if (dataObject.length === 0) {
                sideBarService.getClientVS1().then(function (data) {
                    setClientList(data.tcustomervs1);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcustomervs1;
                setClientList(useData);
            }
        }).catch(function (err) {
            sideBarService.getClientVS1().then(function (data) {
                setClientList(data.tcustomervs1);
            });
        });
    };

    function setClientList (data) {
        for (let i in data) {
            if (data.hasOwnProperty(i)) {
                let customerrecordObj = {
                    customerid: data[i].fields.CallPriority || ' ',
                    firstname: data[i].fields.FirstName || '',
                    lastname: data[i].fields.LastName || '',
                    customername: data[i].fields.ClientName || ' ',
                    customeremail: data[i].fields.Email || ' ',
                    street: data[i].fields.Street || ' ',
                    street2: data[i].fields.Street2 || ' ',
                    street3: data[i].fields.Street3 || ' ',
                    suburb: data[i].fields.Suburb || ' ',
                    statecode: data[i].fields.State + ' ' + data[i].fields.Postcode || ' ',
                    country: data[i].fields.Country || ' ',
                    termsName: data[i].fields.TermsName || '',
                    taxCode: data[i].fields.TaxCodeName || 'E',
                    clienttypename: data[i].fields.ClientTypeName || 'Default',
                    discount: data[i].fields.Discount || 0,
                };
                clientList.push(customerrecordObj);
            }

        }
        templateObject.clientrecords.set(clientList);

        for (var i = 0; i < clientList.length; i++) {
            //$('#edtCustomerName').editableSelect('add', clientList[i].customername);
        }
        setTimeout(function () {
            // $('#edtCustomerName').trigger("click");
            setFirstlineByParam();
        }, 200);
    }

    templateObject.getAllTaxCodes = function () {
        getVS1Data("TTaxcodeVS1")
            .then(function (dataObject) {
                if (dataObject.length === 0) {
                    productService.getTaxCodesVS1().then(function (data) {
                        setTaxCodeModal(data);
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    setTaxCodeModal(data);
                }
            })
            .catch(function (err) {
                productService.getTaxCodesVS1().then(function (data) {
                    setTaxCodeModal(data);
                });
            });
    };

    function setTaxCodeModal(data) {
        let useData = data.ttaxcodevs1;
        // let records = [];
        // let inventoryData = [];
        for (let i = 0; i < useData.length; i++) {
            let taxRate = (useData[i].Rate * 100).toFixed(2);
            var dataList = [
                useData[i].Id || "",
                useData[i].CodeName || "",
                useData[i].Description || "-",
                taxRate || 0,
            ];
            let taxcoderecordObj = {
                codename: useData[i].CodeName || " ",
                coderate: taxRate || " ",
            };
            taxCodesList.push(taxcoderecordObj);
            splashArrayTaxRateList.push(dataList);
        }
        templateObject.taxraterecords.set(taxCodesList);
        if (splashArrayTaxRateList) {
            $("#tblTaxRate").DataTable({
                data: splashArrayTaxRateList,
                sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",

                columnDefs: [
                    {
                        orderable: false,
                        targets: 0,
                    },
                    {
                        className: "taxName",
                        targets: [1],
                    },
                    {
                        className: "taxDesc",
                        targets: [2],
                    },
                    {
                        className: "taxRate text-right",
                        targets: [3],
                    },
                ],
                colReorder: true,

                pageLength: initialDatatableLoad,
                lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"],
                ],
                info: true,
                responsive: true,
                fnDrawCallback: function (oSettings) {
                    // $('.dataTables_paginate').css('display', 'none');
                },
                fnInitComplete: function () {
                    $(
                        "<button class='btn btn-primary btnAddNewTaxRate' data-dismiss='modal' data-toggle='modal' data-target='#newTaxRateModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>"
                    ).insertAfter("#tblTaxRate_filter");
                    $(
                        "<button class='btn btn-primary btnRefreshTax' type='button' id='btnRefreshTax' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                    ).insertAfter("#tblTaxRate_filter");
                },
            });
        }
    }

    setTimeout(function () {
        templateObject.getAllClients();
        templateObject.getAllTaxCodes();
    }, 500);

    $('#addLine').on('click', function () {
        const rowData = $('#tblrecontransactiondetail tbody>tr:last').clone(true);
        let tokenid = Random.id();
        $(".lineProductName", rowData).val("");
        $(".lineProductDesc", rowData).val("");
        $(".lineQty", rowData).val("");
        $(".lineAccountName", rowData).val("");
        $(".lineUnitPrice", rowData).val("");
        $(".lineAmount", rowData).text("");
        $(".lineTaxRate", rowData).val("");
        $(".lineTaxAmount", rowData).text("");
        $(".lineDiscount", rowData).text("");
        $(".btnRemove", rowData).show();
        rowData.attr('id', tokenid);
        $("#tblrecontransactiondetail tbody").append(rowData);

        setTimeout(function () {
            $('#' + tokenid + " .lineProductName").trigger('click');
        }, 200);
    });

    $(document).on("click", "#tblInventory tbody tr", function (e) {
        $(".colProductName").removeClass('boldtablealertsborder');
        const trow = $(this);

        if (selectLineID) {
            let lineProductName = trow.find(".productName").text();
            let lineProductDesc = trow.find(".productDesc").val();
            let lineUnitPrice = trow.find(".salePrice").val();

            $('#' + selectLineID + " .lineProductName").val(lineProductName);
            $('#' + selectLineID + " .lineProductDesc").val(lineProductDesc);
            $('#' + selectLineID + " .lineQty").val(1);
            $('#' + selectLineID + " .lineUnitPrice").val(lineUnitPrice);
            $('#productListModal').modal('toggle');
        }
        setCalculated();
    });

    $(document).on("click", "#tblCustomerlist tbody tr", function (e) {
        const trow = $(this);
        if (selectLineID) {
            let lineAccountName = trow.find(".colCompany").text();
            $('#' + selectLineID + " .lineAccountName").val(lineAccountName);
            $('#customerListModal').modal('toggle');
        }
        setCalculated();
    });

    $(document).on("click", "#tblTaxRate tbody tr", function (e) {
        let trow = $(this);
        if (selectLineID) {
            let lineTaxRate = trow.find(".taxRate").text();
            $('#' + selectLineID + " .lineTaxRate").val(lineTaxRate);
            $('#taxRateListModal').modal('toggle');
        }
        setCalculated();
    });


    $("#DateIn").datepicker({
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


    function setCalculated() {
        let taxcodeList = templateObject.taxraterecords.get();
        let customerList = templateObject.clientrecords.get();
        setCalculated2(taxcodeList, customerList)
    }

});


Template.recontransactiondetail.events({

    'click .lineProductName, keydown .lineProductName': function (event) {

        selectLineID = $(event.target).closest('tr').attr('id');
        const $each = $(event.currentTarget);
        const offset = $each.offset();

        $("#selectProductID").val('');
        const productDataName = $(event.target).val() || '';

        if (event.pageX > offset.left + $each.width() - 10) { // X button 16px wide?
            openProductListModal();
        } else {
            if (productDataName.replace(/\s/g, '') !== '') {
                $('.fullScreenSpin').css('display', 'inline-block');
                getVS1Data('TProductVS1').then(function (dataObject) {
                    if (dataObject.length === 0) {
                        setOneProductDataByName(productDataName);
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let added = false;
                        for (let i = 0; i < data.tproductvs1.length; i++) {
                            if (data.tproductvs1[i].fields.ProductName === productDataName) {
                                added = true;
                                $('.fullScreenSpin').css('display', 'none');
                                setProductNewModal(data.tproductvs1[i]);
                                setTimeout(function () {
                                    $('#newProductModal').modal('show');
                                }, 500);
                            }
                        }
                        if (!added) {
                            setOneProductDataByName(productDataName);
                        }
                    }
                }).catch(function (err) {
                    setOneProductDataByName(productDataName);
                });

                setTimeout(function () {
                    // WangYan: where are these element - dtDateTo, dtDateFrom
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
                        if (e.keyCode === 8 || e.keyCode === 46) {
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
                        if (e.keyCode === 8 || e.keyCode === 46) {
                            $("#dtDateTo,#dtDateFrom").val('');
                        }
                    });

                    $(".ui-datepicker .ui-state-hihglight").removeClass("ui-state-highlight");

                }, 1000);

            } else {
                openProductListModal();
            }
        }
    },

    'click .lineAccountName, keydown .lineAccountName': function (event) {
        selectLineID = $(event.target).closest('tr').attr('id');
        const $each = $(event.currentTarget);
        const offset = $each.offset();
        $('#edtCustomerPOPID').val('');
        //$('#edtCustomerCompany').attr('readonly', false);
        const customerDataName = event.target.value || '';
        if (event.pageX > offset.left + $each.width() - 8) { // X button 16px wide?
            openCustomerModal();
        } else {
            if (customerDataName.replace(/\s/g, '') !== '') {
                //FlowRouter.go('/customerscard?name=' + e.target.value);
                $('#edtCustomerPOPID').val('');
                getVS1Data('TCustomerVS1').then(function (dataObject) {
                    if (dataObject.length === 0) {
                        setOneCustomerDataExByName(customerDataName);
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tcustomervs1;
                        let added = false;
                        for (let i = 0; i < useData.length; i++) {
                            if (useData[i].fields.ClientName === customerDataName) {
                                setCustomerModal(useData[i]);
                            }
                        }
                        if (!added) {
                            setOneCustomerDataExByName(customerDataName);
                        }
                    }
                }).catch(function (err) {
                    setOneCustomerDataExByName(customerDataName);
                });
            } else {
                openCustomerModal();
            }
        }
    },

    'click .lineTaxRate, keydown .lineTaxRate': function (event) {
        selectLineID = $(event.target).closest('tr').attr('id');
        const $each = $(event.currentTarget);
        const offset = $each.offset();
        const taxRateDataName = event.target.value || "";
        if (event.pageX > offset.left + $each.width() - 8) {
            // X button 16px wide?
            $("#taxRateListModal").modal("toggle");
        } else {
            if (taxRateDataName.replace(/\s/g, "") !== "") {
                $(".taxcodepopheader").text("Edit Tax Rate");
                getVS1Data("TTaxcodeVS1").then(function (dataObject) {
                    if (dataObject.length === 0) {
                        setTaxCodeVS1();
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        $(".taxcodepopheader").text("Edit Tax Rate");
                        setTaxRateData(data);
                    }
                }).catch(function (err) {
                    setTaxCodeVS1();
                });
            } else {
                $("#taxRateListModal").modal("toggle");
            }
        }
    },

    'keydown .lineQty, keydown .lineUnitPrice': function (event) {
        selectLineID = $(event.target).closest('tr').attr('id');
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            return;
        }

        if (event.shiftKey === true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode === 8 || event.keyCode === 9 ||
            event.keyCode === 37 || event.keyCode === 39 ||
            event.keyCode === 46 || event.keyCode === 190 || event.keyCode === 189 || event.keyCode === 109) {

        }
        else {
            event.preventDefault();
        }
    },
    'change .lineQty': function (event) {
        selectLineID = $(event.target).closest('tr').attr('id');
        const templateObject = Template.instance();
        let qty = parseInt($(event.target).val()) || 0;
        $(event.target).val(qty);
        let taxcodeList = templateObject.taxraterecords.get();
        let customerList = templateObject.clientrecords.get();
        setCalculated2(taxcodeList, customerList);
    },
    'change .lineUnitPrice': function (event) {
        selectLineID = $(event.target).closest('tr').attr('id');
        const templateObject = Template.instance();
        let inputUnitPrice = 0;
        if (!isNaN($(event.target).val())) {
            inputUnitPrice = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        }
        let taxcodeList = templateObject.taxraterecords.get();
        let customerList = templateObject.clientrecords.get();
        setCalculated2(taxcodeList, customerList);
    },
    'click .btnRemove': function (event) {
        selectLineID = null;
        let templateObject = Template.instance();
        $(event.target).closest('tr').remove();
        event.preventDefault();

        let taxcodeList = templateObject.taxraterecords.get();
        let customerList = templateObject.clientrecords.get();
        setCalculated2(taxcodeList, customerList);
    },
    'click #btnCancel': function() {
        Session.setPersistent('bankaccountid', Session.get('bankaccountid'));
        Session.setPersistent('bankaccountname', Session.get('bankaccountname'));
        FlowRouter.go('/newbankrecon');
    },
    'click #btnSave': function (event) {
        let match_total = parseFloat($("#TotalAmount").val());
        let grand_total =  Number($(".grand_total").text().replace(/[^0-9.-]+/g, "")) || 0;
        if (match_total !== grand_total) {
            swal('The totals do not match.', '', 'error');
            $("#TotalAmount").focus();
            return false;
        }
        let reconType = "";
        if (DepOrWith === "spent") {
            reconType = "TReconciliationDepositLines";
        } else if (DepOrWith === "received") {
            reconType = "TReconciliationWithdrawalLines";
        } else {
            return false;
        }

        $('.fullScreenSpin').css('display', 'inline-block');

        let lineItems = [];
        let lineItemsObj = {};
        $('#tblrecontransactiondetail > tbody > tr').each(function () {
            let lineID = this.id;
            let lineProductDesc = $('#' + lineID + " .lineProductDesc").val();
            let lineAccountName = $('#' + lineID + " .lineAccountName").val();
            let lineAmount = $('#' + lineID + " .lineAmount").text();
            lineAmount = Number(lineAmount.replace(/[^0-9.-]+/g, "")) || 0;
            let refText = $('#reference').val();

            let dateIn = $("#DateIn").val() || '';
            let splitwithdepositdate = dateIn.split("/");
            let withYear = splitwithdepositdate[2];
            let withMonth = splitwithdepositdate[1];
            let withDay = splitwithdepositdate[0];
            let formatWithDate = withYear + "-" + withMonth + "-" + withDay;

            lineItemsObj = {
                type: reconType,
                fields: {
                    AccountName: BankAccountName || '',
                    Amount: lineAmount,
                    BankStatementLineID: 0, //Hardcoded for now
                    ClientName: lineAccountName || '',
                    DepositDate: formatWithDate + " 00:00:00" || '',
                    Deposited: true,
                    DepositLineID: parseInt(DepositID) || 0,
                    Notes: lineProductDesc || '',
                    Payee: lineAccountName || '',
                    PaymentID: parseInt(PaymentID) || 0,
                    // Reconciled: true,
                    Reconciled: false,
                    Reference: refText || ''
                }
            };
            lineItems.push(lineItemsObj);
        });

        // Pulling initial variables BEGIN
        let deptname = "Default"; //Set to Default as it isn't used for recons
        let employeename = Session.get('mySessionEmployee');
        var notes = ''; //pending addition of notes field
        var openbalance = 0;
        let closebalance = 0;
        var statementno = '';
        let recondate = DateIn;
        // Pulling initial variables END

        let objDetails = {};
        if (DepOrWith === "spent") {
            objDetails = {
                type: "TReconciliation",
                fields: {
                    // ID: parseInt(DepositID) || 0,
                    AccountName: BankAccountName || '',
                    CloseBalance: closebalance,
                    Deleted: false,
                    DepositLines: lineItems || '',
                    DeptName: deptname || '',
                    EmployeeName: employeename || '',
                    Finished: false,
                    Notes: notes || '',
                    OnHold: true,
                    OpenBalance: openbalance,
                    ReconciliationDate: recondate,
                    StatementNo: statementno || '0',
                    WithdrawalLines: ''

                }
            };

        } else {
            objDetails = {
                type: "TReconciliation",
                fields: {
                    // ID: parseInt(DepositID) || 0,
                    AccountName: BankAccountName || '',
                    CloseBalance: closebalance,
                    Deleted: false,
                    DepositLines: '',
                    DeptName: deptname || '',
                    EmployeeName: employeename || '',
                    Finished: false,
                    Notes: notes || '',
                    OnHold: true,
                    OpenBalance: openbalance,
                    ReconciliationDate: recondate,
                    StatementNo: statementno || '0',
                    WithdrawalLines: lineItems || ''

                }
            };
        }

        reconService.saveReconciliation(objDetails).then(function(data) {
            FlowRouter.go('/reconciliationlist?success=true');
        }).catch(function(err) {
            swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                else if (result.dismiss == 'cancel') {}
            });
            $('.fullScreenSpin').css('display', 'none');
        });

    },

});

Template.recontransactiondetail.helpers({
    baselinedata : () => {
        return Template.instance().baselinedata.get();
    },
    taxraterecords: () => {
        return Template.instance()
            .taxraterecords.get()
            .sort(function (a, b) {
                if (a.description === "NA") {
                    return 1;
                } else if (b.description === "NA") {
                    return -1;
                }
                return a.description.toUpperCase() > b.description.toUpperCase()
                    ? 1
                    : -1;
            });
    },

});

function openProductListModal() {
    $('#productListModal').modal('toggle');
    setTimeout(function () {
        $('#tblInventory_filter .form-control-sm').focus();
        $('#tblInventory_filter .form-control-sm').val('');
        $('#tblInventory_filter .form-control-sm').trigger("input");

        var datatable = $('#tblInventory').DataTable();
        datatable.draw();
        $('#tblInventory_filter .form-control-sm').trigger("input");

    }, 500);
}
function setOneProductDataByName(productDataName) {
    sideBarService.getOneProductdatavs1byname(productDataName).then(function (data) {
        $('.fullScreenSpin').css('display', 'none');
        setProductNewModal(data.tproduct[0]);
        setTimeout(function () {
            $('#newProductModal').modal('show');
        }, 500);
    }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
    });
}
function setProductNewModal(productInfo) {
    let lineItems = [];
    let lineItemObj = {};
    let currencySymbol = Currency;
    let totalquantity = 0;
    let productname = productInfo.fields.ProductName || '';
    let productcode = productInfo.fields.PRODUCTCODE || '';
    let productprintName = productInfo.fields.ProductPrintName || '';
    let assetaccount = productInfo.fields.AssetAccount || '';
    let buyqty1cost = utilityService.modifynegativeCurrencyFormat(productInfo.fields.BuyQty1Cost) || 0;
    let cogsaccount = productInfo.fields.CogsAccount || '';
    let taxcodepurchase = productInfo.fields.TaxCodePurchase || '';
    let purchasedescription = productInfo.fields.PurchaseDescription || '';
    let sellqty1price = utilityService.modifynegativeCurrencyFormat(productInfo.fields.SellQty1Price) || 0;
    let incomeaccount = productInfo.fields.IncomeAccount || '';
    let taxcodesales = productInfo.fields.TaxCodeSales || '';
    let salesdescription = productInfo.fields.SalesDescription || '';
    let active = productInfo.fields.Active;
    let lockextrasell = productInfo.fields.LockExtraSell || '';
    let customfield1 = productInfo.fields.CUSTFLD1 || '';
    let customfield2 = productInfo.fields.CUSTFLD2 || '';
    let barcode = productInfo.fields.BARCODE || '';
    $("#selectProductID").val(productInfo.fields.ID).trigger("change");
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
}

function openCustomerModal() {
    $('#customerListModal').modal();
    setTimeout(function () {
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
function setOneCustomerDataExByName(customerDataName) {
    $('.fullScreenSpin').css('display', 'inline-block');
    sideBarService.getOneCustomerDataExByName(customerDataName).then(function (data) {
        $('.fullScreenSpin').css('display', 'none');
        setCustomerModal(data.tcustomer[0]);
    }).catch(function (err) {
        $('.fullScreenSpin').css('display', 'none');
    });
}
function setCustomerModal(data) {
    $('.fullScreenSpin').css('display', 'none');
    let lineItems = [];
    $('#add-customer-title').text('Edit Customer');
    let popCustomerID = data.fields.ID || '';
    let popCustomerName = data.fields.ClientName || '';
    let popCustomerEmail = data.fields.Email || '';
    let popCustomerTitle = data.fields.Title || '';
    let popCustomerFirstName = data.fields.FirstName || '';
    let popCustomerMiddleName = data.fields.CUSTFLD10 || '';
    let popCustomerLastName = data.fields.LastName || '';
    let popCustomertfn = '' || '';
    let popCustomerPhone = data.fields.Phone || '';
    let popCustomerMobile = data.fields.Mobile || '';
    let popCustomerFaxnumber = data.fields.Faxnumber || '';
    let popCustomerSkypeName = data.fields.SkypeName || '';
    let popCustomerURL = data.fields.URL || '';
    let popCustomerStreet = data.fields.Street || '';
    let popCustomerStreet2 = data.fields.Street2 || '';
    let popCustomerState = data.fields.State || '';
    let popCustomerPostcode = data.fields.Postcode || '';
    let popCustomerCountry = data.fields.Country || LoggedCountry;
    let popCustomerbillingaddress = data.fields.BillStreet || '';
    let popCustomerbcity = data.fields.BillStreet2 || '';
    let popCustomerbstate = data.fields.BillState || '';
    let popCustomerbpostalcode = data.fields.BillPostcode || '';
    let popCustomerbcountry = data.fields.Billcountry || LoggedCountry;
    let popCustomercustfield1 = data.fields.CUSTFLD1 || '';
    let popCustomercustfield2 = data.fields.CUSTFLD2 || '';
    let popCustomercustfield3 = data.fields.CUSTFLD3 || '';
    let popCustomercustfield4 = data.fields.CUSTFLD4 || '';
    let popCustomernotes = data.fields.Notes || '';
    let popCustomerpreferedpayment = data.fields.PaymentMethodName || '';
    let popCustomerterms = data.fields.TermsName || '';
    let popCustomerdeliverymethod = data.fields.ShippingMethodName || '';
    let popCustomeraccountnumber = data.fields.ClientNo || '';
    let popCustomerisContractor = data.fields.Contractor || false;
    let popCustomerissupplier = data.fields.IsSupplier || false;
    let popCustomeriscustomer = data.fields.IsCustomer || false;
    let popCustomerTaxCode = data.fields.TaxCodeName || '';
    let popCustomerDiscount = data.fields.Discount || 0;
    let popCustomerType = data.fields.ClientTypeName || '';
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

    if ((data.fields.Street === data.fields.BillStreet) && (data.fields.Street2 === data.fields.BillStreet2) &&
        (data.fields.State === data.fields.BillState) && (data.fields.Postcode === data.fields.BillPostcode) &&
        (data.fields.Country === data.fields.Billcountry)) {
        $('#chkSameAsShipping2').attr("checked", "checked");
    }

    if (data.fields.IsSupplier === true) {
        // $('#isformcontractor')
        $('#chkSameAsSupplier').attr("checked", "checked");
    } else {
        $('#chkSameAsSupplier').removeAttr("checked");
    }

    setTimeout(function () {
        $('#addCustomerModal').modal('show');
    }, 200);
}

function setTaxCodeVS1() {
    purchaseService.getTaxCodesVS1().then(function (data) {
        setTaxRateData(data);
    }).catch(function (err) {
        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
        $(".fullScreenSpin").css("display", "none");
        // Meteor._reload.reload();
    });
}
function setTaxRateData(data) {
    let lineItems = [];
    let lineItemObj = {};
    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
        if (data.ttaxcodevs1[i].CodeName === taxRateDataName) {
            $("#edtTaxNamePop").attr("readonly", true);
            let taxRate = (
                data.ttaxcodevs1[i].Rate * 100
            ).toFixed(2);
            var taxRateID = data.ttaxcodevs1[i].Id || "";
            var taxRateName = data.ttaxcodevs1[i].CodeName || "";
            var taxRateDesc =
                data.ttaxcodevs1[i].Description || "";
            $("#edtTaxID").val(taxRateID);
            $("#edtTaxNamePop").val(taxRateName);
            $("#edtTaxRatePop").val(taxRate);
            $("#edtTaxDescPop").val(taxRateDesc);
            setTimeout(function () {
                $("#newTaxRateModal").modal("toggle");
            }, 100);
        }
    }
}

function setCalculated2(taxcodeList, customerList) {
    let $tblrows = $("#tblrecontransactiondetail tbody tr");
    let lineAmount = 0;
    let subTotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;
    let grandTotal = 0;
    if (selectLineID) {
        let lineQty = parseInt($('#' + selectLineID + " .lineQty").val());
        let lineUnitPrice = $('#' + selectLineID + " .lineUnitPrice").val();
        lineUnitPrice = Number(lineUnitPrice.replace(/[^0-9.-]+/g, "")) || 0;
        $('#' + selectLineID + " .lineSubTotal").text(utilityService.modifynegativeCurrencyFormat(lineQty * lineUnitPrice));
        let lineTaxRate = $('#' + selectLineID + " .lineTaxRate").val();
        let lineTaxRateVal = 0;
        if (lineTaxRate !== "") {
            for (let i = 0; i < taxcodeList.length; i++) {
                if (taxcodeList[i].codename === lineTaxRate) {
                    lineTaxRateVal = taxcodeList[i].coderate;
                }
            }
        }
        // let lineUnitPriceInc = lineUnitPrice + lineUnitPrice * lineTaxRateVal /100;
        // $('#' + selectLineID + " .lineUnitPriceInc").text(utilityService.modifynegativeCurrencyFormat(lineUnitPriceInc));
        let lineTaxAmount = lineQty * lineUnitPrice * lineTaxRateVal /100;
        $('#' + selectLineID + " .lineTaxAmount").text(utilityService.modifynegativeCurrencyFormat(lineTaxAmount));
        let lineAccountName = $('#' + selectLineID + " .lineAccountName").val();
        let lineDiscountRate = 0;
        if (lineAccountName !== "") {
            let customerDetail = customerList.filter(customer => {
                return customer.customername === lineAccountName
            });
            customerDetail = customerDetail[0];
            lineDiscountRate = customerDetail.discount;
        }
        let lineDiscount = (lineQty * lineUnitPrice + lineTaxAmount) * lineDiscountRate/100;
        $('#' + selectLineID + " .lineDiscount").text(utilityService.modifynegativeCurrencyFormat(lineDiscount));
        lineAmount = lineQty * lineUnitPrice + lineTaxAmount - lineDiscount;
        $('#' + selectLineID + " .lineAmount").text(utilityService.modifynegativeCurrencyFormat(lineAmount));
    }

    $tblrows.each(function (index) {
        const $tblrow = $(this);
        let lineSubTotal = $tblrow.find(".lineSubTotal").text();
        lineSubTotal = Number(lineSubTotal.replace(/[^0-9.-]+/g, "")) || 0;
        let lineTaxAmount = $tblrow.find(".lineTaxAmount").text();
        lineTaxAmount = Number(lineTaxAmount.replace(/[^0-9.-]+/g, "")) || 0;
        let lineDiscount = $tblrow.find(".lineDiscount").text();
        lineDiscount = Number(lineDiscount.replace(/[^0-9.-]+/g, "")) || 0;
        let lineAmount = $tblrow.find(".lineAmount").text();
        lineAmount = Number(lineAmount.replace(/[^0-9.-]+/g, "")) || 0;

        subTotal += lineSubTotal;
        taxTotal += lineTaxAmount;
        discountTotal += lineDiscount;
        grandTotal += lineAmount;
    });
    $(".sub_total").text(utilityService.modifynegativeCurrencyFormat(subTotal));
    $(".tax_total").text(utilityService.modifynegativeCurrencyFormat(taxTotal));
    $(".discount_total").text(utilityService.modifynegativeCurrencyFormat(discountTotal));
    $(".grand_total").text(utilityService.modifynegativeCurrencyFormat(grandTotal));
}
