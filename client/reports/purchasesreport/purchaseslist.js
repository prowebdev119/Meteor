import {ReportsSalesServices} from '../sales/reports-sales-services';

import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {DashBoardService} from "../../Dashboard/dashboard-service";
import {UtilityService} from "../../utility-service";
import '../../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';

Template.purchaseslist.onCreated(()=>{

});

Template.purchaseslist.onRendered(()=>{
  $('.fullScreenSpin').css('display','inline-block');
  let templateObject = Template.instance();
  let salesReportService = new ReportsSalesServices();
  let salesOrderTable;
  var splashArray = new Array();
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
  templateObject.getAllSalesOrderData = function () {
    if(!localStorage.getItem('VS1Purchase_List')){
    salesReportService.getAllSalesOrderList().then(function (data) {
      let lineItems = [];
      let lineItemObj = {};
      localStorage.setItem('VS1Purchase_List', JSON.stringify(data)||'');
      for(let i=0; i<data.tsalesorder.length; i++){
        let totalAmount = Currency+''+data.tsalesorder[i].TotalAmount.toFixed(2);
           var dataList = [
           data.tsalesorder[i].Id || '',
           data.tsalesorder[i].CustomerName || '',
           data.tsalesorder[i].ShipDate !=''? moment(data.tsalesorder[i].ShipDate).format("DD/MM/YYYY"): data.tsalesorder[i].ShipDate,
           data.tsalesorder[i].CustPONumber || '',
           Currency+''+data.tsalesorder[i].TotalTax || '',
           totalAmount || '',
           data.tsalesorder[i].SaleClassName || '',
           data.tsalesorder[i].EmployeeName || '',
           data.tsalesorder[i].SaleDate !=''? moment(data.tsalesorder[i].SaleDate).format("DD/MM/YYYY"): data.tsalesorder[i].SaleDate
           ];

            splashArray.push(dataList);
          //}
      }

      if(splashArray){
        $('#tblReportSales').DataTable({
          data : splashArray,
          processing: true,
          paging: true,
          columnDefs: [
            { orderable: false, targets: 0 },
            { className: "text-right", targets: 4 },
            { className: "text-right", targets: 5 }
          ],
          colReorder: true,
          colReorder: {
            fixedColumnsLeft: 1
          },
          //'scrollX': true,
          bStateSave: true,
          // scrollX: 1000,
          rowId: 0,
          pageLength: initialDatatableLoad,
          lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
          info: true,
          responsive: true
            });


      }

      // , visibility:false
       $('#tblReportSales').DataTable().column( 0 ).visible( false );
       $('#tblReportSales').colResizable({liveDrag:true});
       $('div.dataTables_filter input').addClass('form-control form-control-sm');
       $('#tblReportSales tbody').on( 'click', 'tr', function () {
       var listData = $(this).closest('tr').attr('id');
       if(listData){
         window.open('/salesordercard?id=' + listData,'_self');
       }
     });
$('.fullScreenSpin').css('display','none');
    }).catch(function (err) {
        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
        $('.fullScreenSpin').css('display','none');
        // Meteor._reload.reload();
    });
  }else{
    let data = JSON.parse(localStorage.getItem('VS1Purchase_List'));
    let lineItems = [];
    let lineItemObj = {};
    for(let i=0; i<data.tsalesorder.length; i++){
      let totalAmount = Currency+''+data.tsalesorder[i].TotalAmount.toFixed(2);
         var dataList = [
         data.tsalesorder[i].Id || '',
         data.tsalesorder[i].CustomerName || '',
         data.tsalesorder[i].ShipDate !=''? moment(data.tsalesorder[i].ShipDate).format("DD/MM/YYYY"): data.tsalesorder[i].ShipDate,
         data.tsalesorder[i].CustPONumber || '',
         Currency+''+data.tsalesorder[i].TotalTax || '',
         totalAmount || '',
         data.tsalesorder[i].SaleClassName || '',
         data.tsalesorder[i].EmployeeName || '',
         data.tsalesorder[i].SaleDate !=''? moment(data.tsalesorder[i].SaleDate).format("DD/MM/YYYY"): data.tsalesorder[i].SaleDate
         ];

          splashArray.push(dataList);
        //}
    }

    if(splashArray){
      $('#tblReportSales').DataTable({
        data : splashArray,
        processing: true,
        paging: true,
        columnDefs: [
          { orderable: false, targets: 0 },
          { className: "text-right", targets: 4 },
          { className: "text-right", targets: 5 }
        ],
        colReorder: true,
        colReorder: {
          fixedColumnsLeft: 1
        },
        //'scrollX': true,
        bStateSave: true,
        // scrollX: 1000,
        rowId: 0,
        pageLength: initialDatatableLoad,
        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
        info: true,
        responsive: true
          });


    }

    // , visibility:false
     $('#tblReportSales').DataTable().column( 0 ).visible( false );
     $('#tblReportSales').colResizable({liveDrag:true});
     $('div.dataTables_filter input').addClass('form-control form-control-sm');
     $('#tblReportSales tbody').on( 'click', 'tr', function () {
     var listData = $(this).closest('tr').attr('id');
     if(listData){
       window.open('/salesordercard?id=' + listData,'_self');
     }
   });
$('.fullScreenSpin').css('display','none');
  }
  }

  templateObject.getAllSalesOrderData();
  $(document).ready(function() {
  //$('.tblReportSales').dragableColumns();

   });

});
