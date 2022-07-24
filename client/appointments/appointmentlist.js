import { AppointmentService } from './appointment-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { EmployeeProfileService } from "../js/profile-service";
import { AccountService } from "../accounts/account-service";
import { ProductService } from "../product/product-service";
import { UtilityService } from "../utility-service";
import { SalesBoardService } from '../js/sales-service';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.appointmentlist.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.productsrecord = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.clientrecords = new ReactiveVar([]);
    templateObject.selectedAppointment = new ReactiveVar([]);
    templateObject.selectedAppointmentID = new ReactiveVar();
});

Template.appointmentlist.onRendered(function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    let templateObject = Template.instance();
    let accountService = new AccountService();
    let appointmentService = new AppointmentService();
    let clientsService = new SalesBoardService();
    let productService = new ProductService();
    const supplierList = [];
    let billTable;
    var splashArray = new Array();
    const dataTableList = [];
    const tableHeaderList = [];
    const clientList = [];
    if (FlowRouter.current().queryParams.success) {
        $('.btnRefresh').addClass('btnRefreshAlert');
    }
    var today = moment().format('DD/MM/YYYY');
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if ((currentDate.getMonth() + 1) < 10) {
        fromDateMonth = "0" + (currentDate.getMonth() + 1);
    }

    if (currentDate.getDate() < 10) {
        fromDateDay = "0" + currentDate.getDate();
    }
    var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + currentDate.getFullYear();

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
        onChangeMonthYear: function(year, month, inst){
        // Set date to picker
        $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
        // Hide (close) the picker
        $(this).datepicker('hide');
        // Change ttrigger the on change function
        $(this).trigger('change');
       }
    });

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);

    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblappointmentlist', function (error, result) {
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
        $('td').each(function () {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
        $('td.colStatus').each(function(){
            if($(this).text() == "Deleted") $(this).addClass('text-deleted');
        });
    };

    templateObject.resetData = function (dataVal) {
      setTimeout(function () {
          window.open('/appointmentlist?page=last','_self');
      }, 100);

    }

    templateObject.getAllProductData = function () {
        productList = [];
        getVS1Data('TProductVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                productService.getNewProductListVS1().then(function (data) {
                    var dataList = {};
                    for (let i = 0; i < data.tproductvs1.length; i++) {
                        dataList = {
                            id: data.tproductvs1[i].Id || '',
                            productname: data.tproductvs1[i].ProductName || ''
                        }
                        productList.push(dataList);
                    }
                    templateObject.productsrecord.set(productList);

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tproductvs1;
                var dataList = {};
                for (let i = 0; i < useData.length; i++) {
                    dataList = {
                        id: useData[i].fields.ID || '',
                        productname: useData[i].fields.ProductName || ''
                    }
                    if (useData[i].fields.ProductType != 'INV') {
                        productList.push(dataList);
                    }

                }
                templateObject.productsrecord.set(productList);

            }
        }).catch(function (err) {

            productService.getNewProductListVS1().then(function (data) {

                var dataList = {};
                for (let i = 0; i < data.tproductvs1.length; i++) {
                    dataList = {
                        id: data.tproductvs1[i].Id || '',
                        productname: data.tproductvs1[i].ProductName || ''
                    }
                    productList.push(dataList);

                }
                templateObject.productsrecord.set(productList);

            });
        });

    }
    //Function to reload and update Indexdb after convert
    templateObject.getAllAppointmentDataOnConvert = function () {
        let currentDate = new Date();
        let hours = currentDate.getHours(); //returns 0-23
        let minutes = currentDate.getMinutes(); //returns 0-59
        let seconds = currentDate.getSeconds(); //returns 0-59
        let month = (currentDate.getMonth() + 1);
        let days = currentDate.getDate();

        if ((currentDate.getMonth()+1) < 10) {
            month = "0" + (currentDate.getMonth() + 1);
        }

        if (currentDate.getDate() < 10) {
            days = "0" + currentDate.getDate();
        }
        let currenctTodayDate = currentDate.getFullYear() + "-" + month + "-" + days + " " + hours + ":" + minutes + ":" + seconds;
        let templateObject = Template.instance();
        sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
            addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function (err) {

        });
    }
    $(".formClassDate").datepicker({
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
        onChangeMonthYear: function(year, month, inst){
        // Set date to picker
        $(this).datepicker('setDate', new Date(year, inst.selectedMonth, inst.selectedDay));
        // Hide (close) the picker
        $(this).datepicker('hide');
        // Change ttrigger the on change function
        $(this).trigger('change');
       }
    });
    templateObject.getAllClients = function () {
        getVS1Data('TCustomerVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                clientsService.getClientVS1().then(function (data) {
                    for (let i in data.tcustomervs1) {

                        let customerrecordObj = {
                            customerid: data.tcustomervs1[i].Id || ' ',
                            customername: data.tcustomervs1[i].ClientName || ' ',
                            customeremail: data.tcustomervs1[i].Email || ' ',
                            street: data.tcustomervs1[i].Street || ' ',
                            street2: data.tcustomervs1[i].Street2 || ' ',
                            street3: data.tcustomervs1[i].Street3 || ' ',
                            suburb: data.tcustomervs1[i].Suburb || ' ',
                            phone: data.tcustomervs1[i].Phone || ' ',
                            statecode: data.tcustomervs1[i].State + ' ' + data.tcustomervs1[i].Postcode || ' ',
                            country: data.tcustomervs1[i].Country || ' ',
                            termsName: data.tcustomervs1[i].TermsName || ''
                        };
                        //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
                        clientList.push(customerrecordObj);

                        //$('#edtCustomerName').editableSelect('add',data.tcustomervs1[i].ClientName);
                    }
                    templateObject.clientrecords.set(clientList);
                    templateObject.clientrecords.set(clientList.sort(function (a, b) {
                        if (a.customername == 'NA') {
                            return 1;
                        }
                        else if (b.customername == 'NA') {
                            return -1;
                        }
                        return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                    }));

                    for (var i = 0; i < clientList.length; i++) {
                        $('#customer').editableSelect('add', clientList[i].customername);
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
                        phone: useData[i].fields.Phone || ' ',
                        statecode: useData[i].fields.State + ' ' + useData[i].fields.Postcode || ' ',
                        country: useData[i].fields.Country || ' ',
                        termsName: useData[i].fields.TermsName || ''
                    };
                    //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
                    clientList.push(customerrecordObj);

                    //$('#edtCustomerName').editableSelect('add',data.tcustomervs1[i].ClientName);
                }
                templateObject.clientrecords.set(clientList);
                templateObject.clientrecords.set(clientList.sort(function (a, b) {
                    if (a.customername == 'NA') {
                        return 1;
                    }
                    else if (b.customername == 'NA') {
                        return -1;
                    }
                    return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                }));

                for (var i = 0; i < clientList.length; i++) {
                    $('#customer').editableSelect('add', clientList[i].customername);
                }

            }
        }).catch(function (err) {
            clientsService.getClientVS1().then(function (data) {
                for (let i in data.tcustomervs1) {

                    let customerrecordObj = {
                        customerid: data.tcustomervs1[i].Id || ' ',
                        customername: data.tcustomervs1[i].ClientName || ' ',
                        customeremail: data.tcustomervs1[i].Email || ' ',
                        street: data.tcustomervs1[i].Street || ' ',
                        street2: data.tcustomervs1[i].Street2 || ' ',
                        street3: data.tcustomervs1[i].Street3 || ' ',
                        suburb: data.tcustomervs1[i].Suburb || ' ',
                        phone: data.tcustomervs1[i].Phone || ' ',
                        statecode: data.tcustomervs1[i].State + ' ' + data.tcustomervs1[i].Postcode || ' ',
                        country: data.tcustomervs1[i].Country || ' ',
                        termsName: data.tcustomervs1[i].TermsName || ''
                    };
                    //clientList.push(data.tcustomer[i].ClientName,customeremail: data.tcustomer[i].Email);
                    clientList.push(customerrecordObj);

                    //$('#edtCustomerName').editableSelect('add',data.tcustomervs1[i].ClientName);
                }
                templateObject.clientrecords.set(clientList);
                templateObject.clientrecords.set(clientList.sort(function (a, b) {
                    if (a.customername == 'NA') {
                        return 1;
                    }
                    else if (b.customername == 'NA') {
                        return -1;
                    }
                    return (a.customername.toUpperCase() > b.customername.toUpperCase()) ? 1 : -1;
                }));

                for (var i = 0; i < clientList.length; i++) {
                    $('#customer').editableSelect('add', clientList[i].customername);
                }

            });
        });

    };

    templateObject.getAllClients();
    templateObject.getAllAppointmentListData = function () {
        ///if(!localStorage.getItem('VS1TReconcilationList')){
        var currentBeginDate = new Date();
        var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        let fromDateMonth = (currentBeginDate.getMonth() + 1);
        let fromDateDay = currentBeginDate.getDate();
        if ((currentBeginDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
        } else {
            fromDateMonth = (currentBeginDate.getMonth() + 1);
        }

        if (currentBeginDate.getDate() < 10) {
            fromDateDay = "0" + currentBeginDate.getDate();
        }
        var toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");

        getVS1Data('TAppointmentList').then(function (dataObject) {
            if (dataObject.length == 0) {
              sideBarService.getTAppointmentListData(prevMonth11Date,toDate, false,initialReportLoad,0).then(function (data) {
                  // localStorage.setItem('VS1TReconcilationList', JSON.stringify(data)||'');
                  addVS1Data('TAppointmentList',JSON.stringify(data));
                  let lineItems = [];
                  let lineItemObj = {};
                  let color = "";
                  let appStatus = "";
                  if (data.Params.IgnoreDates == true) {
                      $('#dateFrom').attr('readonly', true);
                      $('#dateTo').attr('readonly', true);
                      FlowRouter.go('/appointmentlist?ignoredate=true');
                  } else {
                      $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
                      $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
                  }

                  for (let i = 0; i < data.tappointmentlist.length; i++) {
                     appStatus = data.tappointmentlist[i].Status || '';
                      // let openBalance = utilityService.modifynegativeCurrencyFormat(data.tappointmentex[i].fields.OpenBalance)|| 0.00;
                      // let closeBalance = utilityService.modifynegativeCurrencyFormat(data.tappointmentex[i].fields.CloseBalance)|| 0.00;
                      if(data.tappointmentlist[i].Active == true){
                      if (data.tappointmentlist[i].Status == "Converted" || data.tappointmentlist[i].Status == "Completed") {
                          color = "#1cc88a";
                      } else {
                          color = "#f6c23e";
                      }
                    }else{
                      appStatus = "Deleted";
                      color = "#e74a3b";
                    }
                      var dataList = {
                          id: data.tappointmentlist[i].AppointID || '',
                          sortdate: data.tappointmentlist[i].CreationDate != '' ? moment(data.tappointmentlist[i].CreationDate).format("YYYY/MM/DD") : data.tappointmentlist[i].CreationDate,
                          appointmentdate: data.tappointmentlist[i].CreationDate != '' ? moment(data.tappointmentlist[i].CreationDate).format("DD/MM/YYYY") : data.tappointmentlist[i].CreationDate,
                          accountname: data.tappointmentlist[i].ClientName || '',
                          statementno: data.tappointmentlist[i].EnteredByEmployeeName || '',
                          employeename: data.tappointmentlist[i].EnteredByEmployeeName || '',
                          department: data.tappointmentlist[i].DeptClassName || '',
                          phone: data.tappointmentlist[i].Phone || '',
                          mobile: data.tappointmentlist[i].ClientMobile || '',
                          suburb: data.tappointmentlist[i].Suburb || '',
                          street: data.tappointmentlist[i].Street || '',
                          state: data.tappointmentlist[i].State || '',
                          country: data.tappointmentlist[i].Country || '',
                          zip: data.tappointmentlist[i].Postcode || '',
                          startTime: data.tappointmentlist[i].STARTTIME.split(' ')[1] || '',
                          timeStart: moment(data.tappointmentlist[i].STARTTIME).format('h:mm a'),
                          timeEnd: moment(data.tappointmentlist[i].ENDTIME).format('h:mm a'),
                          totalHours: data.tappointmentlist[i].TotalHours || 0,
                          endTime: data.tappointmentlist[i].ENDTIME.split(' ')[1] || '',
                          startDate: data.tappointmentlist[i].STARTTIME || '',
                          endDate: data.tappointmentlist[i].ENDTIME || '',
                          frmDate: moment(data.tappointmentlist[i].STARTTIME).format('dddd') + ', ' + moment(data.tappointmentlist[i].STARTTIME).format('DD'),
                          toDate: moment(data.tappointmentlist[i].ENDTIME).format('dddd') + ', ' + moment(data.tappointmentlist[i].ENDTIME).format('DD'),
                          fromDate: data.tappointmentlist[i].Actual_Endtime != '' ? moment(data.tappointmentlist[i].Actual_Endtime).format("DD/MM/YYYY") : data.tappointmentlist[i].Actual_Endtime,
                          openbalance: data.tappointmentlist[i].Actual_Endtime || '',
                          aStartTime: data.tappointmentlist[i].Actual_Starttime.split(' ')[1] || '',
                          aEndTime: data.tappointmentlist[i].Actual_Endtime.split(' ')[1] || '',
                          actualHours: '',
                          closebalance: '',
                          product: data.tappointmentlist[i].ProductDesc || '',
                          finished: appStatus || '',
                          notes: data.tappointmentlist[i].Notes || '',
                          color: color,
                          msRef: data.tappointmentlist[i].MSRef || ''
                      };
                      dataTableList.push(dataList);
                  }

                  templateObject.datatablerecords.set(dataTableList);
                  if (templateObject.datatablerecords.get()) {

                      Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblappointmentlist', function (error, result) {
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
                                      let columnindex = customcolumn[i].index + 1;

                                      if (hiddenColumn == true) {

                                          $("." + columnClass + "").addClass('hiddenColumn');
                                          $("." + columnClass + "").removeClass('showColumn');
                                      } else if (hiddenColumn == false) {
                                          $("." + columnClass + "").removeClass('hiddenColumn');
                                          $("." + columnClass + "").addClass('showColumn');
                                      }

                                  }
                              }

                          }
                      });


                      setTimeout(function () {
                          MakeNegative();
                      }, 100);
                  }

                  setTimeout(function () {
                      $('.fullScreenSpin').css('display', 'none');
                      //$.fn.dataTable.moment('DD/MM/YY');
                      $('#tblappointmentlist').DataTable({
                          columnDefs: [
                              { "orderable": false, "targets": 0 },
                              { type: 'date', targets: 1 }
                          ],
                          "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                          buttons: [
                              {
                                  extend: 'excelHtml5',
                                  text: '',
                                  download: 'open',
                                  className: "btntabletocsv hiddenColumn",
                                  filename: "appointmentlist_" + moment().format(),
                                  orientation: 'portrait',
                                  exportOptions: {
                                      columns: ':visible'
                                  }
                              }, {
                                  extend: 'print',
                                  download: 'open',
                                  className: "btntabletopdf hiddenColumn",
                                  text: '',
                                  title: 'Appointment List',
                                  filename: "appointmentlist_" + moment().format(),
                                  exportOptions: {
                                      columns: ':visible'
                                  }
                              }],
                          select: true,
                          destroy: true,
                          colReorder: true,
                          colReorder: {
                              fixedColumnsLeft: 1
                          },
                          // bStateSave: true,
                          // rowId: 0,
                          pageLength: initialDatatableLoad,
                          "bLengthChange": false,
                          info: true,
                          responsive: true,
                          "order": [[1, "desc"],[ 2, "desc" ]],
                          action: function () {
                              //$('#tblappointmentlist').DataTable().ajax.reload();
                          },
                          "fnDrawCallback": function (oSettings) {
                            let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                            $('.paginate_button.page-item').removeClass('disabled');
                            $('#tblappointmentlist_ellipsis').addClass('disabled');

                            if(oSettings._iDisplayLength == -1){
                              if(oSettings.fnRecordsDisplay() > 150){
                                $('.paginate_button.page-item.previous').addClass('disabled');
                                $('.paginate_button.page-item.next').addClass('disabled');
                              }
                            }else{

                            }
                            if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
                                $('.paginate_button.page-item.next').addClass('disabled');
                            }

                            $('.paginate_button.next:not(.disabled)', this.api().table().container())
                             .on('click', function(){
                               $('.fullScreenSpin').css('display','inline-block');
                               let dataLenght = oSettings._iDisplayLength;
                               var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                               var dateTo = new Date($("#dateTo").datepicker("getDate"));

                               let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                               let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                               if(checkurlIgnoreDate == 'true'){
                                 sideBarService.getTAppointmentListData(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                   getVS1Data('TAppointmentList').then(function (dataObjectold) {
                                     if(dataObjectold.length == 0){

                                     }else{
                                       let dataOld = JSON.parse(dataObjectold[0].data);

                                       var thirdaryData = $.merge($.merge([], dataObjectnew.tappointmentlist), dataOld.tappointmentlist);
                                       let objCombineData = {
                                         Params: dataOld.Params,
                                         tappointmentlist:thirdaryData
                                       }


                                         addVS1Data('TAppointmentList',JSON.stringify(objCombineData)).then(function (datareturn) {
                                           templateObject.resetData(objCombineData);
                                         $('.fullScreenSpin').css('display','none');
                                         }).catch(function (err) {
                                         $('.fullScreenSpin').css('display','none');
                                         });

                                     }
                                    }).catch(function (err) {

                                    });

                                 }).catch(function(err) {
                                   $('.fullScreenSpin').css('display','none');
                                 });
                               }else{
                               sideBarService.getTAppointmentListData(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                 getVS1Data('TAppointmentList').then(function (dataObjectold) {
                                   if(dataObjectold.length == 0){

                                   }else{
                                     let dataOld = JSON.parse(dataObjectold[0].data);

                                     var thirdaryData = $.merge($.merge([], dataObjectnew.tappointmentlist), dataOld.tappointmentlist);
                                     let objCombineData = {
                                       Params: dataOld.Params,
                                       tappointmentlist:thirdaryData
                                     }


                                       addVS1Data('TAppointmentList',JSON.stringify(objCombineData)).then(function (datareturn) {
                                         templateObject.resetData(objCombineData);
                                       $('.fullScreenSpin').css('display','none');
                                       }).catch(function (err) {
                                       $('.fullScreenSpin').css('display','none');
                                       });

                                   }
                                  }).catch(function (err) {

                                  });

                               }).catch(function(err) {
                                 $('.fullScreenSpin').css('display','none');
                               });
                              }
                             });

                              setTimeout(function () {
                                  MakeNegative();
                              }, 100);
                          },
                          "fnInitComplete": function () {
                            let urlParametersPage = FlowRouter.current().queryParams.page;
                            if (urlParametersPage || FlowRouter.current().queryParams.ignoredate) {
                                this.fnPageChange('last');
                            }
                              $("<button class='btn btn-primary btnRefreshAppointment' type='button' id='btnRefreshAppointment' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblappointmentlist_filter");
                              $('.myvarFilterForm').appendTo(".colDateFilter");
                          },
                          "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                            let countTableData = data.Params.Count || 0; //get count from API data

                              return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
                          }
                      }).on('page', function () {
                          setTimeout(function () {
                              MakeNegative();
                          }, 100);
                          let draftRecord = templateObject.datatablerecords.get();
                          templateObject.datatablerecords.set(draftRecord);
                      }).on('column-reorder', function () {

                      });
                      $('.fullScreenSpin').css('display', 'none');
                  }, 0);

                  var columns = $('#tblappointmentlist th');
                  let sTible = "";
                  let sWidth = "";
                  let sIndex = "";
                  let sVisible = "";
                  let columVisible = false;
                  let sClass = "";
                  $.each(columns, function (i, v) {
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
                  $('div.dataTables_filter input').addClass('form-control form-control-sm');

              }).catch(function (err) {
                  // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                  $('.fullScreenSpin').css('display', 'none');
                  // Meteor._reload.reload();
              });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tappointmentlist;
                let lineItems = [];
                let lineItemObj = {};
                let color = "";
                let appStatus = "";
                if (data.Params.IgnoreDates == true) {
                    $('#dateFrom').attr('readonly', true);
                    $('#dateTo').attr('readonly', true);
                    FlowRouter.go('/appointmentlist?ignoredate=true');
                } else {
                    $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
                    $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
                }

                for (let i = 0; i < data.tappointmentlist.length; i++) {
                   appStatus = data.tappointmentlist[i].Status || '';
                    // let openBalance = utilityService.modifynegativeCurrencyFormat(data.tappointmentex[i].fields.OpenBalance)|| 0.00;
                    // let closeBalance = utilityService.modifynegativeCurrencyFormat(data.tappointmentex[i].fields.CloseBalance)|| 0.00;
                    if(data.tappointmentlist[i].Active == true){
                        if (data.tappointmentlist[i].Status == "Converted" || data.tappointmentlist[i].Status == "Completed") {
                            color = "#1cc88a";
                        } else {
                            color = "#f6c23e";
                        }
                    } else {
                        appStatus = "Deleted";
                        color = "#e74a3b";
                    }
                    var dataList = {
                        id: data.tappointmentlist[i].AppointID || '',
                        sortdate: data.tappointmentlist[i].CreationDate != '' ? moment(data.tappointmentlist[i].CreationDate).format("YYYY/MM/DD") : data.tappointmentlist[i].CreationDate,
                        appointmentdate: data.tappointmentlist[i].CreationDate != '' ? moment(data.tappointmentlist[i].CreationDate).format("DD/MM/YYYY") : data.tappointmentlist[i].CreationDate,
                        accountname: data.tappointmentlist[i].ClientName || '',
                        statementno: data.tappointmentlist[i].EnteredByEmployeeName || '',
                        employeename: data.tappointmentlist[i].EnteredByEmployeeName || '',
                        department: data.tappointmentlist[i].DeptClassName || '',
                        phone: data.tappointmentlist[i].Phone || '',
                        mobile: data.tappointmentlist[i].ClientMobile || '',
                        suburb: data.tappointmentlist[i].Suburb || '',
                        street: data.tappointmentlist[i].Street || '',
                        state: data.tappointmentlist[i].State || '',
                        country: data.tappointmentlist[i].Country || '',
                        zip: data.tappointmentlist[i].Postcode || '',
                        startTime: data.tappointmentlist[i].STARTTIME.split(' ')[1] || '',
                        timeStart: moment(data.tappointmentlist[i].STARTTIME).format('h:mm a'),
                        timeEnd: moment(data.tappointmentlist[i].ENDTIME).format('h:mm a'),
                        totalHours: data.tappointmentlist[i].TotalHours || 0,
                        endTime: data.tappointmentlist[i].ENDTIME.split(' ')[1] || '',
                        startDate: data.tappointmentlist[i].STARTTIME || '',
                        endDate: data.tappointmentlist[i].ENDTIME || '',
                        frmDate: moment(data.tappointmentlist[i].STARTTIME).format('dddd') + ', ' + moment(data.tappointmentlist[i].STARTTIME).format('DD'),
                        toDate: moment(data.tappointmentlist[i].ENDTIME).format('dddd') + ', ' + moment(data.tappointmentlist[i].ENDTIME).format('DD'),
                        fromDate: data.tappointmentlist[i].Actual_Endtime != '' ? moment(data.tappointmentlist[i].Actual_Endtime).format("DD/MM/YYYY") : data.tappointmentlist[i].Actual_Endtime,
                        openbalance: data.tappointmentlist[i].Actual_Endtime || '',
                        aStartTime: data.tappointmentlist[i].Actual_Starttime.split(' ')[1] || '',
                        aEndTime: data.tappointmentlist[i].Actual_Endtime.split(' ')[1] || '',
                        actualHours: '',
                        closebalance: '',
                        product: data.tappointmentlist[i].ProductDesc || '',
                        finished: appStatus || '',
                        notes: data.tappointmentlist[i].Notes || '',
                        color: color,
                        msRef: data.tappointmentlist[i].MSRef || ''
                    };
                    dataTableList.push(dataList);

                }

                templateObject.datatablerecords.set(dataTableList);
                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblappointmentlist', function (error, result) {
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
                                    let columnindex = customcolumn[i].index + 1;

                                    if (hiddenColumn == true) {

                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                    } else if (hiddenColumn == false) {
                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                        $("." + columnClass + "").addClass('showColumn');
                                    }

                                }
                            }

                        }
                    });


                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                setTimeout(function () {
                    $('.fullScreenSpin').css('display', 'none');
                    //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblappointmentlist').DataTable({
                        columnDefs: [
                            { "orderable": false, "targets": 0 },
                            { type: 'date', targets: 1 }
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "appointmentlist_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Appointment List',
                                filename: "appointmentlist_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        colReorder: {
                            fixedColumnsLeft: 1
                        },
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        "bLengthChange": false,
                        info: true,
                        responsive: true,
                        "order": [[1, "desc"],[ 2, "desc" ]],
                        action: function () {
                            //$('#tblappointmentlist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                          let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblappointmentlist_ellipsis').addClass('disabled');

                          if(oSettings._iDisplayLength == -1){
                            if(oSettings.fnRecordsDisplay() > 150){
                              $('.paginate_button.page-item.previous').addClass('disabled');
                              $('.paginate_button.page-item.next').addClass('disabled');
                            }
                          }else{

                          }
                          if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }

                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                           .on('click', function(){
                             $('.fullScreenSpin').css('display','inline-block');
                             let dataLenght = oSettings._iDisplayLength;
                             var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                             var dateTo = new Date($("#dateTo").datepicker("getDate"));

                             let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                             let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                             if(checkurlIgnoreDate == 'true'){
                               sideBarService.getTAppointmentListData(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                 getVS1Data('TAppointmentList').then(function (dataObjectold) {
                                   if(dataObjectold.length == 0){

                                   }else{
                                     let dataOld = JSON.parse(dataObjectold[0].data);

                                     var thirdaryData = $.merge($.merge([], dataObjectnew.tappointmentlist), dataOld.tappointmentlist);
                                     let objCombineData = {
                                       Params: dataOld.Params,
                                       tappointmentlist:thirdaryData
                                     }


                                       addVS1Data('TAppointmentList',JSON.stringify(objCombineData)).then(function (datareturn) {
                                         templateObject.resetData(objCombineData);
                                       $('.fullScreenSpin').css('display','none');
                                       }).catch(function (err) {
                                       $('.fullScreenSpin').css('display','none');
                                       });

                                   }
                                  }).catch(function (err) {

                                  });

                               }).catch(function(err) {
                                 $('.fullScreenSpin').css('display','none');
                               });
                             }else{
                             sideBarService.getTAppointmentListData(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                               getVS1Data('TAppointmentList').then(function (dataObjectold) {
                                 if(dataObjectold.length == 0){

                                 }else{
                                   let dataOld = JSON.parse(dataObjectold[0].data);

                                   var thirdaryData = $.merge($.merge([], dataObjectnew.tappointmentlist), dataOld.tappointmentlist);
                                   let objCombineData = {
                                     Params: dataOld.Params,
                                     tappointmentlist:thirdaryData
                                   }


                                     addVS1Data('TAppointmentList',JSON.stringify(objCombineData)).then(function (datareturn) {
                                       templateObject.resetData(objCombineData);
                                     $('.fullScreenSpin').css('display','none');
                                     }).catch(function (err) {
                                     $('.fullScreenSpin').css('display','none');
                                     });

                                 }
                                }).catch(function (err) {

                                });

                             }).catch(function(err) {
                               $('.fullScreenSpin').css('display','none');
                             });
                            }
                           });

                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                          let urlParametersPage = FlowRouter.current().queryParams.page;
                          if (urlParametersPage || FlowRouter.current().queryParams.ignoredate) {
                              this.fnPageChange('last');
                          }
                            $("<button class='btn btn-primary btnRefreshAppointment' type='button' id='btnRefreshAppointment' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblappointmentlist_filter");
                            $('.myvarFilterForm').appendTo(".colDateFilter");
                        },
                        "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                          let countTableData = data.Params.Count || 0; //get count from API data

                            return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
                        }
                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    });
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblappointmentlist th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function (i, v) {
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
                $('div.dataTables_filter input').addClass('form-control form-control-sm');
            }
        }).catch(function (err) {
            sideBarService.getTAppointmentListData(prevMonth11Date,toDate, false,initialReportLoad,0).then(function (data) {
                // localStorage.setItem('VS1TReconcilationList', JSON.stringify(data)||'');
                addVS1Data('TAppointmentList',JSON.stringify(data));
                let lineItems = [];
                let lineItemObj = {};
                let color = "";
                let appStatus = "";
                if (data.Params.IgnoreDates == true) {
                    $('#dateFrom').attr('readonly', true);
                    $('#dateTo').attr('readonly', true);
                    FlowRouter.go('/appointmentlist?ignoredate=true');
                } else {
                    $("#dateFrom").val(data.Params.DateFrom != '' ? moment(data.Params.DateFrom).format("DD/MM/YYYY") : data.Params.DateFrom);
                    $("#dateTo").val(data.Params.DateTo != '' ? moment(data.Params.DateTo).format("DD/MM/YYYY") : data.Params.DateTo);
                }

                for (let i = 0; i < data.tappointmentlist.length; i++) {
                   appStatus = data.tappointmentlist[i].Status || '';
                    // let openBalance = utilityService.modifynegativeCurrencyFormat(data.tappointmentex[i].fields.OpenBalance)|| 0.00;
                    // let closeBalance = utilityService.modifynegativeCurrencyFormat(data.tappointmentex[i].fields.CloseBalance)|| 0.00;
                    if(data.tappointmentlist[i].Active == true){
                    if (data.tappointmentlist[i].Status == "Converted" || data.tappointmentlist[i].Status == "Completed") {
                        color = "#1cc88a";
                    } else {
                        color = "#f6c23e";
                    }
                  }else{
                    appStatus = "Deleted";
                    color = "#e74a3b";
                  }
                    var dataList = {
                        id: data.tappointmentlist[i].AppointID || '',
                        sortdate: data.tappointmentlist[i].CreationDate != '' ? moment(data.tappointmentlist[i].CreationDate).format("YYYY/MM/DD") : data.tappointmentlist[i].CreationDate,
                        appointmentdate: data.tappointmentlist[i].CreationDate != '' ? moment(data.tappointmentlist[i].CreationDate).format("DD/MM/YYYY") : data.tappointmentlist[i].CreationDate,
                        accountname: data.tappointmentlist[i].ClientName || '',
                        statementno: data.tappointmentlist[i].EnteredByEmployeeName || '',
                        employeename: data.tappointmentlist[i].EnteredByEmployeeName || '',
                        department: data.tappointmentlist[i].DeptClassName || '',
                        phone: data.tappointmentlist[i].Phone || '',
                        mobile: data.tappointmentlist[i].ClientMobile || '',
                        suburb: data.tappointmentlist[i].Suburb || '',
                        street: data.tappointmentlist[i].Street || '',
                        state: data.tappointmentlist[i].State || '',
                        country: data.tappointmentlist[i].Country || '',
                        zip: data.tappointmentlist[i].Postcode || '',
                        startTime: data.tappointmentlist[i].STARTTIME.split(' ')[1] || '',
                        timeStart: moment(data.tappointmentlist[i].STARTTIME).format('h:mm a'),
                        timeEnd: moment(data.tappointmentlist[i].ENDTIME).format('h:mm a'),
                        totalHours: data.tappointmentlist[i].TotalHours || 0,
                        endTime: data.tappointmentlist[i].ENDTIME.split(' ')[1] || '',
                        startDate: data.tappointmentlist[i].STARTTIME || '',
                        endDate: data.tappointmentlist[i].ENDTIME || '',
                        frmDate: moment(data.tappointmentlist[i].STARTTIME).format('dddd') + ', ' + moment(data.tappointmentlist[i].STARTTIME).format('DD'),
                        toDate: moment(data.tappointmentlist[i].ENDTIME).format('dddd') + ', ' + moment(data.tappointmentlist[i].ENDTIME).format('DD'),
                        fromDate: data.tappointmentlist[i].Actual_Endtime != '' ? moment(data.tappointmentlist[i].Actual_Endtime).format("DD/MM/YYYY") : data.tappointmentlist[i].Actual_Endtime,
                        openbalance: data.tappointmentlist[i].Actual_Endtime || '',
                        aStartTime: data.tappointmentlist[i].Actual_Starttime.split(' ')[1] || '',
                        aEndTime: data.tappointmentlist[i].Actual_Endtime.split(' ')[1] || '',
                        actualHours: '',
                        closebalance: '',
                        product: data.tappointmentlist[i].ProductDesc || '',
                        finished: appStatus || '',
                        notes: data.tappointmentlist[i].Notes || '',
                        color: color,
                        msRef: data.tappointmentlist[i].MSRef || ''
                    };
                    dataTableList.push(dataList);

                }

                templateObject.datatablerecords.set(dataTableList);
                if (templateObject.datatablerecords.get()) {

                    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblappointmentlist', function (error, result) {
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
                                    let columnindex = customcolumn[i].index + 1;

                                    if (hiddenColumn == true) {

                                        $("." + columnClass + "").addClass('hiddenColumn');
                                        $("." + columnClass + "").removeClass('showColumn');
                                    } else if (hiddenColumn == false) {
                                        $("." + columnClass + "").removeClass('hiddenColumn');
                                        $("." + columnClass + "").addClass('showColumn');
                                    }

                                }
                            }

                        }
                    });


                    setTimeout(function () {
                        MakeNegative();
                    }, 100);
                }

                setTimeout(function () {
                    $('.fullScreenSpin').css('display', 'none');
                    //$.fn.dataTable.moment('DD/MM/YY');
                    $('#tblappointmentlist').DataTable({
                        columnDefs: [
                            { "orderable": false, "targets": 0 },
                            { type: 'date', targets: 1 }
                        ],
                        "sDom": "<'row'><'row'<'col-sm-12 col-lg-6'f><'col-sm-12 col-lg-6 colDateFilter'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                        buttons: [
                            {
                                extend: 'excelHtml5',
                                text: '',
                                download: 'open',
                                className: "btntabletocsv hiddenColumn",
                                filename: "appointmentlist_" + moment().format(),
                                orientation: 'portrait',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }, {
                                extend: 'print',
                                download: 'open',
                                className: "btntabletopdf hiddenColumn",
                                text: '',
                                title: 'Appointment List',
                                filename: "appointmentlist_" + moment().format(),
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }],
                        select: true,
                        destroy: true,
                        colReorder: true,
                        colReorder: {
                            fixedColumnsLeft: 1
                        },
                        // bStateSave: true,
                        // rowId: 0,
                        pageLength: initialDatatableLoad,
                        "bLengthChange": false,
                        info: true,
                        info: true,
                        responsive: true,
                        "order": [[1, "desc"],[ 2, "desc" ]],
                        action: function () {
                            //$('#tblappointmentlist').DataTable().ajax.reload();
                        },
                        "fnDrawCallback": function (oSettings) {
                          let checkurlIgnoreDate = FlowRouter.current().queryParams.ignoredate;

                          $('.paginate_button.page-item').removeClass('disabled');
                          $('#tblappointmentlist_ellipsis').addClass('disabled');

                          if(oSettings._iDisplayLength == -1){
                            if(oSettings.fnRecordsDisplay() > 150){
                              $('.paginate_button.page-item.previous').addClass('disabled');
                              $('.paginate_button.page-item.next').addClass('disabled');
                            }
                          }else{

                          }
                          if(oSettings.fnRecordsDisplay() < initialDatatableLoad){
                              $('.paginate_button.page-item.next').addClass('disabled');
                          }

                          $('.paginate_button.next:not(.disabled)', this.api().table().container())
                           .on('click', function(){
                             $('.fullScreenSpin').css('display','inline-block');
                             let dataLenght = oSettings._iDisplayLength;
                             var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
                             var dateTo = new Date($("#dateTo").datepicker("getDate"));

                             let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
                             let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();
                             if(checkurlIgnoreDate == 'true'){
                               sideBarService.getTAppointmentListData(formatDateFrom, formatDateTo, true, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                                 getVS1Data('TAppointmentList').then(function (dataObjectold) {
                                   if(dataObjectold.length == 0){

                                   }else{
                                     let dataOld = JSON.parse(dataObjectold[0].data);

                                     var thirdaryData = $.merge($.merge([], dataObjectnew.tappointmentlist), dataOld.tappointmentlist);
                                     let objCombineData = {
                                       Params: dataOld.Params,
                                       tappointmentlist:thirdaryData
                                     }


                                       addVS1Data('TAppointmentList',JSON.stringify(objCombineData)).then(function (datareturn) {
                                         templateObject.resetData(objCombineData);
                                       $('.fullScreenSpin').css('display','none');
                                       }).catch(function (err) {
                                       $('.fullScreenSpin').css('display','none');
                                       });

                                   }
                                  }).catch(function (err) {

                                  });

                               }).catch(function(err) {
                                 $('.fullScreenSpin').css('display','none');
                               });
                             }else{
                             sideBarService.getTAppointmentListData(formatDateFrom, formatDateTo, false, initialDatatableLoad, oSettings.fnRecordsDisplay()).then(function(dataObjectnew) {
                               getVS1Data('TAppointmentList').then(function (dataObjectold) {
                                 if(dataObjectold.length == 0){

                                 }else{
                                   let dataOld = JSON.parse(dataObjectold[0].data);

                                   var thirdaryData = $.merge($.merge([], dataObjectnew.tappointmentlist), dataOld.tappointmentlist);
                                   let objCombineData = {
                                     Params: dataOld.Params,
                                     tappointmentlist:thirdaryData
                                   }


                                     addVS1Data('TAppointmentList',JSON.stringify(objCombineData)).then(function (datareturn) {
                                       templateObject.resetData(objCombineData);
                                     $('.fullScreenSpin').css('display','none');
                                     }).catch(function (err) {
                                     $('.fullScreenSpin').css('display','none');
                                     });

                                 }
                                }).catch(function (err) {

                                });

                             }).catch(function(err) {
                               $('.fullScreenSpin').css('display','none');
                             });
                            }
                           });

                            setTimeout(function () {
                                MakeNegative();
                            }, 100);
                        },
                        "fnInitComplete": function () {
                          let urlParametersPage = FlowRouter.current().queryParams.page;
                          if (urlParametersPage || FlowRouter.current().queryParams.ignoredate) {
                              this.fnPageChange('last');
                          }
                            $("<button class='btn btn-primary btnRefreshAppointment' type='button' id='btnRefreshAppointment' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>").insertAfter("#tblappointmentlist_filter");
                            $('.myvarFilterForm').appendTo(".colDateFilter");
                        },
                        "fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
                          let countTableData = data.Params.Count || 0; //get count from API data

                            return 'Showing '+ iStart + " to " + iEnd + " of " + countTableData;
                        }
                    }).on('page', function () {
                        setTimeout(function () {
                            MakeNegative();
                        }, 100);
                        let draftRecord = templateObject.datatablerecords.get();
                        templateObject.datatablerecords.set(draftRecord);
                    }).on('column-reorder', function () {

                    });
                    $('.fullScreenSpin').css('display', 'none');
                }, 0);

                var columns = $('#tblappointmentlist th');
                let sTible = "";
                let sWidth = "";
                let sIndex = "";
                let sVisible = "";
                let columVisible = false;
                let sClass = "";
                $.each(columns, function (i, v) {
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
                $('div.dataTables_filter input').addClass('form-control form-control-sm');

            }).catch(function (err) {
                // Bert.alert('<strong>' + err + '</strong>!', 'danger');
                $('.fullScreenSpin').css('display', 'none');
                // Meteor._reload.reload();
            });
        });



    }

    templateObject.getAllAppointmentListData();

    templateObject.getAllFilterAppointmentListData = function(fromDate, toDate, ignoreDate) {
        sideBarService.getTAppointmentListData(fromDate, toDate, ignoreDate,initialReportLoad,0).then(function(data) {
            addVS1Data('TAppointmentList', JSON.stringify(data)).then(function(datareturn) {
                window.open('/appointmentlist?toDate=' + toDate + '&fromDate=' + fromDate + '&ignoredate=' + ignoreDate, '_self');
            }).catch(function(err) {
                location.reload();
            });
        }).catch(function(err) {
            $('.fullScreenSpin').css('display', 'none');
        });
    }

    let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
    let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
    let urlParametersIgnoreDate = FlowRouter.current().queryParams.ignoredate;
    if (urlParametersDateFrom) {
        if (urlParametersIgnoreDate == true) {
            $('#dateFrom').attr('readonly', true);
            $('#dateTo').attr('readonly', true);
        } else {

            $("#dateFrom").val(urlParametersDateFrom != '' ? moment(urlParametersDateFrom).format("DD/MM/YYYY") : urlParametersDateFrom);
            $("#dateTo").val(urlParametersDateTo != '' ? moment(urlParametersDateTo).format("DD/MM/YYYY") : urlParametersDateTo);
        }
    }
    // $(document).on('click', '#hideMe', function() {
    //   var table = $('#tblappointmentlist').DataTable();
    //    $('#tblappointmentlist thead tr').clone(true).appendTo( '#tblappointmentlist thead' );
    //    $('#tblappointmentlist thead tr:eq(1) th').each( function (i) {
    //        var status = "Not Converted"
    //            if ( table.column(i).search() !== status ) {
    //                table
    //                    .column(i)
    //                    .search( this.value )
    //                    .draw();
    //            }
    //    } );


    // let array = [];
    // let appointments = templateObject.datatablerecords.get();
    // for(let x=0; x < appointments.length; x++) {
    //    if(appointments.finished == "Converted") {

    //    }
    // }
    $('#tblappointmentlist tbody').on('click', 'tr td:not(:first-child)', function () {
        var id = $(this).closest('tr').attr('id');
        var checkDeleted = $(this).closest('tr').find('.colStatus').text() || '';
        if(checkDeleted == "Deleted"){
          swal('You Cannot View This Transaction', 'Because It Has Been Deleted', 'info');
        }else{
        window.open('appointments?id=' + id, '_self');
       }
    });


});

