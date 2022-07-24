import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
modalDraggable = function () {
    $('.modal-dialog').draggable({
        "handle":".modal-header, .modal-footer"
    });
$(document).ready(function(){
  $(document).on('click', '.highlightInput', function () {
    $(this).select();
  });

  // $(document).on('click', '.highlightSelect', function () {
  //   $(this).select();
  // });

  $(document).on('click', "input[type='text']", function () {
    $(this).select();
  });

  $(document).on('click', "input[type='email']", function () {
    $(this).select();
  });

  $(document).on('click', "input[type='number']", function () {
    $(this).select();
  });

  $(document).on('click', "input[type='password']", function () {
    $(this).select();
  });
  $("input[type='text']").on("click", function () {
   $(this).select();
 });

 $(".highlightInput").on("click", function () {
  $(this).select();
});

 $("input[type='number']").on("click", function () {
  $(this).select();
});

$("input[type='text']").click(function () {
   $(this).select();
});

$("input[type='number']").click(function () {
   $(this).select();
});

setTimeout(function () {
var usedNames = {};
$("select[name='edtBankAccountName'] > option").each(function () {
    if(usedNames[this.text]) {
        $(this).remove();
    } else {
        usedNames[this.text] = this.value;
    }
});
}, 3000);

// $(".hasDatepicker").on("blur", function () {

  $(document).on('blur', '.hasDatepicker', function () {
         let dateEntered = $(event.target).val();
         let parts = [];
         if(dateEntered.length > 6){

             let isReceiptDateValid = moment($(event.target).val()).isValid();
             let symbolArr = ['/', '-', '.', ' ',','];
             symbolArr.forEach(function (e, i) {
                 if ($(event.target).val().indexOf(symbolArr[i]) > -1) {
                     parts = $(event.target).val().split(symbolArr[i]);
                 }
             });
             if(parts.length){
                 if(!isReceiptDateValid) {
                     if (!(parts[0] && (parts[1] < 13) && (parts[2] > 999 && parts[2] < 9999 ))) {
                         $(event.target).val(moment().format('DD/MM/YYYY'));
                     } else {
                         let myDate = moment(new Date(parts[2], parts[1] - 1, parts[0])).format("DD/MM/YYYY");
                         $(event.target).val(myDate);
                     }
                 }else{
                     if (!(parts[0] && (parts[1] < 13) && (parts[2] > 999 && parts[2] < 9999 ))) {
                         $(event.target).val(moment($(event.target).val()).format('DD/MM/YYYY'));
                     } else {
                         let myDate = moment(new Date(parts[2], parts[1] - 1, parts[0])).format("DD/MM/YYYY");
                         $(event.target).val(myDate);
                     }
                 }
             }else{
                 $(event.target).val(moment().format('DD/MM/YYYY'));

             }

         }else if(dateEntered.length === 6){
             let parts = dateEntered.match(/.{1,2}/g);
             tempDay = parseInt(parts[0]);
             tempMonth = parseInt(parts[1])-1;
             tempYear = parseInt(parts[2])+2000;
             if(!((tempDay < 31) && (tempMonth <12) && tempDay && tempMonth && tempYear)){
                 $(event.target).val(moment().format('DD/MM/YYYY'));
             }else {
                 let tempDate = moment(new Date(tempYear,tempMonth,tempDay)).format('DD/MM/YYYY');
                 $(event.target).val(tempDate);
             }
         }else {
             $(event.target).val(moment().format('DD/MM/YYYY'));
         }
});

$('.dropdown-toggle').on("click",function(event){

    //event.stopPropagation();
});
// $('.dropdown-toggle').click(e => e.stopPropagation());
  });


    /*
      Bert.defaults = {
      hideDelay: 5000,
      style: 'fixed-top',
      type: 'default'
        };
        */
};


  makeNegativeGlobal = function () {
    $('td').each(function() {
        if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
    });
    $('td.colStatus').each(function(){
        if($(this).text() == "Deleted") $(this).addClass('text-deleted');
        if ($(this).text() == "Full") $(this).addClass('text-fullyPaid');
        if ($(this).text() == "Part") $(this).addClass('text-partialPaid');
        if ($(this).text() == "Rec") $(this).addClass('text-reconciled');
    });
  };

