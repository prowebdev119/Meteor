import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    EmployeeProfileService
} from './profile-service';
import {
    AccessLevelService
} from './accesslevel-service';
import {
    CoreService
} from '../js/core-service';

import {
    ProductService
} from "../product/product-service";
import {
    UtilityService
} from "../utility-service";
import {
    OrganisationService
} from './organisation-service';
import {
    SideBarService
} from '../js/sidebar-service';

let utilityService = new UtilityService();
let productService = new ProductService();
let organizationService = new OrganisationService();
let sideBarService = new SideBarService();
Template.header.onCreated(function() {
    const templateObject = Template.instance();

    templateObject.isCloudUserPass = new ReactiveVar();
    templateObject.isCloudUserPass.set(false);

    templateObject.includeDashboard = new ReactiveVar();
    templateObject.includeDashboard.set(false);
    templateObject.includeMain = new ReactiveVar();
    templateObject.includeMain.set(false);
    templateObject.includeInventory = new ReactiveVar();
    templateObject.includeInventory.set(false);
    templateObject.includeManufacturing = new ReactiveVar();
    templateObject.includeManufacturing.set(false);
    templateObject.includeAccessLevels = new ReactiveVar();
    templateObject.includeAccessLevels.set(false);
    templateObject.includeShipping = new ReactiveVar();
    templateObject.includeShipping.set(false);
    templateObject.includeStockTransfer = new ReactiveVar();
    templateObject.includeStockTransfer.set(false);
    templateObject.includeStockTake = new ReactiveVar();
    templateObject.includeStockTake.set(false);
    templateObject.includeSales = new ReactiveVar();
    templateObject.includeSales.set(false);
    templateObject.includeExpenseClaims = new ReactiveVar();
    templateObject.includeExpenseClaims.set(false);
    templateObject.includeFixedAssets = new ReactiveVar();
    templateObject.includeFixedAssets.set(false);
    templateObject.includePurchases = new ReactiveVar();
    templateObject.includePurchases.set(false);


    templateObject.includePayments = new ReactiveVar();
    templateObject.includePayments.set(false);
    templateObject.includeContacts = new ReactiveVar();
    templateObject.includeContacts.set(false);
    templateObject.includeAccounts = new ReactiveVar();
    templateObject.includeAccounts.set(false);
    templateObject.includeReports = new ReactiveVar();
    templateObject.includeReports.set(false);
    templateObject.includeSettings = new ReactiveVar();
    templateObject.includeSettings.set(false);

    templateObject.isCloudSidePanelMenu = new ReactiveVar();
    templateObject.isCloudSidePanelMenu.set(false);
    templateObject.isCloudTopPanelMenu = new ReactiveVar();
    templateObject.isCloudTopPanelMenu.set(false);


    templateObject.profilePhoto = new ReactiveVar();

    templateObject.searchdatatablerecords = new ReactiveVar([]);


    $(document).ready(function() {

        var loc = FlowRouter.current().path;

    });

});

