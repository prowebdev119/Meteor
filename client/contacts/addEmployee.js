import { ContactService } from "./contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { UtilityService } from "../utility-service";
import { CountryService } from '../js/country-service';
import { PaymentsService } from '../payments/payments-service';
import { ProductService } from '../product/product-service';
import { SideBarService } from '../js/sidebar-service';
import { EmployeePayrollService } from '../js/employeepayroll-service';
import EmployeePayrollApi from "../js/Api/EmployeePayrollApi";
import { Random } from 'meteor/random';
import { AppointmentService } from '../appointments/appointment-service';
import '../lib/global/indexdbstorage.js';
import EmployeePaySettings from "../js/Api/Model/EmployeePaySettings";
import EmployeePaySettingFields from "../js/Api/Model/EmployeePaySettingFields";
import AssignLeaveType from "../js/Api/Model/AssignLeaveType";
import AssignLeaveTypeFields from "../js/Api/Model/AssignLeaveTypeFields";
import PayTemplateEarningLine from "../js/Api/Model/PayTemplateEarningLine";
import PayTemplateEarningLineFields from "../js/Api/Model/PayTemplateEarningLineFields";
import PayTemplateDeductionLine from "../js/Api/Model/PayTemplateDeductionLine";
import PayTemplateDeductionLineFields from "../js/Api/Model/PayTemplateDeductionLineFields";
import PayTemplateSuperannuationLine from "../js/Api/Model/PayTemplateSuperannuationLine";
import PayTemplateSuperannuationLineFields from "../js/Api/Model/PayTemplateSuperannuationLineFields";
import PayTemplateReiumbursementLine from "../js/Api/Model/PayTemplateReiumbursementLine";
import PayTemplateReiumbursementLineFields from "../js/Api/Model/PayTemplateReiumbursementLineFields";
import ApiService from "../js/Api/Module/ApiService";
import LeaveRequest from "../js/Api/Model/LeaveRequest";
import LeaveRequestFields from "../js/Api/Model/LeaveRequestFields";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
let edtProductSelect = "";
Template.employeescard.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.payTemplateEarningLineInfo = new ReactiveVar();
    templateObject.payTemplateDeductionLineInfo = new ReactiveVar();
    templateObject.payTemplateSuperannuationLineInfo = new ReactiveVar();
    templateObject.payTemplateReiumbursementLineInfo = new ReactiveVar();
    templateObject.employeePayInfos = new ReactiveVar();
    templateObject.employeePaySettings = new ReactiveVar();
    templateObject.leaveTypesDrpDown = new ReactiveVar();
    templateObject.assignLeaveTypeInfos = new ReactiveVar();
    templateObject.leaveRequestInfos = new ReactiveVar();
    templateObject.bankAccList = new ReactiveVar();
    templateObject.countryData = new ReactiveVar();
    templateObject.productsdatatable = new ReactiveVar();
    templateObject.empuserrecord = new ReactiveVar();
    templateObject.employeerecords = new ReactiveVar([]);
    templateObject.empPriorities = new ReactiveVar([]);
    templateObject.recentTrasactions = new ReactiveVar([]);

    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.isCloudUserPass = new ReactiveVar();
    templateObject.isCloudUserPass.set(false);

    templateObject.selectedproducts = new ReactiveVar([]);

    templateObject.selectedemployeeproducts = new ReactiveVar([]);

    templateObject.preferedPaymentList = new ReactiveVar();
    templateObject.termsList = new ReactiveVar();
    templateObject.deliveryMethodList = new ReactiveVar();
    templateObject.taxCodeList = new ReactiveVar();
    templateObject.defaultsaletaxcode = new ReactiveVar();

    /* Attachments */
    templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();
    templateObject.currentAttachLineID = new ReactiveVar();

    templateObject.imageFileData = new ReactiveVar();

    templateObject.countUserCreated = new ReactiveVar();
    templateObject.isUserAddition = new ReactiveVar();
    templateObject.isUserAddition.set(true);
    templateObject.calendarOptions = new ReactiveVar([]);

    templateObject.allrepservicedata = new ReactiveVar([]);
});

