import {TaxRateService} from "../settings-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
Template.taxRatesSettings.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);

  templateObject.defaultpurchasetaxcode = new ReactiveVar();
  templateObject.defaultsaletaxcode = new ReactiveVar();
});

Template.taxRatesSettings.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];

    let purchasetaxcode = '';
    let salestaxcode = '';
    templateObject.defaultpurchasetaxcode.set(loggedTaxCodePurchaseInc);
    templateObject.defaultsaletaxcode.set(loggedTaxCodeSalesInc);
  setTimeout(function () {
    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'defaulttax', function(error, result){
    if(error){
      purchasetaxcode = loggedTaxCodePurchaseInc;
      salestaxcode =  loggedTaxCodeSalesInc;
      templateObject.defaultpurchasetaxcode.set(loggedTaxCodePurchaseInc);
      templateObject.defaultsaletaxcode.set(loggedTaxCodeSalesInc);
    }else{
      if(result){
        purchasetaxcode = result.customFields[0].taxvalue || loggedTaxCodePurchaseInc;
        salestaxcode = result.customFields[1].taxvalue || loggedTaxCodeSalesInc;
        templateObject.defaultpurchasetaxcode.set(purchasetaxcode);
        templateObject.defaultsaletaxcode.set(salestaxcode);
      }

    }
    });
  }, 500);



    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'taxRatesList', function(error, result){
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

    function MakeNegative() {
      $('td').each(function(){
        if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
       });
    };

    templateObject.getTaxRates = function () {
      getVS1Data('TTaxcodeVS1').then(function (dataObject) {
        if(dataObject.length == 0){
          taxRateService.getTaxRateVS1().then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            for(let i=0; i<data.ttaxcodevs1.length; i++){
              let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2) + '%';
                 var dataList = {
                   id: data.ttaxcodevs1[i].Id || '',
                   codename: data.ttaxcodevs1[i].CodeName || '-',
                   description: data.ttaxcodevs1[i].Description || '-',
                   region: data.ttaxcodevs1[i].RegionName || '-',
                   rate:taxRate || '-',


               };

                dataTableList.push(dataList);
                //}
            }

            templateObject.datatablerecords.set(dataTableList);

            if(templateObject.datatablerecords.get()){

              Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'taxRatesList', function(error, result){
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
                $('#taxRatesList').DataTable({
                  columnDefs: [
                      {type: 'date', targets: 0},
                      { "orderable": false, "targets": -1 }
                  ],
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                        {
                     extend: 'excelHtml5',
                     text: '',
                     download: 'open',
                     className: "btntabletocsv hiddenColumn",
                     filename: "taxratelist_"+ moment().format(),
                     orientation:'portrait',
                      exportOptions: {
                      columns: ':visible'
                    }
                  },{
                      extend: 'print',
                      download: 'open',
                      className: "btntabletopdf hiddenColumn",
                      text: '',
                      title: 'Tax Rate List',
                      filename: "taxratelist_"+ moment().format(),
                      exportOptions: {
                      columns: ':visible'
                    }
                  }],
                      select: true,
                      destroy: true,
                      // colReorder: true,
                      colReorder: {
                          fixedColumnsRight: 1
                      },
                      // bStateSave: true,
                      // rowId: 0,
                      // pageLength: 25,
                      paging: false,
//                      "scrollY": "400px",
//                      "scrollCollapse": true,
                      info: true,
                      responsive: true,
                      "order": [[ 0, "asc" ]],
                      action: function () {
                          $('#taxRatesList').DataTable().ajax.reload();
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
                      let draftRecord = templateObject.datatablerecords.get();
                      templateObject.datatablerecords.set(draftRecord);
                  }).on('column-reorder', function () {

                  }).on( 'length.dt', function ( e, settings, len ) {
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                  });

                  // $('#taxRatesList').DataTable().column( 0 ).visible( true );
                  $('.fullScreenSpin').css('display','none');
              }, 0);

              var columns = $('#taxRatesList th');
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
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $('.fullScreenSpin').css('display','none');
              // Meteor._reload.reload();
          });
        }else{
          let data = JSON.parse(dataObject[0].data);
          let useData = data.ttaxcodevs1;
          let lineItems = [];
let lineItemObj = {};
for(let i=0; i<useData.length; i++){
  let taxRate = (useData[i].Rate * 100).toFixed(2) + '%';
     var dataList = {
       id: useData[i].Id || '',
       codename: useData[i].CodeName || '-',
       description: useData[i].Description || '-',
       region: useData[i].RegionName || '-',
       rate:taxRate || '-',


   };

    dataTableList.push(dataList);
    //}
}

templateObject.datatablerecords.set(dataTableList);

if(templateObject.datatablerecords.get()){

  Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'taxRatesList', function(error, result){
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
    $('#taxRatesList').DataTable({
      columnDefs: [
          {type: 'date', targets: 0},
          { "orderable": false, "targets": -1 }
      ],
      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
      buttons: [
            {
         extend: 'excelHtml5',
         text: '',
         download: 'open',
         className: "btntabletocsv hiddenColumn",
         filename: "taxratelist_"+ moment().format(),
         orientation:'portrait',
          exportOptions: {
          columns: ':visible'
        }
      },{
          extend: 'print',
          download: 'open',
          className: "btntabletopdf hiddenColumn",
          text: '',
          title: 'Tax Rate List',
          filename: "taxratelist_"+ moment().format(),
          exportOptions: {
          columns: ':visible'
        }
      }],
          select: true,
          destroy: true,
          // colReorder: true,
          colReorder: {
              fixedColumnsRight: 1
          },
          // bStateSave: true,
          // rowId: 0,
          // pageLength: 25,
          paging: false,
//          "scrollY": "400px",
//          "scrollCollapse": true,
          info: true,
          responsive: true,
          "order": [[ 0, "asc" ]],
          action: function () {
              $('#taxRatesList').DataTable().ajax.reload();
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
          let draftRecord = templateObject.datatablerecords.get();
          templateObject.datatablerecords.set(draftRecord);
      }).on('column-reorder', function () {

      }).on( 'length.dt', function ( e, settings, len ) {
        setTimeout(function () {
          MakeNegative();
        }, 100);
      });

      // $('#taxRatesList').DataTable().column( 0 ).visible( true );
      $('.fullScreenSpin').css('display','none');
  }, 0);

  var columns = $('#taxRatesList th');
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
      }).catch(function (err) {
        taxRateService.getTaxRateVS1().then(function (data) {
          let lineItems = [];
          let lineItemObj = {};
          for(let i=0; i<data.ttaxcodevs1.length; i++){
            let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2) + '%';
               var dataList = {
                 id: data.ttaxcodevs1[i].Id || '',
                 codename: data.ttaxcodevs1[i].CodeName || '-',
                 description: data.ttaxcodevs1[i].Description || '-',
                 region: data.ttaxcodevs1[i].RegionName || '-',
                 rate:taxRate || '-',


             };

              dataTableList.push(dataList);
              //}
          }

          templateObject.datatablerecords.set(dataTableList);

          if(templateObject.datatablerecords.get()){

            Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'taxRatesList', function(error, result){
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
              $('#taxRatesList').DataTable({
                columnDefs: [
                    {type: 'date', targets: 0},
                    { "orderable": false, "targets": -1 }
                ],
                "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [
                      {
                   extend: 'excelHtml5',
                   text: '',
                   download: 'open',
                   className: "btntabletocsv hiddenColumn",
                   filename: "taxratelist_"+ moment().format(),
                   orientation:'portrait',
                    exportOptions: {
                    columns: ':visible'
                  }
                },{
                    extend: 'print',
                    download: 'open',
                    className: "btntabletopdf hiddenColumn",
                    text: '',
                    title: 'Tax Rate List',
                    filename: "taxratelist_"+ moment().format(),
                    exportOptions: {
                    columns: ':visible'
                  }
                }],
                    select: true,
                    destroy: true,
                    // colReorder: true,
                    colReorder: {
                        fixedColumnsRight: 1
                    },
                    // bStateSave: true,
                    // rowId: 0,
                    // pageLength: 25,
                    paging: false,
//                    "scrollY": "400px",
//                    "scrollCollapse": true,
                    info: true,
                    responsive: true,
                    "order": [[ 0, "asc" ]],
                    action: function () {
                        $('#taxRatesList').DataTable().ajax.reload();
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
                    let draftRecord = templateObject.datatablerecords.get();
                    templateObject.datatablerecords.set(draftRecord);
                }).on('column-reorder', function () {

                }).on( 'length.dt', function ( e, settings, len ) {
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                });

                // $('#taxRatesList').DataTable().column( 0 ).visible( true );
                $('.fullScreenSpin').css('display','none');
            }, 0);

            var columns = $('#taxRatesList th');
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
            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $('.fullScreenSpin').css('display','none');
            // Meteor._reload.reload();
        });
      });

    }

    templateObject.getTaxRates();

