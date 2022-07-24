


import {ReactiveVar} from "meteor/reactive-var";
import {StockAdjust} from "../stockadjust-service";

let stockAdjustService = new StockAdjust();

Template.stockadjlist.onCreated(function(){

    const templateObject = Template.instance();
    templateObject.selected = new ReactiveVar();
    templateObject.records = new ReactiveVar([]);
    templateObject.toBeDeleted = [];
    templateObject.selectedObj = new ReactiveVar([]);
    templateObject.stockrecords = new ReactiveVar({});


    var $ = require( 'jquery' );
     ;

    templateObject.currentTab = new ReactiveVar();
    templateObject.stockCount = new ReactiveVar();
    templateObject.pendingCount = new ReactiveVar();
    templateObject.processedCount = new ReactiveVar();
    templateObject.approvedCount = new ReactiveVar();
    templateObject.deletedCount = new ReactiveVar();

    templateObject.selectedRowData = [];
    templateObject.stockrecord = new ReactiveVar([]);
    templateObject.processedMsg = new ReactiveVar();

   });

Template.stockadjlist.onRendered(function(){
  let templateObject = Template.instance();
  var hash = window.location.hash;
  if ( hash == "#All" ){
      $('#stockList').click()
  }else if(hash == "#Pending"){
      $('#stockPending').click();
  }else if(hash == "#Processed"){
      $('#stockProcessed').click();
  }else if(hash == "#Approved"){
      $('#stockApproved').click();
  }else if(hash == "#Deleted"){
      $('#stockDeleted').trigger('click');
  }

  $('#listdatepickerstart').datepicker();
  $('#listdatepickerend').datepicker();

  var erpGet = erpDb();
  var orderDate_format = "";
  var etaDate_format = "";
  var splashArray = new Array();
  var oReq = new XMLHttpRequest();
  oReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + erpGet.ERPApi + '/' + erpGet.ERPStockTakeListObject, true);
  oReq.setRequestHeader("database",erpGet.ERPDatabase);
  oReq.setRequestHeader("username",erpGet.ERPUsername);
  oReq.setRequestHeader("password",erpGet.ERPPassword);
  oReq.send();
  //oReq.onload = reqListner;
  oReq.timeout = 30000;
  oReq.onreadystatechange = function() {
      if (oReq.readyState == 4 && oReq.status == 200) {

          var dataListRet = JSON.parse(oReq.responseText)
          for (var event in dataListRet) {
              var dataCopy = dataListRet[event];
              for (var data in dataCopy) {
                  var mainData = dataCopy[data];
                  if(mainData.CreationDate != ""){
                   creationDate_format = moment(mainData.CreationDate).format("DD-MM-YYYY");
                 }else {
                  creationDate_format = mainData.CreationDate;
                 }

                 if(mainData.AdjustmentDate != ""){
                  adjustmentDate_format = moment(mainData.AdjustmentDate).format("DD-MM-YYYY");
                 }else {
                 adjustmentDate_format = mainData.AdjustmentDate;
                 }
                 var dataList = [mainData.Id,creationDate_format,mainData.Processed,mainData.Notes,mainData.Employee,mainData.AccountName,adjustmentDate_format,mainData.Deleted,mainData.IsStockTake];
                 splashArray.push(dataList);
              }
          }

          var table = $('#stocklist').DataTable({
              data : splashArray,
              columnDefs: [
                  { orderable: false, targets: 0 }
              ],
              colReorder: true,
              colReorder: {
                  fixedColumnsLeft: 1
              },
              bStateSave: true,
              scrollX: 1000,
              rowId: 0,
              info: false,
              "dom": '<"top"i>rt<"bottom"flp><"clear">'
          });
          let stockCount = table.column(0).data().length;
          templateObject.stockCount.set(stockCount);
          table.column( 0 ).visible( false );
          $('#stocklist tbody').on( 'click', 'tr', function () {
              //var listData = table.row( this ).id();
              var listData =$(this).closest('tr').attr('id');
              //for(let i=0 ; i<splashArray.length ;i++){
              if(listData){
                window.open('/stockscan?id=' + listData,'_self');

              }
          });

          $("#search_list").click(function() {
              var search_query = $("#mySearchInput").val();
              var search_startdate = $("#listdatepickerstart").val();
              var startdate_format = moment(search_startdate).format("DD-MM-YYYY");
              var search_enddate = $("#listdatepickerend").val();
              var enddate_format = moment(search_enddate).format("DD-MM-YYYY");
              var searchNow = null;

              if(search_query != ''){
                  searchNow = search_query;
              }else if($(mySearchDropdown).val() == ''){ // or this.value == 'volvo'
                  searchNow = search_query;
              }else if($(mySearchDropdown).val() == 'Any Date'){
                  searchNow = search_query;
              }else if($(mySearchDropdown).val() == 'Date Created'){
                  searchNow = startdate_format;
              }else if($(mySearchDropdown).val() == 'Expiry Date'){
                  searchNow = enddate_format;
              }

              table.search(searchNow).draw();
          });

          $('#searchreset').click(function() {
              table.search('').draw();
              $('#mySearchInput').val('');
              $('#listdatepickerstart').val('');
              $('#listdatepickerend').val('');
              $("#mySearchDropdown").val($("#target option:first").val());
          });

          table
              .order( [ 1, 'desc' ] )
              .draw();

      }
  }
});

