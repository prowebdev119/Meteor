import {ReportService} from "../report-service";
import {SalesBoardService} from '../../js/sales-service';
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let reportService = new ReportService();
let utilityService = new UtilityService();
Template.balancetransactionlist.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.balancetransactionlist.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    // let accountService = new AccountService();
    // let salesService = new SalesBoardService();
    const customerList = [];
    let salesOrderTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];

    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblBalanceTransactionList', function(error, result){
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
           $("th."+columnClass+"").html(columData);
            $("th."+columnClass+"").css('width',""+columnWidth+"px");

        }
      }

    }
    });

    let urlParameters = FlowRouter.current().queryParams.accountName || '';
    templateObject.getAllBalanceSheetRedirectData = function () {
      if(!localStorage.getItem('VS1BalanceTrans_Report')){
      reportService.getBalanceSheetRedirectData().then(function (data) {
        //localStorage.setItem('VS1BalanceTrans_Report', JSON.stringify(data)||'');
        for(let i = 0; i < data.taccountrunningbalancereport.length; i++){
          let childArray = data.taccountrunningbalancereport[i];
          if((childArray.AccountName === urlParameters)&&(childArray.Type != '')){

          let openingAmount = utilityService.modifynegativeCurrencyFormat(childArray.OpeningBalanceEx);
          let closingAmount = utilityService.modifynegativeCurrencyFormat(childArray.ClosingBalanceEx);
          let creditAmount = utilityService.modifynegativeCurrencyFormat(childArray.TotalCreditEx);
          let debitAmount = utilityService.modifynegativeCurrencyFormat(childArray.TotalDebitEx);
          let balaneAmount = utilityService.modifynegativeCurrencyFormat(childArray.Balance);
          let transactionNo = '';
          if((childArray.Type === "Bill") || (childArray.Type === "Cheque")
          ||(childArray.Type === "Credit")||(childArray.Type === "PO")||(childArray.Type === "Un-Invoiced PO")){
            transactionNo = childArray.PurchaseOrderID;
          }else if((childArray.Type === "Cash Sale") || (childArray.Type === "Invoice")
          ||(childArray.Type === "Journal Entry")||(childArray.Type === "Manufacturing")
          ||(childArray.Type === "Payroll") ||(childArray.Type === "POS")
          ||(childArray.Type === "Refund") ||(childArray.Type === "UnInvoiced SO")){
            transactionNo = childArray.SaleID;
          }else if((childArray.Type === "Bank Deposit") || (childArray.Type === "Customer Payment")
          ||(childArray.Type === "Deposit Entry")||(childArray.Type === "Supplier Payment")){
            transactionNo = childArray.PaymentID;
          }

          var dataList = {
          date: childArray.Date !=''? moment(childArray.Date).format("DD/MM/YYYY"): data.taccountrunningbalancereport[i].Date,
          sortdate: childArray.Date !=''? moment(childArray.Date).format("YYYY/MM/DD"): childArray.Date,
          accountname: childArray.AccountName || '',
          type: childArray.Type || '',
          clientname:childArray.clientname || '',
          debit: debitAmount || 0.00,
          credit: creditAmount || 0.00,
          balance: balaneAmount || 0.00,
          accounttype:childArray.AccountType,
          transactionno: transactionNo || '',
          openingbalance: openingAmount || 0.00,
          closingbalance: closingAmount || 0.00
        };

         dataTableList.push(dataList);
       }
         }

         templateObject.datatablerecords.set(dataTableList);

        if(templateObject.datatablerecords.get()){

          Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblBalanceTransactionList', function(error, result){
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

          function MakeNegative() {
            $('td').each(function(){
              if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
             });
          };
          setTimeout(function () {
            MakeNegative();
          }, 100);
        }

        $('.fullScreenSpin').css('display','none');
        if ($.fn.DataTable.isDataTable('#balance-sheet-detail')) {
            $('#tblBalanceTransactionList').DataTable().destroy();
            Meteor._reload.reload();
        }
        setTimeout(function () {
            $('#tblBalanceTransactionList').DataTable({
                  "columnDefs": [{ "targets": 0, "type": "date" }],
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                      {
                          extend: 'excelHtml5',
                          text: '',
                          download: 'open',
                          className: "btntabletocsv hiddenColumn",
                          filename: "Balance Transaction List - "+ moment().format(),
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
                          title: 'Balance Transaction',
                          filename: "Balance Transaction List - "+ moment().format(),
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
                  lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                  info: true,
                  responsive: true,
                  "order": [[ 0, "desc" ]],
                  action: function () {
                      $('#tblBalanceTransactionList').DataTable().ajax.reload();
                  },

              }).on('page', function () {

                  let draftRecord = templateObject.datatablerecords.get();
                  templateObject.datatablerecords.set(draftRecord);
              }).on('column-reorder', function () {

              });


              $('.fullScreenSpin').css('display','none');
          }, 0);

      $('#tblBalanceTransactionList tbody').on( 'click', 'tr', function () {
          var listData = $(this).closest('tr').attr('id');
          var transactiontype = $(event.target).closest("tr").find(".transactiontype").text();

          if((listData) && (transactiontype)){
            if(transactiontype === 'Quote' ){
              window.open('/quotecard?id=' + listData,'_self');
            }else if(transactiontype === 'Sales Order'){
              window.open('/salesordercard?id=' + listData,'_self');
            }else if(transactiontype === 'Invoice'){
              window.open('/invoicecard?id=' + listData,'_self');
            }else if(transactiontype === 'PO'){
              window.open('/purchaseordercard?id=' + listData,'_self');
            }else if(transactiontype === 'Bill'){
              //window.open('/billcard?id=' + listData,'_self');
            }else if(transactiontype === 'Credit'){
              //window.open('/creditcard?id=' + listData,'_self');
            }else if(transactiontype === 'Customer Payment'){
              window.open('/paymentcard?id=' + listData,'_self');
            }

          }
        });

          var columns = $('#tblBalanceTransactionList th');
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
      let data = JSON.parse(localStorage.getItem('VS1BalanceTrans_Report'));
      for(let i = 0; i < data.taccountrunningbalancereport.length; i++){
        let childArray = data.taccountrunningbalancereport[i];
        if((childArray.AccountName === urlParameters)&&(childArray.Type != '')){

        let openingAmount = utilityService.modifynegativeCurrencyFormat(childArray.OpeningBalanceEx);
        let closingAmount = utilityService.modifynegativeCurrencyFormat(childArray.ClosingBalanceEx);
        let creditAmount = utilityService.modifynegativeCurrencyFormat(childArray.TotalCreditEx);
        let debitAmount = utilityService.modifynegativeCurrencyFormat(childArray.TotalDebitEx);
        let balaneAmount = utilityService.modifynegativeCurrencyFormat(childArray.Balance);
        let transactionNo = '';
        if((childArray.Type === "Bill") || (childArray.Type === "Cheque")
        ||(childArray.Type === "Credit")||(childArray.Type === "PO")||(childArray.Type === "Un-Invoiced PO")){
          transactionNo = childArray.PurchaseOrderID;
        }else if((childArray.Type === "Cash Sale") || (childArray.Type === "Invoice")
        ||(childArray.Type === "Journal Entry")||(childArray.Type === "Manufacturing")
        ||(childArray.Type === "Payroll") ||(childArray.Type === "POS")
        ||(childArray.Type === "Refund") ||(childArray.Type === "UnInvoiced SO")){
          transactionNo = childArray.SaleID;
        }else if((childArray.Type === "Bank Deposit") || (childArray.Type === "Customer Payment")
        ||(childArray.Type === "Deposit Entry")||(childArray.Type === "Supplier Payment")){
          transactionNo = childArray.PaymentID;
        }

        var dataList = {
        date: childArray.Date !=''? moment(childArray.Date).format("DD/MM/YYYY"): data.taccountrunningbalancereport[i].Date,
        sortdate: childArray.Date !=''? moment(childArray.Date).format("YYYY/MM/DD"): childArray.Date,
        accountname: childArray.AccountName || '',
        type: childArray.Type || '',
        clientname:childArray.clientname || '',
        debit: debitAmount || 0.00,
        credit: creditAmount || 0.00,
        balance: balaneAmount || 0.00,
        accounttype:childArray.AccountType,
        transactionno: transactionNo || '',
        openingbalance: openingAmount || 0.00,
        closingbalance: closingAmount || 0.00
      };

       dataTableList.push(dataList);
     }
       }

       templateObject.datatablerecords.set(dataTableList);

      if(templateObject.datatablerecords.get()){

        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblBalanceTransactionList', function(error, result){
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

        function MakeNegative() {
          $('td').each(function(){
            if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
           });
        };
        setTimeout(function () {
          MakeNegative();
        }, 100);
      }

      $('.fullScreenSpin').css('display','none');
      if ($.fn.DataTable.isDataTable('#balance-sheet-detail')) {
          $('#tblBalanceTransactionList').DataTable().destroy();
          Meteor._reload.reload();
      }
      setTimeout(function () {
          $('#tblBalanceTransactionList').DataTable({
                columnDefs: [
                  {type: 'date', targets: 0}
                ],
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '',
                        download: 'open',
                        className: "btntabletocsv hiddenColumn",
                        filename: "Balance Transaction List - "+ moment().format(),
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
                        title: 'Balance Transaction',
                        filename: "Balance Transaction List - "+ moment().format(),
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
                lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                info: true,
                responsive: true,
                "order": [[ 0, "desc" ]],
                action: function () {
                    $('#tblBalanceTransactionList').DataTable().ajax.reload();
                },

            }).on('page', function () {

                let draftRecord = templateObject.datatablerecords.get();
                templateObject.datatablerecords.set(draftRecord);
            }).on('column-reorder', function () {

            });


            $('.fullScreenSpin').css('display','none');
        }, 0);

    $('#tblBalanceTransactionList tbody').on( 'click', 'tr', function () {
        var listData = $(this).closest('tr').attr('id');
        var transactiontype = $(event.target).closest("tr").find(".transactiontype").text();

        if((listData) && (transactiontype)){
          if(transactiontype === 'Quote' ){
            window.open('/quotecard?id=' + listData,'_self');
          }else if(transactiontype === 'Sales Order'){
            window.open('/salesordercard?id=' + listData,'_self');
          }else if(transactiontype === 'Invoice'){
            window.open('/invoicecard?id=' + listData,'_self');
          }else if(transactiontype === 'PO'){
            window.open('/purchaseordercard?id=' + listData,'_self');
          }else if(transactiontype === 'Bill'){
            //window.open('/billcard?id=' + listData,'_self');
          }else if(transactiontype === 'Credit'){
            //window.open('/creditcard?id=' + listData,'_self');
          }else if(transactiontype === 'Customer Payment'){
            window.open('/paymentcard?id=' + listData,'_self');
          }

        }
      });

        var columns = $('#tblBalanceTransactionList th');
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
    }
    let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
    let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
    if(urlParametersDateFrom){
      reportService.getBalanceSheetRedirectRangeData(urlParametersDateFrom,urlParametersDateTo).then(function (data) {
        //localStorage.setItem('VS1BalanceTrans_Report', JSON.stringify(data)||'');
        for(let i = 0; i < data.taccountrunningbalancereport.length; i++){
          let childArray = data.taccountrunningbalancereport[i];
          if((childArray.AccountName === urlParameters)&&(childArray.Type != '')){

          let openingAmount = utilityService.modifynegativeCurrencyFormat(childArray.OpeningBalanceEx);
          let closingAmount = utilityService.modifynegativeCurrencyFormat(childArray.ClosingBalanceEx);
          let creditAmount = utilityService.modifynegativeCurrencyFormat(childArray.TotalCreditEx);
          let debitAmount = utilityService.modifynegativeCurrencyFormat(childArray.TotalDebitEx);
          let balaneAmount = utilityService.modifynegativeCurrencyFormat(childArray.Balance);
          let transactionNo = '';
          if((childArray.Type === "Bill") || (childArray.Type === "Cheque")
          ||(childArray.Type === "Credit")||(childArray.Type === "PO")||(childArray.Type === "Un-Invoiced PO")){
            transactionNo = childArray.PurchaseOrderID;
          }else if((childArray.Type === "Cash Sale") || (childArray.Type === "Invoice")
          ||(childArray.Type === "Journal Entry")||(childArray.Type === "Manufacturing")
          ||(childArray.Type === "Payroll") ||(childArray.Type === "POS")
          ||(childArray.Type === "Refund") ||(childArray.Type === "UnInvoiced SO")){
            transactionNo = childArray.SaleID;
          }else if((childArray.Type === "Bank Deposit") || (childArray.Type === "Customer Payment")
          ||(childArray.Type === "Deposit Entry")||(childArray.Type === "Supplier Payment")){
            transactionNo = childArray.PaymentID;
          }

          var dataList = {
          date: childArray.Date !=''? moment(childArray.Date).format("DD/MM/YYYY"): data.taccountrunningbalancereport[i].Date,
          sortdate: childArray.Date !=''? moment(childArray.Date).format("YYYY/MM/DD"): childArray.Date,
          accountname: childArray.AccountName || '',
          type: childArray.Type || '',
          clientname: childArray.clientname || '',
          debit: debitAmount || 0.00,
          credit: creditAmount || 0.00,
          balance: balaneAmount || 0.00,
          accounttype:childArray.AccountType,
          transactionno: transactionNo || '',
          openingbalance: openingAmount || 0.00,
          closingbalance: closingAmount || 0.00
        };

         dataTableList.push(dataList);
       }
         }

         templateObject.datatablerecords.set(dataTableList);

        if(templateObject.datatablerecords.get()){

          Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblBalanceTransactionList', function(error, result){
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

          function MakeNegative() {
            $('td').each(function(){
              if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
             });
          };
          setTimeout(function () {
            MakeNegative();
          }, 100);
        }

        $('.fullScreenSpin').css('display','none');
        if ($.fn.DataTable.isDataTable('#balance-sheet-detail')) {
            $('#tblBalanceTransactionList').DataTable().destroy();
            Meteor._reload.reload();
        }
        setTimeout(function () {
            $('#tblBalanceTransactionList').DataTable({
                  columnDefs: [
                    {type: 'date', targets: 0}
                  ],
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                      {
                          extend: 'excelHtml5',
                          text: '',
                          download: 'open',
                          className: "btntabletocsv hiddenColumn",
                          filename: "Balance Transaction List - "+ moment().format(),
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
                          title: 'Balance Transaction',
                          filename: "Balance Transaction List - "+ moment().format(),
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
                  lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                  info: true,
                  responsive: true,
                  "order": [[ 0, "desc" ]],
                  action: function () {
                      $('#tblBalanceTransactionList').DataTable().ajax.reload();
                  },

              }).on('page', function () {

                  let draftRecord = templateObject.datatablerecords.get();
                  templateObject.datatablerecords.set(draftRecord);
              }).on('column-reorder', function () {

              });


              $('.fullScreenSpin').css('display','none');
          }, 0);

      $('#tblBalanceTransactionList tbody').on( 'click', 'tr', function () {
          var listData = $(this).closest('tr').attr('id');
          var transactiontype = $(event.target).closest("tr").find(".transactiontype").text();

          if((listData) && (transactiontype)){
            if(transactiontype === 'Quote' ){
              window.open('/quotecard?id=' + listData,'_self');
            }else if(transactiontype === 'Sales Order'){
              window.open('/salesordercard?id=' + listData,'_self');
            }else if(transactiontype === 'Invoice'){
              window.open('/invoicecard?id=' + listData,'_self');
            }else if(transactiontype === 'PO'){
              window.open('/purchaseordercard?id=' + listData,'_self');
            }else if(transactiontype === 'Bill'){
              //window.open('/billcard?id=' + listData,'_self');
            }else if(transactiontype === 'Credit'){
              //window.open('/creditcard?id=' + listData,'_self');
            }else if(transactiontype === 'Customer Payment'){
              window.open('/paymentcard?id=' + listData,'_self');
            }

          }
        });

          var columns = $('#tblBalanceTransactionList th');
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
    }else if(FlowRouter.current().queryParams.accountName){
      reportService.getBalanceSheetRedirectClientData(urlParameters).then(function (data) {
        //localStorage.setItem('VS1BalanceTrans_Report', JSON.stringify(data)||'');
        for(let i = 0; i < data.taccountrunningbalancereport.length; i++){
          let childArray = data.taccountrunningbalancereport[i];
          if((childArray.AccountName === urlParameters)&&(childArray.Type != '')){

          let openingAmount = utilityService.modifynegativeCurrencyFormat(childArray.OpeningBalanceEx);
          let closingAmount = utilityService.modifynegativeCurrencyFormat(childArray.ClosingBalanceEx);
          let creditAmount = utilityService.modifynegativeCurrencyFormat(childArray.TotalCreditEx);
          let debitAmount = utilityService.modifynegativeCurrencyFormat(childArray.TotalDebitEx);
          let balaneAmount = utilityService.modifynegativeCurrencyFormat(childArray.Balance);
          let transactionNo = '';
          if((childArray.Type === "Bill") || (childArray.Type === "Cheque")
          ||(childArray.Type === "Credit")||(childArray.Type === "PO")||(childArray.Type === "Un-Invoiced PO")){
            transactionNo = childArray.PurchaseOrderID;
          }else if((childArray.Type === "Cash Sale") || (childArray.Type === "Invoice")
          ||(childArray.Type === "Journal Entry")||(childArray.Type === "Manufacturing")
          ||(childArray.Type === "Payroll") ||(childArray.Type === "POS")
          ||(childArray.Type === "Refund") ||(childArray.Type === "UnInvoiced SO")){
            transactionNo = childArray.SaleID;
          }else if((childArray.Type === "Bank Deposit") || (childArray.Type === "Customer Payment")
          ||(childArray.Type === "Deposit Entry")||(childArray.Type === "Supplier Payment")){
            transactionNo = childArray.PaymentID;
          }

          var dataList = {
          date: childArray.Date !=''? moment(childArray.Date).format("DD/MM/YYYY"): data.taccountrunningbalancereport[i].Date,
          sortdate: childArray.Date !=''? moment(childArray.Date).format("YYYY/MM/DD"): childArray.Date,
          accountname: childArray.AccountName || '',
          type: childArray.Type || '',
          clientname: childArray.clientname || '',
          debit: debitAmount || 0.00,
          credit: creditAmount || 0.00,
          balance: balaneAmount || 0.00,
          accounttype:childArray.AccountType,
          transactionno: transactionNo || '',
          openingbalance: openingAmount || 0.00,
          closingbalance: closingAmount || 0.00
        };

         dataTableList.push(dataList);
       }
         }

         templateObject.datatablerecords.set(dataTableList);

        if(templateObject.datatablerecords.get()){

          Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblBalanceTransactionList', function(error, result){
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

          function MakeNegative() {
            $('td').each(function(){
              if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
             });
          };
          setTimeout(function () {
            MakeNegative();
          }, 100);
        }

        $('.fullScreenSpin').css('display','none');
        if ($.fn.DataTable.isDataTable('#balance-sheet-detail')) {
            $('#tblBalanceTransactionList').DataTable().destroy();
            Meteor._reload.reload();
        }
        setTimeout(function () {
            $('#tblBalanceTransactionList').DataTable({
                  columnDefs: [
                    {type: 'date', targets: 0}
                  ],
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                      {
                          extend: 'excelHtml5',
                          text: '',
                          download: 'open',
                          className: "btntabletocsv hiddenColumn",
                          filename: "Balance Transaction List - "+ moment().format(),
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
                          title: 'Balance Transaction',
                          filename: "Balance Transaction List - "+ moment().format(),
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
                  lengthMenu: [ [initialReportDatatableLoad, -1], [initialReportDatatableLoad, "All"] ],
                  info: true,
                  responsive: true,
                  "order": [[ 0, "desc" ]],
                  action: function () {
                      $('#tblBalanceTransactionList').DataTable().ajax.reload();
                  },

              }).on('page', function () {

                  let draftRecord = templateObject.datatablerecords.get();
                  templateObject.datatablerecords.set(draftRecord);
              }).on('column-reorder', function () {

              });


              $('.fullScreenSpin').css('display','none');
          }, 0);

      $('#tblBalanceTransactionList tbody').on( 'click', 'tr', function () {
          var listData = $(this).closest('tr').attr('id');
          var transactiontype = $(event.target).closest("tr").find(".transactiontype").text();

          if((listData) && (transactiontype)){
            if(transactiontype === 'Quote' ){
              window.open('/quotecard?id=' + listData,'_self');
            }else if(transactiontype === 'Sales Order'){
              window.open('/salesordercard?id=' + listData,'_self');
            }else if(transactiontype === 'Invoice'){
              window.open('/invoicecard?id=' + listData,'_self');
            }else if(transactiontype === 'PO'){
              window.open('/purchaseordercard?id=' + listData,'_self');
            }else if(transactiontype === 'Bill'){
              //window.open('/billcard?id=' + listData,'_self');
            }else if(transactiontype === 'Credit'){
              //window.open('/creditcard?id=' + listData,'_self');
            }else if(transactiontype === 'Customer Payment'){
              window.open('/paymentcard?id=' + listData,'_self');
            }

          }
        });

          var columns = $('#tblBalanceTransactionList th');
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
      templateObject.getAllBalanceSheetRedirectData();
    }


    $('#tblBalanceTransactionList tbody').on( 'click', 'tr', function () {
    var listData = $(this).closest('tr').attr('id');
    if(listData){
      // window.open('/invoicecard?id=' + listData,'_self');
    }

  });


});

Template.balancetransactionlist.events({
    'click .chkDatatable' : function(event){
      var columns = $('#tblBalanceTransactionList th');
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
    'click .resetTable' : function(event){
      var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
      if(getcurrentCloudDetails){
        if (getcurrentCloudDetails._id.length > 0) {
          var clientID = getcurrentCloudDetails._id;
          var clientUsername = getcurrentCloudDetails.cloudUsername;
          var clientEmail = getcurrentCloudDetails.cloudEmail;
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblBalanceTransactionList'});
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
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblBalanceTransactionList'});
          if (checkPrefDetails) {
            CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
              PrefGroup:'salesform',PrefName:'tblBalanceTransactionList',published:true,
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
              PrefGroup:'salesform',PrefName:'tblBalanceTransactionList',published:true,
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

    },
    'blur .divcolumn' : function(event){
      let columData = $(event.target).text();

      let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
      var datable = $('#tblBalanceTransactionList').DataTable();
      var title = datable.column( columnDatanIndex ).header();
      $(title).html(columData);

    },
    'change .rngRange' : function(event){
      let range = $(event.target).val();
      $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

      let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
      let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
      var datable = $('#tblBalanceTransactionList th');
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
      var columns = $('#tblBalanceTransactionList th');

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
    jQuery('#tblBalanceTransactionList_wrapper .dt-buttons .btntabletocsv').click();
     $('.fullScreenSpin').css('display','none');

  },
  'click .printConfirm' : function(event){
    $('.fullScreenSpin').css('display','inline-block');
    jQuery('#tblBalanceTransactionList_wrapper .dt-buttons .btntabletopdf').click();
     $('.fullScreenSpin').css('display','none');
   },
  'click .btnRefresh': function () {
    $('.fullScreenSpin').css('display','inline-block');
    localStorage.setItem('VS1BalanceTrans_Report', '');
    Meteor._reload.reload();
  }


});

Template.balancetransactionlist.helpers({
  datatablerecords : () => {
     return Template.instance().datatablerecords.get().sort(function(a, b){
       if (a.sortdate == 'NA') {
     return 1;
         }
     else if (b.sortdate == 'NA') {
       return -1;
     }
   return (a.sortdate.toUpperCase() > b.sortdate.toUpperCase()) ? 1 : -1;
   });
  },
  tableheaderrecords: () => {
     return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
  return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblBalanceTransactionList'});
}
});
