import {ReportsSalesServices} from './reports-sales-services';

import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {DashBoardService} from "../../Dashboard/dashboard-service";
import {UtilityService} from "../../utility-service";
import '../../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
let utilityService = new UtilityService();
Template.productsaleslist.onCreated(()=>{
  const templateObject = Template.instance();
 templateObject.datatablerecords = new ReactiveVar([]);
 templateObject.tableheaderrecords = new ReactiveVar([]);
});

Template.productsaleslist.onRendered(()=>{
  $('.fullScreenSpin').css('display','inline-block');
  let templateObject = Template.instance();
  let salesReportService = new ReportsSalesServices();
  let salesOrderTable;
  const dataTableList = [];
  const tableHeaderList = [];
  var splashArray = new Array();

  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblProductalesReport', function(error, result){
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

 var today = moment().format('DD/MM/YYYY');
 var currentDate = new Date();
 var begunDate = moment(currentDate).format("DD/MM/YYYY");
 let fromDateMonth = (currentDate.getMonth() + 1);
 let fromDateDay = currentDate.getDate();
 if((currentDate.getMonth()+1) < 10){
   fromDateMonth = "0" + (currentDate.getMonth()+1);
 }

 if(currentDate.getDate() < 10){
   fromDateDay = "0" + currentDate.getDate();
 }
 var fromDate =fromDateDay + "/" +(fromDateMonth) + "/" + currentDate.getFullYear();


 // templateObject.dateAsAt.set(begunDate);

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

  function MakeNegative() {
  $('td').each(function(){
    if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
   });
};
  templateObject.getAllProductSalesOrderData = function (dateFrom, dateTo, ignoreDate) {
    templateObject.datatablerecords.set('');
    //templateObject.grandrecords.set('');
    if(!localStorage.getItem('VS1ProductSales_List')){
    salesReportService.getAllProductSalesDetails(dateFrom, dateTo, ignoreDate).then(function (data) {
      localStorage.setItem('VS1ProductSales_List', JSON.stringify(data)||'');
        let lineItems = [];
        let lineItemObj = {};

        for(let i=0; i<data.tproductsalesdetailsreport.length; i++){


          let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tproductsalesdetailsreport[i]['Total Amount (Inc)'])|| 0.00;
          let totalProfit = utilityService.modifynegativeCurrencyFormat(data.tproductsalesdetailsreport[i]['Total Profit (Inc)'])|| 0.00;
          let lineCostEx = utilityService.modifynegativeCurrencyFormat(data.tproductsalesdetailsreport[i]['Line Cost (Ex)'])|| 0.00;

          var dataList = {
            sortdate: data.tproductsalesdetailsreport[i].SaleDate !=''? moment(data.tproductsalesdetailsreport[i].SaleDate).format("YYYY/MM/DD"): data.tproductsalesdetailsreport[i].SaleDate,
            saledate: data.tproductsalesdetailsreport[i].SaleDate !=''? moment(data.tproductsalesdetailsreport[i].SaleDate).format("DD/MM/YYYY"): data.tproductsalesdetailsreport[i].SaleDate,
            productname: data.tproductsalesdetailsreport[i].ProductName || '',
            description: data.tproductsalesdetailsreport[i].ProductDescription || '',
            type: data.tproductsalesdetailsreport[i].TransactionType|| '',
            transactionno: data.tproductsalesdetailsreport[i].TransactionNo,
            reference: data.tproductsalesdetailsreport[i].TransactionNo,
            qty: data.tproductsalesdetailsreport[i].Qty||0,
            linecostex: lineCostEx,
            totalamountex: utilityService.modifynegativeCurrencyFormat(data.tproductsalesdetailsreport[i]['Total Amount (Ex)']),
            totalamount: totalAmount || 0.00,
            totalprofit: totalProfit || 0.00,
            name: data.tproductsalesdetailsreport[i].CustomerName || '',
            email: data.tproductsalesdetailsreport[i].Email || '',
            unitofmeasure: data.tproductsalesdetailsreport[i].UnitOfMeasure || '',
            employeename: data.tproductsalesdetailsreport[i].EmployeeName || ''
        };

        dataTableList.push(dataList);
            //}
        }

        templateObject.datatablerecords.set(dataTableList);

        if(templateObject.datatablerecords.get()){

          Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblProductalesReport', function(error, result){
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
            $('#tblProductalesReport').DataTable({
                  columnDefs: [
                      {type: 'date', targets: 0}
                  ],
                  select: true,
                  destroy: true,
                  colReorder: true,
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                        {
                     extend: 'excelHtml5',
                     text: '',
                     download: 'open',
                     className: "btntabletocsv hiddenColumn",
                     filename: "productsalesdetailsreport_"+ moment().format(),
                     orientation:'portrait',
                      exportOptions: {
                      columns: ':visible'
                    }
                  },{
                      extend: 'print',
                      download: 'open',
                      className: "btntabletopdf hiddenColumn",
                      text: '',
                      title: 'Product Sales Details Report',
                      filename: "productsalesdetailsreport_"+ moment().format(),
             				  exportOptions: {
             				  columns: ':visible'
             				}
                  }],
                  //bStateSave: true,
                  //rowId: 0,
                  pageLength: initialDatatableLoad,
                  lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                  info: true,
                  "order": [[ 0, "asc" ]],
                  responsive: true,
                  action: function () {
                      // $('#tblProductalesReport').DataTable().ajax.reload();
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

              }).on('column-reorder', function () {

              }).on( 'length.dt', function ( e, settings, len ) {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
              });

              // $('#tblProductalesReport').DataTable().column( 0 ).visible( true );
              $('.fullScreenSpin').css('display','none');
          }, 0);

          var columns = $('#tblProductalesReport th');
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
         $('#tblProductalesReport tbody').on( 'click', 'tr', function () {
         var listData = $(this).closest('tr').attr('id');
         if(listData){
           window.open('/salesordercard?id=' + listData,'_self');
         }
       });
    }).catch(function (err) {
        // Bert.alert('<strong>' + err + '</strong>!', 'danger');
        $('.fullScreenSpin').css('display','none');
        // Meteor._reload.reload();
    });
  }else{
    let data = JSON.parse(localStorage.getItem('VS1ProductSales_List'));
    let lineItems = [];
    let lineItemObj = {};

    for(let i=0; i<data.tproductsalesdetailsreport.length; i++){


      let totalAmount = utilityService.modifynegativeCurrencyFormat(data.tproductsalesdetailsreport[i]['Total Amount (Inc)'])|| 0.00;
      let totalProfit = utilityService.modifynegativeCurrencyFormat(data.tproductsalesdetailsreport[i]['Total Profit (Inc)'])|| 0.00;
      let lineCostEx = utilityService.modifynegativeCurrencyFormat(data.tproductsalesdetailsreport[i]['Line Cost (Ex)'])|| 0.00;

      var dataList = {
        sortdate: data.tproductsalesdetailsreport[i].SaleDate !=''? moment(data.tproductsalesdetailsreport[i].SaleDate).format("YYYY/MM/DD"): data.tproductsalesdetailsreport[i].SaleDate,
        saledate: data.tproductsalesdetailsreport[i].SaleDate !=''? moment(data.tproductsalesdetailsreport[i].SaleDate).format("DD/MM/YYYY"): data.tproductsalesdetailsreport[i].SaleDate,
        productname: data.tproductsalesdetailsreport[i].ProductName || '',
        description: data.tproductsalesdetailsreport[i].ProductDescription || '',
        type: data.tproductsalesdetailsreport[i].TransactionType|| '',
        transactionno: data.tproductsalesdetailsreport[i].TransactionNo,
        reference: data.tproductsalesdetailsreport[i].TransactionNo,
        qty: data.tproductsalesdetailsreport[i].Qty||0,
        linecostex: lineCostEx,
        totalamountex: utilityService.modifynegativeCurrencyFormat(data.tproductsalesdetailsreport[i]['Total Amount (Ex)']),
        totalamount: totalAmount || 0.00,
        totalprofit: totalProfit || 0.00,
        name: data.tproductsalesdetailsreport[i].CustomerName || '',
        email: data.tproductsalesdetailsreport[i].Email || '',
        unitofmeasure: data.tproductsalesdetailsreport[i].UnitOfMeasure || '',
        employeename: data.tproductsalesdetailsreport[i].EmployeeName || ''
    };

    dataTableList.push(dataList);
        //}
    }

    templateObject.datatablerecords.set(dataTableList);

    if(templateObject.datatablerecords.get()){

      Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblProductalesReport', function(error, result){
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
        $('#tblProductalesReport').DataTable({
              columnDefs: [
                  {type: 'date', targets: 0}
              ],
              select: true,
              destroy: true,
              colReorder: true,
              "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
              buttons: [
                    {
                 extend: 'excelHtml5',
                 text: '',
                 download: 'open',
                 className: "btntabletocsv hiddenColumn",
                 filename: "productsalesdetailsreport_"+ moment().format(),
                 orientation:'portrait',
                  exportOptions: {
                  columns: ':visible'
                }
              },{
                  extend: 'print',
                  download: 'open',
                  className: "btntabletopdf hiddenColumn",
                  text: '',
                  title: 'Product Sales Details Report',
                  filename: "productsalesdetailsreport_"+ moment().format(),
                  exportOptions: {
                  columns: ':visible'
                }
              }],
              //bStateSave: true,
              //rowId: 0,
              pageLength: initialDatatableLoad,
              lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
              info: true,
              "order": [[ 0, "asc" ]],
              responsive: true,
              action: function () {
                  // $('#tblProductalesReport').DataTable().ajax.reload();
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

          }).on('column-reorder', function () {

          }).on( 'length.dt', function ( e, settings, len ) {
            setTimeout(function () {
              MakeNegative();
            }, 100);
          });

          // $('#tblProductalesReport').DataTable().column( 0 ).visible( true );
          $('.fullScreenSpin').css('display','none');
      }, 0);

      var columns = $('#tblProductalesReport th');
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
     $('#tblProductalesReport tbody').on( 'click', 'tr', function () {
     var listData = $(this).closest('tr').attr('id');
     if(listData){
       window.open('/salesordercard?id=' + listData,'_self');
     }
   });

  }
  }

  var currentDate2 = new Date();
  var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
  let getDateFrom = currentDate2.getFullYear() + "-" + (currentDate2.getMonth()) + "-" + currentDate2.getDate();
  //templateObject.getAllProductSalesOrderData(getDateFrom,getLoadDate,false);
  templateObject.getAllProductSalesOrderData('','',true);

});