Template.stockadjlist.onRendered(function(){
  let templateObject = Template.instance();
  let table;
  let totalAmount = 0;
  var erpGet4 = erpDb();
  var oDecReq3 = new XMLHttpRequest();
      oDecReq3.open("GET",URLRequest + erpGet4.ERPIPAddress + ':' + erpGet4.ERPPort + '/' + erpGet4.ERPApi + '/' + erpGet4.ERPPendingStockTakeListObject, true);
      oDecReq3.setRequestHeader("database",erpGet4.ERPDatabase);
      oDecReq3.setRequestHeader("username",erpGet4.ERPUsername);
      oDecReq3.setRequestHeader("password",erpGet4.ERPPassword);
      oDecReq3.send();
  //oReq.onload = reqListner;
  oDecReq3.timeout = 30000;
  oDecReq3.onreadystatechange = function() {
      if (oDecReq3.readyState == 4 && oDecReq3.status == 200) {

          var dataListRet3 = JSON.parse(oDecReq3.responseText);
          templateObject.getAllStockAdjust = function () {
              let records = [];
              for (let i = 0; i < dataListRet3.tstockadjustentry.length; i++) {
                  let recordObj = {};
                  recordObj.id = dataListRet3.tstockadjustentry[i].Id;
                  recordObj.selected = false;
                  //recordObj.amount = dataListRet3.tstockadjustentry[i].TotalAmountInc;
                  recordObj.dataArr = [
                      moment(dataListRet3.tstockadjustentry[i].CreationDate).format("DD-MM-YYYY") || dataListRet3.tstockadjustentry[i].CreationDate,
                      dataListRet3.tstockadjustentry[i].Notes || '-',
                      dataListRet3.tstockadjustentry[i].Employee || '-',
                      dataListRet3.tstockadjustentry[i].AccountName || '-',
                      moment(dataListRet3.tstockadjustentry[i].AdjustmentDate).format("DD-MM-YYYY") || dataListRet3.tstockadjustentry[i].AdjustmentDate,

                  ];

                  records.push(recordObj);
              }
              var temp = templateObject.stockrecords.get();
              temp.pending = records;
              templateObject.stockrecords.set(temp);
              setTimeout(function () {
                  table = $('#stockpendinglist').DataTable({
                      columnDefs: [
                          {orderable: false, targets: 0},
                          { targets: 0, className: "text-center"}
                      ],
                      lengthMenu: [[10, 15, 20], [10, 15, "All"]],
                      select: true,
                      destroy:true,
                      colReorder: true,
                      colReorder: {
                          fixedColumnsLeft: 0
                      },
                      bStateSave: true,
                      info: false,
                      action: function () {
                          table.ajax.reload();
                      },
                      "dom": '<"top"i>rt<"bottom"flp><"clear">',
                      "fnDrawCallback": function (oSettings) {
                          if (oSettings._iDisplayLength == -1
                              || 10 > oSettings.fnRecordsDisplay()) {
                              jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_info').hide();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_length').hide();
                          } else {
                              jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_info').show();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_length').show();
                          }
                      },
                  }).on('page', function () {
                      let recordsCopy = templateObject.stockrecords.get('pending');
                      recordsCopy=recordsCopy.pending ;
                      templateObject.$("input.select-stock-pending").prop('checked',false);
                      //templateObject.draftTotalAmount.set(0);
                      recordsCopy.forEach((record) => {
                          record.selected = false;
                      });
                      templateObject.toBeDeleted = [];
                      templateObject.records.set(recordsCopy);
                      templateObject.selectedObj.set(templateObject.toBeDeleted);
                      templateObject.$('#all-stock-pending').prop('checked', false);
                  });
                  table.column(0).visible(true);
                  let pendingCount = table.column(0).data().length;
                  templateObject.pendingCount.set(pendingCount);


              }, 0);
          };
          templateObject.getAllStockAdjust();
          $('#stockpendinglist tbody').on('click', 'td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6)', function (e) {
              var listData3 =$(this).closest('tr').attr('id');
              recordId = parseInt(listData3.split('stock-row-')[1]);
              window.open('/stockscan?id=' + recordId,'_self');
              //let draftRecordId = parseInt(listData3.split('purchase-row-')[1]);
              //window.open('/pocard?id=' + draftRecordId, '_self');
          });

          $("#search_list").click(function () {
              var search_query3 = $("#mySearchInput").val();
              var search_startdate3 = $("#listdatepickerstart").val();
              var startdate_format3 = moment(search_startdate3).format("DD-MM-YYYY");
              var search_enddate3 = $("#listdatepickerend").val();
              var enddate_format3 = moment(search_enddate3).format("DD-MM-YYYY");
              var searchNow3 = null;

              if (search_query3 != '') {
                  searchNow3 = search_query3;
              } else if ($(mySearchDropdown).val() == '') { // or this.value == 'volvo'
                  searchNow3 = search_query3;
              } else if ($(mySearchDropdown).val() == 'Any Date') {
                  searchNow3 = search_query3;
              } else if ($(mySearchDropdown).val() == 'Date Created') {
                  searchNow3 = startdate_format3;
              } else if ($(mySearchDropdown).val() == 'Expiry Date') {
                  searchNow3 = enddate_format3;
              }
              table.search(searchNow3).draw();
          });

          $('#searchreset').click(function () {
              table.search('').draw();
              $('#mySearchInput').val('');
              $('#listdatepickerstart').val('');
              $('#listdatepickerend').val('');
              $("#mySearchDropdown").val($("#target option:first").val());
          });
      }
  }
});

