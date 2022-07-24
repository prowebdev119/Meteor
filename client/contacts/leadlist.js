import {ContactService} from "./contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {UtilityService} from "../utility-service";
import XLSX from 'xlsx';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.leadlist.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.selectedFile = new ReactiveVar();
});

Template.leadlist.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let contactService = new ContactService();

    let splashArrayLeadList = new Array();
    if(FlowRouter.current().queryParams.success){
       // $('.btnRefresh').addClass('btnRefreshAlert');
    }
    // Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblleadlist', function(error, result){
    //     if(error){

    //     }else{
    //         if(result){
    //             for (let i = 0; i < result.customFields.length; i++) {
    //                 let customcolumn = result.customFields;
    //                 let columData = customcolumn[i].label;
    //                 let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
    //                 let hiddenColumn = customcolumn[i].hidden;
    //                 let columnClass = columHeaderUpdate.split('.')[1];
    //                 let columnWidth = customcolumn[i].width;
    //                 // let columnindex = customcolumn[i].index + 1;
    //                 $("th."+columnClass+"").html(columData);
    //                 $("th."+columnClass+"").css('width',""+columnWidth+"px");

    //             }
    //         }

    //     }
    // });

    templateObject.getLeads = function () {
        getVS1Data('TLeads').then(function(dataObject) {
            if (dataObject.length == 0) {
              sideBarService.getAllLeads(initialBaseDataLoad, 0).then(function (data) {
                  addVS1Data('TLeads', JSON.stringify(data));
                  let lineItems = [];
                  let lineItemObj = {};
                  for (let i = 0; i < data.tleads.length; i++) {
                    
                      var dataListAllowance = [
                        data.tleads[i].fields.ID || '',
                        data.tleads[i].fields.EnteredByEmployee || '',
                        data.tleads[i].fields.MarketingContacts.fields.FirstName || '',
                        data.tleads[i].fields.MarketingContacts.fields.LastName || '',
                        data.tleads[i].fields.MarketingContacts.fields.Phone || '',
                        data.tleads[i].fields.MarketingContacts.fields.Mobile || '',
                        data.tleads[i].fields.MarketingContacts.fields.Email || '',
                        data.tleads[i].fields.Email || '',
                        data.tleads[i].fields.MarketingContacts.fields.Street || '',
                        data.tleads[i].fields.MarketingContacts.fields.Country || '',
                        data.tleads[i].fields.KeyStringFieldName || '',
                        data.tleads[i].fields.MarketingContacts.fields.Street2 || '',
                        data.tleads[i].fields.MarketingContacts.fields.Street3 || '',
                        data.tleads[i].fields.MarketingContacts.fields.Postcode || '',
                        data.tleads[i].fields.MarketingContacts.fields.AltPhone || '',
                        data.tleads[i].fields.MarketingContacts.fields.Suburb || '',
                        data.tleads[i].fields.MarketingContacts.fields.MarketingContactContacts.fields.ContactCity || '',
                        // '<td contenteditable="false" class="colDeletelead"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                      ];
    
                      splashArrayLeadList.push(dataListAllowance);
                  }
    
            
    
    
                 
                  setTimeout(function () {
                      $('#tblleadlist').DataTable({
    
                          data: splashArrayLeadList,
                          "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                          columnDefs: [
                                {
                                  className: "colLeadId hiddenColumn",
                                  "targets": [0]
                                },
                                {
                                  className: "colleadName",
                                  "targets": [1]
                                },  
                                {
                                  className: "colFirstName",
                                  "targets": [2]
                                }, 
                                {
                                  className: "colLastName",
                                  "targets": [3]
                                }, 
                                {
                                  className: "colPhone",
                                  "targets": [4]
                                },  
                                {
                                  className: "colMobile",
                                  "targets": [5]
                                },  
                                {
                                  className: "colEmail",
                                  "targets": [6]
                                }, 
                                {
                                  className: "colDepartment",
                                   "targets": [7]
                                }, 
                                {
                                  className: "colCountry hiddenColumn",
                                  "targets": [8]
                                },  
                                {
                                  className: "colCustFld1 hiddenColumn",
                                  "targets": [9]
                                },  
                                {
                                  className: "colCustFld2 hiddenColumn",
                                  "targets": [10]
                                }, 
                                {
                                  className: "colAddress",
                                  "targets": [11]
                                }, 
                                {
                                  className: "colSuburb",
                                  "targets": [12]
                                },  
                                {
                                    className: "colCity",
                                    "targets": [13]
                                }, 
                                // {
                                //     className: "colDeletelead",
                                //     "orderable": false,
                                //     "targets": -1
                                // }
                          ],
                          select: true,
                          destroy: true,
                          colReorder: true,
                          pageLength: initialDatatableLoad,
                          lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                          info: true,
                          responsive: true,
                          "order": [[0, "asc"]],
                          action: function () {
                              $('#tblleadlist').DataTable().ajax.reload();
                          },
                          "fnDrawCallback": function (oSettings) {
                              $('.paginate_button.page-item').removeClass('disabled');
                              $('#tblleadlist_ellipsis').addClass('disabled');
                              if (oSettings._iDisplayLength == -1) {
                                  if (oSettings.fnRecordsDisplay() > 150) {
    
                                  }
                              } else {
    
                              }
                              if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                                  $('.paginate_button.page-item.next').addClass('disabled');
                              }
    
                              $('.paginate_button.next:not(.disabled)', this.api().table().container())
                                  .on('click', function () {
                                      $('.fullScreenSpin').css('display', 'inline-block');
                                      var splashArrayLeadListDupp = new Array();
                                      let dataLenght = oSettings._iDisplayLength;
                                      let customerSearch = $('#tblleadlist_filter input').val();
    
                                      sideBarService.getAllLeads(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                        for (let i = 0; i < data.tleads.length; i++) {
                    
                                            var dataListAllowance = [
                                              data.tleads[i].fields.ID || '',
                                              data.tleads[i].fields.EnteredByEmployee || '',
                                              data.tleads[i].fields.MarketingContacts.fields.FirstName || '',
                                              data.tleads[i].fields.MarketingContacts.fields.LastName || '',
                                              data.tleads[i].fields.MarketingContacts.fields.Phone || '',
                                              data.tleads[i].fields.MarketingContacts.fields.Mobile || '',
                                              data.tleads[i].fields.MarketingContacts.fields.Email || '',
                                              data.tleads[i].fields.Email || '',
                                              data.tleads[i].fields.MarketingContacts.fields.Street || '',
                                              data.tleads[i].fields.MarketingContacts.fields.Country || '',
                                              data.tleads[i].fields.KeyStringFieldName || '',
                                              data.tleads[i].fields.MarketingContacts.fields.Street2 || '',
                                              data.tleads[i].fields.MarketingContacts.fields.Street3 || '',
                                              data.tleads[i].fields.MarketingContacts.fields.Postcode || '',
                                              data.tleads[i].fields.MarketingContacts.fields.AltPhone || '',
                                              data.tleads[i].fields.MarketingContacts.fields.Suburb || '',
                                              data.tleads[i].fields.MarketingContacts.fields.MarketingContactContacts.fields.ContactCity || '',
                                            //   '<td contenteditable="false" class="colDeletelead"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                            ];
                          
                                            splashArrayLeadList.push(dataListAllowance);
                                        }
    
                                                  let uniqueChars = [...new Set(splashArrayLeadList)];
                                                  var datatable = $('##tblleadlist').DataTable();
                                                  datatable.clear();
                                                  datatable.rows.add(uniqueChars);
                                                  datatable.draw(false);
                                                  setTimeout(function () {
                                                    $("#tblleadlist").dataTable().fnPageChange('last');
                                                  }, 400);
    
                                                  $('.fullScreenSpin').css('display', 'none');
    
    
                                      }).catch(function (err) {
                                          $('.fullScreenSpin').css('display', 'none');
                                      });
    
                                  });
                              setTimeout(function () {
                                  MakeNegative();
                              }, 100);
                          },
                          "fnInitComplete": function () {
                            
                             // $("<button class='btn btn-primary btnAddNewLeads' data-dismiss='modal' data-toggle='modal' data-target='#' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblleadlist_filter");
                              $("<button class='btn btn-primary btnRefreshLeads' type='button' id='btnRefreshLeads' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblleadlist_filter");
    
                          }
    
                      }).on('page', function () {
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
    
                      }).on('column-reorder', function () {
    
                      }).on('length.dt', function (e, settings, len) {
                        //$('.fullScreenSpin').css('display', 'inline-block');
                        let dataLenght = settings._iDisplayLength;
                        splashArrayLeadList = [];
                        if (dataLenght == -1) {
                          $('.fullScreenSpin').css('display', 'none');
    
                        } else {
                            if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                                $('.fullScreenSpin').css('display', 'none');
                            } else {
                                sideBarService.getAllLeads(dataLenght, 0).then(function (dataNonBo) {
    
                                    addVS1Data('TLeads', JSON.stringify(dataNonBo)).then(function (datareturn) {
                                        templateObject.resetData(dataNonBo);
                                        $('.fullScreenSpin').css('display', 'none');
                                    }).catch(function (err) {
                                        $('.fullScreenSpin').css('display', 'none');
                                    });
                                }).catch(function (err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }
                        }
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
                      });
    
    
                  }, 0);
    
                  $('div.dataTables_filter input').addClass('form-control form-control-sm');
    
                  $('.fullScreenSpin').css('display', 'none');
              }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
              });
            }else{
    
              let data = JSON.parse(dataObject[0].data);
    
              let useData = data;         
              let lineItems = [];
              let lineItemObj = {};
            
              for (let i = 0; i < data.tleads.length; i++) {
                   
                var dataListAllowance = [
                
                  data.tleads[i].fields.ID || '',
                  data.tleads[i].fields.EnteredByEmployee || '',
                  data.tleads[i].fields.MarketingContacts.fields.FirstName || '',
                  data.tleads[i].fields.MarketingContacts.fields.LastName || '',
                  data.tleads[i].fields.MarketingContacts.fields.Phone || '',
                  data.tleads[i].fields.MarketingContacts.fields.Mobile || '',
                  data.tleads[i].fields.Email || '',
                  data.tleads[i].fields.MarketingContacts.fields.Street || '',
                  data.tleads[i].fields.MarketingContacts.fields.Country || '',
                  data.tleads[i].fields.KeyStringFieldName || '',
                  data.tleads[i].fields.MarketingContacts.fields.Street2 || '',
                  data.tleads[i].fields.MarketingContacts.fields.Street3 || '' +  data.tleads[i].fields.MarketingContacts.fields.Postcode || '',          
                  data.tleads[i].fields.MarketingContacts.fields.Suburb || '',
                  data.tleads[i].fields.MarketingContacts.fields.city || '',
                //   '<td contenteditable="false" class="colDeletelead"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
              
                 ];

                splashArrayLeadList.push(dataListAllowance);
            }
    
              
        
              setTimeout(function () {
                  $('#tblleadlist').DataTable({
    
                      data: splashArrayLeadList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [
                        {
                          className: "colLeadId hiddenColumn",
                          "targets": [0]
                        },
                        {
                          className: "colleadName",
                          "targets": [1]
                        },  
                        {
                          className: "colFirstName",
                          "targets": [2]
                        }, 
                        {
                          className: "colLastName",
                          "targets": [3]
                        }, 
                        {
                          className: "colPhone",
                          "targets": [4]
                        },  
                        {
                          className: "colMobile",
                          "targets": [5]
                        },  
                        {
                          className: "colEmail",
                          "targets": [6]
                        }, 
                        {
                          className: "colDepartment",
                           "targets": [7]
                        }, 
                        {
                          className: "colCountry hiddenColumn",
                          "targets": [8]
                        },  
                        {
                          className: "colCustFld1 hiddenColumn",
                          "targets": [9]
                        },  
                        {
                          className: "colCustFld2 hiddenColumn",
                          "targets": [10]
                        }, 
                        {
                          className: "colAddress",
                          "targets": [11]
                        }, 
                        {
                          className: "colSuburb",
                          "targets": [12]
                        },  
                        {
                            className: "colCity",
                            "targets": [13]
                        }, 
                        // {
                        //     className: "colDeletelead",
                        //     "orderable": false,
                        //     "targets": -1
                        // }
                      ],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      pageLength: initialDatatableLoad,
                      lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                      info: true,
                      responsive: true,
                      "order": [[0, "asc"]],
                      action: function () {
                          $('#tblleadlist').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblleadlist_ellipsis').addClass('disabled');
                          if (oSettings._iDisplayLength == -1) {
                              if (oSettings.fnRecordsDisplay() > 150) {
    
                              }
                          } else {
    
                          }
                          if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }
    
                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                              .on('click', function () {
                                  $('.fullScreenSpin').css('display', 'inline-block');
                                  var splashArrayLeadListDupp = new Array();
                                  let dataLenght = oSettings._iDisplayLength;
                                  let customerSearch = $('#tblleadlist_filter input').val();
    
                                  sideBarService.getAllLeads(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                       
                                                for (let i = 0; i < data.tleads.length; i++) {
                                                        
                                                    var dataListAllowance = [
                                                        data.tleads[i].fields.ID || '',
                                                        data.tleads[i].fields.EnteredByEmployee || '',
                                                        data.tleads[i].fields.MarketingContacts.fields.FirstName || '',
                                                        data.tleads[i].fields.MarketingContacts.fields.LastName || '',
                                                        data.tleads[i].fields.MarketingContacts.fields.Phone || '',
                                                        data.tleads[i].fields.MarketingContacts.fields.Mobile || '',
                                                        data.tleads[i].fields.Email || '',
                                                        data.tleads[i].fields.MarketingContacts.fields.Street || '',
                                                        data.tleads[i].fields.MarketingContacts.fields.Country || '',
                                                        data.tleads[i].fields.KeyStringFieldName || '',
                                                        data.tleads[i].fields.MarketingContacts.fields.Street2 || '',
                                                        data.tleads[i].fields.MarketingContacts.fields.Street3 || '' +  data.tleads[i].fields.MarketingContacts.fields.Postcode || '',          
                                                        data.tleads[i].fields.MarketingContacts.fields.Suburb || '',
                                                        data.tleads[i].fields.MarketingContacts.fields.city || '',
                                                        // '<td contenteditable="false" class="colDeletelead"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                                    ]
                                                    splashArrayLeadList.push(dataListAllowance);
                                                }
                                        
                                              let uniqueChars = [...new Set(splashArrayLeadList)];
                                              var datatable = $('#tblleadlist').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblleadlist").dataTable().fnPageChange('last');
                                              }, 400);
    
                                              $('.fullScreenSpin').css('display', 'none');
    
    
                                  }).catch(function (err) {
                                      $('.fullScreenSpin').css('display', 'none');
                                  });
    
                              });
                         
                      },
                      "fnInitComplete": function () {
                         // $("<button class='btn btn-primary btnAddNewLeads' data-dismiss='modal' data-toggle='modal' data-target='#' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblleadlist_filter");
                          $("<button class='btn btn-primary btnRefreshLeads' type='button' id='btnRefreshLeads' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblleadlist_filter");
    
                      }
    
                  }).on('page', function () {
                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
    
                  }).on('column-reorder', function () {
    
                  }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArrayLeadList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');
    
                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getAllLeads(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TLeads', JSON.stringify(dataNonBo)).then(function (datareturn) {
                                    templateObject.resetData(dataNonBo);
                                    $('.fullScreenSpin').css('display', 'none');
                                }).catch(function (err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                    }
                    
                  });
    
    
              }, 0);
    
              $('div.dataTables_filter input').addClass('form-control form-control-sm');
              $('.fullScreenSpin').css('display', 'none');
    
            }
        }).catch(function(err) {
        
            sideBarService.getAllLeads(initialBaseDataLoad, 0).then(function (data) {
              addVS1Data('TLeads', JSON.stringify(data));
              let lineItems = [];
              let lineItemObj = {};
              for (let i = 0; i < data.tleads.length; i++) {
                                                        
                var dataListAllowance = [
                    data.tleads[i].fields.ID || '',
                    data.tleads[i].fields.EnteredByEmployee || '',
                    data.tleads[i].fields.MarketingContacts.fields.FirstName || '',
                    data.tleads[i].fields.MarketingContacts.fields.LastName || '',
                    data.tleads[i].fields.MarketingContacts.fields.Phone || '',
                    data.tleads[i].fields.MarketingContacts.fields.Mobile || '',
                    data.tleads[i].fields.Email || '',
                    data.tleads[i].fields.MarketingContacts.fields.Street || '',
                    data.tleads[i].fields.MarketingContacts.fields.Country || '',
                    data.tleads[i].fields.KeyStringFieldName || '',
                    data.tleads[i].fields.MarketingContacts.fields.Street2 || '',
                    data.tleads[i].fields.MarketingContacts.fields.Street3 || '' +  data.tleads[i].fields.MarketingContacts.fields.Postcode || '',          
                    data.tleads[i].fields.MarketingContacts.fields.Suburb || '',
                    data.tleads[i].fields.MarketingContacts.fields.city || '',
                    // '<td contenteditable="false" class="colDeletelead"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                ];

                splashArrayLeadList.push(dataListAllowance);
            }
      
              setTimeout(function () {
                  $('#tblleadlist').DataTable({
    
                      data: splashArrayLeadList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      columnDefs: [
                        {
                          className: "colLeadId hiddenColumn",
                          "targets": [0]
                        },
                        {
                          className: "colleadName",
                          "targets": [1]
                        },  
                        {
                          className: "colFirstName",
                          "targets": [2]
                        }, 
                        {
                          className: "colLastName",
                          "targets": [3]
                        }, 
                        {
                          className: "colPhone",
                          "targets": [4]
                        },  
                        {
                          className: "colMobile",
                          "targets": [5]
                        },  
                        {
                          className: "colEmail",
                          "targets": [6]
                        }, 
                        {
                          className: "colDepartment",
                           "targets": [7]
                        }, 
                        {
                          className: "colCountry hiddenColumn",
                          "targets": [8]
                        },  
                        {
                          className: "colCustFld1 hiddenColumn",
                          "targets": [9]
                        },  
                        {
                          className: "colCustFld2 hiddenColumn",
                          "targets": [10]
                        }, 
                        {
                          className: "colAddress",
                          "targets": [11]
                        }, 
                        {
                          className: "colSuburb",
                          "targets": [12]
                        },  
                        {
                            className: "colCity",
                            "targets": [13]
                        }, 
                        // {
                        //     className: "colDeletelead",
                        //     "orderable": false,
                        //     "targets": -1
                        // }
                      ], 
                      select: true,
                      destroy: true,
                      colReorder: true,
                      pageLength: initialDatatableLoad,
                      lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                      info: true,
                      responsive: true,
                      "order": [[0, "asc"]],
                      action: function () {
                          $('#tblleadlist').DataTable().ajax.reload();
                      },
                      "fnDrawCallback": function (oSettings) {
                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblleadlist_ellipsis').addClass('disabled');
                          if (oSettings._iDisplayLength == -1) {
                              if (oSettings.fnRecordsDisplay() > 150) {
    
                              }
                          } else {
    
                          }
                          if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }
    
                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                              .on('click', function () {
                                  $('.fullScreenSpin').css('display', 'inline-block');
                                  var splashArrayLeadListDupp = new Array();
                                  let dataLenght = oSettings._iDisplayLength;
                                  let customerSearch = $('#tblleadlist_filter input').val();
    
                                  sideBarService.getAllLeads(initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function (data) {
    
                                    for (let i = 0; i < data.tleads.length; i++) {
                                                        
                                        var dataListAllowance = [
                                            data.tleads[i].fields.ID || '',
                                            data.tleads[i].fields.EnteredByEmployee || '',
                                            data.tleads[i].fields.MarketingContacts.fields.FirstName || '',
                                            data.tleads[i].fields.MarketingContacts.fields.LastName || '',
                                            data.tleads[i].fields.MarketingContacts.fields.Phone || '',
                                            data.tleads[i].fields.MarketingContacts.fields.Mobile || '',
                                            data.tleads[i].fields.Email || '',
                                            data.tleads[i].fields.MarketingContacts.fields.Street || '',
                                            data.tleads[i].fields.MarketingContacts.fields.Country || '',
                                            data.tleads[i].fields.KeyStringFieldName || '',
                                            data.tleads[i].fields.MarketingContacts.fields.Street2 || '',
                                            data.tleads[i].fields.MarketingContacts.fields.Street3 || '' +  data.tleads[i].fields.MarketingContacts.fields.Postcode || '',          
                                            data.tleads[i].fields.MarketingContacts.fields.Suburb || '',
                                            data.tleads[i].fields.MarketingContacts.fields.city || '',
                                            // '<td contenteditable="false" class="colDeletelead"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                                        ];
                        
                                        splashArrayLeadList.push(dataListAllowance);
                                    }
    
                                         let uniqueChars = [...new Set(splashArrayLeadList)];
                                         var datatable = $('#tblleadlist').DataTable();
                                              datatable.clear();
                                              datatable.rows.add(uniqueChars);
                                              datatable.draw(false);
                                              setTimeout(function () {
                                                $("#tblleadlist").dataTable().fnPageChange('last');
                                              }, 400);
    
                                              $('.fullScreenSpin').css('display', 'none');
    
    
                                  }).catch(function (err) {
                                      $('.fullScreenSpin').css('display', 'none');
                                  });
    
                              });
                         
                      },
                      "fnInitComplete": function () {
                         // $("<button class='btn btn-primary btnAddNewLeads' data-dismiss='modal' data-toggle='modal' data-target='#newPayCalendarModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblleadlist_filter");
                          $("<button class='btn btn-primary btnRefreshLeads' type='button' id='btnRefreshLeads' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblleadlist_filter");
    
                      }
    
                  }).on('page', function () {
                    
    
                  }).on('column-reorder', function () {
    
                  }).on('length.dt', function (e, settings, len) {
                    //$('.fullScreenSpin').css('display', 'inline-block');
                    let dataLenght = settings._iDisplayLength;
                    splashArrayLeadList = [];
                    if (dataLenght == -1) {
                      $('.fullScreenSpin').css('display', 'none');
    
                    } else {
                        if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                            $('.fullScreenSpin').css('display', 'none');
                        } else {
                            sideBarService.getAllLeads(dataLenght, 0).then(function (dataNonBo) {
    
                                addVS1Data('TLeads', JSON.stringify(dataNonBo)).then(function (datareturn) {
                                    templateObject.resetData(dataNonBo);
                                    $('.fullScreenSpin').css('display', 'none');
                                }).catch(function (err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                    }
                     
                  });
    
    
              }, 0);
    
              $('div.dataTables_filter input').addClass('form-control form-control-sm');
    
              $('.fullScreenSpin').css('display', 'none');
          }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
          });
        }); 
    }

    templateObject.getLeads();




});


Template.leadlist.events({
 
    
    'keyup #tblleadlist_filter input': function (event) {
          if($(event.target).val() != ''){
            $(".btnRefreshLeads").addClass('btnSearchAlert');
          }else{
            $(".btnRefreshLeads").removeClass('btnSearchAlert');
          }
          if (event.keyCode == 13) {
             $(".btnRefreshLeads").trigger("click");
          }
      },

    'click .btnRefreshLeads':function(event){
         let templateObject = Template.instance();
         let utilityService = new UtilityService();
         let tableProductList;
         const dataTableList = [];
         var splashArrayInvoiceList = new Array();
         const lineExtaSellItems = [];
         $('.fullScreenSpin').css('display', 'inline-block');
         let dataSearchName = $('#tblleadlist_filter input').val();
         if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getLeadByName(dataSearchName).then(function (data) {
                $(".btnRefreshLeads").removeClass('btnSearchAlert');
                let lineItems = [];
                let lineItemObj = {};
                if (data.tleads.length > 0) {
                    for(let i=0; i< data.tleads.length; i++){
                    var dataList = {
                        id: data.tleads[i].fields.ID || '',
                        EnteredByEmployee: data.tleads[i].fields.EnteredByEmployee || '',
                        first:data.tleads[i].fields.MarketingContacts.fields.FirstName || '',
                        last: data.tleads[i].fields.MarketingContacts.fields.LastName || '',
                        phone:data.tleads[i].fields.MarketingContacts.fields.Phone || '',
                        mobile: data.tleads[i].fields.MarketingContacts.fields.Mobile || '',
                        email: data.tleads[i].fields.Email || '',
                        street: data.tleads[i].fields.MarketingContacts.fields.Street || '',
                        country: data.tleads[i].fields.MarketingContacts.fields.Country || '',
                        cust1:data.tleads[i].fields.KeyStringFieldName || '',
                        cust2: data.tleads[i].fields.MarketingContacts.fields.Street2 || '',
                        address:data.tleads[i].fields.MarketingContacts.fields.Street3 || '' +  data.tleads[i].fields.MarketingContacts.fields.Postcode || '',          
                        stub:data.tleads[i].fields.MarketingContacts.fields.Suburb || '',
                        city:data.tleads[i].fields.MarketingContacts.fields.city || '',
                        // deletedata:'<td contenteditable="false" class="colDeletelead"><span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                    };

                    if(data.tleads[i].fields.EnteredByEmployee.replace(/\s/g, '') != ''){
                        dataTableList.push(dataList);
                    }
                    //}
                }

                    templateObject.datatablerecords.set(dataTableList);

                    let item = templateObject.datatablerecords.get();
                    $('.fullScreenSpin').css('display', 'none');
                    if (dataTableList) {
                        var datatable = $('#tblleadlist').DataTable();
                        $("#tblleadlist > tbody").empty();
                        for (let x = 0; x < item.length; x++) {
                            $("#tblleadlist > tbody").append(
                                ' <tr class="dnd-moved" id="' + item[x].id + '" style="cursor: pointer;">' +
                                '<td contenteditable="false" class="colLeadId hiddenColumn">' + item[x].id + '</td>' +
                                '<td contenteditable="false" class="colleadName" >' + item[x].EnteredByEmployee + '</td>' +
                                '<td contenteditable="false" class="colFirstName" >' + item[x].first + '</td>' +
                                '<td contenteditable="false" class="colLastName">' + item[x].last + '</td>' +
                                '<td contenteditable="false" class="colPhone">' + item[x].phone + '</td>' +
                                '<td contenteditable="false" class="colMobile">' + item[x].mobile + '</td>' +
                                '<td contenteditable="false" class="colEmail">' + item[x].email + '</td>' +
                                '<td contenteditable="false" class="colDepartment">' + item[x].street + '</td>' +
                                '<td contenteditable="false" class="colCountry hiddenColumn">' + item[x].country + '</td>' +
                                '<td contenteditable="false" class="colCustFld1 hiddenColumn">' + item[x].cust1 + '</td>' +
                                '<td contenteditable="false" class="colCustFld2 hiddenColumn">' + item[x].cust2 + '</td>' +
                                '<td contenteditable="false" class="colCustFld2 colAddress">' + item[x].address + '</td>' +
                                '<td contenteditable="false" class="colSuburb">' + item[x].stub + '</td>' +
                                '<td contenteditable="false" class="colCity">' + item[x].city + '</td>' +
                                
                                '</tr>');

                        }
                        $('.dataTables_info').html('Showing 1 to ' + data.tleads.length + ' of ' + data.tleads.length + ' entries');

                    }
                } else {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Question',
                        text: "Leads does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            FlowRouter.go('/leadlist');
                        } else if (result.dismiss === 'cancel') {
                            //$('#productListModal').modal('toggle');
                        }
                    });
                }

            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
          $(".btnRefresh").trigger("click");
        }
    },

    'click .resetTable' : function(event){
        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblEmployeelist'});
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
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblleadlist'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'salesform',PrefName:'tblleadlist',published:true,
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
                                            PrefGroup:'salesform',PrefName:'tblEmployeelist',published:true,
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
        $('#myModal2').modal('toggle');
    },
    'blur .divcolumn' : function(event){
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#tblleadlist').DataTable();
        var title = datable.column( columnDatanIndex ).header();
        $(title).html(columData);

    },
    'change .rngRange' : function(event){
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblleadlist th');
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
        var columns = $('#tblleadlist th');

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
        jQuery('#tblleadlist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');

    },
    'click .exportbtnExcel': function () {
        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblleadlist_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display','none');
    },
    'click .btnRefresh': function () {

        $('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        sideBarService.getAllAppointmentPredList().then(function (data) {
            addVS1Data('TAppointmentPreferences', JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function (err) {
            
        });
        sideBarService.getAllEmployees(initialBaseDataLoad,0).then(function(data) {
            addVS1Data('TLeads',JSON.stringify(data)).then(function (datareturn) {
                window.open('/leadlist','_self');
            }).catch(function (err) {
                window.open('/leadlist','_self');
            });
        }).catch(function(err) {
            window.open('/leadlist','_self');
        });
    },
    'click .printConfirm' : function(event){

        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblleadlist_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display','none');
    },
    'click .templateDownload': function () {
        let utilityService = new UtilityService();
        let rows =[];
        const filename = 'SampleLeads'+'.csv';
        rows[0]= ['First Name', 'Last Name', 'Phone','Mobile', 'Email','Skype', 'Street', 'City/Suburb', 'State', 'Post Code', 'Country', 'Gender'];
        rows[1]= ['John', 'Smith', '9995551213','9995551213', 'johnsmith@email.com','johnsmith', '123 Main Street', 'Brooklyn', 'New York', '1234', 'United States', 'M'];
        rows[1]= ['Jane', 'Smith', '9995551213','9995551213', 'janesmith@email.com','janesmith', '123 Main Street', 'Brooklyn', 'New York', '1234', 'United States', 'F'];
        utilityService.exportToCsv(rows, filename, 'csv');
    },
    'click .templateDownloadXLSX': function (e) {

        e.preventDefault();  //stop the browser from following
        window.location.href = 'sample_imports/SampleLead.xlsx';
    },
    'click .btnUploadFile':function(event){
        $('#attachment-upload').val('');
        $('.file-name').text('');
        //$(".btnImport").removeAttr("disabled");
        $('#attachment-upload').trigger('click');

    },
    'change #attachment-upload': function (e) {
        let templateObj = Template.instance();
        var filename = $('#attachment-upload')[0].files[0]['name'];
        var fileExtension = filename.split('.').pop().toLowerCase();
        var validExtensions = ["csv","txt","xlsx"];
        var validCSVExtensions = ["csv","txt"];
        var validExcelExtensions = ["xlsx","xls"];

        if (validExtensions.indexOf(fileExtension) == -1) {
            swal('Invalid Format', 'formats allowed are :' + validExtensions.join(', '), 'error');
            $('.file-name').text('');
            $(".btnImport").Attr("disabled");
        }else if(validCSVExtensions.indexOf(fileExtension) != -1){

            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            templateObj.selectedFile.set(selectedFile);
            if($('.file-name').text() != ""){
                $(".btnImport").removeAttr("disabled");
            }else{
                $(".btnImport").Attr("disabled");
            }
        }else if(fileExtension == 'xlsx'){
            $('.file-name').text(filename);
            let selectedFile = event.target.files[0];
            var oFileIn;
            var oFile = selectedFile;
            var sFilename = oFile.name;
            // Create A File Reader HTML5
            var reader = new FileReader();

            // Ready The Event For When A File Gets Selected
            reader.onload = function (e) {
                var data = e.target.result;
                data = new Uint8Array(data);
                var workbook = XLSX.read(data, {type: 'array'});

                var result = {};
                workbook.SheetNames.forEach(function (sheetName) {
                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
                    var sCSV = XLSX.utils.make_csv(workbook.Sheets[sheetName]);
                    templateObj.selectedFile.set(sCSV);

                    if (roa.length) result[sheetName] = roa;
                });
                // see the result, caution: it works after reader event is done.

            };
            reader.readAsArrayBuffer(oFile);

            if($('.file-name').text() != ""){
                $(".btnImport").removeAttr("disabled");
            }else{
                $(".btnImport").Attr("disabled");
            }

        }



    },
    'click .btnImport' : function () {
        $('.fullScreenSpin').css('display','inline-block');
        let templateObject = Template.instance();
        let contactService = new ContactService();
        let objDetails;
        var saledateTime = new Date();
        //let empStartDate = new Date().format("YYYY-MM-DD");
        var empStartDate = moment(saledateTime).format("YYYY-MM-DD");
        Papa.parse(templateObject.selectedFile.get(), {
            complete: function(results) {

                if(results.data.length > 0){
                    if( (results.data[0][0] == "First Name")
                       && (results.data[0][1] == "Last Name") && (results.data[0][2] == "Phone")
                       && (results.data[0][3] == "Mobile") && (results.data[0][4] == "Email")
                       && (results.data[0][5] == "Skype") && (results.data[0][6] == "Street")
                       && ((results.data[0][7] == "Street2")|| (results.data[0][7] == "City/Suburb")) && (results.data[0][8] == "State")
                       && (results.data[0][9] == "Post Code") && (results.data[0][10] == "Country")
                       && (results.data[0][11] == "Gender")) {

                        let dataLength = results.data.length * 500;
                        setTimeout(function(){
                            // $('#importModal').modal('toggle');
                            //Meteor._reload.reload();
                            window.open('/leadlist?success=true','_self');
                        },parseInt(dataLength));

                        for (let i = 0; i < results.data.length -1; i++) {
                            objDetails = {
                                type: "TLeads",
                                fields:
                                {
                                    FirstName: results.data[i+1][0],
                                    LastName: results.data[i+1][1],
                                    Phone: results.data[i+1][2],
                                    Mobile: results.data[i+1][3],
                                    DateStarted: empStartDate,
                                    DOB: empStartDate,
                                    Sex: results.data[i+1][11]||"F",
                                    Email: results.data[i+1][4],
                                    SkypeName: results.data[i+1][5],
                                    Street: results.data[i+1][6],
                                    Street2: results.data[i+1][7],
                                    Suburb: results.data[i+1][7],
                                    State: results.data[i+1][8],
                                    PostCode:results.data[i+1][9],
                                    Country:results.data[i+1][10]

                            
                                }
                            };
                            if(results.data[i+1][1]){
                                if(results.data[i+1][1] !== "") {
                                    contactService.saveEmployee(objDetails).then(function (data) {
                                        ///$('.fullScreenSpin').css('display','none');
                                        //Meteor._reload.reload();
                                    }).catch(function (err) {
                                        //$('.fullScreenSpin').css('display','none');
                                        swal({ title: 'Oooops...', text: err, type: 'error', showCancelButton: false, confirmButtonText: 'Try Again' }).then((result) => { if (result.value) { Meteor._reload.reload(); } else if (result.dismiss === 'cancel') {}});
                                    });
                                }
                            }
                        }
                    }else{
                        $('.fullScreenSpin').css('display','none');
                        swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                    }
                }else{
                    $('.fullScreenSpin').css('display','none');
                    swal('Invalid Data Mapping fields ', 'Please check that you are importing the correct file with the correct column headers.', 'error');
                }

            }
        });
    }


});

Template.leadlist.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.leadname == 'NA') {
                return 1;
            }
            else if (b.leadname == 'NA') {
                return -1;
            }
            return (a.leadname.toUpperCase() > b.leadname.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblleadlist'});
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
