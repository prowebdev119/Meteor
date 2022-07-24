import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {UtilityService} from "../../utility-service";
import {ContactService} from "../../contacts/contact-service";
Template.squareapi.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);

  templateObject.selectedFile = new ReactiveVar();
});

Template.squareapi.onRendered(function () {
  $('.fullScreenSpin').css('display','inline-block');
  let templateObject = Template.instance();
  let contactService = new ContactService();

  const employeeList = [];
  const dataTableList = [];
  const tableHeaderList = [];

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
   });

   $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);
$('.fullScreenSpin').css('display','none');
  templateObject.getEmployees = function () {
    contactService.getAllEmployeesData().then(function (data) {
      let lineItems = [];
      let lineItemObj = {};
      $('.fullScreenSpin').css('display','none');
      for(let i=0; i<data.temployee.length; i++){
           var dataList = {
             id: data.temployee[i].Id || '',
             employeeno: data.temployee[i].EmployeeNo || '',
             employeename:data.temployee[i].EmployeeName || '',
             firstname: data.temployee[i].FirstName || '',
             lastname: data.temployee[i].LastName || '',
             phone: data.temployee[i].Phone || '',
             mobile: data.temployee[i].Mobile || '',
             email: data.temployee[i].Email || '',
             address: data.temployee[i].Street || '',
             country: data.temployee[i].Country || '',
             department: data.temployee[i].DefaultClassName || '',
             custFld1: data.temployee[i].CustFld1 || '',
             custFld2: data.temployee[i].CustFld2 || '',
             custFld3: data.temployee[i].CustFld3 || '',
             custFld4: data.temployee[i].CustFld4 || ''
         };

         if(data.temployee[i].EmployeeName.replace(/\s/g, '') != ''){
          dataTableList.push(dataList);
        }
          //}
      }

      templateObject.datatablerecords.set(dataTableList);

    }).catch(function (err) {
        $('.fullScreenSpin').css('display','none');
    });
  }

  templateObject.getEmployees();


});

Template.squareapi.helpers({
  datatablerecords : () => {
     return Template.instance().datatablerecords.get().sort(function(a, b){
       if (a.employeename == 'NA') {
     return 1;
         }
     else if (b.employeename == 'NA') {
       return -1;
     }
   return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
   });
  }
});
