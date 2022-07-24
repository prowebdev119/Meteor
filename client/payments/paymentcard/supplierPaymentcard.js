import {
    PaymentsService
} from "../../payments/payments-service";
import {
    ReactiveVar
} from "meteor/reactive-var";
import {
    UtilityService
} from "../../utility-service";
import '../../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import {
    AccountService
} from "../../accounts/account-service";
import 'jquery-ui-dist/jquery-ui';
import {
    Random
} from 'meteor/random';
import 'jquery-editable-select';
import {
    SideBarService
} from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
let clickedTableID = 0;
Template.supplierpaymentcard.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.record = new ReactiveVar({});
    templateObject.CleintName = new ReactiveVar();
    templateObject.Department = new ReactiveVar();
    templateObject.Date = new ReactiveVar();
    templateObject.DueDate = new ReactiveVar();
    templateObject.clientrecords = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.paymentmethodrecords = new ReactiveVar();
    templateObject.accountnamerecords = new ReactiveVar();
    templateObject.supppaymentid = new ReactiveVar();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords1 = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.selectedAwaitingPayment = new ReactiveVar([]);
});

Template.supplierpaymentcard.onRendered(() => {
    const dataTableList = [];
    const tableHeaderList = [];
    $('.fullScreenSpin').css('display', 'inline-block');
    let imageData = (localStorage.getItem("Image"));
    if (imageData) {
        $('.uploadedImage').attr('src', imageData);
    };
    setTimeout(function() {
        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
            if (error) {

                //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
            } else {
                if (result) {
                    for (let i = 0; i < result.customFields.length; i++) {
                        let customcolumn = result.customFields;
                        let columData = customcolumn[i].label;
                        let columHeaderUpdate = customcolumn[i].thclass;
                        let hiddenColumn = customcolumn[i].hidden;
                        let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                        let columnWidth = customcolumn[i].width;

                        $("" + columHeaderUpdate + "").html(columData);
                        if (columnWidth != 0) {
                            $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                        }

                        if (hiddenColumn == true) {
                            $("." + columnClass + "").addClass('hiddenColumn');
                            $("." + columnClass + "").removeClass('showColumn');
                            $(".chk" + columnClass + "").removeAttr('checked');
                        } else if (hiddenColumn == false) {
                            $("." + columnClass + "").removeClass('hiddenColumn');
                            $("." + columnClass + "").addClass('showColumn');
                            $(".chk" + columnClass + "").attr('checked', 'checked');
                        }

                    }
                }

            }
        });
    }, 500);

    $('#edtSupplierName').attr('readonly', true);
    $('#edtSupplierName').css('background-color', '#eaecf4');
    $("#date-input,#dtPaymentDate").datepicker({
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
    const templateObject = Template.instance();
    const record = [];
    let paymentService = new PaymentsService();
    let clientsService = new PaymentsService();
    const clientList = [];
    const deptrecords = [];
    const paymentmethodrecords = [];
    const accountnamerecords = [];

    templateObject.getLastPaymentData = function() {
      let lastBankAccount = "Bank";
      let lastDepartment = Session.get('department') || "";
        paymentService.getAllSupplierPaymentData1().then(function(data) {
            if(data.tsupplierpayment.length > 0){
                lastCheque = data.tsupplierpayment[data.tsupplierpayment.length - 1]
                lastBankAccount = lastCheque.AccountName;
                lastDepartment = lastCheque.DeptClassName;
            } else{

            }
            setTimeout(function(){
                  $('#edtSelectBankAccountName').val(lastBankAccount);
                  $('#sltDepartment').val(lastDepartment);
            },50);
        }).catch(function(err) {
          if(Session.get('bankaccount')){
            $('#edtSelectBankAccountName').val(Session.get('bankaccount'));
          }else{
            $('#edtSelectBankAccountName').val(lastBankAccount);
          };
          $('#sltDepartment').val(lastDepartment);
        });
    };

    templateObject.getAllClients = function() {
        getVS1Data('TSupplierVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                clientsService.getSupplierVS1().then(function(data) {
                    for (let i in data.tsuppliervs1) {

                        let customerrecordObj = {
                            customerid: data.tsuppliervs1[i].Id || ' ',
                            customername: data.tsuppliervs1[i].ClientName || ' ',
                            customeremail: data.tsuppliervs1[i].Email || ' ',
                            street: data.tsuppliervs1[i].Street || ' ',
                            street2: data.tsuppliervs1[i].Street2 || ' ',
                            street3: data.tsuppliervs1[i].Street3 || ' ',
                            suburb: data.tsuppliervs1[i].Suburb || ' ',
                            statecode: data.tsuppliervs1[i].State + ' ' + data.tsuppliervs1[i].Postcode || ' ',
                            country: data.tsuppliervs1[i].Country || ' '
                        };
                        //clientList.push(data.tsupplier[i].ClientName,customeremail: data.tsupplier[i].Email);
                        clientList.push(customerrecordObj);

                        //$('#edtSupplierName').editableSelect('add',data.tsupplier[i].ClientName);
                    }
                    //templateObject.clientrecords.set(clientList);
                    templateObject.clientrecords.set(clientList.sort(function(a, b) {
                        if (a.customername == 'NA') {
                            return 1;
                        } else if (b.customername == 'NA') {
                            return -1;
                        }
                        return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                    }));

                    for (var i = 0; i < clientList.length; i++) {
                        //$('#edtSupplierName').editableSelect('add', clientList[i].customername);
                    }

                    if(jQuery.isEmptyObject( FlowRouter.current().queryParams) == true){
                      setTimeout(function () {
                          $('#edtSupplierName').trigger("click");
                      }, 200);
                    }else{

                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tsuppliervs1;
                for (let i in useData) {

                    let customerrecordObj = {
                        customerid: useData[i].fields.ID || ' ',
                        customername: useData[i].fields.ClientName || ' ',
                        customeremail: useData[i].fields.Email || ' ',
                        street: useData[i].fields.Street || ' ',
                        street2: useData[i].fields.Street2 || ' ',
                        street3: useData[i].fields.Street3 || ' ',
                        suburb: useData[i].fields.Suburb || ' ',
                        statecode: useData[i].fields.State + ' ' + useData[i].fields.Postcode || ' ',
                        country: useData[i].fields.Country || ' '
                    };
                    //clientList.push(data.tsupplier[i].ClientName,customeremail: data.tsupplier[i].Email);
                    clientList.push(customerrecordObj);

                    //$('#edtSupplierName').editableSelect('add',data.tsupplier[i].ClientName);
                }
                //templateObject.clientrecords.set(clientList);
                templateObject.clientrecords.set(clientList.sort(function(a, b) {
                    if (a.customername == 'NA') {
                        return 1;
                    } else if (b.customername == 'NA') {
                        return -1;
                    }
                    return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                }));

                for (var i = 0; i < clientList.length; i++) {
                    //$('#edtSupplierName').editableSelect('add', clientList[i].customername);
                }
                if(jQuery.isEmptyObject( FlowRouter.current().queryParams) == true){
                  setTimeout(function () {
                      $('#edtSupplierName').trigger("click");
                  }, 200);
                }else{

                }
            }
        }).catch(function(err) {
            clientsService.getSupplierVS1().then(function(data) {
                for (let i in data.tsuppliervs1) {

                    let customerrecordObj = {
                        customerid: data.tsuppliervs1[i].Id || ' ',
                        customername: data.tsuppliervs1[i].ClientName || ' ',
                        customeremail: data.tsuppliervs1[i].Email || ' ',
                        street: data.tsuppliervs1[i].Street || ' ',
                        street2: data.tsuppliervs1[i].Street2 || ' ',
                        street3: data.tsuppliervs1[i].Street3 || ' ',
                        suburb: data.tsuppliervs1[i].Suburb || ' ',
                        statecode: data.tsuppliervs1[i].State + ' ' + data.tsuppliervs1[i].Postcode || ' ',
                        country: data.tsuppliervs1[i].Country || ' '
                    };
                    //clientList.push(data.tsupplier[i].ClientName,customeremail: data.tsupplier[i].Email);
                    clientList.push(customerrecordObj);

                    //$('#edtSupplierName').editableSelect('add',data.tsupplier[i].ClientName);
                }
                //templateObject.clientrecords.set(clientList);
                templateObject.clientrecords.set(clientList.sort(function(a, b) {
                    if (a.customername == 'NA') {
                        return 1;
                    } else if (b.customername == 'NA') {
                        return -1;
                    }
                    return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                }));

                for (var i = 0; i < clientList.length; i++) {
                    //$('#edtSupplierName').editableSelect('add', clientList[i].customername);
                }
                if(jQuery.isEmptyObject( FlowRouter.current().queryParams) == true){
                  setTimeout(function () {
                      $('#edtSupplierName').trigger("click");
                  }, 200);
                }else{

                }
            });
        });

    };
    templateObject.getDepartments = function() {
        getVS1Data('TDeptClass').then(function(dataObject) {
            if (dataObject.length == 0) {
                paymentService.getDepartment().then(function(data) {
                    for (let i in data.tdeptclass) {

                        let deptrecordObj = {
                            department: data.tdeptclass[i].DeptClassName || ' ',
                        };

                        deptrecords.push(deptrecordObj);
                        templateObject.deptrecords.set(deptrecords);

                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tdeptclass;

                for (let i in useData) {

                    let deptrecordObj = {
                        department: useData[i].DeptClassName || ' ',
                    };

                    deptrecords.push(deptrecordObj);
                    templateObject.deptrecords.set(deptrecords);

                }
            }
        }).catch(function(err) {
            paymentService.getDepartment().then(function(data) {
                for (let i in data.tdeptclass) {

                    let deptrecordObj = {
                        department: data.tdeptclass[i].DeptClassName || ' ',
                    };

                    deptrecords.push(deptrecordObj);
                    templateObject.deptrecords.set(deptrecords);

                }
            });
        });

    }

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0)
                $(this).addClass('text-danger')
        });
    };

    templateObject.getDepartments = function() {
        getVS1Data('TDeptClass').then(function(dataObject) {
            if (dataObject.length == 0) {
                paymentService.getDepartment().then(function(data) {
                    for (let i in data.tdeptclass) {

                        let deptrecordObj = {
                            department: data.tdeptclass[i].DeptClassName || ' ',
                        };

                        deptrecords.push(deptrecordObj);
                        templateObject.deptrecords.set(deptrecords);

                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tdeptclass;

                for (let i in useData) {

                    let deptrecordObj = {
                        department: useData[i].DeptClassName || ' ',
                    };

                    deptrecords.push(deptrecordObj);
                    templateObject.deptrecords.set(deptrecords);

                }
            }
        }).catch(function(err) {
            paymentService.getDepartment().then(function(data) {
                for (let i in data.tdeptclass) {

                    let deptrecordObj = {
                        department: data.tdeptclass[i].DeptClassName || ' ',
                    };

                    deptrecords.push(deptrecordObj);
                    templateObject.deptrecords.set(deptrecords);

                }
            });
        });

    }

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0)
                $(this).addClass('text-danger')
        });
    };

    let supplierName = $('#edtSupplierName').val()||'';
    templateObject.getAllSupplierPaymentData = function(supplierName) {
      var splashArrayAwaitingSuppList = new Array();

      sideBarService.getAllAwaitingSupplierPaymentBySupplierName(supplierName).then(function(data) {
          let lineItems = [];
          let lineItemObj = {};
          let totalPaidCal = 0;

          for (let i = 0; i < data.tbillreport.length; i++) {
              if (data.tbillreport[i].Type == "Credit") {
                  totalPaidCal = data.tbillreport[i]['Total Amount (Inc)'] + data.tbillreport[i].Balance;
              } else {
                  totalPaidCal = data.tbillreport[i]['Total Amount (Inc)'] - data.tbillreport[i].Balance;
              }

              let amount = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i]['Total Amount (Inc)']) || 0.00;
              let applied = utilityService.modifynegativeCurrencyFormat(totalPaidCal) || 0.00;
              // Currency+''+data.tpurchaseorder[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
              let balance = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i].Balance) || 0.00;
              let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i].Balance) || 0.00;
              let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i].Balance) || 0.00;
              if (data.tbillreport[i].Type == "Credit") {
                totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i]['Total Amount (Inc)']) || 0.00;
              }
              let totalOrginialAmount = utilityService.modifynegativeCurrencyFormat(data.tbillreport[i]['Total Amount (Inc)']) || 0.00;
              if (data.tbillreport[i].Balance != 0) {
                  if ((data.tbillreport[i].Type == "Purchase Order") || (data.tbillreport[i].Type == "Bill") || (data.tbillreport[i].Type == "Credit")) {
                      var dataListOLD = {
                          id: data.tbillreport[i].PurchaseOrderID || '',
                          sortdate: data.tbillreport[i].OrderDate != '' ? moment(data.tbillreport[i].OrderDate).format("YYYY/MM/DD") : data.tbillreport[i].OrderDate,
                          paymentdate: data.tbillreport[i].OrderDate != '' ? moment(data.tbillreport[i].OrderDate).format("DD/MM/YYYY") : data.tbillreport[i].OrderDate,
                          customername: data.tbillreport[i].Company || '',
                          paymentamount: amount || 0.00,
                          applied: applied || 0.00,
                          balance: balance || 0.00,
                          originalamount: totalOrginialAmount || 0.00,
                          outsandingamount: totalOutstanding || 0.00,
                          ponumber: data.tbillreport[i].PurchaseOrderID || '',

                          refno: data.tbillreport[i].InvoiceNumber || '',
                          paymentmethod: '' || '',
                          notes: data.tbillreport[i].Comments || '',
                          type: data.tbillreport[i].Type || '',
                      };


                      var dataList = [
                         '<div class="custom-control custom-checkbox chkBox pointer"><input class="custom-control-input chkBox chkPaymentCard pointer" type="checkbox" id="formCheck-'+data.tbillreport[i].PurchaseOrderID+'" value="'+totalOutstanding+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tbillreport[i].PurchaseOrderID+'"></label></div>',
                          data.tbillreport[i].OrderDate != '' ? moment(data.tbillreport[i].OrderDate).format("YYYY/MM/DD") : data.tbillreport[i].OrderDate,
                          data.tbillreport[i].OrderDate != '' ? moment(data.tbillreport[i].OrderDate).format("DD/MM/YYYY") : data.tbillreport[i].OrderDate,
                          data.tbillreport[i].InvoiceNumber || '',
                          data.tbillreport[i].PurchaseOrderID || '',
                          applied || 0.00,
                          totalOrginialAmount || 0.00,
                          totalOutstanding || 0.00,
                          data.tbillreport[i].Company || '',
                          data.tbillreport[i].Type || '',
                          data.tbillreport[i].Comments || ''
                      ];

                      //&& (data.tpurchaseorder[i].Invoiced == true)
                      if ((data.tbillreport[i].TotalBalance != 0)) {
                          if ((data.tbillreport[i].Deleted == false)) {
                              if(data.tbillreport[i].Company == supplierName){
                              dataTableList.push(dataListOLD);
                              splashArrayAwaitingSuppList.push(dataList);
                            }
                          }
                      }
                  }
              }
          }
          templateObject.datatablerecords.set(dataTableList);
          templateObject.datatablerecords1.set(dataTableList);

          $('.fullScreenSpin').css('display', 'none');
          setTimeout(function() {
              //$.fn.dataTable.moment('DD/MM/YY');
              $('#tblSupplierAwaitingCard').DataTable({
                  data: splashArrayAwaitingSuppList,
                  columnDefs: [{
                      className: "chkBox",
                      "orderable": false,
                      "targets": [0]
                  }, {
                      className: "colSortDate hiddenColumn",
                      "targets": [1]
                  }, {
                      className: "colPaymentDate",
                      "targets": [2]
                  }, {
                      className: "colReceiptNo",
                      "targets": [3]
                  }, {
                      className: "colPONumber",
                      "targets": [4]
                  }, {
                      className: "colPaymentAmount text-right",
                      "targets": [5]
                  }, {
                      className: "colApplied text-right",
                      "targets": [6]
                  }, {
                      className: "colBalance text-right",
                      "targets": [7]
                  }, {
                      className: "colSupplierName",
                      "targets": [8],    // this will invoke the below function on all cells
                      'createdCell': function(td, cellData, rowData, row, col) {
                        // this will give each cell an ID
                        $(td).closest('tr').attr('id', rowData[4]);
                        $(td).attr('id', 'colSupplierName' + rowData[4]);
                      }
                  }, {
                      className: "colTypePayment",
                      "targets": [9],    // this will invoke the below function on all cells
                      'createdCell': function(td, cellData, rowData, row, col) {
                        // this will give each cell an ID
                        $(td).attr('id', 'coltype' + rowData[4]);
                      }
                  }, {
                      className: "colNotes",
                      "targets": [10]
                  }],
                  "sDom": "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [{
                      extend: 'excelHtml5',
                      text: '',
                      download: 'open',
                      className: "btntabletocsv hiddenColumn",
                      filename: "Awaiting Supplier Payments List - " + moment().format(),
                      orientation: 'portrait',
                      exportOptions: {
                          columns: ':visible:not(.chkBox)',
                          format: {
                              body: function(data, row, column) {
                                  if (data.includes("</span>")) {
                                      var res = data.split("</span>");
                                      data = res[1];
                                  }

                                  return column === 1 ? data.replace(/<.*?>/ig, "") : data;

                              }
                          }
                      }
                  }, {
                      extend: 'print',
                      download: 'open',
                      className: "btntabletopdf hiddenColumn",
                      text: '',
                      title: 'Supplier Payment',
                      filename: "Awaiting Supplier Payments List - " + moment().format(),
                      exportOptions: {
                          columns: ':visible:not(.chkBox)',
                          stripHtml: false
                      }
                  }],
                  select: true,
                  destroy: true,
                  colReorder: true,
                  colReorder: {
                      fixedColumnsLeft: 1
                  },
                  paging: false,
                  "scrollY": "400px",
                  "scrollCollapse": true,
                  info: true,
                  responsive: true,
                  "order": [
                      [1, "desc"]
                  ],
                  // "aaSorting": [[1,'desc']],
                  action: function() {
                      $('#tblSupplierAwaitingCard').DataTable().ajax.reload();
                  },
                  "fnDrawCallback": function(oSettings) {
                      setTimeout(function() {
                          MakeNegative();
                      }, 100);
                  },

              }).on('page', function() {
                  setTimeout(function() {
                      MakeNegative();
                  }, 100);
                  let draftRecord = templateObject.datatablerecords.get();
                  templateObject.datatablerecords.set(draftRecord);
              }).on('column-reorder', function() {}).on('length.dt', function(e, settings, len) {
                  setTimeout(function() {
                      MakeNegative();
                  }, 100);
              });
              $('.fullScreenSpin').css('display', 'none');
          }, 0);

          $('div.dataTables_filter input').addClass('form-control form-control-sm');


      }).catch(function(err) {
          // Bert.alert('<strong>' + err + '</strong>!', 'danger');
          $('.fullScreenSpin').css('display', 'none');
          // Meteor._reload.reload();
      });


    }

    templateObject.getPaymentMethods = function() {
        getVS1Data('TPaymentMethod').then(function(dataObject) {
            if (dataObject.length == 0) {
                paymentService.getPaymentMethodVS1().then(function(data) {
                    for (let i in data.tpaymentmethodvs1) {

                        let paymentmethodrecordObj = {
                            paymentmethod: data.tpaymentmethodvs1[i].PaymentMethodName || ' ',
                        };
                        if(FlowRouter.current().queryParams.id){

                        }else{
                          if(data.tpaymentmethodvs1[i].IsCreditCard == true){
                            setTimeout(function() {
                              $('#sltPaymentMethod').val(data.tpaymentmethodvs1[i].PaymentMethodName);
                            }, 200);
                          }
                        }
                        paymentmethodrecords.push(paymentmethodrecordObj);


                    }
                    templateObject.paymentmethodrecords.set(paymentmethodrecords);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tpaymentmethodvs1;
                for (let i in useData) {

                    let paymentmethodrecordObj = {
                        paymentmethod: useData[i].fields.PaymentMethodName || ' ',
                    };
                    if(FlowRouter.current().queryParams.id){

                    }else{
                      if(useData[i].fields.IsCreditCard == true){
                        setTimeout(function() {
                          $('#sltPaymentMethod').val(useData[i].fields.PaymentMethodName);
                        }, 200);
                      }
                    }
                    paymentmethodrecords.push(paymentmethodrecordObj);


                }
                templateObject.paymentmethodrecords.set(paymentmethodrecords);
            }

        }).catch(function(err) {
            paymentService.getPaymentMethodVS1().then(function(data) {
                for (let i in data.tpaymentmethodvs1) {

                    let paymentmethodrecordObj = {
                        paymentmethod: data.tpaymentmethodvs1[i].PaymentMethodName || ' ',
                    };
                    if(FlowRouter.current().queryParams.id){

                    }else{
                      if(data.tpaymentmethodvs1[i].IsCreditCard == true){
                        setTimeout(function() {
                          $('#sltPaymentMethod').val(data.tpaymentmethodvs1[i].PaymentMethodName);
                        }, 200);
                      }
                    }
                    paymentmethodrecords.push(paymentmethodrecordObj);


                }
                templateObject.paymentmethodrecords.set(paymentmethodrecords);
            });
        });

    }

    templateObject.getAccountNames = function() {
        getVS1Data('TAccountVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                paymentService.getAccountNameVS1().then(function(data) {
                    for (let i in data.taccountvs1) {

                        let accountnamerecordObj = {
                            accountname: data.taccountvs1[i].AccountName || ' '
                        };
                        // $('#edtBankAccountName').editableSelect('add',data.taccount[i].AccountName);
                        if (data.taccountvs1[i].AccountTypeName == "BANK" || data.taccountvs1[i].AccountTypeName.toUpperCase() == "CCARD" || data.taccountvs1[i].AccountTypeName.toUpperCase() == "OCLIAB") {
                            accountnamerecords.push(accountnamerecordObj);
                        }
                        templateObject.accountnamerecords.set(accountnamerecords);
                        if (templateObject.accountnamerecords.get()) {
                            setTimeout(function() {
                                var usedNames = {};
                                $("select[name='edtBankAccountName'] > option").each(function() {
                                    if (usedNames[this.text]) {
                                        $(this).remove();
                                    } else {
                                        usedNames[this.text] = this.value;
                                    }
                                });
                            }, 1000);
                        }

                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.taccountvs1;

                for (let i in useData) {

                    let accountnamerecordObj = {
                        accountname: useData[i].fields.AccountName || ' '
                    };
                    // $('#edtBankAccountName').editableSelect('add',data.taccount[i].AccountName);
                    if (useData[i].fields.AccountTypeName.replace(/\s/g, '') == "BANK" || useData[i].fields.AccountTypeName.toUpperCase() == "CCARD" || useData[i].fields.AccountTypeName.toUpperCase() == "OCLIAB") {
                        accountnamerecords.push(accountnamerecordObj);
                    }
                    //accountnamerecords.push(accountnamerecordObj);
                    templateObject.accountnamerecords.set(accountnamerecords);
                    if (templateObject.accountnamerecords.get()) {
                        setTimeout(function() {
                            var usedNames = {};
                            $("select[name='edtBankAccountName'] > option").each(function() {
                                if (usedNames[this.text]) {
                                    $(this).remove();
                                } else {
                                    usedNames[this.text] = this.value;
                                }
                            });

                        }, 1000);
                    }

                }

            }
        }).catch(function(err) {
            paymentService.getAccountNameVS1().then(function(data) {
                for (let i in data.taccountvs1) {

                    let accountnamerecordObj = {
                        accountname: data.taccountvs1[i].AccountName || ' '
                    };
                    // $('#edtBankAccountName').editableSelect('add',data.taccount[i].AccountName);
                    if (data.taccountvs1[i].AccountTypeName == "BANK" || data.taccountvs1[i].AccountTypeName.toUpperCase() == "CCARD" || data.taccountvs1[i].AccountTypeName.toUpperCase() == "OCLIAB") {
                        accountnamerecords.push(accountnamerecordObj);
                    }
                    templateObject.accountnamerecords.set(accountnamerecords);
                    if (templateObject.accountnamerecords.get()) {
                        setTimeout(function() {
                            var usedNames = {};
                            $("select[name='edtBankAccountName'] > option").each(function() {
                                if (usedNames[this.text]) {
                                    $(this).remove();
                                } else {
                                    usedNames[this.text] = this.value;
                                }
                            });
                        }, 1000);
                    }

                }
            });
        });

    }

    templateObject.getAllClients();
    templateObject.getDepartments();
    templateObject.getPaymentMethods();
    templateObject.getAccountNames();
    setTimeout(function() {
    if(supplierName != ''){
        templateObject.getAllSupplierPaymentData(supplierName);
    }

    }, 500);

    $(document).on("click", "#departmentList tbody tr", function(e) {
        $('#sltDepartment').val($(this).find(".colDeptName").text());
        $('#departmentModal').modal('toggle');
    });

    $(document).on("click", "#paymentmethodList tbody tr", function(e) {
        $('#sltPaymentMethod').val($(this).find(".colName").text());
        $('#paymentMethodModal').modal('toggle');
    });

    $(document).on("click", "#tblAccount tbody tr", function(e) {
        //$(".colProductName").removeClass('boldtablealertsborder');
        let selectLineID = $('#selectLineID').val();
        var table = $(this);
        let utilityService = new UtilityService();
        let $tblrows = $("#tblStockAdjustmentLine tbody tr");

        let accountname = table.find(".productName").text();
        $('#accountListModal').modal('toggle');
        $('#edtSelectBankAccountName').val(accountname);
        if ($tblrows.find(".lineProductName").val() == '') {
            //$tblrows.find(".colProductName").addClass('boldtablealertsborder');
        }

        $('#tblAccount_filter .form-control-sm').val('');
        setTimeout(function() {
            $('.btnRefreshAccount').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $(document).on("click", "#tblSupplierlist tbody tr", function(e) {
        let suppliers = templateObject.clientrecords.get();
        var tableSupplier = $(this);
          let $tblrows = $("#tblSupplierPaymentcard tbody tr");
        $('#edtSupplierName').val(tableSupplier.find(".colCompany").text());
        // $('#edtSupplierName').attr("custid", tableSupplier.find(".colID").text());
        $('#supplierListModal').modal('toggle');

        $('#edtSupplierEmail').val(tableSupplier.find(".colEmail").text());
        $('#edtSupplierEmail').attr('customerid', tableSupplier.find(".colID").text());


        let postalAddress = tableSupplier.find(".colCompany").text() + '\n' + tableSupplier.find(".colStreetAddress").text() + '\n' + tableSupplier.find(".colCity").text() + ' ' + tableSupplier.find(".colState").text() + ' ' + tableSupplier.find(".colZipCode").text() + '\n' + tableSupplier.find(".colCountry").text();
        $('#txabillingAddress').val(postalAddress);

        let selectedCustomer = $('#edtSupplierName').val();
        // if (clientList) {
        //     $('#edtCustomerEmail').val(clientList[i].customeremail);
        //     $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
        //     let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
        //     $('#txabillingAddress').val(postalAddress);
        // }
        let isEmptyData = false;
        if(jQuery.isEmptyObject(FlowRouter.current().queryParams) == true){
          if($tblrows.length > 0){
          $tblrows.each(function (index) {
            var $tblrow = $(this);
            if ($tblrow.find(".colTransNo").val() == '') {
                isEmptyData = true;
            }else{
              isEmptyData = false;
            }
          });
        }else{
          isEmptyData = true;
        }
          setTimeout(function() {
            if(isEmptyData){
              $('#addRow').trigger('click');
            }
          }, 500);

        }


        $('#tblSupplierlist_filter .form-control-sm').val('');
        setTimeout(function() {
            $('.btnRefreshSupplier').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
    });

    $('#sltDepartment').editableSelect();
    $('#sltPaymentMethod').editableSelect();
    $('#edtSelectBankAccountName').editableSelect();

    $('#edtSelectBankAccountName').editableSelect()
        .on('click.editable-select', function(e, li) {
            var $earch = $(this);
            var offset = $earch.offset();
            let accountService = new AccountService();
            const accountTypeList = [];
            var accountDataName = e.target.value || '';

            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#selectLineID').val('');
                $('#accountListModal').modal();
                setTimeout(function() {
                    $('#tblAccount_filter .form-control-sm').focus();
                    $('#tblAccount_filter .form-control-sm').val('');
                    $('#tblAccount_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblAccountlist').DataTable();
                    datatable.draw();
                    $('#tblAccountlist_filter .form-control-sm').trigger("input");
                }, 500);
            } else {
                if (accountDataName.replace(/\s/g, '') != '') {
                    getVS1Data('TAccountVS1').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            accountService.getOneAccountByName(accountDataName).then(function(data) {
                                if (accountTypeList) {
                                    for (var h = 0; h < accountTypeList.length; h++) {

                                        if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                            fullAccountTypeName = accountTypeList[h].description || '';

                                        }
                                    }

                                }

                                var accountid = data.taccountvs1[0].fields.ID || '';
                                var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                                var accountname = data.taccountvs1[0].fields.AccountName || '';
                                var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                                var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                                var accountdesc = data.taccountvs1[0].fields.Description || '';
                                var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                                var bankbsb = data.taccountvs1[0].fields.BSB || '';
                                var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                                var swiftCode = data.taccountvs1[0].fields.Extra || '';
                                var routingNo = data.taccountvs1[0].fields.BankCode || '';

                                var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                                var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                                var cardcvc = data.taccountvs1[0].fields.CVC || '';
                                var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                                if ((accounttype === "BANK")) {
                                    $('.isBankAccount').removeClass('isNotBankAccount');
                                    $('.isCreditAccount').addClass('isNotCreditAccount');
                                } else if ((accounttype === "CCARD")) {
                                    $('.isCreditAccount').removeClass('isNotCreditAccount');
                                    $('.isBankAccount').addClass('isNotBankAccount');
                                } else {
                                    $('.isBankAccount').addClass('isNotBankAccount');
                                    $('.isCreditAccount').addClass('isNotCreditAccount');
                                }

                                $('#edtAccountID').val(accountid);
                                $('#sltAccountType').val(accounttype);
                                $('#sltAccountType').append('<option value="' + accounttype + '" selected="selected">' + accounttype + '</option>');
                                $('#edtAccountName').val(accountname);
                                $('#edtAccountNo').val(accountno);
                                $('#sltTaxCode').val(taxcode);
                                $('#txaAccountDescription').val(accountdesc);
                                $('#edtBankAccountName').val(bankaccountname);
                                $('#edtBSB').val(bankbsb);
                                $('#edtBankAccountNo').val(bankacountno);
                                $('#swiftCode').val(swiftCode);
                                $('#routingNo').val(routingNo);
                                $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                                $('#edtCardNumber').val(cardnumber);
                                $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                                $('#edtCvc').val(cardcvc);

                                if (showTrans == 'true') {
                                    $('.showOnTransactions').prop('checked', true);
                                } else {
                                    $('.showOnTransactions').prop('checked', false);
                                }

                                setTimeout(function() {
                                    $('#addNewAccount').modal('show');
                                }, 500);

                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.taccountvs1;
                            var added = false;
                            let lineItems = [];
                            let lineItemObj = {};
                            let fullAccountTypeName = '';
                            let accBalance = '';
                            $('#add-account-title').text('Edit Account Details');
                            $('#edtAccountName').attr('readonly', true);
                            $('#sltAccountType').attr('readonly', true);
                            $('#sltAccountType').attr('disabled', 'disabled');
                            for (let a = 0; a < data.taccountvs1.length; a++) {

                                if ((data.taccountvs1[a].fields.AccountName) === accountDataName) {
                                    added = true;
                                    if (accountTypeList) {
                                        for (var h = 0; h < accountTypeList.length; h++) {

                                            if (data.taccountvs1[a].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                                fullAccountTypeName = accountTypeList[h].description || '';

                                            }
                                        }

                                    }

                                    var accountid = data.taccountvs1[a].fields.ID || '';
                                    var accounttype = fullAccountTypeName || data.taccountvs1[a].fields.AccountTypeName;
                                    var accountname = data.taccountvs1[a].fields.AccountName || '';
                                    var accountno = data.taccountvs1[a].fields.AccountNumber || '';
                                    var taxcode = data.taccountvs1[a].fields.TaxCode || '';
                                    var accountdesc = data.taccountvs1[a].fields.Description || '';
                                    var bankaccountname = data.taccountvs1[a].fields.BankAccountName || '';
                                    var bankbsb = data.taccountvs1[a].fields.BSB || '';
                                    var bankacountno = data.taccountvs1[a].fields.BankAccountNumber || '';

                                    var swiftCode = data.taccountvs1[a].fields.Extra || '';
                                    var routingNo = data.taccountvs1[a].BankCode || '';

                                    var showTrans = data.taccountvs1[a].fields.IsHeader || false;

                                    var cardnumber = data.taccountvs1[a].fields.CarNumber || '';
                                    var cardcvc = data.taccountvs1[a].fields.CVC || '';
                                    var cardexpiry = data.taccountvs1[a].fields.ExpiryDate || '';

                                    if ((accounttype === "BANK")) {
                                        $('.isBankAccount').removeClass('isNotBankAccount');
                                        $('.isCreditAccount').addClass('isNotCreditAccount');
                                    } else if ((accounttype === "CCARD")) {
                                        $('.isCreditAccount').removeClass('isNotCreditAccount');
                                        $('.isBankAccount').addClass('isNotBankAccount');
                                    } else {
                                        $('.isBankAccount').addClass('isNotBankAccount');
                                        $('.isCreditAccount').addClass('isNotCreditAccount');
                                    }

                                    $('#edtAccountID').val(accountid);
                                    $('#sltAccountType').val(accounttype);
                                    $('#sltAccountType').append('<option value="' + accounttype + '" selected="selected">' + accounttype + '</option>');
                                    $('#edtAccountName').val(accountname);
                                    $('#edtAccountNo').val(accountno);
                                    $('#sltTaxCode').val(taxcode);
                                    $('#txaAccountDescription').val(accountdesc);
                                    $('#edtBankAccountName').val(bankaccountname);
                                    $('#edtBSB').val(bankbsb);
                                    $('#edtBankAccountNo').val(bankacountno);
                                    $('#swiftCode').val(swiftCode);
                                    $('#routingNo').val(routingNo);
                                    $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                                    $('#edtCardNumber').val(cardnumber);
                                    $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                                    $('#edtCvc').val(cardcvc);

                                    if (showTrans == 'true') {
                                        $('.showOnTransactions').prop('checked', true);
                                    } else {
                                        $('.showOnTransactions').prop('checked', false);
                                    }

                                    setTimeout(function() {
                                        $('#addNewAccount').modal('show');
                                    }, 500);

                                }
                            }
                            if (!added) {
                                accountService.getOneAccountByName(accountDataName).then(function(data) {
                                    if (accountTypeList) {
                                        for (var h = 0; h < accountTypeList.length; h++) {

                                            if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                                fullAccountTypeName = accountTypeList[h].description || '';

                                            }
                                        }

                                    }

                                    var accountid = data.taccountvs1[0].fields.ID || '';
                                    var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                                    var accountname = data.taccountvs1[0].fields.AccountName || '';
                                    var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                                    var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                                    var accountdesc = data.taccountvs1[0].fields.Description || '';
                                    var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                                    var bankbsb = data.taccountvs1[0].fields.BSB || '';
                                    var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                                    var swiftCode = data.taccountvs1[0].fields.Extra || '';
                                    var routingNo = data.taccountvs1[0].fields.BankCode || '';

                                    var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                                    var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                                    var cardcvc = data.taccountvs1[0].fields.CVC || '';
                                    var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                                    if ((accounttype === "BANK")) {
                                        $('.isBankAccount').removeClass('isNotBankAccount');
                                        $('.isCreditAccount').addClass('isNotCreditAccount');
                                    } else if ((accounttype === "CCARD")) {
                                        $('.isCreditAccount').removeClass('isNotCreditAccount');
                                        $('.isBankAccount').addClass('isNotBankAccount');
                                    } else {
                                        $('.isBankAccount').addClass('isNotBankAccount');
                                        $('.isCreditAccount').addClass('isNotCreditAccount');
                                    }

                                    $('#edtAccountID').val(accountid);
                                    $('#sltAccountType').val(accounttype);
                                    $('#sltAccountType').append('<option value="' + accounttype + '" selected="selected">' + accounttype + '</option>');
                                    $('#edtAccountName').val(accountname);
                                    $('#edtAccountNo').val(accountno);
                                    $('#sltTaxCode').val(taxcode);
                                    $('#txaAccountDescription').val(accountdesc);
                                    $('#edtBankAccountName').val(bankaccountname);
                                    $('#edtBSB').val(bankbsb);
                                    $('#edtBankAccountNo').val(bankacountno);
                                    $('#swiftCode').val(swiftCode);
                                    $('#routingNo').val(routingNo);
                                    $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                                    $('#edtCardNumber').val(cardnumber);
                                    $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                                    $('#edtCvc').val(cardcvc);

                                    if (showTrans == 'true') {
                                        $('.showOnTransactions').prop('checked', true);
                                    } else {
                                        $('.showOnTransactions').prop('checked', false);
                                    }

                                    setTimeout(function() {
                                        $('#addNewAccount').modal('show');
                                    }, 500);

                                }).catch(function(err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }

                        }
                    }).catch(function(err) {
                        accountService.getOneAccountByName(accountDataName).then(function(data) {
                            if (accountTypeList) {
                                for (var h = 0; h < accountTypeList.length; h++) {

                                    if (data.taccountvs1[0].fields.AccountTypeName === accountTypeList[h].accounttypename) {

                                        fullAccountTypeName = accountTypeList[h].description || '';

                                    }
                                }

                            }

                            var accountid = data.taccountvs1[0].fields.ID || '';
                            var accounttype = fullAccountTypeName || data.taccountvs1[0].fields.AccountTypeName;
                            var accountname = data.taccountvs1[0].fields.AccountName || '';
                            var accountno = data.taccountvs1[0].fields.AccountNumber || '';
                            var taxcode = data.taccountvs1[0].fields.TaxCode || '';
                            var accountdesc = data.taccountvs1[0].fields.Description || '';
                            var bankaccountname = data.taccountvs1[0].fields.BankAccountName || '';
                            var bankbsb = data.taccountvs1[0].fields.BSB || '';
                            var bankacountno = data.taccountvs1[0].fields.BankAccountNumber || '';

                            var swiftCode = data.taccountvs1[0].fields.Extra || '';
                            var routingNo = data.taccountvs1[0].fields.BankCode || '';

                            var showTrans = data.taccountvs1[0].fields.IsHeader || false;

                            var cardnumber = data.taccountvs1[0].fields.CarNumber || '';
                            var cardcvc = data.taccountvs1[0].fields.CVC || '';
                            var cardexpiry = data.taccountvs1[0].fields.ExpiryDate || '';

                            if ((accounttype === "BANK")) {
                                $('.isBankAccount').removeClass('isNotBankAccount');
                                $('.isCreditAccount').addClass('isNotCreditAccount');
                            } else if ((accounttype === "CCARD")) {
                                $('.isCreditAccount').removeClass('isNotCreditAccount');
                                $('.isBankAccount').addClass('isNotBankAccount');
                            } else {
                                $('.isBankAccount').addClass('isNotBankAccount');
                                $('.isCreditAccount').addClass('isNotCreditAccount');
                            }

                            $('#edtAccountID').val(accountid);
                            $('#sltAccountType').val(accounttype);
                            $('#sltAccountType').append('<option value="' + accounttype + '" selected="selected">' + accounttype + '</option>');
                            $('#edtAccountName').val(accountname);
                            $('#edtAccountNo').val(accountno);
                            $('#sltTaxCode').val(taxcode);
                            $('#txaAccountDescription').val(accountdesc);
                            $('#edtBankAccountName').val(bankaccountname);
                            $('#edtBSB').val(bankbsb);
                            $('#edtBankAccountNo').val(bankacountno);
                            $('#swiftCode').val(swiftCode);
                            $('#routingNo').val(routingNo);
                            $('#edtBankName').val(localStorage.getItem('vs1companyBankName') || '');

                            $('#edtCardNumber').val(cardnumber);
                            $('#edtExpiryDate').val(cardexpiry ? moment(cardexpiry).format('DD/MM/YYYY') : "");
                            $('#edtCvc').val(cardcvc);

                            if (showTrans == 'true') {
                                $('.showOnTransactions').prop('checked', true);
                            } else {
                                $('.showOnTransactions').prop('checked', false);
                            }

                            setTimeout(function() {
                                $('#addNewAccount').modal('show');
                            }, 500);

                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                    });
                    $('#addAccountModal').modal('toggle');
                } else {
                    $('#selectLineID').val('');
                    $('#accountListModal').modal();
                    setTimeout(function() {
                        $('#tblAccount_filter .form-control-sm').focus();
                        $('#tblAccount_filter .form-control-sm').val('');
                        $('#tblAccount_filter .form-control-sm').trigger("input");
                        var datatable = $('#tblSupplierlist').DataTable();
                        datatable.draw();
                        $('#tblAccount_filter .form-control-sm').trigger("input");
                    }, 500);
                }
            }

        });

    $('#sltPaymentMethod').editableSelect()
        .on('click.editable-select', function(e, li) {
            var $earch = $(this);
            var offset = $earch.offset();
            var paymentDataName = e.target.value || '';
            $('#edtPaymentMethodID').val('');
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#paymentMethodModal').modal('toggle');
            } else {
                if (paymentDataName.replace(/\s/g, '') != '') {
                    $('#paymentMethodHeader').text('Edit Payment Method');

                    getVS1Data('TPaymentMethod').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getPaymentMethodDataVS1().then(function(data) {
                                for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                                    if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                        $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                        $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                        if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                            $('#isformcreditcard').prop('checked', true);
                                        } else {
                                            $('#isformcreditcard').prop('checked', false);
                                        }
                                    }
                                }
                                setTimeout(function() {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newPaymentMethodModal').modal('toggle');
                                }, 200);
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tpaymentmethodvs1;

                            for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                                if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                    $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                    $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                    if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                        $('#isformcreditcard').prop('checked', true);
                                    } else {
                                        $('#isformcreditcard').prop('checked', false);
                                    }
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newPaymentMethodModal').modal('toggle');
                            }, 200);
                        }
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getPaymentMethodDataVS1().then(function(data) {
                            for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                                if (data.tpaymentmethodvs1[i].fields.PaymentMethodName === paymentDataName) {
                                    $('#edtPaymentMethodID').val(data.tpaymentmethodvs1[i].fields.ID);
                                    $('#edtPaymentMethodName').val(data.tpaymentmethodvs1[i].fields.PaymentMethodName);
                                    if (data.tpaymentmethodvs1[i].fields.IsCreditCard === true) {
                                        $('#isformcreditcard').prop('checked', true);
                                    } else {
                                        $('#isformcreditcard').prop('checked', false);
                                    }
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newPaymentMethodModal').modal('toggle');
                            }, 200);
                        });
                    });
                } else {
                    $('#paymentMethodModal').modal();
                    setTimeout(function() {
                        $('#paymentmethodList_filter .form-control-sm').focus();
                        $('#paymentmethodList_filter .form-control-sm').val('');
                        $('#paymentmethodList_filter .form-control-sm').trigger("input");
                        var datatable = $('#paymentmethodList').DataTable();
                        datatable.draw();
                        $('#paymentmethodList_filter .form-control-sm').trigger("input");
                    }, 500);
                }
            }
        });

    $('#sltDepartment').editableSelect()
        .on('click.editable-select', function(e, li) {
            var $earch = $(this);
            var offset = $earch.offset();
            var deptDataName = e.target.value || '';
            $('#edtDepartmentID').val('');
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#departmentModal').modal('toggle');
            } else {
                if (deptDataName.replace(/\s/g, '') != '') {
                    $('#newDeptHeader').text('Edit Department');

                    getVS1Data('TDeptClass').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getDepartment().then(function(data) {
                                for (let i = 0; i < data.tdeptclass.length; i++) {
                                    if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                        $('#edtDepartmentID').val(data.tdeptclass[i].Id);
                                        $('#edtNewDeptName').val(data.tdeptclass[i].DeptClassName);
                                        $('#edtSiteCode').val(data.tdeptclass[i].SiteCode);
                                        $('#edtDeptDesc').val(data.tdeptclass[i].Description);
                                    }
                                }
                                setTimeout(function() {
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#newDepartmentModal').modal('toggle');
                                }, 200);
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tdeptclass;
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                    $('#edtDepartmentID').val(useData[i].Id);
                                    $('#edtNewDeptName').val(useData[i].DeptClassName);
                                    $('#edtSiteCode').val(useData[i].SiteCode);
                                    $('#edtDeptDesc').val(useData[i].Description);
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newDepartmentModal').modal('toggle');
                            }, 200);
                        }
                    }).catch(function(err) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getDepartment().then(function(data) {
                            for (let i = 0; i < data.tdeptclass.length; i++) {
                                if (data.tdeptclass[i].DeptClassName === deptDataName) {
                                    $('#edtDepartmentID').val(data.tdeptclass[i].Id);
                                    $('#edtNewDeptName').val(data.tdeptclass[i].DeptClassName);
                                    $('#edtSiteCode').val(data.tdeptclass[i].SiteCode);
                                    $('#edtDeptDesc').val(data.tdeptclass[i].Description);
                                }
                            }
                            setTimeout(function() {
                                $('.fullScreenSpin').css('display', 'none');
                                $('#newDepartmentModal').modal('toggle');
                            }, 200);
                        });
                    });
                } else {
                    $('#departmentModal').modal();
                    setTimeout(function() {
                        $('#departmentList_filter .form-control-sm').focus();
                        $('#departmentList_filter .form-control-sm').val('');
                        $('#departmentList_filter .form-control-sm').trigger("input");
                        var datatable = $('#departmentList').DataTable();
                        datatable.draw();
                        $('#departmentList_filter .form-control-sm').trigger("input");
                    }, 500);
                }
            }
        });

    $('#edtSupplierName').editableSelect()
        .on('select.editable-select', function(e, li) {
            let selectedSupplier = li.text();
            if (clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    if (clientList[i].customername == selectedSupplier) {
                        $('#edtSupplierEmail').val(clientList[i].customeremail);
                        $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                        let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                        $('#txabillingAddress').val(postalAddress);
                    }
                }
            }
        });

    $('#edtSupplierName').editableSelect().on('click.editable-select', function(e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        $('#edtSupplierPOPID').val('');
        var supplierDataName = e.target.value || '';

        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $('#supplierListModal').modal();
            setTimeout(function() {
                $('#tblSupplierlist_filter .form-control-sm').focus();
                $('#tblSupplierlist_filter .form-control-sm').val('');
                $('#tblSupplierlist_filter .form-control-sm').trigger("input");
                var datatable = $('#tblSupplierlist').DataTable();
                datatable.draw();
                $('#tblSupplierlist_filter .form-control-sm').trigger("input");
            }, 500);
        } else {
            if (supplierDataName.replace(/\s/g, '') != '') {
                //FlowRouter.go('/supplierscard?name=' + e.target.value);
                getVS1Data('TSupplierVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getOneSupplierDataExByName(supplierDataName).then(function(data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];

                            $('#add-supplier-title').text('Edit Supplier');
                            let popSupplierID = data.tsupplier[0].fields.ID || '';
                            let popSupplierName = data.tsupplier[0].fields.ClientName || '';
                            let popSupplierEmail = data.tsupplier[0].fields.Email || '';
                            let popSupplierTitle = data.tsupplier[0].fields.Title || '';
                            let popSupplierFirstName = data.tsupplier[0].fields.FirstName || '';
                            let popSupplierMiddleName = data.tsupplier[0].fields.CUSTFLD10 || '';
                            let popSupplierLastName = data.tsupplier[0].fields.LastName || '';
                            let popSuppliertfn = '' || '';
                            let popSupplierPhone = data.tsupplier[0].fields.Phone || '';
                            let popSupplierMobile = data.tsupplier[0].fields.Mobile || '';
                            let popSupplierFaxnumber = data.tsupplier[0].fields.Faxnumber || '';
                            let popSupplierSkypeName = data.tsupplier[0].fields.SkypeName || '';
                            let popSupplierURL = data.tsupplier[0].fields.URL || '';
                            let popSupplierStreet = data.tsupplier[0].fields.Street || '';
                            let popSupplierStreet2 = data.tsupplier[0].fields.Street2 || '';
                            let popSupplierState = data.tsupplier[0].fields.State || '';
                            let popSupplierPostcode = data.tsupplier[0].fields.Postcode || '';
                            let popSupplierCountry = data.tsupplier[0].fields.Country || LoggedCountry;
                            let popSupplierbillingaddress = data.tsupplier[0].fields.BillStreet || '';
                            let popSupplierbcity = data.tsupplier[0].fields.BillStreet2 || '';
                            let popSupplierbstate = data.tsupplier[0].fields.BillState || '';
                            let popSupplierbpostalcode = data.tsupplier[0].fields.BillPostcode || '';
                            let popSupplierbcountry = data.tsupplier[0].fields.Billcountry || LoggedCountry;
                            let popSuppliercustfield1 = data.tsupplier[0].fields.CUSTFLD1 || '';
                            let popSuppliercustfield2 = data.tsupplier[0].fields.CUSTFLD2 || '';
                            let popSuppliercustfield3 = data.tsupplier[0].fields.CUSTFLD3 || '';
                            let popSuppliercustfield4 = data.tsupplier[0].fields.CUSTFLD4 || '';
                            let popSuppliernotes = data.tsupplier[0].fields.Notes || '';
                            let popSupplierpreferedpayment = data.tsupplier[0].fields.PaymentMethodName || '';
                            let popSupplierterms = data.tsupplier[0].fields.TermsName || '';
                            let popSupplierdeliverymethod = data.tsupplier[0].fields.ShippingMethodName || '';
                            let popSupplieraccountnumber = data.tsupplier[0].fields.ClientNo || '';
                            let popSupplierisContractor = data.tsupplier[0].fields.Contractor || false;
                            let popSupplierissupplier = data.tsupplier[0].fields.IsSupplier || false;
                            let popSupplieriscustomer = data.tsupplier[0].fields.IsCustomer || false;

                            $('#edtSupplierCompany').val(popSupplierName);
                            $('#edtSupplierPOPID').val(popSupplierID);
                            $('#edtSupplierCompanyEmail').val(popSupplierEmail);
                            $('#edtSupplierTitle').val(popSupplierTitle);
                            $('#edtSupplierFirstName').val(popSupplierFirstName);
                            $('#edtSupplierMiddleName').val(popSupplierMiddleName);
                            $('#edtSupplierLastName').val(popSupplierLastName);
                            $('#edtSupplierPhone').val(popSupplierPhone);
                            $('#edtSupplierMobile').val(popSupplierMobile);
                            $('#edtSupplierFax').val(popSupplierFaxnumber);
                            $('#edtSupplierSkypeID').val(popSupplierSkypeName);
                            $('#edtSupplierWebsite').val(popSupplierURL);
                            $('#edtSupplierShippingAddress').val(popSupplierStreet);
                            $('#edtSupplierShippingCity').val(popSupplierStreet2);
                            $('#edtSupplierShippingState').val(popSupplierState);
                            $('#edtSupplierShippingZIP').val(popSupplierPostcode);
                            $('#sedtCountry').val(popSupplierCountry);
                            $('#txaNotes').val(popSuppliernotes);
                            $('#sltPreferedPayment').val(popSupplierpreferedpayment);
                            $('#sltTerms').val(popSupplierterms);
                            $('#suppAccountNo').val(popSupplieraccountnumber);
                            $('#edtCustomeField1').val(popSuppliercustfield1);
                            $('#edtCustomeField2').val(popSuppliercustfield2);
                            $('#edtCustomeField3').val(popSuppliercustfield3);
                            $('#edtCustomeField4').val(popSuppliercustfield4);

                            if ((data.tsupplier[0].fields.Street == data.tsupplier[0].fields.BillStreet) && (data.tsupplier[0].fields.Street2 == data.tsupplier[0].fields.BillStreet2) &&
                                (data.tsupplier[0].fields.State == data.tsupplier[0].fields.BillState) && (data.tsupplier[0].fields.Postcode == data.tsupplier[0].fields.Postcode) &&
                                (data.tsupplier[0].fields.Country == data.tsupplier[0].fields.Billcountry)) {
                                //templateObject.isSameAddress.set(true);
                                $('#chkSameAsShipping').attr("checked", "checked");
                            }
                            if (data.tsupplier[0].fields.Contractor == true) {
                                // $('#isformcontractor')
                                $('#isformcontractor').attr("checked", "checked");
                            } else {
                                $('#isformcontractor').removeAttr("checked");
                            }

                            setTimeout(function() {
                                $('#addSupplierModal').modal('show');
                            }, 200);



                        }).catch(function(err) {

                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tsuppliervs1;
                        var added = false;
                        for (let i = 0; i < data.tsuppliervs1.length; i++) {
                            if ((data.tsuppliervs1[i].fields.ClientName) === supplierDataName) {
                                added = true;
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                $('#add-supplier-title').text('Edit Supplier');
                                let popSupplierID = data.tsuppliervs1[i].fields.ID || '';
                                let popSupplierName = data.tsuppliervs1[i].fields.ClientName || '';
                                let popSupplierEmail = data.tsuppliervs1[i].fields.Email || '';
                                let popSupplierTitle = data.tsuppliervs1[i].fields.Title || '';
                                let popSupplierFirstName = data.tsuppliervs1[i].fields.FirstName || '';
                                let popSupplierMiddleName = data.tsuppliervs1[i].fields.CUSTFLD10 || '';
                                let popSupplierLastName = data.tsuppliervs1[i].fields.LastName || '';
                                let popSuppliertfn = '' || '';
                                let popSupplierPhone = data.tsuppliervs1[i].fields.Phone || '';
                                let popSupplierMobile = data.tsuppliervs1[i].fields.Mobile || '';
                                let popSupplierFaxnumber = data.tsuppliervs1[i].fields.Faxnumber || '';
                                let popSupplierSkypeName = data.tsuppliervs1[i].fields.SkypeName || '';
                                let popSupplierURL = data.tsuppliervs1[i].fields.URL || '';
                                let popSupplierStreet = data.tsuppliervs1[i].fields.Street || '';
                                let popSupplierStreet2 = data.tsuppliervs1[i].fields.Street2 || '';
                                let popSupplierState = data.tsuppliervs1[i].fields.State || '';
                                let popSupplierPostcode = data.tsuppliervs1[i].fields.Postcode || '';
                                let popSupplierCountry = data.tsuppliervs1[i].fields.Country || LoggedCountry;
                                let popSupplierbillingaddress = data.tsuppliervs1[i].fields.BillStreet || '';
                                let popSupplierbcity = data.tsuppliervs1[i].fields.BillStreet2 || '';
                                let popSupplierbstate = data.tsuppliervs1[i].fields.BillState || '';
                                let popSupplierbpostalcode = data.tsuppliervs1[i].fields.BillPostcode || '';
                                let popSupplierbcountry = data.tsuppliervs1[i].fields.Billcountry || LoggedCountry;
                                let popSuppliercustfield1 = data.tsuppliervs1[i].fields.CUSTFLD1 || '';
                                let popSuppliercustfield2 = data.tsuppliervs1[i].fields.CUSTFLD2 || '';
                                let popSuppliercustfield3 = data.tsuppliervs1[i].fields.CUSTFLD3 || '';
                                let popSuppliercustfield4 = data.tsuppliervs1[i].fields.CUSTFLD4 || '';
                                let popSuppliernotes = data.tsuppliervs1[i].fields.Notes || '';
                                let popSupplierpreferedpayment = data.tsuppliervs1[i].fields.PaymentMethodName || '';
                                let popSupplierterms = data.tsuppliervs1[i].fields.TermsName || '';
                                let popSupplierdeliverymethod = data.tsuppliervs1[i].fields.ShippingMethodName || '';
                                let popSupplieraccountnumber = data.tsuppliervs1[i].fields.ClientNo || '';
                                let popSupplierisContractor = data.tsuppliervs1[i].fields.Contractor || false;
                                let popSupplierissupplier = data.tsuppliervs1[i].fields.IsSupplier || false;
                                let popSupplieriscustomer = data.tsuppliervs1[i].fields.IsCustomer || false;

                                $('#edtSupplierCompany').val(popSupplierName);
                                $('#edtSupplierPOPID').val(popSupplierID);
                                $('#edtSupplierCompanyEmail').val(popSupplierEmail);
                                $('#edtSupplierTitle').val(popSupplierTitle);
                                $('#edtSupplierFirstName').val(popSupplierFirstName);
                                $('#edtSupplierMiddleName').val(popSupplierMiddleName);
                                $('#edtSupplierLastName').val(popSupplierLastName);
                                $('#edtSupplierPhone').val(popSupplierPhone);
                                $('#edtSupplierMobile').val(popSupplierMobile);
                                $('#edtSupplierFax').val(popSupplierFaxnumber);
                                $('#edtSupplierSkypeID').val(popSupplierSkypeName);
                                $('#edtSupplierWebsite').val(popSupplierURL);
                                $('#edtSupplierShippingAddress').val(popSupplierStreet);
                                $('#edtSupplierShippingCity').val(popSupplierStreet2);
                                $('#edtSupplierShippingState').val(popSupplierState);
                                $('#edtSupplierShippingZIP').val(popSupplierPostcode);
                                $('#sedtCountry').val(popSupplierCountry);
                                $('#txaNotes').val(popSuppliernotes);
                                $('#sltPreferedPayment').val(popSupplierpreferedpayment);
                                $('#sltTerms').val(popSupplierterms);
                                $('#suppAccountNo').val(popSupplieraccountnumber);
                                $('#edtCustomeField1').val(popSuppliercustfield1);
                                $('#edtCustomeField2').val(popSuppliercustfield2);
                                $('#edtCustomeField3').val(popSuppliercustfield3);
                                $('#edtCustomeField4').val(popSuppliercustfield4);

                                if ((data.tsuppliervs1[i].fields.Street == data.tsuppliervs1[i].fields.BillStreet) && (data.tsuppliervs1[i].fields.Street2 == data.tsuppliervs1[i].fields.BillStreet2) &&
                                    (data.tsuppliervs1[i].fields.State == data.tsuppliervs1[i].fields.BillState) && (data.tsuppliervs1[i].fields.Postcode == data.tsuppliervs1[i].fields.Postcode) &&
                                    (data.tsuppliervs1[i].fields.Country == data.tsuppliervs1[i].fields.Billcountry)) {
                                    //templateObject.isSameAddress.set(true);
                                    $('#chkSameAsShipping').attr("checked", "checked");
                                }
                                if (data.tsuppliervs1[i].fields.Contractor == true) {
                                    // $('#isformcontractor')
                                    $('#isformcontractor').attr("checked", "checked");
                                } else {
                                    $('#isformcontractor').removeAttr("checked");
                                }

                                setTimeout(function() {
                                    $('#addSupplierModal').modal('show');
                                }, 200);
                            }
                        }

                        if (!added) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getOneSupplierDataExByName(supplierDataName).then(function(data) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];

                                $('#add-supplier-title').text('Edit Supplier');
                                let popSupplierID = data.tsupplier[0].fields.ID || '';
                                let popSupplierName = data.tsupplier[0].fields.ClientName || '';
                                let popSupplierEmail = data.tsupplier[0].fields.Email || '';
                                let popSupplierTitle = data.tsupplier[0].fields.Title || '';
                                let popSupplierFirstName = data.tsupplier[0].fields.FirstName || '';
                                let popSupplierMiddleName = data.tsupplier[0].fields.CUSTFLD10 || '';
                                let popSupplierLastName = data.tsupplier[0].fields.LastName || '';
                                let popSuppliertfn = '' || '';
                                let popSupplierPhone = data.tsupplier[0].fields.Phone || '';
                                let popSupplierMobile = data.tsupplier[0].fields.Mobile || '';
                                let popSupplierFaxnumber = data.tsupplier[0].fields.Faxnumber || '';
                                let popSupplierSkypeName = data.tsupplier[0].fields.SkypeName || '';
                                let popSupplierURL = data.tsupplier[0].fields.URL || '';
                                let popSupplierStreet = data.tsupplier[0].fields.Street || '';
                                let popSupplierStreet2 = data.tsupplier[0].fields.Street2 || '';
                                let popSupplierState = data.tsupplier[0].fields.State || '';
                                let popSupplierPostcode = data.tsupplier[0].fields.Postcode || '';
                                let popSupplierCountry = data.tsupplier[0].fields.Country || LoggedCountry;
                                let popSupplierbillingaddress = data.tsupplier[0].fields.BillStreet || '';
                                let popSupplierbcity = data.tsupplier[0].fields.BillStreet2 || '';
                                let popSupplierbstate = data.tsupplier[0].fields.BillState || '';
                                let popSupplierbpostalcode = data.tsupplier[0].fields.BillPostcode || '';
                                let popSupplierbcountry = data.tsupplier[0].fields.Billcountry || LoggedCountry;
                                let popSuppliercustfield1 = data.tsupplier[0].fields.CUSTFLD1 || '';
                                let popSuppliercustfield2 = data.tsupplier[0].fields.CUSTFLD2 || '';
                                let popSuppliercustfield3 = data.tsupplier[0].fields.CUSTFLD3 || '';
                                let popSuppliercustfield4 = data.tsupplier[0].fields.CUSTFLD4 || '';
                                let popSuppliernotes = data.tsupplier[0].fields.Notes || '';
                                let popSupplierpreferedpayment = data.tsupplier[0].fields.PaymentMethodName || '';
                                let popSupplierterms = data.tsupplier[0].fields.TermsName || '';
                                let popSupplierdeliverymethod = data.tsupplier[0].fields.ShippingMethodName || '';
                                let popSupplieraccountnumber = data.tsupplier[0].fields.ClientNo || '';
                                let popSupplierisContractor = data.tsupplier[0].fields.Contractor || false;
                                let popSupplierissupplier = data.tsupplier[0].fields.IsSupplier || false;
                                let popSupplieriscustomer = data.tsupplier[0].fields.IsCustomer || false;

                                $('#edtSupplierCompany').val(popSupplierName);
                                $('#edtSupplierPOPID').val(popSupplierID);
                                $('#edtSupplierCompanyEmail').val(popSupplierEmail);
                                $('#edtSupplierTitle').val(popSupplierTitle);
                                $('#edtSupplierFirstName').val(popSupplierFirstName);
                                $('#edtSupplierMiddleName').val(popSupplierMiddleName);
                                $('#edtSupplierLastName').val(popSupplierLastName);
                                $('#edtSupplierPhone').val(popSupplierPhone);
                                $('#edtSupplierMobile').val(popSupplierMobile);
                                $('#edtSupplierFax').val(popSupplierFaxnumber);
                                $('#edtSupplierSkypeID').val(popSupplierSkypeName);
                                $('#edtSupplierWebsite').val(popSupplierURL);
                                $('#edtSupplierShippingAddress').val(popSupplierStreet);
                                $('#edtSupplierShippingCity').val(popSupplierStreet2);
                                $('#edtSupplierShippingState').val(popSupplierState);
                                $('#edtSupplierShippingZIP').val(popSupplierPostcode);
                                $('#sedtCountry').val(popSupplierCountry);
                                $('#txaNotes').val(popSuppliernotes);
                                $('#sltPreferedPayment').val(popSupplierpreferedpayment);
                                $('#sltTerms').val(popSupplierterms);
                                $('#suppAccountNo').val(popSupplieraccountnumber);
                                $('#edtCustomeField1').val(popSuppliercustfield1);
                                $('#edtCustomeField2').val(popSuppliercustfield2);
                                $('#edtCustomeField3').val(popSuppliercustfield3);
                                $('#edtCustomeField4').val(popSuppliercustfield4);

                                if ((data.tsupplier[0].fields.Street == data.tsupplier[0].fields.BillStreet) && (data.tsupplier[0].fields.Street2 == data.tsupplier[0].fields.BillStreet2) &&
                                    (data.tsupplier[0].fields.State == data.tsupplier[0].fields.BillState) && (data.tsupplier[0].fields.Postcode == data.tsupplier[0].fields.Postcode) &&
                                    (data.tsupplier[0].fields.Country == data.tsupplier[0].fields.Billcountry)) {
                                    //templateObject.isSameAddress.set(true);
                                    $('#chkSameAsShipping').attr("checked", "checked");
                                }
                                if (data.tsupplier[0].fields.Contractor == true) {
                                    // $('#isformcontractor')
                                    $('#isformcontractor').attr("checked", "checked");
                                } else {
                                    $('#isformcontractor').removeAttr("checked");
                                }

                                setTimeout(function() {
                                    $('#addSupplierModal').modal('show');
                                }, 200);
                            }).catch(function(err) {

                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                    }
                }).catch(function(err) {

                    sideBarService.getOneSupplierDataExByName(supplierDataName).then(function(data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];

                        $('#add-supplier-title').text('Edit Supplier');
                        let popSupplierID = data.tsupplier[0].fields.ID || '';
                        let popSupplierName = data.tsupplier[0].fields.ClientName || '';
                        let popSupplierEmail = data.tsupplier[0].fields.Email || '';
                        let popSupplierTitle = data.tsupplier[0].fields.Title || '';
                        let popSupplierFirstName = data.tsupplier[0].fields.FirstName || '';
                        let popSupplierMiddleName = data.tsupplier[0].fields.CUSTFLD10 || '';
                        let popSupplierLastName = data.tsupplier[0].fields.LastName || '';
                        let popSuppliertfn = '' || '';
                        let popSupplierPhone = data.tsupplier[0].fields.Phone || '';
                        let popSupplierMobile = data.tsupplier[0].fields.Mobile || '';
                        let popSupplierFaxnumber = data.tsupplier[0].fields.Faxnumber || '';
                        let popSupplierSkypeName = data.tsupplier[0].fields.SkypeName || '';
                        let popSupplierURL = data.tsupplier[0].fields.URL || '';
                        let popSupplierStreet = data.tsupplier[0].fields.Street || '';
                        let popSupplierStreet2 = data.tsupplier[0].fields.Street2 || '';
                        let popSupplierState = data.tsupplier[0].fields.State || '';
                        let popSupplierPostcode = data.tsupplier[0].fields.Postcode || '';
                        let popSupplierCountry = data.tsupplier[0].fields.Country || LoggedCountry;
                        let popSupplierbillingaddress = data.tsupplier[0].fields.BillStreet || '';
                        let popSupplierbcity = data.tsupplier[0].fields.BillStreet2 || '';
                        let popSupplierbstate = data.tsupplier[0].fields.BillState || '';
                        let popSupplierbpostalcode = data.tsupplier[0].fields.BillPostcode || '';
                        let popSupplierbcountry = data.tsupplier[0].fields.Billcountry || LoggedCountry;
                        let popSuppliercustfield1 = data.tsupplier[0].fields.CUSTFLD1 || '';
                        let popSuppliercustfield2 = data.tsupplier[0].fields.CUSTFLD2 || '';
                        let popSuppliercustfield3 = data.tsupplier[0].fields.CUSTFLD3 || '';
                        let popSuppliercustfield4 = data.tsupplier[0].fields.CUSTFLD4 || '';
                        let popSuppliernotes = data.tsupplier[0].fields.Notes || '';
                        let popSupplierpreferedpayment = data.tsupplier[0].fields.PaymentMethodName || '';
                        let popSupplierterms = data.tsupplier[0].fields.TermsName || '';
                        let popSupplierdeliverymethod = data.tsupplier[0].fields.ShippingMethodName || '';
                        let popSupplieraccountnumber = data.tsupplier[0].fields.ClientNo || '';
                        let popSupplierisContractor = data.tsupplier[0].fields.Contractor || false;
                        let popSupplierissupplier = data.tsupplier[0].fields.IsSupplier || false;
                        let popSupplieriscustomer = data.tsupplier[0].fields.IsCustomer || false;

                        $('#edtSupplierCompany').val(popSupplierName);
                        $('#edtSupplierPOPID').val(popSupplierID);
                        $('#edtSupplierCompanyEmail').val(popSupplierEmail);
                        $('#edtSupplierTitle').val(popSupplierTitle);
                        $('#edtSupplierFirstName').val(popSupplierFirstName);
                        $('#edtSupplierMiddleName').val(popSupplierMiddleName);
                        $('#edtSupplierLastName').val(popSupplierLastName);
                        $('#edtSupplierPhone').val(popSupplierPhone);
                        $('#edtSupplierMobile').val(popSupplierMobile);
                        $('#edtSupplierFax').val(popSupplierFaxnumber);
                        $('#edtSupplierSkypeID').val(popSupplierSkypeName);
                        $('#edtSupplierWebsite').val(popSupplierURL);
                        $('#edtSupplierShippingAddress').val(popSupplierStreet);
                        $('#edtSupplierShippingCity').val(popSupplierStreet2);
                        $('#edtSupplierShippingState').val(popSupplierState);
                        $('#edtSupplierShippingZIP').val(popSupplierPostcode);
                        $('#sedtCountry').val(popSupplierCountry);
                        $('#txaNotes').val(popSuppliernotes);
                        $('#sltPreferedPayment').val(popSupplierpreferedpayment);
                        $('#sltTerms').val(popSupplierterms);
                        $('#suppAccountNo').val(popSupplieraccountnumber);
                        $('#edtCustomeField1').val(popSuppliercustfield1);
                        $('#edtCustomeField2').val(popSuppliercustfield2);
                        $('#edtCustomeField3').val(popSuppliercustfield3);
                        $('#edtCustomeField4').val(popSuppliercustfield4);

                        if ((data.tsupplier[0].fields.Street == data.tsupplier[0].fields.BillStreet) && (data.tsupplier[0].fields.Street2 == data.tsupplier[0].fields.BillStreet2) &&
                            (data.tsupplier[0].fields.State == data.tsupplier[0].fields.BillState) && (data.tsupplier[0].fields.Postcode == data.tsupplier[0].fields.Postcode) &&
                            (data.tsupplier[0].fields.Country == data.tsupplier[0].fields.Billcountry)) {
                            //templateObject.isSameAddress.set(true);
                            $('#chkSameAsShipping').attr("checked", "checked");
                        }
                        if (data.tsupplier[0].fields.Contractor == true) {
                            // $('#isformcontractor')
                            $('#isformcontractor').attr("checked", "checked");
                        } else {
                            $('#isformcontractor').removeAttr("checked");
                        }

                        setTimeout(function() {
                            $('#addSupplierModal').modal('show');
                        }, 200);


                    }).catch(function(err) {

                        $('.fullScreenSpin').css('display', 'none');
                    });
                });
            } else {
                $('#supplierListModal').modal();
                setTimeout(function() {
                    $('#tblSupplierlist_filter .form-control-sm').focus();
                    $('#tblSupplierlist_filter .form-control-sm').val('');
                    $('#tblSupplierlist_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblSupplierlist').DataTable();
                    datatable.draw();
                    $('#tblSupplierlist_filter .form-control-sm').trigger("input");
                }, 500);
            }
        }


    });

    var url = FlowRouter.current().path;
    if (url.indexOf('?id=') > 0) {
        var getsale_id = url.split('?id=');
        $("#addRow").attr("disabled", true);
        var currentSalesID = getsale_id[getsale_id.length - 1];
        if (getsale_id[1]) {
            currentSalesID = parseInt(currentSalesID);
            getVS1Data('TSupplierPayment').then(function(dataObject) {
                if (dataObject.length == 0) {
                    paymentService.getOneSupplierPayment(currentSalesID).then(function(data) {
                        let lineItems = [];
                        let lineItemObj = {};

                        let total = utilityService.modifynegativeCurrencyFormat(data.fields.Amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Applied).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        if(data.fields.Lines != null){
                        if (data.fields.Lines.length) {
                            for (let i = 0; i < data.fields.Lines.length; i++) {
                                let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.AmountDue).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.Payment).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.AmountOutstanding).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.OriginalAmount).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });

                                lineItemObj = {

                                    id: data.fields.Lines[i].fields.ID || '',
                                    invoiceid: data.fields.Lines[i].fields.ID || '',
                                    transid: data.fields.Lines[i].fields.ID || '',
                                    poid: data.fields.Lines[i].fields.POID || '',
                                    invoicedate: data.fields.Lines[i].fields.Date != '' ? moment(data.fields.Lines[i].fields.Date).format("DD/MM/YYYY") : data.fields.Lines[i].fields.Date,
                                    refno: data.fields.Lines[i].fields.RefNo || '',
                                    transtype: data.fields.Lines[i].fields.TrnType || '',
                                    amountdue: amountDue || 0,
                                    paymentamount: paymentAmt || 0,
                                    ouststandingamount: outstandingAmt,
                                    orginalamount: originalAmt
                                };
                                lineItems.push(lineItemObj);
                            }
                        } else {
                            let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.AmountDue).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.Payment).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.AmountOutstanding).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.OriginalAmount).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            lineItemObj = {
                                id: data.fields.Lines.fields.ID || '',
                                invoiceid: data.fields.Lines.fields.InvoiceId || '',
                                transid: data.fields.Lines.fields.TransNo || '',
                                poid: data.fields.Lines.fields.POID || '',
                                invoicedate: data.fields.Lines.fields.Date != '' ? moment(data.fields.Lines.fields.Date).format("DD/MM/YYYY") : data.fields.Lines.fields.Date,
                                refno: data.fields.Lines.fields.RefNo || '',
                                transtype: data.fields.Lines.fields.TrnType || '',
                                amountdue: amountDue || 0,
                                paymentamount: paymentAmt || 0,
                                ouststandingamount: outstandingAmt,
                                orginalamount: originalAmt
                            };
                            lineItems.push(lineItemObj);
                        }
                       }
                        let record = {
                            lid: data.fields.ID || '',
                            customerName: data.fields.CompanyName || '',
                            paymentDate: data.fields.PaymentDate ? moment(data.fields.PaymentDate).format('DD/MM/YYYY') : "",
                            reference: data.fields.ReferenceNo || ' ',
                            bankAccount: data.fields.AccountName || '',
                            paymentAmount: appliedAmt || 0,
                            notes: data.fields.Notes,
                            LineItems: lineItems,
                            checkpayment: data.fields.PaymentMethodName,
                            department: data.fields.DeptClassName,
                            applied: appliedAmt.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            })

                        };
                        templateObject.record.set(record);
                        //$('#edtSupplierName').editableSelect('add', data.fields.CompanyName);
                        let getDepartmentVal = Session.get('department') || data.fields.DeptClassName;
                        $('#sltDepartment').val(data.fields.DeptClassName);
                        $('#sltPaymentMethod').val(data.fields.PaymentMethodName);
                        $('#edtSupplierName').val(data.fields.CompanyName);


                        $('#edtSupplierName').attr('readonly', true);
                        $('#edtSupplierName').css('background-color', '#eaecf4');
                        $('#edtSupplierEmail').attr('readonly', true);

                        $('#edtPaymentAmount').attr('readonly', true);
                        $('#edtSelectBankAccountName').val(data.fields.AccountName);
                        $('#edtSelectBankAccountName').attr('disabled', 'disabled');
                        $('#edtSelectBankAccountName').attr('readonly', true);

                        $('.ui-datepicker-trigger').css('pointer-events', 'none');
                        $('#dtPaymentDate').attr('readonly', true);

                        $('#sltPaymentMethod').val(data.fields.PaymentMethodName);
                        $('#sltPaymentMethod').attr('disabled', 'disabled');
                        $('#sltPaymentMethod').attr('readonly', true);

                        $('#sltDepartment').attr('disabled', 'disabled');
                        $('#sltDepartment').attr('readonly', true);

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                            if (error) {

                                //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                            } else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass;
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                        let columnWidth = customcolumn[i].width;

                                        $("" + columHeaderUpdate + "").html(columData);
                                        if (columnWidth != 0) {
                                            $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                        }

                                        if (hiddenColumn == true) {
                                            $("." + columnClass + "").addClass('hiddenColumn');
                                            $("." + columnClass + "").removeClass('showColumn');
                                            $(".chk" + columnClass + "").removeAttr('checked');
                                        } else if (hiddenColumn == false) {
                                            $("." + columnClass + "").removeClass('hiddenColumn');
                                            $("." + columnClass + "").addClass('showColumn');
                                            $(".chk" + columnClass + "").attr('checked', 'checked');
                                        }

                                    }
                                }

                            }
                        });

                        setTimeout(function() {
                            $('.tblSupplierPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
                        }, 1000);

                        //$('#edtBankAccountName').editableSelect('add',data.fields.AccountName);
                        //$('#edtBankAccountName').val(data.fields.AccountName);
                        //  $('#edtBankAccountName').append($('<option>', {value:data.fields.AccountName selected="selected", text:data.fields.AccountName}));
                        $('#edtBankAccountName').append('<option value="' + data.fields.AccountName + '" selected="selected">' + data.fields.AccountName + '</option>');
                        $('#sltDepartment').append('<option value="' + data.fields.DeptClassName + '" selected="selected">' + data.fields.DeptClassName + '</option>');
                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].customername == data.fields.SupplierName) {
                                    $('#edtSupplierEmail').val(clientList[i].customeremail);
                                    $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                    let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                    $('#txabillingAddress').val(postalAddress);
                                }
                            }
                        }
                        $('.fullScreenSpin').css('display', 'none');
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tsupplierpayment;

                    var added = false;
                    for (let d = 0; d < useData.length; d++) {

                        if (parseInt(useData[d].fields.ID) === currentSalesID) {
                            $('.fullScreenSpin').css('display', 'none');
                            added = true;
                            let lineItems = [];
                            let lineItemObj = {};

                            let total = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Amount).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let appliedAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Applied).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });

                            if (useData[d].fields.Lines.length) {
                                for (let i = 0; i < useData[d].fields.Lines.length; i++) {
                                    let amountDue = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.AmountDue).toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let paymentAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.Payment).toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let outstandingAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.AmountOutstanding).toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let originalAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines[i].fields.OriginalAmount).toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });

                                    lineItemObj = {

                                        id: useData[d].fields.Lines[i].fields.ID || '',
                                        invoiceid: useData[d].fields.Lines[i].fields.ID || '',
                                        transid: useData[d].fields.Lines[i].fields.ID || '',
                                        poid: useData[d].fields.Lines[i].fields.POID || '',
                                        invoicedate: useData[d].fields.Lines[i].fields.Date != '' ? moment(useData[d].fields.Lines[i].fields.Date).format("DD/MM/YYYY") : useData[d].fields.Lines[i].fields.Date,
                                        refno: useData[d].fields.Lines[i].fields.RefNo || '',
                                        transtype: useData[d].fields.Lines[i].fields.TrnType || '',
                                        amountdue: amountDue || 0,
                                        paymentamount: paymentAmt || 0,
                                        ouststandingamount: outstandingAmt,
                                        orginalamount: originalAmt
                                    };
                                    lineItems.push(lineItemObj);
                                }
                            } else {
                                let amountDue = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines.fields.AmountDue).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let paymentAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines.fields.Payment).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let outstandingAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines.fields.AmountOutstanding).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let originalAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.Lines.fields.OriginalAmount).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                lineItemObj = {
                                    id: useData[d].fields.Lines.fields.ID || '',
                                    invoiceid: useData[d].fields.Lines.fields.InvoiceId || '',
                                    transid: useData[d].fields.Lines.fields.TransNo || '',
                                    poid: useData[d].fields.Lines.fields.POID || '',
                                    invoicedate: useData[d].fields.Lines.fields.Date != '' ? moment(useData[d].fields.Lines.fields.Date).format("DD/MM/YYYY") : useData[d].fields.Lines.fields.Date,
                                    refno: useData[d].fields.Lines.fields.RefNo || '',
                                    transtype: useData[d].fields.Lines.fields.TrnType || '',
                                    amountdue: amountDue || 0,
                                    paymentamount: paymentAmt || 0,
                                    ouststandingamount: outstandingAmt,
                                    orginalamount: originalAmt
                                };
                                lineItems.push(lineItemObj);
                            }
                            let record = {
                                lid: useData[d].fields.ID || '',
                                customerName: useData[d].fields.CompanyName || '',
                                paymentDate: useData[d].fields.PaymentDate ? moment(useData[d].fields.PaymentDate).format('DD/MM/YYYY') : "",
                                reference: useData[d].fields.ReferenceNo || ' ',
                                bankAccount: useData[d].fields.AccountName || '',
                                paymentAmount: appliedAmt || 0,
                                notes: useData[d].fields.Notes,
                                LineItems: lineItems,
                                checkpayment: useData[d].fields.PaymentMethodName,
                                department: useData[d].fields.DeptClassName,
                                applied: appliedAmt.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                })

                            };
                            templateObject.record.set(record);
                            //$('#edtSupplierName').editableSelect('add', useData[d].fields.CompanyName);
                            $('#edtSupplierName').val(useData[d].fields.CompanyName);
                            $('#sltDepartment').val(useData[d].fields.DeptClassName);
                            $('#sltPaymentMethod').val(useData[d].fields.PaymentMethodName);

                            $('#edtSupplierName').attr('readonly', true);
                            $('#edtSupplierName').css('background-color', '#eaecf4');
                            $('#edtSupplierEmail').attr('readonly', true);

                            $('#edtPaymentAmount').attr('readonly', true);

                            $('#edtSelectBankAccountName').val(useData[d].fields.AccountName);
                            $('#edtSelectBankAccountName').attr('disabled', 'disabled');
                            $('#edtSelectBankAccountName').attr('readonly', true);

                            $('.ui-datepicker-trigger').css('pointer-events', 'none');
                            $('#dtPaymentDate').attr('readonly', true);

                            $('#sltPaymentMethod').val(useData[d].fields.PaymentMethodName);
                            $('#sltPaymentMethod').attr('disabled', 'disabled');
                            $('#sltPaymentMethod').attr('readonly', true);

                            $('#sltDepartment').attr('disabled', 'disabled');
                            $('#sltDepartment').attr('readonly', true);

                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                                if (error) {

                                    //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                                } else {
                                    if (result) {
                                        for (let i = 0; i < result.customFields.length; i++) {
                                            let customcolumn = result.customFields;
                                            let columData = customcolumn[i].label;
                                            let columHeaderUpdate = customcolumn[i].thclass;
                                            let hiddenColumn = customcolumn[i].hidden;
                                            let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                            let columnWidth = customcolumn[i].width;

                                            $("" + columHeaderUpdate + "").html(columData);
                                            if (columnWidth != 0) {
                                                $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                            }

                                            if (hiddenColumn == true) {
                                                $("." + columnClass + "").addClass('hiddenColumn');
                                                $("." + columnClass + "").removeClass('showColumn');
                                                $(".chk" + columnClass + "").removeAttr('checked');
                                            } else if (hiddenColumn == false) {
                                                $("." + columnClass + "").removeClass('hiddenColumn');
                                                $("." + columnClass + "").addClass('showColumn');
                                                $(".chk" + columnClass + "").attr('checked', 'checked');
                                            }

                                        }
                                    }

                                }
                            });

                            setTimeout(function() {
                                $('.tblSupplierPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
                            }, 1000);

                            //$('#edtBankAccountName').editableSelect('add',useData[d].fields.AccountName);
                            //$('#edtBankAccountName').val(useData[d].fields.AccountName);
                            //  $('#edtBankAccountName').append($('<option>', {value:useData[d].fields.AccountName selected="selected", text:useData[d].fields.AccountName}));
                            $('#edtBankAccountName').append('<option value="' + useData[d].fields.AccountName + '" selected="selected">' + useData[d].fields.AccountName + '</option>');
                            $('#sltDepartment').append('<option value="' + useData[d].fields.DeptClassName + '" selected="selected">' + useData[d].fields.DeptClassName + '</option>');
                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].customername == useData[d].fields.SupplierName) {
                                        $('#edtSupplierEmail').val(clientList[i].customeremail);
                                        $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                        let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                        $('#txabillingAddress').val(postalAddress);
                                    }
                                }
                            }
                            $('.fullScreenSpin').css('display', 'none');
                        }

                    }
                    if (!added) {
                        paymentService.getOneSupplierPayment(currentSalesID).then(function(data) {
                            let lineItems = [];
                            let lineItemObj = {};

                            let total = utilityService.modifynegativeCurrencyFormat(data.fields.Amount).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Applied).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            if(data.fields.Lines != null){
                            if (data.fields.Lines.length) {
                                for (let i = 0; i < data.fields.Lines.length; i++) {
                                    let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.AmountDue).toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.Payment).toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.AmountOutstanding).toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.OriginalAmount).toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });

                                    lineItemObj = {

                                        id: data.fields.Lines[i].fields.ID || '',
                                        invoiceid: data.fields.Lines[i].fields.ID || '',
                                        transid: data.fields.Lines[i].fields.ID || '',
                                        poid: data.fields.Lines[i].fields.POID || '',
                                        invoicedate: data.fields.Lines[i].fields.Date != '' ? moment(data.fields.Lines[i].fields.Date).format("DD/MM/YYYY") : data.fields.Lines[i].fields.Date,
                                        refno: data.fields.Lines[i].fields.RefNo || '',
                                        transtype: data.fields.Lines[i].fields.TrnType || '',
                                        amountdue: amountDue || 0,
                                        paymentamount: paymentAmt || 0,
                                        ouststandingamount: outstandingAmt,
                                        orginalamount: originalAmt
                                    };
                                    lineItems.push(lineItemObj);
                                }
                            } else {
                                let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.AmountDue).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.Payment).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.AmountOutstanding).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.OriginalAmount).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                lineItemObj = {
                                    id: data.fields.Lines.fields.ID || '',
                                    invoiceid: data.fields.Lines.fields.InvoiceId || '',
                                    transid: data.fields.Lines.fields.TransNo || '',
                                    poid: data.fields.Lines.fields.POID || '',
                                    invoicedate: data.fields.Lines.fields.Date != '' ? moment(data.fields.Lines.fields.Date).format("DD/MM/YYYY") : data.fields.Lines.fields.Date,
                                    refno: data.fields.Lines.fields.RefNo || '',
                                    transtype: data.fields.Lines.fields.TrnType || '',
                                    amountdue: amountDue || 0,
                                    paymentamount: paymentAmt || 0,
                                    ouststandingamount: outstandingAmt,
                                    orginalamount: originalAmt
                                };
                                lineItems.push(lineItemObj);
                            }

                            }
                            let record = {
                                lid: data.fields.ID || '',
                                customerName: data.fields.CompanyName || '',
                                paymentDate: data.fields.PaymentDate ? moment(data.fields.PaymentDate).format('DD/MM/YYYY') : "",
                                reference: data.fields.ReferenceNo || ' ',
                                bankAccount: data.fields.AccountName || '',
                                paymentAmount: appliedAmt || 0,
                                notes: data.fields.Notes,
                                LineItems: lineItems,
                                checkpayment: data.fields.PaymentMethodName,
                                department: data.fields.DeptClassName,
                                applied: appliedAmt.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                })

                            };
                            templateObject.record.set(record);
                            //$('#edtSupplierName').editableSelect('add', data.fields.CompanyName);
                            $('#edtSupplierName').val(data.fields.CompanyName);
                            $('#sltDepartment').val(data.fields.DeptClassName);
                            $('#sltPaymentMethod').val(data.fields.PaymentMethodName);

                            $('#edtSupplierName').attr('readonly', true);
                            $('#edtSupplierName').css('background-color', '#eaecf4');
                            $('#edtSupplierEmail').attr('readonly', true);

                            $('#edtPaymentAmount').attr('readonly', true);
                            $('#edtSelectBankAccountName').val(data.fields.AccountName);
                            $('#edtSelectBankAccountName').attr('disabled', 'disabled');
                            $('#edtSelectBankAccountName').attr('readonly', true);

                            $('.ui-datepicker-trigger').css('pointer-events', 'none');
                            $('#dtPaymentDate').attr('readonly', true);

                            $('#sltPaymentMethod').val(data.fields.PaymentMethodName);
                            $('#sltPaymentMethod').attr('disabled', 'disabled');
                            $('#sltPaymentMethod').attr('readonly', true);

                            $('#sltDepartment').attr('disabled', 'disabled');
                            $('#sltDepartment').attr('readonly', true);

                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                                if (error) {

                                    //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                                } else {
                                    if (result) {
                                        for (let i = 0; i < result.customFields.length; i++) {
                                            let customcolumn = result.customFields;
                                            let columData = customcolumn[i].label;
                                            let columHeaderUpdate = customcolumn[i].thclass;
                                            let hiddenColumn = customcolumn[i].hidden;
                                            let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                            let columnWidth = customcolumn[i].width;

                                            $("" + columHeaderUpdate + "").html(columData);
                                            if (columnWidth != 0) {
                                                $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                            }

                                            if (hiddenColumn == true) {
                                                $("." + columnClass + "").addClass('hiddenColumn');
                                                $("." + columnClass + "").removeClass('showColumn');
                                                $(".chk" + columnClass + "").removeAttr('checked');
                                            } else if (hiddenColumn == false) {
                                                $("." + columnClass + "").removeClass('hiddenColumn');
                                                $("." + columnClass + "").addClass('showColumn');
                                                $(".chk" + columnClass + "").attr('checked', 'checked');
                                            }

                                        }
                                    }

                                }
                            });

                            setTimeout(function() {
                                $('.tblSupplierPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
                            }, 1000);

                            //$('#edtBankAccountName').editableSelect('add',data.fields.AccountName);
                            //$('#edtBankAccountName').val(data.fields.AccountName);
                            //  $('#edtBankAccountName').append($('<option>', {value:data.fields.AccountName selected="selected", text:data.fields.AccountName}));
                            $('#edtBankAccountName').append('<option value="' + data.fields.AccountName + '" selected="selected">' + data.fields.AccountName + '</option>');
                            $('#sltDepartment').append('<option value="' + data.fields.DeptClassName + '" selected="selected">' + data.fields.DeptClassName + '</option>');
                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].customername == data.fields.SupplierName) {
                                        $('#edtSupplierEmail').val(clientList[i].customeremail);
                                        $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                        let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                        $('#txabillingAddress').val(postalAddress);
                                    }
                                }
                            }
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }
                }
            }).catch(function(err) {
                paymentService.getOneSupplierPayment(currentSalesID).then(function(data) {
                    let lineItems = [];
                    let lineItemObj = {};

                    let total = utilityService.modifynegativeCurrencyFormat(data.fields.Amount).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Applied).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    if(data.fields.Lines != null){
                    if (data.fields.Lines.length) {
                        for (let i = 0; i < data.fields.Lines.length; i++) {
                            let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.AmountDue).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.Payment).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.AmountOutstanding).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines[i].fields.OriginalAmount).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });

                            lineItemObj = {

                                id: data.fields.Lines[i].fields.ID || '',
                                invoiceid: data.fields.Lines[i].fields.ID || '',
                                transid: data.fields.Lines[i].fields.ID || '',
                                poid: data.fields.Lines[i].fields.POID || '',
                                invoicedate: data.fields.Lines[i].fields.Date != '' ? moment(data.fields.Lines[i].fields.Date).format("DD/MM/YYYY") : data.fields.Lines[i].fields.Date,
                                refno: data.fields.Lines[i].fields.RefNo || '',
                                transtype: data.fields.Lines[i].fields.TrnType || '',
                                amountdue: amountDue || 0,
                                paymentamount: paymentAmt || 0,
                                ouststandingamount: outstandingAmt,
                                orginalamount: originalAmt
                            };
                            lineItems.push(lineItemObj);
                        }
                    } else {
                        let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.AmountDue).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.Payment).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.AmountOutstanding).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Lines.fields.OriginalAmount).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        lineItemObj = {
                            id: data.fields.Lines.fields.ID || '',
                            invoiceid: data.fields.Lines.fields.InvoiceId || '',
                            transid: data.fields.Lines.fields.TransNo || '',
                            poid: data.fields.Lines.fields.POID || '',
                            invoicedate: data.fields.Lines.fields.Date != '' ? moment(data.fields.Lines.fields.Date).format("DD/MM/YYYY") : data.fields.Lines.fields.Date,
                            refno: data.fields.Lines.fields.RefNo || '',
                            transtype: data.fields.Lines.fields.TrnType || '',
                            amountdue: amountDue || 0,
                            paymentamount: paymentAmt || 0,
                            ouststandingamount: outstandingAmt,
                            orginalamount: originalAmt
                        };
                        lineItems.push(lineItemObj);
                    }
                  }
                    let record = {
                        lid: data.fields.ID || '',
                        customerName: data.fields.CompanyName || '',
                        paymentDate: data.fields.PaymentDate ? moment(data.fields.PaymentDate).format('DD/MM/YYYY') : "",
                        reference: data.fields.ReferenceNo || ' ',
                        bankAccount: data.fields.AccountName || '',
                        paymentAmount: appliedAmt || 0,
                        notes: data.fields.Notes,
                        LineItems: lineItems,
                        checkpayment: data.fields.PaymentMethodName,
                        department: data.fields.DeptClassName,
                        applied: appliedAmt.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        })

                    };
                    templateObject.record.set(record);
                    //$('#edtSupplierName').editableSelect('add', data.fields.CompanyName);
                    $('#edtSupplierName').val(data.fields.CompanyName);
                    $('#sltDepartment').val(data.fields.DeptClassName);
                    $('#sltPaymentMethod').val(data.fields.PaymentMethodName);


                    $('#edtSupplierName').attr('readonly', true);
                    $('#edtSupplierName').css('background-color', '#eaecf4');
                    $('#edtSupplierEmail').attr('readonly', true);

                    $('#edtPaymentAmount').attr('readonly', true);
                    $('#edtSelectBankAccountName').val(data.fields.AccountName);
                    $('#edtSelectBankAccountName').attr('disabled', 'disabled');
                    $('#edtSelectBankAccountName').attr('readonly', true);

                    $('.ui-datepicker-trigger').css('pointer-events', 'none');
                    $('#dtPaymentDate').attr('readonly', true);

                    $('#sltPaymentMethod').val(data.fields.PaymentMethodName);
                    $('#sltPaymentMethod').attr('disabled', 'disabled');
                    $('#sltPaymentMethod').attr('readonly', true);

                    $('#sltDepartment').attr('disabled', 'disabled');
                    $('#sltDepartment').attr('readonly', true);

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                        if (error) {

                            //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass;
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                    let columnWidth = customcolumn[i].width;

                                    $("" + columHeaderUpdate + "").html(columData);
                                    if (columnWidth != 0) {
                                        $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                    }

                                    if (hiddenColumn == true) {
                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                        $(".chk" + columnClass + "").removeAttr('checked');
                                    } else if (hiddenColumn == false) {
                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                        $("." + columnClass + "").addClass('showColumn');
                                        $(".chk" + columnClass + "").attr('checked', 'checked');
                                    }

                                }
                            }

                        }
                    });

                    setTimeout(function() {
                        $('.tblSupplierPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
                    }, 1000);

                    //$('#edtBankAccountName').editableSelect('add',data.fields.AccountName);
                    //$('#edtBankAccountName').val(data.fields.AccountName);
                    //  $('#edtBankAccountName').append($('<option>', {value:data.fields.AccountName selected="selected", text:data.fields.AccountName}));
                    $('#edtBankAccountName').append('<option value="' + data.fields.AccountName + '" selected="selected">' + data.fields.AccountName + '</option>');
                    $('#sltDepartment').append('<option value="' + data.fields.DeptClassName + '" selected="selected">' + data.fields.DeptClassName + '</option>');
                    if (clientList) {
                        for (var i = 0; i < clientList.length; i++) {
                            if (clientList[i].customername == data.fields.SupplierName) {
                                $('#edtSupplierEmail').val(clientList[i].customeremail);
                                $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                $('#txabillingAddress').val(postalAddress);
                            }
                        }
                    }
                    $('.fullScreenSpin').css('display', 'none');
                });
            });

        }

        $('#tblSupplierPaymentcard tbody').on('click', 'tr .colType', function() {
            var listData = $(this).closest('tr').attr('id');
            var columnType = $(event.target).text();
            if (listData) {
                if (columnType == "Purchase Order") {
                    window.open('/purchaseordercard?id=' + listData, '_self');
                } else if (columnType == "Bill") {
                    window.open('/billcard?id=' + listData, '_self');
                } else if (columnType == "Credit") {
                    window.open('/creditcard?id=' + listData, '_self');
                }

            }
        });
    } else if (url.indexOf('?poid=') > 0) {
        var getpo_id = url.split('?poid=');
        var currentPOID = getpo_id[getpo_id.length - 1];
        if (getpo_id[1]) {
            currentPOID = parseInt(currentPOID);
            getVS1Data('TPurchaseOrderEx').then(function(dataObject) {
                if (dataObject.length == 0) {
                    paymentService.getOnePurchaseOrderPayment(currentPOID).then(function(data) {
                        let lineItems = [];
                        let lineItemObj = {};

                        let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        var currentDate = new Date();
                        var begunDate = moment(currentDate).format("DD/MM/YYYY");
                        //if (data.fields.Lines.length) {
                        //for (let i = 0; i < data.fields.Lines.length; i++) {
                        let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });

                        lineItemObj = {
                            id: data.fields.ID || '',
                            invoiceid: data.fields.ID || '',
                            transid: data.fields.ID || '',
                            poid: data.fields.ID || '',
                            invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
                            refno: data.fields.CustPONumber || '',
                            transtype: 'Purchase Order' || '',
                            amountdue: amountDue || 0,
                            paymentamount: paymentAmt || 0,
                            ouststandingamount: outstandingAmt,
                            orginalamount: originalAmt
                        };
                        lineItems.push(lineItemObj);

                        let record = {
                            lid: '',
                            customerName: data.fields.ClientName || '',
                            paymentDate: begunDate,
                            reference: data.fields.CustPONumber || ' ',
                            bankAccount: Session.get('bankaccount') || '',
                            paymentAmount: appliedAmt || 0,
                            notes: data.fields.Comments,
                            LineItems: lineItems,
                            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                            department: Session.get('department') || data.fields.DeptClassName,
                            applied: appliedAmt.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            })

                        };
                        templateObject.record.set(record);

                        let getDepartmentVal = Session.get('department') || data.fields.DeptClassName;
                        let getPaymentMethodVal = '';

                        if (Session.get('paymentmethod')) {
                            getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod;
                        } else {
                            getPaymentMethodVal = data.fields.PayMethod || '';
                        }
                        //$('#edtSupplierName').editableSelect('add', data.fields.ClientName);
                        let bankAccountData = Session.get('bankaccount') || 'Bank';
                        $('#edtSelectBankAccountName').val(bankAccountData);
                        templateObject.getLastPaymentData();
                        $('#edtSupplierName').val(data.fields.ClientName);
                        $('#sltDepartment').val(data.fields.DeptClassName);
                        $('#sltPaymentMethod').val(getPaymentMethodVal);
                        //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].customername == data.fields.SupplierName) {
                                    $('#edtSupplierEmail').val(clientList[i].customeremail);
                                    $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                    let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                    $('#txabillingAddress').val(postalAddress);
                                }
                            }
                        }

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                            if (error) {

                                //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                            } else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass;
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                        let columnWidth = customcolumn[i].width;

                                        $("" + columHeaderUpdate + "").html(columData);
                                        if (columnWidth != 0) {
                                            $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                        }

                                        if (hiddenColumn == true) {
                                            $("." + columnClass + "").addClass('hiddenColumn');
                                            $("." + columnClass + "").removeClass('showColumn');
                                            $(".chk" + columnClass + "").removeAttr('checked');
                                        } else if (hiddenColumn == false) {
                                            $("." + columnClass + "").removeClass('hiddenColumn');
                                            $("." + columnClass + "").addClass('showColumn');
                                            $(".chk" + columnClass + "").attr('checked', 'checked');
                                        }

                                    }
                                }

                            }
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tpurchaseorderex;
                    var added = false;
                    for (let d = 0; d < useData.length; d++) {
                        if (parseInt(useData[d].fields.ID) === currentPOID) {
                            added = true;
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let lineItemObj = {};

                            let total = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let appliedAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            var currentDate = new Date();
                            var begunDate = moment(currentDate).format("DD/MM/YYYY");
                            //if (useData[d].fields.Lines.length) {
                            //for (let i = 0; i < useData[d].fields.Lines.length; i++) {
                            let amountDue = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let paymentAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let outstandingAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let originalAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalAmountInc).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });

                            lineItemObj = {
                                id: useData[d].fields.ID || '',
                                invoiceid: useData[d].fields.ID || '',
                                transid: useData[d].fields.ID || '',
                                poid: useData[d].fields.ID || '',
                                invoicedate: useData[d].fields.OrderDate != '' ? moment(useData[d].fields.OrderDate).format("DD/MM/YYYY") : useData[d].fields.OrderDate,
                                refno: useData[d].fields.CustPONumber || '',
                                transtype: 'Purchase Order' || '',
                                amountdue: amountDue || 0,
                                paymentamount: paymentAmt || 0,
                                ouststandingamount: outstandingAmt,
                                orginalamount: originalAmt,
                                comments: useData[d].fields.Comments || ''
                            };
                            lineItems.push(lineItemObj);

                            let record = {
                                lid: '',
                                customerName: useData[d].fields.ClientName || '',
                                paymentDate: begunDate,
                                reference: useData[d].fields.CustPONumber || ' ',
                                bankAccount: Session.get('bankaccount') || '',
                                paymentAmount: appliedAmt || 0,
                                notes: useData[d].fields.Comments,
                                LineItems: lineItems,
                                checkpayment: Session.get('paymentmethod') || useData[d].fields.PayMethod,
                                department: Session.get('department') || useData[d].fields.DeptClassName,
                                applied: appliedAmt.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                })

                            };
                            templateObject.record.set(record);

                            let getDepartmentVal = Session.get('department') || useData[d].fields.DeptClassName || defaultDept;
                            let getPaymentMethodVal = '';

                            if (Session.get('paymentmethod')) {
                                getPaymentMethodVal = Session.get('paymentmethod') || useData[d].fields.PayMethod;
                            } else {
                                getPaymentMethodVal = useData[d].fields.PayMethod || '';
                            }

                            let bankAccountData = Session.get('bankaccount') || 'Bank';
                            $('#edtSelectBankAccountName').val(bankAccountData);
                            templateObject.getLastPaymentData();
                            //$('#edtSupplierName').editableSelect('add', useData[d].fields.ClientName);
                            $('#edtSupplierName').val(useData[d].fields.ClientName);
                            $('#sltDepartment').val(getDepartmentVal);
                            $('#sltPaymentMethod').val(getPaymentMethodVal);
                            //$('#edtBankAccountName').editableSelect('add',record.bankAccount);

                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].customername == useData[d].fields.SupplierName) {
                                        $('#edtSupplierEmail').val(clientList[i].customeremail);
                                        $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                        let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                        $('#txabillingAddress').val(postalAddress);
                                    }
                                }
                            }

                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                                if (error) {

                                    //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                                } else {
                                    if (result) {
                                        for (let i = 0; i < result.customFields.length; i++) {
                                            let customcolumn = result.customFields;
                                            let columData = customcolumn[i].label;
                                            let columHeaderUpdate = customcolumn[i].thclass;
                                            let hiddenColumn = customcolumn[i].hidden;
                                            let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                            let columnWidth = customcolumn[i].width;

                                            $("" + columHeaderUpdate + "").html(columData);
                                            if (columnWidth != 0) {
                                                $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                            }

                                            if (hiddenColumn == true) {
                                                $("." + columnClass + "").addClass('hiddenColumn');
                                                $("." + columnClass + "").removeClass('showColumn');
                                                $(".chk" + columnClass + "").removeAttr('checked');
                                            } else if (hiddenColumn == false) {
                                                $("." + columnClass + "").removeClass('hiddenColumn');
                                                $("." + columnClass + "").addClass('showColumn');
                                                $(".chk" + columnClass + "").attr('checked', 'checked');
                                            }

                                        }
                                    }

                                }
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        }

                    }

                    if (!added) {
                        paymentService.getOnePurchaseOrderPayment(currentPOID).then(function(data) {
                            let lineItems = [];
                            let lineItemObj = {};

                            let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            var currentDate = new Date();
                            var begunDate = moment(currentDate).format("DD/MM/YYYY");
                            //if (data.fields.Lines.length) {
                            //for (let i = 0; i < data.fields.Lines.length; i++) {
                            let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });

                            lineItemObj = {
                                id: data.fields.ID || '',
                                invoiceid: data.fields.ID || '',
                                transid: data.fields.ID || '',
                                poid: data.fields.ID || '',
                                invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
                                refno: data.fields.CustPONumber || '',
                                transtype: 'Purchase Order' || '',
                                amountdue: amountDue || 0,
                                paymentamount: paymentAmt || 0,
                                ouststandingamount: outstandingAmt,
                                orginalamount: originalAmt,
                                comments: data.fields.Comments || ''
                            };
                            lineItems.push(lineItemObj);

                            let record = {
                                lid: '',
                                customerName: data.fields.ClientName || '',
                                paymentDate: begunDate,
                                reference: data.fields.CustPONumber || ' ',
                                bankAccount: Session.get('bankaccount') || '',
                                paymentAmount: appliedAmt || 0,
                                notes: data.fields.Comments,
                                LineItems: lineItems,
                                checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                                department: Session.get('department') || data.fields.DeptClassName,
                                applied: appliedAmt.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                })

                            };
                            templateObject.record.set(record);

                            let getDepartmentVal = Session.get('department') || data.fields.DeptClassName || defaultDept;
                            let getPaymentMethodVal = '';

                            if (Session.get('paymentmethod')) {
                                getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod;
                            } else {
                                getPaymentMethodVal = data.fields.PayMethod || '';
                            }

                            //$('#edtSupplierName').editableSelect('add', data.fields.ClientName);
                            $('#edtSupplierName').val(data.fields.ClientName);
                            $('#sltDepartment').val(getDepartmentVal);
                            $('#sltPaymentMethod').val(getPaymentMethodVal);
                            //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                            let bankAccountData = Session.get('bankaccount') || 'Bank';
                            $('#edtSelectBankAccountName').val(bankAccountData);
                            templateObject.getLastPaymentData();
                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].customername == data.fields.SupplierName) {
                                        $('#edtSupplierEmail').val(clientList[i].customeremail);
                                        $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                        let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                        $('#txabillingAddress').val(postalAddress);
                                    }
                                }
                            }

                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                                if (error) {

                                    //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                                } else {
                                    if (result) {
                                        for (let i = 0; i < result.customFields.length; i++) {
                                            let customcolumn = result.customFields;
                                            let columData = customcolumn[i].label;
                                            let columHeaderUpdate = customcolumn[i].thclass;
                                            let hiddenColumn = customcolumn[i].hidden;
                                            let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                            let columnWidth = customcolumn[i].width;

                                            $("" + columHeaderUpdate + "").html(columData);
                                            if (columnWidth != 0) {
                                                $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                            }

                                            if (hiddenColumn == true) {
                                                $("." + columnClass + "").addClass('hiddenColumn');
                                                $("." + columnClass + "").removeClass('showColumn');
                                                $(".chk" + columnClass + "").removeAttr('checked');
                                            } else if (hiddenColumn == false) {
                                                $("." + columnClass + "").removeClass('hiddenColumn');
                                                $("." + columnClass + "").addClass('showColumn');
                                                $(".chk" + columnClass + "").attr('checked', 'checked');
                                            }

                                        }
                                    }

                                }
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    }
                }

            }).catch(function(err) {
                paymentService.getOnePurchaseOrderPayment(currentPOID).then(function(data) {
                    let lineItems = [];
                    let lineItemObj = {};

                    let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("DD/MM/YYYY");
                    //if (data.fields.Lines.length) {
                    //for (let i = 0; i < data.fields.Lines.length; i++) {
                    let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });

                    lineItemObj = {
                        id: data.fields.ID || '',
                        invoiceid: data.fields.ID || '',
                        transid: data.fields.ID || '',
                        poid: data.fields.ID || '',
                        invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
                        refno: data.fields.CustPONumber || '',
                        transtype: 'Purchase Order' || '',
                        amountdue: amountDue || 0,
                        paymentamount: paymentAmt || 0,
                        ouststandingamount: outstandingAmt,
                        orginalamount: originalAmt,
                        comments: data.fields.Comments || ''
                    };
                    lineItems.push(lineItemObj);

                    let record = {
                        lid: '',
                        customerName: data.fields.ClientName || '',
                        paymentDate: begunDate,
                        reference: data.fields.CustPONumber || ' ',
                        bankAccount: Session.get('bankaccount') || '',
                        paymentAmount: appliedAmt || 0,
                        notes: data.fields.Comments,
                        LineItems: lineItems,
                        checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                        department: Session.get('department') || data.fields.DeptClassName,
                        applied: appliedAmt.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        })

                    };
                    templateObject.record.set(record);

                    let getDepartmentVal = Session.get('department') || data.fields.DeptClassName || defaultDept;
                    let getPaymentMethodVal = '';

                    if (Session.get('paymentmethod')) {
                        getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod;
                    } else {
                        getPaymentMethodVal = data.fields.PayMethod || '';
                    }

                    //$('#edtSupplierName').editableSelect('add', data.fields.ClientName);
                    $('#edtSupplierName').val(data.fields.ClientName);
                    $('#sltDepartment').val(getDepartmentVal);
                    $('#sltPaymentMethod').val(getPaymentMethodVal);
                    //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                    let bankAccountData = Session.get('bankaccount') || 'Bank';
                    $('#edtSelectBankAccountName').val(bankAccountData);
                    templateObject.getLastPaymentData();
                    if (clientList) {
                        for (var i = 0; i < clientList.length; i++) {
                            if (clientList[i].customername == data.fields.SupplierName) {
                                $('#edtSupplierEmail').val(clientList[i].customeremail);
                                $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                $('#txabillingAddress').val(postalAddress);
                            }
                        }
                    }

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                        if (error) {

                            //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass;
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                    let columnWidth = customcolumn[i].width;

                                    $("" + columHeaderUpdate + "").html(columData);
                                    if (columnWidth != 0) {
                                        $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                    }

                                    if (hiddenColumn == true) {
                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                        $(".chk" + columnClass + "").removeAttr('checked');
                                    } else if (hiddenColumn == false) {
                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                        $("." + columnClass + "").addClass('showColumn');
                                        $(".chk" + columnClass + "").attr('checked', 'checked');
                                    }

                                }
                            }

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            });

        }
    } else if (url.indexOf('?billid=') > 0) {
        var getpo_id = url.split('?billid=');
        var currentPOID = getpo_id[getpo_id.length - 1];
        if (getpo_id[1]) {
            currentPOID = parseInt(currentPOID);
            getVS1Data('TBillEx').then(function(dataObject) {
                if (dataObject.length == 0) {
                    paymentService.getOneBillPayment(currentPOID).then(function(data) {
                        let lineItems = [];
                        let lineItemObj = {};

                        let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        var currentDate = new Date();
                        var begunDate = moment(currentDate).format("DD/MM/YYYY");
                        //if (data.fields.Lines.length) {
                        //for (let i = 0; i < data.fields.Lines.length; i++) {
                        let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });

                        lineItemObj = {
                            id: data.fields.ID || '',
                            invoiceid: data.fields.ID || '',
                            transid: data.fields.ID || '',
                            poid: data.fields.ID || '',
                            invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
                            refno: data.fields.CustPONumber || '',
                            transtype: 'Bill' || '',
                            amountdue: amountDue || 0,
                            paymentamount: paymentAmt || 0,
                            ouststandingamount: outstandingAmt,
                            orginalamount: originalAmt,
                            comments: data.fields.Comments || ''
                        };
                        lineItems.push(lineItemObj);

                        let record = {
                            lid: '',
                            customerName: data.fields.ClientName || '',
                            paymentDate: begunDate,
                            reference: data.fields.CustPONumber || ' ',
                            bankAccount: Session.get('bankaccount') || '',
                            paymentAmount: appliedAmt || 0,
                            notes: data.fields.Comments,
                            LineItems: lineItems,
                            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                            department: Session.get('department') || data.fields.DeptClassName,
                            applied: appliedAmt.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            })

                        };
                        templateObject.record.set(record);

                        let getDepartmentVal = Session.get('department') || data.fields.DeptClassName || defaultDept;
                        let getPaymentMethodVal = '';

                        if (Session.get('paymentmethod')) {
                            getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod;
                        } else {
                            getPaymentMethodVal = data.fields.PayMethod || '';
                        }

                        //$('#edtSupplierName').editableSelect('add', data.fields.ClientName);
                        $('#edtSupplierName').val(data.fields.ClientName);
                        $('#sltDepartment').val(getDepartmentVal);
                        $('#sltPaymentMethod').val(getPaymentMethodVal);
                        //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                        let bankAccountData = Session.get('bankaccount') || 'Bank';
                        $('#edtSelectBankAccountName').val(bankAccountData);
                        templateObject.getLastPaymentData();
                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].customername == data.fields.SupplierName) {
                                    $('#edtSupplierEmail').val(clientList[i].customeremail);
                                    $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                    let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                    $('#txabillingAddress').val(postalAddress);
                                }
                            }
                        }

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                            if (error) {

                                //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                            } else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass;
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                        let columnWidth = customcolumn[i].width;

                                        $("" + columHeaderUpdate + "").html(columData);
                                        if (columnWidth != 0) {
                                            $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                        }

                                        if (hiddenColumn == true) {
                                            $("." + columnClass + "").addClass('hiddenColumn');
                                            $("." + columnClass + "").removeClass('showColumn');
                                            $(".chk" + columnClass + "").removeAttr('checked');
                                        } else if (hiddenColumn == false) {
                                            $("." + columnClass + "").removeClass('hiddenColumn');
                                            $("." + columnClass + "").addClass('showColumn');
                                            $(".chk" + columnClass + "").attr('checked', 'checked');
                                        }

                                    }
                                }

                            }
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tbillex;
                    var added = false;
                    for (let d = 0; d < useData.length; d++) {
                        if (parseInt(useData[d].fields.ID) === currentPOID) {
                            added = true;
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let lineItemObj = {};

                            let total = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let appliedAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            var currentDate = new Date();
                            var begunDate = moment(currentDate).format("DD/MM/YYYY");
                            //if (useData[d].fields.Lines.length) {
                            //for (let i = 0; i < useData[d].fields.Lines.length; i++) {
                            let amountDue = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let paymentAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let outstandingAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let originalAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalAmountInc).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });

                            lineItemObj = {
                                id: useData[d].fields.ID || '',
                                invoiceid: useData[d].fields.ID || '',
                                transid: useData[d].fields.ID || '',
                                poid: useData[d].fields.ID || '',
                                invoicedate: useData[d].fields.OrderDate != '' ? moment(useData[d].fields.OrderDate).format("DD/MM/YYYY") : useData[d].fields.OrderDate,
                                refno: useData[d].fields.CustPONumber || '',
                                transtype: 'Bill' || '',
                                amountdue: amountDue || 0,
                                paymentamount: paymentAmt || 0,
                                ouststandingamount: outstandingAmt,
                                orginalamount: originalAmt,
                                comments: useData[d].fields.Comments || ''
                            };
                            lineItems.push(lineItemObj);

                            let record = {
                                lid: '',
                                customerName: useData[d].fields.ClientName || '',
                                paymentDate: begunDate,
                                reference: useData[d].fields.CustPONumber || ' ',
                                bankAccount: Session.get('bankaccount') || '',
                                paymentAmount: appliedAmt || 0,
                                notes: useData[d].fields.Comments,
                                LineItems: lineItems,
                                checkpayment: Session.get('paymentmethod') || useData[d].fields.PayMethod,
                                department: Session.get('department') || useData[d].fields.DeptClassName,
                                applied: appliedAmt.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                })

                            };
                            templateObject.record.set(record);
                            let getDepartmentVal = Session.get('department') || useData[d].fields.DeptClassName || defaultDept;
                            let getPaymentMethodVal = '';

                            if (Session.get('paymentmethod')) {
                                getPaymentMethodVal = Session.get('paymentmethod') || useData[d].fields.PayMethod;
                            } else {
                                getPaymentMethodVal = useData[d].fields.PayMethod || '';
                            }

                            //$('#edtSupplierName').editableSelect('add', useData[d].fields.ClientName);
                            $('#edtSupplierName').val(useData[d].fields.ClientName);
                            $('#sltDepartment').val(getDepartmentVal);
                            $('#sltPaymentMethod').val(getPaymentMethodVal);
                            //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                            let bankAccountData = Session.get('bankaccount') || 'Bank';
                            $('#edtSelectBankAccountName').val(bankAccountData);
                            templateObject.getLastPaymentData();
                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].customername == useData[d].fields.SupplierName) {
                                        $('#edtSupplierEmail').val(clientList[i].customeremail);
                                        $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                        let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                        $('#txabillingAddress').val(postalAddress);
                                    }
                                }
                            }

                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                                if (error) {

                                    //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                                } else {
                                    if (result) {
                                        for (let i = 0; i < result.customFields.length; i++) {
                                            let customcolumn = result.customFields;
                                            let columData = customcolumn[i].label;
                                            let columHeaderUpdate = customcolumn[i].thclass;
                                            let hiddenColumn = customcolumn[i].hidden;
                                            let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                            let columnWidth = customcolumn[i].width;

                                            $("" + columHeaderUpdate + "").html(columData);
                                            if (columnWidth != 0) {
                                                $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                            }

                                            if (hiddenColumn == true) {
                                                $("." + columnClass + "").addClass('hiddenColumn');
                                                $("." + columnClass + "").removeClass('showColumn');
                                                $(".chk" + columnClass + "").removeAttr('checked');
                                            } else if (hiddenColumn == false) {
                                                $("." + columnClass + "").removeClass('hiddenColumn');
                                                $("." + columnClass + "").addClass('showColumn');
                                                $(".chk" + columnClass + "").attr('checked', 'checked');
                                            }

                                        }
                                    }

                                }
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        }
                    }
                    if (!added) {
                      paymentService.getOneBillPayment(currentPOID).then(function(data) {
                          let lineItems = [];
                          let lineItemObj = {};

                          let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                              minimumFractionDigits: 2
                          });
                          let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                              minimumFractionDigits: 2
                          });
                          var currentDate = new Date();
                          var begunDate = moment(currentDate).format("DD/MM/YYYY");
                          //if (data.fields.Lines.length) {
                          //for (let i = 0; i < data.fields.Lines.length; i++) {
                          let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                              minimumFractionDigits: 2
                          });
                          let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                              minimumFractionDigits: 2
                          });
                          let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                              minimumFractionDigits: 2
                          });
                          let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                              minimumFractionDigits: 2
                          });

                          lineItemObj = {
                              id: data.fields.ID || '',
                              invoiceid: data.fields.ID || '',
                              transid: data.fields.ID || '',
                              poid: data.fields.ID || '',
                              invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
                              refno: data.fields.CustPONumber || '',
                              transtype: 'Bill' || '',
                              amountdue: amountDue || 0,
                              paymentamount: paymentAmt || 0,
                              ouststandingamount: outstandingAmt,
                              orginalamount: originalAmt,
                              comments: data.fields.Comments || ''
                          };
                          lineItems.push(lineItemObj);

                          let record = {
                              lid: '',
                              customerName: data.fields.ClientName || '',
                              paymentDate: begunDate,
                              reference: data.fields.CustPONumber || ' ',
                              bankAccount: Session.get('bankaccount') || '',
                              paymentAmount: appliedAmt || 0,
                              notes: data.fields.Comments,
                              LineItems: lineItems,
                              checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                              department: Session.get('department') || data.fields.DeptClassName,
                              applied: appliedAmt.toLocaleString(undefined, {
                                  minimumFractionDigits: 2
                              })

                          };
                          templateObject.record.set(record);

                          let getDepartmentVal = Session.get('department') || data.fields.DeptClassName || defaultDept;
                          let getPaymentMethodVal = '';

                          if (Session.get('paymentmethod')) {
                              getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod;
                          } else {
                              getPaymentMethodVal = data.fields.PayMethod || '';
                          }

                          //$('#edtSupplierName').editableSelect('add', data.fields.ClientName);
                          $('#edtSupplierName').val(data.fields.ClientName);
                          $('#sltDepartment').val(getDepartmentVal);
                          $('#sltPaymentMethod').val(getPaymentMethodVal);
                          //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                          let bankAccountData = Session.get('bankaccount') || 'Bank';
                          $('#edtSelectBankAccountName').val(bankAccountData);
                          templateObject.getLastPaymentData();
                          if (clientList) {
                              for (var i = 0; i < clientList.length; i++) {
                                  if (clientList[i].customername == data.fields.SupplierName) {
                                      $('#edtSupplierEmail').val(clientList[i].customeremail);
                                      $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                      let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                      $('#txabillingAddress').val(postalAddress);
                                  }
                              }
                          }

                          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                              if (error) {

                                  //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                              } else {
                                  if (result) {
                                      for (let i = 0; i < result.customFields.length; i++) {
                                          let customcolumn = result.customFields;
                                          let columData = customcolumn[i].label;
                                          let columHeaderUpdate = customcolumn[i].thclass;
                                          let hiddenColumn = customcolumn[i].hidden;
                                          let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                          let columnWidth = customcolumn[i].width;

                                          $("" + columHeaderUpdate + "").html(columData);
                                          if (columnWidth != 0) {
                                              $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                          }

                                          if (hiddenColumn == true) {
                                              $("." + columnClass + "").addClass('hiddenColumn');
                                              $("." + columnClass + "").removeClass('showColumn');
                                              $(".chk" + columnClass + "").removeAttr('checked');
                                          } else if (hiddenColumn == false) {
                                              $("." + columnClass + "").removeClass('hiddenColumn');
                                              $("." + columnClass + "").addClass('showColumn');
                                              $(".chk" + columnClass + "").attr('checked', 'checked');
                                          }

                                      }
                                  }

                              }
                          });
                          $('.fullScreenSpin').css('display', 'none');
                      });
                    }
                }

            }).catch(function(err) {
                paymentService.getOneBillPayment(currentPOID).then(function(data) {
                    let lineItems = [];
                    let lineItemObj = {};

                    let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("DD/MM/YYYY");
                    //if (data.fields.Lines.length) {
                    //for (let i = 0; i < data.fields.Lines.length; i++) {
                    let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });

                    lineItemObj = {
                        id: data.fields.ID || '',
                        invoiceid: data.fields.ID || '',
                        transid: data.fields.ID || '',
                        poid: data.fields.ID || '',
                        invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
                        refno: data.fields.CustPONumber || '',
                        transtype: 'Bill' || '',
                        amountdue: amountDue || 0,
                        paymentamount: paymentAmt || 0,
                        ouststandingamount: outstandingAmt,
                        orginalamount: originalAmt,
                        comments: data.fields.Comments || ''
                    };
                    lineItems.push(lineItemObj);

                    let record = {
                        lid: '',
                        customerName: data.fields.ClientName || '',
                        paymentDate: begunDate,
                        reference: data.fields.CustPONumber || ' ',
                        bankAccount: Session.get('bankaccount') || '',
                        paymentAmount: appliedAmt || 0,
                        notes: data.fields.Comments,
                        LineItems: lineItems,
                        checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                        department: Session.get('department') || data.fields.DeptClassName,
                        applied: appliedAmt.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        })

                    };
                    templateObject.record.set(record);

                    let getDepartmentVal = Session.get('department') || data.fields.DeptClassName || defaultDept;
                    let getPaymentMethodVal = '';

                    if (Session.get('paymentmethod')) {
                        getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod;
                    } else {
                        getPaymentMethodVal = data.fields.PayMethod || '';
                    }

                    //$('#edtSupplierName').editableSelect('add', data.fields.ClientName);
                    $('#edtSupplierName').val(data.fields.ClientName);
                    $('#sltDepartment').val(getDepartmentVal);
                    $('#sltPaymentMethod').val(getPaymentMethodVal);
                    //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                    let bankAccountData = Session.get('bankaccount') || 'Bank';
                    $('#edtSelectBankAccountName').val(bankAccountData);
                    templateObject.getLastPaymentData();
                    if (clientList) {
                        for (var i = 0; i < clientList.length; i++) {
                            if (clientList[i].customername == data.fields.SupplierName) {
                                $('#edtSupplierEmail').val(clientList[i].customeremail);
                                $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                $('#txabillingAddress').val(postalAddress);
                            }
                        }
                    }

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                        if (error) {

                            //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                        } else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass;
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                    let columnWidth = customcolumn[i].width;

                                    $("" + columHeaderUpdate + "").html(columData);
                                    if (columnWidth != 0) {
                                        $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                    }

                                    if (hiddenColumn == true) {
                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                        $(".chk" + columnClass + "").removeAttr('checked');
                                    } else if (hiddenColumn == false) {
                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                        $("." + columnClass + "").addClass('showColumn');
                                        $(".chk" + columnClass + "").attr('checked', 'checked');
                                    }

                                }
                            }

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            });

        }
    } else if (url.indexOf('?creditid=') > 0) {
        var getpo_id = url.split('?creditid=');
        var currentPOID = getpo_id[getpo_id.length - 1];
        if (getpo_id[1]) {
            currentPOID = parseInt(currentPOID);
            getVS1Data('TCredit').then(function(dataObject) {
                if (dataObject.length == 0) {
                    paymentService.getOneCreditPayment(currentPOID).then(function(data) {
                        let lineItems = [];
                        let lineItemObj = {};

                        let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        var currentDate = new Date();
                        var begunDate = moment(currentDate).format("DD/MM/YYYY");
                        //if (data.fields.Lines.length) {
                        //for (let i = 0; i < data.fields.Lines.length; i++) {
                        let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscountTotalDiscount).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });

                        lineItemObj = {
                            id: data.fields.ID || '',
                            invoiceid: data.fields.ID || '',
                            transid: data.fields.ID || '',
                            poid: data.fields.ID || '',
                            invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
                            refno: data.fields.CustPONumber || '',
                            transtype: 'Credit' || '',
                            amountdue: amountDue || 0,
                            paymentamount: paymentAmt || 0,
                            ouststandingamount: outstandingAmt,
                            orginalamount: originalAmt,
                            comments: data.fields.Comments || ''
                        };
                        lineItems.push(lineItemObj);

                        let record = {
                            lid: '',
                            customerName: data.fields.ClientName || '',
                            paymentDate: begunDate,
                            reference: data.fields.CustPONumber || ' ',
                            bankAccount: Session.get('bankaccount') || '',
                            paymentAmount: appliedAmt || 0,
                            notes: data.fields.Comments,
                            LineItems: lineItems,
                            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                            department: Session.get('department') || data.fields.DeptClassName,
                            applied: appliedAmt.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            })

                        };
                        templateObject.record.set(record);
                        let getDepartmentVal = Session.get('department') || data.fields.DeptClassName || defaultDept;
                        let getPaymentMethodVal = '';

                        if (Session.get('paymentmethod')) {
                            getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod;
                        } else {
                            getPaymentMethodVal = data.fields.PayMethod || '';
                        }

                        //$('#edtSupplierName').editableSelect('add', data.fields.ClientName);
                        $('#edtSupplierName').val(data.fields.ClientName);
                        $('#sltDepartment').val(getDepartmentVal);
                        $('#sltPaymentMethod').val(getPaymentMethodVal);
                        //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                        let bankAccountData = Session.get('bankaccount') || 'Bank';
                        $('#edtSelectBankAccountName').val(bankAccountData);
                        templateObject.getLastPaymentData();
                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].customername == data.fields.SupplierName) {
                                    $('#edtSupplierEmail').val(clientList[i].customeremail);
                                    $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                    let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                    $('#txabillingAddress').val(postalAddress);
                                }
                            }
                        }

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                            if (error) {} else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass;
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                        let columnWidth = customcolumn[i].width;

                                        $("" + columHeaderUpdate + "").html(columData);
                                        if (columnWidth != 0) {
                                            $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                        }

                                        if (hiddenColumn == true) {
                                            $("." + columnClass + "").addClass('hiddenColumn');
                                            $("." + columnClass + "").removeClass('showColumn');
                                            $(".chk" + columnClass + "").removeAttr('checked');
                                        } else if (hiddenColumn == false) {
                                            $("." + columnClass + "").removeClass('hiddenColumn');
                                            $("." + columnClass + "").addClass('showColumn');
                                            $(".chk" + columnClass + "").attr('checked', 'checked');
                                        }

                                    }
                                }

                            }
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tcredit;
                    var added = false;
                    for (let d = 0; d < useData.length; d++) {
                        if (parseInt(useData[d].fields.ID) === currentPOID) {
                            added = true;
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            let lineItemObj = {};

                            let total = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalDiscount).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let appliedAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalDiscount).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            var currentDate = new Date();
                            var begunDate = moment(currentDate).format("DD/MM/YYYY");
                            //if (useData[d].fields.Lines.length) {
                            //for (let i = 0; i < useData[d].fields.Lines.length; i++) {
                            let amountDue = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalDiscount).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let paymentAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalDiscount).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let outstandingAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalDiscount).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let originalAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalAmountInc).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });

                            lineItemObj = {
                                id: useData[d].fields.ID || '',
                                invoiceid: useData[d].fields.ID || '',
                                transid: useData[d].fields.ID || '',
                                poid: useData[d].fields.ID || '',
                                invoicedate: useData[d].fields.OrderDate != '' ? moment(useData[d].fields.OrderDate).format("DD/MM/YYYY") : useData[d].fields.OrderDate,
                                refno: useData[d].fields.CustPONumber || '',
                                transtype: 'Credit' || '',
                                amountdue: amountDue || 0,
                                paymentamount: paymentAmt || 0,
                                ouststandingamount: outstandingAmt,
                                orginalamount: originalAmt,
                                comments: useData[d].fields.Comments || ''
                            };
                            lineItems.push(lineItemObj);

                            let record = {
                                lid: '',
                                customerName: useData[d].fields.ClientName || '',
                                paymentDate: begunDate,
                                reference: useData[d].fields.CustPONumber || ' ',
                                bankAccount: Session.get('bankaccount') || '',
                                paymentAmount: appliedAmt || 0,
                                notes: useData[d].fields.Comments,
                                LineItems: lineItems,
                                checkpayment: Session.get('paymentmethod') || useData[d].fields.PayMethod,
                                department: Session.get('department') || useData[d].fields.DeptClassName,
                                applied: appliedAmt.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                })

                            };
                            templateObject.record.set(record);

                            let getDepartmentVal = Session.get('department') || useData[d].fields.DeptClassName || defaultDept;
                            let getPaymentMethodVal = '';

                            if (Session.get('paymentmethod')) {
                                getPaymentMethodVal = Session.get('paymentmethod') || useData[d].fields.PayMethod;
                            } else {
                                getPaymentMethodVal = useData[d].fields.PayMethod || '';
                            }

                            //$('#edtSupplierName').editableSelect('add', useData[d].fields.ClientName);
                            $('#edtSupplierName').val(useData[d].fields.ClientName);
                            $('#sltDepartment').val(getDepartmentVal);
                            $('#sltPaymentMethod').val(getPaymentMethodVal);
                            //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                            let bankAccountData = Session.get('bankaccount') || 'Bank';
                            $('#edtSelectBankAccountName').val(bankAccountData);
                            templateObject.getLastPaymentData();
                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].customername == useData[d].fields.SupplierName) {
                                        $('#edtSupplierEmail').val(clientList[i].customeremail);
                                        $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                        let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                        $('#txabillingAddress').val(postalAddress);
                                    }
                                }
                            }

                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                                if (error) {} else {
                                    if (result) {
                                        for (let i = 0; i < result.customFields.length; i++) {
                                            let customcolumn = result.customFields;
                                            let columData = customcolumn[i].label;
                                            let columHeaderUpdate = customcolumn[i].thclass;
                                            let hiddenColumn = customcolumn[i].hidden;
                                            let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                            let columnWidth = customcolumn[i].width;

                                            $("" + columHeaderUpdate + "").html(columData);
                                            if (columnWidth != 0) {
                                                $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                            }

                                            if (hiddenColumn == true) {
                                                $("." + columnClass + "").addClass('hiddenColumn');
                                                $("." + columnClass + "").removeClass('showColumn');
                                                $(".chk" + columnClass + "").removeAttr('checked');
                                            } else if (hiddenColumn == false) {
                                                $("." + columnClass + "").removeClass('hiddenColumn');
                                                $("." + columnClass + "").addClass('showColumn');
                                                $(".chk" + columnClass + "").attr('checked', 'checked');
                                            }

                                        }
                                    }

                                }
                            });
                            $('.fullScreenSpin').css('display', 'none');
                        }
                    }
                    if (!added) {}
                }
            }).catch(function(err) {
                paymentService.getOneCreditPayment(currentPOID).then(function(data) {
                    let lineItems = [];
                    let lineItemObj = {};

                    let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("DD/MM/YYYY");
                    //if (data.fields.Lines.length) {
                    //for (let i = 0; i < data.fields.Lines.length; i++) {
                    let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });

                    lineItemObj = {
                        id: data.fields.ID || '',
                        invoiceid: data.fields.ID || '',
                        transid: data.fields.ID || '',
                        poid: data.fields.ID || '',
                        invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
                        refno: data.fields.CustPONumber || '',
                        transtype: 'Credit' || '',
                        amountdue: amountDue || 0,
                        paymentamount: paymentAmt || 0,
                        ouststandingamount: outstandingAmt,
                        orginalamount: originalAmt,
                        comments: data.fields.Comments || ''
                    };
                    lineItems.push(lineItemObj);

                    let record = {
                        lid: '',
                        customerName: data.fields.ClientName || '',
                        paymentDate: begunDate,
                        reference: data.fields.CustPONumber || ' ',
                        bankAccount: Session.get('bankaccount') || '',
                        paymentAmount: appliedAmt || 0,
                        notes: data.fields.Comments,
                        LineItems: lineItems,
                        checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                        department: Session.get('department') || data.fields.DeptClassName,
                        applied: appliedAmt.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        })

                    };
                    templateObject.record.set(record);
                    //$('#edtSupplierName').editableSelect('add', data.fields.ClientName);
                    $('#edtSupplierName').val(data.fields.ClientName);
                    let getDepartmentVal = Session.get('department') || data.fields.DeptClassName || defaultDept;
                    let getPaymentMethodVal = '';

                    if (Session.get('paymentmethod')) {
                        getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod;
                    } else {
                        getPaymentMethodVal = data.fields.PayMethod || '';
                    }

                    $('#sltDepartment').val(getDepartmentVal);
                    $('#sltPaymentMethod').val(getPaymentMethodVal);
                    //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                    let bankAccountData = Session.get('bankaccount') || 'Bank';
                    $('#edtSelectBankAccountName').val(bankAccountData);
                    templateObject.getLastPaymentData();
                    if (clientList) {
                        for (var i = 0; i < clientList.length; i++) {
                            if (clientList[i].customername == data.fields.SupplierName) {
                                $('#edtSupplierEmail').val(clientList[i].customeremail);
                                $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                $('#txabillingAddress').val(postalAddress);
                            }
                        }
                    }

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                        if (error) {} else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass;
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                    let columnWidth = customcolumn[i].width;

                                    $("" + columHeaderUpdate + "").html(columData);
                                    if (columnWidth != 0) {
                                        $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                    }

                                    if (hiddenColumn == true) {
                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                        $(".chk" + columnClass + "").removeAttr('checked');
                                    } else if (hiddenColumn == false) {
                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                        $("." + columnClass + "").addClass('showColumn');
                                        $(".chk" + columnClass + "").attr('checked', 'checked');
                                    }

                                }
                            }

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            });

        }
    } else if ((url.indexOf('?suppname=') > 0) && (url.indexOf('from=') > 0)) {
        var getsale_custname = url.split('?suppname=');
        var currentSalesURL = getsale_custname[getsale_custname.length - 1].split("&");

        var getsale_salesid = url.split('from=');
        var currentSalesID = getsale_salesid[getsale_salesid.length - 1].split('#')[0];

        if (getsale_custname[1]) {
            let currentSalesName = currentSalesURL[0].replace(/%20/g, " ");
            // let currentSalesID = currentSalesURL[1].split('from=');
            paymentService.getSupplierPaymentByName(currentSalesName).then(function(data) {
                let lineItems = [];
                let lineItemObj = {};
                let companyName = '';
                let referenceNo = '';
                let paymentMethodName = '';
                let accountName = '';
                let notes = '';
                let paymentdate = '';
                let checkpayment = '';
                let department = '';
                let appliedAmt = 0;

                for (let i = 0; i < data.tsupplierpayment.length; i++) {
                    if (data.tsupplierpayment[i].fields.Lines && data.tsupplierpayment[i].fields.Lines.length) {
                        for (let j = 0; j < data.tsupplierpayment[i].fields.Lines.length; j++) {
                            if (data.tsupplierpayment[i].fields.Lines[j].fields.TransNo == currentSalesID) {
                                companyName = data.tsupplierpayment[i].fields.CompanyName;
                                referenceNo = data.tsupplierpayment[i].fields.ReferenceNo;
                                paymentMethodName = data.tsupplierpayment[i].fields.PaymentMethodName;
                                accountName = data.tsupplierpayment[i].fields.AccountName;
                                notes = data.tsupplierpayment[i].fields.Notes;
                                paymentdate = data.tsupplierpayment[i].fields.PaymentDate;
                                checkpayment = data.tsupplierpayment[i].fields.PaymentMethodName;
                                department = data.tsupplierpayment[i].fields.DeptClassName;
                                appliedAmt = utilityService.modifynegativeCurrencyFormat(data.tsupplierpayment[i].fields.Applied).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                templateObject.supppaymentid.set(data.tsupplierpayment[i].fields.ID);

                                let amountDue = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.AmountDue.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let paymentAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.Payment.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let outstandingAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.AmountOutstanding.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let originalAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.OriginalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });

                                lineItemObj = {
                                    id: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
                                    invoiceid: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
                                    transid: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
                                    poid: data.tsupplierpayment[i].fields.Lines[j].fields.POID || '',
                                    invoicedate: data.tsupplierpayment[i].fields.Lines[j].fields.Date != '' ? moment(data.tsupplierpayment[i].fields.Lines[j].fields.Date).format("DD/MM/YYYY") : data.tsupplierpayment[i].fields.Lines[j].fields.Date,
                                    refno: data.tsupplierpayment[i].fields.Lines[j].fields.RefNo || '',
                                    transtype: "Purchase order" || '',
                                    amountdue: amountDue || 0,
                                    paymentamount: paymentAmt || 0,
                                    ouststandingamount: outstandingAmt,
                                    orginalamount: originalAmt
                                };
                                lineItems.push(lineItemObj);
                            } else {}

                        }
                    }
                }
                let record = {
                    lid: '',
                    customerName: companyName || '',
                    paymentDate: paymentdate ? moment(paymentdate).format('DD/MM/YYYY') : "",
                    reference: referenceNo || ' ',
                    bankAccount: Session.get('bankaccount') || accountName || '',
                    paymentAmount: appliedAmt.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    }) || 0,
                    notes: notes || '',
                    LineItems: lineItems,
                    checkpayment: Session.get('paymentmethod') || checkpayment || '',
                    department: Session.get('department') || department || '',
                    applied: appliedAmt.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    }) || 0

                };

                $('#edtSupplierName').val(companyName);
                let bankAccountData = Session.get('bankaccount') || accountName || 'Bank';
                $('#edtSelectBankAccountName').val(bankAccountData);
                let paymentMethodData = Session.get('paymentmethod') || checkpayment || 'Cash';
                $('#sltPaymentMethod').val(paymentMethodData);

                templateObject.record.set(record);
                if (clientList) {
                    for (var i = 0; i < clientList.length; i++) {
                        if (clientList[i].customername == companyName) {
                            $('#edtCustomerEmail').val(clientList[i].customeremail);
                            $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                            let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                            $('#txabillingAddress').val(postalAddress);
                        }
                    }
                }

                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                    if (error) {

                        //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                    } else {
                        if (result) {
                            for (let i = 0; i < result.customFields.length; i++) {
                                let customcolumn = result.customFields;
                                let columData = customcolumn[i].label;
                                let columHeaderUpdate = customcolumn[i].thclass;
                                let hiddenColumn = customcolumn[i].hidden;
                                let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                let columnWidth = customcolumn[i].width;

                                $("" + columHeaderUpdate + "").html(columData);
                                if (columnWidth != 0) {
                                    $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                }

                                if (hiddenColumn == true) {
                                    $("." + columnClass + "").addClass('hiddenColumn');
                                    $("." + columnClass + "").removeClass('showColumn');
                                    $(".chk" + columnClass + "").removeAttr('checked');
                                } else if (hiddenColumn == false) {
                                    $("." + columnClass + "").removeClass('hiddenColumn');
                                    $("." + columnClass + "").addClass('showColumn');
                                    $(".chk" + columnClass + "").attr('checked', 'checked');
                                }

                            }
                        }

                    }
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    } else if ((url.indexOf('?bsuppname=') > 0) && (url.indexOf('from=') > 0)) {
        var getsale_custname = url.split('?bsuppname=');
        var currentSalesURL = getsale_custname[getsale_custname.length - 1].split("&");

        var getsale_salesid = url.split('from=');
        var currentSalesID = getsale_salesid[getsale_salesid.length - 1].split('#')[0];

        if (getsale_custname[1]) {
            let currentSalesName = currentSalesURL[0].replace(/%20/g, " ");
            // let currentSalesID = currentSalesURL[1].split('from=');
            paymentService.getSupplierPaymentByName(currentSalesName).then(function(data) {
                let lineItems = [];
                let lineItemObj = {};
                let companyName = '';
                let suppPaymentID = '';
                let referenceNo = '';
                let paymentMethodName = '';
                let accountName = '';
                let notes = '';
                let paymentdate = '';
                let checkpayment = '';
                let department = '';
                let appliedAmt = 0;

                for (let i = 0; i < data.tsupplierpayment.length; i++) {
                    if (data.tsupplierpayment[i].fields.Lines && data.tsupplierpayment[i].fields.Lines.length) {
                        for (let j = 0; j < data.tsupplierpayment[i].fields.Lines.length; j++) {
                            if (data.tsupplierpayment[i].fields.Lines[j].fields.TransNo == currentSalesID) {
                                companyName = data.tsupplierpayment[i].fields.CompanyName;
                                suppPaymentID = data.tsupplierpayment[i].fields.ID;
                                referenceNo = data.tsupplierpayment[i].fields.ReferenceNo;
                                paymentMethodName = data.tsupplierpayment[i].fields.PaymentMethodName;
                                accountName = data.tsupplierpayment[i].fields.AccountName;
                                notes = data.tsupplierpayment[i].fields.Notes;
                                paymentdate = data.tsupplierpayment[i].fields.PaymentDate;
                                checkpayment = data.tsupplierpayment[i].fields.PaymentMethodName;
                                department = data.tsupplierpayment[i].fields.DeptClassName;
                                appliedAmt = utilityService.modifynegativeCurrencyFormat(data.tsupplierpayment[i].fields.Applied).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                templateObject.supppaymentid.set(data.tsupplierpayment[i].fields.ID);

                                let amountDue = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.AmountDue.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let paymentAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.Payment.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let outstandingAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.AmountOutstanding.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let originalAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines[j].fields.OriginalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });

                                lineItemObj = {
                                    id: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
                                    invoiceid: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
                                    poid: data.tsupplierpayment[i].fields.Lines[j].fields.POID || '',
                                    transid: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
                                    invoicedate: data.tsupplierpayment[i].fields.Lines[j].fields.Date != '' ? moment(data.tsupplierpayment[i].fields.Lines[j].fields.Date).format("DD/MM/YYYY") : data.tsupplierpayment[i].fields.Lines[j].fields.Date,
                                    refno: data.tsupplierpayment[i].fields.Lines[j].fields.RefNo || '',
                                    transtype: "Bill" || '',
                                    amountdue: amountDue || 0,
                                    paymentamount: paymentAmt || 0,
                                    ouststandingamount: outstandingAmt,
                                    orginalamount: originalAmt
                                };
                                lineItems.push(lineItemObj);
                            } else {}

                        }
                    } else {
                        if (data.tsupplierpayment[i].fields.Lines.fields.TransNo == currentSalesID) {
                            companyName = data.tsupplierpayment[i].fields.CompanyName;
                            suppPaymentID = data.tsupplierpayment[i].fields.ID;
                            referenceNo = data.tsupplierpayment[i].fields.ReferenceNo;
                            paymentMethodName = data.tsupplierpayment[i].fields.PaymentMethodName;
                            accountName = data.tsupplierpayment[i].fields.AccountName;
                            notes = data.tsupplierpayment[i].fields.Notes;
                            paymentdate = data.tsupplierpayment[i].fields.PaymentDate;
                            checkpayment = data.tsupplierpayment[i].fields.PaymentMethodName;
                            department = data.tsupplierpayment[i].fields.DeptClassName;
                            appliedAmt = utilityService.modifynegativeCurrencyFormat(data.tsupplierpayment[i].fields.Applied).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            templateObject.supppaymentid.set(data.tsupplierpayment[i].fields.ID);

                            let amountDue = Currency + '' + data.tsupplierpayment[i].fields.Lines.fields.AmountDue.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let paymentAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines.fields.Payment.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let outstandingAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines.fields.AmountOutstanding.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let originalAmt = Currency + '' + data.tsupplierpayment[i].fields.Lines.fields.OriginalAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });

                            lineItemObj = {
                                id: data.tsupplierpayment[i].fields.Lines.fields.ID || '',
                                invoiceid: data.tsupplierpayment[i].fields.Lines.fields.ID || '',
                                poid: data.tsupplierpayment[i].fields.Lines.fields.POID || '',
                                transid: data.tsupplierpayment[i].fields.Lines.fields.ID || '',
                                invoicedate: data.tsupplierpayment[i].fields.Lines.fields.Date != '' ? moment(data.tsupplierpayment[i].fields.Lines.fields.Date).format("DD/MM/YYYY") : data.tsupplierpayment[i].fields.Lines.fields.Date,
                                refno: data.tsupplierpayment[i].fields.Lines.fields.RefNo || '',
                                transtype: "Bill" || '',
                                amountdue: amountDue || 0,
                                paymentamount: paymentAmt || 0,
                                ouststandingamount: outstandingAmt,
                                orginalamount: originalAmt
                            };
                            lineItems.push(lineItemObj);
                        } else {}
                    }
                }
                let record = {
                    lid: suppPaymentID,
                    customerName: companyName || '',
                    paymentDate: paymentdate ? moment(paymentdate).format('DD/MM/YYYY') : "",
                    reference: referenceNo || ' ',
                    bankAccount: Session.get('bankaccount') || accountName || '',
                    paymentAmount: appliedAmt.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    }) || 0,
                    notes: notes || '',
                    LineItems: lineItems,
                    checkpayment: Session.get('paymentmethod') || checkpayment || '',
                    department: Session.get('department') || department || '',
                    applied: appliedAmt.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    }) || 0

                };

                $('#edtSupplierName').val(companyName);
                let bankAccountData = Session.get('bankaccount') || accountName || 'Bank';
                $('#edtSelectBankAccountName').val(bankAccountData);
                let paymentMethodData = Session.get('paymentmethod') || checkpayment || 'Cash';
                $('#sltPaymentMethod').val(paymentMethodData);

                templateObject.record.set(record);
                if (clientList) {
                    for (var i = 0; i < clientList.length; i++) {
                        if (clientList[i].customername == companyName) {
                            $('#edtCustomerEmail').val(clientList[i].customeremail);
                            $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                            let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                            $('#txabillingAddress').val(postalAddress);
                        }
                    }
                }

                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                    if (error) {

                        //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                    } else {
                        if (result) {
                            for (let i = 0; i < result.customFields.length; i++) {
                                let customcolumn = result.customFields;
                                let columData = customcolumn[i].label;
                                let columHeaderUpdate = customcolumn[i].thclass;
                                let hiddenColumn = customcolumn[i].hidden;
                                let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                let columnWidth = customcolumn[i].width;

                                $("" + columHeaderUpdate + "").html(columData);
                                if (columnWidth != 0) {
                                    $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                }

                                if (hiddenColumn == true) {
                                    $("." + columnClass + "").addClass('hiddenColumn');
                                    $("." + columnClass + "").removeClass('showColumn');
                                    $(".chk" + columnClass + "").removeAttr('checked');
                                } else if (hiddenColumn == false) {
                                    $("." + columnClass + "").removeClass('hiddenColumn');
                                    $("." + columnClass + "").addClass('showColumn');
                                    $(".chk" + columnClass + "").attr('checked', 'checked');
                                }

                            }
                        }

                    }
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    } else if ((url.indexOf('?suppcreditname=') > 0) && (url.indexOf('pocreditid=') > 0)) {
        var getsale_custname = url.split('?suppcreditname=');
        var currentSalesURL = getsale_custname[getsale_custname.length - 1].split("&");
        let totalPaymentAmount = 0;
        let totalCreditAmt = 0;
        let totalGrandAmount = 0;
        var getsale_salesid = url.split('pocreditid=');
        let lineItems = [];
        let lineItemObj = {};
        var currentSalesID = getsale_salesid[getsale_salesid.length - 1].split('#')[0];
        if (currentSalesID) {
            currentPOID = parseInt(currentSalesID);
            paymentService.getOnePurchaseOrderPayment(currentPOID).then(function(data) {

                let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                var currentDate = new Date();
                var begunDate = moment(currentDate).format("DD/MM/YYYY");
                let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                totalPaymentAmount = data.fields.TotalBalance;
                lineItemObj = {
                    id: data.fields.ID || '',
                    invoiceid: data.fields.ID || '',
                    transid: data.fields.ID || '',
                    poid: data.fields.ID || '',
                    invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
                    refno: data.fields.CustPONumber || '',
                    transtype: 'Purchase Order' || '',
                    amountdue: amountDue || 0,
                    paymentamount: paymentAmt || 0,
                    ouststandingamount: outstandingAmt,
                    orginalamount: originalAmt,
                    comments: data.fields.Comments || ''
                };
                lineItems.push(lineItemObj);

                let record = {
                    lid: '',
                    customerName: data.fields.ClientName || '',
                    paymentDate: begunDate,
                    reference: data.fields.CustPONumber || ' ',
                    bankAccount: Session.get('bankaccount') || '',
                    paymentAmount: appliedAmt || 0,
                    notes: data.fields.Comments,
                    LineItems: lineItems,
                    checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                    department: Session.get('department') || data.fields.DeptClassName,
                    applied: appliedAmt.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    })

                };
                templateObject.record.set(record);
                let getDepartmentVal = Session.get('department') || data.fields.DeptClassName;
                let getPaymentMethodVal = '';

                if (Session.get('paymentmethod')) {
                    getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod;
                } else {
                    getPaymentMethodVal = data.fields.PayMethod || '';
                }
                //$('#edtSupplierName').editableSelect('add', data.fields.ClientName);
                $('#edtSupplierName').val(data.fields.ClientName);
                $('#sltDepartment').val(getDepartmentVal)
                $('#sltPaymentMethod').val(getPaymentMethodVal);
                //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                let bankAccountData = Session.get('bankaccount') || 'Bank';
                $('#edtSelectBankAccountName').val(bankAccountData);
                templateObject.getLastPaymentData();
                if (clientList) {
                    for (var i = 0; i < clientList.length; i++) {
                        if (clientList[i].customername == data.fields.SupplierName) {
                            $('#edtSupplierEmail').val(clientList[i].customeremail);
                            $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                            let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                            $('#txabillingAddress').val(postalAddress);
                        }
                    }
                }

                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                    if (error) {} else {
                        if (result) {
                            for (let i = 0; i < result.customFields.length; i++) {
                                let customcolumn = result.customFields;
                                let columData = customcolumn[i].label;
                                let columHeaderUpdate = customcolumn[i].thclass;
                                let hiddenColumn = customcolumn[i].hidden;
                                let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                let columnWidth = customcolumn[i].width;

                                $("" + columHeaderUpdate + "").html(columData);
                                if (columnWidth != 0) {
                                    $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                }

                                if (hiddenColumn == true) {
                                    $("." + columnClass + "").addClass('hiddenColumn');
                                    $("." + columnClass + "").removeClass('showColumn');
                                    $(".chk" + columnClass + "").removeAttr('checked');
                                } else if (hiddenColumn == false) {
                                    $("." + columnClass + "").removeClass('hiddenColumn');
                                    $("." + columnClass + "").addClass('showColumn');
                                    $(".chk" + columnClass + "").attr('checked', 'checked');
                                }

                            }
                        }

                    }
                });
                $('.fullScreenSpin').css('display', 'none');
                if (currentSalesURL) {
                    let currentSalesName = currentSalesURL[0].replace(/%20/g, " ");
                    paymentService.getCreditPaymentByName(currentSalesName).then(function(creditdata) {
                        for (let i = 0; i < creditdata.tcredit.length; i++) {
                            totalCreditAmt += creditdata.tcredit[i].fields.TotalBalance;
                            if (creditdata.tcredit[i].fields.Lines && creditdata.tcredit[i].fields.Lines.length) {
                                //for(let j=0;j< creditdata.tcredit[i].fields.Lines.length;j++){
                                let amountDueCredit = utilityService.modifynegativeCurrencyFormat('-' + creditdata.tcredit[i].fields.TotalBalance).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let paymentAmtCredit = utilityService.modifynegativeCurrencyFormat('-' + creditdata.tcredit[i].fields.TotalBalance).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let outstandingAmtCredit = utilityService.modifynegativeCurrencyFormat('-' + creditdata.tcredit[i].fields.TotalBalance).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let originalAmtCredit = utilityService.modifynegativeCurrencyFormat('-' + creditdata.tcredit[i].fields.TotalAmountInc).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });

                                lineItemObj = {
                                    id: creditdata.tcredit[i].fields.ID || '',
                                    invoiceid: creditdata.tcredit[i].fields.ID || '',
                                    poid: creditdata.tcredit[i].fields.ID || '',
                                    transid: creditdata.tcredit[i].fields.ID || '',
                                    invoicedate: creditdata.tcredit[i].fields.OrderDate != '' ? moment(creditdata.tcredit[i].fields.OrderDate).format("DD/MM/YYYY") : creditdata.tcredit[i].fields.OrderDate,
                                    refno: creditdata.tcredit[i].fields.RefNo || '',
                                    transtype: "Credit" || '',
                                    amountdue: amountDueCredit || 0,
                                    paymentamount: paymentAmtCredit || 0,
                                    ouststandingamount: outstandingAmtCredit,
                                    orginalamount: originalAmtCredit
                                };
                                lineItems.push(lineItemObj);
                                //  }

                            }
                        }

                        totalGrandAmount = parseFloat(totalPaymentAmount) - parseFloat(totalCreditAmt);
                        let record = {
                            lid: '',
                            customerName: data.fields.ClientName || '',
                            paymentDate: begunDate,
                            reference: data.fields.CustPONumber || ' ',
                            bankAccount: Session.get('bankaccount') || '',
                            paymentAmount: utilityService.modifynegativeCurrencyFormat(totalGrandAmount) || 0,
                            notes: data.fields.Comments,
                            LineItems: lineItems,
                            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                            department: Session.get('department') || data.fields.DeptClassName,
                            applied: utilityService.modifynegativeCurrencyFormat(totalGrandAmount) || 0

                        };
                        templateObject.record.set(record);

                        //

                    });

                }

            });
        }

        // if(getsale_custname[1]){
        //   let currentSalesName = currentSalesURL[0].replace(/%20/g, " ");
        //
        //   paymentService.getSupplierPaymentByName(currentSalesName).then(function (data) {
        //   let lineItems = [];
        //   let lineItemObj = {};
        //   let companyName = '';
        //   let referenceNo = '';
        //   let paymentMethodName = '';
        //   let accountName = '';
        //   let notes = '';
        //   let paymentdate = '';
        //   let checkpayment = '';
        //   let department = '';
        //   let appliedAmt = 0;
        //
        //   for(let i=0;i<data.tsupplierpayment.length;i++){
        //       if(data.tsupplierpayment[i].fields.Lines && data.tsupplierpayment[i].fields.Lines.length){
        //         for(let j=0;j< data.tsupplierpayment[i].fields.Lines.length;j++){
        //           if(data.tsupplierpayment[i].fields.Lines[j].fields.TransNo == currentSalesID ){
        //              companyName = data.tsupplierpayment[i].fields.CompanyName;
        //              referenceNo = data.tsupplierpayment[i].fields.ReferenceNo;
        //              paymentMethodName = data.tsupplierpayment[i].fields.PaymentMethodName;
        //              accountName = data.tsupplierpayment[i].fields.AccountName;
        //              notes = data.tsupplierpayment[i].fields.Notes;
        //              paymentdate = data.tsupplierpayment[i].fields.PaymentDate;
        //              checkpayment = data.tsupplierpayment[i].fields.Payment;
        //              department = data.tsupplierpayment[i].fields.DeptClassName;
        //              appliedAmt = utilityService.modifynegativeCurrencyFormat(data.tsupplierpayment[i].fields.Applied).toLocaleString(undefined, {minimumFractionDigits: 2});
        //              templateObject.supppaymentid.set(data.tsupplierpayment[i].fields.ID);
        //
        //             let amountDue = Currency+''+data.tsupplierpayment[i].fields.Lines[j].fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
        //             let paymentAmt = Currency+''+data.tsupplierpayment[i].fields.Lines[j].fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
        //             let outstandingAmt = Currency+''+data.tsupplierpayment[i].fields.Lines[j].fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
        //             let originalAmt = Currency+''+data.tsupplierpayment[i].fields.Lines[j].fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});
        //
        //
        //
        //             lineItemObj = {
        //                 id: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
        //                 invoiceid: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
        //                 poid: data.tsupplierpayment[i].fields.Lines[j].fields.POID || '',
        //                 transid: data.tsupplierpayment[i].fields.Lines[j].fields.ID || '',
        //                 invoicedate: data.tsupplierpayment[i].fields.Lines[j].fields.Date !=''? moment(data.tsupplierpayment[i].fields.Lines[j].fields.Date).format("DD/MM/YYYY"): data.tsupplierpayment[i].fields.Lines[j].fields.Date,
        //                 refno: data.tsupplierpayment[i].fields.Lines[j].fields.RefNo || '',
        //                 transtype: "Bill" || '',
        //                 amountdue: amountDue || 0,
        //                 paymentamount: paymentAmt || 0,
        //                 ouststandingamount:outstandingAmt,
        //                 orginalamount:originalAmt
        //             };
        //             lineItems.push(lineItemObj);
        //           }else{
        //
        //           }
        //
        //       }
        //       }
        //   }
        //   let record = {
        //       lid:'',
        //       customerName: companyName || '',
        //       paymentDate: paymentdate ? moment(paymentdate).format('DD/MM/YYYY') : "",
        //       reference: referenceNo || ' ',
        //       bankAccount: Session.get('bankaccount') || accountName || '',
        //       paymentAmount: appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2})  || 0,
        //       notes: notes || '',
        //       LineItems:lineItems,
        //       checkpayment: Session.get('paymentmethod') ||checkpayment ||'',
        //       department: Session.get('department') || department ||'',
        //       applied:appliedAmt.toLocaleString(undefined, {minimumFractionDigits: 2}) || 0
        //
        //   };
        //
        //   $('#edtSupplierName').val(companyName);
        //   $('#edtBankAccountName').val(record.bankAccount);
        //
        //   templateObject.record.set(record);
        //   if(clientList){
        //     for (var i = 0; i < clientList.length; i++) {
        //       if(clientList[i].customername == companyName){
        //         $('#edtCustomerEmail').val(clientList[i].customeremail);
        //         $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
        //       }
        //     }
        //   }
        //
        //   Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblSupplierPaymentcard', function(error, result){
        //     if(error){
        //
        //   }else{
        //     if(result){
        //       for (let i = 0; i < result.customFields.length; i++) {
        //         let customcolumn = result.customFields;
        //         let columData = customcolumn[i].label;
        //         let columHeaderUpdate = customcolumn[i].thclass;
        //         let hiddenColumn = customcolumn[i].hidden;
        //         let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
        //         let columnWidth = customcolumn[i].width;
        //
        //         $(""+columHeaderUpdate+"").html(columData);
        //         if(columnWidth != 0){
        //           $(""+columHeaderUpdate+"").css('width',columnWidth+'%');
        //         }
        //
        //         if(hiddenColumn == true){
        //           $("."+columnClass+"").addClass('hiddenColumn');
        //           $("."+columnClass+"").removeClass('showColumn');
        //           $(".chk"+columnClass+"").removeAttr('checked');
        //         }else if(hiddenColumn == false){
        //           $("."+columnClass+"").removeClass('hiddenColumn');
        //           $("."+columnClass+"").addClass('showColumn');
        //           $(".chk"+columnClass+"").attr('checked','checked');
        //         }
        //
        //       }
        //     }
        //
        //   }
        //   });
        //       $('.fullScreenSpin').css('display','none');
        //     });
        // }
    } else if ((url.indexOf('?selectsupppo') > 0) && (url.indexOf('&selectsuppbill') > 0) && (url.indexOf('&selectsuppcredit') > 0)) {
        $('.fullScreenSpin').css('display', 'inline-block');
        var getpo_id = url.split('?selectsupppo=');
        var getbill_id = url.split('&selectsuppbill=');
        var getcredit_id = url.split('&selectsuppcredit=');
        let lineItems = [];
        let lineItemObj = {};
        let amountData = 0;
        if (getpo_id[1]) {
            var currentPOID = getpo_id[getpo_id.length - 1];
            var arr = currentPOID.split(',');
            for (let i = 0; i < arr.length; i++) {
                currentPOID = parseInt(arr[i]);
                if (!isNaN(currentPOID)) {
                    paymentService.getOnePurchaseOrderPayment(currentPOID).then(function(data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        var currentDate = new Date();
                        var begunDate = moment(currentDate).format("DD/MM/YYYY");
                        //if (data.fields.Lines.length) {
                        //for (let i = 0; i < data.fields.Lines.length; i++) {
                        let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        amountData = amountData + data.fields.TotalBalance;
                        let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });

                        lineItemObj = {
                            id: data.fields.ID || '',
                            invoiceid: data.fields.ID || '',
                            transid: data.fields.ID || '',
                            poid: data.fields.ID || '',
                            invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
                            refno: data.fields.CustPONumber || '',
                            transtype: 'Purchase Order' || '',
                            amountdue: amountDue || 0,
                            paymentamount: paymentAmt || 0,
                            ouststandingamount: outstandingAmt,
                            orginalamount: originalAmt,
                            comments: data.fields.Comments || ''
                        };
                        lineItems.push(lineItemObj);

                        let record = {
                            lid: '',
                            customerName: data.fields.ClientName || '',
                            paymentDate: begunDate,
                            reference: data.fields.CustPONumber || ' ',
                            bankAccount: Session.get('bankaccount') || '',
                            paymentAmount: utilityService.modifynegativeCurrencyFormat(amountData) || 0,
                            notes: data.fields.Comments,
                            LineItems: lineItems,
                            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                            department: Session.get('department') || data.fields.DeptClassName,
                            applied: utilityService.modifynegativeCurrencyFormat(amountData) || 0

                        };
                        templateObject.record.set(record);

                        let getDepartmentVal = Session.get('department') || data.fields.DeptClassName || defaultDept;
                        let getPaymentMethodVal = '';

                        if (Session.get('paymentmethod')) {
                            getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod;
                        } else {
                            getPaymentMethodVal = data.fields.PayMethod || '';
                        }
                        //$('#edtSupplierName').editableSelect('add', data.fields.ClientName);
                        $('#edtSupplierName').val(data.fields.ClientName);
                        $('#sltDepartment').val(getDepartmentVal);
                        $('#sltPaymentMethod').val(getPaymentMethodVal);
                        //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                        let bankAccountData = Session.get('bankaccount') || 'Bank';
                        $('#edtSelectBankAccountName').val(bankAccountData);
                        templateObject.getLastPaymentData();
                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].customername == data.fields.SupplierName) {
                                    $('#edtSupplierEmail').val(clientList[i].customeremail);
                                    $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                    let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                    $('#txabillingAddress').val(postalAddress);
                                }
                            }
                        }

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                            if (error) {

                                //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                            } else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass;
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                        let columnWidth = customcolumn[i].width;

                                        $("" + columHeaderUpdate + "").html(columData);
                                        if (columnWidth != 0) {
                                            $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                        }

                                        if (hiddenColumn == true) {
                                            $("." + columnClass + "").addClass('hiddenColumn');
                                            $("." + columnClass + "").removeClass('showColumn');
                                            $(".chk" + columnClass + "").removeAttr('checked');
                                        } else if (hiddenColumn == false) {
                                            $("." + columnClass + "").removeClass('hiddenColumn');
                                            $("." + columnClass + "").addClass('showColumn');
                                            $(".chk" + columnClass + "").attr('checked', 'checked');
                                        }

                                    }
                                }

                            }
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }
            }
        }
        if (getbill_id[1]) {
            var currentBillID = getbill_id[getbill_id.length - 1];
            var arrBill = currentBillID.split(',');
            for (let i = 0; i < arrBill.length; i++) {
                currentBillID = parseInt(arrBill[i]);
                if (!isNaN(currentBillID)) {
                    paymentService.getOneBillPayment(currentBillID).then(function(data) {

                        let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        var currentDate = new Date();
                        var begunDate = moment(currentDate).format("DD/MM/YYYY");
                        //if (data.fields.Lines.length) {
                        //for (let i = 0; i < data.fields.Lines.length; i++) {
                        let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        amountData = amountData + data.fields.TotalBalance;
                        let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });

                        lineItemObj = {
                            id: data.fields.ID || '',
                            invoiceid: data.fields.ID || '',
                            transid: data.fields.ID || '',
                            poid: data.fields.ID || '',
                            invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
                            refno: data.fields.CustPONumber || '',
                            transtype: 'Bill' || '',
                            amountdue: amountDue || 0,
                            paymentamount: paymentAmt || 0,
                            ouststandingamount: outstandingAmt,
                            orginalamount: originalAmt,
                            comments: data.fields.Comments || ''
                        };
                        lineItems.push(lineItemObj);

                        let record = {
                            lid: '',
                            customerName: data.fields.ClientName || '',
                            paymentDate: begunDate,
                            reference: data.fields.CustPONumber || ' ',
                            bankAccount: Session.get('bankaccount') || '',
                            paymentAmount: utilityService.modifynegativeCurrencyFormat(amountData) || 0,
                            notes: data.fields.Comments,
                            LineItems: lineItems,
                            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                            department: Session.get('department') || data.fields.DeptClassName,
                            applied: utilityService.modifynegativeCurrencyFormat(amountData) || 0

                        };
                        templateObject.record.set(record);
                        //$('#edtSupplierName').editableSelect('add', data.fields.ClientName);
                        let getDepartmentVal = Session.get('department') || data.fields.DeptClassName || defaultDept;
                        let getPaymentMethodVal = '';

                        if (Session.get('paymentmethod')) {
                            getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod;
                        } else {
                            getPaymentMethodVal = data.fields.PayMethod || '';
                        }
                        $('#sltDepartment').val(getDepartmentVal);
                        $('#edtSupplierName').val(data.fields.ClientName);
                        $('#sltPaymentMethod').val(getPaymentMethodVal);
                        //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                        let bankAccountData = Session.get('bankaccount') || 'Bank';
                        $('#edtSelectBankAccountName').val(bankAccountData);
                        templateObject.getLastPaymentData();
                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].customername == data.fields.SupplierName) {
                                    $('#edtSupplierEmail').val(clientList[i].customeremail);
                                    $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                    let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                    $('#txabillingAddress').val(postalAddress);
                                }
                            }
                        }

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                            if (error) {

                                //Bert.alert('<strong>Error:</strong> user-not-found, no user found please try again!', 'danger');
                            } else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass;
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                        let columnWidth = customcolumn[i].width;

                                        $("" + columHeaderUpdate + "").html(columData);
                                        if (columnWidth != 0) {
                                            $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                        }

                                        if (hiddenColumn == true) {
                                            $("." + columnClass + "").addClass('hiddenColumn');
                                            $("." + columnClass + "").removeClass('showColumn');
                                            $(".chk" + columnClass + "").removeAttr('checked');
                                        } else if (hiddenColumn == false) {
                                            $("." + columnClass + "").removeClass('hiddenColumn');
                                            $("." + columnClass + "").addClass('showColumn');
                                            $(".chk" + columnClass + "").attr('checked', 'checked');
                                        }

                                    }
                                }

                            }
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }
            }
        }
        if (getcredit_id[1]) {
            var currentCreditID = getcredit_id[getcredit_id.length - 1];
            var arrcredit = currentCreditID.split(',');
            for (let i = 0; i < arrcredit.length; i++) {
                currentCreditID = parseInt(arrcredit[i]);
                if (!isNaN(currentCreditID)) {
                    paymentService.getOneCreditPayment(currentCreditID).then(function(data) {

                        let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        var currentDate = new Date();
                        var begunDate = moment(currentDate).format("DD/MM/YYYY");
                        //if (data.fields.Lines.length) {
                        //for (let i = 0; i < data.fields.Lines.length; i++) {
                        let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        amountData = amountData + data.fields.TotalDiscount;
                        let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalDiscount).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });

                        lineItemObj = {
                            id: data.fields.ID || '',
                            invoiceid: data.fields.ID || '',
                            transid: data.fields.ID || '',
                            poid: data.fields.ID || '',
                            invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
                            refno: data.fields.CustPONumber || '',
                            transtype: 'Credit' || '',
                            amountdue: amountDue || 0,
                            paymentamount: paymentAmt || 0,
                            ouststandingamount: outstandingAmt,
                            orginalamount: originalAmt,
                            comments: data.fields.Comments || ''
                        };
                        lineItems.push(lineItemObj);

                        let record = {
                            lid: '',
                            customerName: data.fields.ClientName || '',
                            paymentDate: begunDate,
                            reference: data.fields.CustPONumber || ' ',
                            bankAccount: Session.get('bankaccount') || '',
                            paymentAmount: utilityService.modifynegativeCurrencyFormat(amountData) || 0,
                            notes: data.fields.Comments,
                            LineItems: lineItems,
                            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                            department: Session.get('department') || data.fields.DeptClassName,
                            applied: utilityService.modifynegativeCurrencyFormat(amountData) || 0

                        };
                        templateObject.record.set(record);
                        //$('#edtSupplierName').editableSelect('add', data.fields.ClientName);
                        let getDepartmentVal = Session.get('department') || data.fields.DeptClassName || defaultDept;
                        let getPaymentMethodVal = '';

                        if (Session.get('paymentmethod')) {
                            getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod;
                        } else {
                            getPaymentMethodVal = data.fields.PayMethod || '';
                        }
                        $('#sltDepartment').val(getDepartmentVal);
                        $('#edtSupplierName').val(data.fields.ClientName);
                        $('#sltPaymentMethod').val(getPaymentMethodVal);
                        //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                        let bankAccountData = Session.get('bankaccount') || 'Bank';
                        $('#edtSelectBankAccountName').val(bankAccountData);
                        templateObject.getLastPaymentData();
                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].customername == data.fields.SupplierName) {
                                    $('#edtSupplierEmail').val(clientList[i].customeremail);
                                    $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                    let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                    $('#txabillingAddress').val(postalAddress);
                                }
                            }
                        }

                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                            if (error) {} else {
                                if (result) {
                                    for (let i = 0; i < result.customFields.length; i++) {
                                        let customcolumn = result.customFields;
                                        let columData = customcolumn[i].label;
                                        let columHeaderUpdate = customcolumn[i].thclass;
                                        let hiddenColumn = customcolumn[i].hidden;
                                        let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                        let columnWidth = customcolumn[i].width;

                                        $("" + columHeaderUpdate + "").html(columData);
                                        if (columnWidth != 0) {
                                            $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                        }

                                        if (hiddenColumn == true) {
                                            $("." + columnClass + "").addClass('hiddenColumn');
                                            $("." + columnClass + "").removeClass('showColumn');
                                            $(".chk" + columnClass + "").removeAttr('checked');
                                        } else if (hiddenColumn == false) {
                                            $("." + columnClass + "").removeClass('hiddenColumn');
                                            $("." + columnClass + "").addClass('showColumn');
                                            $(".chk" + columnClass + "").attr('checked', 'checked');
                                        }

                                    }
                                }

                            }
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }
            }
        }
    } else if (url.indexOf('?selectsuppb=') > 0) {
        var getpo_id = url.split('?selectsuppb=');
        var currentPOID = getpo_id[getpo_id.length - 1];
        if (getpo_id[1]) {
            let lineItems = [];
            let lineItemObj = {};
            let amountData = 0;
            var arr = currentPOID.split(',');
            for (let i = 0; i < arr.length; i++) {
                currentPOID = parseInt(arr[i]);
                paymentService.getOneBillPayment(currentPOID).then(function(data) {

                    let total = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    var currentDate = new Date();
                    var begunDate = moment(currentDate).format("DD/MM/YYYY");
                    //if (data.fields.Lines.length) {
                    //for (let i = 0; i < data.fields.Lines.length; i++) {
                    let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    amountData = amountData + data.fields.TotalBalance;
                    lineItemObj = {
                        id: data.fields.ID || '',
                        invoiceid: data.fields.ID || '',
                        transid: data.fields.ID || '',
                        poid: data.fields.ID || '',
                        invoicedate: data.fields.OrderDate != '' ? moment(data.fields.OrderDate).format("DD/MM/YYYY") : data.fields.OrderDate,
                        refno: data.fields.CustPONumber || '',
                        transtype: 'Bill' || '',
                        amountdue: amountDue || 0,
                        paymentamount: paymentAmt || 0,
                        ouststandingamount: outstandingAmt,
                        orginalamount: originalAmt,
                        comments: data.fields.Comments || ''
                    };
                    lineItems.push(lineItemObj);

                    let record = {
                        lid: '',
                        customerName: data.fields.ClientName || '',
                        paymentDate: begunDate,
                        reference: data.fields.CustPONumber || ' ',
                        bankAccount: Session.get('bankaccount') || '',
                        paymentAmount: utilityService.modifynegativeCurrencyFormat(amountData) || 0,
                        notes: data.fields.Comments,
                        LineItems: lineItems,
                        checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                        department: Session.get('department') || data.fields.DeptClassName,
                        applied: utilityService.modifynegativeCurrencyFormat(amountData) || 0

                    };
                    templateObject.record.set(record);
                    //$('#edtSupplierName').editableSelect('add', data.fields.ClientName);
                    let getDepartmentVal = Session.get('department') || data.fields.DeptClassName || defaultDept;
                    let getPaymentMethodVal = '';

                    if (Session.get('paymentmethod')) {
                        getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod;
                    } else {
                        getPaymentMethodVal = data.fields.PayMethod || '';
                    }
                    $('#sltDepartment').val(getDepartmentVal);
                    $('#edtSupplierName').val(data.fields.ClientName);
                    $('#sltPaymentMethod').val(getPaymentMethodVal);
                    //$('#edtBankAccountName').editableSelect('add',record.bankAccount);
                    let bankAccountData = Session.get('bankaccount') || 'Bank';
                    $('#edtSelectBankAccountName').val(bankAccountData);
                    templateObject.getLastPaymentData();
                    if (clientList) {
                        for (var i = 0; i < clientList.length; i++) {
                            if (clientList[i].customername == data.fields.SupplierName) {
                                $('#edtSupplierEmail').val(clientList[i].customeremail);
                                $('#edtSupplierEmail').attr('customerid', clientList[i].customerid);
                                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                $('#txabillingAddress').val(postalAddress);
                            }
                        }
                    }

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblSupplierPaymentcard', function(error, result) {
                        if (error) {} else {
                            if (result) {
                                for (let i = 0; i < result.customFields.length; i++) {
                                    let customcolumn = result.customFields;
                                    let columData = customcolumn[i].label;
                                    let columHeaderUpdate = customcolumn[i].thclass;
                                    let hiddenColumn = customcolumn[i].hidden;
                                    let columnClass = columHeaderUpdate.substring(columHeaderUpdate.indexOf(".") + 1);
                                    let columnWidth = customcolumn[i].width;

                                    $("" + columHeaderUpdate + "").html(columData);
                                    if (columnWidth != 0) {
                                        $("" + columHeaderUpdate + "").css('width', columnWidth + '%');
                                    }

                                    if (hiddenColumn == true) {
                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                        $(".chk" + columnClass + "").removeAttr('checked');
                                    } else if (hiddenColumn == false) {
                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                        $("." + columnClass + "").addClass('showColumn');
                                        $(".chk" + columnClass + "").attr('checked', 'checked');
                                    }

                                }
                            }

                        }
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });
            }
        }
    }else{
         $('.fullScreenSpin').css('display', 'none');
         let lineItems = [];
         let lineItemsTable = [];
         let lineItemObj = {};
         lineItemObj = {
             id: Random.id(),
             lineID: Random.id(),
             item: '',
             accountname: '',
             memo: '',
             description: '',
             quantity: '',
             unitPrice: 0,
             unitPriceInc: 0,
             taxRate: 0,
             taxCode: '',
             TotalAmt: 0,
             curTotalAmt: 0,
             TaxTotal: 0,
             TaxRate: 0,

         };

         var dataListTable = [
             ' ' || '',
             ' ' || '',
             0 || 0,
             0.00 || 0.00,
             ' ' || '',
             0.00 || 0.00,
             '<span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 btnRemove"><i class="fa fa-remove"></i></button></span>'
         ];
         // lineItemsTable.push(dataListTable);
         // lineItems.push(lineItemObj);
         var currentDate = new Date();
         var begunDate = moment(currentDate).format("DD/MM/YYYY");

         let paymentrecord = {
             id: '',
             lid: '',
             bankAccount: Session.get('bankaccount') ||'Bank',
             checkpayment: Session.get('paymentmethod') || '',
             department: Session.get('department') || '',
             accountname: '',
             memo: '',
             sosupplier: '',
             billto: '',
             shipto: '',
             shipping: '',
             docnumber: '',
             custPONumber: '',
             paymentDate: begunDate,
             duedate: '',
             employeename: '',
             status: '',
             invoicenumber: '',
             category: '',
             comments: '',
             pickmemo: '',
             ponumber: '',
             via: '',
             connote: '',
             reference: '',
             currency: '',
             branding: '',
             invoiceToDesc: '',
             shipToDesc: '',
             termsName: '',
             Total: Currency + '' + 0.00,
             LineItems: lineItems,
             isReconciled:false,
             TotalTax: Currency + '' + 0.00,
             SubTotal: Currency + '' + 0.00,
             applied: Currency + '' + 0.00,
             balanceDue: Currency + '' + 0.00,
             saleCustField1: '',
             saleCustField2: '',
             totalPaid: Currency + '' + 0.00,
             ispaid: false
         };

         $('#edtSupplierName').val('');
         $('#edtSupplierName').attr('readonly', false);
         $('#edtSupplierName').css('background-color', 'rgb(255, 255, 255)');

         $('#edtSelectBankAccountName').removeAttr('disabled');
         $('#edtSelectBankAccountName').attr('readonly', false);
         $('#edtSelectBankAccountName').attr('readonly', false);
         setTimeout(function(){
             if(localStorage.getItem('check_acc')){
               $('#sltBankAccountName').val(localStorage.getItem('check_acc'));
             }else{
               // $('#sltBankAccountName').val('Bank');
             }

             // setTimeout(function () {
             //     $('#edtSupplierName').trigger("click");
             // }, 500);
         },500);

         // $("#form :input").prop("disabled", false);
         templateObject.record.set(paymentrecord);
         let getDepartmentVal = Session.get('department') || defaultDept;
          let getPaymentMethodVal = '';

          if (Session.get('paymentmethod')) {
              getPaymentMethodVal = Session.get('paymentmethod') || '';
          }

          let bankAccountData = Session.get('bankaccount') || 'Bank';
          $('#edtSelectBankAccountName').val(bankAccountData);
          templateObject.getLastPaymentData();

          $('#sltDepartment').val(getDepartmentVal);
          $('#sltPaymentMethod').val(getPaymentMethodVal);
    }

    exportSalesToPdf = function() {
        let margins = {
            top: 0,
            bottom: 0,
            left: 0,
            width: 100
        };
        let id = $('.printID').attr("id");
        var pdf = new jsPDF('p', 'pt', 'a4');

        pdf.setFontSize(18);
        var source = document.getElementById('html-2-pdfwrapper');
        pdf.addHTML(source, function() {
            pdf.save('Supplier Payment-' + id + '.pdf');
            $('#html-2-pdfwrapper').css('display', 'none');
        });
    };

    $('#tblSupplierPaymentcard tbody').on('click', 'tr .colType', function() {
        var listData = $(this).closest('tr').attr('id');
        var columnType = $(event.target).text();
        if (listData) {
            if (columnType == "Purchase Order") {
                window.open('/purchaseordercard?id=' + listData, '_self');
            } else if (columnType == "Bill") {
                window.open('/billcard?id=' + listData, '_self');
            } else if (columnType == "Credit") {
                window.open('/creditcard?id=' + listData, '_self');
            }

        }
    });

    $(document).ready(function() {
        $('#edtSelectBankAccountName').editableSelect();
        $('#sltDepartment').editableSelect();
        $('#sltPaymentMethod').editableSelect();

        $('#addRow').on('click', function() {
          let custname = $('#edtSupplierName').val();
          if (custname === '') {
              swal('Supplier has not been selected!', '', 'warning');
              e.preventDefault();
        } else {
            $(".chkBox").prop("checked", false);
            let paymentList = [''];
            $('.tblSupplierPaymentcard tbody tr').each(function() {
                paymentList.push(this.id);

            });

            setTimeout(function() {
              $('.fullScreenSpin').css('display', 'inline-block');
                templateObject.getAllSupplierPaymentData(custname);
            }, 500);
            let geturl = location.href;
            let id = "";
            if (geturl.indexOf('?selectsupppo') > 0 && geturl.indexOf('&selectsuppbill') > 0 && geturl.indexOf('&selectsuppcredit') > 0) {
                geturl = new URL(geturl);
                let selectsupppo = geturl.searchParams.get("selectsupppo") || '';
                let selectsuppbill = geturl.searchParams.get("selectsuppbill") || '';
                let selectsuppcredit = geturl.searchParams.get("selectsuppcredit") || '';
                id = selectsupppo + ',' + selectsuppbill + ',' + selectsuppcredit;
            } else if (geturl.indexOf('?billid') > 0) {
                geturl = new URL(geturl);
            } else if (geturl.indexOf('?poid') > 0) {
                geturl = new URL(geturl);
                id = geturl.searchParams.get("poid");
            } else if (geturl.indexOf('?creditid') > 0) {
                geturl = new URL(geturl);
                id = geturl.searchParams.get("creditid");
            }
            let $tblrows = $("#tblSupplierPaymentcard tbody tr");
            $('.fullScreenSpin').css('display', 'inline-block');
            let paymentData = templateObject.datatablerecords1.get();
            let paymentDataList = [];
            if(jQuery.isEmptyObject( FlowRouter.current().queryParams) == true){
            for (let x = 0; x < paymentData.length; x++) {
                let found = paymentList.some(emp => emp == paymentData[x].id);
                if (custname == paymentData[x].customername && found == false) {
                    paymentDataList.push(paymentData[x]);
                }
            }
          }else{
            for (let x = 0; x < paymentData.length; x++) {
                let found = paymentList.some(emp => emp == paymentData[x].id);
                if (custname == paymentData[x].customername && id.includes(paymentData[x].id) == false && found == false) {
                    paymentDataList.push(paymentData[x]);
                }
            }
          }
            $('.dataTables_info').hide();
            templateObject.datatablerecords.set(paymentDataList);
            $('#supplierPaymentListModal').modal();
          }
            $('.fullScreenSpin').css('display', 'none');
        })
        // var rowData = $('#tblPaymentcard tbody>tr:last').clone(true);
        // let tokenid = Random.id();
        // $(".colTransDate", rowData).text("");
        // $(".colType", rowData).text("");
        // $(".colTransNo", rowData).text("");
        // $(".lineOrginalamount", rowData).text("");
        // $(".lineAmountdue", rowData).text("");
        // $(".linePaymentamount", rowData).val("");
        // $(".lineOutstandingAmount", rowData).text("");
        // $(".colComments", rowData).text("");
        // rowData.attr('id', tokenid);
        // rowData.attr('name', tokenid);
        // $("#tblPaymentcard tbody").append(rowData);
    });

});

