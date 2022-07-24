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
Template.shipviapop.onCreated(function() {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.deptrecords = new ReactiveVar();

    templateObject.include7Days = new ReactiveVar();
    templateObject.include7Days.set(false);
    templateObject.include30Days = new ReactiveVar();
    templateObject.include30Days.set(false);
    templateObject.includeCOD = new ReactiveVar();
    templateObject.includeCOD.set(false);
    templateObject.includeEOM = new ReactiveVar();
    templateObject.includeEOM.set(false);
    templateObject.includeEOMPlus = new ReactiveVar();
    templateObject.includeEOMPlus.set(false);
    templateObject.shipviarecords = new ReactiveVar();
    templateObject.includeSalesDefault = new ReactiveVar();
    templateObject.includeSalesDefault.set(false);
    templateObject.includePurchaseDefault = new ReactiveVar();
    templateObject.includePurchaseDefault.set(false);

});

Template.shipviapop.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let taxRateService = new TaxRateService();
    var splashArrayShipViaList = new Array();
    const dataTableList = [];
    const tableHeaderList = [];
    const deptrecords = [];
    let deptprodlineItems = [];
    const viarecords = [];
    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblShipViaPopList', function(error, result) {
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

    templateObject.getShpVias = function() {
        getVS1Data('TShippingMethod').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getShippingMethodData().then(function(data) {
                  addVS1Data('TShippingMethod',JSON.stringify(data));
                    for (let i in data.tshippingmethod) {

                        let viarecordObj = {
                            shippingmethod: data.tshippingmethod[i].ShippingMethod || ' ',
                            id: data.tshippingmethod[i].Id || ' '
                        };
                        var dataList = [
                        	data.tshippingmethod[i].ShippingMethod || ' '
                        ];
                        splashArrayShipViaList.push(dataList);
                        viarecords.push(viarecordObj);
                        templateObject.shipviarecords.set(viarecords);

                    }
                    setTimeout(function() {
                        $('#tblShipViaPopList').DataTable({
                            data: splashArrayShipViaList,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            paging: true,
                            "aaSorting": [],
                            "orderMulti": true,
                            columnDefs: [
                                { className: "colShipName", "targets": [0] }
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "fnInitComplete": function () {
                                $("<button class='btn btn-primary btnAddNewShipVia' data-dismiss='modal' data-toggle='modal' data-target='#newShipViaModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblShipViaPopList_filter");
                                $("<button class='btn btn-primary btnRefreshVia' type='button' id='btnRefreshVia' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblShipViaPopList_filter");
                            },

                        });
                        $('.fullScreenSpin').css('display', 'none');
                    }, 10);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tshippingmethod;
                for (let i in useData) {

                    let viarecordObj = {
                        shippingmethod: useData[i].ShippingMethod || ' ',
                        id: useData[i].ID || ' '
                    };
                    var dataList = [
                      data.tshippingmethod[i].ShippingMethod || ' '
                    ];
                    splashArrayShipViaList.push(dataList);
                    viarecords.push(viarecordObj);

                    templateObject.shipviarecords.set(viarecords);

                }

                $('.fullScreenSpin').css('display', 'none');
                setTimeout(function() {
                    $('#tblShipViaPopList').DataTable({
                        data: splashArrayShipViaList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [
                            { className: "colShipName", "targets": [0] }
                        ],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnAddNewShipVia' data-dismiss='modal' data-toggle='modal' data-target='#newShipViaModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblShipViaPopList_filter");
                            $("<button class='btn btn-primary btnRefreshVia' type='button' id='btnRefreshVia' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblShipViaPopList_filter");
                        },

                    });
                    $('.fullScreenSpin').css('display', 'none');
                }, 10);


            }
        }).catch(function(err) {

          sideBarService.getShippingMethodData().then(function(data) {
            addVS1Data('TShippingMethod',JSON.stringify(data));
              for (let i in data.tshippingmethod) {

                  let viarecordObj = {
                      shippingmethod: data.tshippingmethod[i].ShippingMethod || ' ',
                      id: data.tshippingmethod[i].Id || ' '
                  };
                  var dataList = [
                    data.tshippingmethod[i].ShippingMethod || ' '
                  ];
                  splashArrayShipViaList.push(dataList);
                  viarecords.push(viarecordObj);
                  templateObject.shipviarecords.set(viarecords);

              }
              setTimeout(function() {
                  $('#tblShipViaPopList').DataTable({
                      data: splashArrayShipViaList,
                      "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                      paging: true,
                      "aaSorting": [],
                      "orderMulti": true,
                      columnDefs: [
                          { className: "colShipName", "targets": [0] }
                      ],
                      select: true,
                      destroy: true,
                      colReorder: true,
                      pageLength: initialDatatableLoad,
                      lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                      info: true,
                      responsive: true,
                      "fnInitComplete": function () {
                          $("<button class='btn btn-primary btnAddNewShipVia' data-dismiss='modal' data-toggle='modal' data-target='#newShipViaModal' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblShipViaPopList_filter");
                          $("<button class='btn btn-primary btnRefreshVia' type='button' id='btnRefreshVia' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblShipViaPopList_filter");
                      },

                  });
                  $('.fullScreenSpin').css('display', 'none');
              }, 10);
          });
        });

    }
    templateObject.getShpVias();


    $(document).on('click', '.table-remove', function() {
        event.stopPropagation();
        event.stopPropagation();
        var targetID = $(event.target).closest('tr').attr('id'); // table row ID
        $('#selectDeleteLineID').val(targetID);
        $('#deleteLineModal').modal('toggle');
        // if ($('.tblShipViaPopList tbody>tr').length > 1) {
        // // if(confirm("Are you sure you want to delete this row?")) {
        // this.click;
        // $(this).closest('tr').remove();
        // //} else { }
        // event.preventDefault();
        // return false;
        // }
    });

    $('#tblShipViaPopList tbody').on('click', 'tr .colName, tr .colIsDays, tr .colIsEOM, tr .colDescription, tr .colIsCOD, tr .colIsEOMPlus, tr .colCustomerDef, tr .colSupplierDef', function() {
        var listData = $(this).closest('tr').attr('id');
        var is7days = false;
        var is30days = false;
        var isEOM = false;
        var isEOMPlus = false;
        var isSalesDefault = false;
        var isPurchaseDefault = false;
        if (listData) {
            $('#add-terms-title').text('Edit Term ');
            //$('#isformcreditcard').removeAttr('checked');
            if (listData !== '') {
                listData = Number(listData);
                //taxRateService.getOneTerms(listData).then(function (data) {

                var termsID = listData || '';
                var termsName = $(event.target).closest("tr").find(".colName").text() || '';
                var description = $(event.target).closest("tr").find(".colDescription").text() || '';
                var days = $(event.target).closest("tr").find(".colIsDays").text() || 0;
                //let isDays = data.fields.IsDays || '';
                if ($(event.target).closest("tr").find(".colIsEOM .chkBox").is(':checked')) {
                    isEOM = true;
                }

                if ($(event.target).closest("tr").find(".colIsEOMPlus .chkBox").is(':checked')) {
                    isEOMPlus = true;
                }

                if ($(event.target).closest("tr").find(".colCustomerDef .chkBox").is(':checked')) {
                    isSalesDefault = true;
                }

                if ($(event.target).closest("tr").find(".colSupplierDef .chkBox").is(':checked')) {
                    isPurchaseDefault = true;
                }

                if (isEOM == true || isEOMPlus == true) {
                    isDays = false;
                } else {
                    isDays = true;
                }


                $('#edtTermsID').val(termsID);
                $('#edtName').val(termsName);
                $('#edtName').prop('readonly', true);
                $('#edtDesc').val(description);
                $('#edtDays').val(days);


                // if((isDays == true) && (days == 7)){
                //   templateObject.include7Days.set(true);
                // }else{
                //   templateObject.include7Days.set(false);
                // }
                if ((isDays == true) && (days == 0)) {
                    templateObject.includeCOD.set(true);
                } else {
                    templateObject.includeCOD.set(false);
                }

                if ((isDays == true) && (days == 30)) {
                    templateObject.include30Days.set(true);
                } else {
                    templateObject.include30Days.set(false);
                }

                if (isEOM == true) {
                    templateObject.includeEOM.set(true);
                } else {
                    templateObject.includeEOM.set(false);
                }

                if (isEOMPlus == true) {
                    templateObject.includeEOMPlus.set(true);
                } else {
                    templateObject.includeEOMPlus.set(false);
                }


                if (isSalesDefault == true) {
                    templateObject.includeSalesDefault.set(true);
                } else {
                    templateObject.includeSalesDefault.set(false);
                }

                if (isPurchaseDefault == true) {
                    templateObject.includePurchaseDefault.set(true);
                } else {
                    templateObject.includePurchaseDefault.set(false);
                }

                //});


                $(this).closest('tr').attr('data-target', '#myModal');
                $(this).closest('tr').attr('data-toggle', 'modal');

            }

        }

    });
});


