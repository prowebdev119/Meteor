import {ReportService} from "../report-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";

let reportService = new ReportService();
let utilityService = new UtilityService();
Template.taxsummaryreport.onCreated(()=>{
const templateObject = Template.instance();
templateObject.records = new ReactiveVar([]);
templateObject.reportrecords = new ReactiveVar([]);
templateObject.grandrecords = new ReactiveVar();
templateObject.dateAsAt = new ReactiveVar();
templateObject.deptrecords = new ReactiveVar();
});

Template.taxsummaryreport.onRendered(()=>{
  $('.fullScreenSpin').css('display','inline-block');
  const templateObject = Template.instance();
  let utilityService = new UtilityService();
  let salesOrderTable;
  var splashArray = new Array();
  var today = moment().format('DD/MM/YYYY');
  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  let fromDateMonth = (currentDate.getMonth() + 1);
  let fromDateDay = currentDate.getDate();
  if((currentDate.getMonth()+1) < 10){
    fromDateMonth = "0" + (currentDate.getMonth()+1);
  }

  let imageData= (localStorage.getItem("Image"));
  if(imageData)
  {
      $('#uploadedImage').attr('src', imageData);
      $('#uploadedImage').attr('width','50%');
  }

  if(currentDate.getDate() < 10){
    fromDateDay = "0" + currentDate.getDate();
  }
  var fromDate =fromDateDay + "/" +(fromDateMonth) + "/" + currentDate.getFullYear();


  templateObject.dateAsAt.set(begunDate);
 const dataTableList = [];
 const deptrecords = [];
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

    templateObject.getTaxSummaryReports = function (dateFrom, dateTo, ignoreDate) {
      if(!localStorage.getItem('VS1TaxSummary_Report')){
        reportService.getTaxSummaryData(dateFrom, dateTo, ignoreDate).then(function (data) {
          let totalRecord = [];
          let grandtotalRecord = [];

        if(data.ttaxsummaryreport.length){
          localStorage.setItem('VS1TaxSummary_Report', JSON.stringify(data)||'');
          let records = [];
          let reportrecords =[];
          let allRecords = [];
          let current = [];

          let totalNetAssets = 0;
          let GrandTotalLiability = 0;
          let GrandTotalAsset = 0;
          let incArr = [];
          let cogsArr = [];
          let expArr = [];
          let accountData = data.ttaxsummaryreport;
          let accountType = '';

          for (let i = 0; i < accountData.length; i++) {

            let inputsexpurchases = utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].INPUT_AmountEx) || 0;
            let inputsincpurchases = utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].INPUT_AmountInc) || 0;
            let outputexsales = utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].OUTPUT_AmountEx) || 0;
            let outputincsales = utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].OUTPUT_AmountInc) || 0;
            let totalnet = utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].TotalNet) || 0;
            let totaltax = utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].TotalTax) || 0;
            let totaltax1 = utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].TotalTax1) || 0;
            var dataList = {
              id: data.ttaxsummaryreport[i].ID || '',
              taxcode:data.ttaxsummaryreport[i].TaxCode || '',
              clientid:data.ttaxsummaryreport[i].ClientID || '',
              inputsexpurchases: inputsexpurchases,
              inputsincpurchases: inputsincpurchases,
              outputexsales: outputexsales,
              outputincsales: outputincsales,
              totalnet: totalnet || 0.00,
              totaltax: totaltax || 0.00,
              totaltax1: totaltax1 || 0.00,
              taxrate: (data.ttaxsummaryreport[i].TaxRate * 100).toFixed(2) + '%' || 0,
              taxrate2: (data.ttaxsummaryreport[i].TaxRate * 100).toFixed(2) || 0

          };

          reportrecords.push(dataList);



        //   if((data.ttaxsummaryreport[i].AmountDue != 0) || (data.ttaxsummaryreport[i].Current != 0)
        //   || (data.ttaxsummaryreport[i]["30Days"] != 0) || (data.ttaxsummaryreport[i]["60Days"] != 0)
        // || (data.ttaxsummaryreport[i]["90Days"] != 0) || (data.ttaxsummaryreport[i]["120Days"] != 0)){
      //  records.push(recordObj);
          //}



        }

        reportrecords = _.sortBy(reportrecords, 'taxcode');
        templateObject.reportrecords.set(reportrecords);
        //   records = _.sortBy(records, 'SupplierName');
        // records = _.groupBy(records, 'SupplierName');
        for (let key in records) {
            let obj = [{key: key}, {data: records[key]}];
            allRecords.push(obj);
        }

        let iterator = 0;
        let inputsexpurchasestotal = 0;
        let inputsincpurchasestotal = 0;
        let outputexsalestotal = 0;
        let outputincsalestotal = 0;
        let nettotal = 0;
        let taxtotal = 0;
        let taxratetotal = 0;
        let taxtotal1 = 0;
      for (let i = 0; i < reportrecords.length; i++) {



          const currencyLength = Currency.length;
          inputsexpurchasestotal = inputsexpurchasestotal + utilityService.convertSubstringParseFloat(reportrecords[i].inputsexpurchases);
          inputsincpurchasestotal = inputsincpurchasestotal + utilityService.convertSubstringParseFloat(reportrecords[i].inputsincpurchases);
          outputexsalestotal = outputexsalestotal + utilityService.convertSubstringParseFloat(reportrecords[i].outputexsales);
          outputincsalestotal = outputincsalestotal + utilityService.convertSubstringParseFloat(reportrecords[i].outputincsales);
          nettotal = nettotal + utilityService.convertSubstringParseFloat(reportrecords[i].totalnet);
          taxtotal = taxtotal + utilityService.convertSubstringParseFloat(reportrecords[i].totaltax);
          taxratetotal = taxratetotal + Number(reportrecords[i].taxrate2.replace(/[^0-9.-]+/g,"")) || 0;
          taxtotal1 = taxtotal1 + utilityService.convertSubstringParseFloat(reportrecords[i].totaltax1);

          let val = ['', utilityService.modifynegativeCurrencyFormat(inputsexpurchasestotal), utilityService.modifynegativeCurrencyFormat(inputsincpurchasestotal),
              utilityService.modifynegativeCurrencyFormat(outputexsalestotal), utilityService.modifynegativeCurrencyFormat(outputincsalestotal), utilityService.modifynegativeCurrencyFormat(nettotal), utilityService.modifynegativeCurrencyFormat(taxtotal),'', utilityService.modifynegativeCurrencyFormat(taxtotal1)];
          current.push(val);

      }


    let grandval = ['Grand Total ' +  '',
    // '','',
      '',
      '',
      '',
      '',
      utilityService.modifynegativeCurrencyFormat(nettotal),

      // taxratetotal.toFixed(2) + '%' || 0,
      '',
      utilityService.modifynegativeCurrencyFormat(taxtotal)];
      // utilityService.modifynegativeCurrencyFormat(taxtotal1)];

        //templateObject.records.set(totalRecord);
        templateObject.grandrecords.set(grandval);


        if(templateObject.reportrecords.get()){
          setTimeout(function () {
            $('td a').each(function(){
              if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
               });
           $('td').each(function(){
             if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
            });

            $('td').each(function(){

              let lineValue = $(this).first().text()[0];
              if(lineValue != undefined){
                if(lineValue.indexOf(Currency) >= 0) $(this).addClass('text-right')
              }

             });

             $('td').each(function(){
               if($(this).first().text().indexOf('-'+Currency) >= 0) $(this).addClass('text-right')
              });

              $('td:nth-child(8)').each(function(){
                $(this).addClass('text-right');
              });
              $('.fullScreenSpin').css('display','none');
          }, 100);
        }

      }else{
        let records = [];
        let recordObj = {};
        recordObj.Id = '';
        recordObj.type = '';
        recordObj.SupplierName = ' ';
        recordObj.dataArr = [
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
            '-',
           '-'
        ];

        records.push(recordObj);
        templateObject.records.set(records);
        templateObject.grandrecords.set('');
          $('.fullScreenSpin').css('display','none');
      }

        }).catch(function (err) {
          //Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $('.fullScreenSpin').css('display','none');
        });
      }else{
        let data = JSON.parse(localStorage.getItem('VS1TaxSummary_Report'));
        let totalRecord = [];
        let grandtotalRecord = [];

      if(data.ttaxsummaryreport.length){
        let records = [];
        let reportrecords =[];
        let allRecords = [];
        let current = [];

        let totalNetAssets = 0;
        let GrandTotalLiability = 0;
        let GrandTotalAsset = 0;
        let incArr = [];
        let cogsArr = [];
        let expArr = [];
        let accountData = data.ttaxsummaryreport;
        let accountType = '';

        for (let i = 0; i < accountData.length; i++) {

          let inputsexpurchases = utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].INPUT_AmountEx) || 0;
          let inputsincpurchases = utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].INPUT_AmountInc) || 0;
          let outputexsales = utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].OUTPUT_AmountEx) || 0;
          let outputincsales = utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].OUTPUT_AmountInc) || 0;
          let totalnet = utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].TotalNet) || 0;
          let totaltax = utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].TotalTax) || 0;
          let totaltax1 = utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].TotalTax1) || 0;
          var dataList = {
            id: data.ttaxsummaryreport[i].ID || '',
            taxcode:data.ttaxsummaryreport[i].TaxCode || '',
            clientid:data.ttaxsummaryreport[i].ClientID || '',
            inputsexpurchases: inputsexpurchases,
            inputsincpurchases: inputsincpurchases,
            outputexsales: outputexsales,
            outputincsales: outputincsales,
            totalnet: totalnet || 0.00,
            totaltax: totaltax || 0.00,
            totaltax1: totaltax1 || 0.00,
            taxrate: (data.ttaxsummaryreport[i].TaxRate * 100).toFixed(2) + '%' || 0,
            taxrate2: (data.ttaxsummaryreport[i].TaxRate * 100).toFixed(2) || 0

        };

        reportrecords.push(dataList);



      //   if((data.ttaxsummaryreport[i].AmountDue != 0) || (data.ttaxsummaryreport[i].Current != 0)
      //   || (data.ttaxsummaryreport[i]["30Days"] != 0) || (data.ttaxsummaryreport[i]["60Days"] != 0)
      // || (data.ttaxsummaryreport[i]["90Days"] != 0) || (data.ttaxsummaryreport[i]["120Days"] != 0)){
    //  records.push(recordObj);
        //}



      }

      reportrecords = _.sortBy(reportrecords, 'taxcode');
      templateObject.reportrecords.set(reportrecords);
      //   records = _.sortBy(records, 'SupplierName');
      // records = _.groupBy(records, 'SupplierName');
      for (let key in records) {
          let obj = [{key: key}, {data: records[key]}];
          allRecords.push(obj);
      }

      let iterator = 0;
      let inputsexpurchasestotal = 0;
      let inputsincpurchasestotal = 0;
      let outputexsalestotal = 0;
      let outputincsalestotal = 0;
      let nettotal = 0;
      let taxtotal = 0;
      let taxratetotal = 0;
      let taxtotal1 = 0;
    for (let i = 0; i < reportrecords.length; i++) {



        const currencyLength = Currency.length;
        inputsexpurchasestotal = inputsexpurchasestotal + utilityService.convertSubstringParseFloat(reportrecords[i].inputsexpurchases);
        inputsincpurchasestotal = inputsincpurchasestotal + utilityService.convertSubstringParseFloat(reportrecords[i].inputsincpurchases);
        outputexsalestotal = outputexsalestotal + utilityService.convertSubstringParseFloat(reportrecords[i].outputexsales);
        outputincsalestotal = outputincsalestotal + utilityService.convertSubstringParseFloat(reportrecords[i].outputincsales);
        nettotal = nettotal + utilityService.convertSubstringParseFloat(reportrecords[i].totalnet);
        taxtotal = taxtotal + utilityService.convertSubstringParseFloat(reportrecords[i].totaltax);
        taxratetotal = taxratetotal + Number(reportrecords[i].taxrate2.replace(/[^0-9.-]+/g,"")) || 0;
        taxtotal1 = taxtotal1 + utilityService.convertSubstringParseFloat(reportrecords[i].totaltax1);

        let val = ['', utilityService.modifynegativeCurrencyFormat(inputsexpurchasestotal), utilityService.modifynegativeCurrencyFormat(inputsincpurchasestotal),
            utilityService.modifynegativeCurrencyFormat(outputexsalestotal), utilityService.modifynegativeCurrencyFormat(outputincsalestotal), utilityService.modifynegativeCurrencyFormat(nettotal), utilityService.modifynegativeCurrencyFormat(taxtotal),'', utilityService.modifynegativeCurrencyFormat(taxtotal1)];
        current.push(val);

    }


  let grandval = ['Grand Total ' +  '',
  // '','',
    '',
    '',
    '',
    '',
    utilityService.modifynegativeCurrencyFormat(nettotal),

    // taxratetotal.toFixed(2) + '%' || 0,
    '',
    utilityService.modifynegativeCurrencyFormat(taxtotal)];
    // utilityService.modifynegativeCurrencyFormat(taxtotal1)];

      //templateObject.records.set(totalRecord);
      templateObject.grandrecords.set(grandval);


      if(templateObject.reportrecords.get()){
        setTimeout(function () {
          $('td a').each(function(){
            if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
             });
         $('td').each(function(){
           if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
          });

          $('td').each(function(){

            let lineValue = $(this).first().text()[0];
            if(lineValue != undefined){
              if(lineValue.indexOf(Currency) >= 0) $(this).addClass('text-right')
            }

           });

           $('td').each(function(){
             if($(this).first().text().indexOf('-'+Currency) >= 0) $(this).addClass('text-right')
            });

            $('td:nth-child(8)').each(function(){
              $(this).addClass('text-right');
            });
            $('.fullScreenSpin').css('display','none');
        }, 100);
      }

    }else{
      let records = [];
      let recordObj = {};
      recordObj.Id = '';
      recordObj.type = '';
      recordObj.SupplierName = ' ';
      recordObj.dataArr = [
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
          '-',
         '-'
      ];

      records.push(recordObj);
      templateObject.records.set(records);
      templateObject.grandrecords.set('');
        $('.fullScreenSpin').css('display','none');
    }

      }
    };

    var currentDate2 = new Date();
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    let getDateFrom = currentDate2.getFullYear() + "-" + (currentDate2.getMonth()) + "-" + currentDate2.getDate();
    templateObject.getTaxSummaryReports(getDateFrom,getLoadDate,false);

    templateObject.getDepartments = function(){
      reportService.getDepartment().then(function(data){
        for(let i in data.tdeptclass){

          let deptrecordObj = {
            id: data.tdeptclass[i].Id || ' ',
            department: data.tdeptclass[i].DeptClassName || ' ',
          };

          deptrecords.push(deptrecordObj);
          templateObject.deptrecords.set(deptrecords);

        }
    });

    }
    // templateObject.getAllProductData();
    templateObject.getDepartments();
  });

  Template.taxsummaryreport.events({
    'change #dateTo':function(){
        let templateObject = Template.instance();
          $('.fullScreenSpin').css('display','inline-block');
          $('#dateFrom').attr('readonly', false);
          $('#dateTo').attr('readonly', false);
        templateObject.records.set('');
        templateObject.grandrecords.set('');
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();

      //  templateObject.getTaxSummaryReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth()+1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if(($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")){
          templateObject.getTaxSummaryReports('','',true);
          templateObject.dateAsAt.set('Current Date');
        }else{
          templateObject.getTaxSummaryReports(formatDateFrom,formatDateTo,false);
          templateObject.dateAsAt.set(formatDate);
        }

    },
    'change #dateFrom':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        templateObject.records.set('');
        templateObject.grandrecords.set('');
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();

        //templateObject.getTaxSummaryReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth()+1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if(($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")){
          templateObject.getTaxSummaryReports('','',true);
          templateObject.dateAsAt.set('Current Date');
        }else{
          templateObject.getTaxSummaryReports(formatDateFrom,formatDateTo,false);
          templateObject.dateAsAt.set(formatDate);
        }


    },
    'click .btnRefresh': function () {
      $('.fullScreenSpin').css('display','inline-block');
      localStorage.setItem('VS1TaxSummary_Report', '');
      Meteor._reload.reload();
    },
    'click td a':function (event) {
        let redirectid = $(event.target).closest('tr').attr('id');

        let transactiontype = $(event.target).closest('tr').attr('class');;

        if(redirectid && transactiontype){
          if(transactiontype === 'Bill' ){
            window.open('/billcard?id=' + redirectid,'_self');
          }else if(transactiontype === 'PO'){
            window.open('/purchaseordercard?id=' + redirectid,'_self');
          }else if(transactiontype === 'Credit'){
            window.open('/creditcard?id=' + redirectid,'_self');
          }else if(transactiontype === 'Supplier Payment'){
            window.open('/supplierpaymentcard?id=' + redirectid,'_self');
          }
        }
        // window.open('/balancetransactionlist?accountName=' + accountName+ '&toDate=' + toDate + '&fromDate=' + fromDate + '&isTabItem='+false,'_self');
    },
    'click .btnPrintReport':function (event) {
      document.title = 'Tax Summary Report';
      $(".printReport").print({
          title   :  document.title +" | Tax Summary | "+loggedCompany,
          noPrintSelector : ".addSummaryEditor",
      })
    },