Template.supplierpaymentcard.helpers({
    record: () => {
        return Template.instance().record.get();
    },
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function(a, b) {
            if (a.paymentdate == 'NA') {
                return 1;
            } else if (b.paymentdate == 'NA') {
                return -1;
            }
            return (a.paymentdate.toUpperCase() > b.paymentdate.toUpperCase()) ? 1 : -1;
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
    paymentmethodrecords: () => {
        return Template.instance().paymentmethodrecords.get().sort(function(a, b) {
            if (a.paymentmethod == 'NA') {
                return 1;
            } else if (b.paymentmethod == 'NA') {
                return -1;
            }
            return (a.paymentmethod.toUpperCase() > b.paymentmethod.toUpperCase()) ? 1 : -1;
        });
    },
    accountnamerecords: () => {
        return Template.instance().accountnamerecords.get().sort(function(a, b) {
            if (a.accountname == 'NA') {
                return 1;
            } else if (b.accountname == 'NA') {
                return -1;
            }
            return (a.accountname.toUpperCase() > b.accountname.toUpperCase()) ? 1 : -1;
        });
    },
    currentDate: () => {
        var today = moment().format('DD/MM/YYYY');
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        return begunDate;
    },
    salesCloudGridPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'tblSupplierPaymentcard'
        });
    },
    companyaddress1: () => {
        return Session.get('vs1companyaddress1');
    },
    companyaddress2: () => {
        return Session.get('vs1companyaddress2');
    },
    city: () => {
        return Session.get('vs1companyCity');
    },
    state: () => {
        return Session.get('companyState');
    },
    poBox: () => {
        return Session.get('vs1companyPOBox');
    },
    companyphone: () => {
        return Session.get('vs1companyPhone');
    },
    companyabn: () => {
        return Session.get('vs1companyABN');
    },
    organizationname: () => {
        return Session.get('vs1companyName');
    },
    organizationurl: () => {
        return Session.get('vs1companyURL');
    }
});