Template.header.onRendered(function() {
    const templateObject = Template.instance();
    let sidePanelToggle = Session.get('sidePanelToggle');

    var dontOpenSearchGuide = localStorage.getItem('dontopensearchguide')||'false';
    setTimeout(function() {
    if(dontOpenSearchGuide == 'true' || dontOpenSearchGuide == true){
      $(".chkOpenByDefault").prop("checked", true);
    }else{
      $(".chkOpenByDefault").prop("checked", false);
    }
  }, 200);
    var isMobile = false;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    }
    if (isMobile == true) {
        document.getElementById("scanBarcodeHeadTop").style.display = "none";
        document.getElementById("mobileBarcodeScan").style.display = "block";
        document.getElementById("scanBarcodeHeadTop2").style.display = "none";
        document.getElementById("mobileBarcodeScan2").style.display = "block";
    }


    $(document).ready(function() {
        $('.btnClose').on('click', function (event) {
            $('#searchGuideModal').modal('hide');
            if(isMobile == true) {
                $('.txtGlobalSearchMobile').focus();
            } else {
                $('.txtGlobalSearch').focus();
            }
        });

});

    $("#scanBarcodeHeadTop").click(function() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

        } else {
            Bert.alert('<strong>Please Note:</strong> This function is only available on mobile devices!', 'now-dangerorange');
        }
    });


    templateObject.getAllGlobalSearch = function(searchName) {
        $('.fullScreenSpin').css('display', 'inline-block');

        function checkStockColor() {
            $('td.colTransStatus').each(function() {
                if ($(this).text() == "Processed") {
                    $(this).addClass('isProcessedColumn');
                } else if ($(this).text() == "On Hold") {
                    $(this).addClass('isOnHoldColumn');
                }

            });
        };



        if (searchName.length <= 2) {
            productService.getGlobalSearchReport(searchName).then(function(data) {
                let dataSelectID = '';
                let isProcessed = '';
                var splashArrayList = new Array();
                var splashArrayListDupp = new Array();
                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function() {
                    $('#tblSearchOverview_filter .form-control-sm').val(searchName);
                }, 200);
                let dataTableList = [];
                let dataTableListDupp = [];
                for (let i = 0; i < data.tglobalsearchreport.length; i++) {
                    if (data.tglobalsearchreport[i].Type === "Purchase Order") {
                        dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
                    } else if (data.tglobalsearchreport[i].Type === "Bill") {
                        dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
                    } else if (data.tglobalsearchreport[i].Type === "Credit") {
                        dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
                    } else if (data.tglobalsearchreport[i].Type === "Customer Payment") {
                        dataSelectID = data.tglobalsearchreport[i].PaymentID;
                    } else if (data.tglobalsearchreport[i].Type === "Supplier Payment") {
                        dataSelectID = data.tglobalsearchreport[i].PaymentID;
                    } else if (data.tglobalsearchreport[i].Type === "Invoice") {
                        dataSelectID = data.tglobalsearchreport[i].SaleID;
                    } else if (data.tglobalsearchreport[i].Type === "PO") {
                        dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
                    } else if (data.tglobalsearchreport[i].Type === "Cheque") {
                        dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
                    } else if (data.tglobalsearchreport[i].Type === "Customer") {
                        dataSelectID = data.tglobalsearchreport[i].ClientId;
                    } else if (data.tglobalsearchreport[i].Type === "Sales Order") {
                        dataSelectID = data.tglobalsearchreport[i].SaleID;
                    } else if (data.tglobalsearchreport[i].Type === "Quote") {
                        dataSelectID = data.tglobalsearchreport[i].SaleID;
                    } else if (data.tglobalsearchreport[i].Type === "Employee") {
                        dataSelectID = data.tglobalsearchreport[i].ID;
                    } else if (data.tglobalsearchreport[i].Type === "Product") {
                        dataSelectID = data.tglobalsearchreport[i].PartsID;
                    } else if (data.tglobalsearchreport[i].Type === "Refund") {
                        dataSelectID = data.tglobalsearchreport[i].SaleID;
                    } else if (data.tglobalsearchreport[i].Type === "INV-BO") {
                        dataSelectID = data.tglobalsearchreport[i].SaleID;
                    } else if (data.tglobalsearchreport[i].Type === "Account") {
                        dataSelectID = data.tglobalsearchreport[i].AccountsID;
                    } else if (data.tglobalsearchreport[i].Type === "Stock Adjustment") {
                        dataSelectID = data.tglobalsearchreport[i].StockAdjustID;
                        if (data.tglobalsearchreport[i].IsProcessed) {
                            isProcessed = "Processed";
                        } else {
                            isProcessed = "On Hold";
                        }
                    } else if (data.tglobalsearchreport[i].Type === "Stock Transfer") {
                        dataSelectID = data.tglobalsearchreport[i].TransId;
                        if (data.tglobalsearchreport[i].IsProcessed) {
                            isProcessed = "Processed";
                        } else {
                            isProcessed = "On Hold";
                        }
                    } else {
                        dataSelectID = data.tglobalsearchreport[i].ID;
                    }
                    var dataList = {
                        catg: data.tglobalsearchreport[i].Catg || '',
                        catgdesc: data.tglobalsearchreport[i].Catgdesc || '',
                        ClientId: data.tglobalsearchreport[i].ClientId || '',
                        id: dataSelectID || '',
                        type: data.tglobalsearchreport[i].Type || '',
                        company: data.tglobalsearchreport[i].Company || '',
                        globalref: data.tglobalsearchreport[i].Globalref || '',
                        transDate: data.tglobalsearchreport[i].TransDate != '' ? moment(data.tglobalsearchreport[i].TransDate).format("YYYY/MM/DD") : data.tglobalsearchreport[i].TransDate,
                        transId: data.tglobalsearchreport[i].TransId || '',
                        saleID: data.tglobalsearchreport[i].SaleID || '',
                        purchaseOrderID: data.tglobalsearchreport[i].PurchaseOrderID || '',
                        paymentID: data.tglobalsearchreport[i].PaymentID || '',
                        prepaymentID: data.tglobalsearchreport[i].PrepaymentID || '',
                        fixedAssetID: data.tglobalsearchreport[i].FixedAssetID || '',
                        partsID: data.tglobalsearchreport[i].PartsID || ''

                    };

                    var dataListNew = [
                        dataSelectID || '',
                        data.tglobalsearchreport[i].Company || '',
                        data.tglobalsearchreport[i].Type || '',
                        data.tglobalsearchreport[i].Globalref || '',
                        isProcessed

                    ];
                    //if(dataSelectID != ""){
                    dataTableList.push(dataList);
                    splashArrayList.push(dataListNew);
                    //}
                }



                setTimeout(function() {
                    $('#searchPOP').modal('toggle');

                    $('#tblSearchOverview').DataTable({
                        data: splashArrayList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [{
                                className: "colId",
                                "targets": [0]
                            },
                            {
                                className: "colName",
                                "targets": [1]
                            },
                            {
                                className: "colType",
                                "targets": [2]
                            },
                            {
                                className: "colTransGlobal",
                                "targets": [3]
                            },
                            {
                                className: "colTransStatus",
                                "targets": [4]
                            }

                        ],
                        rowId: 0,
                        select: true,
                        destroy: true,
                        colReorder: true,
                        colReorder: {
                            fixedColumnsLeft: 1
                        },

                        pageLength: initialReportDatatableLoad,
                        lengthMenu: [
                            [initialReportDatatableLoad, -1],
                            [initialReportDatatableLoad, "All"]
                        ],
                        info: true,
                        responsive: true,
                        "fnDrawCallback": function(oSettings) {
                            var searchDataValue = $('.txtGlobalSearch').val().toLowerCase();
                            $('#tblSearchOverview_wrapper .paginate_button.page-item').removeClass('disabled');
                            $('#tblSearchOverview_ellipsis').addClass('disabled');
                            if (oSettings._iDisplayLength == -1) {
                                if (oSettings.fnRecordsDisplay() > 150) {
                                    $('#tblSearchOverview_wrapper .paginate_button.page-item.previous').addClass('disabled');
                                    $('#tblSearchOverview_wrapper .paginate_button.page-item.next').addClass('disabled');
                                }
                            } else {

                            }
                            if (oSettings.fnRecordsDisplay() < initialReportLoad) {
                                $('#tblSearchOverview_wrapper .paginate_button.page-item.next').addClass('disabled');
                            }
                            $('.paginate_button.next:not(.disabled)', this.api().table().container())
                                .on('click', function() {
                                    $('.fullScreenSpin').css('display', 'inline-block');
                                    let dataLenght = oSettings._iDisplayLength;


                                    sideBarService.getGlobalSearchReport(searchDataValue, initialReportLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                        // templateObject.resetData(objCombineData);
                                        let dataOld = splashArrayList;
                                        for (let i = 0; i < dataObjectnew.tglobalsearchreport.length; i++) {
                                            if (dataObjectnew.tglobalsearchreport[i].Type === "Purchase Order") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].PurchaseOrderID;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "Bill") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].PurchaseOrderID;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "Credit") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].PurchaseOrderID;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "Customer Payment") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].PaymentID;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "Supplier Payment") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].PaymentID;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "Invoice") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].SaleID;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "PO") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].PurchaseOrderID;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "Cheque") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].PurchaseOrderID;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "Customer") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].ClientId;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "Sales Order") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].SaleID;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "Quote") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].SaleID;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "Employee") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].ID;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "Product") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].PartsID;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "Refund") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].SaleID;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "INV-BO") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].SaleID;
                                            } else if (dataObjectnew.tglobalsearchreport[i].Type === "Account") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].AccountsID;
                                            } else if (data.tglobalsearchreport[i].Type === "Stock Adjustment") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].StockAdjustID;
                                                if (data.tglobalsearchreport[i].IsProcessed) {
                                                    isProcessed = "Processed";
                                                } else {
                                                    isProcessed = "On Hold";
                                                }
                                            } else if (data.tglobalsearchreport[i].Type === "Stock Transfer") {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].TransId;
                                                if (data.tglobalsearchreport[i].IsProcessed) {
                                                    isProcessed = "Processed";
                                                } else {
                                                    isProcessed = "On Hold";
                                                }
                                            } else {
                                                dataSelectID = dataObjectnew.tglobalsearchreport[i].ID;
                                            }
                                            var dataListDupp = {
                                                catg: dataObjectnew.tglobalsearchreport[i].Catg || '',
                                                catgdesc: dataObjectnew.tglobalsearchreport[i].Catgdesc || '',
                                                ClientId: dataObjectnew.tglobalsearchreport[i].ClientId || '',
                                                id: dataSelectID || '',
                                                type: dataObjectnew.tglobalsearchreport[i].Type || '',
                                                company: dataObjectnew.tglobalsearchreport[i].Company || '',
                                                globalref: dataObjectnew.tglobalsearchreport[i].Globalref || '',
                                                transDate: dataObjectnew.tglobalsearchreport[i].TransDate != '' ? moment(dataObjectnew.tglobalsearchreport[i].TransDate).format("YYYY/MM/DD") : dataObjectnew.tglobalsearchreport[i].TransDate,
                                                transId: dataObjectnew.tglobalsearchreport[i].TransId || '',
                                                saleID: dataObjectnew.tglobalsearchreport[i].SaleID || '',
                                                purchaseOrderID: dataObjectnew.tglobalsearchreport[i].PurchaseOrderID || '',
                                                paymentID: dataObjectnew.tglobalsearchreport[i].PaymentID || '',
                                                prepaymentID: dataObjectnew.tglobalsearchreport[i].PrepaymentID || '',
                                                fixedAssetID: dataObjectnew.tglobalsearchreport[i].FixedAssetID || '',
                                                partsID: dataObjectnew.tglobalsearchreport[i].PartsID || ''

                                            };

                                            var dataListNewDupp = [
                                                dataSelectID || '',
                                                dataObjectnew.tglobalsearchreport[i].Company || '',
                                                dataObjectnew.tglobalsearchreport[i].Type || '',
                                                dataObjectnew.tglobalsearchreport[i].Globalref || '',
                                                isProcessed

                                            ];
                                            dataTableListDupp.push(dataListDupp);
                                            splashArrayListDupp.push(dataListNewDupp);
                                        }
                                        var thirdaryData = $.merge($.merge([], splashArrayListDupp), splashArrayList);
                                        let uniqueChars = [...new Set(thirdaryData)];
                                        var datatable = $('#tblSearchOverview').DataTable();
                                        datatable.clear();
                                        datatable.rows.add(uniqueChars);
                                        datatable.draw(false);
                                        // let objCombineData = {
                                        //   tglobalsearchreport:thirdaryData
                                        // }
                                        $('.fullScreenSpin').css('display', 'none');

                                    }).catch(function(err) {
                                        $('.fullScreenSpin').css('display', 'none');
                                    });

                                });
                            setTimeout(function() {
                                checkStockColor();
                            }, 100);
                        }

                    }).on('page', function() {

                    });
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');
                }, 0);

                $('#tblSearchOverview tbody').on('click', 'tr', function() {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(event.target).closest("tr").find(".colType").text();
                    if ((listData) && (transactiontype)) {
                        if (transactiontype === 'Purchase Order') {
                            window.open('/purchaseordercard?id=' + listData, '_self');
                        } else if (transactiontype === 'Bill') {
                            window.open('/billcard?id=' + listData, '_self');
                        } else if (transactiontype === 'Credit') {
                            window.open('/creditcard?id=' + listData, '_self');
                        } else if (transactiontype === 'Customer Payment') {
                            window.open('/paymentcard?id=' + listData, '_self');
                        } else if (transactiontype === 'Supplier Payment') {
                            window.open('/supplierpaymentcard?id=' + listData, '_self');
                        } else if (transactiontype === 'Invoice') {
                            window.open('/invoicecard?id=' + listData, '_self');
                        } else if (transactiontype === 'PO') {
                            window.open('/purchaseordercard?id=' + listData, '_self');
                        } else if (transactiontype === 'Cheque') {
                            window.open('/chequecard?id=' + listData, '_self');
                        } else if (transactiontype === 'Customer') {
                            window.open('/customerscard?id=' + listData, '_self');
                        } else if (transactiontype === 'Sales Order') {
                            window.open('/salesordercard?id=' + listData, '_self');
                        } else if (transactiontype === 'Quote') {
                            window.open('/quotecard?id=' + listData, '_self');
                        } else if (transactiontype === 'Employee') {
                            window.open('/employeescard?id=' + listData, '_self');
                        } else if (transactiontype === 'Product') {
                            window.open('/productview?id=' + listData, '_self');
                        } else if (transactiontype === 'Refund') {
                            window.open('/refundcard?id=' + listData, '_self');
                        } else if (transactiontype === 'INV-BO') {
                            window.open('/invoicecard?id=' + listData, '_self');
                        } else if (transactiontype === 'Account') {
                            window.open('/accountsoverview?id=' + listData, '_self');
                        } else if (transactiontype === 'Stock Adjustment') {
                            window.open('/stockadjustmentcard?id=' + listData, '_self');
                        } else if (transactiontype === 'Stock Transfer') {
                            window.open('/stocktransfercard?id=' + listData, '_self');
                        } else {

                        }

                    }


                });


            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            var barcode = searchName.toUpperCase();
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

                            swal('No record with that exact number "' + barcode + '"', '', 'warning');
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
                            swal('No record with that exact number "' + barcode + '"', '', 'warning');
                            e.preventDefault();
                        }


                    }

                    AddUERP(oReqSID.responseText);
                }



            } else if (segs[0] == Barcode_Prefix_StockTransfer) {
                productService.getGlobalSearchReportByType(segs[1], "Stock Transfer").then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    if(data.tglobalsearchreport.length > 0){
                    for (let i = 0; i < data.tglobalsearchreport.length; i++) {
                        if (data.tglobalsearchreport[i].Type === "Stock Transfer") {
                            dataSelectID = segs[1] || data.tglobalsearchreport[i].TransId || '';
                            if(dataSelectID != ''){
                              window.open('/stocktransfercard?id=' + dataSelectID, '_self');
                            }else{
                              swal('No record with that exact number "' + barcode + '"', '', 'warning');
                            }
                        } else {
                          swal('No record with that exact number "' + barcode + '"', '', 'warning');
                          $('.fullScreenSpin').css('display', 'none');
                        }
                    }
                  }else{
                    swal('No record with that exact number "' + barcode + '"', '', 'warning');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_StockAdjust) {

                productService.getGlobalSearchStockAdjust(segs[1]).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    dataSelectID = segs[1] || '';
                    if(data.tstockadjustentry.length > 0){
                        window.open('/stockadjustmentcard?id=' + dataSelectID, '_self');
                    }else{
                      swal('No record with that exact number "' + barcode + '"', '', 'warning');
                      $('.fullScreenSpin').css('display', 'none');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_Employee) {

                productService.getGlobalSearchEmployee(segs[1]).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    dataSelectID = segs[1] || '';
                    if(data.temployee.length > 0){
                        window.open('/employeescard?id=' + dataSelectID, '_self');
                    }else{
                      swal('No record with that exact number "' + barcode + '"', '', 'warning');
                      $('.fullScreenSpin').css('display', 'none');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_Invoice || segs[0] == Barcode_Prefix_Invoice2) {
                productService.getGlobalSearchReportByType(segs[1], "Invoice").then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    if(data.tglobalsearchreport.length > 0){
                    for (let i = 0; i < data.tglobalsearchreport.length; i++) {
                        if (data.tglobalsearchreport[i].Type === "Invoice") {
                            dataSelectID = data.tglobalsearchreport[i].TransId || '';
                            if(dataSelectID != '' && dataSelectID == segs[1]){
                              window.open('/invoicecard?id=' + dataSelectID, '_self');
                            }
                        } else {
                          swal('No record with that exact number "' + barcode + '"', '', 'warning');
                          $('.fullScreenSpin').css('display', 'none');
                        }
                    }
                  }else{
                    swal('No record with that exact number "' + barcode + '"', '', 'warning');
                    }
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_SalesOrder) {
                productService.getGlobalSearchReportByType(segs[1], "Sales Order").then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    if(data.tglobalsearchreport.length > 0){
                    for (let i = 0; i < data.tglobalsearchreport.length; i++) {
                        if (data.tglobalsearchreport[i].Type === "Sales Order") {
                            dataSelectID = data.tglobalsearchreport[i].TransId || '';
                            if(dataSelectID != '' && dataSelectID == segs[1]){
                              window.open('/salesordercard?id=' + dataSelectID, '_self');
                            }
                        } else {
                          swal('No record with that exact number "' + barcode + '"', '', 'warning');
                          $('.fullScreenSpin').css('display', 'none');
                        }
                    }
                  }else{
                    swal('No record with that exact number "' + barcode + '"', '', 'warning');
                    }
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_Quote) {
                productService.getGlobalSearchReportByType(segs[1], "Quote").then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    if(data.tglobalsearchreport.length > 0){
                    for (let i = 0; i < data.tglobalsearchreport.length; i++) {
                        if (data.tglobalsearchreport[i].Type === "Quote") {
                            dataSelectID = data.tglobalsearchreport[i].TransId || '';
                            if(dataSelectID != '' && dataSelectID == segs[1]){
                              window.open('/quotecard?id=' + dataSelectID, '_self');
                            }else{
                              swal('No record with that exact number "' + barcode + '"', '', 'warning');
                              $('.fullScreenSpin').css('display', 'none');
                            }
                        } else {
                          swal('No record with that exact number "' + barcode + '"', '', 'warning');
                          $('.fullScreenSpin').css('display', 'none');
                        }
                    }
                  }else{
                    swal('No record with that exact number "' + barcode + '"', '', 'warning');
                    }
                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });

            }else if (segs[0] == Barcode_Prefix_Refund) {

                productService.getGlobalSearchRefund(segs[1]).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    dataSelectID = segs[1] || '';
                    if(data.trefundsale.length > 0){
                        window.open('/refundcard?id=' + dataSelectID, '_self');
                    }else{
                      swal('No record with that exact number "' + barcode + '"', '', 'warning');
                      $('.fullScreenSpin').css('display', 'none');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_Payment) {
                /*productService.getGlobalSearchReportByType(segs[1], "General Ledger").then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    for (let i = 0; i < data.tglobalsearchreport.length; i++) {
                        if (data.tglobalsearchreport[i].Type === "Customer Payment") {
                            dataSelectID = data.tglobalsearchreport[i].TransId || '';
                            if(dataSelectID != ''){
                              window.open('/paymentcard?id=' + dataSelectID, '_self');
                            }
                        }else if (data.tglobalsearchreport[i].Type === "Supplier Payment") {
                            dataSelectID = data.tglobalsearchreport[i].TransId || '';
                            if(dataSelectID != ''){
                              window.open('/supplierpaymentcard?id=' + dataSelectID, '_self');
                            }
                        } else {
                          $('.fullScreenSpin').css('display', 'none');
                        }
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                }); */

                productService.getGlobalSearchPayment(segs[1]).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    dataSelectID = segs[1] || '';
                    if(data.tpaymentlist.length > 0){
                          for(let i=0; i<data.tpaymentlist.length; i++){
                            if(data.tpaymentlist[i].TYPE =="Customer Payment" && data.tpaymentlist[i].PaymentID ==dataSelectID){
                                window.open('/paymentcard?id=' + dataSelectID, '_self');
                            }else if(data.tpaymentlist[i].TYPE =="Supplier Payment" && data.tpaymentlist[i].PaymentID ==dataSelectID){
                                window.open('/supplierpaymentcard?id=' + dataSelectID, '_self');
                            }else{
                               //window.open('/paymentoverview', '_self');
                               swal('No record with that exact number "' + barcode + '"', '', 'warning');
                            }
                          }

                    }else{
                      swal('No record with that exact number "' + barcode + '"', '', 'warning');
                      $('.fullScreenSpin').css('display', 'none');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_Bill) {

                productService.getGlobalSearchBill(segs[1]).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    dataSelectID = segs[1] || '';
                    if(data.tbillex.length > 0){
                        window.open('/billcard?id=' + dataSelectID, '_self');
                    }else{
                      swal('No record with that exact number "' + barcode + '"', '', 'warning');
                      $('.fullScreenSpin').css('display', 'none');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_PurchaseOrder) {

                productService.getGlobalSearchPO(segs[1]).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    dataSelectID = segs[1] || '';
                    if(data.tpurchaseorderex.length > 0){
                        window.open('/purchaseordercard?id=' + dataSelectID, '_self');
                    }else{
                      swal('No record with that exact number "' + barcode + '"', '', 'warning');
                      $('.fullScreenSpin').css('display', 'none');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_Journal) {

                productService.getGlobalSearchJournalEntry(segs[1]).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    dataSelectID = segs[1] || '';
                    if(data.tjournalentry.length > 0){
                        window.open('/journalentrycard?id=' + dataSelectID, '_self');
                    }else{
                      swal('No record with that exact number "' + barcode + '"', '', 'warning');
                      $('.fullScreenSpin').css('display', 'none');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_TimeSheet) {
                productService.getGlobalSearchTimeSheet(segs[1]).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    dataSelectID = segs[1] || '';
                    if(data.ttimesheet.length > 0){
                        window.open('/timesheet?id=' + dataSelectID, '_self');
                    }else{
                      swal('No record with that exact number "' + barcode + '"', '', 'warning');
                      $('.fullScreenSpin').css('display', 'none');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_Customer) {

                productService.getGlobalSearchCustomer(segs[1]).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    dataSelectID = segs[1] || '';
                    if(data.tcustomervs1.length > 0){
                        window.open('/customerscard?id=' + dataSelectID, '_self');
                    }else{
                      swal('No record with that exact number "' + barcode + '"', '', 'warning');
                      $('.fullScreenSpin').css('display', 'none');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_Supplier) {
                productService.getGlobalSearchSupplier(segs[1]).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    dataSelectID = segs[1] || '';
                    if(data.tsuppliervs1.length > 0){
                        window.open('/supplierscard?id=' + dataSelectID, '_self');
                    }else{
                      swal('No record with that exact number "' + barcode + '"', '', 'warning');
                      $('.fullScreenSpin').css('display', 'none');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_Product) {
                productService.getGlobalSearchProduct(segs[1]).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    dataSelectID = segs[1] || '';
                    if(data.tproductvs1.length > 0){
                        window.open('/productview?id=' + dataSelectID, '_self');
                    }else{
                      swal('No record with that exact number "' + barcode + '"', '', 'warning');
                      $('.fullScreenSpin').css('display', 'none');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_Account) {
                productService.getGlobalSearchAccount(segs[1]).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    dataSelectID = segs[1] || '';
                    if(data.taccountvs1.length > 0){
                      window.open('/accountsoverview?id=' + dataSelectID, '_self');
                    }else{
                      swal('No record with that exact number "' + barcode + '"', '', 'warning');
                      $('.fullScreenSpin').css('display', 'none');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_Check) {
                productService.getGlobalSearchCheck(segs[1]).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    dataSelectID = segs[1] || '';
                    if(data.tchequeex.length > 0){
                      window.open('/chequecard?id=' + dataSelectID, '_self');
                    }else{
                      swal('No record with that exact number "' + barcode + '"', '', 'warning');
                      $('.fullScreenSpin').css('display', 'none');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }else if (segs[0] == Barcode_Prefix_Shipping) {
                productService.getGlobalSearchShipping(segs[1]).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    dataSelectID = segs[1] || '';
                    if(data.tinvoice.length > 0){
                      window.open('/shippingdocket?id=' + dataSelectID, '_self');
                    }else{
                      swal('No record with that exact number "' + barcode + '"', '', 'warning');
                      $('.fullScreenSpin').css('display', 'none');
                    }

                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            } else {
                productService.getGlobalSearchReport(searchName).then(function(data) {
                    let dataSelectID = '';
                    let isProcessed = '';
                    var splashArrayList = new Array();
                    var splashArrayListDupp = new Array();
                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function() {
                        $('#tblSearchOverview_filter .form-control-sm').val(searchName);
                    }, 200);
                    let dataTableList = [];
                    let dataTableListDupp = [];
                    if(data.tglobalsearchreport.length > 0){
                    for (let i = 0; i < data.tglobalsearchreport.length; i++) {
                        if (data.tglobalsearchreport[i].Type === "Purchase Order") {
                            dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
                        } else if (data.tglobalsearchreport[i].Type === "Bill") {
                            dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
                        } else if (data.tglobalsearchreport[i].Type === "Credit") {
                            dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
                        } else if (data.tglobalsearchreport[i].Type === "Customer Payment") {
                            dataSelectID = data.tglobalsearchreport[i].PaymentID;
                        } else if (data.tglobalsearchreport[i].Type === "Supplier Payment") {
                            dataSelectID = data.tglobalsearchreport[i].PaymentID;
                        } else if (data.tglobalsearchreport[i].Type === "Invoice") {
                            dataSelectID = data.tglobalsearchreport[i].SaleID;
                        } else if (data.tglobalsearchreport[i].Type === "PO") {
                            dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
                        } else if (data.tglobalsearchreport[i].Type === "Cheque") {
                            dataSelectID = data.tglobalsearchreport[i].PurchaseOrderID;
                        } else if (data.tglobalsearchreport[i].Type === "Customer") {
                            dataSelectID = data.tglobalsearchreport[i].ClientId;
                        } else if (data.tglobalsearchreport[i].Type === "Sales Order") {
                            dataSelectID = data.tglobalsearchreport[i].SaleID;
                        } else if (data.tglobalsearchreport[i].Type === "Quote") {
                            dataSelectID = data.tglobalsearchreport[i].SaleID;
                        } else if (data.tglobalsearchreport[i].Type === "Employee") {
                            dataSelectID = data.tglobalsearchreport[i].ID;
                        } else if (data.tglobalsearchreport[i].Type === "Product") {
                            dataSelectID = data.tglobalsearchreport[i].PartsID;
                        } else if (data.tglobalsearchreport[i].Type === "Refund") {
                            dataSelectID = data.tglobalsearchreport[i].SaleID;
                        } else if (data.tglobalsearchreport[i].Type === "INV-BO") {
                            dataSelectID = data.tglobalsearchreport[i].SaleID;
                        } else if (data.tglobalsearchreport[i].Type === "Account") {
                            dataSelectID = data.tglobalsearchreport[i].AccountsID;
                        } else if (data.tglobalsearchreport[i].Type === "Stock Adjustment") {
                            dataSelectID = data.tglobalsearchreport[i].StockAdjustID;
                            if (data.tglobalsearchreport[i].IsProcessed) {
                                isProcessed = "Processed";
                            } else {
                                isProcessed = "On Hold";
                            }
                        } else if (data.tglobalsearchreport[i].Type === "Stock Transfer") {
                            dataSelectID = data.tglobalsearchreport[i].TransId;
                            if (data.tglobalsearchreport[i].IsProcessed) {
                                isProcessed = "Processed";
                            } else {
                                isProcessed = "On Hold";
                            }
                        } else {
                            dataSelectID = data.tglobalsearchreport[i].ID;
                        }
                        var dataList = {
                            catg: data.tglobalsearchreport[i].Catg || '',
                            catgdesc: data.tglobalsearchreport[i].Catgdesc || '',
                            ClientId: data.tglobalsearchreport[i].ClientId || '',
                            id: dataSelectID || '',
                            type: data.tglobalsearchreport[i].Type || '',
                            company: data.tglobalsearchreport[i].Company || '',
                            globalref: data.tglobalsearchreport[i].Globalref || '',
                            transDate: data.tglobalsearchreport[i].TransDate != '' ? moment(data.tglobalsearchreport[i].TransDate).format("YYYY/MM/DD") : data.tglobalsearchreport[i].TransDate,
                            transId: data.tglobalsearchreport[i].TransId || '',
                            saleID: data.tglobalsearchreport[i].SaleID || '',
                            purchaseOrderID: data.tglobalsearchreport[i].PurchaseOrderID || '',
                            paymentID: data.tglobalsearchreport[i].PaymentID || '',
                            prepaymentID: data.tglobalsearchreport[i].PrepaymentID || '',
                            fixedAssetID: data.tglobalsearchreport[i].FixedAssetID || '',
                            partsID: data.tglobalsearchreport[i].PartsID || ''

                        };

                        var dataListNew = [
                            dataSelectID || '',
                            data.tglobalsearchreport[i].Company || '',
                            data.tglobalsearchreport[i].Type || '',
                            data.tglobalsearchreport[i].Globalref || '',
                            isProcessed

                        ];
                        //if(dataSelectID != ""){
                        dataTableList.push(dataList);
                        splashArrayList.push(dataListNew);
                        //}
                    }




                    setTimeout(function() {
                        $('#searchPOP').modal('toggle');

                        $('#tblSearchOverview').DataTable({
                            data: splashArrayList,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            paging: true,
                            "aaSorting": [],
                            "orderMulti": true,
                            columnDefs: [{
                                    className: "colId",
                                    "targets": [0]
                                },
                                {
                                    className: "colName",
                                    "targets": [1]
                                },
                                {
                                    className: "colType",
                                    "targets": [2]
                                },
                                {
                                    className: "colTransGlobal",
                                    "targets": [3]
                                },
                                {
                                    className: "colTransStatus",
                                    "targets": [4]
                                }

                            ],
                            rowId: 0,
                            select: true,
                            destroy: true,
                            colReorder: true,
                            colReorder: {
                                fixedColumnsLeft: 1
                            },

                            pageLength: initialReportDatatableLoad,
                            lengthMenu: [
                                [initialReportDatatableLoad, -1],
                                [initialReportDatatableLoad, "All"]
                            ],
                            info: true,
                            responsive: true,
                            "fnDrawCallback": function(oSettings) {
                                var searchDataValue = $('.txtGlobalSearch').val().toLowerCase();
                                $('#tblSearchOverview_wrapper .paginate_button.page-item').removeClass('disabled');
                                $('#tblSearchOverview_ellipsis').addClass('disabled');
                                if (oSettings._iDisplayLength == -1) {
                                    if (oSettings.fnRecordsDisplay() > 150) {
                                        $('#tblSearchOverview_wrapper .paginate_button.page-item.previous').addClass('disabled');
                                        $('#tblSearchOverview_wrapper .paginate_button.page-item.next').addClass('disabled');
                                    }
                                } else {

                                }
                                if (oSettings.fnRecordsDisplay() < initialReportLoad) {
                                    $('#tblSearchOverview_wrapper .paginate_button.page-item.next').addClass('disabled');
                                }
                                $('.paginate_button.next:not(.disabled)', this.api().table().container())
                                    .on('click', function() {
                                        $('.fullScreenSpin').css('display', 'inline-block');
                                        let dataLenght = oSettings._iDisplayLength;


                                        sideBarService.getGlobalSearchReport(searchDataValue, initialReportLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {

                                            let dataOld = splashArrayList;
                                            for (let i = 0; i < dataObjectnew.tglobalsearchreport.length; i++) {
                                                if (dataObjectnew.tglobalsearchreport[i].Type === "Purchase Order") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].PurchaseOrderID;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "Bill") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].PurchaseOrderID;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "Credit") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].PurchaseOrderID;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "Customer Payment") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].PaymentID;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "Supplier Payment") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].PaymentID;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "Invoice") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].SaleID;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "PO") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].PurchaseOrderID;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "Cheque") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].PurchaseOrderID;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "Customer") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].ClientId;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "Sales Order") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].SaleID;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "Quote") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].SaleID;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "Employee") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].ID;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "Product") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].PartsID;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "Refund") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].SaleID;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "INV-BO") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].SaleID;
                                                } else if (dataObjectnew.tglobalsearchreport[i].Type === "Account") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].AccountsID;
                                                } else if (data.tglobalsearchreport[i].Type === "Stock Adjustment") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].StockAdjustID;
                                                    if (data.tglobalsearchreport[i].IsProcessed) {
                                                        isProcessed = "Processed";
                                                    } else {
                                                        isProcessed = "On Hold";
                                                    }
                                                } else if (data.tglobalsearchreport[i].Type === "Stock Transfer") {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].TransId;
                                                    if (data.tglobalsearchreport[i].IsProcessed) {
                                                        isProcessed = "Processed";
                                                    } else {
                                                        isProcessed = "On Hold";
                                                    }
                                                } else {
                                                    dataSelectID = dataObjectnew.tglobalsearchreport[i].ID;
                                                }
                                                var dataListDupp = {
                                                    catg: dataObjectnew.tglobalsearchreport[i].Catg || '',
                                                    catgdesc: dataObjectnew.tglobalsearchreport[i].Catgdesc || '',
                                                    ClientId: dataObjectnew.tglobalsearchreport[i].ClientId || '',
                                                    id: dataSelectID || '',
                                                    type: dataObjectnew.tglobalsearchreport[i].Type || '',
                                                    company: dataObjectnew.tglobalsearchreport[i].Company || '',
                                                    globalref: dataObjectnew.tglobalsearchreport[i].Globalref || '',
                                                    transDate: dataObjectnew.tglobalsearchreport[i].TransDate != '' ? moment(dataObjectnew.tglobalsearchreport[i].TransDate).format("YYYY/MM/DD") : dataObjectnew.tglobalsearchreport[i].TransDate,
                                                    transId: dataObjectnew.tglobalsearchreport[i].TransId || '',
                                                    saleID: dataObjectnew.tglobalsearchreport[i].SaleID || '',
                                                    purchaseOrderID: dataObjectnew.tglobalsearchreport[i].PurchaseOrderID || '',
                                                    paymentID: dataObjectnew.tglobalsearchreport[i].PaymentID || '',
                                                    prepaymentID: dataObjectnew.tglobalsearchreport[i].PrepaymentID || '',
                                                    fixedAssetID: dataObjectnew.tglobalsearchreport[i].FixedAssetID || '',
                                                    partsID: dataObjectnew.tglobalsearchreport[i].PartsID || ''

                                                };

                                                var dataListNewDupp = [
                                                    dataSelectID || '',
                                                    dataObjectnew.tglobalsearchreport[i].Company || '',
                                                    dataObjectnew.tglobalsearchreport[i].Type || '',
                                                    dataObjectnew.tglobalsearchreport[i].Globalref || '',
                                                    isProcessed

                                                ];
                                                dataTableListDupp.push(dataListDupp);
                                                splashArrayListDupp.push(dataListNewDupp);
                                            }
                                            var thirdaryData = $.merge($.merge([], splashArrayListDupp), splashArrayList);
                                            let uniqueChars = [...new Set(thirdaryData)];
                                            var datatable = $('#tblSearchOverview').DataTable();
                                            datatable.clear();
                                            datatable.rows.add(uniqueChars);
                                            datatable.draw(false);

                                            $('.fullScreenSpin').css('display', 'none');

                                        }).catch(function(err) {
                                            $('.fullScreenSpin').css('display', 'none');
                                        });

                                    });
                                setTimeout(function() {
                                    checkStockColor();
                                }, 100);
                            }

                        }).on('page', function() {

                        });
                        $('div.dataTables_filter input').addClass('form-control form-control-sm');
                    }, 0);
                  }else{
                    swal('No record with that exact number "' + barcode + '"', '', 'warning');
                  }
                    $('#tblSearchOverview tbody').on('click', 'tr', function() {
                        var listData = $(this).closest('tr').attr('id');
                        var transactiontype = $(event.target).closest("tr").find(".colType").text();
                        if ((listData) && (transactiontype)) {
                            if (transactiontype === 'Purchase Order') {
                                window.open('/purchaseordercard?id=' + listData, '_self');
                            } else if (transactiontype === 'Bill') {
                                window.open('/billcard?id=' + listData, '_self');
                            } else if (transactiontype === 'Credit') {
                                window.open('/creditcard?id=' + listData, '_self');
                            } else if (transactiontype === 'Customer Payment') {
                                window.open('/paymentcard?id=' + listData, '_self');
                            } else if (transactiontype === 'Supplier Payment') {
                                window.open('/supplierpaymentcard?id=' + listData, '_self');
                            } else if (transactiontype === 'Invoice') {
                                window.open('/invoicecard?id=' + listData, '_self');
                            } else if (transactiontype === 'PO') {
                                window.open('/purchaseordercard?id=' + listData, '_self');
                            } else if (transactiontype === 'Cheque') {
                                window.open('/chequecard?id=' + listData, '_self');
                            } else if (transactiontype === 'Customer') {
                                window.open('/customerscard?id=' + listData, '_self');
                            } else if (transactiontype === 'Sales Order') {
                                window.open('/salesordercard?id=' + listData, '_self');
                            } else if (transactiontype === 'Quote') {
                                window.open('/quotecard?id=' + listData, '_self');
                            } else if (transactiontype === 'Employee') {
                                window.open('/employeescard?id=' + listData, '_self');
                            } else if (transactiontype === 'Product') {
                                window.open('/productview?id=' + listData, '_self');
                            } else if (transactiontype === 'Refund') {
                                window.open('/refundcard?id=' + listData, '_self');
                            } else if (transactiontype === 'INV-BO') {
                                window.open('/invoicecard?id=' + listData, '_self');
                            } else if (transactiontype === 'Account') {
                                window.open('/accountsoverview?id=' + listData, '_self');
                            } else if (transactiontype === 'Stock Adjustment') {
                                window.open('/stockadjustmentcard?id=' + listData, '_self');
                            } else if (transactiontype === 'Stock Transfer') {
                                window.open('/stocktransfercard?id=' + listData, '_self');
                            } else {

                            }

                        }


                    });




                }).catch(function(err) {
                    $('.fullScreenSpin').css('display', 'none');
                });
            }
        }
    };




    function onScanSuccess(decodedText, decodedResult) {
        var barcodeScanner = decodedText.toUpperCase();
        $('#scanBarcodeModalHeader').modal('toggle');
        if (barcodeScanner != '') {
            //$('.txtGlobalSearchMobile').val(barcode).trigger("change");
            //var searchData = $('.txtGlobalSearchMobile').val().toLowerCase();
            setTimeout(function() {
                $('#tblSearchOverview_filter .form-control-sm').val(barcodeScanner);
            }, 200);

            if (html5QrcodeScanner.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
                html5QrcodeScanner.pause();
            }

            templateObject.getAllGlobalSearch(barcodeScanner);

        }

    }


    var html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader-global", {
            fps: 10,
            qrbox: 250,
            rememberLastUsedCamera: true
        });
    html5QrcodeScanner.render(onScanSuccess);


    if (sidePanelToggle) {
        if (sidePanelToggle === "toggled") {
            $("#sidenavbar").addClass("toggled");
        } else {
            $("#sidenavbar").removeClass("toggled");
        }
    }

    let employeeLoggedUserAccess = Session.get('ERPSolidCurrentUSerAccess');
    var sessionDataToLog = localStorage.getItem('mySession');
    document.getElementById("logged_user").innerHTML = sessionDataToLog;

    let isDashboard = Session.get('CloudDashboardModule');
    let isMain = Session.get('CloudMainModule');
    let isInventory = Session.get('CloudInventoryModule');
    let isManufacturing = Session.get('CloudManufacturingModule');
    let isAccessLevels = Session.get('CloudAccessLevelsModule');
    let isShipping = Session.get('CloudShippingModule');
    let isStockTransfer = Session.get('CloudStockTransferModule');
    let isStockTake = Session.get('CloudStockTakeModule');
    let isSales = Session.get('CloudSalesModule');
    let isPurchases = Session.get('CloudPurchasesModule');
    let isExpenseClaims = Session.get('CloudExpenseClaimsModule');
    let isFixedAssets = Session.get('CloudFixedAssetsModule');

    let isPayments = Session.get('CloudPaymentsModule');
    let isContacts = Session.get('CloudContactsModule');
    let isAccounts = Session.get('CloudAccountsModule');
    let isReports = Session.get('CloudReportsModule');
    let isSettings = Session.get('CloudSettingsModule');

    let isSidePanel = Session.get('CloudSidePanelMenu');
    let isTopPanel = Session.get('CloudTopPanelMenu');
    let loggedUserEventFired = Session.get('LoggedUserEventFired');
    var splashArrayProd = new Array();
    templateObject.getAllProducts = function() {

        productService.getNewProductList().then(function(data) {
            let records = [];
            let inventoryData = [];
            for (let i = 0; i < data.tproduct.length; i++) {
                let recordObj = {};
                recordObj.id = data.tproduct[i].Id;
                recordObj.selected = false;
                recordObj.active = data.tproduct[i].Active;
                let ProductPrintName;
                if (data.tproduct[i].Active) {
                    ProductPrintName = data.tproduct[i].ProductPrintName || '-';
                } else {
                    ProductPrintName = data.tproduct[i].ProductPrintName + '             ' + 'INACTIVE';
                }
                recordObj.dataArr = [
                    data.tproduct[i].Id,
                    data.tproduct[i].ProductName || '-',
                    ProductPrintName,
                    utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproduct[i].BuyQty1CostInc * 100) / 100),
                    utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproduct[i].SellQty1PriceInc * 100) / 100),
                    data.tproduct[i].TotalStockQty
                ];




                var dataList = [
                    data.tproduct[i].Id || '',

                    data.tproduct[i].ProductName || '-',
                    ProductPrintName || '',
                    utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproduct[i].BuyQty1CostInc * 100) / 100),
                    utilityService.modifynegativeCurrencyFormat(Math.floor(data.tproduct[i].SellQty1PriceInc * 100) / 100),
                    data.tproduct[i].TotalStockQty
                ];

                splashArrayProd.push(dataList);

            }


            localStorage.setItem('VS1ProductList', JSON.stringify(splashArrayProd));


        })
    };

    templateObject.getCompanyInfo = function() {

        organizationService.getCompanyInfo().then(function(data) {
            let companyName = data.tcompanyinfo[0].CompanyName;
            let companyaddress1 = data.tcompanyinfo[0].PoBox;
            let companyaddress2 = data.tcompanyinfo[0].PoBox2 + ' ' + data.tcompanyinfo[0].PoBox3;

            let companyABN = data.tcompanyinfo[0].abn;
            let companyPhone = data.tcompanyinfo[0].PhoneNumber;
            let companyURL = data.tcompanyinfo[0].Url
            let accNo = data.tcompanyinfo[0].AccountNo || '';
            let swiftCode = data.tcompanyinfo[0].BankBranch || '';
            let bankName = data.tcompanyinfo[0].BankName || '';
            let accountName = data.tcompanyinfo[0].BankAccountName || '';
            let bsb = data.tcompanyinfo[0].Bsb || '';
            let poBox = data.tcompanyinfo[0].PoPostcode || '';
            let companyCity = data.tcompanyinfo[0].PoCity || '';
            let companyState = data.tcompanyinfo[0].PoState || '';
            let routingNo = data.tcompanyinfo[0].SiteCode || '';
            let companyReg = data.tcompanyinfo[0].CompanyNumber||'';
            let bankDetails = "Bank Name: " + bankName + "\n" + "Account Name: " + accountName + "\n Bank Account: " + accNo + "\nBSB: " + bsb + "\n Swift Code: " + swiftCode + "\n" + "Routing No: " + routingNo;
            Session.setPersistent('vs1companyName', companyName);
            Session.setPersistent('vs1companyaddress1', companyaddress1);
            Session.setPersistent('vs1companyaddress2', companyaddress2);
            Session.setPersistent('vs1companyABN', companyABN);
            Session.setPersistent('vs1companyPhone', companyPhone);
            Session.setPersistent('vs1companyURL', companyURL);
            Session.setPersistent('vs1companyPOBox', poBox);
            Session.setPersistent('vs1companyCity', companyCity);
            Session.setPersistent('companyState', companyState);
            Session.setPersistent('vs1companyStripeID', data.tcompanyinfo[0].Apcano);
            Session.setPersistent('vs1companyStripeFeeMethod', data.tcompanyinfo[0].DvaABN);
            Session.setPersistent('vs1companyBankDetails', bankDetails);
            Session.setPersistent('vs1companyBankName1', bankDetails);
            Session.setPersistent('vs1companyCompanyPOBox', bankDetails);
            Session.setPersistent('vs1companyReg', companyReg);
            localStorage.setItem('vs1companyBankName', bankName);
            localStorage.setItem('vs1companyBankAccountName', accountName);
            localStorage.setItem('vs1companyBankAccountNo', accNo);
            localStorage.setItem('vs1companyBankBSB', bsb);
            localStorage.setItem('vs1companyBankSwiftCode', swiftCode);
            localStorage.setItem('vs1companyBankRoutingNo', routingNo);
            if (data.tcompanyinfo[0].TrackEmails) {
                localStorage.setItem('VS1OrgEmail', data.tcompanyinfo[0].Email || localStorage.getItem('VS1AdminUserName'));
            } else {
                localStorage.setItem('VS1OrgEmail', localStorage.getItem('mySession'));
            }

        }).catch(function(err) {
          $('.process').addClass('killProgressBar');
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
        });
    };
    if (!localStorage.getItem('vs1LoggedEmployeeImages_dash')) {

    } else {
        if (localStorage.getItem('vs1LoggedEmployeeImages_dash') == '') {

        } else {
            let pictureData = localStorage.getItem('vs1LoggedEmployeeImages_dash');
            $('.img-profile').attr('src', 'data:image/jpeg;base64,' + pictureData);
        }

    }

    var erpGet = erpDb();

    var LoggedDB = erpGet.ERPDatabase;
    if (loggedUserEventFired) {
        templateObject.getCompanyInfo();
        $(document).ready(function() {
            let checkGreenTrack = Session.get('isGreenTrack') || false;
            if (checkGreenTrack) {
                document.title = 'GreenTrack';
                $('head').append('<link rel="icon" type="image/png" sizes="16x16" href="icons/greentrackIcon.png">');
            } else {
                document.title = 'VS1 Cloud';
                $('head').append('<link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png">');
            }

        });

        setTimeout(function() {


        }, 0);

        if (!localStorage.getItem('VS1TERPFormList')) {

        }

        if (Session.get('userlogged_status')) {

            CloudUser.update({
                _id: Session.get('mycloudLogonID')
            }, {
                $set: {
                    userMultiLogon: true
                }
            });
        }

    }



    var LoggedUser = localStorage.getItem('mySession');
    document.getElementById("logged_user").innerHTML = LoggedUser;

    /*document.getElementById("loggeddatabaseuser").innerHTML = LoggedUser;*/
    var CloudUserPass = Session.get('CloudUserPass');
    var currentLoc = FlowRouter.current().route.path;
    if (CloudUserPass) {
        templateObject.isCloudUserPass.set(true);

    }
    if (isSidePanel) {
        templateObject.isCloudSidePanelMenu.set(true);


    }

    if (LoggedDB !== null) {
        if (isDashboard) {
            templateObject.includeDashboard.set(true);
        }
        if (isMain) {
            templateObject.includeMain.set(true);
        }
        if (isInventory) {
            templateObject.includeInventory.set(true);
        }
        if (isManufacturing) {
            templateObject.includeManufacturing.set(true);
        }
        if (isAccessLevels) {
            templateObject.includeAccessLevels.set(true);
        }
        if (isShipping) {
            templateObject.includeShipping.set(true);
        }
        if (isStockTransfer) {
            templateObject.includeStockTransfer.set(true);
        }

        if (isStockTake) {
            templateObject.includeStockTake.set(true);
        }

        if (isSales) {
            templateObject.includeSales.set(true);
        }

        if (isPurchases) {
            templateObject.includePurchases.set(true);
        }

        if (isExpenseClaims) {
            templateObject.includeExpenseClaims.set(true);
        }

        if (isFixedAssets) {
            templateObject.includeFixedAssets.set(true);
        }

        if (isPayments) {
            templateObject.includePayments.set(true);
        }

        if (isContacts) {
            templateObject.includeContacts.set(true);
        }

        if (isAccounts) {
            templateObject.includeAccounts.set(true);
        }

        if (isReports) {
            templateObject.includeReports.set(true);
        }

        if (isSettings) {
            templateObject.includeSettings.set(true);
        }

        if (isSidePanel) {
            templateObject.isCloudSidePanelMenu.set(true);
            $("html").addClass("hasSideBar");
            $("body").addClass("hasSideBar");
        }
        if (isTopPanel) {
            templateObject.isCloudTopPanelMenu.set(true);
        }
    } else {

    }
});

