import {VS1ChartService} from "../vs1charts-service";
import 'jQuery.print/jQuery.print.js';
import {UtilityService} from "../../utility-service";
let _ = require('lodash');
let vs1chartService = new VS1ChartService();
let utilityService = new UtilityService();
Template.profitandlosschart.onCreated(()=>{
const templateObject = Template.instance();
templateObject.records = new ReactiveVar([]);
templateObject.dateAsAt = new ReactiveVar();
templateObject.deptrecords = new ReactiveVar();

templateObject.salesperc = new ReactiveVar();
templateObject.expenseperc = new ReactiveVar();
templateObject.salespercTotal = new ReactiveVar();
templateObject.expensepercTotal = new ReactiveVar();

templateObject.netincomepercTotal = new ReactiveVar();
templateObject.netincomeperc = new ReactiveVar();
});

Template.profitandlosschart.onRendered(()=>{

  const templateObject = Template.instance();
  let utilityService = new UtilityService();
  let salesOrderTable;
  var splashArray = new Array();
  var today = moment().format('DD/MM/YYYY');
  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  let fromDateMonth = (currentDate.getMonth() + 1);
  let fromDateDay = currentDate.getDate();


  let checkStatus = localStorage.getItem("profitloss") || true;
  // setTimeout(function(){
  // if(checkStatus == false || checkStatus == "false") {
  //   $("#profitlossstatus").addClass('hideelement')
  //   $('#profitloss1hide').text("Show");
  // } else {
  //   $("#profitlossstatus").removeClass('hideelement')
  //   $('#profitloss1hide').text("Hide");
  // }
  //   },1000);

  if((currentDate.getMonth()+1) < 10){
    fromDateMonth = "0" + (currentDate.getMonth()+1);
  }

  if(currentDate.getDate() < 10){
    fromDateDay = "0" + currentDate.getDate();
  }
  var fromDate =fromDateDay + "/" +(fromDateMonth) + "/" + currentDate.getFullYear();

  templateObject.dateAsAt.set(begunDate);
 const dataTableList = [];
 const deptrecords = [];

 if ((!localStorage.getItem('VS1ProfitandLoss_netIncomeEx_dash'))) {

    templateObject.getProfitandLossReports = function (dateFrom, dateTo, ignoreDate) {
        vs1chartService.getProfitandLoss(dateFrom, dateTo, ignoreDate).then(function (data) {
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
          let totalExpense = 0;
          let totalCOGS = 0;
          let totalSales = 0;
          let totalExpensePerc = 0;
          let totalSalesPerc = 0;

          let totalnetIncome = 0;
          let totalSumProfitLoss = 0;
          let sumTotalExpense = 0;
          for (let i = 0; i < accountData.length; i++) {

            if(accountData[i]['Account Type'].replace(/\s/g, '') == ''){
              accountType = '';
            }else{
              accountType = accountData[i]['Account Type'];
            }

            if(accountData[i]['Account Type'].replace(/\s/g, '') == 'TotalExpenses'){
            totalExpense =accountData[i]['TotalAmountEx']|| 0.00;
            }

            if(accountData[i]['Account Type'].replace(/\s/g, '') == 'TotalCOGS'){
            totalCOGS = accountData[i]['TotalAmountEx']|| 0.00;
            }



            if(accountData[i]['Account Type'].replace(/\s/g, '') == 'TotalIncome'){
            totalSales = accountData[i]['TotalAmountEx']|| 0.00;
            $('.spnTotalSales').html(utilityService.modifynegativeCurrencyFormat(totalSales));

            }



            if(accountData[i]['Account Type'].replace(/\s/g, '') == 'NetIncome'){
            totalnetIncome = accountData[i]['TotalAmountEx']|| 0.00;
            let totalNetIncomePerc = ((totalnetIncome / 100) * 100);
            templateObject.netincomeperc.set(Math.abs(totalNetIncomePerc));
            $('.spnTotalnetincome').html(utilityService.modifynegativeCurrencyFormat(totalnetIncome));

            }





        }
        if((!isNaN(totalExpense))&&(!isNaN(totalCOGS))){


             sumTotalExpense = (Number(totalExpense) + Number(totalCOGS));
            $('.spnTotalExpense').html(utilityService.modifynegativeCurrencyFormat(Math.abs(sumTotalExpense)));
        }

        if((!isNaN(sumTotalExpense))&&(!isNaN(totalSales))){
          // totalnetIncome = totalSales -  totalExpense;
          totalSumProfitLoss =  (Number(totalSales) + Math.abs(sumTotalExpense)) || 0;


           totalExpensePerc = (sumTotalExpense / totalSumProfitLoss) * 100;

          totalSalesPerc = (totalSales / totalSumProfitLoss) * 100;

          templateObject.salespercTotal.set(utilityService.modifynegativeCurrencyFormat(totalSalesPerc));
          templateObject.expensepercTotal.set(utilityService.modifynegativeCurrencyFormat(totalExpensePerc));

           templateObject.salesperc.set(totalSalesPerc);
           if(totalExpensePerc < 0 ){
             templateObject.expenseperc.set(Math.abs(totalExpensePerc));
             $('.cssExpense').addClass('bg-danger');
             $('.cssExpense').removeClass('bg-success');
           }else{
             templateObject.expenseperc.set(totalExpensePerc);
           }


        }
        templateObject.records.set(records);

        }

        }).catch(function (err) {

        });
    };

    var currentDate2 = new Date();
    var dateFrom = new Date();
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    let getDateFrom = Math.floor(currentDate2.getFullYear() -1) + "-" + Math.floor(currentDate2.getMonth() +1) + "-" + currentDate2.getDate();
    dateFrom.setMonth(dateFrom.getMonth()-6);
    dateFrom = dateFrom.getFullYear() +'-'+ ("0"+ (dateFrom.getMonth()+1)).slice(-2) + '-' + ("0"+ (dateFrom.getDate())).slice(-2);
    $("#profitloss1").attr("href", "/profitlossreport?dateFrom="+dateFrom+"&dateTo="+getLoadDate);


       templateObject.getProfitandLossReports(getDateFrom,getLoadDate,false);
     }else{
      var currentDate2 = new Date();
      var dateFrom = new Date();
      var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
      let getDateFrom = Math.floor(currentDate2.getFullYear() -1) + "-" + Math.floor(currentDate2.getMonth() +1) + "-" + currentDate2.getDate();
      dateFrom.setMonth(dateFrom.getMonth()-6);
      dateFrom = dateFrom.getFullYear() +'-'+ ("0"+ (dateFrom.getMonth()+1)).slice(-2) + '-' + ("0"+ (dateFrom.getDate())).slice(-2);
      $("#profitloss1").attr("href", "/profitlossreport?dateFrom="+dateFrom+"&dateTo="+getLoadDate);
       let totalExpense = localStorage.getItem('VS1ProfitandLoss_ExpEx_dash') || 0;
       let totalCOGS = localStorage.getItem('VS1ProfitandLoss_COGSEx_dash') || 0;
       let totalSales = localStorage.getItem('VS1ProfitandLoss_IncomeEx_dash') || 0;
       let totalNetIncome = localStorage.getItem('VS1ProfitandLoss_netIncomeEx_dash') || 0;

       let totalSalesPerc = 0;

       let totalnetIncome = 0;
       let totalSumProfitLoss = 0;
       let sumTotalExpense = (Number(totalExpense) + Number(totalCOGS)) || 0;

       $('.spnTotalSales').html(utilityService.modifynegativeCurrencyFormat(totalSales));
       $('.spnTotalnetincome').html(utilityService.modifynegativeCurrencyFormat(totalNetIncome));
       $('.spnTotalExpense').html(utilityService.modifynegativeCurrencyFormat(Math.abs(sumTotalExpense)));


        if((!isNaN(sumTotalExpense))&&(!isNaN(totalSales))){
          totalSumProfitLoss =  (Number(totalSales) + Math.abs(sumTotalExpense)) || 0;

           totalExpensePerc = (sumTotalExpense / totalSumProfitLoss) * 100;
           totalSalesPerc = (totalSales / totalSumProfitLoss) * 100;
           let totalNetIncomePerc = (totalNetIncome / totalSumProfitLoss) * 100;
           templateObject.netincomeperc.set(Math.abs(totalNetIncomePerc));
          templateObject.salespercTotal.set(utilityService.modifynegativeCurrencyFormat(totalSalesPerc));
          templateObject.expensepercTotal.set(utilityService.modifynegativeCurrencyFormat(totalExpensePerc));

           templateObject.salesperc.set(totalSalesPerc);
           if(totalExpensePerc < 0 ){
             templateObject.expenseperc.set(Math.abs(totalExpensePerc));
             $('.cssExpense').addClass('bg-danger');
             $('.cssExpense').removeClass('bg-success');
           }else{
             templateObject.expenseperc.set(totalExpensePerc);
           }


        }

     }


  });

  Template.profitlossreport.events({
    'click td a':function (event) {
        let id= $(event.target).closest('tr').attr('id').split("item-value-");
        var accountName =id[1].split('_').join(' ');
        let toDate= moment($('#dateTo').val()).clone().endOf('month').format('YYYY-MM-DD');
        let fromDate= moment($('#dateFrom').val()).clone().startOf('year').format('YYYY-MM-DD');
        //Session.setPersistent('showHeader',true);
        FlowRouter.go('/balancetransactionlist?accountName=' + accountName+ '&toDate=' + toDate + '&fromDate=' + fromDate + '&isTabItem='+false);
    },
    'click .btnRefresh': function () {
      Meteor._reload.reload();
    },
   //  'click #profitloss1hide': function () {
   //  let check = localStorage.getItem("profitloss") || true;
   //  if(check == "true" || check == true) {
   //     $("#profitloss1hide").text("Show");
   //  } else {
   //     $("#profitloss1hide").text("Hide");
   //  }
   // },
    'click .btnPrintReport':function (event) {
      $(".printReport").print({
          title   :  document.title +" | Aged Receivables | "+loggedCompany,
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

        const filename = loggedCompany + '-Profit and Loss' + '.xls';
        let rows = [];
        vs1chartService.getProfitandLoss(formatDateFrom,formatDateTo,false).then(function (data) {
            if(data.profitandlossreport){
                rows[0] = ['Account Type','Account Name', 'Account Number', 'Total Amount(EX)'];
                data.profitandlossreport.forEach(function (e, i) {
                    rows.push([
                      data.profitandlossreport[i]['Account Type'],
                      data.profitandlossreport[i].AccountName,
                      data.profitandlossreport[i].AccountNo,
                      // utilityService.modifynegativeCurrencyFormat(data.profitandlossreport[i]['Sub Account Total']),
                      utilityService.modifynegativeCurrencyFormat(data.profitandlossreport[i].TotalAmountEx)]);
                });
                setTimeout(function () {
                    utilityService.exportReportToCsv(rows, filename, 'xls');
                    $('.fullScreenSpin').css('display','none');
                }, 1000);
            }

        });
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



  Template.profitandlosschart.helpers({
    dateAsAt: () =>{
        return Template.instance().dateAsAt.get() || '-';
    },
    companyname: () =>{
        return loggedCompany;
    },
    salesperc: () =>{
        return Template.instance().salesperc.get() || 0;
    },
    expenseperc: () =>{
        return Template.instance().expenseperc.get() || 0;
    },
    salespercTotal: () =>{
        return Template.instance().salespercTotal.get() || 0;
    },
    expensepercTotal: () =>{
        return Template.instance().expensepercTotal.get() || 0;
    },
    netincomeperc: () =>{
        return Template.instance().netincomeperc.get() || 0;
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