Template.supplierpaymentcard.events({
    // 'click #sltDepartment': function(event) {
    //     $('#departmentModal').modal('toggle');
    // },
    'click .btnSave': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let paymentService = new PaymentsService();
        let customer = $("#edtSupplierName").val();
        let paymentAmt = $("#edtPaymentAmount").val();
        var paymentDateTime = new Date($("#dtPaymentDate").datepicker("getDate"));
        let paymentDate = paymentDateTime.getFullYear() + "-" + (paymentDateTime.getMonth() + 1) + "-" + paymentDateTime.getDate();

        let bankAccount = $("#edtSelectBankAccountName").val() || "Bank";
        let reference = $("#edtReference").val();
        let payMethod = $("#sltPaymentMethod").val();
        let notes = $("#txaNotes").val();
        let customerEmail = $("#edtSupplierEmail").val();
        if (payMethod == '') {
            payMethod = "Cash";
        }
        let department = $("#sltDepartment").val();
        let empName = localStorage.getItem('mySession');
        let paymentData = [];
        Session.setPersistent('paymentmethod', payMethod);
        Session.setPersistent('bankaccount', bankAccount);
        Session.setPersistent('department', department);
        var currentBeginDate = new Date();
        var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if ((currentBeginDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentBeginDate.getMonth());
        } else {
            fromDateMonth = (currentBeginDate.getMonth());
        }

        if (currentBeginDate.getDate() < 10) {
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        var toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");

        var url = FlowRouter.current().path;
        let newURL = '/paymentoverview?success=true';
        if ((url.indexOf('?id=') > 0)) {
            var getsale_id = url.split('?id=');
            var currentSalesID = getsale_id[getsale_id.length - 1];
            let paymentID = parseInt(currentSalesID);;
            // currentSalesID = parseInt(currentSalesID);
            $('.tblSupplierPaymentcard > tbody > tr').each(function() {
                var lineID = this.id;
                let linetype = $('#' + lineID + " .colType").text() || $(this).closest('tr').find('.colType').text();
                let lineAmountDue = $('#' + lineID + " .lineAmountdue").text() || $(this).closest('tr').find('.lineAmountdue').text();
                let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val() || $(this).closest('tr').find('.linePaymentamount').val();
                let Line = {
                    type: 'TGuiSuppPaymentLines',
                    fields: {
                        TransType: linetype,
                        TransID: parseInt(lineID),
                        Paid: true,
                        Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                        //ForeignPayment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                    }
                };
                if (parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0) {
                    paymentData.push(Line);
                }

            });
            let objDetails = {
                type: "TSuppPayments",
                fields: {
                    ID: paymentID,
                    Deleted: false,
                    Notes: notes,
                    ReferenceNo: reference
                }
            }
            paymentService.saveSuppDepositData(objDetails).then(function(data) {
                var customerID = $('#edtSupplierEmail').attr('customerid');
                // Start End Send Email
                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtSupplierEmail').val());
                $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
                async function addAttachment() {
                    let attachment = [];
                    let templateObject = Template.instance();

                    let invoiceId = objDetails.fields.ID;
                    let encodedPdf = await generatePdfForMail(invoiceId);
                    let pdfObject = "";
                    var reader = new FileReader();
                    reader.readAsDataURL(encodedPdf);
                    reader.onloadend = function() {
                        var base64data = reader.result;
                        base64data = base64data.split(',')[1];

                        pdfObject = {
                            filename: 'Supplier Payment ' + invoiceId + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);

                        let erpInvoiceId = objDetails.fields.ID;

                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                        let customerEmailName = $('#edtSupplierName').val();
                        let checkEmailData = $('#edtSupplierEmail').val();
                        // let mailCC = templateObject.mailCopyToUsr.get();
                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
                            "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
                            "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

                        var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
                            '    <tr>' +
                            '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
                            '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td style="padding: 40px 30px 40px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
                            '                        Hello there <span>' + customerEmailName + '</span>,' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
                            '                        Kind regards,' +
                            '                        <br>' +
                            '                        ' + mailFromName + '' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
                            '                        If you have any question, please do not hesitate to contact us.' +
                            '                    </td>' +
                            '                    <td align="right">' +
                            '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '</table>';

                        if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //Router.go('/paymentoverview?success=true');

                                } else {}
                            });

                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //Router.go('/paymentoverview?success=true');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //Router.go('/paymentoverview?success=true');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailCopy').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //Router.go('/paymentoverview?success=true');

                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //Router.go('/paymentoverview?success=true');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //Router.go('/paymentoverview?success=true');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To User: " + mailFrom + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //Router.go('/paymentoverview?success=true');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                            //Router.go('/paymentoverview?success=true');
                        };
                    };
                }
                addAttachment();

                function generatePdfForMail(invoiceId) {
                    return new Promise((resolve, reject) => {
                        let templateObject = Template.instance();
                        // let data = templateObject.singleInvoiceData.get();
                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        doc.setFontSize(18);
                        var source = document.getElementById('html-2-pdfwrapper');
                        doc.addHTML(source, function() {
                            //pdf.save('Invoice.pdf');
                            resolve(doc.output('blob'));
                            // $('#html-2-pdfwrapper').css('display','none');
                        });
                    });
                }
                // End Send Email
                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TSupplier",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }
                    // paymentService.saveSupplierEmail(customerEmailData).then(function (customerEmailData) {
                    //
                    // });
                };
                // $('.fullScreenSpin').css('display','none');
                // window.open('/supplierpayment','_self');
                sideBarService.getTSupplierPaymentList().then(function(dataUpdate) {
                    addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function(datareturn) {
                        window.open('/supplierpayment', '_self');
                    }).catch(function(err) {
                        window.open('/supplierpayment', '_self');
                    });
                }).catch(function(err) {
                    window.open('/supplierpayment', '_self');
                });
                //window.history.go(-2);
            }).catch(function(err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                //window.open('/supplierpayment','_self');
                //window.history.go(-2);
                //Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
            });
        } else if ((url.indexOf('?poid=') > 0)) {
            var getsale_id = url.split('?poid=');
            var currentSalesID = getsale_id[getsale_id.length - 1];
            let paymentID = parseInt(currentSalesID);;

            $('.tblSupplierPaymentcard > tbody > tr').each(function() {
                var lineID = this.id;
                let linetype = $('#' + lineID + " .colType").text() || $(this).closest('tr').find('.colType').text();
                let lineAmountDue = $('#' + lineID + " .lineAmountdue").text() || $(this).closest('tr').find('.lineAmountdue').text();
                let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val() || $(this).closest('tr').find('.linePaymentamount').val();
                let Line = {
                    type: 'TGuiSuppPaymentLines',
                    fields: {
                        TransType: linetype,
                        TransID: parseInt(lineID),
                        Paid: true,
                        Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                        //ForeignPayment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                    }
                };
                if (parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0) {
                    paymentData.push(Line);
                }
            });
            let objDetails = '';
            if (paymentData.length === 0) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Ooops...',
                    text: 'There is no amount due for payment. A payment amount cannot be applied',
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });

                return false;
            } else {
                objDetails = {
                    type: "TSuppPayments",
                    fields: {
                        ID: 0,
                        // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                        // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                        Deleted: false,

                        ClientPrintName: customer,
                        CompanyName: customer,
                        DeptClassName: department,
                        //ForeignExchangeCode: CountryAbbr,
                        //ForeignExchangeRate: 1,
                        // EmployeeName: empName || ' ',
                        GUILines: paymentData,
                        Notes: notes,
                        Payment: true,
                        PaymentDate: paymentDate,
                        PayMethodName: payMethod,

                        ReferenceNo: reference,
                        AccountName: bankAccount
                    }
                };
            }

            paymentService.saveSuppDepositData(objDetails).then(function(data) {
                var customerID = $('#edtSupplierEmail').attr('customerid');
                // Start End Send Email
                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtSupplierEmail').val());
                $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
                async function addAttachment() {
                    let attachment = [];
                    let templateObject = Template.instance();

                    let invoiceId = objDetails.fields.ID;
                    let encodedPdf = await generatePdfForMail(invoiceId);
                    let pdfObject = "";
                    var reader = new FileReader();
                    reader.readAsDataURL(encodedPdf);
                    reader.onloadend = function() {
                        var base64data = reader.result;
                        base64data = base64data.split(',')[1];

                        pdfObject = {
                            filename: 'supplierpayment-' + invoiceId + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);

                        let erpInvoiceId = objDetails.fields.ID;

                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                        let customerEmailName = $('#edtSupplierName').val();
                        let checkEmailData = $('#edtSupplierEmail').val();
                        // let mailCC = templateObject.mailCopyToUsr.get();
                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
                            "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
                            "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

                        var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
                            '    <tr>' +
                            '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
                            '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td style="padding: 40px 30px 40px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
                            '                        Hello there <span>' + customerEmailName + '</span>,' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
                            '                        Kind regards,' +
                            '                        <br>' +
                            '                        ' + mailFromName + '' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
                            '                        If you have any question, please do not hesitate to contact us.' +
                            '                    </td>' +
                            '                    <td align="right">' +
                            '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '</table>';

                        if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');

                                } else {}
                            });

                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailCopy').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');

                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //  window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To User: " + mailFrom + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                            //window.open('/supplierawaitingpurchaseorder', '_self');
                        };
                    };
                }
                addAttachment();

                function generatePdfForMail(invoiceId) {
                    return new Promise((resolve, reject) => {
                        let templateObject = Template.instance();
                        // let data = templateObject.singleInvoiceData.get();
                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        doc.setFontSize(18);
                        var source = document.getElementById('html-2-pdfwrapper');
                        doc.addHTML(source, function() {
                            //pdf.save('Invoice.pdf');
                            resolve(doc.output('blob'));
                            // $('#html-2-pdfwrapper').css('display','none');
                        });
                    });
                }
                // End Send Email
                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TSupplier",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }
                    // paymentService.saveSupplierEmail(customerEmailData).then(function (customerEmailData) {
                    //
                    // });
                };
                // $('.fullScreenSpin').css('display','none');
                // window.open('/supplierawaitingpurchaseorder','_self');
                sideBarService.getAllPurchaseOrderList().then(function(dataUpdate) {
                    addVS1Data('TPurchaseOrderEx', JSON.stringify(dataUpdate)).then(function(datareturn) {}).catch(function(err) {});
                }).catch(function(err) {});

                sideBarService.getTSupplierPaymentList().then(function(dataUpdate) {
                    addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function(datareturn) {}).catch(function(err) {});
                }).catch(function(err) {});

                sideBarService.getAllAwaitingSupplierPayment(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(dataUpdate) {
                    addVS1Data('TAwaitingSupplierPayment', JSON.stringify(dataUpdate)).then(function(datareturn) {
                        window.open('/purchaseorderlist?success=true', '_self');
                    }).catch(function(err) {
                        window.open('/purchaseorderlist?success=true', '_self');
                    });
                }).catch(function(err) {
                    window.open('/purchaseorderlist?success=true', '_self');
                });

            }).catch(function(err) {
                //window.open('/paymentoverview','_self');
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        } else if ((url.indexOf('?billid=') > 0)) {
            var getsale_id = url.split('?billid=');
            var currentSalesID = getsale_id[getsale_id.length - 1];
            let paymentID = parseInt(currentSalesID);;

            $('.tblSupplierPaymentcard > tbody > tr').each(function() {
                var lineID = this.id;
                let linetype = $('#' + lineID + " .colType").text() || $(this).closest('tr').find('.colType').text();
                let lineAmountDue = $('#' + lineID + " .lineAmountdue").text() || $(this).closest('tr').find('.lineAmountdue').text();
                let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val() || $(this).closest('tr').find('.linePaymentamount').val();
                let Line = {
                    type: 'TGuiSuppPaymentLines',
                    fields: {
                        TransType: linetype,
                        TransID: parseInt(lineID),
                        Paid: true,
                        Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                        //ForeignPayment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                    }
                };
                if (parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0) {
                    paymentData.push(Line);
                }
            });

            let objDetails = '';
            if (paymentData.length === 0) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Ooops...',
                    text: 'There is no amount due for payment. A payment amount cannot be applied',
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });

                return false;
            } else {
                objDetails = {
                    type: "TSuppPayments",
                    fields: {
                        // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                        // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                        ID: 0,
                        Deleted: false,

                        ClientPrintName: customer,
                        CompanyName: customer,
                        DeptClassName: department,
                        // EmployeeName: empName || ' ',
                        GUILines: paymentData,
                        Notes: notes,
                        Payment: true,
                        PaymentDate: paymentDate,
                        PayMethodName: payMethod,

                        ReferenceNo: reference,
                        AccountName: bankAccount
                    }
                };
            }

            paymentService.saveSuppDepositData(objDetails).then(function(data) {
                var customerID = $('#edtSupplierEmail').attr('customerid');
                // Start End Send Email
                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtSupplierEmail').val());
                $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
                async function addAttachment() {
                    let attachment = [];
                    let templateObject = Template.instance();

                    let invoiceId = objDetails.fields.ID;
                    let encodedPdf = await generatePdfForMail(invoiceId);
                    let pdfObject = "";
                    var reader = new FileReader();
                    reader.readAsDataURL(encodedPdf);
                    reader.onloadend = function() {
                        var base64data = reader.result;
                        base64data = base64data.split(',')[1];

                        pdfObject = {
                            filename: 'supplierpayment-' + invoiceId + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);

                        let erpInvoiceId = objDetails.fields.ID;

                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                        let customerEmailName = $('#edtSupplierName').val();
                        let checkEmailData = $('#edtSupplierEmail').val();
                        // let mailCC = templateObject.mailCopyToUsr.get();
                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
                            "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
                            "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

                        var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
                            '    <tr>' +
                            '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
                            '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td style="padding: 40px 30px 40px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
                            '                        Hello there <span>' + customerEmailName + '</span>,' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
                            '                        Kind regards,' +
                            '                        <br>' +
                            '                        ' + mailFromName + '' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
                            '                        If you have any question, please do not hesitate to contact us.' +
                            '                    </td>' +
                            '                    <td align="right">' +
                            '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '</table>';

                        if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');

                                } else {}
                            });

                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailCopy').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');

                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To User: " + mailFrom + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                            //window.open('/supplierawaitingpurchaseorder', '_self');
                        };
                    };
                }
                addAttachment();

                function generatePdfForMail(invoiceId) {
                    return new Promise((resolve, reject) => {
                        let templateObject = Template.instance();
                        // let data = templateObject.singleInvoiceData.get();
                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        doc.setFontSize(18);
                        var source = document.getElementById('html-2-pdfwrapper');
                        doc.addHTML(source, function() {
                            //pdf.save('Invoice.pdf');
                            resolve(doc.output('blob'));
                            // $('#html-2-pdfwrapper').css('display','none');
                        });
                    });
                }
                // End Send Email
                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TSupplier",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }
                    // paymentService.saveSupplierEmail(customerEmailData).then(function (customerEmailData) {
                    //
                    // });
                };
                // $('.fullScreenSpin').css('display','none');
                // window.open('/supplierawaitingpurchaseorder','_self');
                sideBarService.getAllBillExList(initialDataLoad,0).then(function(dataUpdate) {
                    addVS1Data('TBillEx', JSON.stringify(dataUpdate)).then(function(datareturn) {}).catch(function(err) {});
                }).catch(function(err) {});

                sideBarService.getTSupplierPaymentList(initialDataLoad,0).then(function(dataUpdate) {
                    addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function(datareturn) {}).catch(function(err) {});
                }).catch(function(err) {});

                sideBarService.getAllAwaitingSupplierPayment(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(dataUpdate) {
                    addVS1Data('TAwaitingSupplierPayment', JSON.stringify(dataUpdate)).then(function(datareturn) {
                      window.open('/billlist?success=true', '_self');
                    }).catch(function(err) {
                        window.open('/billlist?success=true', '_self');
                    });
                }).catch(function(err) {
                    window.open('/billlist?success=true', '_self');
                });

                //window.history.go(-2);
            }).catch(function(err) {
                //window.open('/supplierawaitingpurchaseorder','_self');
                //window.history.go(-2);
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        } else if ((url.indexOf('?creditid=') > 0)) {
            var getsale_id = url.split('?creditid=');
            var currentSalesID = getsale_id[getsale_id.length - 1];
            let paymentID = parseInt(currentSalesID);;

            $('.tblSupplierPaymentcard > tbody > tr').each(function() {
                var lineID = this.id;
                let linetype = $('#' + lineID + " .colType").text() || $(this).closest('tr').find('.colType').text();
                let lineAmountDue = $('#' + lineID + " .lineAmountdue").text() || $(this).closest('tr').find('.lineAmountdue').text();
                let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val() || $(this).closest('tr').find('.linePaymentamount').val();
                let Line = {
                    type: 'TGuiSuppPaymentLines',
                    fields: {
                        TransType: linetype,
                        TransID: parseInt(lineID),
                        Paid: true,
                        Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                    }
                };
                if (parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0) {
                    paymentData.push(Line);
                }
            });

            let objDetails = '';
            if (paymentData.length === 0) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Ooops...',
                    text: 'There is no amount due for payment. A payment amount cannot be applied',
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });

                return false;
            } else {
                objDetails = {
                    type: "TSuppPayments",
                    fields: {
                        ID: 0,
                        Deleted: false,
                        ClientPrintName: customer,
                        CompanyName: customer,
                        DeptClassName: department,
                        GUILines: paymentData,
                        Notes: notes,
                        Payment: true,
                        PayMethodName: payMethod,
                        ReferenceNo: reference,
                        AccountName: bankAccount
                    }
                };
            }

            paymentService.saveSuppDepositData(objDetails).then(function(data) {
                var customerID = $('#edtSupplierEmail').attr('customerid');
                // Start End Send Email
                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtSupplierEmail').val());
                $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
                async function addAttachment() {
                    let attachment = [];
                    let templateObject = Template.instance();

                    let invoiceId = objDetails.fields.ID;
                    let encodedPdf = await generatePdfForMail(invoiceId);
                    let pdfObject = "";
                    var reader = new FileReader();
                    reader.readAsDataURL(encodedPdf);
                    reader.onloadend = function() {
                        var base64data = reader.result;
                        base64data = base64data.split(',')[1];

                        pdfObject = {
                            filename: 'supplierpayment-' + invoiceId + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);

                        let erpInvoiceId = objDetails.fields.ID;

                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                        let customerEmailName = $('#edtSupplierName').val();
                        let checkEmailData = $('#edtSupplierEmail').val();
                        // let mailCC = templateObject.mailCopyToUsr.get();
                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's bill " + erpInvoiceId + " for  " + grandtotal + "." +
                            "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
                            "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

                        var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
                            '    <tr>' +
                            '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
                            '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td style="padding: 40px 30px 40px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
                            '                        Hello there <span>' + customerEmailName + '</span>,' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
                            '                        Kind regards,' +
                            '                        <br>' +
                            '                        ' + mailFromName + '' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
                            '                        If you have any question, please do not hesitate to contact us.' +
                            '                    </td>' +
                            '                    <td align="right">' +
                            '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '</table>';

                        if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');

                                } else {}
                            });

                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailCopy').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');

                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To User: " + mailFrom + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                            //window.open('/supplierawaitingpurchaseorder', '_self');
                        };
                    };
                }
                addAttachment();

                function generatePdfForMail(invoiceId) {
                    return new Promise((resolve, reject) => {
                        let templateObject = Template.instance();
                        // let data = templateObject.singleInvoiceData.get();
                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        doc.setFontSize(18);
                        var source = document.getElementById('html-2-pdfwrapper');
                        doc.addHTML(source, function() {
                            //pdf.save('Invoice.pdf');
                            resolve(doc.output('blob'));
                            // $('#html-2-pdfwrapper').css('display','none');
                        });
                    });
                }
                // End Send Email
                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TSupplier",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }
                    // paymentService.saveSupplierEmail(customerEmailData).then(function (customerEmailData) {
                    //
                    // });
                };
                // $('.fullScreenSpin').css('display','none');
                // window.open('/supplierawaitingpurchaseorder','_self');
                sideBarService.getAllCreditList().then(function(dataUpdate) {
                    addVS1Data('TCredit', JSON.stringify(dataUpdate)).then(function(datareturn) {}).catch(function(err) {});
                }).catch(function(err) {});

                sideBarService.getTSupplierPaymentList().then(function(dataUpdate) {
                    addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function(datareturn) {}).catch(function(err) {});
                }).catch(function(err) {});

                sideBarService.getAllAwaitingSupplierPayment(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(dataUpdate) {
                    addVS1Data('TAwaitingSupplierPayment', JSON.stringify(dataUpdate)).then(function(datareturn) {
                        window.open('/supplierawaitingpurchaseorder', '_self');
                    }).catch(function(err) {
                        window.open('/supplierawaitingpurchaseorder', '_self');
                    });
                }).catch(function(err) {
                    window.open('/supplierawaitingpurchaseorder', '_self');
                });
                //window.history.go(-2);
            }).catch(function(err) {
                //window.open('/supplierawaitingpurchaseorder','_self');
                //window.history.go(-2);
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        } else if ((url.indexOf('?suppname=') > 0) && (url.indexOf('from=') > 0)) {
            let paymentID = templateObject.supppaymentid.get();
            $('.tblSupplierPaymentcard > tbody > tr').each(function() {
                var lineID = this.id;
                let linetype = $('#' + lineID + " .colType").text() || $(this).closest('tr').find('.colType').text();
                let lineAmountDue = $('#' + lineID + " .lineAmountdue").text() || $(this).closest('tr').find('.lineAmountdue').text();
                let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val() || $(this).closest('tr').find('.linePaymentamount').val();
                let Line = {
                    type: 'TGuiSuppPaymentLines',
                    fields: {
                        TransType: linetype,
                        TransID: parseInt(lineID),
                        Paid: true,
                        Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                        //ForeignPayment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                    }
                };
                if (parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0) {
                    paymentData.push(Line);
                }
            });

            let objDetails = '';
            if (paymentData.length === 0) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Ooops...',
                    text: 'There is no amount due for payment. A payment amount cannot be applied',
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });

                return false;
            } else {
                objDetails = {
                    type: "TSuppPayments",
                    fields: {
                        ID: paymentID,
                        Amount: parseFloat(paymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                        Applied: parseFloat(paymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                        Deleted: false,

                        ClientPrintName: customer,
                        CompanyName: customer,
                        DeptClassName: department,
                        // ForeignExchangeCode: CountryAbbr,
                        // ForeignExchangeRate: 1,
                        // EmployeeName: empName || ' ',
                        GUILines: paymentData,
                        Notes: notes,
                        Payment: true,
                        PaymentDate: paymentDate,
                        PayMethodName: payMethod,

                        ReferenceNo: reference,
                        AccountName: bankAccount
                    }
                };
            }

            paymentService.saveSuppDepositData(objDetails).then(function(data) {
                var customerID = $('#edtSupplierEmail').attr('customerid');

                // Start End Send Email
                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtSupplierEmail').val());
                $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
                async function addAttachment() {
                    let attachment = [];
                    let templateObject = Template.instance();

                    let invoiceId = objDetails.fields.ID;
                    let encodedPdf = await generatePdfForMail(invoiceId);
                    let pdfObject = "";
                    var reader = new FileReader();
                    reader.readAsDataURL(encodedPdf);
                    reader.onloadend = function() {
                        var base64data = reader.result;
                        base64data = base64data.split(',')[1];

                        pdfObject = {
                            filename: 'supplierpayment-' + invoiceId + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);

                        let erpInvoiceId = objDetails.fields.ID;

                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                        let customerEmailName = $('#edtSupplierName').val();
                        let checkEmailData = $('#edtSupplierEmail').val();
                        // let mailCC = templateObject.mailCopyToUsr.get();
                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
                            "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
                            "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

                        var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
                            '    <tr>' +
                            '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
                            '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td style="padding: 40px 30px 40px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
                            '                        Hello there <span>' + customerEmailName + '</span>,' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
                            '                        Kind regards,' +
                            '                        <br>' +
                            '                        ' + mailFromName + '' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
                            '                        If you have any question, please do not hesitate to contact us.' +
                            '                    </td>' +
                            '                    <td align="right">' +
                            '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '</table>';

                        if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');

                                } else {}
                            });

                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    window.open('/supplierawaitingpurchaseorder', '_self');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailCopy').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');

                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To User: " + mailFrom + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                            //window.open('/supplierawaitingpurchaseorder', '_self');
                        };
                    };
                }
                addAttachment();

                function generatePdfForMail(invoiceId) {
                    return new Promise((resolve, reject) => {
                        let templateObject = Template.instance();
                        // let data = templateObject.singleInvoiceData.get();
                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        doc.setFontSize(18);
                        var source = document.getElementById('html-2-pdfwrapper');
                        doc.addHTML(source, function() {
                            //pdf.save('Invoice.pdf');
                            resolve(doc.output('blob'));
                            // $('#html-2-pdfwrapper').css('display','none');
                        });
                    });
                }
                // End Send Email
                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TSupplier",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }
                    // paymentService.saveSupplierEmail(customerEmailData).then(function (customerEmailData) {
                    //
                    // });
                };
                // $('.fullScreenSpin').css('display','none');
                // window.open('/supplierawaitingpurchaseorder','_self');
                sideBarService.getAllPurchaseOrderList().then(function(dataUpdate) {
                    addVS1Data('TPurchaseOrderEx', JSON.stringify(dataUpdate)).then(function(datareturn) {}).catch(function(err) {});
                }).catch(function(err) {});

                sideBarService.getTSupplierPaymentList().then(function(dataUpdate) {
                    addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function(datareturn) {}).catch(function(err) {});
                }).catch(function(err) {});

                sideBarService.getAllAwaitingSupplierPayment(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(dataUpdate) {
                    addVS1Data('TAwaitingSupplierPayment', JSON.stringify(dataUpdate)).then(function(datareturn) {
                        window.open('/supplierawaitingpurchaseorder', '_self');
                    }).catch(function(err) {
                        window.open('/supplierawaitingpurchaseorder', '_self');
                    });
                }).catch(function(err) {
                    window.open('/supplierawaitingpurchaseorder', '_self');
                });
                //window.history.go(-2);
            }).catch(function(err) {
                //window.history.go(-2);
                //window.open('/supplierawaitingpurchaseorder','_self');
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        } else if ((url.indexOf('?suppcreditname=') > 0) && (url.indexOf('pocreditid=') > 0)) {

            $('.tblSupplierPaymentcard > tbody > tr').each(function() {
                var lineID = this.id;
                let linetype = $('#' + lineID + " .colType").text() || $(this).closest('tr').find('.colType').text();
                let lineAmountDue = $('#' + lineID + " .lineAmountdue").text() || $(this).closest('tr').find('.lineAmountdue').text();
                let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val() || $(this).closest('tr').find('.linePaymentamount').val();
                let Line = {
                    type: 'TGuiSuppPaymentLines',
                    fields: {
                        TransType: linetype,
                        TransID: parseInt(lineID),
                        Paid: true,
                        Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                        //ForeignPayment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                    }
                };
                if (parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0) {
                    paymentData.push(Line);
                }

            });

            let objDetails = '';
            if (paymentData.length === 0) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Ooops...',
                    text: 'There is no amount due for payment. A payment amount cannot be applied',
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });

                return false;
            } else {
                objDetails = {
                    type: "TSuppPayments",
                    fields: {
                        ID: 0,
                        // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                        // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                        Deleted: false,

                        ClientPrintName: customer,
                        CompanyName: customer,
                        DeptClassName: department,
                        // ForeignExchangeCode: CountryAbbr,
                        // ForeignExchangeRate: 1,
                        // EmployeeName: empName || ' ',
                        GUILines: paymentData,
                        Notes: notes,
                        Payment: true,
                        PaymentDate: paymentDate,
                        PayMethodName: payMethod,

                        ReferenceNo: reference,
                        AccountName: bankAccount
                    }
                };
            }

            paymentService.saveSuppDepositData(objDetails).then(function(data) {
                var customerID = $('#edtSupplierEmail').attr('customerid');
                // Start End Send Email
                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtSupplierEmail').val());
                $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
                async function addAttachment() {
                    let attachment = [];
                    let templateObject = Template.instance();

                    let invoiceId = objDetails.fields.ID;
                    let encodedPdf = await generatePdfForMail(invoiceId);
                    let pdfObject = "";
                    var reader = new FileReader();
                    reader.readAsDataURL(encodedPdf);
                    reader.onloadend = function() {
                        var base64data = reader.result;
                        base64data = base64data.split(',')[1];

                        pdfObject = {
                            filename: 'supplierpayment-' + invoiceId + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);

                        let erpInvoiceId = objDetails.fields.ID;

                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                        let customerEmailName = $('#edtSupplierName').val();
                        let checkEmailData = $('#edtSupplierEmail').val();
                        // let mailCC = templateObject.mailCopyToUsr.get();
                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
                            "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
                            "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

                        var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
                            '    <tr>' +
                            '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
                            '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td style="padding: 40px 30px 40px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
                            '                        Hello there <span>' + customerEmailName + '</span>,' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
                            '                        Kind regards,' +
                            '                        <br>' +
                            '                        ' + mailFromName + '' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
                            '                        If you have any question, please do not hesitate to contact us.' +
                            '                    </td>' +
                            '                    <td align="right">' +
                            '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '</table>';

                        if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierpayment', '_self');

                                } else {}
                            });

                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierpayment', '_self');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierpayment', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailCopy').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierpayment', '_self');

                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierpayment', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //  window.open('/supplierpayment', '_self');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To User: " + mailFrom + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierpayment', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                            //window.open('/supplierpayment', '_self');
                        };
                    };
                }
                addAttachment();

                function generatePdfForMail(invoiceId) {
                    return new Promise((resolve, reject) => {
                        let templateObject = Template.instance();
                        // let data = templateObject.singleInvoiceData.get();
                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        doc.setFontSize(18);
                        var source = document.getElementById('html-2-pdfwrapper');
                        doc.addHTML(source, function() {
                            //pdf.save('Invoice.pdf');
                            resolve(doc.output('blob'));
                            // $('#html-2-pdfwrapper').css('display','none');
                        });
                    });
                }
                // End Send Email
                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TSupplier",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }

                };
                // $('.fullScreenSpin').css('display','none');
                // window.open('/supplierpayment','_self');
                sideBarService.getAllPurchaseOrderList().then(function(dataUpdate) {
                    sideBarService.getTSupplierPaymentList().then(function(dataUpdate) {
                        addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function(datareturn) {}).catch(function(err) {});
                    }).catch(function(err) {});

                    addVS1Data('TPurchaseOrderEx', JSON.stringify(dataUpdate)).then(function(datareturn) {
                        sideBarService.getAllAwaitingSupplierPayment(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(dataUpdate) {
                            addVS1Data('TAwaitingSupplierPayment', JSON.stringify(dataUpdate)).then(function(datareturn) {
                                window.open('/supplierpayment', '_self');
                            }).catch(function(err) {
                                window.open('/supplierpayment', '_self');
                            });
                        }).catch(function(err) {
                            window.open('/supplierpayment', '_self');
                        });
                    }).catch(function(err) {
                        window.open('/supplierpayment', '_self');
                    });
                }).catch(function(err) {
                    window.open('/supplierpayment', '_self');
                });

            }).catch(function(err) {
                //window.open('/paymentoverview','_self');
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        } else if ((url.indexOf('?selectsupppo') > 0) && (url.indexOf('&selectsuppbill') > 0) && (url.indexOf('&selectsuppcredit') > 0)) {
            var getsale_id = url.split('?selectsupppo=');
            var currentSalesID = getsale_id[getsale_id.length - 1];
            let checkData = [];
            let allData = [];

           checkData = Session.get('supplierpayments') || [];
            if(checkData.length > 0){
            let getPayments = JSON.parse(Session.get('supplierpayments') || []);
            if(getPayments.length > 0) {
                allData = getPayments;
            } else {
                allData = [];
            }
        } else {
            allData = [];
        }
            $('.tblSupplierPaymentcard > tbody > tr').each(function() {

                var lineID = this.id;
                let linetype = $('#' + lineID + " .colType").text() || $(this).closest('tr').find('.colType').text();
                let lineAmountDue = $('#' + lineID + " .lineAmountdue").text() || $(this).closest('tr').find('.lineAmountdue').text();
                let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val() || $(this).closest('tr').find('.linePaymentamount').val();

                let Line = {
                    type: 'TGuiSuppPaymentLines',
                    fields: {
                        TransType: linetype,
                        TransID: parseInt(lineID),
                        Paid: true,
                        Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                    }
                };
                if (parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) != 0) {
                    paymentData.push(Line);
                }
            });

            let objDetails = '';
            if (paymentData.length === 0) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Ooops...',
                    text: 'There is no amount due for payment. A payment amount cannot be applied',
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });

                return false;
            } else {
                objDetails = {
                    type: "TSuppPayments",
                    fields: {
                        ID: 0,
                        Deleted: false,

                        ClientPrintName: customer,
                        CompanyName: customer,
                        DeptClassName: department,
                        GUILines: paymentData,
                        Notes: notes,
                        Payment: true,
                        PaymentDate: paymentDate,
                        PayMethodName: payMethod,

                        ReferenceNo: reference,
                        AccountName: bankAccount
                    }
                };

            }

            paymentService.saveSuppDepositData(objDetails).then(function(data) {
                var customerID = $('#edtSupplierEmail').attr('customerid');
                if(allData.length > 0) {
                    newURL = '/supplierpaymentcard?selectsupppo=' + allData[0].po + '&selectsuppbill=' + allData[0].bill + '&selectsuppcredit=' + allData[0].credit;
                    allData.shift();
                    Session.setPersistent('supplierpayments', JSON.stringify(allData));
                } else {
                    newURL = '/paymentoverview?success=true';
                    Session.setPersistent('supplierpayments', JSON.stringify(allData));
                }
                // Start End Send Email
                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtSupplierEmail').val());
                $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
                async function addAttachment() {
                    let attachment = [];
                    let templateObject = Template.instance();

                    let invoiceId = objDetails.fields.ID;
                    let encodedPdf = await generatePdfForMail(invoiceId);
                    let pdfObject = "";
                    var reader = new FileReader();
                    reader.readAsDataURL(encodedPdf);
                    reader.onloadend = function() {
                        var base64data = reader.result;
                        base64data = base64data.split(',')[1];

                        pdfObject = {
                            filename: 'supplierpayment-' + invoiceId + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);

                        let erpInvoiceId = objDetails.fields.ID;

                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                        let customerEmailName = $('#edtSupplierName').val();
                        let checkEmailData = $('#edtSupplierEmail').val();
                        // let mailCC = templateObject.mailCopyToUsr.get();
                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
                            "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
                            "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

                        var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
                            '    <tr>' +
                            '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
                            '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td style="padding: 40px 30px 40px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
                            '                        Hello there <span>' + customerEmailName + '</span>,' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
                            '                        Kind regards,' +
                            '                        <br>' +
                            '                        ' + mailFromName + '' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
                            '                        If you have any question, please do not hesitate to contact us.' +
                            '                    </td>' +
                            '                    <td align="right">' +
                            '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '</table>';

                        if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');

                                } else {}
                            });

                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            window.open(url,'_self');
                                        } else if (result.dismiss === 'cancel') {
                                           window.open(url,'_self');
                                        }
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailCopy').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                     window.open(newURL,'_self');

                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            window.open(newURL,'_self');
                                        } else if (result.dismiss === 'cancel') {
                                            window.open(newURL,'_self');
                                        }
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To User: " + mailFrom + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            window.open(newURL,'_self');
                                        } else if (result.dismiss === 'cancel') {
                                             window.open(newURL,'_self');
                                        }
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                            window.open(newURL,'_self');
                        };
                    };
                }
                addAttachment();

                function generatePdfForMail(invoiceId) {
                    return new Promise((resolve, reject) => {
                        let templateObject = Template.instance();
                        // let data = templateObject.singleInvoiceData.get();
                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        doc.setFontSize(18);
                        var source = document.getElementById('html-2-pdfwrapper');
                        doc.addHTML(source, function() {
                            //pdf.save('Invoice.pdf');
                            resolve(doc.output('blob'));
                            // $('#html-2-pdfwrapper').css('display','none');
                        });
                    });
                }
                // End Send Email
                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TSupplier",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }

                };

                sideBarService.getTSupplierPaymentList().then(function(dataUpdate) {
                    addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function(datareturn) {}).catch(function(err) {});
                }).catch(function(err) {});
                sideBarService.getAllPurchaseOrderList().then(function(dataUpdate) {
                    addVS1Data('TPurchaseOrderEx', JSON.stringify(dataUpdate)).then(function(datareturn) {
                        sideBarService.getAllAwaitingSupplierPayment(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(dataUpdate2) {
                            addVS1Data('TAwaitingSupplierPayment', JSON.stringify(dataUpdate2)).then(function(datareturn) {
                                window.open(newURL,'_self');
                            }).catch(function(err) {
                                window.open(newURL,'_self');
                            });
                        }).catch(function(err) {
                            window.open(newURL,'_self');
                        });
                    }).catch(function(err) {
                        window.open(newURL,'_self');
                    });
                }).catch(function(err) {
                    window.open(newURL,'_self');
                });
            }).catch(function(err) {
                if(allData.length > 0) {
                    newURL = '/supplierpaymentcard?selectsupppo=' + allData[0].po + '&selectsuppbill=' + allData[0].bill + '&selectsuppcredit=' + allData[0].credit;
                    allData.shift();
                    Session.setPersistent('supplierpayments', JSON.stringify(allData));
                } else {
                    newURL = '/paymentoverview?success=true';
                    Session.setPersistent('supplierpayments', JSON.stringify(allData));
                }

                //window.open('/paymentoverview','_self');
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        window.open(newURL,'_self');
                    } else if (result.dismiss === 'cancel') {
                        window.open(newURL,'_self');
                    }
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {


            $('.tblSupplierPaymentcard > tbody > tr').each(function() {
              if ($(this).closest('tr').find('.colType').text() != '') {
                var lineID = this.id;
                let linetype = $('#' + lineID + " .colType").text() || $(this).closest('tr').find('.colType').text();
                let lineAmountDue = $('#' + lineID + " .lineAmountdue").text() || $(this).closest('tr').find('.lineAmountdue').text();
                let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val() || $(this).closest('tr').find('.linePaymentamount').val();
                let Line = {
                    type: 'TGuiSuppPaymentLines',
                    fields: {
                        TransType: linetype,
                        TransID: parseInt(lineID),
                        Paid: true,
                        Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                        //ForeignPayment:parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                    }
                };

                    paymentData.push(Line);
                }
            });
            let objDetails = '';
            if (paymentData.length === 0) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Ooops...',
                    text: 'There is no amount due for payment. A payment amount cannot be applied',
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });

                return false;
            } else {
                objDetails = {
                    type: "TSuppPayments",
                    fields: {
                        ID: 0,
                        // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                        // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                        Deleted: false,

                        ClientPrintName: customer,
                        CompanyName: customer,
                        DeptClassName: department,
                        //ForeignExchangeCode: CountryAbbr,
                        //ForeignExchangeRate: 1,
                        // EmployeeName: empName || ' ',
                        GUILines: paymentData,
                        Notes: notes,
                        Payment: true,
                        PaymentDate: paymentDate,
                        PayMethodName: payMethod,

                        ReferenceNo: reference,
                        AccountName: bankAccount
                    }
                };
            }

            paymentService.saveSuppDepositData(objDetails).then(function(data) {
                var customerID = $('#edtSupplierEmail').attr('customerid');
                // Start End Send Email
                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtSupplierEmail').val());
                $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
                async function addAttachment() {
                    let attachment = [];
                    let templateObject = Template.instance();

                    let invoiceId = objDetails.fields.ID;
                    let encodedPdf = await generatePdfForMail(invoiceId);
                    let pdfObject = "";
                    var reader = new FileReader();
                    reader.readAsDataURL(encodedPdf);
                    reader.onloadend = function() {
                        var base64data = reader.result;
                        base64data = base64data.split(',')[1];

                        pdfObject = {
                            filename: 'supplierpayment-' + invoiceId + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);

                        let erpInvoiceId = objDetails.fields.ID;

                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                        let customerEmailName = $('#edtSupplierName').val();
                        let checkEmailData = $('#edtSupplierEmail').val();
                        // let mailCC = templateObject.mailCopyToUsr.get();
                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's puchase order " + erpInvoiceId + " for  " + grandtotal + "." +
                            "\n\nThe amount outstanding of " + amountDueEmail + " is due on " + emailDueDate + "." +
                            "\n\nIf you have any questions, please let us know : " + mailFrom + ".\n\nThanks,\n" + mailFromName;

                        var htmlmailBody = '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">' +
                            '    <tr>' +
                            '        <td align="center" bgcolor="#54c7e2" style="padding: 40px 0 30px 0;">' +
                            '            <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" class="uploadedImage" alt="VS1 Cloud" width="250px" style="display: block;" />' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td style="padding: 40px 30px 40px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 20px 0;">' +
                            '                        Hello there <span>' + customerEmailName + '</span>,' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 10px 0;">' +
                            '                        Please find puchase order <span>' + erpInvoiceId + '</span> attached below.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                    <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; padding: 20px 0 30px 0;">' +
                            '                        Kind regards,' +
                            '                        <br>' +
                            '                        ' + mailFromName + '' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '    <tr>' +
                            '        <td bgcolor="#00a3d3" style="padding: 30px 30px 30px 30px;">' +
                            '            <table border="0" cellpadding="0" cellspacing="0" width="100%">' +
                            '                <tr>' +
                            '                    <td width="50%" style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">' +
                            '                        If you have any question, please do not hesitate to contact us.' +
                            '                    </td>' +
                            '                    <td align="right">' +
                            '                        <a style="border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; background-color: #4CAF50;" href="mailto:' + mailFrom + '">Contact Us</a>' +
                            '                    </td>' +
                            '                </tr>' +
                            '            </table>' +
                            '        </td>' +
                            '    </tr>' +
                            '</table>';

                        if (($('.chkEmailCopy').is(':checked')) && ($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');

                                } else {}
                            });

                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " and User: " + mailFrom + "",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailCopy').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: checkEmailData,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');

                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Supplier: " + checkEmailData + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //  window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else if (($('.chkEmailRep').is(':checked'))) {
                            Meteor.call('sendEmail', {
                                from: "" + mailFromName + " <" + mailFrom + ">",
                                to: mailFrom,
                                subject: mailSubject,
                                text: '',
                                html: htmlmailBody,
                                attachments: attachment
                            }, function(error, result) {
                                if (error && error.error === "error") {
                                    //window.open('/supplierawaitingpurchaseorder', '_self');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To User: " + mailFrom + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('/supplierawaitingpurchaseorder', '_self');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                            //window.open('/supplierawaitingpurchaseorder', '_self');
                        };
                    };
                }
                addAttachment();

                function generatePdfForMail(invoiceId) {
                    return new Promise((resolve, reject) => {
                        let templateObject = Template.instance();
                        // let data = templateObject.singleInvoiceData.get();
                        let completeTabRecord;
                        let doc = new jsPDF('p', 'pt', 'a4');
                        doc.setFontSize(18);
                        var source = document.getElementById('html-2-pdfwrapper');
                        doc.addHTML(source, function() {
                            //pdf.save('Invoice.pdf');
                            resolve(doc.output('blob'));
                            // $('#html-2-pdfwrapper').css('display','none');
                        });
                    });
                }
                // End Send Email
                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TSupplier",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }
                    // paymentService.saveSupplierEmail(customerEmailData).then(function (customerEmailData) {
                    //
                    // });
                };
                // $('.fullScreenSpin').css('display','none');
                // window.open('/supplierawaitingpurchaseorder','_self');
                sideBarService.getAllPurchaseOrderList().then(function(dataUpdate) {
                    addVS1Data('TPurchaseOrderEx', JSON.stringify(dataUpdate)).then(function(datareturn) {}).catch(function(err) {});
                }).catch(function(err) {});

                sideBarService.getTSupplierPaymentList().then(function(dataUpdate) {
                    addVS1Data('TSupplierPayment', JSON.stringify(dataUpdate)).then(function(datareturn) {}).catch(function(err) {});
                }).catch(function(err) {});

                sideBarService.getAllAwaitingSupplierPayment(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(dataUpdate) {
                    addVS1Data('TAwaitingSupplierPayment', JSON.stringify(dataUpdate)).then(function(datareturn) {
                        window.open('/supplierawaitingpurchaseorder', '_self');
                    }).catch(function(err) {
                        window.open('/supplierawaitingpurchaseorder', '_self');
                    });
                }).catch(function(err) {
                    window.open('/supplierawaitingpurchaseorder', '_self');
                });

            }).catch(function(err) {
                //window.open('/paymentoverview','_self');
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }

    },
    'click #tblSupplierPaymentcard tr .colTransNo': function(event) {
        let custname = $('#edtSupplierName').val()||'';
        if (custname === '') {
            swal('Supplier has not been selected!', '', 'warning');
            e.preventDefault();
      } else {
        if($('#addRow').prop('disabled') == false) {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $(".chkBox").prop("checked", false);
        let paymentList = [''];
        $('.tblSupplierPaymentcard tbody tr').each(function() {
            paymentList.push(this.id);

        })
        let geturl = location.href;
        let id = "";
        if (geturl.indexOf('?selectsupppo') > 0 && geturl.indexOf('&selectsuppbill') > 0 && geturl.indexOf('&selectsuppcredit') > 0) {
            geturl = new URL(geturl);
            let selectsupppo = geturl.searchParams.get("selectsupppo") || '';
            let selectsuppbill = geturl.searchParams.get("selectsuppbill") || '';
            let selectsuppcredit = geturl.searchParams.get("selectsuppcredit") || '';
            id = selectsupppo + ',' + selectsuppbill + ',' + selectsuppcredit;
        } else if (geturl.indexOf('?billid') > 0) {
            geturl = new URL(geturl);
        } else if (geturl.indexOf('?poid') > 0) {
            geturl = new URL(geturl);
            id = geturl.searchParams.get("poid");
        } else if (geturl.indexOf('?creditid') > 0) {
            geturl = new URL(geturl);
            id = geturl.searchParams.get("creditid");
        }

        $('.fullScreenSpin').css('display', 'inline-block');
        let paymentData = templateObject.datatablerecords1.get();
        let paymentDataList = [];
        if(jQuery.isEmptyObject( FlowRouter.current().queryParams) == true){
          for (let x = 0; x < paymentData.length; x++) {
              let found = paymentList.some(emp => emp == paymentData[x].id);
              if (custname == paymentData[x].customername && found == false) {
                  paymentDataList.push(paymentData[x]);
              }
          }
        }else{
        for (let x = 0; x < paymentData.length; x++) {
            let found = paymentList.some(emp => emp == paymentData[x].id);
            if (custname == paymentData[x].customername && id.includes(paymentData[x].id) == false && found == false) {
                paymentDataList.push(paymentData[x]);
            }
        }
      }
        $('.dataTables_info').hide();
        templateObject.datatablerecords.set(paymentDataList);
        $('#supplierPaymentListModal').modal();
        $('.fullScreenSpin').css('display', 'none');
    }
  }
    },
    'click .chkPaymentCard': function() {
        var listData = $(this).closest('tr').attr('id');
        var selectedClient = $(event.target).closest("tr").find(".colSupplierName").text();
        const templateObject = Template.instance();
        const selectedAwaitingPayment = [];
        const selectedAwaitingPayment2 = [];
        $('.chkPaymentCard:checkbox:checked').each(function() {
            //$('.parentClass:not(span)').method
            var chkIdLine = $(this).closest('tr').attr('id');
            var date = $(this).closest("tr").find('.colPaymentDate').text();
            var receiptNo = $(this).closest("tr").find('.colReceiptNo').text();
            var orderNo = $(this).closest("tr").find('.colPONumber').text();
            var paymentAmount = $(this).closest("tr").find('.colPaymentAmount').text();
            var originalAmount = $(this).closest("tr").find('.colApplied').text();
            var outstandingAmount = $(this).closest("tr").find('.colBalance').text();
            var supplierName = $(this).closest("tr").find('.colSupplierName').text();
            var comments = $(this).closest("tr").find('.colNotes').text();
            var type = $(this).closest("tr").find('.colTypePayment').text();
            let paymentTransObj = {
                awaitingId: chkIdLine,
                date: date,
                receiptNo: receiptNo,
                orderNo: orderNo,
                paymentAmount: outstandingAmount,
                originalAmount: originalAmount,
                outstandingAmount: outstandingAmount,
                supplierName: supplierName,
                comments: comments,
                type: type
            };

            if (selectedAwaitingPayment.length > 0) {
                var checkClient = selectedAwaitingPayment.filter(slctdAwtngPyment => {
                    return slctdAwtngPyment.supplierName == $('#colSupplierName' + chkIdLine).text();
                });

                if (checkClient.length > 0) {
                    selectedAwaitingPayment.push(paymentTransObj);
                } else {
                    swal('', 'You have selected multiple Suppliers,  a separate payment will be created for each', 'info');
                    $(this).prop("checked", false);
                }
            } else {
                selectedAwaitingPayment.push(paymentTransObj);
            }
        });
        templateObject.selectedAwaitingPayment.set(selectedAwaitingPayment);
    },
    'click .chkBoxAll': function () {
        var listData = $(this).closest('tr').attr('id');
        var selectedClient = $(event.target).closest("tr").find(".colSupplierName").text();
        const templateObject = Template.instance();
        const selectedAwaitingPayment = [];
        const selectedAwaitingPayment2 = [];
        const selectedAwaitingPayment3 = [];
        if ($(event.target).is(':checked')) {
            $(".chkBox").prop("checked", true);
            $('.chkPaymentCard:checkbox:checked').each(function() {
            //$('.parentClass:not(span)').method
            var chkIdLine = $(this).closest('tr').attr('id');
            var date = $(this).closest("tr").find('.colPaymentDate').text();
            var receiptNo = $(this).closest("tr").find('.colReceiptNo').text();
            var orderNo = $(this).closest("tr").find('.colPONumber').text();
            var paymentAmount = $(this).closest("tr").find('.colPaymentAmount').text();
            var originalAmount = $(this).closest("tr").find('.colApplied').text();
            var outstandingAmount = $(this).closest("tr").find('.colBalance').text();
            var supplierName = $(this).closest("tr").find('.colSupplierName').text();
            var comments = $(this).closest("tr").find('.colNotes').text();
            var type = $(this).closest("tr").find('.colTypePayment').text();
            let paymentTransObj = {
                awaitingId: chkIdLine,
                date: date,
                receiptNo: receiptNo,
                orderNo: orderNo,
                paymentAmount: outstandingAmount,
                originalAmount: originalAmount,
                outstandingAmount: outstandingAmount,
                supplierName: supplierName,
                comments: comments,
                type: type
            };

            if (selectedAwaitingPayment.length > 0) {
                var checkClient = selectedAwaitingPayment.filter(slctdAwtngPyment => {
                    return slctdAwtngPyment.supplierName == $('#colSupplierName' + chkIdLine).text();
                });

                if (checkClient.length > 0) {
                    selectedAwaitingPayment.push(paymentTransObj);
                } else {
                    swal('', 'You have selected multiple Suppliers,  a separate payment will be created for each', 'info');
                    $(this).prop("checked", false);
                }
            } else {
                selectedAwaitingPayment.push(paymentTransObj);
            }
        });
        templateObject.selectedAwaitingPayment.set(selectedAwaitingPayment);
        } else {
            $(".chkBox").prop("checked", false);
              $('.chkPaymentCard:checkbox:checked').each(function() {
            //$('.parentClass:not(span)').method
            var chkIdLine = $(this).closest('tr').attr('id');
            var date = $(this).closest("tr").find('.colPaymentDate').text();
            var receiptNo = $(this).closest("tr").find('.colReceiptNo').text();
            var orderNo = $(this).closest("tr").find('.colPONumber').text();
            var paymentAmount = $(this).closest("tr").find('.colPaymentAmount').text();
            var originalAmount = $(this).closest("tr").find('.colApplied').text();
            var outstandingAmount = $(this).closest("tr").find('.colBalance').text();
            var supplierName = $(this).closest("tr").find('.colSupplierName').text();
            var comments = $(this).closest("tr").find('.colNotes').text();
            var type = $(this).closest("tr").find('.colTypePayment').text();
            let paymentTransObj = {
                awaitingId: chkIdLine,
                date: date,
                receiptNo: receiptNo,
                orderNo: orderNo,
                paymentAmount: outstandingAmount,
                originalAmount: originalAmount,
                outstandingAmount: outstandingAmount,
                supplierName: supplierName,
                comments: comments,
                type: type
            };

            if (selectedAwaitingPayment.length > 0) {
                var checkClient = selectedAwaitingPayment.filter(slctdAwtngPyment => {
                    return slctdAwtngPyment.supplierName == $('#colSupplierName' + chkIdLine).text();
                });

                if (checkClient.length > 0) {
                    selectedAwaitingPayment.push(paymentTransObj);
                } else {
                    swal('', 'You have selected multiple Suppliers,  a separate payment will be created for each', 'info');
                    $(this).prop("checked", false);
                }
            } else {
                selectedAwaitingPayment.push(paymentTransObj);
            }
        });
        templateObject.selectedAwaitingPayment.set(selectedAwaitingPayment);
        }
    },

    'click .btnSelectSuppliers': function(event) {
        const templateObject = Template.instance();

        let selectedSupplierPayments = templateObject.selectedAwaitingPayment.get()
        if (selectedSupplierPayments.length > 0) {
            let currentApplied = $('.lead').text().replace(/[^0-9.-]+/g, "");
            currentApplied = parseFloat(currentApplied.match(/-?(?:\d+(?:\.\d*)?|\.\d+)/)[0])
            let total = parseFloat(currentApplied);
            for (let x = 0; x < selectedSupplierPayments.length; x++) {
              var rowData = '<tr class="dnd-moved" id="'+selectedSupplierPayments[x].awaitingId+'" name="'+selectedSupplierPayments[x].awaitingId+'">\n'+
                            '	<td contenteditable="false" class="colTransDate">'+selectedSupplierPayments[x].date+'</td>\n'+
                            '	<td contenteditable="false" class="colType" style="color:#00a3d3; cursor: pointer; white-space: nowrap;">'+selectedSupplierPayments[x].type+'</td>\n'+
                            '	<td contenteditable="false" class="colTransNo" style="color:#00a3d3">'+selectedSupplierPayments[x].awaitingId+'</td>\n'+
                            '	<td contenteditable="false" class="lineOrginalamount" style="text-align: right!important;">'+selectedSupplierPayments[x].originalAmount+'</td>\n'+
                            '	<td contenteditable="false" class="lineAmountdue" style="text-align: right!important;">'+selectedSupplierPayments[x].outstandingAmount+'</td>\n'+
                            '	<td><input class="linePaymentamount highlightInput" type="text" value="'+selectedSupplierPayments[x].paymentAmount+'"></td>\n'+
                            '	<td contenteditable="false" class="lineOutstandingAmount" style="text-align: right!important;">'+selectedSupplierPayments[x].paymentAmount+'</td>\n'+
                            '	<td contenteditable="true" class="colComments">'+selectedSupplierPayments[x].comments+'</td>\n'+
                            '	<td><span class="table-remove btnRemove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span></td>\n'+
                            '</tr>';

                // var rowData = $('#tblSupplierPaymentcard tbody>tr:last').clone(true);
                // $(".colTransDate", rowData).text(selectedSupplierPayments[x].date);
                // $(".colType", rowData).text(selectedSupplierPayments[x].type);
                // $(".colTransNo", rowData).text(selectedSupplierPayments[x].orderNo);
                // $(".lineOrginalamount", rowData).text(selectedSupplierPayments[x].originalAmount);
                // $(".lineAmountdue", rowData).text(selectedSupplierPayments[x].outstandingAmount);
                // $(".linePaymentamount", rowData).val(selectedSupplierPayments[x].paymentAmount);
                // $(".lineOutstandingAmount", rowData).text(selectedSupplierPayments[x].paymentAmount);
                // $(".colComments", rowData).text(selectedSupplierPayments[x].comments);
                // rowData.attr('id', selectedSupplierPayments[x].awaitingId);
                // rowData.attr('name', selectedSupplierPayments[x].awaitingId);
                let checkCompareID = selectedSupplierPayments[x].awaitingId||'';
                let isCheckedTrue = true;
              $('.tblSupplierPaymentcard > tbody > tr').each(function() {
                var lineID = this.id;
                if(lineID == checkCompareID){
                  isCheckedTrue = false;
                }
              });
              //setTimeout(function() {
              if(isCheckedTrue){
                $("#tblSupplierPaymentcard tbody").append(rowData);
                total = total + parseFloat(selectedSupplierPayments[x].paymentAmount.replace(/[^0-9.-]+/g, ""));
              }
              //}, 500);
            }
            $('.appliedAmount').text(utilityService.modifynegativeCurrencyFormat(total.toFixed(2)));

        }
        templateObject.selectedAwaitingPayment.set([]);
        $('#supplierPaymentListModal').modal('hide');

        setTimeout(function() {
          $('td').each(function () {
              if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
          });
        }, 1000);
    },
    'keydown #edtPaymentAmount, keydown .linePaymentamount': function(event) {
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
    },
    'blur #edtPaymentAmount': function(event) {
        let paymentAmt = $(event.target).val();
        let formatedpaymentAmt = Number(paymentAmt.replace(/[^0-9.-]+/g, "")) || 0;
        $('#edtPaymentAmount').val(utilityService.modifynegativeCurrencyFormat(formatedpaymentAmt));
    },
    'blur .linePaymentamount': function(event) {
        let paymentAmt = $(event.target).val()||0;
        let oustandingAmt = $(event.target).closest('tr').find('.lineOutstandingAmount').text()||0;
        let formatedpaymentAmt = Number(paymentAmt.replace(/[^0-9.-]+/g, "")) || 0;
        let formatedoustandingAmt = Number(oustandingAmt.replace(/[^0-9.-]+/g, "")) || 0;
        if(formatedpaymentAmt > 0){
        if(formatedpaymentAmt > formatedoustandingAmt){
          $(event.target).closest('tr').find('.lineOutstandingAmount').text(Currency + 0);
        }else{
          let getUpdateOustanding = formatedoustandingAmt - formatedpaymentAmt;
          $(event.target).closest('tr').find('.lineOutstandingAmount').text(utilityService.modifynegativeCurrencyFormat(getUpdateOustanding));
        }
       }
        $(event.target).val(utilityService.modifynegativeCurrencyFormat(formatedpaymentAmt));
        let $tblrows = $("#tblSupplierPaymentcard tbody tr");
        let appliedGrandTotal = 0;
        $tblrows.each(function(index) {
            var $tblrow = $(this);
            var pricePayAmount = Number($tblrow.find(".linePaymentamount").val().replace(/[^0-9.-]+/g, "")) || 0;
            if (!isNaN(pricePayAmount)) {

                appliedGrandTotal += pricePayAmount;
                //document.getElementById("subtotal_total").innerHTML = Currency+''+subGrandTotal.toLocaleString(undefined, {minimumFractionDigits: 2});
            }
        });
        $('#edtPaymentAmount').val(utilityService.modifynegativeCurrencyFormat(appliedGrandTotal));
        $('.appliedAmount').text(utilityService.modifynegativeCurrencyFormat(appliedGrandTotal));
    },
    'click .btnBack': function(event) {
        event.preventDefault();
        history.back(1);
    },
    'click .btnRemove': function(event) {
        $('.btnDeleteLine').show();
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        var clicktimes = 0;
        var targetID = $(event.target).closest('tr').attr('id')||0; // table row ID
        $('#selectDeleteLineID').val(targetID);

        times++;
        if (times == 1) {
          if(targetID == 0){
            $(event.target).closest('tr').remove();
          }else{
              $('#deleteLineModal').modal('toggle');
          }

        } else {
            if ($('#tblSupplierPaymentcard tbody>tr').length > 1) {
                this.click;
                let total = 0;
                $(event.target).closest('tr').remove();
                event.preventDefault();
                let $tblrows = $("#tblSupplierPaymentcard tbody tr");
                $tblrows.each(function(index) {
                    var $tblrow = $(this);
                    total += parseFloat($tblrow.find(".linePaymentamount ").val().replace(/[^0-9.-]+/g, "")) || 0;
                });
                $('.appliedAmount').text(utilityService.modifynegativeCurrencyFormat(total.toFixed(2)));
                return false;

            } else {
              if(targetID == 0){
                $(event.target).closest('tr').remove();
              }else{
                  $('#deleteLineModal').modal('toggle');
              }
            }

        }
    },
    'click .btnDeletePayment': function(event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();
        let paymentService = new PaymentsService();
        var url = FlowRouter.current().path;
        var currentBeginDate = new Date();
        var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if ((currentBeginDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentBeginDate.getMonth());
        } else {
            fromDateMonth = (currentBeginDate.getMonth());
        }

        if (currentBeginDate.getDate() < 10) {
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        var toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay + 1);
        let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length - 1];
        var objDetails = '';
        if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            var objDetails = {
                type: "TSuppPayments",
                fields: {
                    ID: currentInvoice,
                    Deleted: true
                    // Lines: null
                }
            };

            paymentService.deleteSuppDepositData(objDetails).then(function(objDetails) {
                $('.modal-backdrop').css('display', 'none');
                FlowRouter.go('/paymentoverview?success=true');
                sideBarService.getAllBillExList(initialDataLoad,0).then(function(dataBill) {
                    addVS1Data('TBillEx', JSON.stringify(dataBill)).then(function(datareturn) {}).catch(function(err) {});
                }).catch(function(err) {});

                sideBarService.getAllAwaitingSupplierPayment(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
                    addVS1Data('TAwaitingSupplierPayment', JSON.stringify(data)).then(function(datareturn) {}).catch(function(err) {});
                }).catch(function(err) {});

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
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
                $('.modal-backdrop').css('display', 'none');
            });
        } else {
            let suppPaymentId = $('.printID').attr("id");
            if (suppPaymentId !== '') {
                currentInvoice = parseInt(suppPaymentId);
                var objDetails = {
                    type: "TSuppPayments",
                    fields: {
                        ID: currentInvoice,
                        Deleted: true
                        // Lines: null
                    }
                };

                paymentService.deleteSuppDepositData(objDetails).then(function(objDetails) {
                    $('.modal-backdrop').css('display', 'none');
                    FlowRouter.go('/paymentoverview?success=true');
                    sideBarService.getAllBillExList(initialDataLoad,0).then(function(dataBill) {
                        addVS1Data('TBillEx', JSON.stringify(dataBill)).then(function(datareturn) {}).catch(function(err) {});
                    }).catch(function(err) {});

                    sideBarService.getAllAwaitingSupplierPayment(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
                        addVS1Data('TAwaitingSupplierPayment', JSON.stringify(data)).then(function(datareturn) {}).catch(function(err) {});
                    }).catch(function(err) {});

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
                        } else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                    $('.modal-backdrop').css('display', 'none');
                });
            } else {
                FlowRouter.go('/paymentoverview?success=true');
                $('.modal-backdrop').css('display', 'none');
            }

        }
        // $('#deleteLineModal').modal('toggle');
    },
    'click .btnConfirmPayment': function(event) {
        $('.btnDeleteLine').hide();
        $('#deleteLineModal').modal('toggle');
    },
    'click .btnDeleteLine': function(event) {
        let templateObject = Template.instance();
        let utilityService = new UtilityService();
        let selectLineID = $('#selectDeleteLineID').val()||0;
        if ($('#tblSupplierPaymentcard tbody>tr').length > 1) {
            this.click;
            let total = 0;
            $('#tblSupplierPaymentcard #' + selectLineID).closest('tr').remove();
            let $tblrows = $("#tblSupplierPaymentcard tbody tr");
            $tblrows.each(function(index) {
                var $tblrow = $(this);
                total += parseFloat($tblrow.find(".linePaymentamount ").val().replace(/[^0-9.-]+/g, "")) || 0;
            });
            $('.appliedAmount').text(utilityService.modifynegativeCurrencyFormat(total.toFixed(2)));

        } else {
            this.click;
        }
        $('#deleteLineModal').modal('toggle');
    },
    'click .printConfirm': function(event) {
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtSupplierName').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
        exportSalesToPdf();
    },
    'click .chkcolTransDate': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colTransDate').css('display', 'table-cell');
            $('.colTransDate').css('padding', '.75rem');
            $('.colTransDate').css('vertical-align', 'top');
        } else {
            $('.colTransDate').css('display', 'none');
        }
    },
    'click .chkcolType': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colType').css('display', 'table-cell');
            $('.colType').css('padding', '.75rem');
            $('.colType').css('vertical-align', 'top');
        } else {
            $('.colType').css('display', 'none');
        }
    },
    'click .chkcolTransNo': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colTransNo').css('display', 'table-cell');
            $('.colTransNo').css('padding', '.75rem');
            $('.colTransNo').css('vertical-align', 'top');
        } else {
            $('.colTransNo').css('display', 'none');
        }
    },
    'click .chklineOrginalamount': function(event) {
        if ($(event.target).is(':checked')) {
            $('.lineOrginalamount').css('display', 'table-cell');
            $('.lineOrginalamount').css('padding', '.75rem');
            $('.lineOrginalamount').css('vertical-align', 'top');
        } else {
            $('.lineOrginalamount').css('display', 'none');
        }
    },
    'click .chklineAmountdue': function(event) {
        if ($(event.target).is(':checked')) {
            $('.lineAmountdue').css('display', 'table-cell');
            $('.lineAmountdue').css('padding', '.75rem');
            $('.lineAmountdue').css('vertical-align', 'top');
        } else {
            $('.lineAmountdue').css('display', 'none');
        }
    },
    'click .chklinePaymentamount': function(event) {
        if ($(event.target).is(':checked')) {
            $('.linePaymentamount').css('display', 'table-cell');
            $('.linePaymentamount').css('padding', '.75rem');
            $('.linePaymentamount').css('vertical-align', 'top');
        } else {
            $('.linePaymentamount').css('display', 'none');
        }
    },
    'click .chklineOutstandingAmount': function(event) {
        if ($(event.target).is(':checked')) {
            $('.lineOutstandingAmount').css('display', 'table-cell');
            $('.lineOutstandingAmount').css('padding', '.75rem');
            $('.lineOutstandingAmount').css('vertical-align', 'top');
        } else {
            $('.lineOutstandingAmount').css('display', 'none');
        }
    },
    'click .chkcolComments': function(event) {
        if ($(event.target).is(':checked')) {
            $('.colComments').css('display', 'table-cell');
            $('.colComments').css('padding', '.75rem');
            $('.colComments').css('vertical-align', 'top');
        } else {
            $('.colComments').css('display', 'none');
        }
    },
    'change .rngRangeTransDate': function(event) {
        let range = $(event.target).val();
        $(".spWidthTransDate").html(range + '%');
        $('.colTransDate').css('width', range + '%');
    },
    'change .rngRangeType': function(event) {
        let range = $(event.target).val();
        $(".spWidthType").html(range + '%');
        $('.colType').css('width', range + '%');
    },
    'change .rngRangeTransNo': function(event) {
        let range = $(event.target).val();
        $(".spWidthTransNo").html(range + '%');
        $('.colTransNo').css('width', range + '%');
    },
    'change .rngRangelineOrginalamount': function(event) {
        let range = $(event.target).val();
        $(".spWidthlineOrginalamount").html(range + '%');
        $('.lineOrginalamount').css('width', range + '%');
    },
    'change .rngRangeAmountdue': function(event) {
        let range = $(event.target).val();
        $(".spWidthAmountdue").html(range + '%');
        $('.lineAmountdue').css('width', range + '%');
    },
    'change .rngRangePaymentAmount': function(event) {
        let range = $(event.target).val();
        $(".spWidthPaymentAmount").html(range + '%');
        $('.linePaymentamount').css('width', range + '%');
    },
    'change .rngRangeOutstandingAmount': function(event) {
        let range = $(event.target).val();
        $(".spWidthOutstandingAmount").html(range + '%');
        $('.lineOutstandingAmount').css('width', range + '%');
    },
    'change .rngRangeComments': function(event) {
        let range = $(event.target).val();
        $(".spWidthComments").html(range + '%');
        $('.colComments').css('width', range + '%');
    },
    'click .btnResetGridSettings': function(event) {
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
                    PrefName: 'tblSupplierPaymentcard'
                });
                if (checkPrefDetails) {
                    CloudPreference.remove({
                        _id: checkPrefDetails._id
                    }, function(err, idTag) {
                        if (err) {} else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .btnSaveGridSettings': function(event) {

        let lineItems = [];
        //let lineItemObj = {};
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
            // var price = $tblrow.find(".lineUnitPrice").text()||0;
            // var taxcode = $tblrow.find(".lineTaxRate").text()||0;

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
                    PrefName: 'tblSupplierPaymentcard'
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
                            PrefName: 'tblSupplierPaymentcard',
                            published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                            //window.open('/invoiceslist','_self');
                        } else {
                            $('#myModal2').modal('toggle');
                            //window.open('/invoiceslist','_self');

                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID,
                        username: clientUsername,
                        useremail: clientEmail,
                        PrefGroup: 'salesform',
                        PrefName: 'tblSupplierPaymentcard',
                        published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                            //window.open('/invoiceslist','_self');
                        } else {
                            $('#myModal2').modal('toggle');
                            //window.open('/invoiceslist','_self');

                        }
                    });

                }
            }
        }
        $('#myModal2').modal('toggle');
    },
    'blur .divcolumn': function(event) {
        let columData = $(event.target).html();
        let columHeaderUpdate = $(event.target).attr("valueupdate");
        $("" + columHeaderUpdate + "").html(columData);

    },
    'click .chkEmailCopy': function(event) {
        $('#edtSupplierEmail').val($('#edtSupplierEmail').val().replace(/\s/g, ''));
        if ($(event.target).is(':checked')) {
            let checkEmailData = $('#edtSupplierEmail').val();
            if (checkEmailData.replace(/\s/g, '') === '') {
                swal('Supplier Email cannot be blank!', '', 'warning');
                event.preventDefault();
            } else {

                function isEmailValid(mailTo) {
                    return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(mailTo);
                };
                if (!isEmailValid(checkEmailData)) {
                    swal('The email field must be a valid email address !', '', 'warning');

                    event.preventDefault();
                    return false;
                } else {}
            }
        } else {}
    }
});
