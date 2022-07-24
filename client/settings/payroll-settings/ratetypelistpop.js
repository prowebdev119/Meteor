import { ReactiveVar } from "meteor/reactive-var";
import { CoreService } from "../../js/core-service";
import { DashBoardService } from "../../Dashboard/dashboard-service";
import { UtilityService } from "../../utility-service";
import { RateTypeService } from '../../js/ratetype_service';
import '../../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import { Random } from 'meteor/random';
import { jsPDF } from "jspdf";
import 'jQuery.print/jQuery.print.js';
import { autoTable } from "jspdf-autotable";
import 'jquery-editable-select';
import { SideBarService } from "../../js/sidebar-service";
import '../../lib/global/indexdbstorage.js';

let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;

Template.ratetypelistpop.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.RateTypeList = new ReactiveVar([]);
});

Template.ratetypelistpop.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let tempObj = Template.instance();
    let sideBarService = new SideBarService();
    let utilityService = new UtilityService();
    let rateTypeService = new RateTypeService();
    let description = '';
    var splashArrayRateTypeList = new Array(); 
    var currentLoc = FlowRouter.current().route.path;
   
    tempObj.getAllRateType = function() {
        getVS1Data('TRateTypes').then(function(dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getRateListVS1().then(function(data) {
                    let records = [];
                    let inventoryData = [];
                    addVS1Data('TRateTypes',JSON.stringify(data));
                    for (let i = 0; i < data.tpayratetype.length; i++) {
                       if (!isNaN(data.tpayratetype[i].fields.Description)) {
                        description = data.tpayratetype[i].fields.Description || '';
                      } else {
                        description = "";
                      }
                      var dataList = [                   
                      	data.tpayratetype[i].fields.Description || '',                    
                      ];                 
                        splashArrayRateTypeList.push(dataList);
                    }
            
                    if(splashArrayRateTypeList) {
                       $('#tblratetypelist').dataTable({
                            data: splashArrayRateTypeList,
                            "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                            columnDefs: [
                                { className: "thDescription", "targets": [0] },                                     
                                { className: "thRateID hiddenColumn", "targets": [1] }                              
                            ],
                            select: true,
                            destroy: true,
                            colReorder: true,
                            pageLength: initialDatatableLoad,
                            lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                            info: true,
                            responsive: true,
                            "fnInitComplete": function () {
                              $("<button class='btn btn-primary btnAddRateType' data-dismiss='modal' data-toggle='modal' data-target='#addRateModel' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblratetypelist_filter");
                              $("<button class='btn btn-primary btnRefreshRateType' type='button' id='btnRefreshRateType' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblratetypelist_filter");
                            }

                        });
                        $('div.dataTables_filter input').addClass('form-control form-control-sm');

                    }
                });
              } 
              else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tpayratetype;           
                let records = [];
                let inventoryData = [];
                for (let i = 0; i < useData.length; i++) {
                    if (!isNaN(useData[i].fields.Description)) {
                        description = useData[i].fields.Description || '';
                    } else {
                        description = '';
                    }
                    var dataList = [
                        useData[i].fields.Description || '-',
                        useData[i].fields.ID || ''
                    ];                  
                    splashArrayRateTypeList.push(dataList);
                   

                }
                if (splashArrayRateTypeList) {

                    $('#tblratetypelist').dataTable({
                        data: splashArrayRateTypeList,
                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [
                               
                                { className: "thDescription", "targets": [0] },                                     
                                { className: "thRateID hiddenColumn", "targets": [1]}   
                        ],
                        colReorder: true,
                        "order": [
                            [0, "asc"]
                        ],
                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnAddRateType' data-dismiss='modal' data-toggle='modal' data-target='#addRateModel' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblratetypelist_filter");
                            $("<button class='btn btn-primary btnRefreshRateType' type='button' id='btnRefreshRateType' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblratetypelist_filter");
                        }

                    });

                    $('div.dataTables_filter input').addClass('form-control form-control-sm');

                }
            }
        }).catch(function(err) {
            sideBarService.getRateListVS1().then(function(data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.tpayratetype.length; i++) {
                   if (!isNaN(data.tpayratetype[i].fields.Description)) {
                    Description = data.tpayratetype[i].fields.Description || '';
                  } else {
                    Description = '';
                  }
                  var dataList = [
      
                    data.tpayratetype[i].fields.Description || '',          
                    data.tpayratetype[i].fields.ID || ''
                  ];            
                  splashArrayRateTypeList.push(dataList);
                

              }
                //localStorage.setItem('VS1PurchaseAccountList', JSON.stringify(splashArrayAccountList));

                if (splashArrayRateTypeList) {

                    $('#tblratetypelist').dataTable({
                        data: splashArrayRateTypeList,

                        "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        paging: true,
                        "aaSorting": [],
                        "orderMulti": true,
                        columnDefs: [
                            { className: "thDescription", "targets": [0] },                                     
                            { className: "thRateID hiddenColumn", "targets": [1]}   
                        ],
                        colReorder: true,

                        "order": [
                            [0, "asc"]
                        ],

                        pageLength: initialDatatableLoad,
                        lengthMenu: [ [initialDatatableLoad, -1], [initialDatatableLoad, "All"] ],
                        info: true,
                        responsive: true,
                        "fnInitComplete": function () {
                            $("<button class='btn btn-primary btnAddRateType' data-dismiss='modal' data-toggle='modal' data-target='#addRateModel' type='button' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-plus'></i></button>").insertAfter("#tblratetypelist_filter");
                            $("<button class='btn btn-primary btnRefreshRateType' type='button' id='btnRefreshRateType' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblratetypelist_filter");
                        }

                    });

                     $('div.dataTables_filter input').addClass('form-control form-control-sm');

                }
            });
        });
    };
    tempObj.getAllRateType();

});
Template.ratetypelistpop.helpers({
   
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
  
   
    isMobileDevices: () => {
        var isMobile = false;

        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }

        return isMobile;
    },
   
});