Template.header.events({
    'click .btnCloseProgess': function() {
        $('.headerprogressbar').removeClass('headerprogressbarShow');
        $('.headerprogressbar').addClass('headerprogressbarHidden');
    },
    'click .chkOpenByDefault': function () {
      if ($(event.target).is(':checked')) {
        localStorage.setItem('dontopensearchguide', true);
        setTimeout(function() {
        Meteor._reload.reload();
        }, 100);
      }else{
        localStorage.setItem('dontopensearchguide', false);
        setTimeout(function() {
        Meteor._reload.reload();
        }, 100);
      }
    },
    'click .shorthandCode': function() {
        // let getData = $(event.target).text()||'';
        // if(getData != ''){
        //   $('.txtGlobalSearch').val(getData);
        //   $('.txtGlobalSearchMobile').val(getData);
        //   $('#searchGuideModal').modal('toggle');
        // }
    },
    'click .btnLoad': function() {
        //alert("CLICKED");

        setTimeout(function() {
            $("#process1").removeClass("hideProcess");
        }, 2000);
        setTimeout(function() {
            $("#process2").removeClass("hideProcess");
        }, 4000);
        setTimeout(function() {
            $("#process3").removeClass("hideProcess");
        }, 6000);
        setTimeout(function() {
            $("#process4").removeClass("hideProcess");
        }, 8000);
        setTimeout(function() {
            $("#process5").removeClass("hideProcess");
        }, 10000);
        setTimeout(function() {
            $("#process1").addClass("hideProcess");
            $("#process6").removeClass("hideProcess");
        }, 12000);
        setTimeout(function() {
            $("#process2").addClass("hideProcess");
            $("#process7").removeClass("hideProcess");
        }, 14000);
        setTimeout(function() {
            $("#process3").addClass("hideProcess");
            $("#process8").removeClass("hideProcess");
        }, 16000);
        setTimeout(function() {
            $("#process4").addClass("hideProcess");
            $("#process9").removeClass("hideProcess");
        }, 18000);
        setTimeout(function() {
            $("#process5").addClass("hideProcess");
            $("#process10").removeClass("hideProcess");
        }, 20000);
        setTimeout(function() {
            $("#process6").addClass("hideProcess");
            $("#process11").removeClass("hideProcess");
        }, 22000);
        setTimeout(function() {
            $("#process7").addClass("hideProcess");
        }, 24000);
        setTimeout(function() {
            $("#process8").addClass("hideProcess");
        }, 26000);
        setTimeout(function() {
            $("#process9").addClass("hideProcess");
        }, 28000);
        setTimeout(function() {
            $("#process10").addClass("hideProcess");
        }, 30000);
        setTimeout(function() {
            $("#process11").addClass("hideProcess");
        }, 32000);
        setTimeout(function() {
            $("#checkmarkwrapper").removeClass("hide");
        }, 33000);

    },
    'click .btnGlobalSearch': function(event) {
        let templateObject = Template.instance();
        var searchData = $('.txtGlobalSearch').val().toLowerCase();
        setTimeout(function() {
            $('#tblSearchOverview_filter .form-control-sm').val(searchData);
        }, 200);
        if (searchData != '') {
            templateObject.getAllGlobalSearch(searchData);

        }
    },
    'keypress .txtGlobalSearch': function(event) {
        var key = event.which;
        if (key == 13) {
            let templateObject = Template.instance();
            var searchData = $('.txtGlobalSearch').val().toLowerCase();

            setTimeout(function() {
                $('#tblSearchOverview_filter .form-control-sm').val(searchData);
            }, 200);
            if (searchData != '') {
                templateObject.getAllGlobalSearch(searchData);
                event.preventDefault();
            }
        }
    },
    'click .txtGlobalSearch': function(event) {
      var dontOpenSearchGuide = localStorage.getItem('dontopensearchguide')||'false';
      if(dontOpenSearchGuide == 'true' ||dontOpenSearchGuide == true){

      }else{
        if($(event.target).val()== ''){
          $('#searchGuideModal').modal('toggle');
        }
      }


    },
    'click #btnSearchGuide': function(event) {
         $('#searchGuideModal').modal('toggle');
    },
    'click .txtGlobalSearchMobile': function(event) {
      var dontOpenSearchGuide = localStorage.getItem('dontopensearchguide')||false;
      if(dontOpenSearchGuide){

      }else{
        if($(event.target).val()== ''){
          $('#searchGuideModal').modal('toggle');
        }
      }
    },
    'click .btnCloseModal': function(event) {
        let templateObject = Template.instance();
        templateObject.searchdatatablerecords.set('');
        $('.txtGlobalSearch').val('');
        $('.txtGlobalSearchMobile').val('');
        $('#tblSearchOverview_filter .form-control-sm').val('');

    },
    'click .btnGlobalSearchMobile': function(event) {
        let templateObject = Template.instance();
        var searchData = $('.txtGlobalSearchMobile').val().toLowerCase();
        setTimeout(function() {
            $('#tblSearchOverview_filter .form-control-sm').val(searchData);
        }, 200);
        if (searchData != '') {
            templateObject.getAllGlobalSearch(searchData);

        }
    },
    'keypress .txtGlobalSearchMobile': function(event) {
        var key = event.which;
        if (key == 13) {
            let templateObject = Template.instance();
            var searchData = $('.txtGlobalSearchMobile').val().toLowerCase();
            setTimeout(function() {
                $('#tblSearchOverview_filter .form-control-sm').val(searchData);
            }, 200);
            if (searchData != '') {
                templateObject.getAllGlobalSearch(searchData);
                event.preventDefault();
            }
        }
    },
    'click .btnCloseModalMobile': function(event) {
        let templateObject = Template.instance();
        templateObject.searchdatatablerecords.set('');
        $('#tblSearchOverview_filter .form-control-sm').val('');
        $('.txtGlobalSearchMobile').val('');
        $('.txtGlobalSearch').val('');

    },
    'keyup #tblSearchOverview_filter input': function(event) {
        if (event.keyCode == 13) {
            $('.txtGlobalSearchMobile').val($(event.target).val());
            $('.txtGlobalSearch').val($(event.target).val());
            $(".btnGlobalSearch").trigger("click");
        }
    },
    'click #sidebarToggleTop': function(event) {
        var newnav = document.getElementById("sidebar");
        if (window.getComputedStyle(newnav).display === "none") {
            document.getElementById("sidebar").style.display = "block";
        } else {
            document.getElementById("sidebar").style.display = "none";
            document.getElementById("colContent").style.width = "100vw";
        }
    },

    'click #navOrganisationSettings': function(event) {
        window.open('/accesslevel', '_self');
    },
    'click #navhome': function(event) {
        window.open('/dashboard', '_self');
    },
    'click #navmain': function(event) {
        window.open('/home', '_self');
    },
    'click #navbankaccounts': function(event) {
        window.open('/bankaccounts', '_self');
    },
    'click #navchartofaccounts': function(event) {
        window.open('/settings/accounts/all-accounts', '_self');
    },
    'click #navpurchases': function(event) {
        window.open('/purchases', '_self');
    },
    'click #navinventory': function(event) {
        window.open('/productexpresslist', '_self');
    },
    'click #navstocktransferlist': function(event) {
        window.open('/stocktransfer', '_self');
    },
    'click #navstockadjlist': function(event) {
        window.open('/stocktake', '_self');
    },
    'click #navshipping': function(event) {
        window.open('/shipping', '_self');
    },
    'click #navfittings': function(event) {
        window.open('/manufacturing', '_self');
    },
    'click #navexpenseclaims': function(event) {
        window.open('/expenseclaims/current-claims', '_self');
    },
    'click #navfixedassets': function(event) {
        window.open('/fixedassets/draft', '_self');
    },
    'click #navallreports': function(event) {
        window.open('/allreports', '_self');
    },
    'click #navvatreturns': function(event) {
        window.open('/vatreturn', '_self');
    },
    'click #navallcontacts': function(event) {
        window.open('/allcontacts', '_self');
    },
    'click #navcustomers': function(event) {
        window.open('/customerslist', '_self');
    },
    'click #navsuppliers': function(event) {
        window.open('/supplierlist', '_self');
    },
    'click #navemployees': function(event) {
        window.open('/employeeslist', '_self');
    },
    'click #navtraining': function(event) {
        window.open('/traininglist', '_self');
    },
    'click #navgeneralsettings': function(event) {
        window.open('/settings', '_self');
    },
    'click #navsales': function(event) {
        window.open('/allsales', '_self');
    },
    'click #navinvoices': function(event) {
        window.open('/invoicelist/All', '_self');
    },
    'click #navquotes': function(event) {
        window.open('/quoteslist/#All', '_self');
    },
    'click #navsalesorder': function(event) {
        window.open('/salesorderslist', '_self');
    },
    'click #navAccessLevel': function(event) {
        window.open('/accesslevel', '_self');
    },
    'click #navexpenseclaims': function(event) {
        window.open('/expenseclaims/current-claims', '_self');
    },
    'click #navfixedassets': function(event) {
        window.open('/fixedassets/draft', '_self');
    },
    'click #navpurchases': function(event) {
        window.open('/purchases', '_self');
    },
    'click #navbill': function(event) {
        window.open('/billslist/All', '_self');
    },
    'click #navpurchaseorder': function(event) {
        window.open('/polist/#All', '_self');
    },
    'click #navawaitingcustpayment': function(event) {
        window.open('/awaitingcustomerpaylist', '_self');
    },
    'click #navcustPaymentList': function(event) {
        window.open('/customerpaymentlist', '_self');
    },
    'click #navawaitingsupptpayment': function(event) {
        window.open('/awaitingsupplierpaylist', '_self');
    },
    'click #navsuppPaymentList': function(event) {
        window.open('/supplierpaymentlist', '_self');
    },
    'click #navPaymentOverview': function(event) {
        window.open('/payments', '_self');
    },
    'click #closeCloudTopPanelMenu': function(event) {
        let templateObject = Template.instance();
        let empLoggedID = Session.get('mySessionEmployeeLoggedID');
        let accesslevelService = new AccessLevelService();
        let isTopPanel = false;
        let topPanelID = Session.get('CloudTopPanelMenuID');
        let topPanelFormID = Session.get('CloudTopPanelMenuFormID');

        let data = {
            type: "TEmployeeFormAccess",
            fields: {
                ID: topPanelID,
                EmployeeId: empLoggedID,
                AccessLevel: 6,
                FormId: topPanelFormID
            }
        }
        if (confirm("Are you sure you want to close the top panel?")) {
            accesslevelService.saveEmpAccess(data).then(function(data) {
                Session.setPersistent('CloudTopPanelMenu', isTopPanel);

                Meteor._reload.reload();
            }).catch(function(err) {
                Bert.alert('<strong>' + err + '</strong>!', 'danger');

            });
        } else {}
    },
    'click .userprofileclick': function(event) {
        window.open('/employeescard?id=' + Session.get('mySessionEmployeeLoggedID'), '_self');
    },
    'click .btnRefreshSearch': function(event) {
        let templateObject = Template.instance();
        templateObject.searchdatatablerecords.set('');
        var searchData = $('.txtGlobalSearch').val().toLowerCase();
        setTimeout(function() {
            $('#tblSearchOverview_filter .form-control-sm').val(searchData);
        }, 200);
        if (searchData != '') {
            templateObject.getAllGlobalSearch(searchData);
        }
    },
    'click #exportbtn': function() {
        jQuery('#tblSearchOverview_wrapper .dt-buttons .btntabletocsv').click();
    },
    'click .printConfirm': function(event) {
        jQuery('#tblSearchOverview_wrapper .dt-buttons .btntabletopdf').click();
    },
    'click .dropdown-toggle': function(event) {

    }

});

