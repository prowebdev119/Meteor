import { ContactService } from "../contacts/contact-service";
import { ReactiveVar } from "meteor/reactive-var";
import { CoreService } from "../js/core-service";
import { AccountService } from "../accounts/account-service";
import { UtilityService } from "../utility-service";
import { SalesBoardService } from "../js/sales-service";
import { SideBarService } from "../js/sidebar-service";
import "../lib/global/indexdbstorage.js";
let sideBarService = new SideBarService();
let utilityService = new UtilityService();


Template.contactoverview.onCreated(function () {
  const templateObject = Template.instance();
  templateObject.datatablerecords = new ReactiveVar([]);
  templateObject.tableheaderrecords = new ReactiveVar([]);
  //templateObject.topTenData = new ReactiveVar([]);
  //templateObject.loggeduserdata = new ReactiveVar([]);
});

Template.contactoverview.onRendered(function () {
  $(".fullScreenSpin").css("display", "inline-block");
  let templateObject = Template.instance();
  let accountService = new AccountService();
  let contactService = new ContactService();
  const customerList = [];
  let salesOrderTable;
  const dataTableList = [];
  const tableHeaderList = [];
  const loggedUserList = [];
  var splashArray = new Array();

  let topTenData1 = [];
  let topTenSuppData1 = [];
  let topData = this;

  var today = moment().format("DD/MM/YYYY");
  var currentDate = new Date();
  var begunDate = moment(currentDate).format("DD/MM/YYYY");
  let fromDateMonth = currentDate.getMonth() + 1;
  let fromDateDay = currentDate.getDate();
  if (currentDate.getMonth() + 1 < 10) {
    fromDateMonth = "0" + (currentDate.getMonth() + 1);
  }

  if (currentDate.getDate() < 10) {
    fromDateDay = "0" + currentDate.getDate();
  }
  var fromDate =
    fromDateDay + "/" + fromDateMonth + "/" + currentDate.getFullYear();

  $("#date-input,#dateTo,#dateFrom").datepicker({
    showOn: "button",
    buttonText: "Show Date",
    buttonImageOnly: true,
    buttonImage: "/img/imgCal2.png",
    dateFormat: "dd/mm/yy",
    showOtherMonths: true,
    selectOtherMonths: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-90:+10",
  });

  $("#dateFrom").val(fromDate);
  $("#dateTo").val(begunDate);


  Meteor.call(
    "readPrefMethod",
    Session.get("mycloudLogonID"),
    "tblcontactoverview",
    function (error, result) {
      if (error) {
      } else {
        if (result) {
          for (let i = 0; i < result.customFields.length; i++) {
            let customcolumn = result.customFields;
            let columData = customcolumn[i].label;
            let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
            let hiddenColumn = customcolumn[i].hidden;
            let columnClass = columHeaderUpdate.split(".")[1];
            let columnWidth = customcolumn[i].width;

            $("th." + columnClass + "").html(columData);
            $("th." + columnClass + "").css("width", "" + columnWidth + "px");
          }
        }
      }
    }
  );

  function MakeNegative() {
    $("td").each(function () {
      if (
        $(this)
          .text()
          .indexOf("-" + Currency) >= 0
      )
        $(this).addClass("text-danger");
    });
  }

  templateObject.resetData = function (dataVal) {
    window.open("/contactoverview?page=last", "_self");
  };

  templateObject.getAllContactData = function () {
    getVS1Data("TERPCombinedContactsVS1")
      .then(function (dataObject) {
        if (dataObject.length == 0) {
          sideBarService
            .getAllContactCombineVS1(initialDataLoad, 0)
            .then(function (data) {
              $(".fullScreenSpin").css("display", "none");
              let lineItems = [];
              let lineItemObj = {};
              let clienttype = "";

              let isprospect = false;
              let iscustomer = false;
              let isEmployee = false;
              let issupplier = false;
              for (let i = 0; i < data.terpcombinedcontactsvs1.length; i++) {
                isprospect = data.terpcombinedcontactsvs1[i].isprospect;
                iscustomer = data.terpcombinedcontactsvs1[i].iscustomer;
                isEmployee = data.terpcombinedcontactsvs1[i].isEmployee;
                issupplier = data.terpcombinedcontactsvs1[i].issupplier;

                if (
                  isprospect == true &&
                  iscustomer == true &&
                  isEmployee == true &&
                  issupplier == true
                ) {
                  clienttype = "Customer / Employee / Prospect / Supplier";
                } else if (
                  isprospect == true &&
                  iscustomer == true &&
                  issupplier == true
                ) {
                  clienttype = "Customer / Prospect / Supplier";
                } else if (iscustomer == true && issupplier == true) {
                  clienttype = "Customer / Supplier";
                } else if (iscustomer == true) {
                  if (
                    data.terpcombinedcontactsvs1[i].name
                      .toLowerCase()
                      .indexOf("^") >= 0
                  ) {
                    clienttype = "Job";
                  } else {
                    clienttype = "Customer";
                  }
                  // clienttype = "Customer";
                } else if (isEmployee == true) {
                  clienttype = "Employee";
                } else if (issupplier == true) {
                  clienttype = "Supplier";
                } else if (isprospect == true) {
                  clienttype = "Prospect";
                } else {
                  clienttype = " ";
                }
                // if(data.terpcombinedcontactsvs1[i].IsCustomer == true){
                //   clienttype = "Customer";
                // }else if(data.terpcombinedcontactsvs1[i].IsSupplier == true){
                //   clienttype = "Supplier";
                // };

                let arBalance =
                  utilityService.modifynegativeCurrencyFormat(
                    data.terpcombinedcontactsvs1[i].ARBalance
                  ) || 0.0;
                let creditBalance =
                  utilityService.modifynegativeCurrencyFormat(
                    data.terpcombinedcontactsvs1[i].CreditBalance
                  ) || 0.0;
                let balance =
                  utilityService.modifynegativeCurrencyFormat(
                    data.terpcombinedcontactsvs1[i].Balance
                  ) || 0.0;
                let creditLimit =
                  utilityService.modifynegativeCurrencyFormat(
                    data.terpcombinedcontactsvs1[i].CreditLimit
                  ) || 0.0;
                let salesOrderBalance =
                  utilityService.modifynegativeCurrencyFormat(
                    data.terpcombinedcontactsvs1[i].SalesOrderBalance
                  ) || 0.0;
                if (isNaN(data.terpcombinedcontactsvs1[i].ARBalance)) {
                  arBalance = Currency + "0.00";
                }

                if (isNaN(data.terpcombinedcontactsvs1[i].CreditBalance)) {
                  creditBalance = Currency + "0.00";
                }
                if (isNaN(data.terpcombinedcontactsvs1[i].Balance)) {
                  balance = Currency + "0.00";
                }
                if (isNaN(data.terpcombinedcontactsvs1[i].CreditLimit)) {
                  creditLimit = Currency + "0.00";
                }

                if (isNaN(data.terpcombinedcontactsvs1[i].SalesOrderBalance)) {
                  salesOrderBalance = Currency + "0.00";
                }

                var dataList = {
                  id: data.terpcombinedcontactsvs1[i].ID || "",
                  employeeno: data.terpcombinedcontactsvs1[i].printname || "",
                  clientname: data.terpcombinedcontactsvs1[i].name || "",
                  phone: data.terpcombinedcontactsvs1[i].phone || "",
                  mobile: data.terpcombinedcontactsvs1[i].mobile || "",
                  arbalance: arBalance || 0.0,
                  creditbalance: creditBalance || 0.0,
                  balance: balance || 0.0,
                  creditlimit: creditLimit || 0.0,
                  salesorderbalance: salesOrderBalance || 0.0,
                  email: data.terpcombinedcontactsvs1[i].email || "",
                  address: data.terpcombinedcontactsvs1[i].street || "",
                  // country: data.terpcombinedcontactsvs1[i].Country || '',
                  // department: data.terpcombinedcontactsvs1[i].DefaultClassName || '',
                  type: clienttype || "",
                  custFld1: data.terpcombinedcontactsvs1[i].CUSTFLD1 || "",
                  custFld2: data.terpcombinedcontactsvs1[i].CUSTFLD2 || "",
                };

                if (
                  data.terpcombinedcontactsvs1[i].name.replace(/\s/g, "") !== ""
                ) {
                  dataTableList.push(dataList);
                }

                //}
              }
              templateObject.datatablerecords.set(dataTableList);

              if (templateObject.datatablerecords.get()) {
                Meteor.call(
                  "readPrefMethod",
                  Session.get("mycloudLogonID"),
                  "tblcontactoverview",
                  function (error, result) {
                    if (error) {
                    } else {
                      if (result) {
                        for (let i = 0; i < result.customFields.length; i++) {
                          let customcolumn = result.customFields;
                          let columData = customcolumn[i].label;
                          let columHeaderUpdate = customcolumn[
                            i
                          ].thclass.replace(/ /g, ".");
                          let hiddenColumn = customcolumn[i].hidden;
                          let columnClass = columHeaderUpdate.split(".")[1];
                          let columnWidth = customcolumn[i].width;
                          let columnindex = customcolumn[i].index + 1;

                          if (hiddenColumn == true) {
                            $("." + columnClass + "").addClass("hiddenColumn");
                            $("." + columnClass + "").removeClass("showColumn");
                          } else if (hiddenColumn == false) {
                            $("." + columnClass + "").removeClass(
                              "hiddenColumn"
                            );
                            $("." + columnClass + "").addClass("showColumn");
                          }
                        }
                      }
                    }
                  }
                );

                setTimeout(function () {
                  MakeNegative();
                }, 100);
              }

              setTimeout(function () {
                $("#tblcontactoverview")
                  .DataTable({
                    select: true,
                    destroy: true,
                    colReorder: true,
                    sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                    buttons: [
                      {
                        extend: "excelHtml5",
                        text: "",
                        download: "open",
                        className: "btntabletocsv hiddenColumn",
                        filename: "Contact Overview - " + moment().format(),
                        orientation: "portrait",
                        exportOptions: {
                          columns: ":visible",
                        },
                      },
                      {
                        extend: "print",
                        download: "open",
                        className: "btntabletopdf hiddenColumn",
                        text: "",
                        title: "Contact Overview",
                        filename: "Contact Overview - " + moment().format(),
                        exportOptions: {
                          columns: ":visible",
                          stripHtml: false,
                        },
                      },
                    ],
                    // bStateSave: true,
                    // rowId: 0,
                    pageLength: initialDatatableLoad,
                    // "bLengthChange": false,
                    lengthMenu: [
                      [initialDatatableLoad, -1],
                      [initialDatatableLoad, "All"],
                    ],
                    info: true,
                    responsive: true,
                    // "order": [[ 0, "asc" ]],
                    action: function () {
                      $("#tblcontactoverview").DataTable().ajax.reload();
                    },
                    fnDrawCallback: function (oSettings) {
                      setTimeout(function () {
                        MakeNegative();
                      }, 100);
                    },
                    fnInitComplete: function () {
                      let urlParametersPage =
                        FlowRouter.current().queryParams.page;
                      if (urlParametersPage) {
                        this.fnPageChange("last");
                      }
                      $(
                        "<button class='btn btn-primary btnRefreshContact' type='button' id='btnRefreshContact' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                      ).insertAfter("#tblcontactoverview_filter");
                    },
                  })
                  .on("page", function () {
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                    let draftRecord = templateObject.datatablerecords.get();
                    templateObject.datatablerecords.set(draftRecord);
                  })
                  .on("column-reorder", function () {})
                  .on("length.dt", function (e, settings, len) {
                    $(".fullScreenSpin").css("display", "inline-block");
                    let dataLenght = settings._iDisplayLength;
                    if (dataLenght == -1) {
                      if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                        $(".fullScreenSpin").css("display", "none");
                      } else {
                        sideBarService
                          .getAllContactCombineVS1("All", 1)
                          .then(function (data) {
                            let lineItems = [];
                            let lineItemObj = {};
                            let clienttype = "";

                            let isprospect = false;
                            let iscustomer = false;
                            let isEmployee = false;
                            let issupplier = false;
                            for (
                              let i = 0;
                              i < data.terpcombinedcontactsvs1.length;
                              i++
                            ) {
                              isprospect =
                                data.terpcombinedcontactsvs1[i].isprospect;
                              iscustomer =
                                data.terpcombinedcontactsvs1[i].iscustomer;
                              isEmployee =
                                data.terpcombinedcontactsvs1[i].isEmployee;
                              issupplier =
                                data.terpcombinedcontactsvs1[i].issupplier;

                              if (
                                isprospect == true &&
                                iscustomer == true &&
                                isEmployee == true &&
                                issupplier == true
                              ) {
                                clienttype =
                                  "Customer / Employee / Prospect / Supplier";
                              } else if (
                                isprospect == true &&
                                iscustomer == true &&
                                issupplier == true
                              ) {
                                clienttype = "Customer / Prospect / Supplier";
                              } else if (
                                iscustomer == true &&
                                issupplier == true
                              ) {
                                clienttype = "Customer / Supplier";
                              } else if (iscustomer == true) {
                                if (
                                  data.terpcombinedcontactsvs1[i].name
                                    .toLowerCase()
                                    .indexOf("^") >= 0
                                ) {
                                  clienttype = "Job";
                                } else {
                                  clienttype = "Customer";
                                }
                                // clienttype = "Customer";
                              } else if (isEmployee == true) {
                                clienttype = "Employee";
                              } else if (issupplier == true) {
                                clienttype = "Supplier";
                              } else if (isprospect == true) {
                                clienttype = "Prospect";
                              } else {
                                clienttype = " ";
                              }
                              // if(data.terpcombinedcontactsvs1[i].IsCustomer == true){
                              //   clienttype = "Customer";
                              // }else if(data.terpcombinedcontactsvs1[i].IsSupplier == true){
                              //   clienttype = "Supplier";
                              // };

                              let arBalance =
                                utilityService.modifynegativeCurrencyFormat(
                                  data.terpcombinedcontactsvs1[i].ARBalance
                                ) || 0.0;
                              let creditBalance =
                                utilityService.modifynegativeCurrencyFormat(
                                  data.terpcombinedcontactsvs1[i].CreditBalance
                                ) || 0.0;
                              let balance =
                                utilityService.modifynegativeCurrencyFormat(
                                  data.terpcombinedcontactsvs1[i].Balance
                                ) || 0.0;
                              let creditLimit =
                                utilityService.modifynegativeCurrencyFormat(
                                  data.terpcombinedcontactsvs1[i].CreditLimit
                                ) || 0.0;
                              let salesOrderBalance =
                                utilityService.modifynegativeCurrencyFormat(
                                  data.terpcombinedcontactsvs1[i]
                                    .SalesOrderBalance
                                ) || 0.0;
                              if (
                                isNaN(data.terpcombinedcontactsvs1[i].ARBalance)
                              ) {
                                arBalance = Currency + "0.00";
                              }

                              if (
                                isNaN(
                                  data.terpcombinedcontactsvs1[i].CreditBalance
                                )
                              ) {
                                creditBalance = Currency + "0.00";
                              }
                              if (
                                isNaN(data.terpcombinedcontactsvs1[i].Balance)
                              ) {
                                balance = Currency + "0.00";
                              }
                              if (
                                isNaN(
                                  data.terpcombinedcontactsvs1[i].CreditLimit
                                )
                              ) {
                                creditLimit = Currency + "0.00";
                              }

                              if (
                                isNaN(
                                  data.terpcombinedcontactsvs1[i]
                                    .SalesOrderBalance
                                )
                              ) {
                                salesOrderBalance = Currency + "0.00";
                              }

                              var dataList = {
                                id: data.terpcombinedcontactsvs1[i].ID || "",
                                employeeno:
                                  data.terpcombinedcontactsvs1[i].printname ||
                                  "",
                                clientname:
                                  data.terpcombinedcontactsvs1[i].name || "",
                                phone:
                                  data.terpcombinedcontactsvs1[i].phone || "",
                                mobile:
                                  data.terpcombinedcontactsvs1[i].mobile || "",
                                arbalance: arBalance || 0.0,
                                creditbalance: creditBalance || 0.0,
                                balance: balance || 0.0,
                                creditlimit: creditLimit || 0.0,
                                salesorderbalance: salesOrderBalance || 0.0,
                                email:
                                  data.terpcombinedcontactsvs1[i].email || "",
                                address:
                                  data.terpcombinedcontactsvs1[i].street || "",
                                // country: data.terpcombinedcontactsvs1[i].Country || '',
                                // department: data.terpcombinedcontactsvs1[i].DefaultClassName || '',
                                type: clienttype || "",
                                custFld1:
                                  data.terpcombinedcontactsvs1[i].CUSTFLD1 ||
                                  "",
                                custFld2:
                                  data.terpcombinedcontactsvs1[i].CUSTFLD2 ||
                                  "",
                              };

                              if (
                                data.terpcombinedcontactsvs1[i].name.replace(
                                  /\s/g,
                                  ""
                                ) !== ""
                              ) {
                                dataTableList.push(dataList);
                              }

                              //}
                            }
                            templateObject.datatablerecords.set(dataTableList);

                            templateObject.datatablerecords.set(dataTableList);
                            $(".dataTables_info").html(
                              "Showing 1 to " +
                                data.terpcombinedcontactsvs1.length +
                                " of " +
                                data.terpcombinedcontactsvs1.length +
                                " entries"
                            );
                            $(".fullScreenSpin").css("display", "none");
                          })
                          .catch(function (err) {
                            $(".fullScreenSpin").css("display", "none");
                          });
                      }
                      //}
                    } else {
                      if (
                        settings.fnRecordsDisplay() >= settings._iDisplayLength
                      ) {
                        $(".fullScreenSpin").css("display", "none");
                      } else {
                        sideBarService
                          .getAllContactCombineVS1(dataLenght, 0)
                          .then(function (dataNonBo) {
                            addVS1Data(
                              "TERPCombinedContactsVS1",
                              JSON.stringify(dataNonBo)
                            )
                              .then(function (datareturn) {
                                templateObject.resetData(dataNonBo);
                              })
                              .catch(function (err) {
                                $(".fullScreenSpin").css("display", "none");
                              });
                          })
                          .catch(function (err) {
                            $(".fullScreenSpin").css("display", "none");
                          });
                      }
                    }
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                  });
                $(".fullScreenSpin").css("display", "none");

                /* Add count functionality to table */
                let countTableData = data.Params.Count || 1; //get count from API data
                if (data.terpcombinedcontactsvs1.length > countTableData) {
                  //Check if what is on the list is more than API count
                  countTableData = data.terpcombinedcontactsvs1.length || 1;
                }

                if (data.terpcombinedcontactsvs1.length > 0) {
                  $("#tblcontactoverview_info").html(
                    "Showing 1 to " +
                      data.terpcombinedcontactsvs1.length +
                      " of " +
                      countTableData +
                      " entries"
                  );
                } else {
                  $("#tblcontactoverview_info").html(
                    "Showing 0 to " +
                      data.terpcombinedcontactsvs1.length +
                      " of 0 entries"
                  );
                }
                /* End Add count functionality to table */
              }, 0);

              var columns = $("#tblcontactoverview th");
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
                if (v.className.includes("hiddenColumn")) {
                  columVisible = false;
                }
                sWidth = v.style.width.replace("px", "");

                let datatablerecordObj = {
                  sTitle: v.innerText || "",
                  sWidth: sWidth || "",
                  sIndex: v.cellIndex || "",
                  sVisible: columVisible || false,
                  sClass: v.className || "",
                };
                tableHeaderList.push(datatablerecordObj);
              });
              templateObject.tableheaderrecords.set(tableHeaderList);
              $("div.dataTables_filter input").addClass(
                "form-control form-control-sm"
              );

              $("#tblcontactoverview tbody").on("click", "tr", function () {
                var listData = $(this).closest("tr").attr("id");
                var transactiontype = $(event.target)
                  .closest("tr")
                  .find(".colType")
                  .text();
                if (listData && transactiontype) {
                  if (
                    transactiontype ===
                    "Customer / Employee / Prospect / Supplier"
                  ) {
                    FlowRouter.go("/customerscard?id=" + listData);
                  } else if (
                    transactiontype === "Customer / Prospect / Supplier"
                  ) {
                    FlowRouter.go("/customerscard?id=" + listData);
                  } else if (transactiontype === "Customer / Supplier") {
                    FlowRouter.go("/customerscard?id=" + listData);
                  } else if (transactiontype === "Customer") {
                    FlowRouter.go("/customerscard?id=" + listData);
                  } else if (transactiontype === "Supplier") {
                    FlowRouter.go("/supplierscard?id=" + listData);
                  } else if (transactiontype === "Employee") {
                    FlowRouter.go("/employeescard?id=" + listData);
                  } else if (transactiontype === "Prospect") {
                    FlowRouter.go("/customerscard?id=" + listData);
                  } else if (transactiontype === "Job") {
                    FlowRouter.go("/customerscard?jobid=" + listData);
                  }
                }
                //if(listData){
                // FlowRouter.go('/employeescard?id=' + listData);
                //}
              });
            })
            .catch(function (err) {
              // Bert.alert('<strong>' + err + '</strong>!', 'danger');
              $(".fullScreenSpin").css("display", "none");
              // Meteor._reload.reload();
            });
        } else {
          let data = JSON.parse(dataObject[0].data);
          let useData = data.terpcombinedcontactsvs1;
          $(".fullScreenSpin").css("display", "none");
          let lineItems = [];
          let lineItemObj = {};
          let clienttype = "";
          let isprospect = false;
          let iscustomer = false;
          let isEmployee = false;
          let issupplier = false;
          for (let i = 0; i < useData.length; i++) {
            isprospect = useData[i].isprospect;
            iscustomer = useData[i].iscustomer;
            isEmployee = useData[i].isEmployee;
            issupplier = useData[i].issupplier;

            if (
              isprospect == true &&
              iscustomer == true &&
              isEmployee == true &&
              issupplier == true
            ) {
              clienttype = "Customer / Employee / Prospect / Supplier";
            } else if (
              isprospect == true &&
              iscustomer == true &&
              issupplier == true
            ) {
              clienttype = "Customer / Prospect / Supplier";
            } else if (iscustomer == true && issupplier == true) {
              clienttype = "Customer / Supplier";
            } else if (iscustomer == true) {
              if (useData[i].name.toLowerCase().indexOf("^") >= 0) {
                clienttype = "Job";
              } else {
                clienttype = "Customer";
              }
              // clienttype = "Customer";
            } else if (isEmployee == true) {
              clienttype = "Employee";
            } else if (issupplier == true) {
              clienttype = "Supplier";
            } else if (isprospect == true) {
              clienttype = "Prospect";
            } else {
              clienttype = " ";
            }
            // if(useData[i].IsCustomer == true){
            //   clienttype = "Customer";
            // }else if(useData[i].IsSupplier == true){
            //   clienttype = "Supplier";
            // };

            let arBalance =
              utilityService.modifynegativeCurrencyFormat(
                useData[i].ARBalance
              ) || 0.0;
            let creditBalance =
              utilityService.modifynegativeCurrencyFormat(
                useData[i].CreditBalance
              ) || 0.0;
            let balance =
              utilityService.modifynegativeCurrencyFormat(useData[i].Balance) ||
              0.0;
            let creditLimit =
              utilityService.modifynegativeCurrencyFormat(
                useData[i].CreditLimit
              ) || 0.0;
            let salesOrderBalance =
              utilityService.modifynegativeCurrencyFormat(
                useData[i].SalesOrderBalance
              ) || 0.0;
            if (isNaN(useData[i].ARBalance)) {
              arBalance = Currency + "0.00";
            }

            if (isNaN(useData[i].CreditBalance)) {
              creditBalance = Currency + "0.00";
            }
            if (isNaN(useData[i].Balance)) {
              balance = Currency + "0.00";
            }
            if (isNaN(useData[i].CreditLimit)) {
              creditLimit = Currency + "0.00";
            }

            if (isNaN(useData[i].SalesOrderBalance)) {
              salesOrderBalance = Currency + "0.00";
            }

            var dataList = {
              id: useData[i].ID || "",
              employeeno: useData[i].printname || "",
              clientname: useData[i].name || "",
              phone: useData[i].phone || "",
              mobile: useData[i].mobile || "",
              arbalance: arBalance || 0.0,
              creditbalance: creditBalance || 0.0,
              balance: balance || 0.0,
              creditlimit: creditLimit || 0.0,
              salesorderbalance: salesOrderBalance || 0.0,
              email: useData[i].email || "",
              address: useData[i].street || "",
              // country: useData[i].Country || '',
              // department: useData[i].DefaultClassName || '',
              type: clienttype || "",
              custFld1: useData[i].CUSTFLD1 || "",
              custFld2: useData[i].CUSTFLD2 || "",
            };

            if (useData[i].name.replace(/\s/g, "") !== "") {
              dataTableList.push(dataList);
            }

            //}
          }
          templateObject.datatablerecords.set(dataTableList);

          if (templateObject.datatablerecords.get()) {
            Meteor.call(
              "readPrefMethod",
              Session.get("mycloudLogonID"),
              "tblcontactoverview",
              function (error, result) {
                if (error) {
                } else {
                  if (result) {
                    for (let i = 0; i < result.customFields.length; i++) {
                      let customcolumn = result.customFields;
                      let columData = customcolumn[i].label;
                      let columHeaderUpdate = customcolumn[i].thclass.replace(
                        / /g,
                        "."
                      );
                      let hiddenColumn = customcolumn[i].hidden;
                      let columnClass = columHeaderUpdate.split(".")[1];
                      let columnWidth = customcolumn[i].width;
                      let columnindex = customcolumn[i].index + 1;

                      if (hiddenColumn == true) {
                        $("." + columnClass + "").addClass("hiddenColumn");
                        $("." + columnClass + "").removeClass("showColumn");
                      } else if (hiddenColumn == false) {
                        $("." + columnClass + "").removeClass("hiddenColumn");
                        $("." + columnClass + "").addClass("showColumn");
                      }
                    }
                  }
                }
              }
            );

            setTimeout(function () {
              MakeNegative();
            }, 100);
          }

          setTimeout(function () {
            $("#tblcontactoverview")
              .DataTable({
                select: true,
                destroy: true,
                colReorder: true,
                sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                buttons: [
                  {
                    extend: "excelHtml5",
                    text: "",
                    download: "open",
                    className: "btntabletocsv hiddenColumn",
                    filename: "Contact Overview - " + moment().format(),
                    orientation: "portrait",
                    exportOptions: {
                      columns: ":visible",
                    },
                  },
                  {
                    extend: "print",
                    download: "open",
                    className: "btntabletopdf hiddenColumn",
                    text: "",
                    title: "Contact Overview",
                    filename: "Contact Overview - " + moment().format(),
                    exportOptions: {
                      columns: ":visible",
                      stripHtml: false,
                    },
                  },
                ],
                // bStateSave: true,
                // rowId: 0,
                pageLength: initialDatatableLoad,
                // "bLengthChange": false,
                lengthMenu: [
                  [initialDatatableLoad, -1],
                  [initialDatatableLoad, "All"],
                ],
                info: true,
                responsive: true,
                // "order": [[ 0, "asc" ]],
                action: function () {
                  $("#tblcontactoverview").DataTable().ajax.reload();
                },
                fnDrawCallback: function (oSettings) {
                  let checkurlIgnoreDate =
                    FlowRouter.current().queryParams.ignoredate;
                  if (checkurlIgnoreDate == "true") {
                  } else {
                    $(".paginate_button.page-item").removeClass("disabled");
                    $("#tblcontactoverview_ellipsis").addClass("disabled");

                    if (oSettings._iDisplayLength == -1) {
                      if (oSettings.fnRecordsDisplay() > 150) {
                        $(".paginate_button.page-item.previous").addClass(
                          "disabled"
                        );
                        $(".paginate_button.page-item.next").addClass(
                          "disabled"
                        );
                      }
                    } else {
                    }
                    if (oSettings.fnRecordsDisplay() < initialDatatableLoad) {
                      $(".paginate_button.page-item.next").addClass("disabled");
                    }
                    $(
                      ".paginate_button.next:not(.disabled)",
                      this.api().table().container()
                    ).on("click", function () {
                      $(".fullScreenSpin").css("display", "inline-block");
                      let dataLenght = oSettings._iDisplayLength;

                      sideBarService
                        .getAllContactCombineVS1(
                          initialDatatableLoad,
                          oSettings.fnRecordsDisplay()
                        )
                        .then(function (dataObjectnew) {
                          getVS1Data("TERPCombinedContactsVS1")
                            .then(function (dataObjectold) {
                              if (dataObjectold.length == 0) {
                              } else {
                                let dataOld = JSON.parse(dataObjectold[0].data);

                                var thirdaryData = $.merge(
                                  $.merge(
                                    [],
                                    dataObjectnew.terpcombinedcontactsvs1
                                  ),
                                  dataOld.terpcombinedcontactsvs1
                                );
                                let objCombineData = {
                                  terpcombinedcontactsvs1: thirdaryData,
                                };

                                addVS1Data(
                                  "TERPCombinedContactsVS1",
                                  JSON.stringify(objCombineData)
                                )
                                  .then(function (datareturn) {
                                    templateObject.resetData(objCombineData);
                                    $(".fullScreenSpin").css("display", "none");
                                  })
                                  .catch(function (err) {
                                    $(".fullScreenSpin").css("display", "none");
                                  });
                              }
                            })
                            .catch(function (err) {});
                        })
                        .catch(function (err) {
                          $(".fullScreenSpin").css("display", "none");
                        });
                    });
                  }
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                },
                fnInitComplete: function () {
                  let urlParametersPage = FlowRouter.current().queryParams.page;
                  if (urlParametersPage) {
                    this.fnPageChange("last");
                  }
                  $(
                    "<button class='btn btn-primary btnRefreshContact' type='button' id='btnRefreshContact' style='padding: 4px 10px; font-size: 14px; margin-left: 8px !important;'><i class='fas fa-search-plus' style='margin-right: 5px'></i>Search</button>"
                  ).insertAfter("#tblcontactoverview_filter");
                },
              })
              .on("page", function () {
                setTimeout(function () {
                  MakeNegative();
                }, 100);
                let draftRecord = templateObject.datatablerecords.get();
                templateObject.datatablerecords.set(draftRecord);
              })
              .on("column-reorder", function () {})
              .on("length.dt", function (e, settings, len) {
                $(".fullScreenSpin").css("display", "inline-block");
                let dataLenght = settings._iDisplayLength;
                if (dataLenght == -1) {
                  if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                    $(".fullScreenSpin").css("display", "none");
                  } else {
                    sideBarService
                      .getAllContactCombineVS1("All", 1)
                      .then(function (data) {
                        let lineItems = [];
                        let lineItemObj = {};
                        let clienttype = "";

                        let isprospect = false;
                        let iscustomer = false;
                        let isEmployee = false;
                        let issupplier = false;
                        for (
                          let i = 0;
                          i < data.terpcombinedcontactsvs1.length;
                          i++
                        ) {
                          isprospect =
                            data.terpcombinedcontactsvs1[i].isprospect;
                          iscustomer =
                            data.terpcombinedcontactsvs1[i].iscustomer;
                          isEmployee =
                            data.terpcombinedcontactsvs1[i].isEmployee;
                          issupplier =
                            data.terpcombinedcontactsvs1[i].issupplier;

                          if (
                            isprospect == true &&
                            iscustomer == true &&
                            isEmployee == true &&
                            issupplier == true
                          ) {
                            clienttype =
                              "Customer / Employee / Prospect / Supplier";
                          } else if (
                            isprospect == true &&
                            iscustomer == true &&
                            issupplier == true
                          ) {
                            clienttype = "Customer / Prospect / Supplier";
                          } else if (iscustomer == true && issupplier == true) {
                            clienttype = "Customer / Supplier";
                          } else if (iscustomer == true) {
                            if (
                              data.terpcombinedcontactsvs1[i].name
                                .toLowerCase()
                                .indexOf("^") >= 0
                            ) {
                              clienttype = "Job";
                            } else {
                              clienttype = "Customer";
                            }
                            // clienttype = "Customer";
                          } else if (isEmployee == true) {
                            clienttype = "Employee";
                          } else if (issupplier == true) {
                            clienttype = "Supplier";
                          } else if (isprospect == true) {
                            clienttype = "Prospect";
                          } else {
                            clienttype = " ";
                          }
                          // if(data.terpcombinedcontactsvs1[i].IsCustomer == true){
                          //   clienttype = "Customer";
                          // }else if(data.terpcombinedcontactsvs1[i].IsSupplier == true){
                          //   clienttype = "Supplier";
                          // };

                          let arBalance =
                            utilityService.modifynegativeCurrencyFormat(
                              data.terpcombinedcontactsvs1[i].ARBalance
                            ) || 0.0;
                          let creditBalance =
                            utilityService.modifynegativeCurrencyFormat(
                              data.terpcombinedcontactsvs1[i].CreditBalance
                            ) || 0.0;
                          let balance =
                            utilityService.modifynegativeCurrencyFormat(
                              data.terpcombinedcontactsvs1[i].Balance
                            ) || 0.0;
                          let creditLimit =
                            utilityService.modifynegativeCurrencyFormat(
                              data.terpcombinedcontactsvs1[i].CreditLimit
                            ) || 0.0;
                          let salesOrderBalance =
                            utilityService.modifynegativeCurrencyFormat(
                              data.terpcombinedcontactsvs1[i].SalesOrderBalance
                            ) || 0.0;
                          if (
                            isNaN(data.terpcombinedcontactsvs1[i].ARBalance)
                          ) {
                            arBalance = Currency + "0.00";
                          }

                          if (
                            isNaN(data.terpcombinedcontactsvs1[i].CreditBalance)
                          ) {
                            creditBalance = Currency + "0.00";
                          }
                          if (isNaN(data.terpcombinedcontactsvs1[i].Balance)) {
                            balance = Currency + "0.00";
                          }
                          if (
                            isNaN(data.terpcombinedcontactsvs1[i].CreditLimit)
                          ) {
                            creditLimit = Currency + "0.00";
                          }

                          if (
                            isNaN(
                              data.terpcombinedcontactsvs1[i].SalesOrderBalance
                            )
                          ) {
                            salesOrderBalance = Currency + "0.00";
                          }

                          var dataList = {
                            id: data.terpcombinedcontactsvs1[i].ID || "",
                            employeeno:
                              data.terpcombinedcontactsvs1[i].printname || "",
                            clientname:
                              data.terpcombinedcontactsvs1[i].name || "",
                            phone: data.terpcombinedcontactsvs1[i].phone || "",
                            mobile:
                              data.terpcombinedcontactsvs1[i].mobile || "",
                            arbalance: arBalance || 0.0,
                            creditbalance: creditBalance || 0.0,
                            balance: balance || 0.0,
                            creditlimit: creditLimit || 0.0,
                            salesorderbalance: salesOrderBalance || 0.0,
                            email: data.terpcombinedcontactsvs1[i].email || "",
                            address:
                              data.terpcombinedcontactsvs1[i].street || "",
                            // country: data.terpcombinedcontactsvs1[i].Country || '',
                            // department: data.terpcombinedcontactsvs1[i].DefaultClassName || '',
                            type: clienttype || "",
                            custFld1:
                              data.terpcombinedcontactsvs1[i].CUSTFLD1 || "",
                            custFld2:
                              data.terpcombinedcontactsvs1[i].CUSTFLD2 || "",
                          };

                          if (
                            data.terpcombinedcontactsvs1[i].name.replace(
                              /\s/g,
                              ""
                            ) !== ""
                          ) {
                            dataTableList.push(dataList);
                          }

                          //}
                        }
                        templateObject.datatablerecords.set(dataTableList);

                        templateObject.datatablerecords.set(dataTableList);
                        $(".dataTables_info").html(
                          "Showing 1 to " +
                            data.terpcombinedcontactsvs1.length +
                            " of " +
                            data.terpcombinedcontactsvs1.length +
                            " entries"
                        );
                        $(".fullScreenSpin").css("display", "none");
                      })
                      .catch(function (err) {
                        $(".fullScreenSpin").css("display", "none");
                      });
                  }
                } else {
                  if (settings.fnRecordsDisplay() >= settings._iDisplayLength) {
                    $(".fullScreenSpin").css("display", "none");
                  } else {
                    sideBarService
                      .getAllContactCombineVS1(dataLenght, 0)
                      .then(function (dataNonBo) {
                        addVS1Data(
                          "TERPCombinedContactsVS1",
                          JSON.stringify(dataNonBo)
                        )
                          .then(function (datareturn) {
                            templateObject.resetData(dataNonBo);
                          })
                          .catch(function (err) {
                            $(".fullScreenSpin").css("display", "none");
                          });
                      })
                      .catch(function (err) {
                        $(".fullScreenSpin").css("display", "none");
                      });
                  }
                }
                setTimeout(function () {
                  MakeNegative();
                }, 100);
              });
            $(".fullScreenSpin").css("display", "none");
            /* Add count functionality to table */
            let countTableData = data.Params.Count || 1; //get count from API data
            if (data.terpcombinedcontactsvs1.length > countTableData) {
              //Check if what is on the list is more than API count
              countTableData = data.terpcombinedcontactsvs1.length || 1;
            }

            if (data.terpcombinedcontactsvs1.length > 0) {
              $("#tblcontactoverview_info").html(
                "Showing 1 to " +
                  data.terpcombinedcontactsvs1.length +
                  " of " +
                  countTableData +
                  " entries"
              );
            } else {
              $("#tblcontactoverview_info").html(
                "Showing 0 to " +
                  data.terpcombinedcontactsvs1.length +
                  " of 0 entries"
              );
            }
            /* End Add count functionality to table */
          }, 0);

          var columns = $("#tblcontactoverview th");
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
            if (v.className.includes("hiddenColumn")) {
              columVisible = false;
            }
            sWidth = v.style.width.replace("px", "");

            let datatablerecordObj = {
              sTitle: v.innerText || "",
              sWidth: sWidth || "",
              sIndex: v.cellIndex || "",
              sVisible: columVisible || false,
              sClass: v.className || "",
            };
            tableHeaderList.push(datatablerecordObj);
          });
          templateObject.tableheaderrecords.set(tableHeaderList);
          $("div.dataTables_filter input").addClass(
            "form-control form-control-sm"
          );

          $("#tblcontactoverview tbody").on("click", "tr", function () {
            var listData = $(this).closest("tr").attr("id");
            var transactiontype = $(event.target)
              .closest("tr")
              .find(".colType")
              .text();
            if (listData && transactiontype) {
              if (
                transactiontype === "Customer / Employee / Prospect / Supplier"
              ) {
                FlowRouter.go("/customerscard?id=" + listData);
              } else if (transactiontype === "Customer / Prospect / Supplier") {
                FlowRouter.go("/customerscard?id=" + listData);
              } else if (transactiontype === "Customer / Supplier") {
                FlowRouter.go("/customerscard?id=" + listData);
              } else if (transactiontype === "Customer") {
                FlowRouter.go("/customerscard?id=" + listData);
              } else if (transactiontype === "Supplier") {
                FlowRouter.go("/supplierscard?id=" + listData);
              } else if (transactiontype === "Employee") {
                FlowRouter.go("/employeescard?id=" + listData);
              } else if (transactiontype === "Prospect") {
                FlowRouter.go("/customerscard?id=" + listData);
              } else if (transactiontype === "Job") {
                FlowRouter.go("/customerscard?jobid=" + listData);
              }
            }
            //if(listData){
            // FlowRouter.go('/employeescard?id=' + listData);
            //}
          });
        }
      })
      .catch(function (err) {
        sideBarService
          .getAllContactCombineVS1(initialDataLoad, 0)
          .then(function (data) {
            $(".fullScreenSpin").css("display", "none");
            let lineItems = [];
            let lineItemObj = {};
            let clienttype = "";

            let isprospect = false;
            let iscustomer = false;
            let isEmployee = false;
            let issupplier = false;
            for (let i = 0; i < data.terpcombinedcontactsvs1.length; i++) {
              isprospect = data.terpcombinedcontactsvs1[i].isprospect;
              iscustomer = data.terpcombinedcontactsvs1[i].iscustomer;
              isEmployee = data.terpcombinedcontactsvs1[i].isEmployee;
              issupplier = data.terpcombinedcontactsvs1[i].issupplier;

              if (
                isprospect == true &&
                iscustomer == true &&
                isEmployee == true &&
                issupplier == true
              ) {
                clienttype = "Customer / Employee / Prospect / Supplier";
              } else if (
                isprospect == true &&
                iscustomer == true &&
                issupplier == true
              ) {
                clienttype = "Customer / Prospect / Supplier";
              } else if (iscustomer == true && issupplier == true) {
                clienttype = "Customer / Supplier";
              } else if (iscustomer == true) {
                if (
                  data.terpcombinedcontactsvs1[i].name
                    .toLowerCase()
                    .indexOf("^") >= 0
                ) {
                  clienttype = "Job";
                } else {
                  clienttype = "Customer";
                }
                // clienttype = "Customer";
              } else if (isEmployee == true) {
                clienttype = "Employee";
              } else if (issupplier == true) {
                clienttype = "Supplier";
              } else if (isprospect == true) {
                clienttype = "Prospect";
              } else {
                clienttype = " ";
              }
              // if(data.terpcombinedcontactsvs1[i].IsCustomer == true){
              //   clienttype = "Customer";
              // }else if(data.terpcombinedcontactsvs1[i].IsSupplier == true){
              //   clienttype = "Supplier";
              // };

              let arBalance =
                utilityService.modifynegativeCurrencyFormat(
                  data.terpcombinedcontactsvs1[i].ARBalance
                ) || 0.0;
              let creditBalance =
                utilityService.modifynegativeCurrencyFormat(
                  data.terpcombinedcontactsvs1[i].CreditBalance
                ) || 0.0;
              let balance =
                utilityService.modifynegativeCurrencyFormat(
                  data.terpcombinedcontactsvs1[i].Balance
                ) || 0.0;
              let creditLimit =
                utilityService.modifynegativeCurrencyFormat(
                  data.terpcombinedcontactsvs1[i].CreditLimit
                ) || 0.0;
              let salesOrderBalance =
                utilityService.modifynegativeCurrencyFormat(
                  data.terpcombinedcontactsvs1[i].SalesOrderBalance
                ) || 0.0;
              if (isNaN(data.terpcombinedcontactsvs1[i].ARBalance)) {
                arBalance = Currency + "0.00";
              }

              if (isNaN(data.terpcombinedcontactsvs1[i].CreditBalance)) {
                creditBalance = Currency + "0.00";
              }
              if (isNaN(data.terpcombinedcontactsvs1[i].Balance)) {
                balance = Currency + "0.00";
              }
              if (isNaN(data.terpcombinedcontactsvs1[i].CreditLimit)) {
                creditLimit = Currency + "0.00";
              }

              if (isNaN(data.terpcombinedcontactsvs1[i].SalesOrderBalance)) {
                salesOrderBalance = Currency + "0.00";
              }

              var dataList = {
                id: data.terpcombinedcontactsvs1[i].ID || "",
                employeeno: data.terpcombinedcontactsvs1[i].printname || "",
                clientname: data.terpcombinedcontactsvs1[i].name || "",
                phone: data.terpcombinedcontactsvs1[i].phone || "",
                mobile: data.terpcombinedcontactsvs1[i].mobile || "",
                arbalance: arBalance || 0.0,
                creditbalance: creditBalance || 0.0,
                balance: balance || 0.0,
                creditlimit: creditLimit || 0.0,
                salesorderbalance: salesOrderBalance || 0.0,
                email: data.terpcombinedcontactsvs1[i].email || "",
                address: data.terpcombinedcontactsvs1[i].street || "",
                // country: data.terpcombinedcontactsvs1[i].Country || '',
                // department: data.terpcombinedcontactsvs1[i].DefaultClassName || '',
                type: clienttype || "",
                custFld1: data.terpcombinedcontactsvs1[i].CUSTFLD1 || "",
                custFld2: data.terpcombinedcontactsvs1[i].CUSTFLD2 || "",
              };

              if (
                data.terpcombinedcontactsvs1[i].name.replace(/\s/g, "") !== ""
              ) {
                dataTableList.push(dataList);
              }

              //}
            }
            templateObject.datatablerecords.set(dataTableList);

            if (templateObject.datatablerecords.get()) {
              Meteor.call(
                "readPrefMethod",
                Session.get("mycloudLogonID"),
                "tblcontactoverview",
                function (error, result) {
                  if (error) {
                  } else {
                    if (result) {
                      for (let i = 0; i < result.customFields.length; i++) {
                        let customcolumn = result.customFields;
                        let columData = customcolumn[i].label;
                        let columHeaderUpdate = customcolumn[i].thclass.replace(
                          / /g,
                          "."
                        );
                        let hiddenColumn = customcolumn[i].hidden;
                        let columnClass = columHeaderUpdate.split(".")[1];
                        let columnWidth = customcolumn[i].width;
                        let columnindex = customcolumn[i].index + 1;

                        if (hiddenColumn == true) {
                          $("." + columnClass + "").addClass("hiddenColumn");
                          $("." + columnClass + "").removeClass("showColumn");
                        } else if (hiddenColumn == false) {
                          $("." + columnClass + "").removeClass("hiddenColumn");
                          $("." + columnClass + "").addClass("showColumn");
                        }
                      }
                    }
                  }
                }
              );

              setTimeout(function () {
                MakeNegative();
              }, 100);
            }

            setTimeout(function () {
              $("#tblcontactoverview")
                .DataTable({
                  select: true,
                  destroy: true,
                  colReorder: true,
                  sDom: "<'row'><'row'<'col-sm-12 col-md-6'f><'col-sm-12 col-md-6'l>r>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>B",
                  buttons: [
                    {
                      extend: "excelHtml5",
                      text: "",
                      download: "open",
                      className: "btntabletocsv hiddenColumn",
                      filename: "Contact Overview - " + moment().format(),
                      orientation: "portrait",
                      exportOptions: {
                        columns: ":visible",
                      },
                    },
                    {
                      extend: "print",
                      download: "open",
                      className: "btntabletopdf hiddenColumn",
                      text: "",
                      title: "Contact Overview",
                      filename: "Contact Overview - " + moment().format(),
                      exportOptions: {
                        columns: ":visible",
                        stripHtml: false,
                      },
                    },
                  ],
                  // bStateSave: true,
                  // rowId: 0,
                  pageLength: initialDatatableLoad,
                  // "bLengthChange": false,
                  lengthMenu: [
                    [initialDatatableLoad, -1],
                    [initialDatatableLoad, "All"],
                  ],
                  info: true,
                  responsive: true,
                  // "order": [[ 0, "asc" ]],
                  action: function () {
                    $("#tblcontactoverview").DataTable().ajax.reload();
                  },
                  fnDrawCallback: function (oSettings) {
                    setTimeout(function () {
                      MakeNegative();
                    }, 100);
                  },
                })
                .on("page", function () {
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                  let draftRecord = templateObject.datatablerecords.get();
                  templateObject.datatablerecords.set(draftRecord);
                })
                .on("column-reorder", function () {})
                .on("length.dt", function (e, settings, len) {
                  $(".fullScreenSpin").css("display", "inline-block");
                  let dataLenght = settings._iDisplayLength;
                  if (dataLenght == -1) {
                    if (settings.fnRecordsDisplay() > initialDatatableLoad) {
                      $(".fullScreenSpin").css("display", "none");
                    } else {
                      sideBarService
                        .getAllContactCombineVS1("All", 1)
                        .then(function (data) {
                          let lineItems = [];
                          let lineItemObj = {};
                          let clienttype = "";

                          let isprospect = false;
                          let iscustomer = false;
                          let isEmployee = false;
                          let issupplier = false;
                          for (
                            let i = 0;
                            i < data.terpcombinedcontactsvs1.length;
                            i++
                          ) {
                            isprospect =
                              data.terpcombinedcontactsvs1[i].isprospect;
                            iscustomer =
                              data.terpcombinedcontactsvs1[i].iscustomer;
                            isEmployee =
                              data.terpcombinedcontactsvs1[i].isEmployee;
                            issupplier =
                              data.terpcombinedcontactsvs1[i].issupplier;

                            if (
                              isprospect == true &&
                              iscustomer == true &&
                              isEmployee == true &&
                              issupplier == true
                            ) {
                              clienttype =
                                "Customer / Employee / Prospect / Supplier";
                            } else if (
                              isprospect == true &&
                              iscustomer == true &&
                              issupplier == true
                            ) {
                              clienttype = "Customer / Prospect / Supplier";
                            } else if (
                              iscustomer == true &&
                              issupplier == true
                            ) {
                              clienttype = "Customer / Supplier";
                            } else if (iscustomer == true) {
                              if (
                                data.terpcombinedcontactsvs1[i].name
                                  .toLowerCase()
                                  .indexOf("^") >= 0
                              ) {
                                clienttype = "Job";
                              } else {
                                clienttype = "Customer";
                              }
                              // clienttype = "Customer";
                            } else if (isEmployee == true) {
                              clienttype = "Employee";
                            } else if (issupplier == true) {
                              clienttype = "Supplier";
                            } else if (isprospect == true) {
                              clienttype = "Prospect";
                            } else {
                              clienttype = " ";
                            }
                            // if(data.terpcombinedcontactsvs1[i].IsCustomer == true){
                            //   clienttype = "Customer";
                            // }else if(data.terpcombinedcontactsvs1[i].IsSupplier == true){
                            //   clienttype = "Supplier";
                            // };

                            let arBalance =
                              utilityService.modifynegativeCurrencyFormat(
                                data.terpcombinedcontactsvs1[i].ARBalance
                              ) || 0.0;
                            let creditBalance =
                              utilityService.modifynegativeCurrencyFormat(
                                data.terpcombinedcontactsvs1[i].CreditBalance
                              ) || 0.0;
                            let balance =
                              utilityService.modifynegativeCurrencyFormat(
                                data.terpcombinedcontactsvs1[i].Balance
                              ) || 0.0;
                            let creditLimit =
                              utilityService.modifynegativeCurrencyFormat(
                                data.terpcombinedcontactsvs1[i].CreditLimit
                              ) || 0.0;
                            let salesOrderBalance =
                              utilityService.modifynegativeCurrencyFormat(
                                data.terpcombinedcontactsvs1[i]
                                  .SalesOrderBalance
                              ) || 0.0;
                            if (
                              isNaN(data.terpcombinedcontactsvs1[i].ARBalance)
                            ) {
                              arBalance = Currency + "0.00";
                            }

                            if (
                              isNaN(
                                data.terpcombinedcontactsvs1[i].CreditBalance
                              )
                            ) {
                              creditBalance = Currency + "0.00";
                            }
                            if (
                              isNaN(data.terpcombinedcontactsvs1[i].Balance)
                            ) {
                              balance = Currency + "0.00";
                            }
                            if (
                              isNaN(data.terpcombinedcontactsvs1[i].CreditLimit)
                            ) {
                              creditLimit = Currency + "0.00";
                            }

                            if (
                              isNaN(
                                data.terpcombinedcontactsvs1[i]
                                  .SalesOrderBalance
                              )
                            ) {
                              salesOrderBalance = Currency + "0.00";
                            }

                            var dataList = {
                              id: data.terpcombinedcontactsvs1[i].ID || "",
                              employeeno:
                                data.terpcombinedcontactsvs1[i].printname || "",
                              clientname:
                                data.terpcombinedcontactsvs1[i].name || "",
                              phone:
                                data.terpcombinedcontactsvs1[i].phone || "",
                              mobile:
                                data.terpcombinedcontactsvs1[i].mobile || "",
                              arbalance: arBalance || 0.0,
                              creditbalance: creditBalance || 0.0,
                              balance: balance || 0.0,
                              creditlimit: creditLimit || 0.0,
                              salesorderbalance: salesOrderBalance || 0.0,
                              email:
                                data.terpcombinedcontactsvs1[i].email || "",
                              address:
                                data.terpcombinedcontactsvs1[i].street || "",
                              // country: data.terpcombinedcontactsvs1[i].Country || '',
                              // department: data.terpcombinedcontactsvs1[i].DefaultClassName || '',
                              type: clienttype || "",
                              custFld1:
                                data.terpcombinedcontactsvs1[i].CUSTFLD1 || "",
                              custFld2:
                                data.terpcombinedcontactsvs1[i].CUSTFLD2 || "",
                            };

                            if (
                              data.terpcombinedcontactsvs1[i].name.replace(
                                /\s/g,
                                ""
                              ) !== ""
                            ) {
                              dataTableList.push(dataList);
                            }

                            //}
                          }
                          templateObject.datatablerecords.set(dataTableList);

                          templateObject.datatablerecords.set(dataTableList);
                          $(".dataTables_info").html(
                            "Showing 1 to " +
                              data.terpcombinedcontactsvs1.length +
                              " of " +
                              data.terpcombinedcontactsvs1.length +
                              " entries"
                          );
                          $(".fullScreenSpin").css("display", "none");
                        })
                        .catch(function (err) {
                          $(".fullScreenSpin").css("display", "none");
                        });
                    }
                  } else {
                    if (
                      settings.fnRecordsDisplay() >= settings._iDisplayLength
                    ) {
                      $(".fullScreenSpin").css("display", "none");
                    } else {
                      sideBarService
                        .getAllContactCombineVS1(dataLenght, 0)
                        .then(function (dataNonBo) {
                          addVS1Data(
                            "TERPCombinedContactsVS1",
                            JSON.stringify(dataNonBo)
                          )
                            .then(function (datareturn) {
                              templateObject.resetData(dataNonBo);
                            })
                            .catch(function (err) {
                              $(".fullScreenSpin").css("display", "none");
                            });
                        })
                        .catch(function (err) {
                          $(".fullScreenSpin").css("display", "none");
                        });
                    }
                  }
                  setTimeout(function () {
                    MakeNegative();
                  }, 100);
                });
              $(".fullScreenSpin").css("display", "none");
              /* Add count functionality to table */
              let countTableData = data.Params.Count || 1; //get count from API data
              if (data.terpcombinedcontactsvs1.length > countTableData) {
                //Check if what is on the list is more than API count
                countTableData = data.terpcombinedcontactsvs1.length || 1;
              }

              if (data.terpcombinedcontactsvs1.length > 0) {
                $("#tblcontactoverview_info").html(
                  "Showing 1 to " +
                    data.terpcombinedcontactsvs1.length +
                    " of " +
                    countTableData +
                    " entries"
                );
              } else {
                $("#tblcontactoverview_info").html(
                  "Showing 0 to " +
                    data.terpcombinedcontactsvs1.length +
                    " of 0 entries"
                );
              }
              /* End Add count functionality to table */
            }, 0);

            var columns = $("#tblcontactoverview th");
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
              if (v.className.includes("hiddenColumn")) {
                columVisible = false;
              }
              sWidth = v.style.width.replace("px", "");

              let datatablerecordObj = {
                sTitle: v.innerText || "",
                sWidth: sWidth || "",
                sIndex: v.cellIndex || "",
                sVisible: columVisible || false,
                sClass: v.className || "",
              };
              tableHeaderList.push(datatablerecordObj);
            });
            templateObject.tableheaderrecords.set(tableHeaderList);
            $("div.dataTables_filter input").addClass(
              "form-control form-control-sm"
            );

            $("#tblcontactoverview tbody").on("click", "tr", function () {
              var listData = $(this).closest("tr").attr("id");
              var transactiontype = $(event.target)
                .closest("tr")
                .find(".colType")
                .text();
              if (listData && transactiontype) {
                if (
                  transactiontype ===
                  "Customer / Employee / Prospect / Supplier"
                ) {
                  FlowRouter.go("/customerscard?id=" + listData);
                } else if (
                  transactiontype === "Customer / Prospect / Supplier"
                ) {
                  FlowRouter.go("/customerscard?id=" + listData);
                } else if (transactiontype === "Customer / Supplier") {
                  FlowRouter.go("/customerscard?id=" + listData);
                } else if (transactiontype === "Customer") {
                  FlowRouter.go("/customerscard?id=" + listData);
                } else if (transactiontype === "Supplier") {
                  FlowRouter.go("/supplierscard?id=" + listData);
                } else if (transactiontype === "Employee") {
                  FlowRouter.go("/employeescard?id=" + listData);
                } else if (transactiontype === "Prospect") {
                  FlowRouter.go("/customerscard?id=" + listData);
                } else if (transactiontype === "Job") {
                  FlowRouter.go("/customerscard?jobid=" + listData);
                }
              }
              //if(listData){
              // FlowRouter.go('/employeescard?id=' + listData);
              //}
            });
          })
          .catch(function (err) {
            // Bert.alert('<strong>' + err + '</strong>!', 'danger');
            $(".fullScreenSpin").css("display", "none");
            // Meteor._reload.reload();
          });
      });
  };

  templateObject.getAllContactData();

  templateObject.getAllFilterCombinedContactsData = function (
    fromDate,
    toDate,
    ignoreDate
  ) {
    sideBarService
      .getAllContactCombineVS1(initialDataLoad, 0)
      .then(function (data) {
        addVS1Data("TERPCombinedContactsVS1", JSON.stringify(data))
          .then(function (datareturn) {
            window.open(
              "/contactoverview?toDate=" +
                toDate +
                "&fromDate=" +
                fromDate +
                "&ignoredate=" +
                ignoreDate,
              "_self"
            );
          })
          .catch(function (err) {
            location.reload();
          });
      })
      .catch(function (err) {
        $(".fullScreenSpin").css("display", "none");
        // Meteor._reload.reload();
      });
  };

  let urlParametersDateFrom = FlowRouter.current().queryParams.fromDate;
  let urlParametersDateTo = FlowRouter.current().queryParams.toDate;
  let urlParametersIgnoreDate = FlowRouter.current().queryParams.ignoredate;
  if (urlParametersDateFrom) {
    if (urlParametersIgnoreDate == true) {
      $("#dateFrom").attr("readonly", true);
      $("#dateTo").attr("readonly", true);
    } else {
      $("#dateFrom").val(
        urlParametersDateFrom != ""
          ? moment(urlParametersDateFrom).format("DD/MM/YYYY")
          : urlParametersDateFrom
      );
      $("#dateTo").val(
        urlParametersDateTo != ""
          ? moment(urlParametersDateTo).format("DD/MM/YYYY")
          : urlParametersDateTo
      );
    }
  }

});

