import {
    TaxRateService
} from "../settings/settings-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    SideBarService
} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
Template.clienttypepopup.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.deptrecords = new ReactiveVar();



});

Template.clienttypepopup.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    const dataTableList = [];
    const tableHeaderList = [];
    const deptrecords = [];
    let deptprodlineItems = [];
    var splashArrayClientTypeList = new Array();
    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'clienttypeList', function(error, result) {
        if (error) {

        } else {
            if (result) {
                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;

                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    templateObject.getClientTypeData = function() {
        getVS1Data('TClientType').then(function(dataObject) {
            if (dataObject.length == 0) {
                taxRateService.getClientType().then(function(data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    let setISCOD = false;
                    for (let i = 0; i < data.tclienttype.length; i++) {

                        // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                        // var dataList = {
                        //     id: data.tclienttype[i].Id || '',
                        //     typeName: data.tclienttype[i].TypeName || '-',
                        //     description: data.tclienttype[i].TypeDescription || '-',
                        //     status: data.tclienttype[i].Active || 'false',
                        //
                        // };

                        //dataTableList.push(dataList);
                        var dataList = [
                          data.tclienttype[i].Id || '',
                          data.tclienttype[i].TypeName || '',
                          data.tclienttype[i].TypeDescription || '',
                          '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                        ];
                        splashArrayClientTypeList.push(dataList);
                        //}
                    }


                    templateObject.datatablerecords.set(dataTableList);



                    $('.fullScreenSpin').css('display', 'none');
                    setTimeout(function() {
                        $('#clienttypeList').DataTable({
                            data: splashArrayClientTypeList,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            paging: true,
                            "aaSorting": [],
                            "orderMulti": true,
                            columnDefs: [
                                {"orderable": false,  "targets": -1},
                                { className: "colClientTypeID hiddenColumn", "targets": [0] },
                                { className: "colClientTypeName pointer", "targets": [1] },
                                { className: "colDescription", "targets": [2] },
                                { className: "colDeleteCustomerType", "targets": [3] }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "fnInitComplete": function () {
                                $("<button class='btn btn-primary btnAddNewClientType' data-dismiss='modal' data-toggle='modal' data-target='#myModalClientType' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#clienttypeList_filter");
                                $("<button class='btn btn-primary btnRefreshClientType' type='button' id='btnRefreshClientType' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#clienttypeList_filter");
                            },

                        }).on('page', function() {
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                            let draftRecord = templateObject.datatablerecords.get();
                            templateObject.datatablerecords.set(draftRecord);
                        }).on('column-reorder', function() {

                        }).on('length.dt', function(e, settings, len) {
                            setTimeout(function() {
                                MakeNegative();
                            }, 100);
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    }, 10);



                    templateObject.tableheaderrecords.set(tableHeaderList);
                    $('div.dataTables_filter input').addClass('form-control form-control-sm');

                }).catch(function(err) {
                    // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                    $('.fullScreenSpin').css('display', 'none');
                    // Meteor._reload.reload();
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tclienttype;

                for (let i = 0; i < useData.length; i++) {
                    // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                    // var dataList = {
                    //     id: useData[i].fields.ID || '',
                    //     typeName: useData[i].fields.TypeName || '-',
                    //     description: useData[i].fields.TypeDescription || '-',
                    //     status: useData[i].fields.Active || 'false',
                    // };

                    var dataList = [
                      useData[i].fields.ID || '',
                      useData[i].fields.TypeName || '',
                      useData[i].fields.TypeDescription || '',
                      '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                    ];
                    splashArrayClientTypeList.push(dataList);

                    //dataTableList.push(dataList);
                    //}
                }


                templateObject.datatablerecords.set(dataTableList);


                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function() {
                    $('#clienttypeList').DataTable({
                        data: splashArrayClientTypeList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [
                            {"orderable": false,  "targets": -1},
                            { className: "colClientTypeID hiddenColumn", "targets": [0] },
                            { className: "colClientTypeName pointer", "targets": [1] },
                            { className: "colDescription", "targets": [2] },
                            { className: "colDeleteCustomerType", "targets": [3] }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnAddNewClientType' data-dismiss='modal' data-toggle='modal' data-target='#myModalClientType' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#clienttypeList_filter");
                            $("<button class='btn btn-primary btnRefreshClientType' type='button' id='btnRefreshClientType' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#clienttypeList_filter");
                        },

                    }).on('page', function() {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function() {

                    }).on('length.dt', function(e, settings, len) {
                        setTimeout(function() {
                            MakeNegative();
                        }, 100);
                    });
                    $('.fullScreenSpin').css('display', 'none');
                }, 10);

                templateObject.tableheaderrecords.set(tableHeaderList);
                $('div.dataTables_filter input').addClass('form-control form-control-sm');

            }
        }).catch(function(err) {
          taxRateService.getClientType().then(function(data) {
              let lineItems = [];
              let lineItemObj = {};
              let setISCOD = false;
              for (let i = 0; i < data.tclienttype.length; i++) {

                  // let taxRate = (data.tdeptclass[i].fields.Rate * 100).toFixed(2) + '%';
                  // var dataList = {
                  //     id: data.tclienttype[i].Id || '',
                  //     typeName: data.tclienttype[i].TypeName || '-',
                  //     description: data.tclienttype[i].TypeDescription || '-',
                  //     status: data.tclienttype[i].Active || 'false',
                  //
                  // };

                  //dataTableList.push(dataList);
                  var dataList = [
                    data.tclienttype[i].Id || '',
                    data.tclienttype[i].TypeName || '',
                    data.tclienttype[i].TypeDescription || '',
                    '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                  ];
                  splashArrayClientTypeList.push(dataList);
                  //}
              }


              templateObject.datatablerecords.set(dataTableList);



              $('.fullScreenSpin').css('display', 'none');
              setTimeout(function() {
                  $('#clienttypeList').DataTable({
                      data: splashArrayClientTypeList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      paging: true,
                      "aaSorting": [],
                      "orderMulti": true,
                      columnDefs: [
                          {"orderable": false,  "targets": -1},
                          { className: "colClientTypeID hiddenColumn", "targets": [0] },
                          { className: "colClientTypeName pointer", "targets": [1] },
                          { className: "colDescription", "targets": [2] },
                          { className: "colDeleteCustomerType", "targets": [3] }
                      ],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      pageLength: initialDatatableLoad,
                      lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                      info: true,
                      responsive: true,
                      "fnInitComplete": function () {
                          $("<button class='btn btn-primary btnAddNewClientType' data-dismiss='modal' data-toggle='modal' data-target='#myModalClientType' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#clienttypeList_filter");
                          $("<button class='btn btn-primary btnRefreshClientType' type='button' id='btnRefreshClientType' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#clienttypeList_filter");
                      },

                  }).on('page', function() {
                      setTimeout(function() {
                          MakeNegative();
                      }, 100);
                      let draftRecord = templateObject.datatablerecords.get();
                      templateObject.datatablerecords.set(draftRecord);
                  }).on('column-reorder', function() {

                  }).on('length.dt', function(e, settings, len) {
                      setTimeout(function() {
                          MakeNegative();
                      }, 100);
                  });
                  $('.fullScreenSpin').css('display', 'none');
              }, 10);



              templateObject.tableheaderrecords.set(tableHeaderList);
              $('div.dataTables_filter input').addClass('form-control form-control-sm');

          }).catch(function(err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $('.fullScreenSpin').css('display', 'none');
              // Meteor._reload.reload();
          });
        });

    }

    templateObject.getClientTypeData();

    $(document).on('click', '.colDeleteCustomerType.table-remove', function() {
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').find('.colClientTypeID').text()||''; // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteClientTypeLineModal').modal('toggle');
        // if ($('.clienttypeList tbody>tr').length > 1) {
        // // if(confirm("Are you sure you want to delete this row?")) {
        // this.click;
        // $(this).closest('tr').remove();
        // //} else { }
        // event.preventDefault();
        // return false;
        // }
    });


});


Template.clienttypepopup.events({

    'click .btnAddNewClientType': function (event) {
        $('#edtClientTypeName').val('');
        $('#txaDescription').val('');
        setTimeout(function () {
          $('#edtClientTypeName').focus();
        }, 1000);
    },
    'click .btnRefreshClientType': function() {
      let templateObject = Template.instance();
      $('.fullScreenSpin').css('display', 'inline-block');
      const customerList = [];
      const clientList = [];
      let salesOrderTable;
      var splashArray = new Array();
      var splashArrayClientTypeList = new Array();
      const dataTableList = [];
      const tableHeaderList = [];
      let sideBarService = new SideBarService();
      let taxRateService = new TaxRateService();
      let dataSearchName = $('#clienttypeList_filter input').val();
      var currentLoc = FlowRouter.current().route.path;
      if (dataSearchName.replace(/\s/g, '') != '') {
          sideBarService.getClientTypeDataByName(dataSearchName).then(function (data) {
              let lineItems = [];
              let lineItemObj = {};
              if (data.tclienttype.length > 0) {
                for (let i = 0; i < data.tclienttype.length; i++) {
                  var dataList = [
                    data.tclienttype[i].Id || '',
                    data.tclienttype[i].TypeName || '',
                    data.tclienttype[i].TypeDescription || '',
                    '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                  ];
              splashArrayClientTypeList.push(dataList);
                }

                  var datatable = $('#clienttypeList').DataTable();
                  datatable.clear();
                  datatable.rows.add(splashArrayPaymentMethodList);
                  datatable.draw(false);

                  $('.fullScreenSpin').css('display', 'none');
              } else {

                  $('.fullScreenSpin').css('display', 'none');
                   $('#clienttypeListModal').modal('toggle');
                  swal({
                      title: 'Question',
                      text: "Client Type does not exist, would you like to create it?",
                      type: 'question',
                      showCancelButton: true,
                      confirmButtonText: 'Yes',
                      cancelButtonText: 'No'
                  }).then((result) => {
                      if (result.value) {
                          $('#myModalClientType').modal('toggle');
                          $('#edtClientTypeName').val(dataSearchName);
                      } else if (result.dismiss === 'cancel') {
                          $('#myModalClientType').modal('toggle');
                      }
                  });

              }

          }).catch(function (err) {
              $('.fullScreenSpin').css('display', 'none');
          });
      } else {
        sideBarService.getClientTypeData().then(function(data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.tclienttype.length; i++) {
                  var dataList = [
                    data.tclienttype[i].fields.ID || '',
                    data.tclienttype[i].fields.TypeName || '',
                    data.tclienttype[i].fields.TypeDescription || '',
                    '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span>'
                  ];
              splashArrayClientTypeList.push(dataList);

                }
      var datatable = $('#clienttypeList').DataTable();
            datatable.clear();
            datatable.rows.add(splashArrayPaymentMethodList);
            datatable.draw(false);

            $('.fullScreenSpin').css('display', 'none');
            }).catch(function (err) {
              $('.fullScreenSpin').css('display', 'none');
          });
      }

    },
    'click .btnDeleteDClientType': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let taxRateService = new TaxRateService();
        let deptId = $('#selectDeleteLineID').val();

        let objDetails = {
            type: "TClientType",
            fields: {
                Id: deptId,
                Active: false
            }
        };

        taxRateService.saveClientTypeData(objDetails).then(function (objDetails) {
            sideBarService.getClientTypeData().then(function (dataReload) {
                    addVS1Data('TClientType', JSON.stringify(dataReload)).then(function (datareturn) {
                       Meteor._reload.reload();
                    }).catch(function (err) {
                       Meteor._reload.reload();
                    });
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
                } else if (result.dismiss === 'cancel') {}
            });
            $('.fullScreenSpin').css('display', 'none');
        });

    },
    'click #btnNewInvoice': function(event) {
        // FlowRouter.go('/invoicecard');
    },
    'click .chkDatatable': function(event) {
        var columns = $('#clienttypeList th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function(i, v) {
            let className = v.classList;
            let replaceClass = className[1];

            if (v.innerText == columnDataValue) {
                if ($(event.target).is(':checked')) {
                    $("." + replaceClass + "").css('display', 'table-cell');
                    $("." + replaceClass + "").css('padding', '.75rem');
                    $("." + replaceClass + "").css('vertical-align', 'top');
                } else {
                    $("." + replaceClass + "").css('display', 'none');
                }
            }
        });
    },
    'click .resetTable': function(event) {
        var getcurrentCloudDetails = CloudUser.findOne({
            _id: Session.get('mycloudLogonID'),
            clouddatabaseID: Session.get('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'clienttypeList'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function(err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable': function(event) {
        let lineItems = [];
        $('.columnSettings').each(function(index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumn").text() || '';
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
            var colHidden = false;
            if ($tblrow.find(".custom-control-input").is(':checked')) {
                colHidden = false;
            } else {
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

        var getcurrentCloudDetails = CloudUser.findOne({
            _id: Session.get('mycloudLogonID'),
            clouddatabaseID: Session.get('mycloudLogonDBID')
        });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({
                    userid: clientID,
                    PrefName: 'clienttypeList'
                });
                if (checkPrefDetails) {
                    CloudPreference.update({
                        _id: checkPrefDetails._id
                    }, {
                        $set: {
                            userid: clientID,
                            username: clientUsername,
                            useremail: clientEmail,
                            PrefGroup: 'salesform',
                            PrefName: 'clienttypeList',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');
                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'clienttypeList',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function(err, idTag) {
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
    'blur .divcolumn': function(event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#clienttypeList').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function(event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#clienttypeList th');
        $.each(datable, function(i, v) {

            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettings': function(event) {
        let templateObject = Template.instance();
        var columns = $('#clienttypeList th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
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
    'click #exportbtn': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#clienttypeList_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .btnBack': function(event) {
        event.preventDefault();
        history.back(1);
    },
    'keydown #edtDays': function(event) {
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
            event.keyCode == 46 || event.keyCode == 190) {} else {
            event.preventDefault();
        }
    }


});

Template.clienttypepopup.helpers({
  datatablerecords: () => {
      return Template.instance().datatablerecords.get().sort(function (a, b) {
          if (a.typeName == 'NA') {
              return 1;
          } else if (b.typeName == 'NA') {
              return -1;
          }
          return (a.typeName.toUpperCase() > b.typeName.toUpperCase()) ? 1 : -1;
          // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
      });
  },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'clienttypeList'
        });
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function(a, b) {
            if (a.department == 'NA') {
                return 1;
            } else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    include7Days: () => {
        return Template.instance().include7Days.get();
    },
    include30Days: () => {
        return Template.instance().include30Days.get();
    },
    includeCOD: () => {
        return Template.instance().includeCOD.get();
    },
    includeEOM: () => {
        return Template.instance().includeEOM.get();
    },
    includeEOMPlus: () => {
        return Template.instance().includeEOMPlus.get();
    },
    includeSalesDefault: () => {
        return Template.instance().includeSalesDefault.get();
    },
    includePurchaseDefault: () => {
        return Template.instance().includePurchaseDefault.get();
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