Template.header.helpers({
    isCloudUserPass: () => {
        return Template.instance().isCloudUserPass.get();
    },
    includeDashboard: () => {
        return Template.instance().includeDashboard.get();
    },
    includeMain: () => {
        return Template.instance().includeMain.get();
    },
    includeInventory: () => {
        return Template.instance().includeInventory.get();
    },
    includeManufacturing: () => {
        return Template.instance().includeManufacturing.get();
    },
    includeAccessLevels: () => {
        return Template.instance().includeAccessLevels.get();
    },
    includeShipping: () => {
        return Template.instance().includeShipping.get();
    },
    includeStockTransfer: () => {
        return Template.instance().includeStockTransfer.get();
    },
    includeStockTake: () => {
        return Template.instance().includeStockTake.get();
    },
    isCloudSidePanelMenu: () => {
        return Template.instance().isCloudSidePanelMenu.get();
    },
    isCloudTopPanelMenu: () => {
        return Template.instance().isCloudTopPanelMenu.get();
    },
    includeSales: () => {
        return Template.instance().includeSales.get();
    },
    includePurchases: () => {
        return Template.instance().includePurchases.get();
    },
    includeExpenseClaims: () => {
        return Template.instance().includeExpenseClaims.get();
    },
    includeFixedAssets: () => {
        return Template.instance().includeFixedAssets.get();
    },
    includePayments: () => {
        return Template.instance().includePayments.get();
    },
    includeContacts: () => {
        return Template.instance().includeContacts.get();
    },
    includeAccounts: () => {
        return Template.instance().includeAccounts.get();
    },
    includeReports: () => {
        return Template.instance().includeReports.get();
    },
    includeSettings: () => {
        return Template.instance().includeSettings.get();
    },
    isGreenTrack: function() {
        let checkGreenTrack = Session.get('isGreenTrack') || false;
        return checkGreenTrack;
    },
    isCloudTrueERP: function() {
        let checkCloudTrueERP = Session.get('CloudTrueERPModule') || false;
        return checkCloudTrueERP;
    },
    searchdatatablerecords: () => {
        return Template.instance().searchdatatablerecords.get().sort(function(a, b) {
            if (a.transDate == 'NA') {
                return 1;
            } else if (b.transDate == 'NA') {
                return -1;
            }
            return (a.transDate.toUpperCase() > b.transDate.toUpperCase()) ? 1 : -1;
        });
    }
});