Template.stockadjlist.onRendered(function(){
  let templateObject = Template.instance();
  let totalAmount = 0;
  var erpGet2 = erpDb();
  let table2;
  var oSentReq2 = new XMLHttpRequest();
      oSentReq2.open("GET",URLRequest + erpGet2.ERPIPAddress + ':' + erpGet2.ERPPort + '/' + erpGet2.ERPApi + '/' + erpGet2.ERPProcessedStockTakeListObject, true);
      oSentReq2.setRequestHeader("database",erpGet2.ERPDatabase);
      oSentReq2.setRequestHeader("username",erpGet2.ERPUsername);
      oSentReq2.setRequestHeader("password",erpGet2.ERPPassword);
      oSentReq2.send();
  //oReq.onload = reqListner;
  oSentReq2.timeout = 30000;
  oSentReq2.onreadystatechange = function() {

      if (oSentReq2.readyState == 4 && oSentReq2.status == 200) {

          var dataListRet2 = JSON.parse(oSentReq2.responseText);
          templateObject.getAllStockAdjust = function () {
              let records = [];
              for (let i = 0; i < dataListRet2.tstockadjustentry.length; i++) {
                  let recordObj = {};
                  recordObj.id = dataListRet2.tstockadjustentry[i].Id;
                  recordObj.selected = false;
                  //recordObj.amount = dataListRet2.tstockadjustentry[i].TotalAmountInc;
                  recordObj.dataArr = [
                      moment(dataListRet2.tstockadjustentry[i].CreationDate).format("DD-MM-YYYY") || dataListRet3.tstockadjustentry[i].CreationDate,
                      dataListRet2.tstockadjustentry[i].Notes || '-',
                      dataListRet2.tstockadjustentry[i].Employee || '-',
                      dataListRet2.tstockadjustentry[i].AccountName || '-',
                      moment(dataListRet2.tstockadjustentry[i].AdjustmentDate).format("DD-MM-YYYY") || dataListRet3.tstockadjustentry[i].AdjustmentDate,

                  ];

                  records.push(recordObj);
              }
              var temp = templateObject.stockrecords.get();
              temp.processed = records ;
              templateObject.stockrecords.set(temp);
              setTimeout(function () {
                  table2 = $('#stockprocessedlist').DataTable({
                      columnDefs: [
                          {orderable: false, targets: 0},
                          { targets: 0, className: "text-center"}
                      ],
                      select: true,
                      destroy:true,
                      colReorder: true,
                      colReorder: {
                          fixedColumnsLeft: 0
                      },
                      bStateSave: true,
                      info: false,
                      "dom": '<"top"i>rt<"bottom"flp><"clear">',
                      "fnDrawCallback": function (oSettings) {
                          if (oSettings._iDisplayLength == -1
                              || 10 > oSettings.fnRecordsDisplay()) {
                              jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_info').hide();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_length').hide();
                          } else {
                              jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_info').show();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_length').show();
                          }
                      },
                  }).on('page', function () {
                      let recordsCopy = templateObject.stockrecords.get('processed');
                      recordsCopy=recordsCopy.processed ;
                      templateObject.$("input.select-stock-processed").prop('checked',false);

                      recordsCopy.forEach((record) => {
                          record.selected = false;
                      });
                      templateObject.toBeDeleted = [];
                      templateObject.records.set(recordsCopy);
                      templateObject.selectedObj.set(templateObject.toBeDeleted);
                      templateObject.$('#all-stock-processed').prop('checked', false);
                  });
                  table2.column(0).visible(true);
                  let processedCount = table2.column(0).data().length;
                  templateObject.processedCount.set(processedCount);

              }, 0);
          };
          templateObject.getAllStockAdjust();
          $('#stockprocessedlist tbody').on('click', 'td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6)', function (e) {
              var listData2 =$(this).closest('tr').attr('id');
              recordId = parseInt(listData2.split('stock-row-')[1]);
              window.open('/stockscan?id=' + recordId,'_self');
            //  let AWRecordId = parseInt(listData2.split('purchase-row-')[1]);
            //  window.open('/pocard?id=' + AWRecordId,'_self');
          });
          $("#search_list").click(function() {
              var search_query2 = $("#mySearchInput").val();
              var search_startdate2 = $("#listdatepickerstart").val();
              var startdate_format2 = moment(search_startdate2).format("DD-MM-YYYY");
              var search_enddate2 = $("#listdatepickerend").val();
              var enddate_format2 = moment(search_enddate2).format("DD-MM-YYYY");
              var searchNow2 = null;

              if(search_query2 != ''){
                  searchNow2 = search_query2;
              }else if($(mySearchDropdown).val() == ''){ // or this.value == 'volvo'
                  searchNow2 = search_query2;
              }else if($(mySearchDropdown).val() == 'Any Date'){
                  searchNow2 = search_query2;
              }else if($(mySearchDropdown).val() == 'Date Created'){
                  searchNow2 = startdate_format2;
              }else if($(mySearchDropdown).val() == 'Expiry Date'){
                  searchNow2 = enddate_format2;
              }
              table2.search(searchNow2).draw();
          });

          $('#searchreset').click(function() {
              table2.search('').draw();
              $('#mySearchInput').val('');
              $('#listdatepickerstart').val('');
              $('#listdatepickerend').val('');
              $("#mySearchDropdown").val($("#target option:first").val());
          });
      }
  }
});

