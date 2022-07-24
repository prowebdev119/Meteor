import {ContactService} from "./contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {UtilityService} from "../utility-service";
import XLSX from 'xlsx';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.customerlist.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.selectedFile = new ReactiveVar();
});

Template.customerlist.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let contactService = new ContactService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];

    if(FlowRouter.current().queryParams.success){
        $('.btnRefresh').addClass('btnRefreshAlert');
    }

    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblCustomerlist', function(error, result){
        if(error){

        }else{
            if(result){

                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;
                    // let columnindex = customcolumn[i].index + 1;
                    $("th."+columnClass+"").html(columData);
                    $("th."+columnClass+"").css('width',""+columnWidth+"px");

                }
            }

        }
    });
    templateObject.resetData = function (dataVal) {
        window.open('/customerlist?page=last','_self');
    }
    templateObject.getCustomers = function () {
        getVS1Data('TCustomerVS1').then(function (dataObject) {
            if(dataObject.length == 0){
                sideBarService.getAllCustomersDataVS1(initialBaseDataLoad,0).then(function (data) {
                  addVS1Data('TCustomerVS1',JSON.stringify(data));
                    let lineItems = [];
                    let lineItemObj = {};
                    for(let i=0; i<data.tcustomervs1.length; i++){
                        let arBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.ARBalance)|| 0.00;
                        let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditBalance) || 0.00;
                        let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.Balance)|| 0.00;
                        let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditLimit)|| 0.00;
                        let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.SalesOrderBalance)|| 0.00;
                        var dataList = {
                            id: data.tcustomervs1[i].fields.ID || '',
                            company: data.tcustomervs1[i].fields.Companyname || '',
                            contactname:data.tcustomervs1[i].fields.ContactName || '',
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
                            country: data.tcustomervs1[i].fields.Country || ''
                        };

                        dataTableList.push(dataList);
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

                        $('td').each(function(){
                            if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
                        });
                    };

                    templateObject.datatablerecords.set(dataTableList);

                    if(templateObject.datatablerecords.get()){

                        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblCustomerlist', function(error, result){
                            if(error){

                            }else{
                                if(result){
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.split('.')[1];
                                        let columnWidth = customcolumn[i].width;
                                        let columnindex = customcolumn[i].index + 1;

                                        if(hiddenColumn == true){

                                            $("."+columnClass+"").addClass('hiddenColumn');
                                            $("."+columnClass+"").removeClass('showColumn');
                                        }else if(hiddenColumn == false){
                                            $("."+columnClass+"").removeClass('hiddenColumn');
                                            $("."+columnClass+"").addClass('showColumn');
                                        }

                                    }
                                }

                            }
                        });


                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    }

                    $('.fullScreenSpin').css('display','none');
                    setTimeout(function () {
                        $('#tblCustomerlist').DataTable({

                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [
                                {
                                    extend: 'csvHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "customeroverview_"+ moment().format(),
                                    orientation:'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                },{
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Customer List',
                                    filename: "Customer List - "+ moment().format(),
                                    exportOptions: {
                                        columns: ':visible',
                                        stripHtml: false
                                    }
                                },
                                {
                                    extend: 'excelHtml5',
                                    title: '',
                                    download: 'open',
                                    className: "btntabletoexcel hiddenColumn",
                                    filename: "Customer List - "+ moment().format(),
                                    orientation:'portrait',
                                    exportOptions: {
                                        columns: ':visible'
                                    }

                                }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            // bStateSave: true,
                            // rowId: 0,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "order": [[ 1, "asc" ]],
                            action: function () {
                                $('#tblCustomerlist').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },
                            "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnRefreshCustomers' type='button' id='btnRefreshCustomers' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblCustomerlist_filter");
                        }

                        }).on('page', function () {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.datatablerecords.get();
                            templateObject.datatablerecords.set(draftRecord);
                        }).on('column-reorder', function () {

                        }).on( 'length.dt', function ( e, settings, len ) {
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        });

                        // $('#tblCustomerlist').DataTable().column( 0 ).visible( true );
                        $('.fullScreenSpin').css('display','none');
                    }, 0);

                    var columns = $('#tblCustomerlist th');
                    let sTible = "";
                    let sWidth = "";
                    let sIndex = "";
                    let sVisible = "";
                    let columVisible = false;
                    let sClass = "";
                    $.each(columns, function(i,v) {
                        if(v.hidden == false){
                            columVisible =  true;
                        }
                        if((v.className.includes("hiddenColumn"))){
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
                    $('#tblCustomerlist tbody').on( 'click', 'tr', function () {
                        var listData = $(this).closest('tr').attr('id');
                        var transactiontype = $(this).closest('tr').attr('isjob');
                        var url = FlowRouter.current().path;
                        if(listData){
                            if(url.indexOf('?type') > 0) {
                                if(transactiontype != ""){
                                    FlowRouter.go('/customerscard?jobid=' + listData+"&transTab=job");
                                }else{
                                    FlowRouter.go('/customerscard?id=' + listData+"&transTab=job");
                                }
                            } else {
                                if(transactiontype != ""){
                                    FlowRouter.go('/customerscard?jobid=' + listData);
                                }else{
                                    FlowRouter.go('/customerscard?id=' + listData);
                                }
                            }


                        }
                    });

                }).catch(function (err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display','none');
                    // Meteor._reload.reload();
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcustomervs1;
                let lineItems = [];
                let lineItemObj = {};
                for(let i=0; i<useData.length; i++){
                    let arBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.ARBalance)|| 0.00;
                    let creditBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.CreditBalance) || 0.00;
                    let balance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.Balance)|| 0.00;
                    let creditLimit = utilityService.modifynegativeCurrencyFormat(useData[i].fields.CreditLimit)|| 0.00;
                    let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.SalesOrderBalance)|| 0.00;
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        company: useData[i].fields.Companyname || '',
                        contactname:useData[i].fields.ContactName || '',
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
                        country: useData[i].fields.Country || ''
                    };

                    dataTableList.push(dataList);
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

                    $('td').each(function(){
                        if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
                    });
                };

                templateObject.datatablerecords.set(dataTableList);

                if(templateObject.datatablerecords.get()){

                    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblCustomerlist', function(error, result){
                        if(error){

                        }else{
                            if(result){
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

                                    if(hiddenColumn == true){

                                        $("."+columnClass+"").addClass('hiddenColumn');
                                        $("."+columnClass+"").removeClass('showColumn');
                                    }else if(hiddenColumn == false){
                                        $("."+columnClass+"").removeClass('hiddenColumn');
                                        $("."+columnClass+"").addClass('showColumn');
                                    }

                                }
                            }

                        }
                    });


                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display','none');
                setTimeout(function () {
                    $('#tblCustomerlist').DataTable({

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "customeroverview_"+ moment().format(),
                                orientation:'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },{
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Customer List',
                                filename: "Customer List - "+ moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            },
                            {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "Customer List - "+ moment().format(),
                                orientation:'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }

                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 1, "asc" ]],
                        action: function () {
                            $('#tblCustomerlist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblCustomerlist_ellipsis').addClass('disabled');

                          if(oSettings._iDisplayLength == -1){
                            if(oSettings.fnRecordsDisplay() > 150){
                              $('.paginate_button.page-item.previous').addClass('disabled');
                              $('.paginate_button.page-item.next').addClass('disabled');
                            }
                          }else{

                          }
                          if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }

                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                           .on('click', function(){
                             $('.fullScreenSpin').css('display','inline-block');
                             let dataLenght = oSettings._iDisplayLength;

                             sideBarService.getAllCustomersDataVS1(initialDatatableLoad,oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                               getVS1Data('TCustomerVS1').then(function (dataObjectold) {
                                 if(dataObjectold.length == 0){

                                 }else{
                                   let dataOld = JSON.parse(dataObjectold[0].data);

                                   var thirdaryData = $.merge($.merge([], dataObjectnew.tcustomervs1), dataOld.tcustomervs1);
                                   let objCombineData = {
                                     tcustomervs1:thirdaryData
                                   }


                                     addVS1Data('TCustomerVS1',JSON.stringify(objCombineData)).then(function (datareturn) {
                                       templateObject.resetData(objCombineData);
                                     $('.fullScreenSpin').css('display','none');
                                     }).catch(function (err) {
                                     $('.fullScreenSpin').css('display','none');
                                     });

                                 }
                                }).catch(function (err) {

                                });

                             }).catch(function(err) {
                               $('.fullScreenSpin').css('display','none');
                             });

                           });
                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                          let urlParametersPage = FlowRouter.current().queryParams.page;
                          if(urlParametersPage){
                            this.fnPageChange('last');
                          }

                         },
                         "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnRefreshCustomers' type='button' id='btnRefreshCustomers' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblCustomerlist_filter");
                        }

                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    }).on( 'length.dt', function ( e, settings, len ) {
                      $('.fullScreenSpin').css('display','inline-block');
                      let dataLenght = settings._iDisplayLength;
                      if(dataLenght == -1){
                        if(settings.fnRecordsDisplay() > initialDatatableLoad){
                          $('.fullScreenSpin').css('display','none');
                        }else{
                        sideBarService.getAllCustomersDataVS1('All',1).then(function(dataNonBo) {

                          addVS1Data('TCustomerVS1',JSON.stringify(dataNonBo)).then(function (datareturn) {
                            templateObject.resetData(dataNonBo);
                          $('.fullScreenSpin').css('display','none');
                          }).catch(function (err) {
                          $('.fullScreenSpin').css('display','none');
                          });
                        }).catch(function(err) {
                          $('.fullScreenSpin').css('display','none');
                        });
                       }
                      }else{
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                          $('.fullScreenSpin').css('display','none');
                        }else{
                          sideBarService.getAllCustomersDataVS1(dataLenght,0).then(function(dataNonBo) {

                            addVS1Data('TCustomerVS1',JSON.stringify(dataNonBo)).then(function (datareturn) {
                              templateObject.resetData(dataNonBo);
                            $('.fullScreenSpin').css('display','none');
                            }).catch(function (err) {
                            $('.fullScreenSpin').css('display','none');
                            });
                          }).catch(function(err) {
                            $('.fullScreenSpin').css('display','none');
                          });
                        }
                      }
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#tblCustomerlist').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display','none');
                }, 0);

                var columns = $('#tblCustomerlist th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i,v) {
                    if(v.hidden == false){
                        columVisible =  true;
                    }
                    if((v.className.includes("hiddenColumn"))){
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
                $('#tblCustomerlist tbody').on( 'click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(this).closest('tr').attr('isjob');
                    if(listData){
                        var url = FlowRouter.current().path;
                        if(url.indexOf('?type') > 0) {
                            if(transactiontype != ""){
                                FlowRouter.go('/customerscard?jobid=' + listData+"&transTab=job");
                            }else{
                                FlowRouter.go('/customerscard?id=' + listData+"&transTab=job");
                            }
                        } else {
                            if(transactiontype != ""){
                                FlowRouter.go('/customerscard?jobid=' + listData);
                            }else{
                                FlowRouter.go('/customerscard?id=' + listData);
                            }
                        }


                    }
                });
            }
        }).catch(function (err) {
            sideBarService.getAllCustomersDataVS1(initialBaseDataLoad,0).then(function (data) {
              addVS1Data('TCustomerVS1',JSON.stringify(data));
                let lineItems = [];
                let lineItemObj = {};
                for(let i=0; i<data.tcustomervs1.length; i++){
                    let arBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.ARBalance)|| 0.00;
                    let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditBalance) || 0.00;
                    let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.Balance)|| 0.00;
                    let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditLimit)|| 0.00;
                    let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.SalesOrderBalance)|| 0.00;
                    var dataList = {
                        id: data.tcustomervs1[i].fields.ID || '',
                        company: data.tcustomervs1[i].fields.Companyname || '',
                        contactname:data.tcustomervs1[i].fields.ContactName || '',
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
                        country: data.tcustomervs1[i].fields.Country || ''
                    };

                    dataTableList.push(dataList);
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

                    $('td').each(function(){
                        if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
                    });
                };

                templateObject.datatablerecords.set(dataTableList);

                if(templateObject.datatablerecords.get()){

                    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblCustomerlist', function(error, result){
                        if(error){

                        }else{
                            if(result){
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.split('.')[1];
                                    let columnWidth = customcolumn[i].width;
                                    let columnindex = customcolumn[i].index + 1;

                                    if(hiddenColumn == true){

                                        $("."+columnClass+"").addClass('hiddenColumn');
                                        $("."+columnClass+"").removeClass('showColumn');
                                    }else if(hiddenColumn == false){
                                        $("."+columnClass+"").removeClass('hiddenColumn');
                                        $("."+columnClass+"").addClass('showColumn');
                                    }

                                }
                            }

                        }
                    });


                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                $('.fullScreenSpin').css('display','none');
                setTimeout(function () {
                    $('#tblCustomerlist').DataTable({

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'csvHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "customeroverview_"+ moment().format(),
                                orientation:'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            },{
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Customer List',
                                filename: "Customer List - "+ moment().format(),
                                exportOptions: {
                                    columns: ':visible',
                                    stripHtml: false
                                }
                            },
                            {
                                extend: 'excelHtml5',
                                title: '',
                                download: 'open',
                                className: "btntabletoexcel hiddenColumn",
                                filename: "Customer List - "+ moment().format(),
                                orientation:'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }

                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "order": [[ 0, "asc" ]],
                        action: function () {
                            $('#tblCustomerlist').DataTable().ajax.reload();
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
                    }).on('column-reorder', function () {

                    }).on( 'length.dt', function ( e, settings, len ) {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    });

                    // $('#tblCustomerlist').DataTable().column( 0 ).visible( true );
                    $('.fullScreenSpin').css('display','none');
                }, 0);

                var columns = $('#tblCustomerlist th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function(i,v) {
                    if(v.hidden == false){
                        columVisible =  true;
                    }
                    if((v.className.includes("hiddenColumn"))){
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
                $('#tblCustomerlist tbody').on( 'click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    var transactiontype = $(this).closest('tr').attr('isjob');
                    if(listData){
                        if(transactiontype != ""){
                            FlowRouter.go('/customerscard?jobid=' + listData);
                        }else{
                            FlowRouter.go('/customerscard?id=' + listData);
                        }

                    }
                });

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display','none');
                // Meteor._reload.reload();
            });
        });
    }

    templateObject.getCustomers();

    $('#tblCustomerlist tbody').on( 'click', 'tr', function () {
        var listData = $(this).closest('tr').attr('id');
        var transactiontype = $(this).closest('tr').attr('isjob');
        if(listData){
            if(transactiontype != ""){
                FlowRouter.go('/customerscard?jobid=' + listData);
            }else{
                FlowRouter.go('/customerscard?id=' + listData);
            }

        }

    });


});


