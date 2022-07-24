import { ReactiveVar } from 'meteor/reactive-var';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';
import {AccessLevelService} from './accesslevel-service';
import {EmployeeProfileService} from './profile-service';
import '../lib/global/indexdbstorage.js';

Template.vs1login.onCreated(() => {
    Template.instance().subscribe('RegisterUser');
});
Template.vs1login.helpers({

    currentLoginEmail: function () {
        return Session.get('loginEmail') == this._email;
    },
    companyDatabases: function () {
        if (Session.get('loginEmail')) {
            return RegisterUser.find({
                useremail: Session.get('loginEmail')
            }).fetch().sort(function (a, b) {
                if (a.description.toLowerCase() == 'NA') {
                    return 1;
                } else if (b.description.toLowerCase() == 'NA') {
                    return -1;
                }
                return (a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1;
            });

        }
    }
});

Template.vs1login.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.loggedUser = new ReactiveVar();
    templateObject.loggedDB = new ReactiveVar();
    templateObject.steelmainDB = new ReactiveVar();
    templateObject.employeeID = new ReactiveVar();
    templateObject.employeeformID = new ReactiveVar();
    templateObject.employeeformDetail = new ReactiveVar();
    templateObject.employeeformaccessrecord = new ReactiveVar({});

});

Template.vs1login.onRendered(function () {

    localStorage.removeItem('VS1ProductList');
    localStorage.removeItem('VS1CustomerList');
    localStorage.removeItem('VS1SupplierList');
    localStorage.removeItem('VS1AccountList');
    localStorage.removeItem('VS1TaxCodeList');
    localStorage.removeItem('VS1TermsList');
    localStorage.removeItem('VS1DepartmentList');
    localStorage.removeItem('VS1CurrencyList');
    localStorage.removeItem('VS1LeadStatusList');
    localStorage.removeItem('VS1ShippingMethodList');
    localStorage.removeItem('VS1AccountTypeList');
    localStorage.removeItem('VS1ERPCombinedContactsList');
    localStorage.removeItem('VS1EmployeeList');
    localStorage.removeItem('VS1JournalEntryLineList');
    localStorage.removeItem('VS1BankAccountReportList');
    localStorage.removeItem('VS1TInvoiceList');
    localStorage.removeItem('VS1TInvoiceNonBackOrderList');
    localStorage.removeItem('VS1BackOrderSalesListList');
    localStorage.removeItem('VS1TPurchaseOrderList');
    localStorage.removeItem('VS1TReconcilationList');
    localStorage.removeItem('VS1TChequeList');
    localStorage.removeItem('VS1TProductStocknSalePeriodReport');
    localStorage.removeItem('VS1TAppUserList');
    localStorage.removeItem('VS1TJobVS1List');
    localStorage.removeItem('VS1TStockAdjustEntryList');
    localStorage.removeItem('VS1TsalesOrderNonBackOrderList');
    localStorage.removeItem('VS1TbillReport');
    localStorage.removeItem('VS1TbillReport');
    localStorage.removeItem('VS1TCreditList');
    localStorage.removeItem('VS1TpurchaseOrderNonBackOrderList');
    localStorage.removeItem('VS1TpurchaseOrderBackOrderList');
    localStorage.removeItem('VS1TSalesList');

    localStorage.setItem('VS1ProductList', '[]');
    localStorage.setItem('VS1CustomerList', '[]');
    localStorage.setItem('VS1SupplierList', '[]');
    localStorage.setItem('VS1AccountList', '[]');
    localStorage.setItem('VS1TaxCodeList', '[]');
    localStorage.setItem('VS1TermsList', '[]');
    localStorage.setItem('VS1DepartmentList', '[]');
    localStorage.setItem('VS1CurrencyList', '[]');
    localStorage.setItem('VS1LeadStatusList', '[]');
    localStorage.setItem('VS1ShippingMethodList', '[]');
    localStorage.setItem('VS1AccountTypeList', '[]');
    localStorage.setItem('VS1ERPCombinedContactsList', '[]');
    localStorage.setItem('VS1EmployeeList', '[]');
    localStorage.setItem('VS1JournalEntryLineList', '[]');
    localStorage.setItem('VS1BankAccountReportList', '[]');
    localStorage.setItem('VS1TInvoiceList', '[]');
    localStorage.setItem('VS1TInvoiceNonBackOrderList', '[]');
    localStorage.setItem('VS1BackOrderSalesListList', '[]');
    localStorage.setItem('VS1TPurchaseOrderList', '[]');
    localStorage.setItem('VS1TReconcilationList', '[]');
    localStorage.setItem('VS1TChequeList', '[]');
    localStorage.setItem('VS1TProductStocknSalePeriodReport', '[]');
    localStorage.setItem('VS1TAppUserList', '[]');
    localStorage.setItem('VS1TJobVS1List', '[]');
    localStorage.setItem('VS1TStockAdjustEntryList', '[]');
    localStorage.setItem('VS1TsalesOrderNonBackOrderList', '[]');
    localStorage.setItem('VS1TbillReport', '[]');
    localStorage.setItem('VS1TbillReport', '[]');
    localStorage.setItem('VS1TCreditList', '[]');
    localStorage.setItem('VS1TpurchaseOrderNonBackOrderList', '[]');
    localStorage.setItem('VS1TpurchaseOrderBackOrderList', '[]');
    localStorage.setItem('VS1TSalesList', '[]');

    localStorage.setItem('isPurchasedTrueERPModule', false);

    Session.setPersistent('VS1ProductList', '');
    localStorage.setItem('VS1SalesProductList', '');
    localStorage.setItem('VS1PurchaseAccountList', '');

    localStorage.setItem('VS1ProductPrintList', '');
    localStorage.setItem('VS1CustomerList', '');
    localStorage.setItem('VS1SupplierList', '');
    localStorage.setItem('VS1EmployeeList', '');
    localStorage.setItem('VS1ManufacturingList', '');
    localStorage.setItem('VS1ShippingList', '');

    localStorage.setItem('VS1CustomerAwaitingPaymentList', '');
    localStorage.setItem('VS1CustomerPaymentList', '');
    localStorage.setItem('VS1SupplierPOAwaitingPaymentList', '');
    localStorage.setItem('VS1SupplierBillAwaitingPaymentList', '');
    localStorage.setItem('VS1SupplierPaymentList', '');

    localStorage.setItem('VS1StockTransferList', '');
    localStorage.setItem('VS1AccessLevelList', '');
    localStorage.setItem('VS1TERPFormList', '');
    localStorage.setItem('vs1LoggedEmployeeImages_dash', '');

    localStorage.removeItem('VS1FormAccessDetail');
    localStorage.setItem('VS1FormAccessDetail', '');

    Session.setPersistent('ERPCurrency', '$');

    Session.setPersistent('ERPDefaultDepartment', '');
    Session.setPersistent('mycloudLogonPassword', '');
    Session.setPersistent('mycloudLogonID', '');
    Session.setPersistent('mycloudLogonRole', '');
    Session.setPersistent('myerpPassword', '');
    Session.setPersistent('mySessionEmployee', '');
    localStorage.setItem('EIPAddress', '');
    localStorage.setItem('EUserName', '');
    localStorage.setItem('EPassword', '');
    localStorage.setItem('EDatabase', '');
    localStorage.setItem('EPort', '');
    Session.setPersistent('mySessionEmployeeLoggedID', '');
    localStorage.setItem('mySession', '');
    Session.setPersistent('mySessionEmployee', '');
    Session.setPersistent('loginEmail', '');

    Session.setPersistent('mycloudLogonDBID', '');
    Session.setPersistent('mycloudLogonID', '');
    Session.setPersistent('mycloudLogonUsername', '');
    Session.setPersistent('mycloudLogonUserEmail', '');

    Session.setPersistent('mainEIPAddress', '');
    Session.setPersistent('mainEPort', '');
    Session.setPersistent('isGreenTrack', false);

    Session.setPersistent('VS1AdminUserName', '');
    localStorage.setItem('VS1AdminUserName', '');
    localStorage.setItem('VS1OrgEmail', '');
    Session.setPersistent('myExpenses', '');
    Session.setPersistent('myMonthlyErnings', '');

    localStorage.setItem('vs1cloudlicenselevel', '');

    if (FlowRouter.current().queryParams.emailakey) {
        $('#email').val(FlowRouter.current().queryParams.emailakey);

    }
    if (FlowRouter.current().queryParams.passkey) {
        if (FlowRouter.current().context.hash.length > 1) {
            $('#erppassword').val(unescape(encodeURIComponent((FlowRouter.current().queryParams.passkey + '#' + FlowRouter.current().context.hash))));
        } else {
            $('#erppassword').val(unescape(encodeURIComponent((FlowRouter.current().queryParams.passkey))));
        }
        //$('#erppassword').val(escape(FlowRouter.current().queryParams.passkey));
    }

    function needsToSeePrompt() {
        if (navigator.standalone) {
            return false;
        }
        let userAgent = window.navigator.userAgent.toLowerCase();
        let isApple = /iphone|ipad|ipod/.test(userAgent);
        if (isApple === true) {
            $('#install-prompt').modal();
        }
    }

    setTimeout(function () {
        needsToSeePrompt();
    }, 500);
    const templateObject = Template.instance();
    const arrayformid = [];
    const arrayformdet = [];
    let accesslevelService = new AccessLevelService();
    var employeeProfileService = new EmployeeProfileService();
    templateObject.checkOpenDbCheckVersion = function() {
    openDbCheckVersion().then(function (versiondata) {
          if(versiondata == true){
          window.indexedDB.databases().then((r) => {
              for (var v = 0; v < r.length; v++) {
                  window.indexedDB.deleteDatabase(r[v].name);
              }

          }).then(() => {

          });
        }

    }).catch(function (err) {

    });
   };
    templateObject.checkOpenDbCheckVersion();
    function getSideBarData(employeeID, accessUserName, accessDatabase, erpdbname) {

        let lineItemslevel = [];
        let lineItemObjlevel = {};

        let lineItemsAccesslevel = [];
        let lineItemAccessObjlevel = {};

        let isInvoice = false;
        let isDocket = false;
        let isUserPassDetail = false;
        let isViewDockets = false;

        let isSalesQtyOnly = false;
        let isPurchaseQtyOnly = false;

        let isDashboard = false;
        let isMain = false;
        let isInventory = false;
        let isManufacturing = false;
        let isAccessLevels = false;
        let isShipping = false;
        let isStockTransfer = false;
        let isStockAdjustment = false;
        let isStockTake = false;
        let isSales = false;
        let isPurchases = false;
        let isExpenseClaims = false;
        let isFixedAssets = false;

        let isPayments = false;
        let isContacts = false;
        let isAccounts = false;
        let isReports = false;
        let isSettings = false;

        let isSidePanel = true;
        let isTopPanel = false;
        let isSidePanelID = '';
        let isTopPanelID = '';
        let isSidePanelFormID = '';
        let isTopPanelFormID = '';

        /* Lincence Check for Menu Options */
        let isFixedAssetsLicence = Session.get('CloudFixedAssetsLicence');
        let isInventoryLicence = Session.get('CloudInventoryLicence');
        let isManufacturingLicence = Session.get('CloudManufacturingLicence');
        let isPurchasesLicence = Session.get('CloudPurchasesLicence');
        let isSalesLicence = Session.get('CloudSalesLicence');
        let isShippingLicence = Session.get('CloudShippingLicence');
        let isStockTakeLicence = Session.get('CloudStockTakeLicence');
        let isStockTransferLicence = Session.get('CloudStockTransferLicence');
        let isMainLicence = Session.get('CloudMainLicence');
        let isDashboardLicence = Session.get('CloudDashboardLicence');

        /*Licence Check Menu to add */
        let isAccountsLicence = Session.get('CloudAccountsLicence');
        let isContactsLicence = Session.get('CloudContactsLicence');
        let isExpenseClaimsLicence = Session.get('CloudExpenseClaimsLicence');
        let isPaymentsLicence = Session.get('CloudPaymentsLicence');
        let isReportsLicence = Session.get('CloudReportsLicence');
        let isSettingsLicence = Session.get('CloudSettingsLicence');
        /*End Licence Check Menu to add */
        /* End Licence Check for menu option */
        var ERPDetails = erpdbname;
        var SegsDatabase = ERPDetails.split(',');
        var ERPFormAccessDetailObject = "TEmployeeFormAccessDetail?ListType=Detail&Select=[TabGroup]=26 and [EmployeeId]='" + employeeID + "'";
        var oReqFormAccessDetailObject = new XMLHttpRequest();
        oReqFormAccessDetailObject.open("GET", URLRequest + SegsDatabase[0] + ':' + SegsDatabase[4] + '/' + "erpapi" + '/' + ERPFormAccessDetailObject, true);
        oReqFormAccessDetailObject.setRequestHeader("database", SegsDatabase[1]);
        oReqFormAccessDetailObject.setRequestHeader("username", SegsDatabase[2]);
        oReqFormAccessDetailObject.setRequestHeader("password", SegsDatabase[3]);
        oReqFormAccessDetailObject.send();

        oReqFormAccessDetailObject.onreadystatechange = function () {
            if (oReqFormAccessDetailObject.readyState == 4 && oReqFormAccessDetailObject.status == 200) {
                var data = JSON.parse(oReqFormAccessDetailObject.responseText)
                    for (let i = 0; i < data.temployeeformaccessdetail.length; i++) {
                        lineItemObjlevel = {
                            formID: data.temployeeformaccessdetail[i].fields.FormId || '',
                            accessLevel: data.temployeeformaccessdetail[i].fields.AccessLevel || '',
                            accessLevelname: data.temployeeformaccessdetail[i].fields.AccessLevelName || '',
                            description: data.temployeeformaccessdetail[i].fields.Description || '',
                            formName: data.temployeeformaccessdetail[i].fields.FormName || '',
                            accessID: data.temployeeformaccessdetail[i].fields.ID || '',
                        };

                        if (data.temployeeformaccessdetail[i].fields.AccessLevelName === "Full Access") {
                            if (data.temployeeformaccessdetail[i].fields.Description === "Print Delivery Docket") {
                                isDocket = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Print Invoice") {
                                isInvoice = true;
                            }

                            if (data.temployeeformaccessdetail[i].fields.Description === "User Password Details") {
                                isUserPassDetail = true;
                            }

                            if (data.temployeeformaccessdetail[i].fields.Description === "Dashboard") {
                                isDashboard = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Main") {
                                isMain = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") {
                                isInventory = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") {
                                isManufacturing = true;
                            }

                            if (data.temployeeformaccessdetail[i].fields.Description === "Settings") {
                                isAccessLevels = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Shipping") {
                                isShipping = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") {
                                isStockTransfer = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Stock Adjustment") {
                                isStockAdjustment = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Side Panel Menu") {
                                isSidePanel = true;
                                isSidePanelID = data.temployeeformaccessdetail[i].fields.ID;
                                isSidePanelFormID = data.temployeeformaccessdetail[i].fields.FormId;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Top Panel Menu") {
                                isTopPanel = true;
                                isTopPanelID = data.temployeeformaccessdetail[i].fields.ID;
                                isTopPanelFormID = data.temployeeformaccessdetail[i].fields.FormId;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Stock Take") {
                                isStockTake = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Sales") {
                                isSales = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Purchases") {
                                isPurchases = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Receipt Claims") {
                                isExpenseClaims = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") {
                                isFixedAssets = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Payments") {
                                isPayments = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Contacts") {
                                isContacts = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Accounts") {

                                isAccounts = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Reports") {
                                isReports = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "Settings") {
                                isSettings = true;
                            }
                            if (data.temployeeformaccessdetail[i].fields.Description === "View Dockets") {
                                isViewDockets = true;
                            }

                            if (data.temployeeformaccessdetail[i].fields.Description === "Qty Only on Purchase Order") {
                                isPurchaseQtyOnly = true;
                            }

                            if (data.temployeeformaccessdetail[i].fields.Description === "Qty Only on Sales") {
                                isSalesQtyOnly = true;
                            }

                            lineItemAccessObjlevel = {
                                formID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                accessLevel: data.temployeeformaccessdetail[i].fields.AccessLevel || '',
                                accessLevelname: data.temployeeformaccessdetail[i].fields.AccessLevelName || '',
                                description: data.temployeeformaccessdetail[i].fields.Description || '',
                                formName: data.temployeeformaccessdetail[i].fields.FormName || '',
                                accessID: data.temployeeformaccessdetail[i].fields.ID || '',
                            };
                            lineItemsAccesslevel.push(lineItemAccessObjlevel);
                        }

                        lineItemslevel.push(lineItemObjlevel);

                    }
                    //if (!isDashboardLicence) {
                        isDashboard = false;
                    //}

                    if (!isFixedAssetsLicence) {
                        isFixedAssets = false;
                    }
                    if (!isInventoryLicence) {
                        isInventory = false;
                        isStockTransfer = false;
                        isStockAdjustment = false;
                    }
                    if (!isManufacturingLicence) {
                        isManufacturing = false;
                    }
                    if (!isPurchasesLicence) {
                        isPurchases = false;
                    }
                    if (!isSalesLicence) {
                        isSales = false;
                    }
                    if (!isShippingLicence) {
                        isShipping = false;
                    }
                    if (!isStockTakeLicence) {
                        isStockTake = false;
                    }

                    if (!isAccountsLicence) {
                        isAccounts = false;
                    }
                    if (!isContactsLicence) {
                        isContacts = false;
                    }
                    if (!isExpenseClaimsLicence) {
                        isExpenseClaims = false;
                    }
                    if (!isPaymentsLicence) {
                        isPayments = false;
                    }
                    if (!isReportsLicence) {
                        isReports = false;
                    }

                    if (!isSettingsLicence) {
                        isSettings = false;
                    }

                    if (!isMainLicence) {
                        isMain = false;
                    }

                    Session.setPersistent('CloudPrintDeliveryDocket', isDocket);
                Session.setPersistent('CloudPrintInvoice', isInvoice);
                Session.setPersistent('CloudUserPass', isUserPassDetail);

                Session.setPersistent('CloudViewDockets', isViewDockets);

                Session.setPersistent('CloudSalesQtyOnly', isSalesQtyOnly);
                Session.setPersistent('CloudPurchaseQtyOnly', isPurchaseQtyOnly);

                Session.setPersistent('CloudDashboardModule', isDashboard);
                Session.setPersistent('CloudMainModule', isMain);
                Session.setPersistent('CloudInventoryModule', isInventory);
                Session.setPersistent('CloudManufacturingModule', isManufacturing);
                Session.setPersistent('CloudAccessLevelsModule', isAccessLevels);
                Session.setPersistent('CloudShippingModule', isShipping);
                Session.setPersistent('CloudStockTransferModule', isStockTransfer);
                Session.setPersistent('CloudStockAdjustmentModule', isStockAdjustment);
                Session.setPersistent('CloudStockTakeModule', isStockTake);
                Session.setPersistent('CloudSalesModule', isSales);
                Session.setPersistent('CloudPurchasesModule', isPurchases);
                Session.setPersistent('CloudExpenseClaimsModule', isExpenseClaims);
                Session.setPersistent('CloudFixedAssetsModule', isFixedAssets);

                Session.setPersistent('CloudPaymentsModule', isPayments);
                Session.setPersistent('CloudContactsModule', isContacts);
                Session.setPersistent('CloudAccountsModule', isAccounts);
                Session.setPersistent('CloudReportsModule', isReports);
                Session.setPersistent('CloudSettingsModule', isSettings);

                Session.setPersistent('CloudSidePanelMenu', isSidePanel);
                Session.setPersistent('CloudTopPanelMenu', isTopPanel);
                Session.setPersistent('CloudSidePanelMenuID', isSidePanelID);
                Session.setPersistent('CloudTopPanelMenuID', isTopPanelID);
                Session.setPersistent('CloudSidePanelMenuFormID', isSidePanelFormID);
                Session.setPersistent('CloudTopPanelMenuFormID', isTopPanelFormID);

                let userSerssion = {
                    'loggedEmpID': employeeID,
                    'loggedUserName': accessUserName,
                    'loggedDatabase': accessDatabase,
                    'loggedAccessData': lineItemslevel
                };
                Session.setPersistent('ERPSolidCurrentUSerAccess', userSerssion);

                let userModuleRedirect = lineItemsAccesslevel.sort(function (a, b) {
                    if (a.description.toLowerCase() == 'NA') {
                        return 1;
                    } else if (b.description.toLowerCase() == 'NA') {
                        return -1;
                    }
                    return (a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1;
                });
                // myVS1Video.pause();
                $('.myVS1Video').css('display', 'none');
                $('.myVS1VideoLogin').css('display', 'none');

                window.open('/dashboard', '_self');

            }
        }

    }

    var caches;
    function clearCaches() {
        // caches.keys().then(function (names) {
        //     for(let name of names) {
        //     caches.delete(name);
        //   }
        // }).catch(function(err) {
        //
        // });
         localStorage.clear();
         sessionStorage.clear();
    }

    /* ERP Licence Info */
    function getERPLicenceInfo(erpdbname) {
        let licenceitemsoption = [];
        let licenceitemsObj = {};

        /* licence Option To Add */
        let isAccountsLicence = true;
        let isContactsLicence = true;
        let isExpenseClaimsLicence = false;
        let isPaymentsLicence = true;
        let isReportsLicence = true;
        let isSettingsLicence = true;
        /*End Option to Add */

        let isFixedAssetsLicence = false;
        let isInventoryLicence = true;
        let isManufacturingLicence = false;
        let isPurchasesLicence = true;
        let isSalesLicence = true;
        let isShippingLicence = false;
        let isStockTakeLicence = true;
        let isStockTransferLicence = false;

        let isMainLicence = true;
        let isDashboardLicence = true;

        /* Remove licence */

        Session.setPersistent('CloudAccountsLicence', isAccountsLicence);
        Session.setPersistent('CloudContactsLicence', isContactsLicence);
        Session.setPersistent('CloudExpenseClaimsLicence', isExpenseClaimsLicence);
        Session.setPersistent('CloudPaymentsLicence', isPaymentsLicence);
        Session.setPersistent('CloudReportsLicence', isReportsLicence);
        Session.setPersistent('CloudSettingsLicence', isSettingsLicence);

        Session.setPersistent('CloudMainLicence', isMainLicence);
        Session.setPersistent('CloudDashboardLicence', isDashboardLicence);

        Session.setPersistent('CloudFixedAssetsLicence', isFixedAssetsLicence);
        Session.setPersistent('CloudInventoryLicence', isInventoryLicence);
        Session.setPersistent('CloudManufacturingLicence', isManufacturingLicence);
        Session.setPersistent('CloudPurchasesLicence', isPurchasesLicence);
        Session.setPersistent('CloudSalesLicence', isSalesLicence);
        Session.setPersistent('CloudShippingLicence', isShippingLicence);
        Session.setPersistent('CloudStockTakeLicence', isStockTakeLicence);
        Session.setPersistent('CloudStockTransferLicence', isStockTransferLicence);
        /* End Remove licence */

    }

    function getAccessLevelData(userAccessOptions, isSameUserLogin) {
        let lineItemslevel = [];
        let lineItemObjlevel = {};
        let lineItemsAccesslevel = [];
        let lineItemAccessObjlevel = {};

        let isInvoice = false;
        let isDocket = false;
        let isUserPassDetail = false;
        let isViewDockets = false;

        let isSalesQtyOnly = false;
        let isPurchaseQtyOnly = false;

        let isDashboard = false;
        let isMain = false;
        let isInventory = false;
        let isShowSerial = false;
        let isManufacturing = false;
        let isAccessLevels = false;
        let isShipping = false;
        let isStockTransfer = false;
        let isStockAdjustment = false;
        let isStockTake = false;
        let isProductCost = false;
        let isSales = false;
        let isPurchases = false;
        let isExpenseClaims = false;
        let isFixedAssets = false;

        let isPayments = false;
        let isContacts = false;
        let isAccounts = false;
        let isReports = false;
        let isSettings = false;

        let isSidePanel = true;
        let isTopPanel = false;
        let isSidePanelID = '';
        let isTopPanelID = '';
        let isSidePanelFormID = '';
        let isTopPanelFormID = '';

        let isSeedToSale = true;
        let isBanking = false;
        let isPayroll = false;
        let isTimesheetEntry = false;
        let isClockOnOff = false;
        let isAppointmentScheduling = false;
        let isAppointmentStartStop = false;
        let isAppointmentLaunch = false;
        let isAllocationLaunch = false;
        let isAppointmentNotes = false;
        let isAddAttachment = false;
        let isCanOnlySeeOwnAppointment = false;
        let isCanOnlySeeOwnTimesheets = false;
        let isCanOnlySeeOwnAllocations = false;
        let isCreateAppointment = false;

        let isEditTimesheetHours = false;
        let isTimesheetClockOnClockOff = false;
        let isClockOnOffLaunch = false;
        let isTimesheetStartStop = false;
        let isTimesheetCreate = false;
        let isShowTimesheet = false;

        /* Lincence Check for Menu Options */
        let isFixedAssetsLicence = Session.get('CloudFixedAssetsLicence');
        let isInventoryLicence = Session.get('CloudInventoryLicence');
        let isManufacturingLicence = Session.get('CloudManufacturingLicence');
        let isPurchasesLicence = Session.get('CloudPurchasesLicence');
        let isSalesLicence = Session.get('CloudSalesLicence');
        let isShippingLicence = Session.get('CloudShippingLicence');
        let isStockTakeLicence = Session.get('CloudStockTakeLicence');
        let isStockTransferLicence = Session.get('CloudStockTransferLicence');
        let isMainLicence = Session.get('CloudMainLicence');
        let isDashboardLicence = Session.get('CloudDashboardLicence');

        let isSeedToSaleLicence = Session.get('CloudSeedToSaleLicence');
        let isBankingLicence = Session.get('CloudBankingLicence');
        let isPayrollLicence = Session.get('CloudPayrollLicence');

        /*Licence Check Menu to add */
        let isAccountsLicence = Session.get('CloudAccountsLicence');
        let isContactsLicence = Session.get('CloudContactsLicence');
        let isExpenseClaimsLicence = Session.get('CloudExpenseClaimsLicence');
        let isPaymentsLicence = Session.get('CloudPaymentsLicence');
        let isReportsLicence = Session.get('CloudReportsLicence');
        let isSettingsLicence = Session.get('CloudSettingsLicence');
        let isAppointmentSchedulingLicence = Session.get('CloudAppointmentSchedulingLicence');
        /*End Licence Check Menu to add */
        /* End Licence Check for menu option */
        if (userAccessOptions.items) {
            $.each(userAccessOptions.items, function (itemaccess, optionaccess) {
                lineItemObjlevel = {
                    formID: optionaccess.fields.FormId || '',
                    accessLevel: optionaccess.fields.AccessLevel || '',
                    accessLevelname: optionaccess.fields.AccessLevelName || '',
                    description: optionaccess.fields.Description || '',
                    formName: optionaccess.fields.FormName || '',
                    accessID: optionaccess.fields.Id || '',
                };

                if (optionaccess.fields.AccessLevel === 1) {
                    if (optionaccess.fields.Description === "Print Delivery Docket") {
                        isDocket = true;
                    }
                    if (optionaccess.fields.Description === "Print Invoice") {
                        isInvoice = true;
                    }

                    if (optionaccess.fields.Description === "User Password Details") {
                        isUserPassDetail = true;
                    }

                    if (optionaccess.fields.Description === "Appointment - Start and Stop Only") {
                        isAppointmentStartStop = true;
                    }

                    if (optionaccess.fields.Description === "Appointment - Add Attachments") {
                        isAddAttachment = true;
                    }

                    if (optionaccess.fields.Description === "Create a New Appointment") {
                        isCreateAppointment = true;
                    }

                     if (optionaccess.fields.Description === "Product Cost Adjustment") {
                        isProductCost = true;
                    }

                    if (optionaccess.fields.Description === "Can Only See Own Appointments") {
                        isCanOnlySeeOwnAppointment = true;
                    }

                    if (optionaccess.fields.Description === "Can Only See Own TimeSheet") {
                        isCanOnlySeeOwnTimesheets = true;
                    }

                    if (optionaccess.fields.Description === "Show TimeSheet") {
                        isShowTimesheet = true;
                    }


                     if (optionaccess.fields.Description === "Launch Clock On / Off") {
                        isClockOnOffLaunch = true;
                    }

                    if (optionaccess.fields.Description === "TimeSheet - Start and Stop Only") {
                        isTimesheetStartStop = true;
                    }

                     if (optionaccess.fields.Description === "Create a New TimeSheet") {
                        isTimesheetCreate = true;
                    }


                    if (optionaccess.fields.Description === "Appointment - Add Notes") {
                        isAppointmentNotes = true;
                    }

                    if (optionaccess.fields.Description === "Launch Appointment") {
                        isAppointmentLaunch = true;
                    }

                    if (optionaccess.fields.Description === "Launch Allocation") {
                        isAllocationLaunch = true;
                    }

                    if (optionaccess.fields.Description === "Allow Editing Timesheet Hours") {
                        isEditTimesheetHours = true;
                    }

                    if (optionaccess.fields.Description === "Dashboard") {
                        isDashboard = true;
                    }
                    if (optionaccess.fields.Description === "Main") {
                        isMain = true;
                    }
                    if (optionaccess.fields.Description === "Inventory" || optionaccess.fields.Description === "Inventory Tracking") {
                        isInventory = true;
                    }
                    if (optionaccess.fields.Description === "Manufacturing") {
                        isManufacturing = true;
                    }

                    if (optionaccess.fields.Description === "Settings") {
                        isAccessLevels = true;
                    }
                    if (optionaccess.fields.Description === "Shipping") {
                        isShipping = true;
                    }
                    if (optionaccess.fields.Description === "Stock Transfer") {
                        isStockTransfer = true;
                    }

                    if (optionaccess.fields.Description === "Stock Adjustment") {
                        isStockAdjustment = true;
                    }

                     if (optionaccess.fields.Description === "Show Available Serial Numbers") {
                            isShowSerial = true;
                     }

                    if (optionaccess.fields.Description === "Side Panel Menu") {
                        isSidePanel = true;
                        isSidePanelID = optionaccess.fields.ID;
                        isSidePanelFormID = optionaccess.fields.FormId;
                    }
                    if (optionaccess.fields.Description === "Top Panel Menu") {
                        isTopPanel = true;
                        isTopPanelID = optionaccess.fields.ID;
                        isTopPanelFormID = optionaccess.fields.FormId;
                    }
                    if (optionaccess.fields.Description === "Stock Take") {
                        isStockTake = true;
                    }
                    if (optionaccess.fields.Description === "Sales") {
                        isSales = true;
                    }
                    if (optionaccess.fields.Description === "Purchases") {
                        isPurchases = true;
                    }
                    if (optionaccess.fields.Description === "Receipt Claims") {
                        isExpenseClaims = true;
                    }
                    if (optionaccess.fields.Description === "Fixed Assets") {
                        isFixedAssets = true;
                    }
                    if (optionaccess.fields.Description === "Payments") {
                        isPayments = true;
                    }
                    if (optionaccess.fields.Description === "Contacts") {
                        isContacts = true;
                    }
                    if (optionaccess.fields.Description === "Accounts") {

                        isAccounts = true;
                    }
                    if (optionaccess.fields.Description === "Reports") {
                        isReports = true;
                    }
                    if (optionaccess.fields.Description === "Settings") {
                        isSettings = true;
                    }
                    if (optionaccess.fields.Description === "View Dockets") {
                        isViewDockets = true;
                    }

                    if (optionaccess.fields.Description === "Qty Only on Purchase Order") {
                        isPurchaseQtyOnly = true;
                    }

                    if (optionaccess.fields.Description === "Qty Only on Sales") {
                        isSalesQtyOnly = true;
                    }

                    if (optionaccess.fields.Description === "Timesheet Entry") {
                        isTimesheetEntry = true;
                        isPayroll = true;
                    }

                    if (optionaccess.fields.Description === "Clock On/Off") {
                        isClockOnOff = true;
                        isPayroll = true;
                    }

                    if (optionaccess.fields.Description === "Appointments") {
                        isAppointmentScheduling = true;
                    }

                    if (optionaccess.fields.Description === "Banking") {
                        isBanking = true;
                    }

                    lineItemAccessObjlevel = {
                        formID: optionaccess.fields.FormId || '',
                        accessLevel: optionaccess.fields.AccessLevel || '',
                        accessLevelname: optionaccess.fields.AccessLevelName || '',
                        description: optionaccess.fields.Description || '',
                        formName: optionaccess.fields.FormName || '',
                        accessID: optionaccess.fields.ID || '',
                    };
                    lineItemsAccesslevel.push(lineItemAccessObjlevel);
                }

                lineItemslevel.push(lineItemObjlevel);

            });

            if (!isDashboardLicence) {
                isDashboard = false;
            }
            if (!isFixedAssetsLicence) {
                isFixedAssets = false;
            }
            if (!isAppointmentSchedulingLicence) {
                isAppointmentStartStop = false;
            }
            if (!isInventoryLicence) {
                isInventory = false;
                isProductCost = false;
                isStockTransfer = false;
                isStockAdjustment = false;
            }
            if (!isManufacturingLicence) {
                isManufacturing = false;
            }
            if (!isPurchasesLicence) {
                isPurchases = false;
            }
            if (!isSalesLicence) {
                isSales = false;
            }
            if (!isShippingLicence) {
                isShipping = false;
            }
            if (!isStockTakeLicence) {
                isStockTake = false;
            }

            if (!isAccountsLicence) {
                isAccounts = false;
            }
            if (!isContactsLicence) {
                isContacts = false;
            }
            if (!isExpenseClaimsLicence) {
                isExpenseClaims = false;
            }
            if (!isPaymentsLicence) {
                isPayments = false;
            }
            if (!isReportsLicence) {
                isReports = false;
            }

            if (!isSettingsLicence) {
                isSettings = false;
            }

            if (!isMainLicence) {
                isMain = false;
            }

            if (!isSeedToSaleLicence) {
                isSeedToSale = false;
            }

            if (!isBankingLicence) {
                isBanking = false;
            }

            if (!isPayrollLicence) {
                isPayroll = false;
            }

            if (!isAppointmentSchedulingLicence) {
                isAppointmentScheduling = false;
            }

            if (!isAppointmentSchedulingLicence) {
                isAppointmentLaunch = false;
            }

            Session.setPersistent('CloudPrintDeliveryDocket', isDocket);
            Session.setPersistent('CloudPrintInvoice', isInvoice);
            Session.setPersistent('CloudUserPass', isUserPassDetail);

            Session.setPersistent('CloudViewDockets', isViewDockets);

            Session.setPersistent('CloudSalesQtyOnly', isSalesQtyOnly);
            Session.setPersistent('CloudPurchaseQtyOnly', isPurchaseQtyOnly);

            Session.setPersistent('CloudTimesheetEntry', isTimesheetEntry);
            Session.setPersistent('CloudClockOnOff', isClockOnOff);

            Session.setPersistent('CloudDashboardModule', isDashboard);
            Session.setPersistent('CloudMainModule', isMain);
            Session.setPersistent('CloudInventoryModule', isInventory);
            Session.setPersistent('CloudManufacturingModule', isManufacturing);
            Session.setPersistent('CloudAccessLevelsModule', isAccessLevels);
            Session.setPersistent('CloudShippingModule', isShipping);
            Session.setPersistent('CloudStockTransferModule', isStockTransfer);
            Session.setPersistent('CloudShowSerial', isShowSerial);
            Session.setPersistent('CloudStockAdjustmentModule', isStockAdjustment);
            Session.setPersistent('CloudStockTakeModule', isStockTake);
            Session.setPersistent('CloudSalesModule', isSales);
            Session.setPersistent('CloudPurchasesModule', isPurchases);
            Session.setPersistent('CloudExpenseClaimsModule', isExpenseClaims);
            Session.setPersistent('CloudFixedAssetsModule', isFixedAssets);
            Session.setPersistent('CloudProductCost', isProductCost);
            Session.setPersistent('CloudPaymentsModule', isPayments);
            Session.setPersistent('CloudContactsModule', isContacts);
            Session.setPersistent('CloudAccountsModule', isAccounts);
            Session.setPersistent('CloudReportsModule', isReports);
            Session.setPersistent('CloudSettingsModule', isSettings);

            Session.setPersistent('CloudSidePanelMenu', isSidePanel);
            Session.setPersistent('CloudTopPanelMenu', isTopPanel);
            Session.setPersistent('CloudSidePanelMenuID', isSidePanelID);
            Session.setPersistent('CloudTopPanelMenuID', isTopPanelID);
            Session.setPersistent('CloudSidePanelMenuFormID', isSidePanelFormID);
            Session.setPersistent('CloudTopPanelMenuFormID', isTopPanelFormID);

            Session.setPersistent('CloudSeedToSaleModule', isSeedToSale);
            Session.setPersistent('CloudBankingModule', isBanking);
            Session.setPersistent('CloudPayrollModule', isPayroll);

            Session.setPersistent('CloudAppointmentSchedulingModule', isAppointmentScheduling);
            Session.setPersistent('CloudAppointmentStartStopAccessLevel', isAppointmentStartStop);
            Session.setPersistent('CloudAppointmentAppointmentLaunch', isAppointmentLaunch);
            Session.setPersistent('CloudAppointmentAllocationLaunch', isAllocationLaunch);
            Session.setPersistent('CloudAppointmentAddAttachment', isAddAttachment);
            Session.setPersistent('CloudAppointmentSeeOwnAppointmentsOnly', isCanOnlySeeOwnAppointment);
            Session.setPersistent('CloudAppointmentCreateAppointment', isCreateAppointment);
            Session.setPersistent('CloudAppointmentNotes', isAppointmentNotes);
            Session.setPersistent('CloudEditTimesheetHours', isEditTimesheetHours);


             Session.setPersistent('CloudTimesheetSeeOwnTimesheets', isCanOnlySeeOwnTimesheets);
             Session.setPersistent('CloudTimesheetLaunch', isClockOnOffLaunch);
             Session.setPersistent('CloudTimesheetStartStop', isTimesheetStartStop);
             Session.setPersistent('CloudCreateTimesheet', isTimesheetCreate);
             Session.setPersistent('CloudShowTimesheet', isShowTimesheet);
            let userSerssion = {
                'loggedEmpID': userAccessOptions.items[0].fields.EmployeeId,
                'loggedUserName': Session.get('EUserName'),
                'loggedDatabase': Session.get('EDatabase'),
                'loggedAccessData': lineItemslevel
            };
            Session.setPersistent('ERPSolidCurrentUSerAccess', userSerssion);

            let userModuleRedirect = lineItemsAccesslevel.sort(function (a, b) {
                if (a.description.toLowerCase() == 'NA') {
                    return 1;
                } else if (b.description.toLowerCase() == 'NA') {
                    return -1;
                }
                return (a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1;
            });

            if (isAppointmentScheduling == true) {
                if (isAllocationLaunch == true) {
                    window.open('/appointments#allocationModal', '_self');
                } else if (isAppointmentLaunch == true) {
                    window.open('/appointments', '_self');
                } else {
                    window.open('/dashboard', '_self');
                }
            } else {
                window.open('/dashboard', '_self');
            }

        } else {
            myVS1Video.pause();
            $('.myVS1Video').css('display', 'none');
            $('.myVS1VideoLogin').css('display', 'none');
            $('.loginSpinner').css('display', 'none');
            $('.fullScreenSpin').css('display', 'none');
        }
    }
    var times = 0;

    $("#login-button").click(function (e) {

        var myVS1Video = document.getElementById("myVS1Video");

        let userLoginEmail = $("#email").val();
        let userLoginPassword = escape($('#erppassword').val());
        let hashUserLoginPassword = CryptoJS.MD5(userLoginPassword.toUpperCase()).toString();
        var counterUserRec = null;
        let employeeUserID = '';
        let loggedUserEventFired = false;

        Session.setPersistent('ERPCurrency', '$');

        Session.setPersistent('ERPDefaultDepartment', 'Default');
        Session.setPersistent('ERPDefaultUOM', '');

        if ($('#remember_me').is(':checked')) {

            localStorage.usremail = $('#email').val();
            localStorage.usrpassword = $('#erppassword').val();
            localStorage.chkbx = $('#remember_me').val();
        } else {
            localStorage.usremail = '';
            localStorage.usrpassword = '';
            localStorage.chkbx = '';
        };

        if ($("#erppassword").val() == '') {

            swal('Invalid VS1 Password', 'The entered user password is not correct, please re-enter your password and try again!', 'error');
            $("#erppassword").focus();
            e.preventDefault();
        } else if (userLoginEmail === '') {

            swal('Invalid VS1 Email Address', 'The entered your user email address is not correct, please re-enter your email address and try again!', 'error');
            $("#email").focus();
            e.preventDefault();
        } else {
            Session.setPersistent('VS1AdminUserName', userLoginEmail);
            Meteor.call('readMethodLog', userLoginEmail, hashUserLoginPassword, function (error, result) {
                if (error) {

                    swal('Oops...', 'user-not-found, no user found please try again!', 'info');
                } else {
                    let regUserDetails = result;
                    if (regUserDetails) {
                        if (regUserDetails.length === 0) {
                            times++;
                            if (times > 2) {
                                if(userLoginEmail != ''){
                                  window.open('/forgotpassword?checktoken=' + userLoginEmail + '', '_self');
                                }else{
                                  window.open('/forgotpassword', '_self');
                                }
                            } else {}

                            swal('Oops...', 'Your email or password is incorrect, please try again!', 'error');
                            e.preventDefault();
                        }
                        for (let i = 0; i < regUserDetails.length; i++) {
                            if (regUserDetails.length == 1) {
                                //f(regUserDetails[i].userMultiLogon == true){

                                //  swal('Oops...', 'VS1 User Name is already logged in. Select "Sign me out of all devices" to login', 'info');
                                //$('.signmeout').css('display','block');

                                //}else{
                                times = 0;
                                var ERPIPAdderess = regUserDetails[i].server;
                                var ERPdbName = regUserDetails[i].database;
                                var ERPuserName = regUserDetails[i].username;
                                var ERPpassword = regUserDetails[i].password;
                                var ERPport = regUserDetails[i].port;

                                var ERPLoggeduserName = regUserDetails[i].cloudUsername;
                                var cloudLoggedID = '';
                                var cloudLoggedDBID = '';
                                var cloudLoggedUsername = '';
                                var cloudLoggedRole = regUserDetails[i].role;
                                var cloudUserEmail = regUserDetails[i].cloudEmail;
                                var cloudUserpassword = regUserDetails[i].cloudHashPassword;

                                Session.setPersistent('mycloudLogonPassword', cloudUserpassword);

                                let erpdbname = ERPIPAdderess + ',' + ERPdbName + ',' + ERPuserName + ',' + ERPpassword + ',' + ERPport;
                                getERPLicenceInfo(erpdbname);
                                var useremail = userLoginEmail;
                                var password = $("#erppassword").val();
                                var hashPassword = CryptoJS.MD5(password.toUpperCase()).toString();
                                var cloudPassword = regUserDetails[i].password;
                                if (hashPassword == cloudUserpassword) {
                                    $('.loginSpinner').css('display', 'inline-block');
                                    //$('.fullScreenSpin').css('display','inline-block');
                                    // $('.myVS1Video').css('display','inline-block');
                                    cloudLoggedID = regUserDetails[i]._id;
                                    cloudLoggedDBID = regUserDetails[i].clouddatabaseID;
                                    cloudLoggedUsername = regUserDetails[i].cloudUsername;

                                    Session.setPersistent('mycloudLogonDBID', cloudLoggedDBID);
                                    Session.setPersistent('mycloudLogonID', cloudLoggedID);
                                    Session.setPersistent('mycloudLogonUsername', cloudLoggedUsername);
                                    Session.setPersistent('mycloudLogonUserEmail', cloudUserEmail);

                                    Session.setPersistent('myerpPassword', cloudUserpassword);
                                    Session.setPersistent('mySessionEmployee', ERPuserName);

                                    localStorage.setItem('EIPAddress', ERPIPAdderess);
                                    localStorage.setItem('EUserName', ERPuserName);
                                    localStorage.setItem('EPassword', ERPpassword);
                                    localStorage.setItem('EDatabase', ERPdbName);
                                    localStorage.setItem('EPort', ERPport);
                                    loggedUserEventFired = true;

                                    localStorage.setItem('mainEIPAddress', licenceIPAddress);
                                    localStorage.setItem('mainEPort', checkSSLPorts);

                                    var ERPCheackUserObject = "TUser?PropertyList==ID,EmployeeId,LogonName,EmployeeName,PasswordHash,Active&Select=[LogonName]='" + ERPLoggeduserName + "'";
                                    var oReqCheackUserObject = new XMLHttpRequest();
                                    oReqCheackUserObject.open("GET", URLRequest + ERPIPAdderess + ':' + ERPport + '/' + "erpapi" + '/' + ERPCheackUserObject, true);
                                    oReqCheackUserObject.setRequestHeader("database", ERPdbName);
                                    oReqCheackUserObject.setRequestHeader("username", ERPuserName);
                                    oReqCheackUserObject.setRequestHeader("password", ERPpassword);
                                    oReqCheackUserObject.send();

                                    oReqCheackUserObject.onreadystatechange = function () {
                                        if (oReqCheackUserObject.readyState == 4 && oReqCheackUserObject.status == 200) {
                                            Session.setPersistent('LoggedUserEventFired', loggedUserEventFired);
                                            Session.setPersistent('userlogged_status', 'active');
                                            var dataListCheackUser = JSON.parse(oReqCheackUserObject.responseText)
                                                for (var eventCheackUser in dataListCheackUser) {
                                                    var dataCheackUserCopy = dataListCheackUser[eventCheackUser];
                                                    for (var dataCheackUser in dataCheackUserCopy) {
                                                        var mainCheackUserData = dataCheackUserCopy[dataCheackUser];
                                                        var user_password = mainCheackUserData.PasswordHash;
                                                        var empusername = mainCheackUserData.EmployeeName;
                                                        var employeeUserLogon = mainCheackUserData.LogonName;
                                                        var employeeUserID = mainCheackUserData.EmployeeId;
                                                        var employeename = mainCheackUserData.EmployeeName;
                                                        Session.setPersistent('mySessionEmployeeLoggedID', employeeUserID);
                                                        localStorage.setItem('mySession', empusername);
                                                        var sessionDataToLog = localStorage.getItem('mySession');
                                                        Session.setPersistent('mySessionEmployee', employeename);

                                                        var ERPCheackAppUserObject = "TAppUser?PropertyList==ID,DatabaseName,UserName,MultiLogon&Select=[DatabaseName]='" + ERPdbName + "' and [UserName]='" + ERPLoggeduserName + "'";
                                                        var oReqCheackAppUserObject = new XMLHttpRequest();
                                                        oReqCheackAppUserObject.open("GET", URLRequest + ERPIPAdderess + ':' + ERPport + '/' + "erpapi" + '/' + ERPCheackAppUserObject, true);
                                                        oReqCheackAppUserObject.setRequestHeader("database", ERPdbName);
                                                        oReqCheackAppUserObject.setRequestHeader("username", ERPuserName);
                                                        oReqCheackAppUserObject.setRequestHeader("password", ERPpassword);
                                                        oReqCheackAppUserObject.send();

                                                        oReqCheackAppUserObject.timeout = 30000;
                                                        oReqCheackAppUserObject.onreadystatechange = function () {
                                                            if (oReqCheackAppUserObject.readyState == 4 && oReqCheackAppUserObject.status == 200) {
                                                                var dataListCheackAppUser = JSON.parse(oReqCheackAppUserObject.responseText)
                                                                    for (var eventCheackAppUser in dataListCheackAppUser) {
                                                                        var dataCheackAppUserCopy = dataListCheackAppUser[eventCheackAppUser];
                                                                        if (dataCheackAppUserCopy.length === 0) {
                                                                            counterUserRec = true;
                                                                        } else if (dataCheackAppUserCopy.length === 1) {
                                                                            if (ERPuserName.toString().toUpperCase() == ERPLoggeduserName.toString().toUpperCase()) {
                                                                                counterUserRec = true;
                                                                            } else {
                                                                                counterUserRec = false;
                                                                            }

                                                                        } else {
                                                                            counterUserRec = false;
                                                                        };

                                                                        for (var dataCheackAppUser in dataCheackAppUserCopy) {
                                                                            var mainCheackAppUserData = dataCheackAppUserCopy[dataCheackAppUser];
                                                                            var erpUsername = mainCheackAppUserData.UserName;

                                                                        }
                                                                        if (counterUserRec === true) {

                                                                            getSideBarData(employeeUserID, employeeUserLogon, ERPIPAdderess, erpdbname);

                                                                            document.getElementById("error_log").style.display = 'none';

                                                                        } else {

                                                                            swal('Oops...', 'VS1 User Name is already logged in. Select "Sign me out of all devices" to login', 'info');
                                                                            myVS1Video.pause();
                                                                            $('.myVS1Video').css('display', 'none');
                                                                            $('.myVS1VideoLogin').css('display', 'none');
                                                                            $('.loginSpinner').css('display', 'none');
                                                                            $('.fullScreenSpin').css('display', 'none');

                                                                        }
                                                                    }
                                                            }

                                                        }
                                                        /*END APPUSER*/

                                                    }
                                                }
                                        } else if (oReqCheackUserObject.readyState == 4 && oReqCheackUserObject.status == 403) {
                                            swal({
                                                title: 'Oooops...',
                                                text: oReqCheackUserObject.getResponseHeader('errormessage'),
                                                type: 'error',
                                                showCancelButton: false,
                                                confirmButtonText: 'Try Again'
                                            }).then((result) => {
                                                if (result.value) {
                                                    Meteor._reload.reload();
                                                } else if (result.dismiss === 'cancel') {}
                                            });
                                            myVS1Video.pause();
                                            $('.myVS1Video').css('display', 'none');
                                            $('.myVS1VideoLogin').css('display', 'none');
                                            $('.loginSpinner').css('display', 'none');
                                            $('.fullScreenSpin').css('display', 'none');
                                        } else if (oReqCheackUserObject.readyState == 4 && oReqCheackUserObject.status == 406) {
                                            swal({
                                                title: 'Oooops...',
                                                text: oReqCheackUserObject.getResponseHeader('errormessage'),
                                                type: 'error',
                                                showCancelButton: false,
                                                confirmButtonText: 'Try Again'
                                            }).then((result) => {
                                                if (result.value) {
                                                    Meteor._reload.reload();
                                                } else if (result.dismiss === 'cancel') {}
                                            });
                                            myVS1Video.pause();
                                            $('.myVS1Video').css('display', 'none');
                                            $('.myVS1VideoLogin').css('display', 'none');
                                            $('.loginSpinner').css('display', 'none');
                                            $('.fullScreenSpin').css('display', 'none');
                                        } else if (oReqCheackUserObject.status == 0 && oReqCheackUserObject.statusText == '') {

                                            swal('Err Connection Refused', 'Please check setup connection!', 'error');
                                            setTimeout(function () {
                                                Meteor._reload.reload();
                                            }, 1500);
                                        }
                                    }
                                } else {

                                    swal('Invalid VS1 Password', 'The entered user password is not correct, please re-enter your password and try again!', 'error');
                                    myVS1Video.pause();
                                    $('.myVS1Video').css('display', 'none');
                                    $('.myVS1VideoLogin').css('display', 'none');
                                    $('.loginSpinner').css('display', 'none');
                                    $('.fullScreenSpin').css('display', 'none');
                                    $("#erppassword").focus();
                                }

                                //}
                            } else {}
                        }
                    } else {
                        times++;
                        if (times > 2) {
                            if(userLoginEmail != ''){
                              window.open('/forgotpassword?checktoken=' + userLoginEmail + '', '_self');
                            }else{
                              window.open('/forgotpassword', '_self');
                            }
                        } else {}

                        swal('Oops...', 'Your email or password is incorrect, please try again!', 'error');
                        setTimeout(function () {
                            Meteor._reload.reload();

                        }, 1000);
                        $("#email").focus();
                        e.preventDefault();
                    }
                }

            });
        }

        e.preventDefault();
    });

    $("#erplogin-button").click(async function (e) {
        e.preventDefault();
        /* VS1 Licence Info */
        var myVS1Video = document.getElementById("myVS1Video");
        var myVS1VideoLogin = document.getElementById("myVS1VideoLogin");

        let licenceitemsoption = [];
        let licenceitemsObj = {};
        let isSameUserLogin = false;
        /* licence Option To Add */
        let isAccountsLicence = true;
        let isContactsLicence = true;
        let isPaymentsLicence = true;
        let isReportsLicence = true;
        let isSettingsLicence = true;
        let isFixedAssetsLicence = false;
        let isInventoryLicence = true;
        let isPurchasesLicence = true;
        let isSalesLicence = true;

        let isStockTakeLicence = false;
        let isStockTransferLicence = false;

        let isMainLicence = true;
        let isDashboardLicence = true;
        let isBankingLicence = true;

        let isBinTrackingLicence = false;
        let isBatchSerialNoLicence = false;
        let isJobsConstructionLicence = false;

        let isFxCurrencyLicence = false;
        let isSeedToSaleLicence = false;
        let isAppointmentSchedulingLicence = false;
        let isManufacturingLicence = false;
        let isWMSLicence = false;
        let isAddExtraUserLicence = false;
        let isMatrixLicence = false;
        let isShippingLicence = false;
        let isPayrollLicence = false;
        let isExpenseClaimsLicence = false;
        let isPOSLicence = false;

        /*End Option to Add */
        let isTrueERPConnection = false;

        let userLoginEmail = $("#email").val();
        let userLoginPassword = escape($('#erppassword').val());
        let hashUserLoginPassword = CryptoJS.MD5(userLoginPassword.toUpperCase()).toString();
        var counterUserRec = null;
        let employeeUserID = '';
        let loggedUserEventFired = false;

        if ($('#remember_me').is(':checked')) {

            localStorage.usremail = $('#email').val();
            localStorage.usrpassword = $('#erppassword').val();
            localStorage.chkbx = $('#remember_me').val();
        } else {
            localStorage.usremail = '';
            localStorage.usrpassword = '';
            localStorage.chkbx = '';
        };

        if ($("#erppassword").val() == '') {

            swal('Invalid VS1 Password', 'The entered user password is not correct, please re-enter your password and try again!', 'error');
            $("#erppassword").focus();
            e.preventDefault();
        } else if (userLoginEmail === '') {

            swal('Please enter email address! ', '', 'warning');
            $("#email").focus();
            e.preventDefault();
        } else {

            $('.loginSpinner').css('display', 'inline-block');
            if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                $('.fullScreenSpin').css('display', 'inline-block');
            }

            let test = "";
            let isValidateEmailCheck = false;
            storeExists1(userLoginEmail).then(function (data) {
                if (data == true) {
                    var dataRes = getLoginData(userLoginEmail).then(function (dataObject) {
                        if (dataObject.length == 0) {
                            $('.myVS1Video').css('display', 'inline-block');
                            //$('.fullScreenSpin').css('display','inline-block');
                            myVS1Video.currentTime = 0;
                            myVS1Video.play();
                            var serverTest = URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/erpapi/Vs1_Logon?Vs1UserName="' + userLoginEmail + '"&vs1Password="' + userLoginPassword + '"';

                            var oReq = new XMLHttpRequest();
                            oReq.open("GET", serverTest, true);
                            oReq.setRequestHeader("database", vs1loggedDatatbase);
                            oReq.setRequestHeader("username", "VS1_Cloud_Admin");
                            oReq.setRequestHeader("password", "DptfGw83mFl1j&9");
                            oReq.send();

                            oReq.onreadystatechange = function () {

                                if (oReq.readyState == 4 && oReq.status == 200) {
                                    Session.setPersistent('mainEIPAddress', licenceIPAddress);
                                    Session.setPersistent('mainEPort', checkSSLPorts);

                                    var dataReturnRes = JSON.parse(oReq.responseText);

                                    if (dataReturnRes.ProcessLog.ResponseStatus != "OK") {
                                        myVS1Video.pause();
                                        $('.myVS1Video').css('display', 'none');
                                        $('.myVS1VideoLogin').css('display', 'none');
                                        if (dataReturnRes.ProcessLog.ResponseStatus == "Payment is Due") {
                                            $('.loginSpinner').css('display', 'none');
                                            $('.fullScreenSpin').css('display', 'none');
                                            myVS1Video.pause();
                                            $('.myVS1Video').css('display', 'none');
                                            $('.myVS1VideoLogin').css('display', 'none');

                                            swal({
                                                title: 'Your payment has been declined please update your payment subscription information!',
                                                text: '',
                                                type: 'error',
                                                showCancelButton: true,
                                                confirmButtonText: 'Update Payment',
                                                cancelButtonText: 'Cancel'
                                            }).then((result) => {
                                                if (result.value) {
                                                    //window.open('https://www.payments.vs1cloud.com/customer/account/login/referer/aHR0cHM6Ly93d3cucGF5bWVudHMudnMxY2xvdWQuY29tLw%2C%2C?urppassname='+dataReturnRes.ProcessLog.VS1AdminUserName+'&urlpasstoken='+userLoginPassword+'', '_blank');
                                                    window.open('/subscriptionSettings?urppassname=' + dataReturnRes.ProcessLog.VS1AdminUserName, '_blank');
                                                    Session.setPersistent('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                                } else if (result.dismiss === 'cancel') {}
                                            });

                                        } else {
                                            swal(dataReturnRes.ProcessLog.ResponseStatus, dataReturnRes.ProcessLog.ResponseStatus, 'error');
                                            myVS1Video.pause();
                                            $('.myVS1Video').css('display', 'none');
                                            $('.myVS1VideoLogin').css('display', 'none');
                                            $('.loginSpinner').css('display', 'none');
                                            $('.fullScreenSpin').css('display', 'none');
                                        }

                                    } else {
                                        //Code Here

                                        var oReqCheckActive = new XMLHttpRequest();
                                        oReqCheckActive.open("GET", URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/' + 'erpapi/TVS1_Clients_Simple?PropertyList="ID,EmailVarified"&select=[Databasename]="' + dataReturnRes.ProcessLog.Databasename + '"', true);
                                        oReqCheckActive.setRequestHeader("database", vs1loggedDatatbase);
                                        oReqCheckActive.setRequestHeader("username", 'VS1_Cloud_Admin');
                                        oReqCheckActive.setRequestHeader("password", 'DptfGw83mFl1j&9');
                                        oReqCheckActive.send();
                                        oReqCheckActive.onreadystatechange = function () {
                                            if (oReqCheckActive.readyState == 4 && oReqCheckActive.status == 200) {
                                                var dataDBActive = JSON.parse(oReqCheckActive.responseText);

                                                if (dataDBActive.tvs1_clients_simple[0].EmailVarified) {

                                                    //Code Here
                                                    Meteor.call('readMethod', dataReturnRes.ProcessLog.VS1AdminUserName, function (error, result) {
                                                        if (error) {}
                                                        else {
                                                            let regUserDetails = result;
                                                            if (regUserDetails) {
                                                                if (regUserDetails.length === 0) {}

                                                                Session.setPersistent('mycloudLogonDBID', regUserDetails.clouddatabaseID);
                                                                Session.setPersistent('mycloudLogonID', regUserDetails._id);

                                                            }
                                                        }

                                                    });

                                                    localStorage.setItem('vs1cloudLoginInfo', dataReturnRes);
                                                    localStorage.setItem('vs1cloudlicenselevel', dataReturnRes.ProcessLog.LicenseLevel);
                                                    if (!localStorage.getItem('VS1loggedDatabase')) {
                                                        localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.Databasename);
                                                        localStorage.setItem('VS11099Contractor_Report', '');
                                                        localStorage.setItem('VS1AgedPayables_Report', '');
                                                        localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                                                        localStorage.setItem('VS1AgedReceivables_Report', '');
                                                        localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                                                        localStorage.setItem('VS1BalanceSheet_Report', '');
                                                        localStorage.setItem('VS1BalanceTrans_Report', '');
                                                        localStorage.setItem('VS1GeneralLedger_Report', '');
                                                        localStorage.setItem('VS1ProfitandLoss_Report', '');
                                                        localStorage.setItem('VS1Purchase_List', '');
                                                        localStorage.setItem('VS1Purchase_Report', '');
                                                        localStorage.setItem('VS1PurchaseSummary_Report', '');
                                                        localStorage.setItem('VS1ProductSales_List', '');
                                                        localStorage.setItem('VS1ProductSales_Report', '');
                                                        localStorage.setItem('VS1Sales_List', '');
                                                        localStorage.setItem('VS1Sales_Report', '');
                                                        localStorage.setItem('VS1SalesSummary_Report', '');
                                                        localStorage.setItem('VS1TaxSummary_Report', '');
                                                        localStorage.setItem('VS1TrialBalance_Report', '');
                                                        localStorage.setItem('VS1PrintStatements_Report', '');
                                                        Session.setPersistent('bankaccountid', '');

                                                        localStorage.setItem('VS1ProductList', '');
                                                        localStorage.setItem('VS1CustomerList', '');
                                                        localStorage.setItem('VS1SupplierList', '');
                                                        localStorage.setItem('VS1AccountList', '');
                                                        localStorage.setItem('VS1TaxCodeList', '');
                                                        localStorage.setItem('VS1TermsList', '');
                                                        localStorage.setItem('VS1DepartmentList', '');
                                                        localStorage.setItem('VS1CurrencyList', '');
                                                        localStorage.setItem('VS1LeadStatusList', '');
                                                        localStorage.setItem('VS1ShippingMethodList', '');
                                                        localStorage.setItem('VS1AccountTypeList', '');
                                                        localStorage.setItem('VS1ERPCombinedContactsList', '');
                                                        localStorage.setItem('VS1EmployeeList', '');
                                                        localStorage.setItem('VS1JournalEntryLineList', '');
                                                        localStorage.setItem('VS1BankAccountReportList', '');
                                                        localStorage.setItem('VS1TInvoiceList', '');
                                                        localStorage.setItem('VS1TInvoiceNonBackOrderList', '');
                                                        localStorage.setItem('VS1BackOrderSalesListList', '');
                                                        localStorage.setItem('VS1TPurchaseOrderList', '');
                                                        localStorage.setItem('VS1TReconcilationList', '');
                                                        localStorage.setItem('VS1TChequeList', '');
                                                        localStorage.setItem('VS1TProductStocknSalePeriodReport', '');
                                                        localStorage.setItem('VS1TAppUserList', '');
                                                        localStorage.setItem('VS1TJobVS1List', '');
                                                        localStorage.setItem('VS1TStockAdjustEntryList', '');
                                                        localStorage.setItem('VS1TsalesOrderNonBackOrderList', '');
                                                        localStorage.setItem('VS1TbillReport', '');
                                                        localStorage.setItem('VS1TbillReport', '');
                                                        localStorage.setItem('VS1TCreditList', '');
                                                        localStorage.setItem('VS1TpurchaseOrderNonBackOrderList', '');
                                                        localStorage.setItem('VS1TpurchaseOrderBackOrderList', '');
                                                        localStorage.setItem('VS1TSalesList', '');
                                                    } else {
                                                        if ((localStorage.getItem('VS1loggedDatabase')) == (dataReturnRes.ProcessLog.Databasename)) {
                                                            isSameUserLogin = true;
                                                        } else {
                                                            localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.Databasename);
                                                            localStorage.setItem('VS11099Contractor_Report', '');
                                                            localStorage.setItem('VS1AgedPayables_Report', '');
                                                            localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                                                            localStorage.setItem('VS1AgedReceivables_Report', '');
                                                            localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                                                            localStorage.setItem('VS1BalanceSheet_Report', '');
                                                            localStorage.setItem('VS1BalanceTrans_Report', '');
                                                            localStorage.setItem('VS1GeneralLedger_Report', '');
                                                            localStorage.setItem('VS1ProfitandLoss_Report', '');
                                                            localStorage.setItem('VS1Purchase_List', '');
                                                            localStorage.setItem('VS1Purchase_Report', '');
                                                            localStorage.setItem('VS1PurchaseSummary_Report', '');
                                                            localStorage.setItem('VS1ProductSales_List', '');
                                                            localStorage.setItem('VS1ProductSales_Report', '');
                                                            localStorage.setItem('VS1Sales_List', '');
                                                            localStorage.setItem('VS1Sales_Report', '');
                                                            localStorage.setItem('VS1SalesSummary_Report', '');
                                                            localStorage.setItem('VS1TaxSummary_Report', '');
                                                            localStorage.setItem('VS1TrialBalance_Report', '');
                                                            localStorage.setItem('VS1PrintStatements_Report', '');

                                                            localStorage.setItem('VS1AccoountList', '');
                                                            Session.setPersistent('bankaccountid', '');
                                                        }
                                                    }

                                                    Session.setPersistent('ERPCurrency', dataReturnRes.ProcessLog.TRegionalOptions.CurrencySymbol);

                                                    var region = dataReturnRes.ProcessLog.RegionName;
                                                    Session.setPersistent('ERPLoggedCountry', region);

                                                    if (dataReturnRes.ProcessLog.RegionName === "Australia") {
                                                        Session.setPersistent('ERPCountryAbbr', 'AUD');
                                                    } else if (dataReturnRes.ProcessLog.RegionName === "Canada") {
                                                        Session.setPersistent('ERPCountryAbbr', 'CAD');
                                                    } else if (dataReturnRes.ProcessLog.RegionName === "Colombia") {
                                                        Session.setPersistent('ERPCountryAbbr', 'COP');
                                                    } else if (dataReturnRes.ProcessLog.RegionName === "Kuwait") {
                                                        Session.setPersistent('ERPCountryAbbr', 'KYD');
                                                    } else if (dataReturnRes.ProcessLog.RegionName === "Mexico") {
                                                        Session.setPersistent('ERPCountryAbbr', 'MXN');
                                                    } else if (dataReturnRes.ProcessLog.RegionName === "New Zealand") {
                                                        Session.setPersistent('ERPCountryAbbr', 'NZD');
                                                    } else if (dataReturnRes.ProcessLog.RegionName === "Qatar") {
                                                        Session.setPersistent('ERPCountryAbbr', 'QAR');
                                                    } else if (dataReturnRes.ProcessLog.RegionName === "Kingdom of Saudi Arabia") {
                                                        Session.setPersistent('ERPCountryAbbr', 'SAR');
                                                    } else if (dataReturnRes.ProcessLog.RegionName === "Singapore") {
                                                        Session.setPersistent('ERPCountryAbbr', 'SGD');
                                                    } else if (dataReturnRes.ProcessLog.RegionName === "South Africa") {
                                                        Session.setPersistent('ERPCountryAbbr', 'ZAR');
                                                    } else if (dataReturnRes.ProcessLog.RegionName === "United Arab Emirates") {
                                                        Session.setPersistent('ERPCountryAbbr', 'AED');
                                                    } else if (dataReturnRes.ProcessLog.RegionName === "United Kingdom") {
                                                        Session.setPersistent('ERPCountryAbbr', 'GBP');
                                                    } else if (dataReturnRes.ProcessLog.RegionName === "United States of America") {
                                                        Session.setPersistent('ERPCountryAbbr', 'USD');
                                                    }
                                                    Session.setPersistent('ERPDefaultDepartment', 'Default');
                                                    Session.setPersistent('ERPDefaultUOM', '');
                                                    Session.setPersistent('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                                    localStorage.setItem('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                                    dataReturnRes.ProcessLog.VS1AdminPassword = hashUserLoginPassword;
                                                    dataReturnRes.ProcessLog.VS1UserName = userLoginEmail;
                                                    var ERPIPAdderess = "";
                                                    if (dataReturnRes.ProcessLog.ServerName == "110.142.175.245") {
                                                        ERPIPAdderess = ERPDatabaseIPAdderess;
                                                    } else if (dataReturnRes.ProcessLog.ServerName == "59.154.69.210") {
                                                        ERPIPAdderess = "gardenscapes.vs1cloud.com";
                                                    }else if (dataReturnRes.ProcessLog.ServerName == "144.130.174.170") {
                                                        ERPIPAdderess = "steelmains.vs1cloud.com";
                                                    }else if (dataReturnRes.ProcessLog.ServerName == "144.130.174.162") {
                                                        ERPIPAdderess = "steelmains14403.vs1cloud.com";
                                                    }else if (dataReturnRes.ProcessLog.ServerName == "156.155.97.183") {
                                                        ERPIPAdderess = "vs1dev5.vs1cloud.com";
                                                    }else if (dataReturnRes.ProcessLog.ServerName == "120.151.35.249") {
                                                        ERPIPAdderess = "rappaustralia.vs1cloud.com";
                                                    }else if (dataReturnRes.ProcessLog.ServerName == "165.228.147.127") {
                                                        ERPIPAdderess = "vs1connection.vs1cloud.com";
                                                    }else {
                                                        ERPIPAdderess = dataReturnRes.ProcessLog.ServerName;
                                                    }
                                                    var ERPdbName = dataReturnRes.ProcessLog.Databasename;

                                                    var ERPport = dataReturnRes.ProcessLog.APIPort;

                                                    Session.setPersistent('mycloudLogonUserEmail', userLoginEmail);

                                                    var ERPuserName = userLoginEmail;
                                                    var ERPLoggeduserName = userLoginEmail;
                                                    var ERPpassword = userLoginPassword.replace('%20', " ").replace('%21', '!').replace('%22', '"')
                                                .replace('%23', "#").replace('%24', "$").replace('%25', "%").replace('%26', "&").replace('%27', "'")
                                                .replace('%28', "(").replace('%29', ")").replace('%2A', "*").replace('%2B', "+")
                                                .replace('%2C', ",").replace('%2D', "-").replace('%2E', ".").replace('%2F', "/") || '';

                                                    let erpdbname = ERPIPAdderess + ',' + ERPdbName + ',' + ERPuserName + ',' + ERPpassword + ',' + ERPport;
                                                    let licenceOptions = dataReturnRes.ProcessLog.Modules.Modules;
                                                    $.each(licenceOptions, function (item, option) {

                                                        if ((option.ModuleName == 'Accounts Payable Reports') || (option.ModuleName == 'Accounts Receivable Report')) {
                                                            isAccountsLicence = true;
                                                        } else if (option.ModuleName == 'Statements') {
                                                            isContactsLicence = true;
                                                        } else if ((option.ModuleName == 'Expense Claims / Receipt Claiming')) {
                                                            isExpenseClaimsLicence = true;
                                                        } else if (option.ModuleName == 'CloudDashboard') {
                                                            isDashboardLicence = true;
                                                        } else if (option.ModuleName == 'CloudFixedAssets') {
                                                            isFixedAssetsLicence = true;
                                                        } else if (option.ModuleName == 'Inventory Tracking') {
                                                            isInventoryLicence = true;
                                                        } else if (option.ModuleName == 'CloudMain') {
                                                            isMainLicence = true;
                                                        } else if (option.ModuleName == 'Manufacturing') {
                                                            isManufacturingLicence = true;
                                                        } else if (option.ModuleName == 'Payemnts') {
                                                            isPaymentsLicence = true;
                                                        } else if (option.ModuleName == 'Bills') {
                                                            isPurchasesLicence = true;
                                                        } else if (option.ModuleName == 'Reports Dashboard') {
                                                            isReportsLicence = true;
                                                        } else if ((option.ModuleName == 'Quotes') || (option.ModuleName == 'Invoices')) {
                                                            isSalesLicence = true;
                                                        } else if (option.ModuleName == 'CloudSettings') {
                                                            isSettingsLicence = true;
                                                        } else if ((option.ModuleName == 'Shipping')) {
                                                            isShippingLicence = true;
                                                        } else if (option.ModuleName == 'Stock Adjustments') {
                                                            isStockTakeLicence = true;
                                                        } else if (option.ModuleName == 'Stock Adjustments') {
                                                            isStockTransferLicence = true;
                                                        } else if ((option.ModuleName == 'Seed To Sale')) {
                                                            isSeedToSaleLicence = true;
                                                        } else if (option.ModuleName == 'CloudBanking') {
                                                            isBankingLicence = true;
                                                        } else if ((option.ModuleName == 'Payroll Integration')) {
                                                            isPayrollLicence = true;
                                                        } else if ((option.ModuleName == 'Payroll Unlimited Employees')) {
                                                            isPayrollLicence = true;
                                                        } else if ((option.ModuleName == 'Time Sheets')) {
                                                            isPayrollLicence = true;
                                                        } else if ((option.ModuleName == 'Manufacturing')) {
                                                            isManufacturingLicence = true;
                                                        } else if ((option.ModuleName == 'POS')) {
                                                            isPOSLicence = true;
                                                        } else if ((option.ModuleName == 'WMS')) {
                                                            isWMSLicence = true;
                                                        } else if ((option.ModuleName == 'Matrix')) {
                                                            isMatrixLicence = true;
                                                        } else if ((option.ModuleName == 'Add Extra User')) {
                                                            isAddExtraUserLicence = true;
                                                        } else if ((option.ModuleName == 'FX Currency')) {
                                                            isFxCurrencyLicence = true;
                                                        } else if ((option.ModuleName == 'Use Foreign Currency')) {
                                                            isFxCurrencyLicence = true;
                                                        } else if ((option.ModuleName == 'Link To TrueERP') || (option.ModuleName == 'Connect to Live ERP DB')) {
                                                            localStorage.setItem('isPurchasedTrueERPModule', true);
                                                            if (option.ModuleActive) {
                                                                isTrueERPConnection = option.ModuleActive || true;
                                                            } else {
                                                                isTrueERPConnection = false;
                                                            }
                                                        } else if ((option.ModuleName == 'Appointment Scheduling')) {
                                                            isAppointmentSchedulingLicence = true;
                                                        }

                                                    });

                                                    /* Remove licence */
                                                    if (dataReturnRes.ProcessLog.ServerName !== "110.142.175.245") {
                                                      isTrueERPConnection = true;
                                                    }
                                                    Session.setPersistent('CloudTrueERPModule', isTrueERPConnection);
                                                    Session.setPersistent('CloudAccountsLicence', isAccountsLicence);
                                                    Session.setPersistent('CloudContactsLicence', isContactsLicence);
                                                    Session.setPersistent('CloudExpenseClaimsLicence', isExpenseClaimsLicence);
                                                    Session.setPersistent('CloudPaymentsLicence', isPaymentsLicence);
                                                    Session.setPersistent('CloudReportsLicence', isReportsLicence);
                                                    Session.setPersistent('CloudSettingsLicence', isSettingsLicence);

                                                    Session.setPersistent('CloudMainLicence', isMainLicence);
                                                    Session.setPersistent('CloudDashboardLicence', isDashboardLicence);

                                                    Session.setPersistent('CloudSeedToSaleLicence', isSeedToSaleLicence);
                                                    Session.setPersistent('CloudBankingLicence', isBankingLicence);
                                                    Session.setPersistent('CloudPayrollLicence', isPayrollLicence);

                                                    Session.setPersistent('CloudFixedAssetsLicence', isFixedAssetsLicence);
                                                    Session.setPersistent('CloudInventoryLicence', isInventoryLicence);
                                                    Session.setPersistent('CloudManufacturingLicence', isManufacturingLicence);
                                                    Session.setPersistent('CloudPurchasesLicence', isPurchasesLicence);
                                                    Session.setPersistent('CloudSalesLicence', isSalesLicence);
                                                    Session.setPersistent('CloudShippingLicence', isShippingLicence);
                                                    Session.setPersistent('CloudStockTakeLicence', isStockTakeLicence);
                                                    Session.setPersistent('CloudStockTransferLicence', isStockTransferLicence);

                                                    Session.setPersistent('CloudAddExtraLicence', isAddExtraUserLicence);
                                                    Session.setPersistent('CloudMatrixLicence', isMatrixLicence);
                                                    Session.setPersistent('CloudPOSLicence', isPOSLicence);
                                                    Session.setPersistent('CloudUseForeignLicence', isFxCurrencyLicence);
                                                    Session.setPersistent('CloudWMSLicence', isWMSLicence);
                                                    Session.setPersistent('CloudAppointmentSchedulingLicence', isAppointmentSchedulingLicence);
                                                    /* End Remove licence */

                                                    if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail == undefined) {
                                                        swal('Sorry, You do not have access to any VS1 Modules!', '', 'error');
                                                        myVS1Video.pause();
                                                        $('.myVS1Video').css('display', 'none');
                                                        $('.myVS1VideoLogin').css('display', 'none');
                                                        $('.fullScreenSpin').css('display', 'none');
                                                        $('.loginSpinner').css('display', 'none');
                                                        return false;

                                                    };

                                                    if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.ResponseNo == 401) {
                                                        swal('Sorry, You do not have access to any VS1 Modules!', '', 'error');
                                                        myVS1Video.pause();
                                                        $('.myVS1Video').css('display', 'none');
                                                        $('.myVS1VideoLogin').css('display', 'none');
                                                        $('.fullScreenSpin').css('display', 'none');
                                                        $('.loginSpinner').css('display', 'none');
                                                        return false;

                                                    };

                                                    dataReturnRes.ProcessLog.VS1AdminPassword = hashUserLoginPassword;
                                                    dataReturnRes.ProcessLog.VS1UserName = userLoginEmail;
                                                    Session.setPersistent('mycloudLogonUsername', ERPuserName);
                                                    Session.setPersistent('mycloudLogonUserEmail', ERPuserName);

                                                    localStorage.setItem('VS1FormAccessDetail', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.items)||'');

                                                    Session.setPersistent('myerpPassword', userLoginPassword);
                                                    Session.setPersistent('mySessionEmployee', ERPuserName);

                                                    localStorage.setItem('EIPAddress', ERPIPAdderess);
                                                    localStorage.setItem('EUserName', ERPuserName);
                                                    localStorage.setItem('EPassword', ERPpassword);
                                                    localStorage.setItem('EDatabase', ERPdbName);
                                                    localStorage.setItem('EPort', ERPport);
                                                    loggedUserEventFired = true;

                                                    localStorage.setItem('mainEIPAddress', licenceIPAddress);
                                                    localStorage.setItem('mainEPort', checkSSLPorts);

                                                    if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields) {
                                                        Session.setPersistent('vs1companyName', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_CompanyName || '');
                                                        Session.setPersistent('vs1companyaddress1', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address || '');
                                                        Session.setPersistent('vs1companyaddress2', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address2 || '');
                                                        Session.setPersistent('vs1companyABN', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_ABN || '');
                                                        Session.setPersistent('vs1companyPhone', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_PhoneNumber || '');
                                                        Session.setPersistent('vs1companyURL', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_URL || '');

                                                        Session.setPersistent('ERPDefaultDepartment', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultClass || '');
                                                        Session.setPersistent('ERPDefaultUOM', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultUOM || '');

                                                        Session.setPersistent('ERPCountryAbbr', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_ForeignExDefault || '');
                                                        Session.setPersistent('ERPTaxCodePurchaseInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc || '');
                                                        Session.setPersistent('ERPTaxCodeSalesInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc || '');

                                                        localStorage.setItem('VS1OverDueInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_AMOUNT || Currency + '0');
                                                        localStorage.setItem('VS1OverDueInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_QUANTITY || 0);
                                                        localStorage.setItem('VS1OutstandingPayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_AMOUNT || Currency + '0');
                                                        localStorage.setItem('VS1OutstandingPayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_QUANTITY || 0);

                                                        localStorage.setItem('VS1OutstandingInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_AMOUNT || Currency + '0');
                                                        localStorage.setItem('VS1OutstandingInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_QUANTITY || 0);
                                                        localStorage.setItem('VS1OverDuePayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_AMOUNT || Currency + '0');
                                                        localStorage.setItem('VS1OverDuePayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_QUANTITY || 0);

                                                        localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');

                                                        localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_NetIncomeEx || 0);
                                                        localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalIncomeEx || 0);
                                                        localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalExpenseEx || 0);
                                                        localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalCOGSEx || 0);

                                                        if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.ResponseNo == 401) {
                                                            localStorage.setItem('vs1LoggedEmployeeImages_dash', '');
                                                        } else {
                                                            if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields) {
                                                                localStorage.setItem('vs1LoggedEmployeeImages_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields.EncodedPic || '');
                                                            } else {
                                                                localStorage.setItem('vs1LoggedEmployeeImages_dash', '');
                                                            }
                                                        }
                                                    } else {
                                                        Session.setPersistent('vs1companyName', '');
                                                        Session.setPersistent('vs1companyaddress1', '');
                                                        Session.setPersistent('vs1companyaddress2', '');
                                                        Session.setPersistent('vs1companyABN', '');
                                                        Session.setPersistent('vs1companyPhone', '');
                                                        Session.setPersistent('vs1companyURL', '');

                                                        Session.setPersistent('ERPDefaultDepartment', '');
                                                        Session.setPersistent('ERPDefaultUOM', '');

                                                        Session.setPersistent('ERPTaxCodePurchaseInc', '');
                                                        Session.setPersistent('ERPTaxCodeSalesInc', '');

                                                        localStorage.setItem('VS1OverDueInvoiceAmt_dash', '');
                                                        localStorage.setItem('VS1OverDueInvoiceQty_dash', '');
                                                        localStorage.setItem('VS1OutstandingPayablesAmt_dash', '');
                                                        localStorage.setItem('VS1OutstandingPayablesQty_dash', '');

                                                        localStorage.setItem('VS1OutstandingInvoiceAmt_dash', '');
                                                        localStorage.setItem('VS1OutstandingInvoiceQty_dash', '');
                                                        localStorage.setItem('VS1OverDuePayablesAmt_dash', '');
                                                        localStorage.setItem('VS1OverDuePayablesQty_dash', '');

                                                        localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');

                                                        localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', '');
                                                        localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', '');
                                                        localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', '');
                                                        localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', '');
                                                    }

                                                    localStorage.setItem('VS1APReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_ap_report.items) || '');
                                                    localStorage.setItem('VS1PNLPeriodReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_pnl_period.items) || '');
                                                    localStorage.setItem('VS1SalesListReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_saleslist.items) || '');
                                                    localStorage.setItem('VS1SalesEmpReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_salesperemployee.items) || '');

                                                    Session.setPersistent('LoggedUserEventFired', true);
                                                    Session.setPersistent('userlogged_status', 'active');

                                                    var empusername = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
                                                    var employeeUserLogon = ERPLoggeduserName;
                                                    var employeeUserID = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeId;
                                                    var employeename = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
                                                    Session.setPersistent('mySessionEmployeeLoggedID', employeeUserID);
                                                    localStorage.setItem('mySession', employeeUserLogon);
                                                    var sessionDataToLog = localStorage.getItem('mySession');
                                                    Session.setPersistent('mySessionEmployee', employeename);
                                                    let userAccessOptions = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail || '';

                                                    if (userAccessOptions != "") {
                                                        addLoginData(dataReturnRes).then(function (datareturn) {
                                                            getAccessLevelData(userAccessOptions, isSameUserLogin);
                                                        }).catch(function (err) {
                                                            getAccessLevelData(userAccessOptions, isSameUserLogin);
                                                        });

                                                    }

                                                    //End Code Here
                                                } else {
                                                    myVS1Video.pause();
                                                    $('.myVS1Video').css('display', 'none');
                                                    $('.myVS1VideoLogin').css('display', 'none');
                                                    $('#emEmail').html(userLoginEmail);
                                                    $('#emPassword').html(userLoginPassword.replace('%20', " ").replace('%21', '!').replace('%22', '"')
                                                    .replace('%23', "#").replace('%24', "$").replace('%25', "%").replace('%26', "&").replace('%27', "'")
                                                    .replace('%28', "(").replace('%29', ")").replace('%2A', "*").replace('%2B', "+")
                                                    .replace('%2C', ",").replace('%2D', "-").replace('%2E', ".").replace('%2F', "/"));
                                                    $(".addloginkey").attr("href", 'https://www.depot.vs1cloud.com/vs1activation/sandboxcheck.php?checktoken=' + userLoginEmail + '');
                                                    $(".addloginActive").attr("href", 'https://www.depot.vs1cloud.com/vs1activation/sandboxcheck.php?checktoken=' + userLoginEmail + '');
                                                    swal({
                                                        title: 'Awaiting Email Validation',
                                                        html: true,
                                                        html: "This account has not been validated because the email address that it is linked to has not yet been validated.\n \n <br></br> We've sent an email containing a validation link to: <strong> " + dataReturnRes.ProcessLog.VS1AdminUserName + " </strong>",
                                                        type: 'info',
                                                        showCancelButton: false,
                                                        confirmButtonText: 'Resend Validation Email',
                                                        cancelButtonText: 'No'
                                                    }).then((result) => {
                                                        if (result.value) {
                                                            let mailBodyNew = $('.emailBody').html();
                                                            Meteor.call('sendEmail', {
                                                                from: "VS1 Cloud <info@vs1cloud.com>",
                                                                to: dataReturnRes.ProcessLog.VS1AdminUserName,
                                                                cc: 'info@vs1cloud.com',
                                                                subject: '[VS1 Cloud] - Email Validation',
                                                                text: '',
                                                                html: mailBodyNew,
                                                                attachments: ''

                                                            }, function (error, result) {
                                                                location.reload(true);
                                                            });
                                                        } else if (result.dismiss === 'cancel') {
                                                            // FlowRouter.go('/employeescard?addvs1user=true');
                                                        }
                                                    });
                                                    myVS1Video.pause();
                                                    $('.myVS1Video').css('display', 'none');
                                                    $('.myVS1VideoLogin').css('display', 'none');
                                                    $('.fullScreenSpin').css('display', 'none');
                                                    $('.loginSpinner').css('display', 'none');
                                                    return false;
                                                }
                                            }
                                        }

                                        //End Code here


                                    }
                                } else if (oReq.statusText == '') {
                                    swal({
                                        title: 'Ooops...',
                                        text: 'It seems we are unable to connect you to VS1Cloud at the moment. Please try again in a few minutes.',
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {
                                            Meteor._reload.reload();
                                        } else if (result.dismiss === 'cancel') {}
                                    });
                                    myVS1Video.pause();
                                    $('.myVS1Video').css('display', 'none');
                                    $('.myVS1VideoLogin').css('display', 'none');
                                    $('.loginSpinner').css('display', 'none');
                                    $('.fullScreenSpin').css('display', 'none');

                                } else if (oReq.readyState == 4 && oReq.status == 403) {
                                    swal({
                                        title: 'Ooops...',
                                        text: 'It seems we are unable to connect you to VS1Cloud at the moment. Please try again in a few minutes.',
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {
                                            Meteor._reload.reload();
                                        } else if (result.dismiss === 'cancel') {}
                                    });
                                    myVS1Video.pause();
                                    $('.myVS1Video').css('display', 'none');
                                    $('.myVS1VideoLogin').css('display', 'none');
                                    $('.loginSpinner').css('display', 'none');
                                    $('.fullScreenSpin').css('display', 'none');
                                } else if (oReq.readyState == 4 && oReq.status == 406) {
                                    swal({
                                        title: 'Oooops...',
                                        text: oReq.getResponseHeader('errormessage'),
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {
                                            Meteor._reload.reload();
                                        } else if (result.dismiss === 'cancel') {}
                                    });
                                    myVS1Video.pause();
                                    $('.myVS1Video').css('display', 'none');
                                    $('.myVS1VideoLogin').css('display', 'none');
                                    $('.loginSpinner').css('display', 'none');
                                    $('.fullScreenSpin').css('display', 'none');
                                } else if (oReq.readyState == 4 && oReq.status == 500) {
                                    var ErrorResponse = oReq.getResponseHeader('errormessage');
                                    if (ErrorResponse.indexOf("Access violation") >= 0) {
                                        swal({
                                            title: 'Your database is being created. ',
                                            text: "Please try again in 10 minutes",
                                            type: 'info',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {
                                                Meteor._reload.reload();
                                            } else if (result.dismiss === 'cancel') {}
                                        });
                                    } else {
                                        swal({
                                            title: 'Oooops...',
                                            text: oReq.getResponseHeader('errormessage'),
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {
                                                Meteor._reload.reload();
                                            } else if (result.dismiss === 'cancel') {}
                                        });
                                    }
                                    myVS1Video.pause();
                                    $('.myVS1Video').css('display', 'none');
                                    $('.myVS1VideoLogin').css('display', 'none');
                                    $('.loginSpinner').css('display', 'none');
                                    $('.fullScreenSpin').css('display', 'none');
                                } else if (oReq.readyState == 4 && oReq.status == 401) {
                                    var ErrorResponse = oReq.getResponseHeader('errormessage');
                                    if (ErrorResponse.indexOf("Could not connect to ERP") >= 0) {
                                        swal({
                                            title: 'Oooops...',
                                            text: "Could not connect to Database. Unable to start Database. Licence on hold ",
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {
                                                Meteor._reload.reload();
                                            } else if (result.dismiss === 'cancel') {}
                                        });
                                    } else {
                                        swal({
                                            title: 'Oooops...',
                                            text: oReq.getResponseHeader('errormessage'),
                                            type: 'error',
                                            showCancelButton: false,
                                            confirmButtonText: 'Try Again'
                                        }).then((result) => {
                                            if (result.value) {
                                                Meteor._reload.reload();
                                            } else if (result.dismiss === 'cancel') {}
                                        });
                                    }
                                    myVS1Video.pause();
                                    $('.myVS1Video').css('display', 'none');
                                    $('.myVS1VideoLogin').css('display', 'none');
                                    $('.loginSpinner').css('display', 'none');
                                    $('.fullScreenSpin').css('display', 'none');
                                } else {}
                            }
                        } else {
                            $('.myVS1VideoLogin').css('display', 'inline-block');
                            myVS1VideoLogin.currentTime = 0;
                            myVS1VideoLogin.play();
                            let dataReturnRes = dataObject[0].data;
                            if (dataReturnRes.ProcessLog.VS1AdminPassword) {
                                if (($("#erppassword").val() != dataReturnRes.ProcessLog.VS1AdminPassword) && (hashUserLoginPassword != dataReturnRes.ProcessLog.VS1AdminPassword)) {
                                    myVS1Video.pause();
                                    $('.myVS1Video').css('display', 'none');
                                    $('.myVS1VideoLogin').css('display', 'none');
                                    $('.loginSpinner').css('display', 'none');
                                    $('.fullScreenSpin').css('display', 'none');
                                    swal('Invalid VS1 Password', 'The entered user password is not correct, please re-enter your password and try again!', 'error');
                                    $("#erppassword").focus();
                                    e.preventDefault();
                                    return false;
                                }
                            }

                            if (dataReturnRes.ProcessLog.ResponseStatus != "OK") {
                                if (dataReturnRes.ProcessLog.ResponseStatus == "Payment is Due") {
                                    $('.loginSpinner').css('display', 'none');
                                    $('.fullScreenSpin').css('display', 'none');
                                    myVS1Video.pause();
                                    $('.myVS1Video').css('display', 'none');
                                    $('.myVS1VideoLogin').css('display', 'none');
                                    swal({
                                        title: 'Your payment has been declined please update your payment subscription information!',
                                        text: '',
                                        type: 'error',
                                        showCancelButton: true,
                                        confirmButtonText: 'Update Payment',
                                        cancelButtonText: 'Cancel'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('https://www.payments.vs1cloud.com/customer/account/login/referer/aHR0cHM6Ly93d3cucGF5bWVudHMudnMxY2xvdWQuY29tLw%2C%2C?urppassname='+dataReturnRes.ProcessLog.VS1AdminUserName+'&urlpasstoken='+userLoginPassword+'', '_blank');
                                            window.open('/subscriptionSettings?urppassname=' + dataReturnRes.ProcessLog.VS1AdminUserName, '_blank');
                                            Session.setPersistent('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                } else {
                                    swal(dataReturnRes.ProcessLog.ResponseStatus, dataReturnRes.ProcessLog.ResponseStatus, 'error');
                                    myVS1Video.pause();
                                    $('.myVS1Video').css('display', 'none');
                                    $('.myVS1VideoLogin').css('display', 'none');
                                    $('.loginSpinner').css('display', 'none');
                                    $('.fullScreenSpin').css('display', 'none');
                                }

                            } else {
                                Meteor.call('readMethod', dataReturnRes.ProcessLog.VS1AdminUserName, function (error, result) {
                                    if (error) {}
                                    else {
                                        let regUserDetails = result;
                                        if (regUserDetails) {
                                            if (regUserDetails.length === 0) {}
                                            Session.setPersistent('mycloudLogonDBID', regUserDetails.clouddatabaseID);
                                            Session.setPersistent('mycloudLogonID', regUserDetails._id);

                                        }
                                    }

                                });

                                localStorage.setItem('vs1cloudLoginInfo', dataReturnRes);
                                localStorage.setItem('vs1cloudlicenselevel', dataReturnRes.ProcessLog.LicenseLevel);
                                if (!localStorage.getItem('VS1loggedDatabase')) {
                                    localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.Databasename);
                                    localStorage.setItem('VS11099Contractor_Report', '');
                                    localStorage.setItem('VS1AgedPayables_Report', '');
                                    localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                                    localStorage.setItem('VS1AgedReceivables_Report', '');
                                    localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                                    localStorage.setItem('VS1BalanceSheet_Report', '');
                                    localStorage.setItem('VS1BalanceTrans_Report', '');
                                    localStorage.setItem('VS1GeneralLedger_Report', '');
                                    localStorage.setItem('VS1ProfitandLoss_Report', '');
                                    localStorage.setItem('VS1Purchase_List', '');
                                    localStorage.setItem('VS1Purchase_Report', '');
                                    localStorage.setItem('VS1PurchaseSummary_Report', '');
                                    localStorage.setItem('VS1ProductSales_List', '');
                                    localStorage.setItem('VS1ProductSales_Report', '');
                                    localStorage.setItem('VS1Sales_List', '');
                                    localStorage.setItem('VS1Sales_Report', '');
                                    localStorage.setItem('VS1SalesSummary_Report', '');
                                    localStorage.setItem('VS1TaxSummary_Report', '');
                                    localStorage.setItem('VS1TrialBalance_Report', '');
                                    localStorage.setItem('VS1PrintStatements_Report', '');
                                    Session.setPersistent('bankaccountid', '');

                                    localStorage.setItem('VS1ProductList', '');
                                    localStorage.setItem('VS1CustomerList', '');
                                    localStorage.setItem('VS1SupplierList', '');
                                    localStorage.setItem('VS1AccountList', '');
                                    localStorage.setItem('VS1TaxCodeList', '');
                                    localStorage.setItem('VS1TermsList', '');
                                    localStorage.setItem('VS1DepartmentList', '');
                                    localStorage.setItem('VS1CurrencyList', '');
                                    localStorage.setItem('VS1LeadStatusList', '');
                                    localStorage.setItem('VS1ShippingMethodList', '');
                                    localStorage.setItem('VS1AccountTypeList', '');
                                    localStorage.setItem('VS1ERPCombinedContactsList', '');
                                    localStorage.setItem('VS1EmployeeList', '');
                                    localStorage.setItem('VS1JournalEntryLineList', '');
                                    localStorage.setItem('VS1BankAccountReportList', '');
                                    localStorage.setItem('VS1TInvoiceList', '');
                                    localStorage.setItem('VS1TInvoiceNonBackOrderList', '');
                                    localStorage.setItem('VS1BackOrderSalesListList', '');
                                    localStorage.setItem('VS1TPurchaseOrderList', '');
                                    localStorage.setItem('VS1TReconcilationList', '');
                                    localStorage.setItem('VS1TChequeList', '');
                                    localStorage.setItem('VS1TProductStocknSalePeriodReport', '');
                                    localStorage.setItem('VS1TAppUserList', '');
                                    localStorage.setItem('VS1TJobVS1List', '');
                                    localStorage.setItem('VS1TStockAdjustEntryList', '');
                                    localStorage.setItem('VS1TsalesOrderNonBackOrderList', '');
                                    localStorage.setItem('VS1TbillReport', '');
                                    localStorage.setItem('VS1TbillReport', '');
                                    localStorage.setItem('VS1TCreditList', '');
                                    localStorage.setItem('VS1TpurchaseOrderNonBackOrderList', '');
                                    localStorage.setItem('VS1TpurchaseOrderBackOrderList', '');
                                    localStorage.setItem('VS1TSalesList', '');
                                } else {
                                    if ((localStorage.getItem('VS1loggedDatabase')) == (dataReturnRes.ProcessLog.Databasename)) {
                                        isSameUserLogin = true;
                                    } else {
                                        localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.Databasename);
                                        localStorage.setItem('VS11099Contractor_Report', '');
                                        localStorage.setItem('VS1AgedPayables_Report', '');
                                        localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                                        localStorage.setItem('VS1AgedReceivables_Report', '');
                                        localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                                        localStorage.setItem('VS1BalanceSheet_Report', '');
                                        localStorage.setItem('VS1BalanceTrans_Report', '');
                                        localStorage.setItem('VS1GeneralLedger_Report', '');
                                        localStorage.setItem('VS1ProfitandLoss_Report', '');
                                        localStorage.setItem('VS1Purchase_List', '');
                                        localStorage.setItem('VS1Purchase_Report', '');
                                        localStorage.setItem('VS1PurchaseSummary_Report', '');
                                        localStorage.setItem('VS1ProductSales_List', '');
                                        localStorage.setItem('VS1ProductSales_Report', '');
                                        localStorage.setItem('VS1Sales_List', '');
                                        localStorage.setItem('VS1Sales_Report', '');
                                        localStorage.setItem('VS1SalesSummary_Report', '');
                                        localStorage.setItem('VS1TaxSummary_Report', '');
                                        localStorage.setItem('VS1TrialBalance_Report', '');
                                        localStorage.setItem('VS1PrintStatements_Report', '');

                                        localStorage.setItem('VS1AccoountList', '');
                                        Session.setPersistent('bankaccountid', '');
                                    }
                                }

                                Session.setPersistent('ERPCurrency', dataReturnRes.ProcessLog.TRegionalOptions.CurrencySymbol);

                                var region = dataReturnRes.ProcessLog.RegionName;
                                Session.setPersistent('ERPLoggedCountry', region);

                                if (dataReturnRes.ProcessLog.RegionName === "Australia") {
                                    Session.setPersistent('ERPCountryAbbr', 'AUD');
                                } else if (dataReturnRes.ProcessLog.RegionName === "Canada") {
                                    Session.setPersistent('ERPCountryAbbr', 'CAD');
                                } else if (dataReturnRes.ProcessLog.RegionName === "Colombia") {
                                    Session.setPersistent('ERPCountryAbbr', 'COP');
                                } else if (dataReturnRes.ProcessLog.RegionName === "Kuwait") {
                                    Session.setPersistent('ERPCountryAbbr', 'KYD');
                                } else if (dataReturnRes.ProcessLog.RegionName === "Mexico") {
                                    Session.setPersistent('ERPCountryAbbr', 'MXN');
                                } else if (dataReturnRes.ProcessLog.RegionName === "New Zealand") {
                                    Session.setPersistent('ERPCountryAbbr', 'NZD');
                                } else if (dataReturnRes.ProcessLog.RegionName === "Qatar") {
                                    Session.setPersistent('ERPCountryAbbr', 'QAR');
                                } else if (dataReturnRes.ProcessLog.RegionName === "Kingdom of Saudi Arabia") {
                                    Session.setPersistent('ERPCountryAbbr', 'SAR');
                                } else if (dataReturnRes.ProcessLog.RegionName === "Singapore") {
                                    Session.setPersistent('ERPCountryAbbr', 'SGD');
                                } else if (dataReturnRes.ProcessLog.RegionName === "South Africa") {
                                    Session.setPersistent('ERPCountryAbbr', 'ZAR');
                                } else if (dataReturnRes.ProcessLog.RegionName === "United Arab Emirates") {
                                    Session.setPersistent('ERPCountryAbbr', 'AED');
                                } else if (dataReturnRes.ProcessLog.RegionName === "United Kingdom") {
                                    Session.setPersistent('ERPCountryAbbr', 'GBP');
                                } else if (dataReturnRes.ProcessLog.RegionName === "United States of America") {
                                    Session.setPersistent('ERPCountryAbbr', 'USD');
                                }

                                Session.setPersistent('ERPDefaultDepartment', 'Default');
                                Session.setPersistent('ERPDefaultUOM', '');
                                Session.setPersistent('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                localStorage.setItem('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                var ERPIPAdderess = "";
                                if (dataReturnRes.ProcessLog.ServerName == "110.142.175.245") {
                                    ERPIPAdderess = ERPDatabaseIPAdderess;
                                } else if (dataReturnRes.ProcessLog.ServerName == "59.154.69.210") {
                                    ERPIPAdderess = "gardenscapes.vs1cloud.com";
                                }else if (dataReturnRes.ProcessLog.ServerName == "144.130.174.170") {
                                    ERPIPAdderess = "steelmains.vs1cloud.com";
                                }else if (dataReturnRes.ProcessLog.ServerName == "144.130.174.162") {
                                    ERPIPAdderess = "steelmains14403.vs1cloud.com";
                                }else if (dataReturnRes.ProcessLog.ServerName == "156.155.97.183") {
                                    ERPIPAdderess = "vs1dev5.vs1cloud.com";
                                }else if (dataReturnRes.ProcessLog.ServerName == "120.151.35.249") {
                                    ERPIPAdderess = "rappaustralia.vs1cloud.com";
                                }else if (dataReturnRes.ProcessLog.ServerName == "165.228.147.127") {
                                    ERPIPAdderess = "vs1connection.vs1cloud.com";
                                }else {
                                    ERPIPAdderess = dataReturnRes.ProcessLog.ServerName;
                                }
                                var ERPdbName = dataReturnRes.ProcessLog.Databasename;

                                var ERPport = dataReturnRes.ProcessLog.APIPort;

                                Session.setPersistent('mycloudLogonUserEmail', userLoginEmail);

                                var ERPuserName = userLoginEmail;
                                var ERPLoggeduserName = userLoginEmail;
                                var ERPpassword = userLoginPassword.replace('%20', " ").replace('%21', '!').replace('%22', '"')
                            .replace('%23', "#").replace('%24', "$").replace('%25', "%").replace('%26', "&").replace('%27', "'")
                            .replace('%28', "(").replace('%29', ")").replace('%2A', "*").replace('%2B', "+")
                            .replace('%2C', ",").replace('%2D', "-").replace('%2E', ".").replace('%2F', "/") || '';

                                let erpdbname = ERPIPAdderess + ',' + ERPdbName + ',' + ERPuserName + ',' + ERPpassword + ',' + ERPport;
                                let licenceOptions = dataReturnRes.ProcessLog.Modules.Modules;
                                $.each(licenceOptions, function (item, option) {

                                    if ((option.ModuleName == 'Accounts Payable Reports') || (option.ModuleName == 'Accounts Receivable Report')) {
                                        isAccountsLicence = true;
                                    } else if (option.ModuleName == 'Statements') {
                                        isContactsLicence = true;
                                    } else if ((option.ModuleName == 'Expense Claims / Receipt Claiming')) {
                                        isExpenseClaimsLicence = true;
                                    } else if (option.ModuleName == 'CloudDashboard') {
                                        isDashboardLicence = true;
                                    } else if (option.ModuleName == 'CloudFixedAssets') {
                                        isFixedAssetsLicence = true;
                                    } else if (option.ModuleName == 'Inventory Tracking') {
                                        isInventoryLicence = true;
                                    } else if (option.ModuleName == 'CloudMain') {
                                        isMainLicence = true;
                                    } else if (option.ModuleName == 'Manufacturing') {
                                        isManufacturingLicence = true;
                                    } else if (option.ModuleName == 'Payemnts') {
                                        isPaymentsLicence = true;
                                    } else if (option.ModuleName == 'Bills') {
                                        isPurchasesLicence = true;
                                    } else if (option.ModuleName == 'Reports Dashboard') {
                                        isReportsLicence = true;
                                    } else if ((option.ModuleName == 'Quotes') || (option.ModuleName == 'Invoices')) {
                                        isSalesLicence = true;
                                    } else if (option.ModuleName == 'CloudSettings') {
                                        isSettingsLicence = true;
                                    } else if ((option.ModuleName == 'Shipping')) {
                                        isShippingLicence = true;
                                    } else if (option.ModuleName == 'Stock Adjustments') {
                                        isStockTakeLicence = true;
                                    } else if (option.ModuleName == 'Stock Adjustments') {
                                        isStockTransferLicence = true;
                                    } else if ((option.ModuleName == 'Seed To Sale')) {
                                        isSeedToSaleLicence = true;
                                    } else if (option.ModuleName == 'CloudBanking') {
                                        isBankingLicence = true;
                                    } else if ((option.ModuleName == 'Payroll Integration')) {
                                        isPayrollLicence = true;
                                    } else if ((option.ModuleName == 'Payroll Unlimited Employees')) {
                                        isPayrollLicence = true;
                                    } else if ((option.ModuleName == 'Time Sheets')) {
                                        isPayrollLicence = true;
                                    } else if ((option.ModuleName == 'Manufacturing')) {
                                        isManufacturingLicence = true;
                                    } else if ((option.ModuleName == 'POS')) {
                                        isPOSLicence = true;
                                    } else if ((option.ModuleName == 'WMS')) {
                                        isWMSLicence = true;
                                    } else if ((option.ModuleName == 'Matrix')) {
                                        isMatrixLicence = true;
                                    } else if ((option.ModuleName == 'Add Extra User')) {
                                        isAddExtraUserLicence = true;
                                    } else if ((option.ModuleName == 'FX Currency')) {
                                        isFxCurrencyLicence = true;
                                    } else if ((option.ModuleName == 'Use Foreign Currency')) {
                                        isFxCurrencyLicence = true;
                                    } else if ((option.ModuleName == 'Link To TrueERP') || (option.ModuleName == 'Connect to Live ERP DB')) {
                                        localStorage.setItem('isPurchasedTrueERPModule', true);
                                        if (option.ModuleActive) {
                                            isTrueERPConnection = option.ModuleActive || true;
                                        } else {
                                            isTrueERPConnection = false;
                                        }
                                    } else if ((option.ModuleName == 'Appointment Scheduling')) {
                                        isAppointmentSchedulingLicence = true;
                                    }

                                });

                                /* Remove licence */
                                if (dataReturnRes.ProcessLog.ServerName !== "110.142.175.245") {
                                  isTrueERPConnection = true;
                                }
                                Session.setPersistent('CloudTrueERPModule', isTrueERPConnection);
                                Session.setPersistent('CloudAccountsLicence', isAccountsLicence);
                                Session.setPersistent('CloudContactsLicence', isContactsLicence);
                                Session.setPersistent('CloudExpenseClaimsLicence', isExpenseClaimsLicence);
                                Session.setPersistent('CloudPaymentsLicence', isPaymentsLicence);
                                Session.setPersistent('CloudReportsLicence', isReportsLicence);
                                Session.setPersistent('CloudSettingsLicence', isSettingsLicence);

                                Session.setPersistent('CloudMainLicence', isMainLicence);
                                Session.setPersistent('CloudDashboardLicence', isDashboardLicence);

                                Session.setPersistent('CloudSeedToSaleLicence', isSeedToSaleLicence);
                                Session.setPersistent('CloudBankingLicence', isBankingLicence);
                                Session.setPersistent('CloudPayrollLicence', isPayrollLicence);

                                Session.setPersistent('CloudFixedAssetsLicence', isFixedAssetsLicence);
                                Session.setPersistent('CloudInventoryLicence', isInventoryLicence);
                                Session.setPersistent('CloudManufacturingLicence', isManufacturingLicence);
                                Session.setPersistent('CloudPurchasesLicence', isPurchasesLicence);
                                Session.setPersistent('CloudSalesLicence', isSalesLicence);
                                Session.setPersistent('CloudShippingLicence', isShippingLicence);
                                Session.setPersistent('CloudStockTakeLicence', isStockTakeLicence);
                                Session.setPersistent('CloudStockTransferLicence', isStockTransferLicence);

                                Session.setPersistent('CloudAddExtraLicence', isAddExtraUserLicence);
                                Session.setPersistent('CloudMatrixLicence', isMatrixLicence);
                                Session.setPersistent('CloudPOSLicence', isPOSLicence);
                                Session.setPersistent('CloudUseForeignLicence', isFxCurrencyLicence);
                                Session.setPersistent('CloudWMSLicence', isWMSLicence);
                                Session.setPersistent('CloudAppointmentSchedulingLicence', isAppointmentSchedulingLicence);
                                /* End Remove licence */

                                if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail == undefined) {
                                    swal('Sorry, You do not have access to any VS1 Modules!', '', 'error');
                                    myVS1Video.pause();
                                    $('.myVS1Video').css('display', 'none');
                                    $('.myVS1VideoLogin').css('display', 'none');
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('.loginSpinner').css('display', 'none');
                                    return false;

                                };

                                if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.ResponseNo == 401) {
                                    swal('Sorry, You do not have access to any VS1 Modules!', '', 'error');
                                    myVS1Video.pause();
                                    $('.myVS1Video').css('display', 'none');
                                    $('.myVS1VideoLogin').css('display', 'none');
                                    $('.fullScreenSpin').css('display', 'none');
                                    $('.loginSpinner').css('display', 'none');
                                    return false;

                                };

                                Session.setPersistent('mycloudLogonUsername', ERPuserName);
                                Session.setPersistent('mycloudLogonUserEmail', ERPuserName);

                                localStorage.setItem('VS1FormAccessDetail', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.items)||'');

                                Session.setPersistent('myerpPassword', userLoginPassword);
                                Session.setPersistent('mySessionEmployee', ERPuserName);

                                localStorage.setItem('EIPAddress', ERPIPAdderess);
                                localStorage.setItem('EUserName', ERPuserName);
                                localStorage.setItem('EPassword', ERPpassword);
                                localStorage.setItem('EDatabase', ERPdbName);
                                localStorage.setItem('EPort', ERPport);
                                loggedUserEventFired = true;

                                localStorage.setItem('mainEIPAddress', licenceIPAddress);
                                localStorage.setItem('mainEPort', checkSSLPorts);

                                if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields) {
                                    Session.setPersistent('vs1companyName', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_CompanyName || '');
                                    Session.setPersistent('vs1companyaddress1', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address || '');
                                    Session.setPersistent('vs1companyaddress2', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address2 || '');
                                    Session.setPersistent('vs1companyABN', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_ABN || '');
                                    Session.setPersistent('vs1companyPhone', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_PhoneNumber || '');
                                    Session.setPersistent('vs1companyURL', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_URL || '');

                                    Session.setPersistent('ERPDefaultDepartment', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultClass || '');
                                    Session.setPersistent('ERPDefaultUOM', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultUOM || '');

                                    Session.setPersistent('ERPCountryAbbr', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_ForeignExDefault || '');
                                    Session.setPersistent('ERPTaxCodePurchaseInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc || '');
                                    Session.setPersistent('ERPTaxCodeSalesInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc || '');

                                    localStorage.setItem('VS1OverDueInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_AMOUNT || Currency + '0');
                                    localStorage.setItem('VS1OverDueInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_QUANTITY || 0);
                                    localStorage.setItem('VS1OutstandingPayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_AMOUNT || Currency + '0');
                                    localStorage.setItem('VS1OutstandingPayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_QUANTITY || 0);

                                    localStorage.setItem('VS1OutstandingInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_AMOUNT || Currency + '0');
                                    localStorage.setItem('VS1OutstandingInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_QUANTITY || 0);
                                    localStorage.setItem('VS1OverDuePayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_AMOUNT || Currency + '0');
                                    localStorage.setItem('VS1OverDuePayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_QUANTITY || 0);


                                    localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');

                                    localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_NetIncomeEx || 0);
                                    localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalIncomeEx || 0);
                                    localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalExpenseEx || 0);
                                    localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalCOGSEx || 0);

                                    if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.ResponseNo == 401) {
                                        localStorage.setItem('vs1LoggedEmployeeImages_dash', '');
                                    } else {
                                        if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields) {
                                            localStorage.setItem('vs1LoggedEmployeeImages_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields.EncodedPic || '');
                                        } else {
                                            localStorage.setItem('vs1LoggedEmployeeImages_dash', '');
                                        }
                                    }
                                } else {
                                    Session.setPersistent('vs1companyName', '');
                                    Session.setPersistent('vs1companyaddress1', '');
                                    Session.setPersistent('vs1companyaddress2', '');
                                    Session.setPersistent('vs1companyABN', '');
                                    Session.setPersistent('vs1companyPhone', '');
                                    Session.setPersistent('vs1companyURL', '');

                                    Session.setPersistent('ERPDefaultDepartment', '');
                                    Session.setPersistent('ERPDefaultUOM', '');

                                    Session.setPersistent('ERPTaxCodePurchaseInc', '');
                                    Session.setPersistent('ERPTaxCodeSalesInc', '');

                                    localStorage.setItem('VS1OverDueInvoiceAmt_dash', '');
                                    localStorage.setItem('VS1OverDueInvoiceQty_dash', '');
                                    localStorage.setItem('VS1OutstandingPayablesAmt_dash', '');
                                    localStorage.setItem('VS1OutstandingPayablesQty_dash', '');

                                    localStorage.setItem('VS1OutstandingInvoiceAmt_dash', '');
                                    localStorage.setItem('VS1OutstandingInvoiceQty_dash', '');
                                    localStorage.setItem('VS1OverDuePayablesAmt_dash', '');
                                    localStorage.setItem('VS1OverDuePayablesQty_dash', '');

                                    localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');

                                    localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', '');
                                    localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', '');
                                    localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', '');
                                    localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', '');
                                }

                                localStorage.setItem('VS1APReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_ap_report.items) || '');
                                localStorage.setItem('VS1PNLPeriodReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_pnl_period.items) || '');
                                localStorage.setItem('VS1SalesListReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_saleslist.items) || '');
                                localStorage.setItem('VS1SalesEmpReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_salesperemployee.items) || '');

                                Session.setPersistent('LoggedUserEventFired', true);
                                Session.setPersistent('userlogged_status', 'active');

                                var empusername = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
                                var employeeUserLogon = ERPLoggeduserName;
                                var employeeUserID = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeId;
                                var employeename = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
                                Session.setPersistent('mySessionEmployeeLoggedID', employeeUserID);
                                localStorage.setItem('mySession', employeeUserLogon);
                                var sessionDataToLog = localStorage.getItem('mySession');
                                Session.setPersistent('mySessionEmployee', employeename);
                                let userAccessOptions = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail || '';
                                if (userAccessOptions != "") {

                                    addLoginData(dataReturnRes).then(function (datareturn) {
                                        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                                            getAccessLevelData(userAccessOptions, isSameUserLogin);
                                        } else {
                                            myVS1VideoLogin.onended = function (e) {
                                                getAccessLevelData(userAccessOptions, isSameUserLogin);
                                            }
                                        }

                                    }).catch(function (err) {
                                        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                                            getAccessLevelData(userAccessOptions, isSameUserLogin);
                                        } else {
                                            myVS1VideoLogin.onended = function (e) {
                                                getAccessLevelData(userAccessOptions, isSameUserLogin);
                                            }
                                        }
                                    });
                                }

                            }
                        }
                    }).catch(function (err) {
                        $('.myVS1Video').css('display', 'inline-block');
                        myVS1Video.currentTime = 0;
                        myVS1Video.play();
                        var serverTest = URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/erpapi/Vs1_Logon?Vs1UserName="' + userLoginEmail + '"&vs1Password="' + userLoginPassword + '"';

                        var oReq = new XMLHttpRequest();
                        oReq.open("GET", serverTest, true);
                        oReq.setRequestHeader("database", vs1loggedDatatbase);
                        oReq.setRequestHeader("username", "VS1_Cloud_Admin");
                        oReq.setRequestHeader("password", "DptfGw83mFl1j&9");
                        oReq.send();

                        oReq.onreadystatechange = function () {

                            if (oReq.readyState == 4 && oReq.status == 200) {
                                Session.setPersistent('mainEIPAddress', licenceIPAddress);
                                Session.setPersistent('mainEPort', checkSSLPorts);

                                var dataReturnRes = JSON.parse(oReq.responseText);
                                if (dataReturnRes.ProcessLog.ResponseStatus != "OK") {
                                    myVS1Video.pause();
                                    $('.myVS1Video').css('display', 'none');
                                    $('.myVS1VideoLogin').css('display', 'none');
                                    if (dataReturnRes.ProcessLog.ResponseStatus == "Payment is Due") {
                                        $('.loginSpinner').css('display', 'none');
                                        $('.fullScreenSpin').css('display', 'none');
                                        myVS1Video.pause();
                                        $('.myVS1Video').css('display', 'none');
                                        $('.myVS1VideoLogin').css('display', 'none');
                                        swal({
                                            title: 'Your payment has been declined please update your payment subscription information!',
                                            text: '',
                                            type: 'error',
                                            showCancelButton: true,
                                            confirmButtonText: 'Update Payment',
                                            cancelButtonText: 'Cancel'
                                        }).then((result) => {
                                            if (result.value) {
                                                //window.open('https://www.payments.vs1cloud.com/customer/account/login/referer/aHR0cHM6Ly93d3cucGF5bWVudHMudnMxY2xvdWQuY29tLw%2C%2C?urppassname='+dataReturnRes.ProcessLog.VS1AdminUserName+'&urlpasstoken='+userLoginPassword+'', '_blank');
                                                window.open('/subscriptionSettings?urppassname=' + dataReturnRes.ProcessLog.VS1AdminUserName, '_blank');
                                                Session.setPersistent('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                            } else if (result.dismiss === 'cancel') {}
                                        });

                                    } else {
                                        swal(dataReturnRes.ProcessLog.ResponseStatus, dataReturnRes.ProcessLog.ResponseStatus, 'error');
                                        myVS1Video.pause();
                                        $('.myVS1Video').css('display', 'none');
                                        $('.myVS1VideoLogin').css('display', 'none');
                                        $('.loginSpinner').css('display', 'none');
                                        $('.fullScreenSpin').css('display', 'none');
                                    }

                                } else {
                                    //Code Here

                                    var oReqCheckActive = new XMLHttpRequest();
                                    oReqCheckActive.open("GET", URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/' + 'erpapi/TVS1_Clients_Simple?PropertyList="ID,EmailVarified"&select=[Databasename]="' + dataReturnRes.ProcessLog.Databasename + '"', true);
                                    oReqCheckActive.setRequestHeader("database", vs1loggedDatatbase);
                                    oReqCheckActive.setRequestHeader("username", 'VS1_Cloud_Admin');
                                    oReqCheckActive.setRequestHeader("password", 'DptfGw83mFl1j&9');
                                    oReqCheckActive.send();
                                    oReqCheckActive.onreadystatechange = function () {
                                        if (oReqCheckActive.readyState == 4 && oReqCheckActive.status == 200) {
                                            var dataDBActive = JSON.parse(oReqCheckActive.responseText);

                                            if (dataDBActive.tvs1_clients_simple[0].EmailVarified) {

                                                //Code Here
                                                Meteor.call('readMethod', dataReturnRes.ProcessLog.VS1AdminUserName, function (error, result) {
                                                    if (error) {}
                                                    else {
                                                        let regUserDetails = result;
                                                        if (regUserDetails) {
                                                            if (regUserDetails.length === 0) {}

                                                            Session.setPersistent('mycloudLogonDBID', regUserDetails.clouddatabaseID);
                                                            Session.setPersistent('mycloudLogonID', regUserDetails._id);

                                                        }
                                                    }

                                                });

                                                localStorage.setItem('vs1cloudLoginInfo', dataReturnRes);
                                                localStorage.setItem('vs1cloudlicenselevel', dataReturnRes.ProcessLog.LicenseLevel);
                                                if (!localStorage.getItem('VS1loggedDatabase')) {
                                                    localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.Databasename);
                                                    localStorage.setItem('VS11099Contractor_Report', '');
                                                    localStorage.setItem('VS1AgedPayables_Report', '');
                                                    localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                                                    localStorage.setItem('VS1AgedReceivables_Report', '');
                                                    localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                                                    localStorage.setItem('VS1BalanceSheet_Report', '');
                                                    localStorage.setItem('VS1BalanceTrans_Report', '');
                                                    localStorage.setItem('VS1GeneralLedger_Report', '');
                                                    localStorage.setItem('VS1ProfitandLoss_Report', '');
                                                    localStorage.setItem('VS1Purchase_List', '');
                                                    localStorage.setItem('VS1Purchase_Report', '');
                                                    localStorage.setItem('VS1PurchaseSummary_Report', '');
                                                    localStorage.setItem('VS1ProductSales_List', '');
                                                    localStorage.setItem('VS1ProductSales_Report', '');
                                                    localStorage.setItem('VS1Sales_List', '');
                                                    localStorage.setItem('VS1Sales_Report', '');
                                                    localStorage.setItem('VS1SalesSummary_Report', '');
                                                    localStorage.setItem('VS1TaxSummary_Report', '');
                                                    localStorage.setItem('VS1TrialBalance_Report', '');
                                                    localStorage.setItem('VS1PrintStatements_Report', '');
                                                    Session.setPersistent('bankaccountid', '');

                                                    localStorage.setItem('VS1ProductList', '');
                                                    localStorage.setItem('VS1CustomerList', '');
                                                    localStorage.setItem('VS1SupplierList', '');
                                                    localStorage.setItem('VS1AccountList', '');
                                                    localStorage.setItem('VS1TaxCodeList', '');
                                                    localStorage.setItem('VS1TermsList', '');
                                                    localStorage.setItem('VS1DepartmentList', '');
                                                    localStorage.setItem('VS1CurrencyList', '');
                                                    localStorage.setItem('VS1LeadStatusList', '');
                                                    localStorage.setItem('VS1ShippingMethodList', '');
                                                    localStorage.setItem('VS1AccountTypeList', '');
                                                    localStorage.setItem('VS1ERPCombinedContactsList', '');
                                                    localStorage.setItem('VS1EmployeeList', '');
                                                    localStorage.setItem('VS1JournalEntryLineList', '');
                                                    localStorage.setItem('VS1BankAccountReportList', '');
                                                    localStorage.setItem('VS1TInvoiceList', '');
                                                    localStorage.setItem('VS1TInvoiceNonBackOrderList', '');
                                                    localStorage.setItem('VS1BackOrderSalesListList', '');
                                                    localStorage.setItem('VS1TPurchaseOrderList', '');
                                                    localStorage.setItem('VS1TReconcilationList', '');
                                                    localStorage.setItem('VS1TChequeList', '');
                                                    localStorage.setItem('VS1TProductStocknSalePeriodReport', '');
                                                    localStorage.setItem('VS1TAppUserList', '');
                                                    localStorage.setItem('VS1TJobVS1List', '');
                                                    localStorage.setItem('VS1TStockAdjustEntryList', '');
                                                    localStorage.setItem('VS1TsalesOrderNonBackOrderList', '');
                                                    localStorage.setItem('VS1TbillReport', '');
                                                    localStorage.setItem('VS1TbillReport', '');
                                                    localStorage.setItem('VS1TCreditList', '');
                                                    localStorage.setItem('VS1TpurchaseOrderNonBackOrderList', '');
                                                    localStorage.setItem('VS1TpurchaseOrderBackOrderList', '');
                                                    localStorage.setItem('VS1TSalesList', '');
                                                } else {
                                                    if ((localStorage.getItem('VS1loggedDatabase')) == (dataReturnRes.ProcessLog.Databasename)) {
                                                        isSameUserLogin = true;
                                                    } else {
                                                        localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.Databasename);
                                                        localStorage.setItem('VS11099Contractor_Report', '');
                                                        localStorage.setItem('VS1AgedPayables_Report', '');
                                                        localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                                                        localStorage.setItem('VS1AgedReceivables_Report', '');
                                                        localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                                                        localStorage.setItem('VS1BalanceSheet_Report', '');
                                                        localStorage.setItem('VS1BalanceTrans_Report', '');
                                                        localStorage.setItem('VS1GeneralLedger_Report', '');
                                                        localStorage.setItem('VS1ProfitandLoss_Report', '');
                                                        localStorage.setItem('VS1Purchase_List', '');
                                                        localStorage.setItem('VS1Purchase_Report', '');
                                                        localStorage.setItem('VS1PurchaseSummary_Report', '');
                                                        localStorage.setItem('VS1ProductSales_List', '');
                                                        localStorage.setItem('VS1ProductSales_Report', '');
                                                        localStorage.setItem('VS1Sales_List', '');
                                                        localStorage.setItem('VS1Sales_Report', '');
                                                        localStorage.setItem('VS1SalesSummary_Report', '');
                                                        localStorage.setItem('VS1TaxSummary_Report', '');
                                                        localStorage.setItem('VS1TrialBalance_Report', '');
                                                        localStorage.setItem('VS1PrintStatements_Report', '');

                                                        localStorage.setItem('VS1AccoountList', '');
                                                        Session.setPersistent('bankaccountid', '');
                                                    }
                                                }

                                                Session.setPersistent('ERPCurrency', dataReturnRes.ProcessLog.TRegionalOptions.CurrencySymbol);

                                                var region = dataReturnRes.ProcessLog.RegionName;
                                                Session.setPersistent('ERPLoggedCountry', region);

                                                if (dataReturnRes.ProcessLog.RegionName === "Australia") {
                                                    Session.setPersistent('ERPCountryAbbr', 'AUD');
                                                } else if (dataReturnRes.ProcessLog.RegionName === "Canada") {
                                                    Session.setPersistent('ERPCountryAbbr', 'CAD');
                                                } else if (dataReturnRes.ProcessLog.RegionName === "Colombia") {
                                                    Session.setPersistent('ERPCountryAbbr', 'COP');
                                                } else if (dataReturnRes.ProcessLog.RegionName === "Kuwait") {
                                                    Session.setPersistent('ERPCountryAbbr', 'KYD');
                                                } else if (dataReturnRes.ProcessLog.RegionName === "Mexico") {
                                                    Session.setPersistent('ERPCountryAbbr', 'MXN');
                                                } else if (dataReturnRes.ProcessLog.RegionName === "New Zealand") {
                                                    Session.setPersistent('ERPCountryAbbr', 'NZD');
                                                } else if (dataReturnRes.ProcessLog.RegionName === "Qatar") {
                                                    Session.setPersistent('ERPCountryAbbr', 'QAR');
                                                } else if (dataReturnRes.ProcessLog.RegionName === "Kingdom of Saudi Arabia") {
                                                    Session.setPersistent('ERPCountryAbbr', 'SAR');
                                                } else if (dataReturnRes.ProcessLog.RegionName === "Singapore") {
                                                    Session.setPersistent('ERPCountryAbbr', 'SGD');
                                                } else if (dataReturnRes.ProcessLog.RegionName === "South Africa") {
                                                    Session.setPersistent('ERPCountryAbbr', 'ZAR');
                                                } else if (dataReturnRes.ProcessLog.RegionName === "United Arab Emirates") {
                                                    Session.setPersistent('ERPCountryAbbr', 'AED');
                                                } else if (dataReturnRes.ProcessLog.RegionName === "United Kingdom") {
                                                    Session.setPersistent('ERPCountryAbbr', 'GBP');
                                                } else if (dataReturnRes.ProcessLog.RegionName === "United States of America") {
                                                    Session.setPersistent('ERPCountryAbbr', 'USD');
                                                }
                                                Session.setPersistent('ERPDefaultDepartment', 'Default');
                                                Session.setPersistent('ERPDefaultUOM', '');
                                                Session.setPersistent('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                                localStorage.setItem('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                                dataReturnRes.ProcessLog.VS1AdminPassword = hashUserLoginPassword;
                                                dataReturnRes.ProcessLog.VS1UserName = userLoginEmail;
                                                var ERPIPAdderess = "";
                                                if (dataReturnRes.ProcessLog.ServerName == "110.142.175.245") {
                                                    ERPIPAdderess = ERPDatabaseIPAdderess;
                                                } else if (dataReturnRes.ProcessLog.ServerName == "59.154.69.210") {
                                                    ERPIPAdderess = "gardenscapes.vs1cloud.com";
                                                }else if (dataReturnRes.ProcessLog.ServerName == "144.130.174.170") {
                                                    ERPIPAdderess = "steelmains.vs1cloud.com";
                                                }else if (dataReturnRes.ProcessLog.ServerName == "144.130.174.162") {
                                                    ERPIPAdderess = "steelmains14403.vs1cloud.com";
                                                }else if (dataReturnRes.ProcessLog.ServerName == "156.155.97.183") {
                                                    ERPIPAdderess = "vs1dev5.vs1cloud.com";
                                                }else if (dataReturnRes.ProcessLog.ServerName == "120.151.35.249") {
                                                    ERPIPAdderess = "rappaustralia.vs1cloud.com";
                                                }else if (dataReturnRes.ProcessLog.ServerName == "165.228.147.127") {
                                                    ERPIPAdderess = "vs1connection.vs1cloud.com";
                                                }else {
                                                    ERPIPAdderess = dataReturnRes.ProcessLog.ServerName;
                                                }
                                                var ERPdbName = dataReturnRes.ProcessLog.Databasename;

                                                var ERPport = dataReturnRes.ProcessLog.APIPort;

                                                Session.setPersistent('mycloudLogonUserEmail', userLoginEmail);

                                                var ERPuserName = userLoginEmail;
                                                var ERPLoggeduserName = userLoginEmail;
                                                var ERPpassword = userLoginPassword.replace('%20', " ").replace('%21', '!').replace('%22', '"')
                                            .replace('%23', "#").replace('%24', "$").replace('%25', "%").replace('%26', "&").replace('%27', "'")
                                            .replace('%28', "(").replace('%29', ")").replace('%2A', "*").replace('%2B', "+")
                                            .replace('%2C', ",").replace('%2D', "-").replace('%2E', ".").replace('%2F', "/") || '';

                                                let erpdbname = ERPIPAdderess + ',' + ERPdbName + ',' + ERPuserName + ',' + ERPpassword + ',' + ERPport;
                                                let licenceOptions = dataReturnRes.ProcessLog.Modules.Modules;
                                                $.each(licenceOptions, function (item, option) {

                                                    if ((option.ModuleName == 'Accounts Payable Reports') || (option.ModuleName == 'Accounts Receivable Report')) {
                                                        isAccountsLicence = true;
                                                    } else if (option.ModuleName == 'Statements') {
                                                        isContactsLicence = true;
                                                    } else if ((option.ModuleName == 'Expense Claims / Receipt Claiming')) {
                                                        isExpenseClaimsLicence = true;
                                                    } else if (option.ModuleName == 'CloudDashboard') {
                                                        isDashboardLicence = true;
                                                    } else if (option.ModuleName == 'CloudFixedAssets') {
                                                        isFixedAssetsLicence = true;
                                                    } else if (option.ModuleName == 'Inventory Tracking') {
                                                        isInventoryLicence = true;
                                                    } else if (option.ModuleName == 'CloudMain') {
                                                        isMainLicence = true;
                                                    } else if (option.ModuleName == 'Manufacturing') {
                                                        isManufacturingLicence = true;
                                                    } else if (option.ModuleName == 'Payemnts') {
                                                        isPaymentsLicence = true;
                                                    } else if (option.ModuleName == 'Bills') {
                                                        isPurchasesLicence = true;
                                                    } else if (option.ModuleName == 'Reports Dashboard') {
                                                        isReportsLicence = true;
                                                    } else if ((option.ModuleName == 'Quotes') || (option.ModuleName == 'Invoices')) {
                                                        isSalesLicence = true;
                                                    } else if (option.ModuleName == 'CloudSettings') {
                                                        isSettingsLicence = true;
                                                    } else if ((option.ModuleName == 'Shipping')) {
                                                        isShippingLicence = true;
                                                    } else if (option.ModuleName == 'Stock Adjustments') {
                                                        isStockTakeLicence = true;
                                                    } else if (option.ModuleName == 'Stock Adjustments') {
                                                        isStockTransferLicence = true;
                                                    } else if ((option.ModuleName == 'Seed To Sale')) {
                                                        isSeedToSaleLicence = true;
                                                    } else if (option.ModuleName == 'CloudBanking') {
                                                        isBankingLicence = true;
                                                    } else if ((option.ModuleName == 'Payroll Integration')) {
                                                        isPayrollLicence = true;
                                                    } else if ((option.ModuleName == 'Payroll Unlimited Employees')) {
                                                        isPayrollLicence = true;
                                                    } else if ((option.ModuleName == 'Time Sheets')) {
                                                        isPayrollLicence = true;
                                                    } else if ((option.ModuleName == 'Manufacturing')) {
                                                        isManufacturingLicence = true;
                                                    } else if ((option.ModuleName == 'POS')) {
                                                        isPOSLicence = true;
                                                    } else if ((option.ModuleName == 'WMS')) {
                                                        isWMSLicence = true;
                                                    } else if ((option.ModuleName == 'Matrix')) {
                                                        isMatrixLicence = true;
                                                    } else if ((option.ModuleName == 'Add Extra User')) {
                                                        isAddExtraUserLicence = true;
                                                    } else if ((option.ModuleName == 'FX Currency')) {
                                                        isFxCurrencyLicence = true;
                                                    } else if ((option.ModuleName == 'Use Foreign Currency')) {
                                                        isFxCurrencyLicence = true;
                                                    } else if ((option.ModuleName == 'Link To TrueERP') || (option.ModuleName == 'Connect to Live ERP DB')) {
                                                        localStorage.setItem('isPurchasedTrueERPModule', true);
                                                        if (option.ModuleActive) {
                                                            isTrueERPConnection = option.ModuleActive || true;
                                                        } else {
                                                            isTrueERPConnection = false;
                                                        }
                                                    } else if ((option.ModuleName == 'Appointment Scheduling')) {
                                                        isAppointmentSchedulingLicence = true;
                                                    }

                                                });

                                                /* Remove licence */
                                                if (dataReturnRes.ProcessLog.ServerName !== "110.142.175.245") {
                                                  isTrueERPConnection = true;
                                                }
                                                Session.setPersistent('CloudTrueERPModule', isTrueERPConnection);
                                                Session.setPersistent('CloudAccountsLicence', isAccountsLicence);
                                                Session.setPersistent('CloudContactsLicence', isContactsLicence);
                                                Session.setPersistent('CloudExpenseClaimsLicence', isExpenseClaimsLicence);
                                                Session.setPersistent('CloudPaymentsLicence', isPaymentsLicence);
                                                Session.setPersistent('CloudReportsLicence', isReportsLicence);
                                                Session.setPersistent('CloudSettingsLicence', isSettingsLicence);

                                                Session.setPersistent('CloudMainLicence', isMainLicence);
                                                Session.setPersistent('CloudDashboardLicence', isDashboardLicence);

                                                Session.setPersistent('CloudSeedToSaleLicence', isSeedToSaleLicence);
                                                Session.setPersistent('CloudBankingLicence', isBankingLicence);
                                                Session.setPersistent('CloudPayrollLicence', isPayrollLicence);

                                                Session.setPersistent('CloudFixedAssetsLicence', isFixedAssetsLicence);
                                                Session.setPersistent('CloudInventoryLicence', isInventoryLicence);
                                                Session.setPersistent('CloudManufacturingLicence', isManufacturingLicence);
                                                Session.setPersistent('CloudPurchasesLicence', isPurchasesLicence);
                                                Session.setPersistent('CloudSalesLicence', isSalesLicence);
                                                Session.setPersistent('CloudShippingLicence', isShippingLicence);
                                                Session.setPersistent('CloudStockTakeLicence', isStockTakeLicence);
                                                Session.setPersistent('CloudStockTransferLicence', isStockTransferLicence);

                                                Session.setPersistent('CloudAddExtraLicence', isAddExtraUserLicence);
                                                Session.setPersistent('CloudMatrixLicence', isMatrixLicence);
                                                Session.setPersistent('CloudPOSLicence', isPOSLicence);
                                                Session.setPersistent('CloudUseForeignLicence', isFxCurrencyLicence);
                                                Session.setPersistent('CloudWMSLicence', isWMSLicence);
                                                Session.setPersistent('CloudAppointmentSchedulingLicence', isAppointmentSchedulingLicence);
                                                /* End Remove licence */

                                                if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail == undefined) {
                                                    swal('Sorry, You do not have access to any VS1 Modules!', '', 'error');
                                                    myVS1Video.pause();
                                                    $('.myVS1Video').css('display', 'none');
                                                    $('.myVS1VideoLogin').css('display', 'none');
                                                    $('.fullScreenSpin').css('display', 'none');
                                                    $('.loginSpinner').css('display', 'none');
                                                    return false;

                                                };

                                                if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.ResponseNo == 401) {
                                                    swal('Sorry, You do not have access to any VS1 Modules!', '', 'error');
                                                    myVS1Video.pause();
                                                    $('.myVS1Video').css('display', 'none');
                                                    $('.myVS1VideoLogin').css('display', 'none');
                                                    $('.fullScreenSpin').css('display', 'none');
                                                    $('.loginSpinner').css('display', 'none');
                                                    return false;

                                                };

                                                dataReturnRes.ProcessLog.VS1AdminPassword = hashUserLoginPassword;
                                                dataReturnRes.ProcessLog.VS1UserName = userLoginEmail;
                                                Session.setPersistent('mycloudLogonUsername', ERPuserName);
                                                Session.setPersistent('mycloudLogonUserEmail', ERPuserName);

                                                localStorage.setItem('VS1FormAccessDetail', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.items)||'');

                                                Session.setPersistent('myerpPassword', userLoginPassword);
                                                Session.setPersistent('mySessionEmployee', ERPuserName);

                                                localStorage.setItem('EIPAddress', ERPIPAdderess);
                                                localStorage.setItem('EUserName', ERPuserName);
                                                localStorage.setItem('EPassword', ERPpassword);
                                                localStorage.setItem('EDatabase', ERPdbName);
                                                localStorage.setItem('EPort', ERPport);
                                                loggedUserEventFired = true;

                                                localStorage.setItem('mainEIPAddress', licenceIPAddress);
                                                localStorage.setItem('mainEPort', checkSSLPorts);

                                                if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields) {
                                                    Session.setPersistent('vs1companyName', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_CompanyName || '');
                                                    Session.setPersistent('vs1companyaddress1', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address || '');
                                                    Session.setPersistent('vs1companyaddress2', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address2 || '');
                                                    Session.setPersistent('vs1companyABN', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_ABN || '');
                                                    Session.setPersistent('vs1companyPhone', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_PhoneNumber || '');
                                                    Session.setPersistent('vs1companyURL', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_URL || '');

                                                    Session.setPersistent('ERPDefaultDepartment', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultClass || '');
                                                    Session.setPersistent('ERPDefaultUOM', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultUOM || '');

                                                    Session.setPersistent('ERPCountryAbbr', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_ForeignExDefault || '');
                                                    Session.setPersistent('ERPTaxCodePurchaseInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc || '');
                                                    Session.setPersistent('ERPTaxCodeSalesInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc || '');

                                                    localStorage.setItem('VS1OverDueInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_AMOUNT || Currency + '0');
                                                    localStorage.setItem('VS1OverDueInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_QUANTITY || 0);
                                                    localStorage.setItem('VS1OutstandingPayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_AMOUNT || Currency + '0');
                                                    localStorage.setItem('VS1OutstandingPayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_QUANTITY || 0);

                                                    localStorage.setItem('VS1OutstandingInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_AMOUNT || Currency + '0');
                                                    localStorage.setItem('VS1OutstandingInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_QUANTITY || 0);
                                                    localStorage.setItem('VS1OverDuePayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_AMOUNT || Currency + '0');
                                                    localStorage.setItem('VS1OverDuePayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_QUANTITY || 0);


                                                    localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');

                                                    localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_NetIncomeEx || 0);
                                                    localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalIncomeEx || 0);
                                                    localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalExpenseEx || 0);
                                                    localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalCOGSEx || 0);

                                                    if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.ResponseNo == 401) {
                                                        localStorage.setItem('vs1LoggedEmployeeImages_dash', '');
                                                    } else {
                                                        if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields) {
                                                            localStorage.setItem('vs1LoggedEmployeeImages_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields.EncodedPic || '');
                                                        } else {
                                                            localStorage.setItem('vs1LoggedEmployeeImages_dash', '');
                                                        }
                                                    }
                                                } else {
                                                    Session.setPersistent('vs1companyName', '');
                                                    Session.setPersistent('vs1companyaddress1', '');
                                                    Session.setPersistent('vs1companyaddress2', '');
                                                    Session.setPersistent('vs1companyABN', '');
                                                    Session.setPersistent('vs1companyPhone', '');
                                                    Session.setPersistent('vs1companyURL', '');

                                                    Session.setPersistent('ERPDefaultDepartment', '');
                                                    Session.setPersistent('ERPDefaultUOM', '');

                                                    Session.setPersistent('ERPTaxCodePurchaseInc', '');
                                                    Session.setPersistent('ERPTaxCodeSalesInc', '');

                                                    localStorage.setItem('VS1OverDueInvoiceAmt_dash', '');
                                                    localStorage.setItem('VS1OverDueInvoiceQty_dash', '');
                                                    localStorage.setItem('VS1OutstandingPayablesAmt_dash', '');
                                                    localStorage.setItem('VS1OutstandingPayablesQty_dash', '');

                                                    localStorage.setItem('VS1OutstandingInvoiceAmt_dash', '');
                                                    localStorage.setItem('VS1OutstandingInvoiceQty_dash', '');
                                                    localStorage.setItem('VS1OverDuePayablesAmt_dash', '');
                                                    localStorage.setItem('VS1OverDuePayablesQty_dash', '');

                                                    localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');

                                                    localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', '');
                                                    localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', '');
                                                    localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', '');
                                                    localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', '');
                                                }

                                                localStorage.setItem('VS1APReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_ap_report.items) || '');
                                                localStorage.setItem('VS1PNLPeriodReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_pnl_period.items) || '');
                                                localStorage.setItem('VS1SalesListReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_saleslist.items) || '');
                                                localStorage.setItem('VS1SalesEmpReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_salesperemployee.items) || '');

                                                Session.setPersistent('LoggedUserEventFired', true);
                                                Session.setPersistent('userlogged_status', 'active');

                                                var empusername = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
                                                var employeeUserLogon = ERPLoggeduserName;
                                                var employeeUserID = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeId;
                                                var employeename = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
                                                Session.setPersistent('mySessionEmployeeLoggedID', employeeUserID);
                                                localStorage.setItem('mySession', employeeUserLogon);
                                                var sessionDataToLog = localStorage.getItem('mySession');
                                                Session.setPersistent('mySessionEmployee', employeename);
                                                let userAccessOptions = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail || '';

                                                if (userAccessOptions != "") {
                                                    addLoginData(dataReturnRes).then(function (datareturn) {
                                                        getAccessLevelData(userAccessOptions, isSameUserLogin);
                                                    }).catch(function (err) {
                                                        getAccessLevelData(userAccessOptions, isSameUserLogin);
                                                    });

                                                }

                                                //End Code Here
                                            } else {
                                                myVS1Video.pause();
                                                $('.myVS1Video').css('display', 'none');
                                                $('.myVS1VideoLogin').css('display', 'none');
                                                $('#emEmail').html(userLoginEmail);
                                                $('#emPassword').html(userLoginPassword.replace('%20', " ").replace('%21', '!').replace('%22', '"')
                                                .replace('%23', "#").replace('%24', "$").replace('%25', "%").replace('%26', "&").replace('%27', "'")
                                                .replace('%28', "(").replace('%29', ")").replace('%2A', "*").replace('%2B', "+")
                                                .replace('%2C', ",").replace('%2D', "-").replace('%2E', ".").replace('%2F', "/"));
                                                $(".addloginkey").attr("href", 'https://www.depot.vs1cloud.com/vs1activation/sandboxcheck.php?checktoken=' + userLoginEmail + '');
                                                $(".addloginActive").attr("href", 'https://www.depot.vs1cloud.com/vs1activation/sandboxcheck.php?checktoken=' + userLoginEmail + '');
                                                swal({
                                                    title: 'Awaiting Email Validation',
                                                    html: true,
                                                    html: "This account has not been validated because the email address that it is linked to has not yet been validated.\n \n <br></br> We've sent an email containing a validation link to: <strong> " + dataReturnRes.ProcessLog.VS1AdminUserName + " </strong>",
                                                    type: 'info',
                                                    showCancelButton: false,
                                                    confirmButtonText: 'Resend Validation Email',
                                                    cancelButtonText: 'No'
                                                }).then((result) => {
                                                    if (result.value) {
                                                        let mailBodyNew = $('.emailBody').html();
                                                        Meteor.call('sendEmail', {
                                                            from: "VS1 Cloud <info@vs1cloud.com>",
                                                            to: dataReturnRes.ProcessLog.VS1AdminUserName,
                                                            cc: 'info@vs1cloud.com',
                                                            subject: '[VS1 Cloud] - Email Validation',
                                                            text: '',
                                                            html: mailBodyNew,
                                                            attachments: ''

                                                        }, function (error, result) {
                                                            location.reload(true);
                                                        });
                                                    } else if (result.dismiss === 'cancel') {
                                                        // FlowRouter.go('/employeescard?addvs1user=true');
                                                    }
                                                });
                                                myVS1Video.pause();
                                                $('.myVS1Video').css('display', 'none');
                                                $('.myVS1VideoLogin').css('display', 'none');
                                                $('.fullScreenSpin').css('display', 'none');
                                                $('.loginSpinner').css('display', 'none');
                                                return false;
                                            }
                                        }
                                    }

                                    //End Code here


                                }

                            } else if (oReq.statusText == '') {
                                swal({
                                    title: 'Oooops...',
                                    text: "Connection Failed, Please try again",
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {
                                        Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {}
                                });
                                myVS1Video.pause();
                                $('.myVS1Video').css('display', 'none');
                                $('.myVS1VideoLogin').css('display', 'none');
                                $('.loginSpinner').css('display', 'none');
                                $('.fullScreenSpin').css('display', 'none');
                            } else if (oReq.readyState == 4 && oReq.status == 403) {
                                swal({
                                    title: 'Ooops...',
                                    text: 'It seems we are unable to connect you to VS1Cloud at the moment. Please try again in a few minutes.',
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {
                                        Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {}
                                });
                                myVS1Video.pause();
                                $('.myVS1Video').css('display', 'none');
                                $('.myVS1VideoLogin').css('display', 'none');
                                $('.loginSpinner').css('display', 'none');
                                $('.fullScreenSpin').css('display', 'none');
                            } else if (oReq.readyState == 4 && oReq.status == 406) {
                                swal({
                                    title: 'Oooops...',
                                    text: oReq.getResponseHeader('errormessage'),
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {
                                        Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {}
                                });
                                myVS1Video.pause();
                                $('.myVS1Video').css('display', 'none');
                                $('.myVS1VideoLogin').css('display', 'none');
                                $('.loginSpinner').css('display', 'none');
                                $('.fullScreenSpin').css('display', 'none');
                            } else if (oReq.readyState == 4 && oReq.status == 500) {
                                var ErrorResponse = oReq.getResponseHeader('errormessage');
                                if (ErrorResponse.indexOf("Access violation") >= 0) {
                                    swal({
                                        title: 'Your database is being created. ',
                                        text: "Please try again in 10 minutes",
                                        type: 'info',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {
                                            Meteor._reload.reload();
                                        } else if (result.dismiss === 'cancel') {}
                                    });
                                } else {
                                    swal({
                                        title: 'Oooops...',
                                        text: oReq.getResponseHeader('errormessage'),
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {
                                            Meteor._reload.reload();
                                        } else if (result.dismiss === 'cancel') {}
                                    });
                                }
                                myVS1Video.pause();
                                $('.myVS1Video').css('display', 'none');
                                $('.myVS1VideoLogin').css('display', 'none');
                                $('.loginSpinner').css('display', 'none');
                                $('.fullScreenSpin').css('display', 'none');
                            } else if (oReq.readyState == 4 && oReq.status == 401) {
                                var ErrorResponse = oReq.getResponseHeader('errormessage');
                                if (ErrorResponse.indexOf("Could not connect to ERP") >= 0) {
                                    swal({
                                        title: 'Oooops...',
                                        text: "Could not connect to Database. Unable to start Database. Licence on hold ",
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {
                                            Meteor._reload.reload();
                                        } else if (result.dismiss === 'cancel') {}
                                    });
                                } else {
                                    swal({
                                        title: 'Oooops...',
                                        text: oReq.getResponseHeader('errormessage'),
                                        type: 'error',
                                        showCancelButton: false,
                                        confirmButtonText: 'Try Again'
                                    }).then((result) => {
                                        if (result.value) {
                                            Meteor._reload.reload();
                                        } else if (result.dismiss === 'cancel') {}
                                    });
                                }
                                myVS1Video.pause();
                                $('.myVS1Video').css('display', 'none');
                                $('.myVS1VideoLogin').css('display', 'none');
                                $('.loginSpinner').css('display', 'none');
                                $('.fullScreenSpin').css('display', 'none');
                            } else {}
                        }
                    });

                } else {
                    $('.myVS1Video').css('display', 'inline-block');
                    //$('.fullScreenSpin').css('display','inline-block');
                    myVS1Video.currentTime = 0;
                    myVS1Video.play();
                    var serverTest = URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/erpapi/Vs1_Logon?Vs1UserName="' + userLoginEmail + '"&vs1Password="' + userLoginPassword + '"';
                    var oReq = new XMLHttpRequest();
                    oReq.open("GET", serverTest, true);
                    oReq.setRequestHeader("database", vs1loggedDatatbase);
                    oReq.setRequestHeader("username", "VS1_Cloud_Admin");
                    oReq.setRequestHeader("password", "DptfGw83mFl1j&9");
                    oReq.send();

                    oReq.onreadystatechange = function () {

                        if (oReq.readyState == 4 && oReq.status == 200) {
                            Session.setPersistent('mainEIPAddress', licenceIPAddress);
                            Session.setPersistent('mainEPort', checkSSLPorts);

                            var dataReturnRes = JSON.parse(oReq.responseText);

                            if (dataReturnRes.ProcessLog.ResponseStatus != "OK") {
                                myVS1Video.pause();
                                $('.myVS1Video').css('display', 'none');
                                $('.myVS1VideoLogin').css('display', 'none');
                                if (dataReturnRes.ProcessLog.ResponseStatus == "Payment is Due") {
                                    myVS1Video.pause();
                                    $('.myVS1Video').css('display', 'none');
                                    $('.myVS1VideoLogin').css('display', 'none');
                                    $('.loginSpinner').css('display', 'none');
                                    $('.fullScreenSpin').css('display', 'none');

                                    swal({
                                        title: 'Your payment has been declined please update your payment subscription information!',
                                        text: '',
                                        type: 'error',
                                        showCancelButton: true,
                                        confirmButtonText: 'Update Payment',
                                        cancelButtonText: 'Cancel'
                                    }).then((result) => {
                                        if (result.value) {
                                            //window.open('https://www.payments.vs1cloud.com/customer/account/login/referer/aHR0cHM6Ly93d3cucGF5bWVudHMudnMxY2xvdWQuY29tLw%2C%2C?urppassname='+dataReturnRes.ProcessLog.VS1AdminUserName+'&urlpasstoken='+userLoginPassword+'', '_blank');
                                            window.open('/subscriptionSettings?urppassname=' + dataReturnRes.ProcessLog.VS1AdminUserName, '_blank');
                                            Session.setPersistent('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                        } else if (result.dismiss === 'cancel') {}
                                    });

                                } else {
                                    swal(dataReturnRes.ProcessLog.ResponseStatus, dataReturnRes.ProcessLog.ResponseStatus, 'error');
                                    myVS1Video.pause();
                                    $('.myVS1Video').css('display', 'none');
                                    $('.myVS1VideoLogin').css('display', 'none');
                                    $('.loginSpinner').css('display', 'none');
                                    $('.fullScreenSpin').css('display', 'none');
                                }

                            } else {
                                //Code Here

                                var oReqCheckActive = new XMLHttpRequest();
                                oReqCheckActive.open("GET", URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/' + 'erpapi/TVS1_Clients_Simple?PropertyList="ID,EmailVarified"&select=[Databasename]="' + dataReturnRes.ProcessLog.Databasename + '"', true);
                                oReqCheckActive.setRequestHeader("database", vs1loggedDatatbase);
                                oReqCheckActive.setRequestHeader("username", 'VS1_Cloud_Admin');
                                oReqCheckActive.setRequestHeader("password", 'DptfGw83mFl1j&9');
                                oReqCheckActive.send();
                                oReqCheckActive.onreadystatechange = function () {
                                    if (oReqCheckActive.readyState == 4 && oReqCheckActive.status == 200) {
                                        var dataDBActive = JSON.parse(oReqCheckActive.responseText);

                                        if (dataDBActive.tvs1_clients_simple[0].EmailVarified) {

                                            //Code Here
                                            Meteor.call('readMethod', dataReturnRes.ProcessLog.VS1AdminUserName, function (error, result) {
                                                if (error) {}
                                                else {
                                                    let regUserDetails = result;
                                                    if (regUserDetails) {
                                                        if (regUserDetails.length === 0) {}

                                                        Session.setPersistent('mycloudLogonDBID', regUserDetails.clouddatabaseID);
                                                        Session.setPersistent('mycloudLogonID', regUserDetails._id);

                                                    }
                                                }

                                            });

                                            localStorage.setItem('vs1cloudLoginInfo', dataReturnRes);
                                            localStorage.setItem('vs1cloudlicenselevel', dataReturnRes.ProcessLog.LicenseLevel);
                                            if (!localStorage.getItem('VS1loggedDatabase')) {
                                                localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.Databasename);
                                                localStorage.setItem('VS11099Contractor_Report', '');
                                                localStorage.setItem('VS1AgedPayables_Report', '');
                                                localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                                                localStorage.setItem('VS1AgedReceivables_Report', '');
                                                localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                                                localStorage.setItem('VS1BalanceSheet_Report', '');
                                                localStorage.setItem('VS1BalanceTrans_Report', '');
                                                localStorage.setItem('VS1GeneralLedger_Report', '');
                                                localStorage.setItem('VS1ProfitandLoss_Report', '');
                                                localStorage.setItem('VS1Purchase_List', '');
                                                localStorage.setItem('VS1Purchase_Report', '');
                                                localStorage.setItem('VS1PurchaseSummary_Report', '');
                                                localStorage.setItem('VS1ProductSales_List', '');
                                                localStorage.setItem('VS1ProductSales_Report', '');
                                                localStorage.setItem('VS1Sales_List', '');
                                                localStorage.setItem('VS1Sales_Report', '');
                                                localStorage.setItem('VS1SalesSummary_Report', '');
                                                localStorage.setItem('VS1TaxSummary_Report', '');
                                                localStorage.setItem('VS1TrialBalance_Report', '');
                                                localStorage.setItem('VS1PrintStatements_Report', '');
                                                Session.setPersistent('bankaccountid', '');

                                                localStorage.setItem('VS1ProductList', '');
                                                localStorage.setItem('VS1CustomerList', '');
                                                localStorage.setItem('VS1SupplierList', '');
                                                localStorage.setItem('VS1AccountList', '');
                                                localStorage.setItem('VS1TaxCodeList', '');
                                                localStorage.setItem('VS1TermsList', '');
                                                localStorage.setItem('VS1DepartmentList', '');
                                                localStorage.setItem('VS1CurrencyList', '');
                                                localStorage.setItem('VS1LeadStatusList', '');
                                                localStorage.setItem('VS1ShippingMethodList', '');
                                                localStorage.setItem('VS1AccountTypeList', '');
                                                localStorage.setItem('VS1ERPCombinedContactsList', '');
                                                localStorage.setItem('VS1EmployeeList', '');
                                                localStorage.setItem('VS1JournalEntryLineList', '');
                                                localStorage.setItem('VS1BankAccountReportList', '');
                                                localStorage.setItem('VS1TInvoiceList', '');
                                                localStorage.setItem('VS1TInvoiceNonBackOrderList', '');
                                                localStorage.setItem('VS1BackOrderSalesListList', '');
                                                localStorage.setItem('VS1TPurchaseOrderList', '');
                                                localStorage.setItem('VS1TReconcilationList', '');
                                                localStorage.setItem('VS1TChequeList', '');
                                                localStorage.setItem('VS1TProductStocknSalePeriodReport', '');
                                                localStorage.setItem('VS1TAppUserList', '');
                                                localStorage.setItem('VS1TJobVS1List', '');
                                                localStorage.setItem('VS1TStockAdjustEntryList', '');
                                                localStorage.setItem('VS1TsalesOrderNonBackOrderList', '');
                                                localStorage.setItem('VS1TbillReport', '');
                                                localStorage.setItem('VS1TbillReport', '');
                                                localStorage.setItem('VS1TCreditList', '');
                                                localStorage.setItem('VS1TpurchaseOrderNonBackOrderList', '');
                                                localStorage.setItem('VS1TpurchaseOrderBackOrderList', '');
                                                localStorage.setItem('VS1TSalesList', '');
                                            } else {
                                                if ((localStorage.getItem('VS1loggedDatabase')) == (dataReturnRes.ProcessLog.Databasename)) {
                                                    isSameUserLogin = true;
                                                } else {
                                                    localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.Databasename);
                                                    localStorage.setItem('VS11099Contractor_Report', '');
                                                    localStorage.setItem('VS1AgedPayables_Report', '');
                                                    localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                                                    localStorage.setItem('VS1AgedReceivables_Report', '');
                                                    localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                                                    localStorage.setItem('VS1BalanceSheet_Report', '');
                                                    localStorage.setItem('VS1BalanceTrans_Report', '');
                                                    localStorage.setItem('VS1GeneralLedger_Report', '');
                                                    localStorage.setItem('VS1ProfitandLoss_Report', '');
                                                    localStorage.setItem('VS1Purchase_List', '');
                                                    localStorage.setItem('VS1Purchase_Report', '');
                                                    localStorage.setItem('VS1PurchaseSummary_Report', '');
                                                    localStorage.setItem('VS1ProductSales_List', '');
                                                    localStorage.setItem('VS1ProductSales_Report', '');
                                                    localStorage.setItem('VS1Sales_List', '');
                                                    localStorage.setItem('VS1Sales_Report', '');
                                                    localStorage.setItem('VS1SalesSummary_Report', '');
                                                    localStorage.setItem('VS1TaxSummary_Report', '');
                                                    localStorage.setItem('VS1TrialBalance_Report', '');
                                                    localStorage.setItem('VS1PrintStatements_Report', '');

                                                    localStorage.setItem('VS1AccoountList', '');
                                                    Session.setPersistent('bankaccountid', '');
                                                }
                                            }

                                            Session.setPersistent('ERPCurrency', dataReturnRes.ProcessLog.TRegionalOptions.CurrencySymbol);

                                            var region = dataReturnRes.ProcessLog.RegionName;
                                            Session.setPersistent('ERPLoggedCountry', region);

                                            if (dataReturnRes.ProcessLog.RegionName === "Australia") {
                                                Session.setPersistent('ERPCountryAbbr', 'AUD');
                                            } else if (dataReturnRes.ProcessLog.RegionName === "Canada") {
                                                Session.setPersistent('ERPCountryAbbr', 'CAD');
                                            } else if (dataReturnRes.ProcessLog.RegionName === "Colombia") {
                                                Session.setPersistent('ERPCountryAbbr', 'COP');
                                            } else if (dataReturnRes.ProcessLog.RegionName === "Kuwait") {
                                                Session.setPersistent('ERPCountryAbbr', 'KYD');
                                            } else if (dataReturnRes.ProcessLog.RegionName === "Mexico") {
                                                Session.setPersistent('ERPCountryAbbr', 'MXN');
                                            } else if (dataReturnRes.ProcessLog.RegionName === "New Zealand") {
                                                Session.setPersistent('ERPCountryAbbr', 'NZD');
                                            } else if (dataReturnRes.ProcessLog.RegionName === "Qatar") {
                                                Session.setPersistent('ERPCountryAbbr', 'QAR');
                                            } else if (dataReturnRes.ProcessLog.RegionName === "Kingdom of Saudi Arabia") {
                                                Session.setPersistent('ERPCountryAbbr', 'SAR');
                                            } else if (dataReturnRes.ProcessLog.RegionName === "Singapore") {
                                                Session.setPersistent('ERPCountryAbbr', 'SGD');
                                            } else if (dataReturnRes.ProcessLog.RegionName === "South Africa") {
                                                Session.setPersistent('ERPCountryAbbr', 'ZAR');
                                            } else if (dataReturnRes.ProcessLog.RegionName === "United Arab Emirates") {
                                                Session.setPersistent('ERPCountryAbbr', 'AED');
                                            } else if (dataReturnRes.ProcessLog.RegionName === "United Kingdom") {
                                                Session.setPersistent('ERPCountryAbbr', 'GBP');
                                            } else if (dataReturnRes.ProcessLog.RegionName === "United States of America") {
                                                Session.setPersistent('ERPCountryAbbr', 'USD');
                                            }
                                            Session.setPersistent('ERPDefaultDepartment', 'Default');
                                            Session.setPersistent('ERPDefaultUOM', '');
                                            Session.setPersistent('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                            localStorage.setItem('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                            dataReturnRes.ProcessLog.VS1AdminPassword = hashUserLoginPassword;
                                            dataReturnRes.ProcessLog.VS1UserName = userLoginEmail;
                                            var ERPIPAdderess = "";
                                            if (dataReturnRes.ProcessLog.ServerName == "110.142.175.245") {
                                                ERPIPAdderess = ERPDatabaseIPAdderess;
                                            } else if (dataReturnRes.ProcessLog.ServerName == "59.154.69.210") {
                                                ERPIPAdderess = "gardenscapes.vs1cloud.com";
                                            }else if (dataReturnRes.ProcessLog.ServerName == "144.130.174.170") {
                                                ERPIPAdderess = "steelmains.vs1cloud.com";
                                            }else if (dataReturnRes.ProcessLog.ServerName == "144.130.174.162") {
                                                ERPIPAdderess = "steelmains14403.vs1cloud.com";
                                            }else if (dataReturnRes.ProcessLog.ServerName == "156.155.97.183") {
                                                ERPIPAdderess = "vs1dev5.vs1cloud.com";
                                            }else if (dataReturnRes.ProcessLog.ServerName == "120.151.35.249") {
                                                ERPIPAdderess = "rappaustralia.vs1cloud.com";
                                            }else if (dataReturnRes.ProcessLog.ServerName == "165.228.147.127") {
                                                ERPIPAdderess = "vs1connection.vs1cloud.com";
                                            }else {
                                                ERPIPAdderess = dataReturnRes.ProcessLog.ServerName;
                                            }
                                            var ERPdbName = dataReturnRes.ProcessLog.Databasename;

                                            var ERPport = dataReturnRes.ProcessLog.APIPort;

                                            Session.setPersistent('mycloudLogonUserEmail', userLoginEmail);

                                            var ERPuserName = userLoginEmail;
                                            var ERPLoggeduserName = userLoginEmail;
                                            var ERPpassword = userLoginPassword.replace('%20', " ").replace('%21', '!').replace('%22', '"')
                                        .replace('%23', "#").replace('%24', "$").replace('%25', "%").replace('%26', "&").replace('%27', "'")
                                        .replace('%28', "(").replace('%29', ")").replace('%2A', "*").replace('%2B', "+")
                                        .replace('%2C', ",").replace('%2D', "-").replace('%2E', ".").replace('%2F', "/") || '';

                                            let erpdbname = ERPIPAdderess + ',' + ERPdbName + ',' + ERPuserName + ',' + ERPpassword + ',' + ERPport;
                                            let licenceOptions = dataReturnRes.ProcessLog.Modules.Modules;
                                            $.each(licenceOptions, function (item, option) {

                                                if ((option.ModuleName == 'Accounts Payable Reports') || (option.ModuleName == 'Accounts Receivable Report')) {
                                                    isAccountsLicence = true;
                                                } else if (option.ModuleName == 'Statements') {
                                                    isContactsLicence = true;
                                                } else if ((option.ModuleName == 'Expense Claims / Receipt Claiming')) {
                                                    isExpenseClaimsLicence = true;
                                                } else if ((option.ModuleName == 'Expense Claims')) {
                                                    isExpenseClaimsLicence = true;
                                                } else if (option.ModuleName == 'CloudDashboard') {
                                                    isDashboardLicence = true;
                                                } else if (option.ModuleName == 'CloudFixedAssets') {
                                                    isFixedAssetsLicence = true;
                                                } else if (option.ModuleName == 'Inventory Tracking') {
                                                    isInventoryLicence = true;
                                                } else if (option.ModuleName == 'CloudMain') {
                                                    isMainLicence = true;
                                                } else if (option.ModuleName == 'Manufacturing') {
                                                    isManufacturingLicence = true;
                                                } else if (option.ModuleName == 'Payemnts') {
                                                    isPaymentsLicence = true;
                                                } else if (option.ModuleName == 'Bills') {
                                                    isPurchasesLicence = true;
                                                } else if (option.ModuleName == 'Reports Dashboard') {
                                                    isReportsLicence = true;
                                                } else if ((option.ModuleName == 'Quotes') || (option.ModuleName == 'Invoices')) {
                                                    isSalesLicence = true;
                                                } else if (option.ModuleName == 'CloudSettings') {
                                                    isSettingsLicence = true;
                                                } else if ((option.ModuleName == 'Shipping')) {
                                                    isShippingLicence = true;
                                                } else if (option.ModuleName == 'Stock Adjustments') {
                                                    isStockTakeLicence = true;
                                                } else if (option.ModuleName == 'Stock Adjustments') {
                                                    isStockTransferLicence = true;
                                                } else if ((option.ModuleName == 'Seed To Sale')) {
                                                    isSeedToSaleLicence = true;
                                                } else if (option.ModuleName == 'CloudBanking') {
                                                    isBankingLicence = true;
                                                } else if ((option.ModuleName == 'Payroll Integration')) {
                                                    isPayrollLicence = true;
                                                } else if ((option.ModuleName == 'Payroll Unlimited Employees')) {
                                                    isPayrollLicence = true;
                                                } else if ((option.ModuleName == 'Time Sheets')) {
                                                    isPayrollLicence = true;
                                                } else if ((option.ModuleName == 'Manufacturing')) {
                                                    isManufacturingLicence = true;
                                                } else if ((option.ModuleName == 'POS')) {
                                                    isPOSLicence = true;
                                                } else if ((option.ModuleName == 'WMS')) {
                                                    isWMSLicence = true;
                                                } else if ((option.ModuleName == 'Matrix')) {
                                                    isMatrixLicence = true;
                                                } else if ((option.ModuleName == 'Add Extra User')) {
                                                    isAddExtraUserLicence = true;
                                                } else if ((option.ModuleName == 'FX Currency')) {
                                                    isFxCurrencyLicence = true;
                                                } else if ((option.ModuleName == 'Use Foreign Currency')) {
                                                    isFxCurrencyLicence = true;
                                                } else if ((option.ModuleName == 'Link To TrueERP') || (option.ModuleName == 'Connect to Live ERP DB')) {
                                                    localStorage.setItem('isPurchasedTrueERPModule', true);
                                                    if (option.ModuleActive) {
                                                        isTrueERPConnection = option.ModuleActive || true;
                                                    } else {
                                                        isTrueERPConnection = false;
                                                    }
                                                } else if ((option.ModuleName == 'Appointment Scheduling')) {
                                                    isAppointmentSchedulingLicence = true;
                                                }

                                            });

                                            /* Remove licence */
                                            if (dataReturnRes.ProcessLog.ServerName !== "110.142.175.245") {
                                              isTrueERPConnection = true;
                                            }

                                            Session.setPersistent('CloudTrueERPModule', isTrueERPConnection);
                                            Session.setPersistent('CloudAccountsLicence', isAccountsLicence);
                                            Session.setPersistent('CloudContactsLicence', isContactsLicence);
                                            Session.setPersistent('CloudExpenseClaimsLicence', isExpenseClaimsLicence);
                                            Session.setPersistent('CloudPaymentsLicence', isPaymentsLicence);
                                            Session.setPersistent('CloudReportsLicence', isReportsLicence);
                                            Session.setPersistent('CloudSettingsLicence', isSettingsLicence);

                                            Session.setPersistent('CloudMainLicence', isMainLicence);
                                            Session.setPersistent('CloudDashboardLicence', isDashboardLicence);

                                            Session.setPersistent('CloudSeedToSaleLicence', isSeedToSaleLicence);
                                            Session.setPersistent('CloudBankingLicence', isBankingLicence);
                                            Session.setPersistent('CloudPayrollLicence', isPayrollLicence);

                                            Session.setPersistent('CloudFixedAssetsLicence', isFixedAssetsLicence);
                                            Session.setPersistent('CloudInventoryLicence', isInventoryLicence);
                                            Session.setPersistent('CloudManufacturingLicence', isManufacturingLicence);
                                            Session.setPersistent('CloudPurchasesLicence', isPurchasesLicence);
                                            Session.setPersistent('CloudSalesLicence', isSalesLicence);
                                            Session.setPersistent('CloudShippingLicence', isShippingLicence);
                                            Session.setPersistent('CloudStockTakeLicence', isStockTakeLicence);
                                            Session.setPersistent('CloudStockTransferLicence', isStockTransferLicence);

                                            Session.setPersistent('CloudAddExtraLicence', isAddExtraUserLicence);
                                            Session.setPersistent('CloudMatrixLicence', isMatrixLicence);
                                            Session.setPersistent('CloudPOSLicence', isPOSLicence);
                                            Session.setPersistent('CloudUseForeignLicence', isFxCurrencyLicence);
                                            Session.setPersistent('CloudWMSLicence', isWMSLicence);
                                            Session.setPersistent('CloudAppointmentSchedulingLicence', isAppointmentSchedulingLicence);
                                            /* End Remove licence */
                                            if (dataReturnRes.ProcessLog.ClientDetails == undefined) {
                                                myVS1Video.pause();
                                                $('.myVS1Video').css('display', 'none');
                                                $('.myVS1VideoLogin').css('display', 'none');
                                                swal({
                                                    title: 'Ooops...',
                                                    text: 'It seems we are unable to connect you to VS1Cloud at the moment. Please try again in a few minutes.',
                                                    type: 'error',
                                                    showCancelButton: false,
                                                    confirmButtonText: 'Try Again'
                                                }).then((result) => {
                                                    if (result.value) {
                                                        Meteor._reload.reload();
                                                    } else if (result.dismiss === 'cancel') {}
                                                });
                                                $('.fullScreenSpin').css('display', 'none');
                                                $('.loginSpinner').css('display', 'none');
                                                return false;
                                            }
                                            if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog == undefined) {
                                                myVS1Video.pause();
                                                $('.myVS1Video').css('display', 'none');
                                                $('.myVS1VideoLogin').css('display', 'none');
                                                swal('Sorry, You do not have access to any VS1 Modules!', '', 'error');
                                                $('.fullScreenSpin').css('display', 'none');
                                                $('.loginSpinner').css('display', 'none');
                                                return false;
                                            }
                                            if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser == undefined) {
                                                myVS1Video.pause();
                                                $('.myVS1Video').css('display', 'none');
                                                $('.myVS1VideoLogin').css('display', 'none');
                                                swal('Sorry, You do not have access to any VS1 Modules!', '', 'error');
                                                $('.fullScreenSpin').css('display', 'none');
                                                $('.loginSpinner').css('display', 'none');
                                                return false;

                                            };
                                            if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail == undefined) {
                                                myVS1Video.pause();
                                                $('.myVS1Video').css('display', 'none');
                                                $('.myVS1VideoLogin').css('display', 'none');
                                                swal('Sorry, You do not have access to any VS1 Modules!', '', 'error');
                                                $('.fullScreenSpin').css('display', 'none');
                                                $('.loginSpinner').css('display', 'none');
                                                return false;

                                            };

                                            if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.ResponseNo == 401) {
                                                swal('Sorry, You do not have access to any VS1 Modules!', '', 'error');
                                                myVS1Video.pause();
                                                $('.myVS1Video').css('display', 'none');
                                                $('.myVS1VideoLogin').css('display', 'none');
                                                $('.fullScreenSpin').css('display', 'none');
                                                $('.loginSpinner').css('display', 'none');
                                                return false;

                                            };

                                            dataReturnRes.ProcessLog.VS1AdminPassword = hashUserLoginPassword;
                                            dataReturnRes.ProcessLog.VS1UserName = userLoginEmail;
                                            Session.setPersistent('mycloudLogonUsername', ERPuserName);
                                            Session.setPersistent('mycloudLogonUserEmail', ERPuserName);

                                            localStorage.setItem('VS1FormAccessDetail', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.items)||'');

                                            Session.setPersistent('myerpPassword', userLoginPassword);
                                            Session.setPersistent('mySessionEmployee', ERPuserName);

                                            localStorage.setItem('EIPAddress', ERPIPAdderess);
                                            localStorage.setItem('EUserName', ERPuserName);
                                            localStorage.setItem('EPassword', ERPpassword);
                                            localStorage.setItem('EDatabase', ERPdbName);
                                            localStorage.setItem('EPort', ERPport);
                                            loggedUserEventFired = true;

                                            localStorage.setItem('mainEIPAddress', licenceIPAddress);
                                            localStorage.setItem('mainEPort', checkSSLPorts);

                                            if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields) {
                                                Session.setPersistent('vs1companyName', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_CompanyName || '');
                                                Session.setPersistent('vs1companyaddress1', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address || '');
                                                Session.setPersistent('vs1companyaddress2', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address2 || '');
                                                Session.setPersistent('vs1companyABN', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_ABN || '');
                                                Session.setPersistent('vs1companyPhone', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_PhoneNumber || '');
                                                Session.setPersistent('vs1companyURL', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_URL || '');

                                                Session.setPersistent('ERPDefaultDepartment', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultClass || '');
                                                Session.setPersistent('ERPDefaultUOM', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultUOM || '');

                                                Session.setPersistent('ERPCountryAbbr', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_ForeignExDefault || '');
                                                Session.setPersistent('ERPTaxCodePurchaseInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc || '');
                                                Session.setPersistent('ERPTaxCodeSalesInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc || '');

                                                localStorage.setItem('VS1OverDueInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_AMOUNT || Currency + '0');
                                                localStorage.setItem('VS1OverDueInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_QUANTITY || 0);
                                                localStorage.setItem('VS1OutstandingPayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_AMOUNT || Currency + '0');
                                                localStorage.setItem('VS1OutstandingPayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_QUANTITY || 0);

                                                localStorage.setItem('VS1OutstandingInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_AMOUNT || Currency + '0');
                                                localStorage.setItem('VS1OutstandingInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_QUANTITY || 0);
                                                localStorage.setItem('VS1OverDuePayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_AMOUNT || Currency + '0');
                                                localStorage.setItem('VS1OverDuePayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_QUANTITY || 0);

                                                localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');

                                                localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_NetIncomeEx || 0);
                                                localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalIncomeEx || 0);
                                                localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalExpenseEx || 0);
                                                localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalCOGSEx || 0);

                                                if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.ResponseNo == 401) {
                                                    localStorage.setItem('vs1LoggedEmployeeImages_dash', '');
                                                } else {
                                                    if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields) {
                                                        localStorage.setItem('vs1LoggedEmployeeImages_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields.EncodedPic || '');
                                                    } else {
                                                        localStorage.setItem('vs1LoggedEmployeeImages_dash', '');
                                                    }
                                                }
                                            } else {
                                                Session.setPersistent('vs1companyName', '');
                                                Session.setPersistent('vs1companyaddress1', '');
                                                Session.setPersistent('vs1companyaddress2', '');
                                                Session.setPersistent('vs1companyABN', '');
                                                Session.setPersistent('vs1companyPhone', '');
                                                Session.setPersistent('vs1companyURL', '');

                                                Session.setPersistent('ERPDefaultDepartment', '');
                                                Session.setPersistent('ERPDefaultUOM', '');

                                                Session.setPersistent('ERPTaxCodePurchaseInc', '');
                                                Session.setPersistent('ERPTaxCodeSalesInc', '');

                                                localStorage.setItem('VS1OverDueInvoiceAmt_dash', '');
                                                localStorage.setItem('VS1OverDueInvoiceQty_dash', '');
                                                localStorage.setItem('VS1OutstandingPayablesAmt_dash', '');
                                                localStorage.setItem('VS1OutstandingPayablesQty_dash', '');

                                                localStorage.setItem('VS1OutstandingInvoiceAmt_dash', '');
                                                localStorage.setItem('VS1OutstandingInvoiceQty_dash', '');
                                                localStorage.setItem('VS1OverDuePayablesAmt_dash', '');
                                                localStorage.setItem('VS1OverDuePayablesQty_dash', '');

                                                localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');

                                                localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', '');
                                                localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', '');
                                                localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', '');
                                                localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', '');
                                            }

                                            localStorage.setItem('VS1APReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_ap_report.items) || '');
                                            localStorage.setItem('VS1PNLPeriodReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_pnl_period.items) || '');
                                            localStorage.setItem('VS1SalesListReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_saleslist.items) || '');
                                            localStorage.setItem('VS1SalesEmpReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_salesperemployee.items) || '');

                                            Session.setPersistent('LoggedUserEventFired', true);
                                            Session.setPersistent('userlogged_status', 'active');

                                            var empusername = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
                                            var employeeUserLogon = ERPLoggeduserName;
                                            var employeeUserID = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeId;
                                            var employeename = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
                                            Session.setPersistent('mySessionEmployeeLoggedID', employeeUserID);
                                            localStorage.setItem('mySession', employeeUserLogon);
                                            var sessionDataToLog = localStorage.getItem('mySession');
                                            Session.setPersistent('mySessionEmployee', employeename);
                                            let userAccessOptions = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail || '';

                                            if (userAccessOptions != "") {
                                                addLoginData(dataReturnRes).then(function (datareturn) {
                                                    getAccessLevelData(userAccessOptions, isSameUserLogin);
                                                }).catch(function (err) {
                                                    getAccessLevelData(userAccessOptions, isSameUserLogin);
                                                });

                                            }

                                            //End Code Here
                                        } else {
                                            myVS1Video.pause();
                                            $('.myVS1Video').css('display', 'none');
                                            $('.myVS1VideoLogin').css('display', 'none');
                                            $('#emEmail').html(userLoginEmail);
                                            $('#emPassword').html(userLoginPassword.replace('%20', " ").replace('%21', '!').replace('%22', '"')
                                            .replace('%23', "#").replace('%24', "$").replace('%25', "%").replace('%26', "&").replace('%27', "'")
                                            .replace('%28', "(").replace('%29', ")").replace('%2A', "*").replace('%2B', "+")
                                            .replace('%2C', ",").replace('%2D', "-").replace('%2E', ".").replace('%2F', "/"));
                                            $(".addloginkey").attr("href", 'https://www.depot.vs1cloud.com/vs1activation/sandboxcheck.php?checktoken=' + userLoginEmail + '');
                                            $(".addloginActive").attr("href", 'https://www.depot.vs1cloud.com/vs1activation/sandboxcheck.php?checktoken=' + userLoginEmail + '');
                                            swal({
                                                title: 'Awaiting Email Validation',
                                                html: true,
                                                html: "This account has not been validated because the email address that it is linked to has not yet been validated.\n \n <br></br> We've sent an email containing a validation link to: <strong> " + dataReturnRes.ProcessLog.VS1AdminUserName + " </strong>",
                                                type: 'info',
                                                showCancelButton: false,
                                                confirmButtonText: 'Resend Validation Email',
                                                cancelButtonText: 'No'
                                            }).then((result) => {
                                                if (result.value) {
                                                    let mailBodyNew = $('.emailBody').html();
                                                    Meteor.call('sendEmail', {
                                                        from: "VS1 Cloud <info@vs1cloud.com>",
                                                        to: dataReturnRes.ProcessLog.VS1AdminUserName,
                                                        cc: 'info@vs1cloud.com',
                                                        subject: '[VS1 Cloud] - Email Validation',
                                                        text: '',
                                                        html: mailBodyNew,
                                                        attachments: ''

                                                    }, function (error, result) {
                                                        location.reload(true);
                                                    });
                                                } else if (result.dismiss === 'cancel') {
                                                    // FlowRouter.go('/employeescard?addvs1user=true');
                                                }
                                            });
                                            myVS1Video.pause();
                                            $('.myVS1Video').css('display', 'none');
                                            $('.myVS1VideoLogin').css('display', 'none');
                                            $('.fullScreenSpin').css('display', 'none');
                                            $('.loginSpinner').css('display', 'none');
                                            return false;
                                        }
                                    }
                                }

                                //End Code here


                            }

                        } else if (oReq.statusText == '') {
                            swal({
                                title: 'Oooops...',
                                text: "Connection Failed, Please try again",
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                            myVS1Video.pause();
                            $('.myVS1Video').css('display', 'none');
                            $('.myVS1VideoLogin').css('display', 'none');
                            $('.loginSpinner').css('display', 'none');
                            $('.fullScreenSpin').css('display', 'none');
                        } else if (oReq.readyState == 4 && oReq.status == 403) {
                            swal({
                                title: 'Ooops...',
                                text: 'It seems we are unable to connect you to VS1Cloud at the moment. Please try again in a few minutes.',
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                            myVS1Video.pause();
                            $('.myVS1Video').css('display', 'none');
                            $('.myVS1VideoLogin').css('display', 'none');
                            $('.loginSpinner').css('display', 'none');
                            $('.fullScreenSpin').css('display', 'none');
                        } else if (oReq.readyState == 4 && oReq.status == 406) {
                            swal({
                                title: 'Oooops...',
                                text: oReq.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                            myVS1Video.pause();
                            $('.myVS1Video').css('display', 'none');
                            $('.myVS1VideoLogin').css('display', 'none');
                            $('.loginSpinner').css('display', 'none');
                            $('.fullScreenSpin').css('display', 'none');
                        } else if (oReq.readyState == 4 && oReq.status == 500) {
                            var ErrorResponse = oReq.getResponseHeader('errormessage');
                            if (ErrorResponse.indexOf("Access violation") >= 0) {
                                swal({
                                    title: 'Your database is being created. ',
                                    text: "Please try again in 10 minutes",
                                    type: 'info',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {
                                        Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {}
                                });
                            } else {
                                swal({
                                    title: 'Oooops...',
                                    text: oReq.getResponseHeader('errormessage'),
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {
                                        Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {}
                                });
                            }
                            myVS1Video.pause();
                            $('.myVS1Video').css('display', 'none');
                            $('.myVS1VideoLogin').css('display', 'none');
                            $('.loginSpinner').css('display', 'none');
                            $('.fullScreenSpin').css('display', 'none');
                        } else if (oReq.readyState == 4 && oReq.status == 401) {
                            var ErrorResponse = oReq.getResponseHeader('errormessage');
                            if (ErrorResponse.indexOf("Could not connect to ERP") >= 0) {
                                swal({
                                    title: 'Oooops...',
                                    text: "Could not connect to Database. Unable to start Database. Licence on hold ",
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {
                                        Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {}
                                });
                            } else {
                                swal({
                                    title: 'Oooops...',
                                    text: oReq.getResponseHeader('errormessage'),
                                    type: 'error',
                                    showCancelButton: false,
                                    confirmButtonText: 'Try Again'
                                }).then((result) => {
                                    if (result.value) {
                                        Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {}
                                });
                            }
                            myVS1Video.pause();
                            $('.myVS1Video').css('display', 'none');
                            $('.myVS1VideoLogin').css('display', 'none');
                            $('.loginSpinner').css('display', 'none');
                            $('.fullScreenSpin').css('display', 'none');
                        } else {}
                    }
                }

            }).catch(function (err) {
                $('.myVS1Video').css('display', 'inline-block');
                //$('.fullScreenSpin').css('display','inline-block');
                myVS1Video.currentTime = 0;
                myVS1Video.play();
                var serverTest = URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/erpapi/Vs1_Logon?Vs1UserName="' + userLoginEmail + '"&vs1Password="' + userLoginPassword + '"';

                var oReq = new XMLHttpRequest();
                oReq.open("GET", serverTest, true);
                oReq.setRequestHeader("database", vs1loggedDatatbase);
                oReq.setRequestHeader("username", "VS1_Cloud_Admin");
                oReq.setRequestHeader("password", "DptfGw83mFl1j&9");
                oReq.send();

                oReq.onreadystatechange = function () {

                    if (oReq.readyState == 4 && oReq.status == 200) {
                        Session.setPersistent('mainEIPAddress', licenceIPAddress);
                        Session.setPersistent('mainEPort', checkSSLPorts);

                        var dataReturnRes = JSON.parse(oReq.responseText);

                        if (dataReturnRes.ProcessLog.ResponseStatus != "OK") {
                            myVS1Video.pause();
                            $('.myVS1Video').css('display', 'none');
                            $('.myVS1VideoLogin').css('display', 'none');
                            if (dataReturnRes.ProcessLog.ResponseStatus == "Payment is Due") {
                                myVS1Video.pause();
                                $('.myVS1Video').css('display', 'none');
                                $('.myVS1VideoLogin').css('display', 'none');
                                $('.loginSpinner').css('display', 'none');
                                $('.fullScreenSpin').css('display', 'none');

                                swal({
                                    title: 'Your payment has been declined please update your payment subscription information!',
                                    text: '',
                                    type: 'error',
                                    showCancelButton: true,
                                    confirmButtonText: 'Update Payment',
                                    cancelButtonText: 'Cancel'
                                }).then((result) => {
                                    if (result.value) {
                                        //window.open('https://www.payments.vs1cloud.com/customer/account/login/referer/aHR0cHM6Ly93d3cucGF5bWVudHMudnMxY2xvdWQuY29tLw%2C%2C?urppassname='+dataReturnRes.ProcessLog.VS1AdminUserName+'&urlpasstoken='+userLoginPassword+'', '_blank');
                                        window.open('/subscriptionSettings?urppassname=' + dataReturnRes.ProcessLog.VS1AdminUserName, '_blank');
                                        Session.setPersistent('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                    } else if (result.dismiss === 'cancel') {}
                                });

                            } else {
                                swal(dataReturnRes.ProcessLog.ResponseStatus, dataReturnRes.ProcessLog.ResponseStatus, 'error');
                                myVS1Video.pause();
                                $('.myVS1Video').css('display', 'none');
                                $('.myVS1VideoLogin').css('display', 'none');
                                $('.loginSpinner').css('display', 'none');
                                $('.fullScreenSpin').css('display', 'none');
                            }

                        } else {
                            //Code Here

                            var oReqCheckActive = new XMLHttpRequest();
                            oReqCheckActive.open("GET", URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/' + 'erpapi/TVS1_Clients_Simple?PropertyList="ID,EmailVarified"&select=[Databasename]="' + dataReturnRes.ProcessLog.Databasename + '"', true);
                            oReqCheckActive.setRequestHeader("database", vs1loggedDatatbase);
                            oReqCheckActive.setRequestHeader("username", 'VS1_Cloud_Admin');
                            oReqCheckActive.setRequestHeader("password", 'DptfGw83mFl1j&9');
                            oReqCheckActive.send();
                            oReqCheckActive.onreadystatechange = function () {
                                if (oReqCheckActive.readyState == 4 && oReqCheckActive.status == 200) {
                                    var dataDBActive = JSON.parse(oReqCheckActive.responseText);

                                    if (dataDBActive.tvs1_clients_simple[0].EmailVarified) {

                                        //Code Here
                                        Meteor.call('readMethod', dataReturnRes.ProcessLog.VS1AdminUserName, function (error, result) {
                                            if (error) {}
                                            else {
                                                let regUserDetails = result;
                                                if (regUserDetails) {
                                                    if (regUserDetails.length === 0) {}

                                                    Session.setPersistent('mycloudLogonDBID', regUserDetails.clouddatabaseID);
                                                    Session.setPersistent('mycloudLogonID', regUserDetails._id);

                                                }
                                            }

                                        });

                                        localStorage.setItem('vs1cloudLoginInfo', dataReturnRes);
                                        localStorage.setItem('vs1cloudlicenselevel', dataReturnRes.ProcessLog.LicenseLevel);
                                        if (!localStorage.getItem('VS1loggedDatabase')) {
                                            localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.Databasename);
                                            localStorage.setItem('VS11099Contractor_Report', '');
                                            localStorage.setItem('VS1AgedPayables_Report', '');
                                            localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                                            localStorage.setItem('VS1AgedReceivables_Report', '');
                                            localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                                            localStorage.setItem('VS1BalanceSheet_Report', '');
                                            localStorage.setItem('VS1BalanceTrans_Report', '');
                                            localStorage.setItem('VS1GeneralLedger_Report', '');
                                            localStorage.setItem('VS1ProfitandLoss_Report', '');
                                            localStorage.setItem('VS1Purchase_List', '');
                                            localStorage.setItem('VS1Purchase_Report', '');
                                            localStorage.setItem('VS1PurchaseSummary_Report', '');
                                            localStorage.setItem('VS1ProductSales_List', '');
                                            localStorage.setItem('VS1ProductSales_Report', '');
                                            localStorage.setItem('VS1Sales_List', '');
                                            localStorage.setItem('VS1Sales_Report', '');
                                            localStorage.setItem('VS1SalesSummary_Report', '');
                                            localStorage.setItem('VS1TaxSummary_Report', '');
                                            localStorage.setItem('VS1TrialBalance_Report', '');
                                            localStorage.setItem('VS1PrintStatements_Report', '');
                                            Session.setPersistent('bankaccountid', '');

                                            localStorage.setItem('VS1ProductList', '');
                                            localStorage.setItem('VS1CustomerList', '');
                                            localStorage.setItem('VS1SupplierList', '');
                                            localStorage.setItem('VS1AccountList', '');
                                            localStorage.setItem('VS1TaxCodeList', '');
                                            localStorage.setItem('VS1TermsList', '');
                                            localStorage.setItem('VS1DepartmentList', '');
                                            localStorage.setItem('VS1CurrencyList', '');
                                            localStorage.setItem('VS1LeadStatusList', '');
                                            localStorage.setItem('VS1ShippingMethodList', '');
                                            localStorage.setItem('VS1AccountTypeList', '');
                                            localStorage.setItem('VS1ERPCombinedContactsList', '');
                                            localStorage.setItem('VS1EmployeeList', '');
                                            localStorage.setItem('VS1JournalEntryLineList', '');
                                            localStorage.setItem('VS1BankAccountReportList', '');
                                            localStorage.setItem('VS1TInvoiceList', '');
                                            localStorage.setItem('VS1TInvoiceNonBackOrderList', '');
                                            localStorage.setItem('VS1BackOrderSalesListList', '');
                                            localStorage.setItem('VS1TPurchaseOrderList', '');
                                            localStorage.setItem('VS1TReconcilationList', '');
                                            localStorage.setItem('VS1TChequeList', '');
                                            localStorage.setItem('VS1TProductStocknSalePeriodReport', '');
                                            localStorage.setItem('VS1TAppUserList', '');
                                            localStorage.setItem('VS1TJobVS1List', '');
                                            localStorage.setItem('VS1TStockAdjustEntryList', '');
                                            localStorage.setItem('VS1TsalesOrderNonBackOrderList', '');
                                            localStorage.setItem('VS1TbillReport', '');
                                            localStorage.setItem('VS1TbillReport', '');
                                            localStorage.setItem('VS1TCreditList', '');
                                            localStorage.setItem('VS1TpurchaseOrderNonBackOrderList', '');
                                            localStorage.setItem('VS1TpurchaseOrderBackOrderList', '');
                                            localStorage.setItem('VS1TSalesList', '');
                                        } else {
                                            if ((localStorage.getItem('VS1loggedDatabase')) == (dataReturnRes.ProcessLog.Databasename)) {
                                                isSameUserLogin = true;
                                            } else {
                                                localStorage.setItem('VS1loggedDatabase', dataReturnRes.ProcessLog.Databasename);
                                                localStorage.setItem('VS11099Contractor_Report', '');
                                                localStorage.setItem('VS1AgedPayables_Report', '');
                                                localStorage.setItem('VS1AgedPayablesSummary_Report', '');
                                                localStorage.setItem('VS1AgedReceivables_Report', '');
                                                localStorage.setItem('VS1AgedReceivableSummary_Report', '');
                                                localStorage.setItem('VS1BalanceSheet_Report', '');
                                                localStorage.setItem('VS1BalanceTrans_Report', '');
                                                localStorage.setItem('VS1GeneralLedger_Report', '');
                                                localStorage.setItem('VS1ProfitandLoss_Report', '');
                                                localStorage.setItem('VS1Purchase_List', '');
                                                localStorage.setItem('VS1Purchase_Report', '');
                                                localStorage.setItem('VS1PurchaseSummary_Report', '');
                                                localStorage.setItem('VS1ProductSales_List', '');
                                                localStorage.setItem('VS1ProductSales_Report', '');
                                                localStorage.setItem('VS1Sales_List', '');
                                                localStorage.setItem('VS1Sales_Report', '');
                                                localStorage.setItem('VS1SalesSummary_Report', '');
                                                localStorage.setItem('VS1TaxSummary_Report', '');
                                                localStorage.setItem('VS1TrialBalance_Report', '');
                                                localStorage.setItem('VS1PrintStatements_Report', '');

                                                localStorage.setItem('VS1AccoountList', '');
                                                Session.setPersistent('bankaccountid', '');
                                            }
                                        }

                                        Session.setPersistent('ERPCurrency', dataReturnRes.ProcessLog.TRegionalOptions.CurrencySymbol);

                                        var region = dataReturnRes.ProcessLog.RegionName;
                                        Session.setPersistent('ERPLoggedCountry', region);

                                        if (dataReturnRes.ProcessLog.RegionName === "Australia") {
                                            Session.setPersistent('ERPCountryAbbr', 'AUD');
                                        } else if (dataReturnRes.ProcessLog.RegionName === "Canada") {
                                            Session.setPersistent('ERPCountryAbbr', 'CAD');
                                        } else if (dataReturnRes.ProcessLog.RegionName === "Colombia") {
                                            Session.setPersistent('ERPCountryAbbr', 'COP');
                                        } else if (dataReturnRes.ProcessLog.RegionName === "Kuwait") {
                                            Session.setPersistent('ERPCountryAbbr', 'KYD');
                                        } else if (dataReturnRes.ProcessLog.RegionName === "Mexico") {
                                            Session.setPersistent('ERPCountryAbbr', 'MXN');
                                        } else if (dataReturnRes.ProcessLog.RegionName === "New Zealand") {
                                            Session.setPersistent('ERPCountryAbbr', 'NZD');
                                        } else if (dataReturnRes.ProcessLog.RegionName === "Qatar") {
                                            Session.setPersistent('ERPCountryAbbr', 'QAR');
                                        } else if (dataReturnRes.ProcessLog.RegionName === "Kingdom of Saudi Arabia") {
                                            Session.setPersistent('ERPCountryAbbr', 'SAR');
                                        } else if (dataReturnRes.ProcessLog.RegionName === "Singapore") {
                                            Session.setPersistent('ERPCountryAbbr', 'SGD');
                                        } else if (dataReturnRes.ProcessLog.RegionName === "South Africa") {
                                            Session.setPersistent('ERPCountryAbbr', 'ZAR');
                                        } else if (dataReturnRes.ProcessLog.RegionName === "United Arab Emirates") {
                                            Session.setPersistent('ERPCountryAbbr', 'AED');
                                        } else if (dataReturnRes.ProcessLog.RegionName === "United Kingdom") {
                                            Session.setPersistent('ERPCountryAbbr', 'GBP');
                                        } else if (dataReturnRes.ProcessLog.RegionName === "United States of America") {
                                            Session.setPersistent('ERPCountryAbbr', 'USD');
                                        }
                                        Session.setPersistent('ERPDefaultDepartment', 'Default');
                                        Session.setPersistent('ERPDefaultUOM', '');
                                        Session.setPersistent('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                        localStorage.setItem('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);
                                        dataReturnRes.ProcessLog.VS1AdminPassword = hashUserLoginPassword;
                                        dataReturnRes.ProcessLog.VS1UserName = userLoginEmail;
                                        var ERPIPAdderess = "";
                                        if (dataReturnRes.ProcessLog.ServerName == "110.142.175.245") {
                                            ERPIPAdderess = ERPDatabaseIPAdderess;
                                        } else if (dataReturnRes.ProcessLog.ServerName == "59.154.69.210") {
                                            ERPIPAdderess = "gardenscapes.vs1cloud.com";
                                        }else if (dataReturnRes.ProcessLog.ServerName == "144.130.174.170") {
                                            ERPIPAdderess = "steelmains.vs1cloud.com";
                                        }else if (dataReturnRes.ProcessLog.ServerName == "144.130.174.162") {
                                            ERPIPAdderess = "steelmains14403.vs1cloud.com";
                                        }else if (dataReturnRes.ProcessLog.ServerName == "156.155.97.183") {
                                            ERPIPAdderess = "vs1dev5.vs1cloud.com";
                                        }else if (dataReturnRes.ProcessLog.ServerName == "120.151.35.249") {
                                            ERPIPAdderess = "rappaustralia.vs1cloud.com";
                                        }else if (dataReturnRes.ProcessLog.ServerName == "165.228.147.127") {
                                            ERPIPAdderess = "vs1connection.vs1cloud.com";
                                        }else {
                                            ERPIPAdderess = dataReturnRes.ProcessLog.ServerName;
                                        }
                                        var ERPdbName = dataReturnRes.ProcessLog.Databasename;

                                        var ERPport = dataReturnRes.ProcessLog.APIPort;

                                        Session.setPersistent('mycloudLogonUserEmail', userLoginEmail);

                                        var ERPuserName = userLoginEmail;
                                        var ERPLoggeduserName = userLoginEmail;
                                        var ERPpassword = userLoginPassword.replace('%20', " ").replace('%21', '!').replace('%22', '"')
                                    .replace('%23', "#").replace('%24', "$").replace('%25', "%").replace('%26', "&").replace('%27', "'")
                                    .replace('%28', "(").replace('%29', ")").replace('%2A', "*").replace('%2B', "+")
                                    .replace('%2C', ",").replace('%2D', "-").replace('%2E', ".").replace('%2F', "/") || '';

                                        let erpdbname = ERPIPAdderess + ',' + ERPdbName + ',' + ERPuserName + ',' + ERPpassword + ',' + ERPport;
                                        let licenceOptions = dataReturnRes.ProcessLog.Modules.Modules;
                                        $.each(licenceOptions, function (item, option) {

                                            if ((option.ModuleName == 'Accounts Payable Reports') || (option.ModuleName == 'Accounts Receivable Report')) {
                                                isAccountsLicence = true;
                                            } else if (option.ModuleName == 'Statements') {
                                                isContactsLicence = true;
                                            } else if ((option.ModuleName == 'Expense Claims / Receipt Claiming')) {
                                                isExpenseClaimsLicence = true;
                                            } else if (option.ModuleName == 'CloudDashboard') {
                                                isDashboardLicence = true;
                                            } else if (option.ModuleName == 'CloudFixedAssets') {
                                                isFixedAssetsLicence = true;
                                            } else if (option.ModuleName == 'Inventory Tracking') {
                                                isInventoryLicence = true;
                                            } else if (option.ModuleName == 'CloudMain') {
                                                isMainLicence = true;
                                            } else if (option.ModuleName == 'Manufacturing') {
                                                isManufacturingLicence = true;
                                            } else if (option.ModuleName == 'Payemnts') {
                                                isPaymentsLicence = true;
                                            } else if (option.ModuleName == 'Bills') {
                                                isPurchasesLicence = true;
                                            } else if (option.ModuleName == 'Reports Dashboard') {
                                                isReportsLicence = true;
                                            } else if ((option.ModuleName == 'Quotes') || (option.ModuleName == 'Invoices')) {
                                                isSalesLicence = true;
                                            } else if (option.ModuleName == 'CloudSettings') {
                                                isSettingsLicence = true;
                                            } else if ((option.ModuleName == 'Shipping')) {
                                                isShippingLicence = true;
                                            } else if (option.ModuleName == 'Stock Adjustments') {
                                                isStockTakeLicence = true;
                                            } else if (option.ModuleName == 'Stock Adjustments') {
                                                isStockTransferLicence = true;
                                            } else if ((option.ModuleName == 'Seed To Sale')) {
                                                isSeedToSaleLicence = true;
                                            } else if (option.ModuleName == 'CloudBanking') {
                                                isBankingLicence = true;
                                            } else if ((option.ModuleName == 'Payroll Integration')) {
                                                isPayrollLicence = true;
                                            } else if ((option.ModuleName == 'Payroll Unlimited Employees')) {
                                                isPayrollLicence = true;
                                            } else if ((option.ModuleName == 'Time Sheets')) {
                                                isPayrollLicence = true;
                                            } else if ((option.ModuleName == 'Manufacturing')) {
                                                isManufacturingLicence = true;
                                            } else if ((option.ModuleName == 'POS')) {
                                                isPOSLicence = true;
                                            } else if ((option.ModuleName == 'WMS')) {
                                                isWMSLicence = true;
                                            } else if ((option.ModuleName == 'Matrix')) {
                                                isMatrixLicence = true;
                                            } else if ((option.ModuleName == 'Add Extra User')) {
                                                isAddExtraUserLicence = true;
                                            } else if ((option.ModuleName == 'FX Currency')) {
                                                isFxCurrencyLicence = true;
                                            } else if ((option.ModuleName == 'Use Foreign Currency')) {
                                                isFxCurrencyLicence = true;
                                            } else if ((option.ModuleName == 'Link To TrueERP') || (option.ModuleName == 'Connect to Live ERP DB')) {
                                                localStorage.setItem('isPurchasedTrueERPModule', true);
                                                if (option.ModuleActive) {
                                                    isTrueERPConnection = option.ModuleActive || true;
                                                } else {
                                                    isTrueERPConnection = false;
                                                }
                                            } else if ((option.ModuleName == 'Appointment Scheduling')) {
                                                isAppointmentSchedulingLicence = true;
                                            }

                                        });

                                        /* Remove licence */
                                        if (dataReturnRes.ProcessLog.ServerName !== "110.142.175.245") {
                                          isTrueERPConnection = true;
                                        }
                                        Session.setPersistent('CloudTrueERPModule', isTrueERPConnection);
                                        Session.setPersistent('CloudAccountsLicence', isAccountsLicence);
                                        Session.setPersistent('CloudContactsLicence', isContactsLicence);
                                        Session.setPersistent('CloudExpenseClaimsLicence', isExpenseClaimsLicence);
                                        Session.setPersistent('CloudPaymentsLicence', isPaymentsLicence);
                                        Session.setPersistent('CloudReportsLicence', isReportsLicence);
                                        Session.setPersistent('CloudSettingsLicence', isSettingsLicence);

                                        Session.setPersistent('CloudMainLicence', isMainLicence);
                                        Session.setPersistent('CloudDashboardLicence', isDashboardLicence);

                                        Session.setPersistent('CloudSeedToSaleLicence', isSeedToSaleLicence);
                                        Session.setPersistent('CloudBankingLicence', isBankingLicence);
                                        Session.setPersistent('CloudPayrollLicence', isPayrollLicence);

                                        Session.setPersistent('CloudFixedAssetsLicence', isFixedAssetsLicence);
                                        Session.setPersistent('CloudInventoryLicence', isInventoryLicence);
                                        Session.setPersistent('CloudManufacturingLicence', isManufacturingLicence);
                                        Session.setPersistent('CloudPurchasesLicence', isPurchasesLicence);
                                        Session.setPersistent('CloudSalesLicence', isSalesLicence);
                                        Session.setPersistent('CloudShippingLicence', isShippingLicence);
                                        Session.setPersistent('CloudStockTakeLicence', isStockTakeLicence);
                                        Session.setPersistent('CloudStockTransferLicence', isStockTransferLicence);

                                        Session.setPersistent('CloudAddExtraLicence', isAddExtraUserLicence);
                                        Session.setPersistent('CloudMatrixLicence', isMatrixLicence);
                                        Session.setPersistent('CloudPOSLicence', isPOSLicence);
                                        Session.setPersistent('CloudUseForeignLicence', isFxCurrencyLicence);
                                        Session.setPersistent('CloudWMSLicence', isWMSLicence);
                                        Session.setPersistent('CloudAppointmentSchedulingLicence', isAppointmentSchedulingLicence);
                                        /* End Remove licence */

                                        if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail == undefined) {
                                            swal('Sorry, You do not have access to any VS1 Modules!', '', 'error');
                                            myVS1Video.pause();
                                            $('.myVS1Video').css('display', 'none');
                                            $('.myVS1VideoLogin').css('display', 'none');
                                            $('.fullScreenSpin').css('display', 'none');
                                            $('.loginSpinner').css('display', 'none');
                                            return false;

                                        };

                                        if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.ResponseNo == 401) {
                                            swal('Sorry, You do not have access to any VS1 Modules!', '', 'error');
                                            myVS1Video.pause();
                                            $('.myVS1Video').css('display', 'none');
                                            $('.myVS1VideoLogin').css('display', 'none');
                                            $('.fullScreenSpin').css('display', 'none');
                                            $('.loginSpinner').css('display', 'none');
                                            return false;

                                        };

                                        dataReturnRes.ProcessLog.VS1AdminPassword = hashUserLoginPassword;
                                        dataReturnRes.ProcessLog.VS1UserName = userLoginEmail;
                                        Session.setPersistent('mycloudLogonUsername', ERPuserName);
                                        Session.setPersistent('mycloudLogonUserEmail', ERPuserName);

                                        localStorage.setItem('VS1FormAccessDetail', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail.items)||'');

                                        Session.setPersistent('myerpPassword', userLoginPassword);
                                        Session.setPersistent('mySessionEmployee', ERPuserName);

                                        localStorage.setItem('EIPAddress', ERPIPAdderess);
                                        localStorage.setItem('EUserName', ERPuserName);
                                        localStorage.setItem('EPassword', ERPpassword);
                                        localStorage.setItem('EDatabase', ERPdbName);
                                        localStorage.setItem('EPort', ERPport);
                                        loggedUserEventFired = true;

                                        localStorage.setItem('mainEIPAddress', licenceIPAddress);
                                        localStorage.setItem('mainEPort', checkSSLPorts);

                                        if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields) {
                                            Session.setPersistent('vs1companyName', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_CompanyName || '');
                                            Session.setPersistent('vs1companyaddress1', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address || '');
                                            Session.setPersistent('vs1companyaddress2', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address2 || '');
                                            Session.setPersistent('vs1companyABN', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_ABN || '');
                                            Session.setPersistent('vs1companyPhone', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_PhoneNumber || '');
                                            Session.setPersistent('vs1companyURL', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_URL || '');

                                            Session.setPersistent('ERPDefaultDepartment', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultClass || '');
                                            Session.setPersistent('ERPDefaultUOM', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultUOM || '');

                                            Session.setPersistent('ERPCountryAbbr', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_ForeignExDefault || '');
                                            Session.setPersistent('ERPTaxCodePurchaseInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc || '');
                                            Session.setPersistent('ERPTaxCodeSalesInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc || '');

                                            localStorage.setItem('VS1OverDueInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_AMOUNT || Currency + '0');
                                            localStorage.setItem('VS1OverDueInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_QUANTITY || 0);
                                            localStorage.setItem('VS1OutstandingPayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_AMOUNT || Currency + '0');
                                            localStorage.setItem('VS1OutstandingPayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_QUANTITY || 0);

                                            localStorage.setItem('VS1OutstandingInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_AMOUNT || Currency + '0');
                                            localStorage.setItem('VS1OutstandingInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_INVOICES_QUANTITY || 0);
                                            localStorage.setItem('VS1OverDuePayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_AMOUNT || Currency + '0');
                                            localStorage.setItem('VS1OverDuePayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_PAYABLES_QUANTITY || 0);

                                            localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');

                                            localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_NetIncomeEx || 0);
                                            localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalIncomeEx || 0);
                                            localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalExpenseEx || 0);
                                            localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalCOGSEx || 0);

                                            if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.ResponseNo == 401) {
                                                localStorage.setItem('vs1LoggedEmployeeImages_dash', '');
                                            } else {
                                                if (dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields) {
                                                    localStorage.setItem('vs1LoggedEmployeeImages_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields.EncodedPic || '');
                                                } else {
                                                    localStorage.setItem('vs1LoggedEmployeeImages_dash', '');
                                                }
                                            }
                                        } else {
                                            Session.setPersistent('vs1companyName', '');
                                            Session.setPersistent('vs1companyaddress1', '');
                                            Session.setPersistent('vs1companyaddress2', '');
                                            Session.setPersistent('vs1companyABN', '');
                                            Session.setPersistent('vs1companyPhone', '');
                                            Session.setPersistent('vs1companyURL', '');

                                            Session.setPersistent('ERPDefaultDepartment', '');
                                            Session.setPersistent('ERPDefaultUOM', '');

                                            Session.setPersistent('ERPTaxCodePurchaseInc', '');
                                            Session.setPersistent('ERPTaxCodeSalesInc', '');

                                            localStorage.setItem('VS1OverDueInvoiceAmt_dash', '');
                                            localStorage.setItem('VS1OverDueInvoiceQty_dash', '');
                                            localStorage.setItem('VS1OutstandingPayablesAmt_dash', '');
                                            localStorage.setItem('VS1OutstandingPayablesQty_dash', '');

                                            localStorage.setItem('VS1OutstandingInvoiceAmt_dash', '');
                                            localStorage.setItem('VS1OutstandingInvoiceQty_dash', '');
                                            localStorage.setItem('VS1OverDuePayablesAmt_dash', '');
                                            localStorage.setItem('VS1OverDuePayablesQty_dash', '');



                                            localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');

                                            localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', '');
                                            localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', '');
                                            localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', '');
                                            localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', '');
                                        }

                                        localStorage.setItem('VS1APReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_ap_report.items) || '');
                                        localStorage.setItem('VS1PNLPeriodReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_pnl_period.items) || '');
                                        localStorage.setItem('VS1SalesListReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_saleslist.items) || '');
                                        localStorage.setItem('VS1SalesEmpReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_salesperemployee.items) || '');

                                        Session.setPersistent('LoggedUserEventFired', true);
                                        Session.setPersistent('userlogged_status', 'active');

                                        var empusername = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
                                        var employeeUserLogon = ERPLoggeduserName;
                                        var employeeUserID = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeId;
                                        var employeename = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
                                        Session.setPersistent('mySessionEmployeeLoggedID', employeeUserID);
                                        localStorage.setItem('mySession', employeeUserLogon);
                                        var sessionDataToLog = localStorage.getItem('mySession');
                                        Session.setPersistent('mySessionEmployee', employeename);
                                        let userAccessOptions = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail || '';

                                        if (userAccessOptions != "") {
                                            addLoginData(dataReturnRes).then(function (datareturn) {
                                                getAccessLevelData(userAccessOptions, isSameUserLogin);
                                            }).catch(function (err) {
                                                getAccessLevelData(userAccessOptions, isSameUserLogin);
                                            });

                                        }

                                        //End Code Here
                                    } else {
                                        myVS1Video.pause();
                                        $('.myVS1Video').css('display', 'none');
                                        $('.myVS1VideoLogin').css('display', 'none');
                                        $('#emEmail').html(userLoginEmail);
                                        $('#emPassword').html(userLoginPassword.replace('%20', " ").replace('%21', '!').replace('%22', '"')
                                        .replace('%23', "#").replace('%24', "$").replace('%25', "%").replace('%26', "&").replace('%27', "'")
                                        .replace('%28', "(").replace('%29', ")").replace('%2A', "*").replace('%2B', "+")
                                        .replace('%2C', ",").replace('%2D', "-").replace('%2E', ".").replace('%2F', "/"));
                                        $(".addloginkey").attr("href", 'https://www.depot.vs1cloud.com/vs1activation/sandboxcheck.php?checktoken=' + userLoginEmail + '');
                                        $(".addloginActive").attr("href", 'https://www.depot.vs1cloud.com/vs1activation/sandboxcheck.php?checktoken=' + userLoginEmail + '');
                                        swal({
                                            title: 'Awaiting Email Validation',
                                            html: true,
                                            html: "This account has not been validated because the email address that it is linked to has not yet been validated.\n \n <br></br> We've sent an email containing a validation link to: <strong> " + dataReturnRes.ProcessLog.VS1AdminUserName + " </strong>",
                                            type: 'info',
                                            showCancelButton: false,
                                            confirmButtonText: 'Resend Validation Email',
                                            cancelButtonText: 'No'
                                        }).then((result) => {
                                            if (result.value) {
                                                let mailBodyNew = $('.emailBody').html();
                                                Meteor.call('sendEmail', {
                                                    from: "VS1 Cloud <info@vs1cloud.com>",
                                                    to: dataReturnRes.ProcessLog.VS1AdminUserName,
                                                    cc: 'info@vs1cloud.com',
                                                    subject: '[VS1 Cloud] - Email Validation',
                                                    text: '',
                                                    html: mailBodyNew,
                                                    attachments: ''

                                                }, function (error, result) {
                                                    location.reload(true);
                                                });
                                            } else if (result.dismiss === 'cancel') {
                                                // FlowRouter.go('/employeescard?addvs1user=true');
                                            }
                                        });
                                        myVS1Video.pause();
                                        $('.myVS1Video').css('display', 'none');
                                        $('.myVS1VideoLogin').css('display', 'none');
                                        $('.fullScreenSpin').css('display', 'none');
                                        $('.loginSpinner').css('display', 'none');
                                        return false;
                                    }
                                }
                            }

                            //End Code here


                        }

                    } else if (oReq.statusText == '') {
                        swal({
                            title: 'Oooops...',
                            text: "Connection Failed, Please try again",
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        myVS1Video.pause();
                        $('.myVS1Video').css('display', 'none');
                        $('.myVS1VideoLogin').css('display', 'none');
                        $('.loginSpinner').css('display', 'none');
                        $('.fullScreenSpin').css('display', 'none');
                    } else if (oReq.readyState == 4 && oReq.status == 403) {
                        swal({
                            title: 'Ooops...',
                            text: 'It seems we are unable to connect you to VS1Cloud at the moment. Please try again in a few minutes.',
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        myVS1Video.pause();
                        $('.myVS1Video').css('display', 'none');
                        $('.myVS1VideoLogin').css('display', 'none');
                        $('.loginSpinner').css('display', 'none');
                        $('.fullScreenSpin').css('display', 'none');
                    } else if (oReq.readyState == 4 && oReq.status == 406) {
                        swal({
                            title: 'Oooops...',
                            text: oReq.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                                Meteor._reload.reload();
                            } else if (result.dismiss === 'cancel') {}
                        });
                        myVS1Video.pause();
                        $('.myVS1Video').css('display', 'none');
                        $('.myVS1VideoLogin').css('display', 'none');
                        $('.loginSpinner').css('display', 'none');
                        $('.fullScreenSpin').css('display', 'none');
                    } else if (oReq.readyState == 4 && oReq.status == 500) {
                        var ErrorResponse = oReq.getResponseHeader('errormessage');
                        if (ErrorResponse.indexOf("Access violation") >= 0) {
                            swal({
                                title: 'Your database is being created. ',
                                text: "Please try again in 10 minutes",
                                type: 'info',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                        } else {
                            swal({
                                title: 'Oooops...',
                                text: oReq.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                        }
                        myVS1Video.pause();
                        $('.myVS1Video').css('display', 'none');
                        $('.myVS1VideoLogin').css('display', 'none');
                        $('.loginSpinner').css('display', 'none');
                        $('.fullScreenSpin').css('display', 'none');
                    } else if (oReq.readyState == 4 && oReq.status == 401) {
                        var ErrorResponse = oReq.getResponseHeader('errormessage');
                        if (ErrorResponse.indexOf("Could not connect to ERP") >= 0) {
                            swal({
                                title: 'Oooops...',
                                text: "Could not connect to Database. Unable to start Database. Licence on hold ",
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                        } else {
                            swal({
                                title: 'Oooops...',
                                text: oReq.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {}
                            });
                        }
                        myVS1Video.pause();
                        $('.myVS1Video').css('display', 'none');
                        $('.myVS1VideoLogin').css('display', 'none');
                        $('.loginSpinner').css('display', 'none');
                        $('.fullScreenSpin').css('display', 'none');
                    } else {}
                }

            });

        }
        e.preventDefault();
    });
    $("#erppassword").keyup(function (e) {
        if (e.keyCode == 13) {
            $("#erplogin-button").trigger("click");
        }
    });

    $("#signmeout").click(function (e) {
        e.preventDefault();
        $('.fullScreenSpin').css('display', 'inline-block');
        var passwordSecret = $("#erppassword").val()||'';
        let userLoginEmail = $("#email").val()||'';
        // $('.myVS1Video').css('display','inline-block');
        let getLasTDatabase = localStorage.getItem('vs1Db');
        if (getLasTDatabase) {

            window.indexedDB.databases().then((r) => {
                for (var i = 0; i < r.length; i++) {
                    window.indexedDB.deleteDatabase(r[i].name);
                }
                clearCaches();

            }).then(() => {
                swal({
                    title: 'You are now Signed Out of all devices',
                    text: "",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.value) {
                        location.reload(true);
                    }
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
          window.indexedDB.databases().then((r) => {
              for (var i = 0; i < r.length; i++) {
                  window.indexedDB.deleteDatabase(r[i].name);
              }
              clearCaches();
          }).then(() => {
              swal({
                  title: 'You are now Signed Out of all devices',
                  text: "",
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'OK'
              }).then((result) => {
                  if (result.value) {
                      location.reload(true);
                  }
              });
              $('.fullScreenSpin').css('display', 'none');
          });
            $('.fullScreenSpin').css('display', 'none');
        }
        if(userLoginEmail != ''){
        FlowRouter.go('/?emailakey='+userLoginEmail+'&passkey='+passwordSecret+'');
        }


        // let userLoginEmail = $("#email").val();
        // if(userLoginEmail === '') {
        //   let getLasTDatabase = localStorage.getItem('vs1Db');
        //   if(getLasTDatabase){
        //     deleteStoreDatabase(getLasTDatabase).then(function(data) {
        //       swal({
        //       title: 'You are now Signed Out of all devices',
        //       text: "",
        //       type: 'success',
        //       showCancelButton: false,
        //       confirmButtonText: 'OK'
        //       }).then((result) => {
        //       if (result.value) {
        //         location.reload(true);
        //       }
        //       });
        //       $('.fullScreenSpin').css('display','none');
        //    }).catch(function (err) {
        //      swal({
        //      title: 'You are now Signed Out of all devices',
        //      text: "",
        //      type: 'success',
        //      showCancelButton: false,
        //      confirmButtonText: 'OK'
        //      }).then((result) => {
        //      if (result.value) {
        //        location.reload(true);
        //      }
        //      });
        //      $('.fullScreenSpin').css('display','none');
        //    });
        //   }else{
        //   swal({
        //   title: 'You are now Signed Out of all devices',
        //   text: "",
        //   type: 'success',
        //   showCancelButton: false,
        //   confirmButtonText: 'OK'
        //   }).then((result) => {
        //   if (result.value) {
        //     location.reload(true);
        //   }
        //   });
        //   $('.fullScreenSpin').css('display','none');
        // }
        // }else{
        //   getStoreToDelete(userLoginEmail).then(function(data) {
        //     swal({
        //     title: 'You are now Signed Out of all devices',
        //     text: "",
        //     type: 'success',
        //     showCancelButton: false,
        //     confirmButtonText: 'OK'
        //     }).then((result) => {
        //     if (result.value) {
        //       location.reload(true);
        //     }
        //     });
        //     $('.fullScreenSpin').css('display','none');
        //  }).catch(function (err) {
        //    swal({
        //    title: 'You are now Signed Out of all devices',
        //    text: "",
        //    type: 'success',
        //    showCancelButton: false,
        //    confirmButtonText: 'OK'
        //    }).then((result) => {
        //    if (result.value) {
        //      location.reload(true);
        //    }
        //    });
        //    $('.fullScreenSpin').css('display','none');
        //  });
        // }


    });
    $(".forgotPassword").click(function (e) {
      let employeeEmail = $("#email").val()||'';
        if(employeeEmail != ''){
          window.open('/forgotpassword?checktoken=' + employeeEmail + '', '_self');
        }else{
          window.open('/forgotpassword', '_self');
        }

    });
    $(".toggle-password").click(function () {
        $(this).toggleClass("fa-eye fa-eye-slash");
        var passwordSecret = $("#erppassword");

        if (passwordSecret.attr("type") == "password") {
            passwordSecret.attr("type", "text");
        } else {
            passwordSecret.attr("type", "password");
        }
    });

});