'click .btnExportReport':function() {
  $('.fullScreenSpin').css('display','inline-block');
    let utilityService = new UtilityService();
    let templateObject = Template.instance();
    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    var dateTo = new Date($("#dateTo").datepicker("getDate"));

    let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
    let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();

    const filename = loggedCompany + '-Tax Summary' + '.csv';
    utilityService.exportReportToCsvTable('tableExport', filename, 'csv');
    let rows = [];
    // reportService.getTaxSummaryData(formatDateFrom,formatDateTo,false).then(function (data) {
    //     if(data.ttaxsummaryreport){
    //         rows[0] = ['Tax Code','INPUTS Ex (Purchases)', 'INPUTS Inc (Purchases)', 'OUTPUTS Ex (Sales)	', 'OUTPUTS Inc (Sales)', 'Total Net', 'Total Tax', 'Tax Rate', 'Total Taxt1'];
    //         data.ttaxsummaryreport.forEach(function (e, i) {
    //             rows.push([
    //               data.ttaxsummaryreport[i].TaxCode,
    //               utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].INPUT_AmountEx) || '0.00',
    //               utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].INPUT_AmountInc) || '0.00',
    //               utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].OUTPUT_AmountEx) || '0.00',
    //               utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].OUTPUT_AmountInc) || '0.00',
    //               utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].TotalTax) || '0.00',
    //               utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].TotalNet) || '0.00',
    //               (data.ttaxsummaryreport[i].TaxRate * 100).toFixed(2) + '%' || 0,
    //             utilityService.modifynegativeCurrencyFormat(data.ttaxsummaryreport[i].TotalTax1) || '0.00']);
    //         });
    //         setTimeout(function () {
    //             utilityService.exportReportToCsv(rows, filename, 'xls');
    //             $('.fullScreenSpin').css('display','none');
    //         }, 1000);
    //     }
    //
    // });
},
'click #lastMonth':function(){
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display','inline-block');
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
    templateObject.getTaxSummaryReports(getDateFrom,getLoadDate,false);

},
'click #lastQuarter':function(){
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display','inline-block');
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
    templateObject.getTaxSummaryReports(getDateFrom,getLoadDate,false);

},
'click #last12Months':function(){
  let templateObject = Template.instance();
  $('.fullScreenSpin').css('display','inline-block');
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
  templateObject.dateAsAt.set(begunDate);
  $("#dateFrom").val(fromDate);
  $("#dateTo").val(begunDate);

  var currentDate2 = new Date();
  var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
  let getDateFrom = Math.floor(currentDate2.getFullYear()-1) + "-" + Math.floor(currentDate2.getMonth() +1) + "-" + currentDate2.getDate() ;
  templateObject.getTaxSummaryReports(getDateFrom,getLoadDate,false);


},
'click #ignoreDate':function(){
  let templateObject = Template.instance();
  $('.fullScreenSpin').css('display','inline-block');
  $('#dateFrom').attr('readonly', true);
  $('#dateTo').attr('readonly', true);
  templateObject.dateAsAt.set('Current Date');
  templateObject.getTaxSummaryReports('','',true);

},
    'keyup #myInputSearch':function(event){
      $('.table tbody tr').show();
      let searchItem = $(event.target).val();
      if(searchItem != ''){
        var value = searchItem.toLowerCase();
        $('.table tbody tr').each(function(){
         var found = 'false';
         $(this).each(function(){
              if($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0)
              {
                   found = 'true';
              }
         });
         if(found == 'true')
         {
              $(this).show();
         }
         else
         {
              $(this).hide();
         }
    });
      }else{
        $('.table tbody tr').show();
      }
    },
    'blur #myInputSearch':function(event){
      $('.table tbody tr').show();
      let searchItem = $(event.target).val();
      if(searchItem != ''){
        var value = searchItem.toLowerCase();
        $('.table tbody tr').each(function(){
         var found = 'false';
         $(this).each(function(){
              if($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0)
              {
                   found = 'true';
              }
         });
         if(found == 'true')
         {
              $(this).show();
         }
         else
         {
              $(this).hide();
         }
    });
      }else{
        $('.table tbody tr').show();
      }
    }


  });
  Template.taxsummaryreport.helpers({
    records : () => {
       return Template.instance().records.get();
     //   .sort(function(a, b){
     //     if (a.accounttype == 'NA') {
     //   return 1;
     //       }
     //   else if (b.accounttype == 'NA') {
     //     return -1;
     //   }
     // return (a.accounttype.toUpperCase() > b.accounttype.toUpperCase()) ? 1 : -1;
     // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
     // });
    },
    reportrecords : () => {
       return Template.instance().reportrecords.get();
    },

    grandrecords: () => {
       return Template.instance().grandrecords.get();
   },
    dateAsAt: () =>{
        return Template.instance().dateAsAt.get() || '-';
    },
    companyname: () =>{
        return loggedCompany;
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
    }
  });
  Template.registerHelper('equals', function (a, b) {
      return a === b;
  });

  Template.registerHelper('notEquals', function (a, b) {
      return a != b;
  });

  Template.registerHelper('containsequals', function (a, b) {
      return (a.indexOf(b) >= 0 );
  });