Template.stockadjlist.onRendered(function(){
  /*
  let templateObject = Template.instance();
  var erpGet3 = erpDb();
  let table3;
  let totalAmount = 0;
  var oDecReq3 = new XMLHttpRequest();
      oDecReq3.open("GET",URLRequest + erpGet3.ERPIPAddress + ':' + erpGet3.ERPPort + '/' + erpGet3.ERPApi + '/' + erpGet3.ERPApprovedStockTakeListObject, true);
      oDecReq3.setRequestHeader("database",erpGet3.ERPDatabase);
      oDecReq3.setRequestHeader("username",erpGet3.ERPUsername);
      oDecReq3.setRequestHeader("password",erpGet3.ERPPassword);
      oDecReq3.send();
  //oReq.onload = reqListner;
  oDecReq3.timeout = 30000;
  oDecReq3.onreadystatechange = function() {
      if (oDecReq3.readyState == 4 && oDecReq3.status == 200) {

          var dataListRet3 = JSON.parse(oDecReq3.responseText)
          templateObject.getAllStockAdjust = function () {
              let records = [];
              for (let i = 0; i < dataListRet3.tstockadjustentry.length; i++) {
                  let recordObj = {};
                  recordObj.id = dataListRet3.tstockadjustentry[i].Id;
                  recordObj.selected = false;

                  recordObj.dataArr = [
                      moment(dataListRet3.tstockadjustentry[i].CreationDate).format("DD-MM-YYYY") || dataListRet3.tstockadjustentry[i].CreationDate,
                      dataListRet3.tstockadjustentry[i].Notes || '-',
                      dataListRet3.tstockadjustentry[i].Employee || '-',
                      dataListRet3.tstockadjustentry[i].AccountName || '-',
                      moment(dataListRet3.tstockadjustentry[i].AdjustmentDate).format("DD-MM-YYYY") || dataListRet3.tstockadjustentry[i].AdjustmentDate,

                  ];

                  records.push(recordObj);
              }
              var temp = templateObject.stockrecords.get();
              temp.approved = records ;

              templateObject.stockrecords.set(temp);
              setTimeout(function () {
                  table3 = $('#stockapprovedlist').DataTable({
                      columnDefs: [
                          {orderable: false, targets: 0}
                      ],
                      select: true,
                      destroy:true,
                      colReorder: true,
                      colReorder: {
                          fixedColumnsLeft: 0
                      },
                      bStateSave: true,
                      info: false,
                      "dom": '<"top"i>rt<"bottom"flp><"clear">',
                      "fnDrawCallback": function (oSettings) {
                          if (oSettings._iDisplayLength == -1
                              || 10 > oSettings.fnRecordsDisplay()) {
                              jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_info').hide();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_length').hide();
                          } else {
                              jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_info').show();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_length').show();
                          }
                      },
                  }).on('page', function () {
                      let recordsCopy = templateObject.stockrecords.get('approved');
                      recordsCopy=recordsCopy.approved ;
                      templateObject.$("input.select-purchase-approved").prop('checked',false);

                      recordsCopy.forEach((record) => {
                          record.selected = false;
                      });
                      templateObject.toBeDeleted = [];
                      templateObject.records.set(recordsCopy);
                      templateObject.selectedObj.set(templateObject.toBeDeleted);
                      templateObject.$('#all-stock-approved').prop('checked', false);
                  });
                  table3.column(0).visible(true);
                  let ApprovedCount = table3.column(0).data().length;
                  templateObject.approvedCount.set(ApprovedCount);

              }, 1000);
          };
          templateObject.getAllStockAdjust();
          $('#stockapprovedlist tbody').on('click', 'td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6)', function (e) {
              //var listData3 =$(this).closest('tr').attr('id');
            //  let ApprovedRecordId = parseInt(listData3.split('purchase-row-')[1]);
              //window.open('/Accounts/Payable/PurchaseOrders/View?id=' + ApprovedRecordId,'_self');
          });

          $("#search_list").click(function() {
              var search_query3 = $("#mySearchInput").val();
              var search_startdate3 = $("#listdatepickerstart").val();
              var startdate_format3 = moment(search_startdate3).format("DD-MM-YYYY");
              var search_enddate3 = $("#listdatepickerend").val();
              var enddate_format3 = moment(search_enddate3).format("DD-MM-YYYY");
              var searchNow3 = null;

              if(search_query3 != ''){
                  searchNow3 = search_query3;
              }else if($(mySearchDropdown).val() == ''){ // or this.value == 'volvo'
                  searchNow3 = search_query3;
              }else if($(mySearchDropdown).val() == 'Any Date'){
                  searchNow3 = search_query3;
              }else if($(mySearchDropdown).val() == 'Date Created'){
                  searchNow3 = startdate_format3;
              }else if($(mySearchDropdown).val() == 'Expiry Date'){
                  searchNow3 = enddate_format3;
              }
              table3.search(searchNow3).draw();
          });

          $('#searchreset').click(function() {
              table3.search('').draw();
              $('#mySearchInput').val('');
              $('#listdatepickerstart').val('');
              $('#listdatepickerend').val('');
              $("#mySearchDropdown").val($("#target option:first").val());
          });
      }
  }
  */
});

