import {
    ContactService
} from "./contact-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CoreService
} from '../js/core-service';
import {
    UtilityService
} from "../utility-service";
import XLSX from 'xlsx';
import {
    SideBarService
} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.customerlistpop.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.custdatatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.selectedFile = new ReactiveVar();
});

Template.customerlistpop.onRendered(function () {
    //$('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let contactService = new ContactService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    var splashArrayCustomerList = new Array();

    const lineCustomerItems = [];
    const dataTableList = [];
    const tableHeaderList = [];

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblCustomerlist', function (error, result) {
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
                    // let columnindex = customcolumn[i].index + 1;
                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });

    templateObject.resetData = function (dataVal) {
        location.reload();
    }

    templateObject.getCustomers = function () {
      var customerpage = 0;
        getVS1Data('TCustomerVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllCustomersDataVS1(initialBaseDataLoad, 0).then(function (data) {
                    addVS1Data('TCustomerVS1', JSON.stringify(data));
                    let lineItems = [];
                    let lineItemObj = {};
                    for (let i = 0; i < data.tcustomervs1.length; i++) {
                        let arBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.ARBalance) || 0.00;
                        let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditBalance) || 0.00;
                        let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.Balance) || 0.00;
                        let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditLimit) || 0.00;
                        let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.SalesOrderBalance) || 0.00;
                        var dataList = {
                            id: data.tcustomervs1[i].fields.ID || '',
                            clientName: data.tcustomervs1[i].fields.ClientName || '',
                            company: data.tcustomervs1[i].fields.Companyname || '',
                            contactname: data.tcustomervs1[i].fields.ContactName || '',
                            phone: data.tcustomervs1[i].fields.Phone || '',
                            arbalance: arBalance || 0.00,
                            creditbalance: creditBalance || 0.00,
                            balance: balance || 0.00,
                            creditlimit: creditLimit || 0.00,
                            salesorderbalance: salesOrderBalance || 0.00,
                            email: data.tcustomervs1[i].fields.Email || '',
                            job: data.tcustomervs1[i].fields.JobName || '',
                            accountno: data.tcustomervs1[i].fields.AccountNo || '',
                            clientno: data.tcustomervs1[i].fields.ClientNo || '',
                            jobtitle: data.tcustomervs1[i].fields.JobTitle || '',
                            notes: data.tcustomervs1[i].fields.Notes || '',
                            state: data.tcustomervs1[i].fields.State || '',
                            country: data.tcustomervs1[i].fields.Country || '',
                            street: data.tcustomervs1[i].fields.Street || ' ',
                            street2: data.tcustomervs1[i].fields.Street2 || ' ',
                            street3: data.tcustomervs1[i].fields.Street3 || ' ',
                            suburb: data.tcustomervs1[i].fields.Suburb || ' ',
                            postcode: data.tcustomervs1[i].fields.Postcode || ' ',
                            clienttype: data.tcustomervs1[i].fields.ClientTypeName || 'Default',
                            discount: data.tcustomervs1[i].fields.Discount || 0
                        };

                        dataTableList.push(dataList);
                        var dataListCustomer = [
                            data.tcustomervs1[i].fields.ClientName || '-',
                            data.tcustomervs1[i].fields.JobName || '',
                            data.tcustomervs1[i].fields.Phone || '',
                            arBalance || 0.00,
                            creditBalance || 0.00,
                            balance || 0.00,
                            creditLimit || 0.00,
                            salesOrderBalance || 0.00,
                            data.tcustomervs1[i].fields.Country || '',
                            data.tcustomervs1[i].fields.State || '',
                            data.tcustomervs1[i].fields.Street2 || '',
                            data.tcustomervs1[i].fields.Street || '',
                            data.tcustomervs1[i].fields.Postcode || '',
                            data.tcustomervs1[i].fields.Email || '',
                            data.tcustomervs1[i].fields.AccountNo || '',
                            data.tcustomervs1[i].fields.ClientNo || '',
                            data.tcustomervs1[i].fields.JobTitle || '',
                            data.tcustomervs1[i].fields.Notes || '',
                            data.tcustomervs1[i].fields.ID || '',
                            data.tcustomervs1[i].fields.ClientTypeName || 'Default',
                            data.tcustomervs1[i].fields.Discount || 0,
                            data.tcustomervs1[i].fields.TermsName || '',
                            data.tcustomervs1[i].fields.FirstName || '',
                            data.tcustomervs1[i].fields.LastName || '',
                            data.tcustomervs1[i].fields.TaxCodeName || 'E',
                            data.tcustomervs1[i].fields.Mobile || ''
                        ];

                        splashArrayCustomerList.push(dataListCustomer);
                        //}
                    }

                    function MakeNegative() {
                        $('td').each(function () {
                            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
                        });
                    };

                    templateObject.custdatatablerecords.set(dataTableList);

                    if (templateObject.custdatatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblCustomerlist', function (error, result) {
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


                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    }

                    //$('.fullScreenSpin').css('display','none');
                    setTimeout(function () {
                        $('#tblCustomerlist').DataTable({
                            data: splashArrayCustomerList,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            columnDefs: [
                                {
                                    className: "colCompany",
                                    "targets": [0]
                                }, {
                                    className: "colJob",
                                    "targets": [1]
                                }, {
                                    className: "colPhone",
                                    "targets": [2]
                                }, {
                                    className: "colARBalance hiddenColumn text-right",
                                    "targets": [3]
                                }, {
                                    className: "colCreditBalance hiddenColumn text-right",
                                    "targets": [4]
                                }, {
                                    className: "colBalance text-right",
                                    "targets": [5]
                                }, {
                                    className: "colCreditLimit hiddenColumn text-right",
                                    "targets": [6]
                                }, {
                                    className: "colSalesOrderBalance text-right",
                                    "targets": [7]
                                }, {
                                    className: "colCountry",
                                    "targets": [8]
                                }, {
                                    className: "colState hiddenColumn",
                                    "targets": [9]
                                }, {
                                    className: "colCity hiddenColumn",
                                    "targets": [10]
                                }, {
                                    className: "colStreetAddress hiddenColumn",
                                    "targets": [11]
                                }, {
                                    className: "colZipCode hiddenColumn",
                                    "targets": [12]
                                }, {
                                    className: "colEmail hiddenColumn",
                                    "targets": [13]
                                }, {
                                    className: "colAccountNo hiddenColumn",
                                    "targets": [14]
                                }, {
                                    className: "colClientNo hiddenColumn",
                                    "targets": [15]
                                }, {
                                    className: "colJobTitle hiddenColumn",
                                    "targets": [16]
                                }, {
                                    className: "colNotes",
                                    "targets": [17]
                                }, {
                                    className: "colID hiddenColumn",
                                    "targets": [18]
                                }, {
                                    className: "colCustomerType hiddenColumn",
                                    "targets": [19]
                                }, {
                                    className: "colCustomerDiscount hiddenColumn",
                                    "targets": [20]
                                }, {
                                    className: "colCustomerTermName hiddenColumn",
                                    "targets": [21]
                                }, {
                                    className: "colCustomerFirstName hiddenColumn",
                                    "targets": [22]
                                }, {
                                    className: "colCustomerLastName hiddenColumn",
                                    "targets": [23]
                                }, {
                                    className: "colCustomerTaxCode hiddenColumn",
                                    "targets": [24]
                                }, {
                                    className: "colMobile hiddenColumn",
                                    "targets": [25]
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
                                $('#tblCustomerlist').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                $('.paginate_button.page-item').removeClass('disabled');
                                $('#tblCustomerlist_ellipsis').addClass('disabled');
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
                                        var splashArrayCustomerListDupp = new Array();
                                        let dataLenght = oSettings._iDisplayLength;
                                        let customerSearch = $('#tblCustomerlist_filter input').val();

                                        sideBarService.getAllCustomersDataVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                                    for (let j = 0; j < dataObjectnew.tcustomervs1.length; j++) {

                                                        let arBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.ARBalance) || 0.00;
                                                        let creditBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.CreditBalance) || 0.00;
                                                        let balance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.Balance) || 0.00;
                                                        let creditLimit = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.CreditLimit) || 0.00;
                                                        let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.SalesOrderBalance) || 0.00;
                                                        var dataList = {
                                                            id: dataObjectnew.tcustomervs1[j].fields.ID || '',
                                                            clientName: dataObjectnew.tcustomervs1[j].fields.ClientName || '',
                                                            company: dataObjectnew.tcustomervs1[j].fields.Companyname || '',
                                                            contactname: dataObjectnew.tcustomervs1[j].fields.ContactName || '',
                                                            phone: dataObjectnew.tcustomervs1[j].fields.Phone || '',
                                                            arbalance: arBalance || 0.00,
                                                            creditbalance: creditBalance || 0.00,
                                                            balance: balance || 0.00,
                                                            creditlimit: creditLimit || 0.00,
                                                            salesorderbalance: salesOrderBalance || 0.00,
                                                            email: dataObjectnew.tcustomervs1[j].fields.Email || '',
                                                            job: dataObjectnew.tcustomervs1[j].fields.JobName || '',
                                                            accountno: dataObjectnew.tcustomervs1[j].fields.AccountNo || '',
                                                            clientno: dataObjectnew.tcustomervs1[j].fields.ClientNo || '',
                                                            jobtitle: dataObjectnew.tcustomervs1[j].fields.JobTitle || '',
                                                            notes: dataObjectnew.tcustomervs1[j].fields.Notes || '',
                                                            state: dataObjectnew.tcustomervs1[j].fields.State || '',
                                                            country: dataObjectnew.tcustomervs1[j].fields.Country || '',
                                                            street: dataObjectnew.tcustomervs1[j].fields.Street || ' ',
                                                            street2: dataObjectnew.tcustomervs1[j].fields.Street2 || ' ',
                                                            street3: dataObjectnew.tcustomervs1[j].fields.Street3 || ' ',
                                                            suburb: dataObjectnew.tcustomervs1[j].fields.Suburb || ' ',
                                                            postcode: dataObjectnew.tcustomervs1[j].fields.Postcode || ' ',
                                                            clienttype: dataObjectnew.tcustomervs1[j].fields.ClientTypeName || 'Default',
                                                            discount: dataObjectnew.tcustomervs1[j].fields.Discount || 0
                                                        };

                                                        dataTableList.push(dataList);
                                                        var dataListCustomerDupp = [
                                                            dataObjectnew.tcustomervs1[j].fields.ClientName || '-',
                                                            dataObjectnew.tcustomervs1[j].fields.JobName || '',
                                                            dataObjectnew.tcustomervs1[j].fields.Phone || '',
                                                            arBalance || 0.00,
                                                            creditBalance || 0.00,
                                                            balance || 0.00,
                                                            creditLimit || 0.00,
                                                            salesOrderBalance || 0.00,
                                                            dataObjectnew.tcustomervs1[j].fields.Country || '',
                                                            dataObjectnew.tcustomervs1[j].fields.State || '',
                                                            dataObjectnew.tcustomervs1[j].fields.Street2 || '',
                                                            dataObjectnew.tcustomervs1[j].fields.Street || '',
                                                            dataObjectnew.tcustomervs1[j].fields.Postcode || '',
                                                            dataObjectnew.tcustomervs1[j].fields.Email || '',
                                                            dataObjectnew.tcustomervs1[j].fields.AccountNo || '',
                                                            dataObjectnew.tcustomervs1[j].fields.ClientNo || '',
                                                            dataObjectnew.tcustomervs1[j].fields.JobTitle || '',
                                                            dataObjectnew.tcustomervs1[j].fields.Notes || '',
                                                            dataObjectnew.tcustomervs1[j].fields.ID || '',
                                                            dataObjectnew.tcustomervs1[j].fields.ClientTypeName || 'Default',
                                                            dataObjectnew.tcustomervs1[j].fields.Discount || 0,
                                                            dataObjectnew.tcustomervs1[j].fields.TermsName || '',
                                                            dataObjectnew.tcustomervs1[j].fields.FirstName || '',
                                                            dataObjectnew.tcustomervs1[j].fields.LastName || ''
                                                        ];

                                                        splashArrayCustomerList.push(dataListCustomerDupp);
                                                        //}
                                                    }

                                                    let uniqueChars = [...new Set(splashArrayCustomerList)];
                                                    var datatable = $('#tblCustomerlist').DataTable();
                                                    datatable.clear();
                                                    datatable.rows.add(uniqueChars);
                                                    datatable.draw(false);
                                                    setTimeout(function () {
                                                      $("#tblCustomerlist").dataTable().fnPageChange('last');
                                                    }, 400);

                                                    $('.fullScreenSpin').css('display', 'none');


                                        }).catch(function (err) {
                                            $('.fullScreenSpin').css('display', 'none');
                                        });

                                    });
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },
                            "fnInitComplete": function () {
                                $("<button class='btn btn-primary btnAddNewCustomer' data-dismiss='modal' data-toggle='modal' data-target='#addCustomerModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblCustomerlist_filter");
                                $("<button class='btn btn-primary btnRefreshCustomer' type='button' id='btnRefreshCustomer' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblCustomerlist_filter");

                            }

                        }).on('page', function () {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.custdatatablerecords.get();
                            templateObject.custdatatablerecords.set(draftRecord);
                        }).on('column-reorder', function () {

                        }).on('length.dt', function (e, settings, len) {
                          //$('.fullScreenSpin').css('display', 'inline-block');
                          let dataLenght = settings._iDisplayLength;
                          splashArrayCustomerList = [];
                          if (dataLenght == -1) {
                            $('.fullScreenSpin').css('display', 'none');
                              //if(settings.fnRecordsDisplay() > 150){
                              //  $('.paginate_button.page-item.next').addClass('disabled');
                              //
                              //}else{
                              // sideBarService.getAllCustomersDataVS1('All', 1).then(function (data) {
                              //     for (let i = 0; i < data.tcustomervs1.length; i++) {
                              //         let arBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.ARBalance) || 0.00;
                              //         let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditBalance) || 0.00;
                              //         let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.Balance) || 0.00;
                              //         let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditLimit) || 0.00;
                              //         let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.SalesOrderBalance) || 0.00;
                              //         var dataList = {
                              //             id: data.tcustomervs1[i].fields.ID || '',
                              //             clientName: data.tcustomervs1[i].fields.ClientName || '',
                              //             company: data.tcustomervs1[i].fields.Companyname || '',
                              //             contactname: data.tcustomervs1[i].fields.ContactName || '',
                              //             phone: data.tcustomervs1[i].fields.Phone || '',
                              //             arbalance: arBalance || 0.00,
                              //             creditbalance: creditBalance || 0.00,
                              //             balance: balance || 0.00,
                              //             creditlimit: creditLimit || 0.00,
                              //             salesorderbalance: salesOrderBalance || 0.00,
                              //             email: data.tcustomervs1[i].fields.Email || '',
                              //             job: data.tcustomervs1[i].fields.JobName || '',
                              //             accountno: data.tcustomervs1[i].fields.AccountNo || '',
                              //             clientno: data.tcustomervs1[i].fields.ClientNo || '',
                              //             jobtitle: data.tcustomervs1[i].fields.JobTitle || '',
                              //             notes: data.tcustomervs1[i].fields.Notes || '',
                              //             state: data.tcustomervs1[i].fields.State || '',
                              //             country: data.tcustomervs1[i].fields.Country || '',
                              //             street: data.tcustomervs1[i].fields.Street || ' ',
                              //             street2: data.tcustomervs1[i].fields.Street2 || ' ',
                              //             street3: data.tcustomervs1[i].fields.Street3 || ' ',
                              //             suburb: data.tcustomervs1[i].fields.Suburb || ' ',
                              //             postcode: data.tcustomervs1[i].fields.Postcode || ' '
                              //         };
                              //
                              //         dataTableList.push(dataList);
                              //         var dataListCustomer = [
                              //             data.tcustomervs1[i].fields.ClientName || '-',
                              //             data.tcustomervs1[i].fields.JobName || '',
                              //             data.tcustomervs1[i].fields.Phone || '',
                              //             arBalance || 0.00,
                              //             creditBalance || 0.00,
                              //             balance || 0.00,
                              //             creditLimit || 0.00,
                              //             salesOrderBalance || 0.00,
                              //             data.tcustomervs1[i].fields.Country || '',
                              //             data.tcustomervs1[i].fields.State || '',
                              //             data.tcustomervs1[i].fields.Street2 || '',
                              //             data.tcustomervs1[i].fields.Street || '',
                              //             data.tcustomervs1[i].fields.Postcode || '',
                              //             data.tcustomervs1[i].fields.Email || '',
                              //             data.tcustomervs1[i].fields.AccountNo || '',
                              //             data.tcustomervs1[i].fields.ClientNo || '',
                              //             data.tcustomervs1[i].fields.JobTitle || '',
                              //             data.tcustomervs1[i].fields.Notes || '',
                              //             data.tcustomervs1[i].fields.ID || '',
                              //             data.tcustomervs1[i].fields.ClientTypeName || 'Default',
                              //             data.tcustomervs1[i].fields.Discount || 0,
                              //             data.tcustomervs1[i].fields.TermsName || '',
                              //             data.tcustomervs1[i].fields.FirstName || '',
                              //             data.tcustomervs1[i].fields.LastName || ''
                              //         ];
                              //
                              //         splashArrayCustomerList.push(dataListCustomer);
                              //
                              //         //}
                              //     }
                              //
                              //     function MakeNegative() {
                              //         $('td').each(function () {
                              //             if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
                              //         });
                              //     };
                              //
                              //     templateObject.custdatatablerecords.set(dataTableList);
                              //     var datatable = $('#tblCustomerlist').DataTable();
                              //     datatable.clear();
                              //     datatable.rows.add(splashArrayCustomerList);
                              //     datatable.draw(false);
                              //
                              //     $('.fullScreenSpin').css('display', 'none');
                              //     $('.dataTables_info').html('Showing 1 to ' + data.tcustomervs1.length + ' of ' + data.tcustomervs1.length + ' entries');
                              //     $('.fullScreenSpin').css('display', 'none');
                              //     // addVS1Data('TCustomerVS1',JSON.stringify(dataNonBo)).then(function (datareturn) {
                              //
                              //     //
                              //     // }).catch(function (err) {
                              //     //
                              //     // });
                              // }).catch(function (err) {
                              //     $('.fullScreenSpin').css('display', 'none');
                              // });
                              //}
                          } else {
                              if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                                  $('.fullScreenSpin').css('display', 'none');
                              } else {
                                  sideBarService.getAllCustomersDataVS1(dataLenght, 0).then(function (dataNonBo) {

                                      addVS1Data('TCustomerVS1', JSON.stringify(dataNonBo)).then(function (datareturn) {
                                          templateObject.resetData(dataNonBo);
                                          $('.fullScreenSpin').css('display', 'none');
                                      }).catch(function (err) {
                                          $('.fullScreenSpin').css('display', 'none');
                                      });
                                  }).catch(function (err) {
                                      $('.fullScreenSpin').css('display', 'none');
                                  });
                              }
                          }
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        });

                        // $('#tblCustomerlist').DataTable().column( 0 ).visible( true );
                        //$('.fullScreenSpin').css('display','none');
                    }, 0);

                    var columns = $('#tblCustomerlist th');
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


                }).catch(function (err) {

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcustomervs1;
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < useData.length; i++) {
                    let arBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.ARBalance) || 0.00;
                    let creditBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.CreditBalance) || 0.00;
                    let balance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.Balance) || 0.00;
                    let creditLimit = utilityService.modifynegativeCurrencyFormat(useData[i].fields.CreditLimit) || 0.00;
                    let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.SalesOrderBalance) || 0.00;
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        clientName: useData[i].fields.ClientName || '',
                        company: useData[i].fields.Companyname || '',
                        contactname: useData[i].fields.ContactName || '',
                        phone: useData[i].fields.Phone || '',
                        arbalance: arBalance || 0.00,
                        creditbalance: creditBalance || 0.00,
                        balance: balance || 0.00,
                        creditlimit: creditLimit || 0.00,
                        salesorderbalance: salesOrderBalance || 0.00,
                        email: useData[i].fields.Email || '',
                        job: useData[i].fields.JobName || '',
                        accountno: useData[i].fields.AccountNo || '',
                        clientno: useData[i].fields.ClientNo || '',
                        jobtitle: useData[i].fields.JobTitle || '',
                        notes: useData[i].fields.Notes || '',
                        state: useData[i].fields.State || '',
                        country: useData[i].fields.Country || '',
                        street: useData[i].fields.Street || ' ',
                        street2: useData[i].fields.Street2 || ' ',
                        street3: useData[i].fields.Street3 || ' ',
                        suburb: useData[i].fields.Suburb || ' ',
                        postcode: useData[i].fields.Postcode || ' ',
                        clienttype: data.tcustomervs1[i].fields.ClientTypeName || 'Default',
                        discount: data.tcustomervs1[i].fields.Discount || 0
                    };

                    dataTableList.push(dataList);

                    var dataListCustomer = [
                        data.tcustomervs1[i].fields.ClientName || '-',
                        data.tcustomervs1[i].fields.JobName || '',
                        data.tcustomervs1[i].fields.Phone || '',
                        arBalance || 0.00,
                        creditBalance || 0.00,
                        balance || 0.00,
                        creditLimit || 0.00,
                        salesOrderBalance || 0.00,
                        data.tcustomervs1[i].fields.Country || '',
                        data.tcustomervs1[i].fields.State || '',
                        data.tcustomervs1[i].fields.Street2 || '',
                        data.tcustomervs1[i].fields.Street || '',
                        data.tcustomervs1[i].fields.Postcode || '',
                        data.tcustomervs1[i].fields.Email || '',
                        data.tcustomervs1[i].fields.AccountNo || '',
                        data.tcustomervs1[i].fields.ClientNo || '',
                        data.tcustomervs1[i].fields.JobTitle || '',
                        data.tcustomervs1[i].fields.Notes || '',
                        data.tcustomervs1[i].fields.ID || '',
                        data.tcustomervs1[i].fields.ClientTypeName || 'Default',
                        data.tcustomervs1[i].fields.Discount || 0,
                        data.tcustomervs1[i].fields.TermsName || '',
                        data.tcustomervs1[i].fields.FirstName || '',
                        data.tcustomervs1[i].fields.LastName || '',
                        data.tcustomervs1[i].fields.TaxCodeName || 'E',
                        data.tcustomervs1[i].fields.Mobile || ''
                    ];

                    splashArrayCustomerList.push(dataListCustomer);
                    //}
                }

                function MakeNegative() {
                    $('td').each(function () {
                        if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
                    });
                };

                templateObject.custdatatablerecords.set(dataTableList);

                if (templateObject.custdatatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblCustomerlist', function (error, result) {
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


                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                //$('.fullScreenSpin').css('display','none');
                setTimeout(function () {
                    $('#tblCustomerlist').DataTable({
                        data: splashArrayCustomerList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        columnDefs: [
                            {
                                className: "colCompany",
                                "targets": [0]
                            }, {
                                className: "colJob",
                                "targets": [1]
                            }, {
                                className: "colPhone",
                                "targets": [2]
                            }, {
                                className: "colARBalance hiddenColumn text-right",
                                "targets": [3]
                            }, {
                                className: "colCreditBalance hiddenColumn text-right",
                                "targets": [4]
                            }, {
                                className: "colBalance text-right",
                                "targets": [5]
                            }, {
                                className: "colCreditLimit hiddenColumn text-right",
                                "targets": [6]
                            }, {
                                className: "colSalesOrderBalance text-right",
                                "targets": [7]
                            }, {
                                className: "colCountry",
                                "targets": [8]
                            }, {
                                className: "colState hiddenColumn",
                                "targets": [9]
                            }, {
                                className: "colCity hiddenColumn",
                                "targets": [10]
                            }, {
                                className: "colStreetAddress hiddenColumn",
                                "targets": [11]
                            }, {
                                className: "colZipCode hiddenColumn",
                                "targets": [12]
                            }, {
                                className: "colEmail hiddenColumn",
                                "targets": [13]
                            }, {
                                className: "colAccountNo hiddenColumn",
                                "targets": [14]
                            }, {
                                className: "colClientNo hiddenColumn",
                                "targets": [15]
                            }, {
                                className: "colJobTitle hiddenColumn",
                                "targets": [16]
                            }, {
                                className: "colNotes",
                                "targets": [17]
                            }, {
                                className: "colID hiddenColumn",
                                "targets": [18]
                            }, {
                                className: "colCustomerType hiddenColumn",
                                "targets": [19]
                            }, {
                                className: "colCustomerDiscount hiddenColumn",
                                "targets": [20]
                            }, {
                                className: "colCustomerTermName hiddenColumn",
                                "targets": [21]
                            }, {
                                className: "colCustomerFirstName hiddenColumn",
                                "targets": [22]
                            }, {
                                className: "colCustomerLastName hiddenColumn",
                                "targets": [23]
                            }, {
                                className: "colCustomerTaxCode hiddenColumn",
                                "targets": [24]
                            }, {
                                className: "colMobile hiddenColumn",
                                "targets": [25]
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
                            $('#tblCustomerlist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            $('.paginate_button.page-item').removeClass('disabled');
                            $('#tblCustomerlist_ellipsis').addClass('disabled');
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
                                    var splashArrayCustomerListDupp = new Array();
                                    let dataLenght = oSettings._iDisplayLength;
                                    let customerSearch = $('#tblCustomerlist_filter input').val();

                                    sideBarService.getAllCustomersDataVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                                for (let j = 0; j < dataObjectnew.tcustomervs1.length; j++) {

                                                    let arBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.ARBalance) || 0.00;
                                                    let creditBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.CreditBalance) || 0.00;
                                                    let balance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.Balance) || 0.00;
                                                    let creditLimit = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.CreditLimit) || 0.00;
                                                    let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.SalesOrderBalance) || 0.00;
                                                    var dataList = {
                                                        id: dataObjectnew.tcustomervs1[j].fields.ID || '',
                                                        clientName: dataObjectnew.tcustomervs1[j].fields.ClientName || '',
                                                        company: dataObjectnew.tcustomervs1[j].fields.Companyname || '',
                                                        contactname: dataObjectnew.tcustomervs1[j].fields.ContactName || '',
                                                        phone: dataObjectnew.tcustomervs1[j].fields.Phone || '',
                                                        arbalance: arBalance || 0.00,
                                                        creditbalance: creditBalance || 0.00,
                                                        balance: balance || 0.00,
                                                        creditlimit: creditLimit || 0.00,
                                                        salesorderbalance: salesOrderBalance || 0.00,
                                                        email: dataObjectnew.tcustomervs1[j].fields.Email || '',
                                                        job: dataObjectnew.tcustomervs1[j].fields.JobName || '',
                                                        accountno: dataObjectnew.tcustomervs1[j].fields.AccountNo || '',
                                                        clientno: dataObjectnew.tcustomervs1[j].fields.ClientNo || '',
                                                        jobtitle: dataObjectnew.tcustomervs1[j].fields.JobTitle || '',
                                                        notes: dataObjectnew.tcustomervs1[j].fields.Notes || '',
                                                        state: dataObjectnew.tcustomervs1[j].fields.State || '',
                                                        country: dataObjectnew.tcustomervs1[j].fields.Country || '',
                                                        street: dataObjectnew.tcustomervs1[j].fields.Street || ' ',
                                                        street2: dataObjectnew.tcustomervs1[j].fields.Street2 || ' ',
                                                        street3: dataObjectnew.tcustomervs1[j].fields.Street3 || ' ',
                                                        suburb: dataObjectnew.tcustomervs1[j].fields.Suburb || ' ',
                                                        postcode: dataObjectnew.tcustomervs1[j].fields.Postcode || ' ',
                                                        clienttype: dataObjectnew.tcustomervs1[j].fields.ClientTypeName || 'Default',
                                                        discount: dataObjectnew.tcustomervs1[j].fields.Discount || 0
                                                    };

                                                    dataTableList.push(dataList);
                                                    var dataListCustomerDupp = [
                                                        dataObjectnew.tcustomervs1[j].fields.ClientName || '-',
                                                        dataObjectnew.tcustomervs1[j].fields.JobName || '',
                                                        dataObjectnew.tcustomervs1[j].fields.Phone || '',
                                                        arBalance || 0.00,
                                                        creditBalance || 0.00,
                                                        balance || 0.00,
                                                        creditLimit || 0.00,
                                                        salesOrderBalance || 0.00,
                                                        dataObjectnew.tcustomervs1[j].fields.Country || '',
                                                        dataObjectnew.tcustomervs1[j].fields.State || '',
                                                        dataObjectnew.tcustomervs1[j].fields.Street2 || '',
                                                        dataObjectnew.tcustomervs1[j].fields.Street || '',
                                                        dataObjectnew.tcustomervs1[j].fields.Postcode || '',
                                                        dataObjectnew.tcustomervs1[j].fields.Email || '',
                                                        dataObjectnew.tcustomervs1[j].fields.AccountNo || '',
                                                        dataObjectnew.tcustomervs1[j].fields.ClientNo || '',
                                                        dataObjectnew.tcustomervs1[j].fields.JobTitle || '',
                                                        dataObjectnew.tcustomervs1[j].fields.Notes || '',
                                                        dataObjectnew.tcustomervs1[j].fields.ID || '',
                                                        dataObjectnew.tcustomervs1[j].fields.ClientTypeName || 'Default',
                                                        dataObjectnew.tcustomervs1[j].fields.Discount || 0,
                                                        dataObjectnew.tcustomervs1[j].fields.TermsName || '',
                                                        dataObjectnew.tcustomervs1[j].fields.FirstName || '',
                                                        dataObjectnew.tcustomervs1[j].fields.LastName || '',
                                                        dataObjectnew.tcustomervs1[j].fields.TaxCodeName || 'E',
                                                        dataObjectnew.tcustomervs1[j].fields.Mobile || ''
                                                    ];

                                                    splashArrayCustomerList.push(dataListCustomerDupp);
                                                    //}
                                                }

                                                let uniqueChars = [...new Set(splashArrayCustomerList)];
                                                var datatable = $('#tblCustomerlist').DataTable();
                                                datatable.clear();
                                                datatable.rows.add(uniqueChars);
                                                datatable.draw(false);
                                                setTimeout(function () {
                                                  $("#tblCustomerlist").dataTable().fnPageChange('last');
                                                }, 400);

                                                $('.fullScreenSpin').css('display', 'none');


                                    }).catch(function (err) {
                                        $('.fullScreenSpin').css('display', 'none');
                                    });

                                });
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function (oSettings) {
                            $("<button class='btn btn-primary btnAddNewCustomer' data-dismiss='modal' data-toggle='modal' data-target='#addCustomerModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblCustomerlist_filter");
                            $("<button class='btn btn-primary btnRefreshCustomer' type='button' id='btnRefreshCustomer' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblCustomerlist_filter");

                            let urlParametersPage = FlowRouter.current().queryParams.page;
                            if (urlParametersPage) {
                                this.fnPageChange('last');
                            }

                        }

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.custdatatablerecords.get();
                        templateObject.custdatatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    }).on('length.dt', function (e, settings, len) {

                        let dataLenght = settings._iDisplayLength;
                        let customerSearch = $('#tblCustomerlist_filter input').val();
                        splashArrayCustomerList = [];
                        if (dataLenght == -1) {
                          if(settings.fnRecordsDisplay() > initialDatatableLoad){

                          }else{
                            if (customerSearch.replace(/\s/g, '') != '') {
                              $('.fullScreenSpin').css('display', 'inline-block');
                              sideBarService.getAllCustomersDataVS1ByName(customerSearch).then(function (data) {
                                  let lineItems = [];
                                  let lineItemObj = {};
                                  if (data.tcustomervs1.length > 0) {
                                      for (let i = 0; i < data.tcustomervs1.length; i++) {
                                          let arBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.ARBalance) || 0.00;
                                          let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditBalance) || 0.00;
                                          let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.Balance) || 0.00;
                                          let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditLimit) || 0.00;
                                          let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.SalesOrderBalance) || 0.00;
                                          var dataList = {
                                              id: data.tcustomervs1[i].fields.ID || '',
                                              clientName: data.tcustomervs1[i].fields.ClientName || '',
                                              company: data.tcustomervs1[i].fields.Companyname || '',
                                              contactname: data.tcustomervs1[i].fields.ContactName || '',
                                              phone: data.tcustomervs1[i].fields.Phone || '',
                                              arbalance: arBalance || 0.00,
                                              creditbalance: creditBalance || 0.00,
                                              balance: balance || 0.00,
                                              creditlimit: creditLimit || 0.00,
                                              salesorderbalance: salesOrderBalance || 0.00,
                                              email: data.tcustomervs1[i].fields.Email || '',
                                              job: data.tcustomervs1[i].fields.JobName || '',
                                              accountno: data.tcustomervs1[i].fields.AccountNo || '',
                                              clientno: data.tcustomervs1[i].fields.ClientNo || '',
                                              jobtitle: data.tcustomervs1[i].fields.JobTitle || '',
                                              notes: data.tcustomervs1[i].fields.Notes || '',
                                              state: data.tcustomervs1[i].fields.State || '',
                                              country: data.tcustomervs1[i].fields.Country || '',
                                              street: data.tcustomervs1[i].fields.Street || ' ',
                                              street2: data.tcustomervs1[i].fields.Street2 || ' ',
                                              street3: data.tcustomervs1[i].fields.Street3 || ' ',
                                              suburb: data.tcustomervs1[i].fields.Suburb || ' ',
                                              postcode: data.tcustomervs1[i].fields.Postcode || ' '
                                          };

                                          dataTableList.push(dataList);
                                          var dataListCustomer = [
                                              data.tcustomervs1[i].fields.ClientName || '-',
                                              data.tcustomervs1[i].fields.JobName || '',
                                              data.tcustomervs1[i].fields.Phone || '',
                                              arBalance || 0.00,
                                              creditBalance || 0.00,
                                              balance || 0.00,
                                              creditLimit || 0.00,
                                              salesOrderBalance || 0.00,
                                              data.tcustomervs1[i].fields.Country || '',
                                              data.tcustomervs1[i].fields.State || '',
                                              data.tcustomervs1[i].fields.Street2 || '',
                                              data.tcustomervs1[i].fields.Street || '',
                                              data.tcustomervs1[i].fields.Postcode || '',
                                              data.tcustomervs1[i].fields.Email || '',
                                              data.tcustomervs1[i].fields.AccountNo || '',
                                              data.tcustomervs1[i].fields.ClientNo || '',
                                              data.tcustomervs1[i].fields.JobTitle || '',
                                              data.tcustomervs1[i].fields.Notes || '',
                                              data.tcustomervs1[i].fields.ID || '',
                                              data.tcustomervs1[i].fields.ClientTypeName || 'Default',
                                              data.tcustomervs1[i].fields.Discount || 0,
                                              data.tcustomervs1[i].fields.TermsName || '',
                                              data.tcustomervs1[i].fields.FirstName || '',
                                              data.tcustomervs1[i].fields.LastName || '',
                                              data.tcustomervs1[i].fields.TaxCodeName || 'E',
                                              data.tcustomervs1[i].fields.Mobile || ''
                                          ];

                                          splashArrayCustomerList.push(dataListCustomer);
                                          //}
                                      }
                                      var datatable = $('#tblCustomerlist').DataTable();
                                      datatable.clear();
                                      datatable.rows.add(splashArrayCustomerList);
                                      datatable.draw(false);

                                      $('.fullScreenSpin').css('display', 'none');
                                  } else {

                                      $('.fullScreenSpin').css('display', 'none');
                                      $('#customerListModal').modal('toggle');
                                      swal({
                                          title: 'Question',
                                          text: "Customer does not exist, would you like to create it?",
                                          type: 'question',
                                          showCancelButton: true,
                                          confirmButtonText: 'Yes',
                                          cancelButtonText: 'No'
                                      }).then((result) => {
                                          if (result.value) {
                                              $('#addCustomerModal').modal('toggle');
                                              $('#edtCustomerCompany').val(dataSearchName);
                                          } else if (result.dismiss === 'cancel') {
                                              $('#customerListModal').modal('toggle');
                                          }
                                      });

                                  }

                              }).catch(function (err) {
                                  $('.fullScreenSpin').css('display', 'none');
                              });
                            }else{
                              $('.fullScreenSpin').css('display', 'none');
                            // sideBarService.getAllCustomersDataVS1('All', 1).then(function (data) {
                            //     for (let i = 0; i < data.tcustomervs1.length; i++) {
                            //         let arBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.ARBalance) || 0.00;
                            //         let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditBalance) || 0.00;
                            //         let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.Balance) || 0.00;
                            //         let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditLimit) || 0.00;
                            //         let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.SalesOrderBalance) || 0.00;
                            //         var dataList = {
                            //             id: data.tcustomervs1[i].fields.ID || '',
                            //             clientName: data.tcustomervs1[i].fields.ClientName || '',
                            //             company: data.tcustomervs1[i].fields.Companyname || '',
                            //             contactname: data.tcustomervs1[i].fields.ContactName || '',
                            //             phone: data.tcustomervs1[i].fields.Phone || '',
                            //             arbalance: arBalance || 0.00,
                            //             creditbalance: creditBalance || 0.00,
                            //             balance: balance || 0.00,
                            //             creditlimit: creditLimit || 0.00,
                            //             salesorderbalance: salesOrderBalance || 0.00,
                            //             email: data.tcustomervs1[i].fields.Email || '',
                            //             job: data.tcustomervs1[i].fields.JobName || '',
                            //             accountno: data.tcustomervs1[i].fields.AccountNo || '',
                            //             clientno: data.tcustomervs1[i].fields.ClientNo || '',
                            //             jobtitle: data.tcustomervs1[i].fields.JobTitle || '',
                            //             notes: data.tcustomervs1[i].fields.Notes || '',
                            //             state: data.tcustomervs1[i].fields.State || '',
                            //             country: data.tcustomervs1[i].fields.Country || '',
                            //             street: data.tcustomervs1[i].fields.Street || ' ',
                            //             street2: data.tcustomervs1[i].fields.Street2 || ' ',
                            //             street3: data.tcustomervs1[i].fields.Street3 || ' ',
                            //             suburb: data.tcustomervs1[i].fields.Suburb || ' ',
                            //             postcode: data.tcustomervs1[i].fields.Postcode || ' '
                            //         };
                            //
                            //         dataTableList.push(dataList);
                            //         var dataListCustomer = [
                            //             data.tcustomervs1[i].fields.ClientName || '-',
                            //             data.tcustomervs1[i].fields.JobName || '',
                            //             data.tcustomervs1[i].fields.Phone || '',
                            //             arBalance || 0.00,
                            //             creditBalance || 0.00,
                            //             balance || 0.00,
                            //             creditLimit || 0.00,
                            //             salesOrderBalance || 0.00,
                            //             data.tcustomervs1[i].fields.Country || '',
                            //             data.tcustomervs1[i].fields.State || '',
                            //             data.tcustomervs1[i].fields.Street2 || '',
                            //             data.tcustomervs1[i].fields.Street || '',
                            //             data.tcustomervs1[i].fields.Postcode || '',
                            //             data.tcustomervs1[i].fields.Email || '',
                            //             data.tcustomervs1[i].fields.AccountNo || '',
                            //             data.tcustomervs1[i].fields.ClientNo || '',
                            //             data.tcustomervs1[i].fields.JobTitle || '',
                            //             data.tcustomervs1[i].fields.Notes || '',
                            //             data.tcustomervs1[i].fields.ID || '',
                            //             data.tcustomervs1[i].fields.ClientTypeName || 'Default',
                            //             data.tcustomervs1[i].fields.Discount || 0,
                            //             data.tcustomervs1[i].fields.TermsName || '',
                            //             data.tcustomervs1[i].fields.FirstName || '',
                            //             data.tcustomervs1[i].fields.LastName || ''
                            //         ];
                            //
                            //         splashArrayCustomerList.push(dataListCustomer);
                            //
                            //         //}
                            //     }
                            //
                            //     function MakeNegative() {
                            //         $('td').each(function () {
                            //             if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
                            //         });
                            //     };
                            //
                            //     templateObject.custdatatablerecords.set(dataTableList);
                            //     var datatable = $('#tblCustomerlist').DataTable();
                            //     datatable.clear();
                            //     datatable.rows.add(splashArrayCustomerList);
                            //     datatable.draw(false);
                            //
                            //     $('.fullScreenSpin').css('display', 'none');
                            //     $('.dataTables_info').html('Showing 1 to ' + data.tcustomervs1.length + ' of ' + data.tcustomervs1.length + ' entries');
                            //     $('.fullScreenSpin').css('display', 'none');
                            //     // addVS1Data('TCustomerVS1',JSON.stringify(dataNonBo)).then(function (datareturn) {
                            //     //   templateObject.resetData(dataNonBo);
                            //     //
                            //     // }).catch(function (err) {
                            //     //
                            //     // });
                            // }).catch(function (err) {
                            //     $('.fullScreenSpin').css('display', 'none');
                            // });
                            }

                          }

                        } else {
                            if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                                $('.fullScreenSpin').css('display', 'none');
                            } else {
                                sideBarService.getAllCustomersDataVS1(dataLenght, 0).then(function (dataNonBo) {

                                    addVS1Data('TCustomerVS1', JSON.stringify(dataNonBo)).then(function (datareturn) {
                                        templateObject.resetData(dataNonBo);
                                        $('.fullScreenSpin').css('display', 'none');
                                    }).catch(function (err) {
                                        $('.fullScreenSpin').css('display', 'none');
                                    });
                                }).catch(function (err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }
                        }
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#tblCustomerlist').DataTable().column( 0 ).visible( true );
                    //$('.fullScreenSpin').css('display','none');
                }, 0);

                var columns = $('#tblCustomerlist th');
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
            }
        }).catch(function (err) {
            sideBarService.getAllCustomersDataVS1(initialBaseDataLoad, 0).then(function (data) {
                addVS1Data('TCustomerVS1', JSON.stringify(data));
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.tcustomervs1.length; i++) {
                    let arBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.ARBalance) || 0.00;
                    let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditBalance) || 0.00;
                    let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.Balance) || 0.00;
                    let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditLimit) || 0.00;
                    let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.SalesOrderBalance) || 0.00;
                    var dataList = {
                        id: data.tcustomervs1[i].fields.ID || '',
                        clientName: data.tcustomervs1[i].fields.ClientName || '',
                        company: data.tcustomervs1[i].fields.Companyname || '',
                        contactname: data.tcustomervs1[i].fields.ContactName || '',
                        phone: data.tcustomervs1[i].fields.Phone || '',
                        arbalance: arBalance || 0.00,
                        creditbalance: creditBalance || 0.00,
                        balance: balance || 0.00,
                        creditlimit: creditLimit || 0.00,
                        salesorderbalance: salesOrderBalance || 0.00,
                        email: data.tcustomervs1[i].fields.Email || '',
                        job: data.tcustomervs1[i].fields.JobName || '',
                        accountno: data.tcustomervs1[i].fields.AccountNo || '',
                        clientno: data.tcustomervs1[i].fields.ClientNo || '',
                        jobtitle: data.tcustomervs1[i].fields.JobTitle || '',
                        notes: data.tcustomervs1[i].fields.Notes || '',
                        country: data.tcustomervs1[i].fields.Country || '',
                        state: data.tcustomervs1[i].fields.State || '',
                        street: data.tcustomervs1[i].fields.Street || ' ',
                        street2: data.tcustomervs1[i].fields.Street2 || ' ',
                        street3: data.tcustomervs1[i].fields.Street3 || ' ',
                        suburb: data.tcustomervs1[i].fields.Suburb || ' ',
                        postcode: data.tcustomervs1[i].fields.Postcode || ' ',
                        clienttype: data.tcustomervs1[i].fields.ClientTypeName || 'Default',
                        discount: data.tcustomervs1[i].fields.Discount || 0
                    };

                    dataTableList.push(dataList);
                    var dataListCustomer = [
                        data.tcustomervs1[i].fields.ClientName || '-',
                        data.tcustomervs1[i].fields.JobName || '',
                        data.tcustomervs1[i].fields.Phone || '',
                        arBalance || 0.00,
                        creditBalance || 0.00,
                        balance || 0.00,
                        creditLimit || 0.00,
                        salesOrderBalance || 0.00,
                        data.tcustomervs1[i].fields.Country || '',
                        data.tcustomervs1[i].fields.State || '',
                        data.tcustomervs1[i].fields.Street2 || '',
                        data.tcustomervs1[i].fields.Street || '',
                        data.tcustomervs1[i].fields.Postcode || '',
                        data.tcustomervs1[i].fields.Email || '',
                        data.tcustomervs1[i].fields.AccountNo || '',
                        data.tcustomervs1[i].fields.ClientNo || '',
                        data.tcustomervs1[i].fields.JobTitle || '',
                        data.tcustomervs1[i].fields.Notes || '',
                        data.tcustomervs1[i].fields.ID || '',
                        data.tcustomervs1[i].fields.ClientTypeName || 'Default',
                        data.tcustomervs1[i].fields.Discount || 0,
                        data.tcustomervs1[i].fields.TermsName || '',
                        data.tcustomervs1[i].fields.FirstName || '',
                        data.tcustomervs1[i].fields.LastName || '',
                        data.tcustomervs1[i].fields.TaxCodeName || 'E',
                        data.tcustomervs1[i].fields.Mobile || ''
                    ];

                    splashArrayCustomerList.push(dataListCustomer);
                    //}
                }

                function MakeNegative() {
                    // TDs = document.getElementsByTagName('td');
                    // for (var i=0; i<TDs.length; i++) {
                    // var temp = TDs[i];
                    // if (temp.firstChild.nodeValue.indexOf('-'+Currency) == 0){
                    // temp.className = "text-danger";
                    // }
                    // }

                    $('td').each(function () {
                        if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
                    });
                };

                templateObject.custdatatablerecords.set(dataTableList);

                if (templateObject.custdatatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblCustomerlist', function (error, result) {
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


                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                //$('.fullScreenSpin').css('display','none');
                setTimeout(function () {
                    $('#tblCustomerlist').DataTable({
                        data: splashArrayCustomerList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        columnDefs: [
                            {
                                className: "colCompany",
                                "targets": [0]
                            }, {
                                className: "colJob",
                                "targets": [1]
                            }, {
                                className: "colPhone",
                                "targets": [2]
                            }, {
                                className: "colARBalance hiddenColumn text-right",
                                "targets": [3]
                            }, {
                                className: "colCreditBalance hiddenColumn text-right",
                                "targets": [4]
                            }, {
                                className: "colBalance text-right",
                                "targets": [5]
                            }, {
                                className: "colCreditLimit hiddenColumn text-right",
                                "targets": [6]
                            }, {
                                className: "colSalesOrderBalance text-right",
                                "targets": [7]
                            }, {
                                className: "colCountry",
                                "targets": [8]
                            }, {
                                className: "colState hiddenColumn",
                                "targets": [9]
                            }, {
                                className: "colCity hiddenColumn",
                                "targets": [10]
                            }, {
                                className: "colStreetAddress hiddenColumn",
                                "targets": [11]
                            }, {
                                className: "colZipCode hiddenColumn",
                                "targets": [12]
                            }, {
                                className: "colEmail hiddenColumn",
                                "targets": [13]
                            }, {
                                className: "colAccountNo hiddenColumn",
                                "targets": [14]
                            }, {
                                className: "colClientNo hiddenColumn",
                                "targets": [15]
                            }, {
                                className: "colJobTitle hiddenColumn",
                                "targets": [16]
                            }, {
                                className: "colNotes",
                                "targets": [17]
                            }, {
                                className: "colID hiddenColumn",
                                "targets": [18]
                            }, {
                                className: "colCustomerType hiddenColumn",
                                "targets": [19]
                            }, {
                                className: "colCustomerDiscount hiddenColumn",
                                "targets": [20]
                            }, {
                                className: "colCustomerTermName hiddenColumn",
                                "targets": [21]
                            }, {
                                className: "colCustomerFirstName hiddenColumn",
                                "targets": [22]
                            }, {
                                className: "colCustomerLastName hiddenColumn",
                                "targets": [23]
                            }, {
                                className: "colCustomerTaxCode hiddenColumn",
                                "targets": [24]
                            }, {
                                className: "colMobile hiddenColumn",
                                "targets": [25]
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
                            $('#tblCustomerlist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            $('.paginate_button.page-item').removeClass('disabled');
                            $('#tblCustomerlist_ellipsis').addClass('disabled');
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
                                    var splashArrayCustomerListDupp = new Array();
                                    let dataLenght = oSettings._iDisplayLength;
                                    let customerSearch = $('#tblCustomerlist_filter input').val();

                                    sideBarService.getAllCustomersDataVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                                for (let j = 0; j < dataObjectnew.tcustomervs1.length; j++) {

                                                    let arBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.ARBalance) || 0.00;
                                                    let creditBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.CreditBalance) || 0.00;
                                                    let balance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.Balance) || 0.00;
                                                    let creditLimit = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.CreditLimit) || 0.00;
                                                    let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.tcustomervs1[j].fields.SalesOrderBalance) || 0.00;
                                                    var dataList = {
                                                        id: dataObjectnew.tcustomervs1[j].fields.ID || '',
                                                        clientName: dataObjectnew.tcustomervs1[j].fields.ClientName || '',
                                                        company: dataObjectnew.tcustomervs1[j].fields.Companyname || '',
                                                        contactname: dataObjectnew.tcustomervs1[j].fields.ContactName || '',
                                                        phone: dataObjectnew.tcustomervs1[j].fields.Phone || '',
                                                        arbalance: arBalance || 0.00,
                                                        creditbalance: creditBalance || 0.00,
                                                        balance: balance || 0.00,
                                                        creditlimit: creditLimit || 0.00,
                                                        salesorderbalance: salesOrderBalance || 0.00,
                                                        email: dataObjectnew.tcustomervs1[j].fields.Email || '',
                                                        job: dataObjectnew.tcustomervs1[j].fields.JobName || '',
                                                        accountno: dataObjectnew.tcustomervs1[j].fields.AccountNo || '',
                                                        clientno: dataObjectnew.tcustomervs1[j].fields.ClientNo || '',
                                                        jobtitle: dataObjectnew.tcustomervs1[j].fields.JobTitle || '',
                                                        notes: dataObjectnew.tcustomervs1[j].fields.Notes || '',
                                                        state: dataObjectnew.tcustomervs1[j].fields.State || '',
                                                        country: dataObjectnew.tcustomervs1[j].fields.Country || '',
                                                        street: dataObjectnew.tcustomervs1[j].fields.Street || ' ',
                                                        street2: dataObjectnew.tcustomervs1[j].fields.Street2 || ' ',
                                                        street3: dataObjectnew.tcustomervs1[j].fields.Street3 || ' ',
                                                        suburb: dataObjectnew.tcustomervs1[j].fields.Suburb || ' ',
                                                        postcode: dataObjectnew.tcustomervs1[j].fields.Postcode || ' ',
                                                        clienttype: dataObjectnew.tcustomervs1[j].fields.ClientTypeName || 'Default',
                                                        discount: dataObjectnew.tcustomervs1[j].fields.Discount || 0
                                                    };

                                                    dataTableList.push(dataList);
                                                    var dataListCustomerDupp = [
                                                        dataObjectnew.tcustomervs1[j].fields.ClientName || '-',
                                                        dataObjectnew.tcustomervs1[j].fields.JobName || '',
                                                        dataObjectnew.tcustomervs1[j].fields.Phone || '',
                                                        arBalance || 0.00,
                                                        creditBalance || 0.00,
                                                        balance || 0.00,
                                                        creditLimit || 0.00,
                                                        salesOrderBalance || 0.00,
                                                        dataObjectnew.tcustomervs1[j].fields.Country || '',
                                                        dataObjectnew.tcustomervs1[j].fields.State || '',
                                                        dataObjectnew.tcustomervs1[j].fields.Street2 || '',
                                                        dataObjectnew.tcustomervs1[j].fields.Street || '',
                                                        dataObjectnew.tcustomervs1[j].fields.Postcode || '',
                                                        dataObjectnew.tcustomervs1[j].fields.Email || '',
                                                        dataObjectnew.tcustomervs1[j].fields.AccountNo || '',
                                                        dataObjectnew.tcustomervs1[j].fields.ClientNo || '',
                                                        dataObjectnew.tcustomervs1[j].fields.JobTitle || '',
                                                        dataObjectnew.tcustomervs1[j].fields.Notes || '',
                                                        dataObjectnew.tcustomervs1[j].fields.ID || '',
                                                        dataObjectnew.tcustomervs1[j].fields.ClientTypeName || 'Default',
                                                        dataObjectnew.tcustomervs1[j].fields.Discount || 0,
                                                        dataObjectnew.tcustomervs1[j].fields.TermsName || '',
                                                        dataObjectnew.tcustomervs1[j].fields.FirstName || '',
                                                        dataObjectnew.tcustomervs1[j].fields.LastName || ''
                                                    ];

                                                    splashArrayCustomerList.push(dataListCustomerDupp);
                                                    //}
                                                }

                                                let uniqueChars = [...new Set(splashArrayCustomerList)];
                                                var datatable = $('#tblCustomerlist').DataTable();
                                                datatable.clear();
                                                datatable.rows.add(uniqueChars);
                                                datatable.draw(false);
                                                setTimeout(function () {
                                                  $("#tblCustomerlist").dataTable().fnPageChange('last');
                                                }, 400);

                                                $('.fullScreenSpin').css('display', 'none');


                                    }).catch(function (err) {
                                        $('.fullScreenSpin').css('display', 'none');
                                    });

                                });
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {

                            $("<button class='btn btn-primary btnAddNewCustomer' data-dismiss='modal' data-toggle='modal' data-target='#addCustomerModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblCustomerlist_filter");
                            $("<button class='btn btn-primary btnRefreshCustomer' type='button' id='btnRefreshCustomer' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblCustomerlist_filter");

                        }

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.custdatatablerecords.get();
                        templateObject.custdatatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    }).on('length.dt', function (e, settings, len) {
                      $('.fullScreenSpin').css('display', 'inline-block');
                      let dataLenght = settings._iDisplayLength;
                      splashArrayCustomerList = [];

                      if (dataLenght == -1) {
                        $('.fullScreenSpin').css('display', 'none');
                          //if(settings.fnRecordsDisplay() > 150){
                          //  $('.paginate_button.page-item.next').addClass('disabled');
                          //
                          //}else{
                          // sideBarService.getAllCustomersDataVS1('All', 1).then(function (data) {
                          //     for (let i = 0; i < data.tcustomervs1.length; i++) {
                          //         let arBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.ARBalance) || 0.00;
                          //         let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditBalance) || 0.00;
                          //         let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.Balance) || 0.00;
                          //         let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditLimit) || 0.00;
                          //         let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.SalesOrderBalance) || 0.00;
                          //         var dataList = {
                          //             id: data.tcustomervs1[i].fields.ID || '',
                          //             clientName: data.tcustomervs1[i].fields.ClientName || '',
                          //             company: data.tcustomervs1[i].fields.Companyname || '',
                          //             contactname: data.tcustomervs1[i].fields.ContactName || '',
                          //             phone: data.tcustomervs1[i].fields.Phone || '',
                          //             arbalance: arBalance || 0.00,
                          //             creditbalance: creditBalance || 0.00,
                          //             balance: balance || 0.00,
                          //             creditlimit: creditLimit || 0.00,
                          //             salesorderbalance: salesOrderBalance || 0.00,
                          //             email: data.tcustomervs1[i].fields.Email || '',
                          //             job: data.tcustomervs1[i].fields.JobName || '',
                          //             accountno: data.tcustomervs1[i].fields.AccountNo || '',
                          //             clientno: data.tcustomervs1[i].fields.ClientNo || '',
                          //             jobtitle: data.tcustomervs1[i].fields.JobTitle || '',
                          //             notes: data.tcustomervs1[i].fields.Notes || '',
                          //             state: data.tcustomervs1[i].fields.State || '',
                          //             country: data.tcustomervs1[i].fields.Country || '',
                          //             street: data.tcustomervs1[i].fields.Street || ' ',
                          //             street2: data.tcustomervs1[i].fields.Street2 || ' ',
                          //             street3: data.tcustomervs1[i].fields.Street3 || ' ',
                          //             suburb: data.tcustomervs1[i].fields.Suburb || ' ',
                          //             postcode: data.tcustomervs1[i].fields.Postcode || ' '
                          //         };
                          //
                          //         dataTableList.push(dataList);
                          //         var dataListCustomer = [
                          //             data.tcustomervs1[i].fields.ClientName || '-',
                          //             data.tcustomervs1[i].fields.JobName || '',
                          //             data.tcustomervs1[i].fields.Phone || '',
                          //             arBalance || 0.00,
                          //             creditBalance || 0.00,
                          //             balance || 0.00,
                          //             creditLimit || 0.00,
                          //             salesOrderBalance || 0.00,
                          //             data.tcustomervs1[i].fields.Country || '',
                          //             data.tcustomervs1[i].fields.State || '',
                          //             data.tcustomervs1[i].fields.Street2 || '',
                          //             data.tcustomervs1[i].fields.Street || '',
                          //             data.tcustomervs1[i].fields.Postcode || '',
                          //             data.tcustomervs1[i].fields.Email || '',
                          //             data.tcustomervs1[i].fields.AccountNo || '',
                          //             data.tcustomervs1[i].fields.ClientNo || '',
                          //             data.tcustomervs1[i].fields.JobTitle || '',
                          //             data.tcustomervs1[i].fields.Notes || '',
                          //             data.tcustomervs1[i].fields.ID || '',
                          //             data.tcustomervs1[i].fields.ClientTypeName || 'Default',
                          //             data.tcustomervs1[i].fields.Discount || 0,
                          //             data.tcustomervs1[i].fields.TermsName || '',
                          //             data.tcustomervs1[i].fields.FirstName || '',
                          //             data.tcustomervs1[i].fields.LastName || ''
                          //         ];
                          //
                          //         splashArrayCustomerList.push(dataListCustomer);
                          //
                          //         //}
                          //     }
                          //
                          //     function MakeNegative() {
                          //         $('td').each(function () {
                          //             if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
                          //         });
                          //     };
                          //
                          //     templateObject.custdatatablerecords.set(dataTableList);
                          //     var datatable = $('#tblCustomerlist').DataTable();
                          //     datatable.clear();
                          //     datatable.rows.add(splashArrayCustomerList);
                          //     datatable.draw(false);
                          //
                          //     $('.fullScreenSpin').css('display', 'none');
                          //     $('.dataTables_info').html('Showing 1 to ' + data.tcustomervs1.length + ' of ' + data.tcustomervs1.length + ' entries');
                          //     $('.fullScreenSpin').css('display', 'none');
                          //     // addVS1Data('TCustomerVS1',JSON.stringify(dataNonBo)).then(function (datareturn) {
                          //     //   templateObject.resetData(dataNonBo);
                          //     //
                          //     // }).catch(function (err) {
                          //     //
                          //     // });
                          // }).catch(function (err) {
                          //     $('.fullScreenSpin').css('display', 'none');
                          // });
                          //}
                      } else {
                          if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                              $('.fullScreenSpin').css('display', 'none');
                          } else {
                              sideBarService.getAllCustomersDataVS1(dataLenght, 0).then(function (dataNonBo) {

                                  addVS1Data('TCustomerVS1', JSON.stringify(dataNonBo)).then(function (datareturn) {
                                      templateObject.resetData(dataNonBo);
                                      $('.fullScreenSpin').css('display', 'none');
                                  }).catch(function (err) {
                                      $('.fullScreenSpin').css('display', 'none');
                                  });
                              }).catch(function (err) {
                                  $('.fullScreenSpin').css('display', 'none');
                              });
                          }
                      }
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#tblCustomerlist').DataTable().column( 0 ).visible( true );
                    //$('.fullScreenSpin').css('display','none');
                }, 0);

                var columns = $('#tblCustomerlist th');
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


            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                //$('.fullScreenSpin').css('display','none');
                // Meteor._reload.reload();
            });
        });


    }

    templateObject.getCustomers();



});


