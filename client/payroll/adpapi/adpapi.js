import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {UtilityService} from "../../utility-service";
import {ContactService} from "../../contacts/contact-service";
Template.adpapi.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);

  templateObject.selectedFile = new ReactiveVar();
  templateObject.jobsrecords = new ReactiveVar([]);
});

Template.adpapi.onRendered(function () {
  $('.fullScreenSpin').css('display','inline-block');
  let templateObject = Template.instance();
  let contactService = new ContactService();

  const employeeList = [];
  const dataTableList = [];
  const tableHeaderList = [];
  const jobsList = [];

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

  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tbladp', function(error, result){
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
  templateObject.getEmployees = function () {
    contactService.getAllEmployeesData().then(function (data) {
      let lineItems = [];
      let lineItemObj = {};
      // $('.fullScreenSpin').css('display','none');
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

        setTimeout(function () {
          $('.fullScreenSpin').css('display','none');
          //$.fn.dataTable.moment('DD/MM/YY');
          $.fn.editable.defaults.select = true;
            $('#tbladp').DataTable({
              columnDefs: [
                  // {type: 'date', targets: 0},
                  { "orderable": false, "targets": -1 }
              ],
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                        {
                     extend: 'excelHtml5',
                     text: '',
                     download: 'open',
                     className: "btntabletocsv hiddenColumn",
                     filename: "adplist_"+ moment().format(),
                     orientation:'portrait',
                      exportOptions: {
                      columns: ':visible'
                    }
                  },{
                      extend: 'print',
                      download: 'open',
                      className: "btntabletopdf hiddenColumn",
                      text: '',
                      title: '',
                      filename: "adplist_"+ moment().format(),
                      exportOptions: {
                      columns: ':visible'
                    }
                  }],
                  select: true,
                  destroy: true,
                  colReorder: true,
                  // bStateSave: true,
                  // rowId: 0,
                  pageLength: initialDatatableLoad,
                  lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                  info: true,
                  responsive: true,
                  "order": [[ 0, "asc" ]],
                  action: function () {
                      $('#tbladp').DataTable().ajax.reload();
                  },
                  "fnDrawCallback": function (oSettings) {
                    $.fn.editable.defaults.select = true;
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

              $('.fullScreenSpin').css('display','none');
          }, 0);


          var columns = $('#tbladp th');
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
          //}
      }

      templateObject.datatablerecords.set(dataTableList);
      if(templateObject.datatablerecords.get()){

        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tbladp', function(error, result){
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

    }).catch(function (err) {
        $('.fullScreenSpin').css('display','none');
    });
  }

  templateObject.getEmployees();

  templateObject.getJobs = function () {
    contactService.getAllJobsNameData().then(function (data) {
      let lineItems = [];
      let lineItemObj = {};

      for(let i=0; i<data.tjobvs1.length; i++){
           var dataListJobs = {
             id: data.tjobvs1[i].Id || '',
             jobname: data.tjobvs1[i].JobName || ''

         };

         if(data.tjobvs1[i].JobName.replace(/\s/g, '') != ''){
          jobsList.push(dataListJobs);
        }

      }

      templateObject.jobsrecords.set(jobsList);

    }).catch(function (err) {

    });
  }

  templateObject.getJobs();
// $('.fullScreenSpin').css('display','none');


});

Template.adpapi.helpers({
  jobsrecords : () => {
     return Template.instance().jobsrecords.get().sort(function(a, b){
       if (a.jobname == 'NA') {
     return 1;
         }
     else if (b.jobname == 'NA') {
       return -1;
     }
   return (a.jobname.toUpperCase() > b.jobname.toUpperCase()) ? 1 : -1;
   });
 },
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
  },
  tableheaderrecords: () => {
     return Template.instance().tableheaderrecords.get();
  }
});


Template.adpapi.events({
  'click .chkDatatable' : function(event){
    var columns = $('#tbladp th');
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
        var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tbladp'});
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
    //let datatable =$('#tbladp').DataTable();
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
        var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tbladp'});
        if (checkPrefDetails) {
          CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
            PrefGroup:'salesform',PrefName:'tbladp',published:true,
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
            PrefGroup:'salesform',PrefName:'tbladp',published:true,
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

    var datable = $('#tbladp').DataTable();
    var title = datable.column( columnDatanIndex ).header();
    $(title).html(columData);

  },
  'change .rngRange' : function(event){
    let range = $(event.target).val();
    // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

    // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
    var datable = $('#tbladp th');
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
    var columns = $('#tbladp th');

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
    'click .exportbtn': function () {
      $('.fullScreenSpin').css('display','inline-block');
      jQuery('#tbladp_wrapper .dt-buttons .btntabletocsv').click();
       $('.fullScreenSpin').css('display','none');
    },
      'click .exportbtnExcel': function () {
        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tbladp_wrapper .dt-buttons .btntabletoexcel').click();
         $('.fullScreenSpin').css('display','none');
      },
    'click .btnRefresh': function () {
      //Meteor._reload.reload();
        window.open('/adpapi','_self');
    },
'click .printConfirm' : function(event){

$('.fullScreenSpin').css('display','inline-block');
jQuery('#tbladp_wrapper .dt-buttons .btntabletopdf').click();
$('.fullScreenSpin').css('display','none');
},
'click .cashamount' : function(event){
  $(event.target).select();
}
  });
