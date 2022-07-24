import {PurchaseBoardService} from './purchase-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {DashBoardService} from "../Dashboard/dashboard-service";
import {UtilityService} from "../utility-service";
import {ProductService} from "../product/product-service";
import {AccountService} from "../accounts/account-service";
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';

import { Random } from 'meteor/random';
import { jsPDF } from 'jspdf';
import 'jQuery.print/jQuery.print.js';
import { autoTable }from 'jspdf-autotable';

import {TaxRateService} from "../settings/settings-service";
import 'jquery-editable-select';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.depositcard.onCreated(()=>{
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.CleintName = new ReactiveVar();
    templateObject.Department = new ReactiveVar();
    templateObject.Date = new ReactiveVar();
    templateObject.DueDate = new ReactiveVar();
    templateObject.BillNo = new ReactiveVar();
    templateObject.RefNo = new ReactiveVar();
    templateObject.Branding = new ReactiveVar();
    templateObject.Currency = new ReactiveVar();
    templateObject.Total = new ReactiveVar();
    templateObject.Subtotal = new ReactiveVar();
    templateObject.TotalTax = new ReactiveVar();
    templateObject.record = new ReactiveVar({});
    templateObject.taxrateobj = new ReactiveVar();
    templateObject.Accounts = new ReactiveVar([]);
    templateObject.BillId = new ReactiveVar();
    templateObject.selectedCurrency = new ReactiveVar([]);
    templateObject.inputSelectedCurrency = new ReactiveVar([]);
    templateObject.currencySymbol = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();

    templateObject.termrecords = new ReactiveVar();
    templateObject.clientrecords = new ReactiveVar([]);
    templateObject.taxraterecords = new ReactiveVar([]);


    templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();

    templateObject.address = new ReactiveVar();
    templateObject.abn = new ReactiveVar();
    templateObject.referenceNumber = new ReactiveVar();

    templateObject.statusrecords = new ReactiveVar([]);

    templateObject.totalCredit = new ReactiveVar();
    templateObject.totalCredit.set(Currency+ '0.00');
    templateObject.totalDebit = new ReactiveVar();
    templateObject.totalDebit.set(Currency+ '0.00');
    templateObject.accountnamerecords = new ReactiveVar();
    templateObject.datatablepaymentlistrecords = new ReactiveVar([]);

    setTimeout(function () {

        var x = window.matchMedia("(max-width: 1024px)");

        function mediaQuery(x) {
            if (x.matches) {

                $("#colDate").removeClass("col-1");
                $("#colDate").addClass("col-4");
                $("#colDepartment").removeClass("col-2");
                $("#colDepartment").addClass("col-4");
                $("#colEntryNo").removeClass("col-2");
                $("#colEntryNo").addClass("col-4");
                $("#colMemo").removeClass("col-5");
                $("#colMemo").addClass("col-12");

            }
        }
        mediaQuery(x);
        x.addListener(mediaQuery)
    }, 10);

    setTimeout(function () {

        var x = window.matchMedia("(max-width: 420px)");

        function mediaQuery(x) {
            if (x.matches) {

                $("#colDate").removeClass("col-1");
                $("#colDate").addClass("col-12");
                $("#colDepartment").removeClass("col-2");
                $("#colDepartment").addClass("col-12");
                $("#colEntryNo").removeClass("col-2");
                $("#colEntryNo").addClass("col-12");
                $("#colMemo").removeClass("col-5");
                $("#colMemo").addClass("col-12");

            }
        }
        mediaQuery(x);
        x.addListener(mediaQuery)
    }, 10);

});

