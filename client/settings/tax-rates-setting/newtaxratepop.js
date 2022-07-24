import {
    TaxRateService
} from "../settings-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    SideBarService
} from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let taxSelected = "";
Template.newtaxratepop.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.defaultpurchasetaxcode = new ReactiveVar();
    templateObject.defaultsaletaxcode = new ReactiveVar();
});

Template.newtaxratepop.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];

    let purchasetaxcode = '';
    let salestaxcode = '';
    templateObject.defaultpurchasetaxcode.set(loggedTaxCodePurchaseInc);
    templateObject.defaultsaletaxcode.set(loggedTaxCodeSalesInc);
    setTimeout(function() {
        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'defaulttax', function(error, result) {
            if (error) {
                purchasetaxcode = loggedTaxCodePurchaseInc;
                salestaxcode = loggedTaxCodeSalesInc;
                templateObject.defaultpurchasetaxcode.set(loggedTaxCodePurchaseInc);
                templateObject.defaultsaletaxcode.set(loggedTaxCodeSalesInc);
            } else {
                if (result) {
                    purchasetaxcode = result.customFields[0].taxvalue || loggedTaxCodePurchaseInc;
                    salestaxcode = result.customFields[1].taxvalue || loggedTaxCodeSalesInc;
                    templateObject.defaultpurchasetaxcode.set(purchasetaxcode);
                    templateObject.defaultsaletaxcode.set(salestaxcode);
                }

            }
        });
    }, 500);



    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'taxRatesList', function(error, result) {
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
    }

    templateObject.getTaxRates = function() {
        getVS1Data('TTaxcodeVS1').then(function(dataObject) {
            if (dataObject.length === 0) {
                taxRateService.getTaxRateVS1().then(function(data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                        let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2) + '%';
                        var dataList = {
                            id: data.ttaxcodevs1[i].Id || '',
                            codename: data.ttaxcodevs1[i].CodeName || '-',
                            description: data.ttaxcodevs1[i].Description || '-',
                            region: data.ttaxcodevs1[i].RegionName || '-',
                            rate: taxRate || '-',

                        };

                        dataTableList.push(dataList);
                        //}
                    }

                    templateObject.datatablerecords.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'taxRatesList', function(error, result) {
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

                                        if (hiddenColumn === true) {

                                            $("." + columnClass + "").addClass('hiddenColumn');
                                            $("." + columnClass + "").removeClass('showColumn');
                                        } else if (hiddenColumn === false) {
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
                        $('#taxRatesList').DataTable({
                            columnDefs: [{
                                    type: 'date',
                                    targets: 0
                                },
                                {
                                    "orderable": false,
                                    "targets": -1
                                }
                            ],
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
                            // colReorder: true,
                            colReorder: {
                                fixedColumnsRight: 1
                            },
                            // bStateSave: true,
                            // rowId: 0,
                            // pageLength: 25,
                            paging: false,
                            "scrollY": "400px",
                            "scrollCollapse": true,
                            info: true,
                            responsive: true,
                            "order": [
                                [0, "asc"]
                            ],
                            action: function() {
                                $('#taxRatesList').DataTable().ajax.reload();
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

                        // $('#taxRatesList').DataTable().column( 0 ).visible( true );
                        $('.fullScreenSpin').css('display', 'none');
                    }, 0);

                    var columns = $('#taxRatesList th');
                    let sTible = "";
                    let sWidth = "";
                    let sIndex = "";
                    let sVisible = "";
                    let columVisible = false;
                    let sClass = "";
                    $.each(columns, function(i, v) {
                        if (v.hidden === false) {
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
                let useData = data.ttaxcodevs1;
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < useData.length; i++) {
                    let taxRate = (useData[i].Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: useData[i].Id || '',
                        codename: useData[i].CodeName || '-',
                        description: useData[i].Description || '-',
                        region: useData[i].RegionName || '-',
                        rate: taxRate || '-',

                    };

                    dataTableList.push(dataList);
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'taxRatesList', function(error, result) {
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

                                    if (hiddenColumn === true) {

                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                    } else if (hiddenColumn === false) {
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
                    $('#taxRatesList').DataTable({
                        columnDefs: [{
                                type: 'date',
                                targets: 0
                            },
                            {
                                "orderable": false,
                                "targets": -1
                            }
                        ],
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
                        // colReorder: true,
                        colReorder: {
                            fixedColumnsRight: 1
                        },
                        // bStateSave: true,
                        // rowId: 0,
                        // pageLength: 25,
                        paging: false,
                        "scrollY": "400px",
                        "scrollCollapse": true,
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "asc"]
                        ],
                        action: function() {
                            $('#taxRatesList').DataTable().ajax.reload();
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

                    // $('#taxRatesList').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#taxRatesList th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
                    if (v.hidden === false) {
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
            taxRateService.getTaxRateVS1().then(function(data) {
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                    let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: data.ttaxcodevs1[i].Id || '',
                        codename: data.ttaxcodevs1[i].CodeName || '-',
                        description: data.ttaxcodevs1[i].Description || '-',
                        region: data.ttaxcodevs1[i].RegionName || '-',
                        rate: taxRate || '-',


                    };

                    dataTableList.push(dataList);
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'taxRatesList', function(error, result) {
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

                                    if (hiddenColumn === true) {

                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                    } else if (hiddenColumn === false) {
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
                    $('#taxRatesList').DataTable({
                        columnDefs: [{
                                type: 'date',
                                targets: 0
                            },
                            {
                                "orderable": false,
                                "targets": -1
                            }
                        ],
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
                        // colReorder: true,
                        colReorder: {
                            fixedColumnsRight: 1
                        },
                        // bStateSave: true,
                        // rowId: 0,
                        // pageLength: 25,
                        paging: false,
                        "scrollY": "400px",
                        "scrollCollapse": true,
                        info: true,
                        responsive: true,
                        "order": [
                            [0, "asc"]
                        ],
                        action: function() {
                            $('#taxRatesList').DataTable().ajax.reload();
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

                    // $('#taxRatesList').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#taxRatesList th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i, v) {
                    if (v.hidden === false) {
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

    };

    templateObject.getTaxRates();

    $(document).on('click', '.table-remove', function() {
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteLineModal').modal('toggle');
    });

    $('#taxRatesList tbody').on('click', 'tr .colName, tr .colDescription, tr .colRate', function() {
        var listData = $(this).closest('tr').attr('id');
        // var tabletaxtcode = $(event.target).closest("tr").find(".colTaxCode").text();
        // var accountName = $(event.target).closest("tr").find(".colAccountName").text();
        // let columnBalClass = $(event.target).attr('class');
        // let accountService = new AccountService();
        if (listData) {
            $('#add-tax-title').text('Edit Tax Rate');
            $('#edtTaxName').prop('readonly', true);
            if (listData !== '') {
                listData = Number(listData);
                //taxRateService.getOneTaxRate(listData).then(function (data) {

                var taxid = listData || '';
                var taxname = $(event.target).closest("tr").find(".colName").text() || '';
                var taxDesc = $(event.target).closest("tr").find(".colDescription").text() || '';
                var taxRate = $(event.target).closest("tr").find(".colRate").text().replace('%', '') || '0';
                //data.fields.Rate || '';


                $('#edtTaxID').val(taxid);
                $('#edtTaxName').val(taxname);

                $('#edtTaxRate').val(taxRate);
                $('#edtTaxDesc').val(taxDesc);


                //});

                $(this).closest('tr').attr('data-target', '#myModal');
                $(this).closest('tr').attr('data-toggle', 'modal');

            }

        }

    });

});

Template.newtaxratepop.events({
    'click .btnSaveTaxRate': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        var url = FlowRouter.current().path;
        let taxRateService = new TaxRateService();
        let taxSelected = $('#taxSelected').val();
        let taxtID = $('#edtTaxID').val();
        let taxName = $('#edtTaxNamePop').val();
        let taxDesc = $('#edtTaxDescPop').val();
        let taxRate = parseFloat($('#edtTaxRatePop').val() / 100);
        let objDetails = '';
        if (taxName === '') {
            Bert.alert('<strong>WARNING:</strong> Tax Rate cannot be blank!', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
        }

        if (taxtID === "") {
            taxRateService.checkTaxRateByName(taxName).then(function(data) {
                taxtID = data.ttaxcode[0].Id;
                objDetails = {
                    type: "TTaxcode",
                    fields: {
                        ID: parseInt(taxtID),
                        Active: true,
                        // CodeName: taxName,
                        Description: taxDesc,
                        Rate: taxRate,
                        PublishOnVS1: true
                    }
                };
                taxRateService.saveTaxRate(objDetails).then(function(objDetails) {
                    sideBarService.getTaxRateVS1().then(function(dataReload) {
                        addVS1Data('TTaxcodeVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                             if(url.includes("/productview")) {
                                    if (taxSelected === "sales") {
                                        $('#slttaxcodesales').val(taxName);
                                    } else if (taxSelected === "purchase") {
                                        $('#slttaxcodepurchase').val(taxName);
                                    } else {
                                $('#sltTaxCode').val(taxName);
                            }
                            }

                             if(url.includes("/accountsoverview")) {
                                $('#sltTaxCode').val(taxName);
                            }
                            $('#newTaxRateModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        }).catch(function(err) {
                            if(url.includes("/productview")) {
                                    if (taxSelected === "sales") {
                                        $('#slttaxcodesales').val(taxName);
                                    } else if (taxSelected === "purchase") {
                                        $('#slttaxcodepurchase').val(taxName);
                                    } else {
                                $('#sltTaxCode').val(taxName);
                            }
                            }

                             if(url.includes("/accountsoverview")) {
                                $('#sltTaxCode').val(taxName);
                            }
                            $('#newTaxRateModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }).catch(function(err) {
                        if(url.includes("/productview")) {
                                    if (taxSelected === "sales") {
                                        $('#slttaxcodesales').val(taxName);
                                    } else if (taxSelected === "purchase") {
                                        $('#slttaxcodepurchase').val(taxName);
                                    } else {
                                $('#sltTaxCode').val(taxName);
                            }
                            }
                             if(url.includes("/accountsoverview")) {
                                $('#sltTaxCode').val(taxName);
                            }
                        $('#newTaxRateModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    });
                    var selectLineID = $('#selectLineID').val();
                    if (selectLineID) {
                      $('#' + selectLineID + " .lineTaxCode").val(taxName);
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
                            // Meteor._reload.reload();
                            $('#newTaxRateModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            }).catch(function(err) {
                objDetails = {
                    type: "TTaxcode",
                    fields: {
                        // Id: taxCodeId,
                        Active: true,
                        CodeName: taxName,
                        Description: taxDesc,
                        Rate: taxRate,
                        PublishOnVS1: true
                    }
                };

                taxRateService.saveTaxRate(objDetails).then(function(objDetails) {
                    sideBarService.getTaxRateVS1().then(function(dataReload) {
                        addVS1Data('TTaxcodeVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                            if(url.includes("/productview")) {
                                    if (taxSelected === "sales") {
                                        $('#slttaxcodesales').val(taxName);
                                    } else if (taxSelected === "purchase") {
                                        $('#slttaxcodepurchase').val(taxName);
                                    } else {
                                $('#sltTaxCode').val(taxName);
                            }
                            }
                             if(url.includes("/accountsoverview")) {
                                $('#sltTaxCode').val(taxName);
                            }
                            $('#newTaxRateModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        }).catch(function(err) {
                            if(url.includes("/productview")) {
                                    if (taxSelected === "sales") {
                                        $('#slttaxcodesales').val(taxName);
                                    } else if (taxSelected === "purchase") {
                                        $('#slttaxcodepurchase').val(taxName);
                                    } else {
                                $('#sltTaxCode').val(taxName);
                            }
                            }
                             if(url.includes("/accountsoverview")) {
                                $('#sltTaxCode').val(taxName);
                            }
                            $('#newTaxRateModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }).catch(function(err) {
                        if(url.includes("/productview")) {
                                if (taxSelected === "sales") {
                                    $('#slttaxcodesales').val(taxName);
                                } else if (taxSelected === "purchase") {
                                    $('#slttaxcodepurchase').val(taxName);
                                } else {
                                $('#sltTaxCode').val(taxName);
                            }
                        }
                         if(url.includes("/accountsoverview")) {
                                $('#sltTaxCode').val(taxName);
                            }
                        $('#newTaxRateModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    });
                    var selectLineID = $('#selectLineID').val();
                    if (selectLineID) {
                      $('#' + selectLineID + " .lineTaxCode").val(taxName);
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
                            // Meteor._reload.reload();
                            $('#newTaxRateModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            });

        } else {
            objDetails = {
                type: "TTaxcode",
                fields: {
                    ID: parseInt(taxtID),
                    Active: true,
                    CodeName: taxName,
                    Description: taxDesc,
                    Rate: taxRate,
                    PublishOnVS1: true
                }
            };
            taxRateService.saveTaxRate(objDetails).then(function(objDetails) {
                sideBarService.getTaxRateVS1().then(function(dataReload) {
                    addVS1Data('TTaxcodeVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                        if(url.includes("/productview")) {
                            if (taxSelected === "sales") {
                                $('#slttaxcodesales').val(taxName);
                            } else if (taxSelected === "purchase") {
                                $('#slttaxcodepurchase').val(taxName);
                            } else {
                                $('#sltTaxCode').val(taxName);
                            }
                            }

                            if(url.includes("/accountsoverview")) {
                                $('#sltTaxCode').val(taxName);
                            }
                        $('#newTaxRateModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    }).catch(function(err) {
                        // Meteor._reload.reload();
                        $('#newTaxRateModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }).catch(function(err) {
                    if(url.includes("/productview")) {
                            if (taxSelected === "sales") {
                                $('#slttaxcodesales').val(taxName);
                            } else if (taxSelected === "purchase") {
                                $('#slttaxcodepurchase').val(taxName);
                            } else {
                                $('#sltTaxCode').val(taxName);
                            }
                    }
                     if(url.includes("/accountsoverview")) {
                                $('#sltTaxCode').val(taxName);
                            }
                    $('#newTaxRateModal').modal('toggle');
                    $('.fullScreenSpin').css('display', 'none');
                });
                var selectLineID = $('#selectLineID').val();
                if (selectLineID) {
                  $('#' + selectLineID + " .lineTaxCode").val(taxName);
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
                        // Meteor._reload.reload();
                        $('#newTaxRateModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    } else if (result.dismiss === 'cancel') {

                    }
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    }
});

Template.newtaxratepop.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.codename === 'NA') {
                return 1;
            } else if (b.codename === 'NA') {
                return -1;
            }
            return (a.codename.toUpperCase() > b.codename.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'taxRatesList'
        });
    },
    defaultpurchasetaxcode: () => {
        return Template.instance().defaultpurchasetaxcode.get();
    },
    defaultsaletaxcode: () => {
        return Template.instance().defaultsaletaxcode.get();
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
