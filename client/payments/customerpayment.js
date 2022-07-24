import {PaymentsService} from '../payments/payments-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {EmployeeProfileService} from "../js/profile-service";
import {AccountService} from "../accounts/account-service";
import {UtilityService} from "../utility-service";
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.customerpayment.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.customerpayment.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let paymentService = new PaymentsService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];

    var today = moment().format('DD/MM/YYYY');
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if ((currentDate.getMonth() + 1) < 10) {
        fromDateMonth = "0" + (currentDate.getMonth() + 1);
    }

    if (currentDate.getDate() < 10) {
        fromDateDay = "0" + currentDate.getDate();
    }
    var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();

    $("#date-input,#dateTo,#dateFrom").datepicker({
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
        onChangeMonthYear: function(year, month, inst){
        // Set date to picker
        $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
        // Hide (close) the picker
        $(this).datepicker('hide');
        // Change ttrigger the on change function
        $(this).trigger('change');
       }
    });

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);
    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblCustomerPayment', function(error, result){
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

    function MakeNegative() {
        $('td').each(function(){
            if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
        });
        $('td.colStatus').each(function(){
            if($(this).text() == "Deleted") $(this).addClass('text-deleted');
            if ($(this).text() == "Full") $(this).addClass('text-fullyPaid');
            if ($(this).text() == "Part") $(this).addClass('text-partialPaid');
            if ($(this).text() == "Rec") $(this).addClass('text-reconciled');
        });
    };

    templateObject.resetData = function (dataVal) {
      window.open('/customerpayment?page=last','_self');
    }
    // $('#tblCustomerPayment').DataTable();
    templateObject.getAllCustomerPaymentData = function () {
      var currentBeginDate = new Date();
      var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
      let fromDateMonth = (currentBeginDate.getMonth() + 1);
      let fromDateDay = currentBeginDate.getDate();
      if((currentBeginDate.getMonth()+1) < 10){
          fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
      }else{
        fromDateMonth = (currentBeginDate.getMonth()+1);
      }

      if(currentBeginDate.getDate() < 10){
          fromDateDay = "0" + currentBeginDate.getDate();
      }
      var toDate = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
      let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");
        if(FlowRouter.current().queryParams.payment){
          let paymentIDs = FlowRouter.current().queryParams.payment || '';
          let customerName = FlowRouter.current().queryParams.name || '';
           sideBarService.getAllTCustomerPaymentListDataByPaymentID(customerName).then(function (data) {
              let lineItems = [];
              let lineItemObj = {};
                  if (data.Params.IgnoreDates == true) {
                      $('#dateFrom').attr('readonly', true);
                      $('#dateTo').attr('readonly', true);
                      // FlowRouter.go('/customerpayment?ignoredate=true');
                  } else {
                      $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
                      $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
                  }
                  for(let i=0; i<data.tcustomerpaymentlist.length; i++){
                      let amount = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].Amount)|| 0.00;
                      let applied = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].Applied) || 0.00;
                      // Currency+''+data.tcustomerpayment[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                      let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].Balance)|| 0.00;
                      let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].TotalPaid)|| 0.00;
                      let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].TotalBalance)|| 0.00;

                      let paystatus = data.tcustomerpaymentlist[i].QuoteStatus || '';
                      if(data.tcustomerpaymentlist[i].Deleted == true){
                        paystatus = "Deleted";
                      }else if (data.tcustomerpaymentlist[i].Reconciled == true){
                        paystatus = "Rec";
                      }else if(data.tcustomerpaymentlist[i].Deleted != true){
                        if ((data.tcustomerpaymentlist[i].Applied > 0) && (data.tcustomerpaymentlist[i].Balance > data.tcustomerpaymentlist[i].Applied)){
                          paystatus = "Part";
                        }else{
                          paystatus = "Full";
                        }
                      };

                      var dataList = {
                          id: data.tcustomerpaymentlist[i].PaymentID || '',
                          sortdate: data.tcustomerpaymentlist[i].PaymentDate !=''? moment(data.tcustomerpaymentlist[i].PaymentDate).format("YYYY/MM/DD"): data.tcustomerpaymentlist[i].PaymentDate,
                          paymentdate: data.tcustomerpaymentlist[i].PaymentDate !=''? moment(data.tcustomerpaymentlist[i].PaymentDate).format("DD/MM/YYYY"): data.tcustomerpaymentlist[i].PaymentDate,
                          customername: data.tcustomerpaymentlist[i].CompanyName || '',
                          paymentamount: amount || 0.00,
                          applied: applied || 0.00,
                          balance: balance || 0.00,
                          bankaccount: data.tcustomerpaymentlist[i].BankAccountName || '',
                          department: data.tcustomerpaymentlist[i].Department || '',
                          paystatus: paystatus || '',
                          refno: data.tcustomerpaymentlist[i].ReferenceNo || '',
                          paymentmethod: data.tcustomerpaymentlist[i].PaymentMethodName || '',
                          notes: data.tcustomerpaymentlist[i].Notes || ''
                      };

                      var arrSplit = paymentIDs.split(',');
                      $.each( arrSplit, function( index, value ) {
                            if(data.tcustomerpaymentlist[i].PaymentID == value){
                              dataTableList.push(dataList);
                            }
                      });


                  }
              templateObject.datatablerecords.set(dataTableList);
              if(templateObject.datatablerecords.get()){

                  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblCustomerPayment', function(error, result){
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
                  //$.fn.dataTable.moment('DD/MM/YY');
                  $('#tblCustomerPayment').DataTable({
                      // dom: 'lBfrtip',
                      columnDefs: [
                          {type: 'date', targets: 0}
                          // ,
                          // { targets: 0, className: "text-center" }

                      ],
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      buttons: [
                          {
                              extend: 'excelHtml5',
                              text: '',
                              download: 'open',
                              className: "btntabletocsv hiddenColumn",
                              filename: "Customer Payments List - "+ moment().format(),
                              orientation:'portrait',
                              exportOptions: {
                                  columns: ':visible',
                                  format: {
                                      body: function ( data, row, column ) {
                                          if(data.includes("</span>")){
                                              var res = data.split("</span>");
                                              data = res[1];
                                          }

                                          return column === 1 ? data.replace(/<.*?>/ig, ""): data;

                                      }
                                  }
                              }
                          },{
                              extend: 'print',
                              download: 'open',
                              className: "btntabletopdf hiddenColumn",
                              text: '',
                              title: 'Customer Payment',
                              filename: "Customer Payments List - "+ moment().format(),
                              exportOptions: {
                                  columns: ':visible',
                                  stripHtml: false
                              }
                          }],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      // bStateSave: true,
                      // rowId: 0,
                      pageLength: initialReportDatatableLoad,
                      "bLengthChange": false,
                      info: true,
                      responsive: true,
                      "order": [[ 0, "desc" ],[ 2, "desc" ]],
                      // "aaSorting": [[1,'desc']],
                      action: function () {
                          $('#tblCustomerPayment').DataTable().ajax.reload();
                      },
                      "fnInitComplete": function () {
                        let urlParametersPage = FlowRouter.current().queryParams.page;
                        if (urlParametersPage || FlowRouter.current().queryParams.ignoredate) {
                            this.fnPageChange('last');
                        }
                         $("<button class='btn btn-primary btnRefreshCustomerPayment' type='button' id='btnRefreshCustomerPayment' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblCustomerPayment_filter");
                         $('.myvarFilterForm').appendTo(".colDateFilter");
                      },
                      "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                        let countTableData = data.Params.Count || 0; //get count from API data

                          return 'Showing '+ iStart + " to " + iEnd + " of " + iEnd;
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
                  $('.fullScreenSpin').css('display','none');


              }, 0);
              var columns = $('#tblCustomerPayment th');
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
              $('#tblCustomerPayment tbody').on( 'click', 'tr', function () {
                  var listData = $(this).closest('tr').attr('id');
                  var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
                  if(listData){
                    if(checkDeleted == "Deleted"){
                      swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
                    }else{
                      FlowRouter.go('/paymentcard?id=' + listData);
                    }
                  }
              });

          }).catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $('.fullScreenSpin').css('display','none');
              // Meteor._reload.reload();
          });

        }else{
        getVS1Data('TCustomerPaymentList').then(function (dataObject) {
            if(dataObject.length == 0){
                sideBarService.getAllTCustomerPaymentListData(prevMonth11Date,toDate, false,initialReportLoad,0).then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};

                        addVS1Data('TCustomerPaymentList',JSON.stringify(data));

                        if (data.Params.IgnoreDates == true) {
                            $('#dateFrom').attr('readonly', true);
                            $('#dateTo').attr('readonly', true);
                            FlowRouter.go('/customerpayment?ignoredate=true');
                        } else {
                            $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
                            $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
                        }
                        for(let i=0; i<data.tcustomerpaymentlist.length; i++){

                            let amount = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].Amount)|| 0.00;
                            let applied = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].Applied) || 0.00;
                            // Currency+''+data.tcustomerpayment[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                            let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].Balance)|| 0.00;
                            let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].TotalPaid)|| 0.00;
                            let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].TotalBalance)|| 0.00;

                            let paystatus = data.tcustomerpaymentlist[i].QuoteStatus || '';
                            if(data.tcustomerpaymentlist[i].Deleted == true){
                              paystatus = "Deleted";
                            }else if (data.tcustomerpaymentlist[i].Reconciled == true){
                              paystatus = "Rec";
                            }else if(data.tcustomerpaymentlist[i].Deleted != true){
                              if ((data.tcustomerpaymentlist[i].Applied > 0) && (data.tcustomerpaymentlist[i].Balance > data.tcustomerpaymentlist[i].Applied)){
                                paystatus = "Part";
                              }else{
                                paystatus = "Full";
                              }
                            };

                            var dataList = {
                                id: data.tcustomerpaymentlist[i].PaymentID || '',
                                sortdate: data.tcustomerpaymentlist[i].PaymentDate !=''? moment(data.tcustomerpaymentlist[i].PaymentDate).format("YYYY/MM/DD"): data.tcustomerpaymentlist[i].PaymentDate,
                                paymentdate: data.tcustomerpaymentlist[i].PaymentDate !=''? moment(data.tcustomerpaymentlist[i].PaymentDate).format("DD/MM/YYYY"): data.tcustomerpaymentlist[i].PaymentDate,
                                customername: data.tcustomerpaymentlist[i].CompanyName || '',
                                paymentamount: amount || 0.00,
                                applied: applied || 0.00,
                                balance: balance || 0.00,
                                bankaccount: data.tcustomerpaymentlist[i].BankAccountName || '',
                                department: data.tcustomerpaymentlist[i].Department || '',
                                paystatus: paystatus || '',
                                refno: data.tcustomerpaymentlist[i].ReferenceNo || '',
                                paymentmethod: data.tcustomerpaymentlist[i].PaymentMethodName || '',
                                notes: data.tcustomerpaymentlist[i].Notes || ''
                            };
                            dataTableList.push(dataList);
                        }
                    templateObject.datatablerecords.set(dataTableList);
                    if(templateObject.datatablerecords.get()){

                        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblCustomerPayment', function(error, result){
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
                        //$.fn.dataTable.moment('DD/MM/YY');
                        $('#tblCustomerPayment').DataTable({
                            // dom: 'lBfrtip',
                            columnDefs: [
                                {type: 'date', targets: 0}
                                // ,
                                // { targets: 0, className: "text-center" }

                            ],
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            buttons: [
                                {
                                    extend: 'excelHtml5',
                                    text: '',
                                    download: 'open',
                                    className: "btntabletocsv hiddenColumn",
                                    filename: "Customer Payments List - "+ moment().format(),
                                    orientation:'portrait',
                                    exportOptions: {
                                        columns: ':visible',
                                        format: {
                                            body: function ( data, row, column ) {
                                                if(data.includes("</span>")){
                                                    var res = data.split("</span>");
                                                    data = res[1];
                                                }

                                                return column === 1 ? data.replace(/<.*?>/ig, ""): data;

                                            }
                                        }
                                    }
                                },{
                                    extend: 'print',
                                    download: 'open',
                                    className: "btntabletopdf hiddenColumn",
                                    text: '',
                                    title: 'Customer Payment',
                                    filename: "Customer Payments List - "+ moment().format(),
                                    exportOptions: {
                                        columns: ':visible',
                                        stripHtml: false
                                    }
                                }],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            // bStateSave: true,
                            // rowId: 0,
                            pageLength: initialReportDatatableLoad,
                            "bLengthChange": false,
                            info: true,
                            responsive: true,
                            "order": [[ 0, "desc" ],[ 2, "desc" ]],
                            // "aaSorting": [[1,'desc']],
                            action: function () {
                                $('#tblCustomerPayment').DataTable().ajax.reload();
                            },
                            "fnDrawCallback": function (oSettings) {
                              let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                                $('.paginate_button.page-item').removeClass('disabled');
                                $('#tblCustomerPayment_ellipsis').addClass('disabled');

                                if (oSettings._iDisplayLength == -1) {
                                    if (oSettings.fnRecordsDisplay() > 150) {
                                        $('.paginate_button.page-item.previous').addClass('disabled');
                                        $('.paginate_button.page-item.next').addClass('disabled');
                                    }
                                } else {}
                                if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                                    $('.paginate_button.page-item.next').addClass('disabled');
                                }
                                $('.paginate_button.next:not(.disabled)', this.api().table().container())
                                .on('click', function () {
                                    $('.fullScreenSpin').css('display', 'inline-block');
                                    let dataLenght = oSettings._iDisplayLength;

                                    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                                    var dateTo = new Date($("#dateTo").datepicker("getDate"));

                                    let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                                    let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                                    if(checkurlIgnoreDate == 'true'){
                                      sideBarService.getAllTCustomerPaymentListData(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
                                          getVS1Data('TCustomerPaymentList').then(function (dataObjectold) {
                                              if (dataObjectold.length == 0) {}
                                              else {
                                                  let dataOld = JSON.parse(dataObjectold[0].data);
                                                  var thirdaryData = $.merge($.merge([], dataObjectnew.tcustomerpaymentlist), dataOld.tcustomerpaymentlist);
                                                  let objCombineData = {
                                                      Params: dataOld.Params,
                                                      tcustomerpaymentlist: thirdaryData
                                                  }

                                                  addVS1Data('TCustomerPaymentList', JSON.stringify(objCombineData)).then(function (datareturn) {
                                                      templateObject.resetData(objCombineData);
                                                      $('.fullScreenSpin').css('display', 'none');
                                                  }).catch(function (err) {
                                                      $('.fullScreenSpin').css('display', 'none');
                                                  });

                                              }
                                          }).catch(function (err) {});

                                      }).catch(function (err) {
                                          $('.fullScreenSpin').css('display', 'none');
                                      });
                                    }else{
                                    sideBarService.getAllTCustomerPaymentListData(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
                                        getVS1Data('TCustomerPaymentList').then(function (dataObjectold) {
                                            if (dataObjectold.length == 0) {}
                                            else {
                                                let dataOld = JSON.parse(dataObjectold[0].data);
                                                var thirdaryData = $.merge($.merge([], dataObjectnew.tcustomerpaymentlist), dataOld.tcustomerpaymentlist);
                                                let objCombineData = {
                                                    Params: dataOld.Params,
                                                    tcustomerpaymentlist: thirdaryData
                                                }

                                                addVS1Data('TCustomerPaymentList', JSON.stringify(objCombineData)).then(function (datareturn) {
                                                    templateObject.resetData(objCombineData);
                                                    $('.fullScreenSpin').css('display', 'none');
                                                }).catch(function (err) {
                                                    $('.fullScreenSpin').css('display', 'none');
                                                });

                                            }
                                        }).catch(function (err) {});

                                    }).catch(function (err) {
                                        $('.fullScreenSpin').css('display', 'none');
                                    });
                                  }
                                });

                                setTimeout(function () {
                                    MakeNegative();
                                }, 100);
                            },
                            "fnInitComplete": function () {
                              let urlParametersPage = FlowRouter.current().queryParams.page;
                              if (urlParametersPage || FlowRouter.current().queryParams.ignoredate) {
                                  this.fnPageChange('last');
                              }
                               $("<button class='btn btn-primary btnRefreshCustomerPayment' type='button' id='btnRefreshCustomerPayment' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblCustomerPayment_filter");
                               $('.myvarFilterForm').appendTo(".colDateFilter");
                            },
                            "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                              let countTableData = data.Params.Count || 0; //get count from API data

                                return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
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
                        $('.fullScreenSpin').css('display','none');


                    }, 0);
                    var columns = $('#tblCustomerPayment th');
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
                    $('#tblCustomerPayment tbody').on( 'click', 'tr', function () {
                        var listData = $(this).closest('tr').attr('id');
                        var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
                        if(listData){
                          if(checkDeleted == "Deleted"){
                            swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
                          }else{
                            FlowRouter.go('/paymentcard?id=' + listData);
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
                let useData = data.tcustomerpaymentlist;
                let lineItems = [];
                let lineItemObj = {};
                if (data.Params.IgnoreDates == true) {
                    $('#dateFrom').attr('readonly', true);
                    $('#dateTo').attr('readonly', true);
                    FlowRouter.go('/customerpayment?ignoredate=true');
                } else {
                    $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
                    $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
                }
            for(let i=0; i<data.tcustomerpaymentlist.length; i++){
                let amount = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].Amount)|| 0.00;
                let applied = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].Applied) || 0.00;
                // Currency+''+data.tcustomerpayment[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].Balance)|| 0.00;
                let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].TotalPaid)|| 0.00;
                let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].Balance)|| 0.00;

                let paystatus = data.tcustomerpaymentlist[i].QuoteStatus || '';
                if(data.tcustomerpaymentlist[i].Deleted == true){
                  paystatus = "Deleted";
                }else if (data.tcustomerpaymentlist[i].Reconciled == true){
                  paystatus = "Rec";
                }else if(data.tcustomerpaymentlist[i].Deleted != true){
                  if ((data.tcustomerpaymentlist[i].Applied > 0) && (data.tcustomerpaymentlist[i].Balance > data.tcustomerpaymentlist[i].Applied)){
                    paystatus = "Part";
                  }else{
                    paystatus = "Full";
                  }
                };

                var dataList = {
                    id: data.tcustomerpaymentlist[i].PaymentID || '',
                    sortdate: data.tcustomerpaymentlist[i].PaymentDate !=''? moment(data.tcustomerpaymentlist[i].PaymentDate).format("YYYY/MM/DD"): data.tcustomerpaymentlist[i].PaymentDate,
                    paymentdate: data.tcustomerpaymentlist[i].PaymentDate !=''? moment(data.tcustomerpaymentlist[i].PaymentDate).format("DD/MM/YYYY"): data.tcustomerpaymentlist[i].PaymentDate,
                    customername: data.tcustomerpaymentlist[i].CompanyName || '',
                    paymentamount: amount || 0.00,
                    applied: applied || 0.00,
                    balance: balance || 0.00,
                    bankaccount: data.tcustomerpaymentlist[i].BankAccountName || '',
                    department: data.tcustomerpaymentlist[i].Department || '',
                    paystatus: paystatus || '',
                    refno: data.tcustomerpaymentlist[i].ReferenceNo || '',
                    paymentmethod: data.tcustomerpaymentlist[i].PaymentMethodName || '',
                    notes: data.tcustomerpaymentlist[i].Notes || ''
                };
                dataTableList.push(dataList);
            }
            templateObject.datatablerecords.set(dataTableList);
            if(templateObject.datatablerecords.get()){

                Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblCustomerPayment', function(error, result){
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
                //$.fn.dataTable.moment('DD/MM/YY');
                $('#tblCustomerPayment').DataTable({
                    // dom: 'lBfrtip',
                    columnDefs: [
                        {type: 'date', targets: 0}
                        // ,
                        // { targets: 0, className: "text-center" }

                    ],
                    "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [
                        {
                            extend: 'excelHtml5',
                            text: '',
                            download: 'open',
                            className: "btntabletocsv hiddenColumn",
                            filename: "Customer Payments List - "+ moment().format(),
                            orientation:'portrait',
                            exportOptions: {
                                columns: ':visible',
                                format: {
                                    body: function ( data, row, column ) {
                                        if(data.includes("</span>")){
                                            var res = data.split("</span>");
                                            data = res[1];
                                        }

                                        return column === 1 ? data.replace(/<.*?>/ig, ""): data;

                                    }
                                }
                            }
                        },{
                            extend: 'print',
                            download: 'open',
                            className: "btntabletopdf hiddenColumn",
                            text: '',
                            title: 'Customer Payment',
                            filename: "Customer Payments List - "+ moment().format(),
                            exportOptions: {
                                columns: ':visible',
                                stripHtml: false
                            }
                        }],
                    select: true,
                    destroy: true,
                    colReorder: true,
                    // bStateSave: true,
                    // rowId: 0,
                    pageLength: initialReportDatatableLoad,
                    "bLengthChange": false,
                    info: true,
                    responsive: true,
                    "order": [[ 0, "desc" ],[ 2, "desc" ]],
                    // "aaSorting": [[1,'desc']],
                    action: function () {
                        $('#tblCustomerPayment').DataTable().ajax.reload();
                    },
                    "fnDrawCallback": function (oSettings) {
                      let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                        $('.paginate_button.page-item').removeClass('disabled');
                        $('#tblCustomerPayment_ellipsis').addClass('disabled');

                        if (oSettings._iDisplayLength == -1) {
                            if (oSettings.fnRecordsDisplay() > 150) {
                                $('.paginate_button.page-item.previous').addClass('disabled');
                                $('.paginate_button.page-item.next').addClass('disabled');
                            }
                        } else {}
                        if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                            $('.paginate_button.page-item.next').addClass('disabled');
                        }
                        $('.paginate_button.next:not(.disabled)', this.api().table().container())
                        .on('click', function () {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            let dataLenght = oSettings._iDisplayLength;

                            var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                            var dateTo = new Date($("#dateTo").datepicker("getDate"));

                            let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                            let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                            if(checkurlIgnoreDate == 'true'){
                              sideBarService.getAllTCustomerPaymentListData(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
                                  getVS1Data('TCustomerPaymentList').then(function (dataObjectold) {
                                      if (dataObjectold.length == 0) {}
                                      else {
                                          let dataOld = JSON.parse(dataObjectold[0].data);
                                          var thirdaryData = $.merge($.merge([], dataObjectnew.tcustomerpaymentlist), dataOld.tcustomerpaymentlist);
                                          let objCombineData = {
                                              Params: dataOld.Params,
                                              tcustomerpaymentlist: thirdaryData
                                          }

                                          addVS1Data('TCustomerPaymentList', JSON.stringify(objCombineData)).then(function (datareturn) {
                                              templateObject.resetData(objCombineData);
                                              $('.fullScreenSpin').css('display', 'none');
                                          }).catch(function (err) {
                                              $('.fullScreenSpin').css('display', 'none');
                                          });

                                      }
                                  }).catch(function (err) {});

                              }).catch(function (err) {
                                  $('.fullScreenSpin').css('display', 'none');
                              });
                            }else{
                            sideBarService.getAllTCustomerPaymentListData(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
                                getVS1Data('TCustomerPaymentList').then(function (dataObjectold) {
                                    if (dataObjectold.length == 0) {}
                                    else {
                                        let dataOld = JSON.parse(dataObjectold[0].data);
                                        var thirdaryData = $.merge($.merge([], dataObjectnew.tcustomerpaymentlist), dataOld.tcustomerpaymentlist);
                                        let objCombineData = {
                                            Params: dataOld.Params,
                                            tcustomerpaymentlist: thirdaryData
                                        }

                                        addVS1Data('TCustomerPaymentList', JSON.stringify(objCombineData)).then(function (datareturn) {
                                            templateObject.resetData(objCombineData);
                                            $('.fullScreenSpin').css('display', 'none');
                                        }).catch(function (err) {
                                            $('.fullScreenSpin').css('display', 'none');
                                        });

                                    }
                                }).catch(function (err) {});

                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                          }
                        });

                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                    },
                    "fnInitComplete": function () {
                      let urlParametersPage = FlowRouter.current().queryParams.page;
                      if (urlParametersPage || FlowRouter.current().queryParams.ignoredate) {
                          this.fnPageChange('last');
                      }
                       $("<button class='btn btn-primary btnRefreshCustomerPayment' type='button' id='btnRefreshCustomerPayment' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblCustomerPayment_filter");
                       $('.myvarFilterForm').appendTo(".colDateFilter");
                    },
                    "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                      let countTableData = data.Params.Count || 0; //get count from API data

                        return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
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
                $('.fullScreenSpin').css('display','none');


            }, 0);

                var columns = $('#tblCustomerPayment th');
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
                $('#tblCustomerPayment tbody').on( 'click', 'tr', function () {
                    var listData = $(this).closest('tr').attr('id');
                    var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
                    if(listData){
                      if(checkDeleted == "Deleted"){
                        swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
                      }else{
                        FlowRouter.go('/paymentcard?id=' + listData);
                      }
                    }
                });
            }
        }).catch(function (err) {
          sideBarService.getAllTCustomerPaymentListData(prevMonth11Date,toDate, false,initialReportLoad,0).then(function (data) {
              let lineItems = [];
              let lineItemObj = {};

                  addVS1Data('TCustomerPaymentList',JSON.stringify(data));
                  if (data.Params.IgnoreDates == true) {
                      $('#dateFrom').attr('readonly', true);
                      $('#dateTo').attr('readonly', true);
                      FlowRouter.go('/customerpayment?ignoredate=true');
                  } else {
                      $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
                      $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
                  }
                  for(let i=0; i<data.tcustomerpaymentlist.length; i++){

                      let amount = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].Amount)|| 0.00;
                      let applied = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].Applied) || 0.00;
                      // Currency+''+data.tcustomerpayment[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                      let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].Balance)|| 0.00;
                      let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].TotalPaid)|| 0.00;
                      let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tcustomerpaymentlist[i].TotalBalance)|| 0.00;

                      let paystatus = data.tcustomerpaymentlist[i].QuoteStatus || '';
                      if(data.tcustomerpaymentlist[i].Deleted == true){
                        paystatus = "Deleted";
                      }else if (data.tcustomerpaymentlist[i].Reconciled == true){
                        paystatus = "Rec";
                      }else if(data.tcustomerpaymentlist[i].Deleted != true){
                        if ((data.tcustomerpaymentlist[i].Applied > 0) && (data.tcustomerpaymentlist[i].Balance > data.tcustomerpaymentlist[i].Applied)){
                          paystatus = "Part";
                        }else{
                          paystatus = "Full";
                        }
                      };

                      var dataList = {
                          id: data.tcustomerpaymentlist[i].PaymentID || '',
                          sortdate: data.tcustomerpaymentlist[i].PaymentDate !=''? moment(data.tcustomerpaymentlist[i].PaymentDate).format("YYYY/MM/DD"): data.tcustomerpaymentlist[i].PaymentDate,
                          paymentdate: data.tcustomerpaymentlist[i].PaymentDate !=''? moment(data.tcustomerpaymentlist[i].PaymentDate).format("DD/MM/YYYY"): data.tcustomerpaymentlist[i].PaymentDate,
                          customername: data.tcustomerpaymentlist[i].CompanyName || '',
                          paymentamount: amount || 0.00,
                          applied: applied || 0.00,
                          balance: balance || 0.00,
                          bankaccount: data.tcustomerpaymentlist[i].BankAccountName || '',
                          department: data.tcustomerpaymentlist[i].Department || '',
                          paystatus: paystatus || '',
                          refno: data.tcustomerpaymentlist[i].ReferenceNo || '',
                          paymentmethod: data.tcustomerpaymentlist[i].PaymentMethodName || '',
                          notes: data.tcustomerpaymentlist[i].Notes || ''
                      };
                      dataTableList.push(dataList);
                  }
              templateObject.datatablerecords.set(dataTableList);
              if(templateObject.datatablerecords.get()){

                  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblCustomerPayment', function(error, result){
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
                  //$.fn.dataTable.moment('DD/MM/YY');
                  $('#tblCustomerPayment').DataTable({
                      // dom: 'lBfrtip',
                      columnDefs: [
                          {type: 'date', targets: 0}
                          // ,
                          // { targets: 0, className: "text-center" }

                      ],
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      buttons: [
                          {
                              extend: 'excelHtml5',
                              text: '',
                              download: 'open',
                              className: "btntabletocsv hiddenColumn",
                              filename: "Customer Payments List - "+ moment().format(),
                              orientation:'portrait',
                              exportOptions: {
                                  columns: ':visible',
                                  format: {
                                      body: function ( data, row, column ) {
                                          if(data.includes("</span>")){
                                              var res = data.split("</span>");
                                              data = res[1];
                                          }

                                          return column === 1 ? data.replace(/<.*?>/ig, ""): data;

                                      }
                                  }
                              }
                          },{
                              extend: 'print',
                              download: 'open',
                              className: "btntabletopdf hiddenColumn",
                              text: '',
                              title: 'Customer Payment',
                              filename: "Customer Payments List - "+ moment().format(),
                              exportOptions: {
                                  columns: ':visible',
                                  stripHtml: false
                              }
                          }],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      // bStateSave: true,
                      // rowId: 0,
                      pageLength: initialReportDatatableLoad,
                      "bLengthChange": false,
                      info: true,
                      responsive: true,
                      "order": [[ 0, "desc" ],[ 2, "desc" ]],
                      // "aaSorting": [[1,'desc']],
                      action: function () {
                          $('#tblCustomerPayment').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                        let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblCustomerPayment_ellipsis').addClass('disabled');

                          if (oSettings._iDisplayLength == -1) {
                              if (oSettings.fnRecordsDisplay() > 150) {
                                  $('.paginate_button.page-item.previous').addClass('disabled');
                                  $('.paginate_button.page-item.next').addClass('disabled');
                              }
                          } else {}
                          if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }
                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                          .on('click', function () {
                              $('.fullScreenSpin').css('display', 'inline-block');
                              let dataLenght = oSettings._iDisplayLength;

                              var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                              var dateTo = new Date($("#dateTo").datepicker("getDate"));

                              let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                              let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                              if(checkurlIgnoreDate == 'true'){
                                sideBarService.getAllTCustomerPaymentListData(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
                                    getVS1Data('TCustomerPaymentList').then(function (dataObjectold) {
                                        if (dataObjectold.length == 0) {}
                                        else {
                                            let dataOld = JSON.parse(dataObjectold[0].data);
                                            var thirdaryData = $.merge($.merge([], dataObjectnew.tcustomerpaymentlist), dataOld.tcustomerpaymentlist);
                                            let objCombineData = {
                                                Params: dataOld.Params,
                                                tcustomerpaymentlist: thirdaryData
                                            }

                                            addVS1Data('TCustomerPaymentList', JSON.stringify(objCombineData)).then(function (datareturn) {
                                                templateObject.resetData(objCombineData);
                                                $('.fullScreenSpin').css('display', 'none');
                                            }).catch(function (err) {
                                                $('.fullScreenSpin').css('display', 'none');
                                            });

                                        }
                                    }).catch(function (err) {});

                                }).catch(function (err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                              }else{
                              sideBarService.getAllTCustomerPaymentListData(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (dataObjectnew) {
                                  getVS1Data('TCustomerPaymentList').then(function (dataObjectold) {
                                      if (dataObjectold.length == 0) {}
                                      else {
                                          let dataOld = JSON.parse(dataObjectold[0].data);
                                          var thirdaryData = $.merge($.merge([], dataObjectnew.tcustomerpaymentlist), dataOld.tcustomerpaymentlist);
                                          let objCombineData = {
                                              Params: dataOld.Params,
                                              tcustomerpaymentlist: thirdaryData
                                          }

                                          addVS1Data('TCustomerPaymentList', JSON.stringify(objCombineData)).then(function (datareturn) {
                                              templateObject.resetData(objCombineData);
                                              $('.fullScreenSpin').css('display', 'none');
                                          }).catch(function (err) {
                                              $('.fullScreenSpin').css('display', 'none');
                                          });

                                      }
                                  }).catch(function (err) {});

                              }).catch(function (err) {
                                  $('.fullScreenSpin').css('display', 'none');
                              });
                            }
                          });

                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
                      },
                      "fnInitComplete": function () {
                        let urlParametersPage = FlowRouter.current().queryParams.page;
                        if (urlParametersPage || FlowRouter.current().queryParams.ignoredate) {
                            this.fnPageChange('last');
                        }
                         $("<button class='btn btn-primary btnRefreshCustomerPayment' type='button' id='btnRefreshCustomerPayment' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblCustomerPayment_filter");
                         $('.myvarFilterForm').appendTo(".colDateFilter");
                      },
                      "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                        let countTableData = data.Params.Count || 0; //get count from API data

                          return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
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
                  $('.fullScreenSpin').css('display','none');


              }, 0);

              var columns = $('#tblCustomerPayment th');
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
              $('#tblCustomerPayment tbody').on( 'click', 'tr', function () {
                  var listData = $(this).closest('tr').attr('id');
                  var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
                  if(listData){
                    if(checkDeleted == "Deleted"){
                      swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
                    }else{
                      FlowRouter.go('/paymentcard?id=' + listData);
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
    }

    templateObject.getAllCustomerPaymentData();
    templateObject.getAllFilterCustPaymentData = function(fromDate, toDate, ignoreDate) {
        sideBarService.getAllTCustomerPaymentListData(fromDate, toDate, ignoreDate,initialReportLoad,0).then(function(data) {
            addVS1Data('TCustomerPaymentList', JSON.stringify(data)).then(function(datareturn) {
                window.open('/customerpayment?toDate=' + toDate + '&fromDate=' + fromDate + '&ignoredate=' + ignoreDate, '_self');
            }).catch(function(err) {
                location.reload();
            });
        }).catch(function(err) {
            $('.fullScreenSpin').css('display', 'none');
        });
    }

    let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
    let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
    let urlParametersIgnoreDate = FlowRouter.current().queryParams.ignoredate;
    if (urlParametersDateFrom) {
        if (urlParametersIgnoreDate == true) {
            $('#dateFrom').attr('readonly', true);
            $('#dateTo').attr('readonly', true);
        } else {

            $("#dateFrom").val(urlParametersDateFrom != '' ? moment(urlParametersDateFrom).format("DD/MM/YYYY") : urlParametersDateFrom);
            $("#dateTo").val(urlParametersDateTo != '' ? moment(urlParametersDateTo).format("DD/MM/YYYY") : urlParametersDateTo);
        }
    }
});

Template.customerpayment.events({
    'click #newSalesOrder' : function(event){
        FlowRouter.go('/salesordercard');
    },
    'click .salesOrderList' : function(event){
        FlowRouter.go('/salesorderslist');
    },
    'click #newInvoice' : function(event){
        FlowRouter.go('/invoicecard');
    },
    'click .invoiceList' : function(event){
        FlowRouter.go('/invoicelist');
    },
    'click #newQuote' : function(event){
        FlowRouter.go('/quotecard');
    },
    'click .QuoteList' : function(event){
        FlowRouter.go('/quoteslist');
    },
    'click .chkDatatable' : function(event){
        var columns = $('#tblCustomerPayment th');
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
    'keyup #tblCustomerPayment_filter input': function (event) {
          if($(event.target).val() != ''){
            $(".btnRefreshCustomerPayment").addClass('btnSearchAlert');
          }else{
            $(".btnRefreshCustomerPayment").removeClass('btnSearchAlert');
          }
          if (event.keyCode == 13) {
             $(".btnRefreshCustomerPayment").trigger("click");
          }
        },
    'click .btnRefreshCustomerPayment':function(event){
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let tableProductList;
        const dataTableList = [];
        var splashArrayInvoiceList = new Array();
        const lineExtaSellItems = [];
        $('.fullScreenSpin').css('display', 'inline-block');
        let dataSearchName = $('#tblCustomerPayment_filter input').val();
        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getNewCustomerPaymentByNameOrID(dataSearchName).then(function (data) {
                $(".btnRefreshCustomerPayment").removeClass('btnSearchAlert');
                let lineItems = [];
                let lineItemObj = {};
                if (data.tcustomerpayment.length > 0) {
                  for (let i = 0; i < data.tcustomerpayment.length; i++) {
                    let amount = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.Amount)|| 0.00;
                  let applied = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.Applied) || 0.00;
                  // Currency+''+data.tcustomerpayment[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
                  let balance = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.Balance)|| 0.00;
                  let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.TotalPaid)|| 0.00;
                  let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.TotalBalance)|| 0.00;

                  let paystatus = '';
                  if(data.tcustomerpayment[i].fields.Deleted == true){
                    paystatus = "Deleted";
                  }else if(data.tcustomerpayment[i].fields.Lines == null){
                    paystatus = "Deleted";
                  }else if(data.tcustomerpayment[i].fields.Deleted != true){
                    if(data.tcustomerpayment[i].fields.Payment == true){
                      paystatus = "Full";
                    }else if ((data.tcustomerpayment[i].fields.Applied > 0) && (data.tcustomerpayment[i].fields.Amount > data.tcustomerpayment[i].fields.Applied)){
                      paystatus = "Part";
                    }else if (data.tcustomerpayment[i].fields.Reconciled == true){
                      paystatus = "Rec";
                    }
                  };

                  var dataList = {
                      id: data.tcustomerpayment[i].fields.ID || '',
                      sortdate: data.tcustomerpayment[i].fields.PaymentDate !=''? moment(data.tcustomerpayment[i].fields.PaymentDate).format("YYYY/MM/DD"): data.tcustomerpayment[i].fields.PaymentDate,
                      paymentdate: data.tcustomerpayment[i].fields.PaymentDate !=''? moment(data.tcustomerpayment[i].fields.PaymentDate).format("DD/MM/YYYY"): data.tcustomerpayment[i].fields.PaymentDate,
                      customername: data.tcustomerpayment[i].fields.CompanyName || '',
                      paymentamount: amount || 0.00,
                      applied: applied || 0.00,
                      balance: balance || 0.00,
                      paystatus:paystatus||'',
                      bankaccount: data.tcustomerpayment[i].fields.AccountName || '',
                      department: data.tcustomerpayment[i].fields.DeptClassName || '',
                      refno: data.tcustomerpayment[i].fields.ReferenceNo || '',
                      paymentmethod: data.tcustomerpayment[i].fields.PaymentMethodName || '',
                      notes: data.tcustomerpayment[i].fields.Notes || ''
                    };

                        //if(data.tinvoiceex[i].fields.Deleted == false){
                        //splashArrayInvoiceList.push(dataList);
                        dataTableList.push(dataList);
                        //}


                        //}
                    }
                    templateObject.datatablerecords.set(dataTableList);

                    let item = templateObject.datatablerecords.get();
                    $('.fullScreenSpin').css('display', 'none');
                    if (dataTableList) {
                        var datatable = $('#tblCustomerPayment').DataTable();
                        $("#tblCustomerPayment > tbody").empty();
                        for (let x = 0; x < item.length; x++) {
                            $("#tblCustomerPayment > tbody").append(
                                ' <tr class="dnd-moved" id="' + item[x].id + '" style="cursor: pointer;">' +
                                '<td contenteditable="false" class="colSortDate hiddenColumn">' + item[x].sortdate + '</td>' +
                                '<td contenteditable="false" class="colPaymentDate" ><span style="display:none;">' + item[x].sortdate + '</span>' + item[x].paymentdate + '</td>' +
                                '<td contenteditable="false" class="colPaymentNo">' + item[x].id + '</td>' +
                                '<td contenteditable="false" class="colReceiptNo" >' + item[x].refno + '</td>' +
                                '<td contenteditable="false" class="colPaymentAmount">' + item[x].paymentamount + '</td>' +
                                '<td contenteditable="false" class="colCustomerName">' + item[x].customername + '</td>' +
                                '<td contenteditable="false" class="colBankAccount">' + item[x].bankaccount + '</td>' +
                                '<td contenteditable="false" class="colDepartment">' + item[x].department + '</td>' +
                                '<td contenteditable="false" class="colStatus">' + item[x].paystatus + '</td>' +
                                '<td contenteditable="false" class="colRefNo hiddenColumn">' + item[x].refno + '</td>' +
                                '<td contenteditable="false" class="colPaymentMethod hiddenColumn">' + item[x].paymentmethod + '</td>' +
                                '<td contenteditable="false" class="colNotes">' + item[x].notes + '</td>' +
                                '</tr>');

                        }
                        $('.dataTables_info').html('Showing ' + data.tcustomerpayment.length + ' of ' + data.tcustomerpayment.length + ' entries');

                    }

                } else {
                    $('.fullScreenSpin').css('display', 'none');

                    swal({
                        title: 'Question',
                        text: "Payment does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            FlowRouter.go('/customerawaitingpayments');
                        } else if (result.dismiss === 'cancel') {
                            //$('#productListModal').modal('toggle');
                        }
                    });
                }
                MakeNegative();
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {

          $(".btnRefresh").trigger("click");
        }

        function MakeNegative() {
            $('td').each(function(){
                if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
            });
            $('td.colStatus').each(function(){
                if($(this).text() == "Deleted") $(this).addClass('text-deleted');
            });
        };
    },
    'click .resetTable' : function(event){
        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblCustomerPayment'});
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
        //let datatable =$('#tblCustomerPayment').DataTable();
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
        //datatable.state.save();

        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblCustomerPayment'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'salesform',PrefName:'tblCustomerPayment',published:true,
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
                                            PrefGroup:'salesform',PrefName:'tblCustomerPayment',published:true,
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

        //Meteor._reload.reload();
    },
    'blur .divcolumn' : function(event){
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

        var datable = $('#tblCustomerPayment').DataTable();
        var title = datable.column( columnDatanIndex ).header();
        $(title).html(columData);

    },
    'change .rngRange' : function(event){
        let range = $(event.target).val();
        // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblCustomerPayment th');
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
        var columns = $('#tblCustomerPayment th');

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
    'click #exportbtn': function () {

        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblCustomerPayment_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');

    },
    'click .btnNewPayment': function () {
        FlowRouter.go('/paymentcard');
    },
    'click .btnAwaitingPayment': function () {
        FlowRouter.go('/customerawaitingpayments');
    },
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();

        var currentBeginDate = new Date();
        var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);

        let fromDateDay = currentBeginDate.getDate();
        if ((currentBeginDate.getMonth()+1) < 10) {
            fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
        } else {
            fromDateMonth = (currentBeginDate.getMonth() + 1);
        }


        if (currentBeginDate.getDate() < 10) {
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        var toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");

        sideBarService.getAllTCustomerPaymentListData(prevMonth11Date,toDate, false,initialReportLoad,0).then(function (dataCustData) {
            addVS1Data('TCustomerPaymentList', JSON.stringify(dataCustData)).then(function (datareturn) {
              sideBarService.getTCustomerPaymentList(initialDataLoad,0).then(function(data) {
                  addVS1Data('TCustomerPayment',JSON.stringify(data)).then(function (datareturn) {
                      window.open("/customerpayment", "_self");
                  }).catch(function (err) {
                      window.open("/customerpayment", "_self");
                  });
              }).catch(function(err) {
                  window.open("/customerpayment", "_self");
              });
            }).catch(function (err) {
              sideBarService.getTCustomerPaymentList(initialDataLoad,0).then(function(data) {
                  addVS1Data('TCustomerPayment',JSON.stringify(data)).then(function (datareturn) {
                      window.open("/customerpayment", "_self");
                  }).catch(function (err) {
                      window.open("/customerpayment", "_self");
                  });
              }).catch(function(err) {
                  window.open("/customerpayment", "_self");
              });
            });
        }).catch(function (err) {
           window.open("/customerpayment", "_self");
        });


    },
    'change #dateTo': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

        //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {

        } else {
            templateObject.getAllFilterCustPaymentData(formatDateFrom, formatDateTo, false);
        }

    },
    'change #dateFrom': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

        //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {

        } else {
            templateObject.getAllFilterCustPaymentData(formatDateFrom, formatDateTo, false);
        }

    },
    'click #today': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentBeginDate = new Date();
        var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if((currentBeginDate.getMonth()+1) < 10){
            fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
        }else{
          fromDateMonth = (currentBeginDate.getMonth()+1);
        }

        if(currentBeginDate.getDate() < 10){
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        var toDateERPFrom = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
        var toDateERPTo = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);

        var toDateDisplayFrom = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
        var toDateDisplayTo = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();

        $("#dateFrom").val(toDateDisplayFrom);
        $("#dateTo").val(toDateDisplayTo);
        templateObject.getAllFilterCustPaymentData(toDateERPFrom,toDateERPTo, false);
    },
    'click #lastweek': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentBeginDate = new Date();
        var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if((currentBeginDate.getMonth()+1) < 10){
            fromDateMonth = "0" + (currentBeginDate.getMonth()+1);
        }else{
          fromDateMonth = (currentBeginDate.getMonth()+1);
        }

        if(currentBeginDate.getDate() < 10){
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        var toDateERPFrom = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay - 7);
        var toDateERPTo = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);

        var toDateDisplayFrom = (fromDateDay -7)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
        var toDateDisplayTo = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();

        $("#dateFrom").val(toDateDisplayFrom);
        $("#dateTo").val(toDateDisplayTo);
        templateObject.getAllFilterCustPaymentData(toDateERPFrom,toDateERPTo, false);
    },
    'click #lastMonth': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentDate = new Date();

        var prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        var prevMonthFirstDate = new Date(currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1), (currentDate.getMonth() - 1 + 12) % 12, 1);

        var formatDateComponent = function(dateComponent) {
          return (dateComponent < 10 ? '0' : '') + dateComponent;
        };

        var formatDate = function(date) {
          return  formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
        };

        var formatDateERP = function(date) {
          return  date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
        };


        var fromDate = formatDate(prevMonthFirstDate);
        var toDate = formatDate(prevMonthLastDate);

        $("#dateFrom").val(fromDate);
        $("#dateTo").val(toDate);

        var getLoadDate = formatDateERP(prevMonthLastDate);
        let getDateFrom = formatDateERP(prevMonthFirstDate);
        templateObject.getAllFilterCustPaymentData(getDateFrom, getLoadDate, false);
    },
    'click #lastQuarter': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        function getQuarter(d) {
            d = d || new Date();
            var m = Math.floor(d.getMonth() / 3) + 2;
            return m > 4 ? m - 4 : m;
        }

        var quarterAdjustment = (moment().month() % 3) + 1;
        var lastQuarterEndDate = moment().subtract({
            months: quarterAdjustment
        }).endOf('month');
        var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({
            months: 2
        }).startOf('month');

        var lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
        var lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");


        $("#dateFrom").val(lastQuarterStartDateFormat);
        $("#dateTo").val(lastQuarterEndDateFormat);

        let fromDateMonth = getQuarter(currentDate);
        var quarterMonth = getQuarter(currentDate);
        let fromDateDay = currentDate.getDate();

        var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
        let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
        templateObject.getAllFilterCustPaymentData(getDateFrom, getLoadDate, false);
    },
    'click #last12Months': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
        let fromDateDay = currentDate.getDate();
        if ((currentDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentDate.getMonth() + 1);
        }
        if (currentDate.getDate() < 10) {
            fromDateDay = "0" + currentDate.getDate();
        }

        var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() - 1);
        $("#dateFrom").val(fromDate);
        $("#dateTo").val(begunDate);

        var currentDate2 = new Date();
        if ((currentDate2.getMonth() + 1) < 10) {
            fromDateMonth2 = "0" + Math.floor(currentDate2.getMonth() + 1);
        }
        if (currentDate2.getDate() < 10) {
            fromDateDay2 = "0" + currentDate2.getDate();
        }
        var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
        let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + fromDateMonth2 + "-" + currentDate2.getDate();
        templateObject.getAllFilterCustPaymentData(getDateFrom, getLoadDate, false);

    },
    'click #ignoreDate': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', true);
        $('#dateTo').attr('readonly', true);
        templateObject.getAllFilterCustPaymentData('', '', true);
    },
    'click .printConfirm' : function(event){
        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblCustomerPayment_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display','none');
    }


});
Template.customerpayment.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.paymentdate == 'NA') {
                return 1;
            }
            else if (b.paymentdate == 'NA') {
                return -1;
            }
            return (a.paymentdate.toUpperCase() > b.paymentdate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblCustomerPayment'});
    }
});