Template.depositcard.onRendered(()=>{
    let imageData= (localStorage.getItem("Image"));
    if(imageData)
    {
        $('.uploadedImage').attr('src', imageData);
    }
    const templateObject = Template.instance();
    const records =[];
    let purchaseService = new PurchaseBoardService();
    let clientsService = new PurchaseBoardService();
    let productsService = new PurchaseBoardService();
    let taxRateService = new TaxRateService();
    const dataTableList = [];

    const clientList = [];
    const productsList = [];
    const accountsList = [];
    const deptrecords = [];

    const termrecords = [];
    const statusList = [];
    let newDepositId = '';

    templateObject.getAllDepositIds = function () {
        purchaseService.getDepositEntryIds().then(function (data) {
            let latestPOId;
            if(data.tvs1bankdeposit.length){
                let lastElement = data.tvs1bankdeposit[data.tvs1bankdeposit.length - 1];
                latestPOId =(lastElement.Id);
            }else{
                latestPOId = 0;
            }

            newDepositId = (latestPOId + 1);
            $('#edtEnrtyNo').val(newDepositId);

        }).catch(function (err) {
            newDepositId = 0;
            $('#edtEnrtyNo').val(newDepositId);
        });
    };



    setTimeout(function () {
      $("#date-input,#dtSODate,#dtTransDate").datepicker({
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

/*
     jQuery(document).ready(function($) {

        if (window.history && window.history.pushState) {

    window.history.pushState('forward', null, FlowRouter.current().path);

    $(window).on('popstate', function() {
      swal({
               title: 'Save Or Cancel To Continue',
              text: "Do you want to Save or Cancel this transaction?",
              type: 'question',
              showCancelButton: true,
              confirmButtonText: 'Save'
          }).then((result) => {
              if (result.value) {
                  $(".btnSave").trigger("click");
              } else if (result.dismiss === 'cancel') {
                  let lastPageVisitUrl = window.location.pathname;
                  if (FlowRouter.current().oldRoute) {
                      lastPageVisitUrl = FlowRouter.current().oldRoute.path;
                  } else {
                      lastPageVisitUrl = window.location.pathname;
                  }
                 //FlowRouter.go(lastPageVisitUrl);
                  window.open(lastPageVisitUrl, '_self');
              } else {}
          });
    });

  }
    });
    */

    $('.fullScreenSpin').css('display','inline-block');
    templateObject.getAllClients = function(){
        clientsService.getSupplierVS1().then(function(data){
            for(let i in data.tsuppliervs1){

                let supplierrecordObj = {
                    supplierid: data.tsuppliervs1[i].Id || ' ',
                    suppliername: data.tsuppliervs1[i].ClientName || ' ',
                    supplieremail: data.tsuppliervs1[i].Email || ' ',
                    street : data.tsuppliervs1[i].Street || ' ',
                    street2 : data.tsuppliervs1[i].Street2 || ' ',
                    street3 : data.tsuppliervs1[i].Street3 || ' ',
                    suburb : data.tsuppliervs1[i].Suburb || ' ',
                    statecode : data.tsuppliervs1[i].State +' '+data.tsuppliervs1[i].Postcode || ' ',
                    country : data.tsuppliervs1[i].Country || ' '
                };

                clientList.push(supplierrecordObj);

                $('#edtSupplierName').editableSelect('add',data.tsuppliervs1[i].ClientName);
            }
            templateObject.clientrecords.set(clientList);


        });
    };

    templateObject.getPaymentMetod = function () {

      getVS1Data('TPaymentMethod').then(function (dataObject) {
        if(dataObject.length == 0){
          const dataTableList = [];
          taxRateService.getPaymentMethodVS1().then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            for(let i=0; i<data.tpaymentmethodvs1.length; i++){

                 var dataList = {
                   id: data.tpaymentmethodvs1[i].Id || '',
                   paymentmethodname: data.tpaymentmethodvs1[i].PaymentMethodName || '',
                   iscreditcard: data.tpaymentmethodvs1[i].IsCreditCard || 'false',
               };

                dataTableList.push(dataList);

            }

            templateObject.datatablepaymentlistrecords.set(dataTableList);

            if(templateObject.datatablerecords.get()){

              Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblpaymentmethodList', function(error, result){
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
                $('#tblpaymentmethodList').DataTable({
                      columnDefs: [
                         { "orderable": false, "targets": -1 }
                       ],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      buttons: [
                            {
                         extend: 'csvHtml5',
                         text: '',
                         download: 'open',
                         className: "btntabletocsv hiddenColumn",
                         filename: "tblpaymentmethodList_"+ moment().format(),
                         orientation:'portrait',
                          exportOptions: {
                          columns: ':visible'
                        }
                      },{
                          extend: 'print',
                          download: 'open',
                          className: "btntabletopdf hiddenColumn",
                          text: '',
                          title: 'Payment Method List',
                          filename: "tblpaymentmethodList_"+ moment().format(),
                          exportOptions: {
                          columns: ':visible'
                        }
                      },
                      {
                       extend: 'excelHtml5',
                       title: '',
                       download: 'open',
                       className: "btntabletoexcel hiddenColumn",
                       filename: "tblpaymentmethodList_"+ moment().format(),
                       orientation:'portrait',
                        exportOptions: {
                        columns: ':visible'
                      }





                      }],


                      paging: false,
                      // "scrollY": "400px",
                      // "scrollCollapse": true,
                      info: true,
                      responsive: true,
                      "order": [[ 0, "asc" ]],

                      action: function () {
                          $('#tblpaymentmethodList').DataTable().ajax.reload();
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
                  $('.fullScreenSpin').css('display','none');
              }, 10);


              var columns = $('#tblpaymentmethodList th');
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

          }).catch(function (err) {

              $('.fullScreenSpin').css('display','none');

          });
        }else{
          const dataTableList = [];
        let data = JSON.parse(dataObject[0].data);
        let useData = data.tpaymentmethodvs1;
        let lineItems = [];
  let lineItemObj = {};
  for(let i=0; i<useData.length; i++){

       var dataList = {
         id: useData[i].fields.ID || '',
         paymentmethodname: useData[i].fields.PaymentMethodName || '',
         iscreditcard: useData[i].fields.IsCreditCard || 'false',
     };

      dataTableList.push(dataList);

  }

  templateObject.datatablepaymentlistrecords.set(dataTableList);

  if(templateObject.datatablerecords.get()){

    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblpaymentmethodList', function(error, result){
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
      $('#tblpaymentmethodList').DataTable({
            columnDefs: [
               { "orderable": false, "targets": -1 }
             ],
            select: true,
            destroy: true,
            colReorder: true,
            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
            buttons: [
                  {
               extend: 'csvHtml5',
               text: '',
               download: 'open',
               className: "btntabletocsv hiddenColumn",
               filename: "tblpaymentmethodList_"+ moment().format(),
               orientation:'portrait',
                exportOptions: {
                columns: ':visible'
              }
            },{
                extend: 'print',
                download: 'open',
                className: "btntabletopdf hiddenColumn",
                text: '',
                title: 'Payment Method List',
                filename: "tblpaymentmethodList_"+ moment().format(),
                exportOptions: {
                columns: ':visible'
              }
            },
            {
             extend: 'excelHtml5',
             title: '',
             download: 'open',
             className: "btntabletoexcel hiddenColumn",
             filename: "tblpaymentmethodList_"+ moment().format(),
             orientation:'portrait',
              exportOptions: {
              columns: ':visible'
            }





            }],


            paging: false,
            // "scrollY": "400px",
            // "scrollCollapse": true,
            info: true,
            responsive: true,
            "order": [[ 0, "asc" ]],

            action: function () {
                $('#tblpaymentmethodList').DataTable().ajax.reload();
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
        $('.fullScreenSpin').css('display','none');
    }, 10);


    var columns = $('#tblpaymentmethodList th');
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

        }
      }).catch(function (err) {
        taxRateService.getPaymentMethodVS1().then(function (data) {
          let lineItems = [];
          let lineItemObj = {};
          for(let i=0; i<data.tpaymentmethodvs1.length; i++){

               var dataList = {
                 id: data.tpaymentmethodvs1[i].Id || '',
                 paymentmethodname: data.tpaymentmethodvs1[i].PaymentMethodName || '',
                 iscreditcard: data.tpaymentmethodvs1[i].IsCreditCard || 'false',
             };

              dataTableList.push(dataList);

          }

          templateObject.datatablepaymentlistrecords.set(dataTableList);

          if(templateObject.datatablerecords.get()){

            Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblpaymentmethodList', function(error, result){
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
              $('#tblpaymentmethodList').DataTable({
                    columnDefs: [
                       { "orderable": false, "targets": -1 }
                     ],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [
                          {
                       extend: 'csvHtml5',
                       text: '',
                       download: 'open',
                       className: "btntabletocsv hiddenColumn",
                       filename: "tblpaymentmethodList_"+ moment().format(),
                       orientation:'portrait',
                        exportOptions: {
                        columns: ':visible'
                      }
                    },{
                        extend: 'print',
                        download: 'open',
                        className: "btntabletopdf hiddenColumn",
                        text: '',
                        title: 'Payment Method List',
                        filename: "tblpaymentmethodList_"+ moment().format(),
                        exportOptions: {
                        columns: ':visible'
                      }
                    },
                    {
                     extend: 'excelHtml5',
                     title: '',
                     download: 'open',
                     className: "btntabletoexcel hiddenColumn",
                     filename: "tblpaymentmethodList_"+ moment().format(),
                     orientation:'portrait',
                      exportOptions: {
                      columns: ':visible'
                    }





                    }],


                    paging: false,
                    "scrollY": "400px",
                    "scrollCollapse": true,
                    info: true,
                    responsive: true,
                    "order": [[ 0, "asc" ]],

                    action: function () {
                        $('#tblpaymentmethodList').DataTable().ajax.reload();
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
                $('.fullScreenSpin').css('display','none');
            }, 10);


            var columns = $('#tblpaymentmethodList th');
            let sTible = "";
            let sWidth = "";
            let sIndex = "";
            let sVisible = "";
            let columVisible = false;
            let sClass = "";
            $.each(columns, function(i,v) {
              if(v.hidden === false){
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

        }).catch(function (err) {

            $('.fullScreenSpin').css('display','none');

        });
      });


    };

    // templateObject.getPaymentMetod();

    setTimeout(function () {

    }, 500);
    var url = FlowRouter.current().path;
    if(url.indexOf('?id=') > 0){
        var getso_id = url.split('?id=');
        var currentDeposit = getso_id[getso_id.length-1];
        if(getso_id[1]){
            currentDeposit = parseInt(currentDeposit);
            templateObject.getDepositData = function () {
              getVS1Data('TVS1BankDeposit').then(function (dataObject) {
              if(dataObject.length === 0){
                purchaseService.getOneDepositEnrtyData(currentDeposit).then(function (data) {
                    $('.fullScreenSpin').css('display','none');
                    let lineItems = [];
                    let lineItemObj = {};
                    let lineItemsTable = [];
                    let lineItemTableObj = {};
                    let currencySymbol = Currency;
                    let department = data.fields.Lines[0].fields.DeptName;
                    let totalDeposit = utilityService.modifynegativeCurrencyFormat(data.fields.Deposit)|| 0.00;
                    if(data.fields.Lines != null){
                    if(data.fields.Lines.length){
                        for(let i=0; i<data.fields.Lines.length; i++){
                            let lineAmount = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.Amount)|| 0.00;

                            lineItemObj = {
                                lineID :Random.id(),
                                id: data.fields.Lines[i].fields.ID || '',
                                accountname: data.fields.Lines[i].fields.AccountName || data.fields.AccountName|| '',
                                accountno: data.fields.Lines[i].fields.AccountNumber || '',
                                memo: data.fields.Lines[i].fields.ReferenceNo || '',
                                lineamount:  lineAmount || 0,
                                companyname:data.fields.Lines[i].fields.CompanyName || '',
                                paymentmethod: data.fields.Lines[i].fields.PaymentMethod || ''

                            };


                            lineItems.push(lineItemObj);
                        }
                    }
                    }

                    let record = {
                        id : data.fields.ID,
                        lid : 'Edit Deposit' + ' '+ data.fields.ID,
                        accountname : data.fields.AccountName||'',
                        memo : data.fields.Notes,
                        department : department,
                        entryno : data.fields.ID,
                        deposittotal: totalDeposit||0.00,
                        transdate : data.fields.DepositDate ? moment(data.fields.DepositDate).format('DD/MM/YYYY') : "",
                        LineItems: lineItems,
                        isReconciled:data.fields.Reconciled
                    };
                    if(data.fields.Reconciled){
                      $(".btnDeleteDepositEntry").prop("disabled", true);
                      $(".btnDelete").prop("disabled", true);
                      $(".btnSave").prop("disabled", true);
                      $("#form :input").prop("disabled", true);
                      $(".btn-light").prop("disabled", false);
                      $(".close").prop("disabled", false);
                    }


                    $(".printConfirm").prop("disabled", false);
                    $(".btnBack").prop("disabled", false);
                    templateObject.record.set(record);

                    $('#sltAccountName').val(data.fields.AccountName);

                    if(templateObject.record.get()){
                        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblDepositEntryLine', function(error, result){
                            if(error){


                            }else{
                                if(result){
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass;
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                        let columnWidth = customcolumn[i].width;


                                        $(""+columHeaderUpdate+"").html(columData);
                                        if(columnWidth !== 0){
                                            $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
                                        }

                                        if(hiddenColumn === true){

                                            $("."+columnClass+"").addClass('hiddenColumn');
                                            $("."+columnClass+"").removeClass('showColumn');
                                            $(".chk"+columnClass+"").removeAttr('checked');
                                        }else if(hiddenColumn === false){
                                            $("."+columnClass+"").removeClass('hiddenColumn');
                                            $("."+columnClass+"").addClass('showColumn');
                                            $(".chk"+columnClass+"").attr('checked','checked');

                                        }

                                    }
                                }

                            }
                        });
                    }
                }).catch(function (err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                        else if (result.dismiss === 'cancel') {

                        }
                    });
                    $('.fullScreenSpin').css('display','none');

                });
              }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tvs1bankdeposit;
                var added=false;
                for(let d=0; d<useData.length; d++){
                  if(parseInt(useData[d].fields.ID) === currentDeposit){
                    added = true;

                    $('.fullScreenSpin').css('display','none');

              let lineItems = [];
              let lineItemObj = {};
              let lineItemsTable = [];
              let lineItemTableObj = {};
              let currencySymbol = Currency;
              let department = useData[d].fields.Lines[0].fields.DeptName;
              let totalDeposit = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Deposit)|| 0.00;

              if(useData[d].fields.Lines.length){
                  for(let i=0; i<useData[d].fields.Lines.length; i++){
                      let lineAmount = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.Amount)|| 0.00;

                      lineItemObj = {
                          lineID :Random.id(),
                          id: useData[d].fields.Lines[i].fields.ID || '',
                          accountname: useData[d].fields.Lines[i].fields.AccountName || useData[d].fields.AccountName|| '',
                          accountno: useData[d].fields.Lines[i].fields.AccountNumber || '',
                          memo: useData[d].fields.Lines[i].fields.ReferenceNo || '',
                          lineamount:  lineAmount || 0,
                          companyname:useData[d].fields.Lines[i].fields.CompanyName || '',
                          paymentmethod: useData[d].fields.Lines[i].fields.PaymentMethod || ''

                      };


                      lineItems.push(lineItemObj);
                  }
              }

              let record = {
                  id : useData[d].fields.ID,
                  lid : 'Edit Deposit' + ' '+ useData[d].fields.ID,
                  accountname : useData[d].fields.AccountName||'',
                  memo : useData[d].fields.Notes,
                  department : department,
                  entryno : useData[d].fields.ID,
                  deposittotal: totalDeposit||0.00,
                  transdate : useData[d].fields.DepositDate ? moment(useData[d].fields.DepositDate).format('DD/MM/YYYY') : "",
                  LineItems: lineItems,
                  isReconciled:useData[d].fields.Reconciled
              };
              if(useData[d].fields.Reconciled){
                $(".btnDeleteDepositEntry").prop("disabled", true);
                $(".btnDelete").prop("disabled", true);
                $(".btnSave").prop("disabled", true);
                $("#form :input").prop("disabled", true);
                $(".btn-light").prop("disabled", false);
                $(".close").prop("disabled", false);
              }


              $(".printConfirm").prop("disabled", false);
              $(".btnBack").prop("disabled", false);
              templateObject.record.set(record);
              $('#sltAccountName').val(useData[d].fields.AccountName);
              if(templateObject.record.get()){
                  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblDepositEntryLine', function(error, result){
                      if(error){

                      }else{
                          if(result){
                              for (let i = 0; i < result.customFields.length; i++) {
                                  let customcolumn = result.customFields;
                                  let columData = customcolumn[i].label;
                                  let columHeaderUpdate = customcolumn[i].thclass;
                                  let hiddenColumn = customcolumn[i].hidden;
                                  let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                  let columnWidth = customcolumn[i].width;


                                  $(""+columHeaderUpdate+"").html(columData);
                                  if(columnWidth !== 0){
                                      $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
                                  }

                                  if(hiddenColumn === true){

                                      $("."+columnClass+"").addClass('hiddenColumn');
                                      $("."+columnClass+"").removeClass('showColumn');
                                      $(".chk"+columnClass+"").removeAttr('checked');
                                  }else if(hiddenColumn === false){
                                      $("."+columnClass+"").removeClass('hiddenColumn');
                                      $("."+columnClass+"").addClass('showColumn');
                                      $(".chk"+columnClass+"").attr('checked','checked');

                                  }

                              }
                          }

                      }
                  });
              }
                  }
                }

                if(!added) {
                  purchaseService.getOneDepositEnrtyData(currentDeposit).then(function (data) {
                      $('.fullScreenSpin').css('display','none');
                      let lineItems = [];
                      let lineItemObj = {};
                      let lineItemsTable = [];
                      let lineItemTableObj = {};
                      let currencySymbol = Currency;
                      let department = data.fields.Lines[0].fields.DeptName;
                      let totalDeposit = utilityService.modifynegativeCurrencyFormat(data.fields.Deposit)|| 0.00;

                      if(data.fields.Lines.length){
                          for(let i=0; i<data.fields.Lines.length; i++){
                              let lineAmount = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.Amount)|| 0.00;

                              lineItemObj = {
                                  lineID :Random.id(),
                                  id: data.fields.Lines[i].fields.ID || '',
                                  accountname: data.fields.Lines[i].fields.AccountName || data.fields.AccountName|| '',
                                  accountno: data.fields.Lines[i].fields.AccountNumber || '',
                                  memo: data.fields.Lines[i].fields.ReferenceNo || '',
                                  lineamount:  lineAmount || 0,
                                  companyname:data.fields.Lines[i].fields.CompanyName || '',
                                  paymentmethod: data.fields.Lines[i].fields.PaymentMethod || ''

                              };


                              lineItems.push(lineItemObj);
                          }
                      }

                      let record = {
                          id : data.fields.ID,
                          lid : 'Edit Deposit' + ' '+ data.fields.ID,
                          accountname : data.fields.AccountName||'',
                          memo : data.fields.Notes,
                          department : department,
                          entryno : data.fields.ID,
                          deposittotal: totalDeposit||0.00,
                          transdate : data.fields.DepositDate ? moment(data.fields.DepositDate).format('DD/MM/YYYY') : "",
                          LineItems: lineItems,
                          isReconciled:data.fields.Reconciled
                      };
                      if(data.fields.Reconciled){
                        $(".btnDeleteDepositEntry").prop("disabled", true);
                        $(".btnDelete").prop("disabled", true);
                        $(".btnSave").prop("disabled", true);
                        $("#form :input").prop("disabled", true);
                        $(".btn-light").prop("disabled", false);
                        $(".close").prop("disabled", false);
                      }


                      $(".printConfirm").prop("disabled", false);
                      $(".btnBack").prop("disabled", false);
                      templateObject.record.set(record);

                      $('#sltAccountName').val(data.fields.AccountName);

                      if(templateObject.record.get()){
                          Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblDepositEntryLine', function(error, result){
                              if(error){


                              }else{
                                  if(result){
                                      for (let i = 0; i < result.customFields.length; i++) {
                                          let customcolumn = result.customFields;
                                          let columData = customcolumn[i].label;
                                          let columHeaderUpdate = customcolumn[i].thclass;
                                          let hiddenColumn = customcolumn[i].hidden;
                                          let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                          let columnWidth = customcolumn[i].width;


                                          $(""+columHeaderUpdate+"").html(columData);
                                          if(columnWidth !== 0){
                                              $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
                                          }

                                          if(hiddenColumn === true){

                                              $("."+columnClass+"").addClass('hiddenColumn');
                                              $("."+columnClass+"").removeClass('showColumn');
                                              $(".chk"+columnClass+"").removeAttr('checked');
                                          }else if(hiddenColumn === false){
                                              $("."+columnClass+"").removeClass('hiddenColumn');
                                              $("."+columnClass+"").addClass('showColumn');
                                              $(".chk"+columnClass+"").attr('checked','checked');

                                          }

                                      }
                                  }

                              }
                          });
                      }
                  }).catch(function (err) {
                      swal({
                          title: 'Oooops...',
                          text: err,
                          type: 'error',
                          showCancelButton: false,
                          confirmButtonText: 'Try Again'
                      }).then((result) => {
                          if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                          else if (result.dismiss === 'cancel') {

                          }
                      });
                      $('.fullScreenSpin').css('display','none');

                  });
                }
              }
            }).catch(function (err) {
              purchaseService.getOneDepositEnrtyData(currentDeposit).then(function (data) {
                  $('.fullScreenSpin').css('display','none');
                  let lineItems = [];
                  let lineItemObj = {};
                  let lineItemsTable = [];
                  let lineItemTableObj = {};
                  let currencySymbol = Currency;
                  let department = data.fields.Lines[0].fields.DeptName;
                  let totalDeposit = utilityService.modifynegativeCurrencyFormat(data.fields.Deposit)|| 0.00;

                  if(data.fields.Lines.length){
                      for(let i=0; i<data.fields.Lines.length; i++){
                          let lineAmount = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.Amount)|| 0.00;

                          lineItemObj = {
                              lineID :Random.id(),
                              id: data.fields.Lines[i].fields.ID || '',
                              accountname: data.fields.Lines[i].fields.AccountName || data.fields.AccountName|| '',
                              accountno: data.fields.Lines[i].fields.AccountNumber || '',
                              memo: data.fields.Lines[i].fields.ReferenceNo || '',
                              lineamount:  lineAmount || 0,
                              companyname:data.fields.Lines[i].fields.CompanyName || '',
                              paymentmethod: data.fields.Lines[i].fields.PaymentMethod || ''

                          };


                          lineItems.push(lineItemObj);
                      }
                  }

                  let record = {
                      id : data.fields.ID,
                      lid : 'Edit Deposit' + ' '+ data.fields.ID,
                      accountname : data.fields.AccountName||'',
                      memo : data.fields.Notes,
                      department : department,
                      entryno : data.fields.ID,
                      deposittotal: totalDeposit||0.00,
                      transdate : data.fields.DepositDate ? moment(data.fields.DepositDate).format('DD/MM/YYYY') : "",
                      LineItems: lineItems,
                      isReconciled:data.fields.Reconciled
                  };
                  if(data.fields.Reconciled){
                    $(".btnDeleteDepositEntry").prop("disabled", true);
                    $(".btnDelete").prop("disabled", true);
                    $(".btnSave").prop("disabled", true);
                    $("#form :input").prop("disabled", true);
                    $(".btn-light").prop("disabled", false);
                    $(".close").prop("disabled", false);
                  }


                  $(".printConfirm").prop("disabled", false);
                  $(".btnBack").prop("disabled", false);
                  templateObject.record.set(record);

                  $('#sltAccountName').val(data.fields.AccountName);

                  if(templateObject.record.get()){
                      Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblDepositEntryLine', function(error, result){
                          if(error){


                          }else{
                              if(result){
                                  for (let i = 0; i < result.customFields.length; i++) {
                                      let customcolumn = result.customFields;
                                      let columData = customcolumn[i].label;
                                      let columHeaderUpdate = customcolumn[i].thclass;
                                      let hiddenColumn = customcolumn[i].hidden;
                                      let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                      let columnWidth = customcolumn[i].width;


                                      $(""+columHeaderUpdate+"").html(columData);
                                      if(columnWidth !== 0){
                                          $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
                                      }

                                      if(hiddenColumn === true){

                                          $("."+columnClass+"").addClass('hiddenColumn');
                                          $("."+columnClass+"").removeClass('showColumn');
                                          $(".chk"+columnClass+"").removeAttr('checked');
                                      }else if(hiddenColumn === false){
                                          $("."+columnClass+"").removeClass('hiddenColumn');
                                          $("."+columnClass+"").addClass('showColumn');
                                          $(".chk"+columnClass+"").attr('checked','checked');

                                      }

                                  }
                              }

                          }
                      });
                  }
              }).catch(function (err) {
                  swal({
                      title: 'Oooops...',
                      text: err,
                      type: 'error',
                      showCancelButton: false,
                      confirmButtonText: 'Try Again'
                  }).then((result) => {
                      if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                      else if (result.dismiss === 'cancel') {

                      }
                  });
                  $('.fullScreenSpin').css('display','none');

              });
            });

            };

            templateObject.getDepositData();
        }

    }else{
        $('.fullScreenSpin').css('display','none');

        setTimeout(function () {
          templateObject.getAllDepositIds();
        }, 500);
        let lineItems = [];
        let lineItemsTable = [];
        let lineItemObj = {};

        lineItemObj = {
            lineID :Random.id(),
            id: '',
           accountname:'',
           accountno: '',
           memo:'',
           lineamount:  0,
           companyname:'',
           paymentmethod: ''
        };
        lineItems.push(lineItemObj);

        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        let record = {
            id : '',
            lid : 'New Deposit Entry',
            accountname: '',
            memo: '',
            department : defaultDept,
            entryno : '',
            deposittotal: 0.00,
            transdate : begunDate,
            LineItems: lineItems,
            isReconciled:false

        };
        $("#form :input").prop("disabled", false);
        templateObject.record.set(record);
        if(templateObject.record.get()){
            Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblDepositEntryLine', function(error, result){
                if(error){


                }else{
                    if(result){
                        for (let i = 0; i < result.customFields.length; i++) {
                            let customcolumn = result.customFields;
                            let columData = customcolumn[i].label;
                            let columHeaderUpdate = customcolumn[i].thclass;
                            let hiddenColumn = customcolumn[i].hidden;
                            let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                            let columnWidth = customcolumn[i].width;

                            $(""+columHeaderUpdate+"").html(columData);
                            if(columnWidth !== 0){
                                $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
                            }
                            if(hiddenColumn === true){
                                $("."+columnClass+"").addClass('hiddenColumn');
                                $("."+columnClass+"").removeClass('showColumn');
                                $(".chk"+columnClass+"").removeAttr('checked');
                            }else if(hiddenColumn === false){
                                $("."+columnClass+"").removeClass('hiddenColumn');
                                $("."+columnClass+"").addClass('showColumn');
                                $(".chk"+columnClass+"").attr('checked','checked');
                            }

                        }
                    }

                }
            });
        }


            setTimeout(function() {
                $('#sltAccountName').trigger("click");
            }, 200);

    }

    let table;
    $(document).ready(function() {
      $('#sltAccountName').editableSelect();
        $('#addRow').on( 'click', function () {
            var rowData = $('#tblDepositEntryLine tbody>tr:last').clone(true);
            let tokenid = Random.id();
            $(".lineAccountName", rowData).val("");
            $(".linePaymentMethod", rowData).val("");
            $(".colReference", rowData).text("");
            $(".lineCompany", rowData).val("");
            $(".colAmount", rowData).val("");

            $(".lineAccountName", rowData).attr('lineid', '');
            rowData.attr('id', tokenid);
            $("#tblDepositEntryLine tbody").append(rowData);

            setTimeout(function () {
             $('#' + tokenid + " .lineAccountName").trigger('click');
            }, 200);

        });

    });


    $(document).on("click", "#tblAccount tbody tr", function(e) {
      $(".colAccount").removeClass('boldtablealertsborder');
        let selectLineID = $('#selectLineID').val();
        let taxcodeList = templateObject.taxraterecords.get();
        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblDepositEntryLine tbody tr");

        if(selectLineID){
            let lineProductName = table.find(".productName").text();
            let lineProductDesc = table.find(".productDesc").text();
            let lineAccoutNo = table.find(".accountnumber").text();


            $('#'+selectLineID+" .lineAccountName").val(lineProductName);
            $('#accountListModal').modal('toggle');

              $(".colAccount").removeClass('boldtablealertsborder');
        }else{
          let accountname = table.find(".productName").text();
          $('#accountListModal').modal('toggle');
          $('#sltAccountName').val(accountname);
          if($tblrows.find(".lineAccountName").val() === ''){
              $tblrows.find(".colAccount").addClass('boldtablealertsborder');
          }
        }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function () {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
              // $(".colAccount").removeClass('boldtablealertsborder');
        }, 1000);
    });

    $(document).on("click", "#tblCustomerlist tbody tr", function(e) {
        let selectCustomerLineID = $('#customerSelectLineID').val();

        var table = $(this);
        let utilityService = new UtilityService();

        if(selectCustomerLineID){
            let lineCompany = table.find(".colCompany").text();

            $('#'+selectCustomerLineID+" .lineCompany").val(lineCompany);
            $('#customerListModal').modal('toggle');

        }
    });

    $(document).on("click", "#paymentmethodList tbody tr", function(e) {
        let selectPaymentLineID = $('#selectPaymentMethodLineID').val();

        var table = $(this);
        let utilityService = new UtilityService();

        if(selectPaymentLineID){
            let linePaymentMethod = table.find(".colName").text();

            $('#'+selectPaymentLineID+" .linePaymentMethod").val(linePaymentMethod);
            $('#paymentMethodModal').modal('toggle');

        }
    });


    $(document).on("click", "#tblTaxRate tbody tr", function(e) {
        let selectLineID = $('#selectLineID').val();
        let taxcodeList = templateObject.taxraterecords.get();
        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblDepositEntryLine tbody tr");

        if(selectLineID){
            let lineTaxCode = table.find(".taxName").text();
            let lineTaxRate = table.find(".taxRate").text();
            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;

            $('#'+selectLineID+" .lineTaxRate").text(lineTaxRate ||0);
            $('#'+selectLineID+" .lineTaxCode").text(lineTaxCode);


            $('#taxRateListModal').modal('toggle');
            $tblrows.each(function (index) {
                var $tblrow = $(this);
                var amount = $tblrow.find(".colAmount").text()||0;
                var taxcode = $tblrow.find(".lineTaxCode").text()||'';

                var taxrateamount = 0;
                if(taxcodeList){
                    for (var i = 0; i < taxcodeList.length; i++) {
                        if(taxcodeList[i].codename === taxcode){

                            taxrateamount = taxcodeList[i].coderate;

                        }
                    }
                }


                var subTotal =  parseFloat(amount.replace(/[^0-9.-]+/g,"")) || 0;
                if((taxrateamount === '') ||(taxrateamount === ' ')){
                    var taxTotal = 0;
                }else{
                    var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g,"")) * parseFloat(taxrateamount);
                }

                if (!isNaN(subTotal)) {
                    $tblrow.find('.colAmount').text(Currency+''+subTotal.toLocaleString(undefined, {minimumFractionDigits: 2}));
                    subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                    document.getElementById("subtotal_total").innerHTML = Currency+''+subGrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2});
                }

                if (!isNaN(taxTotal)) {
                    taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                    document.getElementById("subtotal_tax").innerHTML = Currency+''+taxGrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2});
                }

                if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                    let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                    document.getElementById("grandTotal").innerHTML = Currency+''+GrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2});
                    document.getElementById("balanceDue").innerHTML = Currency+''+GrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2});
                    document.getElementById("totalBalanceDue").innerHTML = Currency+''+GrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2});

                }
            });
        }
    });

    $('#sltAccountName').editableSelect().on('click.editable-select', function (e, li) {
      var $earch = $(this);
      var offset = $earch.offset();
      let accountService = new AccountService();
      const accountTypeList = [];
      var accountDataName = e.target.value ||'';

      if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
         $('#selectLineID').val('');
        $('#accountListModal').modal();
        setTimeout(function () {
            $('#tblAccount_filter .form-control-sm').focus();
            $('#tblAccount_filter .form-control-sm').val('');
            $('#tblAccount_filter .form-control-sm').trigger("input");
            var datatable = $('#tblAccountlist').DataTable();
            datatable.draw();
            $('#tblAccountlist_filter .form-control-sm').trigger("input");
        }, 500);
       }else{
         if(accountDataName.replace(/\s/g, '') !== ''){
           getVS1Data('TAccountVS1').then(function (dataObject) {
               if (dataObject.length === 0) {
                 accountService.getOneAccountByName(accountDataName).then(function (data) {
                   let lineItems = [];
                   let lineItemObj = {};
                   let fullAccountTypeName = '';
                   let accBalance = '';
                   $('#add-account-title').text('Edit Account Details');
                   $('#edtAccountName').attr('readonly', true);
                   $('#sltAccountType').attr('readonly', true);
                   $('#sltAccountType').attr('disabled', 'disabled');
                   if (accountTypeList) {
                       for (var h = 0; h < accountTypeList.length; h++) {

                           if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                               fullAccountTypeName = accountTypeList[h].description || '';

                           }
                       }

                   }

                    var accountid = data.taccountvs1[0].fields.ID || '';
                    var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                    var accountname = data.taccountvs1[0].fields.AccountName || '';
                    var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                    var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                    var accountdesc = data.taccountvs1[0].fields.Description || '';
                    var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                    var bankbsb = data.taccountvs1[0].fields.BSB || '';
                    var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                    var swiftCode = data.taccountvs1[0].fields.Extra || '';
                    var routingNo = data.taccountvs1[0].fields.BankCode || '';

                    var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                    var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                   var cardcvc = data.taccountvs1[0].fields.CVC || '';
                   var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                    if ((accounttype === "BANK")) {
                        $('.isBankAccount').removeClass('isNotBankAccount');
                        $('.isCreditAccount').addClass('isNotCreditAccount');
                    }else if ((accounttype === "CCARD")) {
                        $('.isCreditAccount').removeClass('isNotCreditAccount');
                        $('.isBankAccount').addClass('isNotBankAccount');
                    } else {
                        $('.isBankAccount').addClass('isNotBankAccount');
                        $('.isCreditAccount').addClass('isNotCreditAccount');
                    }

                    $('#edtAccountID').val(accountid);
                    $('#sltAccountType').val(accounttype);
                    $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                    $('#edtAccountName').val(accountname);
                    $('#edtAccountNo').val(accountno);
                    $('#sltTaxCode').val(taxcode);
                    $('#txaAccountDescription').val(accountdesc);
                    $('#edtBankAccountName').val(bankaccountname);
                    $('#edtBSB').val(bankbsb);
                    $('#edtBankAccountNo').val(bankacountno);
                    $('#swiftCode').val(swiftCode);
                    $('#routingNo').val(routingNo);
                    $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                    $('#edtCardNumber').val(cardnumber);
                    $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                    $('#edtCvc').val(cardcvc);

                    if(showTrans === 'true'){
                        $('.showOnTransactions').prop('checked', true);
                    }else{
                      $('.showOnTransactions').prop('checked', false);
                    }

                    setTimeout(function () {
                        $('#addNewAccount').modal('show');
                    }, 500);

                 }).catch(function (err) {
                     $('.fullScreenSpin').css('display','none');
                 });
               } else {
                   let data = JSON.parse(dataObject[0].data);
                   let useData = data.taccountvs1;
                     var added=false;
                   let lineItems = [];
                   let lineItemObj = {};
                   let fullAccountTypeName = '';
                   let accBalance = '';
                   $('#add-account-title').text('Edit Account Details');
                   $('#edtAccountName').attr('readonly', true);
                   $('#sltAccountType').attr('readonly', true);
                   $('#sltAccountType').attr('disabled', 'disabled');
                   for (let a = 0; a < data.taccountvs1.length; a++) {

                     if((data.taccountvs1[a].fields.AccountName) === accountDataName){
                       added = true;
                       if (accountTypeList) {
                           for (var h = 0; h < accountTypeList.length; h++) {

                               if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                   fullAccountTypeName = accountTypeList[h].description || '';

                               }
                           }

                       }



                var accountid = data.taccountvs1[a].fields.ID || '';
                var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                var accountname = data.taccountvs1[a].fields.AccountName || '';
                var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                var accountdesc = data.taccountvs1[a].fields.Description || '';
                var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                var bankbsb = data.taccountvs1[a].fields.BSB || '';
                var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';

                var swiftCode = data.taccountvs1[a].fields.Extra || '';
                var routingNo = data.taccountvs1[a].BankCode || '';

                var showTrans = data.taccountvs1[a].fields.IsHeader || false;

                var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                var cardcvc = data.taccountvs1[a].fields.CVC || '';
                var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';

                if ((accounttype === "BANK")) {
                    $('.isBankAccount').removeClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }else if ((accounttype === "CCARD")) {
                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                    $('.isBankAccount').addClass('isNotBankAccount');
                } else {
                    $('.isBankAccount').addClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }

                $('#edtAccountID').val(accountid);
                $('#sltAccountType').val(accounttype);
                $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                $('#edtAccountName').val(accountname);
                $('#edtAccountNo').val(accountno);
                $('#sltTaxCode').val(taxcode);
                $('#txaAccountDescription').val(accountdesc);
                $('#edtBankAccountName').val(bankaccountname);
                $('#edtBSB').val(bankbsb);
                $('#edtBankAccountNo').val(bankacountno);
                $('#swiftCode').val(swiftCode);
                $('#routingNo').val(routingNo);
                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                $('#edtCardNumber').val(cardnumber);
                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                $('#edtCvc').val(cardcvc);

                if(showTrans === 'true'){
                    $('.showOnTransactions').prop('checked', true);
                }else{
                  $('.showOnTransactions').prop('checked', false);
                }

                setTimeout(function () {
                    $('#addNewAccount').modal('show');
                }, 500);

                     }
                   }
                   if(!added) {
                     accountService.getOneAccountByName(accountDataName).then(function (data) {
                       let lineItems = [];
                       let lineItemObj = {};
                       let fullAccountTypeName = '';
                       let accBalance = '';
                       $('#add-account-title').text('Edit Account Details');
                       $('#edtAccountName').attr('readonly', true);
                       $('#sltAccountType').attr('readonly', true);
                       $('#sltAccountType').attr('disabled', 'disabled');
                       if (accountTypeList) {
                           for (var h = 0; h < accountTypeList.length; h++) {

                               if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                   fullAccountTypeName = accountTypeList[h].description || '';

                               }
                           }

                       }

                        var accountid = data.taccountvs1[0].fields.ID || '';
                        var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                        var accountname = data.taccountvs1[0].fields.AccountName || '';
                        var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                        var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                        var accountdesc = data.taccountvs1[0].fields.Description || '';
                        var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                        var bankbsb = data.taccountvs1[0].fields.BSB || '';
                        var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                        var swiftCode = data.taccountvs1[0].fields.Extra || '';
                        var routingNo = data.taccountvs1[0].fields.BankCode || '';

                        var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                        var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                       var cardcvc = data.taccountvs1[0].fields.CVC || '';
                       var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                        if ((accounttype === "BANK")) {
                            $('.isBankAccount').removeClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        }else if ((accounttype === "CCARD")) {
                            $('.isCreditAccount').removeClass('isNotCreditAccount');
                            $('.isBankAccount').addClass('isNotBankAccount');
                        } else {
                            $('.isBankAccount').addClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        }

                        $('#edtAccountID').val(accountid);
                        $('#sltAccountType').val(accounttype);
                        $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                        $('#edtAccountName').val(accountname);
                        $('#edtAccountNo').val(accountno);
                        $('#sltTaxCode').val(taxcode);
                        $('#txaAccountDescription').val(accountdesc);
                        $('#edtBankAccountName').val(bankaccountname);
                        $('#edtBSB').val(bankbsb);
                        $('#edtBankAccountNo').val(bankacountno);
                        $('#swiftCode').val(swiftCode);
                        $('#routingNo').val(routingNo);
                        $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                        $('#edtCardNumber').val(cardnumber);
                        $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                        $('#edtCvc').val(cardcvc);

                        if(showTrans === 'true'){
                            $('.showOnTransactions').prop('checked', true);
                        }else{
                          $('.showOnTransactions').prop('checked', false);
                        }

                        setTimeout(function () {
                            $('#addNewAccount').modal('show');
                        }, 500);

                     }).catch(function (err) {
                         $('.fullScreenSpin').css('display','none');
                     });
                   }

               }
           }).catch(function (err) {
             accountService.getOneAccountByName(accountDataName).then(function (data) {
               let lineItems = [];
               let lineItemObj = {};
               let fullAccountTypeName = '';
               let accBalance = '';
               $('#add-account-title').text('Edit Account Details');
               $('#edtAccountName').attr('readonly', true);
               $('#sltAccountType').attr('readonly', true);
               $('#sltAccountType').attr('disabled', 'disabled');
               if (accountTypeList) {
                   for (var h = 0; h < accountTypeList.length; h++) {

                       if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                           fullAccountTypeName = accountTypeList[h].description || '';

                       }
                   }

               }

                var accountid = data.taccountvs1[0].fields.ID || '';
                var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                var accountname = data.taccountvs1[0].fields.AccountName || '';
                var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                var accountdesc = data.taccountvs1[0].fields.Description || '';
                var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                var bankbsb = data.taccountvs1[0].fields.BSB || '';
                var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                var swiftCode = data.taccountvs1[0].fields.Extra || '';
                var routingNo = data.taccountvs1[0].fields.BankCode || '';

                var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
               var cardcvc = data.taccountvs1[0].fields.CVC || '';
               var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                if ((accounttype === "BANK")) {
                    $('.isBankAccount').removeClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }else if ((accounttype === "CCARD")) {
                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                    $('.isBankAccount').addClass('isNotBankAccount');
                } else {
                    $('.isBankAccount').addClass('isNotBankAccount');
                    $('.isCreditAccount').addClass('isNotCreditAccount');
                }

                $('#edtAccountID').val(accountid);
                $('#sltAccountType').val(accounttype);
                $('#sltAccountType').append('<option value="'+accounttype+'" selected="selected">'+accounttype+'</option>');
                $('#edtAccountName').val(accountname);
                $('#edtAccountNo').val(accountno);
                $('#sltTaxCode').val(taxcode);
                $('#txaAccountDescription').val(accountdesc);
                $('#edtBankAccountName').val(bankaccountname);
                $('#edtBSB').val(bankbsb);
                $('#edtBankAccountNo').val(bankacountno);
                $('#swiftCode').val(swiftCode);
                $('#routingNo').val(routingNo);
                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                $('#edtCardNumber').val(cardnumber);
                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                $('#edtCvc').val(cardcvc);

                if(showTrans === 'true'){
                    $('.showOnTransactions').prop('checked', true);
                }else{
                  $('.showOnTransactions').prop('checked', false);
                }

                setTimeout(function () {
                    $('#addNewAccount').modal('show');
                }, 500);

             }).catch(function (err) {
                 $('.fullScreenSpin').css('display','none');
             });

           });
           $('#addAccountModal').modal('toggle');
         }else{
           $('#selectLineID').val('');
           $('#accountListModal').modal();
           setTimeout(function () {
             $('#tblAccount_filter .form-control-sm').focus();
             $('#tblAccount_filter .form-control-sm').val('');
             $('#tblAccount_filter .form-control-sm').trigger("input");
               var datatable = $('#tblSupplierlist').DataTable();
               datatable.draw();
               $('#tblAccount_filter .form-control-sm').trigger("input");
           }, 500);
         }
       }


    });

    exportSalesToPdf = function(){
        let margins = {
            top: 0,
            bottom: 0,
            left: 0,
            width: 100
        };
        let id = $('.printID').attr("id");
        var pdf =  new jsPDF('p', 'pt', 'a4');


        pdf.setFontSize(18);
        var source = document.getElementById('html-2-pdfwrapper');
        pdf.addHTML(source, function () {
            pdf.save('Deposit Entry '+id+'.pdf');
            $('#html-2-pdfwrapper').css('display','none');
        });
    };
});
Template.depositcard.onRendered(function(){
    let tempObj = Template.instance();
    let utilityService = new UtilityService();
    let productService = new ProductService();
    let accountService = new AccountService();
    let purchaseService = new PurchaseBoardService();
    let tableProductList;
    var splashArrayProductList = new Array();
    var splashArrayTaxRateList = new Array();
    const taxCodesList = [];
    const accountnamerecords = [];
    const templateObject = Template.instance();
    tempObj.getAllProducts = function () {
      getVS1Data('TAccountVS1').then(function (dataObject) {
        if(dataObject.length == 0){
          accountService.getAccountListVS1().then(function (data) {

              let records = [];
              let inventoryData = [];
              for(let i=0; i<data.taccountvs1.length; i++){
                let accountnamerecordObj = {
                  accountname: data.taccountvs1[i].AccountName || ' '
                };

                if(data.taccountvs1[i].AccountTypeName ==  "BANK" || data.taccountvs1[i].AccountTypeName.toUpperCase() == "CCARD" || data.taccountvs1[i].AccountTypeName.toUpperCase() == "OCLIAB"){
                  accountnamerecords.push(accountnamerecordObj);
                }
                  var dataList = [
                      data.taccountvs1[i].AccountName || '-',
                      data.taccountvs1[i].Description || '',
                      data.taccountvs1[i].AccountNumber || '',
                      data.taccountvs1[i].AccountTypeName|| '',
                      utilityService.modifynegativeCurrencyFormat(Math.floor(data.taccountvs1[i].Balance * 100) / 100),
                      data.taccountvs1[i].TaxCode || ''];

                  splashArrayProductList.push(dataList);
              }
              templateObject.accountnamerecords.set(accountnamerecords);
              localStorage.setItem('VS1PurchaseAccountList', JSON.stringify(splashArrayProductList));

              if(splashArrayProductList){

                  $('#tblAccount').dataTable({
                      data :  splashArrayProductList.sort(),

                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      paging: true,
                      "aaSorting": [],
                      "orderMulti": true,
                      columnDefs: [

                          { className: "productName", "targets": [ 0 ] },
                          { className: "productDesc", "targets": [ 1 ] },
                          { className: "accountnumber", "targets": [ 2 ] },
                          { className: "salePrice", "targets": [ 3 ] },
                          { className: "prdqty text-right", "targets": [ 4 ] },
                          { className: "taxrate", "targets": [ 5 ] }
                      ],
                      colReorder: true,



                      "order": [[ 0, "asc" ]],


                      pageLength: initialDatatableLoad,
                      lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                      info: true,
                      responsive: true

                  });

                  $('div.dataTables_filter input').addClass('form-control form-control-sm');
              }
          });
        }else{
            let data = JSON.parse(dataObject[0].data);
            let useData = data.taccountvs1;

            let records = [];
            let inventoryData = [];
            for(let i=0; i<useData.length; i++){
                var accBalance = "";
                if (!isNaN(useData[i].fields.Balance)) {
                    accBalance = utilityService.modifynegativeCurrencyFormat(useData[i].fields.Balance)|| 0.00;
                }else{
                    accBalance = Currency + "0.00";
                }
                let accountnamerecordObj = {
                accountname: useData[i].fields.AccountName || ' '
            };

            if(useData[i].fields.AccountTypeName ===  "BANK" || useData[i].fields.AccountTypeName.toUpperCase() === "CCARD" || useData[i].fields.AccountTypeName.toUpperCase() === "OCLIAB"){
            accountnamerecords.push(accountnamerecordObj);
            }
              var dataList = [
                  useData[i].fields.AccountName || '-',
                  useData[i].fields.Description || '',
                  useData[i].fields.AccountNumber || '',
                  useData[i].fields.AccountTypeName|| '',
                  accBalance,
                  useData[i].fields.TaxCode || ''];

              splashArrayProductList.push(dataList);
          }
          templateObject.accountnamerecords.set(accountnamerecords);
          localStorage.setItem('VS1PurchaseAccountList', JSON.stringify(splashArrayProductList));

          if(splashArrayProductList){

              $('#tblAccount').dataTable({
                  data :  splashArrayProductList.sort(),

                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  paging: true,
                  "aaSorting": [],
                  "orderMulti": true,
                  columnDefs: [

                      { className: "productName", "targets": [ 0 ] },
                      { className: "productDesc", "targets": [ 1 ] },
                      { className: "accountnumber", "targets": [ 2 ] },
                      { className: "salePrice", "targets": [ 3 ] },
                      { className: "prdqty text-right", "targets": [ 4 ] },
                      { className: "taxrate", "targets": [ 5 ] }
                  ],
                  colReorder: true,



                  "order": [[ 0, "asc" ]],


                  pageLength: initialDatatableLoad,
                  lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                  info: true,
                  responsive: true

              });

              $('div.dataTables_filter input').addClass('form-control form-control-sm');






          }
        }
      }).catch(function (err) {
        accountService.getAccountListVS1().then(function (data) {

            let records = [];
            let inventoryData = [];
            for(let i=0; i<data.taccountvs1.length; i++){
              let accountnamerecordObj = {
                accountname: data.taccountvs1[i].AccountName || ' '
              };

              if(data.taccountvs1[i].AccountTypeName ==  "BANK" || data.taccountvs1[i].AccountTypeName.toUpperCase() == "CCARD" || data.taccountvs1[i].AccountTypeName.toUpperCase() == "OCLIAB"){
                accountnamerecords.push(accountnamerecordObj);
              }

                var dataList = [
                    data.taccountvs1[i].AccountName || '-',
                    data.taccountvs1[i].Description || '',
                    data.taccountvs1[i].AccountNumber || '',
                    data.taccountvs1[i].AccountTypeName|| '',
                    utilityService.modifynegativeCurrencyFormat(Math.floor(data.taccountvs1[i].Balance * 100) / 100),
                    data.taccountvs1[i].TaxCode || ''];

                splashArrayProductList.push(dataList);
            }
            templateObject.accountnamerecords.set(accountnamerecords);
            localStorage.setItem('VS1PurchaseAccountList', JSON.stringify(splashArrayProductList));

            if(splashArrayProductList){

                $('#tblAccount').dataTable({
                    data :  splashArrayProductList.sort(),

                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    paging: true,
                    "aaSorting": [],
                    "orderMulti": true,
                    columnDefs: [

                        { className: "productName", "targets": [ 0 ] },
                        { className: "productDesc", "targets": [ 1 ] },
                        { className: "accountnumber", "targets": [ 2 ] },
                        { className: "salePrice", "targets": [ 3 ] },
                        { className: "prdqty text-right", "targets": [ 4 ] },
                        { className: "taxrate", "targets": [ 5 ] }
                    ],
                    colReorder: true,



                    "order": [[ 0, "asc" ]],


                    pageLength: initialDatatableLoad,
                    lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                    info: true,
                    responsive: true

                });

                $('div.dataTables_filter input').addClass('form-control form-control-sm');






            }
        });
      });

    };

    setTimeout(function () {
    //tempObj.getAllProducts();
    }, 500);

});
Template.depositcard.helpers({
    record : () => {
        return Template.instance().record.get();
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b){
            if (a.department == 'NA') {
                return 1;
            }
            else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },











    termrecords: () => {
        return Template.instance().termrecords.get().sort(function(a, b){
            if (a.termsname == 'NA') {
                return 1;
            }
            else if (b.termsname == 'NA') {
                return -1;
            }
            return (a.termsname.toUpperCase() > b.termsname.toUpperCase()) ? 1 : -1;
        });
    },
    accountnamerecords: () => {
        return Template.instance().accountnamerecords.get().sort(function(a, b){
          if (a.accountname == 'NA') {
        return 1;
            }
        else if (b.accountname == 'NA') {
          return -1;
        }
      return (a.accountname.toUpperCase() > b.accountname.toUpperCase()) ? 1 : -1;
      });
    },
    purchaseCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'depositcard'});
    },
    purchaseCloudGridPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblDepositEntryLine'});
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
    statusrecords: () => {
        return Template.instance().statusrecords.get().sort(function(a, b){
            if (a.orderstatus == 'NA') {
                return 1;
            }
            else if (b.orderstatus == 'NA') {
                return -1;
            }
            return (a.orderstatus.toUpperCase() > b.orderstatus.toUpperCase()) ? 1 : -1;
        });
    },
    totalCredit: () => {
        return Template.instance().totalCredit.get();
    },
    totalDebit: () => {
        return Template.instance().totalDebit.get();
    },
    companyaddress1: () =>{
        return Session.get('vs1companyaddress1');
    },
    companyaddress2: () =>{
        return Session.get('vs1companyaddress2');
    },
   city: () => {
        return Session.get('vs1companyCity');
    },
    state: () => {
        return Session.get('companyState');
    },
     poBox: () => {
        return Session.get('vs1companyPOBox');
    },
    companyphone: () =>{
        return Session.get('vs1companyPhone');
    },
    companyabn: () =>{
        return Session.get('vs1companyABN');
    },
    organizationname: () =>{
        return Session.get('vs1companyName');
    },
    organizationurl: () =>{
        return Session.get('vs1companyURL');
    },
    isMobileDevices: () =>{
        var isMobile = false;

        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
           || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
            isMobile = true;
        }

        return isMobile;
    },
    datatablepaymentlistrecords: () => {
       return Template.instance().datatablepaymentlistrecords.get().sort(function(a, b){
         if (a.paymentmethodname == 'NA') {
       return 1;
           }
       else if (b.paymentmethodname == 'NA') {
         return -1;
       }
     return (a.paymentmethodname.toUpperCase() > b.paymentmethodname.toUpperCase()) ? 1 : -1;
     });
   }
});