$(document).on('click', '.table-remove', function() {
    event.stopPropagation();
    var targetID = $(event.target).closest('tr').attr('id'); // table row ID
    $('#selectDeleteLineID').val(targetID);
    $('#deleteLineModal').modal('toggle');
});

$('#taxRatesList tbody').on( 'click', 'tr .colName, tr .colDescription, tr .colRate', function () {
var listData = $(this).closest('tr').attr('id');
// var tabletaxtcode = $(event.target).closest("tr").find(".colTaxCode").text();
// var accountName = $(event.target).closest("tr").find(".colAccountName").text();
// let columnBalClass = $(event.target).attr('class');
 // let accountService = new AccountService();
if(listData){
  $('#add-tax-title').text('Edit Tax Rate');
  $('#edtTaxName').prop('readonly', true);
  if (listData !== '') {
    listData = Number(listData);
 //taxRateService.getOneTaxRate(listData).then(function (data) {

   var taxid = listData || '';
   var taxname = $(event.target).closest("tr").find(".colName").text() || '';
   var taxDesc = $(event.target).closest("tr").find(".colDescription").text() || '';
   var taxRate = $(event.target).closest("tr").find(".colRate").text().replace('%','') || '0';
   //data.fields.Rate || '';


  $('#edtTaxID').val(taxid);
  $('#edtTaxName').val(taxname);

  $('#edtTaxRate').val(taxRate);
  $('#edtTaxDesc').val(taxDesc);


  //});

  $(this).closest('tr').attr('data-target', '#myModal');
  $(this).closest('tr').attr('data-toggle', 'modal');

}

}

});

});


