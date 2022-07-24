import {
    TaxRateService
} from "../settings/settings-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    SideBarService
} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
Template.newdepartmentpop.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.employeerecords = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.roomrecords = new ReactiveVar([]);

    templateObject.departlist = new ReactiveVar([]);
});

Template.newdepartmentpop.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    const deptrecords = [];
    let deptprodlineItems = [];

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'departmentList', function(error, result) {
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

    templateObject.getAllEmployees = function() {

        getVS1Data('TEmployee').then(function(dataObject) {
            if (dataObject.length == 0) {
                taxRateService.getEmployees().then(function(data) {
                    let employeeList = [];
                    for (let i = 0; i < data.temployee.length; i++) {

                        let dataObj = {
                            empID: data.temployee[i].Id || ' ',
                            employeename: data.temployee[i].EmployeeName || ' '
                        };
                        if (data.temployee[i].EmployeeName.replace(/\s/g, '') != '') {
                            employeeList.push(dataObj);
                        }
                    }
                    templateObject.employeerecords.set(employeeList);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.temployee;
                let employeeList = [];
                for (let i = 0; i < useData.length; i++) {

                    let dataObj = {
                        empID: useData[i].fields.ID || ' ',
                        employeename: useData[i].fields.EmployeeName || ' '
                    };
                    if (useData[i].fields.EmployeeName.replace(/\s/g, '') != '') {
                        employeeList.push(dataObj);
                    }
                }
                templateObject.employeerecords.set(employeeList);

            }
        }).catch(function(err) {
            taxRateService.getEmployees().then(function(data) {
                let employeeList = [];
                for (let i = 0; i < data.temployee.length; i++) {

                    let dataObj = {
                        empID: data.temployee[i].Id || ' ',
                        employeename: data.temployee[i].EmployeeName || ' '
                    };
                    if (data.temployee[i].EmployeeName.replace(/\s/g, '') != '') {
                        employeeList.push(dataObj);
                    }
                }
                templateObject.employeerecords.set(employeeList);
            });
        });


    };
    templateObject.getAllEmployees();

    templateObject.getRooms = function() {

        taxRateService.getBins().then(function(data) {
            let binList = [];
            for (let i = 0; i < data.tproductbin.length; i++) {

                let dataObj = {
                    roomid: data.tproductbin[i].BinNumber || ' ',
                    roomname: data.tproductbin[i].BinLocation || ' '
                };
                if (data.tproductbin[i].BinLocation.replace(/\s/g, '') != '') {
                    binList.push(dataObj);
                }

            }
            templateObject.roomrecords.set(binList);
        });
    };
    templateObject.getRooms();

    templateObject.getDeptList = function() {
        getVS1Data('TDeptClass').then(function(dataObject) {
            if (dataObject.length == 0) {
                taxRateService.getDepartment().then(function(data) {
                    let deptList = [];
                    for (let i = 0; i < data.tdeptclass.length; i++) {

                        let dataObject = {
                            departid: data.tdeptclass[i].Id || ' ',
                            deptname: data.tdeptclass[i].DeptClassName || ' ',
                        };

                        if (data.tdeptclass[i].DeptClassName.replace(/\s/g, '') != '') {
                            deptList.push(dataObject);
                        }

                    }
                    templateObject.departlist.set(deptList);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tdeptclass;
                let deptList = [];
                for (let i = 0; i < data.tdeptclass.length; i++) {

                    let dataObject = {
                        departid: useData[i].Id || ' ',
                        deptname: useData[i].DeptClassName || ' ',
                    };

                    if (data.tdeptclass[i].DeptClassName.replace(/\s/g, '') != '') {
                        deptList.push(dataObject);
                    }

                }
                templateObject.departlist.set(deptList);

            }
        }).catch(function(err) {
            taxRateService.getDepartment().then(function(data) {
                let deptList = [];
                for (let i = 0; i < data.tdeptclass.length; i++) {

                    let dataObject = {
                        departid: data.tdeptclass[i].Id || ' ',
                        deptname: data.tdeptclass[i].DeptClassName || ' ',
                    };

                    if (data.tdeptclass[i].DeptClassName.replace(/\s/g, '') != '') {
                        deptList.push(dataObject);
                    }

                }
                templateObject.departlist.set(deptList);
            });
        });

    };
    templateObject.getDeptList();

    templateObject.getTaxRates = function() {
        getVS1Data('TDeptClass').then(function(dataObject) {
            if (dataObject.length == 0) {
                taxRateService.getDepartment().then(function(data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    for (let i = 0; i < data.tdeptclass.length; i++) {
                        // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                        var dataList = {
                            id: data.tdeptclass[i].Id || '',
                            headDept: data.tdeptclass[i].DeptClassGroup || '-',
                            departmentName: data.tdeptclass[i].DeptClassName || '-',
                            description: data.tdeptclass[i].Description || '-',
                            sitecode: data.tdeptclass[i].SiteCode || '-',
                            status: data.tdeptclass[i].Active || 'false',


                        };

                        dataTableList.push(dataList);
                        //}
                    }

                    templateObject.datatablerecords.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'departmentList', function(error, result) {
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
                    // setTimeout(function () {
                    //     $('#departmentList').DataTable({
                    //         columnDefs: [
                    //             // {type: 'date', targets: 0},
                    //             // { "orderable": false, "targets": -1 }
                    //         ],
                    //         "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    //         buttons: [
                    //             {
                    //                 extend: 'excelHtml5',
                    //                 text: '',
                    //                 download: 'open',
                    //                 className: "btntabletocsv hiddenColumn",
                    //                 filename: "departmentlist_"+ moment().format(),
                    //                 orientation:'portrait',
                    //                 exportOptions: {
                    //                     columns: ':visible'
                    //                 }
                    //             },{
                    //                 extend: 'print',
                    //                 download: 'open',
                    //                 className: "btntabletopdf hiddenColumn",
                    //                 text: '',
                    //                 title: 'Department List',
                    //                 filename: "departmentlist_"+ moment().format(),
                    //                 exportOptions: {
                    //                     columns: ':visible'
                    //                 }
                    //             }],
                    //         select: true,
                    //         destroy: true,
                    //         colReorder: true,
                    //         colReorder: {
                    //             fixedColumnsRight: 1
                    //         },
                    //         // bStateSave: true,
                    //         // rowId: 0,
                    //         paging: false,
                    //         // "scrollY": "400px",
                    //         // "scrollCollapse": true,
                    //         info: true,
                    //         responsive: true,
                    //         "order": [[ 0, "asc" ]],
                    //         action: function () {
                    //             $('#departmentList').DataTable().ajax.reload();
                    //         },
                    //         "fnDrawCallback": function (oSettings) {
                    //             setTimeout(function () {
                    //                 MakeNegative();
                    //             }, 100);
                    //         },
                    //
                    //     }).on('page', function () {
                    //         setTimeout(function () {
                    //             MakeNegative();
                    //         }, 100);
                    //         let draftRecord = templateObject.datatablerecords.get();
                    //         templateObject.datatablerecords.set(draftRecord);
                    //     }).on('column-reorder', function () {
                    //
                    //     }).on( 'length.dt', function ( e, settings, len ) {
                    //         setTimeout(function () {
                    //             MakeNegative();
                    //         }, 100);
                    //     });
                    //
                    //     // $('#departmentList').DataTable().column( 0 ).visible( true );
                    //     $('.fullScreenSpin').css('display','none');
                    // }, 0);

                    var columns = $('#departmentList th');
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
                    swal({
                        title: 'Oooops 1...',
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
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tdeptclass;
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < useData.length; i++) {
                    // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: useData[i].Id || '',
                        headDept: useData[i].DeptClassGroup || '-',
                        departmentName: useData[i].DeptClassName || '-',
                        description: useData[i].Description || '-',
                        sitecode: useData[i].SiteCode || '-',
                        status: useData[i].Active || 'false',


                    };

                    dataTableList.push(dataList);
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'departmentList', function(error, result) {
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
                // setTimeout(function () {
                //     $('#departmentList').DataTable({
                //         columnDefs: [
                //             // {type: 'date', targets: 0},
                //             // { "orderable": false, "targets": -1 }
                //         ],
                //         "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                //         buttons: [
                //             {
                //                 extend: 'excelHtml5',
                //                 text: '',
                //                 download: 'open',
                //                 className: "btntabletocsv hiddenColumn",
                //                 filename: "departmentlist_"+ moment().format(),
                //                 orientation:'portrait',
                //                 exportOptions: {
                //                     columns: ':visible'
                //                 }
                //             },{
                //                 extend: 'print',
                //                 download: 'open',
                //                 className: "btntabletopdf hiddenColumn",
                //                 text: '',
                //                 title: 'Department List',
                //                 filename: "departmentlist_"+ moment().format(),
                //                 exportOptions: {
                //                     columns: ':visible'
                //                 }
                //             }],
                //         select: true,
                //         destroy: true,
                //         colReorder: true,
                //         colReorder: {
                //             fixedColumnsRight: 1
                //         },
                //         // bStateSave: true,
                //         // rowId: 0,
                //         paging: false,
                //         // "scrollY": "400px",
                //         // "scrollCollapse": true,
                //         info: true,
                //         responsive: true,
                //         "order": [[ 0, "asc" ]],
                //         action: function () {
                //             $('#departmentList').DataTable().ajax.reload();
                //         },
                //         "fnDrawCallback": function (oSettings) {
                //             setTimeout(function () {
                //                 MakeNegative();
                //             }, 100);
                //         },
                //
                //     }).on('page', function () {
                //         setTimeout(function () {
                //             MakeNegative();
                //         }, 100);
                //         let draftRecord = templateObject.datatablerecords.get();
                //         templateObject.datatablerecords.set(draftRecord);
                //     }).on('column-reorder', function () {
                //
                //     }).on( 'length.dt', function ( e, settings, len ) {
                //         setTimeout(function () {
                //             MakeNegative();
                //         }, 100);
                //     });
                //
                //     // $('#departmentList').DataTable().column( 0 ).visible( true );
                //     $('.fullScreenSpin').css('display','none');
                // }, 0);

                var columns = $('#departmentList th');
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
            taxRateService.getDepartment().then(function(data) {
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.tdeptclass.length; i++) {
                    // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: data.tdeptclass[i].Id || '',
                        headDept: data.tdeptclass[i].DeptClassGroup || '-',
                        departmentName: data.tdeptclass[i].DeptClassName || '-',
                        description: data.tdeptclass[i].Description || '-',
                        sitecode: data.tdeptclass[i].SiteCode || '-',
                        status: data.tdeptclass[i].Active || 'false',


                    };

                    dataTableList.push(dataList);
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'departmentList', function(error, result) {
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
                // setTimeout(function () {
                //     $('#departmentList').DataTable({
                //         columnDefs: [
                //             // {type: 'date', targets: 0},
                //             // { "orderable": false, "targets": -1 }
                //         ],
                //         "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                //         buttons: [
                //             {
                //                 extend: 'excelHtml5',
                //                 text: '',
                //                 download: 'open',
                //                 className: "btntabletocsv hiddenColumn",
                //                 filename: "departmentlist_"+ moment().format(),
                //                 orientation:'portrait',
                //                 exportOptions: {
                //                     columns: ':visible'
                //                 }
                //             },{
                //                 extend: 'print',
                //                 download: 'open',
                //                 className: "btntabletopdf hiddenColumn",
                //                 text: '',
                //                 title: 'Department List',
                //                 filename: "departmentlist_"+ moment().format(),
                //                 exportOptions: {
                //                     columns: ':visible'
                //                 }
                //             }],
                //         select: true,
                //         destroy: true,
                //         colReorder: true,
                //         colReorder: {
                //             fixedColumnsRight: 1
                //         },
                //         // bStateSave: true,
                //         // rowId: 0,
                //         paging: false,
                //         // "scrollY": "400px",
                //         // "scrollCollapse": true,
                //         info: true,
                //         responsive: true,
                //         "order": [[ 0, "asc" ]],
                //         action: function () {
                //             $('#departmentList').DataTable().ajax.reload();
                //         },
                //         "fnDrawCallback": function (oSettings) {
                //             setTimeout(function () {
                //                 MakeNegative();
                //             }, 100);
                //         },
                //
                //     }).on('page', function () {
                //         setTimeout(function () {
                //             MakeNegative();
                //         }, 100);
                //         let draftRecord = templateObject.datatablerecords.get();
                //         templateObject.datatablerecords.set(draftRecord);
                //     }).on('column-reorder', function () {
                //
                //     }).on( 'length.dt', function ( e, settings, len ) {
                //         setTimeout(function () {
                //             MakeNegative();
                //         }, 100);
                //     });
                //
                //     // $('#departmentList').DataTable().column( 0 ).visible( true );
                //     $('.fullScreenSpin').css('display','none');
                // }, 0);

                var columns = $('#departmentList th');
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
                swal({
                    title: 'Oooops 2...',
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
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });

    }
    templateObject.getTaxRates();

    templateObject.getDepartments = function() {
        getVS1Data('TDeptClass').then(function(dataObject) {
            if (dataObject.length == 0) {
                taxRateService.getDepartment().then(function(data) {
                    for (let i in data.tdeptclass) {

                        let deptrecordObj = {
                            id: data.tdeptclass[i].Id || ' ',
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
                        id: useData[i].Id || ' ',
                        department: useData[i].DeptClassName || ' ',
                    };

                    deptrecords.push(deptrecordObj);
                    templateObject.deptrecords.set(deptrecords);

                }

            }
        }).catch(function(err) {
            taxRateService.getDepartment().then(function(data) {
                for (let i in data.tdeptclass) {

                    let deptrecordObj = {
                        id: data.tdeptclass[i].Id || ' ',
                        department: data.tdeptclass[i].DeptClassName || ' ',
                    };

                    deptrecords.push(deptrecordObj);
                    templateObject.deptrecords.set(deptrecords);

                }
            });
        });


    }
    templateObject.getDepartments();

    $(document).on('click', '.table-remove', function() {
        event.stopPropagation();
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteLineModal').modal('toggle');
        // if ($('.departmentList tbody>tr').length > 1) {
        // // if(confirm("Are you sure you want to delete this row?")) {
        // this.click;
        // $(this).closest('tr').remove();
        // //} else { }
        // event.preventDefault();
        // return false;
        // }
    });

    $('#departmentList tbody').on('click', 'tr .colDeptID, tr .colHeadDept, tr .colDeptName, tr .colStatus, tr .colDescription, tr .colSiteCode', function() {
        var listData = $(this).closest('tr').attr('id');
        if (listData) {
            $('#add-dept-title').text('Edit Department');
            if (listData !== '') {
                listData = Number(listData);
                //taxRateService.getOneDepartment(listData).then(function (data) {

                var deptID = listData || '';
                //var headerDept = data.fields.DeptClassGroup || '';
                var deptName = $(event.target).closest("tr").find(".colDeptName").text() || '';
                var deptDesc = $(event.target).closest("tr").find(".colDescription").text() || '';
                var siteCode = $(event.target).closest("tr").find(".colSiteCode").text() || '';
                //data.fields.Rate || '';


                $('#edtDepartmentID').val(deptID);
                //$('#sltDepartment').val(headerDept);
                $('#edtDeptName').val(deptName);
                $('#edtDeptName').prop('readonly', true);
                $('#edtDeptDesc').val(deptDesc);
                $('#edtSiteCode').val(siteCode);

                // if (data.fields.StSClass != null) {
                //
                //     var stsmaincontactno = data.fields.StSClass.fields.PrincipleContactPhone || '';
                //     var licensenumber = data.fields.StSClass.fields.LicenseNumber || '';
                //     var principlecontactname = data.fields.StSClass.fields.PrincipleContactName || '';
                //     var defaultroomname = data.fields.StSClass.fields.DefaultBinLocation || '';
                //
                //     $('#stsMainContactNo').val(stsmaincontactno);
                //     $('#stsLicenseNo').val(licensenumber);
                //     $('#sltMainContact').val(principlecontactname);
                //     $('#sltDefaultRoom').val(defaultroomname);
                // }

                //});

                $(this).closest('tr').attr('data-target', '#myModal');
                $(this).closest('tr').attr('data-toggle', 'modal');

            }

        }

    });
});


Template.newdepartmentpop.events({
    'click #btnNewInvoice': function(event) {
        // FlowRouter.go('/invoicecard');
    },
    'click .chkDatatable': function(event) {
        var columns = $('#departmentList th');
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
                    PrefName: 'departmentList'
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
                    PrefName: 'departmentList'
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
                            PrefName: 'departmentList',
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
                        PrefName: 'departmentList',
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
        var datable = $('#departmentList').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function(event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#departmentList th');
        $.each(datable, function(i, v) {

            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettings': function(event) {
        let templateObject = Template.instance();
        var columns = $('#departmentList th');

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
        jQuery('#departmentList_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        sideBarService.getDepartment().then(function(dataReload) {
            addVS1Data('TDeptClass', JSON.stringify(dataReload)).then(function(datareturn) {
                location.reload(true);
            }).catch(function(err) {
                location.reload(true);
            });
        }).catch(function(err) {
            location.reload(true);
        });
    },
    'click .btnAddNewDepart': function() {
        $('#newTaxRate').css('display', 'block');

    },
    'click .btnCloseAddNewDept': function() {
        $('#newTaxRate').css('display', 'none');

    },
    'click .btnDeleteDepartment': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let taxRateService = new TaxRateService();
        let deptId = $('#selectDeleteLineID').val();


        let objDetails = {
            type: "TDeptClass",
            fields: {
                Id: parseInt(deptId),
                Active: false
            }
        };

        taxRateService.saveDepartment(objDetails).then(function(objDetails) {
            sideBarService.getDepartment().then(function(dataReload) {
                addVS1Data('TDeptClass', JSON.stringify(dataReload)).then(function(datareturn) {
                    location.reload(true);
                }).catch(function(err) {
                    location.reload(true);
                });
            }).catch(function(err) {
                location.reload(true);
            });
        }).catch(function(err) {
            swal({
                title: 'Oooops 3...',
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
            $('.fullScreenSpin').css('display', 'none');
        });

    },
    'click .btnSaveDept': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let taxRateService = new TaxRateService();
        let deptID = $('#edtDepartmentID').val();
        let deptName = $('#edtNewDeptName').val();
        // if (deptName === '') {
        //     swal('Department name cannot be blank!', '', 'warning');
        //     $('.fullScreenSpin').css('display', 'none');
        //     e.preventDefault();
        // }

        let deptDesc = $('#edtDeptDesc').val();
        let siteCode = $('#edtSiteCode').val();
        let checkDeptID = '';
        let objDetails = '';
        let objStSDetails = null;

        if (isModuleGreenTrack) {

            let sltMainContact = $('#sltMainContact').val();
            let stsMainContactNo = $('#stsMainContactNo').val();
            let stsLicenseNo = $('#stsLicenseNo').val();
            let sltDefaultRoomName = $('#sltDefaultRoom').val();
            var newbinnum = $("#sltDefaultRoom").find('option:selected').attr('mytagroom');
            objStSDetails = {
                type: "TStSClass",
                fields: {
                    DefaultBinLocation: sltDefaultRoomName || '',
                    DefaultBinNumber: newbinnum || '',
                    LicenseNumber: stsLicenseNo || '',
                    PrincipleContactName: sltMainContact || '',
                    PrincipleContactPhone: stsMainContactNo || ''
                }
            }
        }

        // if (deptName === '') {
        //     Bert.alert('<strong>WARNING:</strong> Department Name cannot be blank!', 'warning');
        //     e.preventDefault();
        // }

        if (deptID == "") {

            taxRateService.checkDepartmentByName(deptName).then(function(data) {
                deptID = data.tdeptclass[0].Id;
                objDetails = {
                    type: "TDeptClass",
                    fields: {
                        ID: parseInt(deptID) || 0,
                        Active: true,
                        //DeptClassGroup: headerDept,
                        //DeptClassName: deptName,
                        Description: deptDesc,
                        SiteCode: siteCode,
                        StSClass: objStSDetails
                    }
                };

                taxRateService.saveDepartment(objDetails).then(function(objDetails) {
                    sideBarService.getDepartment().then(function(dataReload) {
                        $('#sltDept').val(deptName);
                        addVS1Data('TDeptClass', JSON.stringify(dataReload)).then(function(datareturn) {
                            $('#newDepartmentModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        }).catch(function(err) {
                            $('#newDepartmentModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }).catch(function(err) {
                        $('#newDepartmentModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }).catch(function(err) {
                    swal({
                        title: 'Oooops 4...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            // Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });

            }).catch(function(err) {
                objDetails = {
                    type: "TDeptClass",
                    fields: {
                        Active: true,
                        DeptClassName: deptName,
                        Description: deptDesc,
                        SiteCode: siteCode,
                        StSClass: objStSDetails
                    }
                };

                taxRateService.saveDepartment(objDetails).then(function(objDetails) {
                    sideBarService.getDepartment().then(function(dataReload) {
                        $('#sltDept').val(deptName);
                        addVS1Data('TDeptClass', JSON.stringify(dataReload)).then(function(datareturn) {
                            $('#newDepartmentModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        }).catch(function(err) {
                            $('#newDepartmentModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }).catch(function(err) {
                        $('#newDepartmentModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }).catch(function(err) {
                    swal({
                        title: 'Oooops 5...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            // Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            });

        } else {
            objDetails = {
                type: "TDeptClass",
                fields: {
                    ID: parseInt(deptID),
                    Active: true,
                    //  DeptClassGroup: headerDept,
                    DeptClassName: deptName,
                    Description: deptDesc,
                    SiteCode: siteCode,
                    StSClass: objStSDetails
                }
            };

            taxRateService.saveDepartment(objDetails).then(function(objDetails) {
                sideBarService.getDepartment().then(function(dataReload) {
                    $('#sltDept').val(deptName);
                    addVS1Data('TDeptClass', JSON.stringify(dataReload)).then(function(datareturn) {
                        $('#newDepartmentModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    }).catch(function(err) {
                        $('#newDepartmentModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }).catch(function(err) {
                    $('#newDepartmentModal').modal('toggle');
                    $('.fullScreenSpin').css('display', 'none');
                });
            }).catch(function(err) {
                swal({
                    title: 'Oooops 6...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {

                    }
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }




    },
    'click .btnAddDept': function() {
        $('#add-dept-title').text('Add New Department');
        $('#edtDepartmentID').val('');
        $('#edtSiteCode').val('');

        $('#edtDeptName').val('');
        $('#edtDeptName').prop('readonly', false);
        $('#edtDeptDesc').val('');
    },
    'click .btnBack': function(event) {
        event.preventDefault();
        history.back(1);
    },
    'keydown #edtSiteCode, keyup #edtSiteCode': function(event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }

        if (event.shiftKey == true) {

        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190) {
            event.preventDefault();
        } else {
            //event.preventDefault();
        }

    },
    'blur #edtSiteCode': function(event) {
        $(event.target).val($(event.target).val().toUpperCase());

    },
    'click .btnSaveRoom': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let taxRateService = new TaxRateService();

        var parentdept = $('#sltDepartmentList').val();
        var newroomname = $('#newRoomName').val();
        var newroomnum = $('#newRoomNum').val();


        let data = '';

        data = {
            type: "TProductBin",
            fields: {
                BinClassName: parentdept || '',
                BinLocation: newroomname || '',
                BinNumber: newroomnum || ''
            }
        };


        taxRateService.saveRoom(data).then(function(data) {
            window.open('/departmentSettings', '_self');
        }).catch(function(err) {

            $('.fullScreenSpin').css('display', 'none');
        });
    },
});

Template.newdepartmentpop.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.headDept == 'NA') {
                return 1;
            } else if (b.headDept == 'NA') {
                return -1;
            }
            return (a.headDept.toUpperCase() > b.headDept.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'departmentList'
        });
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b) {
            if (a.department == 'NA') {
                return 1;
            } else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    isModuleGreenTrack: () => {
        return isModuleGreenTrack;
    },
    listEmployees: () => {
        return Template.instance().employeerecords.get().sort(function(a, b) {
            if (a.employeename == 'NA') {
                return 1;
            } else if (b.employeename == 'NA') {
                return -1;
            }
            return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
        });
    },
    listBins: () => {
        return Template.instance().roomrecords.get().sort(function(a, b) {
            if (a.roomname == 'NA') {
                return 1;
            } else if (b.roomname == 'NA') {
                return -1;
            }
            return (a.roomname.toUpperCase() > b.roomname.toUpperCase()) ? 1 : -1;
        });
    },
    listDept: () => {
        return Template.instance().departlist.get().sort(function(a, b) {
            if (a.deptname == 'NA') {
                return 1;
            } else if (b.deptname == 'NA') {
                return -1;
            }
            return (a.deptname.toUpperCase() > b.deptname.toUpperCase()) ? 1 : -1;
        });
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