Template.appointmentlist.events({
    'click #btnAppointment': function (event) {
        FlowRouter.go('/appointments');
    },
    'change #hideConverted': function () {
        let templateObject = Template.instance();
        let useData = templateObject.datatablerecords.get();
        let dataTableList = [];
        var checkbox = document.querySelector("#hideConverted");
        if (checkbox.checked) {
            if (useData.length > 0) {

                for (let i = 0; i < useData.length; i++) {
                    if (useData[i].finished != "Converted" || useData[i].finished == "Completed") {
                        var dataList = {
                            id: useData[i].id || '',
                            sortdate: useData[i].sortdate,
                            appointmentdate: useData[i].appointmentdate,
                            accountname: useData[i].accountname || '',
                            statementno: useData[i].statementno || '',
                            employeename: useData[i].employeename || '',
                            department: useData[i].department || '',
                            phone: useData[i].phone || '',
                            mobile: useData[i].mobile || '',
                            suburb: useData[i].suburb || '',
                            street: useData[i].street || '',
                            state: useData[i].state || '',
                            country: useData[i].country || '',
                            zip: useData[i].zip || '',
                            startTime: useData[i].startTime || '',
                            timeStart: useData[i].timeStart,
                            timeEnd: useData[i].timeEnd,
                            totalHours: useData[i].totalHours || 0,
                            endTime: useData[i].endTime || '',
                            startDate: useData[i].startDate || '',
                            endDate: useData[i].endDate || '',
                            frmDate: useData[i].frmDate,
                            toDate: useData[i].toDate,
                            fromDate: useData[i].fromDate,
                            openbalance: useData[i].openbalance || '',
                            aStartTime: useData[i].aStartTime || '',
                            aEndTime: useData[i].aEndTime || '',
                            actualHours: '',
                            closebalance: '',
                            product: useData[i].product || '',
                            finished: useData[i].finished || '',
                            notes: useData[i].notes || '',
                            color: "#f6c23e",
                            msRef: useData[i].MSRef || ''
                        };
                        dataTableList.push(dataList);
                    }
                }
                templateObject.datatablerecords.set(dataTableList).sort(function (a, b) {
                    if (a.appointmentdate == 'NA') {
                        return 1;
                    }
                    else if (b.appointmentdate == 'NA') {
                        return -1;
                    }
                    return (a.appointmentdate.toUpperCase() > b.appointmentdate.toUpperCase()) ? 1 : -1;
                });
            }
        } else if (!checkbox.checked) {
            let color = "";
            getVS1Data('TAppointment').then(function (dataObject) {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tappointmentex;
                if (useData.length > 0) {

                    for (let i = 0; i < useData.length; i++) {
                        if (useData[i].fields.Status == "Converted" || useData[i].fields.Status == "Completed") {
                            color = "#1cc88a";
                        } else {
                            color = "#f6c23e";

                        }
                        var dataList = {
                            id: useData[i].fields.ID || '',
                            sortdate: useData[i].fields.CreationDate != '' ? moment(useData[i].fields.CreationDate).format("YYYY/MM/DD") : useData[i].fields.CreationDate,
                            appointmentdate: useData[i].fields.CreationDate != '' ? moment(useData[i].fields.CreationDate).format("DD/MM/YYYY") : useData[i].fields.CreationDate,
                            accountname: useData[i].fields.ClientName || '',
                            statementno: useData[i].fields.TrainerName || '',
                            employeename: useData[i].fields.TrainerName || '',
                            department: useData[i].fields.DeptClassName || '',
                            phone: useData[i].fields.Phone || '',
                            mobile: useData[i].fields.ClientMobile || '',
                            suburb: useData[i].fields.Suburb || '',
                            street: useData[i].fields.Street || '',
                            state: useData[i].fields.State || '',
                            country: useData[i].fields.Country || '',
                            zip: useData[i].fields.Postcode || '',
                            startTime: useData[i].fields.StartTime.split(' ')[1] || '',
                            timeStart: moment(useData[i].fields.StartTime).format('h:mm a'),
                            timeEnd: moment(useData[i].fields.EndTime).format('h:mm a'),
                            totalHours: useData[i].fields.TotalHours || 0,
                            endTime: useData[i].fields.EndTime.split(' ')[1] || '',
                            startDate: useData[i].fields.StartTime || '',
                            endDate: useData[i].fields.EndTime || '',
                            frmDate: moment(useData[i].fields.StartTime).format('dddd') + ', ' + moment(useData[i].fields.StartTime).format('DD'),
                            toDate: moment(useData[i].fields.endTime).format('dddd') + ', ' + moment(useData[i].fields.endTime).format('DD'),
                            fromDate: useData[i].fields.Actual_EndTime != '' ? moment(useData[i].fields.Actual_EndTime).format("DD/MM/YYYY") : useData[i].fields.Actual_EndTime,
                            openbalance: useData[i].fields.Actual_EndTime || '',
                            aStartTime: useData[i].fields.Actual_StartTime.split(' ')[1] || '',
                            aEndTime: useData[i].fields.Actual_EndTime.split(' ')[1] || '',
                            actualHours: '',
                            closebalance: '',
                            product: useData[i].fields.ProductDesc || '',
                            finished: useData[i].fields.Status || '',
                            notes: useData[i].fields.Notes || '',
                            color: color,
                            msRef: useData[i].fields.MSRef || ''
                        };
                        dataTableList.push(dataList);
                    }
                    templateObject.datatablerecords.set(dataTableList).sort(function (a, b) {
                        if (a.appointmentdate == 'NA') {
                            return 1;
                        }
                        else if (b.appointmentdate == 'NA') {
                            return -1;
                        }
                        return (a.appointmentdate.toUpperCase() > b.appointmentdate.toUpperCase()) ? 1 : -1;
                    });
                }
            })
        }
    },
    'click .btnRefresh': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let isDoneAppointment = false;
        let isDoneInvoice = false;

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

        sideBarService.getTAppointmentListData(prevMonth11Date,toDate, false,initialReportLoad,0).then(function (dataApp) {

          addVS1Data('TAppointmentList', JSON.stringify(dataApp)).then(function (datareturn) {
            sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
              if(data.tappointmentex.length > 0){
                addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                    isDoneAppointment = true;
                    window.open('/appointmentlist','_self');
                }).catch(function (err) {
                    isDoneAppointment = true;
                    window.open('/appointmentlist','_self');
                });
              }
            }).catch(function (err) {
                isDoneAppointment = true;
                window.open('/appointmentlist','_self');
            });

          }).catch(function (err) {
            sideBarService.getAllAppointmentList(initialDataLoad,0).then(function (data) {
              if(data.tappointmentex.length > 0){
                addVS1Data('TAppointment', JSON.stringify(data)).then(function (datareturn) {
                    isDoneAppointment = true;
                    window.open('/appointmentlist','_self');
                }).catch(function (err) {
                    isDoneAppointment = true;
                    window.open('/appointmentlist','_self');
                });
              }
            }).catch(function (err) {
                isDoneAppointment = true;
                window.open('/appointmentlist','_self');
            });

          });
        }).catch(function (err) {
          window.open('/appointmentlist', '_self');
        });


        sideBarService.getAllInvoiceList(initialDataLoad,0).then(function (data) {
            addVS1Data('TInvoiceEx', JSON.stringify(data)).then(function (datareturn) {
                isDoneInvoice = true;
                if((isDoneAppointment == true) && (isDoneInvoice == true)){

                }
            }).catch(function (err) {
                isDoneInvoice = true;
                if((isDoneAppointment == true) && (isDoneInvoice == true)){

                }
            });
        }).catch(function (err) {
            isDoneInvoice = true;
            if((isDoneAppointment == true) && (isDoneInvoice == true)){

            }
        });

        sideBarService.getAllAppointmentPredList().then(function (data) {
            addVS1Data('TAppointmentPreferences', JSON.stringify(data)).then(function (datareturn) {

            }).catch(function (err) {

            });
        }).catch(function (err) {

        });


    },
    'change #dateTo': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

        //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {

        } else {
            templateObject.getAllFilterAppointmentListData(formatDateFrom, formatDateTo, false);
        }

    },
    'change #dateFrom': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
        var dateTo = new Date($("#dateTo").datepicker("getDate"));

        let formatDateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate();
        let formatDateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate();

        //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
        var formatDate = dateTo.getDate() + "/" + (dateTo.getMonth() + 1) + "/" + dateTo.getFullYear();
        //templateObject.dateAsAt.set(formatDate);
        if (($("#dateFrom").val().replace(/\s/g, '') == "") && ($("#dateFrom").val().replace(/\s/g, '') == "")) {

        } else {
            templateObject.getAllFilterAppointmentListData(formatDateFrom, formatDateTo, false);
        }

    },
    'click #today': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
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
        var toDateERPFrom = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);
        var toDateERPTo = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);

        var toDateDisplayFrom = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
        var toDateDisplayTo = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();

        $("#dateFrom").val(toDateDisplayFrom);
        $("#dateTo").val(toDateDisplayTo);
        templateObject.getAllFilterAppointmentListData(toDateERPFrom,toDateERPTo, false);
    },
    'click #lastweek': function () {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
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
        var toDateERPFrom = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay - 7);
        var toDateERPTo = currentBeginDate.getFullYear()+ "-" +(fromDateMonth) + "-"+(fromDateDay);

        var toDateDisplayFrom = (fromDateDay -7)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();
        var toDateDisplayTo = (fromDateDay)+ "/" +(fromDateMonth) + "/"+currentBeginDate.getFullYear();

        $("#dateFrom").val(toDateDisplayFrom);
        $("#dateTo").val(toDateDisplayTo);
        templateObject.getAllFilterAppointmentListData(toDateERPFrom,toDateERPTo, false);
    },
    'click #lastMonth': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentDate = new Date();

        var prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        var prevMonthFirstDate = new Date(currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1), (currentDate.getMonth() - 1 + 12) % 12, 1);

        var formatDateComponent = function(dateComponent) {
          return (dateComponent < 10 ? '0' : '') + dateComponent;
        };

        var formatDate = function(date) {
          return  formatDateComponent(date.getDate()) + '/' + formatDateComponent(date.getMonth() + 1) + '/' + date.getFullYear();
        };

        var formatDateERP = function(date) {
          return  date.getFullYear() + '-' + formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate());
        };


        var fromDate = formatDate(prevMonthFirstDate);
        var toDate = formatDate(prevMonthLastDate);

        $("#dateFrom").val(fromDate);
        $("#dateTo").val(toDate);

        var getLoadDate = formatDateERP(prevMonthLastDate);
        let getDateFrom = formatDateERP(prevMonthFirstDate);
        templateObject.getAllFilterAppointmentListData(getDateFrom, getLoadDate, false);
    },
    'click #lastQuarter': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        function getQuarter(d) {
            d = d || new Date();
            var m = Math.floor(d.getMonth() / 3) + 2;
            return m > 4 ? m - 4 : m;
        }

        var quarterAdjustment = (moment().month() % 3) + 1;
        var lastQuarterEndDate = moment().subtract({
            months: quarterAdjustment
        }).endOf('month');
        var lastQuarterStartDate = lastQuarterEndDate.clone().subtract({
            months: 2
        }).startOf('month');

        var lastQuarterStartDateFormat = moment(lastQuarterStartDate).format("DD/MM/YYYY");
        var lastQuarterEndDateFormat = moment(lastQuarterEndDate).format("DD/MM/YYYY");


        $("#dateFrom").val(lastQuarterStartDateFormat);
        $("#dateTo").val(lastQuarterEndDateFormat);

        let fromDateMonth = getQuarter(currentDate);
        var quarterMonth = getQuarter(currentDate);
        let fromDateDay = currentDate.getDate();

        var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
        let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
        templateObject.getAllFilterAppointmentListData(getDateFrom, getLoadDate, false);
    },
    'click #last12Months': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', false);
        $('#dateTo').attr('readonly', false);
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");

        let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
        let fromDateDay = currentDate.getDate();
        if ((currentDate.getMonth() + 1) < 10) {
            fromDateMonth = "0" + (currentDate.getMonth() + 1);
        }
        if (currentDate.getDate() < 10) {
            fromDateDay = "0" + currentDate.getDate();
        }

        var fromDate = fromDateDay + "/" + (fromDateMonth) + "/" + Math.floor(currentDate.getFullYear() - 1);
        $("#dateFrom").val(fromDate);
        $("#dateTo").val(begunDate);

        var currentDate2 = new Date();
        if ((currentDate2.getMonth() + 1) < 10) {
            fromDateMonth2 = "0" + Math.floor(currentDate2.getMonth() + 1);
        }
        if (currentDate2.getDate() < 10) {
            fromDateDay2 = "0" + currentDate2.getDate();
        }
        var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
        let getDateFrom = Math.floor(currentDate2.getFullYear() - 1) + "-" + fromDateMonth2 + "-" + currentDate2.getDate();
        templateObject.getAllFilterAppointmentListData(getDateFrom, getLoadDate, false);

    },
    'click #ignoreDate': function() {
        let templateObject = Template.instance();
        $('.fullScreenSpin').css('display', 'inline-block');
        $('#dateFrom').attr('readonly', true);
        $('#dateTo').attr('readonly', true);
        templateObject.getAllFilterAppointmentListData('', '', true);
    },
    'click .chkDatatable': function (event) {
        var columns = $('#tblappointmentlist th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function (i, v) {
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
    'keyup #tblappointmentlist_filter input': function (event) {
          if($(event.target).val() != ''){
            $(".btnRefreshAppointment").addClass('btnSearchAlert');
          }else{
            $(".btnRefreshAppointment").removeClass('btnSearchAlert');
          }
          if (event.keyCode == 13) {
             $(".btnRefreshAppointment").trigger("click");
          }
        },
        'click .btnRefreshAppointment':function(event){
        $(".btnRefresh").trigger("click");
    },
    'click .resetTable': function (event) {
        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblappointmentlist' });
                if (checkPrefDetails) {
                    CloudPreference.remove({ _id: checkPrefDetails._id }, function (err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'submit #frmAppointment': function (event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        let appointmentService = new AppointmentService();
        var frmAppointment = $('#frmAppointment')[0];
        event.preventDefault();
        var formData = new FormData(frmAppointment);
        let aStartDate = '';
        let aEndDate = '';
        let clientname = formData.get('customer') || '';
        let clientmobile = formData.get('mobile') || '0';
        let contact = formData.get('phone') || '0';
        let startTime = formData.get('startTime') || '';
        let endTime = formData.get('endTime') || '';
        let aStartTime = formData.get('tActualStartTime') || '';
        let aEndTime = formData.get('endTime') || '';
        let state = formData.get('state') || '';
        let country = formData.get('country') || '';
        let street = formData.get('address') || '';
        let zip = formData.get('zip') || '';
        let suburb = formData.get('suburb') || '';
        var startdateGet = new Date($("#dtSODate").datepicker("getDate"));
        var endDateGet = new Date($("#dtSODate2").datepicker("getDate"));
        let startDate = startdateGet.getFullYear() + "-" + (startdateGet.getMonth() + 1) + "-" + startdateGet.getDate();
        let endDate = endDateGet.getFullYear() + "-" + (endDateGet.getMonth() + 1) + "-" + endDateGet.getDate();

        let employeeName = formData.get('employee_name').trim() || '';
        let id = formData.get('updateID') || '0';
        let notes = formData.get('txtNotes') || ' ';
        let selectedProduct = $('#product-list').children("option:selected").text() || '';;
        let status = "Not Converted";
        if (aStartTime != '') {
            aStartDate = moment().format("YYYY-MM-DD") + ''
        }

        if (aEndTime != '') {
            aEndDate = moment().format("YYYY-MM-DD") + ' ' + aEndTime;
        }

        if (aStartTime != '') {
            aStartDate = moment().format("YYYY-MM-DD") + ' ' + aStartTime;
        }
        let objectData = "";
        let timeLog = [];
        let obj = {
            type: "TAppointmentsTimeLog",
            fields: {
                AppointID: parseInt(id),
                StartDatetime: aStartTime,
                EndDatetime: aEndTime
            }
        };
        if (obj.StartDatetime != "" && obj.EndDatetime != "") {
            timeLog.push(obj)
        } else {
            timeLog = '';
        }

        if (id == '0') {
            objectData = {
                type: "TAppointment",
                fields: {
                    ClientName: clientname,
                    Mobile: clientmobile,
                    Phone: contact,
                    StartTime: startDate + ' ' + startTime,
                    EndTime: endDate + ' ' + endTime,
                    Street: street,
                    Suburb: suburb,
                    State: state,
                    Postcode: zip,
                    Country: country,
                    Actual_StartTime: aStartDate,
                    Actual_EndTime: aEndDate,
                    TrainerName: employeeName,
                    Notes: notes,
                    ProductDesc: selectedProduct,
                    Status: status
                }
            };
        } else {
            objectData = {
                type: "TAppointment",
                fields: {
                    Id: parseInt(id),
                    ClientName: clientname,
                    Mobile: clientmobile,
                    Phone: contact,
                    StartTime: startDate + ' ' + startTime,
                    EndTime: endDate + ' ' + endTime,
                    AppointmentsTimeLog: timeLog,
                    Street: street,
                    Suburb: suburb,
                    State: state,
                    Postcode: zip,
                    Country: country,
                    Actual_StartTime: aStartDate,
                    Actual_EndTime: aEndDate,
                    TrainerName: employeeName,
                    Notes: notes,
                    ProductDesc: selectedProduct,
                    Status: status
                }
            };
        }
        appointmentService.saveAppointment(objectData).then(function (data) {
            //FlowRouter.go('/appointmentlist');
            window.open('/appointmentlist', '_self');
        }).catch(function (err) {
            $('.fullScreenSpin').css('display', 'none');
        });


    },
    'click #btnStartActualTime': function () {
        $('#startActualTimeModal').modal('show');
        document.getElementById("tActualStartTime").value = moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm');
    },
    'click #btnEndActualTime': function () {
        if (document.getElementById("tActualStartTime").value == "") { } else {
            document.getElementById("tActualEndTime").value = moment().startOf('hour').format('HH') + ":" + moment().startOf('minute').format('mm');
            var actualStartTime = moment(document.getElementById("tActualStartTime").value, 'HH:mm').format('HH:mm');
            var actualEndTime = moment(document.getElementById("tActualEndTime").value, 'HH:mm').format('HH:mm');
            var txtActualHoursSpent = getHours(actualStartTime, actualEndTime);
            document.getElementById("txtActualHoursSpent").value = txtActualHoursSpent;

        }
    },
    'change #startTime': function () {
        var endTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("endTime").value).format('YYYY-MM-DD HH:mm');
        var startTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("startTime").value).format('YYYY-MM-DD HH:mm');
        if (moment(startTime).isAfter(endTime)) {

        } else {
            var duration = moment.duration(moment(endTime).diff(moment(startTime)));
            var hours = duration.asHours();
            document.getElementById('txtBookedHoursSpent').value = parseFloat(hours).toFixed(2);
        }
    },
    'change #endTime': function () {
        var endTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("endTime").value).format('YYYY-MM-DD HH:mm');
        var startTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("startTime").value).format('YYYY-MM-DD HH:mm');
        if (moment(endTime).isAfter(startTime)) {
            var duration = moment.duration(moment(endTime).diff(moment(startTime)));
            var hours = duration.asHours();
            document.getElementById('txtBookedHoursSpent').value = parseFloat(hours).toFixed(2);

        } else {

        }
    },
    'change #tActualStartTime': function () {
        var endTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("tActualEndTime").value).format('YYYY-MM-DD HH:mm');
        var startTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("tActualStartTime").value).format('YYYY-MM-DD HH:mm');
        if (moment(startTime).isAfter(endTime)) {

        } else {
            var duration = moment.duration(moment(endTime).diff(moment(startTime)));
            var hours = duration.asHours();
            document.getElementById('txtActualHoursSpent').value = parseFloat(hours).toFixed(2);
        }
    },
    'change #tActualEndTime': function () {
        var endTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("tActualEndTime").value).format('YYYY-MM-DD HH:mm');
        var startTime = moment(document.getElementById("dtSODate2").value + ' ' + document.getElementById("tActualStartTime").value).format('YYYY-MM-DD HH:mm');
        if (document.getElementById("tActualStartTime").value != '') {
            if (moment(endTime).isAfter(startTime)) {
                var duration = moment.duration(moment(endTime).diff(moment(startTime)));
                var hours = duration.asHours();
                document.getElementById('txtActualHoursSpent').value = parseFloat(hours).toFixed(2);

            } else {

            }
        } else {
            document.getElementById("tActualEndTime").value = '';
        }
    },
    'click .saveTable': function (event) {
        let lineItems = [];
        $('.columnSettings').each(function (index) {
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

        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblappointmentlist' });
                if (checkPrefDetails) {
                    CloudPreference.update({ _id: checkPrefDetails._id }, {
                        $set: {
                            userid: clientID, username: clientUsername, useremail: clientEmail,
                            PrefGroup: 'salesform', PrefName: 'tblappointmentlist', published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');
                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID, username: clientUsername, useremail: clientEmail,
                        PrefGroup: 'salesform', PrefName: 'tblappointmentlist', published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function (err, idTag) {
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
    'blur .divcolumn': function (event) {
        let columData = $(event.target).text();
        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');
        var datable = $('#tblappointmentlist').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function (event) {
        let range = $(event.target).val();
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblappointmentlist th');
        $.each(datable, function (i, v) {
            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettings': function (event) {
        let templateObject = Template.instance();
        var columns = $('#tblappointmentlist th');
        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function (i, v) {
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
    'click #exportbtn': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblappointmentlist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display', 'none');

    },
    'click .printConfirm': function (event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblappointmentlist_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display', 'none');
    },
    'click #check-all': function (event) {
        if ($(event.target).is(':checked')) {
            $(".chkBox").prop("checked", true);
        } else {
            $(".chkBox").prop("checked", false);
        }
    },
    'click .chkBox': function () {
        var listData = $(this).closest('tr').attr('id');
        var selectedClient = $(this.target).closest("tr").find(".colAccountName").text();
        const templateObject = Template.instance();
        const selectedAppointmentList = [];
        const selectedAppointmentCheck = [];
        let ids = [];
        let JsonIn = {};
        let JsonIn1 = {};
        let myStringJSON = '';
        $('.chkBox:checkbox:checked').each(function () {
            var chkIdLine = $(this).closest('tr').attr('id');
            let obj = {
                AppointID: parseInt(chkIdLine)
            }
            //var customername = $(this).closest('#colAccountName').text();



            // JsonIn1 = {
            //   AppointID:chkIdLine,
            //   clientname : $('#colAccountName'+chkIdLine).text()
            // };

            //   if (selectedAppointmentCheck.length > 0) {
            //    var checkClient = selectedAppointmentCheck.filter(slctdApt => {
            //      return slctdApt.clientname == $('#colAccountName' + chkIdLine).text();
            //    });


            //    if (checkClient.length > 0) {
            //     selectedAppointmentList.push(JsonIn);
            //     selectedAppointmentCheck.push(JsonIn1)
            //    } else {
            //      swal('WARNING','You have selected multiple Customers,  a seperate invoice will be created for each', 'error');
            //      $(this).prop("checked", false);
            //    }
            //  } else {
            selectedAppointmentList.push(obj);

            templateObject.selectedAppointmentID.set(chkIdLine);
            // selectedAppointmentCheck.push(JsonIn1);
            // }
        });
        JsonIn = {
            Params: {
                AppointIDs: selectedAppointmentList
            }
        };
        templateObject.selectedAppointment.set(JsonIn);
    },
    'click #btnInvoice': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        const templateObject = Template.instance();
        let selectClient = templateObject.selectedAppointment.get();
        let selectAppointmentID = templateObject.selectedAppointmentID.get();
        if (selectClient.length === 0) {
            swal('Please select Appointment to generate invoice for!', '', 'info');
            $('.fullScreenSpin').css('display', 'none');
        } else {
            let appointmentService = new AppointmentService();
            var erpGet = erpDb();
            var oPost = new XMLHttpRequest();
            oPost.open("POST", URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_InvoiceAppt"', true);
            oPost.setRequestHeader("database", erpGet.ERPDatabase);
            oPost.setRequestHeader("username", erpGet.ERPUsername);
            oPost.setRequestHeader("password", erpGet.ERPPassword);
            oPost.setRequestHeader("Accept", "application/json");
            oPost.setRequestHeader("Accept", "application/html");
            oPost.setRequestHeader("Content-type", "application/json");
            // let objDataSave = '"JsonIn"' + ':' + JSON.stringify(selectClient);
            oPost.send(JSON.stringify(selectClient));

            oPost.onreadystatechange = function () {
                if (oPost.readyState == 4 && oPost.status == 200) {
                    $('.fullScreenSpin').css('display', 'none');
                    var myArrResponse = JSON.parse(oPost.responseText);
                    if (myArrResponse.ProcessLog.ResponseStatus.includes("OK")) {
                        let objectDataConverted = {
                            type: "TAppointmentEx",
                            fields: {
                                Id: parseInt(selectAppointmentID),
                                Status: "Converted"
                            }
                        };
                        appointmentService.saveAppointment(objectDataConverted).then(function (data) {
                            FlowRouter.go('/invoicelist?success=true');
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });

                        templateObject.getAllAppointmentDataOnConvert();



                    } else {
                        swal({
                            title: 'Oooops...',
                            text: myArrResponse.ProcessLog.ResponseStatus,
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {

                            } else if (result.dismiss === 'cancel') {

                            }
                        });
                    }

                } else if (oPost.readyState == 4 && oPost.status == 403) {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oooops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                } else if (oPost.readyState == 4 && oPost.status == 406) {
                    $('.fullScreenSpin').css('display', 'none');
                    var ErrorResponse = oPost.getResponseHeader('errormessage');
                    var segError = ErrorResponse.split(':');

                    if ((segError[1]) == ' "Unable to lock object') {

                        swal({
                            title: 'Oooops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                            } else if (result.dismiss === 'cancel') {

                            }
                        });
                    } else {
                        swal({
                            title: 'Oooops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                            } else if (result.dismiss === 'cancel') {

                            }
                        });
                    }

                } else if (oPost.readyState == '') {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oooops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                }

            }
            // appointmentService.appointmentCreateInv(selectClient).then(function (data) {
            //   //FlowRouter.go('/appointmentlist');
            //   //window.open('/appointments', '_self');
            // }).catch(function (err) {
            //   $('.fullScreenSpin').css('display', 'none');
            // });
        }

    }

});

Template.appointmentlist.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.appointmentdate == 'NA') {
                return 1;
            }
            else if (b.appointmentdate == 'NA') {
                return -1;
            }
            return (a.appointmentdate.toUpperCase() > b.appointmentdate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    clientrecords: () => {
        return Template.instance().clientrecords.get();
    },
    productsrecord: () => {
        return Template.instance().productsrecord.get().sort(function (a, b) {
            if (a.productname == 'NA') {
                return 1;
            }
            else if (b.productname == 'NA') {
                return -1;
            }
            return (a.productname.toUpperCase() > b.productname.toUpperCase()) ? 1 : -1;
        });
    },
    purchasesCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: Session.get('mycloudLogonID'), PrefName: 'tblappointmentlist' });
    }

});