Template.taxRatesSettings.events({
    'click #btnNewInvoice':function(event){
        // FlowRouter.go('/invoicecard');
    },
    'click .chkDatatable' : function(event){
      var columns = $('#taxRatesList th');
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
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'taxRatesList'});
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
          var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'taxRatesList'});
          if (checkPrefDetails) {
            CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
              PrefGroup:'salesform',PrefName:'taxRatesList',published:true,
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
              PrefGroup:'salesform',PrefName:'taxRatesList',published:true,
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
      var datable = $('#taxRatesList').DataTable();
      var title = datable.column( columnDatanIndex ).header();
      $(title).html(columData);

    },
    'change .rngRange' : function(event){
      let range = $(event.target).val();
      $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

      let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
      let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
      var datable = $('#taxRatesList th');
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
      var columns = $('#taxRatesList th');

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
    jQuery('#taxRatesList_wrapper .dt-buttons .btntabletocsv').click();
     $('.fullScreenSpin').css('display','none');

  },
  'click .btnRefresh': function () {
    $('.fullScreenSpin').css('display','inline-block');
    sideBarService.getTaxRateVS1().then(function(dataReload) {
      addVS1Data('TTaxcodeVS1',JSON.stringify(dataReload)).then(function (datareturn) {
        location.reload(true);
      }).catch(function (err) {
        location.reload(true);
      });
      }).catch(function(err) {
        location.reload(true);
      });
  },
  'click .btnAddNewTaxRate': function () {
        $('#newTaxRate').css('display','block');

  },
  'click .btnCloseAddNewTax': function () {
        $('#newTaxRate').css('display','none');

  },
  'click .btnSaveDefaultTax': function () {
    let purchasetaxcode = $('input[name=optradioP]:checked').val()|| '';
    let salestaxcode = $('input[name=optradioS]:checked').val()|| '';

    Session.setPersistent('ERPTaxCodePurchaseInc', purchasetaxcode||'');
    Session.setPersistent('ERPTaxCodeSalesInc', salestaxcode||'');
    getVS1Data('vscloudlogininfo').then(function (dataObject) {
        if(dataObject.length == 0){
            swal({
                title: 'Default Tax Rate Successfully Changed',
                text: '',
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.value) {
                    Meteor._reload.reload();
                } else {
                  Meteor._reload.reload();
                }
            });
        }else{
            let loginDataArray = [];
            if(dataObject[0].EmployeeEmail === localStorage.getItem('mySession')){
                loginDataArray = dataObject[0].data;
                
                loginDataArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc = purchasetaxcode;
                loginDataArray.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc = salestaxcode;
                addLoginData(loginDataArray).then(function (datareturnCheck) {
                    swal({
                        title: 'Default Tax Rate Successfully Changed',
                        text: '',
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.value) {
                            Meteor._reload.reload();
                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }).catch(function (err) {
                  swal({
                      title: 'Default Tax Rate Successfully Changed',
                      text: '',
                      type: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'OK'
                  }).then((result) => {
                      if (result.value) {
                          Meteor._reload.reload();
                      } else {
                        Meteor._reload.reload();
                      }
                  });
                });

            }else{

                swal({
                    title: 'Default Tax Rate Successfully Changed',
                    text: '',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        Meteor._reload.reload();
                    } else {
                      Meteor._reload.reload();
                    }
                });
            }
        }
    }).catch(function (err) {
      swal({
          title: 'Default Tax Rate Successfully Changed',
          text: '',
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'OK'
      }).then((result) => {
          if (result.value) {
              Meteor._reload.reload();
          } else {
            Meteor._reload.reload();
          }
      });
    });

  },
  'keydown #edtTaxRate': function(event){
      if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
              // Allow: Ctrl+A, Command+A
             (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
              // Allow: home, end, left, right, down, up
             (event.keyCode >= 35 && event.keyCode <= 40)) {
                  // let it happen, don't do anything
                  return;
         }

        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
        (event.keyCode >= 96 && event.keyCode <= 105) ||
        event.keyCode == 8 || event.keyCode == 9 ||
        event.keyCode == 37 || event.keyCode == 39 ||
        event.keyCode == 46 || event.keyCode == 190) {
        } else {
            event.preventDefault();
        }
    },
    'click .btnSaveTaxRate': function () {
      $('.fullScreenSpin').css('display','inline-block');
      let taxRateService = new TaxRateService();
      let taxtID = $('#edtTaxID').val();
      let taxName = $('#edtTaxName').val();
      let taxDesc = $('#edtTaxDesc').val();
      let taxRate = parseFloat($('#edtTaxRate').val() / 100);
      let objDetails = '';
      if (taxName === ''){
      Bert.alert('<strong>WARNING:</strong> Tax Rate cannot be blank!', 'warning');
      $('.fullScreenSpin').css('display','none');
      e.preventDefault();
      }

      if(taxtID == ""){
        taxRateService.checkTaxRateByName(taxName).then(function (data) {
          taxtID = data.ttaxcode[0].Id;
          objDetails = {
             type: "TTaxcode",
             fields: {
                 ID: parseInt(taxtID),
                 Active: true,
                 // CodeName: taxName,
                 Description: taxDesc,
                 Rate: taxRate,
                 PublishOnVS1:true
             }
         };
          taxRateService.saveTaxRate(objDetails).then(function (objDetails) {
            sideBarService.getTaxRateVS1().then(function(dataReload) {
              addVS1Data('TTaxcodeVS1',JSON.stringify(dataReload)).then(function (datareturn) {
                Meteor._reload.reload();
              }).catch(function (err) {
                Meteor._reload.reload();
              });
              }).catch(function(err) {
              Meteor._reload.reload();
              });
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
              $('.fullScreenSpin').css('display','none');
          });
        }).catch(function (err) {
          objDetails = {
             type: "TTaxcode",
             fields: {
                 // Id: taxCodeId,
                 Active: true,
                 CodeName: taxName,
                 Description: taxDesc,
                 Rate: taxRate,
                 PublishOnVS1:true
             }
         };

         taxRateService.saveTaxRate(objDetails).then(function (objDetails) {
           sideBarService.getTaxRateVS1().then(function(dataReload) {
             addVS1Data('TTaxcodeVS1',JSON.stringify(dataReload)).then(function (datareturn) {
               Meteor._reload.reload();
             }).catch(function (err) {
               Meteor._reload.reload();
             });
             }).catch(function(err) {
             Meteor._reload.reload();
             });
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
             $('.fullScreenSpin').css('display','none');
         });
        });

     }else{
       objDetails = {
          type: "TTaxcode",
          fields: {
              ID: parseInt(taxtID),
              Active: true,
              CodeName: taxName,
              Description: taxDesc,
              Rate: taxRate,
              PublishOnVS1:true
          }
      };
      taxRateService.saveTaxRate(objDetails).then(function (objDetails) {
        sideBarService.getTaxRateVS1().then(function(dataReload) {
          addVS1Data('TTaxcodeVS1',JSON.stringify(dataReload)).then(function (datareturn) {
            Meteor._reload.reload();
          }).catch(function (err) {
            Meteor._reload.reload();
          });
          }).catch(function(err) {
          Meteor._reload.reload();
          });
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
          $('.fullScreenSpin').css('display','none');
      });
     }




    }
    ,
    'click .btnAddTaxRate': function () {
        $('#add-tax-title').text('Add New Tax Rate');
        $('#edtTaxID').val('');
        $('#edtTaxName').val('');
        $('#edtTaxName').prop('readonly', false);
        $('#edtTaxRate').val('');
        $('#edtTaxDesc').val('');
    },
    'click .btnDeleteTaxRate': function () {
      let taxRateService = new TaxRateService();
      let taxCodeId = $('#selectDeleteLineID').val();


      let objDetails = {
          type: "TTaxcode",
          fields: {
              Id: parseInt(taxCodeId),
              Active: false
          }
      };

      taxRateService.saveTaxRate(objDetails).then(function (objDetails) {
        sideBarService.getTaxRateVS1().then(function(dataReload) {
          addVS1Data('TTaxcodeVS1',JSON.stringify(dataReload)).then(function (datareturn) {
            Meteor._reload.reload();
          }).catch(function (err) {
            Meteor._reload.reload();
          });
          }).catch(function(err) {
          Meteor._reload.reload();
          });
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
          $('.fullScreenSpin').css('display','none');
      });

    },
    'click .btnBack':function(event){
      event.preventDefault();
      history.back(1);
    }





});

Template.taxRatesSettings.helpers({
  datatablerecords : () => {
     return Template.instance().datatablerecords.get().sort(function(a, b){
       if (a.codename == 'NA') {
     return 1;
         }
     else if (b.codename == 'NA') {
       return -1;
     }
   return (a.codename.toUpperCase() > b.codename.toUpperCase()) ? 1 : -1;
   // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
   });
  },
  tableheaderrecords: () => {
     return Template.instance().tableheaderrecords.get();
  },
  salesCloudPreferenceRec: () => {
  return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'taxRatesList'});
},
defaultpurchasetaxcode: () => {
   return Template.instance().defaultpurchasetaxcode.get();
},
defaultsaletaxcode: () => {
   return Template.instance().defaultsaletaxcode.get();
},
loggedCompany: () => {
  return localStorage.getItem('mySession') || '';
}
});


Template.registerHelper('equals', function (a, b) {
    return a === b;
});
