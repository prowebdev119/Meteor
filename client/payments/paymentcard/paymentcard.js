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
import {AccountService} from "../../accounts/account-service";
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
Template.paymentcard.onCreated(() => {
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
    templateObject.custpaymentid = new ReactiveVar();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.datatablerecords1 = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.selectedAwaitingPayment = new ReactiveVar([]);
});

Template.paymentcard.onRendered(() => {
    const dataTableList = [];
    const tableHeaderList = [];
    $('.fullScreenSpin').css('display', 'inline-block');
    let imageData = (localStorage.getItem("Image"));
    if (imageData) {
        $('.uploadedImage').attr('src', imageData);
    };


    $('#edtCustomerName').attr('readonly', true);
    $('#edtCustomerName').css('background-color', '#eaecf4');
    setTimeout(function() {
        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentcard', function(error, result) {
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
        paymentService.getAllCustomerPaymentData1().then(function(data) {
            if(data.tcustomerpayment.length > 0){
                lastCheque = data.tcustomerpayment[data.tcustomerpayment.length - 1]
                lastBankAccount = lastCheque.AccountName;
                lastDepartment = lastCheque.DeptClassName;
            } else{

            }
            setTimeout(function(){
                  $('#edtSelectBankAccountName').val(lastBankAccount);
                  $('#sltDept').val(lastDepartment);
            },50);
        }).catch(function(err) {
          if(Session.get('bankaccount')){
            $('#edtSelectBankAccountName').val(Session.get('bankaccount'));
          }else{
            $('#edtSelectBankAccountName').val(lastBankAccount);
          };
          $('#sltDept').val(lastDepartment);
        });
    };

    templateObject.getAllClients = function() {
        getVS1Data('TCustomerVS1').then(function(dataObject) {
            if (dataObject.length == 0) {
                clientsService.getClientVS1().then(function(data) {
                    for (let i in data.tcustomervs1) {

                        let customerrecordObj = {
                            customerid: data.tcustomervs1[i].Id || ' ',
                            customername: data.tcustomervs1[i].ClientName || ' ',
                            customeremail: data.tcustomervs1[i].Email || ' ',
                            street: data.tcustomervs1[i].Street || ' ',
                            street2: data.tcustomervs1[i].Street2 || ' ',
                            street3: data.tcustomervs1[i].Street3 || ' ',
                            suburb: data.tcustomervs1[i].Suburb || ' ',
                            statecode: data.tcustomervs1[i].State + ' ' + data.tcustomervs1[i].Postcode || ' ',
                            country: data.tcustomervs1[i].Country || ' '
                        };
                        //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
                        clientList.push(customerrecordObj);

                        //$('#edtCustomerName').editableSelect('add',data.tcustomer[i].ClientName);
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
                        //$('#edtCustomerName').editableSelect('add', clientList[i].customername);
                    }
                    if(jQuery.isEmptyObject( FlowRouter.current().queryParams) == true){
                      setTimeout(function () {
                          $('#edtCustomerName').trigger("click");
                      }, 400);
                    }else{

                    }
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcustomervs1;

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
                    //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
                    clientList.push(customerrecordObj);

                    //$('#edtCustomerName').editableSelect('add',data.tcustomer[i].ClientName);
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
                    //$('#edtCustomerName').editableSelect('add', clientList[i].customername);
                }

                if(jQuery.isEmptyObject( FlowRouter.current().queryParams) == true){
                  setTimeout(function () {
                      $('#edtCustomerName').trigger("click");
                  }, 400);
                }else{

                }
            }
        }).catch(function(err) {
            clientsService.getClientVS1().then(function(data) {
                for (let i in data.tcustomervs1) {

                    let customerrecordObj = {
                        customerid: data.tcustomervs1[i].Id || ' ',
                        customername: data.tcustomervs1[i].ClientName || ' ',
                        customeremail: data.tcustomervs1[i].Email || ' ',
                        street: data.tcustomervs1[i].Street || ' ',
                        street2: data.tcustomervs1[i].Street2 || ' ',
                        street3: data.tcustomervs1[i].Street3 || ' ',
                        suburb: data.tcustomervs1[i].Suburb || ' ',
                        statecode: data.tcustomervs1[i].State + ' ' + data.tcustomervs1[i].Postcode || ' ',
                        country: data.tcustomervs1[i].Country || ' '
                    };
                    //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
                    clientList.push(customerrecordObj);

                    //$('#edtCustomerName').editableSelect('add',data.tcustomer[i].ClientName);
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
                    //  $('#edtCustomerName').editableSelect('add', clientList[i].customername);
                }

                if(jQuery.isEmptyObject( FlowRouter.current().queryParams) == true){
                  setTimeout(function () {
                      $('#edtCustomerName').trigger("click");
                  }, 400);
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

    function MakeNegative() {
        $('td').each(function() {
            if ($(this).text().indexOf('-' + Currency) >= 0)
                $(this).addClass('text-danger')
        });
    };
    // $('#tblcustomerAwaitingPayment').DataTable();
    let customerName = $('#edtCustomerName').val()||'';
    templateObject.getAllCustomerPaymentData = function(customerName) {
      var splashArrayAwaitingCustList = new Array();

      sideBarService.getAllAwaitingCustomerPaymentByCustomerName(customerName).then(function(data) {
          let lineItems = [];
          let lineItemObj = {};
          let totalPaidCal = 0;

          for (let i = 0; i < data.tsaleslist.length; i++) {
              let amount = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].TotalAmountinc) || 0.00;
              let applied = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].Payment) || 0.00;
              // Currency+''+data.tsaleslist[i].TotalTax.toLocaleString(undefined, {minimumFractionDigits: 2});
              let balance = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].BalanceBalance) || 0.00;
              let totalPaid = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].Balance) || 0.00;
              let totalOutstanding = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].Balance) || 0.00;
              let totalOrginialAmount = utilityService.modifynegativeCurrencyFormat(data.tsaleslist[i].TotalAmountinc) || 0.00;


              if (data.tsaleslist[i].Balance != 0) {

                      var dataListOLD = {
                        id: data.tsaleslist[i].SaleId || '',
                          sortdate: data.tsaleslist[i].SaleDate != '' ? moment(data.tsaleslist[i].SaleDate).format("YYYY/MM/DD") : data.tsaleslist[i].SaleDate,
                          paymentdate: data.tsaleslist[i].SaleDate != '' ? moment(data.tsaleslist[i].SaleDate).format("DD/MM/YYYY") : data.tsaleslist[i].SaleDate,
                          customername: data.tsaleslist[i].CustomerName || '',
                          paymentamount: amount || 0.00,
                          applied: applied || 0.00,
                          balance: balance || 0.00,
                          originalamount: totalOrginialAmount || 0.00,
                          outsandingamount: totalOutstanding || 0.00,
                          // bankaccount: data.tinvoiceex[i].GLAccountName || '',
                          department: data.tsaleslist[i].ClassName || '',
                          refno: data.tsaleslist[i].BORef || '',
                          paymentmethod: data.tsaleslist[i].PaymentMethodName || '',
                          notes: data.tsaleslist[i].Comments || ''
                      };


                      var dataList = [
                         '<div class="custom-control custom-checkbox chkBox pointer"><input class="custom-control-input chkBox chkPaymentCard pointer" type="checkbox" id="formCheck-'+data.tsaleslist[i].SaleId+'" value="'+totalOutstanding+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.tsaleslist[i].SaleId+'"></label></div>',
                          data.tsaleslist[i].SaleDate != '' ? moment(data.tsaleslist[i].SaleDate).format("YYYY/MM/DD") : data.tsaleslist[i].SaleDate,
                          data.tsaleslist[i].SaleDate != '' ? moment(data.tsaleslist[i].SaleDate).format("DD/MM/YYYY") : data.tsaleslist[i].SaleDate,
                          data.tsaleslist[i].BORef || '',
                          data.tsaleslist[i].SaleId || '',
                          amount || 0.00,
                          applied || 0.00,
                          // totalOrginialAmount || 0.00,
                          totalOutstanding || 0.00,
                          data.tsaleslist[i].CustomerName || '',
                          'Invoice',
                          data.tsaleslist[i].Comments || ''
                      ];

                      //&& (data.tpurchaseorder[i].Invoiced == true)
                          //if ((data.tsaleslist[i].Deleted == false)) {
                              if(data.tsaleslist[i].CustomerName == customerName){
                              dataTableList.push(dataListOLD);
                              splashArrayAwaitingCustList.push(dataList);
                            }
                          //}

              }
          }
          templateObject.datatablerecords.set(dataTableList);
          templateObject.datatablerecords1.set(dataTableList);

          $('.fullScreenSpin').css('display', 'none');
          setTimeout(function() {
              //$.fn.dataTable.moment('DD/MM/YY');
              $('#tblcustomerAwaitingPayment').DataTable({
                  data: splashArrayAwaitingCustList,
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
                      className: "colSaleNumber",
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
                      className: "colCustomerName",
                      "targets": [8],    // this will invoke the below function on all cells
                      'createdCell': function(td, cellData, rowData, row, col) {
                        // this will give each cell an ID
                        $(td).closest('tr').attr('id', rowData[4]);
                        $(td).attr('id', 'colCustomerName' + rowData[4]);
                      }
                  }, {
                      className: "colTypePayment hiddenColumn",
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
                      filename: "Awaiting Customer Payments List - " + moment().format(),
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
                      title: 'Customer Payment',
                      filename: "Awaiting Customer Payments List - " + moment().format(),
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
                      $('#tblcustomerAwaitingPayment').DataTable().ajax.reload();
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
        if(customerName != ''){
        templateObject.getAllCustomerPaymentData(customerName);
        }
    }, 500)

    $(document).on("click", "#departmentList tbody tr", function(e) {
        $('#sltDept').val($(this).find(".colDeptName").text());
        $('#departmentModal').modal('toggle');
    });

    $(document).on("click", "#paymentmethodList tbody tr", function(e) {
        $('#sltPaymentMethod').val($(this).find(".colName").text());
        $('#paymentMethodModal').modal('toggle');
    });

    $(document).on("click", "#tblCustomerlist tbody tr", function(e) {
        let customers = templateObject.clientrecords.get();
        var tableCustomer = $(this);
        let $tblrows = $("#tblPaymentcard tbody tr");
        $('#edtCustomerName').val(tableCustomer.find(".colCompany").text());
        // $('#edtCustomerName').attr("custid", tableCustomer.find(".colID").text());
        $('#customerListModal').modal('toggle');

        $('#edtCustomerEmail').val(tableCustomer.find(".colEmail").text());
        $('#edtCustomerEmail').attr('customerid', tableCustomer.find(".colID").text());


        let postalAddress = tableCustomer.find(".colCompany").text() + '\n' + tableCustomer.find(".colStreetAddress").text() + '\n' + tableCustomer.find(".colCity").text() + ' ' + tableCustomer.find(".colState").text() + ' ' + tableCustomer.find(".colZipCode").text() + '\n' + tableCustomer.find(".colCountry").text();
        $('#txabillingAddress').val(postalAddress);

        let selectedCustomer = $('#edtCustomerName').val();
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
        // if (clientList) {
        //     $('#edtCustomerEmail').val(clientList[i].customeremail);
        //     $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
        //     let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
        //     $('#txabillingAddress').val(postalAddress);
        // }


        $('#tblCustomerlist_filter .form-control-sm').val('');
        setTimeout(function() {
            $('.btnRefreshCustomer').trigger('click');
            $('.fullScreenSpin').css('display', 'none');
        }, 1000);
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

    $('#sltPaymentMethod').editableSelect();
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

    $('#sltDept').editableSelect();
    $('#sltDept').editableSelect()
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

    $('#edtCustomerName').editableSelect()
        .on('click.editable-select', function(e, li) {
            let selectedCustomer = li.text();
            if (clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    if (clientList[i].customername == selectedCustomer) {
                        $('#edtCustomerEmail').val(clientList[i].customeremail);
                        $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                        let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                        $('#txabillingAddress').val(postalAddress);
                    }
                }
            }
        });

    $('#edtCustomerName').editableSelect()
        .on('click.editable-select', function(e, li) {
            var $earch = $(this);
            var offset = $earch.offset();
            var customerDataName = e.target.value || '';
            $('#edtCustomerPOPID').val('');
            // var customerDataID = $('#edtCustom3erName').attr('custid').replace(/\s/g, '') ||'';
            if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
                $('#customerListModal').modal();
                setTimeout(function() {
                    $('#tblCustomerlist_filter .form-control-sm').focus();
                    $('#tblCustomerlist_filter .form-control-sm').val('');
                    $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblCustomerlist').DataTable();
                    datatable.draw();
                    $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                }, 500);
            } else {
                if (customerDataName.replace(/\s/g, '') != '') {
                    //FlowRouter.go('/customerscard?name=' + e.target.value);
                    $('#edtCustomerPOPID').val('');
                    getVS1Data('TCustomerVS1').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getOneCustomerDataExByName(customerDataName).then(function(data) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                $('#add-customer-title').text('Edit Customer');
                                let popCustomerID = data.tcustomer[0].fields.ID || '';
                                let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                                let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                                let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                                let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                                let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                                let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                                let popCustomertfn = '' || '';
                                let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                                let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                                let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                                let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                                let popCustomerURL = data.tcustomer[0].fields.URL || '';
                                let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                                let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                                let popCustomerState = data.tcustomer[0].fields.State || '';
                                let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                                let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                                let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                                let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                                let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                                let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                                let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                                let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                                let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                                let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                                let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                                let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                                let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                                let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                                let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                                let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                                let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                                let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                                let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                                let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                                let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                                let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                                $('#edtCustomerCompany').val(popCustomerName);
                                $('#edtCustomerPOPID').val(popCustomerID);
                                $('#edtCustomerPOPEmail').val(popCustomerEmail);
                                $('#edtTitle').val(popCustomerTitle);
                                $('#edtFirstName').val(popCustomerFirstName);
                                $('#edtMiddleName').val(popCustomerMiddleName);
                                $('#edtLastName').val(popCustomerLastName);
                                $('#edtCustomerPhone').val(popCustomerPhone);
                                $('#edtCustomerMobile').val(popCustomerMobile);
                                $('#edtCustomerFax').val(popCustomerFaxnumber);
                                $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                                $('#edtCustomerWebsite').val(popCustomerURL);
                                $('#edtCustomerShippingAddress').val(popCustomerStreet);
                                $('#edtCustomerShippingCity').val(popCustomerStreet2);
                                $('#edtCustomerShippingState').val(popCustomerState);
                                $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                                $('#sedtCountry').val(popCustomerCountry);
                                $('#txaNotes').val(popCustomernotes);
                                $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                                $('#sltTermsPOP').val(popCustomerterms);
                                $('#sltCustomerType').val(popCustomerType);
                                $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                                $('#edtCustomeField1').val(popCustomercustfield1);
                                $('#edtCustomeField2').val(popCustomercustfield2);
                                $('#edtCustomeField3').val(popCustomercustfield3);
                                $('#edtCustomeField4').val(popCustomercustfield4);

                                $('#sltTaxCode').val(popCustomerTaxCode);

                                if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                                    (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                                    (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                                    $('#chkSameAsShipping2').attr("checked", "checked");
                                }

                                if (data.tcustomer[0].fields.IsSupplier == true) {
                                    // $('#isformcontractor')
                                    $('#chkSameAsSupplier').attr("checked", "checked");
                                } else {
                                    $('#chkSameAsSupplier').removeAttr("checked");
                                }

                                setTimeout(function() {
                                    $('#addCustomerModal').modal('show');
                                }, 200);
                            }).catch(function(err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tcustomervs1;

                            var added = false;
                            for (let i = 0; i < data.tcustomervs1.length; i++) {
                                if (data.tcustomervs1[i].fields.ClientName === customerDataName) {
                                    let lineItems = [];
                                    added = true;
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('#add-customer-title').text('Edit Customer');
                                    let popCustomerID = data.tcustomervs1[i].fields.ID || '';
                                    let popCustomerName = data.tcustomervs1[i].fields.ClientName || '';
                                    let popCustomerEmail = data.tcustomervs1[i].fields.Email || '';
                                    let popCustomerTitle = data.tcustomervs1[i].fields.Title || '';
                                    let popCustomerFirstName = data.tcustomervs1[i].fields.FirstName || '';
                                    let popCustomerMiddleName = data.tcustomervs1[i].fields.CUSTFLD10 || '';
                                    let popCustomerLastName = data.tcustomervs1[i].fields.LastName || '';
                                    let popCustomertfn = '' || '';
                                    let popCustomerPhone = data.tcustomervs1[i].fields.Phone || '';
                                    let popCustomerMobile = data.tcustomervs1[i].fields.Mobile || '';
                                    let popCustomerFaxnumber = data.tcustomervs1[i].fields.Faxnumber || '';
                                    let popCustomerSkypeName = data.tcustomervs1[i].fields.SkypeName || '';
                                    let popCustomerURL = data.tcustomervs1[i].fields.URL || '';
                                    let popCustomerStreet = data.tcustomervs1[i].fields.Street || '';
                                    let popCustomerStreet2 = data.tcustomervs1[i].fields.Street2 || '';
                                    let popCustomerState = data.tcustomervs1[i].fields.State || '';
                                    let popCustomerPostcode = data.tcustomervs1[i].fields.Postcode || '';
                                    let popCustomerCountry = data.tcustomervs1[i].fields.Country || LoggedCountry;
                                    let popCustomerbillingaddress = data.tcustomervs1[i].fields.BillStreet || '';
                                    let popCustomerbcity = data.tcustomervs1[i].fields.BillStreet2 || '';
                                    let popCustomerbstate = data.tcustomervs1[i].fields.BillState || '';
                                    let popCustomerbpostalcode = data.tcustomervs1[i].fields.BillPostcode || '';
                                    let popCustomerbcountry = data.tcustomervs1[i].fields.Billcountry || LoggedCountry;
                                    let popCustomercustfield1 = data.tcustomervs1[i].fields.CUSTFLD1 || '';
                                    let popCustomercustfield2 = data.tcustomervs1[i].fields.CUSTFLD2 || '';
                                    let popCustomercustfield3 = data.tcustomervs1[i].fields.CUSTFLD3 || '';
                                    let popCustomercustfield4 = data.tcustomervs1[i].fields.CUSTFLD4 || '';
                                    let popCustomernotes = data.tcustomervs1[i].fields.Notes || '';
                                    let popCustomerpreferedpayment = data.tcustomervs1[i].fields.PaymentMethodName || '';
                                    let popCustomerterms = data.tcustomervs1[i].fields.TermsName || '';
                                    let popCustomerdeliverymethod = data.tcustomervs1[i].fields.ShippingMethodName || '';
                                    let popCustomeraccountnumber = data.tcustomervs1[i].fields.ClientNo || '';
                                    let popCustomerisContractor = data.tcustomervs1[i].fields.Contractor || false;
                                    let popCustomerissupplier = data.tcustomervs1[i].fields.IsSupplier || false;
                                    let popCustomeriscustomer = data.tcustomervs1[i].fields.IsCustomer || false;
                                    let popCustomerTaxCode = data.tcustomervs1[i].fields.TaxCodeName || '';
                                    let popCustomerDiscount = data.tcustomervs1[i].fields.Discount || 0;
                                    let popCustomerType = data.tcustomervs1[i].fields.ClientTypeName || '';
                                    $('#edtCustomerCompany').val(popCustomerName);
                                    $('#edtCustomerPOPID').val(popCustomerID);
                                    $('#edtCustomerPOPEmail').val(popCustomerEmail);
                                    $('#edtTitle').val(popCustomerTitle);
                                    $('#edtFirstName').val(popCustomerFirstName);
                                    $('#edtMiddleName').val(popCustomerMiddleName);
                                    $('#edtLastName').val(popCustomerLastName);
                                    $('#edtCustomerPhone').val(popCustomerPhone);
                                    $('#edtCustomerMobile').val(popCustomerMobile);
                                    $('#edtCustomerFax').val(popCustomerFaxnumber);
                                    $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                                    $('#edtCustomerWebsite').val(popCustomerURL);
                                    $('#edtCustomerShippingAddress').val(popCustomerStreet);
                                    $('#edtCustomerShippingCity').val(popCustomerStreet2);
                                    $('#edtCustomerShippingState').val(popCustomerState);
                                    $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                                    $('#sedtCountry').val(popCustomerCountry);
                                    $('#txaNotes').val(popCustomernotes);
                                    $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                                    $('#sltTermsPOP').val(popCustomerterms);
                                    $('#sltCustomerType').val(popCustomerType);
                                    $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                                    $('#edtCustomeField1').val(popCustomercustfield1);
                                    $('#edtCustomeField2').val(popCustomercustfield2);
                                    $('#edtCustomeField3').val(popCustomercustfield3);
                                    $('#edtCustomeField4').val(popCustomercustfield4);

                                    $('#sltTaxCode').val(popCustomerTaxCode);

                                    if ((data.tcustomervs1[i].fields.Street == data.tcustomervs1[i].fields.BillStreet) && (data.tcustomervs1[i].fields.Street2 == data.tcustomervs1[i].fields.BillStreet2) &&
                                        (data.tcustomervs1[i].fields.State == data.tcustomervs1[i].fields.BillState) && (data.tcustomervs1[i].fields.Postcode == data.tcustomervs1[i].fields.BillPostcode) &&
                                        (data.tcustomervs1[i].fields.Country == data.tcustomervs1[i].fields.Billcountry)) {
                                        $('#chkSameAsShipping2').attr("checked", "checked");
                                    }

                                    if (data.tcustomervs1[i].fields.IsSupplier == true) {
                                        // $('#isformcontractor')
                                        $('#chkSameAsSupplier').attr("checked", "checked");
                                    } else {
                                        $('#chkSameAsSupplier').removeAttr("checked");
                                    }

                                    setTimeout(function() {
                                        $('#addCustomerModal').modal('show');
                                    }, 200);

                                }
                            }
                            if (!added) {
                                $('.fullScreenSpin').css('display', 'inline-block');
                                sideBarService.getOneCustomerDataExByName(customerDataName).then(function(data) {
                                    $('.fullScreenSpin').css('display', 'none');
                                    let lineItems = [];
                                    $('#add-customer-title').text('Edit Customer');
                                    let popCustomerID = data.tcustomer[0].fields.ID || '';
                                    let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                                    let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                                    let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                                    let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                                    let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                                    let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                                    let popCustomertfn = '' || '';
                                    let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                                    let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                                    let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                                    let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                                    let popCustomerURL = data.tcustomer[0].fields.URL || '';
                                    let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                                    let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                                    let popCustomerState = data.tcustomer[0].fields.State || '';
                                    let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                                    let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                                    let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                                    let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                                    let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                                    let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                                    let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                                    let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                                    let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                                    let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                                    let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                                    let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                                    let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                                    let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                                    let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                                    let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                                    let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                                    let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                                    let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                                    let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                                    let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                                    let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                                    $('#edtCustomerCompany').val(popCustomerName);
                                    $('#edtCustomerPOPID').val(popCustomerID);
                                    $('#edtCustomerPOPEmail').val(popCustomerEmail);
                                    $('#edtTitle').val(popCustomerTitle);
                                    $('#edtFirstName').val(popCustomerFirstName);
                                    $('#edtMiddleName').val(popCustomerMiddleName);
                                    $('#edtLastName').val(popCustomerLastName);
                                    $('#edtCustomerPhone').val(popCustomerPhone);
                                    $('#edtCustomerMobile').val(popCustomerMobile);
                                    $('#edtCustomerFax').val(popCustomerFaxnumber);
                                    $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                                    $('#edtCustomerWebsite').val(popCustomerURL);
                                    $('#edtCustomerShippingAddress').val(popCustomerStreet);
                                    $('#edtCustomerShippingCity').val(popCustomerStreet2);
                                    $('#edtCustomerShippingState').val(popCustomerState);
                                    $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                                    $('#sedtCountry').val(popCustomerCountry);
                                    $('#txaNotes').val(popCustomernotes);
                                    $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                                    $('#sltTermsPOP').val(popCustomerterms);
                                    $('#sltCustomerType').val(popCustomerType);
                                    $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                                    $('#edtCustomeField1').val(popCustomercustfield1);
                                    $('#edtCustomeField2').val(popCustomercustfield2);
                                    $('#edtCustomeField3').val(popCustomercustfield3);
                                    $('#edtCustomeField4').val(popCustomercustfield4);

                                    $('#sltTaxCode').val(popCustomerTaxCode);

                                    if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                                        (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                                        (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                                        $('#chkSameAsShipping2').attr("checked", "checked");
                                    }

                                    if (data.tcustomer[0].fields.IsSupplier == true) {
                                        // $('#isformcontractor')
                                        $('#chkSameAsSupplier').attr("checked", "checked");
                                    } else {
                                        $('#chkSameAsSupplier').removeAttr("checked");
                                    }

                                    setTimeout(function() {
                                        $('#addCustomerModal').modal('show');
                                    }, 200);
                                }).catch(function(err) {
                                    $('.fullScreenSpin').css('display', 'none');
                                });
                            }
                        }
                    }).catch(function(err) {
                        sideBarService.getOneCustomerDataExByName(customerDataName).then(function(data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            $('#add-customer-title').text('Edit Customer');
                            let popCustomerID = data.tcustomer[0].fields.ID || '';
                            let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                            let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                            let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                            let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                            let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                            let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                            let popCustomertfn = '' || '';
                            let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                            let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                            let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                            let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                            let popCustomerURL = data.tcustomer[0].fields.URL || '';
                            let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                            let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                            let popCustomerState = data.tcustomer[0].fields.State || '';
                            let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                            let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                            let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                            let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                            let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                            let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                            let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                            let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                            let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                            let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                            let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                            let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                            let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                            let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                            let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                            let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                            let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                            let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                            let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                            let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                            let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                            let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                            $('#edtCustomerCompany').val(popCustomerName);
                            $('#edtCustomerPOPID').val(popCustomerID);
                            $('#edtCustomerPOPEmail').val(popCustomerEmail);
                            $('#edtTitle').val(popCustomerTitle);
                            $('#edtFirstName').val(popCustomerFirstName);
                            $('#edtMiddleName').val(popCustomerMiddleName);
                            $('#edtLastName').val(popCustomerLastName);
                            $('#edtCustomerPhone').val(popCustomerPhone);
                            $('#edtCustomerMobile').val(popCustomerMobile);
                            $('#edtCustomerFax').val(popCustomerFaxnumber);
                            $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                            $('#edtCustomerWebsite').val(popCustomerURL);
                            $('#edtCustomerShippingAddress').val(popCustomerStreet);
                            $('#edtCustomerShippingCity').val(popCustomerStreet2);
                            $('#edtCustomerShippingState').val(popCustomerState);
                            $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                            $('#sedtCountry').val(popCustomerCountry);
                            $('#txaNotes').val(popCustomernotes);
                            $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                            $('#sltTermsPOP').val(popCustomerterms);
                            $('#sltCustomerType').val(popCustomerType);
                            $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                            $('#edtCustomeField1').val(popCustomercustfield1);
                            $('#edtCustomeField2').val(popCustomercustfield2);
                            $('#edtCustomeField3').val(popCustomercustfield3);
                            $('#edtCustomeField4').val(popCustomercustfield4);

                            $('#sltTaxCode').val(popCustomerTaxCode);

                            if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                                (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                                (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                                $('#chkSameAsShipping2').attr("checked", "checked");
                            }

                            if (data.tcustomer[0].fields.IsSupplier == true) {
                                // $('#isformcontractor')
                                $('#chkSameAsSupplier').attr("checked", "checked");
                            } else {
                                $('#chkSameAsSupplier').removeAttr("checked");
                            }

                            setTimeout(function() {
                                $('#addCustomerModal').modal('show');
                            }, 200);
                        }).catch(function(err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    });
                } else {
                    $('#customerListModal').modal();
                    setTimeout(function() {
                        $('#tblCustomerlist_filter .form-control-sm').focus();
                        $('#tblCustomerlist_filter .form-control-sm').val('');
                        $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                        var datatable = $('#tblCustomerlist').DataTable();
                        datatable.draw();
                        $('#tblCustomerlist_filter .form-control-sm').trigger("input");
                    }, 500);
                }
            }


        });

    var url = FlowRouter.current().path;
    if (url.indexOf('?id=') > 0) {
        $("#addRow").attr("disabled", true);
        var getsale_id = url.split('?id=');
        var currentSalesID = getsale_id[getsale_id.length - 1];
        if (getsale_id[1]) {
            currentSalesID = parseInt(currentSalesID);
            getVS1Data('TCustomerPayment1').then(function(dataObject) {
                if (dataObject.length == 0) {
                    paymentService.getOneCustomerPayment(currentSalesID).then(function(data) {
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
                                let amountDue = Currency + '' + data.fields.Lines[i].fields.AmountDue.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let paymentAmt = Currency + '' + data.fields.Lines[i].fields.Payment.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let outstandingAmt = Currency + '' + data.fields.Lines[i].fields.AmountOutstanding.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let originalAmt = Currency + '' + data.fields.Lines[i].fields.OriginalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });

                                lineItemObj = {
                                    //lid:data.fields.Lines[i].fields.ID || '',
                                    id: data.fields.Lines[i].fields.ID || '',
                                    invoiceid: data.fields.Lines[i].fields.TransNo || '',
                                    transid: data.fields.Lines[i].fields.TransNo || '',
                                    invoicedate: data.fields.Lines[i].fields.Date != '' ? moment(data.fields.Lines[i].fields.Date).format("DD/MM/YYYY") : data.fields.Lines[i].fields.Date,
                                    refno: data.fields.Lines[i].fields.RefNo || '',
                                    transtype: data.fields.Lines[i].fields.TrnType || '',
                                    amountdue: amountDue || 0,
                                    paymentamount: paymentAmt || 0,
                                    ouststandingamount: outstandingAmt,
                                    orginalamount: originalAmt,
                                    comments: ''
                                };
                                lineItems.push(lineItemObj);
                            }
                        } else {
                            let amountDue = Currency + '' + data.fields.Lines.fields.AmountDue.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let paymentAmt = Currency + '' + data.fields.Lines.fields.Payment.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let outstandingAmt = Currency + '' + data.fields.Lines.fields.AmountOutstanding.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let originalAmt = Currency + '' + data.fields.Lines.fields.OriginalAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            lineItemObj = {
                                id: data.fields.Lines.fields.ID || '',
                                invoiceid: data.fields.Lines.fields.InvoiceId || '',
                                transid: data.fields.Lines.fields.InvoiceNo || '',
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
                        $('#edtCustomerName').val(data.fields.CompanyName);
                        $('#edtSelectBankAccountName').val(data.fields.AccountName);
                        $('#sltPaymentMethod').val(data.fields.PaymentMethodName);


                        $('#edtCustomerName').attr('readonly', true);
                        $('#edtCustomerName').css('background-color', '#eaecf4');

                        // $('#edtCustomerEmail').attr('readonly', true);

                        $('#edtPaymentAmount').attr('readonly', true);

                        $('#edtSelectBankAccountName').attr('disabled', 'disabled');
                        $('#edtSelectBankAccountName').attr('readonly', true);

                        $('.ui-datepicker-trigger').css('pointer-events', 'none');
                        $('#dtPaymentDate').attr('readonly', true);

                        $('#sltPaymentMethod').attr('disabled', 'disabled');
                        $('#sltPaymentMethod').attr('readonly', true);

                        $('#sltDepartment').attr('disabled', 'disabled');
                        $('#sltDepartment').attr('readonly', true);
                        //setTimeout(function () {
                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentcard', function(error, result) {
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
                        //}, 500);
                        setTimeout(function() {
                            $('.tblPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
                        }, 1000);

                        // $('#edtBankAccountName').val(data.fields.AccountName);
                        $('#edtBankAccountName').append('<option value="' + data.fields.AccountName + '" selected="selected">' + data.fields.AccountName + '</option>');
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
                        $('#sltDepartment').append('<option value="' + data.fields.DeptClassName + '" selected="selected">' + data.fields.DeptClassName + '</option>');
                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].customername == data.fields.CompanyName) {
                                    $('#edtCustomerEmail').val(clientList[i].customeremail);
                                    $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                    let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                    $('#txabillingAddress').val(postalAddress);
                                }
                            }
                        }
                        $('.fullScreenSpin').css('display', 'none');
                    });
                } else {
                    let data = JSON.parse(dataObject[0].data);
                    let useData = data.tcustomerpayment;

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
                                    let amountDue = Currency + '' + useData[d].fields.Lines[i].fields.AmountDue.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let paymentAmt = Currency + '' + useData[d].fields.Lines[i].fields.Payment.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let outstandingAmt = Currency + '' + useData[d].fields.Lines[i].fields.AmountOutstanding.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let originalAmt = Currency + '' + useData[d].fields.Lines[i].fields.OriginalAmount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });

                                    lineItemObj = {
                                        //lid:useData[d].fields.Lines[i].fields.ID || '',
                                        id: useData[d].fields.Lines[i].fields.ID || '',
                                        invoiceid: useData[d].fields.Lines[i].fields.TransNo || '',
                                        transid: useData[d].fields.Lines[i].fields.TransNo || '',
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
                                let amountDue = Currency + '' + useData[d].fields.Lines.fields.AmountDue.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let paymentAmt = Currency + '' + useData[d].fields.Lines.fields.Payment.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let outstandingAmt = Currency + '' + useData[d].fields.Lines.fields.AmountOutstanding.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let originalAmt = Currency + '' + useData[d].fields.Lines.fields.OriginalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                lineItemObj = {
                                    id: useData[d].fields.Lines.fields.ID || '',
                                    invoiceid: useData[d].fields.Lines.fields.InvoiceId || '',
                                    transid: useData[d].fields.Lines.fields.InvoiceNo || '',
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
                            $('#edtCustomerName').val(useData[d].fields.CompanyName);
                            $('#sltDept').val(useData[d].fields.DeptClassName);
                            $('#edtSelectBankAccountName').val(useData[d].fields.AccountName);
                            $('#sltPaymentMethod').val(useData[d].fields.PaymentMethodName);


                            $('#edtCustomerName').attr('readonly', true);
                            $('#edtCustomerName').css('background-color', '#eaecf4');

                            // $('#edtCustomerEmail').attr('readonly', true);

                            $('#edtPaymentAmount').attr('readonly', true);

                            $('#edtSelectBankAccountName').attr('disabled', 'disabled');
                            $('#edtSelectBankAccountName').attr('readonly', true);

                            $('.ui-datepicker-trigger').css('pointer-events', 'none');
                            $('#dtPaymentDate').attr('readonly', true);

                            $('#sltPaymentMethod').attr('disabled', 'disabled');
                            $('#sltPaymentMethod').attr('readonly', true);

                            $('#sltDepartment').attr('disabled', 'disabled');
                            $('#sltDepartment').attr('readonly', true);
                            //setTimeout(function () {
                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentcard', function(error, result) {
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
                            //}, 500);
                            setTimeout(function() {
                                $('.tblPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
                            }, 1000);

                            // $('#edtBankAccountName').val(useData[d].fields.AccountName);
                            $('#edtBankAccountName').append('<option value="' + useData[d].fields.AccountName + '" selected="selected">' + useData[d].fields.AccountName + '</option>');
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
                            $('#sltDepartment').append('<option value="' + useData[d].fields.DeptClassName + '" selected="selected">' + useData[d].fields.DeptClassName + '</option>');
                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].customername == useData[d].fields.CompanyName) {
                                        $('#edtCustomerEmail').val(clientList[i].customeremail);
                                        $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                        let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                        $('#txabillingAddress').val(postalAddress);
                                    }
                                }
                            }
                        }

                    }

                    if (!added) {
                        paymentService.getOneCustomerPayment(currentSalesID).then(function(data) {
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
                                    let amountDue = Currency + '' + data.fields.Lines[i].fields.AmountDue.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let paymentAmt = Currency + '' + data.fields.Lines[i].fields.Payment.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let outstandingAmt = Currency + '' + data.fields.Lines[i].fields.AmountOutstanding.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });
                                    let originalAmt = Currency + '' + data.fields.Lines[i].fields.OriginalAmount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2
                                    });

                                    lineItemObj = {
                                        //lid:data.fields.Lines[i].fields.ID || '',
                                        id: data.fields.Lines[i].fields.ID || '',
                                        invoiceid: data.fields.Lines[i].fields.TransNo || '',
                                        transid: data.fields.Lines[i].fields.TransNo || '',
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
                                let amountDue = Currency + '' + data.fields.Lines.fields.AmountDue.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let paymentAmt = Currency + '' + data.fields.Lines.fields.Payment.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let outstandingAmt = Currency + '' + data.fields.Lines.fields.AmountOutstanding.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let originalAmt = Currency + '' + data.fields.Lines.fields.OriginalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                lineItemObj = {
                                    id: data.fields.Lines.fields.ID || '',
                                    invoiceid: data.fields.Lines.fields.InvoiceId || '',
                                    transid: data.fields.Lines.fields.InvoiceNo || '',
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
                            $('#edtCustomerName').val(data.fields.CompanyName);
                            $('#edtSelectBankAccountName').val(data.fields.AccountName);
                            $('#sltPaymentMethod').val(data.fields.PaymentMethodName);


                            $('#edtCustomerName').attr('readonly', true);
                            $('#edtCustomerName').css('background-color', '#eaecf4');

                            // $('#edtCustomerEmail').attr('readonly', true);

                            $('#edtPaymentAmount').attr('readonly', true);

                            $('#edtSelectBankAccountName').attr('disabled', 'disabled');
                            $('#edtSelectBankAccountName').attr('readonly', true);

                            $('.ui-datepicker-trigger').css('pointer-events', 'none');
                            $('#dtPaymentDate').attr('readonly', true);

                            $('#sltPaymentMethod').attr('disabled', 'disabled');
                            $('#sltPaymentMethod').attr('readonly', true);

                            $('#sltDepartment').attr('disabled', 'disabled');
                            $('#sltDepartment').attr('readonly', true);
                            //setTimeout(function () {
                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentcard', function(error, result) {
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
                            //}, 500);
                            setTimeout(function() {
                                $('.tblPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
                            }, 1000);

                            // $('#edtBankAccountName').val(data.fields.AccountName);
                            $('#edtBankAccountName').append('<option value="' + data.fields.AccountName + '" selected="selected">' + data.fields.AccountName + '</option>');
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
                            $('#sltDepartment').append('<option value="' + data.fields.DeptClassName + '" selected="selected">' + data.fields.DeptClassName + '</option>');
                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].customername == data.fields.CompanyName) {
                                        $('#edtCustomerEmail').val(clientList[i].customeremail);
                                        $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
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
                paymentService.getOneCustomerPayment(currentSalesID).then(function(data) {
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
                            let amountDue = Currency + '' + data.fields.Lines[i].fields.AmountDue.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let paymentAmt = Currency + '' + data.fields.Lines[i].fields.Payment.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let outstandingAmt = Currency + '' + data.fields.Lines[i].fields.AmountOutstanding.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let originalAmt = Currency + '' + data.fields.Lines[i].fields.OriginalAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });

                            lineItemObj = {
                                //lid:data.fields.Lines[i].fields.ID || '',
                                id: data.fields.Lines[i].fields.ID || '',
                                invoiceid: data.fields.Lines[i].fields.TransNo || '',
                                transid: data.fields.Lines[i].fields.TransNo || '',
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
                        let amountDue = Currency + '' + data.fields.Lines.fields.AmountDue.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let paymentAmt = Currency + '' + data.fields.Lines.fields.Payment.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let outstandingAmt = Currency + '' + data.fields.Lines.fields.AmountOutstanding.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let originalAmt = Currency + '' + data.fields.Lines.fields.OriginalAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        lineItemObj = {
                            id: data.fields.Lines.fields.ID || '',
                            invoiceid: data.fields.Lines.fields.InvoiceId || '',
                            transid: data.fields.Lines.fields.InvoiceNo || '',
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
                    $('#edtCustomerName').val(data.fields.CompanyName);
                    $('#edtSelectBankAccountName').val(data.fields.AccountName);
                    $('#sltPaymentMethod').val(data.fields.PaymentMethodName);


                    $('#edtCustomerName').attr('readonly', true);
                    $('#edtCustomerName').css('background-color', '#eaecf4');
                    // $('#edtCustomerEmail').attr('readonly', true);

                    $('#edtPaymentAmount').attr('readonly', true);

                    $('#edtSelectBankAccountName').attr('disabled', 'disabled');
                    $('#edtSelectBankAccountName').attr('readonly', true);

                    $('.ui-datepicker-trigger').css('pointer-events', 'none');
                    $('#dtPaymentDate').attr('readonly', true);

                    $('#sltPaymentMethod').attr('disabled', 'disabled');
                    $('#sltPaymentMethod').attr('readonly', true);

                    $('#sltDepartment').attr('disabled', 'disabled');
                    $('#sltDepartment').attr('readonly', true);
                    //setTimeout(function () {
                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentcard', function(error, result) {
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
                    //}, 500);
                    setTimeout(function() {
                        $('.tblPaymentcard > tbody > tr > td').attr('contenteditable', 'false');
                    }, 1000);

                    // $('#edtBankAccountName').val(data.fields.AccountName);
                    $('#edtBankAccountName').append('<option value="' + data.fields.AccountName + '" selected="selected">' + data.fields.AccountName + '</option>');
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
                    $('#sltDepartment').append('<option value="' + data.fields.DeptClassName + '" selected="selected">' + data.fields.DeptClassName + '</option>');
                    if (clientList) {
                        for (var i = 0; i < clientList.length; i++) {
                            if (clientList[i].customername == data.fields.CompanyName) {
                                $('#edtCustomerEmail').val(clientList[i].customeremail);
                                $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                $('#txabillingAddress').val(postalAddress);
                            }
                        }
                    }
                    $('.fullScreenSpin').css('display', 'none');
                });
            });

        }

        $('#tblPaymentcard tbody').on('click', 'tr .colType', function() {
            var listData = $(this).closest('tr').attr('id');
            if (listData) {
                window.open('/invoicecard?id=' + listData, '_self');
            }
        });
    } else if (url.indexOf('?soid=') > 0) {

        var getsale_id = url.split('?soid=');
        var currentSalesID = getsale_id[getsale_id.length - 1];
        if (getsale_id[1]) {
            currentSalesID = parseInt(currentSalesID);
            paymentService.getOneSalesOrderPayment(currentSalesID).then(function(data) {
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
                let amountDue = Currency + '' + data.fields.TotalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                let paymentAmt = Currency + '' + data.fields.TotalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                let outstandingAmt = Currency + '' + data.fields.TotalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                let originalAmt = Currency + '' + data.fields.TotalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                lineItemObj = {
                    id: data.fields.ID || '',
                    invoiceid: data.fields.ID || '',
                    transid: data.fields.ID || '',
                    invoicedate: data.fields.SaleDate != '' ? moment(data.fields.SaleDate).format("DD/MM/YYYY") : data.fields.SaleDate,
                    refno: data.fields.ReferenceNo || '',
                    amountdue: amountDue || 0,
                    paymentamount: paymentAmt || 0,
                    ouststandingamount: outstandingAmt,
                    orginalamount: originalAmt,
                    comments: data.fields.Comments || ''
                };
                lineItems.push(lineItemObj);
                let record = {
                    lid: '',
                    customerName: data.fields.CustomerName || '',
                    paymentDate: begunDate,
                    reference: data.fields.ReferenceNo || ' ',
                    bankAccount: data.fields.GLAccountName || '',
                    paymentAmount: appliedAmt || 0,
                    notes: data.fields.Comments,
                    LineItems: lineItems,
                    checkpayment: data.fields.PayMethod,
                    department: data.fields.DeptClassName,
                    applied: appliedAmt.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    })

                };
                templateObject.record.set(record);

                $('#edtCustomerName').val(data.fields.CustomerName);
                $('#sltPaymentMethod').val(data.fields.PayMethod);
                $('#sltDept').val(data.fields.DeptClassName);
                $('#edtSelectBankAccountName').val(data.fields.GLAccountName);
                if (clientList) {
                    for (var i = 0; i < clientList.length; i++) {
                        if (clientList[i].customername == data.fields.CustomerName) {
                            $('#edtCustomerEmail').val(clientList[i].customeremail);
                            $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                            let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                            $('#txabillingAddress').val(postalAddress);
                        }
                    }
                }
                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentcard', function(error, result) {
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

        $('#tblPaymentcard tbody').on('click', 'tr .colType', function() {
            var listData = $(this).closest('tr').attr('id');
            if (listData) {
                window.open('/salesordercard?id=' + listData, '_self');
            }
        });
    } else if (url.indexOf('?quoteid=') > 0) {

        var getsale_id = url.split('?quoteid=');
        var currentSalesID = getsale_id[getsale_id.length - 1];
        if (getsale_id[1]) {
            currentSalesID = parseInt(currentSalesID);
            paymentService.getOneQuotePayment(currentSalesID).then(function(data) {
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
                let amountDue = Currency + '' + data.fields.TotalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                let paymentAmt = Currency + '' + data.fields.TotalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                let outstandingAmt = Currency + '' + data.fields.TotalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                let originalAmt = Currency + '' + data.fields.TotalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                lineItemObj = {
                    id: data.fields.ID || '',
                    invoiceid: data.fields.ID || '',
                    transid: data.fields.ID || '',
                    invoicedate: data.fields.SaleDate != '' ? moment(data.fields.SaleDate).format("DD/MM/YYYY") : data.fields.SaleDate,
                    refno: data.fields.ReferenceNo || '',
                    amountdue: amountDue || 0,
                    paymentamount: paymentAmt || 0,
                    ouststandingamount: outstandingAmt,
                    orginalamount: originalAmt,
                    comments: data.fields.Comments || ''
                };
                lineItems.push(lineItemObj);
                let record = {
                    lid: '',
                    customerName: data.fields.CustomerName || '',
                    paymentDate: begunDate,
                    reference: data.fields.ReferenceNo || ' ',
                    bankAccount: data.fields.GLAccountName || '',
                    paymentAmount: appliedAmt || 0,
                    notes: data.fields.Comments,
                    LineItems: lineItems,
                    checkpayment: data.fields.PayMethod,
                    department: data.fields.DeptClassName,
                    applied: appliedAmt.toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    })

                };
                templateObject.record.set(record);
                $('#edtCustomerName').val(data.fields.CustomerName);
                $('#sltPaymentMethod').val(data.fields.PayMethod);
                $('#sltDept').val(data.fields.DeptClassName);
                $('#edtSelectBankAccountName').val(data.fields.GLAccountName);
                if (clientList) {
                    for (var i = 0; i < clientList.length; i++) {
                        if (clientList[i].customername == data.fields.CustomerName) {
                            $('#edtCustomerEmail').val(clientList[i].customeremail);
                            $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                            let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                            $('#txabillingAddress').val(postalAddress);
                        }
                    }
                }
                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentcard', function(error, result) {
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

        $('#tblPaymentcard tbody').on('click', 'tr .colType', function() {
            var listData = $(this).closest('tr').attr('id');
            if (listData) {
                window.open('/quotecard?id=' + listData, '_self');
            }
        });
    } else if (url.indexOf('?invid=') > 0) {

        var getsale_id = url.split('?invid=');
        var currentSalesID = getsale_id[getsale_id.length - 1];
        if (getsale_id[1]) {
            currentSalesID = parseInt(currentSalesID);
            getVS1Data('TInvoiceEx').then(function(dataObject) {
                if (dataObject.length == 0) {
                    paymentService.getOneInvoicePayment(currentSalesID).then(function(data) {
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
                        let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        // Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
                        let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                            minimumFractionDigits: 2
                        });
                        // Currency+''+data.fields.TotalAmountInc.toLocaleString(undefined, {minimumFractionDigits: 2});
                        lineItemObj = {
                            id: data.fields.ID || '',
                            invoiceid: data.fields.ID || '',
                            transid: data.fields.ID || '',
                            invoicedate: data.fields.SaleDate != '' ? moment(data.fields.SaleDate).format("DD/MM/YYYY") : data.fields.SaleDate,
                            refno: data.fields.ReferenceNo || '',
                            transtype: "Invoice" || '',
                            amountdue: amountDue || 0,
                            paymentamount: paymentAmt || 0,
                            ouststandingamount: outstandingAmt,
                            orginalamount: originalAmt,
                            comments: data.fields.Comments || ''
                        };
                        lineItems.push(lineItemObj);
                        let record = {
                            lid: '',
                            customerName: data.fields.CustomerName || '',
                            paymentDate: begunDate,
                            reference: data.fields.ReferenceNo || ' ',
                            bankAccount: Session.get('bankaccount') || data.fields.GLAccountName || '',
                            paymentAmount: appliedAmt || 0,
                            notes: data.fields.Comments,
                            LineItems: lineItems,
                            checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                            department: Session.get('department') || data.fields.DeptClassName,
                            applied: appliedAmt.toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            })

                        };

                        let getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod || 'Cash';
                        $('#sltPaymentMethod').val(getPaymentMethodVal);

                        let getDepartmentVal = Session.get('department') || data.fields.DeptClassName || defaultDept;
                        templateObject.record.set(record);
                        $('#edtCustomerName').val(data.fields.CustomerName);
                        $('#sltDept').val(getDepartmentVal);
                        let bankAccountData = Session.get('bankaccount')||'Bank';
                        $('#edtSelectBankAccountName').val(bankAccountData);
                        templateObject.getLastPaymentData();
                        if (clientList) {
                            for (var i = 0; i < clientList.length; i++) {
                                if (clientList[i].customername == data.fields.CustomerName) {
                                    $('#edtCustomerEmail').val(clientList[i].customeremail);
                                    $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                    let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                    $('#txabillingAddress').val(postalAddress);
                                }
                            }
                        }
                        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentcard', function(error, result) {
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
                    let useData = data.tinvoiceex;

                    var added = false;
                    for (let d = 0; d < useData.length; d++) {
                        if (parseInt(useData[d].fields.ID) === currentSalesID) {
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
                            let amountDue = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            // Currency+''+useData[d].fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
                            let paymentAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let outstandingAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalBalance).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            let originalAmt = utilityService.modifynegativeCurrencyFormat(useData[d].fields.TotalAmountInc).toLocaleString(undefined, {
                                minimumFractionDigits: 2
                            });
                            // Currency+''+useData[d].fields.TotalAmountInc.toLocaleString(undefined, {minimumFractionDigits: 2});
                            lineItemObj = {
                                id: useData[d].fields.ID || '',
                                invoiceid: useData[d].fields.ID || '',
                                transid: useData[d].fields.ID || '',
                                invoicedate: useData[d].fields.SaleDate != '' ? moment(useData[d].fields.SaleDate).format("DD/MM/YYYY") : useData[d].fields.SaleDate,
                                refno: useData[d].fields.ReferenceNo || '',
                                transtype: "Invoice" || '',
                                amountdue: amountDue || 0,
                                paymentamount: paymentAmt || 0,
                                ouststandingamount: outstandingAmt,
                                orginalamount: originalAmt,
                                comments: useData[d].fields.Comments || ''
                            };
                            lineItems.push(lineItemObj);
                            let record = {
                                lid: '',
                                customerName: useData[d].fields.CustomerName || '',
                                paymentDate: begunDate,
                                reference: useData[d].fields.ReferenceNo || ' ',
                                bankAccount: Session.get('bankaccount') || useData[d].fields.GLAccountName || '',
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

                            $('#edtCustomerName').val(useData[d].fields.CustomerName);
                            let getPaymentMethodVal = Session.get('paymentmethod') || useData[d].fields.PayMethod;
                            $('#sltPaymentMethod').val(getPaymentMethodVal);
                            $('#sltDept').val(getDepartmentVal);
                            let bankAccountData = Session.get('bankaccount')||'Bank';
                            $('#edtSelectBankAccountName').val(bankAccountData);
                            templateObject.getLastPaymentData();
                            if (clientList) {
                                for (var i = 0; i < clientList.length; i++) {
                                    if (clientList[i].customername == useData[d].fields.CustomerName) {
                                        $('#edtCustomerEmail').val(clientList[i].customeremail);
                                        $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                        let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                        $('#txabillingAddress').val(postalAddress);
                                    }
                                }
                            }
                            Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentcard', function(error, result) {
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
                      paymentService.getOneInvoicePayment(currentSalesID).then(function(data) {
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
                          let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                              minimumFractionDigits: 2
                          });
                          // Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
                          let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                              minimumFractionDigits: 2
                          });
                          let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                              minimumFractionDigits: 2
                          });
                          let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                              minimumFractionDigits: 2
                          });
                          // Currency+''+data.fields.TotalAmountInc.toLocaleString(undefined, {minimumFractionDigits: 2});
                          lineItemObj = {
                              id: data.fields.ID || '',
                              invoiceid: data.fields.ID || '',
                              transid: data.fields.ID || '',
                              invoicedate: data.fields.SaleDate != '' ? moment(data.fields.SaleDate).format("DD/MM/YYYY") : data.fields.SaleDate,
                              refno: data.fields.ReferenceNo || '',
                              transtype: "Invoice" || '',
                              amountdue: amountDue || 0,
                              paymentamount: paymentAmt || 0,
                              ouststandingamount: outstandingAmt,
                              orginalamount: originalAmt,
                              comments: data.fields.Comments || ''
                          };
                          lineItems.push(lineItemObj);
                          let record = {
                              lid: '',
                              customerName: data.fields.CustomerName || '',
                              paymentDate: begunDate,
                              reference: data.fields.ReferenceNo || ' ',
                              bankAccount: Session.get('bankaccount') || data.fields.GLAccountName || '',
                              paymentAmount: appliedAmt || 0,
                              notes: data.fields.Comments,
                              LineItems: lineItems,
                              checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                              department: Session.get('department') || data.fields.DeptClassName,
                              applied: appliedAmt.toLocaleString(undefined, {
                                  minimumFractionDigits: 2
                              })

                          };

                          let getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod || 'Cash';
                          $('#sltPaymentMethod').val(getPaymentMethodVal);

                          let getDepartmentVal = Session.get('department') || data.fields.DeptClassName || defaultDept;
                          templateObject.record.set(record);
                          $('#edtCustomerName').val(data.fields.CustomerName);
                          $('#sltDept').val(getDepartmentVal);
                          let bankAccountData = Session.get('bankaccount')||'Bank';
                          $('#edtSelectBankAccountName').val(bankAccountData);
                          templateObject.getLastPaymentData();
                          if (clientList) {
                              for (var i = 0; i < clientList.length; i++) {
                                  if (clientList[i].customername == data.fields.CustomerName) {
                                      $('#edtCustomerEmail').val(clientList[i].customeremail);
                                      $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                      let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                      $('#txabillingAddress').val(postalAddress);
                                  }
                              }
                          }
                          Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentcard', function(error, result) {
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
                paymentService.getOneInvoicePayment(currentSalesID).then(function(data) {
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
                    let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    // Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
                    let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    });
                    // Currency+''+data.fields.TotalAmountInc.toLocaleString(undefined, {minimumFractionDigits: 2});
                    lineItemObj = {
                        id: data.fields.ID || '',
                        invoiceid: data.fields.ID || '',
                        transid: data.fields.ID || '',
                        invoicedate: data.fields.SaleDate != '' ? moment(data.fields.SaleDate).format("DD/MM/YYYY") : data.fields.SaleDate,
                        refno: data.fields.ReferenceNo || '',
                        transtype: "Invoice" || '',
                        amountdue: amountDue || 0,
                        paymentamount: paymentAmt || 0,
                        ouststandingamount: outstandingAmt,
                        orginalamount: originalAmt,
                        comments: data.fields.Comments || ''
                    };
                    lineItems.push(lineItemObj);
                    let record = {
                        lid: '',
                        customerName: data.fields.CustomerName || '',
                        paymentDate: begunDate,
                        reference: data.fields.ReferenceNo || ' ',
                        bankAccount: Session.get('bankaccount') || data.fields.GLAccountName || '',
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

                    $('#edtCustomerName').val(data.fields.CustomerName);
                    let getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod || 'Cash';
                    $('#sltPaymentMethod').val(getPaymentMethodVal);
                    $('#sltDept').val(getDepartmentVal);
                    let bankAccountData = Session.get('bankaccount')||'Bank';
                    $('#edtSelectBankAccountName').val(bankAccountData);
                    if (clientList) {
                        for (var i = 0; i < clientList.length; i++) {
                            if (clientList[i].customername == data.fields.CustomerName) {
                                $('#edtCustomerEmail').val(clientList[i].customeremail);
                                $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                $('#txabillingAddress').val(postalAddress);
                            }
                        }
                    }
                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentcard', function(error, result) {
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

        $('#tblPaymentcard tbody').on('click', 'tr .colType', function() {
            var listData = $(this).closest('tr').attr('id');
            if (listData) {
                window.open('/invoicecard?id=' + listData, '_self');
            }
        });
    } else if ((url.indexOf('?custname=') > 0) && (url.indexOf('from=') > 0)) {
        var getsale_custname = url.split('?custname=');
        var currentSalesURL = getsale_custname[getsale_custname.length - 1].split("&");

        var getsale_salesid = url.split('from=');
        var currentSalesID = getsale_salesid[getsale_salesid.length - 1].split('#')[0];

        if (getsale_custname[1]) {
            let currentSalesName = currentSalesURL[0].replace(/%20/g, " ");
            // let currentSalesID = currentSalesURL[1].split('from=');
            paymentService.getCustomerPaymentByName(currentSalesName).then(function(data) {
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

                for (let i = 0; i < data.tcustomerpayment.length; i++) {
                    if (data.tcustomerpayment[i].fields.Lines && data.tcustomerpayment[i].fields.Lines.length) {
                        for (let j = 0; j < data.tcustomerpayment[i].fields.Lines.length; j++) {
                            if (data.tcustomerpayment[i].fields.Lines[j].fields.TransNo == currentSalesID) {
                                companyName = data.tcustomerpayment[i].fields.CompanyName;
                                referenceNo = data.tcustomerpayment[i].fields.ReferenceNo;
                                paymentMethodName = data.tcustomerpayment[i].fields.PaymentMethodName;
                                accountName = data.tcustomerpayment[i].fields.AccountName;
                                notes = data.tcustomerpayment[i].fields.Notes;
                                paymentdate = data.tcustomerpayment[i].fields.PaymentDate;
                                checkpayment = data.tcustomerpayment[i].fields.PaymentMethodName;
                                department = data.tcustomerpayment[i].fields.DeptClassName;
                                appliedAmt = utilityService.modifynegativeCurrencyFormat(data.tcustomerpayment[i].fields.Applied).toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                templateObject.custpaymentid.set(data.tcustomerpayment[i].fields.ID);

                                let amountDue = Currency + '' + data.tcustomerpayment[i].fields.Lines[j].fields.AmountDue.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let paymentAmt = Currency + '' + data.tcustomerpayment[i].fields.Lines[j].fields.Payment.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let outstandingAmt = Currency + '' + data.tcustomerpayment[i].fields.Lines[j].fields.AmountOutstanding.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });
                                let originalAmt = Currency + '' + data.tcustomerpayment[i].fields.Lines[j].fields.OriginalAmount.toLocaleString(undefined, {
                                    minimumFractionDigits: 2
                                });

                                lineItemObj = {
                                    id: data.tcustomerpayment[i].fields.Lines[j].fields.ID || '',
                                    invoiceid: data.tcustomerpayment[i].fields.Lines[j].fields.ID || '',
                                    transid: data.tcustomerpayment[i].fields.Lines[j].fields.ID || '',
                                    invoicedate: data.tcustomerpayment[i].fields.Lines[j].fields.Date != '' ? moment(data.tcustomerpayment[i].fields.Lines[j].fields.Date).format("DD/MM/YYYY") : data.tcustomerpayment[i].fields.Lines[j].fields.Date,
                                    refno: data.tcustomerpayment[i].fields.Lines[j].fields.RefNo || '',
                                    transtype: "Invoice" || '',
                                    amountdue: amountDue || 0,
                                    paymentamount: paymentAmt || 0,
                                    ouststandingamount: outstandingAmt,
                                    orginalamount: originalAmt,
                                    comments: notes || ''
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

                let getPaymentMethodVal = Session.get('paymentmethod') || checkpayment || 'Cash';
                $('#sltPaymentMethod').val(getPaymentMethodVal);
                $('#edtCustomerName').val(companyName);
                let bankAccountData = Session.get('bankaccount')|| accountName||'Bank';
                $('#edtSelectBankAccountName').val(bankAccountData);

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
                /*
                let total = utilityService.modifynegativeCurrencyFormat(data.fields.Amount).toLocaleString(undefined, {minimumFractionDigits: 2});
                let appliedAmt = utilityService.modifynegativeCurrencyFormat(data.fields.Applied).toLocaleString(undefined, {minimumFractionDigits: 2});

                if (data.fields.Lines.length) {
                for (let i = 0; i < data.fields.Lines.length; i++) {
                let amountDue = Currency+''+data.fields.Lines[i].fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
                let paymentAmt = Currency+''+data.fields.Lines[i].fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
                let outstandingAmt = Currency+''+data.fields.Lines[i].fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
                let originalAmt = Currency+''+data.fields.Lines[i].fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});

                lineItemObj = {
                id: data.fields.Lines[i].fields.ID || '',
                invoiceid: data.fields.Lines[i].fields.ID || '',
                transid: data.fields.Lines[i].fields.ID || '',
                invoicedate: data.fields.Lines[i].fields.Date !=''? moment(data.fields.Lines[i].fields.Date).format("DD/MM/YYYY"): data.fields.Lines[i].fields.Date,
                refno: data.fields.Lines[i].fields.RefNo || '',
                amountdue: amountDue || 0,
                paymentamount: paymentAmt || 0,
                ouststandingamount:outstandingAmt,
                orginalamount:originalAmt
                };
                lineItems.push(lineItemObj);
                }
                }else {
                let amountDue = Currency+''+data.fields.Lines.fields.AmountDue.toLocaleString(undefined, {minimumFractionDigits: 2});
                let paymentAmt =  Currency+''+data.fields.Lines.fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2});
                let outstandingAmt = Currency+''+data.fields.Lines.fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
                let originalAmt = Currency+''+data.fields.Lines.fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2});
                lineItemObj = {
                id: data.fields.Lines.fields.ID || '',
                invoiceid: data.fields.Lines.fields.InvoiceId || '',
                transid: data.fields.Lines.fields.InvoiceNo || '',
                invoicedate: data.fields.Lines.fields.Date !=''? moment(data.fields.Lines.fields.Date).format("DD/MM/YYYY"): data.fields.Lines.fields.Date,
                refno: data.fields.Lines.fields.RefNo || '',
                amountdue: amountDue || 0,
                paymentamount: paymentAmt || 0,
                ouststandingamount:outstandingAmt,
                orginalamount:originalAmt
                };
                lineItems.push(lineItemObj);
                }

                $('#edtCustomerName').val(data.fields.CompanyName);
                $('#edtBankAccountName').val(data.fields.AccountName);
                if(clientList){
                for (var i = 0; i < clientList.length; i++) {
                if(clientList[i].customername == data.fields.CustomerName){
                $('#edtCustomerEmail').val(clientList[i].customeremail);
                $('#edtCustomerEmail').attr('customerid',clientList[i].customerid);
                }
                }
                }
                 */

                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentcard', function(error, result) {
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
    } else if (url.indexOf('?customername=') > 0) {

        var getsale_id = url.split('?customername=');
        var currentSalesName = getsale_id[getsale_id.length - 1];
        if (getsale_id[1]) {
            currentSalesName = currentSalesName;
            paymentService.getCustomerSalesPayment(currentSalesName).then(function(data) {
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
                let amountDue = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                // Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
                let paymentAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                let outstandingAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                let originalAmt = utilityService.modifynegativeCurrencyFormat(data.fields.TotalAmountInc).toLocaleString(undefined, {
                    minimumFractionDigits: 2
                });
                // Currency+''+data.fields.TotalAmountInc.toLocaleString(undefined, {minimumFractionDigits: 2});
                lineItemObj = {
                    id: data.fields.ID || '',
                    invoiceid: data.fields.ID || '',
                    transid: data.fields.ID || '',
                    invoicedate: data.fields.SaleDate != '' ? moment(data.fields.SaleDate).format("DD/MM/YYYY") : data.fields.SaleDate,
                    refno: data.fields.ReferenceNo || '',
                    transtype: "Invoice" || '',
                    amountdue: amountDue || 0,
                    paymentamount: paymentAmt || 0,
                    ouststandingamount: outstandingAmt,
                    orginalamount: originalAmt,
                    comments: data.fields.Comments || ''
                };
                lineItems.push(lineItemObj);
                let record = {
                    lid: '',
                    customerName: data.fields.CustomerName || '',
                    paymentDate: begunDate,
                    reference: data.fields.ReferenceNo || ' ',
                    bankAccount: Session.get('bankaccount') || data.fields.GLAccountName || '',
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

                $('#edtCustomerName').val(data.fields.CustomerName);

                let getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod || 'Cash';
                $('#sltPaymentMethod').val(getPaymentMethodVal);

                $('#sltDept').val(getDepartmentVal);
                let bankAccountData = Session.get('bankaccount')||'Bank';
                $('#edtSelectBankAccountName').val(bankAccountData);
                if (clientList) {
                    for (var i = 0; i < clientList.length; i++) {
                        if (clientList[i].customername == data.fields.CustomerName) {
                            $('#edtCustomerEmail').val(clientList[i].customeremail);
                            $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                            let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                            $('#txabillingAddress').val(postalAddress);
                        }
                    }
                }
                Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentcard', function(error, result) {
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

        $('#tblPaymentcard tbody').on('click', 'tr .colType', function() {
            var listData = $(this).closest('tr').attr('id');
            if (listData) {
                window.open('/invoicecard?id=' + listData, '_self');
            }
        });
    } else if (url.indexOf('?selectcust=') > 0) {

        var getsale_id = url.split('?selectcust=');
        var currentSalesID = getsale_id[getsale_id.length - 1];
        if (getsale_id[1]) {
            let lineItems = [];
            let lineItemObj = {};
            let amountData = 0;
            var arr = currentSalesID.split(',');
            for (let i = 0; i < arr.length; i++) {

                currentSalesID = parseInt(arr[i]);

                paymentService.getOneInvoicePayment(currentSalesID).then(function(data) {

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
                    // Currency+''+data.fields.TotalBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
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
                    // Currency+''+data.fields.TotalAmountInc.toLocaleString(undefined, {minimumFractionDigits: 2});
                    lineItemObj = {
                        id: data.fields.ID || '',
                        invoiceid: data.fields.ID || '',
                        transid: data.fields.ID || '',
                        invoicedate: data.fields.SaleDate != '' ? moment(data.fields.SaleDate).format("DD/MM/YYYY") : data.fields.SaleDate,
                        refno: data.fields.ReferenceNo || '',
                        transtype: "Invoice" || '',
                        amountdue: amountDue || 0,
                        paymentamount: paymentAmt || 0,
                        ouststandingamount: outstandingAmt,
                        orginalamount: originalAmt,
                        comments: data.fields.Comments || ''
                    };
                    lineItems.push(lineItemObj);
                    let record = {
                        lid: '',
                        customerName: data.fields.CustomerName || '',
                        paymentDate: begunDate,
                        reference: data.fields.ReferenceNo || ' ',
                        bankAccount: Session.get('bankaccount') || data.fields.GLAccountName || '',
                        paymentAmount: utilityService.modifynegativeCurrencyFormat(amountData) || 0,
                        notes: data.fields.Comments,
                        LineItems: lineItems,
                        checkpayment: Session.get('paymentmethod') || data.fields.PayMethod,
                        department: Session.get('department') || data.fields.DeptClassName,
                        applied: utilityService.modifynegativeCurrencyFormat(amountData) || 0

                    };
                    templateObject.record.set(record);
                    let getDepartmentVal = Session.get('department') || data.fields.DeptClassName || defaultDept;

                    let getPaymentMethodVal = Session.get('paymentmethod') || data.fields.PayMethod || 'Cash';
                    $('#sltPaymentMethod').val(getPaymentMethodVal);

                    $('#edtCustomerName').val(data.fields.CustomerName);
                    $('#sltDept').val(getDepartmentVal);
                    let bankAccountData = Session.get('bankaccount')||'Bank';
                    $('#edtSelectBankAccountName').val(bankAccountData);
                    if (clientList) {
                        for (var i = 0; i < clientList.length; i++) {
                            if (clientList[i].customername == data.fields.CustomerName) {
                                $('#edtCustomerEmail').val(clientList[i].customeremail);
                                $('#edtCustomerEmail').attr('customerid', clientList[i].customerid);
                                let postalAddress = clientList[i].customername + '\n' + clientList[i].street + '\n' + clientList[i].street2 + '\n' + clientList[i].street3 + '\n' + clientList[i].suburb + '\n' + clientList[i].statecode + '\n' + clientList[i].country;
                                $('#txabillingAddress').val(postalAddress);
                            }
                        }
                    }
                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblPaymentcard', function(error, result) {
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

        $('#tblPaymentcard tbody').on('click', 'tr .colType', function() {
            var listData = $(this).closest('tr').attr('id');
            if (listData) {
                window.open('/invoicecard?id=' + listData, '_self');
            }
        });
    } else {
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

        $('#edtCustomerName').val('');
        $('#edtCustomerName').attr('readonly', false);
        $('#edtCustomerName').css('background-color', 'rgb(255, 255, 255)');

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
            //     $('#edtCustomerName').trigger("click");
            // }, 500);
        },500);

        $("#form :input").prop("disabled", false);
        templateObject.record.set(paymentrecord);
        let getDepartmentVal = Session.get('department') || defaultDept;

        let getPaymentMethodVal = Session.get('paymentmethod') || '';
        $('#sltPaymentMethod').val(getPaymentMethodVal);
        $('#sltDept').val(getDepartmentVal);
        let bankAccountData = Session.get('bankaccount')||'Bank';
        $('#edtSelectBankAccountName').val(bankAccountData);
        templateObject.getLastPaymentData();

    }

    exportSalesToPdf = function() {
        let margins = {
            top: 0,
            bottom: 0,
            left: 0,
            width: 100
        };
        let id = $('.printID').attr("id");
        var source = document.getElementById('html-2-pdfwrapper');
        let file = "Customer Payment.pdf";
        if ($('.printID').attr('id') != undefined || $('.printID').attr('id') != "") {
            file = 'Customer Payment-' + id + '.pdf';
        }

        var opt = {
            margin: 0,
            filename: file,
            image: {
                type: 'jpeg',
                quality: 0.98
            },
            html2canvas: {
                scale: 2
            },
            jsPDF: {
                unit: 'in',
                format: 'a4',
                orientation: 'portrait'
            }
        };
        html2pdf().set(opt).from(source).save().then(function(dataObject) {
            $('#html-2-pdfwrapper').css('display', 'none');
            $('.fullScreenSpin').css('display', 'none');

        });
        // pdf.addHTML(source, function () {
        //     pdf.save('Customer Payment-'+id+'.pdf');
        //     $('#html-2-pdfwrapper').css('display','none');
        // });
    };

    $(document).ready(function() {
        $('#edtSelectBankAccountName').editableSelect();
        $('#addRow').on('click', function() {
          let custname = $('#edtCustomerName').val()||'';
          if (custname === '') {
              swal('Customer has not been selected!', '', 'warning');
              e.preventDefault();
        } else {
            $(".chkBox").prop("checked", false);
            let paymentList = [''];
            $('.tblPaymentcard tbody tr').each(function() {
                paymentList.push(this.id);

            });

            setTimeout(function() {
              $('.fullScreenSpin').css('display', 'inline-block');
                templateObject.getAllCustomerPaymentData(custname);
            }, 500);

            let geturl = location.href;
            let id = 0;
            if (geturl.indexOf('?invid') > 0 || geturl.indexOf('?selectcust')) {
                geturl = new URL(geturl);
                id = geturl.searchParams.get("invid") || geturl.searchParams.get("selectcust");
            }
            let $tblrows = $("#tblPaymentcard tbody tr");
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
            $('#customerPaymentListModal').modal();
          }
            $('.fullScreenSpin').css('display', 'none');
        })

    });

});

Template.paymentcard.helpers({
    record: () => {
        return Template.instance().record.get();
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
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
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
            PrefName: 'tblPaymentcard'
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

Template.paymentcard.events({
    // 'click #sltDept': function(event) {
    //     $('#departmentModal').modal('toggle');
    // },
    'click .btnSave': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let templateObject = Template.instance();

        let paymentService = new PaymentsService();
        let customer = $("#edtCustomerName").val();
        let paymentAmt = $("#edtPaymentAmount").val();

        var paymentDateTime = new Date($("#dtPaymentDate").datepicker("getDate"));
        let paymentDate = paymentDateTime.getFullYear() + "-" + (paymentDateTime.getMonth() + 1) + "-" + paymentDateTime.getDate();

        let bankAccount = $("#edtSelectBankAccountName").val();
        let reference = $("#edtReference").val();
        let payMethod = $("#sltPaymentMethod").val();
        let notes = $("#txaNotes").val();
        let customerEmail = $("#edtCustomerEmail").val();
        if (payMethod == '') {
            payMethod = "Cash";
        }
        let department = $("#sltDepartment").val();
        let empName = localStorage.getItem('mySession');
        let paymentData = [];
        Session.setPersistent('paymentmethod', payMethod);
        Session.setPersistent('bankaccount', bankAccount);
        Session.setPersistent('department', department);
        var url = FlowRouter.current().path;
        if (url.indexOf('?soid=') > 0) {
            var getsale_id = url.split('?soid=');
            var currentSalesID = getsale_id[getsale_id.length - 1];
            if (getsale_id[1]) {
                currentSalesID = parseInt(currentSalesID);
                $('.tblPaymentcard > tbody > tr').each(function() {
                    var lineID = this.id;
                    let linetype = $('#' + lineID + " .colType").text() || $(this).closest('tr').find('.colType').text();
                    let lineAmountDue = $('#' + lineID + " .lineAmountdue").text() || $(this).closest('tr').find('.lineAmountdue').text();
                    let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val() || $(this).closest('tr').find('.linePaymentamount').val();
                    let Line = {
                        type: 'TGuiCustPaymentLines',
                        fields: {
                            TransType: linetype,
                            // AmountDue: parseFloat(lineAmountDue.replace(/[^0-9.-]+/g,"")) || 0,
                            //EnteredBy:empName || ' ',
                            // InvoiceId:currentSalesID,
                            //RefNo:reference,
                            Paid: true,
                            Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                            TransID: lineID
                        }
                    };
                    paymentData.push(Line);
                });

                let objDetails = {
                    type: "TCustPayments",
                    fields: {
                        // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                        // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                        AccountName: bankAccount,
                        ClientPrintName: customer,
                        CompanyName: customer,
                        EmployeeName: empName || ' ',
                        GUILines: paymentData,
                        Notes: notes,
                        PaymentDate: paymentDate,
                        PayMethodName: payMethod,
                        Payment: true,
                        ReferenceNo: reference,
                        Notes: notes
                    }
                };

                paymentService.saveDepositData(objDetails).then(function(data) {
                    var customerID = $('#edtCustomerEmail').attr('customerid');
                    // Send Email
                    $('#html-2-pdfwrapper').css('display', 'block');
                    $('.pdfCustomerName').html($('#edtCustomerName').val());
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
                                filename: 'Customer Payment ' + invoiceId + '.pdf',
                                content: base64data,
                                encoding: 'base64'
                            };
                            attachment.push(pdfObject);
                            // let mailBody = "VS1 Cloud Test";
                            let erpInvoiceId = objDetails.fields.ID;

                            let mailFromName = Session.get('vs1companyName');
                            let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                            let customerEmailName = $('#edtCustomerName').val();
                            let checkEmailData = $('#edtCustomerEmail').val();
                            // let mailCC = templateObject.mailCopyToUsr.get();
                            let grandtotal = $('#grandTotal').html();
                            let amountDueEmail = $('#totalBalanceDue').html();
                            let emailDueDate = $("#dtDueDate").val();
                            let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                            let mailBody = "Hi " + customerEmailName + ",\n\n Here's Payment " + erpInvoiceId + " for  " + grandtotal + "." +
                                // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
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
                                '                        Please find payment <span>' + erpInvoiceId + '</span> attached below.' +
                                '                    </td>' +
                                '                </tr>' +
                                '                <tr>' +
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
                                        //window.open('/salesorderslist','_self');

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
                                        window.open('/salesorderslist?success=true', '_self');
                                    } else {
                                        $('#html-2-pdfwrapper').css('display', 'none');
                                        swal({
                                            title: 'SUCCESS',
                                            text: "Email Sent To Customer: " + checkEmailData + " and User: " + mailFrom + "",
                                            type: 'success',
                                            showCancelButton: false,
                                            confirmButtonText: 'OK'
                                        }).then((result) => {
                                            if (result.value) {
                                                // window.open('/salesorderslist','_self');
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
                                        //window.open('/salesorderslist','_self');

                                    } else {
                                        $('#html-2-pdfwrapper').css('display', 'none');
                                        swal({
                                            title: 'SUCCESS',
                                            text: "Email Sent To Customer: " + checkEmailData + " ",
                                            type: 'success',
                                            showCancelButton: false,
                                            confirmButtonText: 'OK'
                                        }).then((result) => {
                                            if (result.value) {
                                                //window.open('/salesorderslist','_self');
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
                                        //window.open('/salesorderslist','_self');
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
                                                //window.open('/salesorderslist','_self');
                                            } else if (result.dismiss === 'cancel') {}
                                        });

                                        $('.fullScreenSpin').css('display', 'none');
                                    }
                                });

                            } else {
                                //window.open('/salesorderslist','_self');
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
                            type: "TCustomer",
                            fields: {
                                ID: customerID,
                                Email: customerEmail
                            }
                        }
                        // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
                        //
                        // });
                    };
                    $('.fullScreenSpin').css('display', 'none');
                    // window.open('/salesorderslist','_self');
                }).catch(function(err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            //Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });

            }
        } else if (url.indexOf('?invid=') > 0) {
            var getsale_id = url.split('?invid=');
            var currentSalesID = getsale_id[getsale_id.length - 1];
            if (getsale_id[1]) {
                currentSalesID = parseInt(currentSalesID);
                $('.tblPaymentcard > tbody > tr').each(function() {
                    var lineID = this.id;
                    let linetype = $('#' + lineID + " .colType").text() || $(this).closest('tr').find('.colType').text();
                    let lineAmountDue = $('#' + lineID + " .lineAmountdue").text() || $(this).closest('tr').find('.lineAmountdue').text();
                    let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val() || $(this).closest('tr').find('.linePaymentamount').val();
                    let Line = {
                        type: 'TGuiCustPaymentLines',
                        fields: {
                            TransType: linetype,
                            TransID: lineID,
                            // AmountDue: parseFloat(lineAmountDue.replace(/[^0-9.-]+/g,"")) || 0,
                            //EnteredBy:empName || ' ',
                            // InvoiceId:currentSalesID,
                            //RefNo:reference,
                            Paid: true,
                            Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,

                        }
                    };
                    paymentData.push(Line);
                });
                if (paymentAmt.replace(/[^0-9.-]+/g, "") < 0) {
                    let objDetails = {
                        type: "TCustPayments",
                        fields: {
                            Amount: parseFloat(paymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                            Applied: parseFloat(paymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                            AccountName: bankAccount,
                            ClientPrintName: customer,
                            CompanyName: customer,
                            DeptClassName: department,
                            // EmployeeName: empName || ' ',
                            GUILines: paymentData,
                            Notes: notes,
                            Payment: true,
                            PaymentDate: paymentDate,
                            PayMethodName: payMethod,

                            ReferenceNo: reference

                        }
                    };

                    paymentService.saveDepositData(objDetails).then(function(data) {
                        var customerID = $('#edtCustomerEmail').attr('customerid');
                        // Send Email
                        $('#html-2-pdfwrapper').css('display', 'block');
                        $('.pdfCustomerName').html($('#edtCustomerName').val());
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
                                    filename: 'Customer Payment-' + invoiceId + '.pdf',
                                    content: base64data,
                                    encoding: 'base64'
                                };
                                attachment.push(pdfObject);
                                // let mailBody = "VS1 Cloud Test";
                                let erpInvoiceId = objDetails.fields.ID;

                                let mailFromName = Session.get('vs1companyName');
                                let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                                let customerEmailName = $('#edtCustomerName').val();
                                let checkEmailData = $('#edtCustomerEmail').val();
                                // let mailCC = templateObject.mailCopyToUsr.get();
                                let grandtotal = $('#grandTotal').html();
                                let amountDueEmail = $('#totalBalanceDue').html();
                                let emailDueDate = $("#dtDueDate").val();
                                let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                                let mailBody = "Hi " + customerEmailName + ",\n\n Here's payment " + erpInvoiceId + " for  " + grandtotal + "." +
                                    // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
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
                                    '                        Please find payment <span>' + erpInvoiceId + '</span> attached below.' +
                                    '                    </td>' +
                                    '                </tr>' +
                                    '                <tr>' +
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
                                            FlowRouter.go('/invoicelist?success=true');

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
                                            FlowRouter.go('/invoicelist?success=true');
                                        } else {
                                            $('#html-2-pdfwrapper').css('display', 'none');
                                            swal({
                                                title: 'SUCCESS',
                                                text: "Email Sent To Customer: " + checkEmailData + " and User: " + mailFrom + "",
                                                type: 'success',
                                                showCancelButton: false,
                                                confirmButtonText: 'OK'
                                            }).then((result) => {
                                                if (result.value) {
                                                    FlowRouter.go('/invoicelist?success=true');
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
                                            FlowRouter.go('/invoicelist?success=true');

                                        } else {
                                            $('#html-2-pdfwrapper').css('display', 'none');
                                            swal({
                                                title: 'SUCCESS',
                                                text: "Email Sent To Customer: " + checkEmailData + " ",
                                                type: 'success',
                                                showCancelButton: false,
                                                confirmButtonText: 'OK'
                                            }).then((result) => {
                                                if (result.value) {
                                                    FlowRouter.go('/invoicelist?success=true');
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
                                            FlowRouter.go('/invoicelist?success=true');
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
                                                    FlowRouter.go('/invoicelist?success=true');
                                                } else if (result.dismiss === 'cancel') {}
                                            });

                                            $('.fullScreenSpin').css('display', 'none');
                                        }
                                    });

                                } else {
                                    FlowRouter.go('/invoicelist?success=true');
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
                                type: "TCustomer",
                                fields: {
                                    ID: customerID,
                                    Email: customerEmail
                                }
                            }
                            // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
                            //
                            // });
                        };
                        $('.fullScreenSpin').css('display', 'none');
                        //FlowRouter.go('/paymentoverview?success=true');


                    }).catch(function(err) {
                        // FlowRouter.go('/paymentoverview?success=true');
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                //Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    });
                } else {
                    let objDetails = {
                        type: "TCustPayments",
                        fields: {
                            // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                            // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                            AccountName: bankAccount,
                            ClientPrintName: customer,
                            CompanyName: customer,
                            DeptClassName: department,
                            // EmployeeName: empName || ' ',
                            GUILines: paymentData,
                            Notes: notes,
                            Payment: true,
                            PaymentDate: paymentDate,
                            PayMethodName: payMethod,

                            ReferenceNo: reference

                        }
                    };

                    paymentService.saveDepositData(objDetails).then(function(data) {
                        var customerID = $('#edtCustomerEmail').attr('customerid');
                        // Send Email
                        $('#html-2-pdfwrapper').css('display', 'block');
                        $('.pdfCustomerName').html($('#edtCustomerName').val());
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
                                    filename: 'Customer Payment ' + invoiceId + '.pdf',
                                    content: base64data,
                                    encoding: 'base64'
                                };
                                attachment.push(pdfObject);
                                // let mailBody = "VS1 Cloud Test";
                                let erpInvoiceId = objDetails.fields.ID;

                                let mailFromName = Session.get('vs1companyName');
                                let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                                let customerEmailName = $('#edtCustomerName').val();
                                let checkEmailData = $('#edtCustomerEmail').val();
                                // let mailCC = templateObject.mailCopyToUsr.get();
                                let grandtotal = $('#grandTotal').html();
                                let amountDueEmail = $('#totalBalanceDue').html();
                                let emailDueDate = $("#dtDueDate").val();
                                let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                                let mailBody = "Hi " + customerEmailName + ",\n\n Here's payment " + erpInvoiceId + " for  " + grandtotal + "." +
                                    // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
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
                                    '                        Please find payment <span>' + erpInvoiceId + '</span> attached below.' +
                                    '                    </td>' +
                                    '                </tr>' +
                                    '                <tr>' +
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
                                            FlowRouter.go('/invoicelist?success=true');

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
                                            FlowRouter.go('/invoicelist?success=true');
                                        } else {
                                            $('#html-2-pdfwrapper').css('display', 'none');
                                            swal({
                                                title: 'SUCCESS',
                                                text: "Email Sent To Customer: " + checkEmailData + " and User: " + mailFrom + "",
                                                type: 'success',
                                                showCancelButton: false,
                                                confirmButtonText: 'OK'
                                            }).then((result) => {
                                                if (result.value) {
                                                    FlowRouter.go('/invoicelist?success=true');
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
                                            FlowRouter.go('/invoicelist?success=true');

                                        } else {
                                            $('#html-2-pdfwrapper').css('display', 'none');
                                            swal({
                                                title: 'SUCCESS',
                                                text: "Email Sent To Customer: " + checkEmailData + " ",
                                                type: 'success',
                                                showCancelButton: false,
                                                confirmButtonText: 'OK'
                                            }).then((result) => {
                                                if (result.value) {
                                                    FlowRouter.go('/invoicelist?success=true');
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
                                            FlowRouter.go('/invoicelist?success=true');
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
                                                    FlowRouter.go('/invoicelist?success=true');
                                                } else if (result.dismiss === 'cancel') {}
                                            });

                                            $('.fullScreenSpin').css('display', 'none');
                                        }
                                    });

                                } else {
                                    FlowRouter.go('/invoicelist?success=true');
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
                                type: "TCustomer",
                                fields: {
                                    ID: customerID,
                                    Email: customerEmail
                                }
                            }
                            // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
                            //
                            // });
                        };
                        $('.fullScreenSpin').css('display', 'none');
                        // FlowRouter.go('/paymentoverview?success=true');
                    }).catch(function(err) {
                        // FlowRouter.go('/paymentoverview?success=true');
                        swal({
                            title: 'Oooops...',
                            text: err,
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                //Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        $('.fullScreenSpin').css('display', 'none');
                    });
                }

            }
        } else if (url.indexOf('?quoteid=') > 0) {
            var getsale_id = url.split('?quoteid=');
            var currentSalesID = getsale_id[getsale_id.length - 1];
            if (getsale_id[1]) {
                currentSalesID = parseInt(currentSalesID);
                $('.tblPaymentcard > tbody > tr').each(function() {
                    var lineID = this.id;
                    let linetype = $('#' + lineID + " .colType").text() || $(this).closest('tr').find('.colType').text();
                    let lineAmountDue = $('#' + lineID + " .lineAmountdue").text() || $(this).closest('tr').find('.lineAmountdue').text();
                    let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val() || $(this).closest('tr').find('.linePaymentamount').val();
                    let Line = {
                        type: 'TGuiCustPaymentLines',
                        fields: {
                            TransType: linetype,
                            // AmountDue: parseFloat(lineAmountDue.replace(/[^0-9.-]+/g,"")) || 0,
                            //EnteredBy:empName || ' ',
                            // InvoiceId:currentSalesID,
                            //RefNo:reference,
                            Paid: true,
                            Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                            TransID: lineID
                        }
                    };
                    paymentData.push(Line);
                });

                let objDetails = {
                    type: "TCustPayments",
                    fields: {
                        // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                        // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                        AccountName: bankAccount,
                        ClientPrintName: customer,
                        CompanyName: customer,
                        EmployeeName: empName || ' ',
                        GUILines: paymentData,
                        Notes: notes,
                        PaymentDate: paymentDate,
                        PayMethodName: payMethod,
                        Payment: true,
                        ReferenceNo: reference,
                        Notes: notes
                    }
                };

                paymentService.saveDepositData(objDetails).then(function(data) {
                    var customerID = $('#edtCustomerEmail').attr('customerid');
                    // Send Email
                    $('#html-2-pdfwrapper').css('display', 'block');
                    $('.pdfCustomerName').html($('#edtCustomerName').val());
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
                                filename: 'customerpayment-' + invoiceId + '.pdf',
                                content: base64data,
                                encoding: 'base64'
                            };
                            attachment.push(pdfObject);
                            // let mailBody = "VS1 Cloud Test";
                            let erpInvoiceId = objDetails.fields.ID;

                            let mailFromName = Session.get('vs1companyName');
                            let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                            let customerEmailName = $('#edtCustomerName').val();
                            let checkEmailData = $('#edtCustomerEmail').val();
                            // let mailCC = templateObject.mailCopyToUsr.get();
                            let grandtotal = $('#grandTotal').html();
                            let amountDueEmail = $('#totalBalanceDue').html();
                            let emailDueDate = $("#dtDueDate").val();
                            let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                            let mailBody = "Hi " + customerEmailName + ",\n\n Here's payment " + erpInvoiceId + " for  " + grandtotal + "." +
                                // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
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
                                '                        Please find payment <span>' + erpInvoiceId + '</span> attached below.' +
                                '                    </td>' +
                                '                </tr>' +
                                '                <tr>' +
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
                                        window.open('/invoicelist?success=true', '_self');

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
                                        window.open('/invoicelist?success=true', '_self');
                                    } else {
                                        $('#html-2-pdfwrapper').css('display', 'none');
                                        swal({
                                            title: 'SUCCESS',
                                            text: "Email Sent To Customer: " + checkEmailData + " and User: " + mailFrom + "",
                                            type: 'success',
                                            showCancelButton: false,
                                            confirmButtonText: 'OK'
                                        }).then((result) => {
                                            if (result.value) {
                                                window.open('/invoicelist?success=true', '_self');
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
                                        window.open('/invoicelist?success=true', '_self');

                                    } else {
                                        $('#html-2-pdfwrapper').css('display', 'none');
                                        swal({
                                            title: 'SUCCESS',
                                            text: "Email Sent To Customer: " + checkEmailData + " ",
                                            type: 'success',
                                            showCancelButton: false,
                                            confirmButtonText: 'OK'
                                        }).then((result) => {
                                            if (result.value) {
                                                window.open('/invoicelist?success=true', '_self');
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
                                        window.open('/invoicelist?success=true', '_self');
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
                                                window.open('/invoicelist?success=true', '_self');
                                            } else if (result.dismiss === 'cancel') {}
                                        });

                                        $('.fullScreenSpin').css('display', 'none');
                                    }
                                });

                            } else {
                                window.open('/invoicelist?success=true', '_self');
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
                            type: "TCustomer",
                            fields: {
                                ID: customerID,
                                Email: customerEmail
                            }
                        }
                        // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
                        //
                        // });
                    };
                    $('.fullScreenSpin').css('display', 'none');
                    // window.open('/invoicelist','_self');
                }).catch(function(err) {
                    swal({
                        title: 'Oooops...',
                        text: err,
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            //Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {}
                    });
                    $('.fullScreenSpin').css('display', 'none');
                });

            }

        } else if ((url.indexOf('?custname=') > 0) && (url.indexOf('from=') > 0)) {
            let paymentID = templateObject.custpaymentid.get();
            $('.tblPaymentcard > tbody > tr').each(function() {
                var lineID = this.id;
                let linetype = $('#' + lineID + " .colType").text() || $(this).closest('tr').find('.colType').text();
                let lineAmountDue = $('#' + lineID + " .lineAmountdue").text() || $(this).closest('tr').find('.lineAmountdue').text();
                let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val() || $(this).closest('tr').find('.linePaymentamount').val();
                let Line = {
                    type: 'TGuiCustPaymentLines',
                    fields: {
                        TransType: linetype,
                        TransID: lineID,
                        // AmountDue: parseFloat(lineAmountDue.replace(/[^0-9.-]+/g,"")) || 0,
                        //EnteredBy:empName || ' ',
                        // InvoiceId:currentSalesID,
                        //RefNo:reference,
                        Paid: true,
                        Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                    }
                };
                paymentData.push(Line);
            });

            let objDetails = {
                type: "TCustPayments",
                fields: {
                    // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                    // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                    AccountName: bankAccount,
                    ClientPrintName: customer,
                    CompanyName: customer,
                    DeptClassName: department,
                    // EmployeeName: empName || ' ',
                    GUILines: paymentData,
                    Notes: notes,
                    Payment: true,
                    PaymentDate: paymentDate,
                    PayMethodName: payMethod,

                    ReferenceNo: reference
                }
            };

            paymentService.saveDepositData(objDetails).then(function(data) {
                var customerID = $('#edtCustomerEmail').attr('customerid');
                // Send Email
                $('#html-2-pdfwrapper').css('display', 'block');
                $('.pdfCustomerName').html($('#edtCustomerName').val());
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
                            filename: 'customerpayment-' + invoiceId + '.pdf',
                            content: base64data,
                            encoding: 'base64'
                        };
                        attachment.push(pdfObject);
                        // let mailBody = "VS1 Cloud Test";
                        let erpInvoiceId = objDetails.fields.ID;

                        let mailFromName = Session.get('vs1companyName');
                        let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                        let customerEmailName = $('#edtCustomerName').val();
                        let checkEmailData = $('#edtCustomerEmail').val();
                        // let mailCC = templateObject.mailCopyToUsr.get();
                        let grandtotal = $('#grandTotal').html();
                        let amountDueEmail = $('#totalBalanceDue').html();
                        let emailDueDate = $("#dtDueDate").val();
                        let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                        let mailBody = "Hi " + customerEmailName + ",\n\n Here's payment " + erpInvoiceId + " for  " + grandtotal + "." +
                            // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
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
                            '                        Please find payment <span>' + erpInvoiceId + '</span> attached below.' +
                            '                    </td>' +
                            '                </tr>' +
                            '                <tr>' +
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
                                    FlowRouter.go('/paymentoverview?success=true');

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
                                    FlowRouter.go('/paymentoverview?success=true');
                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Customer: " + checkEmailData + " and User: " + mailFrom + "",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            FlowRouter.go('/paymentoverview?success=true');
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
                                    FlowRouter.go('/paymentoverview?success=true');

                                } else {
                                    $('#html-2-pdfwrapper').css('display', 'none');
                                    swal({
                                        title: 'SUCCESS',
                                        text: "Email Sent To Customer: " + checkEmailData + " ",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        if (result.value) {
                                            FlowRouter.go('/paymentoverview?success=true');
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
                                    FlowRouter.go('/paymentoverview?success=true');
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
                                            FlowRouter.go('/paymentoverview?success=true');
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                    $('.fullScreenSpin').css('display', 'none');
                                }
                            });

                        } else {
                            FlowRouter.go('/paymentoverview?success=true');
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
                        type: "TCustomer",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }
                    // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
                    //
                    // });
                };
                $('.fullScreenSpin').css('display', 'none');
                // FlowRouter.go('/paymentoverview?success=true');
            }).catch(function(err) {
                //FlowRouter.go('/paymentoverview?success=true');
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        //Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                //Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
            });
        } else if ((url.indexOf('?id=') > 0)) {
            var getsale_id = url.split('?id=');
            var currentSalesID = getsale_id[getsale_id.length - 1];
            let paymentID = parseInt(currentSalesID);

            // Send Email
            $('#html-2-pdfwrapper').css('display', 'block');
            $('.pdfCustomerName').html($('#edtCustomerName').val());
            $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
            async function addAttachment() {
                let attachment = [];
                let templateObject = Template.instance();

                let invoiceId = paymentID;
                let encodedPdf = await generatePdfForMail(invoiceId);
                let pdfObject = "";
                var reader = new FileReader();
                reader.readAsDataURL(encodedPdf);
                reader.onloadend = function() {
                    var base64data = reader.result;
                    base64data = base64data.split(',')[1];

                    pdfObject = {
                        filename: 'customerpayment-' + invoiceId + '.pdf',
                        content: base64data,
                        encoding: 'base64'
                    };
                    attachment.push(pdfObject);
                    // let mailBody = "VS1 Cloud Test";
                    let erpInvoiceId = paymentID;

                    let mailFromName = Session.get('vs1companyName');
                    let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                    let customerEmailName = $('#edtCustomerName').val();
                    let checkEmailData = $('#edtCustomerEmail').val();
                    // let mailCC = templateObject.mailCopyToUsr.get();
                    let grandtotal = $('#grandTotal').html();
                    let amountDueEmail = $('#totalBalanceDue').html();
                    let emailDueDate = $("#dtDueDate").val();
                    let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                    let mailBody = "Hi " + customerEmailName + ",\n\n Here's invoice " + erpInvoiceId + " for  " + grandtotal + "." +
                        // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
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
                        '                        Please find payment <span>' + erpInvoiceId + '</span> attached below.' +
                        '                    </td>' +
                        '                </tr>' +
                        '                <tr>' +
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
                                FlowRouter.go('/paymentoverview?success=true');

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
                                FlowRouter.go('/paymentoverview?success=true');
                            } else {
                                $('#html-2-pdfwrapper').css('display', 'none');
                                swal({
                                    title: 'SUCCESS',
                                    text: "Email Sent To Customer: " + checkEmailData + " and User: " + mailFrom + "",
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'OK'
                                }).then((result) => {
                                    if (result.value) {
                                        FlowRouter.go('/paymentoverview?success=true');
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
                                FlowRouter.go('/paymentoverview?success=true');

                            } else {
                                $('#html-2-pdfwrapper').css('display', 'none');
                                swal({
                                    title: 'SUCCESS',
                                    text: "Email Sent To Customer: " + checkEmailData + " ",
                                    type: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'OK'
                                }).then((result) => {
                                    if (result.value) {
                                        FlowRouter.go('/paymentoverview?success=true');
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
                                FlowRouter.go('/paymentoverview?success=true');
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
                                        FlowRouter.go('/paymentoverview?success=true');
                                    } else if (result.dismiss === 'cancel') {}
                                });

                                $('.fullScreenSpin').css('display', 'none');
                            }
                        });

                    } else {
                        FlowRouter.go('/paymentoverview?success=true');
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
            // currentSalesID = parseInt(currentSalesID);
            $('.tblPaymentcard > tbody > tr').each(function() {
                var lineID = this.id;
                let linetype = $('#' + lineID + " .colType").text();
                let lineAmountDue = $('#' + lineID + " .lineAmountdue").text();
                let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val();
                let Line = {
                    type: 'TGuiCustPaymentLines',
                    fields: {
                        TransType: linetype,
                        TransID: lineID,
                        // AmountDue: parseFloat(lineAmountDue.replace(/[^0-9.-]+/g,"")) || 0,
                        //EnteredBy:empName || ' ',
                        // InvoiceId:currentSalesID,
                        //RefNo:reference,
                        Paid: true,
                        Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                    }
                };
                paymentData.push(Line);
            });

            let objDetails = {
                type: "TCustPayments",
                fields: {
                    ID: paymentID,
                    // AccountName:bankAccount,
                    // ClientPrintName:customer,
                    // CompanyName:customer,
                    // DeptClassName: department,
                    Notes: notes,
                    // Payment:true,
                    // PayMethodName: payMethod,
                    ReferenceNo: reference
                }
            };

            paymentService.saveDepositData(objDetails).then(function(data) {
                var customerID = $('#edtCustomerEmail').attr('customerid');

                if (customerID !== " ") {
                    let customerEmailData = {
                        type: "TCustomer",
                        fields: {
                            ID: customerID,
                            Email: customerEmail
                        }
                    }
                    // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
                    //
                    // });
                };
                $('.fullScreenSpin').css('display', 'none');

            }).catch(function(err) {
                // FlowRouter.go('/paymentoverview?success=true');
                // swal({
                // title: 'Oooops...',
                // text: err,
                // type: 'error',
                // showCancelButton: false,
                // confirmButtonText: 'Try Again'
                // }).then((result) => {
                // if (result.value) {
                //  //Meteor._reload.reload();
                // } else if (result.dismiss === 'cancel') {
                //
                // }
                // });
                // $('.fullScreenSpin').css('display','none');
            });
        } else if (url.indexOf('?selectcust=') > 0) {
            var getsale_id = url.split('?selectcust=');
            let allData = [];
            let checkData = [];
            var currentSalesID = getsale_id[getsale_id.length - 1];
            checkData = Session.get('customerpayments') || [];
            if(checkData.length > 0){
            let getPayments = JSON.parse(Session.get('customerpayments') || []);
            if(getPayments.length > 0) {
                allData = getPayments;
            } else {
                allData = [];
            }
        } else {
            allData = [];
        }
            if (getsale_id[1]) {
                // currentSalesID = parseInt(currentSalesID);
                $('.tblPaymentcard > tbody > tr').each(function() {
                    var lineID = this.id;
                    let linetype = $('#' + lineID + " .colType").text() || $(this).closest('tr').find('.colType').text();
                    let lineAmountDue = $('#' + lineID + " .lineAmountdue").text() || $(this).closest('tr').find('.lineAmountdue').text();
                    let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val() || $(this).closest('tr').find('.linePaymentamount').val();
                    let Line = {
                        type: 'TGuiCustPaymentLines',
                        fields: {
                            TransType: linetype,
                            TransID: lineID,
                            // AmountDue: parseFloat(lineAmountDue.replace(/[^0-9.-]+/g,"")) || 0,
                            //EnteredBy:empName || ' ',
                            // InvoiceId:currentSalesID,
                            //RefNo:reference,
                            Paid: true,
                            Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,

                        }
                    };
                    paymentData.push(Line);
                });
                if (paymentAmt.replace(/[^0-9.-]+/g, "") < 0) {
                    let objDetails = {
                        type: "TCustPayments",
                        fields: {
                            Amount: parseFloat(paymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                            Applied: parseFloat(paymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                            AccountName: bankAccount,
                            ClientPrintName: customer,
                            CompanyName: customer,
                            DeptClassName: department,
                            // EmployeeName: empName || ' ',
                            GUILines: paymentData,
                            Notes: notes,
                            Payment: true,
                            PaymentDate: paymentDate,
                            PayMethodName: payMethod,

                            ReferenceNo: reference

                        }
                    };

                    paymentService.saveDepositData(objDetails).then(function(data) {
                        var customerID = $('#edtCustomerEmail').attr('customerid');
                        if(allData.length > 0) {
                            newURL = '/paymentcard?selectcust=' + allData[0].selectCust;
                            allData.shift();
                            Session.setPersistent('customerpayments', JSON.stringify(allData));
                        } else {
                            newURL = '/paymentoverview?success=true';
                            Session.setPersistent('customerpayments', []);
                        }

                        // Send Email
                        $('#html-2-pdfwrapper').css('display', 'block');
                        $('.pdfCustomerName').html($('#edtCustomerName').val());
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
                                    filename: 'customerpayment-' + invoiceId + '.pdf',
                                    content: base64data,
                                    encoding: 'base64'
                                };
                                attachment.push(pdfObject);
                                // let mailBody = "VS1 Cloud Test";
                                let erpInvoiceId = objDetails.fields.ID;

                                let mailFromName = Session.get('vs1companyName');
                                let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                                let customerEmailName = $('#edtCustomerName').val();
                                let checkEmailData = $('#edtCustomerEmail').val();
                                // let mailCC = templateObject.mailCopyToUsr.get();
                                let grandtotal = $('#grandTotal').html();
                                let amountDueEmail = $('#totalBalanceDue').html();
                                let emailDueDate = $("#dtDueDate").val();
                                let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                                let mailBody = "Hi " + customerEmailName + ",\n\n Here's payment " + erpInvoiceId + " for  " + grandtotal + "." +
                                    // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
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
                                    '                        Please find payment <span>' + erpInvoiceId + '</span> attached below.' +
                                    '                    </td>' +
                                    '                </tr>' +
                                    '                <tr>' +
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
                                            window.open(url,'_self');

                                        } else {
                                            window.open(url,'_self');
                                        }
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
                                            FlowRouter.go('/paymentoverview?success=true');
                                        } else {
                                            $('#html-2-pdfwrapper').css('display', 'none');
                                            swal({
                                                title: 'SUCCESS',
                                                text: "Email Sent To Customer: " + checkEmailData + " and User: " + mailFrom + "",
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
                                            FlowRouter.go('/paymentoverview?success=true');

                                        } else {
                                            $('#html-2-pdfwrapper').css('display', 'none');
                                            swal({
                                                title: 'SUCCESS',
                                                text: "Email Sent To Customer: " + checkEmailData + " ",
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
                                            window.open(url,'_self');
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
                                                    window.open(url,'_self');
                                                } else if (result.dismiss === 'cancel') {
                                                    window.open(url,'_self');
                                                }
                                            });

                                            $('.fullScreenSpin').css('display', 'none');
                                        }
                                    });

                                } else {
                                  window.open(url,'_self');
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
                                type: "TCustomer",
                                fields: {
                                    ID: customerID,
                                    Email: customerEmail
                                }
                            }
                            // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
                            //
                            // });
                        };
                        $('.fullScreenSpin').css('display', 'none');
                        // FlowRouter.go('/paymentoverview?success=true');
                    }).catch(function(err) {
                        // FlowRouter.go('/paymentoverview?success=true');
                        if(allData.length > 0) {
                            newURL = '/paymentcard?selectcust=' + allData[0].selectCust;
                            allData.shift();
                            Session.setPersistent('customerpayments', JSON.stringify(allData));
                        } else {
                            newURL = '/paymentoverview?success=true';
                            Session.setPersistent('customerpayments', []);
                        }
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
                    let objDetails = {
                        type: "TCustPayments",
                        fields: {
                            // Amount:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                            // Applied:parseFloat(paymentAmt.replace(/[^0-9.-]+/g,"")) || 0,
                            AccountName: bankAccount,
                            ClientPrintName: customer,
                            CompanyName: customer,
                            DeptClassName: department,
                            // EmployeeName: empName || ' ',
                            GUILines: paymentData,
                            Notes: notes,
                            Payment: true,
                            PaymentDate: paymentDate,
                            PayMethodName: payMethod,

                            ReferenceNo: reference

                        }
                    };

                    paymentService.saveDepositData(objDetails).then(function(data) {
                      if(allData.length > 0) {
                            newURL = '/paymentcard?selectcust=' + allData[0].selectCust;
                            allData.shift();
                            Session.setPersistent('customerpayments', JSON.stringify(allData));
                        } else {
                            newURL = '/paymentoverview?success=true';
                            Session.setPersistent('customerpayments', []);
                        }
                        var customerID = $('#edtCustomerEmail').attr('customerid');
                        // Send Email
                        $('#html-2-pdfwrapper').css('display', 'block');
                        $('.pdfCustomerName').html($('#edtCustomerName').val());
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
                                    filename: 'customerpayment-' + invoiceId + '.pdf',
                                    content: base64data,
                                    encoding: 'base64'
                                };
                                attachment.push(pdfObject);
                                // let mailBody = "VS1 Cloud Test";
                                let erpInvoiceId = objDetails.fields.ID;

                                let mailFromName = Session.get('vs1companyName');
                                let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                                let customerEmailName = $('#edtCustomerName').val();
                                let checkEmailData = $('#edtCustomerEmail').val();
                                // let mailCC = templateObject.mailCopyToUsr.get();
                                let grandtotal = $('#grandTotal').html();
                                let amountDueEmail = $('#totalBalanceDue').html();
                                let emailDueDate = $("#dtDueDate").val();
                                let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                                let mailBody = "Hi " + customerEmailName + ",\n\n Here's payment " + erpInvoiceId + " for  " + grandtotal + "." +
                                    // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
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
                                    '                        Please find payment <span>' + erpInvoiceId + '</span> attached below.' +
                                    '                    </td>' +
                                    '                </tr>' +
                                    '                <tr>' +
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
                                            window.open(newURL,'_self');

                                        } else {
                                             window.open(newURL,'_self');
                                        }
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
                                             window.open(newURL,'_self');
                                        } else {
                                            $('#html-2-pdfwrapper').css('display', 'none');
                                            swal({
                                                title: 'SUCCESS',
                                                text: "Email Sent To Customer: " + checkEmailData + " and User: " + mailFrom + "",
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
                                            window.open(url,'_self');

                                        } else {
                                            $('#html-2-pdfwrapper').css('display', 'none');
                                            swal({
                                                title: 'SUCCESS',
                                                text: "Email Sent To Customer: " + checkEmailData + " ",
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
                                            FlowRouter.go('/paymentoverview?success=true');
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
                                type: "TCustomer",
                                fields: {
                                    ID: customerID,
                                    Email: customerEmail
                                }
                            }
                            // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
                            //
                            // });
                        };
                        $('.fullScreenSpin').css('display', 'none');
                        // FlowRouter.go('/paymentoverview?success=true');
                    }).catch(function(err) {
                        // FlowRouter.go('/paymentoverview?success=true');
                      if(allData.length > 0) {
                            newURL = '/paymentcard?selectcust=' + allData[0].selectCust;
                            allData.shift();
                            Session.setPersistent('customerpayments', JSON.stringify(allData));
                        } else {
                            newURL = '/paymentoverview?success=true';
                            Session.setPersistent('customerpayments', []);
                        }
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
                }

            }
        }else{

              $('.tblPaymentcard > tbody > tr').each(function() {
                if ($(this).closest('tr').find('.colType').text() != '') {
                  var lineID = this.id;
                  let linetype = $('#' + lineID + " .colType").text() || $(this).closest('tr').find('.colType').text()||'';
                  let lineAmountDue = $('#' + lineID + " .lineAmountdue").text() || $(this).closest('tr').find('.lineAmountdue').text();
                  let linePaymentAmt = $('#' + lineID + " .linePaymentamount").val() || $(this).closest('tr').find('.linePaymentamount').val();
                  let Line = {
                      type: 'TGuiCustPaymentLines',
                      fields: {
                          TransType: linetype,
                          TransID: lineID,
                          Paid: true,
                          Payment: parseFloat(linePaymentAmt.replace(/[^0-9.-]+/g, "")) || 0,
                      }
                  };
                  paymentData.push(Line);
                  }
              });

              let objDetails = {
                  type: "TCustPayments",
                  fields: {
                    AccountName: bankAccount,
                    ClientPrintName: customer,
                    CompanyName: customer,
                    DeptClassName: department,
                    // EmployeeName: empName || ' ',
                    GUILines: paymentData,
                    Notes: notes,
                    Payment: true,
                    PaymentDate: paymentDate,
                    PayMethodName: payMethod,
                    ReferenceNo: reference
                  }
              };

              paymentService.saveDepositData(objDetails).then(function(data) {
                  var customerID = $('#edtCustomerEmail').attr('customerid');
                  // Send Email
                  $('#html-2-pdfwrapper').css('display', 'block');
                  $('.pdfCustomerName').html($('#edtCustomerName').val());
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
                              filename: 'Customer Payment ' + invoiceId + '.pdf',
                              content: base64data,
                              encoding: 'base64'
                          };
                          attachment.push(pdfObject);
                          // let mailBody = "VS1 Cloud Test";
                          let erpInvoiceId = objDetails.fields.ID;

                          let mailFromName = Session.get('vs1companyName');
                          let mailFrom = localStorage.getItem('VS1OrgEmail') || localStorage.getItem('VS1AdminUserName');
                          let customerEmailName = $('#edtCustomerName').val();
                          let checkEmailData = $('#edtCustomerEmail').val();
                          // let mailCC = templateObject.mailCopyToUsr.get();
                          let grandtotal = $('#grandTotal').html();
                          let amountDueEmail = $('#totalBalanceDue').html();
                          let emailDueDate = $("#dtDueDate").val();
                          let mailSubject = 'Payment ' + erpInvoiceId + ' from ' + mailFromName + ' for ' + customerEmailName;
                          let mailBody = "Hi " + customerEmailName + ",\n\n Here's payment " + erpInvoiceId + " for  " + grandtotal + "." +
                              // "\n\nThe amount outstanding of "+amountDueEmail+" is due on "+emailDueDate+"." +
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
                              '                        Please find payment <span>' + erpInvoiceId + '</span> attached below.' +
                              '                    </td>' +
                              '                </tr>' +
                              '                <tr>' +
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
                                      FlowRouter.go('/paymentoverview?success=true');

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
                                      FlowRouter.go('/paymentoverview?success=true');
                                  } else {
                                      $('#html-2-pdfwrapper').css('display', 'none');
                                      swal({
                                          title: 'SUCCESS',
                                          text: "Email Sent To Customer: " + checkEmailData + " and User: " + mailFrom + "",
                                          type: 'success',
                                          showCancelButton: false,
                                          confirmButtonText: 'OK'
                                      }).then((result) => {
                                          if (result.value) {
                                              FlowRouter.go('/paymentoverview?success=true');
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
                                      FlowRouter.go('/paymentoverview?success=true');

                                  } else {
                                      $('#html-2-pdfwrapper').css('display', 'none');
                                      swal({
                                          title: 'SUCCESS',
                                          text: "Email Sent To Customer: " + checkEmailData + " ",
                                          type: 'success',
                                          showCancelButton: false,
                                          confirmButtonText: 'OK'
                                      }).then((result) => {
                                          if (result.value) {
                                              FlowRouter.go('/paymentoverview?success=true');
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
                                      FlowRouter.go('/paymentoverview?success=true');
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
                                              FlowRouter.go('/paymentoverview?success=true');
                                          } else if (result.dismiss === 'cancel') {}
                                      });

                                      $('.fullScreenSpin').css('display', 'none');
                                  }
                              });

                          } else {
                              FlowRouter.go('/paymentoverview?success=true');
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
                          type: "TCustomer",
                          fields: {
                              ID: customerID,
                              Email: customerEmail
                          }
                      }
                      // paymentService.saveCustomerEmail(customerEmailData).then(function (customerEmailData) {
                      //
                      // });
                  };
                  $('.fullScreenSpin').css('display', 'none');
                  // window.open('/salesorderslist','_self');
              }).catch(function(err) {
                  swal({
                      title: 'Oooops...',
                      text: err,
                      type: 'error',
                      showCancelButton: false,
                      confirmButtonText: 'Try Again'
                  }).then((result) => {
                      if (result.value) {
                          //Meteor._reload.reload();
                      } else if (result.dismiss === 'cancel') {}
                  });
                  $('.fullScreenSpin').css('display', 'none');
              });


        }

        // if(depositData[0].PayMethod !== ''){
        //     PayMethod = depositData[0].PayMethod;
        // }
        // else {
        //     PayMethod = 'Cash';
        // }
    },
    'click #tblPaymentcard tr .colTransNo': function(event) {
      let custname = $('#edtCustomerName').val()||'';
      if (custname === '') {
          swal('Customer has not been selected!', '', 'warning');
          e.preventDefault();
    } else {
    if($('#addRow').prop('disabled') == false) {
        let templateObject = Template.instance();
        $(".chkBox").prop("checked", false);
        let paymentList = [''];
        $('.tblPaymentcard tbody tr').each(function() {
            paymentList.push(this.id);

        })

        let geturl = location.href;
        let id = 0;
        if (geturl.indexOf('?invid') > 0 || geturl.indexOf('?selectcust')) {
            geturl = new URL(geturl);
            id = geturl.searchParams.get("invid") || geturl.searchParams.get("selectcust");
        }
        let $tblrows = $("#tblPaymentcard tbody tr");
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
        $('#customerPaymentListModal').modal();
        $('.fullScreenSpin').css('display', 'none');
    }
     }
    },
    'click .chkPaymentCard': function() {
        var listData = $(this).closest('tr').attr('id');
        var selectedClient = $(event.target).closest("tr").find(".colCustomerName").text();
        const templateObject = Template.instance();
        const selectedAwaitingPayment = [];
        const selectedAwaitingPayment2 = [];
        const selectedAwaitingPayment3 = [];
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
        var selectedClient = $(event.target).closest("tr").find(".colCustomerName").text();
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
    'click .btnSelectCustomers': function(event) {
        const templateObject = Template.instance();
        let selectedSupplierPayments = templateObject.selectedAwaitingPayment.get();
        if (selectedSupplierPayments.length > 0) {
            let currentApplied = $('.lead').text().replace(/[^0-9.-]+/g, "");
            currentApplied = parseFloat(currentApplied.match(/-?(?:\d+(?:\.\d*)?|\.\d+)/)[0])
            let total = currentApplied;
            for (let x = 0; x < selectedSupplierPayments.length; x++) {
                var rowData = '<tr class="dnd-moved" id="'+selectedSupplierPayments[x].awaitingId+'" name="'+selectedSupplierPayments[x].awaitingId+'">\n'+
                              '	<td contenteditable="false" class="colTransDate">'+selectedSupplierPayments[x].date+'</td>\n'+
                              '	<td contenteditable="false" class="colType" style="color:#00a3d3; cursor: pointer; white-space: nowrap;">Invoice</td>\n'+
                              '	<td contenteditable="false" class="colTransNo" style="color:#00a3d3">'+selectedSupplierPayments[x].awaitingId+'</td>\n'+
                              '	<td contenteditable="false" class="lineOrginalamount" style="text-align: right!important;">'+selectedSupplierPayments[x].originalAmount+'</td>\n'+
                              '	<td contenteditable="false" class="lineAmountdue" style="text-align: right!important;">'+selectedSupplierPayments[x].outstandingAmount+'</td>\n'+
                              '	<td><input class="linePaymentamount highlightInput" type="text" value="'+selectedSupplierPayments[x].paymentAmount+'"></td>\n'+
                              '	<td contenteditable="false" class="lineOutstandingAmount" style="text-align: right!important;">'+selectedSupplierPayments[x].paymentAmount+'</td>\n'+
                              '	<td contenteditable="true" class="colComments">'+selectedSupplierPayments[x].comments+'</td>\n'+
                              '	<td><span class="table-remove btnRemove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-remove"></i></button></span></td>\n'+
                              '</tr>';

                //$('#tblPaymentcard tbody>tr:last').clone(true);
                // $(".colTransDate", rowData).text(selectedSupplierPayments[x].date);
                // $(".colType", rowData).text("Invoice");
                // $(".colTransNo", rowData).text(selectedSupplierPayments[x].awaitingId);
                // $(".lineOrginalamount", rowData).text(selectedSupplierPayments[x].originalAmount);
                // $(".lineAmountdue", rowData).text(selectedSupplierPayments[x].outstandingAmount);
                // $(".linePaymentamount", rowData).val(selectedSupplierPayments[x].paymentAmount);
                // $(".lineOutstandingAmount", rowData).text(selectedSupplierPayments[x].paymentAmount);
                // $(".colComments", rowData).text(selectedSupplierPayments[x].comments);
                // rowData.attr('id', selectedSupplierPayments[x].awaitingId);
                // rowData.attr('name', selectedSupplierPayments[x].awaitingId);
                let checkCompareID = selectedSupplierPayments[x].awaitingId||'';
                let isCheckedTrue = true;
                $('.tblPaymentcard > tbody > tr').each(function() {
                  var lineID = this.id;
                  if(lineID == checkCompareID){
                    isCheckedTrue = false;
                  }
                });
              if(isCheckedTrue){
                $("#tblPaymentcard tbody").append(rowData);
                total = total + parseFloat(selectedSupplierPayments[x].paymentAmount.replace(/[^0-9.-]+/g, "")) || 0;
              }
                //$('.appliedAmount').text(Currency + total.toFixed(2));
            }
            $('.appliedAmount').text(utilityService.modifynegativeCurrencyFormat(total.toFixed(2)));
        }
        templateObject.selectedAwaitingPayment.set([]);
        $('#customerPaymentListModal').modal('hide');

    },
    'keydown #edtPaymentAmount,keydown #lineOrginalamount,keydown #lineAmountdue,keydown .linePaymentamount, keydown #lineOutstandingAmount': function(event) {
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
        let formatedoustandingAmt = Number(oustandingAmt.replace(/[^0-9.-]+/g, "")) || 0;

        let formatedpaymentAmt = Number(paymentAmt.replace(/[^0-9.-]+/g, "")) || 0;

        if(formatedpaymentAmt > 0){
        if(formatedpaymentAmt > formatedoustandingAmt){
          $(event.target).closest('tr').find('.lineOutstandingAmount').text(Currency + 0);
        }else{
          let getUpdateOustanding = formatedoustandingAmt - formatedpaymentAmt;
          $(event.target).closest('tr').find('.lineOutstandingAmount').text(utilityService.modifynegativeCurrencyFormat(getUpdateOustanding));
        }
       }

        $(event.target).val(utilityService.modifynegativeCurrencyFormat(formatedpaymentAmt));
        let $tblrows = $("#tblPaymentcard tbody tr");
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
    'click .printConfirm': function(event) {
        $('#html-2-pdfwrapper').css('display', 'block');
        $('.pdfCustomerName').html($('#edtCustomerName').val());
        $('.pdfCustomerAddress').html($('#txabillingAddress').val().replace(/[\r\n]/g, "<br />"));
        exportSalesToPdf();
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
            if ($('#tblPaymentcard tbody>tr').length > 1) {
                this.click;
                let total = 0;
                $(event.target).closest('tr').remove();
                event.preventDefault();
                let $tblrows = $("#tblPaymentcard tbody tr");
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
        var getso_id = url.split('?id=');
        var currentInvoice = getso_id[getso_id.length - 1];
        var objDetails = '';
        if (getso_id[1]) {
            currentInvoice = parseInt(currentInvoice);
            var objDetails = {
                type: "TCustPayments",
                fields: {
                    ID: currentInvoice,
                    Deleted: true
                }
            };

            paymentService.deleteDepositData(objDetails).then(function(objDetails) {
                $('.modal-backdrop').css('display', 'none');
                FlowRouter.go('/paymentoverview?success=true');
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
            });
        } else {
            FlowRouter.go('/paymentoverview?success=true');
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
        if ($('#tblPaymentcard tbody>tr').length > 1) {
            this.click;
            let total = 0;
            $('#tblPaymentcard #' + selectLineID).closest('tr').remove();
            let $tblrows = $("#tblPaymentcard tbody tr");
            $tblrows.each(function(index) {
                var $tblrow = $(this);
                total += parseFloat($tblrow.find(".linePaymentamount ").val().replace(/[^0-9.-]+/g, "")) || 0;
            });
            $('.appliedAmount').text(utilityService.modifynegativeCurrencyFormat(total.toFixed(2)));

        } else {
            this.click;
            $('#' + selectLineID + " .colTransDate").text('');
            $('#' + selectLineID + " .colType").text('');
            $('#' + selectLineID + " .colTransNo").text('');
            $('#' + selectLineID + " .lineOrginalamount").text('');
            $('#' + selectLineID + " .lineAmountdue").text('');
            $('#' + selectLineID + " .lineOutstandingAmount").text('');
            $('#' + selectLineID + " .colComments").text('');

            $('.appliedAmount').val(Currency + '0.00');
        }

        $('#deleteLineModal').modal('toggle');
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
                    PrefName: 'tblPaymentcard'
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
                    PrefName: 'tblPaymentcard'
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
                            PrefName: 'tblPaymentcard',
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
                        PrefName: 'tblPaymentcard',
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
        $('#edtCustomerEmail').val($('#edtCustomerEmail').val().replace(/\s/g, ''));
        if ($(event.target).is(':checked')) {
            let checkEmailData = $('#edtCustomerEmail').val();

            if (checkEmailData.replace(/\s/g, '') === '') {
                swal('Customer Email cannot be blank!', '', 'warning');
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
