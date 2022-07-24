import {
    TaxRateService
} from "../settings/settings-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    SideBarService
} from '../js/sidebar-service';
import { Random } from 'meteor/random';
import '../lib/global/indexdbstorage.js';
import { OrganisationService } from '../js/organisation-service';
let sideBarService = new SideBarService();
Template.customfieldformpop.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.deptrecords = new ReactiveVar();

    templateObject.include7Days = new ReactiveVar();
    templateObject.include7Days.set(false);
    templateObject.include30Days = new ReactiveVar();
    templateObject.include30Days.set(false);
    templateObject.includeCOD = new ReactiveVar();
    templateObject.includeCOD.set(false);
    templateObject.includeEOM = new ReactiveVar();
    templateObject.includeEOM.set(false);
    templateObject.includeEOMPlus = new ReactiveVar();
    templateObject.includeEOMPlus.set(false);

    templateObject.includeSalesDefault = new ReactiveVar();
    templateObject.includeSalesDefault.set(false);
    templateObject.includePurchaseDefault = new ReactiveVar();
    templateObject.includePurchaseDefault.set(false);

});

Template.customfieldformpop.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    const deptrecords = [];
    let deptprodlineItems = [];
    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblStatusPopList', function(error, result) {
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

                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    templateObject.getTaxRates = function() {
        getVS1Data('TLeadStatusType').then(function(dataObject) {
            if (dataObject.length == 0) {
                taxRateService.getAllLeadStatus().then(function(data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    let setISCOD = false;
                    for (let i = 0; i < data.tleadstatustype.length; i++) {
                        // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                        var dataList = {
                            id: data.tleadstatustype[i].Id || '',
                            typename: data.tleadstatustype[i].TypeName || '',
                            description: data.tleadstatustype[i].Description || data.tleadstatustype[i].TypeName
                        };

                        dataTableList.push(dataList);
                        //}
                    }


                    templateObject.datatablerecords.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblStatusPopList', function(error, result) {
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
                        $('#tblStatusPopList').DataTable({
                            columnDefs: [{
                                "orderable": false,
                                "targets": -1
                            }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [{
                                    extend: 'csvHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "tblStatusPopList_" + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                }, {
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Term List',
                                    filename: "tblStatusPopList_" + moment().format(),
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                },
                                {
                                    extend: 'excelHtml5',
                                    title: '',
                                    download: 'open',
                                    className: "btntabletoexcel hiddenColumn",
                                    filename: "tblStatusPopList_" + moment().format(),
                                    orientation: 'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                    // ,
                                    // customize: function ( win ) {
                                    //   $(win.document.body).children("h1:first").remove();
                                    // }

                                }
                            ],
                            // bStateSave: true,
                            // rowId: 0,
                            paging: false,
                            // "scrollY": "400px",
                            // "scrollCollapse": true,
                            info: true,
                            responsive: true,
                            "order": [
                                [0, "asc"]
                            ],
                            // "aaSorting": [[1,'desc']],
                            action: function() {
                                $('#tblStatusPopList').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function(oSettings) {
                                setTimeout(function() {
                                    MakeNegative();
                                }, 100);
                            },
                            "fnInitComplete": function () {
                                $("<button class='btn btn-primary btnAddNewStatus' data-dismiss='modal' data-toggle='modal' data-target='#newStatusPopModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblStatusPopList_filter");
                                $("<button class='btn btn-primary btnRefreshStatus' type='button' id='btnRefreshStatus' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblStatusPopList_filter");
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
                        $('.fullScreenSpin').css('display', 'none');
                    }, 10);


                    var columns = $('#tblStatusPopList th');
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

                }).catch(function(err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tleadstatustype;
                let lineItems = [];
                let lineItemObj = {};
                let setISCOD = false;
                for (let i = 0; i < useData.length; i++) {
                    // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: useData[i].Id || '',
                        typename: useData[i].TypeName || '',
                        description: useData[i].Description || useData[i].TypeName
                    };

                    dataTableList.push(dataList);
                    //}
                }


                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblStatusPopList', function(error, result) {
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
                    $('#tblStatusPopList').DataTable({
                        columnDefs: [{
                            "orderable": false,
                            "targets": -1
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "tblStatusPopList_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Term List',
                                filename: "tblStatusPopList_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },
                            {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "tblStatusPopList_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                                // ,
                                // customize: function ( win ) {
                                //   $(win.document.body).children("h1:first").remove();
                                // }

                            }
                        ],
                        // bStateSave: true,
                        // rowId: 0,
                        paging: false,
                        // "scrollY": "400px",
                        // "scrollCollapse": true,
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "asc"]
                        ],
                        // "aaSorting": [[1,'desc']],
                        action: function() {
                            $('#tblStatusPopList').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function(oSettings) {
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnAddNewStatus' data-dismiss='modal' data-toggle='modal' data-target='#newStatusPopModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblStatusPopList_filter");
                            $("<button class='btn btn-primary btnRefreshStatus' type='button' id='btnRefreshStatus' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblStatusPopList_filter");
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
                    $('.fullScreenSpin').css('display', 'none');
                }, 10);


                var columns = $('#tblStatusPopList th');
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

            }
        }).catch(function(err) {
            taxRateService.getAllLeadStatus().then(function(data) {
                let lineItems = [];
                let lineItemObj = {};
                let setISCOD = false;
                for (let i = 0; i < data.tleadstatustype.length; i++) {
                    // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: data.tleadstatustype[i].Id || '',
                        typename: data.tleadstatustype[i].TypeName || '',
                        description: data.tleadstatustype[i].Description || data.tleadstatustype[i].TypeName
                    };

                    dataTableList.push(dataList);
                    //}
                }


                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblStatusPopList', function(error, result) {
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
                    $('#tblStatusPopList').DataTable({
                        columnDefs: [{
                            "orderable": false,
                            "targets": -1
                        }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [{
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "tblStatusPopList_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Term List',
                                filename: "tblStatusPopList_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },
                            {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "tblStatusPopList_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                                // ,
                                // customize: function ( win ) {
                                //   $(win.document.body).children("h1:first").remove();
                                // }

                            }
                        ],
                        // bStateSave: true,
                        // rowId: 0,
                        paging: false,
                        // "scrollY": "400px",
                        // "scrollCollapse": true,
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "asc"]
                        ],
                        // "aaSorting": [[1,'desc']],
                        action: function() {
                            $('#tblStatusPopList').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function(oSettings) {
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnAddNewStatus' data-dismiss='modal' data-toggle='modal' data-target='#newStatusPopModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblStatusPopList_filter");
                            $("<button class='btn btn-primary btnRefreshStatus' type='button' id='btnRefreshStatus' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblStatusPopList_filter");
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
                    $('.fullScreenSpin').css('display', 'none');
                }, 10);


                var columns = $('#tblStatusPopList th');
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

            }).catch(function(err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });

    }

    templateObject.getTaxRates();



    $(document).on('click', '.table-remove', function() {
        event.stopPropagation();
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteLineModal').modal('toggle');
        // if ($('.tblStatusPopList tbody>tr').length > 1) {
        // // if(confirm("Are you sure you want to delete this row?")) {
        // this.click;
        // $(this).closest('tr').remove();
        // //} else { }
        // event.preventDefault();
        // return false;
        // }
    });

    $('#tblStatusPopList tbody').on('click', 'tr .colName, tr .colIsDays, tr .colIsEOM, tr .colDescription, tr .colIsCOD, tr .colIsEOMPlus, tr .colCustomerDef, tr .colSupplierDef', function() {
        var listData = $(this).closest('tr').attr('id');
        var is7days = false;
        var is30days = false;
        var isEOM = false;
        var isEOMPlus = false;
        var isSalesDefault = false;
        var isPurchaseDefault = false;
        if (listData) {
            $('#add-terms-title').text('Edit Term ');
            //$('#isformcreditcard').removeAttr('checked');
            if (listData !== '') {
                listData = Number(listData);
                //taxRateService.getOneTerms(listData).then(function (data) {

                var termsID = listData || '';
                var termsName = $(event.target).closest("tr").find(".colName").text() || '';
                var description = $(event.target).closest("tr").find(".colDescription").text() || '';
                var days = $(event.target).closest("tr").find(".colIsDays").text() || 0;
                //let isDays = data.fields.IsDays || '';
                if ($(event.target).closest("tr").find(".colIsEOM .chkBox").is(':checked')) {
                    isEOM = true;
                }

                if ($(event.target).closest("tr").find(".colIsEOMPlus .chkBox").is(':checked')) {
                    isEOMPlus = true;
                }

                if ($(event.target).closest("tr").find(".colCustomerDef .chkBox").is(':checked')) {
                    isSalesDefault = true;
                }

                if ($(event.target).closest("tr").find(".colSupplierDef .chkBox").is(':checked')) {
                    isPurchaseDefault = true;
                }

                if (isEOM == true || isEOMPlus == true) {
                    isDays = false;
                } else {
                    isDays = true;
                }


                $('#edtTermsID').val(termsID);
                $('#edtName').val(termsName);
                $('#edtName').prop('readonly', true);
                $('#edtDesc').val(description);
                $('#edtDays').val(days);


                // if((isDays == true) && (days == 7)){
                //   templateObject.include7Days.set(true);
                // }else{
                //   templateObject.include7Days.set(false);
                // }
                if ((isDays == true) && (days == 0)) {
                    templateObject.includeCOD.set(true);
                } else {
                    templateObject.includeCOD.set(false);
                }

                if ((isDays == true) && (days == 30)) {
                    templateObject.include30Days.set(true);
                } else {
                    templateObject.include30Days.set(false);
                }

                if (isEOM == true) {
                    templateObject.includeEOM.set(true);
                } else {
                    templateObject.includeEOM.set(false);
                }

                if (isEOMPlus == true) {
                    templateObject.includeEOMPlus.set(true);
                } else {
                    templateObject.includeEOMPlus.set(false);
                }


                if (isSalesDefault == true) {
                    templateObject.includeSalesDefault.set(true);
                } else {
                    templateObject.includeSalesDefault.set(false);
                }

                if (isPurchaseDefault == true) {
                    templateObject.includePurchaseDefault.set(true);
                } else {
                    templateObject.includePurchaseDefault.set(false);
                }

                //});


                $(this).closest('tr').attr('data-target', '#myModal');
                $(this).closest('tr').attr('data-toggle', 'modal');

            }

        }

    });
});


Template.customfieldformpop.events({
    'click .btnSaveCustomField': function() {
     let organisationService = new OrganisationService();
     var url = FlowRouter.current().path;
      let fieldID = parseInt($('#statusId1').val()) || '';
      let termsName = $('#newStatus1').val()||'';
      let clickedInput = $('#clickedControl').val();
     let dropDownStatus = $('#isdropDown').val();
     let dropDownData = [];
     let dropObj = '';
      let listType = "";
      let objDetails1 = '';
      $('.fullScreenSpin').css('display', 'inline-block');
       if(url.includes('/invoicecard') || url.includes('/salesordercard') || url.includes('/quotecard') || url.includes('/refundcard')) {
         listType = "ltSales";
       }

       if (fieldID == "") {
           // taxRateService.checkTermByName(termsName).then(function(data) {
            if(dropDownStatus == "true") {
              let countCustom = 0;
                $('.customText').each(function(){
                  countCustom++;
                    dropObj = {
                        type: "TCustomFieldListDropDown",
                        fields:{
                            //Recno: parseInt(countCustom) || 0,
                            Text: $(this).val(),
                        }
                    }
                    dropDownData.push(dropObj);
                });

                if(termsName !== ''){
                 objDetails1 = {
                    type: "TCustomFieldList",
                    fields: {
                        Active:true,
                        DataType:"ftString",
                        Description: termsName,
                        Dropdown: dropDownData,
                        IsCombo:true,
                        listType: listType
                    }
                };
              }else{
                objDetails1 = {
                   type: "TCustomFieldList",
                   fields: {
                       Active:true,
                       DataType:"ftString",
                       //Description: termsName,
                       Dropdown: dropDownData,
                       IsCombo:true,
                       listType: listType
                   }
               };
              }
            } else {
                objDetails1 = {
                    type: "TCustomFieldList",
                    fields: {
                        DataType:"ftString",
                        Description: termsName,
                        Dropdown: null,
                        IsCombo:false,
                        listType: listType
                    }
                };
            }
                organisationService.saveCustomField(objDetails1).then(function(objDetails) {
                    sideBarService.getAllCustomFields().then(function (data) {
                        addVS1Data('TCustomFieldList', JSON.stringify(data));
                    });
                        if(clickedInput == "one") {
                            $('.lblCustomField1').text(termsName);
                            // $('#edtSaleCustField1').val(termsName);
                            $('#customFieldText1').val(termsName);

                        } else if(clickedInput == "two") {
                             $('.lblCustomField2').text(termsName);
                            // $('#edtSaleCustField2').val(termsName);
                            $('#customFieldText2').val(termsName);
                        } else if(clickedInput == "three") {
                            $('.lblCustomField3').text(termsName);
                            // $('#edtSaleCustField3').val(termsName);
                            $('#customFieldText3').val(termsName);
                        }
                        // addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                            $('#newCustomFieldPop').modal('toggle');
                            $('#myModal4').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        // }).catch(function(err) {
                        //     $('#newTermsModal').modal('toggle');
                        //     $('.fullScreenSpin').css('display', 'none');
                        // });
                    // }).catch(function(err) {
                    //     $('#newTermsModal').modal('toggle');
                    //     $('.fullScreenSpin').css('display', 'none');
                    // });
                }).catch(function(err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });

        } else {
            if(dropDownStatus == "true") {
              let countCustom = 0;
                $('.customText').each(function(){
                  countCustom++;
                    dropObj = {
                        type: "TCustomFieldListDropDown",
                        fields:{
                            ID: parseInt($(this).attr('token')) || 0,
                            Text: $(this).val()||'',
                        }
                    }
                    dropDownData.push(dropObj);
                });

                if(termsName !== ''){
                 objDetails1 = {
                    type: "TCustomFieldList",
                    fields: {
                        DataType:"ftString",
                        Description: termsName,
                        Dropdown: dropDownData,
                        ID: fieldID,
                        IsCombo:true,
                        listType: listType
                    }
                };
              }else{
                objDetails1 = {
                   type: "TCustomFieldList",
                   fields: {
                       DataType:"ftString",
                       //Description: termsName,
                       Dropdown: dropDownData,
                       ID: fieldID,
                       IsCombo:true,
                       listType: listType
                   }
               };
              }
            } else {
                objDetails1 = {
                    type: "TCustomFieldList",
                    fields: {
                        DataType:"ftString",
                        Description: termsName,
                        ID: fieldID,
                        Dropdown: null,
                        IsCombo:false,
                        listType: listType
                    }
                };
            }

                organisationService.saveCustomField(objDetails1).then(function(objDetails) {
                    // sideBarService.getTermsVS1().then(function(dataReload) {
                    sideBarService.getAllCustomFields().then(function (data) {
                        addVS1Data('TCustomFieldList', JSON.stringify(data));
                    });
                        if(clickedInput == "one") {
                            $('.lblCustomField1').text(termsName);
                            // $('#edtSaleCustField1').val(termsName);
                            $('#customFieldText1').val(termsName);

                        } else if(clickedInput == "two") {
                             $('.lblCustomField2').text(termsName);
                            // $('#edtSaleCustField2').val(termsName);
                            $('#customFieldText2').val(termsName);
                        } else if(clickedInput == "three") {
                            $('.lblCustomField3').text(termsName);
                            // $('#edtSaleCustField3').val(termsName);
                            $('#customFieldText3').val(termsName);
                        }
                        // addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                            $('#newCustomFieldPop').modal('toggle');
                            $('#myModal4').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        // }).catch(function(err) {
                        //     $('#newTermsModal').modal('toggle');
                        //     $('.fullScreenSpin').css('display', 'none');
                        // });
                    // }).catch(function(err) {
                    //     $('#newTermsModal').modal('toggle');
                    //     $('.fullScreenSpin').css('display', 'none');
                    // });
                }).catch(function(err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
        }
},
    'click .btnAddNewTextBox': function (event) {
      var textBoxData = $('#textBoxSection:last').clone(true);
      let tokenid = Random.id();
      textBoxData.find("input:text").val("");
      textBoxData.find("input:text").attr('token', '0');
      $('.dropDownSection').append(textBoxData);
    },
    'click .btnRemoveDropOptions': function () {
        if ($('.textBoxSection').length > 1) {
           $(event.target).closest('.textBoxSection').remove();
        }else{
           $("input[name='customText']").val("");
        }

        // swal({
        //     title: 'Delete Dropdown Option',
        //     text: "Are you sure you want to Delete Dropdown Option?",
        //     type: 'question',
        //     showCancelButton: true,
        //     confirmButtonText: 'Yes'
        // }).then((result) => {
        //     if (result.value) {
        //       $(event.target).closest('.textBoxSection').remove();
        //     } else {}
        // });
    }


});

Template.customfieldformpop.helpers({
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
