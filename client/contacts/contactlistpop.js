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
Template.contactlistpop.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.custdatatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.selectedFile = new ReactiveVar();
});

Template.contactlistpop.onRendered(function () {
    //$('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let contactService = new ContactService();
    const contactList = [];
    let salesOrderTable;
    var splashArray = new Array();
    var splashArrayContactList = new Array();

    const lineCustomerItems = [];
    const dataTableList = [];
    const tableHeaderList = [];

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblContactlist', function (error, result) {
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

    templateObject.getContacts = function () {
      var customerpage = 0;
        getVS1Data('TERPCombinedContactsVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getAllContactCombineVS1(initialBaseDataLoad, 0).then(function (data) {
                    addVS1Data('TERPCombinedContactsVS1', JSON.stringify(data));
                    let lineItems = [];
                    let lineItemObj = {};
                    let clienttype = '';
                    let isprospect = false;
                    let iscustomer = false;
                    let isEmployee = false;
                    let issupplier = false;
                    for (let i = 0; i < data.terpcombinedcontactsvs1.length; i++) {

                            isprospect = data.terpcombinedcontactsvs1[i].isprospect;
                            iscustomer = data.terpcombinedcontactsvs1[i].iscustomer;
                            isEmployee = data.terpcombinedcontactsvs1[i].isEmployee;
                            issupplier = data.terpcombinedcontactsvs1[i].issupplier;

                            if((isprospect == true) && (iscustomer == true) && (isEmployee == true) && (issupplier == true)){
                                clienttype = "Customer / Employee / Prospect / Supplier";
                            }else if((isprospect == true) && (iscustomer ==true) && (issupplier ==true)){
                                clienttype = "Customer / Prospect / Supplier";
                            }else if((iscustomer ==true) && (issupplier ==true)){
                                clienttype = "Customer / Supplier";
                            }else if((iscustomer ==true)){

                                if (data.terpcombinedcontactsvs1[i].name.toLowerCase().indexOf("^") >= 0){
                                    clienttype = "Job";
                                }else{
                                    clienttype = "Customer";
                                }
                                // clienttype = "Customer";
                            }else if((isEmployee ==true)){
                                clienttype = "Employee";
                            }else if((issupplier ==true)){
                                clienttype = "Supplier";
                            }else if((isprospect ==true)){
                                clienttype = "Prospect";
                            }else{
                                clienttype = " ";
                            }

                                let arBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].ARBalance)|| 0.00;
                                let creditBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditBalance) || 0.00;
                                let balance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].Balance)|| 0.00;
                                let creditLimit = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditLimit)|| 0.00;
                                let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].SalesOrderBalance)|| 0.00;
                                if (isNaN(data.terpcombinedcontactsvs1[i].ARBalance)) {
                                    arBalance = Currency + "0.00";
                                }

                                if (isNaN(data.terpcombinedcontactsvs1[i].CreditBalance)) {
                                    creditBalance = Currency + "0.00";
                                }
                                if (isNaN(data.terpcombinedcontactsvs1[i].Balance)) {
                                    balance = Currency + "0.00";
                                }
                                if (isNaN(data.terpcombinedcontactsvs1[i].CreditLimit)) {
                                    creditLimit = Currency + "0.00";
                                }

                                if (isNaN(data.terpcombinedcontactsvs1[i].SalesOrderBalance)) {
                                    salesOrderBalance = Currency + "0.00";
                                }


                        var dataListContact = [
                            '<div class="custom-control custom-checkbox chkBox chkBoxContact pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.terpcombinedcontactsvs1[i].ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.terpcombinedcontactsvs1[i].ID+'"></label></div>',
                            data.terpcombinedcontactsvs1[i].name || '-',
                            clienttype || '',
                            data.terpcombinedcontactsvs1[i].Phone || '',
                            data.terpcombinedcontactsvs1[i].mobile || '',
                            arBalance || 0.00,
                            creditBalance || 0.00,
                            balance || 0.00,
                            creditLimit || 0.00,
                            salesOrderBalance || 0.00,
                            data.terpcombinedcontactsvs1[i].email || '',
                            data.terpcombinedcontactsvs1[i].CUSTFLD1 || '',
                            data.terpcombinedcontactsvs1[i].CUSTFLD2 || '',
                            data.terpcombinedcontactsvs1[i].street || '',
                            data.terpcombinedcontactsvs1[i].ID || ''

                        ];
                        splashArrayContactList.push(dataListContact);
                        //}
                    }

                    function MakeNegative() {
                        $('td').each(function () {
                            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
                        });
                    };

                    templateObject.custdatatablerecords.set(dataTableList);

                    if (templateObject.custdatatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblContactlist', function (error, result) {
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

                    setTimeout(function () {
                        $('#tblContactlist').DataTable({
                            data: splashArrayContactList,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            columnDefs: [
                                {
                                    className: "chkBox pointer",
                                    "orderable": false,
                                    "targets": [0]

                                },
                                {
                                    className: "colClientName",
                                    "targets": [1]
                                }, {
                                    className: "colType",
                                    "targets": [2]
                                }, {
                                    className: "colPhone",
                                    "targets": [3]
                                }, {
                                    className: "colMobile hiddenColumn",
                                    "targets": [4]
                                }, {
                                    className: "colARBalance text-right",
                                    "targets": [5]
                                }, {
                                    className: "colCreditBalance text-right",
                                    "targets": [6]
                                }, {
                                    className: "colBalance text-right",
                                    "targets": [7]
                                }, {
                                    className: "colCreditLimit text-right",
                                    "targets": [8]
                                }, {
                                    className: "colSalesOrderBalance text-right",
                                    "targets": [9]
                                }, {
                                    className: "colEmail text-right",
                                    "targets": [10]
                                }, {
                                    className: "colCustFld1 hiddenColumn",
                                    "targets": [11]
                                }, {
                                    className: "colCustFld2 hiddenColumn",
                                    "targets": [12]
                                }, {
                                    className: "colAddress",
                                    "targets": [13]
                                }, {
                                    className: "colID hiddenColumn",
                                    "targets": [14]
                                }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [[1, "asc"]],
                            action: function () {
                                $('#tblContactlist').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                $('.paginate_button.page-item').removeClass('disabled');
                                $('#tblContactlist_ellipsis').addClass('disabled');
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
                                        var splashArrayContactListDupp = new Array();
                                        let dataLenght = oSettings._iDisplayLength;
                                        let customerSearch = $('#tblContactlist_filter input').val();

                                        sideBarService.getAllContactCombineVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                                    for (let j = 0; j < dataObjectnew.terpcombinedcontactsvs1.length; j++) {

                                                      isprospect = dataObjectnew.terpcombinedcontactsvs1[j].isprospect;
                                                      iscustomer = dataObjectnew.terpcombinedcontactsvs1[j].iscustomer;
                                                      isEmployee = dataObjectnew.terpcombinedcontactsvs1[j].isEmployee;
                                                      issupplier = dataObjectnew.terpcombinedcontactsvs1[j].issupplier;

                                                      if((isprospect == true) && (iscustomer == true) && (isEmployee == true) && (issupplier == true)){
                                                          clienttype = "Customer / Employee / Prospect / Supplier";
                                                      }else if((isprospect == true) && (iscustomer ==true) && (issupplier ==true)){
                                                          clienttype = "Customer / Prospect / Supplier";
                                                      }else if((iscustomer ==true) && (issupplier ==true)){
                                                          clienttype = "Customer / Supplier";
                                                      }else if((iscustomer ==true)){

                                                          if (dataObjectnew.terpcombinedcontactsvs1[j].name.toLowerCase().indexOf("^") >= 0){
                                                              clienttype = "Job";
                                                          }else{
                                                              clienttype = "Customer";
                                                          }
                                                      }else if((isEmployee ==true)){
                                                          clienttype = "Employee";
                                                      }else if((issupplier ==true)){
                                                          clienttype = "Supplier";
                                                      }else if((isprospect ==true)){
                                                          clienttype = "Prospect";
                                                      }else{
                                                          clienttype = " ";
                                                      }

                                                          let arBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].ARBalance)|| 0.00;
                                                          let creditBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].CreditBalance) || 0.00;
                                                          let balance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].Balance)|| 0.00;
                                                          let creditLimit = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].CreditLimit)|| 0.00;
                                                          let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].SalesOrderBalance)|| 0.00;
                                                          if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].ARBalance)) {
                                                              arBalance = Currency + "0.00";
                                                          }

                                                          if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].CreditBalance)) {
                                                              creditBalance = Currency + "0.00";
                                                          }
                                                          if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].Balance)) {
                                                              balance = Currency + "0.00";
                                                          }
                                                          if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].CreditLimit)) {
                                                              creditLimit = Currency + "0.00";
                                                          }

                                                          if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].SalesOrderBalance)) {
                                                              salesOrderBalance = Currency + "0.00";
                                                          }


                                                        var dataListContactDupp = [
                                                          '<div class="custom-control custom-checkbox chkBox chkBoxContact pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+dataObjectnew.terpcombinedcontactsvs1[j].ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+dataObjectnew.terpcombinedcontactsvs1[j].ID+'"></label></div>',
                                                          dataObjectnew.terpcombinedcontactsvs1[j].name || '-',
                                                          clienttype || '',
                                                          dataObjectnew.terpcombinedcontactsvs1[j].Phone || '',
                                                          dataObjectnew.terpcombinedcontactsvs1[j].mobile || '',
                                                          arBalance || 0.00,
                                                          creditBalance || 0.00,
                                                          balance || 0.00,
                                                          creditLimit || 0.00,
                                                          salesOrderBalance || 0.00,
                                                          dataObjectnew.terpcombinedcontactsvs1[j].email || '',
                                                          dataObjectnew.terpcombinedcontactsvs1[j].CUSTFLD1 || '',
                                                          dataObjectnew.terpcombinedcontactsvs1[j].CUSTFLD2 || '',
                                                          dataObjectnew.terpcombinedcontactsvs1[j].street || '',
                                                          dataObjectnew.terpcombinedcontactsvs1[j].ID || ''
                                                        ];

                                                        splashArrayContactList.push(dataListContactDupp);
                                                        //}
                                                    }

                                                    let uniqueChars = [...new Set(splashArrayContactList)];
                                                    var datatable = $('#tblContactlist').DataTable();
                                                    datatable.clear();
                                                    datatable.rows.add(uniqueChars);
                                                    datatable.draw(false);
                                                    setTimeout(function () {
                                                      $("#tblContactlist").dataTable().fnPageChange('last');
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
                                $("<button class='btn btn-primary btnAddNewCustomer' data-dismiss='modal' data-toggle='modal' data-target='#addCustomerModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblContactlist_filter");
                                $("<button class='btn btn-primary btnRefreshContact' type='button' id='btnRefreshContact' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblContactlist_filter");

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
                          $('.fullScreenSpin').css('display', 'inline-block');
                          let dataLenght = settings._iDisplayLength;
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
                    }, 0);

                    var columns = $('#tblContactlist th');
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
                let useData = data.terpcombinedcontactsvs1;
                let lineItems = [];
                let lineItemObj = {};
                let clienttype = '';
                let isprospect = false;
                let iscustomer = false;
                let isEmployee = false;
                let issupplier = false;
                for (let i = 0; i < data.terpcombinedcontactsvs1.length; i++) {

                        isprospect = data.terpcombinedcontactsvs1[i].isprospect;
                        iscustomer = data.terpcombinedcontactsvs1[i].iscustomer;
                        isEmployee = data.terpcombinedcontactsvs1[i].isEmployee;
                        issupplier = data.terpcombinedcontactsvs1[i].issupplier;

                        if((isprospect == true) && (iscustomer == true) && (isEmployee == true) && (issupplier == true)){
                            clienttype = "Customer / Employee / Prospect / Supplier";
                        }else if((isprospect == true) && (iscustomer ==true) && (issupplier ==true)){
                            clienttype = "Customer / Prospect / Supplier";
                        }else if((iscustomer ==true) && (issupplier ==true)){
                            clienttype = "Customer / Supplier";
                        }else if((iscustomer ==true)){

                            if (data.terpcombinedcontactsvs1[i].name.toLowerCase().indexOf("^") >= 0){
                                clienttype = "Job";
                            }else{
                                clienttype = "Customer";
                            }
                            // clienttype = "Customer";
                        }else if((isEmployee ==true)){
                            clienttype = "Employee";
                        }else if((issupplier ==true)){
                            clienttype = "Supplier";
                        }else if((isprospect ==true)){
                            clienttype = "Prospect";
                        }else{
                            clienttype = " ";
                        }

                            let arBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].ARBalance)|| 0.00;
                            let creditBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditBalance) || 0.00;
                            let balance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].Balance)|| 0.00;
                            let creditLimit = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditLimit)|| 0.00;
                            let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].SalesOrderBalance)|| 0.00;
                            if (isNaN(data.terpcombinedcontactsvs1[i].ARBalance)) {
                                arBalance = Currency + "0.00";
                            }

                            if (isNaN(data.terpcombinedcontactsvs1[i].CreditBalance)) {
                                creditBalance = Currency + "0.00";
                            }
                            if (isNaN(data.terpcombinedcontactsvs1[i].Balance)) {
                                balance = Currency + "0.00";
                            }
                            if (isNaN(data.terpcombinedcontactsvs1[i].CreditLimit)) {
                                creditLimit = Currency + "0.00";
                            }

                            if (isNaN(data.terpcombinedcontactsvs1[i].SalesOrderBalance)) {
                                salesOrderBalance = Currency + "0.00";
                            }


                    var dataListContact = [
                        '<div class="custom-control custom-checkbox chkBox chkBoxContact pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.terpcombinedcontactsvs1[i].ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.terpcombinedcontactsvs1[i].ID+'"></label></div>',
                        data.terpcombinedcontactsvs1[i].name || '-',
                        clienttype || '',
                        data.terpcombinedcontactsvs1[i].Phone || '',
                        data.terpcombinedcontactsvs1[i].mobile || '',
                        arBalance || 0.00,
                        creditBalance || 0.00,
                        balance || 0.00,
                        creditLimit || 0.00,
                        salesOrderBalance || 0.00,
                        data.terpcombinedcontactsvs1[i].email || '',
                        data.terpcombinedcontactsvs1[i].CUSTFLD1 || '',
                        data.terpcombinedcontactsvs1[i].CUSTFLD2 || '',
                        data.terpcombinedcontactsvs1[i].street || '',
                        data.terpcombinedcontactsvs1[i].ID || ''

                    ];
                    splashArrayContactList.push(dataListContact);
                    //}
                }

                function MakeNegative() {
                    $('td').each(function () {
                        if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
                    });
                };

                templateObject.custdatatablerecords.set(dataTableList);

                if (templateObject.custdatatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblContactlist', function (error, result) {
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

                setTimeout(function () {
                    $('#tblContactlist').DataTable({
                        data: splashArrayContactList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        columnDefs: [
                            {
                                className: "chkBox pointer",
                                "orderable": false,
                                "targets": [0]

                            },
                            {
                                className: "colClientName",
                                "targets": [1]
                            }, {
                                className: "colType",
                                "targets": [2]
                            }, {
                                className: "colPhone",
                                "targets": [3]
                            }, {
                                className: "colMobile hiddenColumn",
                                "targets": [4]
                            }, {
                                className: "colARBalance text-right",
                                "targets": [5]
                            }, {
                                className: "colCreditBalance text-right",
                                "targets": [6]
                            }, {
                                className: "colBalance text-right",
                                "targets": [7]
                            }, {
                                className: "colCreditLimit text-right",
                                "targets": [8]
                            }, {
                                className: "colSalesOrderBalance text-right",
                                "targets": [9]
                            }, {
                                className: "colEmail text-right",
                                "targets": [10]
                            }, {
                                className: "colCustFld1 hiddenColumn",
                                "targets": [11]
                            }, {
                                className: "colCustFld2 hiddenColumn",
                                "targets": [12]
                            }, {
                                className: "colAddress",
                                "targets": [13]
                            }, {
                                className: "colID hiddenColumn",
                                "targets": [14]
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[1, "asc"]],
                        action: function () {
                            $('#tblContactlist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            $('.paginate_button.page-item').removeClass('disabled');
                            $('#tblContactlist_ellipsis').addClass('disabled');
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
                                    var splashArrayContactListDupp = new Array();
                                    let dataLenght = oSettings._iDisplayLength;
                                    let customerSearch = $('#tblContactlist_filter input').val();

                                    sideBarService.getAllContactCombineVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                                for (let j = 0; j < dataObjectnew.terpcombinedcontactsvs1.length; j++) {

                                                  isprospect = dataObjectnew.terpcombinedcontactsvs1[j].isprospect;
                                                  iscustomer = dataObjectnew.terpcombinedcontactsvs1[j].iscustomer;
                                                  isEmployee = dataObjectnew.terpcombinedcontactsvs1[j].isEmployee;
                                                  issupplier = dataObjectnew.terpcombinedcontactsvs1[j].issupplier;

                                                  if((isprospect == true) && (iscustomer == true) && (isEmployee == true) && (issupplier == true)){
                                                      clienttype = "Customer / Employee / Prospect / Supplier";
                                                  }else if((isprospect == true) && (iscustomer ==true) && (issupplier ==true)){
                                                      clienttype = "Customer / Prospect / Supplier";
                                                  }else if((iscustomer ==true) && (issupplier ==true)){
                                                      clienttype = "Customer / Supplier";
                                                  }else if((iscustomer ==true)){

                                                      if (dataObjectnew.terpcombinedcontactsvs1[j].name.toLowerCase().indexOf("^") >= 0){
                                                          clienttype = "Job";
                                                      }else{
                                                          clienttype = "Customer";
                                                      }
                                                  }else if((isEmployee ==true)){
                                                      clienttype = "Employee";
                                                  }else if((issupplier ==true)){
                                                      clienttype = "Supplier";
                                                  }else if((isprospect ==true)){
                                                      clienttype = "Prospect";
                                                  }else{
                                                      clienttype = " ";
                                                  }

                                                      let arBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].ARBalance)|| 0.00;
                                                      let creditBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].CreditBalance) || 0.00;
                                                      let balance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].Balance)|| 0.00;
                                                      let creditLimit = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].CreditLimit)|| 0.00;
                                                      let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].SalesOrderBalance)|| 0.00;
                                                      if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].ARBalance)) {
                                                          arBalance = Currency + "0.00";
                                                      }

                                                      if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].CreditBalance)) {
                                                          creditBalance = Currency + "0.00";
                                                      }
                                                      if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].Balance)) {
                                                          balance = Currency + "0.00";
                                                      }
                                                      if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].CreditLimit)) {
                                                          creditLimit = Currency + "0.00";
                                                      }

                                                      if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].SalesOrderBalance)) {
                                                          salesOrderBalance = Currency + "0.00";
                                                      }


                                                    var dataListContactDupp = [
                                                      '<div class="custom-control custom-checkbox chkBox chkBoxContact pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+dataObjectnew.terpcombinedcontactsvs1[j].ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+dataObjectnew.terpcombinedcontactsvs1[j].ID+'"></label></div>',
                                                      dataObjectnew.terpcombinedcontactsvs1[j].name || '-',
                                                      clienttype || '',
                                                      dataObjectnew.terpcombinedcontactsvs1[j].Phone || '',
                                                      dataObjectnew.terpcombinedcontactsvs1[j].mobile || '',
                                                      arBalance || 0.00,
                                                      creditBalance || 0.00,
                                                      balance || 0.00,
                                                      creditLimit || 0.00,
                                                      salesOrderBalance || 0.00,
                                                      dataObjectnew.terpcombinedcontactsvs1[j].email || '',
                                                      dataObjectnew.terpcombinedcontactsvs1[j].CUSTFLD1 || '',
                                                      dataObjectnew.terpcombinedcontactsvs1[j].CUSTFLD2 || '',
                                                      dataObjectnew.terpcombinedcontactsvs1[j].street || '',
                                                      dataObjectnew.terpcombinedcontactsvs1[j].ID || ''
                                                    ];

                                                    splashArrayContactList.push(dataListContactDupp);
                                                    //}
                                                }

                                                let uniqueChars = [...new Set(splashArrayContactList)];
                                                var datatable = $('#tblContactlist').DataTable();
                                                datatable.clear();
                                                datatable.rows.add(uniqueChars);
                                                datatable.draw(false);
                                                setTimeout(function () {
                                                  $("#tblContactlist").dataTable().fnPageChange('last');
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
                            $("<button class='btn btn-primary btnAddNewCustomer' data-dismiss='modal' data-toggle='modal' data-target='#addCustomerModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblContactlist_filter");
                            $("<button class='btn btn-primary btnRefreshContact' type='button' id='btnRefreshContact' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblContactlist_filter");

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
                      $('.fullScreenSpin').css('display', 'inline-block');
                      let dataLenght = settings._iDisplayLength;
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
                }, 0);

                var columns = $('#tblContactlist th');
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
            sideBarService.getAllContactCombineVS1(initialBaseDataLoad, 0).then(function (data) {
                addVS1Data('TERPCombinedContactsVS1', JSON.stringify(data));

                let lineItems = [];
                let lineItemObj = {};
                let clienttype = '';
                let isprospect = false;
                let iscustomer = false;
                let isEmployee = false;
                let issupplier = false;
                for (let i = 0; i < data.terpcombinedcontactsvs1.length; i++) {

                        isprospect = data.terpcombinedcontactsvs1[i].isprospect;
                        iscustomer = data.terpcombinedcontactsvs1[i].iscustomer;
                        isEmployee = data.terpcombinedcontactsvs1[i].isEmployee;
                        issupplier = data.terpcombinedcontactsvs1[i].issupplier;

                        if((isprospect == true) && (iscustomer == true) && (isEmployee == true) && (issupplier == true)){
                            clienttype = "Customer / Employee / Prospect / Supplier";
                        }else if((isprospect == true) && (iscustomer ==true) && (issupplier ==true)){
                            clienttype = "Customer / Prospect / Supplier";
                        }else if((iscustomer ==true) && (issupplier ==true)){
                            clienttype = "Customer / Supplier";
                        }else if((iscustomer ==true)){

                            if (data.terpcombinedcontactsvs1[i].name.toLowerCase().indexOf("^") >= 0){
                                clienttype = "Job";
                            }else{
                                clienttype = "Customer";
                            }
                            // clienttype = "Customer";
                        }else if((isEmployee ==true)){
                            clienttype = "Employee";
                        }else if((issupplier ==true)){
                            clienttype = "Supplier";
                        }else if((isprospect ==true)){
                            clienttype = "Prospect";
                        }else{
                            clienttype = " ";
                        }

                            let arBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].ARBalance)|| 0.00;
                            let creditBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditBalance) || 0.00;
                            let balance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].Balance)|| 0.00;
                            let creditLimit = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditLimit)|| 0.00;
                            let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].SalesOrderBalance)|| 0.00;
                            if (isNaN(data.terpcombinedcontactsvs1[i].ARBalance)) {
                                arBalance = Currency + "0.00";
                            }

                            if (isNaN(data.terpcombinedcontactsvs1[i].CreditBalance)) {
                                creditBalance = Currency + "0.00";
                            }
                            if (isNaN(data.terpcombinedcontactsvs1[i].Balance)) {
                                balance = Currency + "0.00";
                            }
                            if (isNaN(data.terpcombinedcontactsvs1[i].CreditLimit)) {
                                creditLimit = Currency + "0.00";
                            }

                            if (isNaN(data.terpcombinedcontactsvs1[i].SalesOrderBalance)) {
                                salesOrderBalance = Currency + "0.00";
                            }


                    var dataListContact = [
                        '<div class="custom-control custom-checkbox chkBox chkBoxContact pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.terpcombinedcontactsvs1[i].ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.terpcombinedcontactsvs1[i].ID+'"></label></div>',
                        data.terpcombinedcontactsvs1[i].name || '-',
                        clienttype || '',
                        data.terpcombinedcontactsvs1[i].Phone || '',
                        data.terpcombinedcontactsvs1[i].mobile || '',
                        arBalance || 0.00,
                        creditBalance || 0.00,
                        balance || 0.00,
                        creditLimit || 0.00,
                        salesOrderBalance || 0.00,
                        data.terpcombinedcontactsvs1[i].email || '',
                        data.terpcombinedcontactsvs1[i].CUSTFLD1 || '',
                        data.terpcombinedcontactsvs1[i].CUSTFLD2 || '',
                        data.terpcombinedcontactsvs1[i].street || '',
                        data.terpcombinedcontactsvs1[i].ID || ''

                    ];
                    splashArrayContactList.push(dataListContact);
                    //}
                }

                function MakeNegative() {
                    $('td').each(function () {
                        if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
                    });
                };

                templateObject.custdatatablerecords.set(dataTableList);

                if (templateObject.custdatatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblContactlist', function (error, result) {
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

                setTimeout(function () {
                    $('#tblContactlist').DataTable({
                        data: splashArrayContactList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        columnDefs: [
                            {
                                className: "chkBox pointer",
                                "orderable": false,
                                "targets": [0]

                            },
                            {
                                className: "colClientName",
                                "targets": [1]
                            }, {
                                className: "colType",
                                "targets": [2]
                            }, {
                                className: "colPhone",
                                "targets": [3]
                            }, {
                                className: "colMobile hiddenColumn",
                                "targets": [4]
                            }, {
                                className: "colARBalance text-right",
                                "targets": [5]
                            }, {
                                className: "colCreditBalance text-right",
                                "targets": [6]
                            }, {
                                className: "colBalance text-right",
                                "targets": [7]
                            }, {
                                className: "colCreditLimit text-right",
                                "targets": [8]
                            }, {
                                className: "colSalesOrderBalance text-right",
                                "targets": [9]
                            }, {
                                className: "colEmail text-right",
                                "targets": [10]
                            }, {
                                className: "colCustFld1 hiddenColumn",
                                "targets": [11]
                            }, {
                                className: "colCustFld2 hiddenColumn",
                                "targets": [12]
                            }, {
                                className: "colAddress",
                                "targets": [13]
                            }, {
                                className: "colID hiddenColumn",
                                "targets": [14]
                            }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[1, "asc"]],
                        action: function () {
                            $('#tblContactlist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                            $('.paginate_button.page-item').removeClass('disabled');
                            $('#tblContactlist_ellipsis').addClass('disabled');
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
                                    var splashArrayContactListDupp = new Array();
                                    let dataLenght = oSettings._iDisplayLength;
                                    let customerSearch = $('#tblContactlist_filter input').val();

                                    sideBarService.getAllContactCombineVS1(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {

                                                for (let j = 0; j < dataObjectnew.terpcombinedcontactsvs1.length; j++) {

                                                  isprospect = dataObjectnew.terpcombinedcontactsvs1[j].isprospect;
                                                  iscustomer = dataObjectnew.terpcombinedcontactsvs1[j].iscustomer;
                                                  isEmployee = dataObjectnew.terpcombinedcontactsvs1[j].isEmployee;
                                                  issupplier = dataObjectnew.terpcombinedcontactsvs1[j].issupplier;

                                                  if((isprospect == true) && (iscustomer == true) && (isEmployee == true) && (issupplier == true)){
                                                      clienttype = "Customer / Employee / Prospect / Supplier";
                                                  }else if((isprospect == true) && (iscustomer ==true) && (issupplier ==true)){
                                                      clienttype = "Customer / Prospect / Supplier";
                                                  }else if((iscustomer ==true) && (issupplier ==true)){
                                                      clienttype = "Customer / Supplier";
                                                  }else if((iscustomer ==true)){

                                                      if (dataObjectnew.terpcombinedcontactsvs1[j].name.toLowerCase().indexOf("^") >= 0){
                                                          clienttype = "Job";
                                                      }else{
                                                          clienttype = "Customer";
                                                      }
                                                  }else if((isEmployee ==true)){
                                                      clienttype = "Employee";
                                                  }else if((issupplier ==true)){
                                                      clienttype = "Supplier";
                                                  }else if((isprospect ==true)){
                                                      clienttype = "Prospect";
                                                  }else{
                                                      clienttype = " ";
                                                  }

                                                      let arBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].ARBalance)|| 0.00;
                                                      let creditBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].CreditBalance) || 0.00;
                                                      let balance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].Balance)|| 0.00;
                                                      let creditLimit = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].CreditLimit)|| 0.00;
                                                      let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(dataObjectnew.terpcombinedcontactsvs1[j].SalesOrderBalance)|| 0.00;
                                                      if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].ARBalance)) {
                                                          arBalance = Currency + "0.00";
                                                      }

                                                      if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].CreditBalance)) {
                                                          creditBalance = Currency + "0.00";
                                                      }
                                                      if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].Balance)) {
                                                          balance = Currency + "0.00";
                                                      }
                                                      if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].CreditLimit)) {
                                                          creditLimit = Currency + "0.00";
                                                      }

                                                      if (isNaN(dataObjectnew.terpcombinedcontactsvs1[j].SalesOrderBalance)) {
                                                          salesOrderBalance = Currency + "0.00";
                                                      }


                                                    var dataListContactDupp = [
                                                      '<div class="custom-control custom-checkbox chkBox chkBoxContact pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+dataObjectnew.terpcombinedcontactsvs1[j].ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+dataObjectnew.terpcombinedcontactsvs1[j].ID+'"></label></div>',
                                                      dataObjectnew.terpcombinedcontactsvs1[j].name || '-',
                                                      clienttype || '',
                                                      dataObjectnew.terpcombinedcontactsvs1[j].Phone || '',
                                                      dataObjectnew.terpcombinedcontactsvs1[j].mobile || '',
                                                      arBalance || 0.00,
                                                      creditBalance || 0.00,
                                                      balance || 0.00,
                                                      creditLimit || 0.00,
                                                      salesOrderBalance || 0.00,
                                                      dataObjectnew.terpcombinedcontactsvs1[j].email || '',
                                                      dataObjectnew.terpcombinedcontactsvs1[j].CUSTFLD1 || '',
                                                      dataObjectnew.terpcombinedcontactsvs1[j].CUSTFLD2 || '',
                                                      dataObjectnew.terpcombinedcontactsvs1[j].street || '',
                                                      dataObjectnew.terpcombinedcontactsvs1[j].ID || ''
                                                    ];

                                                    splashArrayContactList.push(dataListContactDupp);
                                                    //}
                                                }

                                                let uniqueChars = [...new Set(splashArrayContactList)];
                                                var datatable = $('#tblContactlist').DataTable();
                                                datatable.clear();
                                                datatable.rows.add(uniqueChars);
                                                datatable.draw(false);
                                                setTimeout(function () {
                                                  $("#tblContactlist").dataTable().fnPageChange('last');
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
                            $("<button class='btn btn-primary btnAddNewCustomer' data-dismiss='modal' data-toggle='modal' data-target='#addCustomerModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblContactlist_filter");
                            $("<button class='btn btn-primary btnRefreshContact' type='button' id='btnRefreshContact' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblContactlist_filter");

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
                      $('.fullScreenSpin').css('display', 'inline-block');
                      let dataLenght = settings._iDisplayLength;
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
                }, 0);

                var columns = $('#tblContactlist th');
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

    templateObject.getContacts();



});