Template.contactoverview.events({
  "click .btnRefresh": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    let templateObject = Template.instance();
    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDate =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;
    let prevMonth11Date = moment()
      .subtract(reportsloadMonths, "months")
      .format("YYYY-MM-DD");
    sideBarService
      .getAllContactCombineVS1(initialDataLoad, 0)
      .then(function (data) {
        addVS1Data("TERPCombinedContactsVS1", JSON.stringify(data))
          .then(function (datareturn) {
            window.open("/contactoverview", "_self");
          })
          .catch(function (err) {
            window.open("/contactoverview", "_self");
          });
      })
      .catch(function (err) {
        window.open("/contactoverview", "_self");
      });
  },
  "click .allList": function (event) {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    sideBarService
      .getAllContactCombineVS1("All", 0)
      .then(function (data) {
        addVS1Data("TERPCombinedContactsVS1", JSON.stringify(data))
          .then(function (datareturn) {
            window.open("/contactoverview?ignoredate=true", "_self");
          })
          .catch(function (err) {
            location.reload();
          });
      })
      .catch(function (err) {
        $(".fullScreenSpin").css("display", "none");
        // Meteor._reload.reload();
      });
  },
  "change #dateTo": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    var dateTo = new Date($("#dateTo").datepicker("getDate"));

    let formatDateFrom =
      dateFrom.getFullYear() +
      "-" +
      (dateFrom.getMonth() + 1) +
      "-" +
      dateFrom.getDate();
    let formatDateTo =
      dateTo.getFullYear() +
      "-" +
      (dateTo.getMonth() + 1) +
      "-" +
      dateTo.getDate();

    //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
    var formatDate =
      dateTo.getDate() +
      "/" +
      (dateTo.getMonth() + 1) +
      "/" +
      dateTo.getFullYear();
    //templateObject.dateAsAt.set(formatDate);
    if (
      $("#dateFrom").val().replace(/\s/g, "") == "" &&
      $("#dateFrom").val().replace(/\s/g, "") == ""
    ) {
    } else {
      templateObject.getAllFilterCombinedContactsData(
        formatDateFrom,
        formatDateTo,
        false
      );
    }
  },
  "change #dateFrom": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var dateFrom = new Date($("#dateFrom").datepicker("getDate"));
    var dateTo = new Date($("#dateTo").datepicker("getDate"));

    let formatDateFrom =
      dateFrom.getFullYear() +
      "-" +
      (dateFrom.getMonth() + 1) +
      "-" +
      dateFrom.getDate();
    let formatDateTo =
      dateTo.getFullYear() +
      "-" +
      (dateTo.getMonth() + 1) +
      "-" +
      dateTo.getDate();

    //  templateObject.getAgedPayableReports(formatDateFrom,formatDateTo,false);
    var formatDate =
      dateTo.getDate() +
      "/" +
      (dateTo.getMonth() + 1) +
      "/" +
      dateTo.getFullYear();
    //templateObject.dateAsAt.set(formatDate);
    if (
      $("#dateFrom").val().replace(/\s/g, "") == "" &&
      $("#dateFrom").val().replace(/\s/g, "") == ""
    ) {
    } else {
      templateObject.getAllFilterCombinedContactsData(
        formatDateFrom,
        formatDateTo,
        false
      );
    }
  },
  "click #today": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDateERPFrom =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;
    var toDateERPTo =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;

    var toDateDisplayFrom =
      fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();
    var toDateDisplayTo =
      fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();

    $("#dateFrom").val(toDateDisplayFrom);
    $("#dateTo").val(toDateDisplayTo);
    templateObject.getAllFilterCombinedContactsData(
      toDateERPFrom,
      toDateERPTo,
      false
    );
  },
  "click #lastweek": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = currentBeginDate.getMonth() + 1;
    let fromDateDay = currentBeginDate.getDate();
    if (currentBeginDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
      fromDateMonth = currentBeginDate.getMonth() + 1;
    }

    if (currentBeginDate.getDate() < 10) {
      fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDateERPFrom =
      currentBeginDate.getFullYear() +
      "-" +
      fromDateMonth +
      "-" +
      (fromDateDay - 7);
    var toDateERPTo =
      currentBeginDate.getFullYear() + "-" + fromDateMonth + "-" + fromDateDay;

    var toDateDisplayFrom =
      fromDateDay -
      7 +
      "/" +
      fromDateMonth +
      "/" +
      currentBeginDate.getFullYear();
    var toDateDisplayTo =
      fromDateDay + "/" + fromDateMonth + "/" + currentBeginDate.getFullYear();

    $("#dateFrom").val(toDateDisplayFrom);
    $("#dateTo").val(toDateDisplayTo);
    templateObject.getAllFilterCombinedContactsData(
      toDateERPFrom,
      toDateERPTo,
      false
    );
  },
  "click #lastMonth": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();

    var prevMonthLastDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    var prevMonthFirstDate = new Date(
      currentDate.getFullYear() - (currentDate.getMonth() > 0 ? 0 : 1),
      (currentDate.getMonth() - 1 + 12) % 12,
      1
    );

    var formatDateComponent = function (dateComponent) {
      return (dateComponent < 10 ? "0" : "") + dateComponent;
    };

    var formatDate = function (date) {
      return (
        formatDateComponent(date.getDate()) +
        "/" +
        formatDateComponent(date.getMonth() + 1) +
        "/" +
        date.getFullYear()
      );
    };

    var formatDateERP = function (date) {
      return (
        date.getFullYear() +
        "-" +
        formatDateComponent(date.getMonth() + 1) +
        "-" +
        formatDateComponent(date.getDate())
      );
    };

    var fromDate = formatDate(prevMonthFirstDate);
    var toDate = formatDate(prevMonthLastDate);

    $("#dateFrom").val(fromDate);
    $("#dateTo").val(toDate);

    var getLoadDate = formatDateERP(prevMonthLastDate);
    let getDateFrom = formatDateERP(prevMonthFirstDate);
    templateObject.getAllFilterCombinedContactsData(
      getDateFrom,
      getLoadDate,
      false
    );
  },
  "click #lastQuarter": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    var begunDate = moment(currentDate).format("DD/MM/YYYY");
    function getQuarter(d) {
      d = d || new Date();
      var m = Math.floor(d.getMonth() / 3) + 2;
      return m > 4 ? m - 4 : m;
    }

    var quarterAdjustment = (moment().month() % 3) + 1;
    var lastQuarterEndDate = moment()
      .subtract({
        months: quarterAdjustment,
      })
      .endOf("month");
    var lastQuarterStartDate = lastQuarterEndDate
      .clone()
      .subtract({
        months: 2,
      })
      .startOf("month");

    var lastQuarterStartDateFormat =
      moment(lastQuarterStartDate).format("DD/MM/YYYY");
    var lastQuarterEndDateFormat =
      moment(lastQuarterEndDate).format("DD/MM/YYYY");

    $("#dateFrom").val(lastQuarterStartDateFormat);
    $("#dateTo").val(lastQuarterEndDateFormat);

    let fromDateMonth = getQuarter(currentDate);
    var quarterMonth = getQuarter(currentDate);
    let fromDateDay = currentDate.getDate();

    var getLoadDate = moment(lastQuarterEndDate).format("YYYY-MM-DD");
    let getDateFrom = moment(lastQuarterStartDateFormat).format("YYYY-MM-DD");
    templateObject.getAllFilterCombinedContactsData(
      getDateFrom,
      getLoadDate,
      false
    );
  },
  "click #last12Months": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", false);
    $("#dateTo").attr("readonly", false);
    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    let fromDateMonth = Math.floor(currentDate.getMonth() + 1);
    let fromDateDay = currentDate.getDate();
    if (currentDate.getMonth() + 1 < 10) {
      fromDateMonth = "0" + (currentDate.getMonth() + 1);
    }
    if (currentDate.getDate() < 10) {
      fromDateDay = "0" + currentDate.getDate();
    }

    var fromDate =
      fromDateDay +
      "/" +
      fromDateMonth +
      "/" +
      Math.floor(currentDate.getFullYear() - 1);
    $("#dateFrom").val(fromDate);
    $("#dateTo").val(begunDate);

    var currentDate2 = new Date();
    if (currentDate2.getMonth() + 1 < 10) {
      fromDateMonth2 = "0" + Math.floor(currentDate2.getMonth() + 1);
    }
    if (currentDate2.getDate() < 10) {
      fromDateDay2 = "0" + currentDate2.getDate();
    }
    var getLoadDate = moment(currentDate2).format("YYYY-MM-DD");
    let getDateFrom =
      Math.floor(currentDate2.getFullYear() - 1) +
      "-" +
      fromDateMonth2 +
      "-" +
      currentDate2.getDate();
    templateObject.getAllFilterCombinedContactsData(
      getDateFrom,
      getLoadDate,
      false
    );
  },
  "click #ignoreDate": function () {
    let templateObject = Template.instance();
    $(".fullScreenSpin").css("display", "inline-block");
    $("#dateFrom").attr("readonly", true);
    $("#dateTo").attr("readonly", true);
    templateObject.getAllFilterCombinedContactsData("", "", true);
  },
  "click .chkDatatable": function (event) {
    var columns = $("#tblcontactoverview th");
    let columnDataValue = $(event.target)
      .closest("div")
      .find(".divcolumn")
      .text();

    $.each(columns, function (i, v) {
      let className = v.classList;
      let replaceClass = className[1];

      if (v.innerText == columnDataValue) {
        if ($(event.target).is(":checked")) {
          $("." + replaceClass + "").css("display", "table-cell");
          $("." + replaceClass + "").css("padding", ".75rem");
          $("." + replaceClass + "").css("vertical-align", "top");
        } else {
          $("." + replaceClass + "").css("display", "none");
        }
      }
    });
  },
  "keyup #tblcontactoverview_filter input": function (event) {
    if ($(event.target).val() != "") {
      $(".btnRefreshContact").addClass("btnSearchAlert");
    } else {
      $(".btnRefreshContact").removeClass("btnSearchAlert");
    }
    if (event.keyCode == 13) {
      $(".btnRefreshContact").trigger("click");
    }
  },
  "click .btnRefreshContact": function (event) {
    let templateObject = Template.instance();
    $('.fullScreenSpin').css('display', 'inline-block');
    const contactList = [];
    const clientList = [];
    let salesOrderTable;
    var splashArray = new Array();
    var splashArrayContactList = new Array();
    const dataTableList = [];
    const tableHeaderList = [];
    let dataSearchName = $('#tblcontactoverview_filter input').val();

    if (dataSearchName.replace(/\s/g, '') != '') {
        sideBarService.getAllContactOverviewVS1ByName(dataSearchName).then(function (data) {
            let lineItems = [];
            let lineItemObj = {};
            let clienttype = '';
            let isprospect = false;
            let iscustomer = false;
            let isEmployee = false;
            let issupplier = false;
            $(".btnRefreshContact").removeClass('btnSearchAlert');
            if (data.terpcombinedcontactsvs1.length > 0) {
              $("#tblcontactoverview > tbody").empty();

                for (let i = 0; i < data.terpcombinedcontactsvs1.length; i++) {

                        isprospect = data.terpcombinedcontactsvs1[i].isprospect;
                        iscustomer = data.terpcombinedcontactsvs1[i].iscustomer;
                        isEmployee = data.terpcombinedcontactsvs1[i].isEmployee;
                        issupplier = data.terpcombinedcontactsvs1[i].issupplier;

                        if((isprospect == true) && (iscustomer == true) && (isEmployee == true) && (issupplier == true)){
                            clienttype = "Customer / Employee / Prospect / Supplier";
                        }else if((isprospect == true) && (iscustomer ==true) && (issupplier ==true)){
                            clienttype = "Customer / Prospect / Supplier";
                        }else if((iscustomer ==true) && (issupplier ==true)){
                            clienttype = "Customer / Supplier";
                        }else if((iscustomer ==true)){

                            if (data.terpcombinedcontactsvs1[i].name.toLowerCase().indexOf("^") >= 0){
                                clienttype = "Job";
                            }else{
                                clienttype = "Customer";
                            }
                            // clienttype = "Customer";
                        }else if((isEmployee ==true)){
                            clienttype = "Employee";
                        }else if((issupplier ==true)){
                            clienttype = "Supplier";
                        }else if((isprospect ==true)){
                            clienttype = "Prospect";
                        }else{
                            clienttype = " ";
                        }

                            let arBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].ARBalance)|| 0.00;
                            let creditBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditBalance) || 0.00;
                            let balance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].Balance)|| 0.00;
                            let creditLimit = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].CreditLimit)|| 0.00;
                            let salesOrderBalance = utilityService.modifynegativeCurrencyFormat(data.terpcombinedcontactsvs1[i].SalesOrderBalance)|| 0.00;
                            if (isNaN(data.terpcombinedcontactsvs1[i].ARBalance)) {
                                arBalance = Currency + "0.00";
                            }

                            if (isNaN(data.terpcombinedcontactsvs1[i].CreditBalance)) {
                                creditBalance = Currency + "0.00";
                            }
                            if (isNaN(data.terpcombinedcontactsvs1[i].Balance)) {
                                balance = Currency + "0.00";
                            }
                            if (isNaN(data.terpcombinedcontactsvs1[i].CreditLimit)) {
                                creditLimit = Currency + "0.00";
                            }

                            if (isNaN(data.terpcombinedcontactsvs1[i].SalesOrderBalance)) {
                                salesOrderBalance = Currency + "0.00";
                            }


                        $("#tblcontactoverview > tbody").append(
                            ' <tr class="dnd-moved" id="' + data.terpcombinedcontactsvs1[i].ID + '" style="cursor: pointer;">' +
                            '<td contenteditable="false" class="colClientName">' + data.terpcombinedcontactsvs1[i].name + '</td>' +
                            '<td contenteditable="false" class="colType">' + clienttype + '</td>' +
                            '<td contenteditable="false" class="colPhone" >' + data.terpcombinedcontactsvs1[i].phone + '</td>' +
                            '<td contenteditable="false" class="colMobile hiddenColumn">' + data.terpcombinedcontactsvs1[i].mobile + '</td>' +
                            '<td contenteditable="false" class="colARBalance" style="text-align: right!important;">' + arBalance + '</td>' +
                            '<td contenteditable="false" class="colCreditBalance" style="text-align: right!important;">' + creditBalance + '</td>' +
                            '<td contenteditable="false" class="colBalance" style="text-align: right!important;">' + balance + '</td>' +
                            '<td contenteditable="false" class="colCreditLimit" style="text-align: right!important;">' + creditLimit + '</td>' +
                            '<td contenteditable="false" class="colSalesOrderBalance" style="text-align: right!important;">' + salesOrderBalance + '</td>' +
                            '<td contenteditable="false" class="colEmail hiddenColumn">' + data.terpcombinedcontactsvs1[i].email + '</td>' +
                            '<td contenteditable="false" class="colCustFld1 hiddenColumn">' + data.terpcombinedcontactsvs1[i].CUSTFLD1 + '</td>' +
                            '<td contenteditable="false" class="colCustFld2 hiddenColumn">' + data.terpcombinedcontactsvs1[i].CUSTFLD2 + '</td>' +
                            '<td contenteditable="false" class="colAddress">' + data.terpcombinedcontactsvs1[i].street + '</td>' +
                            '</tr>');


                    // var dataListContact = [
                    //     '<div class="custom-control custom-checkbox chkBox chkBoxContact pointer" style="width:15px;"><input class="custom-control-input chkBox chkServiceCard pointer" type="checkbox" id="formCheck-'+data.terpcombinedcontactsvs1[i].ID+'"><label class="custom-control-label chkBox pointer" for="formCheck-'+data.terpcombinedcontactsvs1[i].ID+'"></label></div>',
                    //     data.terpcombinedcontactsvs1[i].name || '-',
                    //     clienttype || '',
                    //     data.terpcombinedcontactsvs1[i].Phone || '',
                    //     data.terpcombinedcontactsvs1[i].mobile || '',
                    //     arBalance || 0.00,
                    //     creditBalance || 0.00,
                    //     balance || 0.00,
                    //     creditLimit || 0.00,
                    //     salesOrderBalance || 0.00,
                    //     data.terpcombinedcontactsvs1[i].email || '',
                    //     data.terpcombinedcontactsvs1[i].CUSTFLD1 || '',
                    //     data.terpcombinedcontactsvs1[i].CUSTFLD2 || '',
                    //     data.terpcombinedcontactsvs1[i].street || '',
                    //     data.terpcombinedcontactsvs1[i].ID || ''
                    //
                    // ];
                    // splashArrayContactList.push(dataListContact);
                    //}
                }
                $('.dataTables_info').html('Showing 1 to ' + data.terpcombinedcontactsvs1.length + ' of ' + data.terpcombinedcontactsvs1.length + ' entries');
                // var datatable = $('#tblcontactoverview').DataTable();
                // datatable.clear();
                // datatable.rows.add(splashArrayContactList);
                // datatable.draw(false);

                $('.fullScreenSpin').css('display', 'none');
            } else {

                $('.fullScreenSpin').css('display', 'none');
                $('#contactListModal').modal('toggle');
                swal({
                    title: 'Question',
                    text: "Contact does not exist, would you like to create it?",
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                }).then((result) => {
                    if (result.value) {

                    } else if (result.dismiss === 'cancel') {
                        $('#contactListModal').modal('toggle');
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
  "click .resetTable": function (event) {
    var getcurrentCloudDetails = CloudUser.findOne({
      _id: Session.get("mycloudLogonID"),
      clouddatabaseID: Session.get("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: "tblcontactoverview",
        });
        if (checkPrefDetails) {
          CloudPreference.remove(
            { _id: checkPrefDetails._id },
            function (err, idTag) {
              if (err) {
              } else {
                Meteor._reload.reload();
              }
            }
          );
        }
      }
    }
  },
  "click .saveTable": function (event) {
    let lineItems = [];
    //let datatable =$('#tblcontactoverview').DataTable();
    $(".columnSettings").each(function (index) {
      var $tblrow = $(this);
      var colTitle = $tblrow.find(".divcolumn").text() || "";
      var colWidth = $tblrow.find(".custom-range").val() || 0;
      var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || "";
      var colHidden = false;
      if ($tblrow.find(".custom-control-input").is(":checked")) {
        colHidden = false;
      } else {
        colHidden = true;
      }
      let lineItemObj = {
        index: index,
        label: colTitle,
        hidden: colHidden,
        width: colWidth,
        thclass: colthClass,
      };

      lineItems.push(lineItemObj);
    });
    //datatable.state.save();

    var getcurrentCloudDetails = CloudUser.findOne({
      _id: Session.get("mycloudLogonID"),
      clouddatabaseID: Session.get("mycloudLogonDBID"),
    });
    if (getcurrentCloudDetails) {
      if (getcurrentCloudDetails._id.length > 0) {
        var clientID = getcurrentCloudDetails._id;
        var clientUsername = getcurrentCloudDetails.cloudUsername;
        var clientEmail = getcurrentCloudDetails.cloudEmail;
        var checkPrefDetails = CloudPreference.findOne({
          userid: clientID,
          PrefName: "tblcontactoverview",
        });
        if (checkPrefDetails) {
          CloudPreference.update(
            { _id: checkPrefDetails._id },
            {
              $set: {
                userid: clientID,
                username: clientUsername,
                useremail: clientEmail,
                PrefGroup: "salesform",
                PrefName: "tblcontactoverview",
                published: true,
                customFields: lineItems,
                updatedAt: new Date(),
              },
            },
            function (err, idTag) {
              if (err) {
                $("#myModal2").modal("toggle");
              } else {
                $("#myModal2").modal("toggle");
              }
            }
          );
        } else {
          CloudPreference.insert(
            {
              userid: clientID,
              username: clientUsername,
              useremail: clientEmail,
              PrefGroup: "salesform",
              PrefName: "tblcontactoverview",
              published: true,
              customFields: lineItems,
              createdAt: new Date(),
            },
            function (err, idTag) {
              if (err) {
                $("#myModal2").modal("toggle");
              } else {
                $("#myModal2").modal("toggle");
              }
            }
          );
        }
      }
    }

    //Meteor._reload.reload();
  },
  "blur .divcolumn": function (event) {
    let columData = $(event.target).text();

    let columnDatanIndex = $(event.target)
      .closest("div.columnSettings")
      .attr("id");

    var datable = $("#tblcontactoverview").DataTable();
    var title = datable.column(columnDatanIndex).header();
    $(title).html(columData);
  },
  "change .rngRange": function (event) {
    let range = $(event.target).val();
    // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

    // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
    let columnDataValue = $(event.target)
      .closest("div")
      .prev()
      .find(".divcolumn")
      .text();
    var datable = $("#tblcontactoverview th");
    $.each(datable, function (i, v) {
      if (v.innerText == columnDataValue) {
        let className = v.className;
        let replaceClass = className.replace(/ /g, ".");
        $("." + replaceClass + "").css("width", range + "px");
      }
    });
  },
  "click .btnOpenSettings": function (event) {
    let templateObject = Template.instance();
    var columns = $("#tblcontactoverview th");

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
      if (v.className.includes("hiddenColumn")) {
        columVisible = false;
      }
      sWidth = v.style.width.replace("px", "");

      let datatablerecordObj = {
        sTitle: v.innerText || "",
        sWidth: sWidth || "",
        sIndex: v.cellIndex || "",
        sVisible: columVisible || false,
        sClass: v.className || "",
      };
      tableHeaderList.push(datatablerecordObj);
    });
    templateObject.tableheaderrecords.set(tableHeaderList);
  },
  "click #exportbtn": function () {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblcontactoverview_wrapper .dt-buttons .btntabletocsv").click();
    $(".fullScreenSpin").css("display", "none");
  },
  "click .printConfirm": function (event) {
    $(".fullScreenSpin").css("display", "inline-block");
    jQuery("#tblcontactoverview_wrapper .dt-buttons .btntabletopdf").click();
    $(".fullScreenSpin").css("display", "none");
  },
});

Template.contactoverview.helpers({
  datatablerecords: () => {
    return Template.instance()
      .datatablerecords.get()
      .sort(function (a, b) {
        if (a.clientname == "NA") {
          return 1;
        } else if (b.clientname == "NA") {
          return -1;
        }
        return a.clientname.toUpperCase() > b.clientname.toUpperCase() ? 1 : -1;
      });
  },
  tableheaderrecords: () => {
    return Template.instance().tableheaderrecords.get();
  },
  purchasesCloudPreferenceRec: () => {
    return CloudPreference.findOne({
      userid: Session.get("mycloudLogonID"),
      PrefName: "tblcontactoverview",
    });
  },

  Currency: () => {
    return Currency;
  },

  loggedCompany: () => {
    return localStorage.getItem("mySession") || "";
  },
});