Template.customerlist.events({
    'click #btnNewCustomer':function(event){
        FlowRouter.go('/customerscard');
    },
    'click .chkDatatable' : function(event){
        var columns = $('#tblCustomerlist th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function(i,v) {
            let className = v.classList;
            let replaceClass = className[1];

            if(v.innerText == columnDataValue){
                if($(event.target).is(':checked')){
                    $("."+replaceClass+"").css('display','table-cell');
                    $("."+replaceClass+"").css('padding','.75rem');
                    $("."+replaceClass+"").css('vertical-align','top');
                }else{
                    $("."+replaceClass+"").css('display','none');
                }
            }
        });
    },
    'keyup #tblCustomerlist_filter input': function (event) {
          if($(event.target).val() != ''){
            $(".btnRefreshCustomers").addClass('btnSearchAlert');
          }else{
            $(".btnRefreshCustomers").removeClass('btnSearchAlert');
          }
          if (event.keyCode == 13) {
             $(".btnRefreshCustomers").trigger("click");
          }
        },
    'click .btnRefreshCustomers':function(event){
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let tableProductList;
        const dataTableList = [];
        var splashArrayInvoiceList = new Array();
        const lineExtaSellItems = [];
        $('.fullScreenSpin').css('display', 'inline-block');
        let dataSearchName = $('#tblCustomerlist_filter input').val();
        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getNewCustomerByNameOrID(dataSearchName).then(function (data) {
                $(".btnRefreshCustomers").removeClass('btnSearchAlert');
                let lineItems = [];
                let lineItemObj = {};
                if (data.tcustomervs1.length > 0) {
                    for (let i = 0; i < data.tcustomervs1.length; i++) {
                        let arBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.ARBalance)|| 0.00;
                        let creditBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditBalance) || 0.00;
                        let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.Balance)|| 0.00;
                        let creditLimit = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.CreditLimit)|| 0.00;
                        let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.tcustomervs1[i].fields.SalesOrderBalance)|| 0.00;
                        var dataList = {
                            id: data.tcustomervs1[i].fields.ID || '',
                            company: data.tcustomervs1[i].fields.Companyname || '',
                            contactname:data.tcustomervs1[i].fields.ContactName || '',
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
                            country: data.tcustomervs1[i].fields.Country || ''
                        }
                         dataTableList.push(dataList);
                    }

                    templateObject.datatablerecords.set(dataTableList);

                    let item = templateObject.datatablerecords.get();
                    $('.fullScreenSpin').css('display', 'none');
                    if (dataTableList) {
                        var datatable = $('#tblCustomerlist').DataTable();
                        $("#tblCustomerlist > tbody").empty();
                        for (let x = 0; x < item.length; x++) {
                            $("#tblCustomerlist > tbody").append(
                                ' <tr class="dnd-moved" id="' + item[x].id + '" style="cursor: pointer;">' +
                                '<td contenteditable="false" class="colCompany">' + item[x].company + '</td>' +
                                '<td contenteditable="false" class="colJob" >' + item[x].job + '</td>' +
                                '<td contenteditable="false" class="colPhone">' + item[x].phone + '</td>' +
                                '<td contenteditable="false" class="colARBalance" >' + item[x].arbalance + '</td>' +
                                '<td contenteditable="false" class="colCreditBalance">' + item[x].creditbalance + '</td>' +
                                '<td contenteditable="false" class="colBalance">' + item[x].balance + '</td>' +
                                '<td contenteditable="false" class="colCreditLimit">' + item[x].creditlimit + '</td>' +
                                '<td contenteditable="false" class="colSalesOrderBalance">' + item[x].salesorderbalance + '</td>' +
                                '<td contenteditable="false" class="colCountry">' + item[x].country + '</td>' +
                                '<td contenteditable="false" class="colEmail">' + item[x].email + '</td>' +
                                '<td contenteditable="false" class="colAccountNo hiddenColumn">' + item[x].accountno + '</td>' +
                                '<td contenteditable="false" class="colClientNo hiddenColumn">' + item[x].clientno + '</td>' +
                                '<td contenteditable="false" class="colJobTitle hiddenColumn">' + item[x].jobtitle + '</td>' +
                                '<td contenteditable="false" class="colNotes">' + item[x].notes + '</td>' +
                                '</tr>');

                        }
                        $('.dataTables_info').html('Showing 1 to ' + data.tcustomervs1.length + ' of ' + data.tcustomervs1.length + ' entries');

                    }
                } else {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Question',
                        text: "Customer does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            FlowRouter.go('/customerscard');
                        } else if (result.dismiss === 'cancel') {
                            //$('#productListModal').modal('toggle');
                        }
                    });
                }

            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
          $(".btnRefresh").trigger("click");
        }
    },
    'click .resetTable' : function(event){
        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblCustomerlist'});
                if (checkPrefDetails) {
                    CloudPreference.remove({_id:checkPrefDetails._id}, function(err, idTag) {
                        if (err) {

                        }else{
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable' : function(event){
        let lineItems = [];
        $('.columnSettings').each(function (index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumn").text()||'';
            var colWidth = $tblrow.find(".custom-range").val()||0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate")||'';
            var colHidden = false;
            if($tblrow.find(".custom-control-input").is(':checked')){
                colHidden = false;
            }else{
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
        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblCustomerlist'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'salesform',PrefName:'tblCustomerlist',published:true,
                                                                               customFields:lineItems,
                                                                               updatedAt: new Date() }}, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');
                        }
                    });

                }else{
                    CloudPreference.insert({ userid: clientID,username:clientUsername,useremail:clientEmail,
                                            PrefGroup:'salesform',PrefName:'tblCustomerlist',published:true,
                                            customFields:lineItems,
                                            createdAt: new Date() }, function(err, idTag) {
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
    'blur .divcolumn' : function(event){
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#tblCustomerlist').DataTable();
        var title = datable.column( columnDatanIndex ).header();
        $(title).html(columData);

    },
    'change .rngRange' : function(event){
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblCustomerlist th');
        $.each(datable, function(i,v) {
            if(v.innerText == columnDataValue){
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("."+replaceClass+"").css('width',range+'px');

            }
        });

    },
    'click .btnOpenSettings' : function(event){
        let templateObject = Template.instance();
        var columns = $('#tblCustomerlist th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i,v) {
            if(v.hidden == false){
                columVisible =  true;
            }
            if((v.className.includes("hiddenColumn"))){
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
        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblCustomerlist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');

    },
    'click .exportbtnExcel': function () {
        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblCustomerlist_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display','none');
    },
    'click .printConfirm' : function(event){

        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblCustomerlist_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display','none');
    },
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        sideBarService.getAllCustomersDataVS1(initialBaseDataLoad,0).then(function(data) {
            addVS1Data('TCustomerVS1',JSON.stringify(data)).then(function (datareturn) {
                setTimeout(function () {
                    window.open('/customerlist','_self');
                }, 2000);
            }).catch(function (err) {
                setTimeout(function () {
                    window.open('/customerlist','_self');
                }, 2000);
            });
        }).catch(function(err) {
            setTimeout(function () {
                window.open('/customerlist','_self');
            }, 2000);
        });

        sideBarService.getAllJobssDataVS1(initialBaseDataLoad,0).then(function(data) {
            addVS1Data('TJobVS1',JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function(err) {

        });

        sideBarService.getClientTypeData().then(function(data) {
            addVS1Data('TClientType',JSON.stringify(data));
        }).catch(function(err) {

        });
    },
    'click .templateDownload': function () {
        let utilityService = new UtilityService();
        let rows =[];
        const filename = 'SampleCustomer'+'.csv';
        rows[0]= ['Company','First Name', 'Last Name', 'Phone','Mobile', 'Email','Skype', 'Street', 'City/Suburb', 'State', 'Post Code', 'Country', 'Tax Code'];
        rows[1]= ['ABC Company','John', 'Smith', '9995551213','9995551213', 'johnsmith@email.com','johnsmith', '123 Main Street', 'Brooklyn', 'New York', '1234', 'United States', 'NT'];
        utilityService.exportToCsv(rows, filename, 'csv');
    },
    'click .btnUploadFile':function(event){
        $('#attachment-upload').val('');
        $('.file-name').text('');
        //$(".btnImport").removeAttr("disabled");
        $('#attachment-upload').trigger('click');

    },
    'click .templateDownloadXLSX': function (e) {

        e.preventDefault();  //stop the browser from following
        window.location.href = 'sample_imports/SampleCustomer.xlsx';
    },
    'change #attachment-upload': function (e) {
        let templateObj = Template.instance();
        var filename = $('#attachment-upload')[0].files[0]['name'];
        var fileExtension = filename.split('.').pop().toLowerCase();
        var validExtensions = ["csv","txt","xlsx"];
        var validCSVExtensions = ["csv","txt"];
        var validExcelExtensions = ["xlsx","xls"];

        if (validExtensions.indexOf(fileExtension) == -1) {
            // Bert.alert('<strong>formats allowed are : '+ validExtensions.join(', ')+'</strong>!', 'danger');
            swal('Invalid Format', 'formats allowed are :' + validExtensions.join(', '), 'error');
            $('.file-name').text('');
            $(".btnImport").Attr("disabled");
        }else if(validCSVExtensions.indexOf(fileExtension) != -1){

            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            templateObj.selectedFile.set(selectedFile);
            if($('.file-name').text() != ""){
                $(".btnImport").removeAttr("disabled");
            }else{
                $(".btnImport").Attr("disabled");
            }
        }else if(fileExtension == 'xlsx'){
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
                var workbook = XLSX.read(data, {type: 'array'});

                var result = {};
                workbook.SheetNames.forEach(function (sheetName) {
                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
                    var sCSV = XLSX.utils.make_csv(workbook.Sheets[sheetName]);
                    templateObj.selectedFile.set(sCSV);

                    if (roa.length) result[sheetName] = roa;
                });
                // see the result, caution: it works after reader event is done.

            };
            reader.readAsArrayBuffer(oFile);

            if($('.file-name').text() != ""){
                $(".btnImport").removeAttr("disabled");
            }else{
                $(".btnImport").Attr("disabled");
            }

        }



    },
    'click .btnImport' : function () {
        $('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        let contactService = new ContactService();
        let objDetails;
        let firstName= '';
        let lastName = '';
        let taxCode = '';

        Papa.parse(templateObject.selectedFile.get(), {
            complete: function(results) {

                if(results.data.length > 0){
                    if((results.data[0][0] == "Company") && (results.data[0][1] == "First Name")
                       && (results.data[0][2] == "Last Name") && (results.data[0][3] == "Phone")
                       && (results.data[0][4] == "Mobile") && (results.data[0][5] == "Email")
                       && (results.data[0][6] == "Skype") && (results.data[0][7] == "Street")
                       && (results.data[0][8] == "Street2" || results.data[0][8] == "City/Suburb") && (results.data[0][9] == "State")
                       && (results.data[0][10] == "Post Code") && (results.data[0][11] == "Country")) {

                        let dataLength = results.data.length * 500;
                        setTimeout(function(){
                          window.open('/customerlist?success=true','_self');
                          $('.fullScreenSpin').css('display','none');
                        },parseInt(dataLength));

                        for (let i = 0; i < results.data.length -1; i++) {
                          firstName = results.data[i+1][1] !== undefined? results.data[i+1][1] :'';
                          lastName = results.data[i+1][2]!== undefined? results.data[i+1][2] :'';
                          taxCode = results.data[i+1][12]!== undefined? results.data[i+1][12] :'NT';
                            objDetails = {
                                type: "TCustomer",
                                fields:
                                {
                                    ClientName: results.data[i+1][0]||'',
                                    FirstName: firstName || '',
                                    LastName: lastName|| '',
                                    Phone: results.data[i+1][3]||'',
                                    Mobile: results.data[i+1][4]||'',
                                    Email: results.data[i+1][5]||'',
                                    SkypeName: results.data[i+1][6]||'',
                                    Street: results.data[i+1][7]||'',
                                    Street2: results.data[i+1][8]||'',
                                    Suburb: results.data[i+1][8]||'',
                                    State: results.data[i+1][9]||'',
                                    PostCode:results.data[i+1][10]||'',
                                    Country:results.data[i+1][11]||'',

                                    BillStreet: results.data[i+1][7]||'',
                                    BillStreet2: results.data[i+1][8]||'',
                                    BillState: results.data[i+1][9]||'',
                                    BillPostCode:results.data[i+1][10]||'',
                                    Billcountry:results.data[i+1][11]||'',
                                    TaxCodeName:taxCode||'NT',
                                    PublishOnVS1: true
                                }
                            };
                            if(results.data[i+1][0]){
                                if(results.data[i+1][0] !== "") {
                                    contactService.saveCustomer(objDetails).then(function (data) {
                                        //$('.fullScreenSpin').css('display','none');
                                        //Meteor._reload.reload();
                                    }).catch(function (err) {
                                        //$('.fullScreenSpin').css('display','none');
                                        swal({
                                            title: 'Oooops...',
                                            text: err,
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {
                                                window.open('/customerlist?success=true','_self');
                                            } else if (result.dismiss === 'cancel') {
                                              window.open('/customerlist?success=true','_self');
                                            }
                                        });
                                    });
                                }
                            }
                        }

                    }else{
                        $('.fullScreenSpin').css('display','none');
                        // Bert.alert('<strong> Data Mapping fields invalid. </strong> Please check that you are importing the correct file with the correct column headers.', 'danger');
                        swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                    }
                }else{
                    $('.fullScreenSpin').css('display','none');
                    // Bert.alert('<strong> Data Mapping fields invalid. </strong> Please check that you are importing the correct file with the correct column headers.', 'danger');
                    swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                }

            }
        });
    }

});

Template.customerlist.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.company == 'NA') {
                return 1;
            }
            else if (b.company == 'NA') {
                return -1;
            }
            return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblCustomerlist'});
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