Template.contactlistpop.events({
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
          $('#tblContactlist_filter .form-control-sm').val('');
        }, 1000);
    },
    'click .btnRefreshContact': function (event) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        const contactList = [];
        const clientList = [];
        let salesOrderTable;
        var splashArray = new Array();
        var splashArrayContactList = new Array();
        const dataTableList = [];
        const tableHeaderList = [];
        let dataSearchName = $('#tblContactlist_filter input').val();

        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getAllContactCombineVS1ByName(dataSearchName).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                let clienttype = '';
                let isprospect = false;
                let iscustomer = false;
                let isEmployee = false;
                let issupplier = false;
                if (data.terpcombinedcontactsvs1.length > 0) {


                    for (let i = 0; i < data.terpcombinedcontactsvs1.length; i++) {

                            isprospect = data.terpcombinedcontactsvs1[i].isprospect;
                            iscustomer = data.terpcombinedcontactsvs1[i].iscustomer;
                            isEmployee = data.terpcombinedcontactsvs1[i].isEmployee;
                            issupplier = data.terpcombinedcontactsvs1[i].issupplier;

                            if((isprospect == true) && (iscustomer == true) && (isEmployee == true) && (issupplier == true)){
                                clienttype = "Customer / Employee / Prospect / Supplier";
                            }else if((isprospect == true) && (iscustomer ==true) && (issupplier ==true)){
                                clienttype = "Customer / Prospect / Supplier";
                            }else if((iscustomer ==true) && (issupplier ==true)){
                                clienttype = "Customer / Supplier";
                            }else if((iscustomer ==true)){

                                if (data.terpcombinedcontactsvs1[i].name.toLowerCase().indexOf("^") >= 0){
                                    clienttype = "Job";
                                }else{
                                    clienttype = "Customer";
                                }
                                // clienttype = "Customer";
                            }else if((isEmployee ==true)){
                                clienttype = "Employee";
                            }else if((issupplier ==true)){
                                clienttype = "Supplier";
                            }else if((isprospect ==true)){
                                clienttype = "Prospect";
                            }else{
                                clienttype = " ";
                            }

                                let arBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].ARBalance)|| 0.00;
                                let creditBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditBalance) || 0.00;
                                let balance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].Balance)|| 0.00;
                                let creditLimit = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditLimit)|| 0.00;
                                let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].SalesOrderBalance)|| 0.00;
                                if (isNaN(data.terpcombinedcontactsvs1[i].ARBalance)) {
                                    arBalance = Currency + "0.00";
                                }

                                if (isNaN(data.terpcombinedcontactsvs1[i].CreditBalance)) {
                                    creditBalance = Currency + "0.00";
                                }
                                if (isNaN(data.terpcombinedcontactsvs1[i].Balance)) {
                                    balance = Currency + "0.00";
                                }
                                if (isNaN(data.terpcombinedcontactsvs1[i].CreditLimit)) {
                                    creditLimit = Currency + "0.00";
                                }

                                if (isNaN(data.terpcombinedcontactsvs1[i].SalesOrderBalance)) {
                                    salesOrderBalance = Currency + "0.00";
                                }


                        var dataListContact = [
                            '<div class="custom-control custom-checkbox chkBox chkBoxContact pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.terpcombinedcontactsvs1[i].ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.terpcombinedcontactsvs1[i].ID+'"></label></div>',
                            data.terpcombinedcontactsvs1[i].name || '-',
                            clienttype || '',
                            data.terpcombinedcontactsvs1[i].Phone || '',
                            data.terpcombinedcontactsvs1[i].mobile || '',
                            arBalance || 0.00,
                            creditBalance || 0.00,
                            balance || 0.00,
                            creditLimit || 0.00,
                            salesOrderBalance || 0.00,
                            data.terpcombinedcontactsvs1[i].email || '',
                            data.terpcombinedcontactsvs1[i].CUSTFLD1 || '',
                            data.terpcombinedcontactsvs1[i].CUSTFLD2 || '',
                            data.terpcombinedcontactsvs1[i].street || '',
                            data.terpcombinedcontactsvs1[i].ID || ''

                        ];
                        splashArrayContactList.push(dataListContact);
                        //}
                    }

                    var datatable = $('#tblContactlist').DataTable();
                    datatable.clear();
                    datatable.rows.add(splashArrayContactList);
                    datatable.draw(false);

                    $('.fullScreenSpin').css('display', 'none');
                } else {

                    $('.fullScreenSpin').css('display', 'none');
                    $('#contactListModal').modal('toggle');
                    swal({
                        title: 'Question',
                        text: "Contact does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            FlowRouter.go('/contactoverview');
                        } else if (result.dismiss === 'cancel') {
                            $('#contactListModal').modal('toggle');
                        }
                    });

                }

            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            sideBarService.getAllContactCombineVS1(initialBaseDataLoad, 0).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.terpcombinedcontactsvs1.length; i++) {
                    let arBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].fields.ARBalance) || 0.00;
                    let creditBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].fields.CreditBalance) || 0.00;
                    let balance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].fields.Balance) || 0.00;
                    let creditLimit = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].fields.CreditLimit) || 0.00;
                    let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].fields.SalesOrderBalance) || 0.00;
                    var dataList = {
                        id: data.terpcombinedcontactsvs1[i].fields.ID || '',
                        clientName: data.terpcombinedcontactsvs1[i].fields.ClientName || '',
                        company: data.terpcombinedcontactsvs1[i].fields.Companyname || '',
                        contactname: data.terpcombinedcontactsvs1[i].fields.ContactName || '',
                        phone: data.terpcombinedcontactsvs1[i].fields.Phone || '',
                        arbalance: arBalance || 0.00,
                        creditbalance: creditBalance || 0.00,
                        balance: balance || 0.00,
                        creditlimit: creditLimit || 0.00,
                        salesorderbalance: salesOrderBalance || 0.00,
                        email: data.terpcombinedcontactsvs1[i].fields.Email || '',
                        job: data.terpcombinedcontactsvs1[i].fields.JobName || '',
                        accountno: data.terpcombinedcontactsvs1[i].fields.AccountNo || '',
                        clientno: data.terpcombinedcontactsvs1[i].fields.ClientNo || '',
                        jobtitle: data.terpcombinedcontactsvs1[i].fields.JobTitle || '',
                        notes: data.terpcombinedcontactsvs1[i].fields.Notes || '',
                        state: data.terpcombinedcontactsvs1[i].fields.State || '',
                        country: data.terpcombinedcontactsvs1[i].fields.Country || '',
                        street: data.terpcombinedcontactsvs1[i].fields.Street || ' ',
                        street2: data.terpcombinedcontactsvs1[i].fields.Street2 || ' ',
                        street3: data.terpcombinedcontactsvs1[i].fields.Street3 || ' ',
                        suburb: data.terpcombinedcontactsvs1[i].fields.Suburb || ' ',
                        postcode: data.terpcombinedcontactsvs1[i].fields.Postcode || ' '
                    };

                    dataTableList.push(dataList);
                    var dataListContact = [
                        data.terpcombinedcontactsvs1[i].fields.ClientName || '-',
                        data.terpcombinedcontactsvs1[i].fields.JobName || '',
                        data.terpcombinedcontactsvs1[i].fields.Phone || '',
                        arBalance || 0.00,
                        creditBalance || 0.00,
                        balance || 0.00,
                        creditLimit || 0.00,
                        salesOrderBalance || 0.00,
                        data.terpcombinedcontactsvs1[i].fields.Country || '',
                        data.terpcombinedcontactsvs1[i].fields.State || '',
                        data.terpcombinedcontactsvs1[i].fields.Street2 || '',
                        data.terpcombinedcontactsvs1[i].fields.Street || '',
                        data.terpcombinedcontactsvs1[i].fields.Postcode || '',
                        data.terpcombinedcontactsvs1[i].fields.Email || '',
                        data.terpcombinedcontactsvs1[i].fields.AccountNo || '',
                        data.terpcombinedcontactsvs1[i].fields.ClientNo || '',
                        data.terpcombinedcontactsvs1[i].fields.JobTitle || '',
                        data.terpcombinedcontactsvs1[i].fields.Notes || '',
                        data.terpcombinedcontactsvs1[i].fields.ID || '',
                        data.terpcombinedcontactsvs1[i].fields.ClientTypeName || 'Default',
                        data.terpcombinedcontactsvs1[i].fields.Discount || 0,
                        data.terpcombinedcontactsvs1[i].fields.TermsName || '',
                        data.terpcombinedcontactsvs1[i].fields.FirstName || '',
                        data.terpcombinedcontactsvs1[i].fields.LastName || '',
                        data.terpcombinedcontactsvs1[i].fields.TaxCodeName || 'E'
                    ];

                    splashArrayContactList.push(dataListContact);

                    // var customerrecordObj = {
                    //     customerid: data.terpcombinedcontactsvs1[i].fields.ID || ' ',
                    //     firstname: data.terpcombinedcontactsvs1[i].fields.FirstName || ' ',
                    //     lastname: data.terpcombinedcontactsvs1[i].fields.LastName || ' ',
                    //     customername: data.terpcombinedcontactsvs1[i].fields.ClientName || ' ',
                    //     customeremail: data.terpcombinedcontactsvs1[i].fields.Email || ' ',
                    //     street: data.terpcombinedcontactsvs1[i].fields.Street || ' ',
                    //     street2: data.terpcombinedcontactsvs1[i].fields.Street2 || ' ',
                    //     street3: data.terpcombinedcontactsvs1[i].fields.Street3 || ' ',
                    //     suburb: data.terpcombinedcontactsvs1[i].fields.Suburb || ' ',
                    //     statecode: data.terpcombinedcontactsvs1[i].fields.State + ' ' + data.terpcombinedcontactsvs1[i].fields.Postcode || ' ',
                    //     country: data.terpcombinedcontactsvs1[i].fields.Country || ' ',
                    //     termsName: datadata.terpcombinedcontactsvs1[i].fields.TermsName || '',
                    //     taxCode: data.terpcombinedcontactsvs1[i].fields.TaxCodeName || '',
                    //     clienttypename: data.terpcombinedcontactsvs1[i].fields.ClientTypeName || 'Default'
                    // };
                    // clientList.push(customerrecordObj);
                    //}
                }
                var datatable = $('#tblContactlist').DataTable();
                datatable.clear();
                datatable.rows.add(splashArrayContactList);
                datatable.draw(false);

                $('.fullScreenSpin').css('display', 'none');


            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    },
    'keyup #tblContactlist_filter input': function (event) {
      if (event.keyCode == 13) {
         $(".btnRefreshContact").trigger("click");
      }
    },
    'click .chkDatatable': function (event) {
        var columns = $('#tblContactlist th');
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
                    PrefName: 'tblContactlist'
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
                    PrefName: 'tblContactlist'
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
                            PrefName: 'tblContactlist',
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
                        PrefName: 'tblContactlist',
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
        var datable = $('#tblContactlist').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function (event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblContactlist th');
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
        var columns = $('#tblContactlist th');

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
        jQuery('#tblContactlist_wrapper .dt-buttons .btntabletocsv').click();
        //$('.fullScreenSpin').css('display','none');

    },
    'click .exportbtnExcel': function () {
        //$('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblContactlist_wrapper .dt-buttons .btntabletoexcel').click();
        //$('.fullScreenSpin').css('display','none');
    },
    'click .printConfirm': function (event) {

        //$('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblContactlist_wrapper .dt-buttons .btntabletopdf').click();
        //$('.fullScreenSpin').css('display','none');
    },
    'click .refreshpagelist': function () {
        //$('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        sideBarService.getAllContactCombineVS1(initialBaseDataLoad, 0).then(function (data) {
            addVS1Data('TERPCombinedContactsVS1', JSON.stringify(data)).then(function (datareturn) {
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
    },
    'click .chkBoxAll': function () {
        if ($(event.target).is(':checked')) {
            $(".chkBox").prop("checked", true);
            // $("#addAllProducts").prop("checked", true);
            // $('.activeProductEmployee').css('display', 'none');
        } else {
            $(".chkBox").prop("checked", false);
            // $("#addAllProducts").prop("checked", false);
            // $('.activeProductEmployee').css('display', 'block');
        }
    }

});

Template.contactlistpop.helpers({
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
            PrefName: 'tblContactlist'
        });
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