Template.employeescard.onRendered(function () {
    var erpGet = erpDb();
    $('.fullScreenSpin').css('display', 'inline-block');
    Session.setPersistent('cloudCurrentLogonName', '');
    //var splashArrayRepServiceList = new Array();
    let templateObject = Template.instance();
    let contactService = new ContactService();
    var countryService = new CountryService();
    let paymentService = new PaymentsService();
    let productService = new ProductService();
    let appointmentService = new AppointmentService();
    const records = [];
    let countries = [];

    let preferedPayments = [];
    let terms = [];
    let deliveryMethods = [];
    let taxCodes = [];
    let employeePriority = [];
    let currentId = FlowRouter.current().queryParams;
    let employeeID = ( !isNaN(currentId.id) )? currentId.id : 0;

    const dataTableList = [];
    const tableHeaderList = [];

    let salestaxcode = '';
    let totAmount = 0;
    let totAmountOverDue = 0;

    setTimeout(function() {
        $('#tblLeaveRequests').DataTable({
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "taxratelist_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible'
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Tax Rate List',
                filename: "taxratelist_" + moment().format(),
                exportOptions: {
                    columns: ':visible'
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
                fixedColumnsRight: 1
            },
            lengthMenu: [
                [25, -1],
                [25, "All"]
            ],
            // bStateSave: true,
            // rowId: 0,
            paging: true,
            info: true,
            responsive: true,
            "order": [
                [0, "asc"]
            ],
            action: function() {
                $('#tblLeaveRequests').DataTable().ajax.reload();
            },
            "fnDrawCallback": function(oSettings) {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            },

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

        // $('#currencyLists').DataTable().column( 0 ).visible( true );
        $('.fullScreenSpin').css('display', 'none');
    }, 100);

    setTimeout(function() {
        $('#tblPayslipHistory').DataTable({
            columnDefs: [{
                "orderable": false,
                "targets": -1
            }],
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "taxratelist_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible'
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Tax Rate List',
                filename: "taxratelist_" + moment().format(),
                exportOptions: {
                    columns: ':visible'
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
                fixedColumnsRight: 1
            },
            lengthMenu: [
                [25, -1],
                [25, "All"]
            ],
            // bStateSave: true,
            // rowId: 0,
            paging: true,
            info: true,
            responsive: true,
            "order": [
                [0, "asc"]
            ],
            action: function() {
                $('#tblPayslipHistory').DataTable().ajax.reload();
            },
            "fnDrawCallback": function(oSettings) {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            },

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

        // $('#currencyLists').DataTable().column( 0 ).visible( true );
        $('.fullScreenSpin').css('display', 'none');
    }, 100);

    setTimeout(function() {
        $('#tblPayrollNotes').DataTable({
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [{
                extend: 'excelHtml5',
                text: '',
                download: 'open',
                className: "btntabletocsv hiddenColumn",
                filename: "taxratelist_" + moment().format(),
                orientation: 'portrait',
                exportOptions: {
                    columns: ':visible'
                }
            }, {
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Tax Rate List',
                filename: "taxratelist_" + moment().format(),
                exportOptions: {
                    columns: ':visible'
                }
            }],
            select: true,
            destroy: true,
            colReorder: true,
            colReorder: {
                fixedColumnsRight: 1
            },
            lengthMenu: [
                [25, -1],
                [25, "All"]
            ],
            // bStateSave: true,
            // rowId: 0,
            paging: true,
            info: true,
            responsive: true,
            "order": [
                [0, "asc"]
            ],
            action: function() {
                $('#tblPayrollNotes').DataTable().ajax.reload();
            },
            "fnDrawCallback": function(oSettings) {
                setTimeout(function() {
                    MakeNegative();
                }, 100);
            },

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

        // $('#currencyLists').DataTable().column( 0 ).visible( true );
        $('.fullScreenSpin').css('display', 'none');
    }, 200);

    setTimeout(function () {
        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'defaulttax', function (error, result) {
            if (error) {
                salestaxcode = loggedTaxCodeSalesInc;
                templateObject.defaultsaletaxcode.set(salestaxcode);
            } else {
                if (result) {
                    salestaxcode = result.customFields[1].taxvalue || loggedTaxCodeSalesInc;
                    templateObject.defaultsaletaxcode.set(salestaxcode);
                }

            }
        });

    }, 500);

    setTimeout(function () {
        MakeNegative();
        $("#dtStartingDate,#dtDOB,#dtTermninationDate,#dtAsOf,#edtLeaveStartDate,#edtLeaveEndDate,#edtPeriodPaymentDate").datepicker({
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

    }, 500);
    var CloudUserPass = Session.get('CloudUserPass');
    if (CloudUserPass) {
        templateObject.isCloudUserPass.set(true);
    }

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTransactionlist', function (error, result) {
        if (error) {}
        else {
            if (result) {

                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;
                    // let columnindex = customcolumn[i].index + 1;
                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });

    function MakeNegative() {
        $('td').each(function () {
            if ($(this).text().indexOf('-' + Currency) >= 0)
                $(this).addClass('text-danger')
        });
    };


    setTimeout(function () {
    if (currentId.transTab == 'prod') {
        $('.nav-link').removeClass('active');
        $('.tabproductsservices').trigger('click');
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#tab-productsservices").offset().top
        }, 1000);
    }
    }, 500);



    templateObject.getAllSelectedProducts = function (employeeName) {
        let productlist = [];
        $('.fullScreenSpin').css('display', 'inline-block');
        var splashArrayRepServiceList = new Array();
        sideBarService.getSelectedProducts(employeeName).then(function (data) {
                var dataList = {};
                $('.fullScreenSpin').css('display', 'none');
                if(data.trepservices.length > 0){
                for (let i = 0; i < data.trepservices.length; i++) {
                  let linePayRate = data.trepservices[i].PayRate||0;
                  if(data.trepservices[i].PayRate != 0){

                  }else{
                     linePayRate = data.trepservices[i].Rate;
                  }

                  let calcRate =  utilityService.modifynegativeCurrencyFormat(data.trepservices[i].Rate) || 0.00;
                  let calcPayRate = utilityService.modifynegativeCurrencyFormat(linePayRate) || utilityService.modifynegativeCurrencyFormat(linePayRate)|| 0.00;
                  var dataListService = [
                    data.trepservices[i].ServiceDesc || '',
                    data.trepservices[i].ServiceDesc || '',
                    '<input class="colServiceCostPrice highlightInput" type="text" value="'+calcRate+'">' || '',
                    '<input class="colServiceSalesPrice highlightInput" type="text" value="'+calcPayRate+'">' || '',
                    data.trepservices[i].Id || '',
                    '<span class="table-remove colServiceDelete"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>' || ''
                    // JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null
                ];

                splashArrayRepServiceList.push(dataListService);
                    dataList = {
                        id: data.trepservices[i].Id || '',
                        employee: data.trepservices[i].EmployeeName || '',
                        productname: data.trepservices[i].ServiceDesc || '',
                        productdesc: data.trepservices[i].ServiceDesc || '',
                        rate: utilityService.modifynegativeCurrencyFormat(data.trepservices[i].Rate) || 0.00,
                        payrate: utilityService.modifynegativeCurrencyFormat(linePayRate) || utilityService.modifynegativeCurrencyFormat(linePayRate)|| 0.00
                    };

                    //if(employeeName == data.trepservices[i].fields.EmployeeName){
                        productlist.push(dataList);
                    //}


                }
              }else{

                var dataListService = [
                  '',
                  '',
                  '<input class="colServiceCostPrice highlightInput" type="text" value="">' || '',
                  '<input class="colServiceSalesPrice highlightInput" type="text" value="">' || '',
                  Random.id(),
                  '<span class="table-remove colServiceDelete"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>' || ''
                  // JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null
              ];
              //splashArrayRepServiceList.push(dataListService);
                dataList = {
                      id:'',
                      employee:  '',
                      productname: '',
                      productdesc:  '',
                      rate: Currency + 0.00,
                      payrate: Currency + 0.00
                  };
                      productlist.push(dataList);
              }
                templateObject.selectedproducts.set(productlist);

                if(templateObject.selectedproducts.get()){
                  setTimeout(function () {
                    templateObject.allrepservicedata.set(splashArrayRepServiceList);
                    $('#tblEmpServiceList').DataTable({
                      data: splashArrayRepServiceList,
                      columnDefs: [
                                {contenteditable:"false", className: "colServiceName", targets: 0},
                                {contenteditable:"false", className: "colServiceDescription", targets: 1},
                                {contenteditable:"true", targets: 2},
                                {contenteditable:"true", targets: 3},
                                {contenteditable:"false", className: "colID hiddenColumn", targets: 4},
                                {contenteditable:"false", "orderable": false, className: "colServiceDelete", targets: -1}
                            ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        select: true,
                        destroy: true,
                        colReorder: true,
                        colReorder: {
                                fixedColumnsRight: 1
                            },
                        // pageLength: initialDatatableLoad,
                        // lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        paging: false,
                        // "scrollY": "400px",
                        info: true,
                        pageLength: -1,
                        lengthMenu: [ [ -1], ["All"] ],
                        responsive: true,
                        "order": [[0, "asc"]],
                        action: function () {
                            $('#tblEmpServiceList').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#productListModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblEmpServiceList_filter");
                            $("<button class='btn btn-primary btnRefreshProductService' type='button' id='btnRefreshProductService' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblEmpServiceList_filter");
                        }

              }).on('page', function () {
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);
                  let draftRecord = templateObject.datatablerecords.get();
                  templateObject.datatablerecords.set(draftRecord);
              }).on('search.dt', function (eventSearch, searchdata) {
                  let dataSearchName = $('#tblEmpServiceList_filter input').val();
                  if (searchdata.fnRecordsDisplay() > 0) {

                  }else {
                    if(dataSearchName.replace(/\s/g, '') != ''){
                     $('#productListModal').modal();
                    setTimeout(function() {
                        $('#tblInventoryService_filter .form-control-sm').focus();
                        $('#tblInventoryService_filter .form-control-sm').val(dataSearchName);
                        $('#tblInventoryService_filter .form-control-sm').trigger("input");

                    }, 500);
                  }
                  }
              }).on('column-reorder', function () {});
              $('.fullScreenSpin').css('display', 'none');
                    }, 100);
                }

            }).catch(function (err) {
              $('.fullScreenSpin').css('display', 'none');
            var  dataList = {
                  id:'',
                  employee:  '',
                  productname: '',
                  productdesc:  '',
                  rate: Currency + 0.00,
                  payrate: Currency + 0.00
              }
                  productlist.push(dataList);
                  templateObject.selectedproducts.set(productlist);
                  var dataListService = [
                    '',
                    '',
                    '<input class="colServiceCostPrice highlightInput" type="text" value="">' || '',
                    '<input class="colServiceSalesPrice highlightInput" type="text" value="">' || '',
                    Random.id(),
                    '<span class="table-remove colServiceDelete"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>' || ''
                    // JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null
                ];

                  setTimeout(function () {
                    templateObject.allrepservicedata.set(splashArrayRepServiceList);
                    $('#tblEmpServiceList').DataTable({
                      data: splashArrayRepServiceList,
                      columnDefs: [
                                {contenteditable:"false", className: "colServiceName", targets: 0},
                                {contenteditable:"false", className: "colServiceDescription", targets: 1},
                                {contenteditable:"true", targets: 2},
                                {contenteditable:"true", targets: 3},
                                {contenteditable:"false", className: "colID hiddenColumn", targets: 4},
                                {contenteditable:"false", "orderable": false, className: "colServiceDelete", targets: -1}
                            ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        select: true,
                        destroy: true,
                        colReorder: true,
                        colReorder: {
                                fixedColumnsRight: 1
                            },
                        // pageLength: initialDatatableLoad,
                        // lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        paging: false,
                        // "scrollY": "400px",
                        info: true,
                        pageLength: -1,
                        lengthMenu: [ [ -1], ["All"] ],
                        responsive: true,
                        "order": [[0, "asc"]],
                        action: function () {
                            $('#tblEmpServiceList').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary' data-dismiss='modal' data-toggle='modal' data-target='#productListModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblEmpServiceList_filter");
                            $("<button class='btn btn-primary btnRefreshProductService' type='button' id='btnRefreshProductService' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblEmpServiceList_filter");
                        }

              }).on('page', function () {
                  setTimeout(function () {
                      MakeNegative();
                  }, 100);
                  let draftRecord = templateObject.datatablerecords.get();
                  templateObject.datatablerecords.set(draftRecord);
              }).on('column-reorder', function () {});
              $('.fullScreenSpin').css('display', 'none');
            }, 0);
            });
    }


    templateObject.getAllProductData = function () {
        productList = [];
        getVS1Data('TProductVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                productService.getNewProductListVS1().then(function (data) {
                    var dataList = {};
                    for (let i = 0; i < data.tproductvs1.length; i++) {
                        dataList = {
                            id: data.tproductvs1[i].Id || '',
                            productname: data.tproductvs1[i].ProductName || ''
                        }
                        if (data.tproductvs1[i].ProductType != 'INV') {
                            productList.push(dataList);
                        }

                    }

                    templateObject.productsdatatable.set(productList);

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tproductvs1;
                var dataList = {};
                for (let i = 0; i < useData.length; i++) {
                    dataList = {
                        id: useData[i].fields.ID || '',
                        productname: useData[i].fields.ProductName || ''
                    }
                    if (useData[i].fields.ProductType != 'INV') {
                        productList.push(dataList);
                    }
                }
                templateObject.productsdatatable.set(productList);

            }
        }).catch(function (err) {
            productService.getNewProductListVS1().then(function (data) {

                var dataList = {};
                for (let i = 0; i < data.tproductvs1.length; i++) {
                    dataList = {
                        id: data.tproductvs1[i].Id || '',
                        productname: data.tproductvs1[i].ProductName || ''
                    }
                    if (data.tproductvs1[i].ProductType != 'INV') {
                        productList.push(dataList);
                    }

                }
                templateObject.productsdatatable.set(productList);

            });
        });

    }
    templateObject.getAllProductData();

    contactService.getAllEmployeesPriority().then(function (data) {

        if (data.temployee.length > 0) {
            for (let x = 0; x < data.temployee.length; x++) {
                if (data.temployee[x].CustFld5 != "" && data.temployee[x].CustFld5 != "0") {
                    employeePriority.push(data.temployee[x].CustFld5);
                }
            }
            var result = employeePriority.map(function (x) {
                return parseInt(x, 10);
            });
            templateObject.empPriorities.set(result);
        }
    });

    templateObject.getAllProductRecentTransactions = function (employeeName) {
        getVS1Data('TInvoiceEx').then(function (dataObject) {
            if (dataObject.length == 0) {
                contactService.getAllInvoiceListByEmployee(employeeName).then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    for (let i = 0; i < data.tinvoice.length; i++) {
                        let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalAmount) || 0.00;
                        let totalTax = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalTax) || 0.00;
                        // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                        let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalAmountInc) || 0.00;
                        let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalPaid) || 0.00;
                        let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalBalance) || 0.00;
                        var dataList = {
                            id: data.tinvoice[i].Id || '',
                            employee: data.tinvoice[i].EmployeeName || '',
                            sortdate: data.tinvoice[i].SaleDate != '' ? moment(data.tinvoice[i].SaleDate).format("YYYY/MM/DD") : data.tinvoice[i].SaleDate,
                            saledate: data.tinvoice[i].SaleDate != '' ? moment(data.tinvoice[i].SaleDate).format("DD/MM/YYYY") : data.tinvoice[i].SaleDate,
                            customername: data.tinvoice[i].CustomerName || '',
                            totalamountex: totalAmountEx || 0.00,
                            totaltax: totalTax || 0.00,
                            totalamount: totalAmount || 0.00,
                            totalpaid: totalPaid || 0.00,
                            totaloustanding: totalOutstanding || 0.00,
                            salestatus: data.tinvoice[i].SalesStatus || '',
                            custfield1: data.tinvoice[i].SaleCustField1 || '',
                            custfield2: data.tinvoice[i].SaleCustField2 || '',
                            comments: data.tinvoice[i].Comments || '',
                        };
                        dataTableList.push(dataList);
                    }
                    templateObject.datatablerecords.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTransactionlist', function (error, result) {
                            if (error) {}
                            else {
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

                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    }

                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function () {
                        //$.fn.dataTable.moment('DD/MM/YY');
                        $('#tblTransactionlist').DataTable({
                            // dom: 'lBfrtip',
                            columnDefs: [{
                                    type: 'date',
                                    targets: 0
                                }
                            ],
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                    extend: 'excelHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "Employee Transaction List - " + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Sales Transaction',
                                    filename: "Employee Transaction List - " + moment().format(),
                                    exportOptions: {
                                        columns: ':visible',
                                        stripHtml: false
                                    }
                                }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [[0, "asc"]],
                            action: function () {
                                $('#tblTransactionlist').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },

                        }).on('page', function () {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.datatablerecords.get();
                            templateObject.datatablerecords.set(draftRecord);
                        }).on('column-reorder', function () {});
                        $('.fullScreenSpin').css('display', 'none');
                    }, 0);

                    var columns = $('#tblTransactionlist th');
                    let sTible = "";
                    let sWidth = "";
                    let sIndex = "";
                    let sVisible = "";
                    let columVisible = false;
                    let sClass = "";
                    $.each(columns, function (i, v) {
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
                    $('#tblTransactionlist tbody').on('click', 'tr', function () {
                        var listData = $(this).closest('tr').attr('id');
                        if (listData) {
                            window.open('/invoicecard?id=' + listData, '_self');
                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');

                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tinvoiceex;
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < useData.length; i++) {
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalAmount) || 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalTax) || 0.00;
                    // Currency+''+useData[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalAmountInc) || 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalPaid) || 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(useData[i].fields.TotalBalance) || 0.00;
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        employee: useData[i].fields.EmployeeName || '',
                        sortdate: useData[i].fields.SaleDate != '' ? moment(useData[i].fields.SaleDate).format("YYYY/MM/DD") : useData[i].fields.SaleDate,
                        saledate: useData[i].fields.SaleDate != '' ? moment(useData[i].fields.SaleDate).format("DD/MM/YYYY") : useData[i].fields.SaleDate,
                        customername: useData[i].fields.CustomerName || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        salestatus: useData[i].fields.SalesStatus || '',
                        custfield1: useData[i].fields.SaleCustField1 || '',
                        custfield2: useData[i].fields.SaleCustField2 || '',
                        comments: useData[i].fields.Comments || '',
                    };
                    dataTableList.push(dataList);
                }
                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTransactionlist', function (error, result) {
                        if (error) {}
                        else {
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

                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblTransactionlist').DataTable({
                        // dom: 'lBfrtip',
                        columnDefs: [{
                                type: 'date',
                                targets: 0
                            }
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Employee Transaction List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Sales Transaction',
                                filename: "Employee Transaction List - " + moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[0, "asc"]],
                        action: function () {
                            $('#tblTransactionlist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {});
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblTransactionlist th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function (i, v) {
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
                $('#tblTransactionlist tbody').on('click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        window.open('/invoicecard?id=' + listData, '_self');
                    }
                });

            }
        }).catch(function (err) {
            contactService.getAllInvoiceListByEmployee(employeeName).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.tinvoice.length; i++) {
                    let totalAmountEx = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalAmount) || 0.00;
                    let totalTax = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalTax) || 0.00;
                    // Currency+''+data.tinvoice[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                    let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalAmountInc) || 0.00;
                    let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalPaid) || 0.00;
                    let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tinvoice[i].TotalBalance) || 0.00;
                    var dataList = {
                        id: data.tinvoice[i].Id || '',
                        employee: data.tinvoice[i].EmployeeName || '',
                        sortdate: data.tinvoice[i].SaleDate != '' ? moment(data.tinvoice[i].SaleDate).format("YYYY/MM/DD") : data.tinvoice[i].SaleDate,
                        saledate: data.tinvoice[i].SaleDate != '' ? moment(data.tinvoice[i].SaleDate).format("DD/MM/YYYY") : data.tinvoice[i].SaleDate,
                        customername: data.tinvoice[i].CustomerName || '',
                        totalamountex: totalAmountEx || 0.00,
                        totaltax: totalTax || 0.00,
                        totalamount: totalAmount || 0.00,
                        totalpaid: totalPaid || 0.00,
                        totaloustanding: totalOutstanding || 0.00,
                        salestatus: data.tinvoice[i].SalesStatus || '',
                        custfield1: data.tinvoice[i].SaleCustField1 || '',
                        custfield2: data.tinvoice[i].SaleCustField2 || '',
                        comments: data.tinvoice[i].Comments || '',
                    };
                    dataTableList.push(dataList);
                }
                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTransactionlist', function (error, result) {
                        if (error) {}
                        else {
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

                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function () {
                    //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblTransactionlist').DataTable({
                        // dom: 'lBfrtip',
                        columnDefs: [{
                                type: 'date',
                                targets: 0
                            }
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "Employee Transaction List - " + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Sales Transaction',
                                filename: "Employee Transaction List - " + moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[0, "asc"]],
                        action: function () {
                            $('#tblTransactionlist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {});
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblTransactionlist th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function (i, v) {
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
                $('#tblTransactionlist tbody').on('click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    if (listData) {
                        window.open('/invoicecard?id=' + listData, '_self');
                    }
                });

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });

    }

    templateObject.getCountryData = function () {
        getVS1Data('TCountries').then(function (dataObject) {
            if (dataObject.length == 0) {
                countryService.getCountry().then((data) => {
                    for (let i = 0; i < data.tcountries.length; i++) {
                        countries.push(data.tcountries[i].Country)
                    }
                    countries = _.sortBy(countries);
                    templateObject.countryData.set(countries);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcountries;
                for (let i = 0; i < useData.length; i++) {
                    countries.push(useData[i].Country)
                }
                countries = _.sortBy(countries);
                templateObject.countryData.set(countries);

            }
        }).catch(function (err) {
            countryService.getCountry().then((data) => {
                for (let i = 0; i < data.tcountries.length; i++) {
                    countries.push(data.tcountries[i].Country)
                }
                countries = _.sortBy(countries);
                templateObject.countryData.set(countries);
            });
        });
    };
    templateObject.getCountryData();

    templateObject.getEmployeeProfileImageData = function (employeeName) {
        contactService.getEmployeeProfileImageByName(employeeName).then((data) => {
            let employeeProfile = '';
            for (let i = 0; i < data.temployeepicture.length; i++) {

                if (data.temployeepicture[i].EmployeeName === employeeName) {
                    employeeProfile = data.temployeepicture[i].EncodedPic;
                    $('.imageUpload').attr('src', 'data:image/jpeg;base64,' + employeeProfile);
                    $('.cloudEmpImgID').val(data.temployeepicture[i].Id);
                }
            }
        });
    }
    if (currentId.id == "undefined") {
        var currentDate = new Date();
        $('.fullScreenSpin').css('display', 'none');
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        let lineItemObj = {
            id: '',
            lid: 'Add Employee',
            title: '',
            company: '',
            firstname: '',
            middlename: '',
            lastname: '',
            tfn: '',
            priority: 0,
            color: "#00a3d3",
            email: '',
            phone: '',
            mobile: '',
            fax: '',
            skype: '',
            gender: '',
            dob: begunDate || '',
            startdate: begunDate || '',
            datefinished: '',
            position: '',
            streetaddress: '',
            city: '',
            state: '',
            postalcode: '',
            country: LoggedCountry || '',
            custFld1: '',
            custFld2: '',
            website: ''
        }

        templateObject.records.set(lineItemObj);
        setTimeout(function () {

            $('#tblTransactionlist').DataTable();
            $('.employeeTab').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 100);

        setTimeout(function () {
            $("#dtStartingDate,#dtDOB,#dtTermninationDate,#dtAsOf").datepicker({
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
            $('.fullScreenSpin').css('display', 'none');
        }, 100);
    } else {
        if (!isNaN(currentId.id)) {
            employeeID = currentId.id;
            templateObject.getAllSelectedProducts(employeeID);
            templateObject.getEmployeeData = function () {
                getVS1Data('TEmployee').then(function (dataObject) {

                    if (dataObject.length == 0) {
                        contactService.getOneEmployeeDataEx(employeeID).then(function (data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let empEmail = '';
                            let overideset = data.fields.User.fields.CustFld14;
                            if (overideset != "") {
                                if (overideset = "true") {
                                    overideset = true;
                                } else {
                                    overideset = false;
                                }
                                $("#overridesettings").prop('checked', overideset);
                            } else {
                                $("#overridesettings").prop('checked', false);
                            }

                            if (data.fields.Email.replace(/\s/g, '') == '') {
                                if (data.fields.User != null) {
                                    let emplineItems = [];
                                    let emplineItemObj = {};
                                    empEmail = data.fields.User.fields.LogonName;
                                    Session.setPersistent('cloudCurrentLogonName', data.fields.User.fields.LogonName);
                                    emplineItemObj = {
                                        empID: data.fields.User.fields.EmployeeId || '',
                                        EmployeeName: data.fields.User.fields.EmployeeName || '',
                                        LogonName: data.fields.User.fields.LogonName || '',
                                        PasswordHash: data.fields.User.fields.LogonPassword || ''
                                    };
                                    emplineItems.push(emplineItemObj);
                                    templateObject.empuserrecord.set(emplineItems);
                                } else {
                                    let emplineItems = [];
                                    let emplineItemObj = {};
                                    emplineItemObj = {
                                        empID: '',
                                        EmployeeName: data.fields.EmployeeName,
                                        LogonName: ''
                                    };
                                    emplineItems.push(emplineItemObj);
                                    templateObject.empuserrecord.set(emplineItems);
                                }

                            } else {
                                empEmail = data.fields.Email;
                                if (data.fields.User != null) {
                                    let emplineItems = [];
                                    let emplineItemObj = {};
                                    Session.setPersistent('cloudCurrentLogonName', data.fields.User.fields.LogonName);
                                    emplineItemObj = {
                                        empID: data.fields.User.fields.EmployeeId || '',
                                        EmployeeName: data.fields.User.fields.EmployeeName || '',
                                        LogonName: data.fields.User.fields.LogonName || '',
                                        PasswordHash: data.fields.User.fields.LogonPassword || ''
                                    };
                                    emplineItems.push(emplineItemObj);
                                    templateObject.empuserrecord.set(emplineItems);
                                } else {
                                    let emplineItems = [];
                                    let emplineItemObj = {};
                                    emplineItemObj = {
                                        empID: '',
                                        EmployeeName: data.fields.EmployeeName,
                                        LogonName: ''
                                    };
                                    emplineItems.push(emplineItemObj);
                                    templateObject.empuserrecord.set(emplineItems);
                                }
                            }

                            let lineItemObj = {
                                id: data.fields.ID,
                                lid: 'Edit Employee',
                                title: data.fields.Title || '',
                                firstname: data.fields.FirstName || '',
                                middlename: data.fields.MiddleName || '',
                                lastname: data.fields.LastName || '',
                                company: data.fields.EmployeeName || '',
                                tfn: data.fields.TFN || '',
                                priority: data.fields.CustFld5 || 0,
                                color: data.fields.CustFld6 || "#00a3d3",
                                email: empEmail || '',
                                phone: data.fields.Phone || '',
                                mobile: data.fields.Mobile || '',
                                fax: data.fields.FaxNumber || '',
                                skype: data.fields.SkypeName || '',
                                gender: data.fields.Sex || '',
                                dob: data.fields.DOB ? moment(data.fields.DOB).format('DD/MM/YYYY') : "",
                                startdate: data.fields.DateStarted ? moment(data.fields.DateStarted).format('DD/MM/YYYY') : "",
                                datefinished: data.fields.DateFinished ? moment(data.fields.DateFinished).format('DD/MM/YYYY') : "",
                                position: data.fields.Position || '',
                                streetaddress: data.fields.Street || '',
                                city: data.fields.Street2 || '',
                                state: data.fields.State || '',
                                postalcode: data.fields.PostCode || '',
                                country: data.fields.Country || LoggedCountry,
                                custfield1: data.fields.CustFld1 || '',
                                custfield2: data.fields.CustFld2 || '',
                                custfield3: data.fields.CustFld3 || '',
                                custfield4: data.fields.CustFld4 || '',
                                custfield14: data.fields.CustFld14 || '',
                                website: '',
                                notes: data.fields.Notes || '',

                            };
                            templateObject.getEmployeeProfileImageData(data.fields.EmployeeName);

                            templateObject.records.set(lineItemObj);
                            setTimeout(function () {
                              if(data.fields.CustFld7 == "true"){
                                $("#productCostPayRate").prop("checked", true);
                              }else{
                                $("#productCostPayRate").prop("checked", false);
                              }

                              if(data.fields.CustFld8 == "true" || data.fields.CustFld8 == ""){
                                $("#addAllProducts").prop("checked", true);
                                $('.activeProductEmployee').css('display', 'none');
                              }else{
                                $("#addAllProducts").prop("checked", false);
                                $('.activeProductEmployee').css('display', 'block');
                              }
                            }, 500);
                            if (currentId.addvs1user == "true") {
                                setTimeout(function () {
                                    $('.employeeTab').trigger('click');
                                    $('.addvs1usertab').trigger('click');
                                    $('#cloudEmpEmailAddress').focus();
                                }, 100);
                            }

                            if ((currentId.addvs1user == "true") && (currentId.id)) {
                                // swal("Please ensure the employee has a email and password.", "", "info");
                                if (useData[i].fields.User != null) {
                                    swal({
                                        title: 'User currently has an Existing Login.',
                                        text: '',
                                        type: 'info',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            $('#cloudEmpEmailAddress').focus();
                                            $('.modal-backdrop').css('display', 'none');
                                        } else if (result.dismiss === 'cancel') {
                                            $('.modal-backdrop').css('display', 'none');
                                        }
                                    });
                                } else {
                                    swal({
                                        title: 'Please ensure the employee has a email and password.',
                                        text: '',
                                        type: 'info',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            $('#cloudEmpEmailAddress').focus();
                                            $('.modal-backdrop').css('display', 'none');
                                        } else if (result.dismiss === 'cancel') {
                                            $('.modal-backdrop').css('display', 'none');
                                        }
                                    });
                                }

                            }
                            /* START attachment */
                            templateObject.attachmentCount.set(0);
                            if (data.fields.Attachments) {
                                if (data.fields.Attachments.length) {
                                    templateObject.attachmentCount.set(data.fields.Attachments.length);
                                    templateObject.uploadedFiles.set(data.fields.Attachments);

                                }
                            }
                            /* END  attachment */

                            //templateObject.getAllProductRecentTransactions(data.fields.EmployeeName);
                            // $('.fullScreenSpin').css('display','none');
                            setTimeout(function () {
                                var rowCount = $('.results tbody tr').length;
                                $('.counter').text(rowCount + ' items');
                                $('#cloudEmpName').val(data.fields.EmployeeName);
                                $("#dtStartingDate,#dtDOB,#dtTermninationDate,#dtAsOf").datepicker({
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
                                // $('.fullScreenSpin').css('display','none');
                            }, 500);
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.temployee;
                        var added = false;
                        for (let i = 0; i < useData.length; i++) {
                            if (parseInt(useData[i].fields.ID) === parseInt(employeeID)) {
                                added = true;
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                let empEmail = '';
                                let overideset = useData[i].fields.CustFld14;

                                if (useData[i].fields.Email.replace(/\s/g, '') == '') {
                                    if (useData[i].fields.User != null) {
                                        let emplineItems = [];
                                        let emplineItemObj = {};
                                        empEmail = useData[i].fields.User.fields.LogonName;
                                        Session.setPersistent('cloudCurrentLogonName', useData[i].fields.User.fields.LogonName);
                                        emplineItemObj = {
                                            empID: useData[i].fields.User.fields.EmployeeId || '',
                                            EmployeeName: useData[i].fields.User.fields.EmployeeName || '',
                                            LogonName: useData[i].fields.User.fields.LogonName || '',
                                            PasswordHash: useData[i].fields.User.fields.LogonPassword || ''
                                        };
                                        emplineItems.push(emplineItemObj);
                                        templateObject.empuserrecord.set(emplineItems);
                                    } else {
                                        let emplineItems = [];
                                        let emplineItemObj = {};
                                        emplineItemObj = {
                                            empID: '',
                                            EmployeeName: useData[i].fields.EmployeeName,
                                            LogonName: ''
                                        };
                                        emplineItems.push(emplineItemObj);
                                        templateObject.empuserrecord.set(emplineItems);
                                    }

                                } else {
                                    empEmail = useData[i].fields.Email;
                                    if (useData[i].fields.User != null) {
                                        let emplineItems = [];
                                        let emplineItemObj = {};
                                        Session.setPersistent('cloudCurrentLogonName', useData[i].fields.User.fields.LogonName);
                                        emplineItemObj = {
                                            empID: useData[i].fields.User.fields.EmployeeId || '',
                                            EmployeeName: useData[i].fields.User.fields.EmployeeName || '',
                                            LogonName: useData[i].fields.User.fields.LogonName || '',
                                            PasswordHash: useData[i].fields.User.fields.LogonPassword || ''
                                        };
                                        emplineItems.push(emplineItemObj);
                                        templateObject.empuserrecord.set(emplineItems);
                                    } else {
                                        let emplineItems = [];
                                        let emplineItemObj = {};
                                        emplineItemObj = {
                                            empID: '',
                                            EmployeeName: useData[i].fields.EmployeeName,
                                            LogonName: ''
                                        };
                                        emplineItems.push(emplineItemObj);
                                        templateObject.empuserrecord.set(emplineItems);
                                    }
                                }

                                let lineItemObj = {
                                    id: useData[i].fields.ID,
                                    lid: 'Edit Employee',
                                    title: useData[i].fields.Title || '',
                                    firstname: useData[i].fields.FirstName || '',
                                    middlename: useData[i].fields.MiddleName || '',
                                    lastname: useData[i].fields.LastName || '',
                                    company: useData[i].fields.EmployeeName || '',
                                    // company: "BBB",
                                    tfn: useData[i].fields.TFN || '',
                                    priority: useData[i].fields.CustFld5 || 0,
                                    color: useData[i].fields.CustFld6 || "#00a3d3",
                                    email: empEmail || '',
                                    phone: useData[i].fields.Phone || '',
                                    mobile: useData[i].fields.Mobile || '',
                                    fax: useData[i].fields.FaxNumber || '',
                                    skype: useData[i].fields.SkypeName || '',
                                    gender: useData[i].fields.Sex || '',
                                    dob: useData[i].fields.DOB ? moment(useData[i].fields.DOB).format('DD/MM/YYYY') : "",
                                    startdate: useData[i].fields.DateStarted ? moment(useData[i].fields.DateStarted).format('DD/MM/YYYY') : "",
                                    datefinished: useData[i].fields.DateFinished ? moment(useData[i].fields.DateFinished).format('DD/MM/YYYY') : "",
                                    position: useData[i].fields.Position || '',
                                    streetaddress: useData[i].fields.Street || '',
                                    city: useData[i].fields.Street2 || '',
                                    state: useData[i].fields.State || '',
                                    postalcode: useData[i].fields.PostCode || '',
                                    country: useData[i].fields.Country || LoggedCountry,
                                    custfield1: useData[i].fields.CustFld1 || '',
                                    custfield2: useData[i].fields.CustFld2 || '',
                                    custfield3: useData[i].fields.CustFld3 || '',
                                    custfield4: useData[i].fields.CustFld4 || '',
                                    custfield14: useData[i].fields.CustFld14 || '',
                                    website: '',
                                    notes: useData[i].fields.Notes || '',

                                };
                                templateObject.getEmployeeProfileImageData(useData[i].fields.EmployeeName);

                                templateObject.records.set(lineItemObj);
                                if (currentId.addvs1user == "true") {
                                    setTimeout(function () {
                                        $('.employeeTab').trigger('click');
                                        $('.addvs1usertab').trigger('click');
                                        $('#cloudEmpEmailAddress').focus();
                                    }, 100);
                                }
                                setTimeout(function () {
                                    if (overideset != "") {
                                        if (overideset == "true") {
                                            $("#overridesettings").prop('checked', true);
                                        } else {
                                            $("#overridesettings").prop('checked', false);
                                        }
                                    } else {
                                        $("#overridesettings").prop('checked', false);
                                    }

                                }, 1000);

                              setTimeout(function () {
                                if(useData[i].fields.CustFld7 == "true"){
                                  $("#productCostPayRate").prop("checked", true);
                                }else{
                                  $("#productCostPayRate").prop("checked", false);
                                }

                                if(useData[i].fields.CustFld8 == "true" || useData[i].fields.CustFld8 == ""){
                                  $("#addAllProducts").prop("checked", true);
                                  $('.activeProductEmployee').css('display', 'none');
                                }else{
                                  $("#addAllProducts").prop("checked", false);
                                  $('.activeProductEmployee').css('display', 'block');
                                }
                              }, 500);
                                if ((currentId.addvs1user == "true") && (currentId.id)) {
                                    // swal("Please ensure the employee has a email and password.", "", "info");

                                    if (useData[i].fields.User != null) {
                                        swal({
                                            title: 'User currently has an Existing Login.',
                                            text: '',
                                            type: 'info',
                                            showCancelButton: false,
                                            confirmButtonText: 'OK'
                                        }).then((result) => {
                                            if (result.value) {
                                                $('#cloudEmpEmailAddress').focus();
                                                $('.modal-backdrop').css('display', 'none');
                                            } else if (result.dismiss === 'cancel') {
                                                $('.modal-backdrop').css('display', 'none');
                                            }
                                        });
                                    } else {
                                        swal({
                                            title: 'Please ensure the employee has a email and password.',
                                            text: '',
                                            type: 'info',
                                            showCancelButton: false,
                                            confirmButtonText: 'OK'
                                        }).then((result) => {
                                            if (result.value) {
                                                $('#cloudEmpEmailAddress').focus();
                                                $('.modal-backdrop').css('display', 'none');
                                            } else if (result.dismiss === 'cancel') {
                                                $('.modal-backdrop').css('display', 'none');
                                            }
                                        });
                                    }

                                }
                                /* START attachment */
                                templateObject.attachmentCount.set(0);
                                if (useData[i].fields.Attachments) {
                                    if (useData[i].fields.Attachments.length) {
                                        templateObject.attachmentCount.set(useData[i].fields.Attachments.length);
                                        templateObject.uploadedFiles.set(useData[i].fields.Attachments);

                                    }
                                }
                                /* END  attachment */

                                //templateObject.getAllProductRecentTransactions(useData[i].fields.EmployeeName);
                                // $('.fullScreenSpin').css('display','none');
                                setTimeout(function () {
                                    var rowCount = $('.results tbody tr').length;
                                    $('.counter').text(rowCount + ' items');
                                    $('#cloudEmpName').val(useData[i].fields.EmployeeName);
                                    $("#dtStartingDate,#dtDOB,#dtTermninationDate,#dtAsOf").datepicker({
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
                                    // $('.fullScreenSpin').css('display','none');
                                }, 500);

                            }
                        }

                        if (!added) {
                            contactService.getOneEmployeeDataEx(employeeID).then(function (data) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                let empEmail = '';

                                if (data.fields.Email.replace(/\s/g, '') == '') {
                                    if (data.fields.User != null) {
                                        let emplineItems = [];
                                        let emplineItemObj = {};
                                        empEmail = data.fields.User.fields.LogonName;
                                        Session.setPersistent('cloudCurrentLogonName', data.fields.User.fields.LogonName);
                                        emplineItemObj = {
                                            empID: data.fields.User.fields.EmployeeId || '',
                                            EmployeeName: data.fields.User.fields.EmployeeName || '',
                                            LogonName: data.fields.User.fields.LogonName || '',
                                            PasswordHash: data.fields.User.fields.LogonPassword || ''
                                        };
                                        emplineItems.push(emplineItemObj);
                                        templateObject.empuserrecord.set(emplineItems);
                                    } else {
                                        let emplineItems = [];
                                        let emplineItemObj = {};
                                        emplineItemObj = {
                                            empID: '',
                                            EmployeeName: data.fields.EmployeeName,
                                            LogonName: ''
                                        };
                                        emplineItems.push(emplineItemObj);
                                        templateObject.empuserrecord.set(emplineItems);
                                    }

                                } else {
                                    empEmail = data.fields.Email;
                                    if (data.fields.User != null) {
                                        let emplineItems = [];
                                        let emplineItemObj = {};
                                        Session.setPersistent('cloudCurrentLogonName', data.fields.User.fields.LogonName);
                                        emplineItemObj = {
                                            empID: data.fields.User.fields.EmployeeId || '',
                                            EmployeeName: data.fields.User.fields.EmployeeName || '',
                                            LogonName: data.fields.User.fields.LogonName || '',
                                            PasswordHash: data.fields.User.fields.LogonPassword || ''
                                        };
                                        emplineItems.push(emplineItemObj);
                                        templateObject.empuserrecord.set(emplineItems);
                                    } else {
                                        let emplineItems = [];
                                        let emplineItemObj = {};
                                        emplineItemObj = {
                                            empID: '',
                                            EmployeeName: data.fields.EmployeeName,
                                            LogonName: ''
                                        };
                                        emplineItems.push(emplineItemObj);
                                        templateObject.empuserrecord.set(emplineItems);
                                    }
                                }

                                let lineItemObj = {
                                    id: data.fields.ID,
                                    lid: 'Edit Employee',
                                    title: data.fields.Title || '',
                                    firstname: data.fields.FirstName || '',
                                    middlename: data.fields.MiddleName || '',
                                    lastname: data.fields.LastName || '',
                                    company: data.fields.EmployeeName || '',
                                    tfn: data.fields.TFN || '',
                                    priority: data.fields.CustFld5 || 0,
                                    color: data.fields.CustFld6 || "#00a3d3",
                                    email: empEmail || '',
                                    phone: data.fields.Phone || '',
                                    mobile: data.fields.Mobile || '',
                                    fax: data.fields.FaxNumber || '',
                                    skype: data.fields.SkypeName || '',
                                    gender: data.fields.Sex || '',
                                    dob: data.fields.DOB ? moment(data.fields.DOB).format('DD/MM/YYYY') : "",
                                    startdate: data.fields.DateStarted ? moment(data.fields.DateStarted).format('DD/MM/YYYY') : "",
                                    datefinished: data.fields.DateFinished ? moment(data.fields.DateFinished).format('DD/MM/YYYY') : "",
                                    position: data.fields.Position || '',
                                    streetaddress: data.fields.Street || '',
                                    city: data.fields.Street2 || '',
                                    state: data.fields.State || '',
                                    postalcode: data.fields.PostCode || '',
                                    country: data.fields.Country || LoggedCountry,
                                    custfield1: data.fields.CustFld1 || '',
                                    custfield2: data.fields.CustFld2 || '',
                                    custfield3: data.fields.CustFld3 || '',
                                    custfield4: data.fields.CustFld4 || '',
                                    custfield14: data.fields.CustFld14 || '',
                                    website: '',
                                    notes: data.fields.Notes || '',

                                };
                                templateObject.getEmployeeProfileImageData(data.fields.EmployeeName);

                                templateObject.records.set(lineItemObj);
                                if (currentId.addvs1user == "true") {
                                    setTimeout(function () {
                                        $('.employeeTab').trigger('click');
                                        $('.addvs1usertab').trigger('click');
                                        $('#cloudEmpEmailAddress').focus();
                                    }, 100);
                                }

                                if ((currentId.addvs1user == "true") && (currentId.id)) {
                                    // swal("Please ensure the employee has a email and password.", "", "info");
                                    if (useData[i].fields.User != null) {
                                        swal({
                                            title: 'User currently has an Existing Login.',
                                            text: '',
                                            type: 'info',
                                            showCancelButton: false,
                                            confirmButtonText: 'OK'
                                        }).then((result) => {
                                            if (result.value) {
                                                $('#cloudEmpEmailAddress').focus();
                                                $('.modal-backdrop').css('display', 'none');
                                            } else if (result.dismiss === 'cancel') {
                                                $('.modal-backdrop').css('display', 'none');
                                            }
                                        });
                                    } else {
                                        swal({
                                            title: 'Please ensure the employee has a email and password.',
                                            text: '',
                                            type: 'info',
                                            showCancelButton: false,
                                            confirmButtonText: 'OK'
                                        }).then((result) => {
                                            if (result.value) {
                                                $('#cloudEmpEmailAddress').focus();
                                                $('.modal-backdrop').css('display', 'none');
                                            } else if (result.dismiss === 'cancel') {
                                                $('.modal-backdrop').css('display', 'none');
                                            }
                                        });
                                    }
                                }
                                /* START attachment */
                                templateObject.attachmentCount.set(0);
                                if (data.fields.Attachments) {
                                    if (data.fields.Attachments.length) {
                                        templateObject.attachmentCount.set(data.fields.Attachments.length);
                                        templateObject.uploadedFiles.set(data.fields.Attachments);

                                    }
                                }
                                /* END  attachment */

                                //templateObject.getAllProductRecentTransactions(data.fields.EmployeeName);
                                // $('.fullScreenSpin').css('display','none');
                                setTimeout(function () {
                                    var rowCount = $('.results tbody tr').length;
                                    $('.counter').text(rowCount + ' items');
                                    $('#cloudEmpName').val(data.fields.EmployeeName);
                                    $("#dtStartingDate,#dtDOB,#dtTermninationDate,#dtAsOf").datepicker({
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
                                     $('.fullScreenSpin').css('display','none');
                                }, 500);
                            });
                        }
                    }
                }).catch(function (err) {
                    contactService.getOneEmployeeDataEx(employeeID).then(function (data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];
                        let empEmail = '';

                        if (data.fields.Email.replace(/\s/g, '') == '') {
                            if (data.fields.User != null) {
                                let emplineItems = [];
                                let emplineItemObj = {};
                                empEmail = data.fields.User.fields.LogonName;
                                Session.setPersistent('cloudCurrentLogonName', data.fields.User.fields.LogonName);
                                emplineItemObj = {
                                    empID: data.fields.User.fields.EmployeeId || '',
                                    EmployeeName: data.fields.User.fields.EmployeeName || '',
                                    LogonName: data.fields.User.fields.LogonName || '',
                                    PasswordHash: data.fields.User.fields.LogonPassword || ''
                                };
                                emplineItems.push(emplineItemObj);
                                templateObject.empuserrecord.set(emplineItems);
                            } else {
                                let emplineItems = [];
                                let emplineItemObj = {};
                                emplineItemObj = {
                                    empID: '',
                                    EmployeeName: data.fields.EmployeeName,
                                    LogonName: ''
                                };
                                emplineItems.push(emplineItemObj);
                                templateObject.empuserrecord.set(emplineItems);
                            }

                        } else {
                            empEmail = data.fields.Email;
                            if (data.fields.User != null) {
                                let emplineItems = [];
                                let emplineItemObj = {};
                                Session.setPersistent('cloudCurrentLogonName', data.fields.User.fields.LogonName);
                                emplineItemObj = {
                                    empID: data.fields.User.fields.EmployeeId || '',
                                    EmployeeName: data.fields.User.fields.EmployeeName || '',
                                    LogonName: data.fields.User.fields.LogonName || '',
                                    PasswordHash: data.fields.User.fields.LogonPassword || ''
                                };
                                emplineItems.push(emplineItemObj);
                                templateObject.empuserrecord.set(emplineItems);
                            } else {
                                let emplineItems = [];
                                let emplineItemObj = {};
                                emplineItemObj = {
                                    empID: '',
                                    EmployeeName: data.fields.EmployeeName,
                                    LogonName: ''
                                };
                                emplineItems.push(emplineItemObj);
                                templateObject.empuserrecord.set(emplineItems);
                            }
                        }

                        let lineItemObj = {
                            id: data.fields.ID,
                            lid: 'Edit Employee',
                            title: data.fields.Title || '',
                            firstname: data.fields.FirstName || '',
                            middlename: data.fields.MiddleName || '',
                            lastname: data.fields.LastName || '',
                            company: data.fields.EmployeeName || '',
                            tfn: data.fields.TFN || '',
                            priority: data.fields.CustFld5 || 0,
                            color: data.fields.CustFld6 || "#00a3d3",
                            email: empEmail || '',
                            phone: data.fields.Phone || '',
                            mobile: data.fields.Mobile || '',
                            fax: data.fields.FaxNumber || '',
                            skype: data.fields.SkypeName || '',
                            gender: data.fields.Sex || '',
                            dob: data.fields.DOB ? moment(data.fields.DOB).format('DD/MM/YYYY') : "",
                            startdate: data.fields.DateStarted ? moment(data.fields.DateStarted).format('DD/MM/YYYY') : "",
                            datefinished: data.fields.DateFinished ? moment(data.fields.DateFinished).format('DD/MM/YYYY') : "",
                            position: data.fields.Position || '',
                            streetaddress: data.fields.Street || '',
                            city: data.fields.Street2 || '',
                            state: data.fields.State || '',
                            postalcode: data.fields.PostCode || '',
                            country: data.fields.Country || LoggedCountry,
                            custfield1: data.fields.CustFld1 || '',
                            custfield2: data.fields.CustFld2 || '',
                            custfield3: data.fields.CustFld3 || '',
                            custfield4: data.fields.CustFld4 || '',
                            website: '',
                            notes: data.fields.Notes || '',

                        };
                        templateObject.getEmployeeProfileImageData(data.fields.EmployeeName);
                        setTimeout(function () {
                          if(data.fields.CustFld7 == "true"){
                            $("#productCostPayRate").prop("checked", true);
                          }else{
                            $("#productCostPayRate").prop("checked", false);
                          }

                          if(data.fields.CustFld8 == "true" || data.fields.CustFld8 == ""){
                            $("#addAllProducts").prop("checked", true);
                            $('.activeProductEmployee').css('display', 'none');
                          }else{
                            $("#addAllProducts").prop("checked", false);
                            $('.activeProductEmployee').css('display', 'block');
                          }
                        }, 500);
                        templateObject.records.set(lineItemObj);
                        if (currentId.addvs1user == "true") {
                            setTimeout(function () {
                                $('.employeeTab').trigger('click');
                                $('.addvs1usertab').trigger('click');
                                $('#cloudEmpEmailAddress').focus();
                            }, 100);
                        }

                        if ((currentId.addvs1user == "true") && (currentId.id)) {
                            // swal("Please ensure the employee has a email and password.", "", "info");
                            if (useData[i].fields.User != null) {
                                swal({
                                    title: 'User currently has an Existing Login.',
                                    text: '',
                                    type: 'info',
                                    showCancelButton: false,
                                    confirmButtonText: 'OK'
                                }).then((result) => {
                                    if (result.value) {
                                        $('#cloudEmpEmailAddress').focus();
                                        $('.modal-backdrop').css('display', 'none');
                                    } else if (result.dismiss === 'cancel') {
                                        $('.modal-backdrop').css('display', 'none');
                                    }
                                });
                            } else {
                                swal({
                                    title: 'Please ensure the employee has a email and password.',
                                    text: '',
                                    type: 'info',
                                    showCancelButton: false,
                                    confirmButtonText: 'OK'
                                }).then((result) => {
                                    if (result.value) {
                                        $('#cloudEmpEmailAddress').focus();
                                        $('.modal-backdrop').css('display', 'none');
                                    } else if (result.dismiss === 'cancel') {
                                        $('.modal-backdrop').css('display', 'none');
                                    }
                                });
                            }
                        }
                        /* START attachment */
                        templateObject.attachmentCount.set(0);
                        if (data.fields.Attachments) {
                            if (data.fields.Attachments.length) {
                                templateObject.attachmentCount.set(data.fields.Attachments.length);
                                templateObject.uploadedFiles.set(data.fields.Attachments);

                            }
                        }
                        /* END  attachment */

                        //templateObject.getAllProductRecentTransactions(data.fields.EmployeeName);
                        // $('.fullScreenSpin').css('display','none');
                        setTimeout(function () {
                            var rowCount = $('.results tbody tr').length;
                            $('.counter').text(rowCount + ' items');
                            $('#cloudEmpName').val(data.fields.EmployeeName);
                            $("#dtStartingDate,#dtDOB,#dtTermninationDate,#dtAsOf").datepicker({
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
                            $('.fullScreenSpin').css('display','none');
                        }, 500);
                    });
                });

            }

            templateObject.getEmployeeData();

        } else {
            $('.fullScreenSpin').css('display', 'none');
            var currentDate = new Date();
            var begunDate = moment(currentDate).format("DD/MM/YYYY");
            let lineItemObj = {
                id: '',
                lid: 'Add Employee',
                title: '',
                firstname: '',
                middlename: '',
                lastname: '',
                company: '',
                tfn: '',
                priority: 0,
                email: '',
                phone: '',
                mobile: '',
                fax: '',
                skype: '',
                gender: '',
                dob: begunDate || '',
                startdate: begunDate || '',
                datefinished: '',
                position: '',
                streetaddress: '',
                city: '',
                state: '',
                postalcode: '',
                country: LoggedCountry || '',
                custFld1: '',
                custFld2: '',
                website: ''
            }

            templateObject.records.set(lineItemObj);
            let emplineItems = [];
            let emplineItemObj = {};
            emplineItemObj = {
                empID: '',
                EmployeeName: '',
                LogonName: ''
            };
            emplineItems.push(emplineItemObj);
            templateObject.empuserrecord.set(emplineItems);

            if (currentId.addvs1user == "true") {
                // swal("Please fill in the employee details below.", "Please ensure the employee has a email and password.", "info");
                swal({
                    title: 'Please fill in the employee details below.',
                    text: 'Please ensure the employee has a email and password.',
                    type: 'info',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        $('#cloudEmpEmailAddress').focus();
                    } else if (result.dismiss === 'cancel') {}
                });
                setTimeout(function () {
                    $('.employeeTab').trigger('click');
                    $('.addvs1usertab').trigger('click');
                    $('#cloudEmpEmailAddress').focus();
                    // var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
                    // window.scrollTo(scrollBottom);
                }, 100);

                // if((currentId.addvs1user == "true") && (currentId.id === "undefined")){

                // }
            } else {
                setTimeout(function () {
                    $('#tblTransactionlist').DataTable();
                    $('.fullScreenSpin').css('display', 'none');
                    $('.employeeTab').trigger('click');
                }, 100);
            }

            setTimeout(function () {
                $('#cloudEmpName').val('');
                $("#dtStartingDate,#dtDOB,#dtTermninationDate,#dtAsOf").datepicker({
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
                $("#addAllProducts").prop("checked", false);
                $('.activeProductEmployee').css('display', 'block');

                $('.fullScreenSpin').css('display', 'none');
            }, 100);
        }
    }

    templateObject.getPreferedPaymentList = function () {
        getVS1Data('TPaymentMethod').then(function (dataObject) {
            if (dataObject.length == 0) {
                contactService.getPaymentMethodDataVS1().then((data) => {
                    for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                        preferedPayments.push(data.tpaymentmethodvs1[i].PaymentMethodName)
                    }
                    preferedPayments = _.sortBy(preferedPayments);

                    templateObject.preferedPaymentList.set(preferedPayments);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tpaymentmethodvs1;
                for (let i = 0; i < useData.length; i++) {
                    preferedPayments.push(useData[i].fields.PaymentMethodName)
                }
                preferedPayments = _.sortBy(preferedPayments);
                templateObject.preferedPaymentList.set(preferedPayments);
            }
        }).catch(function (err) {
            contactService.getPaymentMethodDataVS1().then((data) => {
                for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                    preferedPayments.push(data.tpaymentmethodvs1[i].PaymentMethodName)
                }
                preferedPayments = _.sortBy(preferedPayments);

                templateObject.preferedPaymentList.set(preferedPayments);
            });
        });
    };
    templateObject.getTermsList = function () {
        contactService.getTermDataVS1().then((data) => {
            for (let i = 0; i < data.ttermsvs1.length; i++) {
                terms.push(data.ttermsvs1[i].TermsName)
            }
            terms = _.sortBy(terms);
            templateObject.termsList.set(terms);
        });
    };

    templateObject.getDeliveryMethodList = function () {
        contactService.getShippingMethodData().then((data) => {
            for (let i = 0; i < data.tshippingmethod.length; i++) {
                deliveryMethods.push(data.tshippingmethod[i].ShippingMethod)
            }
            deliveryMethods = _.sortBy(deliveryMethods);
            templateObject.deliveryMethodList.set(deliveryMethods);
        });
    };

    templateObject.getTaxCodesList = function () {
        contactService.getTaxCodesVS1().then((data) => {
            for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                taxCodes.push(data.ttaxcodevs1[i].CodeName)
            }
            taxCodes = _.sortBy(taxCodes);
            templateObject.taxCodeList.set(taxCodes);
        });
    };

    templateObject.getEmployeesList = function () {
        getVS1Data('TEmployee').then(function (dataObject) {

            if (dataObject.length == 0) {
                contactService.getAllEmployeeSideData().then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    let totalUser = 0;

                    for (let i = 0; i < data.temployee.length; i++) {
                        let classname = '';
                        if (!isNaN(currentId.id)) {
                            if (useData[i].fields.ID == parseInt(currentId.id)) {
                                classname = 'currentSelect';
                            }
                        }
                        var dataList = {
                            id: data.temployee[i].fields.ID || '',
                            company: data.temployee[i].fields.EmployeeName || '',
                            classname: classname
                        };

                        if (data.temployee[i].fields.User != null) {
                            totalUser = i + 1;
                        }
                        if (data.temployee[i].fields.EmployeeName.replace(/\s/g, '') !== "") {
                            lineItems.push(dataList);
                        }
                    }

                    let cloudPackage = localStorage.getItem('vs1cloudlicenselevel');
                    if (cloudPackage === "Simple Start") {
                        templateObject.isUserAddition.set(true);
                    } else if ((cloudPackage === "Essentials") && (totalUser < 3)) {
                        templateObject.isUserAddition.set(false);
                    } else if ((cloudPackage === "PLUS") && (totalUser < 3)) {
                        templateObject.isUserAddition.set(false);
                    }

                    if(localStorage.getItem('EDatabase')){
                    if(localStorage.getItem('EDatabase') == 'rapp_australia_pty_ltd'){
                      templateObject.isUserAddition.set(false);
                    }
                    };

                    templateObject.countUserCreated.set(totalUser);
                    templateObject.employeerecords.set(lineItems);

                    if (templateObject.employeerecords.get()) {

                        setTimeout(function () {
                            $('.counter').text(lineItems.length + ' items');

                        }, 100);
                    }

                }).catch(function (err) {});
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.temployee;
                let lineItems = [];
                let lineItemObj = {};
                let totalUser = 0;

                for (let i = 0; i < useData.length; i++) {
                    let classname = '';
                    if (!isNaN(currentId.id)) {
                        if (useData[i].fields.ID == parseInt(currentId.id)) {
                            classname = 'currentSelect';
                        }
                    }
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        company: useData[i].fields.EmployeeName || '',
                        classname: classname
                    };

                    if (useData[i].fields.User != null) {
                        totalUser = i + 1;
                    }
                    if (useData[i].fields.EmployeeName.replace(/\s/g, '') !== "") {
                        lineItems.push(dataList);
                    }
                }

                let cloudPackage = localStorage.getItem('vs1cloudlicenselevel');
                if (cloudPackage === "Simple Start") {
                    templateObject.isUserAddition.set(true);
                } else if ((cloudPackage === "Essentials") && (totalUser < 3)) {
                    templateObject.isUserAddition.set(false);
                } else if ((cloudPackage === "PLUS") && (totalUser < 3)) {
                    templateObject.isUserAddition.set(false);
                }

                if(localStorage.getItem('EDatabase')){
                if(localStorage.getItem('EDatabase') == 'rapp_australia_pty_ltd'){
                  templateObject.isUserAddition.set(false);
                }
                };

                templateObject.countUserCreated.set(totalUser);
                templateObject.employeerecords.set(lineItems);

                if (templateObject.employeerecords.get()) {

                    setTimeout(function () {
                        $('.counter').text(lineItems.length + ' items');

                    }, 100);
                }

            }
        }).catch(function (err) {

            contactService.getAllEmployeeSideData().then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                let totalUser = 0;

                for (let i = 0; i < data.temployee.length; i++) {
                    let classname = '';
                    if (!isNaN(currentId.id)) {
                        if (data.temployee[i].fields.ID == parseInt(currentId.id)) {
                            classname = 'currentSelect';
                        }
                    }
                    var dataList = {
                        id: data.temployee[i].fields.ID || '',
                        company: data.temployee[i].fields.EmployeeName || '',
                        classname: classname
                    };

                    if (data.temployee[i].fields.User != null) {
                        totalUser = i + 1;
                    }
                    if (data.temployee[i].fields.EmployeeName.replace(/\s/g, '') !== "") {
                        lineItems.push(dataList);
                    }
                }

                let cloudPackage = localStorage.getItem('vs1cloudlicenselevel');
                if (cloudPackage === "Simple Start") {
                    templateObject.isUserAddition.set(true);
                } else if ((cloudPackage === "Essentials") && (totalUser < 3)) {
                    templateObject.isUserAddition.set(false);
                } else if ((cloudPackage === "PLUS") && (totalUser < 3)) {
                    templateObject.isUserAddition.set(false);
                }

                if(localStorage.getItem('EDatabase')){
                if(localStorage.getItem('EDatabase') == 'rapp_australia_pty_ltd'){
                  templateObject.isUserAddition.set(false);
                }
                };

                templateObject.countUserCreated.set(totalUser);
                templateObject.employeerecords.set(lineItems);

                if (templateObject.employeerecords.get()) {

                    setTimeout(function () {
                        $('.counter').text(lineItems.length + ' items');

                    }, 100);
                }

            }).catch(function (err) {});
        });

    }
    templateObject.getEmployeesList();


    $(document).ready(function () {
        setTimeout(function () {
            $('#product-list').editableSelect();


            $('#product-list').editableSelect()
            .on('click.editable-select', function(e, li) {
                var $earch = $(this);
                var offset = $earch.offset();
                var productDataName =  e.target.value || '';
                //var productDataID = el.context.value || '';
                // if(el){
                //   var productCostData = el.context.id || 0;
                //   $('#edtProductCost').val(productCostData);
                // }
                edtProductSelect = "appointment"
                if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
                    $('#productListModal').modal('toggle');
                    // setTimeout(function () {
                    //     $('#tblInventoryPayrollService_filter .form-control-sm').focus();
                    //     $('#tblInventoryPayrollService_filter .form-control-sm').val('');
                    //     $('#tblInventoryPayrollService_filter .form-control-sm').trigger("input");

                    //     var datatable = $('#tblInventoryPayrollService').DataTable();
                    //     datatable.draw();
                    //     $('#tblInventoryPayrollService_filter .form-control-sm').trigger("input");

                    // }, 500);
                } else {
                    // var productDataID = $(event.target).attr('prodid').replace(/\s/g, '') || '';
                    if (productDataName.replace(/\s/g, '') != '') {
                        //FlowRouter.go('/productview?prodname=' + $(event.target).text());
                        let lineExtaSellItems = [];
                        let lineExtaSellObj = {};
                        $('.fullScreenSpin').css('display', 'inline-block');
                        getVS1Data('TProductWeb').then(function (dataObject) {
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

                        setTimeout(function () {
                            $('#tblInventoryPayrollService_filter .form-control-sm').focus();
                            $('#tblInventoryPayrollService_filter .form-control-sm').val('');
                            $('#tblInventoryPayrollService_filter .form-control-sm').trigger("input");

                            var datatable = $('#tblInventoryPayrollService').DataTable();
                            datatable.draw();
                            $('#tblInventoryPayrollService_filter .form-control-sm').trigger("input");

                        }, 500);
                    }

                }
            });
        },1000)

        //On Click Client Type List
        $(document).on("click", "#tblInventoryService tbody tr", function (e) {
            var table = $(this);
            if(edtProductSelect == "appointment") {
                let productName = table.find(".productName").text()||'';
                let productID = table.find(".colProuctPOPID").text()||'';
                $('#product-list').val(productName);
                $('#product-listID').val(productID);
                $('#productListModal').modal('toggle');
            }

        });
    });
    var prefObject = "";
    if (currentId.id != undefined) {
        setTimeout(function () {
            appointmentService.getEmployeeCalendarSettings(currentId.id).then(function (data) {
                if (data.tappointmentpreferences.length > 0) {
                    prefObject = {
                        id: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].Id || '',
                        defaultProduct: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].DefaultServiceProduct || '',
                        defaultProductID: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].DefaultServiceProductID || '',
                        showSat: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ShowSaturdayinApptCalendar || false,
                        showSun: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].ShowSundayinApptCalendar || false,
                        defaultApptDuration: data.tappointmentpreferences[data.tappointmentpreferences.length - 1].DefaultApptDuration || '',
                    }

                    $("#showSaturday").prop('checked', prefObject.showSat);
                    $("#showSunday").prop('checked', prefObject.showSun);

                    if (prefObject.defaultProduct) {
                        //$('#product-list').prepend('<option selected value=' + prefObject.id + '>' + prefObject.defaultProduct + '</option>');
                          $('#product-list').val(prefObject.defaultProduct);
                          $('#product-listID').val(prefObject.id);
                    }

                    if (prefObject.defaultApptDuration) {
                        if (prefObject.defaultApptDuration == "120") {
                            $('#defaultTime').prepend('<option selected>' + 2 + ' Hour</option>');
                        } else {
                            $('#defaultTime').prepend('<option selected>' + prefObject.defaultApptDuration + ' Hour</option>');
                        }

                    }
                }

                templateObject.calendarOptions.set(prefObject);
            }).catch(function (err) {});
        }, 1000);
    }

    templateObject.getLeaveRequests = async () => {
        let TLeaveRequests = await getVS1Data('TLeaveRequest');
        if( TLeaveRequests.length ){
            let TLeaveRequestsData = JSON.parse(TLeaveRequests[0].data);
            let useData = LeaveRequest.fromList(
                TLeaveRequestsData.tleaverequest
            ).filter((item) => {
                if ( parseInt( item.fields.EmployeeID ) == parseInt( employeeID ) ) {
                    return item;
                }
            });
            templateObject.leaveRequestInfos.set(useData);
        }

    };
    templateObject.getLeaveRequests();

    templateObject.getAssignLeaveTypes = async () => {
        let TAssignLeaveTypes = await getVS1Data('TAssignLeaveType');
        if( TAssignLeaveTypes.length ){
            let TAssignLeaveTypesData = JSON.parse(TAssignLeaveTypes[0].data);
            let useData = AssignLeaveType.fromList(
                TAssignLeaveTypesData.tassignteavetype
            ).filter((item) => {
                if ( parseInt( item.fields.EmployeeID ) == parseInt( employeeID ) ) {
                    return item;
                }
            });
            templateObject.assignLeaveTypeInfos.set(useData);
        }

    };
    templateObject.getAssignLeaveTypes();

    templateObject.getEmployeePaySettings = async () => {
        try {
            // EmployeePayrollApi fetch data from indexDB
            let TEmployeepaysettings = await getVS1Data('TEmployeepaysettings');
            if( TEmployeepaysettings.length ){
                let TEmployeepaysettingData = JSON.parse(TEmployeepaysettings[0].data);
                let useData = EmployeePaySettings.fromList(
                    TEmployeepaysettingData.temployeepaysettings
                ).filter((item) => {
                    if (item.fields.Employeeid == employeeID) {
                        return item;
                    }
                });

                let employeePaySettings = useData[0]


                let objEmployeePaySettings = {
                    EmployeeName: employeePaySettings.fields.Employee.fields.EmployeeName,
                    AnnSalary: employeePaySettings.fields.Employee.fields.Wages * 12,
                    TFN: employeePaySettings.fields.Employee.fields.TFN,
                    Country: employeePaySettings.fields.Employee.fields.Country,
                    TaxFreeThreshold: employeePaySettings.fields.Employee.fields.TaxFreeThreshold ? employeePaySettings.fields.Employee.fields.TaxFreeThreshold : false,

                    TFNExemption: employeePaySettings.fields.Employee.fields.TFNExemption ? employeePaySettings.fields.Employee.fields.TFNExemption : "",
                    EmploymentBasis: employeePaySettings.fields.Employee.fields.EmploymentBasis ? employeePaySettings.fields.Employee.fields.EmploymentBasis : "",
                    ResidencyStatus: employeePaySettings.fields.Employee.fields.ResidencyStatus ? employeePaySettings.fields.Employee.fields.ResidencyStatus : "",
                    StudyTrainingSupportLoan: employeePaySettings.fields.Employee.fields.StudyTrainingSupportLoan ? employeePaySettings.fields.Employee.fields.StudyTrainingSupportLoan : false,
                    EligibleToReceiveLeaveLoading: employeePaySettings.fields.Employee.fields.EligibleToReceiveLeaveLoading ? employeePaySettings.fields.Employee.fields.EligibleToReceiveLeaveLoading : false,
                    OtherTaxOffsetClaimed: employeePaySettings.fields.Employee.fields.OtherTaxOffsetClaimed ? employeePaySettings.fields.Employee.fields.OtherTaxOffsetClaimed : false,
                    UpwardvariationRequested: employeePaySettings.fields.Employee.fields.UpwardvariationRequested ? employeePaySettings.fields.Employee.fields.UpwardvariationRequested : false,
                    SeniorandPensionersTaxOffsetClaimed: employeePaySettings.fields.Employee.fields.SeniorandPensionersTaxOffsetClaimed ? employeePaySettings.fields.Employee.fields.SeniorandPensionersTaxOffsetClaimed : false,
                    HasApprovedWithholdingVariation: employeePaySettings.fields.Employee.fields.HasApprovedWithholdingVariation ? employeePaySettings.fields.Employee.fields.HasApprovedWithholdingVariation : false,
                }

                templateObject.employeePaySettings.set(objEmployeePaySettings);

                templateObject.employeePayInfos.set(employeePaySettings);

                $(`#edtTfnExemption option[value='${objEmployeePaySettings.TFNExemption}']`).attr('selected', 'selected');
                $(`#edtEmploymentBasis option[value='${objEmployeePaySettings.EmploymentBasis}']`).attr('selected', 'selected');
                $(`#edtResidencyStatus option[value='${objEmployeePaySettings.ResidencyStatus}']`).attr('selected', 'selected');
            }
        } catch(err) {
            let employeePayrollService = new EmployeePayrollService();
            let data = await employeePayrollService.getAllEmployeePaySettings('All',0)
            for (let i = 0; i < data.temployeepaysettings.length; i++) {
                if (parseInt(data.temployeepaysettings[i].fields.Employeeid) === parseInt(employeeID)) {

                    $('.fullScreenSpin').css('display', 'none');
                    let lineItems = [];

                    let payInfo = {
                        ID: data.temployeepaysettings[i].fields.ID,
                        EmployeeID: data.temployeepaysettings[i].fields.Employeeid,
                        EmployeeName: data.temployeepaysettings[i].fields.Employee.fields.EmployeeName,
                        AnnSalary: data.temployeepaysettings[i].fields.Employee.fields.Wages * 12,
                        TFN: data.temployeepaysettings[i].fields.Employee.fields.TFN,
                        Country: data.temployeepaysettings[i].fields.Employee.fields.Country,
                        TaxFreeThreshold: data.temployeepaysettings[i].fields.Employee.fields.TaxFreeThreshold,
                    };
                    templateObject.employeePayInfos.set(payInfo);
                }
            }
        }
    }
    templateObject.getEmployeePaySettings();

    templateObject.getTLeaveTypes = async () => {
        try{
            let dataObj = await getVS1Data('TLeavetypes');
        } catch(err) {

            let employeePayrollService = new EmployeePayrollService();
            let data = await employeePayrollService.getAllTLeaveTypes('All', 0)

            await templateObject.leaveTypesDrpDown.set(data.tleavetypes);
        }
    }

    templateObject.getTLeaveTypes();

    templateObject.getTBankAccounts = function() {
        let employeePayrollService = new EmployeePayrollService();
        getVS1Data('TBankAccounts').then(function(dataObj) {
            let newData = {
                primary: null,
                first: null,
                second: null,
                third: null
            };
            if(dataObj.length > 0) {
                let data = JSON.parse(dataObj[0].data);
                let index = 1;
                for(let i = 0; i < data.length; i ++) {
                    if( parseInt( data[i].fields.EmployeeID ) == parseInt( employeeID ) ) {
                        if(data[i].fields.IsPrimary == false) {
                            // let newItem = {...data[i].fields};
                            // newItem.order = index;
                            // data[i].fields.order = index;
                            if(index == 1) newData.first = data[i].fields;
                            else if(index == 2) newData.second = data[i].fields;
                            else if(index == 3) newData.third = data[i].fields;
                            index ++;
                        }else {
                            newData.primary = data[i].fields;
                        }
                    }
                }
            }
            templateObject.bankAccList.set(newData);

        }).catch(function (err) {
            employeePayrollService.getAllTBankAccounts('All', 0).then(function(data) {

            }).catch(function(err){});
        });
    }
    templateObject.getTBankAccounts();

});
Template.employeescard.events({
    'click #customerShipping-1': function (event) {
        if ($(event.target).is(':checked')) {
            $('.customerShipping-2').css('display', 'none');

        } else {
            $('.customerShipping-2').css('display', 'block');
        }
    },
    'click .tabproductsservices': function (event) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      let currentId = FlowRouter.current().queryParams;
      let tempCurrenctTRePService = templateObject.allrepservicedata.get() || '';
      if(FlowRouter.current().queryParams.id){
        if(tempCurrenctTRePService.length > 0){
          $('.fullScreenSpin').css('display', 'none');
        }else{
          templateObject.getAllSelectedProducts(FlowRouter.current().queryParams.id);
        }

      }else{
          $('.fullScreenSpin').css('display', 'none');
      }
    },
    'click .colServiceDelete': function (event) {
        let templateObject = Template.instance();
        var targetID = $(event.target).closest('tr').find('.colID').text() || ''; // table row ID
        let contactService = new ContactService();
        var tblRepService = $('#tblEmpServiceList').DataTable();
        tblRepService.$('tr.selected').removeClass('selected');
        $(event.target).closest('tr').addClass('selected');
        // if ( $(event.target).closest('tr').hasClass('selected') ) {
        //     $(event.target).closest('tr').removeClass('selected');
        // }else {
        //     //tblRepService.$('tr.selected').removeClass('selected');
        //     $(event.target).closest('tr').addClass('selected');
        // }

        //$('#selectDeleteServiceID').val(targetID);
        //$('#deleteServiceModal').modal('toggle');

        swal({
            title: 'Delete Active Product',
            text: "Are you sure you want to Delete this Employee Active Product?",
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
              //$('.fullScreenSpin').css('display', 'inline-block');

              if($.isNumeric(targetID)){
                var objDetails = {
                    type: "TRepServices",
                    fields: {
                        ID: parseInt(targetID)||0,
                        Active: false
                    }
                };
                contactService.saveEmployeeProducts(objDetails).then(function (data) {});
              }else{

              }

              //$(event.target).closest('tr').remove();
              tblRepService.row('.selected').remove().draw( false );
            } else {
              tblRepService.$('tr.selected').removeClass('selected');
              $('.fullScreenSpin').css('display', 'none');
            }
        });
    },
    'click .btnRefreshProductService': function (event) {
      $('.fullScreenSpin').css('display', 'inline-block');
      let templateObject = Template.instance();
      let currentId = FlowRouter.current().queryParams;
      if(FlowRouter.current().queryParams.id){
        templateObject.getAllSelectedProducts(FlowRouter.current().queryParams.id);
        window.open('/employeescard?id=' + currentId.id +'&transTab=prod', '_self');
      }else{
          $('.fullScreenSpin').css('display', 'none');
      }

        // let templateObject = Template.instance();
        // var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        // $('#selectDeleteServiceID').val(targetID);
        // $('#deleteServiceModal').modal('toggle');
    },
    'click .btnDeleteProductService': function (event) {
        let selectLineID = $('#selectDeleteServiceID').val()||'';
        let contactService = new ContactService();
        if($.isNumeric(selectLineID)){
          var objDetails = {
              type: "TRepServices",
              fields: {
                  ID: parseInt(selectLineID)||0,
                  Active: false
              }
          };
          contactService.saveEmployeeProducts(objDetails).then(function (data) {});
        }else{

        }

        $('#' + selectLineID).closest('tr').remove();
        $('#deleteServiceModal').modal('toggle');
    },
    'click .chkServiceCardTest': function () {
        const templateObject = Template.instance();
        let selectedproduct = [];
        // const selectedAwaitingPayment2 = [];
        $('.chkServiceCard:checkbox:checked').each(function () {
            let productName = $(this).closest('tr').find('.productName').text();
            // let paymentTransObj = {
            //         type: "TRepServices",
            //         fields: {
            //             EmployeeName: Session.get('mySessionEmployee') || '',
            //             ServiceDesc: productName
            //         }
            //
            // };
            selectedproduct.push(productName);
        });

       templateObject.selectedemployeeproducts.set(selectedproduct);

    },
    'click .chkBoxAll': function () {
        if ($(event.target).is(':checked')) {
            $(".chkBox").prop("checked", true);
            $("#addAllProducts").prop("checked", true);
            $('.activeProductEmployee').css('display', 'none');
        } else {
            $(".chkBox").prop("checked", false);
            $("#addAllProducts").prop("checked", false);
            $('.activeProductEmployee').css('display', 'block');
        }
    },
    'click .btnSelectProducts': async function (event) {
        let templateObject = Template.instance();
        let trepserviceObjects = templateObject.selectedemployeeproducts.get();
        let getselectedproducts = templateObject.selectedproducts.get();
        let productService = new ProductService();
        var splashArrayRepServiceListGet = new Array();

        let tempCurrenctTRePService = templateObject.allrepservicedata.get() || '';
        //var splashArrayRepServiceList = new Array();
        //var splashArrayRepServiceList = new Array();
        let tokenid = Random.id();
        var tblInventoryService = $(".tblInventoryService").dataTable();
        var dataserviceList = {};
        let productservicelist = [];
        $(".chkServiceCard:checked", tblInventoryService.fnGetNodes()).each(function() {
          let productServiceID = $(this).closest('tr').find('.colProuctPOPID').text()||'';
          let productServiceName = $(this).closest('tr').find('.productName').text()||'';
          let productServiceDesc = $(this).closest('tr').find('.productDesc').text()||'';
          let productServicerate = $(this).closest('tr').find('.costPrice').text()||'';
          let productServicecost = $(this).closest('tr').find('.salePrice').text()||'';

          let objServiceDetails = {
              type:"TServices",
              fields:
              {
                  ProductId:parseInt(productServiceID),
                  ServiceDesc:productServiceName,
                  StandardRate:parseFloat(productServicerate.replace(/[^0-9.-]+/g,"")) || 0,
              }
          };
          productService.saveProductService(objServiceDetails).then(function (objServiceDetails) { });

          dataserviceList = {
              id: tokenid||'',
              employee: Session.get('mySessionEmployee') || '',
              productname: productServiceName || '',
              productdesc: productServiceDesc || '',
              rate: productServicerate || 0,
              payrate:productServicecost || 0
          };

          var dataListService = [
                    productServiceName || '',
                    productServiceDesc || '',
                    '<input class="colServiceCostPrice highlightInput" type="text" value="'+productServicerate+'">' || '',
                    '<input class="colServiceSalesPrice highlightInput" type="text" value="'+productServicecost+'">' || '',
                    tokenid || '',
                    '<span class="table-remove colServiceDelete"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>' || ''
                    // JSON.stringify(data.tproductvs1[i].fields.ExtraSellPrice)||null
                ];

          let checkServiceArray = getselectedproducts.filter(function(prodData){ return prodData.productname === productServiceName })||'';

          if (checkServiceArray.length > 0) {
          }else{
            splashArrayRepServiceListGet.push(dataListService);

            getselectedproducts.push(dataserviceList);
          }


      });

      templateObject.selectedproducts.set(getselectedproducts);
      var thirdaryData = $.merge($.merge([], tempCurrenctTRePService), splashArrayRepServiceListGet);
      if(thirdaryData){
        templateObject.allrepservicedata.set(thirdaryData);
      let uniqueChars = [...new Set(thirdaryData)];
      var datatable = $('#tblEmpServiceList').DataTable();
      datatable.clear();
      datatable.rows.add(uniqueChars);
      datatable.draw(false);
      }

      //$('#tblEmpServiceList_info').html('Showing 1 to '+getselectedproducts.length+ ' of ' +getselectedproducts.length+ ' entries');
      $('#productListModal').modal('toggle');
    },
    'click .btnSave': async function (event) {
        let templateObject = Template.instance();
        let contactService = new ContactService();
        let appointmentService = new AppointmentService();
        $('.fullScreenSpin').css('display', 'inline-block');
        let title = $('#edtTitle').val();
        let firstname = $('#edtFirstName').val();
        if (firstname === '') {
            $('.fullScreenSpin').css('display', 'none');
            // Bert.alert('<strong>WARNING:</strong> First Name cannot be blank!', 'warning');
            swal('First Name cannot be blank!', '', 'info');
            e.preventDefault();
            $('#edtFirstName').focus();
        }
        let middlename = $('#edtMiddleName').val() || '';
        let lastname = $('#edtLastName').val() || '';
        let suffix = $('#edtSuffix').val() || '';
        let email = $('#edtEmailAddress').val() || '';
        let phone = $('#edtPhone').val() || '';
        let mobile = $('#edtMobile').val() || '';
        let fax = $('#edtFax').val() || '';
        let skype = $('#edtSkype').val() || '';
        let gender = $('#edtGender').val() || '';
        let employeeName = $('#edtCustomerCompany').val() || '';

        var dateofbirthTime = new Date($("#dtDOB").datepicker("getDate"));
        var startdateTime = new Date($("#dtStartingDate").datepicker("getDate"));

        let dateofbirth = dateofbirthTime.getFullYear() + "-" + (dateofbirthTime.getMonth() + 1) + "-" + dateofbirthTime.getDate();
        let startdate = startdateTime.getFullYear() + "-" + (startdateTime.getMonth() + 1) + "-" + startdateTime.getDate();

        let employeeID = $('#edtEmployeeID').val();
        let position = $('#edtPosition').val();
        let webiste = $('#edtWebsite').val();

        let streetaddress = $('#edtStreetAddress').val();
        let city = $('#edtCity').val();
        let state = $('#edtState').val();
        let postalcode = $('#edtPostalCode').val();
        let country = $('#edtCountry').val();

        let custField1 = $('#edtCustomeField1').val();
        let custField2 = $('#edtCustomeField2').val();
        let custField3 = $('#edtCustomeField3').val();
        let custField4 = $('#edtCustomeField4').val();

        let priorityData = $('#edtPriority').val() || '';

        let uploadedItems = templateObject.uploadedFiles.get();

        let notes = $('#txaNotes').val();
        var url = FlowRouter.current().path;
        var getemp_id = url.split('?id=');
        //var currentEmployee = getemp_id[getemp_id.length-1];
        var currentEmployee = 0;
        let overrideGlobalCalendarSet = "false";
        let useProductCostaspayRate = "false";
        let includeAllProducts = "false";

        if ($('#overridesettings').is(':checked')) {
            overrideGlobalCalendarSet = "true";
        }

        if ($('#productCostPayRate').is(':checked')) {
            useProductCostaspayRate = "true";
        }

        if ($('#addAllProducts').is(':checked')) {
            includeAllProducts = "true";
        }

        let currentId = FlowRouter.current().queryParams;

        if ((priorityData.replace(/\s/g, '') != '') && (priorityData.replace(/\s/g, '') != 0)) {
            let checkEmpPriorityData = await contactService.getCheckCustomersPriority(priorityData);
            if (checkEmpPriorityData.temployee.length) {
                if (checkEmpPriorityData.temployee[0].Id === parseInt(currentId.id)) {}
                else {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Sort Order already in use',
                        text: 'Please enter another.',
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then((result) => {});
                    return false;
                }
            }
        };
        var objDetails = '';

        let imageData = '';
        if (templateObject.imageFileData.get()) {
            imageData = templateObject.imageFileData.get().split(',')[1] || '';
        }

        if (!isNaN(currentId.id)) {

            currentEmployee = parseInt(currentId.id);
            objDetails = {
                type: "TEmployeeEx",
                fields: {
                    ID: currentEmployee,
                    Title: title,
                    FirstName: firstname,
                    MiddleName: middlename,
                    LastName: lastname,
                    TFN: suffix,
                    FaxNumber: fax,
                    Email: email,
                    Phone: phone,
                    Mobile: mobile,
                    SkypeName: skype,
                    Sex: gender,
                    DOB: dateofbirth||'',
                    DateStarted: startdate||'',
                    Position: position,
                    Street: streetaddress,
                    Street2: city,
                    State: state,
                    PostCode: postalcode,
                    Country: country,
                    Notes: notes,
                    Attachments: uploadedItems,
                    CustFld1: custField1,
                    CustFld2: custField2,
                    CustFld3: custField3,
                    CustFld4: custField4,
                    CustFld5: $('#edtPriority').val(),
                    CustFld6: $('#favcolor').val(),
                    CustFld14: overrideGlobalCalendarSet,
                    CustFld7: useProductCostaspayRate,
                    CustFld8: includeAllProducts
                }
            };
        } else {
            objDetails = {
                type: "TEmployeeEx",
                fields: {
                    Title: title,
                    FirstName: firstname,
                    MiddleName: middlename,
                    LastName: lastname,
                    TFN: suffix,
                    FaxNumber: fax,
                    Email: email,
                    Phone: phone,
                    Mobile: mobile,
                    SkypeName: skype,
                    Sex: gender,
                    DOB: dateofbirth||'',
                    DateStarted: startdate||'',
                    Position: position,
                    Street: streetaddress,
                    Street2: city,
                    State: state,
                    PostCode: postalcode,
                    Country: country,
                    Notes: notes,
                    Attachments: uploadedItems,
                    CustFld1: custField1,
                    CustFld2: custField2,
                    CustFld3: custField3,
                    CustFld4: custField4,
                    CustFld5: $('#edtPriority').val(),
                    CustFld6: $('#favcolor').val(),
                    CustFld14: overrideGlobalCalendarSet,
                    CustFld7: useProductCostaspayRate,
                    CustFld8: includeAllProducts

                }
            };
        }
        contactService.saveEmployeeEx(objDetails).then(function (objDetails) {
            let employeeSaveID = objDetails.fields.ID;
            sideBarService.getAllEmployees(initialBaseDataLoad,0).then(function (dataReload) {
                  addVS1Data('TEmployee',JSON.stringify(dataReload));
            }).catch(function (err) {});

            $('#selectEmployeeID').val(employeeSaveID);
            // var erpUserID = $("#erpEmpID").val();
            let employeePicObj = "";
            if ($('.cloudEmpImgID').val() == "") {
                employeePicObj = {
                    type: "TEmployeePicture",
                    fields: {
                        EmployeeName: employeeName,
                        EncodedPic: imageData
                    }
                }
            } else {
                employeePicObj = {
                    type: "TEmployeePicture",
                    fields: {
                        ID: parseInt($('.cloudEmpImgID').val()),
                        EmployeeName: employeeName,
                        EncodedPic: imageData
                    }
                }
            }

            contactService.saveEmployeePicture(employeePicObj).then(function (employeePicObj) {});

            var tblSelectedInventoryService = $(".tblEmpServiceList").dataTable();
            if(includeAllProducts == "true"){

            }else{
            $(".colServiceName",tblSelectedInventoryService).each(function () {
                var lineID =$(this).closest('tr').find('.colID').text()||''; // table row ID
                let tdproduct = $(this).text() ||'';
                //$('#' + lineID + " .colServiceName").text()||'';
                let tddescription = $(this).closest('tr').find('.colServiceDescription').text()||'';
                //$('#' + lineID + " .colServiceDescription").text()||'';
                let tdCostPrice = $(this).closest('tr').find('.colServiceCostPrice').val()||Currency +0;
                //$('#' + lineID + " .colServiceCostPrice").val() || 0;

                let tdSalePrice = $(this).closest('tr').find('.colServiceSalesPrice').val()||Currency +0;
                //$('#' + lineID + " .colServiceSalesPrice").val()|| 0;
                //$('#' + lineID + " .colServiceSalesPrice").val()|| 0;
                let paymentTransObj = '';
                if(tdproduct!= '' && tdproduct!= 'Name'){
                  if($.isNumeric(lineID)){
                    paymentTransObj = {
                           type: "TRepServices",
                           fields: {
                               ID: parseInt(lineID) || 0,
                               EmployeeName: employeeName || '',
                               Rate:Number(tdCostPrice.replace(/[^0-9.-]+/g, ""))||0,
                               PayRate:Number(tdSalePrice.replace(/[^0-9.-]+/g, ""))||0,
                               ServiceDesc: tdproduct || ''
                           }

                   };
                  }else{
                 paymentTransObj = {
                        type: "TRepServices",
                        fields: {
                            EmployeeName: employeeName || '',
                            Rate:Number(tdCostPrice.replace(/[^0-9.-]+/g, ""))||0,
                            PayRate:Number(tdSalePrice.replace(/[^0-9.-]+/g, ""))||0,
                            ServiceDesc: tdproduct || ''
                        }

                };
              }


                contactService.saveEmployeeProducts(paymentTransObj).then(function (paymentTransObj) {});
                }
            });
            }

            let showSat = false;
            let showSun = false;
            let overrideGlobalCalendarSet = "false";
            if ($('#showSaturday').is(':checked')) {
                showSat = true;
            }

            if ($('#showSunday').is(':checked')) {
                showSun = true;
            }

            if ($('#overridesettings').is(':checked')) {
                overrideGlobalCalendarSet = overrideGlobalCalendarSet;
            }

            let settingID = '';
            let calOptions = templateObject.calendarOptions.get();
            if (calOptions) {
                settingID = calOptions.id;
            }

            let defaultTime = parseInt($('#defaultTime').val().split(' ')[0]) || 2;
            let defaultProduct = $('#product-list').val() || '';
            let defaultProductID = $('#product-listID').val() || 0;

            let objectData = "";
            if (settingID == "") {
                objectData = {
                    type: "TAppointmentPreferences",
                    fields: {
                        EmployeeID: employeeSaveID,
                        DefaultApptDuration: defaultTime,
                        DefaultServiceProductID: defaultProductID,
                        DefaultServiceProduct: defaultProduct,
                        ShowSaturdayinApptCalendar: showSat,
                        ShowSundayinApptCalendar: showSun
                    }
                };
            } else {
                objectData = {
                    type: "TAppointmentPreferences",
                    fields: {
                        ID: settingID,
                        EmployeeID: employeeSaveID,
                        DefaultApptDuration: defaultTime,
                        DefaultServiceProductID: defaultProductID,
                        DefaultServiceProduct: defaultProduct,
                        ShowSaturdayinApptCalendar: showSat,
                        ShowSundayinApptCalendar: showSun
                    }
                };
            }
            appointmentService.saveAppointmentPreferences(objectData).then(function (data) {
                var cloudDBID = Session.get('mycloudLogonDBID');
                // var logonName = $("#cloudEmpLogonName").val();
                var enteredEmail = $("#cloudEmpEmailAddress").val();
                var checkifupdate = $("#cloudCheckEmpEmailAddress").val();
                var enteredPassword = $("#cloudEmpUserPassword").val();
                let cloudpassword = $("#cloudEmpUserPassword").val().replace(/;/g, ",");
                let cloudcheckpassword = $("#cloudCheckEmpUserPassword").val();
                if (($.trim(enteredEmail).length != 0) && ($.trim(enteredPassword).length != 0)) {
                    if (cloudpassword.toUpperCase() != cloudcheckpassword.toUpperCase()) {
                        var cloudHashPassword = CryptoJS.MD5(enteredPassword).toString().toUpperCase();
                        if ($.trim(checkifupdate).length != 0) {

                            if (cloudpassword.length < 8) {

                                    swal('Invalid VS1 Password', 'Password must be at least eight characters including one capital letter and one number!', 'error');
                                    $('#cloudEmpUserPassword').css('border-color', 'red');
                                    $('#cloudEmpUserPassword').focus();

                                $('.fullScreenSpin').css('display', 'none');
                                return false;
                            } else {
                                var erpGet = erpDb();

                                let objDetailsUserPassword = {
                                    //JsonIn:{
                                    Name: "VS1_ChangePassword",
                                    Params: {
                                        // FirstName: firstname,
                                        // LastName: lastname,
                                        // EmployeeName: $('#edtCustomerCompany').val(),
                                        ERPLoginDetails: {
                                            erpusername: $('#cloudCheckEmpEmailAddress').val(),
                                            // VS1Password: $('#cloudCheckEmpUserPassword').val(),
                                            NewPassword: cloudpassword
                                        }
                                    }
                                    //}
                                };
                                if (cloudpassword.toUpperCase() != cloudcheckpassword.toUpperCase()) {

                                    var oPost = new XMLHttpRequest();
                                    oPost.open("POST", URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_ChangePassword"', true);
                                    oPost.setRequestHeader("database", vs1loggedDatatbase);
                                    oPost.setRequestHeader("username", 'VS1_Cloud_Admin');
                                    oPost.setRequestHeader("password", 'DptfGw83mFl1j&9');
                                    oPost.setRequestHeader("Accept", "application/json");
                                    oPost.setRequestHeader("Accept", "application/html");
                                    oPost.setRequestHeader("Content-type", "application/json");

                                    //var myString = '"JsonIn"' + ':' + JSON.stringify(objDetailsUser);
                                    var myStringUserPassword = '"JsonIn"' + ':' + JSON.stringify(objDetailsUserPassword);
                                    //
                                    oPost.send(myStringUserPassword);

                                    oPost.onreadystatechange = function () {
                                        if (oPost.readyState == 4 && oPost.status == 200) {
                                            var myArrResponsData = JSON.parse(oPost.responseText);

                                            if (myArrResponsData.ProcessLog.ResponseNo == 401) {
                                                swal({
                                                    title: 'VS1 Change User Password Failed',
                                                    text: myArrResponsData.ProcessLog.ResponseStatus,
                                                    type: 'error',
                                                    showCancelButton: false,
                                                    confirmButtonText: 'OK'
                                                }).then((result) => {
                                                    if (result.value) {
                                                        FlowRouter.go('/employeelist?success=true');
                                                    } else {
                                                        FlowRouter.go('/employeelist?success=true');
                                                    }
                                                });
                                            } else {
                                                if (employeeSaveID) {
                                                    sideBarService.getAllEmployees(initialBaseDataLoad,0).then(function (dataReload) {
                                                        addVS1Data('TEmployee', JSON.stringify(dataReload)).then(function (datareturn) {}).catch(function (err) {});
                                                    }).catch(function (err) {});

                                                    getVS1Data('vscloudlogininfo').then(function (dataObject) {
                                                        if (dataObject.length == 0) {
                                                            swal({
                                                                title: 'Password successfully changed',
                                                                text: '',
                                                                type: 'success',
                                                                showCancelButton: false,
                                                                confirmButtonText: 'OK'
                                                            }).then((result) => {
                                                                if (result.value) {
                                                                    FlowRouter.go('/employeelist?success=true');
                                                                } else {
                                                                    FlowRouter.go('/employeelist?success=true');
                                                                }
                                                            });
                                                        } else {
                                                            let loginDataArray = [];
                                                            if (dataObject[0].EmployeeEmail === $('#cloudCheckEmpEmailAddress').val()) {
                                                                loginDataArray = dataObject[0].data;
                                                                loginDataArray.ProcessLog.VS1AdminPassword = cloudpassword;
                                                                addLoginData(loginDataArray).then(function (datareturnCheck) {
                                                                    swal({
                                                                        title: 'Password successfully changed',
                                                                        text: '',
                                                                        type: 'success',
                                                                        showCancelButton: false,
                                                                        confirmButtonText: 'OK'
                                                                    }).then((result) => {
                                                                        if (result.value) {
                                                                            window.open('/', '_self');
                                                                        } else {
                                                                            window.open('/', '_self');
                                                                        }
                                                                    });

                                                                }).catch(function (err) {
                                                                    swal({
                                                                        title: 'Password successfully changed',
                                                                        text: '',
                                                                        type: 'success',
                                                                        showCancelButton: false,
                                                                        confirmButtonText: 'OK'
                                                                    }).then((result) => {
                                                                        if (result.value) {
                                                                            window.open('/', '_self');
                                                                        } else {
                                                                            window.open('/', '_self');
                                                                        }
                                                                    });
                                                                });

                                                            } else {
                                                                swal({
                                                                    title: 'Password successfully changed',
                                                                    text: '',
                                                                    type: 'success',
                                                                    showCancelButton: false,
                                                                    confirmButtonText: 'OK'
                                                                }).then((result) => {
                                                                    if (result.value) {
                                                                        FlowRouter.go('/employeelist?success=true');
                                                                    } else {
                                                                        FlowRouter.go('/employeelist?success=true');
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    }).catch(function (err) {
                                                        swal({
                                                            title: 'Password successfully changed',
                                                            text: '',
                                                            type: 'success',
                                                            showCancelButton: false,
                                                            confirmButtonText: 'OK'
                                                        }).then((result) => {
                                                            if (result.value) {
                                                                FlowRouter.go('/employeelist?success=true');
                                                            } else {
                                                                FlowRouter.go('/employeelist?success=true');
                                                            }
                                                        });
                                                    });

                                                }

                                            }

                                        } else if (oPost.readyState == 4 && oPost.status == 403) {
                                            $('.fullScreenSpin').css('display', 'none');
                                            swal({
                                                title: 'Oooops...',
                                                text: oPost.getResponseHeader('errormessage'),
                                                type: 'error',
                                                showCancelButton: false,
                                                confirmButtonText: 'Try Again'
                                            }).then((result) => {
                                                if (result.value) {
                                                    window.open('/employeescard', '_self');
                                                } else if (result.dismiss === 'cancel') {
                                                    window.open('/employeescard', '_self');
                                                }
                                            });
                                        } else if (oPost.readyState == 4 && oPost.status == 406) {
                                            $('.fullScreenSpin').css('display', 'none');
                                            var ErrorResponse = oPost.getResponseHeader('errormessage');
                                            var segError = ErrorResponse.split(':');

                                            if ((segError[1]) == ' "Unable to lock object') {

                                                swal({
                                                    title: 'Oooops...',
                                                    text: oPost.getResponseHeader('errormessage'),
                                                    type: 'error',
                                                    showCancelButton: false,
                                                    confirmButtonText: 'Try Again'
                                                }).then((result) => {
                                                    if (result.value) {
                                                        window.open('/employeescard', '_self');
                                                    } else if (result.dismiss === 'cancel') {
                                                        window.open('/employeescard', '_self');
                                                    }
                                                });
                                            } else {
                                                swal({
                                                    title: 'Oooops...',
                                                    text: oPost.getResponseHeader('errormessage'),
                                                    type: 'error',
                                                    showCancelButton: false,
                                                    confirmButtonText: 'Try Again'
                                                }).then((result) => {
                                                    if (result.value) {
                                                        window.open('/employeescard', '_self');
                                                    } else if (result.dismiss === 'cancel') {
                                                        window.open('/employeescard', '_self');
                                                    }
                                                });
                                            }

                                        } else if (oPost.readyState == '') {

                                            swal({
                                                title: 'Oooops...',
                                                text: oPost.getResponseHeader('errormessage'),
                                                type: 'error',
                                                showCancelButton: false,
                                                confirmButtonText: 'Try Again'
                                            }).then((result) => {
                                                if (result.value) {
                                                    window.open('/employeescard', '_self');
                                                } else if (result.dismiss === 'cancel') {
                                                    window.open('/employeescard', '_self');
                                                }
                                            });
                                        } else {
                                            $('.fullScreenSpin').css('display', 'none');
                                        }
                                    }

                                } else {
                                    if (employeeSaveID) {
                                        //window.open('/employeescard?id=' + employeeSaveID,'_self');
                                        sideBarService.getAllEmployees(25, 0).then(function (dataReload) {
                                            addVS1Data('TEmployee', JSON.stringify(dataReload)).then(function (datareturn) {
                                                //FlowRouter.go('/employeelist?success=true');
                                                sideBarService.getAllAppointmentPredList().then(function (data) {
                                                    addVS1Data('TAppointmentPreferences', JSON.stringify(data)).then(function (datareturn) {
                                                        FlowRouter.go('/employeelist?success=true');
                                                    }).catch(function (err) {
                                                        FlowRouter.go('/employeelist?success=true');
                                                    });
                                                }).catch(function (err) {
                                                    FlowRouter.go('/employeelist?success=true');
                                                });
                                            }).catch(function (err) {
                                                FlowRouter.go('/employeelist?success=true');
                                            });
                                        }).catch(function (err) {
                                            FlowRouter.go('/employeelist?success=true');
                                        });
                                    }
                                }

                            }
                        } else {
                            $('.fullScreenSpin').css('display', 'none');
                            $('#addvs1userModal').modal('toggle');

                        }

                    } else {
                        FlowRouter.go('/employeelist?success=true');
                    }

                } else {
                    if (employeeSaveID) {
                        //window.open('/employeescard?id=' + employeeSaveID,'_self');
                        sideBarService.getAllEmployees(25, 0).then(function (dataReload) {
                            addVS1Data('TEmployee', JSON.stringify(dataReload)).then(function (datareturn) {
                                sideBarService.getAllAppointmentPredList().then(function (data) {
                                    addVS1Data('TAppointmentPreferences', JSON.stringify(data)).then(function (datareturn) {
                                        FlowRouter.go('/employeelist?success=true');
                                    }).catch(function (err) {
                                        FlowRouter.go('/employeelist?success=true');
                                    });
                                }).catch(function (err) {
                                    FlowRouter.go('/employeelist?success=true');
                                });
                            }).catch(function (err) {
                                FlowRouter.go('/employeelist?success=true');
                            });
                        }).catch(function (err) {
                            FlowRouter.go('/employeelist?success=true');
                        });
                    }
                }
            });

        }).catch(function (err) {
            swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {
                    //Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {}
            });
            $('.fullScreenSpin').css('display', 'none');
        });

    },
    // Save LeaveRequest Popup
    'click #btnSaveLeaveRequest': async function(event) {
        $('.fullScreenSpin').css('display', 'block');
        let templateObject = Template.instance();
        let currentId = FlowRouter.current().queryParams;
        let employeeID = ( !isNaN(currentId.id) )? currentId.id : 0;
        let TypeofRequest = $('#edtLeaveTypeofRequest').val();
        let Description = $('#edtLeaveDescription').val();
        let StartDate = $('#edtLeaveStartDate').val();
        let EndDate = $('#edtLeaveEndDate').val();
        let PayPeriod = $('#edtLeavePayPeriod').val();
        let Hours = $('#edtLeaveHours').val();
        const leaveRequests = [];
        let TLeaveRequest = await getVS1Data('TLeaveRequest');
        if( TLeaveRequest.length ){
            let TLeaveRequestData = JSON.parse(TLeaveRequest[0].data);
            leaveRequests = AssignLeaveType.fromList(
                TLeaveRequestData.tleaverequest
            );
        }

        leaveRequests.push(
            new LeaveRequest({
                type: "TLeaveRequest",
                fields: new LeaveRequestFields({
                    EmployeeID: employeeID,
                    TypeofRequest: TypeofRequest,
                    Description: Description,
                    StartDate: StartDate,
                    EndDate: EndDate,
                    PayPeriod: PayPeriod,
                    Hours: Hours
                }),
            })
        );
        let updatedLeaveRequest = {
            tleaverequest: leaveRequests,
        }
        await addVS1Data('TLeaveRequest', JSON.stringify(updatedLeaveRequest));
        templateObject.getLeaveRequests();
        $('#newLeaveRequestModal').modal('hide');
        $('.fullScreenSpin').css('display', 'none');
    },

    // Save AssignLeaveType Popup
    'click #btnSaveAssignLeaveType': async function(event) {
        $('.fullScreenSpin').css('display', 'block');
        let templateObject = Template.instance();
        let currentId = FlowRouter.current().queryParams;
        let employeeID = ( !isNaN(currentId.id) )? currentId.id : 0;
        let LeaveType = $('#leaveTypeSelect').val();
        let LeaveCalcMethod = $('#leaveCalcMethodSelect').val();
        let HoursLeave = '';
        let HoursAccruedAnnuallyFullTimeEmp = '';
        let HoursFullTimeEmpFortnightlyPay = '';
        let HoursAccruedAnnually = '';
        switch(LeaveCalcMethod){
            case 'Manually Recorded Rate':
                HoursLeave = $('#hoursLeave').val();
            break;
            case 'No Calculation Required':

            break;
            case 'Based on Ordinary Earnings':
                HoursAccruedAnnuallyFullTimeEmp = $('#hoursAccruedAnnuallyFullTimeEmp').val();
                HoursFullTimeEmpFortnightlyPay = $('#hoursFullTimeEmpFortnightlyPay').val();
            break;
            default:
                HoursAccruedAnnually = $('#hoursAccruedAnnually').val();
            break;
        }

        let OpeningBalance = $('#openingBalance').val();
        let OnTerminationUnusedBalance = $('#onTerminationUnusedBalance').val();
        let EFTLeaveType = $("#eftLeaveType").is(':checked') ? true : false;
        let SuperannuationGuarantee = ( EFTLeaveType )? $("#superannuationGuarantee").is(':checked') ? true : false : false;
        const assignLeaveTypes = [];
        let TAssignLeaveTypes = await getVS1Data('TAssignLeaveType');
        if( TAssignLeaveTypes.length ){
            let TAssignLeaveTypesData = JSON.parse(TAssignLeaveTypes[0].data);
            assignLeaveTypes = AssignLeaveType.fromList(
                TAssignLeaveTypesData.tassignteavetype
            );
        }
        assignLeaveTypes.push(
            new AssignLeaveType({
                type: "TAssignLeaveType",
                fields: new AssignLeaveTypeFields({
                    LeaveType: LeaveType,
                    EmployeeID: employeeID,
                    LeaveCalcMethod: LeaveCalcMethod,
                    HoursAccruedAnnually: HoursAccruedAnnually,
                    HoursAccruedAnnuallyFullTimeEmp: HoursAccruedAnnuallyFullTimeEmp,
                    HoursFullTimeEmpFortnightlyPay: HoursFullTimeEmpFortnightlyPay,
                    HoursLeave: HoursLeave,
                    OpeningBalance: OpeningBalance,
                    OnTerminationUnusedBalance: OnTerminationUnusedBalance,
                    EFTLeaveType: EFTLeaveType,
                    SuperannuationGuarantee: SuperannuationGuarantee
                }),
            })
        );
        let updatedAssignLeaveTypes = {
            tassignteavetype: assignLeaveTypes,
        }
        await addVS1Data('TAssignLeaveType', JSON.stringify(updatedAssignLeaveTypes));
        templateObject.getAssignLeaveTypes();
        $('#assignLeaveTypeModal').modal('hide');
        $('.fullScreenSpin').css('display', 'none');
    },

    // Pay Template Tab
    'click #addEarningsLine': function(){
        // TO DO
        let templateObject = Template.instance();
        let currentId = FlowRouter.current().queryParams;
        let employeeID = ( !isNaN(currentId.id) )? currentId.id : 0;
        let EarningRate = $('#earningRateSelect').val();
        let CalculationType = $('input[name=calculationType]:checked').val();
        let ExpenseAccount = $('#expenseAccount').val();
        let payEarningLinesTemp = [];
        let payEarningLinesTempExist = templateObject.payTemplateEarningLineInfo.get();
        if( Array.isArray( payEarningLinesTempExist ) ){
            payEarningLinesTemp = payEarningLinesTempExist
        }
        payEarningLinesTemp.push(
            new PayTemplateEarningLine({
                type: 'TPayTemplateEarningLine',
                fields: new PayTemplateEarningLineFields({
                    EmployeeID: employeeID,
                    EarningRate: EarningRate,
                    CalculationType: CalculationType,
                    ExpenseAccount: ExpenseAccount
                })
            })
        )
        templateObject.payTemplateEarningLineInfo.set(payEarningLinesTemp);
        $('#earningRateSelect').val('Allowances exempt from tax withholding and super');
        $('input[name=calculationType]:checked').attr('checked', false);
        $('#expenseAccount').val('');
        $('#addEarningsLineModal').modal('hide');
    },

    'click #addDeductionLine': function(){
        let templateObject = Template.instance();
        let currentId = FlowRouter.current().queryParams;
        let employeeID = ( !isNaN(currentId.id) )? currentId.id : 0;
        let DeductionType = $('#deductionTypeSelect').val();
        let CalculationType = $('input[name=calculationTypeDeduction]:checked').val();
        let ControlAccount = $('#controlAccountDeduction').val();
        let payDeductionLinesTemp = [];
        let payDeductionLinesTempExist = templateObject.payTemplateDeductionLineInfo.get();
        if( Array.isArray( payDeductionLinesTempExist ) ){
            payDeductionLinesTemp = payDeductionLinesTempExist
        }

        payDeductionLinesTemp.push(
            new PayTemplateDeductionLine({
                type: 'TPayTemplateDeductionLine',
                fields: new PayTemplateDeductionLineFields({
                    EmployeeID: employeeID,
                    DeductionType: DeductionType,
                    CalculationType: CalculationType,
                    ControlAccount: ControlAccount,
                })
            })
        )

        templateObject.payTemplateDeductionLineInfo.set(payDeductionLinesTemp);
        $('#deductionTypeSelect').val('FBT');
        $('input[name=calculationTypeDeduction]:checked').attr('checked', false);
        $('#controlAccountDeduction').val('');
        $('#addDeductionLineModal').modal('hide');
    },

    'click #addSuperannuationLine': function(){
        let templateObject = Template.instance();
        let currentId = FlowRouter.current().queryParams;
        let employeeID = ( !isNaN(currentId.id) )? currentId.id : 0;
        let Fund = $('#superannuationFund').val();
        let ContributionType = $('#superannuationTypeSelect').val();
        let ReducesSGC = ( $('#reducesSGC').is(':checked') )? true: false;
        let CalculationType = $('input[name=calculationTypeSuperannuation]:checked').val();
        let MinimumMonthlyEarnings = $('#minimumMonthlyEarnings').val();
        let ExpenseAccount = $('#expenseSuperannuationAccount').val();
        let LiabilityAccount = $('#liabilityAccount').val();
        let PaymentFrequency = $('#paymentFrequency').val();
        let PeriodPaymentDate = $('#edtPeriodPaymentDate').val();
        let payLinesTemp = [];
        let payLinesTempExist = templateObject.payTemplateSuperannuationLineInfo.get();
        if( Array.isArray( payLinesTempExist ) ){
            payLinesTemp = payLinesTempExist
        }
        payLinesTemp.push(
            new PayTemplateSuperannuationLine({
                type: 'TPayTemplateSuperannuationLine',
                fields: new PayTemplateSuperannuationLineFields({
                    EmployeeID: employeeID,
                    Fund: Fund,
                    ContributionType: ContributionType,
                    ReducesSGC: ReducesSGC,
                    CalculationType: CalculationType,
                    MinimumMonthlyEarnings: MinimumMonthlyEarnings,
                    ExpenseAccount: ExpenseAccount,
                    LiabilityAccount: LiabilityAccount,
                    PaymentFrequency: PaymentFrequency,
                    PeriodPaymentDate: PeriodPaymentDate,
                })
            })
        )

        templateObject.payTemplateSuperannuationLineInfo.set(payLinesTemp);
        $('#superannuationFund').val('');
        $('#superannuationTypeSelect').val('Superannuation Guarantee Contribution (SGC)');
        $('#reducesSGC').attr('checked', false);
        $('input[name=calculationTypeSuperannuation]:checked').attr('checked', false);
        $('#minimumMonthlyEarnings').val('');
        $('#expenseSuperannuationAccount').val('');
        $('#liabilityAccount').val('');
        $('#paymentFrequency').val('Monthly');
        $('#edtPeriodPaymentDate').val('');
        $('#addSuperannuationLineModal').modal('hide');
    },

    'change #superannuationTypeSelect': function(){
        let CalculationType = $('#superannuationTypeSelect').val();
        $('#reducesSGCContainer').addClass('hideelement')
        $('#statutoryRateContainer').addClass('hideelement')
        $('input[name=calculationTypeSuperannuation]:checked').attr('checked', false);
        switch(CalculationType){
            case 'Superannuation Guarantee Contribution (SGC)':
                $('#statutoryRateContainer').removeClass('hideelement')
            break;
            case 'Pre-Tax Voluntary Contribution (RESC)':
                $('#reducesSGCContainer').removeClass('hideelement')
            break;
            default:
            break;
        }
    },

    'click #addReiumbursementLine': function(){
        let templateObject = Template.instance();
        let currentId = FlowRouter.current().queryParams;
        let employeeID = ( !isNaN(currentId.id) )? currentId.id : 0;
        let ReiumbursementType = $('#reimbursementTypeSelect').val();
        let Description = $('#reiumbursementDescription').val();
        let ControlExpenseAccount = $('#controlExpenseAccount').val();
        let payLinesTemp = [];
        let payLinesTempExist = templateObject.payTemplateReiumbursementLineInfo.get();
        if( Array.isArray( payLinesTempExist ) ){
            payLinesTemp = payLinesTempExist
        }
        payLinesTemp.push(
            new PayTemplateReiumbursementLine({
                type: 'TPayTemplateReiumbursementLine',
                fields: new PayTemplateReiumbursementLineFields({
                    EmployeeID: employeeID,
                    ReiumbursementType: ReiumbursementType,
                    Description: Description,
                    ControlExpenseAccount: ControlExpenseAccount,
                })
            })
        )

        templateObject.payTemplateReiumbursementLineInfo.set(payLinesTemp);
        $('#reimbursementTypeSelect').val('');
        $('#reiumbursementDescription').val('');
        $('#controlExpenseAccount').val('');
        $('#addReimbursementLineModal').modal('hide');
    },

    // Pay Template Earning Line Drop Down
    'click #earningRateSelect': function(){
        let earningRate = $('#earningRateSelect').val();
        $('.calculationType').removeAttr("checked");
        switch( earningRate ){
            case 'JobKeeper Payment top up':
                $('#CalculationType1').attr('disabled', true)
                $('#CalculationType2').attr('disabled', false)
                $('#CalculationType3').attr('disabled', true)
            break;
            case 'Overtime Hours (exempt from super)':
                $('#CalculationType1').attr('disabled', false)
                $('#CalculationType2').attr('disabled', true)
                $('#CalculationType3').attr('disabled', true)
            break;
            default:
                $('#CalculationType1').attr('disabled', true)
                $('#CalculationType2').attr('disabled', false)
                $('#CalculationType3').attr('disabled', false)
            break;
        }
    },

    // Save active tab data
    'click #btnSaveEmployeePayroll': async function(event) {
        let activeTab = "";
        if($('div#taxes').attr("class").indexOf("active") >= 0) activeTab = "taxes";
        if($('div#leave').attr("class").indexOf("active") >= 0) activeTab = "leave";
        if($('div#bankaccounts').attr("class").indexOf("active") >= 0) activeTab = "bankaccounts";
        if($('div#payslips').attr("class").indexOf("active") >= 0) activeTab = "payslips";
        if($('div#paytemplate').attr("class").indexOf("active") >= 0) activeTab = "paytemplate";
        if($('div#openingbalances').attr("class").indexOf("active") >= 0) activeTab = "openingbalances";
        if($('div#notes').attr("class").indexOf("active") >= 0) activeTab = "notes";

        if(activeTab == "taxes") {
            $('.fullScreenSpin').css('display', 'inline-block');
            let currentId = FlowRouter.current().queryParams;
            let employeeID = ( !isNaN(currentId.id) )? currentId.id : 0;
            let templateObject = Template.instance();
            /**
             * Load EmployeePayrollApi API
             */
            // const employeePayrollApi = new EmployeePayrollApi();

            // const apiEndpoint = employeePayrollApi.collection.findByName(
            //     employeePayrollApi.collectionNames.TEmployeepaysettings
            // );

            // let employeePayrollService = new EmployeePayrollService();

            let useData = [];
            const listEmployeePaySettings = {}
            let employeePaySettings = templateObject.employeePayInfos.get();
            let TEmployeepaysettings = await getVS1Data('TEmployeepaysettings');
            if( TEmployeepaysettings.length ){
                listEmployeePaySettings = JSON.parse(TEmployeepaysettings[0].data);
                useData = EmployeePaySettings.fromList(
                    listEmployeePaySettings.temployeepaysettings
                ).filter((item) => {
                    if ( item.fields.Employeeid !== parseInt(employeeID) ) {
                        return item;
                    }
                });
            }


            let TaxFileNumber = $("#edtTaxFileNumber").val();
            let TFNExemption = $("#edtTfnExemption").val();
            let EmploymentBasis = $("#edtEmploymentBasis").val();
            let ResidencyStatus = $("#edtResidencyStatus").val();
            let TaxFreeThreshold = $("#taxesTaxFreeThresholdClaimed").is(':checked') ? true : false;
            let StudyTrainingSupportLoan = $("#taxesStudyTrainingSupportLoans").is(':checked') ? true : false;
            let EligibleToReceiveLeaveLoading = $("#taxesEligibleReceiveLeaveLoading").is(':checked') ? true : false;
            let OtherTaxOffsetClaimed = $("#taxesOtherTaxOffsetClaimed").is(':checked') ? true : false;
            let UpwardvariationRequested = $("#taxesUpwardVariationRequested").is(':checked') ? true : false;
            let SeniorandPensionersTaxOffsetClaimed = $("#taxesSeniorPensionersTaxOffsetClaimed").is(':checked') ? true : false;
            let HasApprovedWithholdingVariation = $("#taxesHasApprovedWithholdingVariation").is(':checked') ? true : false;

            employeePaySettings.fields.Employee.fields.TFN = TaxFileNumber;
            employeePaySettings.fields.Employee.fields.TaxFreeThreshold = TaxFreeThreshold;
            employeePaySettings.fields.Employee.fields.TFNExemption = TFNExemption;
            employeePaySettings.fields.Employee.fields.EmploymentBasis = EmploymentBasis;
            employeePaySettings.fields.Employee.fields.ResidencyStatus = ResidencyStatus;
            employeePaySettings.fields.Employee.fields.StudyTrainingSupportLoan = StudyTrainingSupportLoan;
            employeePaySettings.fields.Employee.fields.EligibleToReceiveLeaveLoading = EligibleToReceiveLeaveLoading;
            employeePaySettings.fields.Employee.fields.OtherTaxOffsetClaimed = OtherTaxOffsetClaimed;
            employeePaySettings.fields.Employee.fields.UpwardvariationRequested = UpwardvariationRequested;
            employeePaySettings.fields.Employee.fields.SeniorandPensionersTaxOffsetClaimed = SeniorandPensionersTaxOffsetClaimed;
            employeePaySettings.fields.Employee.fields.HasApprovedWithholdingVariation = HasApprovedWithholdingVariation;

            useData.push(employeePaySettings);

            /**
             * Saving employeePaySettings Object in localDB
            */

            listEmployeePaySettings.temployeepaysettings = useData;
            await addVS1Data('TEmployeepaysettings', JSON.stringify(listEmployeePaySettings));
            $('.fullScreenSpin').css('display', 'none');

            return false;
            addVS1Data('TEmployeepaysettings', JSON.stringify(currentInfo));
            $('.fullScreenSpin').css('display', 'none');
            return;
            employeePayrollService.saveTEmployeepaysettings(objDetails).then(function(objDetails) {
                employeePayrollService.getAllEmployeePaySettings('All',0).then(function (data) {
                    addVS1Data('TEmployeepaysettings', newDataObj);
                }).catch(function(err){});

            }).catch(function(err){
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        //Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }else if(activeTab == "leave") {

        }else if(activeTab == "bankaccounts") {

            let data = [];

            let employeePayrollService = new EmployeePayrollService();

            let EmployeeID = FlowRouter.current().queryParams;

            let firstContainer = ($(".firstContainer").attr("class").indexOf("d-none") >= 0) ? true : false;
            let secondContainer = ($(".secondContainer").attr("class").indexOf("d-none") >= 0) ? true : false;
            let thirdContainer = ($(".thirdContainer").attr("class").indexOf("d-none") >= 0) ? true : false;

            let primaryFlag = false;
            let firstFlag = false;
            let secondFlag = false;
            let thirdFlag = false;

            let primaryObj = null;
            let firstObj = null;
            let secondObj = null;
            let thirdObj = null;

            let primaryStatementText = $(".primaryStatementText").val().trim();
            let primaryAccName = $(".primaryAccName").val().trim();
            let primaryBsbNumber = $(".primaryBsbNumber").val().trim();
            let primaryAccNumber = $(".primaryAccNumber").val().trim();
            let primaryID = $(".primaryID").val();

            if(primaryStatementText == "") primaryFlag = true;
            if(primaryAccName == "") primaryFlag = true;
            if(primaryBsbNumber == "") primaryFlag = true;
            if(primaryAccNumber == "") primaryFlag = true;

            if(primaryFlag) {

                swal('Primary Bank Account cannot be blank!', '', 'info');
                event.preventDefault();
                return;
            }

            data.push({
                type: "TBankAccounts",
                fields: {
                    ID: primaryID ? primaryID : null,
                    EmployeeID: EmployeeID.id,
                    IsPrimary: true,
                    StatementText: primaryStatementText,
                    AccName: primaryAccName,
                    BSBNumber: primaryBsbNumber,
                    AccNumber: primaryAccNumber,
                }
            });

            let firstStatementText = $(".firstStatementText").val().trim();
            let firstAccName = $(".firstAccName").val().trim();
            let firstBsbNumber = $(".firstBsbNumber").val().trim();
            let firstAccNumber = $(".firstAccNumber").val().trim();
            let firstID = $(".firstID").val();

            if(!firstContainer) {
                if(firstStatementText == "") firstFlag = true;
                if(firstAccName == "") firstFlag = true;
                if(firstBsbNumber == "") firstFlag = true;
                if(firstAccNumber == "") firstFlag = true;

                if(firstFlag) {
                    swal('First Bank Account cannot be blank!', '', 'info');
                    event.preventDefault();
                    return;
                }

                data.push({
                    type: "TBankAccounts",
                    fields: {
                        ID: firstID ? firstID : null,
                        EmployeeID: EmployeeID.id,
                        IsPrimary: false,
                        StatementText: firstStatementText,
                        AccName: firstAccName,
                        BSBNumber: firstBsbNumber,
                        AccNumber: firstAccNumber,
                    }
                });
            }


            let secondStatementText = $(".secondStatementText").val();
            let secondAccName = $(".secondAccName").val();
            let secondBsbNumber = $(".secondBsbNumber").val();
            let secondAccNumber = $(".secondAccNumber").val();
            let secondID = $(".secondID").val();

            if(!secondContainer) {
                if(secondStatementText == "") secondFlag = true;
                if(secondAccName == "") secondFlag = true;
                if(secondBsbNumber == "") secondFlag = true;
                if(secondAccNumber == "") secondFlag = true;

                if(secondFlag) {
                    swal('Second Bank Account cannot be blank!', '', 'info');
                    event.preventDefault();
                    return;
                }

                data.push({
                    type: "TBankAccounts",
                    fields: {
                        ID: secondID ? secondID : null,
                        EmployeeID: EmployeeID.id,
                        IsPrimary: false,
                        StatementText: secondStatementText,
                        AccName: secondAccName,
                        BSBNumber: secondBsbNumber,
                        AccNumber: secondAccNumber,
                    }
                });
            }

            let thirdStatementText = $(".thirdStatementText").val();
            let thirdAccName = $(".thirdAccName").val();
            let thirdBsbNumber = $(".thirdBsbNumber").val();
            let thirdAccNumber = $(".thirdAccNumber").val();
            let thirdID = $(".thirdID").val();

            if(!thirdContainer) {
                if(thirdStatementText == "") thirdFlag = true;
                if(thirdAccName == "") thirdFlag = true;
                if(thirdBsbNumber == "") thirdFlag = true;
                if(thirdAccNumber == "") thirdFlag = true;

                if(thirdFlag) {
                    swal('Third Bank Account cannot be blank!', '', 'info');
                    event.preventDefault();
                    return;
                }

                data.push({
                    type: "TBankAccounts",
                    fields: {
                        ID: thirdID ? thirdID : null,
                        EmployeeID: EmployeeID.id,
                        IsPrimary: false,
                        StatementText: thirdStatementText,
                        AccName: thirdAccName,
                        BSBNumber: thirdBsbNumber,
                        AccNumber: thirdAccNumber,
                    }
                });
            }


            $('.fullScreenSpin').css('display', 'inline-block');

            addVS1Data('TBankAccounts', JSON.stringify(data));

            $('.fullScreenSpin').css('display', 'none');

            return;



            employeePayrollService.saveTBankAccounts(data).then(function(objDetails) {
                employeePayrollService.getAllTBankAccounts('All',0).then(function (data) {
                    addVS1Data('TBankAccounts', data);
                }).catch(function(err){});

            }).catch(function(err){
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        //Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });


            // let StatementText = $(".statementText").val();
            // let AccName = $(".accName").val();
            // let BSBNumber = $(".bsbNumber").val();
            // let AccNumber = $(".accNumber").val();
            // let ID;
            // let Primary;


            // let data = [{
            //     type: "TBankAccounts",
            //     fields: {
            //         ID: 1,
            //         EmployeeID: EmployeeID.id,
            //         IsPrimary: true,
            //         StatementText: StatementText,
            //         AccName: AccName,
            //         BSBNumber: BSBNumber,
            //         AccNumber: AccNumber,
            //     }
            // }]
            // addVS1Data('TBankAccounts', JSON.stringify(data));

        }else if(activeTab == "payslips") {

        }else if(activeTab == "paytemplate") {

        }else if(activeTab == "openingbalances") {

        }else if(activeTab == "notes") {

        }else{
            return;
        }
    },
    'change .colServiceCostPrice': function (event) {

        let utilityService = new UtilityService();
        let inputUnitPrice = 0;
        if (!isNaN($(event.target).val())) {
            inputUnitPrice = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;

            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));

        }
    },
    'change .colServiceSalesPrice': function (event) {

        let utilityService = new UtilityService();
        let inputUnitPrice = 0;
        if (!isNaN($(event.target).val())) {
            inputUnitPrice = parseFloat($(event.target).val()) || 0;
            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
        } else {
            inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;

            $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));

        }
    },
    'click #addAllProducts': function(event) {
        if ($(event.target).is(':checked')) {
            $('.activeProductEmployee').css('display', 'none');
        } else {
          $('.activeProductEmployee').css('display', 'block');
        }
    },
    'keydown .colServiceCostPrice, keydown .colServiceSalesPrice': function (event) {
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
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {}
        else {
            event.preventDefault();
        }
    },
    'click .btnClosePayment': function (event) {
        if (FlowRouter.current().queryParams.id) {
            window.open('/employeescard?id=' + FlowRouter.current().queryParams.id, '_self');
        } else {
            window.open('/employeescard', '_self');
        }

    },
    'click .btnChargeAccount': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        var enteredEmail = $("#cloudEmpEmailAddress").val();
        let cloudpassword = $("#cloudEmpUserPassword").val();
        let employeeSaveID = $('#selectEmployeeID').val();
        // if(cloudpassword.length < 8) {
        //   swal('Invalid VS1 Password', 'Password must be at least eight characters including one capital letterand one number!', 'error');
        //   $('#cloudEmpUserPassword').css('border-color','red');
        //   $('#cloudEmpUserPassword').focus();
        //   $('.fullScreenSpin').css('display','none');
        // }else{
        //
        //   if((cloudpassword.match(/[A-z]/)) && (cloudpassword.match(/[A-Z]/)) && (cloudpassword.match(/\d/))){
        //     $('#cloudEmpUserPassword').css('border-color','#b5b8bb #e2e4e7 #e8eaec #bdbfc3');

        var empFirstName = $("#edtFirstName").val();
        var empLastName = $("#edtLastName").val();
        var empPhone = $("#edtPhone").val();

        var dateofbirthTime = new Date($("#dtDOB").datepicker("getDate"));
        var startdateTime = new Date($("#dtStartingDate").datepicker("getDate"));

        let empDOB = dateofbirthTime.getFullYear() + "-" + (dateofbirthTime.getMonth() + 1) + "-" + dateofbirthTime.getDate();
        let empStartDate = startdateTime.getFullYear() + "-" + (startdateTime.getMonth() + 1) + "-" + startdateTime.getDate();

        var empGender = $("#edtGender").val() || 'M';
        let addgender = '';
        if (empGender === "Male") {
            addgender = "M";
        } else if (empGender === "Female") {
            addgender = "F";
        } else {
            addgender = empGender;
        };
        var enteredEmail = $("#cloudEmpEmailAddress").val();
        var enteredPassword = $("#cloudEmpUserPassword").val();
        var cloudHashPassword = CryptoJS.MD5(enteredPassword).toString().toUpperCase();
        var erpGet = erpDb();

        let objDetailsUser = {
            //JsonIn:{
            Name: "VS1_NewUser",
            Params: {
                Vs1UserName: enteredEmail,
                Vs1Password: enteredPassword,
                Modulename: "Add Extra User",
                Paymentamount: Number(addExtraUserPrice.replace(/[^0-9.-]+/g, "")) || 35,
                PayMethod: "Cash",
                Price: Number(addExtraUserPrice.replace(/[^0-9.-]+/g, "")) || 35,
                DiscountedPrice: Number(addExtraUserPrice.replace(/[^0-9.-]+/g, "")) || 35,
                DiscountDesc: "",
                RenewPrice: Number(addExtraUserPrice.replace(/[^0-9.-]+/g, "")) || 35,
                RenewDiscountedPrice: Number(addExtraUserPrice.replace(/[^0-9.-]+/g, "")) || 35,
                RenewDiscountDesc: "",
                EmployeeDetails: {
                    ID: parseInt(employeeSaveID) || 0,
                    FirstName: empFirstName,
                    LastName: empLastName,
                    MiddleName: $('#edtMiddleName').val() || '',
                    Phone: empPhone,
                    DateStarted: empStartDate,
                    DOB: empDOB,
                    Sex: addgender,
                },
                DatabaseName: erpGet.ERPDatabase,
                ServerName: erpGet.ERPIPAddress,
                ERPLoginDetails: {
                    ERPUserName: localStorage.getItem('mySession'),
                    ERPPassword: localStorage.getItem('EPassword')
                }
            }
            //}
        };

        var oPost = new XMLHttpRequest();
        oPost.open("POST", URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_NewUser"', true);
        oPost.setRequestHeader("database", vs1loggedDatatbase);
        oPost.setRequestHeader("username", 'VS1_Cloud_Admin');
        oPost.setRequestHeader("password", 'DptfGw83mFl1j&9');
        oPost.setRequestHeader("Accept", "application/json");
        oPost.setRequestHeader("Accept", "application/html");
        oPost.setRequestHeader("Content-type", "application/json");

        var myString = '"JsonIn"' + ':' + JSON.stringify(objDetailsUser);

        //
        oPost.send(myString);

        oPost.onreadystatechange = function () {
            if (oPost.readyState == 4 && oPost.status == 200) {

                $('.fullScreenSpin').css('display', 'none');
                var myArrResponse = JSON.parse(oPost.responseText);

                if (myArrResponse.ProcessLog.ResponseStatus != "OK") {
                    // Bert.alert('Database Error<strong> :'+ myArrResponse.ProcessLog.Error+'</strong>', 'now-error');
                    // swal('Ooops...', myArrResponse.ProcessLog.Error, 'error');
                    swal({
                        title: 'Ooops...',
                        text: myArrResponse.ProcessLog.ResponseStatus,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.value) {
                            if (FlowRouter.current().queryParams.id) {
                                window.open('/employeescard?id=' + FlowRouter.current().queryParams.id, '_self');
                            } else {
                                window.open('/employeescard', '_self');
                            }
                        } else if (result.dismiss === 'cancel') {
                            if (FlowRouter.current().queryParams.id) {
                                window.open('/employeescard?id=' + FlowRouter.current().queryParams.id, '_self');
                            } else {
                                window.open('/employeescard', '_self');
                            }
                        }
                    });
                } else {
                    let newStripePrice = objDetailsUser.Params.Price.toFixed(2);
                    // Meteor.call('braintreeChargeCard', Session.get('VS1AdminUserName'), 35);
                    // Meteor.call('StripeChargeCard', Session.get('VS1AdminUserName'), 3500);
                    // swal('User details successfully added', '', 'success');
                    let to2Decimal = objDetailsUser.Params.Price.toFixed(2)
                        let amount = to2Decimal.toString().replace(/\./g, '')
                        let currencyname = (CountryAbbr).toLowerCase();
                    let stringQuery = "?";
                    let name = Session.get('mySessionEmployee').split(' ')[0];
                    let surname = Session.get('mySessionEmployee').split(' ')[1];
                    stringQuery = stringQuery + "product" + 0 + "= New User" + "&price" + 0 + "=" + Currency + objDetailsUser.Params.Price + "&qty" + 0 + "=" + 1 + "&";
                    stringQuery = stringQuery + "tax=0" + "&total=" + Currency + objDetailsUser.Params.Price + "&customer=" + Session.get('vs1companyName') + "&name=" + name + "&surname=" + surname + "&company=" + Session.get('vs1companyName') + "&customeremail=" + localStorage.getItem('mySession') + "&type=VS1 Modules Purchase&url=" + window.location.href + "&server=" + erpGet.ERPIPAddress + "&username=" + erpGet.ERPUsername + "&token=" + erpGet.ERPPassword + "&session=" + erpGet.ERPDatabase + "&port=" + erpGet.ERPPort + "&currency=" + currencyname;
                    sideBarService.getAllEmployees(25, 0).then(function (dataReload) {
                        addVS1Data('TEmployee', JSON.stringify(dataReload)).then(function (datareturn) {
                            $.ajax({
                                url: stripeGlobalURL +'vs1_module_purchase.php',
                                data: {
                                    'email': Session.get('VS1AdminUserName'),
                                    'price': newStripePrice.replace('.', ''),
                                    'currency': currencyname
                                },
                                method: 'post',
                                success: function (response) {
                                    let response2 = JSON.parse(response);
                                    if (response2 != null) {
                                      //Give Full Access To new User created
                                      let objDetailsAccess = {
                                          Name: "VS1_EmployeeAccess",
                                          Params: {
                                              VS1EmployeeAccessList:
                                              [
                                                  {
                                                      EmployeeId:parseInt(employeeSaveID) || 0,
                                                      formID:0,
                                                      Access:1
                                                  }
                                              ]
                                          }
                                      };

                                      var oPostAccessLevel = new XMLHttpRequest();
                                      var erpGetAccessLevel = erpDb();
                                      oPostAccessLevel.open("POST",URLRequest + erpGetAccessLevel.ERPIPAddress + ':' + erpGetAccessLevel.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_EmployeeAccess"', true);
                                      oPostAccessLevel.setRequestHeader("database",erpGetAccessLevel.ERPDatabase);
                                      oPostAccessLevel.setRequestHeader("username",erpGetAccessLevel.ERPUsername);
                                      oPostAccessLevel.setRequestHeader("password",erpGetAccessLevel.ERPPassword);
                                      oPostAccessLevel.setRequestHeader("Accept", "application/json");
                                      oPostAccessLevel.setRequestHeader("Accept", "application/html");
                                      oPostAccessLevel.setRequestHeader("Content-type", "application/json");
                                      var myStringAccess = '"JsonIn"'+':'+JSON.stringify(objDetailsAccess);
                                      oPostAccessLevel.send(myStringAccess);
                                      oPostAccessLevel.onreadystatechange = function() {
                                          if(oPostAccessLevel.readyState == 4 && oPostAccessLevel.status == 200) {

                                          }
                                      };

                                        swal({
                                            title: 'User details successfully added',
                                            text: '',
                                            type: 'success',
                                            showCancelButton: false,
                                            confirmButtonText: 'OK'
                                        }).then((result) => {
                                            if (result.value) {
                                                let employeeName = $('#edtCustomerCompany').val() || '';
                                                window.open('/accesslevel?empuser=' + employeeName+'&empuserid='+employeeSaveID, '_self');

                                            } else {
                                                FlowRouter.go('/employeelist?success=true');
                                            }
                                        });
                                    } else {
                                        window.open(stripeGlobalURL + stringQuery, '_self');
                                    }
                                }
                            });
                            //FlowRouter.go('/employeelist?success=true');
                        }).catch(function (err) {
                          FlowRouter.go('/employeelist?success=true');
                            //window.open('https://www.depot.vs1cloud.com/stripe/' + stringQuery, '_self');
                        });
                    }).catch(function (err) {
                      FlowRouter.go('/employeelist?success=true');
                        //window.open('https://www.depot.vs1cloud.com/stripe/' + stringQuery, '_self');
                    });

                }

                // Bert.alert('<strong>SUCCESS:</strong> Employee successfully updated!', 'success');

            } else if (oPost.readyState == 4 && oPost.status == 403) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Oooops...',
                    text: oPost.getResponseHeader('errormessage'),
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        window.open('/employeescard', '_self');
                    } else if (result.dismiss === 'cancel') {
                        window.open('/employeescard', '_self');
                    }
                });
            } else if (oPost.readyState == 4 && oPost.status == 406) {
                $('.fullScreenSpin').css('display', 'none');
                var ErrorResponse = oPost.getResponseHeader('errormessage');
                var segError = ErrorResponse.split(':');

                if ((segError[1]) == ' "Unable to lock object') {

                    swal({
                        title: 'Oooops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            window.open('/employeescard', '_self');
                        } else if (result.dismiss === 'cancel') {
                            window.open('/employeescard', '_self');
                        }
                    });
                } else {
                    swal({
                        title: 'Oooops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            window.open('/employeescard', '_self');
                        } else if (result.dismiss === 'cancel') {
                            window.open('/employeescard', '_self');
                        }
                    });
                }

            }  else if (oPost.readyState == 4 && oPost.status == 401) {
                $('.fullScreenSpin').css('display', 'none');
                var ErrorResponse = oPost.getResponseHeader('errormessage');
                if (ErrorResponse.indexOf("Could not connect to ERP") >= 0){
                  swal({
                    title: 'Oooops...',
                    text: "Could not connect to Database. Unable to start Database. Licence on hold ",
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                    }).then((result) => {
                    if (result.value) {
                      Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {

                    }
                  });
                }else{
                swal({
                    title: 'Oooops...',
                    text: oPost.getResponseHeader('errormessage'),
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
              }
            } else if (oPost.readyState == '') {
                $('.fullScreenSpin').css('display', 'none');
                //Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>!', 'danger');
                swal({
                    title: 'Oooops...',
                    text: oPost.getResponseHeader('errormessage'),
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        window.open('/employeescard', '_self');
                    } else if (result.dismiss === 'cancel') {
                        window.open('/employeescard', '_self');
                    }
                });
            } else {
                $('.fullScreenSpin').css('display', 'none');
            }
        }
        //   }else {
        //     swal('Invalid VS1 Password', 'Password must be at least eight characters including one capital letterand one number!', 'error');
        //     $('#cloudEmpUserPassword').css('border-color','red');
        //     $('#cloudEmpUserPassword').focus();
        //     $('.fullScreenSpin').css('display','none');
        //   }
        //
        // }
    },
    'click .btnChargeFreeAccount': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        var enteredEmail = $("#cloudEmpEmailAddress").val();
        let cloudpassword = $("#cloudEmpUserPassword").val();
        let employeeSaveID = $('#selectEmployeeID').val();
        var empFirstName = $("#edtFirstName").val();
        var empLastName = $("#edtLastName").val();
        var empPhone = $("#edtPhone").val();

        var dateofbirthTime = new Date($("#dtDOB").datepicker("getDate"));
        var startdateTime = new Date($("#dtStartingDate").datepicker("getDate"));

        let empDOB = dateofbirthTime.getFullYear() + "-" + (dateofbirthTime.getMonth() + 1) + "-" + dateofbirthTime.getDate();
        let empStartDate = startdateTime.getFullYear() + "-" + (startdateTime.getMonth() + 1) + "-" + startdateTime.getDate();

        var empGender = $("#edtGender").val() || 'M';
        let addgender = '';
        if (empGender === "Male") {
            addgender = "M";
        } else if (empGender === "Female") {
            addgender = "F";
        } else {
            addgender = empGender;
        };
        var enteredEmail = $("#cloudEmpEmailAddress").val();
        var enteredPassword = $("#cloudEmpUserPassword").val();
        var cloudHashPassword = CryptoJS.MD5(enteredPassword).toString().toUpperCase();
        var erpGet = erpDb();

        let objDetailsUser = {
            //JsonIn:{
            Name: "VS1_NewUser",
            Params: {
                Vs1UserName: enteredEmail,
                Vs1Password: enteredPassword,
                Modulename: "Add Extra User",
                // Paymentamount:35,
                Paymentamount: 0,
                Price: Number(addExtraUserPrice.replace(/[^0-9.-]+/g, "")) || 35,
                DiscountedPrice: 0,
                DiscountDesc: "",
                RenewPrice: 0,
                RenewDiscountedPrice: 0,
                RenewDiscountDesc: "Free User Included in the license",
                // PayMethod:"Cash",
                EmployeeDetails: {
                    ID: parseInt(employeeSaveID) || 0,
                    FirstName: empFirstName,
                    LastName: empLastName,
                    MiddleName: $('#edtMiddleName').val() || '',
                    Phone: empPhone,
                    DateStarted: empStartDate,
                    DOB: empDOB,
                    Sex: addgender,
                },
                DatabaseName: erpGet.ERPDatabase,
                ServerName: erpGet.ERPIPAddress,
                ERPLoginDetails: {
                    ERPUserName: localStorage.getItem('mySession'),
                    ERPPassword: localStorage.getItem('EPassword')
                }
            }
            //}
        };

        var oPost = new XMLHttpRequest();
        oPost.open("POST", URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_NewUser"', true);
        oPost.setRequestHeader("database", vs1loggedDatatbase);
        oPost.setRequestHeader("username", 'VS1_Cloud_Admin');
        oPost.setRequestHeader("password", 'DptfGw83mFl1j&9');
        oPost.setRequestHeader("Accept", "application/json");
        oPost.setRequestHeader("Accept", "application/html");
        oPost.setRequestHeader("Content-type", "application/json");

        var myString = '"JsonIn"' + ':' + JSON.stringify(objDetailsUser);
        oPost.send(myString);
        oPost.onreadystatechange = function () {
            if (oPost.readyState == 4 && oPost.status == 200) {

                $('.fullScreenSpin').css('display', 'none');
                var myArrResponse = JSON.parse(oPost.responseText);

                if (myArrResponse.ProcessLog.ResponseStatus != "OK") {
                    // swal('Ooops...', myArrResponse.ProcessLog.Error, 'error');
                    swal({
                        title: 'Ooops...',
                        text: myArrResponse.ProcessLog.ResponseStatus,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.value) {
                            if (FlowRouter.current().queryParams.id) {
                                window.open('/employeescard?id=' + FlowRouter.current().queryParams.id, '_self');
                            } else {
                                window.open('/employeescard', '_self');
                            }
                        } else if (result.dismiss === 'cancel') {
                            if (FlowRouter.current().queryParams.id) {
                                window.open('/employeescard?id=' + FlowRouter.current().queryParams.id, '_self');
                            } else {
                                window.open('/employeescard', '_self');
                            }
                        }
                    });
                } else {
                  //Give Full Access To new User created
                  let objDetailsAccess = {
                      Name: "VS1_EmployeeAccess",
                      Params: {
                          VS1EmployeeAccessList:
                          [
                              {
                                  EmployeeId:parseInt(employeeSaveID) || 0,
                                  formID:0,
                                  Access:1
                              }
                          ]
                      }
                  };

                  var oPostAccessLevel = new XMLHttpRequest();
                  var erpGetAccessLevel = erpDb();
                  oPostAccessLevel.open("POST",URLRequest + erpGetAccessLevel.ERPIPAddress + ':' + erpGetAccessLevel.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_EmployeeAccess"', true);
                  oPostAccessLevel.setRequestHeader("database",erpGetAccessLevel.ERPDatabase);
                  oPostAccessLevel.setRequestHeader("username",erpGetAccessLevel.ERPUsername);
                  oPostAccessLevel.setRequestHeader("password",erpGetAccessLevel.ERPPassword);
                  oPostAccessLevel.setRequestHeader("Accept", "application/json");
                  oPostAccessLevel.setRequestHeader("Accept", "application/html");
                  oPostAccessLevel.setRequestHeader("Content-type", "application/json");
                  var myStringAccess = '"JsonIn"'+':'+JSON.stringify(objDetailsAccess);
                  oPostAccessLevel.send(myStringAccess);
                  oPostAccessLevel.onreadystatechange = function() {
                      if(oPostAccessLevel.readyState == 4 && oPostAccessLevel.status == 200) {

                      }
                  };

                    swal({
                        title: 'User details successfully added',
                        text: '',
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.value) {
                            let employeeName = $('#edtCustomerCompany').val() || '';
                            //window.open('/accesslevel?empuser=' + employeeName, '_self');
                            window.open('/accesslevel?empuser=' + employeeName+'&empuserid='+employeeSaveID, '_self');

                        } else {
                            sideBarService.getAllEmployees(25, 0).then(function (dataReload) {
                                addVS1Data('TEmployee', JSON.stringify(dataReload)).then(function (datareturn) {
                                    FlowRouter.go('/employeelist?success=true');
                                }).catch(function (err) {
                                    FlowRouter.go('/employeelist?success=true');
                                });
                            }).catch(function (err) {
                                FlowRouter.go('/employeelist?success=true');
                            });
                        }
                    });
                }
            } else if (oPost.readyState == 4 && oPost.status == 403) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Oooops...',
                    text: oPost.getResponseHeader('errormessage'),
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        window.open('/employeescard', '_self');
                    } else if (result.dismiss === 'cancel') {
                        window.open('/employeescard', '_self');
                    }
                });
            } else if (oPost.readyState == 4 && oPost.status == 406) {
                $('.fullScreenSpin').css('display', 'none');
                var ErrorResponse = oPost.getResponseHeader('errormessage');
                var segError = ErrorResponse.split(':');

                if ((segError[1]) == ' "Unable to lock object') {

                    swal({
                        title: 'Oooops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            window.open('/employeescard', '_self');
                        } else if (result.dismiss === 'cancel') {
                            window.open('/employeescard', '_self');
                        }
                    });
                } else {
                    swal({
                        title: 'Oooops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            window.open('/employeescard', '_self');
                        } else if (result.dismiss === 'cancel') {
                            window.open('/employeescard', '_self');
                        }
                    });
                }

            }  else if (oPost.readyState == 4 && oPost.status == 401) {
                $('.fullScreenSpin').css('display', 'none');
                var ErrorResponse = oPost.getResponseHeader('errormessage');
                if (ErrorResponse.indexOf("Could not connect to ERP") >= 0){
                  swal({
                    title: 'Oooops...',
                    text: "Could not connect to Database. Unable to start Database. Licence on hold ",
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                    }).then((result) => {
                    if (result.value) {
                      Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {

                    }
                  });
                }else{
                swal({
                    title: 'Oooops...',
                    text: oPost.getResponseHeader('errormessage'),
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
              }
            } else if (oPost.readyState == '') {
                $('.fullScreenSpin').css('display', 'none');
                //Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>!', 'danger');
                swal({
                    title: 'Oooops...',
                    text: oPost.getResponseHeader('errormessage'),
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        window.open('/employeescard', '_self');
                    } else if (result.dismiss === 'cancel') {
                        window.open('/employeescard', '_self');
                    }
                });
            }
        }
    },
    'click .btnBack': function (event) {
        event.preventDefault();
        history.back(1);
    },
    'click #chkSameAsShipping': function (event) {
        // if($(event.target).is(':checked')){
        //   let streetAddress = $('#edtStreetAddress').val();
        //   let city = $('#edtCity').val();
        //   let state =  $('#edtState').val();
        //   let zipcode =  $('#edtPostalCode').val();
        //
        //   let country =  $('#edtCountry').val();
        //    $('#bedtStreetAddress').val(streetAddress);
        //    $('#bedtCity').val(city);
        //    $('#bedtState').val(state);
        //    $('#bedtPostalCode').val(zipcode);
        //    $('#bedtCountry').val(country);
        // }else{
        //   $('#bedtStreetAddress').val('');
        //   $('#bedtCity').val('');
        //   $('#bedtState').val('');
        //   $('#bedtPostalCode').val('');
        //   $('#bedtCountry').val('');
        // }
    },
    'blur #edtFirstName': function (event) {
        let firstname = $('#edtFirstName').val();
        let lastname = $('#edtLastName').val();
        let employeename = firstname + ' ' + lastname;
        $('#cloudEmpName').val(employeename);
        $('#edtCustomerCompany').val(employeename);

    },
    'blur #edtLastName': function (event) {
        let firstname = $('#edtFirstName').val();
        let lastname = $('#edtLastName').val();
        let employeename = firstname + ' ' + lastname;
        $('#cloudEmpName').val(employeename);
        $('#edtCustomerCompany').val(employeename);

    },
    'keyup .search': function (event) {
        var searchTerm = $(".search").val();
        var listItem = $('.results tbody').children('tr');
        var searchSplit = searchTerm.replace(/ /g, "'):containsi('");

        $.extend($.expr[':'], {
            'containsi': function (elem, i, match, array) {
                return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
            }
        });

        $(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function (e) {
            $(this).attr('visible', 'false');
        });

        $(".results tbody tr:containsi('" + searchSplit + "')").each(function (e) {
            $(this).attr('visible', 'true');
        });

        var jobCount = $('.results tbody tr[visible="true"]').length;
        $('.counter').text(jobCount + ' items');

        if (jobCount == '0') {
            $('.no-result').show();
        } else {
            $('.no-result').hide();
        }
        if (searchTerm === "") {
            $(".results tbody tr").each(function (e) {
                $(this).attr('visible', 'true');
                $('.no-result').hide();
            });

            //setTimeout(function () {
            var rowCount = $('.results tbody tr').length;
            $('.counter').text(rowCount + ' items');
            //}, 500);
        }

    },
    'click .tblEmployeeSideList tbody tr': function (event) {

        var empLineID = $(event.target).attr('id');
        if (empLineID) {
            window.open('/employeescard?id=' + empLineID, '_self');
        }
    },
    'click .chkDatatable': function (event) {
        var columns = $('#tblTransactionlist th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function (i, v) {
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
    'click .resetTable': function (event) {
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
                    PrefName: 'tblTransactionlist'
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
    'click .saveTable': function (event) {
        let lineItems = [];
        //let datatable =$('#tblTransactionlist').DataTable();
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
        });
        //datatable.state.save();

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
                    PrefName: 'tblTransactionlist'
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
                            PrefName: 'tblTransactionlist',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
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
                        PrefName: 'tblTransactionlist',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function (err, idTag) {
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
        //Meteor._reload.reload();
    },
    'keyup #cloudEmpEmailAddress': function (event) {
        let columData = $(event.target).val();

        $('#cloudEmpLogonName').val(columData);
        $('#edtEmailAddress').val(columData);

    },
    'keyup #edtEmailAddress': function (event) {
        let columData = $(event.target).val();

        $('#cloudEmpLogonName').val(columData);
        $('#cloudEmpEmailAddress').val(columData);

    },
    'blur #cloudEmpEmailAddress, blur #edtEmailAddress': function (event) {
        let emailData = $(event.target).val().replace(/;/g, ",");

        //$('#cloudEmpLogonName').val(emailData);

        function isEmailValid(emailData) {
            return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailData);
        };

        // if (emailData != '') {
        //     if (!isEmailValid(emailData)) {
        //         swal('Oops...', 'The email field must be a valid email address, please re-enter your email addres and try again!', 'error');
        //         // $('#cloudEmpEmailAddress').focus();
        //         e.preventDefault();
        //         return false;
        //     }
        // }
    },
    'blur #cloudEmpUserPassword': function (event) {
        let cloudpassword = $(event.target).val().replace(/;/g, ",");
        if (cloudpassword != '') {
            if (cloudpassword.length < 8) {
                swal('Invalid VS1 Password', 'Password must be at least eight characters including one capital letterand one number!', 'error');
                // $('#cloudEmpUserPassword').focus();
                event.preventDefault();
                return false;
            }
        }
    },
    'blur .divcolumn': function (event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

        var datable = $('#tblTransactionlist').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function (event) {
        let range = $(event.target).val();
        // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblTransactionlist th');
        $.each(datable, function (i, v) {

            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .transTab': function (event) {
        let templateObject = Template.instance();
        let employeeName = $('#edtCustomerCompany').val();
        templateObject.getAllProductRecentTransactions(employeeName);
    },
    'click .btnOpenSettings': function (event) {
        let templateObject = Template.instance();
        var columns = $('#tblTransactionlist th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function (i, v) {
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
    'click #exportbtn': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblTransactionlist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .printConfirm': function (event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblTransactionlist_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click .btnRefresh': function () {
        Meteor._reload.reload();
    },
    'click .btnRemoveProduct': function () {
    },
    'click #formCheck-2': function () {
        if ($(event.target).is(':checked')) {
            $('#autoUpdate').css('display', 'none');
        } else {
            $('#autoUpdate').css('display', 'block');
        }
    },
    'click #formCheck-one': function (event) {
        if ($(event.target).is(':checked')) {
            $('.checkbox1div').css('display', 'block');

        } else {
            $('.checkbox1div').css('display', 'none');
        }
    },
    'click #formCheck-two': function (event) {
        if ($(event.target).is(':checked')) {
            $('.checkbox2div').css('display', 'block');

        } else {
            $('.checkbox2div').css('display', 'none');
        }
    },
    'click #formCheck-three': function (event) {
        if ($(event.target).is(':checked')) {
            $('.checkbox3div').css('display', 'block');

        } else {
            $('.checkbox3div').css('display', 'none');
        }
    },
    'click #formCheck-four': function (event) {
        if ($(event.target).is(':checked')) {
            $('.checkbox4div').css('display', 'block');

        } else {
            $('.checkbox4div').css('display', 'none');
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
    'blur .customField3Text': function (event) {
        var inputValue3 = $('.customField3Text').text();
        $('.lblCustomField3').text(inputValue3);
    },
    'blur .customField4Text': function (event) {
        var inputValue4 = $('.customField4Text').text();
        $('.lblCustomField4').text(inputValue4);
    },
    'click .btnSaveSettings': function (event) {
        let templateObject = Template.instance();

        $('.lblCustomField1').html('');
        $('.lblCustomField2').html('');
        $('.lblCustomField3').html('');
        $('.lblCustomField4').html('');
        let getchkcustomField1 = true;
        let getchkcustomField2 = true;
        let getchkcustomField3 = true;
        let getchkcustomField4 = true;
        let getcustomField1 = $('.customField1Text').html();
        let getcustomField2 = $('.customField2Text').html();
        let getcustomField3 = $('.customField3Text').html();
        let getcustomField4 = $('.customField4Text').html();
        if ($('#formCheck-one').is(':checked')) {
            getchkcustomField1 = false;
        }
        if ($('#formCheck-two').is(':checked')) {
            getchkcustomField2 = false;
        }
        if ($('#formCheck-three').is(':checked')) {
            getchkcustomField3 = false;
        }
        if ($('#formCheck-four').is(':checked')) {
            getchkcustomField4 = false;
        }

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
                    PrefName: 'employeescard'
                });
                if (checkPrefDetails) {
                    CloudPreference.update({
                        _id: checkPrefDetails._id
                    }, {
                        $set: {
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'contactform',
                            PrefName: 'employeescard',
                            published: true,
                            customFields: [{
                                    index: '1',
                                    label: getcustomField1,
                                    hidden: getchkcustomField1
                                }, {
                                    index: '2',
                                    label: getcustomField2,
                                    hidden: getchkcustomField2
                                }, {
                                    index: '3',
                                    label: getcustomField3,
                                    hidden: getchkcustomField3
                                }, {
                                    index: '4',
                                    label: getcustomField4,
                                    hidden: getchkcustomField4
                                }
                            ],
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
                        if (err) {
                            $('#customfieldModal').modal('toggle');
                        } else {
                            $('#customfieldModal').modal('toggle');

                        }
                    });
                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'contactform',
                        PrefName: 'employeescard',
                        published: true,
                        customFields: [{
                                index: '1',
                                label: getcustomField1,
                                hidden: getchkcustomField1
                            }, {
                                index: '2',
                                label: getcustomField2,
                                hidden: getchkcustomField2
                            }, {
                                index: '3',
                                label: getcustomField3,
                                hidden: getchkcustomField3
                            }, {
                                index: '4',
                                label: getcustomField4,
                                hidden: getchkcustomField4
                            }
                        ],
                        createdAt: new Date()
                    }, function (err, idTag) {
                        if (err) {
                            $('#customfieldModal').modal('toggle');
                        } else {
                            $('#customfieldModal').modal('toggle');

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
                    PrefName: 'employeescard'
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
    'click #edtPriority': function (event) {
        let templateObject = Template.instance();
        let priorities = templateObject.empPriorities.get().sort((a, b) => a - b);
        let allpriorities = priorities.join(',');
        swal({
            title: 'Enter Sort Order',
            input: 'text',
            inputPlaceholder: 'Please enter sort order',
            text: 'Sort Order in use are: ' + allpriorities
        }).then((result) => {
            if (result.value) {
                $('#edtPriority').focus();
                $('#edtPriority').val(result.value);
            } else if (result.dismiss === 'cancel') {}
        })

        // swal({
        //     title: 'User currently has an Existing Login.',
        //     text: '',
        //     type: 'info',
        //     showCancelButton: false,
        //     confirmButtonText: 'OK'
        // }).then((result) => {
        //     if (result.value) {
        //         $('#cloudEmpEmailAddress').focus();
        //     } else if (result.dismiss === 'cancel') {

        //     }
        // });

    },
    'change #attachment-upload': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUploadTabs(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
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
            utilityService.showUploadedAttachmentTabs(uploadedArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click .attachmentTab': function () {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFiles.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentTabs(uploadedFileArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click .btnUploadFilePicture': function (event) {
        $('#fileInput').trigger('click');
    },
    'change #fileInput': function (event) {
        let templateObject = Template.instance();
        let selectedFile = event.target.files[0];
        let reader = new FileReader();
        $(".Choose_file").text('');
        reader.onload = function (event) {

            $("#uploadImg").prop("disabled", false);
            $("#uploadImg").addClass("on-upload-logo");
            $(".Choose_file").text(selectedFile.name);
            templateObject.imageFileData.set(event.target.result);
        };
        reader.readAsDataURL(selectedFile);
    },
    'click #uploadImg': function (event) {
        //let imageData= (localStorage.getItem("Image"));
        let templateObject = Template.instance();
        let imageData = templateObject.imageFileData.get();
        if (imageData != null && imageData != "") {
            //localStorage.setItem("Image",imageData);
            $('#uploadedImage').attr('src', imageData);
            $('#uploadedImage').attr('width', '50%');
            $('#removeLogo').show();
            $('#changeLogo').show();
        }

    },
    'click #removeLogo': function (event) {
        let templateObject = Template.instance();
        templateObject.imageFileData.set(null);
        let imageData = templateObject.imageFileData.get();
        $('#uploadedImage').attr('src', imageData);
        $('#uploadedImage').attr('width', '50%');
    },
    'click .btnNewEmployee': function (event) {
        // FlowRouter.go('/employeescard');
        window.open('/employeescard', '_self');
    },
    'click .btnView': function (e) {
        var btnView = document.getElementById("btnView");
        var btnHide = document.getElementById("btnHide");

        var displayList = document.getElementById("displayList");
        var displayInfo = document.getElementById("displayInfo");
        if (displayList.style.display === "none") {
            displayList.style.display = "flex";
            $("#displayInfo").removeClass("col-12");
            $("#displayInfo").addClass("col-9");
            btnView.style.display = "none";
            btnHide.style.display = "flex";
        } else {
            displayList.style.display = "none";
            $("#displayInfo").removeClass("col-9");
            $("#displayInfo").addClass("col-12");
            btnView.style.display = "flex";
            btnHide.style.display = "none";
        }
    },
    'click .btnDeleteEmployee': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');

        let templateObject = Template.instance();
        let contactService2 = new ContactService();

        var url = FlowRouter.current().path;
        var getso_id = url.split('?id=');

        let currentId = FlowRouter.current().queryParams;
        var objDetails = '';

        if (!isNaN(currentId.id)) {
            currentEmployee = parseInt(currentId.id);
            objDetails = {
                type: "TEmployeeEx",
                fields: {
                    ID: currentEmployee,
                    Active: false
                }
            };

            contactService2.saveEmployeeEx(objDetails).then(function (objDetails) {
                FlowRouter.go('/employeelist?success=true');
            }).catch(function (err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                    else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            FlowRouter.go('/employeelist?success=true');
        }
        $('#deleteEmployeeModal').modal('toggle');
    },
    'click .scanProdServiceBarcodePOP': function(event) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

        } else {
            Bert.alert('<strong>Please Note:</strong> This function is only available on mobile devices!', 'now-dangerorange');
        }
    },

    'change #leaveCalcMethodSelect': function(e){
        let leaveCalcMethod = $('#leaveCalcMethodSelect').val();
        switch(leaveCalcMethod){
            case 'Manually Recorded Rate':
                $('#hoursLeave').val('');
                $('.handleLeaveTypeOption').addClass('hideelement')
                $('.manuallyRecordedRate').removeClass('hideelement')
            break;
            case 'No Calculation Required':
                $('.handleLeaveTypeOption').addClass('hideelement')
            break;
            case 'Based on Ordinary Earnings':
                $('#hoursAccruedAnnuallyFullTimeEmp').val('');
                $('#hoursFullTimeEmpFortnightlyPay').val('');
                $('.handleLeaveTypeOption').addClass('hideelement')
                $('.basedonOrdinaryEarnings').removeClass('hideelement')
            break;
            default:
                $('#hoursAccruedAnnually').val('');
                $('.handleLeaveTypeOption').addClass('hideelement')
                $('.fixedAmountEachPeriodOption').removeClass('hideelement')
            break;
        }
    },

    'change #onTerminationUnusedBalance': function(e){
        let onTerminationUnusedBalance = $('#onTerminationUnusedBalance').val();
        if( onTerminationUnusedBalance == 'Paid Out' ){
            $('.eftLeaveTypeCont').removeClass('hideelement')
            $("#eftLeaveType").attr('checked', false)
        }else{
            $('.eftLeaveTypeCont').addClass('hideelement')
            $('.superannuationGuaranteeCont').addClass('hideelement')
        }
    },

    'click #eftLeaveType': function(){
        if( $('#eftLeaveType').is(':checked') ){
            $('.superannuationGuaranteeCont').removeClass('hideelement')
            $("#superannuationGuarantee").attr('checked', false)
        }else{
            $('.superannuationGuaranteeCont').addClass('hideelement')
        }
    }
});

Template.employeescard.helpers({
    isCloudTrueERP: function() {
        let checkCloudTrueERP = Session.get('CloudTrueERPModule') || false;
        return checkCloudTrueERP;
    },
    checkForAllowance: function ( EarningRate ) {
        if( EarningRate == "Allowances exempt from tax withholding and super" || EarningRate == "Allowances subject to tax withholding and super" ){
            return true
        }
        return false
    },
    isCloudUserPass: () => {
        return Template.instance().isCloudUserPass.get();
    },
    record: () => {
        return Template.instance().records.get();
    },
    employeePayInfo: () => {
        return Template.instance().employeePayInfos.get();
    },
    employeePaySetting: () => {
        return Template.instance().employeePaySettings.get();
    },
    leaveTypeInfo: () => {
        return Template.instance().leaveTypesDrpDown.get();
    },
    assignLeaveTypeInfo: () => {
        return Template.instance().assignLeaveTypeInfos.get();
    },
    leaveRequestInfo: () => {
        return Template.instance().leaveRequestInfos.get();
    },
    bankAccountList: () => {
        return Template.instance().bankAccList.get();
    },
    payTemplateEarningLines: () => {
        return Template.instance().payTemplateEarningLineInfo.get();
    },
    payTemplateDeductionLines: () => {
        return Template.instance().payTemplateDeductionLineInfo.get();
    },
    payTemplateSuperannuationLines: () => {
        return Template.instance().payTemplateSuperannuationLineInfo.get();
    },
    payTemplateReiumbursementLines: () => {
        return Template.instance().payTemplateReiumbursementLineInfo.get();
    },
    extraUserPrice: () => {
        return addExtraUserPrice || '$35';
    },
    countryList: () => {
        return Template.instance().countryData.get();
    },
    employeerecords: () => {
        return Template.instance().employeerecords.get().sort(function (a, b) {
            if (a.company == 'NA') {
                return 1;
            } else if (b.company == 'NA') {
                return -1;
            }
            return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
        });
    },
    productsdatatable: () => {
        return Template.instance().productsdatatable.get().sort(function (a, b) {
            if (a.productname == 'NA') {
                return 1;
            } else if (b.productname == 'NA') {
                return -1;
            }
            return (a.productname.toUpperCase() > b.productname.toUpperCase()) ? 1 : -1;
        });
    },
     selectedproducts: () => {
        return Template.instance().selectedproducts.get().sort(function (a, b) {
            if (a.productname == 'NA') {
                return 1;
            } else if (b.productname == 'NA') {
                return -1;
            }
            return (a.productname.toUpperCase() > b.productname.toUpperCase()) ? 1 : -1;
        });
    },
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.saledate == 'NA') {
                return 1;
            } else if (b.saledate == 'NA') {
                return -1;
            }
            return (a.saledate.toUpperCase() > b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblSalesOverview'
        });
    },
    currentdate: () => {
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        return begunDate;
    },
    empuserrecord: () => {
        return Template.instance().empuserrecord.get();
    },
    cloudUserDetails: function () {
        if ((Session.get('cloudCurrentLogonName')) && (Session.get('cloudCurrentLogonName') != '')) {
            let userID = '';
            var usertoLoad = CloudUser.find({
                clouddatabaseID: Session.get('mycloudLogonDBID')
            }).forEach(function (doc) {
                if ((doc.cloudUsername == Session.get('cloudCurrentLogonName')) || (doc.cloudUsername == Session.get('cloudCurrentLogonName').toLowerCase())) {
                    userID = doc._id;
                }
            });
            return CloudUser.find({
                _id: userID
            }).fetch();
        }
    },
    preferedPaymentList: () => {
        return Template.instance().preferedPaymentList.get();
    },
    termsList: () => {
        return Template.instance().termsList.get();
    },
    deliveryMethodList: () => {
        return Template.instance().deliveryMethodList.get();
    },
    taxCodeList: () => {
        return Template.instance().taxCodeList.get();
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
    contactCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'employeescard'
        });
    },
    isUserAddition: () => {
        return Template.instance().isUserAddition.get();
    },
    isMobileDevices: () => {
        var isMobile = false; //initiate as false
        // device detection
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
             || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }

        return isMobile;
    },
    includePayroll: () => {
        let isPayroll = Session.get('CloudPayrollModule') || false;
        return isPayroll;
    }
});