Template.productsaleslist.helpers({
  datatablerecords : () => {
     return Template.instance().datatablerecords.get();
  },
  tableheaderrecords: () => {
     return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
  return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblProductalesReport'});
}
});

Template.productsaleslist.events({
    'click .chkDatatable' : function(event){
      var columns = $('#tblProductalesReport th');
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
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblProductalesReport'});
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
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblProductalesReport'});
          if (checkPrefDetails) {
            CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
              PrefGroup:'salesform',PrefName:'tblProductalesReport',published:true,
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
              PrefGroup:'salesform',PrefName:'tblProductalesReport',published:true,
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
      var datable = $('#tblProductalesReport').DataTable();
      var title = datable.column( columnDatanIndex ).header();
      $(title).html(columData);

    },
    'change .rngRange' : function(event){
      let range = $(event.target).val();
      $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

      let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
      let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
      var datable = $('#tblProductalesReport th');
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
      var columns = $('#tblProductalesReport th');

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
    jQuery('#tblProductalesReport_wrapper .dt-buttons .btntabletocsv').click();
     $('.fullScreenSpin').css('display','none');

  },
  'click .printConfirm' : function(event){

    $('.fullScreenSpin').css('display','inline-block');
    jQuery('#tblProductalesReport_wrapper .dt-buttons .btntabletopdf').click();
     $('.fullScreenSpin').css('display','none');
   },
  'click .btnRefresh': function () {
    $('.fullScreenSpin').css('display','inline-block');
    localStorage.setItem('VS1ProductSales_List', '');
    Meteor._reload.reload();
  },
  'change #dateTo':function(){
      let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
      //templateObject.datatablerecords.set('');
      //templateObject.grandrecords.set('');
      var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
      var dateTo = new Date($("#dateTo").datepicker("getDate"));

      let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
      let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();


      var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth()+1) + "/" + dateTo.getFullYear();
      //templateObject.dateAsAt.set(formatDate);
      if(($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")){
        templateObject.getAllProductSalesOrderData('','',true);
        //templateObject.dateAsAt.set('Current Date');
      }else{
        templateObject.getAllProductSalesOrderData(formatDateFrom,formatDateTo,false);
        //templateObject.dateAsAt.set(formatDate);
      }

  },
  'change #dateFrom':function(){
      let templateObject = Template.instance();
      $('.fullScreenSpin').css('display','inline-block');
      $('#dateFrom').attr('readonly', false);
      $('#dateTo').attr('readonly', false);
      //templateObject.datatablerecords.set('');
      //templateObject.grandrecords.set('');
      var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
      var dateTo = new Date($("#dateTo").datepicker("getDate"));

      let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
      let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();


      var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth()+1) + "/" + dateTo.getFullYear();
      //templateObject.dateAsAt.set(formatDate);
      if(($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")){
        templateObject.getAllProductSalesOrderData('','',true);
        //templateObject.dateAsAt.set('Current Date');
      }else{
        templateObject.getAllProductSalesOrderData(formatDateFrom,formatDateTo,false);
        //templateObject.dateAsAt.set(formatDate);
      }


  },
  'click #lastMonth':function(){
      let templateObject = Template.instance();
      $('.fullScreenSpin').css('display','inline-block');
      localStorage.setItem('VS1ProductSales_List', '');
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
      templateObject.getAllProductSalesOrderData(getDateFrom,getLoadDate,false);

  },
  'click #lastQuarter':function(){
      let templateObject = Template.instance();
      $('.fullScreenSpin').css('display','inline-block');
      localStorage.setItem('VS1ProductSales_List', '');
      $('#dateFrom').attr('readonly', false);
      $('#dateTo').attr('readonly', false);
      var currentDate = new Date();
      var begunDate = moment(currentDate).format("DD/MM/YYYY");

      var begunDate = moment(currentDate).format("DD/MM/YYYY");
      function getQuarter(d) {
        d = d || new Date();
        var m = Math.floor(d.getMonth()/3) + 2;
        return m > 4? m - 4 : m;
      }

      var quarterAdjustment= (moment().month() % 3) + 1;
      var lastQuarterEndDate = moment().subtract({ months: quarterAdjustment }).endOf('month');
      var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({ months: 2 }).startOf('month');

      var lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
      var lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");

      templateObject.dateAsAt.set(lastQuarterStartDateFormat);
      $("#dateFrom").val(lastQuarterStartDateFormat);
      $("#dateTo").val(lastQuarterEndDateFormat);


      let fromDateMonth = getQuarter(currentDate);
      var quarterMonth = getQuarter(currentDate);
      let fromDateDay = currentDate.getDate();

      var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
      let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
      templateObject.getAllProductSalesOrderData(getDateFrom,getLoadDate,false);

  },
  'click #last12Months':function(){
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display','inline-block');
    localStorage.setItem('VS1ProductSales_List', '');
    $('#dateFrom').attr('readonly', false);
    $('#dateTo').attr('readonly', false);
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    let fromDateMonth = Math.floor(currentDate.getMonth()+1);
    let fromDateDay = currentDate.getDate();
    if((currentDate.getMonth()+1) < 10){
      fromDateMonth = "0" + (currentDate.getMonth()+1);
    }
    if(currentDate.getDate() < 10){
    fromDateDay = "0" + currentDate.getDate();
    }

    var fromDate =fromDateDay + "/" +(fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() -1);
    //templateObject.dateAsAt.set(begunDate);
    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);

    var currentDate2 = new Date();
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    let getDateFrom = Math.floor(currentDate2.getFullYear()-1) + "-" + Math.floor(currentDate2.getMonth() +1) + "-" + currentDate2.getDate() ;
    templateObject.getAllProductSalesOrderData(getDateFrom,getLoadDate,false);


  },
  'click #ignoreDate':function(){
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display','inline-block');
    localStorage.setItem('VS1ProductSales_List', '');
    $('#dateFrom').attr('readonly', true);
    $('#dateTo').attr('readonly', true);
    //templateObject.dateAsAt.set('Current Date');
    templateObject.getAllProductSalesOrderData('','',true);
    //$('#tblProductalesReport').DataTable().ajax.reload();

  }



});
