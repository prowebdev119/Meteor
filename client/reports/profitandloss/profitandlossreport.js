import {ReportService} from "../report-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";

let reportService = new ReportService();
let utilityService = new UtilityService();
Template.profitlossreport.onCreated(()=>{
const templateObject = Template.instance();
templateObject.records = new ReactiveVar([]);
templateObject.dateAsAt = new ReactiveVar();
templateObject.deptrecords = new ReactiveVar();
});

Template.profitlossreport.onRendered(()=>{



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

  if(currentDate.getDate() < 10){
    fromDateDay = "0" + currentDate.getDate();
  }
  var fromDate =fromDateDay + "/" +(fromDateMonth) + "/" + currentDate.getFullYear();
   var url = FlowRouter.current().path;



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


    templateObject.getProfitandLossReports = function (dateFrom, dateTo, ignoreDate) {
      if(!localStorage.getItem('VS1ProfitandLoss_Report')){
        reportService.getProfitandLoss(dateFrom, dateTo, ignoreDate).then(function (data) {
          let records = [];
        if(data.profitandlossreport){
          localStorage.setItem('VS1ProfitandLoss_Report', JSON.stringify(data)||'');
          let totalNetAssets = 0;
          let GrandTotalLiability = 0;
          let GrandTotalAsset = 0;
          let incArr = [];
          let cogsArr = [];
          let expArr = [];
          let accountData = data.profitandlossreport;
          let accountType = '';

          for (let i = 0; i < accountData.length; i++) {

            if(accountData[i]['Account Type'].replace(/\s/g, '') == ''){
              accountType = '';
            }else{
              accountType = accountData[i]['Account Type'];
            }
            let totalAmountEx = utilityService.modifynegativeCurrencyFormat(accountData[i]['TotalAmountEx'])|| 0.00;
          var dataList = {
            id: accountData[i]['AccountID'] || '',
            accounttype:accountType || '',
            accountname: accountData[i]['AccountName'] || '',
            accountno: accountData[i]['AccountNo'] || '',
            totalamountex: totalAmountEx || 0.00,
            name: $.trim(accountData[i]['AccountName']).split(" ").join("_")
            // totaltax: totalTax || 0.00


        };

        if((accountType == '') && (accountData[i]['AccountName'].replace(/\s/g, '') == '')){

        }else{
          // if(accountType.toLowerCase().indexOf("total") >= 0){
          //
          // }
          if((accountData[i]['TotalAmountEx'] != 0)){
            records.push(dataList);
          }

        }


        }

        templateObject.records.set(records);
        if(templateObject.records.get()){
        setTimeout(function () {
          $('td a').each(function(){
            if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
             });
         $('td').each(function(){
           if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
            });
            $('.fullScreenSpin').css('display','none');
        }, 100);
        }

        }

        }).catch(function (err) {
          //Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $('.fullScreenSpin').css('display','none');
        });
      }else{
        let data = JSON.parse(localStorage.getItem('VS1ProfitandLoss_Report'));
        let records = [];
      if(data.profitandlossreport){
        let totalNetAssets = 0;
        let GrandTotalLiability = 0;
        let GrandTotalAsset = 0;
        let incArr = [];
        let cogsArr = [];
        let expArr = [];
        let accountData = data.profitandlossreport;
        let accountType = '';

        for (let i = 0; i < accountData.length; i++) {

          if(accountData[i]['Account Type'].replace(/\s/g, '') == ''){
            accountType = '';
          }else{
            accountType = accountData[i]['Account Type'];
          }
          let totalAmountEx = utilityService.modifynegativeCurrencyFormat(accountData[i]['TotalAmountEx'])|| 0.00;
        var dataList = {
          id: accountData[i]['AccountID'] || '',
          accounttype:accountType || '',
          accountname: accountData[i]['AccountName'] || '',
          accountno: accountData[i]['AccountNo'] || '',
          totalamountex: totalAmountEx || 0.00,
          name: $.trim(accountData[i]['AccountName']).split(" ").join("_")
          // totaltax: totalTax || 0.00


      };

      if((accountType == '') && (accountData[i]['AccountName'].replace(/\s/g, '') == '')){

      }else{
        // if(accountType.toLowerCase().indexOf("total") >= 0){
        //
        // }
        if((accountData[i]['TotalAmountEx'] != 0)){
          records.push(dataList);
        }

      }


      }

      templateObject.records.set(records);
      if(templateObject.records.get()){
      setTimeout(function () {
        $('td a').each(function(){
          if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
           });
       $('td').each(function(){
         if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
          });
          $('.fullScreenSpin').css('display','none');
      }, 100);
      }

      }


      }
    };

    if(url.indexOf('?dateFrom') > 0){
    localStorage.setItem('VS1ProfitandLoss_Report','');
    url = new URL(window.location.href);
    $("#dateFrom").val(moment(url.searchParams.get("dateFrom")).format("DD/MM/YYYY"));
    $("#dateTo").val(moment(url.searchParams.get("dateTo")).format("DD/MM/YYYY"));
    var getDateFrom = url.searchParams.get("dateFrom");
    var getLoadDate = url.searchParams.get("dateTo");
    templateObject.getProfitandLossReports(getDateFrom,getLoadDate,false);
    } else {
    var currentDate2 = new Date();
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    let getDateFrom = currentDate2.getFullYear() + "-" + (currentDate2.getMonth()) + "-" + currentDate2.getDate();
    templateObject.getProfitandLossReports(getDateFrom,getLoadDate,false);
  }

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

  Template.profitlossreport.events({
    'click td a':function (event) {
        let id= $(event.target).closest('tr').attr('id').split("item-value-");
        var accountName =id[1].split('_').join(' ');
        let toDate= moment($('#dateTo').val()).clone().endOf('month').format('YYYY-MM-DD');
        let fromDate= moment($('#dateFrom').val()).clone().startOf('year').format('YYYY-MM-DD');
        //Session.setPersistent('showHeader',true);
        window.open('/balancetransactionlist?accountName=' + accountName+ '&toDate=' + toDate + '&fromDate=' + fromDate + '&isTabItem='+false,'_self');
    },
    'change #dateTo':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        templateObject.records.set('');
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();

        //templateObject.getProfitandLossReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth()+1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        localStorage.setItem('VS1ProfitandLoss_Report','');
        if(($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")){
          templateObject.getProfitandLossReports('','',true);
          templateObject.dateAsAt.set('Current Date');
        }else{
          templateObject.getProfitandLossReports(formatDateFrom,formatDateTo,false);
          templateObject.dateAsAt.set(formatDate);
        }

    },
    'change #dateFrom':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        templateObject.records.set('');
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();

        //templateObject.getProfitandLossReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth()+1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        localStorage.setItem('VS1ProfitandLoss_Report','');
        if(($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")){
          templateObject.getProfitandLossReports('','',true);
          templateObject.dateAsAt.set('Current Date');
        }else{
          templateObject.getProfitandLossReports(formatDateFrom,formatDateTo,false);
          templateObject.dateAsAt.set(formatDate);
        }

    },
    'click .btnRefresh': function () {
      $('.fullScreenSpin').css('display','inline-block');
      localStorage.setItem('VS1ProfitandLoss_Report', '');
      Meteor._reload.reload();
    },
    'click .btnPrintReport':function (event) {
      document.title = 'Profit and Loss Report';
      $(".printReport").print({
          title   :  document.title +" | Profit and Loss | "+loggedCompany,
          noPrintSelector : ".addSummaryEditor",
      })
    },
    'click .btnExportReportProfit':function() {
      $('.fullScreenSpin').css('display','inline-block');
        let utilityService = new UtilityService();
        let templateObject = Template.instance();
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();

        const filename = loggedCompany + '-Profit and Loss' + '.csv';
        utilityService.exportReportToCsvTable('tableExport', filename, 'csv');
        let rows = [];
        // reportService.getProfitandLoss(formatDateFrom,formatDateTo,false).then(function (data) {
        //     if(data.profitandlossreport){
        //         rows[0] = ['Account Type','Account Name', 'Account Number', 'Total Amount(EX)'];
        //         data.profitandlossreport.forEach(function (e, i) {
        //             rows.push([
        //               data.profitandlossreport[i]['Account Type'],
        //               data.profitandlossreport[i].AccountName,
        //               data.profitandlossreport[i].AccountNo,
        //               // utilityService.modifynegativeCurrencyFormat(data.profitandlossreport[i]['Sub Account Total']),
        //               utilityService.modifynegativeCurrencyFormat(data.profitandlossreport[i].TotalAmountEx)]);
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
        localStorage.setItem('VS1ProfitandLoss_Report', '');
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
        templateObject.dateAsAt.set(fromDate);

        templateObject.getProfitandLossReports(getDateFrom,getLoadDate,false);

    },
    'click #lastQuarter':function(){
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display','inline-block');
        localStorage.setItem('VS1ProfitandLoss_Report', '');
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
        templateObject.getProfitandLossReports(getDateFrom,getLoadDate,false);

    },
    'click #last12Months':function(){
      let templateObject = Template.instance();
      $('.fullScreenSpin').css('display','inline-block');
      localStorage.setItem('VS1ProfitandLoss_Report', '');
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
      templateObject.getProfitandLossReports(getDateFrom,getLoadDate,false);


    },
    'click #ignoreDate':function(){
      let templateObject = Template.instance();
      $('.fullScreenSpin').css('display','inline-block');
      localStorage.setItem('VS1ProfitandLoss_Report', '');
      $('#dateFrom').attr('readonly', true);
      $('#dateTo').attr('readonly', true);
      templateObject.dateAsAt.set('Current Date');
      templateObject.getProfitandLossReports('','',true);

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
  Template.profitlossreport.helpers({
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