Template.customerlistpop.events({
    'click #btnNewCustomer': function (event) {
        FlowRouter.go('/customerscard');
    },
    'click .btnAddNewCustomer': function (event) {
        setTimeout(function () {
          $('#edtCustomerCompany').focus();
        }, 1000);
    },
    'click .btnCloseCustomerPOPList': function (event) {
        setTimeout(function () {
          $('#tblCustomerlist_filter .form-control-sm').val('');
        }, 1000);
    },
    'click .btnRefreshCustomer': function (event) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        const customerList = [];
        const clientList = [];
        let salesOrderTable;
        var splashArray = new Array();
        var splashArrayCustomerList = new Array();
        const dataTableList = [];
        const tableHeaderList = [];
        let dataSearchName = $('#tblCustomerlist_filter input').val();

        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getAllCustomersDataVS1ByName(dataSearchName).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                if (data.tcustomervs1.length > 0) {
                    for (let i = 0; i < data.tcustomervs1.length; i++) {
                        let arBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.ARBalance) || 0.00;
                        let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditBalance) || 0.00;
                        let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.Balance) || 0.00;
                        let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditLimit) || 0.00;
                        let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.SalesOrderBalance) || 0.00;
                        var dataList = {
                            id: data.tcustomervs1[i].fields.ID || '',
                            clientName: data.tcustomervs1[i].fields.ClientName || '',
                            company: data.tcustomervs1[i].fields.Companyname || '',
                            contactname: data.tcustomervs1[i].fields.ContactName || '',
                            phone: data.tcustomervs1[i].fields.Phone || '',
                            arbalance: arBalance || 0.00,
                            creditbalance: creditBalance || 0.00,
                            balance: balance || 0.00,
                            creditlimit: creditLimit || 0.00,
                            salesorderbalance: salesOrderBalance || 0.00,
                            email: data.tcustomervs1[i].fields.Email || '',
                            job: data.tcustomervs1[i].fields.JobName || '',
                            accountno: data.tcustomervs1[i].fields.AccountNo || '',
                            clientno: data.tcustomervs1[i].fields.ClientNo || '',
                            jobtitle: data.tcustomervs1[i].fields.JobTitle || '',
                            notes: data.tcustomervs1[i].fields.Notes || '',
                            state: data.tcustomervs1[i].fields.State || '',
                            country: data.tcustomervs1[i].fields.Country || '',
                            street: data.tcustomervs1[i].fields.Street || ' ',
                            street2: data.tcustomervs1[i].fields.Street2 || ' ',
                            street3: data.tcustomervs1[i].fields.Street3 || ' ',
                            suburb: data.tcustomervs1[i].fields.Suburb || ' ',
                            postcode: data.tcustomervs1[i].fields.Postcode || ' '
                        };

                        dataTableList.push(dataList);
                        var dataListCustomer = [
                            data.tcustomervs1[i].fields.ClientName || '-',
                            data.tcustomervs1[i].fields.JobName || '',
                            data.tcustomervs1[i].fields.Phone || '',
                            arBalance || 0.00,
                            creditBalance || 0.00,
                            balance || 0.00,
                            creditLimit || 0.00,
                            salesOrderBalance || 0.00,
                            data.tcustomervs1[i].fields.Country || '',
                            data.tcustomervs1[i].fields.State || '',
                            data.tcustomervs1[i].fields.Street2 || '',
                            data.tcustomervs1[i].fields.Street || '',
                            data.tcustomervs1[i].fields.Postcode || '',
                            data.tcustomervs1[i].fields.Email || '',
                            data.tcustomervs1[i].fields.AccountNo || '',
                            data.tcustomervs1[i].fields.ClientNo || '',
                            data.tcustomervs1[i].fields.JobTitle || '',
                            data.tcustomervs1[i].fields.Notes || '',
                            data.tcustomervs1[i].fields.ID || '',
                            data.tcustomervs1[i].fields.ClientTypeName || 'Default',
                            data.tcustomervs1[i].fields.Discount || 0,
                            data.tcustomervs1[i].fields.TermsName || '',
                            data.tcustomervs1[i].fields.FirstName || '',
                            data.tcustomervs1[i].fields.LastName || '',
                            data.tcustomervs1[i].fields.TaxCodeName || 'E',
                            data.tcustomervs1[i].fields.Mobile || ''
                        ];

                        splashArrayCustomerList.push(dataListCustomer);
                        //}
                    }
                    var datatable = $('#tblCustomerlist').DataTable();
                    datatable.clear();
                    datatable.rows.add(splashArrayCustomerList);
                    datatable.draw(false);

                    $('.fullScreenSpin').css('display', 'none');
                } else {

                    $('.fullScreenSpin').css('display', 'none');
                    $('#customerListModal').modal('toggle');
                    swal({
                        title: 'Question',
                        text: "Customer does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            $('#addCustomerModal').modal('toggle');
                            $('#edtCustomerCompany').val(dataSearchName);
                        } else if (result.dismiss === 'cancel') {
                            $('#customerListModal').modal('toggle');
                        }
                    });

                }

            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            sideBarService.getAllCustomersDataVS1(initialBaseDataLoad, 0).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.tcustomervs1.length; i++) {
                    let arBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.ARBalance) || 0.00;
                    let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditBalance) || 0.00;
                    let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.Balance) || 0.00;
                    let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditLimit) || 0.00;
                    let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.SalesOrderBalance) || 0.00;
                    var dataList = {
                        id: data.tcustomervs1[i].fields.ID || '',
                        clientName: data.tcustomervs1[i].fields.ClientName || '',
                        company: data.tcustomervs1[i].fields.Companyname || '',
                        contactname: data.tcustomervs1[i].fields.ContactName || '',
                        phone: data.tcustomervs1[i].fields.Phone || '',
                        arbalance: arBalance || 0.00,
                        creditbalance: creditBalance || 0.00,
                        balance: balance || 0.00,
                        creditlimit: creditLimit || 0.00,
                        salesorderbalance: salesOrderBalance || 0.00,
                        email: data.tcustomervs1[i].fields.Email || '',
                        job: data.tcustomervs1[i].fields.JobName || '',
                        accountno: data.tcustomervs1[i].fields.AccountNo || '',
                        clientno: data.tcustomervs1[i].fields.ClientNo || '',
                        jobtitle: data.tcustomervs1[i].fields.JobTitle || '',
                        notes: data.tcustomervs1[i].fields.Notes || '',
                        state: data.tcustomervs1[i].fields.State || '',
                        country: data.tcustomervs1[i].fields.Country || '',
                        street: data.tcustomervs1[i].fields.Street || ' ',
                        street2: data.tcustomervs1[i].fields.Street2 || ' ',
                        street3: data.tcustomervs1[i].fields.Street3 || ' ',
                        suburb: data.tcustomervs1[i].fields.Suburb || ' ',
                        postcode: data.tcustomervs1[i].fields.Postcode || ' '
                    };

                    dataTableList.push(dataList);
                    var dataListCustomer = [
                        data.tcustomervs1[i].fields.ClientName || '-',
                        data.tcustomervs1[i].fields.JobName || '',
                        data.tcustomervs1[i].fields.Phone || '',
                        arBalance || 0.00,
                        creditBalance || 0.00,
                        balance || 0.00,
                        creditLimit || 0.00,
                        salesOrderBalance || 0.00,
                        data.tcustomervs1[i].fields.Country || '',
                        data.tcustomervs1[i].fields.State || '',
                        data.tcustomervs1[i].fields.Street2 || '',
                        data.tcustomervs1[i].fields.Street || '',
                        data.tcustomervs1[i].fields.Postcode || '',
                        data.tcustomervs1[i].fields.Email || '',
                        data.tcustomervs1[i].fields.AccountNo || '',
                        data.tcustomervs1[i].fields.ClientNo || '',
                        data.tcustomervs1[i].fields.JobTitle || '',
                        data.tcustomervs1[i].fields.Notes || '',
                        data.tcustomervs1[i].fields.ID || '',
                        data.tcustomervs1[i].fields.ClientTypeName || 'Default',
                        data.tcustomervs1[i].fields.Discount || 0,
                        data.tcustomervs1[i].fields.TermsName || '',
                        data.tcustomervs1[i].fields.FirstName || '',
                        data.tcustomervs1[i].fields.LastName || '',
                        data.tcustomervs1[i].fields.TaxCodeName || 'E',
                        data.tcustomervs1[i].fields.Mobile || ''
                    ];

                    splashArrayCustomerList.push(dataListCustomer);

                    // var customerrecordObj = {
                    //     customerid: data.tcustomervs1[i].fields.ID || ' ',
                    //     firstname: data.tcustomervs1[i].fields.FirstName || ' ',
                    //     lastname: data.tcustomervs1[i].fields.LastName || ' ',
                    //     customername: data.tcustomervs1[i].fields.ClientName || ' ',
                    //     customeremail: data.tcustomervs1[i].fields.Email || ' ',
                    //     street: data.tcustomervs1[i].fields.Street || ' ',
                    //     street2: data.tcustomervs1[i].fields.Street2 || ' ',
                    //     street3: data.tcustomervs1[i].fields.Street3 || ' ',
                    //     suburb: data.tcustomervs1[i].fields.Suburb || ' ',
                    //     statecode: data.tcustomervs1[i].fields.State + ' ' + data.tcustomervs1[i].fields.Postcode || ' ',
                    //     country: data.tcustomervs1[i].fields.Country || ' ',
                    //     termsName: datadata.tcustomervs1[i].fields.TermsName || '',
                    //     taxCode: data.tcustomervs1[i].fields.TaxCodeName || '',
                    //     clienttypename: data.tcustomervs1[i].fields.ClientTypeName || 'Default'
                    // };
                    // clientList.push(customerrecordObj);
                    //}
                }
                var datatable = $('#tblCustomerlist').DataTable();
                datatable.clear();
                datatable.rows.add(splashArrayCustomerList);
                datatable.draw(false);

                $('.fullScreenSpin').css('display', 'none');


            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    },
    'keyup #tblCustomerlist_filter input': function (event) {
      if (event.keyCode == 13) {
         $(".btnRefreshCustomer").trigger("click");
      }
    },
    'click .chkDatatable': function (event) {
        var columns = $('#tblCustomerlist th');
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
                    PrefName: 'tblCustomerlist'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function (err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable': function (event) {
        let lineItems = [];
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
                    PrefName: 'tblCustomerlist'
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
                            PrefName: 'tblCustomerlist',
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
                        PrefName: 'tblCustomerlist',
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
    },
    'blur .divcolumn': function (event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#tblCustomerlist').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function (event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblCustomerlist th');
        $.each(datable, function (i, v) {
            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettings': function (event) {
        let templateObject = Template.instance();
        var columns = $('#tblCustomerlist th');

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
    'click .exportbtn': function () {
        //$('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblCustomerlist_wrapper .dt-buttons .btntabletocsv').click();
        //$('.fullScreenSpin').css('display','none');

    },
    'click .exportbtnExcel': function () {
        //$('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblCustomerlist_wrapper .dt-buttons .btntabletoexcel').click();
        //$('.fullScreenSpin').css('display','none');
    },
    'click .printConfirm': function (event) {

        //$('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblCustomerlist_wrapper .dt-buttons .btntabletopdf').click();
        //$('.fullScreenSpin').css('display','none');
    },
    'click .refreshpagelist': function () {
        //$('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        sideBarService.getAllCustomersDataVS1(initialBaseDataLoad, 0).then(function (data) {
            addVS1Data('TCustomerVS1', JSON.stringify(data)).then(function (datareturn) {
                location.reload(true);
            }).catch(function (err) {
                location.reload(true);
            });
        }).catch(function (err) {
            location.reload(true);
        });
    },
    'click .templateDownload': function () {
        let utilityService = new UtilityService();
        let rows = [];
        const filename = 'SampleCustomer' + '.csv';
        rows[0] = ['Company', 'First Name', 'Last Name', 'Phone', 'Mobile', 'Email', 'Skype', 'Street', 'Street2', 'State', 'Post Code', 'Country'];
        rows[1] = ['ABC Company', 'John', 'Smith', '9995551213', '9995551213', 'johnsmith@email.com', 'johnsmith', '123 Main Street', 'Main Street', 'New York', '1234', 'United States'];
        utilityService.exportToCsv(rows, filename, 'csv');
    },
    'click .btnUploadFile': function (event) {
        $('#attachment-upload').val('');
        $('.file-name').text('');
        //$(".btnImport").removeAttr("disabled");
        $('#attachment-upload').trigger('click');

    },
    'click .templateDownloadXLSX': function (e) {

        e.preventDefault(); //stop the browser from following
        window.location.href = 'sample_imports/SampleCustomer.xlsx';
    },
    'change #attachment-upload': function (e) {
        let templateObj = Template.instance();
        var filename = $('#attachment-upload')[0].files[0]['name'];
        var fileExtension = filename.split('.').pop().toLowerCase();
        var validExtensions = ["csv", "txt", "xlsx"];
        var validCSVExtensions = ["csv", "txt"];
        var validExcelExtensions = ["xlsx", "xls"];

        if (validExtensions.indexOf(fileExtension) == -1) {
            // Bert.alert('<strong>formats allowed are : '+ validExtensions.join(', ')+'</strong>!', 'danger');
            swal('Invalid Format', 'formats allowed are :' + validExtensions.join(', '), 'error');
            $('.file-name').text('');
            $(".btnImport").Attr("disabled");
        } else if (validCSVExtensions.indexOf(fileExtension) != -1) {

            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            templateObj.selectedFile.set(selectedFile);
            if ($('.file-name').text() != "") {
                $(".btnImport").removeAttr("disabled");
            } else {
                $(".btnImport").Attr("disabled");
            }
        } else if (fileExtension == 'xlsx') {
            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            var oFileIn;
            var oFile = selectedFile;
            var sFilename = oFile.name;
            // Create A File Reader HTML5
            var reader = new FileReader();

            // Ready The Event For When A File Gets Selected
            reader.onload = function (e) {
                var data = e.target.result;
                data = new Uint8Array(data);
                var workbook = XLSX.read(data, {
                    type: 'array'
                });

                var result = {};
                workbook.SheetNames.forEach(function (sheetName) {
                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        header: 1
                    });
                    var sCSV = XLSX.utils.make_csv(workbook.Sheets[sheetName]);
                    templateObj.selectedFile.set(sCSV);

                    if (roa.length) result[sheetName] = roa;
                });
                // see the result, caution: it works after reader event is done.

            };
            reader.readAsArrayBuffer(oFile);

            if ($('.file-name').text() != "") {
                $(".btnImport").removeAttr("disabled");
            } else {
                $(".btnImport").Attr("disabled");
            }

        }



    },
    'click .btnImport': function () {
        //$('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        let contactService = new ContactService();
        let objDetails;
        Papa.parse(templateObject.selectedFile.get(), {
            complete: function (results) {

                if (results.data.length > 0) {
                    if ((results.data[0][0] == "Company") && (results.data[0][1] == "First Name") &&
                        (results.data[0][2] == "Last Name") && (results.data[0][3] == "Phone") &&
                        (results.data[0][4] == "Mobile") && (results.data[0][5] == "Email") &&
                        (results.data[0][6] == "Skype") && (results.data[0][7] == "Street") &&
                        (results.data[0][8] == "Street2") && (results.data[0][9] == "State") &&
                        (results.data[0][10] == "Post Code") && (results.data[0][11] == "Country")) {

                        let dataLength = results.data.length * 500;
                        setTimeout(function () {
                            // $('#importModal').modal('toggle');
                            Meteor._reload.reload();
                        }, parseInt(dataLength));

                        for (let i = 0; i < results.data.length - 1; i++) {
                            objDetails = {
                                type: "TCustomer",
                                fields: {
                                    ClientName: results.data[i + 1][0],
                                    FirstName: results.data[i + 1][1],
                                    LastName: results.data[i + 1][2],
                                    Phone: results.data[i + 1][3],
                                    Mobile: results.data[i + 1][4],
                                    Email: results.data[i + 1][5],
                                    SkypeName: results.data[i + 1][6],
                                    Street: results.data[i + 1][7],
                                    Street2: results.data[i + 1][8],
                                    State: results.data[i + 1][9],
                                    PostCode: results.data[i + 1][10],
                                    Country: results.data[i + 1][11],

                                    BillStreet: results.data[i + 1][7],
                                    BillStreet2: results.data[i + 1][8],
                                    BillState: results.data[i + 1][9],
                                    BillPostCode: results.data[i + 1][10],
                                    Billcountry: results.data[i + 1][11],
                                    PublishOnVS1: true
                                }
                            };
                            if (results.data[i + 1][1]) {
                                if (results.data[i + 1][1] !== "") {
                                    contactService.saveCustomer(objDetails).then(function (data) {
                                        ////$('.fullScreenSpin').css('display','none');
                                        //Meteor._reload.reload();
                                    }).catch(function (err) {
                                        ////$('.fullScreenSpin').css('display','none');
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
                                }
                            }
                        }

                    } else {
                        //$('.fullScreenSpin').css('display','none');
                        // Bert.alert('<strong> Data Mapping fields invalid. </strong> Please check that you are importing the correct file with the correct column headers.', 'danger');
                        swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                    }
                } else {
                    //$('.fullScreenSpin').css('display','none');
                    // Bert.alert('<strong> Data Mapping fields invalid. </strong> Please check that you are importing the correct file with the correct column headers.', 'danger');
                    swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                }

            }
        });
    }

});

Template.customerlistpop.helpers({
    custdatatablerecords: () => {
        return Template.instance().custdatatablerecords.get().sort(function (a, b) {
            if (a.company == 'NA') {
                return 1;
            } else if (b.company == 'NA') {
                return -1;
            }
            return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblCustomerlist'
        });
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