Template.shipviapop.events({
    'click .btnAddNewStatus': function (event) {
        setTimeout(function () {
          $('#status').focus();
        }, 1000);
    },
    'click #btnNewInvoice': function(event) {
        // FlowRouter.go('/invoicecard');
    },
    'click .btnRefreshVia': function (event) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        const customerList = [];
        const clientList = [];
        let salesOrderTable;
        var splashArray = new Array();
        var splashArrayShipViaList = new Array();
        const dataTableList = [];
        const tableHeaderList = [];
        let sideBarService = new SideBarService();
        let taxRateService = new TaxRateService();
        let dataSearchName = $('#tblShipViaPopList_filter input').val();
        var currentLoc = FlowRouter.current().route.path;
        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getShippingMethodByName(dataSearchName).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                if (data.tshippingmethod.length > 0) {
                  for (let i = 0; i < data.tshippingmethod.length; i++) {
                      var dataList = [
                          data.tshippingmethod[i].ShippingMethod || ' '
                        ];

                      splashArrayShipViaList.push(dataList);
                  }

                    var datatable = $('#tblShipViaPopList').DataTable();
                    datatable.clear();
                    datatable.rows.add(splashArrayShipViaList);
                    datatable.draw(false);

                    $('.fullScreenSpin').css('display', 'none');
                } else {

                    $('.fullScreenSpin').css('display', 'none');
                     $('#shipViaModal').modal('toggle');
                    swal({
                        title: 'Question',
                        text: "Ship Via does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            $('#newShipViaModal').modal('toggle');
                            $('#edtShipVia').val(dataSearchName);
                        } else if (result.dismiss === 'cancel') {
                            $('#newShipViaModal').modal('toggle');
                        }
                    });

                }

            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
          sideBarService.getShippingMethodData().then(function(data) {

                  let records = [];
                  let inventoryData = [];
                  for (let i = 0; i < data.tshippingmethod.length; i++) {
                    var dataList = [
                  data.tshippingmethod[i].ShippingMethod || ' '
                ];
                splashArrayShipViaList.push(dataList);

                  }
        var datatable = $('#tblShipViaPopList').DataTable();
              datatable.clear();
              datatable.rows.add(splashArrayShipViaList);
              datatable.draw(false);

              $('.fullScreenSpin').css('display', 'none');
              }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    },
    'keyup #tblShipViaPopList_filter input': function (event) {
      if (event.keyCode == 13) {
         $(".btnRefreshVia").trigger("click");
      }
    },
    'click .chkDatatable': function(event) {
        var columns = $('#tblShipViaPopList th');
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
                    PrefName: 'tblShipViaPopList'
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
                    PrefName: 'tblShipViaPopList'
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
                            PrefName: 'tblShipViaPopList',
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
                        PrefName: 'tblShipViaPopList',
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
        var datable = $('#tblShipViaPopList').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function(event) {
        let range = $(event.target).val();
        $(event.target).closest("div.divColWidth").find(".spWidth").html(range + 'px');

        let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblShipViaPopList th');
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
        var columns = $('#tblShipViaPopList th');

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
        jQuery('#tblShipViaPopList_wrapper .dt-buttons .btntabletoexcel').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .btnRefresh': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        sideBarService.getAllLeadStatus().then(function(dataReload) {
            addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                location.reload(true);
            }).catch(function(err) {
                location.reload(true);
            });
        }).catch(function(err) {
            location.reload(true);
        });
    },
    'click .btnDeleteTerms': function() {
        let taxRateService = new TaxRateService();
        let termsId = $('#selectDeleteLineID').val();


        let objDetails = {
            type: "TTerms",
            fields: {
                Id: parseInt(termsId),
                Active: false
            }
        };

        taxRateService.saveTerms(objDetails).then(function(objDetails) {
            sideBarService.getAllLeadStatus().then(function(dataReload) {
                addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                    Meteor._reload.reload();
                }).catch(function(err) {
                    Meteor._reload.reload();
                });
            }).catch(function(err) {
                Meteor._reload.reload();
            });
        }).catch(function(err) {
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
            $('.fullScreenSpin').css('display', 'none');
        });

    },
    'click .btnSaveTerms': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let taxRateService = new TaxRateService();
        let termsID = $('#edtTermsID').val();
        let termsName = $('#edtName').val();
        let description = $('#edtDesc').val();
        let termdays = $('#edtDays').val();

        let isDays = false;
        let is30days = false;
        let isEOM = false;
        let isEOMPlus = false;
        let days = 0;

        let isSalesdefault = false;
        let isPurchasedefault = false;
        if (termdays.replace(/\s/g, '') != "") {
            isDays = true;
        } else {
            isDays = false;
        }

        if ($('#isEOM').is(':checked')) {
            isEOM = true;
        } else {
            isEOM = false;
        }

        if ($('#isEOMPlus').is(':checked')) {
            isEOMPlus = true;
        } else {
            isEOMPlus = false;
        }

        if ($('#chkCustomerDef').is(':checked')) {
            isSalesdefault = true;
        } else {
            isSalesdefault = false;
        }

        if ($('#chkSupplierDef').is(':checked')) {
            isPurchasedefault = true;
        } else {
            isPurchasedefault = false;
        }

        let objDetails = '';
        if (termsName === '') {
            $('.fullScreenSpin').css('display', 'none');
            Bert.alert('<strong>WARNING:</strong> Term Name cannot be blank!', 'warning');
            e.preventDefault();
        }

        if (termsID == "") {
            taxRateService.checkTermByName(termsName).then(function(data) {
                termsID = data.tterms[0].Id;
                objDetails = {
                    type: "TTerms",
                    fields: {
                        ID: parseInt(termsID),
                        Active: true,
                        //TypeName: termsName,
                        Description: description,
                        IsDays: isDays,
                        IsEOM: isEOM,
                        IsEOMPlus: isEOMPlus,
                        isPurchasedefault: isPurchasedefault,
                        isSalesdefault: isSalesdefault,
                        Days: termdays || 0,
                        PublishOnVS1: true
                    }
                };

                taxRateService.saveTerms(objDetails).then(function(objDetails) {
                    sideBarService.getAllLeadStatus().then(function(dataReload) {
                        addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                            Meteor._reload.reload();
                        }).catch(function(err) {
                            Meteor._reload.reload();
                        });
                    }).catch(function(err) {
                        Meteor._reload.reload();
                    });
                }).catch(function(err) {
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
                    $('.fullScreenSpin').css('display', 'none');
                });
            }).catch(function(err) {
                objDetails = {
                    type: "TTerms",
                    fields: {
                        Active: true,
                        TypeName: termsName,
                        Description: description,
                        IsDays: isDays,
                        IsEOM: isEOM,
                        IsEOMPlus: isEOMPlus,
                        Days: termdays || 0,
                        PublishOnVS1: true
                    }
                };

                taxRateService.saveTerms(objDetails).then(function(objDetails) {
                    sideBarService.getAllLeadStatus().then(function(dataReload) {
                        addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                            Meteor._reload.reload();
                        }).catch(function(err) {
                            Meteor._reload.reload();
                        });
                    }).catch(function(err) {
                        Meteor._reload.reload();
                    });
                }).catch(function(err) {
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
                    $('.fullScreenSpin').css('display', 'none');
                });
            });

        } else {
            objDetails = {
                type: "TTerms",
                fields: {
                    ID: parseInt(termsID),
                    TypeName: termsName,
                    Description: description,
                    IsDays: isDays,
                    IsEOM: isEOM,
                    isPurchasedefault: isPurchasedefault,
                    isSalesdefault: isSalesdefault,
                    IsEOMPlus: isEOMPlus,
                    Days: termdays || 0,
                    PublishOnVS1: true
                }
            };

            taxRateService.saveTerms(objDetails).then(function(objDetails) {
                sideBarService.getAllLeadStatus().then(function(dataReload) {
                    addVS1Data('TTermsVS1', JSON.stringify(dataReload)).then(function(datareturn) {
                        Meteor._reload.reload();
                    }).catch(function(err) {
                        Meteor._reload.reload();
                    });
                }).catch(function(err) {
                    Meteor._reload.reload();
                });
            }).catch(function(err) {
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
                $('.fullScreenSpin').css('display', 'none');
            });
        }




    },
    'click .btnAddTerms': function() {
        let templateObject = Template.instance();
        $('#add-terms-title').text('Add New Term ');
        $('#edtTermsID').val('');
        $('#edtName').val('');
        $('#edtName').prop('readonly', false);
        $('#edtDesc').val('');
        $('#edtDays').val('');

        templateObject.include7Days.set(false);
        templateObject.includeCOD.set(false);
        templateObject.include30Days.set(false);
        templateObject.includeEOM.set(false);
        templateObject.includeEOMPlus.set(false);
    },
    'click .btnBack': function(event) {
        event.preventDefault();
        history.back(1);
    },
    'click .chkTerms': function(event) {
        var $box = $(event.target);

        if ($box.is(":checked")) {
            var group = "input:checkbox[name='" + $box.attr("name") + "']";
            $(group).prop("checked", false);
            $box.prop("checked", true);
        } else {
            $box.prop("checked", false);
        }
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

Template.shipviapop.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.typename == 'NA') {
                return 1;
            } else if (b.typename == 'NA') {
                return -1;
            }
            return (a.typename.toUpperCase() > b.typename.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblShipViaPopList'
        });
    },
    shipviarecords: () => {
        return Template.instance().shipviarecords.get().sort(function(a, b) {
            if (a.shippingmethod == 'NA') {
                return 1;
            } else if (b.shippingmethod == 'NA') {
                return -1;
            }
            return (a.shippingmethod.toUpperCase() > b.shippingmethod.toUpperCase()) ? 1 : -1;
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
