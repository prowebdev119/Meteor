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
    AccountService
} from "../accounts/account-service";
import {
    UtilityService
} from "../utility-service";
import {
    SideBarService
} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
import draggableCharts from "../js/Charts/draggableCharts";
import ChartHandler from "../js/Charts/ChartHandler";
import Tvs1CardPreference from "../js/Api/Model/Tvs1CardPreference";
import Tvs1CardPreferenceFields from "../js/Api/Model/Tvs1CardPreferenceFields";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
const _tabGroup = 11;
Template.vs1shipping.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.vs1shipping.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let accountService = new AccountService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];
    setTimeout(function() {
        $("#barcodeScanInput").focus();
    }, 200);

    if (FlowRouter.current().queryParams.success) {
        $('.btnRefresh').addClass('btnRefreshAlert');
    }

    function onScanSuccess(decodedText, decodedResult) {
        //document.getElementById("barcodeScanInput").value = decodedText;
        $('.fullScreenSpin').css('display', 'inline-block');
        var barcode = decodedText.toUpperCase();
        $('#scanBarcodeModalShippingOverview').modal('toggle');
        if (barcode != '') {
            if (barcode.length <= 2) {
                $('.fullScreenSpin').css('display', 'none');
                swal('<strong>WARNING:</strong> Invalid Barcode "' + barcode + '"', '', 'warning');
                DangerSound();
                e.preventDefault();
            } else {
                var segs = barcode.split('-');
                if (segs[0] == Barcode_Prefix_Sale) {
                    var sales_ID = segs[1];
                    var erpGet = erpDb();
                    var oReqSID = new XMLHttpRequest();
                    oReqSID.open("GET", 'https://' + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/SaleGroup?SaleID=' + sales_ID, true);
                    oReqSID.setRequestHeader("database", erpGet.ERPDatabase);
                    oReqSID.setRequestHeader("username", erpGet.ERPUsername);
                    oReqSID.setRequestHeader("password", erpGet.ERPPassword);
                    oReqSID.send();

                    oReqSID.timeout = 30000;
                    oReqSID.onreadystatechange = function() {
                        if (oReqSID.readyState == 4 && oReqSID.status == 200) {
                            var dataListRet = JSON.parse(oReqSID.responseText)
                            for (var event in dataListRet) {
                                var dataCopy = dataListRet[event];
                                for (var data in dataCopy) {
                                    var mainData = dataCopy[data];
                                    var salesType = mainData.TransactionType;
                                    var salesID = mainData.SaleID;
                                }
                            }
                            if (salesType == "Invoice") {
                                window.open('/shippingdocket?id=' + salesID, '_self');
                            } else {
                                $('.fullScreenSpin').css('display', 'none');

                                swal('<strong>WARNING:</strong> No Invoice with that number "' + barcode + '"', '', 'warning');
                                DangerSound();
                                e.preventDefault();
                            }


                        }


                    }


                } else if (segs[0] == Barcode_Prefix_SalesLine) {
                    var salesLine_ID = segs[1];
                    var erpGet = erpDb();
                    var oReqSLineID = new XMLHttpRequest();
                    oReqSLineID.open("GET", 'https://' + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/SaleGroup?SaleLineID=' + salesLine_ID, true);
                    oReqSLineID.setRequestHeader("database", erpGet.ERPDatabase);
                    oReqSLineID.setRequestHeader("username", erpGet.ERPUsername);
                    oReqSLineID.setRequestHeader("password", erpGet.ERPPassword);
                    oReqSLineID.send();

                    oReqSLineID.timeout = 30000;
                    oReqSLineID.onreadystatechange = function() {
                        if (oReqSLineID.readyState == 4 && oReqSLineID.status == 200) {
                            var dataListRet = JSON.parse(oReqSLineID.responseText)
                            for (var event in dataListRet) {
                                var dataCopy = dataListRet[event];
                                for (var data in dataCopy) {
                                    var mainData = dataCopy[data];
                                    var salesType = mainData.TransactionType;
                                    var salesID = mainData.SaleID;
                                }
                            }
                            if (salesType == "Invoice") {
                                window.open('/shippingdocket?id=' + salesID, '_self');

                            } else {
                                $('.fullScreenSpin').css('display', 'none');
                                swal('WARNING: Could not find any Sales associated with this barcode "' + barcode + '"', 'warning', 'fixed-top', 'fa-frown-o');
                                e.preventDefault();
                            }


                        }


                    }



                } else {
                    $('.fullScreenSpin').css('display', 'none');
                    swal('WARNING: Could not find any Sales associated with this barcode "' + barcode + '"', 'warning', 'fixed-top', 'fa-frown-o');
                    e.preventDefault();
                }
            }
        }
    }

    var html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-readershippingoverview", {
            fps: 10,
            qrbox: 250,
            rememberLastUsedCamera: true
        });
    html5QrcodeScanner.render(onScanSuccess);

    var isMobile = false;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    }
    if (isMobile == true) {
        setTimeout(function() {
        document.getElementById("scanBarcode").style.display = "none";
        document.getElementById("btnMobileBarcodeScan").style.display = "block";
        }, 500);
    }

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    templateObject.getAllSalesOrderData = function() {
        getVS1Data('TInvoiceBackOrder').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllBackOrderInvoiceList(initialDataLoad, 0).then(function(data) {
                    addVS1Data('TInvoiceBackOrder', JSON.stringify(data));
                    let lineItems = [];
                    let lineItemObj = {};

                    for (let i = 0; i < data.tinvoicebackorder.length; i++) {
                        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalAmountEx) || 0.00;
                        let totalTax = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalTax) || 0.00;
                        // Currency+''+data.tinvoicebackorder[i].fields.TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalAmountInc) || 0.00;
                        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalPaid) || 0.00;
                        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalBalance) || 0.00;
                        var dataList = {
                            id: data.tinvoicebackorder[i].fields.ID || '',
                            employee: data.tinvoicebackorder[i].fields.EmployeeName || '',
                            sortdate: data.tinvoicebackorder[i].fields.SaleDate != '' ? moment(data.tinvoicebackorder[i].fields.SaleDate).format("YYYY/MM/DD") : data.tinvoicebackorder[i].fields.SaleDate,
                            saledate: data.tinvoicebackorder[i].fields.SaleDate != '' ? moment(data.tinvoicebackorder[i].fields.SaleDate).format("DD/MM/YYYY") : data.tinvoicebackorder[i].fields.SaleDate,
                            duedate: data.tinvoicebackorder[i].fields.DueDate != '' ? moment(data.tinvoicebackorder[i].fields.DueDate).format("DD/MM/YYYY") : data.tinvoicebackorder[i].fields.DueDate,
                            customername: data.tinvoicebackorder[i].fields.ClientName || '',
                            totalamountex: totalAmountEx || 0.00,
                            totaltax: totalTax || 0.00,
                            totalamount: totalAmount || 0.00,
                            totalpaid: totalPaid || 0.00,
                            totaloustanding: totalOutstanding || 0.00,
                            department: data.tinvoicebackorder[i].fields.SaleClassName || '',
                            custfield1: data.tinvoicebackorder[i].fields.UOM || '',
                            custfield2: data.tinvoicebackorder[i].fields.SaleTerms || '',
                            comments: data.tinvoicebackorder[i].fields.SaleComments || '',
                            qtybackorder: data.tinvoicebackorder[i].fields.QtyBackOrder || '',
                            product: data.tinvoicebackorder[i].fields.ProductPrintName || '',
                            // shipdate:data.tinvoicebackorder[i].fields.ShipDate !=''? moment(data.tinvoicebackorder[i].fields.ShipDate).format("DD/MM/YYYY"): data.tinvoicebackorder[i].fields.ShipDate,

                        };

                        //if(data.tinvoicebackorder[i].fields.IsBackOrder == true){
                        dataTableList.push(dataList);
                        //}
                        //}
                    }

                    templateObject.datatablerecords.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblShipping', function(error, result) {
                            if (error) {

                            } else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.split('.')[1];
                                        let columnWidth = customcolumn[i].width;
                                        let columnindex = customcolumn[i].index + 1;

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


                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                    }

                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function() {
                        $('#tblShipping').DataTable({
                            columnDefs: [{
                                type: 'date',
                                targets: -1
                            }],
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Shipping List" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible',
                                    format: {
                                        body: function(data, row, column) {
                                            if (data.includes("</span>")) {
                                                var res = data.split("</span>");
                                                data = res[1];
                                            }

                                            return column === 1 ? data.replace(/<.*?>/ig, "") : data;

                                        }
                                    }
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Shipping List',
                                filename: "Shipping List" + moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            // bStateSave: true,
                            // rowId: 0,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [
                                [initialDatatableLoad, -1],
                                [initialDatatableLoad, "All"]
                            ],
                            info: true,
                            responsive: true,
                            "order": [
                                [4, "desc"],
                                [1, "desc"]
                            ],
                            action: function() {
                                $('#tblShipping').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function(oSettings) {
                                setTimeout(function() {
                                    MakeNegative();
                                }, 100);
                            },
                            "fnInitComplete": function() {
                                $("<button class='btn btn-primary btnRefreshShipping' type='button' id='btnRefreshStockAdjustment' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblShipping_filter");
                            }

                        }).on('page', function() {
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.datatablerecords.get();
                            templateObject.datatablerecords.set(draftRecord);
                        }).on('column-reorder', function() {

                        }).on('length.dt', function(e, settings, len) {
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                        });

                        // $('#tblShipping').DataTable().column( 0 ).visible( true );
                        $('.fullScreenSpin').css('display', 'none');
                    }, 0);

                    var columns = $('#tblShipping th');
                    let sTible = "";
                    let sWidth = "";
                    let sIndex = "";
                    let sVisible = "";
                    let columVisible = false;
                    let sClass = "";
                    $.each(columns, function(i, v) {
                        if (v.hidden == false) {
                            columVisible = true;
                        }
                        if ((v.className.includes("hiddenColumn"))) {
                            columVisible = false;
                        }
                        sWidth = v.style.width.replace('px', "");

                        let datatablerecordObj = {
                            sTitle: v.innerText || '',
                            sWidth: sWidth || '',
                            sIndex: v.cellIndex || '',
                            sVisible: columVisible || false,
                            sClass: v.className || ''
                        };
                        tableHeaderList.push(datatablerecordObj);
                    });
                    templateObject.tableheaderrecords.set(tableHeaderList);
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');
                    $('#tblShipping tbody').on('click', 'tr', function() {
                        var listData = $(this).closest('tr').attr('id');
                        if (listData) {
                            FlowRouter.go('/shippingdocket?id=' + listData);
                        }
                    });

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tinvoicebackorder;
                let lineItems = [];
                let lineItemObj = {};

                for (let i = 0; i < data.tinvoicebackorder.length; i++) {
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalAmountEx) || 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalTax) || 0.00;
                    // Currency+''+data.tinvoicebackorder[i].fields.TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalAmountInc) || 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalPaid) || 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalBalance) || 0.00;
                    var dataList = {
                        id: data.tinvoicebackorder[i].fields.ID || '',
                        employee: data.tinvoicebackorder[i].fields.EmployeeName || '',
                        sortdate: data.tinvoicebackorder[i].fields.SaleDate != '' ? moment(data.tinvoicebackorder[i].fields.SaleDate).format("YYYY/MM/DD") : data.tinvoicebackorder[i].fields.SaleDate,
                        saledate: data.tinvoicebackorder[i].fields.SaleDate != '' ? moment(data.tinvoicebackorder[i].fields.SaleDate).format("DD/MM/YYYY") : data.tinvoicebackorder[i].fields.SaleDate,
                        duedate: data.tinvoicebackorder[i].fields.DueDate != '' ? moment(data.tinvoicebackorder[i].fields.DueDate).format("DD/MM/YYYY") : data.tinvoicebackorder[i].fields.DueDate,
                        customername: data.tinvoicebackorder[i].fields.ClientName || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        department: data.tinvoicebackorder[i].fields.SaleClassName || '',
                        custfield1: data.tinvoicebackorder[i].fields.UOM || '',
                        custfield2: data.tinvoicebackorder[i].fields.SaleTerms || '',
                        comments: data.tinvoicebackorder[i].fields.SaleComments || '',
                        qtybackorder: data.tinvoicebackorder[i].fields.QtyBackOrder || '',
                        product: data.tinvoicebackorder[i].fields.ProductPrintName || '',
                        // shipdate:data.tinvoicebackorder[i].fields.ShipDate !=''? moment(data.tinvoicebackorder[i].fields.ShipDate).format("DD/MM/YYYY"): data.tinvoicebackorder[i].fields.ShipDate,

                    };

                    //if(data.tinvoicebackorder[i].fields.IsBackOrder == true){
                    dataTableList.push(dataList);
                    //}
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblShipping', function(error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

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


                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function() {
                    $('#tblShipping').DataTable({
                        columnDefs: [{
                            type: 'date',
                            targets: 0
                        }],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "Shipping List" + moment().format(),
                            orientation: 'portrait',
                            exportOptions: {
                                columns: ':visible',
                                format: {
                                    body: function(data, row, column) {
                                        if (data.includes("</span>")) {
                                            var res = data.split("</span>");
                                            data = res[1];
                                        }

                                        return column === 1 ? data.replace(/<.*?>/ig, "") : data;

                                    }
                                }
                            }
                        }, {
                            extend: 'print',
                            download: 'open',
                            className: "btntabletopdf hiddenColumn",
                            text: '',
                            title: 'Shipping List',
                            filename: "Shipping List" + moment().format(),
                            exportOptions: {
                                columns: ':visible',
                                stripHtml: false
                            }
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "order": [
                            [4, "desc"],
                            [1, "desc"]
                        ],
                        action: function() {
                            $('#tblShipping').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function(oSettings) {
                            $('.paginate_button.page-item').removeClass('disabled');
                            $('#tblShipping_ellipsis').addClass('disabled');

                            if (oSettings._iDisplayLength == -1) {
                                if (oSettings.fnRecordsDisplay() > 150) {
                                    $('.paginate_button.page-item.previous').addClass('disabled');
                                    $('.paginate_button.page-item.next').addClass('disabled');
                                }
                            } else {

                            }
                            if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                                $('.paginate_button.page-item.next').addClass('disabled');
                            }

                            $('.paginate_button.next:not(.disabled)', this.api().table().container())
                                .on('click', function() {
                                    $('.fullScreenSpin').css('display', 'inline-block');
                                    let dataLenght = oSettings._iDisplayLength;

                                    sideBarService.getAllBackOrderInvoiceList(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                        getVS1Data('TInvoiceBackOrder').then(function(dataObjectold) {
                                            if (dataObjectold.length == 0) {

                                            } else {
                                                let dataOld = JSON.parse(dataObjectold[0].data);

                                                var thirdaryData = $.merge($.merge([], dataObjectnew.tinvoicebackorder), dataOld.tinvoicebackorder);
                                                let objCombineData = {
                                                    tinvoicebackorder: thirdaryData
                                                }


                                                addVS1Data('TInvoiceBackOrder', JSON.stringify(objCombineData)).then(function(datareturn) {
                                                    templateObject.resetData(objCombineData);
                                                    $('.fullScreenSpin').css('display', 'none');
                                                }).catch(function(err) {
                                                    $('.fullScreenSpin').css('display', 'none');
                                                });

                                            }
                                        }).catch(function(err) {

                                        });

                                    }).catch(function(err) {
                                        $('.fullScreenSpin').css('display', 'none');
                                    });

                                });
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function() {
                            let urlParametersPage = FlowRouter.current().queryParams.page;
                            if (urlParametersPage) {
                                this.fnPageChange('last');
                            }
                            $("<button class='btn btn-primary btnRefreshShipping' type='button' id='btnRefreshStockAdjustment' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblShipping_filter");
                        }

                    }).on('page', function() {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function() {

                    }).on('length.dt', function(e, settings, len) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        let dataLenght = settings._iDisplayLength;
                        if (dataLenght == -1) {
                            if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                                $('.fullScreenSpin').css('display', 'none');
                            } else {
                                sideBarService.getAllBackOrderInvoiceList('All', 1).then(function(dataNonBo) {

                                    addVS1Data('TInvoiceBackOrder', JSON.stringify(dataNonBo)).then(function(datareturn) {
                                        templateObject.resetData(dataNonBo);
                                        $('.fullScreenSpin').css('display', 'none');
                                    }).catch(function(err) {
                                        $('.fullScreenSpin').css('display', 'none');
                                    });
                                }).catch(function(err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }
                        } else {
                            if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                                $('.fullScreenSpin').css('display', 'none');
                            } else {
                                sideBarService.getAllBackOrderInvoiceList(dataLenght, 0).then(function(dataNonBo) {

                                    addVS1Data('TInvoiceBackOrder', JSON.stringify(dataNonBo)).then(function(datareturn) {
                                        templateObject.resetData(dataNonBo);
                                        $('.fullScreenSpin').css('display', 'none');
                                    }).catch(function(err) {
                                        $('.fullScreenSpin').css('display', 'none');
                                    });
                                }).catch(function(err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }
                        }
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#tblShipping').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblShipping th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");

                    let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || '',
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderList.push(datatablerecordObj);
                });
                templateObject.tableheaderrecords.set(tableHeaderList);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');
                $('#tblShipping tbody').on('click', 'tr', function() {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        FlowRouter.go('/shippingdocket?id=' + listData);
                    }
                });

            }
        }).catch(function(err) {
            sideBarService.getAllBackOrderInvoiceList(initialDataLoad, 0).then(function(data) {
                addVS1Data('TInvoiceBackOrder', JSON.stringify(data));
                let lineItems = [];
                let lineItemObj = {};

                for (let i = 0; i < data.tinvoicebackorder.length; i++) {
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalAmountEx) || 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalTax) || 0.00;
                    // Currency+''+data.tinvoicebackorder[i].fields.TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalAmountInc) || 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalPaid) || 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tinvoicebackorder[i].fields.TotalBalance) || 0.00;
                    var dataList = {
                        id: data.tinvoicebackorder[i].fields.ID || '',
                        employee: data.tinvoicebackorder[i].fields.EmployeeName || '',
                        sortdate: data.tinvoicebackorder[i].fields.SaleDate != '' ? moment(data.tinvoicebackorder[i].fields.SaleDate).format("YYYY/MM/DD") : data.tinvoicebackorder[i].fields.SaleDate,
                        saledate: data.tinvoicebackorder[i].fields.SaleDate != '' ? moment(data.tinvoicebackorder[i].fields.SaleDate).format("DD/MM/YYYY") : data.tinvoicebackorder[i].fields.SaleDate,
                        duedate: data.tinvoicebackorder[i].fields.DueDate != '' ? moment(data.tinvoicebackorder[i].fields.DueDate).format("DD/MM/YYYY") : data.tinvoicebackorder[i].fields.DueDate,
                        customername: data.tinvoicebackorder[i].fields.ClientName || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        department: data.tinvoicebackorder[i].fields.SaleClassName || '',
                        custfield1: data.tinvoicebackorder[i].fields.UOM || '',
                        custfield2: data.tinvoicebackorder[i].fields.SaleTerms || '',
                        comments: data.tinvoicebackorder[i].fields.SaleComments || '',
                        qtybackorder: data.tinvoicebackorder[i].fields.QtyBackOrder || '',
                        product: data.tinvoicebackorder[i].fields.ProductPrintName || '',
                        // shipdate:data.tinvoicebackorder[i].fields.ShipDate !=''? moment(data.tinvoicebackorder[i].fields.ShipDate).format("DD/MM/YYYY"): data.tinvoicebackorder[i].fields.ShipDate,

                    };

                    //if(data.tinvoicebackorder[i].fields.IsBackOrder == true){
                    dataTableList.push(dataList);
                    //}
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblShipping', function(error, result) {
                        if (error) {

                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

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


                    setTimeout(function() {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function() {
                    $('#tblShipping').DataTable({
                        columnDefs: [
                            // {type: 'date', targets: 0}
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "Shipping List" + moment().format(),
                            orientation: 'portrait',
                            exportOptions: {
                                columns: ':visible',
                                format: {
                                    body: function(data, row, column) {
                                        if (data.includes("</span>")) {
                                            var res = data.split("</span>");
                                            data = res[1];
                                        }

                                        return column === 1 ? data.replace(/<.*?>/ig, "") : data;

                                    }
                                }
                            }
                        }, {
                            extend: 'print',
                            download: 'open',
                            className: "btntabletopdf hiddenColumn",
                            text: '',
                            title: 'Shipping List',
                            filename: "Shipping List" + moment().format(),
                            exportOptions: {
                                columns: ':visible',
                                stripHtml: false
                            }
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [
                            [initialDatatableLoad, -1],
                            [initialDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "order": [
                            [4, "desc"],
                            [1, "desc"]
                        ],
                        action: function() {
                            $('#tblShipping').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function(oSettings) {
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function() {
                            $("<button class='btn btn-primary btnRefreshShipping' type='button' id='btnRefreshStockAdjustment' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblShipping_filter");
                        }

                    }).on('page', function() {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function() {

                    }).on('length.dt', function(e, settings, len) {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#tblShipping').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblShipping th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
                    if (v.hidden == false) {
                        columVisible = true;
                    }
                    if ((v.className.includes("hiddenColumn"))) {
                        columVisible = false;
                    }
                    sWidth = v.style.width.replace('px', "");

                    let datatablerecordObj = {
                        sTitle: v.innerText || '',
                        sWidth: sWidth || '',
                        sIndex: v.cellIndex || '',
                        sVisible: columVisible || false,
                        sClass: v.className || ''
                    };
                    tableHeaderList.push(datatablerecordObj);
                });
                templateObject.tableheaderrecords.set(tableHeaderList);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');
                $('#tblShipping tbody').on('click', 'tr', function() {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        FlowRouter.go('/shippingdocket?id=' + listData);
                    }
                });

            }).catch(function(err) {

                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });

    }

    templateObject.getAllSalesOrderData();

    $("#barcodeScanInput").keyup(function(e) {

        if (e.keyCode == 13) {
            $('.fullScreenSpin').css('display', 'inline-block');
            var barcode = $(this).val().toUpperCase();
            if (barcode != '') {
                if (barcode.length <= 2) {
                    $('.fullScreenSpin').css('display', 'none');
                    swal('<strong>WARNING:</strong> Invalid Barcode "' + barcode + '"', '', 'warning');
                    DangerSound();
                    e.preventDefault();
                } else {
                    var segs = barcode.split('-');
                    if (segs[0] == Barcode_Prefix_Sale) {
                        var sales_ID = segs[1];
                        var erpGet = erpDb();
                        var oReqSID = new XMLHttpRequest();
                        oReqSID.open("GET", 'https://' + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/SaleGroup?SaleID=' + sales_ID, true);
                        oReqSID.setRequestHeader("database", erpGet.ERPDatabase);
                        oReqSID.setRequestHeader("username", erpGet.ERPUsername);
                        oReqSID.setRequestHeader("password", erpGet.ERPPassword);
                        oReqSID.send();

                        oReqSID.timeout = 30000;
                        oReqSID.onreadystatechange = function() {
                            if (oReqSID.readyState == 4 && oReqSID.status == 200) {
                                var dataListRet = JSON.parse(oReqSID.responseText)
                                for (var event in dataListRet) {
                                    var dataCopy = dataListRet[event];
                                    for (var data in dataCopy) {
                                        var mainData = dataCopy[data];
                                        var salesType = mainData.TransactionType;
                                        var salesID = mainData.SaleID;
                                    }
                                }
                                if (salesType == "Invoice") {
                                    window.open('/shippingdocket?id=' + salesID, '_self');
                                } else {
                                    $('.fullScreenSpin').css('display', 'none');
                                    // Bert.alert('<strong>WARNING:</strong> No Invoice with that number "'+barcode+'"', 'now-dangerorange');
                                    swal('<strong>WARNING:</strong> No Invoice with that number "' + barcode + '"', '', 'warning');
                                    DangerSound();
                                    e.preventDefault();
                                }


                            }

                            AddUERP(oReqSID.responseText);
                        }


                    } else if (segs[0] == Barcode_Prefix_SalesLine) {
                        var salesLine_ID = segs[1];
                        var erpGet = erpDb();
                        var oReqSLineID = new XMLHttpRequest();
                        oReqSLineID.open("GET", 'https://' + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/SaleGroup?SaleLineID=' + salesLine_ID, true);
                        oReqSLineID.setRequestHeader("database", erpGet.ERPDatabase);
                        oReqSLineID.setRequestHeader("username", erpGet.ERPUsername);
                        oReqSLineID.setRequestHeader("password", erpGet.ERPPassword);
                        oReqSLineID.send();

                        oReqSLineID.timeout = 30000;
                        oReqSLineID.onreadystatechange = function() {
                            if (oReqSLineID.readyState == 4 && oReqSLineID.status == 200) {
                                var dataListRet = JSON.parse(oReqSLineID.responseText)
                                for (var event in dataListRet) {
                                    var dataCopy = dataListRet[event];
                                    for (var data in dataCopy) {
                                        var mainData = dataCopy[data];
                                        var salesType = mainData.TransactionType;
                                        var salesID = mainData.SaleID;
                                    }
                                }
                                if (salesType == "Invoice") {
                                    window.open('/shippingdocket?id=' + salesID, '_self');

                                } else {
                                    $('.fullScreenSpin').css('display', 'none');
                                    swal('WARNING: Could not find any Sales associated with this barcode "' + barcode + '"', 'warning', 'fixed-top', 'fa-frown-o');
                                    e.preventDefault();
                                }


                            }

                            AddUERP(oReqSID.responseText);
                        }



                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                        swal('WARNING: Could not find any Sales associated with this barcode "' + barcode + '"', 'warning', 'fixed-top', 'fa-frown-o');
                        e.preventDefault();
                    }
                }
            }
        }
    });

    $("#scanBarcode").click(function() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

        } else {
            Bert.alert('<strong>Please Note:</strong> This function is only available on mobile devices!', 'now-dangerorange');
        }
    });
    templateObject.deactivateDraggable = () => {
        draggableCharts.disable();
    };
    templateObject.activateDraggable = () => {
        draggableCharts.enable();
    };

    templateObject.setCardPositions = async () => {
        let Tvs1CardPref = await getVS1Data('Tvs1CardPreference');
        const cardList = [];
        if( Tvs1CardPref.length ){
            let Tvs1CardPreferenceData = JSON.parse(Tvs1CardPref[0].data);
            let employeeID = Session.get("mySessionEmployeeLoggedID");
            cardList = new Tvs1CardPreference.fromList(
                Tvs1CardPreferenceData.tvs1cardpreference
            ).filter((card) => {
                if ( parseInt( card.fields.EmployeeID ) == employeeID && parseInt( card.fields.TabGroup ) == _tabGroup ) {
                return card;
                }
            });
        }

        if( cardList.length ){
            let cardcount = 0;
            cardList.forEach((card) => {
            $(`[card-key='${card.fields.CardKey}']`).attr("position", card.fields.Position);
            $(`[card-key='${card.fields.CardKey}']`).attr("card-active", card.fields.Active);
            if( card.fields.Active == false ){
                cardcount++;
                $(`[card-key='${card.fields.CardKey}']`).addClass("hideelement");
                $(`[card-key='${card.fields.CardKey}']`).find('.cardShowBtn .far').removeClass('fa-eye');
                $(`[card-key='${card.fields.CardKey}']`).find('.cardShowBtn .far').addClass('fa-eye-slash');
            }
            })
            if( cardcount == cardList.length ){
            $('.card-visibility').eq(0).removeClass('hideelement')
            }
            let $chartWrappper = $(".connectedCardSortable");
            $chartWrappper
            .find(".card-visibility")
            .sort(function (a, b) {
                return +a.getAttribute("position") - +b.getAttribute("position");
            })
            .appendTo($chartWrappper);
        }
    };
    templateObject.setCardPositions();

    templateObject.saveCards = async () => {
        // Here we get that list and create and object
        const cards = $(".connectedCardSortable .card-visibility");
        const cardList = [];
        let Tvs1CardPref = await getVS1Data('Tvs1CardPreference');
        if( Tvs1CardPref.length ){
            let Tvs1CardPreferenceData = JSON.parse(Tvs1CardPref[0].data);
            let employeeID = Session.get("mySessionEmployeeLoggedID");
            cardList = new Tvs1CardPreference.fromList(
                Tvs1CardPreferenceData.tvs1cardpreference
            ).filter((card) => {
                if ( parseInt( card.fields.EmployeeID ) != employeeID && parseInt( card.fields.TabGroup ) != _tabGroup ) {
                return card;
                }
            });
        }

        for (let i = 0; i < cards.length; i++) {
            cardList.push(
            new Tvs1CardPreference({
                type: "Tvs1CardPreference",
                fields: new Tvs1CardPreferenceFields({
                EmployeeID: Session.get("mySessionEmployeeLoggedID"),
                CardKey: $(cards[i]).attr("card-key"),
                Position: $(cards[i]).attr("position"),
                TabGroup: _tabGroup,
                Active: ( $(cards[i]).attr("card-active") == 'true' )? true : false
                })
            })
            );
        }
        let updatedTvs1CardPreference = {
            tvs1cardpreference: cardList,
        }
        await addVS1Data('Tvs1CardPreference', JSON.stringify(updatedTvs1CardPreference));
    };

    templateObject.activateDraggable();
    $(".connectedCardSortable")
    .sortable({
      disabled: false,
      connectWith: ".connectedCardSortable",
      placeholder: "portlet-placeholder ui-corner-all",
      stop: async (event, ui) => {
        // Here we rebuild positions tree in html
        ChartHandler.buildCardPositions(
          $(".connectedCardSortable .card-visibility")
        );

        // Here we save card list
        templateObject.saveCards()
      },
    })
    .disableSelection();
});

Template.vs1shipping.events({
    'click .btnDesktopSearch': function(e) {
        let barcodeData = $('#barcodeScanInput').val();
        $('.fullScreenSpin').css('display', 'inline-block');
        if (barcodeData === '') {
            swal('Please enter the barcode', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
            return false;
        }

        var barcode = $('#barcodeScanInput').val().toUpperCase();
        if (barcode != '') {
            if (barcode.length <= 2) {
                $('.fullScreenSpin').css('display', 'none');
                Bert.alert('<strong>WARNING:</strong> Invalid Barcode "' + barcode + '"', 'now-dangerorange');
                DangerSound();
                e.preventDefault();
            } else {
                var segs = barcode.split('-');
                if (segs[0] == Barcode_Prefix_Sale) {
                    var sales_ID = segs[1];
                    var erpGet = erpDb();
                    var oReqSID = new XMLHttpRequest();
                    oReqSID.open("GET", 'https://' + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/SaleGroup?SaleID=' + sales_ID, true);
                    oReqSID.setRequestHeader("database", erpGet.ERPDatabase);
                    oReqSID.setRequestHeader("username", erpGet.ERPUsername);
                    oReqSID.setRequestHeader("password", erpGet.ERPPassword);
                    oReqSID.send();

                    oReqSID.timeout = 30000;
                    oReqSID.onreadystatechange = function() {
                        if (oReqSID.readyState == 4 && oReqSID.status == 200) {
                            var dataListRet = JSON.parse(oReqSID.responseText)
                            for (var event in dataListRet) {
                                var dataCopy = dataListRet[event];
                                for (var data in dataCopy) {
                                    var mainData = dataCopy[data];
                                    var salesType = mainData.TransactionType;
                                    var salesID = mainData.SaleID;
                                }
                            }
                            if (salesType == "Invoice") {
                                window.open('/shippingdocket?id=' + salesID, '_self');
                            } else {
                                $('.fullScreenSpin').css('display', 'none');
                                swal('<strong>WARNING:</strong> No Invoice with that number "' + barcode + '"', '', 'warning');
                                DangerSound();
                                e.preventDefault();
                            }


                        }

                        AddUERP(oReqSID.responseText);
                    }


                } else if (segs[0] == Barcode_Prefix_SalesLine) {
                    var salesLine_ID = segs[1];
                    var erpGet = erpDb();
                    var oReqSLineID = new XMLHttpRequest();
                    oReqSLineID.open("GET", 'https://' + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/SaleGroup?SaleLineID=' + salesLine_ID, true);
                    oReqSLineID.setRequestHeader("database", erpGet.ERPDatabase);
                    oReqSLineID.setRequestHeader("username", erpGet.ERPUsername);
                    oReqSLineID.setRequestHeader("password", erpGet.ERPPassword);
                    oReqSLineID.send();

                    oReqSLineID.timeout = 30000;
                    oReqSLineID.onreadystatechange = function() {
                        if (oReqSLineID.readyState == 4 && oReqSLineID.status == 200) {
                            var dataListRet = JSON.parse(oReqSLineID.responseText)
                            for (var event in dataListRet) {
                                var dataCopy = dataListRet[event];
                                for (var data in dataCopy) {
                                    var mainData = dataCopy[data];
                                    var salesType = mainData.TransactionType;
                                    var salesID = mainData.SaleID;
                                }
                            }
                            if (salesType == "Invoice") {
                                window.open('/shippingdocket?id=' + salesID, '_self');

                            } else {
                                $('.fullScreenSpin').css('display', 'none');
                                swal('WARNING: Could not find any Sales associated with this barcode "' + barcode + '"', 'warning', 'fixed-top', 'fa-frown-o');
                                e.preventDefault();
                            }


                        }

                        AddUERP(oReqSID.responseText);
                    }



                } else {
                    $('.fullScreenSpin').css('display', 'none');
                    swal('WARNING: Could not find any Sales associated with this barcode "' + barcode + '"', 'warning', 'fixed-top', 'fa-frown-o');
                    e.preventDefault();
                }
            }
        }

    },
    'click .chkDatatable': function(event) {
        var columns = $('#tblShipping th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function(i, v) {
            let className = v.classList;
            let replaceClass = className[1];

            if (v.innerText == columnDataValue) {
                if ($(event.target).is(':checked')) {
                    $("." + replaceClass + "").css('display', 'table-cell');
                    $("." + replaceClass + "").css('padding', '.75rem');
                    $("." + replaceClass + "").css('vertical-align', 'top');
                } else {
                    $("." + replaceClass + "").css('display', 'none');
                }
            }
        });
    },
    'click .resetTable': function(event) {
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
                    PrefName: 'tblShipping'
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
    'click .saveTable': function(event) {
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
                    PrefName: 'tblShipping'
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
                            PrefName: 'tblShipping',
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
                        PrefGroup: 'salesform',
                        PrefName: 'tblShipping',
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
    'blur .divcolumn': function(event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#tblShipping').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function(event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblShipping th');
        $.each(datable, function(i, v) {

            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'keyup #tblShipping_filter input': function(event) {
        if ($(event.target).val() != '') {
            $(".btnRefreshShipping").addClass('btnSearchAlert');
        } else {
            $(".btnRefreshShipping").removeClass('btnSearchAlert');
        }
        if (event.keyCode == 13) {
            $(".btnRefreshShipping").trigger("click");
        }
    },
    'click .btnRefreshShipping': function(event) {
        $(".btnRefresh").trigger("click");
    },
    'click .btnOpenSettings': function(event) {
        let templateObject = Template.instance();
        var columns = $('#tblShipping th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
                columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");

            let datatablerecordObj = {
                sTitle: v.innerText || '',
                sWidth: sWidth || '',
                sIndex: v.cellIndex || '',
                sVisible: columVisible || false,
                sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
        });
        templateObject.tableheaderrecords.set(tableHeaderList);
    },
    'click #exportbtn': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblShipping_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');

        let templateObject = Template.instance();
        sideBarService.getAllBackOrderInvoiceList(initialDataLoad, 0).then(function(dataBO) {
            addVS1Data('TInvoiceBackOrder', JSON.stringify(dataBO)).then(function(datareturn) {
                window.open('/vs1shipping', '_self');
            }).catch(function(err) {
                window.open('/vs1shipping', '_self');
            });
        }).catch(function(err) {
            window.open('/vs1shipping', '_self');
        });

    },
    'click .printConfirm': function(event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblShipping_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    //handle cards buttons
    "click .editCardBtn": function (e) {
        e.preventDefault();
        $(".card-visibility").removeClass('hideelement');
        if( $('.editCardBtn').find('i').hasClass('fa-cog') ){
            $('.cardShowBtn').removeClass('hideelement');
            $('.editCardBtn').find('i').removeClass('fa-cog')
            $('.editCardBtn').find('i').addClass('fa-save')
        }else{
            $('.cardShowBtn').addClass('hideelement');
            $('.editCardBtn').find('i').removeClass('fa-save')
            $('.editCardBtn').find('i').addClass('fa-cog')
            let templateObject = Template.instance();
            templateObject.setCardPositions();
        }
        if( $('.card-visibility').hasClass('dimmedChart') ){
            $('.card-visibility').removeClass('dimmedChart');
        }else{
            $('.card-visibility').addClass('dimmedChart');
        }
        return false
    },
    "click .cardShowBtn": function(e){
        e.preventDefault();
        if( $(e.target).find('.far').hasClass('fa-eye') ){
            $(e.target).find('.far').removeClass('fa-eye')
            $(e.target).find('.far').addClass('fa-eye-slash')
            $(e.target).parents('.card-visibility').attr('card-active', 'false')
        }else{
            $(e.target).find('.far').removeClass('fa-eye-slash')
            $(e.target).find('.far').addClass('fa-eye')
            $(e.target).parents('.card-visibility').attr('card-active', 'true')
        }
        let templateObject = Template.instance();
        templateObject.saveCards()
        return false
    },
});

Template.vs1shipping.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.saledate == 'NA') {
                return 1;
            } else if (b.saledate == 'NA') {
                return -1;
            }
            return (a.saledate.toUpperCase() > b.saledate.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblShipping'
        });
    }
});