Template.ratetypelistpop.events({
    'click .btnAddRateType': function(event) {
      $('#add-rateype-title').text('Add New Rate Type');
      $('#edtRateID').val('');
   
    },

    'click .btnRefreshRateType': function (event) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        const customerList = [];
        const clientList = [];
        let salesOrderTable;
        var splashArray = new Array();
        var splashArrayRateTypeList = new Array(); 
        let utilityService = new UtilityService();
        const dataTableList = [];
        const tableHeaderList = [];
        let sideBarService = new SideBarService();
        let rateTypeService = new RateTypeService();
        let dataSearchName = $('#tblratetypelist_filter input').val();
        var currentLoc = FlowRouter.current().route.path;
        if (dataSearchName.replace(/\s/g, '') != '') {
            sideBarService.getRateTypeByName(dataSearchName).then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                if (data.tratetypes.length > 0) {
                  for (let i = 0; i < data.tratetypes.length; i++) {
                    var dataList = [                  
                    	data.tratetypes[i].fields.Description || '',
                        data.tratetypes[i].fields.ID || ''
                    ];
                
                      splashArrayRateTypeList.push(dataList);
                    

                    }
                    var datatable = $('#tblratetypelist').DataTable();
                    datatable.clear();
                    datatable.rows.add(splashArrayRateTypeList);
                    datatable.draw(false);

                    $('.fullScreenSpin').css('display', 'none');
                } else {

                    $('.fullScreenSpin').css('display', 'none');
                    $('#rateTypeListModel').modal('toggle');
                    swal({
                        title: 'Question',
                        text: "Rate Type does not exist, would you like to create it?",
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.value) {
                            $('#addRateModel').modal('toggle');
                            $('#edtRateDescription').val(dataSearchName);
                        } else if (result.dismiss === 'cancel') {
                            $('#rateTypeListModel').modal('toggle');
                        }
                    });

                }

            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
          sideBarService.getRateListVS1().then(function(data) {

                  let records = [];
                  let inventoryData = [];
                  for (let i = 0; i < data.tratetypes.length; i++) {
                      var dataList = [
                  
                          data.tratetypes[i].fields.Description || '',
                          data.tratetypes[i].fields.ID || ''
                      ];

                      splashArrayRateTypeList.push(dataList);
                  }
                  
                  var datatable = $('#tblratetypelist').DataTable();
                    datatable.clear();
                    datatable.rows.add(splashArrayRateTypeList);
                    datatable.draw(false);
                   $('.fullScreenSpin').css('display', 'none');
                   }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }
    },
    'keyup #tblratetypelist_filter input': function (event) {
      if (event.keyCode == 13) {
         $(".btnRefreshRateType").trigger("click");
      }
    },
    'change #sltStatus': function () {
        let status = $('#sltStatus').find(":selected").val();
        if (status == "newstatus") {
            $('#statusModal').modal();
        }
    },
 
    'click .lineDescription': function(event) {
        $('#tblCreditLine tbody tr .lineDescription').attr("data-toggle", "modal");
        $('#tblCreditLine tbody tr .lineDescription').attr("data-target", "#rateTypeListModel");
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectLineID').val(targetID);

        setTimeout(function() {
            $('#tblratetypelist_filter .form-control-sm').focus();
        }, 500);
    },
    'click #rateTypeListModel #refreshpagelist': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        Meteor._reload.reload();
        templateObject.getAllRateType();

    },
 

    'click .btnRemove': function(event) {
        let templateObject = Template.instance();
        let taxcodeList = templateObject.taxraterecords.get();
        let utilityService = new UtilityService();

        var clicktimes = 0;
        var targetID = $(event.target).closest('tr').attr('id');
        $('#selectDeleteLineID').val(targetID);

        times++;

        if (times == 1) {
            $('#deleteLineModal').modal('toggle');
        } else {
            if ($('#tblCreditLine tbody>tr').length > 1) {
                this.click;
                $(event.target).closest('tr').remove();
                $(".credit_print #"+targetID).remove();
                event.preventDefault();
                let $tblrows = $("#tblCreditLine tbody tr");
                let $printrows = $(".credit_print tbody tr");
                let lineAmount = 0;
                let subGrandTotal = 0;
                let taxGrandTotal = 0;
                let taxGrandTotalPrint = 0;

                $tblrows.each(function(index) {
                    var $tblrow = $(this);
                    var amount = $tblrow.find(".colAmount").val() || 0;
                    var taxcode = $tblrow.find(".lineTaxCode").text() || 0;

                    var taxrateamount = 0;
                    if (taxcodeList) {
                        for (var i = 0; i < taxcodeList.length; i++) {
                            if (taxcodeList[i].codename == taxcode) {
                                taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100;
                            }
                        }
                    }


                    var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
                    var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                    $tblrow.find('.lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal));
                    if (!isNaN(subTotal)) {
                        subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                        document.getElementById("subtotal_total").innerHTML = utilityService.modifynegativeCurrencyFormat(subGrandTotal);
                    }

                    if (!isNaN(taxTotal)) {
                        taxGrandTotal += isNaN(taxTotal) ? 0 : taxTotal;
                        document.getElementById("subtotal_tax").innerHTML = utilityService.modifynegativeCurrencyFormat(taxGrandTotal);
                    }

                    if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                        let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                        document.getElementById("grandTotal").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                        document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                        document.getElementById("totalBalanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);

                    }
                });

                if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
                    $printrows.each(function(index) {
                        var $printrows = $(this);
                        var amount = $printrows.find("#lineAmount").text() || "0";
                        var taxcode = $printrows.find("#lineTaxCode").text() || 0;

                        var taxrateamount = 0;
                        if (taxcodeList) {
                            for (var i = 0; i < taxcodeList.length; i++) {
                                if (taxcodeList[i].codename == taxcode) {
                                    taxrateamount = taxcodeList[i].coderate.replace('%', "") / 100 || 0;
                                }
                            }
                        }


                        var subTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) || 0;
                        var taxTotal = parseFloat(amount.replace(/[^0-9.-]+/g, "")) * parseFloat(taxrateamount);
                        $printrows.find('#lineTaxAmount').text(utilityService.modifynegativeCurrencyFormat(taxTotal))

                        if (!isNaN(subTotal)) {
                            $printrows.find('#lineAmt').text(utilityService.modifynegativeCurrencyFormat(subTotal));
                            subGrandTotal += isNaN(subTotal) ? 0 : subTotal;
                            document.getElementById("subtotal_totalPrint").innerHTML = $('#subtotal_total').text();
                        }

                        if (!isNaN(taxTotal)) {
                            taxGrandTotalPrint += isNaN(taxTotal) ? 0 : taxTotal;
                        }
                        if (!isNaN(subGrandTotal) && (!isNaN(taxGrandTotal))) {
                            let GrandTotal = (parseFloat(subGrandTotal)) + (parseFloat(taxGrandTotal));
                            document.getElementById("grandTotalPrint").innerHTML = $('#grandTotal').text();
                            //document.getElementById("balanceDue").innerHTML = utilityService.modifynegativeCurrencyFormat(GrandTotal);
                            document.getElementById("totalBalanceDuePrint").innerHTML = $('#totalBalanceDue').text();

                        }
                    });
                }
                return false;

            } else {
                $('#deleteLineModal').modal('toggle');
            }
        }
    },
   
});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});