Template.stockadjlist.onRendered(function(){
  let templateObject = Template.instance();
  var erpGet5 = erpDb();
  let table3;
  let totalAmount = 0;
  var oBilledReq = new XMLHttpRequest();
      oBilledReq.open("GET",URLRequest + erpGet5.ERPIPAddress + ':' + erpGet5.ERPPort + '/' + erpGet5.ERPApi + '/' + erpGet5.ERPDeletedStockTakeListObject, true);
      oBilledReq.setRequestHeader("database",erpGet5.ERPDatabase);
      oBilledReq.setRequestHeader("username",erpGet5.ERPUsername);
      oBilledReq.setRequestHeader("password",erpGet5.ERPPassword);
      oBilledReq.send();
  //oReq.onload = reqListner;
  oBilledReq.timeout = 30000;
  oBilledReq.onreadystatechange = function() {
      if (oBilledReq.readyState == 4 && oBilledReq.status == 200) {

          var dataListRet3 = JSON.parse(oBilledReq.responseText);
          templateObject.getAllStockAdjust = function () {
              let records = [];
              for (let i = 0; i < dataListRet3.tstockadjustentry.length; i++) {
                  let recordObj = {};
                  recordObj.id = dataListRet3.tstockadjustentry[i].Id;
                  recordObj.selected = false;

                  recordObj.dataArr = [
                    moment(dataListRet3.tstockadjustentry[i].CreationDate).format("DD-MM-YYYY") || dataListRet3.tstockadjustentry[i].CreationDate,
                      dataListRet3.tstockadjustentry[i].Notes || '-',
                      dataListRet3.tstockadjustentry[i].Employee || '-',
                      dataListRet3.tstockadjustentry[i].AccountName || '-',
                      moment(dataListRet3.tstockadjustentry[i].AdjustmentDate).format("DD-MM-YYYY") || dataListRet3.tstockadjustentry[i].AdjustmentDate,

                  ];
                  records.push(recordObj);
              }
              var temp = templateObject.stockrecords.get();
              temp.deleted = records ;
              templateObject.stockrecords.set(temp);
              setTimeout(function () {
                  table3 = $('#stockdeletedlist').DataTable({
                      columnDefs: [
                          {orderable: false, targets: 0},
                          { targets: 0, className: "text-center"}
                      ],
                      select: true,
                      destroy:true,
                      colReorder: true,
                      colReorder: {
                          fixedColumnsLeft: 0
                      },
                      bStateSave: true,
                      info: false,
                      "dom": '<"top"i>rt<"bottom"flp><"clear">',
                      "fnDrawCallback": function (oSettings) {
                          if (oSettings._iDisplayLength == -1
                              || 10 > oSettings.fnRecordsDisplay()) {
                              jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_info').hide();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_length').hide();
                          } else {
                              jQuery(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_info').show();
                              jQuery(oSettings.nTableWrapper).find('.dataTables_length').show();
                          }
                      },
                  }).on('page', function () {
                      let recordsCopy = templateObject.stockrecords.get('deleted');
                      recordsCopy=recordsCopy.deleted ;
                      templateObject.$("input.select-stock-deleted").prop('checked',false);
                      recordsCopy.forEach((record) => {
                          record.selected = false;
                      });
                      templateObject.toBeDeleted = [];
                      templateObject.records.set(recordsCopy);
                      templateObject.selectedObj.set(templateObject.toBeDeleted);
                      templateObject.$('#all-stock-deleted').prop('checked', false);
                  });
                  table3.column(0).visible(true);
                  let deletedCount = table3.column(0).data().length;
                  templateObject.deletedCount.set(deletedCount);

              }, 0);
          };
          templateObject.getAllStockAdjust();
          $('#stockdeletedlist tbody').on('click', 'td:nth-child(2), td:nth-child(3), td:nth-child(4), td:nth-child(5), td:nth-child(6)', function (e) {
              var listData3 =$(this).closest('tr').attr('id');
              recordId = parseInt(listData3.split('stock-row-')[1]);
              window.open('/stockscan?id=' + recordId,'_self');
              //let BillRecordId = parseInt(listData3.split('purchase-row-')[1]);
              //window.open('/Accounts/Payable/PurchaseOrders/BilledView?id=' + BillRecordId,'_self');
          });

          $("#search_list").click(function() {
              var search_query3 = $("#mySearchInput").val();
              var search_startdate3 = $("#listdatepickerstart").val();
              var startdate_format3 = moment(search_startdate3).format("DD-MM-YYYY");
              var search_enddate3 = $("#listdatepickerend").val();
              var enddate_format3 = moment(search_enddate3).format("DD-MM-YYYY");
              var searchNow3 = null;

              if(search_query3 != ''){
                  searchNow3 = search_query3;
              }else if($(mySearchDropdown).val() == ''){ // or this.value == 'volvo'
                  searchNow3 = search_query3;
              }else if($(mySearchDropdown).val() == 'Any Date'){
                  searchNow3 = search_query3;
              }else if($(mySearchDropdown).val() == 'Date Created'){
                  searchNow3 = startdate_format3;
              }else if($(mySearchDropdown).val() == 'Expiry Date'){
                  searchNow3 = enddate_format3;
              }

              table3.search(searchNow3).draw();
          });

          $('#searchreset').click(function() {
              table3.search('').draw();
              $('#mySearchInput').val('');
              $('#listdatepickerstart').val('');
              $('#listdatepickerend').val('');
              $("#mySearchDropdown").val($("#target option:first").val());
          });
      }
  };
});

