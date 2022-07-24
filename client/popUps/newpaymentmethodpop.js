import {
    TaxRateService
} from "../settings/settings-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    OrganisationService
} from '../js/organisation-service';
import {
    SideBarService
} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let organisationService = new OrganisationService();
Template.newpaymentmethodpop.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.deptrecords = new ReactiveVar();

    templateObject.includeCreditCard = new ReactiveVar();
    templateObject.includeCreditCard.set(false);

    templateObject.includeAccountID = new ReactiveVar();
    templateObject.includeAccountID.set(false);

    templateObject.accountID = new ReactiveVar();
});

Template.newpaymentmethodpop.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    const deptrecords = [];
    let deptprodlineItems = [];
    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'paymentmethodList', function(error, result) {
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


    templateObject.getOrganisationDetails = function() {
        organisationService.getOrganisationDetail().then((dataListRet) => {
            let account_id = dataListRet.tcompanyinfo[0].Apcano || '';
            let feeMethod = dataListRet.tcompanyinfo[0].DvaABN || ''
            if (feeMethod == "apply") {
                $("#feeOnTopInput").prop("checked", true);
                $("#feeInPriceInput").prop("checked", false);
            } else if (feeMethod == "include") {
                $("#feeOnTopInput").prop("checked", false);
                $("#feeInPriceInput").prop("checked", true);
            } else {
                $("#feeOnTopInput").prop("checked", true);
                $("#feeInPriceInput").prop("checked", false);
            }
            if (dataListRet.tcompanyinfo[0].Apcano == '') {
                templateObject.includeAccountID.set(false);
            } else {
                templateObject.includeAccountID.set(true);
            }

            templateObject.accountID.set(account_id);
        });

    }
    templateObject.getOrganisationDetails();
    templateObject.getTaxRates = function() {
        getVS1Data('TPaymentMethod').then(function(dataObject) {
            if (dataObject.length == 0) {
                taxRateService.getPaymentMethodVS1().then(function(data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                        // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                        var dataList = {
                            id: data.tpaymentmethodvs1[i].Id || '',
                            paymentmethodname: data.tpaymentmethodvs1[i].PaymentMethodName || '',
                            iscreditcard: data.tpaymentmethodvs1[i].IsCreditCard || 'false',
                        };

                        dataTableList.push(dataList);
                        //}
                    }

                    templateObject.datatablerecords.set(dataTableList);

                    if (templateObject.datatablerecords.get()) {

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'paymentmethodList', function(error, result) {
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
                    // setTimeout(function() {
                    //     $('#paymentmethodList').DataTable({
                    //         columnDefs: [{
                    //             "orderable": false,
                    //             "targets": -1
                    //         }],
                    //         select: true,
                    //         destroy: true,
                    //         colReorder: true,
                    //         "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    //         buttons: [{
                    //                 extend: 'csvHtml5',
                    //                 text: '',
                    //                 download: 'open',
                    //                 className: "btntabletocsv hiddenColumn",
                    //                 filename: "paymentmethodList_" + moment().format(),
                    //                 orientation: 'portrait',
                    //                 exportOptions: {
                    //                     columns: ':visible'
                    //                 }
                    //             }, {
                    //                 extend: 'print',
                    //                 download: 'open',
                    //                 className: "btntabletopdf hiddenColumn",
                    //                 text: '',
                    //                 title: 'Payment Method List',
                    //                 filename: "paymentmethodList_" + moment().format(),
                    //                 exportOptions: {
                    //                     columns: ':visible'
                    //                 }
                    //             },
                    //             {
                    //                 extend: 'excelHtml5',
                    //                 title: '',
                    //                 download: 'open',
                    //                 className: "btntabletoexcel hiddenColumn",
                    //                 filename: "paymentmethodList_" + moment().format(),
                    //                 orientation: 'portrait',
                    //                 exportOptions: {
                    //                     columns: ':visible'
                    //                 }
                    //                 // ,
                    //                 // customize: function ( win ) {
                    //                 //   $(win.document.body).children("h1:first").remove();
                    //                 // }
                    //
                    //             }
                    //         ],
                    //         // bStateSave: true,
                    //         // rowId: 0,
                    //         paging: false,
                    //         "scrollY": "400px",
                    //         "scrollCollapse": true,
                    //         info: true,
                    //         responsive: true,
                    //         "order": [
                    //             [0, "asc"]
                    //         ],
                    //         // "aaSorting": [[1,'desc']],
                    //         action: function() {
                    //             $('#paymentmethodList').DataTable().ajax.reload();
                    //         },
                    //         "fnDrawCallback": function(oSettings) {
                    //             setTimeout(function() {
                    //                 MakeNegative();
                    //             }, 100);
                    //         },
                    //
                    //     }).on('page', function() {
                    //         setTimeout(function() {
                    //             MakeNegative();
                    //         }, 100);
                    //         let draftRecord = templateObject.datatablerecords.get();
                    //         templateObject.datatablerecords.set(draftRecord);
                    //     }).on('column-reorder', function() {
                    //
                    //     }).on('length.dt', function(e, settings, len) {
                    //         setTimeout(function() {
                    //             MakeNegative();
                    //         }, 100);
                    //     });
                    //     $('.fullScreenSpin').css('display', 'none');
                    // }, 10);


                    var columns = $('#paymentmethodList th');
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
                let useData = data.tpaymentmethodvs1;
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < useData.length; i++) {
                    // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        paymentmethodname: useData[i].fields.PaymentMethodName || '',
                        iscreditcard: useData[i].fields.IsCreditCard || 'false',
                    };

                    dataTableList.push(dataList);
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'paymentmethodList', function(error, result) {
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
                // setTimeout(function() {
                //     $('#paymentmethodList').DataTable({
                //         columnDefs: [{
                //             "orderable": false,
                //             "targets": -1
                //         }],
                //         select: true,
                //         destroy: true,
                //         colReorder: true,
                //         "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                //         buttons: [{
                //                 extend: 'csvHtml5',
                //                 text: '',
                //                 download: 'open',
                //                 className: "btntabletocsv hiddenColumn",
                //                 filename: "paymentmethodList_" + moment().format(),
                //                 orientation: 'portrait',
                //                 exportOptions: {
                //                     columns: ':visible'
                //                 }
                //             }, {
                //                 extend: 'print',
                //                 download: 'open',
                //                 className: "btntabletopdf hiddenColumn",
                //                 text: '',
                //                 title: 'Payment Method List',
                //                 filename: "paymentmethodList_" + moment().format(),
                //                 exportOptions: {
                //                     columns: ':visible'
                //                 }
                //             },
                //             {
                //                 extend: 'excelHtml5',
                //                 title: '',
                //                 download: 'open',
                //                 className: "btntabletoexcel hiddenColumn",
                //                 filename: "paymentmethodList_" + moment().format(),
                //                 orientation: 'portrait',
                //                 exportOptions: {
                //                     columns: ':visible'
                //                 }
                //                 // ,
                //                 // customize: function ( win ) {
                //                 //   $(win.document.body).children("h1:first").remove();
                //                 // }
                //
                //             }
                //         ],
                //         // bStateSave: true,
                //         // rowId: 0,
                //         paging: false,
                //         "scrollY": "400px",
                //         "scrollCollapse": true,
                //         info: true,
                //         responsive: true,
                //         "order": [
                //             [0, "asc"]
                //         ],
                //         // "aaSorting": [[1,'desc']],
                //         action: function() {
                //             $('#paymentmethodList').DataTable().ajax.reload();
                //         },
                //         "fnDrawCallback": function(oSettings) {
                //             setTimeout(function() {
                //                 MakeNegative();
                //             }, 100);
                //         },
                //
                //     }).on('page', function() {
                //         setTimeout(function() {
                //             MakeNegative();
                //         }, 100);
                //         let draftRecord = templateObject.datatablerecords.get();
                //         templateObject.datatablerecords.set(draftRecord);
                //     }).on('column-reorder', function() {
                //
                //     }).on('length.dt', function(e, settings, len) {
                //         setTimeout(function() {
                //             MakeNegative();
                //         }, 100);
                //     });
                //     $('.fullScreenSpin').css('display', 'none');
                // }, 10);


                var columns = $('#paymentmethodList th');
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
            taxRateService.getPaymentMethodVS1().then(function(data) {
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                    // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                    var dataList = {
                        id: data.tpaymentmethodvs1[i].Id || '',
                        paymentmethodname: data.tpaymentmethodvs1[i].PaymentMethodName || '',
                        iscreditcard: data.tpaymentmethodvs1[i].IsCreditCard || 'false',
                    };

                    dataTableList.push(dataList);
                    //}
                }

                templateObject.datatablerecords.set(dataTableList);

                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'paymentmethodList', function(error, result) {
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
                // setTimeout(function() {
                //     $('#paymentmethodList').DataTable({
                //         columnDefs: [{
                //             "orderable": false,
                //             "targets": -1
                //         }],
                //         select: true,
                //         destroy: true,
                //         colReorder: true,
                //         "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                //         buttons: [{
                //                 extend: 'csvHtml5',
                //                 text: '',
                //                 download: 'open',
                //                 className: "btntabletocsv hiddenColumn",
                //                 filename: "paymentmethodList_" + moment().format(),
                //                 orientation: 'portrait',
                //                 exportOptions: {
                //                     columns: ':visible'
                //                 }
                //             }, {
                //                 extend: 'print',
                //                 download: 'open',
                //                 className: "btntabletopdf hiddenColumn",
                //                 text: '',
                //                 title: 'Payment Method List',
                //                 filename: "paymentmethodList_" + moment().format(),
                //                 exportOptions: {
                //                     columns: ':visible'
                //                 }
                //             },
                //             {
                //                 extend: 'excelHtml5',
                //                 title: '',
                //                 download: 'open',
                //                 className: "btntabletoexcel hiddenColumn",
                //                 filename: "paymentmethodList_" + moment().format(),
                //                 orientation: 'portrait',
                //                 exportOptions: {
                //                     columns: ':visible'
                //                 }
                //                 // ,
                //                 // customize: function ( win ) {
                //                 //   $(win.document.body).children("h1:first").remove();
                //                 // }
                //
                //             }
                //         ],
                //         // bStateSave: true,
                //         // rowId: 0,
                //         paging: false,
                //         "scrollY": "400px",
                //         "scrollCollapse": true,
                //         info: true,
                //         responsive: true,
                //         "order": [
                //             [0, "asc"]
                //         ],
                //         // "aaSorting": [[1,'desc']],
                //         action: function() {
                //             $('#paymentmethodList').DataTable().ajax.reload();
                //         },
                //         "fnDrawCallback": function(oSettings) {
                //             setTimeout(function() {
                //                 MakeNegative();
                //             }, 100);
                //         },
                //
                //     }).on('page', function() {
                //         setTimeout(function() {
                //             MakeNegative();
                //         }, 100);
                //         let draftRecord = templateObject.datatablerecords.get();
                //         templateObject.datatablerecords.set(draftRecord);
                //     }).on('column-reorder', function() {
                //
                //     }).on('length.dt', function(e, settings, len) {
                //         setTimeout(function() {
                //             MakeNegative();
                //         }, 100);
                //     });
                //     $('.fullScreenSpin').css('display', 'none');
                // }, 10);


                var columns = $('#paymentmethodList th');
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

    $(document).ready(function() {
        let url = window.location.href;
        if (url.indexOf("?code") > 0) {
            $('.fullScreenSpin').css('display', 'inline-block');
            url = url.split('?code=');
            var id = url[url.length - 1];

            $.ajax({
                url: 'https://depot.vs1cloud.com/stripe/connect-to-stripe.php',
                data: {
                    'code': id,
                },
                method: 'post',
                success: function(response) {
                    var dataReturnRes = JSON.parse(response);
                    if (dataReturnRes.stripe_user_id) {
                        const templateObject = Template.instance();
                        let stripe_acc_id = dataReturnRes.stripe_user_id;
                        let companyID = 1;

                        var objDetails = {
                            type: "TCompanyInfo",
                            fields: {
                                Id: companyID,
                                Apcano: stripe_acc_id
                            }
                        };
                        organisationService.saveOrganisationSetting(objDetails).then(function(data) {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Stripe Connection Successful',
                                text: "Your stripe account connection is successful",
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'Ok'
                            }).then((result) => {
                                if (result.value) {
                                    window.open('/paymentmethodSettings', '_self');
                                } else if (result.dismiss === 'cancel') {
                                    window.open('/paymentmethodSettings', '_self');
                                } else {
                                    window.open('/paymentmethodSettings', '_self');
                                }
                            });
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                            swal({
                                title: 'Stripe Connection Successful',
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
                        })

                    } else {
                        $('.fullScreenSpin').css('display', 'none');
                        swal({
                            title: 'Oooops...',
                            text: response,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {

                            } else if (result.dismiss === 'cancel') {

                            }
                        });
                    }
                }
            });

        }


        $("#saveStripeID").click(function() {
            $('.fullScreenSpin').css('display', 'inline-block');
            let companyID = 1;
            let feeMethod = "apply";

            if ($('#feeInPriceInput').is(':checked')) {
                feeMethod = "include";
            }

            var objDetails = {
                type: "TCompanyInfo",
                fields: {
                    Id: companyID,
                    DvaABN: feeMethod,
                }
            };
            organisationService.saveOrganisationSetting(objDetails).then(function(data) {
                Session.setPersistent('vs1companyStripeFeeMethod', feeMethod);
                window.open('/paymentmethodSettings', '_self');
            }).catch(function(err) {
                window.open('/paymentmethodSettings', '_self');
            });
        });

    })

    templateObject.getTaxRates();

    $(document).on('click', '.table-remove', function() {
        event.stopPropagation();
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteLineModal').modal('toggle');
        // if ($('.paymentmethodList tbody>tr').length > 1) {
        // // if(confirm("Are you sure you want to delete this row?")) {
        // this.click;
        // $(this).closest('tr').remove();
        // //} else { }
        // event.preventDefault();
        // return false;
        // }
    });

    // $('#paymentmethodList tbody').on('click', 'tr .colName, tr .colIsCreditCard, tr .colStatus', function() {
    //     var listData = $(this).closest('tr').attr('id');
    //     var isCreditcard = false;
    //     if (listData) {
    //         $('#add-paymentmethod-title').text('Edit Payment Method');
    //         //$('#isformcreditcard').removeAttr('checked');
    //         if (listData !== '') {
    //             listData = Number(listData);
    //             //taxRateService.getOnePaymentMethod(listData).then(function (data) {
    //
    //             var paymentMethodID = listData || '';
    //             var paymentMethodName = $(event.target).closest("tr").find(".colName").text() || '';
    //             // isCreditcard = $(event.target).closest("tr").find(".colName").text() || '';
    //
    //             if ($(event.target).closest("tr").find(".colIsCreditCard .chkBox").is(':checked')) {
    //                 isCreditcard = true;
    //             }
    //
    //             $('#edtPaymentMethodID').val(paymentMethodID);
    //             $('#edtName').val(paymentMethodName);
    //
    //             if (isCreditcard == true) {
    //                 templateObject.includeCreditCard.set(true);
    //                 //$('#iscreditcard').prop('checked');
    //             } else {
    //                 templateObject.includeCreditCard.set(false);
    //             }
    //
    //             //});
    //
    //
    //             $(this).closest('tr').attr('data-target', '#myModal');
    //             $(this).closest('tr').attr('data-toggle', 'modal');
    //
    //         }
    //
    //     }
    //
    // });
});


Template.newpaymentmethodpop.events({
    'click .btnSavePaymentMethodPOP': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let taxRateService = new TaxRateService();
        var currentLoc = FlowRouter.current().path;
        let paymentMethodID = $('#edtPaymentMethodID').val()||'';
        let paymentName = $('#edtPaymentMethodName').val();
        let isCreditCard = false;
        if ($('#isformcreditcard').is(':checked')) {
            isCreditCard = true;
        } else {
            isCreditCard = false;
        }
        let objDetails = '';

        if (paymentName === '') {
            $('.fullScreenSpin').css('display', 'none');
            Bert.alert('<strong>WARNING:</strong> Payment Method Name cannot be blank!', 'warning');
            e.preventDefault();
        }

        if (paymentMethodID == "") {
            taxRateService.checkPaymentMethodByName(paymentName).then(function(data) {
                paymentMethodID = data.tpaymentmethod[0].Id;
                objDetails = {
                    type: "TPaymentMethod",
                    fields: {
                        ID: parseInt(paymentMethodID),
                        Active: true,
                        //PaymentMethodName: paymentName,
                        IsCreditCard: isCreditCard,
                        PublishOnVS1: true
                    }
                };

                taxRateService.savePaymentMethod(objDetails).then(function(objDetails) {
                  let selectedDropdownID = $('#selectPaymentMethodLineID').val() || 'sltPaymentMethod';
                  if (currentLoc.includes("/paymentcard")|| currentLoc.includes("/supplierpaymentcard") || currentLoc.includes("/customerscard")
                  || currentLoc.includes("/supplierscard")|| currentLoc.includes("/refundcard")) {
                     $('#'+selectedDropdownID+'').val(paymentName);
                  }else if(currentLoc.includes("/depositcard")){
                      $('#' + selectedDropdownID + " .linePaymentMethod").val(paymentName);
                  };
                  sideBarService.getPaymentMethodDataVS1().then(function(dataReload) {
                      addVS1Data('TPaymentMethod', JSON.stringify(dataReload)).then(function(datareturn) {
                          $('.linePaymentMethod').val(paymentName);
                          $('#newPaymentMethodModal').modal('toggle');
                          $('.fullScreenSpin').css('display', 'none');
                      }).catch(function(err) {
                          $('#newPaymentMethodModal').modal('toggle');
                          $('.fullScreenSpin').css('display', 'none');
                      });
                  }).catch(function(err) {
                      $('#newPaymentMethodModal').modal('toggle');
                      $('.fullScreenSpin').css('display', 'none');
                  });
                }).catch(function(err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            $('#newPaymentMethodModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            }).catch(function(err) {
                objDetails = {
                    type: "TPaymentMethod",
                    fields: {
                        Active: true,
                        PaymentMethodName: paymentName,
                        IsCreditCard: isCreditCard,
                        PublishOnVS1: true
                    }
                };

                taxRateService.savePaymentMethod(objDetails).then(function(objDetails) {

                  let selectedDropdownID = $('#selectPaymentMethodLineID').val() || 'sltPaymentMethod';
                  if (currentLoc.includes("/paymentcard")|| currentLoc.includes("/supplierpaymentcard") || currentLoc.includes("/customerscard")
                  || currentLoc.includes("/supplierscard")|| currentLoc.includes("/refundcard")) {
                     $('#'+selectedDropdownID+'').val(paymentName);
                  }else if(currentLoc.includes("/depositcard")){
                      $('#' + selectedDropdownID + " .linePaymentMethod").val(paymentName);
                  };
                    sideBarService.getPaymentMethodDataVS1().then(function(dataReload) {
                        addVS1Data('TPaymentMethod', JSON.stringify(dataReload)).then(function(datareturn) {
                            $('.linePaymentMethod').val(paymentName);
                            $('#newPaymentMethodModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        }).catch(function(err) {
                            $('#newPaymentMethodModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }).catch(function(err) {
                        $('#newPaymentMethodModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }).catch(function(err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            $('#newPaymentMethodModal').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            });

        } else {
            objDetails = {
                type: "TPaymentMethod",
                fields: {
                    ID: parseInt(paymentMethodID),
                    Active: true,
                    PaymentMethodName: paymentName,
                    IsCreditCard: isCreditCard,
                    PublishOnVS1: true
                }
            };

            taxRateService.savePaymentMethod(objDetails).then(function(objDetails) {
              let selectedDropdownID = $('#selectPaymentMethodLineID').val() || 'sltPaymentMethod';
              if (currentLoc.includes("/paymentcard")|| currentLoc.includes("/supplierpaymentcard") || currentLoc.includes("/customerscard")
              || currentLoc.includes("/supplierscard")|| currentLoc.includes("/refundcard")) {
                 $('#'+selectedDropdownID+'').val(paymentName);
              }else if(currentLoc.includes("/depositcard")){
                  $('#' + selectedDropdownID + " .linePaymentMethod").val(paymentName);
              };
              sideBarService.getPaymentMethodDataVS1().then(function(dataReload) {
                  addVS1Data('TPaymentMethod', JSON.stringify(dataReload)).then(function(datareturn) {
                      $('.linePaymentMethod').val(paymentName);
                      $('#newPaymentMethodModal').modal('toggle');
                      $('.fullScreenSpin').css('display', 'none');
                  }).catch(function(err) {
                      $('#newPaymentMethodModal').modal('toggle');
                      $('.fullScreenSpin').css('display', 'none');
                  });
              }).catch(function(err) {
                  $('#newPaymentMethodModal').modal('toggle');
                  $('.fullScreenSpin').css('display', 'none');
              });
            }).catch(function(err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        $('#newPaymentMethodModal').modal('toggle');
                        $('.fullScreenSpin').css('display', 'none');
                    } else if (result.dismiss === 'cancel') {

                    }
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    }
});

Template.newpaymentmethodpop.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.paymentmethodname == 'NA') {
                return 1;
            } else if (b.paymentmethodname == 'NA') {
                return -1;
            }
            return (a.paymentmethodname.toUpperCase() > b.paymentmethodname.toUpperCase()) ? 1 : -1;
        });
    },
    accountID: () => {
        return Template.instance().accountID.get();
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'paymentmethodList'
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
    includeAccountID: () => {
        return Template.instance().includeAccountID.get();
    },
    includeCreditCard: () => {
        return Template.instance().includeCreditCard.get();
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