batchUpdateCall = function (url) {
    var erpGet = erpDb();
    let dashboardArray = [];
    var oReq = new XMLHttpRequest();
    var oReq2 = new XMLHttpRequest();
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

    oReq.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/VS1_BatchUpdate', true);
    oReq.setRequestHeader("database",erpGet.ERPDatabase);
    oReq.setRequestHeader("username",erpGet.ERPUsername);
    oReq.setRequestHeader("password",erpGet.ERPPassword);
    oReq.send();
    oReq.onreadystatechange = function() {
        if(oReq.readyState == 4 && oReq.status == 200) {
          var myArrResponse = JSON.parse(oReq.responseText);
          let responseBack = myArrResponse.ProcessLog.ResponseStatus;

          if (~responseBack.indexOf("Finished Batch Update")){

            sideBarService.getTTransactionListReport('').then(function(data) {
                addVS1Data('TTransactionListReport',JSON.stringify(data));
            }).catch(function(err) {

            });
            sideBarService.getTAPReport(prevMonth11Date,toDate, false).then(function(data) {
              addVS1Data('TAPReport',JSON.stringify(data));
            }).catch(function(err) {
            });
            sideBarService.getTARReport(prevMonth11Date,toDate, false).then(function(data) {
              addVS1Data('TARReport',JSON.stringify(data));

            }).catch(function(err) {

            });
            //Meteor._reload.reload();
            oReq2.open("GET",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/Vs1_Dashboard', true);
            oReq2.setRequestHeader("database",erpGet.ERPDatabase);
            oReq2.setRequestHeader("username",erpGet.ERPUsername);
            oReq2.setRequestHeader("password",erpGet.ERPPassword);
            oReq2.send();
            oReq2.onreadystatechange = function() {
                if(oReq2.readyState == 4 && oReq2.status == 200) {
                  // var myArrResponse2 = JSON.parse(oReq2.responseText);
                  var dataReturnRes = JSON.parse(oReq2.responseText);

                  //Dashboard API:
                  if(dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields){
                  Session.setPersistent('vs1companyName', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_CompanyName||'');
                  Session.setPersistent('vs1companyaddress1', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address||'');
                  Session.setPersistent('vs1companyaddress2', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address2||'');
                  Session.setPersistent('vs1companyABN', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_ABN||'');
                  Session.setPersistent('vs1companyPhone', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_PhoneNumber||'');
                  Session.setPersistent('vs1companyURL', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_URL||'');

                  Session.setPersistent('ERPDefaultDepartment', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultClass||'');
                  Session.setPersistent('ERPDefaultUOM', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultUOM||'');


                  // Session.setPersistent('ERPCurrency', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_CurrencySymbol||'');
                  Session.setPersistent('ERPCountryAbbr', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_ForeignExDefault||'');
                  Session.setPersistent('ERPTaxCodePurchaseInc', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc||'');
                  Session.setPersistent('ERPTaxCodeSalesInc', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc||'');


                  localStorage.setItem('VS1OverDueInvoiceAmt_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_AMOUNT||Currency+'0');
                  localStorage.setItem('VS1OverDueInvoiceQty_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_QUANTITY||0);
                  localStorage.setItem('VS1OutstandingPayablesAmt_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_AMOUNT||Currency+'0');
                  localStorage.setItem('VS1OutstandingPayablesQty_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_QUANTITY||0);

                  localStorage.setItem('VS1OutstandingInvoiceAmt_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_AMOUNT || Currency + '0');
                  localStorage.setItem('VS1OutstandingInvoiceQty_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_QUANTITY || 0);
                  localStorage.setItem('VS1OverDuePayablesAmt_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_AMOUNT || Currency + '0');
                  localStorage.setItem('VS1OverDuePayablesQty_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_QUANTITY || 0);

                  localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');

                    //Profit & Loss
                  localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_NetIncomeEx||0);
                  localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalIncomeEx||0);
                  localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalExpenseEx||0);
                  localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalCOGSEx||0);

                  if(dataReturnRes.ProcessLog.TUser.TEmployeePicture.ResponseNo == 401){
                    localStorage.setItem('vs1LoggedEmployeeImages_dash','');
                  }else{
                    if(dataReturnRes.ProcessLog.TUser.TEmployeePicture.fields){
                    localStorage.setItem('vs1LoggedEmployeeImages_dash', dataReturnRes.ProcessLog.TUser.TEmployeePicture.fields.EncodedPic|| '');
                    }else{
                      localStorage.setItem('vs1LoggedEmployeeImages_dash','');
                    }
                  }
                  }
                  localStorage.setItem('VS1APReport_dash', JSON.stringify(dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_ap_report.items)||'');
                  localStorage.setItem('VS1PNLPeriodReport_dash', JSON.stringify(dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_pnl_period.items)||'');
                  localStorage.setItem('VS1SalesListReport_dash', JSON.stringify(dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_saleslist.items)||'');
                  localStorage.setItem('VS1SalesEmpReport_dash', JSON.stringify(dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_salesperemployee.items)||'');
                  getVS1Data('vscloudlogininfo').then(function (dataObject) {
                    if(dataObject.length == 0){

                    }else{
                      //let userData = dataObject[0].data;
                      dashboardArray = dataObject[0].data;



                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture = dataReturnRes.ProcessLog.TUser.TEmployeePicture;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_ap_report = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_ap_report;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_pnl_period = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_pnl_period;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_saleslist = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_saleslist;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_salesperemployee = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_salesperemployee;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TUser.TransactionTableLastUpdated = dataReturnRes.ProcessLog.TUser.TransactionTableLastUpdated;

                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TEmployeePicture = dataReturnRes.ProcessLog.TUser.TEmployeePicture;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TVS1_Dashboard_ap_report = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_ap_report;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TVS1_Dashboard_pnl_period = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_pnl_period;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TVS1_Dashboard_saleslist = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_saleslist;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TVS1_Dashboard_salesperemployee = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_salesperemployee;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TVS1_Dashboard_summary = dataReturnRes.ProcessLog.TUser.TVS1_Dashboard_summary;
                      dashboardArray.ProcessLog.ClientDetails.ProcessLog.TransactionTableLastUpdated = dataReturnRes.ProcessLog.TUser.TransactionTableLastUpdated;


                    }

                    addLoginData(dashboardArray).then(function (datareturnCheck) {
                      setTimeout(function () {
                      if(url){
                        window.open(url,'_self');
                      }else{
                        location.reload(true);
                      }
                    }, 500);

                      // setTimeout(function () {
                      //   if(url){
                      //     window.open(url,'_self');
                      //   }else{
                      //     location.reload(true);
                      //   }
                      //
                      // }, 10000);
                    }).catch(function (err) {
                      //setTimeout(function () {
                        if(url){
                          window.open(url,'_self');
                        }else{
                          location.reload(true);
                        }
                      //}, 10000);
                    });
                  }).catch(function (err) {

                  });

                }else if (oReq2.status != 200){


                    Meteor._reload.reload();


                }
            }
          }else{


              Meteor._reload.reload();

          }
          //if(responseBack.ResponseStatus == )
            //Meteor._reload.reload();
        }else if (oReq.status != 200){


            Meteor._reload.reload();

        }
    }
};

getHour24 = function (timeString) {
  let time = null;
  let timeSplit = timeString.split(':'),
      hours,
      minutes,
      meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
      meridian = 'PM';
      hours -= 12;
    } else if (hours < 12) {
      meridian = 'AM';
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = 'PM';
    }

let getTimeString = hours + ':' + minutes + ' ' + meridian;
var matches = getTimeString.match(/^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/);

 if (matches != null && matches.length == 3){

     time = parseInt(matches[1]);
     if (meridian == 'PM'){
       if(time >= 1 && time < 12){
         time += 12;
       }else if(time == 12){
         time = 12;
       }
     }
 }
return time + ':' + minutes;
};

// $(window).load(function() {
//
// });

//$(document).ready(function(){
// $(window).unload(function(){
//   if(Session.get('mycloudLogonID')){
//     CloudUser.update({_id: Session.get('mycloudLogonID')},{ $set: {userMultiLogon: false}});
//   }
// });
//});