Template.stockadjlist.onRendered(function () {
  let StockPrintService = new StockAdjust();
  orderGenerationToMultiplePdf=function(listIds){
      let doc = new jsPDF();
      for(let j =0;j<listIds.length;j++) {

          StockPrintService.getOneStockAdjustData(listIds[j]).then(function (data) {
            
              if (data.fields.Lines.length) {
                  var stockrecord = {
                    stockid: data.fields.ID,
                      originalno: data.fields.GlobalRef,
                      creationdate: data.fields.CreationDate ? moment(data.fields.CreationDate).format('DD MMM YYYY') : "",
                      //saledate: data.fields.OrderDate ? moment(data.fields.OrderDate).format('DD MMM YYYY') : "",
                      //deliverydate: data.fields.ETADate ? moment(data.fields.ETADate).format('DD MMM YYYY') : "",
                      accountname: data.fields.AccountName,
                      notes: data.fields.Notes,
                      employee: data.fields.Employee,
                      isstocktake: data.fields.IsStockTake,
                      deleted: data.fields.Deleted,
                      processed: data.fields.Processed,
                      adjustmentdate: data.fields.AdjustmentDate ? moment(data.fields.AdjustmentDate).format('DD MMM YYYY') : "",

                  };
              }

              doc.setFontSize(16);
              /*
              if (stockrecord.status === "Awaiting Approval") {
                  doc.text(stockrecord.status.toUpperCase() + " STOCK", 15, 40);
                  doc.text("ADJUST", 45, 48)
              }
              */
              //else {
                  doc.text(" STOCK ADJUST ", 20, 40);
            //  }
              doc.setFontSize(8);
              doc.text(stockrecord.accountname, 45, 53);
              //purchase date
              doc.setFontType('bold');
              getDataUri = function (url, callback) {
                  var image = new Image();
                  image.onload = function () {
                      var canvas = document.createElement('canvas');
                      canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
                      canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

                      canvas.getContext('2d').drawImage(this, 0, 0);
                      // ... or get as Data URI
                      callback(canvas.toDataURL('image/png'));
                  };

                  image.src = url;
              }
              getDataUri('/img/logo_new.png', function (dataUri) {
                  doc.addImage(dataUri, 'PNG', 88, 18, 89, 18);
                  doc.text("CreationDate:", 120, 40);
                  //Delivery Date
                  doc.text("Adjustment Date:", 120, 52);
                  doc.text("Stock Adjust Number:", 120, 64);
                  //doc.text("ABN:", 120, 76);
                  doc.text("Employee Name:", 120, 76)
                  doc.setFontType('normal');
                  doc.text(stockrecord.creationdate, 120, 45);
                  doc.text(stockrecord.adjustmentdate, 120, 57);
                  doc.text(stockrecord.originalno, 120, 69);
                  doc.text(stockrecord.employee, 120, 81);
                  //doc.text(stockrecord.employee, 120, 57);

                  doc.text(loggedCompany, 170, 40);
                  doc.text("23 Main Street", 170, 45);
                  doc.text("MARINEVILLE NSW 2000", 170, 50);


                  //table
                  doc.setFontType('bold');
                  doc.text("Product Name", 20, 100);
                  doc.text("In Stock ", 110, 100);
                  doc.text("Qty Adjust", 132, 100);
                  doc.text("UOM", 155, 100);
                  doc.text("Final Qty", 175, 100);
                  doc.line(18, 103, 195, 103);
                  doc.setFontType('normal');
                  doc.setFontSize(8);
                  let axiz = 0;
                  for (let i = 0; i < data.fields.Lines.length; i++) {

                      doc.text('' + data.fields.Lines[i].fields.ProductName || '', 20, 110 + axiz);
                      doc.text('' + data.fields.Lines[i].fields.InStockQty || 0, 115, 110 + axiz);
                      doc.text('' + data.fields.Lines[i].fields.AdjustQty || 0, 135, 110 + axiz);
                      doc.text('' + data.fields.Lines[i].fields.UOM || '', 156, 110 + axiz);
                      doc.text('' + data.fields.Lines[i].fields.FinalQty || 0, 185, 110 + axiz);
                      axiz += 3;
                      doc.line(18, 110 + axiz, 195, 110 + axiz);
                      axiz += 10;
                  }
                  //doc.text('Subtotal', 145, 110 + axiz);
                  //doc.text('' + data.fields.TotalAmount.toFixed(2) || 0, 185, 110 + axiz);

                  //axiz += 5;
                  //if (data.fields.TotalTax != null) {
                      //doc.text('Total ' + data.fields.Lines[0].fields.LineTaxRate * 100 + '%', 145, 110 + axiz);

                    //  doc.text('' + data.fields.TotalTax.toFixed(2), 185, 110 + axiz);
                      //axiz += 5;
                  //}
                  //doc.line(105, 110 + axiz, 195, 110 + axiz);
                  axiz += 10;
                  doc.setFontType('bold');
                  doc.setFontSize(10);
                  //doc.text('TOTAL AUD', 140, 110 + axiz);
                  //doc.text('' + data.fields.TotalAmountInc.toFixed(2) || 0, 182, 110 + axiz);
                  axiz += 5;
                  //doc.line(105, 110 + axiz, 195, 110 + axiz);
                  if (j < listIds.length-1) {
                      doc.addPage();
                  }
                  else{
                      doc.save('Stock Adjust' +moment().format('DD MMM YYYY') + '.pdf');
                      setTimeout("$('#printOrder').modal('hide');", 300);
                  }
              });
          });
      }
  }
});

Template.stockadjlist.helpers({
  currentTab: () => {
      return Template.instance().currentTab.get();
  },
  records: () => {
      return Template.instance().records.get();
  },
  stockrecords: () => {
      return Template.instance().stockrecords.get();
  },
  selectedObj: () => {
      return Template.instance().selectedObj.get().length;
  },
  pendingCount: () => {
      return Template.instance().pendingCount.get();
  },
  processedCount: () => {
      return Template.instance().processedCount.get();
  },
  approvedCount: () => {
      return Template.instance().approvedCount.get();
  },
  deletedCount: () => {
      return Template.instance().deletedCount.get();
  },
  stockCount: () => {
      return Template.instance().stockCount.get();
  },
  selectedRecords: () => {
      return Session.get('selectedRecords');
  },
  pendingRecordId: () => {
      return Session.get('pendingRecordId');
  },
  pendingDraft: () => {
      return Template.instance().deletePending.get();
  },
  pendingDeleteMsg: () => {
      return Session.get('pendingDeleteMsg');
  },
  stockID: () => {
      return Session.get('stockID');
  },
  stockrecord: () => {
      return Template.instance().stockrecord.get();
  },
  processedMsg: () => {
      return Template.instance().processedMsg.get();
  },
  pendingRecordId: () => {
      return Session.get('pendingRecordId');
  },
  pendingToProcessed: () => {
      return Session.get('pendingToProcessed');
  }
});