Template.depositcard.events({
    'click #edtSupplierName': function(event){
        $('#edtSupplierName').select();
        $('#edtSupplierName').editableSelect();
    },
    'blur .lineCreditEx': function(event){

        if (!isNaN($(event.target).val())){
            let inputCreditEx = parseFloat($(event.target).val());
            $(event.target).val(Currency+''+inputCreditEx.toLocaleString(undefined, {minimumFractionDigits: 2}));
        }else{
            let inputCreditEx = Number($(event.target).val().replace(/[^0-9.-]+/g,""));

            $(event.target).val(Currency+''+inputCreditEx.toLocaleString(undefined, {minimumFractionDigits: 2})||Currency+'0');
        }
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();

        let inputCredit = parseFloat($(event.target).val())||0;
        if (!isNaN($(event.target).val())){
            $(event.target).val(Currency+''+inputCredit.toLocaleString(undefined, {minimumFractionDigits: 2})||Currency+'0');
        }else{
            let inputCredit = Number($(event.target).val().replace(/[^0-9.-]+/g,""));

            $(event.target).val(Currency+''+inputCredit.toLocaleString(undefined, {minimumFractionDigits: 2})||Currency+'0');
        }

        let $tblrows = $("#tblDepositEntryLine tbody tr");
        var targetID = $(event.target).closest('tr').attr('id');
        if($(event.target).val().replace(/[^0-9.-]+/g,"") != 0){
          $('#'+targetID+" .lineDebitEx").val(Currency+'0.00');
        }

        let lineAmount = 0;
        let subGrandCreditTotal = 0;
        let subGrandDebitTotal = 0;
        $tblrows.each(function (index) {
            var $tblrow = $(this);
            var credit = $tblrow.find(".lineCreditEx").val()||Currency+'0';
            var debit = $tblrow.find(".lineDebitEx").val()|| Currency+'0';
            var subTotalCredit = Number(credit.replace(/[^0-9.-]+/g,"")) || Currency+'0';
            var subTotalDebit = Number(debit.replace(/[^0-9.-]+/g,"")) || Currency+'0';
            if (!isNaN(subTotalCredit)) {
                subGrandCreditTotal += isNaN(subTotalCredit) ? 0 : subTotalCredit;
            };
            if (!isNaN(subTotalDebit)) {
                subGrandDebitTotal += isNaN(subTotalDebit) ? 0 : subTotalDebit;
            };

        });
        templateObject.totalCredit.set(utilityService.modifynegativeCurrencyFormat(subGrandCreditTotal));
        templateObject.totalDebit.set(utilityService.modifynegativeCurrencyFormat(subGrandDebitTotal));

    },
    'click #btnCustomFileds': function(event){
        var x = document.getElementById("divCustomFields");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    },
    'click .lineAccountName, keydown .lineAccountName': function(event) {
      var $earch = $(event.currentTarget);
      var offset = $earch.offset();
        $('#edtAccountID').val('');
        $('#add-account-title').text('Add New Account');
        let suppliername = $('#edtSupplierName').val();
        let accountService = new AccountService();
        const accountTypeList = [];
        if (suppliername === '') {
            swal('Supplier has not been selected!', '', 'warning');
            event.preventDefault();
        } else {
            var accountDataName = $(event.target).val() || '';
            if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
              $('#accountListModal').modal('toggle');
              var targetID = $(event.target).closest('tr').attr('id');
              $('#selectLineID').val(targetID);
              setTimeout(function() {
                  $('#tblAccount_filter .form-control-sm').focus();
                  $('#tblAccount_filter .form-control-sm').val('');
                  $('#tblAccount_filter .form-control-sm').trigger("input");

                  var datatable = $('#tblAccount').DataTable();
                  datatable.draw();
                  $('#tblAccount_filter .form-control-sm').trigger("input");

              }, 500);
         } else {
            if (accountDataName.replace(/\s/g, '') != '') {
                //$('#edtAccountID').val($(event.target).text());

                getVS1Data('TAccountVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        accountService.getOneAccountByName(accountDataName).then(function(data) {
                          let lineItems = [];
                          let lineItemObj = {};
                          let fullAccountTypeName = '';
                          let accBalance = '';
                          $('#add-account-title').text('Edit Account Details');
                          $('#edtAccountName').attr('readonly', true);
                          $('#sltAccountType').attr('readonly', true);
                          $('#sltAccountType').attr('disabled', 'disabled');
                            if (accountTypeList) {
                                for (var h = 0; h < accountTypeList.length; h++) {

                                    if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                        fullAccountTypeName = accountTypeList[h].description || '';

                                    }
                                }

                            }

                            $('#add-account-title').text('Edit Account Details');
                            $('#edtAccountName').attr('readonly', true);
                            $('#sltAccountType').attr('readonly', true);
                            $('#sltAccountType').attr('disabled', 'disabled');

                            var accountid = data.taccountvs1[0].fields.ID || '';
                            var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                            var accountname = data.taccountvs1[0].fields.AccountName || '';
                            var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                            var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                            var accountdesc = data.taccountvs1[0].fields.Description || '';
                            var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                            var bankbsb = data.taccountvs1[0].fields.BSB || '';
                            var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                            var swiftCode = data.taccountvs1[0].fields.Extra || '';
                            var routingNo = data.taccountvs1[0].fields.BankCode || '';

                            var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                            var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                            var cardcvc = data.taccountvs1[0].fields.CVC || '';
                            var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                            if ((accounttype === "BANK")) {
                                $('.isBankAccount').removeClass('isNotBankAccount');
                                $('.isCreditAccount').addClass('isNotCreditAccount');
                            } else if ((accounttype === "CCARD")) {
                                $('.isCreditAccount').removeClass('isNotCreditAccount');
                                $('.isBankAccount').addClass('isNotBankAccount');
                            } else {
                                $('.isBankAccount').addClass('isNotBankAccount');
                                $('.isCreditAccount').addClass('isNotCreditAccount');
                            }

                            $('#edtAccountID').val(accountid);
                            $('#sltAccountType').val(accounttype);
                            $('#sltAccountType').append('<option value="' + accounttype + '" selected="selected">' + accounttype + '</option>');
                            $('#edtAccountName').val(accountname);
                            $('#edtAccountNo').val(accountno);
                            $('#sltTaxCode').val(taxcode);
                            $('#txaAccountDescription').val(accountdesc);
                            $('#edtBankAccountName').val(bankaccountname);
                            $('#edtBSB').val(bankbsb);
                            $('#edtBankAccountNo').val(bankacountno);
                            $('#swiftCode').val(swiftCode);
                            $('#routingNo').val(routingNo);
                            $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                            $('#edtCardNumber').val(cardnumber);
                            $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                            $('#edtCvc').val(cardcvc);

                            if (showTrans == 'true') {
                                $('.showOnTransactions').prop('checked', true);
                            } else {
                                $('.showOnTransactions').prop('checked', false);
                            }

                            setTimeout(function() {
                                $('#addNewAccount').modal('show');
                            }, 500);

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.taccountvs1;
                        var added = false;
                        let lineItems = [];
                        let lineItemObj = {};
                        let fullAccountTypeName = '';
                        let accBalance = '';
                        $('#add-account-title').text('Edit Account Details');
                        $('#edtAccountName').attr('readonly', true);
                        $('#sltAccountType').attr('readonly', true);
                        $('#sltAccountType').attr('disabled', 'disabled');
                        for (let a = 0; a < data.taccountvs1.length; a++) {

                            if ((data.taccountvs1[a].fields.AccountName) === accountDataName) {
                                added = true;
                                if (accountTypeList) {
                                    for (var h = 0; h < accountTypeList.length; h++) {

                                        if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                            fullAccountTypeName = accountTypeList[h].description || '';

                                        }
                                    }

                                }



                                var accountid = data.taccountvs1[a].fields.ID || '';
                                var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                                var accountname = data.taccountvs1[a].fields.AccountName || '';
                                var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                                var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                                var accountdesc = data.taccountvs1[a].fields.Description || '';
                                var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                                var bankbsb = data.taccountvs1[a].fields.BSB || '';
                                var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';

                                var swiftCode = data.taccountvs1[a].fields.Extra || '';
                                var routingNo = data.taccountvs1[a].BankCode || '';

                                var showTrans = data.taccountvs1[a].fields.IsHeader || false;

                                var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                                var cardcvc = data.taccountvs1[a].fields.CVC || '';
                                var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';

                                if ((accounttype === "BANK")) {
                                    $('.isBankAccount').removeClass('isNotBankAccount');
                                    $('.isCreditAccount').addClass('isNotCreditAccount');
                                } else if ((accounttype === "CCARD")) {
                                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                                    $('.isBankAccount').addClass('isNotBankAccount');
                                } else {
                                    $('.isBankAccount').addClass('isNotBankAccount');
                                    $('.isCreditAccount').addClass('isNotCreditAccount');
                                }

                                $('#edtAccountID').val(accountid);
                                $('#sltAccountType').val(accounttype);
                                $('#sltAccountType').append('<option value="' + accounttype + '" selected="selected">' + accounttype + '</option>');
                                $('#edtAccountName').val(accountname);
                                $('#edtAccountNo').val(accountno);
                                $('#sltTaxCode').val(taxcode);
                                $('#txaAccountDescription').val(accountdesc);
                                $('#edtBankAccountName').val(bankaccountname);
                                $('#edtBSB').val(bankbsb);
                                $('#edtBankAccountNo').val(bankacountno);
                                $('#swiftCode').val(swiftCode);
                                $('#routingNo').val(routingNo);
                                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                                $('#edtCardNumber').val(cardnumber);
                                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                                $('#edtCvc').val(cardcvc);

                                if (showTrans == 'true') {
                                    $('.showOnTransactions').prop('checked', true);
                                } else {
                                    $('.showOnTransactions').prop('checked', false);
                                }

                                setTimeout(function() {
                                    $('#addNewAccount').modal('show');
                                }, 500);

                            }
                        }
                        if (!added) {
                            accountService.getOneAccountByName(accountDataName).then(function(data) {
                              let lineItems = [];
                              let lineItemObj = {};
                              let fullAccountTypeName = '';
                              let accBalance = '';
                              $('#add-account-title').text('Edit Account Details');
                              $('#edtAccountName').attr('readonly', true);
                              $('#sltAccountType').attr('readonly', true);
                              $('#sltAccountType').attr('disabled', 'disabled');
                                if (accountTypeList) {
                                    for (var h = 0; h < accountTypeList.length; h++) {

                                        if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                            fullAccountTypeName = accountTypeList[h].description || '';

                                        }
                                    }

                                }

                                var accountid = data.taccountvs1[0].fields.ID || '';
                                var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                                var accountname = data.taccountvs1[0].fields.AccountName || '';
                                var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                                var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                                var accountdesc = data.taccountvs1[0].fields.Description || '';
                                var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                                var bankbsb = data.taccountvs1[0].fields.BSB || '';
                                var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                                var swiftCode = data.taccountvs1[0].fields.Extra || '';
                                var routingNo = data.taccountvs1[0].fields.BankCode || '';

                                var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                                var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                                var cardcvc = data.taccountvs1[0].fields.CVC || '';
                                var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                                if ((accounttype === "BANK")) {
                                    $('.isBankAccount').removeClass('isNotBankAccount');
                                    $('.isCreditAccount').addClass('isNotCreditAccount');
                                } else if ((accounttype === "CCARD")) {
                                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                                    $('.isBankAccount').addClass('isNotBankAccount');
                                } else {
                                    $('.isBankAccount').addClass('isNotBankAccount');
                                    $('.isCreditAccount').addClass('isNotCreditAccount');
                                }

                                $('#edtAccountID').val(accountid);
                                $('#sltAccountType').val(accounttype);
                                $('#sltAccountType').append('<option value="' + accounttype + '" selected="selected">' + accounttype + '</option>');
                                $('#edtAccountName').val(accountname);
                                $('#edtAccountNo').val(accountno);
                                $('#sltTaxCode').val(taxcode);
                                $('#txaAccountDescription').val(accountdesc);
                                $('#edtBankAccountName').val(bankaccountname);
                                $('#edtBSB').val(bankbsb);
                                $('#edtBankAccountNo').val(bankacountno);
                                $('#swiftCode').val(swiftCode);
                                $('#routingNo').val(routingNo);
                                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                                $('#edtCardNumber').val(cardnumber);
                                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                                $('#edtCvc').val(cardcvc);

                                if (showTrans == 'true') {
                                    $('.showOnTransactions').prop('checked', true);
                                } else {
                                    $('.showOnTransactions').prop('checked', false);
                                }

                                setTimeout(function() {
                                    $('#addNewAccount').modal('show');
                                }, 500);

                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }

                    }
                }).catch(function(err) {
                    accountService.getOneAccountByName(accountDataName).then(function(data) {
                      let lineItems = [];
                      let lineItemObj = {};
                      let fullAccountTypeName = '';
                      let accBalance = '';
                      $('#add-account-title').text('Edit Account Details');
                      $('#edtAccountName').attr('readonly', true);
                      $('#sltAccountType').attr('readonly', true);
                      $('#sltAccountType').attr('disabled', 'disabled');
                        if (accountTypeList) {
                            for (var h = 0; h < accountTypeList.length; h++) {

                                if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                    fullAccountTypeName = accountTypeList[h].description || '';

                                }
                            }

                        }

                        $('#add-account-title').text('Edit Account Details');
                        $('#edtAccountName').attr('readonly', true);
                        $('#sltAccountType').attr('readonly', true);
                        $('#sltAccountType').attr('disabled', 'disabled');

                        var accountid = data.taccountvs1[0].fields.ID || '';
                        var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                        var accountname = data.taccountvs1[0].fields.AccountName || '';
                        var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                        var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                        var accountdesc = data.taccountvs1[0].fields.Description || '';
                        var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                        var bankbsb = data.taccountvs1[0].fields.BSB || '';
                        var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                        var swiftCode = data.taccountvs1[0].fields.Extra || '';
                        var routingNo = data.taccountvs1[0].fields.BankCode || '';

                        var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                        var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                        var cardcvc = data.taccountvs1[0].fields.CVC || '';
                        var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                        if ((accounttype === "BANK")) {
                            $('.isBankAccount').removeClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        } else if ((accounttype === "CCARD")) {
                            $('.isCreditAccount').removeClass('isNotCreditAccount');
                            $('.isBankAccount').addClass('isNotBankAccount');
                        } else {
                            $('.isBankAccount').addClass('isNotBankAccount');
                            $('.isCreditAccount').addClass('isNotCreditAccount');
                        }

                        $('#edtAccountID').val(accountid);
                        $('#sltAccountType').val(accounttype);
                        $('#sltAccountType').append('<option value="' + accounttype + '" selected="selected">' + accounttype + '</option>');
                        $('#edtAccountName').val(accountname);
                        $('#edtAccountNo').val(accountno);
                        $('#sltTaxCode').val(taxcode);
                        $('#txaAccountDescription').val(accountdesc);
                        $('#edtBankAccountName').val(bankaccountname);
                        $('#edtBSB').val(bankbsb);
                        $('#edtBankAccountNo').val(bankacountno);
                        $('#swiftCode').val(swiftCode);
                        $('#routingNo').val(routingNo);
                        $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                        $('#edtCardNumber').val(cardnumber);
                        $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                        $('#edtCvc').val(cardcvc);

                        if (showTrans == 'true') {
                            $('.showOnTransactions').prop('checked', true);
                        } else {
                            $('.showOnTransactions').prop('checked', false);
                        }

                        setTimeout(function() {
                            $('#addNewAccount').modal('show');
                        }, 500);

                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });

                });
                $('#addAccountModal').modal('toggle');

            } else {
                $('#accountListModal').modal('toggle');
                var targetID = $(event.target).closest('tr').attr('id');
                $('#selectLineID').val(targetID);
                setTimeout(function() {
                    $('#tblAccount_filter .form-control-sm').focus();
                    $('#tblAccount_filter .form-control-sm').val('');
                    $('#tblAccount_filter .form-control-sm').trigger("input");

                    var datatable = $('#tblAccount').DataTable();
                    datatable.draw();
                    $('#tblAccount_filter .form-control-sm').trigger("input");

                }, 500);
            }

          }
        }

    },
    'click #accountListModal #refreshpagelist':function(){

        Meteor._reload.reload();


    },
    'click .lineTaxRate' : function(event){
        $('#tblDepositEntryLine tbody tr .lineTaxRate').attr("data-toggle","modal");
        $('#tblDepositEntryLine tbody tr .lineTaxRate').attr("data-target","#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectLineID').val(targetID);
    },
    'click .lineTaxCode' : function(event){
        $('#tblDepositEntryLine tbody tr .lineTaxCode').attr("data-toggle","modal");
        $('#tblDepositEntryLine tbody tr .lineTaxCode').attr("data-target","#taxRateListModal");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectLineID').val(targetID);
    },
    'click .printConfirm' : function(event){
        $('#html-2-pdfwrapper').css('display','block');


        exportSalesToPdf();

    },
    'keydown .lineCreditEx, keydown .lineDebitEx, keydown .lineAmount' : function(event){
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
          event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {
      } else {
          event.preventDefault();
      }
    },
    'click .btnRemove': function(event){
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();

        var clicktimes = 0;
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectDeleteLineID').val(targetID);

        times++;

        if (times == 1) {
            $('#deleteLineModal').modal('toggle');
        }else{
            if($('#tblDepositEntryLine tbody>tr').length > 1){
                this.click;
                $(event.target).closest('tr').remove();
                event.preventDefault();
                let $tblrows = $("#tblDepositEntryLine tbody tr");

                let lineAmount = 0;
                let subGrandTotal = 0;
                let taxGrandTotal = 0;

                $tblrows.each(function (index) {
                    var $tblrow = $(this);
                    var amount = $tblrow.find(".colAmount").text()||0;
                    var taxcode = $tblrow.find(".lineTaxCode").text()||0;

                    var taxrateamount = 0;
                    if(taxcodeList){
                        for (var i = 0; i < taxcodeList.length; i++) {
                            if(taxcodeList[i].codename == taxcode){
                                taxrateamount = taxcodeList[i].coderate;
                            }
                        }
                    }


                    var subTotal =  parseFloat(amount.replace(/[^0-9.-]+/g,"")) || 0;
                    var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g,""))  * parseFloat(taxrateamount);
                    if (!isNaN(subTotal)) {
                        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                        document.getElementById("subtotal_total").innerHTML = Currency+''+subGrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2});
                    }

                    if (!isNaN(taxTotal)) {
                        taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                        document.getElementById("subtotal_tax").innerHTML = Currency+''+taxGrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2});
                    }

                    if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                        let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                        document.getElementById("grandTotal").innerHTML = Currency+''+GrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2});
                        document.getElementById("balanceDue").innerHTML = Currency+''+GrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2});
                        document.getElementById("totalBalanceDue").innerHTML = Currency+''+GrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2});

                    }
                });
                return false;

            }else{
                $('#deleteLineModal').modal('toggle');
            }
        }
    },
    'click .btnDelete': function(event){

        let templateObject = Template.instance();
        let purchaseService = new PurchaseBoardService();
        swal({
            title: 'Delete Deposit',
            text: "Are you sure you want to delete Deposit?",
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                $('.fullScreenSpin').css('display','inline-block');
                var url = FlowRouter.current().path;
                var getso_id = url.split('?id=');
                var currentInvoice = getso_id[getso_id.length-1];
                var objDetails = '';
                if(getso_id[1]){
                    currentInvoice = parseInt(currentInvoice);
                    var objDetails = {
                        type: "TVS1BankDeposit",
                        fields: {
                            ID: currentInvoice,
                            Deleted: true

                        }
                    };

                    purchaseService.saveBankDeposit(objDetails).then(function (objDetails) {
                    FlowRouter.go('/depositlist?success=true');
                    $('.modal-backdrop').css('display','none');
                    }).catch(function (err) {
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                            else if (result.dismiss === 'cancel') {

                            }
                        });
                        $('.fullScreenSpin').css('display','none');
                    });
                }else{
                    window.open('/depositlist','_self');
                }
                //$('#deleteLineModal').modal('toggle');
            } else if (result.dismiss === 'cancel') {
                //window.open('/depositlist', "_self");
            } else {

            }
        });

    },
    'click .btnDeleteNothing': function(event){
        $('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        let purchaseService = new PurchaseBoardService();
        var url = FlowRouter.current().path;
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length-1];
        if(getso_id[1]){
            currentInvoice = parseInt(currentInvoice);
            var objDetails = {
                type: "TVS1BankDeposit",
                fields: {
                    ID: currentInvoice,
                    Deleted: true
                }
            };

            purchaseService.saveBankDeposit(objDetails).then(function (objDetails) {
            FlowRouter.go('/depositlist?success=true');
            $('.modal-backdrop').css('display','none');
            }).catch(function (err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                    else if (result.dismiss === 'cancel') {

                    }
                });
                $('.fullScreenSpin').css('display','none');
            });
        }else{
            FlowRouter.go('/depositlist?success=true');
            $('.modal-backdrop').css('display','none');
        }

    },
    'click .btnDeleteLine': function(event){
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();
        let selectLineID = $('#selectDeleteLineID').val();
        if($('#tblDepositEntryLine tbody>tr').length > 1){
            this.click;

            $('#'+selectLineID).closest('tr').remove();

            let $tblrows = $("#tblDepositEntryLine tbody tr");

            let lineAmount = 0;
            let subGrandTotal = 0;
            let taxGrandTotal = 0;

      let lineAmountTotal = 0;
      $tblrows.each(function(index) {
          var $tblrow = $(this);
          var lineAmount = Number($tblrow.find(".colAmount").val().replace(/[^0-9.-]+/g, "")) || 0;
          lineAmountTotal +=lineAmount;
      });

      document.getElementById("depositTotalLine").innerHTML = utilityService.modifynegativeCurrencyFormat(lineAmountTotal)||0;



        }else{
            this.click;

            $('#'+selectLineID+" .lineAccountName").val('');
            $('#'+selectLineID+" .linePaymentMethod").val('');

            $('#'+selectLineID+" .colReference").text('');
            $('#'+selectLineID+" .lineCompany").val('');
            $('#'+selectLineID+" .colAmount").val('');



            $('#depositTotalLine').text(utilityService.modifynegativeCurrencyFormat('0.00'));

        }

        $('#deleteLineModal').modal('toggle');
    },
    'click .btnSaveSettings': function(event){

        $('#myModal4').modal('toggle');
    },
    'click .btnSave': function(event){
        let templateObject = Template.instance();
        let account = $('#sltAccountName').val();
        let depositTotal = $('#depositTotal').val();
        let depositTotalLine = $('#depositTotalLine').text();


        let txaNotes = $('#txaNotes').val();
        let purchaseService = new PurchaseBoardService();
        if (account === ''){
            swal('Account has not been selected!', '', 'warning');
            e.preventDefault();
        }else {
          if($('#depositTotal').val().replace(/[^0-9.-]+/g,"")!== $('#depositTotalLine').text().replace(/[^0-9.-]+/g,"")){

              swal({
                  title: 'Total Deposit does not equal Total Deposited!',
                  text: 'Do You Wish To Update Deposit Total?',
                  type: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Yes',
                  cancelButtonText: 'No'
              }).then((result) => {
                  if (result.value) {
                    $('.fullScreenSpin').css('display','inline-block');
                    var splashLineArray = [];
                    let lineItemsForm = [];
                    let lineItemObjForm = {};
                    let tdtaxCode = "";

                    var transdateTime = new Date($("#dtTransDate").datepicker("getDate"));
                    let transDate = transdateTime.getFullYear() + "-" + (transdateTime.getMonth()+1) + "-" + transdateTime.getDate();
                    let entryNo = $('#edtEnrtyNo').val();

                    var url = FlowRouter.current().path;
                    var getso_id = url.split('?id=');
                    var currentDeposit = getso_id[getso_id.length-1];
                    let uploadedItems = templateObject.uploadedFiles.get();
                    var objDetails = '';
                    if(getso_id[1]){
                        $('#tblDepositEntryLine > tbody > tr').each(function(){
                            var lineID = this.id;
                            let tdaccount = $('#'+lineID+" .lineAccountName").val() || $('#sltAccountName').val();
                            let tdpaymentmethod = $('#'+lineID+" .linePaymentMethod").val();
                            let tddmemo = $('#'+lineID+" .colReference").text();
                            let tdcompany = $('#'+lineID+" .lineCompany").val();
                            let tdamount = $('#'+lineID+" .colAmount").val();
                            let erpLineID = $('#'+lineID+" .lineAccountName").attr('lineid');

                            if (tdaccount !== "") {
                                lineItemObjForm = {
                                    type:"TBankDepositLines",
                                    fields:
                                    {
                                        ID:parseInt(erpLineID) ||0,
                                        AccountName: tdaccount || '',
                                        Amount: parseFloat(tdamount.replace(/[^0-9.-]+/g,"")) || 0,
                                        FromDeposited:true,
                                        ReferenceNo: tddmemo || txaNotes,
                                        CompanyName:tdcompany || '',
                                        Contact:false,
                                        Customer:true,
                                        Deleted:false,
                                        Deposited:false,
                                        PaymentMethod: tdpaymentmethod || "Cash",
                                        TransClassName:"Default",
                                        TrnsType:"Deposit Entry"
                                    }
                                };
                                lineItemsForm.push(lineItemObjForm);
                                splashLineArray.push(lineItemObjForm);
                            }
                        });
                        currentDeposit = parseInt(currentDeposit);
                        objDetails = {
                            type: "TVS1BankDeposit",
                            fields: {
                                ID: currentDeposit,
                                AccountName: account || '',
                                Deleted: false,
                                Deposit:parseFloat(depositTotalLine.replace(/[^0-9.-]+/g,"")) || 0,
                                DepositClassName:"Default",
                                Lines: splashLineArray,
                                DepositDate: transDate,
                                Notes:txaNotes
                            }
                        };
                    }else{
                      $('#tblDepositEntryLine > tbody > tr').each(function(){
                          var lineID = this.id;
                          let tdaccount = $('#'+lineID+" .lineAccountName").val() || $('#sltAccountName').val();
                          let tdpaymentmethod = $('#'+lineID+" .linePaymentMethod").val();
                          let tddmemo = $('#'+lineID+" .colReference").text();
                          let tdcompany = $('#'+lineID+" .lineCompany").val();
                          let tdamount = $('#'+lineID+" .colAmount").val();
                          let erpLineID = $('#'+lineID+" .lineAccountName").attr('lineid');

                          if (tdaccount !== "") {
                              lineItemObjForm = {
                                  type:"TBankDepositLines",
                                  fields:
                                  {

                                      AccountName: tdaccount || '',
                                      Amount: parseFloat(tdamount.replace(/[^0-9.-]+/g,"")) || 0,
                                      FromDeposited:true,
                                      ReferenceNo: tddmemo || txaNotes,
                                      CompanyName:tdcompany || '',
                                      Contact:false,
                                      Customer:true,
                                      Deleted:false,
                                      Deposited:false,
                                      PaymentMethod: tdpaymentmethod || "Cash",
                                      TransClassName:"Default",
                                      TrnsType:"Deposit Entry"
                                  }
                              };
                              lineItemsForm.push(lineItemObjForm);
                              splashLineArray.push(lineItemObjForm);
                          }
                      });
                      objDetails = {
                          type: "TVS1BankDeposit",
                          fields: {
                              AccountName: account || '',
                              Deleted: false,
                              Deposit:parseFloat(depositTotalLine.replace(/[^0-9.-]+/g,"")) || 0,
                              DepositClassName:"Default",
                              Lines: splashLineArray,
                              DepositDate: transDate,
                              Notes:txaNotes
                          }
                      };
                    }
                    purchaseService.saveBankDeposit(objDetails).then(function (objDetails) {
                    FlowRouter.go('/depositlist?success=true');
                    $('.modal-backdrop').css('display','none');


                    }).catch(function (err) {
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                          if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                             else if (result.dismiss === 'cancel') {

                            }
                        });

                        $('.fullScreenSpin').css('display','none');
                    });
                  } else if (result.dismiss === 'cancel') {
                    $('.fullScreenSpin').css('display','none');
                  }
              });

          }else{
            $('.fullScreenSpin').css('display','inline-block');
            var splashLineArray = new Array();
            let lineItemsForm = [];
            let lineItemObjForm = {};
            let tdtaxCode = "";

            var transdateTime = new Date($("#dtTransDate").datepicker("getDate"));
            let transDate = transdateTime.getFullYear() + "-" + (transdateTime.getMonth()+1) + "-" + transdateTime.getDate();
            let entryNo = $('#edtEnrtyNo').val();

            var url = FlowRouter.current().path;
            var getso_id = url.split('?id=');
            var currentDeposit = getso_id[getso_id.length-1];
            let uploadedItems = templateObject.uploadedFiles.get();
            var objDetails = '';
            if(getso_id[1]){
                $('#tblDepositEntryLine > tbody > tr').each(function(){
                    var lineID = this.id;
                    let tdaccount = $('#'+lineID+" .lineAccountName").val() || $('#sltAccountName').val();
                    let tdpaymentmethod = $('#'+lineID+" .linePaymentMethod").val();
                    let tddmemo = $('#'+lineID+" .colReference").text();
                    let tdcompany = $('#'+lineID+" .lineCompany").val();
                    let tdamount = $('#'+lineID+" .colAmount").val();
                    let erpLineID = $('#'+lineID+" .lineAccountName").attr('lineid');

                    if (tdaccount != "") {
                        lineItemObjForm = {
                            type:"TBankDepositLines",
                            fields:
                            {
                                ID:parseInt(erpLineID) ||0,
                                AccountName: tdaccount || '',
                                Amount: parseFloat(tdamount.replace(/[^0-9.-]+/g,"")) || 0,
                                FromDeposited:true,
                                ReferenceNo: tddmemo || txaNotes,
                                CompanyName:tdcompany || '',
                                Contact:false,
                                Customer:true,
                                Deleted:false,
                                Deposited:false,
                                PaymentMethod: tdpaymentmethod || "Cash",
                                TransClassName:"Default",
                                TrnsType:"Deposit Entry"
                            }
                        };
                        lineItemsForm.push(lineItemObjForm);
                        splashLineArray.push(lineItemObjForm);
                    }
                });
                currentDeposit = parseInt(currentDeposit);
                objDetails = {
                    type: "TVS1BankDeposit",
                    fields: {
                        ID: currentDeposit,
                        AccountName: account || '',
                        Deleted: false,
                        Deposit:parseFloat(depositTotalLine.replace(/[^0-9.-]+/g,"")) || 0,
                        DepositClassName:"Default",
                        Lines: splashLineArray,
                        DepositDate: transDate,
                        Notes:txaNotes
                    }
                };
            }else{
              $('#tblDepositEntryLine > tbody > tr').each(function(){
                  var lineID = this.id;
                  let tdaccount = $('#'+lineID+" .lineAccountName").val() || $('#sltAccountName').val();
                  let tdpaymentmethod = $('#'+lineID+" .linePaymentMethod").val();
                  let tddmemo = $('#'+lineID+" .colReference").text();
                  let tdcompany = $('#'+lineID+" .lineCompany").val();
                  let tdamount = $('#'+lineID+" .colAmount").val();
                  let erpLineID = $('#'+lineID+" .lineAccountName").attr('lineid');

                  if (tdaccount != "") {
                      lineItemObjForm = {
                          type:"TBankDepositLines",
                          fields:
                          {

                              AccountName: tdaccount || '',
                              Amount: parseFloat(tdamount.replace(/[^0-9.-]+/g,"")) || 0,
                              FromDeposited:true,
                              ReferenceNo: tddmemo || txaNotes,
                              CompanyName:tdcompany || '',
                              Contact:false,
                              Customer:true,
                              Deleted:false,
                              Deposited:false,
                              PaymentMethod: tdpaymentmethod || "Cash",
                              TransClassName:"Default",
                              TrnsType:"Deposit Entry"
                          }
                      };
                      lineItemsForm.push(lineItemObjForm);
                      splashLineArray.push(lineItemObjForm);
                  }
              });
              objDetails = {
                  type: "TVS1BankDeposit",
                  fields: {
                      AccountName: account || '',
                      Deleted: false,
                      Deposit:parseFloat(depositTotalLine.replace(/[^0-9.-]+/g,"")) || 0,
                      DepositClassName:"Default",
                      Lines: splashLineArray,
                      DepositDate: transDate,
                      Notes:txaNotes
                  }
              };
            }
            purchaseService.saveBankDeposit(objDetails).then(function (objDetails) {
            FlowRouter.go('/depositlist?success=true');
            $('.modal-backdrop').css('display','none');


            }).catch(function (err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                    else if (result.dismiss === 'cancel') {

                    }
                });

                $('.fullScreenSpin').css('display','none');
            });
          }


        }

    },
    'click .chkcolAccountName': function(event){
        if($(event.target).is(':checked')){
            $('.colAccountName').css('display','table-cell');
            $('.colAccountName').css('padding','.75rem');
            $('.colAccountName').css('vertical-align','top');
        }else{
            $('.colAccountName').css('display','none');
        }
    },
    'click .chkcolAccountNo': function(event){
        if($(event.target).is(':checked')){
            $('.colAccountNo').css('display','table-cell');
            $('.colAccountNo').css('padding','.75rem');
            $('.colAccountNo').css('vertical-align','top');
        }else{
            $('.colAccountNo').css('display','none');
        }
    },
    'click .chkcolMemo': function(event){
        if($(event.target).is(':checked')){
            $('.colMemo').css('display','table-cell');
            $('.colMemo').css('padding','.75rem');
            $('.colMemo').css('vertical-align','top');
        }else{
            $('.colMemo').css('display','none');
        }
    },
    'click .chkcolCreditEx': function(event){
        if($(event.target).is(':checked')){
            $('.colCreditEx').css('display','table-cell');
            $('.colCreditEx').css('padding','.75rem');
            $('.colCreditEx').css('vertical-align','top');
        }else{
            $('.colCreditEx').css('display','none');
        }
    },
    'click .chkcolDebitEx': function(event){
        if($(event.target).is(':checked')){
            $('.colDebitEx').css('display','table-cell');
            $('.colDebitEx').css('padding','.75rem');
            $('.colDebitEx').css('vertical-align','top');
        }else{
            $('.colDebitEx').css('display','none');
        }
    },
    'change .rngRangeAccountName' : function(event){

        let range = $(event.target).val();
        $(".spWidthAccountName").html(range+'%');
        $('.colAccountName').css('width',range+'%');

    },
    'change .rngRangeAccountNo' : function(event){

        let range = $(event.target).val();
        $(".spWidthAccountNo").html(range+'%');
        $('.colAccountNo').css('width',range+'%');

    },
    'change .rngRangeMemo' : function(event){

        let range = $(event.target).val();
        $(".spWidthMemo").html(range+'%');
        $('.colMemo').css('width',range+'%');

    },
    'change .rngRangeCreditEx' : function(event){

        let range = $(event.target).val();
        $(".spWidthCreditEx").html(range+'%');
        $('.colCreditEx').css('width',range+'%');

    },
    'change .rngRangeDebitEx' : function(event){

        let range = $(event.target).val();
        $(".spWidthDebitEx").html(range+'%');
        $('.colDebitEx').css('width',range+'%');

    },
    'blur .divcolumn' : function(event){
        let columData = $(event.target).html();
        let columHeaderUpdate = $(event.target).attr("valueupdate");
        $(""+columHeaderUpdate+"").html(columData);

    },
    'click .btnSaveGridSettings' : function(event){
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
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblDepositEntryLine'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'purchaseform',PrefName:'tblDepositEntryLine',published:true,
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
                                            PrefGroup:'purchaseform',PrefName:'tblDepositEntryLine',published:true,
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
    'click .btnResetGridSettings': function(event){
        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblDepositEntryLine'});
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
    'click .btnResetSettings': function(event){
        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'depositcard'});
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
    'click .new_attachment_btn':function(event){
        $('#attachment-upload').trigger('click');

    },
    'change #attachment-upload': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .img_new_attachment_btn':function(event){
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
    'click .remove-attachment': function (event,ui) {
        let tempObj = Template.instance();
        let attachmentID = parseInt(event.target.id.split('remove-attachment-')[1]);
        if(tempObj.$("#confirm-action-"+attachmentID).length){
            tempObj.$("#confirm-action-"+attachmentID).remove();
        }else{
            let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID +'"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-'+ attachmentID +'">'
            + 'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-name-'+attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltip").show();

    },
    'click .file-name': function(event){
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-name-')[1]);
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFiles.get();

        $('#myModalAttachment').modal('hide');
        let previewFile = {};
        let input = uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:'+input+';base64,'+uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type =  uploadedFiles[attachmentID].fields.Description;
        if(type ==='application/pdf'){
            previewFile.class = 'pdf-class';
        }else if(type === 'application/msword' || type ==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
            previewFile.class = 'docx-class';
        }
        else if(type === 'application/vnd.ms-excel' || type ==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        }
        else if(type === 'application/vnd.ms-powerpoint' || type ==='application/vnd.openxmlformats-officedocument.presentationml.presentation'){
            previewFile.class = 'ppt-class';
        }
        else if(type === 'application/vnd.oasis.opendocument.formula' || type ==='text/csv' || type ==='text/plain' || type ==='text/rtf'){
            previewFile.class = 'txt-class';
        }
        else if(type === 'application/zip' || type ==='application/rar' || type ==='application/x-zip-compressed' || type ==='application/x-zip,application/x-7z-compressed'){
            previewFile.class = 'zip-class';
        }
        else {
            previewFile.class = 'default-class';
        }

        if(type.split('/')[0]==='image'){
            previewFile.image = true
        }else {
            previewFile.image = false
        }
        templateObj.uploadedFile.set(previewFile);

        $('#files_view').modal('show');

        return;
    },
    'click .confirm-delete-attachment': function (event,ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltip").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachment-')[1]);
        let  uploadedArray = tempObj.uploadedFiles.get();
        let attachmentCount = tempObj.attachmentCount.get();
        $('#attachment-upload').val('');
        uploadedArray.splice(attachmentID,1);
        tempObj.uploadedFiles.set(uploadedArray);
        attachmentCount --;
        if(attachmentCount === 0) {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-display').html(elementToAdd);
        }
        tempObj.attachmentCount.set(attachmentCount);
        if(uploadedArray.length > 0){
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedArray);
        }else{
            $(".attchment-tooltip").show();
        }
    },
    'click #btn_Attachment':function(){
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFiles.get();
        if(uploadedFileArray.length > 0){
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachment(uploadedFileArray);
        }else{
            $(".attchment-tooltip").show();
        }
    },
    'click .btnBack':function(event){
        event.preventDefault();
        history.back(1);


    },
    'click .lineCompany': function(event) {
        $('#tblDepositEntryLine tbody tr .lineCompany').attr("data-toggle", "modal");
        $('#tblDepositEntryLine tbody tr .lineCompany').attr("data-target", "#customerListModal");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#customerSelectLineID').val(targetID);

        setTimeout(function() {
            $('#tblCustomerlist_filter .form-control-sm').focus();
        }, 500);
    },
    'click .linePaymentMethod, keydown .linePaymentMethod': function(event) {
        // $('#tblDepositEntryLine tbody tr .colPaymentMethod').attr("data-toggle", "modal");
        // $('#tblDepositEntryLine tbody tr .colPaymentMethod').attr("data-target", "#paymentMethodModal");
        // var targetID = $(event.target).closest('tr').attr('id');
        // $('#selectPaymentMethodLineID').val(targetID);
        //
        // setTimeout(function() {
        //     $('#tblpaymentmethodList_filter .form-control-sm').focus();
        // }, 500);
        var $earch = $(event.currentTarget);
        var offset = $earch.offset();

        // let customername = $('#edtCustomerName').val();
        const templateObject = Template.instance();
        $("#selectPaymentMethodLineID").val('');
        $('#edtPaymentMethodID').val('');
        $('#paymentMethodHeader').text('New Payment Method');
            var paymentDataName = $(event.target).val() || '';
            if (event.pageX > offset.left + $earch.width() - 10) { // X button 16px wide?
                $('#paymentMethodModal').modal('toggle');
                var targetID = $(event.target).closest('tr').attr('id');
                $('#selectPaymentMethodLineID').val(targetID);
                setTimeout(function () {
                    $('#paymentmethodList_filter .form-control-sm').focus();
                    $('#paymentmethodList_filter .form-control-sm').val('');
                    $('#paymentmethodList_filter .form-control-sm').trigger("input");

                    var datatable = $('#paymentmethodList').DataTable();
                    datatable.draw();
                    $('#paymentmethodList_filter .form-control-sm').trigger("input");

                }, 500);
            } else {
                // var productDataID = $(event.target).attr('prodid').replace(/\s/g, '') || '';
                if (paymentDataName.replace(/\s/g, '') != '') {
                  var targetID = $(event.target).closest('tr').attr('id');
                  $('#selectPaymentMethodLineID').val(targetID);

                  $('#paymentMethodHeader').text('Edit Payment Method');

                  getVS1Data('TPaymentMethod').then(function(dataObject) {
                      if (dataObject.length == 0) {
                          $('.fullScreenSpin').css('display', 'inline-block');
                          sideBarService.getPaymentMethodDataVS1().then(function(data) {
                              for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                                  if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                      $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                      $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                      if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                          $('#isformcreditcard').prop('checked', true);
                                      } else {
                                          $('#isformcreditcard').prop('checked', false);
                                      }
                                  }
                              }
                              setTimeout(function() {
                                  $('.fullScreenSpin').css('display', 'none');
                                  $('#newPaymentMethodModal').modal('toggle');
                              }, 200);
                          });
                      } else {
                          let data = JSON.parse(dataObject[0].data);
                          let useData = data.tpaymentmethodvs1;

                          for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                              if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                  $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                  $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                  if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                      $('#isformcreditcard').prop('checked', true);
                                  } else {
                                      $('#isformcreditcard').prop('checked', false);
                                  }
                              }
                          }
                          setTimeout(function() {
                              $('.fullScreenSpin').css('display', 'none');
                              $('#newPaymentMethodModal').modal('toggle');
                          }, 200);
                      }
                  }).catch(function(err) {
                      $('.fullScreenSpin').css('display', 'inline-block');
                      sideBarService.getPaymentMethodDataVS1().then(function(data) {
                          for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                              if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                  $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                  $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                  if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                      $('#isformcreditcard').prop('checked', true);
                                  } else {
                                      $('#isformcreditcard').prop('checked', false);
                                  }
                              }
                          }
                          setTimeout(function() {
                              $('.fullScreenSpin').css('display', 'none');
                              $('#newPaymentMethodModal').modal('toggle');
                          }, 200);
                      });
                  });

                } else {
                    $('#paymentMethodModal').modal('toggle');
                    var targetID = $(event.target).closest('tr').attr('id');
                    $('#selectPaymentMethodLineID').val(targetID);
                    setTimeout(function () {
                        $('#paymentmethodList_filter .form-control-sm').focus();
                        $('#paymentmethodList_filter .form-control-sm').val('');
                        $('#paymentmethodList_filter .form-control-sm').trigger("input");

                        var datatable = $('#paymentmethodList').DataTable();
                        datatable.draw();
                        $('#paymentmethodList_filter .form-control-sm').trigger("input");

                    }, 500);
                }

            }

    },
    'change .colAmount': function(event) {
      let utilityService = new UtilityService();
      if (!isNaN($(event.target).val())) {
          let inputUnitPrice = parseFloat($(event.target).val()) || 0;
          $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
      } else {
          let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
          $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
      }
      let $tblrows = $("#tblDepositEntryLine tbody tr");
      let lineAmountTotal = 0;
      $tblrows.each(function(index) {
          var $tblrow = $(this);
          var lineAmount = Number($tblrow.find(".colAmount").val().replace(/[^0-9.-]+/g, "")) || 0;
          lineAmountTotal +=lineAmount;
      });

      document.getElementById("depositTotalLine").innerHTML = utilityService.modifynegativeCurrencyFormat(lineAmountTotal)||0;

    },
    'change .depositTotal': function(event) {
      let utilityService = new UtilityService();
      if (!isNaN($(event.target).val())) {
          let inputUnitPrice = parseFloat($(event.target).val()) || 0;
          $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
      } else {
          let inputUnitPrice = Number($(event.target).val().replace(/[^0-9.-]+/g, "")) || 0;
          $(event.target).val(utilityService.modifynegativeCurrencyFormat(inputUnitPrice));
      }
    },
    'keydown .colAmount, keydown .depositTotal, keydown .edtEnrtyNo': function(event) {
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
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {} else {
            event.preventDefault();
        }
    }

});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});