Template.stockadjlist.events({
  'click .select-stock-pending, click .select-stock-processed, click .select-stock-approved, click .select-stock-deleted': function (event) {
      let templateObj = Template.instance();
      Session.set('stockID',this.id);
      let toBeDeleted = templateObj.toBeDeleted;
      let selectedRowData = templateObj.selectedRowData;
      if (!this.id) {
          return false;
      }
      if (!this.selected) {
          let selectedRowByCheck = {
              id: this.id,
              createDate: this.dataArr[0],
              Employee: this.dataArr[2],
              AccountName : this.dataArr[3]
          };
          //let totalDraftAmount = this.amount;
          //totalDraftAmount += templateObj.draftAmount.get();
          //templateObj.draftAmount.set(totalDraftAmount);
          //totalDraftAmount = Currency + '' + totalDraftAmount.toLocaleString(undefined, {minimumFractionDigits: 2});
          //templateObj.draftTotalAmount.set(totalDraftAmount);
          selectedRowData.push(selectedRowByCheck);
          toBeDeleted.push(parseInt(this.id));
      } else {
          //let totalDraftAmount = this.amount;
        //  let temp = templateObj.draftAmount.get() - totalDraftAmount;
        //  templateObj.draftAmount.set(temp);
          //temp = Currency + '' + temp.toLocaleString(undefined, {minimumFractionDigits: 2});
          //templateObj.draftTotalAmount.set(temp);
          toBeDeleted.splice(toBeDeleted.indexOf(this.id),1);
          let idTobeRemoved = selectedRowData.map(function(e) { return e.id; }).indexOf(parseInt(this.id));
          selectedRowData.splice(idTobeRemoved,1);
          toBeDeleted.splice(idTobeRemoved,1);
      }
      let type = event.target.dataset.stocktype;
      let records = templateObj.stockrecords.get(type);

      records =  records[type];
      let index = records.indexOf(this);
      
      if (index !== -1) {
          this.selected = !this.selected;
          records[index].selected = this.selected;
          templateObj.records.set(records);
      }
      templateObj.selectedObj.set(toBeDeleted);
      let flag = true;
      let table;
      let hash = window.location.hash;
      switch (hash) {
          case '#Pending' :
              table = $('#stockpendinglist').DataTable();
              break;
          case '#Processed' :
              table = $('#stockprocessedlist').DataTable();
              break;
          case '#Approved' :
              table = $('#stockapprovedlist').DataTable();
              break;
          case '#Deleted' :
              table = $('#stockdeletedlist').DataTable();
              break;
      }
      let allRecords = table.rows({page: 'current'}).data();
      for(let i=0; i<allRecords.length; i++){
          let recordId = allRecords[i].DT_RowId;
          recordId = parseInt(recordId.split('stock-row-')[1]);
          if(!($('input#'+recordId+'.disable-click-event').prop('checked')===true)){
            $('tr#stock-row-'+recordId).removeClass("selected");
              flag = false;
          }else{
              $('tr#stock-row-'+recordId).addClass("selected");
          }
      }
      let className = 'accountPending';
      if(event.target.dataset.stocktype  == 'pending'){
          className = 'accountPending';
      }
      if(event.target.dataset.stocktype  == 'processed'){
          className = 'accountProcessed';
      }
      if(event.target.dataset.stocktype  == 'approved'){
          className = 'accountApproved';
      }
      $('.'+className).prop('checked', flag);
  },
  'click .accountPending, click .accountProcessed, click .accountApproved, click .accountDeleted ': function (event) {
      let templateObj = Template.instance();
      let type = event.target.dataset.stocktype;
      let selectedRowData = templateObj.selectedRowData;
      let records = templateObj.stockrecords.get(type);
      records =  records[type];
      templateObj.toBeDeleted = [];
      let allRecordIDs = [];
    //  let totalDraftAmount = 0;
      let table;
      let hash = window.location.hash;
      switch (hash) {
          case '#Pending' :
              table = $('#stockpendinglist').DataTable();
              break;
          case '#Processed' :
              table = $('#stockprocessedlist').DataTable();
              break;
          case '#Approved' :
              table = $('#stockapprovedlist').DataTable();
              break;
          case '#Deleted' :
              table = $('#stockdeletedlist').DataTable();
              break;
      }
      let allRecords = table.rows({page: 'current'}).data();
      for(let i=0; i<allRecords.length; i++){
          let recordId = allRecords[i].DT_RowId;
          recordId = parseInt(recordId.split('stock-row-')[1]);
          let recordObj = {'id':recordId};
          allRecordIDs.push(recordObj);
      }
      /*To Select all the records in Current page*/
      if (document.getElementById(event.target.id).checked) {
          for (let i = 0; i < allRecordIDs.length; i++) {
              for (let j = 0; j < records.length; j++) {
                  if (records[j].id === allRecordIDs[i].id) {
                      records[j].selected = true;
                      //totalDraftAmount += records[j].amount;
                      //templateObj.draftAmount.set(totalDraftAmount);
                      templateObj.toBeDeleted.push(records[j].id);
                      let selectedMultipleRowData = {
                          id: records[j].id,
                          createDate: records[j].dataArr[0],
                          Employee: records[j].dataArr[2],
                          AccountName : records[j].dataArr[3]
                      };
                      templateObj.selectedRowData.push(selectedMultipleRowData);
                      templateObj.$("input#"+allRecordIDs[i].id).prop('checked',true);
                      $('tr#stock-row-'+allRecordIDs[i].id).addClass("selected");
                      break;
                  }
              }
          }
          //templateObj.draftTotalAmount.set(Currency + '' +totalDraftAmount.toLocaleString(undefined, {minimumFractionDigits: 2}));
      } else {
          /*To Deselect all the records in Current page*/
          //totalDraftAmount = 0;
          for (let i = 0; i < allRecordIDs.length; i++) {
              for (let j = 0; j < records.length; j++) {
                  if (records[j].id === allRecordIDs[i].id) {
                      records[j].selected = false;
                      //templateObj.draftAmount.set(0);
                      //templateObj.draftTotalAmount.set(0);
                      templateObj.$("input#"+allRecordIDs[i].id).prop('checked',false);
                      $('tr#stock-row-'+allRecordIDs[i].id).removeClass("selected");
                      break;
                  }
              }
          }
          templateObj.toBeDeleted = [];
          templateObj.selectedRowData = [];
      }
      templateObj.records.set(records);
      templateObj.selectedObj.set(templateObj.toBeDeleted);

  },
  'click .tabinator input': function (event) {
      let templateObj = Template.instance();
      let records = templateObj.stockrecords.get();
      templateObj.unchecked = function () {
          templateObj.$("input.disable-click-event").prop('checked',false);
          templateObj.$('.allStockRecords').prop('checked', false);
          templateObj.toBeDeleted = [];
          templateObj.selectedRowData = [];
          templateObj.selectedObj.set(templateObj.toBeDeleted);
          //templateObj.draftAmount.set(0);
          //templateObj.draftTotalAmount.set(0);
          if(typeof records !== 'undefined'){
              records.forEach((record) => {
                  record.selected = false;
              });
          }

      };
      switch (event.currentTarget.id) {
          case 'tab1' :
              FlowRouter.go('/stockadjlist/#All');
              break;
          case 'tab2' :
              FlowRouter.go('/stockadjlist/#Pending');
              records = records.pending;
              templateObj.unchecked();
              break;
          case 'tab3' :
              FlowRouter.go('/stockadjlist/#Processed');
              records = records.processed;
              templateObj.unchecked();
              break;
          case 'tab4' :
              FlowRouter.go('/stockadjlist/#Approved');
              records = records.approved;
              templateObj.unchecked();
              break;
          case 'tab5' :
              FlowRouter.go('/stockadjlist/#Deleted');
              records = records.deleted;
              templateObj.unchecked();
              break;
      }
  },
  'click .printBtn':function () {
      $("#printConfirm").show();
      $("#printPdf").hide();
  },
  'click #printConfirm ':function () {
      $("#printConfirm").hide();
      $("#printPdf").show();
      let templateObj = Template.instance();
      const listIds = templateObj.selectedObj.get();
      orderGenerationToMultiplePdf(listIds);

  },
  'click #submit-process-stock, click #submit-approved-PO':function (event) {
      let tempObj = Template.instance();
      Session.set('selectedRecords',tempObj.selectedObj.get().length);
      if(event.currentTarget.id === 'submit-process-stock'){
          tempObj.processedMsg.set(true);
      }
      else {
          tempObj.processedMsg.set(false);
      }
  },
  'click #awaiting-approval-PO, click #processed-stock': function (event) {
      let templateObj = Template.instance();
      let stockService = new StockAdjust();
      let objDetails;
      Session.set('pendingToProcessed',true);
      let selectedRecordsList = templateObj.selectedObj.curValue;
      for (let i = 0; i < selectedRecordsList.length; i++) {
          stockService.getOneStockAdjustData(selectedRecordsList[i]).then(function (data) {

                 objDetails = {
                      type: "TStockAdjustEntry",
                      fields: {
                          ID: data.fields.ID,
                          //OrderStatus: 'Approved',
                          Processed :true
                      }
                  };

              Session.set('pendingRecordId',objDetails.fields.ID);
              stockService.saveStock(objDetails).then(function (data) {
                  if(i === selectedRecordsList.length-1 ){
                      setTimeout(function () {
                          Meteor._reload.reload();
                      },1000)
                  }
              });

          });
      }
  },
  'click #close-pending-stock-notification':function(){
      let tempObj = Template.instance();
      tempObj.$(".notify").hide();
      Session.set('pendingToProcessed',false);
  },
  'click #view-items-processed':function() {
      if(Session.get('selectedRecords') === 1){
          window.open('/stockscan?id=' + Session.get('pendingRecordId'), '_self');
      }
      else {
          $('#stockPending').click();
      }
  },
  'click #delete-pending-stock':function (event) {
      let tempObj = Template.instance();
      Session.set('selectedRecords',tempObj.selectedObj.get().length);
     tempObj.deletePending.set(true);
  },
  'click #delete-stock-pending': function () {
    let stockService = new StockAdjust();
      let templateObj = Template.instance();


      Session.set('pendingDeleteMsg',true);
      for (let i = 0; i < templateObj.selectedRowData.length; i++) {
        
          let objDetails = {
              type: "TStockAdjustEntry",
              fields: {
                  ID: templateObj.selectedRowData[i].id,
                  Deleted: true,
                  Processed: false,
                  IsStockTake: false


              }
          };
          stockService.saveStock(objDetails).then(function (data) {
              if (i === templateObj.selectedRowData.length - 1) {
                  setTimeout(function () {
                      Meteor._reload.reload();
                  }, 1000)
              }
          }).catch(function (err) {
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
});